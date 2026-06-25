import { Rule } from "../types";

// E.164: + followed by 1-3 digit country code, then subscriber number
// Total length: minimum 7 digits after +, maximum 15 digits total
// Only digits 0-9 allowed after the +

export const isPhoneNumber: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (value.length === 0) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_EMPTY",
      passed: false,
      message: "Phone number must not be empty",
      value,
    };
  }

  if (!value.startsWith("+")) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_INVALID_FORMAT",
      passed: false,
      message: "Phone number must start with + (E.164 format)",
      value,
    };
  }

  const digits = value.slice(1);

  if (digits.length === 0) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_NO_DIGITS",
      passed: false,
      message: "Phone number must have digits after +",
      value,
    };
  }

  if (!/^\d+$/.test(digits)) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_INVALID_CHARACTERS",
      passed: false,
      message: "Phone number must contain only digits after +",
      value,
    };
  }

  if (digits.length < 7) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_TOO_SHORT",
      passed: false,
      message: "Phone number must have at least 7 digits (E.164 minimum)",
      value,
    };
  }

  if (digits.length > 15) {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_TOO_LONG",
      passed: false,
      message: "Phone number must not exceed 15 digits (E.164 maximum)",
      value,
    };
  }

  // Country code must be 1-3 digits and not start with 0
  // We check the first digit after + is not 0
  if (digits[0] === "0") {
    return {
      rule: "isPhoneNumber",
      code: "PHONE_NUMBER_INVALID_COUNTRY_CODE",
      passed: false,
      message: "Country code must not start with 0",
      value,
    };
  }

  return null;
};
