// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:23.048Z","fingerprint":"ZhXsatZGh18DAGhWcFOyxoDpeTzEU2JxFt+xsfiGzoY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionName', cdk.requiredValidator)(properties.connectionName));
    errors.collect(cdk.propertyValidator('connectionName', cdk.validateString)(properties.connectionName));
    errors.collect(cdk.propertyValidator('hostArn', cdk.validateString)(properties.hostArn));
    errors.collect(cdk.propertyValidator('providerType', cdk.validateString)(properties.providerType));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConnectionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeStarConnections::Connection` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeStarConnections::Connection` resource.
 */
// @ts-ignore TS6133
function cfnConnectionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectionPropsValidator(properties).assertSuccess();
    return {
        ConnectionName: cdk.stringToCloudFormation(properties.connectionName),
        HostArn: cdk.stringToCloudFormation(properties.hostArn),
        ProviderType: cdk.stringToCloudFormation(properties.providerType),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionProps>();
    ret.addPropertyResult('connectionName', 'ConnectionName', cfn_parse.FromCloudFormation.getString(properties.ConnectionName));
    ret.addPropertyResult('hostArn', 'HostArn', properties.HostArn != null ? cfn_parse.FromCloudFormation.getString(properties.HostArn) : undefined);
    ret.addPropertyResult('providerType', 'ProviderType', properties.ProviderType != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderType) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnConnection extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeStarConnections::Connection";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnection {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConnectionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConnection(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the connection. The ARN is used as the connection reference when the connection is shared between AWS services. For example: `arn:aws:codestar-connections:us-west-2:123456789012:connection/39e4c34d-e13a-4e94-a886-ea67651bf042` .
     * @cloudformationAttribute ConnectionArn
     */
    public readonly attrConnectionArn: string;

    /**
     * The current status of the connection. For example: `PENDING` , `AVAILABLE` , or `ERROR` .
     * @cloudformationAttribute ConnectionStatus
     */
    public readonly attrConnectionStatus: string;

    /**
     * The AWS account ID of the owner of the connection. For Bitbucket, this is the account ID of the owner of the Bitbucket repository. For example: `123456789012` .
     * @cloudformationAttribute OwnerAccountId
     */
    public readonly attrOwnerAccountId: string;

    /**
     * The name of the connection. Connection names must be unique in an AWS user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-connectionname
     */
    public connectionName: string;

    /**
     * The Amazon Resource Name (ARN) of the host associated with the connection.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-hostarn
     */
    public hostArn: string | undefined;

    /**
     * The name of the external provider where your third-party code repository is configured.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-providertype
     */
    public providerType: string | undefined;

    /**
     * Specifies the tags applied to the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarconnections-connection.html#cfn-codestarconnections-connection-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodeStarConnections::Connection`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectionProps) {
        super(scope, id, { type: CfnConnection.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'connectionName', this);
        this.attrConnectionArn = cdk.Token.asString(this.getAtt('ConnectionArn', cdk.ResolutionTypeHint.STRING));
        this.attrConnectionStatus = cdk.Token.asString(this.getAtt('ConnectionStatus', cdk.ResolutionTypeHint.STRING));
        this.attrOwnerAccountId = cdk.Token.asString(this.getAtt('OwnerAccountId', cdk.ResolutionTypeHint.STRING));

        this.connectionName = props.connectionName;
        this.hostArn = props.hostArn;
        this.providerType = props.providerType;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeStarConnections::Connection", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnection.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            connectionName: this.connectionName,
            hostArn: this.hostArn,
            providerType: this.providerType,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectionPropsToCloudFormation(props);
    }
}
