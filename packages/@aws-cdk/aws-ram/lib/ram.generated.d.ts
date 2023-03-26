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
 * A CloudFormation `AWS::RAM::ResourceShare`
 *
 * Specifies a resource share.
 *
 * @cloudformationResource AWS::RAM::ResourceShare
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html
 */
export declare class CfnResourceShare extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RAM::ResourceShare";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceShare;
    /**
     * The Amazon Resource Name (ARN) of the resource share.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Specifies the name of the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name
     */
    name: string;
    /**
     * Specifies whether principals outside your organization in AWS Organizations can be associated with a resource share. A value of `true` lets you share with individual AWS accounts that are *not* in your organization. A value of `false` only has meaning if your account is a member of an AWS Organization. The default value is `true` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals
     */
    allowExternalPrincipals: boolean | cdk.IResolvable | undefined;
    /**
     * Specifies the [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html) of the AWS RAM permission to associate with the resource share. If you do not specify an ARN for the permission, AWS RAM automatically attaches the default version of the permission for each resource type. You can associate only one permission with each resource type included in the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-permissionarns
     */
    permissionArns: string[] | undefined;
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
    principals: string[] | undefined;
    /**
     * Specifies a list of one or more ARNs of the resources to associate with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-resourcearns
     */
    resourceArns: string[] | undefined;
    /**
     * Specifies one or more tags to attach to the resource share itself. It doesn't attach the tags to the resources associated with the resource share.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RAM::ResourceShare`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceShareProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
