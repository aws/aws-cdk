"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostedRotationType = exports.HostedRotation = exports.RotationSchedule = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const secret_1 = require("./secret");
const secretsmanager_generated_1 = require("./secretsmanager.generated");
/**
 * The default set of characters we exclude from generated passwords for database users.
 * It's a combination of characters that have a tendency to cause problems in shell scripts,
 * some engine-specific characters (for example, Oracle doesn't like '@' in its passwords),
 * and some that trip up other services, like DMS.
 */
const DEFAULT_PASSWORD_EXCLUDE_CHARS = " %+~`#$&*()|[]{}:;<>?!'/@\"\\";
/**
 * A rotation schedule.
 */
class RotationSchedule extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_RotationScheduleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RotationSchedule);
            }
            throw error;
        }
        if ((!props.rotationLambda && !props.hostedRotation) || (props.rotationLambda && props.hostedRotation)) {
            throw new Error('One of `rotationLambda` or `hostedRotation` must be specified.');
        }
        if (props.rotationLambda?.permissionsNode.defaultChild) {
            if (props.secret.encryptionKey) {
                props.secret.encryptionKey.grantEncryptDecrypt(new kms.ViaServicePrincipal(`secretsmanager.${core_1.Stack.of(this).region}.amazonaws.com`, props.rotationLambda.grantPrincipal));
            }
            props.rotationLambda.grantInvoke(new iam.ServicePrincipal('secretsmanager.amazonaws.com'));
            props.rotationLambda.addToRolePolicy(new iam.PolicyStatement({
                actions: [
                    'secretsmanager:DescribeSecret',
                    'secretsmanager:GetSecretValue',
                    'secretsmanager:PutSecretValue',
                    'secretsmanager:UpdateSecretVersionStage',
                ],
                resources: [props.secret.secretFullArn ? props.secret.secretFullArn : `${props.secret.secretArn}-??????`],
            }));
            props.rotationLambda.addToRolePolicy(new iam.PolicyStatement({
                actions: [
                    'secretsmanager:GetRandomPassword',
                ],
                resources: ['*'],
            }));
        }
        let automaticallyAfterDays = undefined;
        if (props.automaticallyAfter?.toMilliseconds() !== 0) {
            automaticallyAfterDays = props.automaticallyAfter?.toDays() || 30;
        }
        let rotationRules = undefined;
        if (automaticallyAfterDays !== undefined) {
            rotationRules = {
                automaticallyAfterDays,
            };
        }
        new secretsmanager_generated_1.CfnRotationSchedule(this, 'Resource', {
            secretId: props.secret.secretArn,
            rotationLambdaArn: props.rotationLambda?.functionArn,
            hostedRotationLambda: props.hostedRotation?.bind(props.secret, this),
            rotationRules,
        });
        // Prevent secrets deletions when rotation is in place
        props.secret.denyAccountRootDelete();
    }
}
exports.RotationSchedule = RotationSchedule;
_a = JSII_RTTI_SYMBOL_1;
RotationSchedule[_a] = { fqn: "@aws-cdk/aws-secretsmanager.RotationSchedule", version: "0.0.0" };
/**
 * A hosted rotation
 */
