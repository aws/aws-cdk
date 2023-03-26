// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:01.072Z","fingerprint":"JAwdNSV80ZM71KgIF2O9Sc4Ss727q+T+fhcl3HVCujw="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnSkill`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html
 */
export interface CfnSkillProps {

    /**
     * Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon clients created through the  are supported. The client ID, client secret, and refresh token are required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-authenticationconfiguration
     */
    readonly authenticationConfiguration: CfnSkill.AuthenticationConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. For more information about the skill package format, see the  .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-skillpackage
     */
    readonly skillPackage: CfnSkill.SkillPackageProperty | cdk.IResolvable;

    /**
     * The vendor ID associated with the Amazon developer account that will host the skill. Details for retrieving the vendor ID are in  . The provided LWA credentials must be linked to the developer account associated with this vendor ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-vendorid
     */
    readonly vendorId: string;
}

/**
 * Determine whether the given properties match those of a `CfnSkillProps`
 *
 * @param properties - the TypeScript properties of a `CfnSkillProps`
 *
 * @returns the result of the validation.
 */
function CfnSkillPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationConfiguration', cdk.requiredValidator)(properties.authenticationConfiguration));
    errors.collect(cdk.propertyValidator('authenticationConfiguration', CfnSkill_AuthenticationConfigurationPropertyValidator)(properties.authenticationConfiguration));
    errors.collect(cdk.propertyValidator('skillPackage', cdk.requiredValidator)(properties.skillPackage));
    errors.collect(cdk.propertyValidator('skillPackage', CfnSkill_SkillPackagePropertyValidator)(properties.skillPackage));
    errors.collect(cdk.propertyValidator('vendorId', cdk.requiredValidator)(properties.vendorId));
    errors.collect(cdk.propertyValidator('vendorId', cdk.validateString)(properties.vendorId));
    return errors.wrap('supplied properties not correct for "CfnSkillProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `Alexa::ASK::Skill` resource
 *
 * @param properties - the TypeScript properties of a `CfnSkillProps`
 *
 * @returns the AWS CloudFormation properties of an `Alexa::ASK::Skill` resource.
 */
// @ts-ignore TS6133
function cfnSkillPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSkillPropsValidator(properties).assertSuccess();
    return {
        AuthenticationConfiguration: cfnSkillAuthenticationConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
        SkillPackage: cfnSkillSkillPackagePropertyToCloudFormation(properties.skillPackage),
        VendorId: cdk.stringToCloudFormation(properties.vendorId),
    };
}

