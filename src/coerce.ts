import { Rule } from "./types";

interface CoercionResult {
  value: unknown;
  changed: boolean;
}

export function coerceValue(value: unknown, rules: Rule[]): CoercionResult {
  if (typeof value !== "string") {
    return { value, changed: false };
  }

  let changed = false;
  let working = value;

  const trimmed = working.trim();
  if (trimmed !== working) {
    changed = true;
    working = trimmed;
  }

  const ruleNames = rules.map((r) => r.name);

  if (ruleNames.includes("isEmail")) {
    const lowered = working.toLowerCase();
    if (lowered !== working) {
      changed = true;
      working = lowered;
    }
  }

  if (ruleNames.includes("isPhoneNumber")) {
    const stripped = working.replace(/[^\d+]/g, "");
    if (stripped !== working) {
      changed = true;
      working = stripped;
    }
  }

  return { value: working, changed };
}
