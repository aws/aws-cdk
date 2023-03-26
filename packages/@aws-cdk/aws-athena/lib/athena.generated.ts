// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:55:13.081Z","fingerprint":"sIGiXrHhZh5aDvSh7f63Ebx1eqTMHxLCVUd2NSgD/OY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDataCatalog`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html
 */
export interface CfnDataCatalogProps {

    /**
     * The name of the data catalog. The catalog name must be unique for the AWS account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-name
     */
    readonly name: string;

    /**
     * The type of data catalog: `LAMBDA` for a federated catalog, `GLUE` for AWS Glue Catalog, or `HIVE` for an external hive metastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-type
     */
    readonly type: string;

    /**
     * A description of the data catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-description
     */
    readonly description?: string;

    /**
     * Specifies the Lambda function or functions to use for the data catalog. The mapping used depends on the catalog type.
     *
     * - The `HIVE` data catalog type uses the following syntax. The `metadata-function` parameter is required. `The sdk-version` parameter is optional and defaults to the currently supported version.
     *
     * `metadata-function= *lambda_arn* , sdk-version= *version_number*`
     * - The `LAMBDA` data catalog type uses one of the following sets of required parameters, but not both.
     *
     * - When one Lambda function processes metadata and another Lambda function reads data, the following syntax is used. Both parameters are required.
     *
     * `metadata-function= *lambda_arn* , record-function= *lambda_arn*`
     * - A composite Lambda function that processes both metadata and data uses the following syntax.
     *
     * `function= *lambda_arn*`
     * - The `GLUE` type takes a catalog ID parameter and is required. The `*catalog_id*` is the account ID of the AWS account to which the Glue catalog belongs.
     *
     * `catalog-id= *catalog_id*`
     *
     * - The `GLUE` data catalog type also applies to the default `AwsDataCatalog` that already exists in your account, of which you can have only one and cannot modify.
     * - Queries that specify a GLUE data catalog other than the default `AwsDataCatalog` must be run on Athena engine version 2.
     * - In Regions where Athena engine version 2 is not available, creating new GLUE data catalogs results in an `INVALID_INPUT` error.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-parameters
     */
    readonly parameters?: { [key: string]: (string) } | cdk.IResolvable;

