import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as apprunner from '../lib';

test('create a service with ECR Public(image repository type: ECR_PUBLIC)', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          Port: '8000',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment variables and start commands are allowed for imageConfiguration with defined port', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
        environmentVariables: {
          TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
        },
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  service.addEnvironmentVariable('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          Port: '8000',
          RuntimeEnvironmentVariables: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE',
              Value: 'test environment variable value',
            },
            {
              Name: 'SECOND_ENVIRONEMENT_VARIABLE',
              Value: 'second test value',
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment secrets and start commands are allowed for imageConfiguration with defined port', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
    parameterName: '/name',
    version: 1,
  });

  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
        environmentSecrets: {
          SECRET: apprunner.Secret.fromSecretsManager(secret),
          PARAMETER: apprunner.Secret.fromSsmParameter(parameter),
          SECRET_ID: apprunner.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }),
          SECRET_STAGE: apprunner.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }),
        },
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  service.addSecret('LATER_SECRET', apprunner.Secret.fromSecretsManager(secret, 'field'));

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          Port: '8000',
          RuntimeEnvironmentSecrets: [
            {
              Name: 'SECRET',
              Value: {
                Ref: 'SecretA720EF05',
              },
            },
            {
              Name: 'PARAMETER',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ssm:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':parameter/name',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_ID',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':::version-id',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_STAGE',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    '::version-stage:',
                  ],
                ],
              },
            },
            {
              Name: 'LATER_SECRET',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':field::',
                  ],
                ],
              },
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment variables and start commands are allowed for imageConfiguration with port undefined', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        environmentVariables: {
          TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
        },
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  service.addEnvironmentVariable('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          RuntimeEnvironmentVariables: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE',
              Value: 'test environment variable value',
            },
            {
              Name: 'SECOND_ENVIRONEMENT_VARIABLE',
              Value: 'second test value',
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment secrets and start commands are allowed for imageConfiguration with port undefined', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
    parameterName: '/name',
    version: 1,
  });

  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        environmentSecrets: {
          SECRET: apprunner.Secret.fromSecretsManager(secret),
          PARAMETER: apprunner.Secret.fromSsmParameter(parameter),
          SECRET_ID: apprunner.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }),
          SECRET_STAGE: apprunner.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }),
        },
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  service.addSecret('LATER_SECRET', apprunner.Secret.fromSecretsManager(secret, 'field'));

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          RuntimeEnvironmentSecrets: [
            {
              Name: 'SECRET',
              Value: {
                Ref: 'SecretA720EF05',
              },
            },
            {
              Name: 'PARAMETER',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ssm:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':parameter/name',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_ID',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':::version-id',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_STAGE',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    '::version-stage:',
                  ],
                ],
              },
            },
            {
              Name: 'LATER_SECRET',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':field::',
                  ],
                ],
              },
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment variables can be added with .addEnvironmentVariable() without first defining them in props', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // WHEN
  service.addEnvironmentVariable('TEST_ENVIRONMENT_VARIABLE', 'test environment variable value');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          RuntimeEnvironmentVariables: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE',
              Value: 'test environment variable value',
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom environment secrets can be added with .addSecret() without first defining them in props', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: {
        startCommand: '/root/start-command.sh',
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // WHEN
  service.addSecret('LATER_SECRET', apprunner.Secret.fromSecretsManager(secret, 'field'));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageConfiguration: {
          RuntimeEnvironmentSecrets: [
            {
              Name: 'LATER_SECRET',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':field::',
                  ],
                ],
              },
            },
          ],
          StartCommand: '/root/start-command.sh',
        },
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
    InstanceConfiguration: {
      InstanceRoleArn: {
        'Fn::GetAtt': [
          'DemoServiceInstanceRoleFCED1725',
          'Arn',
        ],
      },
    },
  });
});

