import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

nodeunitShim({
  'A task definition with both compatibilities defaults to networkmode AwsVpc'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecs.TaskDefinition(stack, 'TD', {
      cpu: '512',
      memoryMiB: '512',
      compatibility: ecs.Compatibility.EC2_AND_FARGATE,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      NetworkMode: 'awsvpc',
    }));

    test.done();
  },

  'allows proxy configuration to be set by a task definition extension'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });

    const mainContainer = taskDefinition.addContainer('main', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
    });
    mainContainer.addPortMappings({ containerPort: 80 });

    // WHEN
    taskDefinition.addExtension(new FauxAppMeshExtension('envoy'));

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ProxyConfiguration: {
        Type: 'APPMESH',
        ContainerName: 'envoy',
      },
    }));

    test.done();
  },

  'throws when proxy configuration is already set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const taskDefinition = new ecs.TaskDefinition(stack, 'TD', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
      proxyConfiguration: new ecs.AppMeshProxyConfiguration({
        containerName: 'envoy',
        properties: {
          appPorts: [80],
          proxyIngressPort: 10050,
          proxyEgressPort: 10051,
          ignoredUID: 1337,
        },
      }),
    });

    const mainContainer = taskDefinition.addContainer('main', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
    });
    mainContainer.addPortMappings({ containerPort: 80 });

    // WHEN / THEN
    test.throws(() => {
      taskDefinition.addExtension(new FauxAppMeshExtension('envoy'));
    }, /already present/);

    test.done();
  },
});

/**
 * A faux app mesh extension that registers a sidecar and configures task
 * proxying.
 */
class FauxAppMeshExtension implements ecs.ITaskDefinitionExtension {
  constructor(private readonly containerName: string) {}

  extend(td: ecs.TaskDefinition) {
    const envoyContainer = td.addContainer(this.containerName, {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/appmesh/aws-appmesh-envoy:v1.16.1.0-prod'),
      user: '1337',
      environment: {
        APPMESH_RESOURCE_ARN: 'arn:aws:appmesh:1234:mesh/meshName/virtualNode/fakeNodeName',
      },
    });

    const proxyConfiguration = new ecs.AppMeshProxyConfiguration({
      containerName: envoyContainer.containerName,
      properties: {
        appPorts: [80],
        proxyIngressPort: 10050,
        proxyEgressPort: 10051,
        ignoredUID: 1337,
      },
    });

    td.useProxyConfiguration(proxyConfiguration);
  }
}