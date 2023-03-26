// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:09.666Z","fingerprint":"T6MfLlBkfaoZgZ7DwEhJ3zwnUcaoImRoQ9MD3foomo8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export interface CfnEnvironmentProps {

    /**
     * The name of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-name
     */
    readonly name: string;

    /**
     * The list of Amazon Resource Names (ARN) of the data bundles to install. Currently supported data bundle ARNs:
     *
     * - `arn:aws:finspace:${Region}::data-bundle/capital-markets-sample` - Contains sample Capital Markets datasets, categories and controlled vocabularies.
     * - `arn:aws:finspace:${Region}::data-bundle/taq` (default) - Contains trades and quotes data in addition to sample Capital Markets data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-databundles
     */
    readonly dataBundles?: string[];

    /**
     * The description of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-description
     */
    readonly description?: string;

    /**
     * The authentication mode for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationmode
     */
    readonly federationMode?: string;

    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationparameters
     */
    readonly federationParameters?: CfnEnvironment.FederationParametersProperty | cdk.IResolvable;

    /**
     * The KMS key id used to encrypt in the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * Configuration information for the superuser.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-superuserparameters
     */
    readonly superuserParameters?: CfnEnvironment.SuperuserParametersProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataBundles', cdk.listValidator(cdk.validateString))(properties.dataBundles));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('federationMode', cdk.validateString)(properties.federationMode));
    errors.collect(cdk.propertyValidator('federationParameters', CfnEnvironment_FederationParametersPropertyValidator)(properties.federationParameters));
    errors.collect(cdk.propertyValidator('kmsKeyId', cdk.validateString)(properties.kmsKeyId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('superuserParameters', CfnEnvironment_SuperuserParametersPropertyValidator)(properties.superuserParameters));
    return errors.wrap('supplied properties not correct for "CfnEnvironmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FinSpace::Environment` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FinSpace::Environment` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironmentPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        DataBundles: cdk.listMapper(cdk.stringToCloudFormation)(properties.dataBundles),
        Description: cdk.stringToCloudFormation(properties.description),
        FederationMode: cdk.stringToCloudFormation(properties.federationMode),
        FederationParameters: cfnEnvironmentFederationParametersPropertyToCloudFormation(properties.federationParameters),
        KmsKeyId: cdk.stringToCloudFormation(properties.kmsKeyId),
        SuperuserParameters: cfnEnvironmentSuperuserParametersPropertyToCloudFormation(properties.superuserParameters),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('dataBundles', 'DataBundles', properties.DataBundles != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DataBundles) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('federationMode', 'FederationMode', properties.FederationMode != null ? cfn_parse.FromCloudFormation.getString(properties.FederationMode) : undefined);
    ret.addPropertyResult('federationParameters', 'FederationParameters', properties.FederationParameters != null ? CfnEnvironmentFederationParametersPropertyFromCloudFormation(properties.FederationParameters) : undefined);
    ret.addPropertyResult('kmsKeyId', 'KmsKeyId', properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined);
    ret.addPropertyResult('superuserParameters', 'SuperuserParameters', properties.SuperuserParameters != null ? CfnEnvironmentSuperuserParametersPropertyFromCloudFormation(properties.SuperuserParameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::FinSpace::Environment`
 *
 * The `AWS::FinSpace::Environment` resource represents an Amazon FinSpace environment.
 *
 * @cloudformationResource AWS::FinSpace::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FinSpace::Environment";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEnvironment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the AWS account in which the FinSpace environment is created.
     * @cloudformationAttribute AwsAccountId
     */
    public readonly attrAwsAccountId: string;

    /**
     * The AWS account ID of the dedicated service account associated with your FinSpace environment.
     * @cloudformationAttribute DedicatedServiceAccountId
     */
    public readonly attrDedicatedServiceAccountId: string;

    /**
     * The Amazon Resource Name (ARN) of your FinSpace environment.
     * @cloudformationAttribute EnvironmentArn
     */
    public readonly attrEnvironmentArn: string;

    /**
     * The identifier of the FinSpace environment.
     * @cloudformationAttribute EnvironmentId
     */
    public readonly attrEnvironmentId: string;

    /**
     * The sign-in url for the web application of your FinSpace environment.
     * @cloudformationAttribute EnvironmentUrl
     */
    public readonly attrEnvironmentUrl: string;

    /**
     * The url of the integrated FinSpace notebook environment in your web application.
     * @cloudformationAttribute SageMakerStudioDomainUrl
     */
    public readonly attrSageMakerStudioDomainUrl: string;

    /**
     * The current status of creation of the FinSpace environment.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The name of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-name
     */
    public name: string;

    /**
     * The list of Amazon Resource Names (ARN) of the data bundles to install. Currently supported data bundle ARNs:
     *
     * - `arn:aws:finspace:${Region}::data-bundle/capital-markets-sample` - Contains sample Capital Markets datasets, categories and controlled vocabularies.
     * - `arn:aws:finspace:${Region}::data-bundle/taq` (default) - Contains trades and quotes data in addition to sample Capital Markets data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-databundles
     */
    public dataBundles: string[] | undefined;

    /**
     * The description of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-description
     */
    public description: string | undefined;

    /**
     * The authentication mode for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationmode
     */
    public federationMode: string | undefined;

    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationparameters
     */
    public federationParameters: CfnEnvironment.FederationParametersProperty | cdk.IResolvable | undefined;

    /**
     * The KMS key id used to encrypt in the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-kmskeyid
     */
    public kmsKeyId: string | undefined;

    /**
     * Configuration information for the superuser.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-superuserparameters
     */
    public superuserParameters: CfnEnvironment.SuperuserParametersProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::FinSpace::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
        super(scope, id, { type: CfnEnvironment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrAwsAccountId = cdk.Token.asString(this.getAtt('AwsAccountId', cdk.ResolutionTypeHint.STRING));
        this.attrDedicatedServiceAccountId = cdk.Token.asString(this.getAtt('DedicatedServiceAccountId', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentArn = cdk.Token.asString(this.getAtt('EnvironmentArn', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentId = cdk.Token.asString(this.getAtt('EnvironmentId', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentUrl = cdk.Token.asString(this.getAtt('EnvironmentUrl', cdk.ResolutionTypeHint.STRING));
        this.attrSageMakerStudioDomainUrl = cdk.Token.asString(this.getAtt('SageMakerStudioDomainUrl', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.dataBundles = props.dataBundles;
        this.description = props.description;
        this.federationMode = props.federationMode;
        this.federationParameters = props.federationParameters;
        this.kmsKeyId = props.kmsKeyId;
        this.superuserParameters = props.superuserParameters;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            dataBundles: this.dataBundles,
            description: this.description,
            federationMode: this.federationMode,
            federationParameters: this.federationParameters,
            kmsKeyId: this.kmsKeyId,
            superuserParameters: this.superuserParameters,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnvironmentPropsToCloudFormation(props);
    }
}

export namespace CfnEnvironment {
    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html
     */
    export interface FederationParametersProperty {
        /**
         * The redirect or sign-in URL that should be entered into the SAML 2.0 compliant identity provider configuration (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-applicationcallbackurl
         */
        readonly applicationCallBackUrl?: string;
        /**
         * SAML attribute name and value. The name must always be `Email` and the value should be set to the attribute definition in which user email is set. For example, name would be `Email` and value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` . Please check your SAML 2.0 compliant identity provider (IdP) documentation for details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-attributemap
         */
        readonly attributeMap?: any | cdk.IResolvable;
        /**
         * Name of the identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationprovidername
         */
        readonly federationProviderName?: string;
        /**
         * The Uniform Resource Name (URN). Also referred as Service Provider URN or Audience URI or Service Provider Entity ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationurn
         */
        readonly federationUrn?: string;
        /**
         * SAML 2.0 Metadata document from identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadatadocument
         */
        readonly samlMetadataDocument?: string;
        /**
         * Provide the metadata URL from your SAML 2.0 compliant identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadataurl
         */
        readonly samlMetadataUrl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FederationParametersProperty`
 *
 * @param properties - the TypeScript properties of a `FederationParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_FederationParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationCallBackUrl', cdk.validateString)(properties.applicationCallBackUrl));
    errors.collect(cdk.propertyValidator('attributeMap', cdk.validateObject)(properties.attributeMap));
    errors.collect(cdk.propertyValidator('federationProviderName', cdk.validateString)(properties.federationProviderName));
    errors.collect(cdk.propertyValidator('federationUrn', cdk.validateString)(properties.federationUrn));
    errors.collect(cdk.propertyValidator('samlMetadataDocument', cdk.validateString)(properties.samlMetadataDocument));
    errors.collect(cdk.propertyValidator('samlMetadataUrl', cdk.validateString)(properties.samlMetadataUrl));
    return errors.wrap('supplied properties not correct for "FederationParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FinSpace::Environment.FederationParameters` resource
 *
 * @param properties - the TypeScript properties of a `FederationParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FinSpace::Environment.FederationParameters` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentFederationParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_FederationParametersPropertyValidator(properties).assertSuccess();
    return {
        ApplicationCallBackURL: cdk.stringToCloudFormation(properties.applicationCallBackUrl),
        AttributeMap: cdk.objectToCloudFormation(properties.attributeMap),
        FederationProviderName: cdk.stringToCloudFormation(properties.federationProviderName),
        FederationURN: cdk.stringToCloudFormation(properties.federationUrn),
        SamlMetadataDocument: cdk.stringToCloudFormation(properties.samlMetadataDocument),
        SamlMetadataURL: cdk.stringToCloudFormation(properties.samlMetadataUrl),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentFederationParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.FederationParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.FederationParametersProperty>();
    ret.addPropertyResult('applicationCallBackUrl', 'ApplicationCallBackURL', properties.ApplicationCallBackURL != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationCallBackURL) : undefined);
    ret.addPropertyResult('attributeMap', 'AttributeMap', properties.AttributeMap != null ? cfn_parse.FromCloudFormation.getAny(properties.AttributeMap) : undefined);
    ret.addPropertyResult('federationProviderName', 'FederationProviderName', properties.FederationProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.FederationProviderName) : undefined);
    ret.addPropertyResult('federationUrn', 'FederationURN', properties.FederationURN != null ? cfn_parse.FromCloudFormation.getString(properties.FederationURN) : undefined);
    ret.addPropertyResult('samlMetadataDocument', 'SamlMetadataDocument', properties.SamlMetadataDocument != null ? cfn_parse.FromCloudFormation.getString(properties.SamlMetadataDocument) : undefined);
    ret.addPropertyResult('samlMetadataUrl', 'SamlMetadataURL', properties.SamlMetadataURL != null ? cfn_parse.FromCloudFormation.getString(properties.SamlMetadataURL) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnEnvironment {
    /**
     * Configuration information for the superuser.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html
     */
    export interface SuperuserParametersProperty {
        /**
         * The email address of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-emailaddress
         */
        readonly emailAddress?: string;
        /**
         * The first name of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-firstname
         */
        readonly firstName?: string;
        /**
         * The last name of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-lastname
         */
        readonly lastName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SuperuserParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SuperuserParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnEnvironment_SuperuserParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('emailAddress', cdk.validateString)(properties.emailAddress));
    errors.collect(cdk.propertyValidator('firstName', cdk.validateString)(properties.firstName));
    errors.collect(cdk.propertyValidator('lastName', cdk.validateString)(properties.lastName));
    return errors.wrap('supplied properties not correct for "SuperuserParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::FinSpace::Environment.SuperuserParameters` resource
 *
 * @param properties - the TypeScript properties of a `SuperuserParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::FinSpace::Environment.SuperuserParameters` resource.
 */
// @ts-ignore TS6133
function cfnEnvironmentSuperuserParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnvironment_SuperuserParametersPropertyValidator(properties).assertSuccess();
    return {
        EmailAddress: cdk.stringToCloudFormation(properties.emailAddress),
        FirstName: cdk.stringToCloudFormation(properties.firstName),
        LastName: cdk.stringToCloudFormation(properties.lastName),
    };
}

// @ts-ignore TS6133
function CfnEnvironmentSuperuserParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironment.SuperuserParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.SuperuserParametersProperty>();
    ret.addPropertyResult('emailAddress', 'EmailAddress', properties.EmailAddress != null ? cfn_parse.FromCloudFormation.getString(properties.EmailAddress) : undefined);
    ret.addPropertyResult('firstName', 'FirstName', properties.FirstName != null ? cfn_parse.FromCloudFormation.getString(properties.FirstName) : undefined);
    ret.addPropertyResult('lastName', 'LastName', properties.LastName != null ? cfn_parse.FromCloudFormation.getString(properties.LastName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
