import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnComponentType`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export interface CfnComponentTypeProps {
    /**
     * The ID of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-componenttypeid
     */
    readonly componentTypeId: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-workspaceid
     */
    readonly workspaceId: string;
    /**
     * The description of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-description
     */
    readonly description?: string;
    /**
     * The name of the parent component type that this component type extends.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-extendsfrom
     */
    readonly extendsFrom?: string[];
    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information on the FunctionResponse object see the [FunctionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_FunctionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-functions
     */
    readonly functions?: {
        [key: string]: (CfnComponentType.FunctionProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * A boolean value that specifies whether an entity can have more than one component of this type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-issingleton
     */
    readonly isSingleton?: boolean | cdk.IResolvable;
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information about the PropertyDefinitionResponse object, see the [PropertyDefinitionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_PropertyDefinitionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertydefinitions
     */
    readonly propertyDefinitions?: {
        [key: string]: (CfnComponentType.PropertyDefinitionProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertygroups
     */
    readonly propertyGroups?: {
        [key: string]: (CfnComponentType.PropertyGroupProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::IoTTwinMaker::ComponentType`
 *
 * Use the `AWS::IoTTwinMaker::ComponentType` resource to declare a component type.
 *
 * @cloudformationResource AWS::IoTTwinMaker::ComponentType
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html
 */
