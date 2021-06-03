import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import * as serverless from '@aws-cdk/aws-sam';
import { Duration, Names, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ISecret } from './secret';

/**
 * Options for a SecretRotationApplication
 */
export interface SecretRotationApplicationOptions {
  /**
   * Whether the rotation application uses the mutli user scheme
   *
   * @default false
   */
  readonly isMultiUser?: boolean;
}
/**
 * A secret rotation serverless application.
 */
export class SecretRotationApplication {
  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the single user rotation scheme
   */
  public static readonly MARIADB_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the multi user rotation scheme
   */
  public static readonly MARIADB_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the single user rotation scheme
   */
  public static readonly MYSQL_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSMySQLRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the multi user rotation scheme
   */
  public static readonly MYSQL_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSMySQLRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the single user rotation scheme
   */
  public static readonly ORACLE_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSOracleRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the multi user rotation scheme
   */
  public static readonly ORACLE_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSOracleRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the single user rotation scheme
   */
  public static readonly POSTGRES_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the multi user rotation scheme
   */
  public static readonly POSTGRES_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the single user rotation scheme
   */
  public static readonly SQLSERVER_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the multi user rotation scheme
   */
  public static readonly SQLSERVER_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the single user rotation scheme
   */
  public static readonly REDSHIFT_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRedshiftRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the multi user rotation scheme
   */
  public static readonly REDSHIFT_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRedshiftRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for MongoDB using the single user rotation scheme
   */
  public static readonly MONGODB_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerMongoDBRotationSingleUser', '1.1.60');

  /**
   * Conducts an AWS SecretsManager secret rotation for MongoDB using the multi user rotation scheme
   */
  public static readonly MONGODB_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerMongoDBRotationMultiUser', '1.1.60', {
    isMultiUser: true,
  });

  /**
   * The application identifier of the rotation application
   */
  public readonly applicationId: string;

  /**
   * The semantic version of the rotation application
   */
  public readonly semanticVersion: string;

  /**
   * Whether the rotation application uses the mutli user scheme
   */
  public readonly isMultiUser?: boolean;

  constructor(applicationId: string, semanticVersion: string, options?: SecretRotationApplicationOptions) {
    this.applicationId = `arn:aws:serverlessrepo:us-east-1:297356227824:applications/${applicationId}`;
    this.semanticVersion = semanticVersion;
    this.isMultiUser = options && options.isMultiUser;
  }
}

/**
 * Construction properties for a SecretRotation.
 */
export interface SecretRotationProps {
  /**
   * The secret to rotate. It must be a JSON string with the following format:
   *
   * ```
   * {
   *   "engine": <required: database engine>,
   *   "host": <required: instance host name>,
   *   "username": <required: username>,
   *   "password": <required: password>,
   *   "dbname": <optional: database name>,
   *   "port": <optional: if not specified, default port will be used>,
   *   "masterarn": <required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>
   * }
   * ```
   *
   * This is typically the case for a secret referenced from an `AWS::SecretsManager::SecretTargetAttachment`
   * or an `ISecret` returned by the `attach()` method of `Secret`.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html
   */
  readonly secret: ISecret;

  /**
   * The master secret for a multi user rotation scheme
   *
   * @default - single user rotation scheme
   */
  readonly masterSecret?: ISecret;

  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default Duration.days(30)
   */
  readonly automaticallyAfter?: Duration;

  /**
   * The serverless application for the rotation.
   */
  readonly application: SecretRotationApplication;

  /**
   * The VPC where the Lambda rotation function will run.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The type of subnets in the VPC where the Lambda rotation function will run.
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The target service or database
   */
  readonly target: ec2.IConnectable;

  /**
   * The security group for the Lambda rotation function
   *
   * @default - a new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Characters which should not appear in the generated password
   *
   * @default - no additional characters are explicitly excluded
   */
  readonly excludeCharacters?: string;
}

/**
 * Secret rotation for a service or database
 */
export class SecretRotation extends Construct {
  constructor(scope: Construct, id: string, props: SecretRotationProps) {
    super(scope, id);

    if (!props.target.connections.defaultPort) {
      throw new Error('The `target` connections must have a default port range.');
    }

    if (props.application.isMultiUser && !props.masterSecret) {
      throw new Error('The `masterSecret` must be specified for application using the multi user scheme.');
    }

    // Max length of 64 chars, get the last 64 chars
    const uniqueId = Names.uniqueId(this);
    const rotationFunctionName = uniqueId.substring(Math.max(uniqueId.length - 64, 0), uniqueId.length);

    const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
    });
    props.target.connections.allowDefaultPortFrom(securityGroup);

    const parameters: { [key: string]: string } = {
      endpoint: `https://secretsmanager.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`,
      functionName: rotationFunctionName,
      vpcSubnetIds: props.vpc.selectSubnets(props.vpcSubnets).subnetIds.join(','),
      vpcSecurityGroupIds: securityGroup.securityGroupId,
    };

    if (props.excludeCharacters !== undefined) {
      parameters.excludeCharacters = props.excludeCharacters;
    }

    if (props.secret.encryptionKey) {
      parameters.kmsKeyArn = props.secret.encryptionKey.keyArn;
    }

    if (props.masterSecret) {
      parameters.masterSecretArn = props.masterSecret.secretArn;

      if (props.masterSecret.encryptionKey) {
        parameters.masterSecretKmsKeyArn = props.masterSecret.encryptionKey.keyArn;
      }
    }

    const application = new serverless.CfnApplication(this, 'Resource', {
      location: props.application,
      parameters,
    });

    // This creates a CF a dependency between the rotation schedule and the
    // serverless application. This is needed because it's the application
    // that creates the Lambda permission to invoke the function.
    // See https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_cloudformation.html
    const rotationLambda = lambda.Function.fromFunctionArn(this, 'RotationLambda', Token.asString(application.getAtt('Outputs.RotationLambdaARN')));

    props.secret.addRotationSchedule('RotationSchedule', {
      rotationLambda,
      automaticallyAfter: props.automaticallyAfter,
    });

    // Prevent master secret deletion when rotation is in place
    if (props.masterSecret) {
      props.masterSecret.denyAccountRootDelete();
    }
  }
}
