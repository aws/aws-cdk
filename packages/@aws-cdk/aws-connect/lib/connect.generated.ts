// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:23.573Z","fingerprint":"0AXAUAd2s8S6dRWI+WsIa3u9glmZcw79HBVKYlryOdA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnContactFlow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export interface CfnContactFlowProps {

    /**
     * The content of the flow.
     *
     * For more information, see [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-content
     */
    readonly content: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-name
     */
    readonly name: string;

    /**
     * The type of the flow. For descriptions of the available types, see [Choose a flow type](https://docs.aws.amazon.com/connect/latest/adminguide/create-contact-flow.html#contact-flow-types) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-type
     */
    readonly type: string;

    /**
     * The description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-description
     */
    readonly description?: string;

    /**
     * The state of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-state
     */
    readonly state?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnContactFlowProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowProps`
 *
 * @returns the result of the validation.
 */
function CfnContactFlowPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnContactFlowProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::ContactFlow` resource
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::ContactFlow` resource.
 */
// @ts-ignore TS6133
function cfnContactFlowPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContactFlowPropsValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        State: cdk.stringToCloudFormation(properties.state),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnContactFlowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactFlowProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactFlowProps>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::ContactFlow`
 *
 * Specifies a flow for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export class CfnContactFlow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::ContactFlow";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlow {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContactFlowPropsFromCloudFormation(resourceProperties);
        const ret = new CfnContactFlow(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `Ref` returns the Amazon Resource Name (ARN) of the flow. For example:
     *
     * `{ "Ref": "myFlowArn" }`
     * @cloudformationAttribute ContactFlowArn
     */
    public readonly attrContactFlowArn: string;

    /**
     * The content of the flow.
     *
     * For more information, see [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-content
     */
    public content: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-instancearn
     */
    public instanceArn: string;

    /**
     * The name of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-name
     */
    public name: string;

    /**
     * The type of the flow. For descriptions of the available types, see [Choose a flow type](https://docs.aws.amazon.com/connect/latest/adminguide/create-contact-flow.html#contact-flow-types) in the *Amazon Connect Administrator Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-type
     */
    public type: string;

    /**
     * The description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-description
     */
    public description: string | undefined;

    /**
     * The state of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-state
     */
    public state: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::ContactFlow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactFlowProps) {
        super(scope, id, { type: CfnContactFlow.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'content', this);
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'type', this);
        this.attrContactFlowArn = cdk.Token.asString(this.getAtt('ContactFlowArn', cdk.ResolutionTypeHint.STRING));

        this.content = props.content;
        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.state = props.state;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::ContactFlow", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactFlow.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            content: this.content,
            instanceArn: this.instanceArn,
            name: this.name,
            type: this.type,
            description: this.description,
            state: this.state,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContactFlowPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnContactFlowModule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export interface CfnContactFlowModuleProps {

    /**
     * The content of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-content
     */
    readonly content: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-name
     */
    readonly name: string;

    /**
     * The description of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-description
     */
    readonly description?: string;

    /**
     * The state of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-state
     */
    readonly state?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnContactFlowModuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowModuleProps`
 *
 * @returns the result of the validation.
 */
function CfnContactFlowModulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnContactFlowModuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::ContactFlowModule` resource
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowModuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::ContactFlowModule` resource.
 */
// @ts-ignore TS6133
function cfnContactFlowModulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContactFlowModulePropsValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        State: cdk.stringToCloudFormation(properties.state),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnContactFlowModulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactFlowModuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactFlowModuleProps>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::ContactFlowModule`
 *
 * Specifies a flow module for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlowModule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export class CfnContactFlowModule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::ContactFlowModule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlowModule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContactFlowModulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnContactFlowModule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * `Ref` returns the Amazon Resource Name (ARN) of the flow module. For example:
     *
     * `{ "Ref": "myFlowModuleArn" }`
     * @cloudformationAttribute ContactFlowModuleArn
     */
    public readonly attrContactFlowModuleArn: string;

    /**
     *
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The content of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-content
     */
    public content: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-instancearn
     */
    public instanceArn: string;

    /**
     * The name of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-name
     */
    public name: string;

    /**
     * The description of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-description
     */
    public description: string | undefined;

    /**
     * The state of the flow module.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-state
     */
    public state: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::ContactFlowModule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactFlowModuleProps) {
        super(scope, id, { type: CfnContactFlowModule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'content', this);
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrContactFlowModuleArn = cdk.Token.asString(this.getAtt('ContactFlowModuleArn', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.content = props.content;
        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.description = props.description;
        this.state = props.state;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::ContactFlowModule", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactFlowModule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            content: this.content,
            instanceArn: this.instanceArn,
            name: this.name,
            description: this.description,
            state: this.state,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContactFlowModulePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnHoursOfOperation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export interface CfnHoursOfOperationProps {

    /**
     * Configuration information for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-config
     */
    readonly config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-name
     */
    readonly name: string;

    /**
     * The time zone for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-timezone
     */
    readonly timeZone: string;

    /**
     * The description for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-description
     */
    readonly description?: string;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnHoursOfOperationProps`
 *
 * @param properties - the TypeScript properties of a `CfnHoursOfOperationProps`
 *
 * @returns the result of the validation.
 */
function CfnHoursOfOperationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('config', cdk.requiredValidator)(properties.config));
    errors.collect(cdk.propertyValidator('config', cdk.listValidator(CfnHoursOfOperation_HoursOfOperationConfigPropertyValidator))(properties.config));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('timeZone', cdk.requiredValidator)(properties.timeZone));
    errors.collect(cdk.propertyValidator('timeZone', cdk.validateString)(properties.timeZone));
    return errors.wrap('supplied properties not correct for "CfnHoursOfOperationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation` resource
 *
 * @param properties - the TypeScript properties of a `CfnHoursOfOperationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation` resource.
 */
// @ts-ignore TS6133
function cfnHoursOfOperationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHoursOfOperationPropsValidator(properties).assertSuccess();
    return {
        Config: cdk.listMapper(cfnHoursOfOperationHoursOfOperationConfigPropertyToCloudFormation)(properties.config),
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        TimeZone: cdk.stringToCloudFormation(properties.timeZone),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnHoursOfOperationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperationProps>();
    ret.addPropertyResult('config', 'Config', cfn_parse.FromCloudFormation.getArray(CfnHoursOfOperationHoursOfOperationConfigPropertyFromCloudFormation)(properties.Config));
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('timeZone', 'TimeZone', cfn_parse.FromCloudFormation.getString(properties.TimeZone));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::HoursOfOperation`
 *
 * Specifies hours of operation.
 *
 * @cloudformationResource AWS::Connect::HoursOfOperation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export class CfnHoursOfOperation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::HoursOfOperation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHoursOfOperation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnHoursOfOperationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnHoursOfOperation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the hours of operation.
     * @cloudformationAttribute HoursOfOperationArn
     */
    public readonly attrHoursOfOperationArn: string;

    /**
     * Configuration information for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-config
     */
    public config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-instancearn
     */
    public instanceArn: string;

    /**
     * The name for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-name
     */
    public name: string;

    /**
     * The time zone for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-timezone
     */
    public timeZone: string;

    /**
     * The description for the hours of operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-description
     */
    public description: string | undefined;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::HoursOfOperation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHoursOfOperationProps) {
        super(scope, id, { type: CfnHoursOfOperation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'config', this);
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'timeZone', this);
        this.attrHoursOfOperationArn = cdk.Token.asString(this.getAtt('HoursOfOperationArn', cdk.ResolutionTypeHint.STRING));

        this.config = props.config;
        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.timeZone = props.timeZone;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::HoursOfOperation", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnHoursOfOperation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            config: this.config,
            instanceArn: this.instanceArn,
            name: this.name,
            timeZone: this.timeZone,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnHoursOfOperationPropsToCloudFormation(props);
    }
}

export namespace CfnHoursOfOperation {
    /**
     * Contains information about the hours of operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html
     */
    export interface HoursOfOperationConfigProperty {
        /**
         * The day that the hours of operation applies to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-day
         */
        readonly day: string;
        /**
         * The end time that your contact center closes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-endtime
         */
        readonly endTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;
        /**
         * The start time that your contact center opens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-starttime
         */
        readonly startTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HoursOfOperationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnHoursOfOperation_HoursOfOperationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('day', cdk.requiredValidator)(properties.day));
    errors.collect(cdk.propertyValidator('day', cdk.validateString)(properties.day));
    errors.collect(cdk.propertyValidator('endTime', cdk.requiredValidator)(properties.endTime));
    errors.collect(cdk.propertyValidator('endTime', CfnHoursOfOperation_HoursOfOperationTimeSlicePropertyValidator)(properties.endTime));
    errors.collect(cdk.propertyValidator('startTime', cdk.requiredValidator)(properties.startTime));
    errors.collect(cdk.propertyValidator('startTime', CfnHoursOfOperation_HoursOfOperationTimeSlicePropertyValidator)(properties.startTime));
    return errors.wrap('supplied properties not correct for "HoursOfOperationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation.HoursOfOperationConfig` resource
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation.HoursOfOperationConfig` resource.
 */
// @ts-ignore TS6133
function cfnHoursOfOperationHoursOfOperationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHoursOfOperation_HoursOfOperationConfigPropertyValidator(properties).assertSuccess();
    return {
        Day: cdk.stringToCloudFormation(properties.day),
        EndTime: cfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties.endTime),
        StartTime: cfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties.startTime),
    };
}

// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperation.HoursOfOperationConfigProperty>();
    ret.addPropertyResult('day', 'Day', cfn_parse.FromCloudFormation.getString(properties.Day));
    ret.addPropertyResult('endTime', 'EndTime', CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties.EndTime));
    ret.addPropertyResult('startTime', 'StartTime', CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties.StartTime));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnHoursOfOperation {
    /**
     * The start time or end time for an hours of operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html
     */
    export interface HoursOfOperationTimeSliceProperty {
        /**
         * The hours.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-hours
         */
        readonly hours: number;
        /**
         * The minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-minutes
         */
        readonly minutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `HoursOfOperationTimeSliceProperty`
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationTimeSliceProperty`
 *
 * @returns the result of the validation.
 */
function CfnHoursOfOperation_HoursOfOperationTimeSlicePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hours', cdk.requiredValidator)(properties.hours));
    errors.collect(cdk.propertyValidator('hours', cdk.validateNumber)(properties.hours));
    errors.collect(cdk.propertyValidator('minutes', cdk.requiredValidator)(properties.minutes));
    errors.collect(cdk.propertyValidator('minutes', cdk.validateNumber)(properties.minutes));
    return errors.wrap('supplied properties not correct for "HoursOfOperationTimeSliceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation.HoursOfOperationTimeSlice` resource
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationTimeSliceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::HoursOfOperation.HoursOfOperationTimeSlice` resource.
 */
// @ts-ignore TS6133
function cfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnHoursOfOperation_HoursOfOperationTimeSlicePropertyValidator(properties).assertSuccess();
    return {
        Hours: cdk.numberToCloudFormation(properties.hours),
        Minutes: cdk.numberToCloudFormation(properties.minutes),
    };
}

// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperation.HoursOfOperationTimeSliceProperty>();
    ret.addPropertyResult('hours', 'Hours', cfn_parse.FromCloudFormation.getNumber(properties.Hours));
    ret.addPropertyResult('minutes', 'Minutes', cfn_parse.FromCloudFormation.getNumber(properties.Minutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export interface CfnInstanceProps {

    /**
     * A toggle for an individual feature at the instance level.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-attributes
     */
    readonly attributes: CfnInstance.AttributesProperty | cdk.IResolvable;

    /**
     * The identity management type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-identitymanagementtype
     */
    readonly identityManagementType: string;

    /**
     * The identifier for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-directoryid
     */
    readonly directoryId?: string;

    /**
     * The alias of instance. `InstanceAlias` is only required when `IdentityManagementType` is `CONNECT_MANAGED` or `SAML` . `InstanceAlias` is not required when `IdentityManagementType` is `EXISTING_DIRECTORY` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-instancealias
     */
    readonly instanceAlias?: string;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.requiredValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('attributes', CfnInstance_AttributesPropertyValidator)(properties.attributes));
    errors.collect(cdk.propertyValidator('directoryId', cdk.validateString)(properties.directoryId));
    errors.collect(cdk.propertyValidator('identityManagementType', cdk.requiredValidator)(properties.identityManagementType));
    errors.collect(cdk.propertyValidator('identityManagementType', cdk.validateString)(properties.identityManagementType));
    errors.collect(cdk.propertyValidator('instanceAlias', cdk.validateString)(properties.instanceAlias));
    return errors.wrap('supplied properties not correct for "CfnInstanceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Instance` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Instance` resource.
 */
// @ts-ignore TS6133
function cfnInstancePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstancePropsValidator(properties).assertSuccess();
    return {
        Attributes: cfnInstanceAttributesPropertyToCloudFormation(properties.attributes),
        IdentityManagementType: cdk.stringToCloudFormation(properties.identityManagementType),
        DirectoryId: cdk.stringToCloudFormation(properties.directoryId),
        InstanceAlias: cdk.stringToCloudFormation(properties.instanceAlias),
    };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
    ret.addPropertyResult('attributes', 'Attributes', CfnInstanceAttributesPropertyFromCloudFormation(properties.Attributes));
    ret.addPropertyResult('identityManagementType', 'IdentityManagementType', cfn_parse.FromCloudFormation.getString(properties.IdentityManagementType));
    ret.addPropertyResult('directoryId', 'DirectoryId', properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined);
    ret.addPropertyResult('instanceAlias', 'InstanceAlias', properties.InstanceAlias != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceAlias) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::Instance`
 *
 * *This is a preview release for Amazon Connect . It is subject to change.*
 *
 * Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis.
 *
 * Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
 *
 * @cloudformationResource AWS::Connect::Instance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::Instance";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstance(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the instance.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * When the instance was created.
     * @cloudformationAttribute CreatedTime
     */
    public readonly attrCreatedTime: string;

    /**
     * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The state of the instance.
     * @cloudformationAttribute InstanceStatus
     */
    public readonly attrInstanceStatus: string;

    /**
     * The service role of the instance.
     * @cloudformationAttribute ServiceRole
     */
    public readonly attrServiceRole: string;

    /**
     * A toggle for an individual feature at the instance level.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-attributes
     */
    public attributes: CfnInstance.AttributesProperty | cdk.IResolvable;

    /**
     * The identity management type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-identitymanagementtype
     */
    public identityManagementType: string;

    /**
     * The identifier for the directory.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-directoryid
     */
    public directoryId: string | undefined;

    /**
     * The alias of instance. `InstanceAlias` is only required when `IdentityManagementType` is `CONNECT_MANAGED` or `SAML` . `InstanceAlias` is not required when `IdentityManagementType` is `EXISTING_DIRECTORY` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-instancealias
     */
    public instanceAlias: string | undefined;

    /**
     * Create a new `AWS::Connect::Instance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
        super(scope, id, { type: CfnInstance.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'attributes', this);
        cdk.requireProperty(props, 'identityManagementType', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedTime = cdk.Token.asString(this.getAtt('CreatedTime', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrInstanceStatus = cdk.Token.asString(this.getAtt('InstanceStatus', cdk.ResolutionTypeHint.STRING));
        this.attrServiceRole = cdk.Token.asString(this.getAtt('ServiceRole', cdk.ResolutionTypeHint.STRING));

        this.attributes = props.attributes;
        this.identityManagementType = props.identityManagementType;
        this.directoryId = props.directoryId;
        this.instanceAlias = props.instanceAlias;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            attributes: this.attributes,
            identityManagementType: this.identityManagementType,
            directoryId: this.directoryId,
            instanceAlias: this.instanceAlias,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstancePropsToCloudFormation(props);
    }
}

export namespace CfnInstance {
    /**
     * *This is a preview release for Amazon Connect . It is subject to change.*
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html
     */
    export interface AttributesProperty {
        /**
         * `CfnInstance.AttributesProperty.AutoResolveBestVoices`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-autoresolvebestvoices
         */
        readonly autoResolveBestVoices?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.ContactLens`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactlens
         */
        readonly contactLens?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.ContactflowLogs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactflowlogs
         */
        readonly contactflowLogs?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.EarlyMedia`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-earlymedia
         */
        readonly earlyMedia?: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.InboundCalls`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-inboundcalls
         */
        readonly inboundCalls: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.OutboundCalls`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-outboundcalls
         */
        readonly outboundCalls: boolean | cdk.IResolvable;
        /**
         * `CfnInstance.AttributesProperty.UseCustomTTSVoices`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-usecustomttsvoices
         */
        readonly useCustomTtsVoices?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstance_AttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoResolveBestVoices', cdk.validateBoolean)(properties.autoResolveBestVoices));
    errors.collect(cdk.propertyValidator('contactLens', cdk.validateBoolean)(properties.contactLens));
    errors.collect(cdk.propertyValidator('contactflowLogs', cdk.validateBoolean)(properties.contactflowLogs));
    errors.collect(cdk.propertyValidator('earlyMedia', cdk.validateBoolean)(properties.earlyMedia));
    errors.collect(cdk.propertyValidator('inboundCalls', cdk.requiredValidator)(properties.inboundCalls));
    errors.collect(cdk.propertyValidator('inboundCalls', cdk.validateBoolean)(properties.inboundCalls));
    errors.collect(cdk.propertyValidator('outboundCalls', cdk.requiredValidator)(properties.outboundCalls));
    errors.collect(cdk.propertyValidator('outboundCalls', cdk.validateBoolean)(properties.outboundCalls));
    errors.collect(cdk.propertyValidator('useCustomTtsVoices', cdk.validateBoolean)(properties.useCustomTtsVoices));
    return errors.wrap('supplied properties not correct for "AttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Instance.Attributes` resource
 *
 * @param properties - the TypeScript properties of a `AttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Instance.Attributes` resource.
 */
// @ts-ignore TS6133
function cfnInstanceAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstance_AttributesPropertyValidator(properties).assertSuccess();
    return {
        AutoResolveBestVoices: cdk.booleanToCloudFormation(properties.autoResolveBestVoices),
        ContactLens: cdk.booleanToCloudFormation(properties.contactLens),
        ContactflowLogs: cdk.booleanToCloudFormation(properties.contactflowLogs),
        EarlyMedia: cdk.booleanToCloudFormation(properties.earlyMedia),
        InboundCalls: cdk.booleanToCloudFormation(properties.inboundCalls),
        OutboundCalls: cdk.booleanToCloudFormation(properties.outboundCalls),
        UseCustomTTSVoices: cdk.booleanToCloudFormation(properties.useCustomTtsVoices),
    };
}

// @ts-ignore TS6133
function CfnInstanceAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AttributesProperty>();
    ret.addPropertyResult('autoResolveBestVoices', 'AutoResolveBestVoices', properties.AutoResolveBestVoices != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoResolveBestVoices) : undefined);
    ret.addPropertyResult('contactLens', 'ContactLens', properties.ContactLens != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContactLens) : undefined);
    ret.addPropertyResult('contactflowLogs', 'ContactflowLogs', properties.ContactflowLogs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContactflowLogs) : undefined);
    ret.addPropertyResult('earlyMedia', 'EarlyMedia', properties.EarlyMedia != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EarlyMedia) : undefined);
    ret.addPropertyResult('inboundCalls', 'InboundCalls', cfn_parse.FromCloudFormation.getBoolean(properties.InboundCalls));
    ret.addPropertyResult('outboundCalls', 'OutboundCalls', cfn_parse.FromCloudFormation.getBoolean(properties.OutboundCalls));
    ret.addPropertyResult('useCustomTtsVoices', 'UseCustomTTSVoices', properties.UseCustomTTSVoices != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCustomTTSVoices) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInstanceStorageConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export interface CfnInstanceStorageConfigProps {

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-instancearn
     */
    readonly instanceArn: string;

    /**
     * A valid resource type. Following are the valid resource types: `CHAT_TRANSCRIPTS` | `CALL_RECORDINGS` | `SCHEDULED_REPORTS` | `MEDIA_STREAMS` | `CONTACT_TRACE_RECORDS` | `AGENT_EVENTS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-resourcetype
     */
    readonly resourceType: string;

    /**
     * A valid storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-storagetype
     */
    readonly storageType: string;

    /**
     * The configuration of the Kinesis Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig
     */
    readonly kinesisFirehoseConfig?: CfnInstanceStorageConfig.KinesisFirehoseConfigProperty | cdk.IResolvable;

    /**
     * The configuration of the Kinesis data stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig
     */
    readonly kinesisStreamConfig?: CfnInstanceStorageConfig.KinesisStreamConfigProperty | cdk.IResolvable;

    /**
     * The configuration of the Kinesis video stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig
     */
    readonly kinesisVideoStreamConfig?: CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty | cdk.IResolvable;

    /**
     * The S3 bucket configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-s3config
     */
    readonly s3Config?: CfnInstanceStorageConfig.S3ConfigProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceStorageConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceStorageConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('kinesisFirehoseConfig', CfnInstanceStorageConfig_KinesisFirehoseConfigPropertyValidator)(properties.kinesisFirehoseConfig));
    errors.collect(cdk.propertyValidator('kinesisStreamConfig', CfnInstanceStorageConfig_KinesisStreamConfigPropertyValidator)(properties.kinesisStreamConfig));
    errors.collect(cdk.propertyValidator('kinesisVideoStreamConfig', CfnInstanceStorageConfig_KinesisVideoStreamConfigPropertyValidator)(properties.kinesisVideoStreamConfig));
    errors.collect(cdk.propertyValidator('resourceType', cdk.requiredValidator)(properties.resourceType));
    errors.collect(cdk.propertyValidator('resourceType', cdk.validateString)(properties.resourceType));
    errors.collect(cdk.propertyValidator('s3Config', CfnInstanceStorageConfig_S3ConfigPropertyValidator)(properties.s3Config));
    errors.collect(cdk.propertyValidator('storageType', cdk.requiredValidator)(properties.storageType));
    errors.collect(cdk.propertyValidator('storageType', cdk.validateString)(properties.storageType));
    return errors.wrap('supplied properties not correct for "CfnInstanceStorageConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnInstanceStorageConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfigPropsValidator(properties).assertSuccess();
    return {
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        ResourceType: cdk.stringToCloudFormation(properties.resourceType),
        StorageType: cdk.stringToCloudFormation(properties.storageType),
        KinesisFirehoseConfig: cfnInstanceStorageConfigKinesisFirehoseConfigPropertyToCloudFormation(properties.kinesisFirehoseConfig),
        KinesisStreamConfig: cfnInstanceStorageConfigKinesisStreamConfigPropertyToCloudFormation(properties.kinesisStreamConfig),
        KinesisVideoStreamConfig: cfnInstanceStorageConfigKinesisVideoStreamConfigPropertyToCloudFormation(properties.kinesisVideoStreamConfig),
        S3Config: cfnInstanceStorageConfigS3ConfigPropertyToCloudFormation(properties.s3Config),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfigProps>();
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('resourceType', 'ResourceType', cfn_parse.FromCloudFormation.getString(properties.ResourceType));
    ret.addPropertyResult('storageType', 'StorageType', cfn_parse.FromCloudFormation.getString(properties.StorageType));
    ret.addPropertyResult('kinesisFirehoseConfig', 'KinesisFirehoseConfig', properties.KinesisFirehoseConfig != null ? CfnInstanceStorageConfigKinesisFirehoseConfigPropertyFromCloudFormation(properties.KinesisFirehoseConfig) : undefined);
    ret.addPropertyResult('kinesisStreamConfig', 'KinesisStreamConfig', properties.KinesisStreamConfig != null ? CfnInstanceStorageConfigKinesisStreamConfigPropertyFromCloudFormation(properties.KinesisStreamConfig) : undefined);
    ret.addPropertyResult('kinesisVideoStreamConfig', 'KinesisVideoStreamConfig', properties.KinesisVideoStreamConfig != null ? CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyFromCloudFormation(properties.KinesisVideoStreamConfig) : undefined);
    ret.addPropertyResult('s3Config', 'S3Config', properties.S3Config != null ? CfnInstanceStorageConfigS3ConfigPropertyFromCloudFormation(properties.S3Config) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::InstanceStorageConfig`
 *
 * The storage configuration for the instance.
 *
 * @cloudformationResource AWS::Connect::InstanceStorageConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export class CfnInstanceStorageConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::InstanceStorageConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceStorageConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInstanceStorageConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInstanceStorageConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
     * @cloudformationAttribute AssociationId
     */
    public readonly attrAssociationId: string;

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-instancearn
     */
    public instanceArn: string;

    /**
     * A valid resource type. Following are the valid resource types: `CHAT_TRANSCRIPTS` | `CALL_RECORDINGS` | `SCHEDULED_REPORTS` | `MEDIA_STREAMS` | `CONTACT_TRACE_RECORDS` | `AGENT_EVENTS`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-resourcetype
     */
    public resourceType: string;

    /**
     * A valid storage type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-storagetype
     */
    public storageType: string;

    /**
     * The configuration of the Kinesis Firehose delivery stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig
     */
    public kinesisFirehoseConfig: CfnInstanceStorageConfig.KinesisFirehoseConfigProperty | cdk.IResolvable | undefined;

    /**
     * The configuration of the Kinesis data stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig
     */
    public kinesisStreamConfig: CfnInstanceStorageConfig.KinesisStreamConfigProperty | cdk.IResolvable | undefined;

    /**
     * The configuration of the Kinesis video stream.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig
     */
    public kinesisVideoStreamConfig: CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty | cdk.IResolvable | undefined;

    /**
     * The S3 bucket configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-s3config
     */
    public s3Config: CfnInstanceStorageConfig.S3ConfigProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Connect::InstanceStorageConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceStorageConfigProps) {
        super(scope, id, { type: CfnInstanceStorageConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'resourceType', this);
        cdk.requireProperty(props, 'storageType', this);
        this.attrAssociationId = cdk.Token.asString(this.getAtt('AssociationId', cdk.ResolutionTypeHint.STRING));

        this.instanceArn = props.instanceArn;
        this.resourceType = props.resourceType;
        this.storageType = props.storageType;
        this.kinesisFirehoseConfig = props.kinesisFirehoseConfig;
        this.kinesisStreamConfig = props.kinesisStreamConfig;
        this.kinesisVideoStreamConfig = props.kinesisVideoStreamConfig;
        this.s3Config = props.s3Config;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceStorageConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceArn: this.instanceArn,
            resourceType: this.resourceType,
            storageType: this.storageType,
            kinesisFirehoseConfig: this.kinesisFirehoseConfig,
            kinesisStreamConfig: this.kinesisStreamConfig,
            kinesisVideoStreamConfig: this.kinesisVideoStreamConfig,
            s3Config: this.s3Config,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInstanceStorageConfigPropsToCloudFormation(props);
    }
}

export namespace CfnInstanceStorageConfig {
    /**
     * The encryption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html
     */
    export interface EncryptionConfigProperty {
        /**
         * The type of encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-encryptiontype
         */
        readonly encryptionType: string;
        /**
         * The full ARN of the encryption key.
         *
         * > Be sure to provide the full ARN of the encryption key, not just the ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-keyid
         */
        readonly keyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfig_EncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionType', cdk.requiredValidator)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('keyId', cdk.requiredValidator)(properties.keyId));
    errors.collect(cdk.propertyValidator('keyId', cdk.validateString)(properties.keyId));
    return errors.wrap('supplied properties not correct for "EncryptionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.EncryptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.EncryptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfig_EncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        KeyId: cdk.stringToCloudFormation(properties.keyId),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.EncryptionConfigProperty>();
    ret.addPropertyResult('encryptionType', 'EncryptionType', cfn_parse.FromCloudFormation.getString(properties.EncryptionType));
    ret.addPropertyResult('keyId', 'KeyId', cfn_parse.FromCloudFormation.getString(properties.KeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis Data Firehose delivery stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html
     */
    export interface KinesisFirehoseConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the delivery stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig-firehosearn
         */
        readonly firehoseArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfig_KinesisFirehoseConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('firehoseArn', cdk.requiredValidator)(properties.firehoseArn));
    errors.collect(cdk.propertyValidator('firehoseArn', cdk.validateString)(properties.firehoseArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisFirehoseConfig` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisFirehoseConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigKinesisFirehoseConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfig_KinesisFirehoseConfigPropertyValidator(properties).assertSuccess();
    return {
        FirehoseArn: cdk.stringToCloudFormation(properties.firehoseArn),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisFirehoseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.KinesisFirehoseConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisFirehoseConfigProperty>();
    ret.addPropertyResult('firehoseArn', 'FirehoseArn', cfn_parse.FromCloudFormation.getString(properties.FirehoseArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis data stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html
     */
    export interface KinesisStreamConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the data stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig-streamarn
         */
        readonly streamArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfig_KinesisStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamArn', cdk.requiredValidator)(properties.streamArn));
    errors.collect(cdk.propertyValidator('streamArn', cdk.validateString)(properties.streamArn));
    return errors.wrap('supplied properties not correct for "KinesisStreamConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisStreamConfig` resource
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisStreamConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigKinesisStreamConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfig_KinesisStreamConfigPropertyValidator(properties).assertSuccess();
    return {
        StreamArn: cdk.stringToCloudFormation(properties.streamArn),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.KinesisStreamConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisStreamConfigProperty>();
    ret.addPropertyResult('streamArn', 'StreamArn', cfn_parse.FromCloudFormation.getString(properties.StreamArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceStorageConfig {
    /**
     * Configuration information of a Kinesis video stream.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html
     */
    export interface KinesisVideoStreamConfigProperty {
        /**
         * The encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-encryptionconfig
         */
        readonly encryptionConfig?: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;
        /**
         * The prefix of the video stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-prefix
         */
        readonly prefix: string;
        /**
         * The number of hours data is retained in the stream. Kinesis Video Streams retains the data in a data store that is associated with the stream.
         *
         * The default value is 0, indicating that the stream does not persist data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-retentionperiodhours
         */
        readonly retentionPeriodHours: number;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisVideoStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisVideoStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfig_KinesisVideoStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionConfig', CfnInstanceStorageConfig_EncryptionConfigPropertyValidator)(properties.encryptionConfig));
    errors.collect(cdk.propertyValidator('prefix', cdk.requiredValidator)(properties.prefix));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('retentionPeriodHours', cdk.requiredValidator)(properties.retentionPeriodHours));
    errors.collect(cdk.propertyValidator('retentionPeriodHours', cdk.validateNumber)(properties.retentionPeriodHours));
    return errors.wrap('supplied properties not correct for "KinesisVideoStreamConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisVideoStreamConfig` resource
 *
 * @param properties - the TypeScript properties of a `KinesisVideoStreamConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.KinesisVideoStreamConfig` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigKinesisVideoStreamConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfig_KinesisVideoStreamConfigPropertyValidator(properties).assertSuccess();
    return {
        EncryptionConfig: cfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties.encryptionConfig),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        RetentionPeriodHours: cdk.numberToCloudFormation(properties.retentionPeriodHours),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty>();
    ret.addPropertyResult('encryptionConfig', 'EncryptionConfig', properties.EncryptionConfig != null ? CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties.EncryptionConfig) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', cfn_parse.FromCloudFormation.getString(properties.Prefix));
    ret.addPropertyResult('retentionPeriodHours', 'RetentionPeriodHours', cfn_parse.FromCloudFormation.getNumber(properties.RetentionPeriodHours));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInstanceStorageConfig {
    /**
     * Information about the Amazon Simple Storage Service (Amazon S3) storage type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html
     */
    export interface S3ConfigProperty {
        /**
         * The S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketname
         */
        readonly bucketName: string;
        /**
         * The S3 bucket prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketprefix
         */
        readonly bucketPrefix: string;
        /**
         * The Amazon S3 encryption configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-encryptionconfig
         */
        readonly encryptionConfig?: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInstanceStorageConfig_S3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketName', cdk.requiredValidator)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketName', cdk.validateString)(properties.bucketName));
    errors.collect(cdk.propertyValidator('bucketPrefix', cdk.requiredValidator)(properties.bucketPrefix));
    errors.collect(cdk.propertyValidator('bucketPrefix', cdk.validateString)(properties.bucketPrefix));
    errors.collect(cdk.propertyValidator('encryptionConfig', CfnInstanceStorageConfig_EncryptionConfigPropertyValidator)(properties.encryptionConfig));
    return errors.wrap('supplied properties not correct for "S3ConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.S3Config` resource
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::InstanceStorageConfig.S3Config` resource.
 */
// @ts-ignore TS6133
function cfnInstanceStorageConfigS3ConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInstanceStorageConfig_S3ConfigPropertyValidator(properties).assertSuccess();
    return {
        BucketName: cdk.stringToCloudFormation(properties.bucketName),
        BucketPrefix: cdk.stringToCloudFormation(properties.bucketPrefix),
        EncryptionConfig: cfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties.encryptionConfig),
    };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigS3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.S3ConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.S3ConfigProperty>();
    ret.addPropertyResult('bucketName', 'BucketName', cfn_parse.FromCloudFormation.getString(properties.BucketName));
    ret.addPropertyResult('bucketPrefix', 'BucketPrefix', cfn_parse.FromCloudFormation.getString(properties.BucketPrefix));
    ret.addPropertyResult('encryptionConfig', 'EncryptionConfig', properties.EncryptionConfig != null ? CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties.EncryptionConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPhoneNumber`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export interface CfnPhoneNumberProps {

    /**
     * The ISO country code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-countrycode
     */
    readonly countryCode: string;

    /**
     * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-targetarn
     */
    readonly targetArn: string;

    /**
     * The type of phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-type
     */
    readonly type: string;

    /**
     * The description of the phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-description
     */
    readonly description?: string;

    /**
     * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
     *
     * *Pattern* : `^\\+[0-9]{1,15}`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-prefix
     */
    readonly prefix?: string;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPhoneNumberProps`
 *
 * @param properties - the TypeScript properties of a `CfnPhoneNumberProps`
 *
 * @returns the result of the validation.
 */
function CfnPhoneNumberPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('countryCode', cdk.requiredValidator)(properties.countryCode));
    errors.collect(cdk.propertyValidator('countryCode', cdk.validateString)(properties.countryCode));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetArn', cdk.requiredValidator)(properties.targetArn));
    errors.collect(cdk.propertyValidator('targetArn', cdk.validateString)(properties.targetArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnPhoneNumberProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::PhoneNumber` resource
 *
 * @param properties - the TypeScript properties of a `CfnPhoneNumberProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::PhoneNumber` resource.
 */
// @ts-ignore TS6133
function cfnPhoneNumberPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPhoneNumberPropsValidator(properties).assertSuccess();
    return {
        CountryCode: cdk.stringToCloudFormation(properties.countryCode),
        TargetArn: cdk.stringToCloudFormation(properties.targetArn),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPhoneNumberPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPhoneNumberProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPhoneNumberProps>();
    ret.addPropertyResult('countryCode', 'CountryCode', cfn_parse.FromCloudFormation.getString(properties.CountryCode));
    ret.addPropertyResult('targetArn', 'TargetArn', cfn_parse.FromCloudFormation.getString(properties.TargetArn));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::PhoneNumber`
 *
 * Claims a phone number to the specified Amazon Connect instance or traffic distribution group.
 *
 * @cloudformationResource AWS::Connect::PhoneNumber
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export class CfnPhoneNumber extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::PhoneNumber";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPhoneNumber {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPhoneNumberPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPhoneNumber(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The phone number, in E.164 format.
     * @cloudformationAttribute Address
     */
    public readonly attrAddress: string;

    /**
     * The Amazon Resource Name (ARN) of the phone number.
     * @cloudformationAttribute PhoneNumberArn
     */
    public readonly attrPhoneNumberArn: string;

    /**
     * The ISO country code.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-countrycode
     */
    public countryCode: string;

    /**
     * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-targetarn
     */
    public targetArn: string;

    /**
     * The type of phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-type
     */
    public type: string;

    /**
     * The description of the phone number.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-description
     */
    public description: string | undefined;

    /**
     * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
     *
     * *Pattern* : `^\\+[0-9]{1,15}`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-prefix
     */
    public prefix: string | undefined;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::PhoneNumber`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPhoneNumberProps) {
        super(scope, id, { type: CfnPhoneNumber.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'countryCode', this);
        cdk.requireProperty(props, 'targetArn', this);
        cdk.requireProperty(props, 'type', this);
        this.attrAddress = cdk.Token.asString(this.getAtt('Address', cdk.ResolutionTypeHint.STRING));
        this.attrPhoneNumberArn = cdk.Token.asString(this.getAtt('PhoneNumberArn', cdk.ResolutionTypeHint.STRING));

        this.countryCode = props.countryCode;
        this.targetArn = props.targetArn;
        this.type = props.type;
        this.description = props.description;
        this.prefix = props.prefix;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::PhoneNumber", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPhoneNumber.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            countryCode: this.countryCode,
            targetArn: this.targetArn,
            type: this.type,
            description: this.description,
            prefix: this.prefix,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPhoneNumberPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnQuickConnect`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export interface CfnQuickConnectProps {

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-name
     */
    readonly name: string;

    /**
     * Contains information about the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-quickconnectconfig
     */
    readonly quickConnectConfig: CfnQuickConnect.QuickConnectConfigProperty | cdk.IResolvable;

    /**
     * The description of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-description
     */
    readonly description?: string;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnQuickConnectProps`
 *
 * @param properties - the TypeScript properties of a `CfnQuickConnectProps`
 *
 * @returns the result of the validation.
 */
function CfnQuickConnectPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('quickConnectConfig', cdk.requiredValidator)(properties.quickConnectConfig));
    errors.collect(cdk.propertyValidator('quickConnectConfig', CfnQuickConnect_QuickConnectConfigPropertyValidator)(properties.quickConnectConfig));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnQuickConnectProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::QuickConnect` resource
 *
 * @param properties - the TypeScript properties of a `CfnQuickConnectProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::QuickConnect` resource.
 */
// @ts-ignore TS6133
function cfnQuickConnectPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQuickConnectPropsValidator(properties).assertSuccess();
    return {
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        QuickConnectConfig: cfnQuickConnectQuickConnectConfigPropertyToCloudFormation(properties.quickConnectConfig),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnQuickConnectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnectProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnectProps>();
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('quickConnectConfig', 'QuickConnectConfig', CfnQuickConnectQuickConnectConfigPropertyFromCloudFormation(properties.QuickConnectConfig));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::QuickConnect`
 *
 * Specifies a quick connect for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::QuickConnect
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export class CfnQuickConnect extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::QuickConnect";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQuickConnect {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnQuickConnectPropsFromCloudFormation(resourceProperties);
        const ret = new CfnQuickConnect(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the quick connect.
     * @cloudformationAttribute QuickConnectArn
     */
    public readonly attrQuickConnectArn: string;

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-instancearn
     */
    public instanceArn: string;

    /**
     * The name of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-name
     */
    public name: string;

    /**
     * Contains information about the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-quickconnectconfig
     */
    public quickConnectConfig: CfnQuickConnect.QuickConnectConfigProperty | cdk.IResolvable;

    /**
     * The description of the quick connect.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-description
     */
    public description: string | undefined;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::QuickConnect`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnQuickConnectProps) {
        super(scope, id, { type: CfnQuickConnect.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'quickConnectConfig', this);
        this.attrQuickConnectArn = cdk.Token.asString(this.getAtt('QuickConnectArn', cdk.ResolutionTypeHint.STRING));

        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.quickConnectConfig = props.quickConnectConfig;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::QuickConnect", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnQuickConnect.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceArn: this.instanceArn,
            name: this.name,
            quickConnectConfig: this.quickConnectConfig,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnQuickConnectPropsToCloudFormation(props);
    }
}

export namespace CfnQuickConnect {
    /**
     * Contains information about a phone number for a quick connect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html
     */
    export interface PhoneNumberQuickConnectConfigProperty {
        /**
         * The phone number in E.164 format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html#cfn-connect-quickconnect-phonenumberquickconnectconfig-phonenumber
         */
        readonly phoneNumber: string;
    }
}

/**
 * Determine whether the given properties match those of a `PhoneNumberQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PhoneNumberQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnQuickConnect_PhoneNumberQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('phoneNumber', cdk.requiredValidator)(properties.phoneNumber));
    errors.collect(cdk.propertyValidator('phoneNumber', cdk.validateString)(properties.phoneNumber));
    return errors.wrap('supplied properties not correct for "PhoneNumberQuickConnectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.PhoneNumberQuickConnectConfig` resource
 *
 * @param properties - the TypeScript properties of a `PhoneNumberQuickConnectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.PhoneNumberQuickConnectConfig` resource.
 */
// @ts-ignore TS6133
function cfnQuickConnectPhoneNumberQuickConnectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQuickConnect_PhoneNumberQuickConnectConfigPropertyValidator(properties).assertSuccess();
    return {
        PhoneNumber: cdk.stringToCloudFormation(properties.phoneNumber),
    };
}

// @ts-ignore TS6133
function CfnQuickConnectPhoneNumberQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnect.PhoneNumberQuickConnectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.PhoneNumberQuickConnectConfigProperty>();
    ret.addPropertyResult('phoneNumber', 'PhoneNumber', cfn_parse.FromCloudFormation.getString(properties.PhoneNumber));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnQuickConnect {
    /**
     * Contains information about a queue for a quick connect. The flow must be of type Transfer to Queue.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html
     */
    export interface QueueQuickConnectConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The Amazon Resource Name (ARN) of the queue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-queuearn
         */
        readonly queueArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `QueueQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueueQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnQuickConnect_QueueQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.requiredValidator)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.validateString)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('queueArn', cdk.requiredValidator)(properties.queueArn));
    errors.collect(cdk.propertyValidator('queueArn', cdk.validateString)(properties.queueArn));
    return errors.wrap('supplied properties not correct for "QueueQuickConnectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.QueueQuickConnectConfig` resource
 *
 * @param properties - the TypeScript properties of a `QueueQuickConnectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.QueueQuickConnectConfig` resource.
 */
// @ts-ignore TS6133
function cfnQuickConnectQueueQuickConnectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQuickConnect_QueueQuickConnectConfigPropertyValidator(properties).assertSuccess();
    return {
        ContactFlowArn: cdk.stringToCloudFormation(properties.contactFlowArn),
        QueueArn: cdk.stringToCloudFormation(properties.queueArn),
    };
}

// @ts-ignore TS6133
function CfnQuickConnectQueueQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnect.QueueQuickConnectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.QueueQuickConnectConfigProperty>();
    ret.addPropertyResult('contactFlowArn', 'ContactFlowArn', cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn));
    ret.addPropertyResult('queueArn', 'QueueArn', cfn_parse.FromCloudFormation.getString(properties.QueueArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnQuickConnect {
    /**
     * Contains configuration settings for a quick connect.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html
     */
    export interface QuickConnectConfigProperty {
        /**
         * The phone configuration. This is required only if QuickConnectType is PHONE_NUMBER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-phoneconfig
         */
        readonly phoneConfig?: CfnQuickConnect.PhoneNumberQuickConnectConfigProperty | cdk.IResolvable;
        /**
         * The queue configuration. This is required only if QuickConnectType is QUEUE.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-queueconfig
         */
        readonly queueConfig?: CfnQuickConnect.QueueQuickConnectConfigProperty | cdk.IResolvable;
        /**
         * The type of quick connect. In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-quickconnecttype
         */
        readonly quickConnectType: string;
        /**
         * The user configuration. This is required only if QuickConnectType is USER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-userconfig
         */
        readonly userConfig?: CfnQuickConnect.UserQuickConnectConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `QuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnQuickConnect_QuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('phoneConfig', CfnQuickConnect_PhoneNumberQuickConnectConfigPropertyValidator)(properties.phoneConfig));
    errors.collect(cdk.propertyValidator('queueConfig', CfnQuickConnect_QueueQuickConnectConfigPropertyValidator)(properties.queueConfig));
    errors.collect(cdk.propertyValidator('quickConnectType', cdk.requiredValidator)(properties.quickConnectType));
    errors.collect(cdk.propertyValidator('quickConnectType', cdk.validateString)(properties.quickConnectType));
    errors.collect(cdk.propertyValidator('userConfig', CfnQuickConnect_UserQuickConnectConfigPropertyValidator)(properties.userConfig));
    return errors.wrap('supplied properties not correct for "QuickConnectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.QuickConnectConfig` resource
 *
 * @param properties - the TypeScript properties of a `QuickConnectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.QuickConnectConfig` resource.
 */
// @ts-ignore TS6133
function cfnQuickConnectQuickConnectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQuickConnect_QuickConnectConfigPropertyValidator(properties).assertSuccess();
    return {
        PhoneConfig: cfnQuickConnectPhoneNumberQuickConnectConfigPropertyToCloudFormation(properties.phoneConfig),
        QueueConfig: cfnQuickConnectQueueQuickConnectConfigPropertyToCloudFormation(properties.queueConfig),
        QuickConnectType: cdk.stringToCloudFormation(properties.quickConnectType),
        UserConfig: cfnQuickConnectUserQuickConnectConfigPropertyToCloudFormation(properties.userConfig),
    };
}

// @ts-ignore TS6133
function CfnQuickConnectQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnect.QuickConnectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.QuickConnectConfigProperty>();
    ret.addPropertyResult('phoneConfig', 'PhoneConfig', properties.PhoneConfig != null ? CfnQuickConnectPhoneNumberQuickConnectConfigPropertyFromCloudFormation(properties.PhoneConfig) : undefined);
    ret.addPropertyResult('queueConfig', 'QueueConfig', properties.QueueConfig != null ? CfnQuickConnectQueueQuickConnectConfigPropertyFromCloudFormation(properties.QueueConfig) : undefined);
    ret.addPropertyResult('quickConnectType', 'QuickConnectType', cfn_parse.FromCloudFormation.getString(properties.QuickConnectType));
    ret.addPropertyResult('userConfig', 'UserConfig', properties.UserConfig != null ? CfnQuickConnectUserQuickConnectConfigPropertyFromCloudFormation(properties.UserConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnQuickConnect {
    /**
     * Contains information about the quick connect configuration settings for a user. The contact flow must be of type Transfer to Agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html
     */
    export interface UserQuickConnectConfigProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The Amazon Resource Name (ARN) of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-userarn
         */
        readonly userArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnQuickConnect_UserQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.requiredValidator)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.validateString)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('userArn', cdk.requiredValidator)(properties.userArn));
    errors.collect(cdk.propertyValidator('userArn', cdk.validateString)(properties.userArn));
    return errors.wrap('supplied properties not correct for "UserQuickConnectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.UserQuickConnectConfig` resource
 *
 * @param properties - the TypeScript properties of a `UserQuickConnectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::QuickConnect.UserQuickConnectConfig` resource.
 */
// @ts-ignore TS6133
function cfnQuickConnectUserQuickConnectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnQuickConnect_UserQuickConnectConfigPropertyValidator(properties).assertSuccess();
    return {
        ContactFlowArn: cdk.stringToCloudFormation(properties.contactFlowArn),
        UserArn: cdk.stringToCloudFormation(properties.userArn),
    };
}

// @ts-ignore TS6133
function CfnQuickConnectUserQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnect.UserQuickConnectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.UserQuickConnectConfigProperty>();
    ret.addPropertyResult('contactFlowArn', 'ContactFlowArn', cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn));
    ret.addPropertyResult('userArn', 'UserArn', cfn_parse.FromCloudFormation.getString(properties.UserArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export interface CfnRuleProps {

    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-actions
     */
    readonly actions: CfnRule.ActionsProperty | cdk.IResolvable;

    /**
     * The conditions of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-function
     */
    readonly function: string;

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-name
     */
    readonly name: string;

    /**
     * The publish status of the rule.
     *
     * *Allowed values* : `DRAFT` | `PUBLISHED`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-publishstatus
     */
    readonly publishStatus: string;

    /**
     * The event source to trigger the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-triggereventsource
     */
    readonly triggerEventSource: CfnRule.RuleTriggerEventSourceProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', CfnRule_ActionsPropertyValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('function', cdk.requiredValidator)(properties.function));
    errors.collect(cdk.propertyValidator('function', cdk.validateString)(properties.function));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('publishStatus', cdk.requiredValidator)(properties.publishStatus));
    errors.collect(cdk.propertyValidator('publishStatus', cdk.validateString)(properties.publishStatus));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('triggerEventSource', cdk.requiredValidator)(properties.triggerEventSource));
    errors.collect(cdk.propertyValidator('triggerEventSource', CfnRule_RuleTriggerEventSourcePropertyValidator)(properties.triggerEventSource));
    return errors.wrap('supplied properties not correct for "CfnRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule` resource.
 */
// @ts-ignore TS6133
function cfnRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRulePropsValidator(properties).assertSuccess();
    return {
        Actions: cfnRuleActionsPropertyToCloudFormation(properties.actions),
        Function: cdk.stringToCloudFormation(properties.function),
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        PublishStatus: cdk.stringToCloudFormation(properties.publishStatus),
        TriggerEventSource: cfnRuleRuleTriggerEventSourcePropertyToCloudFormation(properties.triggerEventSource),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
    ret.addPropertyResult('actions', 'Actions', CfnRuleActionsPropertyFromCloudFormation(properties.Actions));
    ret.addPropertyResult('function', 'Function', cfn_parse.FromCloudFormation.getString(properties.Function));
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('publishStatus', 'PublishStatus', cfn_parse.FromCloudFormation.getString(properties.PublishStatus));
    ret.addPropertyResult('triggerEventSource', 'TriggerEventSource', CfnRuleRuleTriggerEventSourcePropertyFromCloudFormation(properties.TriggerEventSource));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::Rule`
 *
 * Creates a rule for the specified Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::Rule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::Rule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the rule.
     * @cloudformationAttribute RuleArn
     */
    public readonly attrRuleArn: string;

    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-actions
     */
    public actions: CfnRule.ActionsProperty | cdk.IResolvable;

    /**
     * The conditions of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-function
     */
    public function: string;

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-instancearn
     */
    public instanceArn: string;

    /**
     * The name of the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-name
     */
    public name: string;

    /**
     * The publish status of the rule.
     *
     * *Allowed values* : `DRAFT` | `PUBLISHED`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-publishstatus
     */
    public publishStatus: string;

    /**
     * The event source to trigger the rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-triggereventsource
     */
    public triggerEventSource: CfnRule.RuleTriggerEventSourceProperty | cdk.IResolvable;

    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::Rule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleProps) {
        super(scope, id, { type: CfnRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actions', this);
        cdk.requireProperty(props, 'function', this);
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'publishStatus', this);
        cdk.requireProperty(props, 'triggerEventSource', this);
        this.attrRuleArn = cdk.Token.asString(this.getAtt('RuleArn', cdk.ResolutionTypeHint.STRING));

        this.actions = props.actions;
        this.function = props.function;
        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.publishStatus = props.publishStatus;
        this.triggerEventSource = props.triggerEventSource;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::Rule", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actions: this.actions,
            function: this.function,
            instanceArn: this.instanceArn,
            name: this.name,
            publishStatus: this.publishStatus,
            triggerEventSource: this.triggerEventSource,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRulePropsToCloudFormation(props);
    }
}

export namespace CfnRule {
    /**
     * A list of actions to be run when the rule is triggered.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html
     */
    export interface ActionsProperty {
        /**
         * Information about the contact category action. The syntax can be empty, for example, `{}` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-assigncontactcategoryactions
         */
        readonly assignContactCategoryActions?: Array<any | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the EventBridge action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-eventbridgeactions
         */
        readonly eventBridgeActions?: Array<CfnRule.EventBridgeActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the send notification action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-sendnotificationactions
         */
        readonly sendNotificationActions?: Array<CfnRule.SendNotificationActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the task action. This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-taskactions
         */
        readonly taskActions?: Array<CfnRule.TaskActionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionsProperty`
 *
 * @param properties - the TypeScript properties of a `ActionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_ActionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('assignContactCategoryActions', cdk.listValidator(cdk.validateObject))(properties.assignContactCategoryActions));
    errors.collect(cdk.propertyValidator('eventBridgeActions', cdk.listValidator(CfnRule_EventBridgeActionPropertyValidator))(properties.eventBridgeActions));
    errors.collect(cdk.propertyValidator('sendNotificationActions', cdk.listValidator(CfnRule_SendNotificationActionPropertyValidator))(properties.sendNotificationActions));
    errors.collect(cdk.propertyValidator('taskActions', cdk.listValidator(CfnRule_TaskActionPropertyValidator))(properties.taskActions));
    return errors.wrap('supplied properties not correct for "ActionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.Actions` resource
 *
 * @param properties - the TypeScript properties of a `ActionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.Actions` resource.
 */
// @ts-ignore TS6133
function cfnRuleActionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_ActionsPropertyValidator(properties).assertSuccess();
    return {
        AssignContactCategoryActions: cdk.listMapper(cdk.objectToCloudFormation)(properties.assignContactCategoryActions),
        EventBridgeActions: cdk.listMapper(cfnRuleEventBridgeActionPropertyToCloudFormation)(properties.eventBridgeActions),
        SendNotificationActions: cdk.listMapper(cfnRuleSendNotificationActionPropertyToCloudFormation)(properties.sendNotificationActions),
        TaskActions: cdk.listMapper(cfnRuleTaskActionPropertyToCloudFormation)(properties.taskActions),
    };
}

// @ts-ignore TS6133
function CfnRuleActionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.ActionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ActionsProperty>();
    ret.addPropertyResult('assignContactCategoryActions', 'AssignContactCategoryActions', properties.AssignContactCategoryActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.AssignContactCategoryActions) : undefined);
    ret.addPropertyResult('eventBridgeActions', 'EventBridgeActions', properties.EventBridgeActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleEventBridgeActionPropertyFromCloudFormation)(properties.EventBridgeActions) : undefined);
    ret.addPropertyResult('sendNotificationActions', 'SendNotificationActions', properties.SendNotificationActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleSendNotificationActionPropertyFromCloudFormation)(properties.SendNotificationActions) : undefined);
    ret.addPropertyResult('taskActions', 'TaskActions', properties.TaskActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleTaskActionPropertyFromCloudFormation)(properties.TaskActions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * The EventBridge action definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html
     */
    export interface EventBridgeActionProperty {
        /**
         * The name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html#cfn-connect-rule-eventbridgeaction-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventBridgeActionProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_EventBridgeActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "EventBridgeActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.EventBridgeAction` resource
 *
 * @param properties - the TypeScript properties of a `EventBridgeActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.EventBridgeAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleEventBridgeActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_EventBridgeActionPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnRuleEventBridgeActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.EventBridgeActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.EventBridgeActionProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * The type of notification recipient.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html
     */
    export interface NotificationRecipientTypeProperty {
        /**
         * The Amazon Resource Name (ARN) of the user account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-userarns
         */
        readonly userArns?: string[];
        /**
         * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }. Amazon Connect users with the specified tags will be notified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-usertags
         */
        readonly userTags?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationRecipientTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationRecipientTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_NotificationRecipientTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('userArns', cdk.listValidator(cdk.validateString))(properties.userArns));
    errors.collect(cdk.propertyValidator('userTags', cdk.hashValidator(cdk.validateString))(properties.userTags));
    return errors.wrap('supplied properties not correct for "NotificationRecipientTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.NotificationRecipientType` resource
 *
 * @param properties - the TypeScript properties of a `NotificationRecipientTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.NotificationRecipientType` resource.
 */
// @ts-ignore TS6133
function cfnRuleNotificationRecipientTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_NotificationRecipientTypePropertyValidator(properties).assertSuccess();
    return {
        UserArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.userArns),
        UserTags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.userTags),
    };
}

// @ts-ignore TS6133
function CfnRuleNotificationRecipientTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.NotificationRecipientTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.NotificationRecipientTypeProperty>();
    ret.addPropertyResult('userArns', 'UserArns', properties.UserArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.UserArns) : undefined);
    ret.addPropertyResult('userTags', 'UserTags', properties.UserTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.UserTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * Information about the reference when the `referenceType` is `URL` . Otherwise, null. (Supports variable injection in the `Value` field.)
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html
     */
    export interface ReferenceProperty {
        /**
         * The type of the reference. `DATE` must be of type Epoch timestamp.
         *
         * *Allowed values* : `URL` | `ATTACHMENT` | `NUMBER` | `STRING` | `DATE` | `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-type
         */
        readonly type: string;
        /**
         * A valid value for the reference. For example, for a URL reference, a formatted URL that is displayed to an agent in the Contact Control Panel (CCP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_ReferencePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ReferenceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.Reference` resource
 *
 * @param properties - the TypeScript properties of a `ReferenceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.Reference` resource.
 */
// @ts-ignore TS6133
function cfnRuleReferencePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_ReferencePropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnRuleReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.ReferenceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ReferenceProperty>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * The name of the event source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html
     */
    export interface RuleTriggerEventSourceProperty {
        /**
         * The name of the event source.
         *
         * *Allowed values* : `OnPostCallAnalysisAvailable` | `OnRealTimeCallAnalysisAvailable` | `OnPostChatAnalysisAvailable` | `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-eventsourcename
         */
        readonly eventSourceName: string;
        /**
         * The Amazon Resource Name (ARN) for the integration association. `IntegrationAssociationArn` is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-integrationassociationarn
         */
        readonly integrationAssociationArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RuleTriggerEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `RuleTriggerEventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_RuleTriggerEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('eventSourceName', cdk.requiredValidator)(properties.eventSourceName));
    errors.collect(cdk.propertyValidator('eventSourceName', cdk.validateString)(properties.eventSourceName));
    errors.collect(cdk.propertyValidator('integrationAssociationArn', cdk.validateString)(properties.integrationAssociationArn));
    return errors.wrap('supplied properties not correct for "RuleTriggerEventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.RuleTriggerEventSource` resource
 *
 * @param properties - the TypeScript properties of a `RuleTriggerEventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.RuleTriggerEventSource` resource.
 */
// @ts-ignore TS6133
function cfnRuleRuleTriggerEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_RuleTriggerEventSourcePropertyValidator(properties).assertSuccess();
    return {
        EventSourceName: cdk.stringToCloudFormation(properties.eventSourceName),
        IntegrationAssociationArn: cdk.stringToCloudFormation(properties.integrationAssociationArn),
    };
}

// @ts-ignore TS6133
function CfnRuleRuleTriggerEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.RuleTriggerEventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RuleTriggerEventSourceProperty>();
    ret.addPropertyResult('eventSourceName', 'EventSourceName', cfn_parse.FromCloudFormation.getString(properties.EventSourceName));
    ret.addPropertyResult('integrationAssociationArn', 'IntegrationAssociationArn', properties.IntegrationAssociationArn != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationAssociationArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * Information about the send notification action.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html
     */
    export interface SendNotificationActionProperty {
        /**
         * Notification content. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-content
         */
        readonly content: string;
        /**
         * Content type format.
         *
         * *Allowed value* : `PLAIN_TEXT`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-contenttype
         */
        readonly contentType: string;
        /**
         * Notification delivery method.
         *
         * *Allowed value* : `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-deliverymethod
         */
        readonly deliveryMethod: string;
        /**
         * Notification recipient.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-recipient
         */
        readonly recipient: CfnRule.NotificationRecipientTypeProperty | cdk.IResolvable;
        /**
         * The subject of the email if the delivery method is `EMAIL` . Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-subject
         */
        readonly subject?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SendNotificationActionProperty`
 *
 * @param properties - the TypeScript properties of a `SendNotificationActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_SendNotificationActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.requiredValidator)(properties.content));
    errors.collect(cdk.propertyValidator('content', cdk.validateString)(properties.content));
    errors.collect(cdk.propertyValidator('contentType', cdk.requiredValidator)(properties.contentType));
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('deliveryMethod', cdk.requiredValidator)(properties.deliveryMethod));
    errors.collect(cdk.propertyValidator('deliveryMethod', cdk.validateString)(properties.deliveryMethod));
    errors.collect(cdk.propertyValidator('recipient', cdk.requiredValidator)(properties.recipient));
    errors.collect(cdk.propertyValidator('recipient', CfnRule_NotificationRecipientTypePropertyValidator)(properties.recipient));
    errors.collect(cdk.propertyValidator('subject', cdk.validateString)(properties.subject));
    return errors.wrap('supplied properties not correct for "SendNotificationActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.SendNotificationAction` resource
 *
 * @param properties - the TypeScript properties of a `SendNotificationActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.SendNotificationAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleSendNotificationActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_SendNotificationActionPropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.stringToCloudFormation(properties.content),
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        DeliveryMethod: cdk.stringToCloudFormation(properties.deliveryMethod),
        Recipient: cfnRuleNotificationRecipientTypePropertyToCloudFormation(properties.recipient),
        Subject: cdk.stringToCloudFormation(properties.subject),
    };
}

// @ts-ignore TS6133
function CfnRuleSendNotificationActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.SendNotificationActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.SendNotificationActionProperty>();
    ret.addPropertyResult('content', 'Content', cfn_parse.FromCloudFormation.getString(properties.Content));
    ret.addPropertyResult('contentType', 'ContentType', cfn_parse.FromCloudFormation.getString(properties.ContentType));
    ret.addPropertyResult('deliveryMethod', 'DeliveryMethod', cfn_parse.FromCloudFormation.getString(properties.DeliveryMethod));
    ret.addPropertyResult('recipient', 'Recipient', CfnRuleNotificationRecipientTypePropertyFromCloudFormation(properties.Recipient));
    ret.addPropertyResult('subject', 'Subject', properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnRule {
    /**
     * Information about the task action. This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html
     */
    export interface TaskActionProperty {
        /**
         * The Amazon Resource Name (ARN) of the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-contactflowarn
         */
        readonly contactFlowArn: string;
        /**
         * The description. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-description
         */
        readonly description?: string;
        /**
         * The name. Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-name
         */
        readonly name: string;
        /**
         * Information about the reference when the `referenceType` is `URL` . Otherwise, null. `URL` is the only accepted type. (Supports variable injection in the `Value` field.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-references
         */
        readonly references?: { [key: string]: (CfnRule.ReferenceProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TaskActionProperty`
 *
 * @param properties - the TypeScript properties of a `TaskActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnRule_TaskActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.requiredValidator)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.validateString)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('references', cdk.hashValidator(CfnRule_ReferencePropertyValidator))(properties.references));
    return errors.wrap('supplied properties not correct for "TaskActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::Rule.TaskAction` resource
 *
 * @param properties - the TypeScript properties of a `TaskActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::Rule.TaskAction` resource.
 */
// @ts-ignore TS6133
function cfnRuleTaskActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRule_TaskActionPropertyValidator(properties).assertSuccess();
    return {
        ContactFlowArn: cdk.stringToCloudFormation(properties.contactFlowArn),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        References: cdk.hashMapper(cfnRuleReferencePropertyToCloudFormation)(properties.references),
    };
}

// @ts-ignore TS6133
function CfnRuleTaskActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.TaskActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.TaskActionProperty>();
    ret.addPropertyResult('contactFlowArn', 'ContactFlowArn', cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('references', 'References', properties.References != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleReferencePropertyFromCloudFormation)(properties.References) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTaskTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export interface CfnTaskTemplateProps {

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-instancearn
     */
    readonly instanceArn: string;

    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-clienttoken
     */
    readonly clientToken?: string;

    /**
     * Constraints that are applicable to the fields listed.
     *
     * The values can be represented in either JSON or YAML format. For an example of the JSON configuration, see *Examples* at the bottom of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-constraints
     */
    readonly constraints?: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template. `ContactFlowArn` is not required when there is a field with `fieldType` = `QUICK_CONNECT` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-contactflowarn
     */
    readonly contactFlowArn?: string;

    /**
     * The default values for fields when a task is created by referencing this template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-defaults
     */
    readonly defaults?: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-description
     */
    readonly description?: string;

    /**
     * Fields that are part of the template. A template requires at least one field that has type `Name` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-fields
     */
    readonly fields?: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-name
     */
    readonly name?: string;

    /**
     * The status of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-status
     */
    readonly status?: string;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnTaskTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientToken', cdk.validateString)(properties.clientToken));
    errors.collect(cdk.propertyValidator('constraints', cdk.validateObject)(properties.constraints));
    errors.collect(cdk.propertyValidator('contactFlowArn', cdk.validateString)(properties.contactFlowArn));
    errors.collect(cdk.propertyValidator('defaults', cdk.listValidator(CfnTaskTemplate_DefaultFieldValuePropertyValidator))(properties.defaults));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('fields', cdk.listValidator(CfnTaskTemplate_FieldPropertyValidator))(properties.fields));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnTaskTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnTaskTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplatePropsValidator(properties).assertSuccess();
    return {
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        ClientToken: cdk.stringToCloudFormation(properties.clientToken),
        Constraints: cdk.objectToCloudFormation(properties.constraints),
        ContactFlowArn: cdk.stringToCloudFormation(properties.contactFlowArn),
        Defaults: cdk.listMapper(cfnTaskTemplateDefaultFieldValuePropertyToCloudFormation)(properties.defaults),
        Description: cdk.stringToCloudFormation(properties.description),
        Fields: cdk.listMapper(cfnTaskTemplateFieldPropertyToCloudFormation)(properties.fields),
        Name: cdk.stringToCloudFormation(properties.name),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplateProps>();
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('clientToken', 'ClientToken', properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined);
    ret.addPropertyResult('constraints', 'Constraints', properties.Constraints != null ? cfn_parse.FromCloudFormation.getAny(properties.Constraints) : undefined);
    ret.addPropertyResult('contactFlowArn', 'ContactFlowArn', properties.ContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn) : undefined);
    ret.addPropertyResult('defaults', 'Defaults', properties.Defaults != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateDefaultFieldValuePropertyFromCloudFormation)(properties.Defaults) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('fields', 'Fields', properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateFieldPropertyFromCloudFormation)(properties.Fields) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::TaskTemplate`
 *
 * Specifies a task template for a Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::TaskTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export class CfnTaskTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::TaskTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTaskTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTaskTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the task template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Connect instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-instancearn
     */
    public instanceArn: string;

    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-clienttoken
     */
    public clientToken: string | undefined;

    /**
     * Constraints that are applicable to the fields listed.
     *
     * The values can be represented in either JSON or YAML format. For an example of the JSON configuration, see *Examples* at the bottom of this page.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-constraints
     */
    public constraints: any | cdk.IResolvable | undefined;

    /**
     * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template. `ContactFlowArn` is not required when there is a field with `fieldType` = `QUICK_CONNECT` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-contactflowarn
     */
    public contactFlowArn: string | undefined;

    /**
     * The default values for fields when a task is created by referencing this template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-defaults
     */
    public defaults: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The description of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-description
     */
    public description: string | undefined;

    /**
     * Fields that are part of the template. A template requires at least one field that has type `Name` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-fields
     */
    public fields: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-name
     */
    public name: string | undefined;

    /**
     * The status of the task template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-status
     */
    public status: string | undefined;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::TaskTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTaskTemplateProps) {
        super(scope, id, { type: CfnTaskTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.instanceArn = props.instanceArn;
        this.clientToken = props.clientToken;
        this.constraints = props.constraints;
        this.contactFlowArn = props.contactFlowArn;
        this.defaults = props.defaults;
        this.description = props.description;
        this.fields = props.fields;
        this.name = props.name;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::TaskTemplate", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceArn: this.instanceArn,
            clientToken: this.clientToken,
            constraints: this.constraints,
            contactFlowArn: this.contactFlowArn,
            defaults: this.defaults,
            description: this.description,
            fields: this.fields,
            name: this.name,
            status: this.status,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTaskTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnTaskTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html
     */
    export interface ConstraintsProperty {
        /**
         * `CfnTaskTemplate.ConstraintsProperty.InvisibleFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-invisiblefields
         */
        readonly invisibleFields?: Array<CfnTaskTemplate.InvisibleFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnTaskTemplate.ConstraintsProperty.ReadOnlyFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-readonlyfields
         */
        readonly readOnlyFields?: Array<CfnTaskTemplate.ReadOnlyFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnTaskTemplate.ConstraintsProperty.RequiredFields`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-requiredfields
         */
        readonly requiredFields?: Array<CfnTaskTemplate.RequiredFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_ConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invisibleFields', cdk.listValidator(CfnTaskTemplate_InvisibleFieldInfoPropertyValidator))(properties.invisibleFields));
    errors.collect(cdk.propertyValidator('readOnlyFields', cdk.listValidator(CfnTaskTemplate_ReadOnlyFieldInfoPropertyValidator))(properties.readOnlyFields));
    errors.collect(cdk.propertyValidator('requiredFields', cdk.listValidator(CfnTaskTemplate_RequiredFieldInfoPropertyValidator))(properties.requiredFields));
    return errors.wrap('supplied properties not correct for "ConstraintsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.Constraints` resource
 *
 * @param properties - the TypeScript properties of a `ConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.Constraints` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateConstraintsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_ConstraintsPropertyValidator(properties).assertSuccess();
    return {
        InvisibleFields: cdk.listMapper(cfnTaskTemplateInvisibleFieldInfoPropertyToCloudFormation)(properties.invisibleFields),
        ReadOnlyFields: cdk.listMapper(cfnTaskTemplateReadOnlyFieldInfoPropertyToCloudFormation)(properties.readOnlyFields),
        RequiredFields: cdk.listMapper(cfnTaskTemplateRequiredFieldInfoPropertyToCloudFormation)(properties.requiredFields),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.ConstraintsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.ConstraintsProperty>();
    ret.addPropertyResult('invisibleFields', 'InvisibleFields', properties.InvisibleFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateInvisibleFieldInfoPropertyFromCloudFormation)(properties.InvisibleFields) : undefined);
    ret.addPropertyResult('readOnlyFields', 'ReadOnlyFields', properties.ReadOnlyFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateReadOnlyFieldInfoPropertyFromCloudFormation)(properties.ReadOnlyFields) : undefined);
    ret.addPropertyResult('requiredFields', 'RequiredFields', properties.RequiredFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateRequiredFieldInfoPropertyFromCloudFormation)(properties.RequiredFields) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * Describes a default field and its corresponding value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html
     */
    export interface DefaultFieldValueProperty {
        /**
         * Default value for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-defaultvalue
         */
        readonly defaultValue: string;
        /**
         * Identifier of a field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultFieldValueProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultFieldValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_DefaultFieldValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.requiredValidator)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', CfnTaskTemplate_FieldIdentifierPropertyValidator)(properties.id));
    return errors.wrap('supplied properties not correct for "DefaultFieldValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.DefaultFieldValue` resource
 *
 * @param properties - the TypeScript properties of a `DefaultFieldValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.DefaultFieldValue` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateDefaultFieldValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_DefaultFieldValuePropertyValidator(properties).assertSuccess();
    return {
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Id: cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateDefaultFieldValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.DefaultFieldValueProperty>();
    ret.addPropertyResult('defaultValue', 'DefaultValue', cfn_parse.FromCloudFormation.getString(properties.DefaultValue));
    ret.addPropertyResult('id', 'Id', CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * Describes a single task template field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html
     */
    export interface FieldProperty {
        /**
         * The description of the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-description
         */
        readonly description?: string;
        /**
         * The unique identifier for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
        /**
         * A list of options for a single select field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-singleselectoptions
         */
        readonly singleSelectOptions?: string[];
        /**
         * Indicates the type of field. Following are the valid field types: `NAME` `DESCRIPTION` | `SCHEDULED_TIME` | `QUICK_CONNECT` | `URL` | `NUMBER` | `TEXT` | `TEXT_AREA` | `DATE_TIME` | `BOOLEAN` | `SINGLE_SELECT` | `EMAIL`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldProperty`
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_FieldPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', CfnTaskTemplate_FieldIdentifierPropertyValidator)(properties.id));
    errors.collect(cdk.propertyValidator('singleSelectOptions', cdk.listValidator(cdk.validateString))(properties.singleSelectOptions));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "FieldProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.Field` resource
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.Field` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateFieldPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_FieldPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Id: cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
        SingleSelectOptions: cdk.listMapper(cdk.stringToCloudFormation)(properties.singleSelectOptions),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.FieldProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.FieldProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('id', 'Id', CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id));
    ret.addPropertyResult('singleSelectOptions', 'SingleSelectOptions', properties.SingleSelectOptions != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SingleSelectOptions) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * The identifier of the task template field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html
     */
    export interface FieldIdentifierProperty {
        /**
         * The name of the task template field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html#cfn-connect-tasktemplate-fieldidentifier-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_FieldIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "FieldIdentifierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.FieldIdentifier` resource
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.FieldIdentifier` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_FieldIdentifierPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.FieldIdentifierProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * A field that is invisible to an agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html
     */
    export interface InvisibleFieldInfoProperty {
        /**
         * Identifier of the invisible field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html#cfn-connect-tasktemplate-invisiblefieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InvisibleFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `InvisibleFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_InvisibleFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', CfnTaskTemplate_FieldIdentifierPropertyValidator)(properties.id));
    return errors.wrap('supplied properties not correct for "InvisibleFieldInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.InvisibleFieldInfo` resource
 *
 * @param properties - the TypeScript properties of a `InvisibleFieldInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.InvisibleFieldInfo` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateInvisibleFieldInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_InvisibleFieldInfoPropertyValidator(properties).assertSuccess();
    return {
        Id: cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateInvisibleFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.InvisibleFieldInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.InvisibleFieldInfoProperty>();
    ret.addPropertyResult('id', 'Id', CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * Indicates a field that is read-only to an agent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html
     */
    export interface ReadOnlyFieldInfoProperty {
        /**
         * Identifier of the read-only field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html#cfn-connect-tasktemplate-readonlyfieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReadOnlyFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ReadOnlyFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_ReadOnlyFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', CfnTaskTemplate_FieldIdentifierPropertyValidator)(properties.id));
    return errors.wrap('supplied properties not correct for "ReadOnlyFieldInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.ReadOnlyFieldInfo` resource
 *
 * @param properties - the TypeScript properties of a `ReadOnlyFieldInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.ReadOnlyFieldInfo` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateReadOnlyFieldInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_ReadOnlyFieldInfoPropertyValidator(properties).assertSuccess();
    return {
        Id: cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateReadOnlyFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.ReadOnlyFieldInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.ReadOnlyFieldInfoProperty>();
    ret.addPropertyResult('id', 'Id', CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskTemplate {
    /**
     * Information about a required field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html
     */
    export interface RequiredFieldInfoProperty {
        /**
         * The unique identifier for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html#cfn-connect-tasktemplate-requiredfieldinfo-id
         */
        readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `RequiredFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `RequiredFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskTemplate_RequiredFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', CfnTaskTemplate_FieldIdentifierPropertyValidator)(properties.id));
    return errors.wrap('supplied properties not correct for "RequiredFieldInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.RequiredFieldInfo` resource
 *
 * @param properties - the TypeScript properties of a `RequiredFieldInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::TaskTemplate.RequiredFieldInfo` resource.
 */
// @ts-ignore TS6133
function cfnTaskTemplateRequiredFieldInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskTemplate_RequiredFieldInfoPropertyValidator(properties).assertSuccess();
    return {
        Id: cfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnTaskTemplateRequiredFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.RequiredFieldInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.RequiredFieldInfoProperty>();
    ret.addPropertyResult('id', 'Id', CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export interface CfnUserProps {

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-instancearn
     */
    readonly instanceArn: string;

    /**
     * Information about the phone configuration for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-phoneconfig
     */
    readonly phoneConfig: CfnUser.UserPhoneConfigProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the user's routing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-routingprofilearn
     */
    readonly routingProfileArn: string;

    /**
     * The Amazon Resource Name (ARN) of the user's security profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-securityprofilearns
     */
    readonly securityProfileArns: string[];

    /**
     * The user name assigned to the user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-username
     */
    readonly username: string;

    /**
     * The identifier of the user account in the directory used for identity management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-directoryuserid
     */
    readonly directoryUserId?: string;

    /**
     * The Amazon Resource Name (ARN) of the user's hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-hierarchygrouparn
     */
    readonly hierarchyGroupArn?: string;

    /**
     * Information about the user identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-identityinfo
     */
    readonly identityInfo?: CfnUser.UserIdentityInfoProperty | cdk.IResolvable;

    /**
     * The user's password.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-password
     */
    readonly password?: string;

    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('directoryUserId', cdk.validateString)(properties.directoryUserId));
    errors.collect(cdk.propertyValidator('hierarchyGroupArn', cdk.validateString)(properties.hierarchyGroupArn));
    errors.collect(cdk.propertyValidator('identityInfo', CfnUser_UserIdentityInfoPropertyValidator)(properties.identityInfo));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('password', cdk.validateString)(properties.password));
    errors.collect(cdk.propertyValidator('phoneConfig', cdk.requiredValidator)(properties.phoneConfig));
    errors.collect(cdk.propertyValidator('phoneConfig', CfnUser_UserPhoneConfigPropertyValidator)(properties.phoneConfig));
    errors.collect(cdk.propertyValidator('routingProfileArn', cdk.requiredValidator)(properties.routingProfileArn));
    errors.collect(cdk.propertyValidator('routingProfileArn', cdk.validateString)(properties.routingProfileArn));
    errors.collect(cdk.propertyValidator('securityProfileArns', cdk.requiredValidator)(properties.securityProfileArns));
    errors.collect(cdk.propertyValidator('securityProfileArns', cdk.listValidator(cdk.validateString))(properties.securityProfileArns));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('username', cdk.requiredValidator)(properties.username));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "CfnUserProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::User` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::User` resource.
 */
// @ts-ignore TS6133
function cfnUserPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserPropsValidator(properties).assertSuccess();
    return {
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        PhoneConfig: cfnUserUserPhoneConfigPropertyToCloudFormation(properties.phoneConfig),
        RoutingProfileArn: cdk.stringToCloudFormation(properties.routingProfileArn),
        SecurityProfileArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityProfileArns),
        Username: cdk.stringToCloudFormation(properties.username),
        DirectoryUserId: cdk.stringToCloudFormation(properties.directoryUserId),
        HierarchyGroupArn: cdk.stringToCloudFormation(properties.hierarchyGroupArn),
        IdentityInfo: cfnUserUserIdentityInfoPropertyToCloudFormation(properties.identityInfo),
        Password: cdk.stringToCloudFormation(properties.password),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('phoneConfig', 'PhoneConfig', CfnUserUserPhoneConfigPropertyFromCloudFormation(properties.PhoneConfig));
    ret.addPropertyResult('routingProfileArn', 'RoutingProfileArn', cfn_parse.FromCloudFormation.getString(properties.RoutingProfileArn));
    ret.addPropertyResult('securityProfileArns', 'SecurityProfileArns', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityProfileArns));
    ret.addPropertyResult('username', 'Username', cfn_parse.FromCloudFormation.getString(properties.Username));
    ret.addPropertyResult('directoryUserId', 'DirectoryUserId', properties.DirectoryUserId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryUserId) : undefined);
    ret.addPropertyResult('hierarchyGroupArn', 'HierarchyGroupArn', properties.HierarchyGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.HierarchyGroupArn) : undefined);
    ret.addPropertyResult('identityInfo', 'IdentityInfo', properties.IdentityInfo != null ? CfnUserUserIdentityInfoPropertyFromCloudFormation(properties.IdentityInfo) : undefined);
    ret.addPropertyResult('password', 'Password', properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::User`
 *
 * Specifies a user account for an Amazon Connect instance.
 *
 * For information about how to create user accounts using the Amazon Connect console, see [Add Users](https://docs.aws.amazon.com/connect/latest/adminguide/user-management.html) in the *Amazon Connect Administrator Guide* .
 *
 * @cloudformationResource AWS::Connect::User
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::User";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUser(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the user.
     * @cloudformationAttribute UserArn
     */
    public readonly attrUserArn: string;

    /**
     * The Amazon Resource Name (ARN) of the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-instancearn
     */
    public instanceArn: string;

    /**
     * Information about the phone configuration for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-phoneconfig
     */
    public phoneConfig: CfnUser.UserPhoneConfigProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the user's routing profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-routingprofilearn
     */
    public routingProfileArn: string;

    /**
     * The Amazon Resource Name (ARN) of the user's security profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-securityprofilearns
     */
    public securityProfileArns: string[];

    /**
     * The user name assigned to the user account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-username
     */
    public username: string;

    /**
     * The identifier of the user account in the directory used for identity management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-directoryuserid
     */
    public directoryUserId: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the user's hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-hierarchygrouparn
     */
    public hierarchyGroupArn: string | undefined;

    /**
     * Information about the user identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-identityinfo
     */
    public identityInfo: CfnUser.UserIdentityInfoProperty | cdk.IResolvable | undefined;

    /**
     * The user's password.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-password
     */
    public password: string | undefined;

    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Connect::User`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
        super(scope, id, { type: CfnUser.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'phoneConfig', this);
        cdk.requireProperty(props, 'routingProfileArn', this);
        cdk.requireProperty(props, 'securityProfileArns', this);
        cdk.requireProperty(props, 'username', this);
        this.attrUserArn = cdk.Token.asString(this.getAtt('UserArn', cdk.ResolutionTypeHint.STRING));

        this.instanceArn = props.instanceArn;
        this.phoneConfig = props.phoneConfig;
        this.routingProfileArn = props.routingProfileArn;
        this.securityProfileArns = props.securityProfileArns;
        this.username = props.username;
        this.directoryUserId = props.directoryUserId;
        this.hierarchyGroupArn = props.hierarchyGroupArn;
        this.identityInfo = props.identityInfo;
        this.password = props.password;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::User", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceArn: this.instanceArn,
            phoneConfig: this.phoneConfig,
            routingProfileArn: this.routingProfileArn,
            securityProfileArns: this.securityProfileArns,
            username: this.username,
            directoryUserId: this.directoryUserId,
            hierarchyGroupArn: this.hierarchyGroupArn,
            identityInfo: this.identityInfo,
            password: this.password,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserPropsToCloudFormation(props);
    }
}

export namespace CfnUser {
    /**
     * Contains information about the identity of a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html
     */
    export interface UserIdentityInfoProperty {
        /**
         * The email address. If you are using SAML for identity management and include this parameter, an error is returned.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-email
         */
        readonly email?: string;
        /**
         * The first name. This is required if you are using Amazon Connect or SAML for identity management.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-firstname
         */
        readonly firstName?: string;
        /**
         * The last name. This is required if you are using Amazon Connect or SAML for identity management.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-lastname
         */
        readonly lastName?: string;
        /**
         * The user's mobile number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-mobile
         */
        readonly mobile?: string;
        /**
         * The user's secondary email address. If you provide a secondary email, the user receives email notifications -- other than password reset notifications -- to this email address instead of to their primary email address.
         *
         * *Pattern* : `(?=^.{0,265}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-secondaryemail
         */
        readonly secondaryEmail?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserIdentityInfoProperty`
 *
 * @param properties - the TypeScript properties of a `UserIdentityInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnUser_UserIdentityInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('email', cdk.validateString)(properties.email));
    errors.collect(cdk.propertyValidator('firstName', cdk.validateString)(properties.firstName));
    errors.collect(cdk.propertyValidator('lastName', cdk.validateString)(properties.lastName));
    errors.collect(cdk.propertyValidator('mobile', cdk.validateString)(properties.mobile));
    errors.collect(cdk.propertyValidator('secondaryEmail', cdk.validateString)(properties.secondaryEmail));
    return errors.wrap('supplied properties not correct for "UserIdentityInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::User.UserIdentityInfo` resource
 *
 * @param properties - the TypeScript properties of a `UserIdentityInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::User.UserIdentityInfo` resource.
 */
// @ts-ignore TS6133
function cfnUserUserIdentityInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUser_UserIdentityInfoPropertyValidator(properties).assertSuccess();
    return {
        Email: cdk.stringToCloudFormation(properties.email),
        FirstName: cdk.stringToCloudFormation(properties.firstName),
        LastName: cdk.stringToCloudFormation(properties.lastName),
        Mobile: cdk.stringToCloudFormation(properties.mobile),
        SecondaryEmail: cdk.stringToCloudFormation(properties.secondaryEmail),
    };
}

// @ts-ignore TS6133
function CfnUserUserIdentityInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.UserIdentityInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.UserIdentityInfoProperty>();
    ret.addPropertyResult('email', 'Email', properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined);
    ret.addPropertyResult('firstName', 'FirstName', properties.FirstName != null ? cfn_parse.FromCloudFormation.getString(properties.FirstName) : undefined);
    ret.addPropertyResult('lastName', 'LastName', properties.LastName != null ? cfn_parse.FromCloudFormation.getString(properties.LastName) : undefined);
    ret.addPropertyResult('mobile', 'Mobile', properties.Mobile != null ? cfn_parse.FromCloudFormation.getString(properties.Mobile) : undefined);
    ret.addPropertyResult('secondaryEmail', 'SecondaryEmail', properties.SecondaryEmail != null ? cfn_parse.FromCloudFormation.getString(properties.SecondaryEmail) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnUser {
    /**
     * Contains information about the phone configuration settings for a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html
     */
    export interface UserPhoneConfigProperty {
        /**
         * The After Call Work (ACW) timeout setting, in seconds.
         *
         * > When returned by a `SearchUsers` call, `AfterContactWorkTimeLimit` is returned in milliseconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-aftercontactworktimelimit
         */
        readonly afterContactWorkTimeLimit?: number;
        /**
         * The Auto accept setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-autoaccept
         */
        readonly autoAccept?: boolean | cdk.IResolvable;
        /**
         * The phone number for the user's desk phone.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-deskphonenumber
         */
        readonly deskPhoneNumber?: string;
        /**
         * The phone type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-phonetype
         */
        readonly phoneType: string;
    }
}

/**
 * Determine whether the given properties match those of a `UserPhoneConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserPhoneConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnUser_UserPhoneConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('afterContactWorkTimeLimit', cdk.validateNumber)(properties.afterContactWorkTimeLimit));
    errors.collect(cdk.propertyValidator('autoAccept', cdk.validateBoolean)(properties.autoAccept));
    errors.collect(cdk.propertyValidator('deskPhoneNumber', cdk.validateString)(properties.deskPhoneNumber));
    errors.collect(cdk.propertyValidator('phoneType', cdk.requiredValidator)(properties.phoneType));
    errors.collect(cdk.propertyValidator('phoneType', cdk.validateString)(properties.phoneType));
    return errors.wrap('supplied properties not correct for "UserPhoneConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::User.UserPhoneConfig` resource
 *
 * @param properties - the TypeScript properties of a `UserPhoneConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::User.UserPhoneConfig` resource.
 */
// @ts-ignore TS6133
function cfnUserUserPhoneConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUser_UserPhoneConfigPropertyValidator(properties).assertSuccess();
    return {
        AfterContactWorkTimeLimit: cdk.numberToCloudFormation(properties.afterContactWorkTimeLimit),
        AutoAccept: cdk.booleanToCloudFormation(properties.autoAccept),
        DeskPhoneNumber: cdk.stringToCloudFormation(properties.deskPhoneNumber),
        PhoneType: cdk.stringToCloudFormation(properties.phoneType),
    };
}

// @ts-ignore TS6133
function CfnUserUserPhoneConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUser.UserPhoneConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.UserPhoneConfigProperty>();
    ret.addPropertyResult('afterContactWorkTimeLimit', 'AfterContactWorkTimeLimit', properties.AfterContactWorkTimeLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.AfterContactWorkTimeLimit) : undefined);
    ret.addPropertyResult('autoAccept', 'AutoAccept', properties.AutoAccept != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAccept) : undefined);
    ret.addPropertyResult('deskPhoneNumber', 'DeskPhoneNumber', properties.DeskPhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.DeskPhoneNumber) : undefined);
    ret.addPropertyResult('phoneType', 'PhoneType', cfn_parse.FromCloudFormation.getString(properties.PhoneType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnUserHierarchyGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export interface CfnUserHierarchyGroupProps {

    /**
     * The Amazon Resource Name (ARN) of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-instancearn
     */
    readonly instanceArn: string;

    /**
     * The name of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the parent group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-parentgrouparn
     */
    readonly parentGroupArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserHierarchyGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserHierarchyGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnUserHierarchyGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('instanceArn', cdk.requiredValidator)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('instanceArn', cdk.validateString)(properties.instanceArn));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parentGroupArn', cdk.validateString)(properties.parentGroupArn));
    return errors.wrap('supplied properties not correct for "CfnUserHierarchyGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Connect::UserHierarchyGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnUserHierarchyGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Connect::UserHierarchyGroup` resource.
 */
// @ts-ignore TS6133
function cfnUserHierarchyGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnUserHierarchyGroupPropsValidator(properties).assertSuccess();
    return {
        InstanceArn: cdk.stringToCloudFormation(properties.instanceArn),
        Name: cdk.stringToCloudFormation(properties.name),
        ParentGroupArn: cdk.stringToCloudFormation(properties.parentGroupArn),
    };
}

// @ts-ignore TS6133
function CfnUserHierarchyGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserHierarchyGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserHierarchyGroupProps>();
    ret.addPropertyResult('instanceArn', 'InstanceArn', cfn_parse.FromCloudFormation.getString(properties.InstanceArn));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('parentGroupArn', 'ParentGroupArn', properties.ParentGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.ParentGroupArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Connect::UserHierarchyGroup`
 *
 * Specifies a new user hierarchy group.
 *
 * @cloudformationResource AWS::Connect::UserHierarchyGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export class CfnUserHierarchyGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Connect::UserHierarchyGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserHierarchyGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnUserHierarchyGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnUserHierarchyGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) for the user hierarchy group.
     * @cloudformationAttribute UserHierarchyGroupArn
     */
    public readonly attrUserHierarchyGroupArn: string;

    /**
     * The Amazon Resource Name (ARN) of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-instancearn
     */
    public instanceArn: string;

    /**
     * The name of the user hierarchy group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the parent group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-parentgrouparn
     */
    public parentGroupArn: string | undefined;

    /**
     * Create a new `AWS::Connect::UserHierarchyGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserHierarchyGroupProps) {
        super(scope, id, { type: CfnUserHierarchyGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'instanceArn', this);
        cdk.requireProperty(props, 'name', this);
        this.attrUserHierarchyGroupArn = cdk.Token.asString(this.getAtt('UserHierarchyGroupArn', cdk.ResolutionTypeHint.STRING));

        this.instanceArn = props.instanceArn;
        this.name = props.name;
        this.parentGroupArn = props.parentGroupArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserHierarchyGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            instanceArn: this.instanceArn,
            name: this.name,
            parentGroupArn: this.parentGroupArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnUserHierarchyGroupPropsToCloudFormation(props);
    }
}
