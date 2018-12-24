import fs = require('fs-extra');
import reflect = require('jsii-reflect');
import path = require('path');

async function loadall(ts: reflect.TypeSystem, jsiidir: string) {
  for (const file of await fs.readdir(jsiidir)) {
    await ts.loadFile(path.join(jsiidir, file));
  }
}

export async function createTypeSystem(jsiidir: string) {
  const ts = new reflect.TypeSystem();
  await loadall(ts, jsiidir);
  return ts;
}