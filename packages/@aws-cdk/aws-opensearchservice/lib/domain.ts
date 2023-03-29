import { URL } from 'url';

import * as acm from '@aws-cdk/aws-certificatemanager';
import { Metric, MetricOptions, Statistic } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as route53 from '@aws-cdk/aws-route53';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

import { LogGroupResourcePolicy } from './log-group-resource-policy';
import { OpenSearchAccessPolicy } from './opensearch-access-policy';
import { CfnDomain } from './opensearchservice.generated';
import * as perms from './perms';
import { EngineVersion } from './version';

/**
 * Configures the capacity of the cluster such as the instance type and the
 * number of instances.
 */
export interface CapacityConfig {
  /**
   * The number of instances to use for the master node.
   *
   * @default - no dedicated master nodes
   */
  readonly masterNodes?: number;

  /**
   * The hardware configuration of the computer that hosts the dedicated master
   * node, such as `m3.medium.search`. For valid values, see [Supported
   * Instance Types]
   * (https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html)
   * in the Amazon OpenSearch Service Developer Guide.
   *
   * @default - r5.large.search
   */
  readonly masterNodeInstanceType?: string;

  /**
   * The number of data nodes (instances) to use in the Amazon OpenSearch Service domain.
   *
   * @default - 1
   */
  readonly dataNodes?: number;

  /**
   * The instance type for your data nodes, such as
   * `m3.medium.search`. For valid values, see [Supported Instance
   * Types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html)
   * in the Amazon OpenSearch Service Developer Guide.
   *
   * @default - r5.large.search
   */
  readonly dataNodeInstanceType?: string;

  /**
   * The number of UltraWarm nodes (instances) to use in the Amazon OpenSearch Service domain.
   *
   * @default - no UltraWarm nodes
   */
  readonly warmNodes?: number;

  /**
   * The instance type for your UltraWarm node, such as `ultrawarm1.medium.search`.
   * For valid values, see [UltraWarm Storage Limits]
   * (https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#limits-ultrawarm)
   * in the Amazon OpenSearch Service Developer Guide.
   *
   * @default - ultrawarm1.medium.search
   */
  readonly warmInstanceType?: string;

}

/**
 * Specifies zone awareness configuration options.
 */
export interface ZoneAwarenessConfig {
  /**
   * Indicates whether to enable zone awareness for the Amazon OpenSearch Service domain.
   * When you enable zone awareness, Amazon OpenSearch Service allocates the nodes and replica
   * index shards that belong to a cluster across two Availability Zones (AZs)
   * in the same region to prevent data loss and minimize downtime in the event
   * of node or data center failure. Don't enable zone awareness if your cluster
   * has no replica index shards or is a single-node cluster. For more information,
   * see [Configuring a Multi-AZ Domain]
   * (https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html)
   * in the Amazon OpenSearch Service Developer Guide.
   *
   * @default - false
   */
  readonly enabled?: boolean;

  /**
   * If you enabled multiple Availability Zones (AZs), the number of AZs that you
   * want the domain to use. Valid values are 2 and 3.
   *
   * @default - 2 if zone awareness is enabled.
   */
  readonly availabilityZoneCount?: number;
}

/**
 * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that
 * are attached to data nodes in the Amazon OpenSearch Service domain. For more information, see
 * [Amazon EBS]
 * (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html)
 * in the Amazon Elastic Compute Cloud Developer Guide.
 */
export interface EbsOptions {
  /**
   * Specifies whether Amazon EBS volumes are attached to data nodes in the
   * Amazon OpenSearch Service domain.
   *
   * @default - true
   */
  readonly enabled?: boolean;

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
   * instance type to which it is attached.  For  valid values, see
   * [EBS volume size limits]
   * (https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource)
   * in the Amazon OpenSearch Service Developer Guide.
   *
   * @default 10
   */
  readonly volumeSize?: number;

  /**
   * The EBS volume type to use with the Amazon OpenSearch Service domain, such as standard, gp2, io1.
   *
   * @default gp2
   */
  readonly volumeType?: ec2.EbsDeviceVolumeType;
}

/**
 * Configures log settings for the domain.
 */
export interface LoggingOptions {
  /**
   * Specify if slow search logging should be set up.
   * Requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.
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
   * Requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.
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
   * Specify if Amazon OpenSearch Service application logging should be set up.
   * Requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.
   *
   * @default - false
   */
  readonly appLogEnabled?: boolean;

  /**
   * Log Amazon OpenSearch Service application logs to this log group.
   *
   * @default - a new log group is created if app logging is enabled
   */
  readonly appLogGroup?: logs.ILogGroup;

  /**
   * Specify if Amazon OpenSearch Service audit logging should be set up.
   * Requires Elasticsearch version 6.7 or later or OpenSearch version 1.0 or later and fine grained access control to be enabled.
   *
   * @default - false
   */
  readonly auditLogEnabled?: boolean;

