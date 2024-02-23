/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::ApiGatewayV2::Api` resource creates an API.
 *
 * WebSocket APIs and HTTP APIs are supported. For more information about WebSocket APIs, see [About WebSocket APIs in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html) in the *API Gateway Developer Guide* . For more information about HTTP APIs, see [HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) in the *API Gateway Developer Guide.*
 *
 * @cloudformationResource AWS::ApiGatewayV2::Api
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 */
export class CfnApi extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Api";

  /**
   * Build a CfnApi from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApi {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApi(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The default endpoint for an API. For example: `https://abcdef.execute-api.us-west-2.amazonaws.com` .
   *
   * @cloudformationAttribute ApiEndpoint
   */
  public readonly attrApiEndpoint: string;

  /**
   * The API identifier.
   *
   * @cloudformationAttribute ApiId
   */
  public readonly attrApiId: string;

  /**
   * An API key selection expression.
   */
  public apiKeySelectionExpression?: string;

  /**
   * Specifies how to interpret the base path of the API during import.
   */
  public basePath?: string;

  /**
   * The OpenAPI definition.
   */
  public body?: any | cdk.IResolvable;

  /**
   * The S3 location of an OpenAPI definition.
   */
  public bodyS3Location?: CfnApi.BodyS3LocationProperty | cdk.IResolvable;

  /**
   * A CORS configuration.
   */
  public corsConfiguration?: CfnApi.CorsProperty | cdk.IResolvable;

  /**
   * This property is part of quick create.
   */
  public credentialsArn?: string;

  /**
   * The description of the API.
   */
  public description?: string;

  /**
   * Specifies whether clients can invoke your API by using the default `execute-api` endpoint.
   */
  public disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * Avoid validating models when creating a deployment.
   */
  public disableSchemaValidation?: boolean | cdk.IResolvable;

  /**
   * Specifies whether to rollback the API creation when a warning is encountered.
   */
  public failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * The name of the API.
   */
  public name?: string;

  /**
   * The API protocol.
   */
  public protocolType?: string;

  /**
   * This property is part of quick create.
   */
  public routeKey?: string;

  /**
   * The route selection expression for the API.
   */
  public routeSelectionExpression?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * This property is part of quick create.
   */
  public target?: string;

  /**
   * A version identifier for the API.
   */
  public version?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiProps = {}) {
    super(scope, id, {
      "type": CfnApi.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrApiEndpoint = cdk.Token.asString(this.getAtt("ApiEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrApiId = cdk.Token.asString(this.getAtt("ApiId", cdk.ResolutionTypeHint.STRING));
    this.apiKeySelectionExpression = props.apiKeySelectionExpression;
    this.basePath = props.basePath;
    this.body = props.body;
    this.bodyS3Location = props.bodyS3Location;
    this.corsConfiguration = props.corsConfiguration;
    this.credentialsArn = props.credentialsArn;
    this.description = props.description;
    this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
    this.disableSchemaValidation = props.disableSchemaValidation;
    this.failOnWarnings = props.failOnWarnings;
    this.name = props.name;
    this.protocolType = props.protocolType;
    this.routeKey = props.routeKey;
    this.routeSelectionExpression = props.routeSelectionExpression;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ApiGatewayV2::Api", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.target = props.target;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiKeySelectionExpression": this.apiKeySelectionExpression,
      "basePath": this.basePath,
      "body": this.body,
      "bodyS3Location": this.bodyS3Location,
      "corsConfiguration": this.corsConfiguration,
      "credentialsArn": this.credentialsArn,
      "description": this.description,
      "disableExecuteApiEndpoint": this.disableExecuteApiEndpoint,
      "disableSchemaValidation": this.disableSchemaValidation,
      "failOnWarnings": this.failOnWarnings,
      "name": this.name,
      "protocolType": this.protocolType,
      "routeKey": this.routeKey,
      "routeSelectionExpression": this.routeSelectionExpression,
      "tags": this.tags.renderTags(),
      "target": this.target,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApi.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiPropsToCloudFormation(props);
  }
}

export namespace CfnApi {
  /**
   * The `BodyS3Location` property specifies an S3 location from which to import an OpenAPI definition.
   *
   * Supported only for HTTP APIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html
   */
  export interface BodyS3LocationProperty {
    /**
     * The S3 bucket that contains the OpenAPI definition to import.
     *
     * Required if you specify a `BodyS3Location` for an API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-bucket
     */
    readonly bucket?: string;

    /**
     * The Etag of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-etag
     */
    readonly etag?: string;

    /**
     * The key of the S3 object.
     *
     * Required if you specify a `BodyS3Location` for an API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-key
     */
    readonly key?: string;

    /**
     * The version of the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-version
     */
    readonly version?: string;
  }

  /**
   * The `Cors` property specifies a CORS configuration for an API.
   *
   * Supported only for HTTP APIs. See [Configuring CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html) for more information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html
   */
  export interface CorsProperty {
    /**
     * Specifies whether credentials are included in the CORS request.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;

    /**
     * Represents a collection of allowed headers.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowheaders
     */
    readonly allowHeaders?: Array<string>;

    /**
     * Represents a collection of allowed HTTP methods.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowmethods
     */
    readonly allowMethods?: Array<string>;

    /**
     * Represents a collection of allowed origins.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-alloworigins
     */
    readonly allowOrigins?: Array<string>;

    /**
     * Represents a collection of exposed headers.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-exposeheaders
     */
    readonly exposeHeaders?: Array<string>;

    /**
     * The number of seconds that the browser should cache preflight request results.
     *
     * Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-maxage
     */
    readonly maxAge?: number;
  }
}

/**
 * Properties for defining a `CfnApi`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 */
export interface CfnApiProps {
  /**
   * An API key selection expression.
   *
   * Supported only for WebSocket APIs. See [API Key Selection Expressions](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-selection-expressions.html#apigateway-websocket-api-apikey-selection-expressions) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-apikeyselectionexpression
   */
  readonly apiKeySelectionExpression?: string;

  /**
   * Specifies how to interpret the base path of the API during import.
   *
   * Valid values are `ignore` , `prepend` , and `split` . The default value is `ignore` . To learn more, see [Set the OpenAPI basePath Property](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api-basePath.html) . Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-basepath
   */
  readonly basePath?: string;

  /**
   * The OpenAPI definition.
   *
   * Supported only for HTTP APIs. To import an HTTP API, you must specify a `Body` or `BodyS3Location` . If you specify a `Body` or `BodyS3Location` , don't specify CloudFormation resources such as `AWS::ApiGatewayV2::Authorizer` or `AWS::ApiGatewayV2::Route` . API Gateway doesn't support the combination of OpenAPI and CloudFormation resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-body
   */
  readonly body?: any | cdk.IResolvable;

  /**
   * The S3 location of an OpenAPI definition.
   *
   * Supported only for HTTP APIs. To import an HTTP API, you must specify a `Body` or `BodyS3Location` . If you specify a `Body` or `BodyS3Location` , don't specify CloudFormation resources such as `AWS::ApiGatewayV2::Authorizer` or `AWS::ApiGatewayV2::Route` . API Gateway doesn't support the combination of OpenAPI and CloudFormation resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-bodys3location
   */
  readonly bodyS3Location?: CfnApi.BodyS3LocationProperty | cdk.IResolvable;

  /**
   * A CORS configuration.
   *
   * Supported only for HTTP APIs. See [Configuring CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html) for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-corsconfiguration
   */
  readonly corsConfiguration?: CfnApi.CorsProperty | cdk.IResolvable;

  /**
   * This property is part of quick create.
   *
   * It specifies the credentials required for the integration, if any. For a Lambda integration, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify `arn:aws:iam::*:user/*` . To use resource-based permissions on supported AWS services, specify `null` . Currently, this property is not used for HTTP integrations. Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-credentialsarn
   */
  readonly credentialsArn?: string;

  /**
   * The description of the API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-description
   */
  readonly description?: string;

  /**
   * Specifies whether clients can invoke your API by using the default `execute-api` endpoint.
   *
   * By default, clients can invoke your API with the default https://{api_id}.execute-api.{region}.amazonaws.com endpoint. To require that clients use a custom domain name to invoke your API, disable the default endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableexecuteapiendpoint
   */
  readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * Avoid validating models when creating a deployment.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableschemavalidation
   */
  readonly disableSchemaValidation?: boolean | cdk.IResolvable;

  /**
   * Specifies whether to rollback the API creation when a warning is encountered.
   *
   * By default, API creation continues if a warning is encountered.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-failonwarnings
   */
  readonly failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * The name of the API.
   *
   * Required unless you specify an OpenAPI definition for `Body` or `S3BodyLocation` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-name
   */
  readonly name?: string;

  /**
   * The API protocol.
   *
   * Valid values are `WEBSOCKET` or `HTTP` . Required unless you specify an OpenAPI definition for `Body` or `S3BodyLocation` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-protocoltype
   */
  readonly protocolType?: string;

  /**
   * This property is part of quick create.
   *
   * If you don't specify a `routeKey` , a default route of `$default` is created. The `$default` route acts as a catch-all for any request made to your API, for a particular stage. The `$default` route key can't be modified. You can add routes after creating the API, and you can update the route keys of additional routes. Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routekey
   */
  readonly routeKey?: string;

  /**
   * The route selection expression for the API.
   *
   * For HTTP APIs, the `routeSelectionExpression` must be `${request.method} ${request.path}` . If not provided, this will be the default for HTTP APIs. This property is required for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression
   */
  readonly routeSelectionExpression?: string;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * This property is part of quick create.
   *
   * Quick create produces an API with an integration, a default catch-all route, and a default stage which is configured to automatically deploy changes. For HTTP integrations, specify a fully qualified URL. For Lambda integrations, specify a function ARN. The type of the integration will be HTTP_PROXY or AWS_PROXY, respectively. Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-target
   */
  readonly target?: string;

  /**
   * A version identifier for the API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `BodyS3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `BodyS3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiBodyS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("etag", cdk.validateString)(properties.etag));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"BodyS3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiBodyS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiBodyS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Etag": cdk.stringToCloudFormation(properties.etag),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnApiBodyS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.BodyS3LocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.BodyS3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("etag", "Etag", (properties.Etag != null ? cfn_parse.FromCloudFormation.getString(properties.Etag) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsProperty`
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiCorsPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnApiCorsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiCorsPropertyValidator(properties).assertSuccess();
  return {
    "AllowCredentials": cdk.booleanToCloudFormation(properties.allowCredentials),
    "AllowHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
    "AllowMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
    "AllowOrigins": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
    "ExposeHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
    "MaxAge": cdk.numberToCloudFormation(properties.maxAge)
  };
}

// @ts-ignore TS6133
function CfnApiCorsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.CorsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.CorsProperty>();
  ret.addPropertyResult("allowCredentials", "AllowCredentials", (properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined));
  ret.addPropertyResult("allowHeaders", "AllowHeaders", (properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowHeaders) : undefined));
  ret.addPropertyResult("allowMethods", "AllowMethods", (properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowMethods) : undefined));
  ret.addPropertyResult("allowOrigins", "AllowOrigins", (properties.AllowOrigins != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowOrigins) : undefined));
  ret.addPropertyResult("exposeHeaders", "ExposeHeaders", (properties.ExposeHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExposeHeaders) : undefined));
  ret.addPropertyResult("maxAge", "MaxAge", (properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeySelectionExpression", cdk.validateString)(properties.apiKeySelectionExpression));
  errors.collect(cdk.propertyValidator("basePath", cdk.validateString)(properties.basePath));
  errors.collect(cdk.propertyValidator("body", cdk.validateObject)(properties.body));
  errors.collect(cdk.propertyValidator("bodyS3Location", CfnApiBodyS3LocationPropertyValidator)(properties.bodyS3Location));
  errors.collect(cdk.propertyValidator("corsConfiguration", CfnApiCorsPropertyValidator)(properties.corsConfiguration));
  errors.collect(cdk.propertyValidator("credentialsArn", cdk.validateString)(properties.credentialsArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disableExecuteApiEndpoint", cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
  errors.collect(cdk.propertyValidator("disableSchemaValidation", cdk.validateBoolean)(properties.disableSchemaValidation));
  errors.collect(cdk.propertyValidator("failOnWarnings", cdk.validateBoolean)(properties.failOnWarnings));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocolType", cdk.validateString)(properties.protocolType));
  errors.collect(cdk.propertyValidator("routeKey", cdk.validateString)(properties.routeKey));
  errors.collect(cdk.propertyValidator("routeSelectionExpression", cdk.validateString)(properties.routeSelectionExpression));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnApiProps\"");
}

// @ts-ignore TS6133
function convertCfnApiPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiPropsValidator(properties).assertSuccess();
  return {
    "ApiKeySelectionExpression": cdk.stringToCloudFormation(properties.apiKeySelectionExpression),
    "BasePath": cdk.stringToCloudFormation(properties.basePath),
    "Body": cdk.objectToCloudFormation(properties.body),
    "BodyS3Location": convertCfnApiBodyS3LocationPropertyToCloudFormation(properties.bodyS3Location),
    "CorsConfiguration": convertCfnApiCorsPropertyToCloudFormation(properties.corsConfiguration),
    "CredentialsArn": cdk.stringToCloudFormation(properties.credentialsArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisableExecuteApiEndpoint": cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
    "DisableSchemaValidation": cdk.booleanToCloudFormation(properties.disableSchemaValidation),
    "FailOnWarnings": cdk.booleanToCloudFormation(properties.failOnWarnings),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProtocolType": cdk.stringToCloudFormation(properties.protocolType),
    "RouteKey": cdk.stringToCloudFormation(properties.routeKey),
    "RouteSelectionExpression": cdk.stringToCloudFormation(properties.routeSelectionExpression),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Target": cdk.stringToCloudFormation(properties.target),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiProps>();
  ret.addPropertyResult("apiKeySelectionExpression", "ApiKeySelectionExpression", (properties.ApiKeySelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ApiKeySelectionExpression) : undefined));
  ret.addPropertyResult("basePath", "BasePath", (properties.BasePath != null ? cfn_parse.FromCloudFormation.getString(properties.BasePath) : undefined));
  ret.addPropertyResult("body", "Body", (properties.Body != null ? cfn_parse.FromCloudFormation.getAny(properties.Body) : undefined));
  ret.addPropertyResult("bodyS3Location", "BodyS3Location", (properties.BodyS3Location != null ? CfnApiBodyS3LocationPropertyFromCloudFormation(properties.BodyS3Location) : undefined));
  ret.addPropertyResult("corsConfiguration", "CorsConfiguration", (properties.CorsConfiguration != null ? CfnApiCorsPropertyFromCloudFormation(properties.CorsConfiguration) : undefined));
  ret.addPropertyResult("credentialsArn", "CredentialsArn", (properties.CredentialsArn != null ? cfn_parse.FromCloudFormation.getString(properties.CredentialsArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disableExecuteApiEndpoint", "DisableExecuteApiEndpoint", (properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined));
  ret.addPropertyResult("disableSchemaValidation", "DisableSchemaValidation", (properties.DisableSchemaValidation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableSchemaValidation) : undefined));
  ret.addPropertyResult("failOnWarnings", "FailOnWarnings", (properties.FailOnWarnings != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailOnWarnings) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocolType", "ProtocolType", (properties.ProtocolType != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolType) : undefined));
  ret.addPropertyResult("routeKey", "RouteKey", (properties.RouteKey != null ? cfn_parse.FromCloudFormation.getString(properties.RouteKey) : undefined));
  ret.addPropertyResult("routeSelectionExpression", "RouteSelectionExpression", (properties.RouteSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.RouteSelectionExpression) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::ApiGatewayManagedOverrides` resource overrides the default properties of API Gateway-managed resources that are implicitly configured for you when you use quick create.
 *
 * When you create an API by using quick create, an `AWS::ApiGatewayV2::Route` , `AWS::ApiGatewayV2::Integration` , and `AWS::ApiGatewayV2::Stage` are created for you and associated with your `AWS::ApiGatewayV2::Api` . The `AWS::ApiGatewayV2::ApiGatewayManagedOverrides` resource enables you to set, or override the properties of these implicit resources. Supported only for HTTP APIs.
 *
 * @cloudformationResource AWS::ApiGatewayV2::ApiGatewayManagedOverrides
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html
 */
export class CfnApiGatewayManagedOverrides extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::ApiGatewayManagedOverrides";

  /**
   * Build a CfnApiGatewayManagedOverrides from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApiGatewayManagedOverrides {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiGatewayManagedOverridesPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApiGatewayManagedOverrides(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the API for which to override the configuration of API Gateway-managed resources.
   */
  public apiId: string;

  /**
   * Overrides the integration configuration for an API Gateway-managed integration.
   */
  public integration?: CfnApiGatewayManagedOverrides.IntegrationOverridesProperty | cdk.IResolvable;

  /**
   * Overrides the route configuration for an API Gateway-managed route.
   */
  public route?: cdk.IResolvable | CfnApiGatewayManagedOverrides.RouteOverridesProperty;

  /**
   * Overrides the stage configuration for an API Gateway-managed stage.
   */
  public stage?: cdk.IResolvable | CfnApiGatewayManagedOverrides.StageOverridesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiGatewayManagedOverridesProps) {
    super(scope, id, {
      "type": CfnApiGatewayManagedOverrides.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.integration = props.integration;
    this.route = props.route;
    this.stage = props.stage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "integration": this.integration,
      "route": this.route,
      "stage": this.stage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiGatewayManagedOverrides.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiGatewayManagedOverridesPropsToCloudFormation(props);
  }
}

export namespace CfnApiGatewayManagedOverrides {
  /**
   * The `IntegrationOverrides` property overrides the integration settings for an API Gateway-managed integration.
   *
   * If you remove this property, API Gateway restores the default values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides.html
   */
  export interface IntegrationOverridesProperty {
    /**
     * The description of the integration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides-description
     */
    readonly description?: string;

    /**
     * Specifies the integration's HTTP method type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides-integrationmethod
     */
    readonly integrationMethod?: string;

    /**
     * Specifies the format of the payload sent to an integration.
     *
     * Required for HTTP APIs. For HTTP APIs, supported values for Lambda proxy integrations are `1.0` and `2.0` . For all other integrations, `1.0` is the only supported value. To learn more, see [Working with AWS Lambda proxy integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides-payloadformatversion
     */
    readonly payloadFormatVersion?: string;

    /**
     * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs.
     *
     * The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-integrationoverrides-timeoutinmillis
     */
    readonly timeoutInMillis?: number;
  }

  /**
   * The `StageOverrides` property overrides the stage configuration for an API Gateway-managed stage.
   *
   * If you remove this property, API Gateway restores the default values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html
   */
  export interface StageOverridesProperty {
    /**
     * Settings for logging access in a stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-accesslogsettings
     */
    readonly accessLogSettings?: CfnApiGatewayManagedOverrides.AccessLogSettingsProperty | cdk.IResolvable;

    /**
     * Specifies whether updates to an API automatically trigger a new deployment.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-autodeploy
     */
    readonly autoDeploy?: boolean | cdk.IResolvable;

    /**
     * The default route settings for the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-defaultroutesettings
     */
    readonly defaultRouteSettings?: cdk.IResolvable | CfnApiGatewayManagedOverrides.RouteSettingsProperty;

    /**
     * The description for the API stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-description
     */
    readonly description?: string;

    /**
     * Route settings for the stage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-routesettings
     */
    readonly routeSettings?: any | cdk.IResolvable;

    /**
     * A map that defines the stage variables for a `Stage` .
     *
     * Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&=,]+.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-stageoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stageoverrides-stagevariables
     */
    readonly stageVariables?: any | cdk.IResolvable;
  }

  /**
   * The `AccessLogSettings` property overrides the access log settings for an API Gateway-managed stage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-accesslogsettings.html
   */
  export interface AccessLogSettingsProperty {
    /**
     * The ARN of the CloudWatch Logs log group to receive access logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-accesslogsettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-accesslogsettings-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * A single line format of the access logs of data, as specified by selected $context variables.
     *
     * The format must include at least $context.requestId.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-accesslogsettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-accesslogsettings-format
     */
    readonly format?: string;
  }

  /**
   * The `RouteSettings` property overrides the route settings for an API Gateway-managed route.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html
   */
  export interface RouteSettingsProperty {
    /**
     * Specifies whether ( `true` ) or not ( `false` ) data trace logging is enabled for this route.
     *
     * This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routesettings-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies whether detailed metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routesettings-detailedmetricsenabled
     */
    readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the logging level for this route: `INFO` , `ERROR` , or `OFF` .
     *
     * This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routesettings-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * Specifies the throttling burst limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routesettings-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * Specifies the throttling rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routesettings.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routesettings-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }

  /**
   * The `RouteOverrides` property overrides the route configuration for an API Gateway-managed route.
   *
   * If you remove this property, API Gateway restores the default values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html
   */
  export interface RouteOverridesProperty {
    /**
     * The authorization scopes supported by this route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routeoverrides-authorizationscopes
     */
    readonly authorizationScopes?: Array<string>;

    /**
     * The authorization type for the route.
     *
     * To learn more, see [AuthorizationType](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routeoverrides-authorizationtype
     */
    readonly authorizationType?: string;

    /**
     * The identifier of the `Authorizer` resource to be associated with this route.
     *
     * The authorizer identifier is generated by API Gateway when you created the authorizer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routeoverrides-authorizerid
     */
    readonly authorizerId?: string;

    /**
     * The operation name for the route.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routeoverrides-operationname
     */
    readonly operationName?: string;

    /**
     * For HTTP integrations, specify a fully qualified URL.
     *
     * For Lambda integrations, specify a function ARN. The type of the integration will be HTTP_PROXY or AWS_PROXY, respectively.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-apigatewaymanagedoverrides-routeoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-routeoverrides-target
     */
    readonly target?: string;
  }
}

/**
 * Properties for defining a `CfnApiGatewayManagedOverrides`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html
 */
export interface CfnApiGatewayManagedOverridesProps {
  /**
   * The ID of the API for which to override the configuration of API Gateway-managed resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-apiid
   */
  readonly apiId: string;

  /**
   * Overrides the integration configuration for an API Gateway-managed integration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-integration
   */
  readonly integration?: CfnApiGatewayManagedOverrides.IntegrationOverridesProperty | cdk.IResolvable;

  /**
   * Overrides the route configuration for an API Gateway-managed route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-route
   */
  readonly route?: cdk.IResolvable | CfnApiGatewayManagedOverrides.RouteOverridesProperty;

  /**
   * Overrides the stage configuration for an API Gateway-managed stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apigatewaymanagedoverrides.html#cfn-apigatewayv2-apigatewaymanagedoverrides-stage
   */
  readonly stage?: cdk.IResolvable | CfnApiGatewayManagedOverrides.StageOverridesProperty;
}

/**
 * Determine whether the given properties match those of a `IntegrationOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `IntegrationOverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesIntegrationOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("integrationMethod", cdk.validateString)(properties.integrationMethod));
  errors.collect(cdk.propertyValidator("payloadFormatVersion", cdk.validateString)(properties.payloadFormatVersion));
  errors.collect(cdk.propertyValidator("timeoutInMillis", cdk.validateNumber)(properties.timeoutInMillis));
  return errors.wrap("supplied properties not correct for \"IntegrationOverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesIntegrationOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesIntegrationOverridesPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "IntegrationMethod": cdk.stringToCloudFormation(properties.integrationMethod),
    "PayloadFormatVersion": cdk.stringToCloudFormation(properties.payloadFormatVersion),
    "TimeoutInMillis": cdk.numberToCloudFormation(properties.timeoutInMillis)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesIntegrationOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiGatewayManagedOverrides.IntegrationOverridesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverrides.IntegrationOverridesProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("integrationMethod", "IntegrationMethod", (properties.IntegrationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationMethod) : undefined));
  ret.addPropertyResult("payloadFormatVersion", "PayloadFormatVersion", (properties.PayloadFormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadFormatVersion) : undefined));
  ret.addPropertyResult("timeoutInMillis", "TimeoutInMillis", (properties.TimeoutInMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMillis) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesAccessLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesAccessLogSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesAccessLogSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesAccessLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiGatewayManagedOverrides.AccessLogSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverrides.AccessLogSettingsProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesRouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("detailedMetricsEnabled", cdk.validateBoolean)(properties.detailedMetricsEnabled));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"RouteSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesRouteSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesRouteSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "DetailedMetricsEnabled": cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApiGatewayManagedOverrides.RouteSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverrides.RouteSettingsProperty>();
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("detailedMetricsEnabled", "DetailedMetricsEnabled", (properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StageOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `StageOverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesStageOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSettings", CfnApiGatewayManagedOverridesAccessLogSettingsPropertyValidator)(properties.accessLogSettings));
  errors.collect(cdk.propertyValidator("autoDeploy", cdk.validateBoolean)(properties.autoDeploy));
  errors.collect(cdk.propertyValidator("defaultRouteSettings", CfnApiGatewayManagedOverridesRouteSettingsPropertyValidator)(properties.defaultRouteSettings));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("routeSettings", cdk.validateObject)(properties.routeSettings));
  errors.collect(cdk.propertyValidator("stageVariables", cdk.validateObject)(properties.stageVariables));
  return errors.wrap("supplied properties not correct for \"StageOverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesStageOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesStageOverridesPropertyValidator(properties).assertSuccess();
  return {
    "AccessLogSettings": convertCfnApiGatewayManagedOverridesAccessLogSettingsPropertyToCloudFormation(properties.accessLogSettings),
    "AutoDeploy": cdk.booleanToCloudFormation(properties.autoDeploy),
    "DefaultRouteSettings": convertCfnApiGatewayManagedOverridesRouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
    "Description": cdk.stringToCloudFormation(properties.description),
    "RouteSettings": cdk.objectToCloudFormation(properties.routeSettings),
    "StageVariables": cdk.objectToCloudFormation(properties.stageVariables)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesStageOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApiGatewayManagedOverrides.StageOverridesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverrides.StageOverridesProperty>();
  ret.addPropertyResult("accessLogSettings", "AccessLogSettings", (properties.AccessLogSettings != null ? CfnApiGatewayManagedOverridesAccessLogSettingsPropertyFromCloudFormation(properties.AccessLogSettings) : undefined));
  ret.addPropertyResult("autoDeploy", "AutoDeploy", (properties.AutoDeploy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoDeploy) : undefined));
  ret.addPropertyResult("defaultRouteSettings", "DefaultRouteSettings", (properties.DefaultRouteSettings != null ? CfnApiGatewayManagedOverridesRouteSettingsPropertyFromCloudFormation(properties.DefaultRouteSettings) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("routeSettings", "RouteSettings", (properties.RouteSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.RouteSettings) : undefined));
  ret.addPropertyResult("stageVariables", "StageVariables", (properties.StageVariables != null ? cfn_parse.FromCloudFormation.getAny(properties.StageVariables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteOverridesProperty`
 *
 * @param properties - the TypeScript properties of a `RouteOverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesRouteOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationScopes", cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("authorizerId", cdk.validateString)(properties.authorizerId));
  errors.collect(cdk.propertyValidator("operationName", cdk.validateString)(properties.operationName));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"RouteOverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesRouteOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesRouteOverridesPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    "AuthorizationType": cdk.stringToCloudFormation(properties.authorizationType),
    "AuthorizerId": cdk.stringToCloudFormation(properties.authorizerId),
    "OperationName": cdk.stringToCloudFormation(properties.operationName),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesRouteOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApiGatewayManagedOverrides.RouteOverridesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverrides.RouteOverridesProperty>();
  ret.addPropertyResult("authorizationScopes", "AuthorizationScopes", (properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizationScopes) : undefined));
  ret.addPropertyResult("authorizationType", "AuthorizationType", (properties.AuthorizationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationType) : undefined));
  ret.addPropertyResult("authorizerId", "AuthorizerId", (properties.AuthorizerId != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerId) : undefined));
  ret.addPropertyResult("operationName", "OperationName", (properties.OperationName != null ? cfn_parse.FromCloudFormation.getString(properties.OperationName) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApiGatewayManagedOverridesProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiGatewayManagedOverridesProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("integration", CfnApiGatewayManagedOverridesIntegrationOverridesPropertyValidator)(properties.integration));
  errors.collect(cdk.propertyValidator("route", CfnApiGatewayManagedOverridesRouteOverridesPropertyValidator)(properties.route));
  errors.collect(cdk.propertyValidator("stage", CfnApiGatewayManagedOverridesStageOverridesPropertyValidator)(properties.stage));
  return errors.wrap("supplied properties not correct for \"CfnApiGatewayManagedOverridesProps\"");
}

// @ts-ignore TS6133
function convertCfnApiGatewayManagedOverridesPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiGatewayManagedOverridesPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Integration": convertCfnApiGatewayManagedOverridesIntegrationOverridesPropertyToCloudFormation(properties.integration),
    "Route": convertCfnApiGatewayManagedOverridesRouteOverridesPropertyToCloudFormation(properties.route),
    "Stage": convertCfnApiGatewayManagedOverridesStageOverridesPropertyToCloudFormation(properties.stage)
  };
}

// @ts-ignore TS6133
function CfnApiGatewayManagedOverridesPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiGatewayManagedOverridesProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiGatewayManagedOverridesProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("integration", "Integration", (properties.Integration != null ? CfnApiGatewayManagedOverridesIntegrationOverridesPropertyFromCloudFormation(properties.Integration) : undefined));
  ret.addPropertyResult("route", "Route", (properties.Route != null ? CfnApiGatewayManagedOverridesRouteOverridesPropertyFromCloudFormation(properties.Route) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? CfnApiGatewayManagedOverridesStageOverridesPropertyFromCloudFormation(properties.Stage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::ApiMapping` resource contains an API mapping.
 *
 * An API mapping relates a path of your custom domain name to a stage of your API. A custom domain name can have multiple API mappings, but the paths can't overlap. A custom domain can map only to APIs of the same protocol type. For more information, see [CreateApiMapping](https://docs.aws.amazon.com/apigatewayv2/latest/api-reference/domainnames-domainname-apimappings.html#CreateApiMapping) in the *Amazon API Gateway V2 API Reference* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::ApiMapping
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 */
export class CfnApiMapping extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::ApiMapping";

  /**
   * Build a CfnApiMapping from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApiMapping {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiMappingPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApiMapping(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The API mapping resource ID.
   *
   * @cloudformationAttribute ApiMappingId
   */
  public readonly attrApiMappingId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * The API mapping key.
   */
  public apiMappingKey?: string;

  /**
   * The domain name.
   */
  public domainName: string;

  /**
   * The API stage.
   */
  public stage: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiMappingProps) {
    super(scope, id, {
      "type": CfnApiMapping.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "domainName", this);
    cdk.requireProperty(props, "stage", this);

    this.attrApiMappingId = cdk.Token.asString(this.getAtt("ApiMappingId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.apiMappingKey = props.apiMappingKey;
    this.domainName = props.domainName;
    this.stage = props.stage;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "apiMappingKey": this.apiMappingKey,
      "domainName": this.domainName,
      "stage": this.stage
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApiMapping.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiMappingPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApiMapping`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 */
export interface CfnApiMappingProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apiid
   */
  readonly apiId: string;

  /**
   * The API mapping key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apimappingkey
   */
  readonly apiMappingKey?: string;

  /**
   * The domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-domainname
   */
  readonly domainName: string;

  /**
   * The API stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-stage
   */
  readonly stage: string;
}

/**
 * Determine whether the given properties match those of a `CfnApiMappingProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiMappingProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiMappingPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiMappingKey", cdk.validateString)(properties.apiMappingKey));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("stage", cdk.requiredValidator)(properties.stage));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  return errors.wrap("supplied properties not correct for \"CfnApiMappingProps\"");
}

// @ts-ignore TS6133
function convertCfnApiMappingPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiMappingPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ApiMappingKey": cdk.stringToCloudFormation(properties.apiMappingKey),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "Stage": cdk.stringToCloudFormation(properties.stage)
  };
}

// @ts-ignore TS6133
function CfnApiMappingPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiMappingProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiMappingProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("apiMappingKey", "ApiMappingKey", (properties.ApiMappingKey != null ? cfn_parse.FromCloudFormation.getString(properties.ApiMappingKey) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Authorizer` resource creates an authorizer for a WebSocket API or an HTTP API.
 *
 * To learn more, see [Controlling and managing access to a WebSocket API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-control-access.html) and [Controlling and managing access to an HTTP API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::Authorizer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 */
export class CfnAuthorizer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Authorizer";

  /**
   * Build a CfnAuthorizer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAuthorizer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAuthorizerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAuthorizer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The authorizer ID.
   *
   * @cloudformationAttribute AuthorizerId
   */
  public readonly attrAuthorizerId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer.
   */
  public authorizerCredentialsArn?: string;

  /**
   * Specifies the format of the payload sent to an HTTP API Lambda authorizer.
   */
  public authorizerPayloadFormatVersion?: string;

  /**
   * The time to live (TTL) for cached authorizer results, in seconds.
   */
  public authorizerResultTtlInSeconds?: number;

  /**
   * The authorizer type.
   */
  public authorizerType: string;

  /**
   * The authorizer's Uniform Resource Identifier (URI).
   */
  public authorizerUri?: string;

  /**
   * Specifies whether a Lambda authorizer returns a response in a simple format.
   */
  public enableSimpleResponses?: boolean | cdk.IResolvable;

  /**
   * The identity source for which authorization is requested.
   */
  public identitySource?: Array<string>;

  /**
   * This parameter is not used.
   */
  public identityValidationExpression?: string;

  /**
   * The `JWTConfiguration` property specifies the configuration of a JWT authorizer.
   */
  public jwtConfiguration?: cdk.IResolvable | CfnAuthorizer.JWTConfigurationProperty;

  /**
   * The name of the authorizer.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAuthorizerProps) {
    super(scope, id, {
      "type": CfnAuthorizer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "authorizerType", this);
    cdk.requireProperty(props, "name", this);

    this.attrAuthorizerId = cdk.Token.asString(this.getAtt("AuthorizerId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.authorizerCredentialsArn = props.authorizerCredentialsArn;
    this.authorizerPayloadFormatVersion = props.authorizerPayloadFormatVersion;
    this.authorizerResultTtlInSeconds = props.authorizerResultTtlInSeconds;
    this.authorizerType = props.authorizerType;
    this.authorizerUri = props.authorizerUri;
    this.enableSimpleResponses = props.enableSimpleResponses;
    this.identitySource = props.identitySource;
    this.identityValidationExpression = props.identityValidationExpression;
    this.jwtConfiguration = props.jwtConfiguration;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "authorizerCredentialsArn": this.authorizerCredentialsArn,
      "authorizerPayloadFormatVersion": this.authorizerPayloadFormatVersion,
      "authorizerResultTtlInSeconds": this.authorizerResultTtlInSeconds,
      "authorizerType": this.authorizerType,
      "authorizerUri": this.authorizerUri,
      "enableSimpleResponses": this.enableSimpleResponses,
      "identitySource": this.identitySource,
      "identityValidationExpression": this.identityValidationExpression,
      "jwtConfiguration": this.jwtConfiguration,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAuthorizer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAuthorizerPropsToCloudFormation(props);
  }
}

export namespace CfnAuthorizer {
  /**
   * The `JWTConfiguration` property specifies the configuration of a JWT authorizer.
   *
   * Required for the `JWT` authorizer type. Supported only for HTTP APIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html
   */
  export interface JWTConfigurationProperty {
    /**
     * A list of the intended recipients of the JWT.
     *
     * A valid JWT must provide an `aud` that matches at least one entry in this list. See [RFC 7519](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc7519#section-4.1.3) . Required for the `JWT` authorizer type. Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-audience
     */
    readonly audience?: Array<string>;

    /**
     * The base domain of the identity provider that issues JSON Web Tokens.
     *
     * For example, an Amazon Cognito user pool has the following format: `https://cognito-idp. {region} .amazonaws.com/ {userPoolId}` . Required for the `JWT` authorizer type. Supported only for HTTP APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-issuer
     */
    readonly issuer?: string;
  }
}

/**
 * Properties for defining a `CfnAuthorizer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 */
export interface CfnAuthorizerProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-apiid
   */
  readonly apiId: string;

  /**
   * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer.
   *
   * To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To use resource-based permissions on the Lambda function, specify null. Supported only for `REQUEST` authorizers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizercredentialsarn
   */
  readonly authorizerCredentialsArn?: string;

  /**
   * Specifies the format of the payload sent to an HTTP API Lambda authorizer.
   *
   * Required for HTTP API Lambda authorizers. Supported values are `1.0` and `2.0` . To learn more, see [Working with AWS Lambda authorizers for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerpayloadformatversion
   */
  readonly authorizerPayloadFormatVersion?: string;

  /**
   * The time to live (TTL) for cached authorizer results, in seconds.
   *
   * If it equals 0, authorization caching is disabled. If it is greater than 0, API Gateway caches authorizer responses. The maximum value is 3600, or 1 hour. Supported only for HTTP API Lambda authorizers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerresultttlinseconds
   */
  readonly authorizerResultTtlInSeconds?: number;

  /**
   * The authorizer type.
   *
   * Specify `REQUEST` for a Lambda function using incoming request parameters. Specify `JWT` to use JSON Web Tokens (supported only for HTTP APIs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizertype
   */
  readonly authorizerType: string;

  /**
   * The authorizer's Uniform Resource Identifier (URI).
   *
   * For `REQUEST` authorizers, this must be a well-formed Lambda function URI, for example, `arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2: *{account_id}* :function: *{lambda_function_name}* /invocations` . In general, the URI has this form: `arn:aws:apigateway: *{region}* :lambda:path/ *{service_api}*` , where *{region}* is the same as the region hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource, including the initial `/` . For Lambda functions, this is usually of the form `/2015-03-31/functions/[FunctionARN]/invocations` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizeruri
   */
  readonly authorizerUri?: string;

  /**
   * Specifies whether a Lambda authorizer returns a response in a simple format.
   *
   * By default, a Lambda authorizer must return an IAM policy. If enabled, the Lambda authorizer can return a boolean value instead of an IAM policy. Supported only for HTTP APIs. To learn more, see [Working with AWS Lambda authorizers for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-enablesimpleresponses
   */
  readonly enableSimpleResponses?: boolean | cdk.IResolvable;

  /**
   * The identity source for which authorization is requested.
   *
   * For a `REQUEST` authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters. The identity source can be headers, query string parameters, stage variables, and context parameters. For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is route.request.header.Auth, route.request.querystring.Name for WebSocket APIs. For HTTP APIs, use selection expressions prefixed with `$` , for example, `$request.header.Auth` , `$request.querystring.Name` . These parameters are used to perform runtime validation for Lambda-based authorizers by verifying all of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function. For HTTP APIs, identity sources are also used as the cache key when caching is enabled. To learn more, see [Working with AWS Lambda authorizers for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html) .
   *
   * For `JWT` , a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query parameter-based selections are supported, for example `$request.header.Authorization` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identitysource
   */
  readonly identitySource?: Array<string>;

  /**
   * This parameter is not used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identityvalidationexpression
   */
  readonly identityValidationExpression?: string;

  /**
   * The `JWTConfiguration` property specifies the configuration of a JWT authorizer.
   *
   * Required for the `JWT` authorizer type. Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-jwtconfiguration
   */
  readonly jwtConfiguration?: cdk.IResolvable | CfnAuthorizer.JWTConfigurationProperty;

  /**
   * The name of the authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `JWTConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `JWTConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAuthorizerJWTConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audience", cdk.listValidator(cdk.validateString))(properties.audience));
  errors.collect(cdk.propertyValidator("issuer", cdk.validateString)(properties.issuer));
  return errors.wrap("supplied properties not correct for \"JWTConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAuthorizerJWTConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAuthorizerJWTConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Audience": cdk.listMapper(cdk.stringToCloudFormation)(properties.audience),
    "Issuer": cdk.stringToCloudFormation(properties.issuer)
  };
}

// @ts-ignore TS6133
function CfnAuthorizerJWTConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAuthorizer.JWTConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAuthorizer.JWTConfigurationProperty>();
  ret.addPropertyResult("audience", "Audience", (properties.Audience != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Audience) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAuthorizerProps`
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAuthorizerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("authorizerCredentialsArn", cdk.validateString)(properties.authorizerCredentialsArn));
  errors.collect(cdk.propertyValidator("authorizerPayloadFormatVersion", cdk.validateString)(properties.authorizerPayloadFormatVersion));
  errors.collect(cdk.propertyValidator("authorizerResultTtlInSeconds", cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
  errors.collect(cdk.propertyValidator("authorizerType", cdk.requiredValidator)(properties.authorizerType));
  errors.collect(cdk.propertyValidator("authorizerType", cdk.validateString)(properties.authorizerType));
  errors.collect(cdk.propertyValidator("authorizerUri", cdk.validateString)(properties.authorizerUri));
  errors.collect(cdk.propertyValidator("enableSimpleResponses", cdk.validateBoolean)(properties.enableSimpleResponses));
  errors.collect(cdk.propertyValidator("identitySource", cdk.listValidator(cdk.validateString))(properties.identitySource));
  errors.collect(cdk.propertyValidator("identityValidationExpression", cdk.validateString)(properties.identityValidationExpression));
  errors.collect(cdk.propertyValidator("jwtConfiguration", CfnAuthorizerJWTConfigurationPropertyValidator)(properties.jwtConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnAuthorizerProps\"");
}

// @ts-ignore TS6133
function convertCfnAuthorizerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAuthorizerPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "AuthorizerCredentialsArn": cdk.stringToCloudFormation(properties.authorizerCredentialsArn),
    "AuthorizerPayloadFormatVersion": cdk.stringToCloudFormation(properties.authorizerPayloadFormatVersion),
    "AuthorizerResultTtlInSeconds": cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
    "AuthorizerType": cdk.stringToCloudFormation(properties.authorizerType),
    "AuthorizerUri": cdk.stringToCloudFormation(properties.authorizerUri),
    "EnableSimpleResponses": cdk.booleanToCloudFormation(properties.enableSimpleResponses),
    "IdentitySource": cdk.listMapper(cdk.stringToCloudFormation)(properties.identitySource),
    "IdentityValidationExpression": cdk.stringToCloudFormation(properties.identityValidationExpression),
    "JwtConfiguration": convertCfnAuthorizerJWTConfigurationPropertyToCloudFormation(properties.jwtConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnAuthorizerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAuthorizerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAuthorizerProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("authorizerCredentialsArn", "AuthorizerCredentialsArn", (properties.AuthorizerCredentialsArn != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerCredentialsArn) : undefined));
  ret.addPropertyResult("authorizerPayloadFormatVersion", "AuthorizerPayloadFormatVersion", (properties.AuthorizerPayloadFormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerPayloadFormatVersion) : undefined));
  ret.addPropertyResult("authorizerResultTtlInSeconds", "AuthorizerResultTtlInSeconds", (properties.AuthorizerResultTtlInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AuthorizerResultTtlInSeconds) : undefined));
  ret.addPropertyResult("authorizerType", "AuthorizerType", (properties.AuthorizerType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerType) : undefined));
  ret.addPropertyResult("authorizerUri", "AuthorizerUri", (properties.AuthorizerUri != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerUri) : undefined));
  ret.addPropertyResult("enableSimpleResponses", "EnableSimpleResponses", (properties.EnableSimpleResponses != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSimpleResponses) : undefined));
  ret.addPropertyResult("identitySource", "IdentitySource", (properties.IdentitySource != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IdentitySource) : undefined));
  ret.addPropertyResult("identityValidationExpression", "IdentityValidationExpression", (properties.IdentityValidationExpression != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityValidationExpression) : undefined));
  ret.addPropertyResult("jwtConfiguration", "JwtConfiguration", (properties.JwtConfiguration != null ? CfnAuthorizerJWTConfigurationPropertyFromCloudFormation(properties.JwtConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Deployment` resource creates a deployment for an API.
 *
 * @cloudformationResource AWS::ApiGatewayV2::Deployment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 */
export class CfnDeployment extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Deployment";

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
   * The deployment ID.
   *
   * @cloudformationAttribute DeploymentId
   */
  public readonly attrDeploymentId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * The description for the deployment resource.
   */
  public description?: string;

  /**
   * The name of an existing stage to associate with the deployment.
   */
  public stageName?: string;

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

    cdk.requireProperty(props, "apiId", this);

    this.attrDeploymentId = cdk.Token.asString(this.getAtt("DeploymentId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.description = props.description;
    this.stageName = props.stageName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "description": this.description,
      "stageName": this.stageName
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 */
export interface CfnDeploymentProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-apiid
   */
  readonly apiId: string;

  /**
   * The description for the deployment resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-description
   */
  readonly description?: string;

  /**
   * The name of an existing stage to associate with the deployment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-stagename
   */
  readonly stageName?: string;
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
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  return errors.wrap("supplied properties not correct for \"CfnDeploymentProps\"");
}

// @ts-ignore TS6133
function convertCfnDeploymentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeploymentPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "StageName": cdk.stringToCloudFormation(properties.stageName)
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
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::DomainName` resource specifies a custom domain name for your API in Amazon API Gateway (API Gateway).
 *
 * You can use a custom domain name to provide a URL that's more intuitive and easier to recall. For more information about using custom domain names, see [Set up Custom Domain Name for an API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::DomainName
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 */
export class CfnDomainName extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::DomainName";

  /**
   * Build a CfnDomainName from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomainName {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainNamePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomainName(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The domain name associated with the regional endpoint for this custom domain name. You set up this association by adding a DNS record that points the custom domain name to this regional domain name.
   *
   * @cloudformationAttribute RegionalDomainName
   */
  public readonly attrRegionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   *
   * @cloudformationAttribute RegionalHostedZoneId
   */
  public readonly attrRegionalHostedZoneId: string;

  /**
   * The custom domain name for your API in Amazon API Gateway.
   */
  public domainName: string;

  /**
   * The domain name configurations.
   */
  public domainNameConfigurations?: Array<CfnDomainName.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The mutual TLS authentication configuration for a custom domain name.
   */
  public mutualTlsAuthentication?: cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags associated with a domain name.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainNameProps) {
    super(scope, id, {
      "type": CfnDomainName.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.attrRegionalDomainName = cdk.Token.asString(this.getAtt("RegionalDomainName", cdk.ResolutionTypeHint.STRING));
    this.attrRegionalHostedZoneId = cdk.Token.asString(this.getAtt("RegionalHostedZoneId", cdk.ResolutionTypeHint.STRING));
    this.domainName = props.domainName;
    this.domainNameConfigurations = props.domainNameConfigurations;
    this.mutualTlsAuthentication = props.mutualTlsAuthentication;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ApiGatewayV2::DomainName", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domainName": this.domainName,
      "domainNameConfigurations": this.domainNameConfigurations,
      "mutualTlsAuthentication": this.mutualTlsAuthentication,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomainName.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainNamePropsToCloudFormation(props);
  }
}

export namespace CfnDomainName {
  /**
   * If specified, API Gateway performs two-way authentication between the client and the server.
   *
   * Clients must present a trusted certificate to access your API.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html
   */
  export interface MutualTlsAuthenticationProperty {
    /**
     * An Amazon S3 URL that specifies the truststore for mutual TLS authentication, for example, `s3:// bucket-name / key-name` .
     *
     * The truststore can contain certificates from public or private certificate authorities. To update the truststore, upload a new version to S3, and then update your custom domain name to use the new version. To update the truststore, you must have permissions to access the S3 object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreuri
     */
    readonly truststoreUri?: string;

    /**
     * The version of the S3 object that contains your truststore.
     *
     * To specify a version, you must have versioning enabled for the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreversion
     */
    readonly truststoreVersion?: string;
  }

  /**
   * The `DomainNameConfiguration` property type specifies the configuration for an API's domain name.
   *
   * `DomainNameConfiguration` is a property of the [AWS::ApiGatewayV2::DomainName](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html) resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html
   */
  export interface DomainNameConfigurationProperty {
    /**
     * An AWS -managed certificate that will be used by the edge-optimized endpoint for this domain name.
     *
     * AWS Certificate Manager is the only supported source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatearn
     */
    readonly certificateArn?: string;

    /**
     * The user-friendly name of the certificate that will be used by the edge-optimized endpoint for this domain name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatename
     */
    readonly certificateName?: string;

    /**
     * The endpoint type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-endpointtype
     */
    readonly endpointType?: string;

    /**
     * The Amazon resource name (ARN) for the public certificate issued by AWS Certificate Manager .
     *
     * This ARN is used to validate custom domain ownership. It's required only if you configure mutual TLS and use either an ACM-imported or a private CA certificate ARN as the regionalCertificateArn.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-ownershipverificationcertificatearn
     */
    readonly ownershipVerificationCertificateArn?: string;

    /**
     * The Transport Layer Security (TLS) version of the security policy for this domain name.
     *
     * The valid values are `TLS_1_0` and `TLS_1_2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-securitypolicy
     */
    readonly securityPolicy?: string;
  }
}

/**
 * Properties for defining a `CfnDomainName`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 */
export interface CfnDomainNameProps {
  /**
   * The custom domain name for your API in Amazon API Gateway.
   *
   * Uppercase letters are not supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainname
   */
  readonly domainName: string;

  /**
   * The domain name configurations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
   */
  readonly domainNameConfigurations?: Array<CfnDomainName.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The mutual TLS authentication configuration for a custom domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-mutualtlsauthentication
   */
  readonly mutualTlsAuthentication?: cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty;

  /**
   * The collection of tags associated with a domain name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNameMutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("truststoreUri", cdk.validateString)(properties.truststoreUri));
  errors.collect(cdk.propertyValidator("truststoreVersion", cdk.validateString)(properties.truststoreVersion));
  return errors.wrap("supplied properties not correct for \"MutualTlsAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainNameMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNameMutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "TruststoreUri": cdk.stringToCloudFormation(properties.truststoreUri),
    "TruststoreVersion": cdk.stringToCloudFormation(properties.truststoreVersion)
  };
}

// @ts-ignore TS6133
function CfnDomainNameMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomainName.MutualTlsAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainName.MutualTlsAuthenticationProperty>();
  ret.addPropertyResult("truststoreUri", "TruststoreUri", (properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined));
  ret.addPropertyResult("truststoreVersion", "TruststoreVersion", (properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainNameConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DomainNameConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNameDomainNameConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateName", cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator("endpointType", cdk.validateString)(properties.endpointType));
  errors.collect(cdk.propertyValidator("ownershipVerificationCertificateArn", cdk.validateString)(properties.ownershipVerificationCertificateArn));
  errors.collect(cdk.propertyValidator("securityPolicy", cdk.validateString)(properties.securityPolicy));
  return errors.wrap("supplied properties not correct for \"DomainNameConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainNameDomainNameConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNameDomainNameConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "CertificateName": cdk.stringToCloudFormation(properties.certificateName),
    "EndpointType": cdk.stringToCloudFormation(properties.endpointType),
    "OwnershipVerificationCertificateArn": cdk.stringToCloudFormation(properties.ownershipVerificationCertificateArn),
    "SecurityPolicy": cdk.stringToCloudFormation(properties.securityPolicy)
  };
}

// @ts-ignore TS6133
function CfnDomainNameDomainNameConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainName.DomainNameConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainName.DomainNameConfigurationProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("certificateName", "CertificateName", (properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined));
  ret.addPropertyResult("endpointType", "EndpointType", (properties.EndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointType) : undefined));
  ret.addPropertyResult("ownershipVerificationCertificateArn", "OwnershipVerificationCertificateArn", (properties.OwnershipVerificationCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.OwnershipVerificationCertificateArn) : undefined));
  ret.addPropertyResult("securityPolicy", "SecurityPolicy", (properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainNameProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNamePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainNameConfigurations", cdk.listValidator(CfnDomainNameDomainNameConfigurationPropertyValidator))(properties.domainNameConfigurations));
  errors.collect(cdk.propertyValidator("mutualTlsAuthentication", CfnDomainNameMutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDomainNameProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainNamePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNamePropsValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "DomainNameConfigurations": cdk.listMapper(convertCfnDomainNameDomainNameConfigurationPropertyToCloudFormation)(properties.domainNameConfigurations),
    "MutualTlsAuthentication": convertCfnDomainNameMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDomainNamePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainNameProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainNameProps>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("domainNameConfigurations", "DomainNameConfigurations", (properties.DomainNameConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDomainNameDomainNameConfigurationPropertyFromCloudFormation)(properties.DomainNameConfigurations) : undefined));
  ret.addPropertyResult("mutualTlsAuthentication", "MutualTlsAuthentication", (properties.MutualTlsAuthentication != null ? CfnDomainNameMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Integration` resource creates an integration for an API.
 *
 * @cloudformationResource AWS::ApiGatewayV2::Integration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 */
export class CfnIntegration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Integration";

  /**
   * Build a CfnIntegration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIntegration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIntegrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIntegration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * The ID of the VPC link for a private integration.
   */
  public connectionId?: string;

  /**
   * The type of the network connection to the integration endpoint.
   */
  public connectionType?: string;

  /**
   * Supported only for WebSocket APIs.
   */
  public contentHandlingStrategy?: string;

  /**
   * Specifies the credentials required for the integration, if any.
   */
  public credentialsArn?: string;

  /**
   * The description of the integration.
   */
  public description?: string;

  /**
   * Specifies the integration's HTTP method type.
   */
  public integrationMethod?: string;

  /**
   * Supported only for HTTP API `AWS_PROXY` integrations.
   */
  public integrationSubtype?: string;

  /**
   * The integration type of an integration. One of the following:.
   */
  public integrationType: string;

  /**
   * For a Lambda integration, specify the URI of a Lambda function.
   */
  public integrationUri?: string;

  /**
   * Specifies the pass-through behavior for incoming requests based on the `Content-Type` header in the request, and the available mapping templates specified as the `requestTemplates` property on the `Integration` resource.
   */
  public passthroughBehavior?: string;

  /**
   * Specifies the format of the payload sent to an integration.
   */
  public payloadFormatVersion?: string;

  /**
   * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend.
   */
  public requestParameters?: any | cdk.IResolvable;

  /**
   * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client.
   */
  public requestTemplates?: any | cdk.IResolvable;

  /**
   * Supported only for HTTP APIs.
   */
  public responseParameters?: any | cdk.IResolvable;

  /**
   * The template selection expression for the integration.
   */
  public templateSelectionExpression?: string;

  /**
   * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs.
   */
  public timeoutInMillis?: number;

  /**
   * The TLS configuration for a private integration.
   */
  public tlsConfig?: cdk.IResolvable | CfnIntegration.TlsConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIntegrationProps) {
    super(scope, id, {
      "type": CfnIntegration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "integrationType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.connectionId = props.connectionId;
    this.connectionType = props.connectionType;
    this.contentHandlingStrategy = props.contentHandlingStrategy;
    this.credentialsArn = props.credentialsArn;
    this.description = props.description;
    this.integrationMethod = props.integrationMethod;
    this.integrationSubtype = props.integrationSubtype;
    this.integrationType = props.integrationType;
    this.integrationUri = props.integrationUri;
    this.passthroughBehavior = props.passthroughBehavior;
    this.payloadFormatVersion = props.payloadFormatVersion;
    this.requestParameters = props.requestParameters;
    this.requestTemplates = props.requestTemplates;
    this.responseParameters = props.responseParameters;
    this.templateSelectionExpression = props.templateSelectionExpression;
    this.timeoutInMillis = props.timeoutInMillis;
    this.tlsConfig = props.tlsConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "connectionId": this.connectionId,
      "connectionType": this.connectionType,
      "contentHandlingStrategy": this.contentHandlingStrategy,
      "credentialsArn": this.credentialsArn,
      "description": this.description,
      "integrationMethod": this.integrationMethod,
      "integrationSubtype": this.integrationSubtype,
      "integrationType": this.integrationType,
      "integrationUri": this.integrationUri,
      "passthroughBehavior": this.passthroughBehavior,
      "payloadFormatVersion": this.payloadFormatVersion,
      "requestParameters": this.requestParameters,
      "requestTemplates": this.requestTemplates,
      "responseParameters": this.responseParameters,
      "templateSelectionExpression": this.templateSelectionExpression,
      "timeoutInMillis": this.timeoutInMillis,
      "tlsConfig": this.tlsConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIntegration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIntegrationPropsToCloudFormation(props);
  }
}

export namespace CfnIntegration {
  /**
   * The `TlsConfig` property specifies the TLS configuration for a private integration.
   *
   * If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-tlsconfig.html
   */
  export interface TlsConfigProperty {
    /**
     * If you specify a server name, API Gateway uses it to verify the hostname on the integration's certificate.
     *
     * The server name is also included in the TLS handshake to support Server Name Indication (SNI) or virtual hosting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-tlsconfig.html#cfn-apigatewayv2-integration-tlsconfig-servernametoverify
     */
    readonly serverNameToVerify?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameter.html
   */
  export interface ResponseParameterProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameter.html#cfn-apigatewayv2-integration-responseparameter-destination
     */
    readonly destination: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameter.html#cfn-apigatewayv2-integration-responseparameter-source
     */
    readonly source: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameterlist.html
   */
  export interface ResponseParameterListProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameterlist.html#cfn-apigatewayv2-integration-responseparameterlist-responseparameters
     */
    readonly responseParameters?: Array<cdk.IResolvable | CfnIntegration.ResponseParameterProperty> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnIntegration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 */
export interface CfnIntegrationProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  readonly apiId: string;

  /**
   * The ID of the VPC link for a private integration.
   *
   * Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectionid
   */
  readonly connectionId?: string;

  /**
   * The type of the network connection to the integration endpoint.
   *
   * Specify `INTERNET` for connections through the public routable internet or `VPC_LINK` for private connections between API Gateway and resources in a VPC. The default value is `INTERNET` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectiontype
   */
  readonly connectionType?: string;

  /**
   * Supported only for WebSocket APIs.
   *
   * Specifies how to handle response payload content type conversions. Supported values are `CONVERT_TO_BINARY` and `CONVERT_TO_TEXT` , with the following behaviors:
   *
   * `CONVERT_TO_BINARY` : Converts a response payload from a Base64-encoded string to the corresponding binary blob.
   *
   * `CONVERT_TO_TEXT` : Converts a response payload from a binary blob to a Base64-encoded string.
   *
   * If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-contenthandlingstrategy
   */
  readonly contentHandlingStrategy?: string;

  /**
   * Specifies the credentials required for the integration, if any.
   *
   * For AWS integrations, three options are available. To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN). To require that the caller's identity be passed through from the request, specify the string `arn:aws:iam::*:user/*` . To use resource-based permissions on supported AWS services, don't specify this parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-credentialsarn
   */
  readonly credentialsArn?: string;

  /**
   * The description of the integration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-description
   */
  readonly description?: string;

  /**
   * Specifies the integration's HTTP method type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationmethod
   */
  readonly integrationMethod?: string;

  /**
   * Supported only for HTTP API `AWS_PROXY` integrations.
   *
   * Specifies the AWS service action to invoke. To learn more, see [Integration subtype reference](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationsubtype
   */
  readonly integrationSubtype?: string;

  /**
   * The integration type of an integration. One of the following:.
   *
   * `AWS` : for integrating the route or method request with an AWS service action, including the Lambda function-invoking action. With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service action, this is known as AWS integration. Supported only for WebSocket APIs.
   *
   * `AWS_PROXY` : for integrating the route or method request with a Lambda function or other AWS service action. This integration is also referred to as a Lambda proxy integration.
   *
   * `HTTP` : for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration. Supported only for WebSocket APIs.
   *
   * `HTTP_PROXY` : for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is. This is also referred to as HTTP proxy integration. For HTTP API private integrations, use an `HTTP_PROXY` integration.
   *
   * `MOCK` : for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend. Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationtype
   */
  readonly integrationType: string;

  /**
   * For a Lambda integration, specify the URI of a Lambda function.
   *
   * For an HTTP integration, specify a fully-qualified URL.
   *
   * For an HTTP API private integration, specify the ARN of an Application Load Balancer listener, Network Load Balancer listener, or AWS Cloud Map service. If you specify the ARN of an AWS Cloud Map service, API Gateway uses `DiscoverInstances` to identify resources. You can use query parameters to target specific resources. To learn more, see [DiscoverInstances](https://docs.aws.amazon.com/cloud-map/latest/api/API_DiscoverInstances.html) . For private integrations, all resources must be owned by the same AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationuri
   */
  readonly integrationUri?: string;

  /**
   * Specifies the pass-through behavior for incoming requests based on the `Content-Type` header in the request, and the available mapping templates specified as the `requestTemplates` property on the `Integration` resource.
   *
   * There are three valid values: `WHEN_NO_MATCH` , `WHEN_NO_TEMPLATES` , and `NEVER` . Supported only for WebSocket APIs.
   *
   * `WHEN_NO_MATCH` passes the request body for unmapped content types through to the integration backend without transformation.
   *
   * `NEVER` rejects unmapped content types with an `HTTP 415 Unsupported Media Type` response.
   *
   * `WHEN_NO_TEMPLATES` allows pass-through when the integration has no content types mapped to templates. However, if there is at least one content type defined, unmapped content types will be rejected with the same `HTTP 415 Unsupported Media Type` response.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-passthroughbehavior
   */
  readonly passthroughBehavior?: string;

  /**
   * Specifies the format of the payload sent to an integration.
   *
   * Required for HTTP APIs. For HTTP APIs, supported values for Lambda proxy integrations are `1.0` and `2.0` . For all other integrations, `1.0` is the only supported value. To learn more, see [Working with AWS Lambda proxy integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-payloadformatversion
   */
  readonly payloadFormatVersion?: string;

  /**
   * For WebSocket APIs, a key-value map specifying request parameters that are passed from the method request to the backend.
   *
   * The key is an integration request parameter name and the associated value is a method request parameter value or static value that must be enclosed within single quotes and pre-encoded as required by the backend. The method request parameter value must match the pattern of `method.request. {location} . {name}` , where `{location}` is `querystring` , `path` , or `header` ; and `{name}` must be a valid and unique method request parameter name.
   *
   * For HTTP API integrations with a specified `integrationSubtype` , request parameters are a key-value map specifying parameters that are passed to `AWS_PROXY` integrations. You can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see [Working with AWS service integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services.html) .
   *
   * For HTTP API integrations without a specified `integrationSubtype` request parameters are a key-value map specifying how to transform HTTP requests before sending them to the backend. The key should follow the pattern <action>:<header|querystring|path>.<location> where action can be `append` , `overwrite` or `remove` . For values, you can provide static values, or map request data, stage variables, or context variables that are evaluated at runtime. To learn more, see [Transforming API requests and responses](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requestparameters
   */
  readonly requestParameters?: any | cdk.IResolvable;

  /**
   * Represents a map of Velocity templates that are applied on the request payload based on the value of the Content-Type header sent by the client.
   *
   * The content type value is the key in this map, and the template (as a String) is the value. Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
   */
  readonly requestTemplates?: any | cdk.IResolvable;

  /**
   * Supported only for HTTP APIs.
   *
   * You use response parameters to transform the HTTP response from a backend integration before returning the response to clients. Specify a key-value map from a selection key to response parameters. The selection key must be a valid HTTP status code within the range of 200-599. The value is of type [`ResponseParameterList`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-integration-responseparameterlist.html) . To learn more, see [Transforming API requests and responses](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-responseparameters
   */
  readonly responseParameters?: any | cdk.IResolvable;

  /**
   * The template selection expression for the integration.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-templateselectionexpression
   */
  readonly templateSelectionExpression?: string;

  /**
   * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs.
   *
   * The default timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-timeoutinmillis
   */
  readonly timeoutInMillis?: number;

  /**
   * The TLS configuration for a private integration.
   *
   * If you specify a TLS configuration, private integration traffic uses the HTTPS protocol. Supported only for HTTP APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-tlsconfig
   */
  readonly tlsConfig?: cdk.IResolvable | CfnIntegration.TlsConfigProperty;
}

/**
 * Determine whether the given properties match those of a `TlsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TlsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationTlsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serverNameToVerify", cdk.validateString)(properties.serverNameToVerify));
  return errors.wrap("supplied properties not correct for \"TlsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationTlsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationTlsConfigPropertyValidator(properties).assertSuccess();
  return {
    "ServerNameToVerify": cdk.stringToCloudFormation(properties.serverNameToVerify)
  };
}

// @ts-ignore TS6133
function CfnIntegrationTlsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.TlsConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.TlsConfigProperty>();
  ret.addPropertyResult("serverNameToVerify", "ServerNameToVerify", (properties.ServerNameToVerify != null ? cfn_parse.FromCloudFormation.getString(properties.ServerNameToVerify) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("connectionId", cdk.validateString)(properties.connectionId));
  errors.collect(cdk.propertyValidator("connectionType", cdk.validateString)(properties.connectionType));
  errors.collect(cdk.propertyValidator("contentHandlingStrategy", cdk.validateString)(properties.contentHandlingStrategy));
  errors.collect(cdk.propertyValidator("credentialsArn", cdk.validateString)(properties.credentialsArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("integrationMethod", cdk.validateString)(properties.integrationMethod));
  errors.collect(cdk.propertyValidator("integrationSubtype", cdk.validateString)(properties.integrationSubtype));
  errors.collect(cdk.propertyValidator("integrationType", cdk.requiredValidator)(properties.integrationType));
  errors.collect(cdk.propertyValidator("integrationType", cdk.validateString)(properties.integrationType));
  errors.collect(cdk.propertyValidator("integrationUri", cdk.validateString)(properties.integrationUri));
  errors.collect(cdk.propertyValidator("passthroughBehavior", cdk.validateString)(properties.passthroughBehavior));
  errors.collect(cdk.propertyValidator("payloadFormatVersion", cdk.validateString)(properties.payloadFormatVersion));
  errors.collect(cdk.propertyValidator("requestParameters", cdk.validateObject)(properties.requestParameters));
  errors.collect(cdk.propertyValidator("requestTemplates", cdk.validateObject)(properties.requestTemplates));
  errors.collect(cdk.propertyValidator("responseParameters", cdk.validateObject)(properties.responseParameters));
  errors.collect(cdk.propertyValidator("templateSelectionExpression", cdk.validateString)(properties.templateSelectionExpression));
  errors.collect(cdk.propertyValidator("timeoutInMillis", cdk.validateNumber)(properties.timeoutInMillis));
  errors.collect(cdk.propertyValidator("tlsConfig", CfnIntegrationTlsConfigPropertyValidator)(properties.tlsConfig));
  return errors.wrap("supplied properties not correct for \"CfnIntegrationProps\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ConnectionId": cdk.stringToCloudFormation(properties.connectionId),
    "ConnectionType": cdk.stringToCloudFormation(properties.connectionType),
    "ContentHandlingStrategy": cdk.stringToCloudFormation(properties.contentHandlingStrategy),
    "CredentialsArn": cdk.stringToCloudFormation(properties.credentialsArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IntegrationMethod": cdk.stringToCloudFormation(properties.integrationMethod),
    "IntegrationSubtype": cdk.stringToCloudFormation(properties.integrationSubtype),
    "IntegrationType": cdk.stringToCloudFormation(properties.integrationType),
    "IntegrationUri": cdk.stringToCloudFormation(properties.integrationUri),
    "PassthroughBehavior": cdk.stringToCloudFormation(properties.passthroughBehavior),
    "PayloadFormatVersion": cdk.stringToCloudFormation(properties.payloadFormatVersion),
    "RequestParameters": cdk.objectToCloudFormation(properties.requestParameters),
    "RequestTemplates": cdk.objectToCloudFormation(properties.requestTemplates),
    "ResponseParameters": cdk.objectToCloudFormation(properties.responseParameters),
    "TemplateSelectionExpression": cdk.stringToCloudFormation(properties.templateSelectionExpression),
    "TimeoutInMillis": cdk.numberToCloudFormation(properties.timeoutInMillis),
    "TlsConfig": convertCfnIntegrationTlsConfigPropertyToCloudFormation(properties.tlsConfig)
  };
}

// @ts-ignore TS6133
function CfnIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegrationProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("connectionId", "ConnectionId", (properties.ConnectionId != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionId) : undefined));
  ret.addPropertyResult("connectionType", "ConnectionType", (properties.ConnectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionType) : undefined));
  ret.addPropertyResult("contentHandlingStrategy", "ContentHandlingStrategy", (properties.ContentHandlingStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.ContentHandlingStrategy) : undefined));
  ret.addPropertyResult("credentialsArn", "CredentialsArn", (properties.CredentialsArn != null ? cfn_parse.FromCloudFormation.getString(properties.CredentialsArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("integrationMethod", "IntegrationMethod", (properties.IntegrationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationMethod) : undefined));
  ret.addPropertyResult("integrationSubtype", "IntegrationSubtype", (properties.IntegrationSubtype != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationSubtype) : undefined));
  ret.addPropertyResult("integrationType", "IntegrationType", (properties.IntegrationType != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationType) : undefined));
  ret.addPropertyResult("integrationUri", "IntegrationUri", (properties.IntegrationUri != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationUri) : undefined));
  ret.addPropertyResult("passthroughBehavior", "PassthroughBehavior", (properties.PassthroughBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.PassthroughBehavior) : undefined));
  ret.addPropertyResult("payloadFormatVersion", "PayloadFormatVersion", (properties.PayloadFormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadFormatVersion) : undefined));
  ret.addPropertyResult("requestParameters", "RequestParameters", (properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.RequestParameters) : undefined));
  ret.addPropertyResult("requestTemplates", "RequestTemplates", (properties.RequestTemplates != null ? cfn_parse.FromCloudFormation.getAny(properties.RequestTemplates) : undefined));
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("templateSelectionExpression", "TemplateSelectionExpression", (properties.TemplateSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateSelectionExpression) : undefined));
  ret.addPropertyResult("timeoutInMillis", "TimeoutInMillis", (properties.TimeoutInMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMillis) : undefined));
  ret.addPropertyResult("tlsConfig", "TlsConfig", (properties.TlsConfig != null ? CfnIntegrationTlsConfigPropertyFromCloudFormation(properties.TlsConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationResponseParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  return errors.wrap("supplied properties not correct for \"ResponseParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationResponseParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationResponseParameterPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "Source": cdk.stringToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnIntegrationResponseParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ResponseParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ResponseParameterProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseParameterListProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseParameterListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationResponseParameterListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("responseParameters", cdk.listValidator(CfnIntegrationResponseParameterPropertyValidator))(properties.responseParameters));
  return errors.wrap("supplied properties not correct for \"ResponseParameterListProperty\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationResponseParameterListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationResponseParameterListPropertyValidator(properties).assertSuccess();
  return {
    "ResponseParameters": cdk.listMapper(convertCfnIntegrationResponseParameterPropertyToCloudFormation)(properties.responseParameters)
  };
}

// @ts-ignore TS6133
function CfnIntegrationResponseParameterListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIntegration.ResponseParameterListProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegration.ResponseParameterListProperty>();
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnIntegrationResponseParameterPropertyFromCloudFormation)(properties.ResponseParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::IntegrationResponse` resource updates an integration response for an WebSocket API.
 *
 * For more information, see [Set up WebSocket API Integration Responses in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::IntegrationResponse
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 */
export class CfnIntegrationResponse extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::IntegrationResponse";

  /**
   * Build a CfnIntegrationResponse from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIntegrationResponse {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIntegrationResponsePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIntegrationResponse(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The integration response ID.
   *
   * @cloudformationAttribute IntegrationResponseId
   */
  public readonly attrIntegrationResponseId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * Supported only for WebSocket APIs.
   */
  public contentHandlingStrategy?: string;

  /**
   * The integration ID.
   */
  public integrationId: string;

  /**
   * The integration response key.
   */
  public integrationResponseKey: string;

  /**
   * A key-value map specifying response parameters that are passed to the method response from the backend.
   */
  public responseParameters?: any | cdk.IResolvable;

  /**
   * The collection of response templates for the integration response as a string-to-string map of key-value pairs.
   */
  public responseTemplates?: any | cdk.IResolvable;

  /**
   * The template selection expression for the integration response.
   */
  public templateSelectionExpression?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIntegrationResponseProps) {
    super(scope, id, {
      "type": CfnIntegrationResponse.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "integrationId", this);
    cdk.requireProperty(props, "integrationResponseKey", this);

    this.attrIntegrationResponseId = cdk.Token.asString(this.getAtt("IntegrationResponseId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.contentHandlingStrategy = props.contentHandlingStrategy;
    this.integrationId = props.integrationId;
    this.integrationResponseKey = props.integrationResponseKey;
    this.responseParameters = props.responseParameters;
    this.responseTemplates = props.responseTemplates;
    this.templateSelectionExpression = props.templateSelectionExpression;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "contentHandlingStrategy": this.contentHandlingStrategy,
      "integrationId": this.integrationId,
      "integrationResponseKey": this.integrationResponseKey,
      "responseParameters": this.responseParameters,
      "responseTemplates": this.responseTemplates,
      "templateSelectionExpression": this.templateSelectionExpression
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIntegrationResponse.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIntegrationResponsePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIntegrationResponse`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 */
export interface CfnIntegrationResponseProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-apiid
   */
  readonly apiId: string;

  /**
   * Supported only for WebSocket APIs.
   *
   * Specifies how to handle response payload content type conversions. Supported values are `CONVERT_TO_BINARY` and `CONVERT_TO_TEXT` , with the following behaviors:
   *
   * `CONVERT_TO_BINARY` : Converts a response payload from a Base64-encoded string to the corresponding binary blob.
   *
   * `CONVERT_TO_TEXT` : Converts a response payload from a binary blob to a Base64-encoded string.
   *
   * If this property is not defined, the response payload will be passed through from the integration response to the route response or method response without modification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-contenthandlingstrategy
   */
  readonly contentHandlingStrategy?: string;

  /**
   * The integration ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationid
   */
  readonly integrationId: string;

  /**
   * The integration response key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationresponsekey
   */
  readonly integrationResponseKey: string;

  /**
   * A key-value map specifying response parameters that are passed to the method response from the backend.
   *
   * The key is a method response header parameter name and the mapped value is an integration response header value, a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body. The mapping key must match the pattern of `method.response.header. *{name}*` , where name is a valid and unique header name. The mapped non-static value must match the pattern of `integration.response.header. *{name}*` or `integration.response.body. *{JSON-expression}*` , where `*{name}*` is a valid and unique response header name and `*{JSON-expression}*` is a valid JSON expression without the `$` prefix.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responseparameters
   */
  readonly responseParameters?: any | cdk.IResolvable;

  /**
   * The collection of response templates for the integration response as a string-to-string map of key-value pairs.
   *
   * Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responsetemplates
   */
  readonly responseTemplates?: any | cdk.IResolvable;

  /**
   * The template selection expression for the integration response.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-templateselectionexpression
   */
  readonly templateSelectionExpression?: string;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationResponseProps`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationResponseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationResponsePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("contentHandlingStrategy", cdk.validateString)(properties.contentHandlingStrategy));
  errors.collect(cdk.propertyValidator("integrationId", cdk.requiredValidator)(properties.integrationId));
  errors.collect(cdk.propertyValidator("integrationId", cdk.validateString)(properties.integrationId));
  errors.collect(cdk.propertyValidator("integrationResponseKey", cdk.requiredValidator)(properties.integrationResponseKey));
  errors.collect(cdk.propertyValidator("integrationResponseKey", cdk.validateString)(properties.integrationResponseKey));
  errors.collect(cdk.propertyValidator("responseParameters", cdk.validateObject)(properties.responseParameters));
  errors.collect(cdk.propertyValidator("responseTemplates", cdk.validateObject)(properties.responseTemplates));
  errors.collect(cdk.propertyValidator("templateSelectionExpression", cdk.validateString)(properties.templateSelectionExpression));
  return errors.wrap("supplied properties not correct for \"CfnIntegrationResponseProps\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationResponsePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationResponsePropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ContentHandlingStrategy": cdk.stringToCloudFormation(properties.contentHandlingStrategy),
    "IntegrationId": cdk.stringToCloudFormation(properties.integrationId),
    "IntegrationResponseKey": cdk.stringToCloudFormation(properties.integrationResponseKey),
    "ResponseParameters": cdk.objectToCloudFormation(properties.responseParameters),
    "ResponseTemplates": cdk.objectToCloudFormation(properties.responseTemplates),
    "TemplateSelectionExpression": cdk.stringToCloudFormation(properties.templateSelectionExpression)
  };
}

// @ts-ignore TS6133
function CfnIntegrationResponsePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegrationResponseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegrationResponseProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("contentHandlingStrategy", "ContentHandlingStrategy", (properties.ContentHandlingStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.ContentHandlingStrategy) : undefined));
  ret.addPropertyResult("integrationId", "IntegrationId", (properties.IntegrationId != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationId) : undefined));
  ret.addPropertyResult("integrationResponseKey", "IntegrationResponseKey", (properties.IntegrationResponseKey != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationResponseKey) : undefined));
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("responseTemplates", "ResponseTemplates", (properties.ResponseTemplates != null ? cfn_parse.FromCloudFormation.getAny(properties.ResponseTemplates) : undefined));
  ret.addPropertyResult("templateSelectionExpression", "TemplateSelectionExpression", (properties.TemplateSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateSelectionExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Model` resource updates data model for a WebSocket API.
 *
 * For more information, see [Model Selection Expressions](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-selection-expressions.html#apigateway-websocket-api-model-selection-expressions) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::Model
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 */
export class CfnModel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Model";

  /**
   * Build a CfnModel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnModel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnModelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnModel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The model ID.
   *
   * @cloudformationAttribute ModelId
   */
  public readonly attrModelId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * The content-type for the model, for example, "application/json".
   */
  public contentType?: string;

  /**
   * The description of the model.
   */
  public description?: string;

  /**
   * The name of the model.
   */
  public name: string;

  /**
   * The schema for the model.
   */
  public schema: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnModelProps) {
    super(scope, id, {
      "type": CfnModel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schema", this);

    this.attrModelId = cdk.Token.asString(this.getAtt("ModelId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.contentType = props.contentType;
    this.description = props.description;
    this.name = props.name;
    this.schema = props.schema;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "contentType": this.contentType,
      "description": this.description,
      "name": this.name,
      "schema": this.schema
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnModel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnModelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnModel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 */
export interface CfnModelProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-apiid
   */
  readonly apiId: string;

  /**
   * The content-type for the model, for example, "application/json".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-contenttype
   */
  readonly contentType?: string;

  /**
   * The description of the model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-description
   */
  readonly description?: string;

  /**
   * The name of the model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-name
   */
  readonly name: string;

  /**
   * The schema for the model.
   *
   * For application/json models, this should be JSON schema draft 4 model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-schema
   */
  readonly schema: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnModelProps`
 *
 * @param properties - the TypeScript properties of a `CfnModelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnModelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schema", cdk.requiredValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("schema", cdk.validateObject)(properties.schema));
  return errors.wrap("supplied properties not correct for \"CfnModelProps\"");
}

// @ts-ignore TS6133
function convertCfnModelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnModelPropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Schema": cdk.objectToCloudFormation(properties.schema)
  };
}

// @ts-ignore TS6133
function CfnModelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnModelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnModelProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getAny(properties.Schema) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Route` resource creates a route for an API.
 *
 * @cloudformationResource AWS::ApiGatewayV2::Route
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 */
export class CfnRoute extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Route";

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
   * The route ID.
   *
   * @cloudformationAttribute RouteId
   */
  public readonly attrRouteId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * Specifies whether an API key is required for the route.
   */
  public apiKeyRequired?: boolean | cdk.IResolvable;

  /**
   * The authorization scopes supported by this route.
   */
  public authorizationScopes?: Array<string>;

  /**
   * The authorization type for the route.
   */
  public authorizationType?: string;

  /**
   * The identifier of the `Authorizer` resource to be associated with this route.
   */
  public authorizerId?: string;

  /**
   * The model selection expression for the route.
   */
  public modelSelectionExpression?: string;

  /**
   * The operation name for the route.
   */
  public operationName?: string;

  /**
   * The request models for the route.
   */
  public requestModels?: any | cdk.IResolvable;

  /**
   * The request parameters for the route.
   */
  public requestParameters?: any | cdk.IResolvable;

  /**
   * The route key for the route.
   */
  public routeKey: string;

  /**
   * The route response selection expression for the route.
   */
  public routeResponseSelectionExpression?: string;

  /**
   * The target for the route.
   */
  public target?: string;

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

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "routeKey", this);

    this.attrRouteId = cdk.Token.asString(this.getAtt("RouteId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.apiKeyRequired = props.apiKeyRequired;
    this.authorizationScopes = props.authorizationScopes;
    this.authorizationType = props.authorizationType;
    this.authorizerId = props.authorizerId;
    this.modelSelectionExpression = props.modelSelectionExpression;
    this.operationName = props.operationName;
    this.requestModels = props.requestModels;
    this.requestParameters = props.requestParameters;
    this.routeKey = props.routeKey;
    this.routeResponseSelectionExpression = props.routeResponseSelectionExpression;
    this.target = props.target;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "apiKeyRequired": this.apiKeyRequired,
      "authorizationScopes": this.authorizationScopes,
      "authorizationType": this.authorizationType,
      "authorizerId": this.authorizerId,
      "modelSelectionExpression": this.modelSelectionExpression,
      "operationName": this.operationName,
      "requestModels": this.requestModels,
      "requestParameters": this.requestParameters,
      "routeKey": this.routeKey,
      "routeResponseSelectionExpression": this.routeResponseSelectionExpression,
      "target": this.target
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
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html
   */
  export interface ParameterConstraintsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html#cfn-apigatewayv2-route-parameterconstraints-required
     */
    readonly required: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 */
export interface CfnRouteProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apiid
   */
  readonly apiId: string;

  /**
   * Specifies whether an API key is required for the route.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apikeyrequired
   */
  readonly apiKeyRequired?: boolean | cdk.IResolvable;

  /**
   * The authorization scopes supported by this route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationscopes
   */
  readonly authorizationScopes?: Array<string>;

  /**
   * The authorization type for the route.
   *
   * For WebSocket APIs, valid values are `NONE` for open access, `AWS_IAM` for using AWS IAM permissions, and `CUSTOM` for using a Lambda authorizer. For HTTP APIs, valid values are `NONE` for open access, `JWT` for using JSON Web Tokens, `AWS_IAM` for using AWS IAM permissions, and `CUSTOM` for using a Lambda authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype
   */
  readonly authorizationType?: string;

  /**
   * The identifier of the `Authorizer` resource to be associated with this route.
   *
   * The authorizer identifier is generated by API Gateway when you created the authorizer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizerid
   */
  readonly authorizerId?: string;

  /**
   * The model selection expression for the route.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-modelselectionexpression
   */
  readonly modelSelectionExpression?: string;

  /**
   * The operation name for the route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-operationname
   */
  readonly operationName?: string;

  /**
   * The request models for the route.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestmodels
   */
  readonly requestModels?: any | cdk.IResolvable;

  /**
   * The request parameters for the route.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestparameters
   */
  readonly requestParameters?: any | cdk.IResolvable;

  /**
   * The route key for the route.
   *
   * For HTTP APIs, the route key can be either `$default` , or a combination of an HTTP method and resource path, for example, `GET /pets` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routekey
   */
  readonly routeKey: string;

  /**
   * The route response selection expression for the route.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routeresponseselectionexpression
   */
  readonly routeResponseSelectionExpression?: string;

  /**
   * The target for the route.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-target
   */
  readonly target?: string;
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
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiKeyRequired", cdk.validateBoolean)(properties.apiKeyRequired));
  errors.collect(cdk.propertyValidator("authorizationScopes", cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator("authorizationType", cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator("authorizerId", cdk.validateString)(properties.authorizerId));
  errors.collect(cdk.propertyValidator("modelSelectionExpression", cdk.validateString)(properties.modelSelectionExpression));
  errors.collect(cdk.propertyValidator("operationName", cdk.validateString)(properties.operationName));
  errors.collect(cdk.propertyValidator("requestModels", cdk.validateObject)(properties.requestModels));
  errors.collect(cdk.propertyValidator("requestParameters", cdk.validateObject)(properties.requestParameters));
  errors.collect(cdk.propertyValidator("routeKey", cdk.requiredValidator)(properties.routeKey));
  errors.collect(cdk.propertyValidator("routeKey", cdk.validateString)(properties.routeKey));
  errors.collect(cdk.propertyValidator("routeResponseSelectionExpression", cdk.validateString)(properties.routeResponseSelectionExpression));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"CfnRouteProps\"");
}

// @ts-ignore TS6133
function convertCfnRoutePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutePropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ApiKeyRequired": cdk.booleanToCloudFormation(properties.apiKeyRequired),
    "AuthorizationScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    "AuthorizationType": cdk.stringToCloudFormation(properties.authorizationType),
    "AuthorizerId": cdk.stringToCloudFormation(properties.authorizerId),
    "ModelSelectionExpression": cdk.stringToCloudFormation(properties.modelSelectionExpression),
    "OperationName": cdk.stringToCloudFormation(properties.operationName),
    "RequestModels": cdk.objectToCloudFormation(properties.requestModels),
    "RequestParameters": cdk.objectToCloudFormation(properties.requestParameters),
    "RouteKey": cdk.stringToCloudFormation(properties.routeKey),
    "RouteResponseSelectionExpression": cdk.stringToCloudFormation(properties.routeResponseSelectionExpression),
    "Target": cdk.stringToCloudFormation(properties.target)
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
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("apiKeyRequired", "ApiKeyRequired", (properties.ApiKeyRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApiKeyRequired) : undefined));
  ret.addPropertyResult("authorizationScopes", "AuthorizationScopes", (properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizationScopes) : undefined));
  ret.addPropertyResult("authorizationType", "AuthorizationType", (properties.AuthorizationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationType) : undefined));
  ret.addPropertyResult("authorizerId", "AuthorizerId", (properties.AuthorizerId != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizerId) : undefined));
  ret.addPropertyResult("modelSelectionExpression", "ModelSelectionExpression", (properties.ModelSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ModelSelectionExpression) : undefined));
  ret.addPropertyResult("operationName", "OperationName", (properties.OperationName != null ? cfn_parse.FromCloudFormation.getString(properties.OperationName) : undefined));
  ret.addPropertyResult("requestModels", "RequestModels", (properties.RequestModels != null ? cfn_parse.FromCloudFormation.getAny(properties.RequestModels) : undefined));
  ret.addPropertyResult("requestParameters", "RequestParameters", (properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getAny(properties.RequestParameters) : undefined));
  ret.addPropertyResult("routeKey", "RouteKey", (properties.RouteKey != null ? cfn_parse.FromCloudFormation.getString(properties.RouteKey) : undefined));
  ret.addPropertyResult("routeResponseSelectionExpression", "RouteResponseSelectionExpression", (properties.RouteResponseSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.RouteResponseSelectionExpression) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteParameterConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("required", cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  return errors.wrap("supplied properties not correct for \"ParameterConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteParameterConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteParameterConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "Required": cdk.booleanToCloudFormation(properties.required)
  };
}

// @ts-ignore TS6133
function CfnRouteParameterConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoute.ParameterConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoute.ParameterConstraintsProperty>();
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::RouteResponse` resource creates a route response for a WebSocket API.
 *
 * For more information, see [Set up Route Responses for a WebSocket API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-response.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::RouteResponse
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 */
export class CfnRouteResponse extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::RouteResponse";

  /**
   * Build a CfnRouteResponse from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRouteResponse {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRouteResponsePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRouteResponse(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The route response ID.
   *
   * @cloudformationAttribute RouteResponseId
   */
  public readonly attrRouteResponseId: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * The model selection expression for the route response.
   */
  public modelSelectionExpression?: string;

  /**
   * The response models for the route response.
   */
  public responseModels?: any | cdk.IResolvable;

  /**
   * The route response parameters.
   */
  public responseParameters?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnRouteResponse.ParameterConstraintsProperty>;

  /**
   * The route ID.
   */
  public routeId: string;

  /**
   * The route response key.
   */
  public routeResponseKey: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRouteResponseProps) {
    super(scope, id, {
      "type": CfnRouteResponse.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "routeId", this);
    cdk.requireProperty(props, "routeResponseKey", this);

    this.attrRouteResponseId = cdk.Token.asString(this.getAtt("RouteResponseId", cdk.ResolutionTypeHint.STRING));
    this.apiId = props.apiId;
    this.modelSelectionExpression = props.modelSelectionExpression;
    this.responseModels = props.responseModels;
    this.responseParameters = props.responseParameters;
    this.routeId = props.routeId;
    this.routeResponseKey = props.routeResponseKey;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "apiId": this.apiId,
      "modelSelectionExpression": this.modelSelectionExpression,
      "responseModels": this.responseModels,
      "responseParameters": this.responseParameters,
      "routeId": this.routeId,
      "routeResponseKey": this.routeResponseKey
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRouteResponse.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRouteResponsePropsToCloudFormation(props);
  }
}

export namespace CfnRouteResponse {
  /**
   * Specifies whether the parameter is required.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html
   */
  export interface ParameterConstraintsProperty {
    /**
     * Specifies whether the parameter is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html#cfn-apigatewayv2-routeresponse-parameterconstraints-required
     */
    readonly required: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnRouteResponse`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 */
export interface CfnRouteResponseProps {
  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-apiid
   */
  readonly apiId: string;

  /**
   * The model selection expression for the route response.
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-modelselectionexpression
   */
  readonly modelSelectionExpression?: string;

  /**
   * The response models for the route response.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responsemodels
   */
  readonly responseModels?: any | cdk.IResolvable;

  /**
   * The route response parameters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responseparameters
   */
  readonly responseParameters?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnRouteResponse.ParameterConstraintsProperty>;

  /**
   * The route ID.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeid
   */
  readonly routeId: string;

  /**
   * The route response key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeresponsekey
   */
  readonly routeResponseKey: string;
}

/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteResponseParameterConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("required", cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  return errors.wrap("supplied properties not correct for \"ParameterConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRouteResponseParameterConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteResponseParameterConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "Required": cdk.booleanToCloudFormation(properties.required)
  };
}

// @ts-ignore TS6133
function CfnRouteResponseParameterConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRouteResponse.ParameterConstraintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteResponse.ParameterConstraintsProperty>();
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRouteResponseProps`
 *
 * @param properties - the TypeScript properties of a `CfnRouteResponseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteResponsePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("modelSelectionExpression", cdk.validateString)(properties.modelSelectionExpression));
  errors.collect(cdk.propertyValidator("responseModels", cdk.validateObject)(properties.responseModels));
  errors.collect(cdk.propertyValidator("responseParameters", cdk.hashValidator(CfnRouteResponseParameterConstraintsPropertyValidator))(properties.responseParameters));
  errors.collect(cdk.propertyValidator("routeId", cdk.requiredValidator)(properties.routeId));
  errors.collect(cdk.propertyValidator("routeId", cdk.validateString)(properties.routeId));
  errors.collect(cdk.propertyValidator("routeResponseKey", cdk.requiredValidator)(properties.routeResponseKey));
  errors.collect(cdk.propertyValidator("routeResponseKey", cdk.validateString)(properties.routeResponseKey));
  return errors.wrap("supplied properties not correct for \"CfnRouteResponseProps\"");
}

