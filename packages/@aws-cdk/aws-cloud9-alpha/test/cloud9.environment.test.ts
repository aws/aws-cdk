import { Match, Template } from 'aws-cdk-lib/assertions';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as cloud9 from '../lib';
import { ConnectionType, ImageId, Owner } from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

beforeEach(() => {
  stack = new cdk.Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
});

test('create resource correctly with only vpc and imageId provided', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
  });
  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Cloud9::EnvironmentEC2', 1);
});

test('create resource correctly with vpc, imageId, and subnetSelection', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    subnetSelection: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
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
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
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
      imageId: cloud9.ImageId.AMAZON_LINUX_2,
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
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
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

test('environment owner can be an IAM user', () => {
  // WHEN
  const user = new iam.User(stack, 'User', {
    userName: 'testUser',
  });
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
    owner: Owner.user(user),
  });

  // THEN
  const userLogicalId = stack.getLogicalId(user.node.defaultChild as iam.CfnUser);
  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    OwnerArn: {
      'Fn::GetAtt': [userLogicalId, 'Arn'],
    },
  });
});

test('environment owner can be an IAM Assumed Role', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
    owner: Owner.assumedRole('123456789098', 'Admin'),
  });
  // THEN

  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    OwnerArn: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':sts::123456789098:assumed-role/Admin']] },
  });
});

test('environment owner can be an IAM Federated User', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
    owner: Owner.federatedUser('123456789098', 'Admin'),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    OwnerArn: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':sts::123456789098:federated-user/Admin']] },
  });
});

test('environment owner can be account root', () => {
  // WHEN
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
    owner: Owner.accountRoot('12345678'),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    OwnerArn: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::12345678:root']] },
  });
});

test('can set automaticStop', () => {
  // WHEN
  const automaticStop = cdk.Duration.minutes(30);
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
    automaticStop,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    AutomaticStopTimeMinutes: automaticStop.toMinutes(),
  });
});

test.each([
  [ConnectionType.CONNECT_SSH, 'CONNECT_SSH'],
  [ConnectionType.CONNECT_SSM, 'CONNECT_SSM'],
  [undefined, 'CONNECT_SSH'],
])('has connection type property (%s)', (connectionType, expected) => {
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    connectionType,
    imageId: cloud9.ImageId.AMAZON_LINUX_2,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    InstanceType: Match.anyValue(),
    ConnectionType: expected,
    SubnetId: Match.anyValue(),
  });
});

test.each([
  [ImageId.AMAZON_LINUX_2, 'amazonlinux-2-x86_64'],
  [ImageId.AMAZON_LINUX_2023, 'amazonlinux-2023-x86_64'],
  [ImageId.UBUNTU_18_04, 'ubuntu-18.04-x86_64'],
  [ImageId.UBUNTU_22_04, 'ubuntu-22.04-x86_64'],
])('has image ID property (%s)', (imageId, expected) => {
  new cloud9.Ec2Environment(stack, 'C9Env', {
    vpc,
    imageId: imageId,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Cloud9::EnvironmentEC2', {
    InstanceType: Match.anyValue(),
    ImageId: expected,
    SubnetId: Match.anyValue(),
  });
});
