import * as s3 from '@aws-cdk/aws-s3';
import { App, Construct, Stack } from '@aws-cdk/core';
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
      viewerCertificate: cloudfront.ViewerCertificate.fromIamCertificate(
        'certificateId',
        {
          aliases: ['example.com'],
          securityPolicy: cloudfront.SecurityPolicyProtocol.SSL_V3, // default
          sslMethod: cloudfront.SSLMethod.SNI, // default
        },
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
