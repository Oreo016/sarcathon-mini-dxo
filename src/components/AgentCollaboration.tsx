import { Activity, Search, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Agent {
  name: string;
  status: string;
  icon: "symptom" | "research" | "diagnosis";
}

interface AgentCollaborationProps {
  agents: Agent[];
  confidence?: number;
}

const iconMap = {
  symptom: Activity,
  research: Search,
  diagnosis: Brain,
};

export const AgentCollaboration = ({ agents, confidence }: AgentCollaborationProps) => {
  return (
    <Card className="bg-gradient-subtle border-primary/20 p-4 space-y-3 animate-fade-in shadow-elevated">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary animate-pulse-glow" />
        <h3 className="text-sm font-semibold text-primary">AI Agents Collaborating</h3>
      </div>

      <div className="space-y-2">
        {agents.map((agent, index) => {
          const Icon = iconMap[agent.icon];
          return (
            <div key={index} className="flex items-center gap-3 text-sm">
              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-foreground">{agent.name}</span>
                <span className="text-muted-foreground"> → {agent.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {confidence !== undefined && (
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Diagnosis Confidence</span>
            <span className="font-semibold text-primary">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>
      )}
    </Card>
  );
};
