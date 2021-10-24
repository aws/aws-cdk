import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnModel, CfnModelProps } from './apigateway.generated';
import * as jsonSchema from './json-schema';
import { IRestApi, RestApi } from './restapi';
import * as util from './util';

export interface IModel {
  /**
   * Returns the model name, such as 'myModel'
   *
   * @attribute
   */
  readonly modelId: string;
}

/**
 * Represents a reference to a REST API's Empty model, which is available
 * as part of the model collection by default. This can be used for mapping
 * JSON responses from an integration to what is returned to a client,
 * where strong typing is not required. In the absence of any defined
 * model, the Empty model will be used to return the response payload
 * unmapped.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Empty Schema",
 *   "type" : "object"
 * }
 *
 * @see https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/models-mappings.html#models-mappings-models
 * @deprecated You should use Model.EMPTY_MODEL
 */
export class EmptyModel implements IModel {
  public readonly modelId = 'Empty';
}

/**
 * Represents a reference to a REST API's Error model, which is available
 * as part of the model collection by default. This can be used for mapping
 * error JSON responses from an integration to a client, where a simple
 * generic message field is sufficient to map and return an error payload.
 *
 * Definition
 * {
 *   "$schema" : "http://json-schema.org/draft-04/schema#",
 *   "title" : "Error Schema",
 *   "type" : "object",
 *   "properties" : {
 *     "message" : { "type" : "string" }
 *   }
 * }
 * @deprecated You should use Model.ERROR_MODEL
 */
export class ErrorModel implements IModel {
  public readonly modelId = 'Error';
}

export interface ModelOptions {
  /**
   * The content type for the model. You can also force a
   * content type in the request or response model mapping.
   *
   * @default 'application/json'
   */
  readonly contentType?: string;

  /**
   * A description that identifies this model.
   * @default None
   */
  readonly description?: string;

  /**
   * A name for the model.
   *
   * Important
   *  If you specify a name, you cannot perform updates that
   *  require replacement of this resource. You can perform
   *  updates that require no or some interruption. If you
   *  must replace the resource, specify a new name.
   *
   * @default <auto> If you don't specify a name,
   *  AWS CloudFormation generates a unique physical ID and
   *  uses that ID for the model name. For more information,
   *  see Name Type.
   */
  readonly modelName?: string;

  /**
   * The schema to use to transform data to one or more output formats.
   * Specify null ({}) if you don't want to specify a schema.
   */
  readonly schema: jsonSchema.JsonSchema;
}

export interface ModelProps extends ModelOptions {
  /**
   * The rest API that this model is part of.
   *
   * The reason we need the RestApi object itself and not just the ID is because the model
   * is being tracked by the top-level RestApi object for the purpose of calculating it's
   * hash to determine the ID of the deployment. This allows us to automatically update
   * the deployment when the model of the REST API changes.
   */
  readonly restApi: IRestApi;
}

export class Model extends Resource implements IModel {
  /**
   * Represents a reference to a REST API's Error model, which is available
   * as part of the model collection by default. This can be used for mapping
   * error JSON responses from an integration to a client, where a simple
   * generic message field is sufficient to map and return an error payload.
   *
   * Definition
   * {
   *   "$schema" : "http://json-schema.org/draft-04/schema#",
   *   "title" : "Error Schema",
   *   "type" : "object",
   *   "properties" : {
   *     "message" : { "type" : "string" }
   *   }
   * }
   */
  public static readonly ERROR_MODEL: IModel = new ErrorModel();

  /**
   * Represents a reference to a REST API's Empty model, which is available
   * as part of the model collection by default. This can be used for mapping
   * JSON responses from an integration to what is returned to a client,
   * where strong typing is not required. In the absence of any defined
   * model, the Empty model will be used to return the response payload
   * unmapped.
   *
   * Definition
   * {
   *   "$schema" : "http://json-schema.org/draft-04/schema#",
   *   "title" : "Empty Schema",
   *   "type" : "object"
   * }
   *
   * @see https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/models-mappings.html#models-mappings-models
   */
  public static readonly EMPTY_MODEL: IModel = new EmptyModel();

  public static fromModelName(scope: Construct, id: string, modelName: string): IModel {
    class Import extends Resource implements IModel {
      public readonly modelId = modelName;
    }

    return new Import(scope, id);
  }

  /**
   * Returns the model name, such as 'myModel'
   *
   * @attribute
   */
  public readonly modelId: string;

  constructor(scope: Construct, id: string, props: ModelProps) {
    super(scope, id, {
      physicalName: props.modelName,
    });

    const modelProps: CfnModelProps = {
      name: this.physicalName,
      restApiId: props.restApi.restApiId,
      contentType: props.contentType ?? 'application/json',
      description: props.description,
      schema: util.JsonSchemaMapper.toCfnJsonSchema(props.schema),
    };

    const resource = new CfnModel(this, 'Resource', modelProps);

    this.modelId = this.getResourceNameAttribute(resource.ref);

    const deployment = (props.restApi instanceof RestApi) ? props.restApi.latestDeployment : undefined;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({ model: modelProps });
    }
  }
}
