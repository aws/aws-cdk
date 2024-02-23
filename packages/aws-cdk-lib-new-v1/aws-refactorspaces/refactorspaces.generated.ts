/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an AWS Migration Hub Refactor Spaces application.
 *
 * The account that owns the environment also owns the applications created inside the environment, regardless of the account that creates the application. Refactor Spaces provisions an Amazon API Gateway , API Gateway VPC link, and Network Load Balancer for the application proxy inside your account.
 *
 * In environments created with a [CreateEnvironment:NetworkFabricType](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/APIReference/API_CreateEnvironment.html#migrationhubrefactorspaces-CreateEnvironment-request-NetworkFabricType) of `NONE` you need to configure [VPC to VPC connectivity](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/amazon-vpc-to-amazon-vpc-connectivity-options.html) between your service VPC and the application proxy VPC to route traffic through the application proxy to a service with a private URL endpoint. For more information, see [Create an application](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/userguide/getting-started-create-application.html) in the *Refactor Spaces User Guide* .
 *
 * @cloudformationResource AWS::RefactorSpaces::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RefactorSpaces::Application";

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
   * The resource ID of the API Gateway for the proxy.
   *
   * @cloudformationAttribute ApiGatewayId
   */
  public readonly attrApiGatewayId: string;

  /**
   * The unique identifier of the application.
   *
   * @cloudformationAttribute ApplicationIdentifier
   */
  public readonly attrApplicationIdentifier: string;

  /**
   * The Amazon Resource Name (ARN) of the application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Name (ARN) of the Network Load Balancer .
   *
   * @cloudformationAttribute NlbArn
   */
  public readonly attrNlbArn: string;

  /**
   * The name of the Network Load Balancer configured by the API Gateway proxy.
   *
   * @cloudformationAttribute NlbName
   */
  public readonly attrNlbName: string;

  /**
   * The endpoint URL of the Amazon API Gateway proxy.
   *
   * @cloudformationAttribute ProxyUrl
   */
  public readonly attrProxyUrl: string;

  /**
   * The name of the API Gateway stage. The name defaults to `prod` .
   *
   * @cloudformationAttribute StageName
   */
  public readonly attrStageName: string;

  /**
   * The `VpcLink` ID of the API Gateway proxy.
   *
   * @cloudformationAttribute VpcLinkId
   */
  public readonly attrVpcLinkId: string;

  /**
   * The endpoint URL of the Amazon API Gateway proxy.
   */
  public apiGatewayProxy?: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable;

  /**
   * The unique identifier of the environment.
   */
  public environmentIdentifier: string;

  /**
   * The name of the application.
   */
  public name: string;

  /**
   * The proxy type of the proxy created within the application.
   */
  public proxyType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the application.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ID of the virtual private cloud (VPC).
   */
  public vpcId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "environmentIdentifier", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "proxyType", this);
    cdk.requireProperty(props, "vpcId", this);

    this.attrApiGatewayId = cdk.Token.asString(this.getAtt("ApiGatewayId", cdk.ResolutionTypeHint.STRING));
    this.attrApplicationIdentifier = cdk.Token.asString(this.getAtt("ApplicationIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrNlbArn = cdk.Token.asString(this.getAtt("NlbArn", cdk.ResolutionTypeHint.STRING));
    this.attrNlbName = cdk.Token.asString(this.getAtt("NlbName", cdk.ResolutionTypeHint.STRING));
    this.attrProxyUrl = cdk.Token.asString(this.getAtt("ProxyUrl", cdk.ResolutionTypeHint.STRING));
    this.attrStageName = cdk.Token.asString(this.getAtt("StageName", cdk.ResolutionTypeHint.STRING));
    this.attrVpcLinkId = cdk.Token.asString(this.getAtt("VpcLinkId", cdk.ResolutionTypeHint.STRING));
    this.apiGatewayProxy = props.apiGatewayProxy;
    this.environmentIdentifier = props.environmentIdentifier;
    this.name = props.name;
    this.proxyType = props.proxyType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiGatewayProxy": this.apiGatewayProxy,
      "environmentIdentifier": this.environmentIdentifier,
      "name": this.name,
      "proxyType": this.proxyType,
      "tags": this.tags.renderTags(),
      "vpcId": this.vpcId
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

export namespace CfnApplication {
  /**
   * A wrapper object holding the Amazon API Gateway endpoint input.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html
   */
  export interface ApiGatewayProxyInputProperty {
    /**
     * The type of endpoint to use for the API Gateway proxy.
     *
     * If no value is specified in the request, the value is set to `REGIONAL` by default.
     *
     * If the value is set to `PRIVATE` in the request, this creates a private API endpoint that is isolated from the public internet. The private endpoint can only be accessed by using Amazon Virtual Private Cloud ( Amazon VPC ) interface endpoints for the Amazon API Gateway that has been granted access. For more information about creating a private connection with Refactor Spaces and interface endpoint ( AWS PrivateLink ) availability, see [Access Refactor Spaces using an interface endpoint ( AWS PrivateLink )](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/userguide/vpc-interface-endpoints.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-endpointtype
     */
    readonly endpointType?: string;

    /**
     * The name of the API Gateway stage.
     *
     * The name defaults to `prod` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-stagename
     */
    readonly stageName?: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export interface CfnApplicationProps {
  /**
   * The endpoint URL of the Amazon API Gateway proxy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-apigatewayproxy
   */
  readonly apiGatewayProxy?: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable;

  /**
   * The unique identifier of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-environmentidentifier
   */
  readonly environmentIdentifier: string;

  /**
   * The name of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-name
   */
  readonly name: string;

  /**
   * The proxy type of the proxy created within the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-proxytype
   */
  readonly proxyType: string;

  /**
   * The tags assigned to the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ID of the virtual private cloud (VPC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-vpcid
   */
  readonly vpcId: string;
}

/**
 * Determine whether the given properties match those of a `ApiGatewayProxyInputProperty`
 *
 * @param properties - the TypeScript properties of a `ApiGatewayProxyInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationApiGatewayProxyInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  return errors.wrap("supplied properties not correct for \"ApiGatewayProxyInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationApiGatewayProxyInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationApiGatewayProxyInputPropertyValidator(properties).assertSuccess();
  return {
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "StageName": cdk.stringToCloudFormation(properties.stageName)
  };
}

// @ts-ignore TS6133
function CfnApplicationApiGatewayProxyInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApiGatewayProxyInputProperty>();
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
  errors.collect(cdk.propertyValidator("apiGatewayProxy", CfnApplicationApiGatewayProxyInputPropertyValidator)(properties.apiGatewayProxy));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.requiredValidator)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.validateString)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("proxyType", cdk.requiredValidator)(properties.proxyType));
  errors.collect(cdk.propertyValidator("proxyType", cdk.validateString)(properties.proxyType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "ApiGatewayProxy": convertCfnApplicationApiGatewayProxyInputPropertyToCloudFormation(properties.apiGatewayProxy),
    "EnvironmentIdentifier": cdk.stringToCloudFormation(properties.environmentIdentifier),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProxyType": cdk.stringToCloudFormation(properties.proxyType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
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
  ret.addPropertyResult("apiGatewayProxy", "ApiGatewayProxy", (properties.ApiGatewayProxy != null ? CfnApplicationApiGatewayProxyInputPropertyFromCloudFormation(properties.ApiGatewayProxy) : undefined));
  ret.addPropertyResult("environmentIdentifier", "EnvironmentIdentifier", (properties.EnvironmentIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("proxyType", "ProxyType", (properties.ProxyType != null ? cfn_parse.FromCloudFormation.getString(properties.ProxyType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an AWS Migration Hub Refactor Spaces environment.
 *
 * The caller owns the environment resource, and all Refactor Spaces applications, services, and routes created within the environment. They are referred to as the *environment owner* . The environment owner has cross-account visibility and control of Refactor Spaces resources that are added to the environment by other accounts that the environment is shared with.
 *
 * When creating an environment with a [CreateEnvironment:NetworkFabricType](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/APIReference/API_CreateEnvironment.html#migrationhubrefactorspaces-CreateEnvironment-request-NetworkFabricType) of `TRANSIT_GATEWAY` , Refactor Spaces provisions a transit gateway to enable services in VPCs to communicate directly across accounts. If [CreateEnvironment:NetworkFabricType](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/APIReference/API_CreateEnvironment.html#migrationhubrefactorspaces-CreateEnvironment-request-NetworkFabricType) is `NONE` , Refactor Spaces does not create a transit gateway and you must use your network infrastructure to route traffic to services with private URL endpoints.
 *
 * @cloudformationResource AWS::RefactorSpaces::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RefactorSpaces::Environment";

  /**
   * Build a CfnEnvironment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the environment.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the environment.
   *
   * @cloudformationAttribute EnvironmentIdentifier
   */
  public readonly attrEnvironmentIdentifier: string;

  /**
   * The ID of the AWS Transit Gateway set up by the environment.
   *
   * @cloudformationAttribute TransitGatewayId
   */
  public readonly attrTransitGatewayId: string;

  /**
   * A description of the environment.
   */
  public description?: string;

  /**
   * The name of the environment.
   */
  public name: string;

  /**
   * The network fabric type of the environment.
   */
  public networkFabricType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the environment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
    super(scope, id, {
      "type": CfnEnvironment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "networkFabricType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEnvironmentIdentifier = cdk.Token.asString(this.getAtt("EnvironmentIdentifier", cdk.ResolutionTypeHint.STRING));
    this.attrTransitGatewayId = cdk.Token.asString(this.getAtt("TransitGatewayId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.networkFabricType = props.networkFabricType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Environment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "networkFabricType": this.networkFabricType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * A description of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-description
   */
  readonly description?: string;

  /**
   * The name of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-name
   */
  readonly name: string;

  /**
   * The network fabric type of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-networkfabrictype
   */
  readonly networkFabricType: string;

  /**
   * The tags assigned to the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkFabricType", cdk.requiredValidator)(properties.networkFabricType));
  errors.collect(cdk.propertyValidator("networkFabricType", cdk.validateString)(properties.networkFabricType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkFabricType": cdk.stringToCloudFormation(properties.networkFabricType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkFabricType", "NetworkFabricType", (properties.NetworkFabricType != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkFabricType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an AWS Migration Hub Refactor Spaces route.
 *
 * The account owner of the service resource is always the environment owner, regardless of which account creates the route. Routes target a service in the application. If an application does not have any routes, then the first route must be created as a `DEFAULT` `RouteType` .
 *
 * When created, the default route defaults to an active state so state is not a required input. However, like all other state values the state of the default route can be updated after creation, but only when all other routes are also inactive. Conversely, no route can be active without the default route also being active.
 *
 * > In the `AWS::RefactorSpaces::Route` resource, you can only update the `ActivationState` property, which resides under the `UriPathRoute` and `DefaultRoute` properties. All other properties associated with the `AWS::RefactorSpaces::Route` cannot be updated, even though the property description might indicate otherwise. Updating all other properties will result in the replacement of Route.
 *
 * When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic to the target service as follows:
 *
 * - *URL Endpoints*
 *
 * If the service has a URL endpoint, and the endpoint resolves to a private IP address, Refactor Spaces routes traffic using the API Gateway VPC link. If a service endpoint resolves to a public IP address, Refactor Spaces routes traffic over the public internet. Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed certificates are supported. Private Certificate Authorities (CAs) are permitted only if the CA's domain is also publicly resolvable.
 *
 * Refactor Spaces automatically resolves the public Domain Name System (DNS) names that are set in `CreateService:UrlEndpoint` when you create a service. The DNS names resolve when the DNS time-to-live (TTL) expires, or every 60 seconds for TTLs less than 60 seconds. This periodic DNS resolution ensures that the route configuration remains up-to-date.
 *
 * *One-time health check*
 *
 * A one-time health check is performed on the service when either the route is updated from inactive to active, or when it is created with an active state. If the health check fails, the route transitions the route state to `FAILED` , an error code of `SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE` is provided, and no traffic is sent to the service.
 *
 * For private URLs, a target group is created on the Network Load Balancer and the load balancer target group runs default target health checks. By default, the health check is run against the service endpoint URL. Optionally, the health check can be performed against a different protocol, port, and/or path using the [CreateService:UrlEndpoint](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/APIReference/API_CreateService.html#migrationhubrefactorspaces-CreateService-request-UrlEndpoint) parameter. All other health check settings for the load balancer use the default values described in the [Health checks for your target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) in the *Elastic Load Balancing guide* . The health check is considered successful if at least one target within the target group transitions to a healthy state.
 * - *AWS Lambda function endpoints*
 *
 * If the service has an AWS Lambda function endpoint, then Refactor Spaces configures the Lambda function's resource policy to allow the application's API Gateway to invoke the function.
 *
 * The Lambda function state is checked. If the function is not active, the function configuration is updated so that Lambda resources are provisioned. If the Lambda state is `Failed` , then the route creation fails. For more information, see the [GetFunctionConfiguration's State response parameter](https://docs.aws.amazon.com/lambda/latest/dg/API_GetFunctionConfiguration.html#SSS-GetFunctionConfiguration-response-State) in the *AWS Lambda Developer Guide* .
 *
 * A check is performed to determine that a Lambda function with the specified ARN exists. If it does not exist, the health check fails. For public URLs, a connection is opened to the public endpoint. If the URL is not reachable, the health check fails.
 *
 * *Environments without a network bridge*
 *
 * When you create environments without a network bridge ( [CreateEnvironment:NetworkFabricType](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/APIReference/API_CreateEnvironment.html#migrationhubrefactorspaces-CreateEnvironment-request-NetworkFabricType) is `NONE)` and you use your own networking infrastructure, you need to configure [VPC to VPC connectivity](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/amazon-vpc-to-amazon-vpc-connectivity-options.html) between your network and the application proxy VPC. Route creation from the application proxy to service endpoints will fail if your network is not configured to connect to the application proxy VPC. For more information, see [Create a route](https://docs.aws.amazon.com/migrationhub-refactor-spaces/latest/userguide/getting-started-create-role.html) in the *Refactor Spaces User Guide* .
 *
 * @cloudformationResource AWS::RefactorSpaces::Route
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export class CfnRoute extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RefactorSpaces::Route";

  /**
   * Build a CfnRoute from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoute {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoutePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoute(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the route.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A mapping of Amazon API Gateway path resources to resource IDs.
   *
   * @cloudformationAttribute PathResourceToId
   */
  public readonly attrPathResourceToId: string;

  /**
   * The unique identifier of the route.
   *
   * @cloudformationAttribute RouteIdentifier
   */
  public readonly attrRouteIdentifier: string;

  /**
   * The unique identifier of the application.
   */
  public applicationIdentifier: string;

  /**
   * Configuration for the default route type.
   */
  public defaultRoute?: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable;

  /**
   * The unique identifier of the environment.
   */
  public environmentIdentifier: string;

  /**
   * The route type of the route.
   */
  public routeType: string;

  /**
   * The unique identifier of the service.
   */
  public serviceIdentifier: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the route.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The configuration for the URI path route type.
   */
  public uriPathRoute?: cdk.IResolvable | CfnRoute.UriPathRouteInputProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRouteProps) {
    super(scope, id, {
      "type": CfnRoute.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationIdentifier", this);
    cdk.requireProperty(props, "environmentIdentifier", this);
    cdk.requireProperty(props, "routeType", this);
    cdk.requireProperty(props, "serviceIdentifier", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrPathResourceToId = cdk.Token.asString(this.getAtt("PathResourceToId", cdk.ResolutionTypeHint.STRING));
    this.attrRouteIdentifier = cdk.Token.asString(this.getAtt("RouteIdentifier", cdk.ResolutionTypeHint.STRING));
    this.applicationIdentifier = props.applicationIdentifier;
    this.defaultRoute = props.defaultRoute;
    this.environmentIdentifier = props.environmentIdentifier;
    this.routeType = props.routeType;
    this.serviceIdentifier = props.serviceIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Route", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.uriPathRoute = props.uriPathRoute;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationIdentifier": this.applicationIdentifier,
      "defaultRoute": this.defaultRoute,
      "environmentIdentifier": this.environmentIdentifier,
      "routeType": this.routeType,
      "serviceIdentifier": this.serviceIdentifier,
      "tags": this.tags.renderTags(),
      "uriPathRoute": this.uriPathRoute
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoute.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoutePropsToCloudFormation(props);
  }
}

export namespace CfnRoute {
  /**
   * The configuration for the URI path route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html
   */
  export interface UriPathRouteInputProperty {
    /**
     * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-activationstate
     */
    readonly activationState: string;

    /**
     * If set to `true` , this option appends the source path to the service URL endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-appendsourcepath
     */
    readonly appendSourcePath?: boolean | cdk.IResolvable;

    /**
     * Indicates whether to match all subpaths of the given source path.
     *
     * If this value is `false` , requests must match the source path exactly before they are forwarded to this route's service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-includechildpaths
     */
    readonly includeChildPaths?: boolean | cdk.IResolvable;

    /**
     * A list of HTTP methods to match.
     *
     * An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-methods
     */
    readonly methods?: Array<string>;

    /**
     * This is the path that Refactor Spaces uses to match traffic.
     *
     * Paths must start with `/` and are relative to the base of the application. To use path parameters in the source path, add a variable in curly braces. For example, the resource path {user} represents a path parameter called 'user'.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-sourcepath
     */
    readonly sourcePath?: string;
  }

  /**
   * The configuration for the default route type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html
   */
  export interface DefaultRouteInputProperty {
    /**
     * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html#cfn-refactorspaces-route-defaultrouteinput-activationstate
     */
    readonly activationState: string;
  }
}

/**
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export interface CfnRouteProps {
  /**
   * The unique identifier of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-applicationidentifier
   */
  readonly applicationIdentifier: string;

  /**
   * Configuration for the default route type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-defaultroute
   */
  readonly defaultRoute?: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable;

  /**
   * The unique identifier of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-environmentidentifier
   */
  readonly environmentIdentifier: string;

  /**
   * The route type of the route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-routetype
   */
  readonly routeType: string;

  /**
   * The unique identifier of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-serviceidentifier
   */
  readonly serviceIdentifier: string;

  /**
   * The tags assigned to the route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The configuration for the URI path route type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-uripathroute
   */
  readonly uriPathRoute?: cdk.IResolvable | CfnRoute.UriPathRouteInputProperty;
}

/**
 * Determine whether the given properties match those of a `UriPathRouteInputProperty`
 *
 * @param properties - the TypeScript properties of a `UriPathRouteInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteUriPathRouteInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activationState", cdk.requiredValidator)(properties.activationState));
  errors.collect(cdk.propertyValidator("activationState", cdk.validateString)(properties.activationState));
  errors.collect(cdk.propertyValidator("appendSourcePath", cdk.validateBoolean)(properties.appendSourcePath));
  errors.collect(cdk.propertyValidator("includeChildPaths", cdk.validateBoolean)(properties.includeChildPaths));
  errors.collect(cdk.propertyValidator("methods", cdk.listValidator(cdk.validateString))(properties.methods));
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"UriPathRouteInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteUriPathRouteInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteUriPathRouteInputPropertyValidator(properties).assertSuccess();
  return {
    "ActivationState": cdk.stringToCloudFormation(properties.activationState),
    "AppendSourcePath": cdk.booleanToCloudFormation(properties.appendSourcePath),
    "IncludeChildPaths": cdk.booleanToCloudFormation(properties.includeChildPaths),
    "Methods": cdk.listMapper(cdk.stringToCloudFormation)(properties.methods),
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnRouteUriPathRouteInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.UriPathRouteInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.UriPathRouteInputProperty>();
  ret.addPropertyResult("activationState", "ActivationState", (properties.ActivationState != null ? cfn_parse.FromCloudFormation.getString(properties.ActivationState) : undefined));
  ret.addPropertyResult("appendSourcePath", "AppendSourcePath", (properties.AppendSourcePath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AppendSourcePath) : undefined));
  ret.addPropertyResult("includeChildPaths", "IncludeChildPaths", (properties.IncludeChildPaths != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeChildPaths) : undefined));
  ret.addPropertyResult("methods", "Methods", (properties.Methods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Methods) : undefined));
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultRouteInputProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultRouteInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteDefaultRouteInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activationState", cdk.requiredValidator)(properties.activationState));
  errors.collect(cdk.propertyValidator("activationState", cdk.validateString)(properties.activationState));
  return errors.wrap("supplied properties not correct for \"DefaultRouteInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteDefaultRouteInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteDefaultRouteInputPropertyValidator(properties).assertSuccess();
  return {
    "ActivationState": cdk.stringToCloudFormation(properties.activationState)
  };
}

// @ts-ignore TS6133
function CfnRouteDefaultRouteInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoute.DefaultRouteInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.DefaultRouteInputProperty>();
  ret.addPropertyResult("activationState", "ActivationState", (properties.ActivationState != null ? cfn_parse.FromCloudFormation.getString(properties.ActivationState) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRouteProps`
 *
 * @param properties - the TypeScript properties of a `CfnRouteProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.requiredValidator)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.validateString)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("defaultRoute", CfnRouteDefaultRouteInputPropertyValidator)(properties.defaultRoute));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.requiredValidator)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.validateString)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("routeType", cdk.requiredValidator)(properties.routeType));
  errors.collect(cdk.propertyValidator("routeType", cdk.validateString)(properties.routeType));
  errors.collect(cdk.propertyValidator("serviceIdentifier", cdk.requiredValidator)(properties.serviceIdentifier));
  errors.collect(cdk.propertyValidator("serviceIdentifier", cdk.validateString)(properties.serviceIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("uriPathRoute", CfnRouteUriPathRouteInputPropertyValidator)(properties.uriPathRoute));
  return errors.wrap("supplied properties not correct for \"CfnRouteProps\"");
}

// @ts-ignore TS6133
function convertCfnRoutePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutePropsValidator(properties).assertSuccess();
  return {
    "ApplicationIdentifier": cdk.stringToCloudFormation(properties.applicationIdentifier),
    "DefaultRoute": convertCfnRouteDefaultRouteInputPropertyToCloudFormation(properties.defaultRoute),
    "EnvironmentIdentifier": cdk.stringToCloudFormation(properties.environmentIdentifier),
    "RouteType": cdk.stringToCloudFormation(properties.routeType),
    "ServiceIdentifier": cdk.stringToCloudFormation(properties.serviceIdentifier),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UriPathRoute": convertCfnRouteUriPathRouteInputPropertyToCloudFormation(properties.uriPathRoute)
  };
}

// @ts-ignore TS6133
function CfnRoutePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteProps>();
  ret.addPropertyResult("applicationIdentifier", "ApplicationIdentifier", (properties.ApplicationIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationIdentifier) : undefined));
  ret.addPropertyResult("defaultRoute", "DefaultRoute", (properties.DefaultRoute != null ? CfnRouteDefaultRouteInputPropertyFromCloudFormation(properties.DefaultRoute) : undefined));
  ret.addPropertyResult("environmentIdentifier", "EnvironmentIdentifier", (properties.EnvironmentIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier) : undefined));
  ret.addPropertyResult("routeType", "RouteType", (properties.RouteType != null ? cfn_parse.FromCloudFormation.getString(properties.RouteType) : undefined));
  ret.addPropertyResult("serviceIdentifier", "ServiceIdentifier", (properties.ServiceIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("uriPathRoute", "UriPathRoute", (properties.UriPathRoute != null ? CfnRouteUriPathRouteInputPropertyFromCloudFormation(properties.UriPathRoute) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an AWS Migration Hub Refactor Spaces service.
 *
 * The account owner of the service is always the environment owner, regardless of which account in the environment creates the service. Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda function endpoint.
 *
 * > If an AWS resource is launched in a service VPC, and you want it to be accessible to all of an environment’s services with VPCs and routes, apply the `RefactorSpacesSecurityGroup` to the resource. Alternatively, to add more cross-account constraints, apply your own security group.
 *
 * @cloudformationResource AWS::RefactorSpaces::Service
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export class CfnService extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RefactorSpaces::Service";

  /**
   * Build a CfnService from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServicePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnService(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the service.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the service.
   *
   * @cloudformationAttribute ServiceIdentifier
   */
  public readonly attrServiceIdentifier: string;

  /**
   * The unique identifier of the application.
   */
  public applicationIdentifier: string;

  /**
   * A description of the service.
   */
  public description?: string;

  /**
   * The endpoint type of the service.
   */
  public endpointType: string;

  /**
   * The unique identifier of the environment.
   */
  public environmentIdentifier: string;

  /**
   * A summary of the configuration for the AWS Lambda endpoint type.
   */
  public lambdaEndpoint?: cdk.IResolvable | CfnService.LambdaEndpointInputProperty;

  /**
   * The name of the service.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the service.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The summary of the configuration for the URL endpoint type.
   */
  public urlEndpoint?: cdk.IResolvable | CfnService.UrlEndpointInputProperty;

  /**
   * The ID of the virtual private cloud (VPC).
   */
  public vpcId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceProps) {
    super(scope, id, {
      "type": CfnService.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationIdentifier", this);
    cdk.requireProperty(props, "endpointType", this);
    cdk.requireProperty(props, "environmentIdentifier", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrServiceIdentifier = cdk.Token.asString(this.getAtt("ServiceIdentifier", cdk.ResolutionTypeHint.STRING));
    this.applicationIdentifier = props.applicationIdentifier;
    this.description = props.description;
    this.endpointType = props.endpointType;
    this.environmentIdentifier = props.environmentIdentifier;
    this.lambdaEndpoint = props.lambdaEndpoint;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RefactorSpaces::Service", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.urlEndpoint = props.urlEndpoint;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationIdentifier": this.applicationIdentifier,
      "description": this.description,
      "endpointType": this.endpointType,
      "environmentIdentifier": this.environmentIdentifier,
      "lambdaEndpoint": this.lambdaEndpoint,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "urlEndpoint": this.urlEndpoint,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnService.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServicePropsToCloudFormation(props);
  }
}

export namespace CfnService {
  /**
   * The input for the AWS Lambda endpoint type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html
   */
  export interface LambdaEndpointInputProperty {
    /**
     * The Amazon Resource Name (ARN) of the Lambda function or alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html#cfn-refactorspaces-service-lambdaendpointinput-arn
     */
    readonly arn: string;
  }

  /**
   * The configuration for the URL endpoint type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html
   */
  export interface UrlEndpointInputProperty {
    /**
     * The health check URL of the URL endpoint type.
     *
     * If the URL is a public endpoint, the `HealthUrl` must also be a public endpoint. If the URL is a private endpoint inside a virtual private cloud (VPC), the health URL must also be a private endpoint, and the host must be the same as the URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-healthurl
     */
    readonly healthUrl?: string;

    /**
     * The URL to route traffic to.
     *
     * The URL must be an [rfc3986-formatted URL](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc3986) . If the host is a domain name, the name must be resolvable over the public internet. If the scheme is `https` , the top level domain of the host must be listed in the [IANA root zone database](https://docs.aws.amazon.com/https://www.iana.org/domains/root/db) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-url
     */
    readonly url: string;
  }
}

/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export interface CfnServiceProps {
  /**
   * The unique identifier of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-applicationidentifier
   */
  readonly applicationIdentifier: string;

  /**
   * A description of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-description
   */
  readonly description?: string;

  /**
   * The endpoint type of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-endpointtype
   */
  readonly endpointType: string;

  /**
   * The unique identifier of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-environmentidentifier
   */
  readonly environmentIdentifier: string;

  /**
   * A summary of the configuration for the AWS Lambda endpoint type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-lambdaendpoint
   */
  readonly lambdaEndpoint?: cdk.IResolvable | CfnService.LambdaEndpointInputProperty;

  /**
   * The name of the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-name
   */
  readonly name: string;

  /**
   * The tags assigned to the service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The summary of the configuration for the URL endpoint type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-urlendpoint
   */
  readonly urlEndpoint?: cdk.IResolvable | CfnService.UrlEndpointInputProperty;

  /**
   * The ID of the virtual private cloud (VPC).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-vpcid
   */
  readonly vpcId?: string;
}

/**
 * Determine whether the given properties match those of a `LambdaEndpointInputProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaEndpointInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceLambdaEndpointInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"LambdaEndpointInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceLambdaEndpointInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceLambdaEndpointInputPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnServiceLambdaEndpointInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.LambdaEndpointInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.LambdaEndpointInputProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UrlEndpointInputProperty`
 *
 * @param properties - the TypeScript properties of a `UrlEndpointInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceUrlEndpointInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthUrl", cdk.validateString)(properties.healthUrl));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"UrlEndpointInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceUrlEndpointInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceUrlEndpointInputPropertyValidator(properties).assertSuccess();
  return {
    "HealthUrl": cdk.stringToCloudFormation(properties.healthUrl),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnServiceUrlEndpointInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnService.UrlEndpointInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnService.UrlEndpointInputProperty>();
  ret.addPropertyResult("healthUrl", "HealthUrl", (properties.HealthUrl != null ? cfn_parse.FromCloudFormation.getString(properties.HealthUrl) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.requiredValidator)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("applicationIdentifier", cdk.validateString)(properties.applicationIdentifier));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("endpointType", cdk.requiredValidator)(properties.endpointType));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.requiredValidator)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("environmentIdentifier", cdk.validateString)(properties.environmentIdentifier));
  errors.collect(cdk.propertyValidator("lambdaEndpoint", CfnServiceLambdaEndpointInputPropertyValidator)(properties.lambdaEndpoint));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("urlEndpoint", CfnServiceUrlEndpointInputPropertyValidator)(properties.urlEndpoint));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnServiceProps\"");
}

// @ts-ignore TS6133
function convertCfnServicePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePropsValidator(properties).assertSuccess();
  return {
    "ApplicationIdentifier": cdk.stringToCloudFormation(properties.applicationIdentifier),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "EnvironmentIdentifier": cdk.stringToCloudFormation(properties.environmentIdentifier),
    "LambdaEndpoint": convertCfnServiceLambdaEndpointInputPropertyToCloudFormation(properties.lambdaEndpoint),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UrlEndpoint": convertCfnServiceUrlEndpointInputPropertyToCloudFormation(properties.urlEndpoint),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnServicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProps>();
  ret.addPropertyResult("applicationIdentifier", "ApplicationIdentifier", (properties.ApplicationIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationIdentifier) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("environmentIdentifier", "EnvironmentIdentifier", (properties.EnvironmentIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentIdentifier) : undefined));
  ret.addPropertyResult("lambdaEndpoint", "LambdaEndpoint", (properties.LambdaEndpoint != null ? CfnServiceLambdaEndpointInputPropertyFromCloudFormation(properties.LambdaEndpoint) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("urlEndpoint", "UrlEndpoint", (properties.UrlEndpoint != null ? CfnServiceUrlEndpointInputPropertyFromCloudFormation(properties.UrlEndpoint) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}