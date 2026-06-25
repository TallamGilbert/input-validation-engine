import { describe, it, expect } from "vitest";
import { validate } from "../src/validate";
import { isEmail } from "../src/rules/isEmail";
import { isPhoneNumber } from "../src/rules/isPhoneNumber";

describe("coercion", () => {
  it("trims whitespace from string input", () => {
    const result = validate("  test@test.com  ", [isEmail], { coerce: true });
    expect(result.valid).toBe(true);
    expect(result.value).toBe("test@test.com");
    expect(result.originalValue).toBe("  test@test.com  ");
  });

  it("lowercases email when isEmail rule is active", () => {
    const result = validate("TEST@TEST.COM", [isEmail], { coerce: true });
    expect(result.valid).toBe(true);
    expect(result.value).toBe("test@test.com");
    expect(result.originalValue).toBe("TEST@TEST.COM");
  });

  it("strips formatting from phone numbers when isPhoneNumber rule is active", () => {
    const result = validate("+1 (415) 555-2671", [isPhoneNumber], {
      coerce: true,
    });
    expect(result.valid).toBe(true);
    expect(result.value).toBe("+14155552671");
  });

  it("does not report originalValue when value was not changed", () => {
    const result = validate("test@test.com", [isEmail], { coerce: true });
    expect(result.valid).toBe(true);
    expect(result.originalValue).toBeUndefined();
  });

  it("does not coerce when coerce option is false", () => {
    const result = validate("  test@test.com  ", [isEmail]);
    expect(result.valid).toBe(false);
    expect(result.originalValue).toBeUndefined();
  });

  it("coerces value but still fails if coerced value is invalid", () => {
    const result = validate("  not-an-email  ", [isEmail], { coerce: true });
    expect(result.valid).toBe(false);
    expect(result.value).toBe("not-an-email");
  });
});
