import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'Bucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(bucket.bucketWebsiteDomainName, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });
  }
}

const app = new App();
new IntegTest(app, 'integ-cloudfront-custom-s3', {
  testCases: [new TestStack(app, 'cloudfront-custom-s3-stack')],
  diffAssets: true,
  enableLookups: true,
});