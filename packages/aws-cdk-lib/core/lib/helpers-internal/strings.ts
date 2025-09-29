import { UnscopedValidationError } from '../errors';

/**
 * A string with variables in the form `${name}`.
 */
export class TemplateString {
  constructor(private readonly template: string) {
  }

  /**
   * Parses a template string with variables in the form of `${var}` and extracts the values from the input string.
   * Returns a record mapping variable names to their corresponding values.
   * @param input the input string to parse
   * @throws UnscopedValidationError if the input does not match the template
   */
  public parse(input: string): Record<string, string> {
    const templateParts = this.template.split(/(\$\{[^{}]+})/);
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
            throw new UnscopedValidationError(`Input ${input} does not match template ${this.template}`);
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
          throw new UnscopedValidationError(`Input ${input} does not match template ${this.template}`);
        }
        inputIndex += part.length;
      }
    }

    if (inputIndex !== input.length) {
      throw new UnscopedValidationError(`Input ${input} does not match template ${this.template}`);
    }

    return result;
  }

  /**
   * Returns the template interpolated with the attributes of an object passed as input.
   * Attributes that don't match any variable in the template are ignored, but all template
   * variables must be replaced.
   * @param variables an object where keys are the variable names, and values are the values to be replaced.
   */
  public interpolate(variables: Record<string, string>): string {
    return this.template.replace(/\${([^{}]+)}/g, (_, varName) => {
      if (variables[varName] === undefined) {
        throw new UnscopedValidationError(`Variable ${varName} not provided for template interpolation`);
      }
      return variables[varName];
    });
  }
}
