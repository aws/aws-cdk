// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:58.492Z","fingerprint":"0YzRSYFwBp8PyoiAaJvRRrR5LJeG9070udOA1Oe3K8o="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnGrant`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export interface CfnGrantProps {

    /**
     * Allowed operations for the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-allowedoperations
     */
    readonly allowedOperations?: string[];

    /**
     * Grant name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-grantname
     */
    readonly grantName?: string;

    /**
     * Home Region of the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-homeregion
     */
    readonly homeRegion?: string;

    /**
     * License ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-licensearn
     */
    readonly licenseArn?: string;

    /**
     * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):
     *
     * - An AWS account, which includes only the account specified.
     *
     * - An organizational unit (OU), which includes all accounts in the OU.
     *
     * - An organization, which will include all accounts across your organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-principals
     */
    readonly principals?: string[];

    /**
     * Granted license status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-status
     */
    readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGrantProps`
 *
 * @param properties - the TypeScript properties of a `CfnGrantProps`
 *
 * @returns the result of the validation.
 */
function CfnGrantPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedOperations', cdk.listValidator(cdk.validateString))(properties.allowedOperations));
    errors.collect(cdk.propertyValidator('grantName', cdk.validateString)(properties.grantName));
    errors.collect(cdk.propertyValidator('homeRegion', cdk.validateString)(properties.homeRegion));
    errors.collect(cdk.propertyValidator('licenseArn', cdk.validateString)(properties.licenseArn));
    errors.collect(cdk.propertyValidator('principals', cdk.listValidator(cdk.validateString))(properties.principals));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    return errors.wrap('supplied properties not correct for "CfnGrantProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::Grant` resource
 *
 * @param properties - the TypeScript properties of a `CfnGrantProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::Grant` resource.
 */
