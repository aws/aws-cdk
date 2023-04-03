"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable object-curly-newline */
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
const rule_1 = require("../lib/rule");
/* eslint-disable quote-props */
describe('rule', () => {
    test('default rule', () => {
        const stack = new cdk.Stack();
        new rule_1.Rule(stack, 'MyRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(10)),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
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
        new rule_1.Rule(stack, 'MyRule', {
            schedule: lib_1.Schedule.cron({
                hour: '8',
                day: '1',
            }),
        });
        assertions_1.Annotations.fromStack(stack).hasWarning('/Default/MyRule', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead.");
    });
    test('rule does not display warning when minute is set to * in cron', () => {
        const stack = new cdk.Stack();
        new rule_1.Rule(stack, 'MyRule', {
            schedule: lib_1.Schedule.cron({
                minute: '*',
                hour: '8',
                day: '1',
            }),
        });
        assertions_1.Annotations.fromStack(stack).hasNoWarning('/Default/MyRule', assertions_1.Match.anyValue());
    });
    test('can get rule name', () => {
        const stack = new cdk.Stack();
        const rule = new rule_1.Rule(stack, 'MyRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(10)),
        });
        new cdk.CfnResource(stack, 'Res', {
            type: 'Test::Resource',
            properties: {
                RuleName: rule.ruleName,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Test::Resource', {
            RuleName: { Ref: 'MyRuleA44AB831' },
        });
    });
    test('get rate as token', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'MyScheduledStack');
        const lazyDuration = cdk.Duration.minutes(cdk.Lazy.number({ produce: () => 5 }));
        new rule_1.Rule(stack, 'MyScheduledRule', {
            ruleName: 'rateInMinutes',
            schedule: lib_1.Schedule.rate(lazyDuration),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            'Name': 'rateInMinutes',
            'ScheduleExpression': 'rate(5 minutes)',
        });
    });
    test('Seconds is not an allowed value for Schedule rate', () => {
        const lazyDuration = cdk.Duration.seconds(cdk.Lazy.number({ produce: () => 5 }));
        expect(() => lib_1.Schedule.rate(lazyDuration)).toThrow(/Allowed units for scheduling/i);
    });
    test('Millis is not an allowed value for Schedule rate', () => {
        const lazyDuration = cdk.Duration.millis(cdk.Lazy.number({ produce: () => 5 }));
        // THEN
        expect(() => lib_1.Schedule.rate(lazyDuration)).toThrow(/Allowed units for scheduling/i);
    });
    test('rule with physical name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new rule_1.Rule(stack, 'MyRule', {
            ruleName: 'PhysicalName',
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(10)),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Name: 'PhysicalName',
        });
    });
    test('eventPattern is rendered properly', () => {
        const stack = new cdk.Stack();
        new rule_1.Rule(stack, 'MyRule', {
            eventPattern: {
                account: ['account1', 'account2'],
                detail: {
                    foo: [1, 2],
                    strings: ['foo', 'bar'],
                    rangeMatcher: lib_1.Match.interval(-1, 1),
                    stringMatcher: lib_1.Match.exactString('I am just a string'),
                    prefixMatcher: lib_1.Match.prefix('aws.'),
                    ipAddress: lib_1.Match.ipAddressRange('192.0.2.0/24'),
                    shouldExist: lib_1.Match.exists(),
                    shouldNotExist: lib_1.Match.doesNotExist(),
                    numbers: lib_1.Match.allOf(lib_1.Match.greaterThan(0), lib_1.Match.lessThan(5)),
                    topLevel: {
                        deeper: lib_1.Match.equal(42),
                        oneMoreLevel: {
                            deepest: lib_1.Match.anyOf(lib_1.Match.lessThanOrEqual(-1), lib_1.Match.greaterThanOrEqual(1)),
                        },
                    },
                    state: lib_1.Match.anythingBut('initializing'),
                    limit: lib_1.Match.anythingBut(100, 200, 300),
                    notPrefixedBy: lib_1.Match.anythingButPrefix('sensitive-'),
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        new rule_1.Rule(stack, 'Rule');
        expect(() => app.synth()).toThrow(/Either 'eventPattern' or 'schedule' must be defined/);
    });
    test('addEventPattern can be used to add filters', () => {
        const stack = new cdk.Stack();
        const rule = new rule_1.Rule(stack, 'MyRule');
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        const rule = new rule_1.Rule(stack, 'MyRule');
        rule.addEventPattern({
            detailType: ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
        });
        rule.addEventPattern({
            detailType: ['EC2 Instance State-change Notification', 'AWS API Call via CloudTrail'],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
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
        const t1 = {
            bind: () => ({
                id: '',
                arn: 'ARN1',
                kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
            }),
        };
        const t2 = {
            bind: () => ({
                id: '',
                arn: 'ARN2',
                input: lib_1.RuleTargetInput.fromText(`This is ${lib_1.EventField.fromPath('$.detail.bla')}`),
            }),
        };
        const rule = new rule_1.Rule(stack, 'EventRule', {
            targets: [t1],
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(5)),
        });
        rule.addTarget(t2);
        assertions_1.Template.fromStack(stack).templateMatches({
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
        const rule = new rule_1.Rule(stack, 'EventRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
        });
        // a plain string should just be stringified (i.e. double quotes added and escaped)
        rule.addTarget({
            bind: () => ({
                id: '', arn: 'ARN2', input: lib_1.RuleTargetInput.fromText('Hello, "world"'),
            }),
        });
        // tokens are used here (FnConcat), but this is a text template so we
        // expect it to be wrapped in double quotes automatically for us.
        rule.addTarget({
            bind: () => ({
                id: '',
                arn: 'ARN1',
                kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
                input: lib_1.RuleTargetInput.fromText(cdk.Fn.join('', ['a', 'b']).toString()),
            }),
        });
        // jsonTemplate can be used to format JSON documents with replacements
        rule.addTarget({
            bind: () => ({
                id: '',
                arn: 'ARN3',
                input: lib_1.RuleTargetInput.fromObject({ foo: lib_1.EventField.fromPath('$.detail.bar') }),
            }),
        });
        // tokens can also used for JSON templates.
        rule.addTarget({
            bind: () => ({
                id: '',
                arn: 'ARN4',
                input: lib_1.RuleTargetInput.fromText(cdk.Fn.join(' ', ['hello', '"world"']).toString()),
            }),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
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
        const rule = new rule_1.Rule(stack, 'EventRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
        const rule = new rule_1.Rule(ruleStack, 'EventRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
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
        assertions_1.Template.fromStack(ruleStack).hasResourceProperties('AWS::Events::Rule', {
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
        assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
        const t1 = {
            bind: (eventRule) => {
                receivedRuleArn = eventRule.ruleArn;
                receivedRuleId = cdk.Names.nodeUniqueId(eventRule.node);
                return {
                    id: '',
                    arn: 'ARN1',
                    kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
                };
            },
        };
        const rule = new rule_1.Rule(stack, 'EventRule');
        rule.addTarget(t1);
        expect(stack.resolve(receivedRuleArn)).toEqual(stack.resolve(rule.ruleArn));
        expect(receivedRuleId).toEqual(cdk.Names.uniqueId(rule));
    });
    test('fromEventRuleArn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const importedRule = rule_1.Rule.fromEventRuleArn(stack, 'ImportedRule', 'arn:aws:events:us-east-2:123456789012:rule/example');
        // THEN
        expect(importedRule.ruleArn).toEqual('arn:aws:events:us-east-2:123456789012:rule/example');
        expect(importedRule.ruleName).toEqual('example');
    });
    test('rule can be disabled', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new rule_1.Rule(stack, 'Rule', {
            schedule: lib_1.Schedule.expression('foom'),
            enabled: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            'State': 'DISABLED',
        });
    });
    test('can add multiple targets with the same id', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const rule = new rule_1.Rule(stack, 'Rule', {
            schedule: lib_1.Schedule.expression('foom'),
            enabled: false,
        });
        rule.addTarget(new SomeTarget());
        rule.addTarget(new SomeTarget());
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
        const t1 = {
            bind: () => ({
                id: '',
                arn: 'ARN1',
                sqsParameters: { messageGroupId: 'messageGroupId' },
            }),
        };
        new rule_1.Rule(stack, 'EventRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(5)),
            targets: [t1],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
        const eventBus = new lib_1.EventBus(stack, 'EventBus');
        // WHEN
        new rule_1.Rule(stack, 'MyRule', {
            eventPattern: {
                detail: ['detail'],
            },
            eventBus,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            EventBusName: {
                Ref: 'EventBus7B8748AA',
            },
        });
    });
    test('throws with eventBus and schedule', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'MyStack');
        const eventBus = new lib_1.EventBus(stack, 'EventBus');
        // THEN
        expect(() => new rule_1.Rule(stack, 'MyRule', {
            schedule: lib_1.Schedule.rate(cdk.Duration.minutes(10)),
            eventBus,
        })).toThrow(/Cannot associate rule with 'eventBus' when using 'schedule'/);
    });
    test('allow an imported target if is in the same account and region', () => {
        const app = new cdk.App();
        const sourceAccount = '123456789012';
        const sourceRegion = 'us-west-2';
        const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
        const rule = new rule_1.Rule(sourceStack, 'Rule', {
            eventPattern: {
                source: ['some-event'],
            },
        });
        const resource = lib_1.EventBus.fromEventBusArn(sourceStack, 'TargetEventBus', `arn:aws:events:${sourceRegion}:${sourceAccount}:event-bus/default`);
        rule.addTarget(new SomeTarget('T', resource));
        assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
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
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetAccount = '234567890123';
            const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            rule.addTarget(new SomeTarget('T', resource));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
                'Targets': [
                    {
                        'Id': 'T',
                        'Arn': 'ARN1',
                    },
                ],
            });
            assertions_1.Annotations.fromStack(sourceStack).hasWarning('/' + rule.node.path, assertions_1.Match.stringLikeRegexp('Either the Event Rule or target has an unresolved environment'));
        });
        test('requires that the target stack specify a concrete account', () => {
            const app = new cdk.App();
            const sourceAccount = '123456789012';
            const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount } });
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetStack = new cdk.Stack(app, 'TargetStack');
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            rule.addTarget(new SomeTarget('T', resource));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
                'Targets': [
                    {
                        'Id': 'T',
                        'Arn': 'ARN1',
                    },
                ],
            });
            assertions_1.Annotations.fromStack(sourceStack).hasWarning('/' + rule.node.path, assertions_1.Match.stringLikeRegexp('Either the Event Rule or target has an unresolved environment'));
        });
        test('requires that the target stack specify a concrete region', () => {
            const app = new cdk.App();
            const sourceAccount = '123456789012';
            const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount } });
            const rule = new rule_1.Rule(sourceStack, 'Rule');
            const targetAccount = '234567890123';
            const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            expect(() => {
                rule.addTarget(new SomeTarget('T', resource));
            }).toThrow(/You need to provide a concrete region for the target stack when using cross-account or cross-region events/);
        });
        test('creates cross-account targets if in the same region', () => {
            const app = new cdk.App();
            const sourceAccount = '123456789012';
            const sourceRegion = 'eu-west-2';
            const sourceStack = new cdk.Stack(app, 'SourceStack', { env: { account: sourceAccount, region: sourceRegion } });
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetAccount = '234567890123';
            const targetRegion = sourceRegion;
            const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            rule.addTarget(new SomeTarget('T', resource));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
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
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetAccount = '234567890123';
            const targetRegion = 'us-east-1';
            const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            rule.addTarget(new SomeTarget('T', resource));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
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
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetAccount = '234567890123';
            const targetRegion = 'us-east-1';
            const targetStack = new cdk.Stack(app, 'TargetStack', { env: { account: targetAccount, region: targetRegion } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
            rule.addTarget(new SomeTarget('T', resource));
            // same target should be skipped
            rule.addTarget(new SomeTarget('T1', resource));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
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
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', assertions_1.Match.not({
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
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
                eventPattern: {
                    source: ['some-event'],
                },
            });
            const targetAccount = '123456789012';
            const targetRegion = 'us-west-1';
            const resource = lib_1.EventBus.fromEventBusArn(sourceStack, 'TargetEventBus', `arn:aws:events:${targetRegion}:${targetAccount}:event-bus/default`);
            expect(() => {
                rule.addTarget(new SomeTarget('T', resource));
            }).toThrow(/Cannot create a cross-account or cross-region rule for an imported resource/);
        });
        test('requires that the source and target stacks be part of the same App', () => {
            const sourceApp = new cdk.App();
            const sourceAccount = '123456789012';
            const sourceStack = new cdk.Stack(sourceApp, 'SourceStack', { env: { account: sourceAccount, region: 'us-west-2' } });
            const rule = new rule_1.Rule(sourceStack, 'Rule');
            const targetApp = new cdk.App();
            const targetAccount = '234567890123';
            const targetStack = new cdk.Stack(targetApp, 'TargetStack', { env: { account: targetAccount, region: 'us-west-2' } });
            const resource = new constructs_1.Construct(targetStack, 'Resource');
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
            const rule = new rule_1.Rule(sourceStack, 'Rule', {
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
            const resource1 = new constructs_1.Construct(targetStack, 'Resource1');
            const resource2 = new constructs_1.Construct(targetStack, 'Resource2');
            rule.addTarget(new SomeTarget('T1', resource1));
            rule.addTarget(new SomeTarget('T2', resource2));
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
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
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
            const eventBusPolicyStack = app.node.findChild(`EventBusPolicy-${sourceAccount}-us-west-2-${targetAccount}`);
            assertions_1.Template.fromStack(eventBusPolicyStack).hasResourceProperties('AWS::Events::EventBusPolicy', {
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
            const rule = new rule_1.Rule(sourceStack, 'Rule');
            const targetAccount = '234567890123';
            const targetStack = new cdk.Stack(app, 'TargetStack', {
                env: {
                    account: targetAccount,
                    region: 'us-west-2',
                },
            });
            const resource = new constructs_1.Construct(targetStack, 'Resource1');
            rule.addTarget(new SomeTarget('T', resource));
            rule.addEventPattern({
                source: ['some-event'],
            });
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
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
class SomeTarget {
    // eslint-disable-next-line @aws-cdk/no-core-construct
    constructor(id, resource) {
        this.id = id;
        this.resource = resource;
    }
    bind() {
        return {
            id: this.id || '',
            arn: 'ARN1',
            kinesisParameters: { partitionKeyPath: 'partitionKeyPath' },
            targetResource: this.resource,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXlDO0FBQ3pDLG9EQUFtRTtBQUNuRSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDJDQUFtRDtBQUNuRCxnQ0FBMkg7QUFDM0gsc0NBQW1DO0FBRW5DLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLFdBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3hCLFFBQVEsRUFBRSxjQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xELENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxXQUFXLEVBQUU7Z0JBQ1gsZ0JBQWdCLEVBQUU7b0JBQ2hCLE1BQU0sRUFBRSxtQkFBbUI7b0JBQzNCLFlBQVksRUFBRTt3QkFDWixvQkFBb0IsRUFBRSxrQkFBa0I7d0JBQ3hDLE9BQU8sRUFBRSxTQUFTO3FCQUNuQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLElBQUksV0FBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDeEIsUUFBUSxFQUFFLGNBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLElBQUksRUFBRSxHQUFHO2dCQUNULEdBQUcsRUFBRSxHQUFH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WTtxQkFDYjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLElBQUksRUFBRSxHQUFHO3dCQUNULEtBQUssRUFBRSxNQUFNO3FCQUNkO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVO0lBQ2Qsc0RBQXNEO0lBQ3RELFlBQW9DLEVBQVcsRUFBbUIsUUFBcUI7UUFBbkQsT0FBRSxHQUFGLEVBQUUsQ0FBUztRQUFtQixhQUFRLEdBQVIsUUFBUSxDQUFhO0tBQ3RGO0lBRU0sSUFBSTtRQUNULE9BQU87WUFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFO1lBQ2pCLEdBQUcsRUFBRSxNQUFNO1lBQ1gsaUJBQWlCLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRTtZQUMzRCxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDOUIsQ0FBQztLQUNIO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBvYmplY3QtY3VybHktbmV3bGluZSAqL1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBFdmVudEJ1cywgRXZlbnRGaWVsZCwgSVJ1bGUsIElSdWxlVGFyZ2V0LCBSdWxlVGFyZ2V0Q29uZmlnLCBSdWxlVGFyZ2V0SW5wdXQsIFNjaGVkdWxlLCBNYXRjaCBhcyBtIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IFJ1bGUgfSBmcm9tICcuLi9saWIvcnVsZSc7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdydWxlJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IHJ1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlSdWxlQTQ0QUI4MzEnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpFdmVudHM6OlJ1bGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1NjaGVkdWxlRXhwcmVzc2lvbic6ICdyYXRlKDEwIG1pbnV0ZXMpJyxcbiAgICAgICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncnVsZSBkaXNwbGF5cyB3YXJuaW5nIHdoZW4gbWludXRlcyBhcmUgbm90IGluY2x1ZGVkIGluIGNyb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IFJ1bGUoc3RhY2ssICdNeVJ1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUuY3Jvbih7XG4gICAgICAgIGhvdXI6ICc4JyxcbiAgICAgICAgZGF5OiAnMScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL0RlZmF1bHQvTXlSdWxlJywgXCJjcm9uOiBJZiB5b3UgZG9uJ3QgcGFzcyAnbWludXRlJywgYnkgZGVmYXVsdCB0aGUgZXZlbnQgcnVucyBldmVyeSBtaW51dGUuIFBhc3MgJ21pbnV0ZTogJyonJyBpZiB0aGF0J3Mgd2hhdCB5b3UgaW50ZW5kLCBvciAnbWludXRlOiAwJyB0byBydW4gb25jZSBwZXIgaG91ciBpbnN0ZWFkLlwiKTtcbiAgfSk7XG5cbiAgdGVzdCgncnVsZSBkb2VzIG5vdCBkaXNwbGF5IHdhcm5pbmcgd2hlbiBtaW51dGUgaXMgc2V0IHRvICogaW4gY3JvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5jcm9uKHtcbiAgICAgICAgbWludXRlOiAnKicsXG4gICAgICAgIGhvdXI6ICc4JyxcbiAgICAgICAgZGF5OiAnMScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzTm9XYXJuaW5nKCcvRGVmYXVsdC9NeVJ1bGUnLCBNYXRjaC5hbnlWYWx1ZSgpKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGdldCBydWxlIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBSdWxlKHN0YWNrLCAnTXlSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IFNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTApKSxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXMnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSdWxlTmFtZTogcnVsZS5ydWxlTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnVGVzdDo6UmVzb3VyY2UnLCB7XG4gICAgICBSdWxlTmFtZTogeyBSZWY6ICdNeVJ1bGVBNDRBQjgzMScgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2V0IHJhdGUgYXMgdG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnTXlTY2hlZHVsZWRTdGFjaycpO1xuICAgIGNvbnN0IGxhenlEdXJhdGlvbiA9IGNkay5EdXJhdGlvbi5taW51dGVzKGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDUgfSkpO1xuXG4gICAgbmV3IFJ1bGUoc3RhY2ssICdNeVNjaGVkdWxlZFJ1bGUnLCB7XG4gICAgICBydWxlTmFtZTogJ3JhdGVJbk1pbnV0ZXMnLFxuICAgICAgc2NoZWR1bGU6IFNjaGVkdWxlLnJhdGUobGF6eUR1cmF0aW9uKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAnTmFtZSc6ICdyYXRlSW5NaW51dGVzJyxcbiAgICAgICdTY2hlZHVsZUV4cHJlc3Npb24nOiAncmF0ZSg1IG1pbnV0ZXMpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU2Vjb25kcyBpcyBub3QgYW4gYWxsb3dlZCB2YWx1ZSBmb3IgU2NoZWR1bGUgcmF0ZScsICgpID0+IHtcbiAgICBjb25zdCBsYXp5RHVyYXRpb24gPSBjZGsuRHVyYXRpb24uc2Vjb25kcyhjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1IH0pKTtcbiAgICBleHBlY3QoKCkgPT4gU2NoZWR1bGUucmF0ZShsYXp5RHVyYXRpb24pKS50b1Rocm93KC9BbGxvd2VkIHVuaXRzIGZvciBzY2hlZHVsaW5nL2kpO1xuICB9KTtcblxuICB0ZXN0KCdNaWxsaXMgaXMgbm90IGFuIGFsbG93ZWQgdmFsdWUgZm9yIFNjaGVkdWxlIHJhdGUnLCAoKSA9PiB7XG4gICAgY29uc3QgbGF6eUR1cmF0aW9uID0gY2RrLkR1cmF0aW9uLm1pbGxpcyhjZGsuTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1IH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gU2NoZWR1bGUucmF0ZShsYXp5RHVyYXRpb24pKS50b1Rocm93KC9BbGxvd2VkIHVuaXRzIGZvciBzY2hlZHVsaW5nL2kpO1xuICB9KTtcblxuICB0ZXN0KCdydWxlIHdpdGggcGh5c2ljYWwgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSdWxlKHN0YWNrLCAnTXlSdWxlJywge1xuICAgICAgcnVsZU5hbWU6ICdQaHlzaWNhbE5hbWUnLFxuICAgICAgc2NoZWR1bGU6IFNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTApKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBOYW1lOiAnUGh5c2ljYWxOYW1lJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnRQYXR0ZXJuIGlzIHJlbmRlcmVkIHByb3Blcmx5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IFJ1bGUoc3RhY2ssICdNeVJ1bGUnLCB7XG4gICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgYWNjb3VudDogWydhY2NvdW50MScsICdhY2NvdW50MiddLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBmb286IFsxLCAyXSxcbiAgICAgICAgICBzdHJpbmdzOiBbJ2ZvbycsICdiYXInXSxcbiAgICAgICAgICByYW5nZU1hdGNoZXI6IG0uaW50ZXJ2YWwoLTEsIDEpLFxuICAgICAgICAgIHN0cmluZ01hdGNoZXI6IG0uZXhhY3RTdHJpbmcoJ0kgYW0ganVzdCBhIHN0cmluZycpLFxuICAgICAgICAgIHByZWZpeE1hdGNoZXI6IG0ucHJlZml4KCdhd3MuJyksXG4gICAgICAgICAgaXBBZGRyZXNzOiBtLmlwQWRkcmVzc1JhbmdlKCcxOTIuMC4yLjAvMjQnKSxcbiAgICAgICAgICBzaG91bGRFeGlzdDogbS5leGlzdHMoKSxcbiAgICAgICAgICBzaG91bGROb3RFeGlzdDogbS5kb2VzTm90RXhpc3QoKSxcbiAgICAgICAgICBudW1iZXJzOiBtLmFsbE9mKG0uZ3JlYXRlclRoYW4oMCksIG0ubGVzc1RoYW4oNSkpLFxuICAgICAgICAgIHRvcExldmVsOiB7XG4gICAgICAgICAgICBkZWVwZXI6IG0uZXF1YWwoNDIpLFxuICAgICAgICAgICAgb25lTW9yZUxldmVsOiB7XG4gICAgICAgICAgICAgIGRlZXBlc3Q6IG0uYW55T2YobS5sZXNzVGhhbk9yRXF1YWwoLTEpLCBtLmdyZWF0ZXJUaGFuT3JFcXVhbCgxKSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3RhdGU6IG0uYW55dGhpbmdCdXQoJ2luaXRpYWxpemluZycpLFxuICAgICAgICAgIGxpbWl0OiBtLmFueXRoaW5nQnV0KDEwMCwgMjAwLCAzMDApLFxuICAgICAgICAgIG5vdFByZWZpeGVkQnk6IG0uYW55dGhpbmdCdXRQcmVmaXgoJ3NlbnNpdGl2ZS0nKSxcbiAgICAgICAgICBiYXI6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgICAgZGV0YWlsVHlwZTogWydkZXRhaWxUeXBlMSddLFxuICAgICAgICBpZDogWydpZDEnLCAnaWQyJ10sXG4gICAgICAgIHJlZ2lvbjogWydyZWdpb24xJywgJ3JlZ2lvbjInLCAncmVnaW9uMyddLFxuICAgICAgICByZXNvdXJjZXM6IFsncjEnXSxcbiAgICAgICAgc291cmNlOiBbJ3NyYzEnLCAnc3JjMiddLFxuICAgICAgICB0aW1lOiBbJ3QxJ10sXG4gICAgICAgIHZlcnNpb246IFsnMCddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeVJ1bGVBNDRBQjgzMSc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkV2ZW50czo6UnVsZScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgICAgICAgICBhY2NvdW50OiBbJ2FjY291bnQxJywgJ2FjY291bnQyJ10sXG4gICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIGZvbzogWzEsIDJdLFxuICAgICAgICAgICAgICAgIHN0cmluZ3M6IFsnZm9vJywgJ2JhciddLFxuICAgICAgICAgICAgICAgIHJhbmdlTWF0Y2hlcjogW3sgbnVtZXJpYzogWyc+PScsIC0xLCAnPD0nLCAxXSB9XSxcbiAgICAgICAgICAgICAgICBzdHJpbmdNYXRjaGVyOiBbJ0kgYW0ganVzdCBhIHN0cmluZyddLFxuICAgICAgICAgICAgICAgIHByZWZpeE1hdGNoZXI6IFt7IHByZWZpeDogJ2F3cy4nIH1dLFxuICAgICAgICAgICAgICAgIGlwQWRkcmVzczogW3sgY2lkcjogJzE5Mi4wLjIuMC8yNCcgfV0sXG4gICAgICAgICAgICAgICAgc2hvdWxkRXhpc3Q6IFt7IGV4aXN0czogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICBzaG91bGROb3RFeGlzdDogW3sgZXhpc3RzOiBmYWxzZSB9XSxcbiAgICAgICAgICAgICAgICBudW1iZXJzOiBbeyBudW1lcmljOiBbJz4nLCAwLCAnPCcsIDVdIH1dLFxuICAgICAgICAgICAgICAgIHRvcExldmVsOiB7XG4gICAgICAgICAgICAgICAgICBkZWVwZXI6IFt7IG51bWVyaWM6IFsnPScsIDQyXSB9XSxcbiAgICAgICAgICAgICAgICAgIG9uZU1vcmVMZXZlbDoge1xuICAgICAgICAgICAgICAgICAgICBkZWVwZXN0OiBbeyBudW1lcmljOiBbJzw9JywgLTFdIH0sIHsgbnVtZXJpYzogWyc+PScsIDFdIH1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXRlOiBbeyAnYW55dGhpbmctYnV0JzogWydpbml0aWFsaXppbmcnXSB9XSxcbiAgICAgICAgICAgICAgICBsaW1pdDogW3sgJ2FueXRoaW5nLWJ1dCc6IFsxMDAsIDIwMCwgMzAwXSB9XSxcbiAgICAgICAgICAgICAgICBub3RQcmVmaXhlZEJ5OiBbeyAnYW55dGhpbmctYnV0JzogeyAncHJlZml4JzogJ3NlbnNpdGl2ZS0nIH0gfV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdkZXRhaWwtdHlwZSc6IFsnZGV0YWlsVHlwZTEnXSxcbiAgICAgICAgICAgICAgaWQ6IFsnaWQxJywgJ2lkMiddLFxuICAgICAgICAgICAgICByZWdpb246IFsncmVnaW9uMScsICdyZWdpb24yJywgJ3JlZ2lvbjMnXSxcbiAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbJ3IxJ10sXG4gICAgICAgICAgICAgIHNvdXJjZTogWydzcmMxJywgJ3NyYzInXSxcbiAgICAgICAgICAgICAgdGltZTogWyd0MSddLFxuICAgICAgICAgICAgICB2ZXJzaW9uOiBbJzAnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHN5bnRoZXNpcyBpZiBuZWl0aGVyIGV2ZW50UGF0dGVybiBub3Igc2NoZWR1bGVFeHByZXNzaW9uIGFyZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgIG5ldyBSdWxlKHN0YWNrLCAnUnVsZScpO1xuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvRWl0aGVyICdldmVudFBhdHRlcm4nIG9yICdzY2hlZHVsZScgbXVzdCBiZSBkZWZpbmVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEV2ZW50UGF0dGVybiBjYW4gYmUgdXNlZCB0byBhZGQgZmlsdGVycycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ015UnVsZScpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGFjY291bnQ6IFsnMTIzNDUnXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBmb286IFsnaGVsbG8nLCAnYmFyJywgJ2hlbGxvJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgc291cmNlOiBbJ2F3cy5zb3VyY2UnXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBmb286IFsnYmFyJywgJ2hlbGxvJ10sXG4gICAgICAgIGdvbzoge1xuICAgICAgICAgIGhlbGxvOiBbJ3dvcmxkJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015UnVsZUE0NEFCODMxJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6RXZlbnRzOjpSdWxlJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdFdmVudFBhdHRlcm4nOiB7XG4gICAgICAgICAgICAgICdhY2NvdW50JzogW1xuICAgICAgICAgICAgICAgICcxMjM0NScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICAgICAgICAgJ2Zvbyc6IFtcbiAgICAgICAgICAgICAgICAgICdoZWxsbycsXG4gICAgICAgICAgICAgICAgICAnYmFyJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdnb28nOiB7XG4gICAgICAgICAgICAgICAgICAnaGVsbG8nOiBbXG4gICAgICAgICAgICAgICAgICAgICd3b3JsZCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgJ2F3cy5zb3VyY2UnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRXZlbnRQYXR0ZXJuIGNhbiBkZS1kdXBsaWNhdGUgZmlsdGVycyBhbmQga2VlcCB0aGUgb3JkZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdNeVJ1bGUnKTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWxUeXBlOiBbJ0FXUyBBUEkgQ2FsbCB2aWEgQ2xvdWRUcmFpbCcsICdBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnXSxcbiAgICB9KTtcblxuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbFR5cGU6IFsnRUMyIEluc3RhbmNlIFN0YXRlLWNoYW5nZSBOb3RpZmljYXRpb24nLCAnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlSdWxlQTQ0QUI4MzEnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpFdmVudHM6OlJ1bGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAgICAgJ2RldGFpbC10eXBlJzogW1xuICAgICAgICAgICAgICAgICdBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnLFxuICAgICAgICAgICAgICAgICdFQzIgSW5zdGFuY2UgU3RhdGUtY2hhbmdlIE5vdGlmaWNhdGlvbicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0YXJnZXRzIGNhbiBiZSBhZGRlZCB2aWEgcHJvcHMgb3IgYWRkVGFyZ2V0IHdpdGggaW5wdXQgdHJhbnNmb3JtZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdDE6IElSdWxlVGFyZ2V0ID0ge1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICBhcm46ICdBUk4xJyxcbiAgICAgICAga2luZXNpc1BhcmFtZXRlcnM6IHsgcGFydGl0aW9uS2V5UGF0aDogJ3BhcnRpdGlvbktleVBhdGgnIH0sXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgY29uc3QgdDI6IElSdWxlVGFyZ2V0ID0ge1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICBhcm46ICdBUk4yJyxcbiAgICAgICAgaW5wdXQ6IFJ1bGVUYXJnZXRJbnB1dC5mcm9tVGV4dChgVGhpcyBpcyAke0V2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmJsYScpfWApLFxuICAgICAgfSksXG4gICAgfTtcblxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ0V2ZW50UnVsZScsIHtcbiAgICAgIHRhcmdldHM6IFt0MV0sXG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcyg1KSksXG4gICAgfSk7XG5cbiAgICBydWxlLmFkZFRhcmdldCh0Mik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnRXZlbnRSdWxlNUE0OTFEMkMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpFdmVudHM6OlJ1bGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1NjaGVkdWxlRXhwcmVzc2lvbic6ICdyYXRlKDUgbWludXRlcyknLFxuICAgICAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgICAgICAgICdJZCc6ICdUYXJnZXQwJyxcbiAgICAgICAgICAgICAgICAnS2luZXNpc1BhcmFtZXRlcnMnOiB7XG4gICAgICAgICAgICAgICAgICAnUGFydGl0aW9uS2V5UGF0aCc6ICdwYXJ0aXRpb25LZXlQYXRoJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0Fybic6ICdBUk4yJyxcbiAgICAgICAgICAgICAgICAnSWQnOiAnVGFyZ2V0MScsXG4gICAgICAgICAgICAgICAgJ0lucHV0VHJhbnNmb3JtZXInOiB7XG4gICAgICAgICAgICAgICAgICAnSW5wdXRQYXRoc01hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2RldGFpbC1ibGEnOiAnJC5kZXRhaWwuYmxhJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnSW5wdXRUZW1wbGF0ZSc6ICdcIlRoaXMgaXMgPGRldGFpbC1ibGE+XCInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbnB1dCB0ZW1wbGF0ZSBjYW4gY29udGFpbiB0b2tlbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdFdmVudFJ1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgfSk7XG5cbiAgICAvLyBhIHBsYWluIHN0cmluZyBzaG91bGQganVzdCBiZSBzdHJpbmdpZmllZCAoaS5lLiBkb3VibGUgcXVvdGVzIGFkZGVkIGFuZCBlc2NhcGVkKVxuICAgIHJ1bGUuYWRkVGFyZ2V0KHtcbiAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgIGlkOiAnJywgYXJuOiAnQVJOMicsIGlucHV0OiBSdWxlVGFyZ2V0SW5wdXQuZnJvbVRleHQoJ0hlbGxvLCBcIndvcmxkXCInKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gdG9rZW5zIGFyZSB1c2VkIGhlcmUgKEZuQ29uY2F0KSwgYnV0IHRoaXMgaXMgYSB0ZXh0IHRlbXBsYXRlIHNvIHdlXG4gICAgLy8gZXhwZWN0IGl0IHRvIGJlIHdyYXBwZWQgaW4gZG91YmxlIHF1b3RlcyBhdXRvbWF0aWNhbGx5IGZvciB1cy5cbiAgICBydWxlLmFkZFRhcmdldCh7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIGFybjogJ0FSTjEnLFxuICAgICAgICBraW5lc2lzUGFyYW1ldGVyczogeyBwYXJ0aXRpb25LZXlQYXRoOiAncGFydGl0aW9uS2V5UGF0aCcgfSxcbiAgICAgICAgaW5wdXQ6IFJ1bGVUYXJnZXRJbnB1dC5mcm9tVGV4dChjZGsuRm4uam9pbignJywgWydhJywgJ2InXSkudG9TdHJpbmcoKSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIGpzb25UZW1wbGF0ZSBjYW4gYmUgdXNlZCB0byBmb3JtYXQgSlNPTiBkb2N1bWVudHMgd2l0aCByZXBsYWNlbWVudHNcbiAgICBydWxlLmFkZFRhcmdldCh7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIGFybjogJ0FSTjMnLFxuICAgICAgICBpbnB1dDogUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoeyBmb286IEV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmJhcicpIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyB0b2tlbnMgY2FuIGFsc28gdXNlZCBmb3IgSlNPTiB0ZW1wbGF0ZXMuXG4gICAgcnVsZS5hZGRUYXJnZXQoe1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICBhcm46ICdBUk40JyxcbiAgICAgICAgaW5wdXQ6IFJ1bGVUYXJnZXRJbnB1dC5mcm9tVGV4dChjZGsuRm4uam9pbignICcsIFsnaGVsbG8nLCAnXCJ3b3JsZFwiJ10pLnRvU3RyaW5nKCkpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnRXZlbnRSdWxlNUE0OTFEMkMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpFdmVudHM6OlJ1bGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAgICAgJ1NjaGVkdWxlRXhwcmVzc2lvbic6ICdyYXRlKDEgbWludXRlKScsXG4gICAgICAgICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBcm4nOiAnQVJOMicsXG4gICAgICAgICAgICAgICAgJ0lkJzogJ1RhcmdldDAnLFxuICAgICAgICAgICAgICAgICdJbnB1dCc6ICdcIkhlbGxvLCBcXFxcXCJ3b3JsZFxcXFxcIlwiJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBcm4nOiAnQVJOMScsXG4gICAgICAgICAgICAgICAgJ0lkJzogJ1RhcmdldDEnLFxuICAgICAgICAgICAgICAgICdJbnB1dCc6ICdcImFiXCInLFxuICAgICAgICAgICAgICAgICdLaW5lc2lzUGFyYW1ldGVycyc6IHtcbiAgICAgICAgICAgICAgICAgICdQYXJ0aXRpb25LZXlQYXRoJzogJ3BhcnRpdGlvbktleVBhdGgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQXJuJzogJ0FSTjMnLFxuICAgICAgICAgICAgICAgICdJZCc6ICdUYXJnZXQyJyxcbiAgICAgICAgICAgICAgICAnSW5wdXRUcmFuc2Zvcm1lcic6IHtcbiAgICAgICAgICAgICAgICAgICdJbnB1dFBhdGhzTWFwJzoge1xuICAgICAgICAgICAgICAgICAgICAnZGV0YWlsLWJhcic6ICckLmRldGFpbC5iYXInLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdJbnB1dFRlbXBsYXRlJzogJ3tcImZvb1wiOjxkZXRhaWwtYmFyPn0nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQXJuJzogJ0FSTjQnLFxuICAgICAgICAgICAgICAgICdJZCc6ICdUYXJnZXQzJyxcbiAgICAgICAgICAgICAgICAnSW5wdXQnOiAnXCJoZWxsbyBcXFxcXCJ3b3JsZFxcXFxcIlwiJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RhcmdldCBjYW4gZGVjbGFyZSByb2xlIHdoaWNoIHdpbGwgYmUgdXNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcnVsZSA9IG5ldyBSdWxlKHN0YWNrLCAnRXZlbnRSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IFNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1NvbWVSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ25vYm9keScpLFxuICAgIH0pO1xuXG4gICAgLy8gYSBwbGFpbiBzdHJpbmcgc2hvdWxkIGp1c3QgYmUgc3RyaW5naWZpZWQgKGkuZS4gZG91YmxlIHF1b3RlcyBhZGRlZCBhbmQgZXNjYXBlZClcbiAgICBydWxlLmFkZFRhcmdldCh7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIGFybjogJ0FSTjInLFxuICAgICAgICByb2xlLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQXJuJzogJ0FSTjInLFxuICAgICAgICAgICdJZCc6ICdUYXJnZXQwJyxcbiAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1NvbWVSb2xlNkREQzU0REQnLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luIGNyb3NzLWFjY291bnQgc2NlbmFyaW8sIHRhcmdldCByb2xlIGlzIG9ubHkgdXNlZCBpbiB0YXJnZXQgYWNjb3VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3QgcnVsZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdSdWxlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGFyZ2VUU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnNTY3OCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcblxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShydWxlU3RhY2ssICdFdmVudFJ1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgfSk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRhcmdldFN0YWNrLCAnU29tZVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbm9ib2R5JyksXG4gICAgfSk7XG5cbiAgICAvLyBhIHBsYWluIHN0cmluZyBzaG91bGQganVzdCBiZSBzdHJpbmdpZmllZCAoaS5lLiBkb3VibGUgcXVvdGVzIGFkZGVkIGFuZCBlc2NhcGVkKVxuICAgIHJ1bGUuYWRkVGFyZ2V0KHtcbiAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgYXJuOiAnQVJOMicsXG4gICAgICAgIHJvbGUsXG4gICAgICAgIHRhcmdldFJlc291cmNlOiByb2xlLCAvLyBOb3QgcmVhbGx5IGJ1dCBnb29kIGVub3VnaFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHJ1bGVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjogeyAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6ZXZlbnRzOnVzLWVhc3QtMTo1Njc4OmV2ZW50LWJ1cy9kZWZhdWx0JyxcbiAgICAgICAgICBdXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sodGFyZ2V0U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdBcm4nOiAnQVJOMicsXG4gICAgICAgICAgJ0lkJzogJ1RhcmdldDAnLFxuICAgICAgICAgICdSb2xlQXJuJzogeyAnRm46OkdldEF0dCc6IFsnU29tZVJvbGU2RERDNTRERCcsICdBcm4nXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNFdmVudFJ1bGVUYXJnZXQgY2FuIHVzZSB0aGUgcnVsZUFybiBhbmQgYSB1bmlxdWVJZCBvZiB0aGUgcnVsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGxldCByZWNlaXZlZFJ1bGVBcm4gPSAnRkFJTCc7XG4gICAgbGV0IHJlY2VpdmVkUnVsZUlkID0gJ0ZBSUwnO1xuXG4gICAgY29uc3QgdDE6IElSdWxlVGFyZ2V0ID0ge1xuICAgICAgYmluZDogKGV2ZW50UnVsZTogSVJ1bGUpID0+IHtcbiAgICAgICAgcmVjZWl2ZWRSdWxlQXJuID0gZXZlbnRSdWxlLnJ1bGVBcm47XG4gICAgICAgIHJlY2VpdmVkUnVsZUlkID0gY2RrLk5hbWVzLm5vZGVVbmlxdWVJZChldmVudFJ1bGUubm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgYXJuOiAnQVJOMScsXG4gICAgICAgICAga2luZXNpc1BhcmFtZXRlcnM6IHsgcGFydGl0aW9uS2V5UGF0aDogJ3BhcnRpdGlvbktleVBhdGgnIH0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdFdmVudFJ1bGUnKTtcbiAgICBydWxlLmFkZFRhcmdldCh0MSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZWNlaXZlZFJ1bGVBcm4pKS50b0VxdWFsKHN0YWNrLnJlc29sdmUocnVsZS5ydWxlQXJuKSk7XG4gICAgZXhwZWN0KHJlY2VpdmVkUnVsZUlkKS50b0VxdWFsKGNkay5OYW1lcy51bmlxdWVJZChydWxlKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb21FdmVudFJ1bGVBcm4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZFJ1bGUgPSBSdWxlLmZyb21FdmVudFJ1bGVBcm4oc3RhY2ssICdJbXBvcnRlZFJ1bGUnLCAnYXJuOmF3czpldmVudHM6dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpydWxlL2V4YW1wbGUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWRSdWxlLnJ1bGVBcm4pLnRvRXF1YWwoJ2Fybjphd3M6ZXZlbnRzOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6cnVsZS9leGFtcGxlJyk7XG4gICAgZXhwZWN0KGltcG9ydGVkUnVsZS5ydWxlTmFtZSkudG9FcXVhbCgnZXhhbXBsZScpO1xuICB9KTtcblxuICB0ZXN0KCdydWxlIGNhbiBiZSBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5leHByZXNzaW9uKCdmb29tJyksXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAnU3RhdGUnOiAnRElTQUJMRUQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIG11bHRpcGxlIHRhcmdldHMgd2l0aCB0aGUgc2FtZSBpZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUuZXhwcmVzc2lvbignZm9vbScpLFxuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSk7XG4gICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoKSk7XG4gICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0Fybic6ICdBUk4xJyxcbiAgICAgICAgICAnSWQnOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgJ0tpbmVzaXNQYXJhbWV0ZXJzJzoge1xuICAgICAgICAgICAgJ1BhcnRpdGlvbktleVBhdGgnOiAncGFydGl0aW9uS2V5UGF0aCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdBcm4nOiAnQVJOMScsXG4gICAgICAgICAgJ0lkJzogJ1RhcmdldDEnLFxuICAgICAgICAgICdLaW5lc2lzUGFyYW1ldGVycyc6IHtcbiAgICAgICAgICAgICdQYXJ0aXRpb25LZXlQYXRoJzogJ3BhcnRpdGlvbktleVBhdGgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzcXNQYXJhbWV0ZXJzIGFyZSBnZW5lcmF0ZWQgd2hlbiB0aGV5IGFyZSBzcGVjaWZpZWQgaW4gdGFyZ2V0IHByb3BzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHQxOiBJUnVsZVRhcmdldCA9IHtcbiAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgYXJuOiAnQVJOMScsXG4gICAgICAgIHNxc1BhcmFtZXRlcnM6IHsgbWVzc2FnZUdyb3VwSWQ6ICdtZXNzYWdlR3JvdXBJZCcgfSxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICBuZXcgUnVsZShzdGFjaywgJ0V2ZW50UnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDUpKSxcbiAgICAgIHRhcmdldHM6IFt0MV0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgICdJZCc6ICdUYXJnZXQwJyxcbiAgICAgICAgICAnU3FzUGFyYW1ldGVycyc6IHtcbiAgICAgICAgICAgICdNZXNzYWdlR3JvdXBJZCc6ICdtZXNzYWdlR3JvdXBJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Fzc29jaWF0ZSBydWxlIHdpdGggZXZlbnQgYnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdFdmVudEJ1cycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSdWxlKHN0YWNrLCAnTXlSdWxlJywge1xuICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGRldGFpbDogWydkZXRhaWwnXSxcbiAgICAgIH0sXG4gICAgICBldmVudEJ1cyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBFdmVudEJ1c05hbWU6IHtcbiAgICAgICAgUmVmOiAnRXZlbnRCdXM3Qjg3NDhBQScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBldmVudEJ1cyBhbmQgc2NoZWR1bGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdFdmVudEJ1cycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSksXG4gICAgICBldmVudEJ1cyxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IGFzc29jaWF0ZSBydWxlIHdpdGggJ2V2ZW50QnVzJyB3aGVuIHVzaW5nICdzY2hlZHVsZScvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3cgYW4gaW1wb3J0ZWQgdGFyZ2V0IGlmIGlzIGluIHRoZSBzYW1lIGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgY29uc3Qgc291cmNlQWNjb3VudCA9ICcxMjM0NTY3ODkwMTInO1xuICAgIGNvbnN0IHNvdXJjZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgIGNvbnN0IHNvdXJjZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTb3VyY2VTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IHNvdXJjZUFjY291bnQsIHJlZ2lvbjogc291cmNlUmVnaW9uIH0gfSk7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBSdWxlKHNvdXJjZVN0YWNrLCAnUnVsZScsIHtcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBzb3VyY2U6IFsnc29tZS1ldmVudCddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHNvdXJjZVN0YWNrLCAnVGFyZ2V0RXZlbnRCdXMnLCBgYXJuOmF3czpldmVudHM6JHtzb3VyY2VSZWdpb259OiR7c291cmNlQWNjb3VudH06ZXZlbnQtYnVzL2RlZmF1bHRgKTtcblxuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUJywgcmVzb3VyY2UpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdBcm4nOiAnQVJOMScsXG4gICAgICAgICAgJ0lkJzogJ1QnLFxuICAgICAgICAgICdLaW5lc2lzUGFyYW1ldGVycyc6IHtcbiAgICAgICAgICAgICdQYXJ0aXRpb25LZXlQYXRoJzogJ3BhcnRpdGlvbktleVBhdGgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZm9yIGNyb3NzLWFjY291bnQgYW5kL29yIGNyb3NzLXJlZ2lvbiB0YXJnZXRzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlcXVpcmVzIHRoYXQgdGhlIHNvdXJjZSBzdGFjayBzcGVjaWZ5IGEgY29uY3JldGUgYWNjb3VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTb3VyY2VTdGFjaycpO1xuICAgICAgY29uc3QgcnVsZSA9IG5ldyBSdWxlKHNvdXJjZVN0YWNrLCAnUnVsZScsIHtcbiAgICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgICAgc291cmNlOiBbJ3NvbWUtZXZlbnQnXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0YXJnZXRBY2NvdW50ID0gJzIzNDU2Nzg5MDEyMyc7XG4gICAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGFyZ2V0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiB0YXJnZXRBY2NvdW50IH0gfSk7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDb25zdHJ1Y3QodGFyZ2V0U3RhY2ssICdSZXNvdXJjZScpO1xuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoJ1QnLCByZXNvdXJjZSkpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHNvdXJjZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnSWQnOiAnVCcsXG4gICAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzV2FybmluZygnLycrcnVsZS5ub2RlLnBhdGgsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ0VpdGhlciB0aGUgRXZlbnQgUnVsZSBvciB0YXJnZXQgaGFzIGFuIHVucmVzb2x2ZWQgZW52aXJvbm1lbnQnKSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXF1aXJlcyB0aGF0IHRoZSB0YXJnZXQgc3RhY2sgc3BlY2lmeSBhIGNvbmNyZXRlIGFjY291bnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgICBjb25zdCBzb3VyY2VBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCBzb3VyY2VTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU291cmNlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiBzb3VyY2VBY2NvdW50IH0gfSk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc291cmNlU3RhY2ssICdSdWxlJywge1xuICAgICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgICBzb3VyY2U6IFsnc29tZS1ldmVudCddLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRhcmdldFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUYXJnZXRTdGFjaycpO1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ29uc3RydWN0KHRhcmdldFN0YWNrLCAnUmVzb3VyY2UnKTtcbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUJywgcmVzb3VyY2UpKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0lkJzogJ1QnLFxuICAgICAgICAgICAgJ0Fybic6ICdBUk4xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc291cmNlU3RhY2spLmhhc1dhcm5pbmcoJy8nK3J1bGUubm9kZS5wYXRoLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCdFaXRoZXIgdGhlIEV2ZW50IFJ1bGUgb3IgdGFyZ2V0IGhhcyBhbiB1bnJlc29sdmVkIGVudmlyb25tZW50JykpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IHN0YWNrIHNwZWNpZnkgYSBjb25jcmV0ZSByZWdpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgICBjb25zdCBzb3VyY2VBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCBzb3VyY2VTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU291cmNlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiBzb3VyY2VBY2NvdW50IH0gfSk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc291cmNlU3RhY2ssICdSdWxlJyk7XG5cbiAgICAgIGNvbnN0IHRhcmdldEFjY291bnQgPSAnMjM0NTY3ODkwMTIzJztcbiAgICAgIGNvbnN0IHRhcmdldFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUYXJnZXRTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IHRhcmdldEFjY291bnQgfSB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENvbnN0cnVjdCh0YXJnZXRTdGFjaywgJ1Jlc291cmNlJyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUJywgcmVzb3VyY2UpKTtcbiAgICAgIH0pLnRvVGhyb3coL1lvdSBuZWVkIHRvIHByb3ZpZGUgYSBjb25jcmV0ZSByZWdpb24gZm9yIHRoZSB0YXJnZXQgc3RhY2sgd2hlbiB1c2luZyBjcm9zcy1hY2NvdW50IG9yIGNyb3NzLXJlZ2lvbiBldmVudHMvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NyZWF0ZXMgY3Jvc3MtYWNjb3VudCB0YXJnZXRzIGlmIGluIHRoZSBzYW1lIHJlZ2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnMTIzNDU2Nzg5MDEyJztcbiAgICAgIGNvbnN0IHNvdXJjZVJlZ2lvbiA9ICdldS13ZXN0LTInO1xuICAgICAgY29uc3Qgc291cmNlU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1NvdXJjZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogc291cmNlQWNjb3VudCwgcmVnaW9uOiBzb3VyY2VSZWdpb24gfSB9KTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzb3VyY2VTdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICAgIHNvdXJjZTogWydzb21lLWV2ZW50J10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFyZ2V0QWNjb3VudCA9ICcyMzQ1Njc4OTAxMjMnO1xuICAgICAgY29uc3QgdGFyZ2V0UmVnaW9uID0gc291cmNlUmVnaW9uO1xuICAgICAgY29uc3QgdGFyZ2V0U3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1RhcmdldFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogdGFyZ2V0QWNjb3VudCwgcmVnaW9uOiB0YXJnZXRSZWdpb24gfSB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENvbnN0cnVjdCh0YXJnZXRTdGFjaywgJ1Jlc291cmNlJyk7XG5cbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUJywgcmVzb3VyY2UpKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHNvdXJjZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gICAgICAgICdUYXJnZXRzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdJZCc6ICdUJyxcbiAgICAgICAgICAgICdBcm4nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICBgOmV2ZW50czoke3RhcmdldFJlZ2lvbn06JHt0YXJnZXRBY2NvdW50fTpldmVudC1idXMvZGVmYXVsdGAsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2sodGFyZ2V0U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgICAgJ0lkJzogJ1QnLFxuICAgICAgICAgICAgJ0tpbmVzaXNQYXJhbWV0ZXJzJzoge1xuICAgICAgICAgICAgICAnUGFydGl0aW9uS2V5UGF0aCc6ICdwYXJ0aXRpb25LZXlQYXRoJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBjcm9zcy1yZWdpb24gdGFyZ2V0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnMTIzNDU2Nzg5MDEyJztcbiAgICAgIGNvbnN0IHNvdXJjZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgY29uc3Qgc291cmNlU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1NvdXJjZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogc291cmNlQWNjb3VudCwgcmVnaW9uOiBzb3VyY2VSZWdpb24gfSB9KTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzb3VyY2VTdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICAgIHNvdXJjZTogWydzb21lLWV2ZW50J10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFyZ2V0QWNjb3VudCA9ICcyMzQ1Njc4OTAxMjMnO1xuICAgICAgY29uc3QgdGFyZ2V0UmVnaW9uID0gJ3VzLWVhc3QtMSc7XG4gICAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGFyZ2V0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiB0YXJnZXRBY2NvdW50LCByZWdpb246IHRhcmdldFJlZ2lvbiB9IH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ29uc3RydWN0KHRhcmdldFN0YWNrLCAnUmVzb3VyY2UnKTtcblxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoJ1QnLCByZXNvdXJjZSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc291cmNlU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0lkJzogJ1QnLFxuICAgICAgICAgICAgJ0Fybic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgIGA6ZXZlbnRzOiR7dGFyZ2V0UmVnaW9ufToke3RhcmdldEFjY291bnR9OmV2ZW50LWJ1cy9kZWZhdWx0YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayh0YXJnZXRTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBcm4nOiAnQVJOMScsXG4gICAgICAgICAgICAnSWQnOiAnVCcsXG4gICAgICAgICAgICAnS2luZXNpc1BhcmFtZXRlcnMnOiB7XG4gICAgICAgICAgICAgICdQYXJ0aXRpb25LZXlQYXRoJzogJ3BhcnRpdGlvbktleVBhdGgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkbyBub3QgY3JlYXRlIGR1cGxpY2F0ZWQgdGFyZ2V0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnMTIzNDU2Nzg5MDEyJztcbiAgICAgIGNvbnN0IHNvdXJjZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgY29uc3Qgc291cmNlU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1NvdXJjZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogc291cmNlQWNjb3VudCwgcmVnaW9uOiBzb3VyY2VSZWdpb24gfSB9KTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzb3VyY2VTdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICAgIHNvdXJjZTogWydzb21lLWV2ZW50J10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFyZ2V0QWNjb3VudCA9ICcyMzQ1Njc4OTAxMjMnO1xuICAgICAgY29uc3QgdGFyZ2V0UmVnaW9uID0gJ3VzLWVhc3QtMSc7XG4gICAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGFyZ2V0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiB0YXJnZXRBY2NvdW50LCByZWdpb246IHRhcmdldFJlZ2lvbiB9IH0pO1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ29uc3RydWN0KHRhcmdldFN0YWNrLCAnUmVzb3VyY2UnKTtcblxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoJ1QnLCByZXNvdXJjZSkpO1xuICAgICAgLy8gc2FtZSB0YXJnZXQgc2hvdWxkIGJlIHNraXBwZWRcbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUMScsIHJlc291cmNlKSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnSWQnOiAnVCcsXG4gICAgICAgICAgICAnQXJuJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgYDpldmVudHM6JHt0YXJnZXRSZWdpb259OiR7dGFyZ2V0QWNjb3VudH06ZXZlbnQtYnVzL2RlZmF1bHRgLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHNvdXJjZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywgTWF0Y2gubm90KHtcbiAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnSWQnOiAnVDEnLFxuICAgICAgICAgICAgJ0Fybic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgIGA6ZXZlbnRzOiR7dGFyZ2V0UmVnaW9ufToke3RhcmdldEFjY291bnR9OmV2ZW50LWJ1cy9kZWZhdWx0YCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVxdWlyZXMgdGhhdCB0aGUgdGFyZ2V0IGlzIG5vdCBpbXBvcnRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnMTIzNDU2Nzg5MDEyJztcbiAgICAgIGNvbnN0IHNvdXJjZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgY29uc3Qgc291cmNlU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1NvdXJjZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogc291cmNlQWNjb3VudCwgcmVnaW9uOiBzb3VyY2VSZWdpb24gfSB9KTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzb3VyY2VTdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICAgIHNvdXJjZTogWydzb21lLWV2ZW50J10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGFyZ2V0QWNjb3VudCA9ICcxMjM0NTY3ODkwMTInO1xuICAgICAgY29uc3QgdGFyZ2V0UmVnaW9uID0gJ3VzLXdlc3QtMSc7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IEV2ZW50QnVzLmZyb21FdmVudEJ1c0Fybihzb3VyY2VTdGFjaywgJ1RhcmdldEV2ZW50QnVzJywgYGFybjphd3M6ZXZlbnRzOiR7dGFyZ2V0UmVnaW9ufToke3RhcmdldEFjY291bnR9OmV2ZW50LWJ1cy9kZWZhdWx0YCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldCgnVCcsIHJlc291cmNlKSk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgY3JlYXRlIGEgY3Jvc3MtYWNjb3VudCBvciBjcm9zcy1yZWdpb24gcnVsZSBmb3IgYW4gaW1wb3J0ZWQgcmVzb3VyY2UvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlcXVpcmVzIHRoYXQgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IHN0YWNrcyBiZSBwYXJ0IG9mIHRoZSBzYW1lIEFwcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzb3VyY2VBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCBzb3VyY2VTdGFjayA9IG5ldyBjZGsuU3RhY2soc291cmNlQXBwLCAnU291cmNlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiBzb3VyY2VBY2NvdW50LCByZWdpb246ICd1cy13ZXN0LTInIH0gfSk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc291cmNlU3RhY2ssICdSdWxlJyk7XG5cbiAgICAgIGNvbnN0IHRhcmdldEFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCB0YXJnZXRBY2NvdW50ID0gJzIzNDU2Nzg5MDEyMyc7XG4gICAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBjZGsuU3RhY2sodGFyZ2V0QXBwLCAnVGFyZ2V0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiB0YXJnZXRBY2NvdW50LCByZWdpb246ICd1cy13ZXN0LTInIH0gfSk7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDb25zdHJ1Y3QodGFyZ2V0U3RhY2ssICdSZXNvdXJjZScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldCgnVCcsIHJlc291cmNlKSk7XG4gICAgICB9KS50b1Rocm93KC9FdmVudCBzdGFjayBhbmQgdGFyZ2V0IHN0YWNrIG11c3QgYmVsb25nIHRvIHRoZSBzYW1lIENESyBhcHAvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBydWxlcyBpbiB0aGUgc291cmNlIGFuZCB0YXJnZXQgc3RhY2tzIHdoZW4gZXZlbnRQYXR0ZXJuIGlzIHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgICBjb25zdCBzb3VyY2VBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCB1bmlxdWVOYW1lID0gJ1NvdXJjZVN0YWNrUnVsZUQ2OTYyQTEzJztcbiAgICAgIGNvbnN0IHNvdXJjZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTb3VyY2VTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogc291cmNlQWNjb3VudCxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc291cmNlU3RhY2ssICdSdWxlJywge1xuICAgICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgICBzb3VyY2U6IFsnc29tZS1ldmVudCddLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRhcmdldEFjY291bnQgPSAnMjM0NTY3ODkwMTIzJztcbiAgICAgIGNvbnN0IHRhcmdldFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUYXJnZXRTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogdGFyZ2V0QWNjb3VudCxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZTEgPSBuZXcgQ29uc3RydWN0KHRhcmdldFN0YWNrLCAnUmVzb3VyY2UxJyk7XG4gICAgICBjb25zdCByZXNvdXJjZTIgPSBuZXcgQ29uc3RydWN0KHRhcmdldFN0YWNrLCAnUmVzb3VyY2UyJyk7XG5cbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KCdUMScsIHJlc291cmNlMSkpO1xuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoJ1QyJywgcmVzb3VyY2UyKSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAnc291cmNlJzogW1xuICAgICAgICAgICAgJ3NvbWUtZXZlbnQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0lkJzogJ1QxJyxcbiAgICAgICAgICAgICdBcm4nOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICBgOmV2ZW50czp1cy13ZXN0LTI6JHt0YXJnZXRBY2NvdW50fTpldmVudC1idXMvZGVmYXVsdGAsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2sodGFyZ2V0U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICdFdmVudFBhdHRlcm4nOiB7XG4gICAgICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgICAgICdzb21lLWV2ZW50JyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gICAgICAgICdUYXJnZXRzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdJZCc6ICdUMScsXG4gICAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayh0YXJnZXRTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAnc291cmNlJzogW1xuICAgICAgICAgICAgJ3NvbWUtZXZlbnQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0lkJzogJ1QyJyxcbiAgICAgICAgICAgICdBcm4nOiAnQVJOMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBldmVudEJ1c1BvbGljeVN0YWNrID0gYXBwLm5vZGUuZmluZENoaWxkKGBFdmVudEJ1c1BvbGljeS0ke3NvdXJjZUFjY291bnR9LXVzLXdlc3QtMi0ke3RhcmdldEFjY291bnR9YCkgYXMgY2RrLlN0YWNrO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKGV2ZW50QnVzUG9saWN5U3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzUG9saWN5Jywge1xuICAgICAgICAnQWN0aW9uJzogJ2V2ZW50czpQdXRFdmVudHMnLFxuICAgICAgICAnU3RhdGVtZW50SWQnOiBgQWxsb3ctYWNjb3VudC0ke3NvdXJjZUFjY291bnR9LSR7dW5pcXVlTmFtZX1gLFxuICAgICAgICAnUHJpbmNpcGFsJzogc291cmNlQWNjb3VudCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IHJ1bGUgaW4gdGhlIHRhcmdldCBzdGFjayB3aGVuIGFkZEV2ZW50UGF0dGVybiBpbiB0aGUgc291cmNlIHJ1bGUgaXMgdXNlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFjY291bnQgPSAnMTIzNDU2Nzg5MDEyJztcbiAgICAgIGNvbnN0IHNvdXJjZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTb3VyY2VTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogc291cmNlQWNjb3VudCxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc291cmNlU3RhY2ssICdSdWxlJyk7XG5cbiAgICAgIGNvbnN0IHRhcmdldEFjY291bnQgPSAnMjM0NTY3ODkwMTIzJztcbiAgICAgIGNvbnN0IHRhcmdldFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUYXJnZXRTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogdGFyZ2V0QWNjb3VudCxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDb25zdHJ1Y3QodGFyZ2V0U3RhY2ssICdSZXNvdXJjZTEnKTtcblxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoJ1QnLCByZXNvdXJjZSkpO1xuXG4gICAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICAgIHNvdXJjZTogWydzb21lLWV2ZW50J10sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHRhcmdldFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgICAgICdzb3VyY2UnOiBbXG4gICAgICAgICAgICAnc29tZS1ldmVudCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgICAnVGFyZ2V0cyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnSWQnOiAnVCcsXG4gICAgICAgICAgICAnQXJuJzogJ0FSTjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgU29tZVRhcmdldCBpbXBsZW1lbnRzIElSdWxlVGFyZ2V0IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhd3MtY2RrL25vLWNvcmUtY29uc3RydWN0XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGlkPzogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlPzogSUNvbnN0cnVjdCkge1xuICB9XG5cbiAgcHVibGljIGJpbmQoKTogUnVsZVRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkIHx8ICcnLFxuICAgICAgYXJuOiAnQVJOMScsXG4gICAgICBraW5lc2lzUGFyYW1ldGVyczogeyBwYXJ0aXRpb25LZXlQYXRoOiAncGFydGl0aW9uS2V5UGF0aCcgfSxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLnJlc291cmNlLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==