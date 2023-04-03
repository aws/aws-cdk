"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const aws_kms_1 = require("@aws-cdk/aws-kms");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App({
    treeMetadata: false,
});
const stack1 = new core_1.Stack(app, 'integ-pipeline-producer-stack', {
    env: {
        region: 'us-east-1',
    },
    crossRegionReferences: true,
});
const stack2 = new core_1.Stack(app, 'integ-pipeline-consumer-stack', {
    env: {
        region: 'us-east-2',
    },
    crossRegionReferences: true,
});
const key = new aws_kms_1.Key(stack1, 'ReplicationKey');
const bucket = new aws_s3_1.Bucket(stack1, 'ReplicationBucket', {
    encryptionKey: key,
    autoDeleteObjects: true,
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
const artifact = new aws_codepipeline_1.Artifact();
const pipeline = new aws_codepipeline_1.Pipeline(stack2, 'Pipeline', {
    crossRegionReplicationBuckets: {
        'us-east-1': bucket,
    },
});
const sourceBucket = new aws_s3_1.Bucket(stack2, 'SourceBucket', {
    autoDeleteObjects: true,
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
pipeline.addStage({
    stageName: 'source',
    actions: [new lib_1.S3SourceAction({
            bucket: sourceBucket,
            output: artifact,
            bucketKey: '/somepath',
            actionName: 'Source',
        })],
});
pipeline.addStage({
    stageName: 'stage2',
    actions: [new lib_1.CodeBuildAction({
            input: artifact,
            actionName: 'Build',
            project: new aws_codebuild_1.PipelineProject(stack2, 'Build'),
        })],
});
new integ_tests_1.IntegTest(app, 'codepipeline-integ-test', {
    testCases: [stack2],
    stackUpdateWorkflow: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aC1yZXBsaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLXdpdGgtcmVwbGljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBeUQ7QUFDekQsZ0VBQStEO0FBQy9ELDhDQUF1QztBQUN2Qyw0Q0FBeUM7QUFDekMsd0NBQTBEO0FBQzFELHNEQUFpRDtBQUNqRCxnQ0FBeUQ7QUFHekQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLENBQUM7SUFDbEIsWUFBWSxFQUFFLEtBQUs7Q0FDcEIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLCtCQUErQixFQUFFO0lBQzdELEdBQUcsRUFBRTtRQUNILE1BQU0sRUFBRSxXQUFXO0tBQ3BCO0lBQ0QscUJBQXFCLEVBQUUsSUFBSTtDQUM1QixDQUFDLENBQUM7QUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDN0QsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLFdBQVc7S0FDcEI7SUFDRCxxQkFBcUIsRUFBRSxJQUFJO0NBQzVCLENBQUMsQ0FBQztBQUdILE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRTtJQUNyRCxhQUFhLEVBQUUsR0FBRztJQUNsQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7QUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQkFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7SUFDaEQsNkJBQTZCLEVBQUU7UUFDN0IsV0FBVyxFQUFFLE1BQU07S0FDcEI7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQ3RELGlCQUFpQixFQUFFLElBQUk7SUFDdkIsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksb0JBQWMsQ0FBQztZQUMzQixNQUFNLEVBQUUsWUFBWTtZQUNwQixNQUFNLEVBQUUsUUFBUTtZQUNoQixTQUFTLEVBQUUsV0FBVztZQUN0QixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUkscUJBQWUsQ0FBQztZQUM1QixLQUFLLEVBQUUsUUFBUTtZQUNmLFVBQVUsRUFBRSxPQUFPO1lBQ25CLE9BQU8sRUFBRSxJQUFJLCtCQUFlLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztTQUM5QyxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixFQUFFO0lBQzVDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNuQixtQkFBbUIsRUFBRSxLQUFLO0NBQzNCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGVsaW5lUHJvamVjdCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0IHsgUGlwZWxpbmUsIEFydGlmYWN0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBLZXkgfSBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBTM1NvdXJjZUFjdGlvbiwgQ29kZUJ1aWxkQWN0aW9uIH0gZnJvbSAnLi4vbGliJztcblxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgdHJlZU1ldGFkYXRhOiBmYWxzZSxcbn0pO1xuY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ2ludGVnLXBpcGVsaW5lLXByb2R1Y2VyLXN0YWNrJywge1xuICBlbnY6IHtcbiAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICB9LFxuICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG59KTtcbmNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy1waXBlbGluZS1jb25zdW1lci1zdGFjaycsIHtcbiAgZW52OiB7XG4gICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgfSxcbiAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxufSk7XG5cblxuY29uc3Qga2V5ID0gbmV3IEtleShzdGFjazEsICdSZXBsaWNhdGlvbktleScpO1xuY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjazEsICdSZXBsaWNhdGlvbkJ1Y2tldCcsIHtcbiAgZW5jcnlwdGlvbktleToga2V5LFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IGFydGlmYWN0ID0gbmV3IEFydGlmYWN0KCk7XG5jb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZShzdGFjazIsICdQaXBlbGluZScsIHtcbiAgY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHM6IHtcbiAgICAndXMtZWFzdC0xJzogYnVja2V0LFxuICB9LFxufSk7XG5jb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrMiwgJ1NvdXJjZUJ1Y2tldCcsIHtcbiAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdzb3VyY2UnLFxuICBhY3Rpb25zOiBbbmV3IFMzU291cmNlQWN0aW9uKHtcbiAgICBidWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICBvdXRwdXQ6IGFydGlmYWN0LFxuICAgIGJ1Y2tldEtleTogJy9zb21lcGF0aCcsXG4gICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gIH0pXSxcbn0pO1xucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdzdGFnZTInLFxuICBhY3Rpb25zOiBbbmV3IENvZGVCdWlsZEFjdGlvbih7XG4gICAgaW5wdXQ6IGFydGlmYWN0LFxuICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgcHJvamVjdDogbmV3IFBpcGVsaW5lUHJvamVjdChzdGFjazIsICdCdWlsZCcpLFxuICB9KV0sXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdjb2RlcGlwZWxpbmUtaW50ZWctdGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2syXSxcbiAgc3RhY2tVcGRhdGVXb3JrZmxvdzogZmFsc2UsXG59KTtcbiJdfQ==