// @ts-ignore TS6133
function cfnGrantPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGrantPropsValidator(properties).assertSuccess();
    return {
        AllowedOperations: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOperations),
        GrantName: cdk.stringToCloudFormation(properties.grantName),
        HomeRegion: cdk.stringToCloudFormation(properties.homeRegion),
        LicenseArn: cdk.stringToCloudFormation(properties.licenseArn),
        Principals: cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnGrantPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGrantProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGrantProps>();
    ret.addPropertyResult('allowedOperations', 'AllowedOperations', properties.AllowedOperations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedOperations) : undefined);
    ret.addPropertyResult('grantName', 'GrantName', properties.GrantName != null ? cfn_parse.FromCloudFormation.getString(properties.GrantName) : undefined);
    ret.addPropertyResult('homeRegion', 'HomeRegion', properties.HomeRegion != null ? cfn_parse.FromCloudFormation.getString(properties.HomeRegion) : undefined);
    ret.addPropertyResult('licenseArn', 'LicenseArn', properties.LicenseArn != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseArn) : undefined);
    ret.addPropertyResult('principals', 'Principals', properties.Principals != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Principals) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LicenseManager::Grant`
 *
 * Specifies a grant.
 *
 * A grant shares the use of license entitlements with specific AWS accounts . For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::Grant
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export class CfnGrant extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LicenseManager::Grant";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGrant {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGrantPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGrant(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the grant.
     * @cloudformationAttribute GrantArn
     */
    public readonly attrGrantArn: string;

    /**
     * The grant version.
     * @cloudformationAttribute Version
     */
    public readonly attrVersion: string;

    /**
     * Allowed operations for the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-allowedoperations
     */
    public allowedOperations: string[] | undefined;

    /**
     * Grant name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-grantname
     */
    public grantName: string | undefined;

    /**
     * Home Region of the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-homeregion
     */
    public homeRegion: string | undefined;

    /**
     * License ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-licensearn
     */
    public licenseArn: string | undefined;

    /**
     * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):
     *
     * - An AWS account, which includes only the account specified.
     *
     * - An organizational unit (OU), which includes all accounts in the OU.
     *
     * - An organization, which will include all accounts across your organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-principals
     */
    public principals: string[] | undefined;

    /**
     * Granted license status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-status
     */
    public status: string | undefined;

    /**
     * Create a new `AWS::LicenseManager::Grant`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGrantProps = {}) {
        super(scope, id, { type: CfnGrant.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrGrantArn = cdk.Token.asString(this.getAtt('GrantArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersion = cdk.Token.asString(this.getAtt('Version', cdk.ResolutionTypeHint.STRING));

        this.allowedOperations = props.allowedOperations;
        this.grantName = props.grantName;
        this.homeRegion = props.homeRegion;
        this.licenseArn = props.licenseArn;
        this.principals = props.principals;
        this.status = props.status;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGrant.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            allowedOperations: this.allowedOperations,
            grantName: this.grantName,
            homeRegion: this.homeRegion,
            licenseArn: this.licenseArn,
            principals: this.principals,
            status: this.status,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGrantPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnLicense`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export interface CfnLicenseProps {

    /**
     * Configuration for consumption of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-consumptionconfiguration
     */
    readonly consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;

    /**
     * License entitlements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-entitlements
     */
    readonly entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Home Region of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-homeregion
     */
    readonly homeRegion: string;

    /**
     * License issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-issuer
     */
    readonly issuer: CfnLicense.IssuerDataProperty | cdk.IResolvable;

    /**
     * License name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensename
     */
    readonly licenseName: string;

    /**
     * Product name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productname
     */
    readonly productName: string;

    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-validity
     */
    readonly validity: CfnLicense.ValidityDateFormatProperty | cdk.IResolvable;

    /**
     * License beneficiary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-beneficiary
     */
    readonly beneficiary?: string;

    /**
     * License metadata.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensemetadata
     */
    readonly licenseMetadata?: Array<CfnLicense.MetadataProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Product SKU.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productsku
     */
    readonly productSku?: string;

    /**
     * License status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-status
     */
    readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLicenseProps`
 *
 * @param properties - the TypeScript properties of a `CfnLicenseProps`
 *
 * @returns the result of the validation.
 */
function CfnLicensePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('beneficiary', cdk.validateString)(properties.beneficiary));
    errors.collect(cdk.propertyValidator('consumptionConfiguration', cdk.requiredValidator)(properties.consumptionConfiguration));
    errors.collect(cdk.propertyValidator('consumptionConfiguration', CfnLicense_ConsumptionConfigurationPropertyValidator)(properties.consumptionConfiguration));
    errors.collect(cdk.propertyValidator('entitlements', cdk.requiredValidator)(properties.entitlements));
    errors.collect(cdk.propertyValidator('entitlements', cdk.listValidator(CfnLicense_EntitlementPropertyValidator))(properties.entitlements));
    errors.collect(cdk.propertyValidator('homeRegion', cdk.requiredValidator)(properties.homeRegion));
    errors.collect(cdk.propertyValidator('homeRegion', cdk.validateString)(properties.homeRegion));
    errors.collect(cdk.propertyValidator('issuer', cdk.requiredValidator)(properties.issuer));
    errors.collect(cdk.propertyValidator('issuer', CfnLicense_IssuerDataPropertyValidator)(properties.issuer));
    errors.collect(cdk.propertyValidator('licenseMetadata', cdk.listValidator(CfnLicense_MetadataPropertyValidator))(properties.licenseMetadata));
    errors.collect(cdk.propertyValidator('licenseName', cdk.requiredValidator)(properties.licenseName));
    errors.collect(cdk.propertyValidator('licenseName', cdk.validateString)(properties.licenseName));
    errors.collect(cdk.propertyValidator('productName', cdk.requiredValidator)(properties.productName));
    errors.collect(cdk.propertyValidator('productName', cdk.validateString)(properties.productName));
    errors.collect(cdk.propertyValidator('productSku', cdk.validateString)(properties.productSku));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('validity', cdk.requiredValidator)(properties.validity));
    errors.collect(cdk.propertyValidator('validity', CfnLicense_ValidityDateFormatPropertyValidator)(properties.validity));
    return errors.wrap('supplied properties not correct for "CfnLicenseProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License` resource
 *
 * @param properties - the TypeScript properties of a `CfnLicenseProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License` resource.
 */
// @ts-ignore TS6133
function cfnLicensePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicensePropsValidator(properties).assertSuccess();
    return {
        ConsumptionConfiguration: cfnLicenseConsumptionConfigurationPropertyToCloudFormation(properties.consumptionConfiguration),
        Entitlements: cdk.listMapper(cfnLicenseEntitlementPropertyToCloudFormation)(properties.entitlements),
        HomeRegion: cdk.stringToCloudFormation(properties.homeRegion),
        Issuer: cfnLicenseIssuerDataPropertyToCloudFormation(properties.issuer),
        LicenseName: cdk.stringToCloudFormation(properties.licenseName),
        ProductName: cdk.stringToCloudFormation(properties.productName),
        Validity: cfnLicenseValidityDateFormatPropertyToCloudFormation(properties.validity),
        Beneficiary: cdk.stringToCloudFormation(properties.beneficiary),
        LicenseMetadata: cdk.listMapper(cfnLicenseMetadataPropertyToCloudFormation)(properties.licenseMetadata),
        ProductSKU: cdk.stringToCloudFormation(properties.productSku),
        Status: cdk.stringToCloudFormation(properties.status),
    };
}

