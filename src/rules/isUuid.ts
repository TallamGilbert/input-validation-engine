import { Rule } from "../types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isUuid",
      code: "UUID_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (value.length === 0) {
    return {
      rule: "isUuid",
      code: "UUID_EMPTY",
      passed: false,
      message: "UUID must not be empty",
      value,
    };
  }

  // Check hyphens and segment structure BEFORE checking total length
  // This gives more specific error messages
  const segments = value.split("-");

  if (segments.length !== 5) {
    return {
      rule: "isUuid",
      code: "UUID_INVALID_FORMAT",
      passed: false,
      message: "UUID must have 5 segments separated by hyphens (8-4-4-4-12)",
      value,
    };
  }

  if (
    segments[0]?.length !== 8 ||
    segments[1]?.length !== 4 ||
    segments[2]?.length !== 4 ||
    segments[3]?.length !== 4 ||
    segments[4]?.length !== 12
  ) {
    return {
      rule: "isUuid",
      code: "UUID_INVALID_FORMAT",
      passed: false,
      message: "UUID segments must follow the pattern 8-4-4-4-12",
      value,
    };
  }

  // Now check the regex (catches non-hex characters)
  if (!UUID_REGEX.test(value)) {
    return {
      rule: "isUuid",
      code: "UUID_INVALID_CHARACTERS",
      passed: false,
      message: "UUID must contain only hexadecimal characters (0-9, a-f)",
      value,
    };
  }

  return null;
};
