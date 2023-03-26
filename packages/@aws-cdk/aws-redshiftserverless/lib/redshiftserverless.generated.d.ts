import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html
 */
export interface CfnNamespaceProps {
    /**
     * The name of the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-namespacename
     */
    readonly namespaceName: string;
    /**
     * The username of the administrator for the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminusername
     */
    readonly adminUsername?: string;
    /**
     * The password of the administrator for the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminuserpassword
     */
    readonly adminUserPassword?: string;
    /**
     * The name of the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-dbname
     */
    readonly dbName?: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-defaultiamrolearn
     */
    readonly defaultIamRoleArn?: string;
    /**
     * The name of the snapshot to be created before the namespace is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotname
     */
    readonly finalSnapshotName?: string;
    /**
     * How long to retain the final snapshot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotretentionperiod
     */
    readonly finalSnapshotRetentionPeriod?: number;
    /**
     * A list of IAM roles to associate with the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-iamroles
     */
    readonly iamRoles?: string[];
    /**
     * The ID of the AWS Key Management Service key used to encrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-kmskeyid
     */
    readonly kmsKeyId?: string;
    /**
     * The types of logs the namespace can export. Available export types are `userlog` , `connectionlog` , and `useractivitylog` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-logexports
     */
    readonly logExports?: string[];
    /**
     * `AWS::RedshiftServerless::Namespace.Namespace`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-namespace
     */
    readonly namespace?: CfnNamespace.NamespaceProperty | cdk.IResolvable;
    /**
     * The map of the key-value pairs used to tag the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::RedshiftServerless::Namespace`
 *
 * A collection of database objects and users.
 *
 * @cloudformationResource AWS::RedshiftServerless::Namespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html
 */
export declare class CfnNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RedshiftServerless::Namespace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNamespace;
    /**
     *
     * @cloudformationAttribute Namespace.AdminUsername
     */
    readonly attrNamespaceAdminUsername: string;
    /**
     *
     * @cloudformationAttribute Namespace.CreationDate
     */
    readonly attrNamespaceCreationDate: string;
    /**
     *
     * @cloudformationAttribute Namespace.DbName
     */
    readonly attrNamespaceDbName: string;
    /**
     *
     * @cloudformationAttribute Namespace.DefaultIamRoleArn
     */
    readonly attrNamespaceDefaultIamRoleArn: string;
    /**
     *
     * @cloudformationAttribute Namespace.IamRoles
     */
    readonly attrNamespaceIamRoles: string[];
    /**
     *
     * @cloudformationAttribute Namespace.KmsKeyId
     */
    readonly attrNamespaceKmsKeyId: string;
    /**
     *
     * @cloudformationAttribute Namespace.LogExports
     */
    readonly attrNamespaceLogExports: string[];
    /**
     *
     * @cloudformationAttribute Namespace.NamespaceArn
     */
    readonly attrNamespaceNamespaceArn: string;
    /**
     *
     * @cloudformationAttribute Namespace.NamespaceId
     */
    readonly attrNamespaceNamespaceId: string;
    /**
     *
     * @cloudformationAttribute Namespace.NamespaceName
     */
    readonly attrNamespaceNamespaceName: string;
    /**
     *
     * @cloudformationAttribute Namespace.Status
     */
    readonly attrNamespaceStatus: string;
    /**
     * The name of the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-namespacename
     */
    namespaceName: string;
    /**
     * The username of the administrator for the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminusername
     */
    adminUsername: string | undefined;
    /**
     * The password of the administrator for the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-adminuserpassword
     */
    adminUserPassword: string | undefined;
    /**
     * The name of the primary database created in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-dbname
     */
    dbName: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-defaultiamrolearn
     */
    defaultIamRoleArn: string | undefined;
    /**
     * The name of the snapshot to be created before the namespace is deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotname
     */
    finalSnapshotName: string | undefined;
    /**
     * How long to retain the final snapshot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-finalsnapshotretentionperiod
     */
    finalSnapshotRetentionPeriod: number | undefined;
    /**
     * A list of IAM roles to associate with the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-iamroles
     */
    iamRoles: string[] | undefined;
    /**
     * The ID of the AWS Key Management Service key used to encrypt your data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * The types of logs the namespace can export. Available export types are `userlog` , `connectionlog` , and `useractivitylog` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-logexports
     */
    logExports: string[] | undefined;
    /**
     * `AWS::RedshiftServerless::Namespace.Namespace`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-namespace
     */
    namespace: CfnNamespace.NamespaceProperty | cdk.IResolvable | undefined;
    /**
     * The map of the key-value pairs used to tag the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-namespace.html#cfn-redshiftserverless-namespace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RedshiftServerless::Namespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNamespaceProps);
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
export declare namespace CfnNamespace {
    /**
     * A collection of database objects and users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html
     */
    interface NamespaceProperty {
        /**
         * The username of the administrator for the first database created in the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-adminusername
         */
        readonly adminUsername?: string;
        /**
         * The date of when the namespace was created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-creationdate
         */
        readonly creationDate?: string;
        /**
         * The name of the first database created in the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-dbname
         */
        readonly dbName?: string;
        /**
         * The Amazon Resource Name (ARN) of the IAM role to set as a default in the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-defaultiamrolearn
         */
        readonly defaultIamRoleArn?: string;
        /**
         * A list of IAM roles to associate with the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-iamroles
         */
        readonly iamRoles?: string[];
        /**
         * The ID of the AWS Key Management Service key used to encrypt your data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * The types of logs the namespace can export. Available export types are User log, Connection log, and User activity log.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-logexports
         */
        readonly logExports?: string[];
        /**
         * The Amazon Resource Name (ARN) associated with a namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespacearn
         */
        readonly namespaceArn?: string;
        /**
         * The unique identifier of a namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespaceid
         */
        readonly namespaceId?: string;
        /**
         * The name of the namespace. Must be between 3-64 alphanumeric characters in lowercase, and it cannot be a reserved word. A list of reserved words can be found in [Reserved Words](https://docs.aws.amazon.com//redshift/latest/dg/r_pg_keywords.html) in the Amazon Redshift Database Developer Guide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-namespacename
         */
        readonly namespaceName?: string;
        /**
         * The status of the namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-namespace-namespace.html#cfn-redshiftserverless-namespace-namespace-status
         */
        readonly status?: string;
    }
}
/**
 * Properties for defining a `CfnWorkgroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html
 */
