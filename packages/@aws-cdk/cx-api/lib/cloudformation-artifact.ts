import fs = require('fs');
import path = require('path');
import { ASSET_METADATA, AssetMetadataEntry } from './assets';
import { ArtifactManifest, AwsCloudFormationStackProperties, CloudArtifact } from './cloud-artifact';
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
  public readonly assets: AssetMetadataEntry[];

  /**
   * CloudFormation parameters to pass to the stack.
   */
  public readonly parameters: { [id: string]: string };

  /**
   * The name of this stack.
   */
  public readonly name: string;

  /**
   * The environment into which to deploy this artifact.
   */
  public readonly environment: Environment;

  constructor(assembly: CloudAssembly, name: string, artifact: ArtifactManifest) {
    super(assembly, name, artifact);

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

    this.name = this.originalName = name;
    this.template = JSON.parse(fs.readFileSync(path.join(this.assembly.directory, this.templateFile), 'utf-8'));
    this.assets = this.findMetadataByType(ASSET_METADATA).map(e => e.data);
  }
}
