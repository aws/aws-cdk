import * as cdk from 'aws-cdk-lib';
import type * as ecr from 'aws-cdk-lib/aws-ecr';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnImagePipeline } from 'aws-cdk-lib/aws-imagebuilder';
import type * as logs from 'aws-cdk-lib/aws-logs';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IDistributionConfiguration } from './distribution-configuration';
import type { IInfrastructureConfiguration } from './infrastructure-configuration';
import { InfrastructureConfiguration } from './infrastructure-configuration';
import {
  buildImageScanningConfiguration,
  buildImageTestsConfiguration,
  buildWorkflows,
} from './private/image-and-pipeline-props-helper';
import { defaultExecutionRolePolicy, getExecutionRole } from './private/policy-helper';
import type { IRecipeBase } from './recipe-base';
import type { WorkflowConfiguration } from './workflow';

const IMAGE_PIPELINE_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.ImagePipeline');

/**
 * An EC2 Image Builder Image Pipeline.
 */
export interface IImagePipeline extends cdk.IResource {
  /**
   * The ARN of the image pipeline
   *
   * @attribute
   */
  readonly imagePipelineArn: string;

  /**
   * The name of the image pipeline
   *
   * @attribute
   */
  readonly imagePipelineName: string;

  /**
   * Grant custom actions to the given grantee for the image pipeline
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants the default permissions for building an image to the provided execution role.
   *
   * @param grantee The execution role used for the image build.
   */
  grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[];

  /**
   * Grant read permissions to the given grantee for the image pipeline
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant permissions to the given grantee to start an execution of the image pipeline
   *
   * @param grantee The principal
   */
  grantStartExecution(grantee: iam.IGrantable): iam.Grant;

  /**
   * Creates an EventBridge rule for Image Builder events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder CVE detected events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onCVEDetected(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder image state change events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onImageBuildStateChange(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder image build completion events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onImageBuildCompleted(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder image build failure events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onImageBuildFailed(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder image success events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onImageBuildSucceeded(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder image pipeline automatically disabled events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onImagePipelineAutoDisabled(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Creates an EventBridge rule for Image Builder wait for action events
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  onWaitForAction(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * Properties for creating an Image Pipeline resource
 */
export interface ImagePipelineProps {
  /**
   * The recipe that defines the base image, components, and customizations used to build the image. This can either be
   * an image recipe, or a container recipe.
   */
  readonly recipe: IRecipeBase;

  /**
   * The name of the image pipeline.
   *
   * @default - a name is generated
   */
  readonly imagePipelineName?: string;

  /**
   * The description of the image pipeline.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The schedule of the image pipeline. This configures how often and when a pipeline automatically creates a new
   * image.
   *
   * @default - none, a manual image pipeline will be created
   */
  readonly schedule?: ImagePipelineSchedule;

  /**
   * Indicates whether the pipeline is enabled to be triggered by the provided schedule
   *
   * @default ImagePipelineStatus.ENABLED
   */
  readonly status?: ImagePipelineStatus;

  /**
   * The infrastructure configuration used for building the image.
   *
   * A default infrastructure configuration will be used if one is not provided.
   *
   * The default configuration will create an instance profile and role with minimal permissions needed to build the
   * image, attached to the EC2 instance.
   *
   * @default - an infrastructure configuration will be created with the default settings
   */
  readonly infrastructureConfiguration?: IInfrastructureConfiguration;

  /**
   * The distribution configuration used for distributing the image.
   *
   * @default None
   */
  readonly distributionConfiguration?: IDistributionConfiguration;

  /**
   * The list of workflow configurations used to build the image.
   *
   * @default - Image Builder will use a default set of workflows for the build to build, test, and distribute the image
   */
  readonly workflows?: WorkflowConfiguration[];

  /**
   * The execution role used to perform workflow actions to build this image.
   *
   * By default, the Image Builder Service Linked Role (SLR) will be created automatically and used as the execution
   * role. However, when providing a custom set of image workflows for the pipeline, an execution role will be
   * generated with the minimal permissions needed to execute the workflows.
   *
   * @default - Image Builder will use the SLR if possible. Otherwise, an execution role will be generated
   */
  readonly executionRole?: iam.IRole;

  /**
   * The log group to use for the image pipeline. By default, a log group will be created with the format
   * `/aws/imagebuilder/pipeline/<pipeline-name>`
   *
   * @default - a log group will be created
   */
  readonly imagePipelineLogGroup?: logs.ILogGroup;

