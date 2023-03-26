// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:40.779Z","fingerprint":"l5LSgNMQ3VAPxyuP+pTwhCnAi4AZtj9gRJM83AdcmmU="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAccessPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html
 */
export interface CfnAccessPolicyProps {

    /**
     * The identity for this access policy. Choose an IAM Identity Center user, an IAM Identity Center group, or an IAM user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity
     */
    readonly accessPolicyIdentity: CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable;

    /**
     * The permission level for this access policy. Choose either a `ADMINISTRATOR` or `VIEWER` . Note that a project `ADMINISTRATOR` is also known as a project owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicypermission
     */
    readonly accessPolicyPermission: string;

    /**
     * The AWS IoT SiteWise Monitor resource for this access policy. Choose either a portal or a project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyresource
     */
    readonly accessPolicyResource: CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAccessPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accessPolicyIdentity', cdk.requiredValidator)(properties.accessPolicyIdentity));
    errors.collect(cdk.propertyValidator('accessPolicyIdentity', CfnAccessPolicy_AccessPolicyIdentityPropertyValidator)(properties.accessPolicyIdentity));
    errors.collect(cdk.propertyValidator('accessPolicyPermission', cdk.requiredValidator)(properties.accessPolicyPermission));
    errors.collect(cdk.propertyValidator('accessPolicyPermission', cdk.validateString)(properties.accessPolicyPermission));
    errors.collect(cdk.propertyValidator('accessPolicyResource', cdk.requiredValidator)(properties.accessPolicyResource));
    errors.collect(cdk.propertyValidator('accessPolicyResource', CfnAccessPolicy_AccessPolicyResourcePropertyValidator)(properties.accessPolicyResource));
    return errors.wrap('supplied properties not correct for "CfnAccessPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccessPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicyPropsValidator(properties).assertSuccess();
    return {
        AccessPolicyIdentity: cfnAccessPolicyAccessPolicyIdentityPropertyToCloudFormation(properties.accessPolicyIdentity),
        AccessPolicyPermission: cdk.stringToCloudFormation(properties.accessPolicyPermission),
        AccessPolicyResource: cfnAccessPolicyAccessPolicyResourcePropertyToCloudFormation(properties.accessPolicyResource),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicyProps>();
    ret.addPropertyResult('accessPolicyIdentity', 'AccessPolicyIdentity', CfnAccessPolicyAccessPolicyIdentityPropertyFromCloudFormation(properties.AccessPolicyIdentity));
    ret.addPropertyResult('accessPolicyPermission', 'AccessPolicyPermission', cfn_parse.FromCloudFormation.getString(properties.AccessPolicyPermission));
    ret.addPropertyResult('accessPolicyResource', 'AccessPolicyResource', CfnAccessPolicyAccessPolicyResourcePropertyFromCloudFormation(properties.AccessPolicyResource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::AccessPolicy`
 *
 * Creates an access policy that grants the specified identity (IAM Identity Center user, IAM Identity Center group, or IAM user) access to the specified AWS IoT SiteWise Monitor portal or project resource.
 *
 * @cloudformationResource AWS::IoTSiteWise::AccessPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html
 */
export class CfnAccessPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::AccessPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAccessPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAccessPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the access policy, which has the following format.
     *
     * `arn:${Partition}:iotsitewise:${Region}:${Account}:access-policy/${AccessPolicyId}`
     * @cloudformationAttribute AccessPolicyArn
     */
    public readonly attrAccessPolicyArn: string;

    /**
     * The ID of the access policy.
     * @cloudformationAttribute AccessPolicyId
     */
    public readonly attrAccessPolicyId: string;

    /**
     * The identity for this access policy. Choose an IAM Identity Center user, an IAM Identity Center group, or an IAM user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity
     */
    public accessPolicyIdentity: CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable;

    /**
     * The permission level for this access policy. Choose either a `ADMINISTRATOR` or `VIEWER` . Note that a project `ADMINISTRATOR` is also known as a project owner.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicypermission
     */
    public accessPolicyPermission: string;

    /**
     * The AWS IoT SiteWise Monitor resource for this access policy. Choose either a portal or a project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html#cfn-iotsitewise-accesspolicy-accesspolicyresource
     */
    public accessPolicyResource: CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::IoTSiteWise::AccessPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccessPolicyProps) {
        super(scope, id, { type: CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'accessPolicyIdentity', this);
        cdk.requireProperty(props, 'accessPolicyPermission', this);
        cdk.requireProperty(props, 'accessPolicyResource', this);
        this.attrAccessPolicyArn = cdk.Token.asString(this.getAtt('AccessPolicyArn', cdk.ResolutionTypeHint.STRING));
        this.attrAccessPolicyId = cdk.Token.asString(this.getAtt('AccessPolicyId', cdk.ResolutionTypeHint.STRING));

        this.accessPolicyIdentity = props.accessPolicyIdentity;
        this.accessPolicyPermission = props.accessPolicyPermission;
        this.accessPolicyResource = props.accessPolicyResource;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accessPolicyIdentity: this.accessPolicyIdentity,
            accessPolicyPermission: this.accessPolicyPermission,
            accessPolicyResource: this.accessPolicyResource,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAccessPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnAccessPolicy {
    /**
     * The identity (IAM Identity Center user, IAM Identity Center group, or IAM user) to which this access policy applies.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html
     */
    export interface AccessPolicyIdentityProperty {
        /**
         * An IAM role identity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-iamrole
         */
        readonly iamRole?: CfnAccessPolicy.IamRoleProperty | cdk.IResolvable;
        /**
         * An IAM user identity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-iamuser
         */
        readonly iamUser?: CfnAccessPolicy.IamUserProperty | cdk.IResolvable;
        /**
         * The IAM Identity Center user to which this access policy maps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyidentity.html#cfn-iotsitewise-accesspolicy-accesspolicyidentity-user
         */
        readonly user?: CfnAccessPolicy.UserProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AccessPolicyIdentityProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPolicyIdentityProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_AccessPolicyIdentityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iamRole', CfnAccessPolicy_IamRolePropertyValidator)(properties.iamRole));
    errors.collect(cdk.propertyValidator('iamUser', CfnAccessPolicy_IamUserPropertyValidator)(properties.iamUser));
    errors.collect(cdk.propertyValidator('user', CfnAccessPolicy_UserPropertyValidator)(properties.user));
    return errors.wrap('supplied properties not correct for "AccessPolicyIdentityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.AccessPolicyIdentity` resource
 *
 * @param properties - the TypeScript properties of a `AccessPolicyIdentityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.AccessPolicyIdentity` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyAccessPolicyIdentityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_AccessPolicyIdentityPropertyValidator(properties).assertSuccess();
    return {
        IamRole: cfnAccessPolicyIamRolePropertyToCloudFormation(properties.iamRole),
        IamUser: cfnAccessPolicyIamUserPropertyToCloudFormation(properties.iamUser),
        User: cfnAccessPolicyUserPropertyToCloudFormation(properties.user),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyIdentityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.AccessPolicyIdentityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.AccessPolicyIdentityProperty>();
    ret.addPropertyResult('iamRole', 'IamRole', properties.IamRole != null ? CfnAccessPolicyIamRolePropertyFromCloudFormation(properties.IamRole) : undefined);
    ret.addPropertyResult('iamUser', 'IamUser', properties.IamUser != null ? CfnAccessPolicyIamUserPropertyFromCloudFormation(properties.IamUser) : undefined);
    ret.addPropertyResult('user', 'User', properties.User != null ? CfnAccessPolicyUserPropertyFromCloudFormation(properties.User) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * The AWS IoT SiteWise Monitor resource for this access policy. Choose either a portal or a project.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html
     */
    export interface AccessPolicyResourceProperty {
        /**
         * The AWS IoT SiteWise Monitor portal for this access policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html#cfn-iotsitewise-accesspolicy-accesspolicyresource-portal
         */
        readonly portal?: CfnAccessPolicy.PortalProperty | cdk.IResolvable;
        /**
         * The AWS IoT SiteWise Monitor project for this access policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-accesspolicyresource.html#cfn-iotsitewise-accesspolicy-accesspolicyresource-project
         */
        readonly project?: CfnAccessPolicy.ProjectProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AccessPolicyResourceProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPolicyResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_AccessPolicyResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('portal', CfnAccessPolicy_PortalPropertyValidator)(properties.portal));
    errors.collect(cdk.propertyValidator('project', CfnAccessPolicy_ProjectPropertyValidator)(properties.project));
    return errors.wrap('supplied properties not correct for "AccessPolicyResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.AccessPolicyResource` resource
 *
 * @param properties - the TypeScript properties of a `AccessPolicyResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.AccessPolicyResource` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyAccessPolicyResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_AccessPolicyResourcePropertyValidator(properties).assertSuccess();
    return {
        Portal: cfnAccessPolicyPortalPropertyToCloudFormation(properties.portal),
        Project: cfnAccessPolicyProjectPropertyToCloudFormation(properties.project),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyAccessPolicyResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.AccessPolicyResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.AccessPolicyResourceProperty>();
    ret.addPropertyResult('portal', 'Portal', properties.Portal != null ? CfnAccessPolicyPortalPropertyFromCloudFormation(properties.Portal) : undefined);
    ret.addPropertyResult('project', 'Project', properties.Project != null ? CfnAccessPolicyProjectPropertyFromCloudFormation(properties.Project) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * Contains information about an AWS Identity and Access Management role. For more information, see [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) in the *IAM User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamrole.html
     */
    export interface IamRoleProperty {
        /**
         * The ARN of the IAM role. For more information, see [IAM ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html) in the *IAM User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamrole.html#cfn-iotsitewise-accesspolicy-iamrole-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IamRoleProperty`
 *
 * @param properties - the TypeScript properties of a `IamRoleProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_IamRolePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "IamRoleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.IamRole` resource
 *
 * @param properties - the TypeScript properties of a `IamRoleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.IamRole` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyIamRolePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_IamRolePropertyValidator(properties).assertSuccess();
    return {
        arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyIamRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.IamRoleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.IamRoleProperty>();
    ret.addPropertyResult('arn', 'arn', properties.arn != null ? cfn_parse.FromCloudFormation.getString(properties.arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * Contains information about an AWS Identity and Access Management user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamuser.html
     */
    export interface IamUserProperty {
        /**
         * The ARN of the IAM user. For more information, see [IAM ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html) in the *IAM User Guide* .
         *
         * > If you delete the IAM user, access policies that contain this identity include an empty `arn` . You can delete the access policy for the IAM user that no longer exists.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-iamuser.html#cfn-iotsitewise-accesspolicy-iamuser-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `IamUserProperty`
 *
 * @param properties - the TypeScript properties of a `IamUserProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_IamUserPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "IamUserProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.IamUser` resource
 *
 * @param properties - the TypeScript properties of a `IamUserProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.IamUser` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyIamUserPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_IamUserPropertyValidator(properties).assertSuccess();
    return {
        arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyIamUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.IamUserProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.IamUserProperty>();
    ret.addPropertyResult('arn', 'arn', properties.arn != null ? cfn_parse.FromCloudFormation.getString(properties.arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * The `Portal` property type specifies the AWS IoT SiteWise Monitor portal for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-portal.html
     */
    export interface PortalProperty {
        /**
         * The ID of the portal.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-portal.html#cfn-iotsitewise-accesspolicy-portal-id
         */
        readonly id?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PortalProperty`
 *
 * @param properties - the TypeScript properties of a `PortalProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_PortalPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "PortalProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.Portal` resource
 *
 * @param properties - the TypeScript properties of a `PortalProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.Portal` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyPortalPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_PortalPropertyValidator(properties).assertSuccess();
    return {
        id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyPortalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.PortalProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.PortalProperty>();
    ret.addPropertyResult('id', 'id', properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * The `Project` property type specifies the AWS IoT SiteWise Monitor project for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-project.html
     */
    export interface ProjectProperty {
        /**
         * The ID of the project.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-project.html#cfn-iotsitewise-accesspolicy-project-id
         */
        readonly id?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProjectProperty`
 *
 * @param properties - the TypeScript properties of a `ProjectProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_ProjectPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "ProjectProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.Project` resource
 *
 * @param properties - the TypeScript properties of a `ProjectProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.Project` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyProjectPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_ProjectPropertyValidator(properties).assertSuccess();
    return {
        id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyProjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.ProjectProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.ProjectProperty>();
    ret.addPropertyResult('id', 'id', properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAccessPolicy {
    /**
     * The `User` property type specifies the AWS IoT SiteWise Monitor user for an [AWS::IoTSiteWise::AccessPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-accesspolicy.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-user.html
     */
    export interface UserProperty {
        /**
         * The ID of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-accesspolicy-user.html#cfn-iotsitewise-accesspolicy-user-id
         */
        readonly id?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserProperty`
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the result of the validation.
 */
function CfnAccessPolicy_UserPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "UserProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.User` resource
 *
 * @param properties - the TypeScript properties of a `UserProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AccessPolicy.User` resource.
 */
// @ts-ignore TS6133
function cfnAccessPolicyUserPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAccessPolicy_UserPropertyValidator(properties).assertSuccess();
    return {
        id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnAccessPolicyUserPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessPolicy.UserProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessPolicy.UserProperty>();
    ret.addPropertyResult('id', 'id', properties.id != null ? cfn_parse.FromCloudFormation.getString(properties.id) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAsset`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html
 */
export interface CfnAssetProps {

    /**
     * The ID of the asset model from which to create the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetmodelid
     */
    readonly assetModelId: string;

    /**
     * A unique, friendly name for the asset.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetname
     */
    readonly assetName: string;

    /**
     * A description for the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetdescription
     */
    readonly assetDescription?: string;

    /**
     * A list of asset hierarchies that each contain a `hierarchyLogicalId` . A hierarchy specifies allowed parent/child asset relationships.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assethierarchies
     */
    readonly assetHierarchies?: Array<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The list of asset properties for the asset.
     *
     * This object doesn't include properties that you define in composite models. You can find composite model properties in the `assetCompositeModels` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetproperties
     */
    readonly assetProperties?: Array<CfnAsset.AssetPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of key-value pairs that contain metadata for the asset. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the result of the validation.
 */
function CfnAssetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assetDescription', cdk.validateString)(properties.assetDescription));
    errors.collect(cdk.propertyValidator('assetHierarchies', cdk.listValidator(CfnAsset_AssetHierarchyPropertyValidator))(properties.assetHierarchies));
    errors.collect(cdk.propertyValidator('assetModelId', cdk.requiredValidator)(properties.assetModelId));
    errors.collect(cdk.propertyValidator('assetModelId', cdk.validateString)(properties.assetModelId));
    errors.collect(cdk.propertyValidator('assetName', cdk.requiredValidator)(properties.assetName));
    errors.collect(cdk.propertyValidator('assetName', cdk.validateString)(properties.assetName));
    errors.collect(cdk.propertyValidator('assetProperties', cdk.listValidator(CfnAsset_AssetPropertyPropertyValidator))(properties.assetProperties));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAssetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset` resource.
 */
// @ts-ignore TS6133
function cfnAssetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetPropsValidator(properties).assertSuccess();
    return {
        AssetModelId: cdk.stringToCloudFormation(properties.assetModelId),
        AssetName: cdk.stringToCloudFormation(properties.assetName),
        AssetDescription: cdk.stringToCloudFormation(properties.assetDescription),
        AssetHierarchies: cdk.listMapper(cfnAssetAssetHierarchyPropertyToCloudFormation)(properties.assetHierarchies),
        AssetProperties: cdk.listMapper(cfnAssetAssetPropertyPropertyToCloudFormation)(properties.assetProperties),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetProps>();
    ret.addPropertyResult('assetModelId', 'AssetModelId', cfn_parse.FromCloudFormation.getString(properties.AssetModelId));
    ret.addPropertyResult('assetName', 'AssetName', cfn_parse.FromCloudFormation.getString(properties.AssetName));
    ret.addPropertyResult('assetDescription', 'AssetDescription', properties.AssetDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AssetDescription) : undefined);
    ret.addPropertyResult('assetHierarchies', 'AssetHierarchies', properties.AssetHierarchies != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetAssetHierarchyPropertyFromCloudFormation)(properties.AssetHierarchies) : undefined);
    ret.addPropertyResult('assetProperties', 'AssetProperties', properties.AssetProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetAssetPropertyPropertyFromCloudFormation)(properties.AssetProperties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::Asset`
 *
 * Creates an asset from an existing asset model. For more information, see [Creating assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/create-assets.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Asset
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html
 */
export class CfnAsset extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::Asset";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAsset {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAsset(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the asset.
     * @cloudformationAttribute AssetArn
     */
    public readonly attrAssetArn: string;

    /**
     * The ID of the asset.
     * @cloudformationAttribute AssetId
     */
    public readonly attrAssetId: string;

    /**
     * The ID of the asset model from which to create the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetmodelid
     */
    public assetModelId: string;

    /**
     * A unique, friendly name for the asset.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetname
     */
    public assetName: string;

    /**
     * A description for the asset.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetdescription
     */
    public assetDescription: string | undefined;

    /**
     * A list of asset hierarchies that each contain a `hierarchyLogicalId` . A hierarchy specifies allowed parent/child asset relationships.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assethierarchies
     */
    public assetHierarchies: Array<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The list of asset properties for the asset.
     *
     * This object doesn't include properties that you define in composite models. You can find composite model properties in the `assetCompositeModels` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-assetproperties
     */
    public assetProperties: Array<CfnAsset.AssetPropertyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of key-value pairs that contain metadata for the asset. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-asset.html#cfn-iotsitewise-asset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::Asset`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssetProps) {
        super(scope, id, { type: CfnAsset.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'assetModelId', this);
        cdk.requireProperty(props, 'assetName', this);
        this.attrAssetArn = cdk.Token.asString(this.getAtt('AssetArn', cdk.ResolutionTypeHint.STRING));
        this.attrAssetId = cdk.Token.asString(this.getAtt('AssetId', cdk.ResolutionTypeHint.STRING));

        this.assetModelId = props.assetModelId;
        this.assetName = props.assetName;
        this.assetDescription = props.assetDescription;
        this.assetHierarchies = props.assetHierarchies;
        this.assetProperties = props.assetProperties;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Asset", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAsset.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assetModelId: this.assetModelId,
            assetName: this.assetName,
            assetDescription: this.assetDescription,
            assetHierarchies: this.assetHierarchies,
            assetProperties: this.assetProperties,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssetPropsToCloudFormation(props);
    }
}

export namespace CfnAsset {
    /**
     * Describes an asset hierarchy that contains a `childAssetId` and `hierarchyLogicalId` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html
     */
    export interface AssetHierarchyProperty {
        /**
         * The Id of the child asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html#cfn-iotsitewise-asset-assethierarchy-childassetid
         */
        readonly childAssetId: string;
        /**
         * The `LogicalID` of the hierarchy. This ID is a `hierarchyLogicalId` .
         *
         * The maximum length is 256 characters, with the pattern `[^\ u0000-\ u001F\ u007F]+` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assethierarchy.html#cfn-iotsitewise-asset-assethierarchy-logicalid
         */
        readonly logicalId: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssetHierarchyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetHierarchyProperty`
 *
 * @returns the result of the validation.
 */
function CfnAsset_AssetHierarchyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('childAssetId', cdk.requiredValidator)(properties.childAssetId));
    errors.collect(cdk.propertyValidator('childAssetId', cdk.validateString)(properties.childAssetId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.requiredValidator)(properties.logicalId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.validateString)(properties.logicalId));
    return errors.wrap('supplied properties not correct for "AssetHierarchyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset.AssetHierarchy` resource
 *
 * @param properties - the TypeScript properties of a `AssetHierarchyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset.AssetHierarchy` resource.
 */
// @ts-ignore TS6133
function cfnAssetAssetHierarchyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAsset_AssetHierarchyPropertyValidator(properties).assertSuccess();
    return {
        ChildAssetId: cdk.stringToCloudFormation(properties.childAssetId),
        LogicalId: cdk.stringToCloudFormation(properties.logicalId),
    };
}

// @ts-ignore TS6133
function CfnAssetAssetHierarchyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.AssetHierarchyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.AssetHierarchyProperty>();
    ret.addPropertyResult('childAssetId', 'ChildAssetId', cfn_parse.FromCloudFormation.getString(properties.ChildAssetId));
    ret.addPropertyResult('logicalId', 'LogicalId', cfn_parse.FromCloudFormation.getString(properties.LogicalId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAsset {
    /**
     * Contains asset property information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html
     */
    export interface AssetPropertyProperty {
        /**
         * The property alias that identifies the property, such as an OPC-UA server data stream path (for example, `/company/windfarm/3/turbine/7/temperature` ). For more information, see [Mapping industrial data streams to asset properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/connect-data-streams.html) in the *AWS IoT SiteWise User Guide* .
         *
         * The property alias must have 1-1000 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-alias
         */
        readonly alias?: string;
        /**
         * The `LogicalID` of the asset property.
         *
         * The maximum length is 256 characters, with the pattern `[^\ u0000-\ u001F\ u007F]+` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-logicalid
         */
        readonly logicalId: string;
        /**
         * The MQTT notification state ( `ENABLED` or `DISABLED` ) for this asset property. When the notification state is `ENABLED` , AWS IoT SiteWise publishes property value updates to a unique MQTT topic. For more information, see [Interacting with other services](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/interact-with-other-services.html) in the *AWS IoT SiteWise User Guide* .
         *
         * If you omit this parameter, the notification state is set to `DISABLED` .
         *
         * > You must use all caps for the NotificationState parameter. If you use lower case letters, you will receive a schema validation error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-notificationstate
         */
        readonly notificationState?: string;
        /**
         * The unit (such as `Newtons` or `RPM` ) of the asset property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-asset-assetproperty.html#cfn-iotsitewise-asset-assetproperty-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssetPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnAsset_AssetPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alias', cdk.validateString)(properties.alias));
    errors.collect(cdk.propertyValidator('logicalId', cdk.requiredValidator)(properties.logicalId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.validateString)(properties.logicalId));
    errors.collect(cdk.propertyValidator('notificationState', cdk.validateString)(properties.notificationState));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "AssetPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset.AssetProperty` resource
 *
 * @param properties - the TypeScript properties of a `AssetPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Asset.AssetProperty` resource.
 */
// @ts-ignore TS6133
function cfnAssetAssetPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAsset_AssetPropertyPropertyValidator(properties).assertSuccess();
    return {
        Alias: cdk.stringToCloudFormation(properties.alias),
        LogicalId: cdk.stringToCloudFormation(properties.logicalId),
        NotificationState: cdk.stringToCloudFormation(properties.notificationState),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnAssetAssetPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.AssetPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.AssetPropertyProperty>();
    ret.addPropertyResult('alias', 'Alias', properties.Alias != null ? cfn_parse.FromCloudFormation.getString(properties.Alias) : undefined);
    ret.addPropertyResult('logicalId', 'LogicalId', cfn_parse.FromCloudFormation.getString(properties.LogicalId));
    ret.addPropertyResult('notificationState', 'NotificationState', properties.NotificationState != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationState) : undefined);
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnAssetModel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html
 */
export interface CfnAssetModelProps {

    /**
     * A unique, friendly name for the asset model.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelname
     */
    readonly assetModelName: string;

    /**
     * The composite asset models that are part of this asset model. Composite asset models are asset models that contain specific properties. Each composite model has a type that defines the properties that the composite model supports. You can use composite asset models to define alarms on this asset model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodels
     */
    readonly assetModelCompositeModels?: Array<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A description for the asset model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodeldescription
     */
    readonly assetModelDescription?: string;

    /**
     * The hierarchy definitions of the asset model. Each hierarchy specifies an asset model whose assets can be children of any other assets created from this asset model. For more information, see [Defining relationships between assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-hierarchies.html) in the *AWS IoT SiteWise User Guide* .
     *
     * You can specify up to 10 hierarchies per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelhierarchies
     */
    readonly assetModelHierarchies?: Array<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The property definitions of the asset model. For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html) in the *AWS IoT SiteWise User Guide* .
     *
     * You can specify up to 200 properties per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelproperties
     */
    readonly assetModelProperties?: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of key-value pairs that contain metadata for the asset. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAssetModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetModelProps`
 *
 * @returns the result of the validation.
 */
function CfnAssetModelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assetModelCompositeModels', cdk.listValidator(CfnAssetModel_AssetModelCompositeModelPropertyValidator))(properties.assetModelCompositeModels));
    errors.collect(cdk.propertyValidator('assetModelDescription', cdk.validateString)(properties.assetModelDescription));
    errors.collect(cdk.propertyValidator('assetModelHierarchies', cdk.listValidator(CfnAssetModel_AssetModelHierarchyPropertyValidator))(properties.assetModelHierarchies));
    errors.collect(cdk.propertyValidator('assetModelName', cdk.requiredValidator)(properties.assetModelName));
    errors.collect(cdk.propertyValidator('assetModelName', cdk.validateString)(properties.assetModelName));
    errors.collect(cdk.propertyValidator('assetModelProperties', cdk.listValidator(CfnAssetModel_AssetModelPropertyPropertyValidator))(properties.assetModelProperties));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAssetModelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel` resource
 *
 * @param properties - the TypeScript properties of a `CfnAssetModelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModelPropsValidator(properties).assertSuccess();
    return {
        AssetModelName: cdk.stringToCloudFormation(properties.assetModelName),
        AssetModelCompositeModels: cdk.listMapper(cfnAssetModelAssetModelCompositeModelPropertyToCloudFormation)(properties.assetModelCompositeModels),
        AssetModelDescription: cdk.stringToCloudFormation(properties.assetModelDescription),
        AssetModelHierarchies: cdk.listMapper(cfnAssetModelAssetModelHierarchyPropertyToCloudFormation)(properties.assetModelHierarchies),
        AssetModelProperties: cdk.listMapper(cfnAssetModelAssetModelPropertyPropertyToCloudFormation)(properties.assetModelProperties),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAssetModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModelProps>();
    ret.addPropertyResult('assetModelName', 'AssetModelName', cfn_parse.FromCloudFormation.getString(properties.AssetModelName));
    ret.addPropertyResult('assetModelCompositeModels', 'AssetModelCompositeModels', properties.AssetModelCompositeModels != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelCompositeModelPropertyFromCloudFormation)(properties.AssetModelCompositeModels) : undefined);
    ret.addPropertyResult('assetModelDescription', 'AssetModelDescription', properties.AssetModelDescription != null ? cfn_parse.FromCloudFormation.getString(properties.AssetModelDescription) : undefined);
    ret.addPropertyResult('assetModelHierarchies', 'AssetModelHierarchies', properties.AssetModelHierarchies != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelHierarchyPropertyFromCloudFormation)(properties.AssetModelHierarchies) : undefined);
    ret.addPropertyResult('assetModelProperties', 'AssetModelProperties', properties.AssetModelProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelPropertyPropertyFromCloudFormation)(properties.AssetModelProperties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::AssetModel`
 *
 * Creates an asset model from specified property and hierarchy definitions. You create assets from asset models. With asset models, you can easily create assets of the same type that have standardized definitions. Each asset created from a model inherits the asset model's property and hierarchy definitions. For more information, see [Defining asset models](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/define-models.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::AssetModel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html
 */
export class CfnAssetModel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::AssetModel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAssetModel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAssetModelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAssetModel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute AssetModelArn
     */
    public readonly attrAssetModelArn: string;

    /**
     * The ID of the asset model.
     * @cloudformationAttribute AssetModelId
     */
    public readonly attrAssetModelId: string;

    /**
     * A unique, friendly name for the asset model.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelname
     */
    public assetModelName: string;

    /**
     * The composite asset models that are part of this asset model. Composite asset models are asset models that contain specific properties. Each composite model has a type that defines the properties that the composite model supports. You can use composite asset models to define alarms on this asset model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodels
     */
    public assetModelCompositeModels: Array<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A description for the asset model.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodeldescription
     */
    public assetModelDescription: string | undefined;

    /**
     * The hierarchy definitions of the asset model. Each hierarchy specifies an asset model whose assets can be children of any other assets created from this asset model. For more information, see [Defining relationships between assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-hierarchies.html) in the *AWS IoT SiteWise User Guide* .
     *
     * You can specify up to 10 hierarchies per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelhierarchies
     */
    public assetModelHierarchies: Array<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The property definitions of the asset model. For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html) in the *AWS IoT SiteWise User Guide* .
     *
     * You can specify up to 200 properties per asset model. For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-assetmodelproperties
     */
    public assetModelProperties: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of key-value pairs that contain metadata for the asset. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-assetmodel.html#cfn-iotsitewise-assetmodel-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::AssetModel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAssetModelProps) {
        super(scope, id, { type: CfnAssetModel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'assetModelName', this);
        this.attrAssetModelArn = cdk.Token.asString(this.getAtt('AssetModelArn', cdk.ResolutionTypeHint.STRING));
        this.attrAssetModelId = cdk.Token.asString(this.getAtt('AssetModelId', cdk.ResolutionTypeHint.STRING));

        this.assetModelName = props.assetModelName;
        this.assetModelCompositeModels = props.assetModelCompositeModels;
        this.assetModelDescription = props.assetModelDescription;
        this.assetModelHierarchies = props.assetModelHierarchies;
        this.assetModelProperties = props.assetModelProperties;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::AssetModel", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAssetModel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            assetModelName: this.assetModelName,
            assetModelCompositeModels: this.assetModelCompositeModels,
            assetModelDescription: this.assetModelDescription,
            assetModelHierarchies: this.assetModelHierarchies,
            assetModelProperties: this.assetModelProperties,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAssetModelPropsToCloudFormation(props);
    }
}

export namespace CfnAssetModel {
    /**
     * Contains information about a composite model in an asset model. This object contains the asset property definitions that you define in the composite model. You can use composite asset models to define alarms on this asset model.
     *
     * If you use the `AssetModelCompositeModel` property to create an alarm, you must use the following information to define three asset model properties:
     *
     * - Use an asset model property to specify the alarm type.
     *
     * - The name must be `AWS/ALARM_TYPE` .
     * - The data type must be `STRING` .
     * - For the `Type` property, the type name must be `Attribute` and the default value must be `IOT_EVENTS` .
     * - Use an asset model property to specify the alarm source.
     *
     * - The name must be `AWS/ALARM_SOURCE` .
     * - The data type must be `STRING` .
     * - For the `Type` property, the type name must be `Attribute` and the default value must be the ARN of the alarm model that you created in AWS IoT Events .
     *
     * > For the ARN of the alarm model, you can use the `Fn::Sub` intrinsic function to substitute the `AWS::Partition` , `AWS::Region` , and `AWS::AccountId` variables in an input string with values that you specify.
     * >
     * > For example, `Fn::Sub: "arn:${AWS::Partition}:iotevents:${AWS::Region}:${AWS::AccountId}:alarmModel/TestAlarmModel"` .
     * >
     * > Replace `TestAlarmModel` with the name of your alarm model.
     * >
     * > For more information about using the `Fn::Sub` intrinsic function, see [Fn::Sub](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html) .
     * - Use an asset model property to specify the state of the alarm.
     *
     * - The name must be `AWS/ALARM_STATE` .
     * - The data type must be `STRUCT` .
     * - The `DataTypeSpec` value must be `AWS/ALARM_STATE` .
     * - For the `Type` property, the type name must be `Measurement` .
     *
     * At the bottom of this page, we provide a YAML example that you can modify to create an alarm.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html
     */
    export interface AssetModelCompositeModelProperty {
        /**
         * The asset property definitions for this composite model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-compositemodelproperties
         */
        readonly compositeModelProperties?: Array<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The description of the composite model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-description
         */
        readonly description?: string;
        /**
         * The name of the composite model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-name
         */
        readonly name: string;
        /**
         * The type of the composite model. For alarm composite models, this type is `AWS/ALARM` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelcompositemodel.html#cfn-iotsitewise-assetmodel-assetmodelcompositemodel-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssetModelCompositeModelProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelCompositeModelProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_AssetModelCompositeModelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('compositeModelProperties', cdk.listValidator(CfnAssetModel_AssetModelPropertyPropertyValidator))(properties.compositeModelProperties));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "AssetModelCompositeModelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelCompositeModel` resource
 *
 * @param properties - the TypeScript properties of a `AssetModelCompositeModelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelCompositeModel` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelAssetModelCompositeModelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_AssetModelCompositeModelPropertyValidator(properties).assertSuccess();
    return {
        CompositeModelProperties: cdk.listMapper(cfnAssetModelAssetModelPropertyPropertyToCloudFormation)(properties.compositeModelProperties),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelCompositeModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelCompositeModelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelCompositeModelProperty>();
    ret.addPropertyResult('compositeModelProperties', 'CompositeModelProperties', properties.CompositeModelProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetModelAssetModelPropertyPropertyFromCloudFormation)(properties.CompositeModelProperties) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Describes an asset hierarchy that contains a hierarchy's name, `LogicalID` , and child asset model ID that specifies the type of asset that can be in this hierarchy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html
     */
    export interface AssetModelHierarchyProperty {
        /**
         * The Id of the asset model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-childassetmodelid
         */
        readonly childAssetModelId: string;
        /**
         * The `LogicalID` of the asset model hierarchy. This ID is a `hierarchyLogicalId` .
         *
         * The maximum length is 256 characters, with the pattern `[^\ u0000-\ u001F\ u007F]+`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-logicalid
         */
        readonly logicalId: string;
        /**
         * The name of the asset model hierarchy.
         *
         * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelhierarchy.html#cfn-iotsitewise-assetmodel-assetmodelhierarchy-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssetModelHierarchyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelHierarchyProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_AssetModelHierarchyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('childAssetModelId', cdk.requiredValidator)(properties.childAssetModelId));
    errors.collect(cdk.propertyValidator('childAssetModelId', cdk.validateString)(properties.childAssetModelId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.requiredValidator)(properties.logicalId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.validateString)(properties.logicalId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "AssetModelHierarchyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelHierarchy` resource
 *
 * @param properties - the TypeScript properties of a `AssetModelHierarchyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelHierarchy` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelAssetModelHierarchyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_AssetModelHierarchyPropertyValidator(properties).assertSuccess();
    return {
        ChildAssetModelId: cdk.stringToCloudFormation(properties.childAssetModelId),
        LogicalId: cdk.stringToCloudFormation(properties.logicalId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelHierarchyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelHierarchyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelHierarchyProperty>();
    ret.addPropertyResult('childAssetModelId', 'ChildAssetModelId', cfn_parse.FromCloudFormation.getString(properties.ChildAssetModelId));
    ret.addPropertyResult('logicalId', 'LogicalId', cfn_parse.FromCloudFormation.getString(properties.LogicalId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains information about an asset model property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html
     */
    export interface AssetModelPropertyProperty {
        /**
         * The data type of the asset model property. The value can be `STRING` , `INTEGER` , `DOUBLE` , `BOOLEAN` , or `STRUCT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-datatype
         */
        readonly dataType: string;
        /**
         * The data type of the structure for this property. This parameter exists on properties that have the `STRUCT` data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-datatypespec
         */
        readonly dataTypeSpec?: string;
        /**
         * The `LogicalID` of the asset model property.
         *
         * The maximum length is 256 characters, with the pattern `[^\\ u0000-\\ u001F\\ u007F]+` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-logicalid
         */
        readonly logicalId: string;
        /**
         * The name of the asset model property.
         *
         * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-name
         */
        readonly name: string;
        /**
         * Contains a property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-type
         */
        readonly type: CfnAssetModel.PropertyTypeProperty | cdk.IResolvable;
        /**
         * The unit of the asset model property, such as `Newtons` or `RPM` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-assetmodelproperty.html#cfn-iotsitewise-assetmodel-assetmodelproperty-unit
         */
        readonly unit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AssetModelPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `AssetModelPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_AssetModelPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', cdk.validateString)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataTypeSpec', cdk.validateString)(properties.dataTypeSpec));
    errors.collect(cdk.propertyValidator('logicalId', cdk.requiredValidator)(properties.logicalId));
    errors.collect(cdk.propertyValidator('logicalId', cdk.validateString)(properties.logicalId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', CfnAssetModel_PropertyTypePropertyValidator)(properties.type));
    errors.collect(cdk.propertyValidator('unit', cdk.validateString)(properties.unit));
    return errors.wrap('supplied properties not correct for "AssetModelPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelProperty` resource
 *
 * @param properties - the TypeScript properties of a `AssetModelPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.AssetModelProperty` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelAssetModelPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_AssetModelPropertyPropertyValidator(properties).assertSuccess();
    return {
        DataType: cdk.stringToCloudFormation(properties.dataType),
        DataTypeSpec: cdk.stringToCloudFormation(properties.dataTypeSpec),
        LogicalId: cdk.stringToCloudFormation(properties.logicalId),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cfnAssetModelPropertyTypePropertyToCloudFormation(properties.type),
        Unit: cdk.stringToCloudFormation(properties.unit),
    };
}

// @ts-ignore TS6133
function CfnAssetModelAssetModelPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AssetModelPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AssetModelPropertyProperty>();
    ret.addPropertyResult('dataType', 'DataType', cfn_parse.FromCloudFormation.getString(properties.DataType));
    ret.addPropertyResult('dataTypeSpec', 'DataTypeSpec', properties.DataTypeSpec != null ? cfn_parse.FromCloudFormation.getString(properties.DataTypeSpec) : undefined);
    ret.addPropertyResult('logicalId', 'LogicalId', cfn_parse.FromCloudFormation.getString(properties.LogicalId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', CfnAssetModelPropertyTypePropertyFromCloudFormation(properties.Type));
    ret.addPropertyResult('unit', 'Unit', properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains an asset attribute property. For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#attributes) in the *AWS IoT SiteWise User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-attribute.html
     */
    export interface AttributeProperty {
        /**
         * The default value of the asset model property attribute. All assets that you create from the asset model contain this attribute value. You can update an attribute's value after you create an asset. For more information, see [Updating attribute values](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/update-attribute-values.html) in the *AWS IoT SiteWise User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-attribute.html#cfn-iotsitewise-assetmodel-attribute-defaultvalue
         */
        readonly defaultValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AttributeProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_AttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    return errors.wrap('supplied properties not correct for "AttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Attribute` resource
 *
 * @param properties - the TypeScript properties of a `AttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Attribute` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_AttributePropertyValidator(properties).assertSuccess();
    return {
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
    };
}

// @ts-ignore TS6133
function CfnAssetModelAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.AttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.AttributeProperty>();
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains expression variable information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html
     */
    export interface ExpressionVariableProperty {
        /**
         * The friendly name of the variable to be used in the expression.
         *
         * The maximum length is 64 characters with the pattern `^[a-z][a-z0-9_]*$` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html#cfn-iotsitewise-assetmodel-expressionvariable-name
         */
        readonly name: string;
        /**
         * The variable that identifies an asset property from which to use values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-expressionvariable.html#cfn-iotsitewise-assetmodel-expressionvariable-value
         */
        readonly value: CfnAssetModel.VariableValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExpressionVariableProperty`
 *
 * @param properties - the TypeScript properties of a `ExpressionVariableProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_ExpressionVariablePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', CfnAssetModel_VariableValuePropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "ExpressionVariableProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.ExpressionVariable` resource
 *
 * @param properties - the TypeScript properties of a `ExpressionVariableProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.ExpressionVariable` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelExpressionVariablePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_ExpressionVariablePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cfnAssetModelVariableValuePropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnAssetModelExpressionVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.ExpressionVariableProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('value', 'Value', CfnAssetModelVariableValuePropertyFromCloudFormation(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains an asset metric property. With metrics, you can calculate aggregate functions, such as an average, maximum, or minimum, as specified through an expression. A metric maps several values to a single value (such as a sum).
     *
     * The maximum number of dependent/cascading variables used in any one metric calculation is 10. Therefore, a *root* metric can have up to 10 cascading metrics in its computational dependency tree. Additionally, a metric can only have a data type of `DOUBLE` and consume properties with data types of `INTEGER` or `DOUBLE` .
     *
     * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#metrics) in the *AWS IoT SiteWise User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html
     */
    export interface MetricProperty {
        /**
         * The mathematical expression that defines the metric aggregation function. You can specify up to 10 variables per expression. You can specify up to 10 functions per expression.
         *
         * For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-expression
         */
        readonly expression: string;
        /**
         * The list of variables used in the expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-variables
         */
        readonly variables: Array<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The window (time interval) over which AWS IoT SiteWise computes the metric's aggregation expression. AWS IoT SiteWise computes one data point per `window` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metric.html#cfn-iotsitewise-assetmodel-metric-window
         */
        readonly window: CfnAssetModel.MetricWindowProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricProperty`
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_MetricPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('variables', cdk.requiredValidator)(properties.variables));
    errors.collect(cdk.propertyValidator('variables', cdk.listValidator(CfnAssetModel_ExpressionVariablePropertyValidator))(properties.variables));
    errors.collect(cdk.propertyValidator('window', cdk.requiredValidator)(properties.window));
    errors.collect(cdk.propertyValidator('window', CfnAssetModel_MetricWindowPropertyValidator)(properties.window));
    return errors.wrap('supplied properties not correct for "MetricProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Metric` resource
 *
 * @param properties - the TypeScript properties of a `MetricProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Metric` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelMetricPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_MetricPropertyValidator(properties).assertSuccess();
    return {
        Expression: cdk.stringToCloudFormation(properties.expression),
        Variables: cdk.listMapper(cfnAssetModelExpressionVariablePropertyToCloudFormation)(properties.variables),
        Window: cfnAssetModelMetricWindowPropertyToCloudFormation(properties.window),
    };
}

// @ts-ignore TS6133
function CfnAssetModelMetricPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.MetricProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.MetricProperty>();
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getString(properties.Expression));
    ret.addPropertyResult('variables', 'Variables', cfn_parse.FromCloudFormation.getArray(CfnAssetModelExpressionVariablePropertyFromCloudFormation)(properties.Variables));
    ret.addPropertyResult('window', 'Window', CfnAssetModelMetricWindowPropertyFromCloudFormation(properties.Window));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains a time interval window used for data aggregate computations (for example, average, sum, count, and so on).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metricwindow.html
     */
    export interface MetricWindowProperty {
        /**
         * The tumbling time interval window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-metricwindow.html#cfn-iotsitewise-assetmodel-metricwindow-tumbling
         */
        readonly tumbling?: CfnAssetModel.TumblingWindowProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MetricWindowProperty`
 *
 * @param properties - the TypeScript properties of a `MetricWindowProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_MetricWindowPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tumbling', CfnAssetModel_TumblingWindowPropertyValidator)(properties.tumbling));
    return errors.wrap('supplied properties not correct for "MetricWindowProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.MetricWindow` resource
 *
 * @param properties - the TypeScript properties of a `MetricWindowProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.MetricWindow` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelMetricWindowPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_MetricWindowPropertyValidator(properties).assertSuccess();
    return {
        Tumbling: cfnAssetModelTumblingWindowPropertyToCloudFormation(properties.tumbling),
    };
}

// @ts-ignore TS6133
function CfnAssetModelMetricWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.MetricWindowProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.MetricWindowProperty>();
    ret.addPropertyResult('tumbling', 'Tumbling', properties.Tumbling != null ? CfnAssetModelTumblingWindowPropertyFromCloudFormation(properties.Tumbling) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains a property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html
     */
    export interface PropertyTypeProperty {
        /**
         * Specifies an asset attribute property. An attribute generally contains static information, such as the serial number of an [industrial IoT](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/Internet_of_things#Industrial_applications) wind turbine.
         *
         * This is required if the `TypeName` is `Attribute` and has a `DefaultValue` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-attribute
         */
        readonly attribute?: CfnAssetModel.AttributeProperty | cdk.IResolvable;
        /**
         * Specifies an asset metric property. A metric contains a mathematical expression that uses aggregate functions to process all input data points over a time interval and output a single data point, such as to calculate the average hourly temperature.
         *
         * This is required if the `TypeName` is `Metric` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-metric
         */
        readonly metric?: CfnAssetModel.MetricProperty | cdk.IResolvable;
        /**
         * Specifies an asset transform property. A transform contains a mathematical expression that maps a property's data points from one form to another, such as a unit conversion from Celsius to Fahrenheit.
         *
         * This is required if the `TypeName` is `Transform` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-transform
         */
        readonly transform?: CfnAssetModel.TransformProperty | cdk.IResolvable;
        /**
         * The type of property type, which can be one of `Attribute` , `Measurement` , `Metric` , or `Transform` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-propertytype.html#cfn-iotsitewise-assetmodel-propertytype-typename
         */
        readonly typeName: string;
    }
}

/**
 * Determine whether the given properties match those of a `PropertyTypeProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_PropertyTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attribute', CfnAssetModel_AttributePropertyValidator)(properties.attribute));
    errors.collect(cdk.propertyValidator('metric', CfnAssetModel_MetricPropertyValidator)(properties.metric));
    errors.collect(cdk.propertyValidator('transform', CfnAssetModel_TransformPropertyValidator)(properties.transform));
    errors.collect(cdk.propertyValidator('typeName', cdk.requiredValidator)(properties.typeName));
    errors.collect(cdk.propertyValidator('typeName', cdk.validateString)(properties.typeName));
    return errors.wrap('supplied properties not correct for "PropertyTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.PropertyType` resource
 *
 * @param properties - the TypeScript properties of a `PropertyTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.PropertyType` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelPropertyTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_PropertyTypePropertyValidator(properties).assertSuccess();
    return {
        Attribute: cfnAssetModelAttributePropertyToCloudFormation(properties.attribute),
        Metric: cfnAssetModelMetricPropertyToCloudFormation(properties.metric),
        Transform: cfnAssetModelTransformPropertyToCloudFormation(properties.transform),
        TypeName: cdk.stringToCloudFormation(properties.typeName),
    };
}

// @ts-ignore TS6133
function CfnAssetModelPropertyTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.PropertyTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.PropertyTypeProperty>();
    ret.addPropertyResult('attribute', 'Attribute', properties.Attribute != null ? CfnAssetModelAttributePropertyFromCloudFormation(properties.Attribute) : undefined);
    ret.addPropertyResult('metric', 'Metric', properties.Metric != null ? CfnAssetModelMetricPropertyFromCloudFormation(properties.Metric) : undefined);
    ret.addPropertyResult('transform', 'Transform', properties.Transform != null ? CfnAssetModelTransformPropertyFromCloudFormation(properties.Transform) : undefined);
    ret.addPropertyResult('typeName', 'TypeName', cfn_parse.FromCloudFormation.getString(properties.TypeName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains an asset transform property. A transform is a one-to-one mapping of a property's data points from one form to another. For example, you can use a transform to convert a Celsius data stream to Fahrenheit by applying the transformation expression to each data point of the Celsius stream. Transforms can only input properties that are `INTEGER` , `DOUBLE` , or `BOOLEAN` type. Booleans convert to `0` ( `FALSE` ) and `1` ( `TRUE` )..
     *
     * For more information, see [Defining data properties](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-properties.html#transforms) in the *AWS IoT SiteWise User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html
     */
    export interface TransformProperty {
        /**
         * The mathematical expression that defines the transformation function. You can specify up to 10 variables per expression. You can specify up to 10 functions per expression.
         *
         * For more information, see [Quotas](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/quotas.html) in the *AWS IoT SiteWise User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html#cfn-iotsitewise-assetmodel-transform-expression
         */
        readonly expression: string;
        /**
         * The list of variables used in the expression.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-transform.html#cfn-iotsitewise-assetmodel-transform-variables
         */
        readonly variables: Array<CfnAssetModel.ExpressionVariableProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TransformProperty`
 *
 * @param properties - the TypeScript properties of a `TransformProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_TransformPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('variables', cdk.requiredValidator)(properties.variables));
    errors.collect(cdk.propertyValidator('variables', cdk.listValidator(CfnAssetModel_ExpressionVariablePropertyValidator))(properties.variables));
    return errors.wrap('supplied properties not correct for "TransformProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Transform` resource
 *
 * @param properties - the TypeScript properties of a `TransformProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.Transform` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelTransformPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_TransformPropertyValidator(properties).assertSuccess();
    return {
        Expression: cdk.stringToCloudFormation(properties.expression),
        Variables: cdk.listMapper(cfnAssetModelExpressionVariablePropertyToCloudFormation)(properties.variables),
    };
}

// @ts-ignore TS6133
function CfnAssetModelTransformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.TransformProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.TransformProperty>();
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getString(properties.Expression));
    ret.addPropertyResult('variables', 'Variables', cfn_parse.FromCloudFormation.getArray(CfnAssetModelExpressionVariablePropertyFromCloudFormation)(properties.Variables));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Contains a tumbling window, which is a repeating fixed-sized, non-overlapping, and contiguous time window. You can use this window in metrics to aggregate data from properties and other assets.
     *
     * You can use `m` , `h` , `d` , and `w` when you specify an interval or offset. Note that `m` represents minutes, `h` represents hours, `d` represents days, and `w` represents weeks. You can also use `s` to represent seconds in `offset` .
     *
     * The `interval` and `offset` parameters support the [ISO 8601 format](https://docs.aws.amazon.com/https://en.wikipedia.org/wiki/ISO_8601) . For example, `PT5S` represents 5 seconds, `PT5M` represents 5 minutes, and `PT5H` represents 5 hours.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html
     */
    export interface TumblingWindowProperty {
        /**
         * The time interval for the tumbling window. The interval time must be between 1 minute and 1 week.
         *
         * AWS IoT SiteWise computes the `1w` interval the end of Sunday at midnight each week (UTC), the `1d` interval at the end of each day at midnight (UTC), the `1h` interval at the end of each hour, and so on.
         *
         * When AWS IoT SiteWise aggregates data points for metric computations, the start of each interval is exclusive and the end of each interval is inclusive. AWS IoT SiteWise places the computed data point at the end of the interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html#cfn-iotsitewise-assetmodel-tumblingwindow-interval
         */
        readonly interval: string;
        /**
         * The offset for the tumbling window. The `offset` parameter accepts the following:
         *
         * - The offset time.
         *
         * For example, if you specify `18h` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
         *
         * - If you create the metric before or at 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) on the day when you create the metric.
         * - If you create the metric after 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) the next day.
         * - The ISO 8601 format.
         *
         * For example, if you specify `PT18H` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
         *
         * - If you create the metric before or at 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) on the day when you create the metric.
         * - If you create the metric after 6 PM (UTC), you get the first aggregation result at 6 PM (UTC) the next day.
         * - The 24-hour clock.
         *
         * For example, if you specify `00:03:00` for `offset` , `5m` for `interval` , and you create the metric at 2 PM (UTC), you get the first aggregation result at 2:03 PM (UTC). You get the second aggregation result at 2:08 PM (UTC).
         * - The offset time zone.
         *
         * For example, if you specify `2021-07-23T18:00-08` for `offset` and `1d` for `interval` , AWS IoT SiteWise aggregates data in one of the following ways:
         *
         * - If you create the metric before or at 6 PM (PST), you get the first aggregation result at 6 PM (PST) on the day when you create the metric.
         * - If you create the metric after 6 PM (PST), you get the first aggregation result at 6 PM (PST) the next day.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-tumblingwindow.html#cfn-iotsitewise-assetmodel-tumblingwindow-offset
         */
        readonly offset?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TumblingWindowProperty`
 *
 * @param properties - the TypeScript properties of a `TumblingWindowProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_TumblingWindowPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('interval', cdk.requiredValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('interval', cdk.validateString)(properties.interval));
    errors.collect(cdk.propertyValidator('offset', cdk.validateString)(properties.offset));
    return errors.wrap('supplied properties not correct for "TumblingWindowProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.TumblingWindow` resource
 *
 * @param properties - the TypeScript properties of a `TumblingWindowProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.TumblingWindow` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelTumblingWindowPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_TumblingWindowPropertyValidator(properties).assertSuccess();
    return {
        Interval: cdk.stringToCloudFormation(properties.interval),
        Offset: cdk.stringToCloudFormation(properties.offset),
    };
}

// @ts-ignore TS6133
function CfnAssetModelTumblingWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.TumblingWindowProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.TumblingWindowProperty>();
    ret.addPropertyResult('interval', 'Interval', cfn_parse.FromCloudFormation.getString(properties.Interval));
    ret.addPropertyResult('offset', 'Offset', properties.Offset != null ? cfn_parse.FromCloudFormation.getString(properties.Offset) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnAssetModel {
    /**
     * Identifies a property value used in an expression.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html
     */
    export interface VariableValueProperty {
        /**
         * The `LogicalID` of the hierarchy to query for the `PropertyLogicalID` .
         *
         * You use a `hierarchyLogicalID` instead of a model ID because you can have several hierarchies using the same model and therefore the same property. For example, you might have separately grouped assets that come from the same asset model. For more information, see [Defining relationships between assets](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/asset-hierarchies.html) in the *AWS IoT SiteWise User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html#cfn-iotsitewise-assetmodel-variablevalue-hierarchylogicalid
         */
        readonly hierarchyLogicalId?: string;
        /**
         * The `LogicalID` of the property to use as the variable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-assetmodel-variablevalue.html#cfn-iotsitewise-assetmodel-variablevalue-propertylogicalid
         */
        readonly propertyLogicalId: string;
    }
}

/**
 * Determine whether the given properties match those of a `VariableValueProperty`
 *
 * @param properties - the TypeScript properties of a `VariableValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnAssetModel_VariableValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hierarchyLogicalId', cdk.validateString)(properties.hierarchyLogicalId));
    errors.collect(cdk.propertyValidator('propertyLogicalId', cdk.requiredValidator)(properties.propertyLogicalId));
    errors.collect(cdk.propertyValidator('propertyLogicalId', cdk.validateString)(properties.propertyLogicalId));
    return errors.wrap('supplied properties not correct for "VariableValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.VariableValue` resource
 *
 * @param properties - the TypeScript properties of a `VariableValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::AssetModel.VariableValue` resource.
 */
// @ts-ignore TS6133
function cfnAssetModelVariableValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAssetModel_VariableValuePropertyValidator(properties).assertSuccess();
    return {
        HierarchyLogicalId: cdk.stringToCloudFormation(properties.hierarchyLogicalId),
        PropertyLogicalId: cdk.stringToCloudFormation(properties.propertyLogicalId),
    };
}

// @ts-ignore TS6133
function CfnAssetModelVariableValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetModel.VariableValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetModel.VariableValueProperty>();
    ret.addPropertyResult('hierarchyLogicalId', 'HierarchyLogicalId', properties.HierarchyLogicalId != null ? cfn_parse.FromCloudFormation.getString(properties.HierarchyLogicalId) : undefined);
    ret.addPropertyResult('propertyLogicalId', 'PropertyLogicalId', cfn_parse.FromCloudFormation.getString(properties.PropertyLogicalId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDashboard`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html
 */
export interface CfnDashboardProps {

    /**
     * The dashboard definition specified in a JSON literal. For detailed information, see [Creating dashboards (CLI)](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/create-dashboards-using-aws-cli.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddefinition
     */
    readonly dashboardDefinition: string;

    /**
     * A description for the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddescription
     */
    readonly dashboardDescription: string;

    /**
     * A friendly name for the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboardname
     */
    readonly dashboardName: string;

    /**
     * The ID of the project in which to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-projectid
     */
    readonly projectId?: string;

    /**
     * A list of key-value pairs that contain metadata for the dashboard. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDashboardProps`
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the result of the validation.
 */
function CfnDashboardPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dashboardDefinition', cdk.requiredValidator)(properties.dashboardDefinition));
    errors.collect(cdk.propertyValidator('dashboardDefinition', cdk.validateString)(properties.dashboardDefinition));
    errors.collect(cdk.propertyValidator('dashboardDescription', cdk.requiredValidator)(properties.dashboardDescription));
    errors.collect(cdk.propertyValidator('dashboardDescription', cdk.validateString)(properties.dashboardDescription));
    errors.collect(cdk.propertyValidator('dashboardName', cdk.requiredValidator)(properties.dashboardName));
    errors.collect(cdk.propertyValidator('dashboardName', cdk.validateString)(properties.dashboardName));
    errors.collect(cdk.propertyValidator('projectId', cdk.validateString)(properties.projectId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDashboardProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Dashboard` resource
 *
 * @param properties - the TypeScript properties of a `CfnDashboardProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Dashboard` resource.
 */
// @ts-ignore TS6133
function cfnDashboardPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDashboardPropsValidator(properties).assertSuccess();
    return {
        DashboardDefinition: cdk.stringToCloudFormation(properties.dashboardDefinition),
        DashboardDescription: cdk.stringToCloudFormation(properties.dashboardDescription),
        DashboardName: cdk.stringToCloudFormation(properties.dashboardName),
        ProjectId: cdk.stringToCloudFormation(properties.projectId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDashboardPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDashboardProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDashboardProps>();
    ret.addPropertyResult('dashboardDefinition', 'DashboardDefinition', cfn_parse.FromCloudFormation.getString(properties.DashboardDefinition));
    ret.addPropertyResult('dashboardDescription', 'DashboardDescription', cfn_parse.FromCloudFormation.getString(properties.DashboardDescription));
    ret.addPropertyResult('dashboardName', 'DashboardName', cfn_parse.FromCloudFormation.getString(properties.DashboardName));
    ret.addPropertyResult('projectId', 'ProjectId', properties.ProjectId != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::Dashboard`
 *
 * Creates a dashboard in an AWS IoT SiteWise Monitor project.
 *
 * @cloudformationResource AWS::IoTSiteWise::Dashboard
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html
 */
export class CfnDashboard extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::Dashboard";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDashboard {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDashboardPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDashboard(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the dashboard, which has the following format.
     *
     * `arn:${Partition}:iotsitewise:${Region}:${Account}:dashboard/${DashboardId}`
     * @cloudformationAttribute DashboardArn
     */
    public readonly attrDashboardArn: string;

    /**
     * The ID of the dashboard.
     * @cloudformationAttribute DashboardId
     */
    public readonly attrDashboardId: string;

    /**
     * The dashboard definition specified in a JSON literal. For detailed information, see [Creating dashboards (CLI)](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/create-dashboards-using-aws-cli.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddefinition
     */
    public dashboardDefinition: string;

    /**
     * A description for the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboarddescription
     */
    public dashboardDescription: string;

    /**
     * A friendly name for the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-dashboardname
     */
    public dashboardName: string;

    /**
     * The ID of the project in which to create the dashboard.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-projectid
     */
    public projectId: string | undefined;

    /**
     * A list of key-value pairs that contain metadata for the dashboard. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-dashboard.html#cfn-iotsitewise-dashboard-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::Dashboard`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDashboardProps) {
        super(scope, id, { type: CfnDashboard.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dashboardDefinition', this);
        cdk.requireProperty(props, 'dashboardDescription', this);
        cdk.requireProperty(props, 'dashboardName', this);
        this.attrDashboardArn = cdk.Token.asString(this.getAtt('DashboardArn', cdk.ResolutionTypeHint.STRING));
        this.attrDashboardId = cdk.Token.asString(this.getAtt('DashboardId', cdk.ResolutionTypeHint.STRING));

        this.dashboardDefinition = props.dashboardDefinition;
        this.dashboardDescription = props.dashboardDescription;
        this.dashboardName = props.dashboardName;
        this.projectId = props.projectId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Dashboard", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDashboard.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dashboardDefinition: this.dashboardDefinition,
            dashboardDescription: this.dashboardDescription,
            dashboardName: this.dashboardName,
            projectId: this.projectId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDashboardPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnGateway`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html
 */
export interface CfnGatewayProps {

    /**
     * A unique, friendly name for the gateway.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayname
     */
    readonly gatewayName: string;

    /**
     * The gateway's platform. You can only specify one platform in a gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayplatform
     */
    readonly gatewayPlatform: CfnGateway.GatewayPlatformProperty | cdk.IResolvable;

    /**
     * A list of gateway capability summaries that each contain a namespace and status. Each gateway capability defines data sources for the gateway. To retrieve a capability configuration's definition, use [DescribeGatewayCapabilityConfiguration](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeGatewayCapabilityConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewaycapabilitysummaries
     */
    readonly gatewayCapabilitySummaries?: Array<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of key-value pairs that contain metadata for the gateway. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnGatewayProps`
 *
 * @returns the result of the validation.
 */
function CfnGatewayPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gatewayCapabilitySummaries', cdk.listValidator(CfnGateway_GatewayCapabilitySummaryPropertyValidator))(properties.gatewayCapabilitySummaries));
    errors.collect(cdk.propertyValidator('gatewayName', cdk.requiredValidator)(properties.gatewayName));
    errors.collect(cdk.propertyValidator('gatewayName', cdk.validateString)(properties.gatewayName));
    errors.collect(cdk.propertyValidator('gatewayPlatform', cdk.requiredValidator)(properties.gatewayPlatform));
    errors.collect(cdk.propertyValidator('gatewayPlatform', CfnGateway_GatewayPlatformPropertyValidator)(properties.gatewayPlatform));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnGatewayProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway` resource
 *
 * @param properties - the TypeScript properties of a `CfnGatewayProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway` resource.
 */
// @ts-ignore TS6133
function cfnGatewayPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGatewayPropsValidator(properties).assertSuccess();
    return {
        GatewayName: cdk.stringToCloudFormation(properties.gatewayName),
        GatewayPlatform: cfnGatewayGatewayPlatformPropertyToCloudFormation(properties.gatewayPlatform),
        GatewayCapabilitySummaries: cdk.listMapper(cfnGatewayGatewayCapabilitySummaryPropertyToCloudFormation)(properties.gatewayCapabilitySummaries),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGatewayProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGatewayProps>();
    ret.addPropertyResult('gatewayName', 'GatewayName', cfn_parse.FromCloudFormation.getString(properties.GatewayName));
    ret.addPropertyResult('gatewayPlatform', 'GatewayPlatform', CfnGatewayGatewayPlatformPropertyFromCloudFormation(properties.GatewayPlatform));
    ret.addPropertyResult('gatewayCapabilitySummaries', 'GatewayCapabilitySummaries', properties.GatewayCapabilitySummaries != null ? cfn_parse.FromCloudFormation.getArray(CfnGatewayGatewayCapabilitySummaryPropertyFromCloudFormation)(properties.GatewayCapabilitySummaries) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::Gateway`
 *
 * Creates a gateway, which is a virtual or edge device that delivers industrial data streams from local servers to AWS IoT SiteWise . For more information, see [Ingesting data using a gateway](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gateway-connector.html) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Gateway
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html
 */
export class CfnGateway extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::Gateway";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGateway {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGatewayPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGateway(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID for the gateway.
     * @cloudformationAttribute GatewayId
     */
    public readonly attrGatewayId: string;

    /**
     * A unique, friendly name for the gateway.
     *
     * The maximum length is 256 characters with the pattern `[^\ u0000-\ u001F\ u007F]+` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayname
     */
    public gatewayName: string;

    /**
     * The gateway's platform. You can only specify one platform in a gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewayplatform
     */
    public gatewayPlatform: CfnGateway.GatewayPlatformProperty | cdk.IResolvable;

    /**
     * A list of gateway capability summaries that each contain a namespace and status. Each gateway capability defines data sources for the gateway. To retrieve a capability configuration's definition, use [DescribeGatewayCapabilityConfiguration](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeGatewayCapabilityConfiguration.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-gatewaycapabilitysummaries
     */
    public gatewayCapabilitySummaries: Array<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of key-value pairs that contain metadata for the gateway. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-gateway.html#cfn-iotsitewise-gateway-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::Gateway`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGatewayProps) {
        super(scope, id, { type: CfnGateway.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'gatewayName', this);
        cdk.requireProperty(props, 'gatewayPlatform', this);
        this.attrGatewayId = cdk.Token.asString(this.getAtt('GatewayId', cdk.ResolutionTypeHint.STRING));

        this.gatewayName = props.gatewayName;
        this.gatewayPlatform = props.gatewayPlatform;
        this.gatewayCapabilitySummaries = props.gatewayCapabilitySummaries;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Gateway", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGateway.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            gatewayName: this.gatewayName,
            gatewayPlatform: this.gatewayPlatform,
            gatewayCapabilitySummaries: this.gatewayCapabilitySummaries,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGatewayPropsToCloudFormation(props);
    }
}

export namespace CfnGateway {
    /**
     * Contains a summary of a gateway capability configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html
     */
    export interface GatewayCapabilitySummaryProperty {
        /**
         * The JSON document that defines the configuration for the gateway capability. For more information, see [Configuring data sources (CLI)](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/configure-sources.html#configure-source-cli) in the *AWS IoT SiteWise User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html#cfn-iotsitewise-gateway-gatewaycapabilitysummary-capabilityconfiguration
         */
        readonly capabilityConfiguration?: string;
        /**
         * The namespace of the capability configuration. For example, if you configure OPC-UA sources from the AWS IoT SiteWise console, your OPC-UA capability configuration has the namespace `iotsitewise:opcuacollector:version` , where `version` is a number such as `1` .
         *
         * The maximum length is 512 characters with the pattern `^[a-zA-Z]+:[a-zA-Z]+:[0-9]+$` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewaycapabilitysummary.html#cfn-iotsitewise-gateway-gatewaycapabilitysummary-capabilitynamespace
         */
        readonly capabilityNamespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayCapabilitySummaryProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayCapabilitySummaryProperty`
 *
 * @returns the result of the validation.
 */
function CfnGateway_GatewayCapabilitySummaryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capabilityConfiguration', cdk.validateString)(properties.capabilityConfiguration));
    errors.collect(cdk.propertyValidator('capabilityNamespace', cdk.requiredValidator)(properties.capabilityNamespace));
    errors.collect(cdk.propertyValidator('capabilityNamespace', cdk.validateString)(properties.capabilityNamespace));
    return errors.wrap('supplied properties not correct for "GatewayCapabilitySummaryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GatewayCapabilitySummary` resource
 *
 * @param properties - the TypeScript properties of a `GatewayCapabilitySummaryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GatewayCapabilitySummary` resource.
 */
// @ts-ignore TS6133
function cfnGatewayGatewayCapabilitySummaryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGateway_GatewayCapabilitySummaryPropertyValidator(properties).assertSuccess();
    return {
        CapabilityConfiguration: cdk.stringToCloudFormation(properties.capabilityConfiguration),
        CapabilityNamespace: cdk.stringToCloudFormation(properties.capabilityNamespace),
    };
}

// @ts-ignore TS6133
function CfnGatewayGatewayCapabilitySummaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GatewayCapabilitySummaryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GatewayCapabilitySummaryProperty>();
    ret.addPropertyResult('capabilityConfiguration', 'CapabilityConfiguration', properties.CapabilityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.CapabilityConfiguration) : undefined);
    ret.addPropertyResult('capabilityNamespace', 'CapabilityNamespace', cfn_parse.FromCloudFormation.getString(properties.CapabilityNamespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGateway {
    /**
     * Contains a gateway's platform information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html
     */
    export interface GatewayPlatformProperty {
        /**
         * A gateway that runs on AWS IoT Greengrass .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html#cfn-iotsitewise-gateway-gatewayplatform-greengrass
         */
        readonly greengrass?: CfnGateway.GreengrassProperty | cdk.IResolvable;
        /**
         * A gateway that runs on AWS IoT Greengrass V2.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-gatewayplatform.html#cfn-iotsitewise-gateway-gatewayplatform-greengrassv2
         */
        readonly greengrassV2?: CfnGateway.GreengrassV2Property | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GatewayPlatformProperty`
 *
 * @param properties - the TypeScript properties of a `GatewayPlatformProperty`
 *
 * @returns the result of the validation.
 */
function CfnGateway_GatewayPlatformPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('greengrass', CfnGateway_GreengrassPropertyValidator)(properties.greengrass));
    errors.collect(cdk.propertyValidator('greengrassV2', CfnGateway_GreengrassV2PropertyValidator)(properties.greengrassV2));
    return errors.wrap('supplied properties not correct for "GatewayPlatformProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GatewayPlatform` resource
 *
 * @param properties - the TypeScript properties of a `GatewayPlatformProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GatewayPlatform` resource.
 */
// @ts-ignore TS6133
function cfnGatewayGatewayPlatformPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGateway_GatewayPlatformPropertyValidator(properties).assertSuccess();
    return {
        Greengrass: cfnGatewayGreengrassPropertyToCloudFormation(properties.greengrass),
        GreengrassV2: cfnGatewayGreengrassV2PropertyToCloudFormation(properties.greengrassV2),
    };
}

// @ts-ignore TS6133
function CfnGatewayGatewayPlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GatewayPlatformProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GatewayPlatformProperty>();
    ret.addPropertyResult('greengrass', 'Greengrass', properties.Greengrass != null ? CfnGatewayGreengrassPropertyFromCloudFormation(properties.Greengrass) : undefined);
    ret.addPropertyResult('greengrassV2', 'GreengrassV2', properties.GreengrassV2 != null ? CfnGatewayGreengrassV2PropertyFromCloudFormation(properties.GreengrassV2) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGateway {
    /**
     * Contains details for a gateway that runs on AWS IoT Greengrass . To create a gateway that runs on AWS IoT Greengrass , you must add the IoT SiteWise connector to a Greengrass group and deploy it. Your Greengrass group must also have permissions to upload data to AWS IoT SiteWise . For more information, see [Ingesting data using a gateway](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/gateway-connector.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrass.html
     */
    export interface GreengrassProperty {
        /**
         * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the Greengrass group. For more information about how to find a group's ARN, see [ListGroups](https://docs.aws.amazon.com/greengrass/latest/apireference/listgroups-get.html) and [GetGroup](https://docs.aws.amazon.com/greengrass/latest/apireference/getgroup-get.html) in the *AWS IoT Greengrass API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrass.html#cfn-iotsitewise-gateway-greengrass-grouparn
         */
        readonly groupArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `GreengrassProperty`
 *
 * @param properties - the TypeScript properties of a `GreengrassProperty`
 *
 * @returns the result of the validation.
 */
function CfnGateway_GreengrassPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupArn', cdk.requiredValidator)(properties.groupArn));
    errors.collect(cdk.propertyValidator('groupArn', cdk.validateString)(properties.groupArn));
    return errors.wrap('supplied properties not correct for "GreengrassProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.Greengrass` resource
 *
 * @param properties - the TypeScript properties of a `GreengrassProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.Greengrass` resource.
 */
// @ts-ignore TS6133
function cfnGatewayGreengrassPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGateway_GreengrassPropertyValidator(properties).assertSuccess();
    return {
        GroupArn: cdk.stringToCloudFormation(properties.groupArn),
    };
}

// @ts-ignore TS6133
function CfnGatewayGreengrassPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GreengrassProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GreengrassProperty>();
    ret.addPropertyResult('groupArn', 'GroupArn', cfn_parse.FromCloudFormation.getString(properties.GroupArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnGateway {
    /**
     * Contains details for a gateway that runs on AWS IoT Greengrass V2. To create a gateway that runs on AWS IoT Greengrass V2, you must deploy the IoT SiteWise Edge component to your gateway device. Your [Greengrass device role](https://docs.aws.amazon.com/greengrass/v2/developerguide/device-service-role.html) must use the `AWSIoTSiteWiseEdgeAccess` policy. For more information, see [Using AWS IoT SiteWise at the edge](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/sw-gateways.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrassv2.html
     */
    export interface GreengrassV2Property {
        /**
         * The name of the AWS IoT thing for your AWS IoT Greengrass V2 core device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-gateway-greengrassv2.html#cfn-iotsitewise-gateway-greengrassv2-coredevicethingname
         */
        readonly coreDeviceThingName: string;
    }
}

/**
 * Determine whether the given properties match those of a `GreengrassV2Property`
 *
 * @param properties - the TypeScript properties of a `GreengrassV2Property`
 *
 * @returns the result of the validation.
 */
function CfnGateway_GreengrassV2PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coreDeviceThingName', cdk.requiredValidator)(properties.coreDeviceThingName));
    errors.collect(cdk.propertyValidator('coreDeviceThingName', cdk.validateString)(properties.coreDeviceThingName));
    return errors.wrap('supplied properties not correct for "GreengrassV2Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GreengrassV2` resource
 *
 * @param properties - the TypeScript properties of a `GreengrassV2Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Gateway.GreengrassV2` resource.
 */
// @ts-ignore TS6133
function cfnGatewayGreengrassV2PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGateway_GreengrassV2PropertyValidator(properties).assertSuccess();
    return {
        CoreDeviceThingName: cdk.stringToCloudFormation(properties.coreDeviceThingName),
    };
}

// @ts-ignore TS6133
function CfnGatewayGreengrassV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGateway.GreengrassV2Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGateway.GreengrassV2Property>();
    ret.addPropertyResult('coreDeviceThingName', 'CoreDeviceThingName', cfn_parse.FromCloudFormation.getString(properties.CoreDeviceThingName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPortal`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html
 */
export interface CfnPortalProps {

    /**
     * The AWS administrator's contact email address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalcontactemail
     */
    readonly portalContactEmail: string;

    /**
     * A friendly name for the portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalname
     */
    readonly portalName: string;

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of a service role that allows the portal's users to access your AWS IoT SiteWise resources on your behalf. For more information, see [Using service roles for AWS IoT SiteWise Monitor](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-service-role.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-rolearn
     */
    readonly roleArn: string;

    /**
     * Contains the configuration information of an alarm created in an AWS IoT SiteWise Monitor portal. You can use the alarm to monitor an asset property and get notified when the asset property value is outside a specified range. For more information, see [Monitoring with alarms](https://docs.aws.amazon.com/iot-sitewise/latest/appguide/monitor-alarms.html) in the *AWS IoT SiteWise Application Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-alarms
     */
    readonly alarms?: any | cdk.IResolvable;

    /**
     * The email address that sends alarm notifications.
     *
     * > If you use the [AWS IoT Events managed Lambda function](https://docs.aws.amazon.com/iotevents/latest/developerguide/lambda-support.html) to manage your emails, you must [verify the sender email address in Amazon SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-notificationsenderemail
     */
    readonly notificationSenderEmail?: string;

    /**
     * The service to use to authenticate users to the portal. Choose from the following options:
     *
     * - `SSO` – The portal uses AWS IAM Identity Center (successor to AWS Single Sign-On) to authenticate users and manage user permissions. Before you can create a portal that uses IAM Identity Center , you must enable IAM Identity Center . For more information, see [Enabling IAM Identity Center](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-get-started.html#mon-gs-sso) in the *AWS IoT SiteWise User Guide* . This option is only available in AWS Regions other than the China Regions.
     * - `IAM` – The portal uses AWS Identity and Access Management ( IAM ) to authenticate users and manage user permissions.
     *
     * You can't change this value after you create a portal.
     *
     * Default: `SSO`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalauthmode
     */
    readonly portalAuthMode?: string;

    /**
     * A description for the portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portaldescription
     */
    readonly portalDescription?: string;

    /**
     * A list of key-value pairs that contain metadata for the portal. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPortalProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortalProps`
 *
 * @returns the result of the validation.
 */
function CfnPortalPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarms', cdk.validateObject)(properties.alarms));
    errors.collect(cdk.propertyValidator('notificationSenderEmail', cdk.validateString)(properties.notificationSenderEmail));
    errors.collect(cdk.propertyValidator('portalAuthMode', cdk.validateString)(properties.portalAuthMode));
    errors.collect(cdk.propertyValidator('portalContactEmail', cdk.requiredValidator)(properties.portalContactEmail));
    errors.collect(cdk.propertyValidator('portalContactEmail', cdk.validateString)(properties.portalContactEmail));
    errors.collect(cdk.propertyValidator('portalDescription', cdk.validateString)(properties.portalDescription));
    errors.collect(cdk.propertyValidator('portalName', cdk.requiredValidator)(properties.portalName));
    errors.collect(cdk.propertyValidator('portalName', cdk.validateString)(properties.portalName));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPortalProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Portal` resource
 *
 * @param properties - the TypeScript properties of a `CfnPortalProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Portal` resource.
 */
// @ts-ignore TS6133
function cfnPortalPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortalPropsValidator(properties).assertSuccess();
    return {
        PortalContactEmail: cdk.stringToCloudFormation(properties.portalContactEmail),
        PortalName: cdk.stringToCloudFormation(properties.portalName),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Alarms: cdk.objectToCloudFormation(properties.alarms),
        NotificationSenderEmail: cdk.stringToCloudFormation(properties.notificationSenderEmail),
        PortalAuthMode: cdk.stringToCloudFormation(properties.portalAuthMode),
        PortalDescription: cdk.stringToCloudFormation(properties.portalDescription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPortalPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortalProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortalProps>();
    ret.addPropertyResult('portalContactEmail', 'PortalContactEmail', cfn_parse.FromCloudFormation.getString(properties.PortalContactEmail));
    ret.addPropertyResult('portalName', 'PortalName', cfn_parse.FromCloudFormation.getString(properties.PortalName));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('alarms', 'Alarms', properties.Alarms != null ? cfn_parse.FromCloudFormation.getAny(properties.Alarms) : undefined);
    ret.addPropertyResult('notificationSenderEmail', 'NotificationSenderEmail', properties.NotificationSenderEmail != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationSenderEmail) : undefined);
    ret.addPropertyResult('portalAuthMode', 'PortalAuthMode', properties.PortalAuthMode != null ? cfn_parse.FromCloudFormation.getString(properties.PortalAuthMode) : undefined);
    ret.addPropertyResult('portalDescription', 'PortalDescription', properties.PortalDescription != null ? cfn_parse.FromCloudFormation.getString(properties.PortalDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::Portal`
 *
 * Creates a portal, which can contain projects and dashboards. Before you can create a portal, you must enable IAM Identity Center . AWS IoT SiteWise Monitor uses IAM Identity Center to manage user permissions. For more information, see [Enabling IAM Identity Center](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-get-started.html#mon-gs-sso) in the *AWS IoT SiteWise User Guide* .
 *
 * > Before you can sign in to a new portal, you must add at least one IAM Identity Center user or group to that portal. For more information, see [Adding or removing portal administrators](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/administer-portals.html#portal-change-admins) in the *AWS IoT SiteWise User Guide* .
 *
 * @cloudformationResource AWS::IoTSiteWise::Portal
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html
 */
export class CfnPortal extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::Portal";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortal {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPortalPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPortal(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the portal, which has the following format.
     *
     * `arn:${Partition}:iotsitewise:${Region}:${Account}:portal/${PortalId}`
     * @cloudformationAttribute PortalArn
     */
    public readonly attrPortalArn: string;

    /**
     * The IAM Identity Center application generated client ID (used with IAM Identity Center APIs).
     * @cloudformationAttribute PortalClientId
     */
    public readonly attrPortalClientId: string;

    /**
     * The ID of the created portal.
     * @cloudformationAttribute PortalId
     */
    public readonly attrPortalId: string;

    /**
     * The public URL for the AWS IoT SiteWise Monitor portal.
     * @cloudformationAttribute PortalStartUrl
     */
    public readonly attrPortalStartUrl: string;

    /**
     * The AWS administrator's contact email address.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalcontactemail
     */
    public portalContactEmail: string;

    /**
     * A friendly name for the portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalname
     */
    public portalName: string;

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of a service role that allows the portal's users to access your AWS IoT SiteWise resources on your behalf. For more information, see [Using service roles for AWS IoT SiteWise Monitor](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-service-role.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-rolearn
     */
    public roleArn: string;

    /**
     * Contains the configuration information of an alarm created in an AWS IoT SiteWise Monitor portal. You can use the alarm to monitor an asset property and get notified when the asset property value is outside a specified range. For more information, see [Monitoring with alarms](https://docs.aws.amazon.com/iot-sitewise/latest/appguide/monitor-alarms.html) in the *AWS IoT SiteWise Application Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-alarms
     */
    public alarms: any | cdk.IResolvable | undefined;

    /**
     * The email address that sends alarm notifications.
     *
     * > If you use the [AWS IoT Events managed Lambda function](https://docs.aws.amazon.com/iotevents/latest/developerguide/lambda-support.html) to manage your emails, you must [verify the sender email address in Amazon SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-notificationsenderemail
     */
    public notificationSenderEmail: string | undefined;

    /**
     * The service to use to authenticate users to the portal. Choose from the following options:
     *
     * - `SSO` – The portal uses AWS IAM Identity Center (successor to AWS Single Sign-On) to authenticate users and manage user permissions. Before you can create a portal that uses IAM Identity Center , you must enable IAM Identity Center . For more information, see [Enabling IAM Identity Center](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/monitor-get-started.html#mon-gs-sso) in the *AWS IoT SiteWise User Guide* . This option is only available in AWS Regions other than the China Regions.
     * - `IAM` – The portal uses AWS Identity and Access Management ( IAM ) to authenticate users and manage user permissions.
     *
     * You can't change this value after you create a portal.
     *
     * Default: `SSO`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portalauthmode
     */
    public portalAuthMode: string | undefined;

    /**
     * A description for the portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-portaldescription
     */
    public portalDescription: string | undefined;

    /**
     * A list of key-value pairs that contain metadata for the portal. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-portal.html#cfn-iotsitewise-portal-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::Portal`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPortalProps) {
        super(scope, id, { type: CfnPortal.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portalContactEmail', this);
        cdk.requireProperty(props, 'portalName', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrPortalArn = cdk.Token.asString(this.getAtt('PortalArn', cdk.ResolutionTypeHint.STRING));
        this.attrPortalClientId = cdk.Token.asString(this.getAtt('PortalClientId', cdk.ResolutionTypeHint.STRING));
        this.attrPortalId = cdk.Token.asString(this.getAtt('PortalId', cdk.ResolutionTypeHint.STRING));
        this.attrPortalStartUrl = cdk.Token.asString(this.getAtt('PortalStartUrl', cdk.ResolutionTypeHint.STRING));

        this.portalContactEmail = props.portalContactEmail;
        this.portalName = props.portalName;
        this.roleArn = props.roleArn;
        this.alarms = props.alarms;
        this.notificationSenderEmail = props.notificationSenderEmail;
        this.portalAuthMode = props.portalAuthMode;
        this.portalDescription = props.portalDescription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Portal", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortal.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portalContactEmail: this.portalContactEmail,
            portalName: this.portalName,
            roleArn: this.roleArn,
            alarms: this.alarms,
            notificationSenderEmail: this.notificationSenderEmail,
            portalAuthMode: this.portalAuthMode,
            portalDescription: this.portalDescription,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPortalPropsToCloudFormation(props);
    }
}

export namespace CfnPortal {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html
     */
    export interface AlarmsProperty {
        /**
         * `CfnPortal.AlarmsProperty.AlarmRoleArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html#cfn-iotsitewise-portal-alarms-alarmrolearn
         */
        readonly alarmRoleArn?: string;
        /**
         * `CfnPortal.AlarmsProperty.NotificationLambdaArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotsitewise-portal-alarms.html#cfn-iotsitewise-portal-alarms-notificationlambdaarn
         */
        readonly notificationLambdaArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AlarmsProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmsProperty`
 *
 * @returns the result of the validation.
 */
function CfnPortal_AlarmsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alarmRoleArn', cdk.validateString)(properties.alarmRoleArn));
    errors.collect(cdk.propertyValidator('notificationLambdaArn', cdk.validateString)(properties.notificationLambdaArn));
    return errors.wrap('supplied properties not correct for "AlarmsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Portal.Alarms` resource
 *
 * @param properties - the TypeScript properties of a `AlarmsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Portal.Alarms` resource.
 */
// @ts-ignore TS6133
function cfnPortalAlarmsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPortal_AlarmsPropertyValidator(properties).assertSuccess();
    return {
        AlarmRoleArn: cdk.stringToCloudFormation(properties.alarmRoleArn),
        NotificationLambdaArn: cdk.stringToCloudFormation(properties.notificationLambdaArn),
    };
}

// @ts-ignore TS6133
function CfnPortalAlarmsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortal.AlarmsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortal.AlarmsProperty>();
    ret.addPropertyResult('alarmRoleArn', 'AlarmRoleArn', properties.AlarmRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmRoleArn) : undefined);
    ret.addPropertyResult('notificationLambdaArn', 'NotificationLambdaArn', properties.NotificationLambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.NotificationLambdaArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html
 */
export interface CfnProjectProps {

    /**
     * The ID of the portal in which to create the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-portalid
     */
    readonly portalId: string;

    /**
     * A friendly name for the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectname
     */
    readonly projectName: string;

    /**
     * A list that contains the IDs of each asset associated with the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-assetids
     */
    readonly assetIds?: string[];

    /**
     * A description for the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectdescription
     */
    readonly projectDescription?: string;

    /**
     * A list of key-value pairs that contain metadata for the project. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assetIds', cdk.listValidator(cdk.validateString))(properties.assetIds));
    errors.collect(cdk.propertyValidator('portalId', cdk.requiredValidator)(properties.portalId));
    errors.collect(cdk.propertyValidator('portalId', cdk.validateString)(properties.portalId));
    errors.collect(cdk.propertyValidator('projectDescription', cdk.validateString)(properties.projectDescription));
    errors.collect(cdk.propertyValidator('projectName', cdk.requiredValidator)(properties.projectName));
    errors.collect(cdk.propertyValidator('projectName', cdk.validateString)(properties.projectName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnProjectProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTSiteWise::Project` resource
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTSiteWise::Project` resource.
 */
// @ts-ignore TS6133
function cfnProjectPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProjectPropsValidator(properties).assertSuccess();
    return {
        PortalId: cdk.stringToCloudFormation(properties.portalId),
        ProjectName: cdk.stringToCloudFormation(properties.projectName),
        AssetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.assetIds),
        ProjectDescription: cdk.stringToCloudFormation(properties.projectDescription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
    ret.addPropertyResult('portalId', 'PortalId', cfn_parse.FromCloudFormation.getString(properties.PortalId));
    ret.addPropertyResult('projectName', 'ProjectName', cfn_parse.FromCloudFormation.getString(properties.ProjectName));
    ret.addPropertyResult('assetIds', 'AssetIds', properties.AssetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AssetIds) : undefined);
    ret.addPropertyResult('projectDescription', 'ProjectDescription', properties.ProjectDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTSiteWise::Project`
 *
 * Creates a project in the specified portal.
 *
 * > Make sure that the project name and description don't contain confidential information.
 *
 * @cloudformationResource AWS::IoTSiteWise::Project
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTSiteWise::Project";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
        const ret = new CfnProject(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the project, which has the following format.
     *
     * `arn:${Partition}:iotsitewise:${Region}:${Account}:project/${ProjectId}`
     * @cloudformationAttribute ProjectArn
     */
    public readonly attrProjectArn: string;

    /**
     * The ID of the project.
     * @cloudformationAttribute ProjectId
     */
    public readonly attrProjectId: string;

    /**
     * The ID of the portal in which to create the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-portalid
     */
    public portalId: string;

    /**
     * A friendly name for the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectname
     */
    public projectName: string;

    /**
     * A list that contains the IDs of each asset associated with the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-assetids
     */
    public assetIds: string[] | undefined;

    /**
     * A description for the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-projectdescription
     */
    public projectDescription: string | undefined;

    /**
     * A list of key-value pairs that contain metadata for the project. For more information, see [Tagging your AWS IoT SiteWise resources](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/tag-resources.html) in the *AWS IoT SiteWise User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotsitewise-project.html#cfn-iotsitewise-project-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTSiteWise::Project`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
        super(scope, id, { type: CfnProject.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'portalId', this);
        cdk.requireProperty(props, 'projectName', this);
        this.attrProjectArn = cdk.Token.asString(this.getAtt('ProjectArn', cdk.ResolutionTypeHint.STRING));
        this.attrProjectId = cdk.Token.asString(this.getAtt('ProjectId', cdk.ResolutionTypeHint.STRING));

        this.portalId = props.portalId;
        this.projectName = props.projectName;
        this.assetIds = props.assetIds;
        this.projectDescription = props.projectDescription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTSiteWise::Project", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            portalId: this.portalId,
            projectName: this.projectName,
            assetIds: this.assetIds,
            projectDescription: this.projectDescription,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProjectPropsToCloudFormation(props);
    }
}
