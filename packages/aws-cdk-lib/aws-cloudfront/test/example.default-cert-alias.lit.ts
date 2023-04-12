import * as s3 from '../../aws-s3';
import { App, Stack } from '../../core';
import { Construct } from 'constructs';
import * as cloudfront from '../lib';

class AcmCertificateAliasStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    /// !show
    const s3BucketSource = new s3.Bucket(this, 'Bucket');

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'AnAmazingWebsiteProbably', {
      originConfigs: [{
        s3OriginSource: { s3BucketSource },
        behaviors: [{ isDefaultBehavior: true }],
      }],
      viewerCertificate: cloudfront.ViewerCertificate.fromCloudFrontDefaultCertificate(
        'www.example.com',
      ),
    });
    /// !hide

    Array.isArray(s3BucketSource);
    Array.isArray(distribution);
  }
}

const app = new App();
new AcmCertificateAliasStack(app, 'AcmCertificateAliasStack');
app.synth();
