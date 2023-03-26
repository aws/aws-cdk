import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
export declare class NotificationsResourceHandlerProps {
    role?: iam.IRole;
}
/**
 * A Lambda-based custom resource handler that provisions S3 bucket
 * notifications for a bucket.
 *
 * The resource property schema is:
 *
 * {
 *   BucketName: string, NotificationConfiguration: { see
 *   PutBucketNotificationConfiguration }
 * }
 *
 * For 'Delete' operations, we send an empty NotificationConfiguration as
 * required. We propagate errors and results as-is.
 *
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
export declare class NotificationsResourceHandler extends Construct {
    /**
     * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
     * resource that provisions bucket notification configuration for a bucket.
     *
     * @returns The ARN of the custom resource lambda function.
     */
    static singleton(context: Construct, props?: NotificationsResourceHandlerProps): NotificationsResourceHandler;
    /**
     * The ARN of the handler's lambda function. Used as a service token in the
     * custom resource.
     */
    readonly functionArn: string;
    /**
     * The role of the handler's lambda function.
     */
    readonly role: iam.IRole;
    constructor(scope: Construct, id: string, props?: NotificationsResourceHandlerProps);
    addToRolePolicy(statement: iam.PolicyStatement): void;
}
