import { Rule } from "../types";

export const isEmail: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isEmail",
      code: "EMAIL_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (value.length === 0) {
    return {
      rule: "isEmail",
      code: "EMAIL_EMPTY",
      passed: false,
      message: "Email must not be empty",
      value,
    };
  }

  if (!value.includes("@")) {
    return {
      rule: "isEmail",
      code: "EMAIL_MISSING_AT",
      passed: false,
      message: "Email must contain an @ symbol",
      value,
    };
  }

  const parts = value.split("@");

  if (parts.length !== 2) {
    return {
      rule: "isEmail",
      code: "EMAIL_MISSING_AT",
      passed: false,
      message: "Email must contain exactly one @ symbol",
      value,
    };
  }

  const [localPart, domain] = parts as [string, string];

  if (localPart.length === 0) {
    return {
      rule: "isEmail",
      code: "EMAIL_LOCAL_PART_EMPTY",
      passed: false,
      message: "Email local part (before @) must not be empty",
      value,
    };
  }

  if (domain.length === 0) {
    return {
      rule: "isEmail",
      code: "EMAIL_DOMAIN_EMPTY",
      passed: false,
      message: "Email domain (after @) must not be empty",
      value,
    };
  }

  if (!domain.includes(".")) {
    return {
      rule: "isEmail",
      code: "EMAIL_DOMAIN_NO_DOT",
      passed: false,
      message: "Email domain must contain a dot",
      value,
    };
  }

  const domainParts = domain.split(".");

  for (const part of domainParts) {
    if (part.length === 0) {
      return {
        rule: "isEmail",
        code: "EMAIL_DOMAIN_PART_EMPTY",
        passed: false,
        message:
          "Email domain parts must not be empty (consecutive dots not allowed)",
        value,
      };
    }
  }

  if (localPart.includes("..")) {
    return {
      rule: "isEmail",
      code: "EMAIL_LOCAL_PART_CONSECUTIVE_DOTS",
      passed: false,
      message: "Email local part must not contain consecutive dots",
      value,
    };
  }

  // Check for spaces anywhere
  if (/\s/.test(value)) {
    return {
      rule: "isEmail",
      code: "EMAIL_CONTAINS_SPACES",
      passed: false,
      message: "Email must not contain spaces",
      value,
    };
  }

  return null;
};
