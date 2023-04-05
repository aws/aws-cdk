import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as eks from '../lib';

class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const cluster = new eks.Cluster(this, 'EKSCluster', {
      vpc,
      version: eks.KubernetesVersion.V1_21,
    });

    /// !show
    const asg = cluster.addAutoScalingGroupCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      keyName: 'my-key-name',
    });

    // Replace with desired IP
    asg.connections.allowFrom(ec2.Peer.ipv4('1.2.3.4/32'), ec2.Port.tcp(22));
    /// !hide
  }
}

const app = new cdk.App();

new EksClusterStack(app, 'eks-integ-test');

app.synth();
