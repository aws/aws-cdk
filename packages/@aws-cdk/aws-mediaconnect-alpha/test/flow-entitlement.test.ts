import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Flow } from '../lib/flow';
import { EntitlementStatus, FlowEntitlement } from '../lib/flow-entitlement';
import { EncryptionAlgorithm } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect Entitlement creation', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-CQwNVVFcCVgNBg8D-3104ecf5a408:test',
  });

  new FlowEntitlement(stack, 'flow-entitlement', {
    description: 'flow-another-account',
    flow,
    subscribers: ['11111111'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowEntitlement', {
    Description: 'flow-another-account',
    FlowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
    Name: 'flowentitlement',
    Subscribers: ['11111111'],
  });
});

test('Entitlement with encryption and status', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  const secret = new Secret(stack, 'Secret');

  new FlowEntitlement(stack, 'entitlement', {
    description: 'test entitlement',
    flow,
    subscribers: ['111122223333'],
    entitlementStatus: EntitlementStatus.DISABLED,
    dataTransferSubscriberFeePercent: 50,
    encryption: {
      secret,
      algorithm: EncryptionAlgorithm.AES256,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowEntitlement', {
    Description: 'test entitlement',
    Subscribers: ['111122223333'],
    EntitlementStatus: 'DISABLED',
    DataTransferSubscriberFeePercent: 50,
    Encryption: {
      KeyType: 'static-key',
      Algorithm: 'aes256',
      SecretArn: Match.anyValue(),
      RoleArn: Match.anyValue(),
    },
  });
});

test('Entitlement name validation - too long', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  expect(() => {
    new FlowEntitlement(stack, 'entitlement', {
      flowEntitlementName: 'a'.repeat(65),
      description: 'test',
      flow,
      subscribers: ['111122223333'],
    });
  }).toThrow(/Flow entitlement name must be between 1 and 64 characters/);
});

test('Entitlement name validation - invalid characters', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  expect(() => {
    new FlowEntitlement(stack, 'entitlement', {
      flowEntitlementName: 'invalid@name',
      description: 'test',
      flow,
      subscribers: ['111122223333'],
    });
  }).toThrow(/Flow entitlement name must contain only alphanumeric characters/);
});

test('Entitlement description validation - too long', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  expect(() => {
    new FlowEntitlement(stack, 'entitlement', {
      description: 'a'.repeat(1025),
      flow,
      subscribers: ['111122223333'],
    });
  }).toThrow(/Flow entitlement description must not exceed 1024 characters/);
});

test.each([-1, 101, 50.5])('Entitlement dataTransferSubscriberFeePercent out of range — fails for %p', (pct) => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  expect(() => {
    new FlowEntitlement(stack, 'entitlement', {
      description: 'desc',
      flow,
      subscribers: ['111122223333'],
      dataTransferSubscriberFeePercent: pct,
    });
  }).toThrow(/dataTransferSubscriberFeePercent must be an integer between 0 and 100/);
});

test('Entitlement dataTransferSubscriberFeePercent in range — accepts boundaries', () => {
  const flow = Flow.fromFlowAttributes(stack, 'flow', {
    flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-abc:my-flow',
    sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source',
  });

  for (const pct of [0, 50, 100]) {
    expect(() => {
      new FlowEntitlement(stack, `entitlement-${pct}`, {
        description: `desc-${pct}`,
        flow,
        subscribers: ['111122223333'],
        dataTransferSubscriberFeePercent: pct,
      });
    }).not.toThrow();
  }
});

test('Import entitlement from attributes', () => {
  const entitlement = FlowEntitlement.fromFlowEntitlementArn(stack, 'imported',
    'arn:aws:mediaconnect:us-east-1:123456789012:entitlement:1-abc:my-entitlement',
  );

  expect(entitlement.entitlementArn).toBe('arn:aws:mediaconnect:us-east-1:123456789012:entitlement:1-abc:my-entitlement');
});
