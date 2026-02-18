import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnComponent } from 'aws-cdk-lib/aws-imagebuilder';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import * as yaml from 'yaml';
import type { OSVersion, Platform } from './os-version';

const COMPONENT_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.Component');

const LATEST_VERSION = 'x.x.x';

/**
 * An EC2 Image Builder Component.
 */
export interface IComponent extends cdk.IResource {
  /**
   * The ARN of the component
   *
   * @attribute
   */
  readonly componentArn: string;

  /**
   * The name of the component
   *
   * @attribute
   */
  readonly componentName: string;

  /**
   * The version of the component
   *
   * @attribute
   */
  readonly componentVersion: string;

  /**
   * Grant custom actions to the given grantee for the component
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the component
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Properties for creating a Component resource
 */
export interface ComponentProps {
  /**
   * The component document content that defines the build, validation, or test steps to be executed during the image
   * building process.
   */
  readonly data: ComponentData;

  /**
   * The operating system platform of the component.
   */
  readonly platform: Platform;

  /**
   * The name of the component.
   *
   * @default - a name is generated
   */
  readonly componentName?: string;

  /**
   * The version of the component.
   *
   * @default 1.0.0
   */
  readonly componentVersion?: string;

  /**
   * The description of the component.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The change description of the component. Describes what change has been made in this version of the component, or
   * what makes this version different from other versions.
   *
   * @default None
   */
  readonly changeDescription?: string;

  /**
   * The KMS key used to encrypt this component.
   *
   * @default - an Image Builder owned key will be used to encrypt the component.
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The operating system versions supported by the component.
   *
   * @default None
   */
  readonly supportedOsVersions?: OSVersion[];

  /**
   * The tags to apply to the component
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for an EC2 Image Builder component
 */
export interface ComponentAttributes {
  /**
   * The ARN of the component
   *
   * @default - the ARN is automatically constructed if a componentName is provided, otherwise a componentArn is
   *            required
   */
  readonly componentArn?: string;

  /**
   * The name of the component
   *
   * @default - the name is automatically constructed if a componentArn is provided, otherwise a componentName is
   *            required
   */
  readonly componentName?: string;

  /**
   * The version of the component
   *
   * @default - the latest version of the component, x.x.x
   */
  readonly componentVersion?: string;
}

/**
 * Properties for an EC2 Image Builder AWS Marketplace component
 */
export interface AwsMarketplaceComponentAttributes {
  /**
   * The name of the AWS Marketplace component. This name should exclude the marketplace product ID from it
   */
  readonly componentName: string;

  /**
   * The marketplace product ID associated with the component
   */
  readonly marketplaceProductId: string;

  /**
   * The version of the AWS Marketplace component
   *
   * @default - the latest version of the component, x.x.x
   */
  readonly componentVersion?: string;
}

/**
 * Properties of an EC2 Image Builder Component Document
 */
export interface ComponentDocument {
  /**
   * The schema version of the component
   */
  readonly schemaVersion: ComponentSchemaVersion;

  /**
   * The phases which define the grouping of steps to run in the build and test workflows of the image build.
   */
  readonly phases: ComponentDocumentPhase[];

  /**
   * The name of the document
   *
   * @default None
   */
  readonly name?: string;

  /**
   * The description of the document
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The constants to define in the document
   *
   * @default None
   */
  readonly constants?: { [constantName: string]: ComponentConstantValue };

  /**
   * The parameters to define in the document
   *
   * @default None
   */
  readonly parameters?: { [parameterName: string]: ComponentDocumentParameterDefinition };
}

/**
 * The phase to run in a specific workflow in an image build, which define the steps to execute to customize or test
 * the instance.
 */
export interface ComponentDocumentPhase {
  /**
   * The name of the phase
   */
  readonly name: ComponentPhaseName;

  /**
   * The list of steps to execute to modify or test the build/test instance
   */
  readonly steps: ComponentDocumentStep[];
}

/**
 * The step to run in a specific phase of the image build, which defines the step to execute to customize or test the
 * instance.
 */
export interface ComponentDocumentStep {
  /**
   * The name of the step
   */
  readonly name: string;

