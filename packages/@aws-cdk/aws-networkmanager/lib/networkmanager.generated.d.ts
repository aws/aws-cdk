import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnConnectAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html
 */
export interface CfnConnectAttachmentProps {
    /**
     * The ID of the core network where the Connect attachment is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-corenetworkid
     */
    readonly coreNetworkId: string;
    /**
     * The Region where the edge is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-edgelocation
     */
    readonly edgeLocation: string;
    /**
     * Options for connecting an attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-options
     */
    readonly options: CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable;
    /**
     * The ID of the transport attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-transportattachmentid
     */
    readonly transportAttachmentId: string;
    /**
     * `AWS::NetworkManager::ConnectAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::ConnectAttachment`
 *
 * Creates a core network Connect attachment from a specified core network attachment.
 *
 * A core network Connect attachment is a GRE-based tunnel attachment that you can use to establish a connection between a core network and an appliance. A core network Connect attachment uses an existing VPC attachment as the underlying transport mechanism.
 *
 * @cloudformationResource AWS::NetworkManager::ConnectAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html
 */
export declare class CfnConnectAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::ConnectAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectAttachment;
    /**
     * The ID of the Connect attachment.
     * @cloudformationAttribute AttachmentId
     */
    readonly attrAttachmentId: string;
    /**
     * The rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    readonly attrAttachmentPolicyRuleNumber: number;
    /**
     * The type of attachment. This will be `CONNECT` .
     * @cloudformationAttribute AttachmentType
     */
    readonly attrAttachmentType: string;
    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    readonly attrCoreNetworkArn: string;
    /**
     * The timestamp when the Connect attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The ID of the Connect attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    readonly attrOwnerAccountId: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    readonly attrProposedSegmentChangeSegmentName: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    readonly attrProposedSegmentChangeTags: cdk.IResolvable;
    /**
     * The resource ARN for the Connect attachment.
     * @cloudformationAttribute ResourceArn
     */
    readonly attrResourceArn: string;
    /**
     * The name of the Connect attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    readonly attrSegmentName: string;
    /**
     * The state of the Connect attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * The timestamp when the Connect attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    readonly attrUpdatedAt: string;
    /**
     * The ID of the core network where the Connect attachment is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-corenetworkid
     */
    coreNetworkId: string;
    /**
     * The Region where the edge is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-edgelocation
     */
    edgeLocation: string;
    /**
     * Options for connecting an attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-options
     */
    options: CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable;
    /**
     * The ID of the transport attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-transportattachmentid
     */
    transportAttachmentId: string;
    /**
     * `AWS::NetworkManager::ConnectAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::ConnectAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectAttachmentProps);
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
export declare namespace CfnConnectAttachment {
    /**
     * Describes a core network Connect attachment options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html
     */
    interface ConnectAttachmentOptionsProperty {
        /**
         * The protocol used for the attachment connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html#cfn-networkmanager-connectattachment-connectattachmentoptions-protocol
         */
        readonly protocol?: string;
    }
}
export declare namespace CfnConnectAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html
     */
    interface ProposedSegmentChangeProperty {
        /**
         * The rule number in the policy document that applies to this change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-attachmentpolicyrulenumber
         */
        readonly attachmentPolicyRuleNumber?: number;
        /**
         * The name of the segment to change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-segmentname
         */
        readonly segmentName?: string;
        /**
         * The list of key-value tags that changed for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}
/**
 * Properties for defining a `CfnConnectPeer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html
 */
export interface CfnConnectPeerProps {
    /**
     * `AWS::NetworkManager::ConnectPeer.BgpOptions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-bgpoptions
     */
    readonly bgpOptions?: CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable;
    /**
     * The ID of the attachment to connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-connectattachmentid
     */
    readonly connectAttachmentId?: string;
    /**
     * The IP address of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-corenetworkaddress
     */
    readonly coreNetworkAddress?: string;
    /**
     * The inside IP addresses used for a Connect peer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-insidecidrblocks
     */
    readonly insideCidrBlocks?: string[];
    /**
     * The IP address of the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-peeraddress
     */
    readonly peerAddress?: string;
    /**
     * The list of key-value tags associated with the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::ConnectPeer`
 *
 * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance. The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
 *
 * @cloudformationResource AWS::NetworkManager::ConnectPeer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html
 */
export declare class CfnConnectPeer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::ConnectPeer";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectPeer;
    /**
     *
     * @cloudformationAttribute Configuration.BgpConfigurations
     */
    readonly attrConfigurationBgpConfigurations: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Configuration.CoreNetworkAddress
     */
    readonly attrConfigurationCoreNetworkAddress: string;
    /**
     *
     * @cloudformationAttribute Configuration.InsideCidrBlocks
     */
    readonly attrConfigurationInsideCidrBlocks: string[];
    /**
     *
     * @cloudformationAttribute Configuration.PeerAddress
     */
    readonly attrConfigurationPeerAddress: string;
    /**
     *
     * @cloudformationAttribute Configuration.Protocol
     */
    readonly attrConfigurationProtocol: string;
    /**
     * The ID of the Connect peer.
     * @cloudformationAttribute ConnectPeerId
     */
    readonly attrConnectPeerId: string;
    /**
     * The core network ID.
     * @cloudformationAttribute CoreNetworkId
     */
    readonly attrCoreNetworkId: string;
    /**
     * The timestamp when the Connect peer was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The Region where the edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    readonly attrEdgeLocation: string;
    /**
     * The state of the Connect peer. This will be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * `AWS::NetworkManager::ConnectPeer.BgpOptions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-bgpoptions
     */
    bgpOptions: CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable | undefined;
    /**
     * The ID of the attachment to connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-connectattachmentid
     */
    connectAttachmentId: string | undefined;
    /**
     * The IP address of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-corenetworkaddress
     */
    coreNetworkAddress: string | undefined;
    /**
     * The inside IP addresses used for a Connect peer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-insidecidrblocks
     */
    insideCidrBlocks: string[] | undefined;
    /**
     * The IP address of the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-peeraddress
     */
    peerAddress: string | undefined;
    /**
     * The list of key-value tags associated with the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::ConnectPeer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnConnectPeerProps);
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
export declare namespace CfnConnectPeer {
    /**
     * Describes the BGP options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html
     */
    interface BgpOptionsProperty {
        /**
         * The Peer ASN of the BGP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html#cfn-networkmanager-connectpeer-bgpoptions-peerasn
         */
        readonly peerAsn?: number;
    }
}
export declare namespace CfnConnectPeer {
    /**
     * Describes a core network BGP configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html
     */
    interface ConnectPeerBgpConfigurationProperty {
        /**
         * The address of a core network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-corenetworkaddress
         */
        readonly coreNetworkAddress?: string;
        /**
         * The ASN of the Coret Network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-corenetworkasn
         */
        readonly coreNetworkAsn?: number;
        /**
         * The address of a core network Connect peer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-peeraddress
         */
        readonly peerAddress?: string;
        /**
         * The ASN of the Connect peer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-peerasn
         */
        readonly peerAsn?: number;
    }
}
export declare namespace CfnConnectPeer {
    /**
     * Describes a core network Connect peer configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html
     */
    interface ConnectPeerConfigurationProperty {
        /**
         * The Connect peer BGP configurations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-bgpconfigurations
         */
        readonly bgpConfigurations?: Array<CfnConnectPeer.ConnectPeerBgpConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The IP address of a core network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-corenetworkaddress
         */
        readonly coreNetworkAddress?: string;
        /**
         * The inside IP addresses used for a Connect peer configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-insidecidrblocks
         */
        readonly insideCidrBlocks?: string[];
        /**
         * The IP address of the Connect peer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-peeraddress
         */
        readonly peerAddress?: string;
        /**
         * The protocol used for a Connect peer configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-protocol
         */
        readonly protocol?: string;
    }
}
/**
 * Properties for defining a `CfnCoreNetwork`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html
 */
export interface CfnCoreNetworkProps {
    /**
     * The ID of the global network that your core network is a part of.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * The description of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-description
     */
    readonly description?: string;
    /**
     * Describes a core network policy. For more information, see [Core network policies](https://docs.aws.amazon.com/vpc/latest/cloudwan/cloudwan-policy-changesets.html) .
     *
     * If you update the policy document, CloudFormation will apply the core network change set generated from the updated policy document, and then set it as the LIVE policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-policydocument
     */
    readonly policyDocument?: any | cdk.IResolvable;
    /**
     * The list of key-value tags associated with a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::CoreNetwork`
 *
 * Describes a core network.
 *
 * @cloudformationResource AWS::NetworkManager::CoreNetwork
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html
 */
export declare class CfnCoreNetwork extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::CoreNetwork";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCoreNetwork;
    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    readonly attrCoreNetworkArn: string;
    /**
     * The ID of the core network.
     * @cloudformationAttribute CoreNetworkId
     */
    readonly attrCoreNetworkId: string;
    /**
     * The timestamp when the core network was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The edges.
     * @cloudformationAttribute Edges
     */
    readonly attrEdges: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute OwnerAccount
     */
    readonly attrOwnerAccount: string;
    /**
     * The segments.
     * @cloudformationAttribute Segments
     */
    readonly attrSegments: cdk.IResolvable;
    /**
     * The current state of the core network. These states are: `CREATING` | `UPDATING` | `AVAILABLE` | `DELETING` .
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * The ID of the global network that your core network is a part of.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * The description of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-description
     */
    description: string | undefined;
    /**
     * Describes a core network policy. For more information, see [Core network policies](https://docs.aws.amazon.com/vpc/latest/cloudwan/cloudwan-policy-changesets.html) .
     *
     * If you update the policy document, CloudFormation will apply the core network change set generated from the updated policy document, and then set it as the LIVE policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-policydocument
     */
    policyDocument: any | cdk.IResolvable | undefined;
    /**
     * The list of key-value tags associated with a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::CoreNetwork`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCoreNetworkProps);
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
export declare namespace CfnCoreNetwork {
    /**
     * Describes a core network edge.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html
     */
    interface CoreNetworkEdgeProperty {
        /**
         * The ASN of a core network edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-asn
         */
        readonly asn?: number;
        /**
         * The Region where a core network edge is located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-edgelocation
         */
        readonly edgeLocation?: string;
        /**
         * The inside IP addresses used for core network edges.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-insidecidrblocks
         */
        readonly insideCidrBlocks?: string[];
    }
}
export declare namespace CfnCoreNetwork {
    /**
     * Describes a core network segment, which are dedicated routes. Only attachments within this segment can communicate with each other.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html
     */
    interface CoreNetworkSegmentProperty {
        /**
         * The Regions where the edges are located.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-edgelocations
         */
        readonly edgeLocations?: string[];
        /**
         * The name of a core network segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-name
         */
        readonly name?: string;
        /**
         * The shared segments of a core network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-sharedsegments
         */
        readonly sharedSegments?: string[];
    }
}
/**
 * Properties for defining a `CfnCustomerGatewayAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html
 */
export interface CfnCustomerGatewayAssociationProps {
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-customergatewayarn
     */
    readonly customerGatewayArn: string;
    /**
     * The ID of the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-deviceid
     */
    readonly deviceId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-linkid
     */
    readonly linkId?: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::CustomerGatewayAssociation`
 *
 * Specifies an association between a customer gateway, a device, and optionally, a link. If you specify a link, it must be associated with the specified device. The customer gateway must be connected to a VPN attachment on a transit gateway that's registered in your global network.
 *
 * You cannot associate a customer gateway with more than one device and link.
 *
 * @cloudformationResource AWS::NetworkManager::CustomerGatewayAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html
 */
export declare class CfnCustomerGatewayAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::CustomerGatewayAssociation";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomerGatewayAssociation;
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-customergatewayarn
     */
    customerGatewayArn: string;
    /**
     * The ID of the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-deviceid
     */
    deviceId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-linkid
     */
    linkId: string | undefined;
    /**
     * Create a new `AWS::NetworkManager::CustomerGatewayAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomerGatewayAssociationProps);
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
 * Properties for defining a `CfnDevice`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html
 */
export interface CfnDeviceProps {
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * A description of the device.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-description
     */
    readonly description?: string;
    /**
     * The site location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-location
     */
    readonly location?: CfnDevice.LocationProperty | cdk.IResolvable;
    /**
     * The model of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-model
     */
    readonly model?: string;
    /**
     * The serial number of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-serialnumber
     */
    readonly serialNumber?: string;
    /**
     * The site ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-siteid
     */
    readonly siteId?: string;
    /**
     * The tags for the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-type
     */
    readonly type?: string;
    /**
     * The vendor of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-vendor
     */
    readonly vendor?: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::Device`
 *
 * Specifies a device.
 *
 * @cloudformationResource AWS::NetworkManager::Device
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html
 */
export declare class CfnDevice extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Device";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevice;
    /**
     * The ARN of the device. For example, `arn:aws:networkmanager::123456789012:device/global-network-01231231231231231/device-07f6fd08867abc123` .
     * @cloudformationAttribute DeviceArn
     */
    readonly attrDeviceArn: string;
    /**
     * The ID of the device. For example, `device-07f6fd08867abc123` .
     * @cloudformationAttribute DeviceId
     */
    readonly attrDeviceId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * A description of the device.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-description
     */
    description: string | undefined;
    /**
     * The site location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-location
     */
    location: CfnDevice.LocationProperty | cdk.IResolvable | undefined;
    /**
     * The model of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-model
     */
    model: string | undefined;
    /**
     * The serial number of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-serialnumber
     */
    serialNumber: string | undefined;
    /**
     * The site ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-siteid
     */
    siteId: string | undefined;
    /**
     * The tags for the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-type
     */
    type: string | undefined;
    /**
     * The vendor of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-vendor
     */
    vendor: string | undefined;
    /**
     * Create a new `AWS::NetworkManager::Device`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeviceProps);
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
export declare namespace CfnDevice {
    /**
     * Describes a location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html
     */
    interface LocationProperty {
        /**
         * The physical address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-address
         */
        readonly address?: string;
        /**
         * The latitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-latitude
         */
        readonly latitude?: string;
        /**
         * The longitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-longitude
         */
        readonly longitude?: string;
    }
}
/**
 * Properties for defining a `CfnGlobalNetwork`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html
 */
export interface CfnGlobalNetworkProps {
    /**
     * A description of the global network.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-description
     */
    readonly description?: string;
    /**
     * The tags for the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::GlobalNetwork`
 *
 * Creates a new, empty global network.
 *
 * @cloudformationResource AWS::NetworkManager::GlobalNetwork
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html
 */
export declare class CfnGlobalNetwork extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::GlobalNetwork";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGlobalNetwork;
    /**
     * The ARN of the global network. For example, `arn:aws:networkmanager::123456789012:global-network/global-network-01231231231231231` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the global network. For example, `global-network-01231231231231231` .
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * A description of the global network.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-description
     */
    description: string | undefined;
    /**
     * The tags for the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::GlobalNetwork`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnGlobalNetworkProps);
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
 * Properties for defining a `CfnLink`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html
 */
export interface CfnLinkProps {
    /**
     * The bandwidth for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-bandwidth
     */
    readonly bandwidth: CfnLink.BandwidthProperty | cdk.IResolvable;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * The ID of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-siteid
     */
    readonly siteId: string;
    /**
     * A description of the link.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-description
     */
    readonly description?: string;
    /**
     * The provider of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-provider
     */
    readonly provider?: string;
    /**
     * The tags for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The type of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-type
     */
    readonly type?: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::Link`
 *
 * Specifies a link for a site.
 *
 * @cloudformationResource AWS::NetworkManager::Link
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html
 */
export declare class CfnLink extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Link";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLink;
    /**
     * The ARN of the link. For example, `arn:aws:networkmanager::123456789012:link/global-network-01231231231231231/link-11112222aaaabbbb1` .
     * @cloudformationAttribute LinkArn
     */
    readonly attrLinkArn: string;
    /**
     * The ID of the link. For example, `link-11112222aaaabbbb1` .
     * @cloudformationAttribute LinkId
     */
    readonly attrLinkId: string;
    /**
     * The bandwidth for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-bandwidth
     */
    bandwidth: CfnLink.BandwidthProperty | cdk.IResolvable;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * The ID of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-siteid
     */
    siteId: string;
    /**
     * A description of the link.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-description
     */
    description: string | undefined;
    /**
     * The provider of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-provider
     */
    provider: string | undefined;
    /**
     * The tags for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The type of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-type
     */
    type: string | undefined;
    /**
     * Create a new `AWS::NetworkManager::Link`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLinkProps);
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
export declare namespace CfnLink {
    /**
     * Describes bandwidth information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html
     */
    interface BandwidthProperty {
        /**
         * Download speed in Mbps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html#cfn-networkmanager-link-bandwidth-downloadspeed
         */
        readonly downloadSpeed?: number;
        /**
         * Upload speed in Mbps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html#cfn-networkmanager-link-bandwidth-uploadspeed
         */
        readonly uploadSpeed?: number;
    }
}
/**
 * Properties for defining a `CfnLinkAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html
 */
export interface CfnLinkAssociationProps {
    /**
     * The device ID for the link association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-deviceid
     */
    readonly deviceId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-linkid
     */
    readonly linkId: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::LinkAssociation`
 *
 * Describes the association between a device and a link.
 *
 * @cloudformationResource AWS::NetworkManager::LinkAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html
 */
export declare class CfnLinkAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::LinkAssociation";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLinkAssociation;
    /**
     * The device ID for the link association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-deviceid
     */
    deviceId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-linkid
     */
    linkId: string;
    /**
     * Create a new `AWS::NetworkManager::LinkAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLinkAssociationProps);
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
 * Properties for defining a `CfnSite`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html
 */
export interface CfnSiteProps {
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * A description of your site.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-description
     */
    readonly description?: string;
    /**
     * The site location. This information is used for visualization in the Network Manager console. If you specify the address, the latitude and longitude are automatically calculated.
     *
     * - `Address` : The physical address of the site.
     * - `Latitude` : The latitude of the site.
     * - `Longitude` : The longitude of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-location
     */
    readonly location?: CfnSite.LocationProperty | cdk.IResolvable;
    /**
     * The tags for the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::Site`
 *
 * Creates a new site in a global network.
 *
 * @cloudformationResource AWS::NetworkManager::Site
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html
 */
export declare class CfnSite extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Site";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSite;
    /**
     * The ARN of the site. For example, `arn:aws:networkmanager::123456789012:site/global-network-01231231231231231/site-444555aaabbb11223` .
     * @cloudformationAttribute SiteArn
     */
    readonly attrSiteArn: string;
    /**
     * The ID of the site. For example, `site-444555aaabbb11223` .
     * @cloudformationAttribute SiteId
     */
    readonly attrSiteId: string;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * A description of your site.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-description
     */
    description: string | undefined;
    /**
     * The site location. This information is used for visualization in the Network Manager console. If you specify the address, the latitude and longitude are automatically calculated.
     *
     * - `Address` : The physical address of the site.
     * - `Latitude` : The latitude of the site.
     * - `Longitude` : The longitude of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-location
     */
    location: CfnSite.LocationProperty | cdk.IResolvable | undefined;
    /**
     * The tags for the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::Site`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSiteProps);
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
export declare namespace CfnSite {
    /**
     * Describes a location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html
     */
    interface LocationProperty {
        /**
         * The physical address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-address
         */
        readonly address?: string;
        /**
         * The latitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-latitude
         */
        readonly latitude?: string;
        /**
         * The longitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-longitude
         */
        readonly longitude?: string;
    }
}
/**
 * Properties for defining a `CfnSiteToSiteVpnAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html
 */
export interface CfnSiteToSiteVpnAttachmentProps {
    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.CoreNetworkId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-corenetworkid
     */
    readonly coreNetworkId?: string;
    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The ARN of the site-to-site VPN attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-vpnconnectionarn
     */
    readonly vpnConnectionArn?: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::SiteToSiteVpnAttachment`
 *
 * Creates an Amazon Web Services site-to-site VPN attachment on an edge location of a core network.
 *
 * @cloudformationResource AWS::NetworkManager::SiteToSiteVpnAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html
 */
export declare class CfnSiteToSiteVpnAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::SiteToSiteVpnAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSiteToSiteVpnAttachment;
    /**
     * The ID of the site-to-site VPN attachment.
     * @cloudformationAttribute AttachmentId
     */
    readonly attrAttachmentId: string;
    /**
     * The policy rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    readonly attrAttachmentPolicyRuleNumber: number;
    /**
     * The type of attachment. This will be `SITE_TO_SITE_VPN` .
     * @cloudformationAttribute AttachmentType
     */
    readonly attrAttachmentType: string;
    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    readonly attrCoreNetworkArn: string;
    /**
     * The timestamp when the site-to-site VPN attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The Region where the core network edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    readonly attrEdgeLocation: string;
    /**
     * The ID of the site-to-site VPN attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    readonly attrOwnerAccountId: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    readonly attrProposedSegmentChangeSegmentName: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    readonly attrProposedSegmentChangeTags: cdk.IResolvable;
    /**
     * The resource ARN for the site-to-site VPN attachment.
     * @cloudformationAttribute ResourceArn
     */
    readonly attrResourceArn: string;
    /**
     * The name of the site-to-site VPN attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    readonly attrSegmentName: string;
    /**
     * The state of the site-to-site VPN attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * The timestamp when the site-to-site VPN attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    readonly attrUpdatedAt: string;
    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.CoreNetworkId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-corenetworkid
     */
    coreNetworkId: string | undefined;
    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The ARN of the site-to-site VPN attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-vpnconnectionarn
     */
    vpnConnectionArn: string | undefined;
    /**
     * Create a new `AWS::NetworkManager::SiteToSiteVpnAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnSiteToSiteVpnAttachmentProps);
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
export declare namespace CfnSiteToSiteVpnAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html
     */
    interface ProposedSegmentChangeProperty {
        /**
         * The rule number in the policy document that applies to this change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-attachmentpolicyrulenumber
         */
        readonly attachmentPolicyRuleNumber?: number;
        /**
         * The name of the segment to change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-segmentname
         */
        readonly segmentName?: string;
        /**
         * The list of key-value tags that changed for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}
/**
 * Properties for defining a `CfnTransitGatewayRegistration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html
 */
export interface CfnTransitGatewayRegistrationProps {
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-globalnetworkid
     */
    readonly globalNetworkId: string;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-transitgatewayarn
     */
    readonly transitGatewayArn: string;
}
/**
 * A CloudFormation `AWS::NetworkManager::TransitGatewayRegistration`
 *
 * Registers a transit gateway in your global network. Not all Regions support transit gateways for global networks. For a list of the supported Regions, see [Region Availability](https://docs.aws.amazon.com/network-manager/latest/tgwnm/what-are-global-networks.html#nm-available-regions) in the *AWS Transit Gateways for Global Networks User Guide* . The transit gateway can be in any of the supported AWS Regions, but it must be owned by the same AWS account that owns the global network. You cannot register a transit gateway in more than one global network.
 *
 * @cloudformationResource AWS::NetworkManager::TransitGatewayRegistration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html
 */
export declare class CfnTransitGatewayRegistration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::TransitGatewayRegistration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTransitGatewayRegistration;
    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-globalnetworkid
     */
    globalNetworkId: string;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-transitgatewayarn
     */
    transitGatewayArn: string;
    /**
     * Create a new `AWS::NetworkManager::TransitGatewayRegistration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTransitGatewayRegistrationProps);
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
 * Properties for defining a `CfnVpcAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html
 */
export interface CfnVpcAttachmentProps {
    /**
     * The core network ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-corenetworkid
     */
    readonly coreNetworkId: string;
    /**
     * The subnet ARNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-subnetarns
     */
    readonly subnetArns: string[];
    /**
     * The ARN of the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-vpcarn
     */
    readonly vpcArn: string;
    /**
     * Options for creating the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-options
     */
    readonly options?: CfnVpcAttachment.VpcOptionsProperty | cdk.IResolvable;
    /**
     * The tags associated with the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::NetworkManager::VpcAttachment`
 *
 * Creates a VPC attachment on an edge location of a core network.
 *
 * @cloudformationResource AWS::NetworkManager::VpcAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html
 */
export declare class CfnVpcAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::VpcAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcAttachment;
    /**
     * The ID of the VPC attachment.
     * @cloudformationAttribute AttachmentId
     */
    readonly attrAttachmentId: string;
    /**
     * The policy rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    readonly attrAttachmentPolicyRuleNumber: number;
    /**
     * The type of attachment. This will be `VPC` .
     * @cloudformationAttribute AttachmentType
     */
    readonly attrAttachmentType: string;
    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    readonly attrCoreNetworkArn: string;
    /**
     * The timestamp when the VPC attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The Region where the core network edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    readonly attrEdgeLocation: string;
    /**
     * The ID of the VPC attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    readonly attrOwnerAccountId: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    readonly attrProposedSegmentChangeSegmentName: string;
    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    readonly attrProposedSegmentChangeTags: cdk.IResolvable;
    /**
     * The resource ARN for the VPC attachment.
     * @cloudformationAttribute ResourceArn
     */
    readonly attrResourceArn: string;
    /**
     * The name of the attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    readonly attrSegmentName: string;
    /**
     * The state of the attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * The timestamp when the VPC attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    readonly attrUpdatedAt: string;
    /**
     * The core network ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-corenetworkid
     */
    coreNetworkId: string;
    /**
     * The subnet ARNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-subnetarns
     */
    subnetArns: string[];
    /**
     * The ARN of the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-vpcarn
     */
    vpcArn: string;
    /**
     * Options for creating the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-options
     */
    options: CfnVpcAttachment.VpcOptionsProperty | cdk.IResolvable | undefined;
    /**
     * The tags associated with the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NetworkManager::VpcAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVpcAttachmentProps);
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
export declare namespace CfnVpcAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html
     */
    interface ProposedSegmentChangeProperty {
        /**
         * The rule number in the policy document that applies to this change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-attachmentpolicyrulenumber
         */
        readonly attachmentPolicyRuleNumber?: number;
        /**
         * The name of the segment to change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-segmentname
         */
        readonly segmentName?: string;
        /**
         * The list of key-value tags that changed for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-tags
         */
        readonly tags?: cdk.CfnTag[];
    }
}
export declare namespace CfnVpcAttachment {
    /**
     * Describes the VPC options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html
     */
    interface VpcOptionsProperty {
        /**
         * Indicates whether appliance mode is supported. If enabled, traffic flow between a source and destination use the same Availability Zone for the VPC attachment for the lifetime of that flow. The default value is `false` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html#cfn-networkmanager-vpcattachment-vpcoptions-appliancemodesupport
         */
        readonly applianceModeSupport?: boolean | cdk.IResolvable;
        /**
         * Indicates whether IPv6 is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html#cfn-networkmanager-vpcattachment-vpcoptions-ipv6support
         */
        readonly ipv6Support?: boolean | cdk.IResolvable;
    }
}
