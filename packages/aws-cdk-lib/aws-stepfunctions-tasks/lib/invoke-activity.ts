import type * as sfn from '../../aws-stepfunctions';
import type { Duration } from '../../core';
import type { IActivityRef } from '../../interfaces/generated/aws-stepfunctions-interfaces.generated';

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
  constructor(private readonly activity: IActivityRef, private readonly props: InvokeActivityProps = {}) {
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: this.activity.activityRef.activityArn,
      metricDimensions: { ActivityArn: this.activity.activityRef.activityArn },
      heartbeat: this.props.heartbeat,
      // No IAM permissions necessary, execution role implicitly has Activity permissions.
      metricPrefixSingular: 'Activity',
      metricPrefixPlural: 'Activities',
    };
  }
}
