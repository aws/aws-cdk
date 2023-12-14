import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import { Duration } from '../../core';
import * as secretsmanager from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('create a rotation schedule with a rotation Lambda', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    SecretId: {
      Ref: 'SecretA720EF05',
    },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'LambdaD247545B',
        'Arn',
      ],
    },
    RotationRules: {
      ScheduleExpression: 'rate(30 days)',
    },
  });
});

test('create a rotation schedule without immediate rotation', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
    rotateImmediatelyOnUpdate: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
    SecretId: {
      Ref: 'SecretA720EF05',
    },
    RotationRules: {
      ScheduleExpression: 'rate(30 days)',
    },
    RotateImmediatelyOnUpdate: false,
  });
});

test('assign permissions for rotation schedule with a rotation Lambda', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        'LambdaD247545B',
        'Arn',
      ],
    },
    Principal: 'secretsmanager.amazonaws.com',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'secretsmanager:DescribeSecret',
            'secretsmanager:GetSecretValue',
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecretVersionStage',
          ],
          Effect: 'Allow',
          Resource: {
            Ref: 'SecretA720EF05',
          },
        },
        {
          Action: 'secretsmanager:GetRandomPassword',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'LambdaServiceRoleDefaultPolicyDAE46E21',
    Roles: [
      {
        Ref: 'LambdaServiceRoleA8ED4D3B',
      },
    ],
  });
});

test('grants correct permissions for secret imported by name', () => {
  // GIVEN
  const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'mySecretName');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: [
            'secretsmanager:DescribeSecret',
            'secretsmanager:GetSecretValue',
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecretVersionStage',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':secretsmanager:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':secret:mySecretName-??????',
            ]],
          },
        },
      ]),
      Version: '2012-10-17',
    },
    PolicyName: 'LambdaServiceRoleDefaultPolicyDAE46E21',
    Roles: [
      {
        Ref: 'LambdaServiceRoleA8ED4D3B',
      },
    ],
  });
});

test('assign kms permissions for rotation schedule with a rotation Lambda', () => {
  // GIVEN
  const encryptionKey = new kms.Key(stack, 'Key');
  const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey });
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [Match.anyValue(), Match.anyValue(), Match.anyValue(),
        {
          Action: [
            'kms:Decrypt',
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::GetAtt': [
                'LambdaServiceRoleA8ED4D3B',
                'Arn',
              ],
            },
          },
          Resource: '*',
        }],
    },
  });
});

describe('hosted rotation', () => {
  test('single user not in a vpc', () => {
    // GIVEN
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    secret.addRotationSchedule('RotationSchedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretA720EF05',
      },
      HostedRotationLambda: {
        RotationType: 'MySQLSingleUser',
        ExcludeCharacters: " %+~`#$&*()|[]{}:;<>?!'/@\"\\",
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });

    expect(app.synth().getStackByName(stack.stackName).template).toEqual(expect.objectContaining({
      Transform: 'AWS::SecretsManager-2020-07-23',
    }));

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

  test('multi user not in a vpc', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const masterSecret = new secretsmanager.Secret(stack, 'MasterSecret');

    // WHEN
    secret.addRotationSchedule('RotationSchedule', {
      hostedRotation: secretsmanager.HostedRotation.postgreSqlMultiUser({
        masterSecret,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretA720EF05',
      },
      HostedRotationLambda: {
        MasterSecretArn: {
          Ref: 'MasterSecretA11BF785',
        },
        RotationType: 'PostgreSQLMultiUser',
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
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

  test('single user in a vpc', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const dbSecurityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    const dbConnections = new ec2.Connections({
      defaultPort: ec2.Port.tcp(3306),
      securityGroups: [dbSecurityGroup],
    });

    // WHEN
    const hostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({ vpc });
    secret.addRotationSchedule('RotationSchedule', { hostedRotation });
    dbConnections.allowDefaultPortFrom(hostedRotation);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretA720EF05',
      },
      HostedRotationLambda: {
        RotationType: 'MySQLSingleUser',
        VpcSecurityGroupIds: {
          'Fn::GetAtt': [
            'SecretRotationScheduleSecurityGroup3F1F76EA',
            'GroupId',
          ],
        },
        VpcSubnetIds: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'VpcPrivateSubnet1Subnet536B997A',
              },
              ',',
              {
                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
              },
            ],
          ],
        },
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      FromPort: 3306,
      GroupId: {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'SecretRotationScheduleSecurityGroup3F1F76EA',
          'GroupId',
        ],
      },
      ToPort: 3306,
    });
  });

  test('single user in a vpc with security groups', () => {
    // GIVEN
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const dbSecurityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    const dbConnections = new ec2.Connections({
      defaultPort: ec2.Port.tcp(3306),
      securityGroups: [dbSecurityGroup],
    });

    // WHEN
    const hostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({
      vpc,
      securityGroups: [
        new ec2.SecurityGroup(stack, 'SG1', { vpc }),
        new ec2.SecurityGroup(stack, 'SG2', { vpc }),
      ],
    });
    secret.addRotationSchedule('RotationSchedule', { hostedRotation });
    dbConnections.allowDefaultPortFrom(hostedRotation);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretA720EF05',
      },
      HostedRotationLambda: {
        RotationType: 'MySQLSingleUser',
        VpcSecurityGroupIds: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'SG1BA065B6E',
                  'GroupId',
                ],
              },
              ',',
              {
                'Fn::GetAtt': [
                  'SG20CE3219C',
                  'GroupId',
                ],
              },
            ],
          ],
        },
        VpcSubnetIds: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'VpcPrivateSubnet1Subnet536B997A',
              },
              ',',
              {
                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
              },
            ],
          ],
        },
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      FromPort: 3306,
      GroupId: {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'SG20CE3219C',
          'GroupId',
        ],
      },
      ToPort: 3306,
    });
  });

  test('throws with security groups and no vpc', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // THEN
    expect(() => secret.addRotationSchedule('RotationSchedule', {
      hostedRotation: secretsmanager.HostedRotation.oracleSingleUser({
        securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(secret, 'SG', 'sg-12345678')],
      }),
    })).toThrow(/`vpc` must be specified when specifying `securityGroups`/);
  });

  test('throws when accessing the connections object when not in a vpc', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    const hostedRotation = secretsmanager.HostedRotation.sqlServerSingleUser();
    secret.addRotationSchedule('RotationSchedule', { hostedRotation });

    // THEN
    expect(() => hostedRotation.connections.allowToAnyIpv4(ec2.Port.allTraffic()))
      .toThrow(/Cannot use connections for a hosted rotation that is not deployed in a VPC/);
  });

  test('can customize exclude characters', () => {
    // GIVEN
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    secret.addRotationSchedule('RotationSchedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser({
        excludeCharacters: '()',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      HostedRotationLambda: {
        RotationType: 'MySQLSingleUser',
        ExcludeCharacters: '()',
      },
    });
  });

  test('exclude characters default to secret exclude characters', () => {
    // GIVEN
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
    const secret = new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {
        excludeCharacters: '[]',
      },
    });

    // WHEN
    secret.addRotationSchedule('RotationSchedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      HostedRotationLambda: {
        RotationType: 'MySQLSingleUser',
        ExcludeCharacters: '[]',
      },
    });
  });
});

