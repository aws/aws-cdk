import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs';
import * as path from 'path';
import { CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';
import { Environment, EnvironmentUtils } from './environment';

export class CloudFormationStackArtifact extends CloudArtifact {
  /**
   * The CloudFormation template for this stack.
   */
  public readonly template: any;

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
   * The physical name of this stack.
   */
  public readonly stackName: string;

  /**
   * A string that represents this stack. Should only be used in user interfaces.
   * If the stackName and artifactId are the same, it will just return that. Otherwise,
   * it will return something like "<artifactId> (<stackName>)"
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
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  public readonly cloudFormationExecutionRoleArn?: string;

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
   * Whether termination protection is enabled for this stack.
   */
  public readonly terminationProtection?: boolean;

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
    this.parameters = properties.parameters || { };
    this.assumeRoleArn = properties.assumeRoleArn;
    this.cloudFormationExecutionRoleArn = properties.cloudFormationExecutionRoleArn;
    this.stackTemplateAssetObjectUrl = properties.stackTemplateAssetObjectUrl;
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion;
    this.terminationProtection = properties.terminationProtection;

    this.stackName = properties.stackName || artifactId;
    this.template = JSON.parse(fs.readFileSync(path.join(this.assembly.directory, this.templateFile), 'utf-8'));
    this.assets = this.findMetadataByType(cxschema.ArtifactMetadataEntryType.ASSET).map(e => e.data as cxschema.AssetMetadataEntry);

    this.displayName = this.stackName === artifactId
      ? this.stackName
      : `${artifactId} (${this.stackName})`;

    this.name = this.stackName; // backwards compat
    this.originalName = this.stackName;
  }
}
