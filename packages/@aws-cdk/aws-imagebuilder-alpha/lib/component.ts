import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnComponent } from 'aws-cdk-lib/aws-imagebuilder';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import * as yaml from 'yaml';
import { OSVersion, Platform } from './os-version';

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
 * Properties for an EC2 Image Builder AWS-managed component
 */
export interface AwsManagedComponentAttributes {
  /**
   * The name of the AWS-managed component
   *
   * The name of the AWS-managed component. This is a required attribute when using the
   * `this.fromAwsManagedComponentAttributes()` method. This parameter should not be provided when
   * using the pre-defined managed component methods, such as `AwsManagedComponent.updateOS()` and
   * `AwsManagedComponent.reboot()`.
   *
   *  @default - none if using  the pre-defined managed component methods, otherwise a platform is required when using
   *             `this.fromAwsManagedComponentAttributes()`
   */
  readonly componentName?: string;

  /**
   * The version of the AWS-managed component
   *
   * @default - the latest version of the component, x.x.x
   */
  readonly componentVersion?: string;

  /**
   * The platform of the AWS-managed component. This is a required attribute when using the pre-defined managed
   * component methods, such as `AwsManagedComponent.updateOS()` and `AwsManagedComponent.reboot()`. This parameter
   * should not be provided when using the `this.fromAwsManagedComponentAttributes()` method.
   *
   * @default - none if using `this.fromAwsManagedComponentAttributes()`, otherwise a platform is
   *            required when using the pre-defined managed component methods
   */
  readonly platform?: Platform;
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
   */
  readonly inputs: any;

