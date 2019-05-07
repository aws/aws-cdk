import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Properties for FunctionTask
 */
export interface InvokeActivityProps {
  /**
   * Maximum time between heart beats
   *
   * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
   *
   * @default No heart beat timeout
   */
  readonly heartbeatSeconds?: number;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeActivity implements sfn.IStepFunctionsTask {
  public readonly resourceArn: string;
  public readonly policyStatements?: iam.PolicyStatement[] | undefined;
  public readonly metricDimensions?: cloudwatch.DimensionHash | undefined;
  public readonly metricPrefixSingular?: string = 'Activity';
  public readonly metricPrefixPlural?: string = 'Activities';

  public readonly heartbeatSeconds?: number | undefined;
  public readonly parameters?: { [name: string]: any; } | undefined;

  constructor(activity: sfn.IActivity, props: InvokeActivityProps = {}) {
    this.resourceArn = activity.activityArn;
    this.metricDimensions = { ActivityArn: activity.activityArn };
    this.heartbeatSeconds = props.heartbeatSeconds;

    // No IAM permissions necessary, execution role implicitly has Activity permissions.
  }
}
