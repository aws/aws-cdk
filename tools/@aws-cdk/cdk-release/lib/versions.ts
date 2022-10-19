import * as path from 'path';
import * as fs from 'fs-extra';
import { Versions } from './types';

export function readVersion(versionFile: string): Versions {
  const versionPath = path.resolve(process.cwd(), versionFile);
  const contents = JSON.parse(fs.readFileSync(versionPath, { encoding: 'utf-8' }));
  return {
    stableVersion: contents.version,
    alphaVersion: contents.alphaVersion,
  };
}
