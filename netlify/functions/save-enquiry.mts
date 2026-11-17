import { getStore } from "@netlify/blobs"

// Runs automatically each time the "enquiry" form is submitted.
// Saves a copy to a private Blobs store so the admin page can read it.
export default {
  async formSubmitted(event: any) {
    const data = event?.data ?? {}
    const receivedAt = new Date().toISOString()
    const key = `${receivedAt}_${crypto.randomUUID().slice(0, 8)}`

    // Drop internal/spam fields, keep what the parent entered.
    const { "form-name": _formName, "bot-field": _bot, ...fields } = data

    await getStore("enquiries").setJSON(key, { receivedAt, ...fields })
  },
}
