import { describe, expect, it } from "vitest";
import { checkContact, checkField, normalizeWhatsApp } from "@/lib/contact-rules";
import { defaultContactForm, newField, type ContactFieldDef } from "@/lib/contact-form";

const field = (key: string) => defaultContactForm.fields.find((f) => f.key === key) as ContactFieldDef;

describe("normalizeWhatsApp", () => {
  it.each([
    ["+20 100 123 4567", "+201001234567"],
    ["0020-100-123-4567", "+201001234567"],
    ["+1 (555) 010-2030", "+15550102030"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeWhatsApp(input)).toBe(expected);
  });
});

describe("checkField", () => {
  it("applies a text field's length limits", () => {
    expect(checkField(field("name"), "")).toEqual({ code: "required" });
    expect(checkField(field("name"), " a ")).toEqual({ code: "tooShort", count: 1, min: 2 });
    expect(checkField(field("name"), "Ali")).toBeNull();
  });

  it("explains what is wrong with an email", () => {
    const email = field("email");
    expect(checkField(email, "a b@x.com")).toEqual({ code: "emailSpaces" });
    expect(checkField(email, "ali.example.com")).toEqual({ code: "emailNoAt" });
    expect(checkField(email, "@example.com")).toEqual({ code: "emailNoName" });
    expect(checkField(email, "ali@example")).toEqual({ code: "emailNoDomain" });
    expect(checkField(email, "ali@example.com")).toBeNull();
  });

  it("checks a phone number against its country's numbering plan", () => {
    const phone = field("whatsapp");
    expect(checkField(phone, "01001234567")).toEqual({ code: "phoneCountryCode" });
    expect(checkField(phone, "+20 abc")).toEqual({ code: "phoneChars" });
    expect(checkField(phone, "+20 11")).toEqual({ code: "phoneTooShort" });
    expect(checkField(phone, "+20 100 123 4567 89")).toEqual({ code: "phoneTooLong" });
    expect(checkField(phone, "+999 1234 5678")).toEqual({ code: "phoneCountryCode" });
    expect(checkField(phone, "+20 100 123 4567")).toBeNull(); // Egypt
    expect(checkField(phone, "+966 50 123 4567")).toBeNull(); // Saudi Arabia
    expect(checkField(phone, "+44 7400 123456")).toBeNull(); // UK
    expect(checkField(phone, "+1 415 555 2671")).toBeNull(); // US
  });

  it("bounds a long text and reports the count", () => {
    const details = { ...field("message"), min: 10 };
    expect(checkField(details, "short")).toEqual({ code: "tooShort", count: 5, min: 10 });
    expect(checkField(details, "x".repeat(5001))).toEqual({ code: "tooLong", count: 5001, max: 5000 });
    expect(checkField(details, "Hello, I have a project.")).toBeNull();
  });

  it("lets the project details stay empty by default", () => {
    expect(checkField(field("message"), "")).toBeNull();
    expect(checkField(field("message"), "Hi")).toBeNull();
  });

  it("lets an optional field stay empty", () => {
    expect(checkField(field("subject"), "")).toBeNull();
    expect(checkField(field("timeline"), "")).toBeNull();
  });

  it("only accepts listed options, one unless the field allows more", () => {
    const type = field("projectType");
    expect(checkField(type, [])).toEqual({ code: "requiredChoice" });
    expect(checkField(type, ["website"])).toBeNull();
    expect(checkField(type, ["hacked"])).toEqual({ code: "invalidChoice" });
    expect(checkField(type, ["website", "store"])).toEqual({ code: "invalidChoice" });
    expect(checkField({ ...type, multiple: true }, ["website", "store"])).toBeNull();
    expect(checkField(field("timeline"), "month")).toBeNull();
  });
});

describe("checkContact", () => {
  it("returns one error per invalid field and ignores non-strings", () => {
    const errors = checkContact(defaultContactForm.fields, {
      name: "A",
      email: 42 as unknown as string,
      whatsapp: "+201001234567",
      projectType: ["website"],
      message: "Hello there!",
    });
    expect(Object.keys(errors).sort()).toEqual(["email", "name"]);
  });

  it("skips fields that are switched off", () => {
    const hidden = { ...newField("company"), required: true, enabled: false };
    expect(checkContact([hidden], {})).toEqual({});
  });
});
