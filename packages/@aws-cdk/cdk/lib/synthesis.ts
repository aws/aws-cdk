import fs = require('fs');
import path = require('path');

export interface ISynthesisSession {
  /**
   * Writes a file into the synthesis session directory.
   * @param fileName The name of the file.
   * @param data The contents of the file.
   */
  writeFile(fileName: string, data: any): void;

  /**
   * Reads a file from the synthesis session directory.
   * @param fileName The name of the file.
   * @throws if the file is not found
   */
  readFile(fileName: string): any;

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
    if (this.locked) {
      throw new Error('Session has already been finalized');
    }
    const p = this.pathForArtifact(fileName);
    if (fs.existsSync(p)) {
      throw new Error(`File ${p} already exists`);
    }
    fs.writeFileSync(p, data);
  }

  public readFile(fileName: string): any {
    const p = this.pathForArtifact(fileName);
    if (!fs.existsSync(p)) {
      throw new Error(`File not found: ${p}`);
    }

    return fs.readFileSync(p);
  }

  public finalize() {
    this.locked = true;
  }

  private pathForArtifact(id: string) {
    return path.join(this.outdir, id);
  }
}

export class InMemorySynthesisSession implements ISynthesisSession {
  private store: { [fileName: string]: any } = { };
  private locked = false;

  public writeFile(fileName: string, data: any): void {
    if (this.locked) {
      throw new Error(`Session has already been finalized`);
    }
    if (fileName in this.store) {
      throw new Error(`${fileName} already exists`);
    }
    this.store[fileName] = data;
  }

  public readFile(fileName: string) {
    if (!(fileName in this.store)) {
      throw new Error(`${fileName} not found`);
    }
    return this.store[fileName];
  }

  public finalize() {
    this.locked = true;
  }
}