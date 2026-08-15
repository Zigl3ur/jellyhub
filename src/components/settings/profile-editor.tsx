import { authClient } from "@/lib/auth-client";
import { useRef, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImg } from "../ui/avatar";
import Button from "../ui/button";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  editProfileSchema,
  type editProfileSchemaType,
} from "@/schemas/settings.schema";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input } from "../ui/input";
import LoaderIcon from "../ui/loader-icon";
import { Alert } from "../ui/alert";
import Skeleton from "../ui/skeleton";

export default function ProfileEditor() {
  const fileInput = useRef<HTMLInputElement>(null);

  const { isPending, data: session } = authClient.useSession();
  const user = session?.user;

  const defaultValues: editProfileSchemaType = {
    image: user?.image,
    username: user?.username,
  };

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: editProfileSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.updateUser(value, {
        onSuccess: () => {
          setError(null);
          form.reset();
        },
        onError: ({ error }) => setError(error.message),
      });
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];

      if (image.size > 10_000_000) {
        form.setFieldMeta("image", (prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            onChange: new Error("File exceed size limit of 10MB"),
          },
        }));
        return;
      }

      form.setFieldMeta("image", (prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          onChange: undefined,
        },
      }));

      const reader = new FileReader();

      reader.readAsDataURL(image);
      reader.addEventListener("load", () => {
        const result = reader.result;
        if (!result) return;

        form.setFieldValue("image", result.toString());
      });
    }
  };

  return (
    <div className="p-4 @container/content border-input/40 border-b-2 flex sm:flex-row flex-col gap-8 sm:gap-0 sm:justify-between">
      <div className="space-y-px">
        <h4 className="text-xl">Profile</h4>
        <p className="text-sm opacity-75">Your Display Name and Avatar</p>
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
          name="image"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot
                name={field.name}
                invalid={invalid}
                className="items-center"
              >
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg, image/webp, image/gif"
                  hidden
                  multiple={false}
                  ref={fileInput}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    handleFileChange(e);
                  }}
                />
                {isPending ? (
                  <Skeleton className="size-24" />
                ) : (
                  <Avatar
                    onClick={() => fileInput.current?.click()}
                    className="size-24 hover:cursor-pointer"
                  >
                    <AvatarImg src={form.getFieldValue("image") as string} />
                    <AvatarFallback delay={500} className="text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />

        <form.Field
          name="username"
          children={(field) => {
            const error = field.state.meta.errors[0];
            const invalid = !field.state.meta.isValid;

            return (
              <FieldRoot name={field.name} invalid={invalid} className="w-full">
                <FieldLabel>Username</FieldLabel>
                <div className="flex gap-2 w-full">
                  <Input
                    name={field.name}
                    placeholder="Username"
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
                        disabled={!canSubmit || isDefaultValue}
                      >
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
                <FieldError match={invalid}>{error?.message}</FieldError>
              </FieldRoot>
            );
          }}
        />
      </form>
    </div>
  );
}
