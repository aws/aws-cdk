export interface IModel {
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
 */
export class ErrorModel implements IModel {
    public readonly modelId = 'Error';
}

// TODO: Implement Model, enabling management of custom models.