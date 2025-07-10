import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import * as validation from './validation-helpers';
import { ActionGroupSchema } from './schema-base';

/**
 * Enum for parameter types in function schemas
 */
export enum ParameterType {
  /**
   * String parameter type
   */
  STRING = 'string',

  /**
   * Number parameter type
   */
  NUMBER = 'number',

  /**
   * Integer parameter type
   */
  INTEGER = 'integer',

  /**
   * Boolean parameter type
   */
  BOOLEAN = 'boolean',

  /**
   * Array parameter type
   */
  ARRAY = 'array',

  /**
   * Object parameter type
   */
  OBJECT = 'object',
}

/**
 * Enum for require confirmation state in function schemas
 */
export enum RequireConfirmation {
  /**
   * Confirmation is enabled
   */
  ENABLED = 'ENABLED',

  /**
   * Confirmation is disabled
   */
  DISABLED = 'DISABLED',
}

/**
 * Properties for a function parameter
 */
export interface FunctionParameterProps {
  /**
   * The type of the parameter
   */
  readonly type: ParameterType;

  /**
   * Whether the parameter is required
   * @default true
   */
  readonly required?: boolean;

  /**
   * Description of the parameter
   * @default undefined no description will be present
   */
  readonly description?: string;
}

/**
 * Properties for a function in a function schema
 */
export interface FunctionProps {
  /**
   * The name of the function
   */
  readonly name: string;

  /**
   * Description of the function
   */
  readonly description: string;

  /**
   * Parameters for the function as a record of parameter name to parameter properties
   * @default {}
   */
  readonly parameters?: Record<string, FunctionParameterProps>;

  /**
   * Whether to require confirmation before executing the function
   * @default RequireConfirmation.DISABLED
   */
  readonly requireConfirmation?: RequireConfirmation;
}

/**
 * Properties for a function schema
 */
export interface FunctionSchemaProps {
  /**
   * Functions defined in the schema
   */
  readonly functions: FunctionProps[];
}

/**
 * Represents a function parameter in a function schema
 */
export class FunctionParameter {
  /**
   * The type of the parameter
   */
  public readonly type: ParameterType;

  /**
   * Whether the parameter is required
   */
  public readonly required: boolean;

  /**
   * Description of the parameter
   * @default undefined no description will be present
   */
  public readonly description?: string;

  constructor(props: FunctionParameterProps) {
    // Validate description if provided
    if (props.description) {
      const descErrors = validation.validateStringFieldLength({
        fieldName: 'parameter description',
        value: props.description,
        minLength: 1,
        maxLength: 500,
      });

      if (descErrors.length > 0) {
        throw new validation.ValidationError(descErrors.join('\n'));
      }
    }

    this.type = props.type;
    this.required = props.required ?? true;
    this.description = props.description;
  }

  /**
   * Render the parameter as a CloudFormation property
   * @internal
   */
  public _render(): any {
    return {
      type: this.type,
      required: this.required,
      description: this.description,
    };
  }
}

/**
 * Represents a function in a function schema
 */
export class Function {
  /**
   * The name of the function
   */
  public readonly name: string;

  /**
   * Description of the function
   */
  public readonly description: string;

  /**
   * Parameters for the function
   */
  public readonly parameters: Record<string, FunctionParameter>;

  /**
   * Whether to require confirmation before executing the function
   */
  public readonly requireConfirmation: RequireConfirmation;

  constructor(props: FunctionProps) {
    // Validate function name
    const nameErrors = validation.validateStringFieldLength({
      fieldName: 'function name',
      value: props.name,
      minLength: 1,
      maxLength: 100,
    });

    if (nameErrors.length > 0) {
      throw new validation.ValidationError(nameErrors.join('\n'));
    }

    // Validate function description
    const descErrors = validation.validateStringFieldLength({
      fieldName: 'function description',
      value: props.description,
      minLength: 1,
      maxLength: 500,
    });

    if (descErrors.length > 0) {
      throw new validation.ValidationError(descErrors.join('\n'));
    }

    this.name = props.name;
    this.description = props.description;

    // Convert parameters object to a record of FunctionParameter instances
    this.parameters = {};
    if (props.parameters) {
      Object.entries(props.parameters).forEach(([name, paramProps]) => {
        // Validate parameter name
        const paramNameErrors = validation.validateStringFieldLength({
          fieldName: 'parameter name',
          value: name,
          minLength: 1,
          maxLength: 100,
        });

        if (paramNameErrors.length > 0) {
          throw new validation.ValidationError(paramNameErrors.join('\n'));
        }

        this.parameters[name] = new FunctionParameter(paramProps);
      });
    }

    this.requireConfirmation = props.requireConfirmation ?? RequireConfirmation.DISABLED;
  }

  /**
   * Render the function as a CloudFormation property
   * @internal
   */
  public _render(): any {
    const parametersObj: Record<string, any> = {};

    Object.entries(this.parameters).forEach(([name, param]) => {
      parametersObj[name] = param._render();
    });
    return {
      name: this.name,
      description: this.description,
      parameters: parametersObj,
      requireConfirmation: this.requireConfirmation,
    };
  }
}

/**
 * Represents a function schema for a Bedrock Agent Action Group
 */
export class FunctionSchema extends ActionGroupSchema {
  /**
   * The functions defined in the schema
   */
  public readonly functions: Function[];

  constructor(props: FunctionSchemaProps) {
    super();

    if (!props.functions || props.functions.length === 0) {
      throw new validation.ValidationError('At least one function must be defined in the function schema');
    }

    this.functions = props.functions.map(f => new Function(f));
  }

  /**
   * Render the function schema as a CloudFormation property
   * @internal
   */
  public _render(): CfnAgent.FunctionSchemaProperty {
    return {
      functions: this.functions.map(f => f._render()),
    };
  }
}
