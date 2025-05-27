import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  public readonly stateMachine: sfn.StateMachine;
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const sendSuccess = new tasks.CallAwsService(this, 'SendSuccess', {
      service: 'sfn',
      action: 'sendTaskSuccess',
      parameters: {
        TaskToken: sfn.JsonPath.stringAt('$.taskToken'),
        Output: '{}',
      },
      iamResources: ['*'],
    });
    const acceptorStateMachine = new sfn.StateMachine(this, 'AcceptorStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(sendSuccess),
    });

    const targetRegion = cdk.Stack.of(this).region;

    const startExecution = new tasks.CallAwsServiceCrossRegion(this, 'StartExecution', {
      service: 'sfn',
      action: 'startExecution',
      parameters: {
        'stateMachineArn': acceptorStateMachine.stateMachineArn,
        'input.$': 'States.Format(\'\\{"taskToken": "{}"\\}\', $$.Task.Token)',
      },
      iamResources: [acceptorStateMachine.stateMachineArn],
      region: targetRegion,
      resultPath: sfn.JsonPath.DISCARD,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(startExecution),
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new TestStack(app, 'aws-stepfunctions-aws-sdk-cross-region-task-token-integ');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions
  .awsApiCall('StepFunctions', 'describeExecution', {
    executionArn,
  })
  .expect(
    ExpectedResult.objectLike({
      status: 'SUCCEEDED',
    }),
  )
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(10),
  });

app.synth();