  /**
   * The action to perform in the step
   */
  readonly action: ComponentAction;

  /**
   * Contains parameters required by the action to run the step
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/toe-action-modules.html
   */
  readonly inputs: ComponentStepInputs;

  /**
   * The condition to apply to the step. If the condition is false, then the step is skipped
   *
   * @default - no condition is applied to the step and it gets executed
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/toe-conditional-constructs.html
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/toe-comparison-operators.html
   */
  readonly if?: ComponentStepIfCondition;

  /**
   * A looping construct defining a repeated sequence of instructions
   *
   * @default None
   */
  readonly loop?: ComponentDocumentLoop;

  /**
   * The timeout of the step
   *
   * @default - 120 minutes
   */
  readonly timeout?: cdk.Duration;

  /**
   * Specifies what the step should do in case of failure
   *
   * @default ComponentOnFailure.ABORT
   */
  readonly onFailure?: ComponentOnFailure;
}

/**
 * The looping construct of a component defines a repeated sequence of instructions
 */
export interface ComponentDocumentLoop {
  /**
   * The name of the loop, which can be used to reference
   *
   * @default loop
   */
  readonly name?: string;

  /**
   * The for loop iterates on a range of integers specified within a boundary outlined by the start and end of the
   * variables
   *
   * @default - none if `forEach` is provided. otherwise, `for` is required.
   */
  readonly for?: ComponentDocumentForLoop;

  /**
   * The forEach loop iterates on an explicit list of values, which can be strings and chained expressions
   *
   * @default - none if `for` is provided. otherwise, `forEach` is required.
   */
  readonly forEach?: string[];
}

/**
 * The for loop iterates on a range of integers specified within a boundary outlined by the start and end of the
 * variables. The iterating values are in the set [start, end] and includes boundary values.
 */
export interface ComponentDocumentForLoop {
  /**
   * Starting value of iteration. Does not accept chaining expressions.
   */
  readonly start: number;
  /**
   * Ending value of iteration. Does not accept chaining expressions.
   */
  readonly end: number;
  /**
   * Difference by which an iterating value is updated through addition. It must be a negative or positive non-zero
   * value. Does not accept chaining expressions.
   */
  readonly updateBy: number;
}

/**
 * The value of a constant in a component document
 */
export class ComponentConstantValue {
  /**
   * Creates a string type constant in a component document
   *
   * @param value The value of the constant
   */
  public static fromString(value: string): ComponentConstantValue {
    return new ComponentConstantValue('string', value);
  }

  /**
   * The data type of the constant
   */
  public readonly type: string;

  /**
   * The value of the constant
   */
  public readonly value: any;

  protected constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }
}

/**
 * The definition of the parameter
 */
export interface ComponentDocumentParameterDefinition {
  /**
   * The type of the parameter
   */
  readonly type: ComponentParameterType;

  /**
   * The default value of the parameter
   *
   * @default - none, indicating the parameter is required
   */
  readonly default?: any;

  /**
   * The description of the parameter
   *
   * @default None
   */
  readonly description?: string;
}

/**
 * The action for a step within the component document
 */
export enum ComponentAction {
  /**
   * The AppendFile action adds the provided content to the pre-existing content of a file
   */
  APPEND_FILE = 'AppendFile',

  /**
   * The Assert action performs value with comparison/logic operators, and succeeds/fails the step based on the outcome
   * of the assertion
   */
  ASSERT = 'Assert',

  /**
   * The CopyFile action copies files from a source file to a destination
   */
  COPY_FILE = 'CopyFile',

  /**
   * The CopyFolder action copies folders from a source to a destination
   */
  COPY_FOLDER = 'CopyFolder',

  /**
   * The CreateFile action creates a file in the provided location
   */
  CREATE_FILE = 'CreateFile',

  /**
   * The CreateFolder action creates a folder in the provided location
   */
  CREATE_FOLDER = 'CreateFolder',

  /**
   * The CreateSymlink action creates symbolic links from a given path to a target
   */
  CREATE_SYMLINK = 'CreateSymlink',

  /**
   * The DeleteFile action deletes file(s) in the provided location
   */
  DELETE_FILE = 'DeleteFile',

