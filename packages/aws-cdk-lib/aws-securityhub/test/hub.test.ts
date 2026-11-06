import { Match, Template } from '../../assertions';
import { RemovalPolicy, Resource, Stack, Tags } from '../../core';
import { ControlFindingGenerator, Hub } from '../lib';

test('creates one retained hub under the L2 and leaves service defaults unspecified', () => {
  const stack = new Stack();
  const hub = new Hub(stack, 'Hub');
  expect(hub.resource.node.scope).toBe(hub);
  expect(hub.node.defaultChild).toBe(hub.resource);
  Template.fromStack(stack).hasResource('AWS::SecurityHub::Hub', {
    Properties: Match.absent(), DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain',
  });
  Template.fromStack(stack).resourceCountIs('AWS::SecurityHub::Hub', 1);
  expect(stack.resolve(hub.hubRef)).toEqual({ hubArn: { 'Fn::GetAtt': [stack.getLogicalId(hub.resource), 'ARN'] } });
  expect(stack.resolve(hub.hubSubscribedAt)).toEqual({ 'Fn::GetAtt': [stack.getLogicalId(hub.resource), 'SubscribedAt'] });
  expect(Hub.isHub(hub)).toBe(true);
  expect(Hub.isHub(null)).toBe(false);
  expect(Hub.isHub({})).toBe(false);
});

test.each([ControlFindingGenerator.SECURITY_CONTROL, ControlFindingGenerator.STANDARD_CONTROL])('maps native settings and tags for %s', (generator) => {
  const stack = new Stack();
  const hub = new Hub(stack, 'Hub', {
    autoEnableControls: false,
    enableDefaultStandards: false,
    controlFindingGenerator: generator,
    tags: { owner: 'security' },
    removalPolicy: RemovalPolicy.DESTROY,
  });
  Tags.of(hub).add('team', 'platform');
  Template.fromStack(stack).hasResource('AWS::SecurityHub::Hub', {
    Properties: {
      AutoEnableControls: false,
      EnableDefaultStandards: false,
      ControlFindingGenerator: generator,
      Tags: { owner: 'security', team: 'platform' },
    },
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });
});

test('imports a hub without creating or taking ownership of a resource', () => {
  const stack = new Stack();
  const arn = 'arn:aws:securityhub:eu-west-1:123456789012:hub/default';
  const hub = Hub.fromHubArn(stack, 'Imported', arn);
  expect(hub.hubArn).toBe(arn);
  expect(hub.hubSubscribedAt).toBeUndefined();
  expect(hub.hubRef).toEqual({ hubArn: arn });
  expect(hub.env).toEqual({ account: '123456789012', region: 'eu-west-1' });
  expect(Resource.isOwnedResource(hub)).toBe(false);
  Template.fromStack(stack).resourceCountIs('AWS::SecurityHub::Hub', 0);
});

test('supports an L1 escape hatch without changing unrelated hub properties', () => {
  const stack = new Stack();
  const hub = new Hub(stack, 'Hub', { enableDefaultStandards: false });
  hub.resource.autoEnableControls = true;
  Template.fromStack(stack).hasResourceProperties('AWS::SecurityHub::Hub', {
    EnableDefaultStandards: false, AutoEnableControls: true,
  });
});
