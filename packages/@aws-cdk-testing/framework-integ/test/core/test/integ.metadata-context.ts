import { App, ContextMutability, ContextTrustConfidence, ContextTrustSource, MetadataContext, Stack } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new App();
const stack = new Stack(app, 'MetadataContextTestStack', {
  description: 'integ test stack for MetadataContext; exercises resource + template level context',
});

// Template-level cross-cutting context
MetadataContext.of(stack).addToTemplate({
  arch: 'SQS buffer -> consumer; DLQ for poison msgs',
  must: ['all queues encrypted w/ SSE'],
  refs: [
    { at: 's3://org-iac-ctx/shared/encryption.ctx.yaml', has: 'org CMK + tagging rules', scope: 'shared' },
  ],
  owner: 'framework-integ@example.com',
});

// Resource-level context on an L2: renders onto the primary AWS::SQS::Queue only
const queue = new sqs.Queue(stack, 'OrderQueue');
MetadataContext.of(queue).add({
  why: 'buffer order events async; std queue (throughput > ordering)',
  must: ['VisTimeout >= 6x consumer timeout, else dup on retry'],
  mutable: ContextMutability.CHANGE_WITH_CONSTRAINTS,
  mutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
  trust: { source: ContextTrustSource.AUTHORED, confidence: ContextTrustConfidence.HIGH },
  ops: 'check ApproxAgeOfOldestMsg before cutting VisTimeout',
  failureModes: ['retry 3x w/ exp backoff before DLQ'],
});

// Scope-level context cascading to all primary resources beneath it
const subsystem = new Construct(stack, 'Notifications');
new sns.Topic(subsystem, 'AlertsTopic');
MetadataContext.of(subsystem).add({
  why: 'fan-out of alert events to oncall channels',
  gaps: ['delivery retry policy never validated under load'],
});

new integ.IntegTest(app, 'MetadataContextInteg', {
  testCases: [stack],
});
