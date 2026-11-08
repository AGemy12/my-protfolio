import { MongoClient, type Collection } from "mongodb";
import type { SiteContent } from "@/lib/content/types";

export type ContentDoc = {
  _id: "site";
  data: SiteContent;
  version: number;
  updatedAt: Date;
};

export const isDbConfigured = () => Boolean(process.env.MONGODB_URI);

// One client per server process. In development the module is reloaded on
// every change, so the promise is kept on globalThis to avoid piling up
// connections.
const globalForMongo = globalThis as unknown as { mongoClient?: Promise<MongoClient> };

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 5,
    })
      .connect()
      .catch((error) => {
        globalForMongo.mongoClient = undefined; // retry on the next request
        throw error;
      });
  }
  return globalForMongo.mongoClient;
}

export async function contentCollection(): Promise<Collection<ContentDoc>> {
  const db = (await client()).db(process.env.MONGODB_DB || "portfolio");
  return db.collection<ContentDoc>("content");
}
