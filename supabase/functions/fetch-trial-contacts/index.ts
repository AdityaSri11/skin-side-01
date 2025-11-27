import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactInfo {
  location: string;
  email: string;
  phone?: string;
  siteName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trialNumber } = await req.json();
    
    if (!trialNumber) {
      return new Response(
        JSON.stringify({ error: 'Trial number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching CTIS data for trial: ${trialNumber}`);
    
    // Fetch the CTIS page
    const ctisUrl = `https://euclinicaltrials.eu/ctis-public/view/${trialNumber}?lang=en`;
    const response = await fetch(ctisUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CTIS page: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`Fetched HTML, length: ${html.length}`);
    
    // Extract Ireland contact information
    const irelandContacts: ContactInfo[] = [];
    
    // Look for Ireland sections with emails
    // Pattern 1: Look for Ireland followed by email addresses
    const irelandPattern = /Ireland[^<]*?(?:email|contact|e-mail)[^<]*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
    let match;
    
    while ((match = irelandPattern.exec(html)) !== null) {
      if (match[1]) {
        irelandContacts.push({
          location: 'Ireland',
          email: match[1].toLowerCase()
        });
      }
    }
    
    // Pattern 2: Look for email addresses near Ireland mentions
    const irelandIndex = html.toLowerCase().indexOf('ireland');
    if (irelandIndex !== -1) {
      // Search within 5000 characters after "Ireland" mention
      const searchRange = html.substring(irelandIndex, irelandIndex + 5000);
      const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      let emailMatch;
      
      while ((emailMatch = emailPattern.exec(searchRange)) !== null) {
        const email = emailMatch[1].toLowerCase();
        // Avoid duplicate emails
        if (!irelandContacts.some(c => c.email === email)) {
          irelandContacts.push({
            location: 'Ireland',
            email: email
          });
        }
      }
    }
    
    // Pattern 3: Look for structured data or JSON that might contain Ireland contacts
    const jsonPattern = /"country"\s*:\s*"(?:IE|Ireland)"[^}]*"email"\s*:\s*"([^"]+)"/gi;
    while ((match = jsonPattern.exec(html)) !== null) {
      if (match[1] && !irelandContacts.some(c => c.email === match[1].toLowerCase())) {
        irelandContacts.push({
          location: 'Ireland',
          email: match[1].toLowerCase()
        });
      }
    }
    
    // Remove duplicates and filter out common false positives
    const uniqueContacts = irelandContacts
      .filter((contact, index, self) => 
        index === self.findIndex(c => c.email === contact.email)
      )
      .filter(contact => 
        !contact.email.includes('example.com') && 
        !contact.email.includes('test.com') &&
        contact.email.includes('@')
      );
    
    console.log(`Found ${uniqueContacts.length} Ireland contacts for trial ${trialNumber}`);
    
    return new Response(
      JSON.stringify({
        trialNumber,
        contacts: uniqueContacts,
        ctisUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error fetching trial contacts:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch trial contacts',
        contacts: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
