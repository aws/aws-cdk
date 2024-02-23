/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as iam from "../../aws-iam";

/**
 * The `AWS::Lambda::Alias` resource creates an [alias](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version.
 *
 * You can also map an alias to split invocation requests between two versions. Use the `RoutingConfig` parameter to specify a second version and the percentage of invocation requests that it receives.
 *
 * @cloudformationResource AWS::Lambda::Alias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html
 */
export class CfnAlias extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::Alias";

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description of the alias.
   */
  public description?: string;

  /**
   * The name of the Lambda function.
   */
  public functionName: string;

  /**
   * The function version that the alias invokes.
   */
  public functionVersion: string;

  /**
   * The name of the alias.
   */
  public name: string;

  /**
   * Specifies a [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's alias.
   */
  public provisionedConcurrencyConfig?: cdk.IResolvable | CfnAlias.ProvisionedConcurrencyConfigurationProperty;

  /**
   * The [routing configuration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) of the alias.
   */
  public routingConfig?: CfnAlias.AliasRoutingConfigurationProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAliasProps) {
    super(scope, id, {
      "type": CfnAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionName", this);
    cdk.requireProperty(props, "functionVersion", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.functionName = props.functionName;
    this.functionVersion = props.functionVersion;
    this.name = props.name;
    this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
    this.routingConfig = props.routingConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "functionName": this.functionName,
      "functionVersion": this.functionVersion,
      "name": this.name,
      "provisionedConcurrencyConfig": this.provisionedConcurrencyConfig,
      "routingConfig": this.routingConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAliasPropsToCloudFormation(props);
  }
}

export namespace CfnAlias {
  /**
   * A provisioned concurrency configuration for a function's alias.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-provisionedconcurrencyconfiguration.html
   */
  export interface ProvisionedConcurrencyConfigurationProperty {
    /**
     * The amount of provisioned concurrency to allocate for the alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-provisionedconcurrencyconfiguration.html#cfn-lambda-alias-provisionedconcurrencyconfiguration-provisionedconcurrentexecutions
     */
    readonly provisionedConcurrentExecutions: number;
  }

  /**
   * The [traffic-shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) configuration of a Lambda function alias.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html
   */
  export interface AliasRoutingConfigurationProperty {
    /**
     * The second version, and the percentage of traffic that's routed to it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html#cfn-lambda-alias-aliasroutingconfiguration-additionalversionweights
     */
    readonly additionalVersionWeights: Array<cdk.IResolvable | CfnAlias.VersionWeightProperty> | cdk.IResolvable;
  }

  /**
   * The [traffic-shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) configuration of a Lambda function alias.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html
   */
  export interface VersionWeightProperty {
    /**
     * The qualifier of the second version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionversion
     */
    readonly functionVersion: string;

    /**
     * The percentage of traffic that the alias routes to the second version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionweight
     */
    readonly functionWeight: number;
  }
}

/**
 * Properties for defining a `CfnAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html
 */
/**
 * Properties for defining a `CfnAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html
 */
export interface CfnAliasProps {
  /**
   * A description of the alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-description
   */
  readonly description?: string;

  /**
   * The name of the Lambda function.
   *
   * **Name formats** - *Function name* - `MyFunction` .
   * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
   * - *Partial ARN* - `123456789012:function:MyFunction` .
   *
   * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionname
   */
  readonly functionName: string;

  /**
   * The function version that the alias invokes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-functionversion
   */
  readonly functionVersion: string;

  /**
   * The name of the alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-name
   */
  readonly name: string;

  /**
   * Specifies a [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-provisionedconcurrencyconfig
   */
  readonly provisionedConcurrencyConfig?: cdk.IResolvable | CfnAlias.ProvisionedConcurrencyConfigurationProperty;

  /**
   * The [routing configuration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) of the alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-alias.html#cfn-lambda-alias-routingconfig
   */
  readonly routingConfig?: CfnAlias.AliasRoutingConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasProvisionedConcurrencyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.validateNumber)(properties.provisionedConcurrentExecutions));
  return errors.wrap("supplied properties not correct for \"ProvisionedConcurrencyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAliasProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasProvisionedConcurrencyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ProvisionedConcurrentExecutions": cdk.numberToCloudFormation(properties.provisionedConcurrentExecutions)
  };
}

/**
 * Determine whether the given properties match those of a `VersionWeightProperty`
 *
 * @param properties - the TypeScript properties of a `VersionWeightProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasVersionWeightPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionVersion", cdk.requiredValidator)(properties.functionVersion));
  errors.collect(cdk.propertyValidator("functionVersion", cdk.validateString)(properties.functionVersion));
  errors.collect(cdk.propertyValidator("functionWeight", cdk.requiredValidator)(properties.functionWeight));
  errors.collect(cdk.propertyValidator("functionWeight", cdk.validateNumber)(properties.functionWeight));
  return errors.wrap("supplied properties not correct for \"VersionWeightProperty\"");
}

// @ts-ignore TS6133
function convertCfnAliasVersionWeightPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasVersionWeightPropertyValidator(properties).assertSuccess();
  return {
    "FunctionVersion": cdk.stringToCloudFormation(properties.functionVersion),
    "FunctionWeight": cdk.numberToCloudFormation(properties.functionWeight)
  };
}

/**
 * Determine whether the given properties match those of a `AliasRoutingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AliasRoutingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasAliasRoutingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalVersionWeights", cdk.requiredValidator)(properties.additionalVersionWeights));
  errors.collect(cdk.propertyValidator("additionalVersionWeights", cdk.listValidator(CfnAliasVersionWeightPropertyValidator))(properties.additionalVersionWeights));
  return errors.wrap("supplied properties not correct for \"AliasRoutingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAliasAliasRoutingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasAliasRoutingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalVersionWeights": cdk.listMapper(convertCfnAliasVersionWeightPropertyToCloudFormation)(properties.additionalVersionWeights)
  };
}

/**
 * Determine whether the given properties match those of a `CfnAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionVersion", cdk.requiredValidator)(properties.functionVersion));
  errors.collect(cdk.propertyValidator("functionVersion", cdk.validateString)(properties.functionVersion));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("provisionedConcurrencyConfig", CfnAliasProvisionedConcurrencyConfigurationPropertyValidator)(properties.provisionedConcurrencyConfig));
  errors.collect(cdk.propertyValidator("routingConfig", CfnAliasAliasRoutingConfigurationPropertyValidator)(properties.routingConfig));
  return errors.wrap("supplied properties not correct for \"CfnAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAliasPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "FunctionVersion": cdk.stringToCloudFormation(properties.functionVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProvisionedConcurrencyConfig": convertCfnAliasProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
    "RoutingConfig": convertCfnAliasAliasRoutingConfigurationPropertyToCloudFormation(properties.routingConfig)
  };
}

/**
 * AWS::Lambda::CodeSigningConfig interface
 */
export interface ICfnCodeSigningConfig extends constructs.IConstruct{
  /**
   * The Amazon Resource Name (ARN) of the code signing configuration.
   *
   * @cloudformationAttribute CodeSigningConfigArn
   */
  readonly attrCodeSigningConfigArn: string;
}

export function instanceOfICfnCodeSigningConfig(object: any): object is ICfnCodeSigningConfig {
  if (object == null) {
    return false;
  }
  return 'attrCodeSigningConfigArn' in object;
}

/**
 * Details about a [Code signing configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html) .
 *
 * @cloudformationResource AWS::Lambda::CodeSigningConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html
 */
export class CfnCodeSigningConfig extends cdk.CfnResource implements ICfnCodeSigningConfig, cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::CodeSigningConfig";

  /**
   * The Amazon Resource Name (ARN) of the code signing configuration.
   *
   * @cloudformationAttribute CodeSigningConfigArn
   */
  public readonly attrCodeSigningConfigArn: string;

  /**
   * The code signing configuration ID.
   *
   * @cloudformationAttribute CodeSigningConfigId
   */
  public readonly attrCodeSigningConfigId: string;

  /**
   * List of allowed publishers.
   */
  public allowedPublishers: CfnCodeSigningConfig.AllowedPublishersProperty | cdk.IResolvable;

  /**
   * The code signing policy controls the validation failure action for signature mismatch or expiry.
   */
  public codeSigningPolicies?: CfnCodeSigningConfig.CodeSigningPoliciesProperty | cdk.IResolvable;

  /**
   * Code signing configuration description.
   */
  public description?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCodeSigningConfigProps) {
    super(scope, id, {
      "type": CfnCodeSigningConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "allowedPublishers", this);

    this.attrCodeSigningConfigArn = cdk.Token.asString(this.getAtt("CodeSigningConfigArn", cdk.ResolutionTypeHint.STRING));
    this.attrCodeSigningConfigId = cdk.Token.asString(this.getAtt("CodeSigningConfigId", cdk.ResolutionTypeHint.STRING));
    this.allowedPublishers = props.allowedPublishers;
    this.codeSigningPolicies = props.codeSigningPolicies;
    this.description = props.description;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowedPublishers": this.allowedPublishers,
      "codeSigningPolicies": this.codeSigningPolicies,
      "description": this.description
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCodeSigningConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCodeSigningConfigPropsToCloudFormation(props);
  }
}

export namespace CfnCodeSigningConfig {
  /**
   * List of signing profiles that can sign a code package.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-allowedpublishers.html
   */
  export interface AllowedPublishersProperty {
    /**
     * The Amazon Resource Name (ARN) for each of the signing profiles.
     *
     * A signing profile defines a trusted user who can sign a code package.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-allowedpublishers.html#cfn-lambda-codesigningconfig-allowedpublishers-signingprofileversionarns
     */
    readonly signingProfileVersionArns: Array<string>;
  }

  /**
   * Code signing configuration [policies](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html#config-codesigning-policies) specify the validation failure action for signature mismatch or expiry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-codesigningpolicies.html
   */
  export interface CodeSigningPoliciesProperty {
    /**
     * Code signing configuration policy for deployment validation failure.
     *
     * If you set the policy to `Enforce` , Lambda blocks the deployment request if signature validation checks fail. If you set the policy to `Warn` , Lambda allows the deployment and creates a CloudWatch log.
     *
     * Default value: `Warn`
     *
     * @default - "Warn"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-codesigningconfig-codesigningpolicies.html#cfn-lambda-codesigningconfig-codesigningpolicies-untrustedartifactondeployment
     */
    readonly untrustedArtifactOnDeployment: string;
  }
}

/**
 * Properties for defining a `CfnCodeSigningConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html
 */
export interface CfnCodeSigningConfigProps {
  /**
   * List of allowed publishers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-allowedpublishers
   */
  readonly allowedPublishers: CfnCodeSigningConfig.AllowedPublishersProperty | cdk.IResolvable;

  /**
   * The code signing policy controls the validation failure action for signature mismatch or expiry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-codesigningpolicies
   */
  readonly codeSigningPolicies?: CfnCodeSigningConfig.CodeSigningPoliciesProperty | cdk.IResolvable;

  /**
   * Code signing configuration description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-codesigningconfig.html#cfn-lambda-codesigningconfig-description
   */
  readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `AllowedPublishersProperty`
 *
 * @param properties - the TypeScript properties of a `AllowedPublishersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCodeSigningConfigAllowedPublishersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("signingProfileVersionArns", cdk.requiredValidator)(properties.signingProfileVersionArns));
  errors.collect(cdk.propertyValidator("signingProfileVersionArns", cdk.listValidator(cdk.validateString))(properties.signingProfileVersionArns));
  return errors.wrap("supplied properties not correct for \"AllowedPublishersProperty\"");
}

// @ts-ignore TS6133
function convertCfnCodeSigningConfigAllowedPublishersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCodeSigningConfigAllowedPublishersPropertyValidator(properties).assertSuccess();
  return {
    "SigningProfileVersionArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.signingProfileVersionArns)
  };
}

/**
 * Determine whether the given properties match those of a `CodeSigningPoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `CodeSigningPoliciesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCodeSigningConfigCodeSigningPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("untrustedArtifactOnDeployment", cdk.requiredValidator)(properties.untrustedArtifactOnDeployment));
  errors.collect(cdk.propertyValidator("untrustedArtifactOnDeployment", cdk.validateString)(properties.untrustedArtifactOnDeployment));
  return errors.wrap("supplied properties not correct for \"CodeSigningPoliciesProperty\"");
}

// @ts-ignore TS6133
function convertCfnCodeSigningConfigCodeSigningPoliciesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCodeSigningConfigCodeSigningPoliciesPropertyValidator(properties).assertSuccess();
  return {
    "UntrustedArtifactOnDeployment": cdk.stringToCloudFormation(properties.untrustedArtifactOnDeployment)
  };
}

/**
 * Determine whether the given properties match those of a `CfnCodeSigningConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnCodeSigningConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCodeSigningConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedPublishers", cdk.requiredValidator)(properties.allowedPublishers));
  errors.collect(cdk.propertyValidator("allowedPublishers", CfnCodeSigningConfigAllowedPublishersPropertyValidator)(properties.allowedPublishers));
  errors.collect(cdk.propertyValidator("codeSigningPolicies", CfnCodeSigningConfigCodeSigningPoliciesPropertyValidator)(properties.codeSigningPolicies));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  return errors.wrap("supplied properties not correct for \"CfnCodeSigningConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnCodeSigningConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCodeSigningConfigPropsValidator(properties).assertSuccess();
  return {
    "AllowedPublishers": convertCfnCodeSigningConfigAllowedPublishersPropertyToCloudFormation(properties.allowedPublishers),
    "CodeSigningPolicies": convertCfnCodeSigningConfigCodeSigningPoliciesPropertyToCloudFormation(properties.codeSigningPolicies),
    "Description": cdk.stringToCloudFormation(properties.description)
  };
}

/**
 * The `AWS::Lambda::EventInvokeConfig` resource configures options for [asynchronous invocation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html) on a version or an alias.
 *
 * By default, Lambda retries an asynchronous invocation twice if the function returns an error. It retains events in a queue for up to six hours. When an event fails all processing attempts or stays in the asynchronous invocation queue for too long, Lambda discards it.
 *
 * @cloudformationResource AWS::Lambda::EventInvokeConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html
 */
export class CfnEventInvokeConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::EventInvokeConfig";

  /**
   * A destination for events after they have been sent to a function for processing.
   */
  public destinationConfig?: CfnEventInvokeConfig.DestinationConfigProperty | cdk.IResolvable;

  /**
   * The name of the Lambda function.
   */
  public functionName: string;

  /**
   * The maximum age of a request that Lambda sends to a function for processing.
   */
  public maximumEventAgeInSeconds?: number;

  /**
   * The maximum number of times to retry when the function returns an error.
   */
  public maximumRetryAttempts?: number;

  /**
   * The identifier of a version or alias.
   */
  public qualifier: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventInvokeConfigProps) {
    super(scope, id, {
      "type": CfnEventInvokeConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionName", this);
    cdk.requireProperty(props, "qualifier", this);

    this.destinationConfig = props.destinationConfig;
    this.functionName = props.functionName;
    this.maximumEventAgeInSeconds = props.maximumEventAgeInSeconds;
    this.maximumRetryAttempts = props.maximumRetryAttempts;
    this.qualifier = props.qualifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationConfig": this.destinationConfig,
      "functionName": this.functionName,
      "maximumEventAgeInSeconds": this.maximumEventAgeInSeconds,
      "maximumRetryAttempts": this.maximumRetryAttempts,
      "qualifier": this.qualifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventInvokeConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventInvokeConfigPropsToCloudFormation(props);
  }
}

export namespace CfnEventInvokeConfig {
  /**
   * A configuration object that specifies the destination of an event after Lambda processes it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html
   */
  export interface DestinationConfigProperty {
    /**
     * The destination configuration for failed invocations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig-onfailure
     */
    readonly onFailure?: cdk.IResolvable | CfnEventInvokeConfig.OnFailureProperty;

    /**
     * The destination configuration for successful invocations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-destinationconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig-onsuccess
     */
    readonly onSuccess?: cdk.IResolvable | CfnEventInvokeConfig.OnSuccessProperty;
  }

  /**
   * A destination for events that were processed successfully.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-onsuccess.html
   */
  export interface OnSuccessProperty {
    /**
     * The Amazon Resource Name (ARN) of the destination resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-onsuccess.html#cfn-lambda-eventinvokeconfig-onsuccess-destination
     */
    readonly destination: string;
  }

  /**
   * A destination for events that failed processing.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-onfailure.html
   */
  export interface OnFailureProperty {
    /**
     * The Amazon Resource Name (ARN) of the destination resource.
     *
     * To retain records of [asynchronous invocations](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-async-destinations) , you can configure an Amazon SNS topic, Amazon SQS queue, Lambda function, or Amazon EventBridge event bus as the destination.
     *
     * To retain records of failed invocations from [Kinesis and DynamoDB event sources](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html#event-source-mapping-destinations) , you can configure an Amazon SNS topic or Amazon SQS queue as the destination.
     *
     * To retain records of failed invocations from [self-managed Kafka](https://docs.aws.amazon.com/lambda/latest/dg/with-kafka.html#services-smaa-onfailure-destination) or [Amazon MSK](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-onfailure-destination) , you can configure an Amazon SNS topic or Amazon SQS queue as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventinvokeconfig-onfailure.html#cfn-lambda-eventinvokeconfig-onfailure-destination
     */
    readonly destination: string;
  }
}

/**
 * Properties for defining a `CfnEventInvokeConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html
 */
export interface CfnEventInvokeConfigProps {
  /**
   * A destination for events after they have been sent to a function for processing.
   *
   * **Destinations** - *Function* - The Amazon Resource Name (ARN) of a Lambda function.
   * - *Queue* - The ARN of a standard SQS queue.
   * - *Topic* - The ARN of a standard SNS topic.
   * - *Event Bus* - The ARN of an Amazon EventBridge event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-destinationconfig
   */
  readonly destinationConfig?: CfnEventInvokeConfig.DestinationConfigProperty | cdk.IResolvable;

  /**
   * The name of the Lambda function.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `64`
   *
   * *Pattern* : `([a-zA-Z0-9-_]+)`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-functionname
   */
  readonly functionName: string;

  /**
   * The maximum age of a request that Lambda sends to a function for processing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumeventageinseconds
   */
  readonly maximumEventAgeInSeconds?: number;

  /**
   * The maximum number of times to retry when the function returns an error.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-maximumretryattempts
   */
  readonly maximumRetryAttempts?: number;

  /**
   * The identifier of a version or alias.
   *
   * - *Version* - A version number.
   * - *Alias* - An alias name.
   * - *Latest* - To specify the unpublished version, use `$LATEST` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventinvokeconfig.html#cfn-lambda-eventinvokeconfig-qualifier
   */
  readonly qualifier: string;
}

/**
 * Determine whether the given properties match those of a `OnSuccessProperty`
 *
 * @param properties - the TypeScript properties of a `OnSuccessProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventInvokeConfigOnSuccessPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  return errors.wrap("supplied properties not correct for \"OnSuccessProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventInvokeConfigOnSuccessPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventInvokeConfigOnSuccessPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination)
  };
}

/**
 * Determine whether the given properties match those of a `OnFailureProperty`
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventInvokeConfigOnFailurePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  return errors.wrap("supplied properties not correct for \"OnFailureProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventInvokeConfigOnFailurePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventInvokeConfigOnFailurePropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination)
  };
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventInvokeConfigDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", CfnEventInvokeConfigOnFailurePropertyValidator)(properties.onFailure));
  errors.collect(cdk.propertyValidator("onSuccess", CfnEventInvokeConfigOnSuccessPropertyValidator)(properties.onSuccess));
  return errors.wrap("supplied properties not correct for \"DestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventInvokeConfigDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventInvokeConfigDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": convertCfnEventInvokeConfigOnFailurePropertyToCloudFormation(properties.onFailure),
    "OnSuccess": convertCfnEventInvokeConfigOnSuccessPropertyToCloudFormation(properties.onSuccess)
  };
}

/**
 * Determine whether the given properties match those of a `CfnEventInvokeConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventInvokeConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventInvokeConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationConfig", CfnEventInvokeConfigDestinationConfigPropertyValidator)(properties.destinationConfig));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("maximumEventAgeInSeconds", cdk.validateNumber)(properties.maximumEventAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  errors.collect(cdk.propertyValidator("qualifier", cdk.requiredValidator)(properties.qualifier));
  errors.collect(cdk.propertyValidator("qualifier", cdk.validateString)(properties.qualifier));
  return errors.wrap("supplied properties not correct for \"CfnEventInvokeConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnEventInvokeConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventInvokeConfigPropsValidator(properties).assertSuccess();
  return {
    "DestinationConfig": convertCfnEventInvokeConfigDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "MaximumEventAgeInSeconds": cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    "Qualifier": cdk.stringToCloudFormation(properties.qualifier)
  };
}

/**
 * The `AWS::Lambda::EventSourceMapping` resource creates a mapping between an event source and an AWS Lambda function.
 *
 * Lambda reads items from the event source and triggers the function.
 *
 * For details about each event source type, see the following topics. In particular, each of the topics describes the required and optional parameters for the specific event source.
 *
 * - [Configuring a Dynamo DB stream as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html#services-dynamodb-eventsourcemapping)
 * - [Configuring a Kinesis stream as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html#services-kinesis-eventsourcemapping)
 * - [Configuring an SQS queue as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-eventsource)
 * - [Configuring an MQ broker as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-mq.html#services-mq-eventsourcemapping)
 * - [Configuring MSK as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html)
 * - [Configuring Self-Managed Apache Kafka as an event source](https://docs.aws.amazon.com/lambda/latest/dg/kafka-smaa.html)
 * - [Configuring Amazon DocumentDB as an event source](https://docs.aws.amazon.com/lambda/latest/dg/with-documentdb.html)
 *
 * @cloudformationResource AWS::Lambda::EventSourceMapping
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html
 */
export class CfnEventSourceMapping extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::EventSourceMapping";

  /**
   * The event source mapping's ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
   */
  public amazonManagedKafkaEventSourceConfig?: CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty | cdk.IResolvable;

  /**
   * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function.
   */
  public batchSize?: number;

  /**
   * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.
   */
  public bisectBatchOnFunctionError?: boolean | cdk.IResolvable;

  /**
   * (Kinesis and DynamoDB Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
   */
  public destinationConfig?: CfnEventSourceMapping.DestinationConfigProperty | cdk.IResolvable;

  /**
   * Specific configuration settings for a DocumentDB event source.
   */
  public documentDbEventSourceConfig?: CfnEventSourceMapping.DocumentDBEventSourceConfigProperty | cdk.IResolvable;

  /**
   * When true, the event source mapping is active. When false, Lambda pauses polling and invocation.
   */
  public enabled?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the event source.
   */
  public eventSourceArn?: string;

  /**
   * An object that defines the filter criteria that determine whether Lambda should process an event.
   */
  public filterCriteria?: CfnEventSourceMapping.FilterCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the Lambda function.
   */
  public functionName: string;

  /**
   * (Streams and SQS) A list of current response type enums applied to the event source mapping.
   */
  public functionResponseTypes?: Array<string>;

  /**
   * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.
   */
  public maximumBatchingWindowInSeconds?: number;

  /**
   * (Kinesis and DynamoDB Streams only) Discard records older than the specified age.
   */
  public maximumRecordAgeInSeconds?: number;

  /**
   * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries.
   */
  public maximumRetryAttempts?: number;

  /**
   * (Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard.
   */
  public parallelizationFactor?: number;

  /**
   * (Amazon MQ) The name of the Amazon MQ broker destination queue to consume.
   */
  public queues?: Array<string>;

  /**
   * (Amazon SQS only) The scaling configuration for the event source.
   */
  public scalingConfig?: cdk.IResolvable | CfnEventSourceMapping.ScalingConfigProperty;

  /**
   * The self-managed Apache Kafka cluster for your event source.
   */
  public selfManagedEventSource?: cdk.IResolvable | CfnEventSourceMapping.SelfManagedEventSourceProperty;

  /**
   * Specific configuration settings for a self-managed Apache Kafka event source.
   */
  public selfManagedKafkaEventSourceConfig?: cdk.IResolvable | CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty;

  /**
   * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
   */
  public sourceAccessConfigurations?: Array<cdk.IResolvable | CfnEventSourceMapping.SourceAccessConfigurationProperty> | cdk.IResolvable;

  /**
   * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB.
   */
  public startingPosition?: string;

  /**
   * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
   */
  public startingPositionTimestamp?: number;

  /**
   * The name of the Kafka topic.
   */
  public topics?: Array<string>;

  /**
   * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources.
   */
  public tumblingWindowInSeconds?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventSourceMappingProps) {
    super(scope, id, {
      "type": CfnEventSourceMapping.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.amazonManagedKafkaEventSourceConfig = props.amazonManagedKafkaEventSourceConfig;
    this.batchSize = props.batchSize;
    this.bisectBatchOnFunctionError = props.bisectBatchOnFunctionError;
    this.destinationConfig = props.destinationConfig;
    this.documentDbEventSourceConfig = props.documentDbEventSourceConfig;
    this.enabled = props.enabled;
    this.eventSourceArn = props.eventSourceArn;
    this.filterCriteria = props.filterCriteria;
    this.functionName = props.functionName;
    this.functionResponseTypes = props.functionResponseTypes;
    this.maximumBatchingWindowInSeconds = props.maximumBatchingWindowInSeconds;
    this.maximumRecordAgeInSeconds = props.maximumRecordAgeInSeconds;
    this.maximumRetryAttempts = props.maximumRetryAttempts;
    this.parallelizationFactor = props.parallelizationFactor;
    this.queues = props.queues;
    this.scalingConfig = props.scalingConfig;
    this.selfManagedEventSource = props.selfManagedEventSource;
    this.selfManagedKafkaEventSourceConfig = props.selfManagedKafkaEventSourceConfig;
    this.sourceAccessConfigurations = props.sourceAccessConfigurations;
    this.startingPosition = props.startingPosition;
    this.startingPositionTimestamp = props.startingPositionTimestamp;
    this.topics = props.topics;
    this.tumblingWindowInSeconds = props.tumblingWindowInSeconds;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "amazonManagedKafkaEventSourceConfig": this.amazonManagedKafkaEventSourceConfig,
      "batchSize": this.batchSize,
      "bisectBatchOnFunctionError": this.bisectBatchOnFunctionError,
      "destinationConfig": this.destinationConfig,
      "documentDbEventSourceConfig": this.documentDbEventSourceConfig,
      "enabled": this.enabled,
      "eventSourceArn": this.eventSourceArn,
      "filterCriteria": this.filterCriteria,
      "functionName": this.functionName,
      "functionResponseTypes": this.functionResponseTypes,
      "maximumBatchingWindowInSeconds": this.maximumBatchingWindowInSeconds,
      "maximumRecordAgeInSeconds": this.maximumRecordAgeInSeconds,
      "maximumRetryAttempts": this.maximumRetryAttempts,
      "parallelizationFactor": this.parallelizationFactor,
      "queues": this.queues,
      "scalingConfig": this.scalingConfig,
      "selfManagedEventSource": this.selfManagedEventSource,
      "selfManagedKafkaEventSourceConfig": this.selfManagedKafkaEventSourceConfig,
      "sourceAccessConfigurations": this.sourceAccessConfigurations,
      "startingPosition": this.startingPosition,
      "startingPositionTimestamp": this.startingPositionTimestamp,
      "topics": this.topics,
      "tumblingWindowInSeconds": this.tumblingWindowInSeconds
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventSourceMapping.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventSourceMappingPropsToCloudFormation(props);
  }
}

export namespace CfnEventSourceMapping {
  /**
   * (Amazon SQS only) The scaling configuration for the event source.
   *
   * To remove the configuration, pass an empty value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-scalingconfig.html
   */
  export interface ScalingConfigProperty {
    /**
     * Limits the number of concurrent instances that the Amazon SQS event source can invoke.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-scalingconfig.html#cfn-lambda-eventsourcemapping-scalingconfig-maximumconcurrency
     */
    readonly maximumConcurrency?: number;
  }

  /**
   * The self-managed Apache Kafka cluster for your event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedeventsource.html
   */
  export interface SelfManagedEventSourceProperty {
    /**
     * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedeventsource.html#cfn-lambda-eventsourcemapping-selfmanagedeventsource-endpoints
     */
    readonly endpoints?: CfnEventSourceMapping.EndpointsProperty | cdk.IResolvable;
  }

  /**
   * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-endpoints.html
   */
  export interface EndpointsProperty {
    /**
     * The list of bootstrap servers for your Kafka brokers in the following format: `"KafkaBootstrapServers": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"]` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-endpoints.html#cfn-lambda-eventsourcemapping-endpoints-kafkabootstrapservers
     */
    readonly kafkaBootstrapServers?: Array<string>;
  }

  /**
   * An object that contains the filters for an event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filtercriteria.html
   */
  export interface FilterCriteriaProperty {
    /**
     * A list of filters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filtercriteria.html#cfn-lambda-eventsourcemapping-filtercriteria-filters
     */
    readonly filters?: Array<CfnEventSourceMapping.FilterProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A structure within a `FilterCriteria` object that defines an event filtering pattern.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filter.html
   */
  export interface FilterProperty {
    /**
     * A filter pattern.
     *
     * For more information on the syntax of a filter pattern, see [Filter rule syntax](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-syntax) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-filter.html#cfn-lambda-eventsourcemapping-filter-pattern
     */
    readonly pattern?: string;
  }

  /**
   * Specific configuration settings for a self-managed Apache Kafka event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig.html
   */
  export interface SelfManagedKafkaEventSourceConfigProperty {
    /**
     * The identifier for the Kafka consumer group to join.
     *
     * The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see [Customizable consumer group ID](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-consumer-group-id) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig.html#cfn-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig-consumergroupid
     */
    readonly consumerGroupId?: string;
  }

  /**
   * Specific configuration settings for a DocumentDB event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-documentdbeventsourceconfig.html
   */
  export interface DocumentDBEventSourceConfigProperty {
    /**
     * The name of the collection to consume within the database.
     *
     * If you do not specify a collection, Lambda consumes all collections.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-documentdbeventsourceconfig.html#cfn-lambda-eventsourcemapping-documentdbeventsourceconfig-collectionname
     */
    readonly collectionName?: string;

    /**
     * The name of the database to consume within the DocumentDB cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-documentdbeventsourceconfig.html#cfn-lambda-eventsourcemapping-documentdbeventsourceconfig-databasename
     */
    readonly databaseName?: string;

    /**
     * Determines what DocumentDB sends to your event stream during document update operations.
     *
     * If set to UpdateLookup, DocumentDB sends a delta describing the changes, along with a copy of the entire document. Otherwise, DocumentDB sends only a partial document that contains the changes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-documentdbeventsourceconfig.html#cfn-lambda-eventsourcemapping-documentdbeventsourceconfig-fulldocument
     */
    readonly fullDocument?: string;
  }

  /**
   * A configuration object that specifies the destination of an event after Lambda processes it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-destinationconfig.html
   */
  export interface DestinationConfigProperty {
    /**
     * The destination configuration for failed invocations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-destinationconfig.html#cfn-lambda-eventsourcemapping-destinationconfig-onfailure
     */
    readonly onFailure?: cdk.IResolvable | CfnEventSourceMapping.OnFailureProperty;
  }

  /**
   * A destination for events that failed processing.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-onfailure.html
   */
  export interface OnFailureProperty {
    /**
     * The Amazon Resource Name (ARN) of the destination resource.
     *
     * To retain records of [asynchronous invocations](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-async-destinations) , you can configure an Amazon SNS topic, Amazon SQS queue, Lambda function, or Amazon EventBridge event bus as the destination.
     *
     * To retain records of failed invocations from [Kinesis and DynamoDB event sources](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html#event-source-mapping-destinations) , you can configure an Amazon SNS topic or Amazon SQS queue as the destination.
     *
     * To retain records of failed invocations from [self-managed Kafka](https://docs.aws.amazon.com/lambda/latest/dg/with-kafka.html#services-smaa-onfailure-destination) or [Amazon MSK](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-onfailure-destination) , you can configure an Amazon SNS topic or Amazon SQS queue as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-onfailure.html#cfn-lambda-eventsourcemapping-onfailure-destination
     */
    readonly destination?: string;
  }

  /**
   * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig.html
   */
  export interface AmazonManagedKafkaEventSourceConfigProperty {
    /**
     * The identifier for the Kafka consumer group to join.
     *
     * The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see [Customizable consumer group ID](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#services-msk-consumer-group-id) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig.html#cfn-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig-consumergroupid
     */
    readonly consumerGroupId?: string;
  }

  /**
   * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html
   */
  export interface SourceAccessConfigurationProperty {
    /**
     * The type of authentication protocol, VPC components, or virtual host for your event source. For example: `"Type":"SASL_SCRAM_512_AUTH"` .
     *
     * - `BASIC_AUTH` – (Amazon MQ) The AWS Secrets Manager secret that stores your broker credentials.
     * - `BASIC_AUTH` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL/PLAIN authentication of your Apache Kafka brokers.
     * - `VPC_SUBNET` – (Self-managed Apache Kafka) The subnets associated with your VPC. Lambda connects to these subnets to fetch data from your self-managed Apache Kafka cluster.
     * - `VPC_SECURITY_GROUP` – (Self-managed Apache Kafka) The VPC security group used to manage access to your self-managed Apache Kafka brokers.
     * - `SASL_SCRAM_256_AUTH` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-256 authentication of your self-managed Apache Kafka brokers.
     * - `SASL_SCRAM_512_AUTH` – (Amazon MSK, Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-512 authentication of your self-managed Apache Kafka brokers.
     * - `VIRTUAL_HOST` –- (RabbitMQ) The name of the virtual host in your RabbitMQ broker. Lambda uses this RabbitMQ host as the event source. This property cannot be specified in an UpdateEventSourceMapping API call.
     * - `CLIENT_CERTIFICATE_TLS_AUTH` – (Amazon MSK, self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the certificate chain (X.509 PEM), private key (PKCS#8 PEM), and private key password (optional) used for mutual TLS authentication of your MSK/Apache Kafka brokers.
     * - `SERVER_ROOT_CA_CERTIFICATE` – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the root CA certificate (X.509 PEM) used for TLS encryption of your Apache Kafka brokers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html#cfn-lambda-eventsourcemapping-sourceaccessconfiguration-type
     */
    readonly type?: string;

    /**
     * The value for your chosen configuration in `Type` .
     *
     * For example: `"URI": "arn:aws:secretsmanager:us-east-1:01234567890:secret:MyBrokerSecretName"` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-eventsourcemapping-sourceaccessconfiguration.html#cfn-lambda-eventsourcemapping-sourceaccessconfiguration-uri
     */
    readonly uri?: string;
  }
}

/**
 * Properties for defining a `CfnEventSourceMapping`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html
 */
export interface CfnEventSourceMappingProps {
  /**
   * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-amazonmanagedkafkaeventsourceconfig
   */
  readonly amazonManagedKafkaEventSourceConfig?: CfnEventSourceMapping.AmazonManagedKafkaEventSourceConfigProperty | cdk.IResolvable;

  /**
   * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function.
   *
   * Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).
   *
   * - *Amazon Kinesis* – Default 100. Max 10,000.
   * - *Amazon DynamoDB Streams* – Default 100. Max 10,000.
   * - *Amazon Simple Queue Service* – Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.
   * - *Amazon Managed Streaming for Apache Kafka* – Default 100. Max 10,000.
   * - *Self-managed Apache Kafka* – Default 100. Max 10,000.
   * - *Amazon MQ (ActiveMQ and RabbitMQ)* – Default 100. Max 10,000.
   * - *DocumentDB* – Default 100. Max 10,000.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-batchsize
   */
  readonly batchSize?: number;

  /**
   * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.
   *
   * The default value is false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-bisectbatchonfunctionerror
   */
  readonly bisectBatchOnFunctionError?: boolean | cdk.IResolvable;

  /**
   * (Kinesis and DynamoDB Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-destinationconfig
   */
  readonly destinationConfig?: CfnEventSourceMapping.DestinationConfigProperty | cdk.IResolvable;

  /**
   * Specific configuration settings for a DocumentDB event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-documentdbeventsourceconfig
   */
  readonly documentDbEventSourceConfig?: CfnEventSourceMapping.DocumentDBEventSourceConfigProperty | cdk.IResolvable;

  /**
   * When true, the event source mapping is active. When false, Lambda pauses polling and invocation.
   *
   * Default: True
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-enabled
   */
  readonly enabled?: boolean | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the event source.
   *
   * - *Amazon Kinesis* – The ARN of the data stream or a stream consumer.
   * - *Amazon DynamoDB Streams* – The ARN of the stream.
   * - *Amazon Simple Queue Service* – The ARN of the queue.
   * - *Amazon Managed Streaming for Apache Kafka* – The ARN of the cluster or the ARN of the VPC connection (for [cross-account event source mappings](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html#msk-multi-vpc) ).
   * - *Amazon MQ* – The ARN of the broker.
   * - *Amazon DocumentDB* – The ARN of the DocumentDB change stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-eventsourcearn
   */
  readonly eventSourceArn?: string;

  /**
   * An object that defines the filter criteria that determine whether Lambda should process an event.
   *
   * For more information, see [Lambda event filtering](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-filtercriteria
   */
  readonly filterCriteria?: CfnEventSourceMapping.FilterCriteriaProperty | cdk.IResolvable;

  /**
   * The name of the Lambda function.
   *
   * **Name formats** - *Function name* – `MyFunction` .
   * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
   * - *Version or Alias ARN* – `arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD` .
   * - *Partial ARN* – `123456789012:function:MyFunction` .
   *
   * The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionname
   */
  readonly functionName: string;

  /**
   * (Streams and SQS) A list of current response type enums applied to the event source mapping.
   *
   * Valid Values: `ReportBatchItemFailures`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-functionresponsetypes
   */
  readonly functionResponseTypes?: Array<string>;

  /**
   * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.
   *
   * *Default ( Kinesis , DynamoDB , Amazon SQS event sources)* : 0
   *
   * *Default ( Amazon MSK , Kafka, Amazon MQ , Amazon DocumentDB event sources)* : 500 ms
   *
   * *Related setting:* For Amazon SQS event sources, when you set `BatchSize` to a value greater than 10, you must set `MaximumBatchingWindowInSeconds` to at least 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumbatchingwindowinseconds
   */
  readonly maximumBatchingWindowInSeconds?: number;

  /**
   * (Kinesis and DynamoDB Streams only) Discard records older than the specified age.
   *
   * The default value is -1,
   * which sets the maximum age to infinite. When the value is set to infinite, Lambda never discards old records.
   *
   * > The minimum valid value for maximum record age is 60s. Although values less than 60 and greater than -1 fall within the parameter's absolute range, they are not allowed
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumrecordageinseconds
   */
  readonly maximumRecordAgeInSeconds?: number;

  /**
   * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries.
   *
   * The default value is -1,
   * which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, Lambda retries failed records until the record expires in the event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-maximumretryattempts
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard.
   *
   * The default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-parallelizationfactor
   */
  readonly parallelizationFactor?: number;

  /**
   * (Amazon MQ) The name of the Amazon MQ broker destination queue to consume.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-queues
   */
  readonly queues?: Array<string>;

  /**
   * (Amazon SQS only) The scaling configuration for the event source.
   *
   * For more information, see [Configuring maximum concurrency for Amazon SQS event sources](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-max-concurrency) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-scalingconfig
   */
  readonly scalingConfig?: cdk.IResolvable | CfnEventSourceMapping.ScalingConfigProperty;

  /**
   * The self-managed Apache Kafka cluster for your event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedeventsource
   */
  readonly selfManagedEventSource?: cdk.IResolvable | CfnEventSourceMapping.SelfManagedEventSourceProperty;

  /**
   * Specific configuration settings for a self-managed Apache Kafka event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-selfmanagedkafkaeventsourceconfig
   */
  readonly selfManagedKafkaEventSourceConfig?: cdk.IResolvable | CfnEventSourceMapping.SelfManagedKafkaEventSourceConfigProperty;

  /**
   * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-sourceaccessconfigurations
   */
  readonly sourceAccessConfigurations?: Array<cdk.IResolvable | CfnEventSourceMapping.SourceAccessConfigurationProperty> | cdk.IResolvable;

  /**
   * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB.
   *
   * - *LATEST* - Read only new records.
   * - *TRIM_HORIZON* - Process all available records.
   * - *AT_TIMESTAMP* - Specify a time from which to start reading records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingposition
   */
  readonly startingPosition?: string;

  /**
   * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
   *
   * `StartingPositionTimestamp` cannot be in the future.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-startingpositiontimestamp
   */
  readonly startingPositionTimestamp?: number;

  /**
   * The name of the Kafka topic.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-topics
   */
  readonly topics?: Array<string>;

  /**
   * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources.
   *
   * A value of 0 seconds indicates no tumbling window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html#cfn-lambda-eventsourcemapping-tumblingwindowinseconds
   */
  readonly tumblingWindowInSeconds?: number;
}

/**
 * Determine whether the given properties match those of a `ScalingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingScalingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumConcurrency", cdk.validateNumber)(properties.maximumConcurrency));
  return errors.wrap("supplied properties not correct for \"ScalingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingScalingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingScalingConfigPropertyValidator(properties).assertSuccess();
  return {
    "MaximumConcurrency": cdk.numberToCloudFormation(properties.maximumConcurrency)
  };
}

/**
 * Determine whether the given properties match those of a `EndpointsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingEndpointsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kafkaBootstrapServers", cdk.listValidator(cdk.validateString))(properties.kafkaBootstrapServers));
  return errors.wrap("supplied properties not correct for \"EndpointsProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingEndpointsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingEndpointsPropertyValidator(properties).assertSuccess();
  return {
    "KafkaBootstrapServers": cdk.listMapper(cdk.stringToCloudFormation)(properties.kafkaBootstrapServers)
  };
}

/**
 * Determine whether the given properties match those of a `SelfManagedEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedEventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingSelfManagedEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoints", CfnEventSourceMappingEndpointsPropertyValidator)(properties.endpoints));
  return errors.wrap("supplied properties not correct for \"SelfManagedEventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingSelfManagedEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingSelfManagedEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "Endpoints": convertCfnEventSourceMappingEndpointsPropertyToCloudFormation(properties.endpoints)
  };
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingFilterPropertyValidator(properties).assertSuccess();
  return {
    "Pattern": cdk.stringToCloudFormation(properties.pattern)
  };
}

/**
 * Determine whether the given properties match those of a `FilterCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FilterCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingFilterCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnEventSourceMappingFilterPropertyValidator))(properties.filters));
  return errors.wrap("supplied properties not correct for \"FilterCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingFilterCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingFilterCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Filters": cdk.listMapper(convertCfnEventSourceMappingFilterPropertyToCloudFormation)(properties.filters)
  };
}

/**
 * Determine whether the given properties match those of a `SelfManagedKafkaEventSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SelfManagedKafkaEventSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerGroupId", cdk.validateString)(properties.consumerGroupId));
  return errors.wrap("supplied properties not correct for \"SelfManagedKafkaEventSourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConsumerGroupId": cdk.stringToCloudFormation(properties.consumerGroupId)
  };
}

/**
 * Determine whether the given properties match those of a `DocumentDBEventSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentDBEventSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingDocumentDBEventSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("collectionName", cdk.validateString)(properties.collectionName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("fullDocument", cdk.validateString)(properties.fullDocument));
  return errors.wrap("supplied properties not correct for \"DocumentDBEventSourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingDocumentDBEventSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingDocumentDBEventSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "CollectionName": cdk.stringToCloudFormation(properties.collectionName),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "FullDocument": cdk.stringToCloudFormation(properties.fullDocument)
  };
}

/**
 * Determine whether the given properties match those of a `OnFailureProperty`
 *
 * @param properties - the TypeScript properties of a `OnFailureProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingOnFailurePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  return errors.wrap("supplied properties not correct for \"OnFailureProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingOnFailurePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingOnFailurePropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination)
  };
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", CfnEventSourceMappingOnFailurePropertyValidator)(properties.onFailure));
  return errors.wrap("supplied properties not correct for \"DestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": convertCfnEventSourceMappingOnFailurePropertyToCloudFormation(properties.onFailure)
  };
}

/**
 * Determine whether the given properties match those of a `AmazonManagedKafkaEventSourceConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonManagedKafkaEventSourceConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerGroupId", cdk.validateString)(properties.consumerGroupId));
  return errors.wrap("supplied properties not correct for \"AmazonManagedKafkaEventSourceConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConsumerGroupId": cdk.stringToCloudFormation(properties.consumerGroupId)
  };
}

/**
 * Determine whether the given properties match those of a `SourceAccessConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SourceAccessConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingSourceAccessConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"SourceAccessConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingSourceAccessConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingSourceAccessConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "URI": cdk.stringToCloudFormation(properties.uri)
  };
}

/**
 * Determine whether the given properties match those of a `CfnEventSourceMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventSourceMappingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventSourceMappingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amazonManagedKafkaEventSourceConfig", CfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyValidator)(properties.amazonManagedKafkaEventSourceConfig));
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("bisectBatchOnFunctionError", cdk.validateBoolean)(properties.bisectBatchOnFunctionError));
  errors.collect(cdk.propertyValidator("destinationConfig", CfnEventSourceMappingDestinationConfigPropertyValidator)(properties.destinationConfig));
  errors.collect(cdk.propertyValidator("documentDbEventSourceConfig", CfnEventSourceMappingDocumentDBEventSourceConfigPropertyValidator)(properties.documentDbEventSourceConfig));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("eventSourceArn", cdk.validateString)(properties.eventSourceArn));
  errors.collect(cdk.propertyValidator("filterCriteria", CfnEventSourceMappingFilterCriteriaPropertyValidator)(properties.filterCriteria));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionResponseTypes", cdk.listValidator(cdk.validateString))(properties.functionResponseTypes));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("maximumRecordAgeInSeconds", cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  errors.collect(cdk.propertyValidator("parallelizationFactor", cdk.validateNumber)(properties.parallelizationFactor));
  errors.collect(cdk.propertyValidator("queues", cdk.listValidator(cdk.validateString))(properties.queues));
  errors.collect(cdk.propertyValidator("scalingConfig", CfnEventSourceMappingScalingConfigPropertyValidator)(properties.scalingConfig));
  errors.collect(cdk.propertyValidator("selfManagedEventSource", CfnEventSourceMappingSelfManagedEventSourcePropertyValidator)(properties.selfManagedEventSource));
  errors.collect(cdk.propertyValidator("selfManagedKafkaEventSourceConfig", CfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyValidator)(properties.selfManagedKafkaEventSourceConfig));
  errors.collect(cdk.propertyValidator("sourceAccessConfigurations", cdk.listValidator(CfnEventSourceMappingSourceAccessConfigurationPropertyValidator))(properties.sourceAccessConfigurations));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPositionTimestamp", cdk.validateNumber)(properties.startingPositionTimestamp));
  errors.collect(cdk.propertyValidator("topics", cdk.listValidator(cdk.validateString))(properties.topics));
  errors.collect(cdk.propertyValidator("tumblingWindowInSeconds", cdk.validateNumber)(properties.tumblingWindowInSeconds));
  return errors.wrap("supplied properties not correct for \"CfnEventSourceMappingProps\"");
}

// @ts-ignore TS6133
function convertCfnEventSourceMappingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventSourceMappingPropsValidator(properties).assertSuccess();
  return {
    "AmazonManagedKafkaEventSourceConfig": convertCfnEventSourceMappingAmazonManagedKafkaEventSourceConfigPropertyToCloudFormation(properties.amazonManagedKafkaEventSourceConfig),
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "BisectBatchOnFunctionError": cdk.booleanToCloudFormation(properties.bisectBatchOnFunctionError),
    "DestinationConfig": convertCfnEventSourceMappingDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
    "DocumentDBEventSourceConfig": convertCfnEventSourceMappingDocumentDBEventSourceConfigPropertyToCloudFormation(properties.documentDbEventSourceConfig),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "EventSourceArn": cdk.stringToCloudFormation(properties.eventSourceArn),
    "FilterCriteria": convertCfnEventSourceMappingFilterCriteriaPropertyToCloudFormation(properties.filterCriteria),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "FunctionResponseTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.functionResponseTypes),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "MaximumRecordAgeInSeconds": cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    "ParallelizationFactor": cdk.numberToCloudFormation(properties.parallelizationFactor),
    "Queues": cdk.listMapper(cdk.stringToCloudFormation)(properties.queues),
    "ScalingConfig": convertCfnEventSourceMappingScalingConfigPropertyToCloudFormation(properties.scalingConfig),
    "SelfManagedEventSource": convertCfnEventSourceMappingSelfManagedEventSourcePropertyToCloudFormation(properties.selfManagedEventSource),
    "SelfManagedKafkaEventSourceConfig": convertCfnEventSourceMappingSelfManagedKafkaEventSourceConfigPropertyToCloudFormation(properties.selfManagedKafkaEventSourceConfig),
    "SourceAccessConfigurations": cdk.listMapper(convertCfnEventSourceMappingSourceAccessConfigurationPropertyToCloudFormation)(properties.sourceAccessConfigurations),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "StartingPositionTimestamp": cdk.numberToCloudFormation(properties.startingPositionTimestamp),
    "Topics": cdk.listMapper(cdk.stringToCloudFormation)(properties.topics),
    "TumblingWindowInSeconds": cdk.numberToCloudFormation(properties.tumblingWindowInSeconds)
  };
}

/**
 * The `AWS::Lambda::Function` resource creates a Lambda function Interface.
 */
export interface ICfnFunction extends constructs.IConstruct {
  /**
   * The Amazon Resource Name (ARN) of the function.
   *
   * @cloudformationAttribute Arn
   */
  readonly attrArn: string;
}

/**
 * The `AWS::Lambda::Function` resource creates a Lambda function.
 *
 * To create a function, you need a [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) and an [execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) . The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use AWS services, such as Amazon CloudWatch Logs for log streaming and AWS X-Ray for request tracing.
 *
 * You set the package type to `Image` if the deployment package is a [container image](https://docs.aws.amazon.com/lambda/latest/dg/lambda-images.html) . For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties.
 *
 * You set the package type to `Zip` if the deployment package is a [.zip file archive](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html#gettingstarted-package-zip) . For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. For a Python example, see [Deploy Python Lambda functions with .zip file archives](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html) .
 *
 * You can use [code signing](https://docs.aws.amazon.com/lambda/latest/dg/configuration-codesigning.html) if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with `UpdateFunctionCode` , Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes a set of signing profiles, which define the trusted publishers for this function.
 *
 * Note that you configure [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html) on a `AWS::Lambda::Version` or a `AWS::Lambda::Alias` .
 *
 * For a complete introduction to Lambda functions, see [What is Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/lambda-welcome.html) in the *Lambda developer guide.*
 *
 * @cloudformationResource AWS::Lambda::Function
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
 */
export class CfnFunction extends cdk.CfnResource implements ICfnFunction, cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::Function";

  /**
   * The Amazon Resource Name (ARN) of the function.
   *
   * @cloudformationAttribute Arn
   */
  readonly attrArn: string;

  /**
   * The function's SnapStart Response. When set to PublishedVersions, Lambda creates a snapshot of the execution environment when you publish a function version.
   *
   * @cloudformationAttribute SnapStartResponse
   */
  public readonly attrSnapStartResponse: cdk.IResolvable;

  /**
   * Applying SnapStart setting on function resource type.
   *
   * @cloudformationAttribute SnapStartResponse.ApplyOn
   */
  public readonly attrSnapStartResponseApplyOn: string;

  /**
   * Indicates whether SnapStart is activated for the specified function version.
   *
   * @cloudformationAttribute SnapStartResponse.OptimizationStatus
   */
  public readonly attrSnapStartResponseOptimizationStatus: string;

  /**
   * The instruction set architecture that the function supports.
   */
  public architectures?: Array<CfnFunction.ArchitecturesEnum | cdk.IResolvable>;

  /**
   * The code for the function.
   */
  public code: CfnFunction.ICodeProperty | cdk.IResolvable;

  /**
   * To enable code signing for this function, specify the ARN of a code-signing configuration.
   */
  public codeSigningConfig?: ICfnCodeSigningConfig | cdk.IResolvable;

  /**
   * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing.
   */
  public deadLetterConfig?: CfnFunction.DeadLetterConfigProperty | cdk.IResolvable;

  /**
   * A description of the function.
   */
  public description?: string;

  /**
   * Environment variables that are accessible from function code during execution.
   */
  public environment?: CfnFunction.EnvironmentProperty | cdk.IResolvable;

  /**
   * The size of the function's `/tmp` directory in MB.
   */
  public ephemeralStorage?: CfnFunction.EphemeralStorageProperty | cdk.IResolvable;

  /**
   * Connection settings for an Amazon EFS file system.
   */
  public fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the Lambda function, up to 64 characters in length.
   */
  public functionName?: string;

  /**
   * The name of the method within your code that Lambda calls to run your function.
   */
  public handler?: string;

  /**
   * Configuration values that override the container image Dockerfile settings.
   */
  public imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

  /**
   * The ARN of the AWS Key Management Service ( AWS KMS ) customer managed key that's used to encrypt your function's [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-encryption) . When [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart-security.html) is activated, Lambda also uses this key is to encrypt your function's snapshot. If you deploy your function using a container image, Lambda also uses this key to encrypt your function when it's deployed. Note that this is not the same key that's used to protect your container image in the Amazon Elastic Container Registry (Amazon ECR). If you don't provide a customer managed key, Lambda uses a default service key.
   */
  public kmsKeyArn?: string;

  /**
   * A list of [function layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to add to the function's execution environment. Specify each layer by its ARN, including the version.
   */
  public layers?: Array<ICfnLayerVersion | cdk.IResolvable>;

  /**
   * The function's Amazon CloudWatch Logs configuration settings.
   */
  public loggingConfig?: cdk.IResolvable | CfnFunction.LoggingConfigProperty;

  /**
   * The amount of [memory available to the function](https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console) at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB. Note that new AWS accounts have reduced concurrency and memory quotas. AWS raises these quotas automatically based on your usage. You can also request a quota increase.
   */
  public memorySize?: number;

  /**
   * The type of deployment package.
   */
  public packageType?: CfnFunction.PackageTypeEnum;

  /**
   * The number of simultaneous executions to reserve for the function.
   */
  public reservedConcurrentExecutions?: number;

  /**
   * The Amazon Resource Name (ARN) of the function's execution role.
   */
  public role: iam.ICfnRole | cdk.IResolvable;

  /**
   * The identifier of the function's [runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Runtime is required if the deployment package is a .zip file archive.
   */
  public runtime?: CfnFunction.RuntimeEnum;

  /**
   * Sets the runtime management configuration for a function's version.
   */
  public runtimeManagementConfig?: cdk.IResolvable | CfnFunction.RuntimeManagementConfigProperty;

  /**
   * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
   */
  public snapStart?: cdk.IResolvable | CfnFunction.SnapStartProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of [tags](https://docs.aws.amazon.com/lambda/latest/dg/tagging.html) to apply to the function.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The amount of time (in seconds) that Lambda allows a function to run before stopping it.
   */
  public timeout?: cdk.Duration;

  /**
   * Set `Mode` to `Active` to sample and trace a subset of incoming requests with [X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) .
   */
  public tracingConfig?: cdk.IResolvable | CfnFunction.TracingConfigProperty;

  /**
   * For network connectivity to AWS resources in a VPC, specify a list of security groups and subnets in the VPC.
   */
  public vpcConfig?: cdk.IResolvable | CfnFunction.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps) {
    super(scope, id, {
      "type": CfnFunction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "code", this);
    cdk.requireProperty(props, "role", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrSnapStartResponse = this.getAtt("SnapStartResponse");
    this.attrSnapStartResponseApplyOn = cdk.Token.asString(this.getAtt("SnapStartResponse.ApplyOn", cdk.ResolutionTypeHint.STRING));
    this.attrSnapStartResponseOptimizationStatus = cdk.Token.asString(this.getAtt("SnapStartResponse.OptimizationStatus", cdk.ResolutionTypeHint.STRING));
    this.architectures = props.architectures;
    this.code = props.code;
    this.codeSigningConfig = props.codeSigningConfig;
    this.deadLetterConfig = props.deadLetterConfig;
    this.description = props.description;
    this.environment = props.environment;
    this.ephemeralStorage = props.ephemeralStorage;
    this.fileSystemConfigs = props.fileSystemConfigs;
    this.functionName = props.functionName;
    this.handler = props.handler;
    this.imageConfig = props.imageConfig;
    this.kmsKeyArn = props.kmsKeyArn;
    this.layers = props.layers;
    this.loggingConfig = props.loggingConfig;
    this.memorySize = props.memorySize;
    this.packageType = props.packageType;
    this.reservedConcurrentExecutions = props.reservedConcurrentExecutions;
    this.role = props.role;
    this.runtime = props.runtime;
    this.runtimeManagementConfig = props.runtimeManagementConfig;
    this.snapStart = props.snapStart;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lambda::Function", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.tracingConfig = props.tracingConfig;
    this.vpcConfig = props.vpcConfig;
  }

  private _getDeadLetterConfig(deadLetterConfig: CfnFunction.DeadLetterConfigProperty  | cdk.IResolvable): any {
    if(deadLetterConfig instanceof CfnFunction.DeadLetterConfigProperty) {
      return {
        "target": deadLetterConfig.target?.returnTargetArn()
      };
    }
    return deadLetterConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "architectures": this.architectures?.map(architecture => architecture instanceof CfnFunction.ArchitecturesEnum? architecture.name: architecture),
      "code": 'returnCode' in this.code? this.code.returnCode() : this.code,
      "codeSigningConfigArn": (this.codeSigningConfig !== null && this.codeSigningConfig !== undefined) ? (instanceOfICfnCodeSigningConfig(this.codeSigningConfig)? this.codeSigningConfig.attrCodeSigningConfigArn : this.codeSigningConfig) : null,
      "deadLetterConfig": this._getDeadLetterConfig(this.deadLetterConfig),
      "description": this.description,
      "environment": this.environment,
      "ephemeralStorage": this.ephemeralStorage,
      "fileSystemConfigs": this.fileSystemConfigs,
      "functionName": this.functionName,
      "handler": this.handler,
      "imageConfig": this.imageConfig,
      "kmsKeyArn": this.kmsKeyArn,
      "layers": this.layers,
      "loggingConfig": this.loggingConfig,
      "memorySize": this.memorySize,
      "packageType": this.packageType?.name,
      "reservedConcurrentExecutions": this.reservedConcurrentExecutions,
      "role": "attrArn" in this.role ? this.role.attrArn : this.role,
      "runtime": this.runtime,
      "runtimeManagementConfig": this.runtimeManagementConfig,
      "snapStart": this.snapStart,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout?.toSeconds(),
      "tracingConfig": this.tracingConfig,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionPropsToCloudFormation(props);
  }
}

export namespace CfnFunction {
  /**
   * Lambda Function Architectures enum
   */
  export class ArchitecturesEnum {
    public static readonly X86_64 = new ArchitecturesEnum('x86_64');
    public static readonly ARM64 = new ArchitecturesEnum('arm64');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * Configuration values that override the container image Dockerfile settings.
   *
   * For more information, see [Container image settings](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-parms) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html
   */
  export interface ImageConfigProperty {
    /**
     * Specifies parameters that you want to pass in with ENTRYPOINT.
     *
     * You can specify a maximum of 1,500 parameters in the list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-command
     */
    readonly command?: Array<string>;

    /**
     * Specifies the entry point to their application, which is typically the location of the runtime executable.
     *
     * You can specify a maximum of 1,500 string entries in the list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-entrypoint
     */
    readonly entryPoint?: Array<string>;

    /**
     * Specifies the working directory.
     *
     * The length of the directory string cannot exceed 1,000 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-workingdirectory
     */
    readonly workingDirectory?: string;
  }

  /**
   * packageType enum
   */
  export class PackageTypeEnum {
    public static readonly IMAGE = new PackageTypeEnum('Image');
    public static readonly ZIP = new PackageTypeEnum('Zip');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * Runtime enum
   */
  export class RuntimeEnum {
    public static readonly NODEJS = new RuntimeEnum('nodejs');
    public static readonly NODEJS4_3 = new RuntimeEnum('nodejs4.3');
    public static readonly NODEJS6_10 = new RuntimeEnum('nodejs6.10');
    public static readonly NODEJS8_10 = new RuntimeEnum('nodejs8.10');
    public static readonly NODEJS10_X = new RuntimeEnum('nodejs10.x');
    public static readonly NODEJS12_X = new RuntimeEnum('nodejs12.x');
    public static readonly NODEJS14_X = new RuntimeEnum('nodejs14.x');
    public static readonly NODEJS16_X = new RuntimeEnum('nodejs16.x');
    public static readonly JAVA8 = new RuntimeEnum('java8');
    public static readonly JAVA8_AL2 = new RuntimeEnum('java8.al2');
    public static readonly JAVA11 = new RuntimeEnum('java11');
    public static readonly PYTHON2_7 = new RuntimeEnum('python2.7');
    public static readonly PYTHON3_6 = new RuntimeEnum('python3.6');
    public static readonly PYTHON3_7 = new RuntimeEnum('python3.7');
    public static readonly PYTHON3_8 = new RuntimeEnum('python3.8');
    public static readonly PYTHON3_9 = new RuntimeEnum('python3.9');
    public static readonly DOTNETCORE1_0 = new RuntimeEnum('dotnetcore1.0');
    public static readonly DOTNETCORE2_0 = new RuntimeEnum('dotnetcore2.0');
    public static readonly DOTNETCORE2_1 = new RuntimeEnum('dotnetcore2.1');
    public static readonly DOTNETCORE3_1 = new RuntimeEnum('dotnetcore3.1');
    public static readonly DOTNET6 = new RuntimeEnum('dotnet6');
    public static readonly NODEJS4_3_EDGE = new RuntimeEnum('nodejs4.3-edge');
    public static readonly GO1_X = new RuntimeEnum('go1.x');
    public static readonly RUBY2_5 = new RuntimeEnum('ruby2.5');
    public static readonly RUBY2_7 = new RuntimeEnum('ruby2.7');
    public static readonly PROVIDED = new RuntimeEnum('provided');
    public static readonly PROVIDED_AL2 = new RuntimeEnum('provided.al2');
    public static readonly NODEJS18_X = new RuntimeEnum('nodejs18.x');
    public static readonly PYTHON3_10 = new RuntimeEnum('python3.10');
    public static readonly JAVA17 = new RuntimeEnum('java17');
    public static readonly RUBY3_2 = new RuntimeEnum('ruby3.2');
    public static readonly PYTHON3_11 = new RuntimeEnum('python3.11');
    public static readonly NODEJS20_X = new RuntimeEnum('nodejs20.x');
    public static readonly PROVIDED_AL2023 = new RuntimeEnum('provided.al2023');
    public static readonly PYTHON3_12 = new RuntimeEnum('python3.12');
    public static readonly JAVA21 = new RuntimeEnum('java21');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * TracingConfigMode enum
   */
  export class TracingConfigMode {
    public static readonly ACTIVE = new TracingConfigMode('Active');
    public static readonly PASSTHROUGH = new TracingConfigMode('PassThrough');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }


  /**
   * The function's [AWS X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) tracing configuration. To sample and record incoming requests, set `Mode` to `Active` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html
   */
  export interface TracingConfigProperty {
    /**
     * The tracing mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html#cfn-lambda-function-tracingconfig-mode
     */
    readonly mode?: TracingConfigMode;
  }

  /**
   * The VPC security groups and subnets that are attached to a Lambda function.
   *
   * When you connect a function to a VPC, Lambda creates an elastic network interface for each combination of security group and subnet in the function's VPC configuration. The function can only access resources and the internet through that VPC. For more information, see [VPC Settings](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html) .
   *
   * > When you delete a function, AWS CloudFormation monitors the state of its network interfaces and waits for Lambda to delete them before proceeding. If the VPC is defined in the same stack, the network interfaces need to be deleted by Lambda before AWS CloudFormation can delete the VPC's resources.
   * >
   * > To monitor network interfaces, AWS CloudFormation needs the `ec2:DescribeNetworkInterfaces` permission. It obtains this from the user or role that modifies the stack. If you don't provide this permission, AWS CloudFormation does not wait for network interfaces to be deleted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * Allows outbound IPv6 traffic on VPC functions that are connected to dual-stack subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-ipv6allowedfordualstack
     */
    readonly ipv6AllowedForDualStack?: boolean | cdk.IResolvable;

    /**
     * A list of VPC security group IDs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * A list of VPC subnet IDs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html#cfn-lambda-function-vpcconfig-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * DeadLetterConfigTargetProperty Interface
   * it can be CfnQueue or CfnTopic
   */
  export interface IDeadLetterConfigTargetProperty {
    returnTargetArn(): string;
  }

  /**
   * The [dead-letter queue](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#dlq) for failed asynchronous invocations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html
   */
  export interface DeadLetterConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of an Amazon SQS queue or Amazon SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html#cfn-lambda-function-deadletterconfig-targetarn
     */
    readonly target?: IDeadLetterConfigTargetProperty;
  }

  /**
   * RuntimeManagementConfigUpdateRuntimeOn enum
   */
  export class RuntimeManagementConfigUpdateRuntimeOn {
    public static readonly AUTO = new RuntimeManagementConfigUpdateRuntimeOn('Auto');
    public static readonly MANUAL = new RuntimeManagementConfigUpdateRuntimeOn('Manual');
    public static readonly FUNCTIONUPDATE = new RuntimeManagementConfigUpdateRuntimeOn('FunctionUpdate');

    readonly name: string;
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * Sets the runtime management configuration for a function's version.
   *
   * For more information, see [Runtime updates](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html
   */
  export interface RuntimeManagementConfigProperty {
    /**
     * The ARN of the runtime version you want the function to use.
     *
     * > This is only required if you're using the *Manual* runtime update mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-runtimeversionarn
     */
    readonly runtimeVersionArn?: string;

    /**
     * Specify the runtime update mode.
     *
     * - *Auto (default)* - Automatically update to the most recent and secure runtime version using a [Two-phase runtime version rollout](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html#runtime-management-two-phase) . This is the best choice for most customers to ensure they always benefit from runtime updates.
     * - *FunctionUpdate* - Lambda updates the runtime of you function to the most recent and secure runtime version when you update your function. This approach synchronizes runtime updates with function deployments, giving you control over when runtime updates are applied and allowing you to detect and mitigate rare runtime update incompatibilities early. When using this setting, you need to regularly update your functions to keep their runtime up-to-date.
     * - *Manual* - You specify a runtime version in your function configuration. The function will use this runtime version indefinitely. In the rare case where a new runtime version is incompatible with an existing function, this allows you to roll back your function to an earlier runtime version. For more information, see [Roll back a runtime version](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html#runtime-management-rollback) .
     *
     * *Valid Values* : `Auto` | `FunctionUpdate` | `Manual`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-updateruntimeon
     */
    readonly updateRuntimeOn: RuntimeManagementConfigUpdateRuntimeOn;
  }

  /**
   * SnapStartApplyOn Enum
   */
  export class SnapStartApplyOn {
    public static readonly PUBLISHEDVERSIONS = new SnapStartApplyOn('PublishedVersions');
    public static readonly NONE = new SnapStartApplyOn('None');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstart.html
   */
  export interface SnapStartProperty {
    /**
     * Set `ApplyOn` to `PublishedVersions` to create a snapshot of the initialized execution environment when you publish a function version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstart.html#cfn-lambda-function-snapstart-applyon
     */
    readonly applyOn: SnapStartApplyOn;
  }

  /**
   * The [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) for a Lambda function. To deploy a function defined as a container image, you specify the location of a container image in the Amazon ECR registry. For a .zip file deployment package, you can specify the location of an object in Amazon S3. For Node.js and Python functions, you can specify the function code inline in the template.
   *
   * Changes to a deployment package in Amazon S3 or a container image in ECR are not detected automatically during stack updates. To update the function code, change the object key or version in the template.
   *
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html
   */
  export interface ICodeProperty {
    returnCode(): any;
  }

  /**
   * Lambda Function S3 Code
   */
  export class S3Code implements ICodeProperty {
    /**
     * An Amazon S3 bucket in the same AWS Region as your function.
     *
     * The bucket can be in a different AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The Amazon S3 key of the deployment package.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3key
     */
    readonly s3Key: string;

    /**
     * For versioned objects, the version of the deployment package object to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-s3objectversion
     */
    readonly s3ObjectVersion?: string;

    constructor(s3Bucket: string, s3Key: string, s3ObjectVersion?: string) {
      // super();
      this.s3Bucket = s3Bucket;
      this.s3Key = s3Key;
      this.s3ObjectVersion = s3ObjectVersion;
    }

    public returnCode(): any {
      return {
        "S3Bucket": this.s3Bucket,
        "S3Key": this.s3Key,
        "S3ObjectVersion": this.s3ObjectVersion
      };
    }
  }

  /**
   * Lambda Function Image Code
   */
  export class ImageCode implements ICodeProperty {
    /**
     * URI of a [container image](https://docs.aws.amazon.com/lambda/latest/dg/lambda-images.html) in the Amazon ECR registry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-imageuri
     */
    readonly imageUri: string;

    constructor(imageUri: string) {
      // super();
      this.imageUri = imageUri;
    }

    public returnCode(): any {
      return {
        "ImageUri": this.imageUri
      };
    }
  }

  /**
   * Lambda Function Inline Code
   */
  export class InlineCode implements ICodeProperty {
    /**
     * (Node.js and Python) The source code of your Lambda function. If you include your function source inline with this parameter, AWS CloudFormation places it in a file named `index` and zips it to create a [deployment package](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html) . This zip file cannot exceed 4MB. For the `Handler` property, the first part of the handler identifier must be `index` . For example, `index.handler` .
     *
     * For JSON, you must escape quotes and special characters such as newline ( `\n` ) with a backslash.
     *
     * If you specify a function that interacts with an AWS CloudFormation custom resource, you don't have to write your own functions to send responses to the custom resource that invoked the function. AWS CloudFormation provides a response module ( [cfn-response](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-lambda-function-code-cfnresponsemodule.html) ) that simplifies sending responses. See [Using AWS Lambda with AWS CloudFormation](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudformation.html) for details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-zipfile
     */
    readonly zipFile: string;

    constructor(zipFile: string) {
      // super();
      this.zipFile = zipFile;
    }

    public returnCode(): any {
      return {
        "ZipFile": this.zipFile
      };
    }
  }

  /**
   * Details about the connection between a Lambda function and an [Amazon EFS file system](https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html
   */
  export interface FileSystemConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon EFS access point that provides access to the file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-arn
     */
    readonly arn: string;

    /**
     * The path where the function can access the file system, starting with `/mnt/` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
     */
    readonly localMountPath: string;
  }

  /**
   * A function's environment variable settings.
   *
   * You can use environment variables to adjust your function's behavior without updating code. An environment variable is a pair of strings that are stored in a function's version-specific configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html
   */
  export interface EnvironmentProperty {
    /**
     * Environment variable key-value pairs.
     *
     * For more information, see [Using Lambda environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html#cfn-lambda-function-environment-variables
     */
    readonly variables?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The size of the function's `/tmp` directory in MB.
   *
   * The default value is 512, but it can be any whole number between 512 and 10,240 MB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-ephemeralstorage.html
   */
  export interface EphemeralStorageProperty {
    /**
     * The size of the function's `/tmp` directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-ephemeralstorage.html#cfn-lambda-function-ephemeralstorage-size
     */
    readonly size: number;
  }

  /**
   * applicationLogLevel enum
   */
  export class LoggingConfigApplicationLogLevel {
    public static readonly TRACE = new LoggingConfigApplicationLogLevel('TRACE');
    public static readonly DEBUG = new LoggingConfigApplicationLogLevel('DEBUG');
    public static readonly INFO = new LoggingConfigApplicationLogLevel('INFO');
    public static readonly WARN = new LoggingConfigApplicationLogLevel('WARN');
    public static readonly ERROR = new LoggingConfigApplicationLogLevel('ERROR');
    public static readonly FATAL = new LoggingConfigApplicationLogLevel('FATAL');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * LogFormat enum
   */
  export class LoggingConfigLogFormat {
    public static readonly TEXT = new LoggingConfigLogFormat('Text');
    public static readonly JSON = new LoggingConfigLogFormat('JSON');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * SystemLogLevel enum
   */
  export class LoggingConfigSystemLogLevel {
    public static readonly DEBUG = new LoggingConfigSystemLogLevel('DEBUG');
    public static readonly INFO = new LoggingConfigSystemLogLevel('INFO');
    public static readonly WARN = new LoggingConfigSystemLogLevel('WARN');
    readonly name: string
    protected constructor(name: string) {
      this.name = name;
    }
  }

  /**
   * The function's Amazon CloudWatch Logs configuration settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-loggingconfig.html
   */
  export interface LoggingConfigProperty {
    /**
     * Set this property to filter the application logs for your function that Lambda sends to CloudWatch.
     *
     * Lambda only sends application logs at the selected level of detail and lower, where `TRACE` is the highest level and `FATAL` is the lowest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-loggingconfig.html#cfn-lambda-function-loggingconfig-applicationloglevel
     */
    readonly applicationLogLevel?: LoggingConfigApplicationLogLevel;

    /**
     * The format in which Lambda sends your function's application and system logs to CloudWatch.
     *
     * Select between plain text and structured JSON.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-loggingconfig.html#cfn-lambda-function-loggingconfig-logformat
     */
    readonly logFormat?: LoggingConfigLogFormat;

    /**
     * The name of the Amazon CloudWatch log group the function sends logs to.
     *
     * By default, Lambda functions send logs to a default log group named `/aws/lambda/<function name>` . To use a different log group, enter an existing log group or enter a new log group name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-loggingconfig.html#cfn-lambda-function-loggingconfig-loggroup
     */
    readonly logGroup?: string;

    /**
     * Set this property to filter the system logs for your function that Lambda sends to CloudWatch.
     *
     * Lambda only sends system logs at the selected level of detail and lower, where `DEBUG` is the highest level and `WARN` is the lowest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-loggingconfig.html#cfn-lambda-function-loggingconfig-systemloglevel
     */
    readonly systemLogLevel?: LoggingConfigSystemLogLevel;
  }

  /**
   * The function's [SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html
   */
  export interface SnapStartResponseProperty {
    /**
     * When set to `PublishedVersions` , Lambda creates a snapshot of the execution environment when you publish a function version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html#cfn-lambda-function-snapstartresponse-applyon
     */
    readonly applyOn?: string;

    /**
     * When you provide a [qualified Amazon Resource Name (ARN)](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html#versioning-versions-using) , this response element indicates whether SnapStart is activated for the specified function version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-snapstartresponse.html#cfn-lambda-function-snapstartresponse-optimizationstatus
     */
    readonly optimizationStatus?: string;
  }
}

/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
 */
export interface CfnFunctionProps {
  /**
   * The instruction set architecture that the function supports.
   *
   * Enter a string array with one of the valid values (arm64 or x86_64). The default value is `x86_64` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-architectures
   */
  readonly architectures?: Array<CfnFunction.ArchitecturesEnum>;

  /**
   * The code for the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-code
   */
  readonly code: CfnFunction.ICodeProperty;

  /**
   * To enable code signing for this function, specify the ARN of a code-signing configuration.
   *
   * A code-signing configuration
   * includes a set of signing profiles, which define the trusted publishers for this function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-codesigningconfigarn
   */
  readonly codeSigningConfig?: ICfnCodeSigningConfig;

  /**
   * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing.
   *
   * For more information, see [Dead-letter queues](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-dlq) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-deadletterconfig
   */
  readonly deadLetterConfig?: CfnFunction.DeadLetterConfigProperty;

  /**
   * A description of the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-description
   */
  readonly description?: string;

  /**
   * Environment variables that are accessible from function code during execution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-environment
   */
  readonly environment?: CfnFunction.EnvironmentProperty | cdk.IResolvable;

  /**
   * The size of the function's `/tmp` directory in MB.
   *
   * The default value is 512, but it can be any whole number between 512 and 10,240 MB.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-ephemeralstorage
   */
  readonly ephemeralStorage?: CfnFunction.EphemeralStorageProperty | cdk.IResolvable;

  /**
   * Connection settings for an Amazon EFS file system.
   *
   * To connect a function to a file system, a mount target must be available in every Availability Zone that your function connects to. If your template contains an [AWS::EFS::MountTarget](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-mounttarget.html) resource, you must also specify a `DependsOn` attribute to ensure that the mount target is created or updated before the function.
   *
   * For more information about using the `DependsOn` attribute, see [DependsOn Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-filesystemconfigs
   */
  readonly fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the Lambda function, up to 64 characters in length.
   *
   * If you don't specify a name, AWS CloudFormation generates one.
   *
   * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-functionname
   */
  readonly functionName?: string;

  /**
   * The name of the method within your code that Lambda calls to run your function.
   *
   * Handler is required if the deployment package is a .zip file archive. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see [Lambda programming model](https://docs.aws.amazon.com/lambda/latest/dg/foundation-progmodel.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-handler
   */
  readonly handler?: string;

  /**
   * Configuration values that override the container image Dockerfile settings.
   *
   * For more information, see [Container image settings](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html#images-parms) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-imageconfig
   */
  readonly imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

  /**
   * The ARN of the AWS Key Management Service ( AWS KMS ) customer managed key that's used to encrypt your function's [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-encryption) . When [Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart-security.html) is activated, Lambda also uses this key is to encrypt your function's snapshot. If you deploy your function using a container image, Lambda also uses this key to encrypt your function when it's deployed. Note that this is not the same key that's used to protect your container image in the Amazon Elastic Container Registry (Amazon ECR). If you don't provide a customer managed key, Lambda uses a default service key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * A list of [function layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to add to the function's execution environment. Specify each layer by its ARN, including the version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-layers
   */
  readonly layers?: Array<ICfnLayerVersion>;

  /**
   * The function's Amazon CloudWatch Logs configuration settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-loggingconfig
   */
  readonly loggingConfig?: cdk.IResolvable | CfnFunction.LoggingConfigProperty;

  /**
   * The amount of [memory available to the function](https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console) at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB. Note that new AWS accounts have reduced concurrency and memory quotas. AWS raises these quotas automatically based on your usage. You can also request a quota increase.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize
   */
  readonly memorySize?: number;

  /**
   * The type of deployment package.
   *
   * Set to `Image` for container image and set `Zip` for .zip file archive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-packagetype
   */
  readonly packageType?: CfnFunction.PackageTypeEnum;

  /**
   * The number of simultaneous executions to reserve for the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-reservedconcurrentexecutions
   */
  readonly reservedConcurrentExecutions?: number;

  /**
   * The Amazon Resource Name (ARN) of the function's execution role.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-role
   */
  readonly role: iam.ICfnRole;

  /**
   * The identifier of the function's [runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Runtime is required if the deployment package is a .zip file archive.
   *
   * The following list includes deprecated runtimes. For more information, see [Runtime deprecation policy](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtime
   */
  readonly runtime?: CfnFunction.RuntimeEnum;

  /**
   * Sets the runtime management configuration for a function's version.
   *
   * For more information, see [Runtime updates](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtimemanagementconfig
   */
  readonly runtimeManagementConfig?: cdk.IResolvable | CfnFunction.RuntimeManagementConfigProperty;

  /**
   * The function's [AWS Lambda SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-snapstart
   */
  readonly snapStart?: cdk.IResolvable | CfnFunction.SnapStartProperty;

  /**
   * A list of [tags](https://docs.aws.amazon.com/lambda/latest/dg/tagging.html) to apply to the function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The amount of time (in seconds) that Lambda allows a function to run before stopping it.
   *
   * The default is 3 seconds. The maximum allowed value is 900 seconds. For more information, see [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout
   */
  readonly timeout?: cdk.Duration;

  /**
   * Set `Mode` to `Active` to sample and trace a subset of incoming requests with [X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tracingconfig
   */
  readonly tracingConfig?: cdk.IResolvable | CfnFunction.TracingConfigProperty;

  /**
   * For network connectivity to AWS resources in a VPC, specify a list of security groups and subnets in the VPC.
   *
   * When you connect a function to a VPC, it can access resources and the internet only through that VPC. For more information, see [Configuring a Lambda function to access resources in a VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnFunction.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `ImageConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionImageConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("entryPoint", cdk.listValidator(cdk.validateString))(properties.entryPoint));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"ImageConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionImageConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionImageConfigPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "EntryPoint": cdk.listMapper(cdk.stringToCloudFormation)(properties.entryPoint),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

/**
 * Determine whether the given properties match those of a `Layers`
 *
 * @param properties - the TypeScript properties of a `Layers`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionLayersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"ImageConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionLayersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionLayersPropertyValidator(properties).assertSuccess();
  return cdk.stringToCloudFormation(properties.attrLayerVersionArn);
}

/**
 * Determine whether the given properties match those of a `TracingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TracingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionTracingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"TracingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionTracingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionTracingConfigPropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode?.name)
  };
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipv6AllowedForDualStack", cdk.validateBoolean)(properties.ipv6AllowedForDualStack));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "Ipv6AllowedForDualStack": cdk.booleanToCloudFormation(properties.ipv6AllowedForDualStack),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"DeadLetterConfigProperty\"");
}

/**
 * Determine whether the given properties match those of a `Architectures`
 *
 * @param properties - the TypeScript properties of a `Architectures`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function convertCfnFunctionArchitecturePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"DeadLetterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDeadLetterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDeadLetterConfigPropertyValidator(properties).assertSuccess();
  return {
    "TargetArn": cdk.stringToCloudFormation(properties.target.returnTargetArn())
  };
}

/**
 * Determine whether the given properties match those of a `RuntimeManagementConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimeManagementConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionRuntimeManagementConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"RuntimeManagementConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionRuntimeManagementConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionRuntimeManagementConfigPropertyValidator(properties).assertSuccess();
  return {
    "RuntimeVersionArn": cdk.stringToCloudFormation(properties.runtimeVersionArn),
    "UpdateRuntimeOn": cdk.stringToCloudFormation(properties.updateRuntimeOn?.name)
  };
}

/**
 * Determine whether the given properties match those of a `SnapStartProperty`
 *
 * @param properties - the TypeScript properties of a `SnapStartProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSnapStartPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"SnapStartProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSnapStartPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSnapStartPropertyValidator(properties).assertSuccess();
  return {
    "ApplyOn": cdk.stringToCloudFormation(properties.applyOn?.name)
  };
}

/**
 * Determine whether the given properties match those of a `CodeProperty`
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"CodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionArchitecturePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  convertCfnFunctionArchitecturePropertyValidator(properties).assertSuccess();
  return cdk.stringToCloudFormation(properties.name);
}

// @ts-ignore TS6133
function convertCfnFunctionCodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCodePropertyValidator(properties).assertSuccess();
  return "returnCode" in properties ? properties.returnCode(): properties;
}

/**
 * Determine whether the given properties match those of a `FileSystemConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFileSystemConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("localMountPath", cdk.requiredValidator)(properties.localMountPath));
  errors.collect(cdk.propertyValidator("localMountPath", cdk.validateString)(properties.localMountPath));
  return errors.wrap("supplied properties not correct for \"FileSystemConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFileSystemConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFileSystemConfigPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "LocalMountPath": cdk.stringToCloudFormation(properties.localMountPath)
  };
}

/**
 * Determine whether the given properties match those of a `EnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("variables", cdk.hashValidator(cdk.validateString))(properties.variables));
  return errors.wrap("supplied properties not correct for \"EnvironmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEnvironmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEnvironmentPropertyValidator(properties).assertSuccess();
  return {
    "Variables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables)
  };
}

/**
 * Determine whether the given properties match those of a `EphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"EphemeralStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEphemeralStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEphemeralStoragePropertyValidator(properties).assertSuccess();
  return {
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

/**
 * Determine whether the given properties match those of a `LoggingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionLoggingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"LoggingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionLoggingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionLoggingConfigPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationLogLevel": cdk.stringToCloudFormation(properties.applicationLogLevel?.name),
    "LogFormat": cdk.stringToCloudFormation(properties.logFormat?.name),
    "LogGroup": cdk.stringToCloudFormation(properties.logGroup),
    "SystemLogLevel": cdk.stringToCloudFormation(properties.systemLogLevel?.name)
  };
}

/**
 * Determine whether the given properties match those of a `SnapStartResponseProperty`
 *
 * @param properties - the TypeScript properties of a `SnapStartResponseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSnapStartResponsePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"SnapStartResponseProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSnapStartResponsePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSnapStartResponsePropertyValidator(properties).assertSuccess();
  return {
    "ApplyOn": cdk.stringToCloudFormation(properties.applyOn),
    "OptimizationStatus": cdk.stringToCloudFormation(properties.optimizationStatus)
  };
}

/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  return errors.wrap("supplied properties not correct for \"CfnFunctionProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionPropsValidator(properties).assertSuccess();
  return {
    "Architectures": cdk.listMapper(convertCfnFunctionArchitecturePropertyToCloudFormation)(properties.architectures),
    "Code": convertCfnFunctionCodePropertyToCloudFormation(properties.code),
    "CodeSigningConfigArn": cdk.stringToCloudFormation(properties.codeSigningConfig?.attrCodeSigningConfigArn),
    "DeadLetterConfig": convertCfnFunctionDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Environment": convertCfnFunctionEnvironmentPropertyToCloudFormation(properties.environment),
    "EphemeralStorage": convertCfnFunctionEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
    "FileSystemConfigs": cdk.listMapper(convertCfnFunctionFileSystemConfigPropertyToCloudFormation)(properties.fileSystemConfigs),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "Handler": cdk.stringToCloudFormation(properties.handler),
    "ImageConfig": convertCfnFunctionImageConfigPropertyToCloudFormation(properties.imageConfig),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "Layers": cdk.listMapper(convertCfnFunctionLayersPropertyToCloudFormation)(properties.layers),
    "LoggingConfig": convertCfnFunctionLoggingConfigPropertyToCloudFormation(properties.loggingConfig),
    "MemorySize": cdk.numberToCloudFormation(properties.memorySize),
    "PackageType": cdk.stringToCloudFormation(properties.packageType?.name),
    "ReservedConcurrentExecutions": cdk.numberToCloudFormation(properties.reservedConcurrentExecutions),
    "Role": cdk.stringToCloudFormation("attrArn" in properties.role ? properties.role.attrArn : properties.role),
    "Runtime": cdk.stringToCloudFormation(properties.runtime?.name),
    "RuntimeManagementConfig": convertCfnFunctionRuntimeManagementConfigPropertyToCloudFormation(properties.runtimeManagementConfig),
    "SnapStart": convertCfnFunctionSnapStartPropertyToCloudFormation(properties.snapStart),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Timeout": cdk.numberToCloudFormation(properties.timeout?.toSeconds()),
    "TracingConfig": convertCfnFunctionTracingConfigPropertyToCloudFormation(properties.tracingConfig),
    "VpcConfig": convertCfnFunctionVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

/**
 * The `AWS::Lambda::LayerVersion` resource interface
 */
export interface ICfnLayerVersion extends constructs.IConstruct {

  /**
   * The ARN of the layer version.
   *
   * @cloudformationAttribute LayerVersionArn
   */
  readonly attrLayerVersionArn: string;
}

/**
 * The `AWS::Lambda::LayerVersion` resource creates a [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) from a ZIP archive.
 *
 * @cloudformationResource AWS::Lambda::LayerVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html
 */
export class CfnLayerVersion extends cdk.CfnResource implements ICfnLayerVersion, cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::LayerVersion";

  /**
   * The ARN of the layer version.
   *
   * @cloudformationAttribute LayerVersionArn
   */
  public readonly attrLayerVersionArn: string;

  /**
   * A list of compatible [instruction set architectures](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) .
   */
  public compatibleArchitectures?: Array<string>;

  /**
   * A list of compatible [function runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Used for filtering with [ListLayers](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayers.html) and [ListLayerVersions](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayerVersions.html) .
   */
  public compatibleRuntimes?: Array<string>;

  /**
   * The function layer archive.
   */
  public content: CfnLayerVersion.ContentProperty | cdk.IResolvable;

  /**
   * The description of the version.
   */
  public description?: string;

  /**
   * The name or Amazon Resource Name (ARN) of the layer.
   */
  public layerName?: string;

  /**
   * The layer's software license. It can be any of the following:.
   */
  public licenseInfo?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionProps) {
    super(scope, id, {
      "type": CfnLayerVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "content", this);

    this.attrLayerVersionArn = cdk.Token.asString(this.getAtt("LayerVersionArn", cdk.ResolutionTypeHint.STRING));
    this.compatibleArchitectures = props.compatibleArchitectures;
    this.compatibleRuntimes = props.compatibleRuntimes;
    this.content = props.content;
    this.description = props.description;
    this.layerName = props.layerName;
    this.licenseInfo = props.licenseInfo;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "compatibleArchitectures": this.compatibleArchitectures,
      "compatibleRuntimes": this.compatibleRuntimes,
      "content": this.content,
      "description": this.description,
      "layerName": this.layerName,
      "licenseInfo": this.licenseInfo
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLayerVersionPropsToCloudFormation(props);
  }
}

export namespace CfnLayerVersion {
  /**
   * A ZIP archive that contains the contents of an [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html
   */
  export interface ContentProperty {
    /**
     * The Amazon S3 bucket of the layer archive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The Amazon S3 key of the layer archive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3key
     */
    readonly s3Key: string;

    /**
     * For versioned objects, the version of the layer archive object to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-layerversion-content.html#cfn-lambda-layerversion-content-s3objectversion
     */
    readonly s3ObjectVersion?: string;
  }
}

/**
 * Properties for defining a `CfnLayerVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html
 */
export interface CfnLayerVersionProps {
  /**
   * A list of compatible [instruction set architectures](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatiblearchitectures
   */
  readonly compatibleArchitectures?: Array<string>;

  /**
   * A list of compatible [function runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) . Used for filtering with [ListLayers](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayers.html) and [ListLayerVersions](https://docs.aws.amazon.com/lambda/latest/dg/API_ListLayerVersions.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-compatibleruntimes
   */
  readonly compatibleRuntimes?: Array<string>;

  /**
   * The function layer archive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-content
   */
  readonly content: CfnLayerVersion.ContentProperty | cdk.IResolvable;

  /**
   * The description of the version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-description
   */
  readonly description?: string;

  /**
   * The name or Amazon Resource Name (ARN) of the layer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-layername
   */
  readonly layerName?: string;

  /**
   * The layer's software license. It can be any of the following:.
   *
   * - An [SPDX license identifier](https://docs.aws.amazon.com/https://spdx.org/licenses/) . For example, `MIT` .
   * - The URL of a license hosted on the internet. For example, `https://opensource.org/licenses/MIT` .
   * - The full text of the license.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversion.html#cfn-lambda-layerversion-licenseinfo
   */
  readonly licenseInfo?: string;
}

/**
 * Determine whether the given properties match those of a `ContentProperty`
 *
 * @param properties - the TypeScript properties of a `ContentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVersionContentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3ObjectVersion", cdk.validateString)(properties.s3ObjectVersion));
  return errors.wrap("supplied properties not correct for \"ContentProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerVersionContentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVersionContentPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key),
    "S3ObjectVersion": cdk.stringToCloudFormation(properties.s3ObjectVersion)
  };
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compatibleArchitectures", cdk.listValidator(cdk.validateString))(properties.compatibleArchitectures));
  errors.collect(cdk.propertyValidator("compatibleRuntimes", cdk.listValidator(cdk.validateString))(properties.compatibleRuntimes));
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", CfnLayerVersionContentPropertyValidator)(properties.content));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("layerName", cdk.validateString)(properties.layerName));
  errors.collect(cdk.propertyValidator("licenseInfo", cdk.validateString)(properties.licenseInfo));
  return errors.wrap("supplied properties not correct for \"CfnLayerVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnLayerVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVersionPropsValidator(properties).assertSuccess();
  return {
    "CompatibleArchitectures": cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleArchitectures),
    "CompatibleRuntimes": cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleRuntimes),
    "Content": convertCfnLayerVersionContentPropertyToCloudFormation(properties.content),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LayerName": cdk.stringToCloudFormation(properties.layerName),
    "LicenseInfo": cdk.stringToCloudFormation(properties.licenseInfo)
  };
}

/**
 * The `AWS::Lambda::LayerVersionPermission` resource adds permissions to the resource-based policy of a version of an [Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) . Use this action to grant layer usage permission to other accounts. You can grant permission to a single account, all AWS accounts, or all accounts in an organization.
 *
 * > Since the release of the [UpdateReplacePolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html) both `UpdateReplacePolicy` and `DeletionPolicy` are required to protect your Resources/LayerPermissions from deletion.
 *
 * @cloudformationResource AWS::Lambda::LayerVersionPermission
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html
 */
export class CfnLayerVersionPermission extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::LayerVersionPermission";

  /**
   * ID generated by service
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The API action that grants access to the layer.
   */
  public action: string;

  /**
   * The name or Amazon Resource Name (ARN) of the layer.
   */
  public layerVersionArn: string;

  /**
   * With the principal set to `*` , grant permission to all accounts in the specified organization.
   */
  public organizationId?: string;

  /**
   * An account ID, or `*` to grant layer usage permission to all accounts in an organization, or all AWS accounts (if `organizationId` is not specified).
   */
  public principal: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionPermissionProps) {
    super(scope, id, {
      "type": CfnLayerVersionPermission.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "layerVersionArn", this);
    cdk.requireProperty(props, "principal", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.layerVersionArn = props.layerVersionArn;
    this.organizationId = props.organizationId;
    this.principal = props.principal;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "layerVersionArn": this.layerVersionArn,
      "organizationId": this.organizationId,
      "principal": this.principal
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersionPermission.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLayerVersionPermissionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLayerVersionPermission`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html
 */
export interface CfnLayerVersionPermissionProps {
  /**
   * The API action that grants access to the layer.
   *
   * For example, `lambda:GetLayerVersion` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-action
   */
  readonly action: string;

  /**
   * The name or Amazon Resource Name (ARN) of the layer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-layerversionarn
   */
  readonly layerVersionArn: string;

  /**
   * With the principal set to `*` , grant permission to all accounts in the specified organization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-organizationid
   */
  readonly organizationId?: string;

  /**
   * An account ID, or `*` to grant layer usage permission to all accounts in an organization, or all AWS accounts (if `organizationId` is not specified).
   *
   * For the last case, make sure that you really do want all AWS accounts to have usage permission to this layer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-layerversionpermission.html#cfn-lambda-layerversionpermission-principal
   */
  readonly principal: string;
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionPermissionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVersionPermissionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("layerVersionArn", cdk.requiredValidator)(properties.layerVersionArn));
  errors.collect(cdk.propertyValidator("layerVersionArn", cdk.validateString)(properties.layerVersionArn));
  errors.collect(cdk.propertyValidator("organizationId", cdk.validateString)(properties.organizationId));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  return errors.wrap("supplied properties not correct for \"CfnLayerVersionPermissionProps\"");
}

// @ts-ignore TS6133
function convertCfnLayerVersionPermissionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVersionPermissionPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "LayerVersionArn": cdk.stringToCloudFormation(properties.layerVersionArn),
    "OrganizationId": cdk.stringToCloudFormation(properties.organizationId),
    "Principal": cdk.stringToCloudFormation(properties.principal)
  };
}

/**
 * The `AWS::Lambda::Permission` resource grants an AWS service or another account permission to use a function.
 *
 * You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function.
 *
 * To grant permission to another account, specify the account ID as the `Principal` . To grant permission to an organization defined in AWS Organizations , specify the organization ID as the `PrincipalOrgID` . For AWS services, the principal is a domain-style identifier defined by the service, like `s3.amazonaws.com` or `sns.amazonaws.com` . For AWS services, you can also specify the ARN of the associated resource as the `SourceArn` . If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function.
 *
 * If your function has a function URL, you can specify the `FunctionUrlAuthType` parameter. This adds a condition to your permission that only applies when your function URL's `AuthType` matches the specified `FunctionUrlAuthType` . For more information about the `AuthType` parameter, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
 *
 * This resource adds a statement to a resource-based permission policy for the function. For more information about function policies, see [Lambda Function Policies](https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html) .
 *
 * @cloudformationResource AWS::Lambda::Permission
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html
 */
export class CfnPermission extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::Permission";

  /**
   * A statement identifier that differentiates the statement from others in the same policy.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The action that the principal can use on the function.
   */
  public action: string;

  /**
   * For Alexa Smart Home functions, a token that the invoker must supply.
   */
  public eventSourceToken?: string;

  /**
   * The name of the Lambda function, version, or alias.
   */
  public functionName: string;

  /**
   * The type of authentication that your function URL uses.
   */
  public functionUrlAuthType?: string;

  /**
   * The AWS service or AWS account that invokes the function.
   */
  public principal: string;

  /**
   * The identifier for your organization in AWS Organizations .
   */
  public principalOrgId?: string;

  /**
   * For AWS service , the ID of the AWS account that owns the resource.
   */
  public sourceAccount?: string;

  /**
   * For AWS services , the ARN of the AWS resource that invokes the function.
   */
  public sourceArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPermissionProps) {
    super(scope, id, {
      "type": CfnPermission.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "action", this);
    cdk.requireProperty(props, "functionName", this);
    cdk.requireProperty(props, "principal", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.eventSourceToken = props.eventSourceToken;
    this.functionName = props.functionName;
    this.functionUrlAuthType = props.functionUrlAuthType;
    this.principal = props.principal;
    this.principalOrgId = props.principalOrgId;
    this.sourceAccount = props.sourceAccount;
    this.sourceArn = props.sourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "eventSourceToken": this.eventSourceToken,
      "functionName": this.functionName,
      "functionUrlAuthType": this.functionUrlAuthType,
      "principal": this.principal,
      "principalOrgId": this.principalOrgId,
      "sourceAccount": this.sourceAccount,
      "sourceArn": this.sourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPermission.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPermissionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPermission`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html
 */
export interface CfnPermissionProps {
  /**
   * The action that the principal can use on the function.
   *
   * For example, `lambda:InvokeFunction` or `lambda:GetFunction` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-action
   */
  readonly action: string;

  /**
   * For Alexa Smart Home functions, a token that the invoker must supply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-eventsourcetoken
   */
  readonly eventSourceToken?: string;

  /**
   * The name of the Lambda function, version, or alias.
   *
   * **Name formats** - *Function name* – `my-function` (name-only), `my-function:v1` (with alias).
   * - *Function ARN* – `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
   * - *Partial ARN* – `123456789012:function:my-function` .
   *
   * You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionname
   */
  readonly functionName: string;

  /**
   * The type of authentication that your function URL uses.
   *
   * Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-functionurlauthtype
   */
  readonly functionUrlAuthType?: string;

  /**
   * The AWS service or AWS account that invokes the function.
   *
   * If you specify a service, use `SourceArn` or `SourceAccount` to limit who can invoke the function through that service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principal
   */
  readonly principal: string;

  /**
   * The identifier for your organization in AWS Organizations .
   *
   * Use this to grant permissions to all the AWS accounts under this organization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-principalorgid
   */
  readonly principalOrgId?: string;

  /**
   * For AWS service , the ID of the AWS account that owns the resource.
   *
   * Use this together with `SourceArn` to ensure that the specified account owns the resource. It is possible for an Amazon S3 bucket to be deleted by its owner and recreated by another account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourceaccount
   */
  readonly sourceAccount?: string;

  /**
   * For AWS services , the ARN of the AWS resource that invokes the function.
   *
   * For example, an Amazon S3 bucket or Amazon SNS topic.
   *
   * Note that Lambda configures the comparison using the `StringLike` operator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html#cfn-lambda-permission-sourcearn
   */
  readonly sourceArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPermissionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPermissionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPermissionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("eventSourceToken", cdk.validateString)(properties.eventSourceToken));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionUrlAuthType", cdk.validateString)(properties.functionUrlAuthType));
  errors.collect(cdk.propertyValidator("principal", cdk.requiredValidator)(properties.principal));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  errors.collect(cdk.propertyValidator("principalOrgId", cdk.validateString)(properties.principalOrgId));
  errors.collect(cdk.propertyValidator("sourceAccount", cdk.validateString)(properties.sourceAccount));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  return errors.wrap("supplied properties not correct for \"CfnPermissionProps\"");
}

// @ts-ignore TS6133
function convertCfnPermissionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPermissionPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "EventSourceToken": cdk.stringToCloudFormation(properties.eventSourceToken),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "FunctionUrlAuthType": cdk.stringToCloudFormation(properties.functionUrlAuthType),
    "Principal": cdk.stringToCloudFormation(properties.principal),
    "PrincipalOrgID": cdk.stringToCloudFormation(properties.principalOrgId),
    "SourceAccount": cdk.stringToCloudFormation(properties.sourceAccount),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn)
  };
}

/**
 * The `AWS::Lambda::Url` resource creates a function URL with the specified configuration parameters.
 *
 * A [function URL](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) is a dedicated HTTP(S) endpoint that you can use to invoke your function.
 *
 * @cloudformationResource AWS::Lambda::Url
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html
 */
export class CfnUrl extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::Url";

  /**
   * The Amazon Resource Name (ARN) of the function.
   *
   * @cloudformationAttribute FunctionArn
   */
  public readonly attrFunctionArn: string;

  /**
   * The HTTP URL endpoint for your function.
   *
   * @cloudformationAttribute FunctionUrl
   */
  public readonly attrFunctionUrl: string;

  /**
   * The type of authentication that your function URL uses.
   */
  public authType: string;

  /**
   * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL.
   */
  public cors?: CfnUrl.CorsProperty | cdk.IResolvable;

  /**
   * Use one of the following options:.
   */
  public invokeMode?: string;

  /**
   * The alias name.
   */
  public qualifier?: string;

  /**
   * The name of the Lambda function.
   */
  public targetFunctionArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUrlProps) {
    super(scope, id, {
      "type": CfnUrl.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authType", this);
    cdk.requireProperty(props, "targetFunctionArn", this);

    this.attrFunctionArn = cdk.Token.asString(this.getAtt("FunctionArn", cdk.ResolutionTypeHint.STRING));
    this.attrFunctionUrl = cdk.Token.asString(this.getAtt("FunctionUrl", cdk.ResolutionTypeHint.STRING));
    this.authType = props.authType;
    this.cors = props.cors;
    this.invokeMode = props.invokeMode;
    this.qualifier = props.qualifier;
    this.targetFunctionArn = props.targetFunctionArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authType": this.authType,
      "cors": this.cors,
      "invokeMode": this.invokeMode,
      "qualifier": this.qualifier,
      "targetFunctionArn": this.targetFunctionArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUrl.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUrlPropsToCloudFormation(props);
  }
}

export namespace CfnUrl {
  /**
   * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL. Use CORS to grant access to your function URL from any origin. You can also use CORS to control access for specific HTTP headers and methods in requests to your function URL.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html
   */
  export interface CorsProperty {
    /**
     * Whether you want to allow cookies or other credentials in requests to your function URL.
     *
     * The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;

    /**
     * The HTTP headers that origins can include in requests to your function URL.
     *
     * For example: `Date` , `Keep-Alive` , `X-Custom-Header` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowheaders
     */
    readonly allowHeaders?: Array<string>;

    /**
     * The HTTP methods that are allowed when calling your function URL.
     *
     * For example: `GET` , `POST` , `DELETE` , or the wildcard character ( `*` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-allowmethods
     */
    readonly allowMethods?: Array<string>;

    /**
     * The origins that can access your function URL.
     *
     * You can list any number of specific origins, separated by a comma. For example: `https://www.example.com` , `http://localhost:60905` .
     *
     * Alternatively, you can grant access to all origins with the wildcard character ( `*` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-alloworigins
     */
    readonly allowOrigins?: Array<string>;

    /**
     * The HTTP headers in your function response that you want to expose to origins that call your function URL.
     *
     * For example: `Date` , `Keep-Alive` , `X-Custom-Header` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-exposeheaders
     */
    readonly exposeHeaders?: Array<string>;

    /**
     * The maximum amount of time, in seconds, that browsers can cache results of a preflight request.
     *
     * By default, this is set to `0` , which means the browser will not cache results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-url-cors.html#cfn-lambda-url-cors-maxage
     */
    readonly maxAge?: number;
  }
}

/**
 * Properties for defining a `CfnUrl`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html
 */
export interface CfnUrlProps {
  /**
   * The type of authentication that your function URL uses.
   *
   * Set to `AWS_IAM` if you want to restrict access to authenticated users only. Set to `NONE` if you want to bypass IAM authentication to create a public endpoint. For more information, see [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-authtype
   */
  readonly authType: string;

  /**
   * The [Cross-Origin Resource Sharing (CORS)](https://docs.aws.amazon.com/https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) settings for your function URL.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-cors
   */
  readonly cors?: CfnUrl.CorsProperty | cdk.IResolvable;

  /**
   * Use one of the following options:.
   *
   * - `BUFFERED` – This is the default option. Lambda invokes your function using the `Invoke` API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.
   * - `RESPONSE_STREAM` – Your function streams payload results as they become available. Lambda invokes your function using the `InvokeWithResponseStream` API operation. The maximum response payload size is 20 MB, however, you can [request a quota increase](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-invokemode
   */
  readonly invokeMode?: string;

  /**
   * The alias name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-qualifier
   */
  readonly qualifier?: string;

  /**
   * The name of the Lambda function.
   *
   * **Name formats** - *Function name* - `my-function` .
   * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:my-function` .
   * - *Partial ARN* - `123456789012:function:my-function` .
   *
   * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-url.html#cfn-lambda-url-targetfunctionarn
   */
  readonly targetFunctionArn: string;
}

/**
 * Determine whether the given properties match those of a `CorsProperty`
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUrlCorsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCredentials", cdk.validateBoolean)(properties.allowCredentials));
  errors.collect(cdk.propertyValidator("allowHeaders", cdk.listValidator(cdk.validateString))(properties.allowHeaders));
  errors.collect(cdk.propertyValidator("allowMethods", cdk.listValidator(cdk.validateString))(properties.allowMethods));
  errors.collect(cdk.propertyValidator("allowOrigins", cdk.listValidator(cdk.validateString))(properties.allowOrigins));
  errors.collect(cdk.propertyValidator("exposeHeaders", cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
  errors.collect(cdk.propertyValidator("maxAge", cdk.validateNumber)(properties.maxAge));
  return errors.wrap("supplied properties not correct for \"CorsProperty\"");
}

// @ts-ignore TS6133
function convertCfnUrlCorsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUrlCorsPropertyValidator(properties).assertSuccess();
  return {
    "AllowCredentials": cdk.booleanToCloudFormation(properties.allowCredentials),
    "AllowHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
    "AllowMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
    "AllowOrigins": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
    "ExposeHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
    "MaxAge": cdk.numberToCloudFormation(properties.maxAge)
  };
}

/**
 * Determine whether the given properties match those of a `CfnUrlProps`
 *
 * @param properties - the TypeScript properties of a `CfnUrlProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUrlPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authType", cdk.requiredValidator)(properties.authType));
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("cors", CfnUrlCorsPropertyValidator)(properties.cors));
  errors.collect(cdk.propertyValidator("invokeMode", cdk.validateString)(properties.invokeMode));
  errors.collect(cdk.propertyValidator("qualifier", cdk.validateString)(properties.qualifier));
  errors.collect(cdk.propertyValidator("targetFunctionArn", cdk.requiredValidator)(properties.targetFunctionArn));
  errors.collect(cdk.propertyValidator("targetFunctionArn", cdk.validateString)(properties.targetFunctionArn));
  return errors.wrap("supplied properties not correct for \"CfnUrlProps\"");
}

// @ts-ignore TS6133
function convertCfnUrlPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUrlPropsValidator(properties).assertSuccess();
  return {
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "Cors": convertCfnUrlCorsPropertyToCloudFormation(properties.cors),
    "InvokeMode": cdk.stringToCloudFormation(properties.invokeMode),
    "Qualifier": cdk.stringToCloudFormation(properties.qualifier),
    "TargetFunctionArn": cdk.stringToCloudFormation(properties.targetFunctionArn)
  };
}

/**
 * The `AWS::Lambda::Version` resource creates a [version](https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html) from the current code and configuration of a function. Use versions to create a snapshot of your function code and configuration that doesn't change.
 *
 * @cloudformationResource AWS::Lambda::Version
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html
 */
export class CfnVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lambda::Version";

  /**
   * The ARN of the version.
   *
   * @cloudformationAttribute FunctionArn
   */
  public readonly attrFunctionArn: string;

  /**
   * The version number.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: string;

  /**
   * Only publish a version if the hash value matches the value that's specified.
   */
  public codeSha256?: string;

  /**
   * A description for the version to override the description in the function configuration.
   */
  public description?: string;

  /**
   * The name of the Lambda function.
   */
  public functionName: string;

  /**
   * Specifies a provisioned concurrency configuration for a function's version.
   */
  public provisionedConcurrencyConfig?: cdk.IResolvable | CfnVersion.ProvisionedConcurrencyConfigurationProperty;

  /**
   * Runtime Management Config of a function.
   */
  public runtimePolicy?: cdk.IResolvable | CfnVersion.RuntimePolicyProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVersionProps) {
    super(scope, id, {
      "type": CfnVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "functionName", this);

    this.attrFunctionArn = cdk.Token.asString(this.getAtt("FunctionArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = cdk.Token.asString(this.getAtt("Version", cdk.ResolutionTypeHint.STRING));
    this.codeSha256 = props.codeSha256;
    this.description = props.description;
    this.functionName = props.functionName;
    this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
    this.runtimePolicy = props.runtimePolicy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "codeSha256": this.codeSha256,
      "description": this.description,
      "functionName": this.functionName,
      "provisionedConcurrencyConfig": this.provisionedConcurrencyConfig,
      "runtimePolicy": this.runtimePolicy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVersionPropsToCloudFormation(props);
  }
}

export namespace CfnVersion {
  /**
   * A [provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) configuration for a function's version.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-provisionedconcurrencyconfiguration.html
   */
  export interface ProvisionedConcurrencyConfigurationProperty {
    /**
     * The amount of provisioned concurrency to allocate for the version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-provisionedconcurrencyconfiguration.html#cfn-lambda-version-provisionedconcurrencyconfiguration-provisionedconcurrentexecutions
     */
    readonly provisionedConcurrentExecutions: number;
  }

  /**
   * Runtime Management Config of a function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-runtimepolicy.html
   */
  export interface RuntimePolicyProperty {
    /**
     * The ARN of the runtime the function is configured to use.
     *
     * If the runtime update mode is manual, the ARN is returned, otherwise null is returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-runtimepolicy.html#cfn-lambda-version-runtimepolicy-runtimeversionarn
     */
    readonly runtimeVersionArn?: string;

    /**
     * The runtime update mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-version-runtimepolicy.html#cfn-lambda-version-runtimepolicy-updateruntimeon
     */
    readonly updateRuntimeOn: string;
  }
}

/**
 * Properties for defining a `CfnVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html
 */
export interface CfnVersionProps {
  /**
   * Only publish a version if the hash value matches the value that's specified.
   *
   * Use this option to avoid publishing a version if the function code has changed since you last updated it. Updates are not supported for this property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-codesha256
   */
  readonly codeSha256?: string;

  /**
   * A description for the version to override the description in the function configuration.
   *
   * Updates are not supported for this property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-description
   */
  readonly description?: string;

  /**
   * The name of the Lambda function.
   *
   * **Name formats** - *Function name* - `MyFunction` .
   * - *Function ARN* - `arn:aws:lambda:us-west-2:123456789012:function:MyFunction` .
   * - *Partial ARN* - `123456789012:function:MyFunction` .
   *
   * The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-functionname
   */
  readonly functionName: string;

  /**
   * Specifies a provisioned concurrency configuration for a function's version.
   *
   * Updates are not supported for this property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-provisionedconcurrencyconfig
   */
  readonly provisionedConcurrencyConfig?: cdk.IResolvable | CfnVersion.ProvisionedConcurrencyConfigurationProperty;

  /**
   * Runtime Management Config of a function.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html#cfn-lambda-version-runtimepolicy
   */
  readonly runtimePolicy?: cdk.IResolvable | CfnVersion.RuntimePolicyProperty;
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVersionProvisionedConcurrencyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.validateNumber)(properties.provisionedConcurrentExecutions));
  return errors.wrap("supplied properties not correct for \"ProvisionedConcurrencyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnVersionProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVersionProvisionedConcurrencyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ProvisionedConcurrentExecutions": cdk.numberToCloudFormation(properties.provisionedConcurrentExecutions)
  };
}

/**
 * Determine whether the given properties match those of a `RuntimePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVersionRuntimePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  return errors.wrap("supplied properties not correct for \"RuntimePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnVersionRuntimePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVersionRuntimePolicyPropertyValidator(properties).assertSuccess();
  return {
    "RuntimeVersionArn": cdk.stringToCloudFormation(properties.runtimeVersionArn),
    "UpdateRuntimeOn": cdk.stringToCloudFormation(properties.updateRuntimeOn?.name)
  };
}

/**
 * Determine whether the given properties match those of a `CfnVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeSha256", cdk.validateString)(properties.codeSha256));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("provisionedConcurrencyConfig", CfnVersionProvisionedConcurrencyConfigurationPropertyValidator)(properties.provisionedConcurrencyConfig));
  errors.collect(cdk.propertyValidator("runtimePolicy", CfnVersionRuntimePolicyPropertyValidator)(properties.runtimePolicy));
  return errors.wrap("supplied properties not correct for \"CfnVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVersionPropsValidator(properties).assertSuccess();
  return {
    "CodeSha256": cdk.stringToCloudFormation(properties.codeSha256),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "ProvisionedConcurrencyConfig": convertCfnVersionProvisionedConcurrencyConfigurationPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
    "RuntimePolicy": convertCfnVersionRuntimePolicyPropertyToCloudFormation(properties.runtimePolicy)
  };
}