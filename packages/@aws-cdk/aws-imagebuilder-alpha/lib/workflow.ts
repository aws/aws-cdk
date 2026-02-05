import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnWorkflow } from 'aws-cdk-lib/aws-imagebuilder';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import * as yaml from 'yaml';

const WORKFLOW_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.Workflow');

/**
 * Represents the latest version of a workflow. When using the workflow in a pipeline, the pipeline will use the
 * latest workflow at the time of execution.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ibhow-semantic-versioning.html
 */
const LATEST_VERSION = 'x.x.x';

/**
 * An EC2 Image Builder Workflow.
 */
export interface IWorkflow extends cdk.IResource {
  /**
   * The ARN of the workflow
   *
   * @attribute
   */
  readonly workflowArn: string;

  /**
   * The name of the workflow
   *
   * @attribute
   */
  readonly workflowName: string;

  /**
   * The type of the workflow
   *
   * @attribute
   */
  readonly workflowType: string;

  /**
   * The version of the workflow
   *
   * @attribute
   */
  readonly workflowVersion: string;

  /**
   * Grant custom actions to the given grantee for the workflow
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the workflow
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Properties for creating a Workflow resource
 */
export interface WorkflowProps {
  /**
   * The workflow document content that defines the image creation process.
   */
  readonly data: WorkflowData;

  /**
   * The phase in the image build process for which the workflow resource is responsible.
   */
  readonly workflowType: WorkflowType;

  /**
   * The name of the workflow.
   *
   * @default - a name is generated
   */
  readonly workflowName?: string;

  /**
   * The version of the workflow.
   *
   * @default 1.0.0
   */
  readonly workflowVersion?: string;

  /**
   * The description of the workflow.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The change description of the workflow. Describes what change has been made in this version of the workflow, or
   * what makes this version different from other versions.
   *
   * @default None
   */
  readonly changeDescription?: string;

  /**
   * The KMS key used to encrypt this workflow.
   *
   * @default - an Image Builder owned key will be used to encrypt the workflow.
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The tags to apply to the workflow
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for an EC2 Image Builder Workflow
 */
export interface WorkflowAttributes {
  /**
   * The ARN of the workflow
   *
   * @default - the ARN is automatically constructed if a workflowName and workflowType is provided, otherwise a
   * workflowArn is required
   */
  readonly workflowArn?: string;

  /**
   * The name of the workflow
   *
   * @default - the name is automatically constructed if a workflowArn is provided, otherwise a workflowName is required
   */
  readonly workflowName?: string;

  /**
   * The type of the workflow
   *
   * @default - the type is automatically constructed if a workflowArn is provided, otherwise a workflowType is required
   */
  readonly workflowType?: WorkflowType;

  /**
   * The version of the workflow
   *
   * @default x.x.x
   */
  readonly workflowVersion?: string;
}

/**
 * The action for a step within the workflow document
 */
export enum WorkflowAction {
  /**
   * Applies customizations and configurations to the input AMIs, such as publishing the AMI to SSM Parameter Store,
   * or creating launch template versions with the AMI IDs provided in the input
   */
  APPLY_IMAGE_CONFIGURATIONS = 'ApplyImageConfigurations',

  /**
   * The BootstrapInstanceForContainer action runs a service script to bootstrap the instance with minimum requirements
   * to run container workflows
   */
  BOOTSTRAP_INSTANCE_FOR_CONTAINER = 'BootstrapInstanceForContainer',

  /**
   * The CollectImageMetadata action collects additional information about the instance, such as the list of packages
   * and their respective versions
   */
  COLLECT_IMAGE_METADATA = 'CollectImageMetadata',

  /**
   * The CollectImageScanFindings action collects findings reported by Amazon Inspector for the provided instance
   */
  COLLECT_IMAGE_SCAN_FINDINGS = 'CollectImageScanFindings',

  /**
   * The CreateImage action creates an AMI from a running instance with the ec2:CreateImage API
   */
  CREATE_IMAGE = 'CreateImage',

  /**
   * The DistributeImage action copies an AMI using the image's distribution configuration, or using the distribution
   * settings in the step input
   */
  DISTRIBUTE_IMAGE = 'DistributeImage',

  /**
   * The ExecuteComponents action runs components that are specified in the recipe for the current image being built
   */
  EXECUTE_COMPONENTS = 'ExecuteComponents',

  /**
   * The ExecuteStateMachine action executes a the state machine provided and waits for completion as part of the
   * workflow
   */
  EXECUTE_STATE_MACHINE = 'ExecuteStateMachine',

  /**
   * The LaunchInstance action launches an instance using the settings from your recipe and infrastructure configuration
   * resources
   */
  LAUNCH_INSTANCE = 'LaunchInstance',

