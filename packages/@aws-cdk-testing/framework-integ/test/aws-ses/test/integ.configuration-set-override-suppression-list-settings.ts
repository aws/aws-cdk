import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ses.ConfigurationSet(this, 'DisableSuppressionList', {
      disableSuppressionList: true,
    });

    new ses.ConfigurationSet(this, 'OverrideSuppressionReasonsToBouncesOnly', {
      suppressionReasons: ses.SuppressionReasons.BOUNCES_ONLY,
    });

    new ses.ConfigurationSet(this, 'OverrideSuppressionReasonsToComplaintsOnly', {
      suppressionReasons: ses.SuppressionReasons.COMPLAINTS_ONLY,
    });

    new ses.ConfigurationSet(this, 'OverrideSuppressionReasonsToBouncesAndComplaints', {
      suppressionReasons: ses.SuppressionReasons.BOUNCES_AND_COMPLAINTS,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetOverridingSuppressionListSettingsInteg', {
  testCases: [new TestStack(app, 'cdk-ses-configuration-set-overriding-suppression-list-integ')],
});
