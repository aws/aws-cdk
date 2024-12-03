import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stringset-after-parallel');

const table = new ddb.Table(stack, 'Table', {
  partitionKey: { name: 'pk', type: ddb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const passPK = new sfn.Pass(stack, 'passPK', {
  parameters: { 'pk.$': '$.pk' },
});
const passStringSet = new sfn.Pass(stack, 'PassStringSet', {
  parameters: { 'stringset.$': '$.stringset' },
});

const parallel = new sfn.Parallel(stack, 'Parallel', {
  resultPath: '$',
});
parallel.branch(passPK)
  .branch(passStringSet);

const putItem = new tasks.DynamoPutItem(stack, 'PutItem', {
  table: table,
  item: {
    pk: tasks.DynamoAttributeValue.fromString('$[0].pk'),
    stringset: tasks.DynamoAttributeValue.fromStringSet(sfn.JsonPath.listAt('$[1].stringset')),
  },
});

const definition = sfn.Chain.start(parallel).next(putItem);

new sfn.StateMachine(stack, 'StateMachine', {
  definition: definition,
});

new integ.IntegTest(app, 'StringSetAfterParallel', {
  testCases: [stack],
});

app.synth();
