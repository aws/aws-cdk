import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
/**
 * Use a Lambda Function as a hook target
 *
 * Internally creates a Topic to make the connection.
 */
export declare class FunctionHook implements autoscaling.ILifecycleHookTarget {
    private readonly fn;
    private readonly encryptionKey?;
    /**
     * @param fn Function to invoke in response to a lifecycle event
     * @param encryptionKey If provided, this key is used to encrypt the contents of the SNS topic.
     */
    constructor(fn: lambda.IFunction, encryptionKey?: kms.IKey | undefined);
    /**
     * If the `IRole` does not exist in `options`, will create an `IRole` and an SNS Topic and attach both to the lifecycle hook.
     * If the `IRole` does exist in `options`, will only create an SNS Topic and attach it to the lifecycle hook.
     */
    bind(_scope: Construct, options: autoscaling.BindHookTargetOptions): autoscaling.LifecycleHookTargetConfig;
}
