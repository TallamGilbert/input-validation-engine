import {
  Rule,
  ValidateOptions,
  ValidationResult,
  ValidationError,
} from "./types";
import { coerceValue } from "./coerce";

export function validate(
  value: unknown,
  rules: Rule[],
  options: ValidateOptions = {},
): ValidationResult {
  let workingValue = value;
  let originalValue: unknown = undefined;

  if (options.coerce) {
    const result = coerceValue(value, rules);
    if (result.changed) {
      originalValue = value;
      workingValue = result.value;
    }
  }

  const errors = rules
    .map((rule) => rule(workingValue))
    .filter((error): error is ValidationError => error !== null);

  return {
    valid: errors.length === 0,
    value: workingValue,
    ...(originalValue !== undefined && { originalValue }),
    errors,
  };
}
