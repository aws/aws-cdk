/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Create a data store.
 *
 * @cloudformationResource AWS::HealthImaging::Datastore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthimaging-datastore.html
 */
export class CfnDatastore extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::HealthImaging::Datastore";

  /**
   * Build a CfnDatastore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatastore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatastorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatastore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The timestamp when the data store was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The Amazon Resource Name (ARN) for the data store.
   *
   * @cloudformationAttribute DatastoreArn
   */
  public readonly attrDatastoreArn: string;

  /**
   * The data store identifier.
   *
   * @cloudformationAttribute DatastoreId
   */
  public readonly attrDatastoreId: string;

  /**
   * The data store status.
   *
   * @cloudformationAttribute DatastoreStatus
   */
  public readonly attrDatastoreStatus: string;

  /**
   * The timestamp when the data store was last updated.
   *
   * @cloudformationAttribute UpdatedAt
   */
  public readonly attrUpdatedAt: string;

  /**
   * The data store name.
   */
  public datastoreName?: string;

  /**
   * The Amazon Resource Name (ARN) assigned to the Key Management Service (KMS) key for accessing encrypted data.
   */
  public kmsKeyArn?: string;

  /**
   * The tags provided when creating a data store.
   */
  public tags?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatastoreProps = {}) {
    super(scope, id, {
      "type": CfnDatastore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreArn = cdk.Token.asString(this.getAtt("DatastoreArn", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreId = cdk.Token.asString(this.getAtt("DatastoreId", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreStatus = cdk.Token.asString(this.getAtt("DatastoreStatus", cdk.ResolutionTypeHint.STRING));
    this.attrUpdatedAt = cdk.Token.asString(this.getAtt("UpdatedAt", cdk.ResolutionTypeHint.STRING));
    this.datastoreName = props.datastoreName;
    this.kmsKeyArn = props.kmsKeyArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datastoreName": this.datastoreName,
      "kmsKeyArn": this.kmsKeyArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatastore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatastorePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDatastore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthimaging-datastore.html
 */
export interface CfnDatastoreProps {
  /**
   * The data store name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthimaging-datastore.html#cfn-healthimaging-datastore-datastorename
   */
  readonly datastoreName?: string;

  /**
   * The Amazon Resource Name (ARN) assigned to the Key Management Service (KMS) key for accessing encrypted data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthimaging-datastore.html#cfn-healthimaging-datastore-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The tags provided when creating a data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthimaging-datastore.html#cfn-healthimaging-datastore-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatastoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datastoreName", cdk.validateString)(properties.datastoreName));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDatastoreProps\"");
}

// @ts-ignore TS6133
function convertCfnDatastorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastorePropsValidator(properties).assertSuccess();
  return {
    "DatastoreName": cdk.stringToCloudFormation(properties.datastoreName),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDatastorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastoreProps>();
  ret.addPropertyResult("datastoreName", "DatastoreName", (properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}