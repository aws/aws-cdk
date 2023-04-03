"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('S3 Deploy Action', () => {
    test('by default extract artifacts', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                    'Actions': [
                        {
                            'Name': 'Source',
                            'ActionTypeId': {
                                'Category': 'Source',
                                'Owner': 'ThirdParty',
                            },
                        },
                    ],
                },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Provider': 'S3',
                            },
                            'Configuration': {
                                'Extract': 'true',
                            },
                            'Name': 'CopyFiles',
                        },
                    ],
                },
            ],
        });
    });
    test('grant the pipeline correct access to the target bucket', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Effect': 'Allow',
                        'Action': [
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
                    },
                    {},
                    {
                        'Effect': 'Allow',
                        'Action': 'sts:AssumeRole',
                    },
                ],
            },
        });
    });
    test('kebab-case CannedACL value', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack, {
            accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {},
                {
                    'Actions': [
                        {
                            'Configuration': {
                                'CannedACL': 'public-read-write',
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('allow customizing cache-control', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack, {
            cacheControl: [
                cpactions.CacheControl.setPublic(),
                cpactions.CacheControl.maxAge(core_1.Duration.hours(12)),
                cpactions.CacheControl.sMaxAge(core_1.Duration.hours(12)),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {},
                {
                    'Actions': [
                        {
                            'Configuration': {
                                'CacheControl': 'public, max-age=43200, s-maxage=43200',
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('allow customizing objectKey (deployment path on S3)', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack, {
            objectKey: '/a/b/c',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {},
                {
                    'Actions': [
                        {
                            'Configuration': {
                                'ObjectKey': '/a/b/c',
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('correctly makes the action cross-region for a Bucket imported with a different region', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'PipelineStack', {
            env: { account: '123456789012', region: 'us-west-2' },
        });
        const deployBucket = s3.Bucket.fromBucketAttributes(stack, 'DeployBucket', {
            bucketName: 'my-deploy-bucket',
            region: 'ap-southeast-1',
        });
        minimalPipeline(stack, {
            bucket: deployBucket,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: [
                {},
                {
                    Name: 'Deploy',
                    Actions: [
                        {
                            Name: 'CopyFiles',
                            Region: 'ap-southeast-1',
                        },
                    ],
                },
            ],
        });
    });
    test('KMSEncryptionKeyARN value', () => {
        const stack = new core_1.Stack();
        minimalPipeline(stack);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {},
                {
                    'Actions': [
                        {
                            'Configuration': {
                                'KMSEncryptionKeyARN': assertions_1.Match.anyValue(),
                            },
                        },
                    ],
                },
            ],
        });
    });
});
function minimalPipeline(stack, options = {}) {
    const key = new kms.Key(stack, 'EnvVarEncryptKey', {
        description: 'sample key',
    });
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source',
        owner: 'aws',
        repo: 'aws-cdk',
        output: sourceOutput,
        oauthToken: core_1.SecretValue.unsafePlainText('secret'),
    });
    const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [sourceAction],
            },
        ],
    });
    const deploymentStage = pipeline.addStage({
        stageName: 'Deploy',
        actions: [
            new cpactions.S3DeployAction({
                accessControl: options.accessControl,
                actionName: 'CopyFiles',
                bucket: options.bucket || new s3.Bucket(stack, 'MyBucket'),
                cacheControl: options.cacheControl,
                extract: options.extract,
                input: sourceOutput,
                objectKey: options.objectKey,
                encryptionKey: key,
            }),
        ],
    });
    return deploymentStage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtZGVwbG95LWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtZGVwbG95LWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELDBEQUEwRDtBQUMxRCx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHdDQUFrRTtBQUNsRSx1Q0FBdUM7QUFFdkMsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUM3RSxRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxNQUFNLEVBQUUsUUFBUTs0QkFDaEIsY0FBYyxFQUFFO2dDQUNkLFVBQVUsRUFBRSxRQUFRO2dDQUNwQixPQUFPLEVBQUUsWUFBWTs2QkFDdEI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxjQUFjLEVBQUU7Z0NBQ2QsVUFBVSxFQUFFLFFBQVE7Z0NBQ3BCLFVBQVUsRUFBRSxJQUFJOzZCQUNqQjs0QkFDRCxlQUFlLEVBQUU7Z0NBQ2YsU0FBUyxFQUFFLE1BQU07NkJBQ2xCOzRCQUNELE1BQU0sRUFBRSxXQUFXO3lCQUNwQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLE1BQU0sS0FBSyxHQUFH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Q2xDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDeEIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztnQkFDNUIsYUFBYSxFQUFFLEdBQUc7YUFDbkIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxlQUFlLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFNlY3JldFZhbHVlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdTMyBEZXBsb3kgQWN0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdieSBkZWZhdWx0IGV4dHJhY3QgYXJ0aWZhY3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgICAnQ2F0ZWdvcnknOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICAnT3duZXInOiAnVGhpcmRQYXJ0eScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uVHlwZUlkJzoge1xuICAgICAgICAgICAgICAgICdDYXRlZ29yeSc6ICdEZXBsb3knLFxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6ICdTMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICdFeHRyYWN0JzogJ3RydWUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnTmFtZSc6ICdDb3B5RmlsZXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgdGhlIHBpcGVsaW5lIGNvcnJlY3QgYWNjZXNzIHRvIHRoZSB0YXJnZXQgYnVja2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdrZWJhYi1jYXNlIENhbm5lZEFDTCB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG1pbmltYWxQaXBlbGluZShzdGFjaywge1xuICAgICAgYWNjZXNzQ29udHJvbDogczMuQnVja2V0QWNjZXNzQ29udHJvbC5QVUJMSUNfUkVBRF9XUklURSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnQ2FubmVkQUNMJzogJ3B1YmxpYy1yZWFkLXdyaXRlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IGN1c3RvbWl6aW5nIGNhY2hlLWNvbnRyb2wnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgIGNhY2hlQ29udHJvbDogW1xuICAgICAgICBjcGFjdGlvbnMuQ2FjaGVDb250cm9sLnNldFB1YmxpYygpLFxuICAgICAgICBjcGFjdGlvbnMuQ2FjaGVDb250cm9sLm1heEFnZShEdXJhdGlvbi5ob3VycygxMikpLFxuICAgICAgICBjcGFjdGlvbnMuQ2FjaGVDb250cm9sLnNNYXhBZ2UoRHVyYXRpb24uaG91cnMoMTIpKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0NhY2hlQ29udHJvbCc6ICdwdWJsaWMsIG1heC1hZ2U9NDMyMDAsIHMtbWF4YWdlPTQzMjAwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IGN1c3RvbWl6aW5nIG9iamVjdEtleSAoZGVwbG95bWVudCBwYXRoIG9uIFMzKScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG1pbmltYWxQaXBlbGluZShzdGFjaywge1xuICAgICAgb2JqZWN0S2V5OiAnL2EvYi9jJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnT2JqZWN0S2V5JzogJy9hL2IvYycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgbWFrZXMgdGhlIGFjdGlvbiBjcm9zcy1yZWdpb24gZm9yIGEgQnVja2V0IGltcG9ydGVkIHdpdGggYSBkaWZmZXJlbnQgcmVnaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy13ZXN0LTInIH0sXG4gICAgfSk7XG4gICAgY29uc3QgZGVwbG95QnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnRGVwbG95QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogJ215LWRlcGxveS1idWNrZXQnLFxuICAgICAgcmVnaW9uOiAnYXAtc291dGhlYXN0LTEnLFxuICAgIH0pO1xuXG4gICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICBidWNrZXQ6IGRlcGxveUJ1Y2tldCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICBTdGFnZXM6IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICBOYW1lOiAnRGVwbG95JyxcbiAgICAgICAgICBBY3Rpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdDb3B5RmlsZXMnLFxuICAgICAgICAgICAgICBSZWdpb246ICdhcC1zb3V0aGVhc3QtMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdLTVNFbmNyeXB0aW9uS2V5QVJOIHZhbHVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnS01TRW5jcnlwdGlvbktleUFSTic6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5pbnRlcmZhY2UgTWluaW1hbFBpcGVsaW5lT3B0aW9ucyB7XG4gIHJlYWRvbmx5IGFjY2Vzc0NvbnRyb2w/OiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sO1xuICByZWFkb25seSBidWNrZXQ/OiBzMy5JQnVja2V0O1xuICByZWFkb25seSBjYWNoZUNvbnRyb2w/OiBjcGFjdGlvbnMuQ2FjaGVDb250cm9sW107XG4gIHJlYWRvbmx5IGV4dHJhY3Q/OiBib29sZWFuO1xuICByZWFkb25seSBvYmplY3RLZXk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIG1pbmltYWxQaXBlbGluZShzdGFjazogU3RhY2ssIG9wdGlvbnM6IE1pbmltYWxQaXBlbGluZU9wdGlvbnMgPSB7fSk6IGNvZGVwaXBlbGluZS5JU3RhZ2Uge1xuICBjb25zdCBrZXk6IGttcy5JS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdFbnZWYXJFbmNyeXB0S2V5Jywge1xuICAgIGRlc2NyaXB0aW9uOiAnc2FtcGxlIGtleScsXG4gIH0pO1xuICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gIGNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICBvd25lcjogJ2F3cycsXG4gICAgcmVwbzogJ2F3cy1jZGsnLFxuICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gIH0pO1xuXG4gIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ015UGlwZWxpbmUnLCB7XG4gICAgc3RhZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcblxuICBjb25zdCBkZXBsb3ltZW50U3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgICBhY3Rpb25zOiBbXG4gICAgICBuZXcgY3BhY3Rpb25zLlMzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgYWNjZXNzQ29udHJvbDogb3B0aW9ucy5hY2Nlc3NDb250cm9sLFxuICAgICAgICBhY3Rpb25OYW1lOiAnQ29weUZpbGVzJyxcbiAgICAgICAgYnVja2V0OiBvcHRpb25zLmJ1Y2tldCB8fCBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgICAgY2FjaGVDb250cm9sOiBvcHRpb25zLmNhY2hlQ29udHJvbCxcbiAgICAgICAgZXh0cmFjdDogb3B0aW9ucy5leHRyYWN0LFxuICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICBvYmplY3RLZXk6IG9wdGlvbnMub2JqZWN0S2V5LFxuICAgICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgICB9KSxcbiAgICBdLFxuICB9KTtcblxuICByZXR1cm4gZGVwbG95bWVudFN0YWdlO1xufVxuIl19