  /**
   * Log Amazon OpenSearch Service audit logs to this log group.
   *
   * @default - a new log group is created if audit logging is enabled
   */
  readonly auditLogGroup?: logs.ILogGroup;
}

/**
 * Whether the domain should encrypt data at rest, and if so, the AWS Key
 * Management Service (KMS) key to use. Can only be used to create a new domain,
 * not update an existing one. Requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.
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
 * Configures Amazon OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
 * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html
 */
export interface CognitoOptions {
  /**
   * The Amazon Cognito identity pool ID that you want Amazon OpenSearch Service to use for OpenSearch Dashboards authentication.
   */
  readonly identityPoolId: string;

  /**
   * A role that allows Amazon OpenSearch Service to configure your user pool and identity pool. It must have the `AmazonESCognitoAccess` policy attached to it.
   *
   * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html#cognito-auth-prereq
   */
  readonly role: iam.IRole;

  /**
   * The Amazon Cognito user pool ID that you want Amazon OpenSearch Service to use for OpenSearch Dashboards authentication.
   */
  readonly userPoolId: string;
}

/**
 * The minimum TLS version required for traffic to the domain.
 */
export enum TLSSecurityPolicy {
  /** Cipher suite TLS 1.0 */
  TLS_1_0 = 'Policy-Min-TLS-1-0-2019-07',
  /** Cipher suite TLS 1.2 */
  TLS_1_2 = 'Policy-Min-TLS-1-2-2019-07'
}

/**
 * Specifies options for fine-grained access control.
 */
export interface AdvancedSecurityOptions {
  /**
   * ARN for the master user. Only specify this or masterUserName, but not both.
   *
   * @default - fine-grained access control is disabled
   */
  readonly masterUserArn?: string;

  /**
   * Username for the master user. Only specify this or masterUserArn, but not both.
   *
   * @default - fine-grained access control is disabled
   */
  readonly masterUserName?: string;

  /**
   * Password for the master user.
   *
   * You can use `SecretValue.unsafePlainText` to specify a password in plain text or
   * use `secretsmanager.Secret.fromSecretAttributes` to reference a secret in
   * Secrets Manager.
   *
   * @default - A Secrets Manager generated password
   */
  readonly masterUserPassword?: cdk.SecretValue;
}

/**
 * Configures a custom domain endpoint for the Amazon OpenSearch Service domain
 */
export interface CustomEndpointOptions {
  /**
   * The custom domain name to assign
   */
  readonly domainName: string;

  /**
   * The certificate to use
   * @default - create a new one
   */
  readonly certificate?: acm.ICertificate;

  /**
   * The hosted zone in Route53 to create the CNAME record in
   * @default - do not create a CNAME
   */
  readonly hostedZone?: route53.IHostedZone;
}

/**
 * Properties for an Amazon OpenSearch Service domain.
 */
export interface DomainProps {
  /**
   * Domain access policies.
   *
   * @default - No access policies.
   */
  readonly accessPolicies?: iam.PolicyStatement[];

  /**
   * Additional options to specify for the Amazon OpenSearch Service domain.
   *
   * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html#createdomain-configure-advanced-options
   * @default - no advanced options are specified
   */
  readonly advancedOptions?: { [key: string]: (string) };

  /**
   * Configures Amazon OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   *
   * @default - Cognito not used for authentication to OpenSearch Dashboards.
   */
  readonly cognitoDashboardsAuth?: CognitoOptions;

  /**
   * Enforces a particular physical domain name.
   *
   * @default - A name will be auto-generated.
   */
  readonly domainName?: string;

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that
   * are attached to data nodes in the Amazon OpenSearch Service domain.
   *
   * @default - 10 GiB General Purpose (SSD) volumes per node.
   */
  readonly ebs?: EbsOptions;

  /**
   * The cluster capacity configuration for the Amazon OpenSearch Service domain.
   *
   * @default - 1 r5.large.search data node; no dedicated master nodes.
   */
  readonly capacity?: CapacityConfig;

  /**
   * The cluster zone awareness configuration for the Amazon OpenSearch Service domain.
   *
   * @default - no zone awareness (1 AZ)
   */
  readonly zoneAwareness?: ZoneAwarenessConfig;

  /**
   * The Elasticsearch/OpenSearch version that your domain will leverage.
   */
  readonly version: EngineVersion;

  /**
   * Encryption at rest options for the cluster.
   *
   * @default - No encryption at rest
   */
  readonly encryptionAtRest?: EncryptionAtRestOptions;

  /**
   * Configuration log publishing configuration options.
   *
   * @default - No logs are published
   */
  readonly logging?: LoggingOptions;

  /**
   * Specify true to enable node to node encryption.
   * Requires Elasticsearch version 6.0 or later or OpenSearch version 1.0 or later.
   *
   * @default - Node to node encryption is not enabled.
   */
  readonly nodeToNodeEncryption?: boolean;

  /**
   * The hour in UTC during which the service takes an automated daily snapshot
   * of the indices in the Amazon OpenSearch Service domain. Only applies for Elasticsearch versions
   * below 5.3.
   *
   * @default - Hourly automated snapshots not used
   */
  readonly automatedSnapshotStartHour?: number;

