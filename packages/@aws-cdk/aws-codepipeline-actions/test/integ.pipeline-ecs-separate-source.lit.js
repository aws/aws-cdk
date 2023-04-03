"use strict";
/// !cdk-integ *
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStack = exports.EcsAppStack = void 0;
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const ec2 = require("@aws-cdk/aws-ec2");
const ecr = require("@aws-cdk/aws-ecr");
const ecs = require("@aws-cdk/aws-ecs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codepipeline_actions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtZWNzLXNlcGFyYXRlLXNvdXJjZS5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1lY3Mtc2VwYXJhdGUtc291cmNlLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZ0JBQWdCOzs7QUFFaEIsb0RBQW9EO0FBQ3BELHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUVyQywrQ0FBK0M7QUFxQi9DOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3BFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsR0FBRyxFQUFFLE1BQU07WUFDWCxTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUMxQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDekMsY0FBYztZQUNkLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtnQkFDeEMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO29CQUM1QixNQUFNLEVBQUUsQ0FBQztpQkFDVixDQUFDO2FBQ0gsQ0FB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cUNBQXFDLENBQUM7NEJBQzdELFVBQVUsRUFBRSxZQUFZOzRCQUN4QixTQUFTLEVBQUUsd0NBQXdDOzRCQUNuRCw0RkFBNEY7NEJBQzVGLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsMENBQTBDLENBQUM7NEJBQ25GLGdCQUFnQixFQUFFLElBQUk7NEJBQ3RCLGtCQUFrQixFQUFFO2dDQUNsQixnSEFBZ0g7Z0NBQ2hILDBEQUEwRDtnQ0FDMUQsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDOzZCQUM1Rjt5QkFDRixDQUFDO3FCQUNIO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBbkpELHNDQW1KQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLG1EQUFtRDtBQUNuRCxNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxHQUFHLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztBQUN0RiwrRUFBK0U7QUFDL0UsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLDRCQUE0QixFQUFFO0lBQ2pELEtBQUssRUFBRSxhQUFhLENBQUMsMEJBQTBCO0NBQ2hELENBQUMsQ0FBQztBQUNILFNBQVM7QUFFVCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyAqXG5cbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3InO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnLi4vbGliJztcblxuLyoqXG4gKiBUaGlzIGV4YW1wbGUgZGVtb25zdHJhdGVzIGhvdyB0byBjcmVhdGUgYSBDb2RlUGlwZWxpbmUgdGhhdCBkZXBsb3lzIGFuIEVDUyBTZXJ2aWNlXG4gKiBmcm9tIGEgZGlmZmVyZW50IHNvdXJjZSByZXBvc2l0b3J5IHRoYW4gdGhlIHNvdXJjZSByZXBvc2l0b3J5IG9mIHlvdXIgQ0RLIGNvZGUuXG4gKiBJZiB5b3VyIGFwcGxpY2F0aW9uIGNvZGUgYW5kIHlvdXIgQ0RLIGNvZGUgYXJlIGluIHRoZSBzYW1lIHJlcG9zaXRvcnksXG4gKiB1c2UgdGhlIENESyBQaXBlbGluZXMgbW9kdWxlIGluc3RlYWQgb2YgdGhpcyBtZXRob2QuXG4gKi9cblxuLy8vICFzaG93XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBjb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYEVjc0FwcFN0YWNrYC5cbiAqIFRoZXkgZXh0ZW5kIHRoZSBzdGFuZGFyZCBTdGFjayBwcm9wZXJ0aWVzLFxuICogYnV0IGFsc28gcmVxdWlyZSBwcm92aWRpbmcgdGhlIENvbnRhaW5lckltYWdlIHRoYXQgdGhlIHNlcnZpY2Ugd2lsbCB1c2UuXG4gKiBUaGF0IEltYWdlIHdpbGwgYmUgcHJvdmlkZWQgZnJvbSB0aGUgU3RhY2sgY29udGFpbmluZyB0aGUgQ29kZVBpcGVsaW5lLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc0FwcFN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2U7XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgU3RhY2sgY29udGFpbmluZyBhIHNpbXBsZSBFQ1MgU2VydmljZSB0aGF0IHVzZXMgdGhlIHByb3ZpZGVkIENvbnRhaW5lckltYWdlLlxuICovXG5leHBvcnQgY2xhc3MgRWNzQXBwU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWNzQXBwU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLlRhc2tEZWZpbml0aW9uKHRoaXMsICdUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkZBUkdBVEUsXG4gICAgICBjcHU6ICcxMDI0JyxcbiAgICAgIG1lbW9yeU1pQjogJzIwNDgnLFxuICAgIH0pO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQXBwQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IHByb3BzLmltYWdlLFxuICAgIH0pO1xuICAgIG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2UodGhpcywgJ0Vjc1NlcnZpY2UnLCB7XG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGNsdXN0ZXI6IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgdnBjOiBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywge1xuICAgICAgICAgIG1heEF6czogMSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgaXMgdGhlIFN0YWNrIGNvbnRhaW5pbmcgdGhlIENvZGVQaXBlbGluZSBkZWZpbml0aW9uIHRoYXQgZGVwbG95cyBhbiBFQ1MgU2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgdGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2U6IGVjcy5UYWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvKiAqKioqKioqKioqIEVDUyBwYXJ0ICoqKioqKioqKioqKioqKiogKi9cblxuICAgIC8vIHRoaXMgaXMgdGhlIEVDUiByZXBvc2l0b3J5IHdoZXJlIHRoZSBidWlsdCBEb2NrZXIgaW1hZ2Ugd2lsbCBiZSBwdXNoZWRcbiAgICBjb25zdCBhcHBFY3JSZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHRoaXMsICdFY3NEZXBsb3lSZXBvc2l0b3J5Jyk7XG4gICAgLy8gdGhlIGJ1aWxkIHRoYXQgY3JlYXRlcyB0aGUgRG9ja2VyIGltYWdlLCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBFQ1IgcmVwb1xuICAgIGNvbnN0IGFwcENvZGVEb2NrZXJCdWlsZCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsICdBcHBDb2RlRG9ja2VySW1hZ2VCdWlsZEFuZFB1c2hQcm9qZWN0Jywge1xuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgLy8gd2UgbmVlZCB0byBydW4gRG9ja2VyXG4gICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIC8vIGxvZ2luIHRvIEVDUiBmaXJzdFxuICAgICAgICAgICAgICAnJChhd3MgZWNyIGdldC1sb2dpbiAtLXJlZ2lvbiAkQVdTX0RFRkFVTFRfUkVHSU9OIC0tbm8taW5jbHVkZS1lbWFpbCknLFxuICAgICAgICAgICAgICAvLyBpZiB5b3VyIGFwcGxpY2F0aW9uIG5lZWRzIGFueSBidWlsZCBzdGVwcywgdGhleSB3b3VsZCBiZSBpbnZva2VkIGhlcmVcblxuICAgICAgICAgICAgICAvLyBidWlsZCB0aGUgaW1hZ2UsIGFuZCB0YWcgaXQgd2l0aCB0aGUgY29tbWl0IGhhc2hcbiAgICAgICAgICAgICAgLy8gKENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTiBpcyBhIHNwZWNpYWwgZW52aXJvbm1lbnQgdmFyaWFibGUgYXZhaWxhYmxlIGluIENvZGVCdWlsZClcbiAgICAgICAgICAgICAgJ2RvY2tlciBidWlsZCAtdCAkUkVQT1NJVE9SWV9VUkk6JENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTiAuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0X2J1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAvLyBwdXNoIHRoZSBidWlsdCBpbWFnZSBpbnRvIHRoZSBFQ1IgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAnZG9ja2VyIHB1c2ggJFJFUE9TSVRPUllfVVJJOiRDT0RFQlVJTERfUkVTT0xWRURfU09VUkNFX1ZFUlNJT04nLFxuICAgICAgICAgICAgICAvLyBzYXZlIHRoZSBkZWNsYXJlZCB0YWcgYXMgYW4gZW52aXJvbm1lbnQgdmFyaWFibGUsXG4gICAgICAgICAgICAgIC8vIHRoYXQgaXMgdGhlbiBleHBvcnRlZCBiZWxvdyBpbiB0aGUgJ2V4cG9ydGVkLXZhcmlhYmxlcycgc2VjdGlvbiBhcyBhIENvZGVQaXBlbGluZSBWYXJpYWJsZVxuICAgICAgICAgICAgICAnZXhwb3J0IGltYWdlVGFnPSRDT0RFQlVJTERfUkVTT0xWRURfU09VUkNFX1ZFUlNJT04nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBlbnY6IHtcbiAgICAgICAgICAvLyBzYXZlIHRoZSBpbWFnZVRhZyBlbnZpcm9ubWVudCB2YXJpYWJsZSBhcyBhIENvZGVQaXBlbGluZSBWYXJpYWJsZVxuICAgICAgICAgICdleHBvcnRlZC12YXJpYWJsZXMnOiBbXG4gICAgICAgICAgICAnaW1hZ2VUYWcnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgIFJFUE9TSVRPUllfVVJJOiB7XG4gICAgICAgICAgdmFsdWU6IGFwcEVjclJlcG8ucmVwb3NpdG9yeVVyaSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gbmVlZGVkIGZvciBgZG9ja2VyIHB1c2hgXG4gICAgYXBwRWNyUmVwby5ncmFudFB1bGxQdXNoKGFwcENvZGVEb2NrZXJCdWlsZCk7XG4gICAgLy8gY3JlYXRlIHRoZSBDb250YWluZXJJbWFnZSB1c2VkIGZvciB0aGUgRUNTIGFwcGxpY2F0aW9uIFN0YWNrXG4gICAgdGhpcy50YWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZSA9IG5ldyBlY3MuVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2UoYXBwRWNyUmVwbyk7XG5cbiAgICBjb25zdCBjZGtDb2RlQnVpbGQgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCAnQ2RrQ29kZUJ1aWxkUHJvamVjdCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICducG0gaW5zdGFsbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIC8vIHN5bnRoZXNpemUgdGhlIENESyBjb2RlIGZvciB0aGUgRUNTIGFwcGxpY2F0aW9uIFN0YWNrXG4gICAgICAgICAgICAgICducHggY2RrIHN5bnRoIC0tdmVyYm9zZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgIC8vIHN0b3JlIHRoZSBlbnRpcmUgQ2xvdWQgQXNzZW1ibHkgYXMgdGhlIG91dHB1dCBhcnRpZmFjdFxuICAgICAgICAgICdiYXNlLWRpcmVjdG9yeSc6ICdjZGsub3V0JyxcbiAgICAgICAgICAnZmlsZXMnOiAnKiovKicsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8qICoqKioqKioqKiogUGlwZWxpbmUgcGFydCAqKioqKioqKioqKioqKioqICovXG5cbiAgICBjb25zdCBhcHBDb2RlU291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNka0NvZGVTb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgY2RrQ29kZUJ1aWxkT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGFwcENvZGVCdWlsZEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0FwcENvZGVEb2NrZXJJbWFnZUJ1aWxkQW5kUHVzaCcsXG4gICAgICBwcm9qZWN0OiBhcHBDb2RlRG9ja2VyQnVpbGQsXG4gICAgICBpbnB1dDogYXBwQ29kZVNvdXJjZU91dHB1dCxcbiAgICB9KTtcbiAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdDb2RlUGlwZWxpbmVEZXBsb3lpbmdFY3NBcHBsaWNhdGlvbicsIHtcbiAgICAgIGFydGlmYWN0QnVja2V0OiBuZXcgczMuQnVja2V0KHRoaXMsICdBcnRpZmFjdEJ1Y2tldCcsIHtcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pLFxuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIEFjdGlvbiB0aGF0IHRha2VzIHRoZSBzb3VyY2Ugb2YgeW91ciBhcHBsaWNhdGlvbiBjb2RlXG4gICAgICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdBcHBDb2RlU291cmNlJyxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeSh0aGlzLCAnQXBwQ29kZVNvdXJjZVJlcG9zaXRvcnknLCB7IHJlcG9zaXRvcnlOYW1lOiAnQXBwQ29kZVNvdXJjZVJlcG9zaXRvcnknIH0pLFxuICAgICAgICAgICAgICBvdXRwdXQ6IGFwcENvZGVTb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIEFjdGlvbiB0aGF0IHRha2VzIHRoZSBzb3VyY2Ugb2YgeW91ciBDREsgY29kZVxuICAgICAgICAgICAgLy8gKHdoaWNoIHdvdWxkIHByb2JhYmx5IGluY2x1ZGUgdGhpcyBQaXBlbGluZSBjb2RlIGFzIHdlbGwpXG4gICAgICAgICAgICBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDZGtDb2RlU291cmNlJyxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeSh0aGlzLCAnQ2RrQ29kZVNvdXJjZVJlcG9zaXRvcnknLCB7IHJlcG9zaXRvcnlOYW1lOiAnQ2RrQ29kZVNvdXJjZVJlcG9zaXRvcnknIH0pLFxuICAgICAgICAgICAgICBvdXRwdXQ6IGNka0NvZGVTb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIGFwcENvZGVCdWlsZEFjdGlvbixcbiAgICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQ2RrQ29kZUJ1aWxkQW5kU3ludGgnLFxuICAgICAgICAgICAgICBwcm9qZWN0OiBjZGtDb2RlQnVpbGQsXG4gICAgICAgICAgICAgIGlucHV0OiBjZGtDb2RlU291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICBvdXRwdXRzOiBbY2RrQ29kZUJ1aWxkT3V0cHV0XSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0NGTl9EZXBsb3knLFxuICAgICAgICAgICAgICBzdGFja05hbWU6ICdTYW1wbGVFY3NTdGFja0RlcGxveWVkRnJvbUNvZGVQaXBlbGluZScsXG4gICAgICAgICAgICAgIC8vIHRoaXMgbmFtZSBoYXMgdG8gYmUgdGhlIHNhbWUgbmFtZSBhcyB1c2VkIGJlbG93IGluIHRoZSBDREsgY29kZSBmb3IgdGhlIGFwcGxpY2F0aW9uIFN0YWNrXG4gICAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogY2RrQ29kZUJ1aWxkT3V0cHV0LmF0UGF0aCgnRWNzU3RhY2tEZXBsb3llZEluUGlwZWxpbmUudGVtcGxhdGUuanNvbicpLFxuICAgICAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJPdmVycmlkZXM6IHtcbiAgICAgICAgICAgICAgICAvLyByZWFkIHRoZSB0YWcgcHVzaGVkIHRvIHRoZSBFQ1IgcmVwb3NpdG9yeSBmcm9tIHRoZSBDb2RlUGlwZWxpbmUgVmFyaWFibGUgc2F2ZWQgYnkgdGhlIGFwcGxpY2F0aW9uIGJ1aWxkIHN0ZXAsXG4gICAgICAgICAgICAgICAgLy8gYW5kIHBhc3MgaXQgYXMgdGhlIENsb3VkRm9ybWF0aW9uIFBhcmFtZXRlciBmb3IgdGhlIHRhZ1xuICAgICAgICAgICAgICAgIFt0aGlzLnRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlLnRhZ1BhcmFtZXRlck5hbWVdOiBhcHBDb2RlQnVpbGRBY3Rpb24udmFyaWFibGUoJ2ltYWdlVGFnJyksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyB0aGUgQ29kZVBpcGVsaW5lIFN0YWNrIG5lZWRzIHRvIGJlIGNyZWF0ZWQgZmlyc3RcbmNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgUGlwZWxpbmVTdGFjayhhcHAsICdhd3MtY2RrLXBpcGVsaW5lLWVjcy1zZXBhcmF0ZS1zb3VyY2VzJyk7XG4vLyB3ZSBzdXBwbHkgdGhlIGltYWdlIHRvIHRoZSBFQ1MgYXBwbGljYXRpb24gU3RhY2sgZnJvbSB0aGUgQ29kZVBpcGVsaW5lIFN0YWNrXG5uZXcgRWNzQXBwU3RhY2soYXBwLCAnRWNzU3RhY2tEZXBsb3llZEluUGlwZWxpbmUnLCB7XG4gIGltYWdlOiBwaXBlbGluZVN0YWNrLnRhZ1BhcmFtZXRlckNvbnRhaW5lckltYWdlLFxufSk7XG4vLy8gIWhpZGVcblxuYXBwLnN5bnRoKCk7XG4iXX0=