import assets = require('@aws-cdk/assets');
import { DockerImageAsset, DockerImageAssetProps } from '@aws-cdk/assets-docker';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ecr = require('@aws-cdk/aws-ecr');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { BuildArtifacts, CodePipelineBuildArtifacts, NoBuildArtifacts } from './artifacts';
import { CfnProject } from './codebuild.generated';
import {
  CommonPipelineBuildActionProps, CommonPipelineTestActionProps,
  PipelineBuildAction, PipelineTestAction
} from './pipeline-actions';
import { BuildSource, NoSource, SourceType } from './source';

const CODEPIPELINE_TYPE = 'CODEPIPELINE';
const S3_BUCKET_ENV = 'SCRIPT_S3_BUCKET';
const S3_KEY_ENV = 'SCRIPT_S3_KEY';

export interface IProject extends cdk.IConstruct, events.IEventRuleTarget {
  /** The ARN of this Project. */
  readonly projectArn: string;

  /** The human-visible name of this Project. */
  readonly projectName: string;

  /** The IAM service Role of this Project. Undefined for imported Projects. */
  readonly role?: iam.Role;

  /**
   * Convenience method for creating a new {@link PipelineBuildAction CodeBuild build Action}.
   *
   * @param props the construction properties of the new Action
   * @returns the newly created {@link PipelineBuildAction CodeBuild build Action}
   */
  toCodePipelineBuildAction(props: CommonPipelineBuildActionProps): PipelineBuildAction;

  /**
   * Convenience method for creating a new {@link PipelineTestAction CodeBuild test Action}.
   *
   * @param props the construction properties of the new Action
   * @returns the newly created {@link PipelineTestAction CodeBuild test Action}
   */
  toCodePipelineTestAction(props: CommonPipelineTestActionProps): PipelineTestAction;

