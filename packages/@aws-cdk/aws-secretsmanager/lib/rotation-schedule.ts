import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ISecret } from './secret';
import { CfnRotationSchedule } from './secretsmanager.generated';

/**
 * Options to add a rotation schedule to a secret.
 */
export interface RotationScheduleOptions {
  /**
   * A Lambda function that can rotate the secret.
   *
   * @default - either `rotationLambda` or `hostedRotation` must be specified
   */
  readonly rotationLambda?: lambda.IFunction;

  /**
   * Hosted rotation
   *
   * @default - either `rotationLambda` or `hostedRotation` must be specified
   */
  readonly hostedRotation?: HostedRotation;

  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default Duration.days(30)
   */
  readonly automaticallyAfter?: Duration;
}

/**
 * Construction properties for a RotationSchedule.
 */
export interface RotationScheduleProps extends RotationScheduleOptions {
  /**
   * The secret to rotate.
   */
  readonly secret: ISecret;
}

/**
 * A rotation schedule.
 */
export class RotationSchedule extends Resource {
  constructor(scope: Construct, id: string, props: RotationScheduleProps) {
    super(scope, id);

    if (!props.rotationLambda && !props.hostedRotation) {
      throw new Error('Either `rotationLambda` or `hostedRotation` must be specified.');
    }

    new CfnRotationSchedule(this, 'Resource', {
      secretId: props.secret.secretArn,
      rotationLambdaArn: props.rotationLambda?.functionArn,
      hostedRotationLambda: props.hostedRotation?.bind(props.secret, this),
      rotationRules: {
        automaticallyAfterDays: props.automaticallyAfter && props.automaticallyAfter.toDays() || 30,
      },
    });

    // Prevent secrets deletions when rotation is in place
    props.secret.denyAccountRootDelete();
  }
}

/**
 * Single user hosted rotation options
 */
export interface SingleUserHostedRotationOptions {
  /**
   * A name for the Lambda created to rotate the secret
   *
   * @default - a CloudFormation generated name
   */
  readonly functionName?: string;

  /**
   * A list of security to groups for the Lambda created to rotate the secret
   *
   * @default - a new security group is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The VPC where the Lambda rotation function will run.
   *
   * @default - the Lambda is not deployed in a VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The type of subnets in the VPC where the Lambda rotation function will run.
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
}

/**
 * Multi user hosted rotation options
 */
export interface MultiUserHostedRotationOptions extends SingleUserHostedRotationOptions {
  /**
   * The master secret for a multi user rotation scheme
   */
  readonly masterSecret: ISecret;
}

/**
 * Properties for a hosted rotation
 */
export interface HostedRotationProps extends SingleUserHostedRotationOptions {
  /**
   * The type of hosted rotation
   */
  readonly type: HostedRotationType;

