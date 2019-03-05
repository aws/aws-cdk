import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import unzip = require('unzip');
import { Task } from '../lib';

export async function createTree(files: { [path: string]: any }) {
  const root = await fs.mkdtemp(os.tmpdir());

  for (const [ filePath, content ] of Object.entries(files)) {
    const absPath = path.join(root, filePath);
    await fs.mkdirs(path.dirname(absPath));

    if (typeof(content) === 'object') {
      await fs.writeFile(absPath, JSON.stringify(content, undefined, 2));
    } else {
      await fs.writeFile(absPath, content);
    }
  }

  return root;
}

export function snapshotTree(dir: string) {
  const entries: { [name: string]: any } = { };
  for (const file of fs.readdirSync(dir)) {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) {
      entries[file] = snapshotTree(fp);
    } else if (path.extname(file) === '.json') {
      entries[file] = JSON.parse(fs.readFileSync(fp).toString());
    } else {
      entries[file] = fs.readFileSync(fp).toString().trim();
    }
  }
  return entries;
}

export class SimpleTask extends Task {
  public buildCalled = false;
  constructor(id: string, private readonly log: string[]) {
    super(id);
  }
  protected async execute() {
    this.buildCalled = true;
    this.log.push(this.id);
    return true;
  }
}

export async function decompress(zip: string, destDir: string) {
  const writable = unzip.Extract({ path: destDir });
  fs.createReadStream(zip).pipe(writable);
  return new Promise((ok, ko) => {
    writable.once('close', () => ok());
    writable.once('error', err => ko(err));
  });
}
