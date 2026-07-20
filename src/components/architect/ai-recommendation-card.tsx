import { Sparkles, Check, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { AiRecommendation } from "@/app/models/architect";

const impactTone: Record<AiRecommendation["impact"], string> = {
  Low: "text-muted-foreground",
  Medium: "text-info",
  High: "text-warning-foreground",
  Critical: "text-destructive",
};

export function AiRecommendationCard({ rec }: { rec: AiRecommendation }) {
  return (
    <Card className="rounded-2xl border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm">{rec.title}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{rec.summary}</p>
            </div>
          </div>
          <Badge variant="outline" className={`rounded-full text-[10px] ${impactTone[rec.impact]}`}>
            {rec.impact}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Confidence</span>
            <span className="tabular-nums">{rec.confidence}%</span>
          </div>
          <Progress value={rec.confidence} className="h-1.5" />
        </div>
        {rec.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {rec.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border bg-muted/40 p-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
                <div className="text-xs font-semibold">{m.value}</div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed">{rec.explanation}</p>
        {rec.actions.length > 0 && (
          <ul className="space-y-1">
            {rec.actions.map((a) => (
              <li key={a} className="flex items-center gap-2 text-xs">
                <span className="h-1 w-1 rounded-full bg-primary" /> {a}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Recommendation accepted", { description: rec.title })}
          >
            <Check className="h-3.5 w-3.5" /> Accept
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl"
            onClick={() => toast.message("Dismissed", { description: rec.title })}
          >
            <X className="h-3.5 w-3.5" /> Dismiss
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl"
            onClick={() => toast.info("Report generated")}
          >
            <FileText className="h-3.5 w-3.5" /> Generate report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
