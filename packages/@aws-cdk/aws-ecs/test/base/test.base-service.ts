import * as cdk from '@aws-cdk/core';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

export = {
  'When associating with service registry': {
    'By default, container name and port are undefined'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.TaskDefinition(stack, 'Task', {
        compatibility: ecs.Compatibility.EC2,
      });

      taskDefinition.addContainer('main', {
        image: ecs.ContainerImage.fromRegistry('some'),
      }).addPortMappings({ containerPort: 1234 });

      taskDefinition.addContainer('second', {
        image: ecs.ContainerImage.fromRegistry('some'),
      }).addPortMappings({ containerPort: 4321 });

      // WHEN
      const { containerName, containerPort } = ecs.determineContainerNameAndPort({
        dnsRecordType: cloudmap.DnsRecordType.A,
        taskDefinition,
      });

      // THEN
      test.strictEqual(containerName, undefined);
      test.strictEqual(containerPort, undefined);
      test.done();
    },

    'For SRV, by default, container name is default container and port is the default container port'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.TaskDefinition(stack, 'Task', {
        compatibility: ecs.Compatibility.EC2,
      });

      taskDefinition.addContainer('main', {
        image: ecs.ContainerImage.fromRegistry('some'),
      }).addPortMappings({ containerPort: 1234 });

      taskDefinition.addContainer('second', {
        image: ecs.ContainerImage.fromRegistry('some'),
      }).addPortMappings({ containerPort: 4321 });

      // WHEN
      const { containerName, containerPort } = ecs.determineContainerNameAndPort({
        dnsRecordType: cloudmap.DnsRecordType.SRV,
        taskDefinition,
      });

      // THEN
      test.equal(containerName, 'main');
      test.equal(containerPort, 1234);
      test.done();
    },

    'allows SRV service discovery to select the container and port'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.TaskDefinition(stack, 'Task', {
        compatibility: ecs.Compatibility.EC2,
      });

      taskDefinition.addContainer('main', {
        image: ecs.ContainerImage.fromRegistry('some'),
      }).addPortMappings({ containerPort: 1234 });

      const secondContainer = taskDefinition.addContainer('second', {
        image: ecs.ContainerImage.fromRegistry('some'),
      });
      secondContainer.addPortMappings({ containerPort: 4321 });

      // WHEN
      const { containerName, containerPort } = ecs.determineContainerNameAndPort({
        dnsRecordType: cloudmap.DnsRecordType.SRV,
        taskDefinition,
        container: secondContainer,
        containerPort: 4321,
      });

      // THEN
      test.equal(containerName, 'second');
      test.equal(containerPort, 4321);
      test.done();
    },

    'throws if SRV and container is not part of task definition'(test: Test) {
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      // The right container
      taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });

      const wrongTaskDefinition = new ecs.FargateTaskDefinition(stack, 'WrongFargateTaskDef');
      // The wrong container
      const wrongContainer = wrongTaskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });

      test.throws(() => {
        ecs.determineContainerNameAndPort({
          dnsRecordType: cloudmap.DnsRecordType.SRV,
          taskDefinition,
          container: wrongContainer,
          containerPort: 4321,
        });
      }, /another task definition/i);
      test.done();
    },

    'throws if SRV and the container port is not mapped'(test: Test) {
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512,
      });

      container.addPortMappings({ containerPort: 8000 });

      test.throws(() => {
        ecs.determineContainerNameAndPort({
          dnsRecordType: cloudmap.DnsRecordType.SRV,
          taskDefinition,
          container: container,
          containerPort: 4321,
        });
      }, /container port.*not.*mapped/i);
      test.done();
    },
  },
};
