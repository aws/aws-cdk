import { ASSET_METADATA, AssetMetadataEntry } from './assets';
import { Artifact, AwsCloudFormationStackProperties, CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';

export class CloudFormationStackArtifact extends CloudArtifact {
  public readonly template: any;
  public readonly originalName: string;
  public readonly logicalIdToPathMap: { [logicalId: string]: string };
  public readonly assets: AssetMetadataEntry[];

  public name: string;

  constructor(assembly: CloudAssembly, name: string, artifact: Artifact) {
    super(assembly, name, artifact);

    if (!artifact.properties || !artifact.properties.templateFile) {
      throw new Error(`Invalid CloudFormation stack artifact. Missing "templateFile" property in cloud assembly manifest`);
    }

    const properties = this.properties as AwsCloudFormationStackProperties;
    this.template = this.assembly.readJson(properties.templateFile);
    this.originalName = name;
    this.name = this.originalName;
    this.logicalIdToPathMap = this.buildLogicalToPathMap();
    this.assets = this.buildAssets();
  }

  private buildAssets() {
    const assets = new Array<AssetMetadataEntry>();

    for (const k of Object.keys(this.metadata)) {
      for (const entry of this.metadata[k]) {
        if (entry.type === ASSET_METADATA) {
          assets.push(entry.data);
        }
      }
    }

    return assets;
  }

  private buildLogicalToPathMap() {
    const map: { [id: string]: string } = {};
    for (const cpath of Object.keys(this.metadata)) {
      const md = this.metadata[cpath];
      for (const e of md) {
        if (e.type === 'aws:cdk:logicalId') {
          const logical = e.data;
          map[logical] = cpath;
        }
      }
    }
    return map;
  }
}
