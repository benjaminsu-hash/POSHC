import { login, logout, verifyRequestOrigin } from "@netlify/identity"
import type { Config } from "@netlify/functions"

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })

  try {
    verifyRequestOrigin(req)
  } catch {
    return new Response("Forbidden", { status: 403 })
  }

  try {
    const { email, password } = await req.json()
    const user: any = await login(String(email ?? ""), String(password ?? ""))
    const roles: string[] = user?.roles ?? user?.app_metadata?.roles ?? []
    if (!roles.includes("admin")) {
      await logout()
      return Response.json({ error: "This account doesn't have admin access." }, { status: 403 })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: "Incorrect email or password." }, { status: 401 })
  }
}

export const config: Config = { path: "/api/admin/login" }