  /**
   * The DeleteFolder action deletes folders in the provided location
   */
  DELETE_FOLDER = 'DeleteFolder',

  /**
   * The ExecuteBash action runs bash scripts with inline bash commands
   */
  EXECUTE_BASH = 'ExecuteBash',

  /**
   * The ExecuteBinary action runs a provided binary executable
   */
  EXECUTE_BINARY = 'ExecuteBinary',

  /**
   * The ExecuteDocument action allows running other component documents from within a given component
   */
  EXECUTE_DOCUMENT = 'ExecuteDocument',

  /**
   * The ExecutePowershell action runs PowerShell scripts with inline PowerShell commands
   */
  EXECUTE_POWERSHELL = 'ExecutePowerShell',

  /**
   * The InstallMSI action runs a Windows application with the provided MSI file
   */
  INSTALL_MSI = 'InstallMSI',

  /**
   * The ListFiles action lists files in the provided folder
   */
  LIST_FILES = 'ListFiles',

  /**
   * The MoveFile action moves files from a source to a destination
   */
  MOVE_FILE = 'MoveFile',

  /**
   * The MoveFolder action moves folders from a source to a destination
   */
  MOVE_FOLDER = 'MoveFolder',

  /**
   * The ReadFile action reads the content of a text file
   */
  READ_FILE = 'ReadFile',

  /**
   * The Reboot action reboots the instance
   */
  REBOOT = 'Reboot',

  /**
   * The SetFileEncoding action modifies the encoding property of an existing file
   */
  SET_FILE_ENCODING = 'SetFileEncoding',

  /**
   * The SetFileOwner action modifies the owner and group ownership properties of an existing file
   */
  SET_FILE_OWNER = 'SetFileOwner',

  /**
   * The SetFolderOwner action recursively modifies the owner and group ownership properties of an existing folder
   */
  SET_FOLDER_OWNER = 'SetFolderOwner',

  /**
   * The SetFilePermissions action modifies the permission of an existing file
   */
  SET_FILE_PERMISSIONS = 'SetFilePermissions',

  /**
   * The SetFolderPermissions action recursively modifies the permissions of an existing folder and all of its subfiles
   * and subfolders
   */
  SET_FOLDER_PERMISSIONS = 'SetFolderPermissions',

  /**
   * The SetRegistry action sets the value for the specified Windows registry key
   */
  SET_REGISTRY = 'SetRegistry',

  /**
   * The S3Download action downloads an Amazon S3 object/folder to a local destination
   */
  S3_DOWNLOAD = 'S3Download',

  /**
   * The S3Upload action uploads a file or folder to an Amazon S3 location
   */
  S3_UPLOAD = 'S3Upload',

  /**
   * The UninstallMSI action removes a Windows application using an MSI file
   */
  UNINSTALL_MSI = 'UninstallMSI',

  /**
   * The UpdateOS action installs OS updates
   */
  UPDATE_OS = 'UpdateOS',

  /**
   * The WebDownload action downloads files from a URL to a local destination
   */
  WEB_DOWNLOAD = 'WebDownload',
}

/**
 * Specifies what the step should do in case of failure
 */
export enum ComponentOnFailure {
  /**
   * Fails the step and document execution
   */
  ABORT = 'Abort',

  /**
   * Fails the step and proceeds to execute the next step in the document
   */
  CONTINUE = 'Continue',

  /**
   * Ignores the step and proceeds to execute the next step in the document
   */
  IGNORE = 'Ignore',
}

/**
 * The parameter type in a component document
 */
export enum ComponentParameterType {
  /**
   * Indicates the parameter value is a string
   */
  STRING = 'string',
}

/**
 * The phases of a component document
 */
export enum ComponentPhaseName {
  /**
   * Build phase of the component. This phase is run during the BUILDING phase of the image build.
   */
  BUILD = 'build',

  /**
   * Test phase of the component, executed directly on the instance which is used to build the container image. This
   * phase is run during the TESTING phase of the image build.
   */
  CONTAINER_HOST_TEST = 'container-host-test',

  /**
   * Test phase of the component. This phase is run during the TESTING phase of the image build.
   */
  TEST = 'test',

