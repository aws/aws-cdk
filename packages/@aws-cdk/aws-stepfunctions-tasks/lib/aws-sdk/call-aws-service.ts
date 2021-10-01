import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Properties for CallAwsService Task
 */
export interface CallAwsServiceProps extends sfn.TaskStateBaseProps {
  /**
   * The service to call
   */
  readonly service: string;

  /**
   * The action to call
   */
  readonly action: string;

  /**
   * Parameters for the call
   *
   * @default - no parameters
   */
  readonly parameters?: { [key: string]: any };
}

/**
 * A StepFunctions task to call an AWS service API
 */
 export class CallAwsService extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: CallAwsServiceProps) {
    super(scope, id, props);
  }

  /**
   * @internal
   */
   protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk', `${this.props.service}:${this.props.action}`, this.props.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.props.parameters),
    };
  }
 }
