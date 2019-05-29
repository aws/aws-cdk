import path = require('path');
import { CloudAssembly } from '../lib';
import { CLOUD_ASSEMBLY_VERSION, verifyManifestVersion } from '../lib/versioning';

const FIXTURES = path.join(__dirname, 'fixtures');

test('empty assembly', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'empty'));
  expect(assembly.artifacts).toEqual([]);
  expect(assembly.missing).toBeUndefined();
  expect(assembly.runtime).toEqual({ libraries: { } });
  expect(assembly.stacks).toEqual([]);
  expect(assembly.version).toEqual(CLOUD_ASSEMBLY_VERSION);
});

test('assembly a single cloudformation stack', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'single-stack'));
  expect(assembly.artifacts).toHaveLength(1);
  expect(assembly.stacks).toHaveLength(1);
  expect(assembly.missing).toBeUndefined();
  expect(assembly.runtime).toEqual({ libraries: { } });
  expect(assembly.version).toEqual(CLOUD_ASSEMBLY_VERSION);
  expect(assembly.artifacts[0]).toEqual(assembly.stacks[0]);

  const stack = assembly.stacks[0];
  expect(stack.assets).toHaveLength(0);
  expect(stack.autoDeploy).toBeTruthy();
  expect(stack.depends).toEqual([]);
  expect(stack.environment).toEqual({ account: '37736633', region: 'us-region-1', name: 'aws://37736633/us-region-1' });
  expect(stack.template).toEqual({ Resources: { MyBucket: { Type: "AWS::S3::Bucket" } } });
  expect(stack.messages).toEqual([]);
  expect(stack.metadata).toEqual({});
  expect(stack.missing).toEqual({});
  expect(stack.originalName).toEqual('MyStackName');
  expect(stack.name).toEqual('MyStackName');
  expect(stack.logicalIdToPathMap).toEqual({});
});

test('assembly with missing context', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'missing-context'));
  expect(assembly.missing).toMatchSnapshot();
});

test('assembly with multiple stacks', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'multiple-stacks'));
  expect(assembly.stacks).toHaveLength(2);
  expect(assembly.artifacts).toHaveLength(2);
});

test('fails for invalid artifact type', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'invalid-artifact-type')))
    .toThrow('unsupported artifact type: who:am:i');
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

test('logical id to path map', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'logical-id-map'));
  expect(assembly.stacks[0].logicalIdToPathMap).toEqual({ logicalIdOfFooBar: '/foo/bar' });
});

test('dependencies', () => {
  const assembly = new CloudAssembly(path.join(FIXTURES, 'depends'));
  expect(assembly.stacks).toHaveLength(4);

  // expect stacks to be listed in topological order
  expect(assembly.stacks.map(s => s.name)).toEqual([ 'StackA', 'StackD', 'StackC', 'StackB' ]);
  expect(assembly.stacks[0].depends).toEqual([]);
  expect(assembly.stacks[1].depends).toEqual([]);
  expect(assembly.stacks[2].depends.map(x => x.id)).toEqual([ 'StackD' ]);
  expect(assembly.stacks[3].depends.map(x => x.id)).toEqual([ 'StackC', 'StackD' ]);
});

test('fails for invalid dependencies', () => {
  expect(() => new CloudAssembly(path.join(FIXTURES, 'invalid-depends'))).toThrow('Artifact StackC depends on non-existing artifact StackX');
});

test('verifyManifestVersion', () => {
  verifyManifestVersion('0.33.0');
  expect(() => verifyManifestVersion('0.31.0')).toThrow('App used framework v0.31.0 but it must be >= v0.33.0 in order to interact with this CLI');
  expect(() => verifyManifestVersion('0.34.0')).toThrow('CLI >= 0.34.0 is required to interact with this app');
});