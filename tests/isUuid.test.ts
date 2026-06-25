import { describe, it, expect } from "vitest";
import { isUuid } from "../src/rules/isUuid";

describe("isUuid", () => {
  it("accepts valid UUID v4", () => {
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBeNull();
  });

  it("accepts uppercase UUID", () => {
    expect(isUuid("550E8400-E29B-41D4-A716-446655440000")).toBeNull();
  });

  it("accepts nil UUID", () => {
    expect(isUuid("00000000-0000-0000-0000-000000000000")).toBeNull();
  });

  it("rejects UUID with wrong segment lengths (short last segment)", () => {
    const result = isUuid("550e8400-e29b-41d4-a716-4466554400");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("8-4-4-4-12");
  });

  it("rejects UUID with non-hex characters", () => {
    const result = isUuid("550e8400-e29b-41d4-a716-44665544000g");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("hexadecimal");
  });

  it("rejects UUID with missing hyphens", () => {
    const result = isUuid("550e8400e29b41d4a716446655440000");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("5 segments");
  });

  it("rejects UUID with wrong segment lengths", () => {
    const result = isUuid("550e8400-e29b-41d4-a716-4466554400");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("8-4-4-4-12");
  });

  it("rejects empty string", () => {
    const result = isUuid("");
    expect(result).not.toBeNull();
  });

  it("rejects non-string input", () => {
    const result = isUuid(null);
    expect(result).not.toBeNull();
    expect(result?.message).toContain("string");
  });
});
