import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AssemblyManifest, Manifest } from '../lib';
import { hashObject } from './fingerprint';

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

test('schema has the correct version', () => {

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const expectedHash = require('./schema.expected.json').hash;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const schema = require('../schema/cloud-assembly.schema.json');

  const schemaHash = hashObject(schema);

  expect(schemaHash).toEqual(expectedHash);

});
