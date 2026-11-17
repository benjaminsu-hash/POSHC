import { getDatabase } from "@netlify/database"
import type { Config, Context } from "@netlify/functions"
import { requireAdmin } from "../lib/auth.mts"

const STATUSES = ["new", "contacted", "enrolled", "closed"]
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PATCH = update status/notes, DELETE = permanently remove an enquiry.
export default async (req: Request, context: Context) => {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 })
  }
  const denied = await requireAdmin(req, true)
  if (denied) return denied

  const id = context.params.id
  if (!UUID.test(id)) return new Response("Bad id", { status: 400 })
  const db = getDatabase()

  if (req.method === "DELETE") {
    await db.sql`DELETE FROM enquiries WHERE id = ${id}::uuid`
    return Response.json({ ok: true })
  }

  let body: any
  try { body = await req.json() } catch { return new Response("Bad JSON", { status: 400 }) }
  const status = body.status === undefined ? null : String(body.status)
  const notes = body.notes === undefined ? null : String(body.notes).slice(0, 5000)
  if (status !== null && !STATUSES.includes(status)) return new Response("Bad status", { status: 400 })

  const rows = await db.sql`
    UPDATE enquiries
    SET status = COALESCE(${status}::text, status),
        notes = COALESCE(${notes}::text, notes),
        updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING id`
  if (!rows.length) return new Response("Not found", { status: 404 })
  return Response.json({ ok: true })
}

export const config: Config = { path: "/api/admin/enquiries/:id" }
