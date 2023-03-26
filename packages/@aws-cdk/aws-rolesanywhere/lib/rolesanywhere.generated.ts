// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:02.443Z","fingerprint":"92ABwG7Lr/rwETLcMEMnxzVi2R2JVJhcI9RI4Hz2oIA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCRL`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html
 */
export interface CfnCRLProps {

    /**
     * The revocation record for a certificate, following the x509 v3 standard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-crldata
     */
    readonly crlData?: string;

    /**
     * Indicates whether the certificate revocation list (CRL) is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The name of the certificate revocation list (CRL).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-name
     */
    readonly name?: string;

    /**
     * A list of tags to attach to the CRL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-trustanchorarn
     */
    readonly trustAnchorArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCRLProps`
 *
 * @param properties - the TypeScript properties of a `CfnCRLProps`
 *
 * @returns the result of the validation.
 */
function CfnCRLPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crlData', cdk.validateString)(properties.crlData));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('trustAnchorArn', cdk.validateString)(properties.trustAnchorArn));
    return errors.wrap('supplied properties not correct for "CfnCRLProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RolesAnywhere::CRL` resource
 *
 * @param properties - the TypeScript properties of a `CfnCRLProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RolesAnywhere::CRL` resource.
 */
// @ts-ignore TS6133
function cfnCRLPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCRLPropsValidator(properties).assertSuccess();
    return {
        CrlData: cdk.stringToCloudFormation(properties.crlData),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TrustAnchorArn: cdk.stringToCloudFormation(properties.trustAnchorArn),
    };
}

