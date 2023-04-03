"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const acm = require("@aws-cdk/aws-certificatemanager");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const test_origin_1 = require("./test-origin");
const lib_1 = require("../lib");
let app;
let stack;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'Stack', {
        env: { account: '1234', region: 'testregion' },
    });
});
test('minimal example renders correctly', () => {
    const origin = test_origin_1.defaultOrigin();
    new lib_1.Distribution(stack, 'MyDist', { defaultBehavior: { origin } });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            DefaultCacheBehavior: {
                CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                Compress: true,
                TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                ViewerProtocolPolicy: 'allow-all',
            },
            Enabled: true,
            HttpVersion: 'http2',
            IPV6Enabled: true,
            Origins: [{
                    DomainName: 'www.example.com',
                    Id: 'StackMyDistOrigin1D6D5E535',
                    CustomOriginConfig: {
                        OriginProtocolPolicy: 'https-only',
                    },
                }],
        },
    });
});
test('exhaustive example of props renders correctly and SSL method sni-only', () => {
    const origin = test_origin_1.defaultOrigin();
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
    new lib_1.Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        certificate,
        comment: 'a test',
        defaultRootObject: 'index.html',
        domainNames: ['example.com'],
        enabled: false,
        enableIpv6: false,
        enableLogging: true,
        geoRestriction: lib_1.GeoRestriction.denylist('US', 'GB'),
        httpVersion: lib_1.HttpVersion.HTTP1_1,
        logFilePrefix: 'logs/',
        logIncludesCookies: true,
        sslSupportMethod: lib_1.SSLMethod.SNI,
        minimumProtocolVersion: lib_1.SecurityPolicyProtocol.TLS_V1_2_2019,
        priceClass: lib_1.PriceClass.PRICE_CLASS_100,
        webAclId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            Aliases: ['example.com'],
            DefaultCacheBehavior: {
                CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                Compress: true,
                TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                ViewerProtocolPolicy: 'allow-all',
            },
            Comment: 'a test',
            DefaultRootObject: 'index.html',
            Enabled: false,
            HttpVersion: 'http1.1',
            IPV6Enabled: false,
            Logging: {
                Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
                IncludeCookies: true,
                Prefix: 'logs/',
            },
            Origins: [{
                    DomainName: 'www.example.com',
                    Id: 'StackMyDistOrigin1D6D5E535',
                    CustomOriginConfig: {
                        OriginProtocolPolicy: 'https-only',
                    },
                }],
            PriceClass: 'PriceClass_100',
            Restrictions: {
                GeoRestriction: {
                    Locations: ['US', 'GB'],
                    RestrictionType: 'blacklist',
                },
            },
            ViewerCertificate: {
                AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
                SslSupportMethod: 'sni-only',
                MinimumProtocolVersion: 'TLSv1.2_2019',
            },
            WebACLId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
        },
    });
});
test('exhaustive example of props renders correctly and SSL method vip', () => {
    const origin = test_origin_1.defaultOrigin();
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
    new lib_1.Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        certificate,
        comment: 'a test',
        defaultRootObject: 'index.html',
        domainNames: ['example.com'],
        enabled: false,
        enableIpv6: false,
        enableLogging: true,
        geoRestriction: lib_1.GeoRestriction.denylist('US', 'GB'),
        httpVersion: lib_1.HttpVersion.HTTP1_1,
        logFilePrefix: 'logs/',
        logIncludesCookies: true,
        sslSupportMethod: lib_1.SSLMethod.VIP,
        minimumProtocolVersion: lib_1.SecurityPolicyProtocol.TLS_V1_2_2019,
        priceClass: lib_1.PriceClass.PRICE_CLASS_100,
        webAclId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            Aliases: ['example.com'],
            DefaultCacheBehavior: {
                CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                Compress: true,
                TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                ViewerProtocolPolicy: 'allow-all',
            },
            Comment: 'a test',
            DefaultRootObject: 'index.html',
            Enabled: false,
            HttpVersion: 'http1.1',
            IPV6Enabled: false,
            Logging: {
                Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
                IncludeCookies: true,
                Prefix: 'logs/',
            },
            Origins: [{
                    DomainName: 'www.example.com',
                    Id: 'StackMyDistOrigin1D6D5E535',
                    CustomOriginConfig: {
                        OriginProtocolPolicy: 'https-only',
                    },
                }],
            PriceClass: 'PriceClass_100',
            Restrictions: {
                GeoRestriction: {
                    Locations: ['US', 'GB'],
                    RestrictionType: 'blacklist',
                },
            },
            ViewerCertificate: {
                AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
                SslSupportMethod: 'vip',
                MinimumProtocolVersion: 'TLSv1.2_2019',
            },
            WebACLId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
        },
    });
});
test('exhaustive example of props renders correctly and SSL method default', () => {
    const origin = test_origin_1.defaultOrigin();
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
    new lib_1.Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        certificate,
        comment: 'a test',
        defaultRootObject: 'index.html',
        domainNames: ['example.com'],
        enabled: false,
        enableIpv6: false,
        enableLogging: true,
        geoRestriction: lib_1.GeoRestriction.denylist('US', 'GB'),
        httpVersion: lib_1.HttpVersion.HTTP1_1,
        logFilePrefix: 'logs/',
        logIncludesCookies: true,
        minimumProtocolVersion: lib_1.SecurityPolicyProtocol.TLS_V1_2_2019,
        priceClass: lib_1.PriceClass.PRICE_CLASS_100,
        webAclId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            Aliases: ['example.com'],
            DefaultCacheBehavior: {
                CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                Compress: true,
                TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                ViewerProtocolPolicy: 'allow-all',
            },
            Comment: 'a test',
            DefaultRootObject: 'index.html',
            Enabled: false,
            HttpVersion: 'http1.1',
            IPV6Enabled: false,
            Logging: {
                Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
                IncludeCookies: true,
                Prefix: 'logs/',
            },
            Origins: [{
                    DomainName: 'www.example.com',
                    Id: 'StackMyDistOrigin1D6D5E535',
                    CustomOriginConfig: {
                        OriginProtocolPolicy: 'https-only',
                    },
                }],
            PriceClass: 'PriceClass_100',
            Restrictions: {
                GeoRestriction: {
                    Locations: ['US', 'GB'],
                    RestrictionType: 'blacklist',
                },
            },
            ViewerCertificate: {
                AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
                SslSupportMethod: 'sni-only',
                MinimumProtocolVersion: 'TLSv1.2_2019',
            },
            WebACLId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
        },
    });
});
test('ensure comment prop is not greater than max lenght', () => {
    const origin = test_origin_1.defaultOrigin();
    new lib_1.Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        comment: `Adding a comment longer than 128 characters should be trimmed and added the\x20
ellipsis so a user would know there was more to read and everything beyond this point should not show up`,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            DefaultCacheBehavior: {
                CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                Compress: true,
                TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                ViewerProtocolPolicy: 'allow-all',
            },
            Comment: `Adding a comment longer than 128 characters should be trimmed and added the\x20
ellipsis so a user would know there was more to ...`,
            Enabled: true,
            HttpVersion: 'http2',
            IPV6Enabled: true,
            Origins: [
                {
                    DomainName: 'www.example.com',
                    Id: 'StackMyDistOrigin1D6D5E535',
                    CustomOriginConfig: {
                        OriginProtocolPolicy: 'https-only',
                    },
                },
            ],
        },
    });
});
describe('multiple behaviors', () => {
    test('a second behavior can\'t be specified with the catch-all path pattern', () => {
        const origin = test_origin_1.defaultOrigin();
        expect(() => {
            new lib_1.Distribution(stack, 'MyDist', {
                defaultBehavior: { origin },
                additionalBehaviors: {
                    '*': { origin },
                },
            });
        }).toThrow(/Only the default behavior can have a path pattern of \'*\'/);
    });
    test('a second behavior can be added to the original origin', () => {
        const origin = test_origin_1.defaultOrigin();
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            additionalBehaviors: {
                'api/*': { origin },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                    Compress: true,
                    TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                    ViewerProtocolPolicy: 'allow-all',
                },
                CacheBehaviors: [{
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'api/*',
                        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                        ViewerProtocolPolicy: 'allow-all',
                    }],
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [{
                        DomainName: 'www.example.com',
                        Id: 'StackMyDistOrigin1D6D5E535',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    }],
            },
        });
    });
    test('a second behavior can be added to a secondary origin', () => {
        const origin = test_origin_1.defaultOrigin();
        const origin2 = test_origin_1.defaultOrigin('origin2.example.com');
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            additionalBehaviors: {
                'api/*': { origin: origin2 },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                    Compress: true,
                    TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                    ViewerProtocolPolicy: 'allow-all',
                },
                CacheBehaviors: [{
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'api/*',
                        TargetOriginId: 'StackMyDistOrigin20B96F3AD',
                        ViewerProtocolPolicy: 'allow-all',
                    }],
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [{
                        DomainName: 'www.example.com',
                        Id: 'StackMyDistOrigin1D6D5E535',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    },
                    {
                        DomainName: 'origin2.example.com',
                        Id: 'StackMyDistOrigin20B96F3AD',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    }],
            },
        });
    });
    test('behavior creation order is preserved', () => {
        const origin = test_origin_1.defaultOrigin();
        const origin2 = test_origin_1.defaultOrigin('origin2.example.com');
        const dist = new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            additionalBehaviors: {
                'api/1*': { origin: origin2 },
            },
        });
        dist.addBehavior('api/2*', origin);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                    Compress: true,
                    TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                    ViewerProtocolPolicy: 'allow-all',
                },
                CacheBehaviors: [{
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'api/1*',
                        TargetOriginId: 'StackMyDistOrigin20B96F3AD',
                        ViewerProtocolPolicy: 'allow-all',
                    },
                    {
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'api/2*',
                        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
                        ViewerProtocolPolicy: 'allow-all',
                    }],
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [{
                        DomainName: 'www.example.com',
                        Id: 'StackMyDistOrigin1D6D5E535',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    },
                    {
                        DomainName: 'origin2.example.com',
                        Id: 'StackMyDistOrigin20B96F3AD',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    }],
            },
        });
    });
});
describe('certificates', () => {
    test('should fail if using an imported certificate from outside of us-east-1', () => {
        const origin = test_origin_1.defaultOrigin();
        const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:eu-west-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
        expect(() => {
            new lib_1.Distribution(stack, 'Dist', {
                defaultBehavior: { origin },
                certificate,
            });
        }).toThrow(/Distribution certificates must be in the us-east-1 region and the certificate you provided is in eu-west-1./);
    });
    test('adding a certificate without a domain name throws', () => {
        const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
        expect(() => {
            new lib_1.Distribution(stack, 'Dist1', {
                defaultBehavior: { origin: test_origin_1.defaultOrigin() },
                certificate,
            });
        }).toThrow(/Must specify at least one domain name/);
        expect(() => {
            new lib_1.Distribution(stack, 'Dist2', {
                defaultBehavior: { origin: test_origin_1.defaultOrigin() },
                domainNames: [],
                certificate,
            });
        }).toThrow(/Must specify at least one domain name/);
    });
    test('use the TLSv1.2_2021 security policy by default', () => {
        const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
        new lib_1.Distribution(stack, 'Dist', {
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
            domainNames: ['example.com', 'www.example.com'],
            certificate,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Aliases: ['example.com', 'www.example.com'],
                ViewerCertificate: {
                    AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
                    SslSupportMethod: 'sni-only',
                    MinimumProtocolVersion: 'TLSv1.2_2021',
                },
            },
        });
    });
    test('adding a certificate with non default security policy protocol', () => {
        const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
        new lib_1.Distribution(stack, 'Dist', {
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
            domainNames: ['www.example.com'],
            sslSupportMethod: lib_1.SSLMethod.SNI,
            minimumProtocolVersion: lib_1.SecurityPolicyProtocol.TLS_V1_2016,
            certificate: certificate,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                ViewerCertificate: {
                    AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
                    SslSupportMethod: 'sni-only',
                    MinimumProtocolVersion: 'TLSv1_2016',
                },
            },
        });
    });
});
describe('custom error responses', () => {
    test('should fail if only the error code is provided', () => {
        const origin = test_origin_1.defaultOrigin();
        expect(() => {
            new lib_1.Distribution(stack, 'Dist', {
                defaultBehavior: { origin },
                errorResponses: [{ httpStatus: 404 }],
            });
        }).toThrow(/A custom error response without either a \'responseHttpStatus\', \'ttl\' or \'responsePagePath\' is not valid./);
    });
    test('should render the array of error configs if provided', () => {
        const origin = test_origin_1.defaultOrigin();
        new lib_1.Distribution(stack, 'Dist', {
            defaultBehavior: { origin },
            errorResponses: [{
                    // responseHttpStatus defaults to httpsStatus
                    httpStatus: 404,
                    responsePagePath: '/errors/404.html',
                },
                {
                    // without responsePagePath
                    httpStatus: 500,
                    ttl: core_1.Duration.seconds(2),
                },
                {
                    // with responseHttpStatus different from httpStatus
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                CustomErrorResponses: [
                    {
                        ErrorCode: 404,
                        ResponseCode: 404,
                        ResponsePagePath: '/errors/404.html',
                    },
                    {
                        ErrorCachingMinTTL: 2,
                        ErrorCode: 500,
                    },
                    {
                        ErrorCode: 403,
                        ResponseCode: 200,
                        ResponsePagePath: '/index.html',
                    },
                ],
            },
        });
    });
});
describe('logging', () => {
    test('does not include logging if disabled and no bucket provided', () => {
        const origin = test_origin_1.defaultOrigin();
        new lib_1.Distribution(stack, 'MyDist', { defaultBehavior: { origin } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Logging: assertions_1.Match.absent(),
            },
        });
    });
    test('throws error if logging disabled but bucket provided', () => {
        const origin = test_origin_1.defaultOrigin();
        expect(() => {
            new lib_1.Distribution(stack, 'MyDist', {
                defaultBehavior: { origin },
                enableLogging: false,
                logBucket: new s3.Bucket(stack, 'Bucket'),
            });
        }).toThrow(/Explicitly disabled logging but provided a logging bucket./);
    });
    test('creates bucket if none is provided', () => {
        const origin = test_origin_1.defaultOrigin();
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            enableLogging: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Logging: {
                    Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
                },
            },
        });
    });
    test('uses existing bucket if provided', () => {
        const origin = test_origin_1.defaultOrigin();
        const loggingBucket = new s3.Bucket(stack, 'MyLoggingBucket');
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            logBucket: loggingBucket,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Logging: {
                    Bucket: { 'Fn::GetAtt': ['MyLoggingBucket4382CD04', 'RegionalDomainName'] },
                },
            },
        });
    });
    test('can set prefix and cookies', () => {
        const origin = test_origin_1.defaultOrigin();
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            enableLogging: true,
            logFilePrefix: 'logs/',
            logIncludesCookies: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Logging: {
                    Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
                    IncludeCookies: true,
                    Prefix: 'logs/',
                },
            },
        });
    });
});
describe('with Lambda@Edge functions', () => {
    let lambdaFunction;
    let origin;
    beforeEach(() => {
        lambdaFunction = new lambda.Function(stack, 'Function', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('whatever'),
            handler: 'index.handler',
        });
        origin = test_origin_1.defaultOrigin();
    });
    test('can add an edge lambdas to the default behavior', () => {
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin,
                edgeLambdas: [
                    {
                        functionVersion: lambdaFunction.currentVersion,
                        eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                        includeBody: true,
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    LambdaFunctionAssociations: [
                        {
                            EventType: 'origin-request',
                            IncludeBody: true,
                            LambdaFunctionARN: {
                                Ref: 'FunctionCurrentVersion4E2B2261627f862ed5d048a0c695ee87fce6fb47',
                            },
                        },
                    ],
                },
            },
        });
    });
    test('edgelambda.amazonaws.com is added to the trust policy of lambda', () => {
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin,
                edgeLambdas: [
                    {
                        functionVersion: lambdaFunction.currentVersion,
                        eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'lambda.amazonaws.com',
                        },
                    },
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'edgelambda.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can add an edge lambdas to additional behaviors', () => {
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: { origin },
            additionalBehaviors: {
                'images/*': {
                    origin,
                    edgeLambdas: [
                        {
                            functionVersion: lambdaFunction.currentVersion,
                            eventType: lib_1.LambdaEdgeEventType.VIEWER_REQUEST,
                        },
                    ],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                CacheBehaviors: [
                    assertions_1.Match.objectLike({
                        PathPattern: 'images/*',
                        LambdaFunctionAssociations: [
                            {
                                EventType: 'viewer-request',
                                LambdaFunctionARN: {
                                    Ref: 'FunctionCurrentVersion4E2B2261627f862ed5d048a0c695ee87fce6fb47',
                                },
                            },
                        ],
                    }),
                ],
            },
        });
    });
    test('fails creation when attempting to add the $LATEST function version as an edge Lambda to the default behavior', () => {
        expect(() => {
            new lib_1.Distribution(stack, 'MyDist', {
                defaultBehavior: {
                    origin,
                    edgeLambdas: [
                        {
                            functionVersion: lambdaFunction.latestVersion,
                            eventType: lib_1.LambdaEdgeEventType.ORIGIN_RESPONSE,
                        },
                    ],
                },
            });
        }).toThrow(/\$LATEST function version cannot be used for Lambda@Edge/);
    });
    test('with removable env vars', () => {
        const envLambdaFunction = new lambda.Function(stack, 'EnvFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('whateverwithenv'),
            handler: 'index.handler',
        });
        envLambdaFunction.addEnvironment('KEY', 'value', { removeInEdge: true });
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin,
                edgeLambdas: [
                    {
                        functionVersion: envLambdaFunction.currentVersion,
                        eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: assertions_1.Match.absent(),
            Code: {
                ZipFile: 'whateverwithenv',
            },
        });
    });
    test('with incompatible env vars', () => {
        const envLambdaFunction = new lambda.Function(stack, 'EnvFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('whateverwithenv'),
            handler: 'index.handler',
            environment: {
                KEY: 'value',
            },
        });
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin,
                edgeLambdas: [
                    {
                        functionVersion: envLambdaFunction.currentVersion,
                        eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                    },
                ],
            },
        });
        expect(() => app.synth()).toThrow(/KEY/);
    });
    test('with singleton function', () => {
        const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
            uuid: 'singleton-for-cloudfront',
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromInline('code'),
            handler: 'index.handler',
        });
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin,
                edgeLambdas: [
                    {
                        functionVersion: singleton.currentVersion,
                        eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    LambdaFunctionAssociations: [
                        {
                            EventType: 'origin-request',
                            LambdaFunctionARN: {
                                Ref: 'SingletonLambdasingletonforcloudfrontCurrentVersion0078406340d5752510648adb0d76f136b832c5bd',
                            },
                        },
                    ],
                },
            },
        });
    });
});
describe('with CloudFront functions', () => {
    test('can add a CloudFront function to the default behavior', () => {
        new lib_1.Distribution(stack, 'MyDist', {
            defaultBehavior: {
                origin: test_origin_1.defaultOrigin(),
                functionAssociations: [
                    {
                        eventType: lib_1.FunctionEventType.VIEWER_REQUEST,
                        function: new lib_1.Function(stack, 'TestFunction', {
                            code: lib_1.FunctionCode.fromInline('foo'),
                        }),
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    FunctionAssociations: [
                        {
                            EventType: 'viewer-request',
                            FunctionARN: {
                                'Fn::GetAtt': [
                                    'TestFunction22AD90FC',
                                    'FunctionARN',
                                ],
                            },
                        },
                    ],
                },
            },
        });
    });
});
test('price class is included if provided', () => {
    const origin = test_origin_1.defaultOrigin();
    new lib_1.Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        priceClass: lib_1.PriceClass.PRICE_CLASS_200,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            PriceClass: 'PriceClass_200',
        },
    });
});
test('escape hatches are supported', () => {
    const dist = new lib_1.Distribution(stack, 'Dist', {
        defaultBehavior: { origin: test_origin_1.defaultOrigin },
    });
    const cfnDist = dist.node.defaultChild;
    cfnDist.addPropertyOverride('DistributionConfig.DefaultCacheBehavior.ForwardedValues.Headers', ['*']);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            DefaultCacheBehavior: {
                ForwardedValues: {
                    Headers: ['*'],
                },
            },
        },
    });
});
describe('origin IDs', () => {
    test('origin ID is limited to 128 characters', () => {
        const nestedStack = new core_1.Stack(stack, 'LongNameThatWillEndUpGeneratingAUniqueNodeIdThatIsLongerThanTheOneHundredAndTwentyEightCharacterLimit');
        new lib_1.Distribution(nestedStack, 'AReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForget', {
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
        });
        assertions_1.Template.fromStack(nestedStack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Origins: [assertions_1.Match.objectLike({
                        Id: 'ngerThanTheOneHundredAndTwentyEightCharacterLimitAReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForgetOrigin1D38031F9',
                    })],
            },
        });
    });
    test('origin group ID is limited to 128 characters', () => {
        const nestedStack = new core_1.Stack(stack, 'LongNameThatWillEndUpGeneratingAUniqueNodeIdThatIsLongerThanTheOneHundredAndTwentyEightCharacterLimit');
        new lib_1.Distribution(nestedStack, 'AReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForget', {
            defaultBehavior: { origin: test_origin_1.defaultOriginGroup() },
        });
        assertions_1.Template.fromStack(nestedStack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                OriginGroups: {
                    Items: [assertions_1.Match.objectLike({
                            Id: 'hanTheOneHundredAndTwentyEightCharacterLimitAReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForgetOriginGroup1B5CE3FE6',
                        })],
                },
            },
        });
    });
});
describe('custom origin ids', () => {
    test('test that originId param is respected', () => {
        const origin = test_origin_1.defaultOrigin(undefined, 'custom-origin-id');
        const distribution = new lib_1.Distribution(stack, 'Http1Distribution', {
            defaultBehavior: { origin },
            additionalBehaviors: {
                secondUsage: {
                    origin,
                },
            },
        });
        distribution.addBehavior('thirdUsage', origin);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                DefaultCacheBehavior: {
                    CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                    Compress: true,
                    TargetOriginId: 'custom-origin-id',
                    ViewerProtocolPolicy: 'allow-all',
                },
                CacheBehaviors: [{
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'secondUsage',
                        TargetOriginId: 'custom-origin-id',
                        ViewerProtocolPolicy: 'allow-all',
                    },
                    {
                        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                        Compress: true,
                        PathPattern: 'thirdUsage',
                        TargetOriginId: 'custom-origin-id',
                        ViewerProtocolPolicy: 'allow-all',
                    }],
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [{
                        DomainName: 'www.example.com',
                        Id: 'custom-origin-id',
                        CustomOriginConfig: {
                            OriginProtocolPolicy: 'https-only',
                        },
                    }],
            },
        });
    });
});
describe('supported HTTP versions', () => {
    test('setting HTTP/1.1 renders HttpVersion correctly', () => {
        new lib_1.Distribution(stack, 'Http1Distribution', {
            httpVersion: lib_1.HttpVersion.HTTP1_1,
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                HttpVersion: 'http1.1',
            },
        });
    });
    test('setting HTTP/2 renders HttpVersion correctly', () => {
        new lib_1.Distribution(stack, 'Http1Distribution', {
            httpVersion: lib_1.HttpVersion.HTTP2,
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                HttpVersion: 'http2',
            },
        });
    });
    test('setting HTTP/3 renders HttpVersion correctly', () => {
        new lib_1.Distribution(stack, 'Http1Distribution', {
            httpVersion: lib_1.HttpVersion.HTTP3,
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                HttpVersion: 'http3',
            },
        });
    });
    test('setting HTTP/2 and HTTP/3 renders HttpVersion correctly', () => {
        new lib_1.Distribution(stack, 'Http1Distribution', {
            httpVersion: lib_1.HttpVersion.HTTP2_AND_3,
            defaultBehavior: { origin: test_origin_1.defaultOrigin() },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                HttpVersion: 'http2and3',
            },
        });
    });
});
test('grants custom actions', () => {
    const distribution = new lib_1.Distribution(stack, 'Distribution', {
        defaultBehavior: { origin: test_origin_1.defaultOrigin() },
    });
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
    });
    distribution.grant(role, 'cloudfront:ListInvalidations', 'cloudfront:GetInvalidation');
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'cloudfront:ListInvalidations',
                        'cloudfront:GetInvalidation',
                    ],
                    Resource: {
                        'Fn::Join': [
                            '', [
                                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/',
                                { Ref: 'Distribution830FAC52' },
                            ],
                        ],
                    },
                },
            ],
        },
    });
});
test('grants createInvalidation', () => {
    const distribution = new lib_1.Distribution(stack, 'Distribution', {
        defaultBehavior: { origin: test_origin_1.defaultOrigin() },
    });
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
    });
    distribution.grantCreateInvalidation(role);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'cloudfront:CreateInvalidation',
                    Resource: {
                        'Fn::Join': [
                            '', [
                                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/',
                                { Ref: 'Distribution830FAC52' },
                            ],
                        ],
                    },
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdHJpYnV0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaXN0cmlidXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx1REFBdUQ7QUFDdkQsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5QyxzQ0FBc0M7QUFDdEMsd0NBQXFEO0FBQ3JELCtDQUFrRTtBQUNsRSxnQ0FhZ0I7QUFFaEIsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7UUFDOUIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFO0tBQy9DLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtJQUM3QyxNQUFNLE1BQU0sR0FBRywyQkFBYSxFQUFFLENBQUM7SUFDL0IsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbkUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsK0JBQStCLEVBQUU7UUFDL0Usa0JBQWtCLEVBQUU7WUFDbEIsb0JBQW9CLEVBQUU7Z0JBQ3BCLGFBQWEsRUFBRSxzQ0FBc0M7Z0JBQ3JELFFBQVEsRUFBRSxJQUFJO2dCQUNkLGNBQWMsRUFBRSw0QkFBNEI7Z0JBQzVDLG9CQUFvQixFQUFFLFdBQVc7YUFDbEM7WUFDRCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxPQUFPO1lBQ3BCLFdBQVcsRUFBRSxJQUFJO1lBQ2pC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QUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtRQUNsRSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsTUFBTSxFQUFFLCtCQUErQjtvQkFDdkMsUUFBUSxFQUFFO3dCQUNSLFVBQVUsRUFBRTs0QkFDVixFQUFFLEVBQUU7Z0NBQ0YsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsaUNBQWlDO2dDQUNwRSxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTs2QkFDaEM7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgZGVmYXVsdE9yaWdpbiwgZGVmYXVsdE9yaWdpbkdyb3VwIH0gZnJvbSAnLi90ZXN0LW9yaWdpbic7XG5pbXBvcnQge1xuICBDZm5EaXN0cmlidXRpb24sXG4gIERpc3RyaWJ1dGlvbixcbiAgRnVuY3Rpb24sXG4gIEZ1bmN0aW9uQ29kZSxcbiAgRnVuY3Rpb25FdmVudFR5cGUsXG4gIEdlb1Jlc3RyaWN0aW9uLFxuICBIdHRwVmVyc2lvbixcbiAgSU9yaWdpbixcbiAgTGFtYmRhRWRnZUV2ZW50VHlwZSxcbiAgUHJpY2VDbGFzcyxcbiAgU2VjdXJpdHlQb2xpY3lQcm90b2NvbCxcbiAgU1NMTWV0aG9kLFxufSBmcm9tICcuLi9saWInO1xuXG5sZXQgYXBwOiBBcHA7XG5sZXQgc3RhY2s6IFN0YWNrO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdtaW5pbWFsIGV4YW1wbGUgcmVuZGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHsgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9IH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgIERlZmF1bHRDYWNoZUJlaGF2aW9yOiB7XG4gICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgIFZpZXdlclByb3RvY29sUG9saWN5OiAnYWxsb3ctYWxsJyxcbiAgICAgIH0sXG4gICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgSHR0cFZlcnNpb246ICdodHRwMicsXG4gICAgICBJUFY2RW5hYmxlZDogdHJ1ZSxcbiAgICAgIE9yaWdpbnM6IFt7XG4gICAgICAgIERvbWFpbk5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICBJZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgQ3VzdG9tT3JpZ2luQ29uZmlnOiB7XG4gICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2V4aGF1c3RpdmUgZXhhbXBsZSBvZiBwcm9wcyByZW5kZXJzIGNvcnJlY3RseSBhbmQgU1NMIG1ldGhvZCBzbmktb25seScsICgpID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICBjb25zdCBjZXJ0aWZpY2F0ZSA9IGFjbS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssICdDZXJ0JywgJ2Fybjphd3M6YWNtOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y2VydGlmaWNhdGUvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgY2VydGlmaWNhdGUsXG4gICAgY29tbWVudDogJ2EgdGVzdCcsXG4gICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICBkb21haW5OYW1lczogWydleGFtcGxlLmNvbSddLFxuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIGVuYWJsZUlwdjY6IGZhbHNlLFxuICAgIGVuYWJsZUxvZ2dpbmc6IHRydWUsXG4gICAgZ2VvUmVzdHJpY3Rpb246IEdlb1Jlc3RyaWN0aW9uLmRlbnlsaXN0KCdVUycsICdHQicpLFxuICAgIGh0dHBWZXJzaW9uOiBIdHRwVmVyc2lvbi5IVFRQMV8xLFxuICAgIGxvZ0ZpbGVQcmVmaXg6ICdsb2dzLycsXG4gICAgbG9nSW5jbHVkZXNDb29raWVzOiB0cnVlLFxuICAgIHNzbFN1cHBvcnRNZXRob2Q6IFNTTE1ldGhvZC5TTkksXG4gICAgbWluaW11bVByb3RvY29sVmVyc2lvbjogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDE5LFxuICAgIHByaWNlQ2xhc3M6IFByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfMTAwLFxuICAgIHdlYkFjbElkOiAnNDczZTY0ZmQtZjMwYi00NzY1LTgxYTAtNjJhZDk2ZGQxNjdhJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgQWxpYXNlczogWydleGFtcGxlLmNvbSddLFxuICAgICAgRGVmYXVsdENhY2hlQmVoYXZpb3I6IHtcbiAgICAgICAgQ2FjaGVQb2xpY3lJZDogJzY1ODMyN2VhLWY4OWQtNGZhYi1hNjNkLTdlODg2MzllNThmNicsXG4gICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgfSxcbiAgICAgIENvbW1lbnQ6ICdhIHRlc3QnLFxuICAgICAgRGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgSHR0cFZlcnNpb246ICdodHRwMS4xJyxcbiAgICAgIElQVjZFbmFibGVkOiBmYWxzZSxcbiAgICAgIExvZ2dpbmc6IHtcbiAgICAgICAgQnVja2V0OiB7ICdGbjo6R2V0QXR0JzogWydNeURpc3RMb2dnaW5nQnVja2V0OUI4OTc2QkMnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10gfSxcbiAgICAgICAgSW5jbHVkZUNvb2tpZXM6IHRydWUsXG4gICAgICAgIFByZWZpeDogJ2xvZ3MvJyxcbiAgICAgIH0sXG4gICAgICBPcmlnaW5zOiBbe1xuICAgICAgICBEb21haW5OYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgIE9yaWdpblByb3RvY29sUG9saWN5OiAnaHR0cHMtb25seScsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICAgIFByaWNlQ2xhc3M6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICBSZXN0cmljdGlvbnM6IHtcbiAgICAgICAgR2VvUmVzdHJpY3Rpb246IHtcbiAgICAgICAgICBMb2NhdGlvbnM6IFsnVVMnLCAnR0InXSxcbiAgICAgICAgICBSZXN0cmljdGlvblR5cGU6ICdibGFja2xpc3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFZpZXdlckNlcnRpZmljYXRlOiB7XG4gICAgICAgIEFjbUNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInLFxuICAgICAgICBTc2xTdXBwb3J0TWV0aG9kOiAnc25pLW9ubHknLFxuICAgICAgICBNaW5pbXVtUHJvdG9jb2xWZXJzaW9uOiAnVExTdjEuMl8yMDE5JyxcbiAgICAgIH0sXG4gICAgICBXZWJBQ0xJZDogJzQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YScsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZXhoYXVzdGl2ZSBleGFtcGxlIG9mIHByb3BzIHJlbmRlcnMgY29ycmVjdGx5IGFuZCBTU0wgbWV0aG9kIHZpcCcsICgpID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICBjb25zdCBjZXJ0aWZpY2F0ZSA9IGFjbS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssICdDZXJ0JywgJ2Fybjphd3M6YWNtOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y2VydGlmaWNhdGUvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgY2VydGlmaWNhdGUsXG4gICAgY29tbWVudDogJ2EgdGVzdCcsXG4gICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICBkb21haW5OYW1lczogWydleGFtcGxlLmNvbSddLFxuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIGVuYWJsZUlwdjY6IGZhbHNlLFxuICAgIGVuYWJsZUxvZ2dpbmc6IHRydWUsXG4gICAgZ2VvUmVzdHJpY3Rpb246IEdlb1Jlc3RyaWN0aW9uLmRlbnlsaXN0KCdVUycsICdHQicpLFxuICAgIGh0dHBWZXJzaW9uOiBIdHRwVmVyc2lvbi5IVFRQMV8xLFxuICAgIGxvZ0ZpbGVQcmVmaXg6ICdsb2dzLycsXG4gICAgbG9nSW5jbHVkZXNDb29raWVzOiB0cnVlLFxuICAgIHNzbFN1cHBvcnRNZXRob2Q6IFNTTE1ldGhvZC5WSVAsXG4gICAgbWluaW11bVByb3RvY29sVmVyc2lvbjogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDE5LFxuICAgIHByaWNlQ2xhc3M6IFByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfMTAwLFxuICAgIHdlYkFjbElkOiAnNDczZTY0ZmQtZjMwYi00NzY1LTgxYTAtNjJhZDk2ZGQxNjdhJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgQWxpYXNlczogWydleGFtcGxlLmNvbSddLFxuICAgICAgRGVmYXVsdENhY2hlQmVoYXZpb3I6IHtcbiAgICAgICAgQ2FjaGVQb2xpY3lJZDogJzY1ODMyN2VhLWY4OWQtNGZhYi1hNjNkLTdlODg2MzllNThmNicsXG4gICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgfSxcbiAgICAgIENvbW1lbnQ6ICdhIHRlc3QnLFxuICAgICAgRGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgSHR0cFZlcnNpb246ICdodHRwMS4xJyxcbiAgICAgIElQVjZFbmFibGVkOiBmYWxzZSxcbiAgICAgIExvZ2dpbmc6IHtcbiAgICAgICAgQnVja2V0OiB7ICdGbjo6R2V0QXR0JzogWydNeURpc3RMb2dnaW5nQnVja2V0OUI4OTc2QkMnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10gfSxcbiAgICAgICAgSW5jbHVkZUNvb2tpZXM6IHRydWUsXG4gICAgICAgIFByZWZpeDogJ2xvZ3MvJyxcbiAgICAgIH0sXG4gICAgICBPcmlnaW5zOiBbe1xuICAgICAgICBEb21haW5OYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgIE9yaWdpblByb3RvY29sUG9saWN5OiAnaHR0cHMtb25seScsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICAgIFByaWNlQ2xhc3M6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICBSZXN0cmljdGlvbnM6IHtcbiAgICAgICAgR2VvUmVzdHJpY3Rpb246IHtcbiAgICAgICAgICBMb2NhdGlvbnM6IFsnVVMnLCAnR0InXSxcbiAgICAgICAgICBSZXN0cmljdGlvblR5cGU6ICdibGFja2xpc3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFZpZXdlckNlcnRpZmljYXRlOiB7XG4gICAgICAgIEFjbUNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInLFxuICAgICAgICBTc2xTdXBwb3J0TWV0aG9kOiAndmlwJyxcbiAgICAgICAgTWluaW11bVByb3RvY29sVmVyc2lvbjogJ1RMU3YxLjJfMjAxOScsXG4gICAgICB9LFxuICAgICAgV2ViQUNMSWQ6ICc0NzNlNjRmZC1mMzBiLTQ3NjUtODFhMC02MmFkOTZkZDE2N2EnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2V4aGF1c3RpdmUgZXhhbXBsZSBvZiBwcm9wcyByZW5kZXJzIGNvcnJlY3RseSBhbmQgU1NMIG1ldGhvZCBkZWZhdWx0JywgKCkgPT4ge1xuICBjb25zdCBvcmlnaW4gPSBkZWZhdWx0T3JpZ2luKCk7XG4gIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ0NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcblxuICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW4gfSxcbiAgICBjZXJ0aWZpY2F0ZSxcbiAgICBjb21tZW50OiAnYSB0ZXN0JyxcbiAgICBkZWZhdWx0Um9vdE9iamVjdDogJ2luZGV4Lmh0bWwnLFxuICAgIGRvbWFpbk5hbWVzOiBbJ2V4YW1wbGUuY29tJ10sXG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgZW5hYmxlSXB2NjogZmFsc2UsXG4gICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICBnZW9SZXN0cmljdGlvbjogR2VvUmVzdHJpY3Rpb24uZGVueWxpc3QoJ1VTJywgJ0dCJyksXG4gICAgaHR0cFZlcnNpb246IEh0dHBWZXJzaW9uLkhUVFAxXzEsXG4gICAgbG9nRmlsZVByZWZpeDogJ2xvZ3MvJyxcbiAgICBsb2dJbmNsdWRlc0Nvb2tpZXM6IHRydWUsXG4gICAgbWluaW11bVByb3RvY29sVmVyc2lvbjogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDE5LFxuICAgIHByaWNlQ2xhc3M6IFByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfMTAwLFxuICAgIHdlYkFjbElkOiAnNDczZTY0ZmQtZjMwYi00NzY1LTgxYTAtNjJhZDk2ZGQxNjdhJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgQWxpYXNlczogWydleGFtcGxlLmNvbSddLFxuICAgICAgRGVmYXVsdENhY2hlQmVoYXZpb3I6IHtcbiAgICAgICAgQ2FjaGVQb2xpY3lJZDogJzY1ODMyN2VhLWY4OWQtNGZhYi1hNjNkLTdlODg2MzllNThmNicsXG4gICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgfSxcbiAgICAgIENvbW1lbnQ6ICdhIHRlc3QnLFxuICAgICAgRGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgSHR0cFZlcnNpb246ICdodHRwMS4xJyxcbiAgICAgIElQVjZFbmFibGVkOiBmYWxzZSxcbiAgICAgIExvZ2dpbmc6IHtcbiAgICAgICAgQnVja2V0OiB7ICdGbjo6R2V0QXR0JzogWydNeURpc3RMb2dnaW5nQnVja2V0OUI4OTc2QkMnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10gfSxcbiAgICAgICAgSW5jbHVkZUNvb2tpZXM6IHRydWUsXG4gICAgICAgIFByZWZpeDogJ2xvZ3MvJyxcbiAgICAgIH0sXG4gICAgICBPcmlnaW5zOiBbe1xuICAgICAgICBEb21haW5OYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgIE9yaWdpblByb3RvY29sUG9saWN5OiAnaHR0cHMtb25seScsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICAgIFByaWNlQ2xhc3M6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICBSZXN0cmljdGlvbnM6IHtcbiAgICAgICAgR2VvUmVzdHJpY3Rpb246IHtcbiAgICAgICAgICBMb2NhdGlvbnM6IFsnVVMnLCAnR0InXSxcbiAgICAgICAgICBSZXN0cmljdGlvblR5cGU6ICdibGFja2xpc3QnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFZpZXdlckNlcnRpZmljYXRlOiB7XG4gICAgICAgIEFjbUNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInLFxuICAgICAgICBTc2xTdXBwb3J0TWV0aG9kOiAnc25pLW9ubHknLFxuICAgICAgICBNaW5pbXVtUHJvdG9jb2xWZXJzaW9uOiAnVExTdjEuMl8yMDE5JyxcbiAgICAgIH0sXG4gICAgICBXZWJBQ0xJZDogJzQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YScsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZW5zdXJlIGNvbW1lbnQgcHJvcCBpcyBub3QgZ3JlYXRlciB0aGFuIG1heCBsZW5naHQnLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgY29tbWVudDogYEFkZGluZyBhIGNvbW1lbnQgbG9uZ2VyIHRoYW4gMTI4IGNoYXJhY3RlcnMgc2hvdWxkIGJlIHRyaW1tZWQgYW5kIGFkZGVkIHRoZVxceDIwXG5lbGxpcHNpcyBzbyBhIHVzZXIgd291bGQga25vdyB0aGVyZSB3YXMgbW9yZSB0byByZWFkIGFuZCBldmVyeXRoaW5nIGJleW9uZCB0aGlzIHBvaW50IHNob3VsZCBub3Qgc2hvdyB1cGAsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgIERlZmF1bHRDYWNoZUJlaGF2aW9yOiB7XG4gICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgIFZpZXdlclByb3RvY29sUG9saWN5OiAnYWxsb3ctYWxsJyxcbiAgICAgIH0sXG4gICAgICBDb21tZW50OiBgQWRkaW5nIGEgY29tbWVudCBsb25nZXIgdGhhbiAxMjggY2hhcmFjdGVycyBzaG91bGQgYmUgdHJpbW1lZCBhbmQgYWRkZWQgdGhlXFx4MjBcbmVsbGlwc2lzIHNvIGEgdXNlciB3b3VsZCBrbm93IHRoZXJlIHdhcyBtb3JlIHRvIC4uLmAsXG4gICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgSHR0cFZlcnNpb246ICdodHRwMicsXG4gICAgICBJUFY2RW5hYmxlZDogdHJ1ZSxcbiAgICAgIE9yaWdpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIERvbWFpbk5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIElkOiAnU3RhY2tNeURpc3RPcmlnaW4xRDZENUU1MzUnLFxuICAgICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnbXVsdGlwbGUgYmVoYXZpb3JzJywgKCkgPT4ge1xuICB0ZXN0KCdhIHNlY29uZCBiZWhhdmlvciBjYW5cXCd0IGJlIHNwZWNpZmllZCB3aXRoIHRoZSBjYXRjaC1hbGwgcGF0aCBwYXR0ZXJuJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICAgIGFkZGl0aW9uYWxCZWhhdmlvcnM6IHtcbiAgICAgICAgICAnKic6IHsgb3JpZ2luIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9Pbmx5IHRoZSBkZWZhdWx0IGJlaGF2aW9yIGNhbiBoYXZlIGEgcGF0aCBwYXR0ZXJuIG9mIFxcJypcXCcvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYSBzZWNvbmQgYmVoYXZpb3IgY2FuIGJlIGFkZGVkIHRvIHRoZSBvcmlnaW5hbCBvcmlnaW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICBhZGRpdGlvbmFsQmVoYXZpb3JzOiB7XG4gICAgICAgICdhcGkvKic6IHsgb3JpZ2luIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIERlZmF1bHRDYWNoZUJlaGF2aW9yOiB7XG4gICAgICAgICAgQ2FjaGVQb2xpY3lJZDogJzY1ODMyN2VhLWY4OWQtNGZhYi1hNjNkLTdlODg2MzllNThmNicsXG4gICAgICAgICAgQ29tcHJlc3M6IHRydWUsXG4gICAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgICB9LFxuICAgICAgICBDYWNoZUJlaGF2aW9yczogW3tcbiAgICAgICAgICBDYWNoZVBvbGljeUlkOiAnNjU4MzI3ZWEtZjg5ZC00ZmFiLWE2M2QtN2U4ODYzOWU1OGY2JyxcbiAgICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICBQYXRoUGF0dGVybjogJ2FwaS8qJyxcbiAgICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgICBWaWV3ZXJQcm90b2NvbFBvbGljeTogJ2FsbG93LWFsbCcsXG4gICAgICAgIH1dLFxuICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICBIdHRwVmVyc2lvbjogJ2h0dHAyJyxcbiAgICAgICAgSVBWNkVuYWJsZWQ6IHRydWUsXG4gICAgICAgIE9yaWdpbnM6IFt7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgICAgQ3VzdG9tT3JpZ2luQ29uZmlnOiB7XG4gICAgICAgICAgICBPcmlnaW5Qcm90b2NvbFBvbGljeTogJ2h0dHBzLW9ubHknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYSBzZWNvbmQgYmVoYXZpb3IgY2FuIGJlIGFkZGVkIHRvIGEgc2Vjb25kYXJ5IG9yaWdpbicsICgpID0+IHtcbiAgICBjb25zdCBvcmlnaW4gPSBkZWZhdWx0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3JpZ2luMiA9IGRlZmF1bHRPcmlnaW4oJ29yaWdpbjIuZXhhbXBsZS5jb20nKTtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9LFxuICAgICAgYWRkaXRpb25hbEJlaGF2aW9yczoge1xuICAgICAgICAnYXBpLyonOiB7IG9yaWdpbjogb3JpZ2luMiB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBEZWZhdWx0Q2FjaGVCZWhhdmlvcjoge1xuICAgICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICAgIFRhcmdldE9yaWdpbklkOiAnU3RhY2tNeURpc3RPcmlnaW4xRDZENUU1MzUnLFxuICAgICAgICAgIFZpZXdlclByb3RvY29sUG9saWN5OiAnYWxsb3ctYWxsJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ2FjaGVCZWhhdmlvcnM6IFt7XG4gICAgICAgICAgQ2FjaGVQb2xpY3lJZDogJzY1ODMyN2VhLWY4OWQtNGZhYi1hNjNkLTdlODg2MzllNThmNicsXG4gICAgICAgICAgQ29tcHJlc3M6IHRydWUsXG4gICAgICAgICAgUGF0aFBhdHRlcm46ICdhcGkvKicsXG4gICAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdTdGFja015RGlzdE9yaWdpbjIwQjk2RjNBRCcsXG4gICAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgICB9XSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgSHR0cFZlcnNpb246ICdodHRwMicsXG4gICAgICAgIElQVjZFbmFibGVkOiB0cnVlLFxuICAgICAgICBPcmlnaW5zOiBbe1xuICAgICAgICAgIERvbWFpbk5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIElkOiAnU3RhY2tNeURpc3RPcmlnaW4xRDZENUU1MzUnLFxuICAgICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ29yaWdpbjIuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIElkOiAnU3RhY2tNeURpc3RPcmlnaW4yMEI5NkYzQUQnLFxuICAgICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2JlaGF2aW9yIGNyZWF0aW9uIG9yZGVyIGlzIHByZXNlcnZlZCcsICgpID0+IHtcbiAgICBjb25zdCBvcmlnaW4gPSBkZWZhdWx0T3JpZ2luKCk7XG4gICAgY29uc3Qgb3JpZ2luMiA9IGRlZmF1bHRPcmlnaW4oJ29yaWdpbjIuZXhhbXBsZS5jb20nKTtcbiAgICBjb25zdCBkaXN0ID0gbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW4gfSxcbiAgICAgIGFkZGl0aW9uYWxCZWhhdmlvcnM6IHtcbiAgICAgICAgJ2FwaS8xKic6IHsgb3JpZ2luOiBvcmlnaW4yIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGRpc3QuYWRkQmVoYXZpb3IoJ2FwaS8yKicsIG9yaWdpbik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgICAgRGVmYXVsdENhY2hlQmVoYXZpb3I6IHtcbiAgICAgICAgICBDYWNoZVBvbGljeUlkOiAnNjU4MzI3ZWEtZjg5ZC00ZmFiLWE2M2QtN2U4ODYzOWU1OGY2JyxcbiAgICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMUQ2RDVFNTM1JyxcbiAgICAgICAgICBWaWV3ZXJQcm90b2NvbFBvbGljeTogJ2FsbG93LWFsbCcsXG4gICAgICAgIH0sXG4gICAgICAgIENhY2hlQmVoYXZpb3JzOiBbe1xuICAgICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICAgIFBhdGhQYXR0ZXJuOiAnYXBpLzEqJyxcbiAgICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ1N0YWNrTXlEaXN0T3JpZ2luMjBCOTZGM0FEJyxcbiAgICAgICAgICBWaWV3ZXJQcm90b2NvbFBvbGljeTogJ2FsbG93LWFsbCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBDYWNoZVBvbGljeUlkOiAnNjU4MzI3ZWEtZjg5ZC00ZmFiLWE2M2QtN2U4ODYzOWU1OGY2JyxcbiAgICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICBQYXRoUGF0dGVybjogJ2FwaS8yKicsXG4gICAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdTdGFja015RGlzdE9yaWdpbjFENkQ1RTUzNScsXG4gICAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgICB9XSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgSHR0cFZlcnNpb246ICdodHRwMicsXG4gICAgICAgIElQVjZFbmFibGVkOiB0cnVlLFxuICAgICAgICBPcmlnaW5zOiBbe1xuICAgICAgICAgIERvbWFpbk5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIElkOiAnU3RhY2tNeURpc3RPcmlnaW4xRDZENUU1MzUnLFxuICAgICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ29yaWdpbjIuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIElkOiAnU3RhY2tNeURpc3RPcmlnaW4yMEI5NkYzQUQnLFxuICAgICAgICAgIEN1c3RvbU9yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjZXJ0aWZpY2F0ZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ3Nob3VsZCBmYWlsIGlmIHVzaW5nIGFuIGltcG9ydGVkIGNlcnRpZmljYXRlIGZyb20gb3V0c2lkZSBvZiB1cy1lYXN0LTEnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ0NlcnQnLCAnYXJuOmF3czphY206ZXUtd2VzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdCcsIHtcbiAgICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9LFxuICAgICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Rpc3RyaWJ1dGlvbiBjZXJ0aWZpY2F0ZXMgbXVzdCBiZSBpbiB0aGUgdXMtZWFzdC0xIHJlZ2lvbiBhbmQgdGhlIGNlcnRpZmljYXRlIHlvdSBwcm92aWRlZCBpcyBpbiBldS13ZXN0LTEuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBhIGNlcnRpZmljYXRlIHdpdGhvdXQgYSBkb21haW4gbmFtZSB0aHJvd3MnLCAoKSA9PiB7XG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBhY20uQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnQ2VydCcsICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNlcnRpZmljYXRlLzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0MScsIHtcbiAgICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogZGVmYXVsdE9yaWdpbigpIH0sXG4gICAgICAgIGNlcnRpZmljYXRlLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvTXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBkb21haW4gbmFtZS8pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0MicsIHtcbiAgICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogZGVmYXVsdE9yaWdpbigpIH0sXG4gICAgICAgIGRvbWFpbk5hbWVzOiBbXSxcbiAgICAgICAgY2VydGlmaWNhdGUsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9NdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIGRvbWFpbiBuYW1lLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSB0aGUgVExTdjEuMl8yMDIxIHNlY3VyaXR5IHBvbGljeSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ0NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcblxuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogZGVmYXVsdE9yaWdpbigpIH0sXG4gICAgICBkb21haW5OYW1lczogWydleGFtcGxlLmNvbScsICd3d3cuZXhhbXBsZS5jb20nXSxcbiAgICAgIGNlcnRpZmljYXRlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIEFsaWFzZXM6IFsnZXhhbXBsZS5jb20nLCAnd3d3LmV4YW1wbGUuY29tJ10sXG4gICAgICAgIFZpZXdlckNlcnRpZmljYXRlOiB7XG4gICAgICAgICAgQWNtQ2VydGlmaWNhdGVBcm46ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNlcnRpZmljYXRlLzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgU3NsU3VwcG9ydE1ldGhvZDogJ3NuaS1vbmx5JyxcbiAgICAgICAgICBNaW5pbXVtUHJvdG9jb2xWZXJzaW9uOiAnVExTdjEuMl8yMDIxJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBhIGNlcnRpZmljYXRlIHdpdGggbm9uIGRlZmF1bHQgc2VjdXJpdHkgcG9saWN5IHByb3RvY29sJywgKCkgPT4ge1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ0NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4oKSB9LFxuICAgICAgZG9tYWluTmFtZXM6IFsnd3d3LmV4YW1wbGUuY29tJ10sXG4gICAgICBzc2xTdXBwb3J0TWV0aG9kOiBTU0xNZXRob2QuU05JLFxuICAgICAgbWluaW11bVByb3RvY29sVmVyc2lvbjogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMjAxNixcbiAgICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBWaWV3ZXJDZXJ0aWZpY2F0ZToge1xuICAgICAgICAgIEFjbUNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjZXJ0aWZpY2F0ZS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInLFxuICAgICAgICAgIFNzbFN1cHBvcnRNZXRob2Q6ICdzbmktb25seScsXG4gICAgICAgICAgTWluaW11bVByb3RvY29sVmVyc2lvbjogJ1RMU3YxXzIwMTYnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2N1c3RvbSBlcnJvciByZXNwb25zZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ3Nob3VsZCBmYWlsIGlmIG9ubHkgdGhlIGVycm9yIGNvZGUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0Jywge1xuICAgICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICAgIGVycm9yUmVzcG9uc2VzOiBbeyBodHRwU3RhdHVzOiA0MDQgfV0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9BIGN1c3RvbSBlcnJvciByZXNwb25zZSB3aXRob3V0IGVpdGhlciBhIFxcJ3Jlc3BvbnNlSHR0cFN0YXR1c1xcJywgXFwndHRsXFwnIG9yIFxcJ3Jlc3BvbnNlUGFnZVBhdGhcXCcgaXMgbm90IHZhbGlkLi8pO1xuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgcmVuZGVyIHRoZSBhcnJheSBvZiBlcnJvciBjb25maWdzIGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW4gfSxcbiAgICAgIGVycm9yUmVzcG9uc2VzOiBbe1xuICAgICAgICAvLyByZXNwb25zZUh0dHBTdGF0dXMgZGVmYXVsdHMgdG8gaHR0cHNTdGF0dXNcbiAgICAgICAgaHR0cFN0YXR1czogNDA0LFxuICAgICAgICByZXNwb25zZVBhZ2VQYXRoOiAnL2Vycm9ycy80MDQuaHRtbCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyB3aXRob3V0IHJlc3BvbnNlUGFnZVBhdGhcbiAgICAgICAgaHR0cFN0YXR1czogNTAwLFxuICAgICAgICB0dGw6IER1cmF0aW9uLnNlY29uZHMoMiksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyB3aXRoIHJlc3BvbnNlSHR0cFN0YXR1cyBkaWZmZXJlbnQgZnJvbSBodHRwU3RhdHVzXG4gICAgICAgIGh0dHBTdGF0dXM6IDQwMyxcbiAgICAgICAgcmVzcG9uc2VIdHRwU3RhdHVzOiAyMDAsXG4gICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCcsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBDdXN0b21FcnJvclJlc3BvbnNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVycm9yQ29kZTogNDA0LFxuICAgICAgICAgICAgUmVzcG9uc2VDb2RlOiA0MDQsXG4gICAgICAgICAgICBSZXNwb25zZVBhZ2VQYXRoOiAnL2Vycm9ycy80MDQuaHRtbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFcnJvckNhY2hpbmdNaW5UVEw6IDIsXG4gICAgICAgICAgICBFcnJvckNvZGU6IDUwMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVycm9yQ29kZTogNDAzLFxuICAgICAgICAgICAgUmVzcG9uc2VDb2RlOiAyMDAsXG4gICAgICAgICAgICBSZXNwb25zZVBhZ2VQYXRoOiAnL2luZGV4Lmh0bWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnbG9nZ2luZycsICgpID0+IHtcbiAgdGVzdCgnZG9lcyBub3QgaW5jbHVkZSBsb2dnaW5nIGlmIGRpc2FibGVkIGFuZCBubyBidWNrZXQgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7IGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW4gfSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBMb2dnaW5nOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciBpZiBsb2dnaW5nIGRpc2FibGVkIGJ1dCBidWNrZXQgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW4gfSxcbiAgICAgICAgZW5hYmxlTG9nZ2luZzogZmFsc2UsXG4gICAgICAgIGxvZ0J1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvRXhwbGljaXRseSBkaXNhYmxlZCBsb2dnaW5nIGJ1dCBwcm92aWRlZCBhIGxvZ2dpbmcgYnVja2V0Li8pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIGJ1Y2tldCBpZiBub25lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9LFxuICAgICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBMb2dnaW5nOiB7XG4gICAgICAgICAgQnVja2V0OiB7ICdGbjo6R2V0QXR0JzogWydNeURpc3RMb2dnaW5nQnVja2V0OUI4OTc2QkMnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXMgZXhpc3RpbmcgYnVja2V0IGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgICBjb25zdCBsb2dnaW5nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015TG9nZ2luZ0J1Y2tldCcpO1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICBsb2dCdWNrZXQ6IGxvZ2dpbmdCdWNrZXQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgICAgTG9nZ2luZzoge1xuICAgICAgICAgIEJ1Y2tldDogeyAnRm46OkdldEF0dCc6IFsnTXlMb2dnaW5nQnVja2V0NDM4MkNEMDQnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzZXQgcHJlZml4IGFuZCBjb29raWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9LFxuICAgICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICAgIGxvZ0ZpbGVQcmVmaXg6ICdsb2dzLycsXG4gICAgICBsb2dJbmNsdWRlc0Nvb2tpZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgICAgTG9nZ2luZzoge1xuICAgICAgICAgIEJ1Y2tldDogeyAnRm46OkdldEF0dCc6IFsnTXlEaXN0TG9nZ2luZ0J1Y2tldDlCODk3NkJDJywgJ1JlZ2lvbmFsRG9tYWluTmFtZSddIH0sXG4gICAgICAgICAgSW5jbHVkZUNvb2tpZXM6IHRydWUsXG4gICAgICAgICAgUHJlZml4OiAnbG9ncy8nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3dpdGggTGFtYmRhQEVkZ2UgZnVuY3Rpb25zJywgKCkgPT4ge1xuICBsZXQgbGFtYmRhRnVuY3Rpb246IGxhbWJkYS5GdW5jdGlvbjtcbiAgbGV0IG9yaWdpbjogSU9yaWdpbjtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnd2hhdGV2ZXInKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIG9yaWdpbiA9IGRlZmF1bHRPcmlnaW4oKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBhbiBlZGdlIGxhbWJkYXMgdG8gdGhlIGRlZmF1bHQgYmVoYXZpb3InLCAoKSA9PiB7XG4gICAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW4sXG4gICAgICAgIGVkZ2VMYW1iZGFzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnVuY3Rpb25WZXJzaW9uOiBsYW1iZGFGdW5jdGlvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVRVUVTVCxcbiAgICAgICAgICAgIGluY2x1ZGVCb2R5OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIERlZmF1bHRDYWNoZUJlaGF2aW9yOiB7XG4gICAgICAgICAgTGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRXZlbnRUeXBlOiAnb3JpZ2luLXJlcXVlc3QnLFxuICAgICAgICAgICAgICBJbmNsdWRlQm9keTogdHJ1ZSxcbiAgICAgICAgICAgICAgTGFtYmRhRnVuY3Rpb25BUk46IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdGdW5jdGlvbkN1cnJlbnRWZXJzaW9uNEUyQjIyNjE2MjdmODYyZWQ1ZDA0OGEwYzY5NWVlODdmY2U2ZmI0NycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlZGdlbGFtYmRhLmFtYXpvbmF3cy5jb20gaXMgYWRkZWQgdG8gdGhlIHRydXN0IHBvbGljeSBvZiBsYW1iZGEnLCAoKSA9PiB7XG4gICAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICBvcmlnaW4sXG4gICAgICAgIGVkZ2VMYW1iZGFzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZnVuY3Rpb25WZXJzaW9uOiBsYW1iZGFGdW5jdGlvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVRVUVTVCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2VkZ2VsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgYW4gZWRnZSBsYW1iZGFzIHRvIGFkZGl0aW9uYWwgYmVoYXZpb3JzJywgKCkgPT4ge1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICBhZGRpdGlvbmFsQmVoYXZpb3JzOiB7XG4gICAgICAgICdpbWFnZXMvKic6IHtcbiAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgZWRnZUxhbWJkYXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZnVuY3Rpb25WZXJzaW9uOiBsYW1iZGFGdW5jdGlvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgICAgZXZlbnRUeXBlOiBMYW1iZGFFZGdlRXZlbnRUeXBlLlZJRVdFUl9SRVFVRVNULFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBDYWNoZUJlaGF2aW9yczogW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgUGF0aFBhdHRlcm46ICdpbWFnZXMvKicsXG4gICAgICAgICAgICBMYW1iZGFGdW5jdGlvbkFzc29jaWF0aW9uczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRXZlbnRUeXBlOiAndmlld2VyLXJlcXVlc3QnLFxuICAgICAgICAgICAgICAgIExhbWJkYUZ1bmN0aW9uQVJOOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdGdW5jdGlvbkN1cnJlbnRWZXJzaW9uNEUyQjIyNjE2MjdmODYyZWQ1ZDA0OGEwYzY5NWVlODdmY2U2ZmI0NycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBjcmVhdGlvbiB3aGVuIGF0dGVtcHRpbmcgdG8gYWRkIHRoZSAkTEFURVNUIGZ1bmN0aW9uIHZlcnNpb24gYXMgYW4gZWRnZSBMYW1iZGEgdG8gdGhlIGRlZmF1bHQgYmVoYXZpb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICBlZGdlTGFtYmRhczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmdW5jdGlvblZlcnNpb246IGxhbWJkYUZ1bmN0aW9uLmxhdGVzdFZlcnNpb24sXG4gICAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVTUE9OU0UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9cXCRMQVRFU1QgZnVuY3Rpb24gdmVyc2lvbiBjYW5ub3QgYmUgdXNlZCBmb3IgTGFtYmRhQEVkZ2UvKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCByZW1vdmFibGUgZW52IHZhcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgZW52TGFtYmRhRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRW52RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ3doYXRldmVyd2l0aGVudicpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuICAgIGVudkxhbWJkYUZ1bmN0aW9uLmFkZEVudmlyb25tZW50KCdLRVknLCAndmFsdWUnLCB7IHJlbW92ZUluRWRnZTogdHJ1ZSB9KTtcblxuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3QnLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICAgICAgb3JpZ2luLFxuICAgICAgICBlZGdlTGFtYmRhczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uVmVyc2lvbjogZW52TGFtYmRhRnVuY3Rpb24uY3VycmVudFZlcnNpb24sXG4gICAgICAgICAgICBldmVudFR5cGU6IExhbWJkYUVkZ2VFdmVudFR5cGUuT1JJR0lOX1JFUVVFU1QsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRW52aXJvbm1lbnQ6IE1hdGNoLmFic2VudCgpLFxuICAgICAgQ29kZToge1xuICAgICAgICBaaXBGaWxlOiAnd2hhdGV2ZXJ3aXRoZW52JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggaW5jb21wYXRpYmxlIGVudiB2YXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IGVudkxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0VudkZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCd3aGF0ZXZlcndpdGhlbnYnKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEtFWTogJ3ZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICAgIG9yaWdpbixcbiAgICAgICAgZWRnZUxhbWJkYXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmdW5jdGlvblZlcnNpb246IGVudkxhbWJkYUZ1bmN0aW9uLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgICAgICAgZXZlbnRUeXBlOiBMYW1iZGFFZGdlRXZlbnRUeXBlLk9SSUdJTl9SRVFVRVNULFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9LRVkvKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBzaW5nbGV0b24gZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc2luZ2xldG9uID0gbmV3IGxhbWJkYS5TaW5nbGV0b25GdW5jdGlvbihzdGFjaywgJ1NpbmdsZXRvbicsIHtcbiAgICAgIHV1aWQ6ICdzaW5nbGV0b24tZm9yLWNsb3VkZnJvbnQnLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdjb2RlJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICAgIG9yaWdpbixcbiAgICAgICAgZWRnZUxhbWJkYXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmdW5jdGlvblZlcnNpb246IHNpbmdsZXRvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVRVUVTVCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBEZWZhdWx0Q2FjaGVCZWhhdmlvcjoge1xuICAgICAgICAgIExhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEV2ZW50VHlwZTogJ29yaWdpbi1yZXF1ZXN0JyxcbiAgICAgICAgICAgICAgTGFtYmRhRnVuY3Rpb25BUk46IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdTaW5nbGV0b25MYW1iZGFzaW5nbGV0b25mb3JjbG91ZGZyb250Q3VycmVudFZlcnNpb24wMDc4NDA2MzQwZDU3NTI1MTA2NDhhZGIwZDc2ZjEzNmI4MzJjNWJkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd3aXRoIENsb3VkRnJvbnQgZnVuY3Rpb25zJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gYWRkIGEgQ2xvdWRGcm9udCBmdW5jdGlvbiB0byB0aGUgZGVmYXVsdCBiZWhhdmlvcicsICgpID0+IHtcbiAgICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0Jywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICAgIG9yaWdpbjogZGVmYXVsdE9yaWdpbigpLFxuICAgICAgICBmdW5jdGlvbkFzc29jaWF0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZTogRnVuY3Rpb25FdmVudFR5cGUuVklFV0VSX1JFUVVFU1QsXG4gICAgICAgICAgICBmdW5jdGlvbjogbmV3IEZ1bmN0aW9uKHN0YWNrLCAnVGVzdEZ1bmN0aW9uJywge1xuICAgICAgICAgICAgICBjb2RlOiBGdW5jdGlvbkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBEZWZhdWx0Q2FjaGVCZWhhdmlvcjoge1xuICAgICAgICAgIEZ1bmN0aW9uQXNzb2NpYXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEV2ZW50VHlwZTogJ3ZpZXdlci1yZXF1ZXN0JyxcbiAgICAgICAgICAgICAgRnVuY3Rpb25BUk46IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdUZXN0RnVuY3Rpb24yMkFEOTBGQycsXG4gICAgICAgICAgICAgICAgICAnRnVuY3Rpb25BUk4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdwcmljZSBjbGFzcyBpcyBpbmNsdWRlZCBpZiBwcm92aWRlZCcsICgpID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbigpO1xuICBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdCcsIHtcbiAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgcHJpY2VDbGFzczogUHJpY2VDbGFzcy5QUklDRV9DTEFTU18yMDAsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgIFByaWNlQ2xhc3M6ICdQcmljZUNsYXNzXzIwMCcsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZXNjYXBlIGhhdGNoZXMgYXJlIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgY29uc3QgZGlzdCA9IG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0Jywge1xuICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4gfSxcbiAgfSk7XG4gIGNvbnN0IGNmbkRpc3QgPSBkaXN0Lm5vZGUuZGVmYXVsdENoaWxkIGFzIENmbkRpc3RyaWJ1dGlvbjtcbiAgY2ZuRGlzdC5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdEaXN0cmlidXRpb25Db25maWcuRGVmYXVsdENhY2hlQmVoYXZpb3IuRm9yd2FyZGVkVmFsdWVzLkhlYWRlcnMnLCBbJyonXSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgRGVmYXVsdENhY2hlQmVoYXZpb3I6IHtcbiAgICAgICAgRm9yd2FyZGVkVmFsdWVzOiB7XG4gICAgICAgICAgSGVhZGVyczogWycqJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdvcmlnaW4gSURzJywgKCkgPT4ge1xuICB0ZXN0KCdvcmlnaW4gSUQgaXMgbGltaXRlZCB0byAxMjggY2hhcmFjdGVycycsICgpID0+IHtcbiAgICBjb25zdCBuZXN0ZWRTdGFjayA9IG5ldyBTdGFjayhzdGFjaywgJ0xvbmdOYW1lVGhhdFdpbGxFbmRVcEdlbmVyYXRpbmdBVW5pcXVlTm9kZUlkVGhhdElzTG9uZ2VyVGhhblRoZU9uZUh1bmRyZWRBbmRUd2VudHlFaWdodENoYXJhY3RlckxpbWl0Jyk7XG5cbiAgICBuZXcgRGlzdHJpYnV0aW9uKG5lc3RlZFN0YWNrLCAnQVJlYWxseUF3ZXNvbWVEaXN0cmlidXRpb25XaXRoQU1lbW9yYWJsZU5hbWVUaGF0SVdpbGxOZXZlckZvcmdldCcsIHtcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4oKSB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIE9yaWdpbnM6IFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBJZDogJ25nZXJUaGFuVGhlT25lSHVuZHJlZEFuZFR3ZW50eUVpZ2h0Q2hhcmFjdGVyTGltaXRBUmVhbGx5QXdlc29tZURpc3RyaWJ1dGlvbldpdGhBTWVtb3JhYmxlTmFtZVRoYXRJV2lsbE5ldmVyRm9yZ2V0T3JpZ2luMUQzODAzMUY5JyxcbiAgICAgICAgfSldLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnb3JpZ2luIGdyb3VwIElEIGlzIGxpbWl0ZWQgdG8gMTI4IGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgbmVzdGVkU3RhY2sgPSBuZXcgU3RhY2soc3RhY2ssICdMb25nTmFtZVRoYXRXaWxsRW5kVXBHZW5lcmF0aW5nQVVuaXF1ZU5vZGVJZFRoYXRJc0xvbmdlclRoYW5UaGVPbmVIdW5kcmVkQW5kVHdlbnR5RWlnaHRDaGFyYWN0ZXJMaW1pdCcpO1xuXG4gICAgbmV3IERpc3RyaWJ1dGlvbihuZXN0ZWRTdGFjaywgJ0FSZWFsbHlBd2Vzb21lRGlzdHJpYnV0aW9uV2l0aEFNZW1vcmFibGVOYW1lVGhhdElXaWxsTmV2ZXJGb3JnZXQnLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luOiBkZWZhdWx0T3JpZ2luR3JvdXAoKSB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIE9yaWdpbkdyb3Vwczoge1xuICAgICAgICAgIEl0ZW1zOiBbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJZDogJ2hhblRoZU9uZUh1bmRyZWRBbmRUd2VudHlFaWdodENoYXJhY3RlckxpbWl0QVJlYWxseUF3ZXNvbWVEaXN0cmlidXRpb25XaXRoQU1lbW9yYWJsZU5hbWVUaGF0SVdpbGxOZXZlckZvcmdldE9yaWdpbkdyb3VwMUI1Q0UzRkU2JyxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY3VzdG9tIG9yaWdpbiBpZHMnLCAoKSA9PiB7XG4gIHRlc3QoJ3Rlc3QgdGhhdCBvcmlnaW5JZCBwYXJhbSBpcyByZXNwZWN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luID0gZGVmYXVsdE9yaWdpbih1bmRlZmluZWQsICdjdXN0b20tb3JpZ2luLWlkJyk7XG5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnSHR0cDFEaXN0cmlidXRpb24nLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luIH0sXG4gICAgICBhZGRpdGlvbmFsQmVoYXZpb3JzOiB7XG4gICAgICAgIHNlY29uZFVzYWdlOiB7XG4gICAgICAgICAgb3JpZ2luLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBkaXN0cmlidXRpb24uYWRkQmVoYXZpb3IoXG4gICAgICAndGhpcmRVc2FnZScsXG4gICAgICBvcmlnaW4sXG4gICAgKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBEZWZhdWx0Q2FjaGVCZWhhdmlvcjoge1xuICAgICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICAgIFRhcmdldE9yaWdpbklkOiAnY3VzdG9tLW9yaWdpbi1pZCcsXG4gICAgICAgICAgVmlld2VyUHJvdG9jb2xQb2xpY3k6ICdhbGxvdy1hbGwnLFxuICAgICAgICB9LFxuICAgICAgICBDYWNoZUJlaGF2aW9yczogW3tcbiAgICAgICAgICBDYWNoZVBvbGljeUlkOiAnNjU4MzI3ZWEtZjg5ZC00ZmFiLWE2M2QtN2U4ODYzOWU1OGY2JyxcbiAgICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICBQYXRoUGF0dGVybjogJ3NlY29uZFVzYWdlJyxcbiAgICAgICAgICBUYXJnZXRPcmlnaW5JZDogJ2N1c3RvbS1vcmlnaW4taWQnLFxuICAgICAgICAgIFZpZXdlclByb3RvY29sUG9saWN5OiAnYWxsb3ctYWxsJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIENhY2hlUG9saWN5SWQ6ICc2NTgzMjdlYS1mODlkLTRmYWItYTYzZC03ZTg4NjM5ZTU4ZjYnLFxuICAgICAgICAgIENvbXByZXNzOiB0cnVlLFxuICAgICAgICAgIFBhdGhQYXR0ZXJuOiAndGhpcmRVc2FnZScsXG4gICAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdjdXN0b20tb3JpZ2luLWlkJyxcbiAgICAgICAgICBWaWV3ZXJQcm90b2NvbFBvbGljeTogJ2FsbG93LWFsbCcsXG4gICAgICAgIH1dLFxuICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICBIdHRwVmVyc2lvbjogJ2h0dHAyJyxcbiAgICAgICAgSVBWNkVuYWJsZWQ6IHRydWUsXG4gICAgICAgIE9yaWdpbnM6IFt7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgSWQ6ICdjdXN0b20tb3JpZ2luLWlkJyxcbiAgICAgICAgICBDdXN0b21PcmlnaW5Db25maWc6IHtcbiAgICAgICAgICAgIE9yaWdpblByb3RvY29sUG9saWN5OiAnaHR0cHMtb25seScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc3VwcG9ydGVkIEhUVFAgdmVyc2lvbnMnLCAoKSA9PiB7XG4gIHRlc3QoJ3NldHRpbmcgSFRUUC8xLjEgcmVuZGVycyBIdHRwVmVyc2lvbiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ0h0dHAxRGlzdHJpYnV0aW9uJywge1xuICAgICAgaHR0cFZlcnNpb246IEh0dHBWZXJzaW9uLkhUVFAxXzEsXG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luOiBkZWZhdWx0T3JpZ2luKCkgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBIdHRwVmVyc2lvbjogJ2h0dHAxLjEnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG4gIHRlc3QoJ3NldHRpbmcgSFRUUC8yIHJlbmRlcnMgSHR0cFZlcnNpb24gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdIdHRwMURpc3RyaWJ1dGlvbicsIHtcbiAgICAgIGh0dHBWZXJzaW9uOiBIdHRwVmVyc2lvbi5IVFRQMixcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4oKSB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIEh0dHBWZXJzaW9uOiAnaHR0cDInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG4gIHRlc3QoJ3NldHRpbmcgSFRUUC8zIHJlbmRlcnMgSHR0cFZlcnNpb24gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdIdHRwMURpc3RyaWJ1dGlvbicsIHtcbiAgICAgIGh0dHBWZXJzaW9uOiBIdHRwVmVyc2lvbi5IVFRQMyxcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4oKSB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIEh0dHBWZXJzaW9uOiAnaHR0cDMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG4gIHRlc3QoJ3NldHRpbmcgSFRUUC8yIGFuZCBIVFRQLzMgcmVuZGVycyBIdHRwVmVyc2lvbiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgbmV3IERpc3RyaWJ1dGlvbihzdGFjaywgJ0h0dHAxRGlzdHJpYnV0aW9uJywge1xuICAgICAgaHR0cFZlcnNpb246IEh0dHBWZXJzaW9uLkhUVFAyX0FORF8zLFxuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogZGVmYXVsdE9yaWdpbigpIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgICAgSHR0cFZlcnNpb246ICdodHRwMmFuZDMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnZ3JhbnRzIGN1c3RvbSBhY3Rpb25zJywgKCkgPT4ge1xuICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgIGRlZmF1bHRCZWhhdmlvcjogeyBvcmlnaW46IGRlZmF1bHRPcmlnaW4oKSB9LFxuICB9KTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gIH0pO1xuICBkaXN0cmlidXRpb24uZ3JhbnQocm9sZSwgJ2Nsb3VkZnJvbnQ6TGlzdEludmFsaWRhdGlvbnMnLCAnY2xvdWRmcm9udDpHZXRJbnZhbGlkYXRpb24nKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdjbG91ZGZyb250Okxpc3RJbnZhbGlkYXRpb25zJyxcbiAgICAgICAgICAgICdjbG91ZGZyb250OkdldEludmFsaWRhdGlvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpjbG91ZGZyb250OjoxMjM0OmRpc3RyaWJ1dGlvbi8nLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnRGlzdHJpYnV0aW9uODMwRkFDNTInIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dyYW50cyBjcmVhdGVJbnZhbGlkYXRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0cmlidXRpb24nLCB7XG4gICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogZGVmYXVsdE9yaWdpbigpIH0sXG4gIH0pO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgfSk7XG4gIGRpc3RyaWJ1dGlvbi5ncmFudENyZWF0ZUludmFsaWRhdGlvbihyb2xlKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6Y2xvdWRmcm9udDo6MTIzNDpkaXN0cmlidXRpb24vJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0Rpc3RyaWJ1dGlvbjgzMEZBQzUyJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19