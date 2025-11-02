export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-2xl shadow-card max-w-[80px]">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "200ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
};
