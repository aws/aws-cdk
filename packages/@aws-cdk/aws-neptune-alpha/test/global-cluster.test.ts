import { Stack, Tags } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DatabaseCluster, EngineVersion, GlobalCluster, InstanceType } from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

test('creates a global cluster from minimal properties', () => {
  new GlobalCluster(stack, 'Global');

  Template.fromStack(stack).hasResourceProperties('AWS::Neptune::GlobalCluster', {
    Engine: 'neptune',
  });
});

test('creates a global cluster from all properties', () => {
  new GlobalCluster(stack, 'Global', {
    globalClusterIdentifier: 'my-global-cluster',
    engineVersion: EngineVersion.V1_3_0_0,
    deletionProtection: true,
    storageEncrypted: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Neptune::GlobalCluster', {
    GlobalClusterIdentifier: 'my-global-cluster',
    Engine: 'neptune',
    EngineVersion: '1.3.0.0',
    DeletionProtection: true,
    StorageEncrypted: true,
  });
});

test('creates a global cluster from a source cluster', () => {
  const vpc = new ec2.Vpc(stack, 'VPC');
  const sourceCluster = new DatabaseCluster(stack, 'Database', {
    vpc,
    instanceType: InstanceType.R5_LARGE,
  });

  new GlobalCluster(stack, 'Global', { sourceCluster });

  const template = Template.fromStack(stack);
  // Engine, EngineVersion and StorageEncrypted are inherited from the source cluster.
  template.hasResourceProperties('AWS::Neptune::GlobalCluster', {
    Engine: Match.absent(),
    EngineVersion: Match.absent(),
    StorageEncrypted: Match.absent(),
    SourceDBClusterIdentifier: {
      'Fn::Join': ['', Match.arrayWith([':rds:'])],
    },
  });
});

test('fails when both sourceCluster and engineVersion are provided', () => {
  const vpc = new ec2.Vpc(stack, 'VPC');
  const sourceCluster = new DatabaseCluster(stack, 'Database', {
    vpc,
    instanceType: InstanceType.R5_LARGE,
  });

  expect(() => new GlobalCluster(stack, 'Global', {
    sourceCluster,
    engineVersion: EngineVersion.V1_3_0_0,
  })).toThrow(/cannot specify both sourceCluster and engineVersion/);
});

test('fails when both sourceCluster and storageEncrypted are provided', () => {
  const vpc = new ec2.Vpc(stack, 'VPC');
  const sourceCluster = new DatabaseCluster(stack, 'Database', {
    vpc,
    instanceType: InstanceType.R5_LARGE,
  });

  expect(() => new GlobalCluster(stack, 'Global', {
    sourceCluster,
    storageEncrypted: false,
  })).toThrow(/cannot specify both sourceCluster and storageEncrypted/);
});

test.each([
  ['', /between 1 and 63 characters/],
  ['a'.repeat(64), /between 1 and 63 characters/],
  ['1invalid', /must start with a lowercase letter/],
  ['Invalid', /must start with a lowercase letter/],
  ['ends-', /must start with a lowercase letter/],
  ['two--hyphens', /must start with a lowercase letter/],
])('fails for invalid globalClusterIdentifier %j', (identifier, expected) => {
  expect(() => new GlobalCluster(stack, 'Global', {
    globalClusterIdentifier: identifier,
  })).toThrow(expected);
});

test('does not validate a tokenized globalClusterIdentifier', () => {
  expect(() => new GlobalCluster(stack, 'Global', {
    globalClusterIdentifier: Stack.of(stack).account,
  })).not.toThrow();
});

test('propagates tags to the underlying resource', () => {
  const globalCluster = new GlobalCluster(stack, 'Global');
  Tags.of(globalCluster).add('Environment', 'production');

  Template.fromStack(stack).hasResourceProperties('AWS::Neptune::GlobalCluster', {
    Tags: [{ Key: 'Environment', Value: 'production' }],
  });
});

test('a database cluster can join a global database cluster', () => {
  const vpc = new ec2.Vpc(stack, 'VPC');
  const globalCluster = new GlobalCluster(stack, 'Global', {
    globalClusterIdentifier: 'my-global-cluster',
  });

  new DatabaseCluster(stack, 'Database', {
    vpc,
    instanceType: InstanceType.R5_LARGE,
    globalCluster,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBCluster', {
    GlobalClusterIdentifier: { Ref: Match.stringLikeRegexp('Global.*') },
  });
});

test('import global cluster by identifier', () => {
  const globalCluster = GlobalCluster.fromGlobalClusterIdentifier(stack, 'Global', 'my-global-cluster');
  expect(globalCluster.globalClusterIdentifier).toBe('my-global-cluster');
});
