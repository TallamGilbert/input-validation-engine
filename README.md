# Input Validation Engine

A reusable, composable TypeScript validation library that validates user input and returns structured error objects. Unlike simple validators that return `true` or `false`, this library explains **exactly what failed and why** — giving downstream code everything it needs to show specific, actionable error messages to end users.

Supports validating emails, phone numbers (E.164), URLs, ISO 8601 dates, UUIDs, password strength, and required fields. Rules are composable — combine them in any order to validate a single value. An optional coercion layer can clean malformed but well-intentioned input before validation, with full transparency about what was changed.

---

## Installation

````bash
# Clone the repository
git clone https://github.com/TallamGilbert/input-validation-engine
cd validation-library

# Install dependencies
npm install

```markdown
**Requirements:** Node.js 18+ and TypeScript

## Running Tests

```bash
npm test
````

Runs the full test suite , 82+ tests covering all validation rules, the composition engine, and coercion behavior.

---

## Basic Usage

Import `validate` and any rules you need:

```typescript
import { validate, isEmail, isRequired } from "./src";

// Single rule
const result = validate("user@example.com", [isEmail]);
// { valid: true, value: 'user@example.com', errors: [] }

// Multiple rules
const result2 = validate("", [isEmail, isRequired]);
// {
//   valid: false,
//   value: '',
//   errors: [
//     { rule: 'isEmail', code: 'EMAIL_EMPTY', passed: false, message: 'Email must not be empty' },
//     { rule: 'isRequired', code: 'VALUE_REQUIRED', passed: false, message: 'Value is required' }
//   ]
// }
```

---

## Available Rules

### `isRequired`

Checks whether a value has been provided. Fails for empty strings, whitespace-only strings, `null`, and `undefined`.

```typescript
validate("hello", [isRequired]); // passes
validate("", [isRequired]); // fails — "Value is required"
validate("   ", [isRequired]); // fails — "Value is required"
validate(null, [isRequired]); // fails — "Value is required"
validate(undefined, [isRequired]); // fails — "Value is required"
```

---

### `isEmail`

Validates that a value is a properly formatted email address.

```typescript
validate("user@example.com", [isEmail]); // passes
validate("user+tag@example.com", [isEmail]); // passes (plus addressing)
validate("notanemail", [isEmail]); // fails — "Email must contain an @ symbol"
validate("user@", [isEmail]); // fails — "Email domain must not be empty"
validate("@example.com", [isEmail]); // fails — "Email local part must not be empty"
validate("user@localhost", [isEmail]); // fails — "Email domain must contain a dot"
validate("user..name@example.com", [isEmail]); // fails — consecutive dots not allowed
```

**Accepts:** Standard emails, subdomains (`user@mail.example.co.uk`), plus addressing

**Rejects:** Missing `@`, multiple `@` symbols, empty local part or domain, domain without dot, consecutive dots, spaces, non-string inputs

> Uses a practical subset of RFC 5322. Unusual but technically valid formats (quoted local parts, IP address domains, comments) are intentionally rejected for real-world usability.

---

### `isPhoneNumber`

Validates phone numbers in E.164 international format.

```typescript
validate("+254712345678", [isPhoneNumber]); // passes
validate("+14155552671", [isPhoneNumber]); // passes
validate("0712345678", [isPhoneNumber]); // fails — must start with +
validate("+254 712 345 678", [isPhoneNumber]); // fails — contains spaces
validate("+2547abc", [isPhoneNumber]); // fails — contains letters
validate("+12345", [isPhoneNumber]); // fails — too short
validate("+12345678901234567", [isPhoneNumber]); // fails — too long
```

**E.164 requirements:** starts with `+`, no leading zero on country code, digits only after `+`, minimum 7 digits, maximum 15 digits total.

---

### `isURL`

Validates a properly formatted URL with `http://` or `https://` protocol.

```typescript
validate("https://example.com", [isURL]); // passes
validate("http://localhost:3000", [isURL]); // passes
validate("https://example.com/path?q=1", [isURL]); // passes
validate("example.com", [isURL]); // fails — missing protocol
validate("ftp://example.com", [isURL]); // fails — invalid protocol
validate("not-a-url", [isURL]); // fails — malformed
```

> Only `http://` and `https://` are accepted. Other schemes (`ftp://`, `mailto:`) are intentionally rejected.

---

### `isISODate`

Validates dates in ISO 8601 format. Rejects impossible calendar dates (e.g. February 30).

```typescript
validate("2026-06-19", [isISODate]); // passes
validate("2026-06-19T10:30:00Z", [isISODate]); // passes
validate("2026-06-19T10:30:00+05:00", [isISODate]); // passes
validate("2024-02-29", [isISODate]); // passes (leap year)
validate("19-06-2026", [isISODate]); // fails — wrong format
validate("2026-99-99", [isISODate]); // fails — invalid month
validate("2023-02-29", [isISODate]); // fails — not a leap year
validate("2024-02-30", [isISODate]); // fails — Feb 30 doesn't exist
```

