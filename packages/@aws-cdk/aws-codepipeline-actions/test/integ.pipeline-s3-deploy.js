"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const cpactions = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-s3-deploy');
const key = new kms.Key(stack, 'EnvVarEncryptKey', {
    description: 'sample key',
});
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    encryptionKey: key,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: 'key',
});
const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const otherDeployBucket = new s3.Bucket(stack, 'OtherDeployBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
    stages: [
        {
            stageName: 'Source',
            actions: [sourceAction],
        },
        {
            stageName: 'Deploy',
            actions: [
                new cpactions.S3DeployAction({
                    actionName: 'DeployAction',
                    extract: false,
                    objectKey: 'key',
                    input: sourceOutput,
                    bucket: deployBucket,
                    accessControl: s3.BucketAccessControl.PRIVATE,
                    cacheControl: [
                        cpactions.CacheControl.setPublic(),
                        cpactions.CacheControl.maxAge(cdk.Duration.hours(12)),
                    ],
                    encryptionKey: key,
                }),
            ],
        },
        {
            stageName: 'Disabled',
            transitionToEnabled: false,
            actions: [
                new cpactions.S3DeployAction({
                    actionName: 'DisabledDeployAction',
                    input: sourceOutput,
                    bucket: otherDeployBucket,
                }),
            ],
        },
    ],
});
const integ = new integ_tests_1.IntegTest(app, 's3-deploy-test', {
    testCases: [stack],
});
integ.assertions.awsApiCall('S3', 'putObject', {
    Bucket: bucket.bucketName,
    Key: 'key',
    Body: 'HelloWorld',
}).next(integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
}).expect(integ_tests_1.ExpectedResult.objectLike({
    stageStates: integ_tests_1.Match.arrayWith([
        integ_tests_1.Match.objectLike({
            stageName: 'Deploy',
            latestExecution: integ_tests_1.Match.objectLike({
                status: 'Succeeded',
            }),
        }),
    ]),
})).waitForAssertions({
    totalTimeout: core_1.Duration.minutes(5),
}).next(integ.assertions.awsApiCall('S3', 'getObject', {
    Bucket: deployBucket.bucketName,
    Key: 'key',
})));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtczMtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtczMtZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBQzFELHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLHdDQUF5QztBQUN6QyxzREFBd0U7QUFDeEUsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUVuRSxNQUFNLEdBQUcsR0FBYSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO0lBQzNELFdBQVcsRUFBRSxZQUFZO0NBQzFCLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDcEQsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0lBQ3hDLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsYUFBYSxFQUFFLEdBQUc7Q0FDbkIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDakUsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDO0lBQ2hELFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLE1BQU07SUFDTixTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFB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Q0FBQztBQUVGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0LCBFeHBlY3RlZFJlc3VsdCwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLXMzLWRlcGxveScpO1xuXG5jb25zdCBrZXk6IGttcy5JS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdFbnZWYXJFbmNyeXB0S2V5Jywge1xuICBkZXNjcmlwdGlvbjogJ3NhbXBsZSBrZXknLFxufSk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdQaXBlbGluZUJ1Y2tldCcsIHtcbiAgdmVyc2lvbmVkOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgZW5jcnlwdGlvbktleToga2V5LFxufSk7XG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6ICdrZXknLFxufSk7XG5cbmNvbnN0IGRlcGxveUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdEZXBsb3lCdWNrZXQnLCB7XG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxufSk7XG5cbmNvbnN0IG90aGVyRGVwbG95QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ090aGVyRGVwbG95QnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbn0pO1xuXG5jb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5TM0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveUFjdGlvbicsXG4gICAgICAgICAgZXh0cmFjdDogZmFsc2UsXG4gICAgICAgICAgb2JqZWN0S2V5OiAna2V5JyxcbiAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgIGJ1Y2tldDogZGVwbG95QnVja2V0LFxuICAgICAgICAgIGFjY2Vzc0NvbnRyb2w6IHMzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuUFJJVkFURSxcbiAgICAgICAgICBjYWNoZUNvbnRyb2w6IFtcbiAgICAgICAgICAgIGNwYWN0aW9ucy5DYWNoZUNvbnRyb2wuc2V0UHVibGljKCksXG4gICAgICAgICAgICBjcGFjdGlvbnMuQ2FjaGVDb250cm9sLm1heEFnZShjZGsuRHVyYXRpb24uaG91cnMoMTIpKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnRGlzYWJsZWQnLFxuICAgICAgdHJhbnNpdGlvblRvRW5hYmxlZDogZmFsc2UsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEaXNhYmxlZERlcGxveUFjdGlvbicsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBidWNrZXQ6IG90aGVyRGVwbG95QnVja2V0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnczMtZGVwbG95LXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5pbnRlZy5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1MzJywgJ3B1dE9iamVjdCcsIHtcbiAgQnVja2V0OiBidWNrZXQuYnVja2V0TmFtZSxcbiAgS2V5OiAna2V5JyxcbiAgQm9keTogJ0hlbGxvV29ybGQnLFxufSkubmV4dChcbiAgaW50ZWcuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdDb2RlUGlwZWxpbmUnLCAnZ2V0UGlwZWxpbmVTdGF0ZScsIHtcbiAgICBuYW1lOiBwaXBlbGluZS5waXBlbGluZU5hbWUsXG4gIH0pLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgICBzdGFnZVN0YXRlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgICAgICBsYXRlc3RFeGVjdXRpb246IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIHN0YXR1czogJ1N1Y2NlZWRlZCcsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgXSksXG4gIH0pKS53YWl0Rm9yQXNzZXJ0aW9ucyh7XG4gICAgdG90YWxUaW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICB9KS5uZXh0KFxuICAgIGludGVnLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnUzMnLCAnZ2V0T2JqZWN0Jywge1xuICAgICAgQnVja2V0OiBkZXBsb3lCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIEtleTogJ2tleScsXG4gICAgfSksXG4gICksXG4pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==