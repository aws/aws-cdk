import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

/**
 * An EKS cluster
 */
export interface ICluster extends cdk.IConstruct, ec2.IConnectable {
  /**
   * The VPC in which this Cluster was created
   */
  readonly vpc: ec2.IVpcNetwork;

  /**
   * The physical name of the Cluster
   */
  readonly clusterName: string;

  /**
   * The unique ARN assigned to the service by AWS
   * in the form of arn:aws:eks:
   */
  readonly clusterArn: string;

  /**
   * The API Server endpoint URL
   */
  readonly clusterEndpoint: string;

  /**
   * The certificate-authority-data for your cluster.
   */
  readonly clusterCertificateAuthorityData: string;

  /**
   * Export cluster references to use in other stacks
   */
  export(): ClusterImportProps;
}

/**
 * A SecurityGroup Reference, object not created with this template.
 */
export abstract class ClusterBase extends cdk.Construct implements ICluster {
  public abstract readonly connections: ec2.Connections;
  public abstract readonly vpc: ec2.IVpcNetwork;
  public abstract readonly clusterName: string;
  public abstract readonly clusterArn: string;
  public abstract readonly clusterEndpoint: string;
  public abstract readonly clusterCertificateAuthorityData: string;

  /**
   * Export cluster references to use in other stacks
   */
  public export(): ClusterImportProps {
    return {
      vpc: this.vpc.export(),
      clusterName: this.makeOutput('ClusterNameExport', this.clusterName),
      clusterArn: this.makeOutput('ClusterArn', this.clusterArn),
      clusterEndpoint: this.makeOutput('ClusterEndpoint', this.clusterEndpoint),
      clusterCertificateAuthorityData: this.makeOutput('ClusterCAData', this.clusterCertificateAuthorityData),
      securityGroups: this.connections.securityGroups.map(sg => sg.export()),
    };
  }

  private makeOutput(name: string, value: any): string {
    return new cdk.CfnOutput(this, name, { value }).makeImportValue().toString();
  }
}

export interface ClusterImportProps {
  /**
   * The VPC in which this Cluster was created
   */
  readonly vpc: ec2.VpcNetworkImportProps;

  /**
   * The physical name of the Cluster
   */
  readonly clusterName: string;

  /**
   * The unique ARN assigned to the service by AWS
   * in the form of arn:aws:eks:
   */
  readonly clusterArn: string;

  /**
   * The API Server endpoint URL
   */
  readonly clusterEndpoint: string;

  /**
   * The certificate-authority-data for your cluster.
   */
  readonly clusterCertificateAuthorityData: string;

  readonly securityGroups: ec2.SecurityGroupImportProps[];
}
