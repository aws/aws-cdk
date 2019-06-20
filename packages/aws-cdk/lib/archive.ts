import archiver = require('archiver');
import crypto = require('crypto');
import fs = require('fs-extra');
import glob = require('glob');
import path = require('path');

export function zipDirectory(directory: string, outputFile: string): Promise<void> {
  return new Promise((ok, fail) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip');

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

    output.on('open', async () => {
      archive.pipe(output);

      const contents = await Promise.all(files.map(async (file) => {
        const data = await fs.readFile(path.join(directory, file));
        return {
          data,
          name: file
        };
      }));

      contents.forEach((content) => { // Append files serially to ensure file order
        archive.append(content.data, {
          name: content.name,
          date: new Date('1980-01-01T00:00:00.000Z'), // reset dates to get the same hash for the same content
        });
      });

      archive.finalize();
    });

    archive.on('warning', fail);
    archive.on('error', fail);
    output.once('close', () => ok());
  });
}

export function contentHash(data: string | Buffer | DataView) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
