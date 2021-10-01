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

  /**
   * The resources for the IAM statement
   */
  readonly iamResources: string[];

  /**
   * The name of the action for the IAM statement
   *
   * @default - service:action
   */
  readonly iamAction?: string;
}

/**
 * A StepFunctions task to call an AWS service API
 */
export class CallAwsService extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: CallAwsServiceProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: props.iamResources,
        actions: [props.iamAction ?? `${props.service}:${props.action}`],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn(
        'aws-sdk',
        `${this.props.service.toLowerCase()}:${this.props.action}`,
        this.props.integrationPattern,
      ),
      Parameters: sfn.FieldUtils.renderObject(this.props.parameters ?? {}), // Parameters is required for aws-sdk
    };
  }
}
