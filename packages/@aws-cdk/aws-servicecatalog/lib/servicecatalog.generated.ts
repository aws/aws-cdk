// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T06:39:58.450Z","fingerprint":"0wfJH9FZS0OpTB2Nw1tfmivw8XUIKv5usS3ZqgzFMUQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAcceptedPortfolioShare`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html
 */
export interface CfnAcceptedPortfolioShareProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-acceptlanguage
     */
    readonly acceptLanguage?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAcceptedPortfolioShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnAcceptedPortfolioShareProps`
 *
 * @returns the result of the validation.
 */
function CfnAcceptedPortfolioSharePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    return errors.wrap('supplied properties not correct for "CfnAcceptedPortfolioShareProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::AcceptedPortfolioShare` resource
 *
 * @param properties - the TypeScript properties of a `CfnAcceptedPortfolioShareProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::AcceptedPortfolioShare` resource.
 */
// @ts-ignore TS6133
function cfnAcceptedPortfolioSharePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAcceptedPortfolioSharePropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
    };
}

// @ts-ignore TS6133
function CfnAcceptedPortfolioSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAcceptedPortfolioShareProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAcceptedPortfolioShareProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::AcceptedPortfolioShare`
 *
 * Accepts an offer to share the specified portfolio.
 *
 * @cloudformationResource AWS::ServiceCatalog::AcceptedPortfolioShare
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html
 */
export class CfnAcceptedPortfolioShare extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::AcceptedPortfolioShare";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAcceptedPortfolioShare {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAcceptedPortfolioSharePropsFromCloudFormation(resourceProperties);
        const ret = new CfnAcceptedPortfolioShare(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-portfolioid
     */
    public portfolioId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::AcceptedPortfolioShare`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAcceptedPortfolioShareProps) {
        super(scope, id, { type: CfnAcceptedPortfolioShare.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);

        this.portfolioId = props.portfolioId;
        this.acceptLanguage = props.acceptLanguage;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAcceptedPortfolioShare.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            acceptLanguage: this.acceptLanguage,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAcceptedPortfolioSharePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnCloudFormationProduct`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html
 */
export interface CfnCloudFormationProductProps {

    /**
     * The name of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-name
     */
    readonly name: string;

    /**
     * The owner of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-owner
     */
    readonly owner: string;

    /**
     * The configuration of the provisioning artifact (also known as a version).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactparameters
     */
    readonly provisioningArtifactParameters: Array<CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-description
     */
    readonly description?: string;

    /**
     * The distributor of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-distributor
     */
    readonly distributor?: string;

    /**
     * This property is turned off by default. If turned off, you can update provisioning artifacts or product attributes (such as description, distributor, name, owner, and more) and the associated provisioning artifacts will retain the same unique identifier. Provisioning artifacts are matched within the CloudFormationProduct resource, and only those that have been updated will be changed. Provisioning artifacts are matched by a combinaton of provisioning artifact template URL and name.
     *
     * If turned on, provisioning artifacts will be given a new unique identifier when you update the product or provisioning artifacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-replaceprovisioningartifacts
     */
    readonly replaceProvisioningArtifacts?: boolean | cdk.IResolvable;

    /**
     * The support information about the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportdescription
     */
    readonly supportDescription?: string;

    /**
     * The contact email for product support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportemail
     */
    readonly supportEmail?: string;

    /**
     * The contact URL for product support.
     *
     * `^https?:\/\//` / is the pattern used to validate SupportUrl.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supporturl
     */
    readonly supportUrl?: string;

    /**
     * One or more tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCloudFormationProductProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProductProps`
 *
 * @returns the result of the validation.
 */
function CfnCloudFormationProductPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('distributor', cdk.validateString)(properties.distributor));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('owner', cdk.requiredValidator)(properties.owner));
    errors.collect(cdk.propertyValidator('owner', cdk.validateString)(properties.owner));
    errors.collect(cdk.propertyValidator('provisioningArtifactParameters', cdk.requiredValidator)(properties.provisioningArtifactParameters));
    errors.collect(cdk.propertyValidator('provisioningArtifactParameters', cdk.listValidator(CfnCloudFormationProduct_ProvisioningArtifactPropertiesPropertyValidator))(properties.provisioningArtifactParameters));
    errors.collect(cdk.propertyValidator('replaceProvisioningArtifacts', cdk.validateBoolean)(properties.replaceProvisioningArtifacts));
    errors.collect(cdk.propertyValidator('supportDescription', cdk.validateString)(properties.supportDescription));
    errors.collect(cdk.propertyValidator('supportEmail', cdk.validateString)(properties.supportEmail));
    errors.collect(cdk.propertyValidator('supportUrl', cdk.validateString)(properties.supportUrl));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCloudFormationProductProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProduct` resource
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProductProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProduct` resource.
 */