// @ts-ignore TS6133
function convertCfnRouteResponsePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteResponsePropsValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "ModelSelectionExpression": cdk.stringToCloudFormation(properties.modelSelectionExpression),
    "ResponseModels": cdk.objectToCloudFormation(properties.responseModels),
    "ResponseParameters": cdk.hashMapper(convertCfnRouteResponseParameterConstraintsPropertyToCloudFormation)(properties.responseParameters),
    "RouteId": cdk.stringToCloudFormation(properties.routeId),
    "RouteResponseKey": cdk.stringToCloudFormation(properties.routeResponseKey)
  };
}

// @ts-ignore TS6133
function CfnRouteResponsePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteResponseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteResponseProps>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("modelSelectionExpression", "ModelSelectionExpression", (properties.ModelSelectionExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ModelSelectionExpression) : undefined));
  ret.addPropertyResult("responseModels", "ResponseModels", (properties.ResponseModels != null ? cfn_parse.FromCloudFormation.getAny(properties.ResponseModels) : undefined));
  ret.addPropertyResult("responseParameters", "ResponseParameters", (properties.ResponseParameters != null ? cfn_parse.FromCloudFormation.getMap(CfnRouteResponseParameterConstraintsPropertyFromCloudFormation)(properties.ResponseParameters) : undefined));
  ret.addPropertyResult("routeId", "RouteId", (properties.RouteId != null ? cfn_parse.FromCloudFormation.getString(properties.RouteId) : undefined));
  ret.addPropertyResult("routeResponseKey", "RouteResponseKey", (properties.RouteResponseKey != null ? cfn_parse.FromCloudFormation.getString(properties.RouteResponseKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::Stage` resource specifies a stage for an API.
 *
 * Each stage is a named reference to a deployment of the API and is made available for client applications to call. To learn more, see [Working with stages for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-stages.html) and [Deploy a WebSocket API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-set-up-websocket-deployment.html) .
 *
 * @cloudformationResource AWS::ApiGatewayV2::Stage
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 */
export class CfnStage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::Stage";

  /**
   * Build a CfnStage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Settings for logging access in this stage.
   */
  public accessLogSettings?: CfnStage.AccessLogSettingsProperty | cdk.IResolvable;

  /**
   * This parameter is not currently supported.
   */
  public accessPolicyId?: string;

  /**
   * The API identifier.
   */
  public apiId: string;

  /**
   * Specifies whether updates to an API automatically trigger a new deployment.
   */
  public autoDeploy?: boolean | cdk.IResolvable;

  /**
   * The identifier of a client certificate for a `Stage` .
   */
  public clientCertificateId?: string;

  /**
   * The default route settings for the stage.
   */
  public defaultRouteSettings?: cdk.IResolvable | CfnStage.RouteSettingsProperty;

  /**
   * The deployment identifier for the API stage.
   */
  public deploymentId?: string;

  /**
   * The description for the API stage.
   */
  public description?: string;

  /**
   * Route settings for the stage.
   */
  public routeSettings?: any | cdk.IResolvable;

  /**
   * The stage name.
   */
  public stageName: string;

  /**
   * A map that defines the stage variables for a `Stage` .
   */
  public stageVariables?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStageProps) {
    super(scope, id, {
      "type": CfnStage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "apiId", this);
    cdk.requireProperty(props, "stageName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.accessLogSettings = props.accessLogSettings;
    this.accessPolicyId = props.accessPolicyId;
    this.apiId = props.apiId;
    this.autoDeploy = props.autoDeploy;
    this.clientCertificateId = props.clientCertificateId;
    this.defaultRouteSettings = props.defaultRouteSettings;
    this.deploymentId = props.deploymentId;
    this.description = props.description;
    this.routeSettings = props.routeSettings;
    this.stageName = props.stageName;
    this.stageVariables = props.stageVariables;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ApiGatewayV2::Stage", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLogSettings": this.accessLogSettings,
      "accessPolicyId": this.accessPolicyId,
      "apiId": this.apiId,
      "autoDeploy": this.autoDeploy,
      "clientCertificateId": this.clientCertificateId,
      "defaultRouteSettings": this.defaultRouteSettings,
      "deploymentId": this.deploymentId,
      "description": this.description,
      "routeSettings": this.routeSettings,
      "stageName": this.stageName,
      "stageVariables": this.stageVariables,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStagePropsToCloudFormation(props);
  }
}

export namespace CfnStage {
  /**
   * Settings for logging access in a stage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html
   */
  export interface AccessLogSettingsProperty {
    /**
     * The ARN of the CloudWatch Logs log group to receive access logs.
     *
     * This parameter is required to enable access logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * A single line format of the access logs of data, as specified by selected $context variables.
     *
     * The format must include at least $context.requestId. This parameter is required to enable access logging.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-format
     */
    readonly format?: string;
  }

  /**
   * Represents a collection of route settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
   */
  export interface RouteSettingsProperty {
    /**
     * Specifies whether ( `true` ) or not ( `false` ) data trace logging is enabled for this route.
     *
     * This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies whether detailed metrics are enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
     */
    readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the logging level for this route: `INFO` , `ERROR` , or `OFF` .
     *
     * This property affects the log entries pushed to Amazon CloudWatch Logs. Supported only for WebSocket APIs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * Specifies the throttling burst limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * Specifies the throttling rate limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }
}

/**
 * Properties for defining a `CfnStage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 */
export interface CfnStageProps {
  /**
   * Settings for logging access in this stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesslogsettings
   */
  readonly accessLogSettings?: CfnStage.AccessLogSettingsProperty | cdk.IResolvable;

  /**
   * This parameter is not currently supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesspolicyid
   */
  readonly accessPolicyId?: string;

  /**
   * The API identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-apiid
   */
  readonly apiId: string;

  /**
   * Specifies whether updates to an API automatically trigger a new deployment.
   *
   * The default value is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-autodeploy
   */
  readonly autoDeploy?: boolean | cdk.IResolvable;

  /**
   * The identifier of a client certificate for a `Stage` .
   *
   * Supported only for WebSocket APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-clientcertificateid
   */
  readonly clientCertificateId?: string;

  /**
   * The default route settings for the stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings
   */
  readonly defaultRouteSettings?: cdk.IResolvable | CfnStage.RouteSettingsProperty;

  /**
   * The deployment identifier for the API stage.
   *
   * Can't be updated if `autoDeploy` is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-deploymentid
   */
  readonly deploymentId?: string;

  /**
   * The description for the API stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-description
   */
  readonly description?: string;

  /**
   * Route settings for the stage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
   */
  readonly routeSettings?: any | cdk.IResolvable;

  /**
   * The stage name.
   *
   * Stage names can contain only alphanumeric characters, hyphens, and underscores, or be `$default` . Maximum length is 128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagename
   */
  readonly stageName: string;

  /**
   * A map that defines the stage variables for a `Stage` .
   *
   * Variable names can have alphanumeric and underscore characters, and the values must match [A-Za-z0-9-._~:/?#&=,]+.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagevariables
   */
  readonly stageVariables?: any | cdk.IResolvable;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStageAccessLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStageAccessLogSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStageAccessLogSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnStageAccessLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStage.AccessLogSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStage.AccessLogSettingsProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStageRouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("detailedMetricsEnabled", cdk.validateBoolean)(properties.detailedMetricsEnabled));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"RouteSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStageRouteSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStageRouteSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "DetailedMetricsEnabled": cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnStageRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStage.RouteSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStage.RouteSettingsProperty>();
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("detailedMetricsEnabled", "DetailedMetricsEnabled", (properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStageProps`
 *
 * @param properties - the TypeScript properties of a `CfnStageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSettings", CfnStageAccessLogSettingsPropertyValidator)(properties.accessLogSettings));
  errors.collect(cdk.propertyValidator("accessPolicyId", cdk.validateString)(properties.accessPolicyId));
  errors.collect(cdk.propertyValidator("apiId", cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("autoDeploy", cdk.validateBoolean)(properties.autoDeploy));
  errors.collect(cdk.propertyValidator("clientCertificateId", cdk.validateString)(properties.clientCertificateId));
  errors.collect(cdk.propertyValidator("defaultRouteSettings", CfnStageRouteSettingsPropertyValidator)(properties.defaultRouteSettings));
  errors.collect(cdk.propertyValidator("deploymentId", cdk.validateString)(properties.deploymentId));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("routeSettings", cdk.validateObject)(properties.routeSettings));
  errors.collect(cdk.propertyValidator("stageName", cdk.requiredValidator)(properties.stageName));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  errors.collect(cdk.propertyValidator("stageVariables", cdk.validateObject)(properties.stageVariables));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStageProps\"");
}

// @ts-ignore TS6133
function convertCfnStagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStagePropsValidator(properties).assertSuccess();
  return {
    "AccessLogSettings": convertCfnStageAccessLogSettingsPropertyToCloudFormation(properties.accessLogSettings),
    "AccessPolicyId": cdk.stringToCloudFormation(properties.accessPolicyId),
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "AutoDeploy": cdk.booleanToCloudFormation(properties.autoDeploy),
    "ClientCertificateId": cdk.stringToCloudFormation(properties.clientCertificateId),
    "DefaultRouteSettings": convertCfnStageRouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
    "DeploymentId": cdk.stringToCloudFormation(properties.deploymentId),
    "Description": cdk.stringToCloudFormation(properties.description),
    "RouteSettings": cdk.objectToCloudFormation(properties.routeSettings),
    "StageName": cdk.stringToCloudFormation(properties.stageName),
    "StageVariables": cdk.objectToCloudFormation(properties.stageVariables),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStageProps>();
  ret.addPropertyResult("accessLogSettings", "AccessLogSettings", (properties.AccessLogSettings != null ? CfnStageAccessLogSettingsPropertyFromCloudFormation(properties.AccessLogSettings) : undefined));
  ret.addPropertyResult("accessPolicyId", "AccessPolicyId", (properties.AccessPolicyId != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPolicyId) : undefined));
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("autoDeploy", "AutoDeploy", (properties.AutoDeploy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoDeploy) : undefined));
  ret.addPropertyResult("clientCertificateId", "ClientCertificateId", (properties.ClientCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCertificateId) : undefined));
  ret.addPropertyResult("defaultRouteSettings", "DefaultRouteSettings", (properties.DefaultRouteSettings != null ? CfnStageRouteSettingsPropertyFromCloudFormation(properties.DefaultRouteSettings) : undefined));
  ret.addPropertyResult("deploymentId", "DeploymentId", (properties.DeploymentId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentId) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("routeSettings", "RouteSettings", (properties.RouteSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.RouteSettings) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addPropertyResult("stageVariables", "StageVariables", (properties.StageVariables != null ? cfn_parse.FromCloudFormation.getAny(properties.StageVariables) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ApiGatewayV2::VpcLink` resource creates a VPC link.
 *
 * Supported only for HTTP APIs. The VPC link status must transition from `PENDING` to `AVAILABLE` to successfully create a VPC link, which can take up to 10 minutes. To learn more, see [Working with VPC Links for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vpc-links.html) in the *API Gateway Developer Guide* .
 *
 * @cloudformationResource AWS::ApiGatewayV2::VpcLink
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html
 */
export class CfnVpcLink extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ApiGatewayV2::VpcLink";

  /**
   * Build a CfnVpcLink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVpcLink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVpcLinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVpcLink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The VPC link ID.
   *
   * @cloudformationAttribute VpcLinkId
   */
  public readonly attrVpcLinkId: string;

  /**
   * The name of the VPC link.
   */
  public name: string;

  /**
   * A list of security group IDs for the VPC link.
   */
  public securityGroupIds?: Array<string>;

  /**
   * A list of subnet IDs to include in the VPC link.
   */
  public subnetIds: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The collection of tags.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVpcLinkProps) {
    super(scope, id, {
      "type": CfnVpcLink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "subnetIds", this);

    this.attrVpcLinkId = cdk.Token.asString(this.getAtt("VpcLinkId", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetIds = props.subnetIds;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ApiGatewayV2::VpcLink", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "securityGroupIds": this.securityGroupIds,
      "subnetIds": this.subnetIds,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVpcLink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVpcLinkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnVpcLink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html
 */
export interface CfnVpcLinkProps {
  /**
   * The name of the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html#cfn-apigatewayv2-vpclink-name
   */
  readonly name: string;

  /**
   * A list of security group IDs for the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html#cfn-apigatewayv2-vpclink-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * A list of subnet IDs to include in the VPC link.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html#cfn-apigatewayv2-vpclink-subnetids
   */
  readonly subnetIds: Array<string>;

  /**
   * The collection of tags.
   *
   * Each tag element is associated with a given resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-vpclink.html#cfn-apigatewayv2-vpclink-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnVpcLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnVpcLinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVpcLinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnVpcLinkProps\"");
}

// @ts-ignore TS6133
function convertCfnVpcLinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVpcLinkPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnVpcLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVpcLinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVpcLinkProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}