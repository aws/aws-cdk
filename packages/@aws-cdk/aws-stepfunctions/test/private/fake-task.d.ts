import * as iam from '@aws-cdk/aws-iam';
import * as constructs from 'constructs';
import * as sfn from '../../lib';
export interface FakeTaskProps extends sfn.TaskStateBaseProps {
    readonly metrics?: sfn.TaskMetricsConfig;
}
export declare class FakeTask extends sfn.TaskStateBase {
    protected readonly taskMetrics?: sfn.TaskMetricsConfig;
    protected readonly taskPolicies?: iam.PolicyStatement[];
    constructor(scope: constructs.Construct, id: string, props?: FakeTaskProps);
    /**
       * @internal
       */
    protected _renderTask(): any;
}