  /**
   * Place the domain inside this VPC.
   *
   * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html
   * @default - Domain is not placed in a VPC.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The list of security groups that are associated with the VPC endpoints
   * for the domain.
   *
   * Only used if `vpc` is specified.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html
   * @default - One new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The specific vpc subnets the domain will be placed in. You must provide one subnet for each Availability Zone
   * that your domain uses. For example, you must specify three subnet IDs for a three Availability Zone
   * domain.
   *
   * Only used if `vpc` is specified.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html
   * @default - All private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection[];

  /**
   * True to require that all traffic to the domain arrive over HTTPS.
   *
   * @default - false
   */
  readonly enforceHttps?: boolean;

  /**
   * The minimum TLS version required for traffic to the domain.
   *
   * @default - TLSSecurityPolicy.TLS_1_0
   */
  readonly tlsSecurityPolicy?: TLSSecurityPolicy;

  /**
   * Specifies options for fine-grained access control.
   * Requires Elasticsearch version 6.7 or later or OpenSearch version 1.0 or later. Enabling fine-grained access control
   * also requires encryption of data at rest and node-to-node encryption, along with
   * enforced HTTPS.
   *
   * @default - fine-grained access control is disabled
   */
  readonly fineGrainedAccessControl?: AdvancedSecurityOptions;

  /**
   * Configures the domain so that unsigned basic auth is enabled. If no master user is provided a default master user
   * with username `admin` and a dynamically generated password stored in KMS is created. The password can be retrieved
   * by getting `masterUserPassword` from the domain instance.
   *
   * Setting this to true will also add an access policy that allows unsigned
   * access, enable node to node encryption, encryption at rest. If conflicting
   * settings are encountered (like disabling encryption at rest) enabling this
   * setting will cause a failure.
   *
   * @default - false
   */
  readonly useUnsignedBasicAuth?: boolean;

  /**
   * To upgrade an Amazon OpenSearch Service domain to a new version, rather than replacing the entire
   * domain resource, use the EnableVersionUpgrade update policy.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain
   * @default - false
   */
  readonly enableVersionUpgrade?: boolean;

  /**
   * Policy to apply when the domain is removed from the stack
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: cdk.RemovalPolicy;

  /**
   * To configure a custom domain configure these options
   *
   * If you specify a Route53 hosted zone it will create a CNAME record and use DNS validation for the certificate
   * @default - no custom domain endpoint will be configured
   */
  readonly customEndpoint?: CustomEndpointOptions;
}

/**
 * An interface that represents an Amazon OpenSearch Service domain - either created with the CDK, or an existing one.
 */
export interface IDomain extends cdk.IResource {
  /**
   * Arn of the Amazon OpenSearch Service domain.
   *
   * @attribute
   */
  readonly domainArn: string;

  /**
   * Domain name of the Amazon OpenSearch Service domain.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * Identifier of the Amazon OpenSearch Service domain.
   *
   * @attribute
   */
  readonly domainId: string;

  /**
   * Endpoint of the Amazon OpenSearch Service domain.
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
   * Return the given named metric for this domain.
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
  metricClusterIndexWritesBlocked(props?: MetricOptions): Metric;

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
  public abstract readonly domainId: string;
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
   * Return the given named metric for this domain.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/ES',
      metricName,
      dimensionsMap: {
        DomainName: this.domainName,
        ClientId: this.env.account,
      },
      ...props,
    }).attachTo(this);
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
  public metricClusterIndexWritesBlocked(props?: MetricOptions): Metric {
    return this.metric('ClusterIndexWritesBlocked', {
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
    return this.metric('SearchLatency', { statistic: 'p99', ...props });
  }

  /**
   * Metric for indexing latency.
   *
   * @default p99 over 5 minutes
   */
  public metricIndexingLatency(props?: MetricOptions): Metric {
    return this.metric('IndexingLatency', { statistic: 'p99', ...props });
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
 * Reference to an Amazon OpenSearch Service domain.
 */
export interface DomainAttributes {
  /**
   * The ARN of the Amazon OpenSearch Service domain.
   */
  readonly domainArn: string;

  /**
   * The domain endpoint of the Amazon OpenSearch Service domain.
   */
  readonly domainEndpoint: string;
}


/**
 * Provides an Amazon OpenSearch Service domain.
 */
export class Domain extends DomainBase implements IDomain, ec2.IConnectable {
  /**
   * Creates a domain construct that represents an external domain via domain endpoint.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param domainEndpoint The domain's endpoint.
   */
  public static fromDomainEndpoint(
    scope: Construct,
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
      domainEndpoint,
    });
  }

