// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:56.337Z","fingerprint":"06uU9FndKLNqeuvPwhFzC1hiOa1piangf0jUbSF0/vw="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export interface CfnAppProps {

    /**
     * A string containing a full Resilience Hub app template body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-apptemplatebody
     */
    readonly appTemplateBody: string;

    /**
     * The name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-name
     */
    readonly name: string;

    /**
     * An array of ResourceMapping objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resourcemappings
     */
    readonly resourceMappings: Array<CfnApp.ResourceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Assessment execution schedule with 'Daily' or 'Disabled' values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-appassessmentschedule
     */
    readonly appAssessmentSchedule?: string;

    /**
     * The optional description for an app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-description
     */
    readonly description?: string;

    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resiliencypolicyarn
     */
    readonly resiliencyPolicyArn?: string;

    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appAssessmentSchedule', cdk.validateString)(properties.appAssessmentSchedule));
    errors.collect(cdk.propertyValidator('appTemplateBody', cdk.requiredValidator)(properties.appTemplateBody));
    errors.collect(cdk.propertyValidator('appTemplateBody', cdk.validateString)(properties.appTemplateBody));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('resiliencyPolicyArn', cdk.validateString)(properties.resiliencyPolicyArn));
    errors.collect(cdk.propertyValidator('resourceMappings', cdk.requiredValidator)(properties.resourceMappings));
    errors.collect(cdk.propertyValidator('resourceMappings', cdk.listValidator(CfnApp_ResourceMappingPropertyValidator))(properties.resourceMappings));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAppProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResilienceHub::App` resource
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResilienceHub::App` resource.
 */
