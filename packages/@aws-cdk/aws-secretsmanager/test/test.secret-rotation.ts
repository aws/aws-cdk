import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { ICallbackFunction, Test } from 'nodeunit';
import * as secretsmanager from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;
let secret: secretsmanager.ISecret;
let securityGroup: ec2.SecurityGroup;
let target: ec2.Connections;

export = {
  'setUp'(cb: ICallbackFunction) {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
    secret = new secretsmanager.Secret(stack, 'Secret');
    securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    target = new ec2.Connections({
      defaultPort: ec2.Port.tcp(3306),
      securityGroups: [securityGroup],
    });

    cb();
  },

  'secret rotation single user'(test: Test) {
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
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
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
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
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
        AutomaticallyAfterDays: 30,
      },
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Default/SecretRotation/SecurityGroup',
    }));

    expect(stack).to(haveResource('AWS::Serverless::Application', {
      Location: {
        ApplicationId: 'arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSMySQLRotationSingleUser',
        SemanticVersion: '1.1.60',
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
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::ResourcePolicy', {
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
    }));

    test.done();
  },

  'secret rotation multi user'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Serverless::Application', {
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
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::ResourcePolicy', {
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
    }));

    test.done();
  },

  'secret rotation allows passing an empty string for excludeCharacters'(test: Test) {
    // WHEN
    new secretsmanager.SecretRotation(stack, 'SecretRotation', {
      application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
      secret,
      target,
      vpc,
      excludeCharacters: '',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Serverless::Application', {
      Parameters: {
        excludeCharacters: '',
      },
    }));

    test.done();
  },

  'throws when connections object has no default port range'(test: Test) {
    // WHEN
    const targetWithoutDefaultPort = new ec2.Connections({
      securityGroups: [securityGroup],
    });

    // THEN
    test.throws(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
      secret,
      application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      vpc,
      target: targetWithoutDefaultPort,
    }), /`target`.+default port range/);

    test.done();
  },

  'throws when master secret is missing for a multi user application'(test: Test) {
    // THEN
    test.throws(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
      secret,
      application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
      vpc,
      target,
    }), /The `masterSecret` must be specified for application using the multi user scheme/);

    test.done();
  },

  'rotation function name does not exceed 64 chars'(test: Test) {
    // WHEN
    const id = 'SecretRotation'.repeat(5);
    new secretsmanager.SecretRotation(stack, id, {
      application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      secret,
      target,
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Serverless::Application', {
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
    }));

    test.done();
  },
};