  /**
   * Creates a domain construct that represents an external domain.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `DomainAttributes` object.
   */
  public static fromDomainAttributes(scope: Construct, id: string, attrs: DomainAttributes): IDomain {
    const { domainArn, domainEndpoint } = attrs;
    const domainName = cdk.Stack.of(scope).splitArn(domainArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName
      ?? extractNameFromEndpoint(domainEndpoint);

    return new class extends DomainBase {
      public readonly domainArn = domainArn;
      public readonly domainName = domainName;
      public readonly domainId = domainName;
      public readonly domainEndpoint = domainEndpoint.replace(/^https?:\/\//, '');

      constructor() { super(scope, id); }
    };
  }

  public readonly domainArn: string;
  public readonly domainName: string;
  public readonly domainId: string;
  public readonly domainEndpoint: string;

  /**
   * Log group that slow searches are logged to.
   *
   * @attribute
   */
  public readonly slowSearchLogGroup?: logs.ILogGroup;

  /**
   * Log group that slow indices are logged to.
   *
   * @attribute
   */
  public readonly slowIndexLogGroup?: logs.ILogGroup;

  /**
   * Log group that application logs are logged to.
   *
   * @attribute
   */
  public readonly appLogGroup?: logs.ILogGroup;

  /**
   * Log group that audit logs are logged to.
   *
   * @attribute
   */
  public readonly auditLogGroup?: logs.ILogGroup;

  /**
   * Master user password if fine grained access control is configured.
   */
  public readonly masterUserPassword?: cdk.SecretValue;


  private readonly domain: CfnDomain;

  private accessPolicy?: OpenSearchAccessPolicy

  private encryptionAtRestOptions?: EncryptionAtRestOptions

  private readonly _connections: ec2.Connections | undefined;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, {
      physicalName: props.domainName,
    });

    const defaultInstanceType = 'r5.large.search';
    const warmDefaultInstanceType = 'ultrawarm1.medium.search';

    const dedicatedMasterType = initializeInstanceType(defaultInstanceType, props.capacity?.masterNodeInstanceType);
    const dedicatedMasterCount = props.capacity?.masterNodes ?? 0;
    const dedicatedMasterEnabled = cdk.Token.isUnresolved(dedicatedMasterCount) ? true : dedicatedMasterCount > 0;

    const instanceType = initializeInstanceType(defaultInstanceType, props.capacity?.dataNodeInstanceType);
    const instanceCount = props.capacity?.dataNodes ?? 1;

    const warmType = initializeInstanceType(warmDefaultInstanceType, props.capacity?.warmInstanceType);
    const warmCount = props.capacity?.warmNodes ?? 0;
    const warmEnabled = cdk.Token.isUnresolved(warmCount) ? true : warmCount > 0;

    const availabilityZoneCount =
      props.zoneAwareness?.availabilityZoneCount ?? 2;

    if (![2, 3].includes(availabilityZoneCount)) {
      throw new Error('Invalid zone awareness configuration; availabilityZoneCount must be 2 or 3');
    }

    const zoneAwarenessEnabled =
      props.zoneAwareness?.enabled ??
      props.zoneAwareness?.availabilityZoneCount != null;


    let securityGroups: ec2.ISecurityGroup[] | undefined;
    let subnets: ec2.ISubnet[] | undefined;

    let skipZoneAwarenessCheck: boolean = false;
    if (props.vpc) {
      const subnetSelections = props.vpcSubnets ?? [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }];
      subnets = selectSubnets(props.vpc, subnetSelections);
      skipZoneAwarenessCheck = zoneAwarenessCheckShouldBeSkipped(props.vpc, subnetSelections);
      securityGroups = props.securityGroups ?? [new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        description: `Security group for domain ${this.node.id}`,
      })];
      if (props.enforceHttps) {
        this._connections = new ec2.Connections({ securityGroups, defaultPort: ec2.Port.tcp(443) });
      } else {
        this._connections = new ec2.Connections({ securityGroups });
      }
    }

    // If VPC options are supplied ensure that the number of subnets matches the number AZ (only if the vpc is not imported from another stack)
    if (subnets &&
      zoneAwarenessEnabled &&
      !skipZoneAwarenessCheck &&
      new Set(subnets.map((subnet) => subnet.availabilityZone)).size < availabilityZoneCount
    ) {
      throw new Error('When providing vpc options you need to provide a subnet for each AZ you are using');
    }

    if ([dedicatedMasterType, instanceType, warmType].some(t => (!cdk.Token.isUnresolved(t) && !t.endsWith('.search')))) {
      throw new Error('Master, data and UltraWarm node instance types must end with ".search".');
    }

    if (!cdk.Token.isUnresolved(warmType) && !warmType.startsWith('ultrawarm')) {
      throw new Error('UltraWarm node instance type must start with "ultrawarm".');
    }

    const unsignedBasicAuthEnabled = props.useUnsignedBasicAuth ?? false;

    if (unsignedBasicAuthEnabled) {
      if (props.enforceHttps == false) {
        throw new Error('You cannot disable HTTPS and use unsigned basic auth');
      }
      if (props.nodeToNodeEncryption == false) {
        throw new Error('You cannot disable node to node encryption and use unsigned basic auth');
      }
      if (props.encryptionAtRest?.enabled == false) {
        throw new Error('You cannot disable encryption at rest and use unsigned basic auth');
      }
    }

    const unsignedAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['es:ESHttp*'],
      principals: [new iam.AnyPrincipal()],
      resources: [cdk.Lazy.string({ produce: () => `${this.domainArn}/*` })],
    });

    const masterUserArn = props.fineGrainedAccessControl?.masterUserArn;
    const masterUserNameProps = props.fineGrainedAccessControl?.masterUserName;
    // If basic auth is enabled set the user name to admin if no other user info is supplied.
    const masterUserName = unsignedBasicAuthEnabled
      ? (masterUserArn == null ? (masterUserNameProps ?? 'admin') : undefined)
      : masterUserNameProps;

    if (masterUserArn != null && masterUserName != null) {
      throw new Error('Invalid fine grained access control settings. Only provide one of master user ARN or master user name. Not both.');
    }

    const advancedSecurityEnabled = (masterUserArn ?? masterUserName) != null;
    const internalUserDatabaseEnabled = masterUserName != null;
    const masterUserPasswordProp = props.fineGrainedAccessControl?.masterUserPassword;
    const createMasterUserPassword = (): cdk.SecretValue => {
      return new secretsmanager.Secret(this, 'MasterUser', {
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: masterUserName,
          }),
          generateStringKey: 'password',
          excludeCharacters: "{}'\\*[]()`",
        },
      })
        .secretValueFromJson('password');
    };
    this.masterUserPassword = internalUserDatabaseEnabled ?
      (masterUserPasswordProp ?? createMasterUserPassword())
      : undefined;

    const encryptionAtRestEnabled =
      props.encryptionAtRest?.enabled ?? (props.encryptionAtRest?.kmsKey != null || unsignedBasicAuthEnabled);
    const nodeToNodeEncryptionEnabled = props.nodeToNodeEncryption ?? unsignedBasicAuthEnabled;
    const volumeSize = props.ebs?.volumeSize ?? 10;
    const volumeType = props.ebs?.volumeType ?? ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD;
    const ebsEnabled = props.ebs?.enabled ?? true;
    const enforceHttps = props.enforceHttps ?? unsignedBasicAuthEnabled;

    function isInstanceType(t: string): Boolean {
      return dedicatedMasterType.startsWith(t) || instanceType.startsWith(t);
    };

    function isSomeInstanceType(...instanceTypes: string[]): Boolean {
      return instanceTypes.some(isInstanceType);
    };

    function isEveryDatanodeInstanceType(...instanceTypes: string[]): Boolean {
      return instanceTypes.some(t => instanceType.startsWith(t));
    };

    // Validate feature support for the given Elasticsearch/OpenSearch version, per
    // https://docs.aws.amazon.com/opensearch-service/latest/developerguide/features-by-version.html
    const { versionNum: versionNum, isElasticsearchVersion } = parseVersion(props.version);
    if (isElasticsearchVersion) {

      if (
        versionNum <= 7.7 &&
        ![
          1.5, 2.3, 5.1, 5.3, 5.5, 5.6, 6.0,
          6.2, 6.3, 6.4, 6.5, 6.7, 6.8, 7.1, 7.4,
          7.7,
        ].includes(versionNum)
      ) {
        throw new Error(`Unknown Elasticsearch version: ${versionNum}`);
      }

      if (versionNum < 5.1) {
        if (props.logging?.appLogEnabled) {
          throw new Error('Error logs publishing requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.');
        }
        if (props.encryptionAtRest?.enabled) {
          throw new Error('Encryption of data at rest requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.');
        }
        if (props.cognitoDashboardsAuth != null) {
          throw new Error('Cognito authentication for OpenSearch Dashboards requires Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.');
        }
        if (isSomeInstanceType('c5', 'i3', 'm5', 'r5')) {
          throw new Error('C5, I3, M5, and R5 instance types require Elasticsearch version 5.1 or later or OpenSearch version 1.0 or later.');
        }
      }

      if (versionNum < 6.0) {
        if (props.nodeToNodeEncryption) {
          throw new Error('Node-to-node encryption requires Elasticsearch version 6.0 or later or OpenSearch version 1.0 or later.');
        }
      }

      if (versionNum < 6.7) {
        if (unsignedBasicAuthEnabled) {
          throw new Error('Using unsigned basic auth requires Elasticsearch version 6.7 or later or OpenSearch version 1.0 or later.');
        }
        if (advancedSecurityEnabled) {
          throw new Error('Fine-grained access control requires Elasticsearch version 6.7 or later or OpenSearch version 1.0 or later.');
        }
      }

      if (versionNum < 6.8 && warmEnabled) {
        throw new Error('UltraWarm requires Elasticsearch version 6.8 or later or OpenSearch version 1.0 or later.');
      }
    }

    // Validate against instance type restrictions, per
    // https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html
    if (isSomeInstanceType('i3', 'r6gd') && ebsEnabled) {
      throw new Error('I3 and R6GD instance types do not support EBS storage volumes.');
    }

    if (isSomeInstanceType('m3', 'r3', 't2') && encryptionAtRestEnabled) {
      throw new Error('M3, R3, and T2 instance types do not support encryption of data at rest.');
    }

    if (isInstanceType('t2.micro') && !(isElasticsearchVersion && versionNum <= 2.3)) {
      throw new Error('The t2.micro.search instance type supports only Elasticsearch versions 1.5 and 2.3.');
    }

    if (isSomeInstanceType('t2', 't3') && warmEnabled) {
      throw new Error('T2 and T3 instance types do not support UltraWarm storage.');
    }

    // Only R3, I3 and r6gd support instance storage, per
    // https://aws.amazon.com/opensearch-service/pricing/
    if (!ebsEnabled && !isEveryDatanodeInstanceType('r3', 'i3', 'r6gd')) {
      throw new Error('EBS volumes are required when using instance types other than r3, i3 or r6gd.');
    }

    // Fine-grained access control requires node-to-node encryption, encryption at rest,
    // and enforced HTTPS.
    if (advancedSecurityEnabled) {
      if (!nodeToNodeEncryptionEnabled) {
        throw new Error('Node-to-node encryption is required when fine-grained access control is enabled.');
      }
      if (!encryptionAtRestEnabled) {
        throw new Error('Encryption-at-rest is required when fine-grained access control is enabled.');
      }
      if (!enforceHttps) {
        throw new Error('Enforce HTTPS is required when fine-grained access control is enabled.');
      }
    }

    // Validate fine grained access control enabled for audit logs, per
    // https://aws.amazon.com/about-aws/whats-new/2020/09/elasticsearch-audit-logs-now-available-on-amazon-elasticsearch-service/
    if (props.logging?.auditLogEnabled && !advancedSecurityEnabled) {
      throw new Error('Fine-grained access control is required when audit logs publishing is enabled.');
    }

    // Validate UltraWarm requirement for dedicated master nodes, per
    // https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html
    if (warmEnabled && !dedicatedMasterEnabled) {
      throw new Error('Dedicated master node is required when UltraWarm storage is enabled.');
    }

    let cfnVpcOptions: CfnDomain.VPCOptionsProperty | undefined;

    if (securityGroups && subnets) {
      cfnVpcOptions = {
        securityGroupIds: securityGroups.map((sg) => sg.securityGroupId),
        subnetIds: subnets.map((subnet) => subnet.subnetId),
      };
    }

    // Setup logging
    const logGroups: logs.ILogGroup[] = [];

    if (props.logging?.slowSearchLogEnabled) {
      this.slowSearchLogGroup = props.logging.slowSearchLogGroup ??
        new logs.LogGroup(this, 'SlowSearchLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.slowSearchLogGroup);
    };

    if (props.logging?.slowIndexLogEnabled) {
      this.slowIndexLogGroup = props.logging.slowIndexLogGroup ??
        new logs.LogGroup(this, 'SlowIndexLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.slowIndexLogGroup);
    };

    if (props.logging?.appLogEnabled) {
      this.appLogGroup = props.logging.appLogGroup ??
        new logs.LogGroup(this, 'AppLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.appLogGroup);
    };

    if (props.logging?.auditLogEnabled) {
      this.auditLogGroup = props.logging.auditLogGroup ??
        new logs.LogGroup(this, 'AuditLogs', {
          retention: logs.RetentionDays.ONE_MONTH,
        });

      logGroups.push(this.auditLogGroup);
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
      logGroupResourcePolicy = new LogGroupResourcePolicy(this, `ESLogGroupPolicy${this.node.addr}`, {
        // create a cloudwatch logs resource policy name that is unique to this domain instance
        policyName: `ESLogPolicy${this.node.addr}`,
        policyStatements: [logPolicyStatement],
      });
    }

    const logPublishing: Record<string, any> = {};

    if (this.appLogGroup) {
      logPublishing.ES_APPLICATION_LOGS = {
        enabled: true,
        cloudWatchLogsLogGroupArn: this.appLogGroup.logGroupArn,
      };
    }

    if (this.slowSearchLogGroup) {
      logPublishing.SEARCH_SLOW_LOGS = {
        enabled: true,
        cloudWatchLogsLogGroupArn: this.slowSearchLogGroup.logGroupArn,
      };
    }

    if (this.slowIndexLogGroup) {
      logPublishing.INDEX_SLOW_LOGS = {
        enabled: true,
        cloudWatchLogsLogGroupArn: this.slowIndexLogGroup.logGroupArn,
      };
    }

    if (this.auditLogGroup) {
      logPublishing.AUDIT_LOGS = {
        enabled: this.auditLogGroup != null,
        cloudWatchLogsLogGroupArn: this.auditLogGroup?.logGroupArn,
      };
    }

    let customEndpointCertificate: acm.ICertificate | undefined;
    if (props.customEndpoint) {
      if (props.customEndpoint.certificate) {
        customEndpointCertificate = props.customEndpoint.certificate;
      } else {
        customEndpointCertificate = new acm.Certificate(this, 'CustomEndpointCertificate', {
          domainName: props.customEndpoint.domainName,
          validation: props.customEndpoint.hostedZone ? acm.CertificateValidation.fromDns(props.customEndpoint.hostedZone) : undefined,
        });
      }
    }

    // Create the domain
    this.domain = new CfnDomain(this, 'Resource', {
      domainName: this.physicalName,
      engineVersion: props.version.version,
      clusterConfig: {
        dedicatedMasterEnabled,
        dedicatedMasterCount: dedicatedMasterEnabled
          ? dedicatedMasterCount
          : undefined,
        dedicatedMasterType: dedicatedMasterEnabled
          ? dedicatedMasterType
          : undefined,
        instanceCount,
        instanceType,
        warmEnabled: warmEnabled
          ? warmEnabled
          : undefined,
        warmCount: warmEnabled
          ? warmCount
          : undefined,
        warmType: warmEnabled
          ? warmType
          : undefined,
        zoneAwarenessEnabled,
        zoneAwarenessConfig: zoneAwarenessEnabled
          ? { availabilityZoneCount }
          : undefined,
      },
      ebsOptions: {
        ebsEnabled,
        volumeSize: ebsEnabled ? volumeSize : undefined,
        volumeType: ebsEnabled ? volumeType : undefined,
        iops: ebsEnabled ? props.ebs?.iops : undefined,
      },
      encryptionAtRestOptions: {
        enabled: encryptionAtRestEnabled,
        kmsKeyId: encryptionAtRestEnabled
          ? props.encryptionAtRest?.kmsKey?.keyId
          : undefined,
      },
      nodeToNodeEncryptionOptions: { enabled: nodeToNodeEncryptionEnabled },
      logPublishingOptions: logPublishing,
      cognitoOptions: props.cognitoDashboardsAuth ? {
        enabled: true,
        identityPoolId: props.cognitoDashboardsAuth?.identityPoolId,
        roleArn: props.cognitoDashboardsAuth?.role.roleArn,
        userPoolId: props.cognitoDashboardsAuth?.userPoolId,
      }: undefined,
      vpcOptions: cfnVpcOptions,
      snapshotOptions: props.automatedSnapshotStartHour
        ? { automatedSnapshotStartHour: props.automatedSnapshotStartHour }
        : undefined,
      domainEndpointOptions: {
        enforceHttps,
        tlsSecurityPolicy: props.tlsSecurityPolicy ?? TLSSecurityPolicy.TLS_1_0,
        ...props.customEndpoint && {
          customEndpointEnabled: true,
          customEndpoint: props.customEndpoint.domainName,
          customEndpointCertificateArn: customEndpointCertificate!.certificateArn,
        },
      },
      advancedSecurityOptions: advancedSecurityEnabled
        ? {
          enabled: true,
          internalUserDatabaseEnabled,
          masterUserOptions: {
            masterUserArn: masterUserArn,
            masterUserName: masterUserName,
            masterUserPassword: this.masterUserPassword?.unsafeUnwrap(), // Safe usage
          },
        }
        : undefined,
      advancedOptions: props.advancedOptions,
    });
    this.domain.applyRemovalPolicy(props.removalPolicy);

    if (props.enableVersionUpgrade) {
      this.domain.cfnOptions.updatePolicy = {
        ...this.domain.cfnOptions.updatePolicy,
        enableVersionUpgrade: props.enableVersionUpgrade,
      };
    }

    if (logGroupResourcePolicy) { this.domain.node.addDependency(logGroupResourcePolicy); }

    if (props.domainName) {
      if (!cdk.Token.isUnresolved(props.domainName)) {
        // https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname
        if (!props.domainName.match(/^[a-z0-9\-]+$/)) {
          throw new Error(`Invalid domainName '${props.domainName}'. Valid characters are a-z (lowercase only), 0-9, and – (hyphen).`);
        }
        if (props.domainName.length < 3 || props.domainName.length > 28) {
          throw new Error(`Invalid domainName '${props.domainName}'. It must be between 3 and 28 characters`);
        }
        if (props.domainName[0] < 'a' || props.domainName[0] > 'z') {
          throw new Error(`Invalid domainName '${props.domainName}'. It must start with a lowercase letter`);
        }
      }
      this.node.addMetadata('aws:cdk:hasPhysicalName', props.domainName);
    }

    this.domainName = this.getResourceNameAttribute(this.domain.ref);

    this.domainId = this.domain.getAtt('Id').toString();

    this.domainEndpoint = this.domain.getAtt('DomainEndpoint').toString();

    this.domainArn = this.getResourceArnAttribute(this.domain.attrArn, {
      service: 'es',
      resource: 'domain',
      resourceName: this.physicalName,
    });

    if (props.customEndpoint?.hostedZone) {
      new route53.CnameRecord(this, 'CnameRecord', {
        recordName: props.customEndpoint.domainName,
        zone: props.customEndpoint.hostedZone,
        domainName: this.domainEndpoint,
      });
    }

    this.encryptionAtRestOptions = props.encryptionAtRest;
    if (props.accessPolicies) {
      this.addAccessPolicies(...props.accessPolicies);
    }
    if (unsignedBasicAuthEnabled) {
      this.addAccessPolicies(unsignedAccessPolicy);
    }
  }

  /**
   * Manages network connections to the domain. This will throw an error in case the domain
   * is not placed inside a VPC.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new Error("Connections are only available on VPC enabled domains. Use the 'vpc' property to place a domain inside a VPC");
    }
    return this._connections;
  }


  /**
   * Add policy statements to the domain access policy
   */
  public addAccessPolicies(...accessPolicyStatements: iam.PolicyStatement[]) {
    if (accessPolicyStatements.length > 0) {
      if (!this.accessPolicy) {
        // Only create the custom resource after there are statements to set.
        this.accessPolicy = new OpenSearchAccessPolicy(this, 'AccessPolicy', {
          domainName: this.domainName,
          domainArn: this.domainArn,
          accessPolicies: accessPolicyStatements,
        });

        if (this.encryptionAtRestOptions?.kmsKey) {
          // https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html

          // these permissions are documented as required during domain creation.
          // while not strictly documented for updates as well, it stands to reason that an update
          // operation might require these in case the cluster uses a kms key.
          // empircal evidence shows this is indeed required: https://github.com/aws/aws-cdk/issues/11412
          this.accessPolicy.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['kms:List*', 'kms:Describe*', 'kms:CreateGrant'],
            resources: [this.encryptionAtRestOptions.kmsKey.keyArn],
            effect: iam.Effect.ALLOW,
          }));
        }
      } else {
        this.accessPolicy.addAccessPolicies(...accessPolicyStatements);
      }
    }
  }
}

