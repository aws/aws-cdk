import fs = require('fs');
import os = require('os');
import path = require('path');

export interface ISynthesisSession {
  /**
   * Creates a directory under the session directory and returns it's full path.
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
   * Writes a file into the synthesis session directory.
   * @param artifactName The name of the file.
   * @param data The contents of the file.
   */
  writeFile(artifactName: string, data: any): void;

  /**
   * Reads a file from the synthesis session directory.
   * @param fileName The name of the file.
   * @throws if the file is not found
   */
  readFile(fileName: string): any;

  /**
   * @returns true if the file `fileName` exists in the session directory.
   * @param name The name of the file or directory to look up.
   */
  exists(name: string): boolean;

  /**
   * List all artifacts that were emitted to the session.
   */
  list(): string[];

  /**
   * Finalizes the session. After this is called, the session will be locked for
   * writing.
   */
  finalize(): void;
}

export interface SynthesisSessionOptions {
  /**
   * The output directory for synthesis artifacts
   */
  outdir: string;
}

/**
 * Can be used to prepare and emit synthesis artifacts into an output directory.
 */
export class SynthesisSession implements ISynthesisSession {
  private readonly outdir: string;
  private locked = false;

  constructor(options: SynthesisSessionOptions) {
    this.outdir = options.outdir;
    return;
  }

  public writeFile(fileName: string, data: any) {
    this.canWrite(fileName);

    const p = this.pathForArtifact(fileName);
    fs.writeFileSync(p, data);
  }

  public readFile(fileName: string): any {
    const p = this.pathForArtifact(fileName);
    if (!fs.existsSync(p)) {
      throw new Error(`File not found: ${p}`);
    }

    return fs.readFileSync(p);
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

export class InMemorySynthesisSession implements ISynthesisSession {
  private files: { [fileName: string]: any } = { };
  private dirs: { [dirName: string]: string } = { }; // value is path to a temporary directory

  private locked = false;

  public writeFile(fileName: string, data: any): void {
    this.canWrite(fileName);
    this.files[fileName] = data;
  }

  public readFile(fileName: string) {
    if (!(fileName in this.files)) {
      throw new Error(`${fileName} not found`);
    }
    return this.files[fileName];
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

