# POSHC

One-page landing site for the POSHC out of school hours care program.

Plain HTML/CSS – no build step. Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## To do
- Enquire Now buttons link to `enquiry.html` (Netlify Form, registers on first deploy to main)
- Parent Portal currently links to `dashboard.html`
- Replace placeholder hours, fees and contact details

## Enquiries admin (`/admin/`)
Enquiry form submissions are saved to a Netlify Database (Postgres) table `enquiries` by `netlify/functions/save-enquiry.mts` (schema in `netlify/database/migrations/`). The admin page reads and manages them behind a Netlify Identity login (role `admin`): change status (new/contacted/enrolled/closed), add internal notes, delete, export CSV.

Enquiries older than 12 months are deleted automatically on the 1st of each month (`purge-old-enquiries.mts`, change `RETENTION_MONTHS` to adjust).

One-time Netlify setup (dashboard only, after this is merged and deployed):
1. **Forms → Enable form detection**, then redeploy.
2. **Project configuration → Identity → Enable Identity**, set registration to **Invite only**.
3. **Identity → Users → Invite users** (client's email). Accept the invite, then edit the user and add the role `admin`.
4. Optional: **Forms → Notifications** to get an email for each enquiry.

Only enquiries received after this is deployed appear in `/admin/`; earlier ones stay in the Netlify Forms tab.

The database is provisioned and migrations applied automatically on the first deploy to `main` (needs a Credit-based Netlify plan). Never edit an applied migration; add a new one instead.
