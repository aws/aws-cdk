import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/*
 * Verifies that `timeout` is applied when the definition body comes from an
 * ASL JSON file (FileDefinitionBody) or an inline ASL JSON string
 * (StringDefinitionBody). Previously the timeout property was silently
 * ignored for these two body types and only honored for ChainDefinitionBody.
 *
 * Fixes #37150.
 *
 * Stack verification steps:
 * - aws stepfunctions describe-state-machine --state-machine-arn <FromString>
 *     should show "TimeoutSeconds": 30 in the definition.
 * - aws stepfunctions describe-state-machine --state-machine-arn <FromFile>
 *     should show "TimeoutSeconds": 60 in the definition.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-timeout-asl-integ');

const inlineDefinition = JSON.stringify({
  StartAt: 'PassState',
  States: {
    PassState: {
      Type: 'Pass',
      End: true,
    },
  },
});

const fromString = new sfn.StateMachine(stack, 'FromString', {
  definitionBody: sfn.DefinitionBody.fromString(inlineDefinition),
  timeout: cdk.Duration.seconds(30),
});

const fromFile = new sfn.StateMachine(stack, 'FromFile', {
  definitionBody: sfn.DefinitionBody.fromFile(path.join(__dirname, 'definition.asl.json')),
  timeout: cdk.Duration.seconds(60),
});

new cdk.CfnOutput(stack, 'FromStringArn', { value: fromString.stateMachineArn });
new cdk.CfnOutput(stack, 'FromFileArn', { value: fromFile.stateMachineArn });

new integ.IntegTest(app, 'StateMachineTimeoutAslTest', {
  testCases: [stack],
});
