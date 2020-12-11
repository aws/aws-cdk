import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cloudfront from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'Bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
    });

    new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          customOriginSource: {
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            domainName: bucket.bucketWebsiteDomainName,
          },
        },
      ],
    },
    );
  }
}

const app = new App();
new TestStack(app, 'cloudfront-custom-s3-integ');
app.synth();
