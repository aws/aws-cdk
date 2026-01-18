import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ses from 'aws-cdk-lib/aws-ses';

const app = new App();
const stack = new Stack(app, 'cdk-ses-configuration-set-confidence-verdict-threshold-integ');

const configurationSetThresholdDisabled = new ses.ConfigurationSet(stack, 'ThresholdDisabled', {
  configurationSetName: 'threshold-disabled',
  confidenceVerdictThreshold: ses.ConfidenceVerdictThreshold.DISABLED,
});

const configurationSetWithSuppressionReasons = new ses.ConfigurationSet(stack, 'WithSuppressionReasons', {
  configurationSetName: 'with-suppression-reasons',
  suppressionReasons: ses.SuppressionReasons.BOUNCES_AND_COMPLAINTS,
  confidenceVerdictThreshold: ses.ConfidenceVerdictThreshold.MANAGED,
});

const test = new integ.IntegTest(app, 'ConfigurationSetConfidenceVerdictThresholdInteg', {
  testCases: [stack],
});

// Assert DISABLED threshold
test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetThresholdDisabled.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    SuppressionOptions: {
      ConditionThreshold: {
        ConditionThresholdEnabled: 'DISABLED',
      },
    },
  }));

// Assert combined with suppression reasons
test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetWithSuppressionReasons.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    SuppressionOptions: {
      SuppressedReasons: ['BOUNCE', 'COMPLAINT'],
      ConditionThreshold: {
        ConditionThresholdEnabled: 'ENABLED',
        OverallConfidenceThreshold: {
          ConfidenceVerdictThreshold: 'MANAGED',
        },
      },
    },
  }));
