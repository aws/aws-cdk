import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from '../ecs.generated';

/**
 * Basic cluster properties
 */
export interface BaseClusterProps {
  /**
   * A name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  clusterName?: string;

  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  vpc: ec2.VpcNetworkRef;
}

/**
 * Base class for Ecs and Fargate clusters
 */
export abstract class BaseCluster extends cdk.Construct {
  /**
   * The VPC this cluster was created in.
   */
  public readonly vpc: ec2.VpcNetworkRef;

  /**
   * The ARN of this cluster
   */
  public readonly clusterArn: string;

  /**
   * The name of this cluster
   */
  public readonly clusterName: string;

  constructor(parent: cdk.Construct, name: string, props: BaseClusterProps) {
    super(parent, name);

    const cluster = new cloudformation.ClusterResource(this, 'Resource', {clusterName: props.clusterName});

    this.vpc = props.vpc;
    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.ref;
  }

  /**
   * Return the given named metric for this Cluster
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ECS',
      metricName,
      dimensions: { ClusterName: this.clusterName },
      ...props
    });
  }
}