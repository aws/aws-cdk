import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration } from '@aws-cdk/core';
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
export declare class SecretRotationApplication {
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the single user rotation scheme
     */
    static readonly MARIADB_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS MariaDB using the multi user rotation scheme
     */
    static readonly MARIADB_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the single user rotation scheme
     */
    static readonly MYSQL_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS MySQL using the multi user rotation scheme
     */
    static readonly MYSQL_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the single user rotation scheme
     */
    static readonly ORACLE_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS Oracle using the multi user rotation scheme
     */
    static readonly ORACLE_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the single user rotation scheme
     */
    static readonly POSTGRES_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS PostgreSQL using the multi user rotation scheme
     */
    static readonly POSTGRES_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the single user rotation scheme
     */
    static readonly SQLSERVER_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for RDS SQL Server using the multi user rotation scheme
     */
    static readonly SQLSERVER_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the single user rotation scheme
     */
    static readonly REDSHIFT_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for Amazon Redshift using the multi user rotation scheme
     */
    static readonly REDSHIFT_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for MongoDB using the single user rotation scheme
     */
    static readonly MONGODB_ROTATION_SINGLE_USER: SecretRotationApplication;
    /**
     * Conducts an AWS SecretsManager secret rotation for MongoDB using the multi user rotation scheme
     */
    static readonly MONGODB_ROTATION_MULTI_USER: SecretRotationApplication;
    /**
     * The application identifier of the rotation application
     *
     * @deprecated only valid when deploying to the 'aws' partition. Use `applicationArnForPartition` instead.
     */
    readonly applicationId: string;
    /**
     * The semantic version of the rotation application
     *
     * @deprecated only valid when deploying to the 'aws' partition. Use `semanticVersionForPartition` instead.
     */
    readonly semanticVersion: string;
    /**
     * Whether the rotation application uses the mutli user scheme
     */
    readonly isMultiUser?: boolean;
    /**
     * The application name of the rotation application
     */
    private readonly applicationName;
    constructor(applicationId: string, semanticVersion: string, options?: SecretRotationApplicationOptions);
    /**
     * Returns the application ARN for the current partition.
     * Can be used in combination with a `CfnMapping` to automatically select the correct ARN based on the current partition.
     */
    applicationArnForPartition(partition: string): string;
    /**
     * The semantic version of the app for the current partition.
     * Can be used in combination with a `CfnMapping` to automatically select the correct version based on the current partition.
     */
    semanticVersionForPartition(partition: string): string;
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
}
/**
 * Secret rotation for a service or database
 */
export declare class SecretRotation extends Construct {
    constructor(scope: Construct, id: string, props: SecretRotationProps);
}
