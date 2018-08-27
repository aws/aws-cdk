import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { BuildArtifacts, CodePipelineBuildArtifacts, NoBuildArtifacts } from './artifacts';
import { cloudformation, ProjectArn, ProjectName } from './codebuild.generated';
import { BuildSource } from './source';

const CODEPIPELINE_TYPE = 'CODEPIPELINE';

/**
 * Properties of a reference to a CodeBuild Project.
 *
 * @see ProjectRef.import
 * @see ProjectRef.export
 */
export interface ProjectRefProps {
    /**
     * The human-readable name of the CodeBuild Project we're referencing.
     * The Project must be in the same account and region as the root Stack.
     */
    projectName: ProjectName;
}

/**
 * Represents a reference to a CodeBuild Project.
 *
 * If you're managing the Project alongside the rest of your CDK resources,
 * use the {@link Project} class.
 *
 * If you want to reference an already existing Project
 * (or one defined in a different CDK Stack),
 * use the {@link import} method.
 */
export abstract class ProjectRef extends cdk.Construct implements events.IEventRuleTarget {
    /**
     * Import a Project defined either outside the CDK,
     * or in a different CDK Stack
     * (and exported using the {@link export} method).
     *
     * @note if you're importing a CodeBuild Project for use
     *   in a CodePipeline, make sure the existing Project
     *   has permissions to access the S3 Bucket of that Pipeline -
     *   otherwise, builds in that Pipeline will always fail.
     *
     * @param parent the parent Construct for this Construct
     * @param name the logical name of this Construct
     * @param props the properties of the referenced Project
     * @returns a reference to the existing Project
     */
    public static import(parent: cdk.Construct, name: string, props: ProjectRefProps): ProjectRef {
        return new ImportedProjectRef(parent, name, props);
    }

    /** The ARN of this Project. */
    public abstract readonly projectArn: ProjectArn;

    /** The human-visible name of this Project. */
    public abstract readonly projectName: ProjectName;

    /** The IAM service Role of this Project. Undefined for imported Projects. */
    public abstract readonly role?: iam.Role;

    /** A role used by CloudWatch events to trigger a build */
    private eventsRole?: iam.Role;

    /**
     * Export this Project. Allows referencing this Project in a different CDK Stack.
     */
    public export(): ProjectRefProps {
        return {
            projectName: new cdk.Output(this, 'ProjectName', { value: this.projectName }).makeImportValue(),
        };
    }

    /**
     * Defines a CloudWatch event rule triggered when the build project state
     * changes. You can filter specific build status events using an event
     * pattern filter on the `build-status` detail field:
     *
     *      const rule = project.onStateChange('OnBuildStarted', target);
     *      rule.addEventPattern({
     *          detail: {
     *              'build-status': [
     *                  "IN_PROGRESS",
     *                  "SUCCEEDED",
     *                  "FAILED",
     *                  "STOPPED"
     *              ]
     *          }
     *      });
     *
     * You can also use the methods `onBuildFailed` and `onBuildSucceeded` to define rules for
     * these specific state changes.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = new events.EventRule(this, name, options);
        rule.addTarget(target);
        rule.addEventPattern({
            source: [ 'aws.codebuild' ],
            detailType: [ 'CodeBuild Build State Change' ],
            detail: {
                'project-name': [
                    this.projectName
                ]
            }
        });
        return rule;
    }

    /**
     * Defines a CloudWatch event rule that triggers upon phase change of this
     * build project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    public onPhaseChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = new events.EventRule(this, name, options);
        rule.addTarget(target);
        rule.addEventPattern({
            source: [ 'aws.codebuild' ],
            detailType: [ 'CodeBuild Build Phase Change' ],
            detail: {
                'project-name': [
                    this.projectName
                ]
            }
        });
        return rule;
    }

    /**
     * Defines an event rule which triggers when a build starts.
     */
    public onBuildStarted(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = this.onStateChange(name, target, options);
        rule.addEventPattern({
            detail: {
                'build-status': [ 'IN_PROGRESS' ]
            }
        });
        return rule;
    }

