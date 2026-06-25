import { Rule } from "../types";

// Strict ISO 8601 regex: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss... with optional timezone
const ISO_REGEX =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

export const isDate: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isDate",
      code: "DATE_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (value.length === 0) {
    return {
      rule: "isDate",
      passed: false,
      code: "DATE_INVALID_FORMAT",
      message: "Date must not be empty",
      value,
    };
  }

  // First check: does it match ISO 8601 format at all?
  if (!ISO_REGEX.test(value)) {
    return {
      rule: "isDate",
      code: "DATE_INVALID_FORMAT",
      passed: false,
      message:
        "Date must be in ISO 8601 format (e.g., 2024-01-15 or 2024-01-15T14:30:00Z)",
      value,
    };
  }

  // Second check: is it a real calendar date?
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      rule: "isDate",
      code: "DATE_INVALID",
      passed: false,
      message: "Date must be a valid calendar date",
      value,
    };
  }

  // Third check: did JS silently roll the date? (e.g. Feb 30 -> Mar 1)
  const isoString = date.toISOString();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Date-only input: compare the date portion
    const parsedDate = isoString.slice(0, 10);
    if (parsedDate !== value) {
      return {
        rule: "isDate",
        code: "DATE_INVALID_CALENDAR",
        passed: false,
        message:
          "Date is not a valid calendar date (e.g., February 30 does not exist)",
        value,
      };
    }
  }

  return null;
};
