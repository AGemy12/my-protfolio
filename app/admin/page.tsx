import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { readStoredContent, type StoredContent } from "@/lib/content/store";
import Dashboard from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  let stored: StoredContent;
  try {
    stored = await readStoredContent();
  } catch (error) {
    console.error("[admin] Could not read content", error);
    // Editing is blocked here so a save can't replace the real content with
    // the built-in defaults.
    return (
      <main className="grid min-h-svh place-items-center px-4">
        <div className="max-w-[440px] rounded-[22px] border border-line bg-surface p-8">
          <h1 className="text-[1.5rem]">تعذّر الاتصال بقاعدة البيانات</h1>
          <p className="mt-2 text-muted">
            تحقق من <code dir="ltr">MONGODB_URI</code> ومن السماح لعنوان الخادم في MongoDB Atlas
            (Network Access)، ثم أعد تحميل الصفحة.
          </p>
        </div>
      </main>
    );
  }

  return (
    <Dashboard
      initial={stored}
      dbReady={isDbConfigured()}
      uploadsReady={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
    />
  );
}
