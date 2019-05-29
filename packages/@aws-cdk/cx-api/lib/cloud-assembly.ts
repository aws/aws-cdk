import fs = require('fs');
import os = require('os');
import path = require('path');
import { Artifact, CloudArtifact } from './cloud-artifact';
import { CloudFormationStackArtifact } from './cloudformation-artifact';
import { topologicalSort } from './toposort';
import { CLOUD_ASSEMBLY_VERSION, verifyManifestVersion } from './versioning';

export interface AssemblyManifest {
  /**
   * Protocol version
   */
  readonly version: string;

  /**
   * The set of artifacts in this assembly.
   */
  readonly artifacts?: { [id: string]: Artifact };

  /**
   * Runtime information.
   */
  readonly runtime?: RuntimeInfo;
}

/**
 * The name of the root manifest file of the assembly.
 */
const MANIFEST_FILE = 'manifest.json';

export class CloudAssembly {
  public readonly artifacts: CloudArtifact[];
  public readonly version: string;
  public readonly missing?: { [key: string]: MissingContext };
  public readonly runtime: RuntimeInfo;
  public readonly manifest: AssemblyManifest;

  constructor(public readonly directory: string) {
    this.manifest = this.readJson(MANIFEST_FILE);

    this.version = this.manifest.version;
    verifyManifestVersion(this.version);

    this.artifacts = this.renderArtifacts();
    this.missing = this.renderMissing();
    this.runtime = this.manifest.runtime || { libraries: { } };

    // force validation of deps by accessing 'depends' on all artifacts
    this.validateDeps();
  }

  public tryGetArtifact(id: string): CloudArtifact | undefined {
    return this.stacks.find(a => a.id === id);
  }

  public getStack(id: string): CloudFormationStackArtifact {
    const artifact = this.tryGetArtifact(id);
    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${id}"`);
    }

    if (!(artifact instanceof CloudFormationStackArtifact)) {
      throw new Error(`Artifact ${id} is not a CloudFormation stack`);
    }

    return artifact;
  }

  public readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(path.join(this.directory, filePath), 'utf-8'));
  }

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
      ignore(artifact.depends);
    }
  }

  private renderArtifacts() {
    const result = new Array<CloudArtifact>();
    for (const [ name, artifact ] of Object.entries(this.manifest.artifacts || { })) {
      result.push(CloudArtifact.from(this, name, artifact));
    }

    return topologicalSort(result, x => x.id, x => x.dependsIDs);
  }

  private renderMissing() {
    const missing: { [key: string]: MissingContext } = { };
    for (const artifact of this.artifacts) {
      for (const [ key, m ] of Object.entries(artifact.missing)) {
        missing[key] = m;
      }
    }

    return Object.keys(missing).length > 0 ? missing : undefined;
  }
}

export class CloudAssemblyBuilder {
  public readonly outdir: string;

  private readonly artifacts: { [id: string]: Artifact } = { };

  constructor(outdir?: string) {
    this.outdir = outdir || fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out'));

    // we leverage the fact that outdir is long-lived to avoid staging assets into it
    // that were already staged (copying can be expensive). this is achieved by the fact
    // that assets use a source hash as their name. other artifacts, and the manifest,
    // will overwrite existing files as needed.

    if (fs.existsSync(this.outdir)) {
      if (!fs.statSync(this.outdir).isDirectory()) {
        throw new Error(`${this.outdir} must be a directory`);
      }
    } else {
      fs.mkdirSync(this.outdir);
    }
  }

  public addArtifact(name: string, artifact: Artifact) {
    this.artifacts[name] = filterUndefined(artifact);
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