import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "correctly sets all proxyConfiguration"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: new ecs.ProxyConfiguration({
        containerName: "web",
        properties: {
          ignoredUID: 1337,
          ignoredGID: 1338,
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81,
          egressIgnoredPorts: [8081],
          egressIgnoredIPs: ["169.254.170.2", "169.254.169.254"],
        },
        type: "APPMESH"
      })
    });
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

  "correctly sets proxyConfiguration with default properties set"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: new ecs.ProxyConfiguration({
        containerName: "web",
        properties: {
          ignoredUID: 1337,
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81
        }
      })
    });
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

  "correctly sets proxyConfiguration with no properties set"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: new ecs.ProxyConfiguration({
        containerName: "web",
      })
    });
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
  },

  "throws when neither of IgnoredUID and IgnoredGID is set"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', { proxyConfiguration: new ecs.ProxyConfiguration({
        containerName: "web",
        properties: {
          appPorts: [80, 81],
          proxyIngressPort: 80,
          proxyEgressPort: 81
        }
      })});
    }, /Either ignoredUID or ignoredGID should be specified./);

    test.done();
  }
};