    /**
     * Defines an event rule which triggers when a build fails.
     */
    public onBuildFailed(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = this.onStateChange(name, target, options);
        rule.addEventPattern({
            detail: {
                'build-status': [ 'FAILED' ]
            }
        });
        return rule;
    }

    /**
     * Defines an event rule which triggers when a build completes successfully.
     */
    public onBuildSucceeded(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = this.onStateChange(name, target, options);
        rule.addEventPattern({
            detail: {
                'build-status': [ 'SUCCEEDED' ]
            }
        });
        return rule;
    }

    /**
     * @returns a CloudWatch metric associated with this build project.
     * @param metricName The name of the metric
     * @param props Customization properties
     */
    public metric(metricName: string, props: cloudwatch.MetricCustomization) {
        return new cloudwatch.Metric({
            namespace: 'AWS/CodeBuild',
            metricName,
            dimensions: { ProjectName: this.projectName },
            ...props
        });
    }

    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    public metricBuilds(props?: cloudwatch.MetricCustomization) {
        return this.metric('Builds', {
            statistic: 'sum',
            ...props,
        });
    }

    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     *
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     *
     * @default average over 5 minutes
     */
    public metricDuration(props?: cloudwatch.MetricCustomization) {
        return this.metric('Duration', {
            statistic: 'avg',
            ...props
        });
    }

    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    public metricSucceededBuilds(props?: cloudwatch.MetricCustomization) {
        return this.metric('SucceededBuilds', {
            statistic: 'sum',
            ...props,
        });
    }

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
    public metricFailedBuilds(props?: cloudwatch.MetricCustomization) {
        return this.metric('FailedBuilds', {
            statistic: 'sum',
            ...props,
        });
    }

    /**
     * Allows using build projects as event rule targets.
     */
    public asEventRuleTarget(_ruleArn: events.RuleArn, _ruleId: string): events.EventRuleTargetProps {
        if (!this.eventsRole) {
            this.eventsRole = new iam.Role(this, 'EventsRole', {
                assumedBy: new cdk.ServicePrincipal('events.amazonaws.com')
            });

            this.eventsRole.addToPolicy(new cdk.PolicyStatement()
                .addAction('codebuild:StartBuild')
                .addResource(this.projectArn));
        }

        return {
            id: this.id,
            arn: this.projectArn,
            roleArn: this.eventsRole.roleArn,
        };
    }
}

class ImportedProjectRef extends ProjectRef {
    public readonly projectArn: ProjectArn;
    public readonly projectName: ProjectName;
    public readonly role?: iam.Role = undefined;

    constructor(parent: cdk.Construct, name: string, props: ProjectRefProps) {
        super(parent, name);

        this.projectArn = cdk.Arn.fromComponents({
            service: 'codebuild',
            resource: 'project',
            resourceName: props.projectName,
        });
        this.projectName = props.projectName;
    }
}

export interface CommonProjectProps {
    /**
     * A description of the project. Use the description to identify the purpose
     * of the project.
     */
    description?: string;

    /**
     * Filename or contents of buildspec in JSON format.
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-example
     */
    buildSpec?: any;

    /**
     * Service Role to assume while running the build.
     * If not specified, a role will be created.
     */
    role?: iam.Role;

    /**
     * Encryption key to use to read and write artifacts
     * If not specified, a role will be created.
     */
    encryptionKey?: kms.EncryptionKeyRef;

    /**
     * Bucket to store cached source artifacts
     * If not specified, source artifacts will not be cached.
     */
    cacheBucket?: s3.BucketRef;

    /**
     * Subdirectory to store cached artifacts
     */
    cacheDir?: string;

    /**
     * Build environment to use for the build.
     */
    environment?: BuildEnvironment;

    /**
     * Indicates whether AWS CodeBuild generates a publicly accessible URL for
     * your project's build badge. For more information, see Build Badges Sample
     * in the AWS CodeBuild User Guide.
     */
    badge?: boolean;

    /**
     * The number of minutes after which AWS CodeBuild stops the build if it's
     * not complete. For valid values, see the timeoutInMinutes field in the AWS
     * CodeBuild User Guide.
     */
    timeout?: number;

