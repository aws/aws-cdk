import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { App, NestedStack, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import {
  Container,
  Environment,
  EnvironmentCapacityType,
  HttpLoadBalancerExtension,
  Service,
  ServiceDescription,
} from '../lib';

class ResourceStack extends NestedStack {
  public readonly clusterName: string;
  public readonly vpcId: string;
  public readonly publicSubnetIds: string[];
  public readonly privateSubnetIds: string[];

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const environment = new Environment(this, 'Environment');

    this.clusterName = environment.cluster.clusterName;
    this.vpcId = environment.vpc.vpcId;
    this.privateSubnetIds = environment.vpc.privateSubnets.map(m => m.subnetId);
    this.publicSubnetIds = environment.vpc.publicSubnets.map(m => m.subnetId);
  }
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // Create a nested stack with the shared resources
    const resourceStack = new ResourceStack(this, 'Resources');

    // Import the vpc from the nested stack
    const vpc = Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: resourceStack.availabilityZones,
      vpcId: resourceStack.vpcId,
      privateSubnetIds: resourceStack.privateSubnetIds,
      publicSubnetIds: resourceStack.publicSubnetIds,
    });

    // Import the cluster from the nested stack
    const cluster = Cluster.fromClusterAttributes(this, 'Cluster', {
      clusterName: resourceStack.clusterName,
      securityGroups: [],
      vpc: vpc,
    });

    // Create the environment from attributes.
    const environment = Environment.fromEnvironmentAttributes(this, 'Environment', {
      cluster,
      capacityType: EnvironmentCapacityType.FARGATE,
    });

    // Add a workload.
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));
    serviceDescription.add(new HttpLoadBalancerExtension());

    new Service(this, 'Service', {
      environment,
      serviceDescription,
    });
  }
}

const app = new App();
new TestStack(app, 'imported-environment-integ');

/**
 * Expect this stack to deploy and show a load balancer DNS address. When you
 * request the address with curl, you should see the name container's output.
 * The load balancer may response 503 Service Temporarily Unavailable for a
 * short while, before you can see the container output.
 *
 * Example:
 * ```
 * $ cdk --app 'node integ.imported-environment.js' deploy
 * ...
 * Outputs:
 * shared-cluster-integ.Serviceloadbalancerdnsoutput = share-Servi-6JALU1FDE36L-2093347098.us-east-1.elb.amazonaws.com
 * ...
 *
 * $ curl share-Servi-6JALU1FDE36L-2093347098.us-east-1.elb.amazonaws.com
 * Keira (ip-10-0-153-44.ec2.internal)
 * ```
 */