  /**
   * Applies attribute updates to the provided set of distributed images, such as launch permission updates
   */
  MODIFY_IMAGE_ATTRIBUTES = 'ModifyImageAttributes',

  /**
   * The RunCommand action runs a command document against the provided instance
   */
  RUN_COMMAND = 'RunCommand',

  /**
   * The RegisterImage action creates an AMI from a set of snapshots with the ec2:RegisterImage API
   */
  REGISTER_IMAGE = 'RegisterImage',

  /**
   * The RunSysprep action runs the Sysprep document on the provided Windows instance
   */
  RUN_SYS_PREP = 'RunSysPrep',

  /**
   * The SanitizeInstance action runs a recommended sanitization script on Linux instances
   */
  SANITIZE_INSTANCE = 'SanitizeInstance',

  /**
   * The TerminateInstance action terminates the provided instance
   */
  TERMINATE_INSTANCE = 'TerminateInstance',

  /**
   * The WaitForAction action pauses the workflow and waits to receive an external signal from the
   * imagebuilder:SendWorkflowStepAction API
   */
  WAIT_FOR_ACTION = 'WaitForAction',

  /**
   * The WaitForSSMAgent action waits for the given instance to have connectivity with SSM before proceeding
   */
  WAIT_FOR_SSM_AGENT = 'WaitForSSMAgent',
}

/**
 * The action to take if the workflow fails
 */
export enum WorkflowOnFailure {
  /**
   * Fails the image build if the workflow fails
   */
  ABORT = 'Abort',

  /**
   * Continues with the image build if the workflow fails
   */
  CONTINUE = 'Continue',
}

/**
 * The parameter type for the workflow parameter
 */
export enum WorkflowParameterType {
  /**
   * Indicates the workflow parameter has a boolean value
   */
  BOOLEAN = 'boolean',

  /**
   * Indicates the workflow parameter has an integer value
   */
  INTEGER = 'integer',

  /**
   * Indicates the workflow parameter has a string value
   */
  STRING = 'string',

  /**
   * Indicates the workflow parameter has a string list value
   */
  STRING_LIST = 'stringList',
}

/**
 * The schema version of the workflow
 */
export enum WorkflowSchemaVersion {
  /**
   * Schema version 1.0 for the workflow document
   */
  V1_0 = '1.0',
}

/**
 * The type of the workflow
 */
export enum WorkflowType {
  /**
   * Indicates the workflow is for building images
   */
  BUILD = 'BUILD',

  /**
   * Indicates the workflow is for testing images
   */
  TEST = 'TEST',

  /**
   * Indicates the workflow is for distributing images
   */
  DISTRIBUTION = 'DISTRIBUTION',
}

/**
 * The rendered workflow data value, for use in CloudFormation.
 * - For inline workflows, data is the workflow text
 * - For S3-backed workflows, uri is the S3 URL
 */
export interface WorkflowDataConfig {
  /**
   * The rendered workflow data, for use in CloudFormation
   *
   * @default - none if uri is set
   */
  readonly data?: string;

  /**
   * The rendered workflow data URI, for use in CloudFormation
   *
   * @default - none if data is set
   */
  readonly uri?: string;
}

/**
 * Helper class for referencing and uploading workflow data
 */
export abstract class WorkflowData {
  /**
   * Uploads workflow data from a local file to S3 to use as the workflow data
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param path The local path to the workflow data file
   * @param options S3 asset upload options
   */
  public static fromAsset(
    scope: Construct,
    id: string,
    path: string,
    options: s3assets.AssetOptions = {},
  ): S3WorkflowData {
    const asset = new s3assets.Asset(scope, id, { ...options, path });
    return new S3WorkflowDataFromAsset(asset);
  }

  /**
   * References workflow data from a pre-existing S3 object
   *
   * @param bucket The S3 bucket where the workflow data is stored
   * @param key The S3 key of the workflow data file
   */
  public static fromS3(bucket: s3.IBucket, key: string): S3WorkflowData {
    return new S3WorkflowDataFromBucketKey(bucket, key);
  }

  /**
   * Uses an inline JSON object as the workflow data
   *
   * @param data An inline JSON object representing the workflow data
   */
  public static fromJsonObject(data: { [key: string]: any }): WorkflowData {
    const inlineData = yaml.stringify(data, { indent: 2 });
    return new InlineWorkflowData(inlineData);
  }

  /**
   * Uses an inline JSON or YAML string as the workflow data
   *
   * @param data An inline JSON or YAML string representing the workflow data
   */
  public static fromInline(data: string): WorkflowData {
    return new InlineWorkflowData(data);
  }

