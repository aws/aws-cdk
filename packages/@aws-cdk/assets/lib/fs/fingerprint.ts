import crypto = require('crypto');
import fs = require('fs');
import path = require('path');
import { FollowMode } from './follow-mode';

const BUFFER_SIZE = 8 * 1024;

export interface FingerprintOptions {
  /**
   * Extra information to encode into the fingerprint (e.g. build instructions
   * and other inputs)
   */
  extra?: string;

  /**
   * List of exclude patterns (see `CopyOptions`)
   * @default include all files
   */
  exclude?: string[];

  /**
   * What to do when we encounter symlinks.
   * @default External only follows symlinks that are external to the source
   * directory
   */
  follow?: FollowMode;
}

/**
 * Produces fingerprint based on the contents of a single file or an entire directory tree.
 *
 * The fingerprint will also include:
 * 1. An extra string if defined in `options.extra`.
 * 2. The set of exclude patterns, if defined in `options.exclude`
 * 3. The symlink follow mode value.
 *
 * @param fileOrDirectory The directory or file to fingerprint
 * @param options Fingerprinting options
 */
export function fingerprint(fileOrDirectory: string, options: FingerprintOptions = { }) {
  const follow = options.follow !== undefined ? options.follow : FollowMode.External;
  const hash = crypto.createHash('md5');
  addToHash(fileOrDirectory);

  hash.update(`==follow==${follow}==\n\n`);

  if (options.extra) {
    hash.update(`==extra==${options.extra}==\n\n`);
  }

  for (const ex of options.exclude || []) {
    hash.update(`==exclude==${ex}==\n\n`);
  }

  return hash.digest('hex');

  function addToHash(pathToAdd: string) {
    hash.update('==\n');
    const relativePath = path.relative(fileOrDirectory, pathToAdd);
    hash.update(relativePath + '\n');
    hash.update('~~~~~~~~~~~~~~~~~~\n');
    const stat = fs.statSync(pathToAdd);

    if (stat.isSymbolicLink()) {
      const target = fs.readlinkSync(pathToAdd);
      hash.update(target);
    } else if (stat.isDirectory()) {
      for (const file of fs.readdirSync(pathToAdd)) {
        addToHash(path.join(pathToAdd, file));
      }
    } else {
      const file = fs.openSync(pathToAdd, 'r');
      const buffer = Buffer.alloc(BUFFER_SIZE);

      try {
        let bytesRead;
        do {
          bytesRead = fs.readSync(file, buffer, 0, BUFFER_SIZE, null);
          hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
      } finally {
        fs.closeSync(file);
      }
    }
  }
}