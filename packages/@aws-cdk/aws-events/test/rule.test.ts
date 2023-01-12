/* eslint-disable object-curly-newline */
import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { EventBus, EventField, IRule, IRuleTarget, RuleTargetConfig, RuleTargetInput, Schedule, Match as m } from '../lib';
import { Rule } from '../lib/rule';

/* eslint-disable quote-props */

describe('rule', () => {
  test('default rule', () => {
    const stack = new cdk.Stack();

    new Rule(stack, 'MyRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(10)),
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyRuleA44AB831': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'ScheduleExpression': 'rate(10 minutes)',
            'State': 'ENABLED',
          },
        },
      },
    });
  });

  test('rule displays warning when minutes are not included in cron', () => {
    const stack = new cdk.Stack();
    new Rule(stack, 'MyRule', {
      schedule: Schedule.cron({
        hour: '8',
        day: '1',
      }),
    });

    Annotations.fromStack(stack).hasWarning('/Default/MyRule', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
  });

  test('rule does not display warning when minute is set to * in cron', () => {
    const stack = new cdk.Stack();
    new Rule(stack, 'MyRule', {
      schedule: Schedule.cron({
        minute: '*',
        hour: '8',
        day: '1',
      }),
    });

    Annotations.fromStack(stack).hasNoWarning('/Default/MyRule', Match.anyValue());
  });

  test('can get rule name', () => {
    const stack = new cdk.Stack();
    const rule = new Rule(stack, 'MyRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(10)),
    });

    new cdk.CfnResource(stack, 'Res', {
      type: 'Test::Resource',
      properties: {
        RuleName: rule.ruleName,
      },
    });

    Template.fromStack(stack).hasResourceProperties('Test::Resource', {
      RuleName: { Ref: 'MyRuleA44AB831' },
    });
  });

  test('get rate as token', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyScheduledStack');
    const lazyDuration = cdk.Duration.minutes(cdk.Lazy.number({ produce: () => 5 }));

    new Rule(stack, 'MyScheduledRule', {
      ruleName: 'rateInMinutes',
      schedule: Schedule.rate(lazyDuration),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      'Name': 'rateInMinutes',
      'ScheduleExpression': 'rate(5 minutes)',
    });
  });

  test('Seconds is not an allowed value for Schedule rate', () => {
    const lazyDuration = cdk.Duration.seconds(cdk.Lazy.number({ produce: () => 5 }));
    expect(() => Schedule.rate(lazyDuration)).toThrow(/Allowed units for scheduling/i);
  });

  test('Millis is not an allowed value for Schedule rate', () => {
    const lazyDuration = cdk.Duration.millis(cdk.Lazy.number({ produce: () => 5 }));

    // THEN
    expect(() => Schedule.rate(lazyDuration)).toThrow(/Allowed units for scheduling/i);
  });

  test('rule with physical name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Rule(stack, 'MyRule', {
      ruleName: 'PhysicalName',
      schedule: Schedule.rate(cdk.Duration.minutes(10)),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Name: 'PhysicalName',
    });
  });

  test('eventPattern is rendered properly', () => {
    const stack = new cdk.Stack();

    new Rule(stack, 'MyRule', {
      eventPattern: {
        account: ['account1', 'account2'],
        detail: {
          foo: [1, 2],
          strings: ['foo', 'bar'],
          rangeMatcher: m.interval(-1, 1),
          stringMatcher: m.exactString('I am just a string'),
          prefixMatcher: m.prefix('aws.'),
          ipAddress: m.ipAddressRange('192.0.2.0/24'),
          shouldExist: m.exists(),
          shouldNotExist: m.doesNotExist(),
          numbers: m.allOf(m.greaterThan(0), m.lessThan(5)),
          topLevel: {
            deeper: m.equal(42),
            oneMoreLevel: {
              deepest: m.anyOf(m.lessThanOrEqual(-1), m.greaterThanOrEqual(1)),
            },
          },
          state: m.anythingBut('initializing'),
          limit: m.anythingBut(100, 200, 300),
          notPrefixedBy: m.anythingButPrefix('sensitive-'),
          bar: undefined,
        },
        detailType: ['detailType1'],
        id: ['id1', 'id2'],
        region: ['region1', 'region2', 'region3'],
        resources: ['r1'],
        source: ['src1', 'src2'],
        time: ['t1'],
        version: ['0'],
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyRuleA44AB831': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'EventPattern': {
              account: ['account1', 'account2'],
              detail: {
                foo: [1, 2],
                strings: ['foo', 'bar'],
                rangeMatcher: [{ numeric: ['>=', -1, '<=', 1] }],
                stringMatcher: ['I am just a string'],
                prefixMatcher: [{ prefix: 'aws.' }],
                ipAddress: [{ cidr: '192.0.2.0/24' }],
                shouldExist: [{ exists: true }],
                shouldNotExist: [{ exists: false }],
                numbers: [{ numeric: ['>', 0, '<', 5] }],
                topLevel: {
                  deeper: [{ numeric: ['=', 42] }],
                  oneMoreLevel: {
                    deepest: [{ numeric: ['<=', -1] }, { numeric: ['>=', 1] }],
                  },
                },
                state: [{ 'anything-but': ['initializing'] }],
                limit: [{ 'anything-but': [100, 200, 300] }],
                notPrefixedBy: [{ 'anything-but': { 'prefix': 'sensitive-' } }],
              },
              'detail-type': ['detailType1'],
              id: ['id1', 'id2'],
              region: ['region1', 'region2', 'region3'],
              resources: ['r1'],
              source: ['src1', 'src2'],
              time: ['t1'],
              version: ['0'],
            },
            'State': 'ENABLED',
          },
        },
      },
    });
  });

  test('fails synthesis if neither eventPattern nor scheduleExpression are specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');
    new Rule(stack, 'Rule');
    expect(() => app.synth()).toThrow(/Either 'eventPattern' or 'schedule' must be defined/);
  });

  test('addEventPattern can be used to add filters', () => {
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'MyRule');
    rule.addEventPattern({
      account: ['12345'],
      detail: {
        foo: ['hello', 'bar', 'hello'],
      },
    });

    rule.addEventPattern({
      source: ['aws.source'],
      detail: {
        foo: ['bar', 'hello'],
        goo: {
          hello: ['world'],
        },
      },
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyRuleA44AB831': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'EventPattern': {
              'account': [
                '12345',
              ],
              'detail': {
                'foo': [
                  'hello',
                  'bar',
                ],
                'goo': {
                  'hello': [
                    'world',
                  ],
                },
              },
              'source': [
                'aws.source',
              ],
            },
            'State': 'ENABLED',
          },
        },
      },
    });
  });

  test('addEventPattern can de-duplicate filters and keep the order', () => {
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'MyRule');
    rule.addEventPattern({
      detailType: ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
    });

    rule.addEventPattern({
      detailType: ['EC2 Instance State-change Notification', 'AWS API Call via CloudTrail'],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyRuleA44AB831': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'EventPattern': {
              'detail-type': [
                'AWS API Call via CloudTrail',
                'EC2 Instance State-change Notification',
              ],
            },
            'State': 'ENABLED',
          },
        },
      },
    });
  });

  test('targets can be added via props or addTarget with input transformer', () => {
    const stack = new cdk.Stack();
    const t1: IRuleTarget = {
      bind: () => ({
        id: '',
        arn: 'ARN1',
        kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
      }),
    };

    const t2: IRuleTarget = {
      bind: () => ({
        id: '',
        arn: 'ARN2',
        input: RuleTargetInput.fromText(`This is ${EventField.fromPath('$.detail.bla')}`),
      }),
    };

    const rule = new Rule(stack, 'EventRule', {
      targets: [t1],
      schedule: Schedule.rate(cdk.Duration.minutes(5)),
    });

    rule.addTarget(t2);

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'EventRule5A491D2C': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'ScheduleExpression': 'rate(5 minutes)',
            'State': 'ENABLED',
            'Targets': [
              {
                'Arn': 'ARN1',
                'Id': 'Target0',
                'KinesisParameters': {
                  'PartitionKeyPath': 'partitionKeyPath',
                },
              },
              {
                'Arn': 'ARN2',
                'Id': 'Target1',
                'InputTransformer': {
                  'InputPathsMap': {
                    'detail-bla': '$.detail.bla',
                  },
                  'InputTemplate': '"This is <detail-bla>"',
                },
              },
            ],
          },
        },
      },
    });
  });

  test('input template can contain tokens', () => {
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'EventRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
    });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: '', arn: 'ARN2', input: RuleTargetInput.fromText('Hello, "world"'),
      }),
    });

    // tokens are used here (FnConcat), but this is a text template so we
    // expect it to be wrapped in double quotes automatically for us.
    rule.addTarget({
      bind: () => ({
        id: '',
        arn: 'ARN1',
        kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
        input: RuleTargetInput.fromText(cdk.Fn.join('', ['a', 'b']).toString()),
      }),
    });

    // jsonTemplate can be used to format JSON documents with replacements
    rule.addTarget({
      bind: () => ({
        id: '',
        arn: 'ARN3',
        input: RuleTargetInput.fromObject({ foo: EventField.fromPath('$.detail.bar') }),
      }),
    });

    // tokens can also used for JSON templates.
    rule.addTarget({
      bind: () => ({
        id: '',
        arn: 'ARN4',
        input: RuleTargetInput.fromText(cdk.Fn.join(' ', ['hello', '"world"']).toString()),
      }),
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'EventRule5A491D2C': {
          'Type': 'AWS::Events::Rule',
          'Properties': {
            'State': 'ENABLED',
            'ScheduleExpression': 'rate(1 minute)',
            'Targets': [
              {
                'Arn': 'ARN2',
                'Id': 'Target0',
                'Input': '"Hello, \\"world\\""',
              },
              {
                'Arn': 'ARN1',
                'Id': 'Target1',
                'Input': '"ab"',
                'KinesisParameters': {
                  'PartitionKeyPath': 'partitionKeyPath',
                },
              },
              {
                'Arn': 'ARN3',
                'Id': 'Target2',
                'InputTransformer': {
                  'InputPathsMap': {
                    'detail-bar': '$.detail.bar',
                  },
                  'InputTemplate': '{"foo":<detail-bar>}',
                },
              },
              {
                'Arn': 'ARN4',
                'Id': 'Target3',
                'Input': '"hello \\"world\\""',
              },
            ],
          },
        },
      },
    });
  });

  test('target can declare role which will be used', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const rule = new Rule(stack, 'EventRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
    });

    const role = new iam.Role(stack, 'SomeRole', {
      assumedBy: new iam.ServicePrincipal('nobody'),
    });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: '',
        arn: 'ARN2',
        role,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      'Targets': [
        {
          'Arn': 'ARN2',
          'Id': 'Target0',
          'RoleArn': { 'Fn::GetAtt': ['SomeRole6DDC54DD', 'Arn'] },
        },
      ],
    });
  });

  test('in cross-account scenario, target role is only used in target account', () => {
    // GIVEN
    const app = new cdk.App();
    const ruleStack = new cdk.Stack(app, 'RuleStack', { env: { account: '1234', region: 'us-east-1' } });
    const targetStack = new cdk.Stack(app, 'TargeTStack', { env: { account: '5678', region: 'us-east-1' } });

    const rule = new Rule(ruleStack, 'EventRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
    });

    const role = new iam.Role(targetStack, 'SomeRole', {
      assumedBy: new iam.ServicePrincipal('nobody'),
    });

    // a plain string should just be stringified (i.e. double quotes added and escaped)
    rule.addTarget({
      bind: () => ({
        id: '',
        arn: 'ARN2',
        role,
        targetResource: role, // Not really but good enough
      }),
    });

    // THEN
    Template.fromStack(ruleStack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { 'Fn::Join': ['', [
            'arn:',
            { 'Ref': 'AWS::Partition' },
            ':events:us-east-1:5678:event-bus/default',
          ]] },
        },
      ],
    });
    Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
      'Targets': [
        {
          'Arn': 'ARN2',
          'Id': 'Target0',
          'RoleArn': { 'Fn::GetAtt': ['SomeRole6DDC54DD', 'Arn'] },
        },
      ],
    });
  });

  test('asEventRuleTarget can use the ruleArn and a uniqueId of the rule', () => {
    const stack = new cdk.Stack();

    let receivedRuleArn = 'FAIL';
    let receivedRuleId = 'FAIL';

    const t1: IRuleTarget = {
      bind: (eventRule: IRule) => {
        receivedRuleArn = eventRule.ruleArn;
        receivedRuleId = cdk.Names.nodeUniqueId(eventRule.node);

        return {
          id: '',
          arn: 'ARN1',
          kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
        };
      },
    };

    const rule = new Rule(stack, 'EventRule');
    rule.addTarget(t1);

    expect(stack.resolve(receivedRuleArn)).toEqual(stack.resolve(rule.ruleArn));
    expect(receivedRuleId).toEqual(cdk.Names.uniqueId(rule));
  });

  test('fromEventRuleArn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const importedRule = Rule.fromEventRuleArn(stack, 'ImportedRule', 'arn:aws:events:us-east-2:123456789012:rule/example');

    // THEN
    expect(importedRule.ruleArn).toEqual('arn:aws:events:us-east-2:123456789012:rule/example');
    expect(importedRule.ruleName).toEqual('example');
  });

  test('rule can be disabled', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Rule(stack, 'Rule', {
      schedule: Schedule.expression('foom'),
      enabled: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      'State': 'DISABLED',
    });
  });

  test('can add multiple targets with the same id', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new Rule(stack, 'Rule', {
      schedule: Schedule.expression('foom'),
      enabled: false,
    });
    rule.addTarget(new SomeTarget());
    rule.addTarget(new SomeTarget());

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          'Arn': 'ARN1',
          'Id': 'Target0',
          'KinesisParameters': {
            'PartitionKeyPath': 'partitionKeyPath',
          },
        },
        {
          'Arn': 'ARN1',
          'Id': 'Target1',
          'KinesisParameters': {
            'PartitionKeyPath': 'partitionKeyPath',
          },
        },
      ],
    });
  });

  test('sqsParameters are generated when they are specified in target props', () => {
    const stack = new cdk.Stack();
    const t1: IRuleTarget = {
      bind: () => ({
        id: '',
        arn: 'ARN1',
        sqsParameters: { messageGroupId: 'messageGroupId' },
      }),
    };

    new Rule(stack, 'EventRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(5)),
      targets: [t1],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          'Arn': 'ARN1',
          'Id': 'Target0',
          'SqsParameters': {
            'MessageGroupId': 'messageGroupId',
          },
        },
      ],
    });
  });

  test('associate rule with event bus', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const eventBus = new EventBus(stack, 'EventBus');

    // WHEN
    new Rule(stack, 'MyRule', {
      eventPattern: {
        detail: ['detail'],
      },
      eventBus,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventBusName: {
        Ref: 'EventBus7B8748AA',
      },
    });
  });

  test('throws with eventBus and schedule', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');
    const eventBus = new EventBus(stack, 'EventBus');

    // THEN
    expect(() => new Rule(stack, 'MyRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(10)),
      eventBus,
    })).toThrow(/Cannot associate rule with 'eventBus' when using 'schedule'/);
  });

  test('allow an imported target if is in the same account and region', () => {
    const app = new cdk.App();

    const sourceAccount = '123456789012';
    const sourceRegion = 'us-west-2';
    const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
    const rule = new Rule(sourceStack, 'Rule', {
      eventPattern: {
        source: ['some-event'],
      },
    });

    const resource = EventBus.fromEventBusArn(sourceStack, 'TargetEventBus', `arn:aws:events:${sourceRegion}:${sourceAccount}:event-bus/default`);

    rule.addTarget(new SomeTarget('T', resource));

    Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          'Arn': 'ARN1',
          'Id': 'T',
          'KinesisParameters': {
            'PartitionKeyPath': 'partitionKeyPath',
          },
        },
      ],
    });
  });

  describe('for cross-account and/or cross-region targets', () => {
    test('requires that the source stack specify a concrete account', () => {
      const app = new cdk.App();

      const sourceStack = new cdk.Stack(app, 'SourceStack');
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '234567890123';
      const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount } });
      const resource = new Construct(targetStack, 'Resource');
      rule.addTarget(new SomeTarget('T', resource));
      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'Targets': [
          {
            'Id': 'T',
            'Arn': 'ARN1',
          },
        ],
      });
      Annotations.fromStack(sourceStack).hasWarning('/'+rule.node.path, Match.stringLikeRegexp('Either the Event Rule or target has an unresolved environment'));
    });

    test('requires that the target stack specify a concrete account', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount } });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetStack = new cdk.Stack(app, 'TargetStack');
      const resource = new Construct(targetStack, 'Resource');
      rule.addTarget(new SomeTarget('T', resource));
      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'Targets': [
          {
            'Id': 'T',
            'Arn': 'ARN1',
          },
        ],
      });
      Annotations.fromStack(sourceStack).hasWarning('/'+rule.node.path, Match.stringLikeRegexp('Either the Event Rule or target has an unresolved environment'));
    });

    test('requires that the target stack specify a concrete region', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount } });
      const rule = new Rule(sourceStack, 'Rule');

      const targetAccount = '234567890123';
      const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount } });
      const resource = new Construct(targetStack, 'Resource');

      expect(() => {
        rule.addTarget(new SomeTarget('T', resource));
      }).toThrow(/You need to provide a concrete region for the target stack when using cross-account or cross-region events/);
    });

    test('creates cross-account targets if in the same region', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceRegion = 'eu-west-2';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '234567890123';
      const targetRegion = sourceRegion;
      const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
      const resource = new Construct(targetStack, 'Resource');

      rule.addTarget(new SomeTarget('T', resource));

      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T',
            'Arn': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  `:events:${targetRegion}:${targetAccount}:event-bus/default`,
                ],
              ],
            },
          },
        ],
      });

      Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            'Arn': 'ARN1',
            'Id': 'T',
            'KinesisParameters': {
              'PartitionKeyPath': 'partitionKeyPath',
            },
          },
        ],
      });
    });

    test('creates cross-region targets', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceRegion = 'us-west-2';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '234567890123';
      const targetRegion = 'us-east-1';
      const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
      const resource = new Construct(targetStack, 'Resource');

      rule.addTarget(new SomeTarget('T', resource));

      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T',
            'Arn': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  `:events:${targetRegion}:${targetAccount}:event-bus/default`,
                ],
              ],
            },
          },
        ],
      });

      Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
          {
            'Arn': 'ARN1',
            'Id': 'T',
            'KinesisParameters': {
              'PartitionKeyPath': 'partitionKeyPath',
            },
          },
        ],
      });
    });

    test('do not create duplicated targets', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceRegion = 'us-west-2';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '234567890123';
      const targetRegion = 'us-east-1';
      const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
      const resource = new Construct(targetStack, 'Resource');

      rule.addTarget(new SomeTarget('T', resource));
      // same target should be skipped
      rule.addTarget(new SomeTarget('T1', resource));

      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T',
            'Arn': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  `:events:${targetRegion}:${targetAccount}:event-bus/default`,
                ],
              ],
            },
          },
        ],
      });

      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', Match.not({
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T1',
            'Arn': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  `:events:${targetRegion}:${targetAccount}:event-bus/default`,
                ],
              ],
            },
          },
        ],
      }));
    });

    test('requires that the target is not imported', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceRegion = 'us-west-2';
      const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '123456789012';
      const targetRegion = 'us-west-1';
      const resource = EventBus.fromEventBusArn(sourceStack, 'TargetEventBus', `arn:aws:events:${targetRegion}:${targetAccount}:event-bus/default`);
      expect(() => {
        rule.addTarget(new SomeTarget('T', resource));
      }).toThrow(/Cannot create a cross-account or cross-region rule for an imported resource/);
    });

    test('requires that the source and target stacks be part of the same App', () => {
      const sourceApp = new cdk.App();
      const sourceAccount = '123456789012';
      const sourceStack = new cdk.Stack(sourceApp, 'SourceStack', { env: { account: sourceAccount, region: 'us-west-2' } });
      const rule = new Rule(sourceStack, 'Rule');

      const targetApp = new cdk.App();
      const targetAccount = '234567890123';
      const targetStack = new cdk.Stack(targetApp, 'TargetStack', { env: { account: targetAccount, region: 'us-west-2' } });
      const resource = new Construct(targetStack, 'Resource');

      expect(() => {
        rule.addTarget(new SomeTarget('T', resource));
      }).toThrow(/Event stack and target stack must belong to the same CDK app/);
    });

    test('generates the correct rules in the source and target stacks when eventPattern is passed in the constructor', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const uniqueName = 'SourceStackRuleD6962A13';
      const sourceStack = new cdk.Stack(app, 'SourceStack', {
        env: {
          account: sourceAccount,
          region: 'us-west-2',
        },
      });
      const rule = new Rule(sourceStack, 'Rule', {
        eventPattern: {
          source: ['some-event'],
        },
      });

      const targetAccount = '234567890123';
      const targetStack = new cdk.Stack(app, 'TargetStack', {
        env: {
          account: targetAccount,
          region: 'us-west-2',
        },
      });
      const resource1 = new Construct(targetStack, 'Resource1');
      const resource2 = new Construct(targetStack, 'Resource2');

      rule.addTarget(new SomeTarget('T1', resource1));
      rule.addTarget(new SomeTarget('T2', resource2));

      Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'some-event',
          ],
        },
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T1',
            'Arn': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  `:events:us-west-2:${targetAccount}:event-bus/default`,
                ],
              ],
            },
          },
        ],
      });

      Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'some-event',
          ],
        },
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T1',
            'Arn': 'ARN1',
          },
        ],
      });
      Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'some-event',
          ],
        },
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T2',
            'Arn': 'ARN1',
          },
        ],
      });

      const eventBusPolicyStack = app.node.findChild(`EventBusPolicy-${sourceAccount}-us-west-2-${targetAccount}`) as cdk.Stack;
      Template.fromStack(eventBusPolicyStack).hasResourceProperties('AWS::Events::EventBusPolicy', {
        'Action': 'events:PutEvents',
        'StatementId': `Allow-account-${sourceAccount}-${uniqueName}`,
        'Principal': sourceAccount,
      });
    });

    test('generates the correct rule in the target stack when addEventPattern in the source rule is used', () => {
      const app = new cdk.App();

      const sourceAccount = '123456789012';
      const sourceStack = new cdk.Stack(app, 'SourceStack', {
        env: {
          account: sourceAccount,
          region: 'us-west-2',
        },
      });
      const rule = new Rule(sourceStack, 'Rule');

      const targetAccount = '234567890123';
      const targetStack = new cdk.Stack(app, 'TargetStack', {
        env: {
          account: targetAccount,
          region: 'us-west-2',
        },
      });
      const resource = new Construct(targetStack, 'Resource1');

      rule.addTarget(new SomeTarget('T', resource));

      rule.addEventPattern({
        source: ['some-event'],
      });

      Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'some-event',
          ],
        },
        'State': 'ENABLED',
        'Targets': [
          {
            'Id': 'T',
            'Arn': 'ARN1',
          },
        ],
      });
    });
  });
});

class SomeTarget implements IRuleTarget {
  // eslint-disable-next-line @aws-cdk/no-core-construct
  public constructor(private readonly id?: string, private readonly resource?: IConstruct) {
  }

  public bind(): RuleTargetConfig {
    return {
      id: this.id || '',
      arn: 'ARN1',
      kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
      targetResource: this.resource,
    };
  }
}
