import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AssignPublicIpExtension, Container, Environment, EnvironmentCapacityType, Service, ServiceDescription } from '../lib';
import { TaskRecordManager } from '../lib/extensions/assign-public-ip/task-record-manager';

export = {
  'should assign a public ip to fargate tasks'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));
    serviceDescription.add(new AssignPublicIpExtension());

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::Service', {
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: 'ENABLED',
        },
      },
    }));

    test.done();
  },

  'errors when adding a public ip to ec2-backed service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    const environment = new Environment(stack, 'production', {
      vpc,
      cluster,
      capacityType: EnvironmentCapacityType.EC2,
    });

    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));
    serviceDescription.add(new AssignPublicIpExtension());

    // WHEN / THEN
    test.throws(() => {
      new Service(stack, 'my-service', {
        environment,
        serviceDescription,
      });
    }, /Fargate/i);

    test.done();
  },

  'should not add a task record manager by default'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    // WHEN
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));
    serviceDescription.add(new AssignPublicIpExtension());

    const service = new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    test.strictEqual(service.ecsService.node.tryFindChild('TaskRecordManager'), undefined, 'task record manager should not be present');

    test.done();
  },

  'should add a task record manager when dns is requested'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const dnsZone = new route53.PublicHostedZone(stack, 'zone', {
      zoneName: 'myexample.com',
    });

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();

    // WHEN
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));
    serviceDescription.add(new AssignPublicIpExtension({
      dns: {
        zone: dnsZone,
        recordName: 'test-record',
      },
    }));

    const service = new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    test.notEqual(service.ecsService.node.tryFindChild('TaskRecordManager'), undefined, 'task record manager should be present');

    test.done();
  },

  'task record manager listens for ecs events'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const dnsZone = new route53.PublicHostedZone(stack, 'zone', {
      zoneName: 'myexample.com',
    });

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));
    serviceDescription.add(new AssignPublicIpExtension());

    const service = new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // WHEN
    new TaskRecordManager(stack, 'manager', {
      dnsRecordName: 'test-record',
      dnsZone: dnsZone,
      service: service.ecsService,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Events::Rule', {
      EventPattern: {
        'source': ['aws.ecs'],
        'detail-type': [
          'ECS Task State Change',
        ],
        'detail': {
          lastStatus: ['RUNNING'],
          desiredStatus: ['RUNNING'],
        },
      },
    }));

    expect(stack).to(haveResourceLike('AWS::Events::Rule', {
      EventPattern: {
        'source': ['aws.ecs'],
        'detail-type': [
          'ECS Task State Change',
        ],
        'detail': {
          lastStatus: ['STOPPED'],
          desiredStatus: ['STOPPED'],
        },
      },
    }));

    test.done();
  },
}
