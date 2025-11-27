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
    
    // Extract Ireland contact information - CTIS pages have contact info in specific sections
    const irelandContacts: ContactInfo[] = [];
    
    // CTIS pages contain contact information in structured format
    // Look for patterns like: Ireland...email...address or Ireland...contact
    
    // Pattern 1: Extract all email addresses from the page first
    const allEmailsPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const allEmails = [...html.matchAll(allEmailsPattern)].map(m => m[1].toLowerCase());
    console.log(`Found ${allEmails.length} total email addresses on page`);
    
    // Pattern 2: Find sections that mention Ireland
    // Look for "Ireland" followed by any content, then an email within reasonable proximity
    const irelandSections = [];
    let startIndex = 0;
    while (true) {
      const irelandIndex = html.toLowerCase().indexOf('ireland', startIndex);
      if (irelandIndex === -1) break;
      
      // Extract 3000 chars before and 3000 after Ireland mention for context
      const sectionStart = Math.max(0, irelandIndex - 3000);
      const sectionEnd = Math.min(html.length, irelandIndex + 3000);
      const section = html.substring(sectionStart, sectionEnd);
      irelandSections.push(section);
      
      startIndex = irelandIndex + 1;
    }
    
    console.log(`Found ${irelandSections.length} sections mentioning Ireland`);
    
    // Pattern 3: Extract emails from Ireland sections
    for (const section of irelandSections) {
      const emailMatches = section.matchAll(allEmailsPattern);
      for (const match of emailMatches) {
        const email = match[1].toLowerCase();
        // Filter out common non-contact emails
        if (!email.includes('example.com') && 
            !email.includes('test.com') &&
            !email.includes('noreply') &&
            !email.includes('no-reply') &&
            !irelandContacts.some(c => c.email === email)) {
          irelandContacts.push({
            location: 'Ireland',
            email: email
          });
        }
      }
    }
    
    // Pattern 4: Look for "IE" country code near emails (Ireland's ISO code)
    const iePattern = /\bIE\b.{0,500}?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}).{0,500}?\bIE\b/gi;
    let match;
    while ((match = iePattern.exec(html)) !== null) {
      const email = (match[1] || match[2])?.toLowerCase();
      if (email && 
          !email.includes('example.com') && 
          !email.includes('test.com') &&
          !irelandContacts.some(c => c.email === email)) {
        irelandContacts.push({
          location: 'Ireland',
          email: email
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
