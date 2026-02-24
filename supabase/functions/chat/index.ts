import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const languageMap: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
};

const commandPrompts: Record<string, string> = {
  "/summary": "Provide a concise summary of the entire video in 3-4 paragraphs. Cover all the main topics discussed.",
  "/deepdive": "Provide an in-depth, detailed analysis of the video content. Cover every major topic discussed with explanations, examples mentioned, and nuances. Be thorough and comprehensive.",
  "/actionpoints": "Extract all actionable items, tasks, recommendations, and practical steps mentioned in the video. Format them as a numbered list with clear, specific actions the viewer can take.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, transcript, history = [], language = "en" } = await req.json();

    if (!question || !transcript) {
      return new Response(
        JSON.stringify({ error: "Question and transcript are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lang = languageMap[language] || "English";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Check if it's a command
    const cmd = question.trim().toLowerCase();
    const userContent = commandPrompts[cmd] || question;

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that answers questions about a YouTube video. You MUST respond in ${lang}.

Here is the video transcript:
${transcript.slice(0, 25000)}

Rules:
- Only answer based on the transcript content
- If the question is not covered in the video, politely say: "This topic is not covered in the video."
- Keep answers concise and helpful
- Always respond in ${lang}
- Use markdown formatting for readability
- For action points, use numbered lists
- For deep dives, use headers and sections`,
      },
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: userContent },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
