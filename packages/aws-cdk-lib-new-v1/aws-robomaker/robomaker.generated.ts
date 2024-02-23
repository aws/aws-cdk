/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * > The following resource is now deprecated.
 *
 * This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::Fleet` resource creates an AWS RoboMaker fleet. Fleets contain robots and can receive deployments.
 *
 * @cloudformationResource AWS::RoboMaker::Fleet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export class CfnFleet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::Fleet";

  /**
   * Build a CfnFleet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFleetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFleet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the fleet, such as `arn:aws:robomaker:us-west-2:123456789012:deployment-fleet/MyFleet/1539894765711` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the fleet.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of all tags added to the fleet.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFleetProps = {}) {
    super(scope, id, {
      "type": CfnFleet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::Fleet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFleet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFleetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export interface CfnFleetProps {
  /**
   * The name of the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-name
   */
  readonly name?: string;

  /**
   * The list of all tags added to the fleet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnFleetProps`
 *
 * @param properties - the TypeScript properties of a `CfnFleetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFleetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFleetProps\"");
}

// @ts-ignore TS6133
function convertCfnFleetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFleetPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFleetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFleetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFleetProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > The following resource is now deprecated.
 *
 * This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot.
 *
 * @cloudformationResource AWS::RoboMaker::Robot
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export class CfnRobot extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::Robot";

  /**
   * Build a CfnRobot from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobot {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRobotPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRobot(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the robot.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The architecture of the robot.
   */
  public architecture: string;

  /**
   * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
   */
  public fleet?: string;

  /**
   * The Greengrass group associated with the robot.
   */
  public greengrassGroupId: string;

  /**
   * The name of the robot.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to the robot.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRobotProps) {
    super(scope, id, {
      "type": CfnRobot.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "architecture", this);
    cdk.requireProperty(props, "greengrassGroupId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.architecture = props.architecture;
    this.fleet = props.fleet;
    this.greengrassGroupId = props.greengrassGroupId;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::Robot", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "architecture": this.architecture,
      "fleet": this.fleet,
      "greengrassGroupId": this.greengrassGroupId,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobot.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRobotPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRobot`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export interface CfnRobotProps {
  /**
   * The architecture of the robot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-architecture
   */
  readonly architecture: string;

  /**
   * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-fleet
   */
  readonly fleet?: string;

  /**
   * The Greengrass group associated with the robot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-greengrassgroupid
   */
  readonly greengrassGroupId: string;

  /**
   * The name of the robot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-name
   */
  readonly name?: string;

  /**
   * A map that contains tag keys and tag values that are attached to the robot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnRobotProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRobotPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("architecture", cdk.requiredValidator)(properties.architecture));
  errors.collect(cdk.propertyValidator("architecture", cdk.validateString)(properties.architecture));
  errors.collect(cdk.propertyValidator("fleet", cdk.validateString)(properties.fleet));
  errors.collect(cdk.propertyValidator("greengrassGroupId", cdk.requiredValidator)(properties.greengrassGroupId));
  errors.collect(cdk.propertyValidator("greengrassGroupId", cdk.validateString)(properties.greengrassGroupId));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRobotProps\"");
}

// @ts-ignore TS6133
function convertCfnRobotPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRobotPropsValidator(properties).assertSuccess();
  return {
    "Architecture": cdk.stringToCloudFormation(properties.architecture),
    "Fleet": cdk.stringToCloudFormation(properties.fleet),
    "GreengrassGroupId": cdk.stringToCloudFormation(properties.greengrassGroupId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRobotPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotProps>();
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined));
  ret.addPropertyResult("fleet", "Fleet", (properties.Fleet != null ? cfn_parse.FromCloudFormation.getString(properties.Fleet) : undefined));
  ret.addPropertyResult("greengrassGroupId", "GreengrassGroupId", (properties.GreengrassGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.GreengrassGroupId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot application.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplication
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export class CfnRobotApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::RobotApplication";

  /**
   * Build a CfnRobotApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRobotApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRobotApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the robot application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The current revision id.
   *
   * @cloudformationAttribute CurrentRevisionId
   */
  public readonly attrCurrentRevisionId: string;

  /**
   * The current revision id.
   */
  public currentRevisionId?: string;

  /**
   * The environment of the robot application.
   */
  public environment?: string;

  /**
   * The name of the robot application.
   */
  public name?: string;

  /**
   * The robot software suite used by the robot application.
   */
  public robotSoftwareSuite: cdk.IResolvable | CfnRobotApplication.RobotSoftwareSuiteProperty;

  /**
   * The sources of the robot application.
   */
  public sources?: Array<cdk.IResolvable | CfnRobotApplication.SourceConfigProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to the robot application.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationProps) {
    super(scope, id, {
      "type": CfnRobotApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "robotSoftwareSuite", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCurrentRevisionId = cdk.Token.asString(this.getAtt("CurrentRevisionId", cdk.ResolutionTypeHint.STRING));
    this.currentRevisionId = props.currentRevisionId;
    this.environment = props.environment;
    this.name = props.name;
    this.robotSoftwareSuite = props.robotSoftwareSuite;
    this.sources = props.sources;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::RobotApplication", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "currentRevisionId": this.currentRevisionId,
      "environment": this.environment,
      "name": this.name,
      "robotSoftwareSuite": this.robotSoftwareSuite,
      "sources": this.sources,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobotApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRobotApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnRobotApplication {
  /**
   * Information about a robot software suite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html
   */
  export interface RobotSoftwareSuiteProperty {
    /**
     * The name of the robot software suite.
     *
     * `General` is the only supported value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-name
     */
    readonly name: string;

    /**
     * The version of the robot software suite.
     *
     * Not applicable for General software suite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-version
     */
    readonly version?: string;
  }

  /**
   * Information about a source configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html
   */
  export interface SourceConfigProperty {
    /**
     * The target processor architecture for the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-architecture
     */
    readonly architecture: string;

    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The s3 object key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3key
     */
    readonly s3Key: string;
  }
}

/**
 * Properties for defining a `CfnRobotApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export interface CfnRobotApplicationProps {
  /**
   * The current revision id.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-currentrevisionid
   */
  readonly currentRevisionId?: string;

  /**
   * The environment of the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-environment
   */
  readonly environment?: string;

  /**
   * The name of the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-name
   */
  readonly name?: string;

  /**
   * The robot software suite used by the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-robotsoftwaresuite
   */
  readonly robotSoftwareSuite: cdk.IResolvable | CfnRobotApplication.RobotSoftwareSuiteProperty;

  /**
   * The sources of the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-sources
   */
  readonly sources?: Array<cdk.IResolvable | CfnRobotApplication.SourceConfigProperty> | cdk.IResolvable;

  /**
   * A map that contains tag keys and tag values that are attached to the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `RobotSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRobotApplicationRobotSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"RobotSoftwareSuiteProperty\"");
}

// @ts-ignore TS6133
function convertCfnRobotApplicationRobotSoftwareSuitePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRobotApplicationRobotSoftwareSuitePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnRobotApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRobotApplication.RobotSoftwareSuiteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplication.RobotSoftwareSuiteProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRobotApplicationSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("architecture", cdk.requiredValidator)(properties.architecture));
  errors.collect(cdk.propertyValidator("architecture", cdk.validateString)(properties.architecture));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"SourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRobotApplicationSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRobotApplicationSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "Architecture": cdk.stringToCloudFormation(properties.architecture),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnRobotApplicationSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRobotApplication.SourceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplication.SourceConfigProperty>();
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRobotApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRobotApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("currentRevisionId", cdk.validateString)(properties.currentRevisionId));
  errors.collect(cdk.propertyValidator("environment", cdk.validateString)(properties.environment));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("robotSoftwareSuite", cdk.requiredValidator)(properties.robotSoftwareSuite));
  errors.collect(cdk.propertyValidator("robotSoftwareSuite", CfnRobotApplicationRobotSoftwareSuitePropertyValidator)(properties.robotSoftwareSuite));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnRobotApplicationSourceConfigPropertyValidator))(properties.sources));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRobotApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnRobotApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRobotApplicationPropsValidator(properties).assertSuccess();
  return {
    "CurrentRevisionId": cdk.stringToCloudFormation(properties.currentRevisionId),
    "Environment": cdk.stringToCloudFormation(properties.environment),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RobotSoftwareSuite": convertCfnRobotApplicationRobotSoftwareSuitePropertyToCloudFormation(properties.robotSoftwareSuite),
    "Sources": cdk.listMapper(convertCfnRobotApplicationSourceConfigPropertyToCloudFormation)(properties.sources),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRobotApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplicationProps>();
  ret.addPropertyResult("currentRevisionId", "CurrentRevisionId", (properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getString(properties.Environment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("robotSoftwareSuite", "RobotSoftwareSuite", (properties.RobotSoftwareSuite != null ? CfnRobotApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties.RobotSoftwareSuite) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnRobotApplicationSourceConfigPropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RoboMaker::RobotApplicationVersion` resource creates an AWS RoboMaker robot version.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplicationVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export class CfnRobotApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::RobotApplicationVersion";

  /**
   * Build a CfnRobotApplicationVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplicationVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRobotApplicationVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRobotApplicationVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The robot application version.
   *
   * @cloudformationAttribute ApplicationVersion
   */
  public readonly attrApplicationVersion: string;

  /**
   * The Amazon Resource Name (ARN) of the robot application version.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The application information for the robot application.
   */
  public application: string;

  /**
   * The current revision id for the robot application.
   */
  public currentRevisionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationVersionProps) {
    super(scope, id, {
      "type": CfnRobotApplicationVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "application", this);

    this.attrApplicationVersion = cdk.Token.asString(this.getAtt("ApplicationVersion", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.application = props.application;
    this.currentRevisionId = props.currentRevisionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "application": this.application,
      "currentRevisionId": this.currentRevisionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRobotApplicationVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRobotApplicationVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRobotApplicationVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export interface CfnRobotApplicationVersionProps {
  /**
   * The application information for the robot application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-application
   */
  readonly application: string;

  /**
   * The current revision id for the robot application.
   *
   * If you provide a value and it matches the latest revision ID, a new version will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-currentrevisionid
   */
  readonly currentRevisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRobotApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnRobotApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRobotApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("application", cdk.requiredValidator)(properties.application));
  errors.collect(cdk.propertyValidator("application", cdk.validateString)(properties.application));
  errors.collect(cdk.propertyValidator("currentRevisionId", cdk.validateString)(properties.currentRevisionId));
  return errors.wrap("supplied properties not correct for \"CfnRobotApplicationVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnRobotApplicationVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRobotApplicationVersionPropsValidator(properties).assertSuccess();
  return {
    "Application": cdk.stringToCloudFormation(properties.application),
    "CurrentRevisionId": cdk.stringToCloudFormation(properties.currentRevisionId)
  };
}

// @ts-ignore TS6133
function CfnRobotApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRobotApplicationVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRobotApplicationVersionProps>();
  ret.addPropertyResult("application", "Application", (properties.Application != null ? cfn_parse.FromCloudFormation.getString(properties.Application) : undefined));
  ret.addPropertyResult("currentRevisionId", "CurrentRevisionId", (properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RoboMaker::SimulationApplication` resource creates an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplication
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export class CfnSimulationApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::SimulationApplication";

  /**
   * Build a CfnSimulationApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSimulationApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSimulationApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the simulation application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The current revision id.
   *
   * @cloudformationAttribute CurrentRevisionId
   */
  public readonly attrCurrentRevisionId: string;

  /**
   * The current revision id.
   */
  public currentRevisionId?: string;

  /**
   * The environment of the simulation application.
   */
  public environment?: string;

  /**
   * The name of the simulation application.
   */
  public name?: string;

  /**
   * The rendering engine for the simulation application.
   */
  public renderingEngine?: cdk.IResolvable | CfnSimulationApplication.RenderingEngineProperty;

  /**
   * The robot software suite used by the simulation application.
   */
  public robotSoftwareSuite: cdk.IResolvable | CfnSimulationApplication.RobotSoftwareSuiteProperty;

  /**
   * The simulation software suite used by the simulation application.
   */
  public simulationSoftwareSuite: cdk.IResolvable | CfnSimulationApplication.SimulationSoftwareSuiteProperty;

  /**
   * The sources of the simulation application.
   */
  public sources?: Array<cdk.IResolvable | CfnSimulationApplication.SourceConfigProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to the simulation application.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationProps) {
    super(scope, id, {
      "type": CfnSimulationApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "robotSoftwareSuite", this);
    cdk.requireProperty(props, "simulationSoftwareSuite", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCurrentRevisionId = cdk.Token.asString(this.getAtt("CurrentRevisionId", cdk.ResolutionTypeHint.STRING));
    this.currentRevisionId = props.currentRevisionId;
    this.environment = props.environment;
    this.name = props.name;
    this.renderingEngine = props.renderingEngine;
    this.robotSoftwareSuite = props.robotSoftwareSuite;
    this.simulationSoftwareSuite = props.simulationSoftwareSuite;
    this.sources = props.sources;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::RoboMaker::SimulationApplication", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "currentRevisionId": this.currentRevisionId,
      "environment": this.environment,
      "name": this.name,
      "renderingEngine": this.renderingEngine,
      "robotSoftwareSuite": this.robotSoftwareSuite,
      "simulationSoftwareSuite": this.simulationSoftwareSuite,
      "sources": this.sources,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimulationApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSimulationApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnSimulationApplication {
  /**
   * Information about a rendering engine.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html
   */
  export interface RenderingEngineProperty {
    /**
     * The name of the rendering engine.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-name
     */
    readonly name: string;

    /**
     * The version of the rendering engine.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-version
     */
    readonly version: string;
  }

  /**
   * Information about a simulation software suite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html
   */
  export interface SimulationSoftwareSuiteProperty {
    /**
     * The name of the simulation software suite.
     *
     * `SimulationRuntime` is the only supported value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-name
     */
    readonly name: string;

    /**
     * The version of the simulation software suite.
     *
     * Not applicable for `SimulationRuntime` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-version
     */
    readonly version?: string;
  }

  /**
   * Information about a robot software suite.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html
   */
  export interface RobotSoftwareSuiteProperty {
    /**
     * The name of the robot software suite.
     *
     * `General` is the only supported value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-name
     */
    readonly name: string;

    /**
     * The version of the robot software suite.
     *
     * Not applicable for General software suite.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-version
     */
    readonly version?: string;
  }

  /**
   * Information about a source configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html
   */
  export interface SourceConfigProperty {
    /**
     * The target processor architecture for the application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-architecture
     */
    readonly architecture: string;

    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The s3 object key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3key
     */
    readonly s3Key: string;
  }
}

/**
 * Properties for defining a `CfnSimulationApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export interface CfnSimulationApplicationProps {
  /**
   * The current revision id.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-currentrevisionid
   */
  readonly currentRevisionId?: string;

  /**
   * The environment of the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-environment
   */
  readonly environment?: string;

  /**
   * The name of the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-name
   */
  readonly name?: string;

  /**
   * The rendering engine for the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-renderingengine
   */
  readonly renderingEngine?: cdk.IResolvable | CfnSimulationApplication.RenderingEngineProperty;

  /**
   * The robot software suite used by the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-robotsoftwaresuite
   */
  readonly robotSoftwareSuite: cdk.IResolvable | CfnSimulationApplication.RobotSoftwareSuiteProperty;

  /**
   * The simulation software suite used by the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite
   */
  readonly simulationSoftwareSuite: cdk.IResolvable | CfnSimulationApplication.SimulationSoftwareSuiteProperty;

  /**
   * The sources of the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-sources
   */
  readonly sources?: Array<cdk.IResolvable | CfnSimulationApplication.SourceConfigProperty> | cdk.IResolvable;

  /**
   * A map that contains tag keys and tag values that are attached to the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `RenderingEngineProperty`
 *
 * @param properties - the TypeScript properties of a `RenderingEngineProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationRenderingEnginePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"RenderingEngineProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationRenderingEnginePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationRenderingEnginePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationRenderingEnginePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimulationApplication.RenderingEngineProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.RenderingEngineProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SimulationSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `SimulationSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationSimulationSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"SimulationSoftwareSuiteProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationSimulationSoftwareSuitePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationSimulationSoftwareSuitePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationSimulationSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimulationApplication.SimulationSoftwareSuiteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.SimulationSoftwareSuiteProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RobotSoftwareSuiteProperty`
 *
 * @param properties - the TypeScript properties of a `RobotSoftwareSuiteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationRobotSoftwareSuitePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"RobotSoftwareSuiteProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationRobotSoftwareSuitePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationRobotSoftwareSuitePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimulationApplication.RobotSoftwareSuiteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.RobotSoftwareSuiteProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("architecture", cdk.requiredValidator)(properties.architecture));
  errors.collect(cdk.propertyValidator("architecture", cdk.validateString)(properties.architecture));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"SourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "Architecture": cdk.stringToCloudFormation(properties.architecture),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationSourceConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimulationApplication.SourceConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplication.SourceConfigProperty>();
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSimulationApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("currentRevisionId", cdk.validateString)(properties.currentRevisionId));
  errors.collect(cdk.propertyValidator("environment", cdk.validateString)(properties.environment));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("renderingEngine", CfnSimulationApplicationRenderingEnginePropertyValidator)(properties.renderingEngine));
  errors.collect(cdk.propertyValidator("robotSoftwareSuite", cdk.requiredValidator)(properties.robotSoftwareSuite));
  errors.collect(cdk.propertyValidator("robotSoftwareSuite", CfnSimulationApplicationRobotSoftwareSuitePropertyValidator)(properties.robotSoftwareSuite));
  errors.collect(cdk.propertyValidator("simulationSoftwareSuite", cdk.requiredValidator)(properties.simulationSoftwareSuite));
  errors.collect(cdk.propertyValidator("simulationSoftwareSuite", CfnSimulationApplicationSimulationSoftwareSuitePropertyValidator)(properties.simulationSoftwareSuite));
  errors.collect(cdk.propertyValidator("sources", cdk.listValidator(CfnSimulationApplicationSourceConfigPropertyValidator))(properties.sources));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSimulationApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationPropsValidator(properties).assertSuccess();
  return {
    "CurrentRevisionId": cdk.stringToCloudFormation(properties.currentRevisionId),
    "Environment": cdk.stringToCloudFormation(properties.environment),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RenderingEngine": convertCfnSimulationApplicationRenderingEnginePropertyToCloudFormation(properties.renderingEngine),
    "RobotSoftwareSuite": convertCfnSimulationApplicationRobotSoftwareSuitePropertyToCloudFormation(properties.robotSoftwareSuite),
    "SimulationSoftwareSuite": convertCfnSimulationApplicationSimulationSoftwareSuitePropertyToCloudFormation(properties.simulationSoftwareSuite),
    "Sources": cdk.listMapper(convertCfnSimulationApplicationSourceConfigPropertyToCloudFormation)(properties.sources),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplicationProps>();
  ret.addPropertyResult("currentRevisionId", "CurrentRevisionId", (properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getString(properties.Environment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("renderingEngine", "RenderingEngine", (properties.RenderingEngine != null ? CfnSimulationApplicationRenderingEnginePropertyFromCloudFormation(properties.RenderingEngine) : undefined));
  ret.addPropertyResult("robotSoftwareSuite", "RobotSoftwareSuite", (properties.RobotSoftwareSuite != null ? CfnSimulationApplicationRobotSoftwareSuitePropertyFromCloudFormation(properties.RobotSoftwareSuite) : undefined));
  ret.addPropertyResult("simulationSoftwareSuite", "SimulationSoftwareSuite", (properties.SimulationSoftwareSuite != null ? CfnSimulationApplicationSimulationSoftwareSuitePropertyFromCloudFormation(properties.SimulationSoftwareSuite) : undefined));
  ret.addPropertyResult("sources", "Sources", (properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnSimulationApplicationSourceConfigPropertyFromCloudFormation)(properties.Sources) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::RoboMaker::SimulationApplicationVersion` resource creates a version of an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplicationVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export class CfnSimulationApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RoboMaker::SimulationApplicationVersion";

  /**
   * Build a CfnSimulationApplicationVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplicationVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSimulationApplicationVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSimulationApplicationVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The simulation application version.
   *
   * @cloudformationAttribute ApplicationVersion
   */
  public readonly attrApplicationVersion: string;

  /**
   * The Amazon Resource Name (ARN) of the simulation application version.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The application information for the simulation application.
   */
  public application: string;

  /**
   * The current revision id for the simulation application.
   */
  public currentRevisionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationVersionProps) {
    super(scope, id, {
      "type": CfnSimulationApplicationVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "application", this);

    this.attrApplicationVersion = cdk.Token.asString(this.getAtt("ApplicationVersion", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.application = props.application;
    this.currentRevisionId = props.currentRevisionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "application": this.application,
      "currentRevisionId": this.currentRevisionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimulationApplicationVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSimulationApplicationVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSimulationApplicationVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export interface CfnSimulationApplicationVersionProps {
  /**
   * The application information for the simulation application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-application
   */
  readonly application: string;

  /**
   * The current revision id for the simulation application.
   *
   * If you provide a value and it matches the latest revision ID, a new version will be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-currentrevisionid
   */
  readonly currentRevisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSimulationApplicationVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimulationApplicationVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimulationApplicationVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("application", cdk.requiredValidator)(properties.application));
  errors.collect(cdk.propertyValidator("application", cdk.validateString)(properties.application));
  errors.collect(cdk.propertyValidator("currentRevisionId", cdk.validateString)(properties.currentRevisionId));
  return errors.wrap("supplied properties not correct for \"CfnSimulationApplicationVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnSimulationApplicationVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimulationApplicationVersionPropsValidator(properties).assertSuccess();
  return {
    "Application": cdk.stringToCloudFormation(properties.application),
    "CurrentRevisionId": cdk.stringToCloudFormation(properties.currentRevisionId)
  };
}

// @ts-ignore TS6133
function CfnSimulationApplicationVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimulationApplicationVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimulationApplicationVersionProps>();
  ret.addPropertyResult("application", "Application", (properties.Application != null ? cfn_parse.FromCloudFormation.getString(properties.Application) : undefined));
  ret.addPropertyResult("currentRevisionId", "CurrentRevisionId", (properties.CurrentRevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentRevisionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}