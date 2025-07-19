import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { FieldError } from "react-hook-form";

interface PasswordFieldProps {
  placeholder: string;
  error: FieldError | undefined;
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
  };
}

/**
 * PasswordField Component
 * @param PasswordFieldProps an object with a Placeholder and Field object from react hook form render
 * @returns FormControl input for password
 */
export default function PasswordField({
  placeholder,
  error,
  field,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormControl>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={field.name}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          ref={field.ref}
          className={
            error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          }
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </FormControl>
  );
}
