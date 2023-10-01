import { Metric, MetricOptions } from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Code } from './code';
import { Runtime } from './runtime';
import { Schedule } from './schedule';
/**
 * Specify a test that the canary should run
 */
export declare class Test {
    readonly code: Code;
    readonly handler: string;
    /**
     * Specify a custom test with your own code
     *
     * @returns `Test` associated with the specified Code object
     * @param options The configuration options
     */
    static custom(options: CustomTestOptions): Test;
    /**
     * Construct a Test property
     *
     * @param code The code that the canary should run
     * @param handler The handler of the canary
     */
    private constructor();
}
/**
 * Properties for specifying a test
 */
export interface CustomTestOptions {
    /**
     * The code of the canary script
     */
    readonly code: Code;
    /**
     * The handler for the code. Must end with `.handler`.
     */
    readonly handler: string;
}
/**
 * Different ways to clean up underlying Canary resources
 * when the Canary is deleted.
 */
export declare enum Cleanup {
    /**
     * Clean up nothing. The user is responsible for cleaning up
     * all resources left behind by the Canary.
     */
    NOTHING = "nothing",
    /**
     * Clean up the underlying Lambda function only. The user is
     * responsible for cleaning up all other resources left behind
     * by the Canary.
     */
    LAMBDA = "lambda"
}
/**
 * Options for specifying the s3 location that stores the data of each canary run. The artifacts bucket location **cannot**
 * be updated once the canary is created.
 */
export interface ArtifactsBucketLocation {
    /**
     * The s3 location that stores the data of each run.
     */
    readonly bucket: s3.IBucket;
    /**
     * The S3 bucket prefix. Specify this if you want a more specific path within the artifacts bucket.
     *
     * @default - no prefix
     */
    readonly prefix?: string;
}
/**
 * Properties for a canary
 */
export interface CanaryProps {
    /**
     * The s3 location that stores the data of the canary runs.
     *
     * @default - A new s3 bucket will be created without a prefix.
     */
    readonly artifactsBucketLocation?: ArtifactsBucketLocation;
    /**
     * Canary execution role.
     *
     * This is the role that will be assumed by the canary upon execution.
     * It controls the permissions that the canary will have. The role must
     * be assumable by the AWS Lambda service principal.
     *
     * If not supplied, a role will be created with all the required permissions.
     * If you provide a Role, you must add the required permissions.
     *
     * @see required permissions: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
     *
     * @default - A unique role will be generated for this canary.
     * You can add permissions to roles by calling 'addToRolePolicy'.
     */
    readonly role?: iam.IRole;
    /**
     * How long the canary will be in a 'RUNNING' state. For example, if you set `timeToLive` to be 1 hour and `schedule` to be `rate(10 minutes)`,
     * your canary will run at 10 minute intervals for an hour, for a total of 6 times.
     *
     * @default - no limit
     */
    readonly timeToLive?: cdk.Duration;
    /**
     * Specify the schedule for how often the canary runs. For example, if you set `schedule` to `rate(10 minutes)`, then the canary will run every 10 minutes.
     * You can set the schedule with `Schedule.rate(Duration)` (recommended) or you can specify an expression using `Schedule.expression()`.
     * @default 'rate(5 minutes)'
     */
    readonly schedule?: Schedule;
    /**
     * Whether or not the canary should start after creation.
     *
     * @default true
     */
    readonly startAfterCreation?: boolean;
    /**
     * How many days should successful runs be retained.
     *
     * @default Duration.days(31)
     */
    readonly successRetentionPeriod?: cdk.Duration;
    /**
     * How many days should failed runs be retained.
     *
     * @default Duration.days(31)
     */
    readonly failureRetentionPeriod?: cdk.Duration;
    /**
     * The name of the canary. Be sure to give it a descriptive name that distinguishes it from
     * other canaries in your account.
     *
     * Do not include secrets or proprietary information in your canary name. The canary name
     * makes up part of the canary ARN, which is included in outbound calls over the internet.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_canaries_security.html
     *
     * @default - A unique name will be generated from the construct ID
     */
    readonly canaryName?: string;
    /**
     * Specify the runtime version to use for the canary.
     *
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html
     */
    readonly runtime: Runtime;
    /**
     * The type of test that you want your canary to run. Use `Test.custom()` to specify the test to run.
     */
    readonly test: Test;
    /**
     * Key-value pairs that the Synthetics caches and makes available for your canary scripts. Use environment variables
     * to apply configuration changes, such as test and production environment configurations, without changing your
     * Canary script source code.
     *
     * @default - No environment variables.
     */
    readonly environmentVariables?: {
        [key: string]: string;
    };
    /**
     * The VPC where this canary is run.
     *
     * Specify this if the canary needs to access resources in a VPC.
     *
     * @default - Not in VPC
     */
    readonly vpc?: ec2.IVpc;
    /**
     * Where to place the network interfaces within the VPC. You must provide `vpc` when using this prop.
     *
     * @default - the Vpc default strategy if not specified
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * The list of security groups to associate with the canary's network interfaces. You must provide `vpc` when using this prop.
     *
     * @default - If the canary is placed within a VPC and a security group is
     * not specified a dedicated security group will be created for this canary.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * Whether or not to delete the lambda resources when the canary is deleted
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-deletelambdaresourcesoncanarydeletion
     *
     * @default false
     * @deprecated this feature has been deprecated by the service team, use `cleanup: Cleanup.LAMBDA` instead which will use a Custom Resource to achieve the same effect.
     */
    readonly enableAutoDeleteLambdas?: boolean;
    /**
     * Specify the underlying resources to be cleaned up when the canary is deleted.
     * Using `Cleanup.LAMBDA` will create a Custom Resource to achieve this.
     *
     * @default Cleanup.NOTHING
     */
    readonly cleanup?: Cleanup;
    /**
     * Lifecycle rules for the generated canary artifact bucket. Has no effect
     * if a bucket is passed to `artifactsBucketLocation`. If you pass a bucket
     * to `artifactsBucketLocation`, you can add lifecycle rules to the bucket
     * itself.
     *
     * @default - no rules applied to the generated bucket.
     */
    readonly artifactsBucketLifecycleRules?: Array<s3.LifecycleRule>;
}
/**
 * Define a new Canary
 */
