import { Construct } from 'constructs';
import { CfnResource } from './cfn-resource';
import { Duration } from './duration';
import { RemovalPolicy } from './removal-policy';
import { Stack } from './stack';
/**
 * Initialization props for the `NestedStack` construct.
 *
 */
export interface NestedStackProps {
    /**
     * The set value pairs that represent the parameters passed to CloudFormation
     * when this nested stack is created. Each parameter has a name corresponding
     * to a parameter defined in the embedded template and a value representing
     * the value that you want to set for the parameter.
     *
     * The nested stack construct will automatically synthesize parameters in order
     * to bind references from the parent stack(s) into the nested stack.
     *
     * @default - no user-defined parameters are passed to the nested stack
     */
    readonly parameters?: {
        [key: string]: string;
    };
    /**
     * The length of time that CloudFormation waits for the nested stack to reach
     * the CREATE_COMPLETE state.
     *
     * When CloudFormation detects that the nested stack has reached the
     * CREATE_COMPLETE state, it marks the nested stack resource as
     * CREATE_COMPLETE in the parent stack and resumes creating the parent stack.
     * If the timeout period expires before the nested stack reaches
     * CREATE_COMPLETE, CloudFormation marks the nested stack as failed and rolls
     * back both the nested stack and parent stack.
     *
     * @default - no timeout
     */
    readonly timeout?: Duration;
    /**
     * The Simple Notification Service (SNS) topics to publish stack related
     * events.
     *
     * @default - notifications are not sent for this stack.
     */
    readonly notificationArns?: string[];
    /**
     * Policy to apply when the nested stack is removed
     *
     * The default is `Destroy`, because all Removal Policies of resources inside the
     * Nested Stack should already have been set correctly. You normally should
     * not need to set this value.
     *
     * @default RemovalPolicy.DESTROY
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * A description of the stack.
     *
     * @default - No description.
     */
    readonly description?: string;
}
/**
 * A CloudFormation nested stack.
 *
 * When you apply template changes to update a top-level stack, CloudFormation
 * updates the top-level stack and initiates an update to its nested stacks.
 * CloudFormation updates the resources of modified nested stacks, but does not
 * update the resources of unmodified nested stacks.
 *
 * Furthermore, this stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 * Cross references of resource attributes between the parent stack and the
 * nested stack will automatically be translated to stack parameters and
 * outputs.
 *
 */
export declare class NestedStack extends Stack {
    /**
     * Checks if `x` is an object of type `NestedStack`.
     */
    static isNestedStack(x: any): x is NestedStack;
    readonly templateFile: string;
    readonly nestedStackResource?: CfnResource;
    private readonly parameters;
    private readonly resource;
    private readonly _contextualStackId;
    private readonly _contextualStackName;
    private _templateUrl?;
    private _parentStack;
    constructor(scope: Construct, id: string, props?: NestedStackProps);
    /**
     * An attribute that represents the name of the nested stack.
     *
     * This is a context aware attribute:
     * - If this is referenced from the parent stack, it will return a token that parses the name from the stack ID.
     * - If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackName" }`
     *
     * Example value: `mystack-mynestedstack-sggfrhxhum7w`
     * @attribute
     */
    get stackName(): string;
    /**
     * An attribute that represents the ID of the stack.
     *
     * This is a context aware attribute:
     * - If this is referenced from the parent stack, it will return `{ "Ref": "LogicalIdOfNestedStackResource" }`.
     * - If this is referenced from the context of the nested stack, it will return `{ "Ref": "AWS::StackId" }`
     *
     * Example value: `arn:aws:cloudformation:us-east-2:123456789012:stack/mystack-mynestedstack-sggfrhxhum7w/f449b250-b969-11e0-a185-5081d0136786`
     * @attribute
     */
    get stackId(): string;
    /**
     * Assign a value to one of the nested stack parameters.
     * @param name The parameter name (ID)
     * @param value The value to assign
     */
    setParameter(name: string, value: string): void;
    /**
     * Defines an asset at the parent stack which represents the template of this
     * nested stack.
     *
     * This private API is used by `App.prepare()` within a loop that rectifies
     * references every time an asset is added. This is because (at the moment)
     * assets are addressed using CloudFormation parameters.
     *
     * @returns `true` if a new asset was added or `false` if an asset was
     * previously added. When this returns `true`, App will do another reference
     * rectification cycle.
     *
     * @internal
     */
    _prepareTemplateAsset(): boolean;
    private contextualAttribute;
    private addResourceMetadata;
}
