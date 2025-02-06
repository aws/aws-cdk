import * as sfn from '../../../aws-stepfunctions';

/** Http Methods that API Gateway supports */
export enum HttpMethod {
  /** Retrieve data from a server at the specified resource */
  GET = 'GET',

  /** Send data to the API endpoint to create or udpate a resource */
  POST = 'POST',

  /** Send data to the API endpoint to update or create a resource */
  PUT = 'PUT',

  /** Delete the resource at the specified endpoint */
  DELETE = 'DELETE',

  /** Apply partial modifications to the resource */
  PATCH = 'PATCH',

  /** Retrieve data from a server at the specified resource without the response body */
  HEAD = 'HEAD',

  /** Return data describing what other methods and operations the server supports */
  OPTIONS = 'OPTIONS',
}

/**
 * The authentication method used to call the endpoint
 */
export enum AuthType {
  /** Call the API direclty with no authorization method */
  NO_AUTH = 'NO_AUTH',

  /** Use the IAM role associated with the current state machine for authorization */
  IAM_ROLE = 'IAM_ROLE',

  /** Use the resource policy of the API for authorization */
  RESOURCE_POLICY = 'RESOURCE_POLICY',
}

/**
 * Base CallApiGatewayEdnpoint Task Props
 */
export interface CallApiGatewayEndpointBaseOptions {
  /**
   * Http method for the API
   */
  readonly method: HttpMethod;

  /**
   * HTTP request information that does not relate to contents of the request
   * @default - No headers
   */
  readonly headers?: sfn.TaskInput;

  /**
   * Path parameters appended after API endpoint
   * @default - No path
   */
  readonly apiPath?: string;

  /**
   * Query strings attatched to end of request
   * @default - No query parameters
   */
  readonly queryParameters?: sfn.TaskInput;

  /**
   * HTTP Request body
   * @default - No request body
   */
  readonly requestBody?: sfn.TaskInput;

  /**
   * Authentication methods
   * @default AuthType.NO_AUTH
   */
  readonly authType?: AuthType;
}

/**
 * Base CallApiGatewayEndpoint Task Props
 */
export interface CallApiGatewayEndpointJsonPathBaseProps extends sfn.TaskStateJsonPathBaseProps, CallApiGatewayEndpointBaseOptions { }

/**
 * Base CallApiGatewayEndpoint Task Props
 */
export interface CallApiGatewayEndpointJsonataBaseProps extends sfn.TaskStateJsonataBaseProps, CallApiGatewayEndpointBaseOptions { }

/**
 * Base CallApiGatewayEndpoint Task Props
 */
export interface CallApiGatewayEndpointBaseProps extends sfn.TaskStateBaseProps, CallApiGatewayEndpointBaseOptions { }
