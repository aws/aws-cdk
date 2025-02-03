import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

interface EmrSetClusterTerminationProtectionOptions {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * Termination protection indicator.
   */
  readonly terminationProtected: boolean;
}

/**
 * Properties for EmrSetClusterTerminationProtection using JSONPath
 */
export interface EmrSetClusterTerminationProtectionJsonPathProps extends sfn.TaskStateJsonPathBaseProps, EmrSetClusterTerminationProtectionOptions { }

/**
 * Properties for EmrSetClusterTerminationProtection using JSONata
 */
export interface EmrSetClusterTerminationProtectionJsonataProps extends sfn.TaskStateJsonataBaseProps, EmrSetClusterTerminationProtectionOptions { }

/**
 * Properties for EmrSetClusterTerminationProtection
 */
export interface EmrSetClusterTerminationProtectionProps extends sfn.TaskStateBaseProps, EmrSetClusterTerminationProtectionOptions { }

/**
 * A Step Functions Task to to set Termination Protection on an EMR Cluster.
 */
export class EmrSetClusterTerminationProtection extends sfn.TaskStateBase {
  /**
   * A Step Functions Task using JSONPath to set Termination Protection on an EMR Cluster.
   */
  public static jsonPath(scope: Construct, id: string, props: EmrSetClusterTerminationProtectionJsonPathProps) {
    return new EmrSetClusterTerminationProtection(scope, id, props);
  }

  /**
   * A Step Functions Task using JSONata to set Termination Protection on an EMR Cluster.
   */
  public static jsonata(scope: Construct, id: string, props: EmrSetClusterTerminationProtectionJsonataProps) {
    return new EmrSetClusterTerminationProtection(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  constructor(scope: Construct, id: string, private readonly props: EmrSetClusterTerminationProtectionProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['elasticmapreduce:SetTerminationProtection'],
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
      Resource: integrationResourceArn('elasticmapreduce', 'setClusterTerminationProtection',
        sfn.IntegrationPattern.REQUEST_RESPONSE),
      ...this._renderParametersOrArguments({
        ClusterId: this.props.clusterId,
        TerminationProtected: this.props.terminationProtected,
      }, queryLanguage),
    };
  }
}
