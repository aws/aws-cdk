import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ses from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.fromHostedZone(hostedZone),
      mailFromDomain: 'mail.cdk.dev',
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'EmailIdentityInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});

app.synth();
