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

    new CfnOutput(this, 'TokenName1', {
      value: identity.dkimDnsTokenName1,
    });

    new CfnOutput(this, 'TokenValue1', {
      value: identity.dkimDnsTokenValue1,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'EmailIdentityInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});

app.synth();
