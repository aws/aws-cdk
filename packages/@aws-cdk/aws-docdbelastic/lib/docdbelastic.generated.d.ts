import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html
 */
export interface CfnClusterProps {
    /**
     * The name of the Amazon DocumentDB elastic clusters administrator.
     *
     * *Constraints* :
     *
     * - Must be from 1 to 63 letters or numbers.
     * - The first character must be a letter.
     * - Cannot be a reserved word.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminusername
     */
    readonly adminUserName: string;
    /**
     * The authentication type used to determine where to fetch the password used for accessing the elastic cluster. Valid types are `PLAIN_TEXT` or `SECRET_ARN` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-authtype
     */
    readonly authType: string;
    /**
     * The name of the new elastic cluster. This parameter is stored as a lowercase string.
     *
     * *Constraints* :
     *
     * - Must contain from 1 to 63 letters, numbers, or hyphens.
     * - The first character must be a letter.
     * - Cannot end with a hyphen or contain two consecutive hyphens.
     *
     * *Example* : `my-cluster`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-clustername
     */
    readonly clusterName: string;
    /**
     * The number of vCPUs assigned to each elastic cluster shard. Maximum is 64. Allowed values are 2, 4, 8, 16, 32, 64.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcapacity
     */
    readonly shardCapacity: number;
    /**
     * The number of shards assigned to the elastic cluster. Maximum is 32.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcount
     */
    readonly shardCount: number;
    /**
     * The password for the Elastic DocumentDB cluster administrator and can contain any printable ASCII characters.
     *
     * *Constraints* :
     *
     * - Must contain from 8 to 100 characters.
     * - Cannot contain a forward slash (/), double quote ("), or the "at" symbol (@).
     * - A valid `AdminUserName` entry is also required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminuserpassword
     */
    readonly adminUserPassword?: string;
    /**
     * The KMS key identifier to use to encrypt the new elastic cluster.
     *
     * The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same Amazon account that owns this KMS encryption key, you can use the KMS key alias instead of the ARN as the KMS encryption key.
     *
     * If an encryption key is not specified, Amazon DocumentDB uses the default encryption key that KMS creates for your account. Your account has a different default encryption key for each Amazon Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-kmskeyid
     */
    readonly kmsKeyId?: string;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     *
     * *Format* : `ddd:hh24:mi-ddd:hh24:mi`
     *
     * *Default* : a 30-minute window selected at random from an 8-hour block of time for each AWS Region , occurring on a random day of the week.
     *
     * *Valid days* : Mon, Tue, Wed, Thu, Fri, Sat, Sun
     *
     * *Constraints* : Minimum 30-minute window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-preferredmaintenancewindow
     */
    readonly preferredMaintenanceWindow?: string;
    /**
     * The Amazon EC2 subnet IDs for the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-subnetids
     */
    readonly subnetIds?: string[];
    /**
     * The tags to be assigned to the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * A list of EC2 VPC security groups to associate with the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-vpcsecuritygroupids
     */
    readonly vpcSecurityGroupIds?: string[];
}
/**
 * A CloudFormation `AWS::DocDBElastic::Cluster`
 *
 * Creates a new Amazon DocumentDB elastic cluster and returns its cluster structure.
 *
 * @cloudformationResource AWS::DocDBElastic::Cluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html
 */
export declare class CfnCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DocDBElastic::Cluster";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster;
    /**
     *
     * @cloudformationAttribute ClusterArn
     */
    readonly attrClusterArn: string;
    /**
     * The name of the Amazon DocumentDB elastic clusters administrator.
     *
     * *Constraints* :
     *
     * - Must be from 1 to 63 letters or numbers.
     * - The first character must be a letter.
     * - Cannot be a reserved word.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminusername
     */
    adminUserName: string;
    /**
     * The authentication type used to determine where to fetch the password used for accessing the elastic cluster. Valid types are `PLAIN_TEXT` or `SECRET_ARN` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-authtype
     */
    authType: string;
    /**
     * The name of the new elastic cluster. This parameter is stored as a lowercase string.
     *
     * *Constraints* :
     *
     * - Must contain from 1 to 63 letters, numbers, or hyphens.
     * - The first character must be a letter.
     * - Cannot end with a hyphen or contain two consecutive hyphens.
     *
     * *Example* : `my-cluster`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-clustername
     */
    clusterName: string;
    /**
     * The number of vCPUs assigned to each elastic cluster shard. Maximum is 64. Allowed values are 2, 4, 8, 16, 32, 64.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcapacity
     */
    shardCapacity: number;
    /**
     * The number of shards assigned to the elastic cluster. Maximum is 32.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-shardcount
     */
    shardCount: number;
    /**
     * The password for the Elastic DocumentDB cluster administrator and can contain any printable ASCII characters.
     *
     * *Constraints* :
     *
     * - Must contain from 8 to 100 characters.
     * - Cannot contain a forward slash (/), double quote ("), or the "at" symbol (@).
     * - A valid `AdminUserName` entry is also required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-adminuserpassword
     */
    adminUserPassword: string | undefined;
    /**
     * The KMS key identifier to use to encrypt the new elastic cluster.
     *
     * The KMS key identifier is the Amazon Resource Name (ARN) for the KMS encryption key. If you are creating a cluster using the same Amazon account that owns this KMS encryption key, you can use the KMS key alias instead of the ARN as the KMS encryption key.
     *
     * If an encryption key is not specified, Amazon DocumentDB uses the default encryption key that KMS creates for your account. Your account has a different default encryption key for each Amazon Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * The weekly time range during which system maintenance can occur, in Universal Coordinated Time (UTC).
     *
     * *Format* : `ddd:hh24:mi-ddd:hh24:mi`
     *
     * *Default* : a 30-minute window selected at random from an 8-hour block of time for each AWS Region , occurring on a random day of the week.
     *
     * *Valid days* : Mon, Tue, Wed, Thu, Fri, Sat, Sun
     *
     * *Constraints* : Minimum 30-minute window.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-preferredmaintenancewindow
     */
    preferredMaintenanceWindow: string | undefined;
    /**
     * The Amazon EC2 subnet IDs for the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-subnetids
     */
    subnetIds: string[] | undefined;
    /**
     * The tags to be assigned to the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * A list of EC2 VPC security groups to associate with the new elastic cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-docdbelastic-cluster.html#cfn-docdbelastic-cluster-vpcsecuritygroupids
     */
    vpcSecurityGroupIds: string[] | undefined;
    /**
     * Create a new `AWS::DocDBElastic::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps);
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
