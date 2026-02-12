// AI MATCHING 

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
// Note: Ensure your model name is correct (e.g., gemini-1.5-flash) 
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userProfile, trials } = await req.json();

    const userPrompt = `
      Compare this Patient against the Trials provided.
      PATIENT: ${userProfile.first_name}, Condition: ${userProfile.primary_condition}.
      TRIALS: ${JSON.stringify(trials)}
      
      CRITICAL INSTRUCTIONS:
      1. Calculate a matchScore (0-100) for every trial.
      2. FILTERING LOGIC:
         - Only include trials with matchScore >= 65.
         - IF NO TRIALS reach 65, return ONLY the single trial with the highest matchScore.
      3. For any matchScore below 65, start the "recommendation" with: "This is your best potential fit, though it did not meet all strict criteria."

      OUTPUT FORMAT: Return ONLY a valid JSON object.
      {
        "highestPercentMatch": number,
        "matches": [ { "trialNumber": "string", "matchScore": number, "recommendation": "string" } ]
      }
    `;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { 
        temperature: 0.1, 
        responseMimeType: "application/json" 
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Gemini API: ${data.error.message}`);
    }

    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponseText) throw new Error("AI returned an empty response.");

    // Parse AI response
    let validatedJson = JSON.parse(aiResponseText);

    /**
     * BACKEND FAIL-SAFE FILTERING
     * Ensures that even if the AI ignores the 65% rule, the frontend doesn't.
     */
    const aboveThreshold = validatedJson.matches.filter(m => m.matchScore >= 65);
    
    if (aboveThreshold.length > 0) {
      validatedJson.matches = aboveThreshold;
    } else if (validatedJson.matches.length > 0) {
      // If none are >= 65, find the absolute highest one and return only that
      const highest = validatedJson.matches.reduce((prev, current) => 
        (prev.matchScore > current.matchScore) ? prev : current
      );
      validatedJson.matches = [highest];
    }

    return new Response(JSON.stringify(validatedJson), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Server Error:', error.message);
    // Return a structured error object so the frontend doesn't crash
    return new Response(JSON.stringify({ 
      error: error.message,
      highestPercentMatch: 0,
      matches: [] 
    }), { 
      status: 200, // Returning 200 with empty matches is safer for some frontends
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});


// CREATING USERS 
import { createClient } from "npm:@supabase/supabase-js@2.33.0";

interface ProfilePayload {
  full_name?: string;
  avatar_url?: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/Bearer\s+/i, '');
    if (!token) return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await req.json();
    const profile: ProfilePayload = body.profile;

    if (!profile) return new Response(JSON.stringify({ error: 'Missing profile in body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Initialize Supabase client with service role to call the secure RPC
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Verify the user's token to extract user id
    const { data: user, error: userErr } = await supabase.auth.getUser(token);
    if (userErr) return new Response(JSON.stringify({ error: 'Invalid token', details: userErr.message }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const user_id = user?.data?.user?.id;
    if (!user_id) return new Response(JSON.stringify({ error: 'Could not determine user id' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    // Call the SECURITY DEFINER RPC
    const rpcBody = { profile, _user_id: user_id };
    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_user_profile_secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify(rpcBody),
    });

    const rpcJson = await rpcRes.json();
    if (!rpcRes.ok) return new Response(JSON.stringify({ error: 'RPC failed', details: rpcJson }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ success: true, profile: rpcJson }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
