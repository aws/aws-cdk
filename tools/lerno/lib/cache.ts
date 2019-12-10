import fs = require('fs-extra');
import path = require('path');
import { spawnAndWait } from './util';

export class Cache {
  constructor(private readonly directory: string) {
  }

  public async contains(key: string): Promise<boolean> {
    return await fs.pathExists(this.cacheFile(key));
  }

  public async fetch(key: string, directory: string): Promise<void> {
    // FIXME: Probably needs to be implemented fully in NodeJS
    await spawnAndWait(['unzip', '-o', this.cacheFile(key)], { cwd: directory, stdio: 'ignore' });
  }

  public async store(key: string, directory: string): Promise<void> {
    // FIXME: Probably needs to be implemented fully in NodeJS
    const fname = this.cacheFile(key);
    await fs.mkdirp(path.dirname(fname));

    // Excludes node_modules, but includes all the rest.
    // Store symlinks as symlinks
    await spawnAndWait(['zip', '-y', '-r', fname, '.', '-x', 'node_modules'], {
      cwd: directory,
      stdio: 'ignore',
    });
  }

  private cacheFile(key: string) {
    const start = key.substring(0, 2);
    return path.resolve(this.directory, start, key + '.zip');
  }
}