// @ts-ignore TS6133
function CfnLicensePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicenseProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicenseProps>();
    ret.addPropertyResult('consumptionConfiguration', 'ConsumptionConfiguration', CfnLicenseConsumptionConfigurationPropertyFromCloudFormation(properties.ConsumptionConfiguration));
    ret.addPropertyResult('entitlements', 'Entitlements', cfn_parse.FromCloudFormation.getArray(CfnLicenseEntitlementPropertyFromCloudFormation)(properties.Entitlements));
    ret.addPropertyResult('homeRegion', 'HomeRegion', cfn_parse.FromCloudFormation.getString(properties.HomeRegion));
    ret.addPropertyResult('issuer', 'Issuer', CfnLicenseIssuerDataPropertyFromCloudFormation(properties.Issuer));
    ret.addPropertyResult('licenseName', 'LicenseName', cfn_parse.FromCloudFormation.getString(properties.LicenseName));
    ret.addPropertyResult('productName', 'ProductName', cfn_parse.FromCloudFormation.getString(properties.ProductName));
    ret.addPropertyResult('validity', 'Validity', CfnLicenseValidityDateFormatPropertyFromCloudFormation(properties.Validity));
    ret.addPropertyResult('beneficiary', 'Beneficiary', properties.Beneficiary != null ? cfn_parse.FromCloudFormation.getString(properties.Beneficiary) : undefined);
    ret.addPropertyResult('licenseMetadata', 'LicenseMetadata', properties.LicenseMetadata != null ? cfn_parse.FromCloudFormation.getArray(CfnLicenseMetadataPropertyFromCloudFormation)(properties.LicenseMetadata) : undefined);
    ret.addPropertyResult('productSku', 'ProductSKU', properties.ProductSKU != null ? cfn_parse.FromCloudFormation.getString(properties.ProductSKU) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::LicenseManager::License`
 *
 * Specifies a granted license.
 *
 * Granted licenses are licenses for products that your organization purchased from AWS Marketplace or directly from a seller who integrated their software with managed entitlements. For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::License
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export class CfnLicense extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LicenseManager::License";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLicense {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLicensePropsFromCloudFormation(resourceProperties);
        const ret = new CfnLicense(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the license.
     * @cloudformationAttribute LicenseArn
     */
    public readonly attrLicenseArn: string;

    /**
     * The license version.
     * @cloudformationAttribute Version
     */
    public readonly attrVersion: string;

    /**
     * Configuration for consumption of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-consumptionconfiguration
     */
    public consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;

    /**
     * License entitlements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-entitlements
     */
    public entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Home Region of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-homeregion
     */
    public homeRegion: string;

    /**
     * License issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-issuer
     */
    public issuer: CfnLicense.IssuerDataProperty | cdk.IResolvable;

    /**
     * License name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensename
     */
    public licenseName: string;

    /**
     * Product name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productname
     */
    public productName: string;

    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-validity
     */
    public validity: CfnLicense.ValidityDateFormatProperty | cdk.IResolvable;

    /**
     * License beneficiary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-beneficiary
     */
    public beneficiary: string | undefined;

    /**
     * License metadata.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensemetadata
     */
    public licenseMetadata: Array<CfnLicense.MetadataProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Product SKU.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productsku
     */
    public productSku: string | undefined;

    /**
     * License status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-status
     */
    public status: string | undefined;

    /**
     * Create a new `AWS::LicenseManager::License`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLicenseProps) {
        super(scope, id, { type: CfnLicense.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'consumptionConfiguration', this);
        cdk.requireProperty(props, 'entitlements', this);
        cdk.requireProperty(props, 'homeRegion', this);
        cdk.requireProperty(props, 'issuer', this);
        cdk.requireProperty(props, 'licenseName', this);
        cdk.requireProperty(props, 'productName', this);
        cdk.requireProperty(props, 'validity', this);
        this.attrLicenseArn = cdk.Token.asString(this.getAtt('LicenseArn', cdk.ResolutionTypeHint.STRING));
        this.attrVersion = cdk.Token.asString(this.getAtt('Version', cdk.ResolutionTypeHint.STRING));

        this.consumptionConfiguration = props.consumptionConfiguration;
        this.entitlements = props.entitlements;
        this.homeRegion = props.homeRegion;
        this.issuer = props.issuer;
        this.licenseName = props.licenseName;
        this.productName = props.productName;
        this.validity = props.validity;
        this.beneficiary = props.beneficiary;
        this.licenseMetadata = props.licenseMetadata;
        this.productSku = props.productSku;
        this.status = props.status;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLicense.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            consumptionConfiguration: this.consumptionConfiguration,
            entitlements: this.entitlements,
            homeRegion: this.homeRegion,
            issuer: this.issuer,
            licenseName: this.licenseName,
            productName: this.productName,
            validity: this.validity,
            beneficiary: this.beneficiary,
            licenseMetadata: this.licenseMetadata,
            productSku: this.productSku,
            status: this.status,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLicensePropsToCloudFormation(props);
    }
}

export namespace CfnLicense {
    /**
     * Details about a borrow configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html
     */
    export interface BorrowConfigurationProperty {
        /**
         * Indicates whether early check-ins are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-allowearlycheckin
         */
        readonly allowEarlyCheckIn: boolean | cdk.IResolvable;
        /**
         * Maximum time for the borrow configuration, in minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-maxtimetoliveinminutes
         */
        readonly maxTimeToLiveInMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `BorrowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `BorrowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_BorrowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowEarlyCheckIn', cdk.requiredValidator)(properties.allowEarlyCheckIn));
    errors.collect(cdk.propertyValidator('allowEarlyCheckIn', cdk.validateBoolean)(properties.allowEarlyCheckIn));
    errors.collect(cdk.propertyValidator('maxTimeToLiveInMinutes', cdk.requiredValidator)(properties.maxTimeToLiveInMinutes));
    errors.collect(cdk.propertyValidator('maxTimeToLiveInMinutes', cdk.validateNumber)(properties.maxTimeToLiveInMinutes));
    return errors.wrap('supplied properties not correct for "BorrowConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.BorrowConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `BorrowConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.BorrowConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLicenseBorrowConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_BorrowConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowEarlyCheckIn: cdk.booleanToCloudFormation(properties.allowEarlyCheckIn),
        MaxTimeToLiveInMinutes: cdk.numberToCloudFormation(properties.maxTimeToLiveInMinutes),
    };
}