    /**
     * Additional environment variables to add to the build environment.
     */
    environmentVariables?: { [name: string]: BuildEnvironmentVariable };

    /**
     * The physical, human-readable name of the CodeBuild Project.
     */
    projectName?: string;
}

export interface ProjectProps extends CommonProjectProps {
    /**
     * The source of the build.
     */
    source: BuildSource;

    /**
     * Defines where build artifacts will be stored.
     * Could be: PipelineBuildArtifacts, NoBuildArtifacts and S3BucketBuildArtifacts.
     *
     * @default NoBuildArtifacts
     */
    artifacts?: BuildArtifacts;
}

/**
 * A representation of a CodeBuild Project.
 */
export class Project extends ProjectRef {
    /**
     * The IAM role for this project.
     */
    public readonly role?: iam.Role;

    /**
     * The ARN of the project.
     */
    public readonly projectArn: ProjectArn;

    /**
     * The name of the project.
     */
    public readonly projectName: ProjectName;

    constructor(parent: cdk.Construct, name: string, props: ProjectProps) {
        super(parent, name);

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new cdk.ServicePrincipal('codebuild.amazonaws.com')
        });

        const environment = this.renderEnvironment(props.environment, props.environmentVariables);

        let cache: cloudformation.ProjectResource.ProjectCacheProperty | undefined;
        if (props.cacheBucket) {
            const cacheDir = props.cacheDir != null ? props.cacheDir : '';
            cache = {
                type: 'S3',
                location: props.cacheBucket.arnForObjects(cacheDir)
            };

            props.cacheBucket.grantReadWrite(this.role);
        }

        // let source "bind" to the project. this usually involves granting permissions
        // for the code build role to interact with the source.
        const source = props.source;
        source.bind(this);

        const artifacts = this.parseArtifacts(props);
        artifacts.bind(this);

        const sourceJson = source.toSourceJSON();
        if (typeof props.buildSpec === 'string') {
            sourceJson.buildSpec = props.buildSpec;
        } else {
            sourceJson.buildSpec = JSON.stringify(props.buildSpec);
        }

        this.validateCodePipelineSettings(source, artifacts);

        const resource = new cloudformation.ProjectResource(this, 'Resource', {
            description: props.description,
            source: sourceJson,
            artifacts: artifacts.toArtifactsJSON(),
            serviceRole: this.role.roleArn,
            environment,
            encryptionKey: props.encryptionKey && props.encryptionKey.keyArn,
            badgeEnabled: props.badge,
            cache,
            projectName: props.projectName,
        });

        this.projectArn = resource.projectArn;
        this.projectName = resource.ref;

        this.addToRolePolicy(this.createLoggingPermission());
    }

    /**
     * Add a permission only if there's a policy attached.
     * @param statement The permissions statement to add
     */
    public addToRolePolicy(statement: cdk.PolicyStatement) {
        if (this.role) {
            this.role.addToPolicy(statement);
        }
    }

    private createLoggingPermission() {
        const logGroupArn = cdk.Arn.fromComponents({
            service: 'logs',
            resource: 'log-group',
            sep: ':',
            resourceName: new cdk.FnConcat('/aws/codebuild/', this.projectName),
        });

        const logGroupStarArn = new cdk.FnConcat(logGroupArn, ':*');

        const p = new cdk.PolicyStatement();
        p.allow();
        p.addResource(logGroupArn);
        p.addResource(logGroupStarArn);
        p.addAction('logs:CreateLogGroup');
        p.addAction('logs:CreateLogStream');
        p.addAction('logs:PutLogEvents');

        return p;
    }

    private renderEnvironment(env: BuildEnvironment = {},
                              projectVars: { [name: string]: BuildEnvironmentVariable } = {}):
            cloudformation.ProjectResource.EnvironmentProperty {
        const vars: { [name: string]: BuildEnvironmentVariable } = {};
        const containerVars = env.environmentVariables || {};

        // first apply environment variables from the container definition
        for (const name of Object.keys(containerVars)) {
            vars[name] = containerVars[name];
        }

        // now apply project-level vars
        for (const name of Object.keys(projectVars)) {
            vars[name] = projectVars[name];
        }

        const hasEnvironmentVars = Object.keys(vars).length > 0;

        const buildImage = env.buildImage || LinuxBuildImage.UBUNTU_14_04_BASE;
        const errors = buildImage.validate(env);
        if (errors.length > 0) {
            throw new Error("Invalid CodeBuild environment: " + errors.join('\n'));
        }

        return {
            type: buildImage.type,
            image: buildImage.imageId,
            privilegedMode: env.priviledged || false,
            computeType: env.computeType || buildImage.defaultComputeType,
            environmentVariables: !hasEnvironmentVars ? undefined : Object.keys(vars).map(name => ({
                name,
                type: vars[name].type || BuildEnvironmentVariableType.PlainText,
                value: vars[name].value
            }))
        };
    }

    private parseArtifacts(props: ProjectProps) {
        if (props.artifacts) {
            return props.artifacts;
        }
        if (props.source.toSourceJSON().type === CODEPIPELINE_TYPE) {
            return new CodePipelineBuildArtifacts();
        } else {
            return new NoBuildArtifacts();
        }
    }

    private validateCodePipelineSettings(source: BuildSource, artifacts: BuildArtifacts) {
        const sourceType = source.toSourceJSON().type;
        const artifactsType = artifacts.toArtifactsJSON().type;

        if ((sourceType === CODEPIPELINE_TYPE || artifactsType === CODEPIPELINE_TYPE) &&
            (sourceType !== artifactsType)) {
                throw new Error('Both source and artifacts must be set to CodePipeline');
        }
    }
}