  /**
   * The master secret for a multi user rotation scheme
   *
   * @default - single user rotation scheme
   */
  readonly masterSecret?: ISecret;
}

/**
 * A hosted rotation
 */
export class HostedRotation implements ec2.IConnectable {
  /**
   * MySQL Single User
   */
  public static mysqlSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MYSQL_SINGLE_USER,
    });
  }

  /**
   * MySQL Multi User
   */
  public static mysqlMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MYSQL_MULTI_USER,
    });
  }

  /**
   * PostgreSQL Single User
   */
  public static postgreSqlSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.POSTGRESQL_SINGLE_USER,
    });
  }

  /**
   * PostgreSQL Multi User
   */
  public static postgreSqlMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.POSTGRESQL_MULTI_USER,
    });
  }

  /**
   * Oracle Single User
   */
  public static oracleSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.ORACLE_SINGLE_USER,
    });
  }

  /**
   * Oracle Multi User
   */
  public static oracleMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.ORACLE_MULTI_USER,
    });
  }

  /**
   * MariaDB Single User
   */
  public static mariaDbSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MARIADB_SINGLE_USER,
    });
  }

  /**
   * MariaDB Multi User
   */
  public static mariaDbMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MARIADB_MULTI_USER,
    });
  }

  /**
   * SQL Server Single User
   */
  public static sqlServerSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.SQLSERVER_SINGLE_USER,
    });
  }

  /**
   * SQL Server Multi User
   */
  public static sqlServerMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.SQLSERVER_MULTI_USER,
    });
  }

  /**
   * Redshift Single User
   */
  public static redshiftSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.REDSHIFT_SINGLE_USER,
    });
  }

  /**
   * Redshift Multi User
   */
  public static redshiftMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.REDSHIFT_MULTI_USER,
    });
  }

  /**
   * MongoDB Single User
   */
  public static mongoDbSingleUser(options: SingleUserHostedRotationOptions = {}) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MONGODB_SINGLE_USER,
    });
  }

  /**
   * MongoDB Multi User
   */
  public static mongoDbMultiUser(options: MultiUserHostedRotationOptions) {
    return new HostedRotation({
      ...options,
      type: HostedRotationType.MONGODB_MULTI_USER,
    });
  }

  private securityGroups?: ec2.ISecurityGroup[];

  constructor(private readonly props: HostedRotationProps) {
    if (props.type.isMultiUser && !props.masterSecret) {
      throw new Error('The `masterSecret` must be specified when using the multi user scheme.');
    }

    this.securityGroups = this.props.securityGroups;
  }

  /**
   * Binds this hosted rotation to a secret
   */
  public bind(secret: ISecret, scope: Construct): CfnRotationSchedule.HostedRotationLambdaProperty {
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html
    Stack.of(scope).addTransform('AWS::SecretsManager-2020-07-23');

    if (!this.props.vpc && this.props.securityGroups) {
      throw new Error('`vpc` must be specified when specifying `securityGroups`.');
    }

    if (this.props.vpc && !this.props.securityGroups) {
      this.securityGroups = [new ec2.SecurityGroup(scope, 'SecurityGroup', {
        vpc: this.props.vpc,
      })];
    }

    // Prevent master secret deletion when rotation is in place
    if (this.props.masterSecret) {
      this.props.masterSecret.denyAccountRootDelete();
    }

    return {
      rotationType: this.props.type.name,
      kmsKeyArn: secret.encryptionKey?.keyArn,
      masterSecretArn: this.props.masterSecret?.secretArn,
      masterSecretKmsKeyArn: this.props.masterSecret?.encryptionKey?.keyArn,
      rotationLambdaName: this.props.functionName,
      vpcSecurityGroupIds: this.securityGroups?.map(s => s.securityGroupId).join(','),
      vpcSubnetIds: this.props.vpc?.selectSubnets(this.props.vpcSubnets).subnetIds.join(','),
    };
  }

  /**
   * Security group connections for this hosted rotation
   */
  public get connections() {
    if (!this.props.vpc) {
      throw new Error('Cannot use connections for a hosted rotation that is not deployed in a VPC');
    }

    if (!this.securityGroups) {
      throw new Error('Cannot use connections for a hosted rotation that has not been bound to a secret');
    }

    return new ec2.Connections({ securityGroups: this.securityGroups });
  }
}

/**
 * Hosted rotation type
 */
export class HostedRotationType {
  /**
   * MySQL Single User
   */
  public static readonly MYSQL_SINGLE_USER = new HostedRotationType('MySQLSingleUser');

  /**
   * MySQL Multi User
   */
  public static readonly MYSQL_MULTI_USER = new HostedRotationType('MySQLMultiUser', true);

  /**
   * PostgreSQL Single User
   */
  public static readonly POSTGRESQL_SINGLE_USER = new HostedRotationType('PostgreSQLSingleUser');

  /**
   * PostgreSQL Multi User
   */
  public static readonly POSTGRESQL_MULTI_USER = new HostedRotationType('PostgreSQLMultiUser', true);

  /**
   * Oracle Single User
   */
  public static readonly ORACLE_SINGLE_USER = new HostedRotationType('OracleSingleUser');

  /**
   * Oracle Multi User
   */
  public static readonly ORACLE_MULTI_USER = new HostedRotationType('OracleMultiUser', true);

  /**
   * MariaDB Single User
   */
  public static readonly MARIADB_SINGLE_USER = new HostedRotationType('MariaDBSingleUser');

  /**
   * MariaDB Multi User
   */
  public static readonly MARIADB_MULTI_USER = new HostedRotationType('MariaDBMultiUser', true);

  /**
   * SQL Server Single User
   */
  public static readonly SQLSERVER_SINGLE_USER = new HostedRotationType('SQLServerSingleUser')

  /**
   * SQL Server Multi User
   */
  public static readonly SQLSERVER_MULTI_USER = new HostedRotationType('SQLServerMultiUser', true);

  /**
   * Redshift Single User
   */
  public static readonly REDSHIFT_SINGLE_USER = new HostedRotationType('RedshiftSingleUser')

  /**
   * Redshift Multi User
   */
  public static readonly REDSHIFT_MULTI_USER = new HostedRotationType('RedshiftMultiUser', true);

  /**
   * MongoDB Single User
   */
  public static readonly MONGODB_SINGLE_USER = new HostedRotationType('MongoDBSingleUser');

  /**
   * MongoDB Multi User
   */
  public static readonly MONGODB_MULTI_USER = new HostedRotationType('MongoDBMultiUser', true);

  /**
   * @param name The type of rotation
   * @param isMultiUser Whether the rotation uses the mutli user scheme
   */
  constructor(public readonly name: string, public readonly isMultiUser?: boolean) {}
}
