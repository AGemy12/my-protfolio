"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-7 grid gap-4">
      <label className="grid gap-1.5">
        <span className="text-[13.5px] text-muted">كلمة المرور</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          dir="ltr"
          className="rounded-xl border border-line bg-bg px-3.5 py-2.5 outline-none transition-colors focus:border-accent"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-[14px] text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-fg px-5 py-2.5 font-medium text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-60"
      >
        {pending ? "جارٍ الدخول…" : "دخول"}
      </button>
    </form>
  );
}
