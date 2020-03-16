// A not-so-fake filesystem mock similar to mock-fs
//
// mock-fs is super convenient but we can't always use it:
// - When you use console.log() jest wants to load things from the filesystem (which fails).
// - When you make AWS calls the SDK wants to load things from the filesystem (which fails).
//
// Therefore, something similar which uses tempdirs on your actual disk.
//
// The big downside compared to mockfs is that you need to use bockfs.path() to translate
// fake paths to real paths.
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
    fs.mkdirSync(path_.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, contents, { encoding: 'utf-8' });
  }

  export function path(x: string) {
    if (x.startsWith('/')) { x = x.substr(1); } // Force path to be non-absolute
    return path_.join(bockFsRoot, x);
  }

  export function restore() {
    fs.removeSync(bockFsRoot);
  }
}

export = bockfs;