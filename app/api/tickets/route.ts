import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const { db } = await connectToDatabase()
  const items = await db
    .collection("tickets")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  const tickets = items.map((item) => ({
    ...item,
    id: item._id.toString(),
    _id: undefined,
  }))

  return NextResponse.json(tickets)
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }

  const data = {
    title: String(payload.title || "Untitled Ticket"),
    description: String(payload.description || ""),
    category: String(payload.category || "GENERAL"),
    priority: String(payload.priority || "MEDIUM"),
    status: String(payload.status || "OPEN"),
    department: String(payload.department || "ENGINEERING"),
    location: String(payload.location || "Unknown"),
    projectName: String(payload.projectName || "General"),
    ticketType: String(payload.ticketType || "SERVICE_REQUEST"),
    attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    creatorId: String(payload.creatorId || ""),
    creatorName: String(payload.creatorName || ""),
    assigneeId: payload.assigneeId ?? null,
    assigneeName: payload.assigneeName ?? null,
    comments: Array.isArray(payload.comments) ? payload.comments : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }

  const { db } = await connectToDatabase()
  const result = await db.collection("tickets").insertOne(data)

  const inserted = {
    ...data,
    id: result.insertedId.toString(),
  }

  return NextResponse.json(inserted, { status: 201 })
}
