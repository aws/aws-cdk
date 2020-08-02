import { URL } from 'url';

import { Metric, MetricOptions, Statistic } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';

import { CfnDomain } from './elasticsearch.generated';
import { LogGroupResourcePolicy } from './log-group-resource-policy';
import * as perms from './perms';

/**
 * Supported Elasticsearch Versions
 */
export class Version {
  /** AWS Elasticsearch 1.5 */
  public static readonly ES_1_5 = '1.5';

  /** AWS Elasticsearch 2.3 */
  public static readonly ES_2_3 = '2.3';

  /** AWS Elasticsearch 5.1 */
  public static readonly ES_5_1 = '5.1';

  /** AWS Elasticsearch 5.3 */
  public static readonly ES_5_3 = '5.3';

  /** AWS Elasticsearch 5.5 */
  public static readonly ES_5_5 = '5.5';

  /** AWS Elasticsearch 5.6 */
  public static readonly ES_5_6 = '5.6';

  /** AWS Elasticsearch 6.0 */
  public static readonly ES_6_0 = '6.0';

  /** AWS Elasticsearch 6.2 */
  public static readonly ES_6_2 = '6.2';

  /** AWS Elasticsearch 6.3 */
  public static readonly ES_6_3 = '6.3';

  /** AWS Elasticsearch 6.4 */
  public static readonly ES_6_4 = '6.4';

  /** AWS Elasticsearch 6.5 */
  public static readonly ES_6_5 = '6.5';

  /** AWS Elasticsearch 6.7 */
  public static readonly ES_6_7 = '6.7';

  /** AWS Elasticsearch 6.8 */
  public static readonly ES_6_8 = '6.8';

  /** AWS Elasticsearch 7.1 */
  public static readonly ES_7_1 = '7.1';

  /** AWS Elasticsearch 7.4 */
  public static readonly ES_7_4 = '7.4';
}

/**
 * Configures the makeup of the cluster such as number of nodes and instance
 * type.
 */
export interface ClusterConfig {
  /**
   * The number of instances to use for the master node
   */
  readonly masterNodes: number;

  /**
   * The hardware configuration of the computer that hosts the dedicated master
   * node, such as `m3.medium.elasticsearch`. For valid values, see [Supported
   * Instance Types]
   * (https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/aes-supported-instance-types.html)
   * in the Amazon Elasticsearch Service Developer Guide.
   */
  readonly masterNodeInstanceType: string;

  /**
   * The number of data nodes to use in the Amazon ES domain.
   */
  readonly dataNodes: number;

  /**
   * The instance type for your data nodes, such as
   * `m3.medium.elasticsearch`. For valid values, see [Supported Instance
   * Types](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/aes-supported-instance-types.html)
   * in the Amazon Elasticsearch Service Developer Guide.
   */
  readonly dataNodeInstanceType: string;

  /**
   * The number of AZs that you want the domain to use. When you enable zone
   * awareness, Amazon ES allocates the nodes and replica index shards that
   * belong to a cluster across the specified number of Availability Zones (AZs)
   * in the same region to prevent data loss and minimize downtime in the event
   * of node or data center failure. Don't enable zone awareness if your cluster
   * has no replica index shards or is a single-node cluster.
   *
   * @default - Zone awareness is not enabled.
   */
  readonly availabilityZoneCount?: number;
}

/**
 * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that
 * are attached to data nodes in the Amazon ES domain. For more information, see
 * [Configuring EBS-based Storage]
 * (https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html#es-createdomain-configure-ebs)
 * in the Amazon Elasticsearch Service Developer Guide.
 */
export interface EbsOptions {
  /**
   * The number of I/O operations per second (IOPS) that the volume
   * supports. This property applies only to the Provisioned IOPS (SSD) EBS
   * volume type.
   *
   * @default - iops are not set.
   */
  readonly iops?: number;

  /**
   * The size (in GiB) of the EBS volume for each data node. The minimum and
   * maximum size of an EBS volume depends on the EBS volume type and the
   * instance type to which it is attached.  For more information, see
   * [Configuring EBS-based Storage]
   * (https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html#es-createdomain-configure-ebs)
   * in the Amazon Elasticsearch Service Developer Guide
   */
  readonly volumeSize: number;

