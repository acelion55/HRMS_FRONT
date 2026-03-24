import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const { db } = await connectToDatabase()
  const items = await db
    .collection("auditLogs")
    .find({})
    .sort({ timestamp: -1 })
    .toArray()

  const logs = items.map((item) => ({ ...item, id: item._id.toString(), _id: undefined }))
  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }

  const data = {
    userId: String(payload.userId || ""),
    userName: String(payload.userName || ""),
    userRole: String(payload.userRole || "SYSTEM_ADMIN"),
    actionType: String(payload.actionType || "TICKET_VIEWED"),
    ticketId: payload.ticketId ?? null,
    ticketTitle: payload.ticketTitle ?? null,
    oldValue: payload.oldValue ?? null,
    newValue: payload.newValue ?? null,
    timestamp: String(payload.timestamp || new Date().toISOString()),
    ipAddress: String(payload.ipAddress || "127.0.0.1"),
  }

  const { db } = await connectToDatabase()
  const result = await db.collection("auditLogs").insertOne(data)

  return NextResponse.json({ ...data, id: result.insertedId.toString() }, { status: 201 })
}
