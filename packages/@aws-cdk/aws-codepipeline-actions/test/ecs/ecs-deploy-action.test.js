"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../../lib");
describe('ecs deploy action', () => {
    describe('ECS deploy Action', () => {
        test('throws an exception if neither inputArtifact nor imageFile were provided', () => {
            const service = anyEcsService();
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                });
            }).toThrow(/one of 'input' or 'imageFile' is required/);
        });
        test('can be created just by specifying the inputArtifact', () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                });
            }).not.toThrow();
        });
        test('can be created just by specifying the imageFile', () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    imageFile: artifact.atPath('imageFile.json'),
                });
            }).not.toThrow();
        });
        test('throws an exception if both inputArtifact and imageFile were provided', () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                    imageFile: artifact.atPath('file.json'),
                });
            }).toThrow(/one of 'input' or 'imageFile' can be provided/);
        });
        test('can be created with deploymentTimeout between 1-60 minutes', () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                    deploymentTimeout: cdk.Duration.minutes(30),
                });
            }).not.toThrow();
        });
        test('throws an exception if deploymentTimeout is out of bounds', () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                    deploymentTimeout: cdk.Duration.minutes(61),
                });
            }).toThrow(/timeout must be between 1 and 60 minutes/);
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                    deploymentTimeout: cdk.Duration.minutes(0),
                });
            }).toThrow(/timeout must be between 1 and 60 minutes/);
            expect(() => {
                new cpactions.EcsDeployAction({
                    actionName: 'ECS',
                    service,
                    input: artifact,
                    deploymentTimeout: cdk.Duration.seconds(30),
                });
            }).toThrow(/cannot be converted into a whole number/);
        });
        test("sets the target service as the action's backing resource", () => {
            const service = anyEcsService();
            const artifact = new codepipeline.Artifact('Artifact');
            const action = new cpactions.EcsDeployAction({
                actionName: 'ECS',
                service,
                input: artifact,
            });
            expect(action.actionProperties.resource).toEqual(service);
        });
        test('can be created by existing service', () => {
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'Vpc');
            const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'FargateService', {
                serviceName: 'service-name',
                cluster: ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
                    vpc,
                    securityGroups: [],
                    clusterName: 'cluster-name',
                }),
            });
            const artifact = new codepipeline.Artifact('Artifact');
            const bucket = new s3.Bucket(stack, 'PipelineBucket', {
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            const source = new cpactions.S3SourceAction({
                actionName: 'Source',
                output: artifact,
                bucket,
                bucketKey: 'key',
            });
            const action = new cpactions.EcsDeployAction({
                actionName: 'ECS',
                service,
                imageFile: artifact.atPath('imageFile.json'),
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [source],
                    },
                    {
                        stageName: 'Deploy',
                        actions: [action],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                Stages: [
                    {},
                    {
                        Actions: [
                            {
                                Name: 'ECS',
                                ActionTypeId: {
                                    Category: 'Deploy',
                                    Provider: 'ECS',
                                },
                                Configuration: {
                                    ClusterName: 'cluster-name',
                                    ServiceName: 'service-name',
                                    FileName: 'imageFile.json',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('can be created by existing service with cluster ARN format', () => {
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'PipelineStack', {
                env: {
                    region: 'pipeline-region', account: 'pipeline-account',
                },
            });
            const clusterName = 'cluster-name';
            const serviceName = 'service-name';
            const region = 'service-region';
            const account = 'service-account';
            const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;
            const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'FargateService', serviceArn);
            const artifact = new codepipeline.Artifact('Artifact');
            const bucket = new s3.Bucket(stack, 'PipelineBucket', {
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            const source = new cpactions.S3SourceAction({
                actionName: 'Source',
                output: artifact,
                bucket,
                bucketKey: 'key',
            });
            const action = new cpactions.EcsDeployAction({
                actionName: 'ECS',
                service: service,
                input: artifact,
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [source],
                    },
                    {
                        stageName: 'Deploy',
                        actions: [action],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                Stages: [
                    {},
                    {
                        Actions: [
                            {
                                Name: 'ECS',
                                ActionTypeId: {
                                    Category: 'Deploy',
                                    Provider: 'ECS',
                                },
                                Configuration: {
                                    ClusterName: clusterName,
                                    ServiceName: serviceName,
                                },
                                Region: region,
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            `:iam::${account}:role/pipelinestack-support-serloyecsactionrole49867f847238c85af7c0`,
                                        ],
                                    ],
                                },
                            },
                        ],
                    },
                ],
            });
        });
    });
});
function anyEcsService() {
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
    taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', {
        vpc,
    });
    return new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWRlcGxveS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1kZXBsb3ktYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsMERBQTBEO0FBQzFELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyx1Q0FBdUM7QUFFdkMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLElBQUksQ0FBQywwRUFBMEUsRUFBRSxHQUFHLEVBQUU7WUFDcEYsTUFBTSxPQUFPLEdBQUcsYUFBYSxFQUFFLENBQUM7WUFFaEMsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7b0JBQzVCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixPQUFPO2lCQUNSLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBRzFELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxNQUFNLE9BQU8sR0FBRyxhQUFhLEVBQUUsQ0FBQztZQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFdkQsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7b0JBQzVCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixPQUFPO29CQUNQLEtBQUssRUFBRSxRQUFRO2lCQUNoQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFHbkIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaURBQWlELEVBQUUs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QXFFO3lDQUN0RjtxQ0FDRjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsYUFBYTtJQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RSxjQUFjLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRTtRQUMzQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7S0FDbkUsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNoRCxHQUFHO0tBQ0osQ0FBQyxDQUFDO0lBQ0gsT0FBTyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1FBQ3JELE9BQU87UUFDUCxjQUFjO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdlY3MgZGVwbG95IGFjdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0VDUyBkZXBsb3kgQWN0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgbmVpdGhlciBpbnB1dEFydGlmYWN0IG5vciBpbWFnZUZpbGUgd2VyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBhbnlFY3NTZXJ2aWNlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjcGFjdGlvbnMuRWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRUNTJyxcbiAgICAgICAgICBzZXJ2aWNlLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL29uZSBvZiAnaW5wdXQnIG9yICdpbWFnZUZpbGUnIGlzIHJlcXVpcmVkLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQganVzdCBieSBzcGVjaWZ5aW5nIHRoZSBpbnB1dEFydGlmYWN0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VydmljZSA9IGFueUVjc1NlcnZpY2UoKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQXJ0aWZhY3QnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdFQ1MnLFxuICAgICAgICAgIHNlcnZpY2UsXG4gICAgICAgICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICB9KTtcbiAgICAgIH0pLm5vdC50b1Rocm93KCk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQganVzdCBieSBzcGVjaWZ5aW5nIHRoZSBpbWFnZUZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZXJ2aWNlID0gYW55RWNzU2VydmljZSgpO1xuICAgICAgY29uc3QgYXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdCcpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkVjc0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0VDUycsXG4gICAgICAgICAgc2VydmljZSxcbiAgICAgICAgICBpbWFnZUZpbGU6IGFydGlmYWN0LmF0UGF0aCgnaW1hZ2VGaWxlLmpzb24nKSxcbiAgICAgICAgfSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgYm90aCBpbnB1dEFydGlmYWN0IGFuZCBpbWFnZUZpbGUgd2VyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBhbnlFY3NTZXJ2aWNlKCk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjcGFjdGlvbnMuRWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRUNTJyxcbiAgICAgICAgICBzZXJ2aWNlLFxuICAgICAgICAgIGlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICBpbWFnZUZpbGU6IGFydGlmYWN0LmF0UGF0aCgnZmlsZS5qc29uJyksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvb25lIG9mICdpbnB1dCcgb3IgJ2ltYWdlRmlsZScgY2FuIGJlIHByb3ZpZGVkLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCBkZXBsb3ltZW50VGltZW91dCBiZXR3ZWVuIDEtNjAgbWludXRlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBhbnlFY3NTZXJ2aWNlKCk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjcGFjdGlvbnMuRWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRUNTJyxcbiAgICAgICAgICBzZXJ2aWNlLFxuICAgICAgICAgIGlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICBkZXBsb3ltZW50VGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KTtcbiAgICAgIH0pLm5vdC50b1Rocm93KCk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBkZXBsb3ltZW50VGltZW91dCBpcyBvdXQgb2YgYm91bmRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VydmljZSA9IGFueUVjc1NlcnZpY2UoKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQXJ0aWZhY3QnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdFQ1MnLFxuICAgICAgICAgIHNlcnZpY2UsXG4gICAgICAgICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICAgIGRlcGxveW1lbnRUaW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg2MSksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvdGltZW91dCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNjAgbWludXRlcy8pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkVjc0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0VDUycsXG4gICAgICAgICAgc2VydmljZSxcbiAgICAgICAgICBpbnB1dDogYXJ0aWZhY3QsXG4gICAgICAgICAgZGVwbG95bWVudFRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDApLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL3RpbWVvdXQgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDYwIG1pbnV0ZXMvKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdFQ1MnLFxuICAgICAgICAgIHNlcnZpY2UsXG4gICAgICAgICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICAgIGRlcGxveW1lbnRUaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIGEgd2hvbGUgbnVtYmVyLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdChcInNldHMgdGhlIHRhcmdldCBzZXJ2aWNlIGFzIHRoZSBhY3Rpb24ncyBiYWNraW5nIHJlc291cmNlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBhbnlFY3NTZXJ2aWNlKCk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG5cbiAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuRWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0VDUycsXG4gICAgICAgIHNlcnZpY2UsXG4gICAgICAgIGlucHV0OiBhcnRpZmFjdCxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMucmVzb3VyY2UpLnRvRXF1YWwoc2VydmljZSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgYnkgZXhpc3Rpbmcgc2VydmljZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuRmFyZ2F0ZVNlcnZpY2UuZnJvbUZhcmdhdGVTZXJ2aWNlQXR0cmlidXRlcyhzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgICBzZXJ2aWNlTmFtZTogJ3NlcnZpY2UtbmFtZScsXG4gICAgICAgIGNsdXN0ZXI6IGVjcy5DbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgICAgdnBjLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbXSxcbiAgICAgICAgICBjbHVzdGVyTmFtZTogJ2NsdXN0ZXItbmFtZScsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnUGlwZWxpbmVCdWNrZXQnLCB7XG4gICAgICAgIHZlcnNpb25lZDogdHJ1ZSxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc291cmNlID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICBvdXRwdXQ6IGFydGlmYWN0LFxuICAgICAgICBidWNrZXQsXG4gICAgICAgIGJ1Y2tldEtleTogJ2tleScsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuRWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0VDUycsXG4gICAgICAgIHNlcnZpY2UsXG4gICAgICAgIGltYWdlRmlsZTogYXJ0aWZhY3QuYXRQYXRoKCdpbWFnZUZpbGUuanNvbicpLFxuICAgICAgfSk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbc291cmNlXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbYWN0aW9uXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgIFN0YWdlczogW1xuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdFQ1MnLFxuICAgICAgICAgICAgICAgIEFjdGlvblR5cGVJZDoge1xuICAgICAgICAgICAgICAgICAgQ2F0ZWdvcnk6ICdEZXBsb3knLFxuICAgICAgICAgICAgICAgICAgUHJvdmlkZXI6ICdFQ1MnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgQ2x1c3Rlck5hbWU6ICdjbHVzdGVyLW5hbWUnLFxuICAgICAgICAgICAgICAgICAgU2VydmljZU5hbWU6ICdzZXJ2aWNlLW5hbWUnLFxuICAgICAgICAgICAgICAgICAgRmlsZU5hbWU6ICdpbWFnZUZpbGUuanNvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIGJ5IGV4aXN0aW5nIHNlcnZpY2Ugd2l0aCBjbHVzdGVyIEFSTiBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIHJlZ2lvbjogJ3BpcGVsaW5lLXJlZ2lvbicsIGFjY291bnQ6ICdwaXBlbGluZS1hY2NvdW50JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY2x1c3Rlck5hbWUgPSAnY2x1c3Rlci1uYW1lJztcbiAgICAgIGNvbnN0IHNlcnZpY2VOYW1lID0gJ3NlcnZpY2UtbmFtZSc7XG4gICAgICBjb25zdCByZWdpb24gPSAnc2VydmljZS1yZWdpb24nO1xuICAgICAgY29uc3QgYWNjb3VudCA9ICdzZXJ2aWNlLWFjY291bnQnO1xuICAgICAgY29uc3Qgc2VydmljZUFybiA9IGBhcm46YXdzOmVjczoke3JlZ2lvbn06JHthY2NvdW50fTpzZXJ2aWNlLyR7Y2x1c3Rlck5hbWV9LyR7c2VydmljZU5hbWV9YDtcbiAgICAgIGNvbnN0IHNlcnZpY2UgPSBlY3MuQmFzZVNlcnZpY2UuZnJvbVNlcnZpY2VBcm5XaXRoQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywgc2VydmljZUFybik7XG5cbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQXJ0aWZhY3QnKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdQaXBlbGluZUJ1Y2tldCcsIHtcbiAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3VyY2UgPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIG91dHB1dDogYXJ0aWZhY3QsXG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgYnVja2V0S2V5OiAna2V5JyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYWN0aW9uID0gbmV3IGNwYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnRUNTJyxcbiAgICAgICAgc2VydmljZTogc2VydmljZSxcbiAgICAgICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgICAgfSk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbc291cmNlXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbYWN0aW9uXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgIFN0YWdlczogW1xuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdFQ1MnLFxuICAgICAgICAgICAgICAgIEFjdGlvblR5cGVJZDoge1xuICAgICAgICAgICAgICAgICAgQ2F0ZWdvcnk6ICdEZXBsb3knLFxuICAgICAgICAgICAgICAgICAgUHJvdmlkZXI6ICdFQ1MnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgQ2x1c3Rlck5hbWU6IGNsdXN0ZXJOYW1lLFxuICAgICAgICAgICAgICAgICAgU2VydmljZU5hbWU6IHNlcnZpY2VOYW1lLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUmVnaW9uOiByZWdpb24sXG4gICAgICAgICAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBgOmlhbTo6JHthY2NvdW50fTpyb2xlL3BpcGVsaW5lc3RhY2stc3VwcG9ydC1zZXJsb3llY3NhY3Rpb25yb2xlNDk4NjdmODQ3MjM4Yzg1YWY3YzBgLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGFueUVjc1NlcnZpY2UoKTogZWNzLkZhcmdhdGVTZXJ2aWNlIHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmaW5pdGlvbicpO1xuICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW5Db250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICB9KTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgdnBjLFxuICB9KTtcbiAgcmV0dXJuIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICBjbHVzdGVyLFxuICAgIHRhc2tEZWZpbml0aW9uLFxuICB9KTtcbn1cbiJdfQ==