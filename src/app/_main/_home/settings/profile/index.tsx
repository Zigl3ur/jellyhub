import { createFileRoute } from "@tanstack/react-router";
import ProfileEditor from "@/components/settings/profile-editor";
import PasswordEditor from "@/components/settings/password-editor";
import DeleteAccount from "@/components/settings/delete-account";

export const Route = createFileRoute("/_main/_home/settings/profile/")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Profile - JellyHub" }] }),
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h3 className="text-5xl font-serif">Profile</h3>
      <div className="space-y-2">
        <ProfileEditor />
        <PasswordEditor />
        <DeleteAccount />
      </div>
    </div>
  );
}
