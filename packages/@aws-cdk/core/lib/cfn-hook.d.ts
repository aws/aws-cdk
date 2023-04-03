import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
/**
 * Construction properties of `CfnHook`.
 */
export interface CfnHookProps {
    /**
     * The type of the hook
     * (for example, "AWS::CodeDeploy::BlueGreen").
     */
    readonly type: string;
    /**
     * The properties of the hook.
     *
     * @default - no properties
     */
    readonly properties?: {
        [name: string]: any;
    };
}
/**
 * Represents a CloudFormation resource.
 */
export declare class CfnHook extends CfnElement {
    /**
     * The type of the hook
     * (for example, "AWS::CodeDeploy::BlueGreen").
     */
    readonly type: string;
    private readonly _cfnHookProperties?;
    /**
     * Creates a new Hook object.
     */
    constructor(scope: Construct, id: string, props: CfnHookProps);
    /** @internal */
    _toCloudFormation(): object;
    protected renderProperties(props?: {
        [key: string]: any;
    }): {
        [key: string]: any;
    } | undefined;
}
