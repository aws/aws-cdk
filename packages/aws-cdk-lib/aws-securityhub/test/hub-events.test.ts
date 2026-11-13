import { Template } from '../../assertions';
import * as targets from '../../aws-events-targets';
import * as sqs from '../../aws-sqs';
import { App, Stack } from '../../core';
import { CfnHub, Hub, HubEvents } from '../lib';

const env = { account: '123456789012', region: 'ap-northeast-1' };

test.each([
  ['onImportedFindings', 'Security Hub Findings - Imported'],
  ['onCustomAction', 'Security Hub Findings - Custom Action'],
  ['onInsightResults', 'Security Hub Insight Results'],
] as const)('%s filters the native event type and referenced environment', (method, detailType) => {
  const stack = new Stack(undefined, undefined, { env });
  const hub = new Hub(stack, 'Hub', { enableDefaultStandards: false });
  hub.events[method]('Rule');
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    EventPattern: { 'source': ['aws.securityhub'], 'account': [env.account], 'region': [env.region], 'detail-type': [detailType] },
    State: 'ENABLED',
  });
});

test('registers one target and keeps caller filters and rule options', () => {
  const stack = new Stack(undefined, undefined, { env });
  const hub = new Hub(stack, 'Hub');
  const queue = new sqs.Queue(stack, 'Queue');
  hub.events.onImportedFindings('Rule', {
    target: new targets.SqsQueue(queue),
    description: 'Selected findings',
    ruleName: 'selected-findings',
    eventPattern: { detail: { findings: { Severity: { Label: ['HIGH'] } } } },
  });
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::Rule', {
    Description: 'Selected findings',
    Name: 'selected-findings',
    EventPattern: {
      'source': ['aws.securityhub'],
      'account': [env.account],
      'region': [env.region],
      'detail-type': ['Security Hub Findings - Imported'],
      'detail': { findings: { Severity: { Label: ['HIGH'] } } },
    },
    Targets: [{ Arn: stack.resolve(queue.queueArn), Id: 'Target0' }],
  });
});

test.each(['onImportedFindings', 'onCustomAction', 'onInsightResults'] as const)('%s rejects caller-supplied fixed filters', (method) => {
  const stack = new Stack(undefined, undefined, { env });
  const hub = new Hub(stack, 'Hub');
  for (const eventPattern of [
    { source: ['other.service'] },
    { account: ['999999999999'] },
    { region: ['us-east-1'] },
    { detailType: ['Other event'] },
  ]) {
    expect(() => hub.events[method]('Rule', { eventPattern })).toThrow(/must not specify/);
  }
  Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
});

test('generic helper preserves caller event type and rejects reserved filters', () => {
  const stack = new Stack(undefined, undefined, { env });
  const hub = new Hub(stack, 'Hub');
  for (const eventPattern of [{ source: ['other.service'] }, { account: ['999999999999'] }, { region: ['us-east-1'] }]) {
    expect(() => hub.events.onEvent('Rejected', { eventPattern })).toThrow(/must not specify/);
  }
  hub.events.onEvent('Rule', { eventPattern: { detailType: ['Selected event'] } });
  const rules = Template.fromStack(stack).findResources('AWS::Events::Rule');
  expect(Object.values(rules)[0].Properties.EventPattern).toEqual({
    'source': ['aws.securityhub'], 'account': [env.account], 'region': [env.region], 'detail-type': ['Selected event'],
  });
});

test('supports L1 references without a Hub L2', () => {
  const stack = new Stack(undefined, undefined, { env });
  HubEvents.fromHub(new CfnHub(stack, 'L1')).onEvent('AnyEvent');
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    EventPattern: { source: ['aws.securityhub'], account: [env.account], region: [env.region] },
  });
});

test('uses the imported hub environment and creates no owned hub', () => {
  const stack = new Stack(undefined, undefined, { env: { account: env.account, region: 'eu-west-1' } });
  Hub.fromHubArn(stack, 'Imported', 'arn:aws:securityhub:eu-west-1:123456789012:hub/default').events.onCustomAction('Rule');
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    EventPattern: {
      'source': ['aws.securityhub'],
      'account': ['123456789012'],
      'region': ['eu-west-1'],
      'detail-type': ['Security Hub Findings - Custom Action'],
    },
  });
  Template.fromStack(stack).resourceCountIs('AWS::SecurityHub::Hub', 0);
});

test.each([
  { account: '999999999999', region: env.region },
  { account: env.account, region: 'eu-west-1' },
])('rejects mismatched imported hub and crossStackScope environments: %j', (otherEnv) => {
  const app = new App();
  const source = new Stack(app, 'Source', { env });
  const destination = new Stack(app, 'Destination', { env: otherEnv });
  const imported = Hub.fromHubArn(destination, 'Imported', `arn:aws:securityhub:${env.region}:${env.account}:hub/default`);
  expect(() => imported.events.onEvent('Rule')).toThrow(/same account and Region/);
  expect(() => new Hub(source, 'Hub').events.onEvent('Rule', { crossStackScope: destination })).toThrow(/same account and Region/);
  Template.fromStack(destination).resourceCountIs('AWS::Events::Rule', 0);
});

test('allows unresolved stack and hub environments', () => {
  const stack = new Stack();
  expect(() => new Hub(stack, 'Hub').events.onEvent('Rule')).not.toThrow();
  Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);
});

test('respects crossStackScope for a target in another stack', () => {
  const app = new App();
  const source = new Stack(app, 'Source', { env });
  const destination = new Stack(app, 'Destination', { env });
  const hub = new Hub(source, 'Hub');
  const rule = hub.events.onImportedFindings('Rule', { crossStackScope: destination });
  expect(Stack.of(rule)).toBe(destination);
  Template.fromStack(source).resourceCountIs('AWS::Events::Rule', 0);
  Template.fromStack(destination).resourceCountIs('AWS::Events::Rule', 1);
});
