import { Template } from '@aws-cdk/assertions';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

beforeEach(() => {
  stack = new cdk.Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
});

test('create resource correctly with only vpc provide', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', { vpc });
  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Cloud9::EnvironmentEC2', 1);
});

test('create resource correctly with both vpc and subnetSelectio', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    subnetSelection: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
    },
  });
  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Cloud9::EnvironmentEC2', 1);
});

test('import correctly from existing environment', () => {
  // WHEN
  const c9env = cloud9.Ec2Environment.fromEc2EnvironmentName(stack, 'ImportedEnv', 'existingEnvName');
  // THEN
  expect(c9env).toHaveProperty('ec2EnvironmentName');
});

test('create correctly with instanceType specified', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  });
  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Cloud9::EnvironmentEC2', 1);
});

test('throw error when subnetSelection not specified and the provided VPC has no public subnets', () => {
  // WHEN
  const privateOnlyVpc = new ec2.Vpc(stack, 'PrivateOnlyVpc', {
    maxAzs: 2,
    subnetConfiguration: [
      {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        name: 'IsolatedSubnet',
        cidrMask: 24,
      },
    ],
  });
  // THEN
  expect(() => {
    new cloud9.Ec2Environment(stack, 'C9Env', {
      vpc: privateOnlyVpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
    });
  }).toThrow(/no subnetSelection specified and no public subnet found in the vpc, please specify subnetSelection/);
});

test('can use CodeCommit repositories', () => {
  // WHEN
  const repo = codecommit.Repository.fromRepositoryName(stack, 'Repo', 'foo');

  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    clonedRepositories: [
      cloud9.CloneRepository.fromCodeCommit(repo, '/src'),
    ],
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    InstanceType: 't2.micro',
    Repositories: [
      {
        PathComponent: '/src',
        RepositoryUrl: {
          'Fn::Join': [
            '',
            [
              'https://git-codecommit.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/v1/repos/foo',
            ],
          ],
        },
      },
    ],
  });
});
