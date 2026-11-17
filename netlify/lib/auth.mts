import { getUser, verifyRequestOrigin } from "@netlify/identity"

// Returns a Response to send back if the caller is NOT an allowed admin, otherwise null.
export async function requireAdmin(req: Request, mutating = false): Promise<Response | null> {
  if (mutating) {
    try {
      verifyRequestOrigin(req) // CSRF protection for state-changing requests
    } catch {
      return new Response("Forbidden", { status: 403 })
    }
  }
  const user: any = await getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })
  const roles: string[] = user.roles ?? user.app_metadata?.roles ?? []
  if (!roles.includes("admin")) return new Response("Forbidden", { status: 403 })
  return null
}