  /**
   * Validate phase of the component. This phase is run during the BUILDING phase of the image build, after the build
   * step of the component is executed.
   */
  VALIDATE = 'validate',
}

/**
 * The schema version of the component
 */
export enum ComponentSchemaVersion {
  /**
   * Schema version 1.0 for the component document
   */
  V1_0 = '1.0',
}

/**
 * Represents the inputs for a step in the component document
 */
export class ComponentStepInputs {
  /**
   * Creates the input value from an object, for the component step
   *
   * @param inputsObject The object containing the input values
   */
  public static fromObject(inputsObject: { [key: string]: any }): ComponentStepInputs {
    return new ComponentStepInputs(inputsObject);
  }

  /**
   * Creates the input value from a list of input objects, for the component step
   *
   * @param inputsObjectList The list of objects containing the input values
   */
  public static fromList(inputsObjectList: { [key: string]: any }[]): ComponentStepInputs {
    return new ComponentStepInputs(inputsObjectList);
  }

  /**
   * The rendered input value
   */
  public readonly inputs: any;

  protected constructor(input: any) {
    this.inputs = input;
  }
}

/**
 * Represents an `if` condition in the component document
 */
export class ComponentStepIfCondition {
  /**
   * Creates the `if` value from an object, for the component step
   *
   * @param ifObject The object containing the `if` condition
   */
  public static fromObject(ifObject: { [key: string]: any }): ComponentStepIfCondition {
    return new ComponentStepIfCondition(ifObject);
  }

  /**
   * The rendered input value
   */
  public readonly ifCondition: any;

  protected constructor(ifCondition: any) {
    this.ifCondition = ifCondition;
  }
}

/**
 * The rendered component data value, for use in CloudFormation.
 * - For inline components, data is the component text
 * - For S3-backed components, uri is the S3 URL
 */
export interface ComponentDataConfig {
  /**
   * The rendered component data, for use in CloudFormation
   *
   * @default - none if uri is set
   */
  readonly data?: string;

  /**
   * The rendered component data URI, for use in CloudFormation
   *
   * @default - none if data is set
   */
  readonly uri?: string;
}

/**
 * Helper class for referencing and uploading component data
 */
export abstract class ComponentData {
  /**
   * Uploads component data from a local file to S3 to use as the component data
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param path The local path to the component data file
   * @param options S3 asset upload options
   */
  public static fromAsset(
    scope: Construct,
    id: string,
    path: string,
    options: s3assets.AssetOptions = {},
  ): S3ComponentData {
    const asset = new s3assets.Asset(scope, id, { ...options, path });
    return new S3ComponentDataFromAsset(asset);
  }

  /**
   * References component data from a pre-existing S3 object
   *
   * @param bucket The S3 bucket where the component data is stored
   * @param key The S3 key of the component data file
   */
  public static fromS3(bucket: s3.IBucket, key: string): S3ComponentData {
    return new S3ComponentDataFromBucketKey(bucket, key);
  }

  /**
   * Uses an inline JSON object as the component data
   *
   * @param data An inline JSON object representing the component data
   */
  public static fromJsonObject(data: { [key: string]: any }): ComponentData {
    const inlineData = yaml.stringify(data, { indent: 2 });
    return new InlineComponentData(inlineData);
  }

  /**
   * Uses an inline JSON object as the component data, using the ComponentDocument interface
   *
   * @param data An inline JSON object representing the component data
   */
  public static fromComponentDocumentJsonObject(data: ComponentDocument): ComponentData {
    const { name, description, schemaVersion, constants, parameters, phases } = data;
    return this.fromJsonObject({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      schemaVersion: schemaVersion,
      ...(constants !== undefined && {
        constants: Object.entries(constants).map(([constantName, value]) => ({
          [constantName]: { type: value.type, value: value.value },
        })),
      }),
      ...(parameters !== undefined && {
        parameters: Object.entries(parameters).map(([parameterName, value]) => ({ [parameterName]: value })),
      }),
      phases: phases.map((phase) => ({
        name: phase.name,
        steps: phase.steps.map((step) => ({
          name: step.name,
          action: step.action,
          ...(step.onFailure !== undefined && { onFailure: step.onFailure }),
          ...(step.timeout !== undefined && { timeoutSeconds: step.timeout.toSeconds() }),
          ...(step.if !== undefined && { if: step.if.ifCondition }),
          ...(step.loop !== undefined && { loop: step.loop }),
          inputs: step.inputs.inputs,
        })),
      })),
    });
  }

