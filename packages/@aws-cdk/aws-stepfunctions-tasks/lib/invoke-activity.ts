import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration } from '@aws-cdk/core';

/**
 * Properties for FunctionTask
 * @deprecated use `StepFunctionsInvokeActivity` and `StepFunctionsInvokeActivityProps`.
 */
export interface InvokeActivityProps {
  /**
   * Maximum time between heart beats
   *
   * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
   *
   * @default No heart beat timeout
   */
  readonly heartbeat?: Duration;
}

/**
 * A Step Functions Task to invoke an Activity worker.
 *
 * An Activity can be used directly as a Resource.
 *
 * @deprecated use `StepFunctionsInvokeActivity`
 */
export class InvokeActivity implements sfn.IStepFunctionsTask {
  constructor(private readonly activity: sfn.IActivity, private readonly props: InvokeActivityProps = {}) {
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: this.activity.activityArn,
      metricDimensions: { ActivityArn: this.activity.activityArn },
      heartbeat: this.props.heartbeat,
      // No IAM permissions necessary, execution role implicitly has Activity permissions.
      metricPrefixSingular: 'Activity',
      metricPrefixPlural: 'Activities',
    };
  }
}
