import { describe, it, expect } from "vitest";
import { isEmail } from "../src/rules/isEmail";

describe("isEmail", () => {
  it("accepts a standard email", () => {
    expect(isEmail("user@example.com")).toBeNull();
  });

  it("accepts subdomains", () => {
    expect(isEmail("user@mail.example.co.uk")).toBeNull();
  });

  it("accepts plus addressing", () => {
    expect(isEmail("user+tag@example.com")).toBeNull();
  });

  it("rejects missing @ symbol", () => {
    const result = isEmail("userexample.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("@");
  });

  it("rejects multiple @ symbols", () => {
    const result = isEmail("user@domain@example.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("exactly one");
  });

  it("rejects empty local part", () => {
    const result = isEmail("@example.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("local part");
  });

  it("rejects empty domain", () => {
    const result = isEmail("user@");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("domain");
  });

  it("rejects domain without dot", () => {
    const result = isEmail("user@localhost");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("dot");
  });

  it("rejects consecutive dots in domain", () => {
    const result = isEmail("user@example..com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("consecutive dots");
  });

  it("rejects consecutive dots in local part", () => {
    const result = isEmail("user..name@example.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("consecutive dots");
  });

  it("rejects spaces in email", () => {
    const result = isEmail("user name@example.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("spaces");
  });

  it("rejects empty string", () => {
    const result = isEmail("");
    expect(result).not.toBeNull();
  });

  it("rejects non-string input", () => {
    const result = isEmail(12345);
    expect(result).not.toBeNull();
    expect(result?.message).toContain("string");
  });
});
