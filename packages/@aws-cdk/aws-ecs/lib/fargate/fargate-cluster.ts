import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseCluster, BaseClusterProps } from '../base/base-cluster';

/**
 * Properties to define a Fargate cluster
 */
// tslint:disable-next-line:no-empty-interface
export interface FargateClusterProps extends BaseClusterProps {
}

/**
 * Define a cluster to run tasks on managed instances
 */
export class FargateCluster extends BaseCluster implements IFargateCluster {
  /**
   * Import an existing Fargate cluster
   */
  public static import(parent: cdk.Construct, name: string, props: ImportedFargateClusterProps): IFargateCluster {
    return new ImportedFargateCluster(parent, name, props);
  }

  constructor(parent: cdk.Construct, name: string, props: FargateClusterProps) {
    super(parent, name, props);
  }

  /**
   * Export the FargateCluster
   */
  public export(): ImportedFargateClusterProps {
    return {
      clusterName: new cdk.Output(this, 'ClusterName', { value: this.clusterName }).makeImportValue().toString(),
      vpc: this.vpc.export(),
    };
  }
}

/**
 * A Fargate cluster
 */
export interface IFargateCluster {
  /**
   * Name of the cluster
   */
  readonly clusterName: string;

  /**
   * VPC where Task ENIs will be placed
   */
  readonly vpc: ec2.VpcNetworkRef;
}

/**
 * Properties to import a Fargate cluster
 */
export interface ImportedFargateClusterProps {
  /**
   * Name of the cluster
   */
  clusterName: string;

  /**
   * VPC where Task ENIs should be placed
   */
  vpc: ec2.VpcNetworkRefProps;
}

/**
 * A FargateCluster that has been imported
 */
class ImportedFargateCluster extends cdk.Construct implements IFargateCluster {
  /**
   * Name of the cluster
   */
  public readonly clusterName: string;

  /**
   * VPC where ENIs will be placed
   */
  public readonly vpc: ec2.VpcNetworkRef;

  constructor(parent: cdk.Construct, name: string, props: ImportedFargateClusterProps) {
    super(parent, name);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetworkRef.import(this, "vpc", props.vpc);
  }
}