import { Rule, ValidationError } from "../types";

interface PasswordOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireDigit?: boolean;
  requireSpecialChar?: boolean;
}

// This rule needs to accept options, so it's a factory function that returns a Rule
export function createPasswordStrengthRule(
  options: PasswordOptions = {},
): Rule {
  const {
    minLength = 8,
    requireUppercase = true,
    requireDigit = true,
    requireSpecialChar = true,
  } = options;

  return (value: unknown): ValidationError | null => {
    if (typeof value !== "string") {
      return {
        rule: "isPasswordStrength",
        code: "PASSWORD_NOT_STRING",
        passed: false,
        message: "Password must be a string",
        value,
      };
    }

    const failures: string[] = [];

    if (value.length < minLength) {
      failures.push(
        `at least ${minLength} characters (currently ${value.length})`,
      );
    }

    if (requireUppercase && !/[A-Z]/.test(value)) {
      failures.push("at least one uppercase letter");
    }

    if (requireDigit && !/[0-9]/.test(value)) {
      failures.push("at least one digit");
    }

    if (requireSpecialChar && !/[^A-Za-z0-9]/.test(value)) {
      failures.push("at least one special character");
    }

    if (failures.length === 0) {
      return null;
    }

    return {
      rule: "isPasswordStrength",
      code: "PASSWORD_WEAK",
      passed: false,
      message: `Password requires: ${failures.join(", ")}`,
      value,
    };
  };
}

// Default instance with the standard requirements
export const isPasswordStrength: Rule = createPasswordStrengthRule();
