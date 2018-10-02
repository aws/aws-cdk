import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from '../ecs.generated';

export interface BaseClusterProps {
  /**
   * A name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  clusterName?: string;

  /**
   * The VPC where your ECS instances will be running
   */
  vpc: ec2.VpcNetworkRef;
}

export class BaseCluster extends cdk.Construct {
  /**
   * The VPC this cluster was created in
   */
  public readonly vpc: ec2.VpcNetworkRef;

  public readonly clusterArn: string;

  public readonly clusterName: string;

  constructor(parent: cdk.Construct, name: string, props: BaseClusterProps) {
    super(parent, name);

    const cluster = new cloudformation.ClusterResource(this, 'Resource', {clusterName: props.clusterName});

    this.vpc = props.vpc;
    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.ref;
  }
}
