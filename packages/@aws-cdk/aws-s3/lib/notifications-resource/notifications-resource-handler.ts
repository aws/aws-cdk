import * as fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

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
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
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
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:PutBucketNotification'],
      resources: ['*'],
    }));

    const resourceType = 'AWS::Lambda::Function';
    class InLineLambda extends cdk.CfnResource {
      public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.STANDARD, resourceType);

      protected renderProperties(properties: any): { [key: string]: any } {
        properties.Tags = cdk.listMapper(cdk.cfnTagToCloudFormation)(this.tags.renderTags());
        delete properties.tags;
        return properties;
      }
    }

    const handlerSource = fs.readFileSync(path.join(__dirname, 'lambda/index.py'), 'utf8');

    // Removing lines that starts with '#' (comment lines) in order to fit the 4096 limit
    const handlerSourceWithoutComments = handlerSource.replace(/^ *#.*\n?/gm, '');

    if (handlerSourceWithoutComments.length > 4096) {
      throw new Error(`Source of Notifications Resource Handler is too large (${handlerSourceWithoutComments.length} > 4096)`);
    }

    const resource = new InLineLambda(this, 'Resource', {
      type: resourceType,
      properties: {
        Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        Code: { ZipFile: handlerSourceWithoutComments },
        Handler: 'index.handler',
        Role: this.role.roleArn,
        Runtime: 'python3.9',
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
