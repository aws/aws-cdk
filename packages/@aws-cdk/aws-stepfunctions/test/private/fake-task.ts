import * as iam from '@aws-cdk/aws-iam';
import * as constructs from 'constructs';
import * as sfn from '../../lib';

export interface FakeTaskProps extends sfn.TaskStateBaseProps {
  readonly metrics?: sfn.TaskMetricsConfig;
}

export class FakeTask extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: constructs.Construct, id: string, props: FakeTaskProps = {}) {
    super(scope, id, props);
    this.taskMetrics = props.metrics;
  }

  /**
     * @internal
     */
  protected _renderTask(): any {
    return {
      Resource: 'my-resource',
      Parameters: sfn.FieldUtils.renderObject({
        MyParameter: 'myParameter',
      }),
    };
  }
}
