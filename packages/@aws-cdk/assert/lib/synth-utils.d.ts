import * as core from 'aws-cdk-lib';
import * as cxapi from 'aws-cdk-lib/cx-api';
export declare class SynthUtils {
    /**
     * Returns the cloud assembly template artifact for a stack.
     */
    static synthesize(stack: core.Stack, options?: core.StageSynthesisOptions): cxapi.CloudFormationStackArtifact;
    /**
     * Synthesizes the stack and returns the resulting CloudFormation template.
     */
    static toCloudFormation(stack: core.Stack, options?: core.StageSynthesisOptions): any;
    /**
     * @returns Returns a subset of the synthesized CloudFormation template (only specific resource types).
     */
    static subset(stack: core.Stack, options: SubsetOptions): any;
    /**
     * Synthesizes the stack and returns a `CloudFormationStackArtifact` which can be inspected.
     * Supports nested stacks as well as normal stacks.
     *
     * @return CloudFormationStackArtifact for normal stacks or the actual template for nested stacks
     * @internal
     */
    static _synthesizeWithNested(stack: core.Stack, options?: core.StageSynthesisOptions): cxapi.CloudFormationStackArtifact | object;
}
export interface SubsetOptions {
    /**
     * Match all resources of the given type
     */
    resourceTypes?: string[];
}
