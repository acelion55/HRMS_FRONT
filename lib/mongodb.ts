import { MongoClient, Db } from "mongodb"

const dbName = process.env.MONGODB_DB_NAME || "hrms"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Set it in .env.local")
  }

  const client = new MongoClient(uri, { serverApi: { version: "1" } })
  await client.connect()

  const db = client.db(dbName)
  cachedClient = client
  cachedDb = db

  return { client, db }
}