  /**
   * The log group to use for images created from the image pipeline. By default, a log group will be created with the
   * format `/aws/imagebuilder/<image-name>`.
   *
   * @default - a log group will be created
   */
  readonly imageLogGroup?: logs.ILogGroup;

  /**
   * Indicates whether Image Builder keeps a snapshot of the vulnerability scans that Amazon Inspector runs against the
   * build instance when you create a new image.
   *
   * @default false
   */
  readonly imageScanningEnabled?: boolean;

  /**
   * The container repository that Amazon Inspector scans to identify findings for your container images. If a
   * repository is not provided, Image Builder creates a repository named `image-builder-image-scanning-repository`
   * for vulnerability scanning.
   *
   * @default - if scanning is enabled, a repository will be created by Image Builder if one is not provided
   */
  readonly imageScanningEcrRepository?: ecr.IRepository;

  /**
   * The tags for Image Builder to apply to the output container image that Amazon Inspector scans.
   *
   * @default None
   */
  readonly imageScanningEcrTags?: string[];

  /**
   * If enabled, collects additional information about the image being created, including the operating system (OS)
   * version and package list for the AMI.
   *
   * @default true
   */
  readonly enhancedImageMetadataEnabled?: boolean;

  /**
   * Whether to run tests after building an image.
   *
   * @default true
   */
  readonly imageTestsEnabled?: boolean;

  /**
   * The tags to apply to the image pipeline
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * The schedule settings for the image pipeline, which defines when a pipeline should be triggered
 */
export interface ImagePipelineSchedule {
  /**
   * The schedule expression to use. This can either be a cron expression or a rate expression.
   */
  readonly expression: events.Schedule;

  /**
   * The number of consecutive failures allowed before the pipeline is automatically disabled. This value must be
   * between 1 and 10.
   *
   * @default - no auto-disable policy is configured and the pipeline is not automatically disabled on consecutive
   * failures
   */
  readonly autoDisableFailureCount?: number;

  /**
   * The start condition for the pipeline, indicating the condition under which a pipeline should be triggered.
   *
   * @default ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE
   */
  readonly startCondition?: ScheduleStartCondition;
}

/**
 * The start condition for the pipeline, indicating the condition under which a pipeline should be triggered.
 */
export enum ScheduleStartCondition {
  /**
   * Indicates to trigger a pipeline whenever its schedule is met
   */
  EXPRESSION_MATCH_ONLY = 'EXPRESSION_MATCH_ONLY',

  /**
   * Indicates to trigger a pipeline whenever its schedule is met, and there are matching dependency updates available,
   * such as new versions of components or images to use in the pipeline build.
   */
  EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE = 'EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE',
}

/**
 * Indicates whether the pipeline is enabled to be triggered by the provided schedule
 */
export enum ImagePipelineStatus {
  /**
   * Indicates that the pipeline is enabled for scheduling
   */
  ENABLED = 'ENABLED',

  /**
   * Indicates that the pipeline is disabled and will not be triggered on the schedule
   */
  DISABLED = 'DISABLED',
}

/**
 * A new or imported Image Pipeline
 */
abstract class ImagePipelineBase extends cdk.Resource implements IImagePipeline {
  /**
   * The ARN of the image pipeline
   */
  abstract readonly imagePipelineArn: string;

  /**
   * The name of the image pipeline
   */
  abstract readonly imagePipelineName: string;

  /**
   * Grant custom actions to the given grantee for the image pipeline
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: [this.imagePipelineArn],
      actions: actions,
      scope: this,
    });
  }

  /**
   * Grants the default permissions for building an image to the provided execution role.
   * [disable-awslint:no-grants]
   *
   * @param grantee The execution role used for the image build.
   */
  public grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[] {
    const policies = defaultExecutionRolePolicy(this);
    return policies.map((policy) =>
      iam.Grant.addToPrincipal({
        grantee: grantee,
        resourceArns: policy.resources,
        actions: policy.actions,
        conditions: policy.conditions,
        scope: this,
      }),
    );
  }

