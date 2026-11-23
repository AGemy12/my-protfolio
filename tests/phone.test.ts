import { describe, expect, it } from "vitest";
import { formatPhone, smartInternational } from "@/lib/phone";

describe("smartInternational", () => {
  it("adds the + when the digits start with a country code", () => {
    expect(smartInternational("966", "EG")).toBe("+966");
    expect(smartInternational("966 50 123 4567", "EG")).toBe("+966501234567");
    expect(smartInternational("20100", "SA")).toBe("+20100");
  });

  it("treats 00 as the international prefix", () => {
    expect(smartInternational("00", "EG")).toBe("+");
    expect(smartInternational("00966501234567", "EG")).toBe("+966501234567");
  });

  it("waits until the code is complete", () => {
    expect(smartInternational("9", "EG")).toBe("9");
    expect(smartInternational("96", "EG")).toBe("96");
  });

  it("leaves local numbers alone", () => {
    expect(smartInternational("01001234567", "EG")).toBe("01001234567"); // trunk 0
    expect(smartInternational("1001234567", "EG")).toBe("1001234567"); // Egyptian mobile
    expect(smartInternational("501234567", "SA")).toBe("501234567"); // Saudi mobile, not Belize (+501)
    expect(smartInternational("4155552671", "US")).toBe("4155552671"); // not Switzerland (+41)
  });

  it("keeps numbers that already have a +", () => {
    expect(smartInternational("+20 100", "SA")).toBe("+20 100");
  });
});

describe("formatPhone", () => {
  it("formats E.164 numbers for reading", () => {
    expect(formatPhone("+201001234567")).toBe("+20 10 01234567"); // Google's grouping for Egyptian mobiles
    expect(formatPhone("+966501234567")).toBe("+966 50 123 4567");
    expect(formatPhone("not a number")).toBe("not a number");
  });
});
