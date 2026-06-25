import { describe, it, expect } from "vitest";
import {
  validate,
  isEmail,
  isRequired,
  isPhoneNumber,
  isUuid,
} from "../src/index";

describe("README quick start examples", () => {
  it("basic validation passes", () => {
    const result = validate("user@example.com", [isEmail, isRequired]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns specific error message for invalid email", () => {
    const result = validate("not-an-email", [isEmail]);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain("@");
  });

  it("coerces whitespace and case for email", () => {
    const result = validate("  USER@EXAMPLE.COM  ", [isEmail], {
      coerce: true,
    });
    expect(result.valid).toBe(true);
    expect(result.value).toBe("user@example.com");
  });

  it("validates phone number", () => {
    const result = validate("+14155552671", [isRequired, isPhoneNumber]);
    expect(result.valid).toBe(true);
  });

  it("validates UUID", () => {
    const result = validate("550e8400-e29b-41d4-a716-446655440000", [
      isRequired,
      isUuid,
    ]);
    expect(result.valid).toBe(true);
  });

  it("returns multiple errors when multiple rules fail", () => {
    const result = validate("", [isRequired, isEmail]);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
