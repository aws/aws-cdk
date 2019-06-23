
import cdk = require('@aws-cdk/core');
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
  aliasConfiguration: {
    acmCertRef: 'testACM',
    names: ['test.test.com'],
    sslMethod: cloudfront.SSLMethod.SNI,
    securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1
  }
});

app.synth();