  /**
   * The EBS volume type to use with the Amazon ES domain, such as standard, gp2, io1, st1, or sc1.
   * For more information, see[Configuring EBS-based Storage]
   * (https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html#es-createdomain-configure-ebs)
   * in the Amazon Elasticsearch Service Developer Guide
   */
  readonly volumeType: ec2.EbsDeviceVolumeType;
}

/**
 * Configures log settings for the domain.
 */
export interface LoggingOptions {
  /**
   * Specify if slow search logging should be set up.
   * Requires Elasticsearch version 5.1 or later.
   *
   * @default - false
   */
  readonly slowSearchLogEnabled?: boolean;

  /**
   * Log slow searches to this log group.
   *
   * @default - a new log group is created if slow search logging is enabled
   */
  readonly slowSearchLogGroup?: logs.ILogGroup;

  /**
   * Specify if slow index logging should be set up.
   * Requires Elasticsearch version 5.1 or later.
   *
   * @default - false
   */
  readonly slowIndexLogEnabled?: boolean;

  /**
   * Log slow indices to this log group.
   *
   * @default - a new log group is created if slow index logging is enabled
   */
  readonly slowIndexLogGroup?: logs.ILogGroup;

  /**
   * Specify if Elasticsearch application logging should be set up.
   * Requires Elasticsearch version 5.1 or later.
   *
   * @default - false
   */
  readonly appLogEnabled?: boolean;

  /**
   * Log Elasticsearch application logs to this log group.
   *
   * @default - a new log group is created if app logging is enabled
   */
  readonly appLogGroup?: logs.ILogGroup;
}

/**
 * Whether the domain should encrypt data at rest, and if so, the AWS Key
 * Management Service (KMS) key to use. Can only be used to create a new domain,
 * not update an existing one. Requires Elasticsearch version 5.1 or later.
 */
export interface EncryptionAtRestOptions {
  /**
   * Specify true to enable encryption at rest.
   *
   * @default - encryption at rest is disabled.
   */
  readonly enabled?: boolean;

  /**
   * Supply if using KMS key for encryption at rest.
   *
   * @default - uses default aws/es KMS key.
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * Configures Amazon ES to use Amazon Cognito authentication for Kibana.
 */
export interface CognitoOptions {
  /**
   * The Amazon Cognito identity pool ID that you want Amazon ES to use for Kibana authentication.
   */
  readonly identityPoolId: string;

  /**
   * The AmazonESCognitoAccess role that allows Amazon ES to configure your user pool and identity pool.
   */
  readonly role: iam.IRole;

  /**
   * The Amazon Cognito user pool ID that you want Amazon ES to use for Kibana authentication.
   */
  readonly userPoolId: string;
}

/**
 * The virtual private cloud (VPC) configuration for the Amazon ES domain. For
 * more information, see [VPC Support for Amazon Elasticsearch Service
 * Domains](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-vpc.html)
 * in the Amazon Elasticsearch Service Developer Guide.
 */
export interface VpcOptions {
  /**
   * The list of security groups that are associated with the VPC endpoints
   * for the domain. If you don't provide a security group ID, Amazon ES uses
   * the default security group for the VPC. To learn more, see [Security Groups for your VPC]
   * (https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the Amazon VPC
   * User Guide.
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Provide one subnet for each Availability Zone that your domain uses. For
   * example, you must specify three subnet IDs for a three Availability Zone
   * domain. To learn more, see [VPCs and Subnets]
   * (https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the
   * Amazon VPC User Guide.
   */
  readonly subnets: ec2.ISubnet[];
}

/**
 * Properties for an AWS Elasticsearch Domain.
 */
export interface DomainProps {
  /**
   * Domain Access policies.
   *
   * @default - No access policies.
   */
  readonly accessPolicies?: iam.PolicyStatement[];

  /**
   * Additional options to specify for the Amazon ES domain.
   *
   * @default - no advanced options are specified
   */
  readonly advancedOptions?: { [key: string]: (string) };

