import cdk = require('@aws-cdk/core');
import certificatemanager = require('@aws-cdk/aws-certificatemanager');
import cloudfront = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');

new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
  originConfigs: [
    {
      originHeaders: {
        "X-Custom-Header": "somevalue",
      },
      customOriginSource: {
        domainName: "brelandm.a2z.com",
      },
      behaviors: [
        {
        isDefaultBehavior: true,
        }
      ]
    }
  ],
  aliasConfig: {
    acmCert: certificatemanager.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1234567890:certificate/testACM'),
    names: ['test.test.com'],
    sslMethod: cloudfront.SSLMethod.SNI,
    securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1
  }
});

app.synth();
