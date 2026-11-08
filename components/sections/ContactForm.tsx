"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import Button from "@/components/ui/Button";

const SERVICE_ID = "service_7461ifs";
const TEMPLATE_ID = "template_oyj3oxi";
const PUBLIC_KEY = "YpQSxGtzz2bm73j3B";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { type: "idle" | "sending" | "success" | "error"; message: string };

const fieldClass =
  "w-full rounded-[10px] border border-line bg-surface px-[15px] py-[13px] text-base text-fg transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)] focus:outline-none";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !EMAIL_PATTERN.test(form.email.trim())) {
      setStatus({
        type: "error",
        message: "Please add your name and a valid email address.",
      });
      return;
    }

    setStatus({ type: "sending", message: "" });
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
      setStatus({
        type: "success",
        message: `Thanks, ${form.name.trim()}. Your message is on its way.`,
      });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        type: "error",
        message: "Your message couldn't be sent. Please try again or email me directly.",
      });
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-[18px]">
      <div className="grid gap-[18px] sm:grid-cols-2">
        <label htmlFor="contact-name" className="grid gap-[7px] text-sm text-muted">
          Name
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={update}
            className={fieldClass}
          />
        </label>
        <label htmlFor="contact-email" className="grid gap-[7px] text-sm text-muted">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            className={fieldClass}
          />
        </label>
      </div>
      <label htmlFor="contact-message" className="grid gap-[7px] text-sm text-muted">
        Message
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={update}
          className={`${fieldClass} min-h-[130px] resize-y`}
        />
      </label>
      <div>
        <Button type="submit" arrow disabled={status.type === "sending"}>
          {status.type === "sending" ? "Sending…" : "Send message"}
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