// @ts-ignore TS6133
function cfnCloudFormationProductPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFormationProductPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Owner: cdk.stringToCloudFormation(properties.owner),
        ProvisioningArtifactParameters: cdk.listMapper(cfnCloudFormationProductProvisioningArtifactPropertiesPropertyToCloudFormation)(properties.provisioningArtifactParameters),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
        Distributor: cdk.stringToCloudFormation(properties.distributor),
        ReplaceProvisioningArtifacts: cdk.booleanToCloudFormation(properties.replaceProvisioningArtifacts),
        SupportDescription: cdk.stringToCloudFormation(properties.supportDescription),
        SupportEmail: cdk.stringToCloudFormation(properties.supportEmail),
        SupportUrl: cdk.stringToCloudFormation(properties.supportUrl),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCloudFormationProductPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProductProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProductProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('owner', 'Owner', cfn_parse.FromCloudFormation.getString(properties.Owner));
    ret.addPropertyResult('provisioningArtifactParameters', 'ProvisioningArtifactParameters', cfn_parse.FromCloudFormation.getArray(CfnCloudFormationProductProvisioningArtifactPropertiesPropertyFromCloudFormation)(properties.ProvisioningArtifactParameters));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('distributor', 'Distributor', properties.Distributor != null ? cfn_parse.FromCloudFormation.getString(properties.Distributor) : undefined);
    ret.addPropertyResult('replaceProvisioningArtifacts', 'ReplaceProvisioningArtifacts', properties.ReplaceProvisioningArtifacts != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReplaceProvisioningArtifacts) : undefined);
    ret.addPropertyResult('supportDescription', 'SupportDescription', properties.SupportDescription != null ? cfn_parse.FromCloudFormation.getString(properties.SupportDescription) : undefined);
    ret.addPropertyResult('supportEmail', 'SupportEmail', properties.SupportEmail != null ? cfn_parse.FromCloudFormation.getString(properties.SupportEmail) : undefined);
    ret.addPropertyResult('supportUrl', 'SupportUrl', properties.SupportUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SupportUrl) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::CloudFormationProduct`
 *
 * Specifies a product.
 *
 * @cloudformationResource AWS::ServiceCatalog::CloudFormationProduct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html
 */
export class CfnCloudFormationProduct extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::CloudFormationProduct";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFormationProduct {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCloudFormationProductPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCloudFormationProduct(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the product.
     * @cloudformationAttribute ProductName
     */
    public readonly attrProductName: string;

    /**
     * The IDs of the provisioning artifacts.
     * @cloudformationAttribute ProvisioningArtifactIds
     */
    public readonly attrProvisioningArtifactIds: string;

    /**
     * The names of the provisioning artifacts.
     * @cloudformationAttribute ProvisioningArtifactNames
     */
    public readonly attrProvisioningArtifactNames: string;

    /**
     * The name of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-name
     */
    public name: string;

    /**
     * The owner of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-owner
     */
    public owner: string;

    /**
     * The configuration of the provisioning artifact (also known as a version).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactparameters
     */
    public provisioningArtifactParameters: Array<CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-description
     */
    public description: string | undefined;

    /**
     * The distributor of the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-distributor
     */
    public distributor: string | undefined;

    /**
     * This property is turned off by default. If turned off, you can update provisioning artifacts or product attributes (such as description, distributor, name, owner, and more) and the associated provisioning artifacts will retain the same unique identifier. Provisioning artifacts are matched within the CloudFormationProduct resource, and only those that have been updated will be changed. Provisioning artifacts are matched by a combinaton of provisioning artifact template URL and name.
     *
     * If turned on, provisioning artifacts will be given a new unique identifier when you update the product or provisioning artifacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-replaceprovisioningartifacts
     */
    public replaceProvisioningArtifacts: boolean | cdk.IResolvable | undefined;

    /**
     * The support information about the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportdescription
     */
    public supportDescription: string | undefined;

    /**
     * The contact email for product support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportemail
     */
    public supportEmail: string | undefined;

    /**
     * The contact URL for product support.
     *
     * `^https?:\/\//` / is the pattern used to validate SupportUrl.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supporturl
     */
    public supportUrl: string | undefined;

    /**
     * One or more tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ServiceCatalog::CloudFormationProduct`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCloudFormationProductProps) {
        super(scope, id, { type: CfnCloudFormationProduct.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'owner', this);
        cdk.requireProperty(props, 'provisioningArtifactParameters', this);
        this.attrProductName = cdk.Token.asString(this.getAtt('ProductName', cdk.ResolutionTypeHint.STRING));
        this.attrProvisioningArtifactIds = cdk.Token.asString(this.getAtt('ProvisioningArtifactIds', cdk.ResolutionTypeHint.STRING));
        this.attrProvisioningArtifactNames = cdk.Token.asString(this.getAtt('ProvisioningArtifactNames', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.owner = props.owner;
        this.provisioningArtifactParameters = props.provisioningArtifactParameters;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
        this.distributor = props.distributor;
        this.replaceProvisioningArtifacts = props.replaceProvisioningArtifacts;
        this.supportDescription = props.supportDescription;
        this.supportEmail = props.supportEmail;
        this.supportUrl = props.supportUrl;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::CloudFormationProduct", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFormationProduct.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            owner: this.owner,
            provisioningArtifactParameters: this.provisioningArtifactParameters,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
            distributor: this.distributor,
            replaceProvisioningArtifacts: this.replaceProvisioningArtifacts,
            supportDescription: this.supportDescription,
            supportEmail: this.supportEmail,
            supportUrl: this.supportUrl,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCloudFormationProductPropsToCloudFormation(props);
    }
}

export namespace CfnCloudFormationProduct {
    /**
     * Information about a provisioning artifact (also known as a version) for a product.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html
     */
    export interface ProvisioningArtifactPropertiesProperty {
        /**
         * The description of the provisioning artifact, including how it differs from the previous provisioning artifact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-description
         */
        readonly description?: string;
        /**
         * If set to true, AWS Service Catalog stops validating the specified provisioning artifact even if it is invalid.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-disabletemplatevalidation
         */
        readonly disableTemplateValidation?: boolean | cdk.IResolvable;
        /**
         * Specify the template source with one of the following options, but not both. Keys accepted: [ `LoadTemplateFromURL` , `ImportFromPhysicalId` ]
         *
         * The URL of the AWS CloudFormation template in Amazon S3 or GitHub in JSON format. Specify the URL in JSON format as follows:
         *
         * `"LoadTemplateFromURL": "https://s3.amazonaws.com/cf-templates-ozkq9d3hgiq2-us-east-1/..."`
         *
         * `ImportFromPhysicalId` : The physical id of the resource that contains the template. Currently only supports AWS CloudFormation stack arn. Specify the physical id in JSON format as follows: `ImportFromPhysicalId: “arn:aws:cloudformation:[us-east-1]:[accountId]:stack/[StackName]/[resourceId]`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-info
         */
        readonly info: any | cdk.IResolvable;
        /**
         * The name of the provisioning artifact (for example, v1 v2beta). No spaces are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisioningArtifactPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningArtifactPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnCloudFormationProduct_ProvisioningArtifactPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disableTemplateValidation', cdk.validateBoolean)(properties.disableTemplateValidation));
    errors.collect(cdk.propertyValidator('info', cdk.requiredValidator)(properties.info));
    errors.collect(cdk.propertyValidator('info', cdk.validateObject)(properties.info));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ProvisioningArtifactPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProduct.ProvisioningArtifactProperties` resource
 *
 * @param properties - the TypeScript properties of a `ProvisioningArtifactPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProduct.ProvisioningArtifactProperties` resource.
 */
// @ts-ignore TS6133
function cfnCloudFormationProductProvisioningArtifactPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFormationProduct_ProvisioningArtifactPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        DisableTemplateValidation: cdk.booleanToCloudFormation(properties.disableTemplateValidation),
        Info: cdk.objectToCloudFormation(properties.info),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnCloudFormationProductProvisioningArtifactPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('disableTemplateValidation', 'DisableTemplateValidation', properties.DisableTemplateValidation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableTemplateValidation) : undefined);
    ret.addPropertyResult('info', 'Info', cfn_parse.FromCloudFormation.getAny(properties.Info));
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnCloudFormationProvisionedProduct`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html
 */
export interface CfnCloudFormationProvisionedProductProps {

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * Passed to AWS CloudFormation . The SNS topic ARNs to which to publish stack-related events.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-notificationarns
     */
    readonly notificationArns?: string[];

    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
     *
     * > You must provide the name or ID, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathid
     */
    readonly pathId?: string;

    /**
     * The name of the path. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
     *
     * > You must provide the name or ID, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathname
     */
    readonly pathName?: string;

    /**
     * The product identifier.
     *
     * > You must specify either the ID or the name of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productid
     */
    readonly productId?: string;

    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     *
     * Each time a stack is created or updated, if `ProductName` is provided it will successfully resolve to `ProductId` as long as only one product exists in the account or Region with that `ProductName` .
     *
     * > You must specify either the name or the ID of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productname
     */
    readonly productName?: string;

    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisionedproductname
     */
    readonly provisionedProductName?: string;

    /**
     * The identifier of the provisioning artifact (also known as a version).
     *
     * > You must specify either the ID or the name of the provisioning artifact, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactid
     */
    readonly provisioningArtifactId?: string;

    /**
     * The name of the provisioning artifact (also known as a version) for the product. This name must be unique for the product.
     *
     * > You must specify either the name or the ID of the provisioning artifact, but not both. You must also specify either the name or the ID of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactname
     */
    readonly provisioningArtifactName?: string;

    /**
     * Parameters specified by the administrator that are required for provisioning the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameters
     */
    readonly provisioningParameters?: Array<CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * StackSet preferences that are required for provisioning the product or updating a provisioned product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences
     */
    readonly provisioningPreferences?: CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty | cdk.IResolvable;

    /**
     * One or more tags.
     *
     * > Requires the provisioned product to have an [ResourceUpdateConstraint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html) resource with `TagUpdatesOnProvisionedProduct` set to `ALLOWED` to allow tag updates. If `RESOURCE_UPDATE` constraint is not present, tags updates are ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCloudFormationProvisionedProductProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProvisionedProductProps`
 *
 * @returns the result of the validation.
 */
function CfnCloudFormationProvisionedProductPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('notificationArns', cdk.listValidator(cdk.validateString))(properties.notificationArns));
    errors.collect(cdk.propertyValidator('pathId', cdk.validateString)(properties.pathId));
    errors.collect(cdk.propertyValidator('pathName', cdk.validateString)(properties.pathName));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('productName', cdk.validateString)(properties.productName));
    errors.collect(cdk.propertyValidator('provisionedProductName', cdk.validateString)(properties.provisionedProductName));
    errors.collect(cdk.propertyValidator('provisioningArtifactId', cdk.validateString)(properties.provisioningArtifactId));
    errors.collect(cdk.propertyValidator('provisioningArtifactName', cdk.validateString)(properties.provisioningArtifactName));
    errors.collect(cdk.propertyValidator('provisioningParameters', cdk.listValidator(CfnCloudFormationProvisionedProduct_ProvisioningParameterPropertyValidator))(properties.provisioningParameters));
    errors.collect(cdk.propertyValidator('provisioningPreferences', CfnCloudFormationProvisionedProduct_ProvisioningPreferencesPropertyValidator)(properties.provisioningPreferences));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCloudFormationProvisionedProductProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct` resource
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProvisionedProductProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct` resource.
 */