describe('manual rotations', () => {
  test('automaticallyAfter with any duration of zero leaves RotationRules unset', () => {
    const checkRotationNotSet = (automaticallyAfter: Duration) => {
      // GIVEN
      const localStack = new cdk.Stack();
      const secret = new secretsmanager.Secret(localStack, 'Secret');
      const rotationLambda = new lambda.Function(localStack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_LATEST,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
      });

      // WHEN
      new secretsmanager.RotationSchedule(localStack, 'RotationSchedule', {
        secret,
        rotationLambda,
        automaticallyAfter,
      });

      // THEN
      Template.fromStack(localStack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', Match.objectEquals({
        SecretId: { Ref: 'SecretA720EF05' },
        RotationLambdaARN: {
          'Fn::GetAtt': [
            'LambdaD247545B',
            'Arn',
          ],
        },
      }));
    };

    checkRotationNotSet(Duration.days(0));
    checkRotationNotSet(Duration.hours(0));
    checkRotationNotSet(Duration.minutes(0));
    checkRotationNotSet(Duration.seconds(0));
    checkRotationNotSet(Duration.millis(0));
  });
});

test('rotation schedule should have a dependency on lambda permissions', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  secret.addRotationSchedule('RotationSchedule', {
    rotationLambda,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::SecretsManager::RotationSchedule', {
    DependsOn: [
      'LambdaInvokeN0a2GKfZP0JmDqDEVhhu6A0TUv3NyNbk4YMFKNc69846677',
    ],
  });
});

test('automaticallyAfter set scheduleExpression with days duration', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
    automaticallyAfter: Duration.days(90),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', Match.objectEquals({
    SecretId: { Ref: 'SecretA720EF05' },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'LambdaD247545B',
        'Arn',
      ],
    },
    RotationRules: {
      ScheduleExpression: 'rate(90 days)',
    },
  }));
});

test('automaticallyAfter set scheduleExpression with hours duration', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
    automaticallyAfter: Duration.hours(6),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', Match.objectEquals({
    SecretId: { Ref: 'SecretA720EF05' },
    RotationLambdaARN: {
      'Fn::GetAtt': [
        'LambdaD247545B',
        'Arn',
      ],
    },
    RotationRules: {
      ScheduleExpression: 'rate(6 hours)',
    },
  }));
});

test('automaticallyAfter must not be smaller than 4 hours', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  // THEN
  expect(() => new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
    automaticallyAfter: Duration.hours(2),
  })).toThrow(/automaticallyAfter must not be smaller than 4 hours, got 2 hours/);
});

test('automaticallyAfter must not be greater than 1000 days', () => {
  // GIVEN
  const secret = new secretsmanager.Secret(stack, 'Secret');
  const rotationLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('export.handler = event => event;'),
    handler: 'index.handler',
  });

  // WHEN
  // THEN
  expect(() => new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
    secret,
    rotationLambda,
    automaticallyAfter: Duration.days(1001),
  })).toThrow(/automaticallyAfter must not be greater than 1000 days, got 1001 days/);
});