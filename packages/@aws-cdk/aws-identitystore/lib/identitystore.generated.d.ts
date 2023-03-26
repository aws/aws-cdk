import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export interface CfnGroupProps {
    /**
     * `AWS::IdentityStore::Group.DisplayName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-displayname
     */
    readonly displayName: string;
    /**
     * `AWS::IdentityStore::Group.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-identitystoreid
     */
    readonly identityStoreId: string;
    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-description
     */
    readonly description?: string;
}
/**
 * A CloudFormation `AWS::IdentityStore::Group`
 *
 * A group object, which contains a specified group’s metadata and attributes.
 *
 * @cloudformationResource AWS::IdentityStore::Group
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export declare class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IdentityStore::Group";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup;
    /**
     * The identifier of the newly created group in the identity store.
     * @cloudformationAttribute GroupId
     */
    readonly attrGroupId: string;
    /**
     * `AWS::IdentityStore::Group.DisplayName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-displayname
     */
    displayName: string;
    /**
     * `AWS::IdentityStore::Group.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-identitystoreid
     */
    identityStoreId: string;
    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-description
     */
    description: string | undefined;
    /**
     * Create a new `AWS::IdentityStore::Group`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGroupProps);
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
/**
 * Properties for defining a `CfnGroupMembership`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export interface CfnGroupMembershipProps {
    /**
     * `AWS::IdentityStore::GroupMembership.GroupId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-groupid
     */
    readonly groupId: string;
    /**
     * `AWS::IdentityStore::GroupMembership.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-identitystoreid
     */
    readonly identityStoreId: string;
    /**
     * An object containing the identifier of a group member. Setting `MemberId` 's `UserId` field to a specific User's ID indicates we should consider that User as a group member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-memberid
     */
    readonly memberId: CfnGroupMembership.MemberIdProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::IdentityStore::GroupMembership`
 *
 * Contains the identifiers for a group, a group member, and a `GroupMembership` object in the identity store.
 *
 * @cloudformationResource AWS::IdentityStore::GroupMembership
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export declare class CfnGroupMembership extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IdentityStore::GroupMembership";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroupMembership;
    /**
     * The identifier for a `GroupMembership` in the identity store.
     * @cloudformationAttribute MembershipId
     */
    readonly attrMembershipId: string;
    /**
     * `AWS::IdentityStore::GroupMembership.GroupId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-groupid
     */
    groupId: string;
    /**
     * `AWS::IdentityStore::GroupMembership.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-identitystoreid
     */
    identityStoreId: string;
    /**
     * An object containing the identifier of a group member. Setting `MemberId` 's `UserId` field to a specific User's ID indicates we should consider that User as a group member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-memberid
     */
    memberId: CfnGroupMembership.MemberIdProperty | cdk.IResolvable;
    /**
     * Create a new `AWS::IdentityStore::GroupMembership`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGroupMembershipProps);
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
export declare namespace CfnGroupMembership {
    /**
     * An object that contains the identifier of a group member. Setting the `UserID` field to the specific identifier for a user indicates that the user is a member of the group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html
     */
    interface MemberIdProperty {
        /**
         * `CfnGroupMembership.MemberIdProperty.UserId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html#cfn-identitystore-groupmembership-memberid-userid
         */
        readonly userId: string;
    }
}
