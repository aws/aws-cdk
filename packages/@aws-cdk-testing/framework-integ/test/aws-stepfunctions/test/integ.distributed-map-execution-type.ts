import * as cdk from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

class DistributedMapStack extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const distributedMap = new sfn.DistributedMap(this, 'DistributedMap', {
      mapExecutionType: sfn.StateMachineType.EXPRESS,
    });
    distributedMap.itemProcessor(new sfn.Pass(this, 'Pass'), {
      mode: sfn.ProcessorMode.DISTRIBUTED,
      executionType: sfn.ProcessorType.STANDARD,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: distributedMap,
    });
  }
}

const app = new cdk.App();
const stack = new DistributedMapStack(app, 'aws-stepfunctions-map-integ-execution-type');

new IntegTest(app, 'DistributedMap', {
  testCases: [stack],
});

app.synth();
