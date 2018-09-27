import archiver = require('archiver');
import crypto = require('crypto');
import fs = require('fs-extra');

export function zipDirectory(directory: string, outputFile: string): Promise<void> {
  return new Promise((ok, fail) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip');
    archive.directory(directory, false);
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
