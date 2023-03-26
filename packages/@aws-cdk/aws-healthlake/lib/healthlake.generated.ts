// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:26.611Z","fingerprint":"xqn2DaR07bOHF6wdg2jfloQa3MsZCXHA6Nq0YqXaLzQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnFHIRDatastore`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export interface CfnFHIRDatastoreProps {

    /**
     * The FHIR version of the Data Store. The only supported version is R4.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastoretypeversion
     */
    readonly datastoreTypeVersion: string;

    /**
     * The user generated name for the Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastorename
     */
    readonly datastoreName?: string;

    /**
     * The preloaded data configuration for the Data Store. Only data preloaded from Synthea is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-preloaddataconfig
     */
    readonly preloadDataConfig?: CfnFHIRDatastore.PreloadDataConfigProperty | cdk.IResolvable;

    /**
     * The server-side encryption key configuration for a customer provided encryption key specified for creating a Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-sseconfiguration
     */
    readonly sseConfiguration?: CfnFHIRDatastore.SseConfigurationProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFHIRDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnFHIRDatastoreProps`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastorePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('datastoreName', cdk.validateString)(properties.datastoreName));
    errors.collect(cdk.propertyValidator('datastoreTypeVersion', cdk.requiredValidator)(properties.datastoreTypeVersion));
    errors.collect(cdk.propertyValidator('datastoreTypeVersion', cdk.validateString)(properties.datastoreTypeVersion));
    errors.collect(cdk.propertyValidator('preloadDataConfig', CfnFHIRDatastore_PreloadDataConfigPropertyValidator)(properties.preloadDataConfig));
    errors.collect(cdk.propertyValidator('sseConfiguration', CfnFHIRDatastore_SseConfigurationPropertyValidator)(properties.sseConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFHIRDatastoreProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore` resource
 *
 * @param properties - the TypeScript properties of a `CfnFHIRDatastoreProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastorePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFHIRDatastorePropsValidator(properties).assertSuccess();
    return {
        DatastoreTypeVersion: cdk.stringToCloudFormation(properties.datastoreTypeVersion),
        DatastoreName: cdk.stringToCloudFormation(properties.datastoreName),
        PreloadDataConfig: cfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties.preloadDataConfig),
        SseConfiguration: cfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties.sseConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFHIRDatastorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastoreProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastoreProps>();
    ret.addPropertyResult('datastoreTypeVersion', 'DatastoreTypeVersion', cfn_parse.FromCloudFormation.getString(properties.DatastoreTypeVersion));
    ret.addPropertyResult('datastoreName', 'DatastoreName', properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined);
    ret.addPropertyResult('preloadDataConfig', 'PreloadDataConfig', properties.PreloadDataConfig != null ? CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties.PreloadDataConfig) : undefined);
    ret.addPropertyResult('sseConfiguration', 'SseConfiguration', properties.SseConfiguration != null ? CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties.SseConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::HealthLake::FHIRDatastore`
 *
 * Creates a Data Store that can ingest and export FHIR formatted data.
 *
 * > Please note that when a user tries to do an Update operation via CloudFormation, changes to the Data Store name, Type Version, PreloadDataConfig, or SSEConfiguration will delete their existing Data Store for the stack and create a new one. This will lead to potential loss of data.
 *
 * @cloudformationResource AWS::HealthLake::FHIRDatastore
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export class CfnFHIRDatastore extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::HealthLake::FHIRDatastore";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFHIRDatastore {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFHIRDatastorePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFHIRDatastore(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute CreatedAt.Nanos
     */
    public readonly attrCreatedAtNanos: number;

    /**
     *
     * @cloudformationAttribute CreatedAt.Seconds
     */
    public readonly attrCreatedAtSeconds: string;

    /**
     * The Data Store ARN is generated during the creation of the Data Store and can be found in the output from the initial Data Store creation request.
     * @cloudformationAttribute DatastoreArn
     */
    public readonly attrDatastoreArn: string;

    /**
     * The endpoint for the created Data Store.
     * @cloudformationAttribute DatastoreEndpoint
     */
    public readonly attrDatastoreEndpoint: string;

    /**
     * The Amazon generated Data Store id. This id is in the output from the initial Data Store creation call.
     * @cloudformationAttribute DatastoreId
     */
    public readonly attrDatastoreId: string;

    /**
     * The status of the FHIR Data Store. Possible statuses are ‘CREATING’, ‘ACTIVE’, ‘DELETING’, ‘DELETED’.
     * @cloudformationAttribute DatastoreStatus
     */
    public readonly attrDatastoreStatus: string;

    /**
     * The FHIR version of the Data Store. The only supported version is R4.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastoretypeversion
     */
    public datastoreTypeVersion: string;

    /**
     * The user generated name for the Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastorename
     */
    public datastoreName: string | undefined;

    /**
     * The preloaded data configuration for the Data Store. Only data preloaded from Synthea is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-preloaddataconfig
     */
    public preloadDataConfig: CfnFHIRDatastore.PreloadDataConfigProperty | cdk.IResolvable | undefined;

    /**
     * The server-side encryption key configuration for a customer provided encryption key specified for creating a Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-sseconfiguration
     */
    public sseConfiguration: CfnFHIRDatastore.SseConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::HealthLake::FHIRDatastore`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFHIRDatastoreProps) {
        super(scope, id, { type: CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'datastoreTypeVersion', this);
        this.attrCreatedAtNanos = cdk.Token.asNumber(this.getAtt('CreatedAt.Nanos', cdk.ResolutionTypeHint.NUMBER));
        this.attrCreatedAtSeconds = cdk.Token.asString(this.getAtt('CreatedAt.Seconds', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreArn = cdk.Token.asString(this.getAtt('DatastoreArn', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreEndpoint = cdk.Token.asString(this.getAtt('DatastoreEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreId = cdk.Token.asString(this.getAtt('DatastoreId', cdk.ResolutionTypeHint.STRING));
        this.attrDatastoreStatus = cdk.Token.asString(this.getAtt('DatastoreStatus', cdk.ResolutionTypeHint.STRING));

        this.datastoreTypeVersion = props.datastoreTypeVersion;
        this.datastoreName = props.datastoreName;
        this.preloadDataConfig = props.preloadDataConfig;
        this.sseConfiguration = props.sseConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::HealthLake::FHIRDatastore", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            datastoreTypeVersion: this.datastoreTypeVersion,
            datastoreName: this.datastoreName,
            preloadDataConfig: this.preloadDataConfig,
            sseConfiguration: this.sseConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFHIRDatastorePropsToCloudFormation(props);
    }
}

export namespace CfnFHIRDatastore {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html
     */
    export interface CreatedAtProperty {
        /**
         * `CfnFHIRDatastore.CreatedAtProperty.Nanos`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-nanos
         */
        readonly nanos: number;
        /**
         * `CfnFHIRDatastore.CreatedAtProperty.Seconds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-seconds
         */
        readonly seconds: string;
    }
}

