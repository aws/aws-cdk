import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssemblyManifest, Manifest, StackTagsMetadataEntry } from '../lib';

const FIXTURES = path.join(__dirname, 'fixtures');

function fixture(name: string) {
  return path.join(FIXTURES, name, 'manifest.json');
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function removeStringKeys(obj: any, keys: string[]) {

  function _recurse(o: any) {
    for (const prop in o) {
      if (keys.includes(prop) && typeof o[prop] === 'string') {
        delete o[prop];
      } else if (typeof o[prop] === 'object') {
        _recurse(o[prop]);
      }
    }
  }

  const cloned = clone(obj);
  _recurse(cloned);

  return cloned;

}

test('manifest save', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const assemblyManifest: AssemblyManifest = {
    version: "version"
  };

  Manifest.save(assemblyManifest, manifestFile);

  const saved = JSON.parse(fs.readFileSync(manifestFile, 'UTF-8'));

  expect(saved).toEqual(assemblyManifest);

});

test('cloud-assembly.json.schema is correct', () => {

  // when we compare schemas we ignore changes the
  // description that is generated from the ts docstrings.
  const docStringFields = [
    'description'
  ];

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const schema = require('../scripts/schema.js');

  const expected = removeStringKeys(schema.generate(), docStringFields);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const actual = removeStringKeys(require('../schema.generated/cloud-assembly.schema.json'), docStringFields);

  try {
    expect(actual).toEqual(expected);
  } catch (err) {
    // I couldn't for the life of me figure out how to provide additional error message
    // to jets...any ideas?
    err.message = `Whoops, Looks like the schema has changed. Did you forget to run 'yarn update-schema'?\n\n${err.message}`;
    throw err;
  }
});

test('manifest load', () => {
  const loaded = Manifest.load(fixture("only-version"));
  expect(loaded).toMatchSnapshot();
});

test('manifest load fails for invalid nested property', () => {
  expect(() => Manifest.load(fixture("invalid-nested-property")))
  .toThrow(/Invalid assembly manifest/);

});

test('manifest load fails for invalid artifact type', () => {
  expect(() => Manifest.load(fixture('invalid-artifact-type')))
  .toThrow(/Invalid assembly manifest/);
});

test('stack-tags are deserialized properly', () => {

  const m: AssemblyManifest = Manifest.load(fixture('with-stack-tags'));

  if (m.artifacts?.stack?.metadata?.AwsCdkPlaygroundBatch[0].data) {
    const entry = m.artifacts.stack.metadata.AwsCdkPlaygroundBatch[0].data as StackTagsMetadataEntry;
    expect(entry[0].key).toEqual("hello");
    expect(entry[0].value).toEqual("world");
  }
  expect(m.version).toEqual("version");

});

test('can access random metadata', () => {

  const loaded = Manifest.load(fixture('random-metadata'));
  const randomArray = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[0].data;
  const randomNumber = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[1].data;
  const randomMap = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[2].data;

  expect(randomArray).toEqual(["42"]);
  expect(randomNumber).toEqual(42);
  expect(randomMap).toEqual({
    key: "value"
  });

  if (randomMap) {
    expect((randomMap as any).key).toEqual("value");
  }

});
