import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    new route53.ARecord(this, 'MultiValueAnswerRouting', {
      zone: hostedZone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
      multiValueAnswer: true,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'multi-value-answer-routing');

new IntegTest(app, 'Route53MultiValueAnswerRoutingInteg', {
  testCases: [stack],
});
app.synth();
