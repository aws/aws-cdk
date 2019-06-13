import { expect } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { CloudFrontWebDistribution, LambdaEdgeEventType, ViewerProtocolPolicy } from '../lib';

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
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
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

  'distribution with resolvable lambda-association'(test: Test) {
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');

    const lambdaFunction = new lambda.Function(stack, 'Lambda', {
      code: lambda.Code.inline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.Nodejs810
    });

    const lambdaVersion = new lambda.Version(stack, 'LambdaVersion', {
      lambda: lambdaFunction
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
                eventType: LambdaEdgeEventType.OriginRequest,
                lambdaFunction: cdk.Token.asAny(lambdaVersion.versionArn)
              }]
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
        },
        "LambdaServiceRoleA8ED4D3B": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Statement": [
                {
                  "Action": "sts:AssumeRole",
                  "Effect": "Allow",
                  "Principal": {
                    "Service": {
                      "Fn::Join": [
                        "",
                        [
                          "lambda.",
                          {
                            "Ref": "AWS::URLSuffix"
                          }
                        ]
                      ]
                    }
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "ManagedPolicyArns": [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
                  ]
                ]
              }
            ]
          }
        },
        "LambdaD247545B": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
            "Code": {
              "ZipFile": "foo"
            },
            "Handler": "index.handler",
            "Role": {
              "Fn::GetAtt": [
                "LambdaServiceRoleA8ED4D3B",
                "Arn"
              ]
            },
            "Runtime": "nodejs8.10"
          },
          "DependsOn": [
            "LambdaServiceRoleA8ED4D3B"
          ]
        },
        "LambdaVersionFA49E61E": {
          "Type": "AWS::Lambda::Version",
          "Properties": {
            "FunctionName": {
              "Ref": "LambdaD247545B"
            }
          }
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
                "LambdaFunctionAssociations": [
                  {
                    "EventType": "origin-request",
                    "LambdaFunctionARN": {
                      "Ref": "LambdaVersionFA49E61E"
                    }
                  }
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