  /**
   * The rendered workflow data value, for use in CloudFormation.
   * - For inline workflows, data is the workflow text
   * - For S3-backed workflows, uri is the S3 URL
   */
  abstract render(): WorkflowDataConfig;
}

/**
 * Helper class for S3-based workflow data references, containing additional permission grant methods on the S3 object
 */
export abstract class S3WorkflowData extends WorkflowData {
  protected readonly bucket: s3.IBucket;
  protected readonly key: string;

  protected constructor(bucket: s3.IBucket, key: string) {
    super();

    this.bucket = bucket;
    this.key = key;
  }

  /**
   * The rendered workflow data text, for use in CloudFormation
   */
  public render(): WorkflowDataConfig {
    return { uri: this.bucket.s3UrlForObject(this.key) };
  }

  /**
   * Grant put permissions to the given grantee for the workflow data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantPut(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantPut(grantee, this.key);
  }

  /**
   * Grant read permissions to the given grantee for the workflow data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantRead(grantee, this.key);
  }
}

class InlineWorkflowData extends WorkflowData {
  protected readonly data: string;

  public constructor(data: string) {
    super();

    this.data = data;
  }

  /**
   * The rendered workflow data text, for use in CloudFormation
   */
  public render(): WorkflowDataConfig {
    return { data: this.data };
  }
}

class S3WorkflowDataFromBucketKey extends S3WorkflowData {
  public constructor(bucket: s3.IBucket, key: string) {
    super(bucket, key);
  }
}

class S3WorkflowDataFromAsset extends S3WorkflowData {
  public constructor(asset: s3assets.Asset) {
    super(asset.bucket, asset.s3ObjectKey);
  }
}

/**
 * The parameter value for a workflow parameter
 */
export class WorkflowParameterValue {
  /**
   * The value of the parameter as a boolean
   *
   * @param value The boolean value of the parameter
   */
  public static fromBoolean(value: boolean): WorkflowParameterValue {
    return new WorkflowParameterValue([value.toString()]);
  }

  /**
   * The value of the parameter as an integer
   *
   * @param value The integer value of the parameter
   */
  public static fromInteger(value: number): WorkflowParameterValue {
    return new WorkflowParameterValue([value.toString()]);
  }

  /**
   * The value of the parameter as a string
   * @param value The string value of the parameter
   */
  public static fromString(value: string): WorkflowParameterValue {
    return new WorkflowParameterValue([value]);
  }

  /**
   * The value of the parameter as a string list
   *
   * @param values The string list value of the parameter
   */
  public static fromStringList(values: string[]): WorkflowParameterValue {
    return new WorkflowParameterValue(values);
  }

  /**
   * The rendered parameter value
   */
  public readonly value: string[];

  protected constructor(value: string[]) {
    this.value = value;
  }
}

/**
 * Configuration details for a workflow
 */
export interface WorkflowConfiguration {
  /**
   * The workflow to execute in the image build
   */
  readonly workflow: IWorkflow;

  /**
   * The action to take if the workflow fails
   *
   * @default WorkflowOnFailure.ABORT
   */
  readonly onFailure?: WorkflowOnFailure;

  /**
   * The named parallel group to include this workflow in. Workflows in the same parallel group run in parallel of each
   * other.
   *
   * @default None
   */
  readonly parallelGroup?: string;

  /**
   * The parameters to pass to the workflow at execution time
   *
   * @default - none if the workflow has no parameters, otherwise the default parameter values are used
   */
  readonly parameters?: { [name: string]: WorkflowParameterValue };
}

/**
 * A new or imported Workflow
 */
abstract class WorkflowBase extends cdk.Resource implements IWorkflow {
  /**
   * The ARN of the workflow
   */
  abstract readonly workflowArn: string;

  /**
   * The name of the workflow
   */
  abstract readonly workflowName: string;

  /**
   * The type of the workflow
   */
  abstract readonly workflowType: string;

  /**
   * The version of the workflow
   */
  abstract readonly workflowVersion: string;

  /**
   * Grant custom actions to the given grantee for the workflow
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.workflowArn],
      scope: this,
    });
  }

  /**
   * Grant read permissions to the given grantee for the workflow
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetWorkflow');
  }
}

/**
 * Represents an EC2 Image Builder Workflow.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-image-workflows.html
 */
@propertyInjectable
export class Workflow extends WorkflowBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.Workflow';

  /**
   * Import an existing workflow given its ARN.
   */
  public static fromWorkflowArn(scope: Construct, id: string, workflowArn: string): IWorkflow {
    return this.fromWorkflowAttributes(scope, id, { workflowArn });
  }

