import * as path from 'path';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from 'aws-cdk-lib';
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
  // we should have a following IAM Policy
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: 'ecr:GetAuthorizationToken',
          Resource: '*',
        },
        {
          Effect: 'Allow',
          Action: [
            'ecr:BatchCheckLayerAvailability',
            'ecr:GetDownloadUrlForLayer',
            'ecr:BatchGetImage',
          ],
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':ecr:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':repository/nginx',
            ]],
          },
        },
        {
          Effect: 'Allow',
          Action: 'ecr:DescribeImages',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':ecr:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':repository/nginx',
            ]],
          },
        },
      ],
    },
    PolicyName: 'ServiceAccessRoleDefaultPolicy9C214812',
    Roles: [
      { Ref: 'ServiceAccessRole4763579D' },
    ],
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
    directory: path.join(__dirname, 'docker.assets'),
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

test('serviceName validation', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const svc = new apprunner.Service(stack, 'CustomService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // THEN
  // the serviceName should not be the resource.ref
  expect(svc.serviceName).not.toEqual((svc.node.defaultChild as cdk.CfnResource).ref);
  // serviceName and serviceArn should be different
  expect(svc.serviceName).not.toEqual(svc.serviceArn);
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
    directory: path.join(__dirname, 'docker.assets'),
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

test('cpu and memory properties as unit values are allowed', () => {
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

test('cpu and memory properties as numeric values are allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    cpu: apprunner.Cpu.of('1024'),
    memory: apprunner.Memory.of('3072'),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    InstanceConfiguration: {
      Cpu: '1024',
      Memory: '3072',
    },
    NetworkConfiguration: {
      EgressConfiguration: {
        EgressType: 'DEFAULT',
      },
    },
  });
});

test('invalid cpu property as unit value is not allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      cpu: apprunner.Cpu.of('1000 vCPU'),
      memory: apprunner.Memory.of('3 GB'),
    });
  }).toThrow('CPU value is invalid');
});

test('invalid cpu property as numeric value is not allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      cpu: apprunner.Cpu.of('1'),
      memory: apprunner.Memory.of('3 GB'),
    });
  }).toThrow('CPU value is invalid');
});

test('invalid memory property as unit value is not allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      cpu: apprunner.Cpu.of('1 vCPU'),
      memory: apprunner.Memory.of('3000 GB'),
    });
  }).toThrow('Memory value is invalid');
});

test('invalid memory property as numeric value is not allowed', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      cpu: apprunner.Cpu.of('1 vCPU'),
      memory: apprunner.Memory.of('3'),
    });
  }).toThrow('Memory value is invalid');
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
    directory: path.join(__dirname, 'docker.assets'),
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

test('serviceName is set', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const serviceName = 'demo-service';
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    serviceName: serviceName,
    source: apprunner.Source.fromGitHub({
      repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
      branch: 'main',
      configurationSource: apprunner.ConfigurationSourceType.REPOSITORY,
      connection: apprunner.GitHubConnection.fromConnectionArn('MOCK'),
    }),
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    ServiceName: serviceName,
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

test('Service is grantable', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn: 'arn:aws:s3:::my-bucket' });
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    instanceRole: new iam.Role(stack, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    }),
  });

  bucket.grantRead(service);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            's3:GetObject*',
            's3:GetBucket*',
            's3:List*',
          ],
          Resource: [
            'arn:aws:s3:::my-bucket',
            'arn:aws:s3:::my-bucket/*',
          ],
        },
      ],
    },
    PolicyName: 'InstanceRoleDefaultPolicy1531605C',
    Roles: [
      { Ref: 'InstanceRole3CCE2F1D' },
    ],
  });
});

test('addToRolePolicy', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn: 'arn:aws:s3:::my-bucket' });
  const service = new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  service.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['s3:GetObject'],
    resources: [bucket.bucketArn],
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::my-bucket',
        },
      ],
    },
    PolicyName: 'DemoServiceInstanceRoleDefaultPolicy9600BEA1',
    Roles: [
      { Ref: 'DemoServiceInstanceRoleFCED1725' },
    ],
  });
});

test('Service has healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    healthCheck: apprunner.HealthCheck.http({
      healthyThreshold: 5,
      interval: cdk.Duration.seconds(5),
      path: '/',
      timeout: cdk.Duration.seconds(2),
      unhealthyThreshold: 5,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    HealthCheckConfiguration: {
      HealthyThreshold: 5,
      Interval: 5,
      Path: '/',
      Protocol: 'HTTP',
      Timeout: 2,
      UnhealthyThreshold: 5,
    },
  });
});

test('path cannot be empty in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(5),
        path: '',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('path length must be greater than 0');
});

