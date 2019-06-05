import { expect, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecsPatterns = require('../../lib');

export = {
  'certificate requires an application load balancer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    const cert = new Certificate(stack, 'Cert', { domainName: '*.example.com' });
    const toThrow = () => {
      new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
        cluster,
        certificate: cert,
        loadBalancerType: ecsPatterns.LoadBalancerType.Network,
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
      });
    };

    // THEN
    test.throws(() => toThrow(), /Cannot add certificate to an NLB/);
    test.done();
  },

  'setting loadBalancerType to Network creates an NLB'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network'
    }));

    test.done();
  },

  'setting executionRole updated taskDefinition with given execution role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const executionRole = new iam.Role(stack, 'ExecutionRole', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ecs.amazonaws.com"),
        new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      )
    });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      executionRole
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ExecutionRoleArn, { 'Fn::GetAtt': [ 'ExecutionRole605A040B', 'Arn' ] });
    test.done();
  },

  'setting taskRole updated taskDefinition with given task role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskRole = new iam.Role(stack, 'taskRoleTest', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ecs.amazonaws.com"),
        new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      )
    });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      taskRole
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.TaskRoleArn, { 'Fn::GetAtt': [ 'taskRoleTest9DA66B6E', 'Arn' ] });
    test.done();
  },

  'setting containerName updates container name with given name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      containerName: 'bob'
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'bob');
    test.done();
  },

  'not setting containerName updates container name with default'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'web');
    test.done();
  },

  // 'setting servicename updates service name with given name'(test: Test) {
  //   // GIVEN
  //   const stack = new cdk.Stack();
  //   const vpc = new ec2.Vpc(stack, 'VPC');
  //   const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  //   // WHEN
  //   new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
  //     cluster,
  //     loadBalancerType: ecsPatterns.LoadBalancerType.Network,
  //     image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
  //     serviceName: 'bob'
  //   });

  //   // THEN
  //   const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
  //   console.log(serviceTaskDefinition);
  //   test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'bob');
  //   test.done();
  // },

  // 'not setting servicename updates service name with default'(test: Test) {
  //   // GIVEN
  //   const stack = new cdk.Stack();
  //   const vpc = new ec2.Vpc(stack, 'VPC');
  //   const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  //   // WHEN
  //   new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
  //     cluster,
  //     loadBalancerType: ecsPatterns.LoadBalancerType.Network,
  //     image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
  //   });

  //   // THEN
  //   const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
  //   test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'web');
  //   test.done();
  // }
};