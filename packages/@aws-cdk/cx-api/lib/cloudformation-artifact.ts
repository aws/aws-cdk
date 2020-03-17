import * as cxprotocol from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs';
import * as path from 'path';
import { AwsCloudFormationStackProperties, CloudArtifact } from './cloud-artifact';
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
  public readonly assets: cxprotocol.AssetMetadataEntry[];

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

  constructor(assembly: CloudAssembly, artifactId: string, artifact: cxprotocol.ArtifactManifest) {
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

    this.stackName = properties.stackName || artifactId;
    this.template = JSON.parse(fs.readFileSync(path.join(this.assembly.directory, this.templateFile), 'utf-8'));
    this.assets = this.findMetadataByType(cxprotocol.ArtifactMetadataEntryType.ASSET).map(e => e.data as cxprotocol.AssetMetadataEntry);

    this.displayName = this.stackName === artifactId
      ? this.stackName
      : `${artifactId} (${this.stackName})`;

    this.name = this.stackName; // backwards compat
    this.originalName = this.stackName;
  }
}
