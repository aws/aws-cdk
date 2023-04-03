"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ecr = require("@aws-cdk/aws-ecr");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
describe('Linux GPU build image', () => {
    describe('AWS Deep Learning Container images', () => {
        test('allows passing the account that the repository of the image is hosted in', () => {
            const stack = new cdk.Stack();
            new codebuild.Project(stack, 'Project', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        build: { commands: ['ls'] },
                    },
                }),
                environment: {
                    buildImage: codebuild.LinuxGpuBuildImage.awsDeepLearningContainersImage('my-repo', 'my-tag', '123456789012'),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                    Image: {
                        'Fn::Join': ['', [
                                '123456789012.dkr.ecr.',
                                { Ref: 'AWS::Region' },
                                '.',
                                { Ref: 'AWS::URLSuffix' },
                                '/my-repo:my-tag',
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
                                        ':123456789012:repository/my-repo',
                                    ]],
                            },
                        })]),
                },
            });
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
                    buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository, 'v1'),
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
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':ecr:',
                                        { Ref: 'AWS::Region' },
                                        ':',
                                        { Ref: 'AWS::AccountId' },
                                        ':repository/',
                                        { Ref: 'myrepo5DFA62E5' },
                                    ]],
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
                    buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository),
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
                    buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_LARGE',
                    Image: {
                        'Fn::Join': ['', [
                                '585695036304.dkr.ecr.',
                                { Ref: 'AWS::Region' },
                                '.',
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
                            Resource: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':ecr:',
                                        { Ref: 'AWS::Region' },
                                        ':585695036304:repository/foo/bar/foo/fooo',
                                    ]],
                            },
                        })]),
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludXgtZ3B1LWJ1aWxkLWltYWdlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaW51eC1ncHUtYnVpbGQtaW1hZ2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsSUFBSSxDQUFDLDBFQUEwRSxFQUFFLEdBQUcsRUFBRTtZQUNwRixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtnQkFDdEMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO29CQUN4QyxPQUFPLEVBQUUsS0FBSztvQkFDZCxNQUFNLEVBQUU7d0JBQ04sS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7cUJBQzVCO2lCQUNGLENBQUM7Z0JBQ0YsV0FBVyxFQUFFO29CQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsOEJBQThCLENBQ3JFLFNBQVMsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDO2lCQUN2QzthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLHNCQUFzQjtvQkFDbkMsS0FBSyxFQUFFO3dCQUNMLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDZix1QkFBdUI7Z0NBQ3ZCLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTtnQ0FDdEIsR0FBRztnQ0FDSCxFQUFFLEdB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IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWNyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3InO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdMaW51eCBHUFUgYnVpbGQgaW1hZ2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdBV1MgRGVlcCBMZWFybmluZyBDb250YWluZXIgaW1hZ2VzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FsbG93cyBwYXNzaW5nIHRoZSBhY2NvdW50IHRoYXQgdGhlIHJlcG9zaXRvcnkgb2YgdGhlIGltYWdlIGlzIGhvc3RlZCBpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICBidWlsZDogeyBjb21tYW5kczogWydscyddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4R3B1QnVpbGRJbWFnZS5hd3NEZWVwTGVhcm5pbmdDb250YWluZXJzSW1hZ2UoXG4gICAgICAgICAgICAnbXktcmVwbycsICdteS10YWcnLCAnMTIzNDU2Nzg5MDEyJyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIENvbXB1dGVUeXBlOiAnQlVJTERfR0VORVJBTDFfTEFSR0UnLFxuICAgICAgICAgIEltYWdlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJzEyMzQ1Njc4OTAxMi5ka3IuZWNyLicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSxcbiAgICAgICAgICAgICAgJy9teS1yZXBvOm15LXRhZycsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eScsXG4gICAgICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgICAgICdlY3I6QmF0Y2hHZXRJbWFnZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgJzplY3I6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICc6MTIzNDU2Nzg5MDEyOnJlcG9zaXRvcnkvbXktcmVwbycsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdFQ1IgUmVwb3NpdG9yeScsICgpID0+IHtcbiAgICB0ZXN0KCdhbGxvd3MgY3JlYXRpbmcgYSBidWlsZCBpbWFnZSBmcm9tIGEgbmV3IEVDUiByZXBvc2l0b3J5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdteS1yZXBvJyk7XG5cbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgIGJ1aWxkOiB7IGNvbW1hbmRzOiBbJ2xzJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhHcHVCdWlsZEltYWdlLmZyb21FY3JSZXBvc2l0b3J5KHJlcG9zaXRvcnksICd2MScpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBDb21wdXRlVHlwZTogJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyxcbiAgICAgICAgICBJbWFnZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdteXJlcG81REZBNjJFNScgfSxcbiAgICAgICAgICAgICAgJzp2MScsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eScsXG4gICAgICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgICAgICdlY3I6QmF0Y2hHZXRJbWFnZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgJzplY3I6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICc6cmVwb3NpdG9yeS8nLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnbXlyZXBvNURGQTYyRTUnIH0sXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgY3JlYXRpbmcgYSBidWlsZCBpbWFnZSBmcm9tIGFuIGV4aXN0aW5nIEVDUiByZXBvc2l0b3J5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoc3RhY2ssICdteS1pbXBvcnRlZC1yZXBvJywgJ3Rlc3QtcmVwbycpO1xuXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICBidWlsZDogeyBjb21tYW5kczogWydscyddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4R3B1QnVpbGRJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShyZXBvc2l0b3J5KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAnLmRrci5lY3IuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnL3Rlc3QtcmVwbzpsYXRlc3QnLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6ZWNyOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAnOnJlcG9zaXRvcnkvdGVzdC1yZXBvJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBjcmVhdGluZyBhIGJ1aWxkIGltYWdlIGZyb20gYW4gZXhpc3RpbmcgY3Jvc3MtYWNjb3VudCBFQ1IgcmVwb3NpdG9yeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCByZXBvc2l0b3J5ID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBcm4oc3RhY2ssICdteS1jcm9zcy1hY291bnQtcmVwbycsICdhcm46YXdzOmVjcjp1cy1lYXN0LTE6NTg1Njk1MDM2MzA0OnJlcG9zaXRvcnkvZm9vL2Jhci9mb28vZm9vbycpO1xuXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICBidWlsZDogeyBjb21tYW5kczogWydscyddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4R3B1QnVpbGRJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShyZXBvc2l0b3J5KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgIEVudmlyb25tZW50OiB7XG4gICAgICAgICAgQ29tcHV0ZVR5cGU6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgICAgSW1hZ2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAnNTg1Njk1MDM2MzA0LmRrci5lY3IuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnL2Zvby9iYXIvZm9vL2Zvb286bGF0ZXN0JyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAnOmVjcjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJzo1ODU2OTUwMzYzMDQ6cmVwb3NpdG9yeS9mb28vYmFyL2Zvby9mb29vJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==