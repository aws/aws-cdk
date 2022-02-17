import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Stack } from '@aws-cdk/core';
import * as ecs from '../../lib';
import { addDefaultCapacityProvider } from '../util';

// Test various cross-stack Cluster/Service/ALB scenario's

let app: App;
let stack1: Stack;
let stack2: Stack;
let cluster: ecs.Cluster;
let service: ecs.Ec2Service;

describe('cross stack', () => {
  beforeEach(() => {
    app = new App();

    stack1 = new Stack(app, 'Stack1');
    const vpc = new ec2.Vpc(stack1, 'Vpc');
    cluster = new ecs.Cluster(stack1, 'Cluster', {
      vpc,
    });
    addDefaultCapacityProvider(cluster, stack1, vpc);

    stack2 = new Stack(app, 'Stack2');
    const taskDefinition = new ecs.Ec2TaskDefinition(stack2, 'TD');
    const container = taskDefinition.addContainer('Main', {
      image: ecs.ContainerImage.fromRegistry('asdf'),
      memoryLimitMiB: 512,
    });
    container.addPortMappings({ containerPort: 8000 });

    service = new ecs.Ec2Service(stack2, 'Service', {
      cluster,
      taskDefinition,
    });


  });

  test('ALB next to Service', () => {
    // WHEN
    const lb = new elbv2.ApplicationLoadBalancer(stack2, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);

    expectIngress(stack2);


  });

  test('ALB next to Cluster', () => {
    // WHEN
    const lb = new elbv2.ApplicationLoadBalancer(stack1, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);
    expectIngress(stack2);


  });

  test('ALB in its own stack', () => {
    // WHEN
    const stack3 = new Stack(app, 'Stack3');
    const lb = new elbv2.ApplicationLoadBalancer(stack3, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);
    expectIngress(stack2);


  });
});

function expectIngress(stack: Stack) {
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    FromPort: 32768,
    ToPort: 65535,
    GroupId: { 'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttDefaultAutoScalingGroupInstanceSecurityGroupFBA881D0GroupId2F7C804A' },
  });
}
