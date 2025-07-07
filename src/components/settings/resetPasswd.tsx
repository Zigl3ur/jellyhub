"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import {
  deleteUserAction,
  getUsersList,
  resetPasswordAction,
} from "@/server/actions/settings.actions";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { registerSchema, registerSchemaType } from "@/schemas/auth.schema";

interface ResetPasswdProps {
  isAdmin: boolean;
}

export default function ResetPasswd({ isAdmin }: ResetPasswdProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userList, setUserList] =
    useState<Awaited<ReturnType<typeof auth.api.listUsers>>>();

  useEffect(() => {
    if (isAdmin) {
      const usersList = async () => {
        const list = await getUsersList();

        if (list.success) setUserList(list.data);
      };

      usersList();
    }
  }, [isAdmin]);

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: registerSchemaType) => {
    resetPasswordAction(data.confirmPassword, data.username).then((result) => {
      if (result) {
        toast.success("Success", {
          description: "Password succesfully reset",
        });
        form.reset();
      } else {
        toast.error("Error", {
          description: "Error while reseting password",
        });
      }
    });
  };

  const handleDeleteUser = () => {
    deleteUserAction(selectedUser).then((result) => {
      if (result.success) {
        toast.success("Success", {
          description: `User ${selectedUser} has been deleted`,
        });
        form.reset();
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    });
  };

  return (
    <div className=" backdrop-blur-lg rounded-md p-5 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {isAdmin ? (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedUser(value);
                    }}
                    defaultValue={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an User" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userList &&
                        userList.users.map((user) => (
                          <SelectItem key={user.name} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Retype new Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" variant={"destructive"}>
              Reset
            </Button>
            {isAdmin && (
              <Button
                type="button"
                variant={"destructive"}
                onClick={handleDeleteUser}
                disabled={selectedUser === ""}
              >
                Delete User
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