  /**
   * Configures Amazon ES to use Amazon Cognito authentication for Kibana.
   *
   * @default - Cognito not used for authentication to Kibana.
   */
  readonly cognitoOptions?: CognitoOptions;

  /**
   * Enforces a particular physical domain name.
   *
   * @default - A name will be auto-generated.
   */
  readonly domainName?: string;

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that
   * are attached to data nodes in the Amazon ES domain.
   *
   * @default - No EBS volumes attached.
   */
  readonly ebsOptions?: EbsOptions;

  /**
   * The cluster configuration for the Amazon ES domain.
   *
   */
  readonly clusterConfig: ClusterConfig;

  /**
   * The Elasticsearch version that your domain will leverage.
   *
   * Per https://aws.amazon.com/elasticsearch-service/faqs/, Amazon Elasticsearch Service
   * currently supports Elasticsearch versions 7.4, 7.1, 6.8, 6.7, 6.5, 6.4, 6.3, 6.2, 6.0,
   * 5.6, 5.5, 5.3, 5.1, 2.3, and 1.5.
   *
   * @default '7.4'
   */
  readonly elasticsearchVersion?: string;

  /**
   * Encryption at rest options for the cluster.
   *
   * @default - No encryption at rest
   */
  readonly encryptionAtRestOptions?: EncryptionAtRestOptions;


  /**
   * Configuration log publishing configuration options.
   *
   * @default - No logs are published
   */
  readonly logPublishingOptions?: LoggingOptions;


  /**
   * Specify true to enable node to node encryption.
   * Requires Elasticsearch version 6.0 or later.
   *
   * @default - Node to node encryption is not enabled.
   */
  readonly nodeToNodeEncryptionEnabled?: boolean;

  /**
   * The hour in UTC during which the service takes an automated daily snapshot
   * of the indices in the Amazon ES domain. Only applies for Elasticsearch
   * versions below 5.3.
   *
   * @default - Hourly automated snapshots not used
   */
  readonly automatedSnapshotStartHour?: number;

  /**
   * The virtual private cloud (VPC) configuration for the Amazon ES domain. For
   * more information, see [VPC Support for Amazon Elasticsearch Service
   * Domains](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-vpc.html)
   * in the Amazon Elasticsearch Service Developer Guide.
   *
   * @default - VPC not used
   */
  readonly vpcOptions?: VpcOptions;
}


/**
 * An interface that represents an Elasticsearch domain - either created with the CDK, or an existing one.
 */
export interface IDomain extends cdk.IResource {
  /**
   * Arn of the Elasticsearch domain.
   *
   * @attribute
   */
  readonly domainArn: string;

  /**
   * Domain name of the Elasticsearch domain.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * Endpoint of the Elasticsearch domain.
   *
   * @attribute
   */
  readonly domainEndpoint: string;

  /**
   * Grant read permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read/write permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexRead(index: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexWrite(index: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read/write permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexReadWrite(index: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathRead(path: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathWrite(path: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read/write permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathReadWrite(path: string, identity: iam.IGrantable): iam.Grant;

  /**
   * Return the given named metric for this Domain.
   */
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Metric for the time the cluster status is red.
   *
   * @default maximum over 5 minutes
   */
  metricClusterStatusRed(props?: MetricOptions): Metric;

  /**
   * Metric for the time the cluster status is yellow.
   *
   * @default maximum over 5 minutes
   */
  metricClusterStatusYellow(props?: MetricOptions): Metric;

  /**
   * Metric for the storage space of nodes in the cluster.
   *
   * @default minimum over 5 minutes
   */
  metricFreeStorageSpace(props?: MetricOptions): Metric;

  /**
   * Metric for the cluster blocking index writes.
   *
   * @default maximum over 1 minute
   */
  metricClusterIndexWriteBlocked(props?: MetricOptions): Metric;

  /**
   * Metric for the number of nodes.
   *
   * @default minimum over 1 hour
   */
  metricNodes(props?: MetricOptions): Metric;

  /**
   * Metric for automated snapshot failures.
   *
   * @default maximum over 5 minutes
   */
  metricAutomatedSnapshotFailure(props?: MetricOptions): Metric;

