"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
const aws_codepipeline_1 = require("aws-cdk-lib/aws-codepipeline");
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_codepipeline_actions_1 = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new aws_cdk_lib_1.App({
    treeMetadata: false,
});
const stack1 = new aws_cdk_lib_1.Stack(app, 'integ-pipeline-producer-stack', {
    env: {
        region: 'us-east-1',
    },
    crossRegionReferences: true,
});
const stack2 = new aws_cdk_lib_1.Stack(app, 'integ-pipeline-consumer-stack', {
    env: {
        region: 'us-east-2',
    },
    crossRegionReferences: true,
});
const key = new aws_kms_1.Key(stack1, 'ReplicationKey');
const bucket = new aws_s3_1.Bucket(stack1, 'ReplicationBucket', {
    encryptionKey: key,
    autoDeleteObjects: true,
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const artifact = new aws_codepipeline_1.Artifact();
const pipeline = new aws_codepipeline_1.Pipeline(stack2, 'Pipeline', {
    crossRegionReplicationBuckets: {
        'us-east-1': bucket,
    },
});
const sourceBucket = new aws_s3_1.Bucket(stack2, 'SourceBucket', {
    autoDeleteObjects: true,
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
pipeline.addStage({
    stageName: 'source',
    actions: [new aws_codepipeline_actions_1.S3SourceAction({
            bucket: sourceBucket,
            output: artifact,
            bucketKey: '/somepath',
            actionName: 'Source',
        })],
});
pipeline.addStage({
    stageName: 'stage2',
    actions: [new aws_codepipeline_actions_1.CodeBuildAction({
            input: artifact,
            actionName: 'Build',
            project: new aws_codebuild_1.PipelineProject(stack2, 'Build'),
        })],
});
new integ_tests_alpha_1.IntegTest(app, 'codepipeline-integ-test', {
    testCases: [stack2],
    stackUpdateWorkflow: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aC1yZXBsaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLXdpdGgtcmVwbGljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBNEQ7QUFDNUQsbUVBQWtFO0FBQ2xFLGlEQUEwQztBQUMxQywrQ0FBNEM7QUFDNUMsNkNBQXdEO0FBQ3hELGtFQUF1RDtBQUN2RCxtRkFBdUY7QUFHdkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLFlBQVksRUFBRSxLQUFLO0NBQ3BCLENBQUMsQ0FBQztBQUNILE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDN0QsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLFdBQVc7S0FDcEI7SUFDRCxxQkFBcUIsRUFBRSxJQUFJO0NBQzVCLENBQUMsQ0FBQztBQUNILE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDN0QsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLFdBQVc7S0FDcEI7SUFDRCxxQkFBcUIsRUFBRSxJQUFJO0NBQzVCLENBQUMsQ0FBQztBQUdILE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRTtJQUNyRCxhQUFhLEVBQUUsR0FBRztJQUNsQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7QUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSwyQkFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7SUFDaEQsNkJBQTZCLEVBQUU7UUFDN0IsV0FBVyxFQUFFLE1BQU07S0FDcEI7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQ3RELGlCQUFpQixFQUFFLElBQUk7SUFDdkIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUkseUNBQWMsQ0FBQztZQUMzQixNQUFNLEVBQUUsWUFBWTtZQUNwQixNQUFNLEVBQUUsUUFBUTtZQUNoQixTQUFTLEVBQUUsV0FBVztZQUN0QixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksMENBQWUsQ0FBQztZQUM1QixLQUFLLEVBQUUsUUFBUTtZQUNmLFVBQVUsRUFBRSxPQUFPO1lBQ25CLE9BQU8sRUFBRSxJQUFJLCtCQUFlLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztTQUM5QyxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixFQUFFO0lBQzVDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNuQixtQkFBbUIsRUFBRSxLQUFLO0NBQzNCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGVsaW5lUHJvamVjdCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0IHsgUGlwZWxpbmUsIEFydGlmYWN0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBLZXkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgUzNTb3VyY2VBY3Rpb24sIENvZGVCdWlsZEFjdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIHRyZWVNZXRhZGF0YTogZmFsc2UsXG59KTtcbmNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy1waXBlbGluZS1wcm9kdWNlci1zdGFjaycsIHtcbiAgZW52OiB7XG4gICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgfSxcbiAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxufSk7XG5jb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnaW50ZWctcGlwZWxpbmUtY29uc3VtZXItc3RhY2snLCB7XG4gIGVudjoge1xuICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gIH0sXG4gIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSxcbn0pO1xuXG5cbmNvbnN0IGtleSA9IG5ldyBLZXkoc3RhY2sxLCAnUmVwbGljYXRpb25LZXknKTtcbmNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2sxLCAnUmVwbGljYXRpb25CdWNrZXQnLCB7XG4gIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCBhcnRpZmFjdCA9IG5ldyBBcnRpZmFjdCgpO1xuY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoc3RhY2syLCAnUGlwZWxpbmUnLCB7XG4gIGNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzOiB7XG4gICAgJ3VzLWVhc3QtMSc6IGJ1Y2tldCxcbiAgfSxcbn0pO1xuY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjazIsICdTb3VyY2VCdWNrZXQnLCB7XG4gIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnc291cmNlJyxcbiAgYWN0aW9uczogW25ldyBTM1NvdXJjZUFjdGlvbih7XG4gICAgYnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgb3V0cHV0OiBhcnRpZmFjdCxcbiAgICBidWNrZXRLZXk6ICcvc29tZXBhdGgnLFxuICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICB9KV0sXG59KTtcbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnc3RhZ2UyJyxcbiAgYWN0aW9uczogW25ldyBDb2RlQnVpbGRBY3Rpb24oe1xuICAgIGlucHV0OiBhcnRpZmFjdCxcbiAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgIHByb2plY3Q6IG5ldyBQaXBlbGluZVByb2plY3Qoc3RhY2syLCAnQnVpbGQnKSxcbiAgfSldLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY29kZXBpcGVsaW5lLWludGVnLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrMl0sXG4gIHN0YWNrVXBkYXRlV29ya2Zsb3c6IGZhbHNlLFxufSk7XG4iXX0=