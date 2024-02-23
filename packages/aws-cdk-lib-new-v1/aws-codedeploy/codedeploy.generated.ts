/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::CodeDeploy::Application` resource creates an AWS CodeDeploy application.
 *
 * In CodeDeploy , an application is a name that functions as a container to ensure that the correct combination of revision, deployment configuration, and deployment group are referenced during a deployment. You can use the `AWS::CodeDeploy::DeploymentGroup` resource to associate the application with a CodeDeploy deployment group. For more information, see [CodeDeploy Deployments](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-steps.html) in the *AWS CodeDeploy User Guide* .
 *
 * @cloudformationResource AWS::CodeDeploy::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeDeploy::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A name for the application.
   */
  public applicationName?: string;

  /**
   * The compute platform that CodeDeploy deploys the application to.
   */
  public computePlatform?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to CodeDeploy applications to help you organize and categorize them.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps = {}) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.applicationName = props.applicationName;
    this.computePlatform = props.computePlatform;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeDeploy::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "computePlatform": this.computePlatform,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html
 */
export interface CfnApplicationProps {
  /**
   * A name for the application.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the application name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > Updates to `ApplicationName` are not supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html#cfn-codedeploy-application-applicationname
   */
  readonly applicationName?: string;

  /**
   * The compute platform that CodeDeploy deploys the application to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html#cfn-codedeploy-application-computeplatform
   */
  readonly computePlatform?: string;

  /**
   * The metadata that you apply to CodeDeploy applications to help you organize and categorize them.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-application.html#cfn-codedeploy-application-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("computePlatform", cdk.validateString)(properties.computePlatform));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "ComputePlatform": cdk.stringToCloudFormation(properties.computePlatform),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("computePlatform", "ComputePlatform", (properties.ComputePlatform != null ? cfn_parse.FromCloudFormation.getString(properties.ComputePlatform) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CodeDeploy::DeploymentConfig` resource creates a set of deployment rules, deployment success conditions, and deployment failure conditions that AWS CodeDeploy uses during a deployment.
 *
 * The deployment configuration specifies the number or percentage of instances that must remain available at any time during a deployment.
 *
 * @cloudformationResource AWS::CodeDeploy::DeploymentConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html
 */
