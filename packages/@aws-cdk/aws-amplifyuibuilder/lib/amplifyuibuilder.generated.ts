// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:01.115Z","fingerprint":"K2pM2KopgfofCcj08y9pmTyza90MBBHycXb07WxOnYY="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnComponent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html
 */
export interface CfnComponentProps {

    /**
     * The information to connect a component's properties to data at runtime. You can't specify `tags` as a valid property for `bindingProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-bindingproperties
     */
    readonly bindingProperties: { [key: string]: (CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The type of the component. This can be an Amplify custom UI component or another custom component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-componenttype
     */
    readonly componentType: string;

    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-name
     */
    readonly name: string;

    /**
     * Describes the component's properties that can be overriden in a customized instance of the component. You can't specify `tags` as a valid property for `overrides` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-overrides
     */
    readonly overrides: any | cdk.IResolvable;

    /**
     * Describes the component's properties. You can't specify `tags` as a valid property for `properties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-properties
     */
    readonly properties: { [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * A list of the component's variants. A variant is a unique style configuration of a main component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-variants
     */
    readonly variants: Array<CfnComponent.ComponentVariantProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of the component's `ComponentChild` instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-children
     */
    readonly children?: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The data binding configuration for the component's properties. Use this for a collection component. You can't specify `tags` as a valid property for `collectionProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-collectionproperties
     */
    readonly collectionProperties?: { [key: string]: (CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Describes the events that can be raised on the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-events
     */
    readonly events?: { [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The schema version of the component when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-schemaversion
     */
    readonly schemaVersion?: string;

    /**
     * The unique ID of the component in its original source system, such as Figma.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-sourceid
     */
    readonly sourceId?: string;

    /**
     * One or more key-value pairs to use when tagging the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the result of the validation.
 */
function CfnComponentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bindingProperties', cdk.requiredValidator)(properties.bindingProperties));
    errors.collect(cdk.propertyValidator('bindingProperties', cdk.hashValidator(CfnComponent_ComponentBindingPropertiesValuePropertyValidator))(properties.bindingProperties));
    errors.collect(cdk.propertyValidator('children', cdk.listValidator(CfnComponent_ComponentChildPropertyValidator))(properties.children));
    errors.collect(cdk.propertyValidator('collectionProperties', cdk.hashValidator(CfnComponent_ComponentDataConfigurationPropertyValidator))(properties.collectionProperties));
    errors.collect(cdk.propertyValidator('componentType', cdk.requiredValidator)(properties.componentType));
    errors.collect(cdk.propertyValidator('componentType', cdk.validateString)(properties.componentType));
    errors.collect(cdk.propertyValidator('events', cdk.hashValidator(CfnComponent_ComponentEventPropertyValidator))(properties.events));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overrides', cdk.requiredValidator)(properties.overrides));
    errors.collect(cdk.propertyValidator('overrides', cdk.validateObject)(properties.overrides));
    errors.collect(cdk.propertyValidator('properties', cdk.requiredValidator)(properties.properties));
    errors.collect(cdk.propertyValidator('properties', cdk.hashValidator(CfnComponent_ComponentPropertyPropertyValidator))(properties.properties));
    errors.collect(cdk.propertyValidator('schemaVersion', cdk.validateString)(properties.schemaVersion));
    errors.collect(cdk.propertyValidator('sourceId', cdk.validateString)(properties.sourceId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('variants', cdk.requiredValidator)(properties.variants));
    errors.collect(cdk.propertyValidator('variants', cdk.listValidator(CfnComponent_ComponentVariantPropertyValidator))(properties.variants));
    return errors.wrap('supplied properties not correct for "CfnComponentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component` resource
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component` resource.
 */
// @ts-ignore TS6133
function cfnComponentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponentPropsValidator(properties).assertSuccess();
    return {
        BindingProperties: cdk.hashMapper(cfnComponentComponentBindingPropertiesValuePropertyToCloudFormation)(properties.bindingProperties),
        ComponentType: cdk.stringToCloudFormation(properties.componentType),
        Name: cdk.stringToCloudFormation(properties.name),
        Overrides: cdk.objectToCloudFormation(properties.overrides),
        Properties: cdk.hashMapper(cfnComponentComponentPropertyPropertyToCloudFormation)(properties.properties),
        Variants: cdk.listMapper(cfnComponentComponentVariantPropertyToCloudFormation)(properties.variants),
        Children: cdk.listMapper(cfnComponentComponentChildPropertyToCloudFormation)(properties.children),
        CollectionProperties: cdk.hashMapper(cfnComponentComponentDataConfigurationPropertyToCloudFormation)(properties.collectionProperties),
        Events: cdk.hashMapper(cfnComponentComponentEventPropertyToCloudFormation)(properties.events),
        SchemaVersion: cdk.stringToCloudFormation(properties.schemaVersion),
        SourceId: cdk.stringToCloudFormation(properties.sourceId),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentProps>();
    ret.addPropertyResult('bindingProperties', 'BindingProperties', cfn_parse.FromCloudFormation.getMap(CfnComponentComponentBindingPropertiesValuePropertyFromCloudFormation)(properties.BindingProperties));
    ret.addPropertyResult('componentType', 'ComponentType', cfn_parse.FromCloudFormation.getString(properties.ComponentType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('overrides', 'Overrides', cfn_parse.FromCloudFormation.getAny(properties.Overrides));
    ret.addPropertyResult('properties', 'Properties', cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Properties));
    ret.addPropertyResult('variants', 'Variants', cfn_parse.FromCloudFormation.getArray(CfnComponentComponentVariantPropertyFromCloudFormation)(properties.Variants));
    ret.addPropertyResult('children', 'Children', properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentChildPropertyFromCloudFormation)(properties.Children) : undefined);
    ret.addPropertyResult('collectionProperties', 'CollectionProperties', properties.CollectionProperties != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentDataConfigurationPropertyFromCloudFormation)(properties.CollectionProperties) : undefined);
    ret.addPropertyResult('events', 'Events', properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentEventPropertyFromCloudFormation)(properties.Events) : undefined);
    ret.addPropertyResult('schemaVersion', 'SchemaVersion', properties.SchemaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersion) : undefined);
    ret.addPropertyResult('sourceId', 'SourceId', properties.SourceId != null ? cfn_parse.FromCloudFormation.getString(properties.SourceId) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmplifyUIBuilder::Component`
 *
 * The AWS::AmplifyUIBuilder::Component resource specifies a component within an Amplify app. A component is a user interface (UI) element that you can customize. Use `ComponentChild` to configure an instance of a `Component` . A `ComponentChild` instance inherits the configuration of the main `Component` .
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Component
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html
 */
export class CfnComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Component";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponent {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnComponentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnComponent(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique ID for the Amplify app.
     * @cloudformationAttribute AppId
     */
    public readonly attrAppId: string;

    /**
     * The name of the backend environment that is a part of the Amplify app.
     * @cloudformationAttribute EnvironmentName
     */
    public readonly attrEnvironmentName: string;

    /**
     * The unique ID of the component.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The information to connect a component's properties to data at runtime. You can't specify `tags` as a valid property for `bindingProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-bindingproperties
     */
    public bindingProperties: { [key: string]: (CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The type of the component. This can be an Amplify custom UI component or another custom component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-componenttype
     */
    public componentType: string;

    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-name
     */
    public name: string;

    /**
     * Describes the component's properties that can be overriden in a customized instance of the component. You can't specify `tags` as a valid property for `overrides` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-overrides
     */
    public overrides: any | cdk.IResolvable;

    /**
     * Describes the component's properties. You can't specify `tags` as a valid property for `properties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-properties
     */
    public properties: { [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * A list of the component's variants. A variant is a unique style configuration of a main component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-variants
     */
    public variants: Array<CfnComponent.ComponentVariantProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of the component's `ComponentChild` instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-children
     */
    public children: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The data binding configuration for the component's properties. Use this for a collection component. You can't specify `tags` as a valid property for `collectionProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-collectionproperties
     */
    public collectionProperties: { [key: string]: (CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * Describes the events that can be raised on the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-events
     */
    public events: { [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The schema version of the component when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-schemaversion
     */
    public schemaVersion: string | undefined;

    /**
     * The unique ID of the component in its original source system, such as Figma.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-sourceid
     */
    public sourceId: string | undefined;

    /**
     * One or more key-value pairs to use when tagging the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AmplifyUIBuilder::Component`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentProps) {
        super(scope, id, { type: CfnComponent.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bindingProperties', this);
        cdk.requireProperty(props, 'componentType', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'overrides', this);
        cdk.requireProperty(props, 'properties', this);
        cdk.requireProperty(props, 'variants', this);
        this.attrAppId = cdk.Token.asString(this.getAtt('AppId', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentName = cdk.Token.asString(this.getAtt('EnvironmentName', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.bindingProperties = props.bindingProperties;
        this.componentType = props.componentType;
        this.name = props.name;
        this.overrides = props.overrides;
        this.properties = props.properties;
        this.variants = props.variants;
        this.children = props.children;
        this.collectionProperties = props.collectionProperties;
        this.events = props.events;
        this.schemaVersion = props.schemaVersion;
        this.sourceId = props.sourceId;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Component", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponent.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            bindingProperties: this.bindingProperties,
            componentType: this.componentType,
            name: this.name,
            overrides: this.overrides,
            properties: this.properties,
            variants: this.variants,
            children: this.children,
            collectionProperties: this.collectionProperties,
            events: this.events,
            schemaVersion: this.schemaVersion,
            sourceId: this.sourceId,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnComponentPropsToCloudFormation(props);
    }
}

export namespace CfnComponent {
    /**
     * The `ActionParameters` property specifies the event action configuration for an element of a `Component` or `ComponentChild` . Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components. `ActionParameters` defines the action that is performed when an event occurs on the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html
     */
    export interface ActionParametersProperty {
        /**
         * The HTML anchor link to the location to open. Specify this value for a navigation action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-anchor
         */
        readonly anchor?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * A dictionary of key-value pairs mapping Amplify Studio properties to fields in a data model. Use when the action performs an operation on an Amplify DataStore model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-fields
         */
        readonly fields?: { [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * Specifies whether the user should be signed out globally. Specify this value for an auth sign out action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-global
         */
        readonly global?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * The unique ID of the component that the `ActionParameters` apply to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-id
         */
        readonly id?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * The name of the data model. Use when the action performs an operation on an Amplify DataStore model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-model
         */
        readonly model?: string;
        /**
         * A key-value pair that specifies the state property name and its initial value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-state
         */
        readonly state?: CfnComponent.MutationActionSetStateParameterProperty | cdk.IResolvable;
        /**
         * The element within the same component to modify when the action occurs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-target
         */
        readonly target?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * The type of navigation action. Valid values are `url` and `anchor` . This value is required for a navigation action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-type
         */
        readonly type?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * The URL to the location to open. Specify this value for a navigation action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-url
         */
        readonly url?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ActionParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ActionParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('anchor', CfnComponent_ComponentPropertyPropertyValidator)(properties.anchor));
    errors.collect(cdk.propertyValidator('fields', cdk.hashValidator(CfnComponent_ComponentPropertyPropertyValidator))(properties.fields));
    errors.collect(cdk.propertyValidator('global', CfnComponent_ComponentPropertyPropertyValidator)(properties.global));
    errors.collect(cdk.propertyValidator('id', CfnComponent_ComponentPropertyPropertyValidator)(properties.id));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('state', CfnComponent_MutationActionSetStateParameterPropertyValidator)(properties.state));
    errors.collect(cdk.propertyValidator('target', CfnComponent_ComponentPropertyPropertyValidator)(properties.target));
    errors.collect(cdk.propertyValidator('type', CfnComponent_ComponentPropertyPropertyValidator)(properties.type));
    errors.collect(cdk.propertyValidator('url', CfnComponent_ComponentPropertyPropertyValidator)(properties.url));
    return errors.wrap('supplied properties not correct for "ActionParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ActionParameters` resource
 *
 * @param properties - the TypeScript properties of a `ActionParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ActionParameters` resource.
 */
// @ts-ignore TS6133
function cfnComponentActionParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ActionParametersPropertyValidator(properties).assertSuccess();
    return {
        Anchor: cfnComponentComponentPropertyPropertyToCloudFormation(properties.anchor),
        Fields: cdk.hashMapper(cfnComponentComponentPropertyPropertyToCloudFormation)(properties.fields),
        Global: cfnComponentComponentPropertyPropertyToCloudFormation(properties.global),
        Id: cfnComponentComponentPropertyPropertyToCloudFormation(properties.id),
        Model: cdk.stringToCloudFormation(properties.model),
        State: cfnComponentMutationActionSetStateParameterPropertyToCloudFormation(properties.state),
        Target: cfnComponentComponentPropertyPropertyToCloudFormation(properties.target),
        Type: cfnComponentComponentPropertyPropertyToCloudFormation(properties.type),
        Url: cfnComponentComponentPropertyPropertyToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnComponentActionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ActionParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ActionParametersProperty>();
    ret.addPropertyResult('anchor', 'Anchor', properties.Anchor != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Anchor) : undefined);
    ret.addPropertyResult('fields', 'Fields', properties.Fields != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Fields) : undefined);
    ret.addPropertyResult('global', 'Global', properties.Global != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Global) : undefined);
    ret.addPropertyResult('id', 'Id', properties.Id != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Id) : undefined);
    ret.addPropertyResult('model', 'Model', properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? CfnComponentMutationActionSetStateParameterPropertyFromCloudFormation(properties.State) : undefined);
    ret.addPropertyResult('target', 'Target', properties.Target != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Target) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Type) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentBindingPropertiesValue` property specifies the data binding configuration for a component at runtime. You can use `ComponentBindingPropertiesValue` to add exposed properties to a component to allow different values to be entered when a component is reused in different places in an app.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html
     */
    export interface ComponentBindingPropertiesValueProperty {
        /**
         * Describes the properties to customize with data at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-bindingproperties
         */
        readonly bindingProperties?: CfnComponent.ComponentBindingPropertiesValuePropertiesProperty | cdk.IResolvable;
        /**
         * The default value of the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * The property type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentBindingPropertiesValueProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentBindingPropertiesValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bindingProperties', CfnComponent_ComponentBindingPropertiesValuePropertiesPropertyValidator)(properties.bindingProperties));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ComponentBindingPropertiesValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentBindingPropertiesValue` resource
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentBindingPropertiesValue` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentBindingPropertiesValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentBindingPropertiesValuePropertyValidator(properties).assertSuccess();
    return {
        BindingProperties: cfnComponentComponentBindingPropertiesValuePropertiesPropertyToCloudFormation(properties.bindingProperties),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentBindingPropertiesValueProperty>();
    ret.addPropertyResult('bindingProperties', 'BindingProperties', properties.BindingProperties != null ? CfnComponentComponentBindingPropertiesValuePropertiesPropertyFromCloudFormation(properties.BindingProperties) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentBindingPropertiesValueProperties` property specifies the data binding configuration for a specific property using data stored in AWS . For AWS connected properties, you can bind a property to data stored in an Amazon S3 bucket, an Amplify DataStore model or an authenticated user attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html
     */
    export interface ComponentBindingPropertiesValuePropertiesProperty {
        /**
         * An Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-bucket
         */
        readonly bucket?: string;
        /**
         * The default value to assign to the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * The field to bind the data to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-field
         */
        readonly field?: string;
        /**
         * The storage key for an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-key
         */
        readonly key?: string;
        /**
         * An Amplify DataStore model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-model
         */
        readonly model?: string;
        /**
         * A list of predicates for binding a component's properties to data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-predicates
         */
        readonly predicates?: Array<CfnComponent.PredicateProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * An authenticated user attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-userattribute
         */
        readonly userAttribute?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentBindingPropertiesValuePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValuePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentBindingPropertiesValuePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('predicates', cdk.listValidator(CfnComponent_PredicatePropertyValidator))(properties.predicates));
    errors.collect(cdk.propertyValidator('userAttribute', cdk.validateString)(properties.userAttribute));
    return errors.wrap('supplied properties not correct for "ComponentBindingPropertiesValuePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentBindingPropertiesValueProperties` resource
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValuePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentBindingPropertiesValueProperties` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentBindingPropertiesValuePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentBindingPropertiesValuePropertiesPropertyValidator(properties).assertSuccess();
    return {
        Bucket: cdk.stringToCloudFormation(properties.bucket),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Field: cdk.stringToCloudFormation(properties.field),
        Key: cdk.stringToCloudFormation(properties.key),
        Model: cdk.stringToCloudFormation(properties.model),
        Predicates: cdk.listMapper(cfnComponentPredicatePropertyToCloudFormation)(properties.predicates),
        UserAttribute: cdk.stringToCloudFormation(properties.userAttribute),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentBindingPropertiesValuePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentBindingPropertiesValuePropertiesProperty>();
    ret.addPropertyResult('bucket', 'Bucket', properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('model', 'Model', properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined);
    ret.addPropertyResult('predicates', 'Predicates', properties.Predicates != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.Predicates) : undefined);
    ret.addPropertyResult('userAttribute', 'UserAttribute', properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentChild` property specifies a nested UI configuration within a parent `Component` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html
     */
    export interface ComponentChildProperty {
        /**
         * The list of `ComponentChild` instances for this component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-children
         */
        readonly children?: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The type of the child component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-componenttype
         */
        readonly componentType: string;
        /**
         * Describes the events that can be raised on the child component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-events
         */
        readonly events?: { [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * The name of the child component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-name
         */
        readonly name: string;
        /**
         * Describes the properties of the child component. You can't specify `tags` as a valid property for `properties` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-properties
         */
        readonly properties: { [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentChildProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentChildProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentChildPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('children', cdk.listValidator(CfnComponent_ComponentChildPropertyValidator))(properties.children));
    errors.collect(cdk.propertyValidator('componentType', cdk.requiredValidator)(properties.componentType));
    errors.collect(cdk.propertyValidator('componentType', cdk.validateString)(properties.componentType));
    errors.collect(cdk.propertyValidator('events', cdk.hashValidator(CfnComponent_ComponentEventPropertyValidator))(properties.events));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('properties', cdk.requiredValidator)(properties.properties));
    errors.collect(cdk.propertyValidator('properties', cdk.hashValidator(CfnComponent_ComponentPropertyPropertyValidator))(properties.properties));
    return errors.wrap('supplied properties not correct for "ComponentChildProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentChild` resource
 *
 * @param properties - the TypeScript properties of a `ComponentChildProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentChild` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentChildPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentChildPropertyValidator(properties).assertSuccess();
    return {
        Children: cdk.listMapper(cfnComponentComponentChildPropertyToCloudFormation)(properties.children),
        ComponentType: cdk.stringToCloudFormation(properties.componentType),
        Events: cdk.hashMapper(cfnComponentComponentEventPropertyToCloudFormation)(properties.events),
        Name: cdk.stringToCloudFormation(properties.name),
        Properties: cdk.hashMapper(cfnComponentComponentPropertyPropertyToCloudFormation)(properties.properties),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentChildPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentChildProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentChildProperty>();
    ret.addPropertyResult('children', 'Children', properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentChildPropertyFromCloudFormation)(properties.Children) : undefined);
    ret.addPropertyResult('componentType', 'ComponentType', cfn_parse.FromCloudFormation.getString(properties.ComponentType));
    ret.addPropertyResult('events', 'Events', properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentEventPropertyFromCloudFormation)(properties.Events) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('properties', 'Properties', cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Properties));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentConditionProperty` property specifies a conditional expression for setting a component property. Use `ComponentConditionProperty` to set a property to different values conditionally, based on the value of another property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html
     */
    export interface ComponentConditionPropertyProperty {
        /**
         * The value to assign to the property if the condition is not met.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-else
         */
        readonly else?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
        /**
         * The name of a field. Specify this when the property is a data model.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-field
         */
        readonly field?: string;
        /**
         * The value of the property to evaluate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operand
         */
        readonly operand?: string;
        /**
         * The type of the property to evaluate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operandtype
         */
        readonly operandType?: string;
        /**
         * The operator to use to perform the evaluation, such as `eq` to represent equals.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operator
         */
        readonly operator?: string;
        /**
         * The name of the conditional property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-property
         */
        readonly property?: string;
        /**
         * The value to assign to the property if the condition is met.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-then
         */
        readonly then?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentConditionPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConditionPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentConditionPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('else', CfnComponent_ComponentPropertyPropertyValidator)(properties.else));
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('operand', cdk.validateString)(properties.operand));
    errors.collect(cdk.propertyValidator('operandType', cdk.validateString)(properties.operandType));
    errors.collect(cdk.propertyValidator('operator', cdk.validateString)(properties.operator));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    errors.collect(cdk.propertyValidator('then', CfnComponent_ComponentPropertyPropertyValidator)(properties.then));
    return errors.wrap('supplied properties not correct for "ComponentConditionPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentConditionProperty` resource
 *
 * @param properties - the TypeScript properties of a `ComponentConditionPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentConditionProperty` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentConditionPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentConditionPropertyPropertyValidator(properties).assertSuccess();
    return {
        Else: cfnComponentComponentPropertyPropertyToCloudFormation(properties.else),
        Field: cdk.stringToCloudFormation(properties.field),
        Operand: cdk.stringToCloudFormation(properties.operand),
        OperandType: cdk.stringToCloudFormation(properties.operandType),
        Operator: cdk.stringToCloudFormation(properties.operator),
        Property: cdk.stringToCloudFormation(properties.property),
        Then: cfnComponentComponentPropertyPropertyToCloudFormation(properties.then),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentConditionPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentConditionPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentConditionPropertyProperty>();
    ret.addPropertyResult('else', 'Else', properties.Else != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Else) : undefined);
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('operand', 'Operand', properties.Operand != null ? cfn_parse.FromCloudFormation.getString(properties.Operand) : undefined);
    ret.addPropertyResult('operandType', 'OperandType', properties.OperandType != null ? cfn_parse.FromCloudFormation.getString(properties.OperandType) : undefined);
    ret.addPropertyResult('operator', 'Operator', properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined);
    ret.addPropertyResult('property', 'Property', properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined);
    ret.addPropertyResult('then', 'Then', properties.Then != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Then) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentDataConfiguration` property specifies the configuration for binding a component's properties to data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html
     */
    export interface ComponentDataConfigurationProperty {
        /**
         * A list of IDs to use to bind data to a component. Use this property to bind specifically chosen data, rather than data retrieved from a query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-identifiers
         */
        readonly identifiers?: string[];
        /**
         * The name of the data model to use to bind data to a component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-model
         */
        readonly model: string;
        /**
         * Represents the conditional logic to use when binding data to a component. Use this property to retrieve only a subset of the data in a collection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-predicate
         */
        readonly predicate?: CfnComponent.PredicateProperty | cdk.IResolvable;
        /**
         * Describes how to sort the component's properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-sort
         */
        readonly sort?: Array<CfnComponent.SortPropertyProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentDataConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDataConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentDataConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('identifiers', cdk.listValidator(cdk.validateString))(properties.identifiers));
    errors.collect(cdk.propertyValidator('model', cdk.requiredValidator)(properties.model));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('predicate', CfnComponent_PredicatePropertyValidator)(properties.predicate));
    errors.collect(cdk.propertyValidator('sort', cdk.listValidator(CfnComponent_SortPropertyPropertyValidator))(properties.sort));
    return errors.wrap('supplied properties not correct for "ComponentDataConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentDataConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ComponentDataConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentDataConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentDataConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentDataConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Identifiers: cdk.listMapper(cdk.stringToCloudFormation)(properties.identifiers),
        Model: cdk.stringToCloudFormation(properties.model),
        Predicate: cfnComponentPredicatePropertyToCloudFormation(properties.predicate),
        Sort: cdk.listMapper(cfnComponentSortPropertyPropertyToCloudFormation)(properties.sort),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentDataConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentDataConfigurationProperty>();
    ret.addPropertyResult('identifiers', 'Identifiers', properties.Identifiers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Identifiers) : undefined);
    ret.addPropertyResult('model', 'Model', cfn_parse.FromCloudFormation.getString(properties.Model));
    ret.addPropertyResult('predicate', 'Predicate', properties.Predicate != null ? CfnComponentPredicatePropertyFromCloudFormation(properties.Predicate) : undefined);
    ret.addPropertyResult('sort', 'Sort', properties.Sort != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentSortPropertyPropertyFromCloudFormation)(properties.Sort) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentEvent` property specifies the configuration of an event. You can bind an event and a corresponding action to a `Component` or a `ComponentChild` . A button click is an example of an event.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html
     */
    export interface ComponentEventProperty {
        /**
         * The action to perform when a specific event is raised.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html#cfn-amplifyuibuilder-component-componentevent-action
         */
        readonly action?: string;
        /**
         * Describes information about the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html#cfn-amplifyuibuilder-component-componentevent-parameters
         */
        readonly parameters?: CfnComponent.ActionParametersProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentEventProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentEventProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentEventPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('parameters', CfnComponent_ActionParametersPropertyValidator)(properties.parameters));
    return errors.wrap('supplied properties not correct for "ComponentEventProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentEvent` resource
 *
 * @param properties - the TypeScript properties of a `ComponentEventProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentEvent` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentEventPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentEventPropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Parameters: cfnComponentActionParametersPropertyToCloudFormation(properties.parameters),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentEventProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentEventProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? CfnComponentActionParametersPropertyFromCloudFormation(properties.Parameters) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentProperty` property specifies the configuration for all of a component's properties. Use `ComponentProperty` to specify the values to render or bind by default.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html
     */
    export interface ComponentPropertyProperty {
        /**
         * The information to bind the component property to data at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-bindingproperties
         */
        readonly bindingProperties?: CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable;
        /**
         * The information to bind the component property to form data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-bindings
         */
        readonly bindings?: { [key: string]: (CfnComponent.FormBindingElementProperty | cdk.IResolvable) } | cdk.IResolvable;
        /**
         * The information to bind the component property to data at runtime. Use this for collection components.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-collectionbindingproperties
         */
        readonly collectionBindingProperties?: CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable;
        /**
         * The name of the component that is affected by an event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-componentname
         */
        readonly componentName?: string;
        /**
         * A list of component properties to concatenate to create the value to assign to this component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-concat
         */
        readonly concat?: Array<CfnComponent.ComponentPropertyProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The conditional expression to use to assign a value to the component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-condition
         */
        readonly condition?: CfnComponent.ComponentConditionPropertyProperty | cdk.IResolvable;
        /**
         * Specifies whether the user configured the property in Amplify Studio after importing it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-configured
         */
        readonly configured?: boolean | cdk.IResolvable;
        /**
         * The default value to assign to the component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * An event that occurs in your app. Use this for workflow data binding.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-event
         */
        readonly event?: string;
        /**
         * The default value assigned to the property when the component is imported into an app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-importedvalue
         */
        readonly importedValue?: string;
        /**
         * The data model to use to assign a value to the component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-model
         */
        readonly model?: string;
        /**
         * The name of the component's property that is affected by an event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-property
         */
        readonly property?: string;
        /**
         * The component type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-type
         */
        readonly type?: string;
        /**
         * An authenticated user attribute to use to assign a value to the component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-userattribute
         */
        readonly userAttribute?: string;
        /**
         * The value to assign to the component property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bindingProperties', CfnComponent_ComponentPropertyBindingPropertiesPropertyValidator)(properties.bindingProperties));
    errors.collect(cdk.propertyValidator('bindings', cdk.hashValidator(CfnComponent_FormBindingElementPropertyValidator))(properties.bindings));
    errors.collect(cdk.propertyValidator('collectionBindingProperties', CfnComponent_ComponentPropertyBindingPropertiesPropertyValidator)(properties.collectionBindingProperties));
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('concat', cdk.listValidator(CfnComponent_ComponentPropertyPropertyValidator))(properties.concat));
    errors.collect(cdk.propertyValidator('condition', CfnComponent_ComponentConditionPropertyPropertyValidator)(properties.condition));
    errors.collect(cdk.propertyValidator('configured', cdk.validateBoolean)(properties.configured));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('event', cdk.validateString)(properties.event));
    errors.collect(cdk.propertyValidator('importedValue', cdk.validateString)(properties.importedValue));
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('userAttribute', cdk.validateString)(properties.userAttribute));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ComponentPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentProperty` resource
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentProperty` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentPropertyPropertyValidator(properties).assertSuccess();
    return {
        BindingProperties: cfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties.bindingProperties),
        Bindings: cdk.hashMapper(cfnComponentFormBindingElementPropertyToCloudFormation)(properties.bindings),
        CollectionBindingProperties: cfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties.collectionBindingProperties),
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        Concat: cdk.listMapper(cfnComponentComponentPropertyPropertyToCloudFormation)(properties.concat),
        Condition: cfnComponentComponentConditionPropertyPropertyToCloudFormation(properties.condition),
        Configured: cdk.booleanToCloudFormation(properties.configured),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        Event: cdk.stringToCloudFormation(properties.event),
        ImportedValue: cdk.stringToCloudFormation(properties.importedValue),
        Model: cdk.stringToCloudFormation(properties.model),
        Property: cdk.stringToCloudFormation(properties.property),
        Type: cdk.stringToCloudFormation(properties.type),
        UserAttribute: cdk.stringToCloudFormation(properties.userAttribute),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentPropertyProperty>();
    ret.addPropertyResult('bindingProperties', 'BindingProperties', properties.BindingProperties != null ? CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties.BindingProperties) : undefined);
    ret.addPropertyResult('bindings', 'Bindings', properties.Bindings != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentFormBindingElementPropertyFromCloudFormation)(properties.Bindings) : undefined);
    ret.addPropertyResult('collectionBindingProperties', 'CollectionBindingProperties', properties.CollectionBindingProperties != null ? CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties.CollectionBindingProperties) : undefined);
    ret.addPropertyResult('componentName', 'ComponentName', properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined);
    ret.addPropertyResult('concat', 'Concat', properties.Concat != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Concat) : undefined);
    ret.addPropertyResult('condition', 'Condition', properties.Condition != null ? CfnComponentComponentConditionPropertyPropertyFromCloudFormation(properties.Condition) : undefined);
    ret.addPropertyResult('configured', 'Configured', properties.Configured != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Configured) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('event', 'Event', properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined);
    ret.addPropertyResult('importedValue', 'ImportedValue', properties.ImportedValue != null ? cfn_parse.FromCloudFormation.getString(properties.ImportedValue) : undefined);
    ret.addPropertyResult('model', 'Model', properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined);
    ret.addPropertyResult('property', 'Property', properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('userAttribute', 'UserAttribute', properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentPropertyBindingProperties` property specifies a component property to associate with a binding property. This enables exposed properties on the top level component to propagate data to the component's property values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html
     */
    export interface ComponentPropertyBindingPropertiesProperty {
        /**
         * The data field to bind the property to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html#cfn-amplifyuibuilder-component-componentpropertybindingproperties-field
         */
        readonly field?: string;
        /**
         * The component property to bind to the data field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html#cfn-amplifyuibuilder-component-componentpropertybindingproperties-property
         */
        readonly property: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentPropertyBindingPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyBindingPropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentPropertyBindingPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('property', cdk.requiredValidator)(properties.property));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    return errors.wrap('supplied properties not correct for "ComponentPropertyBindingPropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentPropertyBindingProperties` resource
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyBindingPropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentPropertyBindingProperties` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentPropertyBindingPropertiesPropertyValidator(properties).assertSuccess();
    return {
        Field: cdk.stringToCloudFormation(properties.field),
        Property: cdk.stringToCloudFormation(properties.property),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentPropertyBindingPropertiesProperty>();
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('property', 'Property', cfn_parse.FromCloudFormation.getString(properties.Property));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `ComponentVariant` property specifies the style configuration of a unique variation of a main component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html
     */
    export interface ComponentVariantProperty {
        /**
         * The properties of the component variant that can be overriden when customizing an instance of the component. You can't specify `tags` as a valid property for `overrides` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html#cfn-amplifyuibuilder-component-componentvariant-overrides
         */
        readonly overrides?: any | cdk.IResolvable;
        /**
         * The combination of variants that comprise this variant.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html#cfn-amplifyuibuilder-component-componentvariant-variantvalues
         */
        readonly variantValues?: { [key: string]: (string) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ComponentVariantProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentVariantProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_ComponentVariantPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('overrides', cdk.validateObject)(properties.overrides));
    errors.collect(cdk.propertyValidator('variantValues', cdk.hashValidator(cdk.validateString))(properties.variantValues));
    return errors.wrap('supplied properties not correct for "ComponentVariantProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentVariant` resource
 *
 * @param properties - the TypeScript properties of a `ComponentVariantProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.ComponentVariant` resource.
 */
// @ts-ignore TS6133
function cfnComponentComponentVariantPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_ComponentVariantPropertyValidator(properties).assertSuccess();
    return {
        Overrides: cdk.objectToCloudFormation(properties.overrides),
        VariantValues: cdk.hashMapper(cdk.stringToCloudFormation)(properties.variantValues),
    };
}

// @ts-ignore TS6133
function CfnComponentComponentVariantPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentVariantProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentVariantProperty>();
    ret.addPropertyResult('overrides', 'Overrides', properties.Overrides != null ? cfn_parse.FromCloudFormation.getAny(properties.Overrides) : undefined);
    ret.addPropertyResult('variantValues', 'VariantValues', properties.VariantValues != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.VariantValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * Describes how to bind a component property to form data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html
     */
    export interface FormBindingElementProperty {
        /**
         * The name of the component to retrieve a value from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html#cfn-amplifyuibuilder-component-formbindingelement-element
         */
        readonly element: string;
        /**
         * The property to retrieve a value from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html#cfn-amplifyuibuilder-component-formbindingelement-property
         */
        readonly property: string;
    }
}

/**
 * Determine whether the given properties match those of a `FormBindingElementProperty`
 *
 * @param properties - the TypeScript properties of a `FormBindingElementProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_FormBindingElementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('element', cdk.requiredValidator)(properties.element));
    errors.collect(cdk.propertyValidator('element', cdk.validateString)(properties.element));
    errors.collect(cdk.propertyValidator('property', cdk.requiredValidator)(properties.property));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    return errors.wrap('supplied properties not correct for "FormBindingElementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.FormBindingElement` resource
 *
 * @param properties - the TypeScript properties of a `FormBindingElementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.FormBindingElement` resource.
 */
// @ts-ignore TS6133
function cfnComponentFormBindingElementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_FormBindingElementPropertyValidator(properties).assertSuccess();
    return {
        Element: cdk.stringToCloudFormation(properties.element),
        Property: cdk.stringToCloudFormation(properties.property),
    };
}

// @ts-ignore TS6133
function CfnComponentFormBindingElementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.FormBindingElementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.FormBindingElementProperty>();
    ret.addPropertyResult('element', 'Element', cfn_parse.FromCloudFormation.getString(properties.Element));
    ret.addPropertyResult('property', 'Property', cfn_parse.FromCloudFormation.getString(properties.Property));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `MutationActionSetStateParameter` property specifies the state configuration when an action modifies a property of another element within the same component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html
     */
    export interface MutationActionSetStateParameterProperty {
        /**
         * The name of the component that is being modified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-componentname
         */
        readonly componentName: string;
        /**
         * The name of the component property to apply the state configuration to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-property
         */
        readonly property: string;
        /**
         * The state configuration to assign to the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-set
         */
        readonly set: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MutationActionSetStateParameterProperty`
 *
 * @param properties - the TypeScript properties of a `MutationActionSetStateParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_MutationActionSetStateParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentName', cdk.requiredValidator)(properties.componentName));
    errors.collect(cdk.propertyValidator('componentName', cdk.validateString)(properties.componentName));
    errors.collect(cdk.propertyValidator('property', cdk.requiredValidator)(properties.property));
    errors.collect(cdk.propertyValidator('property', cdk.validateString)(properties.property));
    errors.collect(cdk.propertyValidator('set', cdk.requiredValidator)(properties.set));
    errors.collect(cdk.propertyValidator('set', CfnComponent_ComponentPropertyPropertyValidator)(properties.set));
    return errors.wrap('supplied properties not correct for "MutationActionSetStateParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.MutationActionSetStateParameter` resource
 *
 * @param properties - the TypeScript properties of a `MutationActionSetStateParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.MutationActionSetStateParameter` resource.
 */
// @ts-ignore TS6133
function cfnComponentMutationActionSetStateParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_MutationActionSetStateParameterPropertyValidator(properties).assertSuccess();
    return {
        ComponentName: cdk.stringToCloudFormation(properties.componentName),
        Property: cdk.stringToCloudFormation(properties.property),
        Set: cfnComponentComponentPropertyPropertyToCloudFormation(properties.set),
    };
}

// @ts-ignore TS6133
function CfnComponentMutationActionSetStateParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.MutationActionSetStateParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.MutationActionSetStateParameterProperty>();
    ret.addPropertyResult('componentName', 'ComponentName', cfn_parse.FromCloudFormation.getString(properties.ComponentName));
    ret.addPropertyResult('property', 'Property', cfn_parse.FromCloudFormation.getString(properties.Property));
    ret.addPropertyResult('set', 'Set', CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Set));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `Predicate` property specifies information for generating Amplify DataStore queries. Use `Predicate` to retrieve a subset of the data in a collection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html
     */
    export interface PredicateProperty {
        /**
         * A list of predicates to combine logically.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-and
         */
        readonly and?: Array<CfnComponent.PredicateProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The field to query.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-field
         */
        readonly field?: string;
        /**
         * The value to use when performing the evaluation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-operand
         */
        readonly operand?: string;
        /**
         * The operator to use to perform the evaluation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-operator
         */
        readonly operator?: string;
        /**
         * A list of predicates to combine logically.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-or
         */
        readonly or?: Array<CfnComponent.PredicateProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_PredicatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('and', cdk.listValidator(CfnComponent_PredicatePropertyValidator))(properties.and));
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('operand', cdk.validateString)(properties.operand));
    errors.collect(cdk.propertyValidator('operator', cdk.validateString)(properties.operator));
    errors.collect(cdk.propertyValidator('or', cdk.listValidator(CfnComponent_PredicatePropertyValidator))(properties.or));
    return errors.wrap('supplied properties not correct for "PredicateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.Predicate` resource
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.Predicate` resource.
 */
// @ts-ignore TS6133
function cfnComponentPredicatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_PredicatePropertyValidator(properties).assertSuccess();
    return {
        And: cdk.listMapper(cfnComponentPredicatePropertyToCloudFormation)(properties.and),
        Field: cdk.stringToCloudFormation(properties.field),
        Operand: cdk.stringToCloudFormation(properties.operand),
        Operator: cdk.stringToCloudFormation(properties.operator),
        Or: cdk.listMapper(cfnComponentPredicatePropertyToCloudFormation)(properties.or),
    };
}

// @ts-ignore TS6133
function CfnComponentPredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.PredicateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.PredicateProperty>();
    ret.addPropertyResult('and', 'And', properties.And != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.And) : undefined);
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('operand', 'Operand', properties.Operand != null ? cfn_parse.FromCloudFormation.getString(properties.Operand) : undefined);
    ret.addPropertyResult('operator', 'Operator', properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined);
    ret.addPropertyResult('or', 'Or', properties.Or != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.Or) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnComponent {
    /**
     * The `SortProperty` property specifies how to sort the data that you bind to a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html
     */
    export interface SortPropertyProperty {
        /**
         * The direction of the sort, either ascending or descending.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html#cfn-amplifyuibuilder-component-sortproperty-direction
         */
        readonly direction: string;
        /**
         * The field to perform the sort on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html#cfn-amplifyuibuilder-component-sortproperty-field
         */
        readonly field: string;
    }
}

/**
 * Determine whether the given properties match those of a `SortPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `SortPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnComponent_SortPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('direction', cdk.requiredValidator)(properties.direction));
    errors.collect(cdk.propertyValidator('direction', cdk.validateString)(properties.direction));
    errors.collect(cdk.propertyValidator('field', cdk.requiredValidator)(properties.field));
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    return errors.wrap('supplied properties not correct for "SortPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.SortProperty` resource
 *
 * @param properties - the TypeScript properties of a `SortPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Component.SortProperty` resource.
 */
// @ts-ignore TS6133
function cfnComponentSortPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnComponent_SortPropertyPropertyValidator(properties).assertSuccess();
    return {
        Direction: cdk.stringToCloudFormation(properties.direction),
        Field: cdk.stringToCloudFormation(properties.field),
    };
}

// @ts-ignore TS6133
function CfnComponentSortPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.SortPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.SortPropertyProperty>();
    ret.addPropertyResult('direction', 'Direction', cfn_parse.FromCloudFormation.getString(properties.Direction));
    ret.addPropertyResult('field', 'Field', cfn_parse.FromCloudFormation.getString(properties.Field));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnForm`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html
 */
export interface CfnFormProps {

    /**
     * The type of data source to use to create the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-datatype
     */
    readonly dataType: CfnForm.FormDataTypeConfigProperty | cdk.IResolvable;

    /**
     * Stores the information about the form's fields.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-fields
     */
    readonly fields: { [key: string]: (CfnForm.FieldConfigProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The operation to perform on the specified form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-formactiontype
     */
    readonly formActionType: string;

    /**
     * The name of the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-name
     */
    readonly name: string;

    /**
     * The schema version of the form when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-schemaversion
     */
    readonly schemaVersion: string;

    /**
     * Stores the visual helper elements for the form that are not associated with any data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-sectionalelements
     */
    readonly sectionalElements: { [key: string]: (CfnForm.SectionalElementProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Stores the configuration for the form's style.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-style
     */
    readonly style: CfnForm.FormStyleProperty | cdk.IResolvable;

    /**
     * The unique ID of the Amplify app associated with the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-appid
     */
    readonly appId?: string;

    /**
     * Stores the call to action configuration for the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-cta
     */
    readonly cta?: CfnForm.FormCTAProperty | cdk.IResolvable;

    /**
     * The name of the backend environment that is a part of the Amplify app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-environmentname
     */
    readonly environmentName?: string;

    /**
     * One or more key-value pairs to use when tagging the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnFormProps`
 *
 * @param properties - the TypeScript properties of a `CfnFormProps`
 *
 * @returns the result of the validation.
 */
function CfnFormPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appId', cdk.validateString)(properties.appId));
    errors.collect(cdk.propertyValidator('cta', CfnForm_FormCTAPropertyValidator)(properties.cta));
    errors.collect(cdk.propertyValidator('dataType', cdk.requiredValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('dataType', CfnForm_FormDataTypeConfigPropertyValidator)(properties.dataType));
    errors.collect(cdk.propertyValidator('environmentName', cdk.validateString)(properties.environmentName));
    errors.collect(cdk.propertyValidator('fields', cdk.requiredValidator)(properties.fields));
    errors.collect(cdk.propertyValidator('fields', cdk.hashValidator(CfnForm_FieldConfigPropertyValidator))(properties.fields));
    errors.collect(cdk.propertyValidator('formActionType', cdk.requiredValidator)(properties.formActionType));
    errors.collect(cdk.propertyValidator('formActionType', cdk.validateString)(properties.formActionType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('schemaVersion', cdk.requiredValidator)(properties.schemaVersion));
    errors.collect(cdk.propertyValidator('schemaVersion', cdk.validateString)(properties.schemaVersion));
    errors.collect(cdk.propertyValidator('sectionalElements', cdk.requiredValidator)(properties.sectionalElements));
    errors.collect(cdk.propertyValidator('sectionalElements', cdk.hashValidator(CfnForm_SectionalElementPropertyValidator))(properties.sectionalElements));
    errors.collect(cdk.propertyValidator('style', cdk.requiredValidator)(properties.style));
    errors.collect(cdk.propertyValidator('style', CfnForm_FormStylePropertyValidator)(properties.style));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFormProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form` resource
 *
 * @param properties - the TypeScript properties of a `CfnFormProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form` resource.
 */
// @ts-ignore TS6133
function cfnFormPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFormPropsValidator(properties).assertSuccess();
    return {
        DataType: cfnFormFormDataTypeConfigPropertyToCloudFormation(properties.dataType),
        Fields: cdk.hashMapper(cfnFormFieldConfigPropertyToCloudFormation)(properties.fields),
        FormActionType: cdk.stringToCloudFormation(properties.formActionType),
        Name: cdk.stringToCloudFormation(properties.name),
        SchemaVersion: cdk.stringToCloudFormation(properties.schemaVersion),
        SectionalElements: cdk.hashMapper(cfnFormSectionalElementPropertyToCloudFormation)(properties.sectionalElements),
        Style: cfnFormFormStylePropertyToCloudFormation(properties.style),
        AppId: cdk.stringToCloudFormation(properties.appId),
        Cta: cfnFormFormCTAPropertyToCloudFormation(properties.cta),
        EnvironmentName: cdk.stringToCloudFormation(properties.environmentName),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFormPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFormProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFormProps>();
    ret.addPropertyResult('dataType', 'DataType', CfnFormFormDataTypeConfigPropertyFromCloudFormation(properties.DataType));
    ret.addPropertyResult('fields', 'Fields', cfn_parse.FromCloudFormation.getMap(CfnFormFieldConfigPropertyFromCloudFormation)(properties.Fields));
    ret.addPropertyResult('formActionType', 'FormActionType', cfn_parse.FromCloudFormation.getString(properties.FormActionType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schemaVersion', 'SchemaVersion', cfn_parse.FromCloudFormation.getString(properties.SchemaVersion));
    ret.addPropertyResult('sectionalElements', 'SectionalElements', cfn_parse.FromCloudFormation.getMap(CfnFormSectionalElementPropertyFromCloudFormation)(properties.SectionalElements));
    ret.addPropertyResult('style', 'Style', CfnFormFormStylePropertyFromCloudFormation(properties.Style));
    ret.addPropertyResult('appId', 'AppId', properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined);
    ret.addPropertyResult('cta', 'Cta', properties.Cta != null ? CfnFormFormCTAPropertyFromCloudFormation(properties.Cta) : undefined);
    ret.addPropertyResult('environmentName', 'EnvironmentName', properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmplifyUIBuilder::Form`
 *
 * Contains the configuration settings for a `Form` user interface (UI) element for an Amplify app. A form is a component you can add to your project by specifying a data source as the default configuration for the form.
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Form
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html
 */
export class CfnForm extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Form";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnForm {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFormPropsFromCloudFormation(resourceProperties);
        const ret = new CfnForm(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The type of data source to use to create the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-datatype
     */
    public dataType: CfnForm.FormDataTypeConfigProperty | cdk.IResolvable;

    /**
     * Stores the information about the form's fields.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-fields
     */
    public fields: { [key: string]: (CfnForm.FieldConfigProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The operation to perform on the specified form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-formactiontype
     */
    public formActionType: string;

    /**
     * The name of the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-name
     */
    public name: string;

    /**
     * The schema version of the form when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-schemaversion
     */
    public schemaVersion: string;

    /**
     * Stores the visual helper elements for the form that are not associated with any data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-sectionalelements
     */
    public sectionalElements: { [key: string]: (CfnForm.SectionalElementProperty | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * Stores the configuration for the form's style.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-style
     */
    public style: CfnForm.FormStyleProperty | cdk.IResolvable;

    /**
     * The unique ID of the Amplify app associated with the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-appid
     */
    public appId: string | undefined;

    /**
     * Stores the call to action configuration for the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-cta
     */
    public cta: CfnForm.FormCTAProperty | cdk.IResolvable | undefined;

    /**
     * The name of the backend environment that is a part of the Amplify app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-environmentname
     */
    public environmentName: string | undefined;

    /**
     * One or more key-value pairs to use when tagging the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AmplifyUIBuilder::Form`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFormProps) {
        super(scope, id, { type: CfnForm.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataType', this);
        cdk.requireProperty(props, 'fields', this);
        cdk.requireProperty(props, 'formActionType', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schemaVersion', this);
        cdk.requireProperty(props, 'sectionalElements', this);
        cdk.requireProperty(props, 'style', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.dataType = props.dataType;
        this.fields = props.fields;
        this.formActionType = props.formActionType;
        this.name = props.name;
        this.schemaVersion = props.schemaVersion;
        this.sectionalElements = props.sectionalElements;
        this.style = props.style;
        this.appId = props.appId;
        this.cta = props.cta;
        this.environmentName = props.environmentName;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Form", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnForm.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataType: this.dataType,
            fields: this.fields,
            formActionType: this.formActionType,
            name: this.name,
            schemaVersion: this.schemaVersion,
            sectionalElements: this.sectionalElements,
            style: this.style,
            appId: this.appId,
            cta: this.cta,
            environmentName: this.environmentName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFormPropsToCloudFormation(props);
    }
}

export namespace CfnForm {
    /**
     * Describes the configuration information for a field in a table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html
     */
    export interface FieldConfigProperty {
        /**
         * Specifies whether to hide a field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-excluded
         */
        readonly excluded?: boolean | cdk.IResolvable;
        /**
         * Describes the configuration for the default input value to display for a field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-inputtype
         */
        readonly inputType?: CfnForm.FieldInputConfigProperty | cdk.IResolvable;
        /**
         * The label for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-label
         */
        readonly label?: string;
        /**
         * Specifies the field position.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-position
         */
        readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;
        /**
         * The validations to perform on the value in the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-validations
         */
        readonly validations?: Array<CfnForm.FieldValidationConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FieldConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FieldConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excluded', cdk.validateBoolean)(properties.excluded));
    errors.collect(cdk.propertyValidator('inputType', CfnForm_FieldInputConfigPropertyValidator)(properties.inputType));
    errors.collect(cdk.propertyValidator('label', cdk.validateString)(properties.label));
    errors.collect(cdk.propertyValidator('position', CfnForm_FieldPositionPropertyValidator)(properties.position));
    errors.collect(cdk.propertyValidator('validations', cdk.listValidator(CfnForm_FieldValidationConfigurationPropertyValidator))(properties.validations));
    return errors.wrap('supplied properties not correct for "FieldConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldConfig` resource
 *
 * @param properties - the TypeScript properties of a `FieldConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldConfig` resource.
 */
// @ts-ignore TS6133
function cfnFormFieldConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FieldConfigPropertyValidator(properties).assertSuccess();
    return {
        Excluded: cdk.booleanToCloudFormation(properties.excluded),
        InputType: cfnFormFieldInputConfigPropertyToCloudFormation(properties.inputType),
        Label: cdk.stringToCloudFormation(properties.label),
        Position: cfnFormFieldPositionPropertyToCloudFormation(properties.position),
        Validations: cdk.listMapper(cfnFormFieldValidationConfigurationPropertyToCloudFormation)(properties.validations),
    };
}

// @ts-ignore TS6133
function CfnFormFieldConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldConfigProperty>();
    ret.addPropertyResult('excluded', 'Excluded', properties.Excluded != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Excluded) : undefined);
    ret.addPropertyResult('inputType', 'InputType', properties.InputType != null ? CfnFormFieldInputConfigPropertyFromCloudFormation(properties.InputType) : undefined);
    ret.addPropertyResult('label', 'Label', properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined);
    ret.addPropertyResult('position', 'Position', properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined);
    ret.addPropertyResult('validations', 'Validations', properties.Validations != null ? cfn_parse.FromCloudFormation.getArray(CfnFormFieldValidationConfigurationPropertyFromCloudFormation)(properties.Validations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the configuration for the default input values to display for a field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html
     */
    export interface FieldInputConfigProperty {
        /**
         * Specifies whether a field has a default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultchecked
         */
        readonly defaultChecked?: boolean | cdk.IResolvable;
        /**
         * The default country code for a phone number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultcountrycode
         */
        readonly defaultCountryCode?: string;
        /**
         * The default value for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultvalue
         */
        readonly defaultValue?: string;
        /**
         * The text to display to describe the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-descriptivetext
         */
        readonly descriptiveText?: string;
        /**
         * The maximum value to display for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-maxvalue
         */
        readonly maxValue?: number;
        /**
         * The minimum value to display for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-minvalue
         */
        readonly minValue?: number;
        /**
         * The name of the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-name
         */
        readonly name?: string;
        /**
         * The text to display as a placeholder for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-placeholder
         */
        readonly placeholder?: string;
        /**
         * Specifies a read only field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-readonly
         */
        readonly readOnly?: boolean | cdk.IResolvable;
        /**
         * Specifies a field that requires input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-required
         */
        readonly required?: boolean | cdk.IResolvable;
        /**
         * The stepping increment for a numeric value in a field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-step
         */
        readonly step?: number;
        /**
         * The input type for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-type
         */
        readonly type: string;
        /**
         * The value for the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-value
         */
        readonly value?: string;
        /**
         * The information to use to customize the input fields with data at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-valuemappings
         */
        readonly valueMappings?: CfnForm.ValueMappingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FieldInputConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FieldInputConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FieldInputConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultChecked', cdk.validateBoolean)(properties.defaultChecked));
    errors.collect(cdk.propertyValidator('defaultCountryCode', cdk.validateString)(properties.defaultCountryCode));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('descriptiveText', cdk.validateString)(properties.descriptiveText));
    errors.collect(cdk.propertyValidator('maxValue', cdk.validateNumber)(properties.maxValue));
    errors.collect(cdk.propertyValidator('minValue', cdk.validateNumber)(properties.minValue));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('placeholder', cdk.validateString)(properties.placeholder));
    errors.collect(cdk.propertyValidator('readOnly', cdk.validateBoolean)(properties.readOnly));
    errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
    errors.collect(cdk.propertyValidator('step', cdk.validateNumber)(properties.step));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    errors.collect(cdk.propertyValidator('valueMappings', CfnForm_ValueMappingsPropertyValidator)(properties.valueMappings));
    return errors.wrap('supplied properties not correct for "FieldInputConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldInputConfig` resource
 *
 * @param properties - the TypeScript properties of a `FieldInputConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldInputConfig` resource.
 */
// @ts-ignore TS6133
function cfnFormFieldInputConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FieldInputConfigPropertyValidator(properties).assertSuccess();
    return {
        DefaultChecked: cdk.booleanToCloudFormation(properties.defaultChecked),
        DefaultCountryCode: cdk.stringToCloudFormation(properties.defaultCountryCode),
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
        DescriptiveText: cdk.stringToCloudFormation(properties.descriptiveText),
        MaxValue: cdk.numberToCloudFormation(properties.maxValue),
        MinValue: cdk.numberToCloudFormation(properties.minValue),
        Name: cdk.stringToCloudFormation(properties.name),
        Placeholder: cdk.stringToCloudFormation(properties.placeholder),
        ReadOnly: cdk.booleanToCloudFormation(properties.readOnly),
        Required: cdk.booleanToCloudFormation(properties.required),
        Step: cdk.numberToCloudFormation(properties.step),
        Type: cdk.stringToCloudFormation(properties.type),
        Value: cdk.stringToCloudFormation(properties.value),
        ValueMappings: cfnFormValueMappingsPropertyToCloudFormation(properties.valueMappings),
    };
}

// @ts-ignore TS6133
function CfnFormFieldInputConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldInputConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldInputConfigProperty>();
    ret.addPropertyResult('defaultChecked', 'DefaultChecked', properties.DefaultChecked != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DefaultChecked) : undefined);
    ret.addPropertyResult('defaultCountryCode', 'DefaultCountryCode', properties.DefaultCountryCode != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultCountryCode) : undefined);
    ret.addPropertyResult('defaultValue', 'DefaultValue', properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined);
    ret.addPropertyResult('descriptiveText', 'DescriptiveText', properties.DescriptiveText != null ? cfn_parse.FromCloudFormation.getString(properties.DescriptiveText) : undefined);
    ret.addPropertyResult('maxValue', 'MaxValue', properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined);
    ret.addPropertyResult('minValue', 'MinValue', properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('placeholder', 'Placeholder', properties.Placeholder != null ? cfn_parse.FromCloudFormation.getString(properties.Placeholder) : undefined);
    ret.addPropertyResult('readOnly', 'ReadOnly', properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined);
    ret.addPropertyResult('required', 'Required', properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined);
    ret.addPropertyResult('step', 'Step', properties.Step != null ? cfn_parse.FromCloudFormation.getNumber(properties.Step) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addPropertyResult('valueMappings', 'ValueMappings', properties.ValueMappings != null ? CfnFormValueMappingsPropertyFromCloudFormation(properties.ValueMappings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the field position.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html
     */
    export interface FieldPositionProperty {
        /**
         * The field position is below the field specified by the string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-below
         */
        readonly below?: string;
        /**
         * The field position is fixed and doesn't change in relation to other fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-fixed
         */
        readonly fixed?: string;
        /**
         * The field position is to the right of the field specified by the string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-rightof
         */
        readonly rightOf?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldPositionProperty`
 *
 * @param properties - the TypeScript properties of a `FieldPositionProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FieldPositionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('below', cdk.validateString)(properties.below));
    errors.collect(cdk.propertyValidator('fixed', cdk.validateString)(properties.fixed));
    errors.collect(cdk.propertyValidator('rightOf', cdk.validateString)(properties.rightOf));
    return errors.wrap('supplied properties not correct for "FieldPositionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldPosition` resource
 *
 * @param properties - the TypeScript properties of a `FieldPositionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldPosition` resource.
 */
// @ts-ignore TS6133
function cfnFormFieldPositionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FieldPositionPropertyValidator(properties).assertSuccess();
    return {
        Below: cdk.stringToCloudFormation(properties.below),
        Fixed: cdk.stringToCloudFormation(properties.fixed),
        RightOf: cdk.stringToCloudFormation(properties.rightOf),
    };
}

// @ts-ignore TS6133
function CfnFormFieldPositionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldPositionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldPositionProperty>();
    ret.addPropertyResult('below', 'Below', properties.Below != null ? cfn_parse.FromCloudFormation.getString(properties.Below) : undefined);
    ret.addPropertyResult('fixed', 'Fixed', properties.Fixed != null ? cfn_parse.FromCloudFormation.getString(properties.Fixed) : undefined);
    ret.addPropertyResult('rightOf', 'RightOf', properties.RightOf != null ? cfn_parse.FromCloudFormation.getString(properties.RightOf) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the validation configuration for a field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html
     */
    export interface FieldValidationConfigurationProperty {
        /**
         * The validation to perform on a number value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-numvalues
         */
        readonly numValues?: number[] | cdk.IResolvable;
        /**
         * The validation to perform on a string value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-strvalues
         */
        readonly strValues?: string[];
        /**
         * The validation to perform on an object type. ``
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-type
         */
        readonly type: string;
        /**
         * The validation message to display.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-validationmessage
         */
        readonly validationMessage?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FieldValidationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FieldValidationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FieldValidationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('numValues', cdk.listValidator(cdk.validateNumber))(properties.numValues));
    errors.collect(cdk.propertyValidator('strValues', cdk.listValidator(cdk.validateString))(properties.strValues));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('validationMessage', cdk.validateString)(properties.validationMessage));
    return errors.wrap('supplied properties not correct for "FieldValidationConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldValidationConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `FieldValidationConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FieldValidationConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnFormFieldValidationConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FieldValidationConfigurationPropertyValidator(properties).assertSuccess();
    return {
        NumValues: cdk.listMapper(cdk.numberToCloudFormation)(properties.numValues),
        StrValues: cdk.listMapper(cdk.stringToCloudFormation)(properties.strValues),
        Type: cdk.stringToCloudFormation(properties.type),
        ValidationMessage: cdk.stringToCloudFormation(properties.validationMessage),
    };
}

// @ts-ignore TS6133
function CfnFormFieldValidationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldValidationConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldValidationConfigurationProperty>();
    ret.addPropertyResult('numValues', 'NumValues', properties.NumValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.NumValues) : undefined);
    ret.addPropertyResult('strValues', 'StrValues', properties.StrValues != null ? cfn_parse.FromCloudFormation.getStringArray(properties.StrValues) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('validationMessage', 'ValidationMessage', properties.ValidationMessage != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationMessage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the configuration for a button UI element that is a part of a form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html
     */
    export interface FormButtonProperty {
        /**
         * Describes the button's properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-children
         */
        readonly children?: string;
        /**
         * Specifies whether the button is visible on the form.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-excluded
         */
        readonly excluded?: boolean | cdk.IResolvable;
        /**
         * The position of the button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-position
         */
        readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FormButtonProperty`
 *
 * @param properties - the TypeScript properties of a `FormButtonProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormButtonPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('children', cdk.validateString)(properties.children));
    errors.collect(cdk.propertyValidator('excluded', cdk.validateBoolean)(properties.excluded));
    errors.collect(cdk.propertyValidator('position', CfnForm_FieldPositionPropertyValidator)(properties.position));
    return errors.wrap('supplied properties not correct for "FormButtonProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormButton` resource
 *
 * @param properties - the TypeScript properties of a `FormButtonProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormButton` resource.
 */
// @ts-ignore TS6133
function cfnFormFormButtonPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormButtonPropertyValidator(properties).assertSuccess();
    return {
        Children: cdk.stringToCloudFormation(properties.children),
        Excluded: cdk.booleanToCloudFormation(properties.excluded),
        Position: cfnFormFieldPositionPropertyToCloudFormation(properties.position),
    };
}

// @ts-ignore TS6133
function CfnFormFormButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormButtonProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormButtonProperty>();
    ret.addPropertyResult('children', 'Children', properties.Children != null ? cfn_parse.FromCloudFormation.getString(properties.Children) : undefined);
    ret.addPropertyResult('excluded', 'Excluded', properties.Excluded != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Excluded) : undefined);
    ret.addPropertyResult('position', 'Position', properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the call to action button configuration for the form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html
     */
    export interface FormCTAProperty {
        /**
         * Displays a cancel button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-cancel
         */
        readonly cancel?: CfnForm.FormButtonProperty | cdk.IResolvable;
        /**
         * Displays a clear button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-clear
         */
        readonly clear?: CfnForm.FormButtonProperty | cdk.IResolvable;
        /**
         * The position of the button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-position
         */
        readonly position?: string;
        /**
         * Displays a submit button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-submit
         */
        readonly submit?: CfnForm.FormButtonProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FormCTAProperty`
 *
 * @param properties - the TypeScript properties of a `FormCTAProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormCTAPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cancel', CfnForm_FormButtonPropertyValidator)(properties.cancel));
    errors.collect(cdk.propertyValidator('clear', CfnForm_FormButtonPropertyValidator)(properties.clear));
    errors.collect(cdk.propertyValidator('position', cdk.validateString)(properties.position));
    errors.collect(cdk.propertyValidator('submit', CfnForm_FormButtonPropertyValidator)(properties.submit));
    return errors.wrap('supplied properties not correct for "FormCTAProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormCTA` resource
 *
 * @param properties - the TypeScript properties of a `FormCTAProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormCTA` resource.
 */
// @ts-ignore TS6133
function cfnFormFormCTAPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormCTAPropertyValidator(properties).assertSuccess();
    return {
        Cancel: cfnFormFormButtonPropertyToCloudFormation(properties.cancel),
        Clear: cfnFormFormButtonPropertyToCloudFormation(properties.clear),
        Position: cdk.stringToCloudFormation(properties.position),
        Submit: cfnFormFormButtonPropertyToCloudFormation(properties.submit),
    };
}

// @ts-ignore TS6133
function CfnFormFormCTAPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormCTAProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormCTAProperty>();
    ret.addPropertyResult('cancel', 'Cancel', properties.Cancel != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Cancel) : undefined);
    ret.addPropertyResult('clear', 'Clear', properties.Clear != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Clear) : undefined);
    ret.addPropertyResult('position', 'Position', properties.Position != null ? cfn_parse.FromCloudFormation.getString(properties.Position) : undefined);
    ret.addPropertyResult('submit', 'Submit', properties.Submit != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Submit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the data type configuration for the data source associated with a form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html
     */
    export interface FormDataTypeConfigProperty {
        /**
         * The data source type, either an Amplify DataStore model or a custom data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html#cfn-amplifyuibuilder-form-formdatatypeconfig-datasourcetype
         */
        readonly dataSourceType: string;
        /**
         * The unique name of the data type you are using as the data source for the form.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html#cfn-amplifyuibuilder-form-formdatatypeconfig-datatypename
         */
        readonly dataTypeName: string;
    }
}

/**
 * Determine whether the given properties match those of a `FormDataTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FormDataTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormDataTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataSourceType', cdk.requiredValidator)(properties.dataSourceType));
    errors.collect(cdk.propertyValidator('dataSourceType', cdk.validateString)(properties.dataSourceType));
    errors.collect(cdk.propertyValidator('dataTypeName', cdk.requiredValidator)(properties.dataTypeName));
    errors.collect(cdk.propertyValidator('dataTypeName', cdk.validateString)(properties.dataTypeName));
    return errors.wrap('supplied properties not correct for "FormDataTypeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormDataTypeConfig` resource
 *
 * @param properties - the TypeScript properties of a `FormDataTypeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormDataTypeConfig` resource.
 */
// @ts-ignore TS6133
function cfnFormFormDataTypeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormDataTypeConfigPropertyValidator(properties).assertSuccess();
    return {
        DataSourceType: cdk.stringToCloudFormation(properties.dataSourceType),
        DataTypeName: cdk.stringToCloudFormation(properties.dataTypeName),
    };
}

// @ts-ignore TS6133
function CfnFormFormDataTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormDataTypeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormDataTypeConfigProperty>();
    ret.addPropertyResult('dataSourceType', 'DataSourceType', cfn_parse.FromCloudFormation.getString(properties.DataSourceType));
    ret.addPropertyResult('dataTypeName', 'DataTypeName', cfn_parse.FromCloudFormation.getString(properties.DataTypeName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the configuration for an input field on a form. Use `FormInputValueProperty` to specify the values to render or bind by default.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html
     */
    export interface FormInputValuePropertyProperty {
        /**
         * The value to assign to the input field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html#cfn-amplifyuibuilder-form-forminputvalueproperty-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FormInputValuePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `FormInputValuePropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormInputValuePropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "FormInputValuePropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormInputValueProperty` resource
 *
 * @param properties - the TypeScript properties of a `FormInputValuePropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormInputValueProperty` resource.
 */
// @ts-ignore TS6133
function cfnFormFormInputValuePropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormInputValuePropertyPropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormInputValuePropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormInputValuePropertyProperty>();
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the configuration for the form's style.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html
     */
    export interface FormStyleProperty {
        /**
         * The spacing for the horizontal gap.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-horizontalgap
         */
        readonly horizontalGap?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;
        /**
         * The size of the outer padding for the form.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-outerpadding
         */
        readonly outerPadding?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;
        /**
         * The spacing for the vertical gap.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-verticalgap
         */
        readonly verticalGap?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FormStyleProperty`
 *
 * @param properties - the TypeScript properties of a `FormStyleProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormStylePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('horizontalGap', CfnForm_FormStyleConfigPropertyValidator)(properties.horizontalGap));
    errors.collect(cdk.propertyValidator('outerPadding', CfnForm_FormStyleConfigPropertyValidator)(properties.outerPadding));
    errors.collect(cdk.propertyValidator('verticalGap', CfnForm_FormStyleConfigPropertyValidator)(properties.verticalGap));
    return errors.wrap('supplied properties not correct for "FormStyleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormStyle` resource
 *
 * @param properties - the TypeScript properties of a `FormStyleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormStyle` resource.
 */
// @ts-ignore TS6133
function cfnFormFormStylePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormStylePropertyValidator(properties).assertSuccess();
    return {
        HorizontalGap: cfnFormFormStyleConfigPropertyToCloudFormation(properties.horizontalGap),
        OuterPadding: cfnFormFormStyleConfigPropertyToCloudFormation(properties.outerPadding),
        VerticalGap: cfnFormFormStyleConfigPropertyToCloudFormation(properties.verticalGap),
    };
}

// @ts-ignore TS6133
function CfnFormFormStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormStyleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormStyleProperty>();
    ret.addPropertyResult('horizontalGap', 'HorizontalGap', properties.HorizontalGap != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.HorizontalGap) : undefined);
    ret.addPropertyResult('outerPadding', 'OuterPadding', properties.OuterPadding != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.OuterPadding) : undefined);
    ret.addPropertyResult('verticalGap', 'VerticalGap', properties.VerticalGap != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.VerticalGap) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Describes the configuration settings for the form's style properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html
     */
    export interface FormStyleConfigProperty {
        /**
         * A reference to a design token to use to bind the form's style properties to an existing theme.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html#cfn-amplifyuibuilder-form-formstyleconfig-tokenreference
         */
        readonly tokenReference?: string;
        /**
         * The value of the style setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html#cfn-amplifyuibuilder-form-formstyleconfig-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FormStyleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FormStyleConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_FormStyleConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tokenReference', cdk.validateString)(properties.tokenReference));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "FormStyleConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormStyleConfig` resource
 *
 * @param properties - the TypeScript properties of a `FormStyleConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.FormStyleConfig` resource.
 */
// @ts-ignore TS6133
function cfnFormFormStyleConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_FormStyleConfigPropertyValidator(properties).assertSuccess();
    return {
        TokenReference: cdk.stringToCloudFormation(properties.tokenReference),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFormFormStyleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormStyleConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormStyleConfigProperty>();
    ret.addPropertyResult('tokenReference', 'TokenReference', properties.TokenReference != null ? cfn_parse.FromCloudFormation.getString(properties.TokenReference) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Stores the configuration information for a visual helper element for a form. A sectional element can be a header, a text block, or a divider. These elements are static and not associated with any data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html
     */
    export interface SectionalElementProperty {
        /**
         * Specifies the size of the font for a `Heading` sectional element. Valid values are `1 | 2 | 3 | 4 | 5 | 6` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-level
         */
        readonly level?: number;
        /**
         * Specifies the orientation for a `Divider` sectional element. Valid values are `horizontal` or `vertical` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-orientation
         */
        readonly orientation?: string;
        /**
         * Specifies the position of the text in a field for a `Text` sectional element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-position
         */
        readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;
        /**
         * The text for a `Text` sectional element.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-text
         */
        readonly text?: string;
        /**
         * The type of sectional element. Valid values are `Heading` , `Text` , and `Divider` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `SectionalElementProperty`
 *
 * @param properties - the TypeScript properties of a `SectionalElementProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_SectionalElementPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('level', cdk.validateNumber)(properties.level));
    errors.collect(cdk.propertyValidator('orientation', cdk.validateString)(properties.orientation));
    errors.collect(cdk.propertyValidator('position', CfnForm_FieldPositionPropertyValidator)(properties.position));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "SectionalElementProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.SectionalElement` resource
 *
 * @param properties - the TypeScript properties of a `SectionalElementProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.SectionalElement` resource.
 */
// @ts-ignore TS6133
function cfnFormSectionalElementPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_SectionalElementPropertyValidator(properties).assertSuccess();
    return {
        Level: cdk.numberToCloudFormation(properties.level),
        Orientation: cdk.stringToCloudFormation(properties.orientation),
        Position: cfnFormFieldPositionPropertyToCloudFormation(properties.position),
        Text: cdk.stringToCloudFormation(properties.text),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnFormSectionalElementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.SectionalElementProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.SectionalElementProperty>();
    ret.addPropertyResult('level', 'Level', properties.Level != null ? cfn_parse.FromCloudFormation.getNumber(properties.Level) : undefined);
    ret.addPropertyResult('orientation', 'Orientation', properties.Orientation != null ? cfn_parse.FromCloudFormation.getString(properties.Orientation) : undefined);
    ret.addPropertyResult('position', 'Position', properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined);
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Associates a complex object with a display value. Use `ValueMapping` to store how to represent complex objects when they are displayed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html
     */
    export interface ValueMappingProperty {
        /**
         * The value to display for the complex object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html#cfn-amplifyuibuilder-form-valuemapping-displayvalue
         */
        readonly displayValue?: CfnForm.FormInputValuePropertyProperty | cdk.IResolvable;
        /**
         * The complex object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html#cfn-amplifyuibuilder-form-valuemapping-value
         */
        readonly value: CfnForm.FormInputValuePropertyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ValueMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ValueMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_ValueMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('displayValue', CfnForm_FormInputValuePropertyPropertyValidator)(properties.displayValue));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', CfnForm_FormInputValuePropertyPropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "ValueMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.ValueMapping` resource
 *
 * @param properties - the TypeScript properties of a `ValueMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.ValueMapping` resource.
 */
// @ts-ignore TS6133
function cfnFormValueMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_ValueMappingPropertyValidator(properties).assertSuccess();
    return {
        DisplayValue: cfnFormFormInputValuePropertyPropertyToCloudFormation(properties.displayValue),
        Value: cfnFormFormInputValuePropertyPropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFormValueMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.ValueMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.ValueMappingProperty>();
    ret.addPropertyResult('displayValue', 'DisplayValue', properties.DisplayValue != null ? CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties.DisplayValue) : undefined);
    ret.addPropertyResult('value', 'Value', CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnForm {
    /**
     * Represents the data binding configuration for a value map.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html
     */
    export interface ValueMappingsProperty {
        /**
         * The value and display value pairs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html#cfn-amplifyuibuilder-form-valuemappings-values
         */
        readonly values: Array<CfnForm.ValueMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ValueMappingsProperty`
 *
 * @param properties - the TypeScript properties of a `ValueMappingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnForm_ValueMappingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(CfnForm_ValueMappingPropertyValidator))(properties.values));
    return errors.wrap('supplied properties not correct for "ValueMappingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.ValueMappings` resource
 *
 * @param properties - the TypeScript properties of a `ValueMappingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Form.ValueMappings` resource.
 */
// @ts-ignore TS6133
function cfnFormValueMappingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnForm_ValueMappingsPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cfnFormValueMappingPropertyToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnFormValueMappingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.ValueMappingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.ValueMappingsProperty>();
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(CfnFormValueMappingPropertyFromCloudFormation)(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTheme`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html
 */
export interface CfnThemeProps {

    /**
     * The name of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-name
     */
    readonly name: string;

    /**
     * A list of key-value pairs that defines the properties of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-values
     */
    readonly values: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Describes the properties that can be overriden to customize a theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-overrides
     */
    readonly overrides?: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * One or more key-value pairs to use when tagging the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnThemeProps`
 *
 * @param properties - the TypeScript properties of a `CfnThemeProps`
 *
 * @returns the result of the validation.
 */
function CfnThemePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('overrides', cdk.listValidator(CfnTheme_ThemeValuesPropertyValidator))(properties.overrides));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(CfnTheme_ThemeValuesPropertyValidator))(properties.values));
    return errors.wrap('supplied properties not correct for "CfnThemeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme` resource
 *
 * @param properties - the TypeScript properties of a `CfnThemeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme` resource.
 */
// @ts-ignore TS6133
function cfnThemePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnThemePropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Values: cdk.listMapper(cfnThemeThemeValuesPropertyToCloudFormation)(properties.values),
        Overrides: cdk.listMapper(cfnThemeThemeValuesPropertyToCloudFormation)(properties.overrides),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnThemePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThemeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThemeProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Values));
    ret.addPropertyResult('overrides', 'Overrides', properties.Overrides != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Overrides) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::AmplifyUIBuilder::Theme`
 *
 * The AWS::AmplifyUIBuilder::Theme resource specifies a theme within an Amplify app. A theme is a collection of style settings that apply globally to the components associated with the app.
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Theme
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html
 */
export class CfnTheme extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Theme";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTheme {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnThemePropsFromCloudFormation(resourceProperties);
        const ret = new CfnTheme(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique ID for the Amplify app associated with the theme.
     * @cloudformationAttribute AppId
     */
    public readonly attrAppId: string;

    /**
     * The time that the theme was created.
     * @cloudformationAttribute CreatedAt
     */
    public readonly attrCreatedAt: string;

    /**
     * The name of the backend environment that is a part of the Amplify app.
     * @cloudformationAttribute EnvironmentName
     */
    public readonly attrEnvironmentName: string;

    /**
     * The ID for the theme.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The time that the theme was modified.
     * @cloudformationAttribute ModifiedAt
     */
    public readonly attrModifiedAt: string;

    /**
     * The name of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-name
     */
    public name: string;

    /**
     * A list of key-value pairs that defines the properties of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-values
     */
    public values: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Describes the properties that can be overriden to customize a theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-overrides
     */
    public overrides: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * One or more key-value pairs to use when tagging the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::AmplifyUIBuilder::Theme`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnThemeProps) {
        super(scope, id, { type: CfnTheme.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'values', this);
        this.attrAppId = cdk.Token.asString(this.getAtt('AppId', cdk.ResolutionTypeHint.STRING));
        this.attrCreatedAt = cdk.Token.asString(this.getAtt('CreatedAt', cdk.ResolutionTypeHint.STRING));
        this.attrEnvironmentName = cdk.Token.asString(this.getAtt('EnvironmentName', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrModifiedAt = cdk.Token.asString(this.getAtt('ModifiedAt', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.values = props.values;
        this.overrides = props.overrides;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Theme", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTheme.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            values: this.values,
            overrides: this.overrides,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnThemePropsToCloudFormation(props);
    }
}

export namespace CfnTheme {
    /**
     * The `ThemeValue` property specifies the configuration of a theme's properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html
     */
    export interface ThemeValueProperty {
        /**
         * A list of key-value pairs that define the theme's properties.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html#cfn-amplifyuibuilder-theme-themevalue-children
         */
        readonly children?: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The value of a theme property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html#cfn-amplifyuibuilder-theme-themevalue-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ThemeValueProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ThemeValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('children', cdk.listValidator(CfnTheme_ThemeValuesPropertyValidator))(properties.children));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ThemeValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme.ThemeValue` resource
 *
 * @param properties - the TypeScript properties of a `ThemeValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme.ThemeValue` resource.
 */
// @ts-ignore TS6133
function cfnThemeThemeValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ThemeValuePropertyValidator(properties).assertSuccess();
    return {
        Children: cdk.listMapper(cfnThemeThemeValuesPropertyToCloudFormation)(properties.children),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnThemeThemeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ThemeValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeValueProperty>();
    ret.addPropertyResult('children', 'Children', properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Children) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTheme {
    /**
     * The `ThemeValues` property specifies key-value pair that defines a property of a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html
     */
    export interface ThemeValuesProperty {
        /**
         * The name of the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html#cfn-amplifyuibuilder-theme-themevalues-key
         */
        readonly key?: string;
        /**
         * The value of the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html#cfn-amplifyuibuilder-theme-themevalues-value
         */
        readonly value?: CfnTheme.ThemeValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ThemeValuesProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeValuesProperty`
 *
 * @returns the result of the validation.
 */
function CfnTheme_ThemeValuesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', CfnTheme_ThemeValuePropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "ThemeValuesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme.ThemeValues` resource
 *
 * @param properties - the TypeScript properties of a `ThemeValuesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::AmplifyUIBuilder::Theme.ThemeValues` resource.
 */
// @ts-ignore TS6133
function cfnThemeThemeValuesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTheme_ThemeValuesPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cfnThemeThemeValuePropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnThemeThemeValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTheme.ThemeValuesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeValuesProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? CfnThemeThemeValuePropertyFromCloudFormation(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