/**
 * Build machine compute type.
 */
export enum ComputeType {
    Small  = 'BUILD_GENERAL1_SMALL',
    Medium = 'BUILD_GENERAL1_MEDIUM',
    Large  = 'BUILD_GENERAL1_LARGE'
}

export interface BuildEnvironment {
    /**
     * The image used for the builds.
     *
     * @default LinuxBuildImage.UBUNTU_14_04_BASE
     */
    buildImage?: IBuildImage;

    /**
     * The type of compute to use for this build.
     * See the {@link ComputeType} enum for the possible values.
     *
     * @default taken from {@link #buildImage#defaultComputeType}
     */
    computeType?: ComputeType;

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
    priviledged?: boolean;

    /**
     * The environment variables that your builds can use.
     */
    environmentVariables?: { [name: string]: BuildEnvironmentVariable };
}

/**
 * Represents a Docker image used for the CodeBuild Project builds.
 * Use the concrete subclasses, either:
 * {@link LinuxBuildImage} or {@link WindowsBuildImage}.
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
     * The default {@link ComputeType} to use with this image,
     * if one was not specified in {@link BuildEnvironment#computeType} explicitly.
     */
    readonly defaultComputeType: ComputeType;

    /**
     * Allows the image a chance to validate whether the passed configuration is correct.
     *
     * @param buildEnvironment the current build environment
     */
    validate(buildEnvironment: BuildEnvironment): string[];
}

