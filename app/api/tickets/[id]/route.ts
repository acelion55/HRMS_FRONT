import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) return NextResponse.json({ message: "Ticket id missing" }, { status: 400 })

  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }

  const { db } = await connectToDatabase()

  const updateDoc: Record<string, unknown> = { updatedAt: new Date().toISOString() }

  if (payload.status) updateDoc.status = payload.status
  if (payload.assigneeId !== undefined) updateDoc.assigneeId = payload.assigneeId
  if (payload.assigneeName !== undefined) updateDoc.assigneeName = payload.assigneeName
  if (payload.deletedAt !== undefined) updateDoc.deletedAt = payload.deletedAt
  if (payload.comment) {
    const comment = payload.comment
    if (typeof comment === "object" && comment !== null) {
      await db.collection("tickets").updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment }, $set: { updatedAt: new Date().toISOString() } }
      )
    }
  }

  const fieldsToUpdate = Object.keys(updateDoc).reduce((acc, key) => {
    if (updateDoc[key] !== undefined) acc[key] = updateDoc[key]
    return acc
  }, {} as Record<string, unknown>)

  await db.collection("tickets").updateOne({ _id: new ObjectId(id) }, { $set: fieldsToUpdate })

  const item = await db.collection("tickets").findOne({ _id: new ObjectId(id) })
  if (!item) return NextResponse.json({ message: "Ticket not found" }, { status: 404 })

  return NextResponse.json({ ...item, id: item._id.toString() })
}
