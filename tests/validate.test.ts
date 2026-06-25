import { describe, it, expect } from "vitest";
import { validate } from "../src/validate";
import { isRequired } from "../src/rules/isRequired";
import { isEmail } from "../src/rules/isEmail";

describe("validate", () => {
  it("returns valid true when rules pass", () => {
    const result = validate("hello", [isRequired]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns valid false with errors when rules fail", () => {
    const result = validate("", [isRequired]);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.rule).toBe("isRequired");
  });

  it("collects all failing rules", () => {
    // isEmail will be imported and fail on empty string
    const result = validate("", [isRequired, isEmail]);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  it("handles empty rules array", () => {
    const result = validate("anything", []);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
