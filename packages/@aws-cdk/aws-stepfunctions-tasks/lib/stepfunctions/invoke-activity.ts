import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';

/**
 * Properties for invoking an Activity worker
 */
export interface StepFunctionsInvokeActivityProps extends sfn.TaskStateBaseProps {

  /**
   * Step Functions Activity to invoke
   */
  readonly activity: sfn.IActivity
}

/**
 * A Step Functions Task to invoke an Activity worker.
 *
 * An Activity can be used directly as a Resource.
 */
export class StepFunctionsInvokeActivity extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  // No IAM permissions necessary, execution role implicitly has Activity permissions.
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: StepFunctionsInvokeActivityProps) {
    super(scope, id, props);

    this.taskMetrics = {
      metricDimensions: { ActivityArn: this.props.activity.activityArn },
      metricPrefixSingular: 'Activity',
      metricPrefixPlural: 'Activities',
    };
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: this.props.activity.activityArn,
    };
  }
}
