import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "correctly sets all genericProxyConfiguration"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: ecs.ProxyConfigurations.genericProxyConfiguration({
      containerName: "web",
      properties: [
        {
          name: "IgnoredUID",
          value: "1337"
        },
        {
          name: "IgnoredGID",
          value: "1338"
        },
        {
          name: "AppPorts",
          value: "80,81"
        },
        {
          name: "ProxyIngressPort",
          value: "80"
        },
        {
          name: "ProxyEgressPort",
          value: "81"
        },
        {
          name: "EgressIgnoredPorts",
          value: "8081"
        },
        {
          name: "EgressIgnoredIPs",
          value: "169.254.170.2,169.254.169.254"
        }
      ],
      type: "APPMESH"
    })});
    taskDefinition.addContainer("web", {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
      ProxyConfiguration: {
        ContainerName: "web",
        ProxyConfigurationProperties: [
          {
            Name: "IgnoredUID",
            Value: "1337"
          },
          {
            Name: "IgnoredGID",
            Value: "1338"
          },
          {
            Name: "AppPorts",
            Value: "80,81"
          },
          {
            Name: "ProxyIngressPort",
            Value: "80"
          },
          {
            Name: "ProxyEgressPort",
            Value: "81"
          },
          {
            Name: "EgressIgnoredPorts",
            Value: "8081"
          },
          {
            Name: "EgressIgnoredIPs",
            Value: "169.254.170.2,169.254.169.254"
          }
        ],
        Type: "APPMESH"
      }
    }));
    test.done();
  },

  "correctly sets genericProxyConfiguration with default properties set"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: ecs.ProxyConfigurations.genericProxyConfiguration({
      containerName: "web",
      properties: [
        {
          name: "IgnoredUID",
          value: "1337"
        },
        {
          name: "AppPorts",
          value: "80,81"
        },
        {
          name: "ProxyIngressPort",
          value: "80"
        },
        {
          name: "ProxyEgressPort",
          value: "81"
        }
      ],
      type: "APPMESH"
    })});
    taskDefinition.addContainer("web", {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
      ProxyConfiguration: {
        ContainerName: "web",
        ProxyConfigurationProperties: [
          {
            Name: "IgnoredUID",
            Value: "1337"
          },
          {
            Name: "AppPorts",
            Value: "80,81"
          },
          {
            Name: "ProxyIngressPort",
            Value: "80"
          },
          {
            Name: "ProxyEgressPort",
            Value: "81"
          }
        ],
        Type: "APPMESH"
      }
    }));
    test.done();
  },

  "correctly sets genericProxyConfiguration with no properties set"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: ecs.ProxyConfigurations.genericProxyConfiguration({
      containerName: "web",
      type: "APPMESH"
    })});
    taskDefinition.addContainer("web", {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
      ProxyConfiguration: {
        ContainerName: "web",
        Type: "APPMESH"
      }
    }));
    test.done();
  }
};