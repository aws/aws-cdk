import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
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
export declare class CfnOutput extends CfnElement {
    private _description?;
    private _condition?;
    private _value?;
    private _exportName?;
    /**
     * Creates an CfnOutput value for this stack.
     * @param scope The parent construct.
     * @param props CfnOutput properties.
     */
    constructor(scope: Construct, id: string, props: CfnOutputProps);
    /**
     * A String type that describes the output value.
     * The description can be a maximum of 4 K in length.
     *
     * @default - No description.
     */
    get description(): string | undefined;
    set description(description: string | undefined);
    /**
     * The value of the property returned by the aws cloudformation describe-stacks command.
     * The value of an output can include literals, parameter references, pseudo-parameters,
     * a mapping value, or intrinsic functions.
     */
    get value(): any;
    set value(value: any);
    /**
     * A condition to associate with this output value. If the condition evaluates
     * to `false`, this output value will not be included in the stack.
     *
     * @default - No condition is associated with the output.
     */
    get condition(): CfnCondition | undefined;
    set condition(condition: CfnCondition | undefined);
    /**
     * The name used to export the value of this output across stacks.
     *
     * To use the value in another stack, pass the value of
     * `output.importValue` to it.
     *
     * @default - the output is not exported
     */
    get exportName(): string | undefined;
    set exportName(exportName: string | undefined);
    /**
     * Return the `Fn.importValue` expression to import this value into another stack
     *
     * The returned value should not be used in the same stack, but in a
     * different one. It must be deployed to the same environment, as
     * CloudFormation exports can only be imported in the same Region and
     * account.
     *
     * The is no automatic registration of dependencies between stacks when using
     * this mechanism, so you should make sure to deploy them in the right order
     * yourself.
     *
     * You can use this mechanism to share values across Stacks in different
     * Stages. If you intend to share the value to another Stack inside the same
     * Stage, the automatic cross-stack referencing mechanism is more convenient.
     */
    get importValue(): string;
    /**
     * @internal
     */
    _toCloudFormation(): object;
    private validateOutput;
}
import { CfnCondition } from './cfn-condition';
