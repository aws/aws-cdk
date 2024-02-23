/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::AmplifyUIBuilder::Component resource specifies a component within an Amplify app.
 *
 * A component is a user interface (UI) element that you can customize. Use `ComponentChild` to configure an instance of a `Component` . A `ComponentChild` instance inherits the configuration of the main `Component` .
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Component
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html
 */
export class CfnComponent extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmplifyUIBuilder::Component";

  /**
   * Build a CfnComponent from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnComponent(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique ID of the component.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique ID of the Amplify app associated with the component.
   */
  public appId?: string;

  /**
   * The information to connect a component's properties to data at runtime.
   */
  public bindingProperties: cdk.IResolvable | Record<string, CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable>;

  /**
   * A list of the component's `ComponentChild` instances.
   */
  public children?: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The data binding configuration for the component's properties.
   */
  public collectionProperties?: cdk.IResolvable | Record<string, CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable>;

  /**
   * The type of the component.
   */
  public componentType: string;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   */
  public environmentName?: string;

  /**
   * Describes the events that can be raised on the component.
   */
  public events?: cdk.IResolvable | Record<string, CfnComponent.ComponentEventProperty | cdk.IResolvable>;

  /**
   * The name of the component.
   */
  public name: string;

  /**
   * Describes the component's properties that can be overriden in a customized instance of the component.
   */
  public overrides: any | cdk.IResolvable;

  /**
   * Describes the component's properties.
   */
  public properties: cdk.IResolvable | Record<string, CfnComponent.ComponentPropertyProperty | cdk.IResolvable>;

  /**
   * The schema version of the component when it was imported.
   */
  public schemaVersion?: string;

  /**
   * The unique ID of the component in its original source system, such as Figma.
   */
  public sourceId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more key-value pairs to use when tagging the component.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * A list of the component's variants.
   */
  public variants: Array<CfnComponent.ComponentVariantProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnComponentProps) {
    super(scope, id, {
      "type": CfnComponent.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bindingProperties", this);
    cdk.requireProperty(props, "componentType", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "overrides", this);
    cdk.requireProperty(props, "properties", this);
    cdk.requireProperty(props, "variants", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.appId = props.appId;
    this.bindingProperties = props.bindingProperties;
    this.children = props.children;
    this.collectionProperties = props.collectionProperties;
    this.componentType = props.componentType;
    this.environmentName = props.environmentName;
    this.events = props.events;
    this.name = props.name;
    this.overrides = props.overrides;
    this.properties = props.properties;
    this.schemaVersion = props.schemaVersion;
    this.sourceId = props.sourceId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Component", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.variants = props.variants;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appId": this.appId,
      "bindingProperties": this.bindingProperties,
      "children": this.children,
      "collectionProperties": this.collectionProperties,
      "componentType": this.componentType,
      "environmentName": this.environmentName,
      "events": this.events,
      "name": this.name,
      "overrides": this.overrides,
      "properties": this.properties,
      "schemaVersion": this.schemaVersion,
      "sourceId": this.sourceId,
      "tags": this.tags.renderTags(),
      "variants": this.variants
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponent.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnComponentPropsToCloudFormation(props);
  }
}

export namespace CfnComponent {
  /**
   * The `ComponentBindingPropertiesValue` property specifies the data binding configuration for a component at runtime.
   *
   * You can use `ComponentBindingPropertiesValue` to add exposed properties to a component to allow different values to be entered when a component is reused in different places in an app.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html
   */
  export interface ComponentBindingPropertiesValueProperty {
    /**
     * Describes the properties to customize with data at runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-bindingproperties
     */
    readonly bindingProperties?: CfnComponent.ComponentBindingPropertiesValuePropertiesProperty | cdk.IResolvable;

    /**
     * The default value of the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The property type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalue.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalue-type
     */
    readonly type?: string;
  }

  /**
   * The `ComponentBindingPropertiesValueProperties` property specifies the data binding configuration for a specific property using data stored in AWS .
   *
   * For AWS connected properties, you can bind a property to data stored in an Amazon S3 bucket, an Amplify DataStore model or an authenticated user attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html
   */
  export interface ComponentBindingPropertiesValuePropertiesProperty {
    /**
     * An Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-bucket
     */
    readonly bucket?: string;

    /**
     * The default value to assign to the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The field to bind the data to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-field
     */
    readonly field?: string;

    /**
     * The storage key for an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-key
     */
    readonly key?: string;

    /**
     * An Amplify DataStore model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-model
     */
    readonly model?: string;

    /**
     * A list of predicates for binding a component's properties to data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-predicates
     */
    readonly predicates?: Array<cdk.IResolvable | CfnComponent.PredicateProperty> | cdk.IResolvable;

    /**
     * An authenticated user attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentbindingpropertiesvalueproperties.html#cfn-amplifyuibuilder-component-componentbindingpropertiesvalueproperties-userattribute
     */
    readonly userAttribute?: string;
  }

  /**
   * The `Predicate` property specifies information for generating Amplify DataStore queries.
   *
   * Use `Predicate` to retrieve a subset of the data in a collection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html
   */
  export interface PredicateProperty {
    /**
     * A list of predicates to combine logically.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-and
     */
    readonly and?: Array<cdk.IResolvable | CfnComponent.PredicateProperty> | cdk.IResolvable;

    /**
     * The field to query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-field
     */
    readonly field?: string;

    /**
     * The value to use when performing the evaluation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-operand
     */
    readonly operand?: string;

    /**
     * The operator to use to perform the evaluation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-operator
     */
    readonly operator?: string;

    /**
     * A list of predicates to combine logically.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-predicate.html#cfn-amplifyuibuilder-component-predicate-or
     */
    readonly or?: Array<cdk.IResolvable | CfnComponent.PredicateProperty> | cdk.IResolvable;
  }

  /**
   * The `ComponentProperty` property specifies the configuration for all of a component's properties.
   *
   * Use `ComponentProperty` to specify the values to render or bind by default.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html
   */
  export interface ComponentPropertyProperty {
    /**
     * The information to bind the component property to data at runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-bindingproperties
     */
    readonly bindingProperties?: CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable;

    /**
     * The information to bind the component property to form data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-bindings
     */
    readonly bindings?: cdk.IResolvable | Record<string, CfnComponent.FormBindingElementProperty | cdk.IResolvable>;

    /**
     * The information to bind the component property to data at runtime.
     *
     * Use this for collection components.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-collectionbindingproperties
     */
    readonly collectionBindingProperties?: CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable;

    /**
     * The name of the component that is affected by an event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-componentname
     */
    readonly componentName?: string;

    /**
     * A list of component properties to concatenate to create the value to assign to this component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-concat
     */
    readonly concat?: Array<CfnComponent.ComponentPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The conditional expression to use to assign a value to the component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-condition
     */
    readonly condition?: CfnComponent.ComponentConditionPropertyProperty | cdk.IResolvable;

    /**
     * Specifies whether the user configured the property in Amplify Studio after importing it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-configured
     */
    readonly configured?: boolean | cdk.IResolvable;

    /**
     * The default value to assign to the component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * An event that occurs in your app.
     *
     * Use this for workflow data binding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-event
     */
    readonly event?: string;

    /**
     * The default value assigned to the property when the component is imported into an app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-importedvalue
     */
    readonly importedValue?: string;

    /**
     * The data model to use to assign a value to the component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-model
     */
    readonly model?: string;

    /**
     * The name of the component's property that is affected by an event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-property
     */
    readonly property?: string;

    /**
     * The component type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-type
     */
    readonly type?: string;

    /**
     * An authenticated user attribute to use to assign a value to the component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-userattribute
     */
    readonly userAttribute?: string;

    /**
     * The value to assign to the component property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentproperty.html#cfn-amplifyuibuilder-component-componentproperty-value
     */
    readonly value?: string;
  }

  /**
   * The `ComponentConditionProperty` property specifies a conditional expression for setting a component property.
   *
   * Use `ComponentConditionProperty` to set a property to different values conditionally, based on the value of another property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html
   */
  export interface ComponentConditionPropertyProperty {
    /**
     * The value to assign to the property if the condition is not met.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-else
     */
    readonly else?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * The name of a field.
     *
     * Specify this when the property is a data model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-field
     */
    readonly field?: string;

    /**
     * The value of the property to evaluate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operand
     */
    readonly operand?: string;

    /**
     * The type of the property to evaluate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operandtype
     */
    readonly operandType?: string;

    /**
     * The operator to use to perform the evaluation, such as `eq` to represent equals.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-operator
     */
    readonly operator?: string;

    /**
     * The name of the conditional property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-property
     */
    readonly property?: string;

    /**
     * The value to assign to the property if the condition is met.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentconditionproperty.html#cfn-amplifyuibuilder-component-componentconditionproperty-then
     */
    readonly then?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
  }

  /**
   * The `ComponentPropertyBindingProperties` property specifies a component property to associate with a binding property.
   *
   * This enables exposed properties on the top level component to propagate data to the component's property values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html
   */
  export interface ComponentPropertyBindingPropertiesProperty {
    /**
     * The data field to bind the property to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html#cfn-amplifyuibuilder-component-componentpropertybindingproperties-field
     */
    readonly field?: string;

    /**
     * The component property to bind to the data field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentpropertybindingproperties.html#cfn-amplifyuibuilder-component-componentpropertybindingproperties-property
     */
    readonly property: string;
  }

  /**
   * Describes how to bind a component property to form data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html
   */
  export interface FormBindingElementProperty {
    /**
     * The name of the component to retrieve a value from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html#cfn-amplifyuibuilder-component-formbindingelement-element
     */
    readonly element: string;

    /**
     * The property to retrieve a value from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-formbindingelement.html#cfn-amplifyuibuilder-component-formbindingelement-property
     */
    readonly property: string;
  }

  /**
   * The `ComponentDataConfiguration` property specifies the configuration for binding a component's properties to data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html
   */
  export interface ComponentDataConfigurationProperty {
    /**
     * A list of IDs to use to bind data to a component.
     *
     * Use this property to bind specifically chosen data, rather than data retrieved from a query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-identifiers
     */
    readonly identifiers?: Array<string>;

    /**
     * The name of the data model to use to bind data to a component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-model
     */
    readonly model: string;

    /**
     * Represents the conditional logic to use when binding data to a component.
     *
     * Use this property to retrieve only a subset of the data in a collection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-predicate
     */
    readonly predicate?: cdk.IResolvable | CfnComponent.PredicateProperty;

    /**
     * Describes how to sort the component's properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentdataconfiguration.html#cfn-amplifyuibuilder-component-componentdataconfiguration-sort
     */
    readonly sort?: Array<cdk.IResolvable | CfnComponent.SortPropertyProperty> | cdk.IResolvable;
  }

  /**
   * The `SortProperty` property specifies how to sort the data that you bind to a component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html
   */
  export interface SortPropertyProperty {
    /**
     * The direction of the sort, either ascending or descending.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html#cfn-amplifyuibuilder-component-sortproperty-direction
     */
    readonly direction: string;

    /**
     * The field to perform the sort on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-sortproperty.html#cfn-amplifyuibuilder-component-sortproperty-field
     */
    readonly field: string;
  }

  /**
   * The `ComponentVariant` property specifies the style configuration of a unique variation of a main component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html
   */
  export interface ComponentVariantProperty {
    /**
     * The properties of the component variant that can be overriden when customizing an instance of the component.
     *
     * You can't specify `tags` as a valid property for `overrides` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html#cfn-amplifyuibuilder-component-componentvariant-overrides
     */
    readonly overrides?: any | cdk.IResolvable;

    /**
     * The combination of variants that comprise this variant.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentvariant.html#cfn-amplifyuibuilder-component-componentvariant-variantvalues
     */
    readonly variantValues?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The `ComponentEvent` property specifies the configuration of an event.
   *
   * You can bind an event and a corresponding action to a `Component` or a `ComponentChild` . A button click is an example of an event.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html
   */
  export interface ComponentEventProperty {
    /**
     * The action to perform when a specific event is raised.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html#cfn-amplifyuibuilder-component-componentevent-action
     */
    readonly action?: string;

    /**
     * Describes information about the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentevent.html#cfn-amplifyuibuilder-component-componentevent-parameters
     */
    readonly parameters?: CfnComponent.ActionParametersProperty | cdk.IResolvable;
  }

  /**
   * Represents the event action configuration for an element of a `Component` or `ComponentChild` .
   *
   * Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components. `ActionParameters` defines the action that is performed when an event occurs on the component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html
   */
  export interface ActionParametersProperty {
    /**
     * The HTML anchor link to the location to open.
     *
     * Specify this value for a navigation action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-anchor
     */
    readonly anchor?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * A dictionary of key-value pairs mapping Amplify Studio properties to fields in a data model.
     *
     * Use when the action performs an operation on an Amplify DataStore model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-fields
     */
    readonly fields?: cdk.IResolvable | Record<string, CfnComponent.ComponentPropertyProperty | cdk.IResolvable>;

    /**
     * Specifies whether the user should be signed out globally.
     *
     * Specify this value for an auth sign out action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-global
     */
    readonly global?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * The unique ID of the component that the `ActionParameters` apply to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-id
     */
    readonly id?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * The name of the data model.
     *
     * Use when the action performs an operation on an Amplify DataStore model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-model
     */
    readonly model?: string;

    /**
     * A key-value pair that specifies the state property name and its initial value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-state
     */
    readonly state?: cdk.IResolvable | CfnComponent.MutationActionSetStateParameterProperty;

    /**
     * The element within the same component to modify when the action occurs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-target
     */
    readonly target?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * The type of navigation action.
     *
     * Valid values are `url` and `anchor` . This value is required for a navigation action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-type
     */
    readonly type?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;

    /**
     * The URL to the location to open.
     *
     * Specify this value for a navigation action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-actionparameters.html#cfn-amplifyuibuilder-component-actionparameters-url
     */
    readonly url?: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
  }

  /**
   * Represents the state configuration when an action modifies a property of another element within the same component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html
   */
  export interface MutationActionSetStateParameterProperty {
    /**
     * The name of the component that is being modified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-componentname
     */
    readonly componentName: string;

    /**
     * The name of the component property to apply the state configuration to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-property
     */
    readonly property: string;

    /**
     * The state configuration to assign to the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-mutationactionsetstateparameter.html#cfn-amplifyuibuilder-component-mutationactionsetstateparameter-set
     */
    readonly set: CfnComponent.ComponentPropertyProperty | cdk.IResolvable;
  }

  /**
   * The `ComponentChild` property specifies a nested UI configuration within a parent `Component` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html
   */
  export interface ComponentChildProperty {
    /**
     * The list of `ComponentChild` instances for this component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-children
     */
    readonly children?: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The type of the child component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-componenttype
     */
    readonly componentType: string;

    /**
     * Describes the events that can be raised on the child component.
     *
     * Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-events
     */
    readonly events?: cdk.IResolvable | Record<string, CfnComponent.ComponentEventProperty | cdk.IResolvable>;

    /**
     * The name of the child component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-name
     */
    readonly name: string;

    /**
     * Describes the properties of the child component.
     *
     * You can't specify `tags` as a valid property for `properties` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-component-componentchild.html#cfn-amplifyuibuilder-component-componentchild-properties
     */
    readonly properties: cdk.IResolvable | Record<string, CfnComponent.ComponentPropertyProperty | cdk.IResolvable>;
  }
}

/**
 * Properties for defining a `CfnComponent`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html
 */
export interface CfnComponentProps {
  /**
   * The unique ID of the Amplify app associated with the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-appid
   */
  readonly appId?: string;

  /**
   * The information to connect a component's properties to data at runtime.
   *
   * You can't specify `tags` as a valid property for `bindingProperties` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-bindingproperties
   */
  readonly bindingProperties: cdk.IResolvable | Record<string, CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable>;

  /**
   * A list of the component's `ComponentChild` instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-children
   */
  readonly children?: Array<CfnComponent.ComponentChildProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The data binding configuration for the component's properties.
   *
   * Use this for a collection component. You can't specify `tags` as a valid property for `collectionProperties` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-collectionproperties
   */
  readonly collectionProperties?: cdk.IResolvable | Record<string, CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable>;

  /**
   * The type of the component.
   *
   * This can be an Amplify custom UI component or another custom component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-componenttype
   */
  readonly componentType: string;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-environmentname
   */
  readonly environmentName?: string;

  /**
   * Describes the events that can be raised on the component.
   *
   * Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-events
   */
  readonly events?: cdk.IResolvable | Record<string, CfnComponent.ComponentEventProperty | cdk.IResolvable>;

  /**
   * The name of the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-name
   */
  readonly name: string;

  /**
   * Describes the component's properties that can be overriden in a customized instance of the component.
   *
   * You can't specify `tags` as a valid property for `overrides` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-overrides
   */
  readonly overrides: any | cdk.IResolvable;

  /**
   * Describes the component's properties.
   *
   * You can't specify `tags` as a valid property for `properties` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-properties
   */
  readonly properties: cdk.IResolvable | Record<string, CfnComponent.ComponentPropertyProperty | cdk.IResolvable>;

  /**
   * The schema version of the component when it was imported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-schemaversion
   */
  readonly schemaVersion?: string;

  /**
   * The unique ID of the component in its original source system, such as Figma.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-sourceid
   */
  readonly sourceId?: string;

  /**
   * One or more key-value pairs to use when tagging the component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * A list of the component's variants.
   *
   * A variant is a unique style configuration of a main component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-component.html#cfn-amplifyuibuilder-component-variants
   */
  readonly variants: Array<CfnComponent.ComponentVariantProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentPredicatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("and", cdk.listValidator(CfnComponentPredicatePropertyValidator))(properties.and));
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("operand", cdk.validateString)(properties.operand));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  errors.collect(cdk.propertyValidator("or", cdk.listValidator(CfnComponentPredicatePropertyValidator))(properties.or));
  return errors.wrap("supplied properties not correct for \"PredicateProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentPredicatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentPredicatePropertyValidator(properties).assertSuccess();
  return {
    "And": cdk.listMapper(convertCfnComponentPredicatePropertyToCloudFormation)(properties.and),
    "Field": cdk.stringToCloudFormation(properties.field),
    "Operand": cdk.stringToCloudFormation(properties.operand),
    "Operator": cdk.stringToCloudFormation(properties.operator),
    "Or": cdk.listMapper(convertCfnComponentPredicatePropertyToCloudFormation)(properties.or)
  };
}

// @ts-ignore TS6133
function CfnComponentPredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponent.PredicateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.PredicateProperty>();
  ret.addPropertyResult("and", "And", (properties.And != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.And) : undefined));
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("operand", "Operand", (properties.Operand != null ? cfn_parse.FromCloudFormation.getString(properties.Operand) : undefined));
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addPropertyResult("or", "Or", (properties.Or != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.Or) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentBindingPropertiesValuePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValuePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("predicates", cdk.listValidator(CfnComponentPredicatePropertyValidator))(properties.predicates));
  errors.collect(cdk.propertyValidator("userAttribute", cdk.validateString)(properties.userAttribute));
  return errors.wrap("supplied properties not correct for \"ComponentBindingPropertiesValuePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentBindingPropertiesValuePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentBindingPropertiesValuePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Field": cdk.stringToCloudFormation(properties.field),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Model": cdk.stringToCloudFormation(properties.model),
    "Predicates": cdk.listMapper(convertCfnComponentPredicatePropertyToCloudFormation)(properties.predicates),
    "UserAttribute": cdk.stringToCloudFormation(properties.userAttribute)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentBindingPropertiesValuePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentBindingPropertiesValuePropertiesProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("predicates", "Predicates", (properties.Predicates != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentPredicatePropertyFromCloudFormation)(properties.Predicates) : undefined));
  ret.addPropertyResult("userAttribute", "UserAttribute", (properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentBindingPropertiesValueProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentBindingPropertiesValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bindingProperties", CfnComponentComponentBindingPropertiesValuePropertiesPropertyValidator)(properties.bindingProperties));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ComponentBindingPropertiesValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentBindingPropertiesValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentBindingPropertiesValuePropertyValidator(properties).assertSuccess();
  return {
    "BindingProperties": convertCfnComponentComponentBindingPropertiesValuePropertiesPropertyToCloudFormation(properties.bindingProperties),
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentBindingPropertiesValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentBindingPropertiesValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentBindingPropertiesValueProperty>();
  ret.addPropertyResult("bindingProperties", "BindingProperties", (properties.BindingProperties != null ? CfnComponentComponentBindingPropertiesValuePropertiesPropertyFromCloudFormation(properties.BindingProperties) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentConditionPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentConditionPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentConditionPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("else", CfnComponentComponentPropertyPropertyValidator)(properties.else));
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("operand", cdk.validateString)(properties.operand));
  errors.collect(cdk.propertyValidator("operandType", cdk.validateString)(properties.operandType));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  errors.collect(cdk.propertyValidator("then", CfnComponentComponentPropertyPropertyValidator)(properties.then));
  return errors.wrap("supplied properties not correct for \"ComponentConditionPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentConditionPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentConditionPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Else": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.else),
    "Field": cdk.stringToCloudFormation(properties.field),
    "Operand": cdk.stringToCloudFormation(properties.operand),
    "OperandType": cdk.stringToCloudFormation(properties.operandType),
    "Operator": cdk.stringToCloudFormation(properties.operator),
    "Property": cdk.stringToCloudFormation(properties.property),
    "Then": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.then)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentConditionPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentConditionPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentConditionPropertyProperty>();
  ret.addPropertyResult("else", "Else", (properties.Else != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Else) : undefined));
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("operand", "Operand", (properties.Operand != null ? cfn_parse.FromCloudFormation.getString(properties.Operand) : undefined));
  ret.addPropertyResult("operandType", "OperandType", (properties.OperandType != null ? cfn_parse.FromCloudFormation.getString(properties.OperandType) : undefined));
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addPropertyResult("then", "Then", (properties.Then != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Then) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentPropertyBindingPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyBindingPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentPropertyBindingPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("property", cdk.requiredValidator)(properties.property));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  return errors.wrap("supplied properties not correct for \"ComponentPropertyBindingPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentPropertyBindingPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "Property": cdk.stringToCloudFormation(properties.property)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentPropertyBindingPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentPropertyBindingPropertiesProperty>();
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormBindingElementProperty`
 *
 * @param properties - the TypeScript properties of a `FormBindingElementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentFormBindingElementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("element", cdk.requiredValidator)(properties.element));
  errors.collect(cdk.propertyValidator("element", cdk.validateString)(properties.element));
  errors.collect(cdk.propertyValidator("property", cdk.requiredValidator)(properties.property));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  return errors.wrap("supplied properties not correct for \"FormBindingElementProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentFormBindingElementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentFormBindingElementPropertyValidator(properties).assertSuccess();
  return {
    "Element": cdk.stringToCloudFormation(properties.element),
    "Property": cdk.stringToCloudFormation(properties.property)
  };
}

// @ts-ignore TS6133
function CfnComponentFormBindingElementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.FormBindingElementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.FormBindingElementProperty>();
  ret.addPropertyResult("element", "Element", (properties.Element != null ? cfn_parse.FromCloudFormation.getString(properties.Element) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bindingProperties", CfnComponentComponentPropertyBindingPropertiesPropertyValidator)(properties.bindingProperties));
  errors.collect(cdk.propertyValidator("bindings", cdk.hashValidator(CfnComponentFormBindingElementPropertyValidator))(properties.bindings));
  errors.collect(cdk.propertyValidator("collectionBindingProperties", CfnComponentComponentPropertyBindingPropertiesPropertyValidator)(properties.collectionBindingProperties));
  errors.collect(cdk.propertyValidator("componentName", cdk.validateString)(properties.componentName));
  errors.collect(cdk.propertyValidator("concat", cdk.listValidator(CfnComponentComponentPropertyPropertyValidator))(properties.concat));
  errors.collect(cdk.propertyValidator("condition", CfnComponentComponentConditionPropertyPropertyValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("configured", cdk.validateBoolean)(properties.configured));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("event", cdk.validateString)(properties.event));
  errors.collect(cdk.propertyValidator("importedValue", cdk.validateString)(properties.importedValue));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("userAttribute", cdk.validateString)(properties.userAttribute));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ComponentPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentPropertyPropertyValidator(properties).assertSuccess();
  return {
    "BindingProperties": convertCfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties.bindingProperties),
    "Bindings": cdk.hashMapper(convertCfnComponentFormBindingElementPropertyToCloudFormation)(properties.bindings),
    "CollectionBindingProperties": convertCfnComponentComponentPropertyBindingPropertiesPropertyToCloudFormation(properties.collectionBindingProperties),
    "ComponentName": cdk.stringToCloudFormation(properties.componentName),
    "Concat": cdk.listMapper(convertCfnComponentComponentPropertyPropertyToCloudFormation)(properties.concat),
    "Condition": convertCfnComponentComponentConditionPropertyPropertyToCloudFormation(properties.condition),
    "Configured": cdk.booleanToCloudFormation(properties.configured),
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Event": cdk.stringToCloudFormation(properties.event),
    "ImportedValue": cdk.stringToCloudFormation(properties.importedValue),
    "Model": cdk.stringToCloudFormation(properties.model),
    "Property": cdk.stringToCloudFormation(properties.property),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UserAttribute": cdk.stringToCloudFormation(properties.userAttribute),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentPropertyProperty>();
  ret.addPropertyResult("bindingProperties", "BindingProperties", (properties.BindingProperties != null ? CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties.BindingProperties) : undefined));
  ret.addPropertyResult("bindings", "Bindings", (properties.Bindings != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentFormBindingElementPropertyFromCloudFormation)(properties.Bindings) : undefined));
  ret.addPropertyResult("collectionBindingProperties", "CollectionBindingProperties", (properties.CollectionBindingProperties != null ? CfnComponentComponentPropertyBindingPropertiesPropertyFromCloudFormation(properties.CollectionBindingProperties) : undefined));
  ret.addPropertyResult("componentName", "ComponentName", (properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined));
  ret.addPropertyResult("concat", "Concat", (properties.Concat != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Concat) : undefined));
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? CfnComponentComponentConditionPropertyPropertyFromCloudFormation(properties.Condition) : undefined));
  ret.addPropertyResult("configured", "Configured", (properties.Configured != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Configured) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("event", "Event", (properties.Event != null ? cfn_parse.FromCloudFormation.getString(properties.Event) : undefined));
  ret.addPropertyResult("importedValue", "ImportedValue", (properties.ImportedValue != null ? cfn_parse.FromCloudFormation.getString(properties.ImportedValue) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("userAttribute", "UserAttribute", (properties.UserAttribute != null ? cfn_parse.FromCloudFormation.getString(properties.UserAttribute) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SortPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `SortPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentSortPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("direction", cdk.requiredValidator)(properties.direction));
  errors.collect(cdk.propertyValidator("direction", cdk.validateString)(properties.direction));
  errors.collect(cdk.propertyValidator("field", cdk.requiredValidator)(properties.field));
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  return errors.wrap("supplied properties not correct for \"SortPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentSortPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentSortPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Direction": cdk.stringToCloudFormation(properties.direction),
    "Field": cdk.stringToCloudFormation(properties.field)
  };
}

// @ts-ignore TS6133
function CfnComponentSortPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponent.SortPropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.SortPropertyProperty>();
  ret.addPropertyResult("direction", "Direction", (properties.Direction != null ? cfn_parse.FromCloudFormation.getString(properties.Direction) : undefined));
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentDataConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentDataConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentDataConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identifiers", cdk.listValidator(cdk.validateString))(properties.identifiers));
  errors.collect(cdk.propertyValidator("model", cdk.requiredValidator)(properties.model));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("predicate", CfnComponentPredicatePropertyValidator)(properties.predicate));
  errors.collect(cdk.propertyValidator("sort", cdk.listValidator(CfnComponentSortPropertyPropertyValidator))(properties.sort));
  return errors.wrap("supplied properties not correct for \"ComponentDataConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentDataConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentDataConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Identifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.identifiers),
    "Model": cdk.stringToCloudFormation(properties.model),
    "Predicate": convertCfnComponentPredicatePropertyToCloudFormation(properties.predicate),
    "Sort": cdk.listMapper(convertCfnComponentSortPropertyPropertyToCloudFormation)(properties.sort)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentDataConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentDataConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentDataConfigurationProperty>();
  ret.addPropertyResult("identifiers", "Identifiers", (properties.Identifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Identifiers) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("predicate", "Predicate", (properties.Predicate != null ? CfnComponentPredicatePropertyFromCloudFormation(properties.Predicate) : undefined));
  ret.addPropertyResult("sort", "Sort", (properties.Sort != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentSortPropertyPropertyFromCloudFormation)(properties.Sort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentVariantProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentVariantProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentVariantPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("overrides", cdk.validateObject)(properties.overrides));
  errors.collect(cdk.propertyValidator("variantValues", cdk.hashValidator(cdk.validateString))(properties.variantValues));
  return errors.wrap("supplied properties not correct for \"ComponentVariantProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentVariantPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentVariantPropertyValidator(properties).assertSuccess();
  return {
    "Overrides": cdk.objectToCloudFormation(properties.overrides),
    "VariantValues": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variantValues)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentVariantPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentVariantProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentVariantProperty>();
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? cfn_parse.FromCloudFormation.getAny(properties.Overrides) : undefined));
  ret.addPropertyResult("variantValues", "VariantValues", (properties.VariantValues != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.VariantValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MutationActionSetStateParameterProperty`
 *
 * @param properties - the TypeScript properties of a `MutationActionSetStateParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentMutationActionSetStateParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentName", cdk.requiredValidator)(properties.componentName));
  errors.collect(cdk.propertyValidator("componentName", cdk.validateString)(properties.componentName));
  errors.collect(cdk.propertyValidator("property", cdk.requiredValidator)(properties.property));
  errors.collect(cdk.propertyValidator("property", cdk.validateString)(properties.property));
  errors.collect(cdk.propertyValidator("set", cdk.requiredValidator)(properties.set));
  errors.collect(cdk.propertyValidator("set", CfnComponentComponentPropertyPropertyValidator)(properties.set));
  return errors.wrap("supplied properties not correct for \"MutationActionSetStateParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentMutationActionSetStateParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentMutationActionSetStateParameterPropertyValidator(properties).assertSuccess();
  return {
    "ComponentName": cdk.stringToCloudFormation(properties.componentName),
    "Property": cdk.stringToCloudFormation(properties.property),
    "Set": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.set)
  };
}

// @ts-ignore TS6133
function CfnComponentMutationActionSetStateParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponent.MutationActionSetStateParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.MutationActionSetStateParameterProperty>();
  ret.addPropertyResult("componentName", "ComponentName", (properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined));
  ret.addPropertyResult("property", "Property", (properties.Property != null ? cfn_parse.FromCloudFormation.getString(properties.Property) : undefined));
  ret.addPropertyResult("set", "Set", (properties.Set != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Set) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ActionParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentActionParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("anchor", CfnComponentComponentPropertyPropertyValidator)(properties.anchor));
  errors.collect(cdk.propertyValidator("fields", cdk.hashValidator(CfnComponentComponentPropertyPropertyValidator))(properties.fields));
  errors.collect(cdk.propertyValidator("global", CfnComponentComponentPropertyPropertyValidator)(properties.global));
  errors.collect(cdk.propertyValidator("id", CfnComponentComponentPropertyPropertyValidator)(properties.id));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("state", CfnComponentMutationActionSetStateParameterPropertyValidator)(properties.state));
  errors.collect(cdk.propertyValidator("target", CfnComponentComponentPropertyPropertyValidator)(properties.target));
  errors.collect(cdk.propertyValidator("type", CfnComponentComponentPropertyPropertyValidator)(properties.type));
  errors.collect(cdk.propertyValidator("url", CfnComponentComponentPropertyPropertyValidator)(properties.url));
  return errors.wrap("supplied properties not correct for \"ActionParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentActionParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentActionParametersPropertyValidator(properties).assertSuccess();
  return {
    "Anchor": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.anchor),
    "Fields": cdk.hashMapper(convertCfnComponentComponentPropertyPropertyToCloudFormation)(properties.fields),
    "Global": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.global),
    "Id": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.id),
    "Model": cdk.stringToCloudFormation(properties.model),
    "State": convertCfnComponentMutationActionSetStateParameterPropertyToCloudFormation(properties.state),
    "Target": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.target),
    "Type": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.type),
    "Url": convertCfnComponentComponentPropertyPropertyToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnComponentActionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ActionParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ActionParametersProperty>();
  ret.addPropertyResult("anchor", "Anchor", (properties.Anchor != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Anchor) : undefined));
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addPropertyResult("global", "Global", (properties.Global != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Global) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? CfnComponentMutationActionSetStateParameterPropertyFromCloudFormation(properties.State) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Target) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Type) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? CfnComponentComponentPropertyPropertyFromCloudFormation(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentEventProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("parameters", CfnComponentActionParametersPropertyValidator)(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ComponentEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentEventPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Parameters": convertCfnComponentActionParametersPropertyToCloudFormation(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentEventProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? CfnComponentActionParametersPropertyFromCloudFormation(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentChildProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentChildProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentComponentChildPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("children", cdk.listValidator(CfnComponentComponentChildPropertyValidator))(properties.children));
  errors.collect(cdk.propertyValidator("componentType", cdk.requiredValidator)(properties.componentType));
  errors.collect(cdk.propertyValidator("componentType", cdk.validateString)(properties.componentType));
  errors.collect(cdk.propertyValidator("events", cdk.hashValidator(CfnComponentComponentEventPropertyValidator))(properties.events));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("properties", cdk.requiredValidator)(properties.properties));
  errors.collect(cdk.propertyValidator("properties", cdk.hashValidator(CfnComponentComponentPropertyPropertyValidator))(properties.properties));
  return errors.wrap("supplied properties not correct for \"ComponentChildProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentComponentChildPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentComponentChildPropertyValidator(properties).assertSuccess();
  return {
    "Children": cdk.listMapper(convertCfnComponentComponentChildPropertyToCloudFormation)(properties.children),
    "ComponentType": cdk.stringToCloudFormation(properties.componentType),
    "Events": cdk.hashMapper(convertCfnComponentComponentEventPropertyToCloudFormation)(properties.events),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Properties": cdk.hashMapper(convertCfnComponentComponentPropertyPropertyToCloudFormation)(properties.properties)
  };
}

// @ts-ignore TS6133
function CfnComponentComponentChildPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponent.ComponentChildProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponent.ComponentChildProperty>();
  ret.addPropertyResult("children", "Children", (properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentChildPropertyFromCloudFormation)(properties.Children) : undefined));
  ret.addPropertyResult("componentType", "ComponentType", (properties.ComponentType != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentType) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentEventPropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Properties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appId", cdk.validateString)(properties.appId));
  errors.collect(cdk.propertyValidator("bindingProperties", cdk.requiredValidator)(properties.bindingProperties));
  errors.collect(cdk.propertyValidator("bindingProperties", cdk.hashValidator(CfnComponentComponentBindingPropertiesValuePropertyValidator))(properties.bindingProperties));
  errors.collect(cdk.propertyValidator("children", cdk.listValidator(CfnComponentComponentChildPropertyValidator))(properties.children));
  errors.collect(cdk.propertyValidator("collectionProperties", cdk.hashValidator(CfnComponentComponentDataConfigurationPropertyValidator))(properties.collectionProperties));
  errors.collect(cdk.propertyValidator("componentType", cdk.requiredValidator)(properties.componentType));
  errors.collect(cdk.propertyValidator("componentType", cdk.validateString)(properties.componentType));
  errors.collect(cdk.propertyValidator("environmentName", cdk.validateString)(properties.environmentName));
  errors.collect(cdk.propertyValidator("events", cdk.hashValidator(CfnComponentComponentEventPropertyValidator))(properties.events));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overrides", cdk.requiredValidator)(properties.overrides));
  errors.collect(cdk.propertyValidator("overrides", cdk.validateObject)(properties.overrides));
  errors.collect(cdk.propertyValidator("properties", cdk.requiredValidator)(properties.properties));
  errors.collect(cdk.propertyValidator("properties", cdk.hashValidator(CfnComponentComponentPropertyPropertyValidator))(properties.properties));
  errors.collect(cdk.propertyValidator("schemaVersion", cdk.validateString)(properties.schemaVersion));
  errors.collect(cdk.propertyValidator("sourceId", cdk.validateString)(properties.sourceId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("variants", cdk.requiredValidator)(properties.variants));
  errors.collect(cdk.propertyValidator("variants", cdk.listValidator(CfnComponentComponentVariantPropertyValidator))(properties.variants));
  return errors.wrap("supplied properties not correct for \"CfnComponentProps\"");
}

// @ts-ignore TS6133
function convertCfnComponentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentPropsValidator(properties).assertSuccess();
  return {
    "AppId": cdk.stringToCloudFormation(properties.appId),
    "BindingProperties": cdk.hashMapper(convertCfnComponentComponentBindingPropertiesValuePropertyToCloudFormation)(properties.bindingProperties),
    "Children": cdk.listMapper(convertCfnComponentComponentChildPropertyToCloudFormation)(properties.children),
    "CollectionProperties": cdk.hashMapper(convertCfnComponentComponentDataConfigurationPropertyToCloudFormation)(properties.collectionProperties),
    "ComponentType": cdk.stringToCloudFormation(properties.componentType),
    "EnvironmentName": cdk.stringToCloudFormation(properties.environmentName),
    "Events": cdk.hashMapper(convertCfnComponentComponentEventPropertyToCloudFormation)(properties.events),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Overrides": cdk.objectToCloudFormation(properties.overrides),
    "Properties": cdk.hashMapper(convertCfnComponentComponentPropertyPropertyToCloudFormation)(properties.properties),
    "SchemaVersion": cdk.stringToCloudFormation(properties.schemaVersion),
    "SourceId": cdk.stringToCloudFormation(properties.sourceId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Variants": cdk.listMapper(convertCfnComponentComponentVariantPropertyToCloudFormation)(properties.variants)
  };
}

// @ts-ignore TS6133
function CfnComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentProps>();
  ret.addPropertyResult("appId", "AppId", (properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined));
  ret.addPropertyResult("bindingProperties", "BindingProperties", (properties.BindingProperties != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentBindingPropertiesValuePropertyFromCloudFormation)(properties.BindingProperties) : undefined));
  ret.addPropertyResult("children", "Children", (properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentChildPropertyFromCloudFormation)(properties.Children) : undefined));
  ret.addPropertyResult("collectionProperties", "CollectionProperties", (properties.CollectionProperties != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentDataConfigurationPropertyFromCloudFormation)(properties.CollectionProperties) : undefined));
  ret.addPropertyResult("componentType", "ComponentType", (properties.ComponentType != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentType) : undefined));
  ret.addPropertyResult("environmentName", "EnvironmentName", (properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentEventPropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? cfn_parse.FromCloudFormation.getAny(properties.Overrides) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentComponentPropertyPropertyFromCloudFormation)(properties.Properties) : undefined));
  ret.addPropertyResult("schemaVersion", "SchemaVersion", (properties.SchemaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersion) : undefined));
  ret.addPropertyResult("sourceId", "SourceId", (properties.SourceId != null ? cfn_parse.FromCloudFormation.getString(properties.SourceId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("variants", "Variants", (properties.Variants != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentComponentVariantPropertyFromCloudFormation)(properties.Variants) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::AmplifyUIBuilder::Form resource specifies all of the information that is required to create a form.
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Form
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html
 */
export class CfnForm extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmplifyUIBuilder::Form";

  /**
   * Build a CfnForm from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnForm(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the form.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique ID of the Amplify app associated with the form.
   */
  public appId?: string;

  /**
   * The `FormCTA` object that stores the call to action configuration for the form.
   */
  public cta?: CfnForm.FormCTAProperty | cdk.IResolvable;

  /**
   * The type of data source to use to create the form.
   */
  public dataType: CfnForm.FormDataTypeConfigProperty | cdk.IResolvable;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   */
  public environmentName?: string;

  /**
   * The configuration information for the form's fields.
   */
  public fields: cdk.IResolvable | Record<string, CfnForm.FieldConfigProperty | cdk.IResolvable>;

  /**
   * Specifies whether to perform a create or update action on the form.
   */
  public formActionType: string;

  /**
   * Specifies an icon or decoration to display on the form.
   */
  public labelDecorator?: string;

  /**
   * The name of the form.
   */
  public name: string;

  /**
   * The schema version of the form.
   */
  public schemaVersion: string;

  /**
   * The configuration information for the visual helper elements for the form.
   */
  public sectionalElements: cdk.IResolvable | Record<string, cdk.IResolvable | CfnForm.SectionalElementProperty>;

  /**
   * The configuration for the form's style.
   */
  public style: CfnForm.FormStyleProperty | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more key-value pairs to use when tagging the form data.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFormProps) {
    super(scope, id, {
      "type": CfnForm.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataType", this);
    cdk.requireProperty(props, "fields", this);
    cdk.requireProperty(props, "formActionType", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schemaVersion", this);
    cdk.requireProperty(props, "sectionalElements", this);
    cdk.requireProperty(props, "style", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.appId = props.appId;
    this.cta = props.cta;
    this.dataType = props.dataType;
    this.environmentName = props.environmentName;
    this.fields = props.fields;
    this.formActionType = props.formActionType;
    this.labelDecorator = props.labelDecorator;
    this.name = props.name;
    this.schemaVersion = props.schemaVersion;
    this.sectionalElements = props.sectionalElements;
    this.style = props.style;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Form", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appId": this.appId,
      "cta": this.cta,
      "dataType": this.dataType,
      "environmentName": this.environmentName,
      "fields": this.fields,
      "formActionType": this.formActionType,
      "labelDecorator": this.labelDecorator,
      "name": this.name,
      "schemaVersion": this.schemaVersion,
      "sectionalElements": this.sectionalElements,
      "style": this.style,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnForm.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFormPropsToCloudFormation(props);
  }
}

export namespace CfnForm {
  /**
   * The `FormCTA` property specifies the call to action button configuration for the form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html
   */
  export interface FormCTAProperty {
    /**
     * Displays a cancel button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-cancel
     */
    readonly cancel?: CfnForm.FormButtonProperty | cdk.IResolvable;

    /**
     * Displays a clear button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-clear
     */
    readonly clear?: CfnForm.FormButtonProperty | cdk.IResolvable;

    /**
     * The position of the button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-position
     */
    readonly position?: string;

    /**
     * Displays a submit button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formcta.html#cfn-amplifyuibuilder-form-formcta-submit
     */
    readonly submit?: CfnForm.FormButtonProperty | cdk.IResolvable;
  }

  /**
   * The `FormButton` property specifies the configuration for a button UI element that is a part of a form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html
   */
  export interface FormButtonProperty {
    /**
     * Describes the button's properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-children
     */
    readonly children?: string;

    /**
     * Specifies whether the button is visible on the form.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-excluded
     */
    readonly excluded?: boolean | cdk.IResolvable;

    /**
     * The position of the button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formbutton.html#cfn-amplifyuibuilder-form-formbutton-position
     */
    readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;
  }

  /**
   * The `FieldPosition` property specifies the field position.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html
   */
  export interface FieldPositionProperty {
    /**
     * The field position is below the field specified by the string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-below
     */
    readonly below?: string;

    /**
     * The field position is fixed and doesn't change in relation to other fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-fixed
     */
    readonly fixed?: string;

    /**
     * The field position is to the right of the field specified by the string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldposition.html#cfn-amplifyuibuilder-form-fieldposition-rightof
     */
    readonly rightOf?: string;
  }

  /**
   * The `FieldConfig` property specifies the configuration information for a field in a table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html
   */
  export interface FieldConfigProperty {
    /**
     * Specifies whether to hide a field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-excluded
     */
    readonly excluded?: boolean | cdk.IResolvable;

    /**
     * Describes the configuration for the default input value to display for a field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-inputtype
     */
    readonly inputType?: CfnForm.FieldInputConfigProperty | cdk.IResolvable;

    /**
     * The label for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-label
     */
    readonly label?: string;

    /**
     * Specifies the field position.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-position
     */
    readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;

    /**
     * The validations to perform on the value in the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldconfig.html#cfn-amplifyuibuilder-form-fieldconfig-validations
     */
    readonly validations?: Array<CfnForm.FieldValidationConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The `FieldValidationConfiguration` property specifies the validation configuration for a field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html
   */
  export interface FieldValidationConfigurationProperty {
    /**
     * The validation to perform on a number value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-numvalues
     */
    readonly numValues?: Array<number> | cdk.IResolvable;

    /**
     * The validation to perform on a string value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-strvalues
     */
    readonly strValues?: Array<string>;

    /**
     * The validation to perform on an object type.
     *
     * ``
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-type
     */
    readonly type: string;

    /**
     * The validation message to display.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldvalidationconfiguration.html#cfn-amplifyuibuilder-form-fieldvalidationconfiguration-validationmessage
     */
    readonly validationMessage?: string;
  }

  /**
   * The `FieldInputConfig` property specifies the configuration for the default input values to display for a field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html
   */
  export interface FieldInputConfigProperty {
    /**
     * Specifies whether a field has a default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultchecked
     */
    readonly defaultChecked?: boolean | cdk.IResolvable;

    /**
     * The default country code for a phone number.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultcountrycode
     */
    readonly defaultCountryCode?: string;

    /**
     * The default value for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-defaultvalue
     */
    readonly defaultValue?: string;

    /**
     * The text to display to describe the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-descriptivetext
     */
    readonly descriptiveText?: string;

    /**
     * The configuration for the file uploader field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-fileuploaderconfig
     */
    readonly fileUploaderConfig?: CfnForm.FileUploaderFieldConfigProperty | cdk.IResolvable;

    /**
     * Specifies whether to render the field as an array.
     *
     * This property is ignored if the `dataSourceType` for the form is a Data Store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-isarray
     */
    readonly isArray?: boolean | cdk.IResolvable;

    /**
     * The maximum value to display for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-maxvalue
     */
    readonly maxValue?: number;

    /**
     * The minimum value to display for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-minvalue
     */
    readonly minValue?: number;

    /**
     * The name of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-name
     */
    readonly name?: string;

    /**
     * The text to display as a placeholder for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-placeholder
     */
    readonly placeholder?: string;

    /**
     * Specifies a read only field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-readonly
     */
    readonly readOnly?: boolean | cdk.IResolvable;

    /**
     * Specifies a field that requires input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-required
     */
    readonly required?: boolean | cdk.IResolvable;

    /**
     * The stepping increment for a numeric value in a field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-step
     */
    readonly step?: number;

    /**
     * The input type for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-type
     */
    readonly type: string;

    /**
     * The value for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-value
     */
    readonly value?: string;

    /**
     * The information to use to customize the input fields with data at runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fieldinputconfig.html#cfn-amplifyuibuilder-form-fieldinputconfig-valuemappings
     */
    readonly valueMappings?: cdk.IResolvable | CfnForm.ValueMappingsProperty;
  }

  /**
   * Describes the configuration for the file uploader field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html
   */
  export interface FileUploaderFieldConfigProperty {
    /**
     * The file types that are allowed to be uploaded by the file uploader.
     *
     * Provide this information in an array of strings specifying the valid file extensions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-acceptedfiletypes
     */
    readonly acceptedFileTypes: Array<string>;

    /**
     * The access level to assign to the uploaded files in the Amazon S3 bucket where they are stored.
     *
     * The valid values for this property are `private` , `protected` , or `public` . For detailed information about the permissions associated with each access level, see [File access levels](https://docs.aws.amazon.com/https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/) in the *Amplify documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-accesslevel
     */
    readonly accessLevel: string;

    /**
     * Allows the file upload operation to be paused and resumed. The default value is `false` .
     *
     * When `isResumable` is set to `true` , the file uploader uses a multipart upload to break the files into chunks before upload. The progress of the upload isn't continuous, because the file uploader uploads a chunk at a time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-isresumable
     */
    readonly isResumable?: boolean | cdk.IResolvable;

    /**
     * Specifies the maximum number of files that can be selected to upload.
     *
     * The default value is an unlimited number of files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-maxfilecount
     */
    readonly maxFileCount?: number;

    /**
     * The maximum file size in bytes that the file uploader will accept.
     *
     * The default value is an unlimited file size.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-maxsize
     */
    readonly maxSize?: number;

    /**
     * Specifies whether to display or hide the image preview after selecting a file for upload.
     *
     * The default value is `true` to display the image preview.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-fileuploaderfieldconfig.html#cfn-amplifyuibuilder-form-fileuploaderfieldconfig-showthumbnails
     */
    readonly showThumbnails?: boolean | cdk.IResolvable;
  }

  /**
   * The `ValueMappings` property specifies the data binding configuration for a value map.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html
   */
  export interface ValueMappingsProperty {
    /**
     * The value and display value pairs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemappings.html#cfn-amplifyuibuilder-form-valuemappings-values
     */
    readonly values: Array<cdk.IResolvable | CfnForm.ValueMappingProperty> | cdk.IResolvable;
  }

  /**
   * The `ValueMapping` property specifies the association between a complex object and a display value.
   *
   * Use `ValueMapping` to store how to represent complex objects when they are displayed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html
   */
  export interface ValueMappingProperty {
    /**
     * The value to display for the complex object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html#cfn-amplifyuibuilder-form-valuemapping-displayvalue
     */
    readonly displayValue?: CfnForm.FormInputValuePropertyProperty | cdk.IResolvable;

    /**
     * The complex object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-valuemapping.html#cfn-amplifyuibuilder-form-valuemapping-value
     */
    readonly value: CfnForm.FormInputValuePropertyProperty | cdk.IResolvable;
  }

  /**
   * The `FormInputValueProperty` property specifies the configuration for an input field on a form.
   *
   * Use `FormInputValueProperty` to specify the values to render or bind by default.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html
   */
  export interface FormInputValuePropertyProperty {
    /**
     * The value to assign to the input field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-forminputvalueproperty.html#cfn-amplifyuibuilder-form-forminputvalueproperty-value
     */
    readonly value?: string;
  }

  /**
   * The `SectionalElement` property specifies the configuration information for a visual helper element for a form.
   *
   * A sectional element can be a header, a text block, or a divider. These elements are static and not associated with any data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html
   */
  export interface SectionalElementProperty {
    /**
     * Excludes a sectional element that was generated by default for a specified data model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-excluded
     */
    readonly excluded?: boolean | cdk.IResolvable;

    /**
     * Specifies the size of the font for a `Heading` sectional element.
     *
     * Valid values are `1 | 2 | 3 | 4 | 5 | 6` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-level
     */
    readonly level?: number;

    /**
     * Specifies the orientation for a `Divider` sectional element.
     *
     * Valid values are `horizontal` or `vertical` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-orientation
     */
    readonly orientation?: string;

    /**
     * Specifies the position of the text in a field for a `Text` sectional element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-position
     */
    readonly position?: CfnForm.FieldPositionProperty | cdk.IResolvable;

    /**
     * The text for a `Text` sectional element.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-text
     */
    readonly text?: string;

    /**
     * The type of sectional element.
     *
     * Valid values are `Heading` , `Text` , and `Divider` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-sectionalelement.html#cfn-amplifyuibuilder-form-sectionalelement-type
     */
    readonly type: string;
  }

  /**
   * The `FormDataTypeConfig` property specifies the data type configuration for the data source associated with a form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html
   */
  export interface FormDataTypeConfigProperty {
    /**
     * The data source type, either an Amplify DataStore model or a custom data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html#cfn-amplifyuibuilder-form-formdatatypeconfig-datasourcetype
     */
    readonly dataSourceType: string;

    /**
     * The unique name of the data type you are using as the data source for the form.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formdatatypeconfig.html#cfn-amplifyuibuilder-form-formdatatypeconfig-datatypename
     */
    readonly dataTypeName: string;
  }

  /**
   * The `FormStyle` property specifies the configuration for the form's style.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html
   */
  export interface FormStyleProperty {
    /**
     * The spacing for the horizontal gap.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-horizontalgap
     */
    readonly horizontalGap?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;

    /**
     * The size of the outer padding for the form.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-outerpadding
     */
    readonly outerPadding?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;

    /**
     * The spacing for the vertical gap.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyle.html#cfn-amplifyuibuilder-form-formstyle-verticalgap
     */
    readonly verticalGap?: CfnForm.FormStyleConfigProperty | cdk.IResolvable;
  }

  /**
   * The `FormStyleConfig` property specifies the configuration settings for the form's style properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html
   */
  export interface FormStyleConfigProperty {
    /**
     * A reference to a design token to use to bind the form's style properties to an existing theme.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html#cfn-amplifyuibuilder-form-formstyleconfig-tokenreference
     */
    readonly tokenReference?: string;

    /**
     * The value of the style setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-form-formstyleconfig.html#cfn-amplifyuibuilder-form-formstyleconfig-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnForm`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html
 */
export interface CfnFormProps {
  /**
   * The unique ID of the Amplify app associated with the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-appid
   */
  readonly appId?: string;

  /**
   * The `FormCTA` object that stores the call to action configuration for the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-cta
   */
  readonly cta?: CfnForm.FormCTAProperty | cdk.IResolvable;

  /**
   * The type of data source to use to create the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-datatype
   */
  readonly dataType: CfnForm.FormDataTypeConfigProperty | cdk.IResolvable;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-environmentname
   */
  readonly environmentName?: string;

  /**
   * The configuration information for the form's fields.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-fields
   */
  readonly fields: cdk.IResolvable | Record<string, CfnForm.FieldConfigProperty | cdk.IResolvable>;

  /**
   * Specifies whether to perform a create or update action on the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-formactiontype
   */
  readonly formActionType: string;

  /**
   * Specifies an icon or decoration to display on the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-labeldecorator
   */
  readonly labelDecorator?: string;

  /**
   * The name of the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-name
   */
  readonly name: string;

  /**
   * The schema version of the form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-schemaversion
   */
  readonly schemaVersion: string;

  /**
   * The configuration information for the visual helper elements for the form.
   *
   * These elements are not associated with any data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-sectionalelements
   */
  readonly sectionalElements: cdk.IResolvable | Record<string, cdk.IResolvable | CfnForm.SectionalElementProperty>;

  /**
   * The configuration for the form's style.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-style
   */
  readonly style: CfnForm.FormStyleProperty | cdk.IResolvable;

  /**
   * One or more key-value pairs to use when tagging the form data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-form.html#cfn-amplifyuibuilder-form-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `FieldPositionProperty`
 *
 * @param properties - the TypeScript properties of a `FieldPositionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFieldPositionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("below", cdk.validateString)(properties.below));
  errors.collect(cdk.propertyValidator("fixed", cdk.validateString)(properties.fixed));
  errors.collect(cdk.propertyValidator("rightOf", cdk.validateString)(properties.rightOf));
  return errors.wrap("supplied properties not correct for \"FieldPositionProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFieldPositionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFieldPositionPropertyValidator(properties).assertSuccess();
  return {
    "Below": cdk.stringToCloudFormation(properties.below),
    "Fixed": cdk.stringToCloudFormation(properties.fixed),
    "RightOf": cdk.stringToCloudFormation(properties.rightOf)
  };
}

// @ts-ignore TS6133
function CfnFormFieldPositionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldPositionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldPositionProperty>();
  ret.addPropertyResult("below", "Below", (properties.Below != null ? cfn_parse.FromCloudFormation.getString(properties.Below) : undefined));
  ret.addPropertyResult("fixed", "Fixed", (properties.Fixed != null ? cfn_parse.FromCloudFormation.getString(properties.Fixed) : undefined));
  ret.addPropertyResult("rightOf", "RightOf", (properties.RightOf != null ? cfn_parse.FromCloudFormation.getString(properties.RightOf) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormButtonProperty`
 *
 * @param properties - the TypeScript properties of a `FormButtonProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormButtonPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("children", cdk.validateString)(properties.children));
  errors.collect(cdk.propertyValidator("excluded", cdk.validateBoolean)(properties.excluded));
  errors.collect(cdk.propertyValidator("position", CfnFormFieldPositionPropertyValidator)(properties.position));
  return errors.wrap("supplied properties not correct for \"FormButtonProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormButtonPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormButtonPropertyValidator(properties).assertSuccess();
  return {
    "Children": cdk.stringToCloudFormation(properties.children),
    "Excluded": cdk.booleanToCloudFormation(properties.excluded),
    "Position": convertCfnFormFieldPositionPropertyToCloudFormation(properties.position)
  };
}

// @ts-ignore TS6133
function CfnFormFormButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormButtonProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormButtonProperty>();
  ret.addPropertyResult("children", "Children", (properties.Children != null ? cfn_parse.FromCloudFormation.getString(properties.Children) : undefined));
  ret.addPropertyResult("excluded", "Excluded", (properties.Excluded != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Excluded) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormCTAProperty`
 *
 * @param properties - the TypeScript properties of a `FormCTAProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormCTAPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cancel", CfnFormFormButtonPropertyValidator)(properties.cancel));
  errors.collect(cdk.propertyValidator("clear", CfnFormFormButtonPropertyValidator)(properties.clear));
  errors.collect(cdk.propertyValidator("position", cdk.validateString)(properties.position));
  errors.collect(cdk.propertyValidator("submit", CfnFormFormButtonPropertyValidator)(properties.submit));
  return errors.wrap("supplied properties not correct for \"FormCTAProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormCTAPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormCTAPropertyValidator(properties).assertSuccess();
  return {
    "Cancel": convertCfnFormFormButtonPropertyToCloudFormation(properties.cancel),
    "Clear": convertCfnFormFormButtonPropertyToCloudFormation(properties.clear),
    "Position": cdk.stringToCloudFormation(properties.position),
    "Submit": convertCfnFormFormButtonPropertyToCloudFormation(properties.submit)
  };
}

// @ts-ignore TS6133
function CfnFormFormCTAPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormCTAProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormCTAProperty>();
  ret.addPropertyResult("cancel", "Cancel", (properties.Cancel != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Cancel) : undefined));
  ret.addPropertyResult("clear", "Clear", (properties.Clear != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Clear) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? cfn_parse.FromCloudFormation.getString(properties.Position) : undefined));
  ret.addPropertyResult("submit", "Submit", (properties.Submit != null ? CfnFormFormButtonPropertyFromCloudFormation(properties.Submit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldValidationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FieldValidationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFieldValidationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numValues", cdk.listValidator(cdk.validateNumber))(properties.numValues));
  errors.collect(cdk.propertyValidator("strValues", cdk.listValidator(cdk.validateString))(properties.strValues));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("validationMessage", cdk.validateString)(properties.validationMessage));
  return errors.wrap("supplied properties not correct for \"FieldValidationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFieldValidationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFieldValidationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "NumValues": cdk.listMapper(cdk.numberToCloudFormation)(properties.numValues),
    "StrValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.strValues),
    "Type": cdk.stringToCloudFormation(properties.type),
    "ValidationMessage": cdk.stringToCloudFormation(properties.validationMessage)
  };
}

// @ts-ignore TS6133
function CfnFormFieldValidationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldValidationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldValidationConfigurationProperty>();
  ret.addPropertyResult("numValues", "NumValues", (properties.NumValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.NumValues) : undefined));
  ret.addPropertyResult("strValues", "StrValues", (properties.StrValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StrValues) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("validationMessage", "ValidationMessage", (properties.ValidationMessage != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationMessage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileUploaderFieldConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FileUploaderFieldConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFileUploaderFieldConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptedFileTypes", cdk.requiredValidator)(properties.acceptedFileTypes));
  errors.collect(cdk.propertyValidator("acceptedFileTypes", cdk.listValidator(cdk.validateString))(properties.acceptedFileTypes));
  errors.collect(cdk.propertyValidator("accessLevel", cdk.requiredValidator)(properties.accessLevel));
  errors.collect(cdk.propertyValidator("accessLevel", cdk.validateString)(properties.accessLevel));
  errors.collect(cdk.propertyValidator("isResumable", cdk.validateBoolean)(properties.isResumable));
  errors.collect(cdk.propertyValidator("maxFileCount", cdk.validateNumber)(properties.maxFileCount));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("showThumbnails", cdk.validateBoolean)(properties.showThumbnails));
  return errors.wrap("supplied properties not correct for \"FileUploaderFieldConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFileUploaderFieldConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFileUploaderFieldConfigPropertyValidator(properties).assertSuccess();
  return {
    "AcceptedFileTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.acceptedFileTypes),
    "AccessLevel": cdk.stringToCloudFormation(properties.accessLevel),
    "IsResumable": cdk.booleanToCloudFormation(properties.isResumable),
    "MaxFileCount": cdk.numberToCloudFormation(properties.maxFileCount),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "ShowThumbnails": cdk.booleanToCloudFormation(properties.showThumbnails)
  };
}

// @ts-ignore TS6133
function CfnFormFileUploaderFieldConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FileUploaderFieldConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FileUploaderFieldConfigProperty>();
  ret.addPropertyResult("acceptedFileTypes", "AcceptedFileTypes", (properties.AcceptedFileTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AcceptedFileTypes) : undefined));
  ret.addPropertyResult("accessLevel", "AccessLevel", (properties.AccessLevel != null ? cfn_parse.FromCloudFormation.getString(properties.AccessLevel) : undefined));
  ret.addPropertyResult("isResumable", "IsResumable", (properties.IsResumable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsResumable) : undefined));
  ret.addPropertyResult("maxFileCount", "MaxFileCount", (properties.MaxFileCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFileCount) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("showThumbnails", "ShowThumbnails", (properties.ShowThumbnails != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ShowThumbnails) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormInputValuePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `FormInputValuePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormInputValuePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"FormInputValuePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormInputValuePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormInputValuePropertyPropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormInputValuePropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormInputValuePropertyProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValueMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ValueMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormValueMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("displayValue", CfnFormFormInputValuePropertyPropertyValidator)(properties.displayValue));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnFormFormInputValuePropertyPropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"ValueMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormValueMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormValueMappingPropertyValidator(properties).assertSuccess();
  return {
    "DisplayValue": convertCfnFormFormInputValuePropertyPropertyToCloudFormation(properties.displayValue),
    "Value": convertCfnFormFormInputValuePropertyPropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFormValueMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnForm.ValueMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.ValueMappingProperty>();
  ret.addPropertyResult("displayValue", "DisplayValue", (properties.DisplayValue != null ? CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties.DisplayValue) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnFormFormInputValuePropertyPropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValueMappingsProperty`
 *
 * @param properties - the TypeScript properties of a `ValueMappingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormValueMappingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(CfnFormValueMappingPropertyValidator))(properties.values));
  return errors.wrap("supplied properties not correct for \"ValueMappingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormValueMappingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormValueMappingsPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(convertCfnFormValueMappingPropertyToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnFormValueMappingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnForm.ValueMappingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.ValueMappingsProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(CfnFormValueMappingPropertyFromCloudFormation)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldInputConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FieldInputConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFieldInputConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultChecked", cdk.validateBoolean)(properties.defaultChecked));
  errors.collect(cdk.propertyValidator("defaultCountryCode", cdk.validateString)(properties.defaultCountryCode));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("descriptiveText", cdk.validateString)(properties.descriptiveText));
  errors.collect(cdk.propertyValidator("fileUploaderConfig", CfnFormFileUploaderFieldConfigPropertyValidator)(properties.fileUploaderConfig));
  errors.collect(cdk.propertyValidator("isArray", cdk.validateBoolean)(properties.isArray));
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateNumber)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateNumber)(properties.minValue));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("placeholder", cdk.validateString)(properties.placeholder));
  errors.collect(cdk.propertyValidator("readOnly", cdk.validateBoolean)(properties.readOnly));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  errors.collect(cdk.propertyValidator("step", cdk.validateNumber)(properties.step));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("valueMappings", CfnFormValueMappingsPropertyValidator)(properties.valueMappings));
  return errors.wrap("supplied properties not correct for \"FieldInputConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFieldInputConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFieldInputConfigPropertyValidator(properties).assertSuccess();
  return {
    "DefaultChecked": cdk.booleanToCloudFormation(properties.defaultChecked),
    "DefaultCountryCode": cdk.stringToCloudFormation(properties.defaultCountryCode),
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "DescriptiveText": cdk.stringToCloudFormation(properties.descriptiveText),
    "FileUploaderConfig": convertCfnFormFileUploaderFieldConfigPropertyToCloudFormation(properties.fileUploaderConfig),
    "IsArray": cdk.booleanToCloudFormation(properties.isArray),
    "MaxValue": cdk.numberToCloudFormation(properties.maxValue),
    "MinValue": cdk.numberToCloudFormation(properties.minValue),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Placeholder": cdk.stringToCloudFormation(properties.placeholder),
    "ReadOnly": cdk.booleanToCloudFormation(properties.readOnly),
    "Required": cdk.booleanToCloudFormation(properties.required),
    "Step": cdk.numberToCloudFormation(properties.step),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value),
    "ValueMappings": convertCfnFormValueMappingsPropertyToCloudFormation(properties.valueMappings)
  };
}

// @ts-ignore TS6133
function CfnFormFieldInputConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldInputConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldInputConfigProperty>();
  ret.addPropertyResult("defaultChecked", "DefaultChecked", (properties.DefaultChecked != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DefaultChecked) : undefined));
  ret.addPropertyResult("defaultCountryCode", "DefaultCountryCode", (properties.DefaultCountryCode != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultCountryCode) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("descriptiveText", "DescriptiveText", (properties.DescriptiveText != null ? cfn_parse.FromCloudFormation.getString(properties.DescriptiveText) : undefined));
  ret.addPropertyResult("fileUploaderConfig", "FileUploaderConfig", (properties.FileUploaderConfig != null ? CfnFormFileUploaderFieldConfigPropertyFromCloudFormation(properties.FileUploaderConfig) : undefined));
  ret.addPropertyResult("isArray", "IsArray", (properties.IsArray != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsArray) : undefined));
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("placeholder", "Placeholder", (properties.Placeholder != null ? cfn_parse.FromCloudFormation.getString(properties.Placeholder) : undefined));
  ret.addPropertyResult("readOnly", "ReadOnly", (properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addPropertyResult("step", "Step", (properties.Step != null ? cfn_parse.FromCloudFormation.getNumber(properties.Step) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("valueMappings", "ValueMappings", (properties.ValueMappings != null ? CfnFormValueMappingsPropertyFromCloudFormation(properties.ValueMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FieldConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFieldConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excluded", cdk.validateBoolean)(properties.excluded));
  errors.collect(cdk.propertyValidator("inputType", CfnFormFieldInputConfigPropertyValidator)(properties.inputType));
  errors.collect(cdk.propertyValidator("label", cdk.validateString)(properties.label));
  errors.collect(cdk.propertyValidator("position", CfnFormFieldPositionPropertyValidator)(properties.position));
  errors.collect(cdk.propertyValidator("validations", cdk.listValidator(CfnFormFieldValidationConfigurationPropertyValidator))(properties.validations));
  return errors.wrap("supplied properties not correct for \"FieldConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFieldConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFieldConfigPropertyValidator(properties).assertSuccess();
  return {
    "Excluded": cdk.booleanToCloudFormation(properties.excluded),
    "InputType": convertCfnFormFieldInputConfigPropertyToCloudFormation(properties.inputType),
    "Label": cdk.stringToCloudFormation(properties.label),
    "Position": convertCfnFormFieldPositionPropertyToCloudFormation(properties.position),
    "Validations": cdk.listMapper(convertCfnFormFieldValidationConfigurationPropertyToCloudFormation)(properties.validations)
  };
}

// @ts-ignore TS6133
function CfnFormFieldConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FieldConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FieldConfigProperty>();
  ret.addPropertyResult("excluded", "Excluded", (properties.Excluded != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Excluded) : undefined));
  ret.addPropertyResult("inputType", "InputType", (properties.InputType != null ? CfnFormFieldInputConfigPropertyFromCloudFormation(properties.InputType) : undefined));
  ret.addPropertyResult("label", "Label", (properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined));
  ret.addPropertyResult("validations", "Validations", (properties.Validations != null ? cfn_parse.FromCloudFormation.getArray(CfnFormFieldValidationConfigurationPropertyFromCloudFormation)(properties.Validations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SectionalElementProperty`
 *
 * @param properties - the TypeScript properties of a `SectionalElementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormSectionalElementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excluded", cdk.validateBoolean)(properties.excluded));
  errors.collect(cdk.propertyValidator("level", cdk.validateNumber)(properties.level));
  errors.collect(cdk.propertyValidator("orientation", cdk.validateString)(properties.orientation));
  errors.collect(cdk.propertyValidator("position", CfnFormFieldPositionPropertyValidator)(properties.position));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SectionalElementProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormSectionalElementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormSectionalElementPropertyValidator(properties).assertSuccess();
  return {
    "Excluded": cdk.booleanToCloudFormation(properties.excluded),
    "Level": cdk.numberToCloudFormation(properties.level),
    "Orientation": cdk.stringToCloudFormation(properties.orientation),
    "Position": convertCfnFormFieldPositionPropertyToCloudFormation(properties.position),
    "Text": cdk.stringToCloudFormation(properties.text),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFormSectionalElementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnForm.SectionalElementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.SectionalElementProperty>();
  ret.addPropertyResult("excluded", "Excluded", (properties.Excluded != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Excluded) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getNumber(properties.Level) : undefined));
  ret.addPropertyResult("orientation", "Orientation", (properties.Orientation != null ? cfn_parse.FromCloudFormation.getString(properties.Orientation) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? CfnFormFieldPositionPropertyFromCloudFormation(properties.Position) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormDataTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FormDataTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormDataTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceType", cdk.requiredValidator)(properties.dataSourceType));
  errors.collect(cdk.propertyValidator("dataSourceType", cdk.validateString)(properties.dataSourceType));
  errors.collect(cdk.propertyValidator("dataTypeName", cdk.requiredValidator)(properties.dataTypeName));
  errors.collect(cdk.propertyValidator("dataTypeName", cdk.validateString)(properties.dataTypeName));
  return errors.wrap("supplied properties not correct for \"FormDataTypeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormDataTypeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormDataTypeConfigPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceType": cdk.stringToCloudFormation(properties.dataSourceType),
    "DataTypeName": cdk.stringToCloudFormation(properties.dataTypeName)
  };
}

// @ts-ignore TS6133
function CfnFormFormDataTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormDataTypeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormDataTypeConfigProperty>();
  ret.addPropertyResult("dataSourceType", "DataSourceType", (properties.DataSourceType != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceType) : undefined));
  ret.addPropertyResult("dataTypeName", "DataTypeName", (properties.DataTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.DataTypeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormStyleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FormStyleConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormStyleConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tokenReference", cdk.validateString)(properties.tokenReference));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"FormStyleConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormStyleConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormStyleConfigPropertyValidator(properties).assertSuccess();
  return {
    "TokenReference": cdk.stringToCloudFormation(properties.tokenReference),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFormFormStyleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormStyleConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormStyleConfigProperty>();
  ret.addPropertyResult("tokenReference", "TokenReference", (properties.TokenReference != null ? cfn_parse.FromCloudFormation.getString(properties.TokenReference) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormStyleProperty`
 *
 * @param properties - the TypeScript properties of a `FormStyleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormFormStylePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("horizontalGap", CfnFormFormStyleConfigPropertyValidator)(properties.horizontalGap));
  errors.collect(cdk.propertyValidator("outerPadding", CfnFormFormStyleConfigPropertyValidator)(properties.outerPadding));
  errors.collect(cdk.propertyValidator("verticalGap", CfnFormFormStyleConfigPropertyValidator)(properties.verticalGap));
  return errors.wrap("supplied properties not correct for \"FormStyleProperty\"");
}

// @ts-ignore TS6133
function convertCfnFormFormStylePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormFormStylePropertyValidator(properties).assertSuccess();
  return {
    "HorizontalGap": convertCfnFormFormStyleConfigPropertyToCloudFormation(properties.horizontalGap),
    "OuterPadding": convertCfnFormFormStyleConfigPropertyToCloudFormation(properties.outerPadding),
    "VerticalGap": convertCfnFormFormStyleConfigPropertyToCloudFormation(properties.verticalGap)
  };
}

// @ts-ignore TS6133
function CfnFormFormStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnForm.FormStyleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnForm.FormStyleProperty>();
  ret.addPropertyResult("horizontalGap", "HorizontalGap", (properties.HorizontalGap != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.HorizontalGap) : undefined));
  ret.addPropertyResult("outerPadding", "OuterPadding", (properties.OuterPadding != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.OuterPadding) : undefined));
  ret.addPropertyResult("verticalGap", "VerticalGap", (properties.VerticalGap != null ? CfnFormFormStyleConfigPropertyFromCloudFormation(properties.VerticalGap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFormProps`
 *
 * @param properties - the TypeScript properties of a `CfnFormProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFormPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appId", cdk.validateString)(properties.appId));
  errors.collect(cdk.propertyValidator("cta", CfnFormFormCTAPropertyValidator)(properties.cta));
  errors.collect(cdk.propertyValidator("dataType", cdk.requiredValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("dataType", CfnFormFormDataTypeConfigPropertyValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("environmentName", cdk.validateString)(properties.environmentName));
  errors.collect(cdk.propertyValidator("fields", cdk.requiredValidator)(properties.fields));
  errors.collect(cdk.propertyValidator("fields", cdk.hashValidator(CfnFormFieldConfigPropertyValidator))(properties.fields));
  errors.collect(cdk.propertyValidator("formActionType", cdk.requiredValidator)(properties.formActionType));
  errors.collect(cdk.propertyValidator("formActionType", cdk.validateString)(properties.formActionType));
  errors.collect(cdk.propertyValidator("labelDecorator", cdk.validateString)(properties.labelDecorator));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schemaVersion", cdk.requiredValidator)(properties.schemaVersion));
  errors.collect(cdk.propertyValidator("schemaVersion", cdk.validateString)(properties.schemaVersion));
  errors.collect(cdk.propertyValidator("sectionalElements", cdk.requiredValidator)(properties.sectionalElements));
  errors.collect(cdk.propertyValidator("sectionalElements", cdk.hashValidator(CfnFormSectionalElementPropertyValidator))(properties.sectionalElements));
  errors.collect(cdk.propertyValidator("style", cdk.requiredValidator)(properties.style));
  errors.collect(cdk.propertyValidator("style", CfnFormFormStylePropertyValidator)(properties.style));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFormProps\"");
}

// @ts-ignore TS6133
function convertCfnFormPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFormPropsValidator(properties).assertSuccess();
  return {
    "AppId": cdk.stringToCloudFormation(properties.appId),
    "Cta": convertCfnFormFormCTAPropertyToCloudFormation(properties.cta),
    "DataType": convertCfnFormFormDataTypeConfigPropertyToCloudFormation(properties.dataType),
    "EnvironmentName": cdk.stringToCloudFormation(properties.environmentName),
    "Fields": cdk.hashMapper(convertCfnFormFieldConfigPropertyToCloudFormation)(properties.fields),
    "FormActionType": cdk.stringToCloudFormation(properties.formActionType),
    "LabelDecorator": cdk.stringToCloudFormation(properties.labelDecorator),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SchemaVersion": cdk.stringToCloudFormation(properties.schemaVersion),
    "SectionalElements": cdk.hashMapper(convertCfnFormSectionalElementPropertyToCloudFormation)(properties.sectionalElements),
    "Style": convertCfnFormFormStylePropertyToCloudFormation(properties.style),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFormPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFormProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFormProps>();
  ret.addPropertyResult("appId", "AppId", (properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined));
  ret.addPropertyResult("cta", "Cta", (properties.Cta != null ? CfnFormFormCTAPropertyFromCloudFormation(properties.Cta) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? CfnFormFormDataTypeConfigPropertyFromCloudFormation(properties.DataType) : undefined));
  ret.addPropertyResult("environmentName", "EnvironmentName", (properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined));
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getMap(CfnFormFieldConfigPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addPropertyResult("formActionType", "FormActionType", (properties.FormActionType != null ? cfn_parse.FromCloudFormation.getString(properties.FormActionType) : undefined));
  ret.addPropertyResult("labelDecorator", "LabelDecorator", (properties.LabelDecorator != null ? cfn_parse.FromCloudFormation.getString(properties.LabelDecorator) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schemaVersion", "SchemaVersion", (properties.SchemaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersion) : undefined));
  ret.addPropertyResult("sectionalElements", "SectionalElements", (properties.SectionalElements != null ? cfn_parse.FromCloudFormation.getMap(CfnFormSectionalElementPropertyFromCloudFormation)(properties.SectionalElements) : undefined));
  ret.addPropertyResult("style", "Style", (properties.Style != null ? CfnFormFormStylePropertyFromCloudFormation(properties.Style) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::AmplifyUIBuilder::Theme resource specifies a theme within an Amplify app.
 *
 * A theme is a collection of style settings that apply globally to the components associated with the app.
 *
 * @cloudformationResource AWS::AmplifyUIBuilder::Theme
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html
 */
export class CfnTheme extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AmplifyUIBuilder::Theme";

  /**
   * Build a CfnTheme from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTheme(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID for the theme.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The unique ID for the Amplify app associated with the theme.
   */
  public appId?: string;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   */
  public environmentName?: string;

  /**
   * The name of the theme.
   */
  public name: string;

  /**
   * Describes the properties that can be overriden to customize a theme.
   */
  public overrides?: Array<cdk.IResolvable | CfnTheme.ThemeValuesProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more key-value pairs to use when tagging the theme.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * A list of key-value pairs that defines the properties of the theme.
   */
  public values: Array<cdk.IResolvable | CfnTheme.ThemeValuesProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnThemeProps) {
    super(scope, id, {
      "type": CfnTheme.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "values", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.appId = props.appId;
    this.environmentName = props.environmentName;
    this.name = props.name;
    this.overrides = props.overrides;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::AmplifyUIBuilder::Theme", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.values = props.values;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appId": this.appId,
      "environmentName": this.environmentName,
      "name": this.name,
      "overrides": this.overrides,
      "tags": this.tags.renderTags(),
      "values": this.values
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTheme.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnThemePropsToCloudFormation(props);
  }
}

export namespace CfnTheme {
  /**
   * The `ThemeValues` property specifies key-value pair that defines a property of a theme.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html
   */
  export interface ThemeValuesProperty {
    /**
     * The name of the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html#cfn-amplifyuibuilder-theme-themevalues-key
     */
    readonly key?: string;

    /**
     * The value of the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalues.html#cfn-amplifyuibuilder-theme-themevalues-value
     */
    readonly value?: cdk.IResolvable | CfnTheme.ThemeValueProperty;
  }

  /**
   * The `ThemeValue` property specifies the configuration of a theme's properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html
   */
  export interface ThemeValueProperty {
    /**
     * A list of key-value pairs that define the theme's properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html#cfn-amplifyuibuilder-theme-themevalue-children
     */
    readonly children?: Array<cdk.IResolvable | CfnTheme.ThemeValuesProperty> | cdk.IResolvable;

    /**
     * The value of a theme property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplifyuibuilder-theme-themevalue.html#cfn-amplifyuibuilder-theme-themevalue-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnTheme`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html
 */
export interface CfnThemeProps {
  /**
   * The unique ID for the Amplify app associated with the theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-appid
   */
  readonly appId?: string;

  /**
   * The name of the backend environment that is a part of the Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-environmentname
   */
  readonly environmentName?: string;

  /**
   * The name of the theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-name
   */
  readonly name: string;

  /**
   * Describes the properties that can be overriden to customize a theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-overrides
   */
  readonly overrides?: Array<cdk.IResolvable | CfnTheme.ThemeValuesProperty> | cdk.IResolvable;

  /**
   * One or more key-value pairs to use when tagging the theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * A list of key-value pairs that defines the properties of the theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplifyuibuilder-theme.html#cfn-amplifyuibuilder-theme-values
   */
  readonly values: Array<cdk.IResolvable | CfnTheme.ThemeValuesProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ThemeValueProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThemeThemeValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("children", cdk.listValidator(CfnThemeThemeValuesPropertyValidator))(properties.children));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ThemeValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnThemeThemeValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThemeThemeValuePropertyValidator(properties).assertSuccess();
  return {
    "Children": cdk.listMapper(convertCfnThemeThemeValuesPropertyToCloudFormation)(properties.children),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnThemeThemeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTheme.ThemeValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeValueProperty>();
  ret.addPropertyResult("children", "Children", (properties.Children != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Children) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThemeValuesProperty`
 *
 * @param properties - the TypeScript properties of a `ThemeValuesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThemeThemeValuesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", CfnThemeThemeValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"ThemeValuesProperty\"");
}

// @ts-ignore TS6133
function convertCfnThemeThemeValuesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThemeThemeValuesPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": convertCfnThemeThemeValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnThemeThemeValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTheme.ThemeValuesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTheme.ThemeValuesProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnThemeThemeValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnThemeProps`
 *
 * @param properties - the TypeScript properties of a `CfnThemeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnThemePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appId", cdk.validateString)(properties.appId));
  errors.collect(cdk.propertyValidator("environmentName", cdk.validateString)(properties.environmentName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overrides", cdk.listValidator(CfnThemeThemeValuesPropertyValidator))(properties.overrides));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(CfnThemeThemeValuesPropertyValidator))(properties.values));
  return errors.wrap("supplied properties not correct for \"CfnThemeProps\"");
}

// @ts-ignore TS6133
function convertCfnThemePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnThemePropsValidator(properties).assertSuccess();
  return {
    "AppId": cdk.stringToCloudFormation(properties.appId),
    "EnvironmentName": cdk.stringToCloudFormation(properties.environmentName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Overrides": cdk.listMapper(convertCfnThemeThemeValuesPropertyToCloudFormation)(properties.overrides),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Values": cdk.listMapper(convertCfnThemeThemeValuesPropertyToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnThemePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnThemeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnThemeProps>();
  ret.addPropertyResult("appId", "AppId", (properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined));
  ret.addPropertyResult("environmentName", "EnvironmentName", (properties.EnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Overrides) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(CfnThemeThemeValuesPropertyFromCloudFormation)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}