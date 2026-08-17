type FeedbackMessageProps = { children: string; type: "error" | "success" };

export function FeedbackMessage({ children, type }: FeedbackMessageProps) {
  return (
    <p className={type === "error" ? "alert-error" : "alert-success"}>
      {children}
    </p>
  );
}
