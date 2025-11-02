import { Brain, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ReasoningCardProps {
  reasoning: string;
  reference?: {
    source: string;
    snippet: string;
  };
}

export const ReasoningCard = ({ reasoning, reference }: ReasoningCardProps) => {
  return (
    <Card className="border-l-4 border-l-primary bg-secondary/50 p-4 space-y-3 animate-fade-in shadow-card">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">AI Reasoning</p>
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
      </div>

      {reference && (
        <div className="flex items-start gap-3 pt-3 border-t border-border">
          <div className="mt-1">
            <BookOpen className="w-5 h-5 text-medical-info" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-semibold text-medical-info uppercase tracking-wide">
              Reference: {reference.source}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{reference.snippet}"</p>
          </div>
        </div>
      )}
    </Card>
  );
};
