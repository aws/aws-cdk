import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

nodeunitShim({
  'correctly sets all appMeshProxyConfiguration'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
      networkMode: ecs.NetworkMode.AWS_VPC,
      proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
        containerName: 'envoy',
        properties: {
          ignoredUID: 1337,
          ignoredGID: 1338,
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81,
          egressIgnoredPorts: [8081],
          egressIgnoredIPs: ['169.254.170.2', '169.254.169.254'],
        },
      }),
    });
    taskDefinition.addContainer('web', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addContainer('envoy', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ProxyConfiguration: {
        ContainerName: 'envoy',
        ProxyConfigurationProperties: [
          {
            Name: 'IgnoredUID',
            Value: '1337',
          },
          {
            Name: 'IgnoredGID',
            Value: '1338',
          },
          {
            Name: 'AppPorts',
            Value: '80,81',
          },
          {
            Name: 'ProxyIngressPort',
            Value: '80',
          },
          {
            Name: 'ProxyEgressPort',
            Value: '81',
          },
          {
            Name: 'EgressIgnoredPorts',
            Value: '8081',
          },
          {
            Name: 'EgressIgnoredIPs',
            Value: '169.254.170.2,169.254.169.254',
          },
        ],
        Type: 'APPMESH',
      },
    }));
    test.done();
  },

  'correctly sets appMeshProxyConfiguration with default properties set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
      networkMode: ecs.NetworkMode.AWS_VPC,
      proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
        containerName: 'envoy',
        properties: {
          ignoredUID: 1337,
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81,
        },
      }),
    });
    taskDefinition.addContainer('web', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addContainer('envoy', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ProxyConfiguration: {
        ContainerName: 'envoy',
        ProxyConfigurationProperties: [
          {
            Name: 'IgnoredUID',
            Value: '1337',
          },
          {
            Name: 'AppPorts',
            Value: '80,81',
          },
          {
            Name: 'ProxyIngressPort',
            Value: '80',
          },
          {
            Name: 'ProxyEgressPort',
            Value: '81',
          },
        ],
        Type: 'APPMESH',
      },
    }));
    test.done();
  },

  'correctly sets appMeshProxyConfiguration with empty egressIgnoredPorts and egressIgnoredIPs'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
      networkMode: ecs.NetworkMode.AWS_VPC,
      proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
        containerName: 'envoy',
        properties: {
          ignoredUID: 1337,
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81,
          egressIgnoredIPs: [],
          egressIgnoredPorts: [],
        },
      }),
    });
    taskDefinition.addContainer('web', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addContainer('envoy', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ProxyConfiguration: {
        ContainerName: 'envoy',
        ProxyConfigurationProperties: [
          {
            Name: 'IgnoredUID',
            Value: '1337',
          },
          {
            Name: 'AppPorts',
            Value: '80,81',
          },
          {
            Name: 'ProxyIngressPort',
            Value: '80',
          },
          {
            Name: 'ProxyEgressPort',
            Value: '81',
          },
        ],
        Type: 'APPMESH',
      },
    }));
    test.done();
  },

  'throws when neither of IgnoredUID and IgnoredGID is set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
        proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
          containerName: 'envoy',
          properties: {
            appPorts: [80, 81],
            proxyIngressPort: 80,
            proxyEgressPort: 81,
          },
        }),
      });
    }, /At least one of ignoredUID or ignoredGID should be specified./);

    test.done();
  },
});
