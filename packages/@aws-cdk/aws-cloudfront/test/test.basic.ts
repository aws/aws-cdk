import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { CfnDistribution, CloudFrontWebDistribution, LambdaEdgeEventType, ViewerProtocolPolicy } from '../lib';

/* eslint-disable quote-props */

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
                  "ViewerProtocolPolicy": "redirect-to-https",
                  "Compress": true
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
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
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
                      "RegionalDomainName"
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
                  "Cookies": { "Forward": "none" }
                },
                "Compress": true
              },
              "Enabled": true,
              "IPV6Enabled": true,
              "HttpVersion": "http2"
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
              trustedSigners: ["1234"],
            },
          ]
        }
      ]
    });

    expect(stack).toMatch({
      "Resources": {
        "Bucket83908E77": {
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
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
                      "RegionalDomainName"
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
                  "Cookies": { "Forward": "none" }
                },
                "TrustedSigners": [
                  "1234"
                ],
                "Compress": true
              },
              "Enabled": true,
              "IPV6Enabled": true,
              "HttpVersion": "http2"
            }
          }
        }
      }
    });
    test.done();
  },

  'distribution with ViewerProtocolPolicy set to a non-default value'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
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
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
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
                      "RegionalDomainName"
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
                "ViewerProtocolPolicy": "allow-all",
                "ForwardedValues": {
                  "QueryString": false,
                  "Cookies": { "Forward": "none" }
                },
                "Compress": true
              },
              "Enabled": true,
              "IPV6Enabled": true,
              "HttpVersion": "http2",
            }
          }
        }
      }
    });
    test.done();
  },

  'distribution with disabled compression'(test: Test) {
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
              compress: false
            }
          ]
        }
      ]
    });

    expect(stack).toMatch({
      "Resources": {
        "Bucket83908E77": {
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
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
                      "RegionalDomainName"
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
                  "Cookies": { "Forward": "none" }
                },
                "Compress": false
              },
              "Enabled": true,
              "IPV6Enabled": true,
              "HttpVersion": "http2"
            }
          }
        }
      }
    });
    test.done();
  },

  'distribution with resolvable lambda-association'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    const lambdaFunction = new lambda.SingletonFunction(stack, 'Lambda', {
      uuid: 'xxxx-xxxx-xxxx-xxxx',
      code: lambda.Code.inline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_8_10
    });

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              lambdaFunctionAssociations: [{
                eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                lambdaFunction: lambdaFunction.latestVersion
              }]
            }
          ]
        }
      ]
    });

    expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
      "DistributionConfig": {
        "DefaultCacheBehavior": {
          "LambdaFunctionAssociations": [
            {
              "EventType": "origin-request",
              "LambdaFunctionARN": {
                "Fn::Join": [
                  "",
                  [
                    { "Fn::GetAtt": [ "SingletonLambdaxxxxxxxxxxxxxxxx69D4268A", "Arn" ] },
                    ":$LATEST"
                  ]
                ]
              }
            }
          ],
        },
      }
    }));

    test.done();
  },

  'distribution has a defaultChild'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    const distribution = new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    test.ok(distribution.node.defaultChild instanceof CfnDistribution);
    test.done();
  },

};
