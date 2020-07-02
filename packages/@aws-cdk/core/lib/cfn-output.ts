import { CfnElement } from './cfn-element';
import { Construct } from './construct-compat';

export interface CfnOutputProps {
  /**
   * A String type that describes the output value.
   * The description can be a maximum of 4 K in length.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The value of the property returned by the aws cloudformation describe-stacks command.
   * The value of an output can include literals, parameter references, pseudo-parameters,
   * a mapping value, or intrinsic functions.
   */
  readonly value: string;

  /**
   * The name used to export the value of this output across stacks.
   *
   * To import the value from another stack, use `Fn.importValue(exportName)`.
   *
   * @default - the output is not exported
   */
  readonly exportName?: string;

  /**
   * A condition to associate with this output value. If the condition evaluates
   * to `false`, this output value will not be included in the stack.
   *
   * @default - No condition is associated with the output.
   */
  readonly condition?: CfnCondition;
}

export class CfnOutput extends CfnElement {
  private _description?: string;
  private _condition?: CfnCondition;
  private _value?: any;
  private _exportName?: string;

  /**
   * Creates an CfnOutput value for this stack.
   * @param scope The parent construct.
   * @param props CfnOutput properties.
   */
  constructor(scope: Construct, id: string, props: CfnOutputProps) {
    super(scope, id);

    if (props.value === undefined) {
      throw new Error(`Missing value for CloudFormation output at path "${this.node.path}"`);
    }

    this._description = props.description;
    this._value = props.value;
    this._condition = props.condition;
    this._exportName = props.exportName;
  }

  /**
   * Returns the description of this Output
   */
  public get description() {
    return this._description;
  }

  /**
   * Sets this output's description to the parameter
   * @param description the description to update this Output's description to
   */
  public set description(description: string | undefined) {
    this._description = description;
  }

  /**
   * Returns the value of this Output
   */
  public get value() {
    return this._value;
  }

  /**
   * Sets this output's value to the parameter
   * @param value the value to update this Output's value to
   */
  public set value(value: any) {
    this._value = value;
  }

  /**
   * Returns the condition of this Output
   */
  public get condition() {
    return this._condition;
  }

  /**
   * Sets this output's condition to the parameter
   * @param condition the condition to update this Output's condition to
   */
  public set condition(condition: CfnCondition | undefined) {
    this._condition = condition;
  }

  /**
   * Returns the export of this Output
   */
  public get exportName() {
    return this._exportName;
  }

  /**
   * Sets this output's export to the parameter
   * @param exportName the export to update this Output's export to
   */
  public set exportName(exportName: string | undefined) {
    this._exportName = exportName;
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    return {
      Outputs: {
        [this.logicalId]: {
          Description: this._description,
          Value: this._value,
          Export: this._exportName != null ? { Name: this._exportName } : undefined,
          Condition: this._condition ? this._condition.logicalId : undefined,
        },
      },
    };
  }
}

import { CfnCondition } from './cfn-condition';
