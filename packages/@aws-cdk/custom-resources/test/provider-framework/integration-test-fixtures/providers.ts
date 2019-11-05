import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, Duration, Fn, Stack, StackProps } from '@aws-cdk/core';
import path = require('path');
import cr = require('../../../lib');

const BUCKET_READ_ACTIONS = [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ];
const BUCKET_WRITE_ACTIONS = [   's3:DeleteObject*', 's3:PutObject*', 's3:Abort*' ];

const S3FILE_EXPORT_NAME = 'S3FileResourceProviderServiceToken';
const S3ASSERT_EXPORT_NAME = 'S3AssertResourceProviderServiceToken';

/**
 * This CDK stack includes the custom resource providers for Custom::S3File and
 * Custom::S3Assert.
 *
 * The stack exports the provider's entrypoint ARNs to a set of well-known
 * CloudFormation export names, which are then consumed by the `S3File` and
 * `S3Assert` constructs.
 *
 * This pattern makes sense for situations where you want to share the providers
 * across multiple apps within the same environment. Alternatively, you could package
 * providers into a nested stack, use automatic-exports and so forth.
 */
export class ProvidersStack extends Stack {
  /**
   * Returns a `CustomResourceProvider` for the Custom::S3File resource. Expects the providers stack to be deployed in the same environment.
   */
  public static importS3FileResourceProvider(scope: Construct) {
    return cfn.CustomResourceProvider.lambda(lambda.Function.fromFunctionArn(scope, 'S3FileProvider', Fn.importValue(S3FILE_EXPORT_NAME)));
  }

  /**
   * Returns a `CustomResourceProvider` for the Custom::S3Assert resource. Expects the providers stack to be deployed in the same environment.
   */
  public static importS3AssertResourceProvider(scope: Construct) {
    return cfn.CustomResourceProvider.lambda(lambda.Function.fromFunctionArn(scope, 'S3AssertProvider', Fn.importValue(S3ASSERT_EXPORT_NAME)));
  }

  public constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const s3File = new cr.Provider(this, 's3file-provider', {
      onEventHandler: new lambda.Function(this, 's3file-on-event', {
        code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'index.onEvent',
        initialPolicy: [ new iam.PolicyStatement({ resources: [ '*' ], actions: [ ...BUCKET_READ_ACTIONS, ...BUCKET_WRITE_ACTIONS ] }) ]
      }),
    });

    const s3Assert = new cr.Provider(this, 's3assert-provider', {
      onEventHandler: new lambda.Function(this, 's3assert-on-event', {
        code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'index.on_event'
      }),
      isCompleteHandler: new lambda.Function(this, 's3assert-is-complete', {
        code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'index.is_complete',
        initialPolicy: [ new iam.PolicyStatement({ resources: [ '*' ], actions: BUCKET_READ_ACTIONS }) ]
      }),
      totalTimeout: Duration.minutes(5),
    });

    // publish provider entrypoints
    new CfnOutput(this, 'S3FileProviderEntrypoint', { value: s3File.entrypoint.functionArn, exportName: S3FILE_EXPORT_NAME });
    new CfnOutput(this, 'S3AssertProviderEntrypoint', { value: s3Assert.entrypoint.functionArn, exportName: S3ASSERT_EXPORT_NAME });
  }
}
