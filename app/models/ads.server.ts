import arc from "@architect/functions";
import cuid from "cuid";

import type { User } from "./user.server";

export type Advertising = {
  id: ReturnType<typeof cuid>;
  userId: User["id"];
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

type AdvertisingItem = {
  pk: User["id"];
  sk: `advertising#${Advertising["id"]}`;
};

const skToId = (sk: AdvertisingItem["sk"]): Advertising["id"] =>
  sk.replace(/^advertising#/, "");
const idToSk = (id: Advertising["id"]): AdvertisingItem["sk"] =>
  `advertising#${id}`;

export async function getAdvertising({
  id,
  userId,
}: Pick<Advertising, "id" | "userId">): Promise<Advertising | null> {
  const db = await arc.tables();

  const result = await db.advertising.get({ pk: userId, sk: idToSk(id) });

  if (result) {
    return result;
  }
  return null;
}

export async function getAdvertisingListItems({
  userId,
}: Pick<Advertising, "userId">): Promise<
  Array<Pick<Advertising, "id" | "title">>
> {
  const db = await arc.tables();

  const result = await db.advertising.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": userId },
  });

  return result.Items.map((n: any) => ({
    title: n.title,
    id: skToId(n.sk),
  }));
}

export async function createAdvertising({
  title,
  userId,
}: Pick<Advertising, "title" | "userId">): Promise<Advertising> {
  const db = await arc.tables();

  const result = await db.advertising.put({
    pk: userId,
    sk: idToSk(cuid()),
    title: title,
  });
  return {
    id: skToId(result.sk),
    userId: result.pk,
    title: result.title,
    category: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };
}

export async function deleteAdvertising(
  { id, userId }: Pick<Advertising, "id" | "userId">,
) {
  const db = await arc.tables();
  return db.advertising.delete({ pk: userId, sk: idToSk(id) });
}
