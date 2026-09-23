import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ses from 'aws-cdk-lib/aws-ses';

const app = new App();
const stack = new Stack(app, 'cdk-ses-configuration-set-auto-validation');

const configurationSetAutoValidationDisabled = new ses.ConfigurationSet(stack, 'AutoValidationDisabled', {
  configurationSetName: 'auto-validation-disabled',
  disableAutoValidation: true,
});

const configurationSetAutoValidationEnabledWithoutThreshold = new ses.ConfigurationSet(stack, 'AutoValidationEnabledWithoutThreshold', {
  configurationSetName: 'auto-validation-enabled-without-threshold',
  disableAutoValidation: false,
});

const configurationSetWithSuppressionReasons = new ses.ConfigurationSet(stack, 'WithSuppressionReasons', {
  configurationSetName: 'with-suppression-reasons',
  suppressionReasons: ses.SuppressionReasons.BOUNCES_AND_COMPLAINTS,
  autoValidationThreshold: ses.AutoValidationThreshold.MANAGED,
});

const test = new integ.IntegTest(app, 'ConfigurationSetAutoValidationInteg', {
  testCases: [stack],
});

// Assert Auto Validation is explicitly DISABLED
test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetAutoValidationDisabled.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    SuppressionOptions: {
      ValidationOptions: {
        ConditionThreshold: {
          ConditionThresholdEnabled: 'DISABLED',
        },
      },
    },
  }));

// Assert Auto Validation is ENABLED but threshold is left to SES default
test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetAutoValidationEnabledWithoutThreshold.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    SuppressionOptions: {
      ValidationOptions: {
        ConditionThreshold: {
          ConditionThresholdEnabled: 'ENABLED',
        },
      },
    },
  }));

// Assert combined with suppression reasons
test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetWithSuppressionReasons.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    SuppressionOptions: {
      SuppressedReasons: ['BOUNCE', 'COMPLAINT'],
      ValidationOptions: {
        ConditionThreshold: {
          ConditionThresholdEnabled: 'ENABLED',
          OverallConfidenceThreshold: {
            ConfidenceVerdictThreshold: 'MANAGED',
          },
        },
      },
    },
  }));
