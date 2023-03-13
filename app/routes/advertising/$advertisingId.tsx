import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteAdvertising, getAdvertising } from "~/models/ads.server";

import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  advertising: NonNullable<Awaited<ReturnType<typeof getAdvertising>>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.advertisingId, "advertisingId not found");

  const advertising = await getAdvertising({ userId, id: params.advertisingId });
  if (!advertising) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ advertising });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.advertisingId, "advertisingId not found");

  await deleteAdvertising({ userId, id: params.advertisingId });

  return redirect("/advertising");
};

export default function AdvertisingDetailsPage() {
  const data = useLoaderData() as unknown as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.advertising.title}</h3>
      <p className="py-6">{data.advertising.description}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