test('create a service from existing ECR repository(image repository type: ECR)', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'Service', {
    source: apprunner.Source.fromEcr({
      imageConfiguration: { port: 80 },
      repository: ecr.Repository.fromRepositoryName(stack, 'NginxRepository', 'nginx'),
    }),
  });

  // THEN
  // we should have an IAM role
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
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
              {
                Ref: 'AWS::AccountId',
              },
              '.dkr.ecr.',
              {
                Ref: 'AWS::Region',
              },
              '.',
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
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('create a service with local assets(image repository type: ECR)', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const dockerAsset = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromAsset({
      imageConfiguration: { port: 8000 },
      asset: dockerAsset,
    }),
  });

  // THEN
  // we should have an IAM role
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
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
          'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:77284835684772d19c95f4f5a37e7618d5f9efc40db9321d44ac039db457b967',
        },
        ImageRepositoryType: 'ECR',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});


test('create a service with github repository', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      branch: 'main',
      configurationSource: apprunner.ConfigurationSourceType.REPOSITORY,
      connection: apprunner.GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
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
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('create a service with github repository - undefined branch name is allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      configurationSource: apprunner.ConfigurationSourceType.API,
      codeConfigurationValues: {
        runtime: apprunner.Runtime.PYTHON_3,
        port: '8000',
      },
      connection: apprunner.GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });

  // THEN
  // we should have the service with the branch value as 'main'
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        ConnectionArn: 'MOCK',
      },
      CodeRepository: {
        CodeConfiguration: {
          CodeConfigurationValues: {
            Port: '8000',
            Runtime: 'PYTHON_3',
          },
          ConfigurationSource: 'API',
        },
        RepositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        SourceCodeVersion: {
          Type: 'BRANCH',
          Value: 'main',
        },
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('create a service with github repository - buildCommand, environment and startCommand are allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      configurationSource: apprunner.ConfigurationSourceType.API,
      codeConfigurationValues: {
        runtime: apprunner.Runtime.PYTHON_3,
        port: '8000',
        buildCommand: '/root/build.sh',
        environmentVariables: {
          TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
        },
        startCommand: '/root/start.sh',
      },
      connection: apprunner.GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });

  service.addEnvironmentVariable('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');

  // THEN
  // we should have the service with the branch value as 'main'
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {
        ConnectionArn: 'MOCK',
      },
      CodeRepository: {
        CodeConfiguration: {
          CodeConfigurationValues: {
            Port: '8000',
            Runtime: 'PYTHON_3',
            BuildCommand: '/root/build.sh',
            RuntimeEnvironmentVariables: [
              {
                Name: 'TEST_ENVIRONMENT_VARIABLE',
                Value: 'test environment variable value',
              },
              {
                Name: 'SECOND_ENVIRONEMENT_VARIABLE',
                Value: 'second test value',
              },
            ],
            StartCommand: '/root/start.sh',
          },
          ConfigurationSource: 'API',
        },
        RepositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
        SourceCodeVersion: {
          Type: 'BRANCH',
          Value: 'main',
        },
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});


test('import from service name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const svc = apprunner.Service.fromServiceName(stack, 'ImportService', 'ExistingService');
  // THEN
  expect(svc).toHaveProperty('serviceName');
  expect(svc).toHaveProperty('serviceArn');
});

