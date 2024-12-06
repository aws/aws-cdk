import { CfnPipeline } from './codepipeline.generated';
import { validatePipelineVariableName } from './private/validation';
import { Token } from '../../core';

/**
 * Properties of pipeline-level variable.
 */
export interface VariableProps {
  /**
   * The name of a pipeline-level variable.
   */
  readonly variableName: string;

  /**
   * The description of a pipeline-level variable. It's used to add additional context
   * about the variable, and not being used at time when pipeline executes.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The default value of a pipeline-level variable.
   *
   * @default - No default value.
   */
  readonly defaultValue?: string;
}

/**
 * Pipeline-Level variable.
 */
export class Variable {
  /**
   * The name of a pipeline-level variable.
   */
  public readonly variableName: string;

  private readonly description?: string;
  private readonly defaultValue?: string;

  constructor(props: VariableProps) {
    this.variableName = props.variableName;
    this.description = props.description;
    this.defaultValue = props.defaultValue;

    this.validate();
  }

  private validate() {
    validatePipelineVariableName(this.variableName);
    if (
      this.defaultValue !== undefined
      && !Token.isUnresolved(this.defaultValue)
      && (this.defaultValue.length < 1 || this.defaultValue.length > 1000)
    ) {
      throw new Error(`Default value for variable '${this.variableName}' must be between 1 and 1000 characters long, got ${this.defaultValue.length}`);
    }
    if (this.description !== undefined && !Token.isUnresolved(this.description) && this.description.length > 200) {
      throw new Error(`Description for variable '${this.variableName}' must not be greater than 200 characters long, got ${this.description.length}`);
    }
  }

  /**
   * Reference the variable name at Pipeline actions.
   *
   * @returns The variable name in a format that can be referenced at Pipeline actions
   */
  public reference(): string {
    return `#{variables.${this.variableName}}`;
  }

  /**
   * Render to CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnPipeline.VariableDeclarationProperty {
    return {
      defaultValue: this.defaultValue,
      description: this.description,
      name: this.variableName,
    };
  }
}
