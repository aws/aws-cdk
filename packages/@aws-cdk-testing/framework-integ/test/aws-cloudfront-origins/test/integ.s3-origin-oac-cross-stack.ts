import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

/**
 * Integration test for S3BucketOrigin.withOriginAccessControl() with cross-stack references.
 *
 * This test validates that OAC works correctly when the S3 bucket is defined in a
 * different stack than the CloudFront distribution. Previously, this scenario would
 * fail with a cyclic dependency error.
 *
 * See: https://github.com/aws/aws-cdk/issues/31462
 */

const app = new cdk.App();

// Stack 1: Contains the S3 bucket
class BucketStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}

// Stack 2: Contains the CloudFront distribution with OAC
class DistributionStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: cdk.StackProps & { bucket: s3.IBucket }) {
    super(scope, id, props);

    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(props.bucket);
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
      },
    });
  }
}

const bucketStack = new BucketStack(app, 'oac-cross-stack-bucket');
const distributionStack = new DistributionStack(app, 'oac-cross-stack-distribution', {
  bucket: bucketStack.bucket,
});

const integ = new IntegTest(app, 's3-origin-oac-cross-stack', {
  testCases: [bucketStack, distributionStack],
});

// Verify the distribution has OAC configured correctly
integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distributionStack.distribution.distributionId,
}).expect(ExpectedResult.objectLike({
  DistributionConfig: Match.objectLike({
    Origins: {
      Quantity: 1,
      Items: Match.arrayWith([
        Match.objectLike({
          S3OriginConfig: {
            OriginAccessIdentity: '',
          },
          OriginAccessControlId: Match.stringLikeRegexp('^[A-Z0-9]+$'),
        }),
      ]),
    },
  }),
}));

// Verify the OAC configuration
const originAccessControlId = integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distributionStack.distribution.distributionId,
}).getAttString('DistributionConfig.Origins.Items.0.OriginAccessControlId');

integ.assertions.awsApiCall('CloudFront', 'getOriginAccessControlConfig', {
  Id: originAccessControlId,
}).expect(ExpectedResult.objectLike({
  OriginAccessControlConfig: {
    SigningProtocol: 'sigv4',
    SigningBehavior: 'always',
    OriginAccessControlOriginType: 's3',
  },
}));
