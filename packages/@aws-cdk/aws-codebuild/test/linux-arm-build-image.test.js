"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ecr = require("@aws-cdk/aws-ecr");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
describe('Linux ARM build image', () => {
    describe('AMAZON_LINUX_2_STANDARD_1_0', () => {
        test('has type ARM_CONTAINER and default ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('can be used with ComputeType SMALL', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.SMALL,
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType MEDIUM', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
                        computeType: codebuild.ComputeType.MEDIUM,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_MEDIUM' was given/);
        });
        test('can be used with ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.LARGE,
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType X2_LARGE', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0,
                        computeType: codebuild.ComputeType.X2_LARGE,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_2XLARGE' was given/);
        });
    });
    describe('AMAZON_LINUX_2_STANDARD_2_0', () => {
        test('has type ARM_CONTAINER and default ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('can be used with ComputeType SMALL', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.SMALL,
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType MEDIUM', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                        computeType: codebuild.ComputeType.MEDIUM,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_MEDIUM' was given/);
        });
        test('can be used with ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.LARGE,
                    buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    Type: 'ARM_CONTAINER',
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType X2_LARGE', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
                        computeType: codebuild.ComputeType.X2_LARGE,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_2XLARGE' was given/);
        });
    });
    describe('ECR Repository', () => {
        test('allows creating a build image from a new ECR repository', () => {
            const stack = new cdk.Stack();
            const repository = new ecr.Repository(stack, 'my-repo');
            new codebuild.Project(stack, 'Project', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        build: { commands: ['ls'] },
                    },
                }),
                environment: {
                    buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository, 'v1'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                    Image: {
                        'Fn::Join': ['', [
                                {
                                    'Fn::Select': [4, {
                                            'Fn::Split': [':', {
                                                    'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
                                                }],
                                        }],
                                },
                                '.dkr.ecr.',
                                {
                                    'Fn::Select': [3, {
                                            'Fn::Split': [':', {
                                                    'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
                                                }],
                                        }],
                                },
                                '.',
                                { Ref: 'AWS::URLSuffix' },
                                '/',
                                { Ref: 'myrepo5DFA62E5' },
                                ':v1',
                            ]],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            Resource: {
                                'Fn::GetAtt': ['myrepo5DFA62E5', 'Arn'],
                            },
                        })]),
                },
            });
        });
        test('allows creating a build image from an existing ECR repository', () => {
            const stack = new cdk.Stack();
            const repository = ecr.Repository.fromRepositoryName(stack, 'my-imported-repo', 'test-repo');
            new codebuild.Project(stack, 'Project', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        build: { commands: ['ls'] },
                    },
                }),
                environment: {
                    buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                    Image: {
                        'Fn::Join': ['', [
                                { Ref: 'AWS::AccountId' },
                                '.dkr.ecr.',
                                { Ref: 'AWS::Region' },
                                '.',
                                { Ref: 'AWS::URLSuffix' },
                                '/test-repo:latest',
                            ]],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            Resource: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':ecr:',
                                        { Ref: 'AWS::Region' },
                                        ':',
                                        { Ref: 'AWS::AccountId' },
                                        ':repository/test-repo',
                                    ]],
                            },
                        })]),
                },
            });
        });
        test('allows creating a build image from an existing cross-account ECR repository', () => {
            const stack = new cdk.Stack();
            const repository = ecr.Repository.fromRepositoryArn(stack, 'my-cross-acount-repo', 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
            new codebuild.Project(stack, 'Project', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        build: { commands: ['ls'] },
                    },
                }),
                environment: {
                    buildImage: codebuild.LinuxArmBuildImage.fromEcrRepository(repository),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                    Image: {
                        'Fn::Join': ['', [
                                '585695036304.dkr.ecr.us-east-1.',
                                { Ref: 'AWS::URLSuffix' },
                                '/foo/bar/foo/fooo:latest',
                            ]],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            Resource: 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo',
                        })]),
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXgtYXJtLWJ1aWxkLWltYWdlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaW51eC1hcm0tYnVpbGQtaW1hZ2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDM0MsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtnQkFDOUMsV0FBVyxFQUFFO29CQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCO2lCQUNyRTthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLFdBQVcsRUFBRSxzQkFBc0I7aUJBQ3BDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO2dCQUM5QyxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSztvQkFDeEMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQywyQkFBMkI7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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0xpbnV4IEFSTSBidWlsZCBpbWFnZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0FNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzFfMCcsICgpID0+IHtcbiAgICB0ZXN0KCdoYXMgdHlwZSBBUk1fQ09OVEFJTkVSIGFuZCBkZWZhdWx0IENvbXB1dGVUeXBlIExBUkdFJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8xXzAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFR5cGU6ICdBUk1fQ09OVEFJTkVSJyxcbiAgICAgICAgICBDb21wdXRlVHlwZTogJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHVzZWQgd2l0aCBDb21wdXRlVHlwZSBTTUFMTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuU01BTEwsXG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8xXzAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFR5cGU6ICdBUk1fQ09OVEFJTkVSJyxcbiAgICAgICAgICBDb21wdXRlVHlwZTogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2Fubm90IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBDb21wdXRlVHlwZSBNRURJVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhBcm1CdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzFfMCxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuTUVESVVNLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQVJNIGltYWdlcyBvbmx5IHN1cHBvcnQgQ29tcHV0ZVR5cGVzICdCVUlMRF9HRU5FUkFMMV9TTUFMTCcgYW5kICdCVUlMRF9HRU5FUkFMMV9MQVJHRScgLSAnQlVJTERfR0VORVJBTDFfTUVESVVNJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSB1c2VkIHdpdGggQ29tcHV0ZVR5cGUgTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLkxBUkdFLFxuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEFybUJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfU1RBTkRBUkRfMV8wLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVJNX0NPTlRBSU5FUicsXG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggQ29tcHV0ZVR5cGUgWDJfTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhBcm1CdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzFfMCxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuWDJfTEFSR0UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9BUk0gaW1hZ2VzIG9ubHkgc3VwcG9ydCBDb21wdXRlVHlwZXMgJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyBhbmQgJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyAtICdCVUlMRF9HRU5FUkFMMV8yWExBUkdFJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzJfMCcsICgpID0+IHtcbiAgICB0ZXN0KCdoYXMgdHlwZSBBUk1fQ09OVEFJTkVSIGFuZCBkZWZhdWx0IENvbXB1dGVUeXBlIExBUkdFJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8yXzAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFR5cGU6ICdBUk1fQ09OVEFJTkVSJyxcbiAgICAgICAgICBDb21wdXRlVHlwZTogJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHVzZWQgd2l0aCBDb21wdXRlVHlwZSBTTUFMTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuU01BTEwsXG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8yXzAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFR5cGU6ICdBUk1fQ09OVEFJTkVSJyxcbiAgICAgICAgICBDb21wdXRlVHlwZTogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2Fubm90IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBDb21wdXRlVHlwZSBNRURJVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhBcm1CdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzJfMCxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuTUVESVVNLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQVJNIGltYWdlcyBvbmx5IHN1cHBvcnQgQ29tcHV0ZVR5cGVzICdCVUlMRF9HRU5FUkFMMV9TTUFMTCcgYW5kICdCVUlMRF9HRU5FUkFMMV9MQVJHRScgLSAnQlVJTERfR0VORVJBTDFfTUVESVVNJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSB1c2VkIHdpdGggQ29tcHV0ZVR5cGUgTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLkxBUkdFLFxuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEFybUJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfU1RBTkRBUkRfMl8wLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBUeXBlOiAnQVJNX0NPTlRBSU5FUicsXG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggQ29tcHV0ZVR5cGUgWDJfTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhBcm1CdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzJfMCxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuWDJfTEFSR0UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9BUk0gaW1hZ2VzIG9ubHkgc3VwcG9ydCBDb21wdXRlVHlwZXMgJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyBhbmQgJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyAtICdCVUlMRF9HRU5FUkFMMV8yWExBUkdFJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0VDUiBSZXBvc2l0b3J5JywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBjcmVhdGluZyBhIGJ1aWxkIGltYWdlIGZyb20gYSBuZXcgRUNSIHJlcG9zaXRvcnknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgcmVwb3NpdG9yeSA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ215LXJlcG8nKTtcblxuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICAgIHBoYXNlczoge1xuICAgICAgICAgICAgYnVpbGQ6IHsgY29tbWFuZHM6IFsnbHMnXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEFybUJ1aWxkSW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkocmVwb3NpdG9yeSwgJ3YxJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIENvbXB1dGVUeXBlOiAnQlVJTERfR0VORVJBTDFfTEFSR0UnLFxuICAgICAgICAgIEltYWdlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogWzQsIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbJzonLCB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteXJlcG81REZBNjJFNScsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogWzMsIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbJzonLCB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteXJlcG81REZBNjJFNScsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdteXJlcG81REZBNjJFNScgfSxcbiAgICAgICAgICAgICAgJzp2MScsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eScsXG4gICAgICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgICAgICdlY3I6QmF0Y2hHZXRJbWFnZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215cmVwbzVERkE2MkU1JywgJ0FybiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgY3JlYXRpbmcgYSBidWlsZCBpbWFnZSBmcm9tIGFuIGV4aXN0aW5nIEVDUiByZXBvc2l0b3J5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoc3RhY2ssICdteS1pbXBvcnRlZC1yZXBvJywgJ3Rlc3QtcmVwbycpO1xuXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICBidWlsZDogeyBjb21tYW5kczogWydscyddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShyZXBvc2l0b3J5KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnL3Rlc3QtcmVwbzpsYXRlc3QnLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6ZWNyOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAnOnJlcG9zaXRvcnkvdGVzdC1yZXBvJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBjcmVhdGluZyBhIGJ1aWxkIGltYWdlIGZyb20gYW4gZXhpc3RpbmcgY3Jvc3MtYWNjb3VudCBFQ1IgcmVwb3NpdG9yeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCByZXBvc2l0b3J5ID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBcm4oc3RhY2ssICdteS1jcm9zcy1hY291bnQtcmVwbycsICdhcm46YXdzOmVjcjp1cy1lYXN0LTE6NTg1Njk1MDM2MzA0OnJlcG9zaXRvcnkvZm9vL2Jhci9mb28vZm9vbycpO1xuXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICBidWlsZDogeyBjb21tYW5kczogWydscyddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QXJtQnVpbGRJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShyZXBvc2l0b3J5KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAnNTg1Njk1MDM2MzA0LmRrci5lY3IudXMtZWFzdC0xLicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sXG4gICAgICAgICAgICAgICcvZm9vL2Jhci9mb28vZm9vbzpsYXRlc3QnLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnYXJuOmF3czplY3I6dXMtZWFzdC0xOjU4NTY5NTAzNjMwNDpyZXBvc2l0b3J5L2Zvby9iYXIvZm9vL2Zvb28nLFxuICAgICAgICAgIH0pXSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==