// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-11T07:32:48.762Z","fingerprint":"DFEJ5Cv/5h3EDyDMDb3zu6Eph1oAJGRKHriuxr7ov50="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnProfilePermission`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html
 */
export interface CfnProfilePermissionProps {

    /**
     * The AWS Signer action permitted as part of cross-account permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-action
     */
    readonly action: string;

    /**
     * The AWS principal receiving cross-account permissions. This may be an IAM role or another AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-principal
     */
    readonly principal: string;

    /**
     * The human-readable name of the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profilename
     */
    readonly profileName: string;

    /**
     * A unique identifier for the cross-account permission statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-statementid
     */
    readonly statementId: string;

    /**
     * The version of the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profileversion
     */
    readonly profileVersion?: string;
}

/**
 * Determine whether the given properties match those of a `CfnProfilePermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfilePermissionProps`
 *
 * @returns the result of the validation.
 */
function CfnProfilePermissionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.requiredValidator)(properties.action));
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('principal', cdk.requiredValidator)(properties.principal));
    errors.collect(cdk.propertyValidator('principal', cdk.validateString)(properties.principal));
    errors.collect(cdk.propertyValidator('profileName', cdk.requiredValidator)(properties.profileName));
    errors.collect(cdk.propertyValidator('profileName', cdk.validateString)(properties.profileName));
    errors.collect(cdk.propertyValidator('profileVersion', cdk.validateString)(properties.profileVersion));
    errors.collect(cdk.propertyValidator('statementId', cdk.requiredValidator)(properties.statementId));
    errors.collect(cdk.propertyValidator('statementId', cdk.validateString)(properties.statementId));
    return errors.wrap('supplied properties not correct for "CfnProfilePermissionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Signer::ProfilePermission` resource
 *
 * @param properties - the TypeScript properties of a `CfnProfilePermissionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Signer::ProfilePermission` resource.
 */
// @ts-ignore TS6133
function cfnProfilePermissionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilePermissionPropsValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Principal: cdk.stringToCloudFormation(properties.principal),
        ProfileName: cdk.stringToCloudFormation(properties.profileName),
        StatementId: cdk.stringToCloudFormation(properties.statementId),
        ProfileVersion: cdk.stringToCloudFormation(properties.profileVersion),
    };
}

