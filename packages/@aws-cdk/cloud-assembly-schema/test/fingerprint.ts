import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function hashObject(obj: any) {

    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
    const schemaFile = path.join(outdir, 'manifest.json');

    fs.writeFileSync(schemaFile, JSON.stringify(obj));

    const stat = fs.lstatSync(schemaFile);

    const bufferSize = 8 * 1024;
    const hash = crypto.createHash('sha256');
    const buffer = Buffer.alloc(bufferSize);

    // tslint:disable-next-line: no-bitwise
    const fd = fs.openSync(schemaFile, fs.constants.O_DSYNC | fs.constants.O_RDONLY | fs.constants.O_SYNC);
    try {
      let read = 0;
      // tslint:disable-next-line: no-conditional-assignment
      while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
        hash.update(buffer.slice(0, read));
      }
    } finally {
      fs.closeSync(fd);
    }
    return `${stat.size}:${hash.digest('hex')}`;

  }
