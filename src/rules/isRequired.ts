import { Rule } from "../types";

export const isRequired: Rule = (value: unknown) => {
  if (value === null || value === undefined) {
    return {
      rule: "isRequired",
      code: "REQUIRED_VALUE_MISSING",
      passed: false,
      message: "Value is required",
      value,
    };
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return {
      rule: "isRequired",
      code: "REQUIRED_VALUE_MISSING",
      passed: false,
      message: "Value is required",
      value,
    };
  }

  return null;
};
