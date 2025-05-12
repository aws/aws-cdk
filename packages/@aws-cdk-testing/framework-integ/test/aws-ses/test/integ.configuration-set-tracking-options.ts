import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to validate the domain identity.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');

interface TestStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
}

/**
 * We need to create a configuration set after completing domain authentication for EmailIdentity,
 * but domain authentication takes several tens of seconds after registering the CNAME record.
 * Therefore, by making EmailIdentity a separate stack with dependencies,
 * we ensure that the Configuration set deployment occurs after domain authentication is completed.
 */
class IdentityStack extends Stack {
  public readonly identity: ses.IEmailIdentity;

  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    this.identity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.publicHostedZone(hostedZone),
    });
  }
}

class ConfigurationSetStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const identityStack = new IdentityStack(this, 'IdentityStack', {
      hostedZoneId: props.hostedZoneId,
      hostedZoneName: props.hostedZoneName,
    });

    new ses.ConfigurationSet(this, 'ConfigurationSet', {
      customTrackingRedirectDomain: `tracking.${identityStack.identity.emailIdentityName}`,
      customTrackingHttpsPolicy: ses.HttpsPolicy.REQUIRE,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new ConfigurationSetStack(app, 'ses-configuration-set-tracking-options-integ', {
    hostedZoneId,
    hostedZoneName,
  })],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