test('import from service attributes', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const svc = apprunner.Service.fromServiceAttributes(stack, 'ImportService', {
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


test('undefined imageConfiguration port is allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'Service', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AuthenticationConfiguration: {},
      ImageRepository: {
        ImageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
        ImageRepositoryType: 'ECR_PUBLIC',
      },
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom IAM access role and instance role are allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const dockerAsset = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromAsset({
      asset: dockerAsset,
      imageConfiguration: { port: 8000 },
    }),
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
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
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
          Port: '8000',
        },
        ImageIdentifier: {
          'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:77284835684772d19c95f4f5a37e7618d5f9efc40db9321d44ac039db457b967',
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
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('cpu and memory properties are allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    cpu: apprunner.Cpu.ONE_VCPU,
    memory: apprunner.Memory.THREE_GB,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    InstanceConfiguration: {
      Cpu: '1 vCPU',
      Memory: '3 GB',
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('custom cpu and memory units are allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    cpu: apprunner.Cpu.of('Some vCPU'),
    memory: apprunner.Memory.of('Some GB'),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    InstanceConfiguration: {
      Cpu: 'Some vCPU',
      Memory: 'Some GB',
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('environment variable with a prefix of AWSAPPRUNNER should throw an error', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  // we should have the service
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: {
          environmentVariables: {
            AWSAPPRUNNER_FOO: 'bar',
          },
        },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
    });
  }).toThrow('Environment variable key AWSAPPRUNNER_FOO with a prefix of AWSAPPRUNNER is not allowed');
});

test('environment variable with a prefix of AWSAPPRUNNER added later should throw an error', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  // we should have the service
  expect(() => {
    const service = new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
    });
    service.addEnvironmentVariable('AWSAPPRUNNER_FOO', 'BAR');
  }).toThrow('Environment variable key AWSAPPRUNNER_FOO with a prefix of AWSAPPRUNNER is not allowed');
});

test('environment secrets with a prefix of AWSAPPRUNNER should throw an error', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const secret = new secretsmanager.Secret(stack, 'Secret');

  // WHEN
  // we should have the service
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: {
          environmentSecrets: {
            AWSAPPRUNNER_FOO: apprunner.Secret.fromSecretsManager(secret),
          },
        },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
    });
  }).toThrow('Environment secret key AWSAPPRUNNER_FOO with a prefix of AWSAPPRUNNER is not allowed');
});

test('environment secrets with a prefix of AWSAPPRUNNER added later should throw an error', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const secret = new secretsmanager.Secret(stack, 'Secret');

  // WHEN
  // we should have the service
  expect(() => {
    const service = new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
    });
    service.addSecret('AWSAPPRUNNER_FOO', apprunner.Secret.fromSecretsManager(secret));
  }).toThrow('Environment secret key AWSAPPRUNNER_FOO with a prefix of AWSAPPRUNNER is not allowed');
});

test('specifying a vpcConnector should assign the service to it and set the egressType to VPC', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

  const vpcConnector = new apprunner.VpcConnector(stack, 'VpcConnector', {
    securityGroups: [securityGroup],
    vpc,
    vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    vpcConnectorName: 'MyVpcConnector',
  });
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    vpcConnector,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'VPC',
        VpcConnectorArn: {
          'Fn::GetAtt': [
            'VpcConnectorE3A78531',
            'VpcConnectorArn',
          ],
        },
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
    ],
    VpcConnectorName: 'MyVpcConnector',
  });
});

test('autoDeploymentsEnabled flag is set true', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const dockerAsset = new ecr_assets.DockerImageAsset(stack, 'Assets', {
    directory: path.join(__dirname, './docker.assets'),
  });
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromAsset({
      imageConfiguration: { port: 8000 },
      asset: dockerAsset,
    }),
    autoDeploymentsEnabled: true,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AutoDeploymentsEnabled: true,
    },
  });
});

test('autoDeploymentsEnabled flag is set false', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      branch: 'main',
      configurationSource: apprunner.ConfigurationSourceType.REPOSITORY,
      connection: apprunner.GitHubConnection.fromConnectionArn('MOCK'),
    }),
    autoDeploymentsEnabled: false,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AutoDeploymentsEnabled: false,
    },
  });
});

test('autoDeploymentsEnabled flag is NOT set', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    SourceConfiguration: {
      AutoDeploymentsEnabled: Match.absent(),
    },
  });
});

testDeprecated('Using both environmentVariables and environment should throw an error', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: {
          environmentVariables: {
            AWSAPPRUNNER_FOO: 'bar',
          },
          environment: {
            AWSAPPRUNNER_FOO: 'bar',
          },
        },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
    });
  }).toThrow(/You cannot set both \'environmentVariables\' and \'environment\' properties./);
});