class HostedRotation {
    constructor(type, props, masterSecret) {
        this.type = type;
        this.props = props;
        this.masterSecret = masterSecret;
        if (type.isMultiUser && !masterSecret) {
            throw new Error('The `masterSecret` must be specified when using the multi user scheme.');
        }
    }
    /** MySQL Single User */
    static mysqlSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mysqlSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MYSQL_SINGLE_USER, options);
    }
    /** MySQL Multi User */
    static mysqlMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mysqlMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MYSQL_MULTI_USER, options, options.masterSecret);
    }
    /** PostgreSQL Single User */
    static postgreSqlSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.postgreSqlSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.POSTGRESQL_SINGLE_USER, options);
    }
    /** PostgreSQL Multi User */
    static postgreSqlMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.postgreSqlMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.POSTGRESQL_MULTI_USER, options, options.masterSecret);
    }
    /** Oracle Single User */
    static oracleSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.oracleSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.ORACLE_SINGLE_USER, options);
    }
    /** Oracle Multi User */
    static oracleMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.oracleMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.ORACLE_MULTI_USER, options, options.masterSecret);
    }
    /** MariaDB Single User */
    static mariaDbSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mariaDbSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MARIADB_SINGLE_USER, options);
    }
    /** MariaDB Multi User */
    static mariaDbMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mariaDbMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MARIADB_MULTI_USER, options, options.masterSecret);
    }
    /** SQL Server Single User */
    static sqlServerSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.sqlServerSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.SQLSERVER_SINGLE_USER, options);
    }
    /** SQL Server Multi User */
    static sqlServerMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.sqlServerMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.SQLSERVER_MULTI_USER, options, options.masterSecret);
    }
    /** Redshift Single User */
    static redshiftSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.redshiftSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.REDSHIFT_SINGLE_USER, options);
    }
    /** Redshift Multi User */
    static redshiftMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.redshiftMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.REDSHIFT_MULTI_USER, options, options.masterSecret);
    }
    /** MongoDB Single User */
    static mongoDbSingleUser(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mongoDbSingleUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MONGODB_SINGLE_USER, options);
    }
    /** MongoDB Multi User */
    static mongoDbMultiUser(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mongoDbMultiUser);
            }
            throw error;
        }
        return new HostedRotation(HostedRotationType.MONGODB_MULTI_USER, options, options.masterSecret);
    }
    /**
     * Binds this hosted rotation to a secret
     */
    bind(secret, scope) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_ISecret(secret);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html
        core_1.Stack.of(scope).addTransform('AWS::SecretsManager-2020-07-23');
        if (!this.props.vpc && this.props.securityGroups) {
            throw new Error('`vpc` must be specified when specifying `securityGroups`.');
        }
        if (this.props.vpc) {
            this._connections = new ec2.Connections({
                securityGroups: this.props.securityGroups || [new ec2.SecurityGroup(scope, 'SecurityGroup', {
                        vpc: this.props.vpc,
                    })],
            });
        }
        // Prevent master secret deletion when rotation is in place
        if (this.masterSecret) {
            this.masterSecret.denyAccountRootDelete();
        }
        const defaultExcludeCharacters = secret_1.Secret.isSecret(secret)
            ? secret.excludeCharacters ?? DEFAULT_PASSWORD_EXCLUDE_CHARS
            : DEFAULT_PASSWORD_EXCLUDE_CHARS;
        return {
            rotationType: this.type.name,
            kmsKeyArn: secret.encryptionKey?.keyArn,
            masterSecretArn: this.masterSecret?.secretArn,
            masterSecretKmsKeyArn: this.masterSecret?.encryptionKey?.keyArn,
            rotationLambdaName: this.props.functionName,
            vpcSecurityGroupIds: this._connections?.securityGroups?.map(s => s.securityGroupId).join(','),
            vpcSubnetIds: this.props.vpc?.selectSubnets(this.props.vpcSubnets).subnetIds.join(','),
            excludeCharacters: this.props.excludeCharacters ?? defaultExcludeCharacters,
        };
    }
    /**
     * Security group connections for this hosted rotation
     */
    get connections() {
        if (!this.props.vpc) {
            throw new Error('Cannot use connections for a hosted rotation that is not deployed in a VPC');
        }
        // If we are in a vpc and bind() has been called _connections should be defined
        if (!this._connections) {
            throw new Error('Cannot use connections for a hosted rotation that has not been bound to a secret');
        }
        return this._connections;
    }
}
exports.HostedRotation = HostedRotation;
_b = JSII_RTTI_SYMBOL_1;
HostedRotation[_b] = { fqn: "@aws-cdk/aws-secretsmanager.HostedRotation", version: "0.0.0" };
/**
 * Hosted rotation type
 */
