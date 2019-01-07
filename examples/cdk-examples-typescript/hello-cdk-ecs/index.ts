import ec2 = require('@aws-cdk/aws-ec2');
import { InstanceType } from '@aws-cdk/aws-ec2';
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');

class BonjourECS extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // For better iteration speed, it might make sense to put this VPC into
    // a separate stack and import it here. We then have two stacks to
    // deploy, but VPC creation is slow so we'll only have to do that once
    // and can iterate quickly on consuming stacks. Not doing that for now.
    const vpc = new ec2.VpcNetwork(this, 'MyVpc', { maxAZs: 2 });
    const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });
    cluster.addDefaultAutoScalingGroupCapacity({
      instanceType: new InstanceType("t2.xlarge"),
      instanceCount: 3,
    });

    // Instantiate ECS Service with just cluster and image
    const ecsService = new ecs.LoadBalancedEc2Service(this, "Ec2Service", {
      cluster,
      memoryLimitMiB: 512,
      image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
    });

    // ecsService.addTracing

    // Output the DNS where you can access your service
    new cdk.Output(this, 'LoadBalancerDNS', { value: ecsService.loadBalancer.dnsName });
  }
}

const app = new cdk.App();

new BonjourECS(app, 'Bonjour');

app.run();
