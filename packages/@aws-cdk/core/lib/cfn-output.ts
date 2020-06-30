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
  private _export?: string;

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
    this._export = props.exportName;
  }

  /**
   * Returns the description of this Output
   */
  public getDescription(): string | undefined {
    return this._description;
  }

  /**
   * Returns the value of this Output
   */
  public getValue(): any {
    return this._value;
  }

  /**
   * Returns the condition of this Output
   */
  public getCondition(): CfnCondition | undefined {
    return this._condition;
  }

  /**
   * Returns the export of this Output
   */
  public getExport(): string | undefined {
    return this._export;
  }

  /**
   * Sets this output's description to the parameter
   * @param newDescription the description to update this Output's description to
   */
  public setDescription(newDescription: string | undefined): void {
    this._description = newDescription;
  }

  /**
   * Sets this output's value to the parameter
   * @param newValue the value to update this Output's value to
   */
  public setValue(newValue: any): void {
    this._value = newValue;
  }

  /**
   * Sets this output's condition to the parameter
   * @param newCondition the condition to update this Output's condition to
   */
  public setCondition(newCondition: CfnCondition | undefined): void {
    this._condition = newCondition;
  }

  /**
   * Sets this output's export to the parameter
   * @param newRxport the export to update this Output's export to
   */
  public setExport(newExport: string): void {
    this._export = newExport;
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
          Export: this._export != null ? { Name: this._export } : undefined,
          Condition: this._condition ? this._condition.logicalId : undefined,
        },
      },
    };
  }
}

import { CfnCondition } from './cfn-condition';
