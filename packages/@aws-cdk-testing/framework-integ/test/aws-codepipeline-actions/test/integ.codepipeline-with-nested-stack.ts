import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction, StateMachineInput, StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

/**
 * This test is to make sure the stack names are resolved when using in nested stacks with
 * cross-region CodePipeline construct. We should allow dry-run on this integration test. The reason
 * is that cross-region support for CodePipeline requires an explicit account during stack
 * creation. The local account vs CI account would always be different and cause failure
 * during the integration test run.
 *
 * To update the snapshots, run `yarn integ aws-codepipeline-actions/test/integ.codepipeline-with-nested-stack --update-on-failed --dry-run`.
 *
 * To deploy this stack manually, you need to do the following:
 * 1. change the account id in stack from '123456789012' to your local account id.
 * 2. update imported SFN account id from '123456789012' to your local account id.
 * 3. make sure you've bootstrapped 'us-west-2' by running 'cdk bootstrap aws://<your-aws-account-id>/us-west-2'
 * 4. deploy a state machine resource in 'us-west-2' and name the state machine 'MyStateMachine'
 * 5. update GitHub source section to use the valid OAuth token.
 * 6. run 'yarn integ aws-codepipeline-actions/test/integ.codepipeline-with-nested-stack --update-on-failed --force'
 */

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new PipelineCrossRegionStack(this, 'PipelineCrossRegionStack', props);
  }
}

export class PipelineCrossRegionStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const machine = cdk.Arn.format({
      service: 'states',
      resource: 'stateMachine',
      account: cdk.Token.asString('123456789012'),
      resourceName: 'MyStateMachine',
      region: 'us-west-2',
    }, this);
    const stateMachine = sfn.StateMachine.fromStateMachineArn(this, 'StateMachine', machine);

    const role = new Role(this, 'Role', {
      roleName: 'MyPipelineRoleName',
      assumedBy: new ServicePrincipal('codepipeline.amazonaws.com'),
    });
    new Pipeline(this, 'Pipeline', {
      crossAccountKeys: true,
      role,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new GitHubSourceAction({
              actionName: 'Github',
              owner: 'aws',
              repo: 'aws-cdk',
              branch: 'master',
              oauthToken: SecretValue.unsafePlainText('test'),
              output: new Artifact('Pipeline'),
            }),
          ],
        },
        {
          stageName: 'Test',
          actions: [
            new StepFunctionInvokeAction({
              actionName: 'Test',
              stateMachine: stateMachine,
              stateMachineInput: StateMachineInput.literal({}),
            }),
          ],
        },
      ],
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});
const testCase = new MainStack(app, 'code-pipeline-nested-stack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

new IntegTest(app, 'integ-code-pipeline-nested-stack', {
  testCases: [testCase],
});
