import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import {
  CfnDistribution, CloudFrontWebDistribution, LambdaEdgeEventType, SecurityPolicyProtocol, SSLMethod,
  ViewerCertificate, ViewerProtocolPolicy
} from '../lib';

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
      runtime: lambda.Runtime.NODEJS_10_X
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

  'allows multiple aliasConfiguration CloudFrontWebDistribution per stack'(test: Test) {
    const stack = new cdk.Stack();
    const s3BucketSource = new s3.Bucket(stack, 'Bucket');

    const originConfigs = [{
        s3OriginSource: {s3BucketSource},
        behaviors: [{ isDefaultBehavior: true }]
    }];

    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs,
      aliasConfiguration: {acmCertRef: 'acm_ref', names: ['www.example.com']},
    });
    new CloudFrontWebDistribution(stack, 'AnotherAmazingWebsiteProbably', {
      originConfigs,
      aliasConfiguration: {acmCertRef: 'another_acm_ref', names: ['ftp.example.com']},
    });

    expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
      "DistributionConfig": {
        "Aliases": ["www.example.com"],
        "ViewerCertificate": {
          "AcmCertificateArn": "acm_ref",
          "SslSupportMethod": "sni-only"
        }
      }
    }));

    expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
      "DistributionConfig": {
        "Aliases": ["ftp.example.com"],
        "ViewerCertificate": {
          "AcmCertificateArn": "another_acm_ref",
          "SslSupportMethod": "sni-only"
        }
      }
    }));
    test.done();
  },

  'viewerCertificate': {
    'acmCertificate': {
      'base usage'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        const certificate = new certificatemanager.Certificate(stack, 'cert', {
          domainName: 'example.com',
        });

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": [],
            "ViewerCertificate": {
              "AcmCertificateArn": {
                "Ref": "cert56CA94EB"
              },
              "SslSupportMethod": "sni-only"
            }
          }
        }));

        test.done();
      },
      'imported certificate fromCertificateArn'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        const certificate = certificatemanager.Certificate.fromCertificateArn(
          stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'
        );

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": [],
            "ViewerCertificate": {
              "AcmCertificateArn": "arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d",
              "SslSupportMethod": "sni-only"
            }
          }
        }));

        test.done();
      },
      'advanced usage'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        const certificate = new certificatemanager.Certificate(stack, 'cert', {
          domainName: 'example.com',
        });

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
            securityPolicy: SecurityPolicyProtocol.SSL_V3,
            sslMethod: SSLMethod.VIP,
            aliases: ['example.com', 'www.example.com']
          }),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": ["example.com", "www.example.com"],
            "ViewerCertificate": {
              "AcmCertificateArn": {
                "Ref": "cert56CA94EB"
              },
              "MinimumProtocolVersion": "SSLv3",
              "SslSupportMethod": "vip"
            }
          }
        }));

        test.done();
      },
    },
    'iamCertificate': {
      'base usage'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromIamCertificate('test'),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": [],
            "ViewerCertificate": {
              "IamCertificateId": "test",
              "SslSupportMethod": "sni-only"
            }
          }
        }));

        test.done();
      },
      'advanced usage'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromIamCertificate('test', {
            securityPolicy: SecurityPolicyProtocol.TLS_V1,
            sslMethod: SSLMethod.VIP,
            aliases: ['example.com']
          }),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": ["example.com"],
            "ViewerCertificate": {
              "IamCertificateId": "test",
              "MinimumProtocolVersion": "TLSv1",
              "SslSupportMethod": "vip"
            }
          }
        }));

        test.done();
      },
    },
    'cloudFrontDefaultCertificate': {
      'base usage'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromCloudFrontDefaultCertificate(),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": [],
            "ViewerCertificate": {
              "CloudFrontDefaultCertificate": true
            }
          }
        }));

        test.done();
      },
      'aliases are set'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromCloudFrontDefaultCertificate('example.com', 'www.example.com'),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": ["example.com", "www.example.com"],
            "ViewerCertificate": {
              "CloudFrontDefaultCertificate": true
            }
          }
        }));

        test.done();
      },
    },
    'errors': {
      'throws if both deprecated aliasConfiguration and viewerCertificate'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        test.throws(() => {
          new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [{
              s3OriginSource: { s3BucketSource: sourceBucket },
              behaviors: [{ isDefaultBehavior: true }]
            }],
            aliasConfiguration: {acmCertRef: 'test', names: ['ftp.example.com']},
            viewerCertificate: ViewerCertificate.fromCloudFrontDefaultCertificate('example.com', 'www.example.com'),
          });
        }, /You cannot set both aliasConfiguration and viewerCertificate properties/);

        test.done();
      },
      'throws if invalid security policy for SSL method'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        test.throws(() => {
          new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [{
              s3OriginSource: { s3BucketSource: sourceBucket },
              behaviors: [{ isDefaultBehavior: true }]
            }],
            viewerCertificate: ViewerCertificate.fromIamCertificate('test', {
              securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
              sslMethod: SSLMethod.VIP
            }),
          });
        }, /TLSv1.1_2016 is not compabtible with sslMethod vip./);

        test.done();
      },
      // FIXME https://github.com/aws/aws-cdk/issues/4724
      'does not throw if acmCertificate explicitly not in us-east-1'(test: Test) {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');

        const certificate = certificatemanager.Certificate.fromCertificateArn(
          stack, 'cert', 'arn:aws:acm:eu-west-3:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d'
        );

        new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [{
            s3OriginSource: { s3BucketSource: sourceBucket },
            behaviors: [{ isDefaultBehavior: true }]
          }],
          viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate),
        });

        expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
          "DistributionConfig": {
            "Aliases": [],
            "ViewerCertificate": {
              "AcmCertificateArn": "arn:aws:acm:eu-west-3:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d",
              "SslSupportMethod": "sni-only"
            }
          }
        }));

        test.done();
      },
    }
  },

  'edgelambda.amazonaws.com is added to the trust policy of lambda'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const fn = new lambda.Function(stack, 'Lambda', {
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X
    });
    const lambdaVersion = new lambda.Version(stack, 'LambdaVersion', { lambda: fn });

    // WHEN
    new CloudFrontWebDistribution(stack, 'MyDistribution', {
      originConfigs: [
        {
          s3OriginSource: { s3BucketSource: sourceBucket },
          behaviors : [
            {
              isDefaultBehavior: true, lambdaFunctionAssociations: [
                {
                  eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: lambdaVersion
                }
              ]
            }
          ]
        }
      ]
     });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            }
          },
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Principal": {
              "Service": "edgelambda.amazonaws.com"
            }
          }
        ],
        "Version": "2012-10-17"
      }
    }));
    test.done();
  },

  'edgelambda.amazonaws.com is not added to lambda role for imported functions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const lambdaVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:my-version');

    // WHEN
    new CloudFrontWebDistribution(stack, 'MyDistribution', {
      originConfigs: [
        {
          s3OriginSource: { s3BucketSource: sourceBucket },
          behaviors : [
            {
              isDefaultBehavior: true, lambdaFunctionAssociations: [
                {
                  eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: lambdaVersion
                }
              ]
            }
          ]
        }
      ]
    });

    expect(stack).notTo(haveResourceLike('AWS::IAM::Role'));
    test.done();
  }
};
