import fs = require('fs-extra');
import reflect = require('jsii-reflect');
import path = require('path');

async function loadall(ts: reflect.TypeSystem) {
  const jsiidir = path.join(__dirname, '..', 'jsii');
  for (const file of await fs.readdir(jsiidir)) {
    await ts.loadFile(path.join(jsiidir, file));
  }
}

export async function createTypeSystem() {
  const ts = new reflect.TypeSystem();
  await loadall(ts);
  return ts;
}