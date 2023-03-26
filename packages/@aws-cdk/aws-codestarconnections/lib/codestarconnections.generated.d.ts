import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnConnection`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html
 */
export interface CfnConnectionProps {
    /**
     * The name of the connection. Connection names must be unique in an AWS user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-connectionname
     */
    readonly connectionName: string;
    /**
     * The Amazon Resource Name (ARN) of the host associated with the connection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-hostarn
     */
    readonly hostArn?: string;
    /**
     * The name of the external provider where your third-party code repository is configured.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-providertype
     */
    readonly providerType?: string;
    /**
     * Specifies the tags applied to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::CodeStarConnections::Connection`
 *
 * The AWS::CodeStarConnections::Connection resource can be used to connect external source providers with services like AWS CodePipeline .
 *
 * *Note:* A connection created through AWS CloudFormation is in `PENDING` status by default. You can make its status `AVAILABLE` by updating the connection in the console.
 *
 * @cloudformationResource AWS::CodeStarConnections::Connection
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html
 */
export declare class CfnConnection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeStarConnections::Connection";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnection;
    /**
     * The Amazon Resource Name (ARN) of the connection. The ARN is used as the connection reference when the connection is shared between AWS services. For example: `arn:aws:codestar-connections:us-west-2:123456789012:connection/39e4c34d-e13a-4e94-a886-ea67651bf042` .
     * @cloudformationAttribute ConnectionArn
     */
    readonly attrConnectionArn: string;
    /**
     * The current status of the connection. For example: `PENDING` , `AVAILABLE` , or `ERROR` .
     * @cloudformationAttribute ConnectionStatus
     */
    readonly attrConnectionStatus: string;
    /**
     * The AWS account ID of the owner of the connection. For Bitbucket, this is the account ID of the owner of the Bitbucket repository. For example: `123456789012` .
     * @cloudformationAttribute OwnerAccountId
     */
    readonly attrOwnerAccountId: string;
    /**
     * The name of the connection. Connection names must be unique in an AWS user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-connectionname
     */
    connectionName: string;
    /**
     * The Amazon Resource Name (ARN) of the host associated with the connection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-hostarn
     */
    hostArn: string | undefined;
    /**
     * The name of the external provider where your third-party code repository is configured.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-providertype
     */
    providerType: string | undefined;
    /**
     * Specifies the tags applied to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::CodeStarConnections::Connection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectionProps);
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
