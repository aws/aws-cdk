import * as cdk from '@aws-cdk/core';
import { Aspects, IAspect } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { IConstruct } from 'constructs';
import * as ecs from '../../lib';
import { ContainerDefinition } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-aspect-mutate-command-entrypoint');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  command: ['echo', 'hi'],
  entryPoint: ['/bin/bash', '-c'],
});

class TestAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof ContainerDefinition) {
      node.entryPoint = ['/security-monitor', ...node.entryPoint!];
      node.command = ['/security-monitor', ...node.command!];
    }
  }
}

Aspects.of(stack).add(new TestAspect);

new integ.IntegTest(app, 'aws-ecs-fargate-integ-aspect-mutate-command-entrypoint', {
  testCases: [stack],
});

app.synth();
