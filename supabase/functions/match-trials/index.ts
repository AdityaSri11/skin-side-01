import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { userProfile, trials } = await req.json();

    if (!userProfile || !trials) {
      return new Response(
        JSON.stringify({ error: 'Missing userProfile or trials data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Matching user profile against', trials.length, 'trials');

    const systemPrompt = `You are a clinical trial matching expert. Analyze the user's health profile and compare it against available clinical trials to find the best matches.

Consider the following criteria:
- Age eligibility (user age vs trial age_group)
- Gender requirements (user gender vs trial gender)
- Condition match (user's primary_condition vs trial conditions)
- Medical history compatibility
- Current medications and potential conflicts
- Overall health status

Return a JSON array of matching trials with match scores (0-100) and detailed reasons for the match.`;

    const userPrompt = `User Profile:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Age: ${userProfile.date_of_birth ? Math.floor((new Date().getTime() - new Date(userProfile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- Primary Condition: ${userProfile.primary_condition || 'Not provided'}
- Condition Stage/Severity: ${userProfile.condition_stage_severity || 'Not provided'}
- Current Medications: ${userProfile.current_prescription_medications || 'None'}
- Allergies: ${userProfile.allergies || 'None'}
- Medical Conditions: ${userProfile.existing_medical_conditions || 'None'}
- Previous Medical Conditions: ${userProfile.previous_medical_conditions || 'None'}

Available Trials:
${trials.map((trial: any, idx: number) => `
Trial ${idx + 1}:
- Trial Number: ${trial.Number}
- Phase: ${trial.Phase || 'Not specified'}
- Product: ${trial.Product || 'Not specified'}
- Sponsor: ${trial.Sponsor}
- Description: ${trial.Description || 'No description'}
- Status: ${trial.Status}
- Age Group: ${trial.Age_group || 'Not specified'}
- Gender: ${trial.Gender || 'Not specified'}
- Conditions: ${trial.Conditions || 'Not specified'}
- Endpoint: ${trial.Endpoint || 'Not specified'}
`).join('\n')}

Analyze each trial and return ONLY matching trials (score >= 60) in this JSON format:
{
  "matches": [
    {
      "trialNumber": "trial number",
      "matchScore": 85,
      "matchReasons": ["reason 1", "reason 2", "reason 3"],
      "concerns": ["concern 1 if any"],
      "recommendation": "brief recommendation"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    let matchResults;
    try {
      // Try to extract JSON from the response (AI might add markdown formatting)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchResults = JSON.parse(jsonMatch[0]);
      } else {
        matchResults = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      matchResults = {
        matches: [],
        rawResponse: aiResponse
      };
    }

    return new Response(
      JSON.stringify(matchResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in match-trials function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
