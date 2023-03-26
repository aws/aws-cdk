// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:50.007Z","fingerprint":"JJljrsztAGVoFZFf83wSeWoirSb38Vi/uIA2MQHsDI0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnResourceShare`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html
 */
export interface CfnResourceShareProps {

    /**
     * Specifies the name of the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name
     */
    readonly name: string;

    /**
     * Specifies whether principals outside your organization in AWS Organizations can be associated with a resource share. A value of `true` lets you share with individual AWS accounts that are *not* in your organization. A value of `false` only has meaning if your account is a member of an AWS Organization. The default value is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals
     */
    readonly allowExternalPrincipals?: boolean | cdk.IResolvable;

    /**
     * Specifies the [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the AWS RAM permission to associate with the resource share. If you do not specify an ARN for the permission, AWS RAM automatically attaches the default version of the permission for each resource type. You can associate only one permission with each resource type included in the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-permissionarns
     */
    readonly permissionArns?: string[];

    /**
     * Specifies a list of one or more principals to associate with the resource share.
     *
     * You can include the following values:
     *
     * - An AWS account ID, for example: `123456789012`
     * - An [Amazon Resoure Name (ARN)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of an organization in AWS Organizations , for example: `arn:aws:organizations::123456789012:organization/o-exampleorgid`
     * - An ARN of an organizational unit (OU) in AWS Organizations , for example: `arn:aws:organizations::123456789012:ou/o-exampleorgid/ou-examplerootid-exampleouid123`
     * - An ARN of an IAM role, for example: `arn:aws:iam::123456789012:role/rolename`
     * - An ARN of an IAM user, for example: `arn:aws:iam::123456789012user/username`
     *
     * > Not all resource types can be shared with IAM roles and users. For more information, see [Sharing with IAM roles and users](https://docs.aws.amazon.com//ram/latest/userguide/permissions.html#permissions-rbp-supported-resource-types) in the *AWS Resource Access Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-principals
     */
    readonly principals?: string[];

    /**
     * Specifies a list of one or more ARNs of the resources to associate with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-resourcearns
     */
    readonly resourceArns?: string[];

    /**
     * Specifies one or more tags to attach to the resource share itself. It doesn't attach the tags to the resources associated with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnResourceShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceShareProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceSharePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowExternalPrincipals', cdk.validateBoolean)(properties.allowExternalPrincipals));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('permissionArns', cdk.listValidator(cdk.validateString))(properties.permissionArns));
    errors.collect(cdk.propertyValidator('principals', cdk.listValidator(cdk.validateString))(properties.principals));
    errors.collect(cdk.propertyValidator('resourceArns', cdk.listValidator(cdk.validateString))(properties.resourceArns));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnResourceShareProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::RAM::ResourceShare` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceShareProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::RAM::ResourceShare` resource.
 */
// @ts-ignore TS6133
function cfnResourceSharePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSharePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        AllowExternalPrincipals: cdk.booleanToCloudFormation(properties.allowExternalPrincipals),
        PermissionArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.permissionArns),
        Principals: cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
        ResourceArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceArns),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnResourceSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceShareProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceShareProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('allowExternalPrincipals', 'AllowExternalPrincipals', properties.AllowExternalPrincipals != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowExternalPrincipals) : undefined);
    ret.addPropertyResult('permissionArns', 'PermissionArns', properties.PermissionArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PermissionArns) : undefined);
    ret.addPropertyResult('principals', 'Principals', properties.Principals != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Principals) : undefined);
    ret.addPropertyResult('resourceArns', 'ResourceArns', properties.ResourceArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceArns) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::RAM::ResourceShare`
 *
 * Specifies a resource share.
 *
 * @cloudformationResource AWS::RAM::ResourceShare
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html
 */
export class CfnResourceShare extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RAM::ResourceShare";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceShare {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourceSharePropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourceShare(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource share.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Specifies the name of the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name
     */
    public name: string;

    /**
     * Specifies whether principals outside your organization in AWS Organizations can be associated with a resource share. A value of `true` lets you share with individual AWS accounts that are *not* in your organization. A value of `false` only has meaning if your account is a member of an AWS Organization. The default value is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals
     */
    public allowExternalPrincipals: boolean | cdk.IResolvable | undefined;

    /**
     * Specifies the [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the AWS RAM permission to associate with the resource share. If you do not specify an ARN for the permission, AWS RAM automatically attaches the default version of the permission for each resource type. You can associate only one permission with each resource type included in the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-permissionarns
     */
    public permissionArns: string[] | undefined;

    /**
     * Specifies a list of one or more principals to associate with the resource share.
     *
     * You can include the following values:
     *
     * - An AWS account ID, for example: `123456789012`
     * - An [Amazon Resoure Name (ARN)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of an organization in AWS Organizations , for example: `arn:aws:organizations::123456789012:organization/o-exampleorgid`
     * - An ARN of an organizational unit (OU) in AWS Organizations , for example: `arn:aws:organizations::123456789012:ou/o-exampleorgid/ou-examplerootid-exampleouid123`
     * - An ARN of an IAM role, for example: `arn:aws:iam::123456789012:role/rolename`
     * - An ARN of an IAM user, for example: `arn:aws:iam::123456789012user/username`
     *
     * > Not all resource types can be shared with IAM roles and users. For more information, see [Sharing with IAM roles and users](https://docs.aws.amazon.com//ram/latest/userguide/permissions.html#permissions-rbp-supported-resource-types) in the *AWS Resource Access Manager User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-principals
     */
    public principals: string[] | undefined;

    /**
     * Specifies a list of one or more ARNs of the resources to associate with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-resourcearns
     */
    public resourceArns: string[] | undefined;

    /**
     * Specifies one or more tags to attach to the resource share itself. It doesn't attach the tags to the resources associated with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::RAM::ResourceShare`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceShareProps) {
        super(scope, id, { type: CfnResourceShare.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.allowExternalPrincipals = props.allowExternalPrincipals;
        this.permissionArns = props.permissionArns;
        this.principals = props.principals;
        this.resourceArns = props.resourceArns;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RAM::ResourceShare", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceShare.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            allowExternalPrincipals: this.allowExternalPrincipals,
            permissionArns: this.permissionArns,
            principals: this.principals,
            resourceArns: this.resourceArns,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceSharePropsToCloudFormation(props);
    }
}