// @ts-ignore TS6133
function cfnAppPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppPropsValidator(properties).assertSuccess();
    return {
        AppTemplateBody: cdk.stringToCloudFormation(properties.appTemplateBody),
        Name: cdk.stringToCloudFormation(properties.name),
        ResourceMappings: cdk.listMapper(cfnAppResourceMappingPropertyToCloudFormation)(properties.resourceMappings),
        AppAssessmentSchedule: cdk.stringToCloudFormation(properties.appAssessmentSchedule),
        Description: cdk.stringToCloudFormation(properties.description),
        ResiliencyPolicyArn: cdk.stringToCloudFormation(properties.resiliencyPolicyArn),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
    ret.addPropertyResult('appTemplateBody', 'AppTemplateBody', cfn_parse.FromCloudFormation.getString(properties.AppTemplateBody));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('resourceMappings', 'ResourceMappings', cfn_parse.FromCloudFormation.getArray(CfnAppResourceMappingPropertyFromCloudFormation)(properties.ResourceMappings));
    ret.addPropertyResult('appAssessmentSchedule', 'AppAssessmentSchedule', properties.AppAssessmentSchedule != null ? cfn_parse.FromCloudFormation.getString(properties.AppAssessmentSchedule) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('resiliencyPolicyArn', 'ResiliencyPolicyArn', properties.ResiliencyPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResiliencyPolicyArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ResilienceHub::App`
 *
 * Creates a Resilience Hub application. A Resilience Hub application is a collection of AWS resources structured to prevent and recover AWS application disruptions. To describe a Resilience Hub application, you provide an application name, resources from one or more–up to five– AWS CloudFormation stacks, and an appropriate resiliency policy.
 *
 * After you create a Resilience Hub application, you publish it so that you can run a resiliency assessment on it. You can then use recommendations from the assessment to improve resiliency by running another assessment, comparing results, and then iterating the process until you achieve your goals for recovery time objective (RTO) and recovery point objective (RPO).
 *
 * @cloudformationResource AWS::ResilienceHub::App
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResilienceHub::App";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApp(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the app.
     * @cloudformationAttribute AppArn
     */
    public readonly attrAppArn: string;

    /**
     * A string containing a full Resilience Hub app template body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-apptemplatebody
     */
    public appTemplateBody: string;

    /**
     * The name for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-name
     */
    public name: string;

    /**
     * An array of ResourceMapping objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resourcemappings
     */
    public resourceMappings: Array<CfnApp.ResourceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Assessment execution schedule with 'Daily' or 'Disabled' values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-appassessmentschedule
     */
    public appAssessmentSchedule: string | undefined;

    /**
     * The optional description for an app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-description
     */
    public description: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-resiliencypolicyarn
     */
    public resiliencyPolicyArn: string | undefined;

    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-app.html#cfn-resiliencehub-app-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ResilienceHub::App`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
        super(scope, id, { type: CfnApp.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'appTemplateBody', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'resourceMappings', this);
        this.attrAppArn = cdk.Token.asString(this.getAtt('AppArn', cdk.ResolutionTypeHint.STRING));

        this.appTemplateBody = props.appTemplateBody;
        this.name = props.name;
        this.resourceMappings = props.resourceMappings;
        this.appAssessmentSchedule = props.appAssessmentSchedule;
        this.description = props.description;
        this.resiliencyPolicyArn = props.resiliencyPolicyArn;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResilienceHub::App", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            appTemplateBody: this.appTemplateBody,
            name: this.name,
            resourceMappings: this.resourceMappings,
            appAssessmentSchedule: this.appAssessmentSchedule,
            description: this.description,
            resiliencyPolicyArn: this.resiliencyPolicyArn,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAppPropsToCloudFormation(props);
    }
}

export namespace CfnApp {
    /**
     * Defines a physical resource identifier.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html
     */
    export interface PhysicalResourceIdProperty {
        /**
         * The AWS account that owns the physical resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsaccountid
         */
        readonly awsAccountId?: string;
        /**
         * The AWS Region that the physical resource is located in.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-awsregion
         */
        readonly awsRegion?: string;
        /**
         * The identifier of the physical resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-identifier
         */
        readonly identifier: string;
        /**
         * Specifies the type of physical resource identifier.
         *
         * - **Arn** - The resource identifier is an Amazon Resource Name (ARN) .
         * - **Native** - The resource identifier is a Resilience Hub-native identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-physicalresourceid.html#cfn-resiliencehub-app-physicalresourceid-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `PhysicalResourceIdProperty`
 *
 * @param properties - the TypeScript properties of a `PhysicalResourceIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_PhysicalResourceIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('awsAccountId', cdk.validateString)(properties.awsAccountId));
    errors.collect(cdk.propertyValidator('awsRegion', cdk.validateString)(properties.awsRegion));
    errors.collect(cdk.propertyValidator('identifier', cdk.requiredValidator)(properties.identifier));
    errors.collect(cdk.propertyValidator('identifier', cdk.validateString)(properties.identifier));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "PhysicalResourceIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResilienceHub::App.PhysicalResourceId` resource
 *
 * @param properties - the TypeScript properties of a `PhysicalResourceIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResilienceHub::App.PhysicalResourceId` resource.
 */
// @ts-ignore TS6133
function cfnAppPhysicalResourceIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_PhysicalResourceIdPropertyValidator(properties).assertSuccess();
    return {
        AwsAccountId: cdk.stringToCloudFormation(properties.awsAccountId),
        AwsRegion: cdk.stringToCloudFormation(properties.awsRegion),
        Identifier: cdk.stringToCloudFormation(properties.identifier),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnAppPhysicalResourceIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.PhysicalResourceIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.PhysicalResourceIdProperty>();
    ret.addPropertyResult('awsAccountId', 'AwsAccountId', properties.AwsAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AwsAccountId) : undefined);
    ret.addPropertyResult('awsRegion', 'AwsRegion', properties.AwsRegion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsRegion) : undefined);
    ret.addPropertyResult('identifier', 'Identifier', cfn_parse.FromCloudFormation.getString(properties.Identifier));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApp {
    /**
     * Defines a resource mapping.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html
     */
    export interface ResourceMappingProperty {
        /**
         * The name of the CloudFormation stack this resource is mapped to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-logicalstackname
         */
        readonly logicalStackName?: string;
        /**
         * Specifies the type of resource mapping.
         *
         * Valid Values: CfnStack | Resource | AppRegistryApp | ResourceGroup | Terraform
         *
         * - **AppRegistryApp** - The resource is mapped to another application. The name of the application is contained in the `appRegistryAppName` property.
         * - **CfnStack** - The resource is mapped to a CloudFormation stack. The name of the CloudFormation stack is contained in the `logicalStackName` property.
         * - **Resource** - The resource is mapped to another resource. The name of the resource is contained in the `resourceName` property.
         * - **ResourceGroup** - The resource is mapped to a resource group. The name of the resource group is contained in the `resourceGroupName` property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-mappingtype
         */
        readonly mappingType: string;
        /**
         * The identifier of this resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-physicalresourceid
         */
        readonly physicalResourceId: CfnApp.PhysicalResourceIdProperty | cdk.IResolvable;
        /**
         * The name of the resource this resource is mapped to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-resourcename
         */
        readonly resourceName?: string;
        /**
         * The short name of the Terraform source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-app-resourcemapping.html#cfn-resiliencehub-app-resourcemapping-terraformsourcename
         */
        readonly terraformSourceName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnApp_ResourceMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logicalStackName', cdk.validateString)(properties.logicalStackName));
    errors.collect(cdk.propertyValidator('mappingType', cdk.requiredValidator)(properties.mappingType));
    errors.collect(cdk.propertyValidator('mappingType', cdk.validateString)(properties.mappingType));
    errors.collect(cdk.propertyValidator('physicalResourceId', cdk.requiredValidator)(properties.physicalResourceId));
    errors.collect(cdk.propertyValidator('physicalResourceId', CfnApp_PhysicalResourceIdPropertyValidator)(properties.physicalResourceId));
    errors.collect(cdk.propertyValidator('resourceName', cdk.validateString)(properties.resourceName));
    errors.collect(cdk.propertyValidator('terraformSourceName', cdk.validateString)(properties.terraformSourceName));
    return errors.wrap('supplied properties not correct for "ResourceMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResilienceHub::App.ResourceMapping` resource
 *
 * @param properties - the TypeScript properties of a `ResourceMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResilienceHub::App.ResourceMapping` resource.
 */
// @ts-ignore TS6133
function cfnAppResourceMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApp_ResourceMappingPropertyValidator(properties).assertSuccess();
    return {
        LogicalStackName: cdk.stringToCloudFormation(properties.logicalStackName),
        MappingType: cdk.stringToCloudFormation(properties.mappingType),
        PhysicalResourceId: cfnAppPhysicalResourceIdPropertyToCloudFormation(properties.physicalResourceId),
        ResourceName: cdk.stringToCloudFormation(properties.resourceName),
        TerraformSourceName: cdk.stringToCloudFormation(properties.terraformSourceName),
    };
}

// @ts-ignore TS6133
function CfnAppResourceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.ResourceMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.ResourceMappingProperty>();
    ret.addPropertyResult('logicalStackName', 'LogicalStackName', properties.LogicalStackName != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalStackName) : undefined);
    ret.addPropertyResult('mappingType', 'MappingType', cfn_parse.FromCloudFormation.getString(properties.MappingType));
    ret.addPropertyResult('physicalResourceId', 'PhysicalResourceId', CfnAppPhysicalResourceIdPropertyFromCloudFormation(properties.PhysicalResourceId));
    ret.addPropertyResult('resourceName', 'ResourceName', properties.ResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceName) : undefined);
    ret.addPropertyResult('terraformSourceName', 'TerraformSourceName', properties.TerraformSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.TerraformSourceName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResiliencyPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export interface CfnResiliencyPolicyProps {

    /**
     * The resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policy
     */
    readonly policy: { [key: string]: (CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The name of the policy
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policyname
     */
    readonly policyName: string;

    /**
     * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tier
     */
    readonly tier: string;

    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-datalocationconstraint
     */
    readonly dataLocationConstraint?: string;

    /**
     * The description for the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policydescription
     */
    readonly policyDescription?: string;

    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnResiliencyPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResiliencyPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResiliencyPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataLocationConstraint', cdk.validateString)(properties.dataLocationConstraint));
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.hashValidator(CfnResiliencyPolicy_FailurePolicyPropertyValidator))(properties.policy));
    errors.collect(cdk.propertyValidator('policyDescription', cdk.validateString)(properties.policyDescription));
    errors.collect(cdk.propertyValidator('policyName', cdk.requiredValidator)(properties.policyName));
    errors.collect(cdk.propertyValidator('policyName', cdk.validateString)(properties.policyName));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('tier', cdk.requiredValidator)(properties.tier));
    errors.collect(cdk.propertyValidator('tier', cdk.validateString)(properties.tier));
    return errors.wrap('supplied properties not correct for "CfnResiliencyPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResilienceHub::ResiliencyPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResiliencyPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResilienceHub::ResiliencyPolicy` resource.
 */
// @ts-ignore TS6133
function cfnResiliencyPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResiliencyPolicyPropsValidator(properties).assertSuccess();
    return {
        Policy: cdk.hashMapper(cfnResiliencyPolicyFailurePolicyPropertyToCloudFormation)(properties.policy),
        PolicyName: cdk.stringToCloudFormation(properties.policyName),
        Tier: cdk.stringToCloudFormation(properties.tier),
        DataLocationConstraint: cdk.stringToCloudFormation(properties.dataLocationConstraint),
        PolicyDescription: cdk.stringToCloudFormation(properties.policyDescription),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnResiliencyPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResiliencyPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResiliencyPolicyProps>();
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getMap(CfnResiliencyPolicyFailurePolicyPropertyFromCloudFormation)(properties.Policy));
    ret.addPropertyResult('policyName', 'PolicyName', cfn_parse.FromCloudFormation.getString(properties.PolicyName));
    ret.addPropertyResult('tier', 'Tier', cfn_parse.FromCloudFormation.getString(properties.Tier));
    ret.addPropertyResult('dataLocationConstraint', 'DataLocationConstraint', properties.DataLocationConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.DataLocationConstraint) : undefined);
    ret.addPropertyResult('policyDescription', 'PolicyDescription', properties.PolicyDescription != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyDescription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ResilienceHub::ResiliencyPolicy`
 *
 * Defines a resiliency policy.
 *
 * @cloudformationResource AWS::ResilienceHub::ResiliencyPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html
 */
export class CfnResiliencyPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResilienceHub::ResiliencyPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResiliencyPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResiliencyPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResiliencyPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resiliency policy.
     * @cloudformationAttribute PolicyArn
     */
    public readonly attrPolicyArn: string;

    /**
     * The resiliency policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policy
     */
    public policy: { [key: string]: (CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The name of the policy
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policyname
     */
    public policyName: string;

    /**
     * The tier for this resiliency policy, ranging from the highest severity ( `MissionCritical` ) to lowest ( `NonCritical` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tier
     */
    public tier: string;

    /**
     * Specifies a high-level geographical location constraint for where your resilience policy data can be stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-datalocationconstraint
     */
    public dataLocationConstraint: string | undefined;

    /**
     * The description for the policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-policydescription
     */
    public policyDescription: string | undefined;

    /**
     * The tags assigned to the resource. A tag is a label that you assign to an AWS resource. Each tag consists of a key/value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resiliencehub-resiliencypolicy.html#cfn-resiliencehub-resiliencypolicy-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ResilienceHub::ResiliencyPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResiliencyPolicyProps) {
        super(scope, id, { type: CfnResiliencyPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policy', this);
        cdk.requireProperty(props, 'policyName', this);
        cdk.requireProperty(props, 'tier', this);
        this.attrPolicyArn = cdk.Token.asString(this.getAtt('PolicyArn', cdk.ResolutionTypeHint.STRING));

        this.policy = props.policy;
        this.policyName = props.policyName;
        this.tier = props.tier;
        this.dataLocationConstraint = props.dataLocationConstraint;
        this.policyDescription = props.policyDescription;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResilienceHub::ResiliencyPolicy", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResiliencyPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policy: this.policy,
            policyName: this.policyName,
            tier: this.tier,
            dataLocationConstraint: this.dataLocationConstraint,
            policyDescription: this.policyDescription,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResiliencyPolicyPropsToCloudFormation(props);
    }
}

export namespace CfnResiliencyPolicy {
    /**
     * Defines a failure policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html
     */
    export interface FailurePolicyProperty {
        /**
         * The Recovery Point Objective (RPO), in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rpoinsecs
         */
        readonly rpoInSecs: number;
        /**
         * The Recovery Time Objective (RTO), in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resiliencehub-resiliencypolicy-failurepolicy.html#cfn-resiliencehub-resiliencypolicy-failurepolicy-rtoinsecs
         */
        readonly rtoInSecs: number;
    }
}

/**
 * Determine whether the given properties match those of a `FailurePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `FailurePolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnResiliencyPolicy_FailurePolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rpoInSecs', cdk.requiredValidator)(properties.rpoInSecs));
    errors.collect(cdk.propertyValidator('rpoInSecs', cdk.validateNumber)(properties.rpoInSecs));
    errors.collect(cdk.propertyValidator('rtoInSecs', cdk.requiredValidator)(properties.rtoInSecs));
    errors.collect(cdk.propertyValidator('rtoInSecs', cdk.validateNumber)(properties.rtoInSecs));
    return errors.wrap('supplied properties not correct for "FailurePolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResilienceHub::ResiliencyPolicy.FailurePolicy` resource
 *
 * @param properties - the TypeScript properties of a `FailurePolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResilienceHub::ResiliencyPolicy.FailurePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResiliencyPolicyFailurePolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResiliencyPolicy_FailurePolicyPropertyValidator(properties).assertSuccess();
    return {
        RpoInSecs: cdk.numberToCloudFormation(properties.rpoInSecs),
        RtoInSecs: cdk.numberToCloudFormation(properties.rtoInSecs),
    };
}

// @ts-ignore TS6133
function CfnResiliencyPolicyFailurePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResiliencyPolicy.FailurePolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResiliencyPolicy.FailurePolicyProperty>();
    ret.addPropertyResult('rpoInSecs', 'RpoInSecs', cfn_parse.FromCloudFormation.getNumber(properties.RpoInSecs));
    ret.addPropertyResult('rtoInSecs', 'RtoInSecs', cfn_parse.FromCloudFormation.getNumber(properties.RtoInSecs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
