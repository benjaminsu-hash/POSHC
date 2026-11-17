import { getDatabase } from "@netlify/database"

const clip = (v: unknown, max: number) => {
  const s = (Array.isArray(v) ? v.join(", ") : String(v ?? "")).trim()
  return s ? s.slice(0, max) : null
}

// Runs automatically each time the "enquiry" form is submitted (Netlify form event).
export default {
  async formSubmitted(event: any) {
    const d = event?.data ?? {}
    const careRaw = d.care
    const care: string[] = (Array.isArray(careRaw) ? careRaw : careRaw ? [careRaw] : [])
      .map((c: unknown) => String(c).slice(0, 40))
      .slice(0, 5)
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(String(d["start-date"] ?? "")) ? String(d["start-date"]) : null

    const db = getDatabase()
    await db.sql`
      INSERT INTO enquiries (parent_name, email, phone, child_first_name, year_level, care, start_date, message)
      VALUES (
        ${clip(d["parent-name"], 200) ?? "(no name)"},
        ${clip(d.email, 320) ?? ""},
        ${clip(d.phone, 50)},
        ${clip(d["child-first-name"], 100)},
        ${clip(d["year-level"], 50)},
        ${care}::text[],
        ${startDate}::date,
        ${clip(d.message, 5000)}
      )`
  },
}
