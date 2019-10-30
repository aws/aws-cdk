import crypto = require('crypto');
import fs = require('fs');
import path = require('path');
import { CopyOptions } from './copy-options';
import { FollowMode } from './follow-mode';
import { listFilesRecursively, shouldFollow } from './utils';

const BUFFER_SIZE = 8 * 1024;
const CTRL_SOH = '\x01';
const CTRL_SOT = '\x02';
const CTRL_ETX = '\x03';

export interface FingerprintOptions extends CopyOptions {
  /**
   * Extra information to encode into the fingerprint (e.g. build instructions
   * and other inputs)
   */
  extra?: string;
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
  const hash = crypto.createHash('sha256');
  _hashField(hash, 'options.extra', options.extra || '');
  const follow = options.follow || FollowMode.EXTERNAL;
  _hashField(hash, 'options.follow', follow);

  const rootDirectory = fs.statSync(fileOrDirectory).isDirectory()
    ? fileOrDirectory
    : path.dirname(fileOrDirectory);

  for (const assetFile of listFilesRecursively(fileOrDirectory, {...options, follow}, rootDirectory)) {
    const relativePath = path.relative(fileOrDirectory, assetFile.absolutePath);

    if (assetFile.isSymbolicLink) {
      const resolvedLinkTarget = path.resolve(path.dirname(assetFile.absolutePath), assetFile.symlinkTarget);
      if (!shouldFollow(follow, rootDirectory, resolvedLinkTarget)) {
        _hashField(hash, `link:${relativePath}`, assetFile.symlinkTarget);
      } else {
        _hashField(hash, `file:${relativePath}`, _contentFingerprint(assetFile.absolutePath, assetFile.size));
      }
    } else if (assetFile.isFile) {
      _hashField(hash, `file:${relativePath}`, _contentFingerprint(assetFile.absolutePath, assetFile.size));
    } else if (!assetFile.isDirectory) {
      throw new Error(`Unable to hash ${assetFile.absolutePath}: it is neither a file nor a directory`);
    }
  }

  return hash.digest('hex');
}

function _contentFingerprint(file: string, size: number): string {
  const hash = crypto.createHash('sha256');
  const buffer = Buffer.alloc(BUFFER_SIZE);
  // tslint:disable-next-line: no-bitwise
  const fd = fs.openSync(file, fs.constants.O_DSYNC | fs.constants.O_RDONLY | fs.constants.O_SYNC);
  try {
    let read = 0;
    // tslint:disable-next-line: no-conditional-assignment
    while ((read = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null)) !== 0) {
      hash.update(buffer.slice(0, read));
    }
  } finally {
    fs.closeSync(fd);
  }
  return `${size}:${hash.digest('hex')}`;
}

function _hashField(hash: crypto.Hash, header: string, value: string | Buffer | DataView) {
  hash.update(CTRL_SOH).update(header).update(CTRL_SOT).update(value).update(CTRL_ETX);
}
