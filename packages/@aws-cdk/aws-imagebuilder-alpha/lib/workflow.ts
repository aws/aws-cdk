import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnWorkflow } from 'aws-cdk-lib/aws-imagebuilder';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import * as yaml from 'yaml';

const WORKFLOW_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.Workflow');

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
   * @param grantee - The principal
   * @param actions - The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the workflow
   *
   * @param grantee - The principal
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
   * @default A name is generated
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
   * @default An Image Builder owned key will be used to encrypt the workflow.
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
   * @default The ARN is automatically constructed if a workflowName and workflowType is provided, otherwise a
   *          workflowArn is required
   */
  readonly workflowArn?: string;

  /**
   * The name of the workflow
   *
   * @default The name is automatically constructed if a workflowArn is provided, otherwise a workflowName is required
   */
  readonly workflowName?: string;

  /**
   * The ype of the workflow
   *
   * @default The type is automatically constructed if a workflowArn is provided, otherwise a workflowType is required
   */
  readonly workflowType?: WorkflowType;

  /**
   * The version of the workflow
   *
   * @default The latest version of the workflow, x.x.x
   */
  readonly workflowVersion?: string;
}

/**
 * Configuration details for a workflow
 */
export interface WorkflowConfiguration {
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
   * @default None if the workflow has no parameters, otherwise the default parameter values are used
   */
  readonly parameters?: { [name: string]: WorkflowParameterValue };

  /**
   * The workflow to execute in the image build
   */
  readonly workflow: IWorkflow;
}
/**
 * Properties for an EC2 Image Builder AWS-managed workflow
 */
export interface AwsManagedWorkflowAttributes {
  /**
   * The name of the AWS-managed workflow
   */
  readonly workflowName: string;

  /**
   * The type of the AWS-managed workflow
   */
  readonly workflowType: WorkflowType;
}

/**
 * The action for a step within the workflow document
 */
export enum WorkflowAction {
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
   * The ExecuteComponents action runs components that are specified in the recipe for the current image being built
   */
  EXECUTE_COMPONENTS = 'ExecuteComponents',

  /**
   * The LaunchInstance action launches an instance using the settings from your recipe and infrastructure configuration
   * resources
   */
  LAUNCH_INSTANCE = 'LaunchInstance',

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
 * Helper class for referencing and uploading workflow data
 */
export abstract class WorkflowData {
  /**
   * Uploads workflow data from a local file to S3 to use as the workflow data
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param path - The local path to the workflow data file
   * @param options - S3 asset upload options
   */
  public static fromAsset(
    scope: Construct,
    id: string,
    path: string,
    options: s3assets.AssetOptions = {},
  ): WorkflowData {
    const asset = new s3assets.Asset(scope, id, { ...options, path });
    return new S3WorkflowDataFromAsset(asset);
  }

  /**
   * References workflow data from a pre-existing S3 object
   *
   * @param bucket - The S3 bucket where the workflow data is stored
   * @param key - The S3 key of the workflow data file
   */
  public static fromS3(bucket: s3.IBucket, key: string): S3WorkflowData {
    return new S3WorkflowDataFromBucketKey(bucket, key);
  }

  /**
   * Uses an inline JSON object as the workflow data
   *
   * @param data - An inline JSON object representing the workflow data
   */
  public static fromJsonObject(data: { [key: string]: any }): WorkflowData {
    const inlineData = yaml.stringify(data, { indent: 2 });
    return new InlineWorkflowData(inlineData);
  }

  /**
   * Uses an inline JSON/YAML string as the workflow data
   *
   * @param data - An inline JSON/YAML string representing the workflow data
   */
  public static fromInline(data: string): WorkflowData {
    return new InlineWorkflowData(data);
  }

  /**
   * Indicates that the provided workflow data is an S3 reference
   */
  abstract readonly isS3Reference: boolean;

  /**
   * The resulting inline string or S3 URL which references the workflow data
   */
  public readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }
}

/**
 * Helper class for S3-based workflow data references, containing additional permission grant methods on the S3 object
 */
export abstract class S3WorkflowData extends WorkflowData {
  public readonly isS3Reference = true;

  protected readonly bucket: s3.IBucket;
  protected readonly key: string;

  protected constructor(bucket: s3.IBucket, key: string) {
    super(bucket.s3UrlForObject(key));

    this.bucket = bucket;
    this.key = key;
  }

  /**
   * Grant put permissions to the given grantee for the workflow data in S3
   *
   * @param grantee - The principal
   */
  public grantPut(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantPut(grantee, this.key);
  }

  /**
   * Grant read permissions to the given grantee for the workflow data in S3
   *
   * @param grantee - The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantRead(grantee, this.key);
  }
}

class InlineWorkflowData extends WorkflowData {
  public readonly isS3Reference = false;

  public constructor(data: string) {
    super(data);
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
   * @param value - The boolean value of the parameter
   */
  public static fromBoolean(value: boolean): WorkflowParameterValue {
    return new WorkflowParameterValue([value.toString()]);
  }

  /**
   * The value of the parameter as an integer
   *
   * @param value - The integer value of the parameter
   */
  public static fromInteger(value: number): WorkflowParameterValue {
    return new WorkflowParameterValue([value.toString()]);
  }

  /**
   * The value of the parameter as a string
   * @param value - The string value of the parameter
   */
  public static fromString(value: string): WorkflowParameterValue {
    return new WorkflowParameterValue([value]);
  }

