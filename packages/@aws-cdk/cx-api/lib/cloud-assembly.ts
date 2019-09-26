import fs = require('fs');
import os = require('os');
import path = require('path');
import { ArtifactManifest, ArtifactType, CloudArtifact } from './cloud-artifact';
import { CloudFormationStackArtifact } from './cloudformation-artifact';
import { topologicalSort } from './toposort';
import { TreeCloudArtifact } from './tree-cloud-artifact';
import { CLOUD_ASSEMBLY_VERSION, verifyManifestVersion } from './versioning';

/**
 * A manifest which describes the cloud assembly.
 */
export interface AssemblyManifest {
  /**
   * Protocol version
   */
  readonly version: string;

  /**
   * The set of artifacts in this assembly.
   */
  readonly artifacts?: { [id: string]: ArtifactManifest };

  /**
   * Missing context information. If this field has values, it means that the
   * cloud assembly is not complete and should not be deployed.
   */
  readonly missing?: MissingContext[];

  /**
   * Runtime information.
   */
  readonly runtime?: RuntimeInfo;
}

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
  public readonly runtime: RuntimeInfo;

  /**
   * The raw assembly manifest.
   */
  public readonly manifest: AssemblyManifest;

  /**
   * Reads a cloud assembly from the specified directory.
   * @param directory The root directory of the assembly.
   */
  constructor(directory: string) {
    this.directory = directory;
    this.manifest = JSON.parse(fs.readFileSync(path.join(directory, MANIFEST_FILE), 'UTF-8'));

    this.version = this.manifest.version;
    verifyManifestVersion(this.version);

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
   * @param stackName the name of the CloudFormation stack.
   * @throws if there is no stack artifact by that name
   * @returns a `CloudFormationStackArtifact` object.
   */
  public getStack(stackName: string): CloudFormationStackArtifact {
    const artifact = this.tryGetArtifact(stackName);
    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${stackName}"`);
    }

    if (!(artifact instanceof CloudFormationStackArtifact)) {
      throw new Error(`Artifact ${stackName} is not a CloudFormation stack`);
    }

    return artifact;
  }

  /**
   * Returns the tree metadata artifact from this assembly.
   * @throws if there is no metadata artifact by that name
   * @returns a `TreeCloudArtifact` object if there is one defined in the manifest, `undefined` otherwise.
   */
  public tree(): TreeCloudArtifact | undefined {
    const trees = this.artifacts.filter(a => a.manifest.type === ArtifactType.CDK_TREE);
    if (trees.length === 0) {
      return undefined;
    } else if (trees.length > 1) {
      throw new Error(`Multiple artifacts of type ${ArtifactType.CDK_TREE} found in manifest`);
    }
    const tree = trees[0];

    if (!(tree instanceof TreeCloudArtifact)) {
      throw new Error(`"Tree" artifact is not of expected type`);
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

  private readonly artifacts: { [id: string]: ArtifactManifest } = { };
  private readonly missing = new Array<MissingContext>();

  /**
   * Initializes a cloud assembly builder.
   * @param outdir The output directory, uses temporary directory if undefined
   */
  constructor(outdir?: string) {
    this.outdir = outdir || fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out'));

    // we leverage the fact that outdir is long-lived to avoid staging assets into it
    // that were already staged (copying can be expensive). this is achieved by the fact
    // that assets use a source hash as their name. other artifacts, and the manifest itself,
    // will overwrite existing files as needed.

    if (fs.existsSync(this.outdir)) {
      if (!fs.statSync(this.outdir).isDirectory()) {
        throw new Error(`${this.outdir} must be a directory`);
      }
    } else {
      fs.mkdirSync(this.outdir);
    }
  }

  /**
   * Adds an artifact into the cloud assembly.
   * @param id The ID of the artifact.
   * @param manifest The artifact manifest
   */
  public addArtifact(id: string, manifest: ArtifactManifest) {
    this.artifacts[id] = filterUndefined(manifest);
  }

  /**
   * Reports that some context is missing in order for this cloud assembly to be fully synthesized.
   * @param missing Missing context information.
   */
  public addMissing(missing: MissingContext) {
    this.missing.push(missing);
  }

  /**
   * Finalizes the cloud assembly into the output directory returns a
   * `CloudAssembly` object that can be used to inspect the assembly.
   * @param options
   */
  public buildAssembly(options: AssemblyBuildOptions = { }): CloudAssembly {
    const manifest: AssemblyManifest = filterUndefined({
      version: CLOUD_ASSEMBLY_VERSION,
      artifacts: this.artifacts,
      runtime: options.runtimeInfo,
      missing: this.missing.length > 0 ? this.missing : undefined
    });

    const manifestFilePath = path.join(this.outdir, MANIFEST_FILE);
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, undefined, 2));

    // "backwards compatibility": in order for the old CLI to tell the user they
    // need a new version, we'll emit the legacy manifest with only "version".
    // this will result in an error "CDK Toolkit >= CLOUD_ASSEMBLY_VERSION is required in order to interact with this program."
    fs.writeFileSync(path.join(this.outdir, 'cdk.out'), JSON.stringify({ version: CLOUD_ASSEMBLY_VERSION }));

    return new CloudAssembly(this.outdir);
  }
}

export interface AssemblyBuildOptions {
  /**
   * Include the specified runtime information (module versions) in manifest.
   * @default - if this option is not specified, runtime info will not be included
   */
  readonly runtimeInfo?: RuntimeInfo;
}

/**
 * Information about the application's runtime components.
 */
export interface RuntimeInfo {
  /**
   * The list of libraries loaded in the application, associated with their versions.
   */
  readonly libraries: { [name: string]: string };
}

/**
 * Represents a missing piece of context.
 */
export interface MissingContext {
  /**
   * The missing context key.
   */
  readonly key: string;

  /**
   * The provider from which we expect this context key to be obtained.
   */
  readonly provider: string;

  /**
   * A set of provider-specific options.
   */
  readonly props: {
    account?: string;
    region?: string;
    [key: string]: any;
  };
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
