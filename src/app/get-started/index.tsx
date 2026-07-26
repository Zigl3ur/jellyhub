import { createFileRoute, redirect } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import type {
  loginSchemaType,
  registerSchemaType,
} from "@/schemas/auth.schema";
import type {
  addServerSchemaType,
  endSetupSchemaType,
} from "@/schemas/settings.schema";
import type { ServerStatus as ServerStatusType } from "@/types";
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
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { getServerToken } from "@/functions/jellyfin.functions";
import {
  AddServersForm,
  CreateAdminUserForm,
  CreateUsersForm,
  ServerStatus,
  defaultValuesAdmin,
} from "@/components/get-started";
import { endSetup } from "@/functions/settings.functions";
import LoaderIcon from "@/components/ui/loader-icon";
import { Alert } from "@/components/ui/alert";

type Server = {
  username: string;
  token: string;
  address: string;
  status: ServerStatusType;
};

export const Route = createFileRoute("/get-started/")({
  beforeLoad: async () => {
    const alreadyHasAdmin = await hasAdminUser();

    if (alreadyHasAdmin) throw redirect({ to: "/" });
  },
  component: GetStartedPage,
  head: () => ({ meta: [{ title: "Get Started - JellyHub" }] }),
});

const steps = [1, 2, 3, 4];

