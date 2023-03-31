"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const kms = require("aws-cdk-lib/aws-kms");
const logs = require("aws-cdk-lib/aws-logs");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ecs = require("aws-cdk-lib/aws-ecs");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-exec-command');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const kmsKey = new kms.Key(stack, 'KmsKey');
const logGroup = new logs.LogGroup(stack, 'LogGroup', {
    encryptionKey: kmsKey,
});
const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
    encryptionKey: kmsKey,
});
const cluster = new ecs.Cluster(stack, 'FargateCluster', {
    vpc,
    executeCommandConfiguration: {
        kmsKey,
        logConfiguration: {
            cloudWatchLogGroup: logGroup,
            cloudWatchEncryptionEnabled: true,
            s3Bucket: execBucket,
            s3EncryptionEnabled: true,
            s3KeyPrefix: 'exec-output',
        },
        logging: ecs.ExecuteCommandLogging.OVERRIDE,
    },
});
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    healthCheck: {
        command: ['CMD-SHELL', 'curl localhost:8000'],
        interval: aws_cdk_lib_1.Duration.seconds(60),
        timeout: aws_cdk_lib_1.Duration.seconds(40),
    },
});
new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
    enableExecuteCommand: true,
});
new integ.IntegTest(app, 'exec-command-integ-test', {
    testCases: [stack],
    diffAssets: true,
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXhlYy1jb21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZXhlYy1jb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyw2Q0FBdUM7QUFDdkMsb0RBQW9EO0FBQ3BELDJDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7QUFFL0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRTVDLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQ3BELGFBQWEsRUFBRSxNQUFNO0NBQ3RCLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO0lBQ3ZELGFBQWEsRUFBRSxNQUFNO0NBQ3RCLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDdkQsR0FBRztJQUNILDJCQUEyQixFQUFFO1FBQzNCLE1BQU07UUFDTixnQkFBZ0IsRUFBRTtZQUNoQixrQkFBa0IsRUFBRSxRQUFRO1lBQzVCLDJCQUEyQixFQUFFLElBQUk7WUFDakMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixXQUFXLEVBQUUsYUFBYTtTQUMzQjtRQUNELE9BQU8sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsUUFBUTtLQUM1QztDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUV2RSxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtJQUNqQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7SUFDbEUsV0FBVyxFQUFFO1FBQ1gsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDO1FBQzdDLFFBQVEsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDOUIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztLQUM5QjtDQUNGLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDOUMsT0FBTztJQUNQLGNBQWM7SUFDZCxvQkFBb0IsRUFBRSxJQUFJO0NBQzNCLENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDbEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtZWNzLWludGVnLWV4ZWMtY29tbWFuZCcpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG5jb25zdCBrbXNLZXkgPSBuZXcga21zLktleShzdGFjaywgJ0ttc0tleScpO1xuXG5jb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gIGVuY3J5cHRpb25LZXk6IGttc0tleSxcbn0pO1xuXG5jb25zdCBleGVjQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0Vjc0V4ZWNCdWNrZXQnLCB7XG4gIGVuY3J5cHRpb25LZXk6IGttc0tleSxcbn0pO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7XG4gIHZwYyxcbiAgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uOiB7XG4gICAga21zS2V5LFxuICAgIGxvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgIGNsb3VkV2F0Y2hMb2dHcm91cDogbG9nR3JvdXAsXG4gICAgICBjbG91ZFdhdGNoRW5jcnlwdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICBzM0J1Y2tldDogZXhlY0J1Y2tldCxcbiAgICAgIHMzRW5jcnlwdGlvbkVuYWJsZWQ6IHRydWUsXG4gICAgICBzM0tleVByZWZpeDogJ2V4ZWMtb3V0cHV0JyxcbiAgICB9LFxuICAgIGxvZ2dpbmc6IGVjcy5FeGVjdXRlQ29tbWFuZExvZ2dpbmcuT1ZFUlJJREUsXG4gIH0sXG59KTtcblxuY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxudGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgaGVhbHRoQ2hlY2s6IHtcbiAgICBjb21tYW5kOiBbJ0NNRC1TSEVMTCcsICdjdXJsIGxvY2FsaG9zdDo4MDAwJ10sXG4gICAgaW50ZXJ2YWw6IER1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoNDApLFxuICB9LFxufSk7XG5cbm5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgdGFza0RlZmluaXRpb24sXG4gIGVuYWJsZUV4ZWN1dGVDb21tYW5kOiB0cnVlLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnZXhlYy1jb21tYW5kLWludGVnLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgZGlmZkFzc2V0czogdHJ1ZSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==