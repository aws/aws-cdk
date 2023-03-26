import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnMember`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export interface CfnMemberProps {
    /**
     * Configuration properties of the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-memberconfiguration
     */
    readonly memberConfiguration: CfnMember.MemberConfigurationProperty | cdk.IResolvable;
    /**
     * The unique identifier of the invitation to join the network sent to the account that creates the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-invitationid
     */
    readonly invitationId?: string;
    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkconfiguration
     */
    readonly networkConfiguration?: CfnMember.NetworkConfigurationProperty | cdk.IResolvable;
    /**
     * The unique identifier of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkid
     */
    readonly networkId?: string;
}
/**
 * A CloudFormation `AWS::ManagedBlockchain::Member`
 *
 * Creates a member within a Managed Blockchain network.
 *
 * Applies only to Hyperledger Fabric.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Member
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export declare class CfnMember extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ManagedBlockchain::Member";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMember;
    /**
     * The unique identifier of the member.
     * @cloudformationAttribute MemberId
     */
    readonly attrMemberId: string;
    /**
     * The unique identifier of the network to which the member belongs.
     * @cloudformationAttribute NetworkId
     */
    readonly attrNetworkId: string;
    /**
     * Configuration properties of the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-memberconfiguration
     */
    memberConfiguration: CfnMember.MemberConfigurationProperty | cdk.IResolvable;
    /**
     * The unique identifier of the invitation to join the network sent to the account that creates the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-invitationid
     */
    invitationId: string | undefined;
    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkconfiguration
     */
    networkConfiguration: CfnMember.NetworkConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The unique identifier of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkid
     */
    networkId: string | undefined;
    /**
     * Create a new `AWS::ManagedBlockchain::Member`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMemberProps);
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
export declare namespace CfnMember {
    /**
     * A policy type that defines the voting rules for the network. The rules decide if a proposal is approved. Approval may be based on criteria such as the percentage of `YES` votes and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html
     */
    interface ApprovalThresholdPolicyProperty {
        /**
         * The duration from the time that a proposal is created until it expires. If members cast neither the required number of `YES` votes to approve the proposal nor the number of `NO` votes required to reject it before the duration expires, the proposal is `EXPIRED` and `ProposalActions` aren't carried out.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-proposaldurationinhours
         */
        readonly proposalDurationInHours?: number;
        /**
         * Determines whether the vote percentage must be greater than the `ThresholdPercentage` or must be greater than or equal to the `ThreholdPercentage` to be approved.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdcomparator
         */
        readonly thresholdComparator?: string;
        /**
         * The percentage of votes among all members that must be `YES` for a proposal to be approved. For example, a `ThresholdPercentage` value of `50` indicates 50%. The `ThresholdComparator` determines the precise comparison. If a `ThresholdPercentage` value of `50` is specified on a network with 10 members, along with a `ThresholdComparator` value of `GREATER_THAN` , this indicates that 6 `YES` votes are required for the proposal to be approved.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdpercentage
         */
        readonly thresholdPercentage?: number;
    }
}
export declare namespace CfnMember {
    /**
     * Configuration properties of the member.
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html
     */
    interface MemberConfigurationProperty {
        /**
         * An optional description of the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-description
         */
        readonly description?: string;
        /**
         * Configuration properties of the blockchain framework relevant to the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-memberframeworkconfiguration
         */
        readonly memberFrameworkConfiguration?: CfnMember.MemberFrameworkConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-name
         */
        readonly name: string;
    }
}
export declare namespace CfnMember {
    /**
     * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network using the Hyperledger Fabric framework.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html
     */
    interface MemberFabricConfigurationProperty {
        /**
         * The password for the member's initial administrative user. The `AdminPassword` must be at least eight characters long and no more than 32 characters. It must contain at least one uppercase letter, one lowercase letter, and one digit. It cannot have a single quotation mark (‘), a double quotation marks (“), a forward slash(/), a backward slash(\), @, or a space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminpassword
         */
        readonly adminPassword: string;
        /**
         * The user name for the member's initial administrative user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminusername
         */
        readonly adminUsername: string;
    }
}
export declare namespace CfnMember {
    /**
     * Configuration properties relevant to a member for the blockchain framework that the Managed Blockchain network uses.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html
     */
    interface MemberFrameworkConfigurationProperty {
        /**
         * Configuration properties for Hyperledger Fabric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html#cfn-managedblockchain-member-memberframeworkconfiguration-memberfabricconfiguration
         */
        readonly memberFabricConfiguration?: CfnMember.MemberFabricConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnMember {
    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html
     */
    interface NetworkConfigurationProperty {
        /**
         * Attributes of the blockchain framework for the network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-description
         */
        readonly description?: string;
        /**
         * The blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-framework
         */
        readonly framework: string;
        /**
         * The version of the blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-frameworkversion
         */
        readonly frameworkVersion: string;
        /**
         * The name of the network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-name
         */
        readonly name: string;
        /**
         * Configuration properties relevant to the network for the blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-networkframeworkconfiguration
         */
        readonly networkFrameworkConfiguration?: CfnMember.NetworkFrameworkConfigurationProperty | cdk.IResolvable;
        /**
         * The voting rules for the network to decide if a proposal is accepted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-votingpolicy
         */
        readonly votingPolicy: CfnMember.VotingPolicyProperty | cdk.IResolvable;
    }
}
export declare namespace CfnMember {
    /**
     * Hyperledger Fabric configuration properties for the network.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html
     */
    interface NetworkFabricConfigurationProperty {
        /**
         * The edition of Amazon Managed Blockchain that the network uses. Valid values are `standard` and `starter` . For more information, see
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html#cfn-managedblockchain-member-networkfabricconfiguration-edition
         */
        readonly edition: string;
    }
}
export declare namespace CfnMember {
    /**
     * Configuration properties relevant to the network for the blockchain framework that the network uses.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html
     */
    interface NetworkFrameworkConfigurationProperty {
        /**
         * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network using the Hyperledger Fabric framework.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html#cfn-managedblockchain-member-networkframeworkconfiguration-networkfabricconfiguration
         */
        readonly networkFabricConfiguration?: CfnMember.NetworkFabricConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnMember {
    /**
     * The voting rules for the network to decide if a proposal is accepted
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html
     */
    interface VotingPolicyProperty {
        /**
         * Defines the rules for the network for voting on proposals, such as the percentage of `YES` votes required for the proposal to be approved and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html#cfn-managedblockchain-member-votingpolicy-approvalthresholdpolicy
         */
        readonly approvalThresholdPolicy?: CfnMember.ApprovalThresholdPolicyProperty | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnNode`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export interface CfnNodeProps {
    /**
     * The unique identifier of the network for the node.
     *
     * Ethereum public networks have the following `NetworkId` s:
     *
     * - `n-ethereum-mainnet`
     * - `n-ethereum-goerli`
     * - `n-ethereum-rinkeby`
     * - `n-ethereum-ropsten`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-networkid
     */
    readonly networkId: string;
    /**
     * Configuration properties of a peer node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-nodeconfiguration
     */
    readonly nodeConfiguration: CfnNode.NodeConfigurationProperty | cdk.IResolvable;
    /**
     * The unique identifier of the member to which the node belongs. Applies only to Hyperledger Fabric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-memberid
     */
    readonly memberId?: string;
}
/**
 * A CloudFormation `AWS::ManagedBlockchain::Node`
 *
 * Creates a node on the specified blockchain network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Node
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export declare class CfnNode extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ManagedBlockchain::Node";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNode;
    /**
     * The Amazon Resource Name (ARN) of the node.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier of the member in which the node is created. Applies only to Hyperledger Fabric.
     * @cloudformationAttribute MemberId
     */
    readonly attrMemberId: string;
    /**
     * The unique identifier of the network that the node is in.
     * @cloudformationAttribute NetworkId
     */
    readonly attrNetworkId: string;
    /**
     * The unique identifier of the node.
     * @cloudformationAttribute NodeId
     */
    readonly attrNodeId: string;
    /**
     * The unique identifier of the network for the node.
     *
     * Ethereum public networks have the following `NetworkId` s:
     *
     * - `n-ethereum-mainnet`
     * - `n-ethereum-goerli`
     * - `n-ethereum-rinkeby`
     * - `n-ethereum-ropsten`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-networkid
     */
    networkId: string;
    /**
     * Configuration properties of a peer node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-nodeconfiguration
     */
    nodeConfiguration: CfnNode.NodeConfigurationProperty | cdk.IResolvable;
    /**
     * The unique identifier of the member to which the node belongs. Applies only to Hyperledger Fabric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-memberid
     */
    memberId: string | undefined;
    /**
     * Create a new `AWS::ManagedBlockchain::Node`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNodeProps);
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
export declare namespace CfnNode {
    /**
     * Configuration properties of a peer node within a membership.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html
     */
    interface NodeConfigurationProperty {
        /**
         * The Availability Zone in which the node exists. Required for Ethereum nodes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-availabilityzone
         */
        readonly availabilityZone: string;
        /**
         * The Amazon Managed Blockchain instance type for the node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-instancetype
         */
        readonly instanceType: string;
    }
}
