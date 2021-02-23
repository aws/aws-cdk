import { IResource } from '@aws-cdk/core';

/**
 * Represents an integration to an API Route.
 */
export interface IIntegration extends IResource {
  /**
   * Id of the integration.
   * @attribute
   */
  readonly integrationId: string;
}

/**
 * AWS service integration sub types
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html
 */
export enum AwsServiceIntegrationSubtype {
  EVENT_BRIDGE_PUT_EVENTS = 'EventBridge-PutEvents'
  // AppConfig-GetConfiguration
  // Kinesis-PutRecord
  // SQS-DeleteMessage
  // SQS-PurgeQueue
  // SQS-ReceiveMessage
  // SQS-SendMessage
  // StepFunctions-StartExecution
  // StepFunctions-StartSyncExecution
  // StepFunctions-StopExecution
}

/**
 * Integration request parameters for EventBridge
 * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEventsRequestEntry.html#eventbridge-Type-PutEventsRequestEntry-Detail
 */
export interface EventBridgeIntegrationRequestParameters {
  /**
  * A valid JSON string. There is no other schema imposed. The JSON string may contain fields and nested subobjects.
  *
  * @default none
  */
  readonly detail?: string;

  /**
  * Free-form string used to decide what fields to expect in the event detail.
  *
  * @default none
  */
  readonly detailType?: string;

  /**
  * The name or ARN of the event bus to receive the event. Only the rules that are associated with this event bus are
  * used to match the event. If you omit this, the default event bus is used.
  *
  * @default none
  */
  readonly eventBusName?: string;

  /**
  * The AWS region. NB: Particular to EventBridge-PutEvents API Gateway integration and not EventBridge's PutEvents API.
  *
  * @default none
  */
  readonly region?: string;

  /**
  * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number,
  * including zero, may be present.
  *
  * @default none
  */
  readonly resources?: string[];

  /**
  * The source of the event.
  *
  * @default none
  */
  readonly source?: string;

  /**
  * The time stamp of the event, per RFC3339. If no time stamp is provided, the time stamp of the PutEvents call is
  * used.
  *
  * @default none
  */
  readonly time?: string;
}
