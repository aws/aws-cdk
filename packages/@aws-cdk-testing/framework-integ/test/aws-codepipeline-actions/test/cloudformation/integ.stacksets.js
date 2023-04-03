"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackSetPipelineStack = void 0;
/**
 * This integration test needs 2 accounts properly configured beforehand to properly test,
 * and so is tested by hand.
 *
 * To test:
 *
 * ```
 * env AWS_REGION=eu-west-1 STACKSET_ACCOUNTS=11111111,22222222 cdk deploy -a test/cloudformation/integ.stacksets.js
 * ```
 *
 * Then make the pipeline in your account run.
 *
 * To update the snapshot:
 *
 * ```
 * yarn integ --dry-run cloudformation/integ.stacksets.js
 * ```
 */
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
class StackSetPipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
            artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
                removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
            }),
        });
        const asset = new aws_s3_assets_1.Asset(this, 'Asset', {
            path: `${__dirname}/test-artifact`,
        });
        const sourceOutput = new codepipeline.Artifact('SourceArtifact');
        pipeline.addStage({
            stageName: 'Source',
            actions: [
                new cpactions.S3SourceAction({
                    actionName: 'Source',
                    output: sourceOutput,
                    bucket: asset.bucket,
                    bucketKey: asset.s3ObjectKey,
                }),
            ],
        });
        const accounts = process.env.STACKSET_ACCOUNTS?.split(',') ?? ['1111', '2222'];
        pipeline.addStage({
            stageName: 'Cfn',
            actions: [
                new cpactions.CloudFormationDeployStackSetAction({
                    actionName: 'StackSet',
                    stackSetName: 'TestStackSet',
                    template: cpactions.StackSetTemplate.fromArtifactPath(sourceOutput.atPath('template.yaml')),
                    stackInstances: cpactions.StackInstances.inAccounts(accounts, ['us-east-1', 'eu-west-1']),
                    runOrder: 1,
                }),
                new cpactions.CloudFormationDeployStackInstancesAction({
                    actionName: 'Instances',
                    stackSetName: 'TestStackSet',
                    stackInstances: cpactions.StackInstances.inAccounts(accounts, ['us-east-1', 'eu-west-1']),
                    runOrder: 2,
                }),
            ],
        });
    }
}
exports.StackSetPipelineStack = StackSetPipelineStack;
const app = new aws_cdk_lib_1.App();
new StackSetPipelineStack(app, 'StackSetPipelineStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhY2tzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3RhY2tzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILDZEQUE2RDtBQUM3RCx5Q0FBeUM7QUFDekMsNkRBQWtEO0FBQ2xELDZDQUFvRTtBQUVwRSxrRUFBa0U7QUFFbEUsTUFBYSxxQkFBc0IsU0FBUSxtQkFBSztJQUM5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzNELGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNwRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO2dCQUNwQyxpQkFBaUIsRUFBRSxJQUFJO2FBQ3hCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNyQyxJQUFJLEVBQUUsR0FBRyxTQUFTLGdCQUFnQjtTQUNuQyxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVqRSxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7b0JBQzNCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixNQUFNLEVBQUUsWUFBWTtvQkFDcEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO29CQUNwQixTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVc7aUJBQzdCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9FLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGtDQUFrQyxDQUFDO29CQUMvQyxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsWUFBWSxFQUFFLGNBQWM7b0JBQzVCLFFBQVEsRUFBRSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDM0YsY0FBYyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztvQkFDekYsUUFBUSxFQUFFLENBQUM7aUJBQ1osQ0FBQztnQkFDRixJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQztvQkFDckQsVUFBVSxFQUFFLFdBQVc7b0JBQ3ZCLFlBQVksRUFBRSxjQUFjO29CQUM1QixjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUN6RixRQUFRLEVBQUUsQ0FBQztpQkFDWixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFsREQsc0RBa0RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBpbnRlZ3JhdGlvbiB0ZXN0IG5lZWRzIDIgYWNjb3VudHMgcHJvcGVybHkgY29uZmlndXJlZCBiZWZvcmVoYW5kIHRvIHByb3Blcmx5IHRlc3QsXG4gKiBhbmQgc28gaXMgdGVzdGVkIGJ5IGhhbmQuXG4gKlxuICogVG8gdGVzdDpcbiAqXG4gKiBgYGBcbiAqIGVudiBBV1NfUkVHSU9OPWV1LXdlc3QtMSBTVEFDS1NFVF9BQ0NPVU5UUz0xMTExMTExMSwyMjIyMjIyMiBjZGsgZGVwbG95IC1hIHRlc3QvY2xvdWRmb3JtYXRpb24vaW50ZWcuc3RhY2tzZXRzLmpzXG4gKiBgYGBcbiAqXG4gKiBUaGVuIG1ha2UgdGhlIHBpcGVsaW5lIGluIHlvdXIgYWNjb3VudCBydW4uXG4gKlxuICogVG8gdXBkYXRlIHRoZSBzbmFwc2hvdDpcbiAqXG4gKiBgYGBcbiAqIHlhcm4gaW50ZWcgLS1kcnktcnVuIGNsb3VkZm9ybWF0aW9uL2ludGVnLnN0YWNrc2V0cy5qc1xuICogYGBgXG4gKi9cbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBTdGFja1NldFBpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIGFydGlmYWN0QnVja2V0OiBuZXcgczMuQnVja2V0KHRoaXMsICdBcnRpZmFjdEJ1Y2tldCcsIHtcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXQodGhpcywgJ0Fzc2V0Jywge1xuICAgICAgcGF0aDogYCR7X19kaXJuYW1lfS90ZXN0LWFydGlmYWN0YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZUFydGlmYWN0Jyk7XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBidWNrZXQ6IGFzc2V0LmJ1Y2tldCxcbiAgICAgICAgICBidWNrZXRLZXk6IGFzc2V0LnMzT2JqZWN0S2V5LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IHByb2Nlc3MuZW52LlNUQUNLU0VUX0FDQ09VTlRTPy5zcGxpdCgnLCcpID8/IFsnMTExMScsICcyMjIyJ107XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdDZm4nLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRGVwbG95U3RhY2tTZXRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdTdGFja1NldCcsXG4gICAgICAgICAgc3RhY2tTZXROYW1lOiAnVGVzdFN0YWNrU2V0JyxcbiAgICAgICAgICB0ZW1wbGF0ZTogY3BhY3Rpb25zLlN0YWNrU2V0VGVtcGxhdGUuZnJvbUFydGlmYWN0UGF0aChzb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJykpLFxuICAgICAgICAgIHN0YWNrSW5zdGFuY2VzOiBjcGFjdGlvbnMuU3RhY2tJbnN0YW5jZXMuaW5BY2NvdW50cyhhY2NvdW50cywgWyd1cy1lYXN0LTEnLCAnZXUtd2VzdC0xJ10pLFxuICAgICAgICAgIHJ1bk9yZGVyOiAxLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrSW5zdGFuY2VzQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnSW5zdGFuY2VzJyxcbiAgICAgICAgICBzdGFja1NldE5hbWU6ICdUZXN0U3RhY2tTZXQnLFxuICAgICAgICAgIHN0YWNrSW5zdGFuY2VzOiBjcGFjdGlvbnMuU3RhY2tJbnN0YW5jZXMuaW5BY2NvdW50cyhhY2NvdW50cywgWyd1cy1lYXN0LTEnLCAnZXUtd2VzdC0xJ10pLFxuICAgICAgICAgIHJ1bk9yZGVyOiAyLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFN0YWNrU2V0UGlwZWxpbmVTdGFjayhhcHAsICdTdGFja1NldFBpcGVsaW5lU3RhY2snKTtcbiJdfQ==