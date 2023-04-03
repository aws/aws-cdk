"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ecr = require("@aws-cdk/aws-ecr");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
describe('tag parameter container image', () => {
    describe('TagParameter container image', () => {
        test('throws an error when tagParameterName() is used without binding the image', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const repository = new ecr.Repository(stack, 'Repository');
            const tagParameterContainerImage = new ecs.TagParameterContainerImage(repository);
            new cdk.CfnOutput(stack, 'Output', {
                value: tagParameterContainerImage.tagParameterName,
            });
            expect(() => {
                assertions_1.Template.fromStack(stack);
            }).toThrow(/TagParameterContainerImage must be used in a container definition when using tagParameterName/);
        });
        test('throws an error when tagParameterValue() is used without binding the image', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const repository = new ecr.Repository(stack, 'Repository');
            const tagParameterContainerImage = new ecs.TagParameterContainerImage(repository);
            new cdk.CfnOutput(stack, 'Output', {
                value: tagParameterContainerImage.tagParameterValue,
            });
            expect(() => {
                assertions_1.Template.fromStack(stack);
            }).toThrow(/TagParameterContainerImage must be used in a container definition when using tagParameterValue/);
        });
        test('can be used in a cross-account manner', () => {
            // GIVEN
            const app = new cdk.App();
            const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
                env: {
                    account: 'pipeline-account',
                    region: 'us-west-1',
                },
            });
            const repositoryName = 'my-ecr-repo';
            const repository = new ecr.Repository(pipelineStack, 'Repository', {
                repositoryName: repositoryName,
            });
            const tagParameterContainerImage = new ecs.TagParameterContainerImage(repository);
            const serviceStack = new cdk.Stack(app, 'ServiceStack', {
                env: {
                    account: 'service-account',
                    region: 'us-west-1',
                },
            });
            const fargateTaskDefinition = new ecs.FargateTaskDefinition(serviceStack, 'ServiceTaskDefinition');
            // WHEN
            fargateTaskDefinition.addContainer('Container', {
                image: tagParameterContainerImage,
            });
            // THEN
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::ECR::Repository', {
                RepositoryName: repositoryName,
                RepositoryPolicyText: {
                    Statement: [{
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': ['', [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':iam::service-account:root',
                                        ]],
                                },
                            },
                            Condition: {
                                StringEquals: {
                                    'aws:PrincipalTag/aws-cdk:id': 'ServiceStack_c8a38b9d3ed0e8d960dd0d679c0bab1612dafa96f5',
                                },
                            },
                        }],
                },
            });
            assertions_1.Template.fromStack(serviceStack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: assertions_1.Match.objectLike({
                    Statement: assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        `:ecr:us-west-1:pipeline-account:repository/${repositoryName}`,
                                    ]],
                            },
                        }),
                        assertions_1.Match.objectLike({
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*',
                        }),
                    ]),
                }),
            });
            assertions_1.Template.fromStack(serviceStack).hasResourceProperties('AWS::IAM::Role', {
                Tags: [
                    {
                        Key: 'aws-cdk:id',
                        Value: 'ServiceStack_c8a38b9d3ed0e8d960dd0d679c0bab1612dafa96f5',
                    },
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXBhcmFtZXRlci1jb250YWluZXItaW1hZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZy1wYXJhbWV0ZXItY29udGFpbmVyLWltYWdlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFFakMsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUM3QyxRQUFRLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQzVDLElBQUksQ0FBQywyRUFBMkUsRUFBRSxHQUFHLEVBQUU7WUFDckYsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDM0QsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtnQkFDakMsS0FBSyxFQUFFLDBCQUEwQixDQUFDLGdCQUFnQjthQUNuRCxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrRkFBK0YsQ0FBQyxDQUFDO1FBQzlHLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRFQUE0RSxFQUFFLEdBQUcsRUFBRTtZQUN0RixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEtB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LEVBQUUsT0FBTzs0QkFDZixRQUFRLEVBQUU7Z0NBQ1IsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO3dDQUNmLE1BQU07d0NBQ04sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0NBQ3pCLDhDQUE4QyxjQUFjLEVBQUU7cUNBQy9ELENBQUM7NkJBQ0g7eUJBQ0YsQ0FBQzt3QkFDRixrQkFBSyxDQUFDLFVBQVUsQ0FBQzs0QkFDZixNQUFNLEVBQUUsMkJBQTJCOzRCQUNuQyxNQUFNLEVBQUUsT0FBTzs0QkFDZixRQUFRLEVBQUUsR0FBRzt5QkFDZCxDQUFDO3FCQUNILENBQUM7aUJBQ0gsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFO2dCQUN2RSxJQUFJLEVBQUU7b0JBQ0o7d0JBQ0UsR0FBRyxFQUFFLFlBQVk7d0JBQ2pCLEtBQUssRUFBRSx5REFBeUQ7cUJBQ2pFO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ3RhZyBwYXJhbWV0ZXIgY29udGFpbmVyIGltYWdlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnVGFnUGFyYW1ldGVyIGNvbnRhaW5lciBpbWFnZScsICgpID0+IHtcbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiB0YWdQYXJhbWV0ZXJOYW1lKCkgaXMgdXNlZCB3aXRob3V0IGJpbmRpbmcgdGhlIGltYWdlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwb3NpdG9yeSA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG9zaXRvcnknKTtcbiAgICAgIGNvbnN0IHRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlID0gbmV3IGVjcy5UYWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZShyZXBvc2l0b3J5KTtcbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnT3V0cHV0Jywge1xuICAgICAgICB2YWx1ZTogdGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UudGFnUGFyYW1ldGVyTmFtZSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgfSkudG9UaHJvdygvVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UgbXVzdCBiZSB1c2VkIGluIGEgY29udGFpbmVyIGRlZmluaXRpb24gd2hlbiB1c2luZyB0YWdQYXJhbWV0ZXJOYW1lLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiB0YWdQYXJhbWV0ZXJWYWx1ZSgpIGlzIHVzZWQgd2l0aG91dCBiaW5kaW5nIHRoZSBpbWFnZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvc2l0b3J5Jyk7XG4gICAgICBjb25zdCB0YWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZSA9IG5ldyBlY3MuVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UocmVwb3NpdG9yeSk7XG4gICAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6IHRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlLnRhZ1BhcmFtZXRlclZhbHVlLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB9KS50b1Rocm93KC9UYWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZSBtdXN0IGJlIHVzZWQgaW4gYSBjb250YWluZXIgZGVmaW5pdGlvbiB3aGVuIHVzaW5nIHRhZ1BhcmFtZXRlclZhbHVlLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgdXNlZCBpbiBhIGNyb3NzLWFjY291bnQgbWFubmVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAncGlwZWxpbmUtYWNjb3VudCcsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0xJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVwb3NpdG9yeU5hbWUgPSAnbXktZWNyLXJlcG8nO1xuICAgICAgY29uc3QgcmVwb3NpdG9yeSA9IG5ldyBlY3IuUmVwb3NpdG9yeShwaXBlbGluZVN0YWNrLCAnUmVwb3NpdG9yeScsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6IHJlcG9zaXRvcnlOYW1lLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0YWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZSA9IG5ldyBlY3MuVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UocmVwb3NpdG9yeSk7XG5cbiAgICAgIGNvbnN0IHNlcnZpY2VTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU2VydmljZVN0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnc2VydmljZS1hY2NvdW50JyxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTEnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmYXJnYXRlVGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzZXJ2aWNlU3RhY2ssICdTZXJ2aWNlVGFza0RlZmluaXRpb24nKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZmFyZ2F0ZVRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogdGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICAgIFJlcG9zaXRvcnlOYW1lOiByZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgUmVwb3NpdG9yeVBvbGljeVRleHQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6c2VydmljZS1hY2NvdW50OnJvb3QnLFxuICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzOlByaW5jaXBhbFRhZy9hd3MtY2RrOmlkJzogJ1NlcnZpY2VTdGFja19jOGEzOGI5ZDNlZDBlOGQ5NjBkZDBkNjc5YzBiYWIxNjEyZGFmYTk2ZjUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc2VydmljZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgIGA6ZWNyOnVzLXdlc3QtMTpwaXBlbGluZS1hY2NvdW50OnJlcG9zaXRvcnkvJHtyZXBvc2l0b3J5TmFtZX1gLFxuICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc2VydmljZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBUYWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnYXdzLWNkazppZCcsXG4gICAgICAgICAgICBWYWx1ZTogJ1NlcnZpY2VTdGFja19jOGEzOGI5ZDNlZDBlOGQ5NjBkZDBkNjc5YzBiYWIxNjEyZGFmYTk2ZjUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==