// @ts-ignore TS6133
function CfnSkillPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSkillProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSkillProps>();
    ret.addPropertyResult('authenticationConfiguration', 'AuthenticationConfiguration', CfnSkillAuthenticationConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration));
    ret.addPropertyResult('skillPackage', 'SkillPackage', CfnSkillSkillPackagePropertyFromCloudFormation(properties.SkillPackage));
    ret.addPropertyResult('vendorId', 'VendorId', cfn_parse.FromCloudFormation.getString(properties.VendorId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `Alexa::ASK::Skill`
 *
 * The `Alexa::ASK::Skill` resource creates an Alexa skill that enables customers to access new abilities. For more information about developing a skill, see the  .
 *
 * @cloudformationResource Alexa::ASK::Skill
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html
 */
export class CfnSkill extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "Alexa::ASK::Skill";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSkill {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSkillPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSkill(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon clients created through the  are supported. The client ID, client secret, and refresh token are required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-authenticationconfiguration
     */
    public authenticationConfiguration: CfnSkill.AuthenticationConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. For more information about the skill package format, see the  .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-skillpackage
     */
    public skillPackage: CfnSkill.SkillPackageProperty | cdk.IResolvable;

    /**
     * The vendor ID associated with the Amazon developer account that will host the skill. Details for retrieving the vendor ID are in  . The provided LWA credentials must be linked to the developer account associated with this vendor ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-vendorid
     */
    public vendorId: string;

    /**
     * Create a new `Alexa::ASK::Skill`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSkillProps) {
        super(scope, id, { type: CfnSkill.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'authenticationConfiguration', this);
        cdk.requireProperty(props, 'skillPackage', this);
        cdk.requireProperty(props, 'vendorId', this);

        this.authenticationConfiguration = props.authenticationConfiguration;
        this.skillPackage = props.skillPackage;
        this.vendorId = props.vendorId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSkill.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            authenticationConfiguration: this.authenticationConfiguration,
            skillPackage: this.skillPackage,
            vendorId: this.vendorId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSkillPropsToCloudFormation(props);
    }
}

export namespace CfnSkill {
    /**
     * The `AuthenticationConfiguration` property type specifies the Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon security profiles created through the  are supported for authentication. A client ID, client secret, and refresh token are required. You can generate a client ID and client secret by creating a new  on the Amazon Developer Portal or you can retrieve them from an existing profile. You can then retrieve the refresh token using the Alexa Skills Kit CLI. For instructions, see  in the  .
     *
     * `AuthenticationConfiguration` is a property of the `Alexa::ASK::Skill` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html
     */
    export interface AuthenticationConfigurationProperty {
        /**
         * Client ID from Login with Amazon (LWA).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-clientid
         */
        readonly clientId: string;
        /**
         * Client secret from Login with Amazon (LWA).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Refresh token from Login with Amazon (LWA). This token is secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-refreshtoken
         */
        readonly refreshToken: string;
    }
}

/**
 * Determine whether the given properties match those of a `AuthenticationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSkill_AuthenticationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientId', cdk.requiredValidator)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.requiredValidator)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.validateString)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('refreshToken', cdk.requiredValidator)(properties.refreshToken));
    errors.collect(cdk.propertyValidator('refreshToken', cdk.validateString)(properties.refreshToken));
    return errors.wrap('supplied properties not correct for "AuthenticationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `Alexa::ASK::Skill.AuthenticationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `Alexa::ASK::Skill.AuthenticationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSkillAuthenticationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSkill_AuthenticationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        ClientSecret: cdk.stringToCloudFormation(properties.clientSecret),
        RefreshToken: cdk.stringToCloudFormation(properties.refreshToken),
    };
}

// @ts-ignore TS6133
function CfnSkillAuthenticationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSkill.AuthenticationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSkill.AuthenticationConfigurationProperty>();
    ret.addPropertyResult('clientId', 'ClientId', cfn_parse.FromCloudFormation.getString(properties.ClientId));
    ret.addPropertyResult('clientSecret', 'ClientSecret', cfn_parse.FromCloudFormation.getString(properties.ClientSecret));
    ret.addPropertyResult('refreshToken', 'RefreshToken', cfn_parse.FromCloudFormation.getString(properties.RefreshToken));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSkill {
    /**
     * The `Overrides` property type provides overrides to the skill package to apply when creating or updating the skill. Values provided here do not modify the contents of the original skill package. Currently, only overriding values inside of the skill manifest component of the package is supported.
     *
     * `Overrides` is a property of the `Alexa::ASK::Skill SkillPackage` property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-overrides.html
     */
    export interface OverridesProperty {
        /**
         * Overrides to apply to the skill manifest inside of the skill package. The skill manifest contains metadata about the skill. For more information, see  .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-overrides.html#cfn-ask-skill-overrides-manifest
         */
        readonly manifest?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OverridesProperty`
 *
 * @param properties - the TypeScript properties of a `OverridesProperty`
 *
 * @returns the result of the validation.
 */
function CfnSkill_OverridesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifest', cdk.validateObject)(properties.manifest));
    return errors.wrap('supplied properties not correct for "OverridesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `Alexa::ASK::Skill.Overrides` resource
 *
 * @param properties - the TypeScript properties of a `OverridesProperty`
 *
 * @returns the AWS CloudFormation properties of an `Alexa::ASK::Skill.Overrides` resource.
 */
// @ts-ignore TS6133
function cfnSkillOverridesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSkill_OverridesPropertyValidator(properties).assertSuccess();
    return {
        Manifest: cdk.objectToCloudFormation(properties.manifest),
    };
}

// @ts-ignore TS6133
function CfnSkillOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSkill.OverridesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSkill.OverridesProperty>();
    ret.addPropertyResult('manifest', 'Manifest', properties.Manifest != null ? cfn_parse.FromCloudFormation.getAny(properties.Manifest) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSkill {
    /**
     * The `SkillPackage` property type contains configuration details for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. More details about the skill package format are located in the  .
     *
     * `SkillPackage` is a property of the `Alexa::ASK::Skill` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html
     */
    export interface SkillPackageProperty {
        /**
         * Overrides to the skill package to apply when creating or updating the skill. Values provided here do not modify the contents of the original skill package. Currently, only overriding values inside of the skill manifest component of the package is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-overrides
         */
        readonly overrides?: CfnSkill.OverridesProperty | cdk.IResolvable;
        /**
         * The name of the Amazon S3 bucket where the .zip file that contains the skill package is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * ARN of the IAM role that grants the Alexa service ( `alexa-appkit.amazon.com` ) permission to access the bucket and retrieve the skill package. This property is optional. If you do not provide it, the bucket must be publicly accessible or configured with a policy that allows this access. Otherwise, AWS CloudFormation cannot create the skill.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3bucketrole
         */
        readonly s3BucketRole?: string;
        /**
         * The location and name of the skill package .zip file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3key
         */
        readonly s3Key: string;
        /**
         * If you have S3 versioning enabled, the version ID of the skill package.zip file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3objectversion
         */
        readonly s3ObjectVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SkillPackageProperty`
 *
 * @param properties - the TypeScript properties of a `SkillPackageProperty`
 *
 * @returns the result of the validation.
 */
function CfnSkill_SkillPackagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('overrides', CfnSkill_OverridesPropertyValidator)(properties.overrides));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3BucketRole', cdk.validateString)(properties.s3BucketRole));
    errors.collect(cdk.propertyValidator('s3Key', cdk.requiredValidator)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3Key', cdk.validateString)(properties.s3Key));
    errors.collect(cdk.propertyValidator('s3ObjectVersion', cdk.validateString)(properties.s3ObjectVersion));
    return errors.wrap('supplied properties not correct for "SkillPackageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `Alexa::ASK::Skill.SkillPackage` resource
 *
 * @param properties - the TypeScript properties of a `SkillPackageProperty`
 *
 * @returns the AWS CloudFormation properties of an `Alexa::ASK::Skill.SkillPackage` resource.
 */
// @ts-ignore TS6133
function cfnSkillSkillPackagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSkill_SkillPackagePropertyValidator(properties).assertSuccess();
    return {
        Overrides: cfnSkillOverridesPropertyToCloudFormation(properties.overrides),
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3BucketRole: cdk.stringToCloudFormation(properties.s3BucketRole),
        S3Key: cdk.stringToCloudFormation(properties.s3Key),
        S3ObjectVersion: cdk.stringToCloudFormation(properties.s3ObjectVersion),
    };
}

// @ts-ignore TS6133
function CfnSkillSkillPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSkill.SkillPackageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSkill.SkillPackageProperty>();
    ret.addPropertyResult('overrides', 'Overrides', properties.Overrides != null ? CfnSkillOverridesPropertyFromCloudFormation(properties.Overrides) : undefined);
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3BucketRole', 'S3BucketRole', properties.S3BucketRole != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketRole) : undefined);
    ret.addPropertyResult('s3Key', 'S3Key', cfn_parse.FromCloudFormation.getString(properties.S3Key));
    ret.addPropertyResult('s3ObjectVersion', 'S3ObjectVersion', properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
