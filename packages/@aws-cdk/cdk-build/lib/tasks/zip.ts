import archiver = require('archiver');
import crypto = require('crypto');
import fs = require('fs-extra');
import path = require('path');
import { Task } from '../task';

export interface ZipTaskOptions {
  /**
   * Source directory to archive.
   */
  src: string;

  /**
   * Where to put the resulting zip archive.
   */
  dest: string;
}

export default class ZipTask extends Task {
  constructor(id: string, private readonly options: ZipTaskOptions) {
    super(id);
    return;
  }

  public async execute() {
    if (await fs.pathExists(this.options.dest)) {
      this.debug(`${this.options.dest} already exists. skipping`);
      return false;
    }
    this.debug(`compressing ${this.options.src} to ${this.options.dest}`);
    await fs.mkdirs(path.dirname(this.options.dest));
    await zipDirectory(this.options.src, this.options.dest);
    return true;
  }
}

export function zipDirectory(directory: string, outputFile: string): Promise<void> {
  return new Promise((ok, fail) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip');
    // The below options are needed to support following symlinks when building zip files:
    // -  nodir: This will prevent symlinks themselves from being copied into the zip.
    // - follow: This will follow symlinks and copy the files within.
    const globOptions = {
      dot: true,
      nodir: true,
      follow: true,
      cwd: directory
    };
    archive.glob('**', globOptions);
    archive.pipe(output);
    archive.finalize();

    archive.on('warning', fail);
    archive.on('error', fail);
    output.once('close', () => ok());
  });
}

export function md5hash(data: any) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
