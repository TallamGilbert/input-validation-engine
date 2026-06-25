import { describe, it, expect } from "vitest";
import {
  isPasswordStrength,
  createPasswordStrengthRule,
} from "../src/rules/isPasswordStrength";

describe("isPasswordStrength", () => {
  it("accepts password meeting all criteria", () => {
    expect(isPasswordStrength("StrongP@ss1")).toBeNull();
  });

  it("accepts exactly 8 chars with all criteria", () => {
    expect(isPasswordStrength("Abcdef1!")).toBeNull();
  });

  it("accepts password with multiple special chars", () => {
    expect(isPasswordStrength("P@$$w0rd!")).toBeNull();
  });

  it("rejects too short password", () => {
    const result = isPasswordStrength("Ab1!");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("at least 8");
  });

  it("rejects password with no uppercase", () => {
    const result = isPasswordStrength("weakp@ss1");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("uppercase");
  });

  it("rejects password with no digit", () => {
    const result = isPasswordStrength("WeakP@ssword");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("digit");
  });

  it("rejects password with no special char", () => {
    const result = isPasswordStrength("WeakPass1");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("special character");
  });

  it("reports all failures at once", () => {
    const result = isPasswordStrength("short");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("at least 8");
    expect(result?.message).toContain("uppercase");
    expect(result?.message).toContain("digit");
    expect(result?.message).toContain("special character");
  });

  it("rejects empty string", () => {
    const result = isPasswordStrength("");
    expect(result).not.toBeNull();
  });

  it("supports custom options via factory", () => {
    const customRule = createPasswordStrengthRule({
      minLength: 4,
      requireUppercase: false,
      requireDigit: true,
      requireSpecialChar: false,
    });

    // Should pass: meets the custom criteria
    expect(customRule("abc1")).toBeNull();

    // Should fail: missing digit
    const result = customRule("abcd");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("digit");
  });
});