  /**
   * The condition to apply to the step. If the condition is false, then the step is skipped
   *
   * @default - no condition is applied to the step and it gets executed
   */
  readonly if?: any;

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
    const { name, description, schemaVersion, phases } = data;
    return this.fromJsonObject({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      schemaVersion: schemaVersion,
      phases: phases.map((phase) => ({
        name: phase.name,
        steps: phase.steps.map((step) => ({
          name: step.name,
          action: step.action,
          ...(step.onFailure !== undefined && { onFailure: step.onFailure }),
          ...(step.timeout !== undefined && { timeoutSeconds: step.timeout.toSeconds() }),
          ...(step.if !== undefined && { if: step.if }),
          ...(step.loop !== undefined && { loop: step.loop }),
          inputs: step.inputs,
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
   * Indicates that the provided component data is an S3 reference
   */
  abstract readonly isS3Reference: boolean;

  /**
   * The resulting inline string or S3 URL which references the component data
   */
  public readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }
}

/**
 * Helper class for S3-based component data references, containing additional permission grant methods on the S3 object
 */
export abstract class S3ComponentData extends ComponentData {
  public readonly isS3Reference = true;

  protected readonly bucket: s3.IBucket;
  protected readonly key: string;

  protected constructor(bucket: s3.IBucket, key: string) {
    super(bucket.s3UrlForObject(key));

    this.bucket = bucket;
    this.key = key;
  }

  /**
   * Grant put permissions to the given grantee for the component data in S3
   *
   * @param grantee The principal
   */
  public grantPut(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantPut(grantee, this.key);
  }

  /**
   * Grant read permissions to the given grantee for the component data in S3
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantRead(grantee, this.key);
  }
}

class InlineComponentData extends ComponentData {
  public readonly isS3Reference = false;

  public constructor(data: string) {
    super(data);
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
 * The parameter value for a component parameter
 */
export class ComponentParameterValue {
  /**
   * The value of the parameter as a string
   *
   * @param value The string value of the parameter
   */
  public static fromString(value: string): ComponentParameterValue {
    return new ComponentParameterValue([value]);
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
 * Helper class for working with AWS-managed components
 */
export abstract class AwsManagedComponent {
  /**
   * Imports the AWS CLI v2 AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static awsCliV2(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'awsCliV2',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'aws-cli-version-2-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'aws-cli-version-2-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports the hello world AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static helloWorld(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'helloWorld',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'hello-world-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'hello-world-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports the Python 3 AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static python3(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'python3',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'python-3-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'python-3-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports the reboot AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static reboot(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'reboot',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'reboot-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'reboot-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports the STIG hardening AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   *
   * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ib-stig.html
   */
  public static stigBuild(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'stigBuild',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'stig-build-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'stig-build-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports the OS update AWS-managed component
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static updateOS(scope: Construct, id: string, attrs: AwsManagedComponentAttributes): IComponent {
    this.validatePredefinedManagedComponentMethodAttributes({
      scope,
      attrs,
      component: 'updateOS',
      allowedPlatforms: [Platform.LINUX, Platform.WINDOWS],
    });

    if (attrs.platform === Platform.WINDOWS) {
      return this.fromAwsManagedComponentAttributes(scope, id, {
        componentName: 'update-windows',
        componentVersion: attrs.componentVersion,
      });
    }

    return this.fromAwsManagedComponentAttributes(scope, id, {
      componentName: 'update-linux',
      componentVersion: attrs.componentVersion,
    });
  }

  /**
   * Imports an AWS-managed component from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed component attributes
   */
  public static fromAwsManagedComponentAttributes(
    scope: Construct,
    id: string,
    attrs: AwsManagedComponentAttributes,
  ): IComponent {
    if (attrs.platform !== undefined) {
      throw new cdk.ValidationError(
        'platform can only be used with pre-defined AWS-managed component methods, such as updateOS',
        scope,
      );
    }

    if (attrs.componentName === undefined) {
      throw new cdk.ValidationError('an AWS-managed component name is required', scope);
    }

    return Component.fromComponentArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws',
        resource: 'component',
        resourceName: `${attrs.componentName}/${attrs.componentVersion ?? LATEST_VERSION}`,
      }),
    );
  }
  /**
   * Imports an AWS-managed component from its name
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param awsManagedComponentName - The name of the AWS-managed component
   */
  public static fromAwsManagedComponentName(scope: Construct, id: string, awsManagedComponentName: string): IComponent {
    return this.fromAwsManagedComponentAttributes(scope, id, { componentName: awsManagedComponentName });
  }

  private static validatePredefinedManagedComponentMethodAttributes({
    scope,
    attrs,
    component,
    allowedPlatforms,
  }: {
    scope: Construct;
    component: string;
    attrs: AwsManagedComponentAttributes;
    allowedPlatforms: Platform[];
  }) {
    if (attrs.componentName !== undefined) {
      throw new cdk.ValidationError(`a name is not allowed for ${component}`, scope);
    }

    if (attrs.platform === undefined) {
      throw new cdk.ValidationError(`a platform is required for ${component}`, scope);
    }

    if (cdk.Token.isUnresolved(attrs.platform)) {
      throw new cdk.ValidationError(`platform cannot be a token for ${component}`, scope);
    }

    if (!allowedPlatforms.includes(attrs.platform)) {
      throw new cdk.ValidationError(`${attrs.platform} is not a supported platform for ${component}`, scope);
    }
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
        'a componentName/componentVersion cannot be provided when a componentArn is provided',
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
        return [attrs.componentName, attrs.componentVersion ?? 'x.x.x'];
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
   * The ARN of the component
   */
  public readonly componentArn: string;

  /**
   * The name of the component
   */
  public readonly componentName: string;

  /**
   * The version of the component
   */
  public readonly componentVersion: string;

  /**
   * Whether the component is encrypted
   */
  public readonly encrypted: boolean;

  /**
   * The type of the component
   *
   * @attribute
   */
  public readonly componentType: string;

  protected readonly kmsKey?: kms.IKey;

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

    const component = new CfnComponent(this, 'Resource', {
      name: this.physicalName,
      version: componentVersion,
      changeDescription: props.changeDescription,
      description: props.description,
      platform: props.platform,
      kmsKeyId: props.kmsKey?.keyArn,
      tags: props.tags,
      ...(props.data.isS3Reference ? { uri: props.data.value } : { data: props.data.value }),
      ...(supportedOsVersions?.length && {
        supportedOsVersions: supportedOsVersions.map((osVersion) => osVersion.osVersion!),
      }),
    });

    this.componentName = this.getResourceNameAttribute(component.attrName);
    this.componentArn = this.getResourceArnAttribute(component.attrArn, {
      service: 'imagebuilder',
      resource: 'component',
      resourceName: `${this.physicalName}/${componentVersion}`,
    });
    this.componentVersion = componentVersion;
    this.encrypted = true; // Components are always encrypted
    this.componentType = component.attrType;
    this.kmsKey = props.kmsKey;
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
