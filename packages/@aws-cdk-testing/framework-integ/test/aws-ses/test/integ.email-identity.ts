import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.publicHostedZone(hostedZone),
      mailFromDomain: 'mail.cdk.dev',
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'EmailIdentityInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});

app.synth();
