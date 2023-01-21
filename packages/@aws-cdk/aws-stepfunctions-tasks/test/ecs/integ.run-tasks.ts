import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as tasks from '../../lib';

class EcsRunTaskStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'Cluster');

    // Build task definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });
    const containerDefinition = taskDefinition.addContainer('ContainerDef', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 256,
      logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
    });

    // Build task
    const task = new tasks.EcsRunTask(this, 'EcsRunTask', {
      cluster,
      taskDefinition,
      propagateTagsFrom: ecs.PropagatedTagSource.SERVICE,
      containerOverrides: [
        {
          containerDefinition: containerDefinition,
          environment: [{ name: 'SOME_KEY', value: sfn.JsonPath.stringAt('$.SomeKey') }],
        },
      ],
      launchTarget: new tasks.EcsFargateLaunchTarget(),
    });

    // Build state machine
    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
    }).next(task);

    new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });
  }
}

const app = new cdk.App();

const stack = new EcsRunTaskStack(app, 'EcsRunStack');

new integ.IntegTest(app, 'EcsRunTaskTest', {
  testCases: [stack],
});

app.synth();