  /**
   * Metric for CPU utilization.
   *
   * @default maximum over 5 minutes
   */
  metricCPUUtilization(props?: MetricOptions): Metric;

  /**
   * Metric for JVM memory pressure.
   *
   * @default maximum over 5 minutes
   */
  metricJVMMemoryPressure(props?: MetricOptions): Metric;

  /**
   * Metric for master CPU utilization.
   *
   * @default maximum over 5 minutes
   */
  metricMasterCPUUtilization(props?: MetricOptions): Metric;

  /**
   * Metric for master JVM memory pressure.
   *
   * @default maximum over 5 minutes
   */
  metricMasterJVMMemoryPressure(props?: MetricOptions): Metric;

  /**
   * Metric for KMS key errors.
   *
   * @default maximum over 5 minutes
   */
  metricKMSKeyError(props?: MetricOptions): Metric;

  /**
   * Metric for KMS key being inaccessible.
   *
   * @default maximum over 5 minutes
   */
  metricKMSKeyInaccessible(props?: MetricOptions): Metric;

  /**
   * Metric for number of searchable documents.
   *
   * @default maximum over 5 minutes
   */
  metricSearchableDocuments(props?: MetricOptions): Metric;

  /**
   * Metric for search latency.
   *
   * @default p99 over 5 minutes
   */
  metricSearchLatency(props?: MetricOptions): Metric;

  /**
   * Metric for indexing latency.
   *
   * @default p99 over 5 minutes
   */
  metricIndexingLatency(props?: MetricOptions): Metric;
}


/**
 * A new or imported domain.
 */
abstract class DomainBase extends cdk.Resource implements IDomain {
  public abstract readonly domainArn: string;
  public abstract readonly domainName: string;
  public abstract readonly domainEndpoint: string;

  /**
   * Grant read permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantRead(identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_ACTIONS,
      this.domainArn,
      `${this.domainArn}/*`,
    );
  }

  /**
   * Grant write permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_WRITE_ACTIONS,
      this.domainArn,
      `${this.domainArn}/*`,
    );
  }

  /**
   * Grant read/write permissions for this domain and its contents to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_WRITE_ACTIONS,
      this.domainArn,
      `${this.domainArn}/*`,
    );
  }

  /**
   * Grant read permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexRead(index: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_ACTIONS,
      `${this.domainArn}/${index}`,
      `${this.domainArn}/${index}/*`,
    );
  }

  /**
   * Grant write permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexWrite(index: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_WRITE_ACTIONS,
      `${this.domainArn}/${index}`,
      `${this.domainArn}/${index}/*`,
    );
  }

  /**
   * Grant read/write permissions for an index in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param index The index to grant permissions for
   * @param identity The principal
   */
  grantIndexReadWrite(index: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_WRITE_ACTIONS,
      `${this.domainArn}/${index}`,
      `${this.domainArn}/${index}/*`,
    );
  }

  /**
   * Grant read permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathRead(path: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_ACTIONS,
      `${this.domainArn}/${path}`,
    );
  }

  /**
   * Grant write permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathWrite(path: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_WRITE_ACTIONS,
      `${this.domainArn}/${path}`,
    );
  }

  /**
   * Grant read/write permissions for a specific path in this domain to an IAM
   * principal (Role/Group/User).
   *
   * @param path The path to grant permissions for
   * @param identity The principal
   */
  grantPathReadWrite(path: string, identity: iam.IGrantable): iam.Grant {
    return this.grant(
      identity,
      perms.ES_READ_WRITE_ACTIONS,
      `${this.domainArn}/${path}`,
    );
  }

