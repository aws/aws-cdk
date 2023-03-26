import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnMicrosoftAD`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export interface CfnMicrosoftADProps {
    /**
     * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-name
     */
    readonly name: string;
    /**
     * The password for the default administrative user named `Admin` .
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-password
     */
    readonly password: string;
    /**
     * Specifies the VPC settings of the Microsoft AD directory server in AWS .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-vpcsettings
     */
    readonly vpcSettings: CfnMicrosoftAD.VpcSettingsProperty | cdk.IResolvable;
    /**
     * Specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, AWS CloudFormation does not create an alias.
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-createalias
     */
    readonly createAlias?: boolean | cdk.IResolvable;
    /**
     * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` . `Enterprise` is the default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-edition
     */
    readonly edition?: string;
    /**
     * Whether to enable single sign-on for a Microsoft Active Directory in AWS . Single sign-on allows users in your directory to access certain AWS services from a computer joined to the directory without having to enter their credentials separately. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-enablesso
     */
    readonly enableSso?: boolean | cdk.IResolvable;
    /**
     * The NetBIOS name for your domain, such as `CORP` . If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, `CORP` for the directory DNS `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-shortname
     */
    readonly shortName?: string;
}
/**
 * A CloudFormation `AWS::DirectoryService::MicrosoftAD`
 *
 * The `AWS::DirectoryService::MicrosoftAD` resource specifies a Microsoft Active Directory in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials. For more information, see [AWS Managed Microsoft AD](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_microsoft_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::MicrosoftAD
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export declare class CfnMicrosoftAD extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DirectoryService::MicrosoftAD";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMicrosoftAD;
    /**
     * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
     * @cloudformationAttribute Alias
     */
    readonly attrAlias: string;
    /**
     * The IP addresses of the DNS servers for the directory, such as `[ "192.0.2.1", "192.0.2.2" ]` .
     * @cloudformationAttribute DnsIpAddresses
     */
    readonly attrDnsIpAddresses: string[];
    /**
     * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-name
     */
    name: string;
    /**
     * The password for the default administrative user named `Admin` .
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-password
     */
    password: string;
    /**
     * Specifies the VPC settings of the Microsoft AD directory server in AWS .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-vpcsettings
     */
    vpcSettings: CfnMicrosoftAD.VpcSettingsProperty | cdk.IResolvable;
    /**
     * Specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, AWS CloudFormation does not create an alias.
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-createalias
     */
    createAlias: boolean | cdk.IResolvable | undefined;
    /**
     * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` . `Enterprise` is the default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-edition
     */
    edition: string | undefined;
    /**
     * Whether to enable single sign-on for a Microsoft Active Directory in AWS . Single sign-on allows users in your directory to access certain AWS services from a computer joined to the directory without having to enter their credentials separately. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-enablesso
     */
    enableSso: boolean | cdk.IResolvable | undefined;
    /**
     * The NetBIOS name for your domain, such as `CORP` . If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, `CORP` for the directory DNS `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-shortname
     */
    shortName: string | undefined;
    /**
     * Create a new `AWS::DirectoryService::MicrosoftAD`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMicrosoftADProps);
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
export declare namespace CfnMicrosoftAD {
    /**
     * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html
     */
    interface VpcSettingsProperty {
        /**
         * The identifiers of the subnets for the directory servers. The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-subnetids
         */
        readonly subnetIds: string[];
        /**
         * The identifier of the VPC in which to create the directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-vpcid
         */
        readonly vpcId: string;
    }
}
/**
 * Properties for defining a `CfnSimpleAD`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export interface CfnSimpleADProps {
    /**
     * The fully qualified name for the directory, such as `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name
     */
    readonly name: string;
    /**
     * The size of the directory. For valid values, see [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size
     */
    readonly size: string;
    /**
     * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings
     */
    readonly vpcSettings: CfnSimpleAD.VpcSettingsProperty | cdk.IResolvable;
    /**
     * If set to `true` , specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, this property is set to `false` .
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias
     */
    readonly createAlias?: boolean | cdk.IResolvable;
    /**
     * A description for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description
     */
    readonly description?: string;
    /**
     * Whether to enable single sign-on for a directory. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso
     */
    readonly enableSso?: boolean | cdk.IResolvable;
    /**
     * The password for the directory administrator. The directory creation process creates a directory administrator account with the user name `Administrator` and this password.
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password
     */
    readonly password?: string;
    /**
     * The NetBIOS name of the directory, such as `CORP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname
     */
    readonly shortName?: string;
}
/**
 * A CloudFormation `AWS::DirectoryService::SimpleAD`
 *
 * The `AWS::DirectoryService::SimpleAD` resource specifies an AWS Directory Service Simple Active Directory ( Simple AD ) in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials. Simple AD is a Microsoft Active Directory–compatible directory. For more information, see [Simple Active Directory](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_simple_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::SimpleAD
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export declare class CfnSimpleAD extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DirectoryService::SimpleAD";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleAD;
    /**
     * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
     * @cloudformationAttribute Alias
     */
    readonly attrAlias: string;
    /**
     *
     * @cloudformationAttribute DirectoryId
     */
    readonly attrDirectoryId: string;
    /**
     * The IP addresses of the DNS servers for the directory, such as `[ "172.31.3.154", "172.31.63.203" ]` .
     * @cloudformationAttribute DnsIpAddresses
     */
    readonly attrDnsIpAddresses: string[];
    /**
     * The fully qualified name for the directory, such as `corp.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name
     */
    name: string;
    /**
     * The size of the directory. For valid values, see [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size
     */
    size: string;
    /**
     * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings
     */
    vpcSettings: CfnSimpleAD.VpcSettingsProperty | cdk.IResolvable;
    /**
     * If set to `true` , specifies an alias for a directory and assigns the alias to the directory. The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, this property is set to `false` .
     *
     * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias
     */
    createAlias: boolean | cdk.IResolvable | undefined;
    /**
     * A description for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description
     */
    description: string | undefined;
    /**
     * Whether to enable single sign-on for a directory. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso
     */
    enableSso: boolean | cdk.IResolvable | undefined;
    /**
     * The password for the directory administrator. The directory creation process creates a directory administrator account with the user name `Administrator` and this password.
     *
     * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password
     */
    password: string | undefined;
    /**
     * The NetBIOS name of the directory, such as `CORP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname
     */
    shortName: string | undefined;
    /**
     * Create a new `AWS::DirectoryService::SimpleAD`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimpleADProps);
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
export declare namespace CfnSimpleAD {
    /**
     * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html
     */
    interface VpcSettingsProperty {
        /**
         * The identifiers of the subnets for the directory servers. The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-subnetids
         */
        readonly subnetIds: string[];
        /**
         * The identifier of the VPC in which to create the directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-vpcid
         */
        readonly vpcId: string;
    }
}
