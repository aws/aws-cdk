import * as cdk from '@aws-cdk/core';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as ecs from '../../lib';

describe('When associating with service registry', () => {
  test('By default, container name and port are undefined', () => {
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
    expect(containerName).toBeUndefined();
    expect(containerPort).toBeUndefined();
  });

  test('For SRV, by default, container name is default container and port is the default container port', () => {
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
    expect(containerName).toEqual('main');
    expect(containerPort).toEqual(1234);
  });

  test('allows SRV service discovery to select the container and port', () => {
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
    expect(containerName).toEqual('second');
    expect(containerPort).toEqual(4321);
  });

  test('throws if SRV and container is not part of task definition', () => {
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

    expect(() => {
      ecs.determineContainerNameAndPort({
        dnsRecordType: cloudmap.DnsRecordType.SRV,
        taskDefinition,
        container: wrongContainer,
        containerPort: 4321,
      });
    }).toThrow(/another task definition/i);
  });

  test('throws if SRV and the container port is not mapped', () => {
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
      memoryLimitMiB: 512,
    });

    container.addPortMappings({ containerPort: 8000 });

    expect(() => {
      ecs.determineContainerNameAndPort({
        dnsRecordType: cloudmap.DnsRecordType.SRV,
        taskDefinition,
        container: container,
        containerPort: 4321,
      });
    }).toThrow(/container port.*not.*mapped/i);
  });
});