// @ts-ignore TS6133
function CfnProfilePermissionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilePermissionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilePermissionProps>();
    ret.addPropertyResult('action', 'Action', cfn_parse.FromCloudFormation.getString(properties.Action));
    ret.addPropertyResult('principal', 'Principal', cfn_parse.FromCloudFormation.getString(properties.Principal));
    ret.addPropertyResult('profileName', 'ProfileName', cfn_parse.FromCloudFormation.getString(properties.ProfileName));
    ret.addPropertyResult('statementId', 'StatementId', cfn_parse.FromCloudFormation.getString(properties.StatementId));
    ret.addPropertyResult('profileVersion', 'ProfileVersion', properties.ProfileVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProfileVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Signer::ProfilePermission`
 *
 * Adds cross-account permissions to a signing profile.
 *
 * @cloudformationResource AWS::Signer::ProfilePermission
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html
 */
export class CfnProfilePermission extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Signer::ProfilePermission";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfilePermission {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProfilePermissionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnProfilePermission(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AWS Signer action permitted as part of cross-account permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-action
     */
    public action: string;

    /**
     * The AWS principal receiving cross-account permissions. This may be an IAM role or another AWS account ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-principal
     */
    public principal: string;

    /**
     * The human-readable name of the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profilename
     */
    public profileName: string;

    /**
     * A unique identifier for the cross-account permission statement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-statementid
     */
    public statementId: string;

    /**
     * The version of the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-profilepermission.html#cfn-signer-profilepermission-profileversion
     */
    public profileVersion: string | undefined;

    /**
     * Create a new `AWS::Signer::ProfilePermission`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProfilePermissionProps) {
        super(scope, id, { type: CfnProfilePermission.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'action', this);
        cdk.requireProperty(props, 'principal', this);
        cdk.requireProperty(props, 'profileName', this);
        cdk.requireProperty(props, 'statementId', this);

        this.action = props.action;
        this.principal = props.principal;
        this.profileName = props.profileName;
        this.statementId = props.statementId;
        this.profileVersion = props.profileVersion;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfilePermission.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            action: this.action,
            principal: this.principal,
            profileName: this.profileName,
            statementId: this.statementId,
            profileVersion: this.profileVersion,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProfilePermissionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSigningProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html
 */
export interface CfnSigningProfileProps {

    /**
     * The ID of a platform that is available for use by a signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
     */
    readonly platformId: string;

    /**
     * The validity period override for any signature generated using this signing profile. If unspecified, the default is 135 months.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-signaturevalidityperiod
     */
    readonly signatureValidityPeriod?: CfnSigningProfile.SignatureValidityPeriodProperty | cdk.IResolvable;

    /**
     * A list of tags associated with the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSigningProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnSigningProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnSigningProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('platformId', cdk.requiredValidator)(properties.platformId));
    errors.collect(cdk.propertyValidator('platformId', cdk.validateString)(properties.platformId));
    errors.collect(cdk.propertyValidator('signatureValidityPeriod', CfnSigningProfile_SignatureValidityPeriodPropertyValidator)(properties.signatureValidityPeriod));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSigningProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Signer::SigningProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnSigningProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Signer::SigningProfile` resource.
 */
// @ts-ignore TS6133
function cfnSigningProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSigningProfilePropsValidator(properties).assertSuccess();
    return {
        PlatformId: cdk.stringToCloudFormation(properties.platformId),
        SignatureValidityPeriod: cfnSigningProfileSignatureValidityPeriodPropertyToCloudFormation(properties.signatureValidityPeriod),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSigningProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSigningProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSigningProfileProps>();
    ret.addPropertyResult('platformId', 'PlatformId', cfn_parse.FromCloudFormation.getString(properties.PlatformId));
    ret.addPropertyResult('signatureValidityPeriod', 'SignatureValidityPeriod', properties.SignatureValidityPeriod != null ? CfnSigningProfileSignatureValidityPeriodPropertyFromCloudFormation(properties.SignatureValidityPeriod) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Signer::SigningProfile`
 *
 * Creates a signing profile. A signing profile is a code signing template that can be used to carry out a pre-defined signing job.
 *
 * @cloudformationResource AWS::Signer::SigningProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html
 */
export class CfnSigningProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Signer::SigningProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSigningProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSigningProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSigningProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute ProfileName
     */
    public readonly attrProfileName: string;

    /**
     *
     * @cloudformationAttribute ProfileVersion
     */
    public readonly attrProfileVersion: string;

    /**
     *
     * @cloudformationAttribute ProfileVersionArn
     */
    public readonly attrProfileVersionArn: string;

    /**
     * The ID of a platform that is available for use by a signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
     */
    public platformId: string;

    /**
     * The validity period override for any signature generated using this signing profile. If unspecified, the default is 135 months.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-signaturevalidityperiod
     */
    public signatureValidityPeriod: CfnSigningProfile.SignatureValidityPeriodProperty | cdk.IResolvable | undefined;

    /**
     * A list of tags associated with the signing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Signer::SigningProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSigningProfileProps) {
        super(scope, id, { type: CfnSigningProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'platformId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrProfileName = cdk.Token.asString(this.getAtt('ProfileName', cdk.ResolutionTypeHint.STRING));
        this.attrProfileVersion = cdk.Token.asString(this.getAtt('ProfileVersion', cdk.ResolutionTypeHint.STRING));
        this.attrProfileVersionArn = cdk.Token.asString(this.getAtt('ProfileVersionArn', cdk.ResolutionTypeHint.STRING));

        this.platformId = props.platformId;
        this.signatureValidityPeriod = props.signatureValidityPeriod;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Signer::SigningProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSigningProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            platformId: this.platformId,
            signatureValidityPeriod: this.signatureValidityPeriod,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSigningProfilePropsToCloudFormation(props);
    }
}

export namespace CfnSigningProfile {
    /**
     * The validity period for the signing job.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html
     */
    export interface SignatureValidityPeriodProperty {
        /**
         * The time unit for signature validity: DAYS | MONTHS | YEARS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html#cfn-signer-signingprofile-signaturevalidityperiod-type
         */
        readonly type?: string;
        /**
         * The numerical value of the time unit for signature validity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-signer-signingprofile-signaturevalidityperiod.html#cfn-signer-signingprofile-signaturevalidityperiod-value
         */
        readonly value?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SignatureValidityPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `SignatureValidityPeriodProperty`
 *
 * @returns the result of the validation.
 */
function CfnSigningProfile_SignatureValidityPeriodPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "SignatureValidityPeriodProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Signer::SigningProfile.SignatureValidityPeriod` resource
 *
 * @param properties - the TypeScript properties of a `SignatureValidityPeriodProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Signer::SigningProfile.SignatureValidityPeriod` resource.
 */
// @ts-ignore TS6133
function cfnSigningProfileSignatureValidityPeriodPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSigningProfile_SignatureValidityPeriodPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnSigningProfileSignatureValidityPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSigningProfile.SignatureValidityPeriodProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSigningProfile.SignatureValidityPeriodProperty>();
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
