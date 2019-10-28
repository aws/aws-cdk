// this is a type definition file that exports ambiant types that can be used
// to implement async custom resource handler and enjoy the comfort of type safety.

/**
 * these types can be accessed without needing to `import` the module.
 * e.g. `AWSCDKAsyncCustomResource.OnEventRequest`
 */ 
export as namespace AWSCDKAsyncCustomResource;

/**
 * Signature for the `onEvent` handler, which is called when a lifecycle event occurs.
 */
export type OnEventHandler = (event: OnEventRequest) => Promise<OnEventResponse | undefined>;

/**
 * Signature for the `isComplete` handler, which is called to detemrine if the
 * event handling is complete. As long as this method returns `IsComplete:
 * false`, the handler will be called (based on the rety policy defined by the
 * provider) until a timeout occurs, an error is thrown or until it returns
 * `true`.
 */
export type IsCompleteHandler = (event: IsCompleteRequest) => Promise<IsCompleteResponse>;

/**
 * The object passed to the user-defined `onEvent` handler.
 */
export interface OnEventRequest extends AWSLambda.CloudFormationCustomResourceEventCommon {
  /**
   * The request type is set by the AWS CloudFormation stack operation
   * (create-stack, update-stack, or delete-stack) that was initiated by the
   * template developer for the stack that contains the custom resource.
   */
  readonly RequestType: 'Create' | 'Update' | 'Delete';

  /**
   * Used only for Update requests. Contains the resource properties that were
   * declared previous to the update request.
   */
  readonly OldResourceProperties?: { [key: string]: any };

  /**
   * A required custom resource provider-defined physical ID that is unique for
   * that provider.
   *
   * Always sent with 'Update' and 'Delete' requests; never sent with 'Create'.
   */
  readonly PhysicalResourceId?: string;
}

/**
 * The object returned from the user-defined `onEvent` handler.
 */
export interface OnEventResponse {
  /**
   * A required custom resource provider-defined physical ID that is unique for
   * that provider.
   *
   * - For `Create`, this must be returned. For `Update`, this value is
   *   optional.
   * - If `onEvent` returns a different value from the current physical ID, it
   *   means the resource is going to be replaced. 
   * - For `Delete`, this value is optional, and `onEvent` is not allowed to
   *   return a value that is different from the current ID.
   */
  readonly PhysicalResourceId?: string;

  /**
   * Resource attributes to return.
   */
  readonly Data?: { [name: string]: any };
}

/**
 * The input to the `isComplete` user defined handler.
 */
export type IsCompleteRequest = OnEventRequest & OnEventResponse;

/**
 * The output of the `isComplete` user-defined handler.
 */
export interface IsCompleteResponse {
  /**
   * Indicates if the resource operation is complete or should we retry.
   */
  readonly IsComplete: boolean;

  /**
   * Additional/changes to resource attributes. This hash will be merged with the one returned from `OnEventResponse`.
   */
  readonly Data?: { [name: string]: any };
}
