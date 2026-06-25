import { describe, it, expect } from "vitest";
import { isRequired } from "../src/rules/isRequired";

describe("isRequired", () => {
  it("returns null for a non-empty string", () => {
    expect(isRequired("hello")).toBeNull();
  });

  it("returns null for zero (falsy but present)", () => {
    expect(isRequired(0)).toBeNull();
  });

  it("returns error for empty string", () => {
    const result = isRequired("");
    expect(result).not.toBeNull();
    expect(result?.rule).toBe("isRequired");
    expect(result?.passed).toBe(false);
  });

  it("returns error for null", () => {
    const result = isRequired(null);
    expect(result).not.toBeNull();
    expect(result?.rule).toBe("isRequired");
    expect(result?.passed).toBe(false);
  });

  it("returns error for undefined", () => {
    const result = isRequired(undefined);
    expect(result).not.toBeNull();
    expect(result?.rule).toBe("isRequired");
    expect(result?.passed).toBe(false);
  });

  it("returns error for whitespace-only string", () => {
    const result = isRequired("   ");
    expect(result).not.toBeNull();
    expect(result?.rule).toBe("isRequired");
  });
});
