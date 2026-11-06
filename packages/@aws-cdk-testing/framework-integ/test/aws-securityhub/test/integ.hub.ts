import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';

// Run only in an account/Region where Security Hub CSPM is not already enabled.
// Default standards remain disabled, and deleting this test disables its hub.
const app = new cdk.App();
const stack = new cdk.Stack(app, 'SecurityHubStandalone');
const hub = new securityhub.Hub(stack, 'Hub', {
  enableDefaultStandards: false,
  autoEnableControls: false,
  controlFindingGenerator: securityhub.ControlFindingGenerator.SECURITY_CONTROL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const rule = hub.events.onImportedFindings('ImportedFindings');
hub.events.onCustomAction('CustomAction');
hub.events.onInsightResults('InsightResults');

const test = new integ.IntegTest(app, 'SecurityHubStandaloneTest', { testCases: [stack] });
test.assertions.awsApiCall('SecurityHub', 'describeHub', {}).expect(integ.ExpectedResult.objectLike({
  HubArn: hub.hubArn,
  AutoEnableControls: false,
  ControlFindingGenerator: 'SECURITY_CONTROL',
}));
test.assertions.awsApiCall('EventBridge', 'describeRule', { Name: rule.ruleName }).expect(integ.ExpectedResult.objectLike({
  Name: rule.ruleName,
  State: 'ENABLED',
}));
