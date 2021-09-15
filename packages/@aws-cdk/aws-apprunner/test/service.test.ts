import '@aws-cdk/assert-internal/jest';
import * as path from 'path';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service, ContainerImage, GitHubConnection, Runtime, Code, Cpu, Memory } from '../lib';

let app: cdk.App;
let env: { region: string; account: string };
let stack: cdk.Stack;


beforeEach(() => {
  app = new cdk.App();
  env = {
    region: 'us-east-1',
    account: '123456789012',
  };
  stack = new cdk.Stack(app, 'demo-stack', { env });
});

test('create a service with ECR Public(image repository type: ECR_PUBLIC)', () => {
  // WHEN
  const image = ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest');
  new Service(stack, 'DemoService', {
    source: Code.fromImage(image, { port: 80 }),
  });

  // THEN
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          Port: '80',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
  });
});

test('create a service from existing ECR repository(image repository type: ECR)', () => {
  // GIVEN
  const repo = ecr.Repository.fromRepositoryName(stack, 'NginxRepository', 'nginx');
  const image = ContainerImage.fromEcrRepository(repo);

  // WHEN
  new Service(stack, 'Service', {
    source: Code.fromImage(image, { port: 80 }),
  });

  // THEN
  // we should have an IAM role
  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'build.apprunner.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: {
          'Fn::GetAtt': [
            'ServiceAccessRole4763579D',
            'Arn',
          ],
        },
      },
      ImageRepository: {
        ImageConfiguration: {
          Port: '80',
        },
        ImageIdentifier: {
          'Fn::Join': [
            '',
            [
              '123456789012.dkr.ecr.us-east-1.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/nginx:latest',
            ],
          ],
        },
        ImageRepositoryType: 'ECR',
      },
    },
  });
});

test('create a service with local assets(image repository type: ECR)', () => {
  // GIVEN
  const dockerAssets = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  const image = ContainerImage.fromDockerImageAssets(dockerAssets);
  // WHEN
  new Service(stack, 'DemoService', {
    source: Code.fromImage(image, { port: 8000 }),
  });

  // THEN
  // we should have an IAM role
  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'build.apprunner.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: {
          'Fn::GetAtt': [
            'DemoServiceAccessRoleE7F08742',
            'Arn',
          ],
        },
      },
      ImageRepository: {
        ImageConfiguration: {
          Port: '8000',
        },
        ImageIdentifier: {
          'Fn::Join': [
            '',
            [
              '123456789012.dkr.ecr.us-east-1.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/aws-cdk/assets:e9db95c5eb5c683b56dbb8a1930ab8b028babb58b58058d72fa77071e38e66a4',
            ],
          ],
        },
        ImageRepositoryType: 'ECR',
      },
    },
  });
});


test('create a service with github repository', () => {
  // WHEN
  new Service(stack, 'DemoService', {
    source: Code.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      branch: 'main',
      runtime: Runtime.PYTHON_3,
      connection: GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });

  // THEN
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        ConnectionArn: 'MOCK',
      },
      CodeRepository: {
        CodeConfiguration: {
          ConfigurationSource: 'REPOSITORY',
        },
        RepositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        SourceCodeVersion: {
          Type: 'BRANCH',
          Value: 'main',
        },
      },
    },
  });
});

test('create a service with github repository - undefined branch name is allowed', () => {
  // WHEN
  new Service(stack, 'DemoService', {
    source: Code.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      runtime: Runtime.PYTHON_3,
      connection: GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });

  // THEN
  // we should have the service with the branch value as 'main'
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        ConnectionArn: 'MOCK',
      },
      CodeRepository: {
        CodeConfiguration: {
          ConfigurationSource: 'REPOSITORY',
        },
        RepositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        SourceCodeVersion: {
          Type: 'BRANCH',
          Value: 'main',
        },
      },
    },
  });
});


test('import from service name)', () => {
  // WHEN
  const svc = Service.fromServiceName(stack, 'ImportService', 'ExistingService');
  // THEN
  expect(svc).toHaveProperty('serviceName');
  expect(svc).toHaveProperty('serviceArn');
});

test('import from service attributes)', () => {
  // WHEN
  const svc = Service.fromServiceAttributes(stack, 'ImportService', {
    serviceName: 'mock',
    serviceArn: 'mock',
    serviceStatus: 'mock',
    serviceUrl: 'mock',
  });
  // THEN
  expect(svc).toHaveProperty('serviceName');
  expect(svc).toHaveProperty('serviceArn');
  expect(svc).toHaveProperty('serviceStatus');
  expect(svc).toHaveProperty('serviceUrl');
});


test('undefined port is allowed', () => {
  // WHEN
  const image = ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest');
  new Service(stack, 'Service', {
    source: Code.fromImage(image),
  });

  // THEN
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {},
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
  });
});

test('custom IAM access role and instance role are allowed', () => {
  // WHEN
  // GIVEN
  const dockerAssets = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  const image = ContainerImage.fromDockerImageAssets(dockerAssets);
  // WHEN
  new Service(stack, 'DemoService', {
    source: Code.fromImage(image, { port: 80 }),
    accessRole: new iam.Role(stack, 'AccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
      ],
    }),
    instanceRole: new iam.Role(stack, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    }),
  });
  // THEN
  // we should have the service with the branch value as 'main'
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: {
          'Fn::GetAtt': [
            'AccessRoleEC309AE6',
            'Arn',
          ],
        },
      },
      ImageRepository: {
        ImageConfiguration: {
          Port: '80',
        },
        ImageIdentifier: {
          'Fn::Join': [
            '',
            [
              '123456789012.dkr.ecr.us-east-1.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/aws-cdk/assets:e9db95c5eb5c683b56dbb8a1930ab8b028babb58b58058d72fa77071e38e66a4',
            ],
          ],
        },
        ImageRepositoryType: 'ECR',
      },
    },
    InstanceConfiguration: {
      InstanceRoleArn: {
        'Fn::GetAtt': [
          'InstanceRole3CCE2F1D',
          'Arn',
        ],
      },
    },
  });
});

test('cpu and memory properties are allowed', () => {
  // WHEN
  const image = ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest');
  new Service(stack, 'DemoService', {
    source: Code.fromImage(image, { port: 80 }),
    cpu: Cpu.ONE_VCPU,
    memory: Memory.THREE_GB,
  });
  // THEN
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    InstanceConfiguration: {
      Cpu: '1 vCPU',
      Memory: '3 GB',
    },
  });
});

test('custom cpu and memory units are allowed', () => {
  // WHEN
  const image = ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest');
  new Service(stack, 'DemoService', {
    source: Code.fromImage(image, { port: 80 }),
    cpu: Cpu.of('Some vCPU'),
    memory: Memory.of('Some GB'),
  });
  // THEN
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    InstanceConfiguration: {
      Cpu: 'Some vCPU',
      Memory: 'Some GB',
    },
  });
});
