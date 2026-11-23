import { describe, expect, it } from "vitest";
import {
  buildMessage,
  channelUrl,
  defaultContactForm,
  plainText,
  renderTemplate,
  templateKeys,
  waDigits,
} from "@/lib/contact-form";

describe("renderTemplate", () => {
  it("fills variables and drops lines whose variables are all empty", () => {
    const text = renderTemplate("Hi {{name}}\nSubject: {{subject}}\n\n\n\n{{message}}", {
      name: "Sara",
      subject: "",
      message: "Hello",
    });
    expect(text).toBe("Hi Sara\n\nHello");
  });

  it("keeps a line when at least one of its variables is filled", () => {
    expect(renderTemplate("{{a}} / {{b}}\nend", { a: "x", b: "" })).toBe("x / \nend");
  });

  it("lists the variables a template uses", () => {
    expect(templateKeys("{{ name }} and {{email}} and {not}")).toEqual(["name", "email"]);
  });
});

describe("buildMessage", () => {
  const values = {
    name: "Sara",
    email: "sara@example.com",
    whatsapp: "+20 100 123 4567",
    projectType: ["store"],
    timeline: "",
    message: "I sell handmade bags.",
  };

  it("uses option labels in the visitor's language", () => {
    const { text, subject } = buildMessage(defaultContactForm, values, "ar");
    expect(text).toContain("متجر إلكتروني");
    expect(text).not.toContain("{{");
    expect(text).not.toContain("الموعد"); // timeline left empty → line dropped
    expect(subject).toBe("طلب مشروع جديد من Sara");
  });

  it("ignores values for fields that are switched off", () => {
    const { text } = buildMessage(defaultContactForm, { ...values, subject: "Secret" }, "en");
    expect(text).not.toContain("Secret");
  });

  it("falls back to listing every field when the template is empty", () => {
    const config = { ...defaultContactForm, template: { en: "", ar: "" } };
    expect(buildMessage(config, values, "en").text).toContain("*Your name:* Sara");
  });
});

describe("links", () => {
  it("reads the number out of a wa.me link or a phone number", () => {
    expect(waDigits("https://wa.me/201001234567")).toBe("201001234567");
    expect(waDigits("+20 100 123 4567")).toBe("201001234567");
  });

  it("builds a WhatsApp link with the message", () => {
    expect(channelUrl("whatsapp", "+20 100 123 4567", "", "Hi *there*")).toBe(
      "https://wa.me/201001234567?text=Hi%20*there*",
    );
  });

  it("strips WhatsApp bold marks for email", () => {
    expect(plainText("*Need:* a site")).toBe("Need: a site");
    expect(channelUrl("email", "me@x.com", "S", "*A*")).toBe("mailto:me@x.com?subject=S&body=A");
  });

  it("has nothing to open for channels the server delivers", () => {
    expect(channelUrl("gmail", "me@x.com", "S", "A")).toBe("");
  });
});
