import * as fs from 'fs';
import * as path from 'path';

const pfs = fs.promises;

export async function pathExists(pathName: string) {
  try {
    await pfs.stat(pathName);
    return true;
  } catch (e: any) {
    if (e.code !== 'ENOENT') { throw e; }
    return false;
  }
}

export function emptyDirSync(dir: string) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      emptyDirSync(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  });
}

export function rmRfSync(dir: string) {
  emptyDirSync(dir);
  fs.rmdirSync(dir);
}
