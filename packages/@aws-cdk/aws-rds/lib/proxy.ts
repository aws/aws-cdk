import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { IDatabaseCluster } from './cluster-ref';
import { IDatabaseInstance } from './instance';
import { CfnDBProxy, CfnDBProxyTargetGroup } from './rds.generated';

/**
 * The kinds of databases that the proxy can connect to.
 * This value determines which database network protocol the proxy recognizes when it interprets network traffic to
 * and from the database.
 * The engine family applies to MySQL and PostgreSQL for both RDS and Aurora.
 */
export enum ProxyEngineFamily {
  /**
   * MYSQL
   */
  MYSQL = 'MYSQL',

  /**
   * POSTGRESQL
   */
  POSTGRESQL = 'POSTGRESQL',
}

/**
 * SessionPinningFilter
 *
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html#rds-proxy-pinning
 */
export enum SessionPinningFilter {
  /**
   * You can opt out of session pinning for the following kinds of application statements:
   *
   * - Setting session variables and configuration settings.
   */
  EXCLUDE_VARIABLE_SETS = 'EXCLUDE_VARIABLE_SETS'
}

/**
 * Specifies the settings that control the size and behavior of the connection pool.
 */
export interface ProxyConnectionPool {
  /**
   * The duration for a proxy to wait for a connection to become available in the connection pool.
   * Only applies when the proxy has opened its maximum number of connections and all connections are busy with client
   * sessions.
   *
   * Value must be between 1 second and 1 hour, or `Duration.seconds(0)` to represent unlimited.
   *
   * @default cdk.Duration.seconds(120)
   */
  readonly borrowTimeout?: cdk.Duration;

  /**
   * One or more SQL statements for the proxy to run when opening each new database connection.
   * Typically used with SET statements to make sure that each connection has identical settings such as time zone
   * and character set.
   * For multiple statements, use semicolons as the separator.
   * You can also include multiple variables in a single SET statement, such as SET x=1, y=2.
   *
   * not currently supported for PostgreSQL.
   *
   * @default - no initialization query
   */
  readonly initQuery?: string;

  /**
   * The maximum size of the connection pool for each target in a target group.
   * For Aurora MySQL, it is expressed as a percentage of the max_connections setting for the RDS DB instance or Aurora DB
   * cluster used by the target group.
   *
   * 1-100
   *
   * @default 100
   */
  readonly maxConnectionsPercent?: number;

  /**
   * Controls how actively the proxy closes idle database connections in the connection pool.
   * A high value enables the proxy to leave a high percentage of idle connections open.
   * A low value causes the proxy to close idle client connections and return the underlying database connections
   * to the connection pool.
   * For Aurora MySQL, it is expressed as a percentage of the max_connections setting for the RDS DB instance
   * or Aurora DB cluster used by the target group.
   *
   * between 0 and MaxConnectionsPercent
   *
   * @default 50
   */
  readonly maxIdleConnectionsPercent?: number;

  /**
   * Each item in the list represents a class of SQL operations that normally cause all later statements in a session
   * using a proxy to be pinned to the same underlying database connection.
   * Including an item in the list exempts that class of SQL operations from the pinning behavior.
   *
   * @default - no session pinning filters
   */
  readonly sessionPinningFilters?: SessionPinningFilter[];
}

/**
 * Proxy target: Instance or Cluster
 *
 * A target group is a collection of databases that the proxy can connect to.
 * Currently, you can specify only one RDS DB instance or Aurora DB cluster.
 */
export class ProxyTarget {
  /**
   * From instance
   *
   * @param instance RDS database instance
   */
  public static fromInstance(instance: IDatabaseInstance): ProxyTarget {
    return new ProxyTarget([instance.instanceIdentifier]);
  }

  /**
   * From cluster
   *
   * @param cluster RDS database cluster
   */
  public static fromCluster(cluster: IDatabaseCluster): ProxyTarget {
    return new ProxyTarget(cluster.instanceIdentifiers, [cluster.clusterIdentifier]);
  }

