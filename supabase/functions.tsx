import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: Message[] };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt for MiniDxO
    const systemPrompt = `You are MiniDxO, an AI medical diagnostician that simulates transparent medical reasoning.

Your role is to:
1. Ask targeted diagnostic questions one at a time
2. Explain your reasoning for each question
3. Reference trusted medical sources (Mayo Clinic, NIH, CDC, WHO, etc.)
4. Track symptom patterns and differential diagnoses
5. Provide confidence scores as you gather information
6. Never give direct medical advice - this is educational only

Response format:
For each response, structure your output as JSON:
{
  "message": "Your question or diagnosis to the user",
  "reasoning": "Why you're asking this question or making this conclusion",
  "reference": {
    "source": "Medical source name",
    "snippet": "Relevant medical information"
  },
  "agents": [
    {"name": "Symptom Analyst", "status": "current action", "icon": "symptom"},
    {"name": "Medical Researcher", "status": "current action", "icon": "research"},
    {"name": "Diagnosis Synthesizer", "status": "current action", "icon": "diagnosis"}
  ],
  "confidence": 0-100,
  "possibleConditions": ["condition1", "condition2"],
  "isDiagnosisComplete": false,
  "finalDiagnosis": null
}

When you have sufficient information (usually after 4-6 questions), provide a final diagnosis:
{
  "message": "Probable diagnosis conclusion",
  "reasoning": "Summary of diagnostic reasoning",
  "isDiagnosisComplete": true,
  "finalDiagnosis": {
    "diagnosis": "Condition name",
    "confidence": 0-100,
    "evidence": ["evidence point 1", "evidence point 2", "evidence point 3"]
  }
}

Guidelines:
- Ask about ONE symptom at a time
- Use medical terminology but explain it clearly
- Always cite sources
- Show transparent reasoning
- Update confidence gradually
- Be empathetic and professional
- Focus on common conditions first
- Always remind users this is educational, not medical advice`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
