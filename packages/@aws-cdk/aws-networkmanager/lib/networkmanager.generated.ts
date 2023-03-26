// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:26.754Z","fingerprint":"rpZYlmcB0BnxxZv91DKrj0sIB8vaLMB3iyDJ/bGAGWU="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnConnectAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectAttachmentProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectAttachmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coreNetworkId', cdk.requiredValidator)(properties.coreNetworkId));
    errors.collect(cdk.propertyValidator('coreNetworkId', cdk.validateString)(properties.coreNetworkId));
    errors.collect(cdk.propertyValidator('edgeLocation', cdk.requiredValidator)(properties.edgeLocation));
    errors.collect(cdk.propertyValidator('edgeLocation', cdk.validateString)(properties.edgeLocation));
    errors.collect(cdk.propertyValidator('options', cdk.requiredValidator)(properties.options));
    errors.collect(cdk.propertyValidator('options', CfnConnectAttachment_ConnectAttachmentOptionsPropertyValidator)(properties.options));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('transportAttachmentId', cdk.requiredValidator)(properties.transportAttachmentId));
    errors.collect(cdk.propertyValidator('transportAttachmentId', cdk.validateString)(properties.transportAttachmentId));
    return errors.wrap('supplied properties not correct for "CfnConnectAttachmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectAttachmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment` resource.
 */
// @ts-ignore TS6133
function cfnConnectAttachmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectAttachmentPropsValidator(properties).assertSuccess();
    return {
        CoreNetworkId: cdk.stringToCloudFormation(properties.coreNetworkId),
        EdgeLocation: cdk.stringToCloudFormation(properties.edgeLocation),
        Options: cfnConnectAttachmentConnectAttachmentOptionsPropertyToCloudFormation(properties.options),
        TransportAttachmentId: cdk.stringToCloudFormation(properties.transportAttachmentId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectAttachmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachmentProps>();
    ret.addPropertyResult('coreNetworkId', 'CoreNetworkId', cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId));
    ret.addPropertyResult('edgeLocation', 'EdgeLocation', cfn_parse.FromCloudFormation.getString(properties.EdgeLocation));
    ret.addPropertyResult('options', 'Options', CfnConnectAttachmentConnectAttachmentOptionsPropertyFromCloudFormation(properties.Options));
    ret.addPropertyResult('transportAttachmentId', 'TransportAttachmentId', cfn_parse.FromCloudFormation.getString(properties.TransportAttachmentId));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnConnectAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::ConnectAttachment";

    /**
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
        const ret = new CfnConnectAttachment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the Connect attachment.
     * @cloudformationAttribute AttachmentId
     */
    public readonly attrAttachmentId: string;

    /**
     * The rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    public readonly attrAttachmentPolicyRuleNumber: number;

    /**
     * The type of attachment. This will be `CONNECT` .
     * @cloudformationAttribute AttachmentType
     */
    public readonly attrAttachmentType: string;

    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    public readonly attrCoreNetworkArn: string;

    /**
     * The timestamp when the Connect attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The ID of the Connect attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    public readonly attrOwnerAccountId: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    public readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    public readonly attrProposedSegmentChangeSegmentName: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    public readonly attrProposedSegmentChangeTags: cdk.IResolvable;

    /**
     * The resource ARN for the Connect attachment.
     * @cloudformationAttribute ResourceArn
     */
    public readonly attrResourceArn: string;

    /**
     * The name of the Connect attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    public readonly attrSegmentName: string;

    /**
     * The state of the Connect attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The timestamp when the Connect attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    public readonly attrUpdatedAt: string;

    /**
     * The ID of the core network where the Connect attachment is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-corenetworkid
     */
    public coreNetworkId: string;

    /**
     * The Region where the edge is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-edgelocation
     */
    public edgeLocation: string;

    /**
     * Options for connecting an attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-options
     */
    public options: CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable;

    /**
     * The ID of the transport attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-transportattachmentid
     */
    public transportAttachmentId: string;

    /**
     * `AWS::NetworkManager::ConnectAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectattachment.html#cfn-networkmanager-connectattachment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::ConnectAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectAttachmentProps) {
        super(scope, id, { type: CfnConnectAttachment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'coreNetworkId', this);
        cdk.requireProperty(props, 'edgeLocation', this);
        cdk.requireProperty(props, 'options', this);
        cdk.requireProperty(props, 'transportAttachmentId', this);
        this.attrAttachmentId = cdk.Token.asString(this.getAtt('AttachmentId', cdk.ResolutionTypeHint.STRING));
        this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrAttachmentType = cdk.Token.asString(this.getAtt('AttachmentType', cdk.ResolutionTypeHint.STRING));
        this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt('CoreNetworkArn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrOwnerAccountId = cdk.Token.asString(this.getAtt('OwnerAccountId', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('ProposedSegmentChange.AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrProposedSegmentChangeSegmentName = cdk.Token.asString(this.getAtt('ProposedSegmentChange.SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeTags = this.getAtt('ProposedSegmentChange.Tags', cdk.ResolutionTypeHint.STRING);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrSegmentName = cdk.Token.asString(this.getAtt('SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdatedAt = cdk.Token.asString(this.getAtt('UpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.coreNetworkId = props.coreNetworkId;
        this.edgeLocation = props.edgeLocation;
        this.options = props.options;
        this.transportAttachmentId = props.transportAttachmentId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::ConnectAttachment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectAttachment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            coreNetworkId: this.coreNetworkId,
            edgeLocation: this.edgeLocation,
            options: this.options,
            transportAttachmentId: this.transportAttachmentId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectAttachmentPropsToCloudFormation(props);
    }
}

export namespace CfnConnectAttachment {
    /**
     * Describes a core network Connect attachment options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html
     */
    export interface ConnectAttachmentOptionsProperty {
        /**
         * The protocol used for the attachment connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-connectattachmentoptions.html#cfn-networkmanager-connectattachment-connectattachmentoptions-protocol
         */
        readonly protocol?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectAttachmentOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectAttachmentOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectAttachment_ConnectAttachmentOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "ConnectAttachmentOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment.ConnectAttachmentOptions` resource
 *
 * @param properties - the TypeScript properties of a `ConnectAttachmentOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment.ConnectAttachmentOptions` resource.
 */
// @ts-ignore TS6133
function cfnConnectAttachmentConnectAttachmentOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectAttachment_ConnectAttachmentOptionsPropertyValidator(properties).assertSuccess();
    return {
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnConnectAttachmentConnectAttachmentOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectAttachment.ConnectAttachmentOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachment.ConnectAttachmentOptionsProperty>();
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnectAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectattachment-proposedsegmentchange.html
     */
    export interface ProposedSegmentChangeProperty {
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
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectAttachment_ProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachmentPolicyRuleNumber', cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
    errors.collect(cdk.propertyValidator('segmentName', cdk.validateString)(properties.segmentName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "ProposedSegmentChangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment.ProposedSegmentChange` resource
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectAttachment.ProposedSegmentChange` resource.
 */
// @ts-ignore TS6133
function cfnConnectAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectAttachment_ProposedSegmentChangePropertyValidator(properties).assertSuccess();
    return {
        AttachmentPolicyRuleNumber: cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
        SegmentName: cdk.stringToCloudFormation(properties.segmentName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectAttachment.ProposedSegmentChangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectAttachment.ProposedSegmentChangeProperty>();
    ret.addPropertyResult('attachmentPolicyRuleNumber', 'AttachmentPolicyRuleNumber', properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined);
    ret.addPropertyResult('segmentName', 'SegmentName', properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnConnectPeerProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectPeerProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectPeerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bgpOptions', CfnConnectPeer_BgpOptionsPropertyValidator)(properties.bgpOptions));
    errors.collect(cdk.propertyValidator('connectAttachmentId', cdk.validateString)(properties.connectAttachmentId));
    errors.collect(cdk.propertyValidator('coreNetworkAddress', cdk.validateString)(properties.coreNetworkAddress));
    errors.collect(cdk.propertyValidator('insideCidrBlocks', cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
    errors.collect(cdk.propertyValidator('peerAddress', cdk.validateString)(properties.peerAddress));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConnectPeerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectPeerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer` resource.
 */
// @ts-ignore TS6133
function cfnConnectPeerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectPeerPropsValidator(properties).assertSuccess();
    return {
        BgpOptions: cfnConnectPeerBgpOptionsPropertyToCloudFormation(properties.bgpOptions),
        ConnectAttachmentId: cdk.stringToCloudFormation(properties.connectAttachmentId),
        CoreNetworkAddress: cdk.stringToCloudFormation(properties.coreNetworkAddress),
        InsideCidrBlocks: cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks),
        PeerAddress: cdk.stringToCloudFormation(properties.peerAddress),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectPeerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeerProps>();
    ret.addPropertyResult('bgpOptions', 'BgpOptions', properties.BgpOptions != null ? CfnConnectPeerBgpOptionsPropertyFromCloudFormation(properties.BgpOptions) : undefined);
    ret.addPropertyResult('connectAttachmentId', 'ConnectAttachmentId', properties.ConnectAttachmentId != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectAttachmentId) : undefined);
    ret.addPropertyResult('coreNetworkAddress', 'CoreNetworkAddress', properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined);
    ret.addPropertyResult('insideCidrBlocks', 'InsideCidrBlocks', properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InsideCidrBlocks) : undefined);
    ret.addPropertyResult('peerAddress', 'PeerAddress', properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnConnectPeer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::ConnectPeer";

    /**
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
        const ret = new CfnConnectPeer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Configuration.BgpConfigurations
     */
    public readonly attrConfigurationBgpConfigurations: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute Configuration.CoreNetworkAddress
     */
    public readonly attrConfigurationCoreNetworkAddress: string;

    /**
     *
     * @cloudformationAttribute Configuration.InsideCidrBlocks
     */
    public readonly attrConfigurationInsideCidrBlocks: string[];

    /**
     *
     * @cloudformationAttribute Configuration.PeerAddress
     */
    public readonly attrConfigurationPeerAddress: string;

    /**
     *
     * @cloudformationAttribute Configuration.Protocol
     */
    public readonly attrConfigurationProtocol: string;

    /**
     * The ID of the Connect peer.
     * @cloudformationAttribute ConnectPeerId
     */
    public readonly attrConnectPeerId: string;

    /**
     * The core network ID.
     * @cloudformationAttribute CoreNetworkId
     */
    public readonly attrCoreNetworkId: string;

    /**
     * The timestamp when the Connect peer was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The Region where the edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    public readonly attrEdgeLocation: string;

    /**
     * The state of the Connect peer. This will be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * `AWS::NetworkManager::ConnectPeer.BgpOptions`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-bgpoptions
     */
    public bgpOptions: CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The ID of the attachment to connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-connectattachmentid
     */
    public connectAttachmentId: string | undefined;

    /**
     * The IP address of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-corenetworkaddress
     */
    public coreNetworkAddress: string | undefined;

    /**
     * The inside IP addresses used for a Connect peer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-insidecidrblocks
     */
    public insideCidrBlocks: string[] | undefined;

    /**
     * The IP address of the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-peeraddress
     */
    public peerAddress: string | undefined;

    /**
     * The list of key-value tags associated with the Connect peer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-connectpeer.html#cfn-networkmanager-connectpeer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::ConnectPeer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectPeerProps = {}) {
        super(scope, id, { type: CfnConnectPeer.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrConfigurationBgpConfigurations = this.getAtt('Configuration.BgpConfigurations', cdk.ResolutionTypeHint.STRING);
        this.attrConfigurationCoreNetworkAddress = cdk.Token.asString(this.getAtt('Configuration.CoreNetworkAddress', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationInsideCidrBlocks = cdk.Token.asList(this.getAtt('Configuration.InsideCidrBlocks', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrConfigurationPeerAddress = cdk.Token.asString(this.getAtt('Configuration.PeerAddress', cdk.ResolutionTypeHint.STRING));
        this.attrConfigurationProtocol = cdk.Token.asString(this.getAtt('Configuration.Protocol', cdk.ResolutionTypeHint.STRING));
        this.attrConnectPeerId = cdk.Token.asString(this.getAtt('ConnectPeerId', cdk.ResolutionTypeHint.STRING));
        this.attrCoreNetworkId = cdk.Token.asString(this.getAtt('CoreNetworkId', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEdgeLocation = cdk.Token.asString(this.getAtt('EdgeLocation', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));

        this.bgpOptions = props.bgpOptions;
        this.connectAttachmentId = props.connectAttachmentId;
        this.coreNetworkAddress = props.coreNetworkAddress;
        this.insideCidrBlocks = props.insideCidrBlocks;
        this.peerAddress = props.peerAddress;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::ConnectPeer", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectPeer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bgpOptions: this.bgpOptions,
            connectAttachmentId: this.connectAttachmentId,
            coreNetworkAddress: this.coreNetworkAddress,
            insideCidrBlocks: this.insideCidrBlocks,
            peerAddress: this.peerAddress,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectPeerPropsToCloudFormation(props);
    }
}

export namespace CfnConnectPeer {
    /**
     * Describes the BGP options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html
     */
    export interface BgpOptionsProperty {
        /**
         * The Peer ASN of the BGP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-bgpoptions.html#cfn-networkmanager-connectpeer-bgpoptions-peerasn
         */
        readonly peerAsn?: number;
    }
}

/**
 * Determine whether the given properties match those of a `BgpOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `BgpOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectPeer_BgpOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('peerAsn', cdk.validateNumber)(properties.peerAsn));
    return errors.wrap('supplied properties not correct for "BgpOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.BgpOptions` resource
 *
 * @param properties - the TypeScript properties of a `BgpOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.BgpOptions` resource.
 */
// @ts-ignore TS6133
function cfnConnectPeerBgpOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectPeer_BgpOptionsPropertyValidator(properties).assertSuccess();
    return {
        PeerAsn: cdk.numberToCloudFormation(properties.peerAsn),
    };
}

// @ts-ignore TS6133
function CfnConnectPeerBgpOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.BgpOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.BgpOptionsProperty>();
    ret.addPropertyResult('peerAsn', 'PeerAsn', properties.PeerAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.PeerAsn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnectPeer {
    /**
     * Describes a core network BGP configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerbgpconfiguration.html
     */
    export interface ConnectPeerBgpConfigurationProperty {
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

/**
 * Determine whether the given properties match those of a `ConnectPeerBgpConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectPeerBgpConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectPeer_ConnectPeerBgpConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coreNetworkAddress', cdk.validateString)(properties.coreNetworkAddress));
    errors.collect(cdk.propertyValidator('coreNetworkAsn', cdk.validateNumber)(properties.coreNetworkAsn));
    errors.collect(cdk.propertyValidator('peerAddress', cdk.validateString)(properties.peerAddress));
    errors.collect(cdk.propertyValidator('peerAsn', cdk.validateNumber)(properties.peerAsn));
    return errors.wrap('supplied properties not correct for "ConnectPeerBgpConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.ConnectPeerBgpConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ConnectPeerBgpConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.ConnectPeerBgpConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnConnectPeerConnectPeerBgpConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectPeer_ConnectPeerBgpConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CoreNetworkAddress: cdk.stringToCloudFormation(properties.coreNetworkAddress),
        CoreNetworkAsn: cdk.numberToCloudFormation(properties.coreNetworkAsn),
        PeerAddress: cdk.stringToCloudFormation(properties.peerAddress),
        PeerAsn: cdk.numberToCloudFormation(properties.peerAsn),
    };
}

// @ts-ignore TS6133
function CfnConnectPeerConnectPeerBgpConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.ConnectPeerBgpConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.ConnectPeerBgpConfigurationProperty>();
    ret.addPropertyResult('coreNetworkAddress', 'CoreNetworkAddress', properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined);
    ret.addPropertyResult('coreNetworkAsn', 'CoreNetworkAsn', properties.CoreNetworkAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.CoreNetworkAsn) : undefined);
    ret.addPropertyResult('peerAddress', 'PeerAddress', properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined);
    ret.addPropertyResult('peerAsn', 'PeerAsn', properties.PeerAsn != null ? cfn_parse.FromCloudFormation.getNumber(properties.PeerAsn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConnectPeer {
    /**
     * Describes a core network Connect peer configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-connectpeer-connectpeerconfiguration.html
     */
    export interface ConnectPeerConfigurationProperty {
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
 * Determine whether the given properties match those of a `ConnectPeerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectPeerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectPeer_ConnectPeerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bgpConfigurations', cdk.listValidator(CfnConnectPeer_ConnectPeerBgpConfigurationPropertyValidator))(properties.bgpConfigurations));
    errors.collect(cdk.propertyValidator('coreNetworkAddress', cdk.validateString)(properties.coreNetworkAddress));
    errors.collect(cdk.propertyValidator('insideCidrBlocks', cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
    errors.collect(cdk.propertyValidator('peerAddress', cdk.validateString)(properties.peerAddress));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "ConnectPeerConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.ConnectPeerConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ConnectPeerConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::ConnectPeer.ConnectPeerConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnConnectPeerConnectPeerConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectPeer_ConnectPeerConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BgpConfigurations: cdk.listMapper(cfnConnectPeerConnectPeerBgpConfigurationPropertyToCloudFormation)(properties.bgpConfigurations),
        CoreNetworkAddress: cdk.stringToCloudFormation(properties.coreNetworkAddress),
        InsideCidrBlocks: cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks),
        PeerAddress: cdk.stringToCloudFormation(properties.peerAddress),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnConnectPeerConnectPeerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectPeer.ConnectPeerConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectPeer.ConnectPeerConfigurationProperty>();
    ret.addPropertyResult('bgpConfigurations', 'BgpConfigurations', properties.BgpConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectPeerConnectPeerBgpConfigurationPropertyFromCloudFormation)(properties.BgpConfigurations) : undefined);
    ret.addPropertyResult('coreNetworkAddress', 'CoreNetworkAddress', properties.CoreNetworkAddress != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkAddress) : undefined);
    ret.addPropertyResult('insideCidrBlocks', 'InsideCidrBlocks', properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InsideCidrBlocks) : undefined);
    ret.addPropertyResult('peerAddress', 'PeerAddress', properties.PeerAddress != null ? cfn_parse.FromCloudFormation.getString(properties.PeerAddress) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnCoreNetworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnCoreNetworkProps`
 *
 * @returns the result of the validation.
 */
function CfnCoreNetworkPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateObject)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCoreNetworkProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork` resource
 *
 * @param properties - the TypeScript properties of a `CfnCoreNetworkProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork` resource.
 */
// @ts-ignore TS6133
function cfnCoreNetworkPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCoreNetworkPropsValidator(properties).assertSuccess();
    return {
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        Description: cdk.stringToCloudFormation(properties.description),
        PolicyDocument: cdk.objectToCloudFormation(properties.policyDocument),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCoreNetworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetworkProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetworkProps>();
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('policyDocument', 'PolicyDocument', properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnCoreNetwork extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::CoreNetwork";

    /**
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
        const ret = new CfnCoreNetwork(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    public readonly attrCoreNetworkArn: string;

    /**
     * The ID of the core network.
     * @cloudformationAttribute CoreNetworkId
     */
    public readonly attrCoreNetworkId: string;

    /**
     * The timestamp when the core network was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The edges.
     * @cloudformationAttribute Edges
     */
    public readonly attrEdges: cdk.IResolvable;

    /**
     *
     * @cloudformationAttribute OwnerAccount
     */
    public readonly attrOwnerAccount: string;

    /**
     * The segments.
     * @cloudformationAttribute Segments
     */
    public readonly attrSegments: cdk.IResolvable;

    /**
     * The current state of the core network. These states are: `CREATING` | `UPDATING` | `AVAILABLE` | `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The ID of the global network that your core network is a part of.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * The description of a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-description
     */
    public description: string | undefined;

    /**
     * Describes a core network policy. For more information, see [Core network policies](https://docs.aws.amazon.com/vpc/latest/cloudwan/cloudwan-policy-changesets.html) .
     *
     * If you update the policy document, CloudFormation will apply the core network change set generated from the updated policy document, and then set it as the LIVE policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-policydocument
     */
    public policyDocument: any | cdk.IResolvable | undefined;

    /**
     * The list of key-value tags associated with a core network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-corenetwork.html#cfn-networkmanager-corenetwork-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::CoreNetwork`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCoreNetworkProps) {
        super(scope, id, { type: CfnCoreNetwork.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'globalNetworkId', this);
        this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt('CoreNetworkArn', cdk.ResolutionTypeHint.STRING));
        this.attrCoreNetworkId = cdk.Token.asString(this.getAtt('CoreNetworkId', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEdges = this.getAtt('Edges', cdk.ResolutionTypeHint.STRING);
        this.attrOwnerAccount = cdk.Token.asString(this.getAtt('OwnerAccount', cdk.ResolutionTypeHint.STRING));
        this.attrSegments = this.getAtt('Segments', cdk.ResolutionTypeHint.STRING);
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));

        this.globalNetworkId = props.globalNetworkId;
        this.description = props.description;
        this.policyDocument = props.policyDocument;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::CoreNetwork", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCoreNetwork.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            globalNetworkId: this.globalNetworkId,
            description: this.description,
            policyDocument: this.policyDocument,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCoreNetworkPropsToCloudFormation(props);
    }
}

export namespace CfnCoreNetwork {
    /**
     * Describes a core network edge.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworkedge.html
     */
    export interface CoreNetworkEdgeProperty {
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

/**
 * Determine whether the given properties match those of a `CoreNetworkEdgeProperty`
 *
 * @param properties - the TypeScript properties of a `CoreNetworkEdgeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCoreNetwork_CoreNetworkEdgePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('asn', cdk.validateNumber)(properties.asn));
    errors.collect(cdk.propertyValidator('edgeLocation', cdk.validateString)(properties.edgeLocation));
    errors.collect(cdk.propertyValidator('insideCidrBlocks', cdk.listValidator(cdk.validateString))(properties.insideCidrBlocks));
    return errors.wrap('supplied properties not correct for "CoreNetworkEdgeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork.CoreNetworkEdge` resource
 *
 * @param properties - the TypeScript properties of a `CoreNetworkEdgeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork.CoreNetworkEdge` resource.
 */
// @ts-ignore TS6133
function cfnCoreNetworkCoreNetworkEdgePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCoreNetwork_CoreNetworkEdgePropertyValidator(properties).assertSuccess();
    return {
        Asn: cdk.numberToCloudFormation(properties.asn),
        EdgeLocation: cdk.stringToCloudFormation(properties.edgeLocation),
        InsideCidrBlocks: cdk.listMapper(cdk.stringToCloudFormation)(properties.insideCidrBlocks),
    };
}

// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkEdgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetwork.CoreNetworkEdgeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetwork.CoreNetworkEdgeProperty>();
    ret.addPropertyResult('asn', 'Asn', properties.Asn != null ? cfn_parse.FromCloudFormation.getNumber(properties.Asn) : undefined);
    ret.addPropertyResult('edgeLocation', 'EdgeLocation', properties.EdgeLocation != null ? cfn_parse.FromCloudFormation.getString(properties.EdgeLocation) : undefined);
    ret.addPropertyResult('insideCidrBlocks', 'InsideCidrBlocks', properties.InsideCidrBlocks != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InsideCidrBlocks) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCoreNetwork {
    /**
     * Describes a core network segment, which are dedicated routes. Only attachments within this segment can communicate with each other.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-corenetwork-corenetworksegment.html
     */
    export interface CoreNetworkSegmentProperty {
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
 * Determine whether the given properties match those of a `CoreNetworkSegmentProperty`
 *
 * @param properties - the TypeScript properties of a `CoreNetworkSegmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnCoreNetwork_CoreNetworkSegmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('edgeLocations', cdk.listValidator(cdk.validateString))(properties.edgeLocations));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('sharedSegments', cdk.listValidator(cdk.validateString))(properties.sharedSegments));
    return errors.wrap('supplied properties not correct for "CoreNetworkSegmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork.CoreNetworkSegment` resource
 *
 * @param properties - the TypeScript properties of a `CoreNetworkSegmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::CoreNetwork.CoreNetworkSegment` resource.
 */
// @ts-ignore TS6133
function cfnCoreNetworkCoreNetworkSegmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCoreNetwork_CoreNetworkSegmentPropertyValidator(properties).assertSuccess();
    return {
        EdgeLocations: cdk.listMapper(cdk.stringToCloudFormation)(properties.edgeLocations),
        Name: cdk.stringToCloudFormation(properties.name),
        SharedSegments: cdk.listMapper(cdk.stringToCloudFormation)(properties.sharedSegments),
    };
}

// @ts-ignore TS6133
function CfnCoreNetworkCoreNetworkSegmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCoreNetwork.CoreNetworkSegmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCoreNetwork.CoreNetworkSegmentProperty>();
    ret.addPropertyResult('edgeLocations', 'EdgeLocations', properties.EdgeLocations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EdgeLocations) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('sharedSegments', 'SharedSegments', properties.SharedSegments != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SharedSegments) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnCustomerGatewayAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomerGatewayAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnCustomerGatewayAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customerGatewayArn', cdk.requiredValidator)(properties.customerGatewayArn));
    errors.collect(cdk.propertyValidator('customerGatewayArn', cdk.validateString)(properties.customerGatewayArn));
    errors.collect(cdk.propertyValidator('deviceId', cdk.requiredValidator)(properties.deviceId));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('linkId', cdk.validateString)(properties.linkId));
    return errors.wrap('supplied properties not correct for "CfnCustomerGatewayAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::CustomerGatewayAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnCustomerGatewayAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::CustomerGatewayAssociation` resource.
 */
// @ts-ignore TS6133
function cfnCustomerGatewayAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCustomerGatewayAssociationPropsValidator(properties).assertSuccess();
    return {
        CustomerGatewayArn: cdk.stringToCloudFormation(properties.customerGatewayArn),
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        LinkId: cdk.stringToCloudFormation(properties.linkId),
    };
}

// @ts-ignore TS6133
function CfnCustomerGatewayAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomerGatewayAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomerGatewayAssociationProps>();
    ret.addPropertyResult('customerGatewayArn', 'CustomerGatewayArn', cfn_parse.FromCloudFormation.getString(properties.CustomerGatewayArn));
    ret.addPropertyResult('deviceId', 'DeviceId', cfn_parse.FromCloudFormation.getString(properties.DeviceId));
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('linkId', 'LinkId', properties.LinkId != null ? cfn_parse.FromCloudFormation.getString(properties.LinkId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnCustomerGatewayAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::CustomerGatewayAssociation";

    /**
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
        const ret = new CfnCustomerGatewayAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-customergatewayarn
     */
    public customerGatewayArn: string;

    /**
     * The ID of the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-deviceid
     */
    public deviceId: string;

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-customergatewayassociation.html#cfn-networkmanager-customergatewayassociation-linkid
     */
    public linkId: string | undefined;

    /**
     * Create a new `AWS::NetworkManager::CustomerGatewayAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomerGatewayAssociationProps) {
        super(scope, id, { type: CfnCustomerGatewayAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'customerGatewayArn', this);
        cdk.requireProperty(props, 'deviceId', this);
        cdk.requireProperty(props, 'globalNetworkId', this);

        this.customerGatewayArn = props.customerGatewayArn;
        this.deviceId = props.deviceId;
        this.globalNetworkId = props.globalNetworkId;
        this.linkId = props.linkId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomerGatewayAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            customerGatewayArn: this.customerGatewayArn,
            deviceId: this.deviceId,
            globalNetworkId: this.globalNetworkId,
            linkId: this.linkId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCustomerGatewayAssociationPropsToCloudFormation(props);
    }
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
 * Determine whether the given properties match those of a `CfnDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the result of the validation.
 */
function CfnDevicePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('location', CfnDevice_LocationPropertyValidator)(properties.location));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('serialNumber', cdk.validateString)(properties.serialNumber));
    errors.collect(cdk.propertyValidator('siteId', cdk.validateString)(properties.siteId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('vendor', cdk.validateString)(properties.vendor));
    return errors.wrap('supplied properties not correct for "CfnDeviceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Device` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Device` resource.
 */
// @ts-ignore TS6133
function cfnDevicePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDevicePropsValidator(properties).assertSuccess();
    return {
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        Description: cdk.stringToCloudFormation(properties.description),
        Location: cfnDeviceLocationPropertyToCloudFormation(properties.location),
        Model: cdk.stringToCloudFormation(properties.model),
        SerialNumber: cdk.stringToCloudFormation(properties.serialNumber),
        SiteId: cdk.stringToCloudFormation(properties.siteId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
        Vendor: cdk.stringToCloudFormation(properties.vendor),
    };
}

// @ts-ignore TS6133
function CfnDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProps>();
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('location', 'Location', properties.Location != null ? CfnDeviceLocationPropertyFromCloudFormation(properties.Location) : undefined);
    ret.addPropertyResult('model', 'Model', properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined);
    ret.addPropertyResult('serialNumber', 'SerialNumber', properties.SerialNumber != null ? cfn_parse.FromCloudFormation.getString(properties.SerialNumber) : undefined);
    ret.addPropertyResult('siteId', 'SiteId', properties.SiteId != null ? cfn_parse.FromCloudFormation.getString(properties.SiteId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('vendor', 'Vendor', properties.Vendor != null ? cfn_parse.FromCloudFormation.getString(properties.Vendor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnDevice extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Device";

    /**
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
        const ret = new CfnDevice(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the device. For example, `arn:aws:networkmanager::123456789012:device/global-network-01231231231231231/device-07f6fd08867abc123` .
     * @cloudformationAttribute DeviceArn
     */
    public readonly attrDeviceArn: string;

    /**
     * The ID of the device. For example, `device-07f6fd08867abc123` .
     * @cloudformationAttribute DeviceId
     */
    public readonly attrDeviceId: string;

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * A description of the device.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-description
     */
    public description: string | undefined;

    /**
     * The site location.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-location
     */
    public location: CfnDevice.LocationProperty | cdk.IResolvable | undefined;

    /**
     * The model of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-model
     */
    public model: string | undefined;

    /**
     * The serial number of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-serialnumber
     */
    public serialNumber: string | undefined;

    /**
     * The site ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-siteid
     */
    public siteId: string | undefined;

    /**
     * The tags for the device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-type
     */
    public type: string | undefined;

    /**
     * The vendor of the device.
     *
     * Constraints: Maximum length of 128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-device.html#cfn-networkmanager-device-vendor
     */
    public vendor: string | undefined;

    /**
     * Create a new `AWS::NetworkManager::Device`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeviceProps) {
        super(scope, id, { type: CfnDevice.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'globalNetworkId', this);
        this.attrDeviceArn = cdk.Token.asString(this.getAtt('DeviceArn', cdk.ResolutionTypeHint.STRING));
        this.attrDeviceId = cdk.Token.asString(this.getAtt('DeviceId', cdk.ResolutionTypeHint.STRING));

        this.globalNetworkId = props.globalNetworkId;
        this.description = props.description;
        this.location = props.location;
        this.model = props.model;
        this.serialNumber = props.serialNumber;
        this.siteId = props.siteId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Device", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
        this.vendor = props.vendor;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevice.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            globalNetworkId: this.globalNetworkId,
            description: this.description,
            location: this.location,
            model: this.model,
            serialNumber: this.serialNumber,
            siteId: this.siteId,
            tags: this.tags.renderTags(),
            type: this.type,
            vendor: this.vendor,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDevicePropsToCloudFormation(props);
    }
}

export namespace CfnDevice {
    /**
     * Describes a location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-device-location.html
     */
    export interface LocationProperty {
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
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDevice_LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', cdk.validateString)(properties.address));
    errors.collect(cdk.propertyValidator('latitude', cdk.validateString)(properties.latitude));
    errors.collect(cdk.propertyValidator('longitude', cdk.validateString)(properties.longitude));
    return errors.wrap('supplied properties not correct for "LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Device.Location` resource
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Device.Location` resource.
 */
// @ts-ignore TS6133
function cfnDeviceLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDevice_LocationPropertyValidator(properties).assertSuccess();
    return {
        Address: cdk.stringToCloudFormation(properties.address),
        Latitude: cdk.stringToCloudFormation(properties.latitude),
        Longitude: cdk.stringToCloudFormation(properties.longitude),
    };
}

// @ts-ignore TS6133
function CfnDeviceLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDevice.LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevice.LocationProperty>();
    ret.addPropertyResult('address', 'Address', properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined);
    ret.addPropertyResult('latitude', 'Latitude', properties.Latitude != null ? cfn_parse.FromCloudFormation.getString(properties.Latitude) : undefined);
    ret.addPropertyResult('longitude', 'Longitude', properties.Longitude != null ? cfn_parse.FromCloudFormation.getString(properties.Longitude) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnGlobalNetworkProps`
 *
 * @param properties - the TypeScript properties of a `CfnGlobalNetworkProps`
 *
 * @returns the result of the validation.
 */
function CfnGlobalNetworkPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnGlobalNetworkProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::GlobalNetwork` resource
 *
 * @param properties - the TypeScript properties of a `CfnGlobalNetworkProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::GlobalNetwork` resource.
 */
// @ts-ignore TS6133
function cfnGlobalNetworkPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGlobalNetworkPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGlobalNetworkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGlobalNetworkProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGlobalNetworkProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnGlobalNetwork extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::GlobalNetwork";

    /**
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
        const ret = new CfnGlobalNetwork(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the global network. For example, `arn:aws:networkmanager::123456789012:global-network/global-network-01231231231231231` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the global network. For example, `global-network-01231231231231231` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * A description of the global network.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-description
     */
    public description: string | undefined;

    /**
     * The tags for the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-globalnetwork.html#cfn-networkmanager-globalnetwork-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::GlobalNetwork`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGlobalNetworkProps = {}) {
        super(scope, id, { type: CfnGlobalNetwork.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::GlobalNetwork", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGlobalNetwork.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGlobalNetworkPropsToCloudFormation(props);
    }
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
 * Determine whether the given properties match those of a `CfnLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnLinkProps`
 *
 * @returns the result of the validation.
 */
function CfnLinkPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidth', cdk.requiredValidator)(properties.bandwidth));
    errors.collect(cdk.propertyValidator('bandwidth', CfnLink_BandwidthPropertyValidator)(properties.bandwidth));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('provider', cdk.validateString)(properties.provider));
    errors.collect(cdk.propertyValidator('siteId', cdk.requiredValidator)(properties.siteId));
    errors.collect(cdk.propertyValidator('siteId', cdk.validateString)(properties.siteId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnLinkProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Link` resource
 *
 * @param properties - the TypeScript properties of a `CfnLinkProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Link` resource.
 */
// @ts-ignore TS6133
function cfnLinkPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLinkPropsValidator(properties).assertSuccess();
    return {
        Bandwidth: cfnLinkBandwidthPropertyToCloudFormation(properties.bandwidth),
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        SiteId: cdk.stringToCloudFormation(properties.siteId),
        Description: cdk.stringToCloudFormation(properties.description),
        Provider: cdk.stringToCloudFormation(properties.provider),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLinkProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLinkProps>();
    ret.addPropertyResult('bandwidth', 'Bandwidth', CfnLinkBandwidthPropertyFromCloudFormation(properties.Bandwidth));
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('siteId', 'SiteId', cfn_parse.FromCloudFormation.getString(properties.SiteId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('provider', 'Provider', properties.Provider != null ? cfn_parse.FromCloudFormation.getString(properties.Provider) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnLink extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Link";

    /**
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
        const ret = new CfnLink(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the link. For example, `arn:aws:networkmanager::123456789012:link/global-network-01231231231231231/link-11112222aaaabbbb1` .
     * @cloudformationAttribute LinkArn
     */
    public readonly attrLinkArn: string;

    /**
     * The ID of the link. For example, `link-11112222aaaabbbb1` .
     * @cloudformationAttribute LinkId
     */
    public readonly attrLinkId: string;

    /**
     * The bandwidth for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-bandwidth
     */
    public bandwidth: CfnLink.BandwidthProperty | cdk.IResolvable;

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * The ID of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-siteid
     */
    public siteId: string;

    /**
     * A description of the link.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-description
     */
    public description: string | undefined;

    /**
     * The provider of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-provider
     */
    public provider: string | undefined;

    /**
     * The tags for the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of the link.
     *
     * Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-link.html#cfn-networkmanager-link-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::NetworkManager::Link`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLinkProps) {
        super(scope, id, { type: CfnLink.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bandwidth', this);
        cdk.requireProperty(props, 'globalNetworkId', this);
        cdk.requireProperty(props, 'siteId', this);
        this.attrLinkArn = cdk.Token.asString(this.getAtt('LinkArn', cdk.ResolutionTypeHint.STRING));
        this.attrLinkId = cdk.Token.asString(this.getAtt('LinkId', cdk.ResolutionTypeHint.STRING));

        this.bandwidth = props.bandwidth;
        this.globalNetworkId = props.globalNetworkId;
        this.siteId = props.siteId;
        this.description = props.description;
        this.provider = props.provider;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Link", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLink.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bandwidth: this.bandwidth,
            globalNetworkId: this.globalNetworkId,
            siteId: this.siteId,
            description: this.description,
            provider: this.provider,
            tags: this.tags.renderTags(),
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLinkPropsToCloudFormation(props);
    }
}

export namespace CfnLink {
    /**
     * Describes bandwidth information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-link-bandwidth.html
     */
    export interface BandwidthProperty {
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
 * Determine whether the given properties match those of a `BandwidthProperty`
 *
 * @param properties - the TypeScript properties of a `BandwidthProperty`
 *
 * @returns the result of the validation.
 */
function CfnLink_BandwidthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('downloadSpeed', cdk.validateNumber)(properties.downloadSpeed));
    errors.collect(cdk.propertyValidator('uploadSpeed', cdk.validateNumber)(properties.uploadSpeed));
    return errors.wrap('supplied properties not correct for "BandwidthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Link.Bandwidth` resource
 *
 * @param properties - the TypeScript properties of a `BandwidthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Link.Bandwidth` resource.
 */
// @ts-ignore TS6133
function cfnLinkBandwidthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLink_BandwidthPropertyValidator(properties).assertSuccess();
    return {
        DownloadSpeed: cdk.numberToCloudFormation(properties.downloadSpeed),
        UploadSpeed: cdk.numberToCloudFormation(properties.uploadSpeed),
    };
}

// @ts-ignore TS6133
function CfnLinkBandwidthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLink.BandwidthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLink.BandwidthProperty>();
    ret.addPropertyResult('downloadSpeed', 'DownloadSpeed', properties.DownloadSpeed != null ? cfn_parse.FromCloudFormation.getNumber(properties.DownloadSpeed) : undefined);
    ret.addPropertyResult('uploadSpeed', 'UploadSpeed', properties.UploadSpeed != null ? cfn_parse.FromCloudFormation.getNumber(properties.UploadSpeed) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnLinkAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLinkAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnLinkAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceId', cdk.requiredValidator)(properties.deviceId));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('linkId', cdk.requiredValidator)(properties.linkId));
    errors.collect(cdk.propertyValidator('linkId', cdk.validateString)(properties.linkId));
    return errors.wrap('supplied properties not correct for "CfnLinkAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::LinkAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnLinkAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::LinkAssociation` resource.
 */
// @ts-ignore TS6133
function cfnLinkAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLinkAssociationPropsValidator(properties).assertSuccess();
    return {
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        LinkId: cdk.stringToCloudFormation(properties.linkId),
    };
}

// @ts-ignore TS6133
function CfnLinkAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLinkAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLinkAssociationProps>();
    ret.addPropertyResult('deviceId', 'DeviceId', cfn_parse.FromCloudFormation.getString(properties.DeviceId));
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('linkId', 'LinkId', cfn_parse.FromCloudFormation.getString(properties.LinkId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnLinkAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::LinkAssociation";

    /**
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
        const ret = new CfnLinkAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The device ID for the link association.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-deviceid
     */
    public deviceId: string;

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * The ID of the link.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-linkassociation.html#cfn-networkmanager-linkassociation-linkid
     */
    public linkId: string;

    /**
     * Create a new `AWS::NetworkManager::LinkAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLinkAssociationProps) {
        super(scope, id, { type: CfnLinkAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'deviceId', this);
        cdk.requireProperty(props, 'globalNetworkId', this);
        cdk.requireProperty(props, 'linkId', this);

        this.deviceId = props.deviceId;
        this.globalNetworkId = props.globalNetworkId;
        this.linkId = props.linkId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLinkAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            deviceId: this.deviceId,
            globalNetworkId: this.globalNetworkId,
            linkId: this.linkId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLinkAssociationPropsToCloudFormation(props);
    }
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
 * Determine whether the given properties match those of a `CfnSiteProps`
 *
 * @param properties - the TypeScript properties of a `CfnSiteProps`
 *
 * @returns the result of the validation.
 */
function CfnSitePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('location', CfnSite_LocationPropertyValidator)(properties.location));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSiteProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Site` resource
 *
 * @param properties - the TypeScript properties of a `CfnSiteProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Site` resource.
 */
// @ts-ignore TS6133
function cfnSitePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSitePropsValidator(properties).assertSuccess();
    return {
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        Description: cdk.stringToCloudFormation(properties.description),
        Location: cfnSiteLocationPropertyToCloudFormation(properties.location),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSitePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSiteProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteProps>();
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('location', 'Location', properties.Location != null ? CfnSiteLocationPropertyFromCloudFormation(properties.Location) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnSite extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::Site";

    /**
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
        const ret = new CfnSite(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the site. For example, `arn:aws:networkmanager::123456789012:site/global-network-01231231231231231/site-444555aaabbb11223` .
     * @cloudformationAttribute SiteArn
     */
    public readonly attrSiteArn: string;

    /**
     * The ID of the site. For example, `site-444555aaabbb11223` .
     * @cloudformationAttribute SiteId
     */
    public readonly attrSiteId: string;

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * A description of your site.
     *
     * Constraints: Maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-description
     */
    public description: string | undefined;

    /**
     * The site location. This information is used for visualization in the Network Manager console. If you specify the address, the latitude and longitude are automatically calculated.
     *
     * - `Address` : The physical address of the site.
     * - `Latitude` : The latitude of the site.
     * - `Longitude` : The longitude of the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-location
     */
    public location: CfnSite.LocationProperty | cdk.IResolvable | undefined;

    /**
     * The tags for the site.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-site.html#cfn-networkmanager-site-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::Site`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSiteProps) {
        super(scope, id, { type: CfnSite.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'globalNetworkId', this);
        this.attrSiteArn = cdk.Token.asString(this.getAtt('SiteArn', cdk.ResolutionTypeHint.STRING));
        this.attrSiteId = cdk.Token.asString(this.getAtt('SiteId', cdk.ResolutionTypeHint.STRING));

        this.globalNetworkId = props.globalNetworkId;
        this.description = props.description;
        this.location = props.location;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::Site", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSite.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            globalNetworkId: this.globalNetworkId,
            description: this.description,
            location: this.location,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSitePropsToCloudFormation(props);
    }
}

export namespace CfnSite {
    /**
     * Describes a location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-site-location.html
     */
    export interface LocationProperty {
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
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSite_LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', cdk.validateString)(properties.address));
    errors.collect(cdk.propertyValidator('latitude', cdk.validateString)(properties.latitude));
    errors.collect(cdk.propertyValidator('longitude', cdk.validateString)(properties.longitude));
    return errors.wrap('supplied properties not correct for "LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::Site.Location` resource
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::Site.Location` resource.
 */
// @ts-ignore TS6133
function cfnSiteLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSite_LocationPropertyValidator(properties).assertSuccess();
    return {
        Address: cdk.stringToCloudFormation(properties.address),
        Latitude: cdk.stringToCloudFormation(properties.latitude),
        Longitude: cdk.stringToCloudFormation(properties.longitude),
    };
}

// @ts-ignore TS6133
function CfnSiteLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSite.LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSite.LocationProperty>();
    ret.addPropertyResult('address', 'Address', properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined);
    ret.addPropertyResult('latitude', 'Latitude', properties.Latitude != null ? cfn_parse.FromCloudFormation.getString(properties.Latitude) : undefined);
    ret.addPropertyResult('longitude', 'Longitude', properties.Longitude != null ? cfn_parse.FromCloudFormation.getString(properties.Longitude) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnSiteToSiteVpnAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSiteToSiteVpnAttachmentProps`
 *
 * @returns the result of the validation.
 */
function CfnSiteToSiteVpnAttachmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coreNetworkId', cdk.validateString)(properties.coreNetworkId));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpnConnectionArn', cdk.validateString)(properties.vpnConnectionArn));
    return errors.wrap('supplied properties not correct for "CfnSiteToSiteVpnAttachmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::SiteToSiteVpnAttachment` resource
 *
 * @param properties - the TypeScript properties of a `CfnSiteToSiteVpnAttachmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::SiteToSiteVpnAttachment` resource.
 */
// @ts-ignore TS6133
function cfnSiteToSiteVpnAttachmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSiteToSiteVpnAttachmentPropsValidator(properties).assertSuccess();
    return {
        CoreNetworkId: cdk.stringToCloudFormation(properties.coreNetworkId),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        VpnConnectionArn: cdk.stringToCloudFormation(properties.vpnConnectionArn),
    };
}

// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSiteToSiteVpnAttachmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteToSiteVpnAttachmentProps>();
    ret.addPropertyResult('coreNetworkId', 'CoreNetworkId', properties.CoreNetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpnConnectionArn', 'VpnConnectionArn', properties.VpnConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.VpnConnectionArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnSiteToSiteVpnAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::SiteToSiteVpnAttachment";

    /**
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
        const ret = new CfnSiteToSiteVpnAttachment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the site-to-site VPN attachment.
     * @cloudformationAttribute AttachmentId
     */
    public readonly attrAttachmentId: string;

    /**
     * The policy rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    public readonly attrAttachmentPolicyRuleNumber: number;

    /**
     * The type of attachment. This will be `SITE_TO_SITE_VPN` .
     * @cloudformationAttribute AttachmentType
     */
    public readonly attrAttachmentType: string;

    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    public readonly attrCoreNetworkArn: string;

    /**
     * The timestamp when the site-to-site VPN attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The Region where the core network edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    public readonly attrEdgeLocation: string;

    /**
     * The ID of the site-to-site VPN attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    public readonly attrOwnerAccountId: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    public readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    public readonly attrProposedSegmentChangeSegmentName: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    public readonly attrProposedSegmentChangeTags: cdk.IResolvable;

    /**
     * The resource ARN for the site-to-site VPN attachment.
     * @cloudformationAttribute ResourceArn
     */
    public readonly attrResourceArn: string;

    /**
     * The name of the site-to-site VPN attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    public readonly attrSegmentName: string;

    /**
     * The state of the site-to-site VPN attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The timestamp when the site-to-site VPN attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    public readonly attrUpdatedAt: string;

    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.CoreNetworkId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-corenetworkid
     */
    public coreNetworkId: string | undefined;

    /**
     * `AWS::NetworkManager::SiteToSiteVpnAttachment.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ARN of the site-to-site VPN attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-sitetositevpnattachment.html#cfn-networkmanager-sitetositevpnattachment-vpnconnectionarn
     */
    public vpnConnectionArn: string | undefined;

    /**
     * Create a new `AWS::NetworkManager::SiteToSiteVpnAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSiteToSiteVpnAttachmentProps = {}) {
        super(scope, id, { type: CfnSiteToSiteVpnAttachment.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrAttachmentId = cdk.Token.asString(this.getAtt('AttachmentId', cdk.ResolutionTypeHint.STRING));
        this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrAttachmentType = cdk.Token.asString(this.getAtt('AttachmentType', cdk.ResolutionTypeHint.STRING));
        this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt('CoreNetworkArn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEdgeLocation = cdk.Token.asString(this.getAtt('EdgeLocation', cdk.ResolutionTypeHint.STRING));
        this.attrOwnerAccountId = cdk.Token.asString(this.getAtt('OwnerAccountId', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('ProposedSegmentChange.AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrProposedSegmentChangeSegmentName = cdk.Token.asString(this.getAtt('ProposedSegmentChange.SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeTags = this.getAtt('ProposedSegmentChange.Tags', cdk.ResolutionTypeHint.STRING);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrSegmentName = cdk.Token.asString(this.getAtt('SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdatedAt = cdk.Token.asString(this.getAtt('UpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.coreNetworkId = props.coreNetworkId;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::SiteToSiteVpnAttachment", props.tags, { tagPropertyName: 'tags' });
        this.vpnConnectionArn = props.vpnConnectionArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSiteToSiteVpnAttachment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            coreNetworkId: this.coreNetworkId,
            tags: this.tags.renderTags(),
            vpnConnectionArn: this.vpnConnectionArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSiteToSiteVpnAttachmentPropsToCloudFormation(props);
    }
}

export namespace CfnSiteToSiteVpnAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-sitetositevpnattachment-proposedsegmentchange.html
     */
    export interface ProposedSegmentChangeProperty {
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
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnSiteToSiteVpnAttachment_ProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachmentPolicyRuleNumber', cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
    errors.collect(cdk.propertyValidator('segmentName', cdk.validateString)(properties.segmentName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "ProposedSegmentChangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::SiteToSiteVpnAttachment.ProposedSegmentChange` resource
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::SiteToSiteVpnAttachment.ProposedSegmentChange` resource.
 */
// @ts-ignore TS6133
function cfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSiteToSiteVpnAttachment_ProposedSegmentChangePropertyValidator(properties).assertSuccess();
    return {
        AttachmentPolicyRuleNumber: cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
        SegmentName: cdk.stringToCloudFormation(properties.segmentName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSiteToSiteVpnAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSiteToSiteVpnAttachment.ProposedSegmentChangeProperty>();
    ret.addPropertyResult('attachmentPolicyRuleNumber', 'AttachmentPolicyRuleNumber', properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined);
    ret.addPropertyResult('segmentName', 'SegmentName', properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnTransitGatewayRegistrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTransitGatewayRegistrationProps`
 *
 * @returns the result of the validation.
 */
function CfnTransitGatewayRegistrationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.requiredValidator)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('globalNetworkId', cdk.validateString)(properties.globalNetworkId));
    errors.collect(cdk.propertyValidator('transitGatewayArn', cdk.requiredValidator)(properties.transitGatewayArn));
    errors.collect(cdk.propertyValidator('transitGatewayArn', cdk.validateString)(properties.transitGatewayArn));
    return errors.wrap('supplied properties not correct for "CfnTransitGatewayRegistrationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::TransitGatewayRegistration` resource
 *
 * @param properties - the TypeScript properties of a `CfnTransitGatewayRegistrationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::TransitGatewayRegistration` resource.
 */
// @ts-ignore TS6133
function cfnTransitGatewayRegistrationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTransitGatewayRegistrationPropsValidator(properties).assertSuccess();
    return {
        GlobalNetworkId: cdk.stringToCloudFormation(properties.globalNetworkId),
        TransitGatewayArn: cdk.stringToCloudFormation(properties.transitGatewayArn),
    };
}

// @ts-ignore TS6133
function CfnTransitGatewayRegistrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransitGatewayRegistrationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransitGatewayRegistrationProps>();
    ret.addPropertyResult('globalNetworkId', 'GlobalNetworkId', cfn_parse.FromCloudFormation.getString(properties.GlobalNetworkId));
    ret.addPropertyResult('transitGatewayArn', 'TransitGatewayArn', cfn_parse.FromCloudFormation.getString(properties.TransitGatewayArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnTransitGatewayRegistration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::TransitGatewayRegistration";

    /**
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
        const ret = new CfnTransitGatewayRegistration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the global network.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-globalnetworkid
     */
    public globalNetworkId: string;

    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-transitgatewayregistration.html#cfn-networkmanager-transitgatewayregistration-transitgatewayarn
     */
    public transitGatewayArn: string;

    /**
     * Create a new `AWS::NetworkManager::TransitGatewayRegistration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTransitGatewayRegistrationProps) {
        super(scope, id, { type: CfnTransitGatewayRegistration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'globalNetworkId', this);
        cdk.requireProperty(props, 'transitGatewayArn', this);

        this.globalNetworkId = props.globalNetworkId;
        this.transitGatewayArn = props.transitGatewayArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTransitGatewayRegistration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            globalNetworkId: this.globalNetworkId,
            transitGatewayArn: this.transitGatewayArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTransitGatewayRegistrationPropsToCloudFormation(props);
    }
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
 * Determine whether the given properties match those of a `CfnVpcAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcAttachmentProps`
 *
 * @returns the result of the validation.
 */
function CfnVpcAttachmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coreNetworkId', cdk.requiredValidator)(properties.coreNetworkId));
    errors.collect(cdk.propertyValidator('coreNetworkId', cdk.validateString)(properties.coreNetworkId));
    errors.collect(cdk.propertyValidator('options', CfnVpcAttachment_VpcOptionsPropertyValidator)(properties.options));
    errors.collect(cdk.propertyValidator('subnetArns', cdk.requiredValidator)(properties.subnetArns));
    errors.collect(cdk.propertyValidator('subnetArns', cdk.listValidator(cdk.validateString))(properties.subnetArns));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('vpcArn', cdk.requiredValidator)(properties.vpcArn));
    errors.collect(cdk.propertyValidator('vpcArn', cdk.validateString)(properties.vpcArn));
    return errors.wrap('supplied properties not correct for "CfnVpcAttachmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment` resource
 *
 * @param properties - the TypeScript properties of a `CfnVpcAttachmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment` resource.
 */
// @ts-ignore TS6133
function cfnVpcAttachmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVpcAttachmentPropsValidator(properties).assertSuccess();
    return {
        CoreNetworkId: cdk.stringToCloudFormation(properties.coreNetworkId),
        SubnetArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetArns),
        VpcArn: cdk.stringToCloudFormation(properties.vpcArn),
        Options: cfnVpcAttachmentVpcOptionsPropertyToCloudFormation(properties.options),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnVpcAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcAttachmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachmentProps>();
    ret.addPropertyResult('coreNetworkId', 'CoreNetworkId', cfn_parse.FromCloudFormation.getString(properties.CoreNetworkId));
    ret.addPropertyResult('subnetArns', 'SubnetArns', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetArns));
    ret.addPropertyResult('vpcArn', 'VpcArn', cfn_parse.FromCloudFormation.getString(properties.VpcArn));
    ret.addPropertyResult('options', 'Options', properties.Options != null ? CfnVpcAttachmentVpcOptionsPropertyFromCloudFormation(properties.Options) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnVpcAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NetworkManager::VpcAttachment";

    /**
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
        const ret = new CfnVpcAttachment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the VPC attachment.
     * @cloudformationAttribute AttachmentId
     */
    public readonly attrAttachmentId: string;

    /**
     * The policy rule number associated with the attachment.
     * @cloudformationAttribute AttachmentPolicyRuleNumber
     */
    public readonly attrAttachmentPolicyRuleNumber: number;

    /**
     * The type of attachment. This will be `VPC` .
     * @cloudformationAttribute AttachmentType
     */
    public readonly attrAttachmentType: string;

    /**
     * The ARN of the core network.
     * @cloudformationAttribute CoreNetworkArn
     */
    public readonly attrCoreNetworkArn: string;

    /**
     * The timestamp when the VPC attachment was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The Region where the core network edge is located.
     * @cloudformationAttribute EdgeLocation
     */
    public readonly attrEdgeLocation: string;

    /**
     * The ID of the VPC attachment owner.
     * @cloudformationAttribute OwnerAccountId
     */
    public readonly attrOwnerAccountId: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.AttachmentPolicyRuleNumber
     */
    public readonly attrProposedSegmentChangeAttachmentPolicyRuleNumber: number;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.SegmentName
     */
    public readonly attrProposedSegmentChangeSegmentName: string;

    /**
     *
     * @cloudformationAttribute ProposedSegmentChange.Tags
     */
    public readonly attrProposedSegmentChangeTags: cdk.IResolvable;

    /**
     * The resource ARN for the VPC attachment.
     * @cloudformationAttribute ResourceArn
     */
    public readonly attrResourceArn: string;

    /**
     * The name of the attachment's segment.
     * @cloudformationAttribute SegmentName
     */
    public readonly attrSegmentName: string;

    /**
     * The state of the attachment. This can be: `REJECTED` | `PENDING_ATTACHMENT_ACCEPTANCE` | `CREATING` | `FAILED` | `AVAILABLE` | `UPDATING` | `PENDING_NETWORK_UPDATE` | `PENDING_TAG_ACCEPTANCE` | `DELETING` .
     * @cloudformationAttribute State
     */
    public readonly attrState: string;

    /**
     * The timestamp when the VPC attachment was last updated.
     * @cloudformationAttribute UpdatedAt
     */
    public readonly attrUpdatedAt: string;

    /**
     * The core network ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-corenetworkid
     */
    public coreNetworkId: string;

    /**
     * The subnet ARNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-subnetarns
     */
    public subnetArns: string[];

    /**
     * The ARN of the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-vpcarn
     */
    public vpcArn: string;

    /**
     * Options for creating the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-options
     */
    public options: CfnVpcAttachment.VpcOptionsProperty | cdk.IResolvable | undefined;

    /**
     * The tags associated with the VPC attachment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-networkmanager-vpcattachment.html#cfn-networkmanager-vpcattachment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NetworkManager::VpcAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVpcAttachmentProps) {
        super(scope, id, { type: CfnVpcAttachment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'coreNetworkId', this);
        cdk.requireProperty(props, 'subnetArns', this);
        cdk.requireProperty(props, 'vpcArn', this);
        this.attrAttachmentId = cdk.Token.asString(this.getAtt('AttachmentId', cdk.ResolutionTypeHint.STRING));
        this.attrAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrAttachmentType = cdk.Token.asString(this.getAtt('AttachmentType', cdk.ResolutionTypeHint.STRING));
        this.attrCoreNetworkArn = cdk.Token.asString(this.getAtt('CoreNetworkArn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEdgeLocation = cdk.Token.asString(this.getAtt('EdgeLocation', cdk.ResolutionTypeHint.STRING));
        this.attrOwnerAccountId = cdk.Token.asString(this.getAtt('OwnerAccountId', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeAttachmentPolicyRuleNumber = cdk.Token.asNumber(this.getAtt('ProposedSegmentChange.AttachmentPolicyRuleNumber', cdk.ResolutionTypeHint.NUMBER));
        this.attrProposedSegmentChangeSegmentName = cdk.Token.asString(this.getAtt('ProposedSegmentChange.SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrProposedSegmentChangeTags = this.getAtt('ProposedSegmentChange.Tags', cdk.ResolutionTypeHint.STRING);
        this.attrResourceArn = cdk.Token.asString(this.getAtt('ResourceArn', cdk.ResolutionTypeHint.STRING));
        this.attrSegmentName = cdk.Token.asString(this.getAtt('SegmentName', cdk.ResolutionTypeHint.STRING));
        this.attrState = cdk.Token.asString(this.getAtt('State', cdk.ResolutionTypeHint.STRING));
        this.attrUpdatedAt = cdk.Token.asString(this.getAtt('UpdatedAt', cdk.ResolutionTypeHint.STRING));

        this.coreNetworkId = props.coreNetworkId;
        this.subnetArns = props.subnetArns;
        this.vpcArn = props.vpcArn;
        this.options = props.options;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::NetworkManager::VpcAttachment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcAttachment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            coreNetworkId: this.coreNetworkId,
            subnetArns: this.subnetArns,
            vpcArn: this.vpcArn,
            options: this.options,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVpcAttachmentPropsToCloudFormation(props);
    }
}

export namespace CfnVpcAttachment {
    /**
     * Describes a proposed segment change. In some cases, the segment change must first be evaluated and accepted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-proposedsegmentchange.html
     */
    export interface ProposedSegmentChangeProperty {
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

/**
 * Determine whether the given properties match those of a `ProposedSegmentChangeProperty`
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the result of the validation.
 */
function CfnVpcAttachment_ProposedSegmentChangePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attachmentPolicyRuleNumber', cdk.validateNumber)(properties.attachmentPolicyRuleNumber));
    errors.collect(cdk.propertyValidator('segmentName', cdk.validateString)(properties.segmentName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "ProposedSegmentChangeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment.ProposedSegmentChange` resource
 *
 * @param properties - the TypeScript properties of a `ProposedSegmentChangeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment.ProposedSegmentChange` resource.
 */
// @ts-ignore TS6133
function cfnVpcAttachmentProposedSegmentChangePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVpcAttachment_ProposedSegmentChangePropertyValidator(properties).assertSuccess();
    return {
        AttachmentPolicyRuleNumber: cdk.numberToCloudFormation(properties.attachmentPolicyRuleNumber),
        SegmentName: cdk.stringToCloudFormation(properties.segmentName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnVpcAttachmentProposedSegmentChangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcAttachment.ProposedSegmentChangeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachment.ProposedSegmentChangeProperty>();
    ret.addPropertyResult('attachmentPolicyRuleNumber', 'AttachmentPolicyRuleNumber', properties.AttachmentPolicyRuleNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttachmentPolicyRuleNumber) : undefined);
    ret.addPropertyResult('segmentName', 'SegmentName', properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnVpcAttachment {
    /**
     * Describes the VPC options.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-networkmanager-vpcattachment-vpcoptions.html
     */
    export interface VpcOptionsProperty {
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

/**
 * Determine whether the given properties match those of a `VpcOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnVpcAttachment_VpcOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applianceModeSupport', cdk.validateBoolean)(properties.applianceModeSupport));
    errors.collect(cdk.propertyValidator('ipv6Support', cdk.validateBoolean)(properties.ipv6Support));
    return errors.wrap('supplied properties not correct for "VpcOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment.VpcOptions` resource
 *
 * @param properties - the TypeScript properties of a `VpcOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NetworkManager::VpcAttachment.VpcOptions` resource.
 */
// @ts-ignore TS6133
function cfnVpcAttachmentVpcOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVpcAttachment_VpcOptionsPropertyValidator(properties).assertSuccess();
    return {
        ApplianceModeSupport: cdk.booleanToCloudFormation(properties.applianceModeSupport),
        Ipv6Support: cdk.booleanToCloudFormation(properties.ipv6Support),
    };
}

// @ts-ignore TS6133
function CfnVpcAttachmentVpcOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcAttachment.VpcOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcAttachment.VpcOptionsProperty>();
    ret.addPropertyResult('applianceModeSupport', 'ApplianceModeSupport', properties.ApplianceModeSupport != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApplianceModeSupport) : undefined);
    ret.addPropertyResult('ipv6Support', 'Ipv6Support', properties.Ipv6Support != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Ipv6Support) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
