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

    const emailIdentity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.publicHostedZone(hostedZone),
      mailFromDomain: 'mail.cdk.dev',
    });

    const importedEmailIdentity = ses.EmailIdentity.fromEmailIdentityArn(
      this,
      'ImportedEmailIdentity',
      emailIdentity.emailIdentityArn,
    );

    const lambdaFunction = new Function(this, 'Function', {
      functionName: 'email-sending-lambda-from-arn',
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(__dirname, 'fixtures', 'send-email')),
      handler: 'index.lambda_handler',
    });

    importedEmailIdentity.grantSendEmail(lambdaFunction);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

new integ.IntegTest(app, 'EmailIdentityFromArnInteg', {
  testCases: [new TestStack(app, 'cdk-ses-email-identity-from-arn-integ')],
});

app.synth();
