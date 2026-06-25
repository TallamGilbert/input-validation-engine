export interface ValidationError {
  rule: string;
  code: string;
  passed: false;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  value: unknown;
  originalValue?: unknown;
  errors: ValidationError[];
}

export type Rule = (value: unknown) => ValidationError | null;

export interface ValidateOptions {
  coerce?: boolean;
}
