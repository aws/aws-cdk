/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new accessor for use with Amazon Managed Blockchain service that supports token based access.
 *
 * The accessor contains information required for token based access.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Accessor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-accessor.html
 */
export class CfnAccessor extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ManagedBlockchain::Accessor";

  /**
   * Build a CfnAccessor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the accessor. For more information about ARNs and their format, see [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) in the *AWS General Reference* .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The billing token is a property of the accessor. Use this token to make Ethereum API calls to your Ethereum node. The billing token is used to track your accessor object for billing Ethereum API requests made to your Ethereum nodes.
   *
   * @cloudformationAttribute BillingToken
   */
  public readonly attrBillingToken: string;

  /**
   * The creation date and time of the accessor.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The unique identifier of the accessor.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The current status of the accessor.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The type of the accessor.
   */
  public accessorType: string;

  /**
   * The blockchain network that the `Accessor` token is created for.
   */
  public networkType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the Accessor.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessorProps) {
    super(scope, id, {
      "type": CfnAccessor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessorType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrBillingToken = cdk.Token.asString(this.getAtt("BillingToken", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.accessorType = props.accessorType;
    this.networkType = props.networkType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ManagedBlockchain::Accessor", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessorType": this.accessorType,
      "networkType": this.networkType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccessor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-accessor.html
 */
export interface CfnAccessorProps {
  /**
   * The type of the accessor.
   *
   * > Currently, accessor type is restricted to `BILLING_TOKEN` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-accessor.html#cfn-managedblockchain-accessor-accessortype
   */
  readonly accessorType: string;

  /**
   * The blockchain network that the `Accessor` token is created for.
   *
   * > We recommend using the appropriate `networkType` value for the blockchain network that you are creating the `Accessor` token for. You cannot use the value `ETHEREUM_MAINNET_AND_GOERLI` to specify a `networkType` for your Accessor token.
   * >
   * > The default value of `ETHEREUM_MAINNET_AND_GOERLI` is only applied:
   * >
   * > - when the `CreateAccessor` action does not set a `networkType` .
   * > - to all existing `Accessor` tokens that were created before the `networkType` property was introduced.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-accessor.html#cfn-managedblockchain-accessor-networktype
   */
  readonly networkType?: string;

  /**
   * The tags assigned to the Accessor.
   *
   * For more information about tags, see [Tagging Resources](https://docs.aws.amazon.com/managed-blockchain/latest/ethereum-dev/tagging-resources.html) in the *Amazon Managed Blockchain Ethereum Developer Guide* , or [Tagging Resources](https://docs.aws.amazon.com/managed-blockchain/latest/hyperledger-fabric-dev/tagging-resources.html) in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-accessor.html#cfn-managedblockchain-accessor-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAccessorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessorType", cdk.requiredValidator)(properties.accessorType));
  errors.collect(cdk.propertyValidator("accessorType", cdk.validateString)(properties.accessorType));
  errors.collect(cdk.propertyValidator("networkType", cdk.validateString)(properties.networkType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAccessorProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessorPropsValidator(properties).assertSuccess();
  return {
    "AccessorType": cdk.stringToCloudFormation(properties.accessorType),
    "NetworkType": cdk.stringToCloudFormation(properties.networkType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAccessorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessorProps>();
  ret.addPropertyResult("accessorType", "AccessorType", (properties.AccessorType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessorType) : undefined));
  ret.addPropertyResult("networkType", "NetworkType", (properties.NetworkType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a member within a Managed Blockchain network.
 *
 * Applies only to Hyperledger Fabric.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Member
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export class CfnMember extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ManagedBlockchain::Member";

  /**
   * Build a CfnMember from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMember {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMemberPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMember(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the member.
   *
   * @cloudformationAttribute MemberId
   */
  public readonly attrMemberId: string;

  /**
   * The unique identifier of the network to which the member belongs.
   *
   * @cloudformationAttribute NetworkId
   */
  public readonly attrNetworkId: string;

  /**
   * The unique identifier of the invitation to join the network sent to the account that creates the member.
   */
  public invitationId?: string;

  /**
   * Configuration properties of the member.
   */
  public memberConfiguration: cdk.IResolvable | CfnMember.MemberConfigurationProperty;

  /**
   * Configuration properties of the network to which the member belongs.
   */
  public networkConfiguration?: cdk.IResolvable | CfnMember.NetworkConfigurationProperty;

  /**
   * The unique identifier of the network to which the member belongs.
   */
  public networkId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMemberProps) {
    super(scope, id, {
      "type": CfnMember.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "memberConfiguration", this);

    this.attrMemberId = cdk.Token.asString(this.getAtt("MemberId", cdk.ResolutionTypeHint.STRING));
    this.attrNetworkId = cdk.Token.asString(this.getAtt("NetworkId", cdk.ResolutionTypeHint.STRING));
    this.invitationId = props.invitationId;
    this.memberConfiguration = props.memberConfiguration;
    this.networkConfiguration = props.networkConfiguration;
    this.networkId = props.networkId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "invitationId": this.invitationId,
      "memberConfiguration": this.memberConfiguration,
      "networkConfiguration": this.networkConfiguration,
      "networkId": this.networkId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMember.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMemberPropsToCloudFormation(props);
  }
}

export namespace CfnMember {
  /**
   * Configuration properties of the member.
   *
   * Applies only to Hyperledger Fabric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html
   */
  export interface MemberConfigurationProperty {
    /**
     * An optional description of the member.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-description
     */
    readonly description?: string;

    /**
     * Configuration properties of the blockchain framework relevant to the member.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-memberframeworkconfiguration
     */
    readonly memberFrameworkConfiguration?: cdk.IResolvable | CfnMember.MemberFrameworkConfigurationProperty;

    /**
     * The name of the member.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-name
     */
    readonly name: string;
  }

  /**
   * Configuration properties relevant to a member for the blockchain framework that the Managed Blockchain network uses.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html
   */
  export interface MemberFrameworkConfigurationProperty {
    /**
     * Configuration properties for Hyperledger Fabric.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html#cfn-managedblockchain-member-memberframeworkconfiguration-memberfabricconfiguration
     */
    readonly memberFabricConfiguration?: cdk.IResolvable | CfnMember.MemberFabricConfigurationProperty;
  }

  /**
   * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network that is using the Hyperledger Fabric framework.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html
   */
  export interface MemberFabricConfigurationProperty {
    /**
     * The password for the member's initial administrative user.
     *
     * The `AdminPassword` must be at least 8 characters long and no more than 32 characters. It must contain at least one uppercase letter, one lowercase letter, and one digit. It cannot have a single quotation mark (‘), a double quotation marks (“), a forward slash(/), a backward slash(\), @, or a space.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminpassword
     */
    readonly adminPassword: string;

    /**
     * The user name for the member's initial administrative user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminusername
     */
    readonly adminUsername: string;
  }

  /**
   * Configuration properties of the network to which the member belongs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Attributes of the blockchain framework for the network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-description
     */
    readonly description?: string;

    /**
     * The blockchain framework that the network uses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-framework
     */
    readonly framework: string;

    /**
     * The version of the blockchain framework that the network uses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-frameworkversion
     */
    readonly frameworkVersion: string;

    /**
     * The name of the network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-name
     */
    readonly name: string;

    /**
     * Configuration properties relevant to the network for the blockchain framework that the network uses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-networkframeworkconfiguration
     */
    readonly networkFrameworkConfiguration?: cdk.IResolvable | CfnMember.NetworkFrameworkConfigurationProperty;

    /**
     * The voting rules that the network uses to decide if a proposal is accepted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-votingpolicy
     */
    readonly votingPolicy: cdk.IResolvable | CfnMember.VotingPolicyProperty;
  }

  /**
   * The voting rules for the network to decide if a proposal is accepted.
   *
   * Applies only to Hyperledger Fabric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html
   */
  export interface VotingPolicyProperty {
    /**
     * Defines the rules for the network for voting on proposals, such as the percentage of `YES` votes required for the proposal to be approved and the duration of the proposal.
     *
     * The policy applies to all proposals and is specified when the network is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html#cfn-managedblockchain-member-votingpolicy-approvalthresholdpolicy
     */
    readonly approvalThresholdPolicy?: CfnMember.ApprovalThresholdPolicyProperty | cdk.IResolvable;
  }

  /**
   * A policy type that defines the voting rules for the network.
   *
   * The rules decide if a proposal is approved. Approval may be based on criteria such as the percentage of `YES` votes and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
   *
   * Applies only to Hyperledger Fabric.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html
   */
  export interface ApprovalThresholdPolicyProperty {
    /**
     * The duration from the time that a proposal is created until it expires.
     *
     * If members cast neither the required number of `YES` votes to approve the proposal nor the number of `NO` votes required to reject it before the duration expires, the proposal is `EXPIRED` and `ProposalActions` aren't carried out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-proposaldurationinhours
     */
    readonly proposalDurationInHours?: number;

    /**
     * Determines whether the vote percentage must be greater than the `ThresholdPercentage` or must be greater than or equal to the `ThresholdPercentage` to be approved.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdcomparator
     */
    readonly thresholdComparator?: string;

    /**
     * The percentage of votes among all members that must be `YES` for a proposal to be approved.
     *
     * For example, a `ThresholdPercentage` value of `50` indicates 50%. The `ThresholdComparator` determines the precise comparison. If a `ThresholdPercentage` value of `50` is specified on a network with 10 members, along with a `ThresholdComparator` value of `GREATER_THAN` , this indicates that 6 `YES` votes are required for the proposal to be approved.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdpercentage
     */
    readonly thresholdPercentage?: number;
  }

  /**
   * Configuration properties relevant to the network for the blockchain framework that the network uses.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html
   */
  export interface NetworkFrameworkConfigurationProperty {
    /**
     * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network that is using the Hyperledger Fabric framework.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html#cfn-managedblockchain-member-networkframeworkconfiguration-networkfabricconfiguration
     */
    readonly networkFabricConfiguration?: cdk.IResolvable | CfnMember.NetworkFabricConfigurationProperty;
  }

  /**
   * Hyperledger Fabric configuration properties for the network.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html
   */
  export interface NetworkFabricConfigurationProperty {
    /**
     * The edition of Amazon Managed Blockchain that the network uses.
     *
     * Valid values are `standard` and `starter` . For more information, see [Amazon Managed Blockchain Pricing](https://docs.aws.amazon.com/managed-blockchain/pricing/)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html#cfn-managedblockchain-member-networkfabricconfiguration-edition
     */
    readonly edition: string;
  }
}

/**
 * Properties for defining a `CfnMember`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export interface CfnMemberProps {
  /**
   * The unique identifier of the invitation to join the network sent to the account that creates the member.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-invitationid
   */
  readonly invitationId?: string;

  /**
   * Configuration properties of the member.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-memberconfiguration
   */
  readonly memberConfiguration: cdk.IResolvable | CfnMember.MemberConfigurationProperty;

  /**
   * Configuration properties of the network to which the member belongs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnMember.NetworkConfigurationProperty;

  /**
   * The unique identifier of the network to which the member belongs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkid
   */
  readonly networkId?: string;
}

/**
 * Determine whether the given properties match those of a `MemberFabricConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberFabricConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberMemberFabricConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adminPassword", cdk.requiredValidator)(properties.adminPassword));
  errors.collect(cdk.propertyValidator("adminPassword", cdk.validateString)(properties.adminPassword));
  errors.collect(cdk.propertyValidator("adminUsername", cdk.requiredValidator)(properties.adminUsername));
  errors.collect(cdk.propertyValidator("adminUsername", cdk.validateString)(properties.adminUsername));
  return errors.wrap("supplied properties not correct for \"MemberFabricConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberMemberFabricConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberMemberFabricConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdminPassword": cdk.stringToCloudFormation(properties.adminPassword),
    "AdminUsername": cdk.stringToCloudFormation(properties.adminUsername)
  };
}

// @ts-ignore TS6133
function CfnMemberMemberFabricConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.MemberFabricConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberFabricConfigurationProperty>();
  ret.addPropertyResult("adminPassword", "AdminPassword", (properties.AdminPassword != null ? cfn_parse.FromCloudFormation.getString(properties.AdminPassword) : undefined));
  ret.addPropertyResult("adminUsername", "AdminUsername", (properties.AdminUsername != null ? cfn_parse.FromCloudFormation.getString(properties.AdminUsername) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MemberFrameworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberFrameworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberMemberFrameworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("memberFabricConfiguration", CfnMemberMemberFabricConfigurationPropertyValidator)(properties.memberFabricConfiguration));
  return errors.wrap("supplied properties not correct for \"MemberFrameworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberMemberFrameworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberMemberFrameworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MemberFabricConfiguration": convertCfnMemberMemberFabricConfigurationPropertyToCloudFormation(properties.memberFabricConfiguration)
  };
}

// @ts-ignore TS6133
function CfnMemberMemberFrameworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.MemberFrameworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberFrameworkConfigurationProperty>();
  ret.addPropertyResult("memberFabricConfiguration", "MemberFabricConfiguration", (properties.MemberFabricConfiguration != null ? CfnMemberMemberFabricConfigurationPropertyFromCloudFormation(properties.MemberFabricConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MemberConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberMemberConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("memberFrameworkConfiguration", CfnMemberMemberFrameworkConfigurationPropertyValidator)(properties.memberFrameworkConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"MemberConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberMemberConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberMemberConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MemberFrameworkConfiguration": convertCfnMemberMemberFrameworkConfigurationPropertyToCloudFormation(properties.memberFrameworkConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnMemberMemberConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.MemberConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberConfigurationProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("memberFrameworkConfiguration", "MemberFrameworkConfiguration", (properties.MemberFrameworkConfiguration != null ? CfnMemberMemberFrameworkConfigurationPropertyFromCloudFormation(properties.MemberFrameworkConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApprovalThresholdPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ApprovalThresholdPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberApprovalThresholdPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("proposalDurationInHours", cdk.validateNumber)(properties.proposalDurationInHours));
  errors.collect(cdk.propertyValidator("thresholdComparator", cdk.validateString)(properties.thresholdComparator));
  errors.collect(cdk.propertyValidator("thresholdPercentage", cdk.validateNumber)(properties.thresholdPercentage));
  return errors.wrap("supplied properties not correct for \"ApprovalThresholdPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberApprovalThresholdPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberApprovalThresholdPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ProposalDurationInHours": cdk.numberToCloudFormation(properties.proposalDurationInHours),
    "ThresholdComparator": cdk.stringToCloudFormation(properties.thresholdComparator),
    "ThresholdPercentage": cdk.numberToCloudFormation(properties.thresholdPercentage)
  };
}

// @ts-ignore TS6133
function CfnMemberApprovalThresholdPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.ApprovalThresholdPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.ApprovalThresholdPolicyProperty>();
  ret.addPropertyResult("proposalDurationInHours", "ProposalDurationInHours", (properties.ProposalDurationInHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProposalDurationInHours) : undefined));
  ret.addPropertyResult("thresholdComparator", "ThresholdComparator", (properties.ThresholdComparator != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdComparator) : undefined));
  ret.addPropertyResult("thresholdPercentage", "ThresholdPercentage", (properties.ThresholdPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VotingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VotingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberVotingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("approvalThresholdPolicy", CfnMemberApprovalThresholdPolicyPropertyValidator)(properties.approvalThresholdPolicy));
  return errors.wrap("supplied properties not correct for \"VotingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberVotingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberVotingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "ApprovalThresholdPolicy": convertCfnMemberApprovalThresholdPolicyPropertyToCloudFormation(properties.approvalThresholdPolicy)
  };
}

// @ts-ignore TS6133
function CfnMemberVotingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.VotingPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.VotingPolicyProperty>();
  ret.addPropertyResult("approvalThresholdPolicy", "ApprovalThresholdPolicy", (properties.ApprovalThresholdPolicy != null ? CfnMemberApprovalThresholdPolicyPropertyFromCloudFormation(properties.ApprovalThresholdPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkFabricConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkFabricConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberNetworkFabricConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("edition", cdk.requiredValidator)(properties.edition));
  errors.collect(cdk.propertyValidator("edition", cdk.validateString)(properties.edition));
  return errors.wrap("supplied properties not correct for \"NetworkFabricConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberNetworkFabricConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberNetworkFabricConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Edition": cdk.stringToCloudFormation(properties.edition)
  };
}

// @ts-ignore TS6133
function CfnMemberNetworkFabricConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.NetworkFabricConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkFabricConfigurationProperty>();
  ret.addPropertyResult("edition", "Edition", (properties.Edition != null ? cfn_parse.FromCloudFormation.getString(properties.Edition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkFrameworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkFrameworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberNetworkFrameworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("networkFabricConfiguration", CfnMemberNetworkFabricConfigurationPropertyValidator)(properties.networkFabricConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkFrameworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberNetworkFrameworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberNetworkFrameworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "NetworkFabricConfiguration": convertCfnMemberNetworkFabricConfigurationPropertyToCloudFormation(properties.networkFabricConfiguration)
  };
}

// @ts-ignore TS6133
function CfnMemberNetworkFrameworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.NetworkFrameworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkFrameworkConfigurationProperty>();
  ret.addPropertyResult("networkFabricConfiguration", "NetworkFabricConfiguration", (properties.NetworkFabricConfiguration != null ? CfnMemberNetworkFabricConfigurationPropertyFromCloudFormation(properties.NetworkFabricConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("framework", cdk.requiredValidator)(properties.framework));
  errors.collect(cdk.propertyValidator("framework", cdk.validateString)(properties.framework));
  errors.collect(cdk.propertyValidator("frameworkVersion", cdk.requiredValidator)(properties.frameworkVersion));
  errors.collect(cdk.propertyValidator("frameworkVersion", cdk.validateString)(properties.frameworkVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkFrameworkConfiguration", CfnMemberNetworkFrameworkConfigurationPropertyValidator)(properties.networkFrameworkConfiguration));
  errors.collect(cdk.propertyValidator("votingPolicy", cdk.requiredValidator)(properties.votingPolicy));
  errors.collect(cdk.propertyValidator("votingPolicy", CfnMemberVotingPolicyPropertyValidator)(properties.votingPolicy));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMemberNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Framework": cdk.stringToCloudFormation(properties.framework),
    "FrameworkVersion": cdk.stringToCloudFormation(properties.frameworkVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkFrameworkConfiguration": convertCfnMemberNetworkFrameworkConfigurationPropertyToCloudFormation(properties.networkFrameworkConfiguration),
    "VotingPolicy": convertCfnMemberVotingPolicyPropertyToCloudFormation(properties.votingPolicy)
  };
}

// @ts-ignore TS6133
function CfnMemberNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMember.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkConfigurationProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("framework", "Framework", (properties.Framework != null ? cfn_parse.FromCloudFormation.getString(properties.Framework) : undefined));
  ret.addPropertyResult("frameworkVersion", "FrameworkVersion", (properties.FrameworkVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FrameworkVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkFrameworkConfiguration", "NetworkFrameworkConfiguration", (properties.NetworkFrameworkConfiguration != null ? CfnMemberNetworkFrameworkConfigurationPropertyFromCloudFormation(properties.NetworkFrameworkConfiguration) : undefined));
  ret.addPropertyResult("votingPolicy", "VotingPolicy", (properties.VotingPolicy != null ? CfnMemberVotingPolicyPropertyFromCloudFormation(properties.VotingPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMemberProps`
 *
 * @param properties - the TypeScript properties of a `CfnMemberProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMemberPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invitationId", cdk.validateString)(properties.invitationId));
  errors.collect(cdk.propertyValidator("memberConfiguration", cdk.requiredValidator)(properties.memberConfiguration));
  errors.collect(cdk.propertyValidator("memberConfiguration", CfnMemberMemberConfigurationPropertyValidator)(properties.memberConfiguration));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnMemberNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("networkId", cdk.validateString)(properties.networkId));
  return errors.wrap("supplied properties not correct for \"CfnMemberProps\"");
}

// @ts-ignore TS6133
function convertCfnMemberPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMemberPropsValidator(properties).assertSuccess();
  return {
    "InvitationId": cdk.stringToCloudFormation(properties.invitationId),
    "MemberConfiguration": convertCfnMemberMemberConfigurationPropertyToCloudFormation(properties.memberConfiguration),
    "NetworkConfiguration": convertCfnMemberNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "NetworkId": cdk.stringToCloudFormation(properties.networkId)
  };
}

// @ts-ignore TS6133
function CfnMemberPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMemberProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMemberProps>();
  ret.addPropertyResult("invitationId", "InvitationId", (properties.InvitationId != null ? cfn_parse.FromCloudFormation.getString(properties.InvitationId) : undefined));
  ret.addPropertyResult("memberConfiguration", "MemberConfiguration", (properties.MemberConfiguration != null ? CfnMemberMemberConfigurationPropertyFromCloudFormation(properties.MemberConfiguration) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnMemberNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("networkId", "NetworkId", (properties.NetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a node on the specified blockchain network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Node
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export class CfnNode extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ManagedBlockchain::Node";

  /**
   * Build a CfnNode from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNode {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNodePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNode(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the node.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the member in which the node is created. Applies only to Hyperledger Fabric.
   *
   * @cloudformationAttribute MemberId
   */
  public readonly attrMemberId: string;

  /**
   * The unique identifier of the network that the node is in.
   *
   * @cloudformationAttribute NetworkId
   */
  public readonly attrNetworkId: string;

  /**
   * The unique identifier of the node.
   *
   * @cloudformationAttribute NodeId
   */
  public readonly attrNodeId: string;

  /**
   * The unique identifier of the member to which the node belongs.
   */
  public memberId?: string;

  /**
   * The unique identifier of the network for the node.
   */
  public networkId: string;

  /**
   * Configuration properties of a peer node.
   */
  public nodeConfiguration: cdk.IResolvable | CfnNode.NodeConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNodeProps) {
    super(scope, id, {
      "type": CfnNode.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "networkId", this);
    cdk.requireProperty(props, "nodeConfiguration", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrMemberId = cdk.Token.asString(this.getAtt("MemberId", cdk.ResolutionTypeHint.STRING));
    this.attrNetworkId = cdk.Token.asString(this.getAtt("NetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrNodeId = cdk.Token.asString(this.getAtt("NodeId", cdk.ResolutionTypeHint.STRING));
    this.memberId = props.memberId;
    this.networkId = props.networkId;
    this.nodeConfiguration = props.nodeConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "memberId": this.memberId,
      "networkId": this.networkId,
      "nodeConfiguration": this.nodeConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNode.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNodePropsToCloudFormation(props);
  }
}

export namespace CfnNode {
  /**
   * Configuration properties of a peer node within a membership.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html
   */
  export interface NodeConfigurationProperty {
    /**
     * The Availability Zone in which the node exists.
     *
     * Required for Ethereum nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-availabilityzone
     */
    readonly availabilityZone: string;

    /**
     * The Amazon Managed Blockchain instance type for the node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-instancetype
     */
    readonly instanceType: string;
  }
}

/**
 * Properties for defining a `CfnNode`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export interface CfnNodeProps {
  /**
   * The unique identifier of the member to which the node belongs.
   *
   * Applies only to Hyperledger Fabric.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-memberid
   */
  readonly memberId?: string;

  /**
   * The unique identifier of the network for the node.
   *
   * Ethereum public networks have the following `NetworkId` s:
   *
   * - `n-ethereum-mainnet`
   * - `n-ethereum-goerli`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-networkid
   */
  readonly networkId: string;

  /**
   * Configuration properties of a peer node.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-nodeconfiguration
   */
  readonly nodeConfiguration: cdk.IResolvable | CfnNode.NodeConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `NodeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NodeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodeNodeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.requiredValidator)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  return errors.wrap("supplied properties not correct for \"NodeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodeNodeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodeNodeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType)
  };
}

// @ts-ignore TS6133
function CfnNodeNodeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNode.NodeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNode.NodeConfigurationProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnNodeProps`
 *
 * @param properties - the TypeScript properties of a `CfnNodeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("memberId", cdk.validateString)(properties.memberId));
  errors.collect(cdk.propertyValidator("networkId", cdk.requiredValidator)(properties.networkId));
  errors.collect(cdk.propertyValidator("networkId", cdk.validateString)(properties.networkId));
  errors.collect(cdk.propertyValidator("nodeConfiguration", cdk.requiredValidator)(properties.nodeConfiguration));
  errors.collect(cdk.propertyValidator("nodeConfiguration", CfnNodeNodeConfigurationPropertyValidator)(properties.nodeConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnNodeProps\"");
}

// @ts-ignore TS6133
function convertCfnNodePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodePropsValidator(properties).assertSuccess();
  return {
    "MemberId": cdk.stringToCloudFormation(properties.memberId),
    "NetworkId": cdk.stringToCloudFormation(properties.networkId),
    "NodeConfiguration": convertCfnNodeNodeConfigurationPropertyToCloudFormation(properties.nodeConfiguration)
  };
}

// @ts-ignore TS6133
function CfnNodePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodeProps>();
  ret.addPropertyResult("memberId", "MemberId", (properties.MemberId != null ? cfn_parse.FromCloudFormation.getString(properties.MemberId) : undefined));
  ret.addPropertyResult("networkId", "NetworkId", (properties.NetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkId) : undefined));
  ret.addPropertyResult("nodeConfiguration", "NodeConfiguration", (properties.NodeConfiguration != null ? CfnNodeNodeConfigurationPropertyFromCloudFormation(properties.NodeConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}