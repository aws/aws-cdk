import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, CfnOutput, CfnParameter, Fn, Stack, Token } from '../../core';
import { ConsumableResource, ConsumableResourceGrants, ConsumableResourceType } from '../lib';

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

  test('accepts totalQuantity of 0', () => {
    // WHEN
    // The service documents no minimum for TotalQuantity, so 0 must be allowed.
    new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 0,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      TotalQuantity: 0,
    });
  });

  test('throws error when totalQuantity is negative', () => {
    // WHEN / THEN
    expect(() => {
      new ConsumableResource(stack, 'MyResource', {
        resourceType: ConsumableResourceType.REPLENISHABLE,
        totalQuantity: -5,
      });
    }).toThrow(/totalQuantity must be a non-negative integer/);
  });

  test('throws error when totalQuantity is not an integer', () => {
    // WHEN / THEN
    // TotalQuantity is a CloudFormation integer, so a fractional value fails at deploy time.
    expect(() => {
      new ConsumableResource(stack, 'MyResource', {
        resourceType: ConsumableResourceType.REPLENISHABLE,
        totalQuantity: 1.5,
      });
    }).toThrow(/totalQuantity must be a non-negative integer/);
  });

  test('does not throw when totalQuantity is an unresolved token', () => {
    // GIVEN
    const quantity = new CfnParameter(stack, 'Quantity', { type: 'Number' });

    // WHEN / THEN
    // An unresolved number token encodes to a sentinel value, so it must not be range-checked.
    expect(() => {
      new ConsumableResource(stack, 'MyResource', {
        resourceType: ConsumableResourceType.REPLENISHABLE,
        totalQuantity: Token.asNumber(quantity.valueAsNumber),
      });
    }).not.toThrow();
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

  test('consumableResourceArn resolves to the resource reference within the same environment', () => {
    // WHEN
    const resource = new ConsumableResource(stack, 'MyResource', {
      consumableResourceName: 'my-license',
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
    });

    // THEN
    // `Ref` of AWS::Batch::ConsumableResource is the ARN, so no ARN needs to be constructed here.
    const logicalId = Object.keys(Template.fromStack(stack).findResources('AWS::Batch::ConsumableResource'))[0];
    expect(stack.resolve(resource.consumableResourceArn)).toEqual({ Ref: logicalId });
  });

  test('consumableResourceArn is constructed from batch ARN components when referenced across accounts', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer', { env: { account: '123456789012', region: 'us-east-1' } });
    const consumer = new Stack(app, 'Consumer', { env: { account: '234567890123', region: 'us-east-1' } });

    const resource = new ConsumableResource(producer, 'MyResource', {
      consumableResourceName: 'my-license',
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
    });

    // WHEN
    new CfnOutput(consumer, 'Output', { value: resource.consumableResourceArn });

    // THEN
    // Pins the service, resource segment and the slash separator used by getResourceArnAttribute.
    Template.fromStack(consumer).hasOutput('Output', {
      Value: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':batch:us-east-1:123456789012:consumable-resource/my-license',
        ]],
      },
    });
  });

  test('fromConsumableResourceArn accepts a tokenized ARN', () => {
    // WHEN
    // Tokenized ARNs must be importable, the same way JobQueue.fromJobQueueArn allows them.
    const imported = ConsumableResource.fromConsumableResourceArn(stack, 'ImportedResource', Fn.importValue('SomeArn'));

    // THEN
    expect(stack.resolve(imported.consumableResourceName)).toEqual({
      'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { 'Fn::ImportValue': 'SomeArn' }] }] }] }],
    });
  });

  test('resourceType defaults to REPLENISHABLE', () => {
    // WHEN
    // The Batch API defaults the type to REPLENISHABLE, so the construct does the same.
    new ConsumableResource(stack, 'MyResource', {
      totalQuantity: 100,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      ResourceType: 'REPLENISHABLE',
    });
  });

  test('applies tags', () => {
    // WHEN
    new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
      tags: {
        Team: 'batch',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::ConsumableResource', {
      Tags: {
        Team: 'batch',
      },
    });
  });

  test('grants.read grants read permissions scoped to the resource', () => {
    // GIVEN
    const resource = new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    resource.grants.read(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['batch:DescribeConsumableResource', 'batch:ListJobsByConsumableResource'],
            Effect: 'Allow',
            Resource: stack.resolve(resource.consumableResourceArn),
          },
        ],
      },
    });
  });

  test('grants.update grants UpdateConsumableResource scoped to the resource', () => {
    // GIVEN
    const resource = new ConsumableResource(stack, 'MyResource', {
      resourceType: ConsumableResourceType.NON_REPLENISHABLE,
      totalQuantity: 100,
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    resource.grants.update(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'batch:UpdateConsumableResource',
            Effect: 'Allow',
            Resource: stack.resolve(resource.consumableResourceArn),
          },
        ],
      },
    });
  });

  test('an imported resource can be granted through ConsumableResourceGrants', () => {
    // GIVEN
    const imported = ConsumableResource.fromConsumableResourceArn(
      stack,
      'ImportedResource',
      'arn:aws:batch:us-east-1:123456789012:consumable-resource/my-resource',
    );
    const user = new iam.User(stack, 'User');

    // WHEN
    // `grants` lives on the base class, so an imported resource goes through the Grants class.
    ConsumableResourceGrants.fromConsumableResource(imported).read(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Resource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/my-resource',
          },
        ],
      },
    });
  });

  test('consumableResourceName resolves to the name rather than the ARN-shaped ref', () => {
    // WHEN
    const resource = new ConsumableResource(stack, 'MyResource', {
      consumableResourceName: 'my-license',
      resourceType: ConsumableResourceType.REPLENISHABLE,
      totalQuantity: 100,
    });

    // THEN
    // `Ref` is the ARN, so the name must be split out of it to stay consistent with the import path.
    const logicalId = Object.keys(Template.fromStack(stack).findResources('AWS::Batch::ConsumableResource'))[0];
    expect(stack.resolve(resource.consumableResourceName)).toEqual({
      'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { Ref: logicalId }] }] }] }],
    });
  });
});
