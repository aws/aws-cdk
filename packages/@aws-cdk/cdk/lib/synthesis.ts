import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { collectRuntimeInformation } from './runtime-info';

export interface ISynthesizable {
  synthesize(session: ISynthesisSession): void;
}

export interface ISynthesisSession {
  readonly assembly: ISessionStore;
  readonly staging: ISessionStore;
  readonly manifest: cxapi.AssemblyManifest;
  readonly path: string;
  addArtifact(id: string, droplet: cxapi.Artifact): void;
  addBuildStep(id: string, step: cxapi.BuildStep): void;
  getArtifact(id: string): cxapi.Artifact;
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

  public readonly assembly: ISessionStore;
  public readonly staging: ISessionStore;
  public readonly path: string;

  private readonly store: ISessionStore;
  private readonly artifacts: { [id: string]: cxapi.Artifact } = { };
  private readonly buildSteps: { [id: string]: cxapi.BuildStep } = { };
  private _manifest?: cxapi.AssemblyManifest;
  private readonly runtimeInfo: boolean;

  constructor(options: SynthesisSessionOptions) {
    this.store = options.store;
    this.runtimeInfo = options.runtimeInformation !== undefined ? options.runtimeInformation : true;
    this.assembly = this.store.substore('assembly');
    this.staging = this.store.substore('staging');
    this.path = this.store.path;
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

  public getArtifact(id: string): cxapi.Artifact {
    if (!(id in this.artifacts)) {
      throw new Error(`Artifact not found ${id}`);
    }

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

    this.assembly.writeFile(cxapi.MANIFEST_FILE, JSON.stringify(manifest, undefined, 2));

    // write build manifest if we have build steps
    if (Object.keys(this.buildSteps).length > 0) {
      const buildManifest: cxapi.BuildManifest = {
        steps: this.buildSteps
      };

      this.store.writeFile(cxapi.BUILD_FILE, JSON.stringify(buildManifest, undefined, 2));
    }

    return manifest;
  }
}

export interface ISessionStore {
  /**
   * The local directory where the store resides.
   */
  path: string;

  /**
   * Creates a subdirectory named `directoryName` and returns a session store that
   * can be used to write/read files from that store.
   *
   * If there is already a substore by that name, this method will throw.
   *
   * @param directoryName The name of the directory
   */
  substore(directoryName: string): ISessionStore;

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
  path: string;

  /**
   * The parent store (optional)
   */
  parent?: FileSystemStore;
}

/**
 * Can be used to prepare and emit synthesis artifacts into an output directory.
 */
export class FileSystemStore implements ISessionStore {
  public readonly path: string;
  private readonly parent?: FileSystemStore;
  private locked = false;

  constructor(options: FileSystemStoreOptions) {
    this.path = options.path;
    this.parent = options.parent;
    return;
  }

  public substore(directoryName: string): ISessionStore {
    const p = this.mkdir(directoryName);
    return new FileSystemStore({
      path: p,
      parent: this
    });
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
    return fs.readdirSync(this.path).sort();
  }

  public finalize() {
    this.locked = true;
  }

  private pathForArtifact(id: string) {
    return path.join(this.path, id);
  }

  private canWrite(artifactName: string) {
    if (this.exists(artifactName)) {
      throw new Error(`An artifact named ${artifactName} was already written to this session`);
    }
    if (this.locked || (this.parent && this.parent.locked)) {
      throw new Error('Store (or parent store) has already been closed');
    }
  }
}
