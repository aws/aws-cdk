import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssemblyManifest, Manifest, StackTagsMetadataEntry } from '../lib';

test('test manifest save', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const assemblyManifest: AssemblyManifest = {
    version: "version"
  };

  Manifest.save(assemblyManifest, manifestFile);

  const saved = JSON.parse(fs.readFileSync(manifestFile, 'UTF-8'));

  expect(saved).toEqual(assemblyManifest);

});

test('test manifest load', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  const assemblyManifest: AssemblyManifest = {
    version: "version"
  };

  Manifest.save(assemblyManifest, manifestFile);

  const loaded = Manifest.load(manifestFile);

  expect(loaded).toEqual(assemblyManifest);

});

test('test manifest load fail on invalid file', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  // this is invalid because 'version' is required
  const assemblyManifest = {

  };

  fs.writeFileSync(manifestFile, JSON.stringify(assemblyManifest));

  expect(() => Manifest.load(manifestFile)).toThrow(/Invalid assembly manifest/);

});

test('test stack-tags are deserialized properly', () => {

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

  if (m.artifacts && m.artifacts.stack.metadata && m.artifacts.stack.metadata.AwsCdkPlaygroundBatch[0].data) {
    const entry = m.artifacts.stack.metadata.AwsCdkPlaygroundBatch[0].data as StackTagsMetadataEntry;
    expect(entry[0].key).toEqual("hello");
    expect(entry[0].value).toEqual("world");
  }
  expect(m.version).toEqual("version");

});
