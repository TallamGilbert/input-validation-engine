import { describe, it, expect } from "vitest";
import { isPhoneNumber } from "../src/rules/isPhoneNumber";

describe("isPhoneNumber", () => {
  it("accepts valid US number", () => {
    expect(isPhoneNumber("+14155552671")).toBeNull();
  });

  it("accepts minimum length (7 digits)", () => {
    expect(isPhoneNumber("+1234567")).toBeNull();
  });

  it("accepts maximum length (15 digits)", () => {
    expect(isPhoneNumber("+123456789012345")).toBeNull();
  });

  it("rejects missing plus sign", () => {
    const result = isPhoneNumber("14155552671");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("start with +");
  });

  it("rejects letters in number", () => {
    const result = isPhoneNumber("+1415abc2671");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("only digits");
  });

  it("rejects number with spaces", () => {
    const result = isPhoneNumber("+254 712 345 678");
    expect(result).not.toBeNull();
  });

  it("rejects too short (less than 7 digits)", () => {
    const result = isPhoneNumber("+123456");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("at least 7");
  });

  it("rejects too long (more than 15 digits)", () => {
    const result = isPhoneNumber("+1234567890123456");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("15 digits");
  });

  it("rejects empty string", () => {
    const result = isPhoneNumber("");
    expect(result).not.toBeNull();
  });

  it("rejects just plus sign", () => {
    const result = isPhoneNumber("+");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("digits after +");
  });

  it("rejects country code starting with 0", () => {
    const result = isPhoneNumber("+0123456789");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("not start with 0");
  });
});
