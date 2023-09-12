"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const efs = require("aws-cdk-lib/aws-efs");
const ecs = require("aws-cdk-lib/aws-ecs");
const ssm = require("aws-cdk-lib/aws-ssm");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const batch = require("../lib");
const aws_ecr_assets_1 = require("aws-cdk-lib/aws-ecr-assets");
const path = require("path");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'stack');
const vpc = new aws_ec2_1.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });
new batch.EcsJobDefinition(stack, 'ECSJobDefn', {
    container: new batch.EcsEc2ContainerDefinition(stack, 'myContainer', {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        cpu: 256,
        memory: aws_cdk_lib_1.Size.mebibytes(2048),
        environment: {
            foo: 'bar',
        },
        gpu: 12,
        volumes: [
            batch.EcsVolume.host({
                name: 'volumeName',
                hostPath: '/foo/bar',
                containerPath: 'ahhh',
            }),
            batch.EcsVolume.efs({
                fileSystem: new efs.FileSystem(stack, 'myFileSystem', {
                    vpc,
                }),
                name: 'efsVolume',
                containerPath: '/my/path',
            }),
        ],
        ulimits: [{
                hardLimit: 50,
                name: batch.UlimitName.CORE,
                softLimit: 10,
            }],
        secrets: {
            MY_SECRET_ENV_VAR: batch.Secret.fromSecretsManager(new secretsmanager.Secret(stack, 'mySecret')),
            ANOTHER_ONE: batch.Secret.fromSecretsManagerVersion(new secretsmanager.Secret(stack, 'anotherSecret'), {
                versionId: 'foo',
                versionStage: 'bar',
            }),
            SSM_TIME: batch.Secret.fromSsmParameter(new ssm.StringParameter(stack, 'ssm', { stringValue: 'myString' })),
        },
    }),
});
new batch.EcsJobDefinition(stack, 'ECSFargateJobDefn', {
    container: new batch.EcsFargateContainerDefinition(stack, 'myFargateContainer', {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        cpu: 16,
        memory: aws_cdk_lib_1.Size.mebibytes(32768),
        ephemeralStorageSize: aws_cdk_lib_1.Size.gibibytes(100),
        fargatePlatformVersion: aws_ecs_1.FargatePlatformVersion.LATEST,
    }),
    jobDefinitionName: 'foofoo',
    parameters: {
        foo: 'bar',
    },
    propagateTags: true,
    retryAttempts: 5,
    retryStrategies: [
        new batch.RetryStrategy(batch.Action.EXIT, batch.Reason.CANNOT_PULL_CONTAINER),
        new batch.RetryStrategy(batch.Action.RETRY, batch.Reason.NON_ZERO_EXIT_CODE),
        new batch.RetryStrategy(batch.Action.EXIT, batch.Reason.custom({
            onExitCode: '40*',
            onReason: 'reason',
            onStatusReason: 'statusreason',
        })),
    ],
    schedulingPriority: 10,
    timeout: aws_cdk_lib_1.Duration.minutes(10),
});
new batch.EcsJobDefinition(stack, 'ECSDockerJobDefn', {
    container: new batch.EcsEc2ContainerDefinition(stack, 'EcsDockerContainer', {
        cpu: 16,
        memory: aws_cdk_lib_1.Size.mebibytes(32768),
        image: ecs.ContainerImage.fromDockerImageAsset(new aws_ecr_assets_1.DockerImageAsset(stack, 'dockerImageAsset', {
            directory: path.join(__dirname, 'batchjob-image'),
        })),
    }),
});
new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWNzLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWNzLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTBDO0FBQzFDLGlEQUE2RTtBQUM3RSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBeUQ7QUFDekQsb0RBQW9EO0FBQ3BELGdDQUFnQztBQUNoQywrREFBOEQ7QUFDOUQsNkJBQTZCO0FBQzdCLGlFQUFpRTtBQUVqRSxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRTNFLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDOUMsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDbkUsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO1FBQzlELEdBQUcsRUFBRSxHQUFHO1FBQ1IsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM1QixXQUFXLEVBQUU7WUFDWCxHQUFHLEVBQUUsS0FBSztTQUNYO1FBQ0QsR0FBRyxFQUFFLEVBQUU7UUFDUCxPQUFPLEVBQUU7WUFDUCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDbkIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixhQUFhLEVBQUUsTUFBTTthQUN0QixDQUFDO1lBQ0YsS0FB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SyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxpQ0FBZ0IsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDN0YsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDO1NBQ2xELENBQUMsQ0FBQztLQUNKLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWcGMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IENvbnRhaW5lckltYWdlLCBGYXJnYXRlUGxhdGZvcm1WZXJzaW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBlZnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVmcyc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XG5pbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTaXplLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGJhdGNoIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBEb2NrZXJJbWFnZUFzc2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjci1hc3NldHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5jb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAndnBjJywgeyByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZSB9KTtcblxubmV3IGJhdGNoLkVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2JEZWZuJywge1xuICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnbXlDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgY3B1OiAyNTYsXG4gICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICBlbnZpcm9ubWVudDoge1xuICAgICAgZm9vOiAnYmFyJyxcbiAgICB9LFxuICAgIGdwdTogMTIsXG4gICAgdm9sdW1lczogW1xuICAgICAgYmF0Y2guRWNzVm9sdW1lLmhvc3Qoe1xuICAgICAgICBuYW1lOiAndm9sdW1lTmFtZScsXG4gICAgICAgIGhvc3RQYXRoOiAnL2Zvby9iYXInLFxuICAgICAgICBjb250YWluZXJQYXRoOiAnYWhoaCcsXG4gICAgICB9KSxcbiAgICAgIGJhdGNoLkVjc1ZvbHVtZS5lZnMoe1xuICAgICAgICBmaWxlU3lzdGVtOiBuZXcgZWZzLkZpbGVTeXN0ZW0oc3RhY2ssICdteUZpbGVTeXN0ZW0nLCB7XG4gICAgICAgICAgdnBjLFxuICAgICAgICB9KSxcbiAgICAgICAgbmFtZTogJ2Vmc1ZvbHVtZScsXG4gICAgICAgIGNvbnRhaW5lclBhdGg6ICcvbXkvcGF0aCcsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHVsaW1pdHM6IFt7XG4gICAgICBoYXJkTGltaXQ6IDUwLFxuICAgICAgbmFtZTogYmF0Y2guVWxpbWl0TmFtZS5DT1JFLFxuICAgICAgc29mdExpbWl0OiAxMCxcbiAgICB9XSxcbiAgICBzZWNyZXRzOiB7XG4gICAgICBNWV9TRUNSRVRfRU5WX1ZBUjogYmF0Y2guU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnbXlTZWNyZXQnKSksXG4gICAgICBBTk9USEVSX09ORTogYmF0Y2guU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlclZlcnNpb24obmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ2Fub3RoZXJTZWNyZXQnKSwge1xuICAgICAgICB2ZXJzaW9uSWQ6ICdmb28nLFxuICAgICAgICB2ZXJzaW9uU3RhZ2U6ICdiYXInLFxuICAgICAgfSksXG4gICAgICBTU01fVElNRTogYmF0Y2guU2VjcmV0LmZyb21Tc21QYXJhbWV0ZXIobmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdzc20nLCB7IHN0cmluZ1ZhbHVlOiAnbXlTdHJpbmcnIH0pKSxcbiAgICB9LFxuICB9KSxcbn0pO1xuXG5uZXcgYmF0Y2guRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0ZhcmdhdGVKb2JEZWZuJywge1xuICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ215RmFyZ2F0ZUNvbnRhaW5lcicsIHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICBjcHU6IDE2LFxuICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMzI3NjgpLFxuICAgIGVwaGVtZXJhbFN0b3JhZ2VTaXplOiBTaXplLmdpYmlieXRlcygxMDApLFxuICAgIGZhcmdhdGVQbGF0Zm9ybVZlcnNpb246IEZhcmdhdGVQbGF0Zm9ybVZlcnNpb24uTEFURVNULFxuICB9KSxcbiAgam9iRGVmaW5pdGlvbk5hbWU6ICdmb29mb28nLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZm9vOiAnYmFyJyxcbiAgfSxcbiAgcHJvcGFnYXRlVGFnczogdHJ1ZSxcbiAgcmV0cnlBdHRlbXB0czogNSxcbiAgcmV0cnlTdHJhdGVnaWVzOiBbXG4gICAgbmV3IGJhdGNoLlJldHJ5U3RyYXRlZ3koYmF0Y2guQWN0aW9uLkVYSVQsIGJhdGNoLlJlYXNvbi5DQU5OT1RfUFVMTF9DT05UQUlORVIpLFxuICAgIG5ldyBiYXRjaC5SZXRyeVN0cmF0ZWd5KGJhdGNoLkFjdGlvbi5SRVRSWSwgYmF0Y2guUmVhc29uLk5PTl9aRVJPX0VYSVRfQ09ERSksXG4gICAgbmV3IGJhdGNoLlJldHJ5U3RyYXRlZ3koYmF0Y2guQWN0aW9uLkVYSVQsIGJhdGNoLlJlYXNvbi5jdXN0b20oe1xuICAgICAgb25FeGl0Q29kZTogJzQwKicsXG4gICAgICBvblJlYXNvbjogJ3JlYXNvbicsXG4gICAgICBvblN0YXR1c1JlYXNvbjogJ3N0YXR1c3JlYXNvbicsXG4gICAgfSkpLFxuICBdLFxuICBzY2hlZHVsaW5nUHJpb3JpdHk6IDEwLFxuICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDEwKSxcbn0pO1xuXG5uZXcgYmF0Y2guRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0RvY2tlckpvYkRlZm4nLCB7XG4gIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NEb2NrZXJDb250YWluZXInLCB7XG4gICAgY3B1OiAxNixcbiAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDMyNzY4KSxcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Eb2NrZXJJbWFnZUFzc2V0KG5ldyBEb2NrZXJJbWFnZUFzc2V0KHN0YWNrLCAnZG9ja2VySW1hZ2VBc3NldCcsIHtcbiAgICAgIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2JhdGNoam9iLWltYWdlJyksXG4gICAgfSkpLFxuICB9KSxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ0JhdGNoRWNzSm9iRGVmaW5pdGlvblRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==