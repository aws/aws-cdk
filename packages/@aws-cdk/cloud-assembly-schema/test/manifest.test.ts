import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
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

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const assemblyManifest: AssemblyManifest = {
    version: 'version'
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
  const schema = require('../scripts/update-schema.js');

  const expected = removeStringKeys(schema.generate(), docStringFields);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const actual = removeStringKeys(require('../schema/cloud-assembly.schema.json'), docStringFields);

  try {
    expect(actual).toEqual(expected);
  } catch (err) {
    // I couldn't for the life of me figure out how to provide additional error message
    // to jest...any ideas?
    err.message = `Whoops, Looks like the schema has changed. Did you forget to run 'yarn update-schema'?\n\n${err.message}`;
    throw err;
  }
});

test('manifest load', () => {
  const loaded = Manifest.load(fixture('only-version'));
  expect(loaded).toMatchSnapshot();
});

test('manifest load fails for invalid nested property', () => {
  expect(() => Manifest.load(fixture('invalid-nested-property'))).toThrow(/Invalid assembly manifest/);
});

test('manifest load fails for invalid artifact type', () => {
  expect(() => Manifest.load(fixture('invalid-artifact-type'))).toThrow(/Invalid assembly manifest/);
});

test('manifest load fails on higher major version', () => {
  expect(() => Manifest.load(fixture('high-version'))).toThrow(/Cloud assembly schema version mismatch/);
});

// once we start introducing minor version bumps that are considered
// non breaking, this test can be removed.
test('manifest load fails on higher minor version', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const newVersion = semver.inc(Manifest.version(), 'minor');
  expect(newVersion).toBeTruthy();

  if (newVersion) {
    const assemblyManifest: AssemblyManifest = {
      version: newVersion
    };

    Manifest.save(assemblyManifest, manifestFile);

    expect(() => Manifest.load(manifestFile)).toThrow(/Cloud assembly schema version mismatch/);
  }
});

// once we start introducing patch version bumps that are considered
// non breaking, this test can be removed.
test('manifest load fails on higher patch version', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const newVersion = semver.inc(Manifest.version(), 'patch');
  expect(newVersion).toBeTruthy();

  if (newVersion) {
    const assemblyManifest: AssemblyManifest = {
      version: newVersion
    };

    Manifest.save(assemblyManifest, manifestFile);

    expect(() => Manifest.load(manifestFile)).toThrow(/Cloud assembly schema version mismatch/);
  }
});

test('manifest load fails on invalid version', () => {
  expect(() => Manifest.load(fixture('invalid-version'))).toThrow(/Invalid semver string/);
});

test('manifest load succeeds on unknown properties', () => {
  const manifest = Manifest.load(fixture('unknown-property'));
  expect(manifest.version).toEqual('0.0.0');
});

test('stack-tags are deserialized properly', () => {

  const m: AssemblyManifest = Manifest.load(fixture('with-stack-tags'));

  if (m.artifacts?.stack?.metadata?.AwsCdkPlaygroundBatch[0].data) {
    const entry = m.artifacts.stack.metadata.AwsCdkPlaygroundBatch[0].data as StackTagsMetadataEntry;
    expect(entry[0].key).toEqual('hello');
    expect(entry[0].value).toEqual('world');
  }
  expect(m.version).toEqual('0.0.0');

});

test('can access random metadata', () => {

  const loaded = Manifest.load(fixture('random-metadata'));
  const randomArray = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[0].data;
  const randomNumber = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[1].data;
  const randomMap = loaded.artifacts?.stack.metadata?.AwsCdkPlaygroundBatch[2].data;

  expect(randomArray).toEqual(['42']);
  expect(randomNumber).toEqual(42);
  expect(randomMap).toEqual({
    key: 'value'
  });

  expect(randomMap).toBeTruthy();

  if (randomMap) {
    expect((randomMap as any).key).toEqual('value');
  }

});
