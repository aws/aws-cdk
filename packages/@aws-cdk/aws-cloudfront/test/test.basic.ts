import { expect } from '@aws-cdk/assert';
import certificatemanager = require('@aws-cdk/aws-certificatemanager');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { CloudFrontWebDistribution, ViewerProtocolPolicy } from '../lib';

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

  'throws if certificate is not in us-east-1 - fromCertificateArn'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const certificate = certificatemanager.Certificate.fromCertificateArn(
        stack, 'EuCertificate', 'arn:aws:acm:eu-west-1:1234567890:certificate/testACM'
    );

    // WHEN
    const toThrow = () => {
      new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
          originConfigs: [
          {
            s3OriginSource: {s3BucketSource: sourceBucket},
            behaviors: [{isDefaultBehavior: true}]
          }
        ],
        aliasConfiguration: {
          names: ['www.example.com'],
          acmCertRef: certificate.certificateArn
        }
      });
    };

    // THEN
    test.throws(() => toThrow(), /acmCertificateArn must be in the 'us-east-1' region, got 'eu-west-1'/);
    test.done();
  },

  'throws if stack region is invalid - constructor'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'RegionStack', {env: {region: 'eu-west-3'}});
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const certificate = new certificatemanager.Certificate(stack, 'TestCertificate', {
      domainName: 'www.example.com',
    });

    // WHEN
    const toThrow = () => {
      new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
        originConfigs: [
          {
            s3OriginSource: {s3BucketSource: sourceBucket},
            behaviors: [{isDefaultBehavior: true}]
          }
        ],
        aliasConfiguration: {
          names: ['www.example.com'],
          acmCertRef: certificate.certificateArn
        }
      });
    };

    // THEN
    test.throws(() => toThrow(), /acmCertificateArn must be in the 'us-east-1' region, got 'eu-west-3'/);
    test.done();
  },

  'throws if certificate region is invalid - constructor'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'RegionStack', {env: {region: 'us-east-1'}});
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(stack, 'zone', {
      zoneName: 'zoneName',
      hostedZoneId: 'hostedZoneId'
    });
    const certificate = new certificatemanager.DnsValidatedCertificate(stack, 'TestCertificate', {
      domainName: 'www.example.com',
      hostedZone,
      region: 'eu-west-3',
    });

    // WHEN
    const toThrow = () => {
      new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
        originConfigs: [
          {
            s3OriginSource: {s3BucketSource: sourceBucket},
            behaviors: [{isDefaultBehavior: true}]
          }
        ],
        aliasConfiguration: {
          names: ['www.example.com'],
          acmCertRef: certificate.certificateArn
        }
      });
    };

    // THEN
    test.throws(() => toThrow(), /acmCertificateArn must be in the 'us-east-1' region, got 'eu-west-3'/);
    test.done();
  },

  'does not throw if region agnostic stack'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const sourceBucket = new s3.Bucket(stack, 'Bucket');
    const certificate = new certificatemanager.Certificate(stack, 'TestCertificate', {
      domainName: 'www.example.com',
    });

    // WHEN
    new CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
      originConfigs: [
        {
          s3OriginSource: {s3BucketSource: sourceBucket},
          behaviors: [{isDefaultBehavior: true}]
        }
      ],
      aliasConfiguration: {
        names: ['www.example.com'],
        acmCertRef: certificate.certificateArn
      }
    });

    // THEN
    expect(stack).toMatch({
        Resources: {
          Bucket83908E77: {
            Type: "AWS::S3::Bucket",
            UpdateReplacePolicy: "Retain",
            DeletionPolicy: "Retain"
          },
          TestCertificate6B4956B6: {
            Type: "AWS::CertificateManager::Certificate",
            Properties: {
              DomainName: "www.example.com",
              DomainValidationOptions: [
                {
                  DomainName: "www.example.com",
                  ValidationDomain: "example.com"
                }
              ]
            }
          },
          AnAmazingWebsiteProbablyCFDistribution47E3983B: {
            Type: "AWS::CloudFront::Distribution",
            Properties: {
              DistributionConfig: {
                Aliases: [
                  "www.example.com"
                ],
                CacheBehaviors: [],
                DefaultCacheBehavior: {
                  AllowedMethods: [
                    "GET",
                    "HEAD"
                  ],
                  CachedMethods: [
                    "GET",
                    "HEAD"
                  ],
                  ForwardedValues: {
                    Cookies: {
                      Forward: "none"
                    },
                    QueryString: false
                  },
                  TargetOriginId: "origin1",
                  ViewerProtocolPolicy: "redirect-to-https"
                },
                DefaultRootObject: "index.html",
                Enabled: true,
                HttpVersion: "http2",
                IPV6Enabled: true,
                Origins: [
                  {
                    DomainName: {
                      "Fn::GetAtt": [
                        "Bucket83908E77",
                        "RegionalDomainName"
                      ]
                    },
                    Id: "origin1",
                    S3OriginConfig: {}
                  }
                ],
                PriceClass: "PriceClass_100",
                ViewerCertificate: {
                  AcmCertificateArn: {
                    Ref: "TestCertificate6B4956B6"
                  },
                  SslSupportMethod: "sni-only"
                }
              }
            }
          }
        }
      }
    );

    test.done();
  },
};
