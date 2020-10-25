/**
 * Throws an error if a value is defined and not an integer or not in a range.
 */
export function validate(name: string, rule : { required?: boolean, pattern? : RegExp, minLength? : number, maxLength?: number }, value?: string) {
  if (rule.required && value === undefined || /^s{1,}$/gi.test(value || '')) {
    throw new Error(`${name}: Is required and cannot be empty`);
  }

  if (value === undefined) { return; }

  if (!rule.required && (value === undefined || value === '')) { return; }

  if (rule.pattern && !rule.pattern.test(value)) {
    throw new Error(`${name}: must match pattern ${rule.pattern.source}`);
  }

  if (rule.minLength && value.length < rule.minLength) {
    throw new Error(`${name}: must be at least ${rule.minLength} characters long`);
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    throw new Error(`${name}: must be less than ${rule.maxLength} characters long`);
  }
}
