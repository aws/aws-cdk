import { Metric, MetricOptions, Statistic } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';

import { CfnDomain } from './elasticsearch.generated';
import { LogGroupResourcePolicy } from './log-group-resource-policy';

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
   *
   * @default - false
   */
  readonly slowSearchLogEnabed?: boolean;

  /**
   * Log slow searches to this log group.
   *
   * @default - a new log group is created if slow search logging is enabled
   */
  readonly slowSearchLogGroup?: logs.ILogGroup;

  /**
   * Specify if slow index logging should be set up.
   *
   * @default - false
   */
  readonly slowIndexLogEnabed?: boolean;

  /**
   * Log slow indecies to this log group.
   *
   * @default - a new log group is created if slow index logging is enabled
   */
  readonly slowIndexLogGroup?: logs.ILogGroup;

  /**
   * Specify if Elasticsearch application logging should be set up.
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
 * not update an existing one
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
   * The Elasticsearch Version
   *
   */
  readonly elasticsearchVersion: string;

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
   *
   * @default - Node to node encryption is not enabled.
   */
  readonly nodeToNodeEncryptionEnabled?: boolean;

  /**
   * The hour in UTC during which the service takes an automated daily snapshot
   * of the indices in the Amazon ES domain. Only applies for Elasticsearch
   * versions below 5.3.
   *
   * @default - Not used for Elasticsearch versions above 5.3.
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
   * Arn of the Elasticsearch table.
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
   * Return the given named metric for this Domain.
   */
  metric(metricName: string, clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for the time the cluster status is red.
   *
   * @default maximum over a minute
   */
  metricClusterStatusRed(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for the time the cluster status is yellow.
   *
   * @default maximum over a minute
   */
  metricClusterStatusYellow(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for the storage space of nodes in the cluster.
   *
   * @default minimum over a minute
   */
  metricFreeStorageSpace(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for the cluster blocking index writes.
   *
   * @default maximum over 5 minutes
   */
  metricClusterIndexWriteBlocked(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for the number of nodes.
   *
   * @default minimum over 1 hour
   */
  metricNodes(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for automated snapshot failures.
   *
   * @default maximum over a minute
   */
  metricAutomatedSnapshotFailure(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for CPU utilization.
   *
   * @default maximum over a minute
   */
  metricCPUUtilization(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for JVM memory pressure.
   *
   * @default maximum over a minute
   */
  metricJVMMemoryPressure(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for master CPU utilization.
   *
   * @default maximum over a minute
   */
  metricMasterCPUUtilization(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for master JVM memory pressure.
   *
   * @default maximum over a minute
   */
  metricMasterJVMMemoryPressure(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for KMS key errors.
   *
   * @default maximum over a minute
   */
  metricKMSKeyError(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for KMS key being inaccessible.
   *
   * @default maximum over a minute
   */
  metricKMSKeyInaccessible(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for number of searchable documents.
   *
   * @default maximum over a minute
   */
  metricSearchableDocuments(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for search latency.
   *
   * @default maximum over a minute
   */
  metricSearchLatency(clientId: string, props?: MetricOptions): Metric;

  /**
   * Metric for indexing latency.
   *
   * @default maximum over a minute
   */
  metricIndexingLatency(clientId: string, props?: MetricOptions): Metric;
}


/**
 * Provides an Elasticsearch domain.
 */
export class Domain extends cdk.Resource implements IDomain {
  private static createLogGroup(parent: cdk.Construct, domainName: string, id: string, name: string): logs.ILogGroup {
    return new logs.LogGroup(parent, id, {
      logGroupName: `elasticsearch/domains/${domainName}/${name}`,
      retention: logs.RetentionDays.ONE_MONTH,
    });
  }

  /**
   * @attribute
   */
  public readonly domainArn: string;

  /**
   * @attribute
   */
  public readonly domainName: string;

  /**
   * @attribute
   */
  public readonly domainEndpoint: string;


  private readonly domain: CfnDomain;

  private readonly slowSearchLogGroup?: logs.ILogGroup;

  private readonly slowIndexLogGroup?: logs.ILogGroup;

  private readonly appLogGroup?: logs.ILogGroup;

  constructor(scope: cdk.Construct, id: string, props: DomainProps) {
    super(scope, id, {
      physicalName: props.domainName,
    });

    this.domainName = this.physicalName;

    // Setup logging
    const logGroups: logs.ILogGroup[] = [];

    if (props.logPublishingOptions?.slowSearchLogEnabed) {
      this.slowSearchLogGroup = props.logPublishingOptions.slowSearchLogGroup ??
        Domain.createLogGroup(this, this.domainName, 'SlowSearchLogs', 'slow-search-logs');

      logGroups.push(this.slowSearchLogGroup);
    };

    if (props.logPublishingOptions?.slowIndexLogEnabed) {
      this.slowIndexLogGroup = props.logPublishingOptions.slowIndexLogGroup ??
        Domain.createLogGroup(this, this.domainName, 'SlowIndexLogs', 'slow-index-logs');

      logGroups.push(this.slowIndexLogGroup);
    };

    if (props.logPublishingOptions?.appLogEnabled) {
      this.appLogGroup = props.logPublishingOptions.appLogGroup ??
        Domain.createLogGroup(this, this.domainName, 'AppLogs', 'application-logs');

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

    // If VPC options are supplied ensure that the number of subnets matches the number AZ
    if (props.vpcOptions?.subnets.map((subnet) => subnet.availabilityZone).length != props?.clusterConfig.availabilityZoneCount) {
      throw new Error('When providing vpc options you need to provide a subnet for each AZ you are using');
    };

    let cfnVpcOptions: CfnDomain.VPCOptionsProperty | undefined;
    if (props.vpcOptions) {
      cfnVpcOptions = {
        securityGroupIds: props.vpcOptions.securityGroups.map((sg) => sg.securityGroupId),
        subnetIds: props.vpcOptions.subnets.map((subnet) => subnet.subnetId),
      };
    }

    // Create the domain
    this.domain = new CfnDomain(this, 'Resource', {
      domainName: this.physicalName,
      elasticsearchVersion: props.elasticsearchVersion,
      elasticsearchClusterConfig: {
        dedicatedMasterEnabled: props.clusterConfig.masterNodes != null,
        dedicatedMasterCount: props.clusterConfig.masterNodes,
        dedicatedMasterType: props.clusterConfig.masterNodeInstanceType,
        instanceCount: props.clusterConfig.dataNodes,
        instanceType: props.clusterConfig.dataNodeInstanceType,
        zoneAwarenessEnabled: props.clusterConfig.availabilityZoneCount != null,
        zoneAwarenessConfig: { availabilityZoneCount: props.clusterConfig.availabilityZoneCount },
      },
      ebsOptions: {
        ebsEnabled: props.ebsOptions != null,
        volumeSize: props.ebsOptions?.volumeSize,
        volumeType: props.ebsOptions?.volumeType,
        iops: props.ebsOptions?.iops,
      },
      encryptionAtRestOptions: {
        enabled: props.encryptionAtRestOptions?.enabled ?? (props.encryptionAtRestOptions?.kmsKey != null),
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
    });

    if (logGroupResourcePolicy) { this.domain.node.addDependency(logGroupResourcePolicy); }

    if (props.domainName) { this.node.addMetadata('aws:cdk:hasPhysicalName', props.domainName); }

    this.domainArn = this.getResourceArnAttribute(this.domain.attrArn, {
      service: 'es',
      resource: 'domain',
      resourceName: this.physicalName,
    });

    this.domainEndpoint = this.domain.getAtt('DomainEndpoint').toString();
  }

  /**
   * Return the given named metric for this Domain.
   */
  public metric(metricName: string, clientId: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/ES',
      metricName,
      dimensions: {
        DomainName: this.domainName,
        ClientId: clientId,
      },
      ...props,
    });
  }

  /**
   * Metric for the time the cluster status is red.
   *
   * @default maximum over a minute
   */
  public metricClusterStatusRed(clientId: string, props?: MetricOptions): Metric {
    return this.metric('ClusterStatus.red', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for the time the cluster status is yellow.
   *
   * @default maximum over a minute
   */
  public metricClusterStatusYellow(clientId: string, props?: MetricOptions): Metric {
    return this.metric('ClusterStatus.yellow', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for the storage space of nodes in the cluster.
   *
   * @default minimum over a minute
   */
  public metricFreeStorageSpace(clientId: string, props?: MetricOptions): Metric {
    return this.metric('FreeStorageSpace', clientId, { statistic: Statistic.MINIMUM, ...props });
  }

  /**
   * Metric for the cluster blocking index writes.
   *
   * @default maximum over 5 minutes
   */
  public metricClusterIndexWriteBlocked(clientId: string, props?: MetricOptions): Metric {
    return this.metric('ClusterIndexWriteBlocked', clientId, {
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
  public metricNodes(clientId: string, props?: MetricOptions): Metric {
    return this.metric('Nodes', clientId, {
      statistic: Statistic.MAXIMUM,
      period: cdk.Duration.hours(1),
      ...props,
    });
  }

  /**
   * Metric for automated snapshot failures.
   *
   * @default maximum over a minute
   */
  public metricAutomatedSnapshotFailure(clientId: string, props?: MetricOptions): Metric {
    return this.metric('AutomatedSnapshotFailure', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for CPU utilization.
   *
   * @default maximum over a minute
   */
  public metricCPUUtilization(clientId: string, props?: MetricOptions): Metric {
    return this.metric('CPUUtilization', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for JVM memory pressure.
   *
   * @default maximum over a minute
   */
  public metricJVMMemoryPressure(clientId: string, props?: MetricOptions): Metric {
    return this.metric('JVMMemoryPressure', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for master CPU utilization.
   *
   * @default maximum over a minute
   */
  public metricMasterCPUUtilization(clientId: string, props?: MetricOptions): Metric {
    return this.metric('MasterCPUUtilization', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for master JVM memory pressure.
   *
   * @default maximum over a minute
   */
  public metricMasterJVMMemoryPressure(clientId: string, props?: MetricOptions): Metric {
    return this.metric('MasterJVMMemoryPressure', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for KMS key errors.
   *
   * @default maximum over a minute
   */
  public metricKMSKeyError(clientId: string, props?: MetricOptions): Metric {
    return this.metric('KMSKeyError', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for KMS key being inaccessible.
   *
   * @default maximum over a minute
   */
  public metricKMSKeyInaccessible(clientId: string, props?: MetricOptions): Metric {
    return this.metric('KMSKeyInaccessible', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for number of searchable documents.
   *
   * @default maximum over a minute
   */
  public metricSearchableDocuments(clientId: string, props?: MetricOptions): Metric {
    return this.metric('SearchableDocuments', clientId, { statistic: Statistic.MAXIMUM, ...props });
  }

  /**
   * Metric for search latency.
   *
   * @default maximum over a minute
   */
  public metricSearchLatency(clientId: string, props?: MetricOptions): Metric {
    return this.metric('SearchLatencyP99', clientId, { statistic: 'p99', ...props });
  }

  /**
   * Metric for indexing latency.
   *
   * @default maximum over a minute
   */
  public metricIndexingLatency(clientId: string, props?: MetricOptions): Metric {
    return this.metric('IndexingLatencyP99', clientId, { statistic: 'p99', ...props });
  }
}
