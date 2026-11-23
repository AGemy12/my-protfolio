import { adminContactForm, adminSettings } from "@/lib/admin-data";
import { waDigits } from "@/lib/contact-form";
import { mailbox } from "@/lib/mailer";
import { ContactFormEditor } from "@/components/admin/contact-form-editor";

export default async function ContactFormPage() {
  const [form, { settings }] = await Promise.all([adminContactForm(), adminSettings()]);
  const whatsapp = waDigits(settings.whatsapp) || waDigits(settings.phone);
  return (
    <ContactFormEditor
      initial={form}
      targets={{ whatsapp: whatsapp ? `+${whatsapp}` : "", email: settings.email, gmail: mailbox() }}
    />
  );
}