/**
 * Determine whether the given properties match those of a `CreatedAtProperty`
 *
 * @param properties - the TypeScript properties of a `CreatedAtProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_CreatedAtPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nanos', cdk.requiredValidator)(properties.nanos));
    errors.collect(cdk.propertyValidator('nanos', cdk.validateNumber)(properties.nanos));
    errors.collect(cdk.propertyValidator('seconds', cdk.requiredValidator)(properties.seconds));
    errors.collect(cdk.propertyValidator('seconds', cdk.validateString)(properties.seconds));
    return errors.wrap('supplied properties not correct for "CreatedAtProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.CreatedAt` resource
 *
 * @param properties - the TypeScript properties of a `CreatedAtProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.CreatedAt` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreCreatedAtPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFHIRDatastore_CreatedAtPropertyValidator(properties).assertSuccess();
    return {
        Nanos: cdk.numberToCloudFormation(properties.nanos),
        Seconds: cdk.stringToCloudFormation(properties.seconds),
    };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreCreatedAtPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.CreatedAtProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.CreatedAtProperty>();
    ret.addPropertyResult('nanos', 'Nanos', cfn_parse.FromCloudFormation.getNumber(properties.Nanos));
    ret.addPropertyResult('seconds', 'Seconds', cfn_parse.FromCloudFormation.getString(properties.Seconds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFHIRDatastore {
    /**
     * The customer-managed-key(CMK) used when creating a Data Store. If a customer owned key is not specified, an Amazon owned key will be used for encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html
     */
    export interface KmsEncryptionConfigProperty {
        /**
         * The type of customer-managed-key(CMK) used for encryption. The two types of supported CMKs are customer owned CMKs and Amazon owned CMKs. For more information on CMK types, see [KmsEncryptionConfig](https://docs.aws.amazon.com/healthlake/latest/APIReference/API_KmsEncryptionConfig.html#HealthLake-Type-KmsEncryptionConfig-CmkType) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-cmktype
         */
        readonly cmkType: string;
        /**
         * The KMS encryption key id/alias used to encrypt the Data Store contents at rest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-kmskeyid
         */
        readonly kmsKeyId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KmsEncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KmsEncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cmkType', cdk.requiredValidator)(properties.cmkType));
    errors.collect(cdk.propertyValidator('cmkType', cdk.validateString)(properties.cmkType));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    return errors.wrap('supplied properties not correct for "KmsEncryptionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.KmsEncryptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `KmsEncryptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.KmsEncryptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        CmkType: cdk.stringToCloudFormation(properties.cmkType),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.KmsEncryptionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.KmsEncryptionConfigProperty>();
    ret.addPropertyResult('cmkType', 'CmkType', cfn_parse.FromCloudFormation.getString(properties.CmkType));
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFHIRDatastore {
    /**
     * Optional parameter to preload data upon creation of the Data Store. Currently, the only supported preloaded data is synthetic data generated from Synthea.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html
     */
    export interface PreloadDataConfigProperty {
        /**
         * The type of preloaded data. Only Synthea preloaded data is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html#cfn-healthlake-fhirdatastore-preloaddataconfig-preloaddatatype
         */
        readonly preloadDataType: string;
    }
}

/**
 * Determine whether the given properties match those of a `PreloadDataConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PreloadDataConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_PreloadDataConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('preloadDataType', cdk.requiredValidator)(properties.preloadDataType));
    errors.collect(cdk.propertyValidator('preloadDataType', cdk.validateString)(properties.preloadDataType));
    return errors.wrap('supplied properties not correct for "PreloadDataConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.PreloadDataConfig` resource
 *
 * @param properties - the TypeScript properties of a `PreloadDataConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.PreloadDataConfig` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFHIRDatastore_PreloadDataConfigPropertyValidator(properties).assertSuccess();
    return {
        PreloadDataType: cdk.stringToCloudFormation(properties.preloadDataType),
    };
}

// @ts-ignore TS6133
function CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.PreloadDataConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.PreloadDataConfigProperty>();
    ret.addPropertyResult('preloadDataType', 'PreloadDataType', cfn_parse.FromCloudFormation.getString(properties.PreloadDataType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFHIRDatastore {
    /**
     * The server-side encryption key configuration for a customer provided encryption key.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html
     */
    export interface SseConfigurationProperty {
        /**
         * The server-side encryption key configuration for a customer provided encryption key (CMK).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html#cfn-healthlake-fhirdatastore-sseconfiguration-kmsencryptionconfig
         */
        readonly kmsEncryptionConfig: CfnFHIRDatastore.KmsEncryptionConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SseConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnFHIRDatastore_SseConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsEncryptionConfig', cdk.requiredValidator)(properties.kmsEncryptionConfig));
    errors.collect(cdk.propertyValidator('kmsEncryptionConfig', CfnFHIRDatastore_KmsEncryptionConfigPropertyValidator)(properties.kmsEncryptionConfig));
    return errors.wrap('supplied properties not correct for "SseConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.SseConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SseConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::HealthLake::FHIRDatastore.SseConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFHIRDatastore_SseConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KmsEncryptionConfig: cfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties.kmsEncryptionConfig),
    };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.SseConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.SseConfigurationProperty>();
    ret.addPropertyResult('kmsEncryptionConfig', 'KmsEncryptionConfig', CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties.KmsEncryptionConfig));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