test('healthyThreshold must be greater than or equal to 1 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 0,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('healthyThreshold must be between 1 and 20, got 0');
});

test('healthyThreshold must be less than or equal to 20 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 21,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('healthyThreshold must be between 1 and 20, got 21');
});

test('unhealthyThreshold must be greater than or equal to 1 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 0,
      }),
    });
  }).toThrow('unhealthyThreshold must be between 1 and 20, got 0');
});

test('unhealthyThreshold must be less than or equal to 20 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 21,
      }),
    });
  }).toThrow('unhealthyThreshold must be between 1 and 20, got 21');
});

test('interval must be greater than or equal to 1 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(0),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('interval must be between 1 and 20 seconds, got 0');
});

test('interval must be less than or equal to 20 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(21),
        path: '/',
        timeout: cdk.Duration.seconds(2),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('interval must be between 1 and 20 seconds, got 21');
});

test('timeout must be greater than or equal to 1 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(0),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('timeout must be between 1 and 20 seconds, got 0');
});

test('timeout must be less than or equal to 20 in healthCheck', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      healthCheck: apprunner.HealthCheck.http({
        healthyThreshold: 5,
        interval: cdk.Duration.seconds(5),
        path: '/',
        timeout: cdk.Duration.seconds(21),
        unhealthyThreshold: 5,
      }),
    });
  }).toThrow('timeout must be between 1 and 20 seconds, got 21');
});

test('create a service with a customer managed key)', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const key = new kms.Key(stack, 'Key');

  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    kmsKey: key,
  });

  // THEN
  // we should have the service
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    EncryptionConfiguration: {
      KmsKey: stack.resolve(key.keyArn),
    },
  });
});

test.each([apprunner.IpAddressType.IPV4, apprunner.IpAddressType.DUAL_STACK])('ipAddressType is set %s', (ipAddressType: apprunner.IpAddressType) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    ipAddressType,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    NetworkConfiguration: {
      IpAddressType: ipAddressType,
    },
  });
});

test('create a service with an AutoScalingConfiguration', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const autoScalingConfiguration = new apprunner.AutoScalingConfiguration(stack, 'AutoScalingConfiguration', {
    autoScalingConfigurationName: 'MyAutoScalingConfiguration',
  });

  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    autoScalingConfiguration,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
    AutoScalingConfigurationName: 'MyAutoScalingConfiguration',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    AutoScalingConfigurationArn: stack.resolve(autoScalingConfiguration.autoScalingConfigurationArn),
  });
});

test('create a service with a Observability Configuration', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  const observabilityConfiguration = new apprunner.ObservabilityConfiguration(stack, 'ObservabilityConfiguration', {
    observabilityConfigurationName: 'MyObservabilityConfiguration',
    traceConfigurationVendor: apprunner.TraceConfigurationVendor.AWSXRAY,
  });

  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    observabilityConfiguration,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::ObservabilityConfiguration', {
    ObservabilityConfigurationName: 'MyObservabilityConfiguration',
    TraceConfiguration: {
      Vendor: 'AWSXRAY',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    ObservabilityConfiguration: {
      ObservabilityEnabled: true,
      ObservabilityConfigurationArn: stack.resolve(observabilityConfiguration.observabilityConfigurationArn),
    },
  });
});

test('create a service without a Observability Configuration', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    ObservabilityConfiguration: Match.absent(),
  });
});

test.each([true, false])('isPubliclyAccessible is set %s', (isPubliclyAccessible: boolean) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  new apprunner.Service(stack, 'DemoService', {
    source: apprunner.Source.fromEcrPublic({
      imageConfiguration: { port: 8000 },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
    isPubliclyAccessible,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::Service', {
    NetworkConfiguration: {
      IngressConfiguration: {
        IsPubliclyAccessible: isPubliclyAccessible,
      },
    },
  });
});

test.each([
  ['tes'],
  ['test-service-name-over-limitation-apprunner'],
])('serviceName length is invalid (name: %s)', (serviceName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: { port: 8000 },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      serviceName,
    });
  }).toThrow(`\`serviceName\` must be between 4 and 40 characters, got: ${serviceName.length} characters.`);
});

test.each([
  ['-test'],
  ['test-?'],
  ['test-\\'],
])('serviceName includes invalid characters (name: %s)', (serviceName: string) => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  expect(() => {
    new apprunner.Service(stack, 'DemoService', {
      source: apprunner.Source.fromEcrPublic({
        imageConfiguration: { port: 8000 },
        imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
      }),
      serviceName,
    });
  }).toThrow(`\`serviceName\` must start with an alphanumeric character and contain only alphanumeric characters, hyphens, or underscores after that, got: ${serviceName}.`);
});
