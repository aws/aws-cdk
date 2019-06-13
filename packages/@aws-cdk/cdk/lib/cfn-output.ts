import { CfnElement } from './cfn-element';
import { Construct } from './construct';

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
  readonly value: any;

  /**
   * The name used to export the value of this output across stacks.
   *
   * To import the value from another stack, use `FnImportValue(export)`. You
   * can create an import value token by calling `output.makeImportValue()`.
   *
   * @default - Automatically allocate a name when `makeImportValue()` is
   * called.
   */
  readonly export?: string;

  /**
   * Disables the automatic allocation of an export name for this output.
   *
   * This prohibits exporting this value, either by specifying `export` or
   * by calling `makeImportValue()`.
   *
   * @default false
   */
  readonly disableExport?: boolean;

  /**
   * A condition from the "Conditions" section to associate with this output
   * value. If the condition evaluates to `false`, this output value will not
   * be included in the stack.
   *
   * @default - No condition is associated with the output.
   */
  readonly condition?: CfnCondition;
}

export class CfnOutput extends CfnElement {
  /**
   * A String type that describes the output value.
   * The description can be a maximum of 4 K in length.
   */
  public readonly description?: string;

  /**
   * The name of the resource output to be exported for a cross-stack reference.
   * By default, the logical ID of the CfnOutput element is used as it's export name.
   *
   * May be undefined if the CfnOutput hasn't been exported yet.
   */
  public export?: string;

  /**
   * A condition from the "Conditions" section to associate with this output
   * value. If the condition evaluates to `false`, this output value will not
   * be included in the stack.
   */
  public readonly condition?: CfnCondition;

  private _value?: any;

  private disableExport: boolean;

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

    this.description = props.description;
    this._value = props.value;
    this.condition = props.condition;

    this.disableExport = props.disableExport !== undefined ? props.disableExport : false;

    if (props.export && this.disableExport) {
      throw new Error('Cannot set `disableExport` and specify an export name');
    }

    this.export = props.export;

    if (props.export) {
      this.export = props.export;
    }
  }

  /**
   * The value of the property returned by the aws cloudformation describe-stacks command.
   * The value of an output can include literals, parameter references, pseudo-parameters,
   * a mapping value, or intrinsic functions.
   */
  public get value(): any {
    return this._value;
  }

  /**
   * Returns an FnImportValue bound to this export name.
   */
  public makeImportValue() {
    return fn().importValue(this.obtainExportName());
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    return {
      Outputs: {
        [this.logicalId]: {
          Description: this.description,
          Value: this.value,
          Export: this.export != null ? { Name: this.export } : undefined,
          Condition: this.condition ? this.condition.logicalId : undefined
        }
      }
    };
  }

  /**
   * Allocate an export name for this `CfnOutput` if not already done.
   */
  public obtainExportName(): string {
    if (!this.export && this.disableExport) {
      throw new Error('Cannot create an ImportValue; `disableExport` has been set.');
    }
    if (!this.export) {
      this.export = this.uniqueOutputName();
    }
    return this.export;
  }

  /**
   * Automatically determine an output name for use with FnImportValue
   *
   * This gets called in case the user hasn't specified an export name but is
   * taking an action that requires exporting. We namespace with the stack name
   * to reduce chances of collissions between CDK apps.
   */
  private uniqueOutputName() {
    // prefix export name with stack name since exports are global within account + region.
    const stackName = this.stack.stackName;
    return (stackName ? stackName + ':' : '') + this.logicalId;
  }
}

/**
 * Properties for ListOutput
 */
export interface StringListCfnOutputProps {
  /**
   * A String type that describes the output value.
   * The description can be a maximum of 4 K in length.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The list of primitives to export
   */
  readonly values: any[];

  /**
   * The separator to use to separate stringified values
   *
   * @default ","
   */
  readonly separator?: string;

  /**
   * The name used to export the value of this output across stacks. To import
   * the value from another stack, use `FnImportValue(export)`. You can create
   * an import value token by calling `output.makeImportValue()`.
   *
   * @default The default behavior is to automatically allocate an export name
   * for outputs based on the stack name and the output's logical ID. To
   * create an output without an export, set `disableExport: true`.
   */
  readonly export?: string;

  /**
   * Disables the automatic allocation of an export name for this output.
   *
   * @default false, which means that an export name is either explicitly
   * specified or allocated based on the output's logical ID and stack name.
   */
  readonly disableExport?: boolean;

  /**
   * A condition from the "Conditions" section to associate with this output
   * value. If the condition evaluates to `false`, this output value will not
   * be included in the stack.
   *
   * @default - None.
   */
  readonly condition?: CfnCondition;
}

/**
 * An output for a list of strings.
 *
 * Exports a list of Tokens via an CfnOutput variable, and return a list of Tokens
 * that selects the imported values for them.
 */
export class StringListCfnOutput extends Construct {
  /**
   * Number of elements in the stringlist
   */
  public readonly length: number;

  /**
   * The separator used to combine the string values
   */
  private readonly separator: string;

  /**
   * The CfnOutput object that was created
   */
  private readonly output: CfnOutput;

  constructor(scope: Construct, id: string, props: StringListCfnOutputProps) {
    super(scope, id);

    this.separator = props.separator || ',';
    this.length = props.values.length;

    this.output = new CfnOutput(this, 'Resource', {
      description: props.description,
      condition: props.condition,
      disableExport: props.disableExport,
      export: props.export,
      value: fn().join(this.separator, props.values)
    });
  }

  /**
   * Return an array of imported values for this CfnOutput
   */
  public makeImportValues(): string[] {
    const combined = this.output.makeImportValue();

    const ret = [];
    for (let i = 0; i < this.length; i++) {
      ret.push(fn().select(i, fn().split(this.separator, combined)));
    }

    return ret;
  }
}

function fn() {
  // Lazy loading of "Fn" module to break dependency cycles on startup
  return require('./fn').Fn;
}

import { CfnCondition } from './cfn-condition';
