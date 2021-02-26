import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../../lib';

// Test various cross-stack Cluster/Service/ALB scenario's

let app: App;
let stack1: Stack;
let stack2: Stack;
let cluster: ecs.Cluster;
let service: ecs.Ec2Service;

nodeunitShim({
  'setUp'(cb: () => void) {
    app = new App();

    stack1 = new Stack(app, 'Stack1');
    const vpc = new ec2.Vpc(stack1, 'Vpc');
    cluster = new ecs.Cluster(stack1, 'Cluster', {
      vpc,
      capacity: { instanceType: new ec2.InstanceType('t2.micro') },
    });

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

    cb();
  },

  'ALB next to Service'(test: Test) {
    // WHEN
    const lb = new elbv2.ApplicationLoadBalancer(stack2, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    expect(stack2).to(haveResource('AWS::ECS::Service'));

    expectIngress(stack2);

    test.done();
  },

  'ALB next to Cluster'(test: Test) {
    // WHEN
    const lb = new elbv2.ApplicationLoadBalancer(stack1, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    expect(stack2).to(haveResource('AWS::ECS::Service'));
    expectIngress(stack2);

    test.done();
  },

  'ALB in its own stack'(test: Test) {
    // WHEN
    const stack3 = new Stack(app, 'Stack3');
    const lb = new elbv2.ApplicationLoadBalancer(stack3, 'ALB', { vpc: cluster.vpc });
    const listener = lb.addListener('listener', { port: 80 });
    listener.addTargets('target', {
      port: 80,
      targets: [service],
    });

    // THEN: it shouldn't throw due to cyclic dependencies
    expect(stack2).to(haveResource('AWS::ECS::Service'));
    expectIngress(stack2);

    test.done();
  },
});

function expectIngress(stack: Stack) {
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    FromPort: 32768,
    ToPort: 65535,
    GroupId: { 'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttClusterDefaultAutoScalingGroupInstanceSecurityGroup1D15236AGroupIdEAB9C5E1' },
  }));
}