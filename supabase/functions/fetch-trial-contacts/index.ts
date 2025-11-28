import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
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
    
    // Fetch data from CTIS API
    const apiUrl = `https://euclinicaltrials.eu/ctis-public-api/retrieve/${trialNumber}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`CTIS API returned status: ${response.status}`);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch trial data from CTIS',
          contacts: [],
          ctisUrl: `https://euclinicaltrials.eu/ctis-public/view/${trialNumber}?lang=en`,
          clinicalTrialsUrl: `https://clinicaltrials.gov/search?term=${encodeURIComponent(trialNumber)}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dataDump = await response.json();
    const contacts: ContactInfo[] = [];

    // Extract Dublin contacts using the exact schema provided
    const targetData = dataDump?.authorizedApplication?.authorizedPartsII;
    
    if (targetData && targetData[0]?.trialSites) {
      for (const site of targetData[0].trialSites) {
        const city = site?.organisationAddressInfo?.address?.city;
        
        if (city && city.startsWith('Dublin')) {
          const name = site?.organisationAddressInfo?.organisation?.name || 'N/A';
          const email = site?.personInfo?.email || 'N/A';
          const phone = site?.personInfo?.telephone || 'N/A';

          contacts.push({ name, email, phone });
          console.log(`Found Dublin contact: ${name}`);
        }
      }
    }

    console.log(`Total Dublin contacts found: ${contacts.length}`);
    
    return new Response(
      JSON.stringify({
        trialNumber,
        contacts,
        ctisUrl: `https://euclinicaltrials.eu/ctis-public/view/${trialNumber}?lang=en`,
        clinicalTrialsUrl: `https://clinicaltrials.gov/search?term=${encodeURIComponent(trialNumber)}`
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
