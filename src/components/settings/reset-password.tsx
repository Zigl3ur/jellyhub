"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { resetPasswdType } from "@/schemas/settings.schema";
import { resetPasswdScema } from "@/schemas/settings.schema";
import { resetPasswordAction } from "@/functions/settings.functions";

export default function ResetPasswd() {
  const [loading, setLoading] = useState<boolean>(false);

  const resetPasswordForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { password: passwordError, confirmPassword: confirmPasswordError } =
    resetPasswordForm.state.errorMap;

  const onSubmit = async (values: resetPasswdType) => {
    const { password, confirmPassword } = values;

    setLoading(true);
    await resetPasswordAction(password, confirmPassword)
      .then((result) => {
        if (result.error) {
          toast.error("Error", {
            description: result.error,
          });
        } else if (result.success) {
          toast.success("Success", {
            description: result.message,
          });
          resetPasswordForm.reset();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="rounded-lg p-5 bg-card/50 w-full max-w-md">
        <h2 className="font-bold text-xl mb-4">Reset Password</h2>
        <Form {...resetPasswordForm}>
          <form
            onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={resetPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <PasswordField
                    placeholder="New Password"
                    error={passwordError}
                    field={{ ...field }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <PasswordField
                    placeholder="Confirm New Password"
                    error={confirmPasswordError}
                    field={{ ...field }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" variant={"destructive"} disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Reseting...
                  </>
                ) : (
                  "Reset"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
