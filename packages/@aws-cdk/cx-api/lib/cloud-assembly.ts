import fs = require('fs');
import os = require('os');
import path = require('path');
import { ArtifactManifest, CloudArtifact } from './cloud-artifact';
import { CloudFormationStackArtifact } from './cloudformation-artifact';
import { topologicalSort } from './toposort';
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
   * The set of missing context information (or `undefined` if there is no missing context).
   */
  public readonly missing?: { [key: string]: MissingContext };

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
    this.missing = this.renderMissing();
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
    return this.stacks.find(a => a.id === id);
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
      result.push(CloudArtifact.from(this, name, artifact));
    }

    return topologicalSort(result, x => x.id, x => x._dependencyIDs);
  }

  private renderMissing() {
    const missing: { [key: string]: MissingContext } = { };
    for (const artifact of Object.values(this.manifest.artifacts || {})) {
      for (const [ key, m ] of Object.entries(artifact.missing || {})) {
        missing[key] = m;
      }
    }

    return Object.keys(missing).length > 0 ? missing : undefined;
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

  public build(options: BuildOptions = { }): CloudAssembly {
    const manifest: AssemblyManifest = filterUndefined({
      version: CLOUD_ASSEMBLY_VERSION,
      artifacts: this.artifacts,
      runtime: options.runtimeInfo
    });

    const manifestFilePath = path.join(this.outdir, MANIFEST_FILE);
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, undefined, 2));

    // "backwards compatibility": in order for the old CLI to tell the user they
    // need a new version, we'll emit the legacy manifest with only "version".
    // this will result in an error "CDK Toolkit >= 0.33.0 is required in order to interact with this program."
    fs.writeFileSync(path.join(this.outdir, 'cdk.out'), JSON.stringify({ version: CLOUD_ASSEMBLY_VERSION }));

    return new CloudAssembly(this.outdir);
  }
}

export interface BuildOptions {
  /**
   * Include runtime information (module versions) in manifest.
   * @default true
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
  readonly provider: string;
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
