import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function fetchTranscript(videoId: string): Promise<string> {
  // Use a public transcript API
  const res = await fetch(
    `https://yt-api.p.sievedata.com/v1/transcript?video_id=${videoId}`,
    { headers: { "X-API-Key": "public" } }
  );

  if (!res.ok) {
    // Fallback: try another public API
    const res2 = await fetch(
      `https://youtubetranscript.com/api/transcript?video_id=${videoId}`
    );
    if (!res2.ok) {
      throw new Error("TRANSCRIPT_UNAVAILABLE");
    }
    const data2 = await res2.json();
    if (Array.isArray(data2)) {
      return data2.map((item: any) => {
        const time = item.start ? `[${formatTime(item.start)}] ` : "";
        return time + (item.text || "");
      }).join("\n");
    }
    throw new Error("TRANSCRIPT_UNAVAILABLE");
  }

  const data = await res.json();
  if (data.transcript && Array.isArray(data.transcript)) {
    return data.transcript
      .map((item: any) => {
        const time = item.start !== undefined ? `[${formatTime(item.start)}] ` : "";
        return time + (item.text || "");
      })
      .join("\n");
  }
  throw new Error("TRANSCRIPT_UNAVAILABLE");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const languageMap: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, language = "en" } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube URL. Please paste a valid YouTube video link." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let transcript: string;
    try {
      transcript = await fetchTranscript(videoId);
    } catch {
      return new Response(
        JSON.stringify({
          error: "Could not fetch transcript for this video. The video may not have captions available.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long transcripts
    const maxChars = 30000;
    const truncated = transcript.length > maxChars ? transcript.slice(0, maxChars) + "\n[...transcript truncated]" : transcript;

    const lang = languageMap[language] || "English";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a YouTube video summarizer. Respond ONLY in ${lang}. Return a JSON object with this exact structure:
{
  "title": "Video title or topic inferred from transcript",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "timestamps": [{"time": "0:00", "label": "description"}, ...],
  "coreTakeaway": "One-line core insight from the video"
}

Rules:
- Extract exactly 5 key points
- Extract 3-6 important timestamps with brief labels
- Keep the core takeaway to one clear sentence
- All text must be in ${lang}
- Return ONLY valid JSON, no markdown or extra text`,
            },
            {
              role: "user",
              content: `Summarize this YouTube video transcript:\n\n${truncated}`,
            },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from AI response (handle markdown code blocks)
    let summary;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      summary = JSON.parse(jsonStr);
    } catch {
      summary = {
        title: "Video Summary",
        keyPoints: [content],
        timestamps: [],
        coreTakeaway: "See key points above.",
      };
    }

    return new Response(
      JSON.stringify({ videoId, transcript: truncated, summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("summarize error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
