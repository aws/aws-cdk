import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import { Runtime } from '../../../aws-lambda/lib/runtime';
import * as cdk from '../../../core';

export class NotificationsResourceHandlerProps {
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
 * Sadly, we can't use aws-cdk-lib/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
export class NotificationsResourceHandler extends Construct {
  /**
   * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
   * resource that provisions bucket notification configuration for a bucket.
   *
   * @returns The ARN of the custom resource lambda function.
   */
  public static singleton(context: Construct, props: NotificationsResourceHandlerProps = {}) {
    const root = cdk.Stack.of(context);

    // well-known logical id to ensure stack singletonity
    const logicalId = 'BucketNotificationsHandler050a0587b7544547bf325f094a3db834';
    let lambda = root.node.tryFindChild(logicalId) as NotificationsResourceHandler;
    if (!lambda) {
      lambda = new NotificationsResourceHandler(root, logicalId, props);
    }

    return lambda;
  }

  /**
   * The ARN of the handler's lambda function. Used as a service token in the
   * custom resource.
   */
  public readonly functionArn: string;

  /**
   * The role of the handler's lambda function.
   */
  public readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props: NotificationsResourceHandlerProps = {}) {
    super(scope, id);

    this.role = props.role ?? new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );

    const resourceType = 'AWS::Lambda::Function';
    class InLineLambda extends cdk.CfnResource {
      public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.STANDARD, resourceType);

      protected renderProperties(properties: any): { [key: string]: any } {
        properties.Tags = cdk.listMapper(cdk.cfnTagToCloudFormation)(this.tags.renderTags());
        delete properties.tags;
        return properties;
      }
    }

    const handlerSource = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'custom-resource-handlers', 'dist', 'aws-s3', 'notifications-resource-handler', 'index.py'), 'utf8');

    // Removing lines that starts with '#' (comment lines)
    const handlerSourceWithoutComments = handlerSource.replace(/^ *#.*\n?/gm, '');

    const resource = new InLineLambda(this, 'Resource', {
      type: resourceType,
      properties: {
        Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        Code: { ZipFile: handlerSourceWithoutComments },
        Handler: 'index.handler',
        Role: this.role.roleArn,
        /**
         * When updating runtime version here do not forget to update it also in:
         *   1. Unit test Dockerfile: https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/custom-resource-handlers/test/aws-s3/notifications-resource-handler/Dockerfile
         *   2. Custom Resource Handler Framework: https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-s3/lib/notifications-resource/notifications-resource-handler.ts
         */
        Runtime: Runtime.determineLatestPythonRuntime(this).name,
        Timeout: 300,
      },
    });
    resource.node.addDependency(this.role);

    this.functionArn = resource.getAtt('Arn').toString();
  }

  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPrincipalPolicy(statement);
  }
}
