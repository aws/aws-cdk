import * as targets from '../../aws-events-targets';
import * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import * as config from '../lib';

const app = new cdk.App();

class ConfigStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    // A custom rule that runs on configuration changes of EC2 instances
    const fn = new lambda.Function(this, 'CustomFunction', {
      code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    new config.CustomRule(this, 'Custom', {
      configurationChanges: true,
      lambdaFunction: fn,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
    });

    // A rule to detect stacks drifts
    const driftRule = new config.CloudFormationStackDriftDetectionCheck(this, 'Drift');

    // Topic for compliance events
    const complianceTopic = new sns.Topic(this, 'ComplianceTopic');

    // Send notification on compliance change
    driftRule.onComplianceChange('ComplianceChange', {
      target: new targets.SnsTopic(complianceTopic),
    });
    /// !hide
  }
}

new ConfigStack(app, 'aws-cdk-config-rule-integ', {});
app.synth();
