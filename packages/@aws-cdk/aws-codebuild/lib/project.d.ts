import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import { DockerImageAssetProps } from '@aws-cdk/aws-ecr-assets';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IArtifacts } from './artifacts';
import { BuildSpec } from './build-spec';
import { Cache } from './cache';
import { CfnProject } from './codebuild.generated';
import { IFileSystemLocation } from './file-location';
import { LoggingOptions } from './project-logs';
import { ISource } from './source';
/**
 * The type returned from `IProject#enableBatchBuilds`.
 */
export interface BatchBuildConfig {
    /** The IAM batch service Role of this Project. */
    readonly role: iam.IRole;
}
/**
 * Location of a PEM certificate on S3
 */
export interface BuildEnvironmentCertificate {
    /**
     * The bucket where the certificate is
     */
    readonly bucket: s3.IBucket;
    /**
     * The full path and name of the key file
     */
    readonly objectKey: string;
}
/**
 * Additional options to pass to the notification rule.
 */
export interface ProjectNotifyOnOptions extends notifications.NotificationRuleOptions {
    /**
     * A list of event types associated with this notification rule for CodeBuild Project.
     * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
     * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
     */
    readonly events: ProjectNotificationEvents[];
}
export interface IProject extends IResource, iam.IGrantable, ec2.IConnectable, notifications.INotificationRuleSource {
    /**
     * The ARN of this Project.
     * @attribute
     */
    readonly projectArn: string;
    /**
     * The human-visible name of this Project.
     * @attribute
     */
    readonly projectName: string;
    /** The IAM service Role of this Project. Undefined for imported Projects. */
    readonly role?: iam.IRole;
    /**
     * Enable batch builds.
     *
     * Returns an object contining the batch service role if batch builds
     * could be enabled.
     */
    enableBatchBuilds(): BatchBuildConfig | undefined;
    addToRolePolicy(policyStatement: iam.PolicyStatement): void;
    /**
     * Defines a CloudWatch event rule triggered when something happens with this project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule triggered when the build project state
     * changes. You can filter specific build status events using an event
     * pattern filter on the `build-status` detail field:
     *
     *    const rule = project.onStateChange('OnBuildStarted', { target });
     *    rule.addEventPattern({
     *      detail: {
     *        'build-status': [
     *          "IN_PROGRESS",
     *          "SUCCEEDED",
     *          "FAILED",
     *          "STOPPED"
     *        ]
     *      }
     *    });
     *
     * You can also use the methods `onBuildFailed` and `onBuildSucceeded` to define rules for
     * these specific state changes.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule that triggers upon phase change of this
     * build project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onPhaseChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build starts.
     */
    onBuildStarted(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build fails.
     */
    onBuildFailed(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build completes successfully.
     */
    onBuildSucceeded(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * @returns a CloudWatch metric associated with this build project.
     * @param metricName The name of the metric
     * @param props Customization properties
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     *
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     *
     * @default average over 5 minutes
     */
    metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricSucceededBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of builds that failed because of client error or
     * because of a timeout.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricFailedBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Defines a CodeStar Notification rule triggered when the project
     * events emitted by you specified, it very similar to `onEvent` API.
     *
     * You can also use the methods `notifyOnBuildSucceeded` and
     * `notifyOnBuildFailed` to define rules for these specific event emitted.
     *
     * @param id The logical identifier of the CodeStar Notifications rule that will be created
     * @param target The target to register for the CodeStar Notifications destination.
     * @param options Customization options for CodeStar Notifications rule
     * @returns CodeStar Notifications rule associated with this build project.
     */
    notifyOn(id: string, target: notifications.INotificationRuleTarget, options: ProjectNotifyOnOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar notification rule which triggers when a build completes successfully.
     */
    notifyOnBuildSucceeded(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    /**
     * Defines a CodeStar notification rule which triggers when a build fails.
     */
    notifyOnBuildFailed(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
}
/**
 * Represents a reference to a CodeBuild Project.
 *
 * If you're managing the Project alongside the rest of your CDK resources,
 * use the `Project` class.
 *
 * If you want to reference an already existing Project
 * (or one defined in a different CDK Stack),
 * use the `import` method.
 */
declare abstract class ProjectBase extends Resource implements IProject {
    abstract readonly grantPrincipal: iam.IPrincipal;
    /** The ARN of this Project. */
    abstract readonly projectArn: string;
    /** The human-visible name of this Project. */
    abstract readonly projectName: string;
    /** The IAM service Role of this Project. */
    abstract readonly role?: iam.IRole;
    /**
     * Actual connections object for this Project.
     * May be unset, in which case this Project is not configured to use a VPC.
     * @internal
     */
    protected _connections: ec2.Connections | undefined;
    /**
     * Access the Connections object.
     * Will fail if this Project does not have a VPC set.
     */
    get connections(): ec2.Connections;
    enableBatchBuilds(): BatchBuildConfig | undefined;
    /**
     * Add a permission only if there's a policy attached.
     * @param statement The permissions statement to add
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    /**
     * Defines a CloudWatch event rule triggered when something happens with this project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule triggered when the build project state
     * changes. You can filter specific build status events using an event
     * pattern filter on the `build-status` detail field:
     *
     *    const rule = project.onStateChange('OnBuildStarted', { target });
     *    rule.addEventPattern({
     *      detail: {
     *        'build-status': [
     *          "IN_PROGRESS",
     *          "SUCCEEDED",
     *          "FAILED",
     *          "STOPPED"
     *        ]
     *      }
     *    });
     *
     * You can also use the methods `onBuildFailed` and `onBuildSucceeded` to define rules for
     * these specific state changes.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule that triggers upon phase change of this
     * build project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onPhaseChange(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build starts.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildStarted(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build fails.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildFailed(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an event rule which triggers when a build completes successfully.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildSucceeded(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * @returns a CloudWatch metric associated with this build project.
     * @param metricName The name of the metric
     * @param props Customization properties
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     *
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     *
     * @default average over 5 minutes
     */
    metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricSucceededBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Measures the number of builds that failed because of client error or
     * because of a timeout.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricFailedBuilds(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    notifyOn(id: string, target: notifications.INotificationRuleTarget, options: ProjectNotifyOnOptions): notifications.INotificationRule;
    notifyOnBuildSucceeded(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    notifyOnBuildFailed(id: string, target: notifications.INotificationRuleTarget, options?: notifications.NotificationRuleOptions): notifications.INotificationRule;
    bindAsNotificationRuleSource(_scope: Construct): notifications.NotificationRuleSourceConfig;
    private cannedMetric;
}
export interface CommonProjectProps {
    /**
     * A description of the project. Use the description to identify the purpose
     * of the project.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * Filename or contents of buildspec in JSON format.
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-example
     *
     * @default - Empty buildspec.
     */
    readonly buildSpec?: BuildSpec;
    /**
     * Service Role to assume while running the build.
     *
     * @default - A role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * Encryption key to use to read and write artifacts.
     *
     * @default - The AWS-managed CMK for Amazon Simple Storage Service (Amazon S3) is used.
     */
    readonly encryptionKey?: kms.IKey;
    /**
     * Caching strategy to use.
     *
     * @default Cache.none
     */
    readonly cache?: Cache;
    /**
     * Build environment to use for the build.
     *
     * @default BuildEnvironment.LinuxBuildImage.STANDARD_1_0
     */
    readonly environment?: BuildEnvironment;
    /**
     * Indicates whether AWS CodeBuild generates a publicly accessible URL for
     * your project's build badge. For more information, see Build Badges Sample
     * in the AWS CodeBuild User Guide.
     *
     * @default false
     */
    readonly badge?: boolean;
    /**
     * The number of minutes after which AWS CodeBuild stops the build if it's
     * not complete. For valid values, see the timeoutInMinutes field in the AWS
     * CodeBuild User Guide.
     *
     * @default Duration.hours(1)
     */
    readonly timeout?: Duration;
    /**
     * Additional environment variables to add to the build environment.
     *
     * @default - No additional environment variables are specified.
     */
    readonly environmentVariables?: {
        [name: string]: BuildEnvironmentVariable;
    };
    /**
     * Whether to check for the presence of any secrets in the environment variables of the default type, BuildEnvironmentVariableType.PLAINTEXT.
     * Since using a secret for the value of that kind of variable would result in it being displayed in plain text in the AWS Console,
     * the construct will throw an exception if it detects a secret was passed there.
     * Pass this property as false if you want to skip this validation,
     * and keep using a secret in a plain text environment variable.
     *
     * @default true
     */
    readonly checkSecretsInPlainTextEnvVariables?: boolean;
    /**
     * The physical, human-readable name of the CodeBuild Project.
     *
     * @default - Name is automatically generated.
     */
    readonly projectName?: string;
    /**
     * VPC network to place codebuild network interfaces
     *
     * Specify this if the codebuild project needs to access resources in a VPC.
     *
     * @default - No VPC is specified.
     */
    readonly vpc?: ec2.IVpc;
    /**
     * Where to place the network interfaces within the VPC.
     *
     * Only used if 'vpc' is supplied.
     *
     * @default - All private subnets.
     */
    readonly subnetSelection?: ec2.SubnetSelection;
    /**
     * What security group to associate with the codebuild project's network interfaces.
     * If no security group is identified, one will be created automatically.
     *
     * Only used if 'vpc' is supplied.
     *
     * @default - Security group will be automatically created.
     *
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * Whether to allow the CodeBuild to send all network traffic
     *
     * If set to false, you must individually add traffic rules to allow the
     * CodeBuild project to connect to network targets.
     *
     * Only used if 'vpc' is supplied.
     *
     * @default true
     */
    readonly allowAllOutbound?: boolean;
    /**
     * An  ProjectFileSystemLocation objects for a CodeBuild build project.
     *
     * A ProjectFileSystemLocation object specifies the identifier, location, mountOptions, mountPoint,
     * and type of a file system created using Amazon Elastic File System.
     *
     * @default - no file system locations
     */
    readonly fileSystemLocations?: IFileSystemLocation[];
    /**
     * Add permissions to this project's role to create and use test report groups with name starting with the name of this project.
     *
     * That is the standard report group that gets created when a simple name
     * (in contrast to an ARN)
     * is used in the 'reports' section of the buildspec of this project.
     * This is usually harmless, but you can turn these off if you don't plan on using test
     * reports in this project.
     *
     * @default true
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/test-report-group-naming.html
     */
    readonly grantReportGroupPermissions?: boolean;
    /**
     * Information about logs for the build project. A project can create logs in Amazon CloudWatch Logs, an S3 bucket, or both.
     *
     * @default - no log configuration is set
     */
    readonly logging?: LoggingOptions;
    /**
     * The number of minutes after which AWS CodeBuild stops the build if it's
     * still in queue. For valid values, see the timeoutInMinutes field in the AWS
     * CodeBuild User Guide.
     *
     * @default - no queue timeout is set
     */
    readonly queuedTimeout?: Duration;
    /**
     * Maximum number of concurrent builds. Minimum value is 1 and maximum is account build limit.
     *
     * @default - no explicit limit is set
     */
    readonly concurrentBuildLimit?: number;
    /**
     * Add the permissions necessary for debugging builds with SSM Session Manager
     *
     * If the following prerequisites have been met:
     *
     * - The necessary permissions have been added by setting this flag to true.
     * - The build image has the SSM agent installed (true for default CodeBuild images).
     * - The build is started with [debugSessionEnabled](https://docs.aws.amazon.com/codebuild/latest/APIReference/API_StartBuild.html#CodeBuild-StartBuild-request-debugSessionEnabled) set to true.
     *
     * Then the build container can be paused and inspected using Session Manager
     * by invoking the `codebuild-breakpoint` command somewhere during the build.
     *
     * `codebuild-breakpoint` commands will be ignored if the build is not started
     * with `debugSessionEnabled=true`.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html
     * @default false
     */
    readonly ssmSessionPermissions?: boolean;
}
export interface ProjectProps extends CommonProjectProps {
    /**
     * The source of the build.
     * *Note*: if `NoSource` is given as the source,
     * then you need to provide an explicit `buildSpec`.
     *
     * @default - NoSource
     */
    readonly source?: ISource;
    /**
     * Defines where build artifacts will be stored.
     * Could be: PipelineBuildArtifacts, NoArtifacts and S3Artifacts.
     *
     * @default NoArtifacts
     */
    readonly artifacts?: IArtifacts;
    /**
     * The secondary sources for the Project.
     * Can be also added after the Project has been created by using the `Project#addSecondarySource` method.
     *
     * @default - No secondary sources.
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    readonly secondarySources?: ISource[];
    /**
     * The secondary artifacts for the Project.
     * Can also be added after the Project has been created by using the `Project#addSecondaryArtifact` method.
     *
     * @default - No secondary artifacts.
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    readonly secondaryArtifacts?: IArtifacts[];
}
/**
 * The extra options passed to the `IProject.bindToCodePipeline` method.
 */
export interface BindToCodePipelineOptions {
    /**
     * The artifact bucket that will be used by the action that invokes this project.
     */
    readonly artifactBucket: s3.IBucket;
}
/**
 * A representation of a CodeBuild Project.
 */
export declare class Project extends ProjectBase {
    static fromProjectArn(scope: Construct, id: string, projectArn: string): IProject;
    /**
     * Import a Project defined either outside the CDK,
     * or in a different CDK Stack
     * (and exported using the `export` method).
     *
     * @note if you're importing a CodeBuild Project for use
     *   in a CodePipeline, make sure the existing Project
     *   has permissions to access the S3 Bucket of that Pipeline -
     *   otherwise, builds in that Pipeline will always fail.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param projectName the name of the project to import
     * @returns a reference to the existing Project
     */
    static fromProjectName(scope: Construct, id: string, projectName: string): IProject;
    /**
     * Convert the environment variables map of string to `BuildEnvironmentVariable`,
     * which is the customer-facing type, to a list of `CfnProject.EnvironmentVariableProperty`,
     * which is the representation of environment variables in CloudFormation.
     *
     * @param environmentVariables the map of string to environment variables
     * @param validateNoPlainTextSecrets whether to throw an exception
     *   if any of the plain text environment variables contain secrets, defaults to 'false'
     * @returns an array of `CfnProject.EnvironmentVariableProperty` instances
     */
    static serializeEnvVariables(environmentVariables: {
        [name: string]: BuildEnvironmentVariable;
    }, validateNoPlainTextSecrets?: boolean, principal?: iam.IGrantable): CfnProject.EnvironmentVariableProperty[];
    readonly grantPrincipal: iam.IPrincipal;
    /**
     * The IAM role for this project.
     */
    readonly role?: iam.IRole;
    /**
     * The ARN of the project.
     */
    readonly projectArn: string;
    /**
     * The name of the project.
     */
    readonly projectName: string;
    private readonly source;
    private readonly buildImage;
    private readonly _secondarySources;
    private readonly _secondarySourceVersions;
    private readonly _secondaryArtifacts;
    private _encryptionKey?;
    private readonly _fileSystemLocations;
    private _batchServiceRole?;
    constructor(scope: Construct, id: string, props: ProjectProps);
    enableBatchBuilds(): BatchBuildConfig | undefined;
    /**
     * Adds a secondary source to the Project.
     *
     * @param secondarySource the source to add as a secondary source
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    addSecondarySource(secondarySource: ISource): void;
    /**
     * Adds a fileSystemLocation to the Project.
     *
     * @param fileSystemLocation the fileSystemLocation to add
     */
    addFileSystemLocation(fileSystemLocation: IFileSystemLocation): void;
    /**
     * Adds a secondary artifact to the Project.
     *
     * @param secondaryArtifact the artifact to add as a secondary artifact
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    addSecondaryArtifact(secondaryArtifact: IArtifacts): void;
    /**
     * A callback invoked when the given project is added to a CodePipeline.
     *
     * @param _scope the construct the binding is taking place in
     * @param options additional options for the binding
     */
    bindToCodePipeline(_scope: Construct, options: BindToCodePipelineOptions): void;
    private validateProject;
    private set encryptionKey(value);
    private createLoggingPermission;
    private renderEnvironment;
    private renderFileSystemLocations;
    private renderSecondarySources;
    private renderSecondarySourceVersions;
    private renderSecondaryArtifacts;
    /**
     * If configured, set up the VPC-related properties
     *
     * Returns the VpcConfig that should be added to the
     * codebuild creation properties.
     */
    private configureVpc;
    private renderLoggingConfiguration;
    private addVpcRequiredPermissions;
    private validateCodePipelineSettings;
}
/**
 * Build machine compute type.
 */
export declare enum ComputeType {
    SMALL = "BUILD_GENERAL1_SMALL",
    MEDIUM = "BUILD_GENERAL1_MEDIUM",
    LARGE = "BUILD_GENERAL1_LARGE",
    X2_LARGE = "BUILD_GENERAL1_2XLARGE"
}
/**
 * The type of principal CodeBuild will use to pull your build Docker image.
 */
export declare enum ImagePullPrincipalType {
    /**
     * CODEBUILD specifies that CodeBuild uses its own identity when pulling the image.
     * This means the resource policy of the ECR repository that hosts the image will be modified to trust
     * CodeBuild's service principal.
     * This is the required principal type when using CodeBuild's pre-defined images.
     */
    CODEBUILD = "CODEBUILD",
    /**
     * SERVICE_ROLE specifies that AWS CodeBuild uses the project's role when pulling the image.
     * The role will be granted pull permissions on the ECR repository hosting the image.
     */
    SERVICE_ROLE = "SERVICE_ROLE"
}
export interface BuildEnvironment {
    /**
     * The image used for the builds.
     *
     * @default LinuxBuildImage.STANDARD_1_0
     */
    readonly buildImage?: IBuildImage;
    /**
     * The type of compute to use for this build.
     * See the `ComputeType` enum for the possible values.
     *
     * @default taken from `#buildImage#defaultComputeType`
     */
    readonly computeType?: ComputeType;
    /**
     * Indicates how the project builds Docker images. Specify true to enable
     * running the Docker daemon inside a Docker container. This value must be
     * set to true only if this build project will be used to build Docker
     * images, and the specified build environment image is not one provided by
     * AWS CodeBuild with Docker support. Otherwise, all associated builds that
     * attempt to interact with the Docker daemon will fail.
     *
     * @default false
     */
    readonly privileged?: boolean;
    /**
     * The location of the PEM-encoded certificate for the build project
     *
     * @default - No external certificate is added to the project
     */
    readonly certificate?: BuildEnvironmentCertificate;
    /**
     * The environment variables that your builds can use.
     */
    readonly environmentVariables?: {
        [name: string]: BuildEnvironmentVariable;
    };
}
/**
 * Represents a Docker image used for the CodeBuild Project builds.
 * Use the concrete subclasses, either:
 * `LinuxBuildImage` or `WindowsBuildImage`.
 */
export interface IBuildImage {
    /**
     * The type of build environment.
     */
    readonly type: string;
    /**
     * The Docker image identifier that the build environment uses.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
     */
    readonly imageId: string;
    /**
     * The default `ComputeType` to use with this image,
     * if one was not specified in `BuildEnvironment#computeType` explicitly.
     */
    readonly defaultComputeType: ComputeType;
    /**
     * The type of principal that CodeBuild will use to pull this build Docker image.
     *
     * @default ImagePullPrincipalType.SERVICE_ROLE
     */
    readonly imagePullPrincipalType?: ImagePullPrincipalType;
    /**
     * The secretsManagerCredentials for access to a private registry.
     *
     * @default no credentials will be used
     */
    readonly secretsManagerCredentials?: secretsmanager.ISecret;
    /**
     * An optional ECR repository that the image is hosted in.
     *
     * @default no repository
     */
    readonly repository?: ecr.IRepository;
    /**
     * Allows the image a chance to validate whether the passed configuration is correct.
     *
     * @param buildEnvironment the current build environment
     */
    validate(buildEnvironment: BuildEnvironment): string[];
    /**
     * Make a buildspec to run the indicated script
     */
    runScriptBuildspec(entrypoint: string): BuildSpec;
}
/** Optional arguments to `IBuildImage.binder` - currently empty. */
export interface BuildImageBindOptions {
}
/** The return type from `IBuildImage.binder` - currently empty. */
export interface BuildImageConfig {
}
/** A variant of `IBuildImage` that allows binding to the project. */
export interface IBindableBuildImage extends IBuildImage {
    /** Function that allows the build image access to the construct tree. */
    bind(scope: Construct, project: IProject, options: BuildImageBindOptions): BuildImageConfig;
}
/**
 * The options when creating a CodeBuild Docker build image
 * using `LinuxBuildImage.fromDockerRegistry`
 * or `WindowsBuildImage.fromDockerRegistry`.
 */
export interface DockerImageOptions {
    /**
     * The credentials, stored in Secrets Manager,
     * used for accessing the repository holding the image,
     * if the repository is private.
     *
     * @default no credentials will be used (we assume the repository is public)
     */
    readonly secretsManagerCredentials?: secretsmanager.ISecret;
}
/**
 * A CodeBuild image running x86-64 Linux.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - LinuxBuildImage.fromDockerRegistry(image[, { secretsManagerCredentials }])
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 * - LinuxBuildImage.fromAsset(parent, id, props)
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export declare class LinuxBuildImage implements IBuildImage {
    static readonly STANDARD_1_0: IBuildImage;
    static readonly STANDARD_2_0: IBuildImage;
    static readonly STANDARD_3_0: IBuildImage;
    /** The `aws/codebuild/standard:4.0` build image. */
    static readonly STANDARD_4_0: IBuildImage;
    /** The `aws/codebuild/standard:5.0` build image. */
    static readonly STANDARD_5_0: IBuildImage;
    /** The `aws/codebuild/standard:6.0` build image. */
    static readonly STANDARD_6_0: IBuildImage;
    static readonly AMAZON_LINUX_2: IBuildImage;
    static readonly AMAZON_LINUX_2_2: IBuildImage;
    /** The Amazon Linux 2 x86_64 standard image, version `3.0`. */
    static readonly AMAZON_LINUX_2_3: IBuildImage;
    /** The Amazon Linux 2 x86_64 standard image, version `4.0`. */
    static readonly AMAZON_LINUX_2_4: IBuildImage;
    /** @deprecated Use LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0 instead. */
    static readonly AMAZON_LINUX_2_ARM: IBuildImage;
    /**
     * Image "aws/codebuild/amazonlinux2-aarch64-standard:2.0".
     * @deprecated Use LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0 instead.
     * */
    static readonly AMAZON_LINUX_2_ARM_2: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_BASE: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_ANDROID_JAVA8_24_4_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_ANDROID_JAVA8_26_1_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_DOCKER_17_09_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_DOCKER_18_09_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_GOLANG_1_10: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_GOLANG_1_11: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_OPEN_JDK_8: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_OPEN_JDK_9: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_OPEN_JDK_11: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_NODEJS_10_14_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_NODEJS_10_1_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_NODEJS_8_11_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_NODEJS_6_3_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PHP_5_6: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PHP_7_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PHP_7_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_3_7_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_3_6_5: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_3_5_2: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_3_4_5: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_3_3_6: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_PYTHON_2_7_12: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_RUBY_2_5_3: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_RUBY_2_5_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_RUBY_2_3_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_RUBY_2_2_5: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_DOTNET_CORE_1_1: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_DOTNET_CORE_2_0: IBuildImage;
    /** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
    static readonly UBUNTU_14_04_DOTNET_CORE_2_1: IBuildImage;
    /**
     * @returns a x86-64 Linux build image from a Docker Hub image.
     */
    static fromDockerRegistry(name: string, options?: DockerImageOptions): IBuildImage;
    /**
     * @returns A x86-64 Linux build image from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     */
    static fromEcrRepository(repository: ecr.IRepository, tagOrDigest?: string): IBuildImage;
    /**
     * Uses an Docker image asset as a x86-64 Linux build image.
     */
    static fromAsset(scope: Construct, id: string, props: DockerImageAssetProps): IBuildImage;
    /**
     * Uses a Docker image provided by CodeBuild.
     *
     * @returns A Docker image provided by CodeBuild.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
     *
     * @param id The image identifier
     * @example 'aws/codebuild/standard:4.0'
     */
    static fromCodeBuildImageId(id: string): IBuildImage;
    private static codeBuildImage;
    readonly type = "LINUX_CONTAINER";
    readonly defaultComputeType = ComputeType.SMALL;
    readonly imageId: string;
    readonly imagePullPrincipalType?: ImagePullPrincipalType;
    readonly secretsManagerCredentials?: secretsmanager.ISecret;
    readonly repository?: ecr.IRepository;
    private constructor();
    validate(_: BuildEnvironment): string[];
    runScriptBuildspec(entrypoint: string): BuildSpec;
}
/**
 * Environment type for Windows Docker images
 */
export declare enum WindowsImageType {
    /**
     * The standard environment type, WINDOWS_CONTAINER
     */
    STANDARD = "WINDOWS_CONTAINER",
    /**
     * The WINDOWS_SERVER_2019_CONTAINER environment type
     */
    SERVER_2019 = "WINDOWS_SERVER_2019_CONTAINER"
}
/**
 * A CodeBuild image running Windows.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - WindowsBuildImage.fromDockerRegistry(image[, { secretsManagerCredentials }, imageType])
 * - WindowsBuildImage.fromEcrRepository(repo[, tag, imageType])
 * - WindowsBuildImage.fromAsset(parent, id, props, [, imageType])
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export declare class WindowsBuildImage implements IBuildImage {
    /**
     * Corresponds to the standard CodeBuild image `aws/codebuild/windows-base:1.0`.
     *
     * @deprecated `WindowsBuildImage.WINDOWS_BASE_2_0` should be used instead.
     */
    static readonly WIN_SERVER_CORE_2016_BASE: IBuildImage;
    /**
     * The standard CodeBuild image `aws/codebuild/windows-base:2.0`, which is
     * based off Windows Server Core 2016.
     */
    static readonly WINDOWS_BASE_2_0: IBuildImage;
    /**
     * The standard CodeBuild image `aws/codebuild/windows-base:2019-1.0`, which is
     * based off Windows Server Core 2019.
     */
    static readonly WIN_SERVER_CORE_2019_BASE: IBuildImage;
    /**
     * The standard CodeBuild image `aws/codebuild/windows-base:2019-2.0`, which is
     * based off Windows Server Core 2019.
     */
    static readonly WIN_SERVER_CORE_2019_BASE_2_0: IBuildImage;
    /**
     * @returns a Windows build image from a Docker Hub image.
     */
    static fromDockerRegistry(name: string, options?: DockerImageOptions, imageType?: WindowsImageType): IBuildImage;
    /**
     * @returns A Windows build image from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     */
    static fromEcrRepository(repository: ecr.IRepository, tagOrDigest?: string, imageType?: WindowsImageType): IBuildImage;
    /**
     * Uses an Docker image asset as a Windows build image.
     */
    static fromAsset(scope: Construct, id: string, props: DockerImageAssetProps, imageType?: WindowsImageType): IBuildImage;
    readonly type: string;
    readonly defaultComputeType = ComputeType.MEDIUM;
    readonly imageId: string;
    readonly imagePullPrincipalType?: ImagePullPrincipalType;
    readonly secretsManagerCredentials?: secretsmanager.ISecret;
    readonly repository?: ecr.IRepository;
    private constructor();
    validate(buildEnvironment: BuildEnvironment): string[];
    runScriptBuildspec(entrypoint: string): BuildSpec;
}
export interface BuildEnvironmentVariable {
    /**
     * The type of environment variable.
     * @default PlainText
     */
    readonly type?: BuildEnvironmentVariableType;
    /**
     * The value of the environment variable.
     * For plain-text variables (the default), this is the literal value of variable.
     * For SSM parameter variables, pass the name of the parameter here (`parameterName` property of `IParameter`).
     * For SecretsManager variables secrets, pass either the secret name (`secretName` property of `ISecret`)
     * or the secret ARN (`secretArn` property of `ISecret`) here,
     * along with optional SecretsManager qualifiers separated by ':', like the JSON key, or the version or stage
     * (see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager for details).
     */
    readonly value: any;
}
export declare enum BuildEnvironmentVariableType {
    /**
     * An environment variable in plaintext format.
     */
    PLAINTEXT = "PLAINTEXT",
    /**
     * An environment variable stored in Systems Manager Parameter Store.
     */
    PARAMETER_STORE = "PARAMETER_STORE",
    /**
     * An environment variable stored in AWS Secrets Manager.
     */
    SECRETS_MANAGER = "SECRETS_MANAGER"
}
/**
 * The list of event types for AWS Codebuild
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
 */
export declare enum ProjectNotificationEvents {
    /**
     * Trigger notification when project build state failed
     */
    BUILD_FAILED = "codebuild-project-build-state-failed",
    /**
     * Trigger notification when project build state succeeded
     */
    BUILD_SUCCEEDED = "codebuild-project-build-state-succeeded",
    /**
     * Trigger notification when project build state in progress
     */
    BUILD_IN_PROGRESS = "codebuild-project-build-state-in-progress",
    /**
     * Trigger notification when project build state stopped
     */
    BUILD_STOPPED = "codebuild-project-build-state-stopped",
    /**
     * Trigger notification when project build phase failure
     */
    BUILD_PHASE_FAILED = "codebuild-project-build-phase-failure",
    /**
     * Trigger notification when project build phase success
     */
    BUILD_PHASE_SUCCEEDED = "codebuild-project-build-phase-success"
}
export {};