**Supported formats:**

- Date only: `YYYY-MM-DD`
- UTC datetime: `YYYY-MM-DDTHH:mm:ssZ`
- Offset datetime: `YYYY-MM-DDTHH:mm:ss+HH:mm`

> Week dates (`2026-W25`) and ordinal dates (`2026-170`) are not supported.

---

### `isUUID`

Validates a UUID in 8-4-4-4-12 format.

```typescript
validate("550e8400-e29b-41d4-a716-446655440000", [isUUID]); // passes
validate("550E8400-E29B-41D4-A716-446655440000", [isUUID]); // passes (uppercase)
validate("00000000-0000-0000-0000-000000000000", [isUUID]); // passes (nil UUID)
validate("not-a-uuid", [isUUID]); // fails
validate("550e8400-e29b-41d4-a716-44665544", [isUUID]); // fails — wrong length
validate("550e8400e29b41d4a716446655440000", [isUUID]); // fails — missing hyphens
```

**Accepts:** Lowercase and uppercase hex, nil UUID

**Rejects:** Wrong segment count or lengths, non-hex characters, missing hyphens, empty strings, non-string inputs

> Validates format and character validity only. Does not verify UUID version bits.

---

### `isStrongPassword`

Validates password strength. Default requirements: minimum 8 characters, at least 1 uppercase letter, 1 digit, and 1 special character.

```typescript
validate("StrongP@ss1", [isStrongPassword]); // passes
validate("Abcdef1!", [isStrongPassword]); // passes (exactly 8 chars)
validate("weak", [isStrongPassword]); // fails — multiple requirements unmet
validate("weakp@ss1", [isStrongPassword]); // fails — missing uppercase
validate("WeakP@ssword", [isStrongPassword]); // fails — missing digit
validate("WeakPass1", [isStrongPassword]); // fails — missing special char
```

When a password fails, **all** failed requirements are reported at once — not just the first.

Example: `"Password requires: at least 8 characters (currently 4), at least one uppercase letter, at least one digit, at least one special character"`

**Custom rules:**

```typescript
import { createStrongPasswordRule } from "./src";

const customRule = createStrongPasswordRule({
  minLength: 4,
  requireUppercase: false,
  requireDigit: true,
  requireSpecialChar: false,
});

validate("abc1", [customRule]); // passes
validate("abc", [customRule]); // fails — missing digit
```

| Option               | Type      | Default | Description                                     |
| -------------------- | --------- | ------- | ----------------------------------------------- |
| `minLength`          | `number`  | `8`     | Minimum character count                         |
| `requireUppercase`   | `boolean` | `true`  | Require at least one uppercase letter           |
| `requireDigit`       | `boolean` | `true`  | Require at least one digit                      |
| `requireSpecialChar` | `boolean` | `true`  | Require at least one non-alphanumeric character |

---

## Validation Result Format

Every call to `validate` returns a `ValidationResult`:

```typescript
interface ValidationResult {
  valid: boolean; // true if all rules pass
  value: unknown; // value after coercion, or original if no coercion
  originalValue?: unknown; // present only when coercion changed the value
  errors: ValidationError[]; // empty array if valid is true
}
```

Each error follows this structure:

```typescript
interface ValidationError {
  rule: string; // e.g. "isEmail", "isRequired"
  code: string; // e.g. "EMAIL_MISSING_AT", "VALUE_REQUIRED"
  passed: false; // always false for errors
  message: string; // human-readable description
  value?: unknown; // the value that failed
}
```

**Successful validation:**

```json
{
  "valid": true,
  "value": "user@example.com",
  "errors": []
}
```

**Failed validation:**

```json
{
  "valid": false,
  "value": "bad-email",
  "errors": [
    {
      "rule": "isEmail",
      "code": "EMAIL_MISSING_AT",
      "passed": false,
      "message": "Email must contain an @ symbol",
      "value": "bad-email"
    }
  ]
}
```

**Multiple failures:**

```json
{
  "valid": false,
  "value": "",
  "errors": [
    {
      "rule": "isRequired",
      "code": "VALUE_REQUIRED",
      "passed": false,
      "message": "Value is required",
      "value": ""
    },
    {
      "rule": "isEmail",
      "code": "EMAIL_EMPTY",
      "passed": false,
      "message": "Email must not be empty",
      "value": ""
    }
  ]
}
```

---

## Using Multiple Rules

Pass an array of rules to `validate` — all rules execute against the value:

```typescript
import { validate, isRequired, isEmail } from "./src";

validate("user@example.com", [isRequired, isEmail]); // valid: true, errors: []
validate("", [isRequired, isEmail]); // valid: false, two errors
```

**Key behaviors:**

- All rules execute even if earlier ones fail — users see all requirements at once
- Rules are independent and unaware of each other
- Rule order does not affect the validation engine
- Custom rules work identically to built-in ones

---

## Using Coercion

