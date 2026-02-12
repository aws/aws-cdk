import { Template } from '../../assertions';
import { Stack } from '../../core';
import { ConsumableResource, ConsumableResourceType } from '../lib';

describe('ConsumableResource', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates resource with required properties', () => {
    // WHEN
    new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      ResourceType: 'REPLENISHABLE',
      TotalQuantity: 100,
    });
  });

  test('respects consumableResourceName', () => {
    // WHEN
    new ConsumableResource(stack, 'MyResource', {
      consumableResourceName: 'my-license',
      resourceType: ConsumableResourceType.NON_REPLENISHABLE,
      totalQuantity: 50,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      ConsumableResourceName: 'my-license',
      ResourceType: 'NON_REPLENISHABLE',
      TotalQuantity: 50,
    });
  });

  test('throws error when totalQuantity is less than 1', () => {
    // WHEN / THEN
    expect(() => {
      new ConsumableResource(stack, 'MyResource', {
        resourceType: ConsumableResourceType.REPLENISHABLE,
        totalQuantity: 0,
      });
    }).toThrow(/totalQuantity must be at least 1/);
  });

  test('throws error when totalQuantity is negative', () => {
    // WHEN / THEN
    expect(() => {
      new ConsumableResource(stack, 'MyResource', {
        resourceType: ConsumableResourceType.REPLENISHABLE,
        totalQuantity: -5,
      });
    }).toThrow(/totalQuantity must be at least 1/);
  });

  test('accepts totalQuantity of 1', () => {
    // WHEN
    new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      TotalQuantity: 1,
    });
  });

  test('fromConsumableResourceArn imports existing resource', () => {
    // WHEN
    const imported = ConsumableResource.fromConsumableResourceArn(
      stack,
      'ImportedResource',
      'arn:aws:batch:us-east-1:123456789012:consumable-resource/my-resource',
    );

    // THEN
    expect(imported.consumableResourceArn).toBe('arn:aws:batch:us-east-1:123456789012:consumable-resource/my-resource');
    expect(imported.consumableResourceName).toBe('my-resource');
  });
});
