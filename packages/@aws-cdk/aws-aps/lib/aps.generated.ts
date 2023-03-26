// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:12.153Z","fingerprint":"3iQ3+9hsfnCWpP5R28mEFZe/MGcLqdgeP13J4w7YTqs="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnRuleGroupsNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export interface CfnRuleGroupsNamespaceProps {

    /**
     * The rules definition file for this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data
     */
    readonly data: string;

    /**
     * The name of the rule groups namespace. This property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name
     */
    readonly name: string;

    /**
     * The ARN of the workspace that contains this rule groups namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace
     */
    readonly workspace: string;

    /**
     * A list of key and value pairs for the workspace resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupsNamespaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupsNamespaceProps`
 *
 * @returns the result of the validation.
 */
function CfnRuleGroupsNamespacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.requiredValidator)(properties.data));
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('workspace', cdk.requiredValidator)(properties.workspace));
    errors.collect(cdk.propertyValidator('workspace', cdk.validateString)(properties.workspace));
    return errors.wrap('supplied properties not correct for "CfnRuleGroupsNamespaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::APS::RuleGroupsNamespace` resource
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupsNamespaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::APS::RuleGroupsNamespace` resource.
 */
// @ts-ignore TS6133
function cfnRuleGroupsNamespacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRuleGroupsNamespacePropsValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
        Name: cdk.stringToCloudFormation(properties.name),
        Workspace: cdk.stringToCloudFormation(properties.workspace),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRuleGroupsNamespacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupsNamespaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupsNamespaceProps>();
    ret.addPropertyResult('data', 'Data', cfn_parse.FromCloudFormation.getString(properties.Data));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('workspace', 'Workspace', cfn_parse.FromCloudFormation.getString(properties.Workspace));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::APS::RuleGroupsNamespace`
 *
 * The `AWS::APS::RuleGroupsNamespace` resource creates or updates a rule groups namespace within a Amazon Managed Service for Prometheus workspace. For more information, see [Recording rules and alerting rules](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) .
 *
 * @cloudformationResource AWS::APS::RuleGroupsNamespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export class CfnRuleGroupsNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::APS::RuleGroupsNamespace";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleGroupsNamespace {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnRuleGroupsNamespacePropsFromCloudFormation(resourceProperties);
        const ret = new CfnRuleGroupsNamespace(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the rules group namespace. For example, `arn:aws:aps:us-west-2:123456789012:rulegroupsnamespace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/amp=rules`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The rules definition file for this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data
     */
    public data: string;

    /**
     * The name of the rule groups namespace. This property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name
     */
    public name: string;

    /**
     * The ARN of the workspace that contains this rule groups namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace
     */
    public workspace: string;

    /**
     * A list of key and value pairs for the workspace resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::APS::RuleGroupsNamespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupsNamespaceProps) {
        super(scope, id, { type: CfnRuleGroupsNamespace.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'data', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'workspace', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.data = props.data;
        this.name = props.name;
        this.workspace = props.workspace;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::APS::RuleGroupsNamespace", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroupsNamespace.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            data: this.data,
            name: this.name,
            workspace: this.workspace,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRuleGroupsNamespacePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export interface CfnWorkspaceProps {

    /**
     * The alert manager definition for the workspace, as a string. For more information, see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alertmanagerdefinition
     */
    readonly alertManagerDefinition?: string;

    /**
     * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
     *
     * The alias can be as many as 100 characters and can include any type of characters. Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alias
     */
    readonly alias?: string;

    /**
     * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-loggingconfiguration
     */
    readonly loggingConfiguration?: CfnWorkspace.LoggingConfigurationProperty | cdk.IResolvable;

    /**
     * A list of tag keys and values to associate with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alertManagerDefinition', cdk.validateString)(properties.alertManagerDefinition));
    errors.collect(cdk.propertyValidator('alias', cdk.validateString)(properties.alias));
    errors.collect(cdk.propertyValidator('loggingConfiguration', CfnWorkspace_LoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnWorkspaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::APS::Workspace` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::APS::Workspace` resource.
 */
// @ts-ignore TS6133
function cfnWorkspacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspacePropsValidator(properties).assertSuccess();
    return {
        AlertManagerDefinition: cdk.stringToCloudFormation(properties.alertManagerDefinition),
        Alias: cdk.stringToCloudFormation(properties.alias),
        LoggingConfiguration: cfnWorkspaceLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
    ret.addPropertyResult('alertManagerDefinition', 'AlertManagerDefinition', properties.AlertManagerDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.AlertManagerDefinition) : undefined);
    ret.addPropertyResult('alias', 'Alias', properties.Alias != null ? cfn_parse.FromCloudFormation.getString(properties.Alias) : undefined);
    ret.addPropertyResult('loggingConfiguration', 'LoggingConfiguration', properties.LoggingConfiguration != null ? CfnWorkspaceLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::APS::Workspace`
 *
 * The `AWS::APS::Workspace` type specifies an Amazon Managed Service for Prometheus ( Amazon Managed Service for Prometheus ) workspace. A *workspace* is a logical and isolated Prometheus server dedicated to Prometheus resources such as metrics. You can have one or more workspaces in each Region in your account.
 *
 * @cloudformationResource AWS::APS::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::APS::Workspace";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWorkspacePropsFromCloudFormation(resourceProperties);
        const ret = new CfnWorkspace(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the workspace. For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The Prometheus endpoint attribute of the workspace. This is the endpoint prefix without the remote_write or query API appended. For example: `https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/` .
     * @cloudformationAttribute PrometheusEndpoint
     */
    public readonly attrPrometheusEndpoint: string;

    /**
     * The workspace ID. For example: `ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
     * @cloudformationAttribute WorkspaceId
     */
    public readonly attrWorkspaceId: string;

    /**
     * The alert manager definition for the workspace, as a string. For more information, see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alertmanagerdefinition
     */
    public alertManagerDefinition: string | undefined;

    /**
     * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
     *
     * The alias can be as many as 100 characters and can include any type of characters. Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alias
     */
    public alias: string | undefined;

    /**
     * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-loggingconfiguration
     */
    public loggingConfiguration: CfnWorkspace.LoggingConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A list of tag keys and values to associate with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::APS::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps = {}) {
        super(scope, id, { type: CfnWorkspace.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrPrometheusEndpoint = cdk.Token.asString(this.getAtt('PrometheusEndpoint', cdk.ResolutionTypeHint.STRING));
        this.attrWorkspaceId = cdk.Token.asString(this.getAtt('WorkspaceId', cdk.ResolutionTypeHint.STRING));

        this.alertManagerDefinition = props.alertManagerDefinition;
        this.alias = props.alias;
        this.loggingConfiguration = props.loggingConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::APS::Workspace", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            alertManagerDefinition: this.alertManagerDefinition,
            alias: this.alias,
            loggingConfiguration: this.loggingConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkspacePropsToCloudFormation(props);
    }
}

export namespace CfnWorkspace {
    /**
     * The LoggingConfiguration attribute sets the logging configuration for the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html
     */
    export interface LoggingConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the CloudWatch log group the logs are emitted to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html#cfn-aps-workspace-loggingconfiguration-loggrouparn
         */
        readonly logGroupArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_LoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logGroupArn', cdk.validateString)(properties.logGroupArn));
    return errors.wrap('supplied properties not correct for "LoggingConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::APS::Workspace.LoggingConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::APS::Workspace.LoggingConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceLoggingConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_LoggingConfigurationPropertyValidator(properties).assertSuccess();
    return {
        LogGroupArn: cdk.stringToCloudFormation(properties.logGroupArn),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.LoggingConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.LoggingConfigurationProperty>();
    ret.addPropertyResult('logGroupArn', 'LogGroupArn', properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
