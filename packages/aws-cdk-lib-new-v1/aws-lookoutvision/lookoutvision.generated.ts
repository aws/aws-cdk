/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::LookoutVision::Project` type creates an Amazon Lookout for Vision project.
 *
 * A project is a grouping of the resources needed to create and manage an Amazon Lookout for Vision model.
 *
 * @cloudformationResource AWS::LookoutVision::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutvision-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LookoutVision::Project";

  /**
   * Build a CfnProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name of the project.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the project.
   */
  public projectName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
    super(scope, id, {
      "type": CfnProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "projectName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.projectName = props.projectName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "projectName": this.projectName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProjectPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutvision-project.html
 */
export interface CfnProjectProps {
  /**
   * The name of the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lookoutvision-project.html#cfn-lookoutvision-project-projectname
   */
  readonly projectName: string;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("projectName", cdk.requiredValidator)(properties.projectName));
  errors.collect(cdk.propertyValidator("projectName", cdk.validateString)(properties.projectName));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "ProjectName": cdk.stringToCloudFormation(properties.projectName)
  };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
  ret.addPropertyResult("projectName", "ProjectName", (properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}