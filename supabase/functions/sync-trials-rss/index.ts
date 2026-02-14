import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = "https://rclqvwqlquldwmgttltq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbHF2d3FscXVsZHdtZ3R0bHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc4NzMyMCwiZXhwIjoyMDcyMzYzMzIwfQ.KMnVOi4EkWgI0RGZpYqyTG1H4yfhcCzDfXY4Rjf1gOE";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // RSS feed URL
    const rssUrl = "https://euclinicaltrials.eu/ctis-public-api/rss/updates.rss?search_criteria=%7B%22containAny%22%3A%22psoriasis%2C%20eczema%2C%20acne%2C%20hidradenitis%2C%20melanoma%22%2C%22msc%22%3A%5B372%5D%2C%22mscStatus%22%3A%5B2%2C3%2C4%2C5%5D%7D";
    
    console.log('Fetching RSS feed...');
    const response = await fetch(rssUrl);
    const xmlText = await response.text();
    
    // Parse XML manually (simple approach for RSS)
    const items = xmlText.match(/<item>(.*?)<\/item>/gs) || [];
    console.log(`Found ${items.length} items in RSS feed`);
    
    const acceptableStatuses = [
      'Ongoing, recruitment ended',
      'Ongoing, recruiting', 
      'Authorised, recruiting',
      'Authorised, not recruiting'
    ];

    const processedTrials: any[] = [];

    for (const item of items) {
      try {
        // Extract title and description
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s);
        const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
        
        if (!descMatch?.[1]) continue;
        
        const description = descMatch[1];
        const title = titleMatch?.[1] || 'Not available';
        
        // Extract trial number
        const trialNumberMatch = description.match(/<b>Trial number<\/b>:([^<]*)<br \/>/);
        const trialNumber = trialNumberMatch?.[1]?.trim();
        
        if (!trialNumber) continue;

        // Extract medical conditions
        const conditionsMatch = description.match(/<b>Medical conditions<\/b>:([^<]*)<br \/>/);
        const conditions = conditionsMatch?.[1]?.trim() || 'Not available';

        // Extract age group
        const ageMatch = description.match(/<b>Age of participants<\/b>:([^<]*)<br \/>/);
        const ageGroup = ageMatch?.[1]?.trim() || 'Not available';

        // Extract product
        const productMatch = description.match(/<b>Trial product<\/b>:([^<]*)<br \/>/);
        const product = productMatch?.[1]?.trim() || 'Not available';

        // Extract status for Ireland (or general status)
        const statusMatch = description.match(/<b>Status in each country<\/b>:([^<]*)<br \/>/);
        let status = 'Not available';
        
        if (statusMatch) {
          const statusText = statusMatch[1].trim();
          const irelandMatch = statusText.match(/Ireland:\s*([^,]*)/);
          status = irelandMatch?.[1]?.trim() || statusText.split(',')[0]?.trim() || 'Not available';
        }

        // Extract phase
        const phaseMatch = description.match(/<b>Phase<\/b>:([^<]*)<br \/>/);
        const phase = phaseMatch?.[1]?.trim() || 'Not available';

        // Extract sponsor
        const sponsorMatch = description.match(/<b>Sponsor<\/b>:([^<]*)<br \/>/);
        const sponsor = sponsorMatch?.[1]?.trim() || 'Not available';

        // Extract endpoint
        const endpointMatch = description.match(/<b>Primary endpoint<\/b>:([^<]*)<br \/>/);
        const endpoint = endpointMatch?.[1]?.trim() || 'Not available';

        // Extract gender (assume all genders if not specified)
        const gender = 'Female, Male';

        const trialData = {
          Number: trialNumber,
          Description: title,
          Status: status,
          Age_group: ageGroup,
          Gender: gender,
          Conditions: conditions,
          Phase: phase,
          Product: product,
          Endpoint: endpoint,
          Sponsor: sponsor
        };

        processedTrials.push(trialData);

        // Check if trial exists in database
        const { data: existingTrial } = await supabase
          .from('derm')
          .select('*')
          .eq('Number', trialNumber)
          .single();

        if (existingTrial) {
          // Update existing trial
          const { error: updateError } = await supabase
            .from('derm')
            .update(trialData)
            .eq('Number', trialNumber);
          
          if (updateError) {
            console.error('Error updating trial:', updateError);
          } else {
            console.log(`Updated trial: ${trialNumber}`);
          }
        } else {
          // Insert new trial only if status is acceptable
          if (acceptableStatuses.includes(status)) {
            const { error: insertError } = await supabase
              .from('derm')
              .insert(trialData);
            
            if (insertError) {
              console.error('Error inserting trial:', insertError);
            } else {
              console.log(`Inserted new trial: ${trialNumber}`);
            }
          }
        }
      } catch (itemError) {
        console.error('Error processing item:', itemError);
        continue;
      }
    }

    // Delete trials with unacceptable statuses
    const { error: deleteError } = await supabase
      .from('derm')
      .delete()
      .not('Status', 'in', `(${acceptableStatuses.map(s => `"${s}"`).join(',')})`);

    if (deleteError) {
      console.error('Error deleting trials:', deleteError);
    } else {
      console.log('Deleted trials with unacceptable statuses');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedTrials.length,
        message: 'RSS sync completed successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Error in sync-trials-rss function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});