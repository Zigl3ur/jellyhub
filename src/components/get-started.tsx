import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Input, InputAddon } from "./ui/input";
import { FieldError, FieldLabel, FieldRoot } from "./ui/field";
import Button from "./ui/button";
import LoaderIcon from "./ui/loader-icon";
import { Alert } from "./ui/alert";
import type { PropsWithChildren } from "react";
import type {
  loginSchemaType,
  registerSchemaType,
} from "@/schemas/auth.schema";
import type { addServerSchemaType } from "@/schemas/settings.schema";
import type { ServerStatus } from "@/types";
import { registerSchema } from "@/schemas/auth.schema";
import { addServerSchema } from "@/schemas/settings.schema";
import {
  getServerAuthToken,
  getServerInfo,
} from "@/functions/jellyfin.functions";

export const defaultValuesAdmin: registerSchemaType = {
  username: "admin",
  password: "",
  confirmPassword: "",
};

interface CreateAdminUserFormProps {
  defaultValues: registerSchemaType;
  onSubmit: (values: registerSchemaType) => void;
}

export function CreateAdminUserForm({
  defaultValues,
  onSubmit,
}: CreateAdminUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createAdminUserForm = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: registerSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
      createAdminUserForm.reset();
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        createAdminUserForm.handleSubmit();
      }}
    >
      <createAdminUserForm.Field
        name="username"
        children={(field) => {
          const error = field.state.meta.errors[0];
          const invalid = !field.state.meta.isValid;

          return (
            <FieldRoot name={field.name} invalid={invalid}>
              <FieldLabel>Username</FieldLabel>

              <Input
                name={field.name}
                placeholder="Admin"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              <FieldError match={invalid}>{error?.message}</FieldError>
            </FieldRoot>
          );
        }}
      />
      <createAdminUserForm.Field
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
      <createAdminUserForm.Field
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
        <createAdminUserForm.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <Button type="submit" disabled={!canSubmit}>
              Next <ArrowRight className="size-4" />
            </Button>
          )}
        />
      </div>
    </form>
  );
}

const defaultValuesUser: registerSchemaType = {
  username: "",
  password: "",
  confirmPassword: "",
};

interface CreateUsersFormProps extends PropsWithChildren {
  value?: registerSchemaType;
  onSubmit: (values: loginSchemaType) => void;
}

export function CreateUsersForm({
  value,
  onSubmit,
  children,
}: CreateUsersFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createUserForm = useForm({
    defaultValues: value ? value : defaultValuesUser,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: registerSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
      createUserForm.reset();
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        createUserForm.handleSubmit();
      }}
    >
      <createUserForm.Field
        name="username"
        children={(field) => {
          const error = field.state.meta.errors[0];
          const invalid = !field.state.meta.isValid;

          return (
            <FieldRoot name={field.name} invalid={invalid}>
              <FieldLabel>Username</FieldLabel>

              <Input
                name={field.name}
                placeholder="User 1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              <FieldError match={invalid}>{error?.message}</FieldError>
            </FieldRoot>
          );
        }}
      />
      <createUserForm.Field
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
      <createUserForm.Field
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
      <div className="flex justify-end gap-2">
        <createUserForm.Subscribe
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

const defaultValuesServer: addServerSchemaType = {
  url: "",
  username: "",
  password: "",
};

interface AddServersFormProps extends PropsWithChildren {
  onMutationSuccess: (
    token: string,
    serverName: string,
    args: addServerSchemaType,
  ) => void;
}

export function AddServersForm({
  onMutationSuccess,
  children,
}: AddServersFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: addServerSchemaType) => getServerAuthToken({ data }),
    onMutate: async (args) => {
      const info = await getServerInfo({ data: { url: args.url } });

      return { info };
    },
    onSuccess: (data, args, { info }) => {
      onMutationSuccess(
        data.AccessToken as string,
        info.ServerName as string,
        args,
      );
      addServerForm.reset();
    },
  });

  const addServerForm = useForm({
    defaultValues: defaultValuesServer,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: addServerSchema,
    },
    onSubmit: ({ value }) => mutate(value),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        addServerForm.handleSubmit();
      }}
    >
      {isError && (
        <Alert
          type="destructive"
          title="Failed to add Jellyfin Server"
          message={error.message}
        />
      )}

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
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? (
                <>
                  Adding...
                  <LoaderIcon className="size-4" />
                </>
              ) : (
                <>
                  Add <Plus className="size-4" />
                </>
              )}
            </Button>
          )}
        />
        {children}
      </div>
    </form>
  );
}

interface ServerStatusProps {
  status: ServerStatus;
}

export function ServerStatus({ status }: ServerStatusProps) {
  return status === "checking" ? (
    <LoaderIcon />
  ) : status === "up" ? (
    <Check className="size-4.5 text-success" />
  ) : (
    <X className="size-4.5 text-destructive" />
  );
}
