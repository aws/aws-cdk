import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * An entry to be sent to EventBridge
 * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEventsRequestEntry.html
 */
export interface IEventBridgePutEventsEntry {
  /**
   * JSON object that contains information about the event
   * The service generating the event determines the content of this field
   * Consists of a valid JSON string which can contain nested subobjects
   * i.e. "{ \"instance-id\": \" i-1234567890abcdef0\", \"state\": \"terminated\" }"
   */
  readonly detail?: sfn.TaskInput;

  /**
   * Along with the source field help identify fields and values of detail field
   * i.e. Events by CloudTrail have a "detail-type": "AWS API Call via CloudTrail",
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html
   */
  readonly detailType?: string;

  /**
   * The event bus the entry will be sent to.
   * @default Send event to account's default event bus
   */
  readonly eventBus?: events.IEventBus;

  /**
   * JSON array containing ARNs of resources used in the event
   * i.e. Auto Scaling events include ARNs for both instances and Auto Scaling groups
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html
   * @default empty If the event does not include resource ARNs
   */
  readonly resources?: string[];

  /**
   * The service that generated the event
   * i.e aws.cloudfront
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html
   */
  readonly source?: string;

  /**
   * The timestamp of the event for the entry in ISO 8601 date format
   * If there is no timestamp, timestamp of the PutEvents call
   * i.e. 2016-08-12T15:15:01.100001Z
   * @default Event's entry time in ISO 8601 format
   */
  readonly timestamp?: number;
}

/**
 * Properties for sending events with PutEvents
 */
export interface EventBridgePutEventsProps extends sfn.TaskStateBaseProps {
  /**
   * The entries that will be sent (must be at least 1)
   */
  readonly entries: IEventBridgePutEventsEntry[];
}

/**
 * A StepFunctions Task to send events to an EventBridge event bus
 */
export class EventBridgePutEvents extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EventBridgePutEventsProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EventBridgePutEvents.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(props.entries)) {
        throw new Error('Task Token is required in `entries`. Use JsonPath.taskToken to set the token.');
      }
    }

    this.validateEntries();

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['events:PutEvents'],
        resources: this.eventBusArns,
      }),
    ];
  }

  /**
   * Returns an array of EventBusArn strings based on this.props.entries
   */
  get eventBusArns(): string[] {
    return this.props.entries
      .map(entry => {
        if (entry.eventBus) {
          // If an eventBus is provided, use the corresponding ARN
          return entry.eventBus.eventBusArn;
        } else {
          // If neither an eventBus nor eventBusName is provided,
          // format the ARN for the default event bus in the account.
          return cdk.Stack.of(this).formatArn({
            resource: 'event-bus',
            resourceName: 'default',
            sep: '/',
            service: 'events',
          });
        }
      });
  }

  /**
   * Provides the EventBridge put events service integration task configuration
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('events', 'putEvents', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Entries: this.getEntries(),
      }),
    };
  }

  private getEntries(): Object[] {
    return this.props.entries.map(entry => {
      return {
        Detail: entry.detail?.value,
        DetailType: entry.detailType,
        EventBusName: entry.eventBus?.eventBusArn,
        Resources: entry.resources,
        Source: entry.source,
        Time: entry.timestamp,
      };
    });
  }

  private validateEntries(): void {
    if (this.props.entries.length <= 0) {
      throw new Error('Value for property `entries` must be a non-empty array.');
    }
  }
}