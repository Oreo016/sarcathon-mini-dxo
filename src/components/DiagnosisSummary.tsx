import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DiagnosisSummaryProps {
  diagnosis: string;
  confidence: number;
  evidence: string[];
  onReset: () => void;
}

export const DiagnosisSummary = ({ diagnosis, confidence, evidence, onReset }: DiagnosisSummaryProps) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 70) return "text-medical-success";
    if (conf >= 50) return "text-medical-warning";
    return "text-destructive";
  };

  return (
    <Card className="bg-card border-2 border-primary/30 p-6 space-y-4 animate-fade-in-up shadow-elevated">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-8 h-8 text-medical-success" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Probable Diagnosis</h2>
          <p className="text-2xl font-bold text-primary mt-1">{diagnosis}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <AlertCircle className={`w-5 h-5 ${getConfidenceColor(confidence)}`} />
        <span className="text-sm text-muted-foreground">Confidence Score:</span>
        <span className={`text-xl font-bold ${getConfidenceColor(confidence)}`}>{confidence}%</span>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Key Evidence</h3>
        </div>
        <ul className="space-y-2 pl-7">
          {evidence.map((item, index) => (
            <li key={index} className="text-sm text-foreground leading-relaxed">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 flex items-center gap-3">
        <Button onClick={onReset} className="flex-1">
          🔄 Start New Diagnosis
        </Button>
      </div>

      <div className="pt-2 text-xs text-muted-foreground text-center border-t border-border">
        <p className="italic">
          ⚠️ This is an AI simulation for educational purposes only. Always consult a qualified healthcare professional for medical advice.
        </p>
      </div>
    </Card>
  );
};
