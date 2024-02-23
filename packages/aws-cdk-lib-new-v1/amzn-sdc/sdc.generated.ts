/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Resource Type definition for AMZN::SDC::Deployment.
 *
 * @cloudformationResource AMZN::SDC::Deployment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AMZN::SDC::Deployment";

  /**
   * Build a CfnDeployment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeployment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeployment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  public configName: string;

  public dimension: string;

  public pipelineId?: string;

  public s3Bucket: string;

  public s3Key: string;

  public stage: string;

  public targetRegionOverride?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentProps) {
    super(scope, id, {
      "type": CfnDeployment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configName", this);
    cdk.requireProperty(props, "dimension", this);
    cdk.requireProperty(props, "s3Bucket", this);
    cdk.requireProperty(props, "s3Key", this);
    cdk.requireProperty(props, "stage", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.configName = props.configName;
    this.dimension = props.dimension;
    this.pipelineId = props.pipelineId;
    this.s3Bucket = props.s3Bucket;
    this.s3Key = props.s3Key;
    this.stage = props.stage;
    this.targetRegionOverride = props.targetRegionOverride;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configName": this.configName,
      "dimension": this.dimension,
      "pipelineId": this.pipelineId,
      "s3Bucket": this.s3Bucket,
      "s3Key": this.s3Key,
      "stage": this.stage,
      "targetRegionOverride": this.targetRegionOverride
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeployment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDeployment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html
 */
export interface CfnDeploymentProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-configname
   */
  readonly configName: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-dimension
   */
  readonly dimension: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-pipelineid
   */
  readonly pipelineId?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-s3bucket
   */
  readonly s3Bucket: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-s3key
   */
  readonly s3Key: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-stage
   */
  readonly stage: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sdc-deployment.html#cfn-sdc-deployment-targetregionoverride
   */
  readonly targetRegionOverride?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configName", cdk.requiredValidator)(properties.configName));
  errors.collect(cdk.propertyValidator("configName", cdk.validateString)(properties.configName));
  errors.collect(cdk.propertyValidator("dimension", cdk.requiredValidator)(properties.dimension));
  errors.collect(cdk.propertyValidator("dimension", cdk.validateString)(properties.dimension));
  errors.collect(cdk.propertyValidator("pipelineId", cdk.validateString)(properties.pipelineId));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  errors.collect(cdk.propertyValidator("stage", cdk.requiredValidator)(properties.stage));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  errors.collect(cdk.propertyValidator("targetRegionOverride", cdk.validateString)(properties.targetRegionOverride));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentPropsValidator(properties).assertSuccess();
  return {
    "ConfigName": cdk.stringToCloudFormation(properties.configName),
    "Dimension": cdk.stringToCloudFormation(properties.dimension),
    "PipelineId": cdk.stringToCloudFormation(properties.pipelineId),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key),
    "Stage": cdk.stringToCloudFormation(properties.stage),
    "TargetRegionOverride": cdk.stringToCloudFormation(properties.targetRegionOverride)
  };
}

// @ts-ignore TS6133
function CfnDeploymentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentProps>();
  ret.addPropertyResult("configName", "ConfigName", (properties.ConfigName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigName) : undefined));
  ret.addPropertyResult("dimension", "Dimension", (properties.Dimension != null ? cfn_parse.FromCloudFormation.getString(properties.Dimension) : undefined));
  ret.addPropertyResult("pipelineId", "PipelineId", (properties.PipelineId != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineId) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addPropertyResult("targetRegionOverride", "TargetRegionOverride", (properties.TargetRegionOverride != null ? cfn_parse.FromCloudFormation.getString(properties.TargetRegionOverride) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}