import { Construct } from 'constructs';
import { ValidationError } from '../errors';

/**
 * Represents a validation rule for props of type T.
 * @template T The type of the props being validated.
 */
export type ValidationRule<T> = {
  /**
   * A function that checks if the validation rule condition is met.
   * @param {T} props - The props object to validate.
   * @returns {boolean} True if the condition is met (i.e., validation fails), false otherwise.
   */
  condition: (props: T) => boolean;

  /**
   * A function that returns an error message if the validation fails.
   * @param {T} props - The props that failed validation.
   * @returns {string} The error message.
   */
  message: (props: T) => string;
};

/**
 * Validates props against a set of rules and throws an error if any validations fail.
 *
 * @template T The type of the props being validated.
 * @param {string} className - The name of the class being validated, used in the error message. Ex. for SQS, might be Queue.name
 * @param {T} props - The props object to validate.
 * @param {ValidationRule<T>[]} rules - An array of validation rules to apply.
 * @throws {Error} If any validation rules fail, with a message detailing all failures.
 */
export function validateAllProps<T>(scope: Construct, className: string, props: T, rules: ValidationRule<T>[]): void {
  const validationErrors = rules
    .filter(rule => rule.condition(props))
    .map(rule => rule.message(props));

  if (validationErrors.length > 0) {
    const errorMessage = `${className} initialization failed due to the following validation error(s):\n${validationErrors.map(error => `- ${error}`).join('\n')}`;
    throw new ValidationError(errorMessage, scope);
  }
}
