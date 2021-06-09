/**
 * Abstract class to validate inputs match requirements.
 */
export class InputValidator {

  /**
   * Validates length is between allowed min and max lengths.
   */
  public static validateLength(resourceName: string, inputName: string, minLength: number, maxLength: number, inputString?: string): void {
    if (inputString !== undefined && (inputString.length < minLength || inputString.length > maxLength)) {
      throw new Error(
        `Invalid ${inputName} length of ${inputString.length} - ${inputName} must have a character length between ${minLength} and ${maxLength}\nfor resource ${resourceName}\n`);
    }
  }
}
