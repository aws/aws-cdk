/**
 * Throws an error if a value is defined and not an integer or not in a range.
 */
export function validate(name: string,
  rule : { documentationLink: string, required?: boolean, pattern? : RegExp, minLength? : number, maxLength?: number },
  value?: string) {

  if (!value) {
    if (rule.required) {
      throw new Error(`'${name}' is required and cannot be empty`);
    }
    return;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    throw new Error(`${name}: must match pattern ${rule.pattern.source}. Must match rules from ${rule.documentationLink}`);
  }

  if (rule.minLength && value.length < rule.minLength) {
    throw new Error(`${name}: must be at least ${rule.minLength} characters long. Must match rules from ${rule.documentationLink}`);
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    throw new Error(`${name}: must be less than ${rule.maxLength} characters long. Must match rules from ${rule.documentationLink}`);
  }
}
