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
    readonly bindingProperties: {
        [key: string]: (CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable);
    } | cdk.IResolvable;
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
    readonly properties: {
        [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable);
    } | cdk.IResolvable;
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
    readonly collectionProperties?: {
        [key: string]: (CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * Describes the events that can be raised on the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-events
     */
    readonly events?: {
        [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable);
    } | cdk.IResolvable;
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
    readonly tags?: {
        [key: string]: (string);
    };
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
export declare class CfnComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Component";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponent;
    /**
     * The unique ID for the Amplify app.
     * @cloudformationAttribute AppId
     */
    readonly attrAppId: string;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     * @cloudformationAttribute EnvironmentName
     */
    readonly attrEnvironmentName: string;
    /**
     * The unique ID of the component.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The information to connect a component's properties to data at runtime. You can't specify `tags` as a valid property for `bindingProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-bindingproperties
     */
    bindingProperties: {
        [key: string]: (CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The type of the component. This can be an Amplify custom UI component or another custom component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-componenttype
     */
    componentType: string;
    /**
     * The name of the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-name
     */
    name: string;
    /**
     * Describes the component's properties that can be overriden in a customized instance of the component. You can't specify `tags` as a valid property for `overrides` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-overrides
     */
    overrides: any | cdk.IResolvable;
    /**
     * Describes the component's properties. You can't specify `tags` as a valid property for `properties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-properties
     */
    properties: {
        [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * A list of the component's variants. A variant is a unique style configuration of a main component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-variants
     */
    variants: Array<CfnComponent.ComponentVariantProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A list of the component's `ComponentChild` instances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-children
     */
    children: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The data binding configuration for the component's properties. Use this for a collection component. You can't specify `tags` as a valid property for `collectionProperties` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-collectionproperties
     */
    collectionProperties: {
        [key: string]: (CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * Describes the events that can be raised on the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-events
     */
    events: {
        [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The schema version of the component when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-schemaversion
     */
    schemaVersion: string | undefined;
    /**
     * The unique ID of the component in its original source system, such as Figma.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-sourceid
     */
    sourceId: string | undefined;
    /**
     * One or more key-value pairs to use when tagging the component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::AmplifyUIBuilder::Component`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentProps);
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
export declare namespace CfnComponent {
    /**
     * The `ActionParameters` property specifies the event action configuration for an element of a `Component` or `ComponentChild` . Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components. `ActionParameters` defines the action that is performed when an event occurs on the component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html
     */
    interface ActionParametersProperty {
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
        readonly fields?: {
            [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable);
        } | cdk.IResolvable;
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
export declare namespace CfnComponent {
    /**
     * The `ComponentBindingPropertiesValue` property specifies the data binding configuration for a component at runtime. You can use `ComponentBindingPropertiesValue` to add exposed properties to a component to allow different values to be entered when a component is reused in different places in an app.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html
     */
    interface ComponentBindingPropertiesValueProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentBindingPropertiesValueProperties` property specifies the data binding configuration for a specific property using data stored in AWS . For AWS connected properties, you can bind a property to data stored in an Amazon S3 bucket, an Amplify DataStore model or an authenticated user attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html
     */
    interface ComponentBindingPropertiesValuePropertiesProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentChild` property specifies a nested UI configuration within a parent `Component` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html
     */
    interface ComponentChildProperty {
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
        readonly events?: {
            [key: string]: (CfnComponent.ComponentEventProperty | cdk.IResolvable);
        } | cdk.IResolvable;
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
        readonly properties: {
            [key: string]: (CfnComponent.ComponentPropertyProperty | cdk.IResolvable);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnComponent {
    /**
     * The `ComponentConditionProperty` property specifies a conditional expression for setting a component property. Use `ComponentConditionProperty` to set a property to different values conditionally, based on the value of another property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html
     */
    interface ComponentConditionPropertyProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentDataConfiguration` property specifies the configuration for binding a component's properties to data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html
     */
    interface ComponentDataConfigurationProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentEvent` property specifies the configuration of an event. You can bind an event and a corresponding action to a `Component` or a `ComponentChild` . A button click is an example of an event.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html
     */
    interface ComponentEventProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentProperty` property specifies the configuration for all of a component's properties. Use `ComponentProperty` to specify the values to render or bind by default.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html
     */
    interface ComponentPropertyProperty {
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
        readonly bindings?: {
            [key: string]: (CfnComponent.FormBindingElementProperty | cdk.IResolvable);
        } | cdk.IResolvable;
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
export declare namespace CfnComponent {
    /**
     * The `ComponentPropertyBindingProperties` property specifies a component property to associate with a binding property. This enables exposed properties on the top level component to propagate data to the component's property values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html
     */
    interface ComponentPropertyBindingPropertiesProperty {
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
export declare namespace CfnComponent {
    /**
     * The `ComponentVariant` property specifies the style configuration of a unique variation of a main component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html
     */
    interface ComponentVariantProperty {
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
        readonly variantValues?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnComponent {
    /**
     * Describes how to bind a component property to form data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html
     */
    interface FormBindingElementProperty {
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
export declare namespace CfnComponent {
    /**
     * The `MutationActionSetStateParameter` property specifies the state configuration when an action modifies a property of another element within the same component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html
     */
    interface MutationActionSetStateParameterProperty {
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
export declare namespace CfnComponent {
    /**
     * The `Predicate` property specifies information for generating Amplify DataStore queries. Use `Predicate` to retrieve a subset of the data in a collection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html
     */
    interface PredicateProperty {
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
export declare namespace CfnComponent {
    /**
     * The `SortProperty` property specifies how to sort the data that you bind to a component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html
     */
    interface SortPropertyProperty {
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
    readonly fields: {
        [key: string]: (CfnForm.FieldConfigProperty | cdk.IResolvable);
    } | cdk.IResolvable;
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
    readonly sectionalElements: {
        [key: string]: (CfnForm.SectionalElementProperty | cdk.IResolvable);
    } | cdk.IResolvable;
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
    readonly tags?: {
        [key: string]: (string);
    };
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
export declare class CfnForm extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Form";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnForm;
    /**
     *
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The type of data source to use to create the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-datatype
     */
    dataType: CfnForm.FormDataTypeConfigProperty | cdk.IResolvable;
    /**
     * Stores the information about the form's fields.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-fields
     */
    fields: {
        [key: string]: (CfnForm.FieldConfigProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The operation to perform on the specified form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-formactiontype
     */
    formActionType: string;
    /**
     * The name of the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-name
     */
    name: string;
    /**
     * The schema version of the form when it was imported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-schemaversion
     */
    schemaVersion: string;
    /**
     * Stores the visual helper elements for the form that are not associated with any data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-sectionalelements
     */
    sectionalElements: {
        [key: string]: (CfnForm.SectionalElementProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * Stores the configuration for the form's style.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-style
     */
    style: CfnForm.FormStyleProperty | cdk.IResolvable;
    /**
     * The unique ID of the Amplify app associated with the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-appid
     */
    appId: string | undefined;
    /**
     * Stores the call to action configuration for the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-cta
     */
    cta: CfnForm.FormCTAProperty | cdk.IResolvable | undefined;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-environmentname
     */
    environmentName: string | undefined;
    /**
     * One or more key-value pairs to use when tagging the form.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::AmplifyUIBuilder::Form`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFormProps);
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
export declare namespace CfnForm {
    /**
     * Describes the configuration information for a field in a table.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html
     */
    interface FieldConfigProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the configuration for the default input values to display for a field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html
     */
    interface FieldInputConfigProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the field position.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html
     */
    interface FieldPositionProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the validation configuration for a field.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html
     */
    interface FieldValidationConfigurationProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the configuration for a button UI element that is a part of a form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html
     */
    interface FormButtonProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the call to action button configuration for the form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html
     */
    interface FormCTAProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the data type configuration for the data source associated with a form.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html
     */
    interface FormDataTypeConfigProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the configuration for an input field on a form. Use `FormInputValueProperty` to specify the values to render or bind by default.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html
     */
    interface FormInputValuePropertyProperty {
        /**
         * The value to assign to the input field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html#cfn-amplifyuibuilder-form-forminputvalueproperty-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnForm {
    /**
     * Describes the configuration for the form's style.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html
     */
    interface FormStyleProperty {
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
export declare namespace CfnForm {
    /**
     * Describes the configuration settings for the form's style properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html
     */
    interface FormStyleConfigProperty {
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
export declare namespace CfnForm {
    /**
     * Stores the configuration information for a visual helper element for a form. A sectional element can be a header, a text block, or a divider. These elements are static and not associated with any data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html
     */
    interface SectionalElementProperty {
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
export declare namespace CfnForm {
    /**
     * Associates a complex object with a display value. Use `ValueMapping` to store how to represent complex objects when they are displayed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html
     */
    interface ValueMappingProperty {
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
export declare namespace CfnForm {
    /**
     * Represents the data binding configuration for a value map.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html
     */
    interface ValueMappingsProperty {
        /**
         * The value and display value pairs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html#cfn-amplifyuibuilder-form-valuemappings-values
         */
        readonly values: Array<CfnForm.ValueMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    }
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
    readonly tags?: {
        [key: string]: (string);
    };
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
export declare class CfnTheme extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AmplifyUIBuilder::Theme";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTheme;
    /**
     * The unique ID for the Amplify app associated with the theme.
     * @cloudformationAttribute AppId
     */
    readonly attrAppId: string;
    /**
     * The time that the theme was created.
     * @cloudformationAttribute CreatedAt
     */
    readonly attrCreatedAt: string;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     * @cloudformationAttribute EnvironmentName
     */
    readonly attrEnvironmentName: string;
    /**
     * The ID for the theme.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The time that the theme was modified.
     * @cloudformationAttribute ModifiedAt
     */
    readonly attrModifiedAt: string;
    /**
     * The name of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-name
     */
    name: string;
    /**
     * A list of key-value pairs that defines the properties of the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-values
     */
    values: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Describes the properties that can be overriden to customize a theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-overrides
     */
    overrides: Array<CfnTheme.ThemeValuesProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * One or more key-value pairs to use when tagging the theme.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::AmplifyUIBuilder::Theme`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnThemeProps);
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
export declare namespace CfnTheme {
    /**
     * The `ThemeValue` property specifies the configuration of a theme's properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html
     */
    interface ThemeValueProperty {
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
export declare namespace CfnTheme {
    /**
     * The `ThemeValues` property specifies key-value pair that defines a property of a theme.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html
     */
    interface ThemeValuesProperty {
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
