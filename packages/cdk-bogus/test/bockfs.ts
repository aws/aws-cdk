// A not-so-fake filesystem mock similar to mock-fs
import * as fs from 'fs';
import * as os from 'os';
import * as path_ from 'path';
import { rmRfSync } from '../lib/private/fs-extra';

const bockFsRoot = path_.join(os.tmpdir(), 'bockfs');

function bockfs(files: Record<string, string>) {
  for (const [fileName, contents] of Object.entries(files)) {
    bockfs.write(fileName, contents);
  }
}

namespace bockfs {
  export function write(fileName: string, contents: string) {
    const fullPath = path(fileName);
    fs.mkdirSync(path_.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, contents, { encoding: 'utf-8' });
  }

  export function path(x: string) {
    if (x.startsWith('/')) { x = x.slice(1); } // Force path to be non-absolute
    return path_.join(bockFsRoot, x);
  }

  export function restore() {
    rmRfSync(bockFsRoot);
  }
}

export = bockfs;