import { Rule } from "../types";

export const isUrl: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isUrl",
      code: "URL_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (value.length === 0) {
    return {
      rule: "isUrl",
      code: "URL_EMPTY",
      passed: false,
      message: "URL must not be empty",
      value,
    };
  }

  try {
    const url = new URL(value);

    // Must have http or https protocol
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return {
        rule: "isUrl",
        code: "URL_INVALID_PROTOCOL",
        passed: false,
        message: "URL must use http or https protocol",
        value,
      };
    }

    // Must have a hostname with at least one dot (or be localhost)
    if (url.hostname !== "localhost" && !url.hostname.includes(".")) {
      return {
        rule: "isUrl",
        code: "URL_INVALID_DOMAIN",
        passed: false,
        message: "URL must have a valid domain with a TLD",
        value,
      };
    }

    return null;
  } catch {
    return {
      rule: "isUrl",
      code: "URL_INVALID_FORMAT",
      passed: false,
      message: "URL format is invalid",
      value,
    };
  }
};
