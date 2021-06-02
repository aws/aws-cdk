import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The props for EventBridge Put Event task
 */
export interface EventBridgePutEventProps extends sfn.TaskStateBaseProps {
  /**
   * The put event entries to send to EventBridge
   *
   * Multiple events can be sent in this array to a single eventbus.
   * @see
   * https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEventsRequestEntry.html
   */
  readonly entries: sfn.TaskInput[];
}

/**
 * The EventBridge Put Event task
 */
export class EventBridgePutEvent extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];
  protected readonly taskMetrics: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies: iam.PolicyStatement[] | undefined;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EventBridgePutEventProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EventBridgePutEvent.SUPPORTED_INTEGRATION_PATTERNS);
    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!this.props.entries.some((entry) => sfn.FieldUtils.containsTaskToken(entry))) {
        throw new Error('Task Token is required in `message` Use JsonPath.taskToken to set the token.');
      }
    }

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['events:PutEvents'],
        resources: ['*'],
      }),
    ];
  }

  /**
   * Provides the EventBridge PutEvent service integration task configuration
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('events', 'putEvents', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Entries: this.props.entries.map((v) => v.value),
      }),
    };
  }
}
