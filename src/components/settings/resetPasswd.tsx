"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { deleteUserAction, resetPasswdAction } from "@/server/action";

const FormSchema = z
  .object({
    user: z.string().optional(),
    new_password: z
      .string()
      .min(6, { message: "Pasword must be at least 6 characters long" })
      .max(50, { message: "Pasword cant exceed 50 characters" }),
    confirm_new_password: z
      .string()
      .min(6, { message: "Pasword must be at least 6 characters long" })
      .max(50, { message: "Pasword cant exceed 50 characters" }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

interface ResetPasswdProps {
  userList: { username: string }[];
  isAdmin: boolean;
}

export default function ResetPasswd(Props: ResetPasswdProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    resetPasswdAction(data.confirm_new_password, data.user).then((result) => {
      form.reset();
      if (result) {
        toast({
          title: "Success",
          description: "Password succesfully reset",
          variant: "success",
          duration: 2500,
        });
      } else {
        toast({
          title: "Error",
          description: "Error while reseting password",
          variant: "destructive",
          duration: 2500,
        });
      }
    });
  }

  function handleDeleteUser() {
    deleteUserAction(selectedUser).then((result) => {
      form.reset();
      if (result.success) {
        toast({
          title: "Success",
          description: `User ${selectedUser} has been deleted`,
          variant: "success",
          duration: 2500,
        });
        setSelectedUser("");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
          duration: 2500,
        });
      }
    });
  }

  return (
    <div className=" bg-black/50 backdrop-blur-lg rounded-md p-5 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {Props.isAdmin ? (
            <FormField
              control={form.control}
              name="user"
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
                      {Props.userList.map((user) => (
                        <SelectItem key={user.username} value={user.username}>
                          {user.username}
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
            name="new_password"
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
            name="confirm_new_password"
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
            {Props.isAdmin && (
              <Button
                type="button"
                variant={"destructive"}
                onClick={handleDeleteUser}
                disabled={selectedUser == ""}
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
