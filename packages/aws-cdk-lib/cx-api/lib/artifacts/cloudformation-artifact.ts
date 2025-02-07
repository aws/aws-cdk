import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '../../../cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import type { CloudAssembly } from '../cloud-assembly';
import { Environment, EnvironmentUtils } from '../environment';
const CLOUDFORMATION_STACK_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.CloudFormationStackArtifact');

export class CloudFormationStackArtifact extends CloudArtifact {
  /**
   * Checks if `art` is an instance of this class.
   *
   * Use this method instead of `instanceof` to properly detect `CloudFormationStackArtifact`
   * instances, even when the construct library is symlinked.
   *
   * Explanation: in JavaScript, multiple copies of the `cx-api` library on
   * disk are seen as independent, completely different libraries. As a
   * consequence, the class `CloudFormationStackArtifact` in each copy of the `cx-api` library
   * is seen as a different class, and an instance of one class will not test as
   * `instanceof` the other class. `npm install` will not create installations
   * like this, but users may manually symlink construct libraries together or
   * use a monorepo tool: in those cases, multiple copies of the `cx-api`
   * library can be accidentally installed, and `instanceof` will behave
   * unpredictably. It is safest to avoid using `instanceof`, and using
   * this type-testing method instead.
   */
  public static isCloudFormationStackArtifact(art: any): art is CloudFormationStackArtifact {
    return art && typeof art === 'object' && art[CLOUDFORMATION_STACK_ARTIFACT_SYM];
  }

  /**
   * The file name of the template.
   */
  public readonly templateFile: string;

  /**
   * The original name as defined in the CDK app.
   */
  public readonly originalName: string;

  /**
   * Any assets associated with this stack.
   */
  public readonly assets: cxschema.AssetMetadataEntry[];

  /**
   * CloudFormation parameters to pass to the stack.
   */
  public readonly parameters: { [id: string]: string };

  /**
   * CloudFormation tags to pass to the stack.
   */
  public readonly tags: { [id: string]: string };

  /**
   * SNS Topics that will receive stack events.
   */
  public readonly notificationArns?: string[];

  /**
   * The physical name of this stack.
   */
  public readonly stackName: string;

  /**
   * A string that represents this stack. Should only be used in user
   * interfaces. If the stackName has not been set explicitly, or has been set
   * to artifactId, it will return the hierarchicalId of the stack. Otherwise,
   * it will return something like "<hierarchicalId> (<stackName>)"
   */
  public readonly displayName: string;

  /**
   * The physical name of this stack.
   * @deprecated renamed to `stackName`
   */
  public readonly name: string;

  /**
   * The environment into which to deploy this artifact.
   */
  public readonly environment: Environment;

  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  public readonly assumeRoleArn?: string;

  /**
   * External ID to use when assuming role for cloudformation deployments
   *
   * @default - No external ID
   */
  readonly assumeRoleExternalId?: string;

  /**
   * Additional options to pass to STS when assuming the role for cloudformation deployments.
   *
   * - `RoleArn` should not be used. Use the dedicated `assumeRoleArn` property instead.
   * - `ExternalId` should not be used. Use the dedicated `assumeRoleExternalId` instead.
   * - `TransitiveTagKeys` defaults to use all keys (if any) specified in `Tags`. E.g, all tags are transitive by default.
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#assumeRole-property
   * @default - No additional options.
   */
  readonly assumeRoleAdditionalOptions?: { [key: string]: any };

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  public readonly cloudFormationExecutionRoleArn?: string;

  /**
   * The role to use to look up values from the target AWS account
   *
   * @default - No role is assumed (current credentials are used)
   */
  public readonly lookupRole?: cxschema.BootstrapRole;

  /**
   * If the stack template has already been included in the asset manifest, its asset URL
   *
   * @default - Not uploaded yet, upload just before deploying
   */
  public readonly stackTemplateAssetObjectUrl?: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - No bootstrap stack required
   */
  public readonly requiresBootstrapStackVersion?: number;

  /**
   * Name of SSM parameter with bootstrap stack version
   *
   * @default - Discover SSM parameter by reading stack
   */
  public readonly bootstrapStackVersionSsmParameter?: string;

  /**
   * Whether termination protection is enabled for this stack.
   */
  public readonly terminationProtection?: boolean;

  /**
   * Whether this stack should be validated by the CLI after synthesis
   *
   * @default - false
   */
  public readonly validateOnSynth?: boolean;

  private _template: any | undefined;

  constructor(assembly: CloudAssembly, artifactId: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, artifactId, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.AwsCloudFormationStackProperties;
    if (!properties.templateFile) {
      throw new Error('Invalid CloudFormation stack artifact. Missing "templateFile" property in cloud assembly manifest');
    }
    if (!artifact.environment) {
      throw new Error('Invalid CloudFormation stack artifact. Missing environment');
    }
    this.environment = EnvironmentUtils.parse(artifact.environment);
    this.templateFile = properties.templateFile;
    this.parameters = properties.parameters ?? {};

    // We get the tags from 'properties' if available (cloud assembly format >= 6.0.0), otherwise
    // from the stack metadata
    this.tags = properties.tags ?? this.tagsFromMetadata();
    this.notificationArns = properties.notificationArns;
    this.assumeRoleArn = properties.assumeRoleArn;
    this.assumeRoleExternalId = properties.assumeRoleExternalId;
    this.assumeRoleAdditionalOptions = properties.assumeRoleAdditionalOptions;
    this.cloudFormationExecutionRoleArn = properties.cloudFormationExecutionRoleArn;
    this.stackTemplateAssetObjectUrl = properties.stackTemplateAssetObjectUrl;
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion;
    this.bootstrapStackVersionSsmParameter = properties.bootstrapStackVersionSsmParameter;
    this.terminationProtection = properties.terminationProtection;
    this.validateOnSynth = properties.validateOnSynth;
    this.lookupRole = properties.lookupRole;

    this.stackName = properties.stackName || artifactId;
    this.assets = this.findMetadataByType(cxschema.ArtifactMetadataEntryType.ASSET).map(e => e.data as cxschema.AssetMetadataEntry);

    this.displayName = this.stackName === artifactId
      ? this.hierarchicalId
      : `${this.hierarchicalId} (${this.stackName})`;

    this.name = this.stackName; // backwards compat
    this.originalName = this.stackName;
  }

  /**
   * Full path to the template file
   */
  public get templateFullPath() {
    return path.join(this.assembly.directory, this.templateFile);
  }

  /**
   * The CloudFormation template for this stack.
   */
  public get template(): any {
    if (this._template === undefined) {
      this._template = JSON.parse(fs.readFileSync(this.templateFullPath, 'utf-8'));
    }
    return this._template;
  }

  private tagsFromMetadata() {
    const ret: Record<string, string> = {};
    for (const metadataEntry of this.findMetadataByType(cxschema.ArtifactMetadataEntryType.STACK_TAGS)) {
      for (const tag of (metadataEntry.data ?? []) as cxschema.StackTagsMetadataEntry) {
        ret[tag.key] = tag.value;
      }
    }
    return ret;
  }
}

/**
 * Mark all instances of 'CloudFormationStackArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(CloudFormationStackArtifact.prototype, CLOUDFORMATION_STACK_ARTIFACT_SYM, {
  value: true,
  enumerable: false,
  writable: false,
});
