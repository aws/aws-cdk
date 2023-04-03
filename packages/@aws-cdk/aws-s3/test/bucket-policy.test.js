"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const s3 = require("../lib");
// to make it easy to copy & paste from output:
/* eslint-disable quote-props */
describe('bucket policy', () => {
    test('default properties', () => {
        const stack = new core_1.Stack();
        const myBucket = new s3.Bucket(stack, 'MyBucket');
        const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
            bucket: myBucket,
        });
        myBucketPolicy.document.addStatements(new aws_iam_1.PolicyStatement({
            resources: [myBucket.bucketArn],
            actions: ['s3:GetObject*'],
            principals: [new aws_iam_1.AnyPrincipal()],
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            Bucket: {
                'Ref': 'MyBucketF68F3FF0',
            },
            PolicyDocument: {
                'Version': '2012-10-17',
                'Statement': [
                    {
                        'Action': 's3:GetObject*',
                        'Effect': 'Allow',
                        'Principal': { AWS: '*' },
                        'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                    },
                ],
            },
        });
    });
    test('when specifying a removalPolicy at creation', () => {
        const stack = new core_1.Stack();
        const myBucket = new s3.Bucket(stack, 'MyBucket');
        const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
            bucket: myBucket,
            removalPolicy: core_1.RemovalPolicy.RETAIN,
        });
        myBucketPolicy.document.addStatements(new aws_iam_1.PolicyStatement({
            resources: [myBucket.bucketArn],
            actions: ['s3:GetObject*'],
            principals: [new aws_iam_1.AnyPrincipal()],
        }));
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyBucketF68F3FF0': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'MyBucketPolicy0AFEFDBE': {
                    'Type': 'AWS::S3::BucketPolicy',
                    'Properties': {
                        'Bucket': {
                            'Ref': 'MyBucketF68F3FF0',
                        },
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 's3:GetObject*',
                                    'Effect': 'Allow',
                                    'Principal': { AWS: '*' },
                                    'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
            },
        });
    });
    test('when specifying a removalPolicy after creation', () => {
        const stack = new core_1.Stack();
        const myBucket = new s3.Bucket(stack, 'MyBucket');
        myBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            resources: [myBucket.bucketArn],
            actions: ['s3:GetObject*'],
            principals: [new aws_iam_1.AnyPrincipal()],
        }));
        myBucket.policy?.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN);
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyBucketF68F3FF0': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'MyBucketPolicyE7FBAC7B': {
                    'Type': 'AWS::S3::BucketPolicy',
                    'Properties': {
                        'Bucket': {
                            'Ref': 'MyBucketF68F3FF0',
                        },
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 's3:GetObject*',
                                    'Effect': 'Allow',
                                    'Principal': { AWS: '*' },
                                    'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
            },
        });
    });
    test('fails if bucket policy has no actions', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const myBucket = new s3.Bucket(stack, 'MyBucket');
        myBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            resources: [myBucket.bucketArn],
            principals: [new aws_iam_1.AnyPrincipal()],
        }));
        expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
    });
    test('fails if bucket policy has no IAM principals', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const myBucket = new s3.Bucket(stack, 'MyBucket');
        myBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            resources: [myBucket.bucketArn],
            actions: ['s3:GetObject*'],
        }));
        expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
    });
    describe('fromCfnBucketPolicy()', () => {
        const stack = new core_1.Stack();
        test('correctly extracts the Document and Bucket from the L1', () => {
            const cfnBucket = new s3.CfnBucket(stack, 'CfnBucket');
            const cfnBucketPolicy = bucketPolicyForBucketNamed(cfnBucket.ref);
            const bucketPolicy = s3.BucketPolicy.fromCfnBucketPolicy(cfnBucketPolicy);
            expect(bucketPolicy.document).not.toBeUndefined();
            expect(bucketPolicy.document.isEmpty).toBeFalsy();
            expect(bucketPolicy.bucket).not.toBeUndefined();
            expect(bucketPolicy.bucket.policy).not.toBeUndefined();
            expect(bucketPolicy.bucket.policy?.document.isEmpty).toBeFalsy();
        });
        test('correctly references a bucket by name', () => {
            const cfnBucketPolicy = bucketPolicyForBucketNamed('hardcoded-name');
            const bucketPolicy = s3.BucketPolicy.fromCfnBucketPolicy(cfnBucketPolicy);
            expect(bucketPolicy.bucket).not.toBeUndefined();
            expect(bucketPolicy.bucket.bucketName).toBe('hardcoded-name');
        });
        function bucketPolicyForBucketNamed(name) {
            return new s3.CfnBucketPolicy(stack, `CfnBucketPolicy-${name}`, {
                policyDocument: {
                    'Statement': [
                        {
                            'Action': 's3:*',
                            'Effect': 'Deny',
                            'Principal': {
                                'AWS': '*',
                            },
                            'Resource': '*',
                        },
                    ],
                    'Version': '2012-10-17',
                },
                bucket: name,
            });
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXBvbGljeS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVja2V0LXBvbGljeS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUFpRTtBQUNqRSx3Q0FBMEQ7QUFDMUQsNkJBQTZCO0FBRzdCLCtDQUErQztBQUMvQyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUNsRSxNQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDeEQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUMvQixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDMUIsVUFBVSxFQUFFLENBQUMsSUFBSSxzQkFBWSxFQUFFLENBQUM7U0FDakMsQ0FBQyxDQUFDLENBQUM7UUFFSixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RSxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtZQUNELGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUUsWUFBWTtnQkFDdkIsV0FBVyxFQUFFO29CQUNYO3dCQUNFLFFBQVEsRUFBRSxlQUFlO3dCQUN6QixRQUFRLEVBQUUsT0FBTzt3QkFDakIsV0FBVyxF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QUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBbnlQcmluY2lwYWwsIFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIEFwcCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IENmbkJ1Y2tldFBvbGljeSB9IGZyb20gJy4uL2xpYic7XG5cbi8vIHRvIG1ha2UgaXQgZWFzeSB0byBjb3B5ICYgcGFzdGUgZnJvbSBvdXRwdXQ6XG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnYnVja2V0IHBvbGljeScsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBteUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IG15QnVja2V0UG9saWN5ID0gbmV3IHMzLkJ1Y2tldFBvbGljeShzdGFjaywgJ015QnVja2V0UG9saWN5Jywge1xuICAgICAgYnVja2V0OiBteUJ1Y2tldCxcbiAgICB9KTtcbiAgICBteUJ1Y2tldFBvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbbXlCdWNrZXQuYnVja2V0QXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0KiddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBBbnlQcmluY2lwYWwoKV0sXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgIEJ1Y2tldDoge1xuICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gc3BlY2lmeWluZyBhIHJlbW92YWxQb2xpY3kgYXQgY3JlYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IG15QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3QgbXlCdWNrZXRQb2xpY3kgPSBuZXcgczMuQnVja2V0UG9saWN5KHN0YWNrLCAnTXlCdWNrZXRQb2xpY3knLCB7XG4gICAgICBidWNrZXQ6IG15QnVja2V0LFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgfSk7XG4gICAgbXlCdWNrZXRQb2xpY3kuZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW215QnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdConXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgQW55UHJpbmNpcGFsKCldLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ015QnVja2V0UG9saWN5MEFGRUZEQkUnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0UG9saWN5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdCdWNrZXQnOiB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gc3BlY2lmeWluZyBhIHJlbW92YWxQb2xpY3kgYWZ0ZXIgY3JlYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IG15QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgbXlCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW215QnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdConXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgQW55UHJpbmNpcGFsKCldLFxuICAgIH0pKTtcbiAgICBteUJ1Y2tldC5wb2xpY3k/LmFwcGx5UmVtb3ZhbFBvbGljeShSZW1vdmFsUG9saWN5LlJFVEFJTik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICAgICdNeUJ1Y2tldFBvbGljeUU3RkJBQzdCJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQnVja2V0Jzoge1xuICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBidWNrZXQgcG9saWN5IGhhcyBubyBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IG15QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgbXlCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW215QnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IEFueVByaW5jaXBhbCgpXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBidWNrZXQgcG9saWN5IGhhcyBubyBJQU0gcHJpbmNpcGFscycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgICBjb25zdCBteUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIG15QnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFtteUJ1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QqJ10sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGEgcmVzb3VyY2UtYmFzZWQgcG9saWN5IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgSUFNIHByaW5jaXBhbC8pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZnJvbUNmbkJ1Y2tldFBvbGljeSgpJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgZXh0cmFjdHMgdGhlIERvY3VtZW50IGFuZCBCdWNrZXQgZnJvbSB0aGUgTDEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjZm5CdWNrZXQgPSBuZXcgczMuQ2ZuQnVja2V0KHN0YWNrLCAnQ2ZuQnVja2V0Jyk7XG4gICAgICBjb25zdCBjZm5CdWNrZXRQb2xpY3kgPSBidWNrZXRQb2xpY3lGb3JCdWNrZXROYW1lZChjZm5CdWNrZXQucmVmKTtcbiAgICAgIGNvbnN0IGJ1Y2tldFBvbGljeSA9IHMzLkJ1Y2tldFBvbGljeS5mcm9tQ2ZuQnVja2V0UG9saWN5KGNmbkJ1Y2tldFBvbGljeSk7XG5cbiAgICAgIGV4cGVjdChidWNrZXRQb2xpY3kuZG9jdW1lbnQpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG4gICAgICBleHBlY3QoYnVja2V0UG9saWN5LmRvY3VtZW50LmlzRW1wdHkpLnRvQmVGYWxzeSgpO1xuXG4gICAgICBleHBlY3QoYnVja2V0UG9saWN5LmJ1Y2tldCkubm90LnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIGV4cGVjdChidWNrZXRQb2xpY3kuYnVja2V0LnBvbGljeSkubm90LnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIGV4cGVjdChidWNrZXRQb2xpY3kuYnVja2V0LnBvbGljeT8uZG9jdW1lbnQuaXNFbXB0eSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgcmVmZXJlbmNlcyBhIGJ1Y2tldCBieSBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2ZuQnVja2V0UG9saWN5ID0gYnVja2V0UG9saWN5Rm9yQnVja2V0TmFtZWQoJ2hhcmRjb2RlZC1uYW1lJyk7XG4gICAgICBjb25zdCBidWNrZXRQb2xpY3kgPSBzMy5CdWNrZXRQb2xpY3kuZnJvbUNmbkJ1Y2tldFBvbGljeShjZm5CdWNrZXRQb2xpY3kpO1xuXG4gICAgICBleHBlY3QoYnVja2V0UG9saWN5LmJ1Y2tldCkubm90LnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIGV4cGVjdChidWNrZXRQb2xpY3kuYnVja2V0LmJ1Y2tldE5hbWUpLnRvQmUoJ2hhcmRjb2RlZC1uYW1lJyk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBidWNrZXRQb2xpY3lGb3JCdWNrZXROYW1lZChuYW1lOiBzdHJpbmcpOiBDZm5CdWNrZXRQb2xpY3kge1xuICAgICAgcmV0dXJuIG5ldyBzMy5DZm5CdWNrZXRQb2xpY3koc3RhY2ssIGBDZm5CdWNrZXRQb2xpY3ktJHtuYW1lfWAsIHtcbiAgICAgICAgcG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ3MzOionLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0RlbnknLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICdBV1MnOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgYnVja2V0OiBuYW1lLFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19