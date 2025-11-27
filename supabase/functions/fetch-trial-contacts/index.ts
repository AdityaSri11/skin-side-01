import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`Generating links for trial: ${trialNumber}`);
    
    // CTIS URL
    const ctisUrl = `https://euclinicaltrials.eu/ctis-public/view/${trialNumber}?lang=en`;
    
    // ClinicalTrials.gov URL
    const clinicalTrialsUrl = `https://clinicaltrials.gov/search?term=${encodeURIComponent(trialNumber)}`;
    
    return new Response(
      JSON.stringify({
        trialNumber,
        ctisUrl,
        clinicalTrialsUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error generating trial links:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate trial links'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