  /**
   * Uses an inline JSON/YAML string as the component data
   *
   * @param data An inline JSON/YAML string representing the component data
   */
  public static fromInline(data: string): ComponentData {
    return new InlineComponentData(data);
  }

  /**
   * The rendered component data value, for use in CloudFormation.
   * - For inline components, data is the component text
   * - For S3-backed components, uri is the S3 URL
   */
  abstract render(): ComponentDataConfig;
}

/**
 * Helper class for S3-based component data references, containing additional permission grant methods on the S3 object
 */
export abstract class S3ComponentData extends ComponentData {
  protected readonly bucket: s3.IBucket;
  protected readonly key: string;

  protected constructor(bucket: s3.IBucket, key: string) {
    super();

    this.bucket = bucket;
    this.key = key;
  }

  /**
   * The rendered component data text, for use in CloudFormation
   */
  public render(): ComponentDataConfig {
    return { uri: this.bucket.s3UrlForObject(this.key) };
  }

  /**
   * Grant put permissions to the given grantee for the component data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantPut(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantPut(grantee, this.key);
  }

  /**
   * Grant read permissions to the given grantee for the component data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantRead(grantee, this.key);
  }
}

class InlineComponentData extends ComponentData {
  protected readonly data: string;

  public constructor(data: string) {
    super();

    this.data = data;
  }

  /**
   * The rendered component data text, for use in CloudFormation
   */
  public render(): ComponentDataConfig {
    return { data: this.data };
  }
}

class S3ComponentDataFromBucketKey extends S3ComponentData {
  public constructor(bucket: s3.IBucket, key: string) {
    super(bucket, key);
  }
}

class S3ComponentDataFromAsset extends S3ComponentData {
  public constructor(asset: s3assets.Asset) {
    super(asset.bucket, asset.s3ObjectKey);
  }
}

/**
 * Helper class for working with AWS Marketplace components
 */
export class AwsMarketplaceComponent {
  /**
   * Imports an AWS Marketplace component from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static fromAwsMarketplaceComponentAttributes(
    scope: Construct,
    id: string,
    attrs: AwsMarketplaceComponentAttributes,
  ): IComponent {
    return Component.fromComponentArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws-marketplace',
        resource: 'component',
        resourceName: `${attrs.componentName}-${attrs.marketplaceProductId}/${attrs.componentVersion ?? LATEST_VERSION}`,
      }),
    );
  }
}

/**
 * A new or imported Component
 */
abstract class ComponentBase extends cdk.Resource implements IComponent {
  /**
   * The ARN of the component
   */
  abstract readonly componentArn: string;
  /**
   * The name of the component
   */
  abstract readonly componentName: string;
  /**
   * The version of the component
   */
  abstract readonly componentVersion: string;

  /**
   * Grant custom actions to the given grantee for the component
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.componentArn],
      scope: this,
    });
  }

  /**
   * Grant read permissions to the given grantee for the component
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetComponent');
  }
}

/**
 * Represents an EC2 Image Builder Component.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-components.html
 */
@propertyInjectable
export class Component extends ComponentBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.Component';

  /**
   * Import an existing component given its ARN.
   */
  public static fromComponentArn(scope: Construct, id: string, componentArn: string): IComponent {
    return this.fromComponentAttributes(scope, id, { componentArn });
  }

