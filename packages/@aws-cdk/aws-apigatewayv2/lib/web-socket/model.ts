import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnModel } from '../apigatewayv2.generated';
import { JsonSchema, JsonSchemaMapper } from '../common/json-schema';
import { IWebSocketApi } from './api';

/**
 * Defines a set of common model patterns known to the system
 */
export enum WebSocketKnownModelKey {
  /**
   * Default model, when no other pattern matches
   */
  DEFAULT = '$default',

  /**
   * Default model, when no other pattern matches
   */
  EMPTY = ''
}

/**
 * Defines a set of common content types for APIs
 */
export enum WebSocketKnownContentTypes {
  /**
   * JSON request or response (default)
   */
  JSON = 'application/json',
  /**
   * XML request or response
   */
  XML = 'application/xml',
  /**
   * Pnain text request or response
   */
  TEXT = 'text/plain',
  /**
   * URL encoded web form
   */
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
  /**
   * Data from a web form
   */
  FORM_DATA = 'multipart/form-data'
}

/**
 * Defines the attributes for an Api Gateway V2 Model.
 */
export interface WebSocketModelAttributes {
  /**
   * The ID of this API Gateway Model.
   */
  readonly modelId: string;

  /**
   * The name of this API Gateway Model.
   */
  readonly modelName: string;
}

/**
 * Defines the contract for an Api Gateway V2 Model.
 */
export interface IWebSocketModel extends IResource {
  /**
   * The ID of this API Gateway Model.
   * @attribute
   */
  readonly modelId: string;

  /**
   * The name of this API Gateway Model.
   * @attribute
   */
  readonly modelName: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Model.
 *
 * This interface is used by the helper methods in `Api`
 */
export interface WebSocketModelOptions {
  /**
   * The content-type for the model, for example, `application/json`.
   *
   * @default "application/json"
   */
  readonly contentType?: string;

  /**
   * The name of the model.
   *
   * @default - the physical id of the model
   */
  readonly modelName?: string;

  /**
   * The description of the model.
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Model.
 */
export interface WebSocketModelProps extends WebSocketModelOptions {
  /**
   * Defines the api for this response.
   */
  readonly api: IWebSocketApi;

  /**
   * The schema for the model. For `application/json` models, this should be JSON schema draft 4 model.
   */
  readonly schema: JsonSchema;
}

/**
 * A model for an API in Amazon API Gateway v2.
 *
 * @resource AWS::ApiGatewayV2::Model
 */
export class WebSocketModel extends Resource implements IWebSocketModel {
  /**
   * Creates a new imported Model
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param attrs attributes of the API Model
   */
  public static fromModelAttributes(scope: Construct, id: string, attrs: WebSocketModelAttributes): IWebSocketModel {
    class Import extends Resource implements IWebSocketModel {
      public readonly modelId = attrs.modelId;
      public readonly modelName = attrs.modelName;
    }

    return new Import(scope, id);
  }

  public readonly modelId: string;
  public readonly modelName: string;
  protected resource: CfnModel;

  constructor(scope: Construct, id: string, props: WebSocketModelProps) {
    super(scope, id, {
      physicalName: props.modelName || id,
    });

    this.modelName = this.physicalName;
    this.resource = new CfnModel(this, 'Resource', {
      contentType: props.contentType || WebSocketKnownContentTypes.JSON,
      apiId: props.api.webSocketApiId,
      name: this.modelName,
      schema: JsonSchemaMapper.toCfnJsonSchema(props.schema),
    });
    this.modelId = this.resource.ref;
  }
}