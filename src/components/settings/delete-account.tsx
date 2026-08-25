import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Button from "../ui/button";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input } from "../ui/input";
import LoaderIcon from "../ui/loader-icon";
import { Alert } from "../ui/alert";
import {
  deleteAccountSchema,
  type deleteAccountSchemaType,
} from "@/schemas/settings.schema";
import { useNavigate } from "@tanstack/react-router";

const defaultValues: deleteAccountSchemaType = {
  confirm: "",
};

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: deleteAccountSchema,
    },
    onSubmit: async () => {
      await authClient.deleteUser({
        fetchOptions: {
          onSuccess: () => {
            setError(null);
            form.reset();
            navigate({ to: "/login" });
          },
          onError: ({ error }) => setError(error.message),
        },
      });
    },
  });

  return (
    <div className="p-4 @container/content flex sm:flex-row flex-col gap-8 sm:gap-0 sm:justify-between">
      <div className="space-y-px">
        <h4 className="text-xl text-destructive">Danger Zone</h4>
        <p className="text-sm opacity-75 text-destructive">
          Delete Your Account
        </p>
      </div>

      {error && (
        <Alert
          type="destructive"
          title="Failed to update profile"
          message={error}
        />
      )}

      <form
        className="flex gap-2 @xs/content:items-center @sm/content:max-w-90 w-full flex-col @xs/content:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="confirm"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot name={field.name} invalid={invalid} className="w-full">
                <FieldLabel className="text-destructive">
                  Confirm by typing 'delete my account'
                </FieldLabel>
                <div className="flex gap-2 w-full">
                  <Input
                    name={field.name}
                    placeholder="Confirm deletion"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <form.Subscribe
                    selector={(state) => [
                      state.canSubmit,
                      state.isSubmitting,
                      state.isDefaultValue,
                    ]}
                    children={([canSubmit, isSubmitting, isDefaultValue]) => (
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={!canSubmit || isDefaultValue}
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderIcon />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    )}
                  />
                </div>
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />
      </form>
    </div>
  );
}
