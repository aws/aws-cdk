import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as rum from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'RumAlphaAppMonitorIntegrationTestStack');

// Basic app monitor with minimal configuration
const basicAppMonitor = new rum.AppMonitor(stack, 'BasicAppMonitor', {
  appMonitorName: 'basic-alpha-integ-test-app',
  domain: 'example.com',
});

// App monitor with CloudWatch logs enabled
const appMonitorWithLogs = new rum.AppMonitor(stack, 'AppMonitorWithLogs', {
  appMonitorName: 'alpha-integ-test-app-with-logs',
  domain: 'example.com',
  cwLogEnabled: true,
});

// App monitor with configuration
const configuredAppMonitor = new rum.AppMonitor(stack, 'ConfiguredAppMonitor', {
  appMonitorName: 'configured-alpha-integ-test-app',
  domain: 'example.com',
  appMonitorConfiguration: {
    allowCookies: true,
    enableXRay: true,
    sessionSampleRate: 0.3,
  },
  customEvents: {
    enabled: true,
  },
});

// Test log group access
const logGroup = appMonitorWithLogs.logGroup;

// Outputs for verification
new cdk.CfnOutput(stack, 'BasicAppMonitorId', {
  value: basicAppMonitor.appMonitorId,
});

new cdk.CfnOutput(stack, 'BasicAppMonitorName', {
  value: basicAppMonitor.appMonitorName,
});

new cdk.CfnOutput(stack, 'AppMonitorWithLogsId', {
  value: appMonitorWithLogs.appMonitorId,
});

new cdk.CfnOutput(stack, 'ConfiguredAppMonitorId', {
  value: configuredAppMonitor.appMonitorId,
});

if (logGroup) {
  new cdk.CfnOutput(stack, 'LogGroupName', {
    value: logGroup.logGroupName,
  });
}

new integ.IntegTest(app, 'RumAlphaAppMonitorIntegrationTest', {
  testCases: [stack],
});
