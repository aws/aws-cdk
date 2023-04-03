"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const certificatemanager = require("@aws-cdk/aws-certificatemanager");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;
describe('web distribution', () => {
    cdk_build_tools_1.testDeprecated('distribution with custom origin adds custom origin', () => {
        const stack = new cdk.Stack();
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    originHeaders: {
                        'X-Custom-Header': 'somevalue',
                    },
                    customOriginSource: {
                        domainName: 'myorigin.com',
                    },
                    originShieldRegion: 'us-east-1',
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'ForwardedValues': {
                                    'Cookies': {
                                        'Forward': 'none',
                                    },
                                    'QueryString': false,
                                },
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'redirect-to-https',
                                'Compress': true,
                            },
                            'DefaultRootObject': 'index.html',
                            'Enabled': true,
                            'HttpVersion': 'http2',
                            'IPV6Enabled': true,
                            'Origins': [
                                {
                                    'CustomOriginConfig': {
                                        'HTTPPort': 80,
                                        'HTTPSPort': 443,
                                        'OriginKeepaliveTimeout': 5,
                                        'OriginProtocolPolicy': 'https-only',
                                        'OriginReadTimeout': 30,
                                        'OriginSSLProtocols': [
                                            'TLSv1.2',
                                        ],
                                    },
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': 'myorigin.com',
                                    'Id': 'origin1',
                                    'OriginCustomHeaders': [
                                        {
                                            'HeaderName': 'X-Custom-Header',
                                            'HeaderValue': 'somevalue',
                                        },
                                    ],
                                    'OriginShield': {
                                        'Enabled': true,
                                        'OriginShieldRegion': 'us-east-1',
                                    },
                                },
                            ],
                            'PriceClass': 'PriceClass_100',
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                        },
                    },
                },
            },
        });
    });
    test('most basic distribution', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'redirect-to-https',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'Compress': true,
                            },
                            'Enabled': true,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('can disable distribution', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            enabled: false,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'redirect-to-https',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'Compress': true,
                            },
                            'Enabled': false,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('ensure long comments will not break the distribution', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            comment: `Adding a comment longer than 128 characters should be trimmed and
added the ellipsis so a user would know there was more to read and everything beyond this point should not show up`,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                Bucket83908E77: {
                    Type: 'AWS::S3::Bucket',
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Retain',
                },
                AnAmazingWebsiteProbablyCFDistribution47E3983B: {
                    Type: 'AWS::CloudFront::Distribution',
                    Properties: {
                        DistributionConfig: {
                            DefaultRootObject: 'index.html',
                            Origins: [
                                {
                                    ConnectionAttempts: 3,
                                    ConnectionTimeout: 10,
                                    DomainName: {
                                        'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'],
                                    },
                                    Id: 'origin1',
                                    S3OriginConfig: {},
                                },
                            ],
                            ViewerCertificate: {
                                CloudFrontDefaultCertificate: true,
                            },
                            PriceClass: 'PriceClass_100',
                            DefaultCacheBehavior: {
                                AllowedMethods: ['GET', 'HEAD'],
                                CachedMethods: ['GET', 'HEAD'],
                                TargetOriginId: 'origin1',
                                ViewerProtocolPolicy: 'redirect-to-https',
                                ForwardedValues: {
                                    QueryString: false,
                                    Cookies: { Forward: 'none' },
                                },
                                Compress: true,
                            },
                            Comment: `Adding a comment longer than 128 characters should be trimmed and
added the ellipsis so a user would know there was more to r...`,
                            Enabled: true,
                            IPV6Enabled: true,
                            HttpVersion: 'http2',
                        },
                    },
                },
            },
        });
    });
    test('distribution with bucket and OAI', () => {
        const stack = new cdk.Stack();
        const s3BucketSource = new s3.Bucket(stack, 'Bucket');
        const originAccessIdentity = new lib_1.OriginAccessIdentity(stack, 'OAI');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [{
                    s3OriginSource: { s3BucketSource, originAccessIdentity },
                    behaviors: [{ isDefaultBehavior: true }],
                }],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                Origins: [
                    {
                        ConnectionAttempts: 3,
                        ConnectionTimeout: 10,
                        DomainName: {
                            'Fn::GetAtt': [
                                'Bucket83908E77',
                                'RegionalDomainName',
                            ],
                        },
                        Id: 'origin1',
                        S3OriginConfig: {
                            OriginAccessIdentity: {
                                'Fn::Join': ['', ['origin-access-identity/cloudfront/', { Ref: 'OAIE1EFC67F' }]],
                            },
                        },
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            PolicyDocument: {
                Statement: [{
                        Action: 's3:GetObject',
                        Effect: 'Allow',
                        Principal: {
                            CanonicalUser: { 'Fn::GetAtt': ['OAIE1EFC67F', 'S3CanonicalUserId'] },
                        },
                        Resource: {
                            'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] }, '/*']],
                        },
                    }],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('distribution with trusted signers on default distribution', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const pubKey = new lib_1.PublicKey(stack, 'MyPubKey', {
            encodedKey: publicKey,
        });
        const keyGroup = new lib_1.KeyGroup(stack, 'MyKeyGroup', {
            items: [
                pubKey,
            ],
        });
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            trustedSigners: ['1234'],
                            trustedKeyGroups: [
                                keyGroup,
                            ],
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'MyPubKey6ADA4CF5': {
                    'Type': 'AWS::CloudFront::PublicKey',
                    'Properties': {
                        'PublicKeyConfig': {
                            'CallerReference': 'c8141e732ea37b19375d4cbef2b2d2c6f613f0649a',
                            'EncodedKey': publicKey,
                            'Name': 'MyPubKey',
                        },
                    },
                },
                'MyKeyGroupAF22FD35': {
                    'Type': 'AWS::CloudFront::KeyGroup',
                    'Properties': {
                        'KeyGroupConfig': {
                            'Items': [
                                {
                                    'Ref': 'MyPubKey6ADA4CF5',
                                },
                            ],
                            'Name': 'MyKeyGroup',
                        },
                    },
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'redirect-to-https',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'TrustedKeyGroups': [
                                    {
                                        'Ref': 'MyKeyGroupAF22FD35',
                                    },
                                ],
                                'TrustedSigners': ['1234'],
                                'Compress': true,
                            },
                            'Enabled': true,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('distribution with ViewerProtocolPolicy set to a non-default value', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            viewerProtocolPolicy: lib_1.ViewerProtocolPolicy.ALLOW_ALL,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'allow-all',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'Compress': true,
                            },
                            'Enabled': true,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('distribution with ViewerProtocolPolicy overridden in Behavior', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            viewerProtocolPolicy: lib_1.ViewerProtocolPolicy.ALLOW_ALL,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                        {
                            pathPattern: '/test/*',
                            viewerProtocolPolicy: lib_1.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'CacheBehaviors': [
                                {
                                    'AllowedMethods': [
                                        'GET',
                                        'HEAD',
                                    ],
                                    'CachedMethods': [
                                        'GET',
                                        'HEAD',
                                    ],
                                    'Compress': true,
                                    'ForwardedValues': {
                                        'Cookies': {
                                            'Forward': 'none',
                                        },
                                        'QueryString': false,
                                    },
                                    'PathPattern': '/test/*',
                                    'TargetOriginId': 'origin1',
                                    'ViewerProtocolPolicy': 'redirect-to-https',
                                },
                            ],
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'allow-all',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'Compress': true,
                            },
                            'Enabled': true,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('distribution with disabled compression', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            compress: false,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Bucket83908E77': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                    'Type': 'AWS::CloudFront::Distribution',
                    'Properties': {
                        'DistributionConfig': {
                            'DefaultRootObject': 'index.html',
                            'Origins': [
                                {
                                    'ConnectionAttempts': 3,
                                    'ConnectionTimeout': 10,
                                    'DomainName': {
                                        'Fn::GetAtt': [
                                            'Bucket83908E77',
                                            'RegionalDomainName',
                                        ],
                                    },
                                    'Id': 'origin1',
                                    'S3OriginConfig': {},
                                },
                            ],
                            'ViewerCertificate': {
                                'CloudFrontDefaultCertificate': true,
                            },
                            'PriceClass': 'PriceClass_100',
                            'DefaultCacheBehavior': {
                                'AllowedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'CachedMethods': [
                                    'GET',
                                    'HEAD',
                                ],
                                'TargetOriginId': 'origin1',
                                'ViewerProtocolPolicy': 'redirect-to-https',
                                'ForwardedValues': {
                                    'QueryString': false,
                                    'Cookies': { 'Forward': 'none' },
                                },
                                'Compress': false,
                            },
                            'Enabled': true,
                            'IPV6Enabled': true,
                            'HttpVersion': 'http2',
                        },
                    },
                },
            },
        });
    });
    test('distribution with CloudFront function-association', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            functionAssociations: [{
                                    eventType: lib_1.FunctionEventType.VIEWER_REQUEST,
                                    function: new lib_1.Function(stack, 'TestFunction', {
                                        code: lib_1.FunctionCode.fromInline('foo'),
                                    }),
                                }],
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            'DistributionConfig': {
                'DefaultCacheBehavior': {
                    'FunctionAssociations': [
                        {
                            'EventType': 'viewer-request',
                            'FunctionARN': {
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
    test('distribution with resolvable lambda-association', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const lambdaFunction = new lambda.Function(stack, 'Lambda', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            lambdaFunctionAssociations: [{
                                    eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                                    lambdaFunction: lambdaFunction.currentVersion,
                                    includeBody: true,
                                }],
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            'DistributionConfig': {
                'DefaultCacheBehavior': {
                    'LambdaFunctionAssociations': [
                        {
                            'EventType': 'origin-request',
                            'IncludeBody': true,
                            'LambdaFunctionARN': {
                                'Ref': 'LambdaCurrentVersionDF706F6A9a632a294ae3a9cd4d550f1c4e26619d',
                            },
                        },
                    ],
                },
            },
        });
    });
    test('associate a lambda with removable env vars', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const lambdaFunction = new lambda.Function(stack, 'Lambda', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        lambdaFunction.addEnvironment('KEY', 'value', { removeInEdge: true });
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            lambdaFunctionAssociations: [{
                                    eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                                    lambdaFunction: lambdaFunction.currentVersion,
                                }],
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Environment: assertions_1.Match.absent(),
        });
    });
    test('throws when associating a lambda with incompatible env vars', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const lambdaFunction = new lambda.Function(stack, 'Lambda', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                KEY: 'value',
            },
        });
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            lambdaFunctionAssociations: [{
                                    eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                                    lambdaFunction: lambdaFunction.currentVersion,
                                }],
                        },
                    ],
                },
            ],
        });
        expect(() => app.synth()).toThrow(/KEY/);
    });
    test('throws when associating a lambda with includeBody and a response event type', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Stack');
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const fnVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:testregion:111111111111:function:myTestFun:v1');
        expect(() => {
            new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: sourceBucket,
                        },
                        behaviors: [
                            {
                                isDefaultBehavior: true,
                                lambdaFunctionAssociations: [{
                                        eventType: lib_1.LambdaEdgeEventType.VIEWER_RESPONSE,
                                        includeBody: true,
                                        lambdaFunction: fnVersion,
                                    }],
                            },
                        ],
                    },
                ],
            });
        }).toThrow(/'includeBody' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types./);
    });
    test('distribution has a defaultChild', () => {
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const distribution = new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: sourceBucket,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });
        expect(distribution.node.defaultChild instanceof lib_1.CfnDistribution).toEqual(true);
    });
    cdk_build_tools_1.testDeprecated('allows multiple aliasConfiguration CloudFrontWebDistribution per stack', () => {
        const stack = new cdk.Stack();
        const s3BucketSource = new s3.Bucket(stack, 'Bucket');
        const originConfigs = [{
                s3OriginSource: { s3BucketSource },
                behaviors: [{ isDefaultBehavior: true }],
            }];
        new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
            originConfigs,
            aliasConfiguration: { acmCertRef: 'acm_ref', names: ['www.example.com'] },
        });
        new lib_1.CloudFrontWebDistribution(stack, 'AnotherAmazingWebsiteProbably', {
            originConfigs,
            aliasConfiguration: { acmCertRef: 'another_acm_ref', names: ['ftp.example.com'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            'DistributionConfig': {
                'Aliases': ['www.example.com'],
                'ViewerCertificate': {
                    'AcmCertificateArn': 'acm_ref',
                    'SslSupportMethod': 'sni-only',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            'DistributionConfig': {
                'Aliases': ['ftp.example.com'],
                'ViewerCertificate': {
                    'AcmCertificateArn': 'another_acm_ref',
                    'SslSupportMethod': 'sni-only',
                },
            },
        });
    });
    describe('viewerCertificate', () => {
        describe('acmCertificate', () => {
            test('base usage', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                const certificate = new certificatemanager.Certificate(stack, 'cert', {
                    domainName: 'example.com',
                });
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromAcmCertificate(certificate),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': [],
                        'ViewerCertificate': {
                            'AcmCertificateArn': {
                                'Ref': 'cert56CA94EB',
                            },
                            'SslSupportMethod': 'sni-only',
                        },
                    },
                });
            });
            test('imported certificate fromCertificateArn', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                const certificate = certificatemanager.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromAcmCertificate(certificate),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': [],
                        'ViewerCertificate': {
                            'AcmCertificateArn': 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
                            'SslSupportMethod': 'sni-only',
                        },
                    },
                });
            });
            test('advanced usage', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                const certificate = new certificatemanager.Certificate(stack, 'cert', {
                    domainName: 'example.com',
                });
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromAcmCertificate(certificate, {
                        securityPolicy: lib_1.SecurityPolicyProtocol.SSL_V3,
                        sslMethod: lib_1.SSLMethod.VIP,
                        aliases: ['example.com', 'www.example.com'],
                    }),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': ['example.com', 'www.example.com'],
                        'ViewerCertificate': {
                            'AcmCertificateArn': {
                                'Ref': 'cert56CA94EB',
                            },
                            'MinimumProtocolVersion': 'SSLv3',
                            'SslSupportMethod': 'vip',
                        },
                    },
                });
            });
        });
        describe('iamCertificate', () => {
            test('base usage', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromIamCertificate('test'),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': [],
                        'ViewerCertificate': {
                            'IamCertificateId': 'test',
                            'SslSupportMethod': 'sni-only',
                        },
                    },
                });
            });
            test('advanced usage', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromIamCertificate('test', {
                        securityPolicy: lib_1.SecurityPolicyProtocol.TLS_V1,
                        sslMethod: lib_1.SSLMethod.VIP,
                        aliases: ['example.com'],
                    }),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': ['example.com'],
                        'ViewerCertificate': {
                            'IamCertificateId': 'test',
                            'MinimumProtocolVersion': 'TLSv1',
                            'SslSupportMethod': 'vip',
                        },
                    },
                });
            });
        });
        describe('cloudFrontDefaultCertificate', () => {
            test('base usage', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromCloudFrontDefaultCertificate(),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': [],
                        'ViewerCertificate': {
                            'CloudFrontDefaultCertificate': true,
                        },
                    },
                });
            });
            test('aliases are set', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromCloudFrontDefaultCertificate('example.com', 'www.example.com'),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': ['example.com', 'www.example.com'],
                        'ViewerCertificate': {
                            'CloudFrontDefaultCertificate': true,
                        },
                    },
                });
            });
        });
        describe('errors', () => {
            cdk_build_tools_1.testDeprecated('throws if both deprecated aliasConfiguration and viewerCertificate', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                        originConfigs: [{
                                s3OriginSource: { s3BucketSource: sourceBucket },
                                behaviors: [{ isDefaultBehavior: true }],
                            }],
                        aliasConfiguration: { acmCertRef: 'test', names: ['ftp.example.com'] },
                        viewerCertificate: lib_1.ViewerCertificate.fromCloudFrontDefaultCertificate('example.com', 'www.example.com'),
                    });
                }).toThrow(/You cannot set both aliasConfiguration and viewerCertificate properties/);
            });
            test('throws if invalid security policy for SSL method', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                        originConfigs: [{
                                s3OriginSource: { s3BucketSource: sourceBucket },
                                behaviors: [{ isDefaultBehavior: true }],
                            }],
                        viewerCertificate: lib_1.ViewerCertificate.fromIamCertificate('test', {
                            securityPolicy: lib_1.SecurityPolicyProtocol.TLS_V1_1_2016,
                            sslMethod: lib_1.SSLMethod.VIP,
                        }),
                    });
                }).toThrow(/TLSv1.1_2016 is not compabtible with sslMethod vip./);
            });
            // FIXME https://github.com/aws/aws-cdk/issues/4724
            test('does not throw if acmCertificate explicitly not in us-east-1', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                const certificate = certificatemanager.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:eu-west-3:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    viewerCertificate: lib_1.ViewerCertificate.fromAcmCertificate(certificate),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
                    'DistributionConfig': {
                        'Aliases': [],
                        'ViewerCertificate': {
                            'AcmCertificateArn': 'arn:aws:acm:eu-west-3:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
                            'SslSupportMethod': 'sni-only',
                        },
                    },
                });
            });
        });
    });
    test('edgelambda.amazonaws.com is added to the trust policy of lambda', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const fn = new lambda.Function(stack, 'Lambda', {
            code: lambda.Code.fromInline('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const lambdaVersion = new lambda.Version(stack, 'LambdaVersion', { lambda: fn });
        // WHEN
        new lib_1.CloudFrontWebDistribution(stack, 'MyDistribution', {
            originConfigs: [
                {
                    s3OriginSource: { s3BucketSource: sourceBucket },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            lambdaFunctionAssociations: [
                                {
                                    eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                                    lambdaFunction: lambdaVersion,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                'Statement': [
                    {
                        'Action': 'sts:AssumeRole',
                        'Effect': 'Allow',
                        'Principal': {
                            'Service': 'lambda.amazonaws.com',
                        },
                    },
                    {
                        'Action': 'sts:AssumeRole',
                        'Effect': 'Allow',
                        'Principal': {
                            'Service': 'edgelambda.amazonaws.com',
                        },
                    },
                ],
                'Version': '2012-10-17',
            },
        });
    });
    test('edgelambda.amazonaws.com is not added to lambda role for imported functions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const sourceBucket = new s3.Bucket(stack, 'Bucket');
        const lambdaVersion = lambda.Version.fromVersionArn(stack, 'Version', 'arn:aws:lambda:function-region:111111111111:function:function-name');
        // WHEN
        new lib_1.CloudFrontWebDistribution(stack, 'MyDistribution', {
            originConfigs: [
                {
                    s3OriginSource: { s3BucketSource: sourceBucket },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            lambdaFunctionAssociations: [
                                {
                                    eventType: lib_1.LambdaEdgeEventType.ORIGIN_REQUEST,
                                    lambdaFunction: lambdaVersion,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    });
    describe('geo restriction', () => {
        describe('success', () => {
            test('allowlist', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    geoRestriction: lib_1.GeoRestriction.allowlist('US', 'UK'),
                });
                assertions_1.Template.fromStack(stack).templateMatches({
                    'Resources': {
                        'Bucket83908E77': {
                            'Type': 'AWS::S3::Bucket',
                            'DeletionPolicy': 'Retain',
                            'UpdateReplacePolicy': 'Retain',
                        },
                        'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                            'Type': 'AWS::CloudFront::Distribution',
                            'Properties': {
                                'DistributionConfig': {
                                    'DefaultRootObject': 'index.html',
                                    'Origins': [
                                        {
                                            'ConnectionAttempts': 3,
                                            'ConnectionTimeout': 10,
                                            'DomainName': {
                                                'Fn::GetAtt': [
                                                    'Bucket83908E77',
                                                    'RegionalDomainName',
                                                ],
                                            },
                                            'Id': 'origin1',
                                            'S3OriginConfig': {},
                                        },
                                    ],
                                    'ViewerCertificate': {
                                        'CloudFrontDefaultCertificate': true,
                                    },
                                    'PriceClass': 'PriceClass_100',
                                    'DefaultCacheBehavior': {
                                        'AllowedMethods': [
                                            'GET',
                                            'HEAD',
                                        ],
                                        'CachedMethods': [
                                            'GET',
                                            'HEAD',
                                        ],
                                        'TargetOriginId': 'origin1',
                                        'ViewerProtocolPolicy': 'redirect-to-https',
                                        'ForwardedValues': {
                                            'QueryString': false,
                                            'Cookies': { 'Forward': 'none' },
                                        },
                                        'Compress': true,
                                    },
                                    'Enabled': true,
                                    'IPV6Enabled': true,
                                    'HttpVersion': 'http2',
                                    'Restrictions': {
                                        'GeoRestriction': {
                                            'Locations': ['US', 'UK'],
                                            'RestrictionType': 'whitelist',
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            });
            test('denylist', () => {
                const stack = new cdk.Stack();
                const sourceBucket = new s3.Bucket(stack, 'Bucket');
                new lib_1.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
                    originConfigs: [{
                            s3OriginSource: { s3BucketSource: sourceBucket },
                            behaviors: [{ isDefaultBehavior: true }],
                        }],
                    geoRestriction: lib_1.GeoRestriction.denylist('US'),
                });
                assertions_1.Template.fromStack(stack).templateMatches({
                    'Resources': {
                        'Bucket83908E77': {
                            'Type': 'AWS::S3::Bucket',
                            'DeletionPolicy': 'Retain',
                            'UpdateReplacePolicy': 'Retain',
                        },
                        'AnAmazingWebsiteProbablyCFDistribution47E3983B': {
                            'Type': 'AWS::CloudFront::Distribution',
                            'Properties': {
                                'DistributionConfig': {
                                    'DefaultRootObject': 'index.html',
                                    'Origins': [
                                        {
                                            'ConnectionAttempts': 3,
                                            'ConnectionTimeout': 10,
                                            'DomainName': {
                                                'Fn::GetAtt': [
                                                    'Bucket83908E77',
                                                    'RegionalDomainName',
                                                ],
                                            },
                                            'Id': 'origin1',
                                            'S3OriginConfig': {},
                                        },
                                    ],
                                    'ViewerCertificate': {
                                        'CloudFrontDefaultCertificate': true,
                                    },
                                    'PriceClass': 'PriceClass_100',
                                    'DefaultCacheBehavior': {
                                        'AllowedMethods': [
                                            'GET',
                                            'HEAD',
                                        ],
                                        'CachedMethods': [
                                            'GET',
                                            'HEAD',
                                        ],
                                        'TargetOriginId': 'origin1',
                                        'ViewerProtocolPolicy': 'redirect-to-https',
                                        'ForwardedValues': {
                                            'QueryString': false,
                                            'Cookies': { 'Forward': 'none' },
                                        },
                                        'Compress': true,
                                    },
                                    'Enabled': true,
                                    'IPV6Enabled': true,
                                    'HttpVersion': 'http2',
                                    'Restrictions': {
                                        'GeoRestriction': {
                                            'Locations': ['US'],
                                            'RestrictionType': 'blacklist',
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            });
        });
        describe('error', () => {
            test('throws if locations is empty array', () => {
                expect(() => {
                    lib_1.GeoRestriction.allowlist();
                }).toThrow(/Should provide at least 1 location/);
                expect(() => {
                    lib_1.GeoRestriction.denylist();
                }).toThrow(/Should provide at least 1 location/);
            });
            test('throws if locations format is wrong', () => {
                expect(() => {
                    lib_1.GeoRestriction.allowlist('us');
                }).toThrow(/Invalid location format for location: us, location should be two-letter and uppercase country ISO 3166-1-alpha-2 code/);
                expect(() => {
                    lib_1.GeoRestriction.denylist('us');
                }).toThrow(/Invalid location format for location: us, location should be two-letter and uppercase country ISO 3166-1-alpha-2 code/);
            });
        });
    });
    describe('Connection behaviors between CloudFront and your origin', () => {
        describe('success', () => {
            test('connectionAttempts = 1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: 1,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).not.toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('3 = connectionAttempts', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: 3,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).not.toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('connectionTimeout = 1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionTimeout: cdk.Duration.seconds(1),
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).not.toThrow(/connectionTimeout: You can specify a number of seconds between 1 and 10 (inclusive)./);
            });
            test('10 = connectionTimeout', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionTimeout: cdk.Duration.seconds(10),
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).not.toThrow(/connectionTimeout: You can specify a number of seconds between 1 and 10 (inclusive)./);
            });
        });
        describe('errors', () => {
            test('connectionAttempts = 1.1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: 1.1,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('connectionAttempts = -1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: -1,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('connectionAttempts < 1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: 0,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('3 < connectionAttempts', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionAttempts: 4,
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionAttempts: You can specify 1, 2, or 3 as the number of attempts./);
            });
            test('connectionTimeout = 1.1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionTimeout: cdk.Duration.seconds(1.1),
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/must be a whole number of/);
            });
            test('connectionTimeout < 1', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionTimeout: cdk.Duration.seconds(0),
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionTimeout: You can specify a number of seconds between 1 and 10 \(inclusive\)./);
            });
            test('10 < connectionTimeout', () => {
                const stack = new cdk.Stack();
                expect(() => {
                    new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
                        originConfigs: [{
                                behaviors: [{ isDefaultBehavior: true }],
                                connectionTimeout: cdk.Duration.seconds(11),
                                customOriginSource: { domainName: 'myorigin.com' },
                            }],
                    });
                }).toThrow(/connectionTimeout: You can specify a number of seconds between 1 and 10 \(inclusive\)./);
            });
        });
    });
    test('existing distributions can be imported', () => {
        const stack = new cdk.Stack();
        const dist = lib_1.CloudFrontWebDistribution.fromDistributionAttributes(stack, 'ImportedDist', {
            domainName: 'd111111abcdef8.cloudfront.net',
            distributionId: '012345ABCDEF',
        });
        expect(dist.distributionDomainName).toEqual('d111111abcdef8.cloudfront.net');
        expect(dist.distributionId).toEqual('012345ABCDEF');
    });
});
test('grants custom actions', () => {
    const stack = new cdk.Stack();
    const distribution = new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
        originConfigs: [{
                customOriginSource: { domainName: 'myorigin.com' },
                behaviors: [{ isDefaultBehavior: true }],
            }],
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
                                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::', { Ref: 'AWS::AccountId' }, ':distribution/',
                                { Ref: 'DistributionCFDistribution882A7313' },
                            ],
                        ],
                    },
                },
            ],
        },
    });
});
test('grants createInvalidation', () => {
    const stack = new cdk.Stack();
    const distribution = new lib_1.CloudFrontWebDistribution(stack, 'Distribution', {
        originConfigs: [{
                customOriginSource: { domainName: 'myorigin.com' },
                behaviors: [{ isDefaultBehavior: true }],
            }],
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
                                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::', { Ref: 'AWS::AccountId' }, ':distribution/',
                                { Ref: 'DistributionCFDistribution882A7313' },
                            ],
                        ],
                    },
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWRpc3RyaWJ1dGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2ViLWRpc3RyaWJ1dGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHNFQUFzRTtBQUN0RSx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHNDQUFzQztBQUN0Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLGdDQWVnQjtBQUVoQixnQ0FBZ0M7QUFFaEMsTUFBTSxTQUFTLEdBQUc7Ozs7Ozs7O3lCQVFPLENBQUM7QUFFMUIsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUVoQyxnQ0FBYyxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUN4RSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBRTtZQUMvRCxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsYUFBYSxFQUFFO3dCQUNiLGlCQUFpQixFQUFFLFdBQVc7cUJBQy9CO29CQUNELGtCQUFrQixFQUFFO3dCQUNsQixVQUFVLEVBQUUsY0FBYztxQkFDM0I7b0JBQ0Qsa0JBQWtCLEVBQUUsV0FBVztvQkFDL0IsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLGlCQUFpQixFQUFFLElBQUk7eUJBQ3hCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQ3ZDO1lBQ0UsV0FBVyxFQUFFO2dCQUNYLGdEQUFnRCxFQUFFO29CQUNoRCxNQUFNLEVBQUUsK0JBQStCO29CQUN2QyxZQUFZLEVBQUU7d0JBQ1osb0JBQW9CLEVBQUU7NEJBQ3BCLHNCQUFzQixFQUFFO2dDQUN0QixnQkFBZ0IsRUFBRTtvQ0FDaEIsS0FBSztvQ0FDTCxNQUFNO2lDQUNQO2dDQUNELGVBQWUs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QTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksK0JBQXlCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtRQUN4RSxhQUFhLEVBQUUsQ0FBQztnQkFDZCxrQkFBa0IsRUFBRSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUU7Z0JBQ2xELFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDekMsQ0FBQztLQUNILENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtLQUMxQyxDQUFDLENBQUM7SUFDSCxZQUFZLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFM0MscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7UUFDbEUsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE1BQU0sRUFBRSwrQkFBK0I7b0JBQ3ZDLFFBQVEsRUFBRTt3QkFDUixVQUFVLEVBQUU7NEJBQ1YsRUFBRSxFQUFFO2dDQUNGLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLGdCQUFnQjtnQ0FDL0YsRUFBRSxHQUFHLEVBQUUsb0NBQW9DLEVBQUU7NkJBQzlDO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZXJ0aWZpY2F0ZW1hbmFnZXIgZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2ZuRGlzdHJpYnV0aW9uLFxuICBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uLFxuICBGdW5jdGlvbixcbiAgRnVuY3Rpb25Db2RlLFxuICBGdW5jdGlvbkV2ZW50VHlwZSxcbiAgR2VvUmVzdHJpY3Rpb24sXG4gIEtleUdyb3VwLFxuICBMYW1iZGFFZGdlRXZlbnRUeXBlLFxuICBPcmlnaW5BY2Nlc3NJZGVudGl0eSxcbiAgUHVibGljS2V5LFxuICBTZWN1cml0eVBvbGljeVByb3RvY29sLFxuICBTU0xNZXRob2QsXG4gIFZpZXdlckNlcnRpZmljYXRlLFxuICBWaWV3ZXJQcm90b2NvbFBvbGljeSxcbn0gZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuY29uc3QgcHVibGljS2V5ID0gYC0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXG5NSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXVkZjgvaU5rUWdkdmpFZG02eFlTXG5KQXl4ZC9rR1RiSmZRTmc5WWhJbmI3VFNtMGRHdTB5eDh5WjNmbnBteHVSUHFKSWxhVnIrZlQ0WVJsNzFnRVlhXG5kbGhIbW5WZWd5UE5qUDlkTnFaN3p3TnFNRVBPUG5TL05PSGJKajFLWUtwbjFmOHBQTnljUTVNUUNudEtHblNqXG42ZmMrbmJjQzBqb0R2R3o4MHh1eTFXNGhMVjlvQzljM0dUMjZ4ZlpiMmp5OU1WdEEzY3BwTnVUd3FyRmkzdDZlXG4waUdwcmF4WmxUNXdld2paTHBRa25ncVlyNnMzYXVjUEFaVnNHVEVZUG80bkQ1bXN3bXRaT20rdGdjT3JpdnREXG4vM3NEL3FaTFE2YzVzaXF5UzhhVHJhRDZ5K1ZYdWd1amZhclRVNjVJZVo2UUFVYkxNc1d1Wk9JaTVKbjh6QXd4XG5OUUlEQVFBQlxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tYDtcblxuZGVzY3JpYmUoJ3dlYiBkaXN0cmlidXRpb24nLCAoKSA9PiB7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2Rpc3RyaWJ1dGlvbiB3aXRoIGN1c3RvbSBvcmlnaW4gYWRkcyBjdXN0b20gb3JpZ2luJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5IZWFkZXJzOiB7XG4gICAgICAgICAgICAnWC1DdXN0b20tSGVhZGVyJzogJ3NvbWV2YWx1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3JpZ2luU2hpZWxkUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoXG4gICAgICB7XG4gICAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICAgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseUNGRGlzdHJpYnV0aW9uNDdFMzk4M0InOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgJ0Rpc3RyaWJ1dGlvbkNvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAnRGVmYXVsdENhY2hlQmVoYXZpb3InOiB7XG4gICAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0NhY2hlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0ZvcndhcmRlZFZhbHVlcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0Nvb2tpZXMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZvcndhcmQnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdRdWVyeVN0cmluZyc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdUYXJnZXRPcmlnaW5JZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgICdWaWV3ZXJQcm90b2NvbFBvbGljeSc6ICdyZWRpcmVjdC10by1odHRwcycsXG4gICAgICAgICAgICAgICAgICAnQ29tcHJlc3MnOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0RlZmF1bHRSb290T2JqZWN0JzogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICdFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnSHR0cFZlcnNpb24nOiAnaHR0cDInLFxuICAgICAgICAgICAgICAgICdJUFY2RW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ09yaWdpbnMnOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdDdXN0b21PcmlnaW5Db25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0hUVFBQb3J0JzogODAsXG4gICAgICAgICAgICAgICAgICAgICAgJ0hUVFBTUG9ydCc6IDQ0MyxcbiAgICAgICAgICAgICAgICAgICAgICAnT3JpZ2luS2VlcGFsaXZlVGltZW91dCc6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgJ09yaWdpblByb3RvY29sUG9saWN5JzogJ2h0dHBzLW9ubHknLFxuICAgICAgICAgICAgICAgICAgICAgICdPcmlnaW5SZWFkVGltZW91dCc6IDMwLFxuICAgICAgICAgICAgICAgICAgICAgICdPcmlnaW5TU0xQcm90b2NvbHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnVExTdjEuMicsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25BdHRlbXB0cyc6IDMsXG4gICAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uVGltZW91dCc6IDEwLFxuICAgICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6ICdteW9yaWdpbi5jb20nLFxuICAgICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAgICdPcmlnaW5DdXN0b21IZWFkZXJzJzogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdIZWFkZXJOYW1lJzogJ1gtQ3VzdG9tLUhlYWRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnSGVhZGVyVmFsdWUnOiAnc29tZXZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnT3JpZ2luU2hpZWxkJzoge1xuICAgICAgICAgICAgICAgICAgICAgICdFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAnT3JpZ2luU2hpZWxkUmVnaW9uJzogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1ByaWNlQ2xhc3MnOiAnUHJpY2VDbGFzc18xMDAnLFxuICAgICAgICAgICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAgICAgICAgICdDbG91ZEZyb250RGVmYXVsdENlcnRpZmljYXRlJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnbW9zdCBiYXNpYyBkaXN0cmlidXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnQnVja2V0ODM5MDhFNzcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAnRGVmYXVsdFJvb3RPYmplY3QnOiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICdPcmlnaW5zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uQXR0ZW1wdHMnOiAzLFxuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25UaW1lb3V0JzogMTAsXG4gICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3JyxcbiAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAnUzNPcmlnaW5Db25maWcnOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmlld2VyQ2VydGlmaWNhdGUnOiB7XG4gICAgICAgICAgICAgICAgJ0Nsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUHJpY2VDbGFzcyc6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICAgICAgICAgICdEZWZhdWx0Q2FjaGVCZWhhdmlvcic6IHtcbiAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdDYWNoZWRNZXRob2RzJzogW1xuICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGFyZ2V0T3JpZ2luSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICAnRm9yd2FyZGVkVmFsdWVzJzoge1xuICAgICAgICAgICAgICAgICAgJ1F1ZXJ5U3RyaW5nJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAnQ29va2llcyc6IHsgJ0ZvcndhcmQnOiAnbm9uZScgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb21wcmVzcyc6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0lQVjZFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0h0dHBWZXJzaW9uJzogJ2h0dHAyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRpc2FibGUgZGlzdHJpYnV0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnQnVja2V0ODM5MDhFNzcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAnRGVmYXVsdFJvb3RPYmplY3QnOiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICdPcmlnaW5zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uQXR0ZW1wdHMnOiAzLFxuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25UaW1lb3V0JzogMTAsXG4gICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3JyxcbiAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAnUzNPcmlnaW5Db25maWcnOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmlld2VyQ2VydGlmaWNhdGUnOiB7XG4gICAgICAgICAgICAgICAgJ0Nsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUHJpY2VDbGFzcyc6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICAgICAgICAgICdEZWZhdWx0Q2FjaGVCZWhhdmlvcic6IHtcbiAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdDYWNoZWRNZXRob2RzJzogW1xuICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGFyZ2V0T3JpZ2luSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICAnRm9yd2FyZGVkVmFsdWVzJzoge1xuICAgICAgICAgICAgICAgICAgJ1F1ZXJ5U3RyaW5nJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAnQ29va2llcyc6IHsgJ0ZvcndhcmQnOiAnbm9uZScgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb21wcmVzcyc6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdFbmFibGVkJzogZmFsc2UsXG4gICAgICAgICAgICAgICdJUFY2RW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICdIdHRwVmVyc2lvbic6ICdodHRwMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBsb25nIGNvbW1lbnRzIHdpbGwgbm90IGJyZWFrIHRoZSBkaXN0cmlidXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICBjb21tZW50OiBgQWRkaW5nIGEgY29tbWVudCBsb25nZXIgdGhhbiAxMjggY2hhcmFjdGVycyBzaG91bGQgYmUgdHJpbW1lZCBhbmRcbmFkZGVkIHRoZSBlbGxpcHNpcyBzbyBhIHVzZXIgd291bGQga25vdyB0aGVyZSB3YXMgbW9yZSB0byByZWFkIGFuZCBldmVyeXRoaW5nIGJleW9uZCB0aGlzIHBvaW50IHNob3VsZCBub3Qgc2hvdyB1cGAsXG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQnVja2V0ODM5MDhFNzc6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICAgIEFuQW1hemluZ1dlYnNpdGVQcm9iYWJseUNGRGlzdHJpYnV0aW9uNDdFMzk4M0I6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICAgICAgICBEZWZhdWx0Um9vdE9iamVjdDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICBPcmlnaW5zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQ29ubmVjdGlvbkF0dGVtcHRzOiAzLFxuICAgICAgICAgICAgICAgICAgQ29ubmVjdGlvblRpbWVvdXQ6IDEwLFxuICAgICAgICAgICAgICAgICAgRG9tYWluTmFtZToge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQnVja2V0ODM5MDhFNzcnLCAnUmVnaW9uYWxEb21haW5OYW1lJ10sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgSWQ6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgIFMzT3JpZ2luQ29uZmlnOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBWaWV3ZXJDZXJ0aWZpY2F0ZToge1xuICAgICAgICAgICAgICAgIENsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGU6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFByaWNlQ2xhc3M6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICAgICAgICAgIERlZmF1bHRDYWNoZUJlaGF2aW9yOiB7XG4gICAgICAgICAgICAgICAgQWxsb3dlZE1ldGhvZHM6IFsnR0VUJywgJ0hFQUQnXSxcbiAgICAgICAgICAgICAgICBDYWNoZWRNZXRob2RzOiBbJ0dFVCcsICdIRUFEJ10sXG4gICAgICAgICAgICAgICAgVGFyZ2V0T3JpZ2luSWQ6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICBWaWV3ZXJQcm90b2NvbFBvbGljeTogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICBGb3J3YXJkZWRWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgIFF1ZXJ5U3RyaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIENvb2tpZXM6IHsgRm9yd2FyZDogJ25vbmUnIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDb21wcmVzczogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgQ29tbWVudDogYEFkZGluZyBhIGNvbW1lbnQgbG9uZ2VyIHRoYW4gMTI4IGNoYXJhY3RlcnMgc2hvdWxkIGJlIHRyaW1tZWQgYW5kXG5hZGRlZCB0aGUgZWxsaXBzaXMgc28gYSB1c2VyIHdvdWxkIGtub3cgdGhlcmUgd2FzIG1vcmUgdG8gci4uLmAsXG4gICAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgIElQVjZFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICBIdHRwVmVyc2lvbjogJ2h0dHAyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZGlzdHJpYnV0aW9uIHdpdGggYnVja2V0IGFuZCBPQUknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgczNCdWNrZXRTb3VyY2UgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3Qgb3JpZ2luQWNjZXNzSWRlbnRpdHkgPSBuZXcgT3JpZ2luQWNjZXNzSWRlbnRpdHkoc3RhY2ssICdPQUknKTtcblxuICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2UsIG9yaWdpbkFjY2Vzc0lkZW50aXR5IH0sXG4gICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgIERpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBPcmlnaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29ubmVjdGlvbkF0dGVtcHRzOiAzLFxuICAgICAgICAgICAgQ29ubmVjdGlvblRpbWVvdXQ6IDEwLFxuICAgICAgICAgICAgRG9tYWluTmFtZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICAgICdSZWdpb25hbERvbWFpbk5hbWUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIElkOiAnb3JpZ2luMScsXG4gICAgICAgICAgICBTM09yaWdpbkNvbmZpZzoge1xuICAgICAgICAgICAgICBPcmlnaW5BY2Nlc3NJZGVudGl0eToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydvcmlnaW4tYWNjZXNzLWlkZW50aXR5L2Nsb3VkZnJvbnQvJywgeyBSZWY6ICdPQUlFMUVGQzY3RicgfV1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgQWN0aW9uOiAnczM6R2V0T2JqZWN0JyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBDYW5vbmljYWxVc2VyOiB7ICdGbjo6R2V0QXR0JzogWydPQUlFMUVGQzY3RicsICdTM0Nhbm9uaWNhbFVzZXJJZCddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnQnVja2V0ODM5MDhFNzcnLCAnQXJuJ10gfSwgJy8qJ11dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2Rpc3RyaWJ1dGlvbiB3aXRoIHRydXN0ZWQgc2lnbmVycyBvbiBkZWZhdWx0IGRpc3RyaWJ1dGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3QgcHViS2V5ID0gbmV3IFB1YmxpY0tleShzdGFjaywgJ015UHViS2V5Jywge1xuICAgICAgZW5jb2RlZEtleTogcHVibGljS2V5LFxuICAgIH0pO1xuICAgIGNvbnN0IGtleUdyb3VwID0gbmV3IEtleUdyb3VwKHN0YWNrLCAnTXlLZXlHcm91cCcsIHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHB1YktleSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxuICAgICAgICAgICAgICB0cnVzdGVkU2lnbmVyczogWycxMjM0J10sXG4gICAgICAgICAgICAgIHRydXN0ZWRLZXlHcm91cHM6IFtcbiAgICAgICAgICAgICAgICBrZXlHcm91cCxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnQnVja2V0ODM5MDhFNzcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgICAnTXlQdWJLZXk2QURBNENGNSc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OlB1YmxpY0tleScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUHVibGljS2V5Q29uZmlnJzoge1xuICAgICAgICAgICAgICAnQ2FsbGVyUmVmZXJlbmNlJzogJ2M4MTQxZTczMmVhMzdiMTkzNzVkNGNiZWYyYjJkMmM2ZjYxM2YwNjQ5YScsXG4gICAgICAgICAgICAgICdFbmNvZGVkS2V5JzogcHVibGljS2V5LFxuICAgICAgICAgICAgICAnTmFtZSc6ICdNeVB1YktleScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeUtleUdyb3VwQUYyMkZEMzUnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDbG91ZEZyb250OjpLZXlHcm91cCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnS2V5R3JvdXBDb25maWcnOiB7XG4gICAgICAgICAgICAgICdJdGVtcyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015UHViS2V5NkFEQTRDRjUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ015S2V5R3JvdXAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAnRGVmYXVsdFJvb3RPYmplY3QnOiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICdPcmlnaW5zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uQXR0ZW1wdHMnOiAzLFxuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25UaW1lb3V0JzogMTAsXG4gICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3JyxcbiAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAnUzNPcmlnaW5Db25maWcnOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmlld2VyQ2VydGlmaWNhdGUnOiB7XG4gICAgICAgICAgICAgICAgJ0Nsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUHJpY2VDbGFzcyc6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICAgICAgICAgICdEZWZhdWx0Q2FjaGVCZWhhdmlvcic6IHtcbiAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdDYWNoZWRNZXRob2RzJzogW1xuICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGFyZ2V0T3JpZ2luSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICAnRm9yd2FyZGVkVmFsdWVzJzoge1xuICAgICAgICAgICAgICAgICAgJ1F1ZXJ5U3RyaW5nJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAnQ29va2llcyc6IHsgJ0ZvcndhcmQnOiAnbm9uZScgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdUcnVzdGVkS2V5R3JvdXBzJzogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015S2V5R3JvdXBBRjIyRkQzNScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1RydXN0ZWRTaWduZXJzJzogWycxMjM0J10sXG4gICAgICAgICAgICAgICAgJ0NvbXByZXNzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0VuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAnSVBWNkVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAnSHR0cFZlcnNpb24nOiAnaHR0cDInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdkaXN0cmlidXRpb24gd2l0aCBWaWV3ZXJQcm90b2NvbFBvbGljeSBzZXQgdG8gYSBub24tZGVmYXVsdCB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBWaWV3ZXJQcm90b2NvbFBvbGljeS5BTExPV19BTEwsXG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnQnVja2V0ODM5MDhFNzcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAnRGVmYXVsdFJvb3RPYmplY3QnOiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICdPcmlnaW5zJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uQXR0ZW1wdHMnOiAzLFxuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25UaW1lb3V0JzogMTAsXG4gICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3JyxcbiAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAnUzNPcmlnaW5Db25maWcnOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmlld2VyQ2VydGlmaWNhdGUnOiB7XG4gICAgICAgICAgICAgICAgJ0Nsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUHJpY2VDbGFzcyc6ICdQcmljZUNsYXNzXzEwMCcsXG4gICAgICAgICAgICAgICdEZWZhdWx0Q2FjaGVCZWhhdmlvcic6IHtcbiAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdDYWNoZWRNZXRob2RzJzogW1xuICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGFyZ2V0T3JpZ2luSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ2FsbG93LWFsbCcsXG4gICAgICAgICAgICAgICAgJ0ZvcndhcmRlZFZhbHVlcyc6IHtcbiAgICAgICAgICAgICAgICAgICdRdWVyeVN0cmluZyc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgJ0Nvb2tpZXMnOiB7ICdGb3J3YXJkJzogJ25vbmUnIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnQ29tcHJlc3MnOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnRW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICdJUFY2RW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICdIdHRwVmVyc2lvbic6ICdodHRwMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2Rpc3RyaWJ1dGlvbiB3aXRoIFZpZXdlclByb3RvY29sUG9saWN5IG92ZXJyaWRkZW4gaW4gQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogVmlld2VyUHJvdG9jb2xQb2xpY3kuQUxMT1dfQUxMLFxuICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICB7XG4gICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwYXRoUGF0dGVybjogJy90ZXN0LyonLFxuICAgICAgICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogVmlld2VyUHJvdG9jb2xQb2xpY3kuUkVESVJFQ1RfVE9fSFRUUFMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ0J1Y2tldDgzOTA4RTc3Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseUNGRGlzdHJpYnV0aW9uNDdFMzk4M0InOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0Rpc3RyaWJ1dGlvbkNvbmZpZyc6IHtcbiAgICAgICAgICAgICAgJ0NhY2hlQmVoYXZpb3JzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBbGxvd2VkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnQ2FjaGVkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnQ29tcHJlc3MnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgJ0ZvcndhcmRlZFZhbHVlcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0Nvb2tpZXMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZvcndhcmQnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdRdWVyeVN0cmluZyc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdQYXRoUGF0dGVybic6ICcvdGVzdC8qJyxcbiAgICAgICAgICAgICAgICAgICdUYXJnZXRPcmlnaW5JZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgICdWaWV3ZXJQcm90b2NvbFBvbGljeSc6ICdyZWRpcmVjdC10by1odHRwcycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0RlZmF1bHRSb290T2JqZWN0JzogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAnT3JpZ2lucyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbkF0dGVtcHRzJzogMyxcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uVGltZW91dCc6IDEwLFxuICAgICAgICAgICAgICAgICAgJ0RvbWFpbk5hbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdCdWNrZXQ4MzkwOEU3NycsXG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZ2lvbmFsRG9tYWluTmFtZScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJ0lkJzogJ29yaWdpbjEnLFxuICAgICAgICAgICAgICAgICAgJ1MzT3JpZ2luQ29uZmlnJzoge30sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAgICdDbG91ZEZyb250RGVmYXVsdENlcnRpZmljYXRlJzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1ByaWNlQ2xhc3MnOiAnUHJpY2VDbGFzc18xMDAnLFxuICAgICAgICAgICAgICAnRGVmYXVsdENhY2hlQmVoYXZpb3InOiB7XG4gICAgICAgICAgICAgICAgJ0FsbG93ZWRNZXRob2RzJzogW1xuICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnQ2FjaGVkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgICAgICAgJ0hFQUQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1RhcmdldE9yaWdpbklkJzogJ29yaWdpbjEnLFxuICAgICAgICAgICAgICAgICdWaWV3ZXJQcm90b2NvbFBvbGljeSc6ICdhbGxvdy1hbGwnLFxuICAgICAgICAgICAgICAgICdGb3J3YXJkZWRWYWx1ZXMnOiB7XG4gICAgICAgICAgICAgICAgICAnUXVlcnlTdHJpbmcnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICdDb29raWVzJzogeyAnRm9yd2FyZCc6ICdub25lJyB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0NvbXByZXNzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0VuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAnSVBWNkVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAnSHR0cFZlcnNpb24nOiAnaHR0cDInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzdHJpYnV0aW9uIHdpdGggZGlzYWJsZWQgY29tcHJlc3Npb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgY29tcHJlc3M6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdCdWNrZXQ4MzkwOEU3Nyc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICAgICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHlDRkRpc3RyaWJ1dGlvbjQ3RTM5ODNCJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICAgICAgICdEZWZhdWx0Um9vdE9iamVjdCc6ICdpbmRleC5odG1sJyxcbiAgICAgICAgICAgICAgJ09yaWdpbnMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25BdHRlbXB0cyc6IDMsXG4gICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvblRpbWVvdXQnOiAxMCxcbiAgICAgICAgICAgICAgICAgICdEb21haW5OYW1lJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICAgICAgICAgICdSZWdpb25hbERvbWFpbk5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdJZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgICdTM09yaWdpbkNvbmZpZyc6IHt9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAgICAgICAnQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSc6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdQcmljZUNsYXNzJzogJ1ByaWNlQ2xhc3NfMTAwJyxcbiAgICAgICAgICAgICAgJ0RlZmF1bHRDYWNoZUJlaGF2aW9yJzoge1xuICAgICAgICAgICAgICAgICdBbGxvd2VkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICdHRVQnLFxuICAgICAgICAgICAgICAgICAgJ0hFQUQnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ0NhY2hlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICdIRUFEJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdUYXJnZXRPcmlnaW5JZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAnVmlld2VyUHJvdG9jb2xQb2xpY3knOiAncmVkaXJlY3QtdG8taHR0cHMnLFxuICAgICAgICAgICAgICAgICdGb3J3YXJkZWRWYWx1ZXMnOiB7XG4gICAgICAgICAgICAgICAgICAnUXVlcnlTdHJpbmcnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICdDb29raWVzJzogeyAnRm9yd2FyZCc6ICdub25lJyB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0NvbXByZXNzJzogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0lQVjZFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0h0dHBWZXJzaW9uJzogJ2h0dHAyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZGlzdHJpYnV0aW9uIHdpdGggQ2xvdWRGcm9udCBmdW5jdGlvbi1hc3NvY2lhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxuICAgICAgICAgICAgICBmdW5jdGlvbkFzc29jaWF0aW9uczogW3tcbiAgICAgICAgICAgICAgICBldmVudFR5cGU6IEZ1bmN0aW9uRXZlbnRUeXBlLlZJRVdFUl9SRVFVRVNULFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiBuZXcgRnVuY3Rpb24oc3RhY2ssICdUZXN0RnVuY3Rpb24nLCB7XG4gICAgICAgICAgICAgICAgICBjb2RlOiBGdW5jdGlvbkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICdEZWZhdWx0Q2FjaGVCZWhhdmlvcic6IHtcbiAgICAgICAgICAnRnVuY3Rpb25Bc3NvY2lhdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdFdmVudFR5cGUnOiAndmlld2VyLXJlcXVlc3QnLFxuICAgICAgICAgICAgICAnRnVuY3Rpb25BUk4nOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnVGVzdEZ1bmN0aW9uMjJBRDkwRkMnLFxuICAgICAgICAgICAgICAgICAgJ0Z1bmN0aW9uQVJOJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Rpc3RyaWJ1dGlvbiB3aXRoIHJlc29sdmFibGUgbGFtYmRhLWFzc29jaWF0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgIGNvbnN0IGxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0xhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxuICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbkFzc29jaWF0aW9uczogW3tcbiAgICAgICAgICAgICAgICBldmVudFR5cGU6IExhbWJkYUVkZ2VFdmVudFR5cGUuT1JJR0lOX1JFUVVFU1QsXG4gICAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb246IGxhbWJkYUZ1bmN0aW9uLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVCb2R5OiB0cnVlLFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAnRGVmYXVsdENhY2hlQmVoYXZpb3InOiB7XG4gICAgICAgICAgJ0xhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRXZlbnRUeXBlJzogJ29yaWdpbi1yZXF1ZXN0JyxcbiAgICAgICAgICAgICAgJ0luY2x1ZGVCb2R5JzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0xhbWJkYUZ1bmN0aW9uQVJOJzoge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnTGFtYmRhQ3VycmVudFZlcnNpb25ERjcwNkY2QTlhNjMyYTI5NGFlM2E5Y2Q0ZDU1MGYxYzRlMjY2MTlkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhc3NvY2lhdGUgYSBsYW1iZGEgd2l0aCByZW1vdmFibGUgZW52IHZhcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICBjb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuICAgIGxhbWJkYUZ1bmN0aW9uLmFkZEVudmlyb25tZW50KCdLRVknLCAndmFsdWUnLCB7IHJlbW92ZUluRWRnZTogdHJ1ZSB9KTtcblxuICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICB7XG4gICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zOiBbe1xuICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVRVUVTVCxcbiAgICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbjogbGFtYmRhRnVuY3Rpb24uY3VycmVudFZlcnNpb24sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBFbnZpcm9ubWVudDogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhc3NvY2lhdGluZyBhIGxhbWJkYSB3aXRoIGluY29tcGF0aWJsZSBlbnYgdmFycycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgIGNvbnN0IGxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0xhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBLRVk6ICd2YWx1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnM6IFt7XG4gICAgICAgICAgICAgICAgZXZlbnRUeXBlOiBMYW1iZGFFZGdlRXZlbnRUeXBlLk9SSUdJTl9SRVFVRVNULFxuICAgICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uOiBsYW1iZGFGdW5jdGlvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9LRVkvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGFzc29jaWF0aW5nIGEgbGFtYmRhIHdpdGggaW5jbHVkZUJvZHkgYW5kIGEgcmVzcG9uc2UgZXZlbnQgdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgIGNvbnN0IGZuVmVyc2lvbiA9IGxhbWJkYS5WZXJzaW9uLmZyb21WZXJzaW9uQXJuKHN0YWNrLCAnVmVyc2lvbicsICdhcm46YXdzOmxhbWJkYTp0ZXN0cmVnaW9uOjExMTExMTExMTExMTpmdW5jdGlvbjpteVRlc3RGdW46djEnKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbkFzc29jaWF0aW9uczogW3tcbiAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZS5WSUVXRVJfUkVTUE9OU0UsXG4gICAgICAgICAgICAgICAgICBpbmNsdWRlQm9keTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uOiBmblZlcnNpb24sXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC8naW5jbHVkZUJvZHknIGNhbiBvbmx5IGJlIHRydWUgZm9yIE9SSUdJTl9SRVFVRVNUIG9yIFZJRVdFUl9SRVFVRVNUIGV2ZW50IHR5cGVzLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZGlzdHJpYnV0aW9uIGhhcyBhIGRlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoZGlzdHJpYnV0aW9uLm5vZGUuZGVmYXVsdENoaWxkIGluc3RhbmNlb2YgQ2ZuRGlzdHJpYnV0aW9uKS50b0VxdWFsKHRydWUpO1xuXG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbGxvd3MgbXVsdGlwbGUgYWxpYXNDb25maWd1cmF0aW9uIENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24gcGVyIHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHMzQnVja2V0U291cmNlID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgY29uc3Qgb3JpZ2luQ29uZmlncyA9IFt7XG4gICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZSB9LFxuICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICB9XTtcblxuICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgb3JpZ2luQ29uZmlncyxcbiAgICAgIGFsaWFzQ29uZmlndXJhdGlvbjogeyBhY21DZXJ0UmVmOiAnYWNtX3JlZicsIG5hbWVzOiBbJ3d3dy5leGFtcGxlLmNvbSddIH0sXG4gICAgfSk7XG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbm90aGVyQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3MsXG4gICAgICBhbGlhc0NvbmZpZ3VyYXRpb246IHsgYWNtQ2VydFJlZjogJ2Fub3RoZXJfYWNtX3JlZicsIG5hbWVzOiBbJ2Z0cC5leGFtcGxlLmNvbSddIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAnQWxpYXNlcyc6IFsnd3d3LmV4YW1wbGUuY29tJ10sXG4gICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAnQWNtQ2VydGlmaWNhdGVBcm4nOiAnYWNtX3JlZicsXG4gICAgICAgICAgJ1NzbFN1cHBvcnRNZXRob2QnOiAnc25pLW9ubHknLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICdBbGlhc2VzJzogWydmdHAuZXhhbXBsZS5jb20nXSxcbiAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICdBY21DZXJ0aWZpY2F0ZUFybic6ICdhbm90aGVyX2FjbV9yZWYnLFxuICAgICAgICAgICdTc2xTdXBwb3J0TWV0aG9kJzogJ3NuaS1vbmx5JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZpZXdlckNlcnRpZmljYXRlJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdhY21DZXJ0aWZpY2F0ZScsICgpID0+IHtcbiAgICAgIHRlc3QoJ2Jhc2UgdXNhZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICAgICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlKHN0YWNrLCAnY2VydCcsIHtcbiAgICAgICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZTogVmlld2VyQ2VydGlmaWNhdGUuZnJvbUFjbUNlcnRpZmljYXRlKGNlcnRpZmljYXRlKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICAgICAnQWxpYXNlcyc6IFtdLFxuICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAnQWNtQ2VydGlmaWNhdGVBcm4nOiB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdjZXJ0NTZDQTk0RUInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnU3NsU3VwcG9ydE1ldGhvZCc6ICdzbmktb25seScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnaW1wb3J0ZWQgY2VydGlmaWNhdGUgZnJvbUNlcnRpZmljYXRlQXJuJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIGNvbnN0IGNlcnRpZmljYXRlID0gY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihcbiAgICAgICAgICBzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206dXMtZWFzdC0xOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcsXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7IHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQgfSxcbiAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgdmlld2VyQ2VydGlmaWNhdGU6IFZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShjZXJ0aWZpY2F0ZSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgJ0FsaWFzZXMnOiBbXSxcbiAgICAgICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAgICAgJ0FjbUNlcnRpZmljYXRlQXJuJzogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMToxMTExMTExOmNlcnRpZmljYXRlLzExLTMzMzZmMS00NDQ4M2QtYWRjNy05Y2QzNzVjNTE2OWQnLFxuICAgICAgICAgICAgICAnU3NsU3VwcG9ydE1ldGhvZCc6ICdzbmktb25seScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnYWR2YW5jZWQgdXNhZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICAgICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlKHN0YWNrLCAnY2VydCcsIHtcbiAgICAgICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZTogVmlld2VyQ2VydGlmaWNhdGUuZnJvbUFjbUNlcnRpZmljYXRlKGNlcnRpZmljYXRlLCB7XG4gICAgICAgICAgICBzZWN1cml0eVBvbGljeTogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5TU0xfVjMsXG4gICAgICAgICAgICBzc2xNZXRob2Q6IFNTTE1ldGhvZC5WSVAsXG4gICAgICAgICAgICBhbGlhc2VzOiBbJ2V4YW1wbGUuY29tJywgJ3d3dy5leGFtcGxlLmNvbSddLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgJ0Rpc3RyaWJ1dGlvbkNvbmZpZyc6IHtcbiAgICAgICAgICAgICdBbGlhc2VzJzogWydleGFtcGxlLmNvbScsICd3d3cuZXhhbXBsZS5jb20nXSxcbiAgICAgICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAgICAgJ0FjbUNlcnRpZmljYXRlQXJuJzoge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnY2VydDU2Q0E5NEVCJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ01pbmltdW1Qcm90b2NvbFZlcnNpb24nOiAnU1NMdjMnLFxuICAgICAgICAgICAgICAnU3NsU3VwcG9ydE1ldGhvZCc6ICd2aXAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnaWFtQ2VydGlmaWNhdGUnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdiYXNlIHVzYWdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBWaWV3ZXJDZXJ0aWZpY2F0ZS5mcm9tSWFtQ2VydGlmaWNhdGUoJ3Rlc3QnKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICAgICAnQWxpYXNlcyc6IFtdLFxuICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAnSWFtQ2VydGlmaWNhdGVJZCc6ICd0ZXN0JyxcbiAgICAgICAgICAgICAgJ1NzbFN1cHBvcnRNZXRob2QnOiAnc25pLW9ubHknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ2FkdmFuY2VkIHVzYWdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBWaWV3ZXJDZXJ0aWZpY2F0ZS5mcm9tSWFtQ2VydGlmaWNhdGUoJ3Rlc3QnLCB7XG4gICAgICAgICAgICBzZWN1cml0eVBvbGljeTogU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjEsXG4gICAgICAgICAgICBzc2xNZXRob2Q6IFNTTE1ldGhvZC5WSVAsXG4gICAgICAgICAgICBhbGlhc2VzOiBbJ2V4YW1wbGUuY29tJ10sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgJ0FsaWFzZXMnOiBbJ2V4YW1wbGUuY29tJ10sXG4gICAgICAgICAgICAnVmlld2VyQ2VydGlmaWNhdGUnOiB7XG4gICAgICAgICAgICAgICdJYW1DZXJ0aWZpY2F0ZUlkJzogJ3Rlc3QnLFxuICAgICAgICAgICAgICAnTWluaW11bVByb3RvY29sVmVyc2lvbic6ICdUTFN2MScsXG4gICAgICAgICAgICAgICdTc2xTdXBwb3J0TWV0aG9kJzogJ3ZpcCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdjbG91ZEZyb250RGVmYXVsdENlcnRpZmljYXRlJywgKCkgPT4ge1xuICAgICAgdGVzdCgnYmFzZSB1c2FnZScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZTogVmlld2VyQ2VydGlmaWNhdGUuZnJvbUNsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICdEaXN0cmlidXRpb25Db25maWcnOiB7XG4gICAgICAgICAgICAnQWxpYXNlcyc6IFtdLFxuICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAnQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnYWxpYXNlcyBhcmUgc2V0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBWaWV3ZXJDZXJ0aWZpY2F0ZS5mcm9tQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSgnZXhhbXBsZS5jb20nLCAnd3d3LmV4YW1wbGUuY29tJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgJ0FsaWFzZXMnOiBbJ2V4YW1wbGUuY29tJywgJ3d3dy5leGFtcGxlLmNvbSddLFxuICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAnQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdlcnJvcnMnLCAoKSA9PiB7XG4gICAgICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIGlmIGJvdGggZGVwcmVjYXRlZCBhbGlhc0NvbmZpZ3VyYXRpb24gYW5kIHZpZXdlckNlcnRpZmljYXRlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGFsaWFzQ29uZmlndXJhdGlvbjogeyBhY21DZXJ0UmVmOiAndGVzdCcsIG5hbWVzOiBbJ2Z0cC5leGFtcGxlLmNvbSddIH0sXG4gICAgICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZTogVmlld2VyQ2VydGlmaWNhdGUuZnJvbUNsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUoJ2V4YW1wbGUuY29tJywgJ3d3dy5leGFtcGxlLmNvbScpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9Zb3UgY2Fubm90IHNldCBib3RoIGFsaWFzQ29uZmlndXJhdGlvbiBhbmQgdmlld2VyQ2VydGlmaWNhdGUgcHJvcGVydGllcy8pO1xuXG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgndGhyb3dzIGlmIGludmFsaWQgc2VjdXJpdHkgcG9saWN5IGZvciBTU0wgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBWaWV3ZXJDZXJ0aWZpY2F0ZS5mcm9tSWFtQ2VydGlmaWNhdGUoJ3Rlc3QnLCB7XG4gICAgICAgICAgICAgIHNlY3VyaXR5UG9saWN5OiBTZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMV8xXzIwMTYsXG4gICAgICAgICAgICAgIHNzbE1ldGhvZDogU1NMTWV0aG9kLlZJUCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9UTFN2MS4xXzIwMTYgaXMgbm90IGNvbXBhYnRpYmxlIHdpdGggc3NsTWV0aG9kIHZpcC4vKTtcblxuXG4gICAgICB9KTtcbiAgICAgIC8vIEZJWE1FIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNDcyNFxuICAgICAgdGVzdCgnZG9lcyBub3QgdGhyb3cgaWYgYWNtQ2VydGlmaWNhdGUgZXhwbGljaXRseSBub3QgaW4gdXMtZWFzdC0xJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIGNvbnN0IGNlcnRpZmljYXRlID0gY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihcbiAgICAgICAgICBzdGFjaywgJ2NlcnQnLCAnYXJuOmF3czphY206ZXUtd2VzdC0zOjExMTExMTE6Y2VydGlmaWNhdGUvMTEtMzMzNmYxLTQ0NDgzZC1hZGM3LTljZDM3NWM1MTY5ZCcsXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7IHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQgfSxcbiAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgdmlld2VyQ2VydGlmaWNhdGU6IFZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShjZXJ0aWZpY2F0ZSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRnJvbnQ6OkRpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgJ0FsaWFzZXMnOiBbXSxcbiAgICAgICAgICAgICdWaWV3ZXJDZXJ0aWZpY2F0ZSc6IHtcbiAgICAgICAgICAgICAgJ0FjbUNlcnRpZmljYXRlQXJuJzogJ2Fybjphd3M6YWNtOmV1LXdlc3QtMzoxMTExMTExOmNlcnRpZmljYXRlLzExLTMzMzZmMS00NDQ4M2QtYWRjNy05Y2QzNzVjNTE2OWQnLFxuICAgICAgICAgICAgICAnU3NsU3VwcG9ydE1ldGhvZCc6ICdzbmktb25seScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlZGdlbGFtYmRhLmFtYXpvbmF3cy5jb20gaXMgYWRkZWQgdG8gdGhlIHRydXN0IHBvbGljeSBvZiBsYW1iZGEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTGFtYmRhJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcbiAgICBjb25zdCBsYW1iZGFWZXJzaW9uID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAnTGFtYmRhVmVyc2lvbicsIHsgbGFtYmRhOiBmbiB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdHJpYnV0aW9uJywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICB7XG4gICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBldmVudFR5cGU6IExhbWJkYUVkZ2VFdmVudFR5cGUuT1JJR0lOX1JFUVVFU1QsXG4gICAgICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbjogbGFtYmRhVmVyc2lvbixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAnU2VydmljZSc6ICdlZGdlbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZWRnZWxhbWJkYS5hbWF6b25hd3MuY29tIGlzIG5vdCBhZGRlZCB0byBsYW1iZGEgcm9sZSBmb3IgaW1wb3J0ZWQgZnVuY3Rpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICAgIGNvbnN0IGxhbWJkYVZlcnNpb24gPSBsYW1iZGEuVmVyc2lvbi5mcm9tVmVyc2lvbkFybihzdGFjaywgJ1ZlcnNpb24nLCAnYXJuOmF3czpsYW1iZGE6ZnVuY3Rpb24tcmVnaW9uOjExMTExMTExMTExMTpmdW5jdGlvbjpmdW5jdGlvbi1uYW1lJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3RyaWJ1dGlvbicsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7IHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiBMYW1iZGFFZGdlRXZlbnRUeXBlLk9SSUdJTl9SRVFVRVNULFxuICAgICAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb246IGxhbWJkYVZlcnNpb24sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnZ2VvIHJlc3RyaWN0aW9uJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdzdWNjZXNzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnYWxsb3dsaXN0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICBzM09yaWdpblNvdXJjZTogeyBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0IH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIGdlb1Jlc3RyaWN0aW9uOiBHZW9SZXN0cmljdGlvbi5hbGxvd2xpc3QoJ1VTJywgJ1VLJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3Jzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLFxuICAgICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgJ0RlZmF1bHRSb290T2JqZWN0JzogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgJ09yaWdpbnMnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbkF0dGVtcHRzJzogMyxcbiAgICAgICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvblRpbWVvdXQnOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAgICAgJ1MzT3JpZ2luQ29uZmlnJzoge30sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAgICAgICAnQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJ1ByaWNlQ2xhc3MnOiAnUHJpY2VDbGFzc18xMDAnLFxuICAgICAgICAgICAgICAgICAgJ0RlZmF1bHRDYWNoZUJlaGF2aW9yJzoge1xuICAgICAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ0hFQUQnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnQ2FjaGVkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdUYXJnZXRPcmlnaW5JZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICAgICAgJ0ZvcndhcmRlZFZhbHVlcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnUXVlcnlTdHJpbmcnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAnQ29va2llcyc6IHsgJ0ZvcndhcmQnOiAnbm9uZScgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ0NvbXByZXNzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnRW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAnSVBWNkVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgJ0h0dHBWZXJzaW9uJzogJ2h0dHAyJyxcbiAgICAgICAgICAgICAgICAgICdSZXN0cmljdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdHZW9SZXN0cmljdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnTG9jYXRpb25zJzogWydVUycsICdVSyddLFxuICAgICAgICAgICAgICAgICAgICAgICdSZXN0cmljdGlvblR5cGUnOiAnd2hpdGVsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdkZW55bGlzdCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCB9LFxuICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBnZW9SZXN0cmljdGlvbjogR2VvUmVzdHJpY3Rpb24uZGVueWxpc3QoJ1VTJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICAgJ0J1Y2tldDgzOTA4RTc3Jzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Q0ZEaXN0cmlidXRpb240N0UzOTgzQic6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLFxuICAgICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgICAnRGlzdHJpYnV0aW9uQ29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgJ0RlZmF1bHRSb290T2JqZWN0JzogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgJ09yaWdpbnMnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbkF0dGVtcHRzJzogMyxcbiAgICAgICAgICAgICAgICAgICAgICAnQ29ubmVjdGlvblRpbWVvdXQnOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAnRG9tYWluTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVnaW9uYWxEb21haW5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnSWQnOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICAgICAgJ1MzT3JpZ2luQ29uZmlnJzoge30sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ1ZpZXdlckNlcnRpZmljYXRlJzoge1xuICAgICAgICAgICAgICAgICAgICAnQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJ1ByaWNlQ2xhc3MnOiAnUHJpY2VDbGFzc18xMDAnLFxuICAgICAgICAgICAgICAgICAgJ0RlZmF1bHRDYWNoZUJlaGF2aW9yJzoge1xuICAgICAgICAgICAgICAgICAgICAnQWxsb3dlZE1ldGhvZHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ0hFQUQnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnQ2FjaGVkTWV0aG9kcyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAnSEVBRCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdUYXJnZXRPcmlnaW5JZCc6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgICAgJ1ZpZXdlclByb3RvY29sUG9saWN5JzogJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgICAgICAgICAgICAgICAgICAgJ0ZvcndhcmRlZFZhbHVlcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnUXVlcnlTdHJpbmcnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAnQ29va2llcyc6IHsgJ0ZvcndhcmQnOiAnbm9uZScgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ0NvbXByZXNzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnRW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAnSVBWNkVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgJ0h0dHBWZXJzaW9uJzogJ2h0dHAyJyxcbiAgICAgICAgICAgICAgICAgICdSZXN0cmljdGlvbnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdHZW9SZXN0cmljdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnTG9jYXRpb25zJzogWydVUyddLFxuICAgICAgICAgICAgICAgICAgICAgICdSZXN0cmljdGlvblR5cGUnOiAnYmxhY2tsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgdGVzdCgndGhyb3dzIGlmIGxvY2F0aW9ucyBpcyBlbXB0eSBhcnJheScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBHZW9SZXN0cmljdGlvbi5hbGxvd2xpc3QoKTtcbiAgICAgICAgfSkudG9UaHJvdygvU2hvdWxkIHByb3ZpZGUgYXQgbGVhc3QgMSBsb2NhdGlvbi8pO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgR2VvUmVzdHJpY3Rpb24uZGVueWxpc3QoKTtcbiAgICAgICAgfSkudG9UaHJvdygvU2hvdWxkIHByb3ZpZGUgYXQgbGVhc3QgMSBsb2NhdGlvbi8pO1xuXG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgndGhyb3dzIGlmIGxvY2F0aW9ucyBmb3JtYXQgaXMgd3JvbmcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgR2VvUmVzdHJpY3Rpb24uYWxsb3dsaXN0KCd1cycpO1xuICAgICAgICB9KS50b1Rocm93KC9JbnZhbGlkIGxvY2F0aW9uIGZvcm1hdCBmb3IgbG9jYXRpb246IHVzLCBsb2NhdGlvbiBzaG91bGQgYmUgdHdvLWxldHRlciBhbmQgdXBwZXJjYXNlIGNvdW50cnkgSVNPIDMxNjYtMS1hbHBoYS0yIGNvZGUvKTtcblxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIEdlb1Jlc3RyaWN0aW9uLmRlbnlsaXN0KCd1cycpO1xuICAgICAgICB9KS50b1Rocm93KC9JbnZhbGlkIGxvY2F0aW9uIGZvcm1hdCBmb3IgbG9jYXRpb246IHVzLCBsb2NhdGlvbiBzaG91bGQgYmUgdHdvLWxldHRlciBhbmQgdXBwZXJjYXNlIGNvdW50cnkgSVNPIDMxNjYtMS1hbHBoYS0yIGNvZGUvKTtcblxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0Nvbm5lY3Rpb24gYmVoYXZpb3JzIGJldHdlZW4gQ2xvdWRGcm9udCBhbmQgeW91ciBvcmlnaW4nLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3N1Y2Nlc3MnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdjb25uZWN0aW9uQXR0ZW1wdHMgPSAxJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25BdHRlbXB0czogMSxcbiAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkubm90LnRvVGhyb3coL2Nvbm5lY3Rpb25BdHRlbXB0czogWW91IGNhbiBzcGVjaWZ5IDEsIDIsIG9yIDMgYXMgdGhlIG51bWJlciBvZiBhdHRlbXB0cy4vKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCczID0gY29ubmVjdGlvbkF0dGVtcHRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25BdHRlbXB0czogMyxcbiAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkubm90LnRvVGhyb3coL2Nvbm5lY3Rpb25BdHRlbXB0czogWW91IGNhbiBzcGVjaWZ5IDEsIDIsIG9yIDMgYXMgdGhlIG51bWJlciBvZiBhdHRlbXB0cy4vKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdjb25uZWN0aW9uVGltZW91dCA9IDEnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgY29ubmVjdGlvblRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEpLFxuICAgICAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHsgZG9tYWluTmFtZTogJ215b3JpZ2luLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5ub3QudG9UaHJvdygvY29ubmVjdGlvblRpbWVvdXQ6IFlvdSBjYW4gc3BlY2lmeSBhIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gMSBhbmQgMTAgKGluY2x1c2l2ZSkuLyk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnMTAgPSBjb25uZWN0aW9uVGltZW91dCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgICAgICBjb25uZWN0aW9uVGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHsgZG9tYWluTmFtZTogJ215b3JpZ2luLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5ub3QudG9UaHJvdygvY29ubmVjdGlvblRpbWVvdXQ6IFlvdSBjYW4gc3BlY2lmeSBhIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gMSBhbmQgMTAgKGluY2x1c2l2ZSkuLyk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdlcnJvcnMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdjb25uZWN0aW9uQXR0ZW1wdHMgPSAxLjEnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgY29ubmVjdGlvbkF0dGVtcHRzOiAxLjEsXG4gICAgICAgICAgICAgIGN1c3RvbU9yaWdpblNvdXJjZTogeyBkb21haW5OYW1lOiAnbXlvcmlnaW4uY29tJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coL2Nvbm5lY3Rpb25BdHRlbXB0czogWW91IGNhbiBzcGVjaWZ5IDEsIDIsIG9yIDMgYXMgdGhlIG51bWJlciBvZiBhdHRlbXB0cy4vKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdjb25uZWN0aW9uQXR0ZW1wdHMgPSAtMScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgICAgICBjb25uZWN0aW9uQXR0ZW1wdHM6IC0xLFxuICAgICAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHsgZG9tYWluTmFtZTogJ215b3JpZ2luLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9jb25uZWN0aW9uQXR0ZW1wdHM6IFlvdSBjYW4gc3BlY2lmeSAxLCAyLCBvciAzIGFzIHRoZSBudW1iZXIgb2YgYXR0ZW1wdHMuLyk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnY29ubmVjdGlvbkF0dGVtcHRzIDwgMScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgbmV3IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgICAgICBjb25uZWN0aW9uQXR0ZW1wdHM6IDAsXG4gICAgICAgICAgICAgIGN1c3RvbU9yaWdpblNvdXJjZTogeyBkb21haW5OYW1lOiAnbXlvcmlnaW4uY29tJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coL2Nvbm5lY3Rpb25BdHRlbXB0czogWW91IGNhbiBzcGVjaWZ5IDEsIDIsIG9yIDMgYXMgdGhlIG51bWJlciBvZiBhdHRlbXB0cy4vKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCczIDwgY29ubmVjdGlvbkF0dGVtcHRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25BdHRlbXB0czogNCxcbiAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvY29ubmVjdGlvbkF0dGVtcHRzOiBZb3UgY2FuIHNwZWNpZnkgMSwgMiwgb3IgMyBhcyB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzLi8pO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ2Nvbm5lY3Rpb25UaW1lb3V0ID0gMS4xJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25UaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxLjEpLFxuICAgICAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHsgZG9tYWluTmFtZTogJ215b3JpZ2luLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KC9tdXN0IGJlIGEgd2hvbGUgbnVtYmVyIG9mLyk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnY29ubmVjdGlvblRpbWVvdXQgPCAxJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25UaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygwKSxcbiAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvY29ubmVjdGlvblRpbWVvdXQ6IFlvdSBjYW4gc3BlY2lmeSBhIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gMSBhbmQgMTAgXFwoaW5jbHVzaXZlXFwpLi8pO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJzEwIDwgY29ubmVjdGlvblRpbWVvdXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgY29ubmVjdGlvblRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDExKSxcbiAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygvY29ubmVjdGlvblRpbWVvdXQ6IFlvdSBjYW4gc3BlY2lmeSBhIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gMSBhbmQgMTAgXFwoaW5jbHVzaXZlXFwpLi8pO1xuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhpc3RpbmcgZGlzdHJpYnV0aW9ucyBjYW4gYmUgaW1wb3J0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZGlzdCA9IENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24uZnJvbURpc3RyaWJ1dGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZERpc3QnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZDExMTExMWFiY2RlZjguY2xvdWRmcm9udC5uZXQnLFxuICAgICAgZGlzdHJpYnV0aW9uSWQ6ICcwMTIzNDVBQkNERUYnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGRpc3QuZGlzdHJpYnV0aW9uRG9tYWluTmFtZSkudG9FcXVhbCgnZDExMTExMWFiY2RlZjguY2xvdWRmcm9udC5uZXQnKTtcbiAgICBleHBlY3QoZGlzdC5kaXN0cmlidXRpb25JZCkudG9FcXVhbCgnMDEyMzQ1QUJDREVGJyk7XG5cblxuICB9KTtcbn0pO1xuXG50ZXN0KCdncmFudHMgY3VzdG9tIGFjdGlvbnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICBvcmlnaW5Db25maWdzOiBbe1xuICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7IGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nIH0sXG4gICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgIH1dLFxuICB9KTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gIH0pO1xuICBkaXN0cmlidXRpb24uZ3JhbnQocm9sZSwgJ2Nsb3VkZnJvbnQ6TGlzdEludmFsaWRhdGlvbnMnLCAnY2xvdWRmcm9udDpHZXRJbnZhbGlkYXRpb24nKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdjbG91ZGZyb250Okxpc3RJbnZhbGlkYXRpb25zJyxcbiAgICAgICAgICAgICdjbG91ZGZyb250OkdldEludmFsaWRhdGlvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpjbG91ZGZyb250OjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOmRpc3RyaWJ1dGlvbi8nLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnRGlzdHJpYnV0aW9uQ0ZEaXN0cmlidXRpb244ODJBNzMxMycgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZ3JhbnRzIGNyZWF0ZUludmFsaWRhdGlvbicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHsgZG9tYWluTmFtZTogJ215b3JpZ2luLmNvbScgfSxcbiAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgfV0sXG4gIH0pO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgfSk7XG4gIGRpc3RyaWJ1dGlvbi5ncmFudENyZWF0ZUludmFsaWRhdGlvbihyb2xlKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6Y2xvdWRmcm9udDo6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpkaXN0cmlidXRpb24vJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0Rpc3RyaWJ1dGlvbkNGRGlzdHJpYnV0aW9uODgyQTczMTMnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=