    /**
     * The tags (key-value pairs) to associate with this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDataCatalogProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataCatalogProps`
 *
 * @returns the result of the validation.
 */
function CfnDataCatalogPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parameters', cdk.hashValidator(cdk.validateString))(properties.parameters));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnDataCatalogProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::DataCatalog` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataCatalogProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::DataCatalog` resource.
 */
// @ts-ignore TS6133
function cfnDataCatalogPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataCatalogPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        Parameters: cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataCatalogPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Athena::DataCatalog`
 *
 * The AWS::Athena::DataCatalog resource specifies an Amazon Athena data catalog, which contains a name, description, type, parameters, and tags. For more information, see [DataCatalog](https://docs.aws.amazon.com/athena/latest/APIReference/API_DataCatalog.html) in the *Amazon Athena API Reference* .
 *
 * @cloudformationResource AWS::Athena::DataCatalog
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html
 */
export class CfnDataCatalog extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Athena::DataCatalog";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataCatalog {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataCatalogPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataCatalog(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the data catalog. The catalog name must be unique for the AWS account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-name
     */
    public name: string;

    /**
     * The type of data catalog: `LAMBDA` for a federated catalog, `GLUE` for AWS Glue Catalog, or `HIVE` for an external hive metastore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-type
     */
    public type: string;

    /**
     * A description of the data catalog.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-description
     */
    public description: string | undefined;

    /**
     * Specifies the Lambda function or functions to use for the data catalog. The mapping used depends on the catalog type.
     *
     * - The `HIVE` data catalog type uses the following syntax. The `metadata-function` parameter is required. `The sdk-version` parameter is optional and defaults to the currently supported version.
     *
     * `metadata-function= *lambda_arn* , sdk-version= *version_number*`
     * - The `LAMBDA` data catalog type uses one of the following sets of required parameters, but not both.
     *
     * - When one Lambda function processes metadata and another Lambda function reads data, the following syntax is used. Both parameters are required.
     *
     * `metadata-function= *lambda_arn* , record-function= *lambda_arn*`
     * - A composite Lambda function that processes both metadata and data uses the following syntax.
     *
     * `function= *lambda_arn*`
     * - The `GLUE` type takes a catalog ID parameter and is required. The `*catalog_id*` is the account ID of the AWS account to which the Glue catalog belongs.
     *
     * `catalog-id= *catalog_id*`
     *
     * - The `GLUE` data catalog type also applies to the default `AwsDataCatalog` that already exists in your account, of which you can have only one and cannot modify.
     * - Queries that specify a GLUE data catalog other than the default `AwsDataCatalog` must be run on Athena engine version 2.
     * - In Regions where Athena engine version 2 is not available, creating new GLUE data catalogs results in an `INVALID_INPUT` error.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-parameters
     */
    public parameters: { [key: string]: (string) } | cdk.IResolvable | undefined;

    /**
     * The tags (key-value pairs) to associate with this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Athena::DataCatalog`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataCatalogProps) {
        super(scope, id, { type: CfnDataCatalog.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'type', this);

        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.parameters = props.parameters;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Athena::DataCatalog", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataCatalog.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            type: this.type,
            description: this.description,
            parameters: this.parameters,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataCatalogPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnNamedQuery`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html
 */
export interface CfnNamedQueryProps {

    /**
     * The database to which the query belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database
     */
    readonly database: string;

    /**
     * The SQL statements that make up the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-querystring
     */
    readonly queryString: string;

    /**
     * The query description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description
     */
    readonly description?: string;

    /**
     * The query name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name
     */
    readonly name?: string;

    /**
     * The name of the workgroup that contains the named query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-workgroup
     */
    readonly workGroup?: string;
}

/**
 * Determine whether the given properties match those of a `CfnNamedQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnNamedQueryProps`
 *
 * @returns the result of the validation.
 */
function CfnNamedQueryPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('database', cdk.requiredValidator)(properties.database));
    errors.collect(cdk.propertyValidator('database', cdk.validateString)(properties.database));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('queryString', cdk.requiredValidator)(properties.queryString));
    errors.collect(cdk.propertyValidator('queryString', cdk.validateString)(properties.queryString));
    errors.collect(cdk.propertyValidator('workGroup', cdk.validateString)(properties.workGroup));
    return errors.wrap('supplied properties not correct for "CfnNamedQueryProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::NamedQuery` resource
 *
 * @param properties - the TypeScript properties of a `CfnNamedQueryProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::NamedQuery` resource.
 */
// @ts-ignore TS6133
function cfnNamedQueryPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNamedQueryPropsValidator(properties).assertSuccess();
    return {
        Database: cdk.stringToCloudFormation(properties.database),
        QueryString: cdk.stringToCloudFormation(properties.queryString),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        WorkGroup: cdk.stringToCloudFormation(properties.workGroup),
    };
}

// @ts-ignore TS6133
function CfnNamedQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNamedQueryProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNamedQueryProps>();
    ret.addPropertyResult('database', 'Database', cfn_parse.FromCloudFormation.getString(properties.Database));
    ret.addPropertyResult('queryString', 'QueryString', cfn_parse.FromCloudFormation.getString(properties.QueryString));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('workGroup', 'WorkGroup', properties.WorkGroup != null ? cfn_parse.FromCloudFormation.getString(properties.WorkGroup) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Athena::NamedQuery`
 *
 * The `AWS::Athena::NamedQuery` resource specifies an Amazon Athena saved query, where `QueryString` contains the SQL query statements that make up the query.
 *
 * @cloudformationResource AWS::Athena::NamedQuery
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html
 */
export class CfnNamedQuery extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Athena::NamedQuery";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNamedQuery {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNamedQueryPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNamedQuery(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique ID of the query.
     * @cloudformationAttribute NamedQueryId
     */
    public readonly attrNamedQueryId: string;

    /**
     * The database to which the query belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database
     */
    public database: string;

    /**
     * The SQL statements that make up the query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-querystring
     */
    public queryString: string;

    /**
     * The query description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description
     */
    public description: string | undefined;

    /**
     * The query name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name
     */
    public name: string | undefined;

    /**
     * The name of the workgroup that contains the named query.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-workgroup
     */
    public workGroup: string | undefined;

    /**
     * Create a new `AWS::Athena::NamedQuery`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNamedQueryProps) {
        super(scope, id, { type: CfnNamedQuery.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'database', this);
        cdk.requireProperty(props, 'queryString', this);
        this.attrNamedQueryId = cdk.Token.asString(this.getAtt('NamedQueryId', cdk.ResolutionTypeHint.STRING));

        this.database = props.database;
        this.queryString = props.queryString;
        this.description = props.description;
        this.name = props.name;
        this.workGroup = props.workGroup;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNamedQuery.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            database: this.database,
            queryString: this.queryString,
            description: this.description,
            name: this.name,
            workGroup: this.workGroup,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNamedQueryPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPreparedStatement`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html
 */
export interface CfnPreparedStatementProps {

    /**
     * The query string for the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-querystatement
     */
    readonly queryStatement: string;

    /**
     * The name of the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-statementname
     */
    readonly statementName: string;

    /**
     * The workgroup to which the prepared statement belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-workgroup
     */
    readonly workGroup: string;

    /**
     * The description of the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPreparedStatementProps`
 *
 * @param properties - the TypeScript properties of a `CfnPreparedStatementProps`
 *
 * @returns the result of the validation.
 */
function CfnPreparedStatementPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('queryStatement', cdk.requiredValidator)(properties.queryStatement));
    errors.collect(cdk.propertyValidator('queryStatement', cdk.validateString)(properties.queryStatement));
    errors.collect(cdk.propertyValidator('statementName', cdk.requiredValidator)(properties.statementName));
    errors.collect(cdk.propertyValidator('statementName', cdk.validateString)(properties.statementName));
    errors.collect(cdk.propertyValidator('workGroup', cdk.requiredValidator)(properties.workGroup));
    errors.collect(cdk.propertyValidator('workGroup', cdk.validateString)(properties.workGroup));
    return errors.wrap('supplied properties not correct for "CfnPreparedStatementProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::PreparedStatement` resource
 *
 * @param properties - the TypeScript properties of a `CfnPreparedStatementProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::PreparedStatement` resource.
 */
// @ts-ignore TS6133
function cfnPreparedStatementPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPreparedStatementPropsValidator(properties).assertSuccess();
    return {
        QueryStatement: cdk.stringToCloudFormation(properties.queryStatement),
        StatementName: cdk.stringToCloudFormation(properties.statementName),
        WorkGroup: cdk.stringToCloudFormation(properties.workGroup),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnPreparedStatementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPreparedStatementProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPreparedStatementProps>();
    ret.addPropertyResult('queryStatement', 'QueryStatement', cfn_parse.FromCloudFormation.getString(properties.QueryStatement));
    ret.addPropertyResult('statementName', 'StatementName', cfn_parse.FromCloudFormation.getString(properties.StatementName));
    ret.addPropertyResult('workGroup', 'WorkGroup', cfn_parse.FromCloudFormation.getString(properties.WorkGroup));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Athena::PreparedStatement`
 *
 * Specifies a prepared statement for use with SQL queries in Athena.
 *
 * @cloudformationResource AWS::Athena::PreparedStatement
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html
 */
export class CfnPreparedStatement extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Athena::PreparedStatement";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPreparedStatement {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPreparedStatementPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPreparedStatement(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The query string for the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-querystatement
     */
    public queryStatement: string;

    /**
     * The name of the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-statementname
     */
    public statementName: string;

    /**
     * The workgroup to which the prepared statement belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-workgroup
     */
    public workGroup: string;

    /**
     * The description of the prepared statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::Athena::PreparedStatement`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPreparedStatementProps) {
        super(scope, id, { type: CfnPreparedStatement.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'queryStatement', this);
        cdk.requireProperty(props, 'statementName', this);
        cdk.requireProperty(props, 'workGroup', this);

        this.queryStatement = props.queryStatement;
        this.statementName = props.statementName;
        this.workGroup = props.workGroup;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPreparedStatement.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            queryStatement: this.queryStatement,
            statementName: this.statementName,
            workGroup: this.workGroup,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPreparedStatementPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnWorkGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html
 */
export interface CfnWorkGroupProps {

    /**
     * The workgroup name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-name
     */
    readonly name: string;

    /**
     * The workgroup description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-description
     */
    readonly description?: string;

    /**
     * The option to delete a workgroup and its contents even if the workgroup contains any named queries. The default is false.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-recursivedeleteoption
     */
    readonly recursiveDeleteOption?: boolean | cdk.IResolvable;

    /**
     * The state of the workgroup: ENABLED or DISABLED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-state
     */
    readonly state?: string;

    /**
     * The tags (key-value pairs) to associate with this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified. The `EnforceWorkGroupConfiguration` option determines whether workgroup settings override client-side query settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-workgroupconfiguration
     */
    readonly workGroupConfiguration?: CfnWorkGroup.WorkGroupConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnWorkGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnWorkGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('recursiveDeleteOption', cdk.validateBoolean)(properties.recursiveDeleteOption));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('workGroupConfiguration', CfnWorkGroup_WorkGroupConfigurationPropertyValidator)(properties.workGroupConfiguration));
    return errors.wrap('supplied properties not correct for "CfnWorkGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::WorkGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::WorkGroup` resource.
 */
// @ts-ignore TS6133
function cfnWorkGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkGroupPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        RecursiveDeleteOption: cdk.booleanToCloudFormation(properties.recursiveDeleteOption),
        State: cdk.stringToCloudFormation(properties.state),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        WorkGroupConfiguration: cfnWorkGroupWorkGroupConfigurationPropertyToCloudFormation(properties.workGroupConfiguration),
    };
}

// @ts-ignore TS6133
function CfnWorkGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroupProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('recursiveDeleteOption', 'RecursiveDeleteOption', properties.RecursiveDeleteOption != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RecursiveDeleteOption) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('workGroupConfiguration', 'WorkGroupConfiguration', properties.WorkGroupConfiguration != null ? CfnWorkGroupWorkGroupConfigurationPropertyFromCloudFormation(properties.WorkGroupConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Athena::WorkGroup`
 *
 * The AWS::Athena::WorkGroup resource specifies an Amazon Athena workgroup, which contains a name, description, creation time, state, and other configuration, listed under `WorkGroupConfiguration` . Each workgroup enables you to isolate queries for you or your group from other queries in the same account. For more information, see [CreateWorkGroup](https://docs.aws.amazon.com/athena/latest/APIReference/API_CreateWorkGroup.html) in the *Amazon Athena API Reference* .
 *
 * @cloudformationResource AWS::Athena::WorkGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html
 */
export class CfnWorkGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Athena::WorkGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWorkGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWorkGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The date and time the workgroup was created, as a UNIX timestamp in seconds. For example: `1582761016` .
     * @cloudformationAttribute CreationTime
     */
    public readonly attrCreationTime: string;

    /**
     *
     * @cloudformationAttribute WorkGroupConfiguration.EngineVersion.EffectiveEngineVersion
     */
    public readonly attrWorkGroupConfigurationEngineVersionEffectiveEngineVersion: string;

    /**
     * The workgroup name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-name
     */
    public name: string;

    /**
     * The workgroup description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-description
     */
    public description: string | undefined;

    /**
     * The option to delete a workgroup and its contents even if the workgroup contains any named queries. The default is false.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-recursivedeleteoption
     */
    public recursiveDeleteOption: boolean | cdk.IResolvable | undefined;

    /**
     * The state of the workgroup: ENABLED or DISABLED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-state
     */
    public state: string | undefined;

    /**
     * The tags (key-value pairs) to associate with this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified. The `EnforceWorkGroupConfiguration` option determines whether workgroup settings override client-side query settings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-workgroupconfiguration
     */
    public workGroupConfiguration: CfnWorkGroup.WorkGroupConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Athena::WorkGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkGroupProps) {
        super(scope, id, { type: CfnWorkGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrCreationTime = cdk.Token.asString(this.getAtt('CreationTime', cdk.ResolutionTypeHint.STRING));
        this.attrWorkGroupConfigurationEngineVersionEffectiveEngineVersion = cdk.Token.asString(this.getAtt('WorkGroupConfiguration.EngineVersion.EffectiveEngineVersion', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.recursiveDeleteOption = props.recursiveDeleteOption;
        this.state = props.state;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Athena::WorkGroup", props.tags, { tagPropertyName: 'tags' });
        this.workGroupConfiguration = props.workGroupConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            recursiveDeleteOption: this.recursiveDeleteOption,
            state: this.state,
            tags: this.tags.renderTags(),
            workGroupConfiguration: this.workGroupConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkGroupPropsToCloudFormation(props);
    }
}

export namespace CfnWorkGroup {
    /**
     * If query results are encrypted in Amazon S3, indicates the encryption option used (for example, `SSE_KMS` or `CSE_KMS` ) and key information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html
     */
    export interface EncryptionConfigurationProperty {
        /**
         * Indicates whether Amazon S3 server-side encryption with Amazon S3-managed keys ( `SSE_S3` ), server-side encryption with KMS-managed keys ( `SSE_KMS` ), or client-side encryption with KMS-managed keys ( `CSE_KMS` ) is used.
         *
         * If a query runs in a workgroup and the workgroup overrides client-side settings, then the workgroup's setting for encryption is used. It specifies whether query results must be encrypted, for all queries that run in this workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html#cfn-athena-workgroup-encryptionconfiguration-encryptionoption
         */
        readonly encryptionOption: string;
        /**
         * For `SSE_KMS` and `CSE_KMS` , this is the KMS key ARN or ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html#cfn-athena-workgroup-encryptionconfiguration-kmskey
         */
        readonly kmsKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkGroup_EncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionOption', cdk.requiredValidator)(properties.encryptionOption));
    errors.collect(cdk.propertyValidator('encryptionOption', cdk.validateString)(properties.encryptionOption));
    errors.collect(cdk.propertyValidator('kmsKey', cdk.validateString)(properties.kmsKey));
    return errors.wrap('supplied properties not correct for "EncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.EncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.EncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkGroupEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkGroup_EncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EncryptionOption: cdk.stringToCloudFormation(properties.encryptionOption),
        KmsKey: cdk.stringToCloudFormation(properties.kmsKey),
    };
}

// @ts-ignore TS6133
function CfnWorkGroupEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.EncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.EncryptionConfigurationProperty>();
    ret.addPropertyResult('encryptionOption', 'EncryptionOption', cfn_parse.FromCloudFormation.getString(properties.EncryptionOption));
    ret.addPropertyResult('kmsKey', 'KmsKey', properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkGroup {
    /**
     * The Athena engine version for running queries, or the PySpark engine version for running sessions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html
     */
    export interface EngineVersionProperty {
        /**
         * Read only. The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a `CreateWorkGroup` or `UpdateWorkGroup` operation, the `EffectiveEngineVersion` field is ignored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html#cfn-athena-workgroup-engineversion-effectiveengineversion
         */
        readonly effectiveEngineVersion?: string;
        /**
         * The engine version requested by the user. Possible values are determined by the output of `ListEngineVersions` , including AUTO. The default is AUTO.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html#cfn-athena-workgroup-engineversion-selectedengineversion
         */
        readonly selectedEngineVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EngineVersionProperty`
 *
 * @param properties - the TypeScript properties of a `EngineVersionProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkGroup_EngineVersionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('effectiveEngineVersion', cdk.validateString)(properties.effectiveEngineVersion));
    errors.collect(cdk.propertyValidator('selectedEngineVersion', cdk.validateString)(properties.selectedEngineVersion));
    return errors.wrap('supplied properties not correct for "EngineVersionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.EngineVersion` resource
 *
 * @param properties - the TypeScript properties of a `EngineVersionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.EngineVersion` resource.
 */
// @ts-ignore TS6133
function cfnWorkGroupEngineVersionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkGroup_EngineVersionPropertyValidator(properties).assertSuccess();
    return {
        EffectiveEngineVersion: cdk.stringToCloudFormation(properties.effectiveEngineVersion),
        SelectedEngineVersion: cdk.stringToCloudFormation(properties.selectedEngineVersion),
    };
}

// @ts-ignore TS6133
function CfnWorkGroupEngineVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.EngineVersionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.EngineVersionProperty>();
    ret.addPropertyResult('effectiveEngineVersion', 'EffectiveEngineVersion', properties.EffectiveEngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EffectiveEngineVersion) : undefined);
    ret.addPropertyResult('selectedEngineVersion', 'SelectedEngineVersion', properties.SelectedEngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SelectedEngineVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkGroup {
    /**
     * The location in Amazon S3 where query results are stored and the encryption option, if any, used for query results. These are known as "client-side settings". If workgroup settings override client-side settings, then the query uses the workgroup settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html
     */
    export interface ResultConfigurationProperty {
        /**
         * If query results are encrypted in Amazon S3, indicates the encryption option used (for example, `SSE_KMS` or `CSE_KMS` ) and key information. This is a client-side setting. If workgroup settings override client-side settings, then the query uses the encryption configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See `EnforceWorkGroupConfiguration` and [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-encryptionconfiguration
         */
        readonly encryptionConfiguration?: CfnWorkGroup.EncryptionConfigurationProperty | cdk.IResolvable;
        /**
         * The location in Amazon S3 where your query results are stored, such as `s3://path/to/query/bucket/` . To run a query, you must specify the query results location using either a client-side setting for individual queries or a location specified by the workgroup. If workgroup settings override client-side settings, then the query uses the location specified for the workgroup. If no query location is set, Athena issues an error. For more information, see [Working with Query Results, Output Files, and Query History](https://docs.aws.amazon.com/athena/latest/ug/querying.html) and `EnforceWorkGroupConfiguration` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-outputlocation
         */
        readonly outputLocation?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResultConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ResultConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkGroup_ResultConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionConfiguration', CfnWorkGroup_EncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
    errors.collect(cdk.propertyValidator('outputLocation', cdk.validateString)(properties.outputLocation));
    return errors.wrap('supplied properties not correct for "ResultConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.ResultConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ResultConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.ResultConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkGroupResultConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkGroup_ResultConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EncryptionConfiguration: cfnWorkGroupEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
        OutputLocation: cdk.stringToCloudFormation(properties.outputLocation),
    };
}

// @ts-ignore TS6133
function CfnWorkGroupResultConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.ResultConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.ResultConfigurationProperty>();
    ret.addPropertyResult('encryptionConfiguration', 'EncryptionConfiguration', properties.EncryptionConfiguration != null ? CfnWorkGroupEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined);
    ret.addPropertyResult('outputLocation', 'OutputLocation', properties.OutputLocation != null ? cfn_parse.FromCloudFormation.getString(properties.OutputLocation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkGroup {
    /**
     * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified. The `EnforceWorkGroupConfiguration` option determines whether workgroup settings override client-side query settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html
     */
    export interface WorkGroupConfigurationProperty {
        /**
         * The upper limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan. No default is defined.
         *
         * > This property currently supports integer types. Support for long values is planned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-bytesscannedcutoffperquery
         */
        readonly bytesScannedCutoffPerQuery?: number;
        /**
         * If set to "true", the settings for the workgroup override client-side settings. If set to "false", client-side settings are used. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-enforceworkgroupconfiguration
         */
        readonly enforceWorkGroupConfiguration?: boolean | cdk.IResolvable;
        /**
         * The engine version that all queries running on the workgroup use. Queries on the `AmazonAthenaPreviewFunctionality` workgroup run on the preview engine regardless of this setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-engineversion
         */
        readonly engineVersion?: CfnWorkGroup.EngineVersionProperty | cdk.IResolvable;
        /**
         * Indicates that the Amazon CloudWatch metrics are enabled for the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-publishcloudwatchmetricsenabled
         */
        readonly publishCloudWatchMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * If set to `true` , allows members assigned to a workgroup to reference Amazon S3 Requester Pays buckets in queries. If set to `false` , workgroup members cannot query data from Requester Pays buckets, and queries that retrieve data from Requester Pays buckets cause an error. The default is `false` . For more information about Requester Pays buckets, see [Requester Pays Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/RequesterPaysBuckets.html) in the *Amazon Simple Storage Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-requesterpaysenabled
         */
        readonly requesterPaysEnabled?: boolean | cdk.IResolvable;
        /**
         * Specifies the location in Amazon S3 where query results are stored and the encryption option, if any, used for query results. For more information, see [Working with Query Results, Output Files, and Query History](https://docs.aws.amazon.com/athena/latest/ug/querying.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-resultconfiguration
         */
        readonly resultConfiguration?: CfnWorkGroup.ResultConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WorkGroupConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkGroupConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkGroup_WorkGroupConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bytesScannedCutoffPerQuery', cdk.validateNumber)(properties.bytesScannedCutoffPerQuery));
    errors.collect(cdk.propertyValidator('enforceWorkGroupConfiguration', cdk.validateBoolean)(properties.enforceWorkGroupConfiguration));
    errors.collect(cdk.propertyValidator('engineVersion', CfnWorkGroup_EngineVersionPropertyValidator)(properties.engineVersion));
    errors.collect(cdk.propertyValidator('publishCloudWatchMetricsEnabled', cdk.validateBoolean)(properties.publishCloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('requesterPaysEnabled', cdk.validateBoolean)(properties.requesterPaysEnabled));
    errors.collect(cdk.propertyValidator('resultConfiguration', CfnWorkGroup_ResultConfigurationPropertyValidator)(properties.resultConfiguration));
    return errors.wrap('supplied properties not correct for "WorkGroupConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.WorkGroupConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `WorkGroupConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Athena::WorkGroup.WorkGroupConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkGroupWorkGroupConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkGroup_WorkGroupConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BytesScannedCutoffPerQuery: cdk.numberToCloudFormation(properties.bytesScannedCutoffPerQuery),
        EnforceWorkGroupConfiguration: cdk.booleanToCloudFormation(properties.enforceWorkGroupConfiguration),
        EngineVersion: cfnWorkGroupEngineVersionPropertyToCloudFormation(properties.engineVersion),
        PublishCloudWatchMetricsEnabled: cdk.booleanToCloudFormation(properties.publishCloudWatchMetricsEnabled),
        RequesterPaysEnabled: cdk.booleanToCloudFormation(properties.requesterPaysEnabled),
        ResultConfiguration: cfnWorkGroupResultConfigurationPropertyToCloudFormation(properties.resultConfiguration),
    };
}

// @ts-ignore TS6133
function CfnWorkGroupWorkGroupConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.WorkGroupConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.WorkGroupConfigurationProperty>();
    ret.addPropertyResult('bytesScannedCutoffPerQuery', 'BytesScannedCutoffPerQuery', properties.BytesScannedCutoffPerQuery != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesScannedCutoffPerQuery) : undefined);
    ret.addPropertyResult('enforceWorkGroupConfiguration', 'EnforceWorkGroupConfiguration', properties.EnforceWorkGroupConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceWorkGroupConfiguration) : undefined);
    ret.addPropertyResult('engineVersion', 'EngineVersion', properties.EngineVersion != null ? CfnWorkGroupEngineVersionPropertyFromCloudFormation(properties.EngineVersion) : undefined);
    ret.addPropertyResult('publishCloudWatchMetricsEnabled', 'PublishCloudWatchMetricsEnabled', properties.PublishCloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PublishCloudWatchMetricsEnabled) : undefined);
    ret.addPropertyResult('requesterPaysEnabled', 'RequesterPaysEnabled', properties.RequesterPaysEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequesterPaysEnabled) : undefined);
    ret.addPropertyResult('resultConfiguration', 'ResultConfiguration', properties.ResultConfiguration != null ? CfnWorkGroupResultConfigurationPropertyFromCloudFormation(properties.ResultConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
