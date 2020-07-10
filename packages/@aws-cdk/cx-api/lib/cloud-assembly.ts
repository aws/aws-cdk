import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudFormationStackArtifact } from './artifacts/cloudformation-artifact';
import { NestedCloudAssemblyArtifact } from './artifacts/nested-cloud-assembly-artifact';
import { TreeCloudArtifact } from './artifacts/tree-cloud-artifact';
import { CloudArtifact } from './cloud-artifact';
import { topologicalSort } from './toposort';

/**
 * The name of the root manifest file of the assembly.
 */
const MANIFEST_FILE = 'manifest.json';

/**
 * Represents a deployable cloud application.
 */
export class CloudAssembly {
  /**
   * The root directory of the cloud assembly.
   */
  public readonly directory: string;

  /**
   * The schema version of the assembly manifest.
   */
  public readonly version: string;

  /**
   * All artifacts included in this assembly.
   */
  public readonly artifacts: CloudArtifact[];

  /**
   * Runtime information such as module versions used to synthesize this assembly.
   */
  public readonly runtime: cxschema.RuntimeInfo;

  /**
   * The raw assembly manifest.
   */
  public readonly manifest: cxschema.AssemblyManifest;

  /**
   * Reads a cloud assembly from the specified directory.
   * @param directory The root directory of the assembly.
   */
  constructor(directory: string) {
    this.directory = directory;

    this.manifest = cxschema.Manifest.load(path.join(directory, MANIFEST_FILE));
    this.version = this.manifest.version;
    this.artifacts = this.renderArtifacts();
    this.runtime = this.manifest.runtime || { libraries: { } };

    // force validation of deps by accessing 'depends' on all artifacts
    this.validateDeps();
  }

  /**
   * Attempts to find an artifact with a specific identity.
   * @returns A `CloudArtifact` object or `undefined` if the artifact does not exist in this assembly.
   * @param id The artifact ID
   */
  public tryGetArtifact(id: string): CloudArtifact | undefined {
    return this.artifacts.find(a => a.id === id);
  }

  /**
   * Returns a CloudFormation stack artifact from this assembly.
   *
   * Will only search the current assembly.
   *
   * @param stackName the name of the CloudFormation stack.
   * @throws if there is no stack artifact by that name
   * @throws if there is more than one stack with the same stack name. You can
   * use `getStackArtifact(stack.artifactId)` instead.
   * @returns a `CloudFormationStackArtifact` object.
   */
  public getStackByName(stackName: string): CloudFormationStackArtifact {
    const artifacts = this.artifacts.filter(a => a instanceof CloudFormationStackArtifact && a.stackName === stackName);
    if (!artifacts || artifacts.length === 0) {
      throw new Error(`Unable to find stack with stack name "${stackName}"`);
    }

    if (artifacts.length > 1) {
      // eslint-disable-next-line max-len
      throw new Error(`There are multiple stacks with the stack name "${stackName}" (${artifacts.map(a => a.id).join(',')}). Use "getStackArtifact(id)" instead`);
    }

    return artifacts[0] as CloudFormationStackArtifact;
  }

  /**
   * Returns a CloudFormation stack artifact by name from this assembly.
   * @deprecated renamed to `getStackByName` (or `getStackArtifact(id)`)
   */
  public getStack(stackName: string) {
    return this.getStackByName(stackName);
  }

  /**
   * Returns a CloudFormation stack artifact from this assembly.
   *
   * @param artifactId the artifact id of the stack (can be obtained through `stack.artifactId`).
   * @throws if there is no stack artifact with that id
   * @returns a `CloudFormationStackArtifact` object.
   */
  public getStackArtifact(artifactId: string): CloudFormationStackArtifact {
    const artifact = this.tryGetArtifact(artifactId);
    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${artifactId}"`);
    }

    if (!(artifact instanceof CloudFormationStackArtifact)) {
      throw new Error(`Artifact ${artifactId} is not a CloudFormation stack`);
    }

    return artifact;
  }

  /**
   * Returns a nested assembly artifact.
   *
   * @param artifactId The artifact ID of the nested assembly
   */
  public getNestedAssemblyArtifact(artifactId: string): NestedCloudAssemblyArtifact {
    const artifact = this.tryGetArtifact(artifactId);
    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${artifactId}"`);
    }

    if (!(artifact instanceof NestedCloudAssemblyArtifact)) {
      throw new Error(`Found artifact '${artifactId}' but it's not a nested cloud assembly`);
    }

    return artifact;
  }

  /**
   * Returns a nested assembly.
   *
   * @param artifactId The artifact ID of the nested assembly
   */
  public getNestedAssembly(artifactId: string): CloudAssembly {
    return this.getNestedAssemblyArtifact(artifactId).nestedAssembly;
  }

  /**
   * Returns the tree metadata artifact from this assembly.
   * @throws if there is no metadata artifact by that name
   * @returns a `TreeCloudArtifact` object if there is one defined in the manifest, `undefined` otherwise.
   */
  public tree(): TreeCloudArtifact | undefined {
    const trees = this.artifacts.filter(a => a.manifest.type === cxschema.ArtifactType.CDK_TREE);
    if (trees.length === 0) {
      return undefined;
    } else if (trees.length > 1) {
      throw new Error(`Multiple artifacts of type ${cxschema.ArtifactType.CDK_TREE} found in manifest`);
    }
    const tree = trees[0];

    if (!(tree instanceof TreeCloudArtifact)) {
      throw new Error('"Tree" artifact is not of expected type');
    }

    return tree;
  }

  /**
   * @returns all the CloudFormation stack artifacts that are included in this assembly.
   */
  public get stacks(): CloudFormationStackArtifact[] {
    const result = new Array<CloudFormationStackArtifact>();
    for (const a of this.artifacts) {
      if (a instanceof CloudFormationStackArtifact) {
        result.push(a);
      }
    }
    return result;
  }

  private validateDeps() {
    for (const artifact of this.artifacts) {
      ignore(artifact.dependencies);
    }
  }

  private renderArtifacts() {
    const result = new Array<CloudArtifact>();
    for (const [ name, artifact ] of Object.entries(this.manifest.artifacts || { })) {
      const cloudartifact = CloudArtifact.fromManifest(this, name, artifact);
      if (cloudartifact) {
        result.push(cloudartifact);
      }
    }

    return topologicalSort(result, x => x.id, x => x._dependencyIDs);
  }
}

