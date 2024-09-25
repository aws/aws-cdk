import { DefaultCdkOptions, RequireApproval } from './common';
/**
 * Options to use with cdk deploy
 */
export interface DeployOptions extends DefaultCdkOptions {
    /**
     * Only perform action on the given stack
     *
     * @default false
     */
    readonly exclusively?: boolean;
    /**
     * Name of the toolkit stack to use/deploy
     *
     * @default CDKToolkit
     */
    readonly toolkitStackName?: string;
    /**
     * Reuse the assets with the given asset IDs
     *
     * @default - do not reuse assets
     */
    readonly reuseAssets?: string[];
    /**
     * Optional name to use for the CloudFormation change set.
     * If not provided, a name will be generated automatically.
     *
     * @default - auto generate a name
     */
    readonly changeSetName?: string;
    /**
     * Always deploy, even if templates are identical.
     * @default false
     */
    readonly force?: boolean;
    /**
     * Rollback failed deployments
     *
     * @default true
     */
    readonly rollback?: boolean;
    /**
     * ARNs of SNS topics that CloudFormation will notify with stack related events
     *
     * @default - no notifications
     */
    readonly notificationArns?: string[];
    /**
     * What kind of security changes require approval
     *
     * @default RequireApproval.Never
     */
    readonly requireApproval?: RequireApproval;
    /**
     * Whether to execute the ChangeSet
     * Not providing `execute` parameter will result in execution of ChangeSet
     * @default true
     */
    readonly execute?: boolean;
    /**
     * Additional parameters for CloudFormation at deploy time
     * @default {}
     */
    readonly parameters?: {
        [name: string]: string;
    };
    /**
     * Use previous values for unspecified parameters
     *
     * If not set, all parameters must be specified for every deployment.
     *
     * @default true
     */
    readonly usePreviousParameters?: boolean;
    /**
     * Path to file where stack outputs will be written after a successful deploy as JSON
     * @default - Outputs are not written to any file
     */
    readonly outputsFile?: string;
    /**
     * Whether we are on a CI system
     *
     * @default false
     */
    readonly ci?: boolean;
    /**
     * Deploy multiple stacks in parallel
     *
     * @default 1
     */
    readonly concurrency?: number;
}