function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const [users, setUsers] = useState<Array<loginSchemaType & { role: string }>>(
    [],
  );
  const usersWithoutAdmin = users.filter((u) => u.role === "user");
  const [selectedUser, setSelectedUser] = useState<
    registerSchemaType | undefined
  >(undefined);
  const admin = users.find((u) => u.role === "admin");
  const adminUser: registerSchemaType = admin
    ? {
        username: admin.username,
        password: admin.password,
        confirmPassword: admin.password,
      }
    : defaultValuesAdmin;

  const [servers, setServers] = useState<Array<Server>>([]);

  const getServerTokenMutation = useMutation({
    mutationFn: (data: addServerSchemaType) => getServerToken({ data }),
    onSuccess: (data, args) => {
      const server = servers.find((s) => s.address === args.address) as Server;

      setServers((prev) => [
        ...prev.filter((s) => s.address !== args.address),
        {
          address: server.address,
          username: server.username,
          token: data.AccessToken as string,
          status: "up",
        },
      ]);
    },
    onError: (_, args) => {
      const server = servers.find((s) => s.address === args.address) as Server;
      setServers((prev) => [
        ...prev.filter((s) => s.address !== args.address),
        {
          address: server.address,
          username: server.username,
          token: "",
          status: "down",
        },
      ]);
    },
  });

  const [showSummaryAdminPass, setShowSummaryAdminPass] = useState(false);

  const [finishSetUpLoading, setFinisSetupLoading] = useState(false);
  const [finishSetUpError, setFinisSetupError] = useState<string | null>(null);
  const finishSetupMutation = useMutation({
    mutationFn: (data: endSetupSchemaType) => endSetup({ data }),
    onMutate: () => {
      setFinisSetupLoading(true);
      setFinisSetupError(null);
    },
    onError: (err) => setFinisSetupError(err.message),
    onSettled: () => setFinisSetupLoading(false),
  });

  return (
    <div className="flex items-center flex-col justify-center min-h-svh gap-8 p-4">
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
              <StepperItem
                key={step}
                value={step}
                disabled={(step > 1 && !admin) || finishSetUpLoading}
              >
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
            <div>
              <h4 className="text-xl font-semibold">Create Users</h4>
              <p className="text-muted-foreground">
                Add users that will be able to access Jellyhub
              </p>
            </div>
            <div className="space-y-3 border border-input bg-input/20 p-3 rounded">
              <h5 className="font-light text-sm">Configured Users</h5>
              <div className="flex flex-wrap gap-2">
                {users.length > 0 ? (
                  users.map((u) => (
                    <Badge
                      key={u.username}
                      render={
                        <button
                          className={
                            u.role !== "admin" ? "hover:cursor-pointer" : ""
                          }
                          onClick={() => {
                            if (u.role === "admin") return;
                            setSelectedUser({
                              username: u.username,
                              password: u.password,
                              confirmPassword: u.password,
                            });
                          }}
                        >
                          {u.username}
                          {u.role === "admin" ? (
                            <UserCog className="shrink-0 size-4" />
                          ) : (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUsers((prev) =>
                                  prev.filter(
                                    (user) => user.username !== u.username,
                                  ),
                                );
                                setSelectedUser(undefined);
                              }}
                            >
                              <X className="shrink-0 size-3" />
                            </Button>
                          )}
                        </button>
                      }
                    />
                  ))
                ) : (
                  <p className="text-sm opacity-90">No users configured</p>
                )}
              </div>
            </div>
            <CreateUsersForm
              value={selectedUser}
              onSubmit={(value) => {
                if (!users.map((u) => u.username).includes(value.username)) {
                  setUsers((prev) => [...prev, { ...value, role: "user" }]);
                  setSelectedUser(undefined);
                }
              }}
            >
              <Button onClick={nextStep}>
                Next <ArrowRight className="size-4" />
              </Button>
            </CreateUsersForm>
          </StepperContent>
          <StepperContent value={3}>
            <div>
              <h4 className="text-xl font-semibold">Add Jellyfin Servers</h4>
              <p className="text-muted-foreground">
                Configure Jellyfin servers for your account
              </p>
            </div>
            <div className="space-y-3 border border-input bg-input/20 p-3 rounded">
              <h4 className="font-light text-sm">Configured Servers</h4>
              <div className="flex flex-col gap-2 max-h-50 overflow-y-auto">
                {servers.length > 0 ? (
                  servers.map((s, idx) => (
                    <Fragment key={idx}>
                      <div
                        key={s.address}
                        className="flex items-center w-full justify-between text-sm"
                      >
                        <div className="flex gap-2 items-center">
                          <h6>{s.address}</h6>
                          <span className="overflow-hidden">
                            <ServerStatus status={s.status} />
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={s.status === "checking"}
                          onClick={() => {
                            setServers((prev) =>
                              prev.filter((p) => p.address !== s.address),
                            );
                          }}
                        >
                          <Trash2 className="group-hover/button:text-destructive transtion-colors duration-200" />
                        </Button>
                      </div>
                      {idx + 1 < servers.length && (
                        <span className="h-px bg-input" />
                      )}
                    </Fragment>
                  ))
                ) : (
                  <p className="text-sm opacity-90">No servers configured</p>
                )}
              </div>
            </div>

            <AddServersForm
              onSubmit={(value) => {
                setServers((prev) => [
                  ...prev,
                  {
                    address: value.address,
                    username: value.username,
                    status: "checking",
                    token: "",
                  },
                ]);

                getServerTokenMutation.mutate(value);
              }}
            >
              <Button onClick={nextStep}>
                Next <ArrowRight className="size-4" />
              </Button>
            </AddServersForm>
          </StepperContent>
          <StepperContent value={4}>
            {finishSetUpLoading ? (
              <div className="flex flex-col gap-4 h-50 items-center justify-center">
                <LoaderIcon className="size-6" />
                <h4 className="text-xl">Setting up your Jellyhub...</h4>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="text-xl font-semibold">Summary</h4>
                  <p className="text-muted-foreground">Review your settings</p>
                </div>
                {finishSetUpError && (
                  <Alert
                    type="destructive"
                    title="Error while setup"
                    message={`Failed to setup your Jellyhub, please retry. Got ${finishSetUpError}`}
                  />
                )}
                <div className="border border-input rounded">
                  <div className="px-3 py-2 bg-accent/20 flex justify-between items-center">
                    <h6 className="text-sm">Admin User</h6>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <Pencil className="shrink-0 size-4" />
                    </Button>
                  </div>
                  <div className="px-3 py-2 flex flex-col gap-3 rounded-t-lg border-t bg-input/20 border-input @container">
                    <div className="flex justify-between @[200px]:items-center @[200px]:flex-row flex-col">
                      <p className="text-muted-foreground">Username</p>
                      <p>{adminUser.username}</p>
                    </div>
                    <div className="flex justify-between @[200px]:items-center @[200px]:flex-row flex-col">
                      <p className="text-muted-foreground">Pasword</p>
                      <div className="flex gap-1.5 items-center">
                        <p className="max-w-20 truncate">
                          {showSummaryAdminPass
                            ? adminUser.password
                            : Array.from({
                                length: adminUser.username.length,
                              }).map((_) => "•")}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setShowSummaryAdminPass((prev) => !prev)
                          }
                        >
                          {showSummaryAdminPass ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-input rounded">
                  <div className="px-3 py-2 bg-accent/20 flex justify-between items-center">
                    <h6 className="text-sm">Users</h6>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <Pencil className="shrink-0 size-4" />
                    </Button>
                  </div>
                  <div className="px-3 py-2 rounded-t-lg border-t bg-input/20 border-input flex flex-wrap gap-2">
                    {usersWithoutAdmin.length > 0 ? (
                      usersWithoutAdmin.map((u) => (
                        <Badge key={u.username}>{u.username}</Badge>
                      ))
                    ) : (
                      <p className="text-sm opacity-90">No users configured</p>
                    )}
                  </div>
                </div>
                <div className="border border-input rounded">
                  <div className="px-3 py-2 bg-accent/20 flex justify-between items-center">
                    <h6 className="text-sm">Jellyfin Servers</h6>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                    >
                      <Pencil className="shrink-0 size-4" />
                    </Button>
                  </div>

                  <div className="px-3 py-2 flex flex-col rounded-t-lg border-t bg-input/20 border-input">
                    {servers.length > 0 ? (
                      servers.map((s, idx) => (
                        <Fragment key={idx}>
                          <div className="flex items-center justify-between text-sm py-2">
                            <h6>{s.address}</h6>
                            <span className="overflow-hidden mr-1">
                              <ServerStatus status={s.status} />
                            </span>
                          </div>
                          {idx + 1 < servers.length && (
                            <span className="h-px bg-input" />
                          )}
                        </Fragment>
                      ))
                    ) : (
                      <p className="text-sm opacity-90">
                        No servers configured
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() =>
                      finishSetupMutation.mutate({
                        admin: {
                          username: adminUser.username,
                          password: adminUser.password,
                        },
                        users: usersWithoutAdmin,
                        servers,
                      })
                    }
                  >
                    Finish
                  </Button>
                </div>
              </>
            )}
          </StepperContent>
        </Stepper>
      </div>
    </div>
  );
}