// @ts-ignore TS6133
function CfnLicenseBorrowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.BorrowConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.BorrowConfigurationProperty>();
    ret.addPropertyResult('allowEarlyCheckIn', 'AllowEarlyCheckIn', cfn_parse.FromCloudFormation.getBoolean(properties.AllowEarlyCheckIn));
    ret.addPropertyResult('maxTimeToLiveInMinutes', 'MaxTimeToLiveInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.MaxTimeToLiveInMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Details about a consumption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html
     */
    export interface ConsumptionConfigurationProperty {
        /**
         * Details about a borrow configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-borrowconfiguration
         */
        readonly borrowConfiguration?: CfnLicense.BorrowConfigurationProperty | cdk.IResolvable;
        /**
         * Details about a provisional configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-provisionalconfiguration
         */
        readonly provisionalConfiguration?: CfnLicense.ProvisionalConfigurationProperty | cdk.IResolvable;
        /**
         * Renewal frequency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-renewtype
         */
        readonly renewType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConsumptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConsumptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_ConsumptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('borrowConfiguration', CfnLicense_BorrowConfigurationPropertyValidator)(properties.borrowConfiguration));
    errors.collect(cdk.propertyValidator('provisionalConfiguration', CfnLicense_ProvisionalConfigurationPropertyValidator)(properties.provisionalConfiguration));
    errors.collect(cdk.propertyValidator('renewType', cdk.validateString)(properties.renewType));
    return errors.wrap('supplied properties not correct for "ConsumptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.ConsumptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ConsumptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.ConsumptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLicenseConsumptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_ConsumptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BorrowConfiguration: cfnLicenseBorrowConfigurationPropertyToCloudFormation(properties.borrowConfiguration),
        ProvisionalConfiguration: cfnLicenseProvisionalConfigurationPropertyToCloudFormation(properties.provisionalConfiguration),
        RenewType: cdk.stringToCloudFormation(properties.renewType),
    };
}

