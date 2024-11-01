import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction, StateMachineInput, StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new PipelineCrossRegionStack(this, 'PipelineCrossRegionStack', {
      ...props,
      stackName: 'integ-test-pipeline-nested-stack-cross-region',
    });
  }
}

export class PipelineCrossRegionStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const machine = cdk.Arn.format({
      service: 'states',
      resource: 'stateMachine',
      account: cdk.Token.asString(process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT),
      partition: cdk.ArnFormat.COLON_RESOURCE_NAME,
      resourceName: 'stateMachineFromAnotherRegion',
      region: 'eu-west-1',
    }, this);
    const stateMachine = sfn.StateMachine.fromStateMachineArn(this, 'StateMachine', machine);

    const role = new Role(this, 'Role', {
      roleName: 'MyRoleName',
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
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
  },
});
const testCase = new MainStack(app, 'code-pipeline-nested-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});

new IntegTest(app, 'integ-code-pipeline-nested-stack', {
  testCases: [testCase],
});