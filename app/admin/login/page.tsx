import { redirect } from "next/navigation";
import { isAdmin, isAuthConfigured } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-[380px] rounded-[22px] border border-line bg-surface p-8">
        <h1 className="text-[1.7rem]">لوحة التحكم</h1>
        <p className="mt-1.5 text-muted">سجّل الدخول لتعديل محتوى الموقع.</p>
        {isAuthConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-xl bg-panel p-4 text-[14px] leading-7 text-muted">
            لم يتم إعداد الدخول بعد. أضف <code dir="ltr">ADMIN_PASSWORD</code> (٨ أحرف على الأقل) و
            <code dir="ltr"> ADMIN_SECRET</code> (٣٢ حرفاً على الأقل) إلى متغيرات البيئة ثم أعد التشغيل.
          </p>
        )}
      </div>
    </main>
  );
}
