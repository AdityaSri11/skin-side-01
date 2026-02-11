import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// This import is often necessary in Deno to ensure fetch behaves correctly in some environments
import "https://deno.land/x/xhr@0.1.0/mod.ts"; 

const LOVABLE_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// --- CORS Headers ---
// Essential for allowing your frontend (web app) to talk to this backend service.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- API Persona and Instructions ---
const MATCHING_PERSONA = `You are a specialized Clinical Trial Matching Assistant. Your task is to perform a strict eligibility check between the provided Patient Data and Trial Criteria. You MUST respond with a single JSON object conforming to the specified structure.`;

// --- The Main Server Handler ---
serve(async (req) => {
  // 1. Handle Preflight OPTIONS request (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. API Key Check
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY environment variable is not configured');
    }

    // 3. Input Parsing and Validation
    const { userProfile, trials } = await req.json();

    if (!userProfile || !trials) {
      return new Response(
        JSON.stringify({ error: 'Missing userProfile or trials data in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Matching user profile against', trials.length, 'trials');

    // 4. Construct the Detailed User Prompt for Gemini
    // Note: Age is calculated here from the date_of_birth field in userProfile.
    const userPrompt = `
      Analyze the User Profile below and compare it against the available Clinical Trials to find the best matches.

      --- USER PROFILE ---
      - Name: ${userProfile.first_name || 'N/A'} ${userProfile.last_name || 'N/A'}
      - **Age**: ${userProfile.date_of_birth ? Math.floor((new Date().getTime() - new Date(userProfile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Not provided'}
      - **Gender**: ${userProfile.gender || 'Not provided'}
      - **Primary Condition**: ${userProfile.primary_condition || 'Not provided'}
      - Condition Stage/Severity: ${userProfile.condition_stage_severity || 'Not provided'}
      - Current Medications: ${userProfile.current_prescription_medications || 'None'}
      - Allergies: ${userProfile.allergies || 'None'}
      - Existing Medical Conditions: ${userProfile.existing_medical_conditions || 'None'}
      - Previous Medical Conditions: ${userProfile.previous_medical_conditions || 'None'}

      --- AVAILABLE TRIALS ---
      ${trials.map((trial: any, idx: number) => `
      Trial ${idx + 1}:
      - Trial Number: ${trial.Number}
      - **Phase**: ${trial.Phase || 'N/A'}
      - **Product**: ${trial.Product || 'N/A'}
      - **Sponsor**: ${trial.Sponsor}
      - **Status**: ${trial.Status}
      - **Age Group**: ${trial.Age_group || 'N/A'}
      - **Gender**: ${trial.Gender || 'N/A'}
      - **Conditions**: ${trial.Conditions || 'N/A'}
      - **Description**: ${trial.Description || 'No description provided.'}
      `).join('\n')}

      --- INSTRUCTIONS ---
      1. Analyze the profile against each trial's criteria (Age, Gender, Conditions, Medications, Status).
      2. Assign a match score from 0-100 (60 is the minimum threshold for inclusion).
      3. Return ONLY trials that have a match score of 60 or higher.
      4. Ensure your final output is a single, valid JSON object that strictly follows the format below.

      --- REQUIRED JSON OUTPUT FORMAT ---
      {
        "matches": [
          {
            "trialNumber": "Trial Number from list",
            "trialName": "Short descriptive name of the trial based on its description/conditions",
            "product": "The product being tested (from the trial data)",
            "sponsor": "The sponsor of the trial (from the trial data)",
            "matchScore": 85,
            "matchReasons": ["Meets age and condition criteria.", "Trial is currently recruiting."],
            "concerns": ["Patient is on an exclusionary medication."],
            "recommendation": "Brief summary on next steps (e.g., 'Requires lab test verification.')"
          }
        ]
      }
    `;

    // 5. Construct the Native Gemini API Payload
    const payload = {
      // System Instruction sets the role/rules for the model (best practice in Gemini)
      systemInstruction: {
        parts: [{ text: MATCHING_PERSONA }]
      },
      // Contents holds the primary user query
      contents: [{ 
        role: 'user', 
        parts: [{ text: userPrompt }] 
      }],
      // Request for structured JSON output (no formal schema used here, relying on prompt instruction)
      config: {
          // Setting the temperature low encourages less creative, more direct responses
          temperature: 0.2
      }
    };

    // 6. Call the Gemini API Endpoint
    const response = await fetch(`${GEMINI_API_URL}?key=${LOVABLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 7. Handle API Errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status} - ${errorText.substring(0, 100)}...` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Extract and Parse AI Response
    const data = await response.json();
    
    // Native Gemini API content path
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Gemini returned an empty response or an error candidate.");
    }
    
    console.log('Raw AI Response:', aiResponse.substring(0, 500) + '...');

    // Robust JSON Parsing (to handle common LLM output formatting like markdown fences)
    let matchResults;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchResults = JSON.parse(jsonMatch[0]);
      } else {
        matchResults = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Error parsing final JSON from AI:', parseError);
      // Fallback: return raw response if JSON parse fails
      matchResults = {
        matches: [],
        error: "Failed to parse AI response as JSON.",
        rawResponse: aiResponse
      };
    }

    // 9. Send Final Response back to the Frontend
    return new Response(
      JSON.stringify(matchResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Catch all major operational errors (e.g., key missing, network errors)
    console.error('Critical error in server function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown internal server error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
