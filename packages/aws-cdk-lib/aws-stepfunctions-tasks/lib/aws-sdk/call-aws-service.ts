import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Token } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Properties for calling an AWS service's API action from your
 * state machine.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/supported-services-awssdk.html
 */
export interface CallAwsServiceProps extends sfn.TaskStateBaseProps {
  /**
   * The AWS service to call.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/supported-services-awssdk.html
   */
  readonly service: string;

  /**
   * The API action to call.
   *
   * Use camelCase.
   */
  readonly action: string;

  /**
   * Parameters for the API action call.
   *
   * Use PascalCase for the parameter names.
   *
   * @default - no parameters
   */
  readonly parameters?: { [key: string]: any };

  /**
   * The resources for the IAM statement that will be added to the state
   * machine role's policy to allow the state machine to make the API call.
   *
   * By default the action for this IAM statement will be `service:action`.
   */
  readonly iamResources: string[];

  /**
   * The action for the IAM statement that will be added to the state
   * machine role's policy to allow the state machine to make the API call.
   *
   * Use in the case where the IAM action name does not match with the
   * API service/action name, e.g. `s3:ListBuckets` requires `s3:ListAllMyBuckets`.
   *
   * @default - service:action
   */
  readonly iamAction?: string;

  /**
   * Additional IAM statements that will be added to the state machine
   * role's policy.
   *
   * Use in the case where the call requires more than a single statement to
   * be executed, e.g. `rekognition:detectLabels` requires also S3 permissions
   * to read the object on which it must act.
   *
   * @default - no additional statements are added
   */
  readonly additionalIamStatements?: iam.PolicyStatement[];
}

/**
 * A StepFunctions task to call an AWS service API
 */
export class CallAwsService extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: CallAwsServiceProps) {
    super(scope, id, props);

    if (this.props.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      throw new Error('The RUN_JOB integration pattern is not supported for CallAwsService');
    }
    if (!Token.isUnresolved(this.props.action) && !this.props.action.startsWith(this.props.action[0]?.toLowerCase())) {
      throw new Error(`action must be camelCase, got: ${this.props.action}`);
    }
    if (this.props.parameters) {
      const invalidKeys = Object.keys(this.props.parameters).filter(key => !key.startsWith(key[0]?.toUpperCase()));
      if (invalidKeys.length) {
        throw new Error(`parameter names must be PascalCase, got: ${invalidKeys.join(', ')}`);
      }
    }

    const iamServiceMap: Record<string, string> = {
      cloudwatchlogs: 'logs',
      efs: 'elasticfilesystem',
      elasticloadbalancingv2: 'elasticloadbalancing',
      mediapackagevod: 'mediapackage-vod',
      mwaa: 'airflow',
      sfn: 'states',
    };
    const iamService = iamServiceMap[props.service] ?? props.service;

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: props.iamResources,
        // The prefix and the action name are case insensitive
        // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html
        actions: [props.iamAction ?? `${iamService}:${props.action}`],
      }),
      ...props.additionalIamStatements ?? [],
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    let service = this.props.service;

    if (!Token.isUnresolved(service)) {
      service = service.toLowerCase();
    }

    // The pattern here is: "arn:aws:states:::aws-sdk:serviceName:apiAction.[serviceIntegrationPattern]"
    // See here: https://docs.aws.amazon.com/step-functions/latest/dg/supported-services-awssdk.html
    // This does not change with sdk upgrades, TT:P125388388
    return {
      Resource: integrationResourceArn(
        'aws-sdk',
        `${service}:${this.props.action}`,
        this.props.integrationPattern,
      ),
      Parameters: sfn.FieldUtils.renderObject(this.props.parameters) ?? {}, // Parameters is required for aws-sdk
    };
  }
}