// @ts-ignore TS6133
function CfnLicenseConsumptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ConsumptionConfigurationProperty>();
    ret.addPropertyResult('borrowConfiguration', 'BorrowConfiguration', properties.BorrowConfiguration != null ? CfnLicenseBorrowConfigurationPropertyFromCloudFormation(properties.BorrowConfiguration) : undefined);
    ret.addPropertyResult('provisionalConfiguration', 'ProvisionalConfiguration', properties.ProvisionalConfiguration != null ? CfnLicenseProvisionalConfigurationPropertyFromCloudFormation(properties.ProvisionalConfiguration) : undefined);
    ret.addPropertyResult('renewType', 'RenewType', properties.RenewType != null ? cfn_parse.FromCloudFormation.getString(properties.RenewType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Describes a resource entitled for use with a license.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html
     */
    export interface EntitlementProperty {
        /**
         * Indicates whether check-ins are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-allowcheckin
         */
        readonly allowCheckIn?: boolean | cdk.IResolvable;
        /**
         * Maximum entitlement count. Use if the unit is not None.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-maxcount
         */
        readonly maxCount?: number;
        /**
         * Entitlement name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-name
         */
        readonly name: string;
        /**
         * Indicates whether overages are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-overage
         */
        readonly overage?: boolean | cdk.IResolvable;
        /**
         * Entitlement unit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-unit
         */
        readonly unit: string;
        /**
         * Entitlement resource. Use only if the unit is None.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EntitlementProperty`
 *
 * @param properties - the TypeScript properties of a `EntitlementProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_EntitlementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowCheckIn', cdk.validateBoolean)(properties.allowCheckIn));
    errors.collect(cdk.propertyValidator('maxCount', cdk.validateNumber)(properties.maxCount));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overage', cdk.validateBoolean)(properties.overage));
    errors.collect(cdk.propertyValidator('unit', cdk.requiredValidator)(properties.unit));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "EntitlementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.Entitlement` resource
 *
 * @param properties - the TypeScript properties of a `EntitlementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.Entitlement` resource.
 */
// @ts-ignore TS6133
function cfnLicenseEntitlementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_EntitlementPropertyValidator(properties).assertSuccess();
    return {
        AllowCheckIn: cdk.booleanToCloudFormation(properties.allowCheckIn),
        MaxCount: cdk.numberToCloudFormation(properties.maxCount),
        Name: cdk.stringToCloudFormation(properties.name),
        Overage: cdk.booleanToCloudFormation(properties.overage),
        Unit: cdk.stringToCloudFormation(properties.unit),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnLicenseEntitlementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.EntitlementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.EntitlementProperty>();
    ret.addPropertyResult('allowCheckIn', 'AllowCheckIn', properties.AllowCheckIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCheckIn) : undefined);
    ret.addPropertyResult('maxCount', 'MaxCount', properties.MaxCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCount) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('overage', 'Overage', properties.Overage != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Overage) : undefined);
    ret.addPropertyResult('unit', 'Unit', cfn_parse.FromCloudFormation.getString(properties.Unit));
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Details associated with the issuer of a license.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html
     */
    export interface IssuerDataProperty {
        /**
         * Issuer name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-name
         */
        readonly name: string;
        /**
         * Asymmetric KMS key from AWS Key Management Service . The KMS key must have a key usage of sign and verify, and support the RSASSA-PSS SHA-256 signing algorithm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-signkey
         */
        readonly signKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IssuerDataProperty`
 *
 * @param properties - the TypeScript properties of a `IssuerDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_IssuerDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('signKey', cdk.validateString)(properties.signKey));
    return errors.wrap('supplied properties not correct for "IssuerDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.IssuerData` resource
 *
 * @param properties - the TypeScript properties of a `IssuerDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.IssuerData` resource.
 */
// @ts-ignore TS6133
function cfnLicenseIssuerDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_IssuerDataPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SignKey: cdk.stringToCloudFormation(properties.signKey),
    };
}

// @ts-ignore TS6133
function CfnLicenseIssuerDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.IssuerDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.IssuerDataProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('signKey', 'SignKey', properties.SignKey != null ? cfn_parse.FromCloudFormation.getString(properties.SignKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Describes key/value pairs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html
     */
    export interface MetadataProperty {
        /**
         * The key name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-name
         */
        readonly name: string;
        /**
         * The value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `MetadataProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_MetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "MetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.Metadata` resource
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.Metadata` resource.
 */
// @ts-ignore TS6133
function cfnLicenseMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_MetadataPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnLicenseMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.MetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.MetadataProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Details about a provisional configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html
     */
    export interface ProvisionalConfigurationProperty {
        /**
         * Maximum time for the provisional configuration, in minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html#cfn-licensemanager-license-provisionalconfiguration-maxtimetoliveinminutes
         */
        readonly maxTimeToLiveInMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `ProvisionalConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionalConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_ProvisionalConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxTimeToLiveInMinutes', cdk.requiredValidator)(properties.maxTimeToLiveInMinutes));
    errors.collect(cdk.propertyValidator('maxTimeToLiveInMinutes', cdk.validateNumber)(properties.maxTimeToLiveInMinutes));
    return errors.wrap('supplied properties not correct for "ProvisionalConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.ProvisionalConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ProvisionalConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.ProvisionalConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLicenseProvisionalConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_ProvisionalConfigurationPropertyValidator(properties).assertSuccess();
    return {
        MaxTimeToLiveInMinutes: cdk.numberToCloudFormation(properties.maxTimeToLiveInMinutes),
    };
}

// @ts-ignore TS6133
function CfnLicenseProvisionalConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.ProvisionalConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ProvisionalConfigurationProperty>();
    ret.addPropertyResult('maxTimeToLiveInMinutes', 'MaxTimeToLiveInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.MaxTimeToLiveInMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLicense {
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html
     */
    export interface ValidityDateFormatProperty {
        /**
         * Start of the time range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-begin
         */
        readonly begin: string;
        /**
         * End of the time range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-end
         */
        readonly end: string;
    }
}

/**
 * Determine whether the given properties match those of a `ValidityDateFormatProperty`
 *
 * @param properties - the TypeScript properties of a `ValidityDateFormatProperty`
 *
 * @returns the result of the validation.
 */
function CfnLicense_ValidityDateFormatPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('begin', cdk.requiredValidator)(properties.begin));
    errors.collect(cdk.propertyValidator('begin', cdk.validateString)(properties.begin));
    errors.collect(cdk.propertyValidator('end', cdk.requiredValidator)(properties.end));
    errors.collect(cdk.propertyValidator('end', cdk.validateString)(properties.end));
    return errors.wrap('supplied properties not correct for "ValidityDateFormatProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::LicenseManager::License.ValidityDateFormat` resource
 *
 * @param properties - the TypeScript properties of a `ValidityDateFormatProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::LicenseManager::License.ValidityDateFormat` resource.
 */
// @ts-ignore TS6133
function cfnLicenseValidityDateFormatPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLicense_ValidityDateFormatPropertyValidator(properties).assertSuccess();
    return {
        Begin: cdk.stringToCloudFormation(properties.begin),
        End: cdk.stringToCloudFormation(properties.end),
    };
}

// @ts-ignore TS6133
function CfnLicenseValidityDateFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.ValidityDateFormatProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ValidityDateFormatProperty>();
    ret.addPropertyResult('begin', 'Begin', cfn_parse.FromCloudFormation.getString(properties.Begin));
    ret.addPropertyResult('end', 'End', cfn_parse.FromCloudFormation.getString(properties.End));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