/**
 * A CodeBuild image running Linux.
 * This class has a bunch of public constants that represent the most popular images.
 * If you need to use with an image that isn't in the named constants,
 * you can always instantiate it directly.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class LinuxBuildImage implements IBuildImage {
    public static readonly UBUNTU_14_04_BASE = new LinuxBuildImage('aws/codebuild/ubuntu-base:14.04');
    public static readonly UBUNTU_14_04_ANDROID_JAVA8_24_4_1 = new LinuxBuildImage('aws/codebuild/android-java-8:24.4.1');
    public static readonly UBUNTU_14_04_ANDROID_JAVA8_26_1_1 = new LinuxBuildImage('aws/codebuild/android-java-8:26.1.1');
    public static readonly UBUNTU_14_04_DOCKER_17_09_0 = new LinuxBuildImage('aws/codebuild/docker:17.09.0');
    public static readonly UBUNTU_14_04_GOLANG_1_10 = new LinuxBuildImage('aws/codebuild/golang:1.10');
    public static readonly UBUNTU_14_04_OPEN_JDK_8 = new LinuxBuildImage('aws/codebuild/java:openjdk-8');
    public static readonly UBUNTU_14_04_OPEN_JDK_9 = new LinuxBuildImage('aws/codebuild/java:openjdk-9');
    public static readonly UBUNTU_14_04_NODEJS_10_1_0 = new LinuxBuildImage('aws/codebuild/nodejs:10.1.0');
    public static readonly UBUNTU_14_04_NODEJS_8_11_0 = new LinuxBuildImage('aws/codebuild/nodejs:8.11.0');
    public static readonly UBUNTU_14_04_NODEJS_6_3_1 = new LinuxBuildImage('aws/codebuild/nodejs:6.3.1');
    public static readonly UBUNTU_14_04_PHP_5_6 = new LinuxBuildImage('aws/codebuild/php:5.6');
    public static readonly UBUNTU_14_04_PHP_7_0 = new LinuxBuildImage('aws/codebuild/php:7.0');
    public static readonly UBUNTU_14_04_PYTHON_3_6_5 = new LinuxBuildImage('aws/codebuild/python:3.6.5');
    public static readonly UBUNTU_14_04_PYTHON_3_5_2 = new LinuxBuildImage('aws/codebuild/python:3.5.2');
    public static readonly UBUNTU_14_04_PYTHON_3_4_5 = new LinuxBuildImage('aws/codebuild/python:3.4.5');
    public static readonly UBUNTU_14_04_PYTHON_3_3_6 = new LinuxBuildImage('aws/codebuild/python:3.3.6');
    public static readonly UBUNTU_14_04_PYTHON_2_7_12 = new LinuxBuildImage('aws/codebuild/python:2.7.12');
    public static readonly UBUNTU_14_04_RUBY_2_5_1 = new LinuxBuildImage('aws/codebuild/ruby:2.5.1');
    public static readonly UBUNTU_14_04_RUBY_2_3_1 = new LinuxBuildImage('aws/codebuild/ruby:2.3.1');
    public static readonly UBUNTU_14_04_RUBY_2_2_5 = new LinuxBuildImage('aws/codebuild/ruby:2.2.5');
    public static readonly UBUNTU_14_04_DOTNET_CORE_1_1 = new LinuxBuildImage('aws/codebuild/dot-net:core-1');
    public static readonly UBUNTU_14_04_DOTNET_CORE_2_0 = new LinuxBuildImage('aws/codebuild/dot-net:core-2.0');
    public static readonly UBUNTU_14_04_DOTNET_CORE_2_1 = new LinuxBuildImage('aws/codebuild/dot-net:core-2.1');

    public readonly type = 'LINUX_CONTAINER';
    public readonly defaultComputeType = ComputeType.Small;

    public constructor(public readonly imageId: string) {
    }

    public validate(_: BuildEnvironment): string[] {
        return [];
    }
}

/**
 * A CodeBuild image running Windows.
 * This class has a bunch of public constants that represent the most popular images.
 * If you need to use with an image that isn't in the named constants,
 * you can always instantiate it directly.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class WindowsBuildImage implements IBuildImage {
    public static readonly WIN_SERVER_CORE_2016_BASE = new WindowsBuildImage('aws/codebuild/windows-base:1.0');

    public readonly type = 'WINDOWS_CONTAINER';
    public readonly defaultComputeType = ComputeType.Medium;

    public constructor(public readonly imageId: string) {
    }

    public validate(buildEnvironment: BuildEnvironment): string[] {
        const ret: string[] = [];
        if (buildEnvironment.computeType === ComputeType.Small) {
            ret.push("Windows images do not support the Small ComputeType");
        }
        return ret;
    }
}

export interface BuildEnvironmentVariable {
    /**
     * The type of environment variable.
     * @default PlainText
     */
    type?: BuildEnvironmentVariableType;

    /**
     * The value of the environment variable (or the name of the parameter in
     * the SSM parameter store.)
     */
    value: any;
}

export enum BuildEnvironmentVariableType {
    /**
     * An environment variable in plaintext format.
     */
    PlainText = 'PLAINTEXT',

    /**
     * An environment variable stored in Systems Manager Parameter Store.
     */
    ParameterStore = 'PARAMETER_STORE'
}