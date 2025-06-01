import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Aws, IResource, RemovalPolicy, Resource, Tags } from 'aws-cdk-lib/core';
import { CfnCluster } from 'aws-cdk-lib/aws-dsql';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Properties for a new Aurora DSQL cluster
 */
export interface ClusterProps {
  /**
   * The name of the DSQL cluster.
   * This is applied via the `Name` tag.
   *
   * @default - No name specified.
   */
  readonly clusterName?: string;

  /**
   * The removal policy to apply when the cluster is removed or
   * replaced during a stack update, or when the stack is deleted.
   *
   * @default - Retain cluster.
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Specifies whether this cluster can be deleted. If deletionProtection is
   * enabled, the cluster cannot be deleted unless it is modified and
   * deletionProtection is disabled. deletionProtection protects clusters from
   * being accidentally deleted.
   *
   * @default - true if `removalPolicy` is RETAIN, false otherwise.
   */
  readonly deletionProtection?: boolean;
}

/**
 * Create an Aurora DSQL cluster
 */
export interface ICluster extends IResource {
  /**
   * Identifier of the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * Arn of the cluster
   */
  readonly clusterArn: string;

  /**
   * The VPC endpoint service name for the cluster
   */
  readonly vpcEndpointServiceName: string;

  /**
   * Name of the cluster
   */
  readonly clusterName?: string;

  /**
   * Grant the given identity the specified actions
   * @param grantee the identity to be granted the actions
   * @param actions the data-access actions
   *
   * @see https://docs.aws.amazon.com/aurora-dsql/latest/userguide/authentication-authorization.html
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permission to connect to the database
   */
  grantConnect(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permission to connect to the database with admin role
   */
  grantConnectAdmin(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Properties that describe an existing Aurora DSQL cluster
 */
export interface ClusterAttributes {
  /**
   * Identifier of the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * The VPC endpoint service name for the cluster
   */
  readonly vpcEndpointServiceName: string;

  /**
   * Name of the cluster
   */
  readonly clusterName?: string;
}

/**
 * A new or imported Aurora DSQL cluster
 */
export abstract class ClusterBase extends Resource implements ICluster {
  /**
   * Import an existing Cluster from attributes
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    class Import extends ClusterBase implements ICluster {
      public readonly clusterIdentifier = attrs.clusterIdentifier;
      public readonly vpcEndpointServiceName = attrs.vpcEndpointServiceName;
      public readonly clusterArn = cdk.Stack.of(this).formatArn({
        service: 'dsql',
        resource: 'cluster',
        resourceName: this.clusterIdentifier,
      });
      public readonly clusterName? = attrs.clusterName || undefined;
    }

    return new Import(scope, id);
  }

  /**
   * Identifier of the cluster
   */
  public abstract readonly clusterIdentifier: string;

  /**
   * Arn of the cluster
   */
  public abstract readonly clusterArn: string;

  /**
   * The VPC endpoint service name for the cluster
   */
  public abstract readonly vpcEndpointServiceName: string;

  /**
   * Name of the cluster
   */
  public abstract readonly clusterName?: string;

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [
        [
          'arn',
          Aws.PARTITION,
          'dsql',
          Aws.REGION,
          Aws.ACCOUNT_ID,
          `cluster/${this.clusterIdentifier}`,
        ].join(':'),
      ],
    });
  }

  public grantConnect(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'dsql:DbConnect');
  }

  public grantConnectAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'dsql:DbConnectAdmin');
  }
}

/**
 * Create an Aurora DSQL cluster
 *
 * @resource AWS::DSQL::Cluster
 */
export class Cluster extends ClusterBase {
  private readonly cluster: CfnCluster;

  /**
   * Identifier of the cluster
   */
  public readonly clusterIdentifier: string;

  /**
   * Arn of the cluster
   */
  public readonly clusterArn: string;

  /**
   * The VPC endpoint service name for the cluster
   */
  public readonly vpcEndpointServiceName: string;

  /**
   * Name of the cluster
   */
  public readonly clusterName?: string;

  constructor(scope: Construct, id: string, props?: ClusterProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const deletionProtection = props?.deletionProtection ?? (props?.removalPolicy === RemovalPolicy.RETAIN ? true : undefined);

    this.cluster = new CfnCluster(this, 'Resource', {
      deletionProtectionEnabled: deletionProtection,
    });

    this.clusterIdentifier = this.cluster.ref;
    this.clusterArn = this.cluster.attrResourceArn;
    this.vpcEndpointServiceName = this.cluster.attrVpcEndpointServiceName;

    if (props?.clusterName) {
      this.clusterName = props.clusterName;
      Tags.of(this.cluster).add('Name', props.clusterName);
    }

    this.cluster.applyRemovalPolicy(props?.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });
  }
}
