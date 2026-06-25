import { describe, it, expect } from "vitest";
import { isDate } from "../src/rules/isDate";

describe("isDate", () => {
  it("accepts valid date only", () => {
    expect(isDate("2024-01-15")).toBeNull();
  });

  it("accepts full ISO datetime with Z", () => {
    expect(isDate("2024-01-15T14:30:00Z")).toBeNull();
  });

  it("accepts datetime with timezone offset", () => {
    expect(isDate("2024-01-15T14:30:00+05:00")).toBeNull();
  });

  it("accepts end of month", () => {
    expect(isDate("2024-01-31")).toBeNull();
  });

  it("accepts leap year date", () => {
    expect(isDate("2024-02-29")).toBeNull();
  });

  it("rejects month 13", () => {
    const result = isDate("2024-13-01");
    expect(result).not.toBeNull();
  });

  it("rejects February 30", () => {
    const result = isDate("2024-02-30");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("not a valid calendar date");
  });

  it("rejects February 29 in non-leap year", () => {
    const result = isDate("2023-02-29");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("not a valid calendar date");
  });

  it("rejects wrong format (MM/DD/YYYY)", () => {
    const result = isDate("01/15/2024");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("ISO 8601");
  });

  it("rejects empty string", () => {
    const result = isDate("");
    expect(result).not.toBeNull();
  });

  it("rejects random string", () => {
    const result = isDate("not-a-date");
    expect(result).not.toBeNull();
  });

  it("rejects non-string input", () => {
    const result = isDate(42);
    expect(result).not.toBeNull();
    expect(result?.message).toContain("string");
  });
});