export class CfnDeploymentConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeDeploy::DeploymentConfig";

  /**
   * Build a CfnDeploymentConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeploymentConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeploymentConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The destination platform type for the deployment ( `Lambda` , `Server` , or `ECS` ).
   */
  public computePlatform?: string;

  /**
   * A name for the deployment configuration.
   */
  public deploymentConfigName?: string;

  /**
   * The minimum number of healthy instances that should be available at any time during the deployment.
   */
  public minimumHealthyHosts?: cdk.IResolvable | CfnDeploymentConfig.MinimumHealthyHostsProperty;

  /**
   * The configuration that specifies how the deployment traffic is routed.
   */
  public trafficRoutingConfig?: cdk.IResolvable | CfnDeploymentConfig.TrafficRoutingConfigProperty;

  /**
   * Configure the `ZonalConfig` object if you want AWS CodeDeploy to deploy your application to one [Availability Zone](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones) at a time, within an AWS Region.
   */
  public zonalConfig?: cdk.IResolvable | CfnDeploymentConfig.ZonalConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentConfigProps = {}) {
    super(scope, id, {
      "type": CfnDeploymentConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.computePlatform = props.computePlatform;
    this.deploymentConfigName = props.deploymentConfigName;
    this.minimumHealthyHosts = props.minimumHealthyHosts;
    this.trafficRoutingConfig = props.trafficRoutingConfig;
    this.zonalConfig = props.zonalConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "computePlatform": this.computePlatform,
      "deploymentConfigName": this.deploymentConfigName,
      "minimumHealthyHosts": this.minimumHealthyHosts,
      "trafficRoutingConfig": this.trafficRoutingConfig,
      "zonalConfig": this.zonalConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeploymentConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentConfigPropsToCloudFormation(props);
  }
}

export namespace CfnDeploymentConfig {
  /**
   * The configuration that specifies how traffic is shifted from one version of a Lambda function to another version during an AWS Lambda deployment, or from one Amazon ECS task set to another during an Amazon ECS deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-trafficroutingconfig.html
   */
  export interface TrafficRoutingConfigProperty {
    /**
     * A configuration that shifts traffic from one version of a Lambda function or ECS task set to another in two increments.
     *
     * The original and target Lambda function versions or ECS task sets are specified in the deployment's AppSpec file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-trafficroutingconfig.html#cfn-codedeploy-deploymentconfig-trafficroutingconfig-timebasedcanary
     */
    readonly timeBasedCanary?: cdk.IResolvable | CfnDeploymentConfig.TimeBasedCanaryProperty;

    /**
     * A configuration that shifts traffic from one version of a Lambda function or Amazon ECS task set to another in equal increments, with an equal number of minutes between each increment.
     *
     * The original and target Lambda function versions or Amazon ECS task sets are specified in the deployment's AppSpec file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-trafficroutingconfig.html#cfn-codedeploy-deploymentconfig-trafficroutingconfig-timebasedlinear
     */
    readonly timeBasedLinear?: cdk.IResolvable | CfnDeploymentConfig.TimeBasedLinearProperty;

    /**
     * The type of traffic shifting ( `TimeBasedCanary` or `TimeBasedLinear` ) used by a deployment configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-trafficroutingconfig.html#cfn-codedeploy-deploymentconfig-trafficroutingconfig-type
     */
    readonly type: string;
  }

  /**
   * A configuration that shifts traffic from one version of a Lambda function or ECS task set to another in equal increments, with an equal number of minutes between each increment.
   *
   * The original and target Lambda function versions or ECS task sets are specified in the deployment's AppSpec file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedlinear.html
   */
  export interface TimeBasedLinearProperty {
    /**
     * The number of minutes between each incremental traffic shift of a `TimeBasedLinear` deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedlinear.html#cfn-codedeploy-deploymentconfig-timebasedlinear-linearinterval
     */
    readonly linearInterval: number;

    /**
     * The percentage of traffic that is shifted at the start of each increment of a `TimeBasedLinear` deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedlinear.html#cfn-codedeploy-deploymentconfig-timebasedlinear-linearpercentage
     */
    readonly linearPercentage: number;
  }

  /**
   * A configuration that shifts traffic from one version of a Lambda function or Amazon ECS task set to another in two increments.
   *
   * The original and target Lambda function versions or ECS task sets are specified in the deployment's AppSpec file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedcanary.html
   */
  export interface TimeBasedCanaryProperty {
    /**
     * The number of minutes between the first and second traffic shifts of a `TimeBasedCanary` deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedcanary.html#cfn-codedeploy-deploymentconfig-timebasedcanary-canaryinterval
     */
    readonly canaryInterval: number;

    /**
     * The percentage of traffic to shift in the first increment of a `TimeBasedCanary` deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-timebasedcanary.html#cfn-codedeploy-deploymentconfig-timebasedcanary-canarypercentage
     */
    readonly canaryPercentage: number;
  }

  /**
   * `MinimumHealthyHosts` is a property of the [DeploymentConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html) resource that defines how many instances must remain healthy during an AWS CodeDeploy deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhosts.html
   */
  export interface MinimumHealthyHostsProperty {
    /**
     * The minimum healthy instance type:.
     *
     * - HOST_COUNT: The minimum number of healthy instance as an absolute value.
     * - FLEET_PERCENT: The minimum number of healthy instance as a percentage of the total number of instance in the deployment.
     *
     * In an example of nine instance, if a HOST_COUNT of six is specified, deploy to up to three instances at a time. The deployment is successful if six or more instances are deployed to successfully. Otherwise, the deployment fails. If a FLEET_PERCENT of 40 is specified, deploy to up to five instance at a time. The deployment is successful if four or more instance are deployed to successfully. Otherwise, the deployment fails.
     *
     * > In a call to `GetDeploymentConfig` , CodeDeployDefault.OneAtATime returns a minimum healthy instance type of MOST_CONCURRENCY and a value of 1. This means a deployment to only one instance at a time. (You cannot set the type to MOST_CONCURRENCY, only to HOST_COUNT or FLEET_PERCENT.) In addition, with CodeDeployDefault.OneAtATime, AWS CodeDeploy attempts to ensure that all instances but one are kept in a healthy state during the deployment. Although this allows one instance at a time to be taken offline for a new deployment, it also means that if the deployment to the last instance fails, the overall deployment is still successful.
     *
     * For more information, see [AWS CodeDeploy Instance Health](https://docs.aws.amazon.com//codedeploy/latest/userguide/instances-health.html) in the *AWS CodeDeploy User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhosts.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts-type
     */
    readonly type: string;

    /**
     * The minimum healthy instance value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhosts.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts-value
     */
    readonly value: number;
  }

  /**
   * Configure the `ZonalConfig` object if you want AWS CodeDeploy to deploy your application to one [Availability Zone](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones) at a time, within an AWS Region. By deploying to one Availability Zone at a time, you can expose your deployment to a progressively larger audience as confidence in the deployment's performance and viability grows. If you don't configure the `ZonalConfig` object, CodeDeploy deploys your application to a random selection of hosts across a Region.
   *
   * For more information about the zonal configuration feature, see [zonal configuration](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config) in the *CodeDeploy User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-zonalconfig.html
   */
  export interface ZonalConfigProperty {
    /**
     * The period of time, in seconds, that CodeDeploy must wait after completing a deployment to the *first* Availability Zone.
     *
     * CodeDeploy will wait this amount of time before starting a deployment to the second Availability Zone. You might set this option if you want to allow extra bake time for the first Availability Zone. If you don't specify a value for `firstZoneMonitorDurationInSeconds` , then CodeDeploy uses the `monitorDurationInSeconds` value for the first Availability Zone.
     *
     * For more information about the zonal configuration feature, see [zonal configuration](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config) in the *CodeDeploy User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-zonalconfig.html#cfn-codedeploy-deploymentconfig-zonalconfig-firstzonemonitordurationinseconds
     */
    readonly firstZoneMonitorDurationInSeconds?: number;

    /**
     * The number or percentage of instances that must remain available per Availability Zone during a deployment.
     *
     * This option works in conjunction with the `MinimumHealthyHosts` option. For more information, see [About the minimum number of healthy hosts per Availability Zone](https://docs.aws.amazon.com//codedeploy/latest/userguide/instances-health.html#minimum-healthy-hosts-az) in the *CodeDeploy User Guide* .
     *
     * If you don't specify the `minimumHealthyHostsPerZone` option, then CodeDeploy uses a default value of `0` percent.
     *
     * For more information about the zonal configuration feature, see [zonal configuration](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config) in the *CodeDeploy User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-zonalconfig.html#cfn-codedeploy-deploymentconfig-zonalconfig-minimumhealthyhostsperzone
     */
    readonly minimumHealthyHostsPerZone?: cdk.IResolvable | CfnDeploymentConfig.MinimumHealthyHostsPerZoneProperty;

    /**
     * The period of time, in seconds, that CodeDeploy must wait after completing a deployment to an Availability Zone.
     *
     * CodeDeploy will wait this amount of time before starting a deployment to the next Availability Zone. Consider adding a monitor duration to give the deployment some time to prove itself (or 'bake') in one Availability Zone before it is released in the next zone. If you don't specify a `monitorDurationInSeconds` , CodeDeploy starts deploying to the next Availability Zone immediately.
     *
     * For more information about the zonal configuration feature, see [zonal configuration](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config) in the *CodeDeploy User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-zonalconfig.html#cfn-codedeploy-deploymentconfig-zonalconfig-monitordurationinseconds
     */
    readonly monitorDurationInSeconds?: number;
  }

  /**
   * Information about the minimum number of healthy instances per Availability Zone.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhostsperzone.html
   */
  export interface MinimumHealthyHostsPerZoneProperty {
    /**
     * The `type` associated with the `MinimumHealthyHostsPerZone` option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhostsperzone.html#cfn-codedeploy-deploymentconfig-minimumhealthyhostsperzone-type
     */
    readonly type: string;

    /**
     * The `value` associated with the `MinimumHealthyHostsPerZone` option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentconfig-minimumhealthyhostsperzone.html#cfn-codedeploy-deploymentconfig-minimumhealthyhostsperzone-value
     */
    readonly value: number;
  }
}

/**
 * Properties for defining a `CfnDeploymentConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html
 */
export interface CfnDeploymentConfigProps {
  /**
   * The destination platform type for the deployment ( `Lambda` , `Server` , or `ECS` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-computeplatform
   */
  readonly computePlatform?: string;

  /**
   * A name for the deployment configuration.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the deployment configuration name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-deploymentconfigname
   */
  readonly deploymentConfigName?: string;

  /**
   * The minimum number of healthy instances that should be available at any time during the deployment.
   *
   * There are two parameters expected in the input: type and value.
   *
   * The type parameter takes either of the following values:
   *
   * - HOST_COUNT: The value parameter represents the minimum number of healthy instances as an absolute value.
   * - FLEET_PERCENT: The value parameter represents the minimum number of healthy instances as a percentage of the total number of instances in the deployment. If you specify FLEET_PERCENT, at the start of the deployment, AWS CodeDeploy converts the percentage to the equivalent number of instance and rounds up fractional instances.
   *
   * The value parameter takes an integer.
   *
   * For example, to set a minimum of 95% healthy instance, specify a type of FLEET_PERCENT and a value of 95.
   *
   * For more information about instance health, see [CodeDeploy Instance Health](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-health.html) in the AWS CodeDeploy User Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts
   */
  readonly minimumHealthyHosts?: cdk.IResolvable | CfnDeploymentConfig.MinimumHealthyHostsProperty;

  /**
   * The configuration that specifies how the deployment traffic is routed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-trafficroutingconfig
   */
  readonly trafficRoutingConfig?: cdk.IResolvable | CfnDeploymentConfig.TrafficRoutingConfigProperty;

  /**
   * Configure the `ZonalConfig` object if you want AWS CodeDeploy to deploy your application to one [Availability Zone](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones) at a time, within an AWS Region.
   *
   * For more information about the zonal configuration feature, see [zonal configuration](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config) in the *CodeDeploy User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-zonalconfig
   */
  readonly zonalConfig?: cdk.IResolvable | CfnDeploymentConfig.ZonalConfigProperty;
}

/**
 * Determine whether the given properties match those of a `TimeBasedLinearProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedLinearProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigTimeBasedLinearPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("linearInterval", cdk.requiredValidator)(properties.linearInterval));
  errors.collect(cdk.propertyValidator("linearInterval", cdk.validateNumber)(properties.linearInterval));
  errors.collect(cdk.propertyValidator("linearPercentage", cdk.requiredValidator)(properties.linearPercentage));
  errors.collect(cdk.propertyValidator("linearPercentage", cdk.validateNumber)(properties.linearPercentage));
  return errors.wrap("supplied properties not correct for \"TimeBasedLinearProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigTimeBasedLinearPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigTimeBasedLinearPropertyValidator(properties).assertSuccess();
  return {
    "LinearInterval": cdk.numberToCloudFormation(properties.linearInterval),
    "LinearPercentage": cdk.numberToCloudFormation(properties.linearPercentage)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigTimeBasedLinearPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.TimeBasedLinearProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.TimeBasedLinearProperty>();
  ret.addPropertyResult("linearInterval", "LinearInterval", (properties.LinearInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.LinearInterval) : undefined));
  ret.addPropertyResult("linearPercentage", "LinearPercentage", (properties.LinearPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.LinearPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimeBasedCanaryProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedCanaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigTimeBasedCanaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("canaryInterval", cdk.requiredValidator)(properties.canaryInterval));
  errors.collect(cdk.propertyValidator("canaryInterval", cdk.validateNumber)(properties.canaryInterval));
  errors.collect(cdk.propertyValidator("canaryPercentage", cdk.requiredValidator)(properties.canaryPercentage));
  errors.collect(cdk.propertyValidator("canaryPercentage", cdk.validateNumber)(properties.canaryPercentage));
  return errors.wrap("supplied properties not correct for \"TimeBasedCanaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigTimeBasedCanaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigTimeBasedCanaryPropertyValidator(properties).assertSuccess();
  return {
    "CanaryInterval": cdk.numberToCloudFormation(properties.canaryInterval),
    "CanaryPercentage": cdk.numberToCloudFormation(properties.canaryPercentage)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigTimeBasedCanaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.TimeBasedCanaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.TimeBasedCanaryProperty>();
  ret.addPropertyResult("canaryInterval", "CanaryInterval", (properties.CanaryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CanaryInterval) : undefined));
  ret.addPropertyResult("canaryPercentage", "CanaryPercentage", (properties.CanaryPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.CanaryPercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrafficRoutingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TrafficRoutingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigTrafficRoutingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timeBasedCanary", CfnDeploymentConfigTimeBasedCanaryPropertyValidator)(properties.timeBasedCanary));
  errors.collect(cdk.propertyValidator("timeBasedLinear", CfnDeploymentConfigTimeBasedLinearPropertyValidator)(properties.timeBasedLinear));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"TrafficRoutingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigTrafficRoutingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigTrafficRoutingConfigPropertyValidator(properties).assertSuccess();
  return {
    "TimeBasedCanary": convertCfnDeploymentConfigTimeBasedCanaryPropertyToCloudFormation(properties.timeBasedCanary),
    "TimeBasedLinear": convertCfnDeploymentConfigTimeBasedLinearPropertyToCloudFormation(properties.timeBasedLinear),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigTrafficRoutingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.TrafficRoutingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.TrafficRoutingConfigProperty>();
  ret.addPropertyResult("timeBasedCanary", "TimeBasedCanary", (properties.TimeBasedCanary != null ? CfnDeploymentConfigTimeBasedCanaryPropertyFromCloudFormation(properties.TimeBasedCanary) : undefined));
  ret.addPropertyResult("timeBasedLinear", "TimeBasedLinear", (properties.TimeBasedLinear != null ? CfnDeploymentConfigTimeBasedLinearPropertyFromCloudFormation(properties.TimeBasedLinear) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MinimumHealthyHostsProperty`
 *
 * @param properties - the TypeScript properties of a `MinimumHealthyHostsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigMinimumHealthyHostsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"MinimumHealthyHostsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigMinimumHealthyHostsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigMinimumHealthyHostsPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigMinimumHealthyHostsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.MinimumHealthyHostsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.MinimumHealthyHostsProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MinimumHealthyHostsPerZoneProperty`
 *
 * @param properties - the TypeScript properties of a `MinimumHealthyHostsPerZoneProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigMinimumHealthyHostsPerZonePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"MinimumHealthyHostsPerZoneProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigMinimumHealthyHostsPerZonePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigMinimumHealthyHostsPerZonePropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigMinimumHealthyHostsPerZonePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.MinimumHealthyHostsPerZoneProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.MinimumHealthyHostsPerZoneProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZonalConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ZonalConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigZonalConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("firstZoneMonitorDurationInSeconds", cdk.validateNumber)(properties.firstZoneMonitorDurationInSeconds));
  errors.collect(cdk.propertyValidator("minimumHealthyHostsPerZone", CfnDeploymentConfigMinimumHealthyHostsPerZonePropertyValidator)(properties.minimumHealthyHostsPerZone));
  errors.collect(cdk.propertyValidator("monitorDurationInSeconds", cdk.validateNumber)(properties.monitorDurationInSeconds));
  return errors.wrap("supplied properties not correct for \"ZonalConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigZonalConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigZonalConfigPropertyValidator(properties).assertSuccess();
  return {
    "FirstZoneMonitorDurationInSeconds": cdk.numberToCloudFormation(properties.firstZoneMonitorDurationInSeconds),
    "MinimumHealthyHostsPerZone": convertCfnDeploymentConfigMinimumHealthyHostsPerZonePropertyToCloudFormation(properties.minimumHealthyHostsPerZone),
    "MonitorDurationInSeconds": cdk.numberToCloudFormation(properties.monitorDurationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigZonalConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentConfig.ZonalConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfig.ZonalConfigProperty>();
  ret.addPropertyResult("firstZoneMonitorDurationInSeconds", "FirstZoneMonitorDurationInSeconds", (properties.FirstZoneMonitorDurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.FirstZoneMonitorDurationInSeconds) : undefined));
  ret.addPropertyResult("minimumHealthyHostsPerZone", "MinimumHealthyHostsPerZone", (properties.MinimumHealthyHostsPerZone != null ? CfnDeploymentConfigMinimumHealthyHostsPerZonePropertyFromCloudFormation(properties.MinimumHealthyHostsPerZone) : undefined));
  ret.addPropertyResult("monitorDurationInSeconds", "MonitorDurationInSeconds", (properties.MonitorDurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MonitorDurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computePlatform", cdk.validateString)(properties.computePlatform));
  errors.collect(cdk.propertyValidator("deploymentConfigName", cdk.validateString)(properties.deploymentConfigName));
  errors.collect(cdk.propertyValidator("minimumHealthyHosts", CfnDeploymentConfigMinimumHealthyHostsPropertyValidator)(properties.minimumHealthyHosts));
  errors.collect(cdk.propertyValidator("trafficRoutingConfig", CfnDeploymentConfigTrafficRoutingConfigPropertyValidator)(properties.trafficRoutingConfig));
  errors.collect(cdk.propertyValidator("zonalConfig", CfnDeploymentConfigZonalConfigPropertyValidator)(properties.zonalConfig));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentConfigPropsValidator(properties).assertSuccess();
  return {
    "ComputePlatform": cdk.stringToCloudFormation(properties.computePlatform),
    "DeploymentConfigName": cdk.stringToCloudFormation(properties.deploymentConfigName),
    "MinimumHealthyHosts": convertCfnDeploymentConfigMinimumHealthyHostsPropertyToCloudFormation(properties.minimumHealthyHosts),
    "TrafficRoutingConfig": convertCfnDeploymentConfigTrafficRoutingConfigPropertyToCloudFormation(properties.trafficRoutingConfig),
    "ZonalConfig": convertCfnDeploymentConfigZonalConfigPropertyToCloudFormation(properties.zonalConfig)
  };
}

// @ts-ignore TS6133
function CfnDeploymentConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentConfigProps>();
  ret.addPropertyResult("computePlatform", "ComputePlatform", (properties.ComputePlatform != null ? cfn_parse.FromCloudFormation.getString(properties.ComputePlatform) : undefined));
  ret.addPropertyResult("deploymentConfigName", "DeploymentConfigName", (properties.DeploymentConfigName != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentConfigName) : undefined));
  ret.addPropertyResult("minimumHealthyHosts", "MinimumHealthyHosts", (properties.MinimumHealthyHosts != null ? CfnDeploymentConfigMinimumHealthyHostsPropertyFromCloudFormation(properties.MinimumHealthyHosts) : undefined));
  ret.addPropertyResult("trafficRoutingConfig", "TrafficRoutingConfig", (properties.TrafficRoutingConfig != null ? CfnDeploymentConfigTrafficRoutingConfigPropertyFromCloudFormation(properties.TrafficRoutingConfig) : undefined));
  ret.addPropertyResult("zonalConfig", "ZonalConfig", (properties.ZonalConfig != null ? CfnDeploymentConfigZonalConfigPropertyFromCloudFormation(properties.ZonalConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CodeDeploy::DeploymentGroup` resource creates an AWS CodeDeploy deployment group that specifies which instances your application revisions are deployed to, along with other deployment options.
 *
 * For more information, see [CreateDeploymentGroup](https://docs.aws.amazon.com/codedeploy/latest/APIReference/API_CreateDeploymentGroup.html) in the *CodeDeploy API Reference* .
 *
 * > Amazon ECS blue/green deployments through CodeDeploy do not use the `AWS::CodeDeploy::DeploymentGroup` resource. To perform Amazon ECS blue/green deployments, use the `AWS::CodeDeploy::BlueGreen` hook. See [Perform Amazon ECS blue/green deployments through CodeDeploy using AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/blue-green.html) for more information.
 *
 * @cloudformationResource AWS::CodeDeploy::DeploymentGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html
 */
export class CfnDeploymentGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeDeploy::DeploymentGroup";

  /**
   * Build a CfnDeploymentGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeploymentGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeploymentGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeploymentGroup(scope, id, propsResult.value);
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

  /**
   * Information about the Amazon CloudWatch alarms that are associated with the deployment group.
   */
  public alarmConfiguration?: CfnDeploymentGroup.AlarmConfigurationProperty | cdk.IResolvable;

  /**
   * The name of an existing CodeDeploy application to associate this deployment group with.
   */
  public applicationName: string;

  /**
   * Information about the automatic rollback configuration that is associated with the deployment group.
   */
  public autoRollbackConfiguration?: CfnDeploymentGroup.AutoRollbackConfigurationProperty | cdk.IResolvable;

  /**
   * A list of associated Auto Scaling groups that CodeDeploy automatically deploys revisions to when new instances are created.
   */
  public autoScalingGroups?: Array<string>;

  /**
   * Information about blue/green deployment options for a deployment group.
   */
  public blueGreenDeploymentConfiguration?: CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty | cdk.IResolvable;

  /**
   * The application revision to deploy to this deployment group.
   */
  public deployment?: CfnDeploymentGroup.DeploymentProperty | cdk.IResolvable;

  /**
   * A deployment configuration name or a predefined configuration name.
   */
  public deploymentConfigName?: string;

  /**
   * A name for the deployment group.
   */
  public deploymentGroupName?: string;

  /**
   * Attributes that determine the type of deployment to run and whether to route deployment traffic behind a load balancer.
   */
  public deploymentStyle?: CfnDeploymentGroup.DeploymentStyleProperty | cdk.IResolvable;

  /**
   * The Amazon EC2 tags that are already applied to Amazon EC2 instances that you want to include in the deployment group.
   */
  public ec2TagFilters?: Array<CfnDeploymentGroup.EC2TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Information about groups of tags applied to Amazon EC2 instances.
   */
  public ec2TagSet?: CfnDeploymentGroup.EC2TagSetProperty | cdk.IResolvable;

  /**
   * The target Amazon ECS services in the deployment group.
   */
  public ecsServices?: Array<CfnDeploymentGroup.ECSServiceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Information about the load balancer to use in a deployment.
   */
  public loadBalancerInfo?: cdk.IResolvable | CfnDeploymentGroup.LoadBalancerInfoProperty;

  /**
   * The on-premises instance tags already applied to on-premises instances that you want to include in the deployment group.
   */
  public onPremisesInstanceTagFilters?: Array<cdk.IResolvable | CfnDeploymentGroup.TagFilterProperty> | cdk.IResolvable;

  /**
   * Information about groups of tags applied to on-premises instances.
   */
  public onPremisesTagSet?: cdk.IResolvable | CfnDeploymentGroup.OnPremisesTagSetProperty;

  /**
   * Indicates what happens when new Amazon EC2 instances are launched mid-deployment and do not receive the deployed application revision.
   */
  public outdatedInstancesStrategy?: string;

  /**
   * A service role Amazon Resource Name (ARN) that grants CodeDeploy permission to make calls to AWS services on your behalf.
   */
  public serviceRoleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to CodeDeploy deployment groups to help you organize and categorize them.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the deployment group was configured to have CodeDeploy install a termination hook into an Auto Scaling group.
   */
  public terminationHookEnabled?: boolean | cdk.IResolvable;

  /**
   * Information about triggers associated with the deployment group.
   */
  public triggerConfigurations?: Array<cdk.IResolvable | CfnDeploymentGroup.TriggerConfigProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeploymentGroupProps) {
    super(scope, id, {
      "type": CfnDeploymentGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);
    cdk.requireProperty(props, "serviceRoleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.alarmConfiguration = props.alarmConfiguration;
    this.applicationName = props.applicationName;
    this.autoRollbackConfiguration = props.autoRollbackConfiguration;
    this.autoScalingGroups = props.autoScalingGroups;
    this.blueGreenDeploymentConfiguration = props.blueGreenDeploymentConfiguration;
    this.deployment = props.deployment;
    this.deploymentConfigName = props.deploymentConfigName;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentStyle = props.deploymentStyle;
    this.ec2TagFilters = props.ec2TagFilters;
    this.ec2TagSet = props.ec2TagSet;
    this.ecsServices = props.ecsServices;
    this.loadBalancerInfo = props.loadBalancerInfo;
    this.onPremisesInstanceTagFilters = props.onPremisesInstanceTagFilters;
    this.onPremisesTagSet = props.onPremisesTagSet;
    this.outdatedInstancesStrategy = props.outdatedInstancesStrategy;
    this.serviceRoleArn = props.serviceRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeDeploy::DeploymentGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.terminationHookEnabled = props.terminationHookEnabled;
    this.triggerConfigurations = props.triggerConfigurations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alarmConfiguration": this.alarmConfiguration,
      "applicationName": this.applicationName,
      "autoRollbackConfiguration": this.autoRollbackConfiguration,
      "autoScalingGroups": this.autoScalingGroups,
      "blueGreenDeploymentConfiguration": this.blueGreenDeploymentConfiguration,
      "deployment": this.deployment,
      "deploymentConfigName": this.deploymentConfigName,
      "deploymentGroupName": this.deploymentGroupName,
      "deploymentStyle": this.deploymentStyle,
      "ec2TagFilters": this.ec2TagFilters,
      "ec2TagSet": this.ec2TagSet,
      "ecsServices": this.ecsServices,
      "loadBalancerInfo": this.loadBalancerInfo,
      "onPremisesInstanceTagFilters": this.onPremisesInstanceTagFilters,
      "onPremisesTagSet": this.onPremisesTagSet,
      "outdatedInstancesStrategy": this.outdatedInstancesStrategy,
      "serviceRoleArn": this.serviceRoleArn,
      "tags": this.tags.renderTags(),
      "terminationHookEnabled": this.terminationHookEnabled,
      "triggerConfigurations": this.triggerConfigurations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeploymentGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeploymentGroupPropsToCloudFormation(props);
  }
}

export namespace CfnDeploymentGroup {
  /**
   * The `AlarmConfiguration` property type configures CloudWatch alarms for an AWS CodeDeploy deployment group.
   *
   * `AlarmConfiguration` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarmconfiguration.html
   */
  export interface AlarmConfigurationProperty {
    /**
     * A list of alarms configured for the deployment or deployment group.
     *
     * A maximum of 10 alarms can be added.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarmconfiguration.html#cfn-codedeploy-deploymentgroup-alarmconfiguration-alarms
     */
    readonly alarms?: Array<CfnDeploymentGroup.AlarmProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Indicates whether the alarm configuration is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarmconfiguration.html#cfn-codedeploy-deploymentgroup-alarmconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Indicates whether a deployment should continue if information about the current state of alarms cannot be retrieved from Amazon CloudWatch .
     *
     * The default value is `false` .
     *
     * - `true` : The deployment proceeds even if alarm status information can't be retrieved from CloudWatch .
     * - `false` : The deployment stops if alarm status information can't be retrieved from CloudWatch .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarmconfiguration.html#cfn-codedeploy-deploymentgroup-alarmconfiguration-ignorepollalarmfailure
     */
    readonly ignorePollAlarmFailure?: boolean | cdk.IResolvable;
  }

  /**
   * The `Alarm` property type specifies a CloudWatch alarm to use for an AWS CodeDeploy deployment group.
   *
   * The `Alarm` property of the [CodeDeploy DeploymentGroup AlarmConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarmconfiguration.html) property contains a list of `Alarm` property types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarm.html
   */
  export interface AlarmProperty {
    /**
     * The name of the alarm.
     *
     * Maximum length is 255 characters. Each alarm name can be used only once in a list of alarms.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarm.html#cfn-codedeploy-deploymentgroup-alarm-name
     */
    readonly name?: string;
  }

  /**
   * The `AutoRollbackConfiguration` property type configures automatic rollback for an AWS CodeDeploy deployment group when a deployment is not completed successfully.
   *
   * For more information, see [Automatic Rollbacks](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html#deployments-rollback-and-redeploy-automatic-rollbacks) in the *AWS CodeDeploy User Guide* .
   *
   * `AutoRollbackConfiguration` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-autorollbackconfiguration.html
   */
  export interface AutoRollbackConfigurationProperty {
    /**
     * Indicates whether a defined automatic rollback configuration is currently enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-autorollbackconfiguration.html#cfn-codedeploy-deploymentgroup-autorollbackconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The event type or types that trigger a rollback.
     *
     * Valid values are `DEPLOYMENT_FAILURE` , `DEPLOYMENT_STOP_ON_ALARM` , or `DEPLOYMENT_STOP_ON_REQUEST` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-autorollbackconfiguration.html#cfn-codedeploy-deploymentgroup-autorollbackconfiguration-events
     */
    readonly events?: Array<string>;
  }

  /**
   * Information about blue/green deployment options for a deployment group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-bluegreendeploymentconfiguration.html
   */
  export interface BlueGreenDeploymentConfigurationProperty {
    /**
     * Information about the action to take when newly provisioned instances are ready to receive traffic in a blue/green deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-bluegreendeploymentconfiguration.html#cfn-codedeploy-deploymentgroup-bluegreendeploymentconfiguration-deploymentreadyoption
     */
    readonly deploymentReadyOption?: CfnDeploymentGroup.DeploymentReadyOptionProperty | cdk.IResolvable;

    /**
     * Information about how instances are provisioned for a replacement environment in a blue/green deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-bluegreendeploymentconfiguration.html#cfn-codedeploy-deploymentgroup-bluegreendeploymentconfiguration-greenfleetprovisioningoption
     */
    readonly greenFleetProvisioningOption?: CfnDeploymentGroup.GreenFleetProvisioningOptionProperty | cdk.IResolvable;

    /**
     * Information about whether to terminate instances in the original fleet during a blue/green deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-bluegreendeploymentconfiguration.html#cfn-codedeploy-deploymentgroup-bluegreendeploymentconfiguration-terminateblueinstancesondeploymentsuccess
     */
    readonly terminateBlueInstancesOnDeploymentSuccess?: CfnDeploymentGroup.BlueInstanceTerminationOptionProperty | cdk.IResolvable;
  }

  /**
   * Information about how traffic is rerouted to instances in a replacement environment in a blue/green deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentreadyoption.html
   */
  export interface DeploymentReadyOptionProperty {
    /**
     * Information about when to reroute traffic from an original environment to a replacement environment in a blue/green deployment.
     *
     * - CONTINUE_DEPLOYMENT: Register new instances with the load balancer immediately after the new application revision is installed on the instances in the replacement environment.
     * - STOP_DEPLOYMENT: Do not register new instances with a load balancer unless traffic rerouting is started using [ContinueDeployment](https://docs.aws.amazon.com/codedeploy/latest/APIReference/API_ContinueDeployment.html) . If traffic rerouting is not started before the end of the specified wait period, the deployment status is changed to Stopped.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentreadyoption.html#cfn-codedeploy-deploymentgroup-deploymentreadyoption-actionontimeout
     */
    readonly actionOnTimeout?: string;

    /**
     * The number of minutes to wait before the status of a blue/green deployment is changed to Stopped if rerouting is not started manually.
     *
     * Applies only to the `STOP_DEPLOYMENT` option for `actionOnTimeout` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentreadyoption.html#cfn-codedeploy-deploymentgroup-deploymentreadyoption-waittimeinminutes
     */
    readonly waitTimeInMinutes?: number;
  }

  /**
   * Information about the instances that belong to the replacement environment in a blue/green deployment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-greenfleetprovisioningoption.html
   */
  export interface GreenFleetProvisioningOptionProperty {
    /**
     * The method used to add instances to a replacement environment.
     *
     * - `DISCOVER_EXISTING` : Use instances that already exist or will be created manually.
     * - `COPY_AUTO_SCALING_GROUP` : Use settings from a specified Auto Scaling group to define and create instances in a new Auto Scaling group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-greenfleetprovisioningoption.html#cfn-codedeploy-deploymentgroup-greenfleetprovisioningoption-action
     */
    readonly action?: string;
  }

  /**
   * Information about whether instances in the original environment are terminated when a blue/green deployment is successful.
   *
   * `BlueInstanceTerminationOption` does not apply to Lambda deployments.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-blueinstanceterminationoption.html
   */
  export interface BlueInstanceTerminationOptionProperty {
    /**
     * The action to take on instances in the original environment after a successful blue/green deployment.
     *
     * - `TERMINATE` : Instances are terminated after a specified wait time.
     * - `KEEP_ALIVE` : Instances are left running after they are deregistered from the load balancer and removed from the deployment group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-blueinstanceterminationoption.html#cfn-codedeploy-deploymentgroup-blueinstanceterminationoption-action
     */
    readonly action?: string;

    /**
     * For an Amazon EC2 deployment, the number of minutes to wait after a successful blue/green deployment before terminating instances from the original environment.
     *
     * For an Amazon ECS deployment, the number of minutes before deleting the original (blue) task set. During an Amazon ECS deployment, CodeDeploy shifts traffic from the original (blue) task set to a replacement (green) task set.
     *
     * The maximum setting is 2880 minutes (2 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-blueinstanceterminationoption.html#cfn-codedeploy-deploymentgroup-blueinstanceterminationoption-terminationwaittimeinminutes
     */
    readonly terminationWaitTimeInMinutes?: number;
  }

  /**
   * `Deployment` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource that specifies an AWS CodeDeploy application revision to be deployed to instances in the deployment group. If you specify an application revision, your target revision is deployed as soon as the provisioning process is complete.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment.html
   */
  export interface DeploymentProperty {
    /**
     * A comment about the deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment.html#cfn-codedeploy-deploymentgroup-deployment-description
     */
    readonly description?: string;

    /**
     * If true, then if an `ApplicationStop` , `BeforeBlockTraffic` , or `AfterBlockTraffic` deployment lifecycle event to an instance fails, then the deployment continues to the next deployment lifecycle event.
     *
     * For example, if `ApplicationStop` fails, the deployment continues with DownloadBundle. If `BeforeBlockTraffic` fails, the deployment continues with `BlockTraffic` . If `AfterBlockTraffic` fails, the deployment continues with `ApplicationStop` .
     *
     * If false or not specified, then if a lifecycle event fails during a deployment to an instance, that deployment fails. If deployment to that instance is part of an overall deployment and the number of healthy hosts is not less than the minimum number of healthy hosts, then a deployment to the next instance is attempted.
     *
     * During a deployment, the AWS CodeDeploy agent runs the scripts specified for `ApplicationStop` , `BeforeBlockTraffic` , and `AfterBlockTraffic` in the AppSpec file from the previous successful deployment. (All other scripts are run from the AppSpec file in the current deployment.) If one of these scripts contains an error and does not run successfully, the deployment can fail.
     *
     * If the cause of the failure is a script from the last successful deployment that will never run successfully, create a new deployment and use `ignoreApplicationStopFailures` to specify that the `ApplicationStop` , `BeforeBlockTraffic` , and `AfterBlockTraffic` failures should be ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment.html#cfn-codedeploy-deploymentgroup-deployment-ignoreapplicationstopfailures
     */
    readonly ignoreApplicationStopFailures?: boolean | cdk.IResolvable;

    /**
     * Information about the location of stored application artifacts and the service from which to retrieve them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment.html#cfn-codedeploy-deploymentgroup-deployment-revision
     */
    readonly revision: cdk.IResolvable | CfnDeploymentGroup.RevisionLocationProperty;
  }

  /**
   * `RevisionLocation` is a property that defines the location of the CodeDeploy application revision to deploy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-revisionlocation.html
   */
  export interface RevisionLocationProperty {
    /**
     * Information about the location of application artifacts stored in GitHub.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-revisionlocation.html#cfn-codedeploy-deploymentgroup-revisionlocation-githublocation
     */
    readonly gitHubLocation?: CfnDeploymentGroup.GitHubLocationProperty | cdk.IResolvable;

    /**
     * The type of application revision:.
     *
     * - S3: An application revision stored in Amazon S3.
     * - GitHub: An application revision stored in GitHub (EC2/On-premises deployments only).
     * - String: A YAML-formatted or JSON-formatted string ( AWS Lambda deployments only).
     * - AppSpecContent: An `AppSpecContent` object that contains the contents of an AppSpec file for an AWS Lambda or Amazon ECS deployment. The content is formatted as JSON or YAML stored as a RawString.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-revisionlocation.html#cfn-codedeploy-deploymentgroup-revisionlocation-revisiontype
     */
    readonly revisionType?: string;

    /**
     * Information about the location of a revision stored in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-revisionlocation.html#cfn-codedeploy-deploymentgroup-revisionlocation-s3location
     */
    readonly s3Location?: cdk.IResolvable | CfnDeploymentGroup.S3LocationProperty;
  }

  /**
   * `GitHubLocation` is a property of the [CodeDeploy DeploymentGroup Revision](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html) property that specifies the location of an application revision that is stored in GitHub.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-githublocation.html
   */
  export interface GitHubLocationProperty {
    /**
     * The SHA1 commit ID of the GitHub commit that represents the bundled artifacts for the application revision.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-githublocation.html#cfn-codedeploy-deploymentgroup-githublocation-commitid
     */
    readonly commitId: string;

    /**
     * The GitHub account and repository pair that stores a reference to the commit that represents the bundled artifacts for the application revision.
     *
     * Specify the value as `account/repository` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-githublocation.html#cfn-codedeploy-deploymentgroup-githublocation-repository
     */
    readonly repository: string;
  }

  /**
   * `S3Location` is a property of the [CodeDeploy DeploymentGroup Revision](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deployment-revision.html) property that specifies the location of an application revision that is stored in Amazon Simple Storage Service ( Amazon S3 ).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The name of the Amazon S3 bucket where the application revision is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html#cfn-codedeploy-deploymentgroup-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The file type of the application revision. Must be one of the following:.
     *
     * - JSON
     * - tar: A tar archive file.
     * - tgz: A compressed tar archive file.
     * - YAML
     * - zip: A zip archive file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html#cfn-codedeploy-deploymentgroup-s3location-bundletype
     */
    readonly bundleType?: string;

    /**
     * The ETag of the Amazon S3 object that represents the bundled artifacts for the application revision.
     *
     * If the ETag is not specified as an input parameter, ETag validation of the object is skipped.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html#cfn-codedeploy-deploymentgroup-s3location-etag
     */
    readonly eTag?: string;

    /**
     * The name of the Amazon S3 object that represents the bundled artifacts for the application revision.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html#cfn-codedeploy-deploymentgroup-s3location-key
     */
    readonly key: string;

    /**
     * A specific version of the Amazon S3 object that represents the bundled artifacts for the application revision.
     *
     * If the version is not specified, the system uses the most recent version by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-s3location.html#cfn-codedeploy-deploymentgroup-s3location-version
     */
    readonly version?: string;
  }

  /**
   * Information about the type of deployment, either in-place or blue/green, you want to run and whether to route deployment traffic behind a load balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html
   */
  export interface DeploymentStyleProperty {
    /**
     * Indicates whether to route deployment traffic behind a load balancer.
     *
     * > An Amazon EC2 Application Load Balancer or Network Load Balancer is required for an Amazon ECS deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html#cfn-codedeploy-deploymentgroup-deploymentstyle-deploymentoption
     */
    readonly deploymentOption?: string;

    /**
     * Indicates whether to run an in-place or blue/green deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-deploymentstyle.html#cfn-codedeploy-deploymentgroup-deploymentstyle-deploymenttype
     */
    readonly deploymentType?: string;
  }

  /**
   * Contains the service and cluster names used to identify an Amazon ECS deployment's target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ecsservice.html
   */
  export interface ECSServiceProperty {
    /**
     * The name of the cluster that the Amazon ECS service is associated with.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ecsservice.html#cfn-codedeploy-deploymentgroup-ecsservice-clustername
     */
    readonly clusterName: string;

    /**
     * The name of the target Amazon ECS service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ecsservice.html#cfn-codedeploy-deploymentgroup-ecsservice-servicename
     */
    readonly serviceName: string;
  }

  /**
   * Information about an Amazon EC2 tag filter.
   *
   * For more information about using tags and tag groups to help manage your Amazon EC2 instances and on-premises instances, see [Tagging Instances for Deployment Groups in AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-tagging.html) in the *AWS CodeDeploy User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html
   */
  export interface EC2TagFilterProperty {
    /**
     * The tag filter key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-key
     */
    readonly key?: string;

    /**
     * The tag filter type:.
     *
     * - `KEY_ONLY` : Key only.
     * - `VALUE_ONLY` : Value only.
     * - `KEY_AND_VALUE` : Key and value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-type
     */
    readonly type?: string;

    /**
     * The tag filter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-value
     */
    readonly value?: string;
  }

  /**
   * The `EC2TagSet` property type specifies information about groups of tags applied to Amazon EC2 instances.
   *
   * The deployment group includes only Amazon EC2 instances identified by all the tag groups. `EC2TagSet` cannot be used in the same template as `EC2TagFilter` .
   *
   * For information about using tags and tag groups to help manage your Amazon EC2 instances and on-premises instances, see [Tagging Instances for Deployment Groups in AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-tagging.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagset.html
   */
  export interface EC2TagSetProperty {
    /**
     * The Amazon EC2 tags that are already applied to Amazon EC2 instances that you want to include in the deployment group.
     *
     * CodeDeploy includes all Amazon EC2 instances identified by any of the tags you specify in this deployment group.
     *
     * Duplicates are not allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagset.html#cfn-codedeploy-deploymentgroup-ec2tagset-ec2tagsetlist
     */
    readonly ec2TagSetList?: Array<CfnDeploymentGroup.EC2TagSetListObjectProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The `EC2TagSet` property type specifies information about groups of tags applied to Amazon EC2 instances.
   *
   * The deployment group includes only Amazon EC2 instances identified by all the tag groups. Cannot be used in the same template as EC2TagFilters.
   *
   * For more information about using tags and tag groups to help manage your Amazon EC2 instances and on-premises instances, see [Tagging Instances for Deployment Groups in AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-tagging.html) in the *AWS CodeDeploy User Guide* .
   *
   * `EC2TagSet` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagsetlistobject.html
   */
  export interface EC2TagSetListObjectProperty {
    /**
     * A list that contains other lists of Amazon EC2 instance tag groups.
     *
     * For an instance to be included in the deployment group, it must be identified by all of the tag groups in the list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagsetlistobject.html#cfn-codedeploy-deploymentgroup-ec2tagsetlistobject-ec2taggroup
     */
    readonly ec2TagGroup?: Array<CfnDeploymentGroup.EC2TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The `LoadBalancerInfo` property type specifies information about the load balancer or target group used for an AWS CodeDeploy deployment group.
   *
   * For more information, see [Integrating CodeDeploy with Elastic Load Balancing](https://docs.aws.amazon.com/codedeploy/latest/userguide/integrations-aws-elastic-load-balancing.html) in the *AWS CodeDeploy User Guide* .
   *
   * For AWS CloudFormation to use the properties specified in `LoadBalancerInfo` , the `DeploymentStyle.DeploymentOption` property must be set to `WITH_TRAFFIC_CONTROL` . If `DeploymentStyle.DeploymentOption` is not set to `WITH_TRAFFIC_CONTROL` , AWS CloudFormation ignores any settings specified in `LoadBalancerInfo` .
   *
   * > AWS CloudFormation supports blue/green deployments on the AWS Lambda compute platform only.
   *
   * `LoadBalancerInfo` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html
   */
  export interface LoadBalancerInfoProperty {
    /**
     * An array that contains information about the load balancers to use for load balancing in a deployment.
     *
     * If you're using Classic Load Balancers, specify those load balancers in this array.
     *
     * > You can add up to 10 load balancers to the array. > If you're using Application Load Balancers or Network Load Balancers, use the `targetGroupInfoList` array instead of this one.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-elbinfolist
     */
    readonly elbInfoList?: Array<CfnDeploymentGroup.ELBInfoProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array that contains information about the target groups to use for load balancing in a deployment.
     *
     * If you're using Application Load Balancers and Network Load Balancers, specify their associated target groups in this array.
     *
     * > You can add up to 10 target groups to the array. > If you're using Classic Load Balancers, use the `elbInfoList` array instead of this one.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-targetgroupinfolist
     */
    readonly targetGroupInfoList?: Array<cdk.IResolvable | CfnDeploymentGroup.TargetGroupInfoProperty> | cdk.IResolvable;

    /**
     * The target group pair information.
     *
     * This is an array of `TargeGroupPairInfo` objects with a maximum size of one.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo-targetgrouppairinfolist
     */
    readonly targetGroupPairInfoList?: Array<cdk.IResolvable | CfnDeploymentGroup.TargetGroupPairInfoProperty> | cdk.IResolvable;
  }

  /**
   * The `ELBInfo` property type specifies information about the Elastic Load Balancing load balancer used for an CodeDeploy deployment group.
   *
   * If you specify the `ELBInfo` property, the `DeploymentStyle.DeploymentOption` property must be set to `WITH_TRAFFIC_CONTROL` for AWS CodeDeploy to route your traffic using the specified load balancers.
   *
   * `ELBInfo` is a property of the [AWS CodeDeploy DeploymentGroup LoadBalancerInfo](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-elbinfo.html
   */
  export interface ELBInfoProperty {
    /**
     * For blue/green deployments, the name of the load balancer that is used to route traffic from original instances to replacement instances in a blue/green deployment.
     *
     * For in-place deployments, the name of the load balancer that instances are deregistered from so they are not serving traffic during a deployment, and then re-registered with after the deployment is complete.
     *
     * > AWS CloudFormation supports blue/green deployments on AWS Lambda compute platforms only.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-elbinfo.html#cfn-codedeploy-deploymentgroup-elbinfo-name
     */
    readonly name?: string;
  }

  /**
   * The `TargetGroupInfo` property type specifies information about a target group in Elastic Load Balancing to use in a deployment.
   *
   * Instances are registered as targets in a target group, and traffic is routed to the target group. For more information, see [TargetGroupInfo](https://docs.aws.amazon.com/codedeploy/latest/APIReference/API_TargetGroupInfo.html) in the *AWS CodeDeploy API Reference*
   *
   * If you specify the `TargetGroupInfo` property, the `DeploymentStyle.DeploymentOption` property must be set to `WITH_TRAFFIC_CONTROL` for CodeDeploy to route your traffic using the specified target groups.
   *
   * `TargetGroupInfo` is a property of the [LoadBalancerInfo](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-loadbalancerinfo.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgroupinfo.html
   */
  export interface TargetGroupInfoProperty {
    /**
     * For blue/green deployments, the name of the target group that instances in the original environment are deregistered from, and instances in the replacement environment registered with.
     *
     * For in-place deployments, the name of the target group that instances are deregistered from, so they are not serving traffic during a deployment, and then re-registered with after the deployment completes. No duplicates allowed.
     *
     * > AWS CloudFormation supports blue/green deployments on AWS Lambda compute platforms only.
     *
     * This value cannot exceed 32 characters, so you should use the `Name` property of the target group, or the `TargetGroupName` attribute with the `Fn::GetAtt` intrinsic function, as shown in the following example. Don't use the group's Amazon Resource Name (ARN) or `TargetGroupFullName` attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgroupinfo.html#cfn-codedeploy-deploymentgroup-targetgroupinfo-name
     */
    readonly name?: string;
  }

  /**
   * Information about two target groups and how traffic is routed during an Amazon ECS deployment.
   *
   * An optional test traffic route can be specified.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgrouppairinfo.html
   */
  export interface TargetGroupPairInfoProperty {
    /**
     * The path used by a load balancer to route production traffic when an Amazon ECS deployment is complete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgrouppairinfo.html#cfn-codedeploy-deploymentgroup-targetgrouppairinfo-prodtrafficroute
     */
    readonly prodTrafficRoute?: cdk.IResolvable | CfnDeploymentGroup.TrafficRouteProperty;

    /**
     * One pair of target groups.
     *
     * One is associated with the original task set. The second is associated with the task set that serves traffic after the deployment is complete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgrouppairinfo.html#cfn-codedeploy-deploymentgroup-targetgrouppairinfo-targetgroups
     */
    readonly targetGroups?: Array<cdk.IResolvable | CfnDeploymentGroup.TargetGroupInfoProperty> | cdk.IResolvable;

    /**
     * An optional path used by a load balancer to route test traffic after an Amazon ECS deployment.
     *
     * Validation can occur while test traffic is served during a deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-targetgrouppairinfo.html#cfn-codedeploy-deploymentgroup-targetgrouppairinfo-testtrafficroute
     */
    readonly testTrafficRoute?: cdk.IResolvable | CfnDeploymentGroup.TrafficRouteProperty;
  }

  /**
   * Information about a listener.
   *
   * The listener contains the path used to route traffic that is received from the load balancer to a target group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-trafficroute.html
   */
  export interface TrafficRouteProperty {
    /**
     * The Amazon Resource Name (ARN) of one listener.
     *
     * The listener identifies the route between a target group and a load balancer. This is an array of strings with a maximum size of one.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-trafficroute.html#cfn-codedeploy-deploymentgroup-trafficroute-listenerarns
     */
    readonly listenerArns?: Array<string>;
  }

  /**
   * `TagFilter` is a property type of the [AWS::CodeDeploy::DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource that specifies which on-premises instances to associate with the deployment group. To register on-premise instances with AWS CodeDeploy , see [Configure Existing On-Premises Instances by Using AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-on-premises.html) in the *AWS CodeDeploy User Guide* .
   *
   * For more information about using tags and tag groups to help manage your Amazon EC2 instances and on-premises instances, see [Tagging Instances for Deployment Groups in AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-tagging.html) in the *AWS CodeDeploy User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html
   */
  export interface TagFilterProperty {
    /**
     * The on-premises instance tag filter key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-key
     */
    readonly key?: string;

    /**
     * The on-premises instance tag filter type:.
     *
     * - KEY_ONLY: Key only.
     * - VALUE_ONLY: Value only.
     * - KEY_AND_VALUE: Key and value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-type
     */
    readonly type?: string;

    /**
     * The on-premises instance tag filter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-value
     */
    readonly value?: string;
  }

  /**
   * The `OnPremisesTagSet` property type specifies a list containing other lists of on-premises instance tag groups.
   *
   * In order for an instance to be included in the deployment group, it must be identified by all the tag groups in the list.
   *
   * For more information about using tags and tag groups to help manage your Amazon EC2 instances and on-premises instances, see [Tagging Instances for Deployment Groups in AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-tagging.html) in the *AWS CodeDeploy User Guide* .
   *
   * `OnPremisesTagSet` is a property of the [DeploymentGroup](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisestagset.html
   */
  export interface OnPremisesTagSetProperty {
    /**
     * A list that contains other lists of on-premises instance tag groups.
     *
     * For an instance to be included in the deployment group, it must be identified by all of the tag groups in the list.
     *
     * Duplicates are not allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisestagset.html#cfn-codedeploy-deploymentgroup-onpremisestagset-onpremisestagsetlist
     */
    readonly onPremisesTagSetList?: Array<cdk.IResolvable | CfnDeploymentGroup.OnPremisesTagSetListObjectProperty> | cdk.IResolvable;
  }

  /**
   * The `OnPremisesTagSetListObject` property type specifies lists of on-premises instance tag groups.
   *
   * In order for an instance to be included in the deployment group, it must be identified by all the tag groups in the list.
   *
   * `OnPremisesTagSetListObject` is a property of the [CodeDeploy DeploymentGroup OnPremisesTagSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisestagset.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisestagsetlistobject.html
   */
  export interface OnPremisesTagSetListObjectProperty {
    /**
     * Information about groups of on-premises instance tags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisestagsetlistobject.html#cfn-codedeploy-deploymentgroup-onpremisestagsetlistobject-onpremisestaggroup
     */
    readonly onPremisesTagGroup?: Array<cdk.IResolvable | CfnDeploymentGroup.TagFilterProperty> | cdk.IResolvable;
  }

  /**
   * Information about notification triggers for the deployment group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html
   */
  export interface TriggerConfigProperty {
    /**
     * The event type or types that trigger notifications.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggerevents
     */
    readonly triggerEvents?: Array<string>;

    /**
     * The name of the notification trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggername
     */
    readonly triggerName?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service topic through which notifications about deployment or instance events are sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-triggerconfig.html#cfn-codedeploy-deploymentgroup-triggerconfig-triggertargetarn
     */
    readonly triggerTargetArn?: string;
  }
}

/**
 * Properties for defining a `CfnDeploymentGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html
 */
export interface CfnDeploymentGroupProps {
  /**
   * Information about the Amazon CloudWatch alarms that are associated with the deployment group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-alarmconfiguration
   */
  readonly alarmConfiguration?: CfnDeploymentGroup.AlarmConfigurationProperty | cdk.IResolvable;

  /**
   * The name of an existing CodeDeploy application to associate this deployment group with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-applicationname
   */
  readonly applicationName: string;

  /**
   * Information about the automatic rollback configuration that is associated with the deployment group.
   *
   * If you specify this property, don't specify the `Deployment` property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-autorollbackconfiguration
   */
  readonly autoRollbackConfiguration?: CfnDeploymentGroup.AutoRollbackConfigurationProperty | cdk.IResolvable;

  /**
   * A list of associated Auto Scaling groups that CodeDeploy automatically deploys revisions to when new instances are created.
   *
   * Duplicates are not allowed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-autoscalinggroups
   */
  readonly autoScalingGroups?: Array<string>;

  /**
   * Information about blue/green deployment options for a deployment group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-bluegreendeploymentconfiguration
   */
  readonly blueGreenDeploymentConfiguration?: CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty | cdk.IResolvable;

  /**
   * The application revision to deploy to this deployment group.
   *
   * If you specify this property, your target application revision is deployed as soon as the provisioning process is complete. If you specify this property, don't specify the `AutoRollbackConfiguration` property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deployment
   */
  readonly deployment?: CfnDeploymentGroup.DeploymentProperty | cdk.IResolvable;

  /**
   * A deployment configuration name or a predefined configuration name.
   *
   * With predefined configurations, you can deploy application revisions to one instance at a time ( `CodeDeployDefault.OneAtATime` ), half of the instances at a time ( `CodeDeployDefault.HalfAtATime` ), or all the instances at once ( `CodeDeployDefault.AllAtOnce` ). For more information and valid values, see [Working with Deployment Configurations](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html) in the *AWS CodeDeploy User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentconfigname
   */
  readonly deploymentConfigName?: string;

  /**
   * A name for the deployment group.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the deployment group name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentgroupname
   */
  readonly deploymentGroupName?: string;

  /**
   * Attributes that determine the type of deployment to run and whether to route deployment traffic behind a load balancer.
   *
   * If you specify this property with a blue/green deployment type, don't specify the `AutoScalingGroups` , `LoadBalancerInfo` , or `Deployment` properties.
   *
   * > For blue/green deployments, AWS CloudFormation supports deployments on Lambda compute platforms only. You can perform Amazon ECS blue/green deployments using `AWS::CodeDeploy::BlueGreen` hook. See [Perform Amazon ECS blue/green deployments through CodeDeploy using AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/blue-green.html) for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-deploymentstyle
   */
  readonly deploymentStyle?: CfnDeploymentGroup.DeploymentStyleProperty | cdk.IResolvable;

  /**
   * The Amazon EC2 tags that are already applied to Amazon EC2 instances that you want to include in the deployment group.
   *
   * CodeDeploy includes all Amazon EC2 instances identified by any of the tags you specify in this deployment group. Duplicates are not allowed.
   *
   * You can specify `EC2TagFilters` or `Ec2TagSet` , but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-ec2tagfilters
   */
  readonly ec2TagFilters?: Array<CfnDeploymentGroup.EC2TagFilterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Information about groups of tags applied to Amazon EC2 instances.
   *
   * The deployment group includes only Amazon EC2 instances identified by all the tag groups. Cannot be used in the same call as `ec2TagFilter` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-ec2tagset
   */
  readonly ec2TagSet?: CfnDeploymentGroup.EC2TagSetProperty | cdk.IResolvable;

  /**
   * The target Amazon ECS services in the deployment group.
   *
   * This applies only to deployment groups that use the Amazon ECS compute platform. A target Amazon ECS service is specified as an Amazon ECS cluster and service name pair using the format `<clustername>:<servicename>` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-ecsservices
   */
  readonly ecsServices?: Array<CfnDeploymentGroup.ECSServiceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Information about the load balancer to use in a deployment.
   *
   * For more information, see [Integrating CodeDeploy with Elastic Load Balancing](https://docs.aws.amazon.com/codedeploy/latest/userguide/integrations-aws-elastic-load-balancing.html) in the *AWS CodeDeploy User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-loadbalancerinfo
   */
  readonly loadBalancerInfo?: cdk.IResolvable | CfnDeploymentGroup.LoadBalancerInfoProperty;

  /**
   * The on-premises instance tags already applied to on-premises instances that you want to include in the deployment group.
   *
   * CodeDeploy includes all on-premises instances identified by any of the tags you specify in this deployment group. To register on-premises instances with CodeDeploy , see [Working with On-Premises Instances for CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-on-premises.html) in the *AWS CodeDeploy User Guide* . Duplicates are not allowed.
   *
   * You can specify `OnPremisesInstanceTagFilters` or `OnPremisesInstanceTagSet` , but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-onpremisesinstancetagfilters
   */
  readonly onPremisesInstanceTagFilters?: Array<cdk.IResolvable | CfnDeploymentGroup.TagFilterProperty> | cdk.IResolvable;

  /**
   * Information about groups of tags applied to on-premises instances.
   *
   * The deployment group includes only on-premises instances identified by all the tag groups.
   *
   * You can specify `OnPremisesInstanceTagFilters` or `OnPremisesInstanceTagSet` , but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-onpremisestagset
   */
  readonly onPremisesTagSet?: cdk.IResolvable | CfnDeploymentGroup.OnPremisesTagSetProperty;

  /**
   * Indicates what happens when new Amazon EC2 instances are launched mid-deployment and do not receive the deployed application revision.
   *
   * If this option is set to `UPDATE` or is unspecified, CodeDeploy initiates one or more 'auto-update outdated instances' deployments to apply the deployed application revision to the new Amazon EC2 instances.
   *
   * If this option is set to `IGNORE` , CodeDeploy does not initiate a deployment to update the new Amazon EC2 instances. This may result in instances having different revisions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-outdatedinstancesstrategy
   */
  readonly outdatedInstancesStrategy?: string;

  /**
   * A service role Amazon Resource Name (ARN) that grants CodeDeploy permission to make calls to AWS services on your behalf.
   *
   * For more information, see [Create a Service Role for AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html) in the *AWS CodeDeploy User Guide* .
   *
   * > In some cases, you might need to add a dependency on the service role's policy. For more information, see IAM role policy in [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-servicerolearn
   */
  readonly serviceRoleArn: string;

  /**
   * The metadata that you apply to CodeDeploy deployment groups to help you organize and categorize them.
   *
   * Each tag consists of a key and an optional value, both of which you define.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Indicates whether the deployment group was configured to have CodeDeploy install a termination hook into an Auto Scaling group.
   *
   * For more information about the termination hook, see [How Amazon EC2 Auto Scaling works with CodeDeploy](https://docs.aws.amazon.com//codedeploy/latest/userguide/integrations-aws-auto-scaling.html#integrations-aws-auto-scaling-behaviors) in the *AWS CodeDeploy User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-terminationhookenabled
   */
  readonly terminationHookEnabled?: boolean | cdk.IResolvable;

  /**
   * Information about triggers associated with the deployment group.
   *
   * Duplicates are not allowed
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentgroup.html#cfn-codedeploy-deploymentgroup-triggerconfigurations
   */
  readonly triggerConfigurations?: Array<cdk.IResolvable | CfnDeploymentGroup.TriggerConfigProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `AlarmProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupAlarmPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"AlarmProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupAlarmPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupAlarmPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupAlarmPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.AlarmProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.AlarmProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlarmConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AlarmConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupAlarmConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarms", cdk.listValidator(CfnDeploymentGroupAlarmPropertyValidator))(properties.alarms));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("ignorePollAlarmFailure", cdk.validateBoolean)(properties.ignorePollAlarmFailure));
  return errors.wrap("supplied properties not correct for \"AlarmConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupAlarmConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupAlarmConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Alarms": cdk.listMapper(convertCfnDeploymentGroupAlarmPropertyToCloudFormation)(properties.alarms),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "IgnorePollAlarmFailure": cdk.booleanToCloudFormation(properties.ignorePollAlarmFailure)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupAlarmConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.AlarmConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.AlarmConfigurationProperty>();
  ret.addPropertyResult("alarms", "Alarms", (properties.Alarms != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupAlarmPropertyFromCloudFormation)(properties.Alarms) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("ignorePollAlarmFailure", "IgnorePollAlarmFailure", (properties.IgnorePollAlarmFailure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnorePollAlarmFailure) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoRollbackConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AutoRollbackConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupAutoRollbackConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("events", cdk.listValidator(cdk.validateString))(properties.events));
  return errors.wrap("supplied properties not correct for \"AutoRollbackConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupAutoRollbackConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupAutoRollbackConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Events": cdk.listMapper(cdk.stringToCloudFormation)(properties.events)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupAutoRollbackConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.AutoRollbackConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.AutoRollbackConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Events) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentReadyOptionProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentReadyOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentReadyOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionOnTimeout", cdk.validateString)(properties.actionOnTimeout));
  errors.collect(cdk.propertyValidator("waitTimeInMinutes", cdk.validateNumber)(properties.waitTimeInMinutes));
  return errors.wrap("supplied properties not correct for \"DeploymentReadyOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupDeploymentReadyOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupDeploymentReadyOptionPropertyValidator(properties).assertSuccess();
  return {
    "ActionOnTimeout": cdk.stringToCloudFormation(properties.actionOnTimeout),
    "WaitTimeInMinutes": cdk.numberToCloudFormation(properties.waitTimeInMinutes)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentReadyOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.DeploymentReadyOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.DeploymentReadyOptionProperty>();
  ret.addPropertyResult("actionOnTimeout", "ActionOnTimeout", (properties.ActionOnTimeout != null ? cfn_parse.FromCloudFormation.getString(properties.ActionOnTimeout) : undefined));
  ret.addPropertyResult("waitTimeInMinutes", "WaitTimeInMinutes", (properties.WaitTimeInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.WaitTimeInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GreenFleetProvisioningOptionProperty`
 *
 * @param properties - the TypeScript properties of a `GreenFleetProvisioningOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupGreenFleetProvisioningOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  return errors.wrap("supplied properties not correct for \"GreenFleetProvisioningOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupGreenFleetProvisioningOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupGreenFleetProvisioningOptionPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupGreenFleetProvisioningOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.GreenFleetProvisioningOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.GreenFleetProvisioningOptionProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlueInstanceTerminationOptionProperty`
 *
 * @param properties - the TypeScript properties of a `BlueInstanceTerminationOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupBlueInstanceTerminationOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("terminationWaitTimeInMinutes", cdk.validateNumber)(properties.terminationWaitTimeInMinutes));
  return errors.wrap("supplied properties not correct for \"BlueInstanceTerminationOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupBlueInstanceTerminationOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupBlueInstanceTerminationOptionPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "TerminationWaitTimeInMinutes": cdk.numberToCloudFormation(properties.terminationWaitTimeInMinutes)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupBlueInstanceTerminationOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.BlueInstanceTerminationOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.BlueInstanceTerminationOptionProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("terminationWaitTimeInMinutes", "TerminationWaitTimeInMinutes", (properties.TerminationWaitTimeInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TerminationWaitTimeInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlueGreenDeploymentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `BlueGreenDeploymentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentReadyOption", CfnDeploymentGroupDeploymentReadyOptionPropertyValidator)(properties.deploymentReadyOption));
  errors.collect(cdk.propertyValidator("greenFleetProvisioningOption", CfnDeploymentGroupGreenFleetProvisioningOptionPropertyValidator)(properties.greenFleetProvisioningOption));
  errors.collect(cdk.propertyValidator("terminateBlueInstancesOnDeploymentSuccess", CfnDeploymentGroupBlueInstanceTerminationOptionPropertyValidator)(properties.terminateBlueInstancesOnDeploymentSuccess));
  return errors.wrap("supplied properties not correct for \"BlueGreenDeploymentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DeploymentReadyOption": convertCfnDeploymentGroupDeploymentReadyOptionPropertyToCloudFormation(properties.deploymentReadyOption),
    "GreenFleetProvisioningOption": convertCfnDeploymentGroupGreenFleetProvisioningOptionPropertyToCloudFormation(properties.greenFleetProvisioningOption),
    "TerminateBlueInstancesOnDeploymentSuccess": convertCfnDeploymentGroupBlueInstanceTerminationOptionPropertyToCloudFormation(properties.terminateBlueInstancesOnDeploymentSuccess)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty>();
  ret.addPropertyResult("deploymentReadyOption", "DeploymentReadyOption", (properties.DeploymentReadyOption != null ? CfnDeploymentGroupDeploymentReadyOptionPropertyFromCloudFormation(properties.DeploymentReadyOption) : undefined));
  ret.addPropertyResult("greenFleetProvisioningOption", "GreenFleetProvisioningOption", (properties.GreenFleetProvisioningOption != null ? CfnDeploymentGroupGreenFleetProvisioningOptionPropertyFromCloudFormation(properties.GreenFleetProvisioningOption) : undefined));
  ret.addPropertyResult("terminateBlueInstancesOnDeploymentSuccess", "TerminateBlueInstancesOnDeploymentSuccess", (properties.TerminateBlueInstancesOnDeploymentSuccess != null ? CfnDeploymentGroupBlueInstanceTerminationOptionPropertyFromCloudFormation(properties.TerminateBlueInstancesOnDeploymentSuccess) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GitHubLocationProperty`
 *
 * @param properties - the TypeScript properties of a `GitHubLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupGitHubLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("commitId", cdk.requiredValidator)(properties.commitId));
  errors.collect(cdk.propertyValidator("commitId", cdk.validateString)(properties.commitId));
  errors.collect(cdk.propertyValidator("repository", cdk.requiredValidator)(properties.repository));
  errors.collect(cdk.propertyValidator("repository", cdk.validateString)(properties.repository));
  return errors.wrap("supplied properties not correct for \"GitHubLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupGitHubLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupGitHubLocationPropertyValidator(properties).assertSuccess();
  return {
    "CommitId": cdk.stringToCloudFormation(properties.commitId),
    "Repository": cdk.stringToCloudFormation(properties.repository)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupGitHubLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.GitHubLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.GitHubLocationProperty>();
  ret.addPropertyResult("commitId", "CommitId", (properties.CommitId != null ? cfn_parse.FromCloudFormation.getString(properties.CommitId) : undefined));
  ret.addPropertyResult("repository", "Repository", (properties.Repository != null ? cfn_parse.FromCloudFormation.getString(properties.Repository) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("bundleType", cdk.validateString)(properties.bundleType));
  errors.collect(cdk.propertyValidator("eTag", cdk.validateString)(properties.eTag));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "BundleType": cdk.stringToCloudFormation(properties.bundleType),
    "ETag": cdk.stringToCloudFormation(properties.eTag),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("bundleType", "BundleType", (properties.BundleType != null ? cfn_parse.FromCloudFormation.getString(properties.BundleType) : undefined));
  ret.addPropertyResult("eTag", "ETag", (properties.ETag != null ? cfn_parse.FromCloudFormation.getString(properties.ETag) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RevisionLocationProperty`
 *
 * @param properties - the TypeScript properties of a `RevisionLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupRevisionLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gitHubLocation", CfnDeploymentGroupGitHubLocationPropertyValidator)(properties.gitHubLocation));
  errors.collect(cdk.propertyValidator("revisionType", cdk.validateString)(properties.revisionType));
  errors.collect(cdk.propertyValidator("s3Location", CfnDeploymentGroupS3LocationPropertyValidator)(properties.s3Location));
  return errors.wrap("supplied properties not correct for \"RevisionLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupRevisionLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupRevisionLocationPropertyValidator(properties).assertSuccess();
  return {
    "GitHubLocation": convertCfnDeploymentGroupGitHubLocationPropertyToCloudFormation(properties.gitHubLocation),
    "RevisionType": cdk.stringToCloudFormation(properties.revisionType),
    "S3Location": convertCfnDeploymentGroupS3LocationPropertyToCloudFormation(properties.s3Location)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupRevisionLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.RevisionLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.RevisionLocationProperty>();
  ret.addPropertyResult("gitHubLocation", "GitHubLocation", (properties.GitHubLocation != null ? CfnDeploymentGroupGitHubLocationPropertyFromCloudFormation(properties.GitHubLocation) : undefined));
  ret.addPropertyResult("revisionType", "RevisionType", (properties.RevisionType != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionType) : undefined));
  ret.addPropertyResult("s3Location", "S3Location", (properties.S3Location != null ? CfnDeploymentGroupS3LocationPropertyFromCloudFormation(properties.S3Location) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ignoreApplicationStopFailures", cdk.validateBoolean)(properties.ignoreApplicationStopFailures));
  errors.collect(cdk.propertyValidator("revision", cdk.requiredValidator)(properties.revision));
  errors.collect(cdk.propertyValidator("revision", CfnDeploymentGroupRevisionLocationPropertyValidator)(properties.revision));
  return errors.wrap("supplied properties not correct for \"DeploymentProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupDeploymentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupDeploymentPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "IgnoreApplicationStopFailures": cdk.booleanToCloudFormation(properties.ignoreApplicationStopFailures),
    "Revision": convertCfnDeploymentGroupRevisionLocationPropertyToCloudFormation(properties.revision)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.DeploymentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.DeploymentProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ignoreApplicationStopFailures", "IgnoreApplicationStopFailures", (properties.IgnoreApplicationStopFailures != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnoreApplicationStopFailures) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? CfnDeploymentGroupRevisionLocationPropertyFromCloudFormation(properties.Revision) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentStyleProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentStyleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentStylePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentOption", cdk.validateString)(properties.deploymentOption));
  errors.collect(cdk.propertyValidator("deploymentType", cdk.validateString)(properties.deploymentType));
  return errors.wrap("supplied properties not correct for \"DeploymentStyleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupDeploymentStylePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupDeploymentStylePropertyValidator(properties).assertSuccess();
  return {
    "DeploymentOption": cdk.stringToCloudFormation(properties.deploymentOption),
    "DeploymentType": cdk.stringToCloudFormation(properties.deploymentType)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupDeploymentStylePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.DeploymentStyleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.DeploymentStyleProperty>();
  ret.addPropertyResult("deploymentOption", "DeploymentOption", (properties.DeploymentOption != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentOption) : undefined));
  ret.addPropertyResult("deploymentType", "DeploymentType", (properties.DeploymentType != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ECSServiceProperty`
 *
 * @param properties - the TypeScript properties of a `ECSServiceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupECSServicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.requiredValidator)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  return errors.wrap("supplied properties not correct for \"ECSServiceProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupECSServicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupECSServicePropertyValidator(properties).assertSuccess();
  return {
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupECSServicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.ECSServiceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.ECSServiceProperty>();
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EC2TagFilterProperty`
 *
 * @param properties - the TypeScript properties of a `EC2TagFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EC2TagFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupEC2TagFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupEC2TagFilterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.EC2TagFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.EC2TagFilterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EC2TagSetListObjectProperty`
 *
 * @param properties - the TypeScript properties of a `EC2TagSetListObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagSetListObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ec2TagGroup", cdk.listValidator(CfnDeploymentGroupEC2TagFilterPropertyValidator))(properties.ec2TagGroup));
  return errors.wrap("supplied properties not correct for \"EC2TagSetListObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupEC2TagSetListObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupEC2TagSetListObjectPropertyValidator(properties).assertSuccess();
  return {
    "Ec2TagGroup": cdk.listMapper(convertCfnDeploymentGroupEC2TagFilterPropertyToCloudFormation)(properties.ec2TagGroup)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagSetListObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.EC2TagSetListObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.EC2TagSetListObjectProperty>();
  ret.addPropertyResult("ec2TagGroup", "Ec2TagGroup", (properties.Ec2TagGroup != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupEC2TagFilterPropertyFromCloudFormation)(properties.Ec2TagGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EC2TagSetProperty`
 *
 * @param properties - the TypeScript properties of a `EC2TagSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ec2TagSetList", cdk.listValidator(CfnDeploymentGroupEC2TagSetListObjectPropertyValidator))(properties.ec2TagSetList));
  return errors.wrap("supplied properties not correct for \"EC2TagSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupEC2TagSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupEC2TagSetPropertyValidator(properties).assertSuccess();
  return {
    "Ec2TagSetList": cdk.listMapper(convertCfnDeploymentGroupEC2TagSetListObjectPropertyToCloudFormation)(properties.ec2TagSetList)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupEC2TagSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.EC2TagSetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.EC2TagSetProperty>();
  ret.addPropertyResult("ec2TagSetList", "Ec2TagSetList", (properties.Ec2TagSetList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupEC2TagSetListObjectPropertyFromCloudFormation)(properties.Ec2TagSetList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ELBInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ELBInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupELBInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ELBInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupELBInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupELBInfoPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupELBInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroup.ELBInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.ELBInfoProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupInfoProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupTargetGroupInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"TargetGroupInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupTargetGroupInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupTargetGroupInfoPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupTargetGroupInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.TargetGroupInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.TargetGroupInfoProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrafficRouteProperty`
 *
 * @param properties - the TypeScript properties of a `TrafficRouteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupTrafficRoutePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("listenerArns", cdk.listValidator(cdk.validateString))(properties.listenerArns));
  return errors.wrap("supplied properties not correct for \"TrafficRouteProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupTrafficRoutePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupTrafficRoutePropertyValidator(properties).assertSuccess();
  return {
    "ListenerArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.listenerArns)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupTrafficRoutePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.TrafficRouteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.TrafficRouteProperty>();
  ret.addPropertyResult("listenerArns", "ListenerArns", (properties.ListenerArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ListenerArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupPairInfoProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupPairInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupTargetGroupPairInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("prodTrafficRoute", CfnDeploymentGroupTrafficRoutePropertyValidator)(properties.prodTrafficRoute));
  errors.collect(cdk.propertyValidator("targetGroups", cdk.listValidator(CfnDeploymentGroupTargetGroupInfoPropertyValidator))(properties.targetGroups));
  errors.collect(cdk.propertyValidator("testTrafficRoute", CfnDeploymentGroupTrafficRoutePropertyValidator)(properties.testTrafficRoute));
  return errors.wrap("supplied properties not correct for \"TargetGroupPairInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupTargetGroupPairInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupTargetGroupPairInfoPropertyValidator(properties).assertSuccess();
  return {
    "ProdTrafficRoute": convertCfnDeploymentGroupTrafficRoutePropertyToCloudFormation(properties.prodTrafficRoute),
    "TargetGroups": cdk.listMapper(convertCfnDeploymentGroupTargetGroupInfoPropertyToCloudFormation)(properties.targetGroups),
    "TestTrafficRoute": convertCfnDeploymentGroupTrafficRoutePropertyToCloudFormation(properties.testTrafficRoute)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupTargetGroupPairInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.TargetGroupPairInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.TargetGroupPairInfoProperty>();
  ret.addPropertyResult("prodTrafficRoute", "ProdTrafficRoute", (properties.ProdTrafficRoute != null ? CfnDeploymentGroupTrafficRoutePropertyFromCloudFormation(properties.ProdTrafficRoute) : undefined));
  ret.addPropertyResult("targetGroups", "TargetGroups", (properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTargetGroupInfoPropertyFromCloudFormation)(properties.TargetGroups) : undefined));
  ret.addPropertyResult("testTrafficRoute", "TestTrafficRoute", (properties.TestTrafficRoute != null ? CfnDeploymentGroupTrafficRoutePropertyFromCloudFormation(properties.TestTrafficRoute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoadBalancerInfoProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBalancerInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupLoadBalancerInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("elbInfoList", cdk.listValidator(CfnDeploymentGroupELBInfoPropertyValidator))(properties.elbInfoList));
  errors.collect(cdk.propertyValidator("targetGroupInfoList", cdk.listValidator(CfnDeploymentGroupTargetGroupInfoPropertyValidator))(properties.targetGroupInfoList));
  errors.collect(cdk.propertyValidator("targetGroupPairInfoList", cdk.listValidator(CfnDeploymentGroupTargetGroupPairInfoPropertyValidator))(properties.targetGroupPairInfoList));
  return errors.wrap("supplied properties not correct for \"LoadBalancerInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupLoadBalancerInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupLoadBalancerInfoPropertyValidator(properties).assertSuccess();
  return {
    "ElbInfoList": cdk.listMapper(convertCfnDeploymentGroupELBInfoPropertyToCloudFormation)(properties.elbInfoList),
    "TargetGroupInfoList": cdk.listMapper(convertCfnDeploymentGroupTargetGroupInfoPropertyToCloudFormation)(properties.targetGroupInfoList),
    "TargetGroupPairInfoList": cdk.listMapper(convertCfnDeploymentGroupTargetGroupPairInfoPropertyToCloudFormation)(properties.targetGroupPairInfoList)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupLoadBalancerInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.LoadBalancerInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.LoadBalancerInfoProperty>();
  ret.addPropertyResult("elbInfoList", "ElbInfoList", (properties.ElbInfoList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupELBInfoPropertyFromCloudFormation)(properties.ElbInfoList) : undefined));
  ret.addPropertyResult("targetGroupInfoList", "TargetGroupInfoList", (properties.TargetGroupInfoList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTargetGroupInfoPropertyFromCloudFormation)(properties.TargetGroupInfoList) : undefined));
  ret.addPropertyResult("targetGroupPairInfoList", "TargetGroupPairInfoList", (properties.TargetGroupPairInfoList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTargetGroupPairInfoPropertyFromCloudFormation)(properties.TargetGroupPairInfoList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagFilterProperty`
 *
 * @param properties - the TypeScript properties of a `TagFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupTagFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupTagFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupTagFilterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupTagFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.TagFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.TagFilterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnPremisesTagSetListObjectProperty`
 *
 * @param properties - the TypeScript properties of a `OnPremisesTagSetListObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupOnPremisesTagSetListObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onPremisesTagGroup", cdk.listValidator(CfnDeploymentGroupTagFilterPropertyValidator))(properties.onPremisesTagGroup));
  return errors.wrap("supplied properties not correct for \"OnPremisesTagSetListObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupOnPremisesTagSetListObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupOnPremisesTagSetListObjectPropertyValidator(properties).assertSuccess();
  return {
    "OnPremisesTagGroup": cdk.listMapper(convertCfnDeploymentGroupTagFilterPropertyToCloudFormation)(properties.onPremisesTagGroup)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupOnPremisesTagSetListObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.OnPremisesTagSetListObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.OnPremisesTagSetListObjectProperty>();
  ret.addPropertyResult("onPremisesTagGroup", "OnPremisesTagGroup", (properties.OnPremisesTagGroup != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTagFilterPropertyFromCloudFormation)(properties.OnPremisesTagGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnPremisesTagSetProperty`
 *
 * @param properties - the TypeScript properties of a `OnPremisesTagSetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupOnPremisesTagSetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onPremisesTagSetList", cdk.listValidator(CfnDeploymentGroupOnPremisesTagSetListObjectPropertyValidator))(properties.onPremisesTagSetList));
  return errors.wrap("supplied properties not correct for \"OnPremisesTagSetProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupOnPremisesTagSetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupOnPremisesTagSetPropertyValidator(properties).assertSuccess();
  return {
    "OnPremisesTagSetList": cdk.listMapper(convertCfnDeploymentGroupOnPremisesTagSetListObjectPropertyToCloudFormation)(properties.onPremisesTagSetList)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupOnPremisesTagSetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.OnPremisesTagSetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.OnPremisesTagSetProperty>();
  ret.addPropertyResult("onPremisesTagSetList", "OnPremisesTagSetList", (properties.OnPremisesTagSetList != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupOnPremisesTagSetListObjectPropertyFromCloudFormation)(properties.OnPremisesTagSetList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TriggerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupTriggerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("triggerEvents", cdk.listValidator(cdk.validateString))(properties.triggerEvents));
  errors.collect(cdk.propertyValidator("triggerName", cdk.validateString)(properties.triggerName));
  errors.collect(cdk.propertyValidator("triggerTargetArn", cdk.validateString)(properties.triggerTargetArn));
  return errors.wrap("supplied properties not correct for \"TriggerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupTriggerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupTriggerConfigPropertyValidator(properties).assertSuccess();
  return {
    "TriggerEvents": cdk.listMapper(cdk.stringToCloudFormation)(properties.triggerEvents),
    "TriggerName": cdk.stringToCloudFormation(properties.triggerName),
    "TriggerTargetArn": cdk.stringToCloudFormation(properties.triggerTargetArn)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupTriggerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeploymentGroup.TriggerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroup.TriggerConfigProperty>();
  ret.addPropertyResult("triggerEvents", "TriggerEvents", (properties.TriggerEvents != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TriggerEvents) : undefined));
  ret.addPropertyResult("triggerName", "TriggerName", (properties.TriggerName != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerName) : undefined));
  ret.addPropertyResult("triggerTargetArn", "TriggerTargetArn", (properties.TriggerTargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerTargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeploymentGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmConfiguration", CfnDeploymentGroupAlarmConfigurationPropertyValidator)(properties.alarmConfiguration));
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("autoRollbackConfiguration", CfnDeploymentGroupAutoRollbackConfigurationPropertyValidator)(properties.autoRollbackConfiguration));
  errors.collect(cdk.propertyValidator("autoScalingGroups", cdk.listValidator(cdk.validateString))(properties.autoScalingGroups));
  errors.collect(cdk.propertyValidator("blueGreenDeploymentConfiguration", CfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyValidator)(properties.blueGreenDeploymentConfiguration));
  errors.collect(cdk.propertyValidator("deployment", CfnDeploymentGroupDeploymentPropertyValidator)(properties.deployment));
  errors.collect(cdk.propertyValidator("deploymentConfigName", cdk.validateString)(properties.deploymentConfigName));
  errors.collect(cdk.propertyValidator("deploymentGroupName", cdk.validateString)(properties.deploymentGroupName));
  errors.collect(cdk.propertyValidator("deploymentStyle", CfnDeploymentGroupDeploymentStylePropertyValidator)(properties.deploymentStyle));
  errors.collect(cdk.propertyValidator("ecsServices", cdk.listValidator(CfnDeploymentGroupECSServicePropertyValidator))(properties.ecsServices));
  errors.collect(cdk.propertyValidator("ec2TagFilters", cdk.listValidator(CfnDeploymentGroupEC2TagFilterPropertyValidator))(properties.ec2TagFilters));
  errors.collect(cdk.propertyValidator("ec2TagSet", CfnDeploymentGroupEC2TagSetPropertyValidator)(properties.ec2TagSet));
  errors.collect(cdk.propertyValidator("loadBalancerInfo", CfnDeploymentGroupLoadBalancerInfoPropertyValidator)(properties.loadBalancerInfo));
  errors.collect(cdk.propertyValidator("onPremisesInstanceTagFilters", cdk.listValidator(CfnDeploymentGroupTagFilterPropertyValidator))(properties.onPremisesInstanceTagFilters));
  errors.collect(cdk.propertyValidator("onPremisesTagSet", CfnDeploymentGroupOnPremisesTagSetPropertyValidator)(properties.onPremisesTagSet));
  errors.collect(cdk.propertyValidator("outdatedInstancesStrategy", cdk.validateString)(properties.outdatedInstancesStrategy));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.requiredValidator)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("terminationHookEnabled", cdk.validateBoolean)(properties.terminationHookEnabled));
  errors.collect(cdk.propertyValidator("triggerConfigurations", cdk.listValidator(CfnDeploymentGroupTriggerConfigPropertyValidator))(properties.triggerConfigurations));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentGroupPropsValidator(properties).assertSuccess();
  return {
    "AlarmConfiguration": convertCfnDeploymentGroupAlarmConfigurationPropertyToCloudFormation(properties.alarmConfiguration),
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "AutoRollbackConfiguration": convertCfnDeploymentGroupAutoRollbackConfigurationPropertyToCloudFormation(properties.autoRollbackConfiguration),
    "AutoScalingGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.autoScalingGroups),
    "BlueGreenDeploymentConfiguration": convertCfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyToCloudFormation(properties.blueGreenDeploymentConfiguration),
    "Deployment": convertCfnDeploymentGroupDeploymentPropertyToCloudFormation(properties.deployment),
    "DeploymentConfigName": cdk.stringToCloudFormation(properties.deploymentConfigName),
    "DeploymentGroupName": cdk.stringToCloudFormation(properties.deploymentGroupName),
    "DeploymentStyle": convertCfnDeploymentGroupDeploymentStylePropertyToCloudFormation(properties.deploymentStyle),
    "ECSServices": cdk.listMapper(convertCfnDeploymentGroupECSServicePropertyToCloudFormation)(properties.ecsServices),
    "Ec2TagFilters": cdk.listMapper(convertCfnDeploymentGroupEC2TagFilterPropertyToCloudFormation)(properties.ec2TagFilters),
    "Ec2TagSet": convertCfnDeploymentGroupEC2TagSetPropertyToCloudFormation(properties.ec2TagSet),
    "LoadBalancerInfo": convertCfnDeploymentGroupLoadBalancerInfoPropertyToCloudFormation(properties.loadBalancerInfo),
    "OnPremisesInstanceTagFilters": cdk.listMapper(convertCfnDeploymentGroupTagFilterPropertyToCloudFormation)(properties.onPremisesInstanceTagFilters),
    "OnPremisesTagSet": convertCfnDeploymentGroupOnPremisesTagSetPropertyToCloudFormation(properties.onPremisesTagSet),
    "OutdatedInstancesStrategy": cdk.stringToCloudFormation(properties.outdatedInstancesStrategy),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TerminationHookEnabled": cdk.booleanToCloudFormation(properties.terminationHookEnabled),
    "TriggerConfigurations": cdk.listMapper(convertCfnDeploymentGroupTriggerConfigPropertyToCloudFormation)(properties.triggerConfigurations)
  };
}

// @ts-ignore TS6133
function CfnDeploymentGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeploymentGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeploymentGroupProps>();
  ret.addPropertyResult("alarmConfiguration", "AlarmConfiguration", (properties.AlarmConfiguration != null ? CfnDeploymentGroupAlarmConfigurationPropertyFromCloudFormation(properties.AlarmConfiguration) : undefined));
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("autoRollbackConfiguration", "AutoRollbackConfiguration", (properties.AutoRollbackConfiguration != null ? CfnDeploymentGroupAutoRollbackConfigurationPropertyFromCloudFormation(properties.AutoRollbackConfiguration) : undefined));
  ret.addPropertyResult("autoScalingGroups", "AutoScalingGroups", (properties.AutoScalingGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AutoScalingGroups) : undefined));
  ret.addPropertyResult("blueGreenDeploymentConfiguration", "BlueGreenDeploymentConfiguration", (properties.BlueGreenDeploymentConfiguration != null ? CfnDeploymentGroupBlueGreenDeploymentConfigurationPropertyFromCloudFormation(properties.BlueGreenDeploymentConfiguration) : undefined));
  ret.addPropertyResult("deployment", "Deployment", (properties.Deployment != null ? CfnDeploymentGroupDeploymentPropertyFromCloudFormation(properties.Deployment) : undefined));
  ret.addPropertyResult("deploymentConfigName", "DeploymentConfigName", (properties.DeploymentConfigName != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentConfigName) : undefined));
  ret.addPropertyResult("deploymentGroupName", "DeploymentGroupName", (properties.DeploymentGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentGroupName) : undefined));
  ret.addPropertyResult("deploymentStyle", "DeploymentStyle", (properties.DeploymentStyle != null ? CfnDeploymentGroupDeploymentStylePropertyFromCloudFormation(properties.DeploymentStyle) : undefined));
  ret.addPropertyResult("ec2TagFilters", "Ec2TagFilters", (properties.Ec2TagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupEC2TagFilterPropertyFromCloudFormation)(properties.Ec2TagFilters) : undefined));
  ret.addPropertyResult("ec2TagSet", "Ec2TagSet", (properties.Ec2TagSet != null ? CfnDeploymentGroupEC2TagSetPropertyFromCloudFormation(properties.Ec2TagSet) : undefined));
  ret.addPropertyResult("ecsServices", "ECSServices", (properties.ECSServices != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupECSServicePropertyFromCloudFormation)(properties.ECSServices) : undefined));
  ret.addPropertyResult("loadBalancerInfo", "LoadBalancerInfo", (properties.LoadBalancerInfo != null ? CfnDeploymentGroupLoadBalancerInfoPropertyFromCloudFormation(properties.LoadBalancerInfo) : undefined));
  ret.addPropertyResult("onPremisesInstanceTagFilters", "OnPremisesInstanceTagFilters", (properties.OnPremisesInstanceTagFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTagFilterPropertyFromCloudFormation)(properties.OnPremisesInstanceTagFilters) : undefined));
  ret.addPropertyResult("onPremisesTagSet", "OnPremisesTagSet", (properties.OnPremisesTagSet != null ? CfnDeploymentGroupOnPremisesTagSetPropertyFromCloudFormation(properties.OnPremisesTagSet) : undefined));
  ret.addPropertyResult("outdatedInstancesStrategy", "OutdatedInstancesStrategy", (properties.OutdatedInstancesStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.OutdatedInstancesStrategy) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("terminationHookEnabled", "TerminationHookEnabled", (properties.TerminationHookEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminationHookEnabled) : undefined));
  ret.addPropertyResult("triggerConfigurations", "TriggerConfigurations", (properties.TriggerConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDeploymentGroupTriggerConfigPropertyFromCloudFormation)(properties.TriggerConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}