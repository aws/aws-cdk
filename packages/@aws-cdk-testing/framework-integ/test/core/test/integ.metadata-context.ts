import { App, CfnContextMutability, CfnContextTrustConfidence, CfnContextTrustSource, CfnResourceMetadataContext, CfnTemplateMetadataContext, ConstructSelector, Stack } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new App();
const stack = new Stack(app, 'MetadataContextTestStack', {
  description: 'integ test stack for MetadataContext; exercises resource + template level context',
});

CfnTemplateMetadataContext.of(stack).set({
  arch: 'SQS buffer -> consumer; DLQ for poison msgs',
  must: ['all queues encrypted w/ SSE'],
  ref: [
    { at: 'context/shared/encryption.ctx.yaml', has: 'org CMK + tagging rules', scope: 'shared' },
  ],
  owner: 'framework-integ-team',
});

// The queue-specific Context below replaces this default.
CfnResourceMetadataContext.of(stack).set({
  why: 'part of the order-processing subsystem',
  deps: ['OrderProcessingSubsystem'],
}, {
  selector: ConstructSelector.resourcesOfType('AWS::SQS::Queue'),
});

const queue = new sqs.Queue(stack, 'OrderQueue', {
  // Keep the configuration consistent with the template-level rule.
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});
CfnResourceMetadataContext.of(queue).set({
  why: 'buffer order events async; std queue (throughput > ordering)',
  must: ['VisTimeout >= 6x consumer timeout, else dup on retry'],
  mutable: CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
  mutability: { QueueName: CfnContextMutability.MUST_NEVER_CHANGE },
  trust: { src: CfnContextTrustSource.AUTHORED, conf: CfnContextTrustConfidence.HIGH },
});

const subsystem = new Construct(stack, 'Notifications');
new sns.Topic(subsystem, 'AlertsTopic');
CfnResourceMetadataContext.of(subsystem).set({
  why: 'fan-out of alert events to oncall channels',
}, {
  selector: ConstructSelector.all(),
});

new integ.IntegTest(app, 'MetadataContextInteg', {
  testCases: [stack],
});
