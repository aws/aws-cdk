import fs = require('fs-extra');
import path = require('path');
import { Task } from '../task';

export interface CopyTaskOptions {
  src: string;
  dest: string;
}

/**
 * Copies files.
 */
export default class CopyTask extends Task {
  constructor(id: string, private readonly options: CopyTaskOptions) {
    super(id);
  }

  public async execute() {
    if (await fs.pathExists(this.options.dest)) {
      this.debug(`${this.options.dest} already exists. skipping`);
      return false;
    }

    this.debug(`copying ${this.options.src} to ${this.options.dest}`);
    await fs.mkdirs(path.dirname(this.options.dest));
    await fs.copy(this.options.src, this.options.dest);
    return true;
  }
}
