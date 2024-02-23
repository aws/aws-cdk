/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html.
 *
 * @cloudformationResource AWS::OpsWorks::App
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::App";

  /**
   * Build a CfnApp from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApp(scope, id, propsResult.value);
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
   * A `Source` object that specifies the app repository.
   */
  public appSource?: cdk.IResolvable | CfnApp.SourceProperty;

  /**
   * One or more user-defined key/value pairs to be added to the stack attributes.
   */
  public attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * The app's data source.
   */
  public dataSources?: Array<CfnApp.DataSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description of the app.
   */
  public description?: string;

  /**
   * The app virtual host settings, with multiple domains separated by commas.
   */
  public domains?: Array<string>;

  /**
   * Whether to enable SSL for the app.
   */
  public enableSsl?: boolean | cdk.IResolvable;

  /**
   * An array of `EnvironmentVariable` objects that specify environment variables to be associated with the app.
   */
  public environment?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The app name.
   */
  public name: string;

  /**
   * The app's short name.
   */
  public shortname?: string;

  /**
   * An `SslConfiguration` object with the SSL configuration.
   */
  public sslConfiguration?: cdk.IResolvable | CfnApp.SslConfigurationProperty;

  /**
   * The stack ID.
   */
  public stackId: string;

  /**
   * The app type.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
    super(scope, id, {
      "type": CfnApp.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "stackId", this);
    cdk.requireProperty(props, "type", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.appSource = props.appSource;
    this.attributes = props.attributes;
    this.dataSources = props.dataSources;
    this.description = props.description;
    this.domains = props.domains;
    this.enableSsl = props.enableSsl;
    this.environment = props.environment;
    this.name = props.name;
    this.shortname = props.shortname;
    this.sslConfiguration = props.sslConfiguration;
    this.stackId = props.stackId;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appSource": this.appSource,
      "attributes": this.attributes,
      "dataSources": this.dataSources,
      "description": this.description,
      "domains": this.domains,
      "enableSsl": this.enableSsl,
      "environment": this.environment,
      "name": this.name,
      "shortname": this.shortname,
      "sslConfiguration": this.sslConfiguration,
      "stackId": this.stackId,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppPropsToCloudFormation(props);
  }
}

export namespace CfnApp {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html
   */
  export interface SourceProperty {
    /**
     * When included in a request, the parameter depends on the repository type.
     *
     * - For Amazon S3 bundles, set `Password` to the appropriate IAM secret access key.
     * - For HTTP bundles and Subversion repositories, set `Password` to the password.
     *
     * For more information on how to safely handle IAM credentials, see [](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) .
     *
     * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-password
     */
    readonly password?: string;

    /**
     * The application's version.
     *
     * AWS OpsWorks Stacks enables you to easily deploy new versions of an application. One of the simplest approaches is to have branches or revisions in your repository that represent different versions that can potentially be deployed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-revision
     */
    readonly revision?: string;

    /**
     * In requests, the repository's SSH key.
     *
     * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-sshkey
     */
    readonly sshKey?: string;

    /**
     * The repository type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-type
     */
    readonly type?: string;

    /**
     * The source URL.
     *
     * The following is an example of an Amazon S3 source URL: `https://s3.amazonaws.com/opsworks-demo-bucket/opsworks_cookbook_demo.tar.gz` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-url
     */
    readonly url?: string;

    /**
     * This parameter depends on the repository type.
     *
     * - For Amazon S3 bundles, set `Username` to the appropriate IAM access key ID.
     * - For HTTP bundles, Git repositories, and Subversion repositories, set `Username` to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-source.html#cfn-opsworks-app-source-username
     */
    readonly username?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html
   */
  export interface DataSourceProperty {
    /**
     * The data source's ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-arn
     */
    readonly arn?: string;

    /**
     * The database name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-databasename
     */
    readonly databaseName?: string;

    /**
     * The data source's type, `AutoSelectOpsworksMysqlInstance` , `OpsworksMysqlInstance` , `RdsDbInstance` , or `None` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-datasource.html#cfn-opsworks-app-datasource-type
     */
    readonly type?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environmentvariable.html
   */
  export interface EnvironmentVariableProperty {
    /**
     * (Required) The environment variable's name, which can consist of up to 64 characters and must be specified.
     *
     * The name can contain upper- and lowercase letters, numbers, and underscores (_), but it must start with a letter or underscore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environmentvariable.html#cfn-opsworks-app-environmentvariable-key
     */
    readonly key: string;

    /**
     * (Optional) Whether the variable's value is returned by the `DescribeApps` action.
     *
     * To hide an environment variable's value, set `Secure` to `true` . `DescribeApps` returns `*****FILTERED*****` instead of the actual value. The default value for `Secure` is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environmentvariable.html#cfn-opsworks-app-environmentvariable-secure
     */
    readonly secure?: boolean | cdk.IResolvable;

    /**
     * (Optional) The environment variable's value, which can be left empty.
     *
     * If you specify a value, it can contain up to 256 characters, which must all be printable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-environmentvariable.html#cfn-opsworks-app-environmentvariable-value
     */
    readonly value: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html
   */
  export interface SslConfigurationProperty {
    /**
     * The contents of the certificate's domain.crt file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfiguration-certificate
     */
    readonly certificate?: string;

    /**
     * Optional.
     *
     * Can be used to specify an intermediate certificate authority key or client authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfiguration-chain
     */
    readonly chain?: string;

    /**
     * The private key;
     *
     * the contents of the certificate's domain.kex file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-app-sslconfiguration.html#cfn-opsworks-app-sslconfiguration-privatekey
     */
    readonly privateKey?: string;
  }
}

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html
 */
export interface CfnAppProps {
  /**
   * A `Source` object that specifies the app repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-appsource
   */
  readonly appSource?: cdk.IResolvable | CfnApp.SourceProperty;

  /**
   * One or more user-defined key/value pairs to be added to the stack attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-attributes
   */
  readonly attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * The app's data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-datasources
   */
  readonly dataSources?: Array<CfnApp.DataSourceProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description of the app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-description
   */
  readonly description?: string;

  /**
   * The app virtual host settings, with multiple domains separated by commas.
   *
   * For example: `'www.example.com, example.com'`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-domains
   */
  readonly domains?: Array<string>;

  /**
   * Whether to enable SSL for the app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-enablessl
   */
  readonly enableSsl?: boolean | cdk.IResolvable;

  /**
   * An array of `EnvironmentVariable` objects that specify environment variables to be associated with the app.
   *
   * After you deploy the app, these variables are defined on the associated app server instance. For more information, see [Environment Variables](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html#workingapps-creating-environment) .
   *
   * There is no specific limit on the number of environment variables. However, the size of the associated data structure - which includes the variables' names, values, and protected flag values - cannot exceed 20 KB. This limit should accommodate most if not all use cases. Exceeding it will cause an exception with the message, "Environment: is too large (maximum is 20KB)."
   *
   * > If you have specified one or more environment variables, you cannot modify the stack's Chef version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-environment
   */
  readonly environment?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The app name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-name
   */
  readonly name: string;

  /**
   * The app's short name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-shortname
   */
  readonly shortname?: string;

  /**
   * An `SslConfiguration` object with the SSL configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-sslconfiguration
   */
  readonly sslConfiguration?: cdk.IResolvable | CfnApp.SslConfigurationProperty;

  /**
   * The stack ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-stackid
   */
  readonly stackId: string;

  /**
   * The app type.
   *
   * Each supported type is associated with a particular layer. For example, PHP applications are associated with a PHP layer. AWS OpsWorks Stacks deploys an application to those instances that are members of the corresponding layer. If your app isn't one of the standard types, or you prefer to implement your own Deploy recipes, specify `other` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-app.html#cfn-opsworks-app-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("revision", cdk.validateString)(properties.revision));
  errors.collect(cdk.propertyValidator("sshKey", cdk.validateString)(properties.sshKey));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"SourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppSourcePropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Revision": cdk.stringToCloudFormation(properties.revision),
    "SshKey": cdk.stringToCloudFormation(properties.sshKey),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Url": cdk.stringToCloudFormation(properties.url),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnAppSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApp.SourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.SourceProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getString(properties.Revision) : undefined));
  ret.addPropertyResult("sshKey", "SshKey", (properties.SshKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshKey) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DataSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppDataSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppDataSourcePropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAppDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.DataSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.DataSourceProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("secure", cdk.validateBoolean)(properties.secure));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Secure": cdk.booleanToCloudFormation(properties.secure),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAppEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.EnvironmentVariableProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("secure", "Secure", (properties.Secure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Secure) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SslConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SslConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppSslConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificate", cdk.validateString)(properties.certificate));
  errors.collect(cdk.propertyValidator("chain", cdk.validateString)(properties.chain));
  errors.collect(cdk.propertyValidator("privateKey", cdk.validateString)(properties.privateKey));
  return errors.wrap("supplied properties not correct for \"SslConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppSslConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppSslConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Certificate": cdk.stringToCloudFormation(properties.certificate),
    "Chain": cdk.stringToCloudFormation(properties.chain),
    "PrivateKey": cdk.stringToCloudFormation(properties.privateKey)
  };
}

// @ts-ignore TS6133
function CfnAppSslConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApp.SslConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.SslConfigurationProperty>();
  ret.addPropertyResult("certificate", "Certificate", (properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined));
  ret.addPropertyResult("chain", "Chain", (properties.Chain != null ? cfn_parse.FromCloudFormation.getString(properties.Chain) : undefined));
  ret.addPropertyResult("privateKey", "PrivateKey", (properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appSource", CfnAppSourcePropertyValidator)(properties.appSource));
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("dataSources", cdk.listValidator(CfnAppDataSourcePropertyValidator))(properties.dataSources));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("domains", cdk.listValidator(cdk.validateString))(properties.domains));
  errors.collect(cdk.propertyValidator("enableSsl", cdk.validateBoolean)(properties.enableSsl));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnAppEnvironmentVariablePropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("shortname", cdk.validateString)(properties.shortname));
  errors.collect(cdk.propertyValidator("sslConfiguration", CfnAppSslConfigurationPropertyValidator)(properties.sslConfiguration));
  errors.collect(cdk.propertyValidator("stackId", cdk.requiredValidator)(properties.stackId));
  errors.collect(cdk.propertyValidator("stackId", cdk.validateString)(properties.stackId));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnAppProps\"");
}

// @ts-ignore TS6133
function convertCfnAppPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPropsValidator(properties).assertSuccess();
  return {
    "AppSource": convertCfnAppSourcePropertyToCloudFormation(properties.appSource),
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "DataSources": cdk.listMapper(convertCfnAppDataSourcePropertyToCloudFormation)(properties.dataSources),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Domains": cdk.listMapper(cdk.stringToCloudFormation)(properties.domains),
    "EnableSsl": cdk.booleanToCloudFormation(properties.enableSsl),
    "Environment": cdk.listMapper(convertCfnAppEnvironmentVariablePropertyToCloudFormation)(properties.environment),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Shortname": cdk.stringToCloudFormation(properties.shortname),
    "SslConfiguration": convertCfnAppSslConfigurationPropertyToCloudFormation(properties.sslConfiguration),
    "StackId": cdk.stringToCloudFormation(properties.stackId),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
  ret.addPropertyResult("appSource", "AppSource", (properties.AppSource != null ? CfnAppSourcePropertyFromCloudFormation(properties.AppSource) : undefined));
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("dataSources", "DataSources", (properties.DataSources != null ? cfn_parse.FromCloudFormation.getArray(CfnAppDataSourcePropertyFromCloudFormation)(properties.DataSources) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("domains", "Domains", (properties.Domains != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Domains) : undefined));
  ret.addPropertyResult("enableSsl", "EnableSsl", (properties.EnableSsl != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSsl) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnAppEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("shortname", "Shortname", (properties.Shortname != null ? cfn_parse.FromCloudFormation.getString(properties.Shortname) : undefined));
  ret.addPropertyResult("sslConfiguration", "SslConfiguration", (properties.SslConfiguration != null ? CfnAppSslConfigurationPropertyFromCloudFormation(properties.SslConfiguration) : undefined));
  ret.addPropertyResult("stackId", "StackId", (properties.StackId != null ? cfn_parse.FromCloudFormation.getString(properties.StackId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html.
 *
 * @cloudformationResource AWS::OpsWorks::ElasticLoadBalancerAttachment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elasticloadbalancerattachment.html
 */
export class CfnElasticLoadBalancerAttachment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::ElasticLoadBalancerAttachment";

  /**
   * Build a CfnElasticLoadBalancerAttachment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnElasticLoadBalancerAttachment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnElasticLoadBalancerAttachmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnElasticLoadBalancerAttachment(scope, id, propsResult.value);
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
   * The Elastic Load Balancing instance name.
   */
  public elasticLoadBalancerName: string;

  /**
   * The AWS OpsWorks layer ID to which the Elastic Load Balancing load balancer is attached.
   */
  public layerId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnElasticLoadBalancerAttachmentProps) {
    super(scope, id, {
      "type": CfnElasticLoadBalancerAttachment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "elasticLoadBalancerName", this);
    cdk.requireProperty(props, "layerId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.elasticLoadBalancerName = props.elasticLoadBalancerName;
    this.layerId = props.layerId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "elasticLoadBalancerName": this.elasticLoadBalancerName,
      "layerId": this.layerId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnElasticLoadBalancerAttachment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnElasticLoadBalancerAttachmentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnElasticLoadBalancerAttachment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elasticloadbalancerattachment.html
 */
export interface CfnElasticLoadBalancerAttachmentProps {
  /**
   * The Elastic Load Balancing instance name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elasticloadbalancerattachment.html#cfn-opsworks-elasticloadbalancerattachment-elasticloadbalancername
   */
  readonly elasticLoadBalancerName: string;

  /**
   * The AWS OpsWorks layer ID to which the Elastic Load Balancing load balancer is attached.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elasticloadbalancerattachment.html#cfn-opsworks-elasticloadbalancerattachment-layerid
   */
  readonly layerId: string;
}

/**
 * Determine whether the given properties match those of a `CfnElasticLoadBalancerAttachmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnElasticLoadBalancerAttachmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnElasticLoadBalancerAttachmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("elasticLoadBalancerName", cdk.requiredValidator)(properties.elasticLoadBalancerName));
  errors.collect(cdk.propertyValidator("elasticLoadBalancerName", cdk.validateString)(properties.elasticLoadBalancerName));
  errors.collect(cdk.propertyValidator("layerId", cdk.requiredValidator)(properties.layerId));
  errors.collect(cdk.propertyValidator("layerId", cdk.validateString)(properties.layerId));
  return errors.wrap("supplied properties not correct for \"CfnElasticLoadBalancerAttachmentProps\"");
}

// @ts-ignore TS6133
function convertCfnElasticLoadBalancerAttachmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnElasticLoadBalancerAttachmentPropsValidator(properties).assertSuccess();
  return {
    "ElasticLoadBalancerName": cdk.stringToCloudFormation(properties.elasticLoadBalancerName),
    "LayerId": cdk.stringToCloudFormation(properties.layerId)
  };
}

// @ts-ignore TS6133
function CfnElasticLoadBalancerAttachmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnElasticLoadBalancerAttachmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnElasticLoadBalancerAttachmentProps>();
  ret.addPropertyResult("elasticLoadBalancerName", "ElasticLoadBalancerName", (properties.ElasticLoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.ElasticLoadBalancerName) : undefined));
  ret.addPropertyResult("layerId", "LayerId", (properties.LayerId != null ? cfn_parse.FromCloudFormation.getString(properties.LayerId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html.
 *
 * @cloudformationResource AWS::OpsWorks::Instance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::Instance";

  /**
   * Build a CfnInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
   *
   * @cloudformationAttribute AvailabilityZone
   */
  public readonly attrAvailabilityZone: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The private DNS name of the AWS OpsWorks instance.
   *
   * @cloudformationAttribute PrivateDnsName
   */
  public readonly attrPrivateDnsName: string;

  /**
   * The private IP address of the AWS OpsWorks instance, such as `192.0.2.0` .
   *
   * @cloudformationAttribute PrivateIp
   */
  public readonly attrPrivateIp: string;

  /**
   * The public DNS name of the AWS OpsWorks instance.
   *
   * @cloudformationAttribute PublicDnsName
   */
  public readonly attrPublicDnsName: string;

  /**
   * The public IP address of the AWS OpsWorks instance, such as `192.0.2.0` .
   *
   * > Use this attribute only when the AWS OpsWorks instance is in an AWS OpsWorks layer that auto-assigns public IP addresses.
   *
   * @cloudformationAttribute PublicIp
   */
  public readonly attrPublicIp: string;

  /**
   * The default AWS OpsWorks Stacks agent version. You have the following options:.
   */
  public agentVersion?: string;

  /**
   * A custom AMI ID to be used to create the instance.
   */
  public amiId?: string;

  /**
   * The instance architecture.
   */
  public architecture?: string;

  /**
   * For load-based or time-based instances, the type.
   */
  public autoScalingType?: string;

  /**
   * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
   */
  public availabilityZone?: string;

  /**
   * An array of `BlockDeviceMapping` objects that specify the instance's block devices.
   */
  public blockDeviceMappings?: Array<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Whether to create an Amazon EBS-optimized instance.
   */
  public ebsOptimized?: boolean | cdk.IResolvable;

  /**
   * A list of Elastic IP addresses to associate with the instance.
   */
  public elasticIps?: Array<string>;

  /**
   * The instance host name. The following are character limits for instance host names.
   */
  public hostname?: string;

  /**
   * Whether to install operating system and package updates when the instance boots.
   */
  public installUpdatesOnBoot?: boolean | cdk.IResolvable;

  /**
   * The instance type, such as `t2.micro` . For a list of supported instance types, open the stack in the console, choose *Instances* , and choose *+ Instance* . The *Size* list contains the currently supported types. For more information, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) . The parameter values that you use to specify the various types are in the *API Name* column of the *Available Instance Types* table.
   */
  public instanceType: string;

  /**
   * An array that contains the instance's layer IDs.
   */
  public layerIds: Array<string>;

  /**
   * The instance's operating system, which must be set to one of the following.
   */
  public os?: string;

  /**
   * The instance root device type.
   */
  public rootDeviceType?: string;

  /**
   * The instance's Amazon EC2 key-pair name.
   */
  public sshKeyName?: string;

  /**
   * The stack ID.
   */
  public stackId: string;

  /**
   * The ID of the instance's subnet.
   */
  public subnetId?: string;

  /**
   * The instance's tenancy option.
   */
  public tenancy?: string;

  /**
   * The time-based scaling configuration for the instance.
   */
  public timeBasedAutoScaling?: cdk.IResolvable | CfnInstance.TimeBasedAutoScalingProperty;

  /**
   * The instance's virtualization type, `paravirtual` or `hvm` .
   */
  public virtualizationType?: string;

  /**
   * A list of AWS OpsWorks volume IDs to associate with the instance.
   */
  public volumes?: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
    super(scope, id, {
      "type": CfnInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceType", this);
    cdk.requireProperty(props, "layerIds", this);
    cdk.requireProperty(props, "stackId", this);

    this.attrAvailabilityZone = cdk.Token.asString(this.getAtt("AvailabilityZone", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPrivateDnsName = cdk.Token.asString(this.getAtt("PrivateDnsName", cdk.ResolutionTypeHint.STRING));
    this.attrPrivateIp = cdk.Token.asString(this.getAtt("PrivateIp", cdk.ResolutionTypeHint.STRING));
    this.attrPublicDnsName = cdk.Token.asString(this.getAtt("PublicDnsName", cdk.ResolutionTypeHint.STRING));
    this.attrPublicIp = cdk.Token.asString(this.getAtt("PublicIp", cdk.ResolutionTypeHint.STRING));
    this.agentVersion = props.agentVersion;
    this.amiId = props.amiId;
    this.architecture = props.architecture;
    this.autoScalingType = props.autoScalingType;
    this.availabilityZone = props.availabilityZone;
    this.blockDeviceMappings = props.blockDeviceMappings;
    this.ebsOptimized = props.ebsOptimized;
    this.elasticIps = props.elasticIps;
    this.hostname = props.hostname;
    this.installUpdatesOnBoot = props.installUpdatesOnBoot;
    this.instanceType = props.instanceType;
    this.layerIds = props.layerIds;
    this.os = props.os;
    this.rootDeviceType = props.rootDeviceType;
    this.sshKeyName = props.sshKeyName;
    this.stackId = props.stackId;
    this.subnetId = props.subnetId;
    this.tenancy = props.tenancy;
    this.timeBasedAutoScaling = props.timeBasedAutoScaling;
    this.virtualizationType = props.virtualizationType;
    this.volumes = props.volumes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentVersion": this.agentVersion,
      "amiId": this.amiId,
      "architecture": this.architecture,
      "autoScalingType": this.autoScalingType,
      "availabilityZone": this.availabilityZone,
      "blockDeviceMappings": this.blockDeviceMappings,
      "ebsOptimized": this.ebsOptimized,
      "elasticIps": this.elasticIps,
      "hostname": this.hostname,
      "installUpdatesOnBoot": this.installUpdatesOnBoot,
      "instanceType": this.instanceType,
      "layerIds": this.layerIds,
      "os": this.os,
      "rootDeviceType": this.rootDeviceType,
      "sshKeyName": this.sshKeyName,
      "stackId": this.stackId,
      "subnetId": this.subnetId,
      "tenancy": this.tenancy,
      "timeBasedAutoScaling": this.timeBasedAutoScaling,
      "virtualizationType": this.virtualizationType,
      "volumes": this.volumes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstancePropsToCloudFormation(props);
  }
}

export namespace CfnInstance {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html
   */
  export interface BlockDeviceMappingProperty {
    /**
     * The device name that is exposed to the instance, such as `/dev/sdh` .
     *
     * For the root device, you can use the explicit device name or you can set this parameter to `ROOT_DEVICE` and AWS OpsWorks Stacks will provide the correct device name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-devicename
     */
    readonly deviceName?: string;

    /**
     * An `EBSBlockDevice` that defines how to configure an Amazon EBS volume when the instance is launched.
     *
     * You can specify either the `VirtualName` or `Ebs` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-ebs
     */
    readonly ebs?: CfnInstance.EbsBlockDeviceProperty | cdk.IResolvable;

    /**
     * Suppresses the specified device included in the AMI's block device mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-nodevice
     */
    readonly noDevice?: string;

    /**
     * The virtual device name.
     *
     * For more information, see [BlockDeviceMapping](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_BlockDeviceMapping.html) . You can specify either the `VirtualName` or `Ebs` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-virtualname
     */
    readonly virtualName?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html
   */
  export interface EbsBlockDeviceProperty {
    /**
     * Whether the volume is deleted on instance termination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-deleteontermination
     */
    readonly deleteOnTermination?: boolean | cdk.IResolvable;

    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * For more information, see [EbsBlockDevice](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EbsBlockDevice.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-iops
     */
    readonly iops?: number;

    /**
     * The snapshot ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-snapshotid
     */
    readonly snapshotId?: string;

    /**
     * The volume size, in GiB.
     *
     * For more information, see [EbsBlockDevice](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_EbsBlockDevice.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-volumesize
     */
    readonly volumeSize?: number;

    /**
     * The volume type.
     *
     * `gp2` for General Purpose (SSD) volumes, `io1` for Provisioned IOPS (SSD) volumes, `st1` for Throughput Optimized hard disk drives (HDD), `sc1` for Cold HDD,and `standard` for Magnetic volumes.
     *
     * If you specify the `io1` volume type, you must also specify a value for the `Iops` attribute. The maximum ratio of provisioned IOPS to requested volume size (in GiB) is 50:1. AWS uses the default volume size (in GiB) specified in the AMI attributes to set IOPS to 50 x (volume size).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-ebsblockdevice.html#cfn-opsworks-instance-ebsblockdevice-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html
   */
  export interface TimeBasedAutoScalingProperty {
    /**
     * The schedule for Friday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-friday
     */
    readonly friday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Monday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-monday
     */
    readonly monday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Saturday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-saturday
     */
    readonly saturday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Sunday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-sunday
     */
    readonly sunday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Thursday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-thursday
     */
    readonly thursday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Tuesday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-tuesday
     */
    readonly tuesday?: cdk.IResolvable | Record<string, string>;

    /**
     * The schedule for Wednesday.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-timebasedautoscaling.html#cfn-opsworks-instance-timebasedautoscaling-wednesday
     */
    readonly wednesday?: cdk.IResolvable | Record<string, string>;
  }
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html
 */
export interface CfnInstanceProps {
  /**
   * The default AWS OpsWorks Stacks agent version. You have the following options:.
   *
   * - `INHERIT` - Use the stack's default agent version setting.
   * - *version_number* - Use the specified agent version. This value overrides the stack's default setting. To update the agent version, edit the instance configuration and specify a new version. AWS OpsWorks Stacks installs that version on the instance.
   *
   * The default setting is `INHERIT` . To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call `DescribeAgentVersions` . AgentVersion cannot be set to Chef 12.2.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-agentversion
   */
  readonly agentVersion?: string;

  /**
   * A custom AMI ID to be used to create the instance.
   *
   * The AMI should be based on one of the supported operating systems. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
   *
   * > If you specify a custom AMI, you must set `Os` to `Custom` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-amiid
   */
  readonly amiId?: string;

  /**
   * The instance architecture.
   *
   * The default option is `x86_64` . Instance types do not necessarily support both architectures. For a list of the architectures that are supported by the different instance types, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-architecture
   */
  readonly architecture?: string;

  /**
   * For load-based or time-based instances, the type.
   *
   * Windows stacks can use only time-based instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-autoscalingtype
   */
  readonly autoScalingType?: string;

  /**
   * The Availability Zone of the AWS OpsWorks instance, such as `us-east-2a` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * An array of `BlockDeviceMapping` objects that specify the instance's block devices.
   *
   * For more information, see [Block Device Mapping](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html) . Note that block device mappings are not supported for custom AMIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-blockdevicemappings
   */
  readonly blockDeviceMappings?: Array<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Whether to create an Amazon EBS-optimized instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-ebsoptimized
   */
  readonly ebsOptimized?: boolean | cdk.IResolvable;

  /**
   * A list of Elastic IP addresses to associate with the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-elasticips
   */
  readonly elasticIps?: Array<string>;

  /**
   * The instance host name. The following are character limits for instance host names.
   *
   * - Linux-based instances: 63 characters
   * - Windows-based instances: 15 characters
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-hostname
   */
  readonly hostname?: string;

  /**
   * Whether to install operating system and package updates when the instance boots.
   *
   * The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using `CreateDeployment` to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
   *
   * > We strongly recommend using the default value of `true` to ensure that your instances have the latest security updates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-installupdatesonboot
   */
  readonly installUpdatesOnBoot?: boolean | cdk.IResolvable;

  /**
   * The instance type, such as `t2.micro` . For a list of supported instance types, open the stack in the console, choose *Instances* , and choose *+ Instance* . The *Size* list contains the currently supported types. For more information, see [Instance Families and Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html) . The parameter values that you use to specify the various types are in the *API Name* column of the *Available Instance Types* table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-instancetype
   */
  readonly instanceType: string;

  /**
   * An array that contains the instance's layer IDs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-layerids
   */
  readonly layerIds: Array<string>;

  /**
   * The instance's operating system, which must be set to one of the following.
   *
   * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
   * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
   * - `CentOS Linux 7`
   * - `Red Hat Enterprise Linux 7`
   * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
   * - A custom AMI: `Custom` .
   *
   * Not all operating systems are supported with all versions of Chef. For more information about the supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
   *
   * The default option is the current Amazon Linux version. If you set this parameter to `Custom` , you must use the `CreateInstance` action's AmiId parameter to specify the custom AMI that you want to use. Block device mappings are not supported if the value is `Custom` . For more information about how to use custom AMIs with AWS OpsWorks Stacks, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-os
   */
  readonly os?: string;

  /**
   * The instance root device type.
   *
   * For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-rootdevicetype
   */
  readonly rootDeviceType?: string;

  /**
   * The instance's Amazon EC2 key-pair name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-sshkeyname
   */
  readonly sshKeyName?: string;

  /**
   * The stack ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-stackid
   */
  readonly stackId: string;

  /**
   * The ID of the instance's subnet.
   *
   * If the stack is running in a VPC, you can use this parameter to override the stack's default subnet ID value and direct AWS OpsWorks Stacks to launch the instance in a different subnet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-subnetid
   */
  readonly subnetId?: string;

  /**
   * The instance's tenancy option.
   *
   * The default option is no tenancy, or if the instance is running in a VPC, inherit tenancy settings from the VPC. The following are valid values for this parameter: `dedicated` , `default` , or `host` . Because there are costs associated with changes in tenancy options, we recommend that you research tenancy options before choosing them for your instances. For more information about dedicated hosts, see [Dedicated Hosts Overview](https://docs.aws.amazon.com/ec2/dedicated-hosts/) and [Amazon EC2 Dedicated Hosts](https://docs.aws.amazon.com/ec2/dedicated-hosts/) . For more information about dedicated instances, see [Dedicated Instances](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/dedicated-instance.html) and [Amazon EC2 Dedicated Instances](https://docs.aws.amazon.com/ec2/purchasing-options/dedicated-instances/) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-tenancy
   */
  readonly tenancy?: string;

  /**
   * The time-based scaling configuration for the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-timebasedautoscaling
   */
  readonly timeBasedAutoScaling?: cdk.IResolvable | CfnInstance.TimeBasedAutoScalingProperty;

  /**
   * The instance's virtualization type, `paravirtual` or `hvm` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-virtualizationtype
   */
  readonly virtualizationType?: string;

  /**
   * A list of AWS OpsWorks volume IDs to associate with the instance.
   *
   * For more information, see [`AWS::OpsWorks::Volume`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-instance.html#cfn-opsworks-instance-volumes
   */
  readonly volumes?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `EbsBlockDeviceProperty`
 *
 * @param properties - the TypeScript properties of a `EbsBlockDeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceEbsBlockDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteOnTermination", cdk.validateBoolean)(properties.deleteOnTermination));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("snapshotId", cdk.validateString)(properties.snapshotId));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"EbsBlockDeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceEbsBlockDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceEbsBlockDevicePropertyValidator(properties).assertSuccess();
  return {
    "DeleteOnTermination": cdk.booleanToCloudFormation(properties.deleteOnTermination),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "SnapshotId": cdk.stringToCloudFormation(properties.snapshotId),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnInstanceEbsBlockDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.EbsBlockDeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.EbsBlockDeviceProperty>();
  ret.addPropertyResult("deleteOnTermination", "DeleteOnTermination", (properties.DeleteOnTermination != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteOnTermination) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("snapshotId", "SnapshotId", (properties.SnapshotId != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotId) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BlockDeviceMappingProperty`
 *
 * @param properties - the TypeScript properties of a `BlockDeviceMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceBlockDeviceMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("ebs", CfnInstanceEbsBlockDevicePropertyValidator)(properties.ebs));
  errors.collect(cdk.propertyValidator("noDevice", cdk.validateString)(properties.noDevice));
  errors.collect(cdk.propertyValidator("virtualName", cdk.validateString)(properties.virtualName));
  return errors.wrap("supplied properties not correct for \"BlockDeviceMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceBlockDeviceMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceBlockDeviceMappingPropertyValidator(properties).assertSuccess();
  return {
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "Ebs": convertCfnInstanceEbsBlockDevicePropertyToCloudFormation(properties.ebs),
    "NoDevice": cdk.stringToCloudFormation(properties.noDevice),
    "VirtualName": cdk.stringToCloudFormation(properties.virtualName)
  };
}

// @ts-ignore TS6133
function CfnInstanceBlockDeviceMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.BlockDeviceMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.BlockDeviceMappingProperty>();
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("ebs", "Ebs", (properties.Ebs != null ? CfnInstanceEbsBlockDevicePropertyFromCloudFormation(properties.Ebs) : undefined));
  ret.addPropertyResult("noDevice", "NoDevice", (properties.NoDevice != null ? cfn_parse.FromCloudFormation.getString(properties.NoDevice) : undefined));
  ret.addPropertyResult("virtualName", "VirtualName", (properties.VirtualName != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimeBasedAutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `TimeBasedAutoScalingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceTimeBasedAutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("friday", cdk.hashValidator(cdk.validateString))(properties.friday));
  errors.collect(cdk.propertyValidator("monday", cdk.hashValidator(cdk.validateString))(properties.monday));
  errors.collect(cdk.propertyValidator("saturday", cdk.hashValidator(cdk.validateString))(properties.saturday));
  errors.collect(cdk.propertyValidator("sunday", cdk.hashValidator(cdk.validateString))(properties.sunday));
  errors.collect(cdk.propertyValidator("thursday", cdk.hashValidator(cdk.validateString))(properties.thursday));
  errors.collect(cdk.propertyValidator("tuesday", cdk.hashValidator(cdk.validateString))(properties.tuesday));
  errors.collect(cdk.propertyValidator("wednesday", cdk.hashValidator(cdk.validateString))(properties.wednesday));
  return errors.wrap("supplied properties not correct for \"TimeBasedAutoScalingProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceTimeBasedAutoScalingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceTimeBasedAutoScalingPropertyValidator(properties).assertSuccess();
  return {
    "Friday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.friday),
    "Monday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.monday),
    "Saturday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.saturday),
    "Sunday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.sunday),
    "Thursday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.thursday),
    "Tuesday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tuesday),
    "Wednesday": cdk.hashMapper(cdk.stringToCloudFormation)(properties.wednesday)
  };
}

// @ts-ignore TS6133
function CfnInstanceTimeBasedAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.TimeBasedAutoScalingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.TimeBasedAutoScalingProperty>();
  ret.addPropertyResult("friday", "Friday", (properties.Friday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Friday) : undefined));
  ret.addPropertyResult("monday", "Monday", (properties.Monday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Monday) : undefined));
  ret.addPropertyResult("saturday", "Saturday", (properties.Saturday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Saturday) : undefined));
  ret.addPropertyResult("sunday", "Sunday", (properties.Sunday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Sunday) : undefined));
  ret.addPropertyResult("thursday", "Thursday", (properties.Thursday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Thursday) : undefined));
  ret.addPropertyResult("tuesday", "Tuesday", (properties.Tuesday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tuesday) : undefined));
  ret.addPropertyResult("wednesday", "Wednesday", (properties.Wednesday != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Wednesday) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentVersion", cdk.validateString)(properties.agentVersion));
  errors.collect(cdk.propertyValidator("amiId", cdk.validateString)(properties.amiId));
  errors.collect(cdk.propertyValidator("architecture", cdk.validateString)(properties.architecture));
  errors.collect(cdk.propertyValidator("autoScalingType", cdk.validateString)(properties.autoScalingType));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("blockDeviceMappings", cdk.listValidator(CfnInstanceBlockDeviceMappingPropertyValidator))(properties.blockDeviceMappings));
  errors.collect(cdk.propertyValidator("ebsOptimized", cdk.validateBoolean)(properties.ebsOptimized));
  errors.collect(cdk.propertyValidator("elasticIps", cdk.listValidator(cdk.validateString))(properties.elasticIps));
  errors.collect(cdk.propertyValidator("hostname", cdk.validateString)(properties.hostname));
  errors.collect(cdk.propertyValidator("installUpdatesOnBoot", cdk.validateBoolean)(properties.installUpdatesOnBoot));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("layerIds", cdk.requiredValidator)(properties.layerIds));
  errors.collect(cdk.propertyValidator("layerIds", cdk.listValidator(cdk.validateString))(properties.layerIds));
  errors.collect(cdk.propertyValidator("os", cdk.validateString)(properties.os));
  errors.collect(cdk.propertyValidator("rootDeviceType", cdk.validateString)(properties.rootDeviceType));
  errors.collect(cdk.propertyValidator("sshKeyName", cdk.validateString)(properties.sshKeyName));
  errors.collect(cdk.propertyValidator("stackId", cdk.requiredValidator)(properties.stackId));
  errors.collect(cdk.propertyValidator("stackId", cdk.validateString)(properties.stackId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  errors.collect(cdk.propertyValidator("tenancy", cdk.validateString)(properties.tenancy));
  errors.collect(cdk.propertyValidator("timeBasedAutoScaling", CfnInstanceTimeBasedAutoScalingPropertyValidator)(properties.timeBasedAutoScaling));
  errors.collect(cdk.propertyValidator("virtualizationType", cdk.validateString)(properties.virtualizationType));
  errors.collect(cdk.propertyValidator("volumes", cdk.listValidator(cdk.validateString))(properties.volumes));
  return errors.wrap("supplied properties not correct for \"CfnInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstancePropsValidator(properties).assertSuccess();
  return {
    "AgentVersion": cdk.stringToCloudFormation(properties.agentVersion),
    "AmiId": cdk.stringToCloudFormation(properties.amiId),
    "Architecture": cdk.stringToCloudFormation(properties.architecture),
    "AutoScalingType": cdk.stringToCloudFormation(properties.autoScalingType),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "BlockDeviceMappings": cdk.listMapper(convertCfnInstanceBlockDeviceMappingPropertyToCloudFormation)(properties.blockDeviceMappings),
    "EbsOptimized": cdk.booleanToCloudFormation(properties.ebsOptimized),
    "ElasticIps": cdk.listMapper(cdk.stringToCloudFormation)(properties.elasticIps),
    "Hostname": cdk.stringToCloudFormation(properties.hostname),
    "InstallUpdatesOnBoot": cdk.booleanToCloudFormation(properties.installUpdatesOnBoot),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "LayerIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.layerIds),
    "Os": cdk.stringToCloudFormation(properties.os),
    "RootDeviceType": cdk.stringToCloudFormation(properties.rootDeviceType),
    "SshKeyName": cdk.stringToCloudFormation(properties.sshKeyName),
    "StackId": cdk.stringToCloudFormation(properties.stackId),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId),
    "Tenancy": cdk.stringToCloudFormation(properties.tenancy),
    "TimeBasedAutoScaling": convertCfnInstanceTimeBasedAutoScalingPropertyToCloudFormation(properties.timeBasedAutoScaling),
    "VirtualizationType": cdk.stringToCloudFormation(properties.virtualizationType),
    "Volumes": cdk.listMapper(cdk.stringToCloudFormation)(properties.volumes)
  };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
  ret.addPropertyResult("agentVersion", "AgentVersion", (properties.AgentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AgentVersion) : undefined));
  ret.addPropertyResult("amiId", "AmiId", (properties.AmiId != null ? cfn_parse.FromCloudFormation.getString(properties.AmiId) : undefined));
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined));
  ret.addPropertyResult("autoScalingType", "AutoScalingType", (properties.AutoScalingType != null ? cfn_parse.FromCloudFormation.getString(properties.AutoScalingType) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("blockDeviceMappings", "BlockDeviceMappings", (properties.BlockDeviceMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceBlockDeviceMappingPropertyFromCloudFormation)(properties.BlockDeviceMappings) : undefined));
  ret.addPropertyResult("ebsOptimized", "EbsOptimized", (properties.EbsOptimized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EbsOptimized) : undefined));
  ret.addPropertyResult("elasticIps", "ElasticIps", (properties.ElasticIps != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ElasticIps) : undefined));
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined));
  ret.addPropertyResult("installUpdatesOnBoot", "InstallUpdatesOnBoot", (properties.InstallUpdatesOnBoot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InstallUpdatesOnBoot) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("layerIds", "LayerIds", (properties.LayerIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LayerIds) : undefined));
  ret.addPropertyResult("os", "Os", (properties.Os != null ? cfn_parse.FromCloudFormation.getString(properties.Os) : undefined));
  ret.addPropertyResult("rootDeviceType", "RootDeviceType", (properties.RootDeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.RootDeviceType) : undefined));
  ret.addPropertyResult("sshKeyName", "SshKeyName", (properties.SshKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.SshKeyName) : undefined));
  ret.addPropertyResult("stackId", "StackId", (properties.StackId != null ? cfn_parse.FromCloudFormation.getString(properties.StackId) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addPropertyResult("tenancy", "Tenancy", (properties.Tenancy != null ? cfn_parse.FromCloudFormation.getString(properties.Tenancy) : undefined));
  ret.addPropertyResult("timeBasedAutoScaling", "TimeBasedAutoScaling", (properties.TimeBasedAutoScaling != null ? CfnInstanceTimeBasedAutoScalingPropertyFromCloudFormation(properties.TimeBasedAutoScaling) : undefined));
  ret.addPropertyResult("virtualizationType", "VirtualizationType", (properties.VirtualizationType != null ? cfn_parse.FromCloudFormation.getString(properties.VirtualizationType) : undefined));
  ret.addPropertyResult("volumes", "Volumes", (properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Volumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html.
 *
 * @cloudformationResource AWS::OpsWorks::Layer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html
 */
export class CfnLayer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::Layer";

  /**
   * Build a CfnLayer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLayerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLayer(scope, id, propsResult.value);
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
   * One or more user-defined key-value pairs to be added to the stack attributes.
   */
  public attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * Whether to automatically assign an [Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
   */
  public autoAssignElasticIps: boolean | cdk.IResolvable;

  /**
   * For stacks that are running in a VPC, whether to automatically assign a public IP address to the layer's instances.
   */
  public autoAssignPublicIps: boolean | cdk.IResolvable;

  /**
   * The ARN of an IAM profile to be used for the layer's EC2 instances.
   */
  public customInstanceProfileArn?: string;

  /**
   * A JSON-formatted string containing custom stack configuration and deployment attributes to be installed on the layer's instances.
   */
  public customJson?: any | cdk.IResolvable;

  /**
   * A `LayerCustomRecipes` object that specifies the layer custom recipes.
   */
  public customRecipes?: cdk.IResolvable | CfnLayer.RecipesProperty;

  /**
   * An array containing the layer custom security group IDs.
   */
  public customSecurityGroupIds?: Array<string>;

  /**
   * Whether to disable auto healing for the layer.
   */
  public enableAutoHealing: boolean | cdk.IResolvable;

  /**
   * Whether to install operating system and package updates when the instance boots.
   */
  public installUpdatesOnBoot?: boolean | cdk.IResolvable;

  /**
   * A `LifeCycleEventConfiguration` object that you can use to configure the Shutdown event to specify an execution timeout and enable or disable Elastic Load Balancer connection draining.
   */
  public lifecycleEventConfiguration?: cdk.IResolvable | CfnLayer.LifecycleEventConfigurationProperty;

  /**
   * The load-based scaling configuration for the AWS OpsWorks layer.
   */
  public loadBasedAutoScaling?: cdk.IResolvable | CfnLayer.LoadBasedAutoScalingProperty;

  /**
   * The layer name, which is used by the console.
   */
  public name: string;

  /**
   * An array of `Package` objects that describes the layer packages.
   */
  public packages?: Array<string>;

  /**
   * For custom layers only, use this parameter to specify the layer's short name, which is used internally by AWS OpsWorks Stacks and by Chef recipes.
   */
  public shortname: string;

  /**
   * The layer stack ID.
   */
  public stackId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies one or more sets of tags (key–value pairs) to associate with this AWS OpsWorks layer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The layer type.
   */
  public type: string;

  /**
   * Whether to use Amazon EBS-optimized instances.
   */
  public useEbsOptimizedInstances?: boolean | cdk.IResolvable;

  /**
   * A `VolumeConfigurations` object that describes the layer's Amazon EBS volumes.
   */
  public volumeConfigurations?: Array<cdk.IResolvable | CfnLayer.VolumeConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLayerProps) {
    super(scope, id, {
      "type": CfnLayer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "autoAssignElasticIps", this);
    cdk.requireProperty(props, "autoAssignPublicIps", this);
    cdk.requireProperty(props, "enableAutoHealing", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "shortname", this);
    cdk.requireProperty(props, "stackId", this);
    cdk.requireProperty(props, "type", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attributes = props.attributes;
    this.autoAssignElasticIps = props.autoAssignElasticIps;
    this.autoAssignPublicIps = props.autoAssignPublicIps;
    this.customInstanceProfileArn = props.customInstanceProfileArn;
    this.customJson = props.customJson;
    this.customRecipes = props.customRecipes;
    this.customSecurityGroupIds = props.customSecurityGroupIds;
    this.enableAutoHealing = props.enableAutoHealing;
    this.installUpdatesOnBoot = props.installUpdatesOnBoot;
    this.lifecycleEventConfiguration = props.lifecycleEventConfiguration;
    this.loadBasedAutoScaling = props.loadBasedAutoScaling;
    this.name = props.name;
    this.packages = props.packages;
    this.shortname = props.shortname;
    this.stackId = props.stackId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpsWorks::Layer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
    this.useEbsOptimizedInstances = props.useEbsOptimizedInstances;
    this.volumeConfigurations = props.volumeConfigurations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributes": this.attributes,
      "autoAssignElasticIps": this.autoAssignElasticIps,
      "autoAssignPublicIps": this.autoAssignPublicIps,
      "customInstanceProfileArn": this.customInstanceProfileArn,
      "customJson": this.customJson,
      "customRecipes": this.customRecipes,
      "customSecurityGroupIds": this.customSecurityGroupIds,
      "enableAutoHealing": this.enableAutoHealing,
      "installUpdatesOnBoot": this.installUpdatesOnBoot,
      "lifecycleEventConfiguration": this.lifecycleEventConfiguration,
      "loadBasedAutoScaling": this.loadBasedAutoScaling,
      "name": this.name,
      "packages": this.packages,
      "shortname": this.shortname,
      "stackId": this.stackId,
      "tags": this.tags.renderTags(),
      "type": this.type,
      "useEbsOptimizedInstances": this.useEbsOptimizedInstances,
      "volumeConfigurations": this.volumeConfigurations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLayerPropsToCloudFormation(props);
  }
}

export namespace CfnLayer {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html
   */
  export interface RecipesProperty {
    /**
     * An array of custom recipe names to be run following a `configure` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-recipes-configure
     */
    readonly configure?: Array<string>;

    /**
     * An array of custom recipe names to be run following a `deploy` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-recipes-deploy
     */
    readonly deploy?: Array<string>;

    /**
     * An array of custom recipe names to be run following a `setup` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-recipes-setup
     */
    readonly setup?: Array<string>;

    /**
     * An array of custom recipe names to be run following a `shutdown` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-recipes-shutdown
     */
    readonly shutdown?: Array<string>;

    /**
     * An array of custom recipe names to be run following a `undeploy` event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-recipes.html#cfn-opsworks-layer-recipes-undeploy
     */
    readonly undeploy?: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html
   */
  export interface LifecycleEventConfigurationProperty {
    /**
     * The Shutdown event configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html#cfn-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration
     */
    readonly shutdownEventConfiguration?: cdk.IResolvable | CfnLayer.ShutdownEventConfigurationProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-shutdowneventconfiguration.html
   */
  export interface ShutdownEventConfigurationProperty {
    /**
     * Whether to enable Elastic Load Balancing connection draining.
     *
     * For more information, see [Connection Draining](https://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/TerminologyandKeyConcepts.html#conn-drain)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-shutdowneventconfiguration.html#cfn-opsworks-layer-shutdowneventconfiguration-delayuntilelbconnectionsdrained
     */
    readonly delayUntilElbConnectionsDrained?: boolean | cdk.IResolvable;

    /**
     * The time, in seconds, that AWS OpsWorks Stacks waits after triggering a Shutdown event before shutting down an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-shutdowneventconfiguration.html#cfn-opsworks-layer-shutdowneventconfiguration-executiontimeout
     */
    readonly executionTimeout?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html
   */
  export interface LoadBasedAutoScalingProperty {
    /**
     * An `AutoScalingThresholds` object that describes the downscaling configuration, which defines how and when AWS OpsWorks Stacks reduces the number of instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-downscaling
     */
    readonly downScaling?: CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable;

    /**
     * Whether load-based auto scaling is enabled for the layer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-enable
     */
    readonly enable?: boolean | cdk.IResolvable;

    /**
     * An `AutoScalingThresholds` object that describes the upscaling configuration, which defines how and when AWS OpsWorks Stacks increases the number of instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-upscaling
     */
    readonly upScaling?: CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html
   */
  export interface AutoScalingThresholdsProperty {
    /**
     * The CPU utilization threshold, as a percent of the available CPU.
     *
     * A value of -1 disables the threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-cputhreshold
     */
    readonly cpuThreshold?: number;

    /**
     * The amount of time (in minutes) after a scaling event occurs that AWS OpsWorks Stacks should ignore metrics and suppress additional scaling events.
     *
     * For example, AWS OpsWorks Stacks adds new instances following an upscaling event but the instances won't start reducing the load until they have been booted and configured. There is no point in raising additional scaling events during that operation, which typically takes several minutes. `IgnoreMetricsTime` allows you to direct AWS OpsWorks Stacks to suppress scaling events long enough to get the new instances online.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-ignoremetricstime
     */
    readonly ignoreMetricsTime?: number;

    /**
     * The number of instances to add or remove when the load exceeds a threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-instancecount
     */
    readonly instanceCount?: number;

    /**
     * The load threshold.
     *
     * A value of -1 disables the threshold. For more information about how load is computed, see [Load (computing)](https://docs.aws.amazon.com/http://en.wikipedia.org/wiki/Load_%28computing%29) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-loadthreshold
     */
    readonly loadThreshold?: number;

    /**
     * The memory utilization threshold, as a percent of the available memory.
     *
     * A value of -1 disables the threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-memorythreshold
     */
    readonly memoryThreshold?: number;

    /**
     * The amount of time, in minutes, that the load must exceed a threshold before more instances are added or removed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-autoscalingthresholds.html#cfn-opsworks-layer-autoscalingthresholds-thresholdswaittime
     */
    readonly thresholdsWaitTime?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html
   */
  export interface VolumeConfigurationProperty {
    /**
     * Specifies whether an Amazon EBS volume is encrypted.
     *
     * For more information, see [Amazon EBS Encryption](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-encrypted
     */
    readonly encrypted?: boolean | cdk.IResolvable;

    /**
     * The number of I/O operations per second (IOPS) to provision for the volume.
     *
     * For PIOPS volumes, the IOPS per disk.
     *
     * If you specify `io1` for the volume type, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-iops
     */
    readonly iops?: number;

    /**
     * The volume mount point.
     *
     * For example "/dev/sdh".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-mountpoint
     */
    readonly mountPoint?: string;

    /**
     * The number of disks in the volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-numberofdisks
     */
    readonly numberOfDisks?: number;

    /**
     * The volume [RAID level](https://docs.aws.amazon.com/http://en.wikipedia.org/wiki/Standard_RAID_levels) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-raidlevel
     */
    readonly raidLevel?: number;

    /**
     * The volume size.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-size
     */
    readonly size?: number;

    /**
     * The volume type. For more information, see [Amazon EBS Volume Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) .
     *
     * - `standard` - Magnetic. Magnetic volumes must have a minimum size of 1 GiB and a maximum size of 1024 GiB.
     * - `io1` - Provisioned IOPS (SSD). PIOPS volumes must have a minimum size of 4 GiB and a maximum size of 16384 GiB.
     * - `gp2` - General Purpose (SSD). General purpose volumes must have a minimum size of 1 GiB and a maximum size of 16384 GiB.
     * - `st1` - Throughput Optimized hard disk drive (HDD). Throughput optimized HDD volumes must have a minimum size of 500 GiB and a maximum size of 16384 GiB.
     * - `sc1` - Cold HDD. Cold HDD volumes must have a minimum size of 500 GiB and a maximum size of 16384 GiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volumeconfiguration-volumetype
     */
    readonly volumeType?: string;
  }
}

/**
 * Properties for defining a `CfnLayer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html
 */
export interface CfnLayerProps {
  /**
   * One or more user-defined key-value pairs to be added to the stack attributes.
   *
   * To create a cluster layer, set the `EcsClusterArn` attribute to the cluster's ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-attributes
   */
  readonly attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * Whether to automatically assign an [Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to the layer's instances. For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignelasticips
   */
  readonly autoAssignElasticIps: boolean | cdk.IResolvable;

  /**
   * For stacks that are running in a VPC, whether to automatically assign a public IP address to the layer's instances.
   *
   * For more information, see [How to Edit a Layer](https://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-basics-edit.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-autoassignpublicips
   */
  readonly autoAssignPublicIps: boolean | cdk.IResolvable;

  /**
   * The ARN of an IAM profile to be used for the layer's EC2 instances.
   *
   * For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-custominstanceprofilearn
   */
  readonly customInstanceProfileArn?: string;

  /**
   * A JSON-formatted string containing custom stack configuration and deployment attributes to be installed on the layer's instances.
   *
   * For more information, see [Using Custom JSON](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook-json-override.html) . This feature is supported as of version 1.7.42 of the AWS CLI .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customjson
   */
  readonly customJson?: any | cdk.IResolvable;

  /**
   * A `LayerCustomRecipes` object that specifies the layer custom recipes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customrecipes
   */
  readonly customRecipes?: cdk.IResolvable | CfnLayer.RecipesProperty;

  /**
   * An array containing the layer custom security group IDs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-customsecuritygroupids
   */
  readonly customSecurityGroupIds?: Array<string>;

  /**
   * Whether to disable auto healing for the layer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-enableautohealing
   */
  readonly enableAutoHealing: boolean | cdk.IResolvable;

  /**
   * Whether to install operating system and package updates when the instance boots.
   *
   * The default value is `true` . To control when updates are installed, set this value to `false` . You must then update your instances manually by using `CreateDeployment` to run the `update_dependencies` stack command or by manually running `yum` (Amazon Linux) or `apt-get` (Ubuntu) on the instances.
   *
   * > To ensure that your instances have the latest security updates, we strongly recommend using the default value of `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-installupdatesonboot
   */
  readonly installUpdatesOnBoot?: boolean | cdk.IResolvable;

  /**
   * A `LifeCycleEventConfiguration` object that you can use to configure the Shutdown event to specify an execution timeout and enable or disable Elastic Load Balancer connection draining.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-lifecycleeventconfiguration
   */
  readonly lifecycleEventConfiguration?: cdk.IResolvable | CfnLayer.LifecycleEventConfigurationProperty;

  /**
   * The load-based scaling configuration for the AWS OpsWorks layer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-loadbasedautoscaling
   */
  readonly loadBasedAutoScaling?: cdk.IResolvable | CfnLayer.LoadBasedAutoScalingProperty;

  /**
   * The layer name, which is used by the console.
   *
   * Layer names can be a maximum of 32 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-name
   */
  readonly name: string;

  /**
   * An array of `Package` objects that describes the layer packages.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-packages
   */
  readonly packages?: Array<string>;

  /**
   * For custom layers only, use this parameter to specify the layer's short name, which is used internally by AWS OpsWorks Stacks and by Chef recipes.
   *
   * The short name is also used as the name for the directory where your app files are installed. It can have a maximum of 32 characters, which are limited to the alphanumeric characters, '-', '_', and '.'.
   *
   * Built-in layer short names are defined by AWS OpsWorks Stacks. For more information, see the [Layer Reference](https://docs.aws.amazon.com/opsworks/latest/userguide/layers.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-shortname
   */
  readonly shortname: string;

  /**
   * The layer stack ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-stackid
   */
  readonly stackId: string;

  /**
   * Specifies one or more sets of tags (key–value pairs) to associate with this AWS OpsWorks layer.
   *
   * Use tags to manage your resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The layer type.
   *
   * A stack cannot have more than one built-in layer of the same type. It can have any number of custom layers. Built-in layers are not available in Chef 12 stacks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-type
   */
  readonly type: string;

  /**
   * Whether to use Amazon EBS-optimized instances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-useebsoptimizedinstances
   */
  readonly useEbsOptimizedInstances?: boolean | cdk.IResolvable;

  /**
   * A `VolumeConfigurations` object that describes the layer's Amazon EBS volumes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-layer.html#cfn-opsworks-layer-volumeconfigurations
   */
  readonly volumeConfigurations?: Array<cdk.IResolvable | CfnLayer.VolumeConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RecipesProperty`
 *
 * @param properties - the TypeScript properties of a `RecipesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerRecipesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configure", cdk.listValidator(cdk.validateString))(properties.configure));
  errors.collect(cdk.propertyValidator("deploy", cdk.listValidator(cdk.validateString))(properties.deploy));
  errors.collect(cdk.propertyValidator("setup", cdk.listValidator(cdk.validateString))(properties.setup));
  errors.collect(cdk.propertyValidator("shutdown", cdk.listValidator(cdk.validateString))(properties.shutdown));
  errors.collect(cdk.propertyValidator("undeploy", cdk.listValidator(cdk.validateString))(properties.undeploy));
  return errors.wrap("supplied properties not correct for \"RecipesProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerRecipesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerRecipesPropertyValidator(properties).assertSuccess();
  return {
    "Configure": cdk.listMapper(cdk.stringToCloudFormation)(properties.configure),
    "Deploy": cdk.listMapper(cdk.stringToCloudFormation)(properties.deploy),
    "Setup": cdk.listMapper(cdk.stringToCloudFormation)(properties.setup),
    "Shutdown": cdk.listMapper(cdk.stringToCloudFormation)(properties.shutdown),
    "Undeploy": cdk.listMapper(cdk.stringToCloudFormation)(properties.undeploy)
  };
}

// @ts-ignore TS6133
function CfnLayerRecipesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayer.RecipesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.RecipesProperty>();
  ret.addPropertyResult("configure", "Configure", (properties.Configure != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Configure) : undefined));
  ret.addPropertyResult("deploy", "Deploy", (properties.Deploy != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Deploy) : undefined));
  ret.addPropertyResult("setup", "Setup", (properties.Setup != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Setup) : undefined));
  ret.addPropertyResult("shutdown", "Shutdown", (properties.Shutdown != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Shutdown) : undefined));
  ret.addPropertyResult("undeploy", "Undeploy", (properties.Undeploy != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Undeploy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ShutdownEventConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ShutdownEventConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerShutdownEventConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("delayUntilElbConnectionsDrained", cdk.validateBoolean)(properties.delayUntilElbConnectionsDrained));
  errors.collect(cdk.propertyValidator("executionTimeout", cdk.validateNumber)(properties.executionTimeout));
  return errors.wrap("supplied properties not correct for \"ShutdownEventConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerShutdownEventConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerShutdownEventConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DelayUntilElbConnectionsDrained": cdk.booleanToCloudFormation(properties.delayUntilElbConnectionsDrained),
    "ExecutionTimeout": cdk.numberToCloudFormation(properties.executionTimeout)
  };
}

// @ts-ignore TS6133
function CfnLayerShutdownEventConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayer.ShutdownEventConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.ShutdownEventConfigurationProperty>();
  ret.addPropertyResult("delayUntilElbConnectionsDrained", "DelayUntilElbConnectionsDrained", (properties.DelayUntilElbConnectionsDrained != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DelayUntilElbConnectionsDrained) : undefined));
  ret.addPropertyResult("executionTimeout", "ExecutionTimeout", (properties.ExecutionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExecutionTimeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecycleEventConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LifecycleEventConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerLifecycleEventConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("shutdownEventConfiguration", CfnLayerShutdownEventConfigurationPropertyValidator)(properties.shutdownEventConfiguration));
  return errors.wrap("supplied properties not correct for \"LifecycleEventConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerLifecycleEventConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerLifecycleEventConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ShutdownEventConfiguration": convertCfnLayerShutdownEventConfigurationPropertyToCloudFormation(properties.shutdownEventConfiguration)
  };
}

// @ts-ignore TS6133
function CfnLayerLifecycleEventConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayer.LifecycleEventConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.LifecycleEventConfigurationProperty>();
  ret.addPropertyResult("shutdownEventConfiguration", "ShutdownEventConfiguration", (properties.ShutdownEventConfiguration != null ? CfnLayerShutdownEventConfigurationPropertyFromCloudFormation(properties.ShutdownEventConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoScalingThresholdsProperty`
 *
 * @param properties - the TypeScript properties of a `AutoScalingThresholdsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerAutoScalingThresholdsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuThreshold", cdk.validateNumber)(properties.cpuThreshold));
  errors.collect(cdk.propertyValidator("ignoreMetricsTime", cdk.validateNumber)(properties.ignoreMetricsTime));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.validateNumber)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("loadThreshold", cdk.validateNumber)(properties.loadThreshold));
  errors.collect(cdk.propertyValidator("memoryThreshold", cdk.validateNumber)(properties.memoryThreshold));
  errors.collect(cdk.propertyValidator("thresholdsWaitTime", cdk.validateNumber)(properties.thresholdsWaitTime));
  return errors.wrap("supplied properties not correct for \"AutoScalingThresholdsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerAutoScalingThresholdsPropertyValidator(properties).assertSuccess();
  return {
    "CpuThreshold": cdk.numberToCloudFormation(properties.cpuThreshold),
    "IgnoreMetricsTime": cdk.numberToCloudFormation(properties.ignoreMetricsTime),
    "InstanceCount": cdk.numberToCloudFormation(properties.instanceCount),
    "LoadThreshold": cdk.numberToCloudFormation(properties.loadThreshold),
    "MemoryThreshold": cdk.numberToCloudFormation(properties.memoryThreshold),
    "ThresholdsWaitTime": cdk.numberToCloudFormation(properties.thresholdsWaitTime)
  };
}

// @ts-ignore TS6133
function CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayer.AutoScalingThresholdsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.AutoScalingThresholdsProperty>();
  ret.addPropertyResult("cpuThreshold", "CpuThreshold", (properties.CpuThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuThreshold) : undefined));
  ret.addPropertyResult("ignoreMetricsTime", "IgnoreMetricsTime", (properties.IgnoreMetricsTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.IgnoreMetricsTime) : undefined));
  ret.addPropertyResult("instanceCount", "InstanceCount", (properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined));
  ret.addPropertyResult("loadThreshold", "LoadThreshold", (properties.LoadThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoadThreshold) : undefined));
  ret.addPropertyResult("memoryThreshold", "MemoryThreshold", (properties.MemoryThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryThreshold) : undefined));
  ret.addPropertyResult("thresholdsWaitTime", "ThresholdsWaitTime", (properties.ThresholdsWaitTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdsWaitTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoadBasedAutoScalingProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBasedAutoScalingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerLoadBasedAutoScalingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("downScaling", CfnLayerAutoScalingThresholdsPropertyValidator)(properties.downScaling));
  errors.collect(cdk.propertyValidator("enable", cdk.validateBoolean)(properties.enable));
  errors.collect(cdk.propertyValidator("upScaling", CfnLayerAutoScalingThresholdsPropertyValidator)(properties.upScaling));
  return errors.wrap("supplied properties not correct for \"LoadBasedAutoScalingProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerLoadBasedAutoScalingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerLoadBasedAutoScalingPropertyValidator(properties).assertSuccess();
  return {
    "DownScaling": convertCfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties.downScaling),
    "Enable": cdk.booleanToCloudFormation(properties.enable),
    "UpScaling": convertCfnLayerAutoScalingThresholdsPropertyToCloudFormation(properties.upScaling)
  };
}

// @ts-ignore TS6133
function CfnLayerLoadBasedAutoScalingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayer.LoadBasedAutoScalingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.LoadBasedAutoScalingProperty>();
  ret.addPropertyResult("downScaling", "DownScaling", (properties.DownScaling != null ? CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties.DownScaling) : undefined));
  ret.addPropertyResult("enable", "Enable", (properties.Enable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enable) : undefined));
  ret.addPropertyResult("upScaling", "UpScaling", (properties.UpScaling != null ? CfnLayerAutoScalingThresholdsPropertyFromCloudFormation(properties.UpScaling) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.validateString)(properties.mountPoint));
  errors.collect(cdk.propertyValidator("numberOfDisks", cdk.validateNumber)(properties.numberOfDisks));
  errors.collect(cdk.propertyValidator("raidLevel", cdk.validateNumber)(properties.raidLevel));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"VolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "MountPoint": cdk.stringToCloudFormation(properties.mountPoint),
    "NumberOfDisks": cdk.numberToCloudFormation(properties.numberOfDisks),
    "RaidLevel": cdk.numberToCloudFormation(properties.raidLevel),
    "Size": cdk.numberToCloudFormation(properties.size),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnLayerVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayer.VolumeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayer.VolumeConfigurationProperty>();
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("mountPoint", "MountPoint", (properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined));
  ret.addPropertyResult("numberOfDisks", "NumberOfDisks", (properties.NumberOfDisks != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDisks) : undefined));
  ret.addPropertyResult("raidLevel", "RaidLevel", (properties.RaidLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.RaidLevel) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLayerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("autoAssignElasticIps", cdk.requiredValidator)(properties.autoAssignElasticIps));
  errors.collect(cdk.propertyValidator("autoAssignElasticIps", cdk.validateBoolean)(properties.autoAssignElasticIps));
  errors.collect(cdk.propertyValidator("autoAssignPublicIps", cdk.requiredValidator)(properties.autoAssignPublicIps));
  errors.collect(cdk.propertyValidator("autoAssignPublicIps", cdk.validateBoolean)(properties.autoAssignPublicIps));
  errors.collect(cdk.propertyValidator("customInstanceProfileArn", cdk.validateString)(properties.customInstanceProfileArn));
  errors.collect(cdk.propertyValidator("customJson", cdk.validateObject)(properties.customJson));
  errors.collect(cdk.propertyValidator("customRecipes", CfnLayerRecipesPropertyValidator)(properties.customRecipes));
  errors.collect(cdk.propertyValidator("customSecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.customSecurityGroupIds));
  errors.collect(cdk.propertyValidator("enableAutoHealing", cdk.requiredValidator)(properties.enableAutoHealing));
  errors.collect(cdk.propertyValidator("enableAutoHealing", cdk.validateBoolean)(properties.enableAutoHealing));
  errors.collect(cdk.propertyValidator("installUpdatesOnBoot", cdk.validateBoolean)(properties.installUpdatesOnBoot));
  errors.collect(cdk.propertyValidator("lifecycleEventConfiguration", CfnLayerLifecycleEventConfigurationPropertyValidator)(properties.lifecycleEventConfiguration));
  errors.collect(cdk.propertyValidator("loadBasedAutoScaling", CfnLayerLoadBasedAutoScalingPropertyValidator)(properties.loadBasedAutoScaling));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("packages", cdk.listValidator(cdk.validateString))(properties.packages));
  errors.collect(cdk.propertyValidator("shortname", cdk.requiredValidator)(properties.shortname));
  errors.collect(cdk.propertyValidator("shortname", cdk.validateString)(properties.shortname));
  errors.collect(cdk.propertyValidator("stackId", cdk.requiredValidator)(properties.stackId));
  errors.collect(cdk.propertyValidator("stackId", cdk.validateString)(properties.stackId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("useEbsOptimizedInstances", cdk.validateBoolean)(properties.useEbsOptimizedInstances));
  errors.collect(cdk.propertyValidator("volumeConfigurations", cdk.listValidator(CfnLayerVolumeConfigurationPropertyValidator))(properties.volumeConfigurations));
  return errors.wrap("supplied properties not correct for \"CfnLayerProps\"");
}

// @ts-ignore TS6133
function convertCfnLayerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerPropsValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "AutoAssignElasticIps": cdk.booleanToCloudFormation(properties.autoAssignElasticIps),
    "AutoAssignPublicIps": cdk.booleanToCloudFormation(properties.autoAssignPublicIps),
    "CustomInstanceProfileArn": cdk.stringToCloudFormation(properties.customInstanceProfileArn),
    "CustomJson": cdk.objectToCloudFormation(properties.customJson),
    "CustomRecipes": convertCfnLayerRecipesPropertyToCloudFormation(properties.customRecipes),
    "CustomSecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.customSecurityGroupIds),
    "EnableAutoHealing": cdk.booleanToCloudFormation(properties.enableAutoHealing),
    "InstallUpdatesOnBoot": cdk.booleanToCloudFormation(properties.installUpdatesOnBoot),
    "LifecycleEventConfiguration": convertCfnLayerLifecycleEventConfigurationPropertyToCloudFormation(properties.lifecycleEventConfiguration),
    "LoadBasedAutoScaling": convertCfnLayerLoadBasedAutoScalingPropertyToCloudFormation(properties.loadBasedAutoScaling),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Packages": cdk.listMapper(cdk.stringToCloudFormation)(properties.packages),
    "Shortname": cdk.stringToCloudFormation(properties.shortname),
    "StackId": cdk.stringToCloudFormation(properties.stackId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UseEbsOptimizedInstances": cdk.booleanToCloudFormation(properties.useEbsOptimizedInstances),
    "VolumeConfigurations": cdk.listMapper(convertCfnLayerVolumeConfigurationPropertyToCloudFormation)(properties.volumeConfigurations)
  };
}

// @ts-ignore TS6133
function CfnLayerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerProps>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("autoAssignElasticIps", "AutoAssignElasticIps", (properties.AutoAssignElasticIps != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAssignElasticIps) : undefined));
  ret.addPropertyResult("autoAssignPublicIps", "AutoAssignPublicIps", (properties.AutoAssignPublicIps != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAssignPublicIps) : undefined));
  ret.addPropertyResult("customInstanceProfileArn", "CustomInstanceProfileArn", (properties.CustomInstanceProfileArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomInstanceProfileArn) : undefined));
  ret.addPropertyResult("customJson", "CustomJson", (properties.CustomJson != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomJson) : undefined));
  ret.addPropertyResult("customRecipes", "CustomRecipes", (properties.CustomRecipes != null ? CfnLayerRecipesPropertyFromCloudFormation(properties.CustomRecipes) : undefined));
  ret.addPropertyResult("customSecurityGroupIds", "CustomSecurityGroupIds", (properties.CustomSecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CustomSecurityGroupIds) : undefined));
  ret.addPropertyResult("enableAutoHealing", "EnableAutoHealing", (properties.EnableAutoHealing != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoHealing) : undefined));
  ret.addPropertyResult("installUpdatesOnBoot", "InstallUpdatesOnBoot", (properties.InstallUpdatesOnBoot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InstallUpdatesOnBoot) : undefined));
  ret.addPropertyResult("lifecycleEventConfiguration", "LifecycleEventConfiguration", (properties.LifecycleEventConfiguration != null ? CfnLayerLifecycleEventConfigurationPropertyFromCloudFormation(properties.LifecycleEventConfiguration) : undefined));
  ret.addPropertyResult("loadBasedAutoScaling", "LoadBasedAutoScaling", (properties.LoadBasedAutoScaling != null ? CfnLayerLoadBasedAutoScalingPropertyFromCloudFormation(properties.LoadBasedAutoScaling) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("packages", "Packages", (properties.Packages != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Packages) : undefined));
  ret.addPropertyResult("shortname", "Shortname", (properties.Shortname != null ? cfn_parse.FromCloudFormation.getString(properties.Shortname) : undefined));
  ret.addPropertyResult("stackId", "StackId", (properties.StackId != null ? cfn_parse.FromCloudFormation.getString(properties.StackId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("useEbsOptimizedInstances", "UseEbsOptimizedInstances", (properties.UseEbsOptimizedInstances != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseEbsOptimizedInstances) : undefined));
  ret.addPropertyResult("volumeConfigurations", "VolumeConfigurations", (properties.VolumeConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnLayerVolumeConfigurationPropertyFromCloudFormation)(properties.VolumeConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html.
 *
 * @cloudformationResource AWS::OpsWorks::Stack
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html
 */
export class CfnStack extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::Stack";

  /**
   * Build a CfnStack from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStack {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStack(scope, id, propsResult.value);
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
   * The default AWS OpsWorks Stacks agent version. You have the following options:.
   */
  public agentVersion?: string;

  /**
   * One or more user-defined key-value pairs to be added to the stack attributes.
   */
  public attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * A `ChefConfiguration` object that specifies whether to enable Berkshelf and the Berkshelf version on Chef 11.10 stacks. For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
   */
  public chefConfiguration?: CfnStack.ChefConfigurationProperty | cdk.IResolvable;

  /**
   * If you're cloning an AWS OpsWorks stack, a list of AWS OpsWorks application stack IDs from the source stack to include in the cloned stack.
   */
  public cloneAppIds?: Array<string>;

  /**
   * If you're cloning an AWS OpsWorks stack, indicates whether to clone the source stack's permissions.
   */
  public clonePermissions?: boolean | cdk.IResolvable;

  /**
   * The configuration manager.
   */
  public configurationManager?: cdk.IResolvable | CfnStack.StackConfigurationManagerProperty;

  /**
   * Contains the information required to retrieve an app or cookbook from a repository.
   */
  public customCookbooksSource?: cdk.IResolvable | CfnStack.SourceProperty;

  /**
   * A string that contains user-defined, custom JSON.
   */
  public customJson?: any | cdk.IResolvable;

  /**
   * The stack's default Availability Zone, which must be in the specified region.
   */
  public defaultAvailabilityZone?: string;

  /**
   * The Amazon Resource Name (ARN) of an IAM profile that is the default profile for all of the stack's EC2 instances.
   */
  public defaultInstanceProfileArn: string;

  /**
   * The stack's default operating system, which is installed on every instance unless you specify a different operating system when you create the instance.
   */
  public defaultOs?: string;

  /**
   * The default root device type.
   */
  public defaultRootDeviceType?: string;

  /**
   * A default Amazon EC2 key pair name.
   */
  public defaultSshKeyName?: string;

  /**
   * The stack's default subnet ID.
   */
  public defaultSubnetId?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Elastic Container Service ( Amazon ECS ) cluster to register with the AWS OpsWorks stack.
   */
  public ecsClusterArn?: string;

  /**
   * A list of Elastic IP addresses to register with the AWS OpsWorks stack.
   */
  public elasticIps?: Array<CfnStack.ElasticIpProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The stack's host name theme, with spaces replaced by underscores.
   */
  public hostnameTheme?: string;

  /**
   * The stack name.
   */
  public name: string;

  /**
   * The Amazon Relational Database Service ( Amazon RDS ) database instance to register with the AWS OpsWorks stack.
   */
  public rdsDbInstances?: Array<cdk.IResolvable | CfnStack.RdsDbInstanceProperty> | cdk.IResolvable;

  /**
   * The stack's IAM role, which allows AWS OpsWorks Stacks to work with AWS resources on your behalf.
   */
  public serviceRoleArn: string;

  /**
   * If you're cloning an AWS OpsWorks stack, the stack ID of the source AWS OpsWorks stack to clone.
   */
  public sourceStackId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to a stack or layer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Whether the stack uses custom cookbooks.
   */
  public useCustomCookbooks?: boolean | cdk.IResolvable;

  /**
   * Whether to associate the AWS OpsWorks Stacks built-in security groups with the stack's layers.
   */
  public useOpsworksSecurityGroups?: boolean | cdk.IResolvable;

  /**
   * The ID of the VPC that the stack is to be launched into.
   */
  public vpcId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackProps) {
    super(scope, id, {
      "type": CfnStack.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultInstanceProfileArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "serviceRoleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.agentVersion = props.agentVersion;
    this.attributes = props.attributes;
    this.chefConfiguration = props.chefConfiguration;
    this.cloneAppIds = props.cloneAppIds;
    this.clonePermissions = props.clonePermissions;
    this.configurationManager = props.configurationManager;
    this.customCookbooksSource = props.customCookbooksSource;
    this.customJson = props.customJson;
    this.defaultAvailabilityZone = props.defaultAvailabilityZone;
    this.defaultInstanceProfileArn = props.defaultInstanceProfileArn;
    this.defaultOs = props.defaultOs;
    this.defaultRootDeviceType = props.defaultRootDeviceType;
    this.defaultSshKeyName = props.defaultSshKeyName;
    this.defaultSubnetId = props.defaultSubnetId;
    this.ecsClusterArn = props.ecsClusterArn;
    this.elasticIps = props.elasticIps;
    this.hostnameTheme = props.hostnameTheme;
    this.name = props.name;
    this.rdsDbInstances = props.rdsDbInstances;
    this.serviceRoleArn = props.serviceRoleArn;
    this.sourceStackId = props.sourceStackId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpsWorks::Stack", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.useCustomCookbooks = props.useCustomCookbooks;
    this.useOpsworksSecurityGroups = props.useOpsworksSecurityGroups;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentVersion": this.agentVersion,
      "attributes": this.attributes,
      "chefConfiguration": this.chefConfiguration,
      "cloneAppIds": this.cloneAppIds,
      "clonePermissions": this.clonePermissions,
      "configurationManager": this.configurationManager,
      "customCookbooksSource": this.customCookbooksSource,
      "customJson": this.customJson,
      "defaultAvailabilityZone": this.defaultAvailabilityZone,
      "defaultInstanceProfileArn": this.defaultInstanceProfileArn,
      "defaultOs": this.defaultOs,
      "defaultRootDeviceType": this.defaultRootDeviceType,
      "defaultSshKeyName": this.defaultSshKeyName,
      "defaultSubnetId": this.defaultSubnetId,
      "ecsClusterArn": this.ecsClusterArn,
      "elasticIps": this.elasticIps,
      "hostnameTheme": this.hostnameTheme,
      "name": this.name,
      "rdsDbInstances": this.rdsDbInstances,
      "serviceRoleArn": this.serviceRoleArn,
      "sourceStackId": this.sourceStackId,
      "tags": this.tags.renderTags(),
      "useCustomCookbooks": this.useCustomCookbooks,
      "useOpsworksSecurityGroups": this.useOpsworksSecurityGroups,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStack.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackPropsToCloudFormation(props);
  }
}

export namespace CfnStack {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html
   */
  export interface ChefConfigurationProperty {
    /**
     * The Berkshelf version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-stack-chefconfiguration-berkshelfversion
     */
    readonly berkshelfVersion?: string;

    /**
     * Whether to enable Berkshelf.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-stack-chefconfiguration-manageberkshelf
     */
    readonly manageBerkshelf?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigurationmanager.html
   */
  export interface StackConfigurationManagerProperty {
    /**
     * The name.
     *
     * This parameter must be set to `Chef` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigurationmanager.html#cfn-opsworks-stack-stackconfigurationmanager-name
     */
    readonly name?: string;

    /**
     * The Chef version.
     *
     * This parameter must be set to 12, 11.10, or 11.4 for Linux stacks, and to 12.2 for Windows stacks. The default value for Linux stacks is 12.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigurationmanager.html#cfn-opsworks-stack-stackconfigurationmanager-version
     */
    readonly version?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html
   */
  export interface SourceProperty {
    /**
     * When included in a request, the parameter depends on the repository type.
     *
     * - For Amazon S3 bundles, set `Password` to the appropriate IAM secret access key.
     * - For HTTP bundles and Subversion repositories, set `Password` to the password.
     *
     * For more information on how to safely handle IAM credentials, see [](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html) .
     *
     * In responses, AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-password
     */
    readonly password?: string;

    /**
     * The application's version.
     *
     * AWS OpsWorks Stacks enables you to easily deploy new versions of an application. One of the simplest approaches is to have branches or revisions in your repository that represent different versions that can potentially be deployed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-revision
     */
    readonly revision?: string;

    /**
     * The repository's SSH key.
     *
     * For more information, see [Using Git Repository SSH Keys](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-deploykeys.html) in the *AWS OpsWorks User Guide* . To pass in an SSH key as a parameter, see the following example:
     *
     * `"Parameters" : { "GitSSHKey" : { "Description" : "Change SSH key newlines to commas.", "Type" : "CommaDelimitedList", "NoEcho" : "true" }, ... "CustomCookbooksSource": { "Revision" : { "Ref": "GitRevision"}, "SshKey" : { "Fn::Join" : [ "\n", { "Ref": "GitSSHKey"} ] }, "Type": "git", "Url": { "Ref": "GitURL"} } ...`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-sshkey
     */
    readonly sshKey?: string;

    /**
     * The repository type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-type
     */
    readonly type?: string;

    /**
     * The source URL.
     *
     * The following is an example of an Amazon S3 source URL: `https://s3.amazonaws.com/opsworks-demo-bucket/opsworks_cookbook_demo.tar.gz` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-url
     */
    readonly url?: string;

    /**
     * This parameter depends on the repository type.
     *
     * - For Amazon S3 bundles, set `Username` to the appropriate IAM access key ID.
     * - For HTTP bundles, Git repositories, and Subversion repositories, set `Username` to the user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-source.html#cfn-opsworks-stack-source-username
     */
    readonly username?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html
   */
  export interface ElasticIpProperty {
    /**
     * The IP address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html#cfn-opsworks-stack-elasticip-ip
     */
    readonly ip: string;

    /**
     * The name, which can be a maximum of 32 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-elasticip.html#cfn-opsworks-stack-elasticip-name
     */
    readonly name?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html
   */
  export interface RdsDbInstanceProperty {
    /**
     * AWS OpsWorks Stacks returns `*****FILTERED*****` instead of the actual value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbpassword
     */
    readonly dbPassword: string;

    /**
     * The master user name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbuser
     */
    readonly dbUser: string;

    /**
     * The instance's ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-rdsdbinstancearn
     */
    readonly rdsDbInstanceArn: string;
  }
}

/**
 * Properties for defining a `CfnStack`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html
 */
export interface CfnStackProps {
  /**
   * The default AWS OpsWorks Stacks agent version. You have the following options:.
   *
   * - Auto-update - Set this parameter to `LATEST` . AWS OpsWorks Stacks automatically installs new agent versions on the stack's instances as soon as they are available.
   * - Fixed version - Set this parameter to your preferred agent version. To update the agent version, you must edit the stack configuration and specify a new version. AWS OpsWorks Stacks installs that version on the stack's instances.
   *
   * The default setting is the most recent release of the agent. To specify an agent version, you must use the complete version number, not the abbreviated number shown on the console. For a list of available agent version numbers, call `DescribeAgentVersions` . AgentVersion cannot be set to Chef 12.2.
   *
   * > You can also specify an agent version when you create or update an instance, which overrides the stack's default setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-agentversion
   */
  readonly agentVersion?: string;

  /**
   * One or more user-defined key-value pairs to be added to the stack attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-attributes
   */
  readonly attributes?: cdk.IResolvable | Record<string, string>;

  /**
   * A `ChefConfiguration` object that specifies whether to enable Berkshelf and the Berkshelf version on Chef 11.10 stacks. For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-chefconfiguration
   */
  readonly chefConfiguration?: CfnStack.ChefConfigurationProperty | cdk.IResolvable;

  /**
   * If you're cloning an AWS OpsWorks stack, a list of AWS OpsWorks application stack IDs from the source stack to include in the cloned stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-cloneappids
   */
  readonly cloneAppIds?: Array<string>;

  /**
   * If you're cloning an AWS OpsWorks stack, indicates whether to clone the source stack's permissions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-clonepermissions
   */
  readonly clonePermissions?: boolean | cdk.IResolvable;

  /**
   * The configuration manager.
   *
   * When you create a stack we recommend that you use the configuration manager to specify the Chef version: 12, 11.10, or 11.4 for Linux stacks, or 12.2 for Windows stacks. The default value for Linux stacks is currently 12.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-configurationmanager
   */
  readonly configurationManager?: cdk.IResolvable | CfnStack.StackConfigurationManagerProperty;

  /**
   * Contains the information required to retrieve an app or cookbook from a repository.
   *
   * For more information, see [Adding Apps](https://docs.aws.amazon.com/opsworks/latest/userguide/workingapps-creating.html) or [Cookbooks and Recipes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-customcookbookssource
   */
  readonly customCookbooksSource?: cdk.IResolvable | CfnStack.SourceProperty;

  /**
   * A string that contains user-defined, custom JSON.
   *
   * It can be used to override the corresponding default stack configuration attribute values or to pass data to recipes. The string should be in the following format:
   *
   * `"{\"key1\": \"value1\", \"key2\": \"value2\",...}"`
   *
   * For more information about custom JSON, see [Use Custom JSON to Modify the Stack Configuration Attributes](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-json.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-customjson
   */
  readonly customJson?: any | cdk.IResolvable;

  /**
   * The stack's default Availability Zone, which must be in the specified region.
   *
   * For more information, see [Regions and Endpoints](https://docs.aws.amazon.com/general/latest/gr/rande.html) . If you also specify a value for `DefaultSubnetId` , the subnet must be in the same zone. For more information, see the `VpcId` parameter description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultavailabilityzone
   */
  readonly defaultAvailabilityZone?: string;

  /**
   * The Amazon Resource Name (ARN) of an IAM profile that is the default profile for all of the stack's EC2 instances.
   *
   * For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultinstanceprofilearn
   */
  readonly defaultInstanceProfileArn: string;

  /**
   * The stack's default operating system, which is installed on every instance unless you specify a different operating system when you create the instance.
   *
   * You can specify one of the following.
   *
   * - A supported Linux operating system: An Amazon Linux version, such as `Amazon Linux 2` , `Amazon Linux 2018.03` , `Amazon Linux 2017.09` , `Amazon Linux 2017.03` , `Amazon Linux 2016.09` , `Amazon Linux 2016.03` , `Amazon Linux 2015.09` , or `Amazon Linux 2015.03` .
   * - A supported Ubuntu operating system, such as `Ubuntu 18.04 LTS` , `Ubuntu 16.04 LTS` , `Ubuntu 14.04 LTS` , or `Ubuntu 12.04 LTS` .
   * - `CentOS Linux 7`
   * - `Red Hat Enterprise Linux 7`
   * - A supported Windows operating system, such as `Microsoft Windows Server 2012 R2 Base` , `Microsoft Windows Server 2012 R2 with SQL Server Express` , `Microsoft Windows Server 2012 R2 with SQL Server Standard` , or `Microsoft Windows Server 2012 R2 with SQL Server Web` .
   * - A custom AMI: `Custom` . You specify the custom AMI you want to use when you create instances. For more information, see [Using Custom AMIs](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-custom-ami.html) .
   *
   * The default option is the current Amazon Linux version. Not all operating systems are supported with all versions of Chef. For more information about supported operating systems, see [AWS OpsWorks Stacks Operating Systems](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-os.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultos
   */
  readonly defaultOs?: string;

  /**
   * The default root device type.
   *
   * This value is the default for all instances in the stack, but you can override it when you create an instance. The default option is `instance-store` . For more information, see [Storage for the Root Device](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html#storage-for-the-root-device) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultrootdevicetype
   */
  readonly defaultRootDeviceType?: string;

  /**
   * A default Amazon EC2 key pair name.
   *
   * The default value is none. If you specify a key pair name, AWS OpsWorks installs the public key on the instance and you can use the private key with an SSH client to log in to the instance. For more information, see [Using SSH to Communicate with an Instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-ssh.html) and [Managing SSH Access](https://docs.aws.amazon.com/opsworks/latest/userguide/security-ssh-access.html) . You can override this setting by specifying a different key pair, or no key pair, when you [create an instance](https://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-add.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultsshkeyname
   */
  readonly defaultSshKeyName?: string;

  /**
   * The stack's default subnet ID.
   *
   * All instances are launched into this subnet unless you specify another subnet ID when you create the instance. This parameter is required if you specify a value for the `VpcId` parameter. If you also specify a value for `DefaultAvailabilityZone` , the subnet must be in that zone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-defaultsubnetid
   */
  readonly defaultSubnetId?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Elastic Container Service ( Amazon ECS ) cluster to register with the AWS OpsWorks stack.
   *
   * > If you specify a cluster that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-ecsclusterarn
   */
  readonly ecsClusterArn?: string;

  /**
   * A list of Elastic IP addresses to register with the AWS OpsWorks stack.
   *
   * > If you specify an IP address that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the IP address.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-elasticips
   */
  readonly elasticIps?: Array<CfnStack.ElasticIpProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The stack's host name theme, with spaces replaced by underscores.
   *
   * The theme is used to generate host names for the stack's instances. By default, `HostnameTheme` is set to `Layer_Dependent` , which creates host names by appending integers to the layer's short name. The other themes are:
   *
   * - `Baked_Goods`
   * - `Clouds`
   * - `Europe_Cities`
   * - `Fruits`
   * - `Greek_Deities_and_Titans`
   * - `Legendary_creatures_from_Japan`
   * - `Planets_and_Moons`
   * - `Roman_Deities`
   * - `Scottish_Islands`
   * - `US_Cities`
   * - `Wild_Cats`
   *
   * To obtain a generated host name, call `GetHostNameSuggestion` , which returns a host name based on the current theme.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-hostnametheme
   */
  readonly hostnameTheme?: string;

  /**
   * The stack name.
   *
   * Stack names can be a maximum of 64 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-name
   */
  readonly name: string;

  /**
   * The Amazon Relational Database Service ( Amazon RDS ) database instance to register with the AWS OpsWorks stack.
   *
   * > If you specify a database instance that's registered with another AWS OpsWorks stack, AWS CloudFormation deregisters the existing association before registering the database instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-rdsdbinstances
   */
  readonly rdsDbInstances?: Array<cdk.IResolvable | CfnStack.RdsDbInstanceProperty> | cdk.IResolvable;

  /**
   * The stack's IAM role, which allows AWS OpsWorks Stacks to work with AWS resources on your behalf.
   *
   * You must set this parameter to the Amazon Resource Name (ARN) for an existing IAM role. For more information about IAM ARNs, see [Using Identifiers](https://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-servicerolearn
   */
  readonly serviceRoleArn: string;

  /**
   * If you're cloning an AWS OpsWorks stack, the stack ID of the source AWS OpsWorks stack to clone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-sourcestackid
   */
  readonly sourceStackId?: string;

  /**
   * A map that contains tag keys and tag values that are attached to a stack or layer.
   *
   * - The key cannot be empty.
   * - The key can be a maximum of 127 characters, and can contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
   * - The value can be a maximum 255 characters, and contain only Unicode letters, numbers, or separators, or the following special characters: `+ - = . _ : /`
   * - Leading and trailing white spaces are trimmed from both the key and value.
   * - A maximum of 40 tags is allowed for any resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Whether the stack uses custom cookbooks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-usecustomcookbooks
   */
  readonly useCustomCookbooks?: boolean | cdk.IResolvable;

  /**
   * Whether to associate the AWS OpsWorks Stacks built-in security groups with the stack's layers.
   *
   * AWS OpsWorks Stacks provides a standard set of built-in security groups, one for each layer, which are associated with layers by default. With `UseOpsworksSecurityGroups` you can instead provide your own custom security groups. `UseOpsworksSecurityGroups` has the following settings:
   *
   * - True - AWS OpsWorks Stacks automatically associates the appropriate built-in security group with each layer (default setting). You can associate additional security groups with a layer after you create it, but you cannot delete the built-in security group.
   * - False - AWS OpsWorks Stacks does not associate built-in security groups with layers. You must create appropriate EC2 security groups and associate a security group with each layer that you create. However, you can still manually associate a built-in security group with a layer on creation; custom security groups are required only for those layers that need custom settings.
   *
   * For more information, see [Create a New Stack](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-creating.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-useopsworkssecuritygroups
   */
  readonly useOpsworksSecurityGroups?: boolean | cdk.IResolvable;

  /**
   * The ID of the VPC that the stack is to be launched into.
   *
   * The VPC must be in the stack's region. All instances are launched into this VPC. You cannot change the ID later.
   *
   * - If your account supports EC2-Classic, the default value is `no VPC` .
   * - If your account does not support EC2-Classic, the default value is the default VPC for the specified region.
   *
   * If the VPC ID corresponds to a default VPC and you have specified either the `DefaultAvailabilityZone` or the `DefaultSubnetId` parameter only, AWS OpsWorks Stacks infers the value of the other parameter. If you specify neither parameter, AWS OpsWorks Stacks sets these parameters to the first valid Availability Zone for the specified region and the corresponding default VPC subnet ID, respectively.
   *
   * If you specify a nondefault VPC ID, note the following:
   *
   * - It must belong to a VPC in your account that is in the specified region.
   * - You must specify a value for `DefaultSubnetId` .
   *
   * For more information about how to use AWS OpsWorks Stacks with a VPC, see [Running a Stack in a VPC](https://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-vpc.html) . For more information about default VPC and EC2-Classic, see [Supported Platforms](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-supported-platforms.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-stack.html#cfn-opsworks-stack-vpcid
   */
  readonly vpcId?: string;
}

/**
 * Determine whether the given properties match those of a `ChefConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ChefConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackChefConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("berkshelfVersion", cdk.validateString)(properties.berkshelfVersion));
  errors.collect(cdk.propertyValidator("manageBerkshelf", cdk.validateBoolean)(properties.manageBerkshelf));
  return errors.wrap("supplied properties not correct for \"ChefConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackChefConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackChefConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BerkshelfVersion": cdk.stringToCloudFormation(properties.berkshelfVersion),
    "ManageBerkshelf": cdk.booleanToCloudFormation(properties.manageBerkshelf)
  };
}

// @ts-ignore TS6133
function CfnStackChefConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.ChefConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.ChefConfigurationProperty>();
  ret.addPropertyResult("berkshelfVersion", "BerkshelfVersion", (properties.BerkshelfVersion != null ? cfn_parse.FromCloudFormation.getString(properties.BerkshelfVersion) : undefined));
  ret.addPropertyResult("manageBerkshelf", "ManageBerkshelf", (properties.ManageBerkshelf != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ManageBerkshelf) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StackConfigurationManagerProperty`
 *
 * @param properties - the TypeScript properties of a `StackConfigurationManagerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackStackConfigurationManagerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"StackConfigurationManagerProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackStackConfigurationManagerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackStackConfigurationManagerPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnStackStackConfigurationManagerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.StackConfigurationManagerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.StackConfigurationManagerProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceProperty`
 *
 * @param properties - the TypeScript properties of a `SourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("revision", cdk.validateString)(properties.revision));
  errors.collect(cdk.propertyValidator("sshKey", cdk.validateString)(properties.sshKey));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"SourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSourcePropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Revision": cdk.stringToCloudFormation(properties.revision),
    "SshKey": cdk.stringToCloudFormation(properties.sshKey),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Url": cdk.stringToCloudFormation(properties.url),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnStackSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.SourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.SourceProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("revision", "Revision", (properties.Revision != null ? cfn_parse.FromCloudFormation.getString(properties.Revision) : undefined));
  ret.addPropertyResult("sshKey", "SshKey", (properties.SshKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshKey) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticIpProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticIpProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackElasticIpPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ip", cdk.requiredValidator)(properties.ip));
  errors.collect(cdk.propertyValidator("ip", cdk.validateString)(properties.ip));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ElasticIpProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackElasticIpPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackElasticIpPropertyValidator(properties).assertSuccess();
  return {
    "Ip": cdk.stringToCloudFormation(properties.ip),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnStackElasticIpPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStack.ElasticIpProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.ElasticIpProperty>();
  ret.addPropertyResult("ip", "Ip", (properties.Ip != null ? cfn_parse.FromCloudFormation.getString(properties.Ip) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RdsDbInstanceProperty`
 *
 * @param properties - the TypeScript properties of a `RdsDbInstanceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackRdsDbInstancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dbPassword", cdk.requiredValidator)(properties.dbPassword));
  errors.collect(cdk.propertyValidator("dbPassword", cdk.validateString)(properties.dbPassword));
  errors.collect(cdk.propertyValidator("dbUser", cdk.requiredValidator)(properties.dbUser));
  errors.collect(cdk.propertyValidator("dbUser", cdk.validateString)(properties.dbUser));
  errors.collect(cdk.propertyValidator("rdsDbInstanceArn", cdk.requiredValidator)(properties.rdsDbInstanceArn));
  errors.collect(cdk.propertyValidator("rdsDbInstanceArn", cdk.validateString)(properties.rdsDbInstanceArn));
  return errors.wrap("supplied properties not correct for \"RdsDbInstanceProperty\"");
}

// @ts-ignore TS6133
function convertCfnStackRdsDbInstancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackRdsDbInstancePropertyValidator(properties).assertSuccess();
  return {
    "DbPassword": cdk.stringToCloudFormation(properties.dbPassword),
    "DbUser": cdk.stringToCloudFormation(properties.dbUser),
    "RdsDbInstanceArn": cdk.stringToCloudFormation(properties.rdsDbInstanceArn)
  };
}

// @ts-ignore TS6133
function CfnStackRdsDbInstancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStack.RdsDbInstanceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStack.RdsDbInstanceProperty>();
  ret.addPropertyResult("dbPassword", "DbPassword", (properties.DbPassword != null ? cfn_parse.FromCloudFormation.getString(properties.DbPassword) : undefined));
  ret.addPropertyResult("dbUser", "DbUser", (properties.DbUser != null ? cfn_parse.FromCloudFormation.getString(properties.DbUser) : undefined));
  ret.addPropertyResult("rdsDbInstanceArn", "RdsDbInstanceArn", (properties.RdsDbInstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.RdsDbInstanceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStackProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentVersion", cdk.validateString)(properties.agentVersion));
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("chefConfiguration", CfnStackChefConfigurationPropertyValidator)(properties.chefConfiguration));
  errors.collect(cdk.propertyValidator("cloneAppIds", cdk.listValidator(cdk.validateString))(properties.cloneAppIds));
  errors.collect(cdk.propertyValidator("clonePermissions", cdk.validateBoolean)(properties.clonePermissions));
  errors.collect(cdk.propertyValidator("configurationManager", CfnStackStackConfigurationManagerPropertyValidator)(properties.configurationManager));
  errors.collect(cdk.propertyValidator("customCookbooksSource", CfnStackSourcePropertyValidator)(properties.customCookbooksSource));
  errors.collect(cdk.propertyValidator("customJson", cdk.validateObject)(properties.customJson));
  errors.collect(cdk.propertyValidator("defaultAvailabilityZone", cdk.validateString)(properties.defaultAvailabilityZone));
  errors.collect(cdk.propertyValidator("defaultInstanceProfileArn", cdk.requiredValidator)(properties.defaultInstanceProfileArn));
  errors.collect(cdk.propertyValidator("defaultInstanceProfileArn", cdk.validateString)(properties.defaultInstanceProfileArn));
  errors.collect(cdk.propertyValidator("defaultOs", cdk.validateString)(properties.defaultOs));
  errors.collect(cdk.propertyValidator("defaultRootDeviceType", cdk.validateString)(properties.defaultRootDeviceType));
  errors.collect(cdk.propertyValidator("defaultSshKeyName", cdk.validateString)(properties.defaultSshKeyName));
  errors.collect(cdk.propertyValidator("defaultSubnetId", cdk.validateString)(properties.defaultSubnetId));
  errors.collect(cdk.propertyValidator("ecsClusterArn", cdk.validateString)(properties.ecsClusterArn));
  errors.collect(cdk.propertyValidator("elasticIps", cdk.listValidator(CfnStackElasticIpPropertyValidator))(properties.elasticIps));
  errors.collect(cdk.propertyValidator("hostnameTheme", cdk.validateString)(properties.hostnameTheme));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rdsDbInstances", cdk.listValidator(CfnStackRdsDbInstancePropertyValidator))(properties.rdsDbInstances));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.requiredValidator)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("serviceRoleArn", cdk.validateString)(properties.serviceRoleArn));
  errors.collect(cdk.propertyValidator("sourceStackId", cdk.validateString)(properties.sourceStackId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("useCustomCookbooks", cdk.validateBoolean)(properties.useCustomCookbooks));
  errors.collect(cdk.propertyValidator("useOpsworksSecurityGroups", cdk.validateBoolean)(properties.useOpsworksSecurityGroups));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnStackProps\"");
}

// @ts-ignore TS6133
function convertCfnStackPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackPropsValidator(properties).assertSuccess();
  return {
    "AgentVersion": cdk.stringToCloudFormation(properties.agentVersion),
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "ChefConfiguration": convertCfnStackChefConfigurationPropertyToCloudFormation(properties.chefConfiguration),
    "CloneAppIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.cloneAppIds),
    "ClonePermissions": cdk.booleanToCloudFormation(properties.clonePermissions),
    "ConfigurationManager": convertCfnStackStackConfigurationManagerPropertyToCloudFormation(properties.configurationManager),
    "CustomCookbooksSource": convertCfnStackSourcePropertyToCloudFormation(properties.customCookbooksSource),
    "CustomJson": cdk.objectToCloudFormation(properties.customJson),
    "DefaultAvailabilityZone": cdk.stringToCloudFormation(properties.defaultAvailabilityZone),
    "DefaultInstanceProfileArn": cdk.stringToCloudFormation(properties.defaultInstanceProfileArn),
    "DefaultOs": cdk.stringToCloudFormation(properties.defaultOs),
    "DefaultRootDeviceType": cdk.stringToCloudFormation(properties.defaultRootDeviceType),
    "DefaultSshKeyName": cdk.stringToCloudFormation(properties.defaultSshKeyName),
    "DefaultSubnetId": cdk.stringToCloudFormation(properties.defaultSubnetId),
    "EcsClusterArn": cdk.stringToCloudFormation(properties.ecsClusterArn),
    "ElasticIps": cdk.listMapper(convertCfnStackElasticIpPropertyToCloudFormation)(properties.elasticIps),
    "HostnameTheme": cdk.stringToCloudFormation(properties.hostnameTheme),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RdsDbInstances": cdk.listMapper(convertCfnStackRdsDbInstancePropertyToCloudFormation)(properties.rdsDbInstances),
    "ServiceRoleArn": cdk.stringToCloudFormation(properties.serviceRoleArn),
    "SourceStackId": cdk.stringToCloudFormation(properties.sourceStackId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UseCustomCookbooks": cdk.booleanToCloudFormation(properties.useCustomCookbooks),
    "UseOpsworksSecurityGroups": cdk.booleanToCloudFormation(properties.useOpsworksSecurityGroups),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnStackPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackProps>();
  ret.addPropertyResult("agentVersion", "AgentVersion", (properties.AgentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AgentVersion) : undefined));
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("chefConfiguration", "ChefConfiguration", (properties.ChefConfiguration != null ? CfnStackChefConfigurationPropertyFromCloudFormation(properties.ChefConfiguration) : undefined));
  ret.addPropertyResult("cloneAppIds", "CloneAppIds", (properties.CloneAppIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CloneAppIds) : undefined));
  ret.addPropertyResult("clonePermissions", "ClonePermissions", (properties.ClonePermissions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ClonePermissions) : undefined));
  ret.addPropertyResult("configurationManager", "ConfigurationManager", (properties.ConfigurationManager != null ? CfnStackStackConfigurationManagerPropertyFromCloudFormation(properties.ConfigurationManager) : undefined));
  ret.addPropertyResult("customCookbooksSource", "CustomCookbooksSource", (properties.CustomCookbooksSource != null ? CfnStackSourcePropertyFromCloudFormation(properties.CustomCookbooksSource) : undefined));
  ret.addPropertyResult("customJson", "CustomJson", (properties.CustomJson != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomJson) : undefined));
  ret.addPropertyResult("defaultAvailabilityZone", "DefaultAvailabilityZone", (properties.DefaultAvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAvailabilityZone) : undefined));
  ret.addPropertyResult("defaultInstanceProfileArn", "DefaultInstanceProfileArn", (properties.DefaultInstanceProfileArn != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultInstanceProfileArn) : undefined));
  ret.addPropertyResult("defaultOs", "DefaultOs", (properties.DefaultOs != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultOs) : undefined));
  ret.addPropertyResult("defaultRootDeviceType", "DefaultRootDeviceType", (properties.DefaultRootDeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultRootDeviceType) : undefined));
  ret.addPropertyResult("defaultSshKeyName", "DefaultSshKeyName", (properties.DefaultSshKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSshKeyName) : undefined));
  ret.addPropertyResult("defaultSubnetId", "DefaultSubnetId", (properties.DefaultSubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubnetId) : undefined));
  ret.addPropertyResult("ecsClusterArn", "EcsClusterArn", (properties.EcsClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.EcsClusterArn) : undefined));
  ret.addPropertyResult("elasticIps", "ElasticIps", (properties.ElasticIps != null ? cfn_parse.FromCloudFormation.getArray(CfnStackElasticIpPropertyFromCloudFormation)(properties.ElasticIps) : undefined));
  ret.addPropertyResult("hostnameTheme", "HostnameTheme", (properties.HostnameTheme != null ? cfn_parse.FromCloudFormation.getString(properties.HostnameTheme) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rdsDbInstances", "RdsDbInstances", (properties.RdsDbInstances != null ? cfn_parse.FromCloudFormation.getArray(CfnStackRdsDbInstancePropertyFromCloudFormation)(properties.RdsDbInstances) : undefined));
  ret.addPropertyResult("serviceRoleArn", "ServiceRoleArn", (properties.ServiceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRoleArn) : undefined));
  ret.addPropertyResult("sourceStackId", "SourceStackId", (properties.SourceStackId != null ? cfn_parse.FromCloudFormation.getString(properties.SourceStackId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("useCustomCookbooks", "UseCustomCookbooks", (properties.UseCustomCookbooks != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCustomCookbooks) : undefined));
  ret.addPropertyResult("useOpsworksSecurityGroups", "UseOpsworksSecurityGroups", (properties.UseOpsworksSecurityGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseOpsworksSecurityGroups) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html.
 *
 * @cloudformationResource AWS::OpsWorks::UserProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html
 */
export class CfnUserProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::UserProfile";

  /**
   * Build a CfnUserProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserProfile(scope, id, propsResult.value);
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
   * The user's SSH user name, as a string.
   *
   * @cloudformationAttribute SshUsername
   */
  public readonly attrSshUsername: string;

  /**
   * Whether users can specify their own SSH public key through the My Settings page.
   */
  public allowSelfManagement?: boolean | cdk.IResolvable;

  /**
   * The user's IAM ARN.
   */
  public iamUserArn: string;

  /**
   * The user's SSH public key.
   */
  public sshPublicKey?: string;

  /**
   * The user's SSH user name.
   */
  public sshUsername?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProfileProps) {
    super(scope, id, {
      "type": CfnUserProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "iamUserArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrSshUsername = cdk.Token.asString(this.getAtt("SshUsername", cdk.ResolutionTypeHint.STRING));
    this.allowSelfManagement = props.allowSelfManagement;
    this.iamUserArn = props.iamUserArn;
    this.sshPublicKey = props.sshPublicKey;
    this.sshUsername = props.sshUsername;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowSelfManagement": this.allowSelfManagement,
      "iamUserArn": this.iamUserArn,
      "sshPublicKey": this.sshPublicKey,
      "sshUsername": this.sshUsername
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html
 */
export interface CfnUserProfileProps {
  /**
   * Whether users can specify their own SSH public key through the My Settings page.
   *
   * For more information, see [Managing User Permissions](https://docs.aws.amazon.com/opsworks/latest/userguide/security-settingsshkey.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-allowselfmanagement
   */
  readonly allowSelfManagement?: boolean | cdk.IResolvable;

  /**
   * The user's IAM ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-iamuserarn
   */
  readonly iamUserArn: string;

  /**
   * The user's SSH public key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshpublickey
   */
  readonly sshPublicKey?: string;

  /**
   * The user's SSH user name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html#cfn-opsworks-userprofile-sshusername
   */
  readonly sshUsername?: string;
}

/**
 * Determine whether the given properties match those of a `CfnUserProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowSelfManagement", cdk.validateBoolean)(properties.allowSelfManagement));
  errors.collect(cdk.propertyValidator("iamUserArn", cdk.requiredValidator)(properties.iamUserArn));
  errors.collect(cdk.propertyValidator("iamUserArn", cdk.validateString)(properties.iamUserArn));
  errors.collect(cdk.propertyValidator("sshPublicKey", cdk.validateString)(properties.sshPublicKey));
  errors.collect(cdk.propertyValidator("sshUsername", cdk.validateString)(properties.sshUsername));
  return errors.wrap("supplied properties not correct for \"CfnUserProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnUserProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserProfilePropsValidator(properties).assertSuccess();
  return {
    "AllowSelfManagement": cdk.booleanToCloudFormation(properties.allowSelfManagement),
    "IamUserArn": cdk.stringToCloudFormation(properties.iamUserArn),
    "SshPublicKey": cdk.stringToCloudFormation(properties.sshPublicKey),
    "SshUsername": cdk.stringToCloudFormation(properties.sshUsername)
  };
}

// @ts-ignore TS6133
function CfnUserProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProfileProps>();
  ret.addPropertyResult("allowSelfManagement", "AllowSelfManagement", (properties.AllowSelfManagement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowSelfManagement) : undefined));
  ret.addPropertyResult("iamUserArn", "IamUserArn", (properties.IamUserArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamUserArn) : undefined));
  ret.addPropertyResult("sshPublicKey", "SshPublicKey", (properties.SshPublicKey != null ? cfn_parse.FromCloudFormation.getString(properties.SshPublicKey) : undefined));
  ret.addPropertyResult("sshUsername", "SshUsername", (properties.SshUsername != null ? cfn_parse.FromCloudFormation.getString(properties.SshUsername) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html.
 *
 * @cloudformationResource AWS::OpsWorks::Volume
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html
 */
export class CfnVolume extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpsWorks::Volume";

  /**
   * Build a CfnVolume from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVolume {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVolumePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVolume(scope, id, propsResult.value);
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
   * The Amazon EC2 volume ID.
   */
  public ec2VolumeId: string;

  /**
   * The volume mount point.
   */
  public mountPoint?: string;

  /**
   * The volume name.
   */
  public name?: string;

  /**
   * The stack ID.
   */
  public stackId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVolumeProps) {
    super(scope, id, {
      "type": CfnVolume.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ec2VolumeId", this);
    cdk.requireProperty(props, "stackId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.ec2VolumeId = props.ec2VolumeId;
    this.mountPoint = props.mountPoint;
    this.name = props.name;
    this.stackId = props.stackId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ec2VolumeId": this.ec2VolumeId,
      "mountPoint": this.mountPoint,
      "name": this.name,
      "stackId": this.stackId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVolume.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVolumePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVolume`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html
 */
export interface CfnVolumeProps {
  /**
   * The Amazon EC2 volume ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-ec2volumeid
   */
  readonly ec2VolumeId: string;

  /**
   * The volume mount point.
   *
   * For example, "/mnt/disk1".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-mountpoint
   */
  readonly mountPoint?: string;

  /**
   * The volume name.
   *
   * Volume names are a maximum of 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-name
   */
  readonly name?: string;

  /**
   * The stack ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-volume.html#cfn-opsworks-volume-stackid
   */
  readonly stackId: string;
}

/**
 * Determine whether the given properties match those of a `CfnVolumeProps`
 *
 * @param properties - the TypeScript properties of a `CfnVolumeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVolumePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ec2VolumeId", cdk.requiredValidator)(properties.ec2VolumeId));
  errors.collect(cdk.propertyValidator("ec2VolumeId", cdk.validateString)(properties.ec2VolumeId));
  errors.collect(cdk.propertyValidator("mountPoint", cdk.validateString)(properties.mountPoint));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("stackId", cdk.requiredValidator)(properties.stackId));
  errors.collect(cdk.propertyValidator("stackId", cdk.validateString)(properties.stackId));
  return errors.wrap("supplied properties not correct for \"CfnVolumeProps\"");
}

// @ts-ignore TS6133
function convertCfnVolumePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVolumePropsValidator(properties).assertSuccess();
  return {
    "Ec2VolumeId": cdk.stringToCloudFormation(properties.ec2VolumeId),
    "MountPoint": cdk.stringToCloudFormation(properties.mountPoint),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StackId": cdk.stringToCloudFormation(properties.stackId)
  };
}

// @ts-ignore TS6133
function CfnVolumePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVolumeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVolumeProps>();
  ret.addPropertyResult("ec2VolumeId", "Ec2VolumeId", (properties.Ec2VolumeId != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2VolumeId) : undefined));
  ret.addPropertyResult("mountPoint", "MountPoint", (properties.MountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.MountPoint) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("stackId", "StackId", (properties.StackId != null ? cfn_parse.FromCloudFormation.getString(properties.StackId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}