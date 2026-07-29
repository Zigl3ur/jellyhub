import { Link } from "@tanstack/react-router";

export default function NoItemFound() {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <span>No items found.</span>
      <span>Please add at least one server / Check servers status </span>
      <Link to="/settings" className="italic">
        Go to Settings
      </Link>
    </div>
  );
}
