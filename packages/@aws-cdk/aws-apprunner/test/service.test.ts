import '@aws-cdk/assert-internal/jest';
import * as path from 'path';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service, ContainerImage, CodeRepository, Connection, CodeRuntime } from '../lib';

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
  new Service(stack, 'DemoService', {
    image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
    port: 80,
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

test('create a service with local assets(image repository type: ECR)', () => {
  // GIVEN
  const dockerAssets = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  // WHEN
  new Service(stack, 'DemoService', {
    image: ContainerImage.fromDockerImageAssets(dockerAssets),
    port: 80,
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
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess',
          ],
        ],
      },
    ],
  });
  // we should have the service
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: {
          'Fn::GetAtt': [
            'DemoServiceDefaultRole3CE46569',
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
              '/aws-cdk/assets:42ecd36e93a8da81231961db6fa8b9157145615726c4a70c06327b3e670514f4',
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
    connection: Connection.fromConnectionArn('MOCK'),
    code: CodeRepository.fromGithubRepository({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      branch: 'main',
      runtime: CodeRuntime.PYTHON_3,
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
    connection: Connection.fromConnectionArn('MOCK'),
    code: CodeRepository.fromGithubRepository({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      runtime: CodeRuntime.PYTHON_3,
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
  new Service(stack, 'DemoService', {
    image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
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

test('either image or code should be defined', () => {
  // WHEN
  const t = () => {
    new Service(stack, 'DemoService', {
      port: 80,
    });
  };

  // THEN
  // we should throw the error
  expect(t).toThrow('Either image or code is required, not both.');
});

test('Shoud not define both image and code', () => {
  // WHEN
  const t = () => {
    new Service(stack, 'DemoService', {
      image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
      connection: Connection.fromConnectionArn('MOCK'),
      code: CodeRepository.fromGithubRepository({
        repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        runtime: CodeRuntime.PYTHON_3,
      }),
      port: 80,
    });
  };

  // THEN
  // we should throw the error
  expect(t).toThrow('Either image or code is required, not both.');
});


test('connection is required with code', () => {
  // WHEN
  const t = () => {
    new Service(stack, 'DemoService', {
      code: CodeRepository.fromGithubRepository({
        repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        runtime: CodeRuntime.PYTHON_3,
      }),
      port: 80,
    });
  };

  // THEN
  // we should throw the error
  expect(t).toThrow('connection is required for github repository source.');
});

test('custom IAM role is allowed', () => {
  // WHEN
  // GIVEN
  const dockerAssets = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  // WHEN
  new Service(stack, 'DemoService', {
    image: ContainerImage.fromDockerImageAssets(dockerAssets),
    role: new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess'),
      ],
    }),
    port: 80,
  });
  // THEN
  // we should have the service with the branch value as 'main'
  expect(stack).toHaveResource('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        AccessRoleArn: {
          'Fn::GetAtt': [
            'Role1ABCC5F0',
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
              '/aws-cdk/assets:42ecd36e93a8da81231961db6fa8b9157145615726c4a70c06327b3e670514f4',
            ],
          ],
        },
        ImageRepositoryType: 'ECR',
      },
    },
  });
});