  /**
   * Defines a CloudWatch event rule triggered when the build project state
   * changes. You can filter specific build status events using an event
   * pattern filter on the `build-status` detail field:
   *
   *    const rule = project.onStateChange('OnBuildStarted', target);
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
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines a CloudWatch event rule that triggers upon phase change of this
   * build project.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  onPhaseChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines an event rule which triggers when a build starts.
   */
  onBuildStarted(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines an event rule which triggers when a build fails.
   */
  onBuildFailed(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * Defines an event rule which triggers when a build completes successfully.
   */
  onBuildSucceeded(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule;

  /**
   * @returns a CloudWatch metric associated with this build project.
   * @param metricName The name of the metric
   * @param props Customization properties
   */
  metric(metricName: string, props: cloudwatch.MetricCustomization): cloudwatch.Metric;

  /**
   * Measures the number of builds triggered.
   *
   * Units: Count
   *
   * Valid CloudWatch statistics: Sum
   *
   * @default sum over 5 minutes
   */
  metricBuilds(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;

  /**
   * Measures the duration of all builds over time.
   *
   * Units: Seconds
   *
   * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
   *
   * @default average over 5 minutes
   */
  metricDuration(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;

  /**
   * Measures the number of successful builds.
   *
   * Units: Count
   *
   * Valid CloudWatch statistics: Sum
   *
   * @default sum over 5 minutes
   */
  metricSucceededBuilds(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;

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
  metricFailedBuilds(props?: cloudwatch.MetricCustomization): cloudwatch.Metric;

  /**
   * Export this Project. Allows referencing this Project in a different CDK Stack.
   */
  export(): ProjectImportProps;
}

/**
 * Properties of a reference to a CodeBuild Project.
 *
 * @see Project.import
 * @see Project.export
 */
export interface ProjectImportProps {
  /**
   * The human-readable name of the CodeBuild Project we're referencing.
   * The Project must be in the same account and region as the root Stack.
   */
  projectName: string;
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
export abstract class ProjectBase extends cdk.Construct implements IProject {
  /** The ARN of this Project. */
  public abstract readonly projectArn: string;

  /** The human-visible name of this Project. */
  public abstract readonly projectName: string;

  /** The IAM service Role of this Project. Undefined for imported Projects. */
  public abstract readonly role?: iam.Role;

  /** A role used by CloudWatch events to trigger a build */
  private eventsRole?: iam.Role;

  public abstract export(): ProjectImportProps;

  public toCodePipelineBuildAction(props: CommonPipelineBuildActionProps): PipelineBuildAction {
    return new PipelineBuildAction({
      ...props,
      project: this,
    });
  }

  public toCodePipelineTestAction(props: CommonPipelineTestActionProps): PipelineTestAction {
    return new PipelineTestAction({
      ...props,
      project: this,
    });
  }

  /**
   * Defines a CloudWatch event rule triggered when the build project state
   * changes. You can filter specific build status events using an event
   * pattern filter on the `build-status` detail field:
   *
   *    const rule = project.onStateChange('OnBuildStarted', target);
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
  public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
    if (!this.eventsRole) {
      this.eventsRole = new iam.Role(this, 'EventsRole', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com')
      });

      this.eventsRole.addToPolicy(new iam.PolicyStatement()
        .addAction('codebuild:StartBuild')
        .addResource(this.projectArn));
    }

    return {
      id: this.node.id,
      arn: this.projectArn,
      roleArn: this.eventsRole.roleArn,
    };
  }
}

class ImportedProject extends ProjectBase {
  public readonly projectArn: string;
  public readonly projectName: string;
  public readonly role?: iam.Role = undefined;

  constructor(scope: cdk.Construct, id: string, private readonly props: ProjectImportProps) {
    super(scope, id);

    this.projectArn = this.node.stack.formatArn({
      service: 'codebuild',
      resource: 'project',
      resourceName: props.projectName,
    });

    this.projectName = props.projectName;
  }

  public export() {
    return this.props;
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
   * Run a script from an asset as build script
   *
   * If supplied together with buildSpec, the asset script will be run
   * _after_ the existing commands in buildspec.
   *
   * This feature can also be used without a source, to simply run an
   * arbitrary script in a serverless way.
   *
   * @default No asset build script
   */
  buildScriptAsset?: assets.Asset;

  /**
   * The script in the asset to run.
   *
   * @default build.sh
   */
  buildScriptAssetEntrypoint?: string;

  /**
   * Service Role to assume while running the build.
   * If not specified, a role will be created.
   */
  role?: iam.Role;

  /**
   * Encryption key to use to read and write artifacts
   * If not specified, a role will be created.
   */
  encryptionKey?: kms.IEncryptionKey;

  /**
   * Bucket to store cached source artifacts
   * If not specified, source artifacts will not be cached.
   */
  cacheBucket?: s3.IBucket;

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
   * *Note*: if {@link NoSource} is given as the source,
   * then you need to provide an explicit `buildSpec`.
   *
   * @default NoSource
   */
  source?: BuildSource;

  /**
   * Defines where build artifacts will be stored.
   * Could be: PipelineBuildArtifacts, NoBuildArtifacts and S3BucketBuildArtifacts.
   *
   * @default NoBuildArtifacts
   */
  artifacts?: BuildArtifacts;

  /**
   * The secondary sources for the Project.
   * Can be also added after the Project has been created by using the {@link Project#addSecondarySource} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  secondarySources?: BuildSource[];

  /**
   * The secondary artifacts for the Project.
   * Can also be added after the Project has been created by using the {@link Project#addSecondaryArtifact} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  secondaryArtifacts?: BuildArtifacts[];
}

/**
 * A representation of a CodeBuild Project.
 */
export class Project extends ProjectBase {
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
  public static import(scope: cdk.Construct, id: string, props: ProjectImportProps): IProject {
    return new ImportedProject(scope, id, props);
  }

  /**
   * The IAM role for this project.
   */
  public readonly role?: iam.Role;

  /**
   * The ARN of the project.
   */
  public readonly projectArn: string;

  /**
   * The name of the project.
   */
  public readonly projectName: string;

  private readonly source: BuildSource;
  private readonly buildImage: IBuildImage;
  private readonly _secondarySources: BuildSource[];
  private readonly _secondaryArtifacts: BuildArtifacts[];

  constructor(scope: cdk.Construct, id: string, props: ProjectProps) {
    super(scope, id);

    if (props.buildScriptAssetEntrypoint && !props.buildScriptAsset) {
      throw new Error('To use buildScriptAssetEntrypoint, supply buildScriptAsset as well.');
    }

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
    });

    let cache: CfnProject.ProjectCacheProperty | undefined;
    if (props.cacheBucket) {
      const cacheDir = props.cacheDir != null ? props.cacheDir : new cdk.AwsNoValue().toString();
      cache = {
        type: 'S3',
        location: cdk.Fn.join('/', [props.cacheBucket.bucketName, cacheDir]),
      };

      props.cacheBucket.grantReadWrite(this.role);
    }

    this.buildImage = (props.environment && props.environment.buildImage) || LinuxBuildImage.UBUNTU_14_04_BASE;

    // let source "bind" to the project. this usually involves granting permissions
    // for the code build role to interact with the source.
    this.source = props.source || new NoSource();
    this.source._bind(this);

    const artifacts = this.parseArtifacts(props);
    artifacts._bind(this);

    // Inject download commands for asset if requested
    const environmentVariables = props.environmentVariables || {};
    const buildSpec = props.buildSpec || {};

    if (props.buildScriptAsset) {
      environmentVariables[S3_BUCKET_ENV] = { value: props.buildScriptAsset.s3BucketName };
      environmentVariables[S3_KEY_ENV] = { value: props.buildScriptAsset.s3ObjectKey };
      extendBuildSpec(buildSpec, this.buildImage.runScriptBuildspec(props.buildScriptAssetEntrypoint || 'build.sh'));
      props.buildScriptAsset.grantRead(this.role);
    }

    // Render the source and add in the buildspec
    const sourceJson = this.source.toSourceJSON();
    if (typeof buildSpec === 'string') {
      sourceJson.buildSpec = buildSpec; // Filename to buildspec file
    } else if (Object.keys(buildSpec).length > 0) {
      // We have to pretty-print the buildspec, otherwise
      // CodeBuild will not recognize it as an inline buildspec.
      sourceJson.buildSpec = JSON.stringify(buildSpec, undefined, 2); // Literal buildspec
    } else if (this.source.type === SourceType.None) {
      throw new Error("If the Project's source is NoSource, you need to provide a buildSpec");
    }

    this._secondarySources = [];
    for (const secondarySource of props.secondarySources || []) {
      this.addSecondarySource(secondarySource);
    }

    this._secondaryArtifacts = [];
    for (const secondaryArtifact of props.secondaryArtifacts || []) {
      this.addSecondaryArtifact(secondaryArtifact);
    }

    this.validateCodePipelineSettings(artifacts);

    const resource = new CfnProject(this, 'Resource', {
      description: props.description,
      source: sourceJson,
      artifacts: artifacts.toArtifactsJSON(),
      serviceRole: this.role.roleArn,
      environment: this.renderEnvironment(props.environment, environmentVariables),
      encryptionKey: props.encryptionKey && props.encryptionKey.keyArn,
      badgeEnabled: props.badge,
      cache,
      name: props.projectName,
      timeoutInMinutes: props.timeout,
      secondarySources: new cdk.Token(() => this.renderSecondarySources()),
      secondaryArtifacts: new cdk.Token(() => this.renderSecondaryArtifacts()),
      triggers: this.source.buildTriggers(),
    });

    this.projectArn = resource.projectArn;
    this.projectName = resource.ref;

    this.addToRolePolicy(this.createLoggingPermission());
  }

  /**
   * Export this Project. Allows referencing this Project in a different CDK Stack.
   */
  public export(): ProjectImportProps {
    return {
      projectName: new cdk.Output(this, 'ProjectName', { value: this.projectName }).makeImportValue().toString(),
    };
  }

  /**
   * Add a permission only if there's a policy attached.
   * @param statement The permissions statement to add
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    if (this.role) {
      this.role.addToPolicy(statement);
    }
  }

  /**
   * Adds a secondary source to the Project.
   *
   * @param secondarySource the source to add as a secondary source
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  public addSecondarySource(secondarySource: BuildSource): void {
    if (!secondarySource.identifier) {
      throw new Error('The identifier attribute is mandatory for secondary sources');
    }
    secondarySource._bind(this);
    this._secondarySources.push(secondarySource);
  }

  /**
   * Adds a secondary artifact to the Project.
   *
   * @param secondaryArtifact the artifact to add as a secondary artifact
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  public addSecondaryArtifact(secondaryArtifact: BuildArtifacts): any {
    if (!secondaryArtifact.identifier) {
      throw new Error("The identifier attribute is mandatory for secondary artifacts");
    }
    secondaryArtifact._bind(this);
    this._secondaryArtifacts.push(secondaryArtifact);
  }

  /**
   * @override
   */
  protected validate(): string[] {
    const ret = new Array<string>();
    if (this.source.type === SourceType.CodePipeline) {
      if (this._secondarySources.length > 0) {
        ret.push('A Project with a CodePipeline Source cannot have secondary sources. ' +
          "Use the CodeBuild Pipeline Actions' `additionalInputArtifacts` property instead");
      }
      if (this._secondaryArtifacts.length > 0) {
        ret.push('A Project with a CodePipeline Source cannot have secondary artifacts. ' +
          "Use the CodeBuild Pipeline Actions' `additionalOutputArtifactNames` property instead");
      }
    }
    return ret;
  }

  private createLoggingPermission() {
    const logGroupArn = this.node.stack.formatArn({
      service: 'logs',
      resource: 'log-group',
      sep: ':',
      resourceName: `/aws/codebuild/${this.projectName}`,
    });

    const logGroupStarArn = `${logGroupArn}:*`;

    const p = new iam.PolicyStatement();
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
      CfnProject.EnvironmentProperty {
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

    const errors = this.buildImage.validate(env);
    if (errors.length > 0) {
      throw new Error("Invalid CodeBuild environment: " + errors.join('\n'));
    }

    return {
      type: this.buildImage.type,
      image: this.buildImage.imageId,
      privilegedMode: env.privileged || false,
      computeType: env.computeType || this.buildImage.defaultComputeType,
      environmentVariables: !hasEnvironmentVars ? undefined : Object.keys(vars).map(name => ({
        name,
        type: vars[name].type || BuildEnvironmentVariableType.PlainText,
        value: vars[name].value
      }))
    };
  }

  private renderSecondarySources(): CfnProject.SourceProperty[] | undefined {
    return this._secondarySources.length === 0
      ? undefined
      : this._secondarySources.map((secondarySource) => secondarySource.toSourceJSON());
  }

  private renderSecondaryArtifacts(): CfnProject.ArtifactsProperty[] | undefined {
    return this._secondaryArtifacts.length === 0
      ? undefined
      : this._secondaryArtifacts.map((secondaryArtifact) => secondaryArtifact.toArtifactsJSON());
  }

  private parseArtifacts(props: ProjectProps) {
    if (props.artifacts) {
      return props.artifacts;
    }
    if (this.source.toSourceJSON().type === CODEPIPELINE_TYPE) {
      return new CodePipelineBuildArtifacts();
    } else {
      return new NoBuildArtifacts();
    }
  }

  private validateCodePipelineSettings(artifacts: BuildArtifacts) {
    const sourceType = this.source.toSourceJSON().type;
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
  privileged?: boolean;

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

  /**
   * Make a buildspec to run the indicated script
   */
  runScriptBuildspec(entrypoint: string): any;
}

/**
 * A CodeBuild image running Linux.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - LinuxBuildImage.fromDockerHub(image)
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 * - LinuxBuildImage.fromAsset(parent, id, props)
 *
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

  /**
   * @returns a Linux build image from a Docker Hub image.
   */
  public static fromDockerHub(name: string): LinuxBuildImage {
    return new LinuxBuildImage(name);
  }

  /**
   * @returns A Linux build image from an ECR repository.
   *
   * NOTE: if the repository is external (i.e. imported), then we won't be able to add
   * a resource policy statement for it so CodeBuild can pull the image.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
   *
   * @param repository The ECR repository
   * @param tag Image tag (default "latest")
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): LinuxBuildImage {
    const image = new LinuxBuildImage(repository.repositoryUriForTag(tag));
    repository.addToResourcePolicy(ecrAccessForCodeBuildService());
    return image;
  }

  /**
   * Uses an Docker image asset as a Linux build image.
   */
  public static fromAsset(scope: cdk.Construct, id: string, props: DockerImageAssetProps): LinuxBuildImage {
    const asset = new DockerImageAsset(scope, id, props);
    const image = new LinuxBuildImage(asset.imageUri);

    // allow this codebuild to pull this image (CodeBuild doesn't use a role, so
    // we can't use `asset.grantUseImage()`.
    asset.repository.addToResourcePolicy(ecrAccessForCodeBuildService());

    return image;
  }

  public readonly type = 'LINUX_CONTAINER';
  public readonly defaultComputeType = ComputeType.Small;

  private constructor(public readonly imageId: string) {
  }

  public validate(_: BuildEnvironment): string[] {
    return [];
  }

  public runScriptBuildspec(entrypoint: string): any {
    return {
      version: '0.2',
      phases: {
        pre_build: {
          commands: [
            // Better echo the location here; if this fails, the error message only contains
            // the unexpanded variables by default. It might fail if you're running an old
            // definition of the CodeBuild project--the permissions will have been changed
            // to only allow downloading the very latest version.
            `echo "Downloading scripts from s3://\${${S3_BUCKET_ENV}}/\${${S3_KEY_ENV}}"`,
            `aws s3 cp s3://\${${S3_BUCKET_ENV}}/\${${S3_KEY_ENV}} /tmp`,
            `mkdir -p /tmp/scriptdir`,
            `unzip /tmp/$(basename \$${S3_KEY_ENV}) -d /tmp/scriptdir`,
          ]
        },
        build: {
          commands: [
            'export SCRIPT_DIR=/tmp/scriptdir',
            `echo "Running ${entrypoint}"`,
            `chmod +x /tmp/scriptdir/${entrypoint}`,
            `/tmp/scriptdir/${entrypoint}`,
          ]
        }
      }
    };
  }
}

/**
 * A CodeBuild image running Windows.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - WindowsBuildImage.fromDockerHub(image)
 * - WindowsBuildImage.fromEcrRepository(repo[, tag])
 * - WindowsBuildImage.fromAsset(parent, id, props)
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class WindowsBuildImage implements IBuildImage {
  public static readonly WIN_SERVER_CORE_2016_BASE = new WindowsBuildImage('aws/codebuild/windows-base:1.0');

  /**
   * @returns a Windows build image from a Docker Hub image.
   */
  public static fromDockerHub(name: string): WindowsBuildImage {
    return new WindowsBuildImage(name);
  }

  /**
   * @returns A Linux build image from an ECR repository.
   *
   * NOTE: if the repository is external (i.e. imported), then we won't be able to add
   * a resource policy statement for it so CodeBuild can pull the image.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
   *
   * @param repository The ECR repository
   * @param tag Image tag (default "latest")
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): WindowsBuildImage {
    const image = new WindowsBuildImage(repository.repositoryUriForTag(tag));
    repository.addToResourcePolicy(ecrAccessForCodeBuildService());
    return image;
  }

  /**
   * Uses an Docker image asset as a Windows build image.
   */
  public static fromAsset(scope: cdk.Construct, id: string, props: DockerImageAssetProps): WindowsBuildImage {
    const asset = new DockerImageAsset(scope, id, props);
    const image = new WindowsBuildImage(asset.imageUri);

    // allow this codebuild to pull this image (CodeBuild doesn't use a role, so
    // we can't use `asset.grantUseImage()`.
    asset.repository.addToResourcePolicy(ecrAccessForCodeBuildService());

    return image;
  }
  public readonly type = 'WINDOWS_CONTAINER';
  public readonly defaultComputeType = ComputeType.Medium;

  private constructor(public readonly imageId: string) {
  }

  public validate(buildEnvironment: BuildEnvironment): string[] {
    const ret: string[] = [];
    if (buildEnvironment.computeType === ComputeType.Small) {
      ret.push("Windows images do not support the Small ComputeType");
    }
    return ret;
  }

  public runScriptBuildspec(entrypoint: string): any {
    return {
      version: '0.2',
      phases: {
        pre_build: {
          // Would love to do downloading here and executing in the next step,
          // but I don't know how to propagate the value of $TEMPDIR.
          //
          // Punting for someone who knows PowerShell well enough.
          commands: []
        },
        build: {
          commands: [
            `Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName`,
            `aws s3 cp s3://$env:${S3_BUCKET_ENV}/$env:${S3_KEY_ENV} $TEMPDIR\\scripts.zip`,
            'New-Item -ItemType Directory -Path $TEMPDIR\\scriptdir',
            'Expand-Archive -Path $TEMPDIR/scripts.zip -DestinationPath $TEMPDIR\\scriptdir',
            '$env:SCRIPT_DIR = "$TEMPDIR\\scriptdir"',
            `& $TEMPDIR\\scriptdir\\${entrypoint}`
          ]
        }
      }
    };
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

/**
 * Extend buildSpec phases with the contents of another one
 */
function extendBuildSpec(buildSpec: any, extend: any) {
  if (typeof buildSpec === 'string') {
    throw new Error('Cannot extend buildspec that is given as a string. Pass the buildspec as a structure instead.');
  }
  if (buildSpec.version === '0.1') {
    throw new Error('Cannot extend buildspec at version "0.1". Set the version to "0.2" or higher instead.');
  }
  if (buildSpec.version === undefined) {
    buildSpec.version = extend.version;
  }

  if (!buildSpec.phases) {
    buildSpec.phases = {};
  }

  for (const phaseName of Object.keys(extend.phases)) {
    if (!(phaseName in buildSpec.phases)) { buildSpec.phases[phaseName] = {}; }
    const phase = buildSpec.phases[phaseName];

    if (!(phase.commands)) { phase.commands = []; }
    phase.commands.push(...extend.phases[phaseName].commands);
  }
}

function ecrAccessForCodeBuildService(): iam.PolicyStatement {
  return new iam.PolicyStatement()
    .describe('CodeBuild')
    .addServicePrincipal('codebuild.amazonaws.com')
    .addActions(
      'ecr:GetDownloadUrlForLayer',
      'ecr:BatchGetImage',
      'ecr:BatchCheckLayerAvailability'
    );
}
