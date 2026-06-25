import { describe, it, expect } from "vitest";
import { isUrl } from "../src/rules/isUrl";

describe("isUrl", () => {
  it("accepts standard https URL", () => {
    expect(isUrl("https://example.com")).toBeNull();
  });

  it("accepts http URL", () => {
    expect(isUrl("http://example.com")).toBeNull();
  });

  it("accepts URL with path", () => {
    expect(isUrl("https://example.com/path/to/page")).toBeNull();
  });

  it("accepts URL with query string", () => {
    expect(isUrl("https://example.com?q=search&page=1")).toBeNull();
  });

  it("accepts URL with port", () => {
    expect(isUrl("https://example.com:8080")).toBeNull();
  });

  it("accepts localhost", () => {
    expect(isUrl("http://localhost")).toBeNull();
  });

  it("accepts localhost with port", () => {
    expect(isUrl("http://localhost:3000")).toBeNull();
  });

  it("rejects missing protocol", () => {
    const result = isUrl("example.com");
    expect(result).not.toBeNull();
  });

  it("rejects ftp protocol", () => {
    const result = isUrl("ftp://example.com");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("http or https");
  });

  it("rejects empty string", () => {
    const result = isUrl("");
    expect(result).not.toBeNull();
  });

  it("rejects random string", () => {
    const result = isUrl("not-a-url");
    expect(result).not.toBeNull();
    expect(result?.message).toContain("invalid");
  });

  it("rejects non-string input", () => {
    const result = isUrl(12345);
    expect(result).not.toBeNull();
    expect(result?.message).toContain("string");
  });
});
