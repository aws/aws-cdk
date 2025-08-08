import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to validate the domain identity.
 *
 * Step 1: Create a public hosted zone in Route53
 * Step 2: Create a email identity in SES and validate it with the hosted zone
 * Step 3: Set the hosted zone name as an env var "HOSTED_ZONE_NAME"
 * Step 4: Run this test
 * Step 5: Correct the hosted zone name in the generated template to `tracking.example.com `
 */
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');

interface TestStackProps extends StackProps {
  hostedZoneName: string;
}

class ConfigurationSetStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    new ses.ConfigurationSet(this, 'ConfigurationSet', {
      customTrackingRedirectDomain: `tracking.${props.hostedZoneName}`,
      customTrackingHttpsPolicy: ses.HttpsPolicy.REQUIRE,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new ConfigurationSetStack(app, 'ses-configuration-set-tracking-options-integ', {
    hostedZoneName,
  })],
  stackUpdateWorkflow: false,
});
