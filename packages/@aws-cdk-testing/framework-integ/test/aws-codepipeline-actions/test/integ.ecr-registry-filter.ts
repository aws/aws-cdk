import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as events from 'aws-cdk-lib/aws-events';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ecr-registry-filter');
const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      stageName: 'Source',
      actions: [new actions.EcrSourceAction({
        actionName: 'Ecr', repository, output: new codepipeline.Artifact(), registryId: stack.account,
      })],
    },
    { stageName: 'Approve', actions: [new actions.ManualApprovalAction({ actionName: 'Approve' })] },
  ],
});
const rule = pipeline.node.findAll().find(events.CfnRule.isCfnRule)!;
const integ = new IntegTest(app, 'RegistryFilter', { testCases: [stack] });
const describeRule = integ.assertions.awsApiCall('EventBridge', 'describeRule', { Name: rule.ref });
// Verify the deployed rule filters the account, rather than a nonexistent detail.registryId field.
describeRule.assertAtPath('EventPattern', ExpectedResult.stringLikeRegexp('"account":\\s*\\["' + stack.account + '"\\]'));
