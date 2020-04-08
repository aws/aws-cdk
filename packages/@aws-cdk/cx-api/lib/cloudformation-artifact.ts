import * as fs from 'fs';
import * as path from 'path';
import { ASSET_METADATA, AssetMetadataEntry } from './assets';
import { ArtifactManifest, AwsCloudFormationStackProperties, CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';
import { Environment, EnvironmentUtils } from './environment';

export class CloudFormationStackArtifact extends CloudArtifact {
  /**
   * Insert this into the deployment role ARNs to be replaced with the current region
   */
  public static readonly CURRENT_REGION = '${AWS::Region}';

  /**
   * Insert this into the deployment role ARNs to be replaced with the current account
   */
  public static readonly CURRENT_ACCOUNT = '${AWS::AccountId}';

  /**
   * Insert this into the deployment role ARNs to be replaced with the current partition
   */
  public static readonly CURRENT_PARTITION = '${AWS::Partition}';

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
  public readonly assets: AssetMetadataEntry[];

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

  constructor(assembly: CloudAssembly, artifactId: string, artifact: ArtifactManifest) {
    super(assembly, artifactId, artifact);

    if (!artifact.properties || !artifact.properties.templateFile) {
      throw new Error(`Invalid CloudFormation stack artifact. Missing "templateFile" property in cloud assembly manifest`);
    }
    if (!artifact.environment) {
      throw new Error('Invalid CloudFormation stack artifact. Missing environment');
    }
    this.environment = EnvironmentUtils.parse(artifact.environment);
    const properties = (this.manifest.properties || {}) as AwsCloudFormationStackProperties;
    this.templateFile = properties.templateFile;
    this.parameters = properties.parameters || { };
    this.assumeRoleArn = properties.assumeRoleArn;
    this.cloudFormationExecutionRoleArn = properties.cloudFormationExecutionRoleArn;

    this.stackName = properties.stackName || artifactId;
    this.template = JSON.parse(fs.readFileSync(path.resolve(this.assembly.directory, this.templateFile), 'utf-8'));
    this.assets = this.findMetadataByType(ASSET_METADATA).map(e => e.data);

    this.displayName = this.stackName === artifactId
      ? this.stackName
      : `${artifactId} (${this.stackName})`;

    this.name = this.stackName; // backwards compat
    this.originalName = this.stackName;
  }
}
