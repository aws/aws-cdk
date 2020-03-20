import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssemblyManifest, Manifest, StackTagsMetadataEntry } from '../lib';
import { hashObject } from './fingerprint';

const FIXTURES = path.join(__dirname, 'fixtures');

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

test('manifest load', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const assemblyManifest: AssemblyManifest = {
    version: "version"
  };

  Manifest.save(assemblyManifest, manifestFile);

  const loaded = Manifest.load(manifestFile);

  expect(loaded).toEqual(assemblyManifest);

});

test('manifest load fail on invalid file', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  // this is invalid because 'version' is required
  const assemblyManifest = {

  };

  fs.writeFileSync(manifestFile, JSON.stringify(assemblyManifest));

  expect(() => Manifest.load(manifestFile)).toThrow(/Invalid assembly manifest/);

});

test('schema has the correct hash', () => {

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const expectedHash = require('./schema.expected.json').hash;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const schema = require('../schema/cloud-assembly.schema.json');

  const schemaHash = hashObject(schema);

  expect(schemaHash).toEqual(expectedHash);

});

test('manifest load fail on invalid file', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  // this is invalid because 'version' is required
  const assemblyManifest = {

  };

  fs.writeFileSync(manifestFile, JSON.stringify(assemblyManifest));

  expect(() => Manifest.load(manifestFile)).toThrow(/Invalid assembly manifest/);

});

test('manifest load fail on complex invalid file', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  // this is invalid because 'version' is required
  const assemblyManifest = {
    version: "0.0.5",
    runtime: {
      libraries: ["should", "be", "a", "map"]
    }
  };

  fs.writeFileSync(manifestFile, JSON.stringify(assemblyManifest));

  expect(() => Manifest.load(manifestFile)).toThrow(/Invalid assembly manifest/);

});

test('load fails for invalid artifact type', () => {
  expect(() => Manifest.load(path.join(FIXTURES, 'invalid-artifact-type', 'manifest.json')))
  .toThrow(/Invalid assembly manifest/);
});

test('stack-tags are deserialized properly', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  fs.writeFileSync(manifestFile, JSON.stringify({
    version: "version",
    artifacts: {
      Tree: {
        type: "cdk:tree",
        properties: {
          file: "tree.json"
        }
      },
      stack: {
        type: "aws:cloudformation:stack",
        metadata: {
          AwsCdkPlaygroundBatch: [
            {
              type: "aws:cdk:stack-tags",
              data: [{
                Key: "hello",
                Value: "world"
              }],
              trace: ["trace"]
            },
            {
              type: "aws:cdk:asset",
              data: {
                repositoryName: "repo",
                imageTag: "tag",
                id: "id",
                packaging: "container-image",
                path: "path",
                sourceHash: "hash"
              },
              trace: ["trace"]
            },
          ]
        }
      }
    },
  }));

  const m: AssemblyManifest = Manifest.load(manifestFile);

  if (m.artifacts?.stack?.metadata?.AwsCdkPlaygroundBatch[0].data) {
    const entry = m.artifacts.stack.metadata.AwsCdkPlaygroundBatch[0].data as StackTagsMetadataEntry;
    expect(entry[0].key).toEqual("hello");
    expect(entry[0].value).toEqual("world");
  }
  expect(m.version).toEqual("version");

});
