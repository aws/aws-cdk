import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Resource } from '@aws-cdk/core';
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
     * A value of zero will disable automatic rotation - `Duration.days(0)`.
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
     *
     * If hosted rotation is used, this must be a JSON string with the following format:
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
     */
    readonly secret: ISecret;
}
/**
 * A rotation schedule.
 */
export declare class RotationSchedule extends Resource {
    constructor(scope: Construct, id: string, props: RotationScheduleProps);
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
     * A list of security groups for the Lambda created to rotate the secret
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
    /**
     * A string of the characters that you don't want in the password
     *
     * @default the same exclude characters as the ones used for the
     * secret or " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
     */
    readonly excludeCharacters?: string;
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
 * A hosted rotation
 */
export declare class HostedRotation implements ec2.IConnectable {
    private readonly type;
    private readonly props;
    private readonly masterSecret?;
    /** MySQL Single User */
    static mysqlSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** MySQL Multi User */
    static mysqlMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** PostgreSQL Single User */
    static postgreSqlSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** PostgreSQL Multi User */
    static postgreSqlMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** Oracle Single User */
    static oracleSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** Oracle Multi User */
    static oracleMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** MariaDB Single User */
    static mariaDbSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** MariaDB Multi User */
    static mariaDbMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** SQL Server Single User */
    static sqlServerSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** SQL Server Multi User */
    static sqlServerMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** Redshift Single User */
    static redshiftSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** Redshift Multi User */
    static redshiftMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    /** MongoDB Single User */
    static mongoDbSingleUser(options?: SingleUserHostedRotationOptions): HostedRotation;
    /** MongoDB Multi User */
    static mongoDbMultiUser(options: MultiUserHostedRotationOptions): HostedRotation;
    private _connections?;
    private constructor();
    /**
     * Binds this hosted rotation to a secret
     */
    bind(secret: ISecret, scope: Construct): CfnRotationSchedule.HostedRotationLambdaProperty;
    /**
     * Security group connections for this hosted rotation
     */
    get connections(): ec2.Connections;
}
/**
 * Hosted rotation type
 */
export declare class HostedRotationType {
    readonly name: string;
    readonly isMultiUser?: boolean | undefined;
    /** MySQL Single User */
    static readonly MYSQL_SINGLE_USER: HostedRotationType;
    /** MySQL Multi User */
    static readonly MYSQL_MULTI_USER: HostedRotationType;
    /** PostgreSQL Single User */
    static readonly POSTGRESQL_SINGLE_USER: HostedRotationType;
    /** PostgreSQL Multi User */
    static readonly POSTGRESQL_MULTI_USER: HostedRotationType;
    /** Oracle Single User */
    static readonly ORACLE_SINGLE_USER: HostedRotationType;
    /** Oracle Multi User */
    static readonly ORACLE_MULTI_USER: HostedRotationType;
    /** MariaDB Single User */
    static readonly MARIADB_SINGLE_USER: HostedRotationType;
    /** MariaDB Multi User */
    static readonly MARIADB_MULTI_USER: HostedRotationType;
    /** SQL Server Single User */
    static readonly SQLSERVER_SINGLE_USER: HostedRotationType;
    /** SQL Server Multi User */
    static readonly SQLSERVER_MULTI_USER: HostedRotationType;
    /** Redshift Single User */
    static readonly REDSHIFT_SINGLE_USER: HostedRotationType;
    /** Redshift Multi User */
    static readonly REDSHIFT_MULTI_USER: HostedRotationType;
    /** MongoDB Single User */
    static readonly MONGODB_SINGLE_USER: HostedRotationType;
    /** MongoDB Multi User */
    static readonly MONGODB_MULTI_USER: HostedRotationType;
    /**
     * @param name The type of rotation
     * @param isMultiUser Whether the rotation uses the mutli user scheme
     */
    private constructor();
}
