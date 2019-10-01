import path = require('path');
import { CloudAssembly } from '../lib';
import { CLOUD_ASSEMBLY_VERSION, verifyManifestVersion } from '../lib/versioning';

const FIXTURES = path.join(__dirname, 'fixtures');

test('empty assembly', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'empty'));
  expect(assembly.artifacts).toEqual([]);
  expect(assembly.runtime).toEqual({ libraries: { } });
  expect(assembly.stacks).toEqual([]);
  expect(assembly.version).toEqual(CLOUD_ASSEMBLY_VERSION);
  expect(assembly.manifest).toMatchSnapshot();
  expect(assembly.tree()).toBeUndefined();
});

test('assembly a single cloudformation stack and tree metadata', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'single-stack'));
  expect(assembly.artifacts).toHaveLength(2);
  expect(assembly.stacks).toHaveLength(1);
  expect(assembly.manifest.missing).toBeUndefined();
  expect(assembly.runtime).toEqual({ libraries: { } });
  expect(assembly.version).toEqual(CLOUD_ASSEMBLY_VERSION);

  const stack = assembly.stacks[0];
  expect(stack.manifest).toMatchSnapshot();
  expect(stack.assets).toHaveLength(0);
  expect(stack.dependencies).toEqual([]);
  expect(stack.environment).toEqual({ account: '37736633', region: 'us-region-1', name: 'aws://37736633/us-region-1' });
  expect(stack.template).toEqual({ Resources: { MyBucket: { Type: "AWS::S3::Bucket" } } });
  expect(stack.messages).toEqual([]);
  expect(stack.manifest.metadata).toEqual(undefined);
  expect(stack.originalName).toEqual('MyStackName');
  expect(stack.name).toEqual('MyStackName');

  const treeArtifact = assembly.tree();
  expect(treeArtifact).toBeDefined();
  expect(treeArtifact!.file).toEqual('foo.tree.json');
  expect(treeArtifact!.manifest).toMatchSnapshot();
});

test('assembly with invalid tree metadata', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'invalid-manifest-type-tree'));
  expect(() => assembly.tree()).toThrow(/Multiple artifacts/);
});

test('assembly with tree metadata having no file property specified', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'tree-no-file-property'))).toThrow(/Invalid TreeCloudArtifact/);
});

test('assembly with cloudformation artifact having no environment property specified', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'invalid-manifest-type-cloudformation'))).toThrow(/Invalid CloudFormation stack artifact/);
});

test('assembly with missing context', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'missing-context'));
  expect(assembly.manifest.missing).toMatchSnapshot();
});

test('assembly with multiple stacks', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'multiple-stacks'));
  expect(assembly.stacks).toHaveLength(2);
  expect(assembly.artifacts).toHaveLength(2);
});

test('fails for invalid artifact type', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'invalid-artifact-type'));
  expect(assembly.tryGetArtifact('MyArt')).toBeUndefined();
});

test('fails for invalid environment format', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'invalid-env-format')))
    .toThrow('Unable to parse environment specification');
});

test('fails if stack artifact does not have properties', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'stack-without-params')))
    .toThrow('Invalid CloudFormation stack artifact. Missing \"templateFile\" property in cloud assembly manifest');
});

test('messages', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'messages'));
  expect(assembly.stacks[0].messages).toMatchSnapshot();
});

test('assets', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'assets'));
  expect(assembly.stacks[0].assets).toMatchSnapshot();
});

test('can-read-0.36.0', () => {
  // WHEN
  new CloudAssembly(path.join(FIXTURES, 'single-stack-0.36'));
  // THEN: no eexception
  expect(true).toBeTruthy();
});

test('dependencies', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'depends'));
  expect(assembly.stacks).toHaveLength(4);

  // expect stacks to be listed in topological order
  expect(assembly.stacks.map(s => s.name)).toEqual([ 'StackA', 'StackD', 'StackC', 'StackB' ]);
  expect(assembly.stacks[0].dependencies).toEqual([]);
  expect(assembly.stacks[1].dependencies).toEqual([]);
  expect(assembly.stacks[2].dependencies.map(x => x.id)).toEqual([ 'StackD' ]);
  expect(assembly.stacks[3].dependencies.map(x => x.id)).toEqual([ 'StackC', 'StackD' ]);
});

test('fails for invalid dependencies', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'invalid-depends'))).toThrow('Artifact StackC depends on non-existing artifact StackX');
});

test('verifyManifestVersion', () => {
  verifyManifestVersion(CLOUD_ASSEMBLY_VERSION);
  expect(() => verifyManifestVersion('0.31.0')).toThrow(`A newer version of the CDK framework (>= ${CLOUD_ASSEMBLY_VERSION}) is necessary to interact with this version of the CLI`);
  expect(() => verifyManifestVersion('99.99.99')).toThrow(`A newer version of the CDK CLI (>= 99.99.99) is necessary to interact with this app`);
});