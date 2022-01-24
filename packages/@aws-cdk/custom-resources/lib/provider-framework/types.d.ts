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
interface OnEventResponse {
  /**
   * A required custom resource provider-defined physical ID that is unique for
   * that provider.
   *
   * In order to reduce the chance for mistakes, all event types MUST return
   * with `PhysicalResourceId`.
   *
   * - For `Create`, this will be the user-defined or generated physical
   *   resource ID.
   * - For `Update`, if the returned PhysicalResourceId is different value from
   *   the current one, it means that the old physical resource needs to be
   *   deleted, and CloudFormation will immediately send a `Delete` event with
   *   the old physical ID.
   * - For `Delete`, this must be the same value received in the event.
   *
   * @default - for "Create" requests, defaults to the event's RequestId, for
   * "Update" and "Delete", defaults to the current `PhysicalResourceId`.
   */
  readonly PhysicalResourceId?: string;

  /**
   * Resource attributes to return.
   */
  readonly Data?: { [name: string]: any };

  /**
   * Custom fields returned from OnEvent will be passed to IsComplete.
   */
  readonly [key: string]: any;

  /**
   * Whether to mask the output of the custom resource when retrieved
   * by using the `Fn::GetAtt` function. If set to `true`, all returned
   * values are masked with asterisks (*****).
   *
   * @default false
   */
  readonly NoEcho?: boolean;
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
   * If present, overrides the PhysicalResourceId of OnEventResponse with the PhysicalResourceId of IsCompleteResponse.
   */
  readonly PhysicalResourceId?: string;

  /**
   * Additional/changes to resource attributes. This hash will be merged with the one returned from `OnEventResponse`.
   */
  readonly Data?: { [name: string]: any };
}
