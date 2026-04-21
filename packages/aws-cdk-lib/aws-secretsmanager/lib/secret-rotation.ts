import { Construct } from 'constructs';
import type { ISecret } from './secret';
import * as ec2 from '../../aws-ec2';
import * as lambda from '../../aws-lambda';
import * as serverless from '../../aws-sam';
import type { Duration } from '../../core';
import { Names, Stack, CfnMapping, Aws, RemovalPolicy, ValidationError, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * A secret rotation serverless application.
 */
export class SecretRotationApplication {
  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the single user rotation scheme
   */
  public static readonly MARIADB_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationSingleUser', {
    'aws': '1.1.649',
    'aws-cn': '1.1.423',
    'aws-us-gov': '1.1.399',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the multi user rotation scheme
   */
  public static readonly MARIADB_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationMultiUser', {
    'aws': '1.1.649',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the single user rotation scheme
   */
  public static readonly MYSQL_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSMySQLRotationSingleUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the multi user rotation scheme
   */
  public static readonly MYSQL_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSMySQLRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the single user rotation scheme
   */
  public static readonly ORACLE_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSOracleRotationSingleUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the multi user rotation scheme
   */
  public static readonly ORACLE_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSOracleRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the single user rotation scheme
   */
  public static readonly POSTGRES_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationSingleUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the multi user rotation scheme
   */
  public static readonly POSTGRES_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the single user rotation scheme
   */
  public static readonly SQLSERVER_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationSingleUser', {
    'aws': '1.1.649',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the multi user rotation scheme
   */
  public static readonly SQLSERVER_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the single user rotation scheme
   */
  public static readonly REDSHIFT_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRedshiftRotationSingleUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the multi user rotation scheme
   */
  public static readonly REDSHIFT_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRedshiftRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for MongoDB using the single user rotation scheme
   */
  public static readonly MONGODB_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerMongoDBRotationSingleUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.421',
    'aws-us-gov': '1.1.397',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for MongoDB using the multi user rotation scheme
   */
  public static readonly MONGODB_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerMongoDBRotationMultiUser', {
    'aws': '1.1.650',
    'aws-cn': '1.1.422',
    'aws-us-gov': '1.1.398',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Db2 using the single user rotation scheme
   */
  public static readonly DB2_ROTATION_SINGLE_USER = new SecretRotationApplication('SecretsManagerRDSDb2RotationSingleUser', {
    'aws': '1.1.250',
    'aws-cn': '1.1.223',
    'aws-us-gov': '1.1.199',
  });

  /**
   * Conducts an AWS SecretsManager secret rotation for RDS Db2 using the multi user rotation scheme
   */
  public static readonly DB2_ROTATION_MULTI_USER = new SecretRotationApplication('SecretsManagerRDSDb2RotationMultiUser', {
    'aws': '1.1.251',
    'aws-cn': '1.1.221',
    'aws-us-gov': '1.1.197',
  });

  /**
   * The application identifier of the rotation application
   *
   * @deprecated only valid when deploying to the 'aws' partition. Use `applicationArnForPartition` instead.
   */
  public readonly applicationId: string;

  /**
   * The semantic version of the rotation application
   *
   * @deprecated only valid when deploying to the 'aws' partition. Use `semanticVersionForPartition` instead.
   */
  public readonly semanticVersion: string;

  /**
   * Whether the rotation application uses the mutli user scheme
   */
  public readonly isMultiUser?: boolean;

  /**
   * The application name of the rotation application
   */
  private readonly applicationName: string;

  private readonly partitionalSematicVersions: { [partition: string]: string };

  /**
   * @param applicationName - The name of the rotation application
   * @param semanticVersions - Per-partition semantic versions
   */
  constructor(applicationName: string, semanticVersions: { [partition: string]: string }) {
    this.applicationName = applicationName;
    this.isMultiUser = applicationName.endsWith('MultiUser');
    if (!this.isMultiUser && !applicationName.endsWith('SingleUser')) {
      throw new UnscopedValidationError(lit`InvalidApplicationId`, `applicationName must end with 'SingleUser' or 'MultiUser': ${applicationName}`);
    }
    this.partitionalSematicVersions = semanticVersions;

    // Constants that are stored for backwards compatibility
    this.semanticVersion = this.semanticVersionForPartition('aws');
    this.applicationId = this.applicationArnForPartition('aws');
  }

  /**
   * Returns the application ARN for the current partition.
   * Can be used in combination with a `CfnMapping` to automatically select the correct ARN based on the current partition.
   */
  public applicationArnForPartition(partition: string) {
    if (partition === 'aws') {
      // eslint-disable-next-line @cdklabs/no-literal-partition
      return `arn:aws:serverlessrepo:us-east-1:297356227824:applications/${this.applicationName}`;
    } else if (partition === 'aws-cn') {
      return `arn:aws-cn:serverlessrepo:cn-north-1:193023089310:applications/${this.applicationName}`;
    } else if (partition === 'aws-us-gov') {
      return `arn:aws-us-gov:serverlessrepo:us-gov-west-1:023102451235:applications/${this.applicationName}`;
    } else {
      throw new UnscopedValidationError(lit`UnsupportedPartition`, `unsupported partition: ${partition}`);
    }
  }

  /**
   * The semantic version of the app for the current partition.
   * Can be used in combination with a `CfnMapping` to automatically select the correct version based on the current partition.
   */
  public semanticVersionForPartition(partition: string) {
    if (this.partitionalSematicVersions.hasOwnProperty(partition)) {
      return this.partitionalSematicVersions[partition];
    } else {
      throw new UnscopedValidationError(lit`UnsupportedPartition`, `unsupported partition: ${partition}`);
    }
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

  /**
   * The VPC interface endpoint to use for the Secrets Manager API
   *
   * If you enable private DNS hostnames for your VPC private endpoint (the default), you don't
   * need to specify an endpoint. The standard Secrets Manager DNS hostname the Secrets Manager
   * CLI and SDKs use by default (https://secretsmanager.<region>.amazonaws.com) automatically
   * resolves to your VPC endpoint.
   *
   * @default https://secretsmanager.<region>.amazonaws.com
   */
  readonly endpoint?: ec2.IInterfaceVpcEndpoint;

  /**
   * Specifies whether to rotate the secret immediately or wait until the next
   * scheduled rotation window.
   *
   * @default true
   */
  readonly rotateImmediatelyOnUpdate?: boolean;
}

/**
 * Secret rotation for a service or database
 */
export class SecretRotation extends Construct {
  constructor(scope: Construct, id: string, props: SecretRotationProps) {
    super(scope, id);

    if (!props.target.connections.defaultPort) {
      throw new ValidationError(lit`ConnectionsDefaultPortRange`, 'The `target` connections must have a default port range.', this);
    }

    if (props.application.isMultiUser && !props.masterSecret) {
      throw new ValidationError(lit`MustBeSpecifiedApplicationUsing`, 'The `masterSecret` must be specified for application using the multi user scheme.', this);
    }

    // Max length of 64 chars, get the last 64 chars
    const uniqueId = Names.uniqueId(this);
    const rotationFunctionName = uniqueId.substring(Math.max(uniqueId.length - 64, 0), uniqueId.length);

    const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
    });
    props.target.connections.allowDefaultPortFrom(securityGroup);

    const parameters: { [key: string]: string } = {
      endpoint: `https://${props.endpoint ? `${props.endpoint.vpcEndpointId}.` : ''}secretsmanager.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`,
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

    const sarMapping = new CfnMapping(this, 'SARMapping', {
      mapping: {
        'aws': {
          applicationId: props.application.applicationArnForPartition('aws'),
          semanticVersion: props.application.semanticVersionForPartition('aws'),
        },
        'aws-cn': {
          applicationId: props.application.applicationArnForPartition('aws-cn'),
          semanticVersion: props.application.semanticVersionForPartition('aws-cn'),
        },
        'aws-us-gov': {
          applicationId: props.application.applicationArnForPartition('aws-us-gov'),
          semanticVersion: props.application.semanticVersionForPartition('aws-us-gov'),
        },
      },
    });
    const application = new serverless.CfnApplication(this, 'Resource', {
      location: {
        applicationId: sarMapping.findInMap(Aws.PARTITION, 'applicationId'),
        semanticVersion: sarMapping.findInMap(Aws.PARTITION, 'semanticVersion'),
      },
      parameters,
    });
    application.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // This creates a CF a dependency between the rotation schedule and the
    // serverless application. This is needed because it's the application
    // that creates the Lambda permission to invoke the function.
    // See https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_cloudformation.html
    const rotationLambda = lambda.Function.fromFunctionArn(this, 'RotationLambda', application.getAtt('Outputs.RotationLambdaARN').toString());

    props.secret.addRotationSchedule('RotationSchedule', {
      rotationLambda,
      automaticallyAfter: props.automaticallyAfter,
      rotateImmediatelyOnUpdate: props.rotateImmediatelyOnUpdate,
    });

    // Prevent master secret deletion when rotation is in place
    if (props.masterSecret) {
      props.masterSecret.denyAccountRootDelete();
    }
  }
}