  private constructor(
    /**
     * One or more DB instance identifiers.
     */
    public readonly dbInstanceIdentifiers: string[],

    /**
     * One or more DB cluster identifiers.
     *
     * @default undefined
     */
    public readonly dbClusterIdentifiers?: string[],
  ) {}
}

/**
 * Options for a new DatabaseProxy
 */
export interface DatabaseProxyOptions {
  /**
   * The identifier for the proxy.
   * This name must be unique for all proxies owned by your AWS account in the specified AWS Region.
   * An identifier must begin with a letter and must contain only ASCII letters, digits, and hyphens;
   * it can't end with a hyphen or contain two consecutive hyphens.
   *
   * @default - Generated by CloudFormation (recommended)
   */
  readonly dbProxyName?: string;

  /**
   * Specifies the settings that control the size and behavior of the connection pool.
   *
   * @default - default
   */
  readonly connectionPool?: ProxyConnectionPool;

  /**
   * Whether the proxy includes detailed information about SQL statements in its logs.
   * This information helps you to debug issues involving SQL behavior or the performance and scalability of the proxy connections.
   * The debug information includes the text of SQL statements that you submit through the proxy.
   * Thus, only enable this setting when needed for debugging, and only when you have security measures in place to safeguard any sensitive
   * information that appears in the logs.
   *
   * @default false
   */
  readonly debugLogging?: boolean;

  /**
   * Whether to require or disallow AWS Identity and Access Management (IAM) authentication for connections to the proxy.
   *
   * @default false
   */
  readonly iamAuth?: boolean;

  /**
   * The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it.
   * You can set this value higher or lower than the connection timeout limit for the associated database.
   *
   * @default cdk.Duration.minutes(30)
   */
  readonly idleClientTimeout?: cdk.Duration;

  /**
   * The kinds of databases that the proxy can connect to.
   * This value determines which database network protocol the proxy recognizes when it interprets network traffic to
   * and from the database.
   * The engine family applies to MySQL and PostgreSQL for both RDS and Aurora.
   */
  readonly engineFamily: ProxyEngineFamily;

  /**
   * A Boolean parameter that specifies whether Transport Layer Security (TLS) encryption is required for connections to the proxy.
   * By enabling this setting, you can enforce encrypted TLS connections to the proxy.
   *
   * @default false
   */
  readonly requireTLS?: boolean;

  /**
   * The secret that the proxy uses to authenticate to the RDS DB instance or Aurora DB cluster.
   * These secrets are stored within Amazon Secrets Manager.
   *
   * @default - no secret
   */
  readonly secret: secretsmanager.ISecret;

  /**
   * One or more VPC security groups to associate with the new proxy.
   *
   * @default - No security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The subnets used by the proxy.
   *
   * @default - the VPC default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The VPC to associate with the new proxy.
   */
  readonly vpc: ec2.IVpc;
}

/**
 * Construction properties for a DatabaseProxy
 */
export interface DatabaseProxyProps extends DatabaseProxyOptions {
  /**
   * DB proxy target: Instance or Cluster
   */
  readonly proxyTarget: ProxyTarget
}

/**
 * Properties that describe an existing DB Proxy
 */
export interface DatabaseProxyAttributes {
  /**
   * DB Proxy Name
   */
  readonly dbProxyName: string;

  /**
   * DB Proxy ARN
   */
  readonly dbProxyArn: string;

  /**
   * Endpoint
   */
  readonly endpoint: string;

  /**
   * The security groups of the instance.
   */
  readonly securityGroups: ec2.ISecurityGroup[];
}

/**
 * DB Proxy
 */
export interface IDatabaseProxy extends cdk.IResource {
  /**
   * DB Proxy Name
   *
   * @attribute
   */
  readonly dbProxyName: string;

  /**
   * DB Proxy ARN
   *
   * @attribute
   */
  readonly dbProxyArn: string;

