  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Clock, Lightbulb } from "lucide-react";

interface Timestamp {
  time: string;
  label: string;
}

interface SummaryData {
  title: string;
  keyPoints: string[];
  timestamps: Timestamp[];
  coreTakeaway: string;
}

interface VideoSummaryProps {
  videoId: string;
  summary: SummaryData;
}

export function VideoSummary({ videoId, summary }: VideoSummaryProps) {
  const openTimestamp = (time: string) => {
    const parts = time.split(":").map(Number);
    const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
    window.open(`https://youtube.com/watch?v=${videoId}&t=${seconds}s`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Video Embed */}
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={summary.title}
        />
      </div>

      <h2 className="text-2xl font-bold text-foreground">{summary.title}</h2>

      {/* Key Points */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5 text-primary" />
            <span className="gradient-text">Key Points</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-foreground">
                <span className="gradient-bg text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Timestamps */}
      {summary.timestamps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              <span className="gradient-text">Important Timestamps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {summary.timestamps.map((ts, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
                  onClick={() => openTimestamp(ts.time)}
                >
                  ⏱ {ts.time} — {ts.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Takeaway */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span className="gradient-text">Core Takeaway</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium text-lg">{summary.coreTakeaway}</p>
        </CardContent>
      </Card>
    </div>
  );
}
