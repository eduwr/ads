import { Link } from "@remix-run/react";

export default function AdvertisingIndexPage() {
  return (
    <p>
      No note selected. Select a advertising on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new advertising.
      </Link>
    </p>
  );
}
