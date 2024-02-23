/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an API destination, which is an HTTP invocation endpoint configured as a target for events.
 *
 * When using ApiDesinations with OAuth authentication we recommend these best practices:
 *
 * - Create a secret in Secrets Manager with your OAuth credentials.
 * - Reference that secret in your CloudFormation template for `AWS::Events::Connection` using CloudFormation dynamic reference syntax. For more information, see [Secrets Manager secrets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) .
 *
 * When the Connection resource is created the secret will be passed to EventBridge and stored in the customer account using “Service Linked Secrets,” effectively creating two secrets. This will minimize the cost because the original secret is only accessed when a CloudFormation template is created or updated, not every time an event is sent to the ApiDestination. The secret stored in the customer account by EventBridge is the one used for each event sent to the ApiDestination and AWS is responsible for the fees.
 *
 * > The secret stored in the customer account by EventBridge can’t be updated directly, only when a CloudFormation template is updated.
 *
 * For examples of CloudFormation templates that use secrets, see [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html#aws-resource-events-connection--examples) .
 *
 * @cloudformationResource AWS::Events::ApiDestination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html
 */
export class CfnApiDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::ApiDestination";

  /**
   * Build a CfnApiDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApiDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApiDestination(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the API destination that was created by the request.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ARN of the connection to use for the API destination.
   */
  public connectionArn: string;

  /**
   * A description for the API destination to create.
   */
  public description?: string;

  /**
   * The method to use for the request to the HTTP invocation endpoint.
   */
  public httpMethod: string;

  /**
   * The URL to the HTTP invocation endpoint for the API destination.
   */
  public invocationEndpoint: string;

  /**
   * The maximum number of requests per second to send to the HTTP invocation endpoint.
   */
  public invocationRateLimitPerSecond?: number;

  /**
   * The name for the API destination to create.
   */
  public name?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiDestinationProps) {
    super(scope, id, {
      "type": CfnApiDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectionArn", this);
    cdk.requireProperty(props, "httpMethod", this);
    cdk.requireProperty(props, "invocationEndpoint", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.connectionArn = props.connectionArn;
    this.description = props.description;
    this.httpMethod = props.httpMethod;
    this.invocationEndpoint = props.invocationEndpoint;
    this.invocationRateLimitPerSecond = props.invocationRateLimitPerSecond;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectionArn": this.connectionArn,
      "description": this.description,
      "httpMethod": this.httpMethod,
      "invocationEndpoint": this.invocationEndpoint,
      "invocationRateLimitPerSecond": this.invocationRateLimitPerSecond,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiDestinationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApiDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html
 */
export interface CfnApiDestinationProps {
  /**
   * The ARN of the connection to use for the API destination.
   *
   * The destination endpoint must support the authorization type specified for the connection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-connectionarn
   */
  readonly connectionArn: string;

  /**
   * A description for the API destination to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-description
   */
  readonly description?: string;

  /**
   * The method to use for the request to the HTTP invocation endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-httpmethod
   */
  readonly httpMethod: string;

  /**
   * The URL to the HTTP invocation endpoint for the API destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-invocationendpoint
   */
  readonly invocationEndpoint: string;

  /**
   * The maximum number of requests per second to send to the HTTP invocation endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-invocationratelimitpersecond
   */
  readonly invocationRateLimitPerSecond?: number;

  /**
   * The name for the API destination to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html#cfn-events-apidestination-name
   */
  readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `CfnApiDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionArn", cdk.requiredValidator)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.requiredValidator)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("invocationEndpoint", cdk.requiredValidator)(properties.invocationEndpoint));
  errors.collect(cdk.propertyValidator("invocationEndpoint", cdk.validateString)(properties.invocationEndpoint));
  errors.collect(cdk.propertyValidator("invocationRateLimitPerSecond", cdk.validateNumber)(properties.invocationRateLimitPerSecond));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnApiDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnApiDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiDestinationPropsValidator(properties).assertSuccess();
  return {
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "HttpMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "InvocationEndpoint": cdk.stringToCloudFormation(properties.invocationEndpoint),
    "InvocationRateLimitPerSecond": cdk.numberToCloudFormation(properties.invocationRateLimitPerSecond),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnApiDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiDestinationProps>();
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("httpMethod", "HttpMethod", (properties.HttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HttpMethod) : undefined));
  ret.addPropertyResult("invocationEndpoint", "InvocationEndpoint", (properties.InvocationEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationEndpoint) : undefined));
  ret.addPropertyResult("invocationRateLimitPerSecond", "InvocationRateLimitPerSecond", (properties.InvocationRateLimitPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.InvocationRateLimitPerSecond) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an archive of events with the specified settings.
 *
 * When you create an archive, incoming events might not immediately start being sent to the archive. Allow a short period of time for changes to take effect. If you do not specify a pattern to filter events sent to the archive, all events are sent to the archive except replayed events. Replayed events are not sent to an archive.
 *
 * @cloudformationResource AWS::Events::Archive
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html
 */
export class CfnArchive extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::Archive";

  /**
   * Build a CfnArchive from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnArchive {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnArchivePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnArchive(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the archive created.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name for the archive to create.
   */
  public archiveName?: string;

  /**
   * A description for the archive.
   */
  public description?: string;

  /**
   * An event pattern to use to filter events sent to the archive.
   */
  public eventPattern?: any | cdk.IResolvable;

  /**
   * The number of days to retain events for.
   */
  public retentionDays?: number;

  /**
   * The ARN of the event bus that sends events to the archive.
   */
  public sourceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnArchiveProps) {
    super(scope, id, {
      "type": CfnArchive.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "sourceArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.archiveName = props.archiveName;
    this.description = props.description;
    this.eventPattern = props.eventPattern;
    this.retentionDays = props.retentionDays;
    this.sourceArn = props.sourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "archiveName": this.archiveName,
      "description": this.description,
      "eventPattern": this.eventPattern,
      "retentionDays": this.retentionDays,
      "sourceArn": this.sourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnArchive.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnArchivePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnArchive`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html
 */
export interface CfnArchiveProps {
  /**
   * The name for the archive to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html#cfn-events-archive-archivename
   */
  readonly archiveName?: string;

  /**
   * A description for the archive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html#cfn-events-archive-description
   */
  readonly description?: string;

  /**
   * An event pattern to use to filter events sent to the archive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html#cfn-events-archive-eventpattern
   */
  readonly eventPattern?: any | cdk.IResolvable;

  /**
   * The number of days to retain events for.
   *
   * Default value is 0. If set to 0, events are retained indefinitely
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html#cfn-events-archive-retentiondays
   */
  readonly retentionDays?: number;

  /**
   * The ARN of the event bus that sends events to the archive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html#cfn-events-archive-sourcearn
   */
  readonly sourceArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnArchiveProps`
 *
 * @param properties - the TypeScript properties of a `CfnArchiveProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnArchivePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("archiveName", cdk.validateString)(properties.archiveName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventPattern", cdk.validateObject)(properties.eventPattern));
  errors.collect(cdk.propertyValidator("retentionDays", cdk.validateNumber)(properties.retentionDays));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.requiredValidator)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  return errors.wrap("supplied properties not correct for \"CfnArchiveProps\"");
}

// @ts-ignore TS6133
function convertCfnArchivePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnArchivePropsValidator(properties).assertSuccess();
  return {
    "ArchiveName": cdk.stringToCloudFormation(properties.archiveName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventPattern": cdk.objectToCloudFormation(properties.eventPattern),
    "RetentionDays": cdk.numberToCloudFormation(properties.retentionDays),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn)
  };
}

// @ts-ignore TS6133
function CfnArchivePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnArchiveProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnArchiveProps>();
  ret.addPropertyResult("archiveName", "ArchiveName", (properties.ArchiveName != null ? cfn_parse.FromCloudFormation.getString(properties.ArchiveName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventPattern", "EventPattern", (properties.EventPattern != null ? cfn_parse.FromCloudFormation.getAny(properties.EventPattern) : undefined));
  ret.addPropertyResult("retentionDays", "RetentionDays", (properties.RetentionDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionDays) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a connection.
 *
 * A connection defines the authorization type and credentials to use for authorization with an API destination HTTP endpoint.
 *
 * @cloudformationResource AWS::Events::Connection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html
 */
export class CfnConnection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::Connection";

  /**
   * Build a CfnConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the connection that was created by the request.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ARN for the secret created for the connection.
   *
   * @cloudformationAttribute SecretArn
   */
  public readonly attrSecretArn: string;

  /**
   * The type of authorization to use for the connection.
   */
  public authorizationType: string;

  /**
   * A `CreateConnectionAuthRequestParameters` object that contains the authorization parameters to use to authorize with the endpoint.
   */
  public authParameters?: CfnConnection.AuthParametersProperty | cdk.IResolvable;

  /**
   * A description for the connection to create.
   */
  public description?: string;

  /**
   * The name for the connection to create.
   */
  public name?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectionProps) {
    super(scope, id, {
      "type": CfnConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "authorizationType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrSecretArn = cdk.Token.asString(this.getAtt("SecretArn", cdk.ResolutionTypeHint.STRING));
    this.authorizationType = props.authorizationType;
    this.authParameters = props.authParameters;
    this.description = props.description;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorizationType": this.authorizationType,
      "authParameters": this.authParameters,
      "description": this.description,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectionPropsToCloudFormation(props);
  }
}

export namespace CfnConnection {
  /**
   * Contains the authorization parameters to use for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-authparameters.html
   */
  export interface AuthParametersProperty {
    /**
     * The API Key parameters to use for authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-authparameters.html#cfn-events-connection-authparameters-apikeyauthparameters
     */
    readonly apiKeyAuthParameters?: CfnConnection.ApiKeyAuthParametersProperty | cdk.IResolvable;

    /**
     * The authorization parameters for Basic authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-authparameters.html#cfn-events-connection-authparameters-basicauthparameters
     */
    readonly basicAuthParameters?: CfnConnection.BasicAuthParametersProperty | cdk.IResolvable;

    /**
     * Additional parameters for the connection that are passed through with every invocation to the HTTP endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-authparameters.html#cfn-events-connection-authparameters-invocationhttpparameters
     */
    readonly invocationHttpParameters?: CfnConnection.ConnectionHttpParametersProperty | cdk.IResolvable;

    /**
     * The OAuth parameters to use for authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-authparameters.html#cfn-events-connection-authparameters-oauthparameters
     */
    readonly oAuthParameters?: cdk.IResolvable | CfnConnection.OAuthParametersProperty;
  }

  /**
   * Contains additional parameters for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-connectionhttpparameters.html
   */
  export interface ConnectionHttpParametersProperty {
    /**
     * Contains additional body string parameters for the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-connectionhttpparameters.html#cfn-events-connection-connectionhttpparameters-bodyparameters
     */
    readonly bodyParameters?: Array<cdk.IResolvable | CfnConnection.ParameterProperty> | cdk.IResolvable;

    /**
     * Contains additional header parameters for the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-connectionhttpparameters.html#cfn-events-connection-connectionhttpparameters-headerparameters
     */
    readonly headerParameters?: Array<cdk.IResolvable | CfnConnection.ParameterProperty> | cdk.IResolvable;

    /**
     * Contains additional query string parameters for the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-connectionhttpparameters.html#cfn-events-connection-connectionhttpparameters-querystringparameters
     */
    readonly queryStringParameters?: Array<cdk.IResolvable | CfnConnection.ParameterProperty> | cdk.IResolvable;
  }

  /**
   * Additional query string parameter for the connection.
   *
   * You can include up to 100 additional query string parameters per request. Each additional parameter counts towards the event payload size, which cannot exceed 64 KB.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-parameter.html
   */
  export interface ParameterProperty {
    /**
     * Specifies whether the value is secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-parameter.html#cfn-events-connection-parameter-isvaluesecret
     */
    readonly isValueSecret?: boolean | cdk.IResolvable;

    /**
     * The key for a query string parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-parameter.html#cfn-events-connection-parameter-key
     */
    readonly key: string;

    /**
     * The value associated with the key for the query string parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-parameter.html#cfn-events-connection-parameter-value
     */
    readonly value: string;
  }

  /**
   * Contains the Basic authorization parameters for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-basicauthparameters.html
   */
  export interface BasicAuthParametersProperty {
    /**
     * The password associated with the user name to use for Basic authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-basicauthparameters.html#cfn-events-connection-basicauthparameters-password
     */
    readonly password: string;

    /**
     * The user name to use for Basic authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-basicauthparameters.html#cfn-events-connection-basicauthparameters-username
     */
    readonly username: string;
  }

  /**
   * Contains the API key authorization parameters for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-apikeyauthparameters.html
   */
  export interface ApiKeyAuthParametersProperty {
    /**
     * The name of the API key to use for authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-apikeyauthparameters.html#cfn-events-connection-apikeyauthparameters-apikeyname
     */
    readonly apiKeyName: string;

    /**
     * The value for the API key to use for authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-apikeyauthparameters.html#cfn-events-connection-apikeyauthparameters-apikeyvalue
     */
    readonly apiKeyValue: string;
  }

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-oauthparameters.html
   */
  export interface OAuthParametersProperty {
    /**
     * The URL to the authorization endpoint when OAuth is specified as the authorization type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-oauthparameters.html#cfn-events-connection-oauthparameters-authorizationendpoint
     */
    readonly authorizationEndpoint: string;

    /**
     * A `CreateConnectionOAuthClientRequestParameters` object that contains the client parameters for OAuth authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-oauthparameters.html#cfn-events-connection-oauthparameters-clientparameters
     */
    readonly clientParameters: CfnConnection.ClientParametersProperty | cdk.IResolvable;

    /**
     * The method to use for the authorization request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-oauthparameters.html#cfn-events-connection-oauthparameters-httpmethod
     */
    readonly httpMethod: string;

    /**
     * A `ConnectionHttpParameters` object that contains details about the additional parameters to use for the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-oauthparameters.html#cfn-events-connection-oauthparameters-oauthhttpparameters
     */
    readonly oAuthHttpParameters?: CfnConnection.ConnectionHttpParametersProperty | cdk.IResolvable;
  }

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-clientparameters.html
   */
  export interface ClientParametersProperty {
    /**
     * The client ID to use for OAuth authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-clientparameters.html#cfn-events-connection-clientparameters-clientid
     */
    readonly clientId: string;

    /**
     * The client secret assciated with the client ID to use for OAuth authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-connection-clientparameters.html#cfn-events-connection-clientparameters-clientsecret
     */
    readonly clientSecret: string;
  }
}

/**
 * Properties for defining a `CfnConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html
 */
export interface CfnConnectionProps {
  /**
   * The type of authorization to use for the connection.
   *
   * > OAUTH tokens are refreshed when a 401 or 407 response is returned.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html#cfn-events-connection-authorizationtype
   */
  readonly authorizationType: string;

  /**
   * A `CreateConnectionAuthRequestParameters` object that contains the authorization parameters to use to authorize with the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html#cfn-events-connection-authparameters
   */
  readonly authParameters?: CfnConnection.AuthParametersProperty | cdk.IResolvable;

  /**
   * A description for the connection to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html#cfn-events-connection-description
   */
  readonly description?: string;

  /**
   * The name for the connection to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html#cfn-events-connection-name
   */
  readonly name?: string;
}

/**
 * Determine whether the given properties match those of a `ParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isValueSecret", cdk.validateBoolean)(properties.isValueSecret));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionParameterPropertyValidator(properties).assertSuccess();
  return {
    "IsValueSecret": cdk.booleanToCloudFormation(properties.isValueSecret),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConnectionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnection.ParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.ParameterProperty>();
  ret.addPropertyResult("isValueSecret", "IsValueSecret", (properties.IsValueSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsValueSecret) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionHttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionHttpParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionConnectionHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bodyParameters", cdk.listValidator(CfnConnectionParameterPropertyValidator))(properties.bodyParameters));
  errors.collect(cdk.propertyValidator("headerParameters", cdk.listValidator(CfnConnectionParameterPropertyValidator))(properties.headerParameters));
  errors.collect(cdk.propertyValidator("queryStringParameters", cdk.listValidator(CfnConnectionParameterPropertyValidator))(properties.queryStringParameters));
  return errors.wrap("supplied properties not correct for \"ConnectionHttpParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionConnectionHttpParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionConnectionHttpParametersPropertyValidator(properties).assertSuccess();
  return {
    "BodyParameters": cdk.listMapper(convertCfnConnectionParameterPropertyToCloudFormation)(properties.bodyParameters),
    "HeaderParameters": cdk.listMapper(convertCfnConnectionParameterPropertyToCloudFormation)(properties.headerParameters),
    "QueryStringParameters": cdk.listMapper(convertCfnConnectionParameterPropertyToCloudFormation)(properties.queryStringParameters)
  };
}

// @ts-ignore TS6133
function CfnConnectionConnectionHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.ConnectionHttpParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.ConnectionHttpParametersProperty>();
  ret.addPropertyResult("bodyParameters", "BodyParameters", (properties.BodyParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectionParameterPropertyFromCloudFormation)(properties.BodyParameters) : undefined));
  ret.addPropertyResult("headerParameters", "HeaderParameters", (properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectionParameterPropertyFromCloudFormation)(properties.HeaderParameters) : undefined));
  ret.addPropertyResult("queryStringParameters", "QueryStringParameters", (properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnConnectionParameterPropertyFromCloudFormation)(properties.QueryStringParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BasicAuthParametersProperty`
 *
 * @param properties - the TypeScript properties of a `BasicAuthParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionBasicAuthParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"BasicAuthParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionBasicAuthParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionBasicAuthParametersPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnConnectionBasicAuthParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.BasicAuthParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.BasicAuthParametersProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApiKeyAuthParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ApiKeyAuthParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionApiKeyAuthParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeyName", cdk.requiredValidator)(properties.apiKeyName));
  errors.collect(cdk.propertyValidator("apiKeyName", cdk.validateString)(properties.apiKeyName));
  errors.collect(cdk.propertyValidator("apiKeyValue", cdk.requiredValidator)(properties.apiKeyValue));
  errors.collect(cdk.propertyValidator("apiKeyValue", cdk.validateString)(properties.apiKeyValue));
  return errors.wrap("supplied properties not correct for \"ApiKeyAuthParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionApiKeyAuthParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionApiKeyAuthParametersPropertyValidator(properties).assertSuccess();
  return {
    "ApiKeyName": cdk.stringToCloudFormation(properties.apiKeyName),
    "ApiKeyValue": cdk.stringToCloudFormation(properties.apiKeyValue)
  };
}

// @ts-ignore TS6133
function CfnConnectionApiKeyAuthParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.ApiKeyAuthParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.ApiKeyAuthParametersProperty>();
  ret.addPropertyResult("apiKeyName", "ApiKeyName", (properties.ApiKeyName != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKeyName) : undefined));
  ret.addPropertyResult("apiKeyValue", "ApiKeyValue", (properties.ApiKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKeyValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClientParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ClientParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionClientParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.requiredValidator)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  return errors.wrap("supplied properties not correct for \"ClientParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionClientParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionClientParametersPropertyValidator(properties).assertSuccess();
  return {
    "ClientID": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret)
  };
}

// @ts-ignore TS6133
function CfnConnectionClientParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.ClientParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.ClientParametersProperty>();
  ret.addPropertyResult("clientId", "ClientID", (properties.ClientID != null ? cfn_parse.FromCloudFormation.getString(properties.ClientID) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OAuthParametersProperty`
 *
 * @param properties - the TypeScript properties of a `OAuthParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionOAuthParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.requiredValidator)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.validateString)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("clientParameters", cdk.requiredValidator)(properties.clientParameters));
  errors.collect(cdk.propertyValidator("clientParameters", CfnConnectionClientParametersPropertyValidator)(properties.clientParameters));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.requiredValidator)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("httpMethod", cdk.validateString)(properties.httpMethod));
  errors.collect(cdk.propertyValidator("oAuthHttpParameters", CfnConnectionConnectionHttpParametersPropertyValidator)(properties.oAuthHttpParameters));
  return errors.wrap("supplied properties not correct for \"OAuthParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionOAuthParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionOAuthParametersPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationEndpoint": cdk.stringToCloudFormation(properties.authorizationEndpoint),
    "ClientParameters": convertCfnConnectionClientParametersPropertyToCloudFormation(properties.clientParameters),
    "HttpMethod": cdk.stringToCloudFormation(properties.httpMethod),
    "OAuthHttpParameters": convertCfnConnectionConnectionHttpParametersPropertyToCloudFormation(properties.oAuthHttpParameters)
  };
}

// @ts-ignore TS6133
function CfnConnectionOAuthParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnection.OAuthParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.OAuthParametersProperty>();
  ret.addPropertyResult("authorizationEndpoint", "AuthorizationEndpoint", (properties.AuthorizationEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationEndpoint) : undefined));
  ret.addPropertyResult("clientParameters", "ClientParameters", (properties.ClientParameters != null ? CfnConnectionClientParametersPropertyFromCloudFormation(properties.ClientParameters) : undefined));
  ret.addPropertyResult("httpMethod", "HttpMethod", (properties.HttpMethod != null ? cfn_parse.FromCloudFormation.getString(properties.HttpMethod) : undefined));
  ret.addPropertyResult("oAuthHttpParameters", "OAuthHttpParameters", (properties.OAuthHttpParameters != null ? CfnConnectionConnectionHttpParametersPropertyFromCloudFormation(properties.OAuthHttpParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AuthParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionAuthParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeyAuthParameters", CfnConnectionApiKeyAuthParametersPropertyValidator)(properties.apiKeyAuthParameters));
  errors.collect(cdk.propertyValidator("basicAuthParameters", CfnConnectionBasicAuthParametersPropertyValidator)(properties.basicAuthParameters));
  errors.collect(cdk.propertyValidator("invocationHttpParameters", CfnConnectionConnectionHttpParametersPropertyValidator)(properties.invocationHttpParameters));
  errors.collect(cdk.propertyValidator("oAuthParameters", CfnConnectionOAuthParametersPropertyValidator)(properties.oAuthParameters));
  return errors.wrap("supplied properties not correct for \"AuthParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionAuthParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionAuthParametersPropertyValidator(properties).assertSuccess();
  return {
    "ApiKeyAuthParameters": convertCfnConnectionApiKeyAuthParametersPropertyToCloudFormation(properties.apiKeyAuthParameters),
    "BasicAuthParameters": convertCfnConnectionBasicAuthParametersPropertyToCloudFormation(properties.basicAuthParameters),
    "InvocationHttpParameters": convertCfnConnectionConnectionHttpParametersPropertyToCloudFormation(properties.invocationHttpParameters),
    "OAuthParameters": convertCfnConnectionOAuthParametersPropertyToCloudFormation(properties.oAuthParameters)
  };
}

// @ts-ignore TS6133
function CfnConnectionAuthParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.AuthParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.AuthParametersProperty>();
  ret.addPropertyResult("apiKeyAuthParameters", "ApiKeyAuthParameters", (properties.ApiKeyAuthParameters != null ? CfnConnectionApiKeyAuthParametersPropertyFromCloudFormation(properties.ApiKeyAuthParameters) : undefined));
  ret.addPropertyResult("basicAuthParameters", "BasicAuthParameters", (properties.BasicAuthParameters != null ? CfnConnectionBasicAuthParametersPropertyFromCloudFormation(properties.BasicAuthParameters) : undefined));
  ret.addPropertyResult("invocationHttpParameters", "InvocationHttpParameters", (properties.InvocationHttpParameters != null ? CfnConnectionConnectionHttpParametersPropertyFromCloudFormation(properties.InvocationHttpParameters) : undefined));
  ret.addPropertyResult("oAuthParameters", "OAuthParameters", (properties.OAuthParameters != null ? CfnConnectionOAuthParametersPropertyFromCloudFormation(properties.OAuthParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authParameters", CfnConnectionAuthParametersPropertyValidator)(properties.authParameters));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.requiredValidator)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionPropsValidator(properties).assertSuccess();
  return {
    "AuthParameters": convertCfnConnectionAuthParametersPropertyToCloudFormation(properties.authParameters),
    "AuthorizationType": cdk.stringToCloudFormation(properties.authorizationType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionProps>();
  ret.addPropertyResult("authorizationType", "AuthorizationType", (properties.AuthorizationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationType) : undefined));
  ret.addPropertyResult("authParameters", "AuthParameters", (properties.AuthParameters != null ? CfnConnectionAuthParametersPropertyFromCloudFormation(properties.AuthParameters) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A global endpoint used to improve your application's availability by making it regional-fault tolerant.
 *
 * For more information about global endpoints, see [Making applications Regional-fault tolerant with global endpoints and event replication](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-global-endpoints.html) in the *Amazon EventBridge User Guide* .
 *
 * @cloudformationResource AWS::Events::Endpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html
 */
export class CfnEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::Endpoint";

  /**
   * Build a CfnEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the endpoint.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the endpoint.
   *
   * @cloudformationAttribute EndpointId
   */
  public readonly attrEndpointId: string;

  /**
   * The URL of the endpoint.
   *
   * @cloudformationAttribute EndpointUrl
   */
  public readonly attrEndpointUrl: string;

  /**
   * The main Region of the endpoint.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The reason the endpoint is in its current state.
   *
   * @cloudformationAttribute StateReason
   */
  public readonly attrStateReason: string;

  /**
   * A description for the endpoint.
   */
  public description?: string;

  /**
   * The event buses being used by the endpoint.
   */
  public eventBuses: Array<CfnEndpoint.EndpointEventBusProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the endpoint.
   */
  public name?: string;

  /**
   * Whether event replication was enabled or disabled for this endpoint.
   */
  public replicationConfig?: cdk.IResolvable | CfnEndpoint.ReplicationConfigProperty;

  /**
   * The ARN of the role used by event replication for the endpoint.
   */
  public roleArn?: string;

  /**
   * The routing configuration of the endpoint.
   */
  public routingConfig: cdk.IResolvable | CfnEndpoint.RoutingConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEndpointProps) {
    super(scope, id, {
      "type": CfnEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "eventBuses", this);
    cdk.requireProperty(props, "routingConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointId = cdk.Token.asString(this.getAtt("EndpointId", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointUrl = cdk.Token.asString(this.getAtt("EndpointUrl", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrStateReason = cdk.Token.asString(this.getAtt("StateReason", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.eventBuses = props.eventBuses;
    this.name = props.name;
    this.replicationConfig = props.replicationConfig;
    this.roleArn = props.roleArn;
    this.routingConfig = props.routingConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "eventBuses": this.eventBuses,
      "name": this.name,
      "replicationConfig": this.replicationConfig,
      "roleArn": this.roleArn,
      "routingConfig": this.routingConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEndpointPropsToCloudFormation(props);
  }
}

export namespace CfnEndpoint {
  /**
   * The event buses the endpoint is associated with.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-endpointeventbus.html
   */
  export interface EndpointEventBusProperty {
    /**
     * The ARN of the event bus the endpoint is associated with.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-endpointeventbus.html#cfn-events-endpoint-endpointeventbus-eventbusarn
     */
    readonly eventBusArn: string;
  }

  /**
   * Endpoints can replicate all events to the secondary Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-replicationconfig.html
   */
  export interface ReplicationConfigProperty {
    /**
     * The state of event replication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-replicationconfig.html#cfn-events-endpoint-replicationconfig-state
     */
    readonly state: string;
  }

  /**
   * The routing configuration of the endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-routingconfig.html
   */
  export interface RoutingConfigProperty {
    /**
     * The failover configuration for an endpoint.
     *
     * This includes what triggers failover and what happens when it's triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-routingconfig.html#cfn-events-endpoint-routingconfig-failoverconfig
     */
    readonly failoverConfig: CfnEndpoint.FailoverConfigProperty | cdk.IResolvable;
  }

  /**
   * The failover configuration for an endpoint.
   *
   * This includes what triggers failover and what happens when it's triggered.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-failoverconfig.html
   */
  export interface FailoverConfigProperty {
    /**
     * The main Region of the endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-failoverconfig.html#cfn-events-endpoint-failoverconfig-primary
     */
    readonly primary: cdk.IResolvable | CfnEndpoint.PrimaryProperty;

    /**
     * The Region that events are routed to when failover is triggered or event replication is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-failoverconfig.html#cfn-events-endpoint-failoverconfig-secondary
     */
    readonly secondary: cdk.IResolvable | CfnEndpoint.SecondaryProperty;
  }

  /**
   * The secondary Region that processes events when failover is triggered or replication is enabled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-secondary.html
   */
  export interface SecondaryProperty {
    /**
     * Defines the secondary Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-secondary.html#cfn-events-endpoint-secondary-route
     */
    readonly route: string;
  }

  /**
   * The primary Region of the endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-primary.html
   */
  export interface PrimaryProperty {
    /**
     * The ARN of the health check used by the endpoint to determine whether failover is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-endpoint-primary.html#cfn-events-endpoint-primary-healthcheck
     */
    readonly healthCheck: string;
  }
}

/**
 * Properties for defining a `CfnEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html
 */
export interface CfnEndpointProps {
  /**
   * A description for the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-description
   */
  readonly description?: string;

  /**
   * The event buses being used by the endpoint.
   *
   * *Exactly* : `2`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-eventbuses
   */
  readonly eventBuses: Array<CfnEndpoint.EndpointEventBusProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-name
   */
  readonly name?: string;

  /**
   * Whether event replication was enabled or disabled for this endpoint.
   *
   * The default state is `ENABLED` which means you must supply a `RoleArn` . If you don't have a `RoleArn` or you don't want event replication enabled, set the state to `DISABLED` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-replicationconfig
   */
  readonly replicationConfig?: cdk.IResolvable | CfnEndpoint.ReplicationConfigProperty;

  /**
   * The ARN of the role used by event replication for the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-rolearn
   */
  readonly roleArn?: string;

  /**
   * The routing configuration of the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-endpoint.html#cfn-events-endpoint-routingconfig
   */
  readonly routingConfig: cdk.IResolvable | CfnEndpoint.RoutingConfigProperty;
}

/**
 * Determine whether the given properties match those of a `EndpointEventBusProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointEventBusProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointEndpointEventBusPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBusArn", cdk.requiredValidator)(properties.eventBusArn));
  errors.collect(cdk.propertyValidator("eventBusArn", cdk.validateString)(properties.eventBusArn));
  return errors.wrap("supplied properties not correct for \"EndpointEventBusProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointEndpointEventBusPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointEndpointEventBusPropertyValidator(properties).assertSuccess();
  return {
    "EventBusArn": cdk.stringToCloudFormation(properties.eventBusArn)
  };
}

// @ts-ignore TS6133
function CfnEndpointEndpointEventBusPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.EndpointEventBusProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.EndpointEventBusProperty>();
  ret.addPropertyResult("eventBusArn", "EventBusArn", (properties.EventBusArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointReplicationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("state", cdk.requiredValidator)(properties.state));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"ReplicationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointReplicationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointReplicationConfigPropertyValidator(properties).assertSuccess();
  return {
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnEndpointReplicationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpoint.ReplicationConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.ReplicationConfigProperty>();
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecondaryProperty`
 *
 * @param properties - the TypeScript properties of a `SecondaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointSecondaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("route", cdk.requiredValidator)(properties.route));
  errors.collect(cdk.propertyValidator("route", cdk.validateString)(properties.route));
  return errors.wrap("supplied properties not correct for \"SecondaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointSecondaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointSecondaryPropertyValidator(properties).assertSuccess();
  return {
    "Route": cdk.stringToCloudFormation(properties.route)
  };
}

// @ts-ignore TS6133
function CfnEndpointSecondaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpoint.SecondaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.SecondaryProperty>();
  ret.addPropertyResult("route", "Route", (properties.Route != null ? cfn_parse.FromCloudFormation.getString(properties.Route) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrimaryProperty`
 *
 * @param properties - the TypeScript properties of a `PrimaryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointPrimaryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthCheck", cdk.requiredValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("healthCheck", cdk.validateString)(properties.healthCheck));
  return errors.wrap("supplied properties not correct for \"PrimaryProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointPrimaryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointPrimaryPropertyValidator(properties).assertSuccess();
  return {
    "HealthCheck": cdk.stringToCloudFormation(properties.healthCheck)
  };
}

// @ts-ignore TS6133
function CfnEndpointPrimaryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpoint.PrimaryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.PrimaryProperty>();
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheck) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FailoverConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointFailoverConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("primary", cdk.requiredValidator)(properties.primary));
  errors.collect(cdk.propertyValidator("primary", CfnEndpointPrimaryPropertyValidator)(properties.primary));
  errors.collect(cdk.propertyValidator("secondary", cdk.requiredValidator)(properties.secondary));
  errors.collect(cdk.propertyValidator("secondary", CfnEndpointSecondaryPropertyValidator)(properties.secondary));
  return errors.wrap("supplied properties not correct for \"FailoverConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointFailoverConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointFailoverConfigPropertyValidator(properties).assertSuccess();
  return {
    "Primary": convertCfnEndpointPrimaryPropertyToCloudFormation(properties.primary),
    "Secondary": convertCfnEndpointSecondaryPropertyToCloudFormation(properties.secondary)
  };
}

// @ts-ignore TS6133
function CfnEndpointFailoverConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpoint.FailoverConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.FailoverConfigProperty>();
  ret.addPropertyResult("primary", "Primary", (properties.Primary != null ? CfnEndpointPrimaryPropertyFromCloudFormation(properties.Primary) : undefined));
  ret.addPropertyResult("secondary", "Secondary", (properties.Secondary != null ? CfnEndpointSecondaryPropertyFromCloudFormation(properties.Secondary) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoutingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointRoutingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failoverConfig", cdk.requiredValidator)(properties.failoverConfig));
  errors.collect(cdk.propertyValidator("failoverConfig", CfnEndpointFailoverConfigPropertyValidator)(properties.failoverConfig));
  return errors.wrap("supplied properties not correct for \"RoutingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnEndpointRoutingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointRoutingConfigPropertyValidator(properties).assertSuccess();
  return {
    "FailoverConfig": convertCfnEndpointFailoverConfigPropertyToCloudFormation(properties.failoverConfig)
  };
}

// @ts-ignore TS6133
function CfnEndpointRoutingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEndpoint.RoutingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpoint.RoutingConfigProperty>();
  ret.addPropertyResult("failoverConfig", "FailoverConfig", (properties.FailoverConfig != null ? CfnEndpointFailoverConfigPropertyFromCloudFormation(properties.FailoverConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventBuses", cdk.requiredValidator)(properties.eventBuses));
  errors.collect(cdk.propertyValidator("eventBuses", cdk.listValidator(CfnEndpointEndpointEventBusPropertyValidator))(properties.eventBuses));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("replicationConfig", CfnEndpointReplicationConfigPropertyValidator)(properties.replicationConfig));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("routingConfig", cdk.requiredValidator)(properties.routingConfig));
  errors.collect(cdk.propertyValidator("routingConfig", CfnEndpointRoutingConfigPropertyValidator)(properties.routingConfig));
  return errors.wrap("supplied properties not correct for \"CfnEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEndpointPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventBuses": cdk.listMapper(convertCfnEndpointEndpointEventBusPropertyToCloudFormation)(properties.eventBuses),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReplicationConfig": convertCfnEndpointReplicationConfigPropertyToCloudFormation(properties.replicationConfig),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "RoutingConfig": convertCfnEndpointRoutingConfigPropertyToCloudFormation(properties.routingConfig)
  };
}

// @ts-ignore TS6133
function CfnEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEndpointProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventBuses", "EventBuses", (properties.EventBuses != null ? cfn_parse.FromCloudFormation.getArray(CfnEndpointEndpointEventBusPropertyFromCloudFormation)(properties.EventBuses) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("replicationConfig", "ReplicationConfig", (properties.ReplicationConfig != null ? CfnEndpointReplicationConfigPropertyFromCloudFormation(properties.ReplicationConfig) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("routingConfig", "RoutingConfig", (properties.RoutingConfig != null ? CfnEndpointRoutingConfigPropertyFromCloudFormation(properties.RoutingConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an event bus within your account.
 *
 * This can be a custom event bus which you can use to receive events from your custom applications and services, or it can be a partner event bus which can be matched to a partner event source.
 *
 * > As an aid to help you jumpstart developing CloudFormation templates, the EventBridge console enables you to create templates from the existing event buses in your account. For more information, see [Generating CloudFormation templates from an EventBridge event bus](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-generate-event-bus-template.html) in the *Amazon EventBridge User Guide* .
 *
 * @cloudformationResource AWS::Events::EventBus
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html
 */
export class CfnEventBus extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::EventBus";

  /**
   * Build a CfnEventBus from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventBus {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventBusPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventBus(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the event bus, such as `arn:aws:events:us-east-2:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the event bus, such as `PartnerName/acct1/repo1` .
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * @cloudformationAttribute Policy
   */
  public readonly attrPolicy: string;

  /**
   * If you are creating a partner event bus, this specifies the partner event source that the new event bus will be matched with.
   */
  public eventSourceName?: string;

  /**
   * The name of the new event bus.
   */
  public name: string;

  /**
   * The permissions policy of the event bus, describing which other AWS accounts can write events to this event bus.
   */
  public policy?: any | cdk.IResolvable | string;

  /**
   * Tags to associate with the event bus.
   */
  public tags?: Array<CfnEventBus.TagEntryProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventBusProps) {
    super(scope, id, {
      "type": CfnEventBus.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrPolicy = cdk.Token.asString(this.getAtt("Policy", cdk.ResolutionTypeHint.STRING));
    this.eventSourceName = props.eventSourceName;
    this.name = props.name;
    this.policy = props.policy;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "eventSourceName": this.eventSourceName,
      "name": this.name,
      "policy": this.policy,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventBus.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventBusPropsToCloudFormation(props);
  }
}

export namespace CfnEventBus {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbus-tagentry.html
   */
  export interface TagEntryProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbus-tagentry.html#cfn-events-eventbus-tagentry-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbus-tagentry.html#cfn-events-eventbus-tagentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnEventBus`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html
 */
export interface CfnEventBusProps {
  /**
   * If you are creating a partner event bus, this specifies the partner event source that the new event bus will be matched with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-eventsourcename
   */
  readonly eventSourceName?: string;

  /**
   * The name of the new event bus.
   *
   * Custom event bus names can't contain the `/` character, but you can use the `/` character in partner event bus names. In addition, for partner event buses, the name must exactly match the name of the partner event source that this event bus is matched to.
   *
   * You can't use the name `default` for a custom event bus, as this name is already used for your account's default event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-name
   */
  readonly name: string;

  /**
   * The permissions policy of the event bus, describing which other AWS accounts can write events to this event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-policy
   */
  readonly policy?: any | cdk.IResolvable | string;

  /**
   * Tags to associate with the event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-tags
   */
  readonly tags?: Array<CfnEventBus.TagEntryProperty>;
}

/**
 * Determine whether the given properties match those of a `TagEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventBusTagEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventBusTagEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventBusTagEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEventBusTagEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEventBus.TagEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventBus.TagEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEventBusProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventBusProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventBusPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventSourceName", cdk.validateString)(properties.eventSourceName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.unionValidator(cdk.validateString, cdk.validateObject))(properties.policy));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnEventBusTagEntryPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEventBusProps\"");
}

// @ts-ignore TS6133
function convertCfnEventBusPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventBusPropsValidator(properties).assertSuccess();
  return {
    "EventSourceName": cdk.stringToCloudFormation(properties.eventSourceName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.unionMapper([cdk.validateString, cdk.validateObject], [cdk.stringToCloudFormation, cdk.objectToCloudFormation])(properties.policy),
    "Tags": cdk.listMapper(convertCfnEventBusTagEntryPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEventBusPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventBusProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventBusProps>();
  ret.addPropertyResult("eventSourceName", "EventSourceName", (properties.EventSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.EventSourceName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, cdk.validateObject], [cfn_parse.FromCloudFormation.getString, cfn_parse.FromCloudFormation.getAny])(properties.Policy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnEventBusTagEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Running `PutPermission` permits the specified AWS account or AWS organization to put events to the specified *event bus* .
 *
 * Amazon EventBridge (CloudWatch Events) rules in your account are triggered by these events arriving to an event bus in your account.
 *
 * For another account to send events to your account, that external account must have an EventBridge rule with your account's event bus as a target.
 *
 * To enable multiple AWS accounts to put events to your event bus, run `PutPermission` once for each of these accounts. Or, if all the accounts are members of the same AWS organization, you can run `PutPermission` once specifying `Principal` as "*" and specifying the AWS organization ID in `Condition` , to grant permissions to all accounts in that organization.
 *
 * If you grant permissions using an organization, then accounts in that organization must specify a `RoleArn` with proper permissions when they use `PutTarget` to add your account's event bus as a target. For more information, see [Sending and Receiving Events Between AWS Accounts](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html) in the *Amazon EventBridge User Guide* .
 *
 * The permission policy on the event bus cannot exceed 10 KB in size.
 *
 * @cloudformationResource AWS::Events::EventBusPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html
 */
export class CfnEventBusPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::EventBusPolicy";

  /**
   * Build a CfnEventBusPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventBusPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventBusPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventBusPolicy(scope, id, propsResult.value);
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
   * The action that you are enabling the other account to perform.
   */
  public action?: string;

  /**
   * This parameter enables you to limit the permission to accounts that fulfill a certain condition, such as being a member of a certain AWS organization.
   */
  public condition?: CfnEventBusPolicy.ConditionProperty | cdk.IResolvable;

  /**
   * The name of the event bus associated with the rule.
   */
  public eventBusName?: string;

  /**
   * The 12-digit AWS account ID that you are permitting to put events to your default event bus.
   */
  public principal?: string;

  /**
   * A JSON string that describes the permission policy statement.
   */
  public statement?: any | cdk.IResolvable;

  /**
   * An identifier string for the external account that you are granting permissions to.
   */
  public statementId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEventBusPolicyProps) {
    super(scope, id, {
      "type": CfnEventBusPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "statementId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.condition = props.condition;
    this.eventBusName = props.eventBusName;
    this.principal = props.principal;
    this.statement = props.statement;
    this.statementId = props.statementId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "condition": this.condition,
      "eventBusName": this.eventBusName,
      "principal": this.principal,
      "statement": this.statement,
      "statementId": this.statementId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventBusPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventBusPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnEventBusPolicy {
  /**
   * A JSON string which you can use to limit the event bus permissions you are granting to only accounts that fulfill the condition.
   *
   * Currently, the only supported condition is membership in a certain AWS organization. The string must contain `Type` , `Key` , and `Value` fields. The `Value` field specifies the ID of the AWS organization. Following is an example value for `Condition` :
   *
   * `'{"Type" : "StringEquals", "Key": "aws:PrincipalOrgID", "Value": "o-1234567890"}'`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbuspolicy-condition.html
   */
  export interface ConditionProperty {
    /**
     * Specifies the key for the condition.
     *
     * Currently the only supported key is `aws:PrincipalOrgID` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbuspolicy-condition.html#cfn-events-eventbuspolicy-condition-key
     */
    readonly key?: string;

    /**
     * Specifies the type of condition.
     *
     * Currently the only supported value is `StringEquals` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbuspolicy-condition.html#cfn-events-eventbuspolicy-condition-type
     */
    readonly type?: string;

    /**
     * Specifies the value for the key.
     *
     * Currently, this must be the ID of the organization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-eventbuspolicy-condition.html#cfn-events-eventbuspolicy-condition-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnEventBusPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html
 */
export interface CfnEventBusPolicyProps {
  /**
   * The action that you are enabling the other account to perform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-action
   */
  readonly action?: string;

  /**
   * This parameter enables you to limit the permission to accounts that fulfill a certain condition, such as being a member of a certain AWS organization.
   *
   * For more information about AWS Organizations, see [What Is AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) in the *AWS Organizations User Guide* .
   *
   * If you specify `Condition` with an AWS organization ID, and specify "*" as the value for `Principal` , you grant permission to all the accounts in the named organization.
   *
   * The `Condition` is a JSON string which must contain `Type` , `Key` , and `Value` fields.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-condition
   */
  readonly condition?: CfnEventBusPolicy.ConditionProperty | cdk.IResolvable;

  /**
   * The name of the event bus associated with the rule.
   *
   * If you omit this, the default event bus is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-eventbusname
   */
  readonly eventBusName?: string;

  /**
   * The 12-digit AWS account ID that you are permitting to put events to your default event bus.
   *
   * Specify "*" to permit any account to put events to your default event bus.
   *
   * If you specify "*" without specifying `Condition` , avoid creating rules that may match undesirable events. To create more secure rules, make sure that the event pattern for each rule contains an `account` field with a specific account ID from which to receive events. Rules with an account field do not match any events sent from other accounts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-principal
   */
  readonly principal?: string;

  /**
   * A JSON string that describes the permission policy statement.
   *
   * You can include a `Policy` parameter in the request instead of using the `StatementId` , `Action` , `Principal` , or `Condition` parameters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-statement
   */
  readonly statement?: any | cdk.IResolvable;

  /**
   * An identifier string for the external account that you are granting permissions to.
   *
   * If you later want to revoke the permission for this external account, specify this `StatementId` when you run [RemovePermission](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_RemovePermission.html) .
   *
   * > Each `StatementId` must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html#cfn-events-eventbuspolicy-statementid
   */
  readonly statementId: string;
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventBusPolicyConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventBusPolicyConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventBusPolicyConditionPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnEventBusPolicyConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventBusPolicy.ConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventBusPolicy.ConditionProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEventBusPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventBusPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventBusPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("condition", CfnEventBusPolicyConditionPropertyValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("eventBusName", cdk.validateString)(properties.eventBusName));
  errors.collect(cdk.propertyValidator("principal", cdk.validateString)(properties.principal));
  errors.collect(cdk.propertyValidator("statement", cdk.validateObject)(properties.statement));
  errors.collect(cdk.propertyValidator("statementId", cdk.requiredValidator)(properties.statementId));
  errors.collect(cdk.propertyValidator("statementId", cdk.validateString)(properties.statementId));
  return errors.wrap("supplied properties not correct for \"CfnEventBusPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnEventBusPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventBusPolicyPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Condition": convertCfnEventBusPolicyConditionPropertyToCloudFormation(properties.condition),
    "EventBusName": cdk.stringToCloudFormation(properties.eventBusName),
    "Principal": cdk.stringToCloudFormation(properties.principal),
    "Statement": cdk.objectToCloudFormation(properties.statement),
    "StatementId": cdk.stringToCloudFormation(properties.statementId)
  };
}

// @ts-ignore TS6133
function CfnEventBusPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventBusPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventBusPolicyProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? CfnEventBusPolicyConditionPropertyFromCloudFormation(properties.Condition) : undefined));
  ret.addPropertyResult("eventBusName", "EventBusName", (properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? cfn_parse.FromCloudFormation.getString(properties.Principal) : undefined));
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? cfn_parse.FromCloudFormation.getAny(properties.Statement) : undefined));
  ret.addPropertyResult("statementId", "StatementId", (properties.StatementId != null ? cfn_parse.FromCloudFormation.getString(properties.StatementId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates the specified rule.
 *
 * Rules are enabled by default, or based on value of the state. You can disable a rule using [DisableRule](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_DisableRule.html) .
 *
 * A single rule watches for events from a single event bus. Events generated by AWS services go to your account's default event bus. Events generated by SaaS partner services or applications go to the matching partner event bus. If you have custom applications or services, you can specify whether their events go to your default event bus or a custom event bus that you have created. For more information, see [CreateEventBus](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_CreateEventBus.html) .
 *
 * If you are updating an existing rule, the rule is replaced with what you specify in this `PutRule` command. If you omit arguments in `PutRule` , the old values for those arguments are not kept. Instead, they are replaced with null values.
 *
 * When you create or update a rule, incoming events might not immediately start matching to new or updated rules. Allow a short period of time for changes to take effect.
 *
 * A rule must contain at least an EventPattern or ScheduleExpression. Rules with EventPatterns are triggered when a matching event is observed. Rules with ScheduleExpressions self-trigger based on the given schedule. A rule can have both an EventPattern and a ScheduleExpression, in which case the rule triggers on matching events as well as on a schedule.
 *
 * Most services in AWS treat : or / as the same character in Amazon Resource Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to use the correct ARN characters when creating event patterns so that they match the ARN syntax in the event you want to match.
 *
 * In EventBridge, it is possible to create rules that lead to infinite loops, where a rule is fired repeatedly. For example, a rule might detect that ACLs have changed on an S3 bucket, and trigger software to change them to the desired state. If the rule is not written carefully, the subsequent change to the ACLs fires the rule again, creating an infinite loop.
 *
 * To prevent this, write the rules so that the triggered actions do not re-fire the same rule. For example, your rule could fire only if ACLs are found to be in a bad state, instead of after any change.
 *
 * An infinite loop can quickly cause higher than expected charges. We recommend that you use budgeting, which alerts you when charges exceed your specified limit. For more information, see [Managing Your Costs with Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html) .
 *
 * > As an aid to help you jumpstart developing CloudFormation templates, the EventBridge console enables you to create templates from the existing rules in your account. For more information, see [Generating CloudFormation templates from an EventBridge rule](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-generate-template.html) in the *Amazon EventBridge User Guide* .
 *
 * @cloudformationResource AWS::Events::Rule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Events::Rule";

  /**
   * Build a CfnRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the rule, such as `arn:aws:events:us-east-2:123456789012:rule/example` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The description of the rule.
   */
  public description?: string;

  /**
   * The name or ARN of the event bus associated with the rule.
   */
  public eventBusName?: string;

  /**
   * The event pattern of the rule.
   */
  public eventPattern?: any | cdk.IResolvable;

  /**
   * The name of the rule.
   */
  public name?: string;

  /**
   * The Amazon Resource Name (ARN) of the role that is used for target invocation.
   */
  public roleArn?: string;

  /**
   * The scheduling expression.
   */
  public scheduleExpression?: string;

  /**
   * The state of the rule.
   */
  public state?: string;

  /**
   * Adds the specified targets to the specified rule, or updates the targets if they are already associated with the rule.
   */
  public targets?: Array<cdk.IResolvable | CfnRule.TargetProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleProps = {}) {
    super(scope, id, {
      "type": CfnRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.eventBusName = props.eventBusName;
    this.eventPattern = props.eventPattern;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.scheduleExpression = props.scheduleExpression;
    this.state = props.state;
    this.targets = props.targets;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "eventBusName": this.eventBusName,
      "eventPattern": this.eventPattern,
      "name": this.name,
      "roleArn": this.roleArn,
      "scheduleExpression": this.scheduleExpression,
      "state": this.state,
      "targets": this.targets
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRulePropsToCloudFormation(props);
  }
}

export namespace CfnRule {
  /**
   * Targets are the resources to be invoked when a rule is triggered.
   *
   * For a complete list of services and resources that can be set as a target, see [PutTargets](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html) .
   *
   * If you are setting the event bus of another account as the target, and that account granted permission to your account through an organization instead of directly by the account ID, then you must specify a `RoleArn` with proper permissions in the `Target` structure. For more information, see [Sending and Receiving Events Between AWS Accounts](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html) in the *Amazon EventBridge User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html
   */
  export interface TargetProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-appsyncparameters
     */
    readonly appSyncParameters?: CfnRule.AppSyncParametersProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-arn
     */
    readonly arn: string;

    /**
     * If the event target is an AWS Batch job, this contains the job definition, job name, and other parameters.
     *
     * For more information, see [Jobs](https://docs.aws.amazon.com/batch/latest/userguide/jobs.html) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-batchparameters
     */
    readonly batchParameters?: CfnRule.BatchParametersProperty | cdk.IResolvable;

    /**
     * The `DeadLetterConfig` that defines the target queue to send dead-letter queue events to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-deadletterconfig
     */
    readonly deadLetterConfig?: CfnRule.DeadLetterConfigProperty | cdk.IResolvable;

    /**
     * Contains the Amazon ECS task definition and task count to be used, if the event target is an Amazon ECS task.
     *
     * For more information about Amazon ECS tasks, see [Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_defintions.html) in the *Amazon EC2 Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-ecsparameters
     */
    readonly ecsParameters?: CfnRule.EcsParametersProperty | cdk.IResolvable;

    /**
     * Contains the HTTP parameters to use when the target is a API Gateway endpoint or EventBridge ApiDestination.
     *
     * If you specify an API Gateway API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-httpparameters
     */
    readonly httpParameters?: CfnRule.HttpParametersProperty | cdk.IResolvable;

    /**
     * The ID of the target within the specified rule.
     *
     * Use this ID to reference the target when updating the rule. We recommend using a memorable and unique string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-id
     */
    readonly id: string;

    /**
     * Valid JSON text passed to the target.
     *
     * In this case, nothing from the event itself is passed to the target. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-input
     */
    readonly input?: string;

    /**
     * The value of the JSONPath that is used for extracting part of the matched event when passing it to the target.
     *
     * You may use JSON dot notation or bracket notation. For more information about JSON paths, see [JSONPath](https://docs.aws.amazon.com/http://goessner.net/articles/JsonPath/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputpath
     */
    readonly inputPath?: string;

    /**
     * Settings to enable you to provide custom input to a target based on certain event data.
     *
     * You can extract one or more key-value pairs from the event and then use that data to send customized input to the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-inputtransformer
     */
    readonly inputTransformer?: CfnRule.InputTransformerProperty | cdk.IResolvable;

    /**
     * The custom parameter you can use to control the shard assignment, when the target is a Kinesis data stream.
     *
     * If you do not include this parameter, the default is to use the `eventId` as the partition key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-kinesisparameters
     */
    readonly kinesisParameters?: cdk.IResolvable | CfnRule.KinesisParametersProperty;

    /**
     * Contains the Amazon Redshift Data API parameters to use when the target is a Amazon Redshift cluster.
     *
     * If you specify a Amazon Redshift Cluster as a Target, you can use this to specify parameters to invoke the Amazon Redshift Data API ExecuteStatement based on EventBridge events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-redshiftdataparameters
     */
    readonly redshiftDataParameters?: cdk.IResolvable | CfnRule.RedshiftDataParametersProperty;

    /**
     * The `RetryPolicy` object that contains the retry policy configuration to use for the dead-letter queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-retrypolicy
     */
    readonly retryPolicy?: cdk.IResolvable | CfnRule.RetryPolicyProperty;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to be used for this target when the rule is triggered.
     *
     * If one rule triggers multiple targets, you can use a different IAM role for each target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-rolearn
     */
    readonly roleArn?: string;

    /**
     * Parameters used when you are using the rule to invoke Amazon EC2 Run Command.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-runcommandparameters
     */
    readonly runCommandParameters?: cdk.IResolvable | CfnRule.RunCommandParametersProperty;

    /**
     * Contains the SageMaker Model Building Pipeline parameters to start execution of a SageMaker Model Building Pipeline.
     *
     * If you specify a SageMaker Model Building Pipeline as a target, you can use this to specify parameters to start a pipeline execution based on EventBridge events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-sagemakerpipelineparameters
     */
    readonly sageMakerPipelineParameters?: cdk.IResolvable | CfnRule.SageMakerPipelineParametersProperty;

    /**
     * Contains the message group ID to use when the target is a FIFO queue.
     *
     * If you specify an SQS FIFO queue as a target, the queue must have content-based deduplication enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-target.html#cfn-events-rule-target-sqsparameters
     */
    readonly sqsParameters?: cdk.IResolvable | CfnRule.SqsParametersProperty;
  }

  /**
   * The custom parameters to be used when the target is an AWS Batch job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchparameters.html
   */
  export interface BatchParametersProperty {
    /**
     * The array properties for the submitted job, such as the size of the array.
     *
     * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchparameters.html#cfn-events-rule-batchparameters-arrayproperties
     */
    readonly arrayProperties?: CfnRule.BatchArrayPropertiesProperty | cdk.IResolvable;

    /**
     * The ARN or name of the job definition to use if the event target is an AWS Batch job.
     *
     * This job definition must already exist.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchparameters.html#cfn-events-rule-batchparameters-jobdefinition
     */
    readonly jobDefinition: string;

    /**
     * The name to use for this execution of the job, if the target is an AWS Batch job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchparameters.html#cfn-events-rule-batchparameters-jobname
     */
    readonly jobName: string;

    /**
     * The retry strategy to use for failed jobs, if the target is an AWS Batch job.
     *
     * The retry strategy is the number of times to retry the failed job execution. Valid values are 1–10. When you specify a retry strategy here, it overrides the retry strategy defined in the job definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchparameters.html#cfn-events-rule-batchparameters-retrystrategy
     */
    readonly retryStrategy?: CfnRule.BatchRetryStrategyProperty | cdk.IResolvable;
  }

  /**
   * The array properties for the submitted job, such as the size of the array.
   *
   * The array size can be between 2 and 10,000. If you specify array properties for a job, it becomes an array job. This parameter is used only if the target is an AWS Batch job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batcharrayproperties.html
   */
  export interface BatchArrayPropertiesProperty {
    /**
     * The size of the array, if this is an array batch job.
     *
     * Valid values are integers between 2 and 10,000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batcharrayproperties.html#cfn-events-rule-batcharrayproperties-size
     */
    readonly size?: number;
  }

  /**
   * The retry strategy to use for failed jobs, if the target is an AWS Batch job.
   *
   * If you specify a retry strategy here, it overrides the retry strategy defined in the job definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchretrystrategy.html
   */
  export interface BatchRetryStrategyProperty {
    /**
     * The number of times to attempt to retry, if the job fails.
     *
     * Valid values are 1–10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-batchretrystrategy.html#cfn-events-rule-batchretrystrategy-attempts
     */
    readonly attempts?: number;
  }

  /**
   * A `DeadLetterConfig` object that contains information about a dead-letter queue configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-deadletterconfig.html
   */
  export interface DeadLetterConfigProperty {
    /**
     * The ARN of the SQS queue specified as the target for the dead-letter queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-deadletterconfig.html#cfn-events-rule-deadletterconfig-arn
     */
    readonly arn?: string;
  }

  /**
   * The custom parameters to be used when the target is an Amazon ECS task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html
   */
  export interface EcsParametersProperty {
    /**
     * The capacity provider strategy to use for the task.
     *
     * If a `capacityProviderStrategy` is specified, the `launchType` parameter must be omitted. If no `capacityProviderStrategy` or launchType is specified, the `defaultCapacityProviderStrategy` for the cluster is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-capacityproviderstrategy
     */
    readonly capacityProviderStrategy?: Array<CfnRule.CapacityProviderStrategyItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies whether to enable Amazon ECS managed tags for the task.
     *
     * For more information, see [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html) in the Amazon Elastic Container Service Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-enableecsmanagedtags
     */
    readonly enableEcsManagedTags?: boolean | cdk.IResolvable;

    /**
     * Whether or not to enable the execute command functionality for the containers in this task.
     *
     * If true, this enables execute command functionality on all containers in the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-enableexecutecommand
     */
    readonly enableExecuteCommand?: boolean | cdk.IResolvable;

    /**
     * Specifies an ECS task group for the task.
     *
     * The maximum length is 255 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-group
     */
    readonly group?: string;

    /**
     * Specifies the launch type on which your task is running.
     *
     * The launch type that you specify here must match one of the launch type (compatibilities) of the target task. The `FARGATE` value is supported only in the Regions where AWS Fargate with Amazon ECS is supported. For more information, see [AWS Fargate on Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS-Fargate.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-launchtype
     */
    readonly launchType?: string;

    /**
     * Use this structure if the Amazon ECS task uses the `awsvpc` network mode.
     *
     * This structure specifies the VPC subnets and security groups associated with the task, and whether a public IP address is to be used. This structure is required if `LaunchType` is `FARGATE` because the `awsvpc` mode is required for Fargate tasks.
     *
     * If you specify `NetworkConfiguration` when the target ECS task does not use the `awsvpc` network mode, the task fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-networkconfiguration
     */
    readonly networkConfiguration?: cdk.IResolvable | CfnRule.NetworkConfigurationProperty;

    /**
     * An array of placement constraint objects to use for the task.
     *
     * You can specify up to 10 constraints per task (including constraints in the task definition and those specified at runtime).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-placementconstraints
     */
    readonly placementConstraints?: Array<cdk.IResolvable | CfnRule.PlacementConstraintProperty> | cdk.IResolvable;

    /**
     * The placement strategy objects to use for the task.
     *
     * You can specify a maximum of five strategy rules per task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-placementstrategies
     */
    readonly placementStrategies?: Array<cdk.IResolvable | CfnRule.PlacementStrategyProperty> | cdk.IResolvable;

    /**
     * Specifies the platform version for the task.
     *
     * Specify only the numeric portion of the platform version, such as `1.1.0` .
     *
     * This structure is used only if `LaunchType` is `FARGATE` . For more information about valid platform versions, see [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-platformversion
     */
    readonly platformVersion?: string;

    /**
     * Specifies whether to propagate the tags from the task definition to the task.
     *
     * If no value is specified, the tags are not propagated. Tags can only be propagated to the task during task creation. To add tags to a task after task creation, use the TagResource API action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-propagatetags
     */
    readonly propagateTags?: string;

    /**
     * The reference ID to use for the task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-referenceid
     */
    readonly referenceId?: string;

    /**
     * The metadata that you apply to the task to help you categorize and organize them.
     *
     * Each tag consists of a key and an optional value, both of which you define. To learn more, see [RunTask](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html#ECS-RunTask-request-tags) in the Amazon ECS API Reference.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taglist
     */
    readonly tagList?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The number of tasks to create based on `TaskDefinition` .
     *
     * The default is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskcount
     */
    readonly taskCount?: number;

    /**
     * The ARN of the task definition to use if the event target is an Amazon ECS task.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-ecsparameters.html#cfn-events-rule-ecsparameters-taskdefinitionarn
     */
    readonly taskDefinitionArn: string;
  }

  /**
   * The details of a capacity provider strategy.
   *
   * To learn more, see [CapacityProviderStrategyItem](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CapacityProviderStrategyItem.html) in the Amazon ECS API Reference.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-capacityproviderstrategyitem.html
   */
  export interface CapacityProviderStrategyItemProperty {
    /**
     * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
     *
     * Only one capacity provider in a capacity provider strategy can have a base defined. If no value is specified, the default value of 0 is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-capacityproviderstrategyitem.html#cfn-events-rule-capacityproviderstrategyitem-base
     */
    readonly base?: number;

    /**
     * The short name of the capacity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-capacityproviderstrategyitem.html#cfn-events-rule-capacityproviderstrategyitem-capacityprovider
     */
    readonly capacityProvider: string;

    /**
     * The weight value designates the relative percentage of the total number of tasks launched that should use the specified capacity provider.
     *
     * The weight value is taken into consideration after the base value, if defined, is satisfied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-capacityproviderstrategyitem.html#cfn-events-rule-capacityproviderstrategyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * This structure specifies the network configuration for an ECS task.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Use this structure to specify the VPC subnets and security groups for the task, and whether a public IP address is to be used.
     *
     * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-networkconfiguration.html#cfn-events-rule-networkconfiguration-awsvpcconfiguration
     */
    readonly awsVpcConfiguration?: CfnRule.AwsVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * This structure specifies the VPC subnets and security groups for the task, and whether a public IP address is to be used.
   *
   * This structure is relevant only for ECS tasks that use the `awsvpc` network mode.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-awsvpcconfiguration.html
   */
  export interface AwsVpcConfigurationProperty {
    /**
     * Specifies whether the task's elastic network interface receives a public IP address.
     *
     * You can specify `ENABLED` only when `LaunchType` in `EcsParameters` is set to `FARGATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-awsvpcconfiguration.html#cfn-events-rule-awsvpcconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;

    /**
     * Specifies the security groups associated with the task.
     *
     * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-awsvpcconfiguration.html#cfn-events-rule-awsvpcconfiguration-securitygroups
     */
    readonly securityGroups?: Array<string>;

    /**
     * Specifies the subnets associated with the task.
     *
     * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-awsvpcconfiguration.html#cfn-events-rule-awsvpcconfiguration-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * An object representing a constraint on task placement.
   *
   * To learn more, see [Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) in the Amazon Elastic Container Service Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementconstraint.html
   */
  export interface PlacementConstraintProperty {
    /**
     * A cluster query language expression to apply to the constraint.
     *
     * You cannot specify an expression if the constraint type is `distinctInstance` . To learn more, see [Cluster Query Language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html) in the Amazon Elastic Container Service Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementconstraint.html#cfn-events-rule-placementconstraint-expression
     */
    readonly expression?: string;

    /**
     * The type of constraint.
     *
     * Use distinctInstance to ensure that each task in a particular group is running on a different container instance. Use memberOf to restrict the selection to a group of valid candidates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementconstraint.html#cfn-events-rule-placementconstraint-type
     */
    readonly type?: string;
  }

  /**
   * The task placement strategy for a task or service.
   *
   * To learn more, see [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html) in the Amazon Elastic Container Service Service Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementstrategy.html
   */
  export interface PlacementStrategyProperty {
    /**
     * The field to apply the placement strategy against.
     *
     * For the spread placement strategy, valid values are instanceId (or host, which has the same effect), or any platform or custom attribute that is applied to a container instance, such as attribute:ecs.availability-zone. For the binpack placement strategy, valid values are cpu and memory. For the random placement strategy, this field is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementstrategy.html#cfn-events-rule-placementstrategy-field
     */
    readonly field?: string;

    /**
     * The type of placement strategy.
     *
     * The random placement strategy randomly places tasks on available candidates. The spread placement strategy spreads placement across available candidates evenly based on the field parameter. The binpack strategy places tasks on available candidates that have the least available amount of the resource that is specified with the field parameter. For example, if you binpack on memory, a task is placed on the instance with the least amount of remaining memory (but still enough to run the task).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-placementstrategy.html#cfn-events-rule-placementstrategy-type
     */
    readonly type?: string;
  }

  /**
   * These are custom parameter to be used when the target is an API Gateway APIs or EventBridge ApiDestinations.
   *
   * In the latter case, these are merged with any InvocationParameters specified on the Connection, with any values from the Connection taking precedence.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-httpparameters.html
   */
  export interface HttpParametersProperty {
    /**
     * The headers that need to be sent as part of request invoking the API Gateway API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-httpparameters.html#cfn-events-rule-httpparameters-headerparameters
     */
    readonly headerParameters?: cdk.IResolvable | Record<string, string>;

    /**
     * The path parameter values to be used to populate API Gateway API or EventBridge ApiDestination path wildcards ("*").
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-httpparameters.html#cfn-events-rule-httpparameters-pathparametervalues
     */
    readonly pathParameterValues?: Array<string>;

    /**
     * The query string keys/values that need to be sent as part of request invoking the API Gateway API or EventBridge ApiDestination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-httpparameters.html#cfn-events-rule-httpparameters-querystringparameters
     */
    readonly queryStringParameters?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * Contains the parameters needed for you to provide custom input to a target based on one or more pieces of data extracted from the event.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html
   */
  export interface InputTransformerProperty {
    /**
     * Map of JSON paths to be extracted from the event.
     *
     * You can then insert these in the template in `InputTemplate` to produce the output you want to be sent to the target.
     *
     * `InputPathsMap` is an array key-value pairs, where each value is a valid JSON path. You can have as many as 100 key-value pairs. You must use JSON dot notation, not bracket notation.
     *
     * The keys cannot start with " AWS ."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputpathsmap
     */
    readonly inputPathsMap?: cdk.IResolvable | Record<string, string>;

    /**
     * Input template where you specify placeholders that will be filled with the values of the keys from `InputPathsMap` to customize the data sent to the target.
     *
     * Enclose each `InputPathsMaps` value in brackets: < *value* >
     *
     * If `InputTemplate` is a JSON object (surrounded by curly braces), the following restrictions apply:
     *
     * - The placeholder cannot be used as an object key.
     *
     * The following example shows the syntax for using `InputPathsMap` and `InputTemplate` .
     *
     * `"InputTransformer":`
     *
     * `{`
     *
     * `"InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},`
     *
     * `"InputTemplate": "<instance> is in state <status>"`
     *
     * `}`
     *
     * To have the `InputTemplate` include quote marks within a JSON string, escape each quote marks with a slash, as in the following example:
     *
     * `"InputTransformer":`
     *
     * `{`
     *
     * `"InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},`
     *
     * `"InputTemplate": "<instance> is in state \"<status>\""`
     *
     * `}`
     *
     * The `InputTemplate` can also be valid JSON with varibles in quotes or out, as in the following example:
     *
     * `"InputTransformer":`
     *
     * `{`
     *
     * `"InputPathsMap": {"instance": "$.detail.instance","status": "$.detail.status"},`
     *
     * `"InputTemplate": '{"myInstance": <instance>,"myStatus": "<instance> is in state \"<status>\""}'`
     *
     * `}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputtemplate
     */
    readonly inputTemplate: string;
  }

  /**
   * This object enables you to specify a JSON path to extract from the event and use as the partition key for the Amazon Kinesis data stream, so that you can control the shard to which the event goes.
   *
   * If you do not include this parameter, the default is to use the `eventId` as the partition key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-kinesisparameters.html
   */
  export interface KinesisParametersProperty {
    /**
     * The JSON path to be extracted from the event and used as the partition key.
     *
     * For more information, see [Amazon Kinesis Streams Key Concepts](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#partition-key) in the *Amazon Kinesis Streams Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-kinesisparameters.html#cfn-events-rule-kinesisparameters-partitionkeypath
     */
    readonly partitionKeyPath: string;
  }

  /**
   * These are custom parameters to be used when the target is a Amazon Redshift cluster to invoke the Amazon Redshift Data API ExecuteStatement based on EventBridge events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html
   */
  export interface RedshiftDataParametersProperty {
    /**
     * The name of the database.
     *
     * Required when authenticating using temporary credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-database
     */
    readonly database: string;

    /**
     * The database user name.
     *
     * Required when authenticating using temporary credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-dbuser
     */
    readonly dbUser?: string;

    /**
     * The name or ARN of the secret that enables access to the database.
     *
     * Required when authenticating using AWS Secrets Manager.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-secretmanagerarn
     */
    readonly secretManagerArn?: string;

    /**
     * The SQL statement text to run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-sql
     */
    readonly sql?: string;

    /**
     * One or more SQL statements to run.
     *
     * The SQL statements are run as a single transaction. They run serially in the order of the array. Subsequent SQL statements don't start until the previous statement in the array completes. If any SQL statement fails, then because they are run as one transaction, all work is rolled back.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-sqls
     */
    readonly sqls?: Array<string>;

    /**
     * The name of the SQL statement.
     *
     * You can name the SQL statement when you create it to identify the query.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-statementname
     */
    readonly statementName?: string;

    /**
     * Indicates whether to send an event back to EventBridge after the SQL statement runs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-redshiftdataparameters.html#cfn-events-rule-redshiftdataparameters-withevent
     */
    readonly withEvent?: boolean | cdk.IResolvable;
  }

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-retrypolicy.html
   */
  export interface RetryPolicyProperty {
    /**
     * The maximum amount of time, in seconds, to continue to make retry attempts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-retrypolicy.html#cfn-events-rule-retrypolicy-maximumeventageinseconds
     */
    readonly maximumEventAgeInSeconds?: number;

    /**
     * The maximum number of retry attempts to make before the request fails.
     *
     * Retry attempts continue until either the maximum number of attempts is made or until the duration of the `MaximumEventAgeInSeconds` is met.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-retrypolicy.html#cfn-events-rule-retrypolicy-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;
  }

  /**
   * This parameter contains the criteria (either InstanceIds or a tag) used to specify which EC2 instances are to be sent the command.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html
   */
  export interface RunCommandParametersProperty {
    /**
     * Currently, we support including only one RunCommandTarget block, which specifies either an array of InstanceIds or a tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandparameters.html#cfn-events-rule-runcommandparameters-runcommandtargets
     */
    readonly runCommandTargets: Array<cdk.IResolvable | CfnRule.RunCommandTargetProperty> | cdk.IResolvable;
  }

  /**
   * Information about the EC2 instances that are to be sent the command, specified as key-value pairs.
   *
   * Each `RunCommandTarget` block can include only one key, but this key may specify multiple values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandtarget.html
   */
  export interface RunCommandTargetProperty {
    /**
     * Can be either `tag:` *tag-key* or `InstanceIds` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandtarget.html#cfn-events-rule-runcommandtarget-key
     */
    readonly key: string;

    /**
     * If `Key` is `tag:` *tag-key* , `Values` is a list of tag values.
     *
     * If `Key` is `InstanceIds` , `Values` is a list of Amazon EC2 instance IDs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-runcommandtarget.html#cfn-events-rule-runcommandtarget-values
     */
    readonly values: Array<string>;
  }

  /**
   * These are custom parameters to use when the target is a SageMaker Model Building Pipeline that starts based on EventBridge events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sagemakerpipelineparameters.html
   */
  export interface SageMakerPipelineParametersProperty {
    /**
     * List of Parameter names and values for SageMaker Model Building Pipeline execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sagemakerpipelineparameters.html#cfn-events-rule-sagemakerpipelineparameters-pipelineparameterlist
     */
    readonly pipelineParameterList?: Array<cdk.IResolvable | CfnRule.SageMakerPipelineParameterProperty> | cdk.IResolvable;
  }

  /**
   * Name/Value pair of a parameter to start execution of a SageMaker Model Building Pipeline.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sagemakerpipelineparameter.html
   */
  export interface SageMakerPipelineParameterProperty {
    /**
     * Name of parameter to start execution of a SageMaker Model Building Pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sagemakerpipelineparameter.html#cfn-events-rule-sagemakerpipelineparameter-name
     */
    readonly name: string;

    /**
     * Value of parameter to start execution of a SageMaker Model Building Pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sagemakerpipelineparameter.html#cfn-events-rule-sagemakerpipelineparameter-value
     */
    readonly value: string;
  }

  /**
   * This structure includes the custom parameter to be used when the target is an SQS FIFO queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sqsparameters.html
   */
  export interface SqsParametersProperty {
    /**
     * The FIFO message group ID to use as the target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-sqsparameters.html#cfn-events-rule-sqsparameters-messagegroupid
     */
    readonly messageGroupId: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-appsyncparameters.html
   */
  export interface AppSyncParametersProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-appsyncparameters.html#cfn-events-rule-appsyncparameters-graphqloperation
     */
    readonly graphQlOperation: string;
  }

  /**
   * A key-value pair associated with an ECS Target of an EventBridge rule.
   *
   * The tag will be propagated to ECS by EventBridge when starting an ECS task based on a matched event.
   *
   * > Currently, tags are only available when using ECS with EventBridge .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-tag.html
   */
  export interface TagProperty {
    /**
     * A string you can use to assign a value.
     *
     * The combination of tag keys and values can help you organize and categorize your resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-tag.html#cfn-events-rule-tag-key
     */
    readonly key?: string;

    /**
     * The value for the specified tag key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-tag.html#cfn-events-rule-tag-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html
 */
export interface CfnRuleProps {
  /**
   * The description of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-description
   */
  readonly description?: string;

  /**
   * The name or ARN of the event bus associated with the rule.
   *
   * If you omit this, the default event bus is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-eventbusname
   */
  readonly eventBusName?: string;

  /**
   * The event pattern of the rule.
   *
   * For more information, see [Events and Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-and-event-patterns.html) in the *Amazon EventBridge User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-eventpattern
   */
  readonly eventPattern?: any | cdk.IResolvable;

  /**
   * The name of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-name
   */
  readonly name?: string;

  /**
   * The Amazon Resource Name (ARN) of the role that is used for target invocation.
   *
   * If you're setting an event bus in another account as the target and that account granted permission to your account through an organization instead of directly by the account ID, you must specify a `RoleArn` with proper permissions in the `Target` structure, instead of here in this parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-rolearn
   */
  readonly roleArn?: string;

  /**
   * The scheduling expression.
   *
   * For example, "cron(0 20 * * ? *)", "rate(5 minutes)". For more information, see [Creating an Amazon EventBridge rule that runs on a schedule](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-scheduleexpression
   */
  readonly scheduleExpression?: string;

  /**
   * The state of the rule.
   *
   * Valid values include:
   *
   * - `DISABLED` : The rule is disabled. EventBridge does not match any events against the rule.
   * - `ENABLED` : The rule is enabled. EventBridge matches events against the rule, *except* for AWS management events delivered through CloudTrail.
   * - `ENABLED_WITH_ALL_CLOUDTRAIL_MANAGEMENT_EVENTS` : The rule is enabled for all events, including AWS management events delivered through CloudTrail.
   *
   * Management events provide visibility into management operations that are performed on resources in your AWS account. These are also known as control plane operations. For more information, see [Logging management events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html#logging-management-events) in the *CloudTrail User Guide* , and [Filtering management events from AWS services](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-service-event.html#eb-service-event-cloudtrail) in the *Amazon EventBridge User Guide* .
   *
   * This value is only valid for rules on the [default](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is-how-it-works-concepts.html#eb-bus-concepts-buses) event bus or [custom event buses](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-event-bus.html) . It does not apply to [partner event buses](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-saas.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-state
   */
  readonly state?: string;

  /**
   * Adds the specified targets to the specified rule, or updates the targets if they are already associated with the rule.
   *
   * Targets are the resources that are invoked when a rule is triggered.
   *
   * The maximum number of entries per request is 10.
   *
   * > Each rule can have up to five (5) targets associated with it at one time.
   *
   * For a list of services you can configure as targets for events, see [EventBridge targets](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html) in the *Amazon EventBridge User Guide* .
   *
   * Creating rules with built-in targets is supported only in the AWS Management Console . The built-in targets are:
   *
   * - `Amazon EBS CreateSnapshot API call`
   * - `Amazon EC2 RebootInstances API call`
   * - `Amazon EC2 StopInstances API call`
   * - `Amazon EC2 TerminateInstances API call`
   *
   * For some target types, `PutTargets` provides target-specific parameters. If the target is a Kinesis data stream, you can optionally specify which shard the event goes to by using the `KinesisParameters` argument. To invoke a command on multiple EC2 instances with one rule, you can use the `RunCommandParameters` field.
   *
   * To be able to make API calls against the resources that you own, Amazon EventBridge needs the appropriate permissions:
   *
   * - For AWS Lambda and Amazon SNS resources, EventBridge relies on resource-based policies.
   * - For EC2 instances, Kinesis Data Streams, AWS Step Functions state machines and API Gateway APIs, EventBridge relies on IAM roles that you specify in the `RoleARN` argument in `PutTargets` .
   *
   * For more information, see [Authentication and Access Control](https://docs.aws.amazon.com/eventbridge/latest/userguide/auth-and-access-control-eventbridge.html) in the *Amazon EventBridge User Guide* .
   *
   * If another AWS account is in the same region and has granted you permission (using `PutPermission` ), you can send events to that account. Set that account's event bus as a target of the rules in your account. To send the matched events to the other account, specify that account's event bus as the `Arn` value when you run `PutTargets` . If your account sends events to another account, your account is charged for each sent event. Each event sent to another account is charged as a custom event. The account receiving the event is not charged. For more information, see [Amazon EventBridge Pricing](https://docs.aws.amazon.com/eventbridge/pricing/) .
   *
   * > `Input` , `InputPath` , and `InputTransformer` are not available with `PutTarget` if the target is an event bus of a different AWS account.
   *
   * If you are setting the event bus of another account as the target, and that account granted permission to your account through an organization instead of directly by the account ID, then you must specify a `RoleArn` with proper permissions in the `Target` structure. For more information, see [Sending and Receiving Events Between AWS Accounts](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html) in the *Amazon EventBridge User Guide* .
   *
   * > If you have an IAM role on a cross-account event bus target, a `PutTargets` call without a role on the same target (same `Id` and `Arn` ) will not remove the role.
   *
   * For more information about enabling cross-account events, see [PutPermission](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutPermission.html) .
   *
   * *Input* , *InputPath* , and *InputTransformer* are mutually exclusive and optional parameters of a target. When a rule is triggered due to a matched event:
   *
   * - If none of the following arguments are specified for a target, then the entire event is passed to the target in JSON format (unless the target is Amazon EC2 Run Command or Amazon ECS task, in which case nothing from the event is passed to the target).
   * - If *Input* is specified in the form of valid JSON, then the matched event is overridden with this constant.
   * - If *InputPath* is specified in the form of JSONPath (for example, `$.detail` ), then only the part of the event specified in the path is passed to the target (for example, only the detail part of the event is passed).
   * - If *InputTransformer* is specified, then one or more specified JSONPaths are extracted from the event and used as values in a template that you specify as the input to the target.
   *
   * When you specify `InputPath` or `InputTransformer` , you must use JSON dot notation, not bracket notation.
   *
   * When you add targets to a rule and the associated rule triggers soon after, new or updated targets might not be immediately invoked. Allow a short period of time for changes to take effect.
   *
   * This action can partially fail if too many requests are made at the same time. If that happens, `FailedEntryCount` is non-zero in the response and each entry in `FailedEntries` provides the ID of the failed target and the error code.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html#cfn-events-rule-targets
   */
  readonly targets?: Array<cdk.IResolvable | CfnRule.TargetProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `BatchArrayPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `BatchArrayPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleBatchArrayPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"BatchArrayPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleBatchArrayPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleBatchArrayPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnRuleBatchArrayPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.BatchArrayPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.BatchArrayPropertiesProperty>();
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchRetryStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `BatchRetryStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleBatchRetryStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attempts", cdk.validateNumber)(properties.attempts));
  return errors.wrap("supplied properties not correct for \"BatchRetryStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleBatchRetryStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleBatchRetryStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Attempts": cdk.numberToCloudFormation(properties.attempts)
  };
}

// @ts-ignore TS6133
function CfnRuleBatchRetryStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.BatchRetryStrategyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.BatchRetryStrategyProperty>();
  ret.addPropertyResult("attempts", "Attempts", (properties.Attempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.Attempts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BatchParametersProperty`
 *
 * @param properties - the TypeScript properties of a `BatchParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleBatchParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arrayProperties", CfnRuleBatchArrayPropertiesPropertyValidator)(properties.arrayProperties));
  errors.collect(cdk.propertyValidator("jobDefinition", cdk.requiredValidator)(properties.jobDefinition));
  errors.collect(cdk.propertyValidator("jobDefinition", cdk.validateString)(properties.jobDefinition));
  errors.collect(cdk.propertyValidator("jobName", cdk.requiredValidator)(properties.jobName));
  errors.collect(cdk.propertyValidator("jobName", cdk.validateString)(properties.jobName));
  errors.collect(cdk.propertyValidator("retryStrategy", CfnRuleBatchRetryStrategyPropertyValidator)(properties.retryStrategy));
  return errors.wrap("supplied properties not correct for \"BatchParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleBatchParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleBatchParametersPropertyValidator(properties).assertSuccess();
  return {
    "ArrayProperties": convertCfnRuleBatchArrayPropertiesPropertyToCloudFormation(properties.arrayProperties),
    "JobDefinition": cdk.stringToCloudFormation(properties.jobDefinition),
    "JobName": cdk.stringToCloudFormation(properties.jobName),
    "RetryStrategy": convertCfnRuleBatchRetryStrategyPropertyToCloudFormation(properties.retryStrategy)
  };
}

// @ts-ignore TS6133
function CfnRuleBatchParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.BatchParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.BatchParametersProperty>();
  ret.addPropertyResult("arrayProperties", "ArrayProperties", (properties.ArrayProperties != null ? CfnRuleBatchArrayPropertiesPropertyFromCloudFormation(properties.ArrayProperties) : undefined));
  ret.addPropertyResult("jobDefinition", "JobDefinition", (properties.JobDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.JobDefinition) : undefined));
  ret.addPropertyResult("jobName", "JobName", (properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined));
  ret.addPropertyResult("retryStrategy", "RetryStrategy", (properties.RetryStrategy != null ? CfnRuleBatchRetryStrategyPropertyFromCloudFormation(properties.RetryStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeadLetterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleDeadLetterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"DeadLetterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleDeadLetterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleDeadLetterConfigPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnRuleDeadLetterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.DeadLetterConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.DeadLetterConfigProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityProviderStrategyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityProviderStrategyItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleCapacityProviderStrategyItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("base", cdk.validateNumber)(properties.base));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.requiredValidator)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("capacityProvider", cdk.validateString)(properties.capacityProvider));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CapacityProviderStrategyItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleCapacityProviderStrategyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleCapacityProviderStrategyItemPropertyValidator(properties).assertSuccess();
  return {
    "Base": cdk.numberToCloudFormation(properties.base),
    "CapacityProvider": cdk.stringToCloudFormation(properties.capacityProvider),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnRuleCapacityProviderStrategyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.CapacityProviderStrategyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.CapacityProviderStrategyItemProperty>();
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getNumber(properties.Base) : undefined));
  ret.addPropertyResult("capacityProvider", "CapacityProvider", (properties.CapacityProvider != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityProvider) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AwsVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AwsVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleAwsVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignPublicIp", cdk.validateString)(properties.assignPublicIp));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"AwsVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleAwsVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleAwsVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnRuleAwsVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.AwsVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.AwsVpcConfigurationProperty>();
  ret.addPropertyResult("assignPublicIp", "AssignPublicIp", (properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsVpcConfiguration", CfnRuleAwsVpcConfigurationPropertyValidator)(properties.awsVpcConfiguration));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AwsVpcConfiguration": convertCfnRuleAwsVpcConfigurationPropertyToCloudFormation(properties.awsVpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnRuleNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.NetworkConfigurationProperty>();
  ret.addPropertyResult("awsVpcConfiguration", "AwsVpcConfiguration", (properties.AwsVpcConfiguration != null ? CfnRuleAwsVpcConfigurationPropertyFromCloudFormation(properties.AwsVpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementConstraintProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementConstraintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePlacementConstraintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementConstraintProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulePlacementConstraintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePlacementConstraintPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRulePlacementConstraintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.PlacementConstraintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PlacementConstraintProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlacementStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePlacementStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PlacementStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulePlacementStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePlacementStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRulePlacementStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.PlacementStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.PlacementStrategyProperty>();
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EcsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleEcsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityProviderStrategy", cdk.listValidator(CfnRuleCapacityProviderStrategyItemPropertyValidator))(properties.capacityProviderStrategy));
  errors.collect(cdk.propertyValidator("enableEcsManagedTags", cdk.validateBoolean)(properties.enableEcsManagedTags));
  errors.collect(cdk.propertyValidator("enableExecuteCommand", cdk.validateBoolean)(properties.enableExecuteCommand));
  errors.collect(cdk.propertyValidator("group", cdk.validateString)(properties.group));
  errors.collect(cdk.propertyValidator("launchType", cdk.validateString)(properties.launchType));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnRuleNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("placementConstraints", cdk.listValidator(CfnRulePlacementConstraintPropertyValidator))(properties.placementConstraints));
  errors.collect(cdk.propertyValidator("placementStrategies", cdk.listValidator(CfnRulePlacementStrategyPropertyValidator))(properties.placementStrategies));
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateString)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("referenceId", cdk.validateString)(properties.referenceId));
  errors.collect(cdk.propertyValidator("tagList", cdk.listValidator(cdk.validateCfnTag))(properties.tagList));
  errors.collect(cdk.propertyValidator("taskCount", cdk.validateNumber)(properties.taskCount));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.requiredValidator)(properties.taskDefinitionArn));
  errors.collect(cdk.propertyValidator("taskDefinitionArn", cdk.validateString)(properties.taskDefinitionArn));
  return errors.wrap("supplied properties not correct for \"EcsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleEcsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleEcsParametersPropertyValidator(properties).assertSuccess();
  return {
    "CapacityProviderStrategy": cdk.listMapper(convertCfnRuleCapacityProviderStrategyItemPropertyToCloudFormation)(properties.capacityProviderStrategy),
    "EnableECSManagedTags": cdk.booleanToCloudFormation(properties.enableEcsManagedTags),
    "EnableExecuteCommand": cdk.booleanToCloudFormation(properties.enableExecuteCommand),
    "Group": cdk.stringToCloudFormation(properties.group),
    "LaunchType": cdk.stringToCloudFormation(properties.launchType),
    "NetworkConfiguration": convertCfnRuleNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "PlacementConstraints": cdk.listMapper(convertCfnRulePlacementConstraintPropertyToCloudFormation)(properties.placementConstraints),
    "PlacementStrategies": cdk.listMapper(convertCfnRulePlacementStrategyPropertyToCloudFormation)(properties.placementStrategies),
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion),
    "PropagateTags": cdk.stringToCloudFormation(properties.propagateTags),
    "ReferenceId": cdk.stringToCloudFormation(properties.referenceId),
    "TagList": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tagList),
    "TaskCount": cdk.numberToCloudFormation(properties.taskCount),
    "TaskDefinitionArn": cdk.stringToCloudFormation(properties.taskDefinitionArn)
  };
}

// @ts-ignore TS6133
function CfnRuleEcsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.EcsParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.EcsParametersProperty>();
  ret.addPropertyResult("capacityProviderStrategy", "CapacityProviderStrategy", (properties.CapacityProviderStrategy != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleCapacityProviderStrategyItemPropertyFromCloudFormation)(properties.CapacityProviderStrategy) : undefined));
  ret.addPropertyResult("enableEcsManagedTags", "EnableECSManagedTags", (properties.EnableECSManagedTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableECSManagedTags) : undefined));
  ret.addPropertyResult("enableExecuteCommand", "EnableExecuteCommand", (properties.EnableExecuteCommand != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableExecuteCommand) : undefined));
  ret.addPropertyResult("group", "Group", (properties.Group != null ? cfn_parse.FromCloudFormation.getString(properties.Group) : undefined));
  ret.addPropertyResult("launchType", "LaunchType", (properties.LaunchType != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchType) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnRuleNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("placementConstraints", "PlacementConstraints", (properties.PlacementConstraints != null ? cfn_parse.FromCloudFormation.getArray(CfnRulePlacementConstraintPropertyFromCloudFormation)(properties.PlacementConstraints) : undefined));
  ret.addPropertyResult("placementStrategies", "PlacementStrategies", (properties.PlacementStrategies != null ? cfn_parse.FromCloudFormation.getArray(CfnRulePlacementStrategyPropertyFromCloudFormation)(properties.PlacementStrategies) : undefined));
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getString(properties.PropagateTags) : undefined));
  ret.addPropertyResult("referenceId", "ReferenceId", (properties.ReferenceId != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceId) : undefined));
  ret.addPropertyResult("tagList", "TagList", (properties.TagList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TagList) : undefined));
  ret.addPropertyResult("taskCount", "TaskCount", (properties.TaskCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.TaskCount) : undefined));
  ret.addPropertyResult("taskDefinitionArn", "TaskDefinitionArn", (properties.TaskDefinitionArn != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpParametersProperty`
 *
 * @param properties - the TypeScript properties of a `HttpParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleHttpParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerParameters", cdk.hashValidator(cdk.validateString))(properties.headerParameters));
  errors.collect(cdk.propertyValidator("pathParameterValues", cdk.listValidator(cdk.validateString))(properties.pathParameterValues));
  errors.collect(cdk.propertyValidator("queryStringParameters", cdk.hashValidator(cdk.validateString))(properties.queryStringParameters));
  return errors.wrap("supplied properties not correct for \"HttpParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleHttpParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleHttpParametersPropertyValidator(properties).assertSuccess();
  return {
    "HeaderParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.headerParameters),
    "PathParameterValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.pathParameterValues),
    "QueryStringParameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.queryStringParameters)
  };
}

// @ts-ignore TS6133
function CfnRuleHttpParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.HttpParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.HttpParametersProperty>();
  ret.addPropertyResult("headerParameters", "HeaderParameters", (properties.HeaderParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.HeaderParameters) : undefined));
  ret.addPropertyResult("pathParameterValues", "PathParameterValues", (properties.PathParameterValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PathParameterValues) : undefined));
  ret.addPropertyResult("queryStringParameters", "QueryStringParameters", (properties.QueryStringParameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.QueryStringParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputTransformerProperty`
 *
 * @param properties - the TypeScript properties of a `InputTransformerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleInputTransformerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputPathsMap", cdk.hashValidator(cdk.validateString))(properties.inputPathsMap));
  errors.collect(cdk.propertyValidator("inputTemplate", cdk.requiredValidator)(properties.inputTemplate));
  errors.collect(cdk.propertyValidator("inputTemplate", cdk.validateString)(properties.inputTemplate));
  return errors.wrap("supplied properties not correct for \"InputTransformerProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleInputTransformerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleInputTransformerPropertyValidator(properties).assertSuccess();
  return {
    "InputPathsMap": cdk.hashMapper(cdk.stringToCloudFormation)(properties.inputPathsMap),
    "InputTemplate": cdk.stringToCloudFormation(properties.inputTemplate)
  };
}

// @ts-ignore TS6133
function CfnRuleInputTransformerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.InputTransformerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.InputTransformerProperty>();
  ret.addPropertyResult("inputPathsMap", "InputPathsMap", (properties.InputPathsMap != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.InputPathsMap) : undefined));
  ret.addPropertyResult("inputTemplate", "InputTemplate", (properties.InputTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.InputTemplate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisParametersProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleKinesisParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitionKeyPath", cdk.requiredValidator)(properties.partitionKeyPath));
  errors.collect(cdk.propertyValidator("partitionKeyPath", cdk.validateString)(properties.partitionKeyPath));
  return errors.wrap("supplied properties not correct for \"KinesisParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleKinesisParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleKinesisParametersPropertyValidator(properties).assertSuccess();
  return {
    "PartitionKeyPath": cdk.stringToCloudFormation(properties.partitionKeyPath)
  };
}

// @ts-ignore TS6133
function CfnRuleKinesisParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.KinesisParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.KinesisParametersProperty>();
  ret.addPropertyResult("partitionKeyPath", "PartitionKeyPath", (properties.PartitionKeyPath != null ? cfn_parse.FromCloudFormation.getString(properties.PartitionKeyPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftDataParametersProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftDataParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleRedshiftDataParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("database", cdk.requiredValidator)(properties.database));
  errors.collect(cdk.propertyValidator("database", cdk.validateString)(properties.database));
  errors.collect(cdk.propertyValidator("dbUser", cdk.validateString)(properties.dbUser));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.validateString)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("sql", cdk.validateString)(properties.sql));
  errors.collect(cdk.propertyValidator("sqls", cdk.listValidator(cdk.validateString))(properties.sqls));
  errors.collect(cdk.propertyValidator("statementName", cdk.validateString)(properties.statementName));
  errors.collect(cdk.propertyValidator("withEvent", cdk.validateBoolean)(properties.withEvent));
  return errors.wrap("supplied properties not correct for \"RedshiftDataParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleRedshiftDataParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleRedshiftDataParametersPropertyValidator(properties).assertSuccess();
  return {
    "Database": cdk.stringToCloudFormation(properties.database),
    "DbUser": cdk.stringToCloudFormation(properties.dbUser),
    "SecretManagerArn": cdk.stringToCloudFormation(properties.secretManagerArn),
    "Sql": cdk.stringToCloudFormation(properties.sql),
    "Sqls": cdk.listMapper(cdk.stringToCloudFormation)(properties.sqls),
    "StatementName": cdk.stringToCloudFormation(properties.statementName),
    "WithEvent": cdk.booleanToCloudFormation(properties.withEvent)
  };
}

// @ts-ignore TS6133
function CfnRuleRedshiftDataParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.RedshiftDataParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RedshiftDataParametersProperty>();
  ret.addPropertyResult("database", "Database", (properties.Database != null ? cfn_parse.FromCloudFormation.getString(properties.Database) : undefined));
  ret.addPropertyResult("dbUser", "DbUser", (properties.DbUser != null ? cfn_parse.FromCloudFormation.getString(properties.DbUser) : undefined));
  ret.addPropertyResult("secretManagerArn", "SecretManagerArn", (properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined));
  ret.addPropertyResult("sql", "Sql", (properties.Sql != null ? cfn_parse.FromCloudFormation.getString(properties.Sql) : undefined));
  ret.addPropertyResult("sqls", "Sqls", (properties.Sqls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Sqls) : undefined));
  ret.addPropertyResult("statementName", "StatementName", (properties.StatementName != null ? cfn_parse.FromCloudFormation.getString(properties.StatementName) : undefined));
  ret.addPropertyResult("withEvent", "WithEvent", (properties.WithEvent != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WithEvent) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetryPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `RetryPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleRetryPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maximumEventAgeInSeconds", cdk.validateNumber)(properties.maximumEventAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  return errors.wrap("supplied properties not correct for \"RetryPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleRetryPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleRetryPolicyPropertyValidator(properties).assertSuccess();
  return {
    "MaximumEventAgeInSeconds": cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts)
  };
}

// @ts-ignore TS6133
function CfnRuleRetryPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.RetryPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RetryPolicyProperty>();
  ret.addPropertyResult("maximumEventAgeInSeconds", "MaximumEventAgeInSeconds", (properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RunCommandTargetProperty`
 *
 * @param properties - the TypeScript properties of a `RunCommandTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleRunCommandTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"RunCommandTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleRunCommandTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleRunCommandTargetPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnRuleRunCommandTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.RunCommandTargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RunCommandTargetProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RunCommandParametersProperty`
 *
 * @param properties - the TypeScript properties of a `RunCommandParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleRunCommandParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("runCommandTargets", cdk.requiredValidator)(properties.runCommandTargets));
  errors.collect(cdk.propertyValidator("runCommandTargets", cdk.listValidator(CfnRuleRunCommandTargetPropertyValidator))(properties.runCommandTargets));
  return errors.wrap("supplied properties not correct for \"RunCommandParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleRunCommandParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleRunCommandParametersPropertyValidator(properties).assertSuccess();
  return {
    "RunCommandTargets": cdk.listMapper(convertCfnRuleRunCommandTargetPropertyToCloudFormation)(properties.runCommandTargets)
  };
}

// @ts-ignore TS6133
function CfnRuleRunCommandParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.RunCommandParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RunCommandParametersProperty>();
  ret.addPropertyResult("runCommandTargets", "RunCommandTargets", (properties.RunCommandTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleRunCommandTargetPropertyFromCloudFormation)(properties.RunCommandTargets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleSageMakerPipelineParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SageMakerPipelineParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleSageMakerPipelineParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleSageMakerPipelineParameterPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleSageMakerPipelineParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.SageMakerPipelineParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.SageMakerPipelineParameterProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SageMakerPipelineParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SageMakerPipelineParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleSageMakerPipelineParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pipelineParameterList", cdk.listValidator(CfnRuleSageMakerPipelineParameterPropertyValidator))(properties.pipelineParameterList));
  return errors.wrap("supplied properties not correct for \"SageMakerPipelineParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleSageMakerPipelineParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleSageMakerPipelineParametersPropertyValidator(properties).assertSuccess();
  return {
    "PipelineParameterList": cdk.listMapper(convertCfnRuleSageMakerPipelineParameterPropertyToCloudFormation)(properties.pipelineParameterList)
  };
}

// @ts-ignore TS6133
function CfnRuleSageMakerPipelineParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.SageMakerPipelineParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.SageMakerPipelineParametersProperty>();
  ret.addPropertyResult("pipelineParameterList", "PipelineParameterList", (properties.PipelineParameterList != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleSageMakerPipelineParameterPropertyFromCloudFormation)(properties.PipelineParameterList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqsParametersProperty`
 *
 * @param properties - the TypeScript properties of a `SqsParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleSqsParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("messageGroupId", cdk.requiredValidator)(properties.messageGroupId));
  errors.collect(cdk.propertyValidator("messageGroupId", cdk.validateString)(properties.messageGroupId));
  return errors.wrap("supplied properties not correct for \"SqsParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleSqsParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleSqsParametersPropertyValidator(properties).assertSuccess();
  return {
    "MessageGroupId": cdk.stringToCloudFormation(properties.messageGroupId)
  };
}

// @ts-ignore TS6133
function CfnRuleSqsParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.SqsParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.SqsParametersProperty>();
  ret.addPropertyResult("messageGroupId", "MessageGroupId", (properties.MessageGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.MessageGroupId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppSyncParametersProperty`
 *
 * @param properties - the TypeScript properties of a `AppSyncParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleAppSyncParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("graphQlOperation", cdk.requiredValidator)(properties.graphQlOperation));
  errors.collect(cdk.propertyValidator("graphQlOperation", cdk.validateString)(properties.graphQlOperation));
  return errors.wrap("supplied properties not correct for \"AppSyncParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleAppSyncParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleAppSyncParametersPropertyValidator(properties).assertSuccess();
  return {
    "GraphQLOperation": cdk.stringToCloudFormation(properties.graphQlOperation)
  };
}

// @ts-ignore TS6133
function CfnRuleAppSyncParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.AppSyncParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.AppSyncParametersProperty>();
  ret.addPropertyResult("graphQlOperation", "GraphQLOperation", (properties.GraphQLOperation != null ? cfn_parse.FromCloudFormation.getString(properties.GraphQLOperation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appSyncParameters", CfnRuleAppSyncParametersPropertyValidator)(properties.appSyncParameters));
  errors.collect(cdk.propertyValidator("arn", cdk.requiredValidator)(properties.arn));
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("batchParameters", CfnRuleBatchParametersPropertyValidator)(properties.batchParameters));
  errors.collect(cdk.propertyValidator("deadLetterConfig", CfnRuleDeadLetterConfigPropertyValidator)(properties.deadLetterConfig));
  errors.collect(cdk.propertyValidator("ecsParameters", CfnRuleEcsParametersPropertyValidator)(properties.ecsParameters));
  errors.collect(cdk.propertyValidator("httpParameters", CfnRuleHttpParametersPropertyValidator)(properties.httpParameters));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("inputPath", cdk.validateString)(properties.inputPath));
  errors.collect(cdk.propertyValidator("inputTransformer", CfnRuleInputTransformerPropertyValidator)(properties.inputTransformer));
  errors.collect(cdk.propertyValidator("kinesisParameters", CfnRuleKinesisParametersPropertyValidator)(properties.kinesisParameters));
  errors.collect(cdk.propertyValidator("redshiftDataParameters", CfnRuleRedshiftDataParametersPropertyValidator)(properties.redshiftDataParameters));
  errors.collect(cdk.propertyValidator("retryPolicy", CfnRuleRetryPolicyPropertyValidator)(properties.retryPolicy));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("runCommandParameters", CfnRuleRunCommandParametersPropertyValidator)(properties.runCommandParameters));
  errors.collect(cdk.propertyValidator("sageMakerPipelineParameters", CfnRuleSageMakerPipelineParametersPropertyValidator)(properties.sageMakerPipelineParameters));
  errors.collect(cdk.propertyValidator("sqsParameters", CfnRuleSqsParametersPropertyValidator)(properties.sqsParameters));
  return errors.wrap("supplied properties not correct for \"TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleTargetPropertyValidator(properties).assertSuccess();
  return {
    "AppSyncParameters": convertCfnRuleAppSyncParametersPropertyToCloudFormation(properties.appSyncParameters),
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "BatchParameters": convertCfnRuleBatchParametersPropertyToCloudFormation(properties.batchParameters),
    "DeadLetterConfig": convertCfnRuleDeadLetterConfigPropertyToCloudFormation(properties.deadLetterConfig),
    "EcsParameters": convertCfnRuleEcsParametersPropertyToCloudFormation(properties.ecsParameters),
    "HttpParameters": convertCfnRuleHttpParametersPropertyToCloudFormation(properties.httpParameters),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Input": cdk.stringToCloudFormation(properties.input),
    "InputPath": cdk.stringToCloudFormation(properties.inputPath),
    "InputTransformer": convertCfnRuleInputTransformerPropertyToCloudFormation(properties.inputTransformer),
    "KinesisParameters": convertCfnRuleKinesisParametersPropertyToCloudFormation(properties.kinesisParameters),
    "RedshiftDataParameters": convertCfnRuleRedshiftDataParametersPropertyToCloudFormation(properties.redshiftDataParameters),
    "RetryPolicy": convertCfnRuleRetryPolicyPropertyToCloudFormation(properties.retryPolicy),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "RunCommandParameters": convertCfnRuleRunCommandParametersPropertyToCloudFormation(properties.runCommandParameters),
    "SageMakerPipelineParameters": convertCfnRuleSageMakerPipelineParametersPropertyToCloudFormation(properties.sageMakerPipelineParameters),
    "SqsParameters": convertCfnRuleSqsParametersPropertyToCloudFormation(properties.sqsParameters)
  };
}

// @ts-ignore TS6133
function CfnRuleTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.TargetProperty>();
  ret.addPropertyResult("appSyncParameters", "AppSyncParameters", (properties.AppSyncParameters != null ? CfnRuleAppSyncParametersPropertyFromCloudFormation(properties.AppSyncParameters) : undefined));
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("batchParameters", "BatchParameters", (properties.BatchParameters != null ? CfnRuleBatchParametersPropertyFromCloudFormation(properties.BatchParameters) : undefined));
  ret.addPropertyResult("deadLetterConfig", "DeadLetterConfig", (properties.DeadLetterConfig != null ? CfnRuleDeadLetterConfigPropertyFromCloudFormation(properties.DeadLetterConfig) : undefined));
  ret.addPropertyResult("ecsParameters", "EcsParameters", (properties.EcsParameters != null ? CfnRuleEcsParametersPropertyFromCloudFormation(properties.EcsParameters) : undefined));
  ret.addPropertyResult("httpParameters", "HttpParameters", (properties.HttpParameters != null ? CfnRuleHttpParametersPropertyFromCloudFormation(properties.HttpParameters) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("inputPath", "InputPath", (properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined));
  ret.addPropertyResult("inputTransformer", "InputTransformer", (properties.InputTransformer != null ? CfnRuleInputTransformerPropertyFromCloudFormation(properties.InputTransformer) : undefined));
  ret.addPropertyResult("kinesisParameters", "KinesisParameters", (properties.KinesisParameters != null ? CfnRuleKinesisParametersPropertyFromCloudFormation(properties.KinesisParameters) : undefined));
  ret.addPropertyResult("redshiftDataParameters", "RedshiftDataParameters", (properties.RedshiftDataParameters != null ? CfnRuleRedshiftDataParametersPropertyFromCloudFormation(properties.RedshiftDataParameters) : undefined));
  ret.addPropertyResult("retryPolicy", "RetryPolicy", (properties.RetryPolicy != null ? CfnRuleRetryPolicyPropertyFromCloudFormation(properties.RetryPolicy) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("runCommandParameters", "RunCommandParameters", (properties.RunCommandParameters != null ? CfnRuleRunCommandParametersPropertyFromCloudFormation(properties.RunCommandParameters) : undefined));
  ret.addPropertyResult("sageMakerPipelineParameters", "SageMakerPipelineParameters", (properties.SageMakerPipelineParameters != null ? CfnRuleSageMakerPipelineParametersPropertyFromCloudFormation(properties.SageMakerPipelineParameters) : undefined));
  ret.addPropertyResult("sqsParameters", "SqsParameters", (properties.SqsParameters != null ? CfnRuleSqsParametersPropertyFromCloudFormation(properties.SqsParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventBusName", cdk.validateString)(properties.eventBusName));
  errors.collect(cdk.propertyValidator("eventPattern", cdk.validateObject)(properties.eventPattern));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnRuleTargetPropertyValidator))(properties.targets));
  return errors.wrap("supplied properties not correct for \"CfnRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventBusName": cdk.stringToCloudFormation(properties.eventBusName),
    "EventPattern": cdk.objectToCloudFormation(properties.eventPattern),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression),
    "State": cdk.stringToCloudFormation(properties.state),
    "Targets": cdk.listMapper(convertCfnRuleTargetPropertyToCloudFormation)(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventBusName", "EventBusName", (properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined));
  ret.addPropertyResult("eventPattern", "EventPattern", (properties.EventPattern != null ? cfn_parse.FromCloudFormation.getAny(properties.EventPattern) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleTargetPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagProperty`
 *
 * @param properties - the TypeScript properties of a `TagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.TagProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.TagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}