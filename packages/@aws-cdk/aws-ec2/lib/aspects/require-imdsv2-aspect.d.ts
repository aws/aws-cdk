import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
/**
 * Properties for `RequireImdsv2Aspect`.
 */
interface RequireImdsv2AspectProps {
    /**
     * Whether warning annotations from this Aspect should be suppressed or not.
     *
     * @default - false
     */
    readonly suppressWarnings?: boolean;
}
/**
 * Base class for Aspect that makes IMDSv2 required.
 */
declare abstract class RequireImdsv2Aspect implements cdk.IAspect {
    protected readonly suppressWarnings: boolean;
    constructor(props?: RequireImdsv2AspectProps);
    abstract visit(node: IConstruct): void;
    /**
     * Adds a warning annotation to a node, unless `suppressWarnings` is true.
     *
     * @param node The scope to add the warning to.
     * @param message The warning message.
     */
    protected warn(node: IConstruct, message: string): void;
}
/**
 * Properties for `InstanceRequireImdsv2Aspect`.
 */
export interface InstanceRequireImdsv2AspectProps extends RequireImdsv2AspectProps {
    /**
     * Whether warnings that would be raised when an Instance is associated with an existing Launch Template
     * should be suppressed or not.
     *
     * You can set this to `true` if `LaunchTemplateImdsAspect` is being used alongside this Aspect to
     * suppress false-positive warnings because any Launch Templates associated with Instances will still be covered.
     *
     * @default - false
     */
    readonly suppressLaunchTemplateWarning?: boolean;
}
/**
 * Aspect that applies IMDS configuration on EC2 Instance constructs.
 *
 * This aspect configures IMDS on an EC2 instance by creating a Launch Template with the
 * IMDS configuration and associating that Launch Template with the instance. If an Instance
 * is already associated with a Launch Template, a warning will (optionally) be added to the
 * construct node and it will be skipped.
 *
 * To cover Instances already associated with Launch Templates, use `LaunchTemplateImdsAspect`.
 */
export declare class InstanceRequireImdsv2Aspect extends RequireImdsv2Aspect {
    private readonly suppressLaunchTemplateWarning;
    constructor(props?: InstanceRequireImdsv2AspectProps);
    visit(node: IConstruct): void;
    protected warn(node: IConstruct, message: string): void;
}
/**
 * Properties for `LaunchTemplateRequireImdsv2Aspect`.
 */
export interface LaunchTemplateRequireImdsv2AspectProps extends RequireImdsv2AspectProps {
}
/**
 * Aspect that applies IMDS configuration on EC2 Launch Template constructs.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html
 */
export declare class LaunchTemplateRequireImdsv2Aspect extends RequireImdsv2Aspect {
    constructor(props?: LaunchTemplateRequireImdsv2AspectProps);
    visit(node: IConstruct): void;
}
export {};