  /**
   * Import an existing workflow by providing its attributes. The provided name must be normalized by converting
   * all alphabetical characters to lowercase, and replacing all spaces and underscores with hyphens. You may not
   * provide a dynamic expression for the workflowArn or workflowType
   */
  public static fromWorkflowAttributes(scope: Construct, id: string, attrs: WorkflowAttributes): IWorkflow {
    if (
      attrs.workflowArn !== undefined &&
      (attrs.workflowName !== undefined || attrs.workflowType !== undefined || attrs.workflowVersion !== undefined)
    ) {
      throw new cdk.ValidationError(
        'a workflowName, workflowType, or workflowVersion cannot be provided when a workflowArn is provided',
        scope,
      );
    }

    if (attrs.workflowArn === undefined && (attrs.workflowName === undefined || attrs.workflowType === undefined)) {
      throw new cdk.ValidationError('either workflowArn, or workflowName and workflowType is required', scope);
    }

    if (attrs.workflowType && cdk.Token.isUnresolved(attrs.workflowType)) {
      throw new cdk.ValidationError('workflowType cannot be an unresolved token', scope);
    }

    const workflowArn = (() => {
      if (attrs.workflowArn !== undefined) {
        return attrs.workflowArn;
      }

      return cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'workflow',
        resourceName: `${attrs.workflowType!.toLowerCase()}/${attrs.workflowName!}/${attrs.workflowVersion ?? LATEST_VERSION}`,
      });
    })();

    const [workflowType, workflowName, workflowVersion] = (() => {
      if (attrs.workflowName !== undefined) {
        return [attrs.workflowType!.toUpperCase(), attrs.workflowName, attrs.workflowVersion ?? LATEST_VERSION];
      }

      const workflowNameTypeVersion = cdk.Stack.of(scope).splitArn(
        workflowArn,
        cdk.ArnFormat.SLASH_RESOURCE_NAME,
      ).resourceName!;

      if (cdk.Token.isUnresolved(workflowNameTypeVersion)) {
        throw new cdk.ValidationError(
          'the workflowName, workflowType, and workflowVersion in the workflowArn cannot be an unresolved token',
          scope,
        );
      }

      if (workflowNameTypeVersion.split('/').length < 3) {
        throw new cdk.ValidationError(
          'the workflow ARN must end with <workflow-type>/<workflow-name>/<workflow-version>',
          scope,
        );
      }

      const workflowNameTypeVersionSplit = workflowNameTypeVersion.split('/');
      const [workflowTypeFromArn, workflowNameFromArn, workflowVersionFromArn] = workflowNameTypeVersionSplit.slice(
        0,
        3,
      );

      return [workflowTypeFromArn.toUpperCase(), workflowNameFromArn, workflowVersionFromArn];
    })();

    class Import extends WorkflowBase {
      public readonly workflowArn = workflowArn;
      public readonly workflowName = workflowName;
      public readonly workflowType = workflowType;
      public readonly workflowVersion = workflowVersion;
    }

    return new Import(scope, id);
  }

  /**
   * Return whether the given object is a Workflow.
   */
  public static isWorkflow(x: any): x is Workflow {
    return x !== null && typeof x === 'object' && WORKFLOW_SYMBOL in x;
  }

  /**
   * The type of the workflow
   */
  public readonly workflowType: string;

  /**
   * The version of the workflow
   */
  public readonly workflowVersion: string;

  private resource: CfnWorkflow;

  public constructor(scope: Construct, id: string, props: WorkflowProps) {
    super(scope, id, {
      physicalName:
        props.workflowName ??
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

    Object.defineProperty(this, WORKFLOW_SYMBOL, { value: true });

    this.validateWorkflowName();

    const workflowVersion = props.workflowVersion ?? '1.0.0';
    this.resource = new CfnWorkflow(this, 'Resource', {
      name: this.physicalName,
      version: workflowVersion,
      type: props.workflowType,
      changeDescription: props.changeDescription,
      description: props.description,
      kmsKeyId: props.kmsKey?.keyArn,
      tags: props.tags,
      ...props.data.render(),
    });

    this.workflowVersion = workflowVersion;
    this.workflowType = props.workflowType;
  }

  @memoizedGetter
  public get workflowName(): string {
    return this.getResourceNameAttribute(this.resource.getAtt('Name').toString());
  }

  @memoizedGetter
  public get workflowArn(): string {
    return this.resource.attrArn;
  }

  private validateWorkflowName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError('the workflowName cannot be longer than 128 characters', this);
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError('the workflowName cannot contain spaces', this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError('the workflowName cannot contain underscores', this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError('the workflowName must be lowercase', this);
    }
  }
}
