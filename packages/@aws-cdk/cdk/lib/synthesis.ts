import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import os = require('os');
import path = require('path');
import { collectRuntimeInformation } from './runtime-info';

export interface ISynthesizable {
  synthesize(session: ISynthesisSession): void;
}

export interface ISynthesisSession {
  readonly store: ISessionStore;
  readonly manifest: cxapi.AssemblyManifest;
  addArtifact(id: string, droplet: cxapi.Artifact): void;
  addBuildStep(id: string, step: cxapi.BuildStep): void;
  tryGetArtifact(id: string): cxapi.Artifact | undefined;
}

export interface SynthesisSessionOptions {
  /**
   * The file store used for this session.
   */
  store: ISessionStore;

  /**
   * Emit the legacy manifest (`cdk.out`) when the session is closed (alongside `manifest.json`).
   * @default false
   */
  legacyManifest?: boolean;

  /**
   * Include runtime information (module versions) in manifest.
   * @default true
   */
  runtimeInformation?: boolean;
}

export class SynthesisSession implements ISynthesisSession {
  /**
   * @returns true if `obj` implements `ISynthesizable`.
   */
  public static isSynthesizable(obj: any): obj is ISynthesizable {
    return 'synthesize' in obj;
  }

  public readonly store: ISessionStore;

  private readonly artifacts: { [id: string]: cxapi.Artifact } = { };
  private readonly buildSteps: { [id: string]: cxapi.BuildStep } = { };
  private _manifest?: cxapi.AssemblyManifest;
  private readonly legacyManifest: boolean;
  private readonly runtimeInfo: boolean;

  constructor(options: SynthesisSessionOptions) {
    this.store = options.store;
    this.legacyManifest = options.legacyManifest !== undefined ? options.legacyManifest : false;
    this.runtimeInfo = options.runtimeInformation !== undefined ? options.runtimeInformation : true;
  }

  public get manifest() {
    if (!this._manifest) {
      throw new Error(`Cannot read assembly manifest before the session has been finalized`);
    }

    return this._manifest;
  }

  public addArtifact(id: string, artifact: cxapi.Artifact): void {
    cxapi.validateArtifact(artifact);
    this.artifacts[id] = artifact;
  }

  public tryGetArtifact(id: string): cxapi.Artifact | undefined {
    return this.artifacts[id];
  }

  public addBuildStep(id: string, step: cxapi.BuildStep) {
    if (id in this.buildSteps) {
      throw new Error(`Build step ${id} already exists`);
    }
    this.buildSteps[id] = step;
  }

  public close(): cxapi.AssemblyManifest {
    const manifest: cxapi.AssemblyManifest = this._manifest = {
      version: cxapi.PROTO_RESPONSE_VERSION,
      artifacts: this.artifacts,
    };

    if (this.runtimeInfo) {
      manifest.runtime = collectRuntimeInformation();
    }

    this.store.writeFile(cxapi.MANIFEST_FILE, JSON.stringify(manifest, undefined, 2));

    // write build manifest if we have build steps
    if (Object.keys(this.buildSteps).length > 0) {
      const buildManifest: cxapi.BuildManifest = {
        steps: this.buildSteps
      };

      this.store.writeFile(cxapi.BUILD_FILE, JSON.stringify(buildManifest, undefined, 2));
    }

    if (this.legacyManifest) {
      const legacy: cxapi.SynthesizeResponse = {
        ...manifest,
        stacks: renderLegacyStacks(this.artifacts, this.store)
      };

      // render the legacy manifest (cdk.out) which also contains a "stacks" attribute with all the rendered stacks.
      this.store.writeFile(cxapi.OUTFILE_NAME, JSON.stringify(legacy, undefined, 2));
    }

    return manifest;
  }
}

export interface ISessionStore {
  /**
   * Creates a directory and returns it's full path.
   * @param directoryName The name of the directory to create.
   * @throws if a directory by that name already exists in the session or if the session has already been finalized.
   */
  mkdir(directoryName: string): string;

  /**
   * Returns the list of files in a directory.
   * @param directoryName The name of the artifact
   * @throws if there is no directory artifact under this name
   */
  readdir(directoryName: string): string[];

  /**
   * Writes a file into the store.
   * @param artifactName The name of the file.
   * @param data The contents of the file.
   */
  writeFile(artifactName: string, data: any): void;

  /**
   * Writes a formatted JSON output file to the store
   * @param artifactName the name of the artifact
   * @param json the JSON object
   */
  writeJson(artifactName: string, json: any): void;

  /**
   * Reads a file from the store.
   * @param fileName The name of the file.
   * @throws if the file is not found
   */
  readFile(fileName: string): any;

  /**
   * Reads a JSON object from the store.
   */
  readJson(fileName: string): any;

  /**
   * @returns true if the file `fileName` exists in the store.
   * @param name The name of the file or directory to look up.
   */
  exists(name: string): boolean;

  /**
   * List all top-level files that were emitted to the store.
   */
  list(): string[];

  /**
   * Do not allow further writes into the store.
   */
  finalize(): void;
}

