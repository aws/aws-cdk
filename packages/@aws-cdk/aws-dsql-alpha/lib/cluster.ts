import { CfnCluster } from 'aws-cdk-lib/aws-dsql';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { RemovalPolicy, Resource, Tags, ValidationError } from 'aws-cdk-lib/core';
import type { IResource } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';

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
   * @default - true if `removalPolicy` is RETAIN, undefined otherwise.
   */
  readonly deletionProtection?: boolean;
}

/**
 * Represents an Aurora DSQL cluster
 */
export interface ICluster extends IResource {
  /**
   * Identifier of the cluster
   * @attribute Identifier
   */
  readonly clusterIdentifier: string;

  /**
   * Arn of the cluster
   * @attribute ResourceArn
   */
  readonly clusterArn: string;

  /**
   * Connection endpoint for the cluster.
   * @attribute Endpoint
   */
  readonly clusterEndpoint: string;

  /**
   * VPC endpoint service name for the cluster
   * @attribute VpcEndpointServiceName
   */
  readonly vpcEndpointServiceName: string;

  /**
   * Grant the given identity the specified actions
   * @param grantee the identity to be granted the actions
   * @param actions the data-access actions
   *
   * @see https://docs.aws.amazon.com/aurora-dsql/latest/userguide/authentication-authorization.html
   *
   * [disable-awslint:no-grants]
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permission to connect to the database
   *
   * [disable-awslint:no-grants]
   */
  grantConnect(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permission to connect to the database with admin role
   *
   * [disable-awslint:no-grants]
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
   * Connection endpoint for the cluster
   */
  readonly clusterEndpoint: string;

  /**
   * VPC endpoint service name for the cluster
   */
  readonly vpcEndpointServiceName: string;
}

/**
 * A new or imported Aurora DSQL cluster
 */
abstract class ClusterBase extends Resource implements ICluster {
  /**
   * Identifier of the cluster
   */
  public abstract readonly clusterIdentifier: string;

  /**
   * Arn of the cluster
   */
  public abstract readonly clusterArn: string;

  /**
   * Connection endpoint for the cluster
   */
  public abstract readonly clusterEndpoint: string;

  /**
   * VPC endpoint service name for the cluster
   */
  public abstract readonly vpcEndpointServiceName: string;

  // [disable-awslint:no-grants]
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({ grantee, actions, resourceArns: [this.clusterArn] });
  }

  // [disable-awslint:no-grants]
  public grantConnect(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'dsql:DbConnect');
  }

  // [disable-awslint:no-grants]
  public grantConnectAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'dsql:DbConnectAdmin');
  }
}

/**
 * Create an Aurora DSQL cluster
 *
 * @resource AWS::DSQL::Cluster
 */
@propertyInjectable
export class Cluster extends ClusterBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-dsql-alpha.Cluster';

  /**
   * Import an existing Cluster from attributes
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    if (!cdk.Token.isUnresolved(attrs.clusterIdentifier) && !attrs.clusterIdentifier.trim()) {
      throw new ValidationError(lit`ClusterIdentifierRequired`, 'clusterIdentifier cannot be empty', scope as any);
    }

    class Import extends ClusterBase implements ICluster {
      public readonly clusterIdentifier = attrs.clusterIdentifier;
      public readonly clusterEndpoint = attrs.clusterEndpoint;
      public readonly vpcEndpointServiceName = attrs.vpcEndpointServiceName;
      public readonly clusterArn = cdk.Stack.of(this).formatArn({
        service: 'dsql',
        resource: 'cluster',
        resourceName: this.clusterIdentifier,
      });
    }

    return new Import(scope, id);
  }

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
   * Connection endpoint for the cluster
   */
  public readonly clusterEndpoint: string;

  /**
   * VPC endpoint service name for the cluster
   */
  public readonly vpcEndpointServiceName: string;

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
    this.clusterEndpoint = this.cluster.attrEndpoint;
    this.vpcEndpointServiceName = this.cluster.attrVpcEndpointServiceName;

    if (props?.clusterName) {
      Tags.of(this.cluster).add('Name', props.clusterName);
    }

    this.cluster.applyRemovalPolicy(props?.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });
  }
}
