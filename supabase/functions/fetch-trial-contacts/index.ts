import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactInfo {
  location: string;
  email?: string;
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

    console.log(`Fetching contact data for trial: ${trialNumber}`);
    
    const irelandContacts: ContactInfo[] = [];
    
    // Step 1: Try CTIS first
    const ctisUrl = `https://euclinicaltrials.eu/ctis-public/view/${trialNumber}?lang=en`;
    try {
      const ctisResponse = await fetch(ctisUrl);
      if (ctisResponse.ok) {
        const ctisHtml = await ctisResponse.text();
        const $ = cheerio.load(ctisHtml);
        
        // Look for Ireland-specific sections in CTIS
        $('body').find('*').each((_, element) => {
          const text = $(element).text();
          if (text.toLowerCase().includes('ireland') || text.toLowerCase().includes('irish')) {
            // Extract emails near Ireland mentions
            const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
            const emails = text.match(emailPattern);
            
            // Extract site/hospital names
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            
            if (emails) {
              emails.forEach(email => {
                if (!irelandContacts.some(c => c.email === email) && 
                    !email.includes('example.com') && 
                    !email.includes('test.com')) {
                  // Try to find nearby site name
                  const siteNameMatch = text.match(/([A-Z][a-zA-Z\s]+(?:Hospital|Clinic|Centre|Center|Medical|University|Institute))/);
                  irelandContacts.push({
                    location: 'Ireland',
                    email: email.toLowerCase(),
                    siteName: siteNameMatch ? siteNameMatch[1].trim() : undefined
                  });
                }
              });
            }
          }
        });
        
        console.log(`Found ${irelandContacts.length} contacts from CTIS`);
      }
    } catch (error) {
      console.error('Error fetching CTIS:', error);
    }
    
    // Step 2: If no contacts found, try ClinicalTrials.gov
    if (irelandContacts.length === 0) {
      console.log('No contacts from CTIS, trying ClinicalTrials.gov');
      
      // Search for the trial by number
      const searchUrl = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(trialNumber)}&format=json`;
      
      try {
        const searchResponse = await fetch(searchUrl);
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          
          if (searchData.studies && searchData.studies.length > 0) {
            const study = searchData.studies[0];
            const protocolSection = study.protocolSection;
            
            // Extract Ireland contacts
            const contactsLocations = protocolSection?.contactsLocationsModule;
            
            if (contactsLocations?.locations) {
              for (const location of contactsLocations.locations) {
                if (location.country === 'Ireland' || location.city?.toLowerCase().includes('dublin') ||
                    location.city?.toLowerCase().includes('cork') || location.city?.toLowerCase().includes('galway')) {
                  
                  const contact: ContactInfo = {
                    location: `${location.city || ''}, Ireland`,
                    siteName: location.facility
                  };
                  
                  // Try to get contact info
                  if (location.contacts && location.contacts.length > 0) {
                    const primaryContact = location.contacts[0];
                    if (primaryContact.email) {
                      contact.email = primaryContact.email;
                    }
                    if (primaryContact.phone) {
                      contact.phone = primaryContact.phone;
                    }
                  }
                  
                  irelandContacts.push(contact);
                }
              }
            }
            
            // Also check central contacts if no location contacts found
            if (irelandContacts.length === 0 && contactsLocations?.centralContacts) {
              for (const contact of contactsLocations.centralContacts) {
                if (contact.email) {
                  irelandContacts.push({
                    location: 'Ireland (Central Contact)',
                    email: contact.email,
                    phone: contact.phone,
                    siteName: protocolSection?.identificationModule?.organization?.fullName
                  });
                }
              }
            }
            
            console.log(`Found ${irelandContacts.length} contacts from ClinicalTrials.gov`);
          }
        }
      } catch (error) {
        console.error('Error fetching ClinicalTrials.gov:', error);
      }
    }
    
    console.log(`Total Ireland contacts found: ${irelandContacts.length}`);
    
    return new Response(
      JSON.stringify({
        trialNumber,
        contacts: irelandContacts,
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
