import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
export declare class FakeNotificationTarget implements autoscaling.ILifecycleHookTarget {
    private readonly topic;
    constructor(topic: sns.ITopic);
    private createRole;
    bind(_scope: constructs.Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig;
}
export declare class TestStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps);
}