  /**
   * The value of the parameter as a string list
   *
   * @param values - The string list value of the parameter
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
 * Helper class for working with AWS-managed workflows
 */
export class AwsManagedWorkflow {
  /**
   * Imports the build-container AWS-managed workflow
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   */
  public static buildContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAwsManagedWorkflowAttributes(scope, id, {
      workflowName: 'build-container',
      workflowType: WorkflowType.BUILD,
    });
  }

  /**
   * Imports the build-container AWS-managed workflow
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   */
  public static buildImage(scope: Construct, id: string): IWorkflow {
    return this.fromAwsManagedWorkflowAttributes(scope, id, {
      workflowName: 'build-image',
      workflowType: WorkflowType.BUILD,
    });
  }

  /**
   * Imports the distribute-container AWS-managed workflow
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   */
  public static distributeContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAwsManagedWorkflowAttributes(scope, id, {
      workflowName: 'distribute-container',
      workflowType: WorkflowType.DISTRIBUTION,
    });
  }

  /**
   * Imports the test-container AWS-managed workflow
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   */
  public static testContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAwsManagedWorkflowAttributes(scope, id, {
      workflowName: 'test-container',
      workflowType: WorkflowType.TEST,
    });
  }

  /**
   * Imports the test-image AWS-managed workflow
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   */
  public static testImage(scope: Construct, id: string): IWorkflow {
    return this.fromAwsManagedWorkflowAttributes(scope, id, {
      workflowName: 'test-image',
      workflowType: WorkflowType.TEST,
    });
  }

  /**
   * Imports an AWS-managed workflow from its attributes
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - The attributes of the AWS-managed workflow
   */
  public static fromAwsManagedWorkflowAttributes(
    scope: Construct,
    id: string,
    attrs: AwsManagedWorkflowAttributes,
  ): IWorkflow {
    if (cdk.Token.isUnresolved(attrs.workflowType)) {
      throw new cdk.ValidationError('workflowType cannot be a token', scope);
    }

    return Workflow.fromWorkflowArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws',
        resource: 'workflow',
        resourceName: `${attrs.workflowType.toLowerCase()}/${attrs.workflowName}/x.x.x`,
      }),
    );
  }
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
   *
   * @attribute
   */
  abstract readonly workflowVersion: string;

  /**
   * Grant custom actions to the given grantee for the workflow
   *
   * @param grantee - The principal
   * @param actions - The list of actions
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
   *
   * @param grantee - The principal
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
export class Workflow extends WorkflowBase {
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
        'A workflowName/workflowType/workflowVersion cannot be provided when a workflowArn is provided',
        scope,
      );
    }

    if (attrs.workflowArn === undefined && (attrs.workflowName === undefined || attrs.workflowType === undefined)) {
      throw new cdk.ValidationError('Either workflowArn or workflowName/workflowType is required', scope);
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
        resourceName: `${attrs.workflowType!.toLowerCase()}/${attrs.workflowName!}/${attrs.workflowVersion ?? 'x.x.x'}`,
      });
    })();

    const [workflowType, workflowName, workflowVersion] = (() => {
      if (attrs.workflowName !== undefined) {
        return [attrs.workflowType!.toUpperCase(), attrs.workflowName, attrs.workflowVersion ?? 'x.x.x'];
      }

      const workflowNameTypeVersion = cdk.Stack.of(scope).splitArn(
        workflowArn,
        cdk.ArnFormat.SLASH_RESOURCE_NAME,
      ).resourceName!;

      if (cdk.Token.isUnresolved(workflowNameTypeVersion)) {
        throw new cdk.ValidationError(
          'The workflowName/workflowType/workflowVersion in the workflowArn cannot be an unresolved token',
          scope,
        );
      }

      if (![3, 4].includes(workflowNameTypeVersion.split('/').length)) {
        throw new cdk.ValidationError(
          'The workflow ARN must end with <workflow-name>/<workflow-type>/<workflow-version>',
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
   * The ARN of the workflow
   */
  public readonly workflowArn: string;

  /**
   * The name of the workflow
   */
  public readonly workflowName: string;

  /**
   * The type of the workflow
   */
  public readonly workflowType: string;

  /**
   * The version of the workflow
   */
  public readonly workflowVersion: string;

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

    Object.defineProperty(this, WORKFLOW_SYMBOL, { value: true });

    this.validateWorkflowName();

    const workflowVersion = props.workflowVersion ?? '1.0.0';
    const workflow = new CfnWorkflow(this, 'Resource', {
      name: this.physicalName,
      version: workflowVersion,
      type: props.workflowType,
      changeDescription: props.changeDescription,
      description: props.description,
      kmsKeyId: props.kmsKey?.keyArn,
      tags: props.tags,
      ...(props.data.isS3Reference ? { uri: props.data.value } : { data: props.data.value }),
    });

    this.workflowName = this.getResourceNameAttribute(workflow.getAtt('Name').toString());
    this.workflowArn = workflow.attrArn;
    this.workflowVersion = workflowVersion;
    this.workflowType = props.workflowType;
  }

  private validateWorkflowName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError('The workflowName cannot be longer than 128 characters', this);
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError('The workflowName cannot contain spaces', this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError('The workflowName cannot contain underscores', this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError('The workflowName must be lowercase', this);
    }
  }
}
