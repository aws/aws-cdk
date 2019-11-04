import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, Stack } from '@aws-cdk/core';
import path = require('path');
import cr = require('../../../lib');

export interface IProviders {
  /**
   * Provider for the S3File resource.
   */
  readonly s3FileProvider: cr.Provider;

  /**
   * Provider for the S3Assert resource.
   */
  readonly s3AssertProvider: cr.Provider;
}

export class Providers extends cfn.NestedStack implements IProviders {

  /**
   * Gets or create the singleton nested stack that includes the resource providers.
   */
  public static getOrCreate(scope: Construct): IProviders {
    const stack = Stack.of(scope);
    const uid = `s3-resource-providers-A6EECFEF`;
    return stack.node.tryFindChild(uid) as Providers || new Providers(stack, uid);
  }

  public readonly s3FileProvider: cr.Provider;
  public readonly s3AssertProvider: cr.Provider;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    this.s3FileProvider = new cr.Provider(this, 's3file-provider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
      runtime: lambda.Runtime.NODEJS_10_X,
      onEventHandler: 'index.onEvent',
      isCompleteHandler: 'index.isComplete',
    });

    this.s3AssertProvider = new cr.Provider(this, 's3assert-provider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      onEventHandler: 'index.on_event',
      isCompleteHandler: 'index.is_complete',
      totalTimeout: Duration.minutes(5),
      policy: [
        // assert will get read permissions to all buckets
        new iam.PolicyStatement({ actions: [ 's3:GetObject' ], resources: [ '*' ] })
      ],
    });
  }
}
