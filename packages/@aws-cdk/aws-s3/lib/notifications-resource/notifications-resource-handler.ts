import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

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
export class NotificationsResourceHandler extends cdk.Construct {
  /**
   * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
   * resource that provisions bucket notification configuration for a bucket.
   *
   * @returns The ARN of the custom resource lambda function.
   */
  public static singleton(context: cdk.Construct) {
    const root = cdk.Stack.of(context);

    // well-known logical id to ensure stack singletonity
    const logicalId = 'BucketNotificationsHandler050a0587b7544547bf325f094a3db834';
    let lambda = root.node.tryFindChild(logicalId) as NotificationsResourceHandler;
    if (!lambda) {
      lambda = new NotificationsResourceHandler(root, logicalId);
    }

    return lambda.functionArn;
  }

  /**
   * The ARN of the handler's lambda function. Used as a service token in the
   * custom resource.
   */
  public readonly functionArn: string;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // handler allowed to get existing bucket notification configuration and put bucket notification on s3 buckets.
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutBucketNotification', 's3:GetBucketNotification'],
      resources: ['*'],
    }));

    const resourceType = 'AWS::Lambda::Function';
    class InLineLambda extends cdk.CfnResource {
      public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.STANDARD, resourceType);

      protected renderProperties(properties: any): { [key: string]: any } {
        properties.Tags = cdk.listMapper(
          cdk.cfnTagToCloudFormation)(this.tags.renderTags());
        delete properties.tags;
        return properties;
      }
    }
    const resource = new InLineLambda(this, 'Resource', {
      type: resourceType,
      properties: {
        Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        Code: { ZipFile: `exports.handler = ${handler.toString()};` },
        Handler: 'index.handler',
        Role: role.roleArn,
        Runtime: 'nodejs10.x',
        Timeout: 300,
      },
    });

    resource.node.addDependency(role);

    this.functionArn = resource.getAtt('Arn').toString();
  }
}

/* eslint-disable no-console */

/**
 * Lambda event handler for the custom resource. Bear in mind that we are going
 * to .toString() this function and inline it as Lambda code.
 *
 * The function will issue a putBucketNotificationConfiguration request for the
 * specified bucket.
 */
const handler = (event: any, context: any) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
  const s3 = new (require('aws-sdk').S3)();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const https = require('https');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const url = require('url');

  log(JSON.stringify(event, undefined, 2));

  const [notificationConfiguration, notificationErr] = getNotificationConfiguration();
  if (notificationErr) {
    return submitResponse('FAILED', notificationErr.message + `\nMore information in CloudWatch Log Stream: ${context.logStreamName}`);
  }
  const req = {
    Bucket: event.ResourceProperties.BucketName,
    NotificationConfiguration: notificationConfiguration,
  };

  return s3.putBucketNotificationConfiguration(req, (err: any, data: any) => {
    log({ err, data });
    if (err) {
      return submitResponse('FAILED', err.message + `\nMore information in CloudWatch Log Stream: ${context.logStreamName}`);
    } else {
      return submitResponse('SUCCESS');
    }
  });

  function getNotificationConfiguration() {
    // Try to preserve existing bucket notifications
    const [bucketNotifcations, err] = filteredBucketNotification();
    if (err) {
      return err;
    }
    if (event.RequestType !== 'Delete') {
      // Add updated configuration
      const inConfiguration = event.ResourceProperties.NotificationConfiguration;
      if (inConfiguration.TopicConfigurations) {
        bucketNotifcations.TopicConfigurations = inConfiguration.TopicConfigurations;
      }
      if (inConfiguration.LambdaFunctionConfigurations) {
        bucketNotifcations.LambdaFunctionConfigurations = inConfiguration.LambdaFunctionConfigurations;
      }
      if (inConfiguration.QueueConfigurations) {
        bucketNotifcations.QueueConfigurations = inConfiguration.QueueConfigurations;
      }
    }
    return [bucketNotifcations, null];
  }

  function filteredBucketNotification() {
    const params = {
      Bucket: event.ResourceProperties.BucketName,
    };
    let error = null;
    let response: any = {};
    // Get existing bucket notificaitons and filter out the incoming configuration
    s3.getBucketNotificationConfiguration(params, function(err: any, data: any) {
      log({ err, data });
      if (err) {
        error = err;
      } else {
        const inConfiguration = event.ResourceProperties.NotificationConfiguration;
        if (inConfiguration.TopicConfigurations) {
          delete data.TopicConfigurations;
        }
        if (inConfiguration.LambdaFunctionConfigurations) {
          delete data.LambdaFunctionConfigurations;
        }
        if (inConfiguration.QueueConfigurations) {
          delete data.QueueConfigurations;
        }
        response = data;
      }
    });
    return [response, error];
  }

  function log(obj: any) {
    console.error(event.RequestId, event.StackId, event.LogicalResourceId, obj);
  }

  // eslint-disable-next-line max-len
  // adapted from https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-cfnresponsemodule
  // to allow sending an error messge as a reason.
  function submitResponse(responseStatus: string, reason?: string) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason || 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: event.PhysicalResourceId || event.LogicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
    });

    log({ responseBody });

    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': responseBody.length,
      },
    };

    const request = https.request(options, (r: any) => {
      log({ statusCode: r.statusCode, statusMessage: r.statusMessage });
      context.done();
    });

    request.on('error', (error: any) => {
      log({ sendError: error });
      context.done();
    });

    request.write(responseBody);
    request.end();
  }
};