export declare class CfnComponentType extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::ComponentType";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComponentType;
    /**
     * The ARN of the component type.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The date and time when the component type was created.
     * @cloudformationAttribute CreationDateTime
     */
    readonly attrCreationDateTime: string;
    /**
     * A boolean value that specifies whether the component type is abstract.
     * @cloudformationAttribute IsAbstract
     */
    readonly attrIsAbstract: cdk.IResolvable;
    /**
     * A boolean value that specifies whether the component type has a schema initializer and that the schema initializer has run.
     * @cloudformationAttribute IsSchemaInitialized
     */
    readonly attrIsSchemaInitialized: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Status.Error.Code
     */
    readonly attrStatusErrorCode: string;
    /**
     *
     * @cloudformationAttribute Status.Error.Message
     */
    readonly attrStatusErrorMessage: string;
    /**
     *
     * @cloudformationAttribute Status.State
     */
    readonly attrStatusState: string;
    /**
     * The component type the update time.
     * @cloudformationAttribute UpdateDateTime
     */
    readonly attrUpdateDateTime: string;
    /**
     * The ID of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-componenttypeid
     */
    componentTypeId: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-workspaceid
     */
    workspaceId: string;
    /**
     * The description of the component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-description
     */
    description: string | undefined;
    /**
     * The name of the parent component type that this component type extends.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-extendsfrom
     */
    extendsFrom: string[] | undefined;
    /**
     * An object that maps strings to the functions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information on the FunctionResponse object see the [FunctionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_FunctionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-functions
     */
    functions: {
        [key: string]: (CfnComponentType.FunctionProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * A boolean value that specifies whether an entity can have more than one component of this type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-issingleton
     */
    isSingleton: boolean | cdk.IResolvable | undefined;
    /**
     * An object that maps strings to the property definitions in the component type. Each string in the mapping must be unique to this object.
     *
     * For information about the PropertyDefinitionResponse object, see the [PropertyDefinitionResponse](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_PropertyDefinitionResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertydefinitions
     */
    propertyDefinitions: {
        [key: string]: (CfnComponentType.PropertyDefinitionProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-propertygroups
     */
    propertyGroups: {
        [key: string]: (CfnComponentType.PropertyGroupProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-componenttype.html#cfn-iottwinmaker-componenttype-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTTwinMaker::ComponentType`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnComponentTypeProps);
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
export declare namespace CfnComponentType {
    /**
     * The data connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html
     */
    interface DataConnectorProperty {
        /**
         * A boolean value that specifies whether the data connector is native to IoT TwinMaker.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-isnative
         */
        readonly isNative?: boolean | cdk.IResolvable;
        /**
         * The Lambda function associated with the data connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-dataconnector.html#cfn-iottwinmaker-componenttype-dataconnector-lambda
         */
        readonly lambda?: CfnComponentType.LambdaFunctionProperty | cdk.IResolvable;
    }
}
export declare namespace CfnComponentType {
    /**
     * An object that specifies the data type of a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html
     */
    interface DataTypeProperty {
        /**
         * The allowed values for this data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-allowedvalues
         */
        readonly allowedValues?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The nested type in the data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-nestedtype
         */
        readonly nestedType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;
        /**
         * A relationship that associates a component with another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-relationship
         */
        readonly relationship?: CfnComponentType.RelationshipProperty | cdk.IResolvable;
        /**
         * The underlying type of the data type.
         *
         * Valid Values: `RELATIONSHIP | STRING | LONG | BOOLEAN | INTEGER | DOUBLE | LIST | MAP`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-type
         */
        readonly type: string;
        /**
         * The unit of measure used in this data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datatype.html#cfn-iottwinmaker-componenttype-datatype-unitofmeasure
         */
        readonly unitOfMeasure?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     * An object that specifies a value for a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html
     */
    interface DataValueProperty {
        /**
         * A boolean value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-booleanvalue
         */
        readonly booleanValue?: boolean | cdk.IResolvable;
        /**
         * A double value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-doublevalue
         */
        readonly doubleValue?: number;
        /**
         * An expression that produces the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-expression
         */
        readonly expression?: string;
        /**
         * An integer value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-integervalue
         */
        readonly integerValue?: number;
        /**
         * A list of multiple values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-listvalue
         */
        readonly listValue?: Array<CfnComponentType.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A long value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-longvalue
         */
        readonly longValue?: number;
        /**
         * An object that maps strings to multiple `DataValue` objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-mapvalue
         */
        readonly mapValue?: {
            [key: string]: (CfnComponentType.DataValueProperty | cdk.IResolvable);
        } | cdk.IResolvable;
        /**
         * A value that relates a component to another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-relationshipvalue
         */
        readonly relationshipValue?: any | cdk.IResolvable;
        /**
         * A string value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-datavalue.html#cfn-iottwinmaker-componenttype-datavalue-stringvalue
         */
        readonly stringValue?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html
     */
    interface ErrorProperty {
        /**
         * `CfnComponentType.ErrorProperty.Code`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-code
         */
        readonly code?: string;
        /**
         * `CfnComponentType.ErrorProperty.Message`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-error.html#cfn-iottwinmaker-componenttype-error-message
         */
        readonly message?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     * The function body.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html
     */
    interface FunctionProperty {
        /**
         * The data connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-implementedby
         */
        readonly implementedBy?: CfnComponentType.DataConnectorProperty | cdk.IResolvable;
        /**
         * The required properties of the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-requiredproperties
         */
        readonly requiredProperties?: string[];
        /**
         * The scope of the function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-function.html#cfn-iottwinmaker-componenttype-function-scope
         */
        readonly scope?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     * The Lambda function.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html
     */
    interface LambdaFunctionProperty {
        /**
         * The Lambda function ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-lambdafunction.html#cfn-iottwinmaker-componenttype-lambdafunction-arn
         */
        readonly arn: string;
    }
}
export declare namespace CfnComponentType {
    /**
     * PropertyDefinition is an object that maps strings to the property definitions in the component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html
     */
    interface PropertyDefinitionProperty {
        /**
         * A mapping that specifies configuration information about the property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-configurations
         */
        readonly configurations?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * `CfnComponentType.PropertyDefinitionProperty.DataType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-datatype
         */
        readonly dataType?: CfnComponentType.DataTypeProperty | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property ID comes from an external data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-defaultvalue
         */
        readonly defaultValue?: CfnComponentType.DataValueProperty | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property ID comes from an external data store.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isexternalid
         */
        readonly isExternalId?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property is required in an entity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isrequiredinentity
         */
        readonly isRequiredInEntity?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property is stored externally.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-isstoredexternally
         */
        readonly isStoredExternally?: boolean | cdk.IResolvable;
        /**
         * A boolean value that specifies whether the property consists of time series data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertydefinition.html#cfn-iottwinmaker-componenttype-propertydefinition-istimeseries
         */
        readonly isTimeSeries?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnComponentType {
    /**
     * The property group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html
     */
    interface PropertyGroupProperty {
        /**
         * The group type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-grouptype
         */
        readonly groupType?: string;
        /**
         * The property names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-propertygroup.html#cfn-iottwinmaker-componenttype-propertygroup-propertynames
         */
        readonly propertyNames?: string[];
    }
}
export declare namespace CfnComponentType {
    /**
     * An object that specifies a relationship with another component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html
     */
    interface RelationshipProperty {
        /**
         * The type of the relationship.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-relationshiptype
         */
        readonly relationshipType?: string;
        /**
         * The ID of the target component type associated with this relationship.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationship.html#cfn-iottwinmaker-componenttype-relationship-targetcomponenttypeid
         */
        readonly targetComponentTypeId?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html
     */
    interface RelationshipValueProperty {
        /**
         * `CfnComponentType.RelationshipValueProperty.TargetComponentName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetcomponentname
         */
        readonly targetComponentName?: string;
        /**
         * `CfnComponentType.RelationshipValueProperty.TargetEntityId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-relationshipvalue.html#cfn-iottwinmaker-componenttype-relationshipvalue-targetentityid
         */
        readonly targetEntityId?: string;
    }
}
export declare namespace CfnComponentType {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html
     */
    interface StatusProperty {
        /**
         * `CfnComponentType.StatusProperty.Error`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-error
         */
        readonly error?: CfnComponentType.ErrorProperty | cdk.IResolvable;
        /**
         * `CfnComponentType.StatusProperty.State`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-componenttype-status.html#cfn-iottwinmaker-componenttype-status-state
         */
        readonly state?: string;
    }
}
/**
 * Properties for defining a `CfnEntity`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export interface CfnEntityProps {
    /**
     * The entity name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityname
     */
    readonly entityName: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-workspaceid
     */
    readonly workspaceId: string;
    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     *
     * For information on the component object see the [component](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_ComponentResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-components
     */
    readonly components?: {
        [key: string]: (CfnEntity.ComponentProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The description of the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-description
     */
    readonly description?: string;
    /**
     * The entity ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityid
     */
    readonly entityId?: string;
    /**
     * The ID of the parent entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-parententityid
     */
    readonly parentEntityId?: string;
    /**
     * Metadata that you can use to manage the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::IoTTwinMaker::Entity`
 *
 * Use the `AWS::IoTTwinMaker::Entity` resource to declare an entity.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Entity
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html
 */
export declare class CfnEntity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Entity";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEntity;
    /**
     * The entity ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The date and time the entity was created.
     * @cloudformationAttribute CreationDateTime
     */
    readonly attrCreationDateTime: string;
    /**
     * A boolean value that specifies whether the entity has child entities or not.
     * @cloudformationAttribute HasChildEntities
     */
    readonly attrHasChildEntities: cdk.IResolvable;
    /**
     *
     * @cloudformationAttribute Status.Error.Code
     */
    readonly attrStatusErrorCode: string;
    /**
     *
     * @cloudformationAttribute Status.Error.Message
     */
    readonly attrStatusErrorMessage: string;
    /**
     *
     * @cloudformationAttribute Status.State
     */
    readonly attrStatusState: string;
    /**
     * The date and time when the component type was last updated.
     * @cloudformationAttribute UpdateDateTime
     */
    readonly attrUpdateDateTime: string;
    /**
     * The entity name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityname
     */
    entityName: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-workspaceid
     */
    workspaceId: string;
    /**
     * An object that maps strings to the components in the entity. Each string in the mapping must be unique to this object.
     *
     * For information on the component object see the [component](https://docs.aws.amazon.com//iot-twinmaker/latest/apireference/API_ComponentResponse.html) API reference.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-components
     */
    components: {
        [key: string]: (CfnEntity.ComponentProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The description of the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-description
     */
    description: string | undefined;
    /**
     * The entity ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-entityid
     */
    entityId: string | undefined;
    /**
     * The ID of the parent entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-parententityid
     */
    parentEntityId: string | undefined;
    /**
     * Metadata that you can use to manage the entity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-entity.html#cfn-iottwinmaker-entity-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTTwinMaker::Entity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEntityProps);
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
export declare namespace CfnEntity {
    /**
     * The entity component.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html
     */
    interface ComponentProperty {
        /**
         * The name of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componentname
         */
        readonly componentName?: string;
        /**
         * The ID of the ComponentType.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-componenttypeid
         */
        readonly componentTypeId?: string;
        /**
         * The name of the property definition set in the request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-definedin
         */
        readonly definedIn?: string;
        /**
         * The description of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-description
         */
        readonly description?: string;
        /**
         * An object that maps strings to the properties to set in the component type. Each string in the mapping must be unique to this object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-properties
         */
        readonly properties?: {
            [key: string]: (CfnEntity.PropertyProperty | cdk.IResolvable);
        } | cdk.IResolvable;
        /**
         * An object that maps strings to the property groups in the component type. Each string in the mapping must be unique to this object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-propertygroups
         */
        readonly propertyGroups?: {
            [key: string]: (CfnEntity.PropertyGroupProperty | cdk.IResolvable);
        } | cdk.IResolvable;
        /**
         * The status of the component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-component.html#cfn-iottwinmaker-entity-component-status
         */
        readonly status?: CfnEntity.StatusProperty | cdk.IResolvable;
    }
}
export declare namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html
     */
    interface DataTypeProperty {
        /**
         * `CfnEntity.DataTypeProperty.AllowedValues`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-allowedvalues
         */
        readonly allowedValues?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.NestedType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-nestedtype
         */
        readonly nestedType?: CfnEntity.DataTypeProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.Relationship`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-relationship
         */
        readonly relationship?: CfnEntity.RelationshipProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DataTypeProperty.Type`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-type
         */
        readonly type?: string;
        /**
         * `CfnEntity.DataTypeProperty.UnitOfMeasure`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datatype.html#cfn-iottwinmaker-entity-datatype-unitofmeasure
         */
        readonly unitOfMeasure?: string;
    }
}
export declare namespace CfnEntity {
    /**
     * An object that specifies a value for a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html
     */
    interface DataValueProperty {
        /**
         * A boolean value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-booleanvalue
         */
        readonly booleanValue?: boolean | cdk.IResolvable;
        /**
         * A double value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-doublevalue
         */
        readonly doubleValue?: number;
        /**
         * An expression that produces the value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-expression
         */
        readonly expression?: string;
        /**
         * An integer value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-integervalue
         */
        readonly integerValue?: number;
        /**
         * A list of multiple values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-listvalue
         */
        readonly listValue?: Array<CfnEntity.DataValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A long value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-longvalue
         */
        readonly longValue?: number;
        /**
         * An object that maps strings to multiple DataValue objects.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-mapvalue
         */
        readonly mapValue?: {
            [key: string]: (CfnEntity.DataValueProperty | cdk.IResolvable);
        } | cdk.IResolvable;
        /**
         * A value that relates a component to another component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-relationshipvalue
         */
        readonly relationshipValue?: any | cdk.IResolvable;
        /**
         * A string value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-datavalue.html#cfn-iottwinmaker-entity-datavalue-stringvalue
         */
        readonly stringValue?: string;
    }
}
export declare namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html
     */
    interface DefinitionProperty {
        /**
         * `CfnEntity.DefinitionProperty.Configuration`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-configuration
         */
        readonly configuration?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.DataType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-datatype
         */
        readonly dataType?: CfnEntity.DataTypeProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.DefaultValue`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-defaultvalue
         */
        readonly defaultValue?: CfnEntity.DataValueProperty | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsExternalId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isexternalid
         */
        readonly isExternalId?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsFinal`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isfinal
         */
        readonly isFinal?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsImported`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isimported
         */
        readonly isImported?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsInherited`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isinherited
         */
        readonly isInherited?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsRequiredInEntity`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isrequiredinentity
         */
        readonly isRequiredInEntity?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsStoredExternally`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-isstoredexternally
         */
        readonly isStoredExternally?: boolean | cdk.IResolvable;
        /**
         * `CfnEntity.DefinitionProperty.IsTimeSeries`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-definition.html#cfn-iottwinmaker-entity-definition-istimeseries
         */
        readonly isTimeSeries?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html
     */
    interface ErrorProperty {
        /**
         * `CfnEntity.ErrorProperty.Code`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-code
         */
        readonly code?: string;
        /**
         * `CfnEntity.ErrorProperty.Message`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-error.html#cfn-iottwinmaker-entity-error-message
         */
        readonly message?: string;
    }
}
export declare namespace CfnEntity {
    /**
     * An object that sets information about a property.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html
     */
    interface PropertyProperty {
        /**
         * An object that specifies information about a property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-definition
         */
        readonly definition?: any | cdk.IResolvable;
        /**
         * An object that contains information about a value for a time series property.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-property.html#cfn-iottwinmaker-entity-property-value
         */
        readonly value?: CfnEntity.DataValueProperty | cdk.IResolvable;
    }
}
export declare namespace CfnEntity {
    /**
     * The property group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html
     */
    interface PropertyGroupProperty {
        /**
         * The group type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-grouptype
         */
        readonly groupType?: string;
        /**
         * The property names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-propertygroup.html#cfn-iottwinmaker-entity-propertygroup-propertynames
         */
        readonly propertyNames?: string[];
    }
}
export declare namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html
     */
    interface RelationshipProperty {
        /**
         * `CfnEntity.RelationshipProperty.RelationshipType`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-relationshiptype
         */
        readonly relationshipType?: string;
        /**
         * `CfnEntity.RelationshipProperty.TargetComponentTypeId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationship.html#cfn-iottwinmaker-entity-relationship-targetcomponenttypeid
         */
        readonly targetComponentTypeId?: string;
    }
}
export declare namespace CfnEntity {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html
     */
    interface RelationshipValueProperty {
        /**
         * `CfnEntity.RelationshipValueProperty.TargetComponentName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetcomponentname
         */
        readonly targetComponentName?: string;
        /**
         * `CfnEntity.RelationshipValueProperty.TargetEntityId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-relationshipvalue.html#cfn-iottwinmaker-entity-relationshipvalue-targetentityid
         */
        readonly targetEntityId?: string;
    }
}
export declare namespace CfnEntity {
    /**
     * The current status of the entity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html
     */
    interface StatusProperty {
        /**
         * The error message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-error
         */
        readonly error?: any | cdk.IResolvable;
        /**
         * The current state of the entity, component, component type, or workspace.
         *
         * Valid Values: `CREATING | UPDATING | DELETING | ACTIVE | ERROR`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iottwinmaker-entity-status.html#cfn-iottwinmaker-entity-status-state
         */
        readonly state?: string;
    }
}
/**
 * Properties for defining a `CfnScene`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export interface CfnSceneProps {
    /**
     * The relative path that specifies the location of the content definition file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-contentlocation
     */
    readonly contentLocation: string;
    /**
     * The scene ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-sceneid
     */
    readonly sceneId: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-workspaceid
     */
    readonly workspaceId: string;
    /**
     * A list of capabilities that the scene uses to render.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-capabilities
     */
    readonly capabilities?: string[];
    /**
     * The description of this scene.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-description
     */
    readonly description?: string;
    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::IoTTwinMaker::Scene`
 *
 * Use the `AWS::IoTTwinMaker::Scene` resource to declare a scene.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Scene
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html
 */
export declare class CfnScene extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Scene";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScene;
    /**
     * The scene ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The date and time when the scene was created.
     * @cloudformationAttribute CreationDateTime
     */
    readonly attrCreationDateTime: string;
    /**
     * The scene the update time.
     * @cloudformationAttribute UpdateDateTime
     */
    readonly attrUpdateDateTime: string;
    /**
     * The relative path that specifies the location of the content definition file.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-contentlocation
     */
    contentLocation: string;
    /**
     * The scene ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-sceneid
     */
    sceneId: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-workspaceid
     */
    workspaceId: string;
    /**
     * A list of capabilities that the scene uses to render.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-capabilities
     */
    capabilities: string[] | undefined;
    /**
     * The description of this scene.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-description
     */
    description: string | undefined;
    /**
     * The ComponentType tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-scene.html#cfn-iottwinmaker-scene-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTTwinMaker::Scene`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSceneProps);
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
/**
 * Properties for defining a `CfnSyncJob`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export interface CfnSyncJobProps {
    /**
     * The SyncJob IAM role. This IAM role is used by the sync job to read from the syncSource, and create, update or delete the corresponding resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncrole
     */
    readonly syncRole: string;
    /**
     * The sync source.
     *
     * > Currently the only supported syncSoucre is `SITEWISE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncsource
     */
    readonly syncSource: string;
    /**
     * The ID of the workspace that contains the sync job.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-workspaceid
     */
    readonly workspaceId: string;
    /**
     * Metadata you can use to manage the SyncJob.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::IoTTwinMaker::SyncJob`
 *
 * The SyncJob.
 *
 * @cloudformationResource AWS::IoTTwinMaker::SyncJob
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html
 */
export declare class CfnSyncJob extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::SyncJob";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSyncJob;
    /**
     * The SyncJob ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The creation date and time of the SyncJob.
     * @cloudformationAttribute CreationDateTime
     */
    readonly attrCreationDateTime: string;
    /**
     * The SyncJob's state.
     * @cloudformationAttribute State
     */
    readonly attrState: string;
    /**
     * The update date and time.
     * @cloudformationAttribute UpdateDateTime
     */
    readonly attrUpdateDateTime: string;
    /**
     * The SyncJob IAM role. This IAM role is used by the sync job to read from the syncSource, and create, update or delete the corresponding resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncrole
     */
    syncRole: string;
    /**
     * The sync source.
     *
     * > Currently the only supported syncSoucre is `SITEWISE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-syncsource
     */
    syncSource: string;
    /**
     * The ID of the workspace that contains the sync job.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-workspaceid
     */
    workspaceId: string;
    /**
     * Metadata you can use to manage the SyncJob.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-syncjob.html#cfn-iottwinmaker-syncjob-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTTwinMaker::SyncJob`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSyncJobProps);
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
/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export interface CfnWorkspaceProps {
    /**
     * The ARN of the execution role associated with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-role
     */
    readonly role: string;
    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-s3location
     */
    readonly s3Location: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-workspaceid
     */
    readonly workspaceId: string;
    /**
     * The description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-description
     */
    readonly description?: string;
    /**
     * Metadata that you can use to manage the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::IoTTwinMaker::Workspace`
 *
 * Use the `AWS::IoTTwinMaker::Workspace` resource to declare a workspace.
 *
 * @cloudformationResource AWS::IoTTwinMaker::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html
 */
export declare class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTTwinMaker::Workspace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace;
    /**
     * The workspace ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The date and time the workspace was created.
     * @cloudformationAttribute CreationDateTime
     */
    readonly attrCreationDateTime: string;
    /**
     * The date and time the workspace was updated.
     * @cloudformationAttribute UpdateDateTime
     */
    readonly attrUpdateDateTime: string;
    /**
     * The ARN of the execution role associated with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-role
     */
    role: string;
    /**
     * The ARN of the S3 bucket where resources associated with the workspace are stored.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-s3location
     */
    s3Location: string;
    /**
     * The ID of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-workspaceid
     */
    workspaceId: string;
    /**
     * The description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-description
     */
    description: string | undefined;
    /**
     * Metadata that you can use to manage the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iottwinmaker-workspace.html#cfn-iottwinmaker-workspace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTTwinMaker::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps);
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
