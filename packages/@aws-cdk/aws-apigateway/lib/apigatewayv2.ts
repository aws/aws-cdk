// Copyright 2012-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Originally generated from the AWS CloudFormation Resource Specification. Now, hand managed.

/* eslint-disable max-len */

import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Properties for defining a `AWS::ApiGatewayV2::Api`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnApiV2Props {

  /**
   * `AWS::ApiGatewayV2::Api.ApiKeySelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-apikeyselectionexpression
   */
  readonly apiKeySelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Api.BasePath`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-basepath
   */
  readonly basePath?: string;

  /**
   * `AWS::ApiGatewayV2::Api.Body`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-body
   */
  readonly body?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Api.BodyS3Location`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-bodys3location
   */
  readonly bodyS3Location?: CfnApiV2.BodyS3LocationProperty | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Api.CorsConfiguration`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-corsconfiguration
   */
  readonly corsConfiguration?: CfnApiV2.CorsProperty | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Api.CredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-credentialsarn
   */
  readonly credentialsArn?: string;

  /**
   * `AWS::ApiGatewayV2::Api.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-description
   */
  readonly description?: string;

  /**
   * `AWS::ApiGatewayV2::Api.DisableSchemaValidation`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableschemavalidation
   */
  readonly disableSchemaValidation?: boolean | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Api.FailOnWarnings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-failonwarnings
   */
  readonly failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Api.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-name
   */
  readonly name?: string;

  /**
   * `AWS::ApiGatewayV2::Api.ProtocolType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-protocoltype
   */
  readonly protocolType?: string;

  /**
   * `AWS::ApiGatewayV2::Api.RouteKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routekey
   */
  readonly routeKey?: string;

  /**
   * `AWS::ApiGatewayV2::Api.RouteSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression
   */
  readonly routeSelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Api.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-tags
   */
  readonly tags?: any;

  /**
   * `AWS::ApiGatewayV2::Api.Target`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-target
   */
  readonly target?: string;

  /**
   * `AWS::ApiGatewayV2::Api.Version`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `CfnApiV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnApiV2Props`
 *
 * @returns the result of the validation.
 */
function CfnApiV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiKeySelectionExpression', cdk.validateString)(properties.apiKeySelectionExpression));
  errors.collect(cdk.propertyValidator('basePath', cdk.validateString)(properties.basePath));
  errors.collect(cdk.propertyValidator('body', cdk.validateObject)(properties.body));
  errors.collect(cdk.propertyValidator('bodyS3Location', CfnApiV2_BodyS3LocationPropertyValidator)(properties.bodyS3Location));
  errors.collect(cdk.propertyValidator('corsConfiguration', CfnApiV2_CorsPropertyValidator)(properties.corsConfiguration));
  errors.collect(cdk.propertyValidator('credentialsArn', cdk.validateString)(properties.credentialsArn));
  errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator('disableSchemaValidation', cdk.validateBoolean)(properties.disableSchemaValidation));
  errors.collect(cdk.propertyValidator('failOnWarnings', cdk.validateBoolean)(properties.failOnWarnings));
  errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator('protocolType', cdk.validateString)(properties.protocolType));
  errors.collect(cdk.propertyValidator('routeKey', cdk.validateString)(properties.routeKey));
  errors.collect(cdk.propertyValidator('routeSelectionExpression', cdk.validateString)(properties.routeSelectionExpression));
  errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
  return errors.wrap('supplied properties not correct for "CfnApiV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api` resource.
 */
// @ts-ignore TS6133
function cfnApiV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnApiV2PropsValidator(properties).assertSuccess();
  return {
    ApiKeySelectionExpression: cdk.stringToCloudFormation(properties.apiKeySelectionExpression),
    BasePath: cdk.stringToCloudFormation(properties.basePath),
    Body: cdk.objectToCloudFormation(properties.body),
    BodyS3Location: cfnApiV2BodyS3LocationPropertyToCloudFormation(properties.bodyS3Location),
    CorsConfiguration: cfnApiV2CorsPropertyToCloudFormation(properties.corsConfiguration),
    CredentialsArn: cdk.stringToCloudFormation(properties.credentialsArn),
    Description: cdk.stringToCloudFormation(properties.description),
    DisableSchemaValidation: cdk.booleanToCloudFormation(properties.disableSchemaValidation),
    FailOnWarnings: cdk.booleanToCloudFormation(properties.failOnWarnings),
    Name: cdk.stringToCloudFormation(properties.name),
    ProtocolType: cdk.stringToCloudFormation(properties.protocolType),
    RouteKey: cdk.stringToCloudFormation(properties.routeKey),
    RouteSelectionExpression: cdk.stringToCloudFormation(properties.routeSelectionExpression),
    Tags: cdk.objectToCloudFormation(properties.tags),
    Target: cdk.stringToCloudFormation(properties.target),
    Version: cdk.stringToCloudFormation(properties.version),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Api`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Api
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnApiV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Api';

  /**
   * `AWS::ApiGatewayV2::Api.ApiKeySelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-apikeyselectionexpression
   */
  public apiKeySelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.BasePath`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-basepath
   */
  public basePath: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.Body`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-body
   */
  public body: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.BodyS3Location`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-bodys3location
   */
  public bodyS3Location: CfnApiV2.BodyS3LocationProperty | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.CorsConfiguration`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-corsconfiguration
   */
  public corsConfiguration: CfnApiV2.CorsProperty | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.CredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-credentialsarn
   */
  public credentialsArn: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-description
   */
  public description: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.DisableSchemaValidation`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableschemavalidation
   */
  public disableSchemaValidation: boolean | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.FailOnWarnings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-failonwarnings
   */
  public failOnWarnings: boolean | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-name
   */
  public name: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.ProtocolType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-protocoltype
   */
  public protocolType: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.RouteKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routekey
   */
  public routeKey: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.RouteSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression
   */
  public routeSelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-tags
   */
  public readonly tags: cdk.TagManager;

  /**
   * `AWS::ApiGatewayV2::Api.Target`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-target
   */
  public target: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Api.Version`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-version
   */
  public version: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Api`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnApiV2Props = {}) {
    super(scope, id, { type: CfnApiV2.CFN_RESOURCE_TYPE_NAME, properties: props });

    this.apiKeySelectionExpression = props.apiKeySelectionExpression;
    this.basePath = props.basePath;
    this.body = props.body;
    this.bodyS3Location = props.bodyS3Location;
    this.corsConfiguration = props.corsConfiguration;
    this.credentialsArn = props.credentialsArn;
    this.description = props.description;
    this.disableSchemaValidation = props.disableSchemaValidation;
    this.failOnWarnings = props.failOnWarnings;
    this.name = props.name;
    this.protocolType = props.protocolType;
    this.routeKey = props.routeKey;
    this.routeSelectionExpression = props.routeSelectionExpression;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::Api', props.tags, { tagPropertyName: 'tags' });
    this.target = props.target;
    this.version = props.version;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnApiV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiKeySelectionExpression: this.apiKeySelectionExpression,
      basePath: this.basePath,
      body: this.body,
      bodyS3Location: this.bodyS3Location,
      corsConfiguration: this.corsConfiguration,
      credentialsArn: this.credentialsArn,
      description: this.description,
      disableSchemaValidation: this.disableSchemaValidation,
      failOnWarnings: this.failOnWarnings,
      name: this.name,
      protocolType: this.protocolType,
      routeKey: this.routeKey,
      routeSelectionExpression: this.routeSelectionExpression,
      tags: this.tags.renderTags(),
      target: this.target,
      version: this.version,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnApiV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnApiV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface BodyS3LocationProperty {
    /**
     * `CfnApiV2.BodyS3LocationProperty.Bucket`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-bucket
     */
    readonly bucket?: string;
    /**
     * `CfnApiV2.BodyS3LocationProperty.Etag`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-etag
     */
    readonly etag?: string;
    /**
     * `CfnApiV2.BodyS3LocationProperty.Key`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-key
     */
    readonly key?: string;
    /**
     * `CfnApiV2.BodyS3LocationProperty.Version`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-version
     */
    readonly version?: string;
  }
}

/**
 * Determine whether the given properties match those of a `BodyS3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `BodyS3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnApiV2_BodyS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('bucket', cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator('etag', cdk.validateString)(properties.etag));
  errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
  return errors.wrap('supplied properties not correct for "BodyS3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.BodyS3Location` resource
 *
 * @param properties - the TypeScript properties of a `BodyS3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.BodyS3Location` resource.
 */
// @ts-ignore TS6133
function cfnApiV2BodyS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnApiV2_BodyS3LocationPropertyValidator(properties).assertSuccess();
  return {
    Bucket: cdk.stringToCloudFormation(properties.bucket),
    Etag: cdk.stringToCloudFormation(properties.etag),
    Key: cdk.stringToCloudFormation(properties.key),
    Version: cdk.stringToCloudFormation(properties.version),
  };
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnApiV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface CorsProperty {
    /**
     * `CfnApiV2.CorsProperty.AllowCredentials`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;
    /**
     * `CfnApiV2.CorsProperty.AllowHeaders`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowheaders
     */
    readonly allowHeaders?: string[];
    /**
     * `CfnApiV2.CorsProperty.AllowMethods`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowmethods
     */
    readonly allowMethods?: string[];
    /**
     * `CfnApiV2.CorsProperty.AllowOrigins`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-alloworigins
     */
    readonly allowOrigins?: string[];
    /**
     * `CfnApiV2.CorsProperty.ExposeHeaders`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-exposeheaders
     */
    readonly exposeHeaders?: string[];
    /**
     * `CfnApiV2.CorsProperty.MaxAge`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-maxage
     */
    readonly maxAge?: number;
  }
}

/**
 * Determine whether the given properties match those of a `CorsProperty`
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApiV2_CorsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('allowCredentials', cdk.validateBoolean)(properties.allowCredentials));
  errors.collect(cdk.propertyValidator('allowHeaders', cdk.listValidator(cdk.validateString))(properties.allowHeaders));
  errors.collect(cdk.propertyValidator('allowMethods', cdk.listValidator(cdk.validateString))(properties.allowMethods));
  errors.collect(cdk.propertyValidator('allowOrigins', cdk.listValidator(cdk.validateString))(properties.allowOrigins));
  errors.collect(cdk.propertyValidator('exposeHeaders', cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
  errors.collect(cdk.propertyValidator('maxAge', cdk.validateNumber)(properties.maxAge));
  return errors.wrap('supplied properties not correct for "CorsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.Cors` resource
 *
 * @param properties - the TypeScript properties of a `CorsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Api.Cors` resource.
 */
// @ts-ignore TS6133
function cfnApiV2CorsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnApiV2_CorsPropertyValidator(properties).assertSuccess();
  return {
    AllowCredentials: cdk.booleanToCloudFormation(properties.allowCredentials),
    AllowHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
    AllowMethods: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
    AllowOrigins: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
    ExposeHeaders: cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
    MaxAge: cdk.numberToCloudFormation(properties.maxAge),
  };
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::ApiMapping`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnApiMappingV2Props {

  /**
   * `AWS::ApiGatewayV2::ApiMapping.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.DomainName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-domainname
   */
  readonly domainName: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.Stage`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-stage
   */
  readonly stage: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.ApiMappingKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apimappingkey
   */
  readonly apiMappingKey?: string;
}

/**
 * Determine whether the given properties match those of a `CfnApiMappingV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnApiMappingV2Props`
 *
 * @returns the result of the validation.
 */
function CfnApiMappingV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiMappingKey', cdk.validateString)(properties.apiMappingKey));
  errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator('stage', cdk.requiredValidator)(properties.stage));
  errors.collect(cdk.propertyValidator('stage', cdk.validateString)(properties.stage));
  return errors.wrap('supplied properties not correct for "CfnApiMappingV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::ApiMapping` resource
 *
 * @param properties - the TypeScript properties of a `CfnApiMappingV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::ApiMapping` resource.
 */
// @ts-ignore TS6133
function cfnApiMappingV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnApiMappingV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    DomainName: cdk.stringToCloudFormation(properties.domainName),
    Stage: cdk.stringToCloudFormation(properties.stage),
    ApiMappingKey: cdk.stringToCloudFormation(properties.apiMappingKey),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::ApiMapping`
 *
 * @cloudformationResource AWS::ApiGatewayV2::ApiMapping
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnApiMappingV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::ApiMapping';

  /**
   * `AWS::ApiGatewayV2::ApiMapping.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.DomainName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-domainname
   */
  public domainName: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.Stage`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-stage
   */
  public stage: string;

  /**
   * `AWS::ApiGatewayV2::ApiMapping.ApiMappingKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apimappingkey
   */
  public apiMappingKey: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::ApiMapping`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnApiMappingV2Props) {
    super(scope, id, { type: CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'domainName', this);
    cdk.requireProperty(props, 'stage', this);

    this.apiId = props.apiId;
    this.domainName = props.domainName;
    this.stage = props.stage;
    this.apiMappingKey = props.apiMappingKey;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      domainName: this.domainName,
      stage: this.stage,
      apiMappingKey: this.apiMappingKey,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnApiMappingV2PropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Authorizer`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnAuthorizerV2Props {

  /**
   * `AWS::ApiGatewayV2::Authorizer.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizertype
   */
  readonly authorizerType: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.IdentitySource`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identitysource
   */
  readonly identitySource: string[];

  /**
   * `AWS::ApiGatewayV2::Authorizer.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-name
   */
  readonly name: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerCredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizercredentialsarn
   */
  readonly authorizerCredentialsArn?: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerResultTtlInSeconds`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerresultttlinseconds
   */
  readonly authorizerResultTtlInSeconds?: number;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerUri`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizeruri
   */
  readonly authorizerUri?: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.IdentityValidationExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identityvalidationexpression
   */
  readonly identityValidationExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.JwtConfiguration`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-jwtconfiguration
   */
  readonly jwtConfiguration?: CfnAuthorizerV2.JWTConfigurationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnAuthorizerV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerV2Props`
 *
 * @returns the result of the validation.
 */
function CfnAuthorizerV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('authorizerCredentialsArn', cdk.validateString)(properties.authorizerCredentialsArn));
  errors.collect(cdk.propertyValidator('authorizerResultTtlInSeconds', cdk.validateNumber)(properties.authorizerResultTtlInSeconds));
  errors.collect(cdk.propertyValidator('authorizerType', cdk.requiredValidator)(properties.authorizerType));
  errors.collect(cdk.propertyValidator('authorizerType', cdk.validateString)(properties.authorizerType));
  errors.collect(cdk.propertyValidator('authorizerUri', cdk.validateString)(properties.authorizerUri));
  errors.collect(cdk.propertyValidator('identitySource', cdk.requiredValidator)(properties.identitySource));
  errors.collect(cdk.propertyValidator('identitySource', cdk.listValidator(cdk.validateString))(properties.identitySource));
  errors.collect(cdk.propertyValidator('identityValidationExpression', cdk.validateString)(properties.identityValidationExpression));
  errors.collect(cdk.propertyValidator('jwtConfiguration', CfnAuthorizerV2_JWTConfigurationPropertyValidator)(properties.jwtConfiguration));
  errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
  return errors.wrap('supplied properties not correct for "CfnAuthorizerV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer` resource
 *
 * @param properties - the TypeScript properties of a `CfnAuthorizerV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer` resource.
 */
// @ts-ignore TS6133
function cfnAuthorizerV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnAuthorizerV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    AuthorizerType: cdk.stringToCloudFormation(properties.authorizerType),
    IdentitySource: cdk.listMapper(cdk.stringToCloudFormation)(properties.identitySource),
    Name: cdk.stringToCloudFormation(properties.name),
    AuthorizerCredentialsArn: cdk.stringToCloudFormation(properties.authorizerCredentialsArn),
    AuthorizerResultTtlInSeconds: cdk.numberToCloudFormation(properties.authorizerResultTtlInSeconds),
    AuthorizerUri: cdk.stringToCloudFormation(properties.authorizerUri),
    IdentityValidationExpression: cdk.stringToCloudFormation(properties.identityValidationExpression),
    JwtConfiguration: cfnAuthorizerV2JWTConfigurationPropertyToCloudFormation(properties.jwtConfiguration),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Authorizer`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Authorizer
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnAuthorizerV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Authorizer';

  /**
   * `AWS::ApiGatewayV2::Authorizer.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizertype
   */
  public authorizerType: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.IdentitySource`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identitysource
   */
  public identitySource: string[];

  /**
   * `AWS::ApiGatewayV2::Authorizer.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-name
   */
  public name: string;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerCredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizercredentialsarn
   */
  public authorizerCredentialsArn: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerResultTtlInSeconds`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerresultttlinseconds
   */
  public authorizerResultTtlInSeconds: number | undefined;

  /**
   * `AWS::ApiGatewayV2::Authorizer.AuthorizerUri`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizeruri
   */
  public authorizerUri: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Authorizer.IdentityValidationExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identityvalidationexpression
   */
  public identityValidationExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Authorizer.JwtConfiguration`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-jwtconfiguration
   */
  public jwtConfiguration: CfnAuthorizerV2.JWTConfigurationProperty | cdk.IResolvable | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Authorizer`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnAuthorizerV2Props) {
    super(scope, id, { type: CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'authorizerType', this);
    cdk.requireProperty(props, 'identitySource', this);
    cdk.requireProperty(props, 'name', this);

    this.apiId = props.apiId;
    this.authorizerType = props.authorizerType;
    this.identitySource = props.identitySource;
    this.name = props.name;
    this.authorizerCredentialsArn = props.authorizerCredentialsArn;
    this.authorizerResultTtlInSeconds = props.authorizerResultTtlInSeconds;
    this.authorizerUri = props.authorizerUri;
    this.identityValidationExpression = props.identityValidationExpression;
    this.jwtConfiguration = props.jwtConfiguration;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      authorizerType: this.authorizerType,
      identitySource: this.identitySource,
      name: this.name,
      authorizerCredentialsArn: this.authorizerCredentialsArn,
      authorizerResultTtlInSeconds: this.authorizerResultTtlInSeconds,
      authorizerUri: this.authorizerUri,
      identityValidationExpression: this.identityValidationExpression,
      jwtConfiguration: this.jwtConfiguration,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnAuthorizerV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnAuthorizerV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface JWTConfigurationProperty {
    /**
     * `CfnAuthorizerV2.JWTConfigurationProperty.Audience`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-audience
     */
    readonly audience?: string[];
    /**
     * `CfnAuthorizerV2.JWTConfigurationProperty.Issuer`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-issuer
     */
    readonly issuer?: string;
  }
}

/**
 * Determine whether the given properties match those of a `JWTConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `JWTConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnAuthorizerV2_JWTConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('audience', cdk.listValidator(cdk.validateString))(properties.audience));
  errors.collect(cdk.propertyValidator('issuer', cdk.validateString)(properties.issuer));
  return errors.wrap('supplied properties not correct for "JWTConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer.JWTConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `JWTConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Authorizer.JWTConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnAuthorizerV2JWTConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnAuthorizerV2_JWTConfigurationPropertyValidator(properties).assertSuccess();
  return {
    Audience: cdk.listMapper(cdk.stringToCloudFormation)(properties.audience),
    Issuer: cdk.stringToCloudFormation(properties.issuer),
  };
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Deployment`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnDeploymentV2Props {

  /**
   * `AWS::ApiGatewayV2::Deployment.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Deployment.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-description
   */
  readonly description?: string;

  /**
   * `AWS::ApiGatewayV2::Deployment.StageName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-stagename
   */
  readonly stageName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDeploymentV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentV2Props`
 *
 * @returns the result of the validation.
 */
function CfnDeploymentV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
  return errors.wrap('supplied properties not correct for "CfnDeploymentV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Deployment` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeploymentV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Deployment` resource.
 */
// @ts-ignore TS6133
function cfnDeploymentV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnDeploymentV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    Description: cdk.stringToCloudFormation(properties.description),
    StageName: cdk.stringToCloudFormation(properties.stageName),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Deployment`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Deployment
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnDeploymentV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Deployment';

  /**
   * `AWS::ApiGatewayV2::Deployment.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Deployment.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-description
   */
  public description: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Deployment.StageName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-stagename
   */
  public stageName: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Deployment`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnDeploymentV2Props) {
    super(scope, id, { type: CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);

    this.apiId = props.apiId;
    this.description = props.description;
    this.stageName = props.stageName;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      description: this.description,
      stageName: this.stageName,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnDeploymentV2PropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::DomainName`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnDomainNameV2Props {

  /**
   * `AWS::ApiGatewayV2::DomainName.DomainName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainname
   */
  readonly domainName: string;

  /**
   * `AWS::ApiGatewayV2::DomainName.DomainNameConfigurations`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
   */
  readonly domainNameConfigurations?: Array<CfnDomainNameV2.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::DomainName.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnDomainNameV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameV2Props`
 *
 * @returns the result of the validation.
 */
function CfnDomainNameV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('domainName', cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator('domainNameConfigurations', cdk.listValidator(CfnDomainNameV2_DomainNameConfigurationPropertyValidator))(properties.domainNameConfigurations));
  errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
  return errors.wrap('supplied properties not correct for "CfnDomainNameV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName` resource
 *
 * @param properties - the TypeScript properties of a `CfnDomainNameV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName` resource.
 */
// @ts-ignore TS6133
function cfnDomainNameV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnDomainNameV2PropsValidator(properties).assertSuccess();
  return {
    DomainName: cdk.stringToCloudFormation(properties.domainName),
    DomainNameConfigurations: cdk.listMapper(cfnDomainNameV2DomainNameConfigurationPropertyToCloudFormation)(properties.domainNameConfigurations),
    Tags: cdk.objectToCloudFormation(properties.tags),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::DomainName`
 *
 * @cloudformationResource AWS::ApiGatewayV2::DomainName
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnDomainNameV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::DomainName';

  /**
   * @cloudformationAttribute RegionalDomainName
   */
  public readonly attrRegionalDomainName: string;

  /**
   * @cloudformationAttribute RegionalHostedZoneId
   */
  public readonly attrRegionalHostedZoneId: string;

  /**
   * `AWS::ApiGatewayV2::DomainName.DomainName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainname
   */
  public domainName: string;

  /**
   * `AWS::ApiGatewayV2::DomainName.DomainNameConfigurations`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
   */
  public domainNameConfigurations: Array<CfnDomainNameV2.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::DomainName.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-tags
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create a new `AWS::ApiGatewayV2::DomainName`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnDomainNameV2Props) {
    super(scope, id, { type: CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'domainName', this);
    this.attrRegionalDomainName = cdk.Token.asString(this.getAtt('RegionalDomainName'));
    this.attrRegionalHostedZoneId = cdk.Token.asString(this.getAtt('RegionalHostedZoneId'));

    this.domainName = props.domainName;
    this.domainNameConfigurations = props.domainNameConfigurations;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::DomainName', props.tags, { tagPropertyName: 'tags' });
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      domainName: this.domainName,
      domainNameConfigurations: this.domainNameConfigurations,
      tags: this.tags.renderTags(),
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnDomainNameV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnDomainNameV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface DomainNameConfigurationProperty {
    /**
     * `CfnDomainNameV2.DomainNameConfigurationProperty.CertificateArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatearn
     */
    readonly certificateArn?: string;
    /**
     * `CfnDomainNameV2.DomainNameConfigurationProperty.CertificateName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatename
     */
    readonly certificateName?: string;
    /**
     * `CfnDomainNameV2.DomainNameConfigurationProperty.EndpointType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-endpointtype
     */
    readonly endpointType?: string;
  }
}

/**
 * Determine whether the given properties match those of a `DomainNameConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DomainNameConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnDomainNameV2_DomainNameConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator('certificateName', cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator('endpointType', cdk.validateString)(properties.endpointType));
  return errors.wrap('supplied properties not correct for "DomainNameConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName.DomainNameConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DomainNameConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::DomainName.DomainNameConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnDomainNameV2DomainNameConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnDomainNameV2_DomainNameConfigurationPropertyValidator(properties).assertSuccess();
  return {
    CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
    CertificateName: cdk.stringToCloudFormation(properties.certificateName),
    EndpointType: cdk.stringToCloudFormation(properties.endpointType),
  };
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Integration`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnIntegrationV2Props {

  /**
   * `AWS::ApiGatewayV2::Integration.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationtype
   */
  readonly integrationType: string;

  /**
   * `AWS::ApiGatewayV2::Integration.ConnectionType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectiontype
   */
  readonly connectionType?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.ContentHandlingStrategy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-contenthandlingstrategy
   */
  readonly contentHandlingStrategy?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.CredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-credentialsarn
   */
  readonly credentialsArn?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-description
   */
  readonly description?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationMethod`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationmethod
   */
  readonly integrationMethod?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationUri`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationuri
   */
  readonly integrationUri?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.PassthroughBehavior`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-passthroughbehavior
   */
  readonly passthroughBehavior?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.PayloadFormatVersion`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-payloadformatversion
   */
  readonly payloadFormatVersion?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.RequestParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requestparameters
   */
  readonly requestParameters?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Integration.RequestTemplates`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
   */
  readonly requestTemplates?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Integration.TemplateSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-templateselectionexpression
   */
  readonly templateSelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Integration.TimeoutInMillis`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-timeoutinmillis
   */
  readonly timeoutInMillis?: number;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationV2Props`
 *
 * @returns the result of the validation.
 */
function CfnIntegrationV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('connectionType', cdk.validateString)(properties.connectionType));
  errors.collect(cdk.propertyValidator('contentHandlingStrategy', cdk.validateString)(properties.contentHandlingStrategy));
  errors.collect(cdk.propertyValidator('credentialsArn', cdk.validateString)(properties.credentialsArn));
  errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator('integrationMethod', cdk.validateString)(properties.integrationMethod));
  errors.collect(cdk.propertyValidator('integrationType', cdk.requiredValidator)(properties.integrationType));
  errors.collect(cdk.propertyValidator('integrationType', cdk.validateString)(properties.integrationType));
  errors.collect(cdk.propertyValidator('integrationUri', cdk.validateString)(properties.integrationUri));
  errors.collect(cdk.propertyValidator('passthroughBehavior', cdk.validateString)(properties.passthroughBehavior));
  errors.collect(cdk.propertyValidator('payloadFormatVersion', cdk.validateString)(properties.payloadFormatVersion));
  errors.collect(cdk.propertyValidator('requestParameters', cdk.validateObject)(properties.requestParameters));
  errors.collect(cdk.propertyValidator('requestTemplates', cdk.validateObject)(properties.requestTemplates));
  errors.collect(cdk.propertyValidator('templateSelectionExpression', cdk.validateString)(properties.templateSelectionExpression));
  errors.collect(cdk.propertyValidator('timeoutInMillis', cdk.validateNumber)(properties.timeoutInMillis));
  return errors.wrap('supplied properties not correct for "CfnIntegrationV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Integration` resource
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Integration` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnIntegrationV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    IntegrationType: cdk.stringToCloudFormation(properties.integrationType),
    ConnectionType: cdk.stringToCloudFormation(properties.connectionType),
    ContentHandlingStrategy: cdk.stringToCloudFormation(properties.contentHandlingStrategy),
    CredentialsArn: cdk.stringToCloudFormation(properties.credentialsArn),
    Description: cdk.stringToCloudFormation(properties.description),
    IntegrationMethod: cdk.stringToCloudFormation(properties.integrationMethod),
    IntegrationUri: cdk.stringToCloudFormation(properties.integrationUri),
    PassthroughBehavior: cdk.stringToCloudFormation(properties.passthroughBehavior),
    PayloadFormatVersion: cdk.stringToCloudFormation(properties.payloadFormatVersion),
    RequestParameters: cdk.objectToCloudFormation(properties.requestParameters),
    RequestTemplates: cdk.objectToCloudFormation(properties.requestTemplates),
    TemplateSelectionExpression: cdk.stringToCloudFormation(properties.templateSelectionExpression),
    TimeoutInMillis: cdk.numberToCloudFormation(properties.timeoutInMillis),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Integration`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Integration
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnIntegrationV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Integration';

  /**
   * `AWS::ApiGatewayV2::Integration.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationtype
   */
  public integrationType: string;

  /**
   * `AWS::ApiGatewayV2::Integration.ConnectionType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectiontype
   */
  public connectionType: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.ContentHandlingStrategy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-contenthandlingstrategy
   */
  public contentHandlingStrategy: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.CredentialsArn`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-credentialsarn
   */
  public credentialsArn: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-description
   */
  public description: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationMethod`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationmethod
   */
  public integrationMethod: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.IntegrationUri`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationuri
   */
  public integrationUri: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.PassthroughBehavior`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-passthroughbehavior
   */
  public passthroughBehavior: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.PayloadFormatVersion`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-payloadformatversion
   */
  public payloadFormatVersion: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.RequestParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requestparameters
   */
  public requestParameters: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.RequestTemplates`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
   */
  public requestTemplates: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.TemplateSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-templateselectionexpression
   */
  public templateSelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Integration.TimeoutInMillis`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-timeoutinmillis
   */
  public timeoutInMillis: number | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Integration`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnIntegrationV2Props) {
    super(scope, id, { type: CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'integrationType', this);

    this.apiId = props.apiId;
    this.integrationType = props.integrationType;
    this.connectionType = props.connectionType;
    this.contentHandlingStrategy = props.contentHandlingStrategy;
    this.credentialsArn = props.credentialsArn;
    this.description = props.description;
    this.integrationMethod = props.integrationMethod;
    this.integrationUri = props.integrationUri;
    this.passthroughBehavior = props.passthroughBehavior;
    this.payloadFormatVersion = props.payloadFormatVersion;
    this.requestParameters = props.requestParameters;
    this.requestTemplates = props.requestTemplates;
    this.templateSelectionExpression = props.templateSelectionExpression;
    this.timeoutInMillis = props.timeoutInMillis;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      integrationType: this.integrationType,
      connectionType: this.connectionType,
      contentHandlingStrategy: this.contentHandlingStrategy,
      credentialsArn: this.credentialsArn,
      description: this.description,
      integrationMethod: this.integrationMethod,
      integrationUri: this.integrationUri,
      passthroughBehavior: this.passthroughBehavior,
      payloadFormatVersion: this.payloadFormatVersion,
      requestParameters: this.requestParameters,
      requestTemplates: this.requestTemplates,
      templateSelectionExpression: this.templateSelectionExpression,
      timeoutInMillis: this.timeoutInMillis,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnIntegrationV2PropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::IntegrationResponse`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnIntegrationResponseV2Props {

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationid
   */
  readonly integrationId: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationResponseKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationresponsekey
   */
  readonly integrationResponseKey: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ContentHandlingStrategy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-contenthandlingstrategy
   */
  readonly contentHandlingStrategy?: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ResponseParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responseparameters
   */
  readonly responseParameters?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ResponseTemplates`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responsetemplates
   */
  readonly responseTemplates?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.TemplateSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-templateselectionexpression
   */
  readonly templateSelectionExpression?: string;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationResponseV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationResponseV2Props`
 *
 * @returns the result of the validation.
 */
function CfnIntegrationResponseV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('contentHandlingStrategy', cdk.validateString)(properties.contentHandlingStrategy));
  errors.collect(cdk.propertyValidator('integrationId', cdk.requiredValidator)(properties.integrationId));
  errors.collect(cdk.propertyValidator('integrationId', cdk.validateString)(properties.integrationId));
  errors.collect(cdk.propertyValidator('integrationResponseKey', cdk.requiredValidator)(properties.integrationResponseKey));
  errors.collect(cdk.propertyValidator('integrationResponseKey', cdk.validateString)(properties.integrationResponseKey));
  errors.collect(cdk.propertyValidator('responseParameters', cdk.validateObject)(properties.responseParameters));
  errors.collect(cdk.propertyValidator('responseTemplates', cdk.validateObject)(properties.responseTemplates));
  errors.collect(cdk.propertyValidator('templateSelectionExpression', cdk.validateString)(properties.templateSelectionExpression));
  return errors.wrap('supplied properties not correct for "CfnIntegrationResponseV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::IntegrationResponse` resource
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationResponseV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::IntegrationResponse` resource.
 */
// @ts-ignore TS6133
function cfnIntegrationResponseV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnIntegrationResponseV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    IntegrationId: cdk.stringToCloudFormation(properties.integrationId),
    IntegrationResponseKey: cdk.stringToCloudFormation(properties.integrationResponseKey),
    ContentHandlingStrategy: cdk.stringToCloudFormation(properties.contentHandlingStrategy),
    ResponseParameters: cdk.objectToCloudFormation(properties.responseParameters),
    ResponseTemplates: cdk.objectToCloudFormation(properties.responseTemplates),
    TemplateSelectionExpression: cdk.stringToCloudFormation(properties.templateSelectionExpression),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::IntegrationResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::IntegrationResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnIntegrationResponseV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::IntegrationResponse';

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationid
   */
  public integrationId: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationResponseKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationresponsekey
   */
  public integrationResponseKey: string;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ContentHandlingStrategy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-contenthandlingstrategy
   */
  public contentHandlingStrategy: string | undefined;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ResponseParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responseparameters
   */
  public responseParameters: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.ResponseTemplates`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responsetemplates
   */
  public responseTemplates: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::IntegrationResponse.TemplateSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-templateselectionexpression
   */
  public templateSelectionExpression: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::IntegrationResponse`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnIntegrationResponseV2Props) {
    super(scope, id, { type: CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'integrationId', this);
    cdk.requireProperty(props, 'integrationResponseKey', this);

    this.apiId = props.apiId;
    this.integrationId = props.integrationId;
    this.integrationResponseKey = props.integrationResponseKey;
    this.contentHandlingStrategy = props.contentHandlingStrategy;
    this.responseParameters = props.responseParameters;
    this.responseTemplates = props.responseTemplates;
    this.templateSelectionExpression = props.templateSelectionExpression;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      integrationId: this.integrationId,
      integrationResponseKey: this.integrationResponseKey,
      contentHandlingStrategy: this.contentHandlingStrategy,
      responseParameters: this.responseParameters,
      responseTemplates: this.responseTemplates,
      templateSelectionExpression: this.templateSelectionExpression,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnIntegrationResponseV2PropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Model`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnModelV2Props {

  /**
   * `AWS::ApiGatewayV2::Model.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Model.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-name
   */
  readonly name: string;

  /**
   * `AWS::ApiGatewayV2::Model.Schema`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-schema
   */
  readonly schema: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Model.ContentType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-contenttype
   */
  readonly contentType?: string;

  /**
   * `AWS::ApiGatewayV2::Model.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-description
   */
  readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnModelV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnModelV2Props`
 *
 * @returns the result of the validation.
 */
function CfnModelV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator('schema', cdk.requiredValidator)(properties.schema));
  errors.collect(cdk.propertyValidator('schema', cdk.validateObject)(properties.schema));
  return errors.wrap('supplied properties not correct for "CfnModelV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Model` resource
 *
 * @param properties - the TypeScript properties of a `CfnModelV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Model` resource.
 */
// @ts-ignore TS6133
function cfnModelV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnModelV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    Name: cdk.stringToCloudFormation(properties.name),
    Schema: cdk.objectToCloudFormation(properties.schema),
    ContentType: cdk.stringToCloudFormation(properties.contentType),
    Description: cdk.stringToCloudFormation(properties.description),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Model`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Model
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnModelV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Model';

  /**
   * `AWS::ApiGatewayV2::Model.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Model.Name`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-name
   */
  public name: string;

  /**
   * `AWS::ApiGatewayV2::Model.Schema`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-schema
   */
  public schema: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Model.ContentType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-contenttype
   */
  public contentType: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Model.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-description
   */
  public description: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Model`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnModelV2Props) {
    super(scope, id, { type: CfnModelV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'name', this);
    cdk.requireProperty(props, 'schema', this);

    this.apiId = props.apiId;
    this.name = props.name;
    this.schema = props.schema;
    this.contentType = props.contentType;
    this.description = props.description;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnModelV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      name: this.name,
      schema: this.schema,
      contentType: this.contentType,
      description: this.description,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnModelV2PropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Route`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnRouteV2Props {

  /**
   * `AWS::ApiGatewayV2::Route.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Route.RouteKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routekey
   */
  readonly routeKey: string;

  /**
   * `AWS::ApiGatewayV2::Route.ApiKeyRequired`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apikeyrequired
   */
  readonly apiKeyRequired?: boolean | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizationScopes`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationscopes
   */
  readonly authorizationScopes?: string[];

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizationType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype
   */
  readonly authorizationType?: string;

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizerId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizerid
   */
  readonly authorizerId?: string;

  /**
   * `AWS::ApiGatewayV2::Route.ModelSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-modelselectionexpression
   */
  readonly modelSelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Route.OperationName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-operationname
   */
  readonly operationName?: string;

  /**
   * `AWS::ApiGatewayV2::Route.RequestModels`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestmodels
   */
  readonly requestModels?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Route.RequestParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestparameters
   */
  readonly requestParameters?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Route.RouteResponseSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routeresponseselectionexpression
   */
  readonly routeResponseSelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::Route.Target`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-target
   */
  readonly target?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRouteV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnRouteV2Props`
 *
 * @returns the result of the validation.
 */
function CfnRouteV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiKeyRequired', cdk.validateBoolean)(properties.apiKeyRequired));
  errors.collect(cdk.propertyValidator('authorizationScopes', cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator('authorizationType', cdk.validateString)(properties.authorizationType));
  errors.collect(cdk.propertyValidator('authorizerId', cdk.validateString)(properties.authorizerId));
  errors.collect(cdk.propertyValidator('modelSelectionExpression', cdk.validateString)(properties.modelSelectionExpression));
  errors.collect(cdk.propertyValidator('operationName', cdk.validateString)(properties.operationName));
  errors.collect(cdk.propertyValidator('requestModels', cdk.validateObject)(properties.requestModels));
  errors.collect(cdk.propertyValidator('requestParameters', cdk.validateObject)(properties.requestParameters));
  errors.collect(cdk.propertyValidator('routeKey', cdk.requiredValidator)(properties.routeKey));
  errors.collect(cdk.propertyValidator('routeKey', cdk.validateString)(properties.routeKey));
  errors.collect(cdk.propertyValidator('routeResponseSelectionExpression', cdk.validateString)(properties.routeResponseSelectionExpression));
  errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
  return errors.wrap('supplied properties not correct for "CfnRouteV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route` resource.
 */
// @ts-ignore TS6133
function cfnRouteV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnRouteV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    RouteKey: cdk.stringToCloudFormation(properties.routeKey),
    ApiKeyRequired: cdk.booleanToCloudFormation(properties.apiKeyRequired),
    AuthorizationScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    AuthorizationType: cdk.stringToCloudFormation(properties.authorizationType),
    AuthorizerId: cdk.stringToCloudFormation(properties.authorizerId),
    ModelSelectionExpression: cdk.stringToCloudFormation(properties.modelSelectionExpression),
    OperationName: cdk.stringToCloudFormation(properties.operationName),
    RequestModels: cdk.objectToCloudFormation(properties.requestModels),
    RequestParameters: cdk.objectToCloudFormation(properties.requestParameters),
    RouteResponseSelectionExpression: cdk.stringToCloudFormation(properties.routeResponseSelectionExpression),
    Target: cdk.stringToCloudFormation(properties.target),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Route`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Route
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnRouteV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Route';

  /**
   * `AWS::ApiGatewayV2::Route.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Route.RouteKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routekey
   */
  public routeKey: string;

  /**
   * `AWS::ApiGatewayV2::Route.ApiKeyRequired`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apikeyrequired
   */
  public apiKeyRequired: boolean | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizationScopes`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationscopes
   */
  public authorizationScopes: string[] | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizationType`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype
   */
  public authorizationType: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.AuthorizerId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizerid
   */
  public authorizerId: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.ModelSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-modelselectionexpression
   */
  public modelSelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.OperationName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-operationname
   */
  public operationName: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.RequestModels`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestmodels
   */
  public requestModels: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.RequestParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestparameters
   */
  public requestParameters: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.RouteResponseSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routeresponseselectionexpression
   */
  public routeResponseSelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Route.Target`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-target
   */
  public target: string | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::Route`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnRouteV2Props) {
    super(scope, id, { type: CfnRouteV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'routeKey', this);

    this.apiId = props.apiId;
    this.routeKey = props.routeKey;
    this.apiKeyRequired = props.apiKeyRequired;
    this.authorizationScopes = props.authorizationScopes;
    this.authorizationType = props.authorizationType;
    this.authorizerId = props.authorizerId;
    this.modelSelectionExpression = props.modelSelectionExpression;
    this.operationName = props.operationName;
    this.requestModels = props.requestModels;
    this.requestParameters = props.requestParameters;
    this.routeResponseSelectionExpression = props.routeResponseSelectionExpression;
    this.target = props.target;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnRouteV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      routeKey: this.routeKey,
      apiKeyRequired: this.apiKeyRequired,
      authorizationScopes: this.authorizationScopes,
      authorizationType: this.authorizationType,
      authorizerId: this.authorizerId,
      modelSelectionExpression: this.modelSelectionExpression,
      operationName: this.operationName,
      requestModels: this.requestModels,
      requestParameters: this.requestParameters,
      routeResponseSelectionExpression: this.routeResponseSelectionExpression,
      target: this.target,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnRouteV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnRouteV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface ParameterConstraintsProperty {
    /**
     * `CfnRouteV2.ParameterConstraintsProperty.Required`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html#cfn-apigatewayv2-route-parameterconstraints-required
     */
    readonly required: boolean | cdk.IResolvable;
  }
}

/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRouteV2_ParameterConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('required', cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
  return errors.wrap('supplied properties not correct for "ParameterConstraintsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route.ParameterConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Route.ParameterConstraints` resource.
 */
// @ts-ignore TS6133
function cfnRouteV2ParameterConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnRouteV2_ParameterConstraintsPropertyValidator(properties).assertSuccess();
  return {
    Required: cdk.booleanToCloudFormation(properties.required),
  };
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::RouteResponse`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnRouteResponseV2Props {

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.RouteId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeid
   */
  readonly routeId: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.RouteResponseKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeresponsekey
   */
  readonly routeResponseKey: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ModelSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-modelselectionexpression
   */
  readonly modelSelectionExpression?: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ResponseModels`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responsemodels
   */
  readonly responseModels?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ResponseParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responseparameters
   */
  readonly responseParameters?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRouteResponseV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnRouteResponseV2Props`
 *
 * @returns the result of the validation.
 */
function CfnRouteResponseV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('modelSelectionExpression', cdk.validateString)(properties.modelSelectionExpression));
  errors.collect(cdk.propertyValidator('responseModels', cdk.validateObject)(properties.responseModels));
  errors.collect(cdk.propertyValidator('responseParameters', cdk.validateObject)(properties.responseParameters));
  errors.collect(cdk.propertyValidator('routeId', cdk.requiredValidator)(properties.routeId));
  errors.collect(cdk.propertyValidator('routeId', cdk.validateString)(properties.routeId));
  errors.collect(cdk.propertyValidator('routeResponseKey', cdk.requiredValidator)(properties.routeResponseKey));
  errors.collect(cdk.propertyValidator('routeResponseKey', cdk.validateString)(properties.routeResponseKey));
  return errors.wrap('supplied properties not correct for "CfnRouteResponseV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse` resource
 *
 * @param properties - the TypeScript properties of a `CfnRouteResponseV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse` resource.
 */
// @ts-ignore TS6133
function cfnRouteResponseV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnRouteResponseV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    RouteId: cdk.stringToCloudFormation(properties.routeId),
    RouteResponseKey: cdk.stringToCloudFormation(properties.routeResponseKey),
    ModelSelectionExpression: cdk.stringToCloudFormation(properties.modelSelectionExpression),
    ResponseModels: cdk.objectToCloudFormation(properties.responseModels),
    ResponseParameters: cdk.objectToCloudFormation(properties.responseParameters),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::RouteResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::RouteResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnRouteResponseV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::RouteResponse';

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.RouteId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeid
   */
  public routeId: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.RouteResponseKey`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeresponsekey
   */
  public routeResponseKey: string;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ModelSelectionExpression`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-modelselectionexpression
   */
  public modelSelectionExpression: string | undefined;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ResponseModels`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responsemodels
   */
  public responseModels: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::RouteResponse.ResponseParameters`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responseparameters
   */
  public responseParameters: any | cdk.IResolvable | undefined;

  /**
   * Create a new `AWS::ApiGatewayV2::RouteResponse`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnRouteResponseV2Props) {
    super(scope, id, { type: CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'routeId', this);
    cdk.requireProperty(props, 'routeResponseKey', this);

    this.apiId = props.apiId;
    this.routeId = props.routeId;
    this.routeResponseKey = props.routeResponseKey;
    this.modelSelectionExpression = props.modelSelectionExpression;
    this.responseModels = props.responseModels;
    this.responseParameters = props.responseParameters;
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      routeId: this.routeId,
      routeResponseKey: this.routeResponseKey,
      modelSelectionExpression: this.modelSelectionExpression,
      responseModels: this.responseModels,
      responseParameters: this.responseParameters,
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnRouteResponseV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnRouteResponseV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface ParameterConstraintsProperty {
    /**
     * `CfnRouteResponseV2.ParameterConstraintsProperty.Required`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html#cfn-apigatewayv2-routeresponse-parameterconstraints-required
     */
    readonly required: boolean | cdk.IResolvable;
  }
}

/**
 * Determine whether the given properties match those of a `ParameterConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the result of the validation.
 */
function CfnRouteResponseV2_ParameterConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('required', cdk.requiredValidator)(properties.required));
  errors.collect(cdk.propertyValidator('required', cdk.validateBoolean)(properties.required));
  return errors.wrap('supplied properties not correct for "ParameterConstraintsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse.ParameterConstraints` resource
 *
 * @param properties - the TypeScript properties of a `ParameterConstraintsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::RouteResponse.ParameterConstraints` resource.
 */
// @ts-ignore TS6133
function cfnRouteResponseV2ParameterConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnRouteResponseV2_ParameterConstraintsPropertyValidator(properties).assertSuccess();
  return {
    Required: cdk.booleanToCloudFormation(properties.required),
  };
}

/**
 * Properties for defining a `AWS::ApiGatewayV2::Stage`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnStageV2Props {

  /**
   * `AWS::ApiGatewayV2::Stage.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-apiid
   */
  readonly apiId: string;

  /**
   * `AWS::ApiGatewayV2::Stage.StageName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagename
   */
  readonly stageName: string;

  /**
   * `AWS::ApiGatewayV2::Stage.AccessLogSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesslogsettings
   */
  readonly accessLogSettings?: CfnStageV2.AccessLogSettingsProperty | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Stage.AutoDeploy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-autodeploy
   */
  readonly autoDeploy?: boolean | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Stage.ClientCertificateId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-clientcertificateid
   */
  readonly clientCertificateId?: string;

  /**
   * `AWS::ApiGatewayV2::Stage.DefaultRouteSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings
   */
  readonly defaultRouteSettings?: CfnStageV2.RouteSettingsProperty | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Stage.DeploymentId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-deploymentid
   */
  readonly deploymentId?: string;

  /**
   * `AWS::ApiGatewayV2::Stage.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-description
   */
  readonly description?: string;

  /**
   * `AWS::ApiGatewayV2::Stage.RouteSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
   */
  readonly routeSettings?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Stage.StageVariables`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagevariables
   */
  readonly stageVariables?: any | cdk.IResolvable;

  /**
   * `AWS::ApiGatewayV2::Stage.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnStageV2Props`
 *
 * @param properties - the TypeScript properties of a `CfnStageV2Props`
 *
 * @returns the result of the validation.
 */
function CfnStageV2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('accessLogSettings', CfnStageV2_AccessLogSettingsPropertyValidator)(properties.accessLogSettings));
  errors.collect(cdk.propertyValidator('apiId', cdk.requiredValidator)(properties.apiId));
  errors.collect(cdk.propertyValidator('apiId', cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator('autoDeploy', cdk.validateBoolean)(properties.autoDeploy));
  errors.collect(cdk.propertyValidator('clientCertificateId', cdk.validateString)(properties.clientCertificateId));
  errors.collect(cdk.propertyValidator('defaultRouteSettings', CfnStageV2_RouteSettingsPropertyValidator)(properties.defaultRouteSettings));
  errors.collect(cdk.propertyValidator('deploymentId', cdk.validateString)(properties.deploymentId));
  errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator('routeSettings', cdk.validateObject)(properties.routeSettings));
  errors.collect(cdk.propertyValidator('stageName', cdk.requiredValidator)(properties.stageName));
  errors.collect(cdk.propertyValidator('stageName', cdk.validateString)(properties.stageName));
  errors.collect(cdk.propertyValidator('stageVariables', cdk.validateObject)(properties.stageVariables));
  errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
  return errors.wrap('supplied properties not correct for "CfnStageV2Props"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage` resource
 *
 * @param properties - the TypeScript properties of a `CfnStageV2Props`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage` resource.
 */
// @ts-ignore TS6133
function cfnStageV2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnStageV2PropsValidator(properties).assertSuccess();
  return {
    ApiId: cdk.stringToCloudFormation(properties.apiId),
    StageName: cdk.stringToCloudFormation(properties.stageName),
    AccessLogSettings: cfnStageV2AccessLogSettingsPropertyToCloudFormation(properties.accessLogSettings),
    AutoDeploy: cdk.booleanToCloudFormation(properties.autoDeploy),
    ClientCertificateId: cdk.stringToCloudFormation(properties.clientCertificateId),
    DefaultRouteSettings: cfnStageV2RouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
    DeploymentId: cdk.stringToCloudFormation(properties.deploymentId),
    Description: cdk.stringToCloudFormation(properties.description),
    RouteSettings: cdk.objectToCloudFormation(properties.routeSettings),
    StageVariables: cdk.objectToCloudFormation(properties.stageVariables),
    Tags: cdk.objectToCloudFormation(properties.tags),
  };
}

/**
 * A CloudFormation `AWS::ApiGatewayV2::Stage`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Stage
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 * @deprecated moved to package aws-apigatewayv2
 */
export class CfnStageV2 extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME = 'AWS::ApiGatewayV2::Stage';

  /**
   * `AWS::ApiGatewayV2::Stage.ApiId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-apiid
   */
  public apiId: string;

  /**
   * `AWS::ApiGatewayV2::Stage.StageName`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagename
   */
  public stageName: string;

  /**
   * `AWS::ApiGatewayV2::Stage.AccessLogSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesslogsettings
   */
  public accessLogSettings: CfnStageV2.AccessLogSettingsProperty | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.AutoDeploy`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-autodeploy
   */
  public autoDeploy: boolean | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.ClientCertificateId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-clientcertificateid
   */
  public clientCertificateId: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.DefaultRouteSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings
   */
  public defaultRouteSettings: CfnStageV2.RouteSettingsProperty | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.DeploymentId`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-deploymentid
   */
  public deploymentId: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.Description`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-description
   */
  public description: string | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.RouteSettings`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
   */
  public routeSettings: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.StageVariables`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagevariables
   */
  public stageVariables: any | cdk.IResolvable | undefined;

  /**
   * `AWS::ApiGatewayV2::Stage.Tags`
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-tags
   */
  public readonly tags: cdk.TagManager;

  /**
   * Create a new `AWS::ApiGatewayV2::Stage`.
   *
   * @param scope - scope in which this resource is defined
   * @param id    - scoped id of the resource
   * @param props - resource properties
   */
  constructor(scope: Construct, id: string, props: CfnStageV2Props) {
    super(scope, id, { type: CfnStageV2.CFN_RESOURCE_TYPE_NAME, properties: props });
    cdk.requireProperty(props, 'apiId', this);
    cdk.requireProperty(props, 'stageName', this);

    this.apiId = props.apiId;
    this.stageName = props.stageName;
    this.accessLogSettings = props.accessLogSettings;
    this.autoDeploy = props.autoDeploy;
    this.clientCertificateId = props.clientCertificateId;
    this.defaultRouteSettings = props.defaultRouteSettings;
    this.deploymentId = props.deploymentId;
    this.description = props.description;
    this.routeSettings = props.routeSettings;
    this.stageVariables = props.stageVariables;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::ApiGatewayV2::Stage', props.tags, { tagPropertyName: 'tags' });
  }

  /**
   * Examines the CloudFormation resource and discloses attributes.
   *
   * @param inspector - tree inspector to collect and process attributes
   *
   * @stability experimental
   */
  public inspect(inspector: cdk.TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', CfnStageV2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected get cfnProperties(): { [key: string]: any } {
    return {
      apiId: this.apiId,
      stageName: this.stageName,
      accessLogSettings: this.accessLogSettings,
      autoDeploy: this.autoDeploy,
      clientCertificateId: this.clientCertificateId,
      defaultRouteSettings: this.defaultRouteSettings,
      deploymentId: this.deploymentId,
      description: this.description,
      routeSettings: this.routeSettings,
      stageVariables: this.stageVariables,
      tags: this.tags.renderTags(),
    };
  }
  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return cfnStageV2PropsToCloudFormation(props);
  }
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnStageV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface AccessLogSettingsProperty {
    /**
     * `CfnStageV2.AccessLogSettingsProperty.DestinationArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-destinationarn
     */
    readonly destinationArn?: string;
    /**
     * `CfnStageV2.AccessLogSettingsProperty.Format`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-format
     */
    readonly format?: string;
  }
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStageV2_AccessLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('destinationArn', cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator('format', cdk.validateString)(properties.format));
  return errors.wrap('supplied properties not correct for "AccessLogSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.AccessLogSettings` resource
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.AccessLogSettings` resource.
 */
// @ts-ignore TS6133
function cfnStageV2AccessLogSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnStageV2_AccessLogSettingsPropertyValidator(properties).assertSuccess();
  return {
    DestinationArn: cdk.stringToCloudFormation(properties.destinationArn),
    Format: cdk.stringToCloudFormation(properties.format),
  };
}

/**
 * @deprecated moved to package aws-apigatewayv2
 */
export namespace CfnStageV2 {
  /**
   * @stability deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
   * @deprecated moved to package aws-apigatewayv2
   */
  export interface RouteSettingsProperty {
    /**
     * `CfnStageV2.RouteSettingsProperty.DataTraceEnabled`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;
    /**
     * `CfnStageV2.RouteSettingsProperty.DetailedMetricsEnabled`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
     */
    readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
    /**
     * `CfnStageV2.RouteSettingsProperty.LoggingLevel`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
     */
    readonly loggingLevel?: string;
    /**
     * `CfnStageV2.RouteSettingsProperty.ThrottlingBurstLimit`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;
    /**
     * `CfnStageV2.RouteSettingsProperty.ThrottlingRateLimit`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnStageV2_RouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
  const errors = new cdk.ValidationResults();
  errors.collect(cdk.propertyValidator('dataTraceEnabled', cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator('detailedMetricsEnabled', cdk.validateBoolean)(properties.detailedMetricsEnabled));
  errors.collect(cdk.propertyValidator('loggingLevel', cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator('throttlingBurstLimit', cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator('throttlingRateLimit', cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap('supplied properties not correct for "RouteSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.RouteSettings` resource
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ApiGatewayV2::Stage.RouteSettings` resource.
 */
// @ts-ignore TS6133
function cfnStageV2RouteSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) { return properties; }
  CfnStageV2_RouteSettingsPropertyValidator(properties).assertSuccess();
  return {
    DataTraceEnabled: cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    DetailedMetricsEnabled: cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
    LoggingLevel: cdk.stringToCloudFormation(properties.loggingLevel),
    ThrottlingBurstLimit: cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    ThrottlingRateLimit: cdk.numberToCloudFormation(properties.throttlingRateLimit),
  };
}
