import { logout, verifyRequestOrigin } from "@netlify/identity"
import type { Config } from "@netlify/functions"

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })
  try {
    verifyRequestOrigin(req)
  } catch {
    return new Response("Forbidden", { status: 403 })
  }
  await logout()
  return Response.json({ ok: true })
}

export const config: Config = { path: "/api/admin/logout" }
