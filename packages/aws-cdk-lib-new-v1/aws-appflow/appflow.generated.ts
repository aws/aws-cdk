/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new connector profile associated with your AWS account .
 *
 * There is a soft quota of 100 connector profiles per AWS account . If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. In each connector profile that you create, you can provide the credentials and properties for only one connector.
 *
 * @cloudformationResource AWS::AppFlow::Connector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppFlow::Connector";

  /**
   * Build a CfnConnector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   *  The arn of the connector. The arn is unique for each ConnectorRegistration in your AWS account.
   *
   * @cloudformationAttribute ConnectorArn
   */
  public readonly attrConnectorArn: string;

  /**
   * The label used for registering the connector.
   */
  public connectorLabel?: string;

  /**
   * The configuration required for registering the connector.
   */
  public connectorProvisioningConfig: CfnConnector.ConnectorProvisioningConfigProperty | cdk.IResolvable;

  /**
   * The provisioning type used to register the connector.
   */
  public connectorProvisioningType: string;

  /**
   * A description about the connector runtime setting.
   */
  public description?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
    super(scope, id, {
      "type": CfnConnector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectorProvisioningConfig", this);
    cdk.requireProperty(props, "connectorProvisioningType", this);

    this.attrConnectorArn = cdk.Token.asString(this.getAtt("ConnectorArn", cdk.ResolutionTypeHint.STRING));
    this.connectorLabel = props.connectorLabel;
    this.connectorProvisioningConfig = props.connectorProvisioningConfig;
    this.connectorProvisioningType = props.connectorProvisioningType;
    this.description = props.description;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectorLabel": this.connectorLabel,
      "connectorProvisioningConfig": this.connectorProvisioningConfig,
      "connectorProvisioningType": this.connectorProvisioningType,
      "description": this.description
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorPropsToCloudFormation(props);
  }
}

export namespace CfnConnector {
  /**
   * Contains information about the configuration of the connector being registered.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-connectorprovisioningconfig.html
   */
  export interface ConnectorProvisioningConfigProperty {
    /**
     * Contains information about the configuration of the lambda which is being registered as the connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-connectorprovisioningconfig.html#cfn-appflow-connector-connectorprovisioningconfig-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnConnector.LambdaConnectorProvisioningConfigProperty;
  }

  /**
   * Contains information about the configuration of the lambda which is being registered as the connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-lambdaconnectorprovisioningconfig.html
   */
  export interface LambdaConnectorProvisioningConfigProperty {
    /**
     * Lambda ARN of the connector being registered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-lambdaconnectorprovisioningconfig.html#cfn-appflow-connector-lambdaconnectorprovisioningconfig-lambdaarn
     */
    readonly lambdaArn: string;
  }
}

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html
 */
export interface CfnConnectorProps {
  /**
   * The label used for registering the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorlabel
   */
  readonly connectorLabel?: string;

  /**
   * The configuration required for registering the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningconfig
   */
  readonly connectorProvisioningConfig: CfnConnector.ConnectorProvisioningConfigProperty | cdk.IResolvable;

  /**
   * The provisioning type used to register the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningtype
   */
  readonly connectorProvisioningType: string;

  /**
   * A description about the connector runtime setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-description
   */
  readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `LambdaConnectorProvisioningConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaConnectorProvisioningConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorLambdaConnectorProvisioningConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.requiredValidator)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  return errors.wrap("supplied properties not correct for \"LambdaConnectorProvisioningConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorLambdaConnectorProvisioningConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorLambdaConnectorProvisioningConfigPropertyValidator(properties).assertSuccess();
  return {
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn)
  };
}

// @ts-ignore TS6133
function CfnConnectorLambdaConnectorProvisioningConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.LambdaConnectorProvisioningConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.LambdaConnectorProvisioningConfigProperty>();
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorProvisioningConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProvisioningConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorConnectorProvisioningConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambda", CfnConnectorLambdaConnectorProvisioningConfigPropertyValidator)(properties.lambda));
  return errors.wrap("supplied properties not correct for \"ConnectorProvisioningConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorConnectorProvisioningConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorConnectorProvisioningConfigPropertyValidator(properties).assertSuccess();
  return {
    "Lambda": convertCfnConnectorLambdaConnectorProvisioningConfigPropertyToCloudFormation(properties.lambda)
  };
}

// @ts-ignore TS6133
function CfnConnectorConnectorProvisioningConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnector.ConnectorProvisioningConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.ConnectorProvisioningConfigProperty>();
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnConnectorLambdaConnectorProvisioningConfigPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorLabel", cdk.validateString)(properties.connectorLabel));
  errors.collect(cdk.propertyValidator("connectorProvisioningConfig", cdk.requiredValidator)(properties.connectorProvisioningConfig));
  errors.collect(cdk.propertyValidator("connectorProvisioningConfig", CfnConnectorConnectorProvisioningConfigPropertyValidator)(properties.connectorProvisioningConfig));
  errors.collect(cdk.propertyValidator("connectorProvisioningType", cdk.requiredValidator)(properties.connectorProvisioningType));
  errors.collect(cdk.propertyValidator("connectorProvisioningType", cdk.validateString)(properties.connectorProvisioningType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  return errors.wrap("supplied properties not correct for \"CfnConnectorProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorPropsValidator(properties).assertSuccess();
  return {
    "ConnectorLabel": cdk.stringToCloudFormation(properties.connectorLabel),
    "ConnectorProvisioningConfig": convertCfnConnectorConnectorProvisioningConfigPropertyToCloudFormation(properties.connectorProvisioningConfig),
    "ConnectorProvisioningType": cdk.stringToCloudFormation(properties.connectorProvisioningType),
    "Description": cdk.stringToCloudFormation(properties.description)
  };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
  ret.addPropertyResult("connectorLabel", "ConnectorLabel", (properties.ConnectorLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorLabel) : undefined));
  ret.addPropertyResult("connectorProvisioningConfig", "ConnectorProvisioningConfig", (properties.ConnectorProvisioningConfig != null ? CfnConnectorConnectorProvisioningConfigPropertyFromCloudFormation(properties.ConnectorProvisioningConfig) : undefined));
  ret.addPropertyResult("connectorProvisioningType", "ConnectorProvisioningType", (properties.ConnectorProvisioningType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProvisioningType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppFlow::ConnectorProfile` resource is an Amazon AppFlow resource type that specifies the configuration profile for an instance of a connector.
 *
 * This includes the provided name, credentials ARN, connection-mode, and so on. The fields that are common to all types of connector profiles are explicitly specified under the `Properties` field. The rest of the connector-specific properties are specified under `Properties/ConnectorProfileConfig` .
 *
 * > If you want to use AWS CloudFormation to create a connector profile for connectors that implement OAuth (such as Salesforce, Slack, Zendesk, and Google Analytics), you must fetch the access and refresh tokens. You can do this by implementing your own UI for OAuth, or by retrieving the tokens from elsewhere. Alternatively, you can use the Amazon AppFlow console to create the connector profile, and then use that connector profile in the flow creation CloudFormation template.
 *
 * @cloudformationResource AWS::AppFlow::ConnectorProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html
 */
export class CfnConnectorProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppFlow::ConnectorProfile";

  /**
   * Build a CfnConnectorProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectorProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnectorProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the connector profile.
   *
   * @cloudformationAttribute ConnectorProfileArn
   */
  public readonly attrConnectorProfileArn: string;

  /**
   * The Amazon Resource Name (ARN) of the connector profile credentials.
   *
   * @cloudformationAttribute CredentialsArn
   */
  public readonly attrCredentialsArn: string;

  /**
   * Indicates the connection mode and if it is public or private.
   */
  public connectionMode: string;

  /**
   * The label for the connector profile being created.
   */
  public connectorLabel?: string;

  /**
   * Defines the connector-specific configuration and credentials.
   */
  public connectorProfileConfig?: CfnConnectorProfile.ConnectorProfileConfigProperty | cdk.IResolvable;

  /**
   * The name of the connector profile.
   */
  public connectorProfileName: string;

  /**
   * The type of connector, such as Salesforce, Amplitude, and so on.
   */
  public connectorType: string;

  /**
   * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption.
   */
  public kmsArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorProfileProps) {
    super(scope, id, {
      "type": CfnConnectorProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectionMode", this);
    cdk.requireProperty(props, "connectorProfileName", this);
    cdk.requireProperty(props, "connectorType", this);

    this.attrConnectorProfileArn = cdk.Token.asString(this.getAtt("ConnectorProfileArn", cdk.ResolutionTypeHint.STRING));
    this.attrCredentialsArn = cdk.Token.asString(this.getAtt("CredentialsArn", cdk.ResolutionTypeHint.STRING));
    this.connectionMode = props.connectionMode;
    this.connectorLabel = props.connectorLabel;
    this.connectorProfileConfig = props.connectorProfileConfig;
    this.connectorProfileName = props.connectorProfileName;
    this.connectorType = props.connectorType;
    this.kmsArn = props.kmsArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionMode": this.connectionMode,
      "connectorLabel": this.connectorLabel,
      "connectorProfileConfig": this.connectorProfileConfig,
      "connectorProfileName": this.connectorProfileName,
      "connectorType": this.connectorType,
      "kmsArn": this.kmsArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectorProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorProfilePropsToCloudFormation(props);
  }
}

export namespace CfnConnectorProfile {
  /**
   * Defines the connector-specific configuration and credentials for the connector profile.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html
   */
  export interface ConnectorProfileConfigProperty {
    /**
     * The connector-specific credentials required by each connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html#cfn-appflow-connectorprofile-connectorprofileconfig-connectorprofilecredentials
     */
    readonly connectorProfileCredentials?: CfnConnectorProfile.ConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific properties of the profile configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html#cfn-appflow-connectorprofile-connectorprofileconfig-connectorprofileproperties
     */
    readonly connectorProfileProperties?: CfnConnectorProfile.ConnectorProfilePropertiesProperty | cdk.IResolvable;
  }

  /**
   * The connector-specific credentials required by a connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html
   */
  export interface ConnectorProfileCredentialsProperty {
    /**
     * The connector-specific credentials required when using Amplitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-amplitude
     */
    readonly amplitude?: CfnConnectorProfile.AmplitudeConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific profile credentials that are required when using the custom connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-customconnector
     */
    readonly customConnector?: CfnConnectorProfile.CustomConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific credentials required when using Datadog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-datadog
     */
    readonly datadog?: CfnConnectorProfile.DatadogConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific credentials required when using Dynatrace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-dynatrace
     */
    readonly dynatrace?: CfnConnectorProfile.DynatraceConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific credentials required when using Google Analytics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-googleanalytics
     */
    readonly googleAnalytics?: CfnConnectorProfile.GoogleAnalyticsConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific credentials required when using Infor Nexus.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-infornexus
     */
    readonly inforNexus?: CfnConnectorProfile.InforNexusConnectorProfileCredentialsProperty | cdk.IResolvable;

    /**
     * The connector-specific credentials required when using Marketo.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-marketo
     */
    readonly marketo?: cdk.IResolvable | CfnConnectorProfile.MarketoConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Salesforce Pardot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-pardot
     */
    readonly pardot?: cdk.IResolvable | CfnConnectorProfile.PardotConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Amazon Redshift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-redshift
     */
    readonly redshift?: cdk.IResolvable | CfnConnectorProfile.RedshiftConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Salesforce.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-salesforce
     */
    readonly salesforce?: cdk.IResolvable | CfnConnectorProfile.SalesforceConnectorProfileCredentialsProperty;

    /**
     * The connector-specific profile credentials required when using SAPOData.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-sapodata
     */
    readonly sapoData?: cdk.IResolvable | CfnConnectorProfile.SAPODataConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using ServiceNow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-servicenow
     */
    readonly serviceNow?: cdk.IResolvable | CfnConnectorProfile.ServiceNowConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Singular.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-singular
     */
    readonly singular?: cdk.IResolvable | CfnConnectorProfile.SingularConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-slack
     */
    readonly slack?: cdk.IResolvable | CfnConnectorProfile.SlackConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-snowflake
     */
    readonly snowflake?: cdk.IResolvable | CfnConnectorProfile.SnowflakeConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Trend Micro.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-trendmicro
     */
    readonly trendmicro?: cdk.IResolvable | CfnConnectorProfile.TrendmicroConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Veeva.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-veeva
     */
    readonly veeva?: cdk.IResolvable | CfnConnectorProfile.VeevaConnectorProfileCredentialsProperty;

    /**
     * The connector-specific credentials required when using Zendesk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-zendesk
     */
    readonly zendesk?: cdk.IResolvable | CfnConnectorProfile.ZendeskConnectorProfileCredentialsProperty;
  }

  /**
   * The connector-specific credentials required when using Amplitude.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html
   */
  export interface AmplitudeConnectorProfileCredentialsProperty {
    /**
     * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-amplitudeconnectorprofilecredentials-apikey
     */
    readonly apiKey: string;

    /**
     * The Secret Access Key portion of the credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-amplitudeconnectorprofilecredentials-secretkey
     */
    readonly secretKey: string;
  }

  /**
   * The connector-specific profile credentials required by Google Analytics.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html
   */
  export interface GoogleAnalyticsConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Google Analytics resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the desired client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-clientid
     */
    readonly clientId: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-clientsecret
     */
    readonly clientSecret: string;

    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;

    /**
     * The credentials used to acquire new access tokens.
     *
     * This is required only for OAuth2 access tokens, and is not required for OAuth1 access tokens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-refreshtoken
     */
    readonly refreshToken?: string;
  }

  /**
   * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html
   */
  export interface ConnectorOAuthRequestProperty {
    /**
     * The code provided by the connector when it has been authenticated via the connected app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html#cfn-appflow-connectorprofile-connectoroauthrequest-authcode
     */
    readonly authCode?: string;

    /**
     * The URL to which the authentication server redirects the browser after authorization has been granted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html#cfn-appflow-connectorprofile-connectoroauthrequest-redirecturi
     */
    readonly redirectUri?: string;
  }

  /**
   * The connector-specific profile credentials required when using ServiceNow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html
   */
  export interface ServiceNowConnectorProfileCredentialsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html#cfn-appflow-connectorprofile-servicenowconnectorprofilecredentials-oauth2credentials
     */
    readonly oAuth2Credentials?: cdk.IResolvable | CfnConnectorProfile.OAuth2CredentialsProperty;

    /**
     * The password that corresponds to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html#cfn-appflow-connectorprofile-servicenowconnectorprofilecredentials-password
     */
    readonly password?: string;

    /**
     * The name of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html#cfn-appflow-connectorprofile-servicenowconnectorprofilecredentials-username
     */
    readonly username?: string;
  }

  /**
   * The OAuth 2.0 credentials required for OAuth 2.0 authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html
   */
  export interface OAuth2CredentialsProperty {
    /**
     * The access token used to access the connector on your behalf.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the desired client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-clientid
     */
    readonly clientId?: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-clientsecret
     */
    readonly clientSecret?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-oauthrequest
     */
    readonly oAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;

    /**
     * The refresh token used to refresh an expired access token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-refreshtoken
     */
    readonly refreshToken?: string;
  }

  /**
   * The connector-specific profile credentials that are required when using the custom connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html
   */
  export interface CustomConnectorProfileCredentialsProperty {
    /**
     * The API keys required for the authentication of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-apikey
     */
    readonly apiKey?: CfnConnectorProfile.ApiKeyCredentialsProperty | cdk.IResolvable;

    /**
     * The authentication type that the custom connector uses for authenticating while creating a connector profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-authenticationtype
     */
    readonly authenticationType: string;

    /**
     * The basic credentials that are required for the authentication of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-basic
     */
    readonly basic?: CfnConnectorProfile.BasicAuthCredentialsProperty | cdk.IResolvable;

    /**
     * If the connector uses the custom authentication mechanism, this holds the required credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-custom
     */
    readonly custom?: CfnConnectorProfile.CustomAuthCredentialsProperty | cdk.IResolvable;

    /**
     * The OAuth 2.0 credentials required for the authentication of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-oauth2
     */
    readonly oauth2?: cdk.IResolvable | CfnConnectorProfile.OAuth2CredentialsProperty;
  }

  /**
   * The basic auth credentials required for basic authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html
   */
  export interface BasicAuthCredentialsProperty {
    /**
     * The password to use to connect to a resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html#cfn-appflow-connectorprofile-basicauthcredentials-password
     */
    readonly password: string;

    /**
     * The username to use to connect to a resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html#cfn-appflow-connectorprofile-basicauthcredentials-username
     */
    readonly username: string;
  }

  /**
   * The API key credentials required for API key authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html
   */
  export interface ApiKeyCredentialsProperty {
    /**
     * The API key required for API key authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html#cfn-appflow-connectorprofile-apikeycredentials-apikey
     */
    readonly apiKey: string;

    /**
     * The API secret key required for API key authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html#cfn-appflow-connectorprofile-apikeycredentials-apisecretkey
     */
    readonly apiSecretKey?: string;
  }

  /**
   * The custom credentials required for custom authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html
   */
  export interface CustomAuthCredentialsProperty {
    /**
     * A map that holds custom authentication credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html#cfn-appflow-connectorprofile-customauthcredentials-credentialsmap
     */
    readonly credentialsMap?: cdk.IResolvable | Record<string, string>;

    /**
     * The custom authentication type that the connector uses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html#cfn-appflow-connectorprofile-customauthcredentials-customauthenticationtype
     */
    readonly customAuthenticationType: string;
  }

  /**
   * The connector-specific profile credentials required when using SAPOData.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html
   */
  export interface SAPODataConnectorProfileCredentialsProperty {
    /**
     * The SAPOData basic authentication credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html#cfn-appflow-connectorprofile-sapodataconnectorprofilecredentials-basicauthcredentials
     */
    readonly basicAuthCredentials?: CfnConnectorProfile.BasicAuthCredentialsProperty | cdk.IResolvable;

    /**
     * The SAPOData OAuth type authentication credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html#cfn-appflow-connectorprofile-sapodataconnectorprofilecredentials-oauthcredentials
     */
    readonly oAuthCredentials?: cdk.IResolvable | CfnConnectorProfile.OAuthCredentialsProperty;
  }

  /**
   * The OAuth credentials required for OAuth type authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html
   */
  export interface OAuthCredentialsProperty {
    /**
     * The access token used to access protected SAPOData resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the desired client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-clientid
     */
    readonly clientId?: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-clientsecret
     */
    readonly clientSecret?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;

    /**
     * The refresh token used to refresh expired access token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-refreshtoken
     */
    readonly refreshToken?: string;
  }

  /**
   * The connector-specific profile credentials required when using Salesforce Pardot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofilecredentials.html
   */
  export interface PardotConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Salesforce Pardot resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofilecredentials.html#cfn-appflow-connectorprofile-pardotconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The secret manager ARN, which contains the client ID and client secret of the connected app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofilecredentials.html#cfn-appflow-connectorprofile-pardotconnectorprofilecredentials-clientcredentialsarn
     */
    readonly clientCredentialsArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofilecredentials.html#cfn-appflow-connectorprofile-pardotconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;

