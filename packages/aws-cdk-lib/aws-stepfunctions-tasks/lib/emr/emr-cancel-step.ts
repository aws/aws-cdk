import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

interface EmrCancelStepOptions {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * The StepId to cancel.
   */
  readonly stepId: string;
}

/**
 * Properties for calling an EMR CancelStep using JSONPath from your
 * state machine.
 */
export interface EmrCancelStepJsonPathProps extends sfn.TaskStateJsonPathBaseProps, EmrCancelStepOptions { }

/**
 * Properties for calling an EMR CancelStep using JSONata from your
 * state machine.
 */
export interface EmrCancelStepJsonataProps extends sfn.TaskStateJsonataBaseProps, EmrCancelStepOptions { }

/**
 * Properties for calling an EMR CancelStep from your
 * state machine.
 */
export interface EmrCancelStepProps extends sfn.TaskStateBaseProps, EmrCancelStepOptions { }

/**
 * A Step Functions task to cancel a Step on an EMR Cluster.
 *
 */
export class EmrCancelStep extends sfn.TaskStateBase {
  /**
   * A Step Functions task using JSONPath to cancel a Step on an EMR Cluster.
   *
   */
  public static jsonPath(scope: Construct, id: string, props: EmrCancelStepJsonPathProps) {
    return new EmrCancelStep(scope, id, props);
  }
  /**
   * A Step Functions task using JSONata to cancel a Step on an EMR Cluster.
   *
   */
  public static jsonata(scope: Construct, id: string, props: EmrCancelStepJsonataProps) {
    return new EmrCancelStep(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  constructor(scope: Construct, id: string, private readonly props: EmrCancelStepProps) {
    super(scope, id, props);
    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['elasticmapreduce:CancelSteps'],
        resources: [
          Stack.of(this).formatArn({
            service: 'elasticmapreduce',
            resource: 'cluster',
            resourceName: '*',
          }),
        ],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'cancelStep', sfn.IntegrationPattern.REQUEST_RESPONSE),
      ...this._renderParametersOrArguments({
        ClusterId: this.props.clusterId,
        StepId: this.props.stepId,
      }, queryLanguage),
    };
  }
}