  /**
   * Return the given named metric for this Domain.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/ES',
      metricName,
      dimensions: {
        DomainName: this.domainName,
        ClientId: this.stack.account,
      },
      ...props,
    });
  }

  /**

  * Metric for the time the cluster status is red.
   *
   * @default maximum over 5 minutes
   */
  public metricClusterStatusRed(props?: MetricOptions): Metric {
    return this.metric('ClusterStatus.red', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for the time the cluster status is yellow.
   *
   * @default maximum over 5 minutes
   */
  public metricClusterStatusYellow(props?: MetricOptions): Metric {
    return this.metric('ClusterStatus.yellow', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for the storage space of nodes in the cluster.
   *
   * @default minimum over 5 minutes
   */
  public metricFreeStorageSpace(props?: MetricOptions): Metric {
    return this.metric('FreeStorageSpace', {
      statistic: Statistic.MINIMUM,
      ...props,
    });
  }

  /**
   * Metric for the cluster blocking index writes.
   *
   * @default maximum over 1 minute
   */
  public metricClusterIndexWriteBlocked(props?: MetricOptions): Metric {
    return this.metric('ClusterIndexWriteBlocked', {
      statistic: Statistic.MAXIMUM,
      period: cdk.Duration.minutes(1),
      ...props,
    });
  }

  /**
   * Metric for the number of nodes.
   *
   * @default minimum over 1 hour
   */
  public metricNodes(props?: MetricOptions): Metric {
    return this.metric('Nodes', {
      statistic: Statistic.MINIMUM,
      period: cdk.Duration.hours(1),
      ...props,
    });
  }

  /**
   * Metric for automated snapshot failures.
   *
   * @default maximum over 5 minutes
   */
  public metricAutomatedSnapshotFailure(props?: MetricOptions): Metric {
    return this.metric('AutomatedSnapshotFailure', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for CPU utilization.
   *
   * @default maximum over 5 minutes
   */
  public metricCPUUtilization(props?: MetricOptions): Metric {
    return this.metric('CPUUtilization', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for JVM memory pressure.
   *
   * @default maximum over 5 minutes
   */
  public metricJVMMemoryPressure(props?: MetricOptions): Metric {
    return this.metric('JVMMemoryPressure', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for master CPU utilization.
   *
   * @default maximum over 5 minutes
   */
  public metricMasterCPUUtilization(props?: MetricOptions): Metric {
    return this.metric('MasterCPUUtilization', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for master JVM memory pressure.
   *
   * @default maximum over 5 minutes
   */
  public metricMasterJVMMemoryPressure(props?: MetricOptions): Metric {
    return this.metric('MasterJVMMemoryPressure', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for KMS key errors.
   *
   * @default maximum over 5 minutes
   */
  public metricKMSKeyError(props?: MetricOptions): Metric {
    return this.metric('KMSKeyError', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for KMS key being inaccessible.
   *
   * @default maximum over 5 minutes
   */
  public metricKMSKeyInaccessible(props?: MetricOptions): Metric {
    return this.metric('KMSKeyInaccessible', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for number of searchable documents.
   *
   * @default maximum over 5 minutes
   */
  public metricSearchableDocuments(props?: MetricOptions): Metric {
    return this.metric('SearchableDocuments', {
      statistic: Statistic.MAXIMUM,
      ...props,
    });
  }

  /**
   * Metric for search latency.
   *
   * @default p99 over 5 minutes
   */
  public metricSearchLatency(props?: MetricOptions): Metric {
    return this.metric('SearchLatencyP99', { statistic: 'p99', ...props });
  }

  /**
   * Metric for indexing latency.
   *
   * @default p99 over 5 minutes
   */
  public metricIndexingLatency(props?: MetricOptions): Metric {
    return this.metric('IndexingLatencyP99', { statistic: 'p99', ...props });
  }

  private grant(
    grantee: iam.IGrantable,
    domainActions: string[],
    resourceArn: string,
    ...otherResourceArns: string[]
  ): iam.Grant {
    const resourceArns = [resourceArn, ...otherResourceArns];

    const grant = iam.Grant.addToPrincipal({
      grantee,
      actions: domainActions,
      resourceArns,
      scope: this,
    });

    return grant;
  }
}


/**
 * Reference to an Elasticsearch domain.
 */
export interface DomainAttributes {
  /**
   * The ARN of the Elasticsearch domain.
   */
  readonly domainArn: string;

  /**
   * The domain name of the Elasticsearch domain.
   */
  readonly domainName: string;

  /**
   * The domain endpoint of the Elasticsearch domain.
   */
  readonly domainEndpoint: string;
}


/**
 * Provides an Elasticsearch domain.
 */
export class Domain extends DomainBase implements IDomain {
  /**
   * Creates a Domain construct that represents an external domain via domain endpoint.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param domainEndpoint The domain's endpoint.
   */
  public static fromDomainEndpoint(
    scope: cdk.Construct,
    id: string,
    domainEndpoint: string,
  ): IDomain {
    const stack = cdk.Stack.of(scope);
    const domainName = extractNameFromEndpoint(domainEndpoint);
    const domainArn = stack.formatArn({
      service: 'es',
      resource: 'domain',
      resourceName: domainName,
    });

    return Domain.fromDomainAttributes(scope, id, {
      domainArn,
      domainName,
      domainEndpoint,
    });
  }

  /**
   * Creates a Domain construct that represents an external domain.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `DomainAttributes` object.
   */
  public static fromDomainAttributes(scope: cdk.Construct, id: string, attrs: DomainAttributes): IDomain {
    return new class extends DomainBase {
      public readonly domainArn = attrs.domainArn;
      public readonly domainName = attrs.domainName;
      public readonly domainEndpoint = attrs.domainEndpoint;

      constructor() { super(scope, id); }
    };
  }

  public readonly domainArn: string;
  public readonly domainName: string;
  public readonly domainEndpoint: string;


  private readonly domain: CfnDomain;
  private readonly slowSearchLogGroup?: logs.ILogGroup;
  private readonly slowIndexLogGroup?: logs.ILogGroup;
  private readonly appLogGroup?: logs.ILogGroup;

  constructor(scope: cdk.Construct, id: string, props: DomainProps) {
    super(scope, id, {
      physicalName: props.domainName,
    });

    // If VPC options are supplied ensure that the number of subnets matches the number AZ
    if (props.vpcOptions?.subnets.map((subnet) => subnet.availabilityZone).length != props?.clusterConfig.availabilityZoneCount) {
      throw new Error('When providing vpc options you need to provide a subnet for each AZ you are using');
    };

    const masterInstanceType = props.clusterConfig.masterNodeInstanceType.toLowerCase();
    const dataInstanceType = props.clusterConfig.dataNodeInstanceType.toLowerCase();

    if ([masterInstanceType, dataInstanceType].some(instanceType => !instanceType.endsWith('.elasticsearch'))) {
      throw new Error('Master and data node instance types must end with ".elasticsearch".');
    }

    const elasticsearchVersion = props.elasticsearchVersion ?? '7.4';
    const elasticsearchVersionNum = parseVersion(elasticsearchVersion);

    function parseVersion(version: string): number {
      const firstDot = version.indexOf('.');

      if (firstDot < 1) {
        throw new Error(`Invalid Elasticsearch version: ${version}. Version string needs to start with major and minor version (x.y).`);
      }

      const secondDot = version.indexOf('.', firstDot + 1);

      try {
        if (secondDot == -1) {
          return parseFloat(version);
        } else {
          return parseFloat(version.substring(0, secondDot));
        }
      } catch (error) {
        throw new Error(`Invalid Elasticsearch version: ${version}. Version string needs to start with major and minor version (x.y).`);
      }
    }

    if (
      elasticsearchVersionNum <= 7.4 &&
      ![
        1.5, 2.3, 5.1, 5.3, 5.5, 5.6, 6.0,
        6.2, 6.3, 6.4, 6.5, 6.7, 6.8, 7.1, 7.4,
      ].includes(elasticsearchVersionNum)
    ) {
      throw new Error(`Unknown Elasticsearch version: ${elasticsearchVersion}`);
    }

    const encryptionAtRestEnabled = props.encryptionAtRestOptions?.enabled ?? (props.encryptionAtRestOptions?.kmsKey != null);
    const ebsEnabled = props.ebsOptions != null;

    function isInstanceType(instanceType: string): Boolean {
      return masterInstanceType.startsWith(instanceType) || dataInstanceType.startsWith(instanceType);
    };

    function isSomeInstanceType(...instanceTypes: string[]): Boolean {
      return instanceTypes.some(isInstanceType);
    };

    function isEveryInstanceType(...instanceTypes: string[]): Boolean {
      return instanceTypes.some(t => masterInstanceType.startsWith(t))
        && instanceTypes.some(t => dataInstanceType.startsWith(t));
    };

    // Validate feature support for the given Elasticsearch version, per
    // https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/aes-features-by-version.html
    if (elasticsearchVersionNum < 5.1) {
      if (
        props.logPublishingOptions?.slowIndexLogEnabled
        || props.logPublishingOptions?.appLogEnabled
        || props.logPublishingOptions?.slowSearchLogEnabled
      ) {
        throw new Error('Error and slow logs publishing requires Elasticsearch version 5.1 or later.');
      }
      if (props.encryptionAtRestOptions?.enabled) {
        throw new Error('Encryption of data at rest requires Elasticsearch version 5.1 or later.');
      }
      if (props.cognitoOptions != null) {
        throw new Error('Cognito authentication for Kibana requires Elasticsearch version 5.1 or later.');
      }
      if (isSomeInstanceType('c5', 'i3', 'm5', 'r5')) {
        throw new Error('C5, I3, M5, and R5 instance types require Elasticsearch version 5.1 or later.');
      }
    }

    if (elasticsearchVersionNum < 6.0) {
      if (props.nodeToNodeEncryptionEnabled) {
        throw new Error('Node-to-node encryption requires Elasticsearch version 6.0 or later.');
      }
    }

    // Validate against instance type restrictions, per
    // https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/aes-supported-instance-types.html
    if (isInstanceType('i3') && ebsEnabled) {
      throw new Error('I3 instance types do not support EBS storage volumes.');
    }

    if (isSomeInstanceType('m3', 'r3', 't2') && encryptionAtRestEnabled) {
      throw new Error('M3, R3, and T2 instance types do not support encryption of data at rest.');
    }

    if (isInstanceType('t2.micro') && elasticsearchVersionNum > 2.3) {
      throw new Error('The t2.micro.elasticsearch instance type supports only Elasticsearch 1.5 and 2.3.');
    }

    // Only R3 and I3 support instance storage, per
    // https://aws.amazon.com/elasticsearch-service/pricing/
    if (!ebsEnabled && !isEveryInstanceType('r3', 'i3')) {
      throw new Error('EBS volumes are required for all instance types except R3 and I3.');
    }

    let cfnVpcOptions: CfnDomain.VPCOptionsProperty | undefined;
    if (props.vpcOptions) {
      cfnVpcOptions = {
        securityGroupIds: props.vpcOptions.securityGroups.map((sg) => sg.securityGroupId),
        subnetIds: props.vpcOptions.subnets.map((subnet) => subnet.subnetId),
      };
    }

    // Setup logging
    const logGroups: logs.ILogGroup[] = [];

    if (props.logPublishingOptions?.slowSearchLogEnabled) {
      this.slowSearchLogGroup = props.logPublishingOptions.slowSearchLogGroup ??
        new logs.LogGroup(scope, 'SlowSearchLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.slowSearchLogGroup);
    };

    if (props.logPublishingOptions?.slowIndexLogEnabled) {
      this.slowIndexLogGroup = props.logPublishingOptions.slowIndexLogGroup ??
        new logs.LogGroup(scope, 'SlowIndexLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.slowIndexLogGroup);
    };

    if (props.logPublishingOptions?.appLogEnabled) {
      this.appLogGroup = props.logPublishingOptions.appLogGroup ??
        new logs.LogGroup(scope, 'AppLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.appLogGroup);
    };

    let logGroupResourcePolicy: LogGroupResourcePolicy | null = null;
    if (logGroups.length > 0) {
      const logPolicyStatement = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
        resources: logGroups.map((lg) => lg.logGroupArn),
        principals: [new iam.ServicePrincipal('es.amazonaws.com')],
      });

      // Use a custom resource to set the log group resource policy since it is not supported by CDK and cfn.
      // https://github.com/aws/aws-cdk/issues/5343
      logGroupResourcePolicy = new LogGroupResourcePolicy(this, 'ESLogGroupPolicy', {
        policyName: 'ESLogPolicy',
        policyStatements: [logPolicyStatement],
      });
    }

    // Create the domain
    this.domain = new CfnDomain(this, 'Resource', {
      domainName: this.physicalName,
      elasticsearchVersion: elasticsearchVersion.toString(),
      elasticsearchClusterConfig: {
        dedicatedMasterEnabled: props.clusterConfig.masterNodes != null,
        dedicatedMasterCount: props.clusterConfig.masterNodes,
        dedicatedMasterType: props.clusterConfig.masterNodeInstanceType,
        instanceCount: props.clusterConfig.dataNodes,
        instanceType: props.clusterConfig.dataNodeInstanceType,
        zoneAwarenessEnabled: props.clusterConfig.availabilityZoneCount != null,
        zoneAwarenessConfig:
          props.clusterConfig.availabilityZoneCount != null
            ? { availabilityZoneCount: props.clusterConfig.availabilityZoneCount }
            : undefined,
      },
      ebsOptions: {
        ebsEnabled,
        volumeSize: props.ebsOptions?.volumeSize,
        volumeType: props.ebsOptions?.volumeType,
        iops: props.ebsOptions?.iops,
      },
      encryptionAtRestOptions: {
        enabled: encryptionAtRestEnabled,
        kmsKeyId: props.encryptionAtRestOptions?.kmsKey?.keyId,
      },
      nodeToNodeEncryptionOptions: { enabled: props.nodeToNodeEncryptionEnabled ?? false },
      logPublishingOptions: {
        ES_APPLICATION_LOGS: {
          enabled: this.appLogGroup != null,
          cloudWatchLogsLogGroupArn: this.appLogGroup?.logGroupArn,
        },
        SEARCH_SLOW_LOGS: {
          enabled: this.slowSearchLogGroup != null,
          cloudWatchLogsLogGroupArn: this.slowSearchLogGroup?.logGroupArn,
        },
        INDEX_SLOW_LOGS: {
          enabled: this.slowIndexLogGroup != null,
          cloudWatchLogsLogGroupArn: this.slowIndexLogGroup?.logGroupArn,
        },
      },
      cognitoOptions: {
        enabled: props.cognitoOptions != null,
        identityPoolId: props.cognitoOptions?.identityPoolId,
        roleArn: props.cognitoOptions?.role.roleArn,
        userPoolId: props.cognitoOptions?.userPoolId,
      },
      vpcOptions: cfnVpcOptions,
      snapshotOptions: props.automatedSnapshotStartHour
        ? { automatedSnapshotStartHour: props.automatedSnapshotStartHour }
        : undefined,
    });

    if (logGroupResourcePolicy) { this.domain.node.addDependency(logGroupResourcePolicy); }

    if (props.domainName) { this.node.addMetadata('aws:cdk:hasPhysicalName', props.domainName); }

    this.domainArn = this.getResourceArnAttribute(this.domain.attrArn, {
      service: 'es',
      resource: 'domain',
      resourceName: this.physicalName,
    });
    this.domainName = this.getResourceNameAttribute(this.domain.ref);

    this.domainEndpoint = this.domain.getAtt('DomainEndpoint').toString();
  }
}

/**
 * Given an Elasticsearch domain endpoint, returns a CloudFormation expression that
 * extracts the domain name.
 *
 * Domain endpoints look like this:
 *
 *   https://example-domain-jcjotrt6f7otem4sqcwbch3c4u.us-east-1.es.amazonaws.com
 *   https://<domain-name>-<suffix>.<region>.es.amazonaws.com
 *
 * ..which means that in order to extract the domain name from the endpoint, we can
 * split the endpoint using "-<suffix>" and select the component in index 0.
 *
 * @param domainEndpoint The Elasticsearch domain endpoint
 */
function extractNameFromEndpoint(domainEndpoint: string) {
  const { hostname } = new URL(domainEndpoint);
  const domain = hostname.split('.')[0];
  const suffix = '-' + domain.split('-').slice(-1)[0];
  return domain.split(suffix)[0];
}
