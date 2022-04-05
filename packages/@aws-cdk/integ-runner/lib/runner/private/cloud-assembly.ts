import * as path from 'path';
import { AssemblyManifest, Manifest, ArtifactType, AwsCloudFormationStackProperties } from '@aws-cdk/cloud-assembly-schema';
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
      return new AssemblyManifestReader(path.dirname(fileName), obj);

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

  constructor(directory: string, private readonly manifest: AssemblyManifest) {
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
}
