import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ses from 'aws-cdk-lib/aws-ses';

const app = new App();
const stack = new Stack(app, 'cdk-ses-configuration-set-vdmoptions-integ');

const configurationSetVdmOptionsEnabled = new ses.ConfigurationSet(stack, 'VdmOptionsEnabled', {
  configurationSetName: 'vdmoptions-enabled',
  vdmOptions: {
    engagementMetrics: true,
    optimizedSharedDelivery: true,
  },
});

const configurationSetVdmOptionsDisabled = new ses.ConfigurationSet(stack, 'VdmOptionsDisabled', {
  configurationSetName: 'vdmoptions-disabled',
  vdmOptions: {
    engagementMetrics: false,
    optimizedSharedDelivery: false,
  },
});

const configurationSetVdmOptionsNotConfigured = new ses.ConfigurationSet(stack, 'VdmOptionsNotConfigured', {
  configurationSetName: 'vdmoptions-not-configured',
});

new ses.VdmAttributes(stack, 'VdmAccountLevelSettings', {
  engagementMetrics: true,
  optimizedSharedDelivery: true,
});

const test = new integ.IntegTest(app, 'ConfigurationSetVdmOptionsInteg', {
  testCases: [stack],
});

test.assertions.awsApiCall('SESV2', 'GetAccount')
  .expect(integ.ExpectedResult.objectLike({
    VdmAttributes: {
      DashboardAttributes: {
        EngagementMetrics: 'ENABLED',
      },
      GuardianAttributes: {
        OptimizedSharedDelivery: 'ENABLED',
      },
      VdmEnabled: 'ENABLED',
    },
  }));

test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetVdmOptionsEnabled.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    VdmOptions: {
      DashboardOptions: {
        EngagementMetrics: 'ENABLED',
      },
      GuardianOptions: {
        OptimizedSharedDelivery: 'ENABLED',
      },
    },
  }));

test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetVdmOptionsDisabled.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    VdmOptions: {
      DashboardOptions: {
        EngagementMetrics: 'DISABLED',
      },
      GuardianOptions: {
        OptimizedSharedDelivery: 'DISABLED',
      },
    },
  }));

test.assertions.awsApiCall('SESV2', 'GetConfigurationSet', { ConfigurationSetName: configurationSetVdmOptionsNotConfigured.configurationSetName })
  .expect(integ.ExpectedResult.objectLike({
    VdmOptions: undefined,
  }));

app.synth();
