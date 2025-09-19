import { UnscopedValidationError } from '../errors';

/**
 * Utility class for parsing template strings with variables.
 */
export class TemplateStringParser {
  /**
   * Parses a template string with variables in the form of `${var}` and extracts the values from the input string.
   * Returns a record mapping variable names to their corresponding values.
   * @param template the template string containing variables
   * @param input the input string to parse
   * @throws UnscopedValidationError if the input does not match the template
   */
  public static parse(template: string, input: string): Record<string, string> {
    const templateParts = template.split(/(\$\{[^{}]+})/);
    const result: Record<string, string> = {};

    let inputIndex = 0;

    for (let i = 0; i < templateParts.length; i++) {
      const part = templateParts[i];
      if (part.startsWith('${') && part.endsWith('}')) {
        const varName = part.slice(2, -1);
        const nextLiteral = templateParts[i + 1] || '';

        let value = '';
        if (nextLiteral) {
          const endIndex = input.indexOf(nextLiteral, inputIndex);
          if (endIndex === -1) {
            throw new UnscopedValidationError(`Input ${input} does not match template ${template}`);
          }
          value = input.slice(inputIndex, endIndex);
          inputIndex = endIndex;
        } else {
          value = input.slice(inputIndex);
          inputIndex = input.length;
        }

        result[varName] = value;
      } else {
        if (input.slice(inputIndex, inputIndex + part.length) !== part) {
          throw new UnscopedValidationError(`Input ${input} does not match template ${template}`);
        }
        inputIndex += part.length;
      }
    }

    if (inputIndex !== input.length) {
      throw new UnscopedValidationError(`Input ${input} does not match template ${template}`);
    }

    return result;
  }

  public static interpolate(template: string, variables: Record<string, string>): string {
    return template.replace(/\${([^{}]+)}/g, (_, varName) => {
      if (variables[varName] === undefined) {
        throw new UnscopedValidationError(`Variable ${varName} not provided for template interpolation`);
      }
      return variables[varName];
    });
  }
}
