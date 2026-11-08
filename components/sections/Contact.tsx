import Section from "@/components/ui/Section";
import CopyButton from "@/components/ui/CopyButton";
import ContactForm from "@/components/sections/ContactForm";
import { profile } from "@/data/portfolio";

const linkClass =
  "relative font-medium text-fg after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-calm hover:after:scale-x-100";

export default function Contact() {
  const channels = [
    { label: "Email", value: profile.email, copy: true },
    { label: "Phone and WhatsApp", value: profile.phone, copy: true, href: profile.whatsapp },
    { label: "LinkedIn", value: profile.name, href: profile.linkedin },
    { label: "GitHub", value: "AGemy12", href: profile.github },
  ];

  return (
    <Section
      id="contact"
      label="Contact"
      title="Have a project in mind? Let's talk."
      intro="Send me a short message about what you're building. I usually reply within a day."
    >
      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
        <div className="self-start border-b border-line">
          {channels.map((channel) => (
            <div
              key={channel.label}
              className="flex items-center justify-between gap-3.5 border-t border-line py-[18px]"
            >
              <div className="min-w-0">
                <small className="block text-[13.5px] text-faint">{channel.label}</small>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {channel.value}
                  </a>
                ) : (
                  <span className="break-words">{channel.value}</span>
                )}
              </div>
              {channel.copy && <CopyButton text={channel.value} />}
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
