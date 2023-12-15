import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as secretsmanager from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;
let secret: secretsmanager.ISecret;
let securityGroup: ec2.SecurityGroup;
let target: ec2.Connections;
beforeEach(() => {
  stack = new cdk.Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
  secret = new secretsmanager.Secret(stack, 'Secret');
  securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  target = new ec2.Connections({
    defaultPort: ec2.Port.tcp(3306),
    securityGroups: [securityGroup],
  });
});

test('secret rotation single user', () => {
  // GIVEN
  const excludeCharacters = ' ;+%{}' + '@\'"`/\\#'; // DMS and BASH problem chars

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    excludeCharacters: excludeCharacters,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    Description: 'from SecretRotationSecurityGroupAEC520AB:3306',
    FromPort: 3306,
    GroupId: {
      'Fn::GetAtt': [
        'SecurityGroupDD263621',
        'GroupId',
      ],
    },
    SourceSecurityGroupId: {
      'Fn::GetAtt': [
        'SecretRotationSecurityGroup9985012B',
        'GroupId',
      ],
    },
    ToPort: 3306,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    SecretId: {
      Ref: 'SecretA720EF05',
    },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'SecretRotationA9FFCFA9',
        'Outputs.RotationLambdaARN',
      ],
    },
    RotationRules: {
      ScheduleExpression: 'rate(30 days)',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupDescription: 'Default/SecretRotation/SecurityGroup',
  });

  Template.fromStack(stack).hasResource('AWS::Serverless::Application', {
    Properties: {
      Location: {
        ApplicationId: {
          'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'applicationId'],
        },
        SemanticVersion: {
          'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'semanticVersion'],
        },
      },
      Parameters: {
        endpoint: {
          'Fn::Join': [
            '',
            [
              'https://secretsmanager.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
        functionName: 'SecretRotation',
        excludeCharacters: excludeCharacters,
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            'SecretRotationSecurityGroup9985012B',
            'GroupId',
          ],
        },
        vpcSubnetIds: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
              },
              ',',
              {
                Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
              },
            ],
          ],
        },
      },
    },
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
    ResourcePolicy: {
      Statement: [
        {
          Action: 'secretsmanager:DeleteSecret',
          Effect: 'Deny',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
    SecretId: {
      Ref: 'SecretA720EF05',
    },
  });
});

test('secret rotation multi user', () => {
  // GIVEN
  const masterSecret = new secretsmanager.Secret(stack, 'MasterSecret');

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    secret,
    masterSecret,
    target,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': [
          '',
          [
            'https://secretsmanager.',
            {
              Ref: 'AWS::Region',
            },
            '.',
            {
              Ref: 'AWS::URLSuffix',
            },
          ],
        ],
      },
      functionName: 'SecretRotation',
      vpcSecurityGroupIds: {
        'Fn::GetAtt': [
          'SecretRotationSecurityGroup9985012B',
          'GroupId',
        ],
      },
      vpcSubnetIds: {
        'Fn::Join': [
          '',
          [
            {
              Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
            },
            ',',
            {
              Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
            },
          ],
        ],
      },
      masterSecretArn: {
        Ref: 'MasterSecretA11BF785',
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
    ResourcePolicy: {
      Statement: [
        {
          Action: 'secretsmanager:DeleteSecret',
          Effect: 'Deny',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
    SecretId: {
      Ref: 'MasterSecretA11BF785',
    },
  });
});

test('secret rotation allows passing an empty string for excludeCharacters', () => {
  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    excludeCharacters: '',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      excludeCharacters: '',
    },
  });
});

test('secret rotation without immediate rotation', () => {
  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    rotateImmediatelyOnUpdate: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    RotateImmediatelyOnUpdate: false,
  });
});

test('throws when connections object has no default port range', () => {
  // WHEN
  const targetWithoutDefaultPort = new ec2.Connections({
    securityGroups: [securityGroup],
  });

  // THEN
  expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
    secret,
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    vpc,
    target: targetWithoutDefaultPort,
  })).toThrow(/`target`.+default port range/);
});

test('throws when master secret is missing for a multi user application', () => {
  // THEN
  expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
    secret,
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    vpc,
    target,
  })).toThrow(/The `masterSecret` must be specified for application using the multi user scheme/);
});

test('rotation function name does not exceed 64 chars', () => {
  // WHEN
  const id = 'SecretRotation'.repeat(5);
  new secretsmanager.SecretRotation(stack, id, {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': [
          '',
          [
            'https://secretsmanager.',
            {
              Ref: 'AWS::Region',
            },
            '.',
            {
              Ref: 'AWS::URLSuffix',
            },
          ],
        ],
      },
      functionName: 'RotationSecretRotationSecretRotationSecretRotationSecretRotation',
      vpcSecurityGroupIds: {
        'Fn::GetAtt': [
          'SecretRotationSecretRotationSecretRotationSecretRotationSecretRotationSecurityGroupBFCB171A',
          'GroupId',
        ],
      },
      vpcSubnetIds: {
        'Fn::Join': [
          '',
          [
            {
              Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
            },
            ',',
            {
              Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
            },
          ],
        ],
      },
    },
  });
});

test('with interface vpc endpoint', () => {
  // GIVEN
  const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'SecretsManagerEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    vpc,
  });

  // WHEN
  new secretsmanager.SecretRotation(stack, 'SecretRotation', {
    application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secret,
    target,
    vpc,
    endpoint,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
    Parameters: {
      endpoint: {
        'Fn::Join': ['', [
          'https://',
          { Ref: 'SecretsManagerEndpoint5E83C66B' },
          '.secretsmanager.',
          { Ref: 'AWS::Region' },
          '.',
          { Ref: 'AWS::URLSuffix' },
        ]],
      },
    },
  });
});
