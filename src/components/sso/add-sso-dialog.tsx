import { Eye, EyeOff, Plus } from "lucide-react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import "@tanstack/react-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Button from "../ui/button";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input, InputAddon } from "../ui/input";
import { Alert } from "../ui/alert";
import LoaderIcon from "../ui/loader-icon";
import { authClient } from "@/lib/auth-client";
import { addSsoSchema, type addSsoSchemaType } from "@/schemas/settings.schema";

const defaultValues: addSsoSchemaType = {
  providerId: "",
  domain: "",
  issuer: "",
  clientId: "",
  clientSecret: "",
};

export default function AddSsoDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: { onDynamic: addSsoSchema },
    onSubmit: async ({ value }) => {
      await authClient.sso.register(
        {
          providerId: value.providerId,
          issuer: value.issuer,
          domain: value.domain,
          oidcConfig: {
            clientId: value.clientId,
            clientSecret: value.clientSecret,
          },
        },
        {
          onRequest: () => setError(null),
          onSuccess: async () => {
            setOpen(false);
            form.reset();
            await queryClient.invalidateQueries({ queryKey: ["ssoProviders"] });
          },
          onError: ({ error }) => setError(error.message),
        },
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) {
          setError(null);
          form.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-5" /> Add Provider
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add OIDC Provider</DialogTitle>
          <DialogDescription>
            Configure un provider OpenID Connect
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert
            type="destructive"
            title="Failed to add SSO provider"
            message={error}
          />
        )}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="providerId"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Provider ID</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="my-provider"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <form.Field
            name="domain"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Domain</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="my.domain.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <form.Field
            name="issuer"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Issuer</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="https://my.issuer.com/"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <form.Field
            name="clientId"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Client ID</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="clientid"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <form.Field
            name="clientSecret"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Client Secret</FieldLabel>
                  <Input
                    name={field.name}
                    type={showSecret ? "text" : "password"}
                    placeholder="client secret"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <InputAddon side="right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowSecret((prev) => !prev)}
                      >
                        {showSecret ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputAddon>
                  </Input>
                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <DialogFooter className="flex justify-end items-center gap-2">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoaderIcon /> Adding
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
