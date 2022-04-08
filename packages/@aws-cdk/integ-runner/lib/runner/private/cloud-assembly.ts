import * as path from 'path';
import { AssemblyManifest, Manifest, ArtifactType, AwsCloudFormationStackProperties, ArtifactManifest, MetadataEntry } from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';

/**
 * Reads a Cloud Assembly manifest
 */
export class AssemblyManifestReader {
  public static readonly DEFAULT_FILENAME = 'manifest.json';

  /**
   * Reads a Cloud Assembly manifest from a file
   */
  public static fromFile(fileName: string): AssemblyManifestReader {
    try {
      const obj = Manifest.loadAssemblyManifest(fileName);
      return new AssemblyManifestReader(path.dirname(fileName), obj, fileName);

    } catch (e) {
      throw new Error(`Cannot read integ manifest '${fileName}': ${e.message}`);
    }
  }

  /**
   * Reads a Cloud Assembly manifest from a file or a directory
   * If the given filePath is a directory then it will look for
   * a file within the directory with the DEFAULT_FILENAME
   */
  public static fromPath(filePath: string): AssemblyManifestReader {
    let st;
    try {
      st = fs.statSync(filePath);
    } catch (e) {
      throw new Error(`Cannot read integ manifest at '${filePath}': ${e.message}`);
    }
    if (st.isDirectory()) {
      return AssemblyManifestReader.fromFile(path.join(filePath, AssemblyManifestReader.DEFAULT_FILENAME));
    }
    return AssemblyManifestReader.fromFile(filePath);
  }

  /**
   * The directory where the manifest was found
   */
  public readonly directory: string;

  constructor(directory: string, private readonly manifest: AssemblyManifest, private readonly manifestFileName: string) {
    this.directory = directory;
  }

  /**
   * Get the stacks from the manifest
   * returns a map of artifactId to CloudFormation template
   */
  public get stacks(): Record<string, any> {
    const stacks: Record<string, any> = {};
    for (const [artifactId, artifact] of Object.entries(this.manifest.artifacts ?? {})) {
      if (artifact.type !== ArtifactType.AWS_CLOUDFORMATION_STACK) { continue; }
      const props = artifact.properties as AwsCloudFormationStackProperties;

      const template = fs.readJSONSync(path.resolve(this.directory, props.templateFile));
      stacks[artifactId] = template;
    }
    return stacks;
  }

  /**
   * Clean the manifest of any unneccesary data. Currently that includes
   * the metadata trace information since this includes trace information like
   * file system locations and file lines that will change depending on what machine the test is run on
   */
  public cleanManifest(): void {
    const newManifest = {
      ...this.manifest,
      artifacts: this.renderArtifacts(),
    };
    Manifest.saveAssemblyManifest(newManifest, this.manifestFileName);
  }

  private renderArtifactMetadata(metadata: { [id: string]: MetadataEntry[] } | undefined): { [id: string]: MetadataEntry[] } {
    const newMetadata: { [id: string]: MetadataEntry[] } = {};
    for (const [metadataId, metadataEntry] of Object.entries(metadata ?? {})) {
      newMetadata[metadataId] = metadataEntry.map((meta: MetadataEntry) => {
        // return metadata without the trace data
        return {
          type: meta.type,
          data: meta.data,
        };
      });
    }
    return newMetadata;
  }

  private renderArtifacts(): { [id: string]: ArtifactManifest } | undefined {
    const newArtifacts: { [id: string]: ArtifactManifest } = {};
    for (const [artifactId, artifact] of Object.entries(this.manifest.artifacts ?? {})) {
      newArtifacts[artifactId] = {
        ...artifact,
        metadata: this.renderArtifactMetadata(artifact.metadata),
      };
    }
    return newArtifacts;
  }
}
