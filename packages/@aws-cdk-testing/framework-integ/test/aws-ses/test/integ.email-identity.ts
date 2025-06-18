import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    const lambdaFunction = new Function(this, 'Function', {
      functionName: 'email-sending-lambda',
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(__dirname, 'fixtures', 'send-email')),
      handler: 'index.lambda_handler',
    });

    const emailIdentity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.publicHostedZone(hostedZone),
      mailFromDomain: 'mail.cdk.dev',
    });

    emailIdentity.grantSendEmail(lambdaFunction);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

new integ.IntegTest(app, 'EmailIdentityInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});

app.synth();