/**
 * Given an Amazon OpenSearch Service domain endpoint, returns a CloudFormation expression that
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
 * @param domainEndpoint The Amazon OpenSearch Service domain endpoint
 */
function extractNameFromEndpoint(domainEndpoint: string) {
  const { hostname } = new URL(domainEndpoint);
  const domain = hostname.split('.')[0];
  const suffix = '-' + domain.split('-').slice(-1)[0];
  return domain.split(suffix)[0];
}

/**
 * Converts an engine version into a into a decimal number with major and minor version i.e x.y.
 *
 * @param version The engine version object
 */
function parseVersion(version: EngineVersion): { versionNum: number, isElasticsearchVersion: boolean } {
  const elasticsearchPrefix = 'Elasticsearch_';
  const openSearchPrefix = 'OpenSearch_';
  const isElasticsearchVersion = version.version.startsWith(elasticsearchPrefix);
  const versionStr = isElasticsearchVersion
    ? version.version.substring(elasticsearchPrefix.length)
    : version.version.substring(openSearchPrefix.length);
  const firstDot = versionStr.indexOf('.');

  if (firstDot < 1) {
    throw new Error(`Invalid engine version: ${versionStr}. Version string needs to start with major and minor version (x.y).`);
  }

  const secondDot = versionStr.indexOf('.', firstDot + 1);

  try {
    if (secondDot == -1) {
      return { versionNum: parseFloat(versionStr), isElasticsearchVersion };
    } else {
      return { versionNum: parseFloat(versionStr.substring(0, secondDot)), isElasticsearchVersion };
    }
  } catch {
    throw new Error(`Invalid engine version: ${versionStr}. Version string needs to start with major and minor version (x.y).`);
  }
}

