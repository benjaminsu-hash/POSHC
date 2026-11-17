import { getDatabase } from "@netlify/database"
import type { Config } from "@netlify/functions"

// Privacy housekeeping: permanently delete enquiries older than RETENTION_MONTHS.
// Runs on the 1st of each month at 15:00 UTC (scheduled functions only run on published deploys).
const RETENTION_MONTHS = 12

export default async () => {
  const db = getDatabase()
  const rows = await db.sql`
    DELETE FROM enquiries
    WHERE received_at < now() - make_interval(months => ${RETENTION_MONTHS}::int)
    RETURNING id`
  console.log(`Purged ${rows.length} enquiries older than ${RETENTION_MONTHS} months`)
}

export const config: Config = { schedule: "0 15 1 * *" }
