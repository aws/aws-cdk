import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ses from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const identity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: 'cdk.dev',
      mailFromDomain: 'mail.cdk.dev',
    });

    for (const [index, record] of identity.dkimRecords.entries()) {
      new CfnOutput(this, `Dkim${index}`, {
        value: `${record.name}:${record.value}`,
      });
    }
  }
}

const app = new App();

new integ.IntegTest(app, 'EmailIdentityInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});

app.synth();