export interface SynthesisSessionOptions {
  /**
   * Where to store the
   */
  store: ISessionStore;
}

export interface FileSystemStoreOptions {
  /**
   * The output directory for synthesis artifacts
   */
  outdir: string;
}

/**
 * Can be used to prepare and emit synthesis artifacts into an output directory.
 */
export class FileSystemStore implements ISessionStore {
  private readonly outdir: string;
  private locked = false;

  constructor(options: FileSystemStoreOptions) {
    this.outdir = options.outdir;
    return;
  }

  public writeFile(fileName: string, data: any) {
    this.canWrite(fileName);

    const p = this.pathForArtifact(fileName);
    fs.writeFileSync(p, data);
  }

  public writeJson(fileName: string, json: any) {
    this.writeFile(fileName, JSON.stringify(json, undefined, 2));
  }

  public readFile(fileName: string): any {
    const p = this.pathForArtifact(fileName);
    if (!fs.existsSync(p)) {
      throw new Error(`File not found: ${p}`);
    }

    return fs.readFileSync(p);
  }

  public readJson(fileName: string): any {
    return JSON.parse(this.readFile(fileName).toString());
  }

  public exists(name: string): boolean {
    const p = this.pathForArtifact(name);
    return fs.existsSync(p);
  }

  public mkdir(directoryName: string): string {
    this.canWrite(directoryName);
    const p = this.pathForArtifact(directoryName);
    fs.mkdirSync(p);
    return p;
  }

  public readdir(directoryName: string): string[] {
    if (!this.exists(directoryName)) {
      throw new Error(`${directoryName} not found`);
    }

    const p = this.pathForArtifact(directoryName);
    return fs.readdirSync(p);
  }

  public list(): string[] {
    return fs.readdirSync(this.outdir).sort();
  }

  public finalize() {
    this.locked = true;
  }

  private pathForArtifact(id: string) {
    return path.join(this.outdir, id);
  }

  private canWrite(artifactName: string) {
    if (this.exists(artifactName)) {
      throw new Error(`An artifact named ${artifactName} was already written to this session`);
    }
    if (this.locked) {
      throw new Error('Session has already been finalized');
    }
  }
}

export class InMemoryStore implements ISessionStore {
  private files: { [fileName: string]: any } = { };
  private dirs: { [dirName: string]: string } = { }; // value is path to a temporary directory

  private locked = false;

  public writeFile(fileName: string, data: any): void {
    this.canWrite(fileName);
    this.files[fileName] = data;
  }

  public writeJson(fileName: string, json: any): void {
    this.writeFile(fileName, JSON.stringify(json, undefined, 2));
  }

  public readFile(fileName: string) {
    if (!(fileName in this.files)) {
      throw new Error(`${fileName} not found`);
    }
    return this.files[fileName];
  }

  public readJson(fileName: string): any {
    return JSON.parse(this.readFile(fileName).toString());
  }

  public exists(name: string) {
    return name in this.files || name in this.dirs;
  }

  public mkdir(directoryName: string): string {
    this.canWrite(directoryName);

    const p = fs.mkdtempSync(path.join(os.tmpdir(), directoryName));
    this.dirs[directoryName] = p;
    return p;
  }

  public readdir(directoryName: string): string[] {
    if (!this.exists(directoryName)) {
      throw new Error(`${directoryName} not found`);
    }

    const p = this.dirs[directoryName];
    return fs.readdirSync(p);
  }

  public list(): string[] {
    return [ ...Object.keys(this.files), ...Object.keys(this.dirs) ].sort();
  }

  public finalize() {
    this.locked = true;
  }

  private canWrite(artifactName: string) {
    if (this.exists(artifactName)) {
      throw new Error(`An artifact named ${artifactName} was already written to this session`);
    }
    if (this.locked) {
      throw new Error('Session has already been finalized');
    }
  }
}

function renderLegacyStacks(artifacts: { [id: string]: cxapi.Artifact }, store: ISessionStore) {
  // special case for backwards compat. build a list of stacks for the manifest
  const stacks = new Array<cxapi.SynthesizedStack>();

  for (const [ id, artifact ] of Object.entries(artifacts)) {
    if (artifact.type === cxapi.ArtifactType.AwsCloudFormationStack) {
      const templateFile = artifact.properties && artifact.properties.templateFile;
      if (!templateFile) {
        throw new Error(`Invalid cloudformation artifact. Missing "template" property`);
      }
      const template = store.readJson(templateFile);

      const match = cxapi.AWS_ENV_REGEX.exec(artifact.environment);
      if (!match) {
        throw new Error(`"environment" must match regex: ${cxapi.AWS_ENV_REGEX}`);
      }

      const synthStack: cxapi.SynthesizedStack = {
        name: id,
        environment: { name: artifact.environment.substr('aws://'.length), account: match[1], region: match[2] },
        template,
        metadata: artifact.metadata || {},
      };

      if (artifact.dependencies && artifact.dependencies.length > 0) {
        synthStack.dependsOn = artifact.dependencies;
      }

      if (artifact.missing) {
        synthStack.missing = artifact.missing;
      }

      stacks.push(synthStack);
    }
  }

  return stacks;
}