/**
 * Can be used to build a cloud assembly.
 */
export class CloudAssemblyBuilder {
  /**
   * The root directory of the resulting cloud assembly.
   */
  public readonly outdir: string;

  private readonly artifacts: { [id: string]: cxschema.ArtifactManifest } = { };
  private readonly missing = new Array<cxschema.MissingContext>();

  /**
   * Initializes a cloud assembly builder.
   * @param outdir The output directory, uses temporary directory if undefined
   */
  constructor(outdir?: string) {
    this.outdir = determineOutputDirectory(outdir);

    // we leverage the fact that outdir is long-lived to avoid staging assets into it
    // that were already staged (copying can be expensive). this is achieved by the fact
    // that assets use a source hash as their name. other artifacts, and the manifest itself,
    // will overwrite existing files as needed.

    if (fs.existsSync(this.outdir)) {
      if (!fs.statSync(this.outdir).isDirectory()) {
        throw new Error(`${this.outdir} must be a directory`);
      }
    } else {
      fs.mkdirSync(this.outdir, { recursive: true });
    }
  }

  /**
   * Adds an artifact into the cloud assembly.
   * @param id The ID of the artifact.
   * @param manifest The artifact manifest
   */
  public addArtifact(id: string, manifest: cxschema.ArtifactManifest) {
    this.artifacts[id] = filterUndefined(manifest);
  }

  /**
   * Reports that some context is missing in order for this cloud assembly to be fully synthesized.
   * @param missing Missing context information.
   */
  public addMissing(missing: cxschema.MissingContext) {
    if (this.missing.every(m => m.key !== missing.key)) {
      this.missing.push(missing);
    }
  }

  /**
   * Finalizes the cloud assembly into the output directory returns a
   * `CloudAssembly` object that can be used to inspect the assembly.
   * @param options
   */
  public buildAssembly(options: AssemblyBuildOptions = { }): CloudAssembly {

    // explicitly initializing this type will help us detect
    // breaking changes. (For example adding a required property will break compilation).
    let manifest: cxschema.AssemblyManifest = {
      version: cxschema.Manifest.version(),
      artifacts: this.artifacts,
      runtime: options.runtimeInfo,
      missing: this.missing.length > 0 ? this.missing : undefined,
    };

    // now we can filter
    manifest = filterUndefined(manifest);

    const manifestFilePath = path.join(this.outdir, MANIFEST_FILE);
    cxschema.Manifest.save(manifest, manifestFilePath);

    // "backwards compatibility": in order for the old CLI to tell the user they
    // need a new version, we'll emit the legacy manifest with only "version".
    // this will result in an error "CDK Toolkit >= CLOUD_ASSEMBLY_VERSION is required in order to interact with this program."
    fs.writeFileSync(path.join(this.outdir, 'cdk.out'), JSON.stringify({ version: manifest.version }));

    return new CloudAssembly(this.outdir);
  }

  /**
   * Creates a nested cloud assembly
   */
  public createNestedAssembly(artifactId: string, displayName: string) {
    const directoryName = artifactId;
    const innerAsmDir = path.join(this.outdir, directoryName);

    this.addArtifact(artifactId, {
      type: cxschema.ArtifactType.NESTED_CLOUD_ASSEMBLY,
      properties: {
        directoryName,
        displayName,
      } as cxschema.NestedCloudAssemblyProperties,
    });

    return new CloudAssemblyBuilder(innerAsmDir);
  }
}

/**
 * Backwards compatibility for when `RuntimeInfo`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.synth
 */
export interface RuntimeInfo extends cxschema.RuntimeInfo {

}

/**
 * Backwards compatibility for when `MetadataEntry`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.metadata
 */
export interface MetadataEntry extends cxschema.MetadataEntry {

}

/**
 * Backwards compatibility for when `MissingContext`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.Stack.reportMissingContext
 */
export interface MissingContext {
  /**
   * The missing context key.
   */
  readonly key: string;

  /**
   * The provider from which we expect this context key to be obtained.
   *
   * (This is the old untyped definition, which is necessary for backwards compatibility.
   * See cxschema for a type definition.)
   */
  readonly provider: string;

  /**
   * A set of provider-specific options.
   *
   * (This is the old untyped definition, which is necessary for backwards compatibility.
   * See cxschema for a type definition.)
   */
  readonly props: Record<string, any>;
}

export interface AssemblyBuildOptions {
  /**
   * Include the specified runtime information (module versions) in manifest.
   * @default - if this option is not specified, runtime info will not be included
   */
  readonly runtimeInfo?: RuntimeInfo;
}

/**
 * Returns a copy of `obj` without undefined values in maps or arrays.
 */
function filterUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter(x => x !== undefined).map(x => filterUndefined(x));
  }

  if (typeof(obj) === 'object') {
    const ret: any = { };
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }
      ret[key] = filterUndefined(value);
    }
    return ret;
  }

  return obj;
}

function ignore(_x: any) {
  return;
}

/**
 * Turn the given optional output directory into a fixed output directory
 */
function determineOutputDirectory(outdir?: string) {
  return outdir ?? fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out'));
}
