import { FakeTask } from './private/fake-task';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as task from '../../aws-stepfunctions-tasks';
import * as cdk from '../../core';
import * as sfn from '../lib';

describe('State Machine', () => {
  test('Instantiate Default State Machine with deprecated definition', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
    });
  }),

  test('Instantiate Default State Machine with string definition', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromString('{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
    });
  }),

  test('Instantiate fails with old and new definition specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // FAIL
    expect(() => {
      new sfn.StateMachine(stack, 'MyStateMachine', {
        stateMachineName: 'MyStateMachine',
        definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
        definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass2'))),
      });
    }).toThrow('Cannot specify definition and definitionBody at the same time');
  }),

  test('Instantiate fails with no definition specified', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // FAIL
    expect(() => {
      new sfn.StateMachine(stack, 'MyStateMachine', {
        stateMachineName: 'MyStateMachine',
      });
    }).toThrow('You need to specify either definition or definitionBody');
  }),

  test('Instantiate Default State Machine', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
    });
  }),

  test('Instantiate Standard State Machine', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'STANDARD',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
    });

  }),

  test('Instantiate Standard State Machine With Comment', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definition: sfn.Chain.start(new sfn.Pass(stack, 'Pass')),
      stateMachineType: sfn.StateMachineType.STANDARD,
      comment: 'zorp',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'STANDARD',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}},"Comment":"zorp"}',
    });

  }),

  test('Instantiate Express State Machine', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'EXPRESS',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
    });

  }),

  test('Instantiate State Machine With Distributed Map State', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const map = new sfn.DistributedMap(stack, 'Map State');
    map.itemProcessor(new sfn.Pass(stack, 'Pass'));
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definition: map,
    });

    // THEN
    stack;
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: { Ref: 'MyStateMachine6C968CA5' },
          },
          {
            Action: [
              'states:DescribeExecution',
              'states:StopExecution',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [{ Ref: 'MyStateMachine6C968CA5' }, ':*']],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineDistributedMapPolicy11E47E72',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  }),

  test('State Machine with invalid name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const createStateMachine = (name: string) => {
      new sfn.StateMachine(stack, name + 'StateMachine', {
        stateMachineName: name,
        definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, name + 'Pass'))),
        stateMachineType: sfn.StateMachineType.EXPRESS,
      });
    };
    const tooShortName = '';
    const tooLongName = 'M'.repeat(81);
    const invalidCharactersName = '*';

    // THEN
    expect(() => {
      createStateMachine(tooShortName);
    }).toThrow(`State Machine name must be between 1 and 80 characters. Received: ${tooShortName}`);

    expect(() => {
      createStateMachine(tooLongName);
    }).toThrow(`State Machine name must be between 1 and 80 characters. Received: ${tooLongName}`);

    expect(() => {
      createStateMachine(invalidCharactersName);
    }).toThrow(`State Machine name must match "^[a-z0-9+!@.()-=_']+$/i". Received: ${invalidCharactersName}`);
  });

  test('State Machine with valid name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const newStateMachine = new sfn.StateMachine(stack, 'dummyStateMachineToken', {
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'dummyStateMachineTokenPass'))),
    });

    // WHEN
    const nameContainingToken = newStateMachine.stateMachineName + '-Name';
    const validName = 'AWS-Stepfunctions_Name.Test(@aws-cdk+)!=\'1\'';

    // THEN
    expect(() => {
      new sfn.StateMachine(stack, 'TokenTest-StateMachine', {
        stateMachineName: nameContainingToken,
        definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'TokenTest-StateMachinePass'))),
        stateMachineType: sfn.StateMachineType.EXPRESS,
      });
    }).not.toThrow();

    expect(() => {
      new sfn.StateMachine(stack, 'ValidNameTest-StateMachine', {
        stateMachineName: validName,
        definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'ValidNameTest-StateMachinePass'))),
        stateMachineType: sfn.StateMachineType.EXPRESS,
      });
    }).not.toThrow();
  });

  test('log configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup');

    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.FATAL,
        includeExecutionData: false,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      LoggingConfiguration: {
        Destinations: [{
          CloudWatchLogsLogGroup: {
            LogGroupArn: {
              'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
            },
          },
        }],
        IncludeExecutionData: false,
        Level: 'FATAL',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'logs:CreateLogDelivery',
            'logs:GetLogDelivery',
            'logs:UpdateLogDelivery',
            'logs:DeleteLogDelivery',
            'logs:ListLogDeliveries',
            'logs:PutResourcePolicy',
            'logs:DescribeResourcePolicies',
            'logs:DescribeLogGroups',
          ],
          Effect: 'Allow',
          Resource: '*',
        }],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  test('tracing configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      tracingEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      TracingConfiguration: {
        Enabled: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'xray:PutTraceSegments',
            'xray:PutTelemetryRecords',
            'xray:GetSamplingRules',
            'xray:GetSamplingTargets',
          ],
          Effect: 'Allow',
          Resource: '*',
        }],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  test('disable tracing configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      tracingEnabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      TracingConfiguration: {
        Enabled: false,
      },
    });
  });

  test('grant access', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const sm = new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
    });
    const bucket = new s3.Bucket(stack, 'MyBucket');
    bucket.grantRead(sm);

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
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'MyBucketF68F3FF0',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  test('Instantiate a State Machine with a task assuming a literal roleArn (cross-account)', () => {
    // GIVEN
    const app = new cdk.App();
    const stateMachineStack = new cdk.Stack(app, 'StateMachineStack', { env: { account: '123456789' } });
    const roleStack = new cdk.Stack(app, 'RoleStack', { env: { account: '987654321' } });
    const role = iam.Role.fromRoleName(roleStack, 'Role', 'example-role');

    // WHEN
    new sfn.StateMachine(stateMachineStack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(new FakeTask(stateMachineStack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRole(role) } })),
    });

    // THEN
    Template.fromStack(stateMachineStack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::987654321:role/example-role"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
          ],
        ],
      },
    });

    Template.fromStack(stateMachineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'sts:AssumeRole',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::987654321:role/example-role',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  test('Instantiate a State Machine with a task assuming a literal roleArn (same-account)', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const role = iam.Role.fromRoleName(stack, 'Role', 'example-role');
    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(new FakeTask(stack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRole(role) } })),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::',
            {
              Ref: 'AWS::AccountId',
            },
            ':role/example-role"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'sts:AssumeRole',
            Resource: {
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
                  ':role/example-role',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  test('Instantiate a State Machine with a task assuming a JSONPath roleArn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(new FakeTask(stack, 'fakeTask', { credentials: { role: sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn') } })),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: '{"StartAt":"fakeTask","States":{"fakeTask":{"End":true,"Type":"Task","Credentials":{"RoleArn.$":"$.RoleArn"},"Resource":"my-resource","Parameters":{"MyParameter":"myParameter"}}}}',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'sts:AssumeRole',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'MyStateMachineRoleDefaultPolicyE468EB18',
      Roles: [
        {
          Ref: 'MyStateMachineRoleD59FFEBC',
        },
      ],
    });
  });

  describe('StateMachine.fromStateMachineArn()', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('for a state machine in a different account and region', () => {
      let mach: sfn.IStateMachine;

      beforeEach(() => {
        mach = sfn.StateMachine.fromStateMachineArn(
          stack,
          'iMach',
          'arn:aws:states:machine-region:222222222222:stateMachine:machine-name',
        );
      });

      test("the state machine's region is taken from the ARN", () => {
        expect(mach.env.region).toBe('machine-region');
      });

      test("the state machine's account is taken from the ARN", () => {
        expect(mach.env.account).toBe('222222222222');
      });
    });
  });

  describe('StateMachine.fromStateMachineName()', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('for a state machine in the same account and region', () => {
      let mach: sfn.IStateMachine;

      beforeEach(() => {
        mach = sfn.StateMachine.fromStateMachineName(
          stack,
          'iMach',
          'machine-name',
        );
      });

      test("the state machine's region is taken from the current stack", () => {
        expect(mach.env.region).toBe('stack-region');
      });

      test("the state machine's account is taken from the current stack", () => {
        expect(mach.env.account).toBe('111111111111');
      });

      test("the state machine's account is taken from the current stack", () => {
        expect(mach.stateMachineArn.endsWith(':states:stack-region:111111111111:stateMachine:machine-name')).toBeTruthy();
      });
    });
  });

  test('with removal policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(stack, 'Pass')),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::StepFunctions::StateMachine', {
      DeletionPolicy: 'Retain',
    });
  });

  test('stateMachineRevisionId property uses attribute reference', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const stateMachine = new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(stack, 'Pass')),
    });

    new sfn.CfnStateMachineVersion(stack, 'MyStateMachineVersion', {
      stateMachineRevisionId: stateMachine.stateMachineRevisionId,
      stateMachineArn: stateMachine.stateMachineArn,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachineVersion', {
      StateMachineArn: { Ref: 'MyStateMachine6C968CA5' },
      StateMachineRevisionId: { 'Fn::GetAtt': ['MyStateMachine6C968CA5', 'StateMachineRevisionId'] },
    });
  });

  test('comments rendered properly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const choice = new sfn.Choice(stack, 'choice', {
      comment: 'nebraska',
    });
    const success = new sfn.Succeed(stack, 'success');
    choice.when(sfn.Condition.isPresent('$.success'), success, {
      comment: 'london',
    });
    choice.otherwise(success);

    // WHEN
    const stateMachine = new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(choice),
    });

    new sfn.CfnStateMachineVersion(stack, 'MyStateMachineVersion', {
      stateMachineRevisionId: stateMachine.stateMachineRevisionId,
      stateMachineArn: stateMachine.stateMachineArn,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: '{"StartAt":"choice","States":{"choice":{"Type":"Choice","Comment":"nebraska","Choices":[{"Variable":"$.success","IsPresent":true,"Next":"success","Comment":"london"}],"Default":"success"},"success":{"Type":"Succeed"}}}',
    });
  });

  test('Instantiate StateMachine with EncryptionConfiguration using Customer Managed Key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(kmsKey, cdk.Duration.seconds(75)),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'STANDARD',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      EncryptionConfiguration: Match.objectEquals({
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        KmsDataKeyReusePeriodSeconds: 75,
        Type: 'CUSTOMER_MANAGED_KMS_KEY',
      }),
    });

    // StateMachine execution IAM policy allows only executions of MyStateMachine to use key
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:states:stateMachineArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':states:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':stateMachine:MyStateMachine',
                    ],
                  ],
                },
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  }),

  test('StateMachine with CWL Encryption generates the correct iam and key policies', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
      logGroupName: '/aws/vendedlogs/states/MyLogGroup',
    });

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(kmsKey),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: false,
      },
    });

    // Ensure execution role has policy that includes kms actions and encryption context for logging
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:states:stateMachineArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':states:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':stateMachine:MyStateMachine',
                    ],
                  ],
                },
              },
            },
          },
          {
            Action: 'kms:GenerateDataKey',
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':*',
                    ],
                  ],
                },
              },
            },
          },
          {
            Action: [
              'logs:CreateLogDelivery',
              'logs:GetLogDelivery',
              'logs:UpdateLogDelivery',
              'logs:DeleteLogDelivery',
              'logs:ListLogDeliveries',
              'logs:PutResourcePolicy',
              'logs:DescribeResourcePolicies',
              'logs:DescribeLogGroups',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
    // Ensure log service delivery policy statement is set for kms key
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
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
          {
            Action: 'kms:Decrypt*',
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  }),

  test('StateMachine execution role is granted permissions when activity uses KMS key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const stateMachineKey = new kms.Key(stack, 'Key used for encryption');
    const activityKey = new kms.Key(stack, 'Activity Key');

    // WHEN
    const activity = new sfn.Activity(stack, 'TestActivity', {
      activityName: 'TestActivity',
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(activityKey),
    });

    const stateMachine = new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new task.StepFunctionsInvokeActivity(stack, 'Activity', {
        activity: activity,
      }))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(stateMachineKey, cdk.Duration.seconds(300)),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Resource: { 'Fn::GetAtt': ['ActivityKey371097A6', 'Arn'] },
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:states:activityArn': { Ref: 'TestActivity37A985C9' },
              },
            },
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
            ],
            Resource: { 'Fn::GetAtt': ['Keyusedforencryption980FC81C', 'Arn'] },
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:states:stateMachineArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':states:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':stateMachine:MyStateMachine',
                    ],
                  ],
                },
              },
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  }),

  test('Instantiate StateMachine with EncryptionConfiguration using Customer Managed Key - defaults to 300 secs for KmsDataKeyReusePeriodSeconds', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(kmsKey),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'STANDARD',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      EncryptionConfiguration: Match.objectEquals({
        KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        KmsDataKeyReusePeriodSeconds: 300,
        Type: 'CUSTOMER_MANAGED_KMS_KEY',
      }),
    });
  }),

  test('Instantiate StateMachine with invalid KmsDataKeyReusePeriodSeconds throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const kmsKey = new kms.Key(stack, 'Key');

    // FAIL
    expect(() => {
      // WHEN
      new sfn.StateMachine(stack, 'MyStateMachine', {
        stateMachineName: 'MyStateMachine',
        definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
        stateMachineType: sfn.StateMachineType.STANDARD,
        encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(kmsKey, cdk.Duration.seconds(20)),
      });
    }).toThrow('kmsDataKeyReusePeriodSeconds must have a value between 60 and 900 seconds');
  }),

  test('Instantiate StateMachine with EncryptionConfiguration using AwsOwnedEncryptionConfiguration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sfn.StateMachine(stack, 'MyStateMachine', {
      stateMachineName: 'MyStateMachine',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(stack, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.AwsOwnedEncryptionConfiguration(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'MyStateMachine',
      StateMachineType: 'STANDARD',
      DefinitionString: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}',
      EncryptionConfiguration: Match.objectLike({
        Type: 'AWS_OWNED_KEY',
      }),
    });
  });
});