  /**
   * Grant read permissions to the given grantee for the image pipeline
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetImagePipeline');
  }

  /**
   * Grant permissions to the given grantee to start an execution of the image pipeline
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantStartExecution(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:StartImagePipelineExecution');
  }

  /**
   * Creates an EventBridge rule for Image Builder events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.imagebuilder'],
      ...(options.eventPattern?.resources?.length && { resources: options.eventPattern.resources }),
      ...(options.eventPattern?.detailType?.length && { detailType: options.eventPattern.detailType }),
      ...(options.eventPattern?.detail !== undefined && { detail: options.eventPattern.detail }),
    });
    return rule;
  }

  /**
   * Creates an EventBridge rule for Image Builder CVE detected events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onCVEDetected(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onEvent(id, {
      ...options,
      eventPattern: {
        ...options.eventPattern,
        detailType: ['EC2 Image Builder CVE Detected'],
        resources: [this.imagePipelineArn],
      },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder image state change events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onImageBuildStateChange(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onEvent(id, {
      ...options,
      eventPattern: { ...options.eventPattern, detailType: ['EC2 Image Builder Image State Change'] },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder image build completion events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onImageBuildCompleted(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onImageBuildStateChange(id, {
      ...options,
      eventPattern: {
        ...options.eventPattern,
        detail: { ...options.eventPattern?.detail, state: { status: ['AVAILABLE', 'CANCELLED', 'FAILED'] } },
      },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder image build failure events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onImageBuildFailed(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onImageBuildStateChange(id, {
      ...options,
      eventPattern: {
        ...options.eventPattern,
        detail: { ...options.eventPattern?.detail, state: { status: ['FAILED'] } },
      },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder image success events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onImageBuildSucceeded(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onImageBuildStateChange(id, {
      ...options,
      eventPattern: {
        ...options.eventPattern,
        detail: { ...options.eventPattern?.detail, state: { status: ['AVAILABLE'] } },
      },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder image pipeline automatically disabled events.
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onImagePipelineAutoDisabled(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onEvent(id, {
      ...options,
      eventPattern: {
        detailType: ['EC2 Image Builder Image Pipeline Automatically Disabled'],
        resources: [this.imagePipelineArn],
      },
    });
  }

  /**
   * Creates an EventBridge rule for Image Builder wait for action events
   *
   * @param id Unique identifier for the rule
   * @param options Configuration options for the event rule
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/integ-eventbridge.html
   */
  public onWaitForAction(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onEvent(id, {
      ...options,
      eventPattern: { ...options.eventPattern, detailType: ['EC2 Image Builder Workflow Step Waiting'] },
    });
  }
}

/**
 * Represents an EC2 Image Builder Image Pipeline.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-pipelines.html
 */
@propertyInjectable
export class ImagePipeline extends ImagePipelineBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.ImagePipeline';

  /**
   * Import an existing image pipeline given its ARN.
   */
  public static fromImagePipelineArn(scope: Construct, id: string, imagePipelineArn: string): IImagePipeline {
    const imagePipelineName = cdk.Stack.of(scope).splitArn(
      imagePipelineArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName!;

    class Import extends ImagePipelineBase {
      public readonly imagePipelineArn = imagePipelineArn;
      public readonly imagePipelineName = imagePipelineName;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing image pipeline given its name. The provided name must be normalized by converting all
   * alphabetical characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromImagePipelineName(scope: Construct, id: string, imagePipelineName: string): IImagePipeline {
    return this.fromImagePipelineArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'image-pipeline',
        resourceName: imagePipelineName,
      }),
    );
  }

  /**
   * Return whether the given object is an ImagePipeline.
   */
  public static isImagePipeline(x: any): x is ImagePipeline {
    return x !== null && typeof x === 'object' && IMAGE_PIPELINE_SYMBOL in x;
  }

  /**
   * The infrastructure configuration used for the image build
   */
  public readonly infrastructureConfiguration: IInfrastructureConfiguration;

  /**
   * The execution role used for the image build. If there is no execution role, then the build will be executed with
   * the AWSServiceRoleForImageBuilder service-linked role.
   */
  public readonly executionRole?: iam.IRole;

  private readonly props: ImagePipelineProps;
  private readonly resource: CfnImagePipeline;

