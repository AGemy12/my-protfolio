# Ahmad Marzouk — Portfolio

Full-stack Next.js 16 portfolio with a built-in admin dashboard.

- **Site**: bilingual (English / Arabic with RTL), dark / light theme, SEO (metadata, hreflang, sitemap, JSON-LD), static pages regenerated on every edit.
- **Dashboard** (`/en/admin`): profile and site settings, projects, experience, skills, services, contact messages inbox, media library (Vercel Blob), password change, show/hide home sections, reorder and publish items.
- **Stack**: Next.js App Router · Server Actions · MongoDB (Mongoose) · Vercel Blob · next-intl · next-themes · Tailwind CSS v4 · Motion · Zod · jose (JWT) · bcryptjs.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Without `MONGODB_URI` the site still renders using the starter content in `lib/defaults.ts`, but the dashboard can't save anything.

## Deploy on Vercel

1. Push the repo to GitHub and import it in Vercel.
2. **Storage → Create → Blob**, connect it to the project (this sets `BLOB_READ_WRITE_TOKEN`).
3. Add a MongoDB database: either the **MongoDB Atlas** integration from the Vercel marketplace, or create a free Atlas cluster and set `MONGODB_URI` yourself. In Atlas, allow access from anywhere (`0.0.0.0/0`), because Vercel IPs are dynamic.
4. Set the remaining env vars: `AUTH_SECRET` (32+ random chars), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `NEXT_PUBLIC_SITE_URL` (your domain).
5. Deploy, open `/en/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The first login creates the admin account with a hashed password; after that you can change the password from **Account** and remove `ADMIN_PASSWORD` from Vercel.
6. On **Overview**, click **Import starter content** to copy the CV content into MongoDB. Everything is now editable.

## Project layout

```
app/[locale]/(site)/        public pages: home, /projects, /projects/[slug]
app/[locale]/admin/         login + dashboard (protected by proxy.ts and checked again in every action)
app/api/upload/route.ts     issues Vercel Blob upload tokens (admin only); files go browser → Blob directly
lib/models.ts               Mongoose models
lib/schemas.ts              Zod validation for every write
lib/resources.ts            field definitions that generate the dashboard forms and lists
lib/actions/                server actions (auth, content CRUD, contact form)
lib/data.ts                 public reads, with fallback to lib/defaults.ts
messages/en.json, ar.json   all UI text
```

### Adding a field to a collection

1. Add it to the model in `lib/models.ts` and the type in `lib/types.ts`.
2. Add it to the Zod schema in `lib/schemas.ts`.
3. Add one line to `fields` in `lib/resources.ts`, plus a label under `admin.fields` in both message files.

The dashboard form picks it up automatically.

## Notes

- Mongoose models are deliberately untyped (`Model<any>`): Mongoose 9's schema type inference makes `tsc` run out of memory. Writes are validated with Zod and reads are typed through `lib/types.ts`.
- Every save calls `revalidatePath("/", "layout")`, so the static pages rebuild with the new content on the next request.
