import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'listAt-after-parallel');

const passStringList = new sfn.Pass(stack, 'PSL', {
  parameters: { 'newStringList.$': '$.stringList' },
});
const passSingleString = new sfn.Pass(stack, 'PSS', {
  parameters: { 'newSingleString.$': '$.singleString' },
});

const parallel = new sfn.Parallel(stack, 'PRL', {
  resultPath: '$',
});
parallel.branch(passStringList).branch(passSingleString);

const joinPass = new sfn.Pass(stack, 'JP', {
  parameters: {
    'resultStringList.$': sfn.JsonPath.listAt('$[0].newStringList'),
    'newSingleString.$': '$[1].newSingleString',
  },
});

const chain = sfn.Chain.start(parallel).next(joinPass);

new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new integ.IntegTest(app, 'ListAtAfterParallel', {
  testCases: [stack],
});

app.synth();