function selectSubnets(vpc: ec2.IVpc, vpcSubnets: ec2.SubnetSelection[]): ec2.ISubnet[] {
  const selected = [];
  for (const selection of vpcSubnets) {
    selected.push(...vpc.selectSubnets(selection).subnets);
  }
  return selected;
}

/**
 * Check if any of the subnets are pending lookups. If so, the zone awareness check should be skipped, otherwise it will always throw an error
 *
 * @param vpc The vpc to which the subnets apply
 * @param vpcSubnets The vpc subnets that should be checked
 * @returns true if there are pending lookups for the subnets
 */
function zoneAwarenessCheckShouldBeSkipped(vpc: ec2.IVpc, vpcSubnets: ec2.SubnetSelection[]): boolean {
  for (const selection of vpcSubnets) {
    if (vpc.selectSubnets(selection).isPendingLookup) {
      return true;
    };
  }
  return false;
}

/**
 * Initializes an instance type.
 *
 * @param defaultInstanceType Default instance type which is used if no instance type is provided
 * @param instanceType Instance type
 * @returns Instance type in lowercase (if provided) or default instance type
 */
function initializeInstanceType(defaultInstanceType: string, instanceType?: string): string {
  if (instanceType) {
    return cdk.Token.isUnresolved(instanceType) ? instanceType : instanceType.toLowerCase();
  } else {
    return defaultInstanceType;
  }
}
