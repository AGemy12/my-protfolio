# Ahmad Marzouk · Portfolio

Bilingual (English / Arabic) portfolio built with Next.js, next-intl and Tailwind CSS, with an admin dashboard at `/admin` for editing every section.

## Development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

- Site: http://localhost:3000 (redirects to `/en` or `/ar`)
- Dashboard: http://localhost:3000/admin

The site works without any environment variables: it shows the built-in content from `messages/*.json` and `data/portfolio.ts`. The dashboard needs the variables below.

## Admin dashboard

Edits text in both languages, contact details and links, project images, the profile photo, the CV, and the default color palette. Saving updates the live site immediately (no redeploy).

How it works:

- All content is one document in MongoDB (`content` collection, `_id: "site"`). Before the first save, the dashboard starts from the built-in files.
- Uploads go straight from the browser to Vercel Blob (`app/api/admin/upload`).
- Pages stay static; a save calls `revalidateTag` / `revalidatePath` to rebuild them.
- If the database can't be reached, the site falls back to the built-in content and the dashboard refuses to save, so nothing is overwritten.
- Saving checks links, image sources and `{placeholders}`, and rejects a save that was made on an older copy (two tabs or devices).

### Setup

1. **MongoDB Atlas**: create a free cluster, a database user, and allow access from anywhere (`0.0.0.0/0`) under *Network Access*, since Vercel has no fixed IP. Copy the connection string into `MONGODB_URI`.
2. **Vercel Blob**: in the Vercel project, go to *Storage → Create → Blob* and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`; copy it into `.env.local` for local uploads.
3. **Login**: set `ADMIN_PASSWORD` (8+ characters) and `ADMIN_SECRET` (32+ random characters):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
   Changing either value signs out every session.
4. Add the same variables in *Vercel → Settings → Environment Variables* and redeploy.

### Where things live

| Path | Purpose |
| --- | --- |
| `lib/content/types.ts` | Shape of the editable content |
| `lib/content/normalize.ts` | Defaults, clean-up and validation |
| `lib/content/store.ts` | Cached read for the site, versioned write |
| `lib/auth.ts` | Password check and signed session cookie |
| `app/admin/` | Login page, dashboard page, server actions |
| `components/admin/` | Dashboard UI (`tabs.tsx` lists every field) |

To add a new editable text, add it to `messages/en.json` and `messages/ar.json`, add the key to `lib/content/types.ts`, and add a `LocalizedText` field in `components/admin/tabs.tsx`.
