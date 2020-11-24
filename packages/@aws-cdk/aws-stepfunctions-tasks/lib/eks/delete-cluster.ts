import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for calling a EKS endpoint with EksCall
 */
export interface EksDeleteClusterProps extends sfn.TaskStateBaseProps {
  /** Name of the cluster */
  readonly name: string;
}

/**
 * Delete a cluster as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
 */
export class EksDeleteCluster extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EksDeleteClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EksDeleteCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'eks',
            resource: 'cluster',
            resourceName: this.props.name,
          }),
        ],
        actions: ['eks:DeleteCluster'],
      }),
    ];
  }

  /**
   * Provides the EKS delete cluster service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('eks', 'deleteCluster', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Name: this.props.name,
      }),
    };
  }
}