  public constructor(scope: Construct, id: string, props: ImagePipelineProps) {
    super(scope, id, {
      physicalName:
        props.imagePipelineName ??
        cdk.Lazy.string({
          produce: () =>
            cdk.Names.uniqueResourceName(this, {
              maxLength: 128,
              separator: '-',
              allowedSpecialCharacters: '-',
            }).toLowerCase(), // Enforce lowercase for the auto-generated fallback
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Object.defineProperty(this, IMAGE_PIPELINE_SYMBOL, { value: true });

    this.validateImagePipelineName();

    this.props = props;

    this.infrastructureConfiguration =
      props.infrastructureConfiguration ?? new InfrastructureConfiguration(this, 'InfrastructureConfiguration');
    this.executionRole = getExecutionRole(
      this,
      (grantee: iam.IGrantable) => this.grantDefaultExecutionRolePermissions(grantee),
      props,
    );

    if (InfrastructureConfiguration.isInfrastructureConfiguration(this.infrastructureConfiguration)) {
      this.infrastructureConfiguration._bind({ isContainerBuild: props.recipe._isContainerRecipe() });
    }

    if (props.recipe._isImageRecipe() && props.recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe cannot be both an IImageRecipe and an IContainerRecipe', this);
    }

    if (!props.recipe._isImageRecipe() && !props.recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe must either be an IImageRecipe or IContainerRecipe', this);
    }

    const imagePipeline = new CfnImagePipeline(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      ...(props.recipe._isImageRecipe() && { imageRecipeArn: props.recipe.imageRecipeArn }),
      ...(props.recipe._isContainerRecipe() && { containerRecipeArn: props.recipe.containerRecipeArn }),
      ...(props.status !== undefined && { status: props.status }),
      infrastructureConfigurationArn: this.infrastructureConfiguration.infrastructureConfigurationArn,
      distributionConfigurationArn: props.distributionConfiguration?.distributionConfigurationArn,
      enhancedImageMetadataEnabled: props.enhancedImageMetadataEnabled,
      executionRole: this.executionRole?.roleArn,
      schedule: this.buildSchedule(props),
      loggingConfiguration: this.buildLoggingConfiguration(props),
      imageTestsConfiguration: buildImageTestsConfiguration<
        ImagePipelineProps,
        CfnImagePipeline.ImageTestsConfigurationProperty
      >(props),
      imageScanningConfiguration: buildImageScanningConfiguration<
        ImagePipelineProps,
        CfnImagePipeline.ImageScanningConfigurationProperty
      >(this, props),
      workflows: buildWorkflows<ImagePipelineProps, CfnImagePipeline.WorkflowConfigurationProperty[]>(props),
      tags: props.tags,
    });

    this.resource = imagePipeline;
  }

  @memoizedGetter
  public get imagePipelineName(): string {
    return this.getResourceNameAttribute(this.resource.attrName);
  }

  @memoizedGetter
  public get imagePipelineArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'imagebuilder',
      resource: 'image-pipeline',
      resourceName: this.physicalName,
    });
  }

  /**
   * Grants the default permissions for building an image to the provided execution role.
   * [disable-awslint:no-grants]
   *
   * @param grantee The execution role used for the image build.
   */
  @MethodMetadata()
  public grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[] {
    const policies = defaultExecutionRolePolicy(this, this.props);
    return policies.map((policy) =>
      iam.Grant.addToPrincipal({
        grantee: grantee,
        resourceArns: policy.resources,
        actions: policy.actions,
        conditions: policy.conditions,
        scope: this,
      }),
    );
  }

  private validateImagePipelineName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError('The imagePipelineName cannot be longer than 128 characters', this);
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError('The imagePipelineName cannot contain spaces', this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError('The imagePipelineName cannot contain underscores', this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError('The imagePipelineName must be lowercase', this);
    }
  }

  private buildSchedule(props: ImagePipelineProps): CfnImagePipeline.ScheduleProperty | undefined {
    const schedule = props.schedule;
    if (!schedule) {
      return undefined;
    }

    if (schedule.autoDisableFailureCount !== undefined && !cdk.Token.isUnresolved(schedule.autoDisableFailureCount)) {
      if (schedule.autoDisableFailureCount < 1 || schedule.autoDisableFailureCount > 10) {
        throw new cdk.ValidationError('the autoDisableFailureCount must be between 1 and 10', this);
      }
    }

    return {
      scheduleExpression: schedule.expression.expressionString,
      ...(schedule.autoDisableFailureCount !== undefined && {
        autoDisablePolicy: {
          failureCount: schedule.autoDisableFailureCount,
        },
      }),
      ...(schedule.startCondition !== undefined && {
        pipelineExecutionStartCondition: schedule.startCondition,
      }),
    };
  }

  /**
   * Generates the loggingConfiguration property into the `LoggingConfiguration` type in the CloudFormation L1
   * definition.
   *
   * @param props Props input for the construct
   */
  private buildLoggingConfiguration = (
    props: ImagePipelineProps,
  ): CfnImagePipeline.PipelineLoggingConfigurationProperty | undefined => {
    const loggingConfiguration = {
      ...(props.imageLogGroup && { imageLogGroupName: props.imageLogGroup.logGroupName }),
      ...(props.imagePipelineLogGroup && { pipelineLogGroupName: props.imagePipelineLogGroup.logGroupName }),
    };

    return Object.keys(loggingConfiguration).length ? loggingConfiguration : undefined;
  };
}
