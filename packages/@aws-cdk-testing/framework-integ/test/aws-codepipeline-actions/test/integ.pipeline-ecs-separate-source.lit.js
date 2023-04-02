"use strict";
/// !cdk-integ *
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStack = exports.EcsAppStack = void 0;
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codecommit = require("aws-cdk-lib/aws-codecommit");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecr = require("aws-cdk-lib/aws-ecr");
const ecs = require("aws-cdk-lib/aws-ecs");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
/**
 * This is the Stack containing a simple ECS Service that uses the provided ContainerImage.
 */
class EcsAppStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const taskDefinition = new ecs.TaskDefinition(this, 'TaskDefinition', {
            compatibility: ecs.Compatibility.FARGATE,
            cpu: '1024',
            memoryMiB: '2048',
        });
        taskDefinition.addContainer('AppContainer', {
            image: props.image,
        });
        new ecs.FargateService(this, 'EcsService', {
            taskDefinition,
            cluster: new ecs.Cluster(this, 'Cluster', {
                vpc: new ec2.Vpc(this, 'Vpc', {
                    maxAzs: 1,
                }),
            }),
        });
    }
}
exports.EcsAppStack = EcsAppStack;
/**
 * This is the Stack containing the CodePipeline definition that deploys an ECS Service.
 */
class PipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /* ********** ECS part **************** */
        // this is the ECR repository where the built Docker image will be pushed
        const appEcrRepo = new ecr.Repository(this, 'EcsDeployRepository');
        // the build that creates the Docker image, and pushes it to the ECR repo
        const appCodeDockerBuild = new codebuild.PipelineProject(this, 'AppCodeDockerImageBuildAndPushProject', {
            environment: {
                // we need to run Docker
                privileged: true,
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            // login to ECR first
                            '$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)',
                            // if your application needs any build steps, they would be invoked here
                            // build the image, and tag it with the commit hash
                            // (CODEBUILD_RESOLVED_SOURCE_VERSION is a special environment variable available in CodeBuild)
                            'docker build -t $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION .',
                        ],
                    },
                    post_build: {
                        commands: [
                            // push the built image into the ECR repository
                            'docker push $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
                            // save the declared tag as an environment variable,
                            // that is then exported below in the 'exported-variables' section as a CodePipeline Variable
                            'export imageTag=$CODEBUILD_RESOLVED_SOURCE_VERSION',
                        ],
                    },
                },
                env: {
                    // save the imageTag environment variable as a CodePipeline Variable
                    'exported-variables': [
                        'imageTag',
                    ],
                },
            }),
            environmentVariables: {
                REPOSITORY_URI: {
                    value: appEcrRepo.repositoryUri,
                },
            },
        });
        // needed for `docker push`
        appEcrRepo.grantPullPush(appCodeDockerBuild);
        // create the ContainerImage used for the ECS application Stack
        this.tagParameterContainerImage = new ecs.TagParameterContainerImage(appEcrRepo);
        const cdkCodeBuild = new codebuild.PipelineProject(this, 'CdkCodeBuildProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'npm install',
                        ],
                    },
                    build: {
                        commands: [
                            // synthesize the CDK code for the ECS application Stack
                            'npx cdk synth --verbose',
                        ],
                    },
                },
                artifacts: {
                    // store the entire Cloud Assembly as the output artifact
                    'base-directory': 'cdk.out',
                    'files': '**/*',
                },
            }),
        });
        /* ********** Pipeline part **************** */
        const appCodeSourceOutput = new codepipeline.Artifact();
        const cdkCodeSourceOutput = new codepipeline.Artifact();
        const cdkCodeBuildOutput = new codepipeline.Artifact();
        const appCodeBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'AppCodeDockerImageBuildAndPush',
            project: appCodeDockerBuild,
            input: appCodeSourceOutput,
        });
        new codepipeline.Pipeline(this, 'CodePipelineDeployingEcsApplication', {
            artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            }),
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        // this is the Action that takes the source of your application code
                        new codepipeline_actions.CodeCommitSourceAction({
                            actionName: 'AppCodeSource',
                            repository: new codecommit.Repository(this, 'AppCodeSourceRepository', { repositoryName: 'AppCodeSourceRepository' }),
                            output: appCodeSourceOutput,
                        }),
                        // this is the Action that takes the source of your CDK code
                        // (which would probably include this Pipeline code as well)
                        new codepipeline_actions.CodeCommitSourceAction({
                            actionName: 'CdkCodeSource',
                            repository: new codecommit.Repository(this, 'CdkCodeSourceRepository', { repositoryName: 'CdkCodeSourceRepository' }),
                            output: cdkCodeSourceOutput,
                        }),
                    ],
                },
                {
                    stageName: 'Build',
                    actions: [
                        appCodeBuildAction,
                        new codepipeline_actions.CodeBuildAction({
                            actionName: 'CdkCodeBuildAndSynth',
                            project: cdkCodeBuild,
                            input: cdkCodeSourceOutput,
                            outputs: [cdkCodeBuildOutput],
                        }),
                    ],
                },
                {
                    stageName: 'Deploy',
                    actions: [
                        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
                            actionName: 'CFN_Deploy',
                            stackName: 'SampleEcsStackDeployedFromCodePipeline',
                            // this name has to be the same name as used below in the CDK code for the application Stack
                            templatePath: cdkCodeBuildOutput.atPath('EcsStackDeployedInPipeline.template.json'),
                            adminPermissions: true,
                            parameterOverrides: {
                                // read the tag pushed to the ECR repository from the CodePipeline Variable saved by the application build step,
                                // and pass it as the CloudFormation Parameter for the tag
                                [this.tagParameterContainerImage.tagParameterName]: appCodeBuildAction.variable('imageTag'),
                            },
                        }),
                    ],
                },
            ],
        });
    }
}
exports.PipelineStack = PipelineStack;
const app = new cdk.App();
// the CodePipeline Stack needs to be created first
const pipelineStack = new PipelineStack(app, 'aws-cdk-pipeline-ecs-separate-sources');
// we supply the image to the ECS application Stack from the CodePipeline Stack
new EcsAppStack(app, 'EcsStackDeployedInPipeline', {
    image: pipelineStack.tagParameterContainerImage,
});
/// !hide
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtZWNzLXNlcGFyYXRlLXNvdXJjZS5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1lY3Mtc2VwYXJhdGUtc291cmNlLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0JBQWdCOzs7QUFFaEIsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCw2REFBNkQ7QUFDN0QsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUVuQyw2RUFBNkU7QUFxQjdFOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3BFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsR0FBRyxFQUFFLE1BQU07WUFDWCxTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUMxQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDekMsY0FBYztZQUNkLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtnQkFDeEMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO29CQUM1QixNQUFNLEVBQUUsQ0FBQztpQkFDVixDQUFDO2FBQ0gsQ0FB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Q0FBQyxxQ0FBcUMsQ0FBQzs0QkFDN0QsVUFBVSxFQUFFLFlBQVk7NEJBQ3hCLFNBQVMsRUFBRSx3Q0FBd0M7NEJBQ25ELDRGQUE0Rjs0QkFDNUYsWUFBWSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQywwQ0FBMEMsQ0FBQzs0QkFDbkYsZ0JBQWdCLEVBQUUsSUFBSTs0QkFDdEIsa0JBQWtCLEVBQUU7Z0NBQ2xCLGdIQUFnSDtnQ0FDaEgsMERBQTBEO2dDQUMxRCxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7NkJBQzVGO3lCQUNGLENBQUM7cUJBQ0g7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQW5KRCxzQ0FtSkM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixtREFBbUQ7QUFDbkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7QUFDdEYsK0VBQStFO0FBQy9FLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsRUFBRTtJQUNqRCxLQUFLLEVBQUUsYUFBYSxDQUFDLDBCQUEwQjtDQUNoRCxDQUFDLENBQUM7QUFDSCxTQUFTO0FBRVQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgKlxuXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuXG4vKipcbiAqIFRoaXMgZXhhbXBsZSBkZW1vbnN0cmF0ZXMgaG93IHRvIGNyZWF0ZSBhIENvZGVQaXBlbGluZSB0aGF0IGRlcGxveXMgYW4gRUNTIFNlcnZpY2VcbiAqIGZyb20gYSBkaWZmZXJlbnQgc291cmNlIHJlcG9zaXRvcnkgdGhhbiB0aGUgc291cmNlIHJlcG9zaXRvcnkgb2YgeW91ciBDREsgY29kZS5cbiAqIElmIHlvdXIgYXBwbGljYXRpb24gY29kZSBhbmQgeW91ciBDREsgY29kZSBhcmUgaW4gdGhlIHNhbWUgcmVwb3NpdG9yeSxcbiAqIHVzZSB0aGUgQ0RLIFBpcGVsaW5lcyBtb2R1bGUgaW5zdGVhZCBvZiB0aGlzIG1ldGhvZC5cbiAqL1xuXG4vLy8gIXNob3dcblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIGNvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgRWNzQXBwU3RhY2tgLlxuICogVGhleSBleHRlbmQgdGhlIHN0YW5kYXJkIFN0YWNrIHByb3BlcnRpZXMsXG4gKiBidXQgYWxzbyByZXF1aXJlIHByb3ZpZGluZyB0aGUgQ29udGFpbmVySW1hZ2UgdGhhdCB0aGUgc2VydmljZSB3aWxsIHVzZS5cbiAqIFRoYXQgSW1hZ2Ugd2lsbCBiZSBwcm92aWRlZCBmcm9tIHRoZSBTdGFjayBjb250YWluaW5nIHRoZSBDb2RlUGlwZWxpbmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzQXBwU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBTdGFjayBjb250YWluaW5nIGEgc2ltcGxlIEVDUyBTZXJ2aWNlIHRoYXQgdXNlcyB0aGUgcHJvdmlkZWQgQ29udGFpbmVySW1hZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NBcHBTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NBcHBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuVGFza0RlZmluaXRpb24odGhpcywgJ1Rhc2tEZWZpbml0aW9uJywge1xuICAgICAgY29tcGF0aWJpbGl0eTogZWNzLkNvbXBhdGliaWxpdHkuRkFSR0FURSxcbiAgICAgIGNwdTogJzEwMjQnLFxuICAgICAgbWVtb3J5TWlCOiAnMjA0OCcsXG4gICAgfSk7XG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdBcHBDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogcHJvcHMuaW1hZ2UsXG4gICAgfSk7XG4gICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZSh0aGlzLCAnRWNzU2VydmljZScsIHtcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgY2x1c3RlcjogbmV3IGVjcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgICB2cGM6IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7XG4gICAgICAgICAgbWF4QXpzOiAxLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgU3RhY2sgY29udGFpbmluZyB0aGUgQ29kZVBpcGVsaW5lIGRlZmluaXRpb24gdGhhdCBkZXBsb3lzIGFuIEVDUyBTZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSB0YWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZTogZWNzLlRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8qICoqKioqKioqKiogRUNTIHBhcnQgKioqKioqKioqKioqKioqKiAqL1xuXG4gICAgLy8gdGhpcyBpcyB0aGUgRUNSIHJlcG9zaXRvcnkgd2hlcmUgdGhlIGJ1aWx0IERvY2tlciBpbWFnZSB3aWxsIGJlIHB1c2hlZFxuICAgIGNvbnN0IGFwcEVjclJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkodGhpcywgJ0Vjc0RlcGxveVJlcG9zaXRvcnknKTtcbiAgICAvLyB0aGUgYnVpbGQgdGhhdCBjcmVhdGVzIHRoZSBEb2NrZXIgaW1hZ2UsIGFuZCBwdXNoZXMgaXQgdG8gdGhlIEVDUiByZXBvXG4gICAgY29uc3QgYXBwQ29kZURvY2tlckJ1aWxkID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgJ0FwcENvZGVEb2NrZXJJbWFnZUJ1aWxkQW5kUHVzaFByb2plY3QnLCB7XG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAvLyB3ZSBuZWVkIHRvIHJ1biBEb2NrZXJcbiAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgLy8gbG9naW4gdG8gRUNSIGZpcnN0XG4gICAgICAgICAgICAgICckKGF3cyBlY3IgZ2V0LWxvZ2luIC0tcmVnaW9uICRBV1NfREVGQVVMVF9SRUdJT04gLS1uby1pbmNsdWRlLWVtYWlsKScsXG4gICAgICAgICAgICAgIC8vIGlmIHlvdXIgYXBwbGljYXRpb24gbmVlZHMgYW55IGJ1aWxkIHN0ZXBzLCB0aGV5IHdvdWxkIGJlIGludm9rZWQgaGVyZVxuXG4gICAgICAgICAgICAgIC8vIGJ1aWxkIHRoZSBpbWFnZSwgYW5kIHRhZyBpdCB3aXRoIHRoZSBjb21taXQgaGFzaFxuICAgICAgICAgICAgICAvLyAoQ09ERUJVSUxEX1JFU09MVkVEX1NPVVJDRV9WRVJTSU9OIGlzIGEgc3BlY2lhbCBlbnZpcm9ubWVudCB2YXJpYWJsZSBhdmFpbGFibGUgaW4gQ29kZUJ1aWxkKVxuICAgICAgICAgICAgICAnZG9ja2VyIGJ1aWxkIC10ICRSRVBPU0lUT1JZX1VSSTokQ09ERUJVSUxEX1JFU09MVkVEX1NPVVJDRV9WRVJTSU9OIC4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvc3RfYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIC8vIHB1c2ggdGhlIGJ1aWx0IGltYWdlIGludG8gdGhlIEVDUiByZXBvc2l0b3J5XG4gICAgICAgICAgICAgICdkb2NrZXIgcHVzaCAkUkVQT1NJVE9SWV9VUkk6JENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTicsXG4gICAgICAgICAgICAgIC8vIHNhdmUgdGhlIGRlY2xhcmVkIHRhZyBhcyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSxcbiAgICAgICAgICAgICAgLy8gdGhhdCBpcyB0aGVuIGV4cG9ydGVkIGJlbG93IGluIHRoZSAnZXhwb3J0ZWQtdmFyaWFibGVzJyBzZWN0aW9uIGFzIGEgQ29kZVBpcGVsaW5lIFZhcmlhYmxlXG4gICAgICAgICAgICAgICdleHBvcnQgaW1hZ2VUYWc9JENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIC8vIHNhdmUgdGhlIGltYWdlVGFnIGVudmlyb25tZW50IHZhcmlhYmxlIGFzIGEgQ29kZVBpcGVsaW5lIFZhcmlhYmxlXG4gICAgICAgICAgJ2V4cG9ydGVkLXZhcmlhYmxlcyc6IFtcbiAgICAgICAgICAgICdpbWFnZVRhZycsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgUkVQT1NJVE9SWV9VUkk6IHtcbiAgICAgICAgICB2YWx1ZTogYXBwRWNyUmVwby5yZXBvc2l0b3J5VXJpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBuZWVkZWQgZm9yIGBkb2NrZXIgcHVzaGBcbiAgICBhcHBFY3JSZXBvLmdyYW50UHVsbFB1c2goYXBwQ29kZURvY2tlckJ1aWxkKTtcbiAgICAvLyBjcmVhdGUgdGhlIENvbnRhaW5lckltYWdlIHVzZWQgZm9yIHRoZSBFQ1MgYXBwbGljYXRpb24gU3RhY2tcbiAgICB0aGlzLnRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlID0gbmV3IGVjcy5UYWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZShhcHBFY3JSZXBvKTtcblxuICAgIGNvbnN0IGNka0NvZGVCdWlsZCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsICdDZGtDb2RlQnVpbGRQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgaW5zdGFsbDoge1xuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgJ25wbSBpbnN0YWxsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgLy8gc3ludGhlc2l6ZSB0aGUgQ0RLIGNvZGUgZm9yIHRoZSBFQ1MgYXBwbGljYXRpb24gU3RhY2tcbiAgICAgICAgICAgICAgJ25weCBjZGsgc3ludGggLS12ZXJib3NlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgLy8gc3RvcmUgdGhlIGVudGlyZSBDbG91ZCBBc3NlbWJseSBhcyB0aGUgb3V0cHV0IGFydGlmYWN0XG4gICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ2Nkay5vdXQnLFxuICAgICAgICAgICdmaWxlcyc6ICcqKi8qJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLyogKioqKioqKioqKiBQaXBlbGluZSBwYXJ0ICoqKioqKioqKioqKioqKiogKi9cblxuICAgIGNvbnN0IGFwcENvZGVTb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgY2RrQ29kZVNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjZGtDb2RlQnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgYXBwQ29kZUJ1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQXBwQ29kZURvY2tlckltYWdlQnVpbGRBbmRQdXNoJyxcbiAgICAgIHByb2plY3Q6IGFwcENvZGVEb2NrZXJCdWlsZCxcbiAgICAgIGlucHV0OiBhcHBDb2RlU291cmNlT3V0cHV0LFxuICAgIH0pO1xuICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgJ0NvZGVQaXBlbGluZURlcGxveWluZ0Vjc0FwcGxpY2F0aW9uJywge1xuICAgICAgYXJ0aWZhY3RCdWNrZXQ6IG5ldyBzMy5CdWNrZXQodGhpcywgJ0FydGlmYWN0QnVja2V0Jywge1xuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgfSksXG4gICAgICBzdGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgQWN0aW9uIHRoYXQgdGFrZXMgdGhlIHNvdXJjZSBvZiB5b3VyIGFwcGxpY2F0aW9uIGNvZGVcbiAgICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0FwcENvZGVTb3VyY2UnLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHRoaXMsICdBcHBDb2RlU291cmNlUmVwb3NpdG9yeScsIHsgcmVwb3NpdG9yeU5hbWU6ICdBcHBDb2RlU291cmNlUmVwb3NpdG9yeScgfSksXG4gICAgICAgICAgICAgIG91dHB1dDogYXBwQ29kZVNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgQWN0aW9uIHRoYXQgdGFrZXMgdGhlIHNvdXJjZSBvZiB5b3VyIENESyBjb2RlXG4gICAgICAgICAgICAvLyAod2hpY2ggd291bGQgcHJvYmFibHkgaW5jbHVkZSB0aGlzIFBpcGVsaW5lIGNvZGUgYXMgd2VsbClcbiAgICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0Nka0NvZGVTb3VyY2UnLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHRoaXMsICdDZGtDb2RlU291cmNlUmVwb3NpdG9yeScsIHsgcmVwb3NpdG9yeU5hbWU6ICdDZGtDb2RlU291cmNlUmVwb3NpdG9yeScgfSksXG4gICAgICAgICAgICAgIG91dHB1dDogY2RrQ29kZVNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgYXBwQ29kZUJ1aWxkQWN0aW9uLFxuICAgICAgICAgICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDZGtDb2RlQnVpbGRBbmRTeW50aCcsXG4gICAgICAgICAgICAgIHByb2plY3Q6IGNka0NvZGVCdWlsZCxcbiAgICAgICAgICAgICAgaW5wdXQ6IGNka0NvZGVTb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIG91dHB1dHM6IFtjZGtDb2RlQnVpbGRPdXRwdXRdLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQ0ZOX0RlcGxveScsXG4gICAgICAgICAgICAgIHN0YWNrTmFtZTogJ1NhbXBsZUVjc1N0YWNrRGVwbG95ZWRGcm9tQ29kZVBpcGVsaW5lJyxcbiAgICAgICAgICAgICAgLy8gdGhpcyBuYW1lIGhhcyB0byBiZSB0aGUgc2FtZSBuYW1lIGFzIHVzZWQgYmVsb3cgaW4gdGhlIENESyBjb2RlIGZvciB0aGUgYXBwbGljYXRpb24gU3RhY2tcbiAgICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiBjZGtDb2RlQnVpbGRPdXRwdXQuYXRQYXRoKCdFY3NTdGFja0RlcGxveWVkSW5QaXBlbGluZS50ZW1wbGF0ZS5qc29uJyksXG4gICAgICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICAgICAgICAgIHBhcmFtZXRlck92ZXJyaWRlczoge1xuICAgICAgICAgICAgICAgIC8vIHJlYWQgdGhlIHRhZyBwdXNoZWQgdG8gdGhlIEVDUiByZXBvc2l0b3J5IGZyb20gdGhlIENvZGVQaXBlbGluZSBWYXJpYWJsZSBzYXZlZCBieSB0aGUgYXBwbGljYXRpb24gYnVpbGQgc3RlcCxcbiAgICAgICAgICAgICAgICAvLyBhbmQgcGFzcyBpdCBhcyB0aGUgQ2xvdWRGb3JtYXRpb24gUGFyYW1ldGVyIGZvciB0aGUgdGFnXG4gICAgICAgICAgICAgICAgW3RoaXMudGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UudGFnUGFyYW1ldGVyTmFtZV06IGFwcENvZGVCdWlsZEFjdGlvbi52YXJpYWJsZSgnaW1hZ2VUYWcnKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbi8vIHRoZSBDb2RlUGlwZWxpbmUgU3RhY2sgbmVlZHMgdG8gYmUgY3JlYXRlZCBmaXJzdFxuY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBQaXBlbGluZVN0YWNrKGFwcCwgJ2F3cy1jZGstcGlwZWxpbmUtZWNzLXNlcGFyYXRlLXNvdXJjZXMnKTtcbi8vIHdlIHN1cHBseSB0aGUgaW1hZ2UgdG8gdGhlIEVDUyBhcHBsaWNhdGlvbiBTdGFjayBmcm9tIHRoZSBDb2RlUGlwZWxpbmUgU3RhY2tcbm5ldyBFY3NBcHBTdGFjayhhcHAsICdFY3NTdGFja0RlcGxveWVkSW5QaXBlbGluZScsIHtcbiAgaW1hZ2U6IHBpcGVsaW5lU3RhY2sudGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UsXG59KTtcbi8vLyAhaGlkZVxuXG5hcHAuc3ludGgoKTtcbiJdfQ==