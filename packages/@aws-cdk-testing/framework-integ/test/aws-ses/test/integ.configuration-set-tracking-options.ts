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
 * Step 3: Set the domain name as an env var "DOMAIN_NAME"
 * Step 4: Run this test
 */
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

interface TestStackProps extends StackProps {
  domainName: string;
}

class ConfigurationSetStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    new ses.ConfigurationSet(this, 'ConfigurationSet', {
      customTrackingRedirectDomain: `tracking.${props.domainName}`,
      customTrackingHttpsPolicy: ses.HttpsPolicy.REQUIRE,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new ConfigurationSetStack(app, 'ses-configuration-set-tracking-options-integ', {
    domainName,
  })],
  stackUpdateWorkflow: false,
});
