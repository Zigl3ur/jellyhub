import { cn } from "@sglara/cn";

interface AlertProps {
  message: string;
  title?: string;
  type?: "destructive" | "default";
}

const variant: Record<NonNullable<AlertProps["type"]>, string> = {
  default: "",
  destructive:
    "bg-destructive/30 text-destructive-foreground border border-destructive/50",
};

export function Alert({ type = "default", title, message }: AlertProps) {
  return (
    <div className={cn("px-3 py-2 rounded", variant[type])}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <p className="font-light text-sm">{message}</p>
    </div>
  );
}
