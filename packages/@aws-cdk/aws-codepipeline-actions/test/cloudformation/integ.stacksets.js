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
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
class StackSetPipelineStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
            artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
                removalPolicy: core_1.RemovalPolicy.DESTROY,
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
const app = new core_1.App();
new StackSetPipelineStack(app, 'StackSetPipelineStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhY2tzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3RhY2tzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILDBEQUEwRDtBQUMxRCxzQ0FBc0M7QUFDdEMsMERBQStDO0FBQy9DLHdDQUFzRTtBQUV0RSx1Q0FBdUM7QUFFdkMsTUFBYSxxQkFBc0IsU0FBUSxZQUFLO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDM0QsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3BELGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87Z0JBQ3BDLGlCQUFpQixFQUFFLElBQUk7YUFDeEIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3JDLElBQUksRUFBRSxHQUFHLFNBQVMsZ0JBQWdCO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWpFLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLE1BQU0sRUFBRSxZQUFZO29CQUNwQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07b0JBQ3BCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVztpQkFDN0IsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFL0UsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsS0FBSztZQUNoQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxTQUFTLENBQUMsa0NBQWtDLENBQUM7b0JBQy9DLFVBQVUsRUFBRSxVQUFVO29CQUN0QixZQUFZLEVBQUUsY0FBYztvQkFDNUIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUMzRixjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUN6RixRQUFRLEVBQUUsQ0FBQztpQkFDWixDQUFDO2dCQUNGLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDO29CQUNyRCxVQUFVLEVBQUUsV0FBVztvQkFDdkIsWUFBWSxFQUFFLGNBQWM7b0JBQzVCLGNBQWMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3pGLFFBQVEsRUFBRSxDQUFDO2lCQUNaLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFsREQsc0RBa0RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHFCQUFxQixDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGludGVncmF0aW9uIHRlc3QgbmVlZHMgMiBhY2NvdW50cyBwcm9wZXJseSBjb25maWd1cmVkIGJlZm9yZWhhbmQgdG8gcHJvcGVybHkgdGVzdCxcbiAqIGFuZCBzbyBpcyB0ZXN0ZWQgYnkgaGFuZC5cbiAqXG4gKiBUbyB0ZXN0OlxuICpcbiAqIGBgYFxuICogZW52IEFXU19SRUdJT049ZXUtd2VzdC0xIFNUQUNLU0VUX0FDQ09VTlRTPTExMTExMTExLDIyMjIyMjIyIGNkayBkZXBsb3kgLWEgdGVzdC9jbG91ZGZvcm1hdGlvbi9pbnRlZy5zdGFja3NldHMuanNcbiAqIGBgYFxuICpcbiAqIFRoZW4gbWFrZSB0aGUgcGlwZWxpbmUgaW4geW91ciBhY2NvdW50IHJ1bi5cbiAqXG4gKiBUbyB1cGRhdGUgdGhlIHNuYXBzaG90OlxuICpcbiAqIGBgYFxuICogeWFybiBpbnRlZyAtLWRyeS1ydW4gY2xvdWRmb3JtYXRpb24vaW50ZWcuc3RhY2tzZXRzLmpzXG4gKiBgYGBcbiAqL1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgY2xhc3MgU3RhY2tTZXRQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBhcnRpZmFjdEJ1Y2tldDogbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQXJ0aWZhY3RCdWNrZXQnLCB7XG4gICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0KHRoaXMsICdBc3NldCcsIHtcbiAgICAgIHBhdGg6IGAke19fZGlybmFtZX0vdGVzdC1hcnRpZmFjdGAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgYnVja2V0OiBhc3NldC5idWNrZXQsXG4gICAgICAgICAgYnVja2V0S2V5OiBhc3NldC5zM09iamVjdEtleSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWNjb3VudHMgPSBwcm9jZXNzLmVudi5TVEFDS1NFVF9BQ0NPVU5UUz8uc3BsaXQoJywnKSA/PyBbJzExMTEnLCAnMjIyMiddO1xuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnQ2ZuJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrU2V0QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnU3RhY2tTZXQnLFxuICAgICAgICAgIHN0YWNrU2V0TmFtZTogJ1Rlc3RTdGFja1NldCcsXG4gICAgICAgICAgdGVtcGxhdGU6IGNwYWN0aW9ucy5TdGFja1NldFRlbXBsYXRlLmZyb21BcnRpZmFjdFBhdGgoc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpKSxcbiAgICAgICAgICBzdGFja0luc3RhbmNlczogY3BhY3Rpb25zLlN0YWNrSW5zdGFuY2VzLmluQWNjb3VudHMoYWNjb3VudHMsIFsndXMtZWFzdC0xJywgJ2V1LXdlc3QtMSddKSxcbiAgICAgICAgICBydW5PcmRlcjogMSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja0luc3RhbmNlc0FjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0luc3RhbmNlcycsXG4gICAgICAgICAgc3RhY2tTZXROYW1lOiAnVGVzdFN0YWNrU2V0JyxcbiAgICAgICAgICBzdGFja0luc3RhbmNlczogY3BhY3Rpb25zLlN0YWNrSW5zdGFuY2VzLmluQWNjb3VudHMoYWNjb3VudHMsIFsndXMtZWFzdC0xJywgJ2V1LXdlc3QtMSddKSxcbiAgICAgICAgICBydW5PcmRlcjogMixcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBTdGFja1NldFBpcGVsaW5lU3RhY2soYXBwLCAnU3RhY2tTZXRQaXBlbGluZVN0YWNrJyk7XG4iXX0=