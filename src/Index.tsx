import { useState, useRef, useEffect } from "react";
import { Send, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ReasoningCard } from "@/components/ReasoningCard";
import { AgentCollaboration } from "@/components/AgentCollaboration";
import { DiagnosisSummary } from "@/components/DiagnosisSummary";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIResponse {
  message: string;
  reasoning?: string;
  reference?: { source: string; snippet: string };
  agents?: Array<{ name: string; status: string; icon: "symptom" | "research" | "diagnosis" }>;
  confidence?: number;
  isDiagnosisComplete?: boolean;
  finalDiagnosis?: {
    diagnosis: string;
    confidence: number;
    evidence: string[];
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse, isLoading]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm MiniDxO, your AI diagnostic assistant. I'll help analyze your symptoms through a structured conversation. What symptoms are you experiencing today?",
        },
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setCurrentResponse(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Reached",
            description: "Please wait a moment before sending another message.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiResponse: AIResponse = JSON.parse(data.response);

      setCurrentResponse(aiResponse);
      setMessages([...updatedMessages, { role: "assistant", content: aiResponse.message }]);

      if (aiResponse.isDiagnosisComplete) {
        setDiagnosisComplete(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm MiniDxO, your AI diagnostic assistant. I'll help analyze your symptoms through a structured conversation. What symptoms are you experiencing today?",
      },
    ]);
    setCurrentResponse(null);
    setDiagnosisComplete(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-medical rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">MiniDxO</h1>
              <p className="text-sm text-muted-foreground">The Transparent AI Diagnostician</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <MessageBubble key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-secondary/30">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms..."
                  disabled={isLoading || diagnosisComplete}
                  className="flex-1 bg-background"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || diagnosisComplete}
                  className="px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reasoning Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {currentResponse?.agents && (
              <AgentCollaboration 
                agents={currentResponse.agents} 
                confidence={currentResponse.confidence}
              />
            )}

            {currentResponse?.reasoning && (
              <ReasoningCard 
                reasoning={currentResponse.reasoning}
                reference={currentResponse.reference}
              />
            )}

            {diagnosisComplete && currentResponse?.finalDiagnosis && (
              <DiagnosisSummary
                diagnosis={currentResponse.finalDiagnosis.diagnosis}
                confidence={currentResponse.finalDiagnosis.confidence}
                evidence={currentResponse.finalDiagnosis.evidence}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Educational simulation only • Not for medical diagnosis • Consult healthcare professionals
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
