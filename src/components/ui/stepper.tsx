import { cn } from "@sglara/cn";
import { IconCheck } from "@tabler/icons-react";
import { createContext, useContext } from "react";
import Button from "./button";
import type { PropsWithChildren } from "react";

interface StepperContextProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextProps | undefined>(
  undefined,
);

function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepperContext must be used within a StepperContext");
  }
  return context;
}

interface StepperItemContextProps {
  value: number;
  disabled?: boolean;
}

const StepperItemContext = createContext<StepperItemContextProps | undefined>(
  undefined,
);

function useStepperItemContext() {
  const context = useContext(StepperItemContext);
  if (!context) {
    throw new Error(
      "useStepperItemContext must be used within a StepperItemProvider",
    );
  }
  return context;
}

interface StepperProps extends PropsWithChildren {
  value: number;
  onValueChange: (step: number) => void;
}

export function Stepper({ value, onValueChange, children }: StepperProps) {
  return (
    <div className="flex flex-col gap-4">
      <StepperContext
        value={{ currentStep: value, setCurrentStep: onValueChange }}
      >
        {children}
      </StepperContext>
    </div>
  );
}

interface StepperNavProps extends PropsWithChildren {
  className?: string;
}

export function StepperNav({ className, children }: StepperNavProps) {
  return <div className={cn("flex w-full", className)}>{children}</div>;
}

interface StepperItemProps extends PropsWithChildren {
  value: number;
  disabled?: boolean;
}

export function StepperItem({ value, disabled, children }: StepperItemProps) {
  const { currentStep } = useStepperContext();

  return (
    <StepperItemContext.Provider value={{ value, disabled }}>
      <div
        className="flex items-center not-last:flex-1 group/stepper-item"
        data-completed={value < currentStep}
      >
        {children}
      </div>
    </StepperItemContext.Provider>
  );
}

export function StepperTrigger() {
  const { currentStep, setCurrentStep } = useStepperContext();
  const { value, disabled } = useStepperItemContext();

  const isCompleted = value < currentStep;
  const isActive = value === currentStep;
  const isDisabled = disabled !== undefined ? disabled : value > currentStep;

  return (
    <Button
      key={value}
      size="icon"
      className="peer border-none"
      onClick={() => setCurrentStep(value)}
      disabled={isDisabled}
      variant="outline"
    >
      {isCompleted ? (
        <IconCheck className="shrink-0 size-3.5" />
      ) : (
        <span
          className={cn(
            "text-sm",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {value}
        </span>
      )}
    </Button>
  );
}

export function StepperSeparator() {
  return (
    <span className="h-0.5 flex-1 transition-colors duration-200 bg-input mx-px group-data-[completed=true]/stepper-item:bg-white/50" />
  );
}

interface StepperContentProps extends PropsWithChildren {
  value: number;
}

export function StepperContent({ value, children }: StepperContentProps) {
  const { currentStep } = useStepperContext();

  return value === currentStep ? (
    <div className="space-y-4">{children}</div>
  ) : null;
}