// @ts-ignore TS6133
function cfnCloudFormationProvisionedProductPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFormationProvisionedProductPropsValidator(properties).assertSuccess();
    return {
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        NotificationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
        PathId: cdk.stringToCloudFormation(properties.pathId),
        PathName: cdk.stringToCloudFormation(properties.pathName),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        ProductName: cdk.stringToCloudFormation(properties.productName),
        ProvisionedProductName: cdk.stringToCloudFormation(properties.provisionedProductName),
        ProvisioningArtifactId: cdk.stringToCloudFormation(properties.provisioningArtifactId),
        ProvisioningArtifactName: cdk.stringToCloudFormation(properties.provisioningArtifactName),
        ProvisioningParameters: cdk.listMapper(cfnCloudFormationProvisionedProductProvisioningParameterPropertyToCloudFormation)(properties.provisioningParameters),
        ProvisioningPreferences: cfnCloudFormationProvisionedProductProvisioningPreferencesPropertyToCloudFormation(properties.provisioningPreferences),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProvisionedProductProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProductProps>();
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('notificationArns', 'NotificationArns', properties.NotificationArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotificationArns) : undefined);
    ret.addPropertyResult('pathId', 'PathId', properties.PathId != null ? cfn_parse.FromCloudFormation.getString(properties.PathId) : undefined);
    ret.addPropertyResult('pathName', 'PathName', properties.PathName != null ? cfn_parse.FromCloudFormation.getString(properties.PathName) : undefined);
    ret.addPropertyResult('productId', 'ProductId', properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined);
    ret.addPropertyResult('productName', 'ProductName', properties.ProductName != null ? cfn_parse.FromCloudFormation.getString(properties.ProductName) : undefined);
    ret.addPropertyResult('provisionedProductName', 'ProvisionedProductName', properties.ProvisionedProductName != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisionedProductName) : undefined);
    ret.addPropertyResult('provisioningArtifactId', 'ProvisioningArtifactId', properties.ProvisioningArtifactId != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactId) : undefined);
    ret.addPropertyResult('provisioningArtifactName', 'ProvisioningArtifactName', properties.ProvisioningArtifactName != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactName) : undefined);
    ret.addPropertyResult('provisioningParameters', 'ProvisioningParameters', properties.ProvisioningParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnCloudFormationProvisionedProductProvisioningParameterPropertyFromCloudFormation)(properties.ProvisioningParameters) : undefined);
    ret.addPropertyResult('provisioningPreferences', 'ProvisioningPreferences', properties.ProvisioningPreferences != null ? CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyFromCloudFormation(properties.ProvisioningPreferences) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::CloudFormationProvisionedProduct`
 *
 * Provisions the specified product.
 *
 * A provisioned product is a resourced instance of a product. For example, provisioning a product based on a AWS CloudFormation template launches a AWS CloudFormation stack and its underlying resources. You can check the status of this request using [DescribeRecord](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_DescribeRecord.html) .
 *
 * If the request contains a tag key with an empty list of values, there is a tag conflict for that key. Do not include conflicted keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[ *N* ]: *Value* ".
 *
 * @cloudformationResource AWS::ServiceCatalog::CloudFormationProvisionedProduct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html
 */
export class CfnCloudFormationProvisionedProduct extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::CloudFormationProvisionedProduct";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFormationProvisionedProduct {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCloudFormationProvisionedProductPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCloudFormationProvisionedProduct(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the CloudFormation stack, such as `arn:aws:cloudformation:eu-west-1:123456789012:stack/SC-499278721343-pp-hfyszaotincww/8f3df460-346a-11e8-9444-503abe701c29` .
     * @cloudformationAttribute CloudformationStackArn
     */
    public readonly attrCloudformationStackArn: string;

    /**
     * The output of the product you are provisioning. For example, the DNS of an EC2 instance.
     * @cloudformationAttribute Outputs
     */
    public readonly attrOutputs: cdk.IResolvable;

    /**
     * The ID of the provisioned product.
     * @cloudformationAttribute ProvisionedProductId
     */
    public readonly attrProvisionedProductId: string;

    /**
     * The ID of the record, such as `rec-rjeatvy434trk` .
     * @cloudformationAttribute RecordId
     */
    public readonly attrRecordId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * Passed to AWS CloudFormation . The SNS topic ARNs to which to publish stack-related events.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-notificationarns
     */
    public notificationArns: string[] | undefined;

    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
     *
     * > You must provide the name or ID, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathid
     */
    public pathId: string | undefined;

    /**
     * The name of the path. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
     *
     * > You must provide the name or ID, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathname
     */
    public pathName: string | undefined;

    /**
     * The product identifier.
     *
     * > You must specify either the ID or the name of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productid
     */
    public productId: string | undefined;

    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     *
     * Each time a stack is created or updated, if `ProductName` is provided it will successfully resolve to `ProductId` as long as only one product exists in the account or Region with that `ProductName` .
     *
     * > You must specify either the name or the ID of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productname
     */
    public productName: string | undefined;

    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisionedproductname
     */
    public provisionedProductName: string | undefined;

    /**
     * The identifier of the provisioning artifact (also known as a version).
     *
     * > You must specify either the ID or the name of the provisioning artifact, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactid
     */
    public provisioningArtifactId: string | undefined;

    /**
     * The name of the provisioning artifact (also known as a version) for the product. This name must be unique for the product.
     *
     * > You must specify either the name or the ID of the provisioning artifact, but not both. You must also specify either the name or the ID of the product, but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactname
     */
    public provisioningArtifactName: string | undefined;

    /**
     * Parameters specified by the administrator that are required for provisioning the product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameters
     */
    public provisioningParameters: Array<CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * StackSet preferences that are required for provisioning the product or updating a provisioned product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences
     */
    public provisioningPreferences: CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty | cdk.IResolvable | undefined;

    /**
     * One or more tags.
     *
     * > Requires the provisioned product to have an [ResourceUpdateConstraint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html) resource with `TagUpdatesOnProvisionedProduct` set to `ALLOWED` to allow tag updates. If `RESOURCE_UPDATE` constraint is not present, tags updates are ignored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ServiceCatalog::CloudFormationProvisionedProduct`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCloudFormationProvisionedProductProps = {}) {
        super(scope, id, { type: CfnCloudFormationProvisionedProduct.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrCloudformationStackArn = cdk.Token.asString(this.getAtt('CloudformationStackArn', cdk.ResolutionTypeHint.STRING));
        this.attrOutputs = this.getAtt('Outputs', cdk.ResolutionTypeHint.STRING);
        this.attrProvisionedProductId = cdk.Token.asString(this.getAtt('ProvisionedProductId', cdk.ResolutionTypeHint.STRING));
        this.attrRecordId = cdk.Token.asString(this.getAtt('RecordId', cdk.ResolutionTypeHint.STRING));

        this.acceptLanguage = props.acceptLanguage;
        this.notificationArns = props.notificationArns;
        this.pathId = props.pathId;
        this.pathName = props.pathName;
        this.productId = props.productId;
        this.productName = props.productName;
        this.provisionedProductName = props.provisionedProductName;
        this.provisioningArtifactId = props.provisioningArtifactId;
        this.provisioningArtifactName = props.provisioningArtifactName;
        this.provisioningParameters = props.provisioningParameters;
        this.provisioningPreferences = props.provisioningPreferences;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::CloudFormationProvisionedProduct", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFormationProvisionedProduct.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            acceptLanguage: this.acceptLanguage,
            notificationArns: this.notificationArns,
            pathId: this.pathId,
            pathName: this.pathName,
            productId: this.productId,
            productName: this.productName,
            provisionedProductName: this.provisionedProductName,
            provisioningArtifactId: this.provisioningArtifactId,
            provisioningArtifactName: this.provisioningArtifactName,
            provisioningParameters: this.provisioningParameters,
            provisioningPreferences: this.provisioningPreferences,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCloudFormationProvisionedProductPropsToCloudFormation(props);
    }
}

export namespace CfnCloudFormationProvisionedProduct {
    /**
     * Information about a parameter used to provision a product.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html
     */
    export interface ProvisioningParameterProperty {
        /**
         * The parameter key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-key
         */
        readonly key: string;
        /**
         * The parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisioningParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnCloudFormationProvisionedProduct_ProvisioningParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ProvisioningParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct.ProvisioningParameter` resource
 *
 * @param properties - the TypeScript properties of a `ProvisioningParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct.ProvisioningParameter` resource.
 */
// @ts-ignore TS6133
function cfnCloudFormationProvisionedProductProvisioningParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFormationProvisionedProduct_ProvisioningParameterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCloudFormationProvisionedProduct {
    /**
     * The user-defined preferences that will be applied when updating a provisioned product. Not all preferences are applicable to all provisioned product type
     *
     * One or more AWS accounts that will have access to the provisioned product.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * The AWS accounts specified should be within the list of accounts in the `STACKSET` constraint. To get the list of accounts in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
     *
     * If no values are specified, the default value is all accounts from the `STACKSET` constraint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html
     */
    export interface ProvisioningPreferencesProperty {
        /**
         * One or more AWS accounts where the provisioned product will be available.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * The specified accounts should be within the list of accounts from the `STACKSET` constraint. To get the list of accounts in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
         *
         * If no values are specified, the default value is all acounts from the `STACKSET` constraint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetaccounts
         */
        readonly stackSetAccounts?: string[];
        /**
         * The number of accounts, per Region, for which this operation can fail before AWS Service Catalog stops the operation in that Region. If the operation is stopped in a Region, AWS Service Catalog doesn't attempt the operation in any subsequent Regions.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * Conditional: You must specify either `StackSetFailureToleranceCount` or `StackSetFailureTolerancePercentage` , but not both.
         *
         * The default value is `0` if no value is specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetfailuretolerancecount
         */
        readonly stackSetFailureToleranceCount?: number;
        /**
         * The percentage of accounts, per Region, for which this stack operation can fail before AWS Service Catalog stops the operation in that Region. If the operation is stopped in a Region, AWS Service Catalog doesn't attempt the operation in any subsequent Regions.
         *
         * When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * Conditional: You must specify either `StackSetFailureToleranceCount` or `StackSetFailureTolerancePercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetfailuretolerancepercentage
         */
        readonly stackSetFailureTolerancePercentage?: number;
        /**
         * The maximum number of accounts in which to perform this operation at one time. This is dependent on the value of `StackSetFailureToleranceCount` . `StackSetMaxConcurrentCount` is at most one more than the `StackSetFailureToleranceCount` .
         *
         * Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * Conditional: You must specify either `StackSetMaxConcurrentCount` or `StackSetMaxConcurrentPercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetmaxconcurrencycount
         */
        readonly stackSetMaxConcurrencyCount?: number;
        /**
         * The maximum percentage of accounts in which to perform this operation at one time.
         *
         * When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, AWS Service Catalog sets the number as `1` instead.
         *
         * Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * Conditional: You must specify either `StackSetMaxConcurrentCount` or `StackSetMaxConcurrentPercentage` , but not both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetmaxconcurrencypercentage
         */
        readonly stackSetMaxConcurrencyPercentage?: number;
        /**
         * Determines what action AWS Service Catalog performs to a stack set or a stack instance represented by the provisioned product. The default value is `UPDATE` if nothing is specified.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * - **CREATE** - Creates a new stack instance in the stack set represented by the provisioned product. In this case, only new stack instances are created based on accounts and Regions; if new ProductId or ProvisioningArtifactID are passed, they will be ignored.
         * - **UPDATE** - Updates the stack set represented by the provisioned product and also its stack instances.
         * - **DELETE** - Deletes a stack instance in the stack set represented by the provisioned product.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetoperationtype
         */
        readonly stackSetOperationType?: string;
        /**
         * One or more AWS Regions where the provisioned product will be available.
         *
         * Applicable only to a `CFN_STACKSET` provisioned product type.
         *
         * The specified Regions should be within the list of Regions from the `STACKSET` constraint. To get the list of Regions in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
         *
         * If no values are specified, the default value is all Regions from the `STACKSET` constraint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetregions
         */
        readonly stackSetRegions?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ProvisioningPreferencesProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningPreferencesProperty`
 *
 * @returns the result of the validation.
 */
function CfnCloudFormationProvisionedProduct_ProvisioningPreferencesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('stackSetAccounts', cdk.listValidator(cdk.validateString))(properties.stackSetAccounts));
    errors.collect(cdk.propertyValidator('stackSetFailureToleranceCount', cdk.validateNumber)(properties.stackSetFailureToleranceCount));
    errors.collect(cdk.propertyValidator('stackSetFailureTolerancePercentage', cdk.validateNumber)(properties.stackSetFailureTolerancePercentage));
    errors.collect(cdk.propertyValidator('stackSetMaxConcurrencyCount', cdk.validateNumber)(properties.stackSetMaxConcurrencyCount));
    errors.collect(cdk.propertyValidator('stackSetMaxConcurrencyPercentage', cdk.validateNumber)(properties.stackSetMaxConcurrencyPercentage));
    errors.collect(cdk.propertyValidator('stackSetOperationType', cdk.validateString)(properties.stackSetOperationType));
    errors.collect(cdk.propertyValidator('stackSetRegions', cdk.listValidator(cdk.validateString))(properties.stackSetRegions));
    return errors.wrap('supplied properties not correct for "ProvisioningPreferencesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct.ProvisioningPreferences` resource
 *
 * @param properties - the TypeScript properties of a `ProvisioningPreferencesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::CloudFormationProvisionedProduct.ProvisioningPreferences` resource.
 */
// @ts-ignore TS6133
function cfnCloudFormationProvisionedProductProvisioningPreferencesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCloudFormationProvisionedProduct_ProvisioningPreferencesPropertyValidator(properties).assertSuccess();
    return {
        StackSetAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.stackSetAccounts),
        StackSetFailureToleranceCount: cdk.numberToCloudFormation(properties.stackSetFailureToleranceCount),
        StackSetFailureTolerancePercentage: cdk.numberToCloudFormation(properties.stackSetFailureTolerancePercentage),
        StackSetMaxConcurrencyCount: cdk.numberToCloudFormation(properties.stackSetMaxConcurrencyCount),
        StackSetMaxConcurrencyPercentage: cdk.numberToCloudFormation(properties.stackSetMaxConcurrencyPercentage),
        StackSetOperationType: cdk.stringToCloudFormation(properties.stackSetOperationType),
        StackSetRegions: cdk.listMapper(cdk.stringToCloudFormation)(properties.stackSetRegions),
    };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty>();
    ret.addPropertyResult('stackSetAccounts', 'StackSetAccounts', properties.StackSetAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StackSetAccounts) : undefined);
    ret.addPropertyResult('stackSetFailureToleranceCount', 'StackSetFailureToleranceCount', properties.StackSetFailureToleranceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetFailureToleranceCount) : undefined);
    ret.addPropertyResult('stackSetFailureTolerancePercentage', 'StackSetFailureTolerancePercentage', properties.StackSetFailureTolerancePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetFailureTolerancePercentage) : undefined);
    ret.addPropertyResult('stackSetMaxConcurrencyCount', 'StackSetMaxConcurrencyCount', properties.StackSetMaxConcurrencyCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetMaxConcurrencyCount) : undefined);
    ret.addPropertyResult('stackSetMaxConcurrencyPercentage', 'StackSetMaxConcurrencyPercentage', properties.StackSetMaxConcurrencyPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetMaxConcurrencyPercentage) : undefined);
    ret.addPropertyResult('stackSetOperationType', 'StackSetOperationType', properties.StackSetOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.StackSetOperationType) : undefined);
    ret.addPropertyResult('stackSetRegions', 'StackSetRegions', properties.StackSetRegions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StackSetRegions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnLaunchNotificationConstraint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html
 */
export interface CfnLaunchNotificationConstraintProps {

    /**
     * The notification ARNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-notificationarns
     */
    readonly notificationArns: string[];

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-productid
     */
    readonly productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchNotificationConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchNotificationConstraintProps`
 *
 * @returns the result of the validation.
 */
function CfnLaunchNotificationConstraintPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('notificationArns', cdk.requiredValidator)(properties.notificationArns));
    errors.collect(cdk.propertyValidator('notificationArns', cdk.listValidator(cdk.validateString))(properties.notificationArns));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    return errors.wrap('supplied properties not correct for "CfnLaunchNotificationConstraintProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchNotificationConstraint` resource
 *
 * @param properties - the TypeScript properties of a `CfnLaunchNotificationConstraintProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchNotificationConstraint` resource.
 */
// @ts-ignore TS6133
function cfnLaunchNotificationConstraintPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchNotificationConstraintPropsValidator(properties).assertSuccess();
    return {
        NotificationArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnLaunchNotificationConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchNotificationConstraintProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchNotificationConstraintProps>();
    ret.addPropertyResult('notificationArns', 'NotificationArns', cfn_parse.FromCloudFormation.getStringArray(properties.NotificationArns));
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::LaunchNotificationConstraint`
 *
 * Specifies a notification constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchNotificationConstraint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html
 */
export class CfnLaunchNotificationConstraint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::LaunchNotificationConstraint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchNotificationConstraint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLaunchNotificationConstraintPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLaunchNotificationConstraint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The notification ARNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-notificationarns
     */
    public notificationArns: string[];

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-productid
     */
    public productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::LaunchNotificationConstraint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchNotificationConstraintProps) {
        super(scope, id, { type: CfnLaunchNotificationConstraint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'notificationArns', this);
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);

        this.notificationArns = props.notificationArns;
        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchNotificationConstraint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            notificationArns: this.notificationArns,
            portfolioId: this.portfolioId,
            productId: this.productId,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLaunchNotificationConstraintPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLaunchRoleConstraint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html
 */
export interface CfnLaunchRoleConstraintProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-productid
     */
    readonly productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-description
     */
    readonly description?: string;

    /**
     * You are required to specify either the `RoleArn` or the `LocalRoleName` but can't use both.
     *
     * If you specify the `LocalRoleName` property, when an account uses the launch constraint, the IAM role with that name in the account will be used. This allows launch-role constraints to be account-agnostic so the administrator can create fewer resources per shared account.
     *
     * The given role name must exist in the account used to create the launch constraint and the account of the user who launches a product with this launch constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-localrolename
     */
    readonly localRoleName?: string;

    /**
     * The ARN of the launch role.
     *
     * You are required to specify `RoleArn` or `LocalRoleName` but can't use both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-rolearn
     */
    readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchRoleConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchRoleConstraintProps`
 *
 * @returns the result of the validation.
 */
function CfnLaunchRoleConstraintPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('localRoleName', cdk.validateString)(properties.localRoleName));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnLaunchRoleConstraintProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchRoleConstraint` resource
 *
 * @param properties - the TypeScript properties of a `CfnLaunchRoleConstraintProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchRoleConstraint` resource.
 */
// @ts-ignore TS6133
function cfnLaunchRoleConstraintPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchRoleConstraintPropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
        LocalRoleName: cdk.stringToCloudFormation(properties.localRoleName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnLaunchRoleConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchRoleConstraintProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchRoleConstraintProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('localRoleName', 'LocalRoleName', properties.LocalRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.LocalRoleName) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::LaunchRoleConstraint`
 *
 * Specifies a launch constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchRoleConstraint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html
 */
export class CfnLaunchRoleConstraint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::LaunchRoleConstraint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchRoleConstraint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLaunchRoleConstraintPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLaunchRoleConstraint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-productid
     */
    public productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-description
     */
    public description: string | undefined;

    /**
     * You are required to specify either the `RoleArn` or the `LocalRoleName` but can't use both.
     *
     * If you specify the `LocalRoleName` property, when an account uses the launch constraint, the IAM role with that name in the account will be used. This allows launch-role constraints to be account-agnostic so the administrator can create fewer resources per shared account.
     *
     * The given role name must exist in the account used to create the launch constraint and the account of the user who launches a product with this launch constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-localrolename
     */
    public localRoleName: string | undefined;

    /**
     * The ARN of the launch role.
     *
     * You are required to specify `RoleArn` or `LocalRoleName` but can't use both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::LaunchRoleConstraint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchRoleConstraintProps) {
        super(scope, id, { type: CfnLaunchRoleConstraint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);

        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
        this.localRoleName = props.localRoleName;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchRoleConstraint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            productId: this.productId,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
            localRoleName: this.localRoleName,
            roleArn: this.roleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLaunchRoleConstraintPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLaunchTemplateConstraint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html
 */
export interface CfnLaunchTemplateConstraintProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-productid
     */
    readonly productId: string;

    /**
     * The constraint rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-rules
     */
    readonly rules: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchTemplateConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchTemplateConstraintProps`
 *
 * @returns the result of the validation.
 */
function CfnLaunchTemplateConstraintPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('rules', cdk.requiredValidator)(properties.rules));
    errors.collect(cdk.propertyValidator('rules', cdk.validateString)(properties.rules));
    return errors.wrap('supplied properties not correct for "CfnLaunchTemplateConstraintProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchTemplateConstraint` resource
 *
 * @param properties - the TypeScript properties of a `CfnLaunchTemplateConstraintProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::LaunchTemplateConstraint` resource.
 */
// @ts-ignore TS6133
function cfnLaunchTemplateConstraintPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchTemplateConstraintPropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        Rules: cdk.stringToCloudFormation(properties.rules),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnLaunchTemplateConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchTemplateConstraintProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchTemplateConstraintProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('rules', 'Rules', cfn_parse.FromCloudFormation.getString(properties.Rules));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::LaunchTemplateConstraint`
 *
 * Specifies a template constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchTemplateConstraint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html
 */
export class CfnLaunchTemplateConstraint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::LaunchTemplateConstraint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchTemplateConstraint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLaunchTemplateConstraintPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLaunchTemplateConstraint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-productid
     */
    public productId: string;

    /**
     * The constraint rules.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-rules
     */
    public rules: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::LaunchTemplateConstraint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchTemplateConstraintProps) {
        super(scope, id, { type: CfnLaunchTemplateConstraint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);
        cdk.requireProperty(props, 'rules', this);

        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.rules = props.rules;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchTemplateConstraint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            productId: this.productId,
            rules: this.rules,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLaunchTemplateConstraintPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPortfolio`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html
 */
export interface CfnPortfolioProps {

    /**
     * The name to use for display purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-displayname
     */
    readonly displayName: string;

    /**
     * The name of the portfolio provider.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-providername
     */
    readonly providerName: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-description
     */
    readonly description?: string;

    /**
     * One or more tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProps`
 *
 * @returns the result of the validation.
 */
function CfnPortfolioPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('displayName', cdk.requiredValidator)(properties.displayName));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('providerName', cdk.requiredValidator)(properties.providerName));
    errors.collect(cdk.propertyValidator('providerName', cdk.validateString)(properties.providerName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPortfolioProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::Portfolio` resource
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::Portfolio` resource.
 */
// @ts-ignore TS6133
function cfnPortfolioPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortfolioPropsValidator(properties).assertSuccess();
    return {
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        ProviderName: cdk.stringToCloudFormation(properties.providerName),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPortfolioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioProps>();
    ret.addPropertyResult('displayName', 'DisplayName', cfn_parse.FromCloudFormation.getString(properties.DisplayName));
    ret.addPropertyResult('providerName', 'ProviderName', cfn_parse.FromCloudFormation.getString(properties.ProviderName));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::Portfolio`
 *
 * Specifies a portfolio.
 *
 * @cloudformationResource AWS::ServiceCatalog::Portfolio
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html
 */
export class CfnPortfolio extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::Portfolio";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolio {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPortfolioPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPortfolio(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the portfolio.
     * @cloudformationAttribute PortfolioName
     */
    public readonly attrPortfolioName: string;

    /**
     * The name to use for display purposes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-displayname
     */
    public displayName: string;

    /**
     * The name of the portfolio provider.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-providername
     */
    public providerName: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-description
     */
    public description: string | undefined;

    /**
     * One or more tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ServiceCatalog::Portfolio`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPortfolioProps) {
        super(scope, id, { type: CfnPortfolio.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'displayName', this);
        cdk.requireProperty(props, 'providerName', this);
        this.attrPortfolioName = cdk.Token.asString(this.getAtt('PortfolioName', cdk.ResolutionTypeHint.STRING));

        this.displayName = props.displayName;
        this.providerName = props.providerName;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::Portfolio", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolio.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            displayName: this.displayName,
            providerName: this.providerName,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPortfolioPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPortfolioPrincipalAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html
 */
export interface CfnPortfolioPrincipalAssociationProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The ARN of the principal (IAM user, role, or group). This field allows an ARN with no `accountID` if `PrincipalType` is `IAM_PATTERN` .
     *
     * You can associate multiple `IAM` patterns even if the account has no principal with that name. This is useful in Principal Name Sharing if you want to share a principal without creating it in the account that owns the portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principalarn
     */
    readonly principalArn: string;

    /**
     * The principal type. The supported value is `IAM` if you use a fully defined ARN, or `IAM_PATTERN` if you use an ARN with no `accountID` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principaltype
     */
    readonly principalType: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-acceptlanguage
     */
    readonly acceptLanguage?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioPrincipalAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioPrincipalAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnPortfolioPrincipalAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('principalArn', cdk.requiredValidator)(properties.principalArn));
    errors.collect(cdk.propertyValidator('principalArn', cdk.validateString)(properties.principalArn));
    errors.collect(cdk.propertyValidator('principalType', cdk.requiredValidator)(properties.principalType));
    errors.collect(cdk.propertyValidator('principalType', cdk.validateString)(properties.principalType));
    return errors.wrap('supplied properties not correct for "CfnPortfolioPrincipalAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioPrincipalAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioPrincipalAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioPrincipalAssociation` resource.
 */
// @ts-ignore TS6133
function cfnPortfolioPrincipalAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortfolioPrincipalAssociationPropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        PrincipalARN: cdk.stringToCloudFormation(properties.principalArn),
        PrincipalType: cdk.stringToCloudFormation(properties.principalType),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
    };
}

// @ts-ignore TS6133
function CfnPortfolioPrincipalAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioPrincipalAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioPrincipalAssociationProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('principalArn', 'PrincipalARN', cfn_parse.FromCloudFormation.getString(properties.PrincipalARN));
    ret.addPropertyResult('principalType', 'PrincipalType', cfn_parse.FromCloudFormation.getString(properties.PrincipalType));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::PortfolioPrincipalAssociation`
 *
 * Associates the specified principal ARN with the specified portfolio.
 *
 * If you share the portfolio with principal name sharing enabled, the `PrincipalARN` association is included in the share.
 *
 * The `PortfolioID` , `PrincipalARN` , and `PrincipalType` parameters are required.
 *
 * You can associate a maximum of 10 Principals with a portfolio using `PrincipalType` as `IAM_PATTERN`
 *
 * > When you associate a principal with portfolio, a potential privilege escalation path may occur when that portfolio is then shared with other accounts. For a user in a recipient account who is *not* an AWS Service Catalog Admin, but still has the ability to create Principals (Users/Groups/Roles), that user could create a role that matches a principal name association for the portfolio. Although this user may not know which principal names are associated through AWS Service Catalog , they may be able to guess the user. If this potential escalation path is a concern, then AWS Service Catalog recommends using `PrincipalType` as `IAM` . With this configuration, the `PrincipalARN` must already exist in the recipient account before it can be associated.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioPrincipalAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html
 */
export class CfnPortfolioPrincipalAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::PortfolioPrincipalAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioPrincipalAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPortfolioPrincipalAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPortfolioPrincipalAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-portfolioid
     */
    public portfolioId: string;

    /**
     * The ARN of the principal (IAM user, role, or group). This field allows an ARN with no `accountID` if `PrincipalType` is `IAM_PATTERN` .
     *
     * You can associate multiple `IAM` patterns even if the account has no principal with that name. This is useful in Principal Name Sharing if you want to share a principal without creating it in the account that owns the portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principalarn
     */
    public principalArn: string;

    /**
     * The principal type. The supported value is `IAM` if you use a fully defined ARN, or `IAM_PATTERN` if you use an ARN with no `accountID` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principaltype
     */
    public principalType: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::PortfolioPrincipalAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPortfolioPrincipalAssociationProps) {
        super(scope, id, { type: CfnPortfolioPrincipalAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'principalArn', this);
        cdk.requireProperty(props, 'principalType', this);

        this.portfolioId = props.portfolioId;
        this.principalArn = props.principalArn;
        this.principalType = props.principalType;
        this.acceptLanguage = props.acceptLanguage;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioPrincipalAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            principalArn: this.principalArn,
            principalType: this.principalType,
            acceptLanguage: this.acceptLanguage,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPortfolioPrincipalAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPortfolioProductAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html
 */
export interface CfnPortfolioProductAssociationProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-productid
     */
    readonly productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The identifier of the source portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-sourceportfolioid
     */
    readonly sourcePortfolioId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioProductAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProductAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnPortfolioProductAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('sourcePortfolioId', cdk.validateString)(properties.sourcePortfolioId));
    return errors.wrap('supplied properties not correct for "CfnPortfolioProductAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioProductAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProductAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioProductAssociation` resource.
 */
// @ts-ignore TS6133
function cfnPortfolioProductAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortfolioProductAssociationPropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        SourcePortfolioId: cdk.stringToCloudFormation(properties.sourcePortfolioId),
    };
}

// @ts-ignore TS6133
function CfnPortfolioProductAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioProductAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioProductAssociationProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('sourcePortfolioId', 'SourcePortfolioId', properties.SourcePortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePortfolioId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::PortfolioProductAssociation`
 *
 * Associates the specified product with the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioProductAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html
 */
export class CfnPortfolioProductAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::PortfolioProductAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioProductAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPortfolioProductAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPortfolioProductAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-productid
     */
    public productId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The identifier of the source portfolio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-sourceportfolioid
     */
    public sourcePortfolioId: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::PortfolioProductAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPortfolioProductAssociationProps) {
        super(scope, id, { type: CfnPortfolioProductAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);

        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.acceptLanguage = props.acceptLanguage;
        this.sourcePortfolioId = props.sourcePortfolioId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioProductAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            productId: this.productId,
            acceptLanguage: this.acceptLanguage,
            sourcePortfolioId: this.sourcePortfolioId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPortfolioProductAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPortfolioShare`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html
 */
export interface CfnPortfolioShareProps {

    /**
     * The AWS account ID. For example, `123456789012` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-accountid
     */
    readonly accountId: string;

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * Indicates whether TagOptions sharing is enabled or disabled for the portfolio share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-sharetagoptions
     */
    readonly shareTagOptions?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioShareProps`
 *
 * @returns the result of the validation.
 */
function CfnPortfolioSharePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('accountId', cdk.requiredValidator)(properties.accountId));
    errors.collect(cdk.propertyValidator('accountId', cdk.validateString)(properties.accountId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('shareTagOptions', cdk.validateBoolean)(properties.shareTagOptions));
    return errors.wrap('supplied properties not correct for "CfnPortfolioShareProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioShare` resource
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioShareProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::PortfolioShare` resource.
 */
// @ts-ignore TS6133
function cfnPortfolioSharePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortfolioSharePropsValidator(properties).assertSuccess();
    return {
        AccountId: cdk.stringToCloudFormation(properties.accountId),
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        ShareTagOptions: cdk.booleanToCloudFormation(properties.shareTagOptions),
    };
}

// @ts-ignore TS6133
function CfnPortfolioSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioShareProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioShareProps>();
    ret.addPropertyResult('accountId', 'AccountId', cfn_parse.FromCloudFormation.getString(properties.AccountId));
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('shareTagOptions', 'ShareTagOptions', properties.ShareTagOptions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ShareTagOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::PortfolioShare`
 *
 * Shares the specified portfolio with the specified account.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioShare
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html
 */
export class CfnPortfolioShare extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::PortfolioShare";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioShare {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPortfolioSharePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPortfolioShare(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AWS account ID. For example, `123456789012` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-accountid
     */
    public accountId: string;

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-portfolioid
     */
    public portfolioId: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * Indicates whether TagOptions sharing is enabled or disabled for the portfolio share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-sharetagoptions
     */
    public shareTagOptions: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::PortfolioShare`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPortfolioShareProps) {
        super(scope, id, { type: CfnPortfolioShare.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accountId', this);
        cdk.requireProperty(props, 'portfolioId', this);

        this.accountId = props.accountId;
        this.portfolioId = props.portfolioId;
        this.acceptLanguage = props.acceptLanguage;
        this.shareTagOptions = props.shareTagOptions;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioShare.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountId: this.accountId,
            portfolioId: this.portfolioId,
            acceptLanguage: this.acceptLanguage,
            shareTagOptions: this.shareTagOptions,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPortfolioSharePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnResourceUpdateConstraint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html
 */
export interface CfnResourceUpdateConstraintProps {

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-productid
     */
    readonly productId: string;

    /**
     * If set to `ALLOWED` , lets users change tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
     *
     * If set to `NOT_ALLOWED` , prevents users from changing tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-tagupdateonprovisionedproduct
     */
    readonly tagUpdateOnProvisionedProduct: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceUpdateConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceUpdateConstraintProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceUpdateConstraintPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('tagUpdateOnProvisionedProduct', cdk.requiredValidator)(properties.tagUpdateOnProvisionedProduct));
    errors.collect(cdk.propertyValidator('tagUpdateOnProvisionedProduct', cdk.validateString)(properties.tagUpdateOnProvisionedProduct));
    return errors.wrap('supplied properties not correct for "CfnResourceUpdateConstraintProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::ResourceUpdateConstraint` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceUpdateConstraintProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::ResourceUpdateConstraint` resource.
 */
// @ts-ignore TS6133
function cfnResourceUpdateConstraintPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceUpdateConstraintPropsValidator(properties).assertSuccess();
    return {
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        TagUpdateOnProvisionedProduct: cdk.stringToCloudFormation(properties.tagUpdateOnProvisionedProduct),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnResourceUpdateConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceUpdateConstraintProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceUpdateConstraintProps>();
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('tagUpdateOnProvisionedProduct', 'TagUpdateOnProvisionedProduct', cfn_parse.FromCloudFormation.getString(properties.TagUpdateOnProvisionedProduct));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::ResourceUpdateConstraint`
 *
 * Specifies a `RESOURCE_UPDATE` constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::ResourceUpdateConstraint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html
 */
export class CfnResourceUpdateConstraint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::ResourceUpdateConstraint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceUpdateConstraint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourceUpdateConstraintPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceUpdateConstraint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-productid
     */
    public productId: string;

    /**
     * If set to `ALLOWED` , lets users change tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
     *
     * If set to `NOT_ALLOWED` , prevents users from changing tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-tagupdateonprovisionedproduct
     */
    public tagUpdateOnProvisionedProduct: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::ResourceUpdateConstraint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceUpdateConstraintProps) {
        super(scope, id, { type: CfnResourceUpdateConstraint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);
        cdk.requireProperty(props, 'tagUpdateOnProvisionedProduct', this);

        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.tagUpdateOnProvisionedProduct = props.tagUpdateOnProvisionedProduct;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceUpdateConstraint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portfolioId: this.portfolioId,
            productId: this.productId,
            tagUpdateOnProvisionedProduct: this.tagUpdateOnProvisionedProduct,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceUpdateConstraintPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnServiceAction`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html
 */
export interface CfnServiceActionProps {

    /**
     * A map that defines the self-service action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definition
     */
    readonly definition: Array<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The self-service action definition type. For example, `SSM_AUTOMATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definitiontype
     */
    readonly definitionType: string;

    /**
     * The self-service action name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-name
     */
    readonly name: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-acceptlanguage
     */
    readonly acceptLanguage?: string;

    /**
     * The self-service action description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionProps`
 *
 * @returns the result of the validation.
 */
function CfnServiceActionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('definition', cdk.requiredValidator)(properties.definition));
    errors.collect(cdk.propertyValidator('definition', cdk.listValidator(CfnServiceAction_DefinitionParameterPropertyValidator))(properties.definition));
    errors.collect(cdk.propertyValidator('definitionType', cdk.requiredValidator)(properties.definitionType));
    errors.collect(cdk.propertyValidator('definitionType', cdk.validateString)(properties.definitionType));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CfnServiceActionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceAction` resource
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceAction` resource.
 */
// @ts-ignore TS6133
function cfnServiceActionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServiceActionPropsValidator(properties).assertSuccess();
    return {
        Definition: cdk.listMapper(cfnServiceActionDefinitionParameterPropertyToCloudFormation)(properties.definition),
        DefinitionType: cdk.stringToCloudFormation(properties.definitionType),
        Name: cdk.stringToCloudFormation(properties.name),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnServiceActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceActionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceActionProps>();
    ret.addPropertyResult('definition', 'Definition', cfn_parse.FromCloudFormation.getArray(CfnServiceActionDefinitionParameterPropertyFromCloudFormation)(properties.Definition));
    ret.addPropertyResult('definitionType', 'DefinitionType', cfn_parse.FromCloudFormation.getString(properties.DefinitionType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::ServiceAction`
 *
 * Creates a self-service action.
 *
 * @cloudformationResource AWS::ServiceCatalog::ServiceAction
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html
 */
export class CfnServiceAction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::ServiceAction";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceAction {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnServiceActionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnServiceAction(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The self-service action identifier. For example, `act-fs7abcd89wxyz` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A map that defines the self-service action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definition
     */
    public definition: Array<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The self-service action definition type. For example, `SSM_AUTOMATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definitiontype
     */
    public definitionType: string;

    /**
     * The self-service action name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-name
     */
    public name: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * The self-service action description.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::ServiceAction`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServiceActionProps) {
        super(scope, id, { type: CfnServiceAction.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'definition', this);
        cdk.requireProperty(props, 'definitionType', this);
        cdk.requireProperty(props, 'name', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.definition = props.definition;
        this.definitionType = props.definitionType;
        this.name = props.name;
        this.acceptLanguage = props.acceptLanguage;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceAction.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            definition: this.definition,
            definitionType: this.definitionType,
            name: this.name,
            acceptLanguage: this.acceptLanguage,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnServiceActionPropsToCloudFormation(props);
    }
}

export namespace CfnServiceAction {
    /**
     * The list of parameters in JSON format. For example: `[{\"Name\":\"InstanceId\",\"Type\":\"TARGET\"}] or [{\"Name\":\"InstanceId\",\"Type\":\"TEXT_VALUE\"}]` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html
     */
    export interface DefinitionParameterProperty {
        /**
         * The parameter key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html#cfn-servicecatalog-serviceaction-definitionparameter-key
         */
        readonly key: string;
        /**
         * The value of the parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html#cfn-servicecatalog-serviceaction-definitionparameter-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefinitionParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnServiceAction_DefinitionParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "DefinitionParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceAction.DefinitionParameter` resource
 *
 * @param properties - the TypeScript properties of a `DefinitionParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceAction.DefinitionParameter` resource.
 */
// @ts-ignore TS6133
function cfnServiceActionDefinitionParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServiceAction_DefinitionParameterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnServiceActionDefinitionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceAction.DefinitionParameterProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnServiceActionAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html
 */
export interface CfnServiceActionAssociationProps {

    /**
     * The product identifier. For example, `prod-abcdzk7xy33qa` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-productid
     */
    readonly productId: string;

    /**
     * The identifier of the provisioning artifact. For example, `pa-4abcdjnxjj6ne` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-provisioningartifactid
     */
    readonly provisioningArtifactId: string;

    /**
     * The self-service action identifier. For example, `act-fs7abcd89wxyz` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-serviceactionid
     */
    readonly serviceActionId: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceActionAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnServiceActionAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('provisioningArtifactId', cdk.requiredValidator)(properties.provisioningArtifactId));
    errors.collect(cdk.propertyValidator('provisioningArtifactId', cdk.validateString)(properties.provisioningArtifactId));
    errors.collect(cdk.propertyValidator('serviceActionId', cdk.requiredValidator)(properties.serviceActionId));
    errors.collect(cdk.propertyValidator('serviceActionId', cdk.validateString)(properties.serviceActionId));
    return errors.wrap('supplied properties not correct for "CfnServiceActionAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceActionAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::ServiceActionAssociation` resource.
 */
// @ts-ignore TS6133
function cfnServiceActionAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServiceActionAssociationPropsValidator(properties).assertSuccess();
    return {
        ProductId: cdk.stringToCloudFormation(properties.productId),
        ProvisioningArtifactId: cdk.stringToCloudFormation(properties.provisioningArtifactId),
        ServiceActionId: cdk.stringToCloudFormation(properties.serviceActionId),
    };
}

// @ts-ignore TS6133
function CfnServiceActionAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceActionAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceActionAssociationProps>();
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('provisioningArtifactId', 'ProvisioningArtifactId', cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactId));
    ret.addPropertyResult('serviceActionId', 'ServiceActionId', cfn_parse.FromCloudFormation.getString(properties.ServiceActionId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::ServiceActionAssociation`
 *
 * A self-service action association consisting of the Action ID, the Product ID, and the Provisioning Artifact ID.
 *
 * @cloudformationResource AWS::ServiceCatalog::ServiceActionAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html
 */
export class CfnServiceActionAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::ServiceActionAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceActionAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnServiceActionAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnServiceActionAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The product identifier. For example, `prod-abcdzk7xy33qa` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-productid
     */
    public productId: string;

    /**
     * The identifier of the provisioning artifact. For example, `pa-4abcdjnxjj6ne` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-provisioningartifactid
     */
    public provisioningArtifactId: string;

    /**
     * The self-service action identifier. For example, `act-fs7abcd89wxyz` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-serviceactionid
     */
    public serviceActionId: string;

    /**
     * Create a new `AWS::ServiceCatalog::ServiceActionAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServiceActionAssociationProps) {
        super(scope, id, { type: CfnServiceActionAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'productId', this);
        cdk.requireProperty(props, 'provisioningArtifactId', this);
        cdk.requireProperty(props, 'serviceActionId', this);

        this.productId = props.productId;
        this.provisioningArtifactId = props.provisioningArtifactId;
        this.serviceActionId = props.serviceActionId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceActionAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            productId: this.productId,
            provisioningArtifactId: this.provisioningArtifactId,
            serviceActionId: this.serviceActionId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnServiceActionAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnStackSetConstraint`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html
 */
export interface CfnStackSetConstraintProps {

    /**
     * One or more AWS accounts that will have access to the provisioned product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-accountlist
     */
    readonly accountList: string[];

    /**
     * AdminRole ARN
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-adminrole
     */
    readonly adminRole: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-description
     */
    readonly description: string;

    /**
     * ExecutionRole name
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-executionrole
     */
    readonly executionRole: string;

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-portfolioid
     */
    readonly portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-productid
     */
    readonly productId: string;

    /**
     * One or more AWS Regions where the provisioned product will be available.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * The specified Regions should be within the list of Regions from the `STACKSET` constraint. To get the list of Regions in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
     *
     * If no values are specified, the default value is all Regions from the `STACKSET` constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-regionlist
     */
    readonly regionList: string[];

    /**
     * Permission to create, update, and delete stack instances. Choose from ALLOWED and NOT_ALLOWED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-stackinstancecontrol
     */
    readonly stackInstanceControl: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-acceptlanguage
     */
    readonly acceptLanguage?: string;
}

/**
 * Determine whether the given properties match those of a `CfnStackSetConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackSetConstraintProps`
 *
 * @returns the result of the validation.
 */
function CfnStackSetConstraintPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acceptLanguage', cdk.validateString)(properties.acceptLanguage));
    errors.collect(cdk.propertyValidator('accountList', cdk.requiredValidator)(properties.accountList));
    errors.collect(cdk.propertyValidator('accountList', cdk.listValidator(cdk.validateString))(properties.accountList));
    errors.collect(cdk.propertyValidator('adminRole', cdk.requiredValidator)(properties.adminRole));
    errors.collect(cdk.propertyValidator('adminRole', cdk.validateString)(properties.adminRole));
    errors.collect(cdk.propertyValidator('description', cdk.requiredValidator)(properties.description));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('executionRole', cdk.requiredValidator)(properties.executionRole));
    errors.collect(cdk.propertyValidator('executionRole', cdk.validateString)(properties.executionRole));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.requiredValidator)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('portfolioId', cdk.validateString)(properties.portfolioId));
    errors.collect(cdk.propertyValidator('productId', cdk.requiredValidator)(properties.productId));
    errors.collect(cdk.propertyValidator('productId', cdk.validateString)(properties.productId));
    errors.collect(cdk.propertyValidator('regionList', cdk.requiredValidator)(properties.regionList));
    errors.collect(cdk.propertyValidator('regionList', cdk.listValidator(cdk.validateString))(properties.regionList));
    errors.collect(cdk.propertyValidator('stackInstanceControl', cdk.requiredValidator)(properties.stackInstanceControl));
    errors.collect(cdk.propertyValidator('stackInstanceControl', cdk.validateString)(properties.stackInstanceControl));
    return errors.wrap('supplied properties not correct for "CfnStackSetConstraintProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::StackSetConstraint` resource
 *
 * @param properties - the TypeScript properties of a `CfnStackSetConstraintProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::StackSetConstraint` resource.
 */
// @ts-ignore TS6133
function cfnStackSetConstraintPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStackSetConstraintPropsValidator(properties).assertSuccess();
    return {
        AccountList: cdk.listMapper(cdk.stringToCloudFormation)(properties.accountList),
        AdminRole: cdk.stringToCloudFormation(properties.adminRole),
        Description: cdk.stringToCloudFormation(properties.description),
        ExecutionRole: cdk.stringToCloudFormation(properties.executionRole),
        PortfolioId: cdk.stringToCloudFormation(properties.portfolioId),
        ProductId: cdk.stringToCloudFormation(properties.productId),
        RegionList: cdk.listMapper(cdk.stringToCloudFormation)(properties.regionList),
        StackInstanceControl: cdk.stringToCloudFormation(properties.stackInstanceControl),
        AcceptLanguage: cdk.stringToCloudFormation(properties.acceptLanguage),
    };
}

// @ts-ignore TS6133
function CfnStackSetConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackSetConstraintProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSetConstraintProps>();
    ret.addPropertyResult('accountList', 'AccountList', cfn_parse.FromCloudFormation.getStringArray(properties.AccountList));
    ret.addPropertyResult('adminRole', 'AdminRole', cfn_parse.FromCloudFormation.getString(properties.AdminRole));
    ret.addPropertyResult('description', 'Description', cfn_parse.FromCloudFormation.getString(properties.Description));
    ret.addPropertyResult('executionRole', 'ExecutionRole', cfn_parse.FromCloudFormation.getString(properties.ExecutionRole));
    ret.addPropertyResult('portfolioId', 'PortfolioId', cfn_parse.FromCloudFormation.getString(properties.PortfolioId));
    ret.addPropertyResult('productId', 'ProductId', cfn_parse.FromCloudFormation.getString(properties.ProductId));
    ret.addPropertyResult('regionList', 'RegionList', cfn_parse.FromCloudFormation.getStringArray(properties.RegionList));
    ret.addPropertyResult('stackInstanceControl', 'StackInstanceControl', cfn_parse.FromCloudFormation.getString(properties.StackInstanceControl));
    ret.addPropertyResult('acceptLanguage', 'AcceptLanguage', properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::StackSetConstraint`
 *
 * Specifies a StackSet constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::StackSetConstraint
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html
 */
export class CfnStackSetConstraint extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::StackSetConstraint";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackSetConstraint {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStackSetConstraintPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStackSetConstraint(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * One or more AWS accounts that will have access to the provisioned product.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-accountlist
     */
    public accountList: string[];

    /**
     * AdminRole ARN
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-adminrole
     */
    public adminRole: string;

    /**
     * The description of the constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-description
     */
    public description: string;

    /**
     * ExecutionRole name
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-executionrole
     */
    public executionRole: string;

    /**
     * The portfolio identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-portfolioid
     */
    public portfolioId: string;

    /**
     * The product identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-productid
     */
    public productId: string;

    /**
     * One or more AWS Regions where the provisioned product will be available.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * The specified Regions should be within the list of Regions from the `STACKSET` constraint. To get the list of Regions in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
     *
     * If no values are specified, the default value is all Regions from the `STACKSET` constraint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-regionlist
     */
    public regionList: string[];

    /**
     * Permission to create, update, and delete stack instances. Choose from ALLOWED and NOT_ALLOWED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-stackinstancecontrol
     */
    public stackInstanceControl: string;

    /**
     * The language code.
     *
     * - `en` - English (default)
     * - `jp` - Japanese
     * - `zh` - Chinese
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-acceptlanguage
     */
    public acceptLanguage: string | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::StackSetConstraint`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStackSetConstraintProps) {
        super(scope, id, { type: CfnStackSetConstraint.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accountList', this);
        cdk.requireProperty(props, 'adminRole', this);
        cdk.requireProperty(props, 'description', this);
        cdk.requireProperty(props, 'executionRole', this);
        cdk.requireProperty(props, 'portfolioId', this);
        cdk.requireProperty(props, 'productId', this);
        cdk.requireProperty(props, 'regionList', this);
        cdk.requireProperty(props, 'stackInstanceControl', this);

        this.accountList = props.accountList;
        this.adminRole = props.adminRole;
        this.description = props.description;
        this.executionRole = props.executionRole;
        this.portfolioId = props.portfolioId;
        this.productId = props.productId;
        this.regionList = props.regionList;
        this.stackInstanceControl = props.stackInstanceControl;
        this.acceptLanguage = props.acceptLanguage;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStackSetConstraint.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountList: this.accountList,
            adminRole: this.adminRole,
            description: this.description,
            executionRole: this.executionRole,
            portfolioId: this.portfolioId,
            productId: this.productId,
            regionList: this.regionList,
            stackInstanceControl: this.stackInstanceControl,
            acceptLanguage: this.acceptLanguage,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStackSetConstraintPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTagOption`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html
 */
export interface CfnTagOptionProps {

    /**
     * The TagOption key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-key
     */
    readonly key: string;

    /**
     * The TagOption value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-value
     */
    readonly value: string;

    /**
     * The TagOption active state.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-active
     */
    readonly active?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnTagOptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionProps`
 *
 * @returns the result of the validation.
 */
function CfnTagOptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('active', cdk.validateBoolean)(properties.active));
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CfnTagOptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::TagOption` resource
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::TagOption` resource.
 */
// @ts-ignore TS6133
function cfnTagOptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagOptionPropsValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
        Active: cdk.booleanToCloudFormation(properties.active),
    };
}

// @ts-ignore TS6133
function CfnTagOptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagOptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagOptionProps>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addPropertyResult('active', 'Active', properties.Active != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Active) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::TagOption`
 *
 * Specifies a TagOption. A TagOption is a key-value pair managed by AWS Service Catalog that serves as a template for creating an AWS tag.
 *
 * @cloudformationResource AWS::ServiceCatalog::TagOption
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html
 */
export class CfnTagOption extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::TagOption";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTagOption {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTagOptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTagOption(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The TagOption key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-key
     */
    public key: string;

    /**
     * The TagOption value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-value
     */
    public value: string;

    /**
     * The TagOption active state.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-active
     */
    public active: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::ServiceCatalog::TagOption`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTagOptionProps) {
        super(scope, id, { type: CfnTagOption.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'key', this);
        cdk.requireProperty(props, 'value', this);

        this.key = props.key;
        this.value = props.value;
        this.active = props.active;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagOption.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            key: this.key,
            value: this.value,
            active: this.active,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTagOptionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTagOptionAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html
 */
export interface CfnTagOptionAssociationProps {

    /**
     * The resource identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-resourceid
     */
    readonly resourceId: string;

    /**
     * The TagOption identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-tagoptionid
     */
    readonly tagOptionId: string;
}

/**
 * Determine whether the given properties match those of a `CfnTagOptionAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnTagOptionAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceId', cdk.requiredValidator)(properties.resourceId));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    errors.collect(cdk.propertyValidator('tagOptionId', cdk.requiredValidator)(properties.tagOptionId));
    errors.collect(cdk.propertyValidator('tagOptionId', cdk.validateString)(properties.tagOptionId));
    return errors.wrap('supplied properties not correct for "CfnTagOptionAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ServiceCatalog::TagOptionAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ServiceCatalog::TagOptionAssociation` resource.
 */
// @ts-ignore TS6133
function cfnTagOptionAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTagOptionAssociationPropsValidator(properties).assertSuccess();
    return {
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
        TagOptionId: cdk.stringToCloudFormation(properties.tagOptionId),
    };
}

// @ts-ignore TS6133
function CfnTagOptionAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagOptionAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagOptionAssociationProps>();
    ret.addPropertyResult('resourceId', 'ResourceId', cfn_parse.FromCloudFormation.getString(properties.ResourceId));
    ret.addPropertyResult('tagOptionId', 'TagOptionId', cfn_parse.FromCloudFormation.getString(properties.TagOptionId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ServiceCatalog::TagOptionAssociation`
 *
 * Associate the specified TagOption with the specified portfolio or product.
 *
 * @cloudformationResource AWS::ServiceCatalog::TagOptionAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html
 */
export class CfnTagOptionAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceCatalog::TagOptionAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTagOptionAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTagOptionAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTagOptionAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The resource identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-resourceid
     */
    public resourceId: string;

    /**
     * The TagOption identifier.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-tagoptionid
     */
    public tagOptionId: string;

    /**
     * Create a new `AWS::ServiceCatalog::TagOptionAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTagOptionAssociationProps) {
        super(scope, id, { type: CfnTagOptionAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceId', this);
        cdk.requireProperty(props, 'tagOptionId', this);

        this.resourceId = props.resourceId;
        this.tagOptionId = props.tagOptionId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagOptionAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourceId: this.resourceId,
            tagOptionId: this.tagOptionId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTagOptionAssociationPropsToCloudFormation(props);
    }
}
