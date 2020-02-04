import * as archiver from 'archiver';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';

export async function zipDirectory(directory: string, outputFile: string): Promise<void> {
  // The below options are needed to support following symlinks when building zip files:
  // - nodir: This will prevent symlinks themselves from being copied into the zip.
  // - follow: This will follow symlinks and copy the files within.
  const globOptions = {
    dot: true,
    nodir: true,
    follow: true,
    cwd: directory,
  };
  const files = glob.sync('**', globOptions); // The output here is already sorted

  const output = fs.createWriteStream(outputFile);

  const archive = archiver('zip');
  archive.on('warning', fail);
  archive.on('error', fail);
  archive.pipe(output);

  // Append files serially to ensure file order
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const [data, stat] = await Promise.all([fs.readFile(fullPath), fs.stat(fullPath)]);
    archive.append(data, {
      name: file,
      date: new Date('1980-01-01T00:00:00.000Z'), // reset dates to get the same hash for the same content
      mode: stat.mode,
    });
  }

  try {
    return new Promise(ok => {
      // archive has been finalized and the output file descriptor has closed, resolve promise
      output.once('close', ok);
    });
  } finally {
    await archive.finalize();
  }
}

export function contentHash(data: string | Buffer | DataView) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