Coercion is an optional preprocessing step that cleans input before validation. Enable it with `{ coerce: true }`:

```typescript
import { validate, isEmail, isRequired } from "./src";

const result = validate("  STUDENT@EXAMPLE.COM  ", [isRequired, isEmail], {
  coerce: true,
});

// {
//   valid: true,
//   value: 'student@example.com',
//   originalValue: '  STUDENT@EXAMPLE.COM  ',
//   errors: []
// }
```

When coercion changes the input, `originalValue` is included in the result. When nothing changed, it's absent.

### What Coercion Does

| Condition              | Transformation                      | Example                                     |
| ---------------------- | ----------------------------------- | ------------------------------------------- |
| Any rule active        | Trim leading/trailing whitespace    | `" hello "` → `"hello"`                     |
| `isEmail` active       | Lowercase the value                 | `"User@Example.com"` → `"user@example.com"` |
| `isPhoneNumber` active | Strip non-digit, non-`+` characters | `"+1 (415) 555-2671"` → `"+14155552671"`    |

### What Coercion Does Not Do

- **Dates** — ISO 8601 is already a strict format; no normalization applied
- **UUIDs** — case is preserved; both upper and lowercase are valid per RFC 4122
- **URLs** — missing protocols are not added; the developer decides whether to prepend `https://`
- **Passwords** — never modified; coercing passwords would weaken security
- **Non-string values** — numbers, objects, and other types pass through unchanged
- **Internal whitespace** — only leading and trailing whitespace is trimmed

> Coercion is disabled by default and must be explicitly enabled, ensuring developers are always aware when input transformation occurs.

---

## Examples

### Email signup form

```typescript
import { validate, isRequired, isEmail, isStrongPassword } from "./src";

function validateSignup(email: string, password: string) {
  return {
    email: validate(email, [isRequired, isEmail], { coerce: true }),
    password: validate(password, [isRequired, isStrongPassword]),
  };
}

const result = validateSignup("  USER@EXAMPLE.COM  ", "weak");
// email:    valid: true,  value: 'user@example.com'
// password: valid: false, errors: ['at least 8 characters', 'at least one uppercase letter', ...]
```

### Phone number with coercion

```typescript
import { validate, isPhoneNumber } from "./src";

const result = validate("+254 (712) 345-678", [isPhoneNumber], {
  coerce: true,
});
// {
//   valid: true,
//   value: '+254712345678',
//   originalValue: '+254 (712) 345-678',
//   errors: []
// }
// Store result.value in the database, show result.originalValue to the user
```

### API endpoint validation

```typescript
import { validate, isRequired, isUUID, isISODate } from "./src";

function validateQueryParams(params: { id: string; startDate: string }) {
  const idResult = validate(params.id, [isRequired, isUUID]);
  const dateResult = validate(params.startDate, [isRequired, isISODate]);

  if (!idResult.valid || !dateResult.valid) {
    return { status: 400, errors: [...idResult.errors, ...dateResult.errors] };
  }

  return {
    status: 200,
    data: { id: idResult.value, startDate: dateResult.value },
  };
}
```

### Custom validation rule

```typescript
import { Rule, validate, isRequired } from "./src";

const isAlphanumeric: Rule = (value: unknown) => {
  if (typeof value !== "string") {
    return {
      rule: "isAlphanumeric",
      code: "ALPHANUMERIC_NOT_STRING",
      passed: false,
      message: "Value must be a string",
      value,
    };
  }

  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return {
      rule: "isAlphanumeric",
      code: "ALPHANUMERIC_INVALID_CHARS",
      passed: false,
      message: "Value must contain only letters and numbers",
      value,
    };
  }

  return null;
};

validate("hello123", [isRequired, isAlphanumeric]); // valid: true
validate("hello 123", [isRequired, isAlphanumeric]); // valid: false — contains space
```

---

## Known Limitations

- **Email** — uses a practical subset of RFC 5322. Unusual but technically valid formats (quoted local parts, IP address domains, comments) are intentionally rejected.
- **Phone** — validates E.164 format but does not verify the number exists, is assigned, or can receive calls/SMS.
- **URL** — only `http://` and `https://` are accepted. Other schemes (`ftp://`, `mailto:`, `file://`) are rejected.
- **Date** — supports a subset of ISO 8601. Week dates (`2026-W25`) and ordinal dates (`2026-170`) are not supported.
- **UUID** — checks format and character validity only. Does not verify UUID version bits or RFC 4122 variant fields.
- **Async validation** — all rules are synchronous. Checking email uniqueness against a database or verifying phone numbers via SMS is not supported.
- **Custom coercion** — the mapping of coercions to rules is hardcoded internally. A pluggable coercion system would allow custom rules to define their own coercion logic.
- **Schema validation** — validates individual values, not entire objects. For structured data with multiple fields, call `validate` for each field separately.
- **Internationalization** — error messages are English only. Map error `code` values to translated messages for i18n support.
