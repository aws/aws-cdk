import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

/**
 * A Lambda-based custom resource handler that deletes objects from an S3
 * bucket whenever a bucket is removed from the stack.
 *
 * This is required to force buckets to be deleted since the 'destroy' removal
 * policy will not delete a bucket if the bucket still has objects.
 *
 * The resource property schema is:
 *
 * {
 *   BucketName: string
 * }
 *
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
export class AutoDeleteObjectsResourceHandler extends cdk.Construct {
  /**
   * Defines a stack-singleton lambda function with the logic for a
   * CloudFormation custom resource that deletes a bucket's S3 objects when the
   * bucket is targeted for deletion.
   *
   * @returns The custom resource lambda function.
   */
  public static singleton(context: cdk.Construct) {
    const root = cdk.Stack.of(context);

    // well-known logical id to ensure stack singletonity
    const logicalId = 'AutoDeleteObjectsHandler321d6b9b694d3476b0a14f1c09870ea4';
    let lambda = root.node.tryFindChild(logicalId) as AutoDeleteObjectsResourceHandler;
    if (!lambda) {
      lambda = new AutoDeleteObjectsResourceHandler(root, logicalId);
    }

    return lambda;
  }

  /**
   * The ARN of the handler's lambda function. Used as a service token in the
   * custom resource.
   */
  public readonly functionArn: string;

  public readonly role: iam.Role;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

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
        Description: 'AWS CloudFormation handler for "Custom::AutoDeleteBucketObjects" resources (@aws-cdk/aws-s3)',
        Code: { ZipFile: `exports.handler = ${handler.toString()};` },
        Handler: 'index.handler',
        Role: this.role.roleArn,
        Runtime: 'nodejs12.x',
        Timeout: 900,
      },
    });

    resource.node.addDependency(this.role);

    this.functionArn = resource.getAtt('Arn').toString();
  }
}

/* eslint-disable no-console */

/**
 * Lambda to handle deleting all objects in a bucket when the bucket is
 * scheduled for deletion. This function will be inlined using .toString()
 * as Lambda code.
 */
/* istanbul ignore next */
const handler = async function (event: any, context: any) {
  console.log('REQUEST RECEIVED:\n' + JSON.stringify(event));
  const responseData = {};
  let physicalResourceId;

  /**
   * Upload a CloudFormation response for a Custom Resourcenection error or HTTP error response
   */
  const report = function (evt: any, ctx: any, respStatus: any, physResourceId: any, respData: any, reason?: any) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const https = require('https');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { URL } = require('url');

      const responseBody = JSON.stringify({
        Status: respStatus,
        Reason: reason || 'See the details in CloudWatch Log Stream: ' + ctx.logStreamName,
        PhysicalResourceId: physResourceId || ctx.logStreamName,
        StackId: evt.StackId,
        RequestId: evt.RequestId,
        LogicalResourceId: evt.LogicalResourceId,
        Data: respData,
      });

      const parsedUrl = new URL(evt.ResponseURL);
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'PUT',
        headers: {
          'Content-Type': '',
          'Content-Length': responseBody.length,
        },
      };

      https.request(options)
        .on('error', reject)
        .on('response', (res: any) => {
          res.resume();
          if (res.statusCode >= 400) {
            reject(new Error(`Server returned error ${res.statusCode}: ${res.statusMessage}`));
          } else {
            resolve();
          }
        })
        .end(responseBody, 'utf8');
    });
  };

  /**
   * Recursively delete all items in the bucket
   *
   * @param {AWS.S3} s3 the S3 client
   * @param {*} bucketName the bucket name
   */
  const emptyBucket = async function(s3: any, bucketName: string) {
    const listedObjects = await s3.listObjectVersions({ Bucket: bucketName }).promise();
    const contents = (listedObjects.Versions || []).concat(listedObjects.DeleteMarkers || []);
    if (contents.length === 0) return;

    let records = contents.map((record: any) => ({ Key: record.Key, VersionId: record.VersionId }));
    await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } }).promise();

    if (listedObjects?.IsTruncated === 'true' ) await emptyBucket(s3, bucketName);
  };

  try {
    const bucketName = event.ResourceProperties?.BucketName;
    if (!bucketName) throw new Error('BucketName is required');
    physicalResourceId = `${bucketName}-${event.LogicalResourceId}`;

    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        await report(event, context, 'SUCCESS', physicalResourceId, responseData);
        break;
      case 'Delete':
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
        const s3 = new (require('aws-sdk').S3)();
        await emptyBucket(s3, bucketName);
        await report(event, context, 'SUCCESS', physicalResourceId, responseData);
        break;
      default:
        throw new Error(`Unsupported request type ${event.RequestType}`);
    }

    console.log('Done!');
  } catch (err) {
    console.log(`Caught error ${err}.`);
    await report(event, context, 'FAILED', physicalResourceId, null, err.message);
  }
};
