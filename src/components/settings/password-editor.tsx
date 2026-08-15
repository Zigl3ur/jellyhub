import { useState } from "react";
import Button from "../ui/button";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  resetPasswdSchema,
  type resetPasswdType,
} from "@/schemas/settings.schema";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input, InputAddon } from "../ui/input";
import LoaderIcon from "../ui/loader-icon";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Alert } from "../ui/alert";

const defaultValues: resetPasswdType = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export default function PasswordEditor() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: resetPasswdSchema,
    },
    onSubmit: async ({ value }) =>
      await authClient.changePassword(
        {
          newPassword: value.password,
          currentPassword: value.currentPassword,
        },
        {
          onSuccess: () => {
            setError(null);
            form.reset();
          },
          onError: ({ error }) => setError(error.message),
        },
      ),
  });

  return (
    <div className="p-4 @container/content border-input/40 border-b-2 flex sm:flex-row flex-col gap-8 sm:gap-0 sm:justify-between">
      <div className="space-y-px">
        <h4 className="text-xl">Password</h4>
        <p className="text-sm opacity-75">Update your account password</p>
      </div>

      {error && (
        <Alert
          type="destructive"
          title="Failed to update profile"
          message={error}
        />
      )}

      <form
        className="space-y-4 @sm/content:max-w-90 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="currentPassword"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot name={field.name} invalid={invalid}>
                <FieldLabel>Current Pasword</FieldLabel>
                <Input
                  name={field.name}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <InputAddon side="right">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </InputAddon>
                </Input>
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot name={field.name} invalid={invalid}>
                <FieldLabel>New Password</FieldLabel>
                <Input
                  name={field.name}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <InputAddon side="right">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </InputAddon>
                </Input>
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot name={field.name} invalid={invalid}>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  name={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <InputAddon side="right">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </InputAddon>
                </Input>
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />

        <div className="flex justify-end">
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDefaultValue,
            ]}
            children={([canSubmit, isSubmitting, isDefaultValue]) => (
              <Button type="submit" disabled={!canSubmit || isDefaultValue}>
                {isSubmitting ? (
                  <>
                    <LoaderIcon />
                    Updating
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
