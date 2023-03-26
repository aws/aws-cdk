// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:56.164Z","fingerprint":"BQ56QwjF4doAlK/Fle95nOO2rgZeJEKgrGvGzR8BCCc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html
 */
export interface CfnCertificateProps {

    /**
     * A customer-assigned name for the certificate. Identifiers must begin with a letter and must contain only ASCII letters, digits, and hyphens. They can't end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificateidentifier
     */
    readonly certificateIdentifier?: string;

    /**
     * The contents of a `.pem` file, which contains an X.509 certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatepem
     */
    readonly certificatePem?: string;

    /**
     * The location of an imported Oracle Wallet certificate for use with SSL. An example is: `filebase64("${path.root}/rds-ca-2019-root.sso")`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatewallet
     */
    readonly certificateWallet?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateIdentifier', cdk.validateString)(properties.certificateIdentifier));
    errors.collect(cdk.propertyValidator('certificatePem', cdk.validateString)(properties.certificatePem));
    errors.collect(cdk.propertyValidator('certificateWallet', cdk.validateString)(properties.certificateWallet));
    return errors.wrap('supplied properties not correct for "CfnCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Certificate` resource.
 */
// @ts-ignore TS6133
function cfnCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCertificatePropsValidator(properties).assertSuccess();
    return {
        CertificateIdentifier: cdk.stringToCloudFormation(properties.certificateIdentifier),
        CertificatePem: cdk.stringToCloudFormation(properties.certificatePem),
        CertificateWallet: cdk.stringToCloudFormation(properties.certificateWallet),
    };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
    ret.addPropertyResult('certificateIdentifier', 'CertificateIdentifier', properties.CertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateIdentifier) : undefined);
    ret.addPropertyResult('certificatePem', 'CertificatePem', properties.CertificatePem != null ? cfn_parse.FromCloudFormation.getString(properties.CertificatePem) : undefined);
    ret.addPropertyResult('certificateWallet', 'CertificateWallet', properties.CertificateWallet != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateWallet) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::Certificate`
 *
 * The `AWS::DMS::Certificate` resource creates an Secure Sockets Layer (SSL) certificate that encrypts connections between AWS DMS endpoints and the replication instance.
 *
 * @cloudformationResource AWS::DMS::Certificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::Certificate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCertificatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnCertificate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A customer-assigned name for the certificate. Identifiers must begin with a letter and must contain only ASCII letters, digits, and hyphens. They can't end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificateidentifier
     */
    public certificateIdentifier: string | undefined;

    /**
     * The contents of a `.pem` file, which contains an X.509 certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatepem
     */
    public certificatePem: string | undefined;

    /**
     * The location of an imported Oracle Wallet certificate for use with SSL. An example is: `filebase64("${path.root}/rds-ca-2019-root.sso")`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html#cfn-dms-certificate-certificatewallet
     */
    public certificateWallet: string | undefined;

    /**
     * Create a new `AWS::DMS::Certificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps = {}) {
        super(scope, id, { type: CfnCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.certificateIdentifier = props.certificateIdentifier;
        this.certificatePem = props.certificatePem;
        this.certificateWallet = props.certificateWallet;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificateIdentifier: this.certificateIdentifier,
            certificatePem: this.certificatePem,
            certificateWallet: this.certificateWallet,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCertificatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnEndpoint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html
 */
export interface CfnEndpointProps {

    /**
     * The type of endpoint. Valid values are `source` and `target` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointtype
     */
    readonly endpointType: string;

    /**
     * The type of engine for the endpoint, depending on the `EndpointType` value.
     *
     * *Valid values* : `mysql` | `oracle` | `postgres` | `mariadb` | `aurora` | `aurora-postgresql` | `opensearch` | `redshift` | `s3` | `db2` | `azuredb` | `sybase` | `dynamodb` | `mongodb` | `kinesis` | `kafka` | `elasticsearch` | `docdb` | `sqlserver` | `neptune`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-enginename
     */
    readonly engineName: string;

    /**
     * The Amazon Resource Name (ARN) for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-certificatearn
     */
    readonly certificateArn?: string;

    /**
     * The name of the endpoint database. For a MySQL source or target endpoint, don't specify `DatabaseName` . To migrate to a specific database, use this setting and `targetDbType` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-databasename
     */
    readonly databaseName?: string;

    /**
     * Settings in JSON format for the source and target DocumentDB endpoint. For more information about other available settings, see [Using extra connections attributes with Amazon DocumentDB as a source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DocumentDB.html#CHAP_Source.DocumentDB.ECAs) and [Using Amazon DocumentDB as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DocumentDB.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-docdbsettings
     */
    readonly docDbSettings?: CfnEndpoint.DocDbSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target Amazon DynamoDB endpoint. For information about other available settings, see [Using object mapping to migrate data to DynamoDB](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DynamoDB.html#CHAP_Target.DynamoDB.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-dynamodbsettings
     */
    readonly dynamoDbSettings?: CfnEndpoint.DynamoDbSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target OpenSearch endpoint. For more information about the available settings, see [Extra connection attributes when using OpenSearch as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Elasticsearch.html#CHAP_Target.Elasticsearch.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-elasticsearchsettings
     */
    readonly elasticsearchSettings?: CfnEndpoint.ElasticsearchSettingsProperty | cdk.IResolvable;

    /**
     * The database endpoint identifier. Identifiers must begin with a letter and must contain only ASCII letters, digits, and hyphens. They can't end with a hyphen, or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointidentifier
     */
    readonly endpointIdentifier?: string;

    /**
     * Additional attributes associated with the connection. Each attribute is specified as a name-value pair associated by an equal sign (=). Multiple attributes are separated by a semicolon (;) with no additional white space. For information on the attributes available for connecting your source or target endpoint, see [Working with AWS DMS Endpoints](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Endpoints.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-extraconnectionattributes
     */
    readonly extraConnectionAttributes?: string;

    /**
     * Settings in JSON format for the source GCP MySQL endpoint. These settings are much the same as the settings for any MySQL-compatible endpoint. For more information, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-gcpmysqlsettings
     */
    readonly gcpMySqlSettings?: CfnEndpoint.GcpMySQLSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the source IBM Db2 LUW endpoint. For information about other available settings, see [Extra connection attributes when using Db2 LUW as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DB2.html#CHAP_Source.DB2.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-ibmdb2settings
     */
    readonly ibmDb2Settings?: CfnEndpoint.IbmDb2SettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target Apache Kafka endpoint. For more information about other available settings, see [Using object mapping to migrate data to a Kafka topic](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kafka.html#CHAP_Target.Kafka.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kafkasettings
     */
    readonly kafkaSettings?: CfnEndpoint.KafkaSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target endpoint for Amazon Kinesis Data Streams. For more information about other available settings, see [Using object mapping to migrate data to a Kinesis data stream](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kinesis.html#CHAP_Target.Kinesis.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kinesissettings
     */
    readonly kinesisSettings?: CfnEndpoint.KinesisSettingsProperty | cdk.IResolvable;

    /**
     * An AWS KMS key identifier that is used to encrypt the connection parameters for the endpoint.
     *
     * If you don't specify a value for the `KmsKeyId` parameter, AWS DMS uses your default encryption key.
     *
     * AWS KMS creates the default encryption key for your AWS account . Your AWS account has a different default encryption key for each AWS Region .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Settings in JSON format for the source and target Microsoft SQL Server endpoint. For information about other available settings, see [Extra connection attributes when using SQL Server as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SQLServer.html#CHAP_Source.SQLServer.ConnectionAttrib) and [Extra connection attributes when using SQL Server as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SQLServer.html#CHAP_Target.SQLServer.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-microsoftsqlserversettings
     */
    readonly microsoftSqlServerSettings?: CfnEndpoint.MicrosoftSqlServerSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the source MongoDB endpoint. For more information about the available settings, see [Using MongoDB as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MongoDB.html#CHAP_Source.MongoDB.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-mongodbsettings
     */
    readonly mongoDbSettings?: CfnEndpoint.MongoDbSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the source and target MySQL endpoint. For information about other available settings, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) and [Extra connection attributes when using a MySQL-compatible database as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.MySQL.html#CHAP_Target.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-mysqlsettings
     */
    readonly mySqlSettings?: CfnEndpoint.MySqlSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target Amazon Neptune endpoint. For more information about the available settings, see [Specifying endpoint settings for Amazon Neptune as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Neptune.html#CHAP_Target.Neptune.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-neptunesettings
     */
    readonly neptuneSettings?: CfnEndpoint.NeptuneSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the source and target Oracle endpoint. For information about other available settings, see [Extra connection attributes when using Oracle as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.ConnectionAttrib) and [Extra connection attributes when using Oracle as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Oracle.html#CHAP_Target.Oracle.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-oraclesettings
     */
    readonly oracleSettings?: CfnEndpoint.OracleSettingsProperty | cdk.IResolvable;

    /**
     * The password to be used to log in to the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-password
     */
    readonly password?: string;

    /**
     * The port used by the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-port
     */
    readonly port?: number;

    /**
     * Settings in JSON format for the source and target PostgreSQL endpoint.
     *
     * For information about other available settings, see [Extra connection attributes when using PostgreSQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.ConnectionAttrib) and [Extra connection attributes when using PostgreSQL as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.PostgreSQL.html#CHAP_Target.PostgreSQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-postgresqlsettings
     */
    readonly postgreSqlSettings?: CfnEndpoint.PostgreSqlSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the target Redis endpoint. For information about other available settings, see [Specifying endpoint settings for Redis as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redis.html#CHAP_Target.Redis.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-redissettings
     */
    readonly redisSettings?: CfnEndpoint.RedisSettingsProperty | cdk.IResolvable;

    /**
     * Settings in JSON format for the Amazon Redshift endpoint.
     *
     * For more information about other available settings, see [Extra connection attributes when using Amazon Redshift as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redshift.html#CHAP_Target.Redshift.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-redshiftsettings
     */
    readonly redshiftSettings?: CfnEndpoint.RedshiftSettingsProperty | cdk.IResolvable;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` .
     *
     * For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-resourceidentifier
     */
    readonly resourceIdentifier?: string;

    /**
     * Settings in JSON format for the source and target Amazon S3 endpoint. For more information about other available settings, see [Extra connection attributes when using Amazon S3 as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.S3.html#CHAP_Source.S3.Configuring) and [Extra connection attributes when using Amazon S3 as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-s3settings
     */
    readonly s3Settings?: CfnEndpoint.S3SettingsProperty | cdk.IResolvable;

    /**
     * The name of the server where the endpoint database resides.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-servername
     */
    readonly serverName?: string;

    /**
     * The Secure Sockets Layer (SSL) mode to use for the SSL connection. The default is `none` .
     *
     * > When `engine_name` is set to S3, the only allowed value is `none` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-sslmode
     */
    readonly sslMode?: string;

    /**
     * Settings in JSON format for the source and target SAP ASE endpoint. For information about other available settings, see [Extra connection attributes when using SAP ASE as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SAP.html#CHAP_Source.SAP.ConnectionAttrib) and [Extra connection attributes when using SAP ASE as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SAP.html#CHAP_Target.SAP.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-sybasesettings
     */
    readonly sybaseSettings?: CfnEndpoint.SybaseSettingsProperty | cdk.IResolvable;

    /**
     * One or more tags to be assigned to the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The user name to be used to log in to the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-username
     */
    readonly username?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the result of the validation.
 */
function CfnEndpointPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('docDbSettings', CfnEndpoint_DocDbSettingsPropertyValidator)(properties.docDbSettings));
    errors.collect(cdk.propertyValidator('dynamoDbSettings', CfnEndpoint_DynamoDbSettingsPropertyValidator)(properties.dynamoDbSettings));
    errors.collect(cdk.propertyValidator('elasticsearchSettings', CfnEndpoint_ElasticsearchSettingsPropertyValidator)(properties.elasticsearchSettings));
    errors.collect(cdk.propertyValidator('endpointIdentifier', cdk.validateString)(properties.endpointIdentifier));
    errors.collect(cdk.propertyValidator('endpointType', cdk.requiredValidator)(properties.endpointType));
    errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
    errors.collect(cdk.propertyValidator('engineName', cdk.requiredValidator)(properties.engineName));
    errors.collect(cdk.propertyValidator('engineName', cdk.validateString)(properties.engineName));
    errors.collect(cdk.propertyValidator('extraConnectionAttributes', cdk.validateString)(properties.extraConnectionAttributes));
    errors.collect(cdk.propertyValidator('gcpMySqlSettings', CfnEndpoint_GcpMySQLSettingsPropertyValidator)(properties.gcpMySqlSettings));
    errors.collect(cdk.propertyValidator('ibmDb2Settings', CfnEndpoint_IbmDb2SettingsPropertyValidator)(properties.ibmDb2Settings));
    errors.collect(cdk.propertyValidator('kafkaSettings', CfnEndpoint_KafkaSettingsPropertyValidator)(properties.kafkaSettings));
    errors.collect(cdk.propertyValidator('kinesisSettings', CfnEndpoint_KinesisSettingsPropertyValidator)(properties.kinesisSettings));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('microsoftSqlServerSettings', CfnEndpoint_MicrosoftSqlServerSettingsPropertyValidator)(properties.microsoftSqlServerSettings));
    errors.collect(cdk.propertyValidator('mongoDbSettings', CfnEndpoint_MongoDbSettingsPropertyValidator)(properties.mongoDbSettings));
    errors.collect(cdk.propertyValidator('mySqlSettings', CfnEndpoint_MySqlSettingsPropertyValidator)(properties.mySqlSettings));
    errors.collect(cdk.propertyValidator('neptuneSettings', CfnEndpoint_NeptuneSettingsPropertyValidator)(properties.neptuneSettings));
    errors.collect(cdk.propertyValidator('oracleSettings', CfnEndpoint_OracleSettingsPropertyValidator)(properties.oracleSettings));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('postgreSqlSettings', CfnEndpoint_PostgreSqlSettingsPropertyValidator)(properties.postgreSqlSettings));
    errors.collect(cdk.propertyValidator('redisSettings', CfnEndpoint_RedisSettingsPropertyValidator)(properties.redisSettings));
    errors.collect(cdk.propertyValidator('redshiftSettings', CfnEndpoint_RedshiftSettingsPropertyValidator)(properties.redshiftSettings));
    errors.collect(cdk.propertyValidator('resourceIdentifier', cdk.validateString)(properties.resourceIdentifier));
    errors.collect(cdk.propertyValidator('s3Settings', CfnEndpoint_S3SettingsPropertyValidator)(properties.s3Settings));
    errors.collect(cdk.propertyValidator('serverName', cdk.validateString)(properties.serverName));
    errors.collect(cdk.propertyValidator('sslMode', cdk.validateString)(properties.sslMode));
    errors.collect(cdk.propertyValidator('sybaseSettings', CfnEndpoint_SybaseSettingsPropertyValidator)(properties.sybaseSettings));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "CfnEndpointProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint` resource
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint` resource.
 */
// @ts-ignore TS6133
function cfnEndpointPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpointPropsValidator(properties).assertSuccess();
    return {
        EndpointType: cdk.stringToCloudFormation(properties.endpointType),
        EngineName: cdk.stringToCloudFormation(properties.engineName),
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DocDbSettings: cfnEndpointDocDbSettingsPropertyToCloudFormation(properties.docDbSettings),
        DynamoDbSettings: cfnEndpointDynamoDbSettingsPropertyToCloudFormation(properties.dynamoDbSettings),
        ElasticsearchSettings: cfnEndpointElasticsearchSettingsPropertyToCloudFormation(properties.elasticsearchSettings),
        EndpointIdentifier: cdk.stringToCloudFormation(properties.endpointIdentifier),
        ExtraConnectionAttributes: cdk.stringToCloudFormation(properties.extraConnectionAttributes),
        GcpMySQLSettings: cfnEndpointGcpMySQLSettingsPropertyToCloudFormation(properties.gcpMySqlSettings),
        IbmDb2Settings: cfnEndpointIbmDb2SettingsPropertyToCloudFormation(properties.ibmDb2Settings),
        KafkaSettings: cfnEndpointKafkaSettingsPropertyToCloudFormation(properties.kafkaSettings),
        KinesisSettings: cfnEndpointKinesisSettingsPropertyToCloudFormation(properties.kinesisSettings),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        MicrosoftSqlServerSettings: cfnEndpointMicrosoftSqlServerSettingsPropertyToCloudFormation(properties.microsoftSqlServerSettings),
        MongoDbSettings: cfnEndpointMongoDbSettingsPropertyToCloudFormation(properties.mongoDbSettings),
        MySqlSettings: cfnEndpointMySqlSettingsPropertyToCloudFormation(properties.mySqlSettings),
        NeptuneSettings: cfnEndpointNeptuneSettingsPropertyToCloudFormation(properties.neptuneSettings),
        OracleSettings: cfnEndpointOracleSettingsPropertyToCloudFormation(properties.oracleSettings),
        Password: cdk.stringToCloudFormation(properties.password),
        Port: cdk.numberToCloudFormation(properties.port),
        PostgreSqlSettings: cfnEndpointPostgreSqlSettingsPropertyToCloudFormation(properties.postgreSqlSettings),
        RedisSettings: cfnEndpointRedisSettingsPropertyToCloudFormation(properties.redisSettings),
        RedshiftSettings: cfnEndpointRedshiftSettingsPropertyToCloudFormation(properties.redshiftSettings),
        ResourceIdentifier: cdk.stringToCloudFormation(properties.resourceIdentifier),
        S3Settings: cfnEndpointS3SettingsPropertyToCloudFormation(properties.s3Settings),
        ServerName: cdk.stringToCloudFormation(properties.serverName),
        SslMode: cdk.stringToCloudFormation(properties.sslMode),
        SybaseSettings: cfnEndpointSybaseSettingsPropertyToCloudFormation(properties.sybaseSettings),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointProps>();
    ret.addPropertyResult('endpointType', 'EndpointType', cfn_parse.FromCloudFormation.getString(properties.EndpointType));
    ret.addPropertyResult('engineName', 'EngineName', cfn_parse.FromCloudFormation.getString(properties.EngineName));
    ret.addPropertyResult('certificateArn', 'CertificateArn', properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('docDbSettings', 'DocDbSettings', properties.DocDbSettings != null ? CfnEndpointDocDbSettingsPropertyFromCloudFormation(properties.DocDbSettings) : undefined);
    ret.addPropertyResult('dynamoDbSettings', 'DynamoDbSettings', properties.DynamoDbSettings != null ? CfnEndpointDynamoDbSettingsPropertyFromCloudFormation(properties.DynamoDbSettings) : undefined);
    ret.addPropertyResult('elasticsearchSettings', 'ElasticsearchSettings', properties.ElasticsearchSettings != null ? CfnEndpointElasticsearchSettingsPropertyFromCloudFormation(properties.ElasticsearchSettings) : undefined);
    ret.addPropertyResult('endpointIdentifier', 'EndpointIdentifier', properties.EndpointIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointIdentifier) : undefined);
    ret.addPropertyResult('extraConnectionAttributes', 'ExtraConnectionAttributes', properties.ExtraConnectionAttributes != null ? cfn_parse.FromCloudFormation.getString(properties.ExtraConnectionAttributes) : undefined);
    ret.addPropertyResult('gcpMySqlSettings', 'GcpMySQLSettings', properties.GcpMySQLSettings != null ? CfnEndpointGcpMySQLSettingsPropertyFromCloudFormation(properties.GcpMySQLSettings) : undefined);
    ret.addPropertyResult('ibmDb2Settings', 'IbmDb2Settings', properties.IbmDb2Settings != null ? CfnEndpointIbmDb2SettingsPropertyFromCloudFormation(properties.IbmDb2Settings) : undefined);
    ret.addPropertyResult('kafkaSettings', 'KafkaSettings', properties.KafkaSettings != null ? CfnEndpointKafkaSettingsPropertyFromCloudFormation(properties.KafkaSettings) : undefined);
    ret.addPropertyResult('kinesisSettings', 'KinesisSettings', properties.KinesisSettings != null ? CfnEndpointKinesisSettingsPropertyFromCloudFormation(properties.KinesisSettings) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('microsoftSqlServerSettings', 'MicrosoftSqlServerSettings', properties.MicrosoftSqlServerSettings != null ? CfnEndpointMicrosoftSqlServerSettingsPropertyFromCloudFormation(properties.MicrosoftSqlServerSettings) : undefined);
    ret.addPropertyResult('mongoDbSettings', 'MongoDbSettings', properties.MongoDbSettings != null ? CfnEndpointMongoDbSettingsPropertyFromCloudFormation(properties.MongoDbSettings) : undefined);
    ret.addPropertyResult('mySqlSettings', 'MySqlSettings', properties.MySqlSettings != null ? CfnEndpointMySqlSettingsPropertyFromCloudFormation(properties.MySqlSettings) : undefined);
    ret.addPropertyResult('neptuneSettings', 'NeptuneSettings', properties.NeptuneSettings != null ? CfnEndpointNeptuneSettingsPropertyFromCloudFormation(properties.NeptuneSettings) : undefined);
    ret.addPropertyResult('oracleSettings', 'OracleSettings', properties.OracleSettings != null ? CfnEndpointOracleSettingsPropertyFromCloudFormation(properties.OracleSettings) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('postgreSqlSettings', 'PostgreSqlSettings', properties.PostgreSqlSettings != null ? CfnEndpointPostgreSqlSettingsPropertyFromCloudFormation(properties.PostgreSqlSettings) : undefined);
    ret.addPropertyResult('redisSettings', 'RedisSettings', properties.RedisSettings != null ? CfnEndpointRedisSettingsPropertyFromCloudFormation(properties.RedisSettings) : undefined);
    ret.addPropertyResult('redshiftSettings', 'RedshiftSettings', properties.RedshiftSettings != null ? CfnEndpointRedshiftSettingsPropertyFromCloudFormation(properties.RedshiftSettings) : undefined);
    ret.addPropertyResult('resourceIdentifier', 'ResourceIdentifier', properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined);
    ret.addPropertyResult('s3Settings', 'S3Settings', properties.S3Settings != null ? CfnEndpointS3SettingsPropertyFromCloudFormation(properties.S3Settings) : undefined);
    ret.addPropertyResult('serverName', 'ServerName', properties.ServerName != null ? cfn_parse.FromCloudFormation.getString(properties.ServerName) : undefined);
    ret.addPropertyResult('sslMode', 'SslMode', properties.SslMode != null ? cfn_parse.FromCloudFormation.getString(properties.SslMode) : undefined);
    ret.addPropertyResult('sybaseSettings', 'SybaseSettings', properties.SybaseSettings != null ? CfnEndpointSybaseSettingsPropertyFromCloudFormation(properties.SybaseSettings) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::Endpoint`
 *
 * The `AWS::DMS::Endpoint` resource specifies an AWS DMS endpoint.
 *
 * Currently, AWS CloudFormation supports all AWS DMS endpoint types.
 *
 * @cloudformationResource AWS::DMS::Endpoint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html
 */
export class CfnEndpoint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::Endpoint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpoint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEndpointPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEndpoint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A value that can be used for cross-account validation.
     * @cloudformationAttribute ExternalId
     */
    public readonly attrExternalId: string;

    /**
     * The type of endpoint. Valid values are `source` and `target` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointtype
     */
    public endpointType: string;

    /**
     * The type of engine for the endpoint, depending on the `EndpointType` value.
     *
     * *Valid values* : `mysql` | `oracle` | `postgres` | `mariadb` | `aurora` | `aurora-postgresql` | `opensearch` | `redshift` | `s3` | `db2` | `azuredb` | `sybase` | `dynamodb` | `mongodb` | `kinesis` | `kafka` | `elasticsearch` | `docdb` | `sqlserver` | `neptune`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-enginename
     */
    public engineName: string;

    /**
     * The Amazon Resource Name (ARN) for the certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-certificatearn
     */
    public certificateArn: string | undefined;

    /**
     * The name of the endpoint database. For a MySQL source or target endpoint, don't specify `DatabaseName` . To migrate to a specific database, use this setting and `targetDbType` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-databasename
     */
    public databaseName: string | undefined;

    /**
     * Settings in JSON format for the source and target DocumentDB endpoint. For more information about other available settings, see [Using extra connections attributes with Amazon DocumentDB as a source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DocumentDB.html#CHAP_Source.DocumentDB.ECAs) and [Using Amazon DocumentDB as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DocumentDB.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-docdbsettings
     */
    public docDbSettings: CfnEndpoint.DocDbSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target Amazon DynamoDB endpoint. For information about other available settings, see [Using object mapping to migrate data to DynamoDB](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DynamoDB.html#CHAP_Target.DynamoDB.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-dynamodbsettings
     */
    public dynamoDbSettings: CfnEndpoint.DynamoDbSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target OpenSearch endpoint. For more information about the available settings, see [Extra connection attributes when using OpenSearch as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Elasticsearch.html#CHAP_Target.Elasticsearch.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-elasticsearchsettings
     */
    public elasticsearchSettings: CfnEndpoint.ElasticsearchSettingsProperty | cdk.IResolvable | undefined;

    /**
     * The database endpoint identifier. Identifiers must begin with a letter and must contain only ASCII letters, digits, and hyphens. They can't end with a hyphen, or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-endpointidentifier
     */
    public endpointIdentifier: string | undefined;

    /**
     * Additional attributes associated with the connection. Each attribute is specified as a name-value pair associated by an equal sign (=). Multiple attributes are separated by a semicolon (;) with no additional white space. For information on the attributes available for connecting your source or target endpoint, see [Working with AWS DMS Endpoints](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Endpoints.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-extraconnectionattributes
     */
    public extraConnectionAttributes: string | undefined;

    /**
     * Settings in JSON format for the source GCP MySQL endpoint. These settings are much the same as the settings for any MySQL-compatible endpoint. For more information, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-gcpmysqlsettings
     */
    public gcpMySqlSettings: CfnEndpoint.GcpMySQLSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the source IBM Db2 LUW endpoint. For information about other available settings, see [Extra connection attributes when using Db2 LUW as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DB2.html#CHAP_Source.DB2.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-ibmdb2settings
     */
    public ibmDb2Settings: CfnEndpoint.IbmDb2SettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target Apache Kafka endpoint. For more information about other available settings, see [Using object mapping to migrate data to a Kafka topic](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kafka.html#CHAP_Target.Kafka.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kafkasettings
     */
    public kafkaSettings: CfnEndpoint.KafkaSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target endpoint for Amazon Kinesis Data Streams. For more information about other available settings, see [Using object mapping to migrate data to a Kinesis data stream](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kinesis.html#CHAP_Target.Kinesis.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kinesissettings
     */
    public kinesisSettings: CfnEndpoint.KinesisSettingsProperty | cdk.IResolvable | undefined;

    /**
     * An AWS KMS key identifier that is used to encrypt the connection parameters for the endpoint.
     *
     * If you don't specify a value for the `KmsKeyId` parameter, AWS DMS uses your default encryption key.
     *
     * AWS KMS creates the default encryption key for your AWS account . Your AWS account has a different default encryption key for each AWS Region .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Settings in JSON format for the source and target Microsoft SQL Server endpoint. For information about other available settings, see [Extra connection attributes when using SQL Server as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SQLServer.html#CHAP_Source.SQLServer.ConnectionAttrib) and [Extra connection attributes when using SQL Server as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SQLServer.html#CHAP_Target.SQLServer.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-microsoftsqlserversettings
     */
    public microsoftSqlServerSettings: CfnEndpoint.MicrosoftSqlServerSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the source MongoDB endpoint. For more information about the available settings, see [Using MongoDB as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MongoDB.html#CHAP_Source.MongoDB.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-mongodbsettings
     */
    public mongoDbSettings: CfnEndpoint.MongoDbSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the source and target MySQL endpoint. For information about other available settings, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) and [Extra connection attributes when using a MySQL-compatible database as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.MySQL.html#CHAP_Target.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-mysqlsettings
     */
    public mySqlSettings: CfnEndpoint.MySqlSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target Amazon Neptune endpoint. For more information about the available settings, see [Specifying endpoint settings for Amazon Neptune as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Neptune.html#CHAP_Target.Neptune.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-neptunesettings
     */
    public neptuneSettings: CfnEndpoint.NeptuneSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the source and target Oracle endpoint. For information about other available settings, see [Extra connection attributes when using Oracle as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.ConnectionAttrib) and [Extra connection attributes when using Oracle as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Oracle.html#CHAP_Target.Oracle.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-oraclesettings
     */
    public oracleSettings: CfnEndpoint.OracleSettingsProperty | cdk.IResolvable | undefined;

    /**
     * The password to be used to log in to the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-password
     */
    public password: string | undefined;

    /**
     * The port used by the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-port
     */
    public port: number | undefined;

    /**
     * Settings in JSON format for the source and target PostgreSQL endpoint.
     *
     * For information about other available settings, see [Extra connection attributes when using PostgreSQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.ConnectionAttrib) and [Extra connection attributes when using PostgreSQL as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.PostgreSQL.html#CHAP_Target.PostgreSQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-postgresqlsettings
     */
    public postgreSqlSettings: CfnEndpoint.PostgreSqlSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the target Redis endpoint. For information about other available settings, see [Specifying endpoint settings for Redis as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redis.html#CHAP_Target.Redis.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-redissettings
     */
    public redisSettings: CfnEndpoint.RedisSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Settings in JSON format for the Amazon Redshift endpoint.
     *
     * For more information about other available settings, see [Extra connection attributes when using Amazon Redshift as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redshift.html#CHAP_Target.Redshift.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-redshiftsettings
     */
    public redshiftSettings: CfnEndpoint.RedshiftSettingsProperty | cdk.IResolvable | undefined;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` .
     *
     * For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-resourceidentifier
     */
    public resourceIdentifier: string | undefined;

    /**
     * Settings in JSON format for the source and target Amazon S3 endpoint. For more information about other available settings, see [Extra connection attributes when using Amazon S3 as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.S3.html#CHAP_Source.S3.Configuring) and [Extra connection attributes when using Amazon S3 as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-s3settings
     */
    public s3Settings: CfnEndpoint.S3SettingsProperty | cdk.IResolvable | undefined;

    /**
     * The name of the server where the endpoint database resides.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-servername
     */
    public serverName: string | undefined;

    /**
     * The Secure Sockets Layer (SSL) mode to use for the SSL connection. The default is `none` .
     *
     * > When `engine_name` is set to S3, the only allowed value is `none` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-sslmode
     */
    public sslMode: string | undefined;

    /**
     * Settings in JSON format for the source and target SAP ASE endpoint. For information about other available settings, see [Extra connection attributes when using SAP ASE as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SAP.html#CHAP_Source.SAP.ConnectionAttrib) and [Extra connection attributes when using SAP ASE as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SAP.html#CHAP_Target.SAP.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-sybasesettings
     */
    public sybaseSettings: CfnEndpoint.SybaseSettingsProperty | cdk.IResolvable | undefined;

    /**
     * One or more tags to be assigned to the endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The user name to be used to log in to the endpoint database.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html#cfn-dms-endpoint-username
     */
    public username: string | undefined;

    /**
     * Create a new `AWS::DMS::Endpoint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEndpointProps) {
        super(scope, id, { type: CfnEndpoint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'endpointType', this);
        cdk.requireProperty(props, 'engineName', this);
        this.attrExternalId = cdk.Token.asString(this.getAtt('ExternalId', cdk.ResolutionTypeHint.STRING));

        this.endpointType = props.endpointType;
        this.engineName = props.engineName;
        this.certificateArn = props.certificateArn;
        this.databaseName = props.databaseName;
        this.docDbSettings = props.docDbSettings;
        this.dynamoDbSettings = props.dynamoDbSettings;
        this.elasticsearchSettings = props.elasticsearchSettings;
        this.endpointIdentifier = props.endpointIdentifier;
        this.extraConnectionAttributes = props.extraConnectionAttributes;
        this.gcpMySqlSettings = props.gcpMySqlSettings;
        this.ibmDb2Settings = props.ibmDb2Settings;
        this.kafkaSettings = props.kafkaSettings;
        this.kinesisSettings = props.kinesisSettings;
        this.kmsKeyId = props.kmsKeyId;
        this.microsoftSqlServerSettings = props.microsoftSqlServerSettings;
        this.mongoDbSettings = props.mongoDbSettings;
        this.mySqlSettings = props.mySqlSettings;
        this.neptuneSettings = props.neptuneSettings;
        this.oracleSettings = props.oracleSettings;
        this.password = props.password;
        this.port = props.port;
        this.postgreSqlSettings = props.postgreSqlSettings;
        this.redisSettings = props.redisSettings;
        this.redshiftSettings = props.redshiftSettings;
        this.resourceIdentifier = props.resourceIdentifier;
        this.s3Settings = props.s3Settings;
        this.serverName = props.serverName;
        this.sslMode = props.sslMode;
        this.sybaseSettings = props.sybaseSettings;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DMS::Endpoint", props.tags, { tagPropertyName: 'tags' });
        this.username = props.username;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpoint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            endpointType: this.endpointType,
            engineName: this.engineName,
            certificateArn: this.certificateArn,
            databaseName: this.databaseName,
            docDbSettings: this.docDbSettings,
            dynamoDbSettings: this.dynamoDbSettings,
            elasticsearchSettings: this.elasticsearchSettings,
            endpointIdentifier: this.endpointIdentifier,
            extraConnectionAttributes: this.extraConnectionAttributes,
            gcpMySqlSettings: this.gcpMySqlSettings,
            ibmDb2Settings: this.ibmDb2Settings,
            kafkaSettings: this.kafkaSettings,
            kinesisSettings: this.kinesisSettings,
            kmsKeyId: this.kmsKeyId,
            microsoftSqlServerSettings: this.microsoftSqlServerSettings,
            mongoDbSettings: this.mongoDbSettings,
            mySqlSettings: this.mySqlSettings,
            neptuneSettings: this.neptuneSettings,
            oracleSettings: this.oracleSettings,
            password: this.password,
            port: this.port,
            postgreSqlSettings: this.postgreSqlSettings,
            redisSettings: this.redisSettings,
            redshiftSettings: this.redshiftSettings,
            resourceIdentifier: this.resourceIdentifier,
            s3Settings: this.s3Settings,
            serverName: this.serverName,
            sslMode: this.sslMode,
            sybaseSettings: this.sybaseSettings,
            tags: this.tags.renderTags(),
            username: this.username,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEndpointPropsToCloudFormation(props);
    }
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a DocumentDB endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Using extra connections attributes with Amazon DocumentDB as a source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DocumentDB.html#CHAP_Source.DocumentDB.ECAs) and [Using Amazon DocumentDB as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DocumentDB.html) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html
     */
    export interface DocDbSettingsProperty {
        /**
         * Indicates the number of documents to preview to determine the document organization. Use this setting when `NestingLevel` is set to `"one"` .
         *
         * Must be a positive value greater than `0` . Default value is `1000` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html#cfn-dms-endpoint-docdbsettings-docstoinvestigate
         */
        readonly docsToInvestigate?: number;
        /**
         * Specifies the document ID. Use this setting when `NestingLevel` is set to `"none"` .
         *
         * Default value is `"false"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html#cfn-dms-endpoint-docdbsettings-extractdocid
         */
        readonly extractDocId?: boolean | cdk.IResolvable;
        /**
         * Specifies either document or table mode.
         *
         * Default value is `"none"` . Specify `"none"` to use document mode. Specify `"one"` to use table mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html#cfn-dms-endpoint-docdbsettings-nestinglevel
         */
        readonly nestingLevel?: string;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the DocumentDB endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html#cfn-dms-endpoint-docdbsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the DocumentDB endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-docdbsettings.html#cfn-dms-endpoint-docdbsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DocDbSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DocDbSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_DocDbSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('docsToInvestigate', cdk.validateNumber)(properties.docsToInvestigate));
    errors.collect(cdk.propertyValidator('extractDocId', cdk.validateBoolean)(properties.extractDocId));
    errors.collect(cdk.propertyValidator('nestingLevel', cdk.validateString)(properties.nestingLevel));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    return errors.wrap('supplied properties not correct for "DocDbSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.DocDbSettings` resource
 *
 * @param properties - the TypeScript properties of a `DocDbSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.DocDbSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointDocDbSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_DocDbSettingsPropertyValidator(properties).assertSuccess();
    return {
        DocsToInvestigate: cdk.numberToCloudFormation(properties.docsToInvestigate),
        ExtractDocId: cdk.booleanToCloudFormation(properties.extractDocId),
        NestingLevel: cdk.stringToCloudFormation(properties.nestingLevel),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
    };
}

// @ts-ignore TS6133
function CfnEndpointDocDbSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.DocDbSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.DocDbSettingsProperty>();
    ret.addPropertyResult('docsToInvestigate', 'DocsToInvestigate', properties.DocsToInvestigate != null ? cfn_parse.FromCloudFormation.getNumber(properties.DocsToInvestigate) : undefined);
    ret.addPropertyResult('extractDocId', 'ExtractDocId', properties.ExtractDocId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExtractDocId) : undefined);
    ret.addPropertyResult('nestingLevel', 'NestingLevel', properties.NestingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.NestingLevel) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information, including the Amazon Resource Name (ARN) of the IAM role used to define an Amazon DynamoDB target endpoint. This information also includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Using object mapping to migrate data to DynamoDB](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.DynamoDB.html#CHAP_Target.DynamoDB.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html
     */
    export interface DynamoDbSettingsProperty {
        /**
         * The Amazon Resource Name (ARN) used by the service to access the IAM role. The role must allow the `iam:PassRole` action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-dynamodbsettings.html#cfn-dms-endpoint-dynamodbsettings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DynamoDbSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDbSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_DynamoDbSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    return errors.wrap('supplied properties not correct for "DynamoDbSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.DynamoDbSettings` resource
 *
 * @param properties - the TypeScript properties of a `DynamoDbSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.DynamoDbSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointDynamoDbSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_DynamoDbSettingsPropertyValidator(properties).assertSuccess();
    return {
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
    };
}

// @ts-ignore TS6133
function CfnEndpointDynamoDbSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.DynamoDbSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.DynamoDbSettingsProperty>();
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an OpenSearch endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about the available settings, see [Extra connection attributes when using OpenSearch as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Elasticsearch.html#CHAP_Target.Elasticsearch.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-elasticsearchsettings.html
     */
    export interface ElasticsearchSettingsProperty {
        /**
         * The endpoint for the OpenSearch cluster. AWS DMS uses HTTPS if a transport protocol (either HTTP or HTTPS) isn't specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-elasticsearchsettings.html#cfn-dms-endpoint-elasticsearchsettings-endpointuri
         */
        readonly endpointUri?: string;
        /**
         * The maximum number of seconds for which DMS retries failed API requests to the OpenSearch cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-elasticsearchsettings.html#cfn-dms-endpoint-elasticsearchsettings-errorretryduration
         */
        readonly errorRetryDuration?: number;
        /**
         * The maximum percentage of records that can fail to be written before a full load operation stops.
         *
         * To avoid early failure, this counter is only effective after 1,000 records are transferred. OpenSearch also has the concept of error monitoring during the last 10 minutes of an Observation Window. If transfer of all records fail in the last 10 minutes, the full load operation stops.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-elasticsearchsettings.html#cfn-dms-endpoint-elasticsearchsettings-fullloaderrorpercentage
         */
        readonly fullLoadErrorPercentage?: number;
        /**
         * The Amazon Resource Name (ARN) used by the service to access the IAM role. The role must allow the `iam:PassRole` action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-elasticsearchsettings.html#cfn-dms-endpoint-elasticsearchsettings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ElasticsearchSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_ElasticsearchSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpointUri', cdk.validateString)(properties.endpointUri));
    errors.collect(cdk.propertyValidator('errorRetryDuration', cdk.validateNumber)(properties.errorRetryDuration));
    errors.collect(cdk.propertyValidator('fullLoadErrorPercentage', cdk.validateNumber)(properties.fullLoadErrorPercentage));
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    return errors.wrap('supplied properties not correct for "ElasticsearchSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.ElasticsearchSettings` resource
 *
 * @param properties - the TypeScript properties of a `ElasticsearchSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.ElasticsearchSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointElasticsearchSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_ElasticsearchSettingsPropertyValidator(properties).assertSuccess();
    return {
        EndpointUri: cdk.stringToCloudFormation(properties.endpointUri),
        ErrorRetryDuration: cdk.numberToCloudFormation(properties.errorRetryDuration),
        FullLoadErrorPercentage: cdk.numberToCloudFormation(properties.fullLoadErrorPercentage),
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
    };
}

// @ts-ignore TS6133
function CfnEndpointElasticsearchSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.ElasticsearchSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.ElasticsearchSettingsProperty>();
    ret.addPropertyResult('endpointUri', 'EndpointUri', properties.EndpointUri != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointUri) : undefined);
    ret.addPropertyResult('errorRetryDuration', 'ErrorRetryDuration', properties.ErrorRetryDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorRetryDuration) : undefined);
    ret.addPropertyResult('fullLoadErrorPercentage', 'FullLoadErrorPercentage', properties.FullLoadErrorPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.FullLoadErrorPercentage) : undefined);
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a GCP MySQL endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. These settings are much the same as the settings for any MySQL-compatible endpoint. For more information, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html
     */
    export interface GcpMySQLSettingsProperty {
        /**
         * Specifies a script to run immediately after AWS DMS connects to the endpoint. The migration task continues running regardless if the SQL statement succeeds or fails.
         *
         * For this parameter, provide the code of the script itself, not the name of a file containing the script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-afterconnectscript
         */
        readonly afterConnectScript?: string;
        /**
         * Adjusts the behavior of AWS DMS when migrating from an SQL Server source database that is hosted as part of an Always On availability group cluster. If you need AWS DMS to poll all the nodes in the Always On cluster for transaction backups, set this attribute to `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-cleansourcemetadataonmismatch
         */
        readonly cleanSourceMetadataOnMismatch?: boolean | cdk.IResolvable;
        /**
         * Database name for the endpoint. For a MySQL source or target endpoint, don't explicitly specify the database using the `DatabaseName` request parameter on either the `CreateEndpoint` or `ModifyEndpoint` API call. Specifying `DatabaseName` when you create or modify a MySQL endpoint replicates all the task tables to this single database. For MySQL endpoints, you specify the database only when you specify the schema in the table-mapping rules of the AWS DMS task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-databasename
         */
        readonly databaseName?: string;
        /**
         * Specifies how often to check the binary log for new changes/events when the database is idle. The default is five seconds.
         *
         * Example: `eventsPollInterval=5;`
         *
         * In the example, AWS DMS checks for changes in the binary logs every five seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-eventspollinterval
         */
        readonly eventsPollInterval?: number;
        /**
         * Specifies the maximum size (in KB) of any .csv file used to transfer data to a MySQL-compatible database.
         *
         * Example: `maxFileSize=512`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * Improves performance when loading data into the MySQL-compatible target database. Specifies how many threads to use to load the data into the MySQL-compatible target database. Setting a large number of threads can have an adverse effect on database performance, because a separate connection is required for each thread. The default is one.
         *
         * Example: `parallelLoadThreads=1`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-parallelloadthreads
         */
        readonly parallelLoadThreads?: number;
        /**
         * Endpoint connection password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-password
         */
        readonly password?: string;
        /**
         * The port used by the endpoint database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-port
         */
        readonly port?: number;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret.` The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the MySQL endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the MySQL endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * Endpoint TCP port.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-servername
         */
        readonly serverName?: string;
        /**
         * Specifies the time zone for the source MySQL database. Don't enclose time zones in single quotation marks.
         *
         * Example: `serverTimezone=US/Pacific;`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-servertimezone
         */
        readonly serverTimezone?: string;
        /**
         * Endpoint connection user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-gcpmysqlsettings.html#cfn-dms-endpoint-gcpmysqlsettings-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GcpMySQLSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `GcpMySQLSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_GcpMySQLSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('afterConnectScript', cdk.validateString)(properties.afterConnectScript));
    errors.collect(cdk.propertyValidator('cleanSourceMetadataOnMismatch', cdk.validateBoolean)(properties.cleanSourceMetadataOnMismatch));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('eventsPollInterval', cdk.validateNumber)(properties.eventsPollInterval));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('parallelLoadThreads', cdk.validateNumber)(properties.parallelLoadThreads));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('serverName', cdk.validateString)(properties.serverName));
    errors.collect(cdk.propertyValidator('serverTimezone', cdk.validateString)(properties.serverTimezone));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "GcpMySQLSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.GcpMySQLSettings` resource
 *
 * @param properties - the TypeScript properties of a `GcpMySQLSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.GcpMySQLSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointGcpMySQLSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_GcpMySQLSettingsPropertyValidator(properties).assertSuccess();
    return {
        AfterConnectScript: cdk.stringToCloudFormation(properties.afterConnectScript),
        CleanSourceMetadataOnMismatch: cdk.booleanToCloudFormation(properties.cleanSourceMetadataOnMismatch),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        EventsPollInterval: cdk.numberToCloudFormation(properties.eventsPollInterval),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        ParallelLoadThreads: cdk.numberToCloudFormation(properties.parallelLoadThreads),
        Password: cdk.stringToCloudFormation(properties.password),
        Port: cdk.numberToCloudFormation(properties.port),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        ServerName: cdk.stringToCloudFormation(properties.serverName),
        ServerTimezone: cdk.stringToCloudFormation(properties.serverTimezone),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnEndpointGcpMySQLSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.GcpMySQLSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.GcpMySQLSettingsProperty>();
    ret.addPropertyResult('afterConnectScript', 'AfterConnectScript', properties.AfterConnectScript != null ? cfn_parse.FromCloudFormation.getString(properties.AfterConnectScript) : undefined);
    ret.addPropertyResult('cleanSourceMetadataOnMismatch', 'CleanSourceMetadataOnMismatch', properties.CleanSourceMetadataOnMismatch != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CleanSourceMetadataOnMismatch) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('eventsPollInterval', 'EventsPollInterval', properties.EventsPollInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.EventsPollInterval) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('parallelLoadThreads', 'ParallelLoadThreads', properties.ParallelLoadThreads != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelLoadThreads) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('serverName', 'ServerName', properties.ServerName != null ? cfn_parse.FromCloudFormation.getString(properties.ServerName) : undefined);
    ret.addPropertyResult('serverTimezone', 'ServerTimezone', properties.ServerTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ServerTimezone) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an IBMDB2 endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Extra connection attributes when using Db2 LUW as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.DB2.html#CHAP_Source.DB2.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html
     */
    export interface IbmDb2SettingsProperty {
        /**
         * For ongoing replication (CDC), use CurrentLSN to specify a log sequence number (LSN) where you want the replication to start.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html#cfn-dms-endpoint-ibmdb2settings-currentlsn
         */
        readonly currentLsn?: string;
        /**
         * Maximum number of bytes per read, as a NUMBER value. The default is 64 KB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html#cfn-dms-endpoint-ibmdb2settings-maxkbytesperread
         */
        readonly maxKBytesPerRead?: number;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value ofthe AWS Secrets Manager secret that allows access to the Db2 LUW endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html#cfn-dms-endpoint-ibmdb2settings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the IBMDB2 endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html#cfn-dms-endpoint-ibmdb2settings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * Enables ongoing replication (CDC) as a BOOLEAN value. The default is true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-ibmdb2settings.html#cfn-dms-endpoint-ibmdb2settings-setdatacapturechanges
         */
        readonly setDataCaptureChanges?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IbmDb2SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `IbmDb2SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_IbmDb2SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('currentLsn', cdk.validateString)(properties.currentLsn));
    errors.collect(cdk.propertyValidator('maxKBytesPerRead', cdk.validateNumber)(properties.maxKBytesPerRead));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('setDataCaptureChanges', cdk.validateBoolean)(properties.setDataCaptureChanges));
    return errors.wrap('supplied properties not correct for "IbmDb2SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.IbmDb2Settings` resource
 *
 * @param properties - the TypeScript properties of a `IbmDb2SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.IbmDb2Settings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointIbmDb2SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_IbmDb2SettingsPropertyValidator(properties).assertSuccess();
    return {
        CurrentLsn: cdk.stringToCloudFormation(properties.currentLsn),
        MaxKBytesPerRead: cdk.numberToCloudFormation(properties.maxKBytesPerRead),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        SetDataCaptureChanges: cdk.booleanToCloudFormation(properties.setDataCaptureChanges),
    };
}

// @ts-ignore TS6133
function CfnEndpointIbmDb2SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.IbmDb2SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.IbmDb2SettingsProperty>();
    ret.addPropertyResult('currentLsn', 'CurrentLsn', properties.CurrentLsn != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentLsn) : undefined);
    ret.addPropertyResult('maxKBytesPerRead', 'MaxKBytesPerRead', properties.MaxKBytesPerRead != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxKBytesPerRead) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('setDataCaptureChanges', 'SetDataCaptureChanges', properties.SetDataCaptureChanges != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SetDataCaptureChanges) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that describes an Apache Kafka endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Using object mapping to migrate data to a Kafka topic](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kafka.html#CHAP_Target.Kafka.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html
     */
    export interface KafkaSettingsProperty {
        /**
         * A comma-separated list of one or more broker locations in your Kafka cluster that host your Kafka instance. Specify each broker location in the form `*broker-hostname-or-ip* : *port*` . For example, `"ec2-12-345-678-901.compute-1.amazonaws.com:2345"` . For more information and examples of specifying a list of broker locations, see [Using Apache Kafka as a target for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kafka.html) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-broker
         */
        readonly broker?: string;
        /**
         * Shows detailed control information for table definition, column definition, and table and column changes in the Kafka message output. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-includecontroldetails
         */
        readonly includeControlDetails?: boolean | cdk.IResolvable;
        /**
         * Include NULL and empty columns for records migrated to the endpoint. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-includenullandempty
         */
        readonly includeNullAndEmpty?: boolean | cdk.IResolvable;
        /**
         * Shows the partition value within the Kafka message output unless the partition type is `schema-table-type` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-includepartitionvalue
         */
        readonly includePartitionValue?: boolean | cdk.IResolvable;
        /**
         * Includes any data definition language (DDL) operations that change the table in the control data, such as `rename-table` , `drop-table` , `add-column` , `drop-column` , and `rename-column` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-includetablealteroperations
         */
        readonly includeTableAlterOperations?: boolean | cdk.IResolvable;
        /**
         * Provides detailed transaction information from the source database. This information includes a commit timestamp, a log position, and values for `transaction_id` , previous `transaction_id` , and `transaction_record_id` (the record offset within a transaction). The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-includetransactiondetails
         */
        readonly includeTransactionDetails?: boolean | cdk.IResolvable;
        /**
         * The output format for the records created on the endpoint. The message format is `JSON` (default) or `JSON_UNFORMATTED` (a single line with no tab).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-messageformat
         */
        readonly messageFormat?: string;
        /**
         * The maximum size in bytes for records created on the endpoint The default is 1,000,000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-messagemaxbytes
         */
        readonly messageMaxBytes?: number;
        /**
         * Set this optional parameter to `true` to avoid adding a '0x' prefix to raw data in hexadecimal format. For example, by default, AWS DMS adds a '0x' prefix to the LOB column type in hexadecimal format moving from an Oracle source to a Kafka target. Use the `NoHexPrefix` endpoint setting to enable migration of RAW data type columns without adding the '0x' prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-nohexprefix
         */
        readonly noHexPrefix?: boolean | cdk.IResolvable;
        /**
         * Prefixes schema and table names to partition values, when the partition type is `primary-key-type` . Doing this increases data distribution among Kafka partitions. For example, suppose that a SysBench schema has thousands of tables and each table has only limited range for a primary key. In this case, the same primary key is sent from thousands of tables to the same partition, which causes throttling. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-partitionincludeschematable
         */
        readonly partitionIncludeSchemaTable?: boolean | cdk.IResolvable;
        /**
         * The secure password that you created when you first set up your Amazon MSK cluster to validate a client identity and make an encrypted connection between server and client using SASL-SSL authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-saslpassword
         */
        readonly saslPassword?: string;
        /**
         * The secure user name you created when you first set up your Amazon MSK cluster to validate a client identity and make an encrypted connection between server and client using SASL-SSL authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-saslusername
         */
        readonly saslUserName?: string;
        /**
         * Set secure connection to a Kafka target endpoint using Transport Layer Security (TLS). Options include `ssl-encryption` , `ssl-authentication` , and `sasl-ssl` . `sasl-ssl` requires `SaslUsername` and `SaslPassword` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-securityprotocol
         */
        readonly securityProtocol?: string;
        /**
         * The Amazon Resource Name (ARN) for the private certificate authority (CA) cert that AWS DMS uses to securely connect to your Kafka target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-sslcacertificatearn
         */
        readonly sslCaCertificateArn?: string;
        /**
         * The Amazon Resource Name (ARN) of the client certificate used to securely connect to a Kafka target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-sslclientcertificatearn
         */
        readonly sslClientCertificateArn?: string;
        /**
         * The Amazon Resource Name (ARN) for the client private key used to securely connect to a Kafka target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-sslclientkeyarn
         */
        readonly sslClientKeyArn?: string;
        /**
         * The password for the client private key used to securely connect to a Kafka target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-sslclientkeypassword
         */
        readonly sslClientKeyPassword?: string;
        /**
         * The topic to which you migrate the data. If you don't specify a topic, AWS DMS specifies `"kafka-default-topic"` as the migration topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kafkasettings.html#cfn-dms-endpoint-kafkasettings-topic
         */
        readonly topic?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KafkaSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `KafkaSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_KafkaSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('broker', cdk.validateString)(properties.broker));
    errors.collect(cdk.propertyValidator('includeControlDetails', cdk.validateBoolean)(properties.includeControlDetails));
    errors.collect(cdk.propertyValidator('includeNullAndEmpty', cdk.validateBoolean)(properties.includeNullAndEmpty));
    errors.collect(cdk.propertyValidator('includePartitionValue', cdk.validateBoolean)(properties.includePartitionValue));
    errors.collect(cdk.propertyValidator('includeTableAlterOperations', cdk.validateBoolean)(properties.includeTableAlterOperations));
    errors.collect(cdk.propertyValidator('includeTransactionDetails', cdk.validateBoolean)(properties.includeTransactionDetails));
    errors.collect(cdk.propertyValidator('messageFormat', cdk.validateString)(properties.messageFormat));
    errors.collect(cdk.propertyValidator('messageMaxBytes', cdk.validateNumber)(properties.messageMaxBytes));
    errors.collect(cdk.propertyValidator('noHexPrefix', cdk.validateBoolean)(properties.noHexPrefix));
    errors.collect(cdk.propertyValidator('partitionIncludeSchemaTable', cdk.validateBoolean)(properties.partitionIncludeSchemaTable));
    errors.collect(cdk.propertyValidator('saslPassword', cdk.validateString)(properties.saslPassword));
    errors.collect(cdk.propertyValidator('saslUserName', cdk.validateString)(properties.saslUserName));
    errors.collect(cdk.propertyValidator('securityProtocol', cdk.validateString)(properties.securityProtocol));
    errors.collect(cdk.propertyValidator('sslCaCertificateArn', cdk.validateString)(properties.sslCaCertificateArn));
    errors.collect(cdk.propertyValidator('sslClientCertificateArn', cdk.validateString)(properties.sslClientCertificateArn));
    errors.collect(cdk.propertyValidator('sslClientKeyArn', cdk.validateString)(properties.sslClientKeyArn));
    errors.collect(cdk.propertyValidator('sslClientKeyPassword', cdk.validateString)(properties.sslClientKeyPassword));
    errors.collect(cdk.propertyValidator('topic', cdk.validateString)(properties.topic));
    return errors.wrap('supplied properties not correct for "KafkaSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.KafkaSettings` resource
 *
 * @param properties - the TypeScript properties of a `KafkaSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.KafkaSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointKafkaSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_KafkaSettingsPropertyValidator(properties).assertSuccess();
    return {
        Broker: cdk.stringToCloudFormation(properties.broker),
        IncludeControlDetails: cdk.booleanToCloudFormation(properties.includeControlDetails),
        IncludeNullAndEmpty: cdk.booleanToCloudFormation(properties.includeNullAndEmpty),
        IncludePartitionValue: cdk.booleanToCloudFormation(properties.includePartitionValue),
        IncludeTableAlterOperations: cdk.booleanToCloudFormation(properties.includeTableAlterOperations),
        IncludeTransactionDetails: cdk.booleanToCloudFormation(properties.includeTransactionDetails),
        MessageFormat: cdk.stringToCloudFormation(properties.messageFormat),
        MessageMaxBytes: cdk.numberToCloudFormation(properties.messageMaxBytes),
        NoHexPrefix: cdk.booleanToCloudFormation(properties.noHexPrefix),
        PartitionIncludeSchemaTable: cdk.booleanToCloudFormation(properties.partitionIncludeSchemaTable),
        SaslPassword: cdk.stringToCloudFormation(properties.saslPassword),
        SaslUserName: cdk.stringToCloudFormation(properties.saslUserName),
        SecurityProtocol: cdk.stringToCloudFormation(properties.securityProtocol),
        SslCaCertificateArn: cdk.stringToCloudFormation(properties.sslCaCertificateArn),
        SslClientCertificateArn: cdk.stringToCloudFormation(properties.sslClientCertificateArn),
        SslClientKeyArn: cdk.stringToCloudFormation(properties.sslClientKeyArn),
        SslClientKeyPassword: cdk.stringToCloudFormation(properties.sslClientKeyPassword),
        Topic: cdk.stringToCloudFormation(properties.topic),
    };
}

// @ts-ignore TS6133
function CfnEndpointKafkaSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.KafkaSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.KafkaSettingsProperty>();
    ret.addPropertyResult('broker', 'Broker', properties.Broker != null ? cfn_parse.FromCloudFormation.getString(properties.Broker) : undefined);
    ret.addPropertyResult('includeControlDetails', 'IncludeControlDetails', properties.IncludeControlDetails != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeControlDetails) : undefined);
    ret.addPropertyResult('includeNullAndEmpty', 'IncludeNullAndEmpty', properties.IncludeNullAndEmpty != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeNullAndEmpty) : undefined);
    ret.addPropertyResult('includePartitionValue', 'IncludePartitionValue', properties.IncludePartitionValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludePartitionValue) : undefined);
    ret.addPropertyResult('includeTableAlterOperations', 'IncludeTableAlterOperations', properties.IncludeTableAlterOperations != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTableAlterOperations) : undefined);
    ret.addPropertyResult('includeTransactionDetails', 'IncludeTransactionDetails', properties.IncludeTransactionDetails != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTransactionDetails) : undefined);
    ret.addPropertyResult('messageFormat', 'MessageFormat', properties.MessageFormat != null ? cfn_parse.FromCloudFormation.getString(properties.MessageFormat) : undefined);
    ret.addPropertyResult('messageMaxBytes', 'MessageMaxBytes', properties.MessageMaxBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessageMaxBytes) : undefined);
    ret.addPropertyResult('noHexPrefix', 'NoHexPrefix', properties.NoHexPrefix != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoHexPrefix) : undefined);
    ret.addPropertyResult('partitionIncludeSchemaTable', 'PartitionIncludeSchemaTable', properties.PartitionIncludeSchemaTable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PartitionIncludeSchemaTable) : undefined);
    ret.addPropertyResult('saslPassword', 'SaslPassword', properties.SaslPassword != null ? cfn_parse.FromCloudFormation.getString(properties.SaslPassword) : undefined);
    ret.addPropertyResult('saslUserName', 'SaslUserName', properties.SaslUserName != null ? cfn_parse.FromCloudFormation.getString(properties.SaslUserName) : undefined);
    ret.addPropertyResult('securityProtocol', 'SecurityProtocol', properties.SecurityProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityProtocol) : undefined);
    ret.addPropertyResult('sslCaCertificateArn', 'SslCaCertificateArn', properties.SslCaCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.SslCaCertificateArn) : undefined);
    ret.addPropertyResult('sslClientCertificateArn', 'SslClientCertificateArn', properties.SslClientCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.SslClientCertificateArn) : undefined);
    ret.addPropertyResult('sslClientKeyArn', 'SslClientKeyArn', properties.SslClientKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.SslClientKeyArn) : undefined);
    ret.addPropertyResult('sslClientKeyPassword', 'SslClientKeyPassword', properties.SslClientKeyPassword != null ? cfn_parse.FromCloudFormation.getString(properties.SslClientKeyPassword) : undefined);
    ret.addPropertyResult('topic', 'Topic', properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that describes an Amazon Kinesis Data Stream endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Using object mapping to migrate data to a Kinesis data stream](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Kinesis.html#CHAP_Target.Kinesis.ObjectMapping) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html
     */
    export interface KinesisSettingsProperty {
        /**
         * Shows detailed control information for table definition, column definition, and table and column changes in the Kinesis message output. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-includecontroldetails
         */
        readonly includeControlDetails?: boolean | cdk.IResolvable;
        /**
         * Include NULL and empty columns for records migrated to the endpoint. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-includenullandempty
         */
        readonly includeNullAndEmpty?: boolean | cdk.IResolvable;
        /**
         * Shows the partition value within the Kinesis message output, unless the partition type is `schema-table-type` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-includepartitionvalue
         */
        readonly includePartitionValue?: boolean | cdk.IResolvable;
        /**
         * Includes any data definition language (DDL) operations that change the table in the control data, such as `rename-table` , `drop-table` , `add-column` , `drop-column` , and `rename-column` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-includetablealteroperations
         */
        readonly includeTableAlterOperations?: boolean | cdk.IResolvable;
        /**
         * Provides detailed transaction information from the source database. This information includes a commit timestamp, a log position, and values for `transaction_id` , previous `transaction_id` , and `transaction_record_id` (the record offset within a transaction). The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-includetransactiondetails
         */
        readonly includeTransactionDetails?: boolean | cdk.IResolvable;
        /**
         * The output format for the records created on the endpoint. The message format is `JSON` (default) or `JSON_UNFORMATTED` (a single line with no tab).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-messageformat
         */
        readonly messageFormat?: string;
        /**
         * Set this optional parameter to `true` to avoid adding a '0x' prefix to raw data in hexadecimal format. For example, by default, AWS DMS adds a '0x' prefix to the LOB column type in hexadecimal format moving from an Oracle source to an Amazon Kinesis target. Use the `NoHexPrefix` endpoint setting to enable migration of RAW data type columns without adding the '0x' prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-nohexprefix
         */
        readonly noHexPrefix?: boolean | cdk.IResolvable;
        /**
         * Prefixes schema and table names to partition values, when the partition type is `primary-key-type` . Doing this increases data distribution among Kinesis shards. For example, suppose that a SysBench schema has thousands of tables and each table has only limited range for a primary key. In this case, the same primary key is sent from thousands of tables to the same shard, which causes throttling. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-partitionincludeschematable
         */
        readonly partitionIncludeSchemaTable?: boolean | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) for the IAM role that AWS DMS uses to write to the Kinesis data stream. The role must allow the `iam:PassRole` action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
        /**
         * The Amazon Resource Name (ARN) for the Amazon Kinesis Data Streams endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-kinesissettings.html#cfn-dms-endpoint-kinesissettings-streamarn
         */
        readonly streamArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_KinesisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('includeControlDetails', cdk.validateBoolean)(properties.includeControlDetails));
    errors.collect(cdk.propertyValidator('includeNullAndEmpty', cdk.validateBoolean)(properties.includeNullAndEmpty));
    errors.collect(cdk.propertyValidator('includePartitionValue', cdk.validateBoolean)(properties.includePartitionValue));
    errors.collect(cdk.propertyValidator('includeTableAlterOperations', cdk.validateBoolean)(properties.includeTableAlterOperations));
    errors.collect(cdk.propertyValidator('includeTransactionDetails', cdk.validateBoolean)(properties.includeTransactionDetails));
    errors.collect(cdk.propertyValidator('messageFormat', cdk.validateString)(properties.messageFormat));
    errors.collect(cdk.propertyValidator('noHexPrefix', cdk.validateBoolean)(properties.noHexPrefix));
    errors.collect(cdk.propertyValidator('partitionIncludeSchemaTable', cdk.validateBoolean)(properties.partitionIncludeSchemaTable));
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "KinesisSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.KinesisSettings` resource
 *
 * @param properties - the TypeScript properties of a `KinesisSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.KinesisSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointKinesisSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_KinesisSettingsPropertyValidator(properties).assertSuccess();
    return {
        IncludeControlDetails: cdk.booleanToCloudFormation(properties.includeControlDetails),
        IncludeNullAndEmpty: cdk.booleanToCloudFormation(properties.includeNullAndEmpty),
        IncludePartitionValue: cdk.booleanToCloudFormation(properties.includePartitionValue),
        IncludeTableAlterOperations: cdk.booleanToCloudFormation(properties.includeTableAlterOperations),
        IncludeTransactionDetails: cdk.booleanToCloudFormation(properties.includeTransactionDetails),
        MessageFormat: cdk.stringToCloudFormation(properties.messageFormat),
        NoHexPrefix: cdk.booleanToCloudFormation(properties.noHexPrefix),
        PartitionIncludeSchemaTable: cdk.booleanToCloudFormation(properties.partitionIncludeSchemaTable),
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
        StreamArn: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnEndpointKinesisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.KinesisSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.KinesisSettingsProperty>();
    ret.addPropertyResult('includeControlDetails', 'IncludeControlDetails', properties.IncludeControlDetails != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeControlDetails) : undefined);
    ret.addPropertyResult('includeNullAndEmpty', 'IncludeNullAndEmpty', properties.IncludeNullAndEmpty != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeNullAndEmpty) : undefined);
    ret.addPropertyResult('includePartitionValue', 'IncludePartitionValue', properties.IncludePartitionValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludePartitionValue) : undefined);
    ret.addPropertyResult('includeTableAlterOperations', 'IncludeTableAlterOperations', properties.IncludeTableAlterOperations != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTableAlterOperations) : undefined);
    ret.addPropertyResult('includeTransactionDetails', 'IncludeTransactionDetails', properties.IncludeTransactionDetails != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeTransactionDetails) : undefined);
    ret.addPropertyResult('messageFormat', 'MessageFormat', properties.MessageFormat != null ? cfn_parse.FromCloudFormation.getString(properties.MessageFormat) : undefined);
    ret.addPropertyResult('noHexPrefix', 'NoHexPrefix', properties.NoHexPrefix != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoHexPrefix) : undefined);
    ret.addPropertyResult('partitionIncludeSchemaTable', 'PartitionIncludeSchemaTable', properties.PartitionIncludeSchemaTable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PartitionIncludeSchemaTable) : undefined);
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addPropertyResult('streamArn', 'StreamArn', properties.StreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.StreamArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a Microsoft SQL Server endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Extra connection attributes when using SQL Server as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SQLServer.html#CHAP_Source.SQLServer.ConnectionAttrib) and [Extra connection attributes when using SQL Server as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SQLServer.html#CHAP_Target.SQLServer.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html
     */
    export interface MicrosoftSqlServerSettingsProperty {
        /**
         * The maximum size of the packets (in bytes) used to transfer data using BCP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-bcppacketsize
         */
        readonly bcpPacketSize?: number;
        /**
         * Specifies a file group for the AWS DMS internal tables. When the replication task starts, all the internal AWS DMS control tables (awsdms_ apply_exception, awsdms_apply, awsdms_changes) are created for the specified file group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-controltablesfilegroup
         */
        readonly controlTablesFileGroup?: string;
        /**
         * Cleans and recreates table metadata information on the replication instance when a mismatch occurs. An example is a situation where running an alter DDL statement on a table might result in different information about the table cached in the replication instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-querysinglealwaysonnode
         */
        readonly querySingleAlwaysOnNode?: boolean | cdk.IResolvable;
        /**
         * When this attribute is set to `Y` , AWS DMS only reads changes from transaction log backups and doesn't read from the active transaction log file during ongoing replication. Setting this parameter to `Y` enables you to control active transaction log file growth during full load and ongoing replication tasks. However, it can add some source latency to ongoing replication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-readbackuponly
         */
        readonly readBackupOnly?: boolean | cdk.IResolvable;
        /**
         * Use this attribute to minimize the need to access the backup log and enable AWS DMS to prevent truncation using one of the following two methods.
         *
         * *Start transactions in the database:* This is the default method. When this method is used, AWS DMS prevents TLOG truncation by mimicking a transaction in the database. As long as such a transaction is open, changes that appear after the transaction started aren't truncated. If you need Microsoft Replication to be enabled in your database, then you must choose this method.
         *
         * *Exclusively use sp_repldone within a single task* : When this method is used, AWS DMS reads the changes and then uses sp_repldone to mark the TLOG transactions as ready for truncation. Although this method doesn't involve any transactional activities, it can only be used when Microsoft Replication isn't running. Also, when using this method, only one AWS DMS task can access the database at any given time. Therefore, if you need to run parallel AWS DMS tasks against the same database, use the default method.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-safeguardpolicy
         */
        readonly safeguardPolicy?: string;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the SQL Server endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the MicrosoftSQLServer endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * Use this to attribute to transfer data for full-load operations using BCP. When the target table contains an identity column that does not exist in the source table, you must disable the use BCP for loading table option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-usebcpfullload
         */
        readonly useBcpFullLoad?: boolean | cdk.IResolvable;
        /**
         * When this attribute is set to `Y` , DMS processes third-party transaction log backups if they are created in native format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-microsoftsqlserversettings.html#cfn-dms-endpoint-microsoftsqlserversettings-usethirdpartybackupdevice
         */
        readonly useThirdPartyBackupDevice?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MicrosoftSqlServerSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MicrosoftSqlServerSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_MicrosoftSqlServerSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bcpPacketSize', cdk.validateNumber)(properties.bcpPacketSize));
    errors.collect(cdk.propertyValidator('controlTablesFileGroup', cdk.validateString)(properties.controlTablesFileGroup));
    errors.collect(cdk.propertyValidator('querySingleAlwaysOnNode', cdk.validateBoolean)(properties.querySingleAlwaysOnNode));
    errors.collect(cdk.propertyValidator('readBackupOnly', cdk.validateBoolean)(properties.readBackupOnly));
    errors.collect(cdk.propertyValidator('safeguardPolicy', cdk.validateString)(properties.safeguardPolicy));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('useBcpFullLoad', cdk.validateBoolean)(properties.useBcpFullLoad));
    errors.collect(cdk.propertyValidator('useThirdPartyBackupDevice', cdk.validateBoolean)(properties.useThirdPartyBackupDevice));
    return errors.wrap('supplied properties not correct for "MicrosoftSqlServerSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MicrosoftSqlServerSettings` resource
 *
 * @param properties - the TypeScript properties of a `MicrosoftSqlServerSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MicrosoftSqlServerSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointMicrosoftSqlServerSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_MicrosoftSqlServerSettingsPropertyValidator(properties).assertSuccess();
    return {
        BcpPacketSize: cdk.numberToCloudFormation(properties.bcpPacketSize),
        ControlTablesFileGroup: cdk.stringToCloudFormation(properties.controlTablesFileGroup),
        QuerySingleAlwaysOnNode: cdk.booleanToCloudFormation(properties.querySingleAlwaysOnNode),
        ReadBackupOnly: cdk.booleanToCloudFormation(properties.readBackupOnly),
        SafeguardPolicy: cdk.stringToCloudFormation(properties.safeguardPolicy),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        UseBcpFullLoad: cdk.booleanToCloudFormation(properties.useBcpFullLoad),
        UseThirdPartyBackupDevice: cdk.booleanToCloudFormation(properties.useThirdPartyBackupDevice),
    };
}

// @ts-ignore TS6133
function CfnEndpointMicrosoftSqlServerSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.MicrosoftSqlServerSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.MicrosoftSqlServerSettingsProperty>();
    ret.addPropertyResult('bcpPacketSize', 'BcpPacketSize', properties.BcpPacketSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BcpPacketSize) : undefined);
    ret.addPropertyResult('controlTablesFileGroup', 'ControlTablesFileGroup', properties.ControlTablesFileGroup != null ? cfn_parse.FromCloudFormation.getString(properties.ControlTablesFileGroup) : undefined);
    ret.addPropertyResult('querySingleAlwaysOnNode', 'QuerySingleAlwaysOnNode', properties.QuerySingleAlwaysOnNode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.QuerySingleAlwaysOnNode) : undefined);
    ret.addPropertyResult('readBackupOnly', 'ReadBackupOnly', properties.ReadBackupOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadBackupOnly) : undefined);
    ret.addPropertyResult('safeguardPolicy', 'SafeguardPolicy', properties.SafeguardPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SafeguardPolicy) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('useBcpFullLoad', 'UseBcpFullLoad', properties.UseBcpFullLoad != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBcpFullLoad) : undefined);
    ret.addPropertyResult('useThirdPartyBackupDevice', 'UseThirdPartyBackupDevice', properties.UseThirdPartyBackupDevice != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseThirdPartyBackupDevice) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a MongoDB endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Endpoint configuration settings when using MongoDB as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MongoDB.html#CHAP_Source.MongoDB.Configuration) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html
     */
    export interface MongoDbSettingsProperty {
        /**
         * The authentication mechanism you use to access the MongoDB source endpoint.
         *
         * For the default value, in MongoDB version 2.x, `"default"` is `"mongodb_cr"` . For MongoDB version 3.x or later, `"default"` is `"scram_sha_1"` . This setting isn't used when `AuthType` is set to `"no"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-authmechanism
         */
        readonly authMechanism?: string;
        /**
         * The MongoDB database name. This setting isn't used when `AuthType` is set to `"no"` .
         *
         * The default is `"admin"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-authsource
         */
        readonly authSource?: string;
        /**
         * The authentication type you use to access the MongoDB source endpoint.
         *
         * When set to `"no"` , user name and password parameters are not used and can be empty.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-authtype
         */
        readonly authType?: string;
        /**
         * The database name on the MongoDB source endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-databasename
         */
        readonly databaseName?: string;
        /**
         * Indicates the number of documents to preview to determine the document organization. Use this setting when `NestingLevel` is set to `"one"` .
         *
         * Must be a positive value greater than `0` . Default value is `1000` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-docstoinvestigate
         */
        readonly docsToInvestigate?: string;
        /**
         * Specifies the document ID. Use this setting when `NestingLevel` is set to `"none"` .
         *
         * Default value is `"false"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-extractdocid
         */
        readonly extractDocId?: string;
        /**
         * Specifies either document or table mode.
         *
         * Default value is `"none"` . Specify `"none"` to use document mode. Specify `"one"` to use table mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-nestinglevel
         */
        readonly nestingLevel?: string;
        /**
         * The password for the user account you use to access the MongoDB source endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-password
         */
        readonly password?: string;
        /**
         * The port value for the MongoDB source endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-port
         */
        readonly port?: number;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the MongoDB endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the MongoDB endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * The name of the server on the MongoDB source endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-servername
         */
        readonly serverName?: string;
        /**
         * The user name you use to access the MongoDB source endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mongodbsettings.html#cfn-dms-endpoint-mongodbsettings-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MongoDbSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MongoDbSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_MongoDbSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authMechanism', cdk.validateString)(properties.authMechanism));
    errors.collect(cdk.propertyValidator('authSource', cdk.validateString)(properties.authSource));
    errors.collect(cdk.propertyValidator('authType', cdk.validateString)(properties.authType));
    errors.collect(cdk.propertyValidator('databaseName', cdk.validateString)(properties.databaseName));
    errors.collect(cdk.propertyValidator('docsToInvestigate', cdk.validateString)(properties.docsToInvestigate));
    errors.collect(cdk.propertyValidator('extractDocId', cdk.validateString)(properties.extractDocId));
    errors.collect(cdk.propertyValidator('nestingLevel', cdk.validateString)(properties.nestingLevel));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('serverName', cdk.validateString)(properties.serverName));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "MongoDbSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MongoDbSettings` resource
 *
 * @param properties - the TypeScript properties of a `MongoDbSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MongoDbSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointMongoDbSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_MongoDbSettingsPropertyValidator(properties).assertSuccess();
    return {
        AuthMechanism: cdk.stringToCloudFormation(properties.authMechanism),
        AuthSource: cdk.stringToCloudFormation(properties.authSource),
        AuthType: cdk.stringToCloudFormation(properties.authType),
        DatabaseName: cdk.stringToCloudFormation(properties.databaseName),
        DocsToInvestigate: cdk.stringToCloudFormation(properties.docsToInvestigate),
        ExtractDocId: cdk.stringToCloudFormation(properties.extractDocId),
        NestingLevel: cdk.stringToCloudFormation(properties.nestingLevel),
        Password: cdk.stringToCloudFormation(properties.password),
        Port: cdk.numberToCloudFormation(properties.port),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        ServerName: cdk.stringToCloudFormation(properties.serverName),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnEndpointMongoDbSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.MongoDbSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.MongoDbSettingsProperty>();
    ret.addPropertyResult('authMechanism', 'AuthMechanism', properties.AuthMechanism != null ? cfn_parse.FromCloudFormation.getString(properties.AuthMechanism) : undefined);
    ret.addPropertyResult('authSource', 'AuthSource', properties.AuthSource != null ? cfn_parse.FromCloudFormation.getString(properties.AuthSource) : undefined);
    ret.addPropertyResult('authType', 'AuthType', properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined);
    ret.addPropertyResult('databaseName', 'DatabaseName', properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined);
    ret.addPropertyResult('docsToInvestigate', 'DocsToInvestigate', properties.DocsToInvestigate != null ? cfn_parse.FromCloudFormation.getString(properties.DocsToInvestigate) : undefined);
    ret.addPropertyResult('extractDocId', 'ExtractDocId', properties.ExtractDocId != null ? cfn_parse.FromCloudFormation.getString(properties.ExtractDocId) : undefined);
    ret.addPropertyResult('nestingLevel', 'NestingLevel', properties.NestingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.NestingLevel) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('serverName', 'ServerName', properties.ServerName != null ? cfn_parse.FromCloudFormation.getString(properties.ServerName) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a MySQL endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Extra connection attributes when using MySQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.ConnectionAttrib) and [Extra connection attributes when using a MySQL-compatible database as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.MySQL.html#CHAP_Target.MySQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html
     */
    export interface MySqlSettingsProperty {
        /**
         * Specifies a script to run immediately after AWS DMS connects to the endpoint. The migration task continues running regardless if the SQL statement succeeds or fails.
         *
         * For this parameter, provide the code of the script itself, not the name of a file containing the script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-afterconnectscript
         */
        readonly afterConnectScript?: string;
        /**
         * Cleans and recreates table metadata information on the replication instance when a mismatch occurs. For example, in a situation where running an alter DDL on the table could result in different information about the table cached in the replication instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-cleansourcemetadataonmismatch
         */
        readonly cleanSourceMetadataOnMismatch?: boolean | cdk.IResolvable;
        /**
         * Specifies how often to check the binary log for new changes/events when the database is idle. The default is five seconds.
         *
         * Example: `eventsPollInterval=5;`
         *
         * In the example, AWS DMS checks for changes in the binary logs every five seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-eventspollinterval
         */
        readonly eventsPollInterval?: number;
        /**
         * Specifies the maximum size (in KB) of any .csv file used to transfer data to a MySQL-compatible database.
         *
         * Example: `maxFileSize=512`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * Improves performance when loading data into the MySQL-compatible target database. Specifies how many threads to use to load the data into the MySQL-compatible target database. Setting a large number of threads can have an adverse effect on database performance, because a separate connection is required for each thread. The default is one.
         *
         * Example: `parallelLoadThreads=1`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-parallelloadthreads
         */
        readonly parallelLoadThreads?: number;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the MySQL endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the MySQL endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * Specifies the time zone for the source MySQL database.
         *
         * Example: `serverTimezone=US/Pacific;`
         *
         * Note: Do not enclose time zones in single quotes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-servertimezone
         */
        readonly serverTimezone?: string;
        /**
         * Specifies where to migrate source tables on the target, either to a single database or multiple databases. If you specify `SPECIFIC_DATABASE` , specify the database name using the `DatabaseName` parameter of the `Endpoint` object.
         *
         * Example: `targetDbType=MULTIPLE_DATABASES`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-mysqlsettings.html#cfn-dms-endpoint-mysqlsettings-targetdbtype
         */
        readonly targetDbType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MySqlSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MySqlSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_MySqlSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('afterConnectScript', cdk.validateString)(properties.afterConnectScript));
    errors.collect(cdk.propertyValidator('cleanSourceMetadataOnMismatch', cdk.validateBoolean)(properties.cleanSourceMetadataOnMismatch));
    errors.collect(cdk.propertyValidator('eventsPollInterval', cdk.validateNumber)(properties.eventsPollInterval));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('parallelLoadThreads', cdk.validateNumber)(properties.parallelLoadThreads));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('serverTimezone', cdk.validateString)(properties.serverTimezone));
    errors.collect(cdk.propertyValidator('targetDbType', cdk.validateString)(properties.targetDbType));
    return errors.wrap('supplied properties not correct for "MySqlSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MySqlSettings` resource
 *
 * @param properties - the TypeScript properties of a `MySqlSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.MySqlSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointMySqlSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_MySqlSettingsPropertyValidator(properties).assertSuccess();
    return {
        AfterConnectScript: cdk.stringToCloudFormation(properties.afterConnectScript),
        CleanSourceMetadataOnMismatch: cdk.booleanToCloudFormation(properties.cleanSourceMetadataOnMismatch),
        EventsPollInterval: cdk.numberToCloudFormation(properties.eventsPollInterval),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        ParallelLoadThreads: cdk.numberToCloudFormation(properties.parallelLoadThreads),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        ServerTimezone: cdk.stringToCloudFormation(properties.serverTimezone),
        TargetDbType: cdk.stringToCloudFormation(properties.targetDbType),
    };
}

// @ts-ignore TS6133
function CfnEndpointMySqlSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.MySqlSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.MySqlSettingsProperty>();
    ret.addPropertyResult('afterConnectScript', 'AfterConnectScript', properties.AfterConnectScript != null ? cfn_parse.FromCloudFormation.getString(properties.AfterConnectScript) : undefined);
    ret.addPropertyResult('cleanSourceMetadataOnMismatch', 'CleanSourceMetadataOnMismatch', properties.CleanSourceMetadataOnMismatch != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CleanSourceMetadataOnMismatch) : undefined);
    ret.addPropertyResult('eventsPollInterval', 'EventsPollInterval', properties.EventsPollInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.EventsPollInterval) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('parallelLoadThreads', 'ParallelLoadThreads', properties.ParallelLoadThreads != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelLoadThreads) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('serverTimezone', 'ServerTimezone', properties.ServerTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.ServerTimezone) : undefined);
    ret.addPropertyResult('targetDbType', 'TargetDbType', properties.TargetDbType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetDbType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an Amazon Neptune endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about the available settings, see [Specifying endpoint settings for Amazon Neptune as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Neptune.html#CHAP_Target.Neptune.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html
     */
    export interface NeptuneSettingsProperty {
        /**
         * The number of milliseconds for AWS DMS to wait to retry a bulk-load of migrated graph data to the Neptune target database before raising an error. The default is 250.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-errorretryduration
         */
        readonly errorRetryDuration?: number;
        /**
         * If you want IAM authorization enabled for this endpoint, set this parameter to `true` . Then attach the appropriate IAM policy document to your service role specified by `ServiceAccessRoleArn` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-iamauthenabled
         */
        readonly iamAuthEnabled?: boolean | cdk.IResolvable;
        /**
         * The maximum size in kilobytes of migrated graph data stored in a .csv file before AWS DMS bulk-loads the data to the Neptune target database. The default is 1,048,576 KB. If the bulk load is successful, AWS DMS clears the bucket, ready to store the next batch of migrated graph data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * The number of times for AWS DMS to retry a bulk load of migrated graph data to the Neptune target database before raising an error. The default is 5.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-maxretrycount
         */
        readonly maxRetryCount?: number;
        /**
         * A folder path where you want AWS DMS to store migrated graph data in the S3 bucket specified by `S3BucketName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-s3bucketfolder
         */
        readonly s3BucketFolder?: string;
        /**
         * The name of the Amazon S3 bucket where AWS DMS can temporarily store migrated graph data in .csv files before bulk-loading it to the Neptune target database. AWS DMS maps the SQL source data to graph data before storing it in these .csv files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-s3bucketname
         */
        readonly s3BucketName?: string;
        /**
         * The Amazon Resource Name (ARN) of the service role that you created for the Neptune target endpoint. The role must allow the `iam:PassRole` action.
         *
         * For more information, see [Creating an IAM Service Role for Accessing Amazon Neptune as a Target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Neptune.html#CHAP_Target.Neptune.ServiceRole) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-neptunesettings.html#cfn-dms-endpoint-neptunesettings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NeptuneSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `NeptuneSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_NeptuneSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('errorRetryDuration', cdk.validateNumber)(properties.errorRetryDuration));
    errors.collect(cdk.propertyValidator('iamAuthEnabled', cdk.validateBoolean)(properties.iamAuthEnabled));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('maxRetryCount', cdk.validateNumber)(properties.maxRetryCount));
    errors.collect(cdk.propertyValidator('s3BucketFolder', cdk.validateString)(properties.s3BucketFolder));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    return errors.wrap('supplied properties not correct for "NeptuneSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.NeptuneSettings` resource
 *
 * @param properties - the TypeScript properties of a `NeptuneSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.NeptuneSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointNeptuneSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_NeptuneSettingsPropertyValidator(properties).assertSuccess();
    return {
        ErrorRetryDuration: cdk.numberToCloudFormation(properties.errorRetryDuration),
        IamAuthEnabled: cdk.booleanToCloudFormation(properties.iamAuthEnabled),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        MaxRetryCount: cdk.numberToCloudFormation(properties.maxRetryCount),
        S3BucketFolder: cdk.stringToCloudFormation(properties.s3BucketFolder),
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
    };
}

// @ts-ignore TS6133
function CfnEndpointNeptuneSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.NeptuneSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.NeptuneSettingsProperty>();
    ret.addPropertyResult('errorRetryDuration', 'ErrorRetryDuration', properties.ErrorRetryDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorRetryDuration) : undefined);
    ret.addPropertyResult('iamAuthEnabled', 'IamAuthEnabled', properties.IamAuthEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IamAuthEnabled) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('maxRetryCount', 'MaxRetryCount', properties.MaxRetryCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetryCount) : undefined);
    ret.addPropertyResult('s3BucketFolder', 'S3BucketFolder', properties.S3BucketFolder != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketFolder) : undefined);
    ret.addPropertyResult('s3BucketName', 'S3BucketName', properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined);
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an Oracle endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Extra connection attributes when using Oracle as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.ConnectionAttrib) and [Extra connection attributes when using Oracle as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Oracle.html#CHAP_Target.Oracle.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html
     */
    export interface OracleSettingsProperty {
        /**
         * Set this attribute to `false` in order to use the Binary Reader to capture change data for an Amazon RDS for Oracle as the source. This tells the DMS instance to not access redo logs through any specified path prefix replacement using direct file access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-accessalternatedirectly
         */
        readonly accessAlternateDirectly?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to set up table-level supplemental logging for the Oracle database. This attribute enables PRIMARY KEY supplemental logging on all tables selected for a migration task.
         *
         * If you use this option, you still need to enable database-level supplemental logging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-addsupplementallogging
         */
        readonly addSupplementalLogging?: boolean | cdk.IResolvable;
        /**
         * Set this attribute with `ArchivedLogDestId` in a primary/ standby setup. This attribute is useful in the case of a switchover. In this case, AWS DMS needs to know which destination to get archive redo logs from to read changes. This need arises because the previous primary instance is now a standby instance after switchover.
         *
         * Although AWS DMS supports the use of the Oracle `RESETLOGS` option to open the database, never use `RESETLOGS` unless necessary. For additional information about `RESETLOGS` , see [RMAN Data Repair Concepts](https://docs.aws.amazon.com/https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/rman-data-repair-concepts.html#GUID-1805CCF7-4AF2-482D-B65A-998192F89C2B) in the *Oracle Database Backup and Recovery User's Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-additionalarchivedlogdestid
         */
        readonly additionalArchivedLogDestId?: number;
        /**
         * Set this attribute to `true` to enable replication of Oracle tables containing columns that are nested tables or defined types.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-allowselectnestedtables
         */
        readonly allowSelectNestedTables?: boolean | cdk.IResolvable;
        /**
         * Specifies the ID of the destination for the archived redo logs. This value should be the same as a number in the dest_id column of the v$archived_log view. If you work with an additional redo log destination, use the `AdditionalArchivedLogDestId` option to specify the additional destination ID. Doing this improves performance by ensuring that the correct logs are accessed from the outset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-archivedlogdestid
         */
        readonly archivedLogDestId?: number;
        /**
         * When this field is set to `Y` , AWS DMS only accesses the archived redo logs. If the archived redo logs are stored on Automatic Storage Management (ASM) only, the AWS DMS user account needs to be granted ASM privileges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-archivedlogsonly
         */
        readonly archivedLogsOnly?: boolean | cdk.IResolvable;
        /**
         * For an Oracle source endpoint, your Oracle Automatic Storage Management (ASM) password. You can set this value from the `*asm_user_password*` value. You set this value as part of the comma-separated value that you set to the `Password` request parameter when you create the endpoint to access transaction logs using Binary Reader. For more information, see [Configuration for change data capture (CDC) on an Oracle source database](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.CDC.Configuration) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-asmpassword
         */
        readonly asmPassword?: string;
        /**
         * For an Oracle source endpoint, your ASM server address. You can set this value from the `asm_server` value. You set `asm_server` as part of the extra connection attribute string to access an Oracle server with Binary Reader that uses ASM. For more information, see [Configuration for change data capture (CDC) on an Oracle source database](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.CDC.Configuration) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-asmserver
         */
        readonly asmServer?: string;
        /**
         * For an Oracle source endpoint, your ASM user name. You can set this value from the `asm_user` value. You set `asm_user` as part of the extra connection attribute string to access an Oracle server with Binary Reader that uses ASM. For more information, see [Configuration for change data capture (CDC) on an Oracle source database](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.CDC.Configuration) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-asmuser
         */
        readonly asmUser?: string;
        /**
         * Specifies whether the length of a character column is in bytes or in characters. To indicate that the character column length is in characters, set this attribute to `CHAR` . Otherwise, the character column length is in bytes.
         *
         * Example: `charLengthSemantics=CHAR;`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-charlengthsemantics
         */
        readonly charLengthSemantics?: string;
        /**
         * When set to `true` , this attribute helps to increase the commit rate on the Oracle target database by writing directly to tables and not writing a trail to database logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-directpathnolog
         */
        readonly directPathNoLog?: boolean | cdk.IResolvable;
        /**
         * When set to `true` , this attribute specifies a parallel load when `useDirectPathFullLoad` is set to `Y` . This attribute also only applies when you use the AWS DMS parallel load feature. Note that the target table cannot have any constraints or indexes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-directpathparallelload
         */
        readonly directPathParallelLoad?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to enable homogenous tablespace replication and create existing tables or indexes under the same tablespace on the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-enablehomogenoustablespace
         */
        readonly enableHomogenousTablespace?: boolean | cdk.IResolvable;
        /**
         * Specifies the IDs of one more destinations for one or more archived redo logs. These IDs are the values of the `dest_id` column in the `v$archived_log` view. Use this setting with the `archivedLogDestId` extra connection attribute in a primary-to-single setup or a primary-to-multiple-standby setup.
         *
         * This setting is useful in a switchover when you use an Oracle Data Guard database as a source. In this case, AWS DMS needs information about what destination to get archive redo logs from to read changes. AWS DMS needs this because after the switchover the previous primary is a standby instance. For example, in a primary-to-single standby setup you might apply the following settings.
         *
         * `archivedLogDestId=1; ExtraArchivedLogDestIds=[2]`
         *
         * In a primary-to-multiple-standby setup, you might apply the following settings.
         *
         * `archivedLogDestId=1; ExtraArchivedLogDestIds=[2,3,4]`
         *
         * Although AWS DMS supports the use of the Oracle `RESETLOGS` option to open the database, never use `RESETLOGS` unless it's necessary. For more information about `RESETLOGS` , see [RMAN Data Repair Concepts](https://docs.aws.amazon.com/https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/rman-data-repair-concepts.html#GUID-1805CCF7-4AF2-482D-B65A-998192F89C2B) in the *Oracle Database Backup and Recovery User's Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-extraarchivedlogdestids
         */
        readonly extraArchivedLogDestIds?: number[] | cdk.IResolvable;
        /**
         * When set to `true` , this attribute causes a task to fail if the actual size of an LOB column is greater than the specified `LobMaxSize` .
         *
         * If a task is set to limited LOB mode and this option is set to `true` , the task fails instead of truncating the LOB data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-failtasksonlobtruncation
         */
        readonly failTasksOnLobTruncation?: boolean | cdk.IResolvable;
        /**
         * Specifies the number scale. You can select a scale up to 38, or you can select FLOAT. By default, the NUMBER data type is converted to precision 38, scale 10.
         *
         * Example: `numberDataTypeScale=12`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-numberdatatypescale
         */
        readonly numberDatatypeScale?: number;
        /**
         * Set this string attribute to the required value in order to use the Binary Reader to capture change data for an Amazon RDS for Oracle as the source. This value specifies the default Oracle root used to access the redo logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-oraclepathprefix
         */
        readonly oraclePathPrefix?: string;
        /**
         * Set this attribute to change the number of threads that DMS configures to perform a change data capture (CDC) load using Oracle Automatic Storage Management (ASM). You can specify an integer value between 2 (the default) and 8 (the maximum). Use this attribute together with the `readAheadBlocks` attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-parallelasmreadthreads
         */
        readonly parallelAsmReadThreads?: number;
        /**
         * Set this attribute to change the number of read-ahead blocks that DMS configures to perform a change data capture (CDC) load using Oracle Automatic Storage Management (ASM). You can specify an integer value between 1000 (the default) and 200,000 (the maximum).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-readaheadblocks
         */
        readonly readAheadBlocks?: number;
        /**
         * When set to `true` , this attribute supports tablespace replication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-readtablespacename
         */
        readonly readTableSpaceName?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to true in order to use the Binary Reader to capture change data for an Amazon RDS for Oracle as the source. This setting tells DMS instance to replace the default Oracle root with the specified `usePathPrefix` setting to access the redo logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-replacepathprefix
         */
        readonly replacePathPrefix?: boolean | cdk.IResolvable;
        /**
         * Specifies the number of seconds that the system waits before resending a query.
         *
         * Example: `retryInterval=6;`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-retryinterval
         */
        readonly retryInterval?: number;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the Oracle endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * Required only if your Oracle endpoint uses Advanced Storage Manager (ASM). The full ARN of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the `SecretsManagerOracleAsmSecret` . This `SecretsManagerOracleAsmSecret` has the secret value that allows access to the Oracle ASM of the endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerOracleAsmSecretId` . Or you can specify clear-text values for `AsmUserName` , `AsmPassword` , and `AsmServerName` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerOracleAsmSecret` , the corresponding `SecretsManagerOracleAsmAccessRoleArn` , and the `SecretsManagerOracleAsmSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-secretsmanageroracleasmaccessrolearn
         */
        readonly secretsManagerOracleAsmAccessRoleArn?: string;
        /**
         * Required only if your Oracle endpoint uses Advanced Storage Manager (ASM). The full ARN, partial ARN, or display name of the `SecretsManagerOracleAsmSecret` that contains the Oracle ASM connection details for the Oracle endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-secretsmanageroracleasmsecretid
         */
        readonly secretsManagerOracleAsmSecretId?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the Oracle endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * For an Oracle source endpoint, the transparent data encryption (TDE) password required by AWM DMS to access Oracle redo logs encrypted by TDE using Binary Reader. It is also the `*TDE_Password*` part of the comma-separated value you set to the `Password` request parameter when you create the endpoint. The `SecurityDbEncryptian` setting is related to this `SecurityDbEncryptionName` setting. For more information, see [Supported encryption methods for using Oracle as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.Encryption) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-securitydbencryption
         */
        readonly securityDbEncryption?: string;
        /**
         * For an Oracle source endpoint, the name of a key used for the transparent data encryption (TDE) of the columns and tablespaces in an Oracle source database that is encrypted using TDE. The key value is the value of the `SecurityDbEncryption` setting. For more information on setting the key name value of `SecurityDbEncryptionName` , see the information and example for setting the `securityDbEncryptionName` extra connection attribute in [Supported encryption methods for using Oracle as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.Encryption) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-securitydbencryptionname
         */
        readonly securityDbEncryptionName?: string;
        /**
         * Use this attribute to convert `SDO_GEOMETRY` to `GEOJSON` format. By default, DMS calls the `SDO2GEOJSON` custom function if present and accessible. Or you can create your own custom function that mimics the operation of `SDOGEOJSON` and set `SpatialDataOptionToGeoJsonFunctionName` to call it instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-spatialdataoptiontogeojsonfunctionname
         */
        readonly spatialDataOptionToGeoJsonFunctionName?: string;
        /**
         * Use this attribute to specify a time in minutes for the delay in standby sync. If the source is an Oracle Active Data Guard standby database, use this attribute to specify the time lag between primary and standby databases.
         *
         * In AWS DMS , you can create an Oracle CDC task that uses an Active Data Guard standby instance as a source for replicating ongoing changes. Doing this eliminates the need to connect to an active database that might be in production.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-standbydelaytime
         */
        readonly standbyDelayTime?: number;
        /**
         * Set this attribute to `true` in order to use the Binary Reader to capture change data for an Amazon RDS for Oracle as the source. This tells the DMS instance to use any specified prefix replacement to access all online redo logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-usealternatefolderforonline
         */
        readonly useAlternateFolderForOnline?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to Y to capture change data using the Binary Reader utility. Set `UseLogminerReader` to N to set this attribute to Y. To use Binary Reader with Amazon RDS for Oracle as the source, you set additional attributes. For more information about using this setting with Oracle Automatic Storage Management (ASM), see [Using Oracle LogMiner or AWS DMS Binary Reader for CDC](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.CDC) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-usebfile
         */
        readonly useBFile?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to Y to have AWS DMS use a direct path full load. Specify this value to use the direct path protocol in the Oracle Call Interface (OCI). By using this OCI protocol, you can bulk-load Oracle target tables during a full load.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-usedirectpathfullload
         */
        readonly useDirectPathFullLoad?: boolean | cdk.IResolvable;
        /**
         * Set this attribute to Y to capture change data using the Oracle LogMiner utility (the default). Set this attribute to N if you want to access the redo logs as a binary file. When you set `UseLogminerReader` to N, also set `UseBfile` to Y. For more information on this setting and using Oracle ASM, see [Using Oracle LogMiner or AWS DMS Binary Reader for CDC](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.Oracle.html#CHAP_Source.Oracle.CDC) in the *AWS DMS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-uselogminerreader
         */
        readonly useLogminerReader?: boolean | cdk.IResolvable;
        /**
         * Set this string attribute to the required value in order to use the Binary Reader to capture change data for an Amazon RDS for Oracle as the source. This value specifies the path prefix used to replace the default Oracle root to access the redo logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-oraclesettings.html#cfn-dms-endpoint-oraclesettings-usepathprefix
         */
        readonly usePathPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OracleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `OracleSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_OracleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessAlternateDirectly', cdk.validateBoolean)(properties.accessAlternateDirectly));
    errors.collect(cdk.propertyValidator('addSupplementalLogging', cdk.validateBoolean)(properties.addSupplementalLogging));
    errors.collect(cdk.propertyValidator('additionalArchivedLogDestId', cdk.validateNumber)(properties.additionalArchivedLogDestId));
    errors.collect(cdk.propertyValidator('allowSelectNestedTables', cdk.validateBoolean)(properties.allowSelectNestedTables));
    errors.collect(cdk.propertyValidator('archivedLogDestId', cdk.validateNumber)(properties.archivedLogDestId));
    errors.collect(cdk.propertyValidator('archivedLogsOnly', cdk.validateBoolean)(properties.archivedLogsOnly));
    errors.collect(cdk.propertyValidator('asmPassword', cdk.validateString)(properties.asmPassword));
    errors.collect(cdk.propertyValidator('asmServer', cdk.validateString)(properties.asmServer));
    errors.collect(cdk.propertyValidator('asmUser', cdk.validateString)(properties.asmUser));
    errors.collect(cdk.propertyValidator('charLengthSemantics', cdk.validateString)(properties.charLengthSemantics));
    errors.collect(cdk.propertyValidator('directPathNoLog', cdk.validateBoolean)(properties.directPathNoLog));
    errors.collect(cdk.propertyValidator('directPathParallelLoad', cdk.validateBoolean)(properties.directPathParallelLoad));
    errors.collect(cdk.propertyValidator('enableHomogenousTablespace', cdk.validateBoolean)(properties.enableHomogenousTablespace));
    errors.collect(cdk.propertyValidator('extraArchivedLogDestIds', cdk.listValidator(cdk.validateNumber))(properties.extraArchivedLogDestIds));
    errors.collect(cdk.propertyValidator('failTasksOnLobTruncation', cdk.validateBoolean)(properties.failTasksOnLobTruncation));
    errors.collect(cdk.propertyValidator('numberDatatypeScale', cdk.validateNumber)(properties.numberDatatypeScale));
    errors.collect(cdk.propertyValidator('oraclePathPrefix', cdk.validateString)(properties.oraclePathPrefix));
    errors.collect(cdk.propertyValidator('parallelAsmReadThreads', cdk.validateNumber)(properties.parallelAsmReadThreads));
    errors.collect(cdk.propertyValidator('readAheadBlocks', cdk.validateNumber)(properties.readAheadBlocks));
    errors.collect(cdk.propertyValidator('readTableSpaceName', cdk.validateBoolean)(properties.readTableSpaceName));
    errors.collect(cdk.propertyValidator('replacePathPrefix', cdk.validateBoolean)(properties.replacePathPrefix));
    errors.collect(cdk.propertyValidator('retryInterval', cdk.validateNumber)(properties.retryInterval));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerOracleAsmAccessRoleArn', cdk.validateString)(properties.secretsManagerOracleAsmAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerOracleAsmSecretId', cdk.validateString)(properties.secretsManagerOracleAsmSecretId));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('securityDbEncryption', cdk.validateString)(properties.securityDbEncryption));
    errors.collect(cdk.propertyValidator('securityDbEncryptionName', cdk.validateString)(properties.securityDbEncryptionName));
    errors.collect(cdk.propertyValidator('spatialDataOptionToGeoJsonFunctionName', cdk.validateString)(properties.spatialDataOptionToGeoJsonFunctionName));
    errors.collect(cdk.propertyValidator('standbyDelayTime', cdk.validateNumber)(properties.standbyDelayTime));
    errors.collect(cdk.propertyValidator('useAlternateFolderForOnline', cdk.validateBoolean)(properties.useAlternateFolderForOnline));
    errors.collect(cdk.propertyValidator('useBFile', cdk.validateBoolean)(properties.useBFile));
    errors.collect(cdk.propertyValidator('useDirectPathFullLoad', cdk.validateBoolean)(properties.useDirectPathFullLoad));
    errors.collect(cdk.propertyValidator('useLogminerReader', cdk.validateBoolean)(properties.useLogminerReader));
    errors.collect(cdk.propertyValidator('usePathPrefix', cdk.validateString)(properties.usePathPrefix));
    return errors.wrap('supplied properties not correct for "OracleSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.OracleSettings` resource
 *
 * @param properties - the TypeScript properties of a `OracleSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.OracleSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointOracleSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_OracleSettingsPropertyValidator(properties).assertSuccess();
    return {
        AccessAlternateDirectly: cdk.booleanToCloudFormation(properties.accessAlternateDirectly),
        AddSupplementalLogging: cdk.booleanToCloudFormation(properties.addSupplementalLogging),
        AdditionalArchivedLogDestId: cdk.numberToCloudFormation(properties.additionalArchivedLogDestId),
        AllowSelectNestedTables: cdk.booleanToCloudFormation(properties.allowSelectNestedTables),
        ArchivedLogDestId: cdk.numberToCloudFormation(properties.archivedLogDestId),
        ArchivedLogsOnly: cdk.booleanToCloudFormation(properties.archivedLogsOnly),
        AsmPassword: cdk.stringToCloudFormation(properties.asmPassword),
        AsmServer: cdk.stringToCloudFormation(properties.asmServer),
        AsmUser: cdk.stringToCloudFormation(properties.asmUser),
        CharLengthSemantics: cdk.stringToCloudFormation(properties.charLengthSemantics),
        DirectPathNoLog: cdk.booleanToCloudFormation(properties.directPathNoLog),
        DirectPathParallelLoad: cdk.booleanToCloudFormation(properties.directPathParallelLoad),
        EnableHomogenousTablespace: cdk.booleanToCloudFormation(properties.enableHomogenousTablespace),
        ExtraArchivedLogDestIds: cdk.listMapper(cdk.numberToCloudFormation)(properties.extraArchivedLogDestIds),
        FailTasksOnLobTruncation: cdk.booleanToCloudFormation(properties.failTasksOnLobTruncation),
        NumberDatatypeScale: cdk.numberToCloudFormation(properties.numberDatatypeScale),
        OraclePathPrefix: cdk.stringToCloudFormation(properties.oraclePathPrefix),
        ParallelAsmReadThreads: cdk.numberToCloudFormation(properties.parallelAsmReadThreads),
        ReadAheadBlocks: cdk.numberToCloudFormation(properties.readAheadBlocks),
        ReadTableSpaceName: cdk.booleanToCloudFormation(properties.readTableSpaceName),
        ReplacePathPrefix: cdk.booleanToCloudFormation(properties.replacePathPrefix),
        RetryInterval: cdk.numberToCloudFormation(properties.retryInterval),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerOracleAsmAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerOracleAsmAccessRoleArn),
        SecretsManagerOracleAsmSecretId: cdk.stringToCloudFormation(properties.secretsManagerOracleAsmSecretId),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        SecurityDbEncryption: cdk.stringToCloudFormation(properties.securityDbEncryption),
        SecurityDbEncryptionName: cdk.stringToCloudFormation(properties.securityDbEncryptionName),
        SpatialDataOptionToGeoJsonFunctionName: cdk.stringToCloudFormation(properties.spatialDataOptionToGeoJsonFunctionName),
        StandbyDelayTime: cdk.numberToCloudFormation(properties.standbyDelayTime),
        UseAlternateFolderForOnline: cdk.booleanToCloudFormation(properties.useAlternateFolderForOnline),
        UseBFile: cdk.booleanToCloudFormation(properties.useBFile),
        UseDirectPathFullLoad: cdk.booleanToCloudFormation(properties.useDirectPathFullLoad),
        UseLogminerReader: cdk.booleanToCloudFormation(properties.useLogminerReader),
        UsePathPrefix: cdk.stringToCloudFormation(properties.usePathPrefix),
    };
}

// @ts-ignore TS6133
function CfnEndpointOracleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.OracleSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.OracleSettingsProperty>();
    ret.addPropertyResult('accessAlternateDirectly', 'AccessAlternateDirectly', properties.AccessAlternateDirectly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccessAlternateDirectly) : undefined);
    ret.addPropertyResult('addSupplementalLogging', 'AddSupplementalLogging', properties.AddSupplementalLogging != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddSupplementalLogging) : undefined);
    ret.addPropertyResult('additionalArchivedLogDestId', 'AdditionalArchivedLogDestId', properties.AdditionalArchivedLogDestId != null ? cfn_parse.FromCloudFormation.getNumber(properties.AdditionalArchivedLogDestId) : undefined);
    ret.addPropertyResult('allowSelectNestedTables', 'AllowSelectNestedTables', properties.AllowSelectNestedTables != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowSelectNestedTables) : undefined);
    ret.addPropertyResult('archivedLogDestId', 'ArchivedLogDestId', properties.ArchivedLogDestId != null ? cfn_parse.FromCloudFormation.getNumber(properties.ArchivedLogDestId) : undefined);
    ret.addPropertyResult('archivedLogsOnly', 'ArchivedLogsOnly', properties.ArchivedLogsOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ArchivedLogsOnly) : undefined);
    ret.addPropertyResult('asmPassword', 'AsmPassword', properties.AsmPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AsmPassword) : undefined);
    ret.addPropertyResult('asmServer', 'AsmServer', properties.AsmServer != null ? cfn_parse.FromCloudFormation.getString(properties.AsmServer) : undefined);
    ret.addPropertyResult('asmUser', 'AsmUser', properties.AsmUser != null ? cfn_parse.FromCloudFormation.getString(properties.AsmUser) : undefined);
    ret.addPropertyResult('charLengthSemantics', 'CharLengthSemantics', properties.CharLengthSemantics != null ? cfn_parse.FromCloudFormation.getString(properties.CharLengthSemantics) : undefined);
    ret.addPropertyResult('directPathNoLog', 'DirectPathNoLog', properties.DirectPathNoLog != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DirectPathNoLog) : undefined);
    ret.addPropertyResult('directPathParallelLoad', 'DirectPathParallelLoad', properties.DirectPathParallelLoad != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DirectPathParallelLoad) : undefined);
    ret.addPropertyResult('enableHomogenousTablespace', 'EnableHomogenousTablespace', properties.EnableHomogenousTablespace != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableHomogenousTablespace) : undefined);
    ret.addPropertyResult('extraArchivedLogDestIds', 'ExtraArchivedLogDestIds', properties.ExtraArchivedLogDestIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.ExtraArchivedLogDestIds) : undefined);
    ret.addPropertyResult('failTasksOnLobTruncation', 'FailTasksOnLobTruncation', properties.FailTasksOnLobTruncation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailTasksOnLobTruncation) : undefined);
    ret.addPropertyResult('numberDatatypeScale', 'NumberDatatypeScale', properties.NumberDatatypeScale != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberDatatypeScale) : undefined);
    ret.addPropertyResult('oraclePathPrefix', 'OraclePathPrefix', properties.OraclePathPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.OraclePathPrefix) : undefined);
    ret.addPropertyResult('parallelAsmReadThreads', 'ParallelAsmReadThreads', properties.ParallelAsmReadThreads != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelAsmReadThreads) : undefined);
    ret.addPropertyResult('readAheadBlocks', 'ReadAheadBlocks', properties.ReadAheadBlocks != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReadAheadBlocks) : undefined);
    ret.addPropertyResult('readTableSpaceName', 'ReadTableSpaceName', properties.ReadTableSpaceName != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadTableSpaceName) : undefined);
    ret.addPropertyResult('replacePathPrefix', 'ReplacePathPrefix', properties.ReplacePathPrefix != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReplacePathPrefix) : undefined);
    ret.addPropertyResult('retryInterval', 'RetryInterval', properties.RetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryInterval) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerOracleAsmAccessRoleArn', 'SecretsManagerOracleAsmAccessRoleArn', properties.SecretsManagerOracleAsmAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerOracleAsmAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerOracleAsmSecretId', 'SecretsManagerOracleAsmSecretId', properties.SecretsManagerOracleAsmSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerOracleAsmSecretId) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('securityDbEncryption', 'SecurityDbEncryption', properties.SecurityDbEncryption != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityDbEncryption) : undefined);
    ret.addPropertyResult('securityDbEncryptionName', 'SecurityDbEncryptionName', properties.SecurityDbEncryptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityDbEncryptionName) : undefined);
    ret.addPropertyResult('spatialDataOptionToGeoJsonFunctionName', 'SpatialDataOptionToGeoJsonFunctionName', properties.SpatialDataOptionToGeoJsonFunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.SpatialDataOptionToGeoJsonFunctionName) : undefined);
    ret.addPropertyResult('standbyDelayTime', 'StandbyDelayTime', properties.StandbyDelayTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.StandbyDelayTime) : undefined);
    ret.addPropertyResult('useAlternateFolderForOnline', 'UseAlternateFolderForOnline', properties.UseAlternateFolderForOnline != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAlternateFolderForOnline) : undefined);
    ret.addPropertyResult('useBFile', 'UseBFile', properties.UseBFile != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseBFile) : undefined);
    ret.addPropertyResult('useDirectPathFullLoad', 'UseDirectPathFullLoad', properties.UseDirectPathFullLoad != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseDirectPathFullLoad) : undefined);
    ret.addPropertyResult('useLogminerReader', 'UseLogminerReader', properties.UseLogminerReader != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLogminerReader) : undefined);
    ret.addPropertyResult('usePathPrefix', 'UsePathPrefix', properties.UsePathPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.UsePathPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a PostgreSQL endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Extra connection attributes when using PostgreSQL as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.ConnectionAttrib) and [Extra connection attributes when using PostgreSQL as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.PostgreSQL.html#CHAP_Target.PostgreSQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html
     */
    export interface PostgreSqlSettingsProperty {
        /**
         * For use with change data capture (CDC) only, this attribute has AWS DMS bypass foreign keys and user triggers to reduce the time it takes to bulk load data.
         *
         * Example: `afterConnectScript=SET session_replication_role='replica'`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-afterconnectscript
         */
        readonly afterConnectScript?: string;
        /**
         * To capture DDL events, AWS DMS creates various artifacts in the PostgreSQL database when the task starts. You can later remove these artifacts.
         *
         * If this value is set to `N` , you don't have to create tables or triggers on the source database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-captureddls
         */
        readonly captureDdls?: boolean | cdk.IResolvable;
        /**
         * The schema in which the operational DDL database artifacts are created.
         *
         * Example: `ddlArtifactsSchema=xyzddlschema;`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-ddlartifactsschema
         */
        readonly ddlArtifactsSchema?: string;
        /**
         * Sets the client statement timeout for the PostgreSQL instance, in seconds. The default value is 60 seconds.
         *
         * Example: `executeTimeout=100;`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-executetimeout
         */
        readonly executeTimeout?: number;
        /**
         * When set to `true` , this value causes a task to fail if the actual size of a LOB column is greater than the specified `LobMaxSize` .
         *
         * If task is set to Limited LOB mode and this option is set to true, the task fails instead of truncating the LOB data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-failtasksonlobtruncation
         */
        readonly failTasksOnLobTruncation?: boolean | cdk.IResolvable;
        /**
         * The write-ahead log (WAL) heartbeat feature mimics a dummy transaction. By doing this, it prevents idle logical replication slots from holding onto old WAL logs, which can result in storage full situations on the source. This heartbeat keeps `restart_lsn` moving and prevents storage full scenarios.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-heartbeatenable
         */
        readonly heartbeatEnable?: boolean | cdk.IResolvable;
        /**
         * Sets the WAL heartbeat frequency (in minutes).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-heartbeatfrequency
         */
        readonly heartbeatFrequency?: number;
        /**
         * Sets the schema in which the heartbeat artifacts are created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-heartbeatschema
         */
        readonly heartbeatSchema?: string;
        /**
         * Specifies the maximum size (in KB) of any .csv file used to transfer data to PostgreSQL.
         *
         * Example: `maxFileSize=512`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * Specifies the plugin to use to create a replication slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-pluginname
         */
        readonly pluginName?: string;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the PostgreSQL endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the PostgreSQL endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * Sets the name of a previously created logical replication slot for a change data capture (CDC) load of the PostgreSQL source instance.
         *
         * When used with the `CdcStartPosition` request parameter for the AWS DMS API , this attribute also makes it possible to use native CDC start points. DMS verifies that the specified logical replication slot exists before starting the CDC load task. It also verifies that the task was created with a valid setting of `CdcStartPosition` . If the specified slot doesn't exist or the task doesn't have a valid `CdcStartPosition` setting, DMS raises an error.
         *
         * For more information about setting the `CdcStartPosition` request parameter, see [Determining a CDC native start point](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html#CHAP_Task.CDC.StartPoint.Native) in the *AWS Database Migration Service User Guide* . For more information about using `CdcStartPosition` , see [CreateReplicationTask](https://docs.aws.amazon.com/dms/latest/APIReference/API_CreateReplicationTask.html) , [StartReplicationTask](https://docs.aws.amazon.com/dms/latest/APIReference/API_StartReplicationTask.html) , and [ModifyReplicationTask](https://docs.aws.amazon.com/dms/latest/APIReference/API_ModifyReplicationTask.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-postgresqlsettings.html#cfn-dms-endpoint-postgresqlsettings-slotname
         */
        readonly slotName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PostgreSqlSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `PostgreSqlSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_PostgreSqlSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('afterConnectScript', cdk.validateString)(properties.afterConnectScript));
    errors.collect(cdk.propertyValidator('captureDdls', cdk.validateBoolean)(properties.captureDdls));
    errors.collect(cdk.propertyValidator('ddlArtifactsSchema', cdk.validateString)(properties.ddlArtifactsSchema));
    errors.collect(cdk.propertyValidator('executeTimeout', cdk.validateNumber)(properties.executeTimeout));
    errors.collect(cdk.propertyValidator('failTasksOnLobTruncation', cdk.validateBoolean)(properties.failTasksOnLobTruncation));
    errors.collect(cdk.propertyValidator('heartbeatEnable', cdk.validateBoolean)(properties.heartbeatEnable));
    errors.collect(cdk.propertyValidator('heartbeatFrequency', cdk.validateNumber)(properties.heartbeatFrequency));
    errors.collect(cdk.propertyValidator('heartbeatSchema', cdk.validateString)(properties.heartbeatSchema));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('pluginName', cdk.validateString)(properties.pluginName));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('slotName', cdk.validateString)(properties.slotName));
    return errors.wrap('supplied properties not correct for "PostgreSqlSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.PostgreSqlSettings` resource
 *
 * @param properties - the TypeScript properties of a `PostgreSqlSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.PostgreSqlSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointPostgreSqlSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_PostgreSqlSettingsPropertyValidator(properties).assertSuccess();
    return {
        AfterConnectScript: cdk.stringToCloudFormation(properties.afterConnectScript),
        CaptureDdls: cdk.booleanToCloudFormation(properties.captureDdls),
        DdlArtifactsSchema: cdk.stringToCloudFormation(properties.ddlArtifactsSchema),
        ExecuteTimeout: cdk.numberToCloudFormation(properties.executeTimeout),
        FailTasksOnLobTruncation: cdk.booleanToCloudFormation(properties.failTasksOnLobTruncation),
        HeartbeatEnable: cdk.booleanToCloudFormation(properties.heartbeatEnable),
        HeartbeatFrequency: cdk.numberToCloudFormation(properties.heartbeatFrequency),
        HeartbeatSchema: cdk.stringToCloudFormation(properties.heartbeatSchema),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        PluginName: cdk.stringToCloudFormation(properties.pluginName),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        SlotName: cdk.stringToCloudFormation(properties.slotName),
    };
}

// @ts-ignore TS6133
function CfnEndpointPostgreSqlSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.PostgreSqlSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.PostgreSqlSettingsProperty>();
    ret.addPropertyResult('afterConnectScript', 'AfterConnectScript', properties.AfterConnectScript != null ? cfn_parse.FromCloudFormation.getString(properties.AfterConnectScript) : undefined);
    ret.addPropertyResult('captureDdls', 'CaptureDdls', properties.CaptureDdls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaptureDdls) : undefined);
    ret.addPropertyResult('ddlArtifactsSchema', 'DdlArtifactsSchema', properties.DdlArtifactsSchema != null ? cfn_parse.FromCloudFormation.getString(properties.DdlArtifactsSchema) : undefined);
    ret.addPropertyResult('executeTimeout', 'ExecuteTimeout', properties.ExecuteTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExecuteTimeout) : undefined);
    ret.addPropertyResult('failTasksOnLobTruncation', 'FailTasksOnLobTruncation', properties.FailTasksOnLobTruncation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailTasksOnLobTruncation) : undefined);
    ret.addPropertyResult('heartbeatEnable', 'HeartbeatEnable', properties.HeartbeatEnable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HeartbeatEnable) : undefined);
    ret.addPropertyResult('heartbeatFrequency', 'HeartbeatFrequency', properties.HeartbeatFrequency != null ? cfn_parse.FromCloudFormation.getNumber(properties.HeartbeatFrequency) : undefined);
    ret.addPropertyResult('heartbeatSchema', 'HeartbeatSchema', properties.HeartbeatSchema != null ? cfn_parse.FromCloudFormation.getString(properties.HeartbeatSchema) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('pluginName', 'PluginName', properties.PluginName != null ? cfn_parse.FromCloudFormation.getString(properties.PluginName) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('slotName', 'SlotName', properties.SlotName != null ? cfn_parse.FromCloudFormation.getString(properties.SlotName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a Redis target endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Specifying endpoint settings for Redis as a target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redis.html#CHAP_Target.Redis.EndpointSettings) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html
     */
    export interface RedisSettingsProperty {
        /**
         * The password provided with the `auth-role` and `auth-token` options of the `AuthType` setting for a Redis target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-authpassword
         */
        readonly authPassword?: string;
        /**
         * The type of authentication to perform when connecting to a Redis target. Options include `none` , `auth-token` , and `auth-role` . The `auth-token` option requires an `AuthPassword` value to be provided. The `auth-role` option requires `AuthUserName` and `AuthPassword` values to be provided.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-authtype
         */
        readonly authType?: string;
        /**
         * The user name provided with the `auth-role` option of the `AuthType` setting for a Redis target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-authusername
         */
        readonly authUserName?: string;
        /**
         * Transmission Control Protocol (TCP) port for the endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-port
         */
        readonly port?: number;
        /**
         * Fully qualified domain name of the endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-servername
         */
        readonly serverName?: string;
        /**
         * The Amazon Resource Name (ARN) for the certificate authority (CA) that DMS uses to connect to your Redis target endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-sslcacertificatearn
         */
        readonly sslCaCertificateArn?: string;
        /**
         * The connection to a Redis target endpoint using Transport Layer Security (TLS). Valid values include `plaintext` and `ssl-encryption` . The default is `ssl-encryption` . The `ssl-encryption` option makes an encrypted connection. Optionally, you can identify an Amazon Resource Name (ARN) for an SSL certificate authority (CA) using the `SslCaCertificateArn` setting. If an ARN isn't given for a CA, DMS uses the Amazon root CA.
         *
         * The `plaintext` option doesn't provide Transport Layer Security (TLS) encryption for traffic between endpoint and database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redissettings.html#cfn-dms-endpoint-redissettings-sslsecurityprotocol
         */
        readonly sslSecurityProtocol?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RedisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RedisSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_RedisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authPassword', cdk.validateString)(properties.authPassword));
    errors.collect(cdk.propertyValidator('authType', cdk.validateString)(properties.authType));
    errors.collect(cdk.propertyValidator('authUserName', cdk.validateString)(properties.authUserName));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('serverName', cdk.validateString)(properties.serverName));
    errors.collect(cdk.propertyValidator('sslCaCertificateArn', cdk.validateString)(properties.sslCaCertificateArn));
    errors.collect(cdk.propertyValidator('sslSecurityProtocol', cdk.validateString)(properties.sslSecurityProtocol));
    return errors.wrap('supplied properties not correct for "RedisSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.RedisSettings` resource
 *
 * @param properties - the TypeScript properties of a `RedisSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.RedisSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointRedisSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_RedisSettingsPropertyValidator(properties).assertSuccess();
    return {
        AuthPassword: cdk.stringToCloudFormation(properties.authPassword),
        AuthType: cdk.stringToCloudFormation(properties.authType),
        AuthUserName: cdk.stringToCloudFormation(properties.authUserName),
        Port: cdk.numberToCloudFormation(properties.port),
        ServerName: cdk.stringToCloudFormation(properties.serverName),
        SslCaCertificateArn: cdk.stringToCloudFormation(properties.sslCaCertificateArn),
        SslSecurityProtocol: cdk.stringToCloudFormation(properties.sslSecurityProtocol),
    };
}

// @ts-ignore TS6133
function CfnEndpointRedisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.RedisSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.RedisSettingsProperty>();
    ret.addPropertyResult('authPassword', 'AuthPassword', properties.AuthPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AuthPassword) : undefined);
    ret.addPropertyResult('authType', 'AuthType', properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined);
    ret.addPropertyResult('authUserName', 'AuthUserName', properties.AuthUserName != null ? cfn_parse.FromCloudFormation.getString(properties.AuthUserName) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('serverName', 'ServerName', properties.ServerName != null ? cfn_parse.FromCloudFormation.getString(properties.ServerName) : undefined);
    ret.addPropertyResult('sslCaCertificateArn', 'SslCaCertificateArn', properties.SslCaCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.SslCaCertificateArn) : undefined);
    ret.addPropertyResult('sslSecurityProtocol', 'SslSecurityProtocol', properties.SslSecurityProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.SslSecurityProtocol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an Amazon Redshift endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about other available settings, see [Extra connection attributes when using Amazon Redshift as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redshift.html#CHAP_Target.Redshift.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html
     */
    export interface RedshiftSettingsProperty {
        /**
         * A value that indicates to allow any date format, including invalid formats such as 00/00/00 00:00:00, to be loaded without generating an error. You can choose `true` or `false` (the default).
         *
         * This parameter applies only to TIMESTAMP and DATE columns. Always use ACCEPTANYDATE with the DATEFORMAT parameter. If the date format for the data doesn't match the DATEFORMAT specification, Amazon Redshift inserts a NULL value into that field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-acceptanydate
         */
        readonly acceptAnyDate?: boolean | cdk.IResolvable;
        /**
         * Code to run after connecting. This parameter should contain the code itself, not the name of a file containing the code.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-afterconnectscript
         */
        readonly afterConnectScript?: string;
        /**
         * An S3 folder where the comma-separated-value (.csv) files are stored before being uploaded to the target Redshift cluster.
         *
         * For full load mode, AWS DMS converts source records into .csv files and loads them to the *BucketFolder/TableID* path. AWS DMS uses the Redshift `COPY` command to upload the .csv files to the target table. The files are deleted once the `COPY` operation has finished. For more information, see [COPY](https://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html) in the *Amazon Redshift Database Developer Guide* .
         *
         * For change-data-capture (CDC) mode, AWS DMS creates a *NetChanges* table, and loads the .csv files to this *BucketFolder/NetChangesTableID* path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-bucketfolder
         */
        readonly bucketFolder?: string;
        /**
         * The name of the intermediate S3 bucket used to store .csv files before uploading data to Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-bucketname
         */
        readonly bucketName?: string;
        /**
         * If Amazon Redshift is configured to support case sensitive schema names, set `CaseSensitiveNames` to `true` . The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-casesensitivenames
         */
        readonly caseSensitiveNames?: boolean | cdk.IResolvable;
        /**
         * If you set `CompUpdate` to `true` Amazon Redshift applies automatic compression if the table is empty. This applies even if the table columns already have encodings other than `RAW` . If you set `CompUpdate` to `false` , automatic compression is disabled and existing column encodings aren't changed. The default is `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-compupdate
         */
        readonly compUpdate?: boolean | cdk.IResolvable;
        /**
         * A value that sets the amount of time to wait (in milliseconds) before timing out, beginning from when you initially establish a connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-connectiontimeout
         */
        readonly connectionTimeout?: number;
        /**
         * The date format that you are using. Valid values are `auto` (case-sensitive), your date format string enclosed in quotes, or NULL. If this parameter is left unset (NULL), it defaults to a format of 'YYYY-MM-DD'. Using `auto` recognizes most strings, even some that aren't supported when you use a date format string.
         *
         * If your date and time values use formats different from each other, set this to `auto` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-dateformat
         */
        readonly dateFormat?: string;
        /**
         * A value that specifies whether AWS DMS should migrate empty CHAR and VARCHAR fields as NULL. A value of `true` sets empty CHAR and VARCHAR fields to null. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-emptyasnull
         */
        readonly emptyAsNull?: boolean | cdk.IResolvable;
        /**
         * The type of server-side encryption that you want to use for your data. This encryption type is part of the endpoint settings or the extra connections attributes for Amazon S3. You can choose either `SSE_S3` (the default) or `SSE_KMS` .
         *
         * > For the `ModifyEndpoint` operation, you can change the existing value of the `EncryptionMode` parameter from `SSE_KMS` to `SSE_S3` . But you can’t change the existing value from `SSE_S3` to `SSE_KMS` .
         *
         * To use `SSE_S3` , create an AWS Identity and Access Management (IAM) role with a policy that allows `"arn:aws:s3:::*"` to use the following actions: `"s3:PutObject", "s3:ListBucket"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-encryptionmode
         */
        readonly encryptionMode?: string;
        /**
         * This setting is only valid for a full-load migration task. Set `ExplicitIds` to `true` to have tables with `IDENTITY` columns override their auto-generated values with explicit values loaded from the source data files used to populate the tables. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-explicitids
         */
        readonly explicitIds?: boolean | cdk.IResolvable;
        /**
         * The number of threads used to upload a single file. This parameter accepts a value from 1 through 64. It defaults to 10.
         *
         * The number of parallel streams used to upload a single .csv file to an S3 bucket using S3 Multipart Upload. For more information, see [Multipart upload overview](https://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html) .
         *
         * `FileTransferUploadStreams` accepts a value from 1 through 64. It defaults to 10.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-filetransferuploadstreams
         */
        readonly fileTransferUploadStreams?: number;
        /**
         * The amount of time to wait (in milliseconds) before timing out of operations performed by AWS DMS on a Redshift cluster, such as Redshift COPY, INSERT, DELETE, and UPDATE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-loadtimeout
         */
        readonly loadTimeout?: number;
        /**
         * The maximum size (in KB) of any .csv file used to load data on an S3 bucket and transfer data to Amazon Redshift. It defaults to 1048576KB (1 GB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * A value that specifies to remove surrounding quotation marks from strings in the incoming data. All characters within the quotation marks, including delimiters, are retained. Choose `true` to remove quotation marks. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-removequotes
         */
        readonly removeQuotes?: boolean | cdk.IResolvable;
        /**
         * A value that specifies to replaces the invalid characters specified in `ReplaceInvalidChars` , substituting the specified characters instead. The default is `"?"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-replacechars
         */
        readonly replaceChars?: string;
        /**
         * A list of characters that you want to replace. Use with `ReplaceChars` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-replaceinvalidchars
         */
        readonly replaceInvalidChars?: string;
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the Amazon Redshift endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the Amazon Redshift endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
        /**
         * The AWS KMS key ID. If you are using `SSE_KMS` for the `EncryptionMode` , provide this key ID. The key that you use needs an attached policy that enables IAM user permissions and allows use of the key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-serversideencryptionkmskeyid
         */
        readonly serverSideEncryptionKmsKeyId?: string;
        /**
         * The Amazon Resource Name (ARN) of the IAM role that has access to the Amazon Redshift service. The role must allow the `iam:PassRole` action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
        /**
         * The time format that you want to use. Valid values are `auto` (case-sensitive), `'timeformat_string'` , `'epochsecs'` , or `'epochmillisecs'` . It defaults to 10. Using `auto` recognizes most strings, even some that aren't supported when you use a time format string.
         *
         * If your date and time values use formats different from each other, set this parameter to `auto` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-timeformat
         */
        readonly timeFormat?: string;
        /**
         * A value that specifies to remove the trailing white space characters from a VARCHAR string. This parameter applies only to columns with a VARCHAR data type. Choose `true` to remove unneeded white space. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-trimblanks
         */
        readonly trimBlanks?: boolean | cdk.IResolvable;
        /**
         * A value that specifies to truncate data in columns to the appropriate number of characters, so that the data fits in the column. This parameter applies only to columns with a VARCHAR or CHAR data type, and rows with a size of 4 MB or less. Choose `true` to truncate data. The default is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-truncatecolumns
         */
        readonly truncateColumns?: boolean | cdk.IResolvable;
        /**
         * The size (in KB) of the in-memory file write buffer used when generating .csv files on the local disk at the DMS replication instance. The default value is 1000 (buffer size is 1000KB).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-redshiftsettings.html#cfn-dms-endpoint-redshiftsettings-writebuffersize
         */
        readonly writeBufferSize?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RedshiftSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_RedshiftSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptAnyDate', cdk.validateBoolean)(properties.acceptAnyDate));
    errors.collect(cdk.propertyValidator('afterConnectScript', cdk.validateString)(properties.afterConnectScript));
    errors.collect(cdk.propertyValidator('bucketFolder', cdk.validateString)(properties.bucketFolder));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('caseSensitiveNames', cdk.validateBoolean)(properties.caseSensitiveNames));
    errors.collect(cdk.propertyValidator('compUpdate', cdk.validateBoolean)(properties.compUpdate));
    errors.collect(cdk.propertyValidator('connectionTimeout', cdk.validateNumber)(properties.connectionTimeout));
    errors.collect(cdk.propertyValidator('dateFormat', cdk.validateString)(properties.dateFormat));
    errors.collect(cdk.propertyValidator('emptyAsNull', cdk.validateBoolean)(properties.emptyAsNull));
    errors.collect(cdk.propertyValidator('encryptionMode', cdk.validateString)(properties.encryptionMode));
    errors.collect(cdk.propertyValidator('explicitIds', cdk.validateBoolean)(properties.explicitIds));
    errors.collect(cdk.propertyValidator('fileTransferUploadStreams', cdk.validateNumber)(properties.fileTransferUploadStreams));
    errors.collect(cdk.propertyValidator('loadTimeout', cdk.validateNumber)(properties.loadTimeout));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('removeQuotes', cdk.validateBoolean)(properties.removeQuotes));
    errors.collect(cdk.propertyValidator('replaceChars', cdk.validateString)(properties.replaceChars));
    errors.collect(cdk.propertyValidator('replaceInvalidChars', cdk.validateString)(properties.replaceInvalidChars));
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    errors.collect(cdk.propertyValidator('serverSideEncryptionKmsKeyId', cdk.validateString)(properties.serverSideEncryptionKmsKeyId));
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    errors.collect(cdk.propertyValidator('timeFormat', cdk.validateString)(properties.timeFormat));
    errors.collect(cdk.propertyValidator('trimBlanks', cdk.validateBoolean)(properties.trimBlanks));
    errors.collect(cdk.propertyValidator('truncateColumns', cdk.validateBoolean)(properties.truncateColumns));
    errors.collect(cdk.propertyValidator('writeBufferSize', cdk.validateNumber)(properties.writeBufferSize));
    return errors.wrap('supplied properties not correct for "RedshiftSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.RedshiftSettings` resource
 *
 * @param properties - the TypeScript properties of a `RedshiftSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.RedshiftSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointRedshiftSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_RedshiftSettingsPropertyValidator(properties).assertSuccess();
    return {
        AcceptAnyDate: cdk.booleanToCloudFormation(properties.acceptAnyDate),
        AfterConnectScript: cdk.stringToCloudFormation(properties.afterConnectScript),
        BucketFolder: cdk.stringToCloudFormation(properties.bucketFolder),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        CaseSensitiveNames: cdk.booleanToCloudFormation(properties.caseSensitiveNames),
        CompUpdate: cdk.booleanToCloudFormation(properties.compUpdate),
        ConnectionTimeout: cdk.numberToCloudFormation(properties.connectionTimeout),
        DateFormat: cdk.stringToCloudFormation(properties.dateFormat),
        EmptyAsNull: cdk.booleanToCloudFormation(properties.emptyAsNull),
        EncryptionMode: cdk.stringToCloudFormation(properties.encryptionMode),
        ExplicitIds: cdk.booleanToCloudFormation(properties.explicitIds),
        FileTransferUploadStreams: cdk.numberToCloudFormation(properties.fileTransferUploadStreams),
        LoadTimeout: cdk.numberToCloudFormation(properties.loadTimeout),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        RemoveQuotes: cdk.booleanToCloudFormation(properties.removeQuotes),
        ReplaceChars: cdk.stringToCloudFormation(properties.replaceChars),
        ReplaceInvalidChars: cdk.stringToCloudFormation(properties.replaceInvalidChars),
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
        ServerSideEncryptionKmsKeyId: cdk.stringToCloudFormation(properties.serverSideEncryptionKmsKeyId),
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
        TimeFormat: cdk.stringToCloudFormation(properties.timeFormat),
        TrimBlanks: cdk.booleanToCloudFormation(properties.trimBlanks),
        TruncateColumns: cdk.booleanToCloudFormation(properties.truncateColumns),
        WriteBufferSize: cdk.numberToCloudFormation(properties.writeBufferSize),
    };
}

// @ts-ignore TS6133
function CfnEndpointRedshiftSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.RedshiftSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.RedshiftSettingsProperty>();
    ret.addPropertyResult('acceptAnyDate', 'AcceptAnyDate', properties.AcceptAnyDate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AcceptAnyDate) : undefined);
    ret.addPropertyResult('afterConnectScript', 'AfterConnectScript', properties.AfterConnectScript != null ? cfn_parse.FromCloudFormation.getString(properties.AfterConnectScript) : undefined);
    ret.addPropertyResult('bucketFolder', 'BucketFolder', properties.BucketFolder != null ? cfn_parse.FromCloudFormation.getString(properties.BucketFolder) : undefined);
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('caseSensitiveNames', 'CaseSensitiveNames', properties.CaseSensitiveNames != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaseSensitiveNames) : undefined);
    ret.addPropertyResult('compUpdate', 'CompUpdate', properties.CompUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CompUpdate) : undefined);
    ret.addPropertyResult('connectionTimeout', 'ConnectionTimeout', properties.ConnectionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionTimeout) : undefined);
    ret.addPropertyResult('dateFormat', 'DateFormat', properties.DateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFormat) : undefined);
    ret.addPropertyResult('emptyAsNull', 'EmptyAsNull', properties.EmptyAsNull != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EmptyAsNull) : undefined);
    ret.addPropertyResult('encryptionMode', 'EncryptionMode', properties.EncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMode) : undefined);
    ret.addPropertyResult('explicitIds', 'ExplicitIds', properties.ExplicitIds != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExplicitIds) : undefined);
    ret.addPropertyResult('fileTransferUploadStreams', 'FileTransferUploadStreams', properties.FileTransferUploadStreams != null ? cfn_parse.FromCloudFormation.getNumber(properties.FileTransferUploadStreams) : undefined);
    ret.addPropertyResult('loadTimeout', 'LoadTimeout', properties.LoadTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoadTimeout) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('removeQuotes', 'RemoveQuotes', properties.RemoveQuotes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveQuotes) : undefined);
    ret.addPropertyResult('replaceChars', 'ReplaceChars', properties.ReplaceChars != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceChars) : undefined);
    ret.addPropertyResult('replaceInvalidChars', 'ReplaceInvalidChars', properties.ReplaceInvalidChars != null ? cfn_parse.FromCloudFormation.getString(properties.ReplaceInvalidChars) : undefined);
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addPropertyResult('serverSideEncryptionKmsKeyId', 'ServerSideEncryptionKmsKeyId', properties.ServerSideEncryptionKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.ServerSideEncryptionKmsKeyId) : undefined);
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addPropertyResult('timeFormat', 'TimeFormat', properties.TimeFormat != null ? cfn_parse.FromCloudFormation.getString(properties.TimeFormat) : undefined);
    ret.addPropertyResult('trimBlanks', 'TrimBlanks', properties.TrimBlanks != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TrimBlanks) : undefined);
    ret.addPropertyResult('truncateColumns', 'TruncateColumns', properties.TruncateColumns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TruncateColumns) : undefined);
    ret.addPropertyResult('writeBufferSize', 'WriteBufferSize', properties.WriteBufferSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.WriteBufferSize) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines an Amazon S3 endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For more information about the available settings, see [Extra connection attributes when using Amazon S3 as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.S3.html#CHAP_Source.S3.Configuring) and [Extra connection attributes when using Amazon S3 as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html
     */
    export interface S3SettingsProperty {
        /**
         * An optional parameter that, when set to `true` or `y` , you can use to add column name information to the .csv output file.
         *
         * The default value is `false` . Valid values are `true` , `false` , `y` , and `n` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-addcolumnname
         */
        readonly addColumnName?: boolean | cdk.IResolvable;
        /**
         * An optional parameter to set a folder name in the S3 bucket. If provided, tables are created in the path `*bucketFolder* / *schema_name* / *table_name* /` . If this parameter isn't specified, the path used is `*schema_name* / *table_name* /` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-bucketfolder
         */
        readonly bucketFolder?: string;
        /**
         * The name of the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-bucketname
         */
        readonly bucketName?: string;
        /**
         * A value that enables AWS DMS to specify a predefined (canned) access control list (ACL) for objects created in an Amazon S3 bucket as .csv or .parquet files. For more information about Amazon S3 canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 Developer Guide* .
         *
         * The default value is NONE. Valid values include NONE, PRIVATE, PUBLIC_READ, PUBLIC_READ_WRITE, AUTHENTICATED_READ, AWS_EXEC_READ, BUCKET_OWNER_READ, and BUCKET_OWNER_FULL_CONTROL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cannedaclforobjects
         */
        readonly cannedAclForObjects?: string;
        /**
         * A value that enables a change data capture (CDC) load to write INSERT and UPDATE operations to .csv or .parquet (columnar storage) output files. The default setting is `false` , but when `CdcInsertsAndUpdates` is set to `true` or `y` , only INSERTs and UPDATEs from the source database are migrated to the .csv or .parquet file.
         *
         * For .csv file format only, how these INSERTs and UPDATEs are recorded depends on the value of the `IncludeOpForFullLoad` parameter. If `IncludeOpForFullLoad` is set to `true` , the first field of every CDC record is set to either `I` or `U` to indicate INSERT and UPDATE operations at the source. But if `IncludeOpForFullLoad` is set to `false` , CDC records are written without an indication of INSERT or UPDATE operations at the source. For more information about how these settings work together, see [Indicating Source DB Operations in Migrated S3 Data](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring.InsertOps) in the *AWS Database Migration Service User Guide* .
         *
         * > AWS DMS supports the use of the `CdcInsertsAndUpdates` parameter in versions 3.3.1 and later.
         * >
         * > `CdcInsertsOnly` and `CdcInsertsAndUpdates` can't both be set to `true` for the same endpoint. Set either `CdcInsertsOnly` or `CdcInsertsAndUpdates` to `true` for the same endpoint, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cdcinsertsandupdates
         */
        readonly cdcInsertsAndUpdates?: boolean | cdk.IResolvable;
        /**
         * A value that enables a change data capture (CDC) load to write only INSERT operations to .csv or columnar storage (.parquet) output files. By default (the `false` setting), the first field in a .csv or .parquet record contains the letter I (INSERT), U (UPDATE), or D (DELETE). These values indicate whether the row was inserted, updated, or deleted at the source database for a CDC load to the target.
         *
         * If `CdcInsertsOnly` is set to `true` or `y` , only INSERTs from the source database are migrated to the .csv or .parquet file. For .csv format only, how these INSERTs are recorded depends on the value of `IncludeOpForFullLoad` . If `IncludeOpForFullLoad` is set to `true` , the first field of every CDC record is set to I to indicate the INSERT operation at the source. If `IncludeOpForFullLoad` is set to `false` , every CDC record is written without a first field to indicate the INSERT operation at the source. For more information about how these settings work together, see [Indicating Source DB Operations in Migrated S3 Data](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring.InsertOps) in the *AWS Database Migration Service User Guide* .
         *
         * > AWS DMS supports the interaction described preceding between the `CdcInsertsOnly` and `IncludeOpForFullLoad` parameters in versions 3.1.4 and later.
         * >
         * > `CdcInsertsOnly` and `CdcInsertsAndUpdates` can't both be set to `true` for the same endpoint. Set either `CdcInsertsOnly` or `CdcInsertsAndUpdates` to `true` for the same endpoint, but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cdcinsertsonly
         */
        readonly cdcInsertsOnly?: boolean | cdk.IResolvable;
        /**
         * Maximum length of the interval, defined in seconds, after which to output a file to Amazon S3.
         *
         * When `CdcMaxBatchInterval` and `CdcMinFileSize` are both specified, the file write is triggered by whichever parameter condition is met first within an AWS DMS CloudFormation template.
         *
         * The default value is 60 seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cdcmaxbatchinterval
         */
        readonly cdcMaxBatchInterval?: number;
        /**
         * Minimum file size, defined in kilobytes, to reach for a file output to Amazon S3.
         *
         * When `CdcMinFileSize` and `CdcMaxBatchInterval` are both specified, the file write is triggered by whichever parameter condition is met first within an AWS DMS CloudFormation template.
         *
         * The default value is 32 MB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cdcminfilesize
         */
        readonly cdcMinFileSize?: number;
        /**
         * Specifies the folder path of CDC files. For an S3 source, this setting is required if a task captures change data; otherwise, it's optional. If `CdcPath` is set, AWS DMS reads CDC files from this path and replicates the data changes to the target endpoint. For an S3 target if you set [`PreserveTransactions`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-PreserveTransactions) to `true` , AWS DMS verifies that you have set this parameter to a folder path on your S3 target where AWS DMS can save the transaction order for the CDC load. AWS DMS creates this CDC folder path in either your S3 target working directory or the S3 target location specified by [`BucketFolder`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-BucketFolder) and [`BucketName`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-BucketName) .
         *
         * For example, if you specify `CdcPath` as `MyChangedData` , and you specify `BucketName` as `MyTargetBucket` but do not specify `BucketFolder` , AWS DMS creates the CDC folder path following: `MyTargetBucket/MyChangedData` .
         *
         * If you specify the same `CdcPath` , and you specify `BucketName` as `MyTargetBucket` and `BucketFolder` as `MyTargetData` , AWS DMS creates the CDC folder path following: `MyTargetBucket/MyTargetData/MyChangedData` .
         *
         * For more information on CDC including transaction order on an S3 target, see [Capturing data changes (CDC) including transaction order on the S3 target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.EndpointSettings.CdcPath) .
         *
         * > This setting is supported in AWS DMS versions 3.4.2 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-cdcpath
         */
        readonly cdcPath?: string;
        /**
         * An optional parameter. When set to GZIP it enables the service to compress the target files. To allow the service to write the target files uncompressed, either set this parameter to NONE (the default) or don't specify the parameter at all. This parameter applies to both .csv and .parquet file formats.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-compressiontype
         */
        readonly compressionType?: string;
        /**
         * The delimiter used to separate columns in the .csv file for both source and target. The default is a comma.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvdelimiter
         */
        readonly csvDelimiter?: string;
        /**
         * This setting only applies if your Amazon S3 output files during a change data capture (CDC) load are written in .csv format. If [`UseCsvNoSupValue`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-UseCsvNoSupValue) is set to true, specify a string value that you want AWS DMS to use for all columns not included in the supplemental log. If you do not specify a string value, AWS DMS uses the null value for these columns regardless of the `UseCsvNoSupValue` setting.
         *
         * > This setting is supported in AWS DMS versions 3.4.1 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvnosupvalue
         */
        readonly csvNoSupValue?: string;
        /**
         * An optional parameter that specifies how AWS DMS treats null values. While handling the null value, you can use this parameter to pass a user-defined string as null when writing to the target. For example, when target columns are not nullable, you can use this option to differentiate between the empty string value and the null value. So, if you set this parameter value to the empty string ("" or ''), AWS DMS treats the empty string as the null value instead of `NULL` .
         *
         * The default value is `NULL` . Valid values include any valid string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvnullvalue
         */
        readonly csvNullValue?: string;
        /**
         * The delimiter used to separate rows in the .csv file for both source and target.
         *
         * The default is a carriage return ( `\n` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-csvrowdelimiter
         */
        readonly csvRowDelimiter?: string;
        /**
         * The format of the data that you want to use for output. You can choose one of the following:
         *
         * - `csv` : This is a row-based file format with comma-separated values (.csv).
         * - `parquet` : Apache Parquet (.parquet) is a columnar storage file format that features efficient compression and provides faster query response.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-dataformat
         */
        readonly dataFormat?: string;
        /**
         * The size of one data page in bytes. This parameter defaults to 1024 * 1024 bytes (1 MiB). This number is used for .parquet file format only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-datapagesize
         */
        readonly dataPageSize?: number;
        /**
         * Specifies a date separating delimiter to use during folder partitioning. The default value is `SLASH` . Use this parameter when `DatePartitionedEnabled` is set to `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-datepartitiondelimiter
         */
        readonly datePartitionDelimiter?: string;
        /**
         * When set to `true` , this parameter partitions S3 bucket folders based on transaction commit dates. The default value is `false` . For more information about date-based folder partitioning, see [Using date-based folder partitioning](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.DatePartitioning) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-datepartitionenabled
         */
        readonly datePartitionEnabled?: boolean | cdk.IResolvable;
        /**
         * Identifies the sequence of the date format to use during folder partitioning. The default value is `YYYYMMDD` . Use this parameter when `DatePartitionedEnabled` is set to `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-datepartitionsequence
         */
        readonly datePartitionSequence?: string;
        /**
         * When creating an S3 target endpoint, set `DatePartitionTimezone` to convert the current UTC time into a specified time zone. The conversion occurs when a date partition folder is created and a change data capture (CDC) file name is generated. The time zone format is Area/Location. Use this parameter when `DatePartitionedEnabled` is set to `true` , as shown in the following example.
         *
         * `s3-settings='{"DatePartitionEnabled": true, "DatePartitionSequence": "YYYYMMDDHH", "DatePartitionDelimiter": "SLASH", "DatePartitionTimezone":" *Asia/Seoul* ", "BucketName": "dms-nattarat-test"}'`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-datepartitiontimezone
         */
        readonly datePartitionTimezone?: string;
        /**
         * The maximum size of an encoded dictionary page of a column. If the dictionary page exceeds this, this column is stored using an encoding type of `PLAIN` . This parameter defaults to 1024 * 1024 bytes (1 MiB), the maximum size of a dictionary page before it reverts to `PLAIN` encoding. This size is used for .parquet file format only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-dictpagesizelimit
         */
        readonly dictPageSizeLimit?: number;
        /**
         * A value that enables statistics for Parquet pages and row groups. Choose `true` to enable statistics, `false` to disable. Statistics include `NULL` , `DISTINCT` , `MAX` , and `MIN` values. This parameter defaults to `true` . This value is used for .parquet file format only.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-enablestatistics
         */
        readonly enableStatistics?: boolean | cdk.IResolvable;
        /**
         * The type of encoding that you're using:
         *
         * - `RLE_DICTIONARY` uses a combination of bit-packing and run-length encoding to store repeated values more efficiently. This is the default.
         * - `PLAIN` doesn't use encoding at all. Values are stored as they are.
         * - `PLAIN_DICTIONARY` builds a dictionary of the values encountered in a given column. The dictionary is stored in a dictionary page for each column chunk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-encodingtype
         */
        readonly encodingType?: string;
        /**
         * The type of server-side encryption that you want to use for your data. This encryption type is part of the endpoint settings or the extra connections attributes for Amazon S3. You can choose either `SSE_S3` (the default) or `SSE_KMS` .
         *
         * > For the `ModifyEndpoint` operation, you can change the existing value of the `EncryptionMode` parameter from `SSE_KMS` to `SSE_S3` . But you can’t change the existing value from `SSE_S3` to `SSE_KMS` .
         *
         * To use `SSE_S3` , you need an IAM role with permission to allow `"arn:aws:s3:::dms-*"` to use the following actions:
         *
         * - `s3:CreateBucket`
         * - `s3:ListBucket`
         * - `s3:DeleteBucket`
         * - `s3:GetBucketLocation`
         * - `s3:GetObject`
         * - `s3:PutObject`
         * - `s3:DeleteObject`
         * - `s3:GetObjectVersion`
         * - `s3:GetBucketPolicy`
         * - `s3:PutBucketPolicy`
         * - `s3:DeleteBucketPolicy`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-encryptionmode
         */
        readonly encryptionMode?: string;
        /**
         * The external table definition.
         *
         * Conditional: If `S3` is used as a source then `ExternalTableDefinition` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-externaltabledefinition
         */
        readonly externalTableDefinition?: string;
        /**
         * When this value is set to 1, AWS DMS ignores the first row header in a .csv file. A value of 1 turns on the feature; a value of 0 turns off the feature.
         *
         * The default is 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-ignoreheaderrows
         */
        readonly ignoreHeaderRows?: number;
        /**
         * A value that enables a full load to write INSERT operations to the comma-separated value (.csv) output files only to indicate how the rows were added to the source database.
         *
         * > AWS DMS supports the `IncludeOpForFullLoad` parameter in versions 3.1.4 and later.
         *
         * For full load, records can only be inserted. By default (the `false` setting), no information is recorded in these output files for a full load to indicate that the rows were inserted at the source database. If `IncludeOpForFullLoad` is set to `true` or `y` , the INSERT is recorded as an I annotation in the first field of the .csv file. This allows the format of your target records from a full load to be consistent with the target records from a CDC load.
         *
         * > This setting works together with the `CdcInsertsOnly` and the `CdcInsertsAndUpdates` parameters for output to .csv files only. For more information about how these settings work together, see [Indicating Source DB Operations in Migrated S3 Data](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.Configuring.InsertOps) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-includeopforfullload
         */
        readonly includeOpForFullLoad?: boolean | cdk.IResolvable;
        /**
         * A value that specifies the maximum size (in KB) of any .csv file to be created while migrating to an S3 target during full load.
         *
         * The default value is 1,048,576 KB (1 GB). Valid values include 1 to 1,048,576.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-maxfilesize
         */
        readonly maxFileSize?: number;
        /**
         * A value that specifies the precision of any `TIMESTAMP` column values that are written to an Amazon S3 object file in .parquet format.
         *
         * > AWS DMS supports the `ParquetTimestampInMillisecond` parameter in versions 3.1.4 and later.
         *
         * When `ParquetTimestampInMillisecond` is set to `true` or `y` , AWS DMS writes all `TIMESTAMP` columns in a .parquet formatted file with millisecond precision. Otherwise, DMS writes them with microsecond precision.
         *
         * Currently, Amazon Athena and AWS Glue can handle only millisecond precision for `TIMESTAMP` values. Set this parameter to `true` for S3 endpoint object files that are .parquet formatted only if you plan to query or process the data with Athena or AWS Glue .
         *
         * > AWS DMS writes any `TIMESTAMP` column values written to an S3 file in .csv format with microsecond precision.
         * >
         * > Setting `ParquetTimestampInMillisecond` has no effect on the string format of the timestamp column value that is inserted by setting the `TimestampColumnName` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-parquettimestampinmillisecond
         */
        readonly parquetTimestampInMillisecond?: boolean | cdk.IResolvable;
        /**
         * The version of the Apache Parquet format that you want to use: `parquet_1_0` (the default) or `parquet_2_0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-parquetversion
         */
        readonly parquetVersion?: string;
        /**
         * If this setting is set to `true` , AWS DMS saves the transaction order for a change data capture (CDC) load on the Amazon S3 target specified by [`CdcPath`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-CdcPath) . For more information, see [Capturing data changes (CDC) including transaction order on the S3 target](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html#CHAP_Target.S3.EndpointSettings.CdcPath) .
         *
         * > This setting is supported in AWS DMS versions 3.4.2 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-preservetransactions
         */
        readonly preserveTransactions?: boolean | cdk.IResolvable;
        /**
         * For an S3 source, when this value is set to `true` or `y` , each leading double quotation mark has to be followed by an ending double quotation mark. This formatting complies with RFC 4180. When this value is set to `false` or `n` , string literals are copied to the target as is. In this case, a delimiter (row or column) signals the end of the field. Thus, you can't use a delimiter as part of the string, because it signals the end of the value.
         *
         * For an S3 target, an optional parameter used to set behavior to comply with RFC 4180 for data migrated to Amazon S3 using .csv file format only. When this value is set to `true` or `y` using Amazon S3 as a target, if the data has quotation marks or newline characters in it, AWS DMS encloses the entire column with an additional pair of double quotation marks ("). Every quotation mark within the data is repeated twice.
         *
         * The default value is `true` . Valid values include `true` , `false` , `y` , and `n` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-rfc4180
         */
        readonly rfc4180?: boolean | cdk.IResolvable;
        /**
         * The number of rows in a row group. A smaller row group size provides faster reads. But as the number of row groups grows, the slower writes become. This parameter defaults to 10,000 rows. This number is used for .parquet file format only.
         *
         * If you choose a value larger than the maximum, `RowGroupLength` is set to the max row group length in bytes (64 * 1024 * 1024).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-rowgrouplength
         */
        readonly rowGroupLength?: number;
        /**
         * If you are using `SSE_KMS` for the `EncryptionMode` , provide the AWS KMS key ID. The key that you use needs an attached policy that enables IAM user permissions and allows use of the key.
         *
         * Here is a CLI example: `aws dms create-endpoint --endpoint-identifier *value* --endpoint-type target --engine-name s3 --s3-settings ServiceAccessRoleArn= *value* ,BucketFolder= *value* ,BucketName= *value* ,EncryptionMode=SSE_KMS,ServerSideEncryptionKmsKeyId= *value*`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-serversideencryptionkmskeyid
         */
        readonly serverSideEncryptionKmsKeyId?: string;
        /**
         * A required parameter that specifies the Amazon Resource Name (ARN) used by the service to access the IAM role. The role must allow the `iam:PassRole` action. It enables AWS DMS to read and write objects from an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-serviceaccessrolearn
         */
        readonly serviceAccessRoleArn?: string;
        /**
         * A value that when nonblank causes AWS DMS to add a column with timestamp information to the endpoint data for an Amazon S3 target.
         *
         * > AWS DMS supports the `TimestampColumnName` parameter in versions 3.1.4 and later.
         *
         * AWS DMS includes an additional `STRING` column in the .csv or .parquet object files of your migrated data when you set `TimestampColumnName` to a nonblank value.
         *
         * For a full load, each row of this timestamp column contains a timestamp for when the data was transferred from the source to the target by DMS.
         *
         * For a change data capture (CDC) load, each row of the timestamp column contains the timestamp for the commit of that row in the source database.
         *
         * The string format for this timestamp column value is `yyyy-MM-dd HH:mm:ss.SSSSSS` . By default, the precision of this value is in microseconds. For a CDC load, the rounding of the precision depends on the commit timestamp supported by DMS for the source database.
         *
         * When the `AddColumnName` parameter is set to `true` , DMS also includes a name for the timestamp column that you set with `TimestampColumnName` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-timestampcolumnname
         */
        readonly timestampColumnName?: string;
        /**
         * This setting applies if the S3 output files during a change data capture (CDC) load are written in .csv format. If this setting is set to `true` for columns not included in the supplemental log, AWS DMS uses the value specified by [`CsvNoSupValue`](https://docs.aws.amazon.com/dms/latest/APIReference/API_S3Settings.html#DMS-Type-S3Settings-CsvNoSupValue) . If this setting isn't set or is set to `false` , AWS DMS uses the null value for these columns.
         *
         * > This setting is supported in AWS DMS versions 3.4.1 and later.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-usecsvnosupvalue
         */
        readonly useCsvNoSupValue?: boolean | cdk.IResolvable;
        /**
         * When set to true, this parameter uses the task start time as the timestamp column value instead of the time data is written to target. For full load, when `useTaskStartTimeForFullLoadTimestamp` is set to `true` , each row of the timestamp column contains the task start time. For CDC loads, each row of the timestamp column contains the transaction commit time.
         *
         * When `useTaskStartTimeForFullLoadTimestamp` is set to `false` , the full load timestamp in the timestamp column increments with the time data arrives at the target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-s3settings.html#cfn-dms-endpoint-s3settings-usetaskstarttimeforfullloadtimestamp
         */
        readonly useTaskStartTimeForFullLoadTimestamp?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `S3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_S3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addColumnName', cdk.validateBoolean)(properties.addColumnName));
    errors.collect(cdk.propertyValidator('bucketFolder', cdk.validateString)(properties.bucketFolder));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('cannedAclForObjects', cdk.validateString)(properties.cannedAclForObjects));
    errors.collect(cdk.propertyValidator('cdcInsertsAndUpdates', cdk.validateBoolean)(properties.cdcInsertsAndUpdates));
    errors.collect(cdk.propertyValidator('cdcInsertsOnly', cdk.validateBoolean)(properties.cdcInsertsOnly));
    errors.collect(cdk.propertyValidator('cdcMaxBatchInterval', cdk.validateNumber)(properties.cdcMaxBatchInterval));
    errors.collect(cdk.propertyValidator('cdcMinFileSize', cdk.validateNumber)(properties.cdcMinFileSize));
    errors.collect(cdk.propertyValidator('cdcPath', cdk.validateString)(properties.cdcPath));
    errors.collect(cdk.propertyValidator('compressionType', cdk.validateString)(properties.compressionType));
    errors.collect(cdk.propertyValidator('csvDelimiter', cdk.validateString)(properties.csvDelimiter));
    errors.collect(cdk.propertyValidator('csvNoSupValue', cdk.validateString)(properties.csvNoSupValue));
    errors.collect(cdk.propertyValidator('csvNullValue', cdk.validateString)(properties.csvNullValue));
    errors.collect(cdk.propertyValidator('csvRowDelimiter', cdk.validateString)(properties.csvRowDelimiter));
    errors.collect(cdk.propertyValidator('dataFormat', cdk.validateString)(properties.dataFormat));
    errors.collect(cdk.propertyValidator('dataPageSize', cdk.validateNumber)(properties.dataPageSize));
    errors.collect(cdk.propertyValidator('datePartitionDelimiter', cdk.validateString)(properties.datePartitionDelimiter));
    errors.collect(cdk.propertyValidator('datePartitionEnabled', cdk.validateBoolean)(properties.datePartitionEnabled));
    errors.collect(cdk.propertyValidator('datePartitionSequence', cdk.validateString)(properties.datePartitionSequence));
    errors.collect(cdk.propertyValidator('datePartitionTimezone', cdk.validateString)(properties.datePartitionTimezone));
    errors.collect(cdk.propertyValidator('dictPageSizeLimit', cdk.validateNumber)(properties.dictPageSizeLimit));
    errors.collect(cdk.propertyValidator('enableStatistics', cdk.validateBoolean)(properties.enableStatistics));
    errors.collect(cdk.propertyValidator('encodingType', cdk.validateString)(properties.encodingType));
    errors.collect(cdk.propertyValidator('encryptionMode', cdk.validateString)(properties.encryptionMode));
    errors.collect(cdk.propertyValidator('externalTableDefinition', cdk.validateString)(properties.externalTableDefinition));
    errors.collect(cdk.propertyValidator('ignoreHeaderRows', cdk.validateNumber)(properties.ignoreHeaderRows));
    errors.collect(cdk.propertyValidator('includeOpForFullLoad', cdk.validateBoolean)(properties.includeOpForFullLoad));
    errors.collect(cdk.propertyValidator('maxFileSize', cdk.validateNumber)(properties.maxFileSize));
    errors.collect(cdk.propertyValidator('parquetTimestampInMillisecond', cdk.validateBoolean)(properties.parquetTimestampInMillisecond));
    errors.collect(cdk.propertyValidator('parquetVersion', cdk.validateString)(properties.parquetVersion));
    errors.collect(cdk.propertyValidator('preserveTransactions', cdk.validateBoolean)(properties.preserveTransactions));
    errors.collect(cdk.propertyValidator('rfc4180', cdk.validateBoolean)(properties.rfc4180));
    errors.collect(cdk.propertyValidator('rowGroupLength', cdk.validateNumber)(properties.rowGroupLength));
    errors.collect(cdk.propertyValidator('serverSideEncryptionKmsKeyId', cdk.validateString)(properties.serverSideEncryptionKmsKeyId));
    errors.collect(cdk.propertyValidator('serviceAccessRoleArn', cdk.validateString)(properties.serviceAccessRoleArn));
    errors.collect(cdk.propertyValidator('timestampColumnName', cdk.validateString)(properties.timestampColumnName));
    errors.collect(cdk.propertyValidator('useCsvNoSupValue', cdk.validateBoolean)(properties.useCsvNoSupValue));
    errors.collect(cdk.propertyValidator('useTaskStartTimeForFullLoadTimestamp', cdk.validateBoolean)(properties.useTaskStartTimeForFullLoadTimestamp));
    return errors.wrap('supplied properties not correct for "S3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.S3Settings` resource
 *
 * @param properties - the TypeScript properties of a `S3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.S3Settings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointS3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_S3SettingsPropertyValidator(properties).assertSuccess();
    return {
        AddColumnName: cdk.booleanToCloudFormation(properties.addColumnName),
        BucketFolder: cdk.stringToCloudFormation(properties.bucketFolder),
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        CannedAclForObjects: cdk.stringToCloudFormation(properties.cannedAclForObjects),
        CdcInsertsAndUpdates: cdk.booleanToCloudFormation(properties.cdcInsertsAndUpdates),
        CdcInsertsOnly: cdk.booleanToCloudFormation(properties.cdcInsertsOnly),
        CdcMaxBatchInterval: cdk.numberToCloudFormation(properties.cdcMaxBatchInterval),
        CdcMinFileSize: cdk.numberToCloudFormation(properties.cdcMinFileSize),
        CdcPath: cdk.stringToCloudFormation(properties.cdcPath),
        CompressionType: cdk.stringToCloudFormation(properties.compressionType),
        CsvDelimiter: cdk.stringToCloudFormation(properties.csvDelimiter),
        CsvNoSupValue: cdk.stringToCloudFormation(properties.csvNoSupValue),
        CsvNullValue: cdk.stringToCloudFormation(properties.csvNullValue),
        CsvRowDelimiter: cdk.stringToCloudFormation(properties.csvRowDelimiter),
        DataFormat: cdk.stringToCloudFormation(properties.dataFormat),
        DataPageSize: cdk.numberToCloudFormation(properties.dataPageSize),
        DatePartitionDelimiter: cdk.stringToCloudFormation(properties.datePartitionDelimiter),
        DatePartitionEnabled: cdk.booleanToCloudFormation(properties.datePartitionEnabled),
        DatePartitionSequence: cdk.stringToCloudFormation(properties.datePartitionSequence),
        DatePartitionTimezone: cdk.stringToCloudFormation(properties.datePartitionTimezone),
        DictPageSizeLimit: cdk.numberToCloudFormation(properties.dictPageSizeLimit),
        EnableStatistics: cdk.booleanToCloudFormation(properties.enableStatistics),
        EncodingType: cdk.stringToCloudFormation(properties.encodingType),
        EncryptionMode: cdk.stringToCloudFormation(properties.encryptionMode),
        ExternalTableDefinition: cdk.stringToCloudFormation(properties.externalTableDefinition),
        IgnoreHeaderRows: cdk.numberToCloudFormation(properties.ignoreHeaderRows),
        IncludeOpForFullLoad: cdk.booleanToCloudFormation(properties.includeOpForFullLoad),
        MaxFileSize: cdk.numberToCloudFormation(properties.maxFileSize),
        ParquetTimestampInMillisecond: cdk.booleanToCloudFormation(properties.parquetTimestampInMillisecond),
        ParquetVersion: cdk.stringToCloudFormation(properties.parquetVersion),
        PreserveTransactions: cdk.booleanToCloudFormation(properties.preserveTransactions),
        Rfc4180: cdk.booleanToCloudFormation(properties.rfc4180),
        RowGroupLength: cdk.numberToCloudFormation(properties.rowGroupLength),
        ServerSideEncryptionKmsKeyId: cdk.stringToCloudFormation(properties.serverSideEncryptionKmsKeyId),
        ServiceAccessRoleArn: cdk.stringToCloudFormation(properties.serviceAccessRoleArn),
        TimestampColumnName: cdk.stringToCloudFormation(properties.timestampColumnName),
        UseCsvNoSupValue: cdk.booleanToCloudFormation(properties.useCsvNoSupValue),
        UseTaskStartTimeForFullLoadTimestamp: cdk.booleanToCloudFormation(properties.useTaskStartTimeForFullLoadTimestamp),
    };
}

// @ts-ignore TS6133
function CfnEndpointS3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.S3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.S3SettingsProperty>();
    ret.addPropertyResult('addColumnName', 'AddColumnName', properties.AddColumnName != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddColumnName) : undefined);
    ret.addPropertyResult('bucketFolder', 'BucketFolder', properties.BucketFolder != null ? cfn_parse.FromCloudFormation.getString(properties.BucketFolder) : undefined);
    ret.addPropertyResult('bucketName', 'BucketName', properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined);
    ret.addPropertyResult('cannedAclForObjects', 'CannedAclForObjects', properties.CannedAclForObjects != null ? cfn_parse.FromCloudFormation.getString(properties.CannedAclForObjects) : undefined);
    ret.addPropertyResult('cdcInsertsAndUpdates', 'CdcInsertsAndUpdates', properties.CdcInsertsAndUpdates != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CdcInsertsAndUpdates) : undefined);
    ret.addPropertyResult('cdcInsertsOnly', 'CdcInsertsOnly', properties.CdcInsertsOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CdcInsertsOnly) : undefined);
    ret.addPropertyResult('cdcMaxBatchInterval', 'CdcMaxBatchInterval', properties.CdcMaxBatchInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CdcMaxBatchInterval) : undefined);
    ret.addPropertyResult('cdcMinFileSize', 'CdcMinFileSize', properties.CdcMinFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.CdcMinFileSize) : undefined);
    ret.addPropertyResult('cdcPath', 'CdcPath', properties.CdcPath != null ? cfn_parse.FromCloudFormation.getString(properties.CdcPath) : undefined);
    ret.addPropertyResult('compressionType', 'CompressionType', properties.CompressionType != null ? cfn_parse.FromCloudFormation.getString(properties.CompressionType) : undefined);
    ret.addPropertyResult('csvDelimiter', 'CsvDelimiter', properties.CsvDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.CsvDelimiter) : undefined);
    ret.addPropertyResult('csvNoSupValue', 'CsvNoSupValue', properties.CsvNoSupValue != null ? cfn_parse.FromCloudFormation.getString(properties.CsvNoSupValue) : undefined);
    ret.addPropertyResult('csvNullValue', 'CsvNullValue', properties.CsvNullValue != null ? cfn_parse.FromCloudFormation.getString(properties.CsvNullValue) : undefined);
    ret.addPropertyResult('csvRowDelimiter', 'CsvRowDelimiter', properties.CsvRowDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.CsvRowDelimiter) : undefined);
    ret.addPropertyResult('dataFormat', 'DataFormat', properties.DataFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DataFormat) : undefined);
    ret.addPropertyResult('dataPageSize', 'DataPageSize', properties.DataPageSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DataPageSize) : undefined);
    ret.addPropertyResult('datePartitionDelimiter', 'DatePartitionDelimiter', properties.DatePartitionDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.DatePartitionDelimiter) : undefined);
    ret.addPropertyResult('datePartitionEnabled', 'DatePartitionEnabled', properties.DatePartitionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DatePartitionEnabled) : undefined);
    ret.addPropertyResult('datePartitionSequence', 'DatePartitionSequence', properties.DatePartitionSequence != null ? cfn_parse.FromCloudFormation.getString(properties.DatePartitionSequence) : undefined);
    ret.addPropertyResult('datePartitionTimezone', 'DatePartitionTimezone', properties.DatePartitionTimezone != null ? cfn_parse.FromCloudFormation.getString(properties.DatePartitionTimezone) : undefined);
    ret.addPropertyResult('dictPageSizeLimit', 'DictPageSizeLimit', properties.DictPageSizeLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.DictPageSizeLimit) : undefined);
    ret.addPropertyResult('enableStatistics', 'EnableStatistics', properties.EnableStatistics != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableStatistics) : undefined);
    ret.addPropertyResult('encodingType', 'EncodingType', properties.EncodingType != null ? cfn_parse.FromCloudFormation.getString(properties.EncodingType) : undefined);
    ret.addPropertyResult('encryptionMode', 'EncryptionMode', properties.EncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMode) : undefined);
    ret.addPropertyResult('externalTableDefinition', 'ExternalTableDefinition', properties.ExternalTableDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.ExternalTableDefinition) : undefined);
    ret.addPropertyResult('ignoreHeaderRows', 'IgnoreHeaderRows', properties.IgnoreHeaderRows != null ? cfn_parse.FromCloudFormation.getNumber(properties.IgnoreHeaderRows) : undefined);
    ret.addPropertyResult('includeOpForFullLoad', 'IncludeOpForFullLoad', properties.IncludeOpForFullLoad != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeOpForFullLoad) : undefined);
    ret.addPropertyResult('maxFileSize', 'MaxFileSize', properties.MaxFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileSize) : undefined);
    ret.addPropertyResult('parquetTimestampInMillisecond', 'ParquetTimestampInMillisecond', properties.ParquetTimestampInMillisecond != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ParquetTimestampInMillisecond) : undefined);
    ret.addPropertyResult('parquetVersion', 'ParquetVersion', properties.ParquetVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ParquetVersion) : undefined);
    ret.addPropertyResult('preserveTransactions', 'PreserveTransactions', properties.PreserveTransactions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PreserveTransactions) : undefined);
    ret.addPropertyResult('rfc4180', 'Rfc4180', properties.Rfc4180 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Rfc4180) : undefined);
    ret.addPropertyResult('rowGroupLength', 'RowGroupLength', properties.RowGroupLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.RowGroupLength) : undefined);
    ret.addPropertyResult('serverSideEncryptionKmsKeyId', 'ServerSideEncryptionKmsKeyId', properties.ServerSideEncryptionKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.ServerSideEncryptionKmsKeyId) : undefined);
    ret.addPropertyResult('serviceAccessRoleArn', 'ServiceAccessRoleArn', properties.ServiceAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccessRoleArn) : undefined);
    ret.addPropertyResult('timestampColumnName', 'TimestampColumnName', properties.TimestampColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.TimestampColumnName) : undefined);
    ret.addPropertyResult('useCsvNoSupValue', 'UseCsvNoSupValue', properties.UseCsvNoSupValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCsvNoSupValue) : undefined);
    ret.addPropertyResult('useTaskStartTimeForFullLoadTimestamp', 'UseTaskStartTimeForFullLoadTimestamp', properties.UseTaskStartTimeForFullLoadTimestamp != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseTaskStartTimeForFullLoadTimestamp) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEndpoint {
    /**
     * Provides information that defines a SAP ASE endpoint. This information includes the output format of records applied to the endpoint and details of transaction and control table data information. For information about other available settings, see [Extra connection attributes when using SAP ASE as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SAP.html#CHAP_Source.SAP.ConnectionAttrib) and [Extra connection attributes when using SAP ASE as a target for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.SAP.html#CHAP_Target.SAP.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-sybasesettings.html
     */
    export interface SybaseSettingsProperty {
        /**
         * The full Amazon Resource Name (ARN) of the IAM role that specifies AWS DMS as the trusted entity and grants the required permissions to access the value in `SecretsManagerSecret` . The role must allow the `iam:PassRole` action. `SecretsManagerSecret` has the value of the AWS Secrets Manager secret that allows access to the SAP ASE endpoint.
         *
         * > You can specify one of two sets of values for these permissions. You can specify the values for this setting and `SecretsManagerSecretId` . Or you can specify clear-text values for `UserName` , `Password` , `ServerName` , and `Port` . You can't specify both.
         * >
         * > For more information on creating this `SecretsManagerSecret` , the corresponding `SecretsManagerAccessRoleArn` , and the `SecretsManagerSecretId` that is required to access it, see [Using secrets to access AWS Database Migration Service resources](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html#security-iam-secretsmanager) in the *AWS Database Migration Service User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-sybasesettings.html#cfn-dms-endpoint-sybasesettings-secretsmanageraccessrolearn
         */
        readonly secretsManagerAccessRoleArn?: string;
        /**
         * The full ARN, partial ARN, or display name of the `SecretsManagerSecret` that contains the SAP SAE endpoint connection details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dms-endpoint-sybasesettings.html#cfn-dms-endpoint-sybasesettings-secretsmanagersecretid
         */
        readonly secretsManagerSecretId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SybaseSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SybaseSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnEndpoint_SybaseSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('secretsManagerAccessRoleArn', cdk.validateString)(properties.secretsManagerAccessRoleArn));
    errors.collect(cdk.propertyValidator('secretsManagerSecretId', cdk.validateString)(properties.secretsManagerSecretId));
    return errors.wrap('supplied properties not correct for "SybaseSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::Endpoint.SybaseSettings` resource
 *
 * @param properties - the TypeScript properties of a `SybaseSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::Endpoint.SybaseSettings` resource.
 */
// @ts-ignore TS6133
function cfnEndpointSybaseSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEndpoint_SybaseSettingsPropertyValidator(properties).assertSuccess();
    return {
        SecretsManagerAccessRoleArn: cdk.stringToCloudFormation(properties.secretsManagerAccessRoleArn),
        SecretsManagerSecretId: cdk.stringToCloudFormation(properties.secretsManagerSecretId),
    };
}

// @ts-ignore TS6133
function CfnEndpointSybaseSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.SybaseSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.SybaseSettingsProperty>();
    ret.addPropertyResult('secretsManagerAccessRoleArn', 'SecretsManagerAccessRoleArn', properties.SecretsManagerAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerAccessRoleArn) : undefined);
    ret.addPropertyResult('secretsManagerSecretId', 'SecretsManagerSecretId', properties.SecretsManagerSecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsManagerSecretId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEventSubscription`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html
 */
export interface CfnEventSubscriptionProps {

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic created for event notification. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-snstopicarn
     */
    readonly snsTopicArn: string;

    /**
     * Indicates whether to activate the subscription. If you don't specify this property, AWS CloudFormation activates the subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * A list of event categories for a source type that you want to subscribe to. If you don't specify this property, you are notified about all event categories. For more information, see [Working with Events and Notifications](https://docs.aws.amazon.com//dms/latest/userguide/CHAP_Events.html) in the *AWS DMS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-eventcategories
     */
    readonly eventCategories?: string[];

    /**
     * A list of identifiers for which AWS DMS provides notification events.
     *
     * If you don't specify a value, notifications are provided for all sources.
     *
     * If you specify multiple values, they must be of the same type. For example, if you specify a database instance ID, then all of the other values must be database instance IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-sourceids
     */
    readonly sourceIds?: string[];

    /**
     * The type of AWS DMS resource that generates the events. For example, if you want to be notified of events generated by a replication instance, you set this parameter to `replication-instance` . If this value isn't specified, all events are returned.
     *
     * *Valid values* : `replication-instance` | `replication-task`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-sourcetype
     */
    readonly sourceType?: string;

    /**
     * The name of the AWS DMS event notification subscription. This name must be less than 255 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-subscriptionname
     */
    readonly subscriptionName?: string;

    /**
     * One or more tags to be assigned to the event subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnEventSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventSubscriptionProps`
 *
 * @returns the result of the validation.
 */
function CfnEventSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('eventCategories', cdk.listValidator(cdk.validateString))(properties.eventCategories));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.requiredValidator)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    errors.collect(cdk.propertyValidator('sourceIds', cdk.listValidator(cdk.validateString))(properties.sourceIds));
    errors.collect(cdk.propertyValidator('sourceType', cdk.validateString)(properties.sourceType));
    errors.collect(cdk.propertyValidator('subscriptionName', cdk.validateString)(properties.subscriptionName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnEventSubscriptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::EventSubscription` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventSubscriptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::EventSubscription` resource.
 */
// @ts-ignore TS6133
function cfnEventSubscriptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventSubscriptionPropsValidator(properties).assertSuccess();
    return {
        SnsTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        EventCategories: cdk.listMapper(cdk.stringToCloudFormation)(properties.eventCategories),
        SourceIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceIds),
        SourceType: cdk.stringToCloudFormation(properties.sourceType),
        SubscriptionName: cdk.stringToCloudFormation(properties.subscriptionName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnEventSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventSubscriptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventSubscriptionProps>();
    ret.addPropertyResult('snsTopicArn', 'SnsTopicArn', cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('eventCategories', 'EventCategories', properties.EventCategories != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EventCategories) : undefined);
    ret.addPropertyResult('sourceIds', 'SourceIds', properties.SourceIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SourceIds) : undefined);
    ret.addPropertyResult('sourceType', 'SourceType', properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined);
    ret.addPropertyResult('subscriptionName', 'SubscriptionName', properties.SubscriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::EventSubscription`
 *
 * Use the `AWS::DMS::EventSubscription` resource to get notifications for AWS Database Migration Service events through the Amazon Simple Notification Service . For more information, see [Working with events and notifications in AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Events.html) in the *AWS Database Migration Service User Guide* .
 *
 * @cloudformationResource AWS::DMS::EventSubscription
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html
 */
export class CfnEventSubscription extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::EventSubscription";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventSubscription {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventSubscriptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventSubscription(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic created for event notification. The ARN is created by Amazon SNS when you create a topic and subscribe to it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-snstopicarn
     */
    public snsTopicArn: string;

    /**
     * Indicates whether to activate the subscription. If you don't specify this property, AWS CloudFormation activates the subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * A list of event categories for a source type that you want to subscribe to. If you don't specify this property, you are notified about all event categories. For more information, see [Working with Events and Notifications](https://docs.aws.amazon.com//dms/latest/userguide/CHAP_Events.html) in the *AWS DMS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-eventcategories
     */
    public eventCategories: string[] | undefined;

    /**
     * A list of identifiers for which AWS DMS provides notification events.
     *
     * If you don't specify a value, notifications are provided for all sources.
     *
     * If you specify multiple values, they must be of the same type. For example, if you specify a database instance ID, then all of the other values must be database instance IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-sourceids
     */
    public sourceIds: string[] | undefined;

    /**
     * The type of AWS DMS resource that generates the events. For example, if you want to be notified of events generated by a replication instance, you set this parameter to `replication-instance` . If this value isn't specified, all events are returned.
     *
     * *Valid values* : `replication-instance` | `replication-task`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-sourcetype
     */
    public sourceType: string | undefined;

    /**
     * The name of the AWS DMS event notification subscription. This name must be less than 255 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-subscriptionname
     */
    public subscriptionName: string | undefined;

    /**
     * One or more tags to be assigned to the event subscription.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-eventsubscription.html#cfn-dms-eventsubscription-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DMS::EventSubscription`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventSubscriptionProps) {
        super(scope, id, { type: CfnEventSubscription.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'snsTopicArn', this);

        this.snsTopicArn = props.snsTopicArn;
        this.enabled = props.enabled;
        this.eventCategories = props.eventCategories;
        this.sourceIds = props.sourceIds;
        this.sourceType = props.sourceType;
        this.subscriptionName = props.subscriptionName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DMS::EventSubscription", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventSubscription.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            snsTopicArn: this.snsTopicArn,
            enabled: this.enabled,
            eventCategories: this.eventCategories,
            sourceIds: this.sourceIds,
            sourceType: this.sourceType,
            subscriptionName: this.subscriptionName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventSubscriptionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReplicationInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html
 */
export interface CfnReplicationInstanceProps {

    /**
     * The compute and memory capacity of the replication instance as defined for the specified replication instance class. For example, to specify the instance class dms.c4.large, set this parameter to `"dms.c4.large"` . For more information on the settings and capacities for the available replication instance classes, see [Selecting the right AWS DMS replication instance for your migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.html#CHAP_ReplicationInstance.InDepth) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationinstanceclass
     */
    readonly replicationInstanceClass: string;

    /**
     * The amount of storage (in gigabytes) to be initially allocated for the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-allocatedstorage
     */
    readonly allocatedStorage?: number;

    /**
     * Indicates that major version upgrades are allowed. Changing this parameter does not result in an outage, and the change is asynchronously applied as soon as possible.
     *
     * This parameter must be set to `true` when specifying a value for the `EngineVersion` parameter that is a different major version than the replication instance's current version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-allowmajorversionupgrade
     */
    readonly allowMajorVersionUpgrade?: boolean | cdk.IResolvable;

    /**
     * A value that indicates whether minor engine upgrades are applied automatically to the replication instance during the maintenance window. This parameter defaults to `true` .
     *
     * Default: `true`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-autominorversionupgrade
     */
    readonly autoMinorVersionUpgrade?: boolean | cdk.IResolvable;

    /**
     * The Availability Zone that the replication instance will be created in.
     *
     * The default value is a random, system-chosen Availability Zone in the endpoint's AWS Region , for example `us-east-1d` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The engine version number of the replication instance.
     *
     * If an engine version number is not specified when a replication instance is created, the default is the latest engine version available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-engineversion
     */
    readonly engineVersion?: string;

    /**
     * An AWS KMS key identifier that is used to encrypt the data on the replication instance.
     *
     * If you don't specify a value for the `KmsKeyId` parameter, AWS DMS uses your default encryption key.
     *
     * AWS KMS creates the default encryption key for your AWS account . Your AWS account has a different default encryption key for each AWS Region .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Specifies whether the replication instance is a Multi-AZ deployment. You can't set the `AvailabilityZone` parameter if the Multi-AZ parameter is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-multiaz
     */
    readonly multiAz?: boolean | cdk.IResolvable;

    /**
     * The weekly time range during which system maintenance can occur, in UTC.
     *
     * *Format* : `ddd:hh24:mi-ddd:hh24:mi`
     *
     * *Default* : A 30-minute window selected at random from an 8-hour block of time per AWS Region , occurring on a random day of the week.
     *
     * *Valid days* ( `ddd` ): `Mon` | `Tue` | `Wed` | `Thu` | `Fri` | `Sat` | `Sun`
     *
     * *Constraints* : Minimum 30-minute window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;

    /**
     * Specifies the accessibility options for the replication instance. A value of `true` represents an instance with a public IP address. A value of `false` represents an instance with a private IP address. The default value is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-publiclyaccessible
     */
    readonly publiclyAccessible?: boolean | cdk.IResolvable;

    /**
     * The replication instance identifier. This parameter is stored as a lowercase string.
     *
     * Constraints:
     *
     * - Must contain 1-63 alphanumeric characters or hyphens.
     * - First character must be a letter.
     * - Can't end with a hyphen or contain two consecutive hyphens.
     *
     * Example: `myrepinstance`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationinstanceidentifier
     */
    readonly replicationInstanceIdentifier?: string;

    /**
     * A subnet group to associate with the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationsubnetgroupidentifier
     */
    readonly replicationSubnetGroupIdentifier?: string;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` . For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-resourceidentifier
     */
    readonly resourceIdentifier?: string;

    /**
     * One or more tags to be assigned to the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Specifies the virtual private cloud (VPC) security group to be used with the replication instance. The VPC security group must work with the VPC containing the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-vpcsecuritygroupids
     */
    readonly vpcSecurityGroupIds?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnReplicationInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationInstanceProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationInstancePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocatedStorage', cdk.validateNumber)(properties.allocatedStorage));
    errors.collect(cdk.propertyValidator('allowMajorVersionUpgrade', cdk.validateBoolean)(properties.allowMajorVersionUpgrade));
    errors.collect(cdk.propertyValidator('autoMinorVersionUpgrade', cdk.validateBoolean)(properties.autoMinorVersionUpgrade));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('engineVersion', cdk.validateString)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('multiAz', cdk.validateBoolean)(properties.multiAz));
    errors.collect(cdk.propertyValidator('preferredMaintenanceWindow', cdk.validateString)(properties.preferredMaintenanceWindow));
    errors.collect(cdk.propertyValidator('publiclyAccessible', cdk.validateBoolean)(properties.publiclyAccessible));
    errors.collect(cdk.propertyValidator('replicationInstanceClass', cdk.requiredValidator)(properties.replicationInstanceClass));
    errors.collect(cdk.propertyValidator('replicationInstanceClass', cdk.validateString)(properties.replicationInstanceClass));
    errors.collect(cdk.propertyValidator('replicationInstanceIdentifier', cdk.validateString)(properties.replicationInstanceIdentifier));
    errors.collect(cdk.propertyValidator('replicationSubnetGroupIdentifier', cdk.validateString)(properties.replicationSubnetGroupIdentifier));
    errors.collect(cdk.propertyValidator('resourceIdentifier', cdk.validateString)(properties.resourceIdentifier));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcSecurityGroupIds', cdk.listValidator(cdk.validateString))(properties.vpcSecurityGroupIds));
    return errors.wrap('supplied properties not correct for "CfnReplicationInstanceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::ReplicationInstance` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationInstanceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::ReplicationInstance` resource.
 */
// @ts-ignore TS6133
function cfnReplicationInstancePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationInstancePropsValidator(properties).assertSuccess();
    return {
        ReplicationInstanceClass: cdk.stringToCloudFormation(properties.replicationInstanceClass),
        AllocatedStorage: cdk.numberToCloudFormation(properties.allocatedStorage),
        AllowMajorVersionUpgrade: cdk.booleanToCloudFormation(properties.allowMajorVersionUpgrade),
        AutoMinorVersionUpgrade: cdk.booleanToCloudFormation(properties.autoMinorVersionUpgrade),
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        EngineVersion: cdk.stringToCloudFormation(properties.engineVersion),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        MultiAZ: cdk.booleanToCloudFormation(properties.multiAz),
        PreferredMaintenanceWindow: cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
        PubliclyAccessible: cdk.booleanToCloudFormation(properties.publiclyAccessible),
        ReplicationInstanceIdentifier: cdk.stringToCloudFormation(properties.replicationInstanceIdentifier),
        ReplicationSubnetGroupIdentifier: cdk.stringToCloudFormation(properties.replicationSubnetGroupIdentifier),
        ResourceIdentifier: cdk.stringToCloudFormation(properties.resourceIdentifier),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VpcSecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcSecurityGroupIds),
    };
}

// @ts-ignore TS6133
function CfnReplicationInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationInstanceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationInstanceProps>();
    ret.addPropertyResult('replicationInstanceClass', 'ReplicationInstanceClass', cfn_parse.FromCloudFormation.getString(properties.ReplicationInstanceClass));
    ret.addPropertyResult('allocatedStorage', 'AllocatedStorage', properties.AllocatedStorage != null ? cfn_parse.FromCloudFormation.getNumber(properties.AllocatedStorage) : undefined);
    ret.addPropertyResult('allowMajorVersionUpgrade', 'AllowMajorVersionUpgrade', properties.AllowMajorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowMajorVersionUpgrade) : undefined);
    ret.addPropertyResult('autoMinorVersionUpgrade', 'AutoMinorVersionUpgrade', properties.AutoMinorVersionUpgrade != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoMinorVersionUpgrade) : undefined);
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('multiAz', 'MultiAZ', properties.MultiAZ != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiAZ) : undefined);
    ret.addPropertyResult('preferredMaintenanceWindow', 'PreferredMaintenanceWindow', properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined);
    ret.addPropertyResult('publiclyAccessible', 'PubliclyAccessible', properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined);
    ret.addPropertyResult('replicationInstanceIdentifier', 'ReplicationInstanceIdentifier', properties.ReplicationInstanceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationInstanceIdentifier) : undefined);
    ret.addPropertyResult('replicationSubnetGroupIdentifier', 'ReplicationSubnetGroupIdentifier', properties.ReplicationSubnetGroupIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationSubnetGroupIdentifier) : undefined);
    ret.addPropertyResult('resourceIdentifier', 'ResourceIdentifier', properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpcSecurityGroupIds', 'VpcSecurityGroupIds', properties.VpcSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.VpcSecurityGroupIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::ReplicationInstance`
 *
 * The `AWS::DMS::ReplicationInstance` resource creates an AWS DMS replication instance.
 *
 * @cloudformationResource AWS::DMS::ReplicationInstance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html
 */
export class CfnReplicationInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::ReplicationInstance";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationInstance {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationInstancePropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationInstance(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * One or more private IP addresses for the replication instance.
     * @cloudformationAttribute ReplicationInstancePrivateIpAddresses
     */
    public readonly attrReplicationInstancePrivateIpAddresses: string;

    /**
     * One or more public IP addresses for the replication instance.
     * @cloudformationAttribute ReplicationInstancePublicIpAddresses
     */
    public readonly attrReplicationInstancePublicIpAddresses: string;

    /**
     * The compute and memory capacity of the replication instance as defined for the specified replication instance class. For example, to specify the instance class dms.c4.large, set this parameter to `"dms.c4.large"` . For more information on the settings and capacities for the available replication instance classes, see [Selecting the right AWS DMS replication instance for your migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.html#CHAP_ReplicationInstance.InDepth) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationinstanceclass
     */
    public replicationInstanceClass: string;

    /**
     * The amount of storage (in gigabytes) to be initially allocated for the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-allocatedstorage
     */
    public allocatedStorage: number | undefined;

    /**
     * Indicates that major version upgrades are allowed. Changing this parameter does not result in an outage, and the change is asynchronously applied as soon as possible.
     *
     * This parameter must be set to `true` when specifying a value for the `EngineVersion` parameter that is a different major version than the replication instance's current version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-allowmajorversionupgrade
     */
    public allowMajorVersionUpgrade: boolean | cdk.IResolvable | undefined;

    /**
     * A value that indicates whether minor engine upgrades are applied automatically to the replication instance during the maintenance window. This parameter defaults to `true` .
     *
     * Default: `true`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-autominorversionupgrade
     */
    public autoMinorVersionUpgrade: boolean | cdk.IResolvable | undefined;

    /**
     * The Availability Zone that the replication instance will be created in.
     *
     * The default value is a random, system-chosen Availability Zone in the endpoint's AWS Region , for example `us-east-1d` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-availabilityzone
     */
    public availabilityZone: string | undefined;

    /**
     * The engine version number of the replication instance.
     *
     * If an engine version number is not specified when a replication instance is created, the default is the latest engine version available.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-engineversion
     */
    public engineVersion: string | undefined;

    /**
     * An AWS KMS key identifier that is used to encrypt the data on the replication instance.
     *
     * If you don't specify a value for the `KmsKeyId` parameter, AWS DMS uses your default encryption key.
     *
     * AWS KMS creates the default encryption key for your AWS account . Your AWS account has a different default encryption key for each AWS Region .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Specifies whether the replication instance is a Multi-AZ deployment. You can't set the `AvailabilityZone` parameter if the Multi-AZ parameter is set to `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-multiaz
     */
    public multiAz: boolean | cdk.IResolvable | undefined;

    /**
     * The weekly time range during which system maintenance can occur, in UTC.
     *
     * *Format* : `ddd:hh24:mi-ddd:hh24:mi`
     *
     * *Default* : A 30-minute window selected at random from an 8-hour block of time per AWS Region , occurring on a random day of the week.
     *
     * *Valid days* ( `ddd` ): `Mon` | `Tue` | `Wed` | `Thu` | `Fri` | `Sat` | `Sun`
     *
     * *Constraints* : Minimum 30-minute window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-preferredmaintenancewindow
     */
    public preferredMaintenanceWindow: string | undefined;

    /**
     * Specifies the accessibility options for the replication instance. A value of `true` represents an instance with a public IP address. A value of `false` represents an instance with a private IP address. The default value is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-publiclyaccessible
     */
    public publiclyAccessible: boolean | cdk.IResolvable | undefined;

    /**
     * The replication instance identifier. This parameter is stored as a lowercase string.
     *
     * Constraints:
     *
     * - Must contain 1-63 alphanumeric characters or hyphens.
     * - First character must be a letter.
     * - Can't end with a hyphen or contain two consecutive hyphens.
     *
     * Example: `myrepinstance`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationinstanceidentifier
     */
    public replicationInstanceIdentifier: string | undefined;

    /**
     * A subnet group to associate with the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-replicationsubnetgroupidentifier
     */
    public replicationSubnetGroupIdentifier: string | undefined;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` . For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-resourceidentifier
     */
    public resourceIdentifier: string | undefined;

    /**
     * One or more tags to be assigned to the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Specifies the virtual private cloud (VPC) security group to be used with the replication instance. The VPC security group must work with the VPC containing the replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationinstance.html#cfn-dms-replicationinstance-vpcsecuritygroupids
     */
    public vpcSecurityGroupIds: string[] | undefined;

    /**
     * Create a new `AWS::DMS::ReplicationInstance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationInstanceProps) {
        super(scope, id, { type: CfnReplicationInstance.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'replicationInstanceClass', this);
        this.attrReplicationInstancePrivateIpAddresses = cdk.Token.asString(this.getAtt('ReplicationInstancePrivateIpAddresses', cdk.ResolutionTypeHint.STRING));
        this.attrReplicationInstancePublicIpAddresses = cdk.Token.asString(this.getAtt('ReplicationInstancePublicIpAddresses', cdk.ResolutionTypeHint.STRING));

        this.replicationInstanceClass = props.replicationInstanceClass;
        this.allocatedStorage = props.allocatedStorage;
        this.allowMajorVersionUpgrade = props.allowMajorVersionUpgrade;
        this.autoMinorVersionUpgrade = props.autoMinorVersionUpgrade;
        this.availabilityZone = props.availabilityZone;
        this.engineVersion = props.engineVersion;
        this.kmsKeyId = props.kmsKeyId;
        this.multiAz = props.multiAz;
        this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
        this.publiclyAccessible = props.publiclyAccessible;
        this.replicationInstanceIdentifier = props.replicationInstanceIdentifier;
        this.replicationSubnetGroupIdentifier = props.replicationSubnetGroupIdentifier;
        this.resourceIdentifier = props.resourceIdentifier;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DMS::ReplicationInstance", props.tags, { tagPropertyName: 'tags' });
        this.vpcSecurityGroupIds = props.vpcSecurityGroupIds;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationInstance.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            replicationInstanceClass: this.replicationInstanceClass,
            allocatedStorage: this.allocatedStorage,
            allowMajorVersionUpgrade: this.allowMajorVersionUpgrade,
            autoMinorVersionUpgrade: this.autoMinorVersionUpgrade,
            availabilityZone: this.availabilityZone,
            engineVersion: this.engineVersion,
            kmsKeyId: this.kmsKeyId,
            multiAz: this.multiAz,
            preferredMaintenanceWindow: this.preferredMaintenanceWindow,
            publiclyAccessible: this.publiclyAccessible,
            replicationInstanceIdentifier: this.replicationInstanceIdentifier,
            replicationSubnetGroupIdentifier: this.replicationSubnetGroupIdentifier,
            resourceIdentifier: this.resourceIdentifier,
            tags: this.tags.renderTags(),
            vpcSecurityGroupIds: this.vpcSecurityGroupIds,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationInstancePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReplicationSubnetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html
 */
export interface CfnReplicationSubnetGroupProps {

    /**
     * The description for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-replicationsubnetgroupdescription
     */
    readonly replicationSubnetGroupDescription: string;

    /**
     * One or more subnet IDs to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-subnetids
     */
    readonly subnetIds: string[];

    /**
     * The identifier for the replication subnet group. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-replicationsubnetgroupidentifier
     */
    readonly replicationSubnetGroupIdentifier?: string;

    /**
     * One or more tags to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnReplicationSubnetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationSubnetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationSubnetGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('replicationSubnetGroupDescription', cdk.requiredValidator)(properties.replicationSubnetGroupDescription));
    errors.collect(cdk.propertyValidator('replicationSubnetGroupDescription', cdk.validateString)(properties.replicationSubnetGroupDescription));
    errors.collect(cdk.propertyValidator('replicationSubnetGroupIdentifier', cdk.validateString)(properties.replicationSubnetGroupIdentifier));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnReplicationSubnetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::ReplicationSubnetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationSubnetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::ReplicationSubnetGroup` resource.
 */
// @ts-ignore TS6133
function cfnReplicationSubnetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationSubnetGroupPropsValidator(properties).assertSuccess();
    return {
        ReplicationSubnetGroupDescription: cdk.stringToCloudFormation(properties.replicationSubnetGroupDescription),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
        ReplicationSubnetGroupIdentifier: cdk.stringToCloudFormation(properties.replicationSubnetGroupIdentifier),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnReplicationSubnetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationSubnetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSubnetGroupProps>();
    ret.addPropertyResult('replicationSubnetGroupDescription', 'ReplicationSubnetGroupDescription', cfn_parse.FromCloudFormation.getString(properties.ReplicationSubnetGroupDescription));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addPropertyResult('replicationSubnetGroupIdentifier', 'ReplicationSubnetGroupIdentifier', properties.ReplicationSubnetGroupIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationSubnetGroupIdentifier) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::ReplicationSubnetGroup`
 *
 * The `AWS::DMS::ReplicationSubnetGroup` resource creates an AWS DMS replication subnet group. Subnet groups must contain at least two subnets in two different Availability Zones in the same AWS Region .
 *
 * > Resource creation fails if the `dms-vpc-role` AWS Identity and Access Management ( IAM ) role doesn't already exist. For more information, see [Creating the IAM Roles to Use With the AWS CLI and AWS DMS API](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.APIRole.html) in the *AWS Database Migration Service User Guide* .
 *
 * @cloudformationResource AWS::DMS::ReplicationSubnetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html
 */
export class CfnReplicationSubnetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::ReplicationSubnetGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationSubnetGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationSubnetGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationSubnetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The description for the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-replicationsubnetgroupdescription
     */
    public replicationSubnetGroupDescription: string;

    /**
     * One or more subnet IDs to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-subnetids
     */
    public subnetIds: string[];

    /**
     * The identifier for the replication subnet group. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-replicationsubnetgroupidentifier
     */
    public replicationSubnetGroupIdentifier: string | undefined;

    /**
     * One or more tags to be assigned to the subnet group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationsubnetgroup.html#cfn-dms-replicationsubnetgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DMS::ReplicationSubnetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationSubnetGroupProps) {
        super(scope, id, { type: CfnReplicationSubnetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'replicationSubnetGroupDescription', this);
        cdk.requireProperty(props, 'subnetIds', this);

        this.replicationSubnetGroupDescription = props.replicationSubnetGroupDescription;
        this.subnetIds = props.subnetIds;
        this.replicationSubnetGroupIdentifier = props.replicationSubnetGroupIdentifier;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DMS::ReplicationSubnetGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationSubnetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            replicationSubnetGroupDescription: this.replicationSubnetGroupDescription,
            subnetIds: this.subnetIds,
            replicationSubnetGroupIdentifier: this.replicationSubnetGroupIdentifier,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationSubnetGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReplicationTask`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html
 */
export interface CfnReplicationTaskProps {

    /**
     * The migration type. Valid values: `full-load` | `cdc` | `full-load-and-cdc`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-migrationtype
     */
    readonly migrationType: string;

    /**
     * The Amazon Resource Name (ARN) of a replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationinstancearn
     */
    readonly replicationInstanceArn: string;

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the source endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-sourceendpointarn
     */
    readonly sourceEndpointArn: string;

    /**
     * The table mappings for the task, in JSON format. For more information, see [Using Table Mapping to Specify Task Settings](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tablemappings
     */
    readonly tableMappings: string;

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the target endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-targetendpointarn
     */
    readonly targetEndpointArn: string;

    /**
     * Indicates when you want a change data capture (CDC) operation to start. Use either `CdcStartPosition` or `CdcStartTime` to specify when you want a CDC operation to start. Specifying both values results in an error.
     *
     * The value can be in date, checkpoint, log sequence number (LSN), or system change number (SCN) format.
     *
     * Here is a date example: `--cdc-start-position "2018-03-08T12:12:12"`
     *
     * Here is a checkpoint example: `--cdc-start-position "checkpoint:V1#27#mysql-bin-changelog.157832:1975:-1:2002:677883278264080:mysql-bin-changelog.157832:1876#0#0#*#0#93"`
     *
     * Here is an LSN example: `--cdc-start-position “mysql-bin-changelog.000024:373”`
     *
     * > When you use this task setting with a source PostgreSQL database, a logical replication slot should already be created and associated with the source endpoint. You can verify this by setting the `slotName` extra connection attribute to the name of this logical replication slot. For more information, see [Extra Connection Attributes When Using PostgreSQL as a Source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstartposition
     */
    readonly cdcStartPosition?: string;

    /**
     * Indicates the start time for a change data capture (CDC) operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstarttime
     */
    readonly cdcStartTime?: number;

    /**
     * Indicates when you want a change data capture (CDC) operation to stop. The value can be either server time or commit time.
     *
     * Here is a server time example: `--cdc-stop-position "server_time:2018-02-09T12:12:12"`
     *
     * Here is a commit time example: `--cdc-stop-position "commit_time: 2018-02-09T12:12:12"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstopposition
     */
    readonly cdcStopPosition?: string;

    /**
     * An identifier for the replication task.
     *
     * Constraints:
     *
     * - Must contain 1-255 alphanumeric characters or hyphens.
     * - First character must be a letter.
     * - Cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtaskidentifier
     */
    readonly replicationTaskIdentifier?: string;

    /**
     * Overall settings for the task, in JSON format. For more information, see [Specifying Task Settings for AWS Database Migration Service Tasks](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtasksettings
     */
    readonly replicationTaskSettings?: string;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` .
     *
     * For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-resourceidentifier
     */
    readonly resourceIdentifier?: string;

    /**
     * One or more tags to be assigned to the replication task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * `AWS::DMS::ReplicationTask.TaskData`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-taskdata
     */
    readonly taskData?: string;
}

/**
 * Determine whether the given properties match those of a `CfnReplicationTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationTaskProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationTaskPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cdcStartPosition', cdk.validateString)(properties.cdcStartPosition));
    errors.collect(cdk.propertyValidator('cdcStartTime', cdk.validateNumber)(properties.cdcStartTime));
    errors.collect(cdk.propertyValidator('cdcStopPosition', cdk.validateString)(properties.cdcStopPosition));
    errors.collect(cdk.propertyValidator('migrationType', cdk.requiredValidator)(properties.migrationType));
    errors.collect(cdk.propertyValidator('migrationType', cdk.validateString)(properties.migrationType));
    errors.collect(cdk.propertyValidator('replicationInstanceArn', cdk.requiredValidator)(properties.replicationInstanceArn));
    errors.collect(cdk.propertyValidator('replicationInstanceArn', cdk.validateString)(properties.replicationInstanceArn));
    errors.collect(cdk.propertyValidator('replicationTaskIdentifier', cdk.validateString)(properties.replicationTaskIdentifier));
    errors.collect(cdk.propertyValidator('replicationTaskSettings', cdk.validateString)(properties.replicationTaskSettings));
    errors.collect(cdk.propertyValidator('resourceIdentifier', cdk.validateString)(properties.resourceIdentifier));
    errors.collect(cdk.propertyValidator('sourceEndpointArn', cdk.requiredValidator)(properties.sourceEndpointArn));
    errors.collect(cdk.propertyValidator('sourceEndpointArn', cdk.validateString)(properties.sourceEndpointArn));
    errors.collect(cdk.propertyValidator('tableMappings', cdk.requiredValidator)(properties.tableMappings));
    errors.collect(cdk.propertyValidator('tableMappings', cdk.validateString)(properties.tableMappings));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetEndpointArn', cdk.requiredValidator)(properties.targetEndpointArn));
    errors.collect(cdk.propertyValidator('targetEndpointArn', cdk.validateString)(properties.targetEndpointArn));
    errors.collect(cdk.propertyValidator('taskData', cdk.validateString)(properties.taskData));
    return errors.wrap('supplied properties not correct for "CfnReplicationTaskProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DMS::ReplicationTask` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationTaskProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DMS::ReplicationTask` resource.
 */
// @ts-ignore TS6133
function cfnReplicationTaskPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationTaskPropsValidator(properties).assertSuccess();
    return {
        MigrationType: cdk.stringToCloudFormation(properties.migrationType),
        ReplicationInstanceArn: cdk.stringToCloudFormation(properties.replicationInstanceArn),
        SourceEndpointArn: cdk.stringToCloudFormation(properties.sourceEndpointArn),
        TableMappings: cdk.stringToCloudFormation(properties.tableMappings),
        TargetEndpointArn: cdk.stringToCloudFormation(properties.targetEndpointArn),
        CdcStartPosition: cdk.stringToCloudFormation(properties.cdcStartPosition),
        CdcStartTime: cdk.numberToCloudFormation(properties.cdcStartTime),
        CdcStopPosition: cdk.stringToCloudFormation(properties.cdcStopPosition),
        ReplicationTaskIdentifier: cdk.stringToCloudFormation(properties.replicationTaskIdentifier),
        ReplicationTaskSettings: cdk.stringToCloudFormation(properties.replicationTaskSettings),
        ResourceIdentifier: cdk.stringToCloudFormation(properties.resourceIdentifier),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TaskData: cdk.stringToCloudFormation(properties.taskData),
    };
}

// @ts-ignore TS6133
function CfnReplicationTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationTaskProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationTaskProps>();
    ret.addPropertyResult('migrationType', 'MigrationType', cfn_parse.FromCloudFormation.getString(properties.MigrationType));
    ret.addPropertyResult('replicationInstanceArn', 'ReplicationInstanceArn', cfn_parse.FromCloudFormation.getString(properties.ReplicationInstanceArn));
    ret.addPropertyResult('sourceEndpointArn', 'SourceEndpointArn', cfn_parse.FromCloudFormation.getString(properties.SourceEndpointArn));
    ret.addPropertyResult('tableMappings', 'TableMappings', cfn_parse.FromCloudFormation.getString(properties.TableMappings));
    ret.addPropertyResult('targetEndpointArn', 'TargetEndpointArn', cfn_parse.FromCloudFormation.getString(properties.TargetEndpointArn));
    ret.addPropertyResult('cdcStartPosition', 'CdcStartPosition', properties.CdcStartPosition != null ? cfn_parse.FromCloudFormation.getString(properties.CdcStartPosition) : undefined);
    ret.addPropertyResult('cdcStartTime', 'CdcStartTime', properties.CdcStartTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.CdcStartTime) : undefined);
    ret.addPropertyResult('cdcStopPosition', 'CdcStopPosition', properties.CdcStopPosition != null ? cfn_parse.FromCloudFormation.getString(properties.CdcStopPosition) : undefined);
    ret.addPropertyResult('replicationTaskIdentifier', 'ReplicationTaskIdentifier', properties.ReplicationTaskIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationTaskIdentifier) : undefined);
    ret.addPropertyResult('replicationTaskSettings', 'ReplicationTaskSettings', properties.ReplicationTaskSettings != null ? cfn_parse.FromCloudFormation.getString(properties.ReplicationTaskSettings) : undefined);
    ret.addPropertyResult('resourceIdentifier', 'ResourceIdentifier', properties.ResourceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceIdentifier) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('taskData', 'TaskData', properties.TaskData != null ? cfn_parse.FromCloudFormation.getString(properties.TaskData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DMS::ReplicationTask`
 *
 * The `AWS::DMS::ReplicationTask` resource creates an AWS DMS replication task.
 *
 * @cloudformationResource AWS::DMS::ReplicationTask
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html
 */
export class CfnReplicationTask extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DMS::ReplicationTask";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationTask {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationTaskPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationTask(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The migration type. Valid values: `full-load` | `cdc` | `full-load-and-cdc`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-migrationtype
     */
    public migrationType: string;

    /**
     * The Amazon Resource Name (ARN) of a replication instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationinstancearn
     */
    public replicationInstanceArn: string;

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the source endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-sourceendpointarn
     */
    public sourceEndpointArn: string;

    /**
     * The table mappings for the task, in JSON format. For more information, see [Using Table Mapping to Specify Task Settings](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tablemappings
     */
    public tableMappings: string;

    /**
     * An Amazon Resource Name (ARN) that uniquely identifies the target endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-targetendpointarn
     */
    public targetEndpointArn: string;

    /**
     * Indicates when you want a change data capture (CDC) operation to start. Use either `CdcStartPosition` or `CdcStartTime` to specify when you want a CDC operation to start. Specifying both values results in an error.
     *
     * The value can be in date, checkpoint, log sequence number (LSN), or system change number (SCN) format.
     *
     * Here is a date example: `--cdc-start-position "2018-03-08T12:12:12"`
     *
     * Here is a checkpoint example: `--cdc-start-position "checkpoint:V1#27#mysql-bin-changelog.157832:1975:-1:2002:677883278264080:mysql-bin-changelog.157832:1876#0#0#*#0#93"`
     *
     * Here is an LSN example: `--cdc-start-position “mysql-bin-changelog.000024:373”`
     *
     * > When you use this task setting with a source PostgreSQL database, a logical replication slot should already be created and associated with the source endpoint. You can verify this by setting the `slotName` extra connection attribute to the name of this logical replication slot. For more information, see [Extra Connection Attributes When Using PostgreSQL as a Source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.ConnectionAttrib) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstartposition
     */
    public cdcStartPosition: string | undefined;

    /**
     * Indicates the start time for a change data capture (CDC) operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstarttime
     */
    public cdcStartTime: number | undefined;

    /**
     * Indicates when you want a change data capture (CDC) operation to stop. The value can be either server time or commit time.
     *
     * Here is a server time example: `--cdc-stop-position "server_time:2018-02-09T12:12:12"`
     *
     * Here is a commit time example: `--cdc-stop-position "commit_time: 2018-02-09T12:12:12"`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-cdcstopposition
     */
    public cdcStopPosition: string | undefined;

    /**
     * An identifier for the replication task.
     *
     * Constraints:
     *
     * - Must contain 1-255 alphanumeric characters or hyphens.
     * - First character must be a letter.
     * - Cannot end with a hyphen or contain two consecutive hyphens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtaskidentifier
     */
    public replicationTaskIdentifier: string | undefined;

    /**
     * Overall settings for the task, in JSON format. For more information, see [Specifying Task Settings for AWS Database Migration Service Tasks](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.html) in the *AWS Database Migration Service User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-replicationtasksettings
     */
    public replicationTaskSettings: string | undefined;

    /**
     * A display name for the resource identifier at the end of the `EndpointArn` response parameter that is returned in the created `Endpoint` object. The value for this parameter can have up to 31 characters. It can contain only ASCII letters, digits, and hyphen ('-'). Also, it can't end with a hyphen or contain two consecutive hyphens, and can only begin with a letter, such as `Example-App-ARN1` .
     *
     * For example, this value might result in the `EndpointArn` value `arn:aws:dms:eu-west-1:012345678901:rep:Example-App-ARN1` . If you don't specify a `ResourceIdentifier` value, AWS DMS generates a default identifier value for the end of `EndpointArn` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-resourceidentifier
     */
    public resourceIdentifier: string | undefined;

    /**
     * One or more tags to be assigned to the replication task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::DMS::ReplicationTask.TaskData`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html#cfn-dms-replicationtask-taskdata
     */
    public taskData: string | undefined;

    /**
     * Create a new `AWS::DMS::ReplicationTask`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationTaskProps) {
        super(scope, id, { type: CfnReplicationTask.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'migrationType', this);
        cdk.requireProperty(props, 'replicationInstanceArn', this);
        cdk.requireProperty(props, 'sourceEndpointArn', this);
        cdk.requireProperty(props, 'tableMappings', this);
        cdk.requireProperty(props, 'targetEndpointArn', this);

        this.migrationType = props.migrationType;
        this.replicationInstanceArn = props.replicationInstanceArn;
        this.sourceEndpointArn = props.sourceEndpointArn;
        this.tableMappings = props.tableMappings;
        this.targetEndpointArn = props.targetEndpointArn;
        this.cdcStartPosition = props.cdcStartPosition;
        this.cdcStartTime = props.cdcStartTime;
        this.cdcStopPosition = props.cdcStopPosition;
        this.replicationTaskIdentifier = props.replicationTaskIdentifier;
        this.replicationTaskSettings = props.replicationTaskSettings;
        this.resourceIdentifier = props.resourceIdentifier;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DMS::ReplicationTask", props.tags, { tagPropertyName: 'tags' });
        this.taskData = props.taskData;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationTask.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            migrationType: this.migrationType,
            replicationInstanceArn: this.replicationInstanceArn,
            sourceEndpointArn: this.sourceEndpointArn,
            tableMappings: this.tableMappings,
            targetEndpointArn: this.targetEndpointArn,
            cdcStartPosition: this.cdcStartPosition,
            cdcStartTime: this.cdcStartTime,
            cdcStopPosition: this.cdcStopPosition,
            replicationTaskIdentifier: this.replicationTaskIdentifier,
            replicationTaskSettings: this.replicationTaskSettings,
            resourceIdentifier: this.resourceIdentifier,
            tags: this.tags.renderTags(),
            taskData: this.taskData,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationTaskPropsToCloudFormation(props);
    }
}
