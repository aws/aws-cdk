import assets = require('@aws-cdk/assets');
import { DockerImageAsset, DockerImageAssetProps } from '@aws-cdk/assets-docker';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import ecr = require('@aws-cdk/aws-ecr');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { Aws, Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { BuildArtifacts, CodePipelineBuildArtifacts, NoBuildArtifacts } from './artifacts';
import { Cache } from './cache';
import { CfnProject } from './codebuild.generated';
import { BuildSource, NoSource, SourceType } from './source';

const CODEPIPELINE_TYPE = 'CODEPIPELINE';
const S3_BUCKET_ENV = 'SCRIPT_S3_BUCKET';
const S3_KEY_ENV = 'SCRIPT_S3_KEY';

export interface IProject extends IResource, iam.IGrantable {
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
   * Defines a CloudWatch event rule triggered when something happens with this project.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  onEvent(id: string, options: events.OnEventOptions): events.Rule;

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
   * To access fields from the event in the event target input,
   * use the static fields on the `StateChangeEvent` class.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  onStateChange(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule that triggers upon phase change of this
   * build project.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  onPhaseChange(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * Defines an event rule which triggers when a build starts.
   */
  onBuildStarted(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * Defines an event rule which triggers when a build fails.
   */
  onBuildFailed(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * Defines an event rule which triggers when a build completes successfully.
   */
  onBuildSucceeded(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * @returns a CloudWatch metric associated with this build project.
   * @param metricName The name of the metric
   * @param props Customization properties
   */
  metric(metricName: string, props: cloudwatch.MetricOptions): cloudwatch.Metric;

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
abstract class ProjectBase extends Resource implements IProject {
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /** The ARN of this Project. */
  public abstract readonly projectArn: string;

  /** The human-visible name of this Project. */
  public abstract readonly projectName: string;

  /** The IAM service Role of this Project. */
  public abstract readonly role?: iam.IRole;

  /**
   * Defines a CloudWatch event rule triggered when something happens with this project.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  public onEvent(id: string, options: events.OnEventOptions): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.codebuild'],
      detail: {
        'project-name': [this.projectName]
      }
    });
    return rule;
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
   * To access fields from the event in the event target input,
   * use the static fields on the `StateChangeEvent` class.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  public onStateChange(id: string, options: events.OnEventOptions) {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: ['CodeBuild Build State Change'],
    });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule that triggers upon phase change of this
   * build project.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
   */
  public onPhaseChange(id: string, options: events.OnEventOptions) {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: ['CodeBuild Build Phase Change'],
    });
    return rule;
  }

  /**
   * Defines an event rule which triggers when a build starts.
   *
   * To access fields from the event in the event target input,
   * use the static fields on the `StateChangeEvent` class.
   */
  public onBuildStarted(id: string, options: events.OnEventOptions) {
    const rule = this.onStateChange(id, options);
    rule.addEventPattern({
      detail: {
        'build-status': ['IN_PROGRESS']
      }
    });
    return rule;
  }

  /**
   * Defines an event rule which triggers when a build fails.
   *
   * To access fields from the event in the event target input,
   * use the static fields on the `StateChangeEvent` class.
   */
  public onBuildFailed(id: string, options: events.OnEventOptions) {
    const rule = this.onStateChange(id, options);
    rule.addEventPattern({
      detail: {
        'build-status': ['FAILED']
      }
    });
    return rule;
  }

  /**
   * Defines an event rule which triggers when a build completes successfully.
   *
   * To access fields from the event in the event target input,
   * use the static fields on the `StateChangeEvent` class.
   */
  public onBuildSucceeded(id: string, options: events.OnEventOptions) {
    const rule = this.onStateChange(id, options);
    rule.addEventPattern({
      detail: {
        'build-status': ['SUCCEEDED']
      }
    });
    return rule;
  }

  /**
   * @returns a CloudWatch metric associated with this build project.
   * @param metricName The name of the metric
   * @param props Customization properties
   */
  public metric(metricName: string, props: cloudwatch.MetricOptions) {
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
  public metricBuilds(props?: cloudwatch.MetricOptions) {
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
  public metricDuration(props?: cloudwatch.MetricOptions) {
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
  public metricSucceededBuilds(props?: cloudwatch.MetricOptions) {
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
  public metricFailedBuilds(props?: cloudwatch.MetricOptions) {
    return this.metric('FailedBuilds', {
      statistic: 'sum',
      ...props,
    });
  }
}

export interface CommonProjectProps {
  /**
   * A description of the project. Use the description to identify the purpose
   * of the project.
   */
  readonly description?: string;

  /**
   * Filename or contents of buildspec in JSON format.
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-example
   */
  readonly buildSpec?: any;

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
  readonly buildScriptAsset?: assets.Asset;

  /**
   * The script in the asset to run.
   *
   * @default build.sh
   */
  readonly buildScriptAssetEntrypoint?: string;

  /**
   * Service Role to assume while running the build.
   * If not specified, a role will be created.
   */
  readonly role?: iam.IRole;

  /**
   * Encryption key to use to read and write artifacts.
   * If not specified, a role will be created.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Caching strategy to use.
   * @default Cache.none
   */
  readonly cache?: Cache;

  /**
   * Build environment to use for the build.
   */
  readonly environment?: BuildEnvironment;

  /**
   * Indicates whether AWS CodeBuild generates a publicly accessible URL for
   * your project's build badge. For more information, see Build Badges Sample
   * in the AWS CodeBuild User Guide.
   */
  readonly badge?: boolean;

  /**
   * The number of minutes after which AWS CodeBuild stops the build if it's
   * not complete. For valid values, see the timeoutInMinutes field in the AWS
   * CodeBuild User Guide.
   */
  readonly timeout?: number;

  /**
   * Additional environment variables to add to the build environment.
   */
  readonly environmentVariables?: { [name: string]: BuildEnvironmentVariable };

  /**
   * The physical, human-readable name of the CodeBuild Project.
   */
  readonly projectName?: string;

  /**
   * VPC network to place codebuild network interfaces
   *
   * Specify this if the codebuild project needs to access resources in a VPC.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default All private subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * What security group to associate with the codebuild project's network interfaces.
   * If no security group is identified, one will be created automatically.
   *
   * Only used if 'vpc' is supplied.
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
}
export interface ProjectProps extends CommonProjectProps {
  /**
   * The source of the build.
   * *Note*: if {@link NoSource} is given as the source,
   * then you need to provide an explicit `buildSpec`.
   *
   * @default NoSource
   */
  readonly source?: BuildSource;

  /**
   * Defines where build artifacts will be stored.
   * Could be: PipelineBuildArtifacts, NoBuildArtifacts and S3BucketBuildArtifacts.
   *
   * @default NoBuildArtifacts
   */
  readonly artifacts?: BuildArtifacts;

  /**
   * The secondary sources for the Project.
   * Can be also added after the Project has been created by using the {@link Project#addSecondarySource} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  readonly secondarySources?: BuildSource[];

  /**
   * The secondary artifacts for the Project.
   * Can also be added after the Project has been created by using the {@link Project#addSecondaryArtifact} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   */
  readonly secondaryArtifacts?: BuildArtifacts[];
}

/**
 * A representation of a CodeBuild Project.
 */
export class Project extends ProjectBase {

  public static fromProjectArn(scope: Construct, id: string, projectArn: string): IProject {
    class Import extends ProjectBase {
      public readonly grantPrincipal: iam.IPrincipal;
      public readonly projectArn = projectArn;
      public readonly projectName = scope.node.stack.parseArn(projectArn).resourceName!;
      public readonly role?: iam.Role = undefined;

      constructor(s: Construct, i: string) {
        super(s, i);
        this.grantPrincipal = new iam.ImportedResourcePrincipal({ resource: this });
      }
    }

    return new Import(scope, id);
  }

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
   * @param scope the parent Construct for this Construct
   * @param id the logical name of this Construct
   * @param projectName the name of the project to import
   * @returns a reference to the existing Project
   */
  public static fromProjectName(scope: Construct, id: string, projectName: string): IProject {
    class Import extends ProjectBase {
      public readonly grantPrincipal: iam.IPrincipal;
      public readonly projectArn: string;
      public readonly projectName: string;
      public readonly role?: iam.Role = undefined;

      constructor(s: Construct, i: string) {
        super(s, i);

        this.projectArn = this.node.stack.formatArn({
          service: 'codebuild',
          resource: 'project',
          resourceName: projectName,
        });

        this.grantPrincipal = new iam.ImportedResourcePrincipal({ resource: this });
        this.projectName = projectName;
      }
    }

    return new Import(scope, id);
  }

  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The IAM role for this project.
   */
  public readonly role?: iam.IRole;

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
  private _securityGroups: ec2.ISecurityGroup[] = [];

  constructor(scope: Construct, id: string, props: ProjectProps) {
    super(scope, id);

    if (props.buildScriptAssetEntrypoint && !props.buildScriptAsset) {
      throw new Error('To use buildScriptAssetEntrypoint, supply buildScriptAsset as well.');
    }

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
    });
    this.grantPrincipal = this.role;

    this.buildImage = (props.environment && props.environment.buildImage) || LinuxBuildImage.STANDARD_1_0;

    // let source "bind" to the project. this usually involves granting permissions
    // for the code build role to interact with the source.
    this.source = props.source || new NoSource();
    this.source._bind(this);

    const artifacts = this.parseArtifacts(props);
    artifacts._bind(this);

    const cache = props.cache || Cache.none();

    // give the caching strategy the option to grant permissions to any required resources
    cache._bind(this);

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
    const renderSource = () => {
      if (props.badge && !this.source.badgeSupported) {
        throw new Error(`Badge is not supported for source type ${this.source.type}`);
      }

      const sourceJson = this.source._toSourceJSON();
      if (typeof buildSpec === 'string') {
        return {
          ...sourceJson,
          buildSpec // Filename to buildspec file
        };
      } else if (Object.keys(buildSpec).length > 0) {
        // We have to pretty-print the buildspec, otherwise
        // CodeBuild will not recognize it as an inline buildspec.
        return {
          ...sourceJson,
          buildSpec: JSON.stringify(buildSpec, undefined, 2)
        };
      } else if (this.source.type === SourceType.None) {
        throw new Error("If the Project's source is NoSource, you need to provide a buildSpec");
      } else {
        return sourceJson;
      }
    };

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
      source: renderSource(),
      artifacts: artifacts.toArtifactsJSON(),
      serviceRole: this.role.roleArn,
      environment: this.renderEnvironment(props.environment, environmentVariables),
      encryptionKey: props.encryptionKey && props.encryptionKey.keyArn,
      badgeEnabled: props.badge,
      cache: cache._toCloudFormation(),
      name: props.projectName,
      timeoutInMinutes: props.timeout,
      secondarySources: new Token(() => this.renderSecondarySources()),
      secondaryArtifacts: new Token(() => this.renderSecondaryArtifacts()),
      triggers: this.source._buildTriggers(),
      vpcConfig: this.configureVpc(props),
    });

    this.projectArn = resource.projectArn;
    this.projectName = resource.projectName;

    this.addToRolePolicy(this.createLoggingPermission());
  }

  public get securityGroups(): ec2.ISecurityGroup[] {
    return this._securityGroups.slice();
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
   * Add a permission only if there's a policy attached.
   * @param statement The permissions statement to add
   */
  public addToRoleInlinePolicy(statement: iam.PolicyStatement) {
    if (this.role) {
      const policy = new iam.Policy(this, 'PolicyDocument', {
        policyName: 'CodeBuildEC2Policy',
        statements: [statement]
      });
      this.role.attachInlinePolicy(policy);
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
          "Use the CodeBuild Pipeline Actions' `extraInputs` property instead");
      }
      if (this._secondaryArtifacts.length > 0) {
        ret.push('A Project with a CodePipeline Source cannot have secondary artifacts. ' +
          "Use the CodeBuild Pipeline Actions' `extraOutputs` property instead");
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
                            projectVars: { [name: string]: BuildEnvironmentVariable } = {}): CfnProject.EnvironmentProperty {
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
      : this._secondarySources.map((secondarySource) => secondarySource._toSourceJSON());
  }

  private renderSecondaryArtifacts(): CfnProject.ArtifactsProperty[] | undefined {
    return this._secondaryArtifacts.length === 0
      ? undefined
      : this._secondaryArtifacts.map((secondaryArtifact) => secondaryArtifact.toArtifactsJSON());
  }

  /**
   * If configured, set up the VPC-related properties
   *
   * Returns the VpcConfig that should be added to the
   * codebuild creation properties.
   */
  private configureVpc(props: ProjectProps): CfnProject.VpcConfigProperty | undefined {
    if ((props.securityGroups || props.allowAllOutbound !== undefined) && !props.vpc) {
      throw new Error(`Cannot configure 'securityGroup' or 'allowAllOutbound' without configuring a VPC`);
    }

    if (!props.vpc) { return undefined; }

    if ((props.securityGroups && props.securityGroups.length > 0) && props.allowAllOutbound !== undefined) {
      throw new Error(`Configure 'allowAllOutbound' directly on the supplied SecurityGroup.`);
    }

    if (props.securityGroups && props.securityGroups.length > 0) {
      this._securityGroups = props.securityGroups.slice();
    } else {
      const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        description: 'Automatic generated security group for CodeBuild ' + this.node.uniqueId,
        allowAllOutbound: props.allowAllOutbound
      });
      this._securityGroups = [securityGroup];
    }
    this.addToRoleInlinePolicy(new iam.PolicyStatement()
      .addAllResources()
      .addActions(
        'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface',
        'ec2:DescribeSubnets',
        'ec2:DescribeSecurityGroups',
        'ec2:DescribeDhcpOptions',
        'ec2:DescribeVpcs'
      ));
    this.addToRolePolicy(new iam.PolicyStatement()
      .addResource(`arn:aws:ec2:${Aws.region}:${Aws.accountId}:network-interface/*`)
      .addCondition('StringEquals', {
        "ec2:Subnet": props.vpc
          .selectSubnets(props.subnetSelection).subnetIds
          .map(si => `arn:aws:ec2:${Aws.region}:${Aws.accountId}:subnet/${si}`),
        "ec2:AuthorizedService": "codebuild.amazonaws.com"
      })
      .addAction('ec2:CreateNetworkInterfacePermission'));
    return {
      vpcId: props.vpc.vpcId,
      subnets: props.vpc.selectSubnets(props.subnetSelection).subnetIds,
      securityGroupIds: this._securityGroups.map(s => s.securityGroupId)
    };
  }

  private parseArtifacts(props: ProjectProps) {
    if (props.artifacts) {
      return props.artifacts;
    }
    if (this.source._toSourceJSON().type === CODEPIPELINE_TYPE) {
      return new CodePipelineBuildArtifacts();
    } else {
      return new NoBuildArtifacts();
    }
  }

  private validateCodePipelineSettings(artifacts: BuildArtifacts) {
    const sourceType = this.source._toSourceJSON().type;
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
  Small = 'BUILD_GENERAL1_SMALL',
  Medium = 'BUILD_GENERAL1_MEDIUM',
  Large = 'BUILD_GENERAL1_LARGE'
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
   * See the {@link ComputeType} enum for the possible values.
   *
   * @default taken from {@link #buildImage#defaultComputeType}
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
   * The environment variables that your builds can use.
   */
  readonly environmentVariables?: { [name: string]: BuildEnvironmentVariable };
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
  public static readonly STANDARD_1_0 = new LinuxBuildImage('aws/codebuild/standard:1.0');
  public static readonly STANDARD_2_0 = new LinuxBuildImage('aws/codebuild/standard:2.0');
  public static readonly UBUNTU_14_04_BASE = new LinuxBuildImage('aws/codebuild/ubuntu-base:14.04');
  public static readonly UBUNTU_14_04_ANDROID_JAVA8_24_4_1 = new LinuxBuildImage('aws/codebuild/android-java-8:24.4.1');
  public static readonly UBUNTU_14_04_ANDROID_JAVA8_26_1_1 = new LinuxBuildImage('aws/codebuild/android-java-8:26.1.1');
  public static readonly UBUNTU_14_04_DOCKER_17_09_0 = new LinuxBuildImage('aws/codebuild/docker:17.09.0');
  public static readonly UBUNTU_14_04_DOCKER_18_09_0 = new LinuxBuildImage('aws/codebuild/docker:18.09.0');
  public static readonly UBUNTU_14_04_GOLANG_1_10 = new LinuxBuildImage('aws/codebuild/golang:1.10');
  public static readonly UBUNTU_14_04_GOLANG_1_11 = new LinuxBuildImage('aws/codebuild/golang:1.11');
  public static readonly UBUNTU_14_04_OPEN_JDK_8 = new LinuxBuildImage('aws/codebuild/java:openjdk-8');
  public static readonly UBUNTU_14_04_OPEN_JDK_9 = new LinuxBuildImage('aws/codebuild/java:openjdk-9');
  public static readonly UBUNTU_14_04_OPEN_JDK_11 = new LinuxBuildImage('aws/codebuild/java:openjdk-11');
  public static readonly UBUNTU_14_04_NODEJS_10_14_1 = new LinuxBuildImage('aws/codebuild/nodejs:10.14.1');
  public static readonly UBUNTU_14_04_NODEJS_10_1_0 = new LinuxBuildImage('aws/codebuild/nodejs:10.1.0');
  public static readonly UBUNTU_14_04_NODEJS_8_11_0 = new LinuxBuildImage('aws/codebuild/nodejs:8.11.0');
  public static readonly UBUNTU_14_04_NODEJS_6_3_1 = new LinuxBuildImage('aws/codebuild/nodejs:6.3.1');
  public static readonly UBUNTU_14_04_PHP_5_6 = new LinuxBuildImage('aws/codebuild/php:5.6');
  public static readonly UBUNTU_14_04_PHP_7_0 = new LinuxBuildImage('aws/codebuild/php:7.0');
  public static readonly UBUNTU_14_04_PHP_7_1 = new LinuxBuildImage('aws/codebuild/php:7.1');
  public static readonly UBUNTU_14_04_PYTHON_3_7_1 = new LinuxBuildImage('aws/codebuild/python:3.7.1');
  public static readonly UBUNTU_14_04_PYTHON_3_6_5 = new LinuxBuildImage('aws/codebuild/python:3.6.5');
  public static readonly UBUNTU_14_04_PYTHON_3_5_2 = new LinuxBuildImage('aws/codebuild/python:3.5.2');
  public static readonly UBUNTU_14_04_PYTHON_3_4_5 = new LinuxBuildImage('aws/codebuild/python:3.4.5');
  public static readonly UBUNTU_14_04_PYTHON_3_3_6 = new LinuxBuildImage('aws/codebuild/python:3.3.6');
  public static readonly UBUNTU_14_04_PYTHON_2_7_12 = new LinuxBuildImage('aws/codebuild/python:2.7.12');
  public static readonly UBUNTU_14_04_RUBY_2_5_3 = new LinuxBuildImage('aws/codebuild/ruby:2.5.3');
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
  public static fromAsset(scope: Construct, id: string, props: DockerImageAssetProps): LinuxBuildImage {
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
  public static fromAsset(scope: Construct, id: string, props: DockerImageAssetProps): WindowsBuildImage {
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
  readonly type?: BuildEnvironmentVariableType;

  /**
   * The value of the environment variable (or the name of the parameter in
   * the SSM parameter store.)
   */
  readonly value: any;
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
