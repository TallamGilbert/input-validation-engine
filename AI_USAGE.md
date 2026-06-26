# AI Usage Documentation

## Tool Used

- **DeepSeek** (via Roo Code extension in VS Code)

## Purpose

I used AI as a learning aid and thinking partner during the development of this validation library. All code was reviewed, understood, and tested by me before inclusion.

## How I Used AI

### Design Discussions

- I asked for explanations of the architectural concepts behind composable validation and structured error objects
- I discussed API design tradeoffs with it — for example, why `null` means "passed" and why coercion is opt-in
- I used it to clarify the difference between a library and a deployed API service

### Implementation Guidance

- I asked for patterns around TypeScript types (`Rule`, `ValidationError`, `ValidationResult`)
- I got suggestions on project structure and file organization, which I then adapted to fit my approach
- I used it to think through edge cases for each validation rule

### Code Review and Debugging

- I ran into type errors when I renamed `coerced` to `originalValue` — AI helped me trace where the interface change broke things
- I used it to diagnose test failures and understand why they were happening
- I asked it to check whether my implementation covered all sprint requirements

### Documentation

- I asked for a README structure, then wrote and customized the content myself
- I used it to think through how to organize the project summary and presentation notes

## What AI Did NOT Do

- It did not write the final implementation — I typed, tested, and verified all code myself
- It did not run tests or execute any code
- It did not make design decisions — I chose which suggestions to accept and which to ignore
- It did not write this project from scratch — it gave guidance that I acted on

## How I Verified Everything

I tested every suggestion by running the test suite (`npx vitest run`) and the TypeScript compiler (`npx tsc --noEmit`). I understand all the code in this repository and can explain every design decision.
