import ec2 = require('@aws-cdk/aws-ec2');
import lambda = require('@aws-cdk/aws-lambda');
import serverless = require('@aws-cdk/aws-sam');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { Construct } from '@aws-cdk/cdk';

/**
 * A secret rotation serverless application.
 */
export class SecretRotationApplication {
  public static readonly MariaDbRotationSingleUser = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationSingleUser', '1.0.57');
  public static readonly MariaDBRotationMultiUser = new SecretRotationApplication('SecretsManagerRDSMariaDBRotationMultiUser', '1.0.57');

  public static readonly MysqlRotationSingleUser = new SecretRotationApplication('SecretsManagerRDSMySQLRotationSingleUser', '1.0.85');
  public static readonly MysqlRotationMultiUser = new SecretRotationApplication('SecretsManagerRDSMySQLRotationMultiUser', '1.0.85');

  public static readonly OracleRotationSingleUser = new SecretRotationApplication('SecretsManagerRDSOracleRotationSingleUser', '1.0.56');
  public static readonly OracleRotationMultiUser = new SecretRotationApplication('SecretsManagerRDSOracleRotationMultiUser', '1.0.56');

  public static readonly PostgresRotationSingleUser = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationSingleUser', '1.0.86');
  public static readonly PostgreSQLRotationMultiUser  = new SecretRotationApplication('SecretsManagerRDSPostgreSQLRotationMultiUser ', '1.0.86');

  public static readonly SqlServerRotationSingleUser = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationSingleUser', '1.0.57');
  public static readonly SqlServerRotationMultiUser = new SecretRotationApplication('SecretsManagerRDSSQLServerRotationMultiUser', '1.0.57');

  public readonly applicationId: string;
  public readonly semanticVersion: string;

  constructor(applicationId: string, semanticVersion: string) {
    this.applicationId = `arn:aws:serverlessrepo:us-east-1:297356227824:applications/${applicationId}`;
    this.semanticVersion = semanticVersion;
  }
}

/**
 * Options to add secret rotation to a database instance or cluster.
 */
export interface SecretRotationOptions {
  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default 30 days
   */
  readonly automaticallyAfterDays?: number;
}

/**
 * Construction properties for a SecretRotation.
 */
export interface SecretRotationProps extends SecretRotationOptions {
  /**
   * The secret to rotate. It must be a JSON string with the following format:
   * {
   *   'engine': <required: database engine>,
   *   'host': <required: instance host name>,
   *   'username': <required: username>,
   *   'password': <required: password>,
   *   'dbname': <optional: database name>,
   *   'port': <optional: if not specified, default port will be used>,
   *   'masterarn': <required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>
   * }
   *
   * This is typically the case for a secret referenced from an AWS::SecretsManager::SecretTargetAttachment
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html
   */
  readonly secret: secretsmanager.ISecret;

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
   * @default - Private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The target database cluster or instance
   */
  readonly target: ec2.IConnectable;
}

/**
 * Secret rotation for a database instance or cluster.
 */
export class SecretRotation extends Construct {
  constructor(scope: Construct, id: string, props: SecretRotationProps) {
    super(scope, id);

    if (!props.target.connections.defaultPortRange) {
      throw new Error('The `target` connections must have a default port range.');
    }

    const rotationFunctionName = this.node.uniqueId;

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc
    });

    const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets);

    props.target.connections.allowDefaultPortFrom(securityGroup);

    const application = new serverless.CfnApplication(this, 'Resource', {
      location: props.application,
      parameters: {
        endpoint: `https://secretsmanager.${this.node.stack.region}.${this.node.stack.urlSuffix}`,
        functionName: rotationFunctionName,
        vpcSecurityGroupIds: securityGroup.securityGroupId,
        vpcSubnetIds: subnetIds.join(',')
      }
    });

    // Dummy import to reference this function in the rotation schedule
    const rotationLambda = lambda.Function.fromFunctionArn(this, 'RotationLambda', this.node.stack.formatArn({
      service: 'lambda',
      resource: 'function',
      sep: ':',
      resourceName: rotationFunctionName
    }));

    // Cannot use rotationLambda.addPermission because it's a no-op on imported
    // functions.
    const permission = new lambda.CfnPermission(this, 'Permission', {
      action: 'lambda:InvokeFunction',
      functionName: rotationFunctionName,
      principal: `secretsmanager.${this.node.stack.urlSuffix}`
    });
    permission.node.addDependency(application); // Add permission after application is deployed

    const rotationSchedule = props.secret.addRotationSchedule('RotationSchedule', {
      rotationLambda,
      automaticallyAfterDays: props.automaticallyAfterDays
    });
    rotationSchedule.node.addDependency(permission); // Cannot rotate without permission
  }
}
