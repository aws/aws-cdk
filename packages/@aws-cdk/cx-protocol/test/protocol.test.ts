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

  const saved = Manifest.load(manifestFile);

  expect(saved).toEqual(assemblyManifest);

});

test('test stack-tags are deserialized properly', () => {

  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-tests'));
  const manifestFile = path.join(outdir, 'manifest.json');

  fs.writeFileSync(manifestFile, JSON.stringify({
    version: "version",
    artifacts: {
      stack: {
        type: "aws:cloudformation:stack",
        metadata: {
          AwsCdkPlaygroundBatch: [{
            type: "aws:cdk:stack-tags",
            data: [{
              Key: "hello",
              Value: "world"
            }],
            trace: ["trace"]
          }]
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