export interface CfnWorkgroupProps {
    /**
     * The name of the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-workgroupname
     */
    readonly workgroupName: string;
    /**
     * The base compute capacity of the workgroup in Redshift Processing Units (RPUs).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-basecapacity
     */
    readonly baseCapacity?: number;
    /**
     * A list of parameters to set for finer control over a database. Available options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , and `max_query_execution_time` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-configparameters
     */
    readonly configParameters?: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-enhancedvpcrouting
     */
    readonly enhancedVpcRouting?: boolean | cdk.IResolvable;
    /**
     * The namespace the workgroup is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-namespacename
     */
    readonly namespaceName?: string;
    /**
     * A value that specifies whether the workgroup can be accessible from a public network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-publiclyaccessible
     */
    readonly publiclyAccessible?: boolean | cdk.IResolvable;
    /**
     * A list of security group IDs to associate with the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-securitygroupids
     */
    readonly securityGroupIds?: string[];
    /**
     * A list of subnet IDs the workgroup is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-subnetids
     */
    readonly subnetIds?: string[];
    /**
     * The map of the key-value pairs used to tag the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * `AWS::RedshiftServerless::Workgroup.Workgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-workgroup
     */
    readonly workgroup?: CfnWorkgroup.WorkgroupProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::RedshiftServerless::Workgroup`
 *
 * The collection of compute resources in Amazon Redshift Serverless.
 *
 * @cloudformationResource AWS::RedshiftServerless::Workgroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html
 */
export declare class CfnWorkgroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RedshiftServerless::Workgroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkgroup;
    /**
     *
     * @cloudformationAttribute Workgroup.BaseCapacity
     */
    readonly attrWorkgroupBaseCapacity: number;
    /**
     *
     * @cloudformationAttribute Workgroup.CreationDate
     */
    readonly attrWorkgroupCreationDate: string;
    /**
     *
     * @cloudformationAttribute Workgroup.Endpoint.Address
     */
    readonly attrWorkgroupEndpointAddress: string;
    /**
     *
     * @cloudformationAttribute Workgroup.Endpoint.Port
     */
    readonly attrWorkgroupEndpointPort: number;
    /**
     *
     * @cloudformationAttribute Workgroup.EnhancedVpcRouting
     */
    readonly attrWorkgroupEnhancedVpcRouting: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Workgroup.NamespaceName
     */
    readonly attrWorkgroupNamespaceName: string;
    /**
     *
     * @cloudformationAttribute Workgroup.PubliclyAccessible
     */
    readonly attrWorkgroupPubliclyAccessible: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Workgroup.SecurityGroupIds
     */
    readonly attrWorkgroupSecurityGroupIds: string[];
    /**
     *
     * @cloudformationAttribute Workgroup.Status
     */
    readonly attrWorkgroupStatus: string;
    /**
     *
     * @cloudformationAttribute Workgroup.SubnetIds
     */
    readonly attrWorkgroupSubnetIds: string[];
    /**
     *
     * @cloudformationAttribute Workgroup.WorkgroupArn
     */
    readonly attrWorkgroupWorkgroupArn: string;
    /**
     *
     * @cloudformationAttribute Workgroup.WorkgroupId
     */
    readonly attrWorkgroupWorkgroupId: string;
    /**
     *
     * @cloudformationAttribute Workgroup.WorkgroupName
     */
    readonly attrWorkgroupWorkgroupName: string;
    /**
     * The name of the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-workgroupname
     */
    workgroupName: string;
    /**
     * The base compute capacity of the workgroup in Redshift Processing Units (RPUs).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-basecapacity
     */
    baseCapacity: number | undefined;
    /**
     * A list of parameters to set for finer control over a database. Available options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , and `max_query_execution_time` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-configparameters
     */
    configParameters: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-enhancedvpcrouting
     */
    enhancedVpcRouting: boolean | cdk.IResolvable | undefined;
    /**
     * The namespace the workgroup is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-namespacename
     */
    namespaceName: string | undefined;
    /**
     * A value that specifies whether the workgroup can be accessible from a public network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-publiclyaccessible
     */
    publiclyAccessible: boolean | cdk.IResolvable | undefined;
    /**
     * A list of security group IDs to associate with the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-securitygroupids
     */
    securityGroupIds: string[] | undefined;
    /**
     * A list of subnet IDs the workgroup is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-subnetids
     */
    subnetIds: string[] | undefined;
    /**
     * The map of the key-value pairs used to tag the workgroup.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::RedshiftServerless::Workgroup.Workgroup`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshiftserverless-workgroup.html#cfn-redshiftserverless-workgroup-workgroup
     */
    workgroup: CfnWorkgroup.WorkgroupProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::RedshiftServerless::Workgroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkgroupProps);
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
export declare namespace CfnWorkgroup {
    /**
     * A array of parameters to set for more control over a serverless database.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html
     */
    interface ConfigParameterProperty {
        /**
         * The key of the parameter. The options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , and `max_query_execution_time` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html#cfn-redshiftserverless-workgroup-configparameter-parameterkey
         */
        readonly parameterKey?: string;
        /**
         * The value of the parameter to set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-configparameter.html#cfn-redshiftserverless-workgroup-configparameter-parametervalue
         */
        readonly parameterValue?: string;
    }
}
export declare namespace CfnWorkgroup {
    /**
     * The VPC endpoint object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html
     */
    interface EndpointProperty {
        /**
         * The DNS address of the VPC endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-address
         */
        readonly address?: string;
        /**
         * The port that Amazon Redshift Serverless listens on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-port
         */
        readonly port?: number;
        /**
         * An array of `VpcEndpoint` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-endpoint.html#cfn-redshiftserverless-workgroup-endpoint-vpcendpoints
         */
        readonly vpcEndpoints?: Array<CfnWorkgroup.VpcEndpointProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnWorkgroup {
    /**
     * Contains information about a network interface in an Amazon Redshift Serverless managed VPC endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html
     */
    interface NetworkInterfaceProperty {
        /**
         * The availability Zone.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-availabilityzone
         */
        readonly availabilityZone?: string;
        /**
         * The unique identifier of the network interface.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-networkinterfaceid
         */
        readonly networkInterfaceId?: string;
        /**
         * The IPv4 address of the network interface within the subnet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-privateipaddress
         */
        readonly privateIpAddress?: string;
        /**
         * The unique identifier of the subnet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-networkinterface.html#cfn-redshiftserverless-workgroup-networkinterface-subnetid
         */
        readonly subnetId?: string;
    }
}
export declare namespace CfnWorkgroup {
    /**
     * The connection endpoint for connecting to Amazon Redshift Serverless through the proxy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html
     */
    interface VpcEndpointProperty {
        /**
         * One or more network interfaces of the endpoint. Also known as an interface endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-networkinterfaces
         */
        readonly networkInterfaces?: Array<CfnWorkgroup.NetworkInterfaceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The connection endpoint ID for connecting to Amazon Redshift Serverless.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-vpcendpointid
         */
        readonly vpcEndpointId?: string;
        /**
         * The VPC identifier that the endpoint is associated with.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-vpcendpoint.html#cfn-redshiftserverless-workgroup-vpcendpoint-vpcid
         */
        readonly vpcId?: string;
    }
}
export declare namespace CfnWorkgroup {
    /**
     * The collection of computing resources from which an endpoint is created.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html
     */
    interface WorkgroupProperty {
        /**
         * The base data warehouse capacity of the workgroup in Redshift Processing Units (RPUs).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-basecapacity
         */
        readonly baseCapacity?: number;
        /**
         * An array of parameters to set for finer control over a database. The options are `datestyle` , `enable_user_activity_logging` , `query_group` , `search_path` , and `max_query_execution_time` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-configparameters
         */
        readonly configParameters?: Array<CfnWorkgroup.ConfigParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The creation date of the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-creationdate
         */
        readonly creationDate?: string;
        /**
         * The endpoint that is created from the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-endpoint
         */
        readonly endpoint?: CfnWorkgroup.EndpointProperty | cdk.IResolvable;
        /**
         * The value that specifies whether to enable enhanced virtual private cloud (VPC) routing, which forces Amazon Redshift Serverless to route traffic through your VPC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-enhancedvpcrouting
         */
        readonly enhancedVpcRouting?: boolean | cdk.IResolvable;
        /**
         * The namespace the workgroup is associated with.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-namespacename
         */
        readonly namespaceName?: string;
        /**
         * A value that specifies whether the workgroup can be accessible from a public network
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-publiclyaccessible
         */
        readonly publiclyAccessible?: boolean | cdk.IResolvable;
        /**
         * An array of security group IDs to associate with the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The status of the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-status
         */
        readonly status?: string;
        /**
         * An array of subnet IDs the workgroup is associated with.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-subnetids
         */
        readonly subnetIds?: string[];
        /**
         * The Amazon Resource Name (ARN) that links to the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgrouparn
         */
        readonly workgroupArn?: string;
        /**
         * The unique identifier of the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgroupid
         */
        readonly workgroupId?: string;
        /**
         * The name of the workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshiftserverless-workgroup-workgroup.html#cfn-redshiftserverless-workgroup-workgroup-workgroupname
         */
        readonly workgroupName?: string;
    }
}
