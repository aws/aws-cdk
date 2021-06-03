/**
 * Abstract class to validate inputs match requirements.
 */
export class InputValidator {
/**
* Validates length
*/
  public static validateLength(inputName: string, inputString: string | undefined, minLength: number, maxLength: number): void {
    if (inputString !== undefined && (inputString.length < minLength || inputString.length > maxLength)) {
      throw new Error(
        `Invalid ${inputName} length of ${inputString.length}.
    ${inputName} must have a character length between ${minLength} and ${maxLength}`);
    }
  }
}
