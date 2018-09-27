import path = require('path');
import { calculateHash, MerkleOptions } from "./calculate";
import { atomicRead, atomicWrite } from './file-ops';

/**
 * Calculate the folder hash and see if it changed since the last build
 */
export class ChangeDetector {
  private readonly markerFileName: string;

  constructor(private directory: string, private options: ChangeDetectorOptions = {}) {
    this.markerFileName = path.join(directory, options.markerFile || '.LAST_BUILD');
  }

  /**
   * Return whether the folder hash changed since last time
   */
  public async isChanged(): Promise<boolean> {
    const marker = await atomicRead(this.markerFileName);
    if (marker === undefined) { return true; }
    const actual = await calculateHash(this.directory, this.options);
    return marker !== actual;
  }

  public async markClean(): Promise<void> {
    const hash = await calculateHash(this.directory, this.options);
    await atomicWrite(this.markerFileName, hash);
  }
}

export interface ChangeDetectorOptions extends MerkleOptions {
  /**
   * What file name to use to store hash data in
   *
   * @default .LAST_BUILD
   */
  markerFile?: string;
}
