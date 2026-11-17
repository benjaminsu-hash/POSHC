import { getUser } from "@netlify/identity"
import { getStore } from "@netlify/blobs"
import type { Config } from "@netlify/functions"

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 })

  const user: any = await getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })
  const roles: string[] = user.roles ?? user.app_metadata?.roles ?? []
  if (!roles.includes("admin")) return new Response("Forbidden", { status: 403 })

  const store = getStore("enquiries")
  const { blobs } = await store.list()
  const entries = await Promise.all(
    blobs.map(async (b) => ({ id: b.key, ...((await store.get(b.key, { type: "json" })) as object) }))
  )
  entries.sort((a: any, b: any) => String(b.receivedAt).localeCompare(String(a.receivedAt)))

  return Response.json({ enquiries: entries }, { headers: { "Cache-Control": "no-store" } })
}

export const config: Config = { path: "/api/admin/enquiries" }
