import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as sfn from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-map-integ');

const pass = new sfn.Pass(stack, 'Pass');

const distributedMap = new sfn.Map(stack, 'DistributedMap', {
  mode: sfn.MapProcessorMode.DISTRIBUTED,
  distributatedMapOptions: {
    itemReader: new sfn.S3CSVReader({
      bucket: 'my-bucket',
      key: 'my-key.csv',
    }),
    resultWriter: new sfn.S3Writer({
      bucket: 'my-bucket',
      prefix: 'my-prefix',
    }),
  },
});
distributedMap.iterator(pass);

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: distributedMap,
});

const test = new integ.IntegTest(app, 'DistributedMap', {
  testCases: [stack],
});
test.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: stateMachine.stateMachineArn,
}).expect(integ.ExpectedResult.objectLike({
  status: 'ACTIVE',
}));

app.synth();
