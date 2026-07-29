import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import { Input, InputAddon } from "../ui/input";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import Button from "../ui/button";
import type { PropsWithChildren } from "react";
import type { addServerSchemaType } from "@/schemas/settings.schema";
import { addServerSchema } from "@/schemas/settings.schema";

const defaultValuesServer: addServerSchemaType = {
  url: "",
  username: "",
  password: "",
};

interface AddServersFormProps extends PropsWithChildren {
  onSubmit: (values: addServerSchemaType) => void;
}

export function AddServersForm({ onSubmit, children }: AddServersFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const addServerForm = useForm({
    defaultValues: defaultValuesServer,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: addServerSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
      addServerForm.reset();
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        addServerForm.handleSubmit();
      }}
    >
      <addServerForm.Field
        name="url"
        children={(field) => {
          const error = field.state.meta.errors[0];
          const invalid = !field.state.meta.isValid;

          return (
            <FieldRoot name={field.name} invalid={invalid}>
              <FieldLabel>Server Address</FieldLabel>

              <Input
                name={field.name}
                placeholder="https://my.jellyfin.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              <FieldError match={invalid}>{error?.message}</FieldError>
            </FieldRoot>
          );
        }}
      />
      <addServerForm.Field
        name="username"
        children={(field) => {
          const error = field.state.meta.errors[0];
          const invalid = !field.state.meta.isValid;

          return (
            <FieldRoot name={field.name} invalid={invalid}>
              <FieldLabel>Username</FieldLabel>
              <Input
                name={field.name}
                placeholder="Server username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError match={invalid}>{error?.message}</FieldError>
            </FieldRoot>
          );
        }}
      />
      <addServerForm.Field
        name="password"
        children={(field) => {
          const error = field.state.meta.errors[0];
          const invalid = !field.state.meta.isValid;

          return (
            <FieldRoot name={field.name} invalid={invalid}>
              <FieldLabel>Password</FieldLabel>
              <Input
                name={field.name}
                type={showPassword ? "text" : "password"}
                placeholder="Server password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <InputAddon side="right">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </InputAddon>
              </Input>
              <FieldError match={invalid}>{error?.message}</FieldError>
            </FieldRoot>
          );
        }}
      />
      <div className="flex justify-end gap-2">
        <addServerForm.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <Button type="submit" disabled={!canSubmit}>
              Add <Plus className="size-4" />
            </Button>
          )}
        />
        {children}
      </div>
    </form>
  );
}
