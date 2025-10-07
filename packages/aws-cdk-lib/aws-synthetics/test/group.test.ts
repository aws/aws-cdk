import { Template } from '../../assertions';
import { Stack } from '../../core';
import * as synthetics from '../lib';

describe('Group', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('can create a basic group', () => {
    // WHEN
    new synthetics.Group(stack, 'Group');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Group', {
      Name: 'Group',
    });
  });

  test('can create a group with a custom name', () => {
    // WHEN
    new synthetics.Group(stack, 'Group', {
      groupName: 'my-test-group',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Group', {
      Name: 'my-test-group',
    });
  });

  test('can create a group with canaries', () => {
    // GIVEN
    const canary = new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = async () => {};'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
    });

    // WHEN
    new synthetics.Group(stack, 'Group', {
      canaries: [canary],
    });

    // THEN
    const template = Template.fromStack(stack);
    const groupResources = template.findResources('AWS::Synthetics::Group');
    const groupResource = Object.values(groupResources)[0] as any;
    expect(groupResource.Properties.ResourceArns).toHaveLength(1);
    expect(groupResource.Properties.ResourceArns[0]).toMatchObject({
      'Fn::Join': expect.arrayContaining([
        '',
        expect.arrayContaining([
          'arn:',
          { Ref: 'AWS::Partition' },
          ':synthetics:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':canary:',
          expect.any(Object),
        ]),
      ]),
    });
  });

  test('can add canaries to a group after creation', () => {
    // GIVEN
    const group = new synthetics.Group(stack, 'Group');
    const canary = new synthetics.Canary(stack, 'Canary', {
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = async () => {};'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
    });

    // WHEN
    group.addCanary(canary);

    // THEN
    const template = Template.fromStack(stack);
    const groupResources = template.findResources('AWS::Synthetics::Group');
    const groupResource = Object.values(groupResources)[0] as any;
    expect(groupResource.Properties.ResourceArns).toHaveLength(1);
  });

  test('throws error when adding more than 10 canaries', () => {
    // GIVEN
    const group = new synthetics.Group(stack, 'Group');
    const canaries = Array.from({ length: 11 }, (_, i) =>
      new synthetics.Canary(stack, `Canary${i}`, {
        test: synthetics.Test.custom({
          code: synthetics.Code.fromInline('exports.handler = async () => {};'),
          handler: 'index.handler',
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
      }),
    );

    // WHEN / THEN
    canaries.slice(0, 10).forEach(canary => group.addCanary(canary));
    expect(() => group.addCanary(canaries[10])).toThrow('A group can contain at most 10 canaries');
  });

  test('throws error when creating group with more than 10 canaries', () => {
    // GIVEN
    const canaries = Array.from({ length: 11 }, (_, i) =>
      new synthetics.Canary(stack, `Canary${i}`, {
        test: synthetics.Test.custom({
          code: synthetics.Code.fromInline('exports.handler = async () => {};'),
          handler: 'index.handler',
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
      }),
    );

    // WHEN / THEN
    expect(() => new synthetics.Group(stack, 'Group', { canaries })).toThrow('A group can contain at most 10 canaries');
  });

  test('can import group by ARN', () => {
    // WHEN
    const group = synthetics.Group.fromGroupArn(
      stack,
      'ImportedGroup',
      'arn:aws:synthetics:us-east-1:123456789012:group:my-group',
    );

    // THEN
    expect(group.groupName).toBe('my-group');
    expect(group.groupArn).toContain('my-group');
  });

  test('can import group by name', () => {
    // WHEN
    const group = synthetics.Group.fromGroupName(stack, 'ImportedGroup', 'my-group');

    // THEN
    expect(group.groupName).toBe('my-group');
    expect(group.groupId).toBe('my-group');
  });
});
