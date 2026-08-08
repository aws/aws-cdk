import { App, CfnResource, ContextMutability, MetadataContextMixin, Mixins, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'MetadataContextMixinTestStack', {
  description: 'integ test stack for MetadataContextMixin; exercises single and bulk application',
});

// Imperative application to a single L1 resource via .with()
const auditQueue = new CfnResource(stack, 'AuditQueue', { type: 'AWS::SQS::Queue' });
auditQueue.with(new MetadataContextMixin({
  why: 'append-only audit trail buffer',
  mutable: ContextMutability.MUST_NEVER_CHANGE,
  must: ['never shorten retention below 14d (audit requirement)'],
}));

// Bulk application to every CloudFormation resource in a scope
new CfnResource(stack, 'EventsTopic', { type: 'AWS::SNS::Topic' });
Mixins.of(stack).apply(new MetadataContextMixin({
  deps: ['NetworkStack'],
}));

new IntegTest(app, 'MetadataContextMixinInteg', {
  testCases: [stack],
});
