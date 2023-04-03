"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const aws_logs_1 = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const ExpectedBucketPolicyProperties = {
    PolicyDocument: {
        Statement: [
            {
                Action: 's3:*',
                Condition: {
                    Bool: { 'aws:SecureTransport': 'false' },
                },
                Effect: 'Deny',
                Principal: {
                    AWS: '*',
                },
                Resource: [
                    {
                        'Fn::GetAtt': [
                            'MyAmazingCloudTrailS3A580FE27',
                            'Arn',
                        ],
                    },
                    {
                        'Fn::Join': [
                            '',
                            [{
                                    'Fn::GetAtt': [
                                        'MyAmazingCloudTrailS3A580FE27',
                                        'Arn',
                                    ],
                                },
                                '/*'],
                        ],
                    },
                ],
            },
            {
                Action: 's3:GetBucketAcl',
                Effect: 'Allow',
                Principal: {
                    Service: 'cloudtrail.amazonaws.com',
                },
                Resource: {
                    'Fn::GetAtt': [
                        'MyAmazingCloudTrailS3A580FE27',
                        'Arn',
                    ],
                },
            },
            {
                Action: 's3:PutObject',
                Condition: {
                    StringEquals: {
                        's3:x-amz-acl': 'bucket-owner-full-control',
                    },
                },
                Effect: 'Allow',
                Principal: {
                    Service: 'cloudtrail.amazonaws.com',
                },
                Resource: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'MyAmazingCloudTrailS3A580FE27',
                                    'Arn',
                                ],
                            },
                            '/AWSLogs/123456789012/*',
                        ],
                    ],
                },
            },
        ],
        Version: '2012-10-17',
    },
};
const logsRolePolicyName = 'MyAmazingCloudTrailLogsRoleDefaultPolicy61DC49E7';
const logsRoleName = 'MyAmazingCloudTrailLogsRoleF2CCF977';
function getTestStack() {
    return new core_1.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
describe('cloudtrail', () => {
    describe('constructs the expected resources', () => {
        test('with no properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail');
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
            const trail = assertions_1.Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
            expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
        });
        test('with s3bucket', () => {
            const stack = getTestStack();
            const Trailbucket = new s3.Bucket(stack, 'S3');
            const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');
            Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
                resources: [Trailbucket.bucketArn],
                actions: ['s3:GetBucketAcl'],
                principals: [cloudTrailPrincipal],
            }));
            Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
                resources: [Trailbucket.arnForObjects(`AWSLogs/${core_1.Stack.of(stack).account}/*`)],
                actions: ['s3:PutObject'],
                principals: [cloudTrailPrincipal],
                conditions: {
                    StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
                },
            }));
            new lib_1.Trail(stack, 'Trail', { bucket: Trailbucket });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
        });
        test('with sns topic', () => {
            const stack = getTestStack();
            const topic = new sns.Topic(stack, 'Topic');
            new lib_1.Trail(stack, 'Trail', { snsTopic: topic });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'sns:Publish',
                            Effect: 'Allow',
                            Principal: { Service: 'cloudtrail.amazonaws.com' },
                            Resource: { Ref: 'TopicBFC7AF6E' },
                            Sid: '0',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('with imported s3 bucket', () => {
            // GIVEN
            const stack = getTestStack();
            const bucket = s3.Bucket.fromBucketName(stack, 'S3', 'somebucket');
            // WHEN
            new lib_1.Trail(stack, 'Trail', { bucket });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                S3BucketName: 'somebucket',
            });
        });
        test('with s3KeyPrefix', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            new lib_1.Trail(stack, 'Trail', { s3KeyPrefix: 'someprefix' });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
                Bucket: { Ref: 'TrailS30071F172' },
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {
                                Bool: {
                                    'aws:SecureTransport': 'false',
                                },
                            },
                            Effect: 'Deny',
                            Principal: {
                                AWS: '*',
                            },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'TrailS30071F172',
                                        'Arn',
                                    ],
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'TrailS30071F172',
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
                            Action: 's3:GetBucketAcl',
                            Effect: 'Allow',
                            Principal: { Service: 'cloudtrail.amazonaws.com' },
                            Resource: { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
                        },
                        {
                            Action: 's3:PutObject',
                            Condition: {
                                StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
                            },
                            Effect: 'Allow',
                            Principal: { Service: 'cloudtrail.amazonaws.com' },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
                                        '/someprefix/AWSLogs/123456789012/*',
                                    ],
                                ],
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('encryption keys', () => {
            const stack = new core_1.Stack();
            const key = new kms.Key(stack, 'key');
            new lib_1.Trail(stack, 'EncryptionKeyTrail', {
                trailName: 'EncryptionKeyTrail',
                encryptionKey: key,
            });
            new lib_1.Trail(stack, 'KmsKeyTrail', {
                trailName: 'KmsKeyTrail',
                encryptionKey: key,
            });
            new lib_1.Trail(stack, 'UnencryptedTrail', {
                trailName: 'UnencryptedTrail',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                TrailName: 'EncryptionKeyTrail',
                KMSKeyId: {
                    'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                TrailName: 'KmsKeyTrail',
                KMSKeyId: {
                    'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                TrailName: 'UnencryptedTrail',
                KMSKeyId: assertions_1.Match.absent(),
            });
        });
        cdk_build_tools_1.testDeprecated('Both kmsKey and encryptionKey must not be specified', () => {
            const stack = new core_1.Stack();
            const key = new kms.Key(stack, 'key');
            expect(() => new lib_1.Trail(stack, 'ErrorTrail', {
                trailName: 'ErrorTrail',
                encryptionKey: key,
                kmsKey: key,
            })).toThrow(/Both kmsKey and encryptionKey must not be specified/);
        });
        describe('with cloud watch logs', () => {
            test('enabled', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    sendToCloudWatchLogs: true,
                });
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', { RetentionInDays: 365 });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [{
                                Effect: 'Allow',
                                Action: ['logs:PutLogEvents', 'logs:CreateLogStream'],
                                Resource: {
                                    'Fn::GetAtt': ['MyAmazingCloudTrailLogGroup2BE67F87', 'Arn'],
                                },
                            }],
                    },
                    PolicyName: logsRolePolicyName,
                    Roles: [{ Ref: 'MyAmazingCloudTrailLogsRoleF2CCF977' }],
                });
                const trail = assertions_1.Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
                expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
            });
            test('enabled and custom retention', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    sendToCloudWatchLogs: true,
                    cloudWatchLogsRetention: aws_logs_1.RetentionDays.ONE_WEEK,
                });
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
                    RetentionInDays: 7,
                });
                const trail = assertions_1.Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
                expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
            });
            test('enabled and with custom log group', () => {
                const stack = getTestStack();
                const cloudWatchLogGroup = new aws_logs_1.LogGroup(stack, 'MyLogGroup', {
                    retention: aws_logs_1.RetentionDays.FIVE_DAYS,
                });
                new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    sendToCloudWatchLogs: true,
                    cloudWatchLogsRetention: aws_logs_1.RetentionDays.ONE_WEEK,
                    cloudWatchLogGroup,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
                    RetentionInDays: 5,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    CloudWatchLogsLogGroupArn: stack.resolve(cloudWatchLogGroup.logGroupArn),
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Statement: [assertions_1.Match.objectLike({
                                Resource: stack.resolve(cloudWatchLogGroup.logGroupArn),
                            })],
                    },
                });
            });
            test('disabled', () => {
                const stack = getTestStack();
                const t = new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    sendToCloudWatchLogs: false,
                    cloudWatchLogsRetention: aws_logs_1.RetentionDays.ONE_WEEK,
                });
                expect(t.logGroup).toBeUndefined();
                assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
            });
        });
        describe('with event selectors', () => {
            test('all s3 events', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.logAllS3DataEvents();
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        Ref: 'AWS::Partition',
                                                    },
                                                    ':s3:::',
                                                ],
                                            ],
                                        },
                                    ],
                                }],
                            IncludeManagementEvents: assertions_1.Match.absent(),
                            ReadWriteType: assertions_1.Match.absent(),
                        },
                    ],
                });
            });
            test('specific s3 buckets and objects', () => {
                const stack = getTestStack();
                const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.addS3EventSelector([{ bucket }]);
                cloudTrail.addS3EventSelector([{
                        bucket,
                        objectPrefix: 'prefix-1/prefix-2',
                    }]);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/',
                                                ],
                                            ],
                                        }],
                                }],
                        },
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/prefix-1/prefix-2',
                                                ],
                                            ],
                                        }],
                                }],
                        },
                    ],
                });
            });
            test('no s3 event selector when list is empty', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.addS3EventSelector([]);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [],
                });
            });
            test('with hand-specified props', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.logAllS3DataEvents({ includeManagementEvents: false, readWriteType: lib_1.ReadWriteType.READ_ONLY });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        Ref: 'AWS::Partition',
                                                    },
                                                    ':s3:::',
                                                ],
                                            ],
                                        },
                                    ],
                                }],
                            IncludeManagementEvents: false,
                            ReadWriteType: 'ReadOnly',
                        },
                    ],
                });
            });
            test('with management event', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'MyAmazingCloudTrail', { managementEvents: lib_1.ReadWriteType.WRITE_ONLY });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            IncludeManagementEvents: true,
                            ReadWriteType: 'WriteOnly',
                        },
                    ],
                });
            });
            test('exclude management events', () => {
                const stack = getTestStack();
                const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.addS3EventSelector([{ bucket }], {
                    excludeManagementEventSources: [
                        lib_1.ManagementEventSources.KMS,
                        lib_1.ManagementEventSources.RDS_DATA_API,
                    ],
                });
                cloudTrail.addS3EventSelector([{ bucket }], {
                    excludeManagementEventSources: [],
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/',
                                                ],
                                            ],
                                        }],
                                }],
                            ExcludeManagementEventSources: [
                                'kms.amazonaws.com',
                                'rdsdata.amazonaws.com',
                            ],
                        },
                        {
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/',
                                                ],
                                            ],
                                        }],
                                }],
                            ExcludeManagementEventSources: [],
                        },
                    ],
                });
            });
            test('for Lambda function data event', () => {
                const stack = getTestStack();
                const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
                    runtime: lambda.Runtime.NODEJS_14_X,
                    handler: 'hello.handler',
                    code: lambda.Code.fromInline('exports.handler = {}'),
                });
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.addLambdaEventSelector([lambdaFunction]);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::Lambda::Function',
                                    Values: [{
                                            'Fn::GetAtt': ['LambdaFunctionBF21E41F', 'Arn'],
                                        }],
                                }],
                        },
                    ],
                });
            });
            test('for all Lambda function data events', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail');
                cloudTrail.logAllLambdaDataEvents();
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [
                        {
                            DataResources: [{
                                    Type: 'AWS::Lambda::Function',
                                    Values: [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        Ref: 'AWS::Partition',
                                                    },
                                                    ':lambda',
                                                ],
                                            ],
                                        },
                                    ],
                                }],
                        },
                    ],
                });
            });
            test('not provided and managementEvents set to None throws missing event selectors error', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    managementEvents: lib_1.ReadWriteType.NONE,
                });
                expect(() => {
                    assertions_1.Template.fromStack(stack);
                }).toThrowError(/At least one event selector must be added when management event recording is set to None/);
            });
            test('defaults to not include management events when managementEvents set to None', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    managementEvents: lib_1.ReadWriteType.NONE,
                });
                const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
                cloudTrail.addS3EventSelector([{ bucket }]);
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [{
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/',
                                                ],
                                            ],
                                        }],
                                }],
                            IncludeManagementEvents: false,
                        }],
                });
            });
            test('includeManagementEvents can be overridden when managementEvents set to None', () => {
                const stack = getTestStack();
                const cloudTrail = new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                    managementEvents: lib_1.ReadWriteType.NONE,
                });
                const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
                cloudTrail.addS3EventSelector([{ bucket }], {
                    includeManagementEvents: true,
                    readWriteType: lib_1.ReadWriteType.WRITE_ONLY,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    EventSelectors: [{
                            DataResources: [{
                                    Type: 'AWS::S3::Object',
                                    Values: [{
                                            'Fn::Join': [
                                                '',
                                                [
                                                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                                                    '/',
                                                ],
                                            ],
                                        }],
                                }],
                            IncludeManagementEvents: true,
                            ReadWriteType: 'WriteOnly',
                        }],
                });
            });
            test('isOrganizationTrail is passed correctly', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'OrganizationTrail', {
                    isOrganizationTrail: true,
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                    IsOrganizationTrail: true,
                });
            });
            test('isOrganizationTrail defaults to not defined', () => {
                const stack = getTestStack();
                new lib_1.Trail(stack, 'OrganizationTrail');
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', assertions_1.Match.objectEquals({
                    IsLogging: true,
                    S3BucketName: assertions_1.Match.anyValue(),
                    EnableLogFileValidation: true,
                    EventSelectors: [],
                    IncludeGlobalServiceEvents: true,
                    IsMultiRegionTrail: true,
                }));
            });
        });
    });
    describe('onEvent', () => {
        test('add an event rule', () => {
            // GIVEN
            const stack = getTestStack();
            // WHEN
            lib_1.Trail.onEvent(stack, 'DoEvents', {
                target: {
                    bind: () => ({
                        id: '',
                        arn: 'arn',
                    }),
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                EventPattern: {
                    'detail-type': [
                        'AWS API Call via CloudTrail',
                    ],
                },
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: 'arn',
                        Id: 'Target0',
                    },
                ],
            });
        });
    });
    describe('insights ', () => {
        test('no properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                insightTypes: [],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                InsightSelectors: [],
            });
        });
        test('API Call Rate properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                insightTypes: [
                    lib_1.InsightType.API_CALL_RATE,
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                InsightSelectors: [{
                        InsightType: 'ApiCallRateInsight',
                    }],
            });
        });
        test('API Error Rate properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                insightTypes: [
                    lib_1.InsightType.API_ERROR_RATE,
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                InsightSelectors: [{
                        InsightType: 'ApiErrorRateInsight',
                    }],
            });
        });
        test('duplicate properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                insightTypes: [
                    lib_1.InsightType.API_CALL_RATE,
                    lib_1.InsightType.API_CALL_RATE,
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                InsightSelectors: [
                    {
                        InsightType: 'ApiCallRateInsight',
                    },
                    {
                        InsightType: 'ApiCallRateInsight',
                    },
                ],
            });
        });
        test('ALL properties', () => {
            const stack = getTestStack();
            new lib_1.Trail(stack, 'MyAmazingCloudTrail', {
                insightTypes: [
                    lib_1.InsightType.API_CALL_RATE,
                    lib_1.InsightType.API_ERROR_RATE,
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
                InsightSelectors: [
                    {
                        InsightType: 'ApiCallRateInsight',
                    },
                    {
                        InsightType: 'ApiErrorRateInsight',
                    },
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWR0cmFpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWR0cmFpbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLGdEQUE0RDtBQUM1RCxzQ0FBc0M7QUFDdEMsd0NBQXdDO0FBQ3hDLDhEQUEwRDtBQUMxRCx3Q0FBc0M7QUFDdEMsZ0NBQW1GO0FBRW5GLE1BQU0sOEJBQThCLEdBQUc7SUFDckMsY0FBYyxFQUFFO1FBQ2QsU0FBUyxFQUFFO1lBQ1Q7Z0JBQ0UsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRTtpQkFDekM7Z0JBQ0QsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsU0FBUyxFQUFFO29CQUNULEdBQUcsRUFBRSxHQUFHO2lCQUNUO2dCQUNELFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxZQUFZLEVBQUU7NEJBQ1osK0JBQStCOzRCQUMvQixLQUFLO3lCQUNOO3FCQUNGO29CQUNEO3dCQUNFLFVBQVUsRUFBRTs0QkFDVixFQUFFOzRCQUNGLENBQUM7b0NBQ0MsWUFBWSxFQUFFO3dDQUNaLCtCQUErQjt3Q0FDL0IsS0FBSztxQ0FDTjtpQ0FDRjtnQ0FDRCxJQUFJLENBQUM7eUJBQ047cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsMEJBQTBCO2lCQUNwQztnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLCtCQUErQjt3QkFDL0IsS0FBSztxQkFDTjtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFNBQVMsRUFBRTtvQkFDVCxZQUFZLEVBQUU7d0JBQ1os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USxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCO3dCQUNFLFdBQVcsRUFBRSxvQkFBb0I7cUJBQ2xDO29CQUNEO3dCQUNFLFdBQVcsRUFBRSxvQkFBb0I7cUJBQ2xDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1lBQzFCLE1BQU0sS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO1lBQzdCLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtnQkFDdEMsWUFBWSxFQUFFO29CQUNaLGlCQUFXLENBQUMsYUFBYTtvQkFDekIsaUJBQVcsQ0FBQyxjQUFjO2lCQUMzQjthQUNGLENBQUMsQ0FBQztZQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxnQkFBZ0IsRUFBRTtvQkFDaEI7d0JBQ0UsV0FBVyxFQUFFLG9CQUFvQjtxQkFDbEM7b0JBQ0Q7d0JBQ0UsV0FBVyxFQUFFLHFCQUFxQjtxQkFDbkM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IExvZ0dyb3VwLCBSZXRlbnRpb25EYXlzIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBNYW5hZ2VtZW50RXZlbnRTb3VyY2VzLCBSZWFkV3JpdGVUeXBlLCBUcmFpbCwgSW5zaWdodFR5cGUgfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBFeHBlY3RlZEJ1Y2tldFBvbGljeVByb3BlcnRpZXMgPSB7XG4gIFBvbGljeURvY3VtZW50OiB7XG4gICAgU3RhdGVtZW50OiBbXG4gICAgICB7XG4gICAgICAgIEFjdGlvbjogJ3MzOionLFxuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICBCb29sOiB7ICdhd3M6U2VjdXJlVHJhbnNwb3J0JzogJ2ZhbHNlJyB9LFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3Q6ICdEZW55JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgQVdTOiAnKicsXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUFtYXppbmdDbG91ZFRyYWlsUzNBNTgwRkUyNycsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlBbWF6aW5nQ2xvdWRUcmFpbFMzQTU4MEZFMjcnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJy8qJ10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRBY2wnLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgIFNlcnZpY2U6ICdjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB9LFxuICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015QW1hemluZ0Nsb3VkVHJhaWxTM0E1ODBGRTI3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdzMzp4LWFtei1hY2wnOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBTZXJ2aWNlOiAnY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015QW1hemluZ0Nsb3VkVHJhaWxTM0E1ODBGRTI3JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvQVdTTG9ncy8xMjM0NTY3ODkwMTIvKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICB9LFxufTtcblxuY29uc3QgbG9nc1JvbGVQb2xpY3lOYW1lID0gJ015QW1hemluZ0Nsb3VkVHJhaWxMb2dzUm9sZURlZmF1bHRQb2xpY3k2MURDNDlFNyc7XG5jb25zdCBsb2dzUm9sZU5hbWUgPSAnTXlBbWF6aW5nQ2xvdWRUcmFpbExvZ3NSb2xlRjJDQ0Y5NzcnO1xuXG5mdW5jdGlvbiBnZXRUZXN0U3RhY2soKTogU3RhY2sge1xuICByZXR1cm4gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG59XG5cbmRlc2NyaWJlKCdjbG91ZHRyYWlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29uc3RydWN0cyB0aGUgZXhwZWN0ZWQgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3dpdGggbm8gcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJyk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIEV4cGVjdGVkQnVja2V0UG9saWN5UHJvcGVydGllcyk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIDApO1xuICAgICAgY29uc3QgdHJhaWw6IGFueSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCkuUmVzb3VyY2VzLk15QW1hemluZ0Nsb3VkVHJhaWw1NDUxNkU4RDtcbiAgICAgIGV4cGVjdCh0cmFpbC5EZXBlbmRzT24pLnRvRXF1YWwoWydNeUFtYXppbmdDbG91ZFRyYWlsUzNQb2xpY3kzOUMxMjBCMCddKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggczNidWNrZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgVHJhaWxidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnUzMnKTtcbiAgICAgIGNvbnN0IGNsb3VkVHJhaWxQcmluY2lwYWwgPSBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkdHJhaWwuYW1hem9uYXdzLmNvbScpO1xuICAgICAgVHJhaWxidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogW1RyYWlsYnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6R2V0QnVja2V0QWNsJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtjbG91ZFRyYWlsUHJpbmNpcGFsXSxcbiAgICAgIH0pKTtcblxuICAgICAgVHJhaWxidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogW1RyYWlsYnVja2V0LmFybkZvck9iamVjdHMoYEFXU0xvZ3MvJHtTdGFjay5vZihzdGFjaykuYWNjb3VudH0vKmApXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgcHJpbmNpcGFsczogW2Nsb3VkVHJhaWxQcmluY2lwYWxdLFxuICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICdzMzp4LWFtei1hY2wnOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnVHJhaWwnLCB7IGJ1Y2tldDogVHJhaWxidWNrZXQgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0UG9saWN5JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBzbnMgdG9waWMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcblxuXG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdUcmFpbCcsIHsgc25zVG9waWM6IHRvcGljIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIDEpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWNQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3NuczpQdWJsaXNoJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2Nsb3VkdHJhaWwuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHsgUmVmOiAnVG9waWNCRkM3QUY2RScgfSxcbiAgICAgICAgICAgICAgU2lkOiAnMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIGltcG9ydGVkIHMzIGJ1Y2tldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnUzMnLCAnc29tZWJ1Y2tldCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdUcmFpbCcsIHsgYnVja2V0IH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgUzNCdWNrZXROYW1lOiAnc29tZWJ1Y2tldCcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggczNLZXlQcmVmaXgnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnVHJhaWwnLCB7IHMzS2V5UHJlZml4OiAnc29tZXByZWZpeCcgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0JywgMSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICBCdWNrZXQ6IHsgUmVmOiAnVHJhaWxTMzAwNzFGMTcyJyB9LFxuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzoqJyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgQm9vbDoge1xuICAgICAgICAgICAgICAgICAgJ2F3czpTZWN1cmVUcmFuc3BvcnQnOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBBV1M6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1RyYWlsUzMwMDcxRjE3MicsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1RyYWlsUzMwMDcxRjE3MicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRBY2wnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnVHJhaWxTMzAwNzFGMTcyJywgJ0FybiddIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHsgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydUcmFpbFMzMDA3MUYxNzInLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgJy9zb21lcHJlZml4L0FXU0xvZ3MvMTIzNDU2Nzg5MDEyLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW5jcnlwdGlvbiBrZXlzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAna2V5Jyk7XG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdFbmNyeXB0aW9uS2V5VHJhaWwnLCB7XG4gICAgICAgIHRyYWlsTmFtZTogJ0VuY3J5cHRpb25LZXlUcmFpbCcsXG4gICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgIH0pO1xuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnS21zS2V5VHJhaWwnLCB7XG4gICAgICAgIHRyYWlsTmFtZTogJ0ttc0tleVRyYWlsJyxcbiAgICAgICAgZW5jcnlwdGlvbktleToga2V5LFxuICAgICAgfSk7XG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdVbmVuY3J5cHRlZFRyYWlsJywge1xuICAgICAgICB0cmFpbE5hbWU6ICdVbmVuY3J5cHRlZFRyYWlsJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgVHJhaWxOYW1lOiAnRW5jcnlwdGlvbktleVRyYWlsJyxcbiAgICAgICAgS01TS2V5SWQ6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFsna2V5RkVERDZFQzAnLCAnQXJuJ10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICBUcmFpbE5hbWU6ICdLbXNLZXlUcmFpbCcsXG4gICAgICAgIEtNU0tleUlkOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2tleUZFREQ2RUMwJywgJ0FybiddLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgVHJhaWxOYW1lOiAnVW5lbmNyeXB0ZWRUcmFpbCcsXG4gICAgICAgIEtNU0tleUlkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ0JvdGgga21zS2V5IGFuZCBlbmNyeXB0aW9uS2V5IG11c3Qgbm90IGJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ2tleScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFRyYWlsKHN0YWNrLCAnRXJyb3JUcmFpbCcsIHtcbiAgICAgICAgdHJhaWxOYW1lOiAnRXJyb3JUcmFpbCcsXG4gICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgICAga21zS2V5OiBrZXksXG4gICAgICB9KSkudG9UaHJvdygvQm90aCBrbXNLZXkgYW5kIGVuY3J5cHRpb25LZXkgbXVzdCBub3QgYmUgc3BlY2lmaWVkLyk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBjbG91ZCB3YXRjaCBsb2dzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnZW5hYmxlZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgICBzZW5kVG9DbG91ZFdhdGNoTG9nczogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCAxKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5JywgRXhwZWN0ZWRCdWNrZXRQb2xpY3lQcm9wZXJ0aWVzKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCAxKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywgeyBSZXRlbnRpb25JbkRheXM6IDM2NSB9KTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBBY3Rpb246IFsnbG9nczpQdXRMb2dFdmVudHMnLCAnbG9nczpDcmVhdGVMb2dTdHJlYW0nXSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlBbWF6aW5nQ2xvdWRUcmFpbExvZ0dyb3VwMkJFNjdGODcnLCAnQXJuJ10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6IGxvZ3NSb2xlUG9saWN5TmFtZSxcbiAgICAgICAgICBSb2xlczogW3sgUmVmOiAnTXlBbWF6aW5nQ2xvdWRUcmFpbExvZ3NSb2xlRjJDQ0Y5NzcnIH1dLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdHJhaWw6IGFueSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCkuUmVzb3VyY2VzLk15QW1hemluZ0Nsb3VkVHJhaWw1NDUxNkU4RDtcbiAgICAgICAgZXhwZWN0KHRyYWlsLkRlcGVuZHNPbikudG9FcXVhbChbbG9nc1JvbGVQb2xpY3lOYW1lLCBsb2dzUm9sZU5hbWUsICdNeUFtYXppbmdDbG91ZFRyYWlsUzNQb2xpY3kzOUMxMjBCMCddKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdlbmFibGVkIGFuZCBjdXN0b20gcmV0ZW50aW9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJywge1xuICAgICAgICAgIHNlbmRUb0Nsb3VkV2F0Y2hMb2dzOiB0cnVlLFxuICAgICAgICAgIGNsb3VkV2F0Y2hMb2dzUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9XRUVLLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIDEpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0JywgMSk7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCBFeHBlY3RlZEJ1Y2tldFBvbGljeVByb3BlcnRpZXMpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIDEpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAxKTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCB7XG4gICAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiA3LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdHJhaWw6IGFueSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCkuUmVzb3VyY2VzLk15QW1hemluZ0Nsb3VkVHJhaWw1NDUxNkU4RDtcbiAgICAgICAgZXhwZWN0KHRyYWlsLkRlcGVuZHNPbikudG9FcXVhbChbbG9nc1JvbGVQb2xpY3lOYW1lLCBsb2dzUm9sZU5hbWUsICdNeUFtYXppbmdDbG91ZFRyYWlsUzNQb2xpY3kzOUMxMjBCMCddKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdlbmFibGVkIGFuZCB3aXRoIGN1c3RvbSBsb2cgZ3JvdXAnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGNsb3VkV2F0Y2hMb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnLCB7XG4gICAgICAgICAgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLkZJVkVfREFZUyxcbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBUcmFpbChzdGFjaywgJ015QW1hemluZ0Nsb3VkVHJhaWwnLCB7XG4gICAgICAgICAgc2VuZFRvQ2xvdWRXYXRjaExvZ3M6IHRydWUsXG4gICAgICAgICAgY2xvdWRXYXRjaExvZ3NSZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICAgICAgY2xvdWRXYXRjaExvZ0dyb3VwLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIHtcbiAgICAgICAgICBSZXRlbnRpb25JbkRheXM6IDUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICAgIENsb3VkV2F0Y2hMb2dzTG9nR3JvdXBBcm46IHN0YWNrLnJlc29sdmUoY2xvdWRXYXRjaExvZ0dyb3VwLmxvZ0dyb3VwQXJuKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICBSZXNvdXJjZTogc3RhY2sucmVzb2x2ZShjbG91ZFdhdGNoTG9nR3JvdXAubG9nR3JvdXBBcm4pLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2Rpc2FibGVkJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBjb25zdCB0ID0gbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgICBzZW5kVG9DbG91ZFdhdGNoTG9nczogZmFsc2UsXG4gICAgICAgICAgY2xvdWRXYXRjaExvZ3NSZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodC5sb2dHcm91cCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBldmVudCBzZWxlY3RvcnMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdhbGwgczMgZXZlbnRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IGNsb3VkVHJhaWwgPSBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJyk7XG4gICAgICAgIGNsb3VkVHJhaWwubG9nQWxsUzNEYXRhRXZlbnRzKCk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgICAgRXZlbnRTZWxlY3RvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRGF0YVJlc291cmNlczogW3tcbiAgICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6T2JqZWN0JyxcbiAgICAgICAgICAgICAgICBWYWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICBJbmNsdWRlTWFuYWdlbWVudEV2ZW50czogTWF0Y2guYWJzZW50KCksXG4gICAgICAgICAgICAgIFJlYWRXcml0ZVR5cGU6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdzcGVjaWZpYyBzMyBidWNrZXRzIGFuZCBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAndGVzdEJ1Y2tldCcsIHsgYnVja2V0TmFtZTogJ3Rlc3QtYnVja2V0JyB9KTtcblxuICAgICAgICBjb25zdCBjbG91ZFRyYWlsID0gbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcpO1xuICAgICAgICBjbG91ZFRyYWlsLmFkZFMzRXZlbnRTZWxlY3RvcihbeyBidWNrZXQgfV0pO1xuICAgICAgICBjbG91ZFRyYWlsLmFkZFMzRXZlbnRTZWxlY3Rvcihbe1xuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICBvYmplY3RQcmVmaXg6ICdwcmVmaXgtMS9wcmVmaXgtMicsXG4gICAgICAgIH1dKTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgICBFdmVudFNlbGVjdG9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBEYXRhUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpPYmplY3QnLFxuICAgICAgICAgICAgICAgIFZhbHVlczogW3tcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWyd0ZXN0QnVja2V0REY0RDdEMUEnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIERhdGFSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0FXUzo6UzM6Ok9iamVjdCcsXG4gICAgICAgICAgICAgICAgVmFsdWVzOiBbe1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ3Rlc3RCdWNrZXRERjREN0QxQScsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgICAgICcvcHJlZml4LTEvcHJlZml4LTInLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ25vIHMzIGV2ZW50IHNlbGVjdG9yIHdoZW4gbGlzdCBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgICAgY29uc3QgY2xvdWRUcmFpbCA9IG5ldyBUcmFpbChzdGFjaywgJ015QW1hemluZ0Nsb3VkVHJhaWwnKTtcbiAgICAgICAgY2xvdWRUcmFpbC5hZGRTM0V2ZW50U2VsZWN0b3IoW10pO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgICBFdmVudFNlbGVjdG9yczogW10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3dpdGggaGFuZC1zcGVjaWZpZWQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgICAgY29uc3QgY2xvdWRUcmFpbCA9IG5ldyBUcmFpbChzdGFjaywgJ015QW1hemluZ0Nsb3VkVHJhaWwnKTtcbiAgICAgICAgY2xvdWRUcmFpbC5sb2dBbGxTM0RhdGFFdmVudHMoeyBpbmNsdWRlTWFuYWdlbWVudEV2ZW50czogZmFsc2UsIHJlYWRXcml0ZVR5cGU6IFJlYWRXcml0ZVR5cGUuUkVBRF9PTkxZIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICAgIEV2ZW50U2VsZWN0b3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIERhdGFSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0FXUzo6UzM6Ok9iamVjdCcsXG4gICAgICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgSW5jbHVkZU1hbmFnZW1lbnRFdmVudHM6IGZhbHNlLFxuICAgICAgICAgICAgICBSZWFkV3JpdGVUeXBlOiAnUmVhZE9ubHknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aXRoIG1hbmFnZW1lbnQgZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHsgbWFuYWdlbWVudEV2ZW50czogUmVhZFdyaXRlVHlwZS5XUklURV9PTkxZIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICAgIEV2ZW50U2VsZWN0b3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEluY2x1ZGVNYW5hZ2VtZW50RXZlbnRzOiB0cnVlLFxuICAgICAgICAgICAgICBSZWFkV3JpdGVUeXBlOiAnV3JpdGVPbmx5JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZXhjbHVkZSBtYW5hZ2VtZW50IGV2ZW50cycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RCdWNrZXQnLCB7IGJ1Y2tldE5hbWU6ICd0ZXN0LWJ1Y2tldCcgfSk7XG4gICAgICAgIGNvbnN0IGNsb3VkVHJhaWwgPSBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJyk7XG4gICAgICAgIGNsb3VkVHJhaWwuYWRkUzNFdmVudFNlbGVjdG9yKFt7IGJ1Y2tldCB9XSwge1xuICAgICAgICAgIGV4Y2x1ZGVNYW5hZ2VtZW50RXZlbnRTb3VyY2VzOiBbXG4gICAgICAgICAgICBNYW5hZ2VtZW50RXZlbnRTb3VyY2VzLktNUyxcbiAgICAgICAgICAgIE1hbmFnZW1lbnRFdmVudFNvdXJjZXMuUkRTX0RBVEFfQVBJLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgICBjbG91ZFRyYWlsLmFkZFMzRXZlbnRTZWxlY3RvcihbeyBidWNrZXQgfV0sIHtcbiAgICAgICAgICBleGNsdWRlTWFuYWdlbWVudEV2ZW50U291cmNlczogW10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICAgIEV2ZW50U2VsZWN0b3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIERhdGFSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0FXUzo6UzM6Ok9iamVjdCcsXG4gICAgICAgICAgICAgICAgVmFsdWVzOiBbe1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ3Rlc3RCdWNrZXRERjREN0QxQScsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICBFeGNsdWRlTWFuYWdlbWVudEV2ZW50U291cmNlczogW1xuICAgICAgICAgICAgICAgICdrbXMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgJ3Jkc2RhdGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBEYXRhUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpPYmplY3QnLFxuICAgICAgICAgICAgICAgIFZhbHVlczogW3tcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWyd0ZXN0QnVja2V0REY0RDdEMUEnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgRXhjbHVkZU1hbmFnZW1lbnRFdmVudFNvdXJjZXM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdmb3IgTGFtYmRhIGZ1bmN0aW9uIGRhdGEgZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0xhbWJkYUZ1bmN0aW9uJywge1xuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICAgIGhhbmRsZXI6ICdoZWxsby5oYW5kbGVyJyxcbiAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSB7fScpLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjbG91ZFRyYWlsID0gbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcpO1xuICAgICAgICBjbG91ZFRyYWlsLmFkZExhbWJkYUV2ZW50U2VsZWN0b3IoW2xhbWJkYUZ1bmN0aW9uXSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgICAgRXZlbnRTZWxlY3RvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRGF0YVJlc291cmNlczogW3tcbiAgICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICBWYWx1ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTGFtYmRhRnVuY3Rpb25CRjIxRTQxRicsICdBcm4nXSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2ZvciBhbGwgTGFtYmRhIGZ1bmN0aW9uIGRhdGEgZXZlbnRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IGNsb3VkVHJhaWwgPSBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJyk7XG4gICAgICAgIGNsb3VkVHJhaWwubG9nQWxsTGFtYmRhRGF0YUV2ZW50cygpO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICAgIEV2ZW50U2VsZWN0b3JzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIERhdGFSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOmxhbWJkYScsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ25vdCBwcm92aWRlZCBhbmQgbWFuYWdlbWVudEV2ZW50cyBzZXQgdG8gTm9uZSB0aHJvd3MgbWlzc2luZyBldmVudCBzZWxlY3RvcnMgZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgICBtYW5hZ2VtZW50RXZlbnRzOiBSZWFkV3JpdGVUeXBlLk5PTkUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgICAgfSkudG9UaHJvd0Vycm9yKC9BdCBsZWFzdCBvbmUgZXZlbnQgc2VsZWN0b3IgbXVzdCBiZSBhZGRlZCB3aGVuIG1hbmFnZW1lbnQgZXZlbnQgcmVjb3JkaW5nIGlzIHNldCB0byBOb25lLyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZGVmYXVsdHMgdG8gbm90IGluY2x1ZGUgbWFuYWdlbWVudCBldmVudHMgd2hlbiBtYW5hZ2VtZW50RXZlbnRzIHNldCB0byBOb25lJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IGNsb3VkVHJhaWwgPSBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJywge1xuICAgICAgICAgIG1hbmFnZW1lbnRFdmVudHM6IFJlYWRXcml0ZVR5cGUuTk9ORSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RCdWNrZXQnLCB7IGJ1Y2tldE5hbWU6ICd0ZXN0LWJ1Y2tldCcgfSk7XG4gICAgICAgIGNsb3VkVHJhaWwuYWRkUzNFdmVudFNlbGVjdG9yKFt7IGJ1Y2tldCB9XSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgICAgRXZlbnRTZWxlY3RvcnM6IFt7XG4gICAgICAgICAgICBEYXRhUmVzb3VyY2VzOiBbe1xuICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6T2JqZWN0JyxcbiAgICAgICAgICAgICAgVmFsdWVzOiBbe1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWyd0ZXN0QnVja2V0REY0RDdEMUEnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgSW5jbHVkZU1hbmFnZW1lbnRFdmVudHM6IGZhbHNlLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdpbmNsdWRlTWFuYWdlbWVudEV2ZW50cyBjYW4gYmUgb3ZlcnJpZGRlbiB3aGVuIG1hbmFnZW1lbnRFdmVudHMgc2V0IHRvIE5vbmUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgICAgY29uc3QgY2xvdWRUcmFpbCA9IG5ldyBUcmFpbChzdGFjaywgJ015QW1hemluZ0Nsb3VkVHJhaWwnLCB7XG4gICAgICAgICAgbWFuYWdlbWVudEV2ZW50czogUmVhZFdyaXRlVHlwZS5OT05FLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAndGVzdEJ1Y2tldCcsIHsgYnVja2V0TmFtZTogJ3Rlc3QtYnVja2V0JyB9KTtcbiAgICAgICAgY2xvdWRUcmFpbC5hZGRTM0V2ZW50U2VsZWN0b3IoW3sgYnVja2V0IH1dLCB7XG4gICAgICAgICAgaW5jbHVkZU1hbmFnZW1lbnRFdmVudHM6IHRydWUsXG4gICAgICAgICAgcmVhZFdyaXRlVHlwZTogUmVhZFdyaXRlVHlwZS5XUklURV9PTkxZLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgICBFdmVudFNlbGVjdG9yczogW3tcbiAgICAgICAgICAgIERhdGFSZXNvdXJjZXM6IFt7XG4gICAgICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpPYmplY3QnLFxuICAgICAgICAgICAgICBWYWx1ZXM6IFt7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ3Rlc3RCdWNrZXRERjREN0QxQScsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBJbmNsdWRlTWFuYWdlbWVudEV2ZW50czogdHJ1ZSxcbiAgICAgICAgICAgIFJlYWRXcml0ZVR5cGU6ICdXcml0ZU9ubHknLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdpc09yZ2FuaXphdGlvblRyYWlsIGlzIHBhc3NlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnT3JnYW5pemF0aW9uVHJhaWwnLCB7XG4gICAgICAgICAgaXNPcmdhbml6YXRpb25UcmFpbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgICAgSXNPcmdhbml6YXRpb25UcmFpbDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaXNPcmdhbml6YXRpb25UcmFpbCBkZWZhdWx0cyB0byBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgICAgICBuZXcgVHJhaWwoc3RhY2ssICdPcmdhbml6YXRpb25UcmFpbCcpO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywgTWF0Y2gub2JqZWN0RXF1YWxzKHtcbiAgICAgICAgICBJc0xvZ2dpbmc6IHRydWUsXG4gICAgICAgICAgUzNCdWNrZXROYW1lOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICAgIEVuYWJsZUxvZ0ZpbGVWYWxpZGF0aW9uOiB0cnVlLFxuICAgICAgICAgIEV2ZW50U2VsZWN0b3JzOiBbXSxcbiAgICAgICAgICBJbmNsdWRlR2xvYmFsU2VydmljZUV2ZW50czogdHJ1ZSxcbiAgICAgICAgICBJc011bHRpUmVnaW9uVHJhaWw6IHRydWUsXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnb25FdmVudCcsICgpID0+IHtcbiAgICB0ZXN0KCdhZGQgYW4gZXZlbnQgcnVsZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBUcmFpbC5vbkV2ZW50KHN0YWNrLCAnRG9FdmVudHMnLCB7XG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBhcm46ICdhcm4nLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgRXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgICAgJ2RldGFpbC10eXBlJzogW1xuICAgICAgICAgICAgJ0FXUyBBUEkgQ2FsbCB2aWEgQ2xvdWRUcmFpbCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFybjogJ2FybicsXG4gICAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdpbnNpZ2h0cyAnLCAoKSA9PiB7XG4gICAgdGVzdCgnbm8gcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgICBuZXcgVHJhaWwoc3RhY2ssICdNeUFtYXppbmdDbG91ZFRyYWlsJywge1xuICAgICAgICBpbnNpZ2h0VHlwZXM6IFtdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgSW5zaWdodFNlbGVjdG9yczogW10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0ZXN0KCdBUEkgQ2FsbCBSYXRlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgaW5zaWdodFR5cGVzOiBbXG4gICAgICAgICAgSW5zaWdodFR5cGUuQVBJX0NBTExfUkFURSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgIEluc2lnaHRTZWxlY3RvcnM6IFt7XG4gICAgICAgICAgSW5zaWdodFR5cGU6ICdBcGlDYWxsUmF0ZUluc2lnaHQnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ0FQSSBFcnJvciBSYXRlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgaW5zaWdodFR5cGVzOiBbXG4gICAgICAgICAgSW5zaWdodFR5cGUuQVBJX0VSUk9SX1JBVEUsXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkVHJhaWw6OlRyYWlsJywge1xuICAgICAgICBJbnNpZ2h0U2VsZWN0b3JzOiBbe1xuICAgICAgICAgIEluc2lnaHRUeXBlOiAnQXBpRXJyb3JSYXRlSW5zaWdodCcsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnZHVwbGljYXRlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgaW5zaWdodFR5cGVzOiBbXG4gICAgICAgICAgSW5zaWdodFR5cGUuQVBJX0NBTExfUkFURSxcbiAgICAgICAgICBJbnNpZ2h0VHlwZS5BUElfQ0FMTF9SQVRFLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFRyYWlsOjpUcmFpbCcsIHtcbiAgICAgICAgSW5zaWdodFNlbGVjdG9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEluc2lnaHRUeXBlOiAnQXBpQ2FsbFJhdGVJbnNpZ2h0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEluc2lnaHRUeXBlOiAnQXBpQ2FsbFJhdGVJbnNpZ2h0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnQUxMIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgICAgbmV3IFRyYWlsKHN0YWNrLCAnTXlBbWF6aW5nQ2xvdWRUcmFpbCcsIHtcbiAgICAgICAgaW5zaWdodFR5cGVzOiBbXG4gICAgICAgICAgSW5zaWdodFR5cGUuQVBJX0NBTExfUkFURSxcbiAgICAgICAgICBJbnNpZ2h0VHlwZS5BUElfRVJST1JfUkFURSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRUcmFpbDo6VHJhaWwnLCB7XG4gICAgICAgIEluc2lnaHRTZWxlY3RvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbnNpZ2h0VHlwZTogJ0FwaUNhbGxSYXRlSW5zaWdodCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbnNpZ2h0VHlwZTogJ0FwaUVycm9yUmF0ZUluc2lnaHQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTsiXX0=