import * as iam from '@aws-cdk/aws-iam';
import * as constructs from 'constructs';
import * as sfn from '../lib';
export interface FakeTaskProps extends sfn.TaskStateBaseProps {
    parameters?: {
        [key: string]: string;
    };
}
/**
 * Task extending sfn.TaskStateBase to facilitate integ testing setting credentials
 */
export declare class FakeTask extends sfn.TaskStateBase {
    protected readonly taskMetrics?: sfn.TaskMetricsConfig;
    protected readonly taskPolicies?: iam.PolicyStatement[];
    protected readonly parameters?: {
        [key: string]: string;
    };
    constructor(scope: constructs.Construct, id: string, props?: FakeTaskProps);
    protected _renderTask(): any;
}