  /**
   * Endpoint
   *
   * @attribute
   */
  readonly endpoint: string;
}

/**
 * RDS Database Proxy
 *
 * @resource AWS::RDS::DBProxy
 */
export class DatabaseProxy extends cdk.Resource
  implements IDatabaseProxy, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * Import an existing database proxy.
   */
  public static fromDatabaseProxyAttributes(
    scope: cdk.Construct,
    id: string,
    attrs: DatabaseProxyAttributes,
  ): IDatabaseProxy {
    class Import extends cdk.Resource implements IDatabaseProxy {
      public readonly dbProxyName = attrs.dbProxyName;
      public readonly dbProxyArn = attrs.dbProxyArn;
      public readonly endpoint = attrs.endpoint;
    }
    return new Import(scope, id);
  }

  /**
   * DB Proxy Name
   *
   * @attribute
   */
  public readonly dbProxyName: string;

  /**
   * DB Proxy ARN
   *
   * @attribute
   */
  public readonly dbProxyArn: string;

  /**
   * Endpoint
   *
   * @attribute
   */
  public readonly endpoint: string;

  /**
   * Access to network connections.
   */
  public readonly connections: ec2.Connections;

  protected readonly resource: CfnDBProxy;

  constructor(scope: cdk.Construct, id: string, props: DatabaseProxyProps) {
    super(scope, id, { physicalName: props.dbProxyName || id });

    const role = new iam.Role(this, 'IAMRole', {
      assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
      inlinePolicies: {
        0: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                'secretsmanager:DescribeSecret',
                'secretsmanager:ListSecretVersionIds',
                'secretsmanager:GetResourcePolicy',
                'secretsmanager:GetSecretValue',
              ],
              resources: [props.secret.secretArn],
            }),
          ],
        }),
      },
    });

    this.connections = new ec2.Connections({ securityGroups: props.securityGroups });

    this.resource = new CfnDBProxy(this, 'Resource', {
      auth: [
        {
          authScheme: 'SECRETS',
          iamAuth: props.iamAuth ? 'REQUIRED' : 'DISABLED',
          secretArn: props.secret.secretArn,
        },
      ],
      dbProxyName: this.physicalName,
      debugLogging: props.debugLogging,
      engineFamily: props.engineFamily,
      idleClientTimeout: props.idleClientTimeout?.toSeconds(),
      requireTls: props.requireTLS,
      roleArn: role.roleArn,
      vpcSecurityGroupIds: props.securityGroups?.map(_ => _.securityGroupId),
      vpcSubnetIds: props.vpc.selectSubnets(props.vpcSubnets).subnetIds,
    });

    this.dbProxyName = this.resource.ref;
    this.dbProxyArn = this.resource.attrDbProxyArn;
    this.endpoint = this.resource.attrEndpoint;

    const { dbInstanceIdentifiers, dbClusterIdentifiers } = props.proxyTarget;
    new CfnDBProxyTargetGroup(this, 'ProxyTargetGroup', {
      dbProxyName: this.dbProxyName,
      dbInstanceIdentifiers,
      dbClusterIdentifiers,
      connectionPoolConfigurationInfo: toConnectionPoolConfigurationInfo(props.connectionPool),
    });
  }

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.dbProxyName,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_PROXY,
    };
  }
}

/**
 * ConnectionPoolConfiguration (L2 => L1)
 */
function toConnectionPoolConfigurationInfo(
  config?: ProxyConnectionPool,
): undefined | CfnDBProxyTargetGroup.ConnectionPoolConfigurationInfoFormatProperty {
  if (!config) {
    return undefined;
  }
  return {
    connectionBorrowTimeout: config.borrowTimeout?.toSeconds(),
    initQuery: config.initQuery,
    maxConnectionsPercent: config.maxConnectionsPercent,
    maxIdleConnectionsPercent: config.maxIdleConnectionsPercent,
    sessionPinningFilters: config.sessionPinningFilters,
  };
}
