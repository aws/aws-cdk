import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import * as integ from '@aws-cdk/integ-tests-alpha';

class SNSFifoArchivePolicyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new Topic(this, 'MyTopic', {
      fifo: true,
      messageRetentionPeriodInDays: 12,
    });
  }
}

const app = new App();

const stack = new SNSFifoArchivePolicyStack(app, 'SNSFifoArchivePolicyStack');

new integ.IntegTest(app, 'SqsTest', {
  testCases: [stack],
});

app.synth();