export declare class Canary extends cdk.Resource implements ec2.IConnectable {
    /**
     * Execution role associated with this Canary.
     */
    readonly role: iam.IRole;
    /**
     * The canary ID
     * @attribute
     */
    readonly canaryId: string;
    /**
     * The state of the canary. For example, 'RUNNING', 'STOPPED', 'NOT STARTED', or 'ERROR'.
     * @attribute
     */
    readonly canaryState: string;
    /**
     * The canary Name
     * @attribute
     */
    readonly canaryName: string;
    /**
     * Bucket where data from each canary run is stored.
     */
    readonly artifactsBucket: s3.IBucket;
    /**
     * Actual connections object for the underlying Lambda
     *
     * May be unset, in which case the canary Lambda is not configured for use in a VPC.
     * @internal
     */
    private readonly _connections?;
    private readonly _resource;
    constructor(scope: Construct, id: string, props: CanaryProps);
    private cleanupUnderlyingResources;
    /**
     * Access the Connections object
     *
     * Will fail if not a VPC-enabled Canary
     */
    get connections(): ec2.Connections;
    /**
     * Measure the Duration of a single canary run, in seconds.
     *
     * @param options - configuration options for the metric
     *
     * @default avg over 5 minutes
     */
    metricDuration(options?: MetricOptions): Metric;
    /**
     * Measure the percentage of successful canary runs.
     *
     * @param options - configuration options for the metric
     *
     * @default avg over 5 minutes
     */
    metricSuccessPercent(options?: MetricOptions): Metric;
    /**
     * Measure the number of failed canary runs over a given time period.
     *
     * Default: sum over 5 minutes
     *
     * @param options - configuration options for the metric
     */
    metricFailed(options?: MetricOptions): Metric;
    /**
     * Returns a default role for the canary
     */
    private createDefaultRole;
    private logGroupArn;
    private lambdaArn;
    /**
     * Returns the code object taken in by the canary resource.
     */
    private createCode;
    /**
     * Verifies that the handler name matches the conventions given a certain runtime.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-handler
     * @param handler - the name of the handler
     * @param runtime - the runtime version
     */
    private validateHandler;
    private createRunConfig;
    /**
     * Returns a canary schedule object
     */
    private createSchedule;
    private createVpcConfig;
    /**
     * Creates a unique name for the canary. The generated name is the physical ID of the canary.
     */
    private generateUniqueName;
    private cannedMetric;
}
