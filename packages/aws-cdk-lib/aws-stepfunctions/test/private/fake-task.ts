import * as constructs from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../lib';

export interface FakeTaskProps extends sfn.TaskStateBaseProps {
  readonly metrics?: sfn.TaskMetricsConfig;
  readonly queryLanguage?: sfn.QueryLanguage;
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
    const param = {
      MyParameter: 'myParameter',
    };
    if (this.queryLanguage === sfn.QueryLanguage.JSONATA) {
      return {
        Resource: 'my-resource',
        Arguments: param,
      };
    }
    return {
      Resource: 'my-resource',
      Parameters: sfn.FieldUtils.renderObject(param),
    };
  }
}
