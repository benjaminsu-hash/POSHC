import { getDatabase } from "@netlify/database"
import type { Config } from "@netlify/functions"
import { requireAdmin } from "../lib/auth.mts"

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 })
  const denied = await requireAdmin(req)
  if (denied) return denied

  const db = getDatabase()
  const enquiries = await db.sql`
    SELECT id,
           received_at      AS "receivedAt",
           parent_name      AS "parentName",
           email, phone,
           child_first_name AS "childFirstName",
           year_level       AS "yearLevel",
           care,
           start_date::text AS "startDate",
           message, status, notes
    FROM enquiries
    ORDER BY received_at DESC
    LIMIT 1000`

  return Response.json({ enquiries }, { headers: { "Cache-Control": "no-store" } })
}

export const config: Config = { path: "/api/admin/enquiries" }
