/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Use the `AWS::IoTTwinMaker::ComponentType` resource to declare a component type.
 *
 * @cloudformationResource AWS::IoTTwinMaker::ComponentType
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export class CfnComponentType extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTTwinMaker::ComponentType";

  /**
   * Build a CfnComponentType from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentType {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnComponentTypePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnComponentType(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the component type.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time when the component type was created.
   *
   * @cloudformationAttribute CreationDateTime
   */
  public readonly attrCreationDateTime: string;

  /**
   * A boolean value that specifies whether the component type is abstract.
   *
   * @cloudformationAttribute IsAbstract
   */
  public readonly attrIsAbstract: cdk.IResolvable;

  /**
   * A boolean value that specifies whether the component type has a schema initializer and that the schema initializer has run.
   *
   * @cloudformationAttribute IsSchemaInitialized
   */
  public readonly attrIsSchemaInitialized: cdk.IResolvable;

  /**
   * The component type status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: cdk.IResolvable;

  /**
   * @cloudformationAttribute Status.Error
   */
  public readonly attrStatusError: cdk.IResolvable;

  /**
   * @cloudformationAttribute Status.Error.Code
   */
  public readonly attrStatusErrorCode: string;

  /**
   * @cloudformationAttribute Status.Error.Message
   */
  public readonly attrStatusErrorMessage: string;

  /**
   * @cloudformationAttribute Status.State
   */
  public readonly attrStatusState: string;

  /**
   * The component type the update time.
   *
   * @cloudformationAttribute UpdateDateTime
   */
  public readonly attrUpdateDateTime: string;

  /**
   * The ID of the component type.
   */
  public componentTypeId: string;

  /**
   * Maps strings to `compositeComponentTypes` of the `componentType` .
   */
  public compositeComponentTypes?: cdk.IResolvable | Record<string, CfnComponentType.CompositeComponentTypeProperty | cdk.IResolvable>;

  /**
   * The description of the component type.
   */
  public description?: string;

  /**
   * The name of the parent component type that this component type extends.
   */
  public extendsFrom?: Array<string>;

  /**
   * An object that maps strings to the functions in the component type.
   */
  public functions?: cdk.IResolvable | Record<string, CfnComponentType.FunctionProperty | cdk.IResolvable>;

  /**
   * A boolean value that specifies whether an entity can have more than one component of this type.
   */
  public isSingleton?: boolean | cdk.IResolvable;

  /**
   * An object that maps strings to the property definitions in the component type.
   */
  public propertyDefinitions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnComponentType.PropertyDefinitionProperty>;

  /**
   * An object that maps strings to the property groups in the component type.
   */
  public propertyGroups?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnComponentType.PropertyGroupProperty>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The ComponentType tags.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ID of the workspace that contains the component type.
   */
  public workspaceId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnComponentTypeProps) {
    super(scope, id, {
      "type": CfnComponentType.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "componentTypeId", this);
    cdk.requireProperty(props, "workspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDateTime = cdk.Token.asString(this.getAtt("CreationDateTime", cdk.ResolutionTypeHint.STRING));
    this.attrIsAbstract = this.getAtt("IsAbstract");
    this.attrIsSchemaInitialized = this.getAtt("IsSchemaInitialized");
    this.attrStatus = this.getAtt("Status");
    this.attrStatusError = this.getAtt("Status.Error");
    this.attrStatusErrorCode = cdk.Token.asString(this.getAtt("Status.Error.Code", cdk.ResolutionTypeHint.STRING));
    this.attrStatusErrorMessage = cdk.Token.asString(this.getAtt("Status.Error.Message", cdk.ResolutionTypeHint.STRING));
    this.attrStatusState = cdk.Token.asString(this.getAtt("Status.State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateDateTime = cdk.Token.asString(this.getAtt("UpdateDateTime", cdk.ResolutionTypeHint.STRING));
    this.componentTypeId = props.componentTypeId;
    this.compositeComponentTypes = props.compositeComponentTypes;
    this.description = props.description;
    this.extendsFrom = props.extendsFrom;
    this.functions = props.functions;
    this.isSingleton = props.isSingleton;
    this.propertyDefinitions = props.propertyDefinitions;
    this.propertyGroups = props.propertyGroups;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::ComponentType", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspaceId = props.workspaceId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "componentTypeId": this.componentTypeId,
      "compositeComponentTypes": this.compositeComponentTypes,
      "description": this.description,
      "extendsFrom": this.extendsFrom,
      "functions": this.functions,
      "isSingleton": this.isSingleton,
      "propertyDefinitions": this.propertyDefinitions,
      "propertyGroups": this.propertyGroups,
      "tags": this.tags.renderTags(),
      "workspaceId": this.workspaceId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnComponentType.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnComponentTypePropsToCloudFormation(props);
  }
}

export namespace CfnComponentType {
  /**
   * PropertyDefinition is an object that maps strings to the property definitions in the component type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html
   */
  export interface PropertyDefinitionProperty {
    /**
     * A mapping that specifies configuration information about the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-configurations
     */
    readonly configurations?: cdk.IResolvable | Record<string, string>;

    /**
     * An object that specifies the data type of a property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-datatype
     */
    readonly dataType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;

    /**
     * A boolean value that specifies whether the property ID comes from an external data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-defaultvalue
     */
    readonly defaultValue?: CfnComponentType.DataValueProperty | cdk.IResolvable;

    /**
     * A Boolean value that specifies whether the property ID comes from an external data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isexternalid
     */
    readonly isExternalId?: boolean | cdk.IResolvable;

    /**
     * A boolean value that specifies whether the property is required in an entity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isrequiredinentity
     */
    readonly isRequiredInEntity?: boolean | cdk.IResolvable;

    /**
     * A boolean value that specifies whether the property is stored externally.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isstoredexternally
     */
    readonly isStoredExternally?: boolean | cdk.IResolvable;

    /**
     * A boolean value that specifies whether the property consists of time series data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-istimeseries
     */
    readonly isTimeSeries?: boolean | cdk.IResolvable;
  }

  /**
   * An object that specifies a value for a property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html
   */
  export interface DataValueProperty {
    /**
     * A boolean value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-booleanvalue
     */
    readonly booleanValue?: boolean | cdk.IResolvable;

    /**
     * A double value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-doublevalue
     */
    readonly doubleValue?: number;

    /**
     * An expression that produces the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-expression
     */
    readonly expression?: string;

    /**
     * An integer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-integervalue
     */
    readonly integerValue?: number;

    /**
     * A list of multiple values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-listvalue
     */
    readonly listValue?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A long value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-longvalue
     */
    readonly longValue?: number;

    /**
     * An object that maps strings to multiple `DataValue` objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-mapvalue
     */
    readonly mapValue?: cdk.IResolvable | Record<string, CfnComponentType.DataValueProperty | cdk.IResolvable>;

    /**
     * A value that relates a component to another component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-relationshipvalue
     */
    readonly relationshipValue?: any | cdk.IResolvable;

    /**
     * A string value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * An object that specifies the data type of a property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html
   */
  export interface DataTypeProperty {
    /**
     * The allowed values for this data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-allowedvalues
     */
    readonly allowedValues?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The nested type in the data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-nestedtype
     */
    readonly nestedType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;

    /**
     * A relationship that associates a component with another component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-relationship
     */
    readonly relationship?: cdk.IResolvable | CfnComponentType.RelationshipProperty;

    /**
     * The underlying type of the data type.
     *
     * Valid Values: `RELATIONSHIP | STRING | LONG | BOOLEAN | INTEGER | DOUBLE | LIST | MAP`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-type
     */
    readonly type: string;

    /**
     * The unit of measure used in this data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-unitofmeasure
     */
    readonly unitOfMeasure?: string;
  }

  /**
   * An object that specifies a relationship with another component type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html
   */
  export interface RelationshipProperty {
    /**
     * The type of the relationship.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-relationshiptype
     */
    readonly relationshipType?: string;

    /**
     * The ID of the target component type associated with this relationship.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-targetcomponenttypeid
     */
    readonly targetComponentTypeId?: string;
  }

  /**
   * The property group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html
   */
  export interface PropertyGroupProperty {
    /**
     * The group type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-grouptype
     */
    readonly groupType?: string;

    /**
     * The property names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-propertynames
     */
    readonly propertyNames?: Array<string>;
  }

  /**
   * The function body.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html
   */
  export interface FunctionProperty {
    /**
     * The data connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-implementedby
     */
    readonly implementedBy?: CfnComponentType.DataConnectorProperty | cdk.IResolvable;

    /**
     * The required properties of the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-requiredproperties
     */
    readonly requiredProperties?: Array<string>;

    /**
     * The scope of the function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-scope
     */
    readonly scope?: string;
  }

  /**
   * The data connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html
   */
  export interface DataConnectorProperty {
    /**
     * A boolean value that specifies whether the data connector is native to IoT TwinMaker.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-isnative
     */
    readonly isNative?: boolean | cdk.IResolvable;

    /**
     * The Lambda function associated with the data connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnComponentType.LambdaFunctionProperty;
  }

  /**
   * The Lambda function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html
   */
  export interface LambdaFunctionProperty {
    /**
     * The Lambda function ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html#cfn-iottwinmaker-componenttype-lambdafunction-arn
     */
    readonly arn: string;
  }

  /**
   * Specifies the ID of the composite component type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-compositecomponenttype.html
   */
  export interface CompositeComponentTypeProperty {
    /**
     * The ID of the component type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-compositecomponenttype.html#cfn-iottwinmaker-componenttype-compositecomponenttype-componenttypeid
     */
    readonly componentTypeId?: string;
  }

  /**
   * The component type status.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html
   */
  export interface StatusProperty {
    /**
     * The component type error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-error
     */
    readonly error?: CfnComponentType.ErrorProperty | cdk.IResolvable;

    /**
     * The component type status state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-state
     */
    readonly state?: string;
  }

  /**
   * The component type error.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html
   */
  export interface ErrorProperty {
    /**
     * The component type error code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-code
     */
    readonly code?: string;

    /**
     * The component type error message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-message
     */
    readonly message?: string;
  }

  /**
   * The component type relationship value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html
   */
  export interface RelationshipValueProperty {
    /**
     * The target component name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetcomponentname
     */
    readonly targetComponentName?: string;

    /**
     * The target entity Id.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetentityid
     */
    readonly targetEntityId?: string;
  }
}

/**
 * Properties for defining a `CfnComponentType`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export interface CfnComponentTypeProps {
  /**
   * The ID of the component type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-componenttypeid
   */
  readonly componentTypeId: string;

  /**
   * Maps strings to `compositeComponentTypes` of the `componentType` .
   *
   * `CompositeComponentType` is referenced by `componentTypeId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-compositecomponenttypes
   */
  readonly compositeComponentTypes?: cdk.IResolvable | Record<string, CfnComponentType.CompositeComponentTypeProperty | cdk.IResolvable>;

  /**
   * The description of the component type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-description
   */
  readonly description?: string;

  /**
   * The name of the parent component type that this component type extends.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-extendsfrom
   */
  readonly extendsFrom?: Array<string>;

  /**
   * An object that maps strings to the functions in the component type.
   *
   * Each string in the mapping must be unique to this object.
   *
   * For information on the FunctionResponse object see the [FunctionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_FunctionResponse.html) API reference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-functions
   */
  readonly functions?: cdk.IResolvable | Record<string, CfnComponentType.FunctionProperty | cdk.IResolvable>;

  /**
   * A boolean value that specifies whether an entity can have more than one component of this type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-issingleton
   */
  readonly isSingleton?: boolean | cdk.IResolvable;

  /**
   * An object that maps strings to the property definitions in the component type.
   *
   * Each string in the mapping must be unique to this object.
   *
   * For information about the PropertyDefinitionResponse object, see the [PropertyDefinitionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_PropertyDefinitionResponse.html) API reference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertydefinitions
   */
  readonly propertyDefinitions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnComponentType.PropertyDefinitionProperty>;

  /**
   * An object that maps strings to the property groups in the component type.
   *
   * Each string in the mapping must be unique to this object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertygroups
   */
  readonly propertyGroups?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnComponentType.PropertyGroupProperty>;

  /**
   * The ComponentType tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ID of the workspace that contains the component type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-workspaceid
   */
  readonly workspaceId: string;
}

/**
 * Determine whether the given properties match those of a `DataValueProperty`
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeDataValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateBoolean)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateNumber)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("integerValue", cdk.validateNumber)(properties.integerValue));
  errors.collect(cdk.propertyValidator("listValue", cdk.listValidator(CfnComponentTypeDataValuePropertyValidator))(properties.listValue));
  errors.collect(cdk.propertyValidator("longValue", cdk.validateNumber)(properties.longValue));
  errors.collect(cdk.propertyValidator("mapValue", cdk.hashValidator(CfnComponentTypeDataValuePropertyValidator))(properties.mapValue));
  errors.collect(cdk.propertyValidator("relationshipValue", cdk.validateObject)(properties.relationshipValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"DataValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeDataValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeDataValuePropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.booleanToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.numberToCloudFormation(properties.doubleValue),
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "IntegerValue": cdk.numberToCloudFormation(properties.integerValue),
    "ListValue": cdk.listMapper(convertCfnComponentTypeDataValuePropertyToCloudFormation)(properties.listValue),
    "LongValue": cdk.numberToCloudFormation(properties.longValue),
    "MapValue": cdk.hashMapper(convertCfnComponentTypeDataValuePropertyToCloudFormation)(properties.mapValue),
    "RelationshipValue": cdk.objectToCloudFormation(properties.relationshipValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeDataValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataValueProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("integerValue", "IntegerValue", (properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntegerValue) : undefined));
  ret.addPropertyResult("listValue", "ListValue", (properties.ListValue != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.ListValue) : undefined));
  ret.addPropertyResult("longValue", "LongValue", (properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined));
  ret.addPropertyResult("mapValue", "MapValue", (properties.MapValue != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.MapValue) : undefined));
  ret.addPropertyResult("relationshipValue", "RelationshipValue", (properties.RelationshipValue != null ? cfn_parse.FromCloudFormation.getAny(properties.RelationshipValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelationshipProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeRelationshipPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("relationshipType", cdk.validateString)(properties.relationshipType));
  errors.collect(cdk.propertyValidator("targetComponentTypeId", cdk.validateString)(properties.targetComponentTypeId));
  return errors.wrap("supplied properties not correct for \"RelationshipProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeRelationshipPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeRelationshipPropertyValidator(properties).assertSuccess();
  return {
    "RelationshipType": cdk.stringToCloudFormation(properties.relationshipType),
    "TargetComponentTypeId": cdk.stringToCloudFormation(properties.targetComponentTypeId)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeRelationshipPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.RelationshipProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.RelationshipProperty>();
  ret.addPropertyResult("relationshipType", "RelationshipType", (properties.RelationshipType != null ? cfn_parse.FromCloudFormation.getString(properties.RelationshipType) : undefined));
  ret.addPropertyResult("targetComponentTypeId", "TargetComponentTypeId", (properties.TargetComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentTypeId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataTypeProperty`
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeDataTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.listValidator(CfnComponentTypeDataValuePropertyValidator))(properties.allowedValues));
  errors.collect(cdk.propertyValidator("nestedType", CfnComponentTypeDataTypePropertyValidator)(properties.nestedType));
  errors.collect(cdk.propertyValidator("relationship", CfnComponentTypeRelationshipPropertyValidator)(properties.relationship));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("unitOfMeasure", cdk.validateString)(properties.unitOfMeasure));
  return errors.wrap("supplied properties not correct for \"DataTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeDataTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeDataTypePropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.listMapper(convertCfnComponentTypeDataValuePropertyToCloudFormation)(properties.allowedValues),
    "NestedType": convertCfnComponentTypeDataTypePropertyToCloudFormation(properties.nestedType),
    "Relationship": convertCfnComponentTypeRelationshipPropertyToCloudFormation(properties.relationship),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UnitOfMeasure": cdk.stringToCloudFormation(properties.unitOfMeasure)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeDataTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataTypeProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(CfnComponentTypeDataValuePropertyFromCloudFormation)(properties.AllowedValues) : undefined));
  ret.addPropertyResult("nestedType", "NestedType", (properties.NestedType != null ? CfnComponentTypeDataTypePropertyFromCloudFormation(properties.NestedType) : undefined));
  ret.addPropertyResult("relationship", "Relationship", (properties.Relationship != null ? CfnComponentTypeRelationshipPropertyFromCloudFormation(properties.Relationship) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("unitOfMeasure", "UnitOfMeasure", (properties.UnitOfMeasure != null ? cfn_parse.FromCloudFormation.getString(properties.UnitOfMeasure) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PropertyDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypePropertyDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurations", cdk.hashValidator(cdk.validateString))(properties.configurations));
  errors.collect(cdk.propertyValidator("dataType", CfnComponentTypeDataTypePropertyValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("defaultValue", CfnComponentTypeDataValuePropertyValidator)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("isExternalId", cdk.validateBoolean)(properties.isExternalId));
  errors.collect(cdk.propertyValidator("isRequiredInEntity", cdk.validateBoolean)(properties.isRequiredInEntity));
  errors.collect(cdk.propertyValidator("isStoredExternally", cdk.validateBoolean)(properties.isStoredExternally));
  errors.collect(cdk.propertyValidator("isTimeSeries", cdk.validateBoolean)(properties.isTimeSeries));
  return errors.wrap("supplied properties not correct for \"PropertyDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypePropertyDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypePropertyDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Configurations": cdk.hashMapper(cdk.stringToCloudFormation)(properties.configurations),
    "DataType": convertCfnComponentTypeDataTypePropertyToCloudFormation(properties.dataType),
    "DefaultValue": convertCfnComponentTypeDataValuePropertyToCloudFormation(properties.defaultValue),
    "IsExternalId": cdk.booleanToCloudFormation(properties.isExternalId),
    "IsRequiredInEntity": cdk.booleanToCloudFormation(properties.isRequiredInEntity),
    "IsStoredExternally": cdk.booleanToCloudFormation(properties.isStoredExternally),
    "IsTimeSeries": cdk.booleanToCloudFormation(properties.isTimeSeries)
  };
}

// @ts-ignore TS6133
function CfnComponentTypePropertyDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.PropertyDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.PropertyDefinitionProperty>();
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Configurations) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? CfnComponentTypeDataTypePropertyFromCloudFormation(properties.DataType) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? CfnComponentTypeDataValuePropertyFromCloudFormation(properties.DefaultValue) : undefined));
  ret.addPropertyResult("isExternalId", "IsExternalId", (properties.IsExternalId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsExternalId) : undefined));
  ret.addPropertyResult("isRequiredInEntity", "IsRequiredInEntity", (properties.IsRequiredInEntity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsRequiredInEntity) : undefined));
  ret.addPropertyResult("isStoredExternally", "IsStoredExternally", (properties.IsStoredExternally != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsStoredExternally) : undefined));
  ret.addPropertyResult("isTimeSeries", "IsTimeSeries", (properties.IsTimeSeries != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsTimeSeries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PropertyGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypePropertyGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupType", cdk.validateString)(properties.groupType));
  errors.collect(cdk.propertyValidator("propertyNames", cdk.listValidator(cdk.validateString))(properties.propertyNames));
  return errors.wrap("supplied properties not correct for \"PropertyGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypePropertyGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypePropertyGroupPropertyValidator(properties).assertSuccess();
  return {
    "GroupType": cdk.stringToCloudFormation(properties.groupType),
    "PropertyNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.propertyNames)
  };
}

// @ts-ignore TS6133
function CfnComponentTypePropertyGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.PropertyGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.PropertyGroupProperty>();
  ret.addPropertyResult("groupType", "GroupType", (properties.GroupType != null ? cfn_parse.FromCloudFormation.getString(properties.GroupType) : undefined));
  ret.addPropertyResult("propertyNames", "PropertyNames", (properties.PropertyNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PropertyNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaFunctionProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaFunctionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeLambdaFunctionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"LambdaFunctionProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeLambdaFunctionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeLambdaFunctionPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeLambdaFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.LambdaFunctionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.LambdaFunctionProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataConnectorProperty`
 *
 * @param properties - the TypeScript properties of a `DataConnectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeDataConnectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isNative", cdk.validateBoolean)(properties.isNative));
  errors.collect(cdk.propertyValidator("lambda", CfnComponentTypeLambdaFunctionPropertyValidator)(properties.lambda));
  return errors.wrap("supplied properties not correct for \"DataConnectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeDataConnectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeDataConnectorPropertyValidator(properties).assertSuccess();
  return {
    "IsNative": cdk.booleanToCloudFormation(properties.isNative),
    "Lambda": convertCfnComponentTypeLambdaFunctionPropertyToCloudFormation(properties.lambda)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeDataConnectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.DataConnectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.DataConnectorProperty>();
  ret.addPropertyResult("isNative", "IsNative", (properties.IsNative != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsNative) : undefined));
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnComponentTypeLambdaFunctionPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeFunctionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("implementedBy", CfnComponentTypeDataConnectorPropertyValidator)(properties.implementedBy));
  errors.collect(cdk.propertyValidator("requiredProperties", cdk.listValidator(cdk.validateString))(properties.requiredProperties));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  return errors.wrap("supplied properties not correct for \"FunctionProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeFunctionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeFunctionPropertyValidator(properties).assertSuccess();
  return {
    "ImplementedBy": convertCfnComponentTypeDataConnectorPropertyToCloudFormation(properties.implementedBy),
    "RequiredProperties": cdk.listMapper(cdk.stringToCloudFormation)(properties.requiredProperties),
    "Scope": cdk.stringToCloudFormation(properties.scope)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeFunctionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.FunctionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.FunctionProperty>();
  ret.addPropertyResult("implementedBy", "ImplementedBy", (properties.ImplementedBy != null ? CfnComponentTypeDataConnectorPropertyFromCloudFormation(properties.ImplementedBy) : undefined));
  ret.addPropertyResult("requiredProperties", "RequiredProperties", (properties.RequiredProperties != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RequiredProperties) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CompositeComponentTypeProperty`
 *
 * @param properties - the TypeScript properties of a `CompositeComponentTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeCompositeComponentTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentTypeId", cdk.validateString)(properties.componentTypeId));
  return errors.wrap("supplied properties not correct for \"CompositeComponentTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeCompositeComponentTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeCompositeComponentTypePropertyValidator(properties).assertSuccess();
  return {
    "ComponentTypeId": cdk.stringToCloudFormation(properties.componentTypeId)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeCompositeComponentTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.CompositeComponentTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.CompositeComponentTypeProperty>();
  ret.addPropertyResult("componentTypeId", "ComponentTypeId", (properties.ComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ErrorProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeErrorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("code", cdk.validateString)(properties.code));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  return errors.wrap("supplied properties not correct for \"ErrorProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeErrorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeErrorPropertyValidator(properties).assertSuccess();
  return {
    "Code": cdk.stringToCloudFormation(properties.code),
    "Message": cdk.stringToCloudFormation(properties.message)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentType.ErrorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.ErrorProperty>();
  ret.addPropertyResult("code", "Code", (properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatusProperty`
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeStatusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("error", CfnComponentTypeErrorPropertyValidator)(properties.error));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"StatusProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeStatusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeStatusPropertyValidator(properties).assertSuccess();
  return {
    "Error": convertCfnComponentTypeErrorPropertyToCloudFormation(properties.error),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.StatusProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.StatusProperty>();
  ret.addPropertyResult("error", "Error", (properties.Error != null ? CfnComponentTypeErrorPropertyFromCloudFormation(properties.Error) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnComponentTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnComponentTypeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentTypeId", cdk.requiredValidator)(properties.componentTypeId));
  errors.collect(cdk.propertyValidator("componentTypeId", cdk.validateString)(properties.componentTypeId));
  errors.collect(cdk.propertyValidator("compositeComponentTypes", cdk.hashValidator(CfnComponentTypeCompositeComponentTypePropertyValidator))(properties.compositeComponentTypes));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("extendsFrom", cdk.listValidator(cdk.validateString))(properties.extendsFrom));
  errors.collect(cdk.propertyValidator("functions", cdk.hashValidator(CfnComponentTypeFunctionPropertyValidator))(properties.functions));
  errors.collect(cdk.propertyValidator("isSingleton", cdk.validateBoolean)(properties.isSingleton));
  errors.collect(cdk.propertyValidator("propertyDefinitions", cdk.hashValidator(CfnComponentTypePropertyDefinitionPropertyValidator))(properties.propertyDefinitions));
  errors.collect(cdk.propertyValidator("propertyGroups", cdk.hashValidator(CfnComponentTypePropertyGroupPropertyValidator))(properties.propertyGroups));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.requiredValidator)(properties.workspaceId));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.validateString)(properties.workspaceId));
  return errors.wrap("supplied properties not correct for \"CfnComponentTypeProps\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypePropsValidator(properties).assertSuccess();
  return {
    "ComponentTypeId": cdk.stringToCloudFormation(properties.componentTypeId),
    "CompositeComponentTypes": cdk.hashMapper(convertCfnComponentTypeCompositeComponentTypePropertyToCloudFormation)(properties.compositeComponentTypes),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExtendsFrom": cdk.listMapper(cdk.stringToCloudFormation)(properties.extendsFrom),
    "Functions": cdk.hashMapper(convertCfnComponentTypeFunctionPropertyToCloudFormation)(properties.functions),
    "IsSingleton": cdk.booleanToCloudFormation(properties.isSingleton),
    "PropertyDefinitions": cdk.hashMapper(convertCfnComponentTypePropertyDefinitionPropertyToCloudFormation)(properties.propertyDefinitions),
    "PropertyGroups": cdk.hashMapper(convertCfnComponentTypePropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "WorkspaceId": cdk.stringToCloudFormation(properties.workspaceId)
  };
}

// @ts-ignore TS6133
function CfnComponentTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComponentTypeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentTypeProps>();
  ret.addPropertyResult("componentTypeId", "ComponentTypeId", (properties.ComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId) : undefined));
  ret.addPropertyResult("compositeComponentTypes", "CompositeComponentTypes", (properties.CompositeComponentTypes != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypeCompositeComponentTypePropertyFromCloudFormation)(properties.CompositeComponentTypes) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("extendsFrom", "ExtendsFrom", (properties.ExtendsFrom != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExtendsFrom) : undefined));
  ret.addPropertyResult("functions", "Functions", (properties.Functions != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypeFunctionPropertyFromCloudFormation)(properties.Functions) : undefined));
  ret.addPropertyResult("isSingleton", "IsSingleton", (properties.IsSingleton != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsSingleton) : undefined));
  ret.addPropertyResult("propertyDefinitions", "PropertyDefinitions", (properties.PropertyDefinitions != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypePropertyDefinitionPropertyFromCloudFormation)(properties.PropertyDefinitions) : undefined));
  ret.addPropertyResult("propertyGroups", "PropertyGroups", (properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getMap(CfnComponentTypePropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workspaceId", "WorkspaceId", (properties.WorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelationshipValueProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComponentTypeRelationshipValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetComponentName", cdk.validateString)(properties.targetComponentName));
  errors.collect(cdk.propertyValidator("targetEntityId", cdk.validateString)(properties.targetEntityId));
  return errors.wrap("supplied properties not correct for \"RelationshipValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnComponentTypeRelationshipValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComponentTypeRelationshipValuePropertyValidator(properties).assertSuccess();
  return {
    "TargetComponentName": cdk.stringToCloudFormation(properties.targetComponentName),
    "TargetEntityId": cdk.stringToCloudFormation(properties.targetEntityId)
  };
}

// @ts-ignore TS6133
function CfnComponentTypeRelationshipValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComponentType.RelationshipValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComponentType.RelationshipValueProperty>();
  ret.addPropertyResult("targetComponentName", "TargetComponentName", (properties.TargetComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentName) : undefined));
  ret.addPropertyResult("targetEntityId", "TargetEntityId", (properties.TargetEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetEntityId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoTTwinMaker::Entity` resource to declare an entity.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Entity
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export class CfnEntity extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTTwinMaker::Entity";

  /**
   * Build a CfnEntity from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEntity {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEntityPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEntity(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The entity ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time the entity was created.
   *
   * @cloudformationAttribute CreationDateTime
   */
  public readonly attrCreationDateTime: string;

  /**
   * A boolean value that specifies whether the entity has child entities or not.
   *
   * @cloudformationAttribute HasChildEntities
   */
  public readonly attrHasChildEntities: cdk.IResolvable;

  /**
   * The entity status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: cdk.IResolvable;

  /**
   * @cloudformationAttribute Status.Error
   */
  public readonly attrStatusError: cdk.IResolvable;

  /**
   * @cloudformationAttribute Status.Error.Code
   */
  public readonly attrStatusErrorCode: string;

  /**
   * @cloudformationAttribute Status.Error.Message
   */
  public readonly attrStatusErrorMessage: string;

  /**
   * @cloudformationAttribute Status.State
   */
  public readonly attrStatusState: string;

  /**
   * The date and time when the component type was last updated.
   *
   * @cloudformationAttribute UpdateDateTime
   */
  public readonly attrUpdateDateTime: string;

  /**
   * An object that maps strings to the components in the entity.
   */
  public components?: cdk.IResolvable | Record<string, CfnEntity.ComponentProperty | cdk.IResolvable>;

  /**
   * Maps string to `compositeComponent` updates in the request.
   */
  public compositeComponents?: cdk.IResolvable | Record<string, CfnEntity.CompositeComponentProperty | cdk.IResolvable>;

  /**
   * The description of the entity.
   */
  public description?: string;

  /**
   * The ID of the entity.
   */
  public entityId?: string;

  /**
   * The entity name.
   */
  public entityName: string;

  /**
   * The ID of the parent entity.
   */
  public parentEntityId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that you can use to manage the entity.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ID of the workspace that contains the entity.
   */
  public workspaceId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEntityProps) {
    super(scope, id, {
      "type": CfnEntity.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "entityName", this);
    cdk.requireProperty(props, "workspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDateTime = cdk.Token.asString(this.getAtt("CreationDateTime", cdk.ResolutionTypeHint.STRING));
    this.attrHasChildEntities = this.getAtt("HasChildEntities");
    this.attrStatus = this.getAtt("Status");
    this.attrStatusError = this.getAtt("Status.Error");
    this.attrStatusErrorCode = cdk.Token.asString(this.getAtt("Status.Error.Code", cdk.ResolutionTypeHint.STRING));
    this.attrStatusErrorMessage = cdk.Token.asString(this.getAtt("Status.Error.Message", cdk.ResolutionTypeHint.STRING));
    this.attrStatusState = cdk.Token.asString(this.getAtt("Status.State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateDateTime = cdk.Token.asString(this.getAtt("UpdateDateTime", cdk.ResolutionTypeHint.STRING));
    this.components = props.components;
    this.compositeComponents = props.compositeComponents;
    this.description = props.description;
    this.entityId = props.entityId;
    this.entityName = props.entityName;
    this.parentEntityId = props.parentEntityId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Entity", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspaceId = props.workspaceId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "components": this.components,
      "compositeComponents": this.compositeComponents,
      "description": this.description,
      "entityId": this.entityId,
      "entityName": this.entityName,
      "parentEntityId": this.parentEntityId,
      "tags": this.tags.renderTags(),
      "workspaceId": this.workspaceId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEntity.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEntityPropsToCloudFormation(props);
  }
}

export namespace CfnEntity {
  /**
   * The entity component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html
   */
  export interface ComponentProperty {
    /**
     * The name of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componentname
     */
    readonly componentName?: string;

    /**
     * The ID of the component type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componenttypeid
     */
    readonly componentTypeId?: string;

    /**
     * The name of the property definition set in the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-definedin
     */
    readonly definedIn?: string;

    /**
     * The description of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-description
     */
    readonly description?: string;

    /**
     * An object that maps strings to the properties to set in the component type.
     *
     * Each string in the mapping must be unique to this object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-properties
     */
    readonly properties?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnEntity.PropertyProperty>;

    /**
     * An object that maps strings to the property groups in the component type.
     *
     * Each string in the mapping must be unique to this object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-propertygroups
     */
    readonly propertyGroups?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnEntity.PropertyGroupProperty>;

    /**
     * The status of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-status
     */
    readonly status?: cdk.IResolvable | CfnEntity.StatusProperty;
  }

  /**
   * The current status of the entity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html
   */
  export interface StatusProperty {
    /**
     * The error message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-error
     */
    readonly error?: any | cdk.IResolvable;

    /**
     * The current state of the entity, component, component type, or workspace.
     *
     * Valid Values: `CREATING | UPDATING | DELETING | ACTIVE | ERROR`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-state
     */
    readonly state?: string;
  }

  /**
   * The property group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html
   */
  export interface PropertyGroupProperty {
    /**
     * The group type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-grouptype
     */
    readonly groupType?: string;

    /**
     * The property names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-propertynames
     */
    readonly propertyNames?: Array<string>;
  }

  /**
   * An object that sets information about a property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html
   */
  export interface PropertyProperty {
    /**
     * An object that specifies information about a property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-definition
     */
    readonly definition?: any | cdk.IResolvable;

    /**
     * An object that contains information about a value for a time series property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-value
     */
    readonly value?: CfnEntity.DataValueProperty | cdk.IResolvable;
  }

  /**
   * An object that specifies a value for a property.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html
   */
  export interface DataValueProperty {
    /**
     * A boolean value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-booleanvalue
     */
    readonly booleanValue?: boolean | cdk.IResolvable;

    /**
     * A double value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-doublevalue
     */
    readonly doubleValue?: number;

    /**
     * An expression that produces the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-expression
     */
    readonly expression?: string;

    /**
     * An integer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-integervalue
     */
    readonly integerValue?: number;

    /**
     * A list of multiple values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-listvalue
     */
    readonly listValue?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A long value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-longvalue
     */
    readonly longValue?: number;

    /**
     * An object that maps strings to multiple DataValue objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-mapvalue
     */
    readonly mapValue?: cdk.IResolvable | Record<string, CfnEntity.DataValueProperty | cdk.IResolvable>;

    /**
     * A value that relates a component to another component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-relationshipvalue
     */
    readonly relationshipValue?: any | cdk.IResolvable;

    /**
     * A string value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * Information about a composite component.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html
   */
  export interface CompositeComponentProperty {
    /**
     * The name of the component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-componentname
     */
    readonly componentName?: string;

    /**
     * The path to the composite component, starting from the top-level component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-componentpath
     */
    readonly componentPath?: string;

    /**
     * The ID of the composite component type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-componenttypeid
     */
    readonly componentTypeId?: string;

    /**
     * The description of the component type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-description
     */
    readonly description?: string;

    /**
     * Map of strings to the properties in the component type.
     *
     * Each string in the mapping must be unique to this component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-properties
     */
    readonly properties?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnEntity.PropertyProperty>;

    /**
     * The property groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-propertygroups
     */
    readonly propertyGroups?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnEntity.PropertyGroupProperty>;

    /**
     * The current status of the composite component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-compositecomponent.html#cfn-iottwinmaker-entity-compositecomponent-status
     */
    readonly status?: cdk.IResolvable | CfnEntity.StatusProperty;
  }

  /**
   * The entity error.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html
   */
  export interface ErrorProperty {
    /**
     * The entity error code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-code
     */
    readonly code?: string;

    /**
     * The entity error message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-message
     */
    readonly message?: string;
  }

  /**
   * The entity data type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html
   */
  export interface DataTypeProperty {
    /**
     * The allowed values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-allowedvalues
     */
    readonly allowedValues?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The nested type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-nestedtype
     */
    readonly nestedType?: CfnEntity.DataTypeProperty | cdk.IResolvable;

    /**
     * The relationship.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-relationship
     */
    readonly relationship?: cdk.IResolvable | CfnEntity.RelationshipProperty;

    /**
     * The entity type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-type
     */
    readonly type?: string;

    /**
     * The unit of measure.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-unitofmeasure
     */
    readonly unitOfMeasure?: string;
  }

  /**
   * The entity relationship.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html
   */
  export interface RelationshipProperty {
    /**
     * The relationship type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-relationshiptype
     */
    readonly relationshipType?: string;

    /**
     * the component type Id target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-targetcomponenttypeid
     */
    readonly targetComponentTypeId?: string;
  }

  /**
   * The entity definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html
   */
  export interface DefinitionProperty {
    /**
     * The configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-configuration
     */
    readonly configuration?: cdk.IResolvable | Record<string, string>;

    /**
     * The data type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-datatype
     */
    readonly dataType?: CfnEntity.DataTypeProperty | cdk.IResolvable;

    /**
     * The default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-defaultvalue
     */
    readonly defaultValue?: CfnEntity.DataValueProperty | cdk.IResolvable;

    /**
     * Displays if the entity has a external Id.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isexternalid
     */
    readonly isExternalId?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity is final.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isfinal
     */
    readonly isFinal?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity is imported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isimported
     */
    readonly isImported?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity is inherited.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isinherited
     */
    readonly isInherited?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity is a required entity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isrequiredinentity
     */
    readonly isRequiredInEntity?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity is tored externally.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isstoredexternally
     */
    readonly isStoredExternally?: boolean | cdk.IResolvable;

    /**
     * Displays if the entity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-istimeseries
     */
    readonly isTimeSeries?: boolean | cdk.IResolvable;
  }

  /**
   * The entity relationship.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html
   */
  export interface RelationshipValueProperty {
    /**
     * The target component name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetcomponentname
     */
    readonly targetComponentName?: string;

    /**
     * The target entity Id.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetentityid
     */
    readonly targetEntityId?: string;
  }
}

/**
 * Properties for defining a `CfnEntity`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export interface CfnEntityProps {
  /**
   * An object that maps strings to the components in the entity.
   *
   * Each string in the mapping must be unique to this object.
   *
   * For information on the component object see the [component](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_ComponentResponse.html) API reference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-components
   */
  readonly components?: cdk.IResolvable | Record<string, CfnEntity.ComponentProperty | cdk.IResolvable>;

  /**
   * Maps string to `compositeComponent` updates in the request.
   *
   * Each key of the map represents the `componentPath` of the `compositeComponent` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-compositecomponents
   */
  readonly compositeComponents?: cdk.IResolvable | Record<string, CfnEntity.CompositeComponentProperty | cdk.IResolvable>;

  /**
   * The description of the entity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-description
   */
  readonly description?: string;

  /**
   * The ID of the entity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityid
   */
  readonly entityId?: string;

  /**
   * The entity name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityname
   */
  readonly entityName: string;

  /**
   * The ID of the parent entity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-parententityid
   */
  readonly parentEntityId?: string;

  /**
   * Metadata that you can use to manage the entity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ID of the workspace that contains the entity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-workspaceid
   */
  readonly workspaceId: string;
}

/**
 * Determine whether the given properties match those of a `StatusProperty`
 *
 * @param properties - the TypeScript properties of a `StatusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityStatusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("error", cdk.validateObject)(properties.error));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"StatusProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityStatusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityStatusPropertyValidator(properties).assertSuccess();
  return {
    "Error": cdk.objectToCloudFormation(properties.error),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnEntityStatusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEntity.StatusProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.StatusProperty>();
  ret.addPropertyResult("error", "Error", (properties.Error != null ? cfn_parse.FromCloudFormation.getAny(properties.Error) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PropertyGroupProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityPropertyGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupType", cdk.validateString)(properties.groupType));
  errors.collect(cdk.propertyValidator("propertyNames", cdk.listValidator(cdk.validateString))(properties.propertyNames));
  return errors.wrap("supplied properties not correct for \"PropertyGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityPropertyGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityPropertyGroupPropertyValidator(properties).assertSuccess();
  return {
    "GroupType": cdk.stringToCloudFormation(properties.groupType),
    "PropertyNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.propertyNames)
  };
}

// @ts-ignore TS6133
function CfnEntityPropertyGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEntity.PropertyGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.PropertyGroupProperty>();
  ret.addPropertyResult("groupType", "GroupType", (properties.GroupType != null ? cfn_parse.FromCloudFormation.getString(properties.GroupType) : undefined));
  ret.addPropertyResult("propertyNames", "PropertyNames", (properties.PropertyNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PropertyNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataValueProperty`
 *
 * @param properties - the TypeScript properties of a `DataValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityDataValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateBoolean)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateNumber)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("integerValue", cdk.validateNumber)(properties.integerValue));
  errors.collect(cdk.propertyValidator("listValue", cdk.listValidator(CfnEntityDataValuePropertyValidator))(properties.listValue));
  errors.collect(cdk.propertyValidator("longValue", cdk.validateNumber)(properties.longValue));
  errors.collect(cdk.propertyValidator("mapValue", cdk.hashValidator(CfnEntityDataValuePropertyValidator))(properties.mapValue));
  errors.collect(cdk.propertyValidator("relationshipValue", cdk.validateObject)(properties.relationshipValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"DataValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityDataValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityDataValuePropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.booleanToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.numberToCloudFormation(properties.doubleValue),
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "IntegerValue": cdk.numberToCloudFormation(properties.integerValue),
    "ListValue": cdk.listMapper(convertCfnEntityDataValuePropertyToCloudFormation)(properties.listValue),
    "LongValue": cdk.numberToCloudFormation(properties.longValue),
    "MapValue": cdk.hashMapper(convertCfnEntityDataValuePropertyToCloudFormation)(properties.mapValue),
    "RelationshipValue": cdk.objectToCloudFormation(properties.relationshipValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnEntityDataValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DataValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DataValueProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("integerValue", "IntegerValue", (properties.IntegerValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntegerValue) : undefined));
  ret.addPropertyResult("listValue", "ListValue", (properties.ListValue != null ? cfn_parse.FromCloudFormation.getArray(CfnEntityDataValuePropertyFromCloudFormation)(properties.ListValue) : undefined));
  ret.addPropertyResult("longValue", "LongValue", (properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined));
  ret.addPropertyResult("mapValue", "MapValue", (properties.MapValue != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityDataValuePropertyFromCloudFormation)(properties.MapValue) : undefined));
  ret.addPropertyResult("relationshipValue", "RelationshipValue", (properties.RelationshipValue != null ? cfn_parse.FromCloudFormation.getAny(properties.RelationshipValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PropertyProperty`
 *
 * @param properties - the TypeScript properties of a `PropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.validateObject)(properties.definition));
  errors.collect(cdk.propertyValidator("value", CfnEntityDataValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"PropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Definition": cdk.objectToCloudFormation(properties.definition),
    "Value": convertCfnEntityDataValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEntityPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEntity.PropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.PropertyProperty>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnEntityDataValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComponentProperty`
 *
 * @param properties - the TypeScript properties of a `ComponentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityComponentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentName", cdk.validateString)(properties.componentName));
  errors.collect(cdk.propertyValidator("componentTypeId", cdk.validateString)(properties.componentTypeId));
  errors.collect(cdk.propertyValidator("definedIn", cdk.validateString)(properties.definedIn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("properties", cdk.hashValidator(CfnEntityPropertyPropertyValidator))(properties.properties));
  errors.collect(cdk.propertyValidator("propertyGroups", cdk.hashValidator(CfnEntityPropertyGroupPropertyValidator))(properties.propertyGroups));
  errors.collect(cdk.propertyValidator("status", CfnEntityStatusPropertyValidator)(properties.status));
  return errors.wrap("supplied properties not correct for \"ComponentProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityComponentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityComponentPropertyValidator(properties).assertSuccess();
  return {
    "ComponentName": cdk.stringToCloudFormation(properties.componentName),
    "ComponentTypeId": cdk.stringToCloudFormation(properties.componentTypeId),
    "DefinedIn": cdk.stringToCloudFormation(properties.definedIn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Properties": cdk.hashMapper(convertCfnEntityPropertyPropertyToCloudFormation)(properties.properties),
    "PropertyGroups": cdk.hashMapper(convertCfnEntityPropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
    "Status": convertCfnEntityStatusPropertyToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnEntityComponentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.ComponentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.ComponentProperty>();
  ret.addPropertyResult("componentName", "ComponentName", (properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined));
  ret.addPropertyResult("componentTypeId", "ComponentTypeId", (properties.ComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId) : undefined));
  ret.addPropertyResult("definedIn", "DefinedIn", (properties.DefinedIn != null ? cfn_parse.FromCloudFormation.getString(properties.DefinedIn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyPropertyFromCloudFormation)(properties.Properties) : undefined));
  ret.addPropertyResult("propertyGroups", "PropertyGroups", (properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? CfnEntityStatusPropertyFromCloudFormation(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CompositeComponentProperty`
 *
 * @param properties - the TypeScript properties of a `CompositeComponentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityCompositeComponentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentName", cdk.validateString)(properties.componentName));
  errors.collect(cdk.propertyValidator("componentPath", cdk.validateString)(properties.componentPath));
  errors.collect(cdk.propertyValidator("componentTypeId", cdk.validateString)(properties.componentTypeId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("properties", cdk.hashValidator(CfnEntityPropertyPropertyValidator))(properties.properties));
  errors.collect(cdk.propertyValidator("propertyGroups", cdk.hashValidator(CfnEntityPropertyGroupPropertyValidator))(properties.propertyGroups));
  errors.collect(cdk.propertyValidator("status", CfnEntityStatusPropertyValidator)(properties.status));
  return errors.wrap("supplied properties not correct for \"CompositeComponentProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityCompositeComponentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityCompositeComponentPropertyValidator(properties).assertSuccess();
  return {
    "ComponentName": cdk.stringToCloudFormation(properties.componentName),
    "ComponentPath": cdk.stringToCloudFormation(properties.componentPath),
    "ComponentTypeId": cdk.stringToCloudFormation(properties.componentTypeId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Properties": cdk.hashMapper(convertCfnEntityPropertyPropertyToCloudFormation)(properties.properties),
    "PropertyGroups": cdk.hashMapper(convertCfnEntityPropertyGroupPropertyToCloudFormation)(properties.propertyGroups),
    "Status": convertCfnEntityStatusPropertyToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnEntityCompositeComponentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.CompositeComponentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.CompositeComponentProperty>();
  ret.addPropertyResult("componentName", "ComponentName", (properties.ComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentName) : undefined));
  ret.addPropertyResult("componentPath", "ComponentPath", (properties.ComponentPath != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentPath) : undefined));
  ret.addPropertyResult("componentTypeId", "ComponentTypeId", (properties.ComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentTypeId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyPropertyFromCloudFormation)(properties.Properties) : undefined));
  ret.addPropertyResult("propertyGroups", "PropertyGroups", (properties.PropertyGroups != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityPropertyGroupPropertyFromCloudFormation)(properties.PropertyGroups) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? CfnEntityStatusPropertyFromCloudFormation(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ErrorProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityErrorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("code", cdk.validateString)(properties.code));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  return errors.wrap("supplied properties not correct for \"ErrorProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityErrorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityErrorPropertyValidator(properties).assertSuccess();
  return {
    "Code": cdk.stringToCloudFormation(properties.code),
    "Message": cdk.stringToCloudFormation(properties.message)
  };
}

// @ts-ignore TS6133
function CfnEntityErrorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.ErrorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.ErrorProperty>();
  ret.addPropertyResult("code", "Code", (properties.Code != null ? cfn_parse.FromCloudFormation.getString(properties.Code) : undefined));
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEntityProps`
 *
 * @param properties - the TypeScript properties of a `CfnEntityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("components", cdk.hashValidator(CfnEntityComponentPropertyValidator))(properties.components));
  errors.collect(cdk.propertyValidator("compositeComponents", cdk.hashValidator(CfnEntityCompositeComponentPropertyValidator))(properties.compositeComponents));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("entityId", cdk.validateString)(properties.entityId));
  errors.collect(cdk.propertyValidator("entityName", cdk.requiredValidator)(properties.entityName));
  errors.collect(cdk.propertyValidator("entityName", cdk.validateString)(properties.entityName));
  errors.collect(cdk.propertyValidator("parentEntityId", cdk.validateString)(properties.parentEntityId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.requiredValidator)(properties.workspaceId));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.validateString)(properties.workspaceId));
  return errors.wrap("supplied properties not correct for \"CfnEntityProps\"");
}

// @ts-ignore TS6133
function convertCfnEntityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityPropsValidator(properties).assertSuccess();
  return {
    "Components": cdk.hashMapper(convertCfnEntityComponentPropertyToCloudFormation)(properties.components),
    "CompositeComponents": cdk.hashMapper(convertCfnEntityCompositeComponentPropertyToCloudFormation)(properties.compositeComponents),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EntityId": cdk.stringToCloudFormation(properties.entityId),
    "EntityName": cdk.stringToCloudFormation(properties.entityName),
    "ParentEntityId": cdk.stringToCloudFormation(properties.parentEntityId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "WorkspaceId": cdk.stringToCloudFormation(properties.workspaceId)
  };
}

// @ts-ignore TS6133
function CfnEntityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntityProps>();
  ret.addPropertyResult("components", "Components", (properties.Components != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityComponentPropertyFromCloudFormation)(properties.Components) : undefined));
  ret.addPropertyResult("compositeComponents", "CompositeComponents", (properties.CompositeComponents != null ? cfn_parse.FromCloudFormation.getMap(CfnEntityCompositeComponentPropertyFromCloudFormation)(properties.CompositeComponents) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("entityId", "EntityId", (properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined));
  ret.addPropertyResult("entityName", "EntityName", (properties.EntityName != null ? cfn_parse.FromCloudFormation.getString(properties.EntityName) : undefined));
  ret.addPropertyResult("parentEntityId", "ParentEntityId", (properties.ParentEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.ParentEntityId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workspaceId", "WorkspaceId", (properties.WorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelationshipProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityRelationshipPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("relationshipType", cdk.validateString)(properties.relationshipType));
  errors.collect(cdk.propertyValidator("targetComponentTypeId", cdk.validateString)(properties.targetComponentTypeId));
  return errors.wrap("supplied properties not correct for \"RelationshipProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityRelationshipPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityRelationshipPropertyValidator(properties).assertSuccess();
  return {
    "RelationshipType": cdk.stringToCloudFormation(properties.relationshipType),
    "TargetComponentTypeId": cdk.stringToCloudFormation(properties.targetComponentTypeId)
  };
}

// @ts-ignore TS6133
function CfnEntityRelationshipPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEntity.RelationshipProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.RelationshipProperty>();
  ret.addPropertyResult("relationshipType", "RelationshipType", (properties.RelationshipType != null ? cfn_parse.FromCloudFormation.getString(properties.RelationshipType) : undefined));
  ret.addPropertyResult("targetComponentTypeId", "TargetComponentTypeId", (properties.TargetComponentTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentTypeId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataTypeProperty`
 *
 * @param properties - the TypeScript properties of a `DataTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityDataTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.listValidator(CfnEntityDataValuePropertyValidator))(properties.allowedValues));
  errors.collect(cdk.propertyValidator("nestedType", CfnEntityDataTypePropertyValidator)(properties.nestedType));
  errors.collect(cdk.propertyValidator("relationship", CfnEntityRelationshipPropertyValidator)(properties.relationship));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("unitOfMeasure", cdk.validateString)(properties.unitOfMeasure));
  return errors.wrap("supplied properties not correct for \"DataTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityDataTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityDataTypePropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.listMapper(convertCfnEntityDataValuePropertyToCloudFormation)(properties.allowedValues),
    "NestedType": convertCfnEntityDataTypePropertyToCloudFormation(properties.nestedType),
    "Relationship": convertCfnEntityRelationshipPropertyToCloudFormation(properties.relationship),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UnitOfMeasure": cdk.stringToCloudFormation(properties.unitOfMeasure)
  };
}

// @ts-ignore TS6133
function CfnEntityDataTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DataTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DataTypeProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getArray(CfnEntityDataValuePropertyFromCloudFormation)(properties.AllowedValues) : undefined));
  ret.addPropertyResult("nestedType", "NestedType", (properties.NestedType != null ? CfnEntityDataTypePropertyFromCloudFormation(properties.NestedType) : undefined));
  ret.addPropertyResult("relationship", "Relationship", (properties.Relationship != null ? CfnEntityRelationshipPropertyFromCloudFormation(properties.Relationship) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("unitOfMeasure", "UnitOfMeasure", (properties.UnitOfMeasure != null ? cfn_parse.FromCloudFormation.getString(properties.UnitOfMeasure) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.hashValidator(cdk.validateString))(properties.configuration));
  errors.collect(cdk.propertyValidator("dataType", CfnEntityDataTypePropertyValidator)(properties.dataType));
  errors.collect(cdk.propertyValidator("defaultValue", CfnEntityDataValuePropertyValidator)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("isExternalId", cdk.validateBoolean)(properties.isExternalId));
  errors.collect(cdk.propertyValidator("isFinal", cdk.validateBoolean)(properties.isFinal));
  errors.collect(cdk.propertyValidator("isImported", cdk.validateBoolean)(properties.isImported));
  errors.collect(cdk.propertyValidator("isInherited", cdk.validateBoolean)(properties.isInherited));
  errors.collect(cdk.propertyValidator("isRequiredInEntity", cdk.validateBoolean)(properties.isRequiredInEntity));
  errors.collect(cdk.propertyValidator("isStoredExternally", cdk.validateBoolean)(properties.isStoredExternally));
  errors.collect(cdk.propertyValidator("isTimeSeries", cdk.validateBoolean)(properties.isTimeSeries));
  return errors.wrap("supplied properties not correct for \"DefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Configuration": cdk.hashMapper(cdk.stringToCloudFormation)(properties.configuration),
    "DataType": convertCfnEntityDataTypePropertyToCloudFormation(properties.dataType),
    "DefaultValue": convertCfnEntityDataValuePropertyToCloudFormation(properties.defaultValue),
    "IsExternalId": cdk.booleanToCloudFormation(properties.isExternalId),
    "IsFinal": cdk.booleanToCloudFormation(properties.isFinal),
    "IsImported": cdk.booleanToCloudFormation(properties.isImported),
    "IsInherited": cdk.booleanToCloudFormation(properties.isInherited),
    "IsRequiredInEntity": cdk.booleanToCloudFormation(properties.isRequiredInEntity),
    "IsStoredExternally": cdk.booleanToCloudFormation(properties.isStoredExternally),
    "IsTimeSeries": cdk.booleanToCloudFormation(properties.isTimeSeries)
  };
}

// @ts-ignore TS6133
function CfnEntityDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEntity.DefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.DefinitionProperty>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Configuration) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? CfnEntityDataTypePropertyFromCloudFormation(properties.DataType) : undefined));
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? CfnEntityDataValuePropertyFromCloudFormation(properties.DefaultValue) : undefined));
  ret.addPropertyResult("isExternalId", "IsExternalId", (properties.IsExternalId != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsExternalId) : undefined));
  ret.addPropertyResult("isFinal", "IsFinal", (properties.IsFinal != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsFinal) : undefined));
  ret.addPropertyResult("isImported", "IsImported", (properties.IsImported != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsImported) : undefined));
  ret.addPropertyResult("isInherited", "IsInherited", (properties.IsInherited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsInherited) : undefined));
  ret.addPropertyResult("isRequiredInEntity", "IsRequiredInEntity", (properties.IsRequiredInEntity != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsRequiredInEntity) : undefined));
  ret.addPropertyResult("isStoredExternally", "IsStoredExternally", (properties.IsStoredExternally != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsStoredExternally) : undefined));
  ret.addPropertyResult("isTimeSeries", "IsTimeSeries", (properties.IsTimeSeries != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsTimeSeries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelationshipValueProperty`
 *
 * @param properties - the TypeScript properties of a `RelationshipValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEntityRelationshipValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetComponentName", cdk.validateString)(properties.targetComponentName));
  errors.collect(cdk.propertyValidator("targetEntityId", cdk.validateString)(properties.targetEntityId));
  return errors.wrap("supplied properties not correct for \"RelationshipValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnEntityRelationshipValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEntityRelationshipValuePropertyValidator(properties).assertSuccess();
  return {
    "TargetComponentName": cdk.stringToCloudFormation(properties.targetComponentName),
    "TargetEntityId": cdk.stringToCloudFormation(properties.targetEntityId)
  };
}

// @ts-ignore TS6133
function CfnEntityRelationshipValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEntity.RelationshipValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEntity.RelationshipValueProperty>();
  ret.addPropertyResult("targetComponentName", "TargetComponentName", (properties.TargetComponentName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetComponentName) : undefined));
  ret.addPropertyResult("targetEntityId", "TargetEntityId", (properties.TargetEntityId != null ? cfn_parse.FromCloudFormation.getString(properties.TargetEntityId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoTTwinMaker::Scene` resource to declare a scene.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Scene
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export class CfnScene extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTTwinMaker::Scene";

  /**
   * Build a CfnScene from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScene {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScenePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScene(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The scene ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time when the scene was created.
   *
   * @cloudformationAttribute CreationDateTime
   */
  public readonly attrCreationDateTime: string;

  /**
   * The generated scene metadata.
   *
   * @cloudformationAttribute GeneratedSceneMetadata
   */
  public readonly attrGeneratedSceneMetadata: cdk.IResolvable;

  /**
   * The scene the update time.
   *
   * @cloudformationAttribute UpdateDateTime
   */
  public readonly attrUpdateDateTime: string;

  /**
   * A list of capabilities that the scene uses to render.
   */
  public capabilities?: Array<string>;

  /**
   * The relative path that specifies the location of the content definition file.
   */
  public contentLocation: string;

  /**
   * The description of this scene.
   */
  public description?: string;

  /**
   * The ID of the scene.
   */
  public sceneId: string;

  /**
   * The scene metadata.
   */
  public sceneMetadata?: cdk.IResolvable | Record<string, string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The ComponentType tags.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ID of the scene.
   */
  public workspaceId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSceneProps) {
    super(scope, id, {
      "type": CfnScene.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "contentLocation", this);
    cdk.requireProperty(props, "sceneId", this);
    cdk.requireProperty(props, "workspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDateTime = cdk.Token.asString(this.getAtt("CreationDateTime", cdk.ResolutionTypeHint.STRING));
    this.attrGeneratedSceneMetadata = this.getAtt("GeneratedSceneMetadata");
    this.attrUpdateDateTime = cdk.Token.asString(this.getAtt("UpdateDateTime", cdk.ResolutionTypeHint.STRING));
    this.capabilities = props.capabilities;
    this.contentLocation = props.contentLocation;
    this.description = props.description;
    this.sceneId = props.sceneId;
    this.sceneMetadata = props.sceneMetadata;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Scene", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspaceId = props.workspaceId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capabilities": this.capabilities,
      "contentLocation": this.contentLocation,
      "description": this.description,
      "sceneId": this.sceneId,
      "sceneMetadata": this.sceneMetadata,
      "tags": this.tags.renderTags(),
      "workspaceId": this.workspaceId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScene.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScenePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnScene`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export interface CfnSceneProps {
  /**
   * A list of capabilities that the scene uses to render.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-capabilities
   */
  readonly capabilities?: Array<string>;

  /**
   * The relative path that specifies the location of the content definition file.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-contentlocation
   */
  readonly contentLocation: string;

  /**
   * The description of this scene.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-description
   */
  readonly description?: string;

  /**
   * The ID of the scene.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-sceneid
   */
  readonly sceneId: string;

  /**
   * The scene metadata.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-scenemetadata
   */
  readonly sceneMetadata?: cdk.IResolvable | Record<string, string>;

  /**
   * The ComponentType tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ID of the scene.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-workspaceid
   */
  readonly workspaceId: string;
}

/**
 * Determine whether the given properties match those of a `CfnSceneProps`
 *
 * @param properties - the TypeScript properties of a `CfnSceneProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScenePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capabilities", cdk.listValidator(cdk.validateString))(properties.capabilities));
  errors.collect(cdk.propertyValidator("contentLocation", cdk.requiredValidator)(properties.contentLocation));
  errors.collect(cdk.propertyValidator("contentLocation", cdk.validateString)(properties.contentLocation));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("sceneId", cdk.requiredValidator)(properties.sceneId));
  errors.collect(cdk.propertyValidator("sceneId", cdk.validateString)(properties.sceneId));
  errors.collect(cdk.propertyValidator("sceneMetadata", cdk.hashValidator(cdk.validateString))(properties.sceneMetadata));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.requiredValidator)(properties.workspaceId));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.validateString)(properties.workspaceId));
  return errors.wrap("supplied properties not correct for \"CfnSceneProps\"");
}

// @ts-ignore TS6133
function convertCfnScenePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScenePropsValidator(properties).assertSuccess();
  return {
    "Capabilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.capabilities),
    "ContentLocation": cdk.stringToCloudFormation(properties.contentLocation),
    "Description": cdk.stringToCloudFormation(properties.description),
    "SceneId": cdk.stringToCloudFormation(properties.sceneId),
    "SceneMetadata": cdk.hashMapper(cdk.stringToCloudFormation)(properties.sceneMetadata),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "WorkspaceId": cdk.stringToCloudFormation(properties.workspaceId)
  };
}

// @ts-ignore TS6133
function CfnScenePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSceneProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSceneProps>();
  ret.addPropertyResult("capabilities", "Capabilities", (properties.Capabilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Capabilities) : undefined));
  ret.addPropertyResult("contentLocation", "ContentLocation", (properties.ContentLocation != null ? cfn_parse.FromCloudFormation.getString(properties.ContentLocation) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("sceneId", "SceneId", (properties.SceneId != null ? cfn_parse.FromCloudFormation.getString(properties.SceneId) : undefined));
  ret.addPropertyResult("sceneMetadata", "SceneMetadata", (properties.SceneMetadata != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.SceneMetadata) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workspaceId", "WorkspaceId", (properties.WorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The SyncJob.
 *
 * @cloudformationResource AWS::IoTTwinMaker::SyncJob
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export class CfnSyncJob extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTTwinMaker::SyncJob";

  /**
   * Build a CfnSyncJob from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSyncJob {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSyncJobPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSyncJob(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The SyncJob ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The creation date and time of the SyncJob.
   *
   * @cloudformationAttribute CreationDateTime
   */
  public readonly attrCreationDateTime: string;

  /**
   * The SyncJob's state.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The update date and time.
   *
   * @cloudformationAttribute UpdateDateTime
   */
  public readonly attrUpdateDateTime: string;

  /**
   * The SyncJob IAM role.
   */
  public syncRole: string;

  /**
   * The sync source.
   */
  public syncSource: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata you can use to manage the SyncJob.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ID of the workspace that contains the sync job.
   */
  public workspaceId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSyncJobProps) {
    super(scope, id, {
      "type": CfnSyncJob.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "syncRole", this);
    cdk.requireProperty(props, "syncSource", this);
    cdk.requireProperty(props, "workspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDateTime = cdk.Token.asString(this.getAtt("CreationDateTime", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateDateTime = cdk.Token.asString(this.getAtt("UpdateDateTime", cdk.ResolutionTypeHint.STRING));
    this.syncRole = props.syncRole;
    this.syncSource = props.syncSource;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::SyncJob", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspaceId = props.workspaceId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "syncRole": this.syncRole,
      "syncSource": this.syncSource,
      "tags": this.tags.renderTags(),
      "workspaceId": this.workspaceId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSyncJob.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSyncJobPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSyncJob`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export interface CfnSyncJobProps {
  /**
   * The SyncJob IAM role.
   *
   * This IAM role is used by the sync job to read from the syncSource, and create, update or delete the corresponding resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncrole
   */
  readonly syncRole: string;

  /**
   * The sync source.
   *
   * > Currently the only supported syncSoucre is `SITEWISE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncsource
   */
  readonly syncSource: string;

  /**
   * Metadata you can use to manage the SyncJob.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ID of the workspace that contains the sync job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-workspaceid
   */
  readonly workspaceId: string;
}

/**
 * Determine whether the given properties match those of a `CfnSyncJobProps`
 *
 * @param properties - the TypeScript properties of a `CfnSyncJobProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSyncJobPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("syncRole", cdk.requiredValidator)(properties.syncRole));
  errors.collect(cdk.propertyValidator("syncRole", cdk.validateString)(properties.syncRole));
  errors.collect(cdk.propertyValidator("syncSource", cdk.requiredValidator)(properties.syncSource));
  errors.collect(cdk.propertyValidator("syncSource", cdk.validateString)(properties.syncSource));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.requiredValidator)(properties.workspaceId));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.validateString)(properties.workspaceId));
  return errors.wrap("supplied properties not correct for \"CfnSyncJobProps\"");
}

// @ts-ignore TS6133
function convertCfnSyncJobPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSyncJobPropsValidator(properties).assertSuccess();
  return {
    "SyncRole": cdk.stringToCloudFormation(properties.syncRole),
    "SyncSource": cdk.stringToCloudFormation(properties.syncSource),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "WorkspaceId": cdk.stringToCloudFormation(properties.workspaceId)
  };
}

// @ts-ignore TS6133
function CfnSyncJobPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSyncJobProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSyncJobProps>();
  ret.addPropertyResult("syncRole", "SyncRole", (properties.SyncRole != null ? cfn_parse.FromCloudFormation.getString(properties.SyncRole) : undefined));
  ret.addPropertyResult("syncSource", "SyncSource", (properties.SyncSource != null ? cfn_parse.FromCloudFormation.getString(properties.SyncSource) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workspaceId", "WorkspaceId", (properties.WorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::IoTTwinMaker::Workspace` resource to declare a workspace.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Workspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTTwinMaker::Workspace";

  /**
   * Build a CfnWorkspace from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The workspace ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time the workspace was created.
   *
   * @cloudformationAttribute CreationDateTime
   */
  public readonly attrCreationDateTime: string;

  /**
   * The date and time the workspace was updated.
   *
   * @cloudformationAttribute UpdateDateTime
   */
  public readonly attrUpdateDateTime: string;

  /**
   * The description of the workspace.
   */
  public description?: string;

  /**
   * The ARN of the execution role associated with the workspace.
   */
  public role: string;

  /**
   * The ARN of the S3 bucket where resources associated with the workspace are stored.
   */
  public s3Location: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that you can use to manage the workspace.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The ID of the workspace.
   */
  public workspaceId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps) {
    super(scope, id, {
      "type": CfnWorkspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "role", this);
    cdk.requireProperty(props, "s3Location", this);
    cdk.requireProperty(props, "workspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationDateTime = cdk.Token.asString(this.getAtt("CreationDateTime", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateDateTime = cdk.Token.asString(this.getAtt("UpdateDateTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.role = props.role;
    this.s3Location = props.s3Location;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::IoTTwinMaker::Workspace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspaceId = props.workspaceId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "role": this.role,
      "s3Location": this.s3Location,
      "tags": this.tags.renderTags(),
      "workspaceId": this.workspaceId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkspacePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export interface CfnWorkspaceProps {
  /**
   * The description of the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-description
   */
  readonly description?: string;

  /**
   * The ARN of the execution role associated with the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-role
   */
  readonly role: string;

  /**
   * The ARN of the S3 bucket where resources associated with the workspace are stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-s3location
   */
  readonly s3Location: string;

  /**
   * Metadata that you can use to manage the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The ID of the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-workspaceid
   */
  readonly workspaceId: string;
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("s3Location", cdk.requiredValidator)(properties.s3Location));
  errors.collect(cdk.propertyValidator("s3Location", cdk.validateString)(properties.s3Location));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.requiredValidator)(properties.workspaceId));
  errors.collect(cdk.propertyValidator("workspaceId", cdk.validateString)(properties.workspaceId));
  return errors.wrap("supplied properties not correct for \"CfnWorkspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspacePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Role": cdk.stringToCloudFormation(properties.role),
    "S3Location": cdk.stringToCloudFormation(properties.s3Location),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "WorkspaceId": cdk.stringToCloudFormation(properties.workspaceId)
  };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("s3Location", "S3Location", (properties.S3Location != null ? cfn_parse.FromCloudFormation.getString(properties.S3Location) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("workspaceId", "WorkspaceId", (properties.WorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.WorkspaceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}