    /**
     * The credentials used to acquire new access tokens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofilecredentials.html#cfn-appflow-connectorprofile-pardotconnectorprofilecredentials-refreshtoken
     */
    readonly refreshToken?: string;
  }

  /**
   * The connector-specific profile credentials required when using Veeva.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html
   */
  export interface VeevaConnectorProfileCredentialsProperty {
    /**
     * The password that corresponds to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html#cfn-appflow-connectorprofile-veevaconnectorprofilecredentials-password
     */
    readonly password: string;

    /**
     * The name of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html#cfn-appflow-connectorprofile-veevaconnectorprofilecredentials-username
     */
    readonly username: string;
  }

  /**
   * The connector-specific profile credentials required when using Trend Micro.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-trendmicroconnectorprofilecredentials.html
   */
  export interface TrendmicroConnectorProfileCredentialsProperty {
    /**
     * The Secret Access Key portion of the credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-trendmicroconnectorprofilecredentials.html#cfn-appflow-connectorprofile-trendmicroconnectorprofilecredentials-apisecretkey
     */
    readonly apiSecretKey: string;
  }

  /**
   * The connector-specific credentials required by Datadog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html
   */
  export interface DatadogConnectorProfileCredentialsProperty {
    /**
     * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html#cfn-appflow-connectorprofile-datadogconnectorprofilecredentials-apikey
     */
    readonly apiKey: string;

    /**
     * Application keys, in conjunction with your API key, give you full access to Datadog’s programmatic API.
     *
     * Application keys are associated with the user account that created them. The application key is used to log all requests made to the API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html#cfn-appflow-connectorprofile-datadogconnectorprofilecredentials-applicationkey
     */
    readonly applicationKey: string;
  }

  /**
   * The connector-specific profile credentials required by Marketo.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html
   */
  export interface MarketoConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Marketo resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the desired client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-clientid
     */
    readonly clientId: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-clientsecret
     */
    readonly clientSecret: string;

    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
  }

  /**
   * The connector-specific profile credentials required when using Amazon Redshift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html
   */
  export interface RedshiftConnectorProfileCredentialsProperty {
    /**
     * The password that corresponds to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html#cfn-appflow-connectorprofile-redshiftconnectorprofilecredentials-password
     */
    readonly password?: string;

    /**
     * The name of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html#cfn-appflow-connectorprofile-redshiftconnectorprofilecredentials-username
     */
    readonly username?: string;
  }

  /**
   * The connector-specific profile credentials required when using Singular.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-singularconnectorprofilecredentials.html
   */
  export interface SingularConnectorProfileCredentialsProperty {
    /**
     * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-singularconnectorprofilecredentials.html#cfn-appflow-connectorprofile-singularconnectorprofilecredentials-apikey
     */
    readonly apiKey: string;
  }

  /**
   * The connector-specific profile credentials required when using Slack.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html
   */
  export interface SlackConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Slack resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-clientid
     */
    readonly clientId: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-clientsecret
     */
    readonly clientSecret: string;

    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
  }

  /**
   * The connector-specific profile credentials required when using Snowflake.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html
   */
  export interface SnowflakeConnectorProfileCredentialsProperty {
    /**
     * The password that corresponds to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-snowflakeconnectorprofilecredentials-password
     */
    readonly password: string;

    /**
     * The name of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-snowflakeconnectorprofilecredentials-username
     */
    readonly username: string;
  }

  /**
   * The connector-specific profile credentials required by Dynatrace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofilecredentials.html
   */
  export interface DynatraceConnectorProfileCredentialsProperty {
    /**
     * The API tokens used by Dynatrace API to authenticate various API calls.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-dynatraceconnectorprofilecredentials-apitoken
     */
    readonly apiToken: string;
  }

  /**
   * The connector-specific profile credentials required when using Zendesk.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html
   */
  export interface ZendeskConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Zendesk resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The identifier for the desired client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-clientid
     */
    readonly clientId: string;

    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-clientsecret
     */
    readonly clientSecret: string;

    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
  }

  /**
   * The connector-specific profile credentials required by Infor Nexus.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html
   */
  export interface InforNexusConnectorProfileCredentialsProperty {
    /**
     * The Access Key portion of the credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-accesskeyid
     */
    readonly accessKeyId: string;

    /**
     * The encryption keys used to encrypt data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-datakey
     */
    readonly datakey: string;

    /**
     * The secret key used to sign requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-secretaccesskey
     */
    readonly secretAccessKey: string;

    /**
     * The identifier for the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-userid
     */
    readonly userId: string;
  }

  /**
   * The connector-specific profile credentials required when using Salesforce.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html
   */
  export interface SalesforceConnectorProfileCredentialsProperty {
    /**
     * The credentials used to access protected Salesforce resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-accesstoken
     */
    readonly accessToken?: string;

    /**
     * The secret manager ARN, which contains the client ID and client secret of the connected app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-clientcredentialsarn
     */
    readonly clientCredentialsArn?: string;

    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-connectoroauthrequest
     */
    readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;

    /**
     * A JSON web token (JWT) that authorizes Amazon AppFlow to access your Salesforce records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-jwttoken
     */
    readonly jwtToken?: string;

    /**
     * Specifies the OAuth 2.0 grant type that Amazon AppFlow uses when it requests an access token from Salesforce. Amazon AppFlow requires an access token each time it attempts to access your Salesforce records.
     *
     * You can specify one of the following values:
     *
     * - **AUTHORIZATION_CODE** - Amazon AppFlow passes an authorization code when it requests the access token from Salesforce. Amazon AppFlow receives the authorization code from Salesforce after you log in to your Salesforce account and authorize Amazon AppFlow to access your records.
     * - **CLIENT_CREDENTIALS** - Amazon AppFlow passes client credentials (a client ID and client secret) when it requests the access token from Salesforce. You provide these credentials to Amazon AppFlow when you define the connection to your Salesforce account.
     * - **JWT_BEARER** - Amazon AppFlow passes a JSON web token (JWT) when it requests the access token from Salesforce. You provide the JWT to Amazon AppFlow when you define the connection to your Salesforce account. When you use this grant type, you don't need to log in to your Salesforce account to authorize Amazon AppFlow to access your records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-oauth2granttype
     */
    readonly oAuth2GrantType?: string;

    /**
     * The credentials used to acquire new access tokens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-refreshtoken
     */
    readonly refreshToken?: string;
  }

  /**
   * The connector-specific profile properties required by each connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html
   */
  export interface ConnectorProfilePropertiesProperty {
    /**
     * The properties required by the custom connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-customconnector
     */
    readonly customConnector?: CfnConnectorProfile.CustomConnectorProfilePropertiesProperty | cdk.IResolvable;

    /**
     * The connector-specific properties required by Datadog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-datadog
     */
    readonly datadog?: CfnConnectorProfile.DatadogConnectorProfilePropertiesProperty | cdk.IResolvable;

    /**
     * The connector-specific properties required by Dynatrace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-dynatrace
     */
    readonly dynatrace?: CfnConnectorProfile.DynatraceConnectorProfilePropertiesProperty | cdk.IResolvable;

    /**
     * The connector-specific properties required by Infor Nexus.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-infornexus
     */
    readonly inforNexus?: CfnConnectorProfile.InforNexusConnectorProfilePropertiesProperty | cdk.IResolvable;

    /**
     * The connector-specific properties required by Marketo.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-marketo
     */
    readonly marketo?: cdk.IResolvable | CfnConnectorProfile.MarketoConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Salesforce Pardot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-pardot
     */
    readonly pardot?: cdk.IResolvable | CfnConnectorProfile.PardotConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Amazon Redshift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-redshift
     */
    readonly redshift?: cdk.IResolvable | CfnConnectorProfile.RedshiftConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Salesforce.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-salesforce
     */
    readonly salesforce?: cdk.IResolvable | CfnConnectorProfile.SalesforceConnectorProfilePropertiesProperty;

    /**
     * The connector-specific profile properties required when using SAPOData.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-sapodata
     */
    readonly sapoData?: cdk.IResolvable | CfnConnectorProfile.SAPODataConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by serviceNow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-servicenow
     */
    readonly serviceNow?: cdk.IResolvable | CfnConnectorProfile.ServiceNowConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-slack
     */
    readonly slack?: cdk.IResolvable | CfnConnectorProfile.SlackConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-snowflake
     */
    readonly snowflake?: cdk.IResolvable | CfnConnectorProfile.SnowflakeConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Veeva.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-veeva
     */
    readonly veeva?: cdk.IResolvable | CfnConnectorProfile.VeevaConnectorProfilePropertiesProperty;

    /**
     * The connector-specific properties required by Zendesk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-zendesk
     */
    readonly zendesk?: cdk.IResolvable | CfnConnectorProfile.ZendeskConnectorProfilePropertiesProperty;
  }

  /**
   * The connector-specific profile properties required when using ServiceNow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofileproperties.html
   */
  export interface ServiceNowConnectorProfilePropertiesProperty {
    /**
     * The location of the ServiceNow resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofileproperties.html#cfn-appflow-connectorprofile-servicenowconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The profile properties required by the custom connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html
   */
  export interface CustomConnectorProfilePropertiesProperty {
    /**
     * The OAuth 2.0 properties required for OAuth 2.0 authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html#cfn-appflow-connectorprofile-customconnectorprofileproperties-oauth2properties
     */
    readonly oAuth2Properties?: cdk.IResolvable | CfnConnectorProfile.OAuth2PropertiesProperty;

    /**
     * A map of properties that are required to create a profile for the custom connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html#cfn-appflow-connectorprofile-customconnectorprofileproperties-profileproperties
     */
    readonly profileProperties?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The OAuth 2.0 properties required for OAuth 2.0 authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html
   */
  export interface OAuth2PropertiesProperty {
    /**
     * The OAuth 2.0 grant type used by connector for OAuth 2.0 authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-oauth2granttype
     */
    readonly oAuth2GrantType?: string;

    /**
     * The token URL required for OAuth 2.0 authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-tokenurl
     */
    readonly tokenUrl?: string;

    /**
     * Associates your token URL with a map of properties that you define.
     *
     * Use this parameter to provide any additional details that the connector requires to authenticate your request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-tokenurlcustomproperties
     */
    readonly tokenUrlCustomProperties?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The connector-specific profile properties required when using SAPOData.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html
   */
  export interface SAPODataConnectorProfilePropertiesProperty {
    /**
     * The location of the SAPOData resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-applicationhosturl
     */
    readonly applicationHostUrl?: string;

    /**
     * The application path to catalog service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-applicationservicepath
     */
    readonly applicationServicePath?: string;

    /**
     * The client number for the client creating the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-clientnumber
     */
    readonly clientNumber?: string;

    /**
     * If you set this parameter to true, Amazon AppFlow bypasses the single sign-on (SSO) settings in your SAP account when it accesses your SAP OData instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-disablesso
     */
    readonly disableSso?: boolean | cdk.IResolvable;

    /**
     * The logon language of SAPOData instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-logonlanguage
     */
    readonly logonLanguage?: string;

    /**
     * The SAPOData OAuth properties required for OAuth type authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-oauthproperties
     */
    readonly oAuthProperties?: cdk.IResolvable | CfnConnectorProfile.OAuthPropertiesProperty;

    /**
     * The port number of the SAPOData instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-portnumber
     */
    readonly portNumber?: number;

    /**
     * The SAPOData Private Link service name to be used for private data transfers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-privatelinkservicename
     */
    readonly privateLinkServiceName?: string;
  }

  /**
   * The OAuth properties required for OAuth type authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html
   */
  export interface OAuthPropertiesProperty {
    /**
     * The authorization code url required to redirect to SAP Login Page to fetch authorization code for OAuth type authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-authcodeurl
     */
    readonly authCodeUrl?: string;

    /**
     * The OAuth scopes required for OAuth type authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-oauthscopes
     */
    readonly oAuthScopes?: Array<string>;

    /**
     * The token url required to fetch access/refresh tokens using authorization code and also to refresh expired access token using refresh token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-tokenurl
     */
    readonly tokenUrl?: string;
  }

  /**
   * The connector-specific profile properties required when using Salesforce Pardot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofileproperties.html
   */
  export interface PardotConnectorProfilePropertiesProperty {
    /**
     * The business unit id of Salesforce Pardot instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofileproperties.html#cfn-appflow-connectorprofile-pardotconnectorprofileproperties-businessunitid
     */
    readonly businessUnitId: string;

    /**
     * The location of the Salesforce Pardot resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofileproperties.html#cfn-appflow-connectorprofile-pardotconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl?: string;

    /**
     * Indicates whether the connector profile applies to a sandbox or production environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-pardotconnectorprofileproperties.html#cfn-appflow-connectorprofile-pardotconnectorprofileproperties-issandboxenvironment
     */
    readonly isSandboxEnvironment?: boolean | cdk.IResolvable;
  }

  /**
   * The connector-specific profile properties required when using Veeva.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofileproperties.html
   */
  export interface VeevaConnectorProfilePropertiesProperty {
    /**
     * The location of the Veeva resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofileproperties.html#cfn-appflow-connectorprofile-veevaconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required by Datadog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofileproperties.html
   */
  export interface DatadogConnectorProfilePropertiesProperty {
    /**
     * The location of the Datadog resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofileproperties.html#cfn-appflow-connectorprofile-datadogconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required when using Marketo.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofileproperties.html
   */
  export interface MarketoConnectorProfilePropertiesProperty {
    /**
     * The location of the Marketo resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofileproperties.html#cfn-appflow-connectorprofile-marketoconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties when using Amazon Redshift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html
   */
  export interface RedshiftConnectorProfilePropertiesProperty {
    /**
     * A name for the associated Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The object key for the destination bucket in which Amazon AppFlow places the files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The unique ID that's assigned to an Amazon Redshift cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-clusteridentifier
     */
    readonly clusterIdentifier?: string;

    /**
     * The Amazon Resource Name (ARN) of an IAM role that permits Amazon AppFlow to access your Amazon Redshift database through the Data API.
     *
     * For more information, and for the polices that you attach to this role, see [Allow Amazon AppFlow to access Amazon Redshift databases with the Data API](https://docs.aws.amazon.com/appflow/latest/userguide/security_iam_service-role-policies.html#access-redshift) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-dataapirolearn
     */
    readonly dataApiRoleArn?: string;

    /**
     * The name of an Amazon Redshift database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-databasename
     */
    readonly databaseName?: string;

    /**
     * The JDBC URL of the Amazon Redshift cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-databaseurl
     */
    readonly databaseUrl?: string;

    /**
     * Indicates whether the connector profile defines a connection to an Amazon Redshift Serverless data warehouse.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-isredshiftserverless
     */
    readonly isRedshiftServerless?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of IAM role that grants Amazon Redshift read-only access to Amazon S3.
     *
     * For more information, and for the polices that you attach to this role, see [Allow Amazon Redshift to access your Amazon AppFlow data in Amazon S3](https://docs.aws.amazon.com/appflow/latest/userguide/security_iam_service-role-policies.html#redshift-access-s3) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of an Amazon Redshift workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-workgroupname
     */
    readonly workgroupName?: string;
  }

  /**
   * The connector-specific profile properties required when using Slack.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofileproperties.html
   */
  export interface SlackConnectorProfilePropertiesProperty {
    /**
     * The location of the Slack resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofileproperties.html#cfn-appflow-connectorprofile-slackconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required when using Snowflake.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html
   */
  export interface SnowflakeConnectorProfilePropertiesProperty {
    /**
     * The name of the account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-accountname
     */
    readonly accountName?: string;

    /**
     * The name of the Amazon S3 bucket associated with Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The bucket path that refers to the Amazon S3 bucket associated with Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The Snowflake Private Link service name to be used for private data transfers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-privatelinkservicename
     */
    readonly privateLinkServiceName?: string;

    /**
     * The AWS Region of the Snowflake account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-region
     */
    readonly region?: string;

    /**
     * The name of the Amazon S3 stage that was created while setting up an Amazon S3 stage in the Snowflake account.
     *
     * This is written in the following format: < Database>< Schema><Stage Name>.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-stage
     */
    readonly stage: string;

    /**
     * The name of the Snowflake warehouse.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-warehouse
     */
    readonly warehouse: string;
  }

  /**
   * The connector-specific profile properties required by Dynatrace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofileproperties.html
   */
  export interface DynatraceConnectorProfilePropertiesProperty {
    /**
     * The location of the Dynatrace resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofileproperties.html#cfn-appflow-connectorprofile-dynatraceconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required when using Zendesk.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofileproperties.html
   */
  export interface ZendeskConnectorProfilePropertiesProperty {
    /**
     * The location of the Zendesk resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofileproperties.html#cfn-appflow-connectorprofile-zendeskconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required by Infor Nexus.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofileproperties.html
   */
  export interface InforNexusConnectorProfilePropertiesProperty {
    /**
     * The location of the Infor Nexus resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofileproperties.html#cfn-appflow-connectorprofile-infornexusconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl: string;
  }

  /**
   * The connector-specific profile properties required when using Salesforce.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html
   */
  export interface SalesforceConnectorProfilePropertiesProperty {
    /**
     * The location of the Salesforce resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html#cfn-appflow-connectorprofile-salesforceconnectorprofileproperties-instanceurl
     */
    readonly instanceUrl?: string;

    /**
     * Indicates whether the connector profile applies to a sandbox or production environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html#cfn-appflow-connectorprofile-salesforceconnectorprofileproperties-issandboxenvironment
     */
    readonly isSandboxEnvironment?: boolean | cdk.IResolvable;

    /**
     * If the connection mode for the connector profile is private, this parameter sets whether Amazon AppFlow uses the private network to send metadata and authorization calls to Salesforce.
     *
     * Amazon AppFlow sends private calls through AWS PrivateLink . These calls travel through AWS infrastructure without being exposed to the public internet.
     *
     * Set either of the following values:
     *
     * - **true** - Amazon AppFlow sends all calls to Salesforce over the private network.
     *
     * These private calls are:
     *
     * - Calls to get metadata about your Salesforce records. This metadata describes your Salesforce objects and their fields.
     * - Calls to get or refresh access tokens that allow Amazon AppFlow to access your Salesforce records.
     * - Calls to transfer your Salesforce records as part of a flow run.
     * - **false** - The default value. Amazon AppFlow sends some calls to Salesforce privately and other calls over the public internet.
     *
     * The public calls are:
     *
     * - Calls to get metadata about your Salesforce records.
     * - Calls to get or refresh access tokens.
     *
     * The private calls are:
     *
     * - Calls to transfer your Salesforce records as part of a flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html#cfn-appflow-connectorprofile-salesforceconnectorprofileproperties-useprivatelinkformetadataandauthorization
     */
    readonly usePrivateLinkForMetadataAndAuthorization?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnConnectorProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html
 */
export interface CfnConnectorProfileProps {
  /**
   * Indicates the connection mode and if it is public or private.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectionmode
   */
  readonly connectionMode: string;

  /**
   * The label for the connector profile being created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorlabel
   */
  readonly connectorLabel?: string;

  /**
   * Defines the connector-specific configuration and credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofileconfig
   */
  readonly connectorProfileConfig?: CfnConnectorProfile.ConnectorProfileConfigProperty | cdk.IResolvable;

  /**
   * The name of the connector profile.
   *
   * The name is unique for each `ConnectorProfile` in the AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofilename
   */
  readonly connectorProfileName: string;

  /**
   * The type of connector, such as Salesforce, Amplitude, and so on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectortype
   */
  readonly connectorType: string;

  /**
   * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption.
   *
   * This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-kmsarn
   */
  readonly kmsArn?: string;
}

/**
 * Determine whether the given properties match those of a `AmplitudeConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `AmplitudeConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.requiredValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  errors.collect(cdk.propertyValidator("secretKey", cdk.requiredValidator)(properties.secretKey));
  errors.collect(cdk.propertyValidator("secretKey", cdk.validateString)(properties.secretKey));
  return errors.wrap("supplied properties not correct for \"AmplitudeConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey),
    "SecretKey": cdk.stringToCloudFormation(properties.secretKey)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.AmplitudeConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.AmplitudeConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addPropertyResult("secretKey", "SecretKey", (properties.SecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorOAuthRequestProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorOAuthRequestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileConnectorOAuthRequestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authCode", cdk.validateString)(properties.authCode));
  errors.collect(cdk.propertyValidator("redirectUri", cdk.validateString)(properties.redirectUri));
  return errors.wrap("supplied properties not correct for \"ConnectorOAuthRequestProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileConnectorOAuthRequestPropertyValidator(properties).assertSuccess();
  return {
    "AuthCode": cdk.stringToCloudFormation(properties.authCode),
    "RedirectUri": cdk.stringToCloudFormation(properties.redirectUri)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ConnectorOAuthRequestProperty>();
  ret.addPropertyResult("authCode", "AuthCode", (properties.AuthCode != null ? cfn_parse.FromCloudFormation.getString(properties.AuthCode) : undefined));
  ret.addPropertyResult("redirectUri", "RedirectUri", (properties.RedirectUri != null ? cfn_parse.FromCloudFormation.getString(properties.RedirectUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GoogleAnalyticsConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `GoogleAnalyticsConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"GoogleAnalyticsConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.GoogleAnalyticsConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.GoogleAnalyticsConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OAuth2CredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `OAuth2CredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileOAuth2CredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("oAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.oAuthRequest));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"OAuth2CredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileOAuth2CredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileOAuth2CredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "OAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.oAuthRequest),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileOAuth2CredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.OAuth2CredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.OAuth2CredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("oAuthRequest", "OAuthRequest", (properties.OAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.OAuthRequest) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oAuth2Credentials", CfnConnectorProfileOAuth2CredentialsPropertyValidator)(properties.oAuth2Credentials));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"ServiceNowConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "OAuth2Credentials": convertCfnConnectorProfileOAuth2CredentialsPropertyToCloudFormation(properties.oAuth2Credentials),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.ServiceNowConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ServiceNowConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("oAuth2Credentials", "OAuth2Credentials", (properties.OAuth2Credentials != null ? CfnConnectorProfileOAuth2CredentialsPropertyFromCloudFormation(properties.OAuth2Credentials) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BasicAuthCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `BasicAuthCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileBasicAuthCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"BasicAuthCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileBasicAuthCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileBasicAuthCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileBasicAuthCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.BasicAuthCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.BasicAuthCredentialsProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApiKeyCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ApiKeyCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileApiKeyCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.requiredValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiSecretKey", cdk.validateString)(properties.apiSecretKey));
  return errors.wrap("supplied properties not correct for \"ApiKeyCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileApiKeyCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileApiKeyCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey),
    "ApiSecretKey": cdk.stringToCloudFormation(properties.apiSecretKey)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileApiKeyCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.ApiKeyCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ApiKeyCredentialsProperty>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addPropertyResult("apiSecretKey", "ApiSecretKey", (properties.ApiSecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiSecretKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomAuthCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomAuthCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileCustomAuthCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentialsMap", cdk.hashValidator(cdk.validateString))(properties.credentialsMap));
  errors.collect(cdk.propertyValidator("customAuthenticationType", cdk.requiredValidator)(properties.customAuthenticationType));
  errors.collect(cdk.propertyValidator("customAuthenticationType", cdk.validateString)(properties.customAuthenticationType));
  return errors.wrap("supplied properties not correct for \"CustomAuthCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileCustomAuthCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileCustomAuthCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "CredentialsMap": cdk.hashMapper(cdk.stringToCloudFormation)(properties.credentialsMap),
    "CustomAuthenticationType": cdk.stringToCloudFormation(properties.customAuthenticationType)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileCustomAuthCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.CustomAuthCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.CustomAuthCredentialsProperty>();
  ret.addPropertyResult("credentialsMap", "CredentialsMap", (properties.CredentialsMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.CredentialsMap) : undefined));
  ret.addPropertyResult("customAuthenticationType", "CustomAuthenticationType", (properties.CustomAuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.CustomAuthenticationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileCustomConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", CfnConnectorProfileApiKeyCredentialsPropertyValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("basic", CfnConnectorProfileBasicAuthCredentialsPropertyValidator)(properties.basic));
  errors.collect(cdk.propertyValidator("custom", CfnConnectorProfileCustomAuthCredentialsPropertyValidator)(properties.custom));
  errors.collect(cdk.propertyValidator("oauth2", CfnConnectorProfileOAuth2CredentialsPropertyValidator)(properties.oauth2));
  return errors.wrap("supplied properties not correct for \"CustomConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileCustomConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileCustomConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiKey": convertCfnConnectorProfileApiKeyCredentialsPropertyToCloudFormation(properties.apiKey),
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "Basic": convertCfnConnectorProfileBasicAuthCredentialsPropertyToCloudFormation(properties.basic),
    "Custom": convertCfnConnectorProfileCustomAuthCredentialsPropertyToCloudFormation(properties.custom),
    "Oauth2": convertCfnConnectorProfileOAuth2CredentialsPropertyToCloudFormation(properties.oauth2)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileCustomConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.CustomConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.CustomConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? CfnConnectorProfileApiKeyCredentialsPropertyFromCloudFormation(properties.ApiKey) : undefined));
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("basic", "Basic", (properties.Basic != null ? CfnConnectorProfileBasicAuthCredentialsPropertyFromCloudFormation(properties.Basic) : undefined));
  ret.addPropertyResult("custom", "Custom", (properties.Custom != null ? CfnConnectorProfileCustomAuthCredentialsPropertyFromCloudFormation(properties.Custom) : undefined));
  ret.addPropertyResult("oauth2", "Oauth2", (properties.Oauth2 != null ? CfnConnectorProfileOAuth2CredentialsPropertyFromCloudFormation(properties.Oauth2) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OAuthCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `OAuthCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileOAuthCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"OAuthCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileOAuthCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileOAuthCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileOAuthCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.OAuthCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.OAuthCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basicAuthCredentials", CfnConnectorProfileBasicAuthCredentialsPropertyValidator)(properties.basicAuthCredentials));
  errors.collect(cdk.propertyValidator("oAuthCredentials", CfnConnectorProfileOAuthCredentialsPropertyValidator)(properties.oAuthCredentials));
  return errors.wrap("supplied properties not correct for \"SAPODataConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "BasicAuthCredentials": convertCfnConnectorProfileBasicAuthCredentialsPropertyToCloudFormation(properties.basicAuthCredentials),
    "OAuthCredentials": convertCfnConnectorProfileOAuthCredentialsPropertyToCloudFormation(properties.oAuthCredentials)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SAPODataConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SAPODataConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("basicAuthCredentials", "BasicAuthCredentials", (properties.BasicAuthCredentials != null ? CfnConnectorProfileBasicAuthCredentialsPropertyFromCloudFormation(properties.BasicAuthCredentials) : undefined));
  ret.addPropertyResult("oAuthCredentials", "OAuthCredentials", (properties.OAuthCredentials != null ? CfnConnectorProfileOAuthCredentialsPropertyFromCloudFormation(properties.OAuthCredentials) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PardotConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `PardotConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfilePardotConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientCredentialsArn", cdk.validateString)(properties.clientCredentialsArn));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"PardotConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfilePardotConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfilePardotConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientCredentialsArn": cdk.stringToCloudFormation(properties.clientCredentialsArn),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfilePardotConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.PardotConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.PardotConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientCredentialsArn", "ClientCredentialsArn", (properties.ClientCredentialsArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCredentialsArn) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VeevaConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `VeevaConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileVeevaConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"VeevaConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileVeevaConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileVeevaConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileVeevaConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.VeevaConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.VeevaConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrendmicroConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `TrendmicroConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiSecretKey", cdk.requiredValidator)(properties.apiSecretKey));
  errors.collect(cdk.propertyValidator("apiSecretKey", cdk.validateString)(properties.apiSecretKey));
  return errors.wrap("supplied properties not correct for \"TrendmicroConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiSecretKey": cdk.stringToCloudFormation(properties.apiSecretKey)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.TrendmicroConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.TrendmicroConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiSecretKey", "ApiSecretKey", (properties.ApiSecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiSecretKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatadogConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `DatadogConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileDatadogConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.requiredValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  errors.collect(cdk.propertyValidator("applicationKey", cdk.requiredValidator)(properties.applicationKey));
  errors.collect(cdk.propertyValidator("applicationKey", cdk.validateString)(properties.applicationKey));
  return errors.wrap("supplied properties not correct for \"DatadogConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileDatadogConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileDatadogConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey),
    "ApplicationKey": cdk.stringToCloudFormation(properties.applicationKey)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileDatadogConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.DatadogConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.DatadogConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addPropertyResult("applicationKey", "ApplicationKey", (properties.ApplicationKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MarketoConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileMarketoConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  return errors.wrap("supplied properties not correct for \"MarketoConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileMarketoConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileMarketoConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileMarketoConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.MarketoConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.MarketoConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"RedshiftConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.RedshiftConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.RedshiftConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingularConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SingularConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSingularConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKey", cdk.requiredValidator)(properties.apiKey));
  errors.collect(cdk.propertyValidator("apiKey", cdk.validateString)(properties.apiKey));
  return errors.wrap("supplied properties not correct for \"SingularConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSingularConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSingularConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiKey": cdk.stringToCloudFormation(properties.apiKey)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSingularConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SingularConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SingularConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiKey", "ApiKey", (properties.ApiKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlackConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SlackConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSlackConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  return errors.wrap("supplied properties not correct for \"SlackConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSlackConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSlackConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSlackConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SlackConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SlackConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnowflakeConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SnowflakeConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"SnowflakeConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SnowflakeConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SnowflakeConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynatraceConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `DynatraceConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiToken", cdk.requiredValidator)(properties.apiToken));
  errors.collect(cdk.propertyValidator("apiToken", cdk.validateString)(properties.apiToken));
  return errors.wrap("supplied properties not correct for \"DynatraceConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "ApiToken": cdk.stringToCloudFormation(properties.apiToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.DynatraceConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.DynatraceConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("apiToken", "ApiToken", (properties.ApiToken != null ? cfn_parse.FromCloudFormation.getString(properties.ApiToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZendeskConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileZendeskConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  return errors.wrap("supplied properties not correct for \"ZendeskConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileZendeskConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileZendeskConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileZendeskConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.ZendeskConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ZendeskConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InforNexusConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `InforNexusConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessKeyId", cdk.requiredValidator)(properties.accessKeyId));
  errors.collect(cdk.propertyValidator("accessKeyId", cdk.validateString)(properties.accessKeyId));
  errors.collect(cdk.propertyValidator("datakey", cdk.requiredValidator)(properties.datakey));
  errors.collect(cdk.propertyValidator("datakey", cdk.validateString)(properties.datakey));
  errors.collect(cdk.propertyValidator("secretAccessKey", cdk.requiredValidator)(properties.secretAccessKey));
  errors.collect(cdk.propertyValidator("secretAccessKey", cdk.validateString)(properties.secretAccessKey));
  errors.collect(cdk.propertyValidator("userId", cdk.requiredValidator)(properties.userId));
  errors.collect(cdk.propertyValidator("userId", cdk.validateString)(properties.userId));
  return errors.wrap("supplied properties not correct for \"InforNexusConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessKeyId": cdk.stringToCloudFormation(properties.accessKeyId),
    "Datakey": cdk.stringToCloudFormation(properties.datakey),
    "SecretAccessKey": cdk.stringToCloudFormation(properties.secretAccessKey),
    "UserId": cdk.stringToCloudFormation(properties.userId)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.InforNexusConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.InforNexusConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessKeyId", "AccessKeyId", (properties.AccessKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.AccessKeyId) : undefined));
  ret.addPropertyResult("datakey", "Datakey", (properties.Datakey != null ? cfn_parse.FromCloudFormation.getString(properties.Datakey) : undefined));
  ret.addPropertyResult("secretAccessKey", "SecretAccessKey", (properties.SecretAccessKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretAccessKey) : undefined));
  ret.addPropertyResult("userId", "UserId", (properties.UserId != null ? cfn_parse.FromCloudFormation.getString(properties.UserId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("clientCredentialsArn", cdk.validateString)(properties.clientCredentialsArn));
  errors.collect(cdk.propertyValidator("connectorOAuthRequest", CfnConnectorProfileConnectorOAuthRequestPropertyValidator)(properties.connectorOAuthRequest));
  errors.collect(cdk.propertyValidator("jwtToken", cdk.validateString)(properties.jwtToken));
  errors.collect(cdk.propertyValidator("oAuth2GrantType", cdk.validateString)(properties.oAuth2GrantType));
  errors.collect(cdk.propertyValidator("refreshToken", cdk.validateString)(properties.refreshToken));
  return errors.wrap("supplied properties not correct for \"SalesforceConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "ClientCredentialsArn": cdk.stringToCloudFormation(properties.clientCredentialsArn),
    "ConnectorOAuthRequest": convertCfnConnectorProfileConnectorOAuthRequestPropertyToCloudFormation(properties.connectorOAuthRequest),
    "JwtToken": cdk.stringToCloudFormation(properties.jwtToken),
    "OAuth2GrantType": cdk.stringToCloudFormation(properties.oAuth2GrantType),
    "RefreshToken": cdk.stringToCloudFormation(properties.refreshToken)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SalesforceConnectorProfileCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SalesforceConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("clientCredentialsArn", "ClientCredentialsArn", (properties.ClientCredentialsArn != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCredentialsArn) : undefined));
  ret.addPropertyResult("connectorOAuthRequest", "ConnectorOAuthRequest", (properties.ConnectorOAuthRequest != null ? CfnConnectorProfileConnectorOAuthRequestPropertyFromCloudFormation(properties.ConnectorOAuthRequest) : undefined));
  ret.addPropertyResult("jwtToken", "JwtToken", (properties.JwtToken != null ? cfn_parse.FromCloudFormation.getString(properties.JwtToken) : undefined));
  ret.addPropertyResult("oAuth2GrantType", "OAuth2GrantType", (properties.OAuth2GrantType != null ? cfn_parse.FromCloudFormation.getString(properties.OAuth2GrantType) : undefined));
  ret.addPropertyResult("refreshToken", "RefreshToken", (properties.RefreshToken != null ? cfn_parse.FromCloudFormation.getString(properties.RefreshToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorProfileCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProfileCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfileCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amplitude", CfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyValidator)(properties.amplitude));
  errors.collect(cdk.propertyValidator("customConnector", CfnConnectorProfileCustomConnectorProfileCredentialsPropertyValidator)(properties.customConnector));
  errors.collect(cdk.propertyValidator("datadog", CfnConnectorProfileDatadogConnectorProfileCredentialsPropertyValidator)(properties.datadog));
  errors.collect(cdk.propertyValidator("dynatrace", CfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyValidator)(properties.dynatrace));
  errors.collect(cdk.propertyValidator("googleAnalytics", CfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyValidator)(properties.googleAnalytics));
  errors.collect(cdk.propertyValidator("inforNexus", CfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyValidator)(properties.inforNexus));
  errors.collect(cdk.propertyValidator("marketo", CfnConnectorProfileMarketoConnectorProfileCredentialsPropertyValidator)(properties.marketo));
  errors.collect(cdk.propertyValidator("pardot", CfnConnectorProfilePardotConnectorProfileCredentialsPropertyValidator)(properties.pardot));
  errors.collect(cdk.propertyValidator("redshift", CfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyValidator)(properties.redshift));
  errors.collect(cdk.propertyValidator("sapoData", CfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyValidator)(properties.sapoData));
  errors.collect(cdk.propertyValidator("salesforce", CfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyValidator)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", CfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyValidator)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("singular", CfnConnectorProfileSingularConnectorProfileCredentialsPropertyValidator)(properties.singular));
  errors.collect(cdk.propertyValidator("slack", CfnConnectorProfileSlackConnectorProfileCredentialsPropertyValidator)(properties.slack));
  errors.collect(cdk.propertyValidator("snowflake", CfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyValidator)(properties.snowflake));
  errors.collect(cdk.propertyValidator("trendmicro", CfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyValidator)(properties.trendmicro));
  errors.collect(cdk.propertyValidator("veeva", CfnConnectorProfileVeevaConnectorProfileCredentialsPropertyValidator)(properties.veeva));
  errors.collect(cdk.propertyValidator("zendesk", CfnConnectorProfileZendeskConnectorProfileCredentialsPropertyValidator)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"ConnectorProfileCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileConnectorProfileCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileConnectorProfileCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Amplitude": convertCfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyToCloudFormation(properties.amplitude),
    "CustomConnector": convertCfnConnectorProfileCustomConnectorProfileCredentialsPropertyToCloudFormation(properties.customConnector),
    "Datadog": convertCfnConnectorProfileDatadogConnectorProfileCredentialsPropertyToCloudFormation(properties.datadog),
    "Dynatrace": convertCfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyToCloudFormation(properties.dynatrace),
    "GoogleAnalytics": convertCfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyToCloudFormation(properties.googleAnalytics),
    "InforNexus": convertCfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyToCloudFormation(properties.inforNexus),
    "Marketo": convertCfnConnectorProfileMarketoConnectorProfileCredentialsPropertyToCloudFormation(properties.marketo),
    "Pardot": convertCfnConnectorProfilePardotConnectorProfileCredentialsPropertyToCloudFormation(properties.pardot),
    "Redshift": convertCfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyToCloudFormation(properties.redshift),
    "SAPOData": convertCfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyToCloudFormation(properties.sapoData),
    "Salesforce": convertCfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyToCloudFormation(properties.salesforce),
    "ServiceNow": convertCfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyToCloudFormation(properties.serviceNow),
    "Singular": convertCfnConnectorProfileSingularConnectorProfileCredentialsPropertyToCloudFormation(properties.singular),
    "Slack": convertCfnConnectorProfileSlackConnectorProfileCredentialsPropertyToCloudFormation(properties.slack),
    "Snowflake": convertCfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyToCloudFormation(properties.snowflake),
    "Trendmicro": convertCfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyToCloudFormation(properties.trendmicro),
    "Veeva": convertCfnConnectorProfileVeevaConnectorProfileCredentialsPropertyToCloudFormation(properties.veeva),
    "Zendesk": convertCfnConnectorProfileZendeskConnectorProfileCredentialsPropertyToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfileCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.ConnectorProfileCredentialsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ConnectorProfileCredentialsProperty>();
  ret.addPropertyResult("amplitude", "Amplitude", (properties.Amplitude != null ? CfnConnectorProfileAmplitudeConnectorProfileCredentialsPropertyFromCloudFormation(properties.Amplitude) : undefined));
  ret.addPropertyResult("customConnector", "CustomConnector", (properties.CustomConnector != null ? CfnConnectorProfileCustomConnectorProfileCredentialsPropertyFromCloudFormation(properties.CustomConnector) : undefined));
  ret.addPropertyResult("datadog", "Datadog", (properties.Datadog != null ? CfnConnectorProfileDatadogConnectorProfileCredentialsPropertyFromCloudFormation(properties.Datadog) : undefined));
  ret.addPropertyResult("dynatrace", "Dynatrace", (properties.Dynatrace != null ? CfnConnectorProfileDynatraceConnectorProfileCredentialsPropertyFromCloudFormation(properties.Dynatrace) : undefined));
  ret.addPropertyResult("googleAnalytics", "GoogleAnalytics", (properties.GoogleAnalytics != null ? CfnConnectorProfileGoogleAnalyticsConnectorProfileCredentialsPropertyFromCloudFormation(properties.GoogleAnalytics) : undefined));
  ret.addPropertyResult("inforNexus", "InforNexus", (properties.InforNexus != null ? CfnConnectorProfileInforNexusConnectorProfileCredentialsPropertyFromCloudFormation(properties.InforNexus) : undefined));
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? CfnConnectorProfileMarketoConnectorProfileCredentialsPropertyFromCloudFormation(properties.Marketo) : undefined));
  ret.addPropertyResult("pardot", "Pardot", (properties.Pardot != null ? CfnConnectorProfilePardotConnectorProfileCredentialsPropertyFromCloudFormation(properties.Pardot) : undefined));
  ret.addPropertyResult("redshift", "Redshift", (properties.Redshift != null ? CfnConnectorProfileRedshiftConnectorProfileCredentialsPropertyFromCloudFormation(properties.Redshift) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? CfnConnectorProfileSalesforceConnectorProfileCredentialsPropertyFromCloudFormation(properties.Salesforce) : undefined));
  ret.addPropertyResult("sapoData", "SAPOData", (properties.SAPOData != null ? CfnConnectorProfileSAPODataConnectorProfileCredentialsPropertyFromCloudFormation(properties.SAPOData) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? CfnConnectorProfileServiceNowConnectorProfileCredentialsPropertyFromCloudFormation(properties.ServiceNow) : undefined));
  ret.addPropertyResult("singular", "Singular", (properties.Singular != null ? CfnConnectorProfileSingularConnectorProfileCredentialsPropertyFromCloudFormation(properties.Singular) : undefined));
  ret.addPropertyResult("slack", "Slack", (properties.Slack != null ? CfnConnectorProfileSlackConnectorProfileCredentialsPropertyFromCloudFormation(properties.Slack) : undefined));
  ret.addPropertyResult("snowflake", "Snowflake", (properties.Snowflake != null ? CfnConnectorProfileSnowflakeConnectorProfileCredentialsPropertyFromCloudFormation(properties.Snowflake) : undefined));
  ret.addPropertyResult("trendmicro", "Trendmicro", (properties.Trendmicro != null ? CfnConnectorProfileTrendmicroConnectorProfileCredentialsPropertyFromCloudFormation(properties.Trendmicro) : undefined));
  ret.addPropertyResult("veeva", "Veeva", (properties.Veeva != null ? CfnConnectorProfileVeevaConnectorProfileCredentialsPropertyFromCloudFormation(properties.Veeva) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? CfnConnectorProfileZendeskConnectorProfileCredentialsPropertyFromCloudFormation(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"ServiceNowConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.ServiceNowConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ServiceNowConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OAuth2PropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `OAuth2PropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileOAuth2PropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oAuth2GrantType", cdk.validateString)(properties.oAuth2GrantType));
  errors.collect(cdk.propertyValidator("tokenUrl", cdk.validateString)(properties.tokenUrl));
  errors.collect(cdk.propertyValidator("tokenUrlCustomProperties", cdk.hashValidator(cdk.validateString))(properties.tokenUrlCustomProperties));
  return errors.wrap("supplied properties not correct for \"OAuth2PropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileOAuth2PropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileOAuth2PropertiesPropertyValidator(properties).assertSuccess();
  return {
    "OAuth2GrantType": cdk.stringToCloudFormation(properties.oAuth2GrantType),
    "TokenUrl": cdk.stringToCloudFormation(properties.tokenUrl),
    "TokenUrlCustomProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tokenUrlCustomProperties)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileOAuth2PropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.OAuth2PropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.OAuth2PropertiesProperty>();
  ret.addPropertyResult("oAuth2GrantType", "OAuth2GrantType", (properties.OAuth2GrantType != null ? cfn_parse.FromCloudFormation.getString(properties.OAuth2GrantType) : undefined));
  ret.addPropertyResult("tokenUrl", "TokenUrl", (properties.TokenUrl != null ? cfn_parse.FromCloudFormation.getString(properties.TokenUrl) : undefined));
  ret.addPropertyResult("tokenUrlCustomProperties", "TokenUrlCustomProperties", (properties.TokenUrlCustomProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.TokenUrlCustomProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `CustomConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileCustomConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oAuth2Properties", CfnConnectorProfileOAuth2PropertiesPropertyValidator)(properties.oAuth2Properties));
  errors.collect(cdk.propertyValidator("profileProperties", cdk.hashValidator(cdk.validateString))(properties.profileProperties));
  return errors.wrap("supplied properties not correct for \"CustomConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileCustomConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileCustomConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "OAuth2Properties": convertCfnConnectorProfileOAuth2PropertiesPropertyToCloudFormation(properties.oAuth2Properties),
    "ProfileProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.profileProperties)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileCustomConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.CustomConnectorProfilePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.CustomConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("oAuth2Properties", "OAuth2Properties", (properties.OAuth2Properties != null ? CfnConnectorProfileOAuth2PropertiesPropertyFromCloudFormation(properties.OAuth2Properties) : undefined));
  ret.addPropertyResult("profileProperties", "ProfileProperties", (properties.ProfileProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ProfileProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OAuthPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `OAuthPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileOAuthPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authCodeUrl", cdk.validateString)(properties.authCodeUrl));
  errors.collect(cdk.propertyValidator("oAuthScopes", cdk.listValidator(cdk.validateString))(properties.oAuthScopes));
  errors.collect(cdk.propertyValidator("tokenUrl", cdk.validateString)(properties.tokenUrl));
  return errors.wrap("supplied properties not correct for \"OAuthPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileOAuthPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileOAuthPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "AuthCodeUrl": cdk.stringToCloudFormation(properties.authCodeUrl),
    "OAuthScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.oAuthScopes),
    "TokenUrl": cdk.stringToCloudFormation(properties.tokenUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileOAuthPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.OAuthPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.OAuthPropertiesProperty>();
  ret.addPropertyResult("authCodeUrl", "AuthCodeUrl", (properties.AuthCodeUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AuthCodeUrl) : undefined));
  ret.addPropertyResult("oAuthScopes", "OAuthScopes", (properties.OAuthScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OAuthScopes) : undefined));
  ret.addPropertyResult("tokenUrl", "TokenUrl", (properties.TokenUrl != null ? cfn_parse.FromCloudFormation.getString(properties.TokenUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationHostUrl", cdk.validateString)(properties.applicationHostUrl));
  errors.collect(cdk.propertyValidator("applicationServicePath", cdk.validateString)(properties.applicationServicePath));
  errors.collect(cdk.propertyValidator("clientNumber", cdk.validateString)(properties.clientNumber));
  errors.collect(cdk.propertyValidator("disableSso", cdk.validateBoolean)(properties.disableSso));
  errors.collect(cdk.propertyValidator("logonLanguage", cdk.validateString)(properties.logonLanguage));
  errors.collect(cdk.propertyValidator("oAuthProperties", CfnConnectorProfileOAuthPropertiesPropertyValidator)(properties.oAuthProperties));
  errors.collect(cdk.propertyValidator("portNumber", cdk.validateNumber)(properties.portNumber));
  errors.collect(cdk.propertyValidator("privateLinkServiceName", cdk.validateString)(properties.privateLinkServiceName));
  return errors.wrap("supplied properties not correct for \"SAPODataConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationHostUrl": cdk.stringToCloudFormation(properties.applicationHostUrl),
    "ApplicationServicePath": cdk.stringToCloudFormation(properties.applicationServicePath),
    "ClientNumber": cdk.stringToCloudFormation(properties.clientNumber),
    "DisableSSO": cdk.booleanToCloudFormation(properties.disableSso),
    "LogonLanguage": cdk.stringToCloudFormation(properties.logonLanguage),
    "OAuthProperties": convertCfnConnectorProfileOAuthPropertiesPropertyToCloudFormation(properties.oAuthProperties),
    "PortNumber": cdk.numberToCloudFormation(properties.portNumber),
    "PrivateLinkServiceName": cdk.stringToCloudFormation(properties.privateLinkServiceName)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SAPODataConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SAPODataConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("applicationHostUrl", "ApplicationHostUrl", (properties.ApplicationHostUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationHostUrl) : undefined));
  ret.addPropertyResult("applicationServicePath", "ApplicationServicePath", (properties.ApplicationServicePath != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationServicePath) : undefined));
  ret.addPropertyResult("clientNumber", "ClientNumber", (properties.ClientNumber != null ? cfn_parse.FromCloudFormation.getString(properties.ClientNumber) : undefined));
  ret.addPropertyResult("disableSso", "DisableSSO", (properties.DisableSSO != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableSSO) : undefined));
  ret.addPropertyResult("logonLanguage", "LogonLanguage", (properties.LogonLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.LogonLanguage) : undefined));
  ret.addPropertyResult("oAuthProperties", "OAuthProperties", (properties.OAuthProperties != null ? CfnConnectorProfileOAuthPropertiesPropertyFromCloudFormation(properties.OAuthProperties) : undefined));
  ret.addPropertyResult("portNumber", "PortNumber", (properties.PortNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.PortNumber) : undefined));
  ret.addPropertyResult("privateLinkServiceName", "PrivateLinkServiceName", (properties.PrivateLinkServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateLinkServiceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PardotConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `PardotConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfilePardotConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("businessUnitId", cdk.requiredValidator)(properties.businessUnitId));
  errors.collect(cdk.propertyValidator("businessUnitId", cdk.validateString)(properties.businessUnitId));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("isSandboxEnvironment", cdk.validateBoolean)(properties.isSandboxEnvironment));
  return errors.wrap("supplied properties not correct for \"PardotConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfilePardotConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfilePardotConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BusinessUnitId": cdk.stringToCloudFormation(properties.businessUnitId),
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl),
    "IsSandboxEnvironment": cdk.booleanToCloudFormation(properties.isSandboxEnvironment)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfilePardotConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.PardotConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.PardotConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("businessUnitId", "BusinessUnitId", (properties.BusinessUnitId != null ? cfn_parse.FromCloudFormation.getString(properties.BusinessUnitId) : undefined));
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addPropertyResult("isSandboxEnvironment", "IsSandboxEnvironment", (properties.IsSandboxEnvironment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsSandboxEnvironment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VeevaConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `VeevaConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileVeevaConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"VeevaConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileVeevaConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileVeevaConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileVeevaConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.VeevaConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.VeevaConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatadogConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `DatadogConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileDatadogConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"DatadogConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileDatadogConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileDatadogConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileDatadogConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.DatadogConnectorProfilePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.DatadogConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MarketoConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileMarketoConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"MarketoConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileMarketoConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileMarketoConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileMarketoConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.MarketoConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.MarketoConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("clusterIdentifier", cdk.validateString)(properties.clusterIdentifier));
  errors.collect(cdk.propertyValidator("dataApiRoleArn", cdk.validateString)(properties.dataApiRoleArn));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseUrl", cdk.validateString)(properties.databaseUrl));
  errors.collect(cdk.propertyValidator("isRedshiftServerless", cdk.validateBoolean)(properties.isRedshiftServerless));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("workgroupName", cdk.validateString)(properties.workgroupName));
  return errors.wrap("supplied properties not correct for \"RedshiftConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "ClusterIdentifier": cdk.stringToCloudFormation(properties.clusterIdentifier),
    "DataApiRoleArn": cdk.stringToCloudFormation(properties.dataApiRoleArn),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DatabaseUrl": cdk.stringToCloudFormation(properties.databaseUrl),
    "IsRedshiftServerless": cdk.booleanToCloudFormation(properties.isRedshiftServerless),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "WorkgroupName": cdk.stringToCloudFormation(properties.workgroupName)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.RedshiftConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.RedshiftConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("clusterIdentifier", "ClusterIdentifier", (properties.ClusterIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterIdentifier) : undefined));
  ret.addPropertyResult("dataApiRoleArn", "DataApiRoleArn", (properties.DataApiRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DataApiRoleArn) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("databaseUrl", "DatabaseUrl", (properties.DatabaseUrl != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseUrl) : undefined));
  ret.addPropertyResult("isRedshiftServerless", "IsRedshiftServerless", (properties.IsRedshiftServerless != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsRedshiftServerless) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("workgroupName", "WorkgroupName", (properties.WorkgroupName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkgroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlackConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SlackConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSlackConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"SlackConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSlackConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSlackConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSlackConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SlackConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SlackConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnowflakeConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SnowflakeConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountName", cdk.validateString)(properties.accountName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("privateLinkServiceName", cdk.validateString)(properties.privateLinkServiceName));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("stage", cdk.requiredValidator)(properties.stage));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  errors.collect(cdk.propertyValidator("warehouse", cdk.requiredValidator)(properties.warehouse));
  errors.collect(cdk.propertyValidator("warehouse", cdk.validateString)(properties.warehouse));
  return errors.wrap("supplied properties not correct for \"SnowflakeConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "AccountName": cdk.stringToCloudFormation(properties.accountName),
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "PrivateLinkServiceName": cdk.stringToCloudFormation(properties.privateLinkServiceName),
    "Region": cdk.stringToCloudFormation(properties.region),
    "Stage": cdk.stringToCloudFormation(properties.stage),
    "Warehouse": cdk.stringToCloudFormation(properties.warehouse)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SnowflakeConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SnowflakeConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("accountName", "AccountName", (properties.AccountName != null ? cfn_parse.FromCloudFormation.getString(properties.AccountName) : undefined));
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("privateLinkServiceName", "PrivateLinkServiceName", (properties.PrivateLinkServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateLinkServiceName) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addPropertyResult("warehouse", "Warehouse", (properties.Warehouse != null ? cfn_parse.FromCloudFormation.getString(properties.Warehouse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynatraceConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `DynatraceConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"DynatraceConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.DynatraceConnectorProfilePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.DynatraceConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZendeskConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileZendeskConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"ZendeskConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileZendeskConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileZendeskConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileZendeskConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.ZendeskConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ZendeskConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InforNexusConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `InforNexusConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.requiredValidator)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  return errors.wrap("supplied properties not correct for \"InforNexusConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.InforNexusConnectorProfilePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.InforNexusConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceUrl", cdk.validateString)(properties.instanceUrl));
  errors.collect(cdk.propertyValidator("isSandboxEnvironment", cdk.validateBoolean)(properties.isSandboxEnvironment));
  errors.collect(cdk.propertyValidator("usePrivateLinkForMetadataAndAuthorization", cdk.validateBoolean)(properties.usePrivateLinkForMetadataAndAuthorization));
  return errors.wrap("supplied properties not correct for \"SalesforceConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "InstanceUrl": cdk.stringToCloudFormation(properties.instanceUrl),
    "isSandboxEnvironment": cdk.booleanToCloudFormation(properties.isSandboxEnvironment),
    "usePrivateLinkForMetadataAndAuthorization": cdk.booleanToCloudFormation(properties.usePrivateLinkForMetadataAndAuthorization)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnectorProfile.SalesforceConnectorProfilePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.SalesforceConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("instanceUrl", "InstanceUrl", (properties.InstanceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceUrl) : undefined));
  ret.addPropertyResult("isSandboxEnvironment", "isSandboxEnvironment", (properties.isSandboxEnvironment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.isSandboxEnvironment) : undefined));
  ret.addPropertyResult("usePrivateLinkForMetadataAndAuthorization", "usePrivateLinkForMetadataAndAuthorization", (properties.usePrivateLinkForMetadataAndAuthorization != null ? cfn_parse.FromCloudFormation.getBoolean(properties.usePrivateLinkForMetadataAndAuthorization) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorProfilePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProfilePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfilePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customConnector", CfnConnectorProfileCustomConnectorProfilePropertiesPropertyValidator)(properties.customConnector));
  errors.collect(cdk.propertyValidator("datadog", CfnConnectorProfileDatadogConnectorProfilePropertiesPropertyValidator)(properties.datadog));
  errors.collect(cdk.propertyValidator("dynatrace", CfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyValidator)(properties.dynatrace));
  errors.collect(cdk.propertyValidator("inforNexus", CfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyValidator)(properties.inforNexus));
  errors.collect(cdk.propertyValidator("marketo", CfnConnectorProfileMarketoConnectorProfilePropertiesPropertyValidator)(properties.marketo));
  errors.collect(cdk.propertyValidator("pardot", CfnConnectorProfilePardotConnectorProfilePropertiesPropertyValidator)(properties.pardot));
  errors.collect(cdk.propertyValidator("redshift", CfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyValidator)(properties.redshift));
  errors.collect(cdk.propertyValidator("sapoData", CfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyValidator)(properties.sapoData));
  errors.collect(cdk.propertyValidator("salesforce", CfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyValidator)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", CfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyValidator)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("slack", CfnConnectorProfileSlackConnectorProfilePropertiesPropertyValidator)(properties.slack));
  errors.collect(cdk.propertyValidator("snowflake", CfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyValidator)(properties.snowflake));
  errors.collect(cdk.propertyValidator("veeva", CfnConnectorProfileVeevaConnectorProfilePropertiesPropertyValidator)(properties.veeva));
  errors.collect(cdk.propertyValidator("zendesk", CfnConnectorProfileZendeskConnectorProfilePropertiesPropertyValidator)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"ConnectorProfilePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileConnectorProfilePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileConnectorProfilePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "CustomConnector": convertCfnConnectorProfileCustomConnectorProfilePropertiesPropertyToCloudFormation(properties.customConnector),
    "Datadog": convertCfnConnectorProfileDatadogConnectorProfilePropertiesPropertyToCloudFormation(properties.datadog),
    "Dynatrace": convertCfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyToCloudFormation(properties.dynatrace),
    "InforNexus": convertCfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyToCloudFormation(properties.inforNexus),
    "Marketo": convertCfnConnectorProfileMarketoConnectorProfilePropertiesPropertyToCloudFormation(properties.marketo),
    "Pardot": convertCfnConnectorProfilePardotConnectorProfilePropertiesPropertyToCloudFormation(properties.pardot),
    "Redshift": convertCfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyToCloudFormation(properties.redshift),
    "SAPOData": convertCfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyToCloudFormation(properties.sapoData),
    "Salesforce": convertCfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyToCloudFormation(properties.salesforce),
    "ServiceNow": convertCfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyToCloudFormation(properties.serviceNow),
    "Slack": convertCfnConnectorProfileSlackConnectorProfilePropertiesPropertyToCloudFormation(properties.slack),
    "Snowflake": convertCfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyToCloudFormation(properties.snowflake),
    "Veeva": convertCfnConnectorProfileVeevaConnectorProfilePropertiesPropertyToCloudFormation(properties.veeva),
    "Zendesk": convertCfnConnectorProfileZendeskConnectorProfilePropertiesPropertyToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfilePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.ConnectorProfilePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ConnectorProfilePropertiesProperty>();
  ret.addPropertyResult("customConnector", "CustomConnector", (properties.CustomConnector != null ? CfnConnectorProfileCustomConnectorProfilePropertiesPropertyFromCloudFormation(properties.CustomConnector) : undefined));
  ret.addPropertyResult("datadog", "Datadog", (properties.Datadog != null ? CfnConnectorProfileDatadogConnectorProfilePropertiesPropertyFromCloudFormation(properties.Datadog) : undefined));
  ret.addPropertyResult("dynatrace", "Dynatrace", (properties.Dynatrace != null ? CfnConnectorProfileDynatraceConnectorProfilePropertiesPropertyFromCloudFormation(properties.Dynatrace) : undefined));
  ret.addPropertyResult("inforNexus", "InforNexus", (properties.InforNexus != null ? CfnConnectorProfileInforNexusConnectorProfilePropertiesPropertyFromCloudFormation(properties.InforNexus) : undefined));
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? CfnConnectorProfileMarketoConnectorProfilePropertiesPropertyFromCloudFormation(properties.Marketo) : undefined));
  ret.addPropertyResult("pardot", "Pardot", (properties.Pardot != null ? CfnConnectorProfilePardotConnectorProfilePropertiesPropertyFromCloudFormation(properties.Pardot) : undefined));
  ret.addPropertyResult("redshift", "Redshift", (properties.Redshift != null ? CfnConnectorProfileRedshiftConnectorProfilePropertiesPropertyFromCloudFormation(properties.Redshift) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? CfnConnectorProfileSalesforceConnectorProfilePropertiesPropertyFromCloudFormation(properties.Salesforce) : undefined));
  ret.addPropertyResult("sapoData", "SAPOData", (properties.SAPOData != null ? CfnConnectorProfileSAPODataConnectorProfilePropertiesPropertyFromCloudFormation(properties.SAPOData) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? CfnConnectorProfileServiceNowConnectorProfilePropertiesPropertyFromCloudFormation(properties.ServiceNow) : undefined));
  ret.addPropertyResult("slack", "Slack", (properties.Slack != null ? CfnConnectorProfileSlackConnectorProfilePropertiesPropertyFromCloudFormation(properties.Slack) : undefined));
  ret.addPropertyResult("snowflake", "Snowflake", (properties.Snowflake != null ? CfnConnectorProfileSnowflakeConnectorProfilePropertiesPropertyFromCloudFormation(properties.Snowflake) : undefined));
  ret.addPropertyResult("veeva", "Veeva", (properties.Veeva != null ? CfnConnectorProfileVeevaConnectorProfilePropertiesPropertyFromCloudFormation(properties.Veeva) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? CfnConnectorProfileZendeskConnectorProfilePropertiesPropertyFromCloudFormation(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectorProfileConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorProfileConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfileConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorProfileCredentials", CfnConnectorProfileConnectorProfileCredentialsPropertyValidator)(properties.connectorProfileCredentials));
  errors.collect(cdk.propertyValidator("connectorProfileProperties", CfnConnectorProfileConnectorProfilePropertiesPropertyValidator)(properties.connectorProfileProperties));
  return errors.wrap("supplied properties not correct for \"ConnectorProfileConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfileConnectorProfileConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfileConnectorProfileConfigPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorProfileCredentials": convertCfnConnectorProfileConnectorProfileCredentialsPropertyToCloudFormation(properties.connectorProfileCredentials),
    "ConnectorProfileProperties": convertCfnConnectorProfileConnectorProfilePropertiesPropertyToCloudFormation(properties.connectorProfileProperties)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfileConnectorProfileConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfile.ConnectorProfileConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfile.ConnectorProfileConfigProperty>();
  ret.addPropertyResult("connectorProfileCredentials", "ConnectorProfileCredentials", (properties.ConnectorProfileCredentials != null ? CfnConnectorProfileConnectorProfileCredentialsPropertyFromCloudFormation(properties.ConnectorProfileCredentials) : undefined));
  ret.addPropertyResult("connectorProfileProperties", "ConnectorProfileProperties", (properties.ConnectorProfileProperties != null ? CfnConnectorProfileConnectorProfilePropertiesPropertyFromCloudFormation(properties.ConnectorProfileProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionMode", cdk.requiredValidator)(properties.connectionMode));
  errors.collect(cdk.propertyValidator("connectionMode", cdk.validateString)(properties.connectionMode));
  errors.collect(cdk.propertyValidator("connectorLabel", cdk.validateString)(properties.connectorLabel));
  errors.collect(cdk.propertyValidator("connectorProfileConfig", CfnConnectorProfileConnectorProfileConfigPropertyValidator)(properties.connectorProfileConfig));
  errors.collect(cdk.propertyValidator("connectorProfileName", cdk.requiredValidator)(properties.connectorProfileName));
  errors.collect(cdk.propertyValidator("connectorProfileName", cdk.validateString)(properties.connectorProfileName));
  errors.collect(cdk.propertyValidator("connectorType", cdk.requiredValidator)(properties.connectorType));
  errors.collect(cdk.propertyValidator("connectorType", cdk.validateString)(properties.connectorType));
  errors.collect(cdk.propertyValidator("kmsArn", cdk.validateString)(properties.kmsArn));
  return errors.wrap("supplied properties not correct for \"CfnConnectorProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorProfilePropsValidator(properties).assertSuccess();
  return {
    "ConnectionMode": cdk.stringToCloudFormation(properties.connectionMode),
    "ConnectorLabel": cdk.stringToCloudFormation(properties.connectorLabel),
    "ConnectorProfileConfig": convertCfnConnectorProfileConnectorProfileConfigPropertyToCloudFormation(properties.connectorProfileConfig),
    "ConnectorProfileName": cdk.stringToCloudFormation(properties.connectorProfileName),
    "ConnectorType": cdk.stringToCloudFormation(properties.connectorType),
    "KMSArn": cdk.stringToCloudFormation(properties.kmsArn)
  };
}

// @ts-ignore TS6133
function CfnConnectorProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProfileProps>();
  ret.addPropertyResult("connectionMode", "ConnectionMode", (properties.ConnectionMode != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionMode) : undefined));
  ret.addPropertyResult("connectorLabel", "ConnectorLabel", (properties.ConnectorLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorLabel) : undefined));
  ret.addPropertyResult("connectorProfileConfig", "ConnectorProfileConfig", (properties.ConnectorProfileConfig != null ? CfnConnectorProfileConnectorProfileConfigPropertyFromCloudFormation(properties.ConnectorProfileConfig) : undefined));
  ret.addPropertyResult("connectorProfileName", "ConnectorProfileName", (properties.ConnectorProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProfileName) : undefined));
  ret.addPropertyResult("connectorType", "ConnectorType", (properties.ConnectorType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorType) : undefined));
  ret.addPropertyResult("kmsArn", "KMSArn", (properties.KMSArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::AppFlow::Flow` resource is an Amazon AppFlow resource type that specifies a new flow.
 *
 * > If you want to use AWS CloudFormation to create a connector profile for connectors that implement OAuth (such as Salesforce, Slack, Zendesk, and Google Analytics), you must fetch the access and refresh tokens. You can do this by implementing your own UI for OAuth, or by retrieving the tokens from elsewhere. Alternatively, you can use the Amazon AppFlow console to create the connector profile, and then use that connector profile in the flow creation CloudFormation template.
 *
 * @cloudformationResource AWS::AppFlow::Flow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html
 */
export class CfnFlow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppFlow::Flow";

  /**
   * Build a CfnFlow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The flow's Amazon Resource Name (ARN).
   *
   * @cloudformationAttribute FlowArn
   */
  public readonly attrFlowArn: string;

  /**
   * A user-entered description of the flow.
   */
  public description?: string;

  /**
   * The configuration that controls how Amazon AppFlow places data in the destination connector.
   */
  public destinationFlowConfigList: Array<CfnFlow.DestinationFlowConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The specified name of the flow.
   */
  public flowName: string;

  /**
   * Sets the status of the flow. You can specify one of the following values:.
   */
  public flowStatus?: string;

  /**
   * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption.
   */
  public kmsArn?: string;

  /**
   * Specifies the configuration that Amazon AppFlow uses when it catalogs your data.
   */
  public metadataCatalogConfig?: cdk.IResolvable | CfnFlow.MetadataCatalogConfigProperty;

  /**
   * Contains information about the configuration of the source connector used in the flow.
   */
  public sourceFlowConfig: cdk.IResolvable | CfnFlow.SourceFlowConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for your flow.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of tasks that Amazon AppFlow performs while transferring the data in the flow run.
   */
  public tasks: Array<cdk.IResolvable | CfnFlow.TaskProperty> | cdk.IResolvable;

  /**
   * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
   */
  public triggerConfig: cdk.IResolvable | CfnFlow.TriggerConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlowProps) {
    super(scope, id, {
      "type": CfnFlow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationFlowConfigList", this);
    cdk.requireProperty(props, "flowName", this);
    cdk.requireProperty(props, "sourceFlowConfig", this);
    cdk.requireProperty(props, "tasks", this);
    cdk.requireProperty(props, "triggerConfig", this);

    this.attrFlowArn = cdk.Token.asString(this.getAtt("FlowArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.destinationFlowConfigList = props.destinationFlowConfigList;
    this.flowName = props.flowName;
    this.flowStatus = props.flowStatus;
    this.kmsArn = props.kmsArn;
    this.metadataCatalogConfig = props.metadataCatalogConfig;
    this.sourceFlowConfig = props.sourceFlowConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppFlow::Flow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tasks = props.tasks;
    this.triggerConfig = props.triggerConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "destinationFlowConfigList": this.destinationFlowConfigList,
      "flowName": this.flowName,
      "flowStatus": this.flowStatus,
      "kmsArn": this.kmsArn,
      "metadataCatalogConfig": this.metadataCatalogConfig,
      "sourceFlowConfig": this.sourceFlowConfig,
      "tags": this.tags.renderTags(),
      "tasks": this.tasks,
      "triggerConfig": this.triggerConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlowPropsToCloudFormation(props);
  }
}

export namespace CfnFlow {
  /**
   * A class for modeling different type of tasks.
   *
   * Task implementation varies based on the `TaskType` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html
   */
  export interface TaskProperty {
    /**
     * The operation to be performed on the provided source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-connectoroperator
     */
    readonly connectorOperator?: CfnFlow.ConnectorOperatorProperty | cdk.IResolvable;

    /**
     * A field in a destination connector, or a field value against which Amazon AppFlow validates a source field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-destinationfield
     */
    readonly destinationField?: string;

    /**
     * The source fields to which a particular task is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-sourcefields
     */
    readonly sourceFields: Array<string>;

    /**
     * A map used to store task-related information.
     *
     * The execution service looks for particular information based on the `TaskType` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-taskproperties
     */
    readonly taskProperties?: Array<cdk.IResolvable | CfnFlow.TaskPropertiesObjectProperty> | cdk.IResolvable;

    /**
     * Specifies the particular task implementation that Amazon AppFlow performs.
     *
     * *Allowed values* : `Arithmetic` | `Filter` | `Map` | `Map_all` | `Mask` | `Merge` | `Truncate` | `Validate`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-tasktype
     */
    readonly taskType: string;
  }

  /**
   * The operation to be performed on the provided source fields.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html
   */
  export interface ConnectorOperatorProperty {
    /**
     * The operation to be performed on the provided Amplitude source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-amplitude
     */
    readonly amplitude?: string;

    /**
     * Operators supported by the custom connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-customconnector
     */
    readonly customConnector?: string;

    /**
     * The operation to be performed on the provided Datadog source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-datadog
     */
    readonly datadog?: string;

    /**
     * The operation to be performed on the provided Dynatrace source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-dynatrace
     */
    readonly dynatrace?: string;

    /**
     * The operation to be performed on the provided Google Analytics source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-googleanalytics
     */
    readonly googleAnalytics?: string;

    /**
     * The operation to be performed on the provided Infor Nexus source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-infornexus
     */
    readonly inforNexus?: string;

    /**
     * The operation to be performed on the provided Marketo source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-marketo
     */
    readonly marketo?: string;

    /**
     * The operation to be performed on the provided Salesforce Pardot source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-pardot
     */
    readonly pardot?: string;

    /**
     * The operation to be performed on the provided Amazon S3 source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-s3
     */
    readonly s3?: string;

    /**
     * The operation to be performed on the provided Salesforce source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-salesforce
     */
    readonly salesforce?: string;

    /**
     * The operation to be performed on the provided SAPOData source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-sapodata
     */
    readonly sapoData?: string;

    /**
     * The operation to be performed on the provided ServiceNow source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-servicenow
     */
    readonly serviceNow?: string;

    /**
     * The operation to be performed on the provided Singular source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-singular
     */
    readonly singular?: string;

    /**
     * The operation to be performed on the provided Slack source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-slack
     */
    readonly slack?: string;

    /**
     * The operation to be performed on the provided Trend Micro source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-trendmicro
     */
    readonly trendmicro?: string;

    /**
     * The operation to be performed on the provided Veeva source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-veeva
     */
    readonly veeva?: string;

    /**
     * The operation to be performed on the provided Zendesk source fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-zendesk
     */
    readonly zendesk?: string;
  }

  /**
   * A map used to store task-related information.
   *
   * The execution service looks for particular information based on the `TaskType` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html
   */
  export interface TaskPropertiesObjectProperty {
    /**
     * The task property key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html#cfn-appflow-flow-taskpropertiesobject-key
     */
    readonly key: string;

    /**
     * The task property value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html#cfn-appflow-flow-taskpropertiesobject-value
     */
    readonly value: string;
  }

  /**
   * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html
   */
  export interface TriggerConfigProperty {
    /**
     * Specifies the configuration details of a schedule-triggered flow as defined by the user.
     *
     * Currently, these settings only apply to the `Scheduled` trigger type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html#cfn-appflow-flow-triggerconfig-triggerproperties
     */
    readonly triggerProperties?: cdk.IResolvable | CfnFlow.ScheduledTriggerPropertiesProperty;

    /**
     * Specifies the type of flow trigger.
     *
     * This can be `OnDemand` , `Scheduled` , or `Event` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html#cfn-appflow-flow-triggerconfig-triggertype
     */
    readonly triggerType: string;
  }

  /**
   * Specifies the configuration details of a schedule-triggered flow as defined by the user.
   *
   * Currently, these settings only apply to the `Scheduled` trigger type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html
   */
  export interface ScheduledTriggerPropertiesProperty {
    /**
     * Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-datapullmode
     */
    readonly dataPullMode?: string;

    /**
     * Specifies the date range for the records to import from the connector in the first flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-firstexecutionfrom
     */
    readonly firstExecutionFrom?: number;

    /**
     * Defines how many times a scheduled flow fails consecutively before Amazon AppFlow deactivates it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-flowerrordeactivationthreshold
     */
    readonly flowErrorDeactivationThreshold?: number;

    /**
     * The time at which the scheduled flow ends.
     *
     * The time is formatted as a timestamp that follows the ISO 8601 standard, such as `2022-04-27T13:00:00-07:00` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleendtime
     */
    readonly scheduleEndTime?: number;

    /**
     * The scheduling expression that determines the rate at which the schedule will run, for example `rate(5minutes)` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleexpression
     */
    readonly scheduleExpression: string;

    /**
     * Specifies the optional offset that is added to the time interval for a schedule-triggered flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleoffset
     */
    readonly scheduleOffset?: number;

    /**
     * The time at which the scheduled flow starts.
     *
     * The time is formatted as a timestamp that follows the ISO 8601 standard, such as `2022-04-26T13:00:00-07:00` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-schedulestarttime
     */
    readonly scheduleStartTime?: number;

    /**
     * Specifies the time zone used when referring to the dates and times of a scheduled flow, such as `America/New_York` .
     *
     * This time zone is only a descriptive label. It doesn't affect how Amazon AppFlow interprets the timestamps that you specify to schedule the flow.
     *
     * If you want to schedule a flow by using times in a particular time zone, indicate the time zone as a UTC offset in your timestamps. For example, the UTC offsets for the `America/New_York` timezone are `-04:00` EDT and `-05:00 EST` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-timezone
     */
    readonly timeZone?: string;
  }

  /**
   * Contains information about the configuration of destination connectors present in the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html
   */
  export interface DestinationFlowConfigProperty {
    /**
     * The API version that the destination connector uses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-apiversion
     */
    readonly apiVersion?: string;

    /**
     * The name of the connector profile.
     *
     * This name must be unique for each connector profile in the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-connectorprofilename
     */
    readonly connectorProfileName?: string;

    /**
     * The type of destination connector, such as Sales force, Amazon S3, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-connectortype
     */
    readonly connectorType: string;

    /**
     * This stores the information that is required to query a particular connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-destinationconnectorproperties
     */
    readonly destinationConnectorProperties: CfnFlow.DestinationConnectorPropertiesProperty | cdk.IResolvable;
  }

  /**
   * This stores the information that is required to query a particular connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html
   */
  export interface DestinationConnectorPropertiesProperty {
    /**
     * The properties that are required to query the custom Connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-customconnector
     */
    readonly customConnector?: CfnFlow.CustomConnectorDestinationPropertiesProperty | cdk.IResolvable;

    /**
     * The properties required to query Amazon EventBridge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-eventbridge
     */
    readonly eventBridge?: CfnFlow.EventBridgeDestinationPropertiesProperty | cdk.IResolvable;

    /**
     * The properties required to query Amazon Lookout for Metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-lookoutmetrics
     */
    readonly lookoutMetrics?: cdk.IResolvable | CfnFlow.LookoutMetricsDestinationPropertiesProperty;

    /**
     * The properties required to query Marketo.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-marketo
     */
    readonly marketo?: cdk.IResolvable | CfnFlow.MarketoDestinationPropertiesProperty;

    /**
     * The properties required to query Amazon Redshift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-redshift
     */
    readonly redshift?: cdk.IResolvable | CfnFlow.RedshiftDestinationPropertiesProperty;

    /**
     * The properties required to query Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-s3
     */
    readonly s3?: cdk.IResolvable | CfnFlow.S3DestinationPropertiesProperty;

    /**
     * The properties required to query Salesforce.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-salesforce
     */
    readonly salesforce?: cdk.IResolvable | CfnFlow.SalesforceDestinationPropertiesProperty;

    /**
     * The properties required to query SAPOData.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-sapodata
     */
    readonly sapoData?: cdk.IResolvable | CfnFlow.SAPODataDestinationPropertiesProperty;

    /**
     * The properties required to query Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-snowflake
     */
    readonly snowflake?: cdk.IResolvable | CfnFlow.SnowflakeDestinationPropertiesProperty;

    /**
     * The properties required to query Upsolver.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-upsolver
     */
    readonly upsolver?: cdk.IResolvable | CfnFlow.UpsolverDestinationPropertiesProperty;

    /**
     * The properties required to query Zendesk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-zendesk
     */
    readonly zendesk?: cdk.IResolvable | CfnFlow.ZendeskDestinationPropertiesProperty;
  }

  /**
   * The properties that are applied when Amazon S3 is used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html
   */
  export interface S3DestinationPropertiesProperty {
    /**
     * The Amazon S3 bucket name in which Amazon AppFlow places the transferred data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The object key for the destination bucket in which Amazon AppFlow places the files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The configuration that determines how Amazon AppFlow should format the flow output data when Amazon S3 is used as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-s3outputformatconfig
     */
    readonly s3OutputFormatConfig?: cdk.IResolvable | CfnFlow.S3OutputFormatConfigProperty;
  }

  /**
   * The configuration that determines how Amazon AppFlow should format the flow output data when Amazon S3 is used as the destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html
   */
  export interface S3OutputFormatConfigProperty {
    /**
     * The aggregation settings that you can use to customize the output format of your flow data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-aggregationconfig
     */
    readonly aggregationConfig?: CfnFlow.AggregationConfigProperty | cdk.IResolvable;

    /**
     * Indicates the file type that Amazon AppFlow places in the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-filetype
     */
    readonly fileType?: string;

    /**
     * Determines the prefix that Amazon AppFlow applies to the folder name in the Amazon S3 bucket.
     *
     * You can name folders according to the flow frequency and date.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-prefixconfig
     */
    readonly prefixConfig?: cdk.IResolvable | CfnFlow.PrefixConfigProperty;

    /**
     * If your file output format is Parquet, use this parameter to set whether Amazon AppFlow preserves the data types in your source data when it writes the output to Amazon S3.
     *
     * - `true` : Amazon AppFlow preserves the data types when it writes to Amazon S3. For example, an integer or `1` in your source data is still an integer in your output.
     * - `false` : Amazon AppFlow converts all of the source data into strings when it writes to Amazon S3. For example, an integer of `1` in your source data becomes the string `"1"` in the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-preservesourcedatatyping
     */
    readonly preserveSourceDataTyping?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies elements that Amazon AppFlow includes in the file and folder names in the flow destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html
   */
  export interface PrefixConfigProperty {
    /**
     * Specifies whether the destination file path includes either or both of the following elements:.
     *
     * - **EXECUTION_ID** - The ID that Amazon AppFlow assigns to the flow run.
     * - **SCHEMA_VERSION** - The version number of your data schema. Amazon AppFlow assigns this version number. The version number increases by one when you change any of the following settings in your flow configuration:
     *
     * - Source-to-destination field mappings
     * - Field data types
     * - Partition keys
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-pathprefixhierarchy
     */
    readonly pathPrefixHierarchy?: Array<string>;

    /**
     * Determines the level of granularity for the date and time that's included in the prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-prefixformat
     */
    readonly prefixFormat?: string;

    /**
     * Determines the format of the prefix, and whether it applies to the file name, file path, or both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-prefixtype
     */
    readonly prefixType?: string;
  }

  /**
   * The aggregation settings that you can use to customize the output format of your flow data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html
   */
  export interface AggregationConfigProperty {
    /**
     * Specifies whether Amazon AppFlow aggregates the flow records into a single file, or leave them unaggregated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html#cfn-appflow-flow-aggregationconfig-aggregationtype
     */
    readonly aggregationType?: string;

    /**
     * The desired file size, in MB, for each output file that Amazon AppFlow writes to the flow destination.
     *
     * For each file, Amazon AppFlow attempts to achieve the size that you specify. The actual file sizes might differ from this target based on the number and size of the records that each file contains.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html#cfn-appflow-flow-aggregationconfig-targetfilesize
     */
    readonly targetFileSize?: number;
  }

  /**
   * The properties that are applied when the custom connector is being used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html
   */
  export interface CustomConnectorDestinationPropertiesProperty {
    /**
     * The custom properties that are specific to the connector when it's used as a destination in the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-customproperties
     */
    readonly customProperties?: cdk.IResolvable | Record<string, string>;

    /**
     * The entity specified in the custom connector as a destination in the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-entityname
     */
    readonly entityName: string;

    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the custom connector as destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update, delete, or upsert.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-idfieldnames
     */
    readonly idFieldNames?: Array<string>;

    /**
     * Specifies the type of write operation to be performed in the custom connector when it's used as destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-writeoperationtype
     */
    readonly writeOperationType?: string;
  }

  /**
   * The settings that determine how Amazon AppFlow handles an error when placing data in the destination.
   *
   * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html
   */
  export interface ErrorHandlingConfigProperty {
    /**
     * Specifies the name of the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-bucketname
     */
    readonly bucketName?: string;

    /**
     * Specifies the Amazon S3 bucket prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * Specifies if the flow should fail after the first instance of a failure when attempting to place data in the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-failonfirsterror
     */
    readonly failOnFirstError?: boolean | cdk.IResolvable;
  }

  /**
   * The properties that are applied when Upsolver is used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html
   */
  export interface UpsolverDestinationPropertiesProperty {
    /**
     * The Upsolver Amazon S3 bucket name in which Amazon AppFlow places the transferred data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The object key for the destination Upsolver Amazon S3 bucket in which Amazon AppFlow places the files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The configuration that determines how data is formatted when Upsolver is used as the flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-s3outputformatconfig
     */
    readonly s3OutputFormatConfig: cdk.IResolvable | CfnFlow.UpsolverS3OutputFormatConfigProperty;
  }

  /**
   * The configuration that determines how Amazon AppFlow formats the flow output data when Upsolver is used as the destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html
   */
  export interface UpsolverS3OutputFormatConfigProperty {
    /**
     * The aggregation settings that you can use to customize the output format of your flow data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-aggregationconfig
     */
    readonly aggregationConfig?: CfnFlow.AggregationConfigProperty | cdk.IResolvable;

    /**
     * Indicates the file type that Amazon AppFlow places in the Upsolver Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-filetype
     */
    readonly fileType?: string;

    /**
     * Specifies elements that Amazon AppFlow includes in the file and folder names in the flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-prefixconfig
     */
    readonly prefixConfig: cdk.IResolvable | CfnFlow.PrefixConfigProperty;
  }

  /**
   * The properties that are applied when using SAPOData as a flow destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html
   */
  export interface SAPODataDestinationPropertiesProperty {
    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * A list of field names that can be used as an ID field when performing a write operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-idfieldnames
     */
    readonly idFieldNames?: Array<string>;

    /**
     * The object path specified in the SAPOData flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-objectpath
     */
    readonly objectPath: string;

    /**
     * Determines how Amazon AppFlow handles the success response that it gets from the connector after placing data.
     *
     * For example, this setting would determine where to write the response from a destination connector upon a successful insert operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-successresponsehandlingconfig
     */
    readonly successResponseHandlingConfig?: cdk.IResolvable | CfnFlow.SuccessResponseHandlingConfigProperty;

    /**
     * The possible write operations in the destination connector.
     *
     * When this value is not provided, this defaults to the `INSERT` operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-writeoperationtype
     */
    readonly writeOperationType?: string;
  }

  /**
   * Determines how Amazon AppFlow handles the success response that it gets from the connector after placing data.
   *
   * For example, this setting would determine where to write the response from the destination connector upon a successful insert operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html
   */
  export interface SuccessResponseHandlingConfigProperty {
    /**
     * The name of the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html#cfn-appflow-flow-successresponsehandlingconfig-bucketname
     */
    readonly bucketName?: string;

    /**
     * The Amazon S3 bucket prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html#cfn-appflow-flow-successresponsehandlingconfig-bucketprefix
     */
    readonly bucketPrefix?: string;
  }

  /**
   * The properties that are applied when Snowflake is being used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html
   */
  export interface SnowflakeDestinationPropertiesProperty {
    /**
     * The object key for the destination bucket in which Amazon AppFlow places the files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the Snowflake destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The intermediate bucket that Amazon AppFlow uses when moving data into Snowflake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-intermediatebucketname
     */
    readonly intermediateBucketName: string;

    /**
     * The object specified in the Snowflake flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Amazon Lookout for Metrics is used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-lookoutmetricsdestinationproperties.html
   */
  export interface LookoutMetricsDestinationPropertiesProperty {
    /**
     * The object specified in the Amazon Lookout for Metrics flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-lookoutmetricsdestinationproperties.html#cfn-appflow-flow-lookoutmetricsdestinationproperties-object
     */
    readonly object?: string;
  }

  /**
   * The properties that are applied when Amazon EventBridge is being used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html
   */
  export interface EventBridgeDestinationPropertiesProperty {
    /**
     * The object specified in the Amplitude flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html#cfn-appflow-flow-eventbridgedestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The object specified in the Amazon EventBridge flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html#cfn-appflow-flow-eventbridgedestinationproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Zendesk is used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html
   */
  export interface ZendeskDestinationPropertiesProperty {
    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * A list of field names that can be used as an ID field when performing a write operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-idfieldnames
     */
    readonly idFieldNames?: Array<string>;

    /**
     * The object specified in the Zendesk flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-object
     */
    readonly object: string;

    /**
     * The possible write operations in the destination connector.
     *
     * When this value is not provided, this defaults to the `INSERT` operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-writeoperationtype
     */
    readonly writeOperationType?: string;
  }

  /**
   * The properties that Amazon AppFlow applies when you use Marketo as a flow destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html
   */
  export interface MarketoDestinationPropertiesProperty {
    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html#cfn-appflow-flow-marketodestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The object specified in the Marketo flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html#cfn-appflow-flow-marketodestinationproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Amazon Redshift is being used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html
   */
  export interface RedshiftDestinationPropertiesProperty {
    /**
     * The object key for the bucket in which Amazon AppFlow places the destination files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the Amazon Redshift destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The intermediate bucket that Amazon AppFlow uses when moving data into Amazon Redshift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-intermediatebucketname
     */
    readonly intermediateBucketName: string;

    /**
     * The object specified in the Amazon Redshift flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Salesforce is being used as a destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html
   */
  export interface SalesforceDestinationPropertiesProperty {
    /**
     * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data to Salesforce.
     *
     * - **AUTOMATIC** - The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers to Salesforce. If your flow transfers fewer than 1,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0.
     *
     * Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900 records, and it might use Bulk API 2.0 on the next day to transfer 1,100 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields.
     *
     * By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.
     * - **BULKV2** - Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers.
     *
     * Note that Bulk API 2.0 does not transfer Salesforce compound fields.
     * - **REST_SYNC** - Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail with a timed out error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-datatransferapi
     */
    readonly dataTransferApi?: string;

    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the Salesforce destination.
     *
     * For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-errorhandlingconfig
     */
    readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;

    /**
     * The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update or delete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-idfieldnames
     */
    readonly idFieldNames?: Array<string>;

    /**
     * The object specified in the Salesforce flow destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-object
     */
    readonly object: string;

    /**
     * This specifies the type of write operation to be performed in Salesforce.
     *
     * When the value is `UPSERT` , then `idFieldNames` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-writeoperationtype
     */
    readonly writeOperationType?: string;
  }

  /**
   * Contains information about the configuration of the source connector used in the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html
   */
  export interface SourceFlowConfigProperty {
    /**
     * The API version of the connector when it's used as a source in the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-apiversion
     */
    readonly apiVersion?: string;

    /**
     * The name of the connector profile.
     *
     * This name must be unique for each connector profile in the AWS account .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-connectorprofilename
     */
    readonly connectorProfileName?: string;

    /**
     * The type of connector, such as Salesforce, Amplitude, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-connectortype
     */
    readonly connectorType: string;

    /**
     * Defines the configuration for a scheduled incremental data pull.
     *
     * If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-incrementalpullconfig
     */
    readonly incrementalPullConfig?: CfnFlow.IncrementalPullConfigProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required to query a particular source connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-sourceconnectorproperties
     */
    readonly sourceConnectorProperties: cdk.IResolvable | CfnFlow.SourceConnectorPropertiesProperty;
  }

  /**
   * Specifies the information that is required to query a particular connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html
   */
  export interface SourceConnectorPropertiesProperty {
    /**
     * Specifies the information that is required for querying Amplitude.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-amplitude
     */
    readonly amplitude?: CfnFlow.AmplitudeSourcePropertiesProperty | cdk.IResolvable;

    /**
     * The properties that are applied when the custom connector is being used as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-customconnector
     */
    readonly customConnector?: CfnFlow.CustomConnectorSourcePropertiesProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required for querying Datadog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-datadog
     */
    readonly datadog?: CfnFlow.DatadogSourcePropertiesProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required for querying Dynatrace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-dynatrace
     */
    readonly dynatrace?: CfnFlow.DynatraceSourcePropertiesProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required for querying Google Analytics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-googleanalytics
     */
    readonly googleAnalytics?: CfnFlow.GoogleAnalyticsSourcePropertiesProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required for querying Infor Nexus.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-infornexus
     */
    readonly inforNexus?: CfnFlow.InforNexusSourcePropertiesProperty | cdk.IResolvable;

    /**
     * Specifies the information that is required for querying Marketo.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-marketo
     */
    readonly marketo?: cdk.IResolvable | CfnFlow.MarketoSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Salesforce Pardot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-pardot
     */
    readonly pardot?: cdk.IResolvable | CfnFlow.PardotSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-s3
     */
    readonly s3?: cdk.IResolvable | CfnFlow.S3SourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Salesforce.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-salesforce
     */
    readonly salesforce?: cdk.IResolvable | CfnFlow.SalesforceSourcePropertiesProperty;

    /**
     * The properties that are applied when using SAPOData as a flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-sapodata
     */
    readonly sapoData?: cdk.IResolvable | CfnFlow.SAPODataSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying ServiceNow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-servicenow
     */
    readonly serviceNow?: cdk.IResolvable | CfnFlow.ServiceNowSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Singular.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-singular
     */
    readonly singular?: cdk.IResolvable | CfnFlow.SingularSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Slack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-slack
     */
    readonly slack?: cdk.IResolvable | CfnFlow.SlackSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Trend Micro.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-trendmicro
     */
    readonly trendmicro?: cdk.IResolvable | CfnFlow.TrendmicroSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Veeva.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-veeva
     */
    readonly veeva?: cdk.IResolvable | CfnFlow.VeevaSourcePropertiesProperty;

    /**
     * Specifies the information that is required for querying Zendesk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-zendesk
     */
    readonly zendesk?: cdk.IResolvable | CfnFlow.ZendeskSourcePropertiesProperty;
  }

  /**
   * The properties that are applied when Amplitude is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-amplitudesourceproperties.html
   */
  export interface AmplitudeSourcePropertiesProperty {
    /**
     * The object specified in the Amplitude flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-amplitudesourceproperties.html#cfn-appflow-flow-amplitudesourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Amazon S3 is being used as the flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html
   */
  export interface S3SourcePropertiesProperty {
    /**
     * The Amazon S3 bucket name where the source files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-bucketname
     */
    readonly bucketName: string;

    /**
     * The object key for the Amazon S3 bucket in which the source files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-bucketprefix
     */
    readonly bucketPrefix: string;

    /**
     * When you use Amazon S3 as the source, the configuration format that you provide the flow input data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-s3inputformatconfig
     */
    readonly s3InputFormatConfig?: cdk.IResolvable | CfnFlow.S3InputFormatConfigProperty;
  }

  /**
   * When you use Amazon S3 as the source, the configuration format that you provide the flow input data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3inputformatconfig.html
   */
  export interface S3InputFormatConfigProperty {
    /**
     * The file type that Amazon AppFlow gets from your Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3inputformatconfig.html#cfn-appflow-flow-s3inputformatconfig-s3inputfiletype
     */
    readonly s3InputFileType?: string;
  }

  /**
   * The properties that are applied when Google Analytics is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-googleanalyticssourceproperties.html
   */
  export interface GoogleAnalyticsSourcePropertiesProperty {
    /**
     * The object specified in the Google Analytics flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-googleanalyticssourceproperties.html#cfn-appflow-flow-googleanalyticssourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when ServiceNow is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-servicenowsourceproperties.html
   */
  export interface ServiceNowSourcePropertiesProperty {
    /**
     * The object specified in the ServiceNow flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-servicenowsourceproperties.html#cfn-appflow-flow-servicenowsourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when the custom connector is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html
   */
  export interface CustomConnectorSourcePropertiesProperty {
    /**
     * Custom properties that are required to use the custom connector as a source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html#cfn-appflow-flow-customconnectorsourceproperties-customproperties
     */
    readonly customProperties?: cdk.IResolvable | Record<string, string>;

    /**
     * The API of the connector application that Amazon AppFlow uses to transfer your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html#cfn-appflow-flow-customconnectorsourceproperties-datatransferapi
     */
    readonly dataTransferApi?: CfnFlow.DataTransferApiProperty | cdk.IResolvable;

    /**
     * The entity specified in the custom connector as a source in the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html#cfn-appflow-flow-customconnectorsourceproperties-entityname
     */
    readonly entityName: string;
  }

  /**
   * The API of the connector application that Amazon AppFlow uses to transfer your data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datatransferapi.html
   */
  export interface DataTransferApiProperty {
    /**
     * The name of the connector application API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datatransferapi.html#cfn-appflow-flow-datatransferapi-name
     */
    readonly name: string;

    /**
     * You can specify one of the following types:.
     *
     * - **AUTOMATIC** - The default. Optimizes a flow for datasets that fluctuate in size from small to large. For each flow run, Amazon AppFlow chooses to use the SYNC or ASYNC API type based on the amount of data that the run transfers.
     * - **SYNC** - A synchronous API. This type of API optimizes a flow for small to medium-sized datasets.
     * - **ASYNC** - An asynchronous API. This type of API optimizes a flow for large datasets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datatransferapi.html#cfn-appflow-flow-datatransferapi-type
     */
    readonly type: string;
  }

  /**
   * The properties that are applied when using SAPOData as a flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html
   */
  export interface SAPODataSourcePropertiesProperty {
    /**
     * The object path specified in the SAPOData flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html#cfn-appflow-flow-sapodatasourceproperties-objectpath
     */
    readonly objectPath: string;

    /**
     * SAP Source connector page size.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html#cfn-appflow-flow-sapodatasourceproperties-paginationconfig
     */
    readonly paginationConfig?: cdk.IResolvable | CfnFlow.SAPODataPaginationConfigProperty;

    /**
     * SAP Source connector parallelism factor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html#cfn-appflow-flow-sapodatasourceproperties-parallelismconfig
     */
    readonly parallelismConfig?: cdk.IResolvable | CfnFlow.SAPODataParallelismConfigProperty;
  }

  /**
   * SAP Source connector page size.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatapaginationconfig.html
   */
  export interface SAPODataPaginationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatapaginationconfig.html#cfn-appflow-flow-sapodatapaginationconfig-maxpagesize
     */
    readonly maxPageSize: number;
  }

  /**
   * SAP Source connector parallelism factor.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodataparallelismconfig.html
   */
  export interface SAPODataParallelismConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodataparallelismconfig.html#cfn-appflow-flow-sapodataparallelismconfig-maxparallelism
     */
    readonly maxParallelism: number;
  }

  /**
   * The properties that are applied when Salesforce Pardot is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-pardotsourceproperties.html
   */
  export interface PardotSourcePropertiesProperty {
    /**
     * The object specified in the Salesforce Pardot flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-pardotsourceproperties.html#cfn-appflow-flow-pardotsourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when using Veeva as a flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html
   */
  export interface VeevaSourcePropertiesProperty {
    /**
     * The document type specified in the Veeva document extract flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-documenttype
     */
    readonly documentType?: string;

    /**
     * Boolean value to include All Versions of files in Veeva document extract flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includeallversions
     */
    readonly includeAllVersions?: boolean | cdk.IResolvable;

    /**
     * Boolean value to include file renditions in Veeva document extract flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includerenditions
     */
    readonly includeRenditions?: boolean | cdk.IResolvable;

    /**
     * Boolean value to include source files in Veeva document extract flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includesourcefiles
     */
    readonly includeSourceFiles?: boolean | cdk.IResolvable;

    /**
     * The object specified in the Veeva flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when using Trend Micro as a flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-trendmicrosourceproperties.html
   */
  export interface TrendmicroSourcePropertiesProperty {
    /**
     * The object specified in the Trend Micro flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-trendmicrosourceproperties.html#cfn-appflow-flow-trendmicrosourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Datadog is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datadogsourceproperties.html
   */
  export interface DatadogSourcePropertiesProperty {
    /**
     * The object specified in the Datadog flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datadogsourceproperties.html#cfn-appflow-flow-datadogsourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Marketo is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketosourceproperties.html
   */
  export interface MarketoSourcePropertiesProperty {
    /**
     * The object specified in the Marketo flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketosourceproperties.html#cfn-appflow-flow-marketosourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Singular is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-singularsourceproperties.html
   */
  export interface SingularSourcePropertiesProperty {
    /**
     * The object specified in the Singular flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-singularsourceproperties.html#cfn-appflow-flow-singularsourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Slack is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-slacksourceproperties.html
   */
  export interface SlackSourcePropertiesProperty {
    /**
     * The object specified in the Slack flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-slacksourceproperties.html#cfn-appflow-flow-slacksourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Dynatrace is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-dynatracesourceproperties.html
   */
  export interface DynatraceSourcePropertiesProperty {
    /**
     * The object specified in the Dynatrace flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-dynatracesourceproperties.html#cfn-appflow-flow-dynatracesourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when using Zendesk as a flow source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendesksourceproperties.html
   */
  export interface ZendeskSourcePropertiesProperty {
    /**
     * The object specified in the Zendesk flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendesksourceproperties.html#cfn-appflow-flow-zendesksourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Infor Nexus is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-infornexussourceproperties.html
   */
  export interface InforNexusSourcePropertiesProperty {
    /**
     * The object specified in the Infor Nexus flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-infornexussourceproperties.html#cfn-appflow-flow-infornexussourceproperties-object
     */
    readonly object: string;
  }

  /**
   * The properties that are applied when Salesforce is being used as a source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html
   */
  export interface SalesforceSourcePropertiesProperty {
    /**
     * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data from Salesforce.
     *
     * - **AUTOMATIC** - The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers from Salesforce. If your flow transfers fewer than 1,000,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0.
     *
     * Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900,000 records, and it might use Bulk API 2.0 on the next day to transfer 1,100,000 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields.
     *
     * By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.
     * - **BULKV2** - Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers.
     *
     * Note that Bulk API 2.0 does not transfer Salesforce compound fields.
     * - **REST_SYNC** - Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail wituh a timed out error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-datatransferapi
     */
    readonly dataTransferApi?: string;

    /**
     * The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-enabledynamicfieldupdate
     */
    readonly enableDynamicFieldUpdate?: boolean | cdk.IResolvable;

    /**
     * Indicates whether Amazon AppFlow includes deleted files in the flow run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-includedeletedrecords
     */
    readonly includeDeletedRecords?: boolean | cdk.IResolvable;

    /**
     * The object specified in the Salesforce flow source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-object
     */
    readonly object: string;
  }

  /**
   * Specifies the configuration used when importing incremental records from the source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-incrementalpullconfig.html
   */
  export interface IncrementalPullConfigProperty {
    /**
     * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-incrementalpullconfig.html#cfn-appflow-flow-incrementalpullconfig-datetimetypefieldname
     */
    readonly datetimeTypeFieldName?: string;
  }

  /**
   * Specifies the configuration that Amazon AppFlow uses when it catalogs your data.
   *
   * When Amazon AppFlow catalogs your data, it stores metadata in a data catalog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-metadatacatalogconfig.html
   */
  export interface MetadataCatalogConfigProperty {
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs your data with the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-metadatacatalogconfig.html#cfn-appflow-flow-metadatacatalogconfig-gluedatacatalog
     */
    readonly glueDataCatalog?: CfnFlow.GlueDataCatalogProperty | cdk.IResolvable;
  }

  /**
   * Trigger settings of the flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html
   */
  export interface GlueDataCatalogProperty {
    /**
     * A string containing the value for the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-databasename
     */
    readonly databaseName: string;

    /**
     * A string containing the value for the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-rolearn
     */
    readonly roleArn: string;

    /**
     * A string containing the value for the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-tableprefix
     */
    readonly tablePrefix: string;
  }
}

/**
 * Properties for defining a `CfnFlow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html
 */
export interface CfnFlowProps {
  /**
   * A user-entered description of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-description
   */
  readonly description?: string;

  /**
   * The configuration that controls how Amazon AppFlow places data in the destination connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-destinationflowconfiglist
   */
  readonly destinationFlowConfigList: Array<CfnFlow.DestinationFlowConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The specified name of the flow.
   *
   * Spaces are not allowed. Use underscores (_) or hyphens (-) only.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-flowname
   */
  readonly flowName: string;

  /**
   * Sets the status of the flow. You can specify one of the following values:.
   *
   * - **Active** - The flow runs based on the trigger settings that you defined. Active scheduled flows run as scheduled, and active event-triggered flows run when the specified change event occurs. However, active on-demand flows run only when you manually start them by using Amazon AppFlow.
   * - **Suspended** - You can use this option to deactivate an active flow. Scheduled and event-triggered flows will cease to run until you reactive them. This value only affects scheduled and event-triggered flows. It has no effect for on-demand flows.
   *
   * If you omit the FlowStatus parameter, Amazon AppFlow creates the flow with a default status. The default status for on-demand flows is Active. The default status for scheduled and event-triggered flows is Draft, which means they’re not yet active.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-flowstatus
   */
  readonly flowStatus?: string;

  /**
   * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption.
   *
   * This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-kmsarn
   */
  readonly kmsArn?: string;

  /**
   * Specifies the configuration that Amazon AppFlow uses when it catalogs your data.
   *
   * When Amazon AppFlow catalogs your data, it stores metadata in a data catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-metadatacatalogconfig
   */
  readonly metadataCatalogConfig?: cdk.IResolvable | CfnFlow.MetadataCatalogConfigProperty;

  /**
   * Contains information about the configuration of the source connector used in the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-sourceflowconfig
   */
  readonly sourceFlowConfig: cdk.IResolvable | CfnFlow.SourceFlowConfigProperty;

  /**
   * The tags used to organize, track, or control access for your flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of tasks that Amazon AppFlow performs while transferring the data in the flow run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tasks
   */
  readonly tasks: Array<cdk.IResolvable | CfnFlow.TaskProperty> | cdk.IResolvable;

  /**
   * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-triggerconfig
   */
  readonly triggerConfig: cdk.IResolvable | CfnFlow.TriggerConfigProperty;
}

/**
 * Determine whether the given properties match those of a `ConnectorOperatorProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectorOperatorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowConnectorOperatorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amplitude", cdk.validateString)(properties.amplitude));
  errors.collect(cdk.propertyValidator("customConnector", cdk.validateString)(properties.customConnector));
  errors.collect(cdk.propertyValidator("datadog", cdk.validateString)(properties.datadog));
  errors.collect(cdk.propertyValidator("dynatrace", cdk.validateString)(properties.dynatrace));
  errors.collect(cdk.propertyValidator("googleAnalytics", cdk.validateString)(properties.googleAnalytics));
  errors.collect(cdk.propertyValidator("inforNexus", cdk.validateString)(properties.inforNexus));
  errors.collect(cdk.propertyValidator("marketo", cdk.validateString)(properties.marketo));
  errors.collect(cdk.propertyValidator("pardot", cdk.validateString)(properties.pardot));
  errors.collect(cdk.propertyValidator("s3", cdk.validateString)(properties.s3));
  errors.collect(cdk.propertyValidator("sapoData", cdk.validateString)(properties.sapoData));
  errors.collect(cdk.propertyValidator("salesforce", cdk.validateString)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", cdk.validateString)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("singular", cdk.validateString)(properties.singular));
  errors.collect(cdk.propertyValidator("slack", cdk.validateString)(properties.slack));
  errors.collect(cdk.propertyValidator("trendmicro", cdk.validateString)(properties.trendmicro));
  errors.collect(cdk.propertyValidator("veeva", cdk.validateString)(properties.veeva));
  errors.collect(cdk.propertyValidator("zendesk", cdk.validateString)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"ConnectorOperatorProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowConnectorOperatorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowConnectorOperatorPropertyValidator(properties).assertSuccess();
  return {
    "Amplitude": cdk.stringToCloudFormation(properties.amplitude),
    "CustomConnector": cdk.stringToCloudFormation(properties.customConnector),
    "Datadog": cdk.stringToCloudFormation(properties.datadog),
    "Dynatrace": cdk.stringToCloudFormation(properties.dynatrace),
    "GoogleAnalytics": cdk.stringToCloudFormation(properties.googleAnalytics),
    "InforNexus": cdk.stringToCloudFormation(properties.inforNexus),
    "Marketo": cdk.stringToCloudFormation(properties.marketo),
    "Pardot": cdk.stringToCloudFormation(properties.pardot),
    "S3": cdk.stringToCloudFormation(properties.s3),
    "SAPOData": cdk.stringToCloudFormation(properties.sapoData),
    "Salesforce": cdk.stringToCloudFormation(properties.salesforce),
    "ServiceNow": cdk.stringToCloudFormation(properties.serviceNow),
    "Singular": cdk.stringToCloudFormation(properties.singular),
    "Slack": cdk.stringToCloudFormation(properties.slack),
    "Trendmicro": cdk.stringToCloudFormation(properties.trendmicro),
    "Veeva": cdk.stringToCloudFormation(properties.veeva),
    "Zendesk": cdk.stringToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnFlowConnectorOperatorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.ConnectorOperatorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ConnectorOperatorProperty>();
  ret.addPropertyResult("amplitude", "Amplitude", (properties.Amplitude != null ? cfn_parse.FromCloudFormation.getString(properties.Amplitude) : undefined));
  ret.addPropertyResult("customConnector", "CustomConnector", (properties.CustomConnector != null ? cfn_parse.FromCloudFormation.getString(properties.CustomConnector) : undefined));
  ret.addPropertyResult("datadog", "Datadog", (properties.Datadog != null ? cfn_parse.FromCloudFormation.getString(properties.Datadog) : undefined));
  ret.addPropertyResult("dynatrace", "Dynatrace", (properties.Dynatrace != null ? cfn_parse.FromCloudFormation.getString(properties.Dynatrace) : undefined));
  ret.addPropertyResult("googleAnalytics", "GoogleAnalytics", (properties.GoogleAnalytics != null ? cfn_parse.FromCloudFormation.getString(properties.GoogleAnalytics) : undefined));
  ret.addPropertyResult("inforNexus", "InforNexus", (properties.InforNexus != null ? cfn_parse.FromCloudFormation.getString(properties.InforNexus) : undefined));
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? cfn_parse.FromCloudFormation.getString(properties.Marketo) : undefined));
  ret.addPropertyResult("pardot", "Pardot", (properties.Pardot != null ? cfn_parse.FromCloudFormation.getString(properties.Pardot) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? cfn_parse.FromCloudFormation.getString(properties.S3) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? cfn_parse.FromCloudFormation.getString(properties.Salesforce) : undefined));
  ret.addPropertyResult("sapoData", "SAPOData", (properties.SAPOData != null ? cfn_parse.FromCloudFormation.getString(properties.SAPOData) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNow) : undefined));
  ret.addPropertyResult("singular", "Singular", (properties.Singular != null ? cfn_parse.FromCloudFormation.getString(properties.Singular) : undefined));
  ret.addPropertyResult("slack", "Slack", (properties.Slack != null ? cfn_parse.FromCloudFormation.getString(properties.Slack) : undefined));
  ret.addPropertyResult("trendmicro", "Trendmicro", (properties.Trendmicro != null ? cfn_parse.FromCloudFormation.getString(properties.Trendmicro) : undefined));
  ret.addPropertyResult("veeva", "Veeva", (properties.Veeva != null ? cfn_parse.FromCloudFormation.getString(properties.Veeva) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? cfn_parse.FromCloudFormation.getString(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskPropertiesObjectProperty`
 *
 * @param properties - the TypeScript properties of a `TaskPropertiesObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowTaskPropertiesObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TaskPropertiesObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowTaskPropertiesObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTaskPropertiesObjectPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFlowTaskPropertiesObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.TaskPropertiesObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.TaskPropertiesObjectProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskProperty`
 *
 * @param properties - the TypeScript properties of a `TaskProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowTaskPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorOperator", CfnFlowConnectorOperatorPropertyValidator)(properties.connectorOperator));
  errors.collect(cdk.propertyValidator("destinationField", cdk.validateString)(properties.destinationField));
  errors.collect(cdk.propertyValidator("sourceFields", cdk.requiredValidator)(properties.sourceFields));
  errors.collect(cdk.propertyValidator("sourceFields", cdk.listValidator(cdk.validateString))(properties.sourceFields));
  errors.collect(cdk.propertyValidator("taskProperties", cdk.listValidator(CfnFlowTaskPropertiesObjectPropertyValidator))(properties.taskProperties));
  errors.collect(cdk.propertyValidator("taskType", cdk.requiredValidator)(properties.taskType));
  errors.collect(cdk.propertyValidator("taskType", cdk.validateString)(properties.taskType));
  return errors.wrap("supplied properties not correct for \"TaskProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowTaskPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTaskPropertyValidator(properties).assertSuccess();
  return {
    "ConnectorOperator": convertCfnFlowConnectorOperatorPropertyToCloudFormation(properties.connectorOperator),
    "DestinationField": cdk.stringToCloudFormation(properties.destinationField),
    "SourceFields": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceFields),
    "TaskProperties": cdk.listMapper(convertCfnFlowTaskPropertiesObjectPropertyToCloudFormation)(properties.taskProperties),
    "TaskType": cdk.stringToCloudFormation(properties.taskType)
  };
}

// @ts-ignore TS6133
function CfnFlowTaskPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.TaskProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.TaskProperty>();
  ret.addPropertyResult("connectorOperator", "ConnectorOperator", (properties.ConnectorOperator != null ? CfnFlowConnectorOperatorPropertyFromCloudFormation(properties.ConnectorOperator) : undefined));
  ret.addPropertyResult("destinationField", "DestinationField", (properties.DestinationField != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationField) : undefined));
  ret.addPropertyResult("sourceFields", "SourceFields", (properties.SourceFields != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceFields) : undefined));
  ret.addPropertyResult("taskProperties", "TaskProperties", (properties.TaskProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnFlowTaskPropertiesObjectPropertyFromCloudFormation)(properties.TaskProperties) : undefined));
  ret.addPropertyResult("taskType", "TaskType", (properties.TaskType != null ? cfn_parse.FromCloudFormation.getString(properties.TaskType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduledTriggerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduledTriggerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowScheduledTriggerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataPullMode", cdk.validateString)(properties.dataPullMode));
  errors.collect(cdk.propertyValidator("firstExecutionFrom", cdk.validateNumber)(properties.firstExecutionFrom));
  errors.collect(cdk.propertyValidator("flowErrorDeactivationThreshold", cdk.validateNumber)(properties.flowErrorDeactivationThreshold));
  errors.collect(cdk.propertyValidator("scheduleEndTime", cdk.validateNumber)(properties.scheduleEndTime));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleOffset", cdk.validateNumber)(properties.scheduleOffset));
  errors.collect(cdk.propertyValidator("scheduleStartTime", cdk.validateNumber)(properties.scheduleStartTime));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  return errors.wrap("supplied properties not correct for \"ScheduledTriggerPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowScheduledTriggerPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowScheduledTriggerPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DataPullMode": cdk.stringToCloudFormation(properties.dataPullMode),
    "FirstExecutionFrom": cdk.numberToCloudFormation(properties.firstExecutionFrom),
    "FlowErrorDeactivationThreshold": cdk.numberToCloudFormation(properties.flowErrorDeactivationThreshold),
    "ScheduleEndTime": cdk.numberToCloudFormation(properties.scheduleEndTime),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "ScheduleOffset": cdk.numberToCloudFormation(properties.scheduleOffset),
    "ScheduleStartTime": cdk.numberToCloudFormation(properties.scheduleStartTime),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone)
  };
}

// @ts-ignore TS6133
function CfnFlowScheduledTriggerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.ScheduledTriggerPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ScheduledTriggerPropertiesProperty>();
  ret.addPropertyResult("dataPullMode", "DataPullMode", (properties.DataPullMode != null ? cfn_parse.FromCloudFormation.getString(properties.DataPullMode) : undefined));
  ret.addPropertyResult("firstExecutionFrom", "FirstExecutionFrom", (properties.FirstExecutionFrom != null ? cfn_parse.FromCloudFormation.getNumber(properties.FirstExecutionFrom) : undefined));
  ret.addPropertyResult("flowErrorDeactivationThreshold", "FlowErrorDeactivationThreshold", (properties.FlowErrorDeactivationThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.FlowErrorDeactivationThreshold) : undefined));
  ret.addPropertyResult("scheduleEndTime", "ScheduleEndTime", (properties.ScheduleEndTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleEndTime) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("scheduleOffset", "ScheduleOffset", (properties.ScheduleOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleOffset) : undefined));
  ret.addPropertyResult("scheduleStartTime", "ScheduleStartTime", (properties.ScheduleStartTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ScheduleStartTime) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
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
function CfnFlowTriggerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("triggerProperties", CfnFlowScheduledTriggerPropertiesPropertyValidator)(properties.triggerProperties));
  errors.collect(cdk.propertyValidator("triggerType", cdk.requiredValidator)(properties.triggerType));
  errors.collect(cdk.propertyValidator("triggerType", cdk.validateString)(properties.triggerType));
  return errors.wrap("supplied properties not correct for \"TriggerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowTriggerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTriggerConfigPropertyValidator(properties).assertSuccess();
  return {
    "TriggerProperties": convertCfnFlowScheduledTriggerPropertiesPropertyToCloudFormation(properties.triggerProperties),
    "TriggerType": cdk.stringToCloudFormation(properties.triggerType)
  };
}

// @ts-ignore TS6133
function CfnFlowTriggerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.TriggerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.TriggerConfigProperty>();
  ret.addPropertyResult("triggerProperties", "TriggerProperties", (properties.TriggerProperties != null ? CfnFlowScheduledTriggerPropertiesPropertyFromCloudFormation(properties.TriggerProperties) : undefined));
  ret.addPropertyResult("triggerType", "TriggerType", (properties.TriggerType != null ? cfn_parse.FromCloudFormation.getString(properties.TriggerType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrefixConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PrefixConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowPrefixConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pathPrefixHierarchy", cdk.listValidator(cdk.validateString))(properties.pathPrefixHierarchy));
  errors.collect(cdk.propertyValidator("prefixFormat", cdk.validateString)(properties.prefixFormat));
  errors.collect(cdk.propertyValidator("prefixType", cdk.validateString)(properties.prefixType));
  return errors.wrap("supplied properties not correct for \"PrefixConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowPrefixConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowPrefixConfigPropertyValidator(properties).assertSuccess();
  return {
    "PathPrefixHierarchy": cdk.listMapper(cdk.stringToCloudFormation)(properties.pathPrefixHierarchy),
    "PrefixFormat": cdk.stringToCloudFormation(properties.prefixFormat),
    "PrefixType": cdk.stringToCloudFormation(properties.prefixType)
  };
}

// @ts-ignore TS6133
function CfnFlowPrefixConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.PrefixConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.PrefixConfigProperty>();
  ret.addPropertyResult("pathPrefixHierarchy", "PathPrefixHierarchy", (properties.PathPrefixHierarchy != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PathPrefixHierarchy) : undefined));
  ret.addPropertyResult("prefixFormat", "PrefixFormat", (properties.PrefixFormat != null ? cfn_parse.FromCloudFormation.getString(properties.PrefixFormat) : undefined));
  ret.addPropertyResult("prefixType", "PrefixType", (properties.PrefixType != null ? cfn_parse.FromCloudFormation.getString(properties.PrefixType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AggregationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AggregationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowAggregationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationType", cdk.validateString)(properties.aggregationType));
  errors.collect(cdk.propertyValidator("targetFileSize", cdk.validateNumber)(properties.targetFileSize));
  return errors.wrap("supplied properties not correct for \"AggregationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowAggregationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowAggregationConfigPropertyValidator(properties).assertSuccess();
  return {
    "AggregationType": cdk.stringToCloudFormation(properties.aggregationType),
    "TargetFileSize": cdk.numberToCloudFormation(properties.targetFileSize)
  };
}

// @ts-ignore TS6133
function CfnFlowAggregationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.AggregationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.AggregationConfigProperty>();
  ret.addPropertyResult("aggregationType", "AggregationType", (properties.AggregationType != null ? cfn_parse.FromCloudFormation.getString(properties.AggregationType) : undefined));
  ret.addPropertyResult("targetFileSize", "TargetFileSize", (properties.TargetFileSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetFileSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3OutputFormatConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3OutputFormatConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowS3OutputFormatConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationConfig", CfnFlowAggregationConfigPropertyValidator)(properties.aggregationConfig));
  errors.collect(cdk.propertyValidator("fileType", cdk.validateString)(properties.fileType));
  errors.collect(cdk.propertyValidator("prefixConfig", CfnFlowPrefixConfigPropertyValidator)(properties.prefixConfig));
  errors.collect(cdk.propertyValidator("preserveSourceDataTyping", cdk.validateBoolean)(properties.preserveSourceDataTyping));
  return errors.wrap("supplied properties not correct for \"S3OutputFormatConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowS3OutputFormatConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowS3OutputFormatConfigPropertyValidator(properties).assertSuccess();
  return {
    "AggregationConfig": convertCfnFlowAggregationConfigPropertyToCloudFormation(properties.aggregationConfig),
    "FileType": cdk.stringToCloudFormation(properties.fileType),
    "PrefixConfig": convertCfnFlowPrefixConfigPropertyToCloudFormation(properties.prefixConfig),
    "PreserveSourceDataTyping": cdk.booleanToCloudFormation(properties.preserveSourceDataTyping)
  };
}

// @ts-ignore TS6133
function CfnFlowS3OutputFormatConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.S3OutputFormatConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.S3OutputFormatConfigProperty>();
  ret.addPropertyResult("aggregationConfig", "AggregationConfig", (properties.AggregationConfig != null ? CfnFlowAggregationConfigPropertyFromCloudFormation(properties.AggregationConfig) : undefined));
  ret.addPropertyResult("fileType", "FileType", (properties.FileType != null ? cfn_parse.FromCloudFormation.getString(properties.FileType) : undefined));
  ret.addPropertyResult("prefixConfig", "PrefixConfig", (properties.PrefixConfig != null ? CfnFlowPrefixConfigPropertyFromCloudFormation(properties.PrefixConfig) : undefined));
  ret.addPropertyResult("preserveSourceDataTyping", "PreserveSourceDataTyping", (properties.PreserveSourceDataTyping != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PreserveSourceDataTyping) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3DestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowS3DestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("s3OutputFormatConfig", CfnFlowS3OutputFormatConfigPropertyValidator)(properties.s3OutputFormatConfig));
  return errors.wrap("supplied properties not correct for \"S3DestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowS3DestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowS3DestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "S3OutputFormatConfig": convertCfnFlowS3OutputFormatConfigPropertyToCloudFormation(properties.s3OutputFormatConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowS3DestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.S3DestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.S3DestinationPropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("s3OutputFormatConfig", "S3OutputFormatConfig", (properties.S3OutputFormatConfig != null ? CfnFlowS3OutputFormatConfigPropertyFromCloudFormation(properties.S3OutputFormatConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ErrorHandlingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorHandlingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowErrorHandlingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("failOnFirstError", cdk.validateBoolean)(properties.failOnFirstError));
  return errors.wrap("supplied properties not correct for \"ErrorHandlingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowErrorHandlingConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "FailOnFirstError": cdk.booleanToCloudFormation(properties.failOnFirstError)
  };
}

// @ts-ignore TS6133
function CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ErrorHandlingConfigProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("failOnFirstError", "FailOnFirstError", (properties.FailOnFirstError != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailOnFirstError) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomConnectorDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `CustomConnectorDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowCustomConnectorDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customProperties", cdk.hashValidator(cdk.validateString))(properties.customProperties));
  errors.collect(cdk.propertyValidator("entityName", cdk.requiredValidator)(properties.entityName));
  errors.collect(cdk.propertyValidator("entityName", cdk.validateString)(properties.entityName));
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("idFieldNames", cdk.listValidator(cdk.validateString))(properties.idFieldNames));
  errors.collect(cdk.propertyValidator("writeOperationType", cdk.validateString)(properties.writeOperationType));
  return errors.wrap("supplied properties not correct for \"CustomConnectorDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowCustomConnectorDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowCustomConnectorDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "CustomProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.customProperties),
    "EntityName": cdk.stringToCloudFormation(properties.entityName),
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IdFieldNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.idFieldNames),
    "WriteOperationType": cdk.stringToCloudFormation(properties.writeOperationType)
  };
}

// @ts-ignore TS6133
function CfnFlowCustomConnectorDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.CustomConnectorDestinationPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.CustomConnectorDestinationPropertiesProperty>();
  ret.addPropertyResult("customProperties", "CustomProperties", (properties.CustomProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.CustomProperties) : undefined));
  ret.addPropertyResult("entityName", "EntityName", (properties.EntityName != null ? cfn_parse.FromCloudFormation.getString(properties.EntityName) : undefined));
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("idFieldNames", "IdFieldNames", (properties.IdFieldNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdFieldNames) : undefined));
  ret.addPropertyResult("writeOperationType", "WriteOperationType", (properties.WriteOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.WriteOperationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UpsolverS3OutputFormatConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UpsolverS3OutputFormatConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowUpsolverS3OutputFormatConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationConfig", CfnFlowAggregationConfigPropertyValidator)(properties.aggregationConfig));
  errors.collect(cdk.propertyValidator("fileType", cdk.validateString)(properties.fileType));
  errors.collect(cdk.propertyValidator("prefixConfig", cdk.requiredValidator)(properties.prefixConfig));
  errors.collect(cdk.propertyValidator("prefixConfig", CfnFlowPrefixConfigPropertyValidator)(properties.prefixConfig));
  return errors.wrap("supplied properties not correct for \"UpsolverS3OutputFormatConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowUpsolverS3OutputFormatConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowUpsolverS3OutputFormatConfigPropertyValidator(properties).assertSuccess();
  return {
    "AggregationConfig": convertCfnFlowAggregationConfigPropertyToCloudFormation(properties.aggregationConfig),
    "FileType": cdk.stringToCloudFormation(properties.fileType),
    "PrefixConfig": convertCfnFlowPrefixConfigPropertyToCloudFormation(properties.prefixConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowUpsolverS3OutputFormatConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.UpsolverS3OutputFormatConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.UpsolverS3OutputFormatConfigProperty>();
  ret.addPropertyResult("aggregationConfig", "AggregationConfig", (properties.AggregationConfig != null ? CfnFlowAggregationConfigPropertyFromCloudFormation(properties.AggregationConfig) : undefined));
  ret.addPropertyResult("fileType", "FileType", (properties.FileType != null ? cfn_parse.FromCloudFormation.getString(properties.FileType) : undefined));
  ret.addPropertyResult("prefixConfig", "PrefixConfig", (properties.PrefixConfig != null ? CfnFlowPrefixConfigPropertyFromCloudFormation(properties.PrefixConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UpsolverDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `UpsolverDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowUpsolverDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("s3OutputFormatConfig", cdk.requiredValidator)(properties.s3OutputFormatConfig));
  errors.collect(cdk.propertyValidator("s3OutputFormatConfig", CfnFlowUpsolverS3OutputFormatConfigPropertyValidator)(properties.s3OutputFormatConfig));
  return errors.wrap("supplied properties not correct for \"UpsolverDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowUpsolverDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowUpsolverDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "S3OutputFormatConfig": convertCfnFlowUpsolverS3OutputFormatConfigPropertyToCloudFormation(properties.s3OutputFormatConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowUpsolverDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.UpsolverDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.UpsolverDestinationPropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("s3OutputFormatConfig", "S3OutputFormatConfig", (properties.S3OutputFormatConfig != null ? CfnFlowUpsolverS3OutputFormatConfigPropertyFromCloudFormation(properties.S3OutputFormatConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SuccessResponseHandlingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SuccessResponseHandlingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSuccessResponseHandlingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  return errors.wrap("supplied properties not correct for \"SuccessResponseHandlingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSuccessResponseHandlingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSuccessResponseHandlingConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix)
  };
}

// @ts-ignore TS6133
function CfnFlowSuccessResponseHandlingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SuccessResponseHandlingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SuccessResponseHandlingConfigProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSAPODataDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("idFieldNames", cdk.listValidator(cdk.validateString))(properties.idFieldNames));
  errors.collect(cdk.propertyValidator("objectPath", cdk.requiredValidator)(properties.objectPath));
  errors.collect(cdk.propertyValidator("objectPath", cdk.validateString)(properties.objectPath));
  errors.collect(cdk.propertyValidator("successResponseHandlingConfig", CfnFlowSuccessResponseHandlingConfigPropertyValidator)(properties.successResponseHandlingConfig));
  errors.collect(cdk.propertyValidator("writeOperationType", cdk.validateString)(properties.writeOperationType));
  return errors.wrap("supplied properties not correct for \"SAPODataDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSAPODataDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSAPODataDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IdFieldNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.idFieldNames),
    "ObjectPath": cdk.stringToCloudFormation(properties.objectPath),
    "SuccessResponseHandlingConfig": convertCfnFlowSuccessResponseHandlingConfigPropertyToCloudFormation(properties.successResponseHandlingConfig),
    "WriteOperationType": cdk.stringToCloudFormation(properties.writeOperationType)
  };
}

// @ts-ignore TS6133
function CfnFlowSAPODataDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SAPODataDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SAPODataDestinationPropertiesProperty>();
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("idFieldNames", "IdFieldNames", (properties.IdFieldNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdFieldNames) : undefined));
  ret.addPropertyResult("objectPath", "ObjectPath", (properties.ObjectPath != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectPath) : undefined));
  ret.addPropertyResult("successResponseHandlingConfig", "SuccessResponseHandlingConfig", (properties.SuccessResponseHandlingConfig != null ? CfnFlowSuccessResponseHandlingConfigPropertyFromCloudFormation(properties.SuccessResponseHandlingConfig) : undefined));
  ret.addPropertyResult("writeOperationType", "WriteOperationType", (properties.WriteOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.WriteOperationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnowflakeDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SnowflakeDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSnowflakeDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("intermediateBucketName", cdk.requiredValidator)(properties.intermediateBucketName));
  errors.collect(cdk.propertyValidator("intermediateBucketName", cdk.validateString)(properties.intermediateBucketName));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"SnowflakeDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSnowflakeDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSnowflakeDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IntermediateBucketName": cdk.stringToCloudFormation(properties.intermediateBucketName),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowSnowflakeDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SnowflakeDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SnowflakeDestinationPropertiesProperty>();
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("intermediateBucketName", "IntermediateBucketName", (properties.IntermediateBucketName != null ? cfn_parse.FromCloudFormation.getString(properties.IntermediateBucketName) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LookoutMetricsDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `LookoutMetricsDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowLookoutMetricsDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"LookoutMetricsDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowLookoutMetricsDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowLookoutMetricsDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowLookoutMetricsDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.LookoutMetricsDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.LookoutMetricsDestinationPropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowEventBridgeDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"EventBridgeDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowEventBridgeDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowEventBridgeDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowEventBridgeDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.EventBridgeDestinationPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.EventBridgeDestinationPropertiesProperty>();
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZendeskDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowZendeskDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("idFieldNames", cdk.listValidator(cdk.validateString))(properties.idFieldNames));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  errors.collect(cdk.propertyValidator("writeOperationType", cdk.validateString)(properties.writeOperationType));
  return errors.wrap("supplied properties not correct for \"ZendeskDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowZendeskDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowZendeskDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IdFieldNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.idFieldNames),
    "Object": cdk.stringToCloudFormation(properties.object),
    "WriteOperationType": cdk.stringToCloudFormation(properties.writeOperationType)
  };
}

// @ts-ignore TS6133
function CfnFlowZendeskDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.ZendeskDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ZendeskDestinationPropertiesProperty>();
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("idFieldNames", "IdFieldNames", (properties.IdFieldNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdFieldNames) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addPropertyResult("writeOperationType", "WriteOperationType", (properties.WriteOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.WriteOperationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MarketoDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowMarketoDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"MarketoDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowMarketoDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowMarketoDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowMarketoDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.MarketoDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.MarketoDestinationPropertiesProperty>();
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowRedshiftDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("intermediateBucketName", cdk.requiredValidator)(properties.intermediateBucketName));
  errors.collect(cdk.propertyValidator("intermediateBucketName", cdk.validateString)(properties.intermediateBucketName));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"RedshiftDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowRedshiftDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowRedshiftDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IntermediateBucketName": cdk.stringToCloudFormation(properties.intermediateBucketName),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowRedshiftDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.RedshiftDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.RedshiftDestinationPropertiesProperty>();
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("intermediateBucketName", "IntermediateBucketName", (properties.IntermediateBucketName != null ? cfn_parse.FromCloudFormation.getString(properties.IntermediateBucketName) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceDestinationPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceDestinationPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSalesforceDestinationPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTransferApi", cdk.validateString)(properties.dataTransferApi));
  errors.collect(cdk.propertyValidator("errorHandlingConfig", CfnFlowErrorHandlingConfigPropertyValidator)(properties.errorHandlingConfig));
  errors.collect(cdk.propertyValidator("idFieldNames", cdk.listValidator(cdk.validateString))(properties.idFieldNames));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  errors.collect(cdk.propertyValidator("writeOperationType", cdk.validateString)(properties.writeOperationType));
  return errors.wrap("supplied properties not correct for \"SalesforceDestinationPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSalesforceDestinationPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSalesforceDestinationPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DataTransferApi": cdk.stringToCloudFormation(properties.dataTransferApi),
    "ErrorHandlingConfig": convertCfnFlowErrorHandlingConfigPropertyToCloudFormation(properties.errorHandlingConfig),
    "IdFieldNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.idFieldNames),
    "Object": cdk.stringToCloudFormation(properties.object),
    "WriteOperationType": cdk.stringToCloudFormation(properties.writeOperationType)
  };
}

// @ts-ignore TS6133
function CfnFlowSalesforceDestinationPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SalesforceDestinationPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SalesforceDestinationPropertiesProperty>();
  ret.addPropertyResult("dataTransferApi", "DataTransferApi", (properties.DataTransferApi != null ? cfn_parse.FromCloudFormation.getString(properties.DataTransferApi) : undefined));
  ret.addPropertyResult("errorHandlingConfig", "ErrorHandlingConfig", (properties.ErrorHandlingConfig != null ? CfnFlowErrorHandlingConfigPropertyFromCloudFormation(properties.ErrorHandlingConfig) : undefined));
  ret.addPropertyResult("idFieldNames", "IdFieldNames", (properties.IdFieldNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdFieldNames) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addPropertyResult("writeOperationType", "WriteOperationType", (properties.WriteOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.WriteOperationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationConnectorPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConnectorPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowDestinationConnectorPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customConnector", CfnFlowCustomConnectorDestinationPropertiesPropertyValidator)(properties.customConnector));
  errors.collect(cdk.propertyValidator("eventBridge", CfnFlowEventBridgeDestinationPropertiesPropertyValidator)(properties.eventBridge));
  errors.collect(cdk.propertyValidator("lookoutMetrics", CfnFlowLookoutMetricsDestinationPropertiesPropertyValidator)(properties.lookoutMetrics));
  errors.collect(cdk.propertyValidator("marketo", CfnFlowMarketoDestinationPropertiesPropertyValidator)(properties.marketo));
  errors.collect(cdk.propertyValidator("redshift", CfnFlowRedshiftDestinationPropertiesPropertyValidator)(properties.redshift));
  errors.collect(cdk.propertyValidator("s3", CfnFlowS3DestinationPropertiesPropertyValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("sapoData", CfnFlowSAPODataDestinationPropertiesPropertyValidator)(properties.sapoData));
  errors.collect(cdk.propertyValidator("salesforce", CfnFlowSalesforceDestinationPropertiesPropertyValidator)(properties.salesforce));
  errors.collect(cdk.propertyValidator("snowflake", CfnFlowSnowflakeDestinationPropertiesPropertyValidator)(properties.snowflake));
  errors.collect(cdk.propertyValidator("upsolver", CfnFlowUpsolverDestinationPropertiesPropertyValidator)(properties.upsolver));
  errors.collect(cdk.propertyValidator("zendesk", CfnFlowZendeskDestinationPropertiesPropertyValidator)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"DestinationConnectorPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowDestinationConnectorPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowDestinationConnectorPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "CustomConnector": convertCfnFlowCustomConnectorDestinationPropertiesPropertyToCloudFormation(properties.customConnector),
    "EventBridge": convertCfnFlowEventBridgeDestinationPropertiesPropertyToCloudFormation(properties.eventBridge),
    "LookoutMetrics": convertCfnFlowLookoutMetricsDestinationPropertiesPropertyToCloudFormation(properties.lookoutMetrics),
    "Marketo": convertCfnFlowMarketoDestinationPropertiesPropertyToCloudFormation(properties.marketo),
    "Redshift": convertCfnFlowRedshiftDestinationPropertiesPropertyToCloudFormation(properties.redshift),
    "S3": convertCfnFlowS3DestinationPropertiesPropertyToCloudFormation(properties.s3),
    "SAPOData": convertCfnFlowSAPODataDestinationPropertiesPropertyToCloudFormation(properties.sapoData),
    "Salesforce": convertCfnFlowSalesforceDestinationPropertiesPropertyToCloudFormation(properties.salesforce),
    "Snowflake": convertCfnFlowSnowflakeDestinationPropertiesPropertyToCloudFormation(properties.snowflake),
    "Upsolver": convertCfnFlowUpsolverDestinationPropertiesPropertyToCloudFormation(properties.upsolver),
    "Zendesk": convertCfnFlowZendeskDestinationPropertiesPropertyToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnFlowDestinationConnectorPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.DestinationConnectorPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.DestinationConnectorPropertiesProperty>();
  ret.addPropertyResult("customConnector", "CustomConnector", (properties.CustomConnector != null ? CfnFlowCustomConnectorDestinationPropertiesPropertyFromCloudFormation(properties.CustomConnector) : undefined));
  ret.addPropertyResult("eventBridge", "EventBridge", (properties.EventBridge != null ? CfnFlowEventBridgeDestinationPropertiesPropertyFromCloudFormation(properties.EventBridge) : undefined));
  ret.addPropertyResult("lookoutMetrics", "LookoutMetrics", (properties.LookoutMetrics != null ? CfnFlowLookoutMetricsDestinationPropertiesPropertyFromCloudFormation(properties.LookoutMetrics) : undefined));
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? CfnFlowMarketoDestinationPropertiesPropertyFromCloudFormation(properties.Marketo) : undefined));
  ret.addPropertyResult("redshift", "Redshift", (properties.Redshift != null ? CfnFlowRedshiftDestinationPropertiesPropertyFromCloudFormation(properties.Redshift) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnFlowS3DestinationPropertiesPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? CfnFlowSalesforceDestinationPropertiesPropertyFromCloudFormation(properties.Salesforce) : undefined));
  ret.addPropertyResult("sapoData", "SAPOData", (properties.SAPOData != null ? CfnFlowSAPODataDestinationPropertiesPropertyFromCloudFormation(properties.SAPOData) : undefined));
  ret.addPropertyResult("snowflake", "Snowflake", (properties.Snowflake != null ? CfnFlowSnowflakeDestinationPropertiesPropertyFromCloudFormation(properties.Snowflake) : undefined));
  ret.addPropertyResult("upsolver", "Upsolver", (properties.Upsolver != null ? CfnFlowUpsolverDestinationPropertiesPropertyFromCloudFormation(properties.Upsolver) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? CfnFlowZendeskDestinationPropertiesPropertyFromCloudFormation(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowDestinationFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiVersion", cdk.validateString)(properties.apiVersion));
  errors.collect(cdk.propertyValidator("connectorProfileName", cdk.validateString)(properties.connectorProfileName));
  errors.collect(cdk.propertyValidator("connectorType", cdk.requiredValidator)(properties.connectorType));
  errors.collect(cdk.propertyValidator("connectorType", cdk.validateString)(properties.connectorType));
  errors.collect(cdk.propertyValidator("destinationConnectorProperties", cdk.requiredValidator)(properties.destinationConnectorProperties));
  errors.collect(cdk.propertyValidator("destinationConnectorProperties", CfnFlowDestinationConnectorPropertiesPropertyValidator)(properties.destinationConnectorProperties));
  return errors.wrap("supplied properties not correct for \"DestinationFlowConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowDestinationFlowConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowDestinationFlowConfigPropertyValidator(properties).assertSuccess();
  return {
    "ApiVersion": cdk.stringToCloudFormation(properties.apiVersion),
    "ConnectorProfileName": cdk.stringToCloudFormation(properties.connectorProfileName),
    "ConnectorType": cdk.stringToCloudFormation(properties.connectorType),
    "DestinationConnectorProperties": convertCfnFlowDestinationConnectorPropertiesPropertyToCloudFormation(properties.destinationConnectorProperties)
  };
}

// @ts-ignore TS6133
function CfnFlowDestinationFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.DestinationFlowConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.DestinationFlowConfigProperty>();
  ret.addPropertyResult("apiVersion", "ApiVersion", (properties.ApiVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ApiVersion) : undefined));
  ret.addPropertyResult("connectorProfileName", "ConnectorProfileName", (properties.ConnectorProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProfileName) : undefined));
  ret.addPropertyResult("connectorType", "ConnectorType", (properties.ConnectorType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorType) : undefined));
  ret.addPropertyResult("destinationConnectorProperties", "DestinationConnectorProperties", (properties.DestinationConnectorProperties != null ? CfnFlowDestinationConnectorPropertiesPropertyFromCloudFormation(properties.DestinationConnectorProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmplitudeSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `AmplitudeSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowAmplitudeSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"AmplitudeSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowAmplitudeSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowAmplitudeSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowAmplitudeSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.AmplitudeSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.AmplitudeSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3InputFormatConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3InputFormatConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowS3InputFormatConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3InputFileType", cdk.validateString)(properties.s3InputFileType));
  return errors.wrap("supplied properties not correct for \"S3InputFormatConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowS3InputFormatConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowS3InputFormatConfigPropertyValidator(properties).assertSuccess();
  return {
    "S3InputFileType": cdk.stringToCloudFormation(properties.s3InputFileType)
  };
}

// @ts-ignore TS6133
function CfnFlowS3InputFormatConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.S3InputFormatConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.S3InputFormatConfigProperty>();
  ret.addPropertyResult("s3InputFileType", "S3InputFileType", (properties.S3InputFileType != null ? cfn_parse.FromCloudFormation.getString(properties.S3InputFileType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3SourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `S3SourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowS3SourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.requiredValidator)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("s3InputFormatConfig", CfnFlowS3InputFormatConfigPropertyValidator)(properties.s3InputFormatConfig));
  return errors.wrap("supplied properties not correct for \"S3SourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowS3SourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowS3SourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "S3InputFormatConfig": convertCfnFlowS3InputFormatConfigPropertyToCloudFormation(properties.s3InputFormatConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowS3SourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.S3SourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.S3SourcePropertiesProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("s3InputFormatConfig", "S3InputFormatConfig", (properties.S3InputFormatConfig != null ? CfnFlowS3InputFormatConfigPropertyFromCloudFormation(properties.S3InputFormatConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GoogleAnalyticsSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `GoogleAnalyticsSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowGoogleAnalyticsSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"GoogleAnalyticsSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowGoogleAnalyticsSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowGoogleAnalyticsSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowGoogleAnalyticsSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.GoogleAnalyticsSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.GoogleAnalyticsSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowServiceNowSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"ServiceNowSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowServiceNowSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowServiceNowSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowServiceNowSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.ServiceNowSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ServiceNowSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataTransferApiProperty`
 *
 * @param properties - the TypeScript properties of a `DataTransferApiProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowDataTransferApiPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DataTransferApiProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowDataTransferApiPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowDataTransferApiPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFlowDataTransferApiPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.DataTransferApiProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.DataTransferApiProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomConnectorSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `CustomConnectorSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowCustomConnectorSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customProperties", cdk.hashValidator(cdk.validateString))(properties.customProperties));
  errors.collect(cdk.propertyValidator("dataTransferApi", CfnFlowDataTransferApiPropertyValidator)(properties.dataTransferApi));
  errors.collect(cdk.propertyValidator("entityName", cdk.requiredValidator)(properties.entityName));
  errors.collect(cdk.propertyValidator("entityName", cdk.validateString)(properties.entityName));
  return errors.wrap("supplied properties not correct for \"CustomConnectorSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowCustomConnectorSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowCustomConnectorSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "CustomProperties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.customProperties),
    "DataTransferApi": convertCfnFlowDataTransferApiPropertyToCloudFormation(properties.dataTransferApi),
    "EntityName": cdk.stringToCloudFormation(properties.entityName)
  };
}

// @ts-ignore TS6133
function CfnFlowCustomConnectorSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.CustomConnectorSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.CustomConnectorSourcePropertiesProperty>();
  ret.addPropertyResult("customProperties", "CustomProperties", (properties.CustomProperties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.CustomProperties) : undefined));
  ret.addPropertyResult("dataTransferApi", "DataTransferApi", (properties.DataTransferApi != null ? CfnFlowDataTransferApiPropertyFromCloudFormation(properties.DataTransferApi) : undefined));
  ret.addPropertyResult("entityName", "EntityName", (properties.EntityName != null ? cfn_parse.FromCloudFormation.getString(properties.EntityName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataPaginationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataPaginationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSAPODataPaginationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxPageSize", cdk.requiredValidator)(properties.maxPageSize));
  errors.collect(cdk.propertyValidator("maxPageSize", cdk.validateNumber)(properties.maxPageSize));
  return errors.wrap("supplied properties not correct for \"SAPODataPaginationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSAPODataPaginationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSAPODataPaginationConfigPropertyValidator(properties).assertSuccess();
  return {
    "maxPageSize": cdk.numberToCloudFormation(properties.maxPageSize)
  };
}

// @ts-ignore TS6133
function CfnFlowSAPODataPaginationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SAPODataPaginationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SAPODataPaginationConfigProperty>();
  ret.addPropertyResult("maxPageSize", "maxPageSize", (properties.maxPageSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.maxPageSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataParallelismConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataParallelismConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSAPODataParallelismConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxParallelism", cdk.requiredValidator)(properties.maxParallelism));
  errors.collect(cdk.propertyValidator("maxParallelism", cdk.validateNumber)(properties.maxParallelism));
  return errors.wrap("supplied properties not correct for \"SAPODataParallelismConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSAPODataParallelismConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSAPODataParallelismConfigPropertyValidator(properties).assertSuccess();
  return {
    "maxParallelism": cdk.numberToCloudFormation(properties.maxParallelism)
  };
}

// @ts-ignore TS6133
function CfnFlowSAPODataParallelismConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SAPODataParallelismConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SAPODataParallelismConfigProperty>();
  ret.addPropertyResult("maxParallelism", "maxParallelism", (properties.maxParallelism != null ? cfn_parse.FromCloudFormation.getNumber(properties.maxParallelism) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAPODataSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SAPODataSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSAPODataSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("objectPath", cdk.requiredValidator)(properties.objectPath));
  errors.collect(cdk.propertyValidator("objectPath", cdk.validateString)(properties.objectPath));
  errors.collect(cdk.propertyValidator("paginationConfig", CfnFlowSAPODataPaginationConfigPropertyValidator)(properties.paginationConfig));
  errors.collect(cdk.propertyValidator("parallelismConfig", CfnFlowSAPODataParallelismConfigPropertyValidator)(properties.parallelismConfig));
  return errors.wrap("supplied properties not correct for \"SAPODataSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSAPODataSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSAPODataSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "ObjectPath": cdk.stringToCloudFormation(properties.objectPath),
    "paginationConfig": convertCfnFlowSAPODataPaginationConfigPropertyToCloudFormation(properties.paginationConfig),
    "parallelismConfig": convertCfnFlowSAPODataParallelismConfigPropertyToCloudFormation(properties.parallelismConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowSAPODataSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SAPODataSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SAPODataSourcePropertiesProperty>();
  ret.addPropertyResult("objectPath", "ObjectPath", (properties.ObjectPath != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectPath) : undefined));
  ret.addPropertyResult("paginationConfig", "paginationConfig", (properties.paginationConfig != null ? CfnFlowSAPODataPaginationConfigPropertyFromCloudFormation(properties.paginationConfig) : undefined));
  ret.addPropertyResult("parallelismConfig", "parallelismConfig", (properties.parallelismConfig != null ? CfnFlowSAPODataParallelismConfigPropertyFromCloudFormation(properties.parallelismConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PardotSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `PardotSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowPardotSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"PardotSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowPardotSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowPardotSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowPardotSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.PardotSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.PardotSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VeevaSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `VeevaSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowVeevaSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentType", cdk.validateString)(properties.documentType));
  errors.collect(cdk.propertyValidator("includeAllVersions", cdk.validateBoolean)(properties.includeAllVersions));
  errors.collect(cdk.propertyValidator("includeRenditions", cdk.validateBoolean)(properties.includeRenditions));
  errors.collect(cdk.propertyValidator("includeSourceFiles", cdk.validateBoolean)(properties.includeSourceFiles));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"VeevaSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowVeevaSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowVeevaSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DocumentType": cdk.stringToCloudFormation(properties.documentType),
    "IncludeAllVersions": cdk.booleanToCloudFormation(properties.includeAllVersions),
    "IncludeRenditions": cdk.booleanToCloudFormation(properties.includeRenditions),
    "IncludeSourceFiles": cdk.booleanToCloudFormation(properties.includeSourceFiles),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowVeevaSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.VeevaSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.VeevaSourcePropertiesProperty>();
  ret.addPropertyResult("documentType", "DocumentType", (properties.DocumentType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentType) : undefined));
  ret.addPropertyResult("includeAllVersions", "IncludeAllVersions", (properties.IncludeAllVersions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeAllVersions) : undefined));
  ret.addPropertyResult("includeRenditions", "IncludeRenditions", (properties.IncludeRenditions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeRenditions) : undefined));
  ret.addPropertyResult("includeSourceFiles", "IncludeSourceFiles", (properties.IncludeSourceFiles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSourceFiles) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrendmicroSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `TrendmicroSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowTrendmicroSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"TrendmicroSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowTrendmicroSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowTrendmicroSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowTrendmicroSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.TrendmicroSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.TrendmicroSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatadogSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `DatadogSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowDatadogSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"DatadogSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowDatadogSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowDatadogSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowDatadogSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.DatadogSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.DatadogSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MarketoSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MarketoSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowMarketoSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"MarketoSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowMarketoSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowMarketoSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowMarketoSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.MarketoSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.MarketoSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingularSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SingularSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSingularSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"SingularSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSingularSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSingularSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowSingularSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SingularSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SingularSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlackSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SlackSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSlackSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"SlackSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSlackSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSlackSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowSlackSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SlackSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SlackSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynatraceSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `DynatraceSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowDynatraceSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"DynatraceSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowDynatraceSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowDynatraceSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowDynatraceSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.DynatraceSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.DynatraceSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZendeskSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ZendeskSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowZendeskSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"ZendeskSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowZendeskSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowZendeskSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowZendeskSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.ZendeskSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.ZendeskSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InforNexusSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `InforNexusSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowInforNexusSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"InforNexusSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowInforNexusSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowInforNexusSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowInforNexusSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.InforNexusSourcePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.InforNexusSourcePropertiesProperty>();
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceSourcePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceSourcePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSalesforceSourcePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTransferApi", cdk.validateString)(properties.dataTransferApi));
  errors.collect(cdk.propertyValidator("enableDynamicFieldUpdate", cdk.validateBoolean)(properties.enableDynamicFieldUpdate));
  errors.collect(cdk.propertyValidator("includeDeletedRecords", cdk.validateBoolean)(properties.includeDeletedRecords));
  errors.collect(cdk.propertyValidator("object", cdk.requiredValidator)(properties.object));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  return errors.wrap("supplied properties not correct for \"SalesforceSourcePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSalesforceSourcePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSalesforceSourcePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "DataTransferApi": cdk.stringToCloudFormation(properties.dataTransferApi),
    "EnableDynamicFieldUpdate": cdk.booleanToCloudFormation(properties.enableDynamicFieldUpdate),
    "IncludeDeletedRecords": cdk.booleanToCloudFormation(properties.includeDeletedRecords),
    "Object": cdk.stringToCloudFormation(properties.object)
  };
}

// @ts-ignore TS6133
function CfnFlowSalesforceSourcePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SalesforceSourcePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SalesforceSourcePropertiesProperty>();
  ret.addPropertyResult("dataTransferApi", "DataTransferApi", (properties.DataTransferApi != null ? cfn_parse.FromCloudFormation.getString(properties.DataTransferApi) : undefined));
  ret.addPropertyResult("enableDynamicFieldUpdate", "EnableDynamicFieldUpdate", (properties.EnableDynamicFieldUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDynamicFieldUpdate) : undefined));
  ret.addPropertyResult("includeDeletedRecords", "IncludeDeletedRecords", (properties.IncludeDeletedRecords != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDeletedRecords) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConnectorPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConnectorPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourceConnectorPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amplitude", CfnFlowAmplitudeSourcePropertiesPropertyValidator)(properties.amplitude));
  errors.collect(cdk.propertyValidator("customConnector", CfnFlowCustomConnectorSourcePropertiesPropertyValidator)(properties.customConnector));
  errors.collect(cdk.propertyValidator("datadog", CfnFlowDatadogSourcePropertiesPropertyValidator)(properties.datadog));
  errors.collect(cdk.propertyValidator("dynatrace", CfnFlowDynatraceSourcePropertiesPropertyValidator)(properties.dynatrace));
  errors.collect(cdk.propertyValidator("googleAnalytics", CfnFlowGoogleAnalyticsSourcePropertiesPropertyValidator)(properties.googleAnalytics));
  errors.collect(cdk.propertyValidator("inforNexus", CfnFlowInforNexusSourcePropertiesPropertyValidator)(properties.inforNexus));
  errors.collect(cdk.propertyValidator("marketo", CfnFlowMarketoSourcePropertiesPropertyValidator)(properties.marketo));
  errors.collect(cdk.propertyValidator("pardot", CfnFlowPardotSourcePropertiesPropertyValidator)(properties.pardot));
  errors.collect(cdk.propertyValidator("s3", CfnFlowS3SourcePropertiesPropertyValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("sapoData", CfnFlowSAPODataSourcePropertiesPropertyValidator)(properties.sapoData));
  errors.collect(cdk.propertyValidator("salesforce", CfnFlowSalesforceSourcePropertiesPropertyValidator)(properties.salesforce));
  errors.collect(cdk.propertyValidator("serviceNow", CfnFlowServiceNowSourcePropertiesPropertyValidator)(properties.serviceNow));
  errors.collect(cdk.propertyValidator("singular", CfnFlowSingularSourcePropertiesPropertyValidator)(properties.singular));
  errors.collect(cdk.propertyValidator("slack", CfnFlowSlackSourcePropertiesPropertyValidator)(properties.slack));
  errors.collect(cdk.propertyValidator("trendmicro", CfnFlowTrendmicroSourcePropertiesPropertyValidator)(properties.trendmicro));
  errors.collect(cdk.propertyValidator("veeva", CfnFlowVeevaSourcePropertiesPropertyValidator)(properties.veeva));
  errors.collect(cdk.propertyValidator("zendesk", CfnFlowZendeskSourcePropertiesPropertyValidator)(properties.zendesk));
  return errors.wrap("supplied properties not correct for \"SourceConnectorPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourceConnectorPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourceConnectorPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Amplitude": convertCfnFlowAmplitudeSourcePropertiesPropertyToCloudFormation(properties.amplitude),
    "CustomConnector": convertCfnFlowCustomConnectorSourcePropertiesPropertyToCloudFormation(properties.customConnector),
    "Datadog": convertCfnFlowDatadogSourcePropertiesPropertyToCloudFormation(properties.datadog),
    "Dynatrace": convertCfnFlowDynatraceSourcePropertiesPropertyToCloudFormation(properties.dynatrace),
    "GoogleAnalytics": convertCfnFlowGoogleAnalyticsSourcePropertiesPropertyToCloudFormation(properties.googleAnalytics),
    "InforNexus": convertCfnFlowInforNexusSourcePropertiesPropertyToCloudFormation(properties.inforNexus),
    "Marketo": convertCfnFlowMarketoSourcePropertiesPropertyToCloudFormation(properties.marketo),
    "Pardot": convertCfnFlowPardotSourcePropertiesPropertyToCloudFormation(properties.pardot),
    "S3": convertCfnFlowS3SourcePropertiesPropertyToCloudFormation(properties.s3),
    "SAPOData": convertCfnFlowSAPODataSourcePropertiesPropertyToCloudFormation(properties.sapoData),
    "Salesforce": convertCfnFlowSalesforceSourcePropertiesPropertyToCloudFormation(properties.salesforce),
    "ServiceNow": convertCfnFlowServiceNowSourcePropertiesPropertyToCloudFormation(properties.serviceNow),
    "Singular": convertCfnFlowSingularSourcePropertiesPropertyToCloudFormation(properties.singular),
    "Slack": convertCfnFlowSlackSourcePropertiesPropertyToCloudFormation(properties.slack),
    "Trendmicro": convertCfnFlowTrendmicroSourcePropertiesPropertyToCloudFormation(properties.trendmicro),
    "Veeva": convertCfnFlowVeevaSourcePropertiesPropertyToCloudFormation(properties.veeva),
    "Zendesk": convertCfnFlowZendeskSourcePropertiesPropertyToCloudFormation(properties.zendesk)
  };
}

// @ts-ignore TS6133
function CfnFlowSourceConnectorPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SourceConnectorPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourceConnectorPropertiesProperty>();
  ret.addPropertyResult("amplitude", "Amplitude", (properties.Amplitude != null ? CfnFlowAmplitudeSourcePropertiesPropertyFromCloudFormation(properties.Amplitude) : undefined));
  ret.addPropertyResult("customConnector", "CustomConnector", (properties.CustomConnector != null ? CfnFlowCustomConnectorSourcePropertiesPropertyFromCloudFormation(properties.CustomConnector) : undefined));
  ret.addPropertyResult("datadog", "Datadog", (properties.Datadog != null ? CfnFlowDatadogSourcePropertiesPropertyFromCloudFormation(properties.Datadog) : undefined));
  ret.addPropertyResult("dynatrace", "Dynatrace", (properties.Dynatrace != null ? CfnFlowDynatraceSourcePropertiesPropertyFromCloudFormation(properties.Dynatrace) : undefined));
  ret.addPropertyResult("googleAnalytics", "GoogleAnalytics", (properties.GoogleAnalytics != null ? CfnFlowGoogleAnalyticsSourcePropertiesPropertyFromCloudFormation(properties.GoogleAnalytics) : undefined));
  ret.addPropertyResult("inforNexus", "InforNexus", (properties.InforNexus != null ? CfnFlowInforNexusSourcePropertiesPropertyFromCloudFormation(properties.InforNexus) : undefined));
  ret.addPropertyResult("marketo", "Marketo", (properties.Marketo != null ? CfnFlowMarketoSourcePropertiesPropertyFromCloudFormation(properties.Marketo) : undefined));
  ret.addPropertyResult("pardot", "Pardot", (properties.Pardot != null ? CfnFlowPardotSourcePropertiesPropertyFromCloudFormation(properties.Pardot) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnFlowS3SourcePropertiesPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addPropertyResult("salesforce", "Salesforce", (properties.Salesforce != null ? CfnFlowSalesforceSourcePropertiesPropertyFromCloudFormation(properties.Salesforce) : undefined));
  ret.addPropertyResult("sapoData", "SAPOData", (properties.SAPOData != null ? CfnFlowSAPODataSourcePropertiesPropertyFromCloudFormation(properties.SAPOData) : undefined));
  ret.addPropertyResult("serviceNow", "ServiceNow", (properties.ServiceNow != null ? CfnFlowServiceNowSourcePropertiesPropertyFromCloudFormation(properties.ServiceNow) : undefined));
  ret.addPropertyResult("singular", "Singular", (properties.Singular != null ? CfnFlowSingularSourcePropertiesPropertyFromCloudFormation(properties.Singular) : undefined));
  ret.addPropertyResult("slack", "Slack", (properties.Slack != null ? CfnFlowSlackSourcePropertiesPropertyFromCloudFormation(properties.Slack) : undefined));
  ret.addPropertyResult("trendmicro", "Trendmicro", (properties.Trendmicro != null ? CfnFlowTrendmicroSourcePropertiesPropertyFromCloudFormation(properties.Trendmicro) : undefined));
  ret.addPropertyResult("veeva", "Veeva", (properties.Veeva != null ? CfnFlowVeevaSourcePropertiesPropertyFromCloudFormation(properties.Veeva) : undefined));
  ret.addPropertyResult("zendesk", "Zendesk", (properties.Zendesk != null ? CfnFlowZendeskSourcePropertiesPropertyFromCloudFormation(properties.Zendesk) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IncrementalPullConfigProperty`
 *
 * @param properties - the TypeScript properties of a `IncrementalPullConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowIncrementalPullConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datetimeTypeFieldName", cdk.validateString)(properties.datetimeTypeFieldName));
  return errors.wrap("supplied properties not correct for \"IncrementalPullConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowIncrementalPullConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowIncrementalPullConfigPropertyValidator(properties).assertSuccess();
  return {
    "DatetimeTypeFieldName": cdk.stringToCloudFormation(properties.datetimeTypeFieldName)
  };
}

// @ts-ignore TS6133
function CfnFlowIncrementalPullConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.IncrementalPullConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.IncrementalPullConfigProperty>();
  ret.addPropertyResult("datetimeTypeFieldName", "DatetimeTypeFieldName", (properties.DatetimeTypeFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DatetimeTypeFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceFlowConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceFlowConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowSourceFlowConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiVersion", cdk.validateString)(properties.apiVersion));
  errors.collect(cdk.propertyValidator("connectorProfileName", cdk.validateString)(properties.connectorProfileName));
  errors.collect(cdk.propertyValidator("connectorType", cdk.requiredValidator)(properties.connectorType));
  errors.collect(cdk.propertyValidator("connectorType", cdk.validateString)(properties.connectorType));
  errors.collect(cdk.propertyValidator("incrementalPullConfig", CfnFlowIncrementalPullConfigPropertyValidator)(properties.incrementalPullConfig));
  errors.collect(cdk.propertyValidator("sourceConnectorProperties", cdk.requiredValidator)(properties.sourceConnectorProperties));
  errors.collect(cdk.propertyValidator("sourceConnectorProperties", CfnFlowSourceConnectorPropertiesPropertyValidator)(properties.sourceConnectorProperties));
  return errors.wrap("supplied properties not correct for \"SourceFlowConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowSourceFlowConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowSourceFlowConfigPropertyValidator(properties).assertSuccess();
  return {
    "ApiVersion": cdk.stringToCloudFormation(properties.apiVersion),
    "ConnectorProfileName": cdk.stringToCloudFormation(properties.connectorProfileName),
    "ConnectorType": cdk.stringToCloudFormation(properties.connectorType),
    "IncrementalPullConfig": convertCfnFlowIncrementalPullConfigPropertyToCloudFormation(properties.incrementalPullConfig),
    "SourceConnectorProperties": convertCfnFlowSourceConnectorPropertiesPropertyToCloudFormation(properties.sourceConnectorProperties)
  };
}

// @ts-ignore TS6133
function CfnFlowSourceFlowConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.SourceFlowConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.SourceFlowConfigProperty>();
  ret.addPropertyResult("apiVersion", "ApiVersion", (properties.ApiVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ApiVersion) : undefined));
  ret.addPropertyResult("connectorProfileName", "ConnectorProfileName", (properties.ConnectorProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorProfileName) : undefined));
  ret.addPropertyResult("connectorType", "ConnectorType", (properties.ConnectorType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorType) : undefined));
  ret.addPropertyResult("incrementalPullConfig", "IncrementalPullConfig", (properties.IncrementalPullConfig != null ? CfnFlowIncrementalPullConfigPropertyFromCloudFormation(properties.IncrementalPullConfig) : undefined));
  ret.addPropertyResult("sourceConnectorProperties", "SourceConnectorProperties", (properties.SourceConnectorProperties != null ? CfnFlowSourceConnectorPropertiesPropertyFromCloudFormation(properties.SourceConnectorProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GlueDataCatalogProperty`
 *
 * @param properties - the TypeScript properties of a `GlueDataCatalogProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowGlueDataCatalogPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tablePrefix", cdk.requiredValidator)(properties.tablePrefix));
  errors.collect(cdk.propertyValidator("tablePrefix", cdk.validateString)(properties.tablePrefix));
  return errors.wrap("supplied properties not correct for \"GlueDataCatalogProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowGlueDataCatalogPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowGlueDataCatalogPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TablePrefix": cdk.stringToCloudFormation(properties.tablePrefix)
  };
}

// @ts-ignore TS6133
function CfnFlowGlueDataCatalogPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlow.GlueDataCatalogProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.GlueDataCatalogProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tablePrefix", "TablePrefix", (properties.TablePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.TablePrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetadataCatalogConfigProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataCatalogConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowMetadataCatalogConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("glueDataCatalog", CfnFlowGlueDataCatalogPropertyValidator)(properties.glueDataCatalog));
  return errors.wrap("supplied properties not correct for \"MetadataCatalogConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlowMetadataCatalogConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowMetadataCatalogConfigPropertyValidator(properties).assertSuccess();
  return {
    "GlueDataCatalog": convertCfnFlowGlueDataCatalogPropertyToCloudFormation(properties.glueDataCatalog)
  };
}

// @ts-ignore TS6133
function CfnFlowMetadataCatalogConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlow.MetadataCatalogConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlow.MetadataCatalogConfigProperty>();
  ret.addPropertyResult("glueDataCatalog", "GlueDataCatalog", (properties.GlueDataCatalog != null ? CfnFlowGlueDataCatalogPropertyFromCloudFormation(properties.GlueDataCatalog) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlowProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("destinationFlowConfigList", cdk.requiredValidator)(properties.destinationFlowConfigList));
  errors.collect(cdk.propertyValidator("destinationFlowConfigList", cdk.listValidator(CfnFlowDestinationFlowConfigPropertyValidator))(properties.destinationFlowConfigList));
  errors.collect(cdk.propertyValidator("flowName", cdk.requiredValidator)(properties.flowName));
  errors.collect(cdk.propertyValidator("flowName", cdk.validateString)(properties.flowName));
  errors.collect(cdk.propertyValidator("flowStatus", cdk.validateString)(properties.flowStatus));
  errors.collect(cdk.propertyValidator("kmsArn", cdk.validateString)(properties.kmsArn));
  errors.collect(cdk.propertyValidator("metadataCatalogConfig", CfnFlowMetadataCatalogConfigPropertyValidator)(properties.metadataCatalogConfig));
  errors.collect(cdk.propertyValidator("sourceFlowConfig", cdk.requiredValidator)(properties.sourceFlowConfig));
  errors.collect(cdk.propertyValidator("sourceFlowConfig", CfnFlowSourceFlowConfigPropertyValidator)(properties.sourceFlowConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tasks", cdk.requiredValidator)(properties.tasks));
  errors.collect(cdk.propertyValidator("tasks", cdk.listValidator(CfnFlowTaskPropertyValidator))(properties.tasks));
  errors.collect(cdk.propertyValidator("triggerConfig", cdk.requiredValidator)(properties.triggerConfig));
  errors.collect(cdk.propertyValidator("triggerConfig", CfnFlowTriggerConfigPropertyValidator)(properties.triggerConfig));
  return errors.wrap("supplied properties not correct for \"CfnFlowProps\"");
}

// @ts-ignore TS6133
function convertCfnFlowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlowPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DestinationFlowConfigList": cdk.listMapper(convertCfnFlowDestinationFlowConfigPropertyToCloudFormation)(properties.destinationFlowConfigList),
    "FlowName": cdk.stringToCloudFormation(properties.flowName),
    "FlowStatus": cdk.stringToCloudFormation(properties.flowStatus),
    "KMSArn": cdk.stringToCloudFormation(properties.kmsArn),
    "MetadataCatalogConfig": convertCfnFlowMetadataCatalogConfigPropertyToCloudFormation(properties.metadataCatalogConfig),
    "SourceFlowConfig": convertCfnFlowSourceFlowConfigPropertyToCloudFormation(properties.sourceFlowConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Tasks": cdk.listMapper(convertCfnFlowTaskPropertyToCloudFormation)(properties.tasks),
    "TriggerConfig": convertCfnFlowTriggerConfigPropertyToCloudFormation(properties.triggerConfig)
  };
}

// @ts-ignore TS6133
function CfnFlowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlowProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("destinationFlowConfigList", "DestinationFlowConfigList", (properties.DestinationFlowConfigList != null ? cfn_parse.FromCloudFormation.getArray(CfnFlowDestinationFlowConfigPropertyFromCloudFormation)(properties.DestinationFlowConfigList) : undefined));
  ret.addPropertyResult("flowName", "FlowName", (properties.FlowName != null ? cfn_parse.FromCloudFormation.getString(properties.FlowName) : undefined));
  ret.addPropertyResult("flowStatus", "FlowStatus", (properties.FlowStatus != null ? cfn_parse.FromCloudFormation.getString(properties.FlowStatus) : undefined));
  ret.addPropertyResult("kmsArn", "KMSArn", (properties.KMSArn != null ? cfn_parse.FromCloudFormation.getString(properties.KMSArn) : undefined));
  ret.addPropertyResult("metadataCatalogConfig", "MetadataCatalogConfig", (properties.MetadataCatalogConfig != null ? CfnFlowMetadataCatalogConfigPropertyFromCloudFormation(properties.MetadataCatalogConfig) : undefined));
  ret.addPropertyResult("sourceFlowConfig", "SourceFlowConfig", (properties.SourceFlowConfig != null ? CfnFlowSourceFlowConfigPropertyFromCloudFormation(properties.SourceFlowConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tasks", "Tasks", (properties.Tasks != null ? cfn_parse.FromCloudFormation.getArray(CfnFlowTaskPropertyFromCloudFormation)(properties.Tasks) : undefined));
  ret.addPropertyResult("triggerConfig", "TriggerConfig", (properties.TriggerConfig != null ? CfnFlowTriggerConfigPropertyFromCloudFormation(properties.TriggerConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}