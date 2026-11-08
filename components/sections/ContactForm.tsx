"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import emailjs from "emailjs-com";
import Button from "@/components/ui/Button";

const SERVICE_ID = "service_7461ifs";
const TEMPLATE_ID = "template_oyj3oxi";
const PUBLIC_KEY = "YpQSxGtzz2bm73j3B";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { type: "idle" | "sending" | "success" | "error"; message: string };

const labelClass = "grid gap-[7px] text-[13.5px] font-medium text-fg";

const fieldClass =
  "w-full rounded-xl border border-line bg-bg px-[15px] py-3 text-base font-normal text-fg placeholder:text-faint transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] focus:outline-none";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !EMAIL_PATTERN.test(form.email.trim())) {
      setStatus({ type: "error", message: t("invalid") });
      return;
    }

    setStatus({ type: "sending", message: "" });
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setStatus({ type: "success", message: t("success", { name: form.name.trim() }) });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({ type: "error", message: t("error") });
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid content-start gap-[18px]">
      <div className="grid gap-[18px] sm:grid-cols-2">
        <label htmlFor="contact-name" className={labelClass}>
          {t("name")}
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={update}
            className={fieldClass}
          />
        </label>
        <label htmlFor="contact-email" className={labelClass}>
          {t("email")}
          <input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update}
            className={`${fieldClass} rtl:text-right`}
          />
        </label>
      </div>
      <label htmlFor="contact-message" className={labelClass}>
        {t("message")}
        <textarea
          id="contact-message"
          name="message"
          placeholder={t("messagePlaceholder")}
          value={form.message}
          onChange={update}
          className={`${fieldClass} min-h-[150px] resize-y`}
        />
      </label>
      <div>
        <Button type="submit" icon="arrow" disabled={status.type === "sending"}>
          {status.type === "sending" ? t("sending") : t("send")}
        </Button>
      </div>
      <p
        role="status"
        className={`min-h-[1.4em] text-[14.5px] ${
          status.type === "success"
            ? "text-success"
            : status.type === "error"
              ? "text-danger"
              : "text-muted"
        }`}
      >
        {status.message}
      </p>
    </form>
  );
}
