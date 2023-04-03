"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const s3deploy = require("../lib");
/* eslint-disable max-len */
test('deploy from local directory asset', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app);
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
                'Arn',
            ],
        },
        SourceBucketNames: [{
                Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A',
            }],
        SourceObjectKeys: [{
                'Fn::Join': [
                    '',
                    [
                        {
                            'Fn::Select': [
                                0,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            }],
        DestinationBucketName: {
            Ref: 'DestC383B82A',
        },
    });
});
test('deploy with configured log retention', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        logRetention: logs.RetentionDays.ONE_WEEK,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', { RetentionInDays: 7 });
});
test('deploy from local directory assets', () => {
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app);
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [
            s3deploy.Source.asset(path.join(__dirname, 'my-website')),
            s3deploy.Source.asset(path.join(__dirname, 'my-website-second')),
        ],
        destinationBucket: bucket,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
                'Arn',
            ],
        },
        SourceBucketNames: [
            {
                Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A',
            },
            {
                Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3Bucket99793559',
            },
        ],
        SourceObjectKeys: [
            {
                'Fn::Join': [
                    '',
                    [
                        {
                            'Fn::Select': [
                                0,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            },
            {
                'Fn::Join': [
                    '',
                    [
                        {
                            'Fn::Select': [
                                0,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            },
        ],
        DestinationBucketName: {
            Ref: 'DestC383B82A',
        },
    });
});
test('fails if local asset is a non-zip file', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // THEN
    expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
        destinationBucket: bucket,
    })).toThrow(/Asset path must be either a \.zip file or a directory/);
});
test('deploy from a local .zip file', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
    });
});
test('deploy from a local .zip file when efs is enabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        useEfs: true,
        vpc: new ec2.Vpc(stack, 'Vpc'),
    });
    //THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
            Variables: {
                MOUNT_PATH: '/mnt/lambda',
            },
        },
        FileSystemConfigs: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':elasticfilesystem:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':access-point/',
                            {
                                Ref: 'BucketDeploymentEFSVPCc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175AccessPoint557A73A5',
                            },
                        ],
                    ],
                },
                LocalMountPath: '/mnt/lambda',
            },
        ],
        Layers: [
            {
                Ref: 'DeployAwsCliLayer8445CB38',
            },
        ],
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175SecurityGroup3E7AAF58',
                        'GroupId',
                    ],
                },
            ],
            SubnetIds: [
                {
                    Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
                {
                    Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
                },
            ],
        },
    });
});
cdk_build_tools_1.testDeprecated('honors passed asset options', () => {
    // The 'exclude' property is deprecated and not deprecated in AssetOptions interface.
    // The interface through a complex set of inheritance chain has a 'exclude' prop that is deprecated
    // and another 'exclude' prop that is not deprecated.
    // Using 'testDeprecated' block here since there's no way to work around this craziness.
    // When the deprecated property is removed from source, this block can be dropped.
    // GIVEN
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new cdk.Stack(app);
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'), {
                exclude: ['*', '!index.html'],
            })],
        destinationBucket: bucket,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
                'Arn',
            ],
        },
        SourceBucketNames: [{
                Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3Bucket02009982',
            }],
        SourceObjectKeys: [{
                'Fn::Join': [
                    '',
                    [
                        {
                            'Fn::Select': [
                                0,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3VersionKey07726F25',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        '||',
                                        {
                                            Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3VersionKey07726F25',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
            }],
        DestinationBucketName: {
            Ref: 'DestC383B82A',
        },
    });
});
test('retainOnDelete can be used to retain files when resource is deleted', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        retainOnDelete: true,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        RetainOnDelete: true,
    });
});
test('user metadata is correctly transformed', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        metadata: {
            A: '1',
            B: '2',
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        UserMetadata: { a: '1', b: '2' },
    });
});
test('system metadata is correctly transformed', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const expiration = cdk.Expiration.after(cdk.Duration.hours(12));
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        contentType: 'text/html',
        contentLanguage: 'en',
        storageClass: s3deploy.StorageClass.INTELLIGENT_TIERING,
        contentDisposition: 'inline',
        serverSideEncryption: s3deploy.ServerSideEncryption.AWS_KMS,
        serverSideEncryptionAwsKmsKeyId: 'mykey',
        serverSideEncryptionCustomerAlgorithm: 'rot13',
        websiteRedirectLocation: 'example',
        cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.hours(1))],
        expires: expiration,
        accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        SystemMetadata: {
            'content-type': 'text/html',
            'content-language': 'en',
            'content-disposition': 'inline',
            'storage-class': 'INTELLIGENT_TIERING',
            'sse': 'aws:kms',
            'sse-kms-key-id': 'mykey',
            'cache-control': 'public, max-age=3600',
            'expires': expiration.date.toUTCString(),
            'sse-c-copy-source': 'rot13',
            'website-redirect': 'example',
            'acl': 'bucket-owner-full-control',
        },
    });
});
// type checking structure that forces to update it if BucketAccessControl changes
// see `--acl` here: https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
const accessControlMap = {
    [s3.BucketAccessControl.PRIVATE]: 'private',
    [s3.BucketAccessControl.PUBLIC_READ]: 'public-read',
    [s3.BucketAccessControl.PUBLIC_READ_WRITE]: 'public-read-write',
    [s3.BucketAccessControl.AUTHENTICATED_READ]: 'authenticated-read',
    [s3.BucketAccessControl.AWS_EXEC_READ]: 'aws-exec-read',
    [s3.BucketAccessControl.BUCKET_OWNER_READ]: 'bucket-owner-read',
    [s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL]: 'bucket-owner-full-control',
    [s3.BucketAccessControl.LOG_DELIVERY_WRITE]: 'log-delivery-write',
};
test.each(Object.entries(accessControlMap))('system metadata acl %s is correctly transformed', (accessControl, systemMetadataKeyword) => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        accessControl: accessControl,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        SystemMetadata: {
            acl: systemMetadataKeyword,
        },
    });
});
test('expires type has correct values', () => {
    expect(cdk.Expiration.atDate(new Date('Sun, 26 Jan 2020 00:53:20 GMT')).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(cdk.Expiration.atTimestamp(1580000000000).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Math.abs(new Date(cdk.Expiration.after(cdk.Duration.minutes(10)).date.toUTCString()).getTime() - (Date.now() + 600000)) < 15000).toBeTruthy();
    expect(cdk.Expiration.fromString('Tue, 04 Feb 2020 08:45:33 GMT').date.toUTCString()).toEqual('Tue, 04 Feb 2020 08:45:33 GMT');
});
test('cache control type has correct values', () => {
    expect(s3deploy.CacheControl.mustRevalidate().value).toEqual('must-revalidate');
    expect(s3deploy.CacheControl.noCache().value).toEqual('no-cache');
    expect(s3deploy.CacheControl.noTransform().value).toEqual('no-transform');
    expect(s3deploy.CacheControl.setPublic().value).toEqual('public');
    expect(s3deploy.CacheControl.setPrivate().value).toEqual('private');
    expect(s3deploy.CacheControl.proxyRevalidate().value).toEqual('proxy-revalidate');
    expect(s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1)).value).toEqual('max-age=60');
    expect(s3deploy.CacheControl.sMaxAge(cdk.Duration.minutes(1)).value).toEqual('s-maxage=60');
    expect(s3deploy.CacheControl.fromString('only-if-cached').value).toEqual('only-if-cached');
});
test('storage class type has correct values', () => {
    expect(s3deploy.StorageClass.STANDARD).toEqual('STANDARD');
    expect(s3deploy.StorageClass.REDUCED_REDUNDANCY).toEqual('REDUCED_REDUNDANCY');
    expect(s3deploy.StorageClass.STANDARD_IA).toEqual('STANDARD_IA');
    expect(s3deploy.StorageClass.ONEZONE_IA).toEqual('ONEZONE_IA');
    expect(s3deploy.StorageClass.INTELLIGENT_TIERING).toEqual('INTELLIGENT_TIERING');
    expect(s3deploy.StorageClass.GLACIER).toEqual('GLACIER');
    expect(s3deploy.StorageClass.DEEP_ARCHIVE).toEqual('DEEP_ARCHIVE');
});
test('server side encryption type has correct values', () => {
    expect(s3deploy.ServerSideEncryption.AES_256).toEqual('AES256');
    expect(s3deploy.ServerSideEncryption.AWS_KMS).toEqual('aws:kms');
});
test('distribution can be used to provide a CloudFront distribution for invalidation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: bucket,
                },
                behaviors: [{ isDefaultBehavior: true }],
            },
        ],
    });
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ['/images/*'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        DistributionId: {
            Ref: 'DistributionCFDistribution882A7313',
        },
        DistributionPaths: ['/images/*'],
    });
});
test('invalidation can happen without distributionPaths provided', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: bucket,
                },
                behaviors: [{ isDefaultBehavior: true }],
            },
        ],
    });
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        distribution,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        DistributionId: {
            Ref: 'DistributionCFDistribution882A7313',
        },
    });
});
test('fails if distribution paths provided but not distribution ID', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // THEN
    expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
        destinationBucket: bucket,
        distributionPaths: ['/images/*'],
    })).toThrow(/Distribution must be specified if distribution paths are specified/);
});
test('fails if distribution paths don\'t start with "/"', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: bucket,
                },
                behaviors: [{ isDefaultBehavior: true }],
            },
        ],
    });
    // THEN
    expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ['images/*'],
    })).toThrow(/Distribution paths must start with "\/"/);
});
test('lambda execution role gets permissions to read from the source bucket and read/write in destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const source = new s3.Bucket(stack, 'Source');
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.bucket(source, 'file.zip')],
        destinationBucket: bucket,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        's3:GetObject*',
                        's3:GetBucket*',
                        's3:List*',
                    ],
                    Effect: 'Allow',
                    Resource: [
                        {
                            'Fn::GetAtt': [
                                'Source71E471F1',
                                'Arn',
                            ],
                        },
                        {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            'Source71E471F1',
                                            'Arn',
                                        ],
                                    },
                                    '/*',
                                ],
                            ],
                        },
                    ],
                },
                {
                    Action: [
                        's3:GetObject*',
                        's3:GetBucket*',
                        's3:List*',
                        's3:DeleteObject*',
                        's3:PutObject',
                        's3:PutObjectLegalHold',
                        's3:PutObjectRetention',
                        's3:PutObjectTagging',
                        's3:PutObjectVersionTagging',
                        's3:Abort*',
                    ],
                    Effect: 'Allow',
                    Resource: [
                        {
                            'Fn::GetAtt': [
                                'DestC383B82A',
                                'Arn',
                            ],
                        },
                        {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            'DestC383B82A',
                                            'Arn',
                                        ],
                                    },
                                    '/*',
                                ],
                            ],
                        },
                    ],
                },
            ],
            Version: '2012-10-17',
        },
        PolicyName: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
        Roles: [
            {
                Ref: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265',
            },
        ],
    });
});
test('lambda execution role gets putObjectAcl permission when deploying with accessControl', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const source = new s3.Bucket(stack, 'Source');
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.bucket(source, 'file.zip')],
        destinationBucket: bucket,
        accessControl: s3.BucketAccessControl.PUBLIC_READ,
    });
    // THEN
    const map = assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Policy');
    expect(map).toBeDefined();
    const resource = map[Object.keys(map)[0]];
    expect(resource.Properties.PolicyDocument.Statement).toContainEqual({
        Action: [
            's3:PutObjectAcl',
            's3:PutObjectVersionAcl',
        ],
        Effect: 'Allow',
        Resource: {
            'Fn::Join': [
                '',
                [
                    {
                        'Fn::GetAtt': [
                            'DestC383B82A',
                            'Arn',
                        ],
                    },
                    '/*',
                ],
            ],
        },
    });
});
test('memoryLimit can be used to specify the memory limit for the deployment resource handler', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    // we define 3 deployments with 2 different memory configurations
    new s3deploy.BucketDeployment(stack, 'Deploy256-1', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        memoryLimit: 256,
    });
    new s3deploy.BucketDeployment(stack, 'Deploy256-2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        memoryLimit: 256,
    });
    new s3deploy.BucketDeployment(stack, 'Deploy1024', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        memoryLimit: 1024,
    });
    // THEN
    // we expect to find only two handlers, one for each configuration
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', { MemorySize: 256 });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', { MemorySize: 1024 });
});
test('ephemeralStorageSize can be used to specify the storage size for the deployment resource handler', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    // we define 3 deployments with 2 different memory configurations
    new s3deploy.BucketDeployment(stack, 'Deploy256-1', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        ephemeralStorageSize: cdk.Size.mebibytes(512),
    });
    new s3deploy.BucketDeployment(stack, 'Deploy256-2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        ephemeralStorageSize: cdk.Size.mebibytes(512),
    });
    new s3deploy.BucketDeployment(stack, 'Deploy1024', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        ephemeralStorageSize: cdk.Size.mebibytes(1024),
    });
    // THEN
    // we expect to find only two handlers, one for each configuration
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        EphemeralStorage: {
            Size: 512,
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        EphemeralStorage: {
            Size: 1024,
        },
    });
});
test('deployment allows custom role to be supplied', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const existingRole = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazon.com'),
    });
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithRole', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        role: existingRole,
    });
    // THEN
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Role: {
            'Fn::GetAtt': [
                'Role1ABCC5F0',
                'Arn',
            ],
        },
    });
});
test('deploy without deleting missing files from destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        prune: false,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Prune: false,
    });
});
test('deploy with excluded files from destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        exclude: ['sample.js'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Exclude: ['sample.js'],
    });
});
test('deploy with included files from destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        include: ['sample.js'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Include: ['sample.js'],
    });
});
test('deploy with excluded and included files from destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        exclude: ['sample/*'],
        include: ['sample/include.json'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Exclude: ['sample/*'],
        Include: ['sample/include.json'],
    });
});
test('deploy with multiple exclude and include filters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        exclude: ['sample/*', 'another/*'],
        include: ['sample/include.json', 'another/include.json'],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Exclude: ['sample/*', 'another/*'],
        Include: ['sample/include.json', 'another/include.json'],
    });
});
test('deploy without extracting files in destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        extract: false,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Extract: false,
    });
});
test('deploy without extracting files in destination and get the object key', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    const deployment = new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
        destinationBucket: bucket,
        extract: false,
    });
    // Tests object key retrieval.
    void (cdk.Fn.select(0, deployment.objectKeys));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        Extract: false,
    });
});
test('given a source with markers and extract is false, BucketDeployment throws an error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const topic = new sns.Topic(stack, 'SomeTopic1', {});
    // WHEN
    const file = s3deploy.Source.jsonData('MyJsonObject', {
        'config.json': {
            Foo: {
                Bar: topic.topicArn,
            },
        },
    });
    new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [file],
        destinationBucket: bucket,
        extract: false,
    });
    // THEN
    expect(() => {
        assertions_1.Template.fromStack(stack);
    }).toThrow('Some sources are incompatible with extract=false; sources with deploy-time values (such as \'snsTopic.topicArn\') must be extracted.');
});
test('deployment allows vpc to be implicitly supplied to lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const vpc = new ec2.Vpc(stack, 'SomeVpc1', {});
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc1', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc81cec990a9a5d64a5922e5708ad8067eeb95c53d1SecurityGroup881B9147',
                        'GroupId',
                    ],
                },
            ],
            SubnetIds: [
                {
                    Ref: 'SomeVpc1PrivateSubnet1SubnetCBA5DD76',
                },
                {
                    Ref: 'SomeVpc1PrivateSubnet2SubnetD4B3A566',
                },
            ],
        },
    });
});
test('deployment allows vpc and subnets to be implicitly supplied to lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const vpc = new ec2.Vpc(stack, 'SomeVpc2', {});
    new ec2.PrivateSubnet(stack, 'SomeSubnet', {
        vpcId: vpc.vpcId,
        availabilityZone: vpc.availabilityZones[0],
        cidrBlock: vpc.vpcCidrBlock,
    });
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        vpc,
        vpcSubnets: {
            availabilityZones: [vpc.availabilityZones[0]],
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
            SecurityGroupIds: [
                {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc8a39596cb8641929fcf6a288bc9db5ab7b0f656adSecurityGroup11274779',
                        'GroupId',
                    ],
                },
            ],
            SubnetIds: [
                {
                    Ref: 'SomeVpc2PrivateSubnet1SubnetB1DC76FF',
                },
            ],
        },
    });
});
test('s3 deployment bucket is identical to destination bucket', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    const bd = new s3deploy.BucketDeployment(stack, 'Deployment', {
        destinationBucket: bucket,
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    });
    // Call this function
    void (bd.deployedBucket);
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('Custom::CDKBucketDeployment', {
        // Since this utilizes GetAtt, we know CFN will deploy the bucket first
        // before deploying other resources that rely call the destination bucket.
        DestinationBucketArn: { 'Fn::GetAtt': ['DestC383B82A', 'Arn'] },
    });
});
test('s3 deployed bucket in a different region has correct website url', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, {
        env: {
            region: 'us-east-1',
        },
    });
    const bucket = s3.Bucket.fromBucketAttributes(stack, 'Dest', {
        bucketName: 'my-bucket',
        // Bucket is in a different region than stack
        region: 'eu-central-1',
    });
    // WHEN
    const bd = new s3deploy.BucketDeployment(stack, 'Deployment', {
        destinationBucket: bucket,
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    });
    const websiteUrl = stack.resolve(bd.deployedBucket.bucketWebsiteUrl);
    // THEN
    // eu-central-1 uses website endpoint format with a `.`
    // see https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_website_region_endpoints
    expect(JSON.stringify(websiteUrl)).toContain('.s3-website.eu-central-1.');
});
test('using deployment bucket references the destination bucket by means of the CustomResource', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const deployment = new s3deploy.BucketDeployment(stack, 'Deployment', {
        destinationBucket: bucket,
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    });
    // WHEN
    new cdk.CfnOutput(stack, 'DestinationArn', {
        value: deployment.deployedBucket.bucketArn,
    });
    new cdk.CfnOutput(stack, 'DestinationName', {
        value: deployment.deployedBucket.bucketName,
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    expect(template.findOutputs('*')).toEqual({
        DestinationArn: {
            Value: { 'Fn::GetAtt': ['DeploymentCustomResource47E8B2E6', 'DestinationBucketArn'] },
        },
        DestinationName: {
            Value: {
                'Fn::Select': [0, {
                        'Fn::Split': ['/', {
                                'Fn::Select': [5, {
                                        'Fn::Split': [':',
                                            { 'Fn::GetAtt': ['DeploymentCustomResource47E8B2E6', 'DestinationBucketArn'] }],
                                    }],
                            }],
                    }],
            },
        },
    });
});
test('resource id includes memory and vpc', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const vpc = new ec2.Vpc(stack, 'SomeVpc2', {});
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        vpc,
        memoryLimit: 256,
    });
    // THEN
    assertions_1.Template.fromStack(stack).templateMatches({
        Resources: assertions_1.Match.objectLike({
            DeployWithVpc2CustomResource256MiBc8a39596cb8641929fcf6a288bc9db5ab7b0f656ad3C5F6E78: assertions_1.Match.objectLike({
                Type: 'Custom::CDKBucketDeployment',
            }),
        }),
    });
});
test('bucket includes custom resource owner tag', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const vpc = new ec2.Vpc(stack, 'SomeVpc2', {});
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        destinationKeyPrefix: '/a/b/c',
        vpc,
        memoryLimit: 256,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        Tags: [{
                Key: 'aws-cdk:cr-owned:/a/b/c:971e1fa8',
                Value: 'true',
            }],
    });
});
test('throws if destinationKeyPrefix is too long', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    expect(() => new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        destinationKeyPrefix: '/this/is/a/random/key/prefix/that/is/a/lot/of/characters/do/we/think/that/it/will/ever/be/this/long??????',
        memoryLimit: 256,
    })).toThrow(/The BucketDeployment construct requires that/);
});
test('skips destinationKeyPrefix validation if token', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    // WHEN
    // trick the cdk into creating a very long token
    const prefixToken = cdk.Token.asString(5, { displayHint: 'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong' });
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        destinationKeyPrefix: prefixToken,
        memoryLimit: 256,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        DestinationBucketKeyPrefix: 5,
    });
});
test('bucket has multiple deployments', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const vpc = new ec2.Vpc(stack, 'SomeVpc2', {});
    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        destinationKeyPrefix: '/a/b/c',
        vpc,
        memoryLimit: 256,
    });
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc2Exclude', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'), {
                exclude: ['index.html'],
            })],
        destinationBucket: bucket,
        destinationKeyPrefix: '/a/b/c',
        vpc,
        memoryLimit: 256,
    });
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc3', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
        destinationKeyPrefix: '/x/z',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        Tags: [
            {
                Key: 'aws-cdk:cr-owned:/a/b/c:6da0a4ab',
                Value: 'true',
            },
            {
                Key: 'aws-cdk:cr-owned:/a/b/c:971e1fa8',
                Value: 'true',
            },
            {
                Key: 'aws-cdk:cr-owned:/x/z:2db04622',
                Value: 'true',
            },
        ],
    });
});
test('"SourceMarkers" is not included if none of the sources have markers', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc3', {
        sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
        destinationBucket: bucket,
    });
    const map = assertions_1.Template.fromStack(stack).findResources('Custom::CDKBucketDeployment');
    expect(map).toBeDefined();
    const resource = map[Object.keys(map)[0]];
    expect(Object.keys(resource.Properties)).toStrictEqual([
        'ServiceToken',
        'SourceBucketNames',
        'SourceObjectKeys',
        'DestinationBucketName',
        'Prune',
    ]);
});
test('Source.data() can be used to create a file with string contents', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const source = s3deploy.Source.data('my/path.txt', 'hello, world');
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc3', {
        sources: [source],
        destinationBucket: bucket,
        destinationKeyPrefix: '/x/z',
    });
    const result = app.synth();
    const content = readDataFile(result, 'my/path.txt');
    expect(content).toStrictEqual('hello, world');
});
test('Source.jsonData() can be used to create a file with a JSON object', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const config = {
        foo: 'bar',
        sub: {
            hello: bucket.bucketArn,
        },
    };
    new s3deploy.BucketDeployment(stack, 'DeployWithVpc3', {
        sources: [s3deploy.Source.jsonData('app-config.json', config)],
        destinationBucket: bucket,
    });
    const result = app.synth();
    const obj = JSON.parse(readDataFile(result, 'app-config.json'));
    expect(obj).toStrictEqual({
        foo: 'bar',
        sub: {
            hello: '<<marker:0xbaba:0>>',
        },
    });
    // verify marker is mapped to the bucket ARN in the resource props
    assertions_1.Template.fromJSON(result.stacks[0].template).hasResourceProperties('Custom::CDKBucketDeployment', {
        SourceMarkers: [
            { '<<marker:0xbaba:0>>': { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] } },
        ],
    });
});
test('can add sources with addSource', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const deployment = new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.data('my/path.txt', 'helloWorld')],
        destinationBucket: bucket,
    });
    deployment.addSource(s3deploy.Source.data('my/other/path.txt', 'hello world'));
    const result = app.synth();
    const content = readDataFile(result, 'my/path.txt');
    const content2 = readDataFile(result, 'my/other/path.txt');
    expect(content).toStrictEqual('helloWorld');
    expect(content2).toStrictEqual('hello world');
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        SourceMarkers: [
            {},
            {},
        ],
    });
});
test('if any source has markers then all sources have markers', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    const bucket = new s3.Bucket(stack, 'Bucket');
    const deployment = new s3deploy.BucketDeployment(stack, 'Deploy', {
        sources: [s3deploy.Source.data('my/path.txt', 'helloWorld')],
        destinationBucket: bucket,
    });
    deployment.addSource(s3deploy.Source.asset(path.join(__dirname, 'my-website')));
    const result = app.synth();
    const content = readDataFile(result, 'my/path.txt');
    expect(content).toStrictEqual('helloWorld');
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
        SourceMarkers: [
            {},
            {},
        ],
    });
});
function readDataFile(casm, relativePath) {
    const assetDirs = fs_1.readdirSync(casm.directory).filter(f => f.startsWith('asset.'));
    for (const dir of assetDirs) {
        const candidate = path.join(casm.directory, dir, relativePath);
        if (fs_1.existsSync(candidate)) {
            return fs_1.readFileSync(candidate, 'utf8');
        }
    }
    throw new Error(`File ${relativePath} not found in any of the assets of the assembly`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LWRlcGxveW1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1Y2tldC1kZXBsb3ltZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMkQ7QUFDM0QsNkJBQTZCO0FBQzdCLG9EQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFFbkMsNEJBQTRCO0FBRTVCLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7SUFDN0MsUUFBUTtJQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTVDLE9BQU87SUFDUCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzdDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDcEUsaUJBQWlCLEVBQUUsTUFBTTtLQUMxQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7UUFDN0UsWUFB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cm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbnRlc3QoJ2RlcGxveSBmcm9tIGxvY2FsIGRpcmVjdG9yeSBhc3NldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnQ3VzdG9tQ0RLQnVja2V0RGVwbG95bWVudDg2OTNCQjY0OTY4OTQ0QjY5QUFGQjBDQzlFQjg3NTZDODFDMDE1MzYnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBTb3VyY2VCdWNrZXROYW1lczogW3tcbiAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2ZjNDQ4MWFiZjI3OTI1NTYxOWZmNzQxOGZhYTVkMjQ0NTZmZWYzNDMyZWEwZGE1OWM5NTU0MjU3OGZmMDIyMmVTM0J1Y2tldDlDRDhCMjBBJyxcbiAgICB9XSxcbiAgICBTb3VyY2VPYmplY3RLZXlzOiBbe1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2ZjNDQ4MWFiZjI3OTI1NTYxOWZmNzQxOGZhYTVkMjQ0NTZmZWYzNDMyZWEwZGE1OWM5NTU0MjU3OGZmMDIyMmVTM1ZlcnNpb25LZXlBNThEMzgwQycsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzZmM0NDgxYWJmMjc5MjU1NjE5ZmY3NDE4ZmFhNWQyNDQ1NmZlZjM0MzJlYTBkYTU5Yzk1NTQyNTc4ZmYwMjIyZVMzVmVyc2lvbktleUE1OEQzODBDJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfV0sXG4gICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB7XG4gICAgICBSZWY6ICdEZXN0QzM4M0I4MkEnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RlcGxveSB3aXRoIGNvbmZpZ3VyZWQgbG9nIHJldGVudGlvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGxvZ1JldGVudGlvbjogbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9XRUVLLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHsgUmV0ZW50aW9uSW5EYXlzOiA3IH0pO1xufSk7XG5cbnRlc3QoJ2RlcGxveSBmcm9tIGxvY2FsIGRpcmVjdG9yeSBhc3NldHMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbXG4gICAgICBzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSksXG4gICAgICBzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUtc2Vjb25kJykpLFxuICAgIF0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdDdXN0b21DREtCdWNrZXREZXBsb3ltZW50ODY5M0JCNjQ5Njg5NDRCNjlBQUZCMENDOUVCODc1NkM4MUMwMTUzNicsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICAgIFNvdXJjZUJ1Y2tldE5hbWVzOiBbXG4gICAgICB7XG4gICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2ZjNDQ4MWFiZjI3OTI1NTYxOWZmNzQxOGZhYTVkMjQ0NTZmZWYzNDMyZWEwZGE1OWM5NTU0MjU3OGZmMDIyMmVTM0J1Y2tldDlDRDhCMjBBJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2E5NDk3N2VkZTAyMTFmZDNiNDVlZmEzM2Q2ZDhkMWQ3YmJlMGM1YTk2ZDk3NzEzOWQ4YjE2YWJmYTk2ZmU5Y2JTM0J1Y2tldDk5NzkzNTU5JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBTb3VyY2VPYmplY3RLZXlzOiBbXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2ZjNDQ4MWFiZjI3OTI1NTYxOWZmNzQxOGZhYTVkMjQ0NTZmZWYzNDMyZWEwZGE1OWM5NTU0MjU3OGZmMDIyMmVTM1ZlcnNpb25LZXlBNThEMzgwQycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnNmYzQ0ODFhYmYyNzkyNTU2MTlmZjc0MThmYWE1ZDI0NDU2ZmVmMzQzMmVhMGRhNTljOTU1NDI1NzhmZjAyMjJlUzNWZXJzaW9uS2V5QTU4RDM4MEMnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzYTk0OTc3ZWRlMDIxMWZkM2I0NWVmYTMzZDZkOGQxZDdiYmUwYzVhOTZkOTc3MTM5ZDhiMTZhYmZhOTZmZTljYlMzVmVyc2lvbktleUQ5QUNFNjY1JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2E5NDk3N2VkZTAyMTFmZDNiNDVlZmEzM2Q2ZDhkMWQ3YmJlMGM1YTk2ZDk3NzEzOWQ4YjE2YWJmYTk2ZmU5Y2JTM1ZlcnNpb25LZXlEOUFDRTY2NScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB7XG4gICAgICBSZWY6ICdEZXN0QzM4M0I4MkEnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIGxvY2FsIGFzc2V0IGlzIGEgbm9uLXppcCBmaWxlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJywgJ2luZGV4Lmh0bWwnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pKS50b1Rocm93KC9Bc3NldCBwYXRoIG11c3QgYmUgZWl0aGVyIGEgXFwuemlwIGZpbGUgb3IgYSBkaXJlY3RvcnkvKTtcbn0pO1xuXG50ZXN0KCdkZXBsb3kgZnJvbSBhIGxvY2FsIC56aXAgZmlsZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlLnppcCcpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgfSk7XG5cbn0pO1xuXG50ZXN0KCdkZXBsb3kgZnJvbSBhIGxvY2FsIC56aXAgZmlsZSB3aGVuIGVmcyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUuemlwJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIHVzZUVmczogdHJ1ZSxcbiAgICB2cGM6IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyksXG4gIH0pO1xuXG4gIC8vVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIEVudmlyb25tZW50OiB7XG4gICAgICBWYXJpYWJsZXM6IHtcbiAgICAgICAgTU9VTlRfUEFUSDogJy9tbnQvbGFtYmRhJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBGaWxlU3lzdGVtQ29uZmlnczogW1xuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmVsYXN0aWNmaWxlc3lzdGVtOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzphY2Nlc3MtcG9pbnQvJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0J1Y2tldERlcGxveW1lbnRFRlNWUENjOGZkOTQwYWNiOWEzZjk1YWQwZTg3ZmI0YzNhMjQ4MmIxOTAwYmExNzVBY2Nlc3NQb2ludDU1N0E3M0E1JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgTG9jYWxNb3VudFBhdGg6ICcvbW50L2xhbWJkYScsXG4gICAgICB9LFxuICAgIF0sXG4gICAgTGF5ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIFJlZjogJ0RlcGxveUF3c0NsaUxheWVyODQ0NUNCMzgnLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFZwY0NvbmZpZzoge1xuICAgICAgU2VjdXJpdHlHcm91cElkczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQ3VzdG9tQ0RLQnVja2V0RGVwbG95bWVudDg2OTNCQjY0OTY4OTQ0QjY5QUFGQjBDQzlFQjg3NTZDYzhmZDk0MGFjYjlhM2Y5NWFkMGU4N2ZiNGMzYTI0ODJiMTkwMGJhMTc1U2VjdXJpdHlHcm91cDNFN0FBRjU4JyxcbiAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdWcGNQcml2YXRlU3VibmV0MlN1Ym5ldDM3ODhBQUExJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2hvbm9ycyBwYXNzZWQgYXNzZXQgb3B0aW9ucycsICgpID0+IHtcbiAgLy8gVGhlICdleGNsdWRlJyBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIGFuZCBub3QgZGVwcmVjYXRlZCBpbiBBc3NldE9wdGlvbnMgaW50ZXJmYWNlLlxuICAvLyBUaGUgaW50ZXJmYWNlIHRocm91Z2ggYSBjb21wbGV4IHNldCBvZiBpbmhlcml0YW5jZSBjaGFpbiBoYXMgYSAnZXhjbHVkZScgcHJvcCB0aGF0IGlzIGRlcHJlY2F0ZWRcbiAgLy8gYW5kIGFub3RoZXIgJ2V4Y2x1ZGUnIHByb3AgdGhhdCBpcyBub3QgZGVwcmVjYXRlZC5cbiAgLy8gVXNpbmcgJ3Rlc3REZXByZWNhdGVkJyBibG9jayBoZXJlIHNpbmNlIHRoZXJlJ3Mgbm8gd2F5IHRvIHdvcmsgYXJvdW5kIHRoaXMgY3JhemluZXNzLlxuICAvLyBXaGVuIHRoZSBkZXByZWNhdGVkIHByb3BlcnR5IGlzIHJlbW92ZWQgZnJvbSBzb3VyY2UsIHRoaXMgYmxvY2sgY2FuIGJlIGRyb3BwZWQuXG5cbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSwge1xuICAgICAgZXhjbHVkZTogWycqJywgJyFpbmRleC5odG1sJ10sXG4gICAgfSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnQ3VzdG9tQ0RLQnVja2V0RGVwbG95bWVudDg2OTNCQjY0OTY4OTQ0QjY5QUFGQjBDQzlFQjg3NTZDODFDMDE1MzYnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBTb3VyY2VCdWNrZXROYW1lczogW3tcbiAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2E0ZDBmMWQ5YzczYWEwMjlmZDQzMmNhM2U2NDBkNDY3NDVmNDkwMDIzYTI0MWQwMTI3ZjMzNTE3NzNhODkzOGVTM0J1Y2tldDAyMDA5OTgyJyxcbiAgICB9XSxcbiAgICBTb3VyY2VPYmplY3RLZXlzOiBbe1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyc2E0ZDBmMWQ5YzczYWEwMjlmZDQzMmNhM2U2NDBkNDY3NDVmNDkwMDIzYTI0MWQwMTI3ZjMzNTE3NzNhODkzOGVTM1ZlcnNpb25LZXkwNzcyNkYyNScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzYTRkMGYxZDljNzNhYTAyOWZkNDMyY2EzZTY0MGQ0Njc0NWY0OTAwMjNhMjQxZDAxMjdmMzM1MTc3M2E4OTM4ZVMzVmVyc2lvbktleTA3NzI2RjI1JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfV0sXG4gICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB7XG4gICAgICBSZWY6ICdEZXN0QzM4M0I4MkEnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3JldGFpbk9uRGVsZXRlIGNhbiBiZSB1c2VkIHRvIHJldGFpbiBmaWxlcyB3aGVuIHJlc291cmNlIGlzIGRlbGV0ZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgcmV0YWluT25EZWxldGU6IHRydWUsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBSZXRhaW5PbkRlbGV0ZTogdHJ1ZSxcbiAgfSk7XG59KTtcblxudGVzdCgndXNlciBtZXRhZGF0YSBpcyBjb3JyZWN0bHkgdHJhbnNmb3JtZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgbWV0YWRhdGE6IHtcbiAgICAgIEE6ICcxJyxcbiAgICAgIEI6ICcyJyxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLCB7XG4gICAgVXNlck1ldGFkYXRhOiB7IGE6ICcxJywgYjogJzInIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3N5c3RlbSBtZXRhZGF0YSBpcyBjb3JyZWN0bHkgdHJhbnNmb3JtZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuICBjb25zdCBleHBpcmF0aW9uID0gY2RrLkV4cGlyYXRpb24uYWZ0ZXIoY2RrLkR1cmF0aW9uLmhvdXJzKDEyKSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlLnppcCcpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBjb250ZW50VHlwZTogJ3RleHQvaHRtbCcsXG4gICAgY29udGVudExhbmd1YWdlOiAnZW4nLFxuICAgIHN0b3JhZ2VDbGFzczogczNkZXBsb3kuU3RvcmFnZUNsYXNzLklOVEVMTElHRU5UX1RJRVJJTkcsXG4gICAgY29udGVudERpc3Bvc2l0aW9uOiAnaW5saW5lJyxcbiAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbjogczNkZXBsb3kuU2VydmVyU2lkZUVuY3J5cHRpb24uQVdTX0tNUyxcbiAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkF3c0ttc0tleUlkOiAnbXlrZXknLFxuICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQ3VzdG9tZXJBbGdvcml0aG06ICdyb3QxMycsXG4gICAgd2Vic2l0ZVJlZGlyZWN0TG9jYXRpb246ICdleGFtcGxlJyxcbiAgICBjYWNoZUNvbnRyb2w6IFtzM2RlcGxveS5DYWNoZUNvbnRyb2wuc2V0UHVibGljKCksIHMzZGVwbG95LkNhY2hlQ29udHJvbC5tYXhBZ2UoY2RrLkR1cmF0aW9uLmhvdXJzKDEpKV0sXG4gICAgZXhwaXJlczogZXhwaXJhdGlvbixcbiAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkJVQ0tFVF9PV05FUl9GVUxMX0NPTlRST0wsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBTeXN0ZW1NZXRhZGF0YToge1xuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICd0ZXh0L2h0bWwnLFxuICAgICAgJ2NvbnRlbnQtbGFuZ3VhZ2UnOiAnZW4nLFxuICAgICAgJ2NvbnRlbnQtZGlzcG9zaXRpb24nOiAnaW5saW5lJyxcbiAgICAgICdzdG9yYWdlLWNsYXNzJzogJ0lOVEVMTElHRU5UX1RJRVJJTkcnLFxuICAgICAgJ3NzZSc6ICdhd3M6a21zJyxcbiAgICAgICdzc2Uta21zLWtleS1pZCc6ICdteWtleScsXG4gICAgICAnY2FjaGUtY29udHJvbCc6ICdwdWJsaWMsIG1heC1hZ2U9MzYwMCcsXG4gICAgICAnZXhwaXJlcyc6IGV4cGlyYXRpb24uZGF0ZS50b1VUQ1N0cmluZygpLFxuICAgICAgJ3NzZS1jLWNvcHktc291cmNlJzogJ3JvdDEzJyxcbiAgICAgICd3ZWJzaXRlLXJlZGlyZWN0JzogJ2V4YW1wbGUnLFxuICAgICAgJ2FjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG4vLyB0eXBlIGNoZWNraW5nIHN0cnVjdHVyZSB0aGF0IGZvcmNlcyB0byB1cGRhdGUgaXQgaWYgQnVja2V0QWNjZXNzQ29udHJvbCBjaGFuZ2VzXG4vLyBzZWUgYC0tYWNsYCBoZXJlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xpL2xhdGVzdC9yZWZlcmVuY2UvczMvc3luYy5odG1sXG5jb25zdCBhY2Nlc3NDb250cm9sTWFwOiBSZWNvcmQ8czMuQnVja2V0QWNjZXNzQ29udHJvbCwgc3RyaW5nPiA9IHtcbiAgW3MzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuUFJJVkFURV06ICdwcml2YXRlJyxcbiAgW3MzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuUFVCTElDX1JFQURdOiAncHVibGljLXJlYWQnLFxuICBbczMuQnVja2V0QWNjZXNzQ29udHJvbC5QVUJMSUNfUkVBRF9XUklURV06ICdwdWJsaWMtcmVhZC13cml0ZScsXG4gIFtzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkFVVEhFTlRJQ0FURURfUkVBRF06ICdhdXRoZW50aWNhdGVkLXJlYWQnLFxuICBbczMuQnVja2V0QWNjZXNzQ29udHJvbC5BV1NfRVhFQ19SRUFEXTogJ2F3cy1leGVjLXJlYWQnLFxuICBbczMuQnVja2V0QWNjZXNzQ29udHJvbC5CVUNLRVRfT1dORVJfUkVBRF06ICdidWNrZXQtb3duZXItcmVhZCcsXG4gIFtzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkJVQ0tFVF9PV05FUl9GVUxMX0NPTlRST0xdOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcsXG4gIFtzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkxPR19ERUxJVkVSWV9XUklURV06ICdsb2ctZGVsaXZlcnktd3JpdGUnLFxufTtcblxudGVzdC5lYWNoKE9iamVjdC5lbnRyaWVzKGFjY2Vzc0NvbnRyb2xNYXApIGFzIFtzMy5CdWNrZXRBY2Nlc3NDb250cm9sLCBzdHJpbmddW10pKFxuICAnc3lzdGVtIG1ldGFkYXRhIGFjbCAlcyBpcyBjb3JyZWN0bHkgdHJhbnNmb3JtZWQnLFxuICAoYWNjZXNzQ29udHJvbCwgc3lzdGVtTWV0YWRhdGFLZXl3b3JkKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IGFjY2Vzc0NvbnRyb2wsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICAgIFN5c3RlbU1ldGFkYXRhOiB7XG4gICAgICAgIGFjbDogc3lzdGVtTWV0YWRhdGFLZXl3b3JkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSxcbik7XG5cbnRlc3QoJ2V4cGlyZXMgdHlwZSBoYXMgY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gIGV4cGVjdChjZGsuRXhwaXJhdGlvbi5hdERhdGUobmV3IERhdGUoJ1N1biwgMjYgSmFuIDIwMjAgMDA6NTM6MjAgR01UJykpLmRhdGUudG9VVENTdHJpbmcoKSkudG9FcXVhbCgnU3VuLCAyNiBKYW4gMjAyMCAwMDo1MzoyMCBHTVQnKTtcbiAgZXhwZWN0KGNkay5FeHBpcmF0aW9uLmF0VGltZXN0YW1wKDE1ODAwMDAwMDAwMDApLmRhdGUudG9VVENTdHJpbmcoKSkudG9FcXVhbCgnU3VuLCAyNiBKYW4gMjAyMCAwMDo1MzoyMCBHTVQnKTtcbiAgZXhwZWN0KE1hdGguYWJzKG5ldyBEYXRlKGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSkuZGF0ZS50b1VUQ1N0cmluZygpKS5nZXRUaW1lKCkgLSAoRGF0ZS5ub3coKSArIDYwMDAwMCkpIDwgMTUwMDApLnRvQmVUcnV0aHkoKTtcbiAgZXhwZWN0KGNkay5FeHBpcmF0aW9uLmZyb21TdHJpbmcoJ1R1ZSwgMDQgRmViIDIwMjAgMDg6NDU6MzMgR01UJykuZGF0ZS50b1VUQ1N0cmluZygpKS50b0VxdWFsKCdUdWUsIDA0IEZlYiAyMDIwIDA4OjQ1OjMzIEdNVCcpO1xufSk7XG5cbnRlc3QoJ2NhY2hlIGNvbnRyb2wgdHlwZSBoYXMgY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gIGV4cGVjdChzM2RlcGxveS5DYWNoZUNvbnRyb2wubXVzdFJldmFsaWRhdGUoKS52YWx1ZSkudG9FcXVhbCgnbXVzdC1yZXZhbGlkYXRlJyk7XG4gIGV4cGVjdChzM2RlcGxveS5DYWNoZUNvbnRyb2wubm9DYWNoZSgpLnZhbHVlKS50b0VxdWFsKCduby1jYWNoZScpO1xuICBleHBlY3QoczNkZXBsb3kuQ2FjaGVDb250cm9sLm5vVHJhbnNmb3JtKCkudmFsdWUpLnRvRXF1YWwoJ25vLXRyYW5zZm9ybScpO1xuICBleHBlY3QoczNkZXBsb3kuQ2FjaGVDb250cm9sLnNldFB1YmxpYygpLnZhbHVlKS50b0VxdWFsKCdwdWJsaWMnKTtcbiAgZXhwZWN0KHMzZGVwbG95LkNhY2hlQ29udHJvbC5zZXRQcml2YXRlKCkudmFsdWUpLnRvRXF1YWwoJ3ByaXZhdGUnKTtcbiAgZXhwZWN0KHMzZGVwbG95LkNhY2hlQ29udHJvbC5wcm94eVJldmFsaWRhdGUoKS52YWx1ZSkudG9FcXVhbCgncHJveHktcmV2YWxpZGF0ZScpO1xuICBleHBlY3QoczNkZXBsb3kuQ2FjaGVDb250cm9sLm1heEFnZShjZGsuRHVyYXRpb24ubWludXRlcygxKSkudmFsdWUpLnRvRXF1YWwoJ21heC1hZ2U9NjAnKTtcbiAgZXhwZWN0KHMzZGVwbG95LkNhY2hlQ29udHJvbC5zTWF4QWdlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKS52YWx1ZSkudG9FcXVhbCgncy1tYXhhZ2U9NjAnKTtcbiAgZXhwZWN0KHMzZGVwbG95LkNhY2hlQ29udHJvbC5mcm9tU3RyaW5nKCdvbmx5LWlmLWNhY2hlZCcpLnZhbHVlKS50b0VxdWFsKCdvbmx5LWlmLWNhY2hlZCcpO1xufSk7XG5cbnRlc3QoJ3N0b3JhZ2UgY2xhc3MgdHlwZSBoYXMgY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gIGV4cGVjdChzM2RlcGxveS5TdG9yYWdlQ2xhc3MuU1RBTkRBUkQpLnRvRXF1YWwoJ1NUQU5EQVJEJyk7XG4gIGV4cGVjdChzM2RlcGxveS5TdG9yYWdlQ2xhc3MuUkVEVUNFRF9SRURVTkRBTkNZKS50b0VxdWFsKCdSRURVQ0VEX1JFRFVOREFOQ1knKTtcbiAgZXhwZWN0KHMzZGVwbG95LlN0b3JhZ2VDbGFzcy5TVEFOREFSRF9JQSkudG9FcXVhbCgnU1RBTkRBUkRfSUEnKTtcbiAgZXhwZWN0KHMzZGVwbG95LlN0b3JhZ2VDbGFzcy5PTkVaT05FX0lBKS50b0VxdWFsKCdPTkVaT05FX0lBJyk7XG4gIGV4cGVjdChzM2RlcGxveS5TdG9yYWdlQ2xhc3MuSU5URUxMSUdFTlRfVElFUklORykudG9FcXVhbCgnSU5URUxMSUdFTlRfVElFUklORycpO1xuICBleHBlY3QoczNkZXBsb3kuU3RvcmFnZUNsYXNzLkdMQUNJRVIpLnRvRXF1YWwoJ0dMQUNJRVInKTtcbiAgZXhwZWN0KHMzZGVwbG95LlN0b3JhZ2VDbGFzcy5ERUVQX0FSQ0hJVkUpLnRvRXF1YWwoJ0RFRVBfQVJDSElWRScpO1xufSk7XG5cbnRlc3QoJ3NlcnZlciBzaWRlIGVuY3J5cHRpb24gdHlwZSBoYXMgY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gIGV4cGVjdChzM2RlcGxveS5TZXJ2ZXJTaWRlRW5jcnlwdGlvbi5BRVNfMjU2KS50b0VxdWFsKCdBRVMyNTYnKTtcbiAgZXhwZWN0KHMzZGVwbG95LlNlcnZlclNpZGVFbmNyeXB0aW9uLkFXU19LTVMpLnRvRXF1YWwoJ2F3czprbXMnKTtcbn0pO1xuXG50ZXN0KCdkaXN0cmlidXRpb24gY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIGZvciBpbnZhbGlkYXRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnRGlzdHJpYnV0aW9uJywge1xuICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgIHtcbiAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogYnVja2V0LFxuICAgICAgICB9LFxuICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUuemlwJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGRpc3RyaWJ1dGlvbixcbiAgICBkaXN0cmlidXRpb25QYXRoczogWycvaW1hZ2VzLyonXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBEaXN0cmlidXRpb25JZDoge1xuICAgICAgUmVmOiAnRGlzdHJpYnV0aW9uQ0ZEaXN0cmlidXRpb244ODJBNzMxMycsXG4gICAgfSxcbiAgICBEaXN0cmlidXRpb25QYXRoczogWycvaW1hZ2VzLyonXSxcbiAgfSk7XG59KTtcblxudGVzdCgnaW52YWxpZGF0aW9uIGNhbiBoYXBwZW4gd2l0aG91dCBkaXN0cmlidXRpb25QYXRocyBwcm92aWRlZCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG4gIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdEaXN0cmlidXRpb24nLCB7XG4gICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAge1xuICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgIHMzQnVja2V0U291cmNlOiBidWNrZXQsXG4gICAgICAgIH0sXG4gICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGlzdHJpYnV0aW9uLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIERpc3RyaWJ1dGlvbklkOiB7XG4gICAgICBSZWY6ICdEaXN0cmlidXRpb25DRkRpc3RyaWJ1dGlvbjg4MkE3MzEzJyxcbiAgICB9LFxuICB9KTtcblxufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIGRpc3RyaWJ1dGlvbiBwYXRocyBwcm92aWRlZCBidXQgbm90IGRpc3RyaWJ1dGlvbiBJRCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScsICdpbmRleC5odG1sJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJy9pbWFnZXMvKiddLFxuICB9KSkudG9UaHJvdygvRGlzdHJpYnV0aW9uIG11c3QgYmUgc3BlY2lmaWVkIGlmIGRpc3RyaWJ1dGlvbiBwYXRocyBhcmUgc3BlY2lmaWVkLyk7XG5cbn0pO1xuXG50ZXN0KCdmYWlscyBpZiBkaXN0cmlidXRpb24gcGF0aHMgZG9uXFwndCBzdGFydCB3aXRoIFwiL1wiJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcbiAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICB7XG4gICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgczNCdWNrZXRTb3VyY2U6IGJ1Y2tldCxcbiAgICAgICAgfSxcbiAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGlzdHJpYnV0aW9uLFxuICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJ2ltYWdlcy8qJ10sXG4gIH0pKS50b1Rocm93KC9EaXN0cmlidXRpb24gcGF0aHMgbXVzdCBzdGFydCB3aXRoIFwiXFwvXCIvKTtcbn0pO1xuXG50ZXN0KCdsYW1iZGEgZXhlY3V0aW9uIHJvbGUgZ2V0cyBwZXJtaXNzaW9ucyB0byByZWFkIGZyb20gdGhlIHNvdXJjZSBidWNrZXQgYW5kIHJlYWQvd3JpdGUgaW4gZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBzb3VyY2UgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnU291cmNlJyk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmJ1Y2tldChzb3VyY2UsICdmaWxlLnppcCcpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnU291cmNlNzFFNDcxRjEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ1NvdXJjZTcxRTQ3MUYxJyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0Rlc3RDMzgzQjgyQScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnRGVzdEMzODNCODJBJyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUG9saWN5TmFtZTogJ0N1c3RvbUNES0J1Y2tldERlcGxveW1lbnQ4NjkzQkI2NDk2ODk0NEI2OUFBRkIwQ0M5RUI4NzU2Q1NlcnZpY2VSb2xlRGVmYXVsdFBvbGljeTg4OTAyRkRGJyxcbiAgICBSb2xlczogW1xuICAgICAge1xuICAgICAgICBSZWY6ICdDdXN0b21DREtCdWNrZXREZXBsb3ltZW50ODY5M0JCNjQ5Njg5NDRCNjlBQUZCMENDOUVCODc1NkNTZXJ2aWNlUm9sZTg5QTAxMjY1JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnbGFtYmRhIGV4ZWN1dGlvbiByb2xlIGdldHMgcHV0T2JqZWN0QWNsIHBlcm1pc3Npb24gd2hlbiBkZXBsb3lpbmcgd2l0aCBhY2Nlc3NDb250cm9sJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qgc291cmNlID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1NvdXJjZScpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5idWNrZXQoc291cmNlLCAnZmlsZS56aXAnKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLlBVQkxJQ19SRUFELFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IG1hcCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpJQU06OlBvbGljeScpO1xuICBleHBlY3QobWFwKS50b0JlRGVmaW5lZCgpO1xuICBjb25zdCByZXNvdXJjZSA9IG1hcFtPYmplY3Qua2V5cyhtYXApWzBdXTtcbiAgZXhwZWN0KHJlc291cmNlLlByb3BlcnRpZXMuUG9saWN5RG9jdW1lbnQuU3RhdGVtZW50KS50b0NvbnRhaW5FcXVhbCh7XG4gICAgQWN0aW9uOiBbXG4gICAgICAnczM6UHV0T2JqZWN0QWNsJyxcbiAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uQWNsJyxcbiAgICBdLFxuICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICBSZXNvdXJjZToge1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRGVzdEMzODNCODJBJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJy8qJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnbWVtb3J5TGltaXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgbWVtb3J5IGxpbWl0IGZvciB0aGUgZGVwbG95bWVudCByZXNvdXJjZSBoYW5kbGVyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIC8vIHdlIGRlZmluZSAzIGRlcGxveW1lbnRzIHdpdGggMiBkaWZmZXJlbnQgbWVtb3J5IGNvbmZpZ3VyYXRpb25zXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95MjU2LTEnLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBtZW1vcnlMaW1pdDogMjU2LFxuICB9KTtcblxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveTI1Ni0yJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgbWVtb3J5TGltaXQ6IDI1NixcbiAgfSk7XG5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3kxMDI0Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgbWVtb3J5TGltaXQ6IDEwMjQsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgLy8gd2UgZXhwZWN0IHRvIGZpbmQgb25seSB0d28gaGFuZGxlcnMsIG9uZSBmb3IgZWFjaCBjb25maWd1cmF0aW9uXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCAyKTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHsgTWVtb3J5U2l6ZTogMjU2IH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywgeyBNZW1vcnlTaXplOiAxMDI0IH0pO1xufSk7XG5cbnRlc3QoJ2VwaGVtZXJhbFN0b3JhZ2VTaXplIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIHN0b3JhZ2Ugc2l6ZSBmb3IgdGhlIGRlcGxveW1lbnQgcmVzb3VyY2UgaGFuZGxlcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICAvLyB3ZSBkZWZpbmUgMyBkZXBsb3ltZW50cyB3aXRoIDIgZGlmZmVyZW50IG1lbW9yeSBjb25maWd1cmF0aW9uc1xuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveTI1Ni0xJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IGNkay5TaXplLm1lYmlieXRlcyg1MTIpLFxuICB9KTtcblxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveTI1Ni0yJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IGNkay5TaXplLm1lYmlieXRlcyg1MTIpLFxuICB9KTtcblxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveTEwMjQnLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBlcGhlbWVyYWxTdG9yYWdlU2l6ZTogY2RrLlNpemUubWViaWJ5dGVzKDEwMjQpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIC8vIHdlIGV4cGVjdCB0byBmaW5kIG9ubHkgdHdvIGhhbmRsZXJzLCBvbmUgZm9yIGVhY2ggY29uZmlndXJhdGlvblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywgMik7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgRXBoZW1lcmFsU3RvcmFnZToge1xuICAgICAgU2l6ZTogNTEyLFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIEVwaGVtZXJhbFN0b3JhZ2U6IHtcbiAgICAgIFNpemU6IDEwMjQsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95bWVudCBhbGxvd3MgY3VzdG9tIHJvbGUgdG8gYmUgc3VwcGxpZWQnLCAoKSA9PiB7XG5cbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG4gIGNvbnN0IGV4aXN0aW5nUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b24uY29tJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3lXaXRoUm9sZScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIHJvbGU6IGV4aXN0aW5nUm9sZSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAxKTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIDEpO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFJvbGU6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RlcGxveSB3aXRob3V0IGRlbGV0aW5nIG1pc3NpbmcgZmlsZXMgZnJvbSBkZXN0aW5hdGlvbicsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgcHJ1bmU6IGZhbHNlLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIFBydW5lOiBmYWxzZSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95IHdpdGggZXhjbHVkZWQgZmlsZXMgZnJvbSBkZXN0aW5hdGlvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGV4Y2x1ZGU6IFsnc2FtcGxlLmpzJ10sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLCB7XG4gICAgRXhjbHVkZTogWydzYW1wbGUuanMnXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95IHdpdGggaW5jbHVkZWQgZmlsZXMgZnJvbSBkZXN0aW5hdGlvbicsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgaW5jbHVkZTogWydzYW1wbGUuanMnXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBJbmNsdWRlOiBbJ3NhbXBsZS5qcyddLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdkZXBsb3kgd2l0aCBleGNsdWRlZCBhbmQgaW5jbHVkZWQgZmlsZXMgZnJvbSBkZXN0aW5hdGlvbicsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95Jywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZXhjbHVkZTogWydzYW1wbGUvKiddLFxuICAgIGluY2x1ZGU6IFsnc2FtcGxlL2luY2x1ZGUuanNvbiddLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIEV4Y2x1ZGU6IFsnc2FtcGxlLyonXSxcbiAgICBJbmNsdWRlOiBbJ3NhbXBsZS9pbmNsdWRlLmpzb24nXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95IHdpdGggbXVsdGlwbGUgZXhjbHVkZSBhbmQgaW5jbHVkZSBmaWx0ZXJzJywgKCkgPT4ge1xuXG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBleGNsdWRlOiBbJ3NhbXBsZS8qJywgJ2Fub3RoZXIvKiddLFxuICAgIGluY2x1ZGU6IFsnc2FtcGxlL2luY2x1ZGUuanNvbicsICdhbm90aGVyL2luY2x1ZGUuanNvbiddLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIEV4Y2x1ZGU6IFsnc2FtcGxlLyonLCAnYW5vdGhlci8qJ10sXG4gICAgSW5jbHVkZTogWydzYW1wbGUvaW5jbHVkZS5qc29uJywgJ2Fub3RoZXIvaW5jbHVkZS5qc29uJ10sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RlcGxveSB3aXRob3V0IGV4dHJhY3RpbmcgZmlsZXMgaW4gZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS56aXAnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZXh0cmFjdDogZmFsc2UsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBFeHRyYWN0OiBmYWxzZSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95IHdpdGhvdXQgZXh0cmFjdGluZyBmaWxlcyBpbiBkZXN0aW5hdGlvbiBhbmQgZ2V0IHRoZSBvYmplY3Qga2V5JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlLnppcCcpKV0sXG4gICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgICBleHRyYWN0OiBmYWxzZSxcbiAgfSk7XG5cbiAgLy8gVGVzdHMgb2JqZWN0IGtleSByZXRyaWV2YWwuXG4gIHZvaWQoY2RrLkZuLnNlbGVjdCgwLCBkZXBsb3ltZW50Lm9iamVjdEtleXMpKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLCB7XG4gICAgRXh0cmFjdDogZmFsc2UsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dpdmVuIGEgc291cmNlIHdpdGggbWFya2VycyBhbmQgZXh0cmFjdCBpcyBmYWxzZSwgQnVja2V0RGVwbG95bWVudCB0aHJvd3MgYW4gZXJyb3InLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuICBjb25zdCB0b3BpYzogc25zLlRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ1NvbWVUb3BpYzEnLCB7fSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBmaWxlID0gczNkZXBsb3kuU291cmNlLmpzb25EYXRhKCdNeUpzb25PYmplY3QnLCB7XG4gICAgJ2NvbmZpZy5qc29uJzoge1xuICAgICAgRm9vOiB7XG4gICAgICAgIEJhcjogdG9waWMudG9waWNBcm4sIC8vIG1hcmtlclxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW2ZpbGVdLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZXh0cmFjdDogZmFsc2UsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB9KS50b1Rocm93KCdTb21lIHNvdXJjZXMgYXJlIGluY29tcGF0aWJsZSB3aXRoIGV4dHJhY3Q9ZmFsc2U7IHNvdXJjZXMgd2l0aCBkZXBsb3ktdGltZSB2YWx1ZXMgKHN1Y2ggYXMgXFwnc25zVG9waWMudG9waWNBcm5cXCcpIG11c3QgYmUgZXh0cmFjdGVkLicpO1xufSk7XG5cbnRlc3QoJ2RlcGxveW1lbnQgYWxsb3dzIHZwYyB0byBiZSBpbXBsaWNpdGx5IHN1cHBsaWVkIHRvIGxhbWJkYScsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcbiAgY29uc3QgdnBjOiBlYzIuSVZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU29tZVZwYzEnLCB7fSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMxJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgdnBjLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgVnBjQ29uZmlnOiB7XG4gICAgICBTZWN1cml0eUdyb3VwSWRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdDdXN0b21DREtCdWNrZXREZXBsb3ltZW50ODY5M0JCNjQ5Njg5NDRCNjlBQUZCMENDOUVCODc1NkNjODFjZWM5OTBhOWE1ZDY0YTU5MjJlNTcwOGFkODA2N2VlYjk1YzUzZDFTZWN1cml0eUdyb3VwODgxQjkxNDcnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdTb21lVnBjMVByaXZhdGVTdWJuZXQxU3VibmV0Q0JBNURENzYnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnU29tZVZwYzFQcml2YXRlU3VibmV0MlN1Ym5ldEQ0QjNBNTY2JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95bWVudCBhbGxvd3MgdnBjIGFuZCBzdWJuZXRzIHRvIGJlIGltcGxpY2l0bHkgc3VwcGxpZWQgdG8gbGFtYmRhJywgKCkgPT4ge1xuXG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuICBjb25zdCB2cGM6IGVjMi5JVnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdTb21lVnBjMicsIHt9KTtcbiAgbmV3IGVjMi5Qcml2YXRlU3VibmV0KHN0YWNrLCAnU29tZVN1Ym5ldCcsIHtcbiAgICB2cGNJZDogdnBjLnZwY0lkLFxuICAgIGF2YWlsYWJpbGl0eVpvbmU6IHZwYy5hdmFpbGFiaWxpdHlab25lc1swXSxcbiAgICBjaWRyQmxvY2s6IHZwYy52cGNDaWRyQmxvY2ssXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3lXaXRoVnBjMicsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIHZwYyxcbiAgICB2cGNTdWJuZXRzOiB7XG4gICAgICBhdmFpbGFiaWxpdHlab25lczogW3ZwYy5hdmFpbGFiaWxpdHlab25lc1swXV0sXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFZwY0NvbmZpZzoge1xuICAgICAgU2VjdXJpdHlHcm91cElkczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQ3VzdG9tQ0RLQnVja2V0RGVwbG95bWVudDg2OTNCQjY0OTY4OTQ0QjY5QUFGQjBDQzlFQjg3NTZDYzhhMzk1OTZjYjg2NDE5MjlmY2Y2YTI4OGJjOWRiNWFiN2IwZjY1NmFkU2VjdXJpdHlHcm91cDExMjc0Nzc5JyxcbiAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFN1Ym5ldElkczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnU29tZVZwYzJQcml2YXRlU3VibmV0MVN1Ym5ldEIxREM3NkZGJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnczMgZGVwbG95bWVudCBidWNrZXQgaXMgaWRlbnRpY2FsIHRvIGRlc3RpbmF0aW9uIGJ1Y2tldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBiZCA9IG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHN0YWNrLCAnRGVwbG95bWVudCcsIHtcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICB9KTtcblxuICAvLyBDYWxsIHRoaXMgZnVuY3Rpb25cbiAgdm9pZChiZC5kZXBsb3llZEJ1Y2tldCk7XG5cbiAgLy8gVEhFTlxuICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIC8vIFNpbmNlIHRoaXMgdXRpbGl6ZXMgR2V0QXR0LCB3ZSBrbm93IENGTiB3aWxsIGRlcGxveSB0aGUgYnVja2V0IGZpcnN0XG4gICAgLy8gYmVmb3JlIGRlcGxveWluZyBvdGhlciByZXNvdXJjZXMgdGhhdCByZWx5IGNhbGwgdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldC5cbiAgICBEZXN0aW5hdGlvbkJ1Y2tldEFybjogeyAnRm46OkdldEF0dCc6IFsnRGVzdEMzODNCODJBJywgJ0FybiddIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3MzIGRlcGxveWVkIGJ1Y2tldCBpbiBhIGRpZmZlcmVudCByZWdpb24gaGFzIGNvcnJlY3Qgd2Vic2l0ZSB1cmwnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgIGVudjoge1xuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9LFxuICB9KTtcbiAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnRGVzdCcsIHtcbiAgICBidWNrZXROYW1lOiAnbXktYnVja2V0JyxcbiAgICAvLyBCdWNrZXQgaXMgaW4gYSBkaWZmZXJlbnQgcmVnaW9uIHRoYW4gc3RhY2tcbiAgICByZWdpb246ICdldS1jZW50cmFsLTEnLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGJkID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3ltZW50Jywge1xuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gIH0pO1xuICBjb25zdCB3ZWJzaXRlVXJsID0gc3RhY2sucmVzb2x2ZShiZC5kZXBsb3llZEJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKTtcblxuICAvLyBUSEVOXG4gIC8vIGV1LWNlbnRyYWwtMSB1c2VzIHdlYnNpdGUgZW5kcG9pbnQgZm9ybWF0IHdpdGggYSBgLmBcbiAgLy8gc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9nZW5lcmFsL2xhdGVzdC9nci9zMy5odG1sI3MzX3dlYnNpdGVfcmVnaW9uX2VuZHBvaW50c1xuICBleHBlY3QoSlNPTi5zdHJpbmdpZnkod2Vic2l0ZVVybCkpLnRvQ29udGFpbignLnMzLXdlYnNpdGUuZXUtY2VudHJhbC0xLicpO1xufSk7XG5cbnRlc3QoJ3VzaW5nIGRlcGxveW1lbnQgYnVja2V0IHJlZmVyZW5jZXMgdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldCBieSBtZWFucyBvZiB0aGUgQ3VzdG9tUmVzb3VyY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVzdCcpO1xuICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3ltZW50Jywge1xuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdEZXN0aW5hdGlvbkFybicsIHtcbiAgICB2YWx1ZTogZGVwbG95bWVudC5kZXBsb3llZEJ1Y2tldC5idWNrZXRBcm4sXG4gIH0pO1xuICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0Rlc3RpbmF0aW9uTmFtZScsIHtcbiAgICB2YWx1ZTogZGVwbG95bWVudC5kZXBsb3llZEJ1Y2tldC5idWNrZXROYW1lLFxuICB9KTtcblxuICAvLyBUSEVOXG5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICBleHBlY3QodGVtcGxhdGUuZmluZE91dHB1dHMoJyonKSkudG9FcXVhbCh7XG4gICAgRGVzdGluYXRpb25Bcm46IHtcbiAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydEZXBsb3ltZW50Q3VzdG9tUmVzb3VyY2U0N0U4QjJFNicsICdEZXN0aW5hdGlvbkJ1Y2tldEFybiddIH0sXG4gICAgfSxcbiAgICBEZXN0aW5hdGlvbk5hbWU6IHtcbiAgICAgIFZhbHVlOiB7XG4gICAgICAgICdGbjo6U2VsZWN0JzogWzAsIHtcbiAgICAgICAgICAnRm46OlNwbGl0JzogWycvJywge1xuICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbNSwge1xuICAgICAgICAgICAgICAnRm46OlNwbGl0JzogWyc6JyxcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydEZXBsb3ltZW50Q3VzdG9tUmVzb3VyY2U0N0U4QjJFNicsICdEZXN0aW5hdGlvbkJ1Y2tldEFybiddIH1dLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdyZXNvdXJjZSBpZCBpbmNsdWRlcyBtZW1vcnkgYW5kIHZwYycsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcbiAgY29uc3QgdnBjOiBlYzIuSVZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU29tZVZwYzInLCB7fSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgdnBjLFxuICAgIG1lbW9yeUxpbWl0OiAyNTYsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgIFJlc291cmNlczogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICBEZXBsb3lXaXRoVnBjMkN1c3RvbVJlc291cmNlMjU2TWlCYzhhMzk1OTZjYjg2NDE5MjlmY2Y2YTI4OGJjOWRiNWFiN2IwZjY1NmFkM0M1RjZFNzg6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50JyxcbiAgICAgIH0pLFxuICAgIH0pLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdidWNrZXQgaW5jbHVkZXMgY3VzdG9tIHJlc291cmNlIG93bmVyIHRhZycsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcbiAgY29uc3QgdnBjOiBlYzIuSVZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU29tZVZwYzInLCB7fSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGVzdGluYXRpb25LZXlQcmVmaXg6ICcvYS9iL2MnLFxuICAgIHZwYyxcbiAgICBtZW1vcnlMaW1pdDogMjU2LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgVGFnczogW3tcbiAgICAgIEtleTogJ2F3cy1jZGs6Y3Itb3duZWQ6L2EvYi9jOjk3MWUxZmE4JyxcbiAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgfV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rocm93cyBpZiBkZXN0aW5hdGlvbktleVByZWZpeCBpcyB0b28gbG9uZycsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGVzdGluYXRpb25LZXlQcmVmaXg6ICcvdGhpcy9pcy9hL3JhbmRvbS9rZXkvcHJlZml4L3RoYXQvaXMvYS9sb3Qvb2YvY2hhcmFjdGVycy9kby93ZS90aGluay90aGF0L2l0L3dpbGwvZXZlci9iZS90aGlzL2xvbmc/Pz8/Pz8nLFxuICAgIG1lbW9yeUxpbWl0OiAyNTYsXG4gIH0pKS50b1Rocm93KC9UaGUgQnVja2V0RGVwbG95bWVudCBjb25zdHJ1Y3QgcmVxdWlyZXMgdGhhdC8pO1xuXG59KTtcblxudGVzdCgnc2tpcHMgZGVzdGluYXRpb25LZXlQcmVmaXggdmFsaWRhdGlvbiBpZiB0b2tlbicsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcblxuICAvLyBXSEVOXG4gIC8vIHRyaWNrIHRoZSBjZGsgaW50byBjcmVhdGluZyBhIHZlcnkgbG9uZyB0b2tlblxuICBjb25zdCBwcmVmaXhUb2tlbiA9IGNkay5Ub2tlbi5hc1N0cmluZyg1LCB7IGRpc3BsYXlIaW50OiAnbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmdsb25nbG9uZ2xvbmcnIH0pO1xuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGVzdGluYXRpb25LZXlQcmVmaXg6IHByZWZpeFRva2VuLFxuICAgIG1lbW9yeUxpbWl0OiAyNTYsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLCB7XG4gICAgRGVzdGluYXRpb25CdWNrZXRLZXlQcmVmaXg6IDUsXG4gIH0pO1xuXG59KTtcblxudGVzdCgnYnVja2V0IGhhcyBtdWx0aXBsZSBkZXBsb3ltZW50cycsICgpID0+IHtcblxuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Rlc3QnKTtcbiAgY29uc3QgdnBjOiBlYzIuSVZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnU29tZVZwYzInLCB7fSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgZGVzdGluYXRpb25LZXlQcmVmaXg6ICcvYS9iL2MnLFxuICAgIHZwYyxcbiAgICBtZW1vcnlMaW1pdDogMjU2LFxuICB9KTtcblxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMyRXhjbHVkZScsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJyksIHtcbiAgICAgIGV4Y2x1ZGU6IFsnaW5kZXguaHRtbCddLFxuICAgIH0pXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnL2EvYi9jJyxcbiAgICB2cGMsXG4gICAgbWVtb3J5TGltaXQ6IDI1NixcbiAgfSk7XG5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3lXaXRoVnBjMycsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnL3gveicsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICBUYWdzOiBbXG4gICAgICB7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6Y3Itb3duZWQ6L2EvYi9jOjZkYTBhNGFiJyxcbiAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6Y3Itb3duZWQ6L2EvYi9jOjk3MWUxZmE4JyxcbiAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ2F3cy1jZGs6Y3Itb3duZWQ6L3gvejoyZGIwNDYyMicsXG4gICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1wiU291cmNlTWFya2Vyc1wiIGlzIG5vdCBpbmNsdWRlZCBpZiBub25lIG9mIHRoZSBzb3VyY2VzIGhhdmUgbWFya2VycycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3lXaXRoVnBjMycsIHtcbiAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICB9KTtcblxuICBjb25zdCBtYXAgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcpO1xuICBleHBlY3QobWFwKS50b0JlRGVmaW5lZCgpO1xuICBjb25zdCByZXNvdXJjZSA9IG1hcFtPYmplY3Qua2V5cyhtYXApWzBdXTtcbiAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc291cmNlLlByb3BlcnRpZXMpKS50b1N0cmljdEVxdWFsKFtcbiAgICAnU2VydmljZVRva2VuJyxcbiAgICAnU291cmNlQnVja2V0TmFtZXMnLFxuICAgICdTb3VyY2VPYmplY3RLZXlzJyxcbiAgICAnRGVzdGluYXRpb25CdWNrZXROYW1lJyxcbiAgICAnUHJ1bmUnLFxuICBdKTtcbn0pO1xuXG50ZXN0KCdTb3VyY2UuZGF0YSgpIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIGZpbGUgd2l0aCBzdHJpbmcgY29udGVudHMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxuICBjb25zdCBzb3VyY2UgPSBzM2RlcGxveS5Tb3VyY2UuZGF0YSgnbXkvcGF0aC50eHQnLCAnaGVsbG8sIHdvcmxkJyk7XG5cbiAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3lXaXRoVnBjMycsIHtcbiAgICBzb3VyY2VzOiBbc291cmNlXSxcbiAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnL3gveicsXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGFwcC5zeW50aCgpO1xuICBjb25zdCBjb250ZW50ID0gcmVhZERhdGFGaWxlKHJlc3VsdCwgJ215L3BhdGgudHh0Jyk7XG4gIGV4cGVjdChjb250ZW50KS50b1N0cmljdEVxdWFsKCdoZWxsbywgd29ybGQnKTtcbn0pO1xuXG50ZXN0KCdTb3VyY2UuanNvbkRhdGEoKSBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBmaWxlIHdpdGggYSBKU09OIG9iamVjdCcsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3QnKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG4gIGNvbnN0IGNvbmZpZyA9IHtcbiAgICBmb286ICdiYXInLFxuICAgIHN1Yjoge1xuICAgICAgaGVsbG86IGJ1Y2tldC5idWNrZXRBcm4sXG4gICAgfSxcbiAgfTtcblxuICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveVdpdGhWcGMzJywge1xuICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuanNvbkRhdGEoJ2FwcC1jb25maWcuanNvbicsIGNvbmZpZyldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGFwcC5zeW50aCgpO1xuICBjb25zdCBvYmogPSBKU09OLnBhcnNlKHJlYWREYXRhRmlsZShyZXN1bHQsICdhcHAtY29uZmlnLmpzb24nKSk7XG4gIGV4cGVjdChvYmopLnRvU3RyaWN0RXF1YWwoe1xuICAgIGZvbzogJ2JhcicsXG4gICAgc3ViOiB7XG4gICAgICBoZWxsbzogJzw8bWFya2VyOjB4YmFiYTowPj4nLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIHZlcmlmeSBtYXJrZXIgaXMgbWFwcGVkIHRvIHRoZSBidWNrZXQgQVJOIGluIHRoZSByZXNvdXJjZSBwcm9wc1xuICBUZW1wbGF0ZS5mcm9tSlNPTihyZXN1bHQuc3RhY2tzWzBdLnRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsIHtcbiAgICBTb3VyY2VNYXJrZXJzOiBbXG4gICAgICB7ICc8PG1hcmtlcjoweGJhYmE6MD4+JzogeyAnRm46OkdldEF0dCc6IFsnQnVja2V0ODM5MDhFNzcnLCAnQXJuJ10gfSB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBhZGQgc291cmNlcyB3aXRoIGFkZFNvdXJjZScsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3QnKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5kYXRhKCdteS9wYXRoLnR4dCcsICdoZWxsb1dvcmxkJyldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pO1xuICBkZXBsb3ltZW50LmFkZFNvdXJjZShzM2RlcGxveS5Tb3VyY2UuZGF0YSgnbXkvb3RoZXIvcGF0aC50eHQnLCAnaGVsbG8gd29ybGQnKSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gYXBwLnN5bnRoKCk7XG4gIGNvbnN0IGNvbnRlbnQgPSByZWFkRGF0YUZpbGUocmVzdWx0LCAnbXkvcGF0aC50eHQnKTtcbiAgY29uc3QgY29udGVudDIgPSByZWFkRGF0YUZpbGUocmVzdWx0LCAnbXkvb3RoZXIvcGF0aC50eHQnKTtcbiAgZXhwZWN0KGNvbnRlbnQpLnRvU3RyaWN0RXF1YWwoJ2hlbGxvV29ybGQnKTtcbiAgZXhwZWN0KGNvbnRlbnQyKS50b1N0cmljdEVxdWFsKCdoZWxsbyB3b3JsZCcpO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDREtCdWNrZXREZXBsb3ltZW50Jywge1xuICAgIFNvdXJjZU1hcmtlcnM6IFtcbiAgICAgIHt9LFxuICAgICAge30sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnaWYgYW55IHNvdXJjZSBoYXMgbWFya2VycyB0aGVuIGFsbCBzb3VyY2VzIGhhdmUgbWFya2VycycsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3QnKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQoc3RhY2ssICdEZXBsb3knLCB7XG4gICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5kYXRhKCdteS9wYXRoLnR4dCcsICdoZWxsb1dvcmxkJyldLFxuICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gIH0pO1xuICBkZXBsb3ltZW50LmFkZFNvdXJjZShzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSkpO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGFwcC5zeW50aCgpO1xuICBjb25zdCBjb250ZW50ID0gcmVhZERhdGFGaWxlKHJlc3VsdCwgJ215L3BhdGgudHh0Jyk7XG4gIGV4cGVjdChjb250ZW50KS50b1N0cmljdEVxdWFsKCdoZWxsb1dvcmxkJyk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLCB7XG4gICAgU291cmNlTWFya2VyczogW1xuICAgICAge30sXG4gICAgICB7fSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiByZWFkRGF0YUZpbGUoY2FzbTogY3hhcGkuQ2xvdWRBc3NlbWJseSwgcmVsYXRpdmVQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBhc3NldERpcnMgPSByZWFkZGlyU3luYyhjYXNtLmRpcmVjdG9yeSkuZmlsdGVyKGYgPT4gZi5zdGFydHNXaXRoKCdhc3NldC4nKSk7XG4gIGZvciAoY29uc3QgZGlyIG9mIGFzc2V0RGlycykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHBhdGguam9pbihjYXNtLmRpcmVjdG9yeSwgZGlyLCByZWxhdGl2ZVBhdGgpO1xuICAgIGlmIChleGlzdHNTeW5jKGNhbmRpZGF0ZSkpIHtcbiAgICAgIHJldHVybiByZWFkRmlsZVN5bmMoY2FuZGlkYXRlLCAndXRmOCcpO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgRmlsZSAke3JlbGF0aXZlUGF0aH0gbm90IGZvdW5kIGluIGFueSBvZiB0aGUgYXNzZXRzIG9mIHRoZSBhc3NlbWJseWApO1xufVxuIl19