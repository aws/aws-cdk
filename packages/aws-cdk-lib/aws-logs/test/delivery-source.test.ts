import { Template } from '../../assertions';
import * as cdk from '../../core';
import { DeliverySource, LogType } from '../lib';

describe('DeliverySource', () => {
  test('creates AWS::Logs::DeliverySource with explicit name', () => {
    const stack = new cdk.Stack();

    new DeliverySource(stack, 'Source', {
      deliverySourceName: 'my-source',
      resourceArn: 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group',
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      Name: 'my-source',
      ResourceArn: 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group',
      LogType: 'AUTO_MODE_COMPUTE_LOGS',
    });
  });

  test('creates AWS::Logs::DeliverySource with auto-generated name', () => {
    const stack = new cdk.Stack();

    new DeliverySource(stack, 'Source', {
      resourceArn: 'arn:aws:eks:us-east-1:123456789012:cluster/my-cluster',
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      ResourceArn: 'arn:aws:eks:us-east-1:123456789012:cluster/my-cluster',
      LogType: 'AUTO_MODE_COMPUTE_LOGS',
    });
  });

  test('accepts LogType.of() for arbitrary log types', () => {
    const stack = new cdk.Stack();

    new DeliverySource(stack, 'Source', {
      resourceArn: 'arn:aws:apigateway:us-east-1::/restapis/abc123',
      logType: LogType.of('ACCESS_LOGS'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      LogType: 'ACCESS_LOGS',
    });
  });

  test('deliverySourceName attribute resolves to CFN Ref', () => {
    const stack = new cdk.Stack(undefined, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const source = new DeliverySource(stack, 'Source', {
      deliverySourceName: 'my-source',
      resourceArn: 'arn:aws:eks:us-east-1:123456789012:cluster/my-cluster',
      logType: LogType.EKS_AUTO_MODE_COMPUTE_LOGS,
    });

    expect(stack.resolve(source.deliverySourceName)).toEqual({
      Ref: expect.stringContaining('Source'),
    });
    expect(stack.resolve(source.deliverySourceRef.deliverySourceName)).toEqual({
      Ref: expect.stringContaining('Source'),
    });
  });

  test('fromDeliverySourceName returns correct ref', () => {
    const stack = new cdk.Stack(undefined, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const source = DeliverySource.fromDeliverySourceName(stack, 'Source', 'imported-source');

    expect(source.deliverySourceRef.deliverySourceName).toEqual('imported-source');
    expect(source.deliverySourceRef.deliverySourceArn).toContain('delivery-source:imported-source');
  });

  test('fromDeliverySourceArn returns correct ref', () => {
    const stack = new cdk.Stack();
    const arn = 'arn:aws:logs:us-east-1:123456789012:delivery-source:imported-source';

    const source = DeliverySource.fromDeliverySourceArn(stack, 'Source', arn);

    expect(source.deliverySourceRef.deliverySourceName).toEqual('imported-source');
    expect(source.deliverySourceRef.deliverySourceArn).toEqual(arn);
  });
});