  /**
   * Import an existing component given its name. The provided name must be normalized by converting all alphabetical
   * characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromComponentName(scope: Construct, id: string, componentName: string): IComponent {
    return this.fromComponentAttributes(scope, id, { componentName });
  }

  /**
   * Import an existing component by providing its attributes. If the component name is provided as an attribute, it
   * must be normalized by converting all alphabetical characters to lowercase, and replacing all spaces and underscores
   * with hyphens.
   */
  public static fromComponentAttributes(scope: Construct, id: string, attrs: ComponentAttributes): IComponent {
    if (attrs.componentArn && (attrs.componentName || attrs.componentVersion)) {
      throw new cdk.ValidationError(
        'a componentName or componentVersion cannot be provided when a componentArn is provided',
        scope,
      );
    }

    if (!attrs.componentArn && !attrs.componentName) {
      throw new cdk.ValidationError('either componentArn or componentName is required', scope);
    }

    const componentArn =
      attrs.componentArn ??
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'component',
        resourceName: `${attrs.componentName}/${attrs.componentVersion ?? LATEST_VERSION}`,
      });

    const [componentName, componentVersion] = (() => {
      if (attrs.componentName) {
        return [attrs.componentName, attrs.componentVersion ?? LATEST_VERSION];
      }

      const componentNameVersion = cdk.Stack.of(scope).splitArn(
        componentArn,
        cdk.ArnFormat.SLASH_RESOURCE_NAME,
      ).resourceName!;

      const componentNameVersionSplit = cdk.Fn.split('/', componentNameVersion);
      return [cdk.Fn.select(0, componentNameVersionSplit), cdk.Fn.select(1, componentNameVersionSplit)];
    })();

    class Import extends ComponentBase {
      public readonly componentArn = componentArn;
      public readonly componentName = componentName;
      public readonly componentVersion = componentVersion;
    }

    return new Import(scope, id);
  }

  /**
   * Return whether the given object is a Component.
   */
  public static isComponent(x: any): x is Component {
    return x !== null && typeof x === 'object' && COMPONENT_SYMBOL in x;
  }

  /**
   * The version of the component
   */
  public readonly componentVersion: string;

  /**
   * Whether the component is encrypted
   */
  public readonly encrypted: boolean;

  protected readonly kmsKey?: kms.IKey;
  private resource: CfnComponent;

  public constructor(scope: Construct, id: string, props: ComponentProps) {
    super(scope, id, {
      physicalName:
        props.componentName ??
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

    Object.defineProperty(this, COMPONENT_SYMBOL, { value: true });

    this.validateComponentName();

    props.supportedOsVersions?.forEach((osVersion) => {
      if (osVersion.platform !== props.platform) {
        throw new cdk.ValidationError(
          `os version ${osVersion.osVersion} is not compatible with platform ${props.platform}`,
          this,
        );
      }
    });

    const componentVersion = props.componentVersion ?? '1.0.0';
    const supportedOsVersions = props.supportedOsVersions?.filter((osVersion) => osVersion.osVersion !== undefined);

    this.resource = new CfnComponent(this, 'Resource', {
      name: this.physicalName,
      version: componentVersion,
      changeDescription: props.changeDescription,
      description: props.description,
      platform: props.platform,
      kmsKeyId: props.kmsKey?.keyArn,
      tags: props.tags,
      ...(supportedOsVersions?.length && {
        supportedOsVersions: supportedOsVersions.map((osVersion) => osVersion.osVersion!),
      }),
      ...props.data.render(),
    });

    this.componentVersion = componentVersion;
    this.encrypted = true; // Components are always encrypted
    this.kmsKey = props.kmsKey;
  }

  @memoizedGetter
  public get componentName(): string {
    return this.getResourceNameAttribute(this.resource.attrName);
  }

  @memoizedGetter
  public get componentArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'imagebuilder',
      resource: 'component',
      resourceName: `${this.physicalName}/${this.componentVersion}`,
    });
  }

  /**
   * The type of the component
   *
   * @attribute
   */
  @memoizedGetter
  public get componentType(): string {
    return this.resource.attrType;
  }

  private validateComponentName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError(
        `the componentName cannot be longer than 128 characters, got: '${this.physicalName}'`,
        this,
      );
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError(`the componentName cannot contain spaces, got: '${this.physicalName}'`, this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError(`the componentName cannot contain underscores, got: '${this.physicalName}'`, this);
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError(`the componentName must be lowercase, got: '${this.physicalName}'`, this);
    }
  }
}