class HostedRotationType {
    /**
     * @param name The type of rotation
     * @param isMultiUser Whether the rotation uses the mutli user scheme
     */
    constructor(name, isMultiUser) {
        this.name = name;
        this.isMultiUser = isMultiUser;
    }
}
exports.HostedRotationType = HostedRotationType;
_c = JSII_RTTI_SYMBOL_1;
HostedRotationType[_c] = { fqn: "@aws-cdk/aws-secretsmanager.HostedRotationType", version: "0.0.0" };
/** MySQL Single User */
HostedRotationType.MYSQL_SINGLE_USER = new HostedRotationType('MySQLSingleUser');
/** MySQL Multi User */
HostedRotationType.MYSQL_MULTI_USER = new HostedRotationType('MySQLMultiUser', true);
/** PostgreSQL Single User */
HostedRotationType.POSTGRESQL_SINGLE_USER = new HostedRotationType('PostgreSQLSingleUser');
/** PostgreSQL Multi User */
HostedRotationType.POSTGRESQL_MULTI_USER = new HostedRotationType('PostgreSQLMultiUser', true);
/** Oracle Single User */
HostedRotationType.ORACLE_SINGLE_USER = new HostedRotationType('OracleSingleUser');
/** Oracle Multi User */
HostedRotationType.ORACLE_MULTI_USER = new HostedRotationType('OracleMultiUser', true);
/** MariaDB Single User */
HostedRotationType.MARIADB_SINGLE_USER = new HostedRotationType('MariaDBSingleUser');
/** MariaDB Multi User */
HostedRotationType.MARIADB_MULTI_USER = new HostedRotationType('MariaDBMultiUser', true);
/** SQL Server Single User */
HostedRotationType.SQLSERVER_SINGLE_USER = new HostedRotationType('SQLServerSingleUser');
/** SQL Server Multi User */
HostedRotationType.SQLSERVER_MULTI_USER = new HostedRotationType('SQLServerMultiUser', true);
/** Redshift Single User */
HostedRotationType.REDSHIFT_SINGLE_USER = new HostedRotationType('RedshiftSingleUser');
/** Redshift Multi User */
HostedRotationType.REDSHIFT_MULTI_USER = new HostedRotationType('RedshiftMultiUser', true);
/** MongoDB Single User */
HostedRotationType.MONGODB_SINGLE_USER = new HostedRotationType('MongoDBSingleUser');
/** MongoDB Multi User */
HostedRotationType.MONGODB_MULTI_USER = new HostedRotationType('MongoDBMultiUser', true);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRpb24tc2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3RhdGlvbi1zY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUV4Qyx3Q0FBMEQ7QUFFMUQscUNBQTJDO0FBQzNDLHlFQUFpRTtBQUVqRTs7Ozs7R0FLRztBQUNILE1BQU0sOEJBQThCLEdBQUcsK0JBQStCLENBQUM7QUEwRHZFOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxlQUFRO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNEI7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQUZSLGdCQUFnQjs7OztRQUl6QixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDdEcsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1NBQ25GO1FBRUQsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUU7WUFDdEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtnQkFDOUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQzVDLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUN6QixrQkFBa0IsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLGdCQUFnQixFQUN2RCxLQUFLLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FDcEMsQ0FDRixDQUFDO2FBQ0g7WUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyw4QkFB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QyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXpGLHlCQUF5QjtBQUNGLHFDQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFN0YsNkJBQTZCO0FBQ04sd0NBQXFCLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRTVGLDRCQUE0QjtBQUNMLHVDQUFvQixHQUFHLElBQUksa0JBQWtCLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFakcsMkJBQTJCO0FBQ0osdUNBQW9CLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBRTFGLDBCQUEwQjtBQUNILHNDQUFtQixHQUFHLElBQUksa0JBQWtCLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFL0YsMEJBQTBCO0FBQ0gsc0NBQW1CLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXpGLHlCQUF5QjtBQUNGLHFDQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElTZWNyZXQsIFNlY3JldCB9IGZyb20gJy4vc2VjcmV0JztcbmltcG9ydCB7IENmblJvdGF0aW9uU2NoZWR1bGUgfSBmcm9tICcuL3NlY3JldHNtYW5hZ2VyLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgc2V0IG9mIGNoYXJhY3RlcnMgd2UgZXhjbHVkZSBmcm9tIGdlbmVyYXRlZCBwYXNzd29yZHMgZm9yIGRhdGFiYXNlIHVzZXJzLlxuICogSXQncyBhIGNvbWJpbmF0aW9uIG9mIGNoYXJhY3RlcnMgdGhhdCBoYXZlIGEgdGVuZGVuY3kgdG8gY2F1c2UgcHJvYmxlbXMgaW4gc2hlbGwgc2NyaXB0cyxcbiAqIHNvbWUgZW5naW5lLXNwZWNpZmljIGNoYXJhY3RlcnMgKGZvciBleGFtcGxlLCBPcmFjbGUgZG9lc24ndCBsaWtlICdAJyBpbiBpdHMgcGFzc3dvcmRzKSxcbiAqIGFuZCBzb21lIHRoYXQgdHJpcCB1cCBvdGhlciBzZXJ2aWNlcywgbGlrZSBETVMuXG4gKi9cbmNvbnN0IERFRkFVTFRfUEFTU1dPUkRfRVhDTFVERV9DSEFSUyA9IFwiICUrfmAjJCYqKCl8W117fTo7PD4/IScvQFxcXCJcXFxcXCI7XG5cbi8qKlxuICogT3B0aW9ucyB0byBhZGQgYSByb3RhdGlvbiBzY2hlZHVsZSB0byBhIHNlY3JldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSb3RhdGlvblNjaGVkdWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIExhbWJkYSBmdW5jdGlvbiB0aGF0IGNhbiByb3RhdGUgdGhlIHNlY3JldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBlaXRoZXIgYHJvdGF0aW9uTGFtYmRhYCBvciBgaG9zdGVkUm90YXRpb25gIG11c3QgYmUgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSByb3RhdGlvbkxhbWJkYT86IGxhbWJkYS5JRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIEhvc3RlZCByb3RhdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVpdGhlciBgcm90YXRpb25MYW1iZGFgIG9yIGBob3N0ZWRSb3RhdGlvbmAgbXVzdCBiZSBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGhvc3RlZFJvdGF0aW9uPzogSG9zdGVkUm90YXRpb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbnVtYmVyIG9mIGRheXMgYWZ0ZXIgdGhlIHByZXZpb3VzIHJvdGF0aW9uIGJlZm9yZVxuICAgKiBTZWNyZXRzIE1hbmFnZXIgdHJpZ2dlcnMgdGhlIG5leHQgYXV0b21hdGljIHJvdGF0aW9uLlxuICAgKlxuICAgKiBBIHZhbHVlIG9mIHplcm8gd2lsbCBkaXNhYmxlIGF1dG9tYXRpYyByb3RhdGlvbiAtIGBEdXJhdGlvbi5kYXlzKDApYC5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uZGF5cygzMClcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9tYXRpY2FsbHlBZnRlcj86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIFJvdGF0aW9uU2NoZWR1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm90YXRpb25TY2hlZHVsZVByb3BzIGV4dGVuZHMgUm90YXRpb25TY2hlZHVsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNlY3JldCB0byByb3RhdGUuXG4gICAqXG4gICAqIElmIGhvc3RlZCByb3RhdGlvbiBpcyB1c2VkLCB0aGlzIG11c3QgYmUgYSBKU09OIHN0cmluZyB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKlxuICAgKiBgYGBcbiAgICoge1xuICAgKiAgIFwiZW5naW5lXCI6IDxyZXF1aXJlZDogZGF0YWJhc2UgZW5naW5lPixcbiAgICogICBcImhvc3RcIjogPHJlcXVpcmVkOiBpbnN0YW5jZSBob3N0IG5hbWU+LFxuICAgKiAgIFwidXNlcm5hbWVcIjogPHJlcXVpcmVkOiB1c2VybmFtZT4sXG4gICAqICAgXCJwYXNzd29yZFwiOiA8cmVxdWlyZWQ6IHBhc3N3b3JkPixcbiAgICogICBcImRibmFtZVwiOiA8b3B0aW9uYWw6IGRhdGFiYXNlIG5hbWU+LFxuICAgKiAgIFwicG9ydFwiOiA8b3B0aW9uYWw6IGlmIG5vdCBzcGVjaWZpZWQsIGRlZmF1bHQgcG9ydCB3aWxsIGJlIHVzZWQ+LFxuICAgKiAgIFwibWFzdGVyYXJuXCI6IDxyZXF1aXJlZCBmb3IgbXVsdGkgdXNlciByb3RhdGlvbjogdGhlIGFybiBvZiB0aGUgbWFzdGVyIHNlY3JldCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIHVzZXJzL2NoYW5nZSBwYXNzd29yZHM+XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgaXMgdHlwaWNhbGx5IHRoZSBjYXNlIGZvciBhIHNlY3JldCByZWZlcmVuY2VkIGZyb20gYW4gYEFXUzo6U2VjcmV0c01hbmFnZXI6OlNlY3JldFRhcmdldEF0dGFjaG1lbnRgXG4gICAqIG9yIGFuIGBJU2VjcmV0YCByZXR1cm5lZCBieSB0aGUgYGF0dGFjaCgpYCBtZXRob2Qgb2YgYFNlY3JldGAuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXQ6IElTZWNyZXQ7XG59XG5cbi8qKlxuICogQSByb3RhdGlvbiBzY2hlZHVsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJvdGF0aW9uU2NoZWR1bGUgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSb3RhdGlvblNjaGVkdWxlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKCghcHJvcHMucm90YXRpb25MYW1iZGEgJiYgIXByb3BzLmhvc3RlZFJvdGF0aW9uKSB8fCAocHJvcHMucm90YXRpb25MYW1iZGEgJiYgcHJvcHMuaG9zdGVkUm90YXRpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09uZSBvZiBgcm90YXRpb25MYW1iZGFgIG9yIGBob3N0ZWRSb3RhdGlvbmAgbXVzdCBiZSBzcGVjaWZpZWQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnJvdGF0aW9uTGFtYmRhPy5wZXJtaXNzaW9uc05vZGUuZGVmYXVsdENoaWxkKSB7XG4gICAgICBpZiAocHJvcHMuc2VjcmV0LmVuY3J5cHRpb25LZXkpIHtcbiAgICAgICAgcHJvcHMuc2VjcmV0LmVuY3J5cHRpb25LZXkuZ3JhbnRFbmNyeXB0RGVjcnlwdChcbiAgICAgICAgICBuZXcga21zLlZpYVNlcnZpY2VQcmluY2lwYWwoXG4gICAgICAgICAgICBgc2VjcmV0c21hbmFnZXIuJHtTdGFjay5vZih0aGlzKS5yZWdpb259LmFtYXpvbmF3cy5jb21gLFxuICAgICAgICAgICAgcHJvcHMucm90YXRpb25MYW1iZGEuZ3JhbnRQcmluY2lwYWwsXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcHJvcHMucm90YXRpb25MYW1iZGEuZ3JhbnRJbnZva2UobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzZWNyZXRzbWFuYWdlci5hbWF6b25hd3MuY29tJykpO1xuXG4gICAgICBwcm9wcy5yb3RhdGlvbkxhbWJkYS5hZGRUb1JvbGVQb2xpY3koXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpQdXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6VXBkYXRlU2VjcmV0VmVyc2lvblN0YWdlJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlczogW3Byb3BzLnNlY3JldC5zZWNyZXRGdWxsQXJuID8gcHJvcHMuc2VjcmV0LnNlY3JldEZ1bGxBcm4gOiBgJHtwcm9wcy5zZWNyZXQuc2VjcmV0QXJufS0/Pz8/Pz9gXSxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgcHJvcHMucm90YXRpb25MYW1iZGEuYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFJhbmRvbVBhc3N3b3JkJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgYXV0b21hdGljYWxseUFmdGVyRGF5czogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmIChwcm9wcy5hdXRvbWF0aWNhbGx5QWZ0ZXI/LnRvTWlsbGlzZWNvbmRzKCkgIT09IDApIHtcbiAgICAgIGF1dG9tYXRpY2FsbHlBZnRlckRheXMgPSBwcm9wcy5hdXRvbWF0aWNhbGx5QWZ0ZXI/LnRvRGF5cygpIHx8IDMwO1xuICAgIH1cblxuICAgIGxldCByb3RhdGlvblJ1bGVzOiBDZm5Sb3RhdGlvblNjaGVkdWxlLlJvdGF0aW9uUnVsZXNQcm9wZXJ0eSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoYXV0b21hdGljYWxseUFmdGVyRGF5cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByb3RhdGlvblJ1bGVzID0ge1xuICAgICAgICBhdXRvbWF0aWNhbGx5QWZ0ZXJEYXlzLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBuZXcgQ2ZuUm90YXRpb25TY2hlZHVsZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZWNyZXRJZDogcHJvcHMuc2VjcmV0LnNlY3JldEFybixcbiAgICAgIHJvdGF0aW9uTGFtYmRhQXJuOiBwcm9wcy5yb3RhdGlvbkxhbWJkYT8uZnVuY3Rpb25Bcm4sXG4gICAgICBob3N0ZWRSb3RhdGlvbkxhbWJkYTogcHJvcHMuaG9zdGVkUm90YXRpb24/LmJpbmQocHJvcHMuc2VjcmV0LCB0aGlzKSxcbiAgICAgIHJvdGF0aW9uUnVsZXMsXG4gICAgfSk7XG5cbiAgICAvLyBQcmV2ZW50IHNlY3JldHMgZGVsZXRpb25zIHdoZW4gcm90YXRpb24gaXMgaW4gcGxhY2VcbiAgICBwcm9wcy5zZWNyZXQuZGVueUFjY291bnRSb290RGVsZXRlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBTaW5nbGUgdXNlciBob3N0ZWQgcm90YXRpb24gb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpbmdsZVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgTGFtYmRhIGNyZWF0ZWQgdG8gcm90YXRlIHRoZSBzZWNyZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBzZWN1cml0eSBncm91cHMgZm9yIHRoZSBMYW1iZGEgY3JlYXRlZCB0byByb3RhdGUgdGhlIHNlY3JldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IHNlY3VyaXR5IGdyb3VwIGlzIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzPzogZWMyLklTZWN1cml0eUdyb3VwW107XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgd2hlcmUgdGhlIExhbWJkYSByb3RhdGlvbiBmdW5jdGlvbiB3aWxsIHJ1bi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgTGFtYmRhIGlzIG5vdCBkZXBsb3llZCBpbiBhIFZQQ1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHN1Ym5ldHMgaW4gdGhlIFZQQyB3aGVyZSB0aGUgTGFtYmRhIHJvdGF0aW9uIGZ1bmN0aW9uIHdpbGwgcnVuLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBWcGMgZGVmYXVsdCBzdHJhdGVneSBpZiBub3Qgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb247XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIG9mIHRoZSBjaGFyYWN0ZXJzIHRoYXQgeW91IGRvbid0IHdhbnQgaW4gdGhlIHBhc3N3b3JkXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBzYW1lIGV4Y2x1ZGUgY2hhcmFjdGVycyBhcyB0aGUgb25lcyB1c2VkIGZvciB0aGVcbiAgICogc2VjcmV0IG9yIFwiICUrfmAjJCYqKCl8W117fTo7PD4/IScvQFxcXCJcXFxcXCJcbiAgICovXG4gIHJlYWRvbmx5IGV4Y2x1ZGVDaGFyYWN0ZXJzPzogc3RyaW5nLFxufVxuXG4vKipcbiAqIE11bHRpIHVzZXIgaG9zdGVkIHJvdGF0aW9uIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNdWx0aVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMgZXh0ZW5kcyBTaW5nbGVVc2VySG9zdGVkUm90YXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtYXN0ZXIgc2VjcmV0IGZvciBhIG11bHRpIHVzZXIgcm90YXRpb24gc2NoZW1lXG4gICAqL1xuICByZWFkb25seSBtYXN0ZXJTZWNyZXQ6IElTZWNyZXQ7XG59XG5cbi8qKlxuICogQSBob3N0ZWQgcm90YXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEhvc3RlZFJvdGF0aW9uIGltcGxlbWVudHMgZWMyLklDb25uZWN0YWJsZSB7XG4gIC8qKiBNeVNRTCBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIG15c3FsU2luZ2xlVXNlcihvcHRpb25zOiBTaW5nbGVVc2VySG9zdGVkUm90YXRpb25PcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5NWVNRTF9TSU5HTEVfVVNFUiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogTXlTUUwgTXVsdGkgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIG15c3FsTXVsdGlVc2VyKG9wdGlvbnM6IE11bHRpVXNlckhvc3RlZFJvdGF0aW9uT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgSG9zdGVkUm90YXRpb24oSG9zdGVkUm90YXRpb25UeXBlLk1ZU1FMX01VTFRJX1VTRVIsIG9wdGlvbnMsIG9wdGlvbnMubWFzdGVyU2VjcmV0KTtcbiAgfVxuXG4gIC8qKiBQb3N0Z3JlU1FMIFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcG9zdGdyZVNxbFNpbmdsZVVzZXIob3B0aW9uczogU2luZ2xlVXNlckhvc3RlZFJvdGF0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIb3N0ZWRSb3RhdGlvbihIb3N0ZWRSb3RhdGlvblR5cGUuUE9TVEdSRVNRTF9TSU5HTEVfVVNFUiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogUG9zdGdyZVNRTCBNdWx0aSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcG9zdGdyZVNxbE11bHRpVXNlcihvcHRpb25zOiBNdWx0aVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5QT1NUR1JFU1FMX01VTFRJX1VTRVIsIG9wdGlvbnMsIG9wdGlvbnMubWFzdGVyU2VjcmV0KTtcbiAgfVxuXG4gIC8qKiBPcmFjbGUgU2luZ2xlIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyBvcmFjbGVTaW5nbGVVc2VyKG9wdGlvbnM6IFNpbmdsZVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSG9zdGVkUm90YXRpb24oSG9zdGVkUm90YXRpb25UeXBlLk9SQUNMRV9TSU5HTEVfVVNFUiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogT3JhY2xlIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyBvcmFjbGVNdWx0aVVzZXIob3B0aW9uczogTXVsdGlVc2VySG9zdGVkUm90YXRpb25PcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBIb3N0ZWRSb3RhdGlvbihIb3N0ZWRSb3RhdGlvblR5cGUuT1JBQ0xFX01VTFRJX1VTRVIsIG9wdGlvbnMsIG9wdGlvbnMubWFzdGVyU2VjcmV0KTtcbiAgfVxuXG4gIC8qKiBNYXJpYURCIFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgbWFyaWFEYlNpbmdsZVVzZXIob3B0aW9uczogU2luZ2xlVXNlckhvc3RlZFJvdGF0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBIb3N0ZWRSb3RhdGlvbihIb3N0ZWRSb3RhdGlvblR5cGUuTUFSSUFEQl9TSU5HTEVfVVNFUiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogTWFyaWFEQiBNdWx0aSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgbWFyaWFEYk11bHRpVXNlcihvcHRpb25zOiBNdWx0aVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5NQVJJQURCX01VTFRJX1VTRVIsIG9wdGlvbnMsIG9wdGlvbnMubWFzdGVyU2VjcmV0KTtcbiAgfVxuXG4gIC8qKiBTUUwgU2VydmVyIFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgc3FsU2VydmVyU2luZ2xlVXNlcihvcHRpb25zOiBTaW5nbGVVc2VySG9zdGVkUm90YXRpb25PcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5TUUxTRVJWRVJfU0lOR0xFX1VTRVIsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFNRTCBTZXJ2ZXIgTXVsdGkgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHNxbFNlcnZlck11bHRpVXNlcihvcHRpb25zOiBNdWx0aVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5TUUxTRVJWRVJfTVVMVElfVVNFUiwgb3B0aW9ucywgb3B0aW9ucy5tYXN0ZXJTZWNyZXQpO1xuICB9XG5cbiAgLyoqIFJlZHNoaWZ0IFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcmVkc2hpZnRTaW5nbGVVc2VyKG9wdGlvbnM6IFNpbmdsZVVzZXJIb3N0ZWRSb3RhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSG9zdGVkUm90YXRpb24oSG9zdGVkUm90YXRpb25UeXBlLlJFRFNISUZUX1NJTkdMRV9VU0VSLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBSZWRzaGlmdCBNdWx0aSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcmVkc2hpZnRNdWx0aVVzZXIob3B0aW9uczogTXVsdGlVc2VySG9zdGVkUm90YXRpb25PcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBIb3N0ZWRSb3RhdGlvbihIb3N0ZWRSb3RhdGlvblR5cGUuUkVEU0hJRlRfTVVMVElfVVNFUiwgb3B0aW9ucywgb3B0aW9ucy5tYXN0ZXJTZWNyZXQpO1xuICB9XG5cbiAgLyoqIE1vbmdvREIgU2luZ2xlIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyBtb25nb0RiU2luZ2xlVXNlcihvcHRpb25zOiBTaW5nbGVVc2VySG9zdGVkUm90YXRpb25PcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhvc3RlZFJvdGF0aW9uKEhvc3RlZFJvdGF0aW9uVHlwZS5NT05HT0RCX1NJTkdMRV9VU0VSLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBNb25nb0RCIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyBtb25nb0RiTXVsdGlVc2VyKG9wdGlvbnM6IE11bHRpVXNlckhvc3RlZFJvdGF0aW9uT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgSG9zdGVkUm90YXRpb24oSG9zdGVkUm90YXRpb25UeXBlLk1PTkdPREJfTVVMVElfVVNFUiwgb3B0aW9ucywgb3B0aW9ucy5tYXN0ZXJTZWNyZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29ubmVjdGlvbnM/OiBlYzIuQ29ubmVjdGlvbnM7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHR5cGU6IEhvc3RlZFJvdGF0aW9uVHlwZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBTaW5nbGVVc2VySG9zdGVkUm90YXRpb25PcHRpb25zIHwgTXVsdGlVc2VySG9zdGVkUm90YXRpb25PcHRpb25zLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFzdGVyU2VjcmV0PzogSVNlY3JldCxcbiAgKSB7XG4gICAgaWYgKHR5cGUuaXNNdWx0aVVzZXIgJiYgIW1hc3RlclNlY3JldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYG1hc3RlclNlY3JldGAgbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiB1c2luZyB0aGUgbXVsdGkgdXNlciBzY2hlbWUuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIHRoaXMgaG9zdGVkIHJvdGF0aW9uIHRvIGEgc2VjcmV0XG4gICAqL1xuICBwdWJsaWMgYmluZChzZWNyZXQ6IElTZWNyZXQsIHNjb3BlOiBDb25zdHJ1Y3QpOiBDZm5Sb3RhdGlvblNjaGVkdWxlLkhvc3RlZFJvdGF0aW9uTGFtYmRhUHJvcGVydHkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXNlY3JldHNtYW5hZ2VyLXJvdGF0aW9uc2NoZWR1bGUtaG9zdGVkcm90YXRpb25sYW1iZGEuaHRtbFxuICAgIFN0YWNrLm9mKHNjb3BlKS5hZGRUcmFuc2Zvcm0oJ0FXUzo6U2VjcmV0c01hbmFnZXItMjAyMC0wNy0yMycpO1xuXG4gICAgaWYgKCF0aGlzLnByb3BzLnZwYyAmJiB0aGlzLnByb3BzLnNlY3VyaXR5R3JvdXBzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B2cGNgIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gc3BlY2lmeWluZyBgc2VjdXJpdHlHcm91cHNgLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnZwYykge1xuICAgICAgdGhpcy5fY29ubmVjdGlvbnMgPSBuZXcgZWMyLkNvbm5lY3Rpb25zKHtcbiAgICAgICAgc2VjdXJpdHlHcm91cHM6IHRoaXMucHJvcHMuc2VjdXJpdHlHcm91cHMgfHwgW25ldyBlYzIuU2VjdXJpdHlHcm91cChzY29wZSwgJ1NlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgICAgdnBjOiB0aGlzLnByb3BzLnZwYyxcbiAgICAgICAgfSldLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBtYXN0ZXIgc2VjcmV0IGRlbGV0aW9uIHdoZW4gcm90YXRpb24gaXMgaW4gcGxhY2VcbiAgICBpZiAodGhpcy5tYXN0ZXJTZWNyZXQpIHtcbiAgICAgIHRoaXMubWFzdGVyU2VjcmV0LmRlbnlBY2NvdW50Um9vdERlbGV0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRFeGNsdWRlQ2hhcmFjdGVycyA9IFNlY3JldC5pc1NlY3JldChzZWNyZXQpXG4gICAgICA/IHNlY3JldC5leGNsdWRlQ2hhcmFjdGVycyA/PyBERUZBVUxUX1BBU1NXT1JEX0VYQ0xVREVfQ0hBUlNcbiAgICAgIDogREVGQVVMVF9QQVNTV09SRF9FWENMVURFX0NIQVJTO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdGF0aW9uVHlwZTogdGhpcy50eXBlLm5hbWUsXG4gICAgICBrbXNLZXlBcm46IHNlY3JldC5lbmNyeXB0aW9uS2V5Py5rZXlBcm4sXG4gICAgICBtYXN0ZXJTZWNyZXRBcm46IHRoaXMubWFzdGVyU2VjcmV0Py5zZWNyZXRBcm4sXG4gICAgICBtYXN0ZXJTZWNyZXRLbXNLZXlBcm46IHRoaXMubWFzdGVyU2VjcmV0Py5lbmNyeXB0aW9uS2V5Py5rZXlBcm4sXG4gICAgICByb3RhdGlvbkxhbWJkYU5hbWU6IHRoaXMucHJvcHMuZnVuY3Rpb25OYW1lLFxuICAgICAgdnBjU2VjdXJpdHlHcm91cElkczogdGhpcy5fY29ubmVjdGlvbnM/LnNlY3VyaXR5R3JvdXBzPy5tYXAocyA9PiBzLnNlY3VyaXR5R3JvdXBJZCkuam9pbignLCcpLFxuICAgICAgdnBjU3VibmV0SWRzOiB0aGlzLnByb3BzLnZwYz8uc2VsZWN0U3VibmV0cyh0aGlzLnByb3BzLnZwY1N1Ym5ldHMpLnN1Ym5ldElkcy5qb2luKCcsJyksXG4gICAgICBleGNsdWRlQ2hhcmFjdGVyczogdGhpcy5wcm9wcy5leGNsdWRlQ2hhcmFjdGVycyA/PyBkZWZhdWx0RXhjbHVkZUNoYXJhY3RlcnMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWN1cml0eSBncm91cCBjb25uZWN0aW9ucyBmb3IgdGhpcyBob3N0ZWQgcm90YXRpb25cbiAgICovXG4gIHB1YmxpYyBnZXQgY29ubmVjdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnZwYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGNvbm5lY3Rpb25zIGZvciBhIGhvc3RlZCByb3RhdGlvbiB0aGF0IGlzIG5vdCBkZXBsb3llZCBpbiBhIFZQQycpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGFyZSBpbiBhIHZwYyBhbmQgYmluZCgpIGhhcyBiZWVuIGNhbGxlZCBfY29ubmVjdGlvbnMgc2hvdWxkIGJlIGRlZmluZWRcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgY29ubmVjdGlvbnMgZm9yIGEgaG9zdGVkIHJvdGF0aW9uIHRoYXQgaGFzIG5vdCBiZWVuIGJvdW5kIHRvIGEgc2VjcmV0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zO1xuICB9XG59XG5cbi8qKlxuICogSG9zdGVkIHJvdGF0aW9uIHR5cGVcbiAqL1xuZXhwb3J0IGNsYXNzIEhvc3RlZFJvdGF0aW9uVHlwZSB7XG4gIC8qKiBNeVNRTCBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1ZU1FMX1NJTkdMRV9VU0VSID0gbmV3IEhvc3RlZFJvdGF0aW9uVHlwZSgnTXlTUUxTaW5nbGVVc2VyJyk7XG5cbiAgLyoqIE15U1FMIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNWVNRTF9NVUxUSV9VU0VSID0gbmV3IEhvc3RlZFJvdGF0aW9uVHlwZSgnTXlTUUxNdWx0aVVzZXInLCB0cnVlKTtcblxuICAvKiogUG9zdGdyZVNRTCBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBPU1RHUkVTUUxfU0lOR0xFX1VTRVIgPSBuZXcgSG9zdGVkUm90YXRpb25UeXBlKCdQb3N0Z3JlU1FMU2luZ2xlVXNlcicpO1xuXG4gIC8qKiBQb3N0Z3JlU1FMIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQT1NUR1JFU1FMX01VTFRJX1VTRVIgPSBuZXcgSG9zdGVkUm90YXRpb25UeXBlKCdQb3N0Z3JlU1FMTXVsdGlVc2VyJywgdHJ1ZSk7XG5cbiAgLyoqIE9yYWNsZSBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9SQUNMRV9TSU5HTEVfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ09yYWNsZVNpbmdsZVVzZXInKTtcblxuICAvKiogT3JhY2xlIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUkFDTEVfTVVMVElfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ09yYWNsZU11bHRpVXNlcicsIHRydWUpO1xuXG4gIC8qKiBNYXJpYURCIFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFSSUFEQl9TSU5HTEVfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ01hcmlhREJTaW5nbGVVc2VyJyk7XG5cbiAgLyoqIE1hcmlhREIgTXVsdGkgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BUklBREJfTVVMVElfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ01hcmlhREJNdWx0aVVzZXInLCB0cnVlKTtcblxuICAvKiogU1FMIFNlcnZlciBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNRTFNFUlZFUl9TSU5HTEVfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ1NRTFNlcnZlclNpbmdsZVVzZXInKVxuXG4gIC8qKiBTUUwgU2VydmVyIE11bHRpIFVzZXIgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTUUxTRVJWRVJfTVVMVElfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ1NRTFNlcnZlck11bHRpVXNlcicsIHRydWUpO1xuXG4gIC8qKiBSZWRzaGlmdCBTaW5nbGUgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRFNISUZUX1NJTkdMRV9VU0VSID0gbmV3IEhvc3RlZFJvdGF0aW9uVHlwZSgnUmVkc2hpZnRTaW5nbGVVc2VyJylcblxuICAvKiogUmVkc2hpZnQgTXVsdGkgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFRFNISUZUX01VTFRJX1VTRVIgPSBuZXcgSG9zdGVkUm90YXRpb25UeXBlKCdSZWRzaGlmdE11bHRpVXNlcicsIHRydWUpO1xuXG4gIC8qKiBNb25nb0RCIFNpbmdsZSBVc2VyICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTU9OR09EQl9TSU5HTEVfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ01vbmdvREJTaW5nbGVVc2VyJyk7XG5cbiAgLyoqIE1vbmdvREIgTXVsdGkgVXNlciAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1PTkdPREJfTVVMVElfVVNFUiA9IG5ldyBIb3N0ZWRSb3RhdGlvblR5cGUoJ01vbmdvREJNdWx0aVVzZXInLCB0cnVlKTtcblxuICAvKipcbiAgICogQHBhcmFtIG5hbWUgVGhlIHR5cGUgb2Ygcm90YXRpb25cbiAgICogQHBhcmFtIGlzTXVsdGlVc2VyIFdoZXRoZXIgdGhlIHJvdGF0aW9uIHVzZXMgdGhlIG11dGxpIHVzZXIgc2NoZW1lXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBpc011bHRpVXNlcj86IGJvb2xlYW4pIHt9XG59XG4iXX0=