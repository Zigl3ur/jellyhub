import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconUserCog,
  IconX,
} from "@tabler/icons-react";
import type { PropsWithChildren } from "react";
import type {
  loginSchemaType,
  registerSchemaType,
} from "@/schemas/auth.schema";
import { Input, InputAddon } from "@/components/ui/input";
import { registerSchema } from "@/schemas/auth.schema";
import { hasAdminUser } from "@/functions/auth.functions";
import Logo from "@/components/logo";
import {
  Stepper,
  StepperContent,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { FieldError, FieldLabel, FieldRoot } from "@/components/ui/field";
import Button from "@/components/ui/button";
import { user } from "@/lib/db/schema";
import Badge from "@/components/ui/badge";

export const Route = createFileRoute("/get-started/")({
  beforeLoad: async () => {
    const alreadyHasAdmin = await hasAdminUser();

    if (alreadyHasAdmin) throw redirect({ to: "/" });
  },
  component: GetStartedPage,
  head: () => ({ meta: [{ title: "Get Started - JellyHub" }] }),
});

const steps = [1, 2, 3];

function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [users, setUsers] = useState<Array<loginSchemaType & { role: string }>>(
    [],
  );
  const [servers, setServers] = useState<
    Array<{ username: string; token: string; url: string }>
  >([]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const admin = users.find((u) => u.role === "admin");
  const adminUser: registerSchemaType = admin
    ? {
        username: admin.username,
        password: admin.username,
        confirmPassword: admin.password,
      }
    : defaultValuesAdmin;

  console.log(users);

  return (
    <div className="flex items-center flex-col justify-center h-dvh gap-8">
      <Logo />
      <div className="max-w-sm w-full p-6 rounded-xl space-y-8 bg-accent-foreground">
        <h3 className="font-serif italic text-3xl font-semibold text-foreground">
          Get Started with JellyHub
        </h3>

        <Stepper
          value={currentStep}
          onValueChange={(step) => setCurrentStep(step)}
        >
          <StepperNav>
            {steps.map((step) => (
              <StepperItem key={step} value={step}>
                <StepperTrigger />
                {steps.length !== step && <StepperSeparator />}
              </StepperItem>
            ))}
          </StepperNav>
          <StepperContent value={1}>
            <h4 className="text-xl font-semibold">Create an Admin User</h4>
            <CreateAdminUserForm
              defaultValues={adminUser}
              onSubmit={(value) => {
                setUsers((prev) => [
                  ...prev.filter((u) => u.role !== "admin"),
                  {
                    username: value.username,
                    password: value.password,
                    role: "admin",
                  },
                ]);
                nextStep();
              }}
            />
          </StepperContent>
          <StepperContent value={2}>
            <h4 className="text-xl font-semibold">Create Users</h4>

            <div className="space-y-2 border border-input bg-input/20 p-3 rounded">
              <h5 className="font-light text-sm">Configured Users</h5>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <Badge>
                    {u.username}
                    {u.role === "admin" ? (
                      <IconUserCog className="shrink-0 size-4" />
                    ) : (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setUsers((prev) =>
                            prev.filter((user) => user.username !== u.username),
                          )
                        }
                      >
                        <IconX className="shrink-0 size-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
            <CreateUsersForm
              onSubmit={(value) => {
                if (!users.map((u) => u.username).includes(value.username)) {
                  setUsers((prev) => [...prev, { ...value, role: "user" }]);
                }
              }}
            >
              <Button onClick={nextStep}>
                Next <IconArrowRight className="size-4" />
              </Button>
            </CreateUsersForm>
          </StepperContent>
          <StepperContent value={3}></StepperContent>
          <StepperContent value={4}></StepperContent>
        </Stepper>
      </div>
    </div>
  );
}

const defaultValuesAdmin: registerSchemaType = {
  username: "admin",
  password: "",
  confirmPassword: "",
};

interface CreateAdminUserFormProps {
  defaultValues: registerSchemaType;
  onSubmit: (values: registerSchemaType) => void;
}

function CreateAdminUserForm({
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
    onSubmit: ({ value }) => onSubmit(value),
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
            <FieldRoot name="password" invalid={invalid}>
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
                    {showPassword ? <IconEyeOff /> : <IconEye />}
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
            <FieldRoot name="confirmPassword" invalid={invalid}>
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
                    {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
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
              Next <IconArrowRight className="size-4" />
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
  onSubmit: (values: loginSchemaType) => void;
}

function CreateUsersForm({ onSubmit, children }: CreateUsersFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createUserForm = useForm({
    defaultValues: defaultValuesUser,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: registerSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
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
            <FieldRoot name="password" invalid={invalid}>
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
                    {showPassword ? <IconEyeOff /> : <IconEye />}
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
            <FieldRoot name="confirmPassword" invalid={invalid}>
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
                    {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
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
              Add <IconPlus className="size-4" />
            </Button>
          )}
        />
        {children}
      </div>
    </form>
  );
}
