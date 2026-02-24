import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoSummary } from "@/components/VideoSummary";
import { ChatSection } from "@/components/ChatSection";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import vidsenseLogo from "@/assets/vidsense-logo.png";

interface SummaryData {
  title: string;
  keyPoints: string[];
  timestamps: { time: string; label: string }[];
  coreTakeaway: string;
}

const Index = () => {
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url.trim()) {
      toast({ title: "Please enter a YouTube URL", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSummary(null);
    setVideoId(null);
    setTranscript(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ url: url.trim(), language }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      setVideoId(data.videoId);
      setSummary(data.summary);
      setTranscript(data.transcript);
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src={vidsenseLogo} alt="VidSense" className="h-10 w-10 rounded-lg" />
          <div>
            <h1 className="text-xl font-bold text-foreground">VidSense</h1>
            <p className="text-xs text-muted-foreground">AI Research Assistant for YouTube</p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        {!summary && !loading && (
          <section className="text-center py-12 space-y-4 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Summarize any YouTube video</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste a YouTube link and get instant AI-powered summaries with key points, timestamps, and follow-up Q&A — in English, Hindi, or Kannada.
            </p>
          </section>
        )}

        {/* Input Section */}
        <section className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSummarize();
              }}
            />
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full sm:w-[160px] h-12">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
              <SelectItem value="kn">🇮🇳 Kannada</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSummarize}
            disabled={loading}
            className="gradient-bg border-0 text-primary-foreground h-12 px-6 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Summarizing...
              </>
            ) : (
              "Summarize"
            )}
          </Button>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        )}

        {/* Summary */}
        {videoId && summary && (
          <VideoSummary videoId={videoId} summary={summary} />
        )}

        {/* Q&A Chat */}
        {transcript && (
          <ChatSection transcript={transcript} language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          VidSense — AI-powered YouTube video summarizer
        </div>
      </footer>
    </div>
  );
};

export default Index;
