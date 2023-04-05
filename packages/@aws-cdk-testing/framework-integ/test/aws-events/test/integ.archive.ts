import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Archive, CfnArchive, EventBus } from 'aws-cdk-lib/aws-events';

const app = new App();

const stack = new Stack(app, 'IntegStack');

const eventBus = new EventBus(stack, 'EventBridge');

const archive = new Archive(stack, 'Archive', {
  sourceEventBus: eventBus,
  eventPattern: {
    account: [stack.account],
  },
});
(archive.node.defaultChild as CfnArchive).overrideLogicalId('MyCustomArchive');

new IntegTest(app, 'ArchiveTest', {
  testCases: [stack],
});
