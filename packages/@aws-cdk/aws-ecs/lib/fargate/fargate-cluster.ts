import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseCluster, BaseClusterProps } from '../base/base-cluster';

// tslint:disable-next-line:no-empty-interface
export interface FargateClusterProps extends BaseClusterProps {
}

export class FargateCluster extends BaseCluster implements IFargateCluster {
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

export interface IFargateCluster {
  clusterName: string;
  vpc: ec2.VpcNetworkRef;
}

export interface ImportedFargateClusterProps {
  readonly clusterName: string;
  readonly vpc: ec2.VpcNetworkRefProps;
}

// /**
//  * A FargateCluster that has been imported
//  */
class ImportedFargateCluster extends cdk.Construct implements IFargateCluster {
  public readonly clusterName: string;
  public readonly vpc: ec2.VpcNetworkRef;

  constructor(parent: cdk.Construct, name: string, props: ImportedFargateClusterProps) {
    super(parent, name);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetworkRef.import(this, "vpc", props.vpc);
  }
}