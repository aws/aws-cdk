import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

interface TestStackProps extends StackProps {
  domainName: string;
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    // Import a domain-authenticated EmailIdentity.
    // Since domain authentication takes time, it cannot be created during integration testing.
    // ses.EmailIdentity.fromEmailIdentityName(this, 'Identity', props.domainName);

    new ses.ConfigurationSet(this, 'ConfigurationSet', {
      customTrackingRedirectDomain: `tracking.${domainName}`,
      customTrackingHttpsPolicy: ses.HttpsPolicy.REQUIRE,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new TestStack(app, 'ses-configuration-set-tracking-options-integ', {
    domainName,
  })],
});