// @ts-ignore TS6133
function CfnCRLPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCRLProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCRLProps>();
    ret.addPropertyResult('crlData', 'CrlData', properties.CrlData != null ? cfn_parse.FromCloudFormation.getString(properties.CrlData) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('trustAnchorArn', 'TrustAnchorArn', properties.TrustAnchorArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustAnchorArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RolesAnywhere::CRL`
 *
 * The state of the certificate revocation list (CRL) after a read or write operation.
 *
 * @cloudformationResource AWS::RolesAnywhere::CRL
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html
 */
export class CfnCRL extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RolesAnywhere::CRL";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCRL {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCRLPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCRL(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique primary identifier of the Crl
     * @cloudformationAttribute CrlId
     */
    public readonly attrCrlId: string;

    /**
     * The revocation record for a certificate, following the x509 v3 standard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-crldata
     */
    public crlData: string | undefined;

    /**
     * Indicates whether the certificate revocation list (CRL) is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The name of the certificate revocation list (CRL).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-name
     */
    public name: string | undefined;

    /**
     * A list of tags to attach to the CRL.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-crl.html#cfn-rolesanywhere-crl-trustanchorarn
     */
    public trustAnchorArn: string | undefined;

    /**
     * Create a new `AWS::RolesAnywhere::CRL`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCRLProps = {}) {
        super(scope, id, { type: CfnCRL.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrCrlId = cdk.Token.asString(this.getAtt('CrlId', cdk.ResolutionTypeHint.STRING));

        this.crlData = props.crlData;
        this.enabled = props.enabled;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::CRL", props.tags, { tagPropertyName: 'tags' });
        this.trustAnchorArn = props.trustAnchorArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCRL.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            crlData: this.crlData,
            enabled: this.enabled,
            name: this.name,
            tags: this.tags.renderTags(),
            trustAnchorArn: this.trustAnchorArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCRLPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html
 */
export interface CfnProfileProps {

    /**
     * Sets the maximum number of seconds that vended temporary credentials through [CreateSession](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html) will be valid for, between 900 and 3600.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-durationseconds
     */
    readonly durationSeconds?: number;

    /**
     * Indicates whether the profile is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * A list of managed policy ARNs that apply to the vended session credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-managedpolicyarns
     */
    readonly managedPolicyArns?: string[];

    /**
     * The name of the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-name
     */
    readonly name?: string;

    /**
     * Specifies whether instance properties are required in temporary credential requests with this profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-requireinstanceproperties
     */
    readonly requireInstanceProperties?: boolean | cdk.IResolvable;

    /**
     * A list of IAM role ARNs. During `CreateSession` , if a matching role ARN is provided, the properties in this profile will be applied to the intersection session policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-rolearns
     */
    readonly roleArns?: string[];

    /**
     * A session policy that applies to the trust boundary of the vended session credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-sessionpolicy
     */
    readonly sessionPolicy?: string;

    /**
     * A list of tags to attach to the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('durationSeconds', cdk.validateNumber)(properties.durationSeconds));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('managedPolicyArns', cdk.listValidator(cdk.validateString))(properties.managedPolicyArns));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('requireInstanceProperties', cdk.validateBoolean)(properties.requireInstanceProperties));
    errors.collect(cdk.propertyValidator('roleArns', cdk.listValidator(cdk.validateString))(properties.roleArns));
    errors.collect(cdk.propertyValidator('sessionPolicy', cdk.validateString)(properties.sessionPolicy));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RolesAnywhere::Profile` resource
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RolesAnywhere::Profile` resource.
 */
// @ts-ignore TS6133
function cfnProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilePropsValidator(properties).assertSuccess();
    return {
        DurationSeconds: cdk.numberToCloudFormation(properties.durationSeconds),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        ManagedPolicyArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.managedPolicyArns),
        Name: cdk.stringToCloudFormation(properties.name),
        RequireInstanceProperties: cdk.booleanToCloudFormation(properties.requireInstanceProperties),
        RoleArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.roleArns),
        SessionPolicy: cdk.stringToCloudFormation(properties.sessionPolicy),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfileProps>();
    ret.addPropertyResult('durationSeconds', 'DurationSeconds', properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('managedPolicyArns', 'ManagedPolicyArns', properties.ManagedPolicyArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ManagedPolicyArns) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('requireInstanceProperties', 'RequireInstanceProperties', properties.RequireInstanceProperties != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireInstanceProperties) : undefined);
    ret.addPropertyResult('roleArns', 'RoleArns', properties.RoleArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.RoleArns) : undefined);
    ret.addPropertyResult('sessionPolicy', 'SessionPolicy', properties.SessionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SessionPolicy) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RolesAnywhere::Profile`
 *
 * Creates a *profile* , a list of the roles that Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.
 *
 * *Required permissions:* `rolesanywhere:CreateProfile` .
 *
 * @cloudformationResource AWS::RolesAnywhere::Profile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html
 */
export class CfnProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RolesAnywhere::Profile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the profile.
     * @cloudformationAttribute ProfileArn
     */
    public readonly attrProfileArn: string;

    /**
     * The unique primary identifier of the Profile
     * @cloudformationAttribute ProfileId
     */
    public readonly attrProfileId: string;

    /**
     * Sets the maximum number of seconds that vended temporary credentials through [CreateSession](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html) will be valid for, between 900 and 3600.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-durationseconds
     */
    public durationSeconds: number | undefined;

    /**
     * Indicates whether the profile is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * A list of managed policy ARNs that apply to the vended session credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-managedpolicyarns
     */
    public managedPolicyArns: string[] | undefined;

    /**
     * The name of the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-name
     */
    public name: string | undefined;

    /**
     * Specifies whether instance properties are required in temporary credential requests with this profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-requireinstanceproperties
     */
    public requireInstanceProperties: boolean | cdk.IResolvable | undefined;

    /**
     * A list of IAM role ARNs. During `CreateSession` , if a matching role ARN is provided, the properties in this profile will be applied to the intersection session policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-rolearns
     */
    public roleArns: string[] | undefined;

    /**
     * A session policy that applies to the trust boundary of the vended session credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-sessionpolicy
     */
    public sessionPolicy: string | undefined;

    /**
     * A list of tags to attach to the profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-profile.html#cfn-rolesanywhere-profile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RolesAnywhere::Profile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProfileProps = {}) {
        super(scope, id, { type: CfnProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrProfileArn = cdk.Token.asString(this.getAtt('ProfileArn', cdk.ResolutionTypeHint.STRING));
        this.attrProfileId = cdk.Token.asString(this.getAtt('ProfileId', cdk.ResolutionTypeHint.STRING));

        this.durationSeconds = props.durationSeconds;
        this.enabled = props.enabled;
        this.managedPolicyArns = props.managedPolicyArns;
        this.name = props.name;
        this.requireInstanceProperties = props.requireInstanceProperties;
        this.roleArns = props.roleArns;
        this.sessionPolicy = props.sessionPolicy;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::Profile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            durationSeconds: this.durationSeconds,
            enabled: this.enabled,
            managedPolicyArns: this.managedPolicyArns,
            name: this.name,
            requireInstanceProperties: this.requireInstanceProperties,
            roleArns: this.roleArns,
            sessionPolicy: this.sessionPolicy,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProfilePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTrustAnchor`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html
 */
export interface CfnTrustAnchorProps {

    /**
     * Indicates whether the trust anchor is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The name of the trust anchor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-name
     */
    readonly name?: string;

    /**
     * The trust anchor type and its related certificate data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-source
     */
    readonly source?: CfnTrustAnchor.SourceProperty | cdk.IResolvable;

    /**
     * A list of tags to attach to the trust anchor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnTrustAnchorProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrustAnchorProps`
 *
 * @returns the result of the validation.
 */
function CfnTrustAnchorPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('source', CfnTrustAnchor_SourcePropertyValidator)(properties.source));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnTrustAnchorProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor` resource
 *
 * @param properties - the TypeScript properties of a `CfnTrustAnchorProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor` resource.
 */
// @ts-ignore TS6133
function cfnTrustAnchorPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTrustAnchorPropsValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        Name: cdk.stringToCloudFormation(properties.name),
        Source: cfnTrustAnchorSourcePropertyToCloudFormation(properties.source),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnTrustAnchorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustAnchorProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchorProps>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('source', 'Source', properties.Source != null ? CfnTrustAnchorSourcePropertyFromCloudFormation(properties.Source) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RolesAnywhere::TrustAnchor`
 *
 * The state of the trust anchor after a read or write operation.
 *
 * @cloudformationResource AWS::RolesAnywhere::TrustAnchor
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html
 */
export class CfnTrustAnchor extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RolesAnywhere::TrustAnchor";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrustAnchor {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTrustAnchorPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTrustAnchor(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the trust anchor.
     * @cloudformationAttribute TrustAnchorArn
     */
    public readonly attrTrustAnchorArn: string;

    /**
     * The unique primary identifier of the TrustAnchor
     * @cloudformationAttribute TrustAnchorId
     */
    public readonly attrTrustAnchorId: string;

    /**
     * Indicates whether the trust anchor is enabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The name of the trust anchor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-name
     */
    public name: string | undefined;

    /**
     * The trust anchor type and its related certificate data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-source
     */
    public source: CfnTrustAnchor.SourceProperty | cdk.IResolvable | undefined;

    /**
     * A list of tags to attach to the trust anchor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rolesanywhere-trustanchor.html#cfn-rolesanywhere-trustanchor-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RolesAnywhere::TrustAnchor`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTrustAnchorProps = {}) {
        super(scope, id, { type: CfnTrustAnchor.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrTrustAnchorArn = cdk.Token.asString(this.getAtt('TrustAnchorArn', cdk.ResolutionTypeHint.STRING));
        this.attrTrustAnchorId = cdk.Token.asString(this.getAtt('TrustAnchorId', cdk.ResolutionTypeHint.STRING));

        this.enabled = props.enabled;
        this.name = props.name;
        this.source = props.source;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RolesAnywhere::TrustAnchor", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrustAnchor.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            enabled: this.enabled,
            name: this.name,
            source: this.source,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTrustAnchorPropsToCloudFormation(props);
    }
}

export namespace CfnTrustAnchor {
    /**
     * The trust anchor type and its related certificate data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html
     */
    export interface SourceProperty {
        /**
         * The data field of the trust anchor depending on its type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html#cfn-rolesanywhere-trustanchor-source-sourcedata
         */
        readonly sourceData?: CfnTrustAnchor.SourceDataProperty | cdk.IResolvable;
        /**
         * The type of the trust anchor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-source.html#cfn-rolesanywhere-trustanchor-source-sourcetype
         */
        readonly sourceType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnTrustAnchor_SourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceData', CfnTrustAnchor_SourceDataPropertyValidator)(properties.sourceData));
    errors.collect(cdk.propertyValidator('sourceType', cdk.validateString)(properties.sourceType));
    return errors.wrap('supplied properties not correct for "SourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor.Source` resource
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor.Source` resource.
 */
// @ts-ignore TS6133
function cfnTrustAnchorSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTrustAnchor_SourcePropertyValidator(properties).assertSuccess();
    return {
        SourceData: cfnTrustAnchorSourceDataPropertyToCloudFormation(properties.sourceData),
        SourceType: cdk.stringToCloudFormation(properties.sourceType),
    };
}

// @ts-ignore TS6133
function CfnTrustAnchorSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustAnchor.SourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchor.SourceProperty>();
    ret.addPropertyResult('sourceData', 'SourceData', properties.SourceData != null ? CfnTrustAnchorSourceDataPropertyFromCloudFormation(properties.SourceData) : undefined);
    ret.addPropertyResult('sourceType', 'SourceType', properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTrustAnchor {
    /**
     * The data field of the trust anchor depending on its type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html
     */
    export interface SourceDataProperty {
        /**
         * The root certificate of the AWS Private Certificate Authority specified by this ARN is used in trust validation for temporary credential requests. Included for trust anchors of type `AWS_ACM_PCA` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html#cfn-rolesanywhere-trustanchor-sourcedata-acmpcaarn
         */
        readonly acmPcaArn?: string;
        /**
         * The PEM-encoded data for the certificate anchor. Included for trust anchors of type `CERTIFICATE_BUNDLE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rolesanywhere-trustanchor-sourcedata.html#cfn-rolesanywhere-trustanchor-sourcedata-x509certificatedata
         */
        readonly x509CertificateData?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SourceDataProperty`
 *
 * @param properties - the TypeScript properties of a `SourceDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnTrustAnchor_SourceDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acmPcaArn', cdk.validateString)(properties.acmPcaArn));
    errors.collect(cdk.propertyValidator('x509CertificateData', cdk.validateString)(properties.x509CertificateData));
    return errors.wrap('supplied properties not correct for "SourceDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor.SourceData` resource
 *
 * @param properties - the TypeScript properties of a `SourceDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RolesAnywhere::TrustAnchor.SourceData` resource.
 */
// @ts-ignore TS6133
function cfnTrustAnchorSourceDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTrustAnchor_SourceDataPropertyValidator(properties).assertSuccess();
    return {
        AcmPcaArn: cdk.stringToCloudFormation(properties.acmPcaArn),
        X509CertificateData: cdk.stringToCloudFormation(properties.x509CertificateData),
    };
}

// @ts-ignore TS6133
function CfnTrustAnchorSourceDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustAnchor.SourceDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustAnchor.SourceDataProperty>();
    ret.addPropertyResult('acmPcaArn', 'AcmPcaArn', properties.AcmPcaArn != null ? cfn_parse.FromCloudFormation.getString(properties.AcmPcaArn) : undefined);
    ret.addPropertyResult('x509CertificateData', 'X509CertificateData', properties.X509CertificateData != null ? cfn_parse.FromCloudFormation.getString(properties.X509CertificateData) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
