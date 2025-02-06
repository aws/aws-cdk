import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Fn, Lazy, Names } from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { ClusterBase, ICluster } from '.';
import { CfnServerlessCluster } from 'aws-cdk-lib/aws-msk';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 *  Properties for a MSK Serverless Cluster
 */
export interface ServerlessClusterProps {
  /**
   * The physical name of the cluster.
   *
   * @default - auto generate
   */
  readonly clusterName?: string;

  /**
   * The configuration of the Amazon VPCs for the cluster.
   * You can specify up to 5 VPC configurations.
   */
  readonly vpcConfigs: VpcConfig[];
}

/**
 * The configuration of the Amazon VPCs for the cluster.
 */
export interface VpcConfig {
  /**
   * Defines the virtual networking environment for this cluster.
   * Must have at least 2 subnets in two different AZs.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The subnets associated with the cluster.
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups associated with the cluster.
   * You can specify up to 5 security groups.
   *
   * @default - create new security group
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * Create a MSK Serverless Cluster.
 *
 * @resource AWS::MSK::ServerlessCluster
 */
export class ServerlessCluster extends ClusterBase {
  /**
   * Reference an existing cluster, defined outside of the CDK code, by name.
   */
  public static fromClusterArn(
    scope: constructs.Construct,
    id: string,
    clusterArn: string,
  ): ICluster {
    class Import extends ClusterBase {
      public readonly clusterArn = clusterArn;
      public readonly clusterName = Fn.select(1, Fn.split('/', clusterArn)); // ['arn:partition:kafka:region:account-id', clusterName, clusterId]
    }

    return new Import(scope, id);
  }

  public readonly clusterArn: string;
  public readonly clusterName: string;

  private _securityGroups: ec2.ISecurityGroup[] = [];

  constructor(scope: constructs.Construct, id: string, props: ServerlessClusterProps) {
    super(scope, id, {
      physicalName: props.clusterName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 64 }),
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.vpcConfigs.length < 1 || props.vpcConfigs.length > 5) {
      throw Error(`\`vpcConfigs\` must contain between 1 and 5 configurations, got ${props.vpcConfigs.length} configurations.`);
    }

    const vpcConfigs = props.vpcConfigs.map((vpcConfig, index) => this._renderVpcConfig(vpcConfig, index));

    this._connections = new ec2.Connections({
      securityGroups: this._securityGroups,
    });

    /**
     * TODO At the time of implementation, MSK Serverless only supports IAM authentication, so it cannot be disabled.
     * If it becomes configurable in the future, the property will need to be exposed.
     *
     * @see https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html
     */
    const resource = new CfnServerlessCluster(this, 'Resource', {
      clusterName: this.physicalName,
      clientAuthentication: {
        sasl: {
          iam: {
            enabled: true,
          },
        },
      },
      vpcConfigs,
    });

    this.clusterName = this.getResourceNameAttribute(
      Fn.select(1, Fn.split('/', resource.ref)),
    );
    this.clusterArn = resource.ref;
  }

  /**
   * Render Vpc Config property
   */
  private _renderVpcConfig(vpcConfig: VpcConfig, index: number): CfnServerlessCluster.VpcConfigProperty {
    const subnetSelection = vpcConfig.vpc.selectSubnets(vpcConfig.vpcSubnets);

    if (subnetSelection.subnets.length < 2) {
      throw Error(
        `Cluster requires at least 2 subnets, got ${subnetSelection.subnets.length} subnet.`,
      );
    }

    let securityGroups: ec2.ISecurityGroup[] = [];

    if (vpcConfig.securityGroups) {
      if (vpcConfig.securityGroups.length < 1 || vpcConfig.securityGroups.length > 5) {
        throw Error(`\`securityGroups\` must contain between 1 and 5 elements, got ${vpcConfig.securityGroups.length} elements.`);
      }
      securityGroups = vpcConfig.securityGroups;
    } else {
      securityGroups.push(new ec2.SecurityGroup(this, `SecurityGroup-${index}`, {
        description: 'MSK Serverless security group',
        vpc: vpcConfig.vpc,
      }));
    }

    this._securityGroups.push(...securityGroups);

    return {
      subnetIds: subnetSelection.subnets.map((subnet) => subnet.subnetId),
      securityGroups: securityGroups?.map((securityGroup) => securityGroup.securityGroupId),
    };
  }
}
