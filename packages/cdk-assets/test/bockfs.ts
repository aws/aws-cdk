// A not-so-fake filesystem mock similar to mock-fs
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path_ from 'path';

const bockFsRoot = path_.join(os.tmpdir(), 'bockfs');

function bockfs(files: Record<string, string>) {
  for (const [fileName, contents] of Object.entries(files)) {
    bockfs.write(fileName, contents);
  }
}

namespace bockfs {
  export function write(fileName: string, contents: string) {
    const fullPath = path(fileName);
    fs.mkdirpSync(path_.dirname(fullPath));
    fs.writeFileSync(fullPath, contents, { encoding: 'utf-8' });
  }

  export function path(x: string) {
    if (x.startsWith('/')) { x = x.substr(1); } // Force path to be non-absolute
    return path_.join(bockFsRoot, x);
  }

  export function restore() {
    fs.emptyDirSync(bockFsRoot);
    fs.rmdirSync(bockFsRoot);
  }
}

export = bockfs;