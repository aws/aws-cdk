"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codedeploy = require("@aws-cdk/aws-codedeploy");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cdk = require("@aws-cdk/core");
const cpactions = require("../../lib");
describe('CodeDeploy ECS Deploy Action', () => {
    describe('CodeDeploy ECS Deploy Action', () => {
        test('throws an exception if more than 4 container image inputs are provided', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact = new codepipeline.Artifact('Artifact');
            const containerImageInputs = [];
            for (let i = 0; i < 5; i++) {
                containerImageInputs.push({
                    input: artifact,
                });
            }
            expect(() => {
                new cpactions.CodeDeployEcsDeployAction({
                    actionName: 'DeployToECS',
                    deploymentGroup,
                    taskDefinitionTemplateInput: artifact,
                    appSpecTemplateInput: artifact,
                    containerImageInputs,
                });
            }).toThrow(/Action cannot have more than 4 container image inputs, got: 5/);
        });
        test('throws an exception if both appspec artifact input and file are specified', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact = new codepipeline.Artifact('Artifact');
            const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');
            expect(() => {
                new cpactions.CodeDeployEcsDeployAction({
                    actionName: 'DeployToECS',
                    deploymentGroup,
                    taskDefinitionTemplateInput: artifact,
                    appSpecTemplateInput: artifact,
                    appSpecTemplateFile: artifactPath,
                });
            }).toThrow(/Exactly one of 'appSpecTemplateInput' or 'appSpecTemplateFile' can be provided in the ECS CodeDeploy Action/);
        });
        test('throws an exception if neither appspec artifact input nor file are specified', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.CodeDeployEcsDeployAction({
                    actionName: 'DeployToECS',
                    deploymentGroup,
                    taskDefinitionTemplateInput: artifact,
                });
            }).toThrow(/Specifying one of 'appSpecTemplateInput' or 'appSpecTemplateFile' is required for the ECS CodeDeploy Action/);
        });
        test('throws an exception if both task definition artifact input and file are specified', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact = new codepipeline.Artifact('Artifact');
            const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');
            expect(() => {
                new cpactions.CodeDeployEcsDeployAction({
                    actionName: 'DeployToECS',
                    deploymentGroup,
                    taskDefinitionTemplateInput: artifact,
                    taskDefinitionTemplateFile: artifactPath,
                    appSpecTemplateInput: artifact,
                });
            }).toThrow(/Exactly one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' can be provided in the ECS CodeDeploy Action/);
        });
        test('throws an exception if neither task definition artifact input nor file are specified', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact = new codepipeline.Artifact('Artifact');
            expect(() => {
                new cpactions.CodeDeployEcsDeployAction({
                    actionName: 'DeployToECS',
                    deploymentGroup,
                    appSpecTemplateInput: artifact,
                });
            }).toThrow(/Specifying one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' is required for the ECS CodeDeploy Action/);
        });
        test('defaults task definition and appspec template paths', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            addCodeDeployECSCodePipeline(stack, {
                actionName: 'DeployToECS',
                deploymentGroup,
                taskDefinitionTemplateInput: new codepipeline.Artifact('TaskDefArtifact'),
                appSpecTemplateInput: new codepipeline.Artifact('AppSpecArtifact'),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                Stages: [
                    {},
                    {
                        Actions: [
                            {
                                Configuration: {
                                    ApplicationName: 'MyApplication',
                                    DeploymentGroupName: 'MyDeploymentGroup',
                                    TaskDefinitionTemplateArtifact: 'TaskDefArtifact',
                                    AppSpecTemplateArtifact: 'AppSpecArtifact',
                                    TaskDefinitionTemplatePath: 'taskdef.json',
                                    AppSpecTemplatePath: 'appspec.yaml',
                                },
                                InputArtifacts: [
                                    {
                                        Name: 'TaskDefArtifact',
                                    },
                                    {
                                        Name: 'AppSpecArtifact',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
        test('defaults task definition placeholder string', () => {
            const stack = new cdk.Stack();
            const deploymentGroup = addEcsDeploymentGroup(stack);
            const artifact1 = new codepipeline.Artifact();
            const artifact2 = new codepipeline.Artifact();
            addCodeDeployECSCodePipeline(stack, {
                actionName: 'DeployToECS',
                deploymentGroup,
                taskDefinitionTemplateFile: artifact1.atPath('task-definition.json'),
                appSpecTemplateFile: artifact2.atPath('appspec-test.yaml'),
                containerImageInputs: [
                    {
                        input: artifact1,
                    },
                    {
                        input: artifact2,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                Stages: [
                    {},
                    {
                        Actions: [
                            {
                                Configuration: {
                                    ApplicationName: 'MyApplication',
                                    DeploymentGroupName: 'MyDeploymentGroup',
                                    TaskDefinitionTemplateArtifact: 'Artifact_Source_GitHub',
                                    AppSpecTemplateArtifact: 'Artifact_Source_GitHub2',
                                    TaskDefinitionTemplatePath: 'task-definition.json',
                                    AppSpecTemplatePath: 'appspec-test.yaml',
                                    Image1ArtifactName: 'Artifact_Source_GitHub',
                                    Image1ContainerName: 'IMAGE',
                                    Image2ArtifactName: 'Artifact_Source_GitHub2',
                                    Image2ContainerName: 'IMAGE',
                                },
                                InputArtifacts: [
                                    {
                                        Name: 'Artifact_Source_GitHub',
                                    },
                                    {
                                        Name: 'Artifact_Source_GitHub2',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });
    test('cross-account cross-region deployment has correct dependency between support stacks', () => {
        // GIVEN
        const stackEnv = { account: '111111111111', region: 'us-east-1' };
        const deployEnv = { account: '222222222222', region: 'us-east-2' };
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Pipe', { env: stackEnv });
        const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'Group', {
            application: codedeploy.EcsApplication.fromEcsApplicationArn(stack, 'Application', `arn:aws:codedeploy:${deployEnv.region}:${deployEnv.account}:application:MyApplication`),
            deploymentGroupName: 'MyGroup',
        });
        // WHEN
        addCodeDeployECSCodePipeline(stack, {
            actionName: 'DeployECS',
            deploymentGroup,
            taskDefinitionTemplateInput: new codepipeline.Artifact('Artifact'),
            appSpecTemplateInput: new codepipeline.Artifact('Artifact2'),
        });
        // THEN - dependency from region stack to account stack
        // (region stack has bucket, account stack has role)
        const asm = app.synth();
        const stacks = Object.fromEntries(asm.stacks.map(s => [s.stackName, s]));
        expect(Object.keys(stacks)).toContain('Pipe-support-us-east-2');
        expect(Object.keys(stacks)).toContain('Pipe-support-222222222222');
        expect(stacks['Pipe-support-us-east-2'].dependencies).toContain(stacks['Pipe-support-222222222222']);
    });
});
function addEcsDeploymentGroup(stack) {
    return codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'EDG', {
        application: codedeploy.EcsApplication.fromEcsApplicationName(stack, 'EA', 'MyApplication'),
        deploymentGroupName: 'MyDeploymentGroup',
    });
}
function addCodeDeployECSCodePipeline(stack, props) {
    new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [
                    new cpactions.GitHubSourceAction({
                        actionName: 'GitHub',
                        output: props.taskDefinitionTemplateInput || props.taskDefinitionTemplateFile.artifact,
                        oauthToken: cdk.SecretValue.unsafePlainText('secret'),
                        owner: 'awslabs',
                        repo: 'aws-cdk',
                    }),
                    new cpactions.GitHubSourceAction({
                        actionName: 'GitHub2',
                        output: props.appSpecTemplateInput || props.appSpecTemplateFile.artifact,
                        oauthToken: cdk.SecretValue.unsafePlainText('secret'),
                        owner: 'awslabs',
                        repo: 'aws-cdk-2',
                    }),
                ],
            },
            {
                stageName: 'Invoke',
                actions: [
                    new cpactions.CodeDeployEcsDeployAction(props),
                ],
            },
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWRlcGxveS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1kZXBsb3ktYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msc0RBQXNEO0FBQ3RELDBEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMsdUNBQXVDO0FBRXZDLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7SUFDNUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUM1QyxJQUFJLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1lBQ2xGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV2RCxNQUFNLG9CQUFvQixHQUFpRCxFQUFFLENBQUM7WUFDOUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUIsb0JBQW9CLENBQUMsSUFBSSxDQUFDO29CQUN4QixLQUFLLEVBQUUsUUFBUTtpQkFDaEIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLElBQUksU0FBUyxDQUFDLHlCQUF5QixDQUFDO29CQUN0QyxVQUFVLEVBQUUsYUFBYTtvQkFDekIsZUFBZTtvQkFDZiwyQkFBMkIsRUFBRSxRQUFRO29CQUNyQyxvQkFBb0IsRUFBRSxRQUFRO29CQUM5QixvQkFBb0I7aUJBQ3JCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrREFBK0QsQ0FBQyxDQUFDO1FBRzlFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJF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QUMsMkJBQTJCLElBQUksS0FBSyxDQUFDLDBCQUEyQixDQUFDLFFBQVE7d0JBQ3ZGLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7d0JBQ3JELEtBQUssRUFBRSxTQUFTO3dCQUNoQixJQUFJLEVBQUUsU0FBUztxQkFDaEIsQ0FBQztvQkFDRixJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDL0IsVUFBVSxFQUFFLFNBQVM7d0JBQ3JCLE1BQU0sRUFBRSxLQUFLLENBQUMsb0JBQW9CLElBQUksS0FBSyxDQUFDLG1CQUFvQixDQUFDLFFBQVE7d0JBQ3pFLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7d0JBQ3JELEtBQUssRUFBRSxTQUFTO3dCQUNoQixJQUFJLEVBQUUsV0FBVztxQkFDbEIsQ0FBQztpQkFDSDthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLE9BQU8sRUFBRTtvQkFDUCxJQUFJLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUM7aUJBQy9DO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWRlcGxveSBmcm9tICdAYXdzLWNkay9hd3MtY29kZWRlcGxveSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ0NvZGVEZXBsb3kgRUNTIERlcGxveSBBY3Rpb24nLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdDb2RlRGVwbG95IEVDUyBEZXBsb3kgQWN0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyBhbiBleGNlcHRpb24gaWYgbW9yZSB0aGFuIDQgY29udGFpbmVyIGltYWdlIGlucHV0cyBhcmUgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cCA9IGFkZEVjc0RlcGxveW1lbnRHcm91cChzdGFjayk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG5cbiAgICAgIGNvbnN0IGNvbnRhaW5lckltYWdlSW5wdXRzOiBjcGFjdGlvbnMuQ29kZURlcGxveUVjc0NvbnRhaW5lckltYWdlSW5wdXRbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgY29udGFpbmVySW1hZ2VJbnB1dHMucHVzaCh7XG4gICAgICAgICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlRGVwbG95RWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95VG9FQ1MnLFxuICAgICAgICAgIGRlcGxveW1lbnRHcm91cCxcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvblRlbXBsYXRlSW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICAgIGFwcFNwZWNUZW1wbGF0ZUlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICBjb250YWluZXJJbWFnZUlucHV0cyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9BY3Rpb24gY2Fubm90IGhhdmUgbW9yZSB0aGFuIDQgY29udGFpbmVyIGltYWdlIGlucHV0cywgZ290OiA1Lyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBib3RoIGFwcHNwZWMgYXJ0aWZhY3QgaW5wdXQgYW5kIGZpbGUgYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZGVwbG95bWVudEdyb3VwID0gYWRkRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQXJ0aWZhY3QnKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0UGF0aCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3RQYXRoKGFydGlmYWN0LCAnaGVsbG8nKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlRGVwbG95RWNzRGVwbG95QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95VG9FQ1MnLFxuICAgICAgICAgIGRlcGxveW1lbnRHcm91cCxcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvblRlbXBsYXRlSW5wdXQ6IGFydGlmYWN0LFxuICAgICAgICAgIGFwcFNwZWNUZW1wbGF0ZUlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICBhcHBTcGVjVGVtcGxhdGVGaWxlOiBhcnRpZmFjdFBhdGgsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvRXhhY3RseSBvbmUgb2YgJ2FwcFNwZWNUZW1wbGF0ZUlucHV0JyBvciAnYXBwU3BlY1RlbXBsYXRlRmlsZScgY2FuIGJlIHByb3ZpZGVkIGluIHRoZSBFQ1MgQ29kZURlcGxveSBBY3Rpb24vKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgYXBwc3BlYyBhcnRpZmFjdCBpbnB1dCBub3IgZmlsZSBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50R3JvdXAgPSBhZGRFY3NEZXBsb3ltZW50R3JvdXAoc3RhY2spO1xuICAgICAgY29uc3QgYXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdCcpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVEZXBsb3lFY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lUb0VDUycsXG4gICAgICAgICAgZGVwbG95bWVudEdyb3VwLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uVGVtcGxhdGVJbnB1dDogYXJ0aWZhY3QsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvU3BlY2lmeWluZyBvbmUgb2YgJ2FwcFNwZWNUZW1wbGF0ZUlucHV0JyBvciAnYXBwU3BlY1RlbXBsYXRlRmlsZScgaXMgcmVxdWlyZWQgZm9yIHRoZSBFQ1MgQ29kZURlcGxveSBBY3Rpb24vKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIGJvdGggdGFzayBkZWZpbml0aW9uIGFydGlmYWN0IGlucHV0IGFuZCBmaWxlIGFyZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cCA9IGFkZEVjc0RlcGxveW1lbnRHcm91cChzdGFjayk7XG4gICAgICBjb25zdCBhcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0Jyk7XG4gICAgICBjb25zdCBhcnRpZmFjdFBhdGggPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0UGF0aChhcnRpZmFjdCwgJ2hlbGxvJyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZURlcGxveUVjc0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveVRvRUNTJyxcbiAgICAgICAgICBkZXBsb3ltZW50R3JvdXAsXG4gICAgICAgICAgdGFza0RlZmluaXRpb25UZW1wbGF0ZUlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvblRlbXBsYXRlRmlsZTogYXJ0aWZhY3RQYXRoLFxuICAgICAgICAgIGFwcFNwZWNUZW1wbGF0ZUlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9FeGFjdGx5IG9uZSBvZiAndGFza0RlZmluaXRpb25UZW1wbGF0ZUlucHV0JyBvciAndGFza0RlZmluaXRpb25UZW1wbGF0ZUZpbGUnIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgRUNTIENvZGVEZXBsb3kgQWN0aW9uLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBuZWl0aGVyIHRhc2sgZGVmaW5pdGlvbiBhcnRpZmFjdCBpbnB1dCBub3IgZmlsZSBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50R3JvdXAgPSBhZGRFY3NEZXBsb3ltZW50R3JvdXAoc3RhY2spO1xuICAgICAgY29uc3QgYXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdCcpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVEZXBsb3lFY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lUb0VDUycsXG4gICAgICAgICAgZGVwbG95bWVudEdyb3VwLFxuICAgICAgICAgIGFwcFNwZWNUZW1wbGF0ZUlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9TcGVjaWZ5aW5nIG9uZSBvZiAndGFza0RlZmluaXRpb25UZW1wbGF0ZUlucHV0JyBvciAndGFza0RlZmluaXRpb25UZW1wbGF0ZUZpbGUnIGlzIHJlcXVpcmVkIGZvciB0aGUgRUNTIENvZGVEZXBsb3kgQWN0aW9uLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZGVmYXVsdHMgdGFzayBkZWZpbml0aW9uIGFuZCBhcHBzcGVjIHRlbXBsYXRlIHBhdGhzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50R3JvdXAgPSBhZGRFY3NEZXBsb3ltZW50R3JvdXAoc3RhY2spO1xuICAgICAgYWRkQ29kZURlcGxveUVDU0NvZGVQaXBlbGluZShzdGFjaywge1xuICAgICAgICBhY3Rpb25OYW1lOiAnRGVwbG95VG9FQ1MnLFxuICAgICAgICBkZXBsb3ltZW50R3JvdXAsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uVGVtcGxhdGVJbnB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnVGFza0RlZkFydGlmYWN0JyksXG4gICAgICAgIGFwcFNwZWNUZW1wbGF0ZUlucHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcHBTcGVjQXJ0aWZhY3QnKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICBTdGFnZXM6IFtcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb25zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvbk5hbWU6ICdNeUFwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgIERlcGxveW1lbnRHcm91cE5hbWU6ICdNeURlcGxveW1lbnRHcm91cCcsXG4gICAgICAgICAgICAgICAgICBUYXNrRGVmaW5pdGlvblRlbXBsYXRlQXJ0aWZhY3Q6ICdUYXNrRGVmQXJ0aWZhY3QnLFxuICAgICAgICAgICAgICAgICAgQXBwU3BlY1RlbXBsYXRlQXJ0aWZhY3Q6ICdBcHBTcGVjQXJ0aWZhY3QnLFxuICAgICAgICAgICAgICAgICAgVGFza0RlZmluaXRpb25UZW1wbGF0ZVBhdGg6ICd0YXNrZGVmLmpzb24nLFxuICAgICAgICAgICAgICAgICAgQXBwU3BlY1RlbXBsYXRlUGF0aDogJ2FwcHNwZWMueWFtbCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBJbnB1dEFydGlmYWN0czogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBOYW1lOiAnVGFza0RlZkFydGlmYWN0JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE5hbWU6ICdBcHBTcGVjQXJ0aWZhY3QnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZGVmYXVsdHMgdGFzayBkZWZpbml0aW9uIHBsYWNlaG9sZGVyIHN0cmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgZGVwbG95bWVudEdyb3VwID0gYWRkRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0MSA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0MiA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGFkZENvZGVEZXBsb3lFQ1NDb2RlUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveVRvRUNTJyxcbiAgICAgICAgZGVwbG95bWVudEdyb3VwLFxuICAgICAgICB0YXNrRGVmaW5pdGlvblRlbXBsYXRlRmlsZTogYXJ0aWZhY3QxLmF0UGF0aCgndGFzay1kZWZpbml0aW9uLmpzb24nKSxcbiAgICAgICAgYXBwU3BlY1RlbXBsYXRlRmlsZTogYXJ0aWZhY3QyLmF0UGF0aCgnYXBwc3BlYy10ZXN0LnlhbWwnKSxcbiAgICAgICAgY29udGFpbmVySW1hZ2VJbnB1dHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbnB1dDogYXJ0aWZhY3QxLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5wdXQ6IGFydGlmYWN0MixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgIFN0YWdlczogW1xuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uTmFtZTogJ015QXBwbGljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgRGVwbG95bWVudEdyb3VwTmFtZTogJ015RGVwbG95bWVudEdyb3VwJyxcbiAgICAgICAgICAgICAgICAgIFRhc2tEZWZpbml0aW9uVGVtcGxhdGVBcnRpZmFjdDogJ0FydGlmYWN0X1NvdXJjZV9HaXRIdWInLFxuICAgICAgICAgICAgICAgICAgQXBwU3BlY1RlbXBsYXRlQXJ0aWZhY3Q6ICdBcnRpZmFjdF9Tb3VyY2VfR2l0SHViMicsXG4gICAgICAgICAgICAgICAgICBUYXNrRGVmaW5pdGlvblRlbXBsYXRlUGF0aDogJ3Rhc2stZGVmaW5pdGlvbi5qc29uJyxcbiAgICAgICAgICAgICAgICAgIEFwcFNwZWNUZW1wbGF0ZVBhdGg6ICdhcHBzcGVjLXRlc3QueWFtbCcsXG4gICAgICAgICAgICAgICAgICBJbWFnZTFBcnRpZmFjdE5hbWU6ICdBcnRpZmFjdF9Tb3VyY2VfR2l0SHViJyxcbiAgICAgICAgICAgICAgICAgIEltYWdlMUNvbnRhaW5lck5hbWU6ICdJTUFHRScsXG4gICAgICAgICAgICAgICAgICBJbWFnZTJBcnRpZmFjdE5hbWU6ICdBcnRpZmFjdF9Tb3VyY2VfR2l0SHViMicsXG4gICAgICAgICAgICAgICAgICBJbWFnZTJDb250YWluZXJOYW1lOiAnSU1BR0UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgSW5wdXRBcnRpZmFjdHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTmFtZTogJ0FydGlmYWN0X1NvdXJjZV9HaXRIdWInLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTmFtZTogJ0FydGlmYWN0X1NvdXJjZV9HaXRIdWIyJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MtYWNjb3VudCBjcm9zcy1yZWdpb24gZGVwbG95bWVudCBoYXMgY29ycmVjdCBkZXBlbmRlbmN5IGJldHdlZW4gc3VwcG9ydCBzdGFja3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFja0VudjogY2RrLkVudmlyb25tZW50ID0geyBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9O1xuICAgIGNvbnN0IGRlcGxveUVudjogY2RrLkVudmlyb25tZW50ID0geyBhY2NvdW50OiAnMjIyMjIyMjIyMjIyJywgcmVnaW9uOiAndXMtZWFzdC0yJyB9O1xuXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUGlwZScsIHsgZW52OiBzdGFja0VudiB9KTtcbiAgICBjb25zdCBkZXBsb3ltZW50R3JvdXAgPSBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cC5mcm9tRWNzRGVwbG95bWVudEdyb3VwQXR0cmlidXRlcyhzdGFjaywgJ0dyb3VwJywge1xuICAgICAgYXBwbGljYXRpb246IGNvZGVkZXBsb3kuRWNzQXBwbGljYXRpb24uZnJvbUVjc0FwcGxpY2F0aW9uQXJuKHN0YWNrLCAnQXBwbGljYXRpb24nLFxuICAgICAgICBgYXJuOmF3czpjb2RlZGVwbG95OiR7ZGVwbG95RW52LnJlZ2lvbn06JHtkZXBsb3lFbnYuYWNjb3VudH06YXBwbGljYXRpb246TXlBcHBsaWNhdGlvbmApLFxuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ015R3JvdXAnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFkZENvZGVEZXBsb3lFQ1NDb2RlUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lFQ1MnLFxuICAgICAgZGVwbG95bWVudEdyb3VwLFxuICAgICAgdGFza0RlZmluaXRpb25UZW1wbGF0ZUlucHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdCcpLFxuICAgICAgYXBwU3BlY1RlbXBsYXRlSW5wdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0MicpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIGRlcGVuZGVuY3kgZnJvbSByZWdpb24gc3RhY2sgdG8gYWNjb3VudCBzdGFja1xuICAgIC8vIChyZWdpb24gc3RhY2sgaGFzIGJ1Y2tldCwgYWNjb3VudCBzdGFjayBoYXMgcm9sZSlcbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgIGNvbnN0IHN0YWNrcyA9IE9iamVjdC5mcm9tRW50cmllcyhhc20uc3RhY2tzLm1hcChzID0+IFtzLnN0YWNrTmFtZSwgc10pKTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMoc3RhY2tzKSkudG9Db250YWluKCdQaXBlLXN1cHBvcnQtdXMtZWFzdC0yJyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKHN0YWNrcykpLnRvQ29udGFpbignUGlwZS1zdXBwb3J0LTIyMjIyMjIyMjIyMicpO1xuXG4gICAgZXhwZWN0KHN0YWNrc1snUGlwZS1zdXBwb3J0LXVzLWVhc3QtMiddLmRlcGVuZGVuY2llcykudG9Db250YWluKHN0YWNrc1snUGlwZS1zdXBwb3J0LTIyMjIyMjIyMjIyMiddKTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gYWRkRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrOiBjZGsuU3RhY2spOiBjb2RlZGVwbG95LklFY3NEZXBsb3ltZW50R3JvdXAge1xuICByZXR1cm4gY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAuZnJvbUVjc0RlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMoXG4gICAgc3RhY2ssICdFREcnLCB7XG4gICAgICBhcHBsaWNhdGlvbjogY29kZWRlcGxveS5FY3NBcHBsaWNhdGlvbi5mcm9tRWNzQXBwbGljYXRpb25OYW1lKFxuICAgICAgICBzdGFjaywgJ0VBJywgJ015QXBwbGljYXRpb24nLFxuICAgICAgKSxcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdNeURlcGxveW1lbnRHcm91cCcsXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZENvZGVEZXBsb3lFQ1NDb2RlUGlwZWxpbmUoc3RhY2s6IGNkay5TdGFjaywgcHJvcHM6IGNwYWN0aW9ucy5Db2RlRGVwbG95RWNzRGVwbG95QWN0aW9uUHJvcHMpIHtcbiAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgIHN0YWdlczogW1xuICAgICAge1xuICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1YicsXG4gICAgICAgICAgICBvdXRwdXQ6IHByb3BzLnRhc2tEZWZpbml0aW9uVGVtcGxhdGVJbnB1dCB8fCBwcm9wcy50YXNrRGVmaW5pdGlvblRlbXBsYXRlRmlsZSEuYXJ0aWZhY3QsXG4gICAgICAgICAgICBvYXV0aFRva2VuOiBjZGsuU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdzZWNyZXQnKSxcbiAgICAgICAgICAgIG93bmVyOiAnYXdzbGFicycsXG4gICAgICAgICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1YjInLFxuICAgICAgICAgICAgb3V0cHV0OiBwcm9wcy5hcHBTcGVjVGVtcGxhdGVJbnB1dCB8fCBwcm9wcy5hcHBTcGVjVGVtcGxhdGVGaWxlIS5hcnRpZmFjdCxcbiAgICAgICAgICAgIG9hdXRoVG9rZW46IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldCcpLFxuICAgICAgICAgICAgb3duZXI6ICdhd3NsYWJzJyxcbiAgICAgICAgICAgIHJlcG86ICdhd3MtY2RrLTInLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnSW52b2tlJyxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZURlcGxveUVjc0RlcGxveUFjdGlvbihwcm9wcyksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufVxuIl19