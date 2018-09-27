import crypto = require('crypto');
import fs = require('fs-extra');
import path = require('path');

/**
 * Return actual file contents or undefined if not exists
 */
export async function atomicRead(fileName: string): Promise<string | undefined> {
  try {
    return await fs.readFile(fileName, { encoding: 'utf-8' });
  } catch (e) {
    if (e.code === 'ENOENT') { return undefined; }
    throw e;
  }
}

/**
 * Atomically write a file
 */
export async function atomicWrite(fileName: string, contents: string) {
  // NodeJS has no tempfile API :/
  const tempFile = path.join(path.dirname(fileName), path.basename(fileName) + '.' + crypto.randomBytes(8).toString('hex'));
  await fs.writeFile(tempFile, contents, { encoding: 'utf-8' });
  await fs.rename(tempFile, fileName);
}
