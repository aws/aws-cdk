import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '../../lib';
import { CapacityProvider } from '../../lib/capacity-provider';
 

const app = new cdk.App();

const env = {
  region:  process.env.CDK_DEFAULT_REGION,
  account:  process.env.CDK_DEFAULT_ACCOUNT
};

const stack = new cdk.Stack(app, 'integ-capacity-provider', { env })

// const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1})
const vpc = getOrCreateVpc(stack)

const asg = new AutoScalingGroup(stack, 'ASG', {
  vpc,
  machineImage: new ec2.AmazonLinuxImage(),
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 5,
  minCapacity: 1,
})

const cp = new CapacityProvider (stack, 'CP', {
  autoscalingGroup: asg,
})

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc
})

const cfnCluster = cluster.node.findChild('Resource') as ecs.CfnCluster
cfnCluster.addPropertyOverride('CapacityProviders', [ cp.capacityProviderName ] )
// cfnCluster.addPropertyOverride('DefaultCapacityProviderStrategy', [
//     {
//       Base: 2,
//       CapacityProvider: cp.capacityProviderName,
//     }
//   ]
// )

new cdk.CfnOutput(stack, 'CapacityProviderName', { value: cp.capacityProviderName })


function getOrCreateVpc(stack: cdk.Stack): ec2.IVpc {
  // use an existing vpc or create a new one
  return stack.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true }) :
    stack.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(stack, 'Vpc', { vpcId: stack.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });        
}