/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a core network Connect attachment from a specified core network attachment.
 *
 * A core network Connect attachment is a GRE-based tunnel attachment that you can use to establish a connection between a core network and an appliance. A core network Connect attachment uses an existing VPC attachment as the underlying transport mechanism.
 *
 * @cloudformationResource AWS::NetworkManager::ConnectAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html
 */
export class CfnConnectAttachment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::ConnectAttachment";

  /**
   * Build a CfnConnectAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the Connect attachment.
   *
   * @cloudformationAttribute AttachmentId
   */
  public readonly attrAttachmentId: string;

  /**
   * The rule number associated with the attachment.
   *
   * @cloudformationAttribute AttachmentPolicyRuleNumber
   */
  public readonly attrAttachmentPolicyRuleNumber: number;

  /**
   * The type of attachment. This will be `CONNECT` .
   *
   * @cloudformationAttribute AttachmentType
   */
  public readonly attrAttachmentType: string;

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The timestamp when the Connect attachment was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ID of the Connect attachment owner.
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The resource ARN for the Connect attachment.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name of the Connect attachment's segment.
   *
   * @cloudformationAttribute SegmentName
   */
  public readonly attrSegmentName: string;

  /**
   * The state of the Connect attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The timestamp when the Connect attachment was last updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The ID of the core network where the Connect attachment is located.
   */
  public coreNetworkId: string;

  /**
   * The Region where the edge is located.
   */
  public edgeLocation: string;

  /**
   * Options for connecting an attachment.
   */
  public options: CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable;

  /**
   * Describes a proposed segment change.
   */
  public proposedSegmentChange?: cdk.IResolvable | CfnConnectAttachment.ProposedSegmentChangeProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the attachment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ID of the transport attachment.
   */
  public transportAttachmentId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectAttachmentProps) {
    super(scope, id, {
      "type": CfnConnectAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "coreNetworkId", this);
    cdk.requireProperty(props, "edgeLocation", this);
    cdk.requireProperty(props, "options", this);
    cdk.requireProperty(props, "transportAttachmentId", this);

    this.attrAttachmentId = cdk.Token.asString(this.getAtt("AttachmentId", cdk.ResolutionTypeHint.STRING));
    this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt("AttachmentPolicyRuleNumber", cdk.ResolutionTypeHint.NUMBER));
    this.attrAttachmentType = cdk.Token.asString(this.getAtt("AttachmentType", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSegmentName = cdk.Token.asString(this.getAtt("SegmentName", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.coreNetworkId = props.coreNetworkId;
    this.edgeLocation = props.edgeLocation;
    this.options = props.options;
    this.proposedSegmentChange = props.proposedSegmentChange;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::ConnectAttachment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.transportAttachmentId = props.transportAttachmentId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "coreNetworkId": this.coreNetworkId,
      "edgeLocation": this.edgeLocation,
      "options": this.options,
      "proposedSegmentChange": this.proposedSegmentChange,
      "tags": this.tags.renderTags(),
      "transportAttachmentId": this.transportAttachmentId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnConnectAttachment {
  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html
   */
  export interface ProposedSegmentChangeProperty {
    /**
     * The rule number in the policy document that applies to this change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-attachmentpolicyrulenumber
     */
    readonly attachmentPolicyRuleNumber?: number;

    /**
     * The name of the segment to change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-segmentname
     */
    readonly segmentName?: string;

    /**
     * The list of key-value tags that changed for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html#cfn-networkmanager-connectattachment-proposedsegmentchange-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }

  /**
   * Describes a core network Connect attachment options.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html
   */
  export interface ConnectAttachmentOptionsProperty {
    /**
     * The protocol used for the attachment connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html#cfn-networkmanager-connectattachment-connectattachmentoptions-protocol
     */
    readonly protocol?: string;
  }
}

/**
 * Properties for defining a `CfnConnectAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html
 */
export interface CfnConnectAttachmentProps {
  /**
   * The ID of the core network where the Connect attachment is located.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-corenetworkid
   */
  readonly coreNetworkId: string;

  /**
   * The Region where the edge is located.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-edgelocation
   */
  readonly edgeLocation: string;

  /**
   * Options for connecting an attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-options
   */
  readonly options: CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable;

  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-proposedsegmentchange
   */
  readonly proposedSegmentChange?: cdk.IResolvable | CfnConnectAttachment.ProposedSegmentChangeProperty;

  /**
   * Tags for the attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ID of the transport attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-transportattachmentid
   */
  readonly transportAttachmentId: string;
}

/**
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectAttachmentProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentPolicyRuleNumber", cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
  errors.collect(cdk.propertyValidator("segmentName", cdk.validateString)(properties.segmentName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"ProposedSegmentChangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectAttachmentProposedSegmentChangePropertyValidator(properties).assertSuccess();
  return {
    "AttachmentPolicyRuleNumber": cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
    "SegmentName": cdk.stringToCloudFormation(properties.segmentName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConnectAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectAttachment.ProposedSegmentChangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachment.ProposedSegmentChangeProperty>();
  ret.addPropertyResult("attachmentPolicyRuleNumber", "AttachmentPolicyRuleNumber", (properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined));
  ret.addPropertyResult("segmentName", "SegmentName", (properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectAttachmentOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectAttachmentOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectAttachmentConnectAttachmentOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"ConnectAttachmentOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectAttachmentConnectAttachmentOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectAttachmentConnectAttachmentOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnConnectAttachmentConnectAttachmentOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachment.ConnectAttachmentOptionsProperty>();
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.requiredValidator)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.validateString)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("edgeLocation", cdk.requiredValidator)(properties.edgeLocation));
  errors.collect(cdk.propertyValidator("edgeLocation", cdk.validateString)(properties.edgeLocation));
  errors.collect(cdk.propertyValidator("options", cdk.requiredValidator)(properties.options));
  errors.collect(cdk.propertyValidator("options", CfnConnectAttachmentConnectAttachmentOptionsPropertyValidator)(properties.options));
  errors.collect(cdk.propertyValidator("proposedSegmentChange", CfnConnectAttachmentProposedSegmentChangePropertyValidator)(properties.proposedSegmentChange));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("transportAttachmentId", cdk.requiredValidator)(properties.transportAttachmentId));
  errors.collect(cdk.propertyValidator("transportAttachmentId", cdk.validateString)(properties.transportAttachmentId));
  return errors.wrap("supplied properties not correct for \"CfnConnectAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectAttachmentPropsValidator(properties).assertSuccess();
  return {
    "CoreNetworkId": cdk.stringToCloudFormation(properties.coreNetworkId),
    "EdgeLocation": cdk.stringToCloudFormation(properties.edgeLocation),
    "Options": convertCfnConnectAttachmentConnectAttachmentOptionsPropertyToCloudFormation(properties.options),
    "ProposedSegmentChange": convertCfnConnectAttachmentProposedSegmentChangePropertyToCloudFormation(properties.proposedSegmentChange),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TransportAttachmentId": cdk.stringToCloudFormation(properties.transportAttachmentId)
  };
}

// @ts-ignore TS6133
function CfnConnectAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachmentProps>();
  ret.addPropertyResult("coreNetworkId", "CoreNetworkId", (properties.CoreNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId) : undefined));
  ret.addPropertyResult("edgeLocation", "EdgeLocation", (properties.EdgeLocation != null ? cfn_parse.FromCloudFormation.getString(properties.EdgeLocation) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? CfnConnectAttachmentConnectAttachmentOptionsPropertyFromCloudFormation(properties.Options) : undefined));
  ret.addPropertyResult("proposedSegmentChange", "ProposedSegmentChange", (properties.ProposedSegmentChange != null ? CfnConnectAttachmentProposedSegmentChangePropertyFromCloudFormation(properties.ProposedSegmentChange) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("transportAttachmentId", "TransportAttachmentId", (properties.TransportAttachmentId != null ? cfn_parse.FromCloudFormation.getString(properties.TransportAttachmentId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance.
 *
 * The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
 *
 * @cloudformationResource AWS::NetworkManager::ConnectPeer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html
 */
export class CfnConnectPeer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::ConnectPeer";

  /**
   * Build a CfnConnectPeer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectPeer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectPeerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectPeer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Configuration
   */
  public readonly attrConfiguration: cdk.IResolvable;

  /**
   * @cloudformationAttribute Configuration.BgpConfigurations
   */
  public readonly attrConfigurationBgpConfigurations: cdk.IResolvable;

  /**
   * @cloudformationAttribute Configuration.CoreNetworkAddress
   */
  public readonly attrConfigurationCoreNetworkAddress: string;

  /**
   * @cloudformationAttribute Configuration.InsideCidrBlocks
   */
  public readonly attrConfigurationInsideCidrBlocks: Array<string>;

  /**
   * @cloudformationAttribute Configuration.PeerAddress
   */
  public readonly attrConfigurationPeerAddress: string;

  /**
   * @cloudformationAttribute Configuration.Protocol
   */
  public readonly attrConfigurationProtocol: string;

  /**
   * The ID of the Connect peer.
   *
   * @cloudformationAttribute ConnectPeerId
   */
  public readonly attrConnectPeerId: string;

  /**
   * The core network ID.
   *
   * @cloudformationAttribute CoreNetworkId
   */
  public readonly attrCoreNetworkId: string;

  /**
   * The timestamp when the Connect peer was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The Connect peer Regions where edges are located.
   *
   * @cloudformationAttribute EdgeLocation
   */
  public readonly attrEdgeLocation: string;

  /**
   * The state of the Connect peer. This will be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * Describes the BGP options.
   */
  public bgpOptions?: CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable;

  /**
   * The ID of the attachment to connect.
   */
  public connectAttachmentId: string;

  /**
   * The IP address of a core network.
   */
  public coreNetworkAddress?: string;

  /**
   * The inside IP addresses used for a Connect peer configuration.
   */
  public insideCidrBlocks?: Array<string>;

  /**
   * The IP address of the Connect peer.
   */
  public peerAddress: string;

  /**
   * The subnet ARN of the Connect peer.
   */
  public subnetArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value tags associated with the Connect peer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectPeerProps) {
    super(scope, id, {
      "type": CfnConnectPeer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectAttachmentId", this);
    cdk.requireProperty(props, "peerAddress", this);

    this.attrConfiguration = this.getAtt("Configuration");
    this.attrConfigurationBgpConfigurations = this.getAtt("Configuration.BgpConfigurations");
    this.attrConfigurationCoreNetworkAddress = cdk.Token.asString(this.getAtt("Configuration.CoreNetworkAddress", cdk.ResolutionTypeHint.STRING));
    this.attrConfigurationInsideCidrBlocks = cdk.Token.asList(this.getAtt("Configuration.InsideCidrBlocks", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrConfigurationPeerAddress = cdk.Token.asString(this.getAtt("Configuration.PeerAddress", cdk.ResolutionTypeHint.STRING));
    this.attrConfigurationProtocol = cdk.Token.asString(this.getAtt("Configuration.Protocol", cdk.ResolutionTypeHint.STRING));
    this.attrConnectPeerId = cdk.Token.asString(this.getAtt("ConnectPeerId", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkId = cdk.Token.asString(this.getAtt("CoreNetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdgeLocation = cdk.Token.asString(this.getAtt("EdgeLocation", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.bgpOptions = props.bgpOptions;
    this.connectAttachmentId = props.connectAttachmentId;
    this.coreNetworkAddress = props.coreNetworkAddress;
    this.insideCidrBlocks = props.insideCidrBlocks;
    this.peerAddress = props.peerAddress;
    this.subnetArn = props.subnetArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::ConnectPeer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bgpOptions": this.bgpOptions,
      "connectAttachmentId": this.connectAttachmentId,
      "coreNetworkAddress": this.coreNetworkAddress,
      "insideCidrBlocks": this.insideCidrBlocks,
      "peerAddress": this.peerAddress,
      "subnetArn": this.subnetArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectPeer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectPeerPropsToCloudFormation(props);
  }
}

export namespace CfnConnectPeer {
  /**
   * Describes the BGP options.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html
   */
  export interface BgpOptionsProperty {
    /**
     * The Peer ASN of the BGP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html#cfn-networkmanager-connectpeer-bgpoptions-peerasn
     */
    readonly peerAsn?: number;
  }

  /**
   * Describes a core network BGP configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html
   */
  export interface ConnectPeerBgpConfigurationProperty {
    /**
     * The address of a core network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-corenetworkaddress
     */
    readonly coreNetworkAddress?: string;

    /**
     * The ASN of the Coret Network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-corenetworkasn
     */
    readonly coreNetworkAsn?: number;

    /**
     * The address of a core network Connect peer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-peeraddress
     */
    readonly peerAddress?: string;

    /**
     * The ASN of the Connect peer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html#cfn-networkmanager-connectpeer-connectpeerbgpconfiguration-peerasn
     */
    readonly peerAsn?: number;
  }

  /**
   * Describes a core network Connect peer configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html
   */
  export interface ConnectPeerConfigurationProperty {
    /**
     * The Connect peer BGP configurations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-bgpconfigurations
     */
    readonly bgpConfigurations?: Array<CfnConnectPeer.ConnectPeerBgpConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The IP address of a core network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-corenetworkaddress
     */
    readonly coreNetworkAddress?: string;

    /**
     * The inside IP addresses used for a Connect peer configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-insidecidrblocks
     */
    readonly insideCidrBlocks?: Array<string>;

    /**
     * The IP address of the Connect peer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-peeraddress
     */
    readonly peerAddress?: string;

    /**
     * The protocol used for a Connect peer configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html#cfn-networkmanager-connectpeer-connectpeerconfiguration-protocol
     */
    readonly protocol?: string;
  }
}

/**
 * Properties for defining a `CfnConnectPeer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html
 */
export interface CfnConnectPeerProps {
  /**
   * Describes the BGP options.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-bgpoptions
   */
  readonly bgpOptions?: CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable;

  /**
   * The ID of the attachment to connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-connectattachmentid
   */
  readonly connectAttachmentId: string;

  /**
   * The IP address of a core network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-corenetworkaddress
   */
  readonly coreNetworkAddress?: string;

  /**
   * The inside IP addresses used for a Connect peer configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-insidecidrblocks
   */
  readonly insideCidrBlocks?: Array<string>;

  /**
   * The IP address of the Connect peer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-peeraddress
   */
  readonly peerAddress: string;

  /**
   * The subnet ARN of the Connect peer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-subnetarn
   */
  readonly subnetArn?: string;

  /**
   * The list of key-value tags associated with the Connect peer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `BgpOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `BgpOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectPeerBgpOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("peerAsn", cdk.validateNumber)(properties.peerAsn));
  return errors.wrap("supplied properties not correct for \"BgpOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectPeerBgpOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectPeerBgpOptionsPropertyValidator(properties).assertSuccess();
  return {
    "PeerAsn": cdk.numberToCloudFormation(properties.peerAsn)
  };
}

// @ts-ignore TS6133
function CfnConnectPeerBgpOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.BgpOptionsProperty>();
  ret.addPropertyResult("peerAsn", "PeerAsn", (properties.PeerAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.PeerAsn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectPeerBgpConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectPeerBgpConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectPeerConnectPeerBgpConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreNetworkAddress", cdk.validateString)(properties.coreNetworkAddress));
  errors.collect(cdk.propertyValidator("coreNetworkAsn", cdk.validateNumber)(properties.coreNetworkAsn));
  errors.collect(cdk.propertyValidator("peerAddress", cdk.validateString)(properties.peerAddress));
  errors.collect(cdk.propertyValidator("peerAsn", cdk.validateNumber)(properties.peerAsn));
  return errors.wrap("supplied properties not correct for \"ConnectPeerBgpConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectPeerConnectPeerBgpConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectPeerConnectPeerBgpConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CoreNetworkAddress": cdk.stringToCloudFormation(properties.coreNetworkAddress),
    "CoreNetworkAsn": cdk.numberToCloudFormation(properties.coreNetworkAsn),
    "PeerAddress": cdk.stringToCloudFormation(properties.peerAddress),
    "PeerAsn": cdk.numberToCloudFormation(properties.peerAsn)
  };
}

// @ts-ignore TS6133
function CfnConnectPeerConnectPeerBgpConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.ConnectPeerBgpConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.ConnectPeerBgpConfigurationProperty>();
  ret.addPropertyResult("coreNetworkAddress", "CoreNetworkAddress", (properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined));
  ret.addPropertyResult("coreNetworkAsn", "CoreNetworkAsn", (properties.CoreNetworkAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoreNetworkAsn) : undefined));
  ret.addPropertyResult("peerAddress", "PeerAddress", (properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined));
  ret.addPropertyResult("peerAsn", "PeerAsn", (properties.PeerAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.PeerAsn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectPeerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectPeerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectPeerConnectPeerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bgpConfigurations", cdk.listValidator(CfnConnectPeerConnectPeerBgpConfigurationPropertyValidator))(properties.bgpConfigurations));
  errors.collect(cdk.propertyValidator("coreNetworkAddress", cdk.validateString)(properties.coreNetworkAddress));
  errors.collect(cdk.propertyValidator("insideCidrBlocks", cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
  errors.collect(cdk.propertyValidator("peerAddress", cdk.validateString)(properties.peerAddress));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"ConnectPeerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectPeerConnectPeerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectPeerConnectPeerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BgpConfigurations": cdk.listMapper(convertCfnConnectPeerConnectPeerBgpConfigurationPropertyToCloudFormation)(properties.bgpConfigurations),
    "CoreNetworkAddress": cdk.stringToCloudFormation(properties.coreNetworkAddress),
    "InsideCidrBlocks": cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks),
    "PeerAddress": cdk.stringToCloudFormation(properties.peerAddress),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnConnectPeerConnectPeerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.ConnectPeerConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.ConnectPeerConfigurationProperty>();
  ret.addPropertyResult("bgpConfigurations", "BgpConfigurations", (properties.BgpConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectPeerConnectPeerBgpConfigurationPropertyFromCloudFormation)(properties.BgpConfigurations) : undefined));
  ret.addPropertyResult("coreNetworkAddress", "CoreNetworkAddress", (properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined));
  ret.addPropertyResult("insideCidrBlocks", "InsideCidrBlocks", (properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InsideCidrBlocks) : undefined));
  ret.addPropertyResult("peerAddress", "PeerAddress", (properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectPeerProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectPeerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectPeerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bgpOptions", CfnConnectPeerBgpOptionsPropertyValidator)(properties.bgpOptions));
  errors.collect(cdk.propertyValidator("connectAttachmentId", cdk.requiredValidator)(properties.connectAttachmentId));
  errors.collect(cdk.propertyValidator("connectAttachmentId", cdk.validateString)(properties.connectAttachmentId));
  errors.collect(cdk.propertyValidator("coreNetworkAddress", cdk.validateString)(properties.coreNetworkAddress));
  errors.collect(cdk.propertyValidator("insideCidrBlocks", cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
  errors.collect(cdk.propertyValidator("peerAddress", cdk.requiredValidator)(properties.peerAddress));
  errors.collect(cdk.propertyValidator("peerAddress", cdk.validateString)(properties.peerAddress));
  errors.collect(cdk.propertyValidator("subnetArn", cdk.validateString)(properties.subnetArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnConnectPeerProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectPeerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectPeerPropsValidator(properties).assertSuccess();
  return {
    "BgpOptions": convertCfnConnectPeerBgpOptionsPropertyToCloudFormation(properties.bgpOptions),
    "ConnectAttachmentId": cdk.stringToCloudFormation(properties.connectAttachmentId),
    "CoreNetworkAddress": cdk.stringToCloudFormation(properties.coreNetworkAddress),
    "InsideCidrBlocks": cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks),
    "PeerAddress": cdk.stringToCloudFormation(properties.peerAddress),
    "SubnetArn": cdk.stringToCloudFormation(properties.subnetArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnConnectPeerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeerProps>();
  ret.addPropertyResult("bgpOptions", "BgpOptions", (properties.BgpOptions != null ? CfnConnectPeerBgpOptionsPropertyFromCloudFormation(properties.BgpOptions) : undefined));
  ret.addPropertyResult("connectAttachmentId", "ConnectAttachmentId", (properties.ConnectAttachmentId != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectAttachmentId) : undefined));
  ret.addPropertyResult("coreNetworkAddress", "CoreNetworkAddress", (properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined));
  ret.addPropertyResult("insideCidrBlocks", "InsideCidrBlocks", (properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InsideCidrBlocks) : undefined));
  ret.addPropertyResult("peerAddress", "PeerAddress", (properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined));
  ret.addPropertyResult("subnetArn", "SubnetArn", (properties.SubnetArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Describes a core network.
 *
 * @cloudformationResource AWS::NetworkManager::CoreNetwork
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html
 */
export class CfnCoreNetwork extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::CoreNetwork";

  /**
   * Build a CfnCoreNetwork from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCoreNetwork {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCoreNetworkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCoreNetwork(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The ID of the core network.
   *
   * @cloudformationAttribute CoreNetworkId
   */
  public readonly attrCoreNetworkId: string;

  /**
   * The timestamp when the core network was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The edges.
   *
   * @cloudformationAttribute Edges
   */
  public readonly attrEdges: cdk.IResolvable;

  /**
   * Owner of the core network
   *
   * @cloudformationAttribute OwnerAccount
   */
  public readonly attrOwnerAccount: string;

  /**
   * The segments.
   *
   * @cloudformationAttribute Segments
   */
  public readonly attrSegments: cdk.IResolvable;

  /**
   * The current state of the core network. These states are: `CREATING` | `UPDATING` | `AVAILABLE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The description of a core network.
   */
  public description?: string;

  /**
   * The ID of the global network that your core network is a part of.
   */
  public globalNetworkId: string;

  /**
   * Describes a core network policy. For more information, see [Core network policies](https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-policy-change-sets.html) .
   */
  public policyDocument?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value tags associated with a core network.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCoreNetworkProps) {
    super(scope, id, {
      "type": CfnCoreNetwork.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "globalNetworkId", this);

    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkId = cdk.Token.asString(this.getAtt("CoreNetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdges = this.getAtt("Edges");
    this.attrOwnerAccount = cdk.Token.asString(this.getAtt("OwnerAccount", cdk.ResolutionTypeHint.STRING));
    this.attrSegments = this.getAtt("Segments");
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.globalNetworkId = props.globalNetworkId;
    this.policyDocument = props.policyDocument;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::CoreNetwork", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "globalNetworkId": this.globalNetworkId,
      "policyDocument": this.policyDocument,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCoreNetwork.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCoreNetworkPropsToCloudFormation(props);
  }
}

export namespace CfnCoreNetwork {
  /**
   * Describes a core network segment, which are dedicated routes.
   *
   * Only attachments within this segment can communicate with each other.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html
   */
  export interface CoreNetworkSegmentProperty {
    /**
     * The Regions where the edges are located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-edgelocations
     */
    readonly edgeLocations?: Array<string>;

    /**
     * The name of a core network segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-name
     */
    readonly name?: string;

    /**
     * The shared segments of a core network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html#cfn-networkmanager-corenetwork-corenetworksegment-sharedsegments
     */
    readonly sharedSegments?: Array<string>;
  }

  /**
   * Describes a core network edge.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html
   */
  export interface CoreNetworkEdgeProperty {
    /**
     * The ASN of a core network edge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-asn
     */
    readonly asn?: number;

    /**
     * The Region where a core network edge is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-edgelocation
     */
    readonly edgeLocation?: string;

    /**
     * The inside IP addresses used for core network edges.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html#cfn-networkmanager-corenetwork-corenetworkedge-insidecidrblocks
     */
    readonly insideCidrBlocks?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnCoreNetwork`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html
 */
export interface CfnCoreNetworkProps {
  /**
   * The description of a core network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-description
   */
  readonly description?: string;

  /**
   * The ID of the global network that your core network is a part of.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * Describes a core network policy. For more information, see [Core network policies](https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-policy-change-sets.html) .
   *
   * If you update the policy document, CloudFormation will apply the core network change set generated from the updated policy document, and then set it as the LIVE policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-policydocument
   */
  readonly policyDocument?: any | cdk.IResolvable;

  /**
   * The list of key-value tags associated with a core network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CoreNetworkSegmentProperty`
 *
 * @param properties - the TypeScript properties of a `CoreNetworkSegmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkSegmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("edgeLocations", cdk.listValidator(cdk.validateString))(properties.edgeLocations));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sharedSegments", cdk.listValidator(cdk.validateString))(properties.sharedSegments));
  return errors.wrap("supplied properties not correct for \"CoreNetworkSegmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnCoreNetworkCoreNetworkSegmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreNetworkCoreNetworkSegmentPropertyValidator(properties).assertSuccess();
  return {
    "EdgeLocations": cdk.listMapper(cdk.stringToCloudFormation)(properties.edgeLocations),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SharedSegments": cdk.listMapper(cdk.stringToCloudFormation)(properties.sharedSegments)
  };
}

// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkSegmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetwork.CoreNetworkSegmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetwork.CoreNetworkSegmentProperty>();
  ret.addPropertyResult("edgeLocations", "EdgeLocations", (properties.EdgeLocations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EdgeLocations) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sharedSegments", "SharedSegments", (properties.SharedSegments != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SharedSegments) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CoreNetworkEdgeProperty`
 *
 * @param properties - the TypeScript properties of a `CoreNetworkEdgeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkEdgePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("asn", cdk.validateNumber)(properties.asn));
  errors.collect(cdk.propertyValidator("edgeLocation", cdk.validateString)(properties.edgeLocation));
  errors.collect(cdk.propertyValidator("insideCidrBlocks", cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
  return errors.wrap("supplied properties not correct for \"CoreNetworkEdgeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCoreNetworkCoreNetworkEdgePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreNetworkCoreNetworkEdgePropertyValidator(properties).assertSuccess();
  return {
    "Asn": cdk.numberToCloudFormation(properties.asn),
    "EdgeLocation": cdk.stringToCloudFormation(properties.edgeLocation),
    "InsideCidrBlocks": cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks)
  };
}

// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkEdgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetwork.CoreNetworkEdgeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetwork.CoreNetworkEdgeProperty>();
  ret.addPropertyResult("asn", "Asn", (properties.Asn != null ? cfn_parse.FromCloudFormation.getNumber(properties.Asn) : undefined));
  ret.addPropertyResult("edgeLocation", "EdgeLocation", (properties.EdgeLocation != null ? cfn_parse.FromCloudFormation.getString(properties.EdgeLocation) : undefined));
  ret.addPropertyResult("insideCidrBlocks", "InsideCidrBlocks", (properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InsideCidrBlocks) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCoreNetworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnCoreNetworkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCoreNetworkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCoreNetworkProps\"");
}

// @ts-ignore TS6133
function convertCfnCoreNetworkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCoreNetworkPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCoreNetworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetworkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetworkProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an association between a customer gateway, a device, and optionally, a link.
 *
 * If you specify a link, it must be associated with the specified device. The customer gateway must be connected to a VPN attachment on a transit gateway that's registered in your global network.
 *
 * You cannot associate a customer gateway with more than one device and link.
 *
 * @cloudformationResource AWS::NetworkManager::CustomerGatewayAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html
 */
export class CfnCustomerGatewayAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::CustomerGatewayAssociation";

  /**
   * Build a CfnCustomerGatewayAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomerGatewayAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomerGatewayAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomerGatewayAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the customer gateway.
   */
  public customerGatewayArn: string;

  /**
   * The ID of the device.
   */
  public deviceId: string;

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The ID of the link.
   */
  public linkId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomerGatewayAssociationProps) {
    super(scope, id, {
      "type": CfnCustomerGatewayAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "customerGatewayArn", this);
    cdk.requireProperty(props, "deviceId", this);
    cdk.requireProperty(props, "globalNetworkId", this);

    this.customerGatewayArn = props.customerGatewayArn;
    this.deviceId = props.deviceId;
    this.globalNetworkId = props.globalNetworkId;
    this.linkId = props.linkId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customerGatewayArn": this.customerGatewayArn,
      "deviceId": this.deviceId,
      "globalNetworkId": this.globalNetworkId,
      "linkId": this.linkId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomerGatewayAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomerGatewayAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomerGatewayAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html
 */
export interface CfnCustomerGatewayAssociationProps {
  /**
   * The Amazon Resource Name (ARN) of the customer gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-customergatewayarn
   */
  readonly customerGatewayArn: string;

  /**
   * The ID of the device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-deviceid
   */
  readonly deviceId: string;

  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The ID of the link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-linkid
   */
  readonly linkId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCustomerGatewayAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomerGatewayAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomerGatewayAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerGatewayArn", cdk.requiredValidator)(properties.customerGatewayArn));
  errors.collect(cdk.propertyValidator("customerGatewayArn", cdk.validateString)(properties.customerGatewayArn));
  errors.collect(cdk.propertyValidator("deviceId", cdk.requiredValidator)(properties.deviceId));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("linkId", cdk.validateString)(properties.linkId));
  return errors.wrap("supplied properties not correct for \"CfnCustomerGatewayAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomerGatewayAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomerGatewayAssociationPropsValidator(properties).assertSuccess();
  return {
    "CustomerGatewayArn": cdk.stringToCloudFormation(properties.customerGatewayArn),
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "LinkId": cdk.stringToCloudFormation(properties.linkId)
  };
}

// @ts-ignore TS6133
function CfnCustomerGatewayAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomerGatewayAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomerGatewayAssociationProps>();
  ret.addPropertyResult("customerGatewayArn", "CustomerGatewayArn", (properties.CustomerGatewayArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomerGatewayArn) : undefined));
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("linkId", "LinkId", (properties.LinkId != null ? cfn_parse.FromCloudFormation.getString(properties.LinkId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a device.
 *
 * @cloudformationResource AWS::NetworkManager::Device
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html
 */
export class CfnDevice extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::Device";

  /**
   * Build a CfnDevice from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevice {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDevicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDevice(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time that the device was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ARN of the device. For example, `arn:aws:networkmanager::123456789012:device/global-network-01231231231231231/device-07f6fd08867abc123` .
   *
   * @cloudformationAttribute DeviceArn
   */
  public readonly attrDeviceArn: string;

  /**
   * The ID of the device. For example, `device-07f6fd08867abc123` .
   *
   * @cloudformationAttribute DeviceId
   */
  public readonly attrDeviceId: string;

  /**
   * The state of the device.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The AWS location of the device.
   */
  public awsLocation?: CfnDevice.AWSLocationProperty | cdk.IResolvable;

  /**
   * A description of the device.
   */
  public description?: string;

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The site location.
   */
  public location?: cdk.IResolvable | CfnDevice.LocationProperty;

  /**
   * The model of the device.
   */
  public model?: string;

  /**
   * The serial number of the device.
   */
  public serialNumber?: string;

  /**
   * The site ID.
   */
  public siteId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the device.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The device type.
   */
  public type?: string;

  /**
   * The vendor of the device.
   */
  public vendor?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeviceProps) {
    super(scope, id, {
      "type": CfnDevice.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "globalNetworkId", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDeviceArn = cdk.Token.asString(this.getAtt("DeviceArn", cdk.ResolutionTypeHint.STRING));
    this.attrDeviceId = cdk.Token.asString(this.getAtt("DeviceId", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.awsLocation = props.awsLocation;
    this.description = props.description;
    this.globalNetworkId = props.globalNetworkId;
    this.location = props.location;
    this.model = props.model;
    this.serialNumber = props.serialNumber;
    this.siteId = props.siteId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Device", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
    this.vendor = props.vendor;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "awsLocation": this.awsLocation,
      "description": this.description,
      "globalNetworkId": this.globalNetworkId,
      "location": this.location,
      "model": this.model,
      "serialNumber": this.serialNumber,
      "siteId": this.siteId,
      "tags": this.tags.renderTags(),
      "type": this.type,
      "vendor": this.vendor
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevice.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDevicePropsToCloudFormation(props);
  }
}

export namespace CfnDevice {
  /**
   * Specifies a location in AWS .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-awslocation.html
   */
  export interface AWSLocationProperty {
    /**
     * The Amazon Resource Name (ARN) of the subnet that the device is located in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-awslocation.html#cfn-networkmanager-device-awslocation-subnetarn
     */
    readonly subnetArn?: string;

    /**
     * The Zone that the device is located in.
     *
     * Specify the ID of an Availability Zone, Local Zone, Wavelength Zone, or an Outpost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-awslocation.html#cfn-networkmanager-device-awslocation-zone
     */
    readonly zone?: string;
  }

  /**
   * Describes a location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html
   */
  export interface LocationProperty {
    /**
     * The physical address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-address
     */
    readonly address?: string;

    /**
     * The latitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-latitude
     */
    readonly latitude?: string;

    /**
     * The longitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html#cfn-networkmanager-device-location-longitude
     */
    readonly longitude?: string;
  }
}

/**
 * Properties for defining a `CfnDevice`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html
 */
export interface CfnDeviceProps {
  /**
   * The AWS location of the device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-awslocation
   */
  readonly awsLocation?: CfnDevice.AWSLocationProperty | cdk.IResolvable;

  /**
   * A description of the device.
   *
   * Constraints: Maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-description
   */
  readonly description?: string;

  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The site location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-location
   */
  readonly location?: cdk.IResolvable | CfnDevice.LocationProperty;

  /**
   * The model of the device.
   *
   * Constraints: Maximum length of 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-model
   */
  readonly model?: string;

  /**
   * The serial number of the device.
   *
   * Constraints: Maximum length of 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-serialnumber
   */
  readonly serialNumber?: string;

  /**
   * The site ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-siteid
   */
  readonly siteId?: string;

  /**
   * The tags for the device.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The device type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-type
   */
  readonly type?: string;

  /**
   * The vendor of the device.
   *
   * Constraints: Maximum length of 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-vendor
   */
  readonly vendor?: string;
}

/**
 * Determine whether the given properties match those of a `AWSLocationProperty`
 *
 * @param properties - the TypeScript properties of a `AWSLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceAWSLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subnetArn", cdk.validateString)(properties.subnetArn));
  errors.collect(cdk.propertyValidator("zone", cdk.validateString)(properties.zone));
  return errors.wrap("supplied properties not correct for \"AWSLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceAWSLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceAWSLocationPropertyValidator(properties).assertSuccess();
  return {
    "SubnetArn": cdk.stringToCloudFormation(properties.subnetArn),
    "Zone": cdk.stringToCloudFormation(properties.zone)
  };
}

// @ts-ignore TS6133
function CfnDeviceAWSLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDevice.AWSLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevice.AWSLocationProperty>();
  ret.addPropertyResult("subnetArn", "SubnetArn", (properties.SubnetArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetArn) : undefined));
  ret.addPropertyResult("zone", "Zone", (properties.Zone != null ? cfn_parse.FromCloudFormation.getString(properties.Zone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeviceLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("latitude", cdk.validateString)(properties.latitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.validateString)(properties.longitude));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeviceLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeviceLocationPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Latitude": cdk.stringToCloudFormation(properties.latitude),
    "Longitude": cdk.stringToCloudFormation(properties.longitude)
  };
}

// @ts-ignore TS6133
function CfnDeviceLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDevice.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevice.LocationProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("latitude", "Latitude", (properties.Latitude != null ? cfn_parse.FromCloudFormation.getString(properties.Latitude) : undefined));
  ret.addPropertyResult("longitude", "Longitude", (properties.Longitude != null ? cfn_parse.FromCloudFormation.getString(properties.Longitude) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDevicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsLocation", CfnDeviceAWSLocationPropertyValidator)(properties.awsLocation));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("location", CfnDeviceLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("serialNumber", cdk.validateString)(properties.serialNumber));
  errors.collect(cdk.propertyValidator("siteId", cdk.validateString)(properties.siteId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("vendor", cdk.validateString)(properties.vendor));
  return errors.wrap("supplied properties not correct for \"CfnDeviceProps\"");
}

// @ts-ignore TS6133
function convertCfnDevicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDevicePropsValidator(properties).assertSuccess();
  return {
    "AWSLocation": convertCfnDeviceAWSLocationPropertyToCloudFormation(properties.awsLocation),
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "Location": convertCfnDeviceLocationPropertyToCloudFormation(properties.location),
    "Model": cdk.stringToCloudFormation(properties.model),
    "SerialNumber": cdk.stringToCloudFormation(properties.serialNumber),
    "SiteId": cdk.stringToCloudFormation(properties.siteId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Vendor": cdk.stringToCloudFormation(properties.vendor)
  };
}

// @ts-ignore TS6133
function CfnDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProps>();
  ret.addPropertyResult("awsLocation", "AWSLocation", (properties.AWSLocation != null ? CfnDeviceAWSLocationPropertyFromCloudFormation(properties.AWSLocation) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnDeviceLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("serialNumber", "SerialNumber", (properties.SerialNumber != null ? cfn_parse.FromCloudFormation.getString(properties.SerialNumber) : undefined));
  ret.addPropertyResult("siteId", "SiteId", (properties.SiteId != null ? cfn_parse.FromCloudFormation.getString(properties.SiteId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("vendor", "Vendor", (properties.Vendor != null ? cfn_parse.FromCloudFormation.getString(properties.Vendor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new, empty global network.
 *
 * @cloudformationResource AWS::NetworkManager::GlobalNetwork
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html
 */
export class CfnGlobalNetwork extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::GlobalNetwork";

  /**
   * Build a CfnGlobalNetwork from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGlobalNetwork {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGlobalNetworkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGlobalNetwork(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the global network. For example, `arn:aws:networkmanager::123456789012:global-network/global-network-01231231231231231` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the global network. For example, `global-network-01231231231231231` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The date and time that the global network was created.
   */
  public createdAt?: string;

  /**
   * A description of the global network.
   */
  public description?: string;

  /**
   * The state of the global network.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the global network.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGlobalNetworkProps = {}) {
    super(scope, id, {
      "type": CfnGlobalNetwork.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.createdAt = props.createdAt;
    this.description = props.description;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::GlobalNetwork", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "createdAt": this.createdAt,
      "description": this.description,
      "state": this.state,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGlobalNetwork.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGlobalNetworkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGlobalNetwork`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html
 */
export interface CfnGlobalNetworkProps {
  /**
   * The date and time that the global network was created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-createdat
   */
  readonly createdAt?: string;

  /**
   * A description of the global network.
   *
   * Constraints: Maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-description
   */
  readonly description?: string;

  /**
   * The state of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-state
   */
  readonly state?: string;

  /**
   * The tags for the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnGlobalNetworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnGlobalNetworkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGlobalNetworkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createdAt", cdk.validateString)(properties.createdAt));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGlobalNetworkProps\"");
}

// @ts-ignore TS6133
function convertCfnGlobalNetworkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGlobalNetworkPropsValidator(properties).assertSuccess();
  return {
    "CreatedAt": cdk.stringToCloudFormation(properties.createdAt),
    "Description": cdk.stringToCloudFormation(properties.description),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGlobalNetworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalNetworkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalNetworkProps>();
  ret.addPropertyResult("createdAt", "CreatedAt", (properties.CreatedAt != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedAt) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a link for a site.
 *
 * @cloudformationResource AWS::NetworkManager::Link
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html
 */
export class CfnLink extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::Link";

  /**
   * Build a CfnLink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date and time that the link was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ARN of the link. For example, `arn:aws:networkmanager::123456789012:link/global-network-01231231231231231/link-11112222aaaabbbb1` .
   *
   * @cloudformationAttribute LinkArn
   */
  public readonly attrLinkArn: string;

  /**
   * The ID of the link. For example, `link-11112222aaaabbbb1` .
   *
   * @cloudformationAttribute LinkId
   */
  public readonly attrLinkId: string;

  /**
   * The state of the link.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The bandwidth for the link.
   */
  public bandwidth: CfnLink.BandwidthProperty | cdk.IResolvable;

  /**
   * A description of the link.
   */
  public description?: string;

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The provider of the link.
   */
  public provider?: string;

  /**
   * The ID of the site.
   */
  public siteId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the link.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of the link.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLinkProps) {
    super(scope, id, {
      "type": CfnLink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bandwidth", this);
    cdk.requireProperty(props, "globalNetworkId", this);
    cdk.requireProperty(props, "siteId", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLinkArn = cdk.Token.asString(this.getAtt("LinkArn", cdk.ResolutionTypeHint.STRING));
    this.attrLinkId = cdk.Token.asString(this.getAtt("LinkId", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.bandwidth = props.bandwidth;
    this.description = props.description;
    this.globalNetworkId = props.globalNetworkId;
    this.provider = props.provider;
    this.siteId = props.siteId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Link", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bandwidth": this.bandwidth,
      "description": this.description,
      "globalNetworkId": this.globalNetworkId,
      "provider": this.provider,
      "siteId": this.siteId,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLinkPropsToCloudFormation(props);
  }
}

export namespace CfnLink {
  /**
   * Describes bandwidth information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html
   */
  export interface BandwidthProperty {
    /**
     * Download speed in Mbps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html#cfn-networkmanager-link-bandwidth-downloadspeed
     */
    readonly downloadSpeed?: number;

    /**
     * Upload speed in Mbps.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html#cfn-networkmanager-link-bandwidth-uploadspeed
     */
    readonly uploadSpeed?: number;
  }
}

/**
 * Properties for defining a `CfnLink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html
 */
export interface CfnLinkProps {
  /**
   * The bandwidth for the link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-bandwidth
   */
  readonly bandwidth: CfnLink.BandwidthProperty | cdk.IResolvable;

  /**
   * A description of the link.
   *
   * Constraints: Maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-description
   */
  readonly description?: string;

  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The provider of the link.
   *
   * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-provider
   */
  readonly provider?: string;

  /**
   * The ID of the site.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-siteid
   */
  readonly siteId: string;

  /**
   * The tags for the link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of the link.
   *
   * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `BandwidthProperty`
 *
 * @param properties - the TypeScript properties of a `BandwidthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLinkBandwidthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("downloadSpeed", cdk.validateNumber)(properties.downloadSpeed));
  errors.collect(cdk.propertyValidator("uploadSpeed", cdk.validateNumber)(properties.uploadSpeed));
  return errors.wrap("supplied properties not correct for \"BandwidthProperty\"");
}

// @ts-ignore TS6133
function convertCfnLinkBandwidthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLinkBandwidthPropertyValidator(properties).assertSuccess();
  return {
    "DownloadSpeed": cdk.numberToCloudFormation(properties.downloadSpeed),
    "UploadSpeed": cdk.numberToCloudFormation(properties.uploadSpeed)
  };
}

// @ts-ignore TS6133
function CfnLinkBandwidthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLink.BandwidthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLink.BandwidthProperty>();
  ret.addPropertyResult("downloadSpeed", "DownloadSpeed", (properties.DownloadSpeed != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownloadSpeed) : undefined));
  ret.addPropertyResult("uploadSpeed", "UploadSpeed", (properties.UploadSpeed != null ? cfn_parse.FromCloudFormation.getNumber(properties.UploadSpeed) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnLinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bandwidth", cdk.requiredValidator)(properties.bandwidth));
  errors.collect(cdk.propertyValidator("bandwidth", CfnLinkBandwidthPropertyValidator)(properties.bandwidth));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("provider", cdk.validateString)(properties.provider));
  errors.collect(cdk.propertyValidator("siteId", cdk.requiredValidator)(properties.siteId));
  errors.collect(cdk.propertyValidator("siteId", cdk.validateString)(properties.siteId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnLinkProps\"");
}

// @ts-ignore TS6133
function convertCfnLinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLinkPropsValidator(properties).assertSuccess();
  return {
    "Bandwidth": convertCfnLinkBandwidthPropertyToCloudFormation(properties.bandwidth),
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "Provider": cdk.stringToCloudFormation(properties.provider),
    "SiteId": cdk.stringToCloudFormation(properties.siteId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLinkProps>();
  ret.addPropertyResult("bandwidth", "Bandwidth", (properties.Bandwidth != null ? CfnLinkBandwidthPropertyFromCloudFormation(properties.Bandwidth) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("provider", "Provider", (properties.Provider != null ? cfn_parse.FromCloudFormation.getString(properties.Provider) : undefined));
  ret.addPropertyResult("siteId", "SiteId", (properties.SiteId != null ? cfn_parse.FromCloudFormation.getString(properties.SiteId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Describes the association between a device and a link.
 *
 * @cloudformationResource AWS::NetworkManager::LinkAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html
 */
export class CfnLinkAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::LinkAssociation";

  /**
   * Build a CfnLinkAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLinkAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLinkAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLinkAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The device ID for the link association.
   */
  public deviceId: string;

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The ID of the link.
   */
  public linkId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLinkAssociationProps) {
    super(scope, id, {
      "type": CfnLinkAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "deviceId", this);
    cdk.requireProperty(props, "globalNetworkId", this);
    cdk.requireProperty(props, "linkId", this);

    this.deviceId = props.deviceId;
    this.globalNetworkId = props.globalNetworkId;
    this.linkId = props.linkId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deviceId": this.deviceId,
      "globalNetworkId": this.globalNetworkId,
      "linkId": this.linkId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLinkAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLinkAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLinkAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html
 */
export interface CfnLinkAssociationProps {
  /**
   * The device ID for the link association.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-deviceid
   */
  readonly deviceId: string;

  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The ID of the link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-linkid
   */
  readonly linkId: string;
}

/**
 * Determine whether the given properties match those of a `CfnLinkAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLinkAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLinkAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceId", cdk.requiredValidator)(properties.deviceId));
  errors.collect(cdk.propertyValidator("deviceId", cdk.validateString)(properties.deviceId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("linkId", cdk.requiredValidator)(properties.linkId));
  errors.collect(cdk.propertyValidator("linkId", cdk.validateString)(properties.linkId));
  return errors.wrap("supplied properties not correct for \"CfnLinkAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnLinkAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLinkAssociationPropsValidator(properties).assertSuccess();
  return {
    "DeviceId": cdk.stringToCloudFormation(properties.deviceId),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "LinkId": cdk.stringToCloudFormation(properties.linkId)
  };
}

// @ts-ignore TS6133
function CfnLinkAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLinkAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLinkAssociationProps>();
  ret.addPropertyResult("deviceId", "DeviceId", (properties.DeviceId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceId) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("linkId", "LinkId", (properties.LinkId != null ? cfn_parse.FromCloudFormation.getString(properties.LinkId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new site in a global network.
 *
 * @cloudformationResource AWS::NetworkManager::Site
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html
 */
export class CfnSite extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::Site";

  /**
   * Build a CfnSite from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSite {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSitePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSite(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time that the site was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ARN of the site. For example, `arn:aws:networkmanager::123456789012:site/global-network-01231231231231231/site-444555aaabbb11223` .
   *
   * @cloudformationAttribute SiteArn
   */
  public readonly attrSiteArn: string;

  /**
   * The ID of the site. For example, `site-444555aaabbb11223` .
   *
   * @cloudformationAttribute SiteId
   */
  public readonly attrSiteId: string;

  /**
   * The current state of the site.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * A description of your site.
   */
  public description?: string;

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The site location.
   */
  public location?: cdk.IResolvable | CfnSite.LocationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for the site.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSiteProps) {
    super(scope, id, {
      "type": CfnSite.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "globalNetworkId", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrSiteArn = cdk.Token.asString(this.getAtt("SiteArn", cdk.ResolutionTypeHint.STRING));
    this.attrSiteId = cdk.Token.asString(this.getAtt("SiteId", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.globalNetworkId = props.globalNetworkId;
    this.location = props.location;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Site", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "globalNetworkId": this.globalNetworkId,
      "location": this.location,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSite.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSitePropsToCloudFormation(props);
  }
}

export namespace CfnSite {
  /**
   * Describes a location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html
   */
  export interface LocationProperty {
    /**
     * The physical address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-address
     */
    readonly address?: string;

    /**
     * The latitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-latitude
     */
    readonly latitude?: string;

    /**
     * The longitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html#cfn-networkmanager-site-location-longitude
     */
    readonly longitude?: string;
  }
}

/**
 * Properties for defining a `CfnSite`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html
 */
export interface CfnSiteProps {
  /**
   * A description of your site.
   *
   * Constraints: Maximum length of 256 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-description
   */
  readonly description?: string;

  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The site location.
   *
   * This information is used for visualization in the Network Manager console. If you specify the address, the latitude and longitude are automatically calculated.
   *
   * - `Address` : The physical address of the site.
   * - `Latitude` : The latitude of the site.
   * - `Longitude` : The longitude of the site.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-location
   */
  readonly location?: cdk.IResolvable | CfnSite.LocationProperty;

  /**
   * The tags for the site.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSiteLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("latitude", cdk.validateString)(properties.latitude));
  errors.collect(cdk.propertyValidator("longitude", cdk.validateString)(properties.longitude));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSiteLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSiteLocationPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Latitude": cdk.stringToCloudFormation(properties.latitude),
    "Longitude": cdk.stringToCloudFormation(properties.longitude)
  };
}

// @ts-ignore TS6133
function CfnSiteLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSite.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSite.LocationProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("latitude", "Latitude", (properties.Latitude != null ? cfn_parse.FromCloudFormation.getString(properties.Latitude) : undefined));
  ret.addPropertyResult("longitude", "Longitude", (properties.Longitude != null ? cfn_parse.FromCloudFormation.getString(properties.Longitude) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSiteProps`
 *
 * @param properties - the TypeScript properties of a `CfnSiteProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSitePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("location", CfnSiteLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSiteProps\"");
}

// @ts-ignore TS6133
function convertCfnSitePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSitePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "Location": convertCfnSiteLocationPropertyToCloudFormation(properties.location),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSitePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSiteProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnSiteLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an Amazon Web Services site-to-site VPN attachment on an edge location of a core network.
 *
 * @cloudformationResource AWS::NetworkManager::SiteToSiteVpnAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html
 */
export class CfnSiteToSiteVpnAttachment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::SiteToSiteVpnAttachment";

  /**
   * Build a CfnSiteToSiteVpnAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSiteToSiteVpnAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSiteToSiteVpnAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSiteToSiteVpnAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the site-to-site VPN attachment.
   *
   * @cloudformationAttribute AttachmentId
   */
  public readonly attrAttachmentId: string;

  /**
   * The policy rule number associated with the attachment.
   *
   * @cloudformationAttribute AttachmentPolicyRuleNumber
   */
  public readonly attrAttachmentPolicyRuleNumber: number;

  /**
   * The type of attachment. This will be `SITE_TO_SITE_VPN` .
   *
   * @cloudformationAttribute AttachmentType
   */
  public readonly attrAttachmentType: string;

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The timestamp when the site-to-site VPN attachment was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The Region where the core network edge is located.
   *
   * @cloudformationAttribute EdgeLocation
   */
  public readonly attrEdgeLocation: string;

  /**
   * The ID of the site-to-site VPN attachment owner.
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The resource ARN for the site-to-site VPN attachment.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name of the site-to-site VPN attachment's segment.
   *
   * @cloudformationAttribute SegmentName
   */
  public readonly attrSegmentName: string;

  /**
   * The state of the site-to-site VPN attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The timestamp when the site-to-site VPN attachment was last updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The ID of a core network where you're creating a site-to-site VPN attachment.
   */
  public coreNetworkId: string;

  /**
   * Describes a proposed segment change.
   */
  public proposedSegmentChange?: cdk.IResolvable | CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the attachment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the site-to-site VPN attachment.
   */
  public vpnConnectionArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSiteToSiteVpnAttachmentProps) {
    super(scope, id, {
      "type": CfnSiteToSiteVpnAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "coreNetworkId", this);
    cdk.requireProperty(props, "vpnConnectionArn", this);

    this.attrAttachmentId = cdk.Token.asString(this.getAtt("AttachmentId", cdk.ResolutionTypeHint.STRING));
    this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt("AttachmentPolicyRuleNumber", cdk.ResolutionTypeHint.NUMBER));
    this.attrAttachmentType = cdk.Token.asString(this.getAtt("AttachmentType", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdgeLocation = cdk.Token.asString(this.getAtt("EdgeLocation", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSegmentName = cdk.Token.asString(this.getAtt("SegmentName", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.coreNetworkId = props.coreNetworkId;
    this.proposedSegmentChange = props.proposedSegmentChange;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::SiteToSiteVpnAttachment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpnConnectionArn = props.vpnConnectionArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "coreNetworkId": this.coreNetworkId,
      "proposedSegmentChange": this.proposedSegmentChange,
      "tags": this.tags.renderTags(),
      "vpnConnectionArn": this.vpnConnectionArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSiteToSiteVpnAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSiteToSiteVpnAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnSiteToSiteVpnAttachment {
  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html
   */
  export interface ProposedSegmentChangeProperty {
    /**
     * The rule number in the policy document that applies to this change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-attachmentpolicyrulenumber
     */
    readonly attachmentPolicyRuleNumber?: number;

    /**
     * The name of the segment to change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-segmentname
     */
    readonly segmentName?: string;

    /**
     * The list of key-value tags that changed for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }
}

/**
 * Properties for defining a `CfnSiteToSiteVpnAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html
 */
export interface CfnSiteToSiteVpnAttachmentProps {
  /**
   * The ID of a core network where you're creating a site-to-site VPN attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-corenetworkid
   */
  readonly coreNetworkId: string;

  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-proposedsegmentchange
   */
  readonly proposedSegmentChange?: cdk.IResolvable | CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty;

  /**
   * Tags for the attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the site-to-site VPN attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-vpnconnectionarn
   */
  readonly vpnConnectionArn: string;
}

/**
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentPolicyRuleNumber", cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
  errors.collect(cdk.propertyValidator("segmentName", cdk.validateString)(properties.segmentName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"ProposedSegmentChangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyValidator(properties).assertSuccess();
  return {
    "AttachmentPolicyRuleNumber": cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
    "SegmentName": cdk.stringToCloudFormation(properties.segmentName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty>();
  ret.addPropertyResult("attachmentPolicyRuleNumber", "AttachmentPolicyRuleNumber", (properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined));
  ret.addPropertyResult("segmentName", "SegmentName", (properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSiteToSiteVpnAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSiteToSiteVpnAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.requiredValidator)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.validateString)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("proposedSegmentChange", CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyValidator)(properties.proposedSegmentChange));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpnConnectionArn", cdk.requiredValidator)(properties.vpnConnectionArn));
  errors.collect(cdk.propertyValidator("vpnConnectionArn", cdk.validateString)(properties.vpnConnectionArn));
  return errors.wrap("supplied properties not correct for \"CfnSiteToSiteVpnAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnSiteToSiteVpnAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSiteToSiteVpnAttachmentPropsValidator(properties).assertSuccess();
  return {
    "CoreNetworkId": cdk.stringToCloudFormation(properties.coreNetworkId),
    "ProposedSegmentChange": convertCfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyToCloudFormation(properties.proposedSegmentChange),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpnConnectionArn": cdk.stringToCloudFormation(properties.vpnConnectionArn)
  };
}

// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSiteToSiteVpnAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteToSiteVpnAttachmentProps>();
  ret.addPropertyResult("coreNetworkId", "CoreNetworkId", (properties.CoreNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId) : undefined));
  ret.addPropertyResult("proposedSegmentChange", "ProposedSegmentChange", (properties.ProposedSegmentChange != null ? CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyFromCloudFormation(properties.ProposedSegmentChange) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpnConnectionArn", "VpnConnectionArn", (properties.VpnConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.VpnConnectionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a transit gateway peering connection.
 *
 * @cloudformationResource AWS::NetworkManager::TransitGatewayPeering
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewaypeering.html
 */
export class CfnTransitGatewayPeering extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::TransitGatewayPeering";

  /**
   * Build a CfnTransitGatewayPeering from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTransitGatewayPeering {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTransitGatewayPeeringPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTransitGatewayPeering(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The timestamp when the core network peering was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The edge location for the peer.
   *
   * @cloudformationAttribute EdgeLocation
   */
  public readonly attrEdgeLocation: string;

  /**
   * The ID of the account owner.
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The ID of the peering.
   *
   * @cloudformationAttribute PeeringId
   */
  public readonly attrPeeringId: string;

  /**
   * The peering type. This will be `TRANSIT_GATEWAY` .
   *
   * @cloudformationAttribute PeeringType
   */
  public readonly attrPeeringType: string;

  /**
   * The ARN of the resource peered to a core network.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The current state of the peer. This can be `CREATING` | `FAILED` | `AVAILABLE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The ID of the peering attachment.
   *
   * @cloudformationAttribute TransitGatewayPeeringAttachmentId
   */
  public readonly attrTransitGatewayPeeringAttachmentId: string;

  /**
   * The ID of the core network.
   */
  public coreNetworkId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value tags associated with the peering.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the transit gateway.
   */
  public transitGatewayArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTransitGatewayPeeringProps) {
    super(scope, id, {
      "type": CfnTransitGatewayPeering.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "coreNetworkId", this);
    cdk.requireProperty(props, "transitGatewayArn", this);

    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdgeLocation = cdk.Token.asString(this.getAtt("EdgeLocation", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrPeeringId = cdk.Token.asString(this.getAtt("PeeringId", cdk.ResolutionTypeHint.STRING));
    this.attrPeeringType = cdk.Token.asString(this.getAtt("PeeringType", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrTransitGatewayPeeringAttachmentId = cdk.Token.asString(this.getAtt("TransitGatewayPeeringAttachmentId", cdk.ResolutionTypeHint.STRING));
    this.coreNetworkId = props.coreNetworkId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::TransitGatewayPeering", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.transitGatewayArn = props.transitGatewayArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "coreNetworkId": this.coreNetworkId,
      "tags": this.tags.renderTags(),
      "transitGatewayArn": this.transitGatewayArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTransitGatewayPeering.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTransitGatewayPeeringPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTransitGatewayPeering`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewaypeering.html
 */
export interface CfnTransitGatewayPeeringProps {
  /**
   * The ID of the core network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewaypeering.html#cfn-networkmanager-transitgatewaypeering-corenetworkid
   */
  readonly coreNetworkId: string;

  /**
   * The list of key-value tags associated with the peering.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewaypeering.html#cfn-networkmanager-transitgatewaypeering-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the transit gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewaypeering.html#cfn-networkmanager-transitgatewaypeering-transitgatewayarn
   */
  readonly transitGatewayArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnTransitGatewayPeeringProps`
 *
 * @param properties - the TypeScript properties of a `CfnTransitGatewayPeeringProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransitGatewayPeeringPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.requiredValidator)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.validateString)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("transitGatewayArn", cdk.requiredValidator)(properties.transitGatewayArn));
  errors.collect(cdk.propertyValidator("transitGatewayArn", cdk.validateString)(properties.transitGatewayArn));
  return errors.wrap("supplied properties not correct for \"CfnTransitGatewayPeeringProps\"");
}

// @ts-ignore TS6133
function convertCfnTransitGatewayPeeringPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransitGatewayPeeringPropsValidator(properties).assertSuccess();
  return {
    "CoreNetworkId": cdk.stringToCloudFormation(properties.coreNetworkId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TransitGatewayArn": cdk.stringToCloudFormation(properties.transitGatewayArn)
  };
}

// @ts-ignore TS6133
function CfnTransitGatewayPeeringPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransitGatewayPeeringProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransitGatewayPeeringProps>();
  ret.addPropertyResult("coreNetworkId", "CoreNetworkId", (properties.CoreNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("transitGatewayArn", "TransitGatewayArn", (properties.TransitGatewayArn != null ? cfn_parse.FromCloudFormation.getString(properties.TransitGatewayArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Registers a transit gateway in your global network.
 *
 * Not all Regions support transit gateways for global networks. For a list of the supported Regions, see [Region Availability](https://docs.aws.amazon.com/network-manager/latest/tgwnm/what-are-global-networks.html#nm-available-regions) in the *AWS Transit Gateways for Global Networks User Guide* . The transit gateway can be in any of the supported AWS Regions, but it must be owned by the same AWS account that owns the global network. You cannot register a transit gateway in more than one global network.
 *
 * @cloudformationResource AWS::NetworkManager::TransitGatewayRegistration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html
 */
export class CfnTransitGatewayRegistration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::TransitGatewayRegistration";

  /**
   * Build a CfnTransitGatewayRegistration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTransitGatewayRegistration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTransitGatewayRegistrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTransitGatewayRegistration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the global network.
   */
  public globalNetworkId: string;

  /**
   * The Amazon Resource Name (ARN) of the transit gateway.
   */
  public transitGatewayArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTransitGatewayRegistrationProps) {
    super(scope, id, {
      "type": CfnTransitGatewayRegistration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "globalNetworkId", this);
    cdk.requireProperty(props, "transitGatewayArn", this);

    this.globalNetworkId = props.globalNetworkId;
    this.transitGatewayArn = props.transitGatewayArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "globalNetworkId": this.globalNetworkId,
      "transitGatewayArn": this.transitGatewayArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTransitGatewayRegistration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTransitGatewayRegistrationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTransitGatewayRegistration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html
 */
export interface CfnTransitGatewayRegistrationProps {
  /**
   * The ID of the global network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-globalnetworkid
   */
  readonly globalNetworkId: string;

  /**
   * The Amazon Resource Name (ARN) of the transit gateway.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-transitgatewayarn
   */
  readonly transitGatewayArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnTransitGatewayRegistrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTransitGatewayRegistrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransitGatewayRegistrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.requiredValidator)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("globalNetworkId", cdk.validateString)(properties.globalNetworkId));
  errors.collect(cdk.propertyValidator("transitGatewayArn", cdk.requiredValidator)(properties.transitGatewayArn));
  errors.collect(cdk.propertyValidator("transitGatewayArn", cdk.validateString)(properties.transitGatewayArn));
  return errors.wrap("supplied properties not correct for \"CfnTransitGatewayRegistrationProps\"");
}

// @ts-ignore TS6133
function convertCfnTransitGatewayRegistrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransitGatewayRegistrationPropsValidator(properties).assertSuccess();
  return {
    "GlobalNetworkId": cdk.stringToCloudFormation(properties.globalNetworkId),
    "TransitGatewayArn": cdk.stringToCloudFormation(properties.transitGatewayArn)
  };
}

// @ts-ignore TS6133
function CfnTransitGatewayRegistrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransitGatewayRegistrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransitGatewayRegistrationProps>();
  ret.addPropertyResult("globalNetworkId", "GlobalNetworkId", (properties.GlobalNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId) : undefined));
  ret.addPropertyResult("transitGatewayArn", "TransitGatewayArn", (properties.TransitGatewayArn != null ? cfn_parse.FromCloudFormation.getString(properties.TransitGatewayArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a transit gateway route table attachment.
 *
 * @cloudformationResource AWS::NetworkManager::TransitGatewayRouteTableAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html
 */
export class CfnTransitGatewayRouteTableAttachment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::TransitGatewayRouteTableAttachment";

  /**
   * Build a CfnTransitGatewayRouteTableAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTransitGatewayRouteTableAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTransitGatewayRouteTableAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTransitGatewayRouteTableAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the transit gateway route table attachment.
   *
   * @cloudformationAttribute AttachmentId
   */
  public readonly attrAttachmentId: string;

  /**
   * The policy rule number associated with the attachment.
   *
   * @cloudformationAttribute AttachmentPolicyRuleNumber
   */
  public readonly attrAttachmentPolicyRuleNumber: number;

  /**
   * The type of attachment. This will be `TRANSIT_GATEWAY_ROUTE_TABLE` .
   *
   * @cloudformationAttribute AttachmentType
   */
  public readonly attrAttachmentType: string;

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The ID of the core network.
   *
   * @cloudformationAttribute CoreNetworkId
   */
  public readonly attrCoreNetworkId: string;

  /**
   * The timestamp when the transit gateway route table attachment was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The Region where the core network edge is located.
   *
   * @cloudformationAttribute EdgeLocation
   */
  public readonly attrEdgeLocation: string;

  /**
   * The ID of the transit gateway route table attachment owner.
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The resource ARN for the transit gateway route table attachment.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name of the attachment's segment.
   *
   * @cloudformationAttribute SegmentName
   */
  public readonly attrSegmentName: string;

  /**
   * The state of the attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The timestamp when the transit gateway route table attachment was last updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The ID of the transit gateway peering.
   */
  public peeringId: string;

  /**
   * This property is read-only.
   */
  public proposedSegmentChange?: cdk.IResolvable | CfnTransitGatewayRouteTableAttachment.ProposedSegmentChangeProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value pairs associated with the transit gateway route table attachment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the transit gateway attachment route table.
   */
  public transitGatewayRouteTableArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTransitGatewayRouteTableAttachmentProps) {
    super(scope, id, {
      "type": CfnTransitGatewayRouteTableAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "peeringId", this);
    cdk.requireProperty(props, "transitGatewayRouteTableArn", this);

    this.attrAttachmentId = cdk.Token.asString(this.getAtt("AttachmentId", cdk.ResolutionTypeHint.STRING));
    this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt("AttachmentPolicyRuleNumber", cdk.ResolutionTypeHint.NUMBER));
    this.attrAttachmentType = cdk.Token.asString(this.getAtt("AttachmentType", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkId = cdk.Token.asString(this.getAtt("CoreNetworkId", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdgeLocation = cdk.Token.asString(this.getAtt("EdgeLocation", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSegmentName = cdk.Token.asString(this.getAtt("SegmentName", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.peeringId = props.peeringId;
    this.proposedSegmentChange = props.proposedSegmentChange;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::TransitGatewayRouteTableAttachment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.transitGatewayRouteTableArn = props.transitGatewayRouteTableArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "peeringId": this.peeringId,
      "proposedSegmentChange": this.proposedSegmentChange,
      "tags": this.tags.renderTags(),
      "transitGatewayRouteTableArn": this.transitGatewayRouteTableArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTransitGatewayRouteTableAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTransitGatewayRouteTableAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnTransitGatewayRouteTableAttachment {
  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange.html
   */
  export interface ProposedSegmentChangeProperty {
    /**
     * The rule number in the policy document that applies to this change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange.html#cfn-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange-attachmentpolicyrulenumber
     */
    readonly attachmentPolicyRuleNumber?: number;

    /**
     * The name of the segment to change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange.html#cfn-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange-segmentname
     */
    readonly segmentName?: string;

    /**
     * The list of key-value tags that changed for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange.html#cfn-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }
}

/**
 * Properties for defining a `CfnTransitGatewayRouteTableAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html
 */
export interface CfnTransitGatewayRouteTableAttachmentProps {
  /**
   * The ID of the transit gateway peering.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html#cfn-networkmanager-transitgatewayroutetableattachment-peeringid
   */
  readonly peeringId: string;

  /**
   * This property is read-only.
   *
   * Values can't be assigned to it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html#cfn-networkmanager-transitgatewayroutetableattachment-proposedsegmentchange
   */
  readonly proposedSegmentChange?: cdk.IResolvable | CfnTransitGatewayRouteTableAttachment.ProposedSegmentChangeProperty;

  /**
   * The list of key-value pairs associated with the transit gateway route table attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html#cfn-networkmanager-transitgatewayroutetableattachment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the transit gateway attachment route table.
   *
   * For example, `"TransitGatewayRouteTableArn": "arn:aws:ec2:us-west-2:123456789012:transit-gateway-route-table/tgw-rtb-9876543210123456"` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayroutetableattachment.html#cfn-networkmanager-transitgatewayroutetableattachment-transitgatewayroutetablearn
   */
  readonly transitGatewayRouteTableArn: string;
}

/**
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentPolicyRuleNumber", cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
  errors.collect(cdk.propertyValidator("segmentName", cdk.validateString)(properties.segmentName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"ProposedSegmentChangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyValidator(properties).assertSuccess();
  return {
    "AttachmentPolicyRuleNumber": cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
    "SegmentName": cdk.stringToCloudFormation(properties.segmentName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTransitGatewayRouteTableAttachment.ProposedSegmentChangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransitGatewayRouteTableAttachment.ProposedSegmentChangeProperty>();
  ret.addPropertyResult("attachmentPolicyRuleNumber", "AttachmentPolicyRuleNumber", (properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined));
  ret.addPropertyResult("segmentName", "SegmentName", (properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTransitGatewayRouteTableAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnTransitGatewayRouteTableAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransitGatewayRouteTableAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("peeringId", cdk.requiredValidator)(properties.peeringId));
  errors.collect(cdk.propertyValidator("peeringId", cdk.validateString)(properties.peeringId));
  errors.collect(cdk.propertyValidator("proposedSegmentChange", CfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyValidator)(properties.proposedSegmentChange));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("transitGatewayRouteTableArn", cdk.requiredValidator)(properties.transitGatewayRouteTableArn));
  errors.collect(cdk.propertyValidator("transitGatewayRouteTableArn", cdk.validateString)(properties.transitGatewayRouteTableArn));
  return errors.wrap("supplied properties not correct for \"CfnTransitGatewayRouteTableAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnTransitGatewayRouteTableAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransitGatewayRouteTableAttachmentPropsValidator(properties).assertSuccess();
  return {
    "PeeringId": cdk.stringToCloudFormation(properties.peeringId),
    "ProposedSegmentChange": convertCfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyToCloudFormation(properties.proposedSegmentChange),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TransitGatewayRouteTableArn": cdk.stringToCloudFormation(properties.transitGatewayRouteTableArn)
  };
}

// @ts-ignore TS6133
function CfnTransitGatewayRouteTableAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransitGatewayRouteTableAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransitGatewayRouteTableAttachmentProps>();
  ret.addPropertyResult("peeringId", "PeeringId", (properties.PeeringId != null ? cfn_parse.FromCloudFormation.getString(properties.PeeringId) : undefined));
  ret.addPropertyResult("proposedSegmentChange", "ProposedSegmentChange", (properties.ProposedSegmentChange != null ? CfnTransitGatewayRouteTableAttachmentProposedSegmentChangePropertyFromCloudFormation(properties.ProposedSegmentChange) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("transitGatewayRouteTableArn", "TransitGatewayRouteTableArn", (properties.TransitGatewayRouteTableArn != null ? cfn_parse.FromCloudFormation.getString(properties.TransitGatewayRouteTableArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a VPC attachment on an edge location of a core network.
 *
 * @cloudformationResource AWS::NetworkManager::VpcAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html
 */
export class CfnVpcAttachment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NetworkManager::VpcAttachment";

  /**
   * Build a CfnVpcAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcAttachment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the VPC attachment.
   *
   * @cloudformationAttribute AttachmentId
   */
  public readonly attrAttachmentId: string;

  /**
   * The policy rule number associated with the attachment.
   *
   * @cloudformationAttribute AttachmentPolicyRuleNumber
   */
  public readonly attrAttachmentPolicyRuleNumber: number;

  /**
   * The type of attachment. This will be `VPC` .
   *
   * @cloudformationAttribute AttachmentType
   */
  public readonly attrAttachmentType: string;

  /**
   * The ARN of the core network.
   *
   * @cloudformationAttribute CoreNetworkArn
   */
  public readonly attrCoreNetworkArn: string;

  /**
   * The timestamp when the VPC attachment was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The Region where the core network edge is located.
   *
   * @cloudformationAttribute EdgeLocation
   */
  public readonly attrEdgeLocation: string;

  /**
   * The ID of the VPC attachment owner.
   *
   * @cloudformationAttribute OwnerAccountId
   */
  public readonly attrOwnerAccountId: string;

  /**
   * The resource ARN for the VPC attachment.
   *
   * @cloudformationAttribute ResourceArn
   */
  public readonly attrResourceArn: string;

  /**
   * The name of the attachment's segment.
   *
   * @cloudformationAttribute SegmentName
   */
  public readonly attrSegmentName: string;

  /**
   * The state of the attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The timestamp when the VPC attachment was last updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The core network ID.
   */
  public coreNetworkId: string;

  /**
   * Options for creating the VPC attachment.
   */
  public options?: cdk.IResolvable | CfnVpcAttachment.VpcOptionsProperty;

  /**
   * Describes a proposed segment change.
   */
  public proposedSegmentChange?: cdk.IResolvable | CfnVpcAttachment.ProposedSegmentChangeProperty;

  /**
   * The subnet ARNs.
   */
  public subnetArns: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with the VPC attachment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the VPC attachment.
   */
  public vpcArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcAttachmentProps) {
    super(scope, id, {
      "type": CfnVpcAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "coreNetworkId", this);
    cdk.requireProperty(props, "subnetArns", this);
    cdk.requireProperty(props, "vpcArn", this);

    this.attrAttachmentId = cdk.Token.asString(this.getAtt("AttachmentId", cdk.ResolutionTypeHint.STRING));
    this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt("AttachmentPolicyRuleNumber", cdk.ResolutionTypeHint.NUMBER));
    this.attrAttachmentType = cdk.Token.asString(this.getAtt("AttachmentType", cdk.ResolutionTypeHint.STRING));
    this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt("CoreNetworkArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEdgeLocation = cdk.Token.asString(this.getAtt("EdgeLocation", cdk.ResolutionTypeHint.STRING));
    this.attrOwnerAccountId = cdk.Token.asString(this.getAtt("OwnerAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrResourceArn = cdk.Token.asString(this.getAtt("ResourceArn", cdk.ResolutionTypeHint.STRING));
    this.attrSegmentName = cdk.Token.asString(this.getAtt("SegmentName", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.coreNetworkId = props.coreNetworkId;
    this.options = props.options;
    this.proposedSegmentChange = props.proposedSegmentChange;
    this.subnetArns = props.subnetArns;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::VpcAttachment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcArn = props.vpcArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "coreNetworkId": this.coreNetworkId,
      "options": this.options,
      "proposedSegmentChange": this.proposedSegmentChange,
      "subnetArns": this.subnetArns,
      "tags": this.tags.renderTags(),
      "vpcArn": this.vpcArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcAttachmentPropsToCloudFormation(props);
  }
}

export namespace CfnVpcAttachment {
  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html
   */
  export interface ProposedSegmentChangeProperty {
    /**
     * The rule number in the policy document that applies to this change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-attachmentpolicyrulenumber
     */
    readonly attachmentPolicyRuleNumber?: number;

    /**
     * The name of the segment to change.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-segmentname
     */
    readonly segmentName?: string;

    /**
     * The list of key-value tags that changed for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html#cfn-networkmanager-vpcattachment-proposedsegmentchange-tags
     */
    readonly tags?: Array<cdk.CfnTag>;
  }

  /**
   * Describes the VPC options.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html
   */
  export interface VpcOptionsProperty {
    /**
     * Indicates whether appliance mode is supported.
     *
     * If enabled, traffic flow between a source and destination use the same Availability Zone for the VPC attachment for the lifetime of that flow. The default value is `false` .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html#cfn-networkmanager-vpcattachment-vpcoptions-appliancemodesupport
     */
    readonly applianceModeSupport?: boolean | cdk.IResolvable;

    /**
     * Indicates whether IPv6 is supported.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html#cfn-networkmanager-vpcattachment-vpcoptions-ipv6support
     */
    readonly ipv6Support?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnVpcAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html
 */
export interface CfnVpcAttachmentProps {
  /**
   * The core network ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-corenetworkid
   */
  readonly coreNetworkId: string;

  /**
   * Options for creating the VPC attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-options
   */
  readonly options?: cdk.IResolvable | CfnVpcAttachment.VpcOptionsProperty;

  /**
   * Describes a proposed segment change.
   *
   * In some cases, the segment change must first be evaluated and accepted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-proposedsegmentchange
   */
  readonly proposedSegmentChange?: cdk.IResolvable | CfnVpcAttachment.ProposedSegmentChangeProperty;

  /**
   * The subnet ARNs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-subnetarns
   */
  readonly subnetArns: Array<string>;

  /**
   * The tags associated with the VPC attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the VPC attachment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-vpcarn
   */
  readonly vpcArn: string;
}

/**
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcAttachmentProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentPolicyRuleNumber", cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
  errors.collect(cdk.propertyValidator("segmentName", cdk.validateString)(properties.segmentName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"ProposedSegmentChangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnVpcAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcAttachmentProposedSegmentChangePropertyValidator(properties).assertSuccess();
  return {
    "AttachmentPolicyRuleNumber": cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
    "SegmentName": cdk.stringToCloudFormation(properties.segmentName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnVpcAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVpcAttachment.ProposedSegmentChangeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachment.ProposedSegmentChangeProperty>();
  ret.addPropertyResult("attachmentPolicyRuleNumber", "AttachmentPolicyRuleNumber", (properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined));
  ret.addPropertyResult("segmentName", "SegmentName", (properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcAttachmentVpcOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applianceModeSupport", cdk.validateBoolean)(properties.applianceModeSupport));
  errors.collect(cdk.propertyValidator("ipv6Support", cdk.validateBoolean)(properties.ipv6Support));
  return errors.wrap("supplied properties not correct for \"VpcOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnVpcAttachmentVpcOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcAttachmentVpcOptionsPropertyValidator(properties).assertSuccess();
  return {
    "ApplianceModeSupport": cdk.booleanToCloudFormation(properties.applianceModeSupport),
    "Ipv6Support": cdk.booleanToCloudFormation(properties.ipv6Support)
  };
}

// @ts-ignore TS6133
function CfnVpcAttachmentVpcOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVpcAttachment.VpcOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachment.VpcOptionsProperty>();
  ret.addPropertyResult("applianceModeSupport", "ApplianceModeSupport", (properties.ApplianceModeSupport != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplianceModeSupport) : undefined));
  ret.addPropertyResult("ipv6Support", "Ipv6Support", (properties.Ipv6Support != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Ipv6Support) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVpcAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.requiredValidator)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("coreNetworkId", cdk.validateString)(properties.coreNetworkId));
  errors.collect(cdk.propertyValidator("options", CfnVpcAttachmentVpcOptionsPropertyValidator)(properties.options));
  errors.collect(cdk.propertyValidator("proposedSegmentChange", CfnVpcAttachmentProposedSegmentChangePropertyValidator)(properties.proposedSegmentChange));
  errors.collect(cdk.propertyValidator("subnetArns", cdk.requiredValidator)(properties.subnetArns));
  errors.collect(cdk.propertyValidator("subnetArns", cdk.listValidator(cdk.validateString))(properties.subnetArns));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcArn", cdk.requiredValidator)(properties.vpcArn));
  errors.collect(cdk.propertyValidator("vpcArn", cdk.validateString)(properties.vpcArn));
  return errors.wrap("supplied properties not correct for \"CfnVpcAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcAttachmentPropsValidator(properties).assertSuccess();
  return {
    "CoreNetworkId": cdk.stringToCloudFormation(properties.coreNetworkId),
    "Options": convertCfnVpcAttachmentVpcOptionsPropertyToCloudFormation(properties.options),
    "ProposedSegmentChange": convertCfnVpcAttachmentProposedSegmentChangePropertyToCloudFormation(properties.proposedSegmentChange),
    "SubnetArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetArns),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcArn": cdk.stringToCloudFormation(properties.vpcArn)
  };
}

// @ts-ignore TS6133
function CfnVpcAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachmentProps>();
  ret.addPropertyResult("coreNetworkId", "CoreNetworkId", (properties.CoreNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? CfnVpcAttachmentVpcOptionsPropertyFromCloudFormation(properties.Options) : undefined));
  ret.addPropertyResult("proposedSegmentChange", "ProposedSegmentChange", (properties.ProposedSegmentChange != null ? CfnVpcAttachmentProposedSegmentChangePropertyFromCloudFormation(properties.ProposedSegmentChange) : undefined));
  ret.addPropertyResult("subnetArns", "SubnetArns", (properties.SubnetArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetArns) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcArn", "VpcArn", (properties.VpcArn != null ? cfn_parse.FromCloudFormation.getString(properties.VpcArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}