import cdk = require('@aws-cdk/cdk');
import { CfnModel } from './apigateway.generated';
import { JsonSchema, JsonSchemaMapper } from './json-schema';
import { IRestApi } from './restapi';

export interface ModelImportProps {
  readonly modelId: string;
}

export interface ModelBaseProps {
  /**
   * The content type for the model.
   * Required.
   */
  readonly contentType: string;

  /**
   * The schema to use to transform data to one or more output formats.
   * Specify null ({}) if you don't want to specify a schema.
   * Required.
   * @see http://json-schema.org/
   */
  readonly schema: JsonSchema;

  /**
   * A description that identifies this model.
   * Optional
   * @default None
   */
  readonly description?: string;
}

export interface ModelProps extends ModelBaseProps {
  /**
   * The ID of a REST API with which to associate this model.
   * Required.
   */
  readonly restApi: IRestApi;

  /**
   * A name for the model. If you don't specify a name, AWS CloudFormation
   * generates a unique physical ID and uses that ID for the model name.
   * Optional.
   * @default None
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html
   */
  readonly name?: string;
}

/**
 * Base model interface. Here for common support providing both:
 * 1. A reference to the default Empty and Error models.
 * 2. Extended to support creating/importing models as constructs.
 */
export interface IModelRef {
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
 */
export class EmptyModel implements IModelRef {
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
 */
export class ErrorModel implements IModelRef {
  public readonly modelId = 'Error';
}

/**
 * For defining instances of a model
 */
export interface IModel extends cdk.IConstruct, IModelRef {
  /**
   * Exports a Model resource from this stack.
   * @returns Model props that can be imported to another stack.
   */
  export(): ModelImportProps;
}

 /**
  * Defines an REST API model
  */
export class Model extends cdk.Construct implements IModel {

  /**
   * Returns a reference to the default Empty model.
   */
  public static readonly Empty: IModelRef = new EmptyModel();

  /**
   * Returns a reference to the default Error model.
   */
  public static readonly Error: IModelRef = new ErrorModel();

  /**
   * Import an existing model from another stack
   * @param scope
   * @param id
   * @param props
   */
  public static import(scope: cdk.Construct, id: string, props: ModelImportProps): IModel {
    return new ImportedModel(scope, id, props);
  }

  /**
   * The identifier for this model.
   */
  public readonly modelId: string;

  /**
   * The REST API that this model belongs to.
   */
  public readonly restApi: IRestApi;

  constructor(scope: cdk.Construct, id: string, props: ModelProps) {
    super(scope, id);

    const model = new CfnModel(this, 'Model', {
      restApiId: props.restApi.restApiId,
      contentType: props.contentType,
      schema: JsonSchemaMapper.toCfnJsonSchema(props.schema),
      name: props.name,
      description: props.description,
    });

    this.modelId = model.ref;
    this.restApi = props.restApi;
  }

  /**
   * Exports a Model resource from this stack.
   * @returns Model props that can be imported to another stack.
   */
  public export(): ModelImportProps {
    return {
      modelId: new cdk.CfnOutput(this, 'ModelId', { value: this.modelId }).makeImportValue().toString(),
    };
  }

  /**
   * Generates the formatted reference to this model, so that another model can reference it, in its schema
   */
  public get referenceForSchema(): string {
    return `https://apigateway.${cdk.Aws.urlSuffix}/restapis/${this.restApi.restApiId}/models/${this.modelId}`;
  }
}

/**
 * Defines a reference to a model created outside of the current CloudFormation stack.
 */
class ImportedModel extends cdk.Construct implements IModel {
  public readonly modelId: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ModelImportProps) {
    super(scope, id);

    this.modelId = props.modelId;
  }

  public export() {
    return this.props;
  }
}
