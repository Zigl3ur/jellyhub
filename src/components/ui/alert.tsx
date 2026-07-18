import { cn } from "@sglara/cn";

interface AlertProps {
  message: string;
  title?: string;
  type?: "destructive";
}

export function Alert({ type, title, message }: AlertProps) {
  return (
    <div
      className={cn(
        "px-3 py-2 rounded",
        type === "destructive" &&
          "bg-destructive/30 text-destructive-foreground border border-destructive/50",
      )}
    >
      {title && <h3 className="font-semibold">{title}</h3>}
      <p className="font-light text-sm">{message}</p>
    </div>
  );
}
