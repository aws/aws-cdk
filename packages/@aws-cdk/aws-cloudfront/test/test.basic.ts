import { expect } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { CloudFrontWebDistribution } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {

  'distribution with custom origin adds custom origin'(test: Test) {
    const stack = new cdk.Stack();

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          originHeaders: {
          "X-Custom-Header": "somevalue",
          },
          customOriginSource: {
          domainName: "myorigin.com",
          },
          behaviors: [
          {
            isDefaultBehavior: true,
          }
          ],
        }
      ]
    });

    expect(stack).toMatch(
    {
      "Resources": {
      "AnAmazingWebsiteProbablyCFDistribution47E3983B": {
      "Type": "AWS::CloudFront::Distribution",
      "Properties": {
        "DistributionConfig": {
        "CacheBehaviors": [],
        "DefaultCacheBehavior": {
          "AllowedMethods": [
          "GET",
          "HEAD"
          ],
          "CachedMethods": [
          "GET",
          "HEAD"
          ],
          "ForwardedValues": {
          "Cookies": {
            "Forward": "none"
          },
          "QueryString": false
          },
          "TargetOriginId": "origin1",
          "ViewerProtocolPolicy": "redirect-to-https"
        },
        "DefaultRootObject": "index.html",
        "Enabled": true,
        "HttpVersion": "http2",
        "IPV6Enabled": true,
        "Origins": [
          {
          "CustomOriginConfig": {
            "HTTPPort": 80,
            "HTTPSPort": 443,
            "OriginKeepaliveTimeout": 5,
            "OriginProtocolPolicy": "https-only",
            "OriginReadTimeout": 30,
            "OriginSSLProtocols": [
            "TLSv1.2"
            ]
          },
          "DomainName": "myorigin.com",
          "Id": "origin1",
          "OriginCustomHeaders": [
            {
            "HeaderName": "X-Custom-Header",
            "HeaderValue": "somevalue"
            }
          ]
          }
        ],
        "PriceClass": "PriceClass_100",
        "ViewerCertificate": {
          "CloudFrontDefaultCertificate": true
        }
        }
      }
      }
    }
    }
    );

    test.done();
  },

  'most basic distribution'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            }
          ]
        }
      ]
    });

    expect(stack).toMatch({
      "Resources": {
        "Bucket83908E77": {
        "Type": "AWS::S3::Bucket"
        },
        "AnAmazingWebsiteProbablyCFDistribution47E3983B": {
        "Type": "AWS::CloudFront::Distribution",
        "Properties": {
          "DistributionConfig": {
          "DefaultRootObject": "index.html",
          "Origins": [
            {
            "DomainName": {
              "Fn::GetAtt": [
              "Bucket83908E77",
              "DomainName"
              ]
            },
            "Id": "origin1",
            "S3OriginConfig": {}
            }
          ],
          "ViewerCertificate": {
            "CloudFrontDefaultCertificate": true
          },
          "PriceClass": "PriceClass_100",
          "DefaultCacheBehavior": {
            "AllowedMethods": [
            "GET",
            "HEAD"
            ],
            "CachedMethods": [
            "GET",
            "HEAD"
            ],
            "TargetOriginId": "origin1",
            "ViewerProtocolPolicy": "redirect-to-https",
            "ForwardedValues": {
            "QueryString": false,
            "Cookies" : { "Forward" : "none"}
            }
          },
          "Enabled": true,
          "IPV6Enabled": true,
          "HttpVersion": "http2",
          "CacheBehaviors": []
          }
        }
        }
      }
      });
    test.done();
  },

  'distribution with trusted signers on default distribution'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              trustedSigners: [ "1234" ],
            },
          ]
        }
      ]
    });

    expect(stack).toMatch({
      "Resources": {
        "Bucket83908E77": {
        "Type": "AWS::S3::Bucket"
        },
        "AnAmazingWebsiteProbablyCFDistribution47E3983B": {
        "Type": "AWS::CloudFront::Distribution",
        "Properties": {
          "DistributionConfig": {
          "DefaultRootObject": "index.html",
          "Origins": [
            {
            "DomainName": {
              "Fn::GetAtt": [
              "Bucket83908E77",
              "DomainName"
              ]
            },
            "Id": "origin1",
            "S3OriginConfig": {}
            }
          ],
          "ViewerCertificate": {
            "CloudFrontDefaultCertificate": true
          },
          "PriceClass": "PriceClass_100",
          "DefaultCacheBehavior": {
            "AllowedMethods": [
            "GET",
            "HEAD"
            ],
            "CachedMethods": [
            "GET",
            "HEAD"
            ],
            "TargetOriginId": "origin1",
            "ViewerProtocolPolicy": "redirect-to-https",
            "ForwardedValues": {
            "QueryString": false,
            "Cookies" : { "Forward" : "none"}
            },
            "TrustedSigners" : [
              "1234"
            ]
          },
          "Enabled": true,
          "IPV6Enabled": true,
          "HttpVersion": "http2",
          "CacheBehaviors": []
          }
        }
        }
      }
      });
    test.done();
  },
};
