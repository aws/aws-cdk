import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/**
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-stepfunctions-map-distributed-stack');
let index = 0;

function createMap() {
  index++;

  return new sfn.DistributedMap(stack, `Map ${index}`, {
    stateName: 'My-Map-State',
    maxConcurrencyPath: sfn.JsonPath.stringAt('$.maxConcurrency'),
    itemsPath: sfn.JsonPath.stringAt('$.inputForMap'),
    itemSelector: {
      foo: 'foo',
      bar: sfn.JsonPath.stringAt('$.bar'),
    },
  }).itemProcessor(new sfn.Pass(stack, `Pass State ${index}`), {
    mode: sfn.ProcessorMode.DISTRIBUTED,
    executionType: sfn.ProcessorType.STANDARD,
  });
}

const sm1 = new sfn.StateMachine(stack, 'StateMachine1', {
  definitionBody: sfn.DefinitionBody.fromChainable(createMap()),
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'StateMachine1ARN', {
  value: sm1.stateMachineArn,
});
new cdk.CfnOutput(stack, 'StateMachine1RoleARN', {
  value: sm1.role.roleArn,
});

const sm2 = new sfn.StateMachine(stack, 'StateMachine2', {
  definitionBody: sfn.DefinitionBody.fromChainable(createMap()),
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'StateMachine2ARN', {
  value: sm2.stateMachineArn,
});
new cdk.CfnOutput(stack, 'StateMachine2RoleARN', {
  value: sm2.role.roleArn,
});

new IntegTest(app, 'cdk-stepfunctions-map-distributed-iam-integ', {
  testCases: [stack],
});

app.synth();
