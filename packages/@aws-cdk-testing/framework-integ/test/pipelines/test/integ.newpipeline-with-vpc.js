"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const s3_assets = require("aws-cdk-lib/aws-s3-assets");
const sqs = require("aws-cdk-lib/aws-sqs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines = require("aws-cdk-lib/pipelines");
class PipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc');
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            codeBuildDefaults: { vpc },
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.gitHub('aws/aws-cdk', 'v2-main'),
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth',
                ],
            }),
        });
        pipeline.addStage(new AppStage(this, 'Beta'));
    }
}
class AppStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'Stack1');
        new s3_assets.Asset(stack, 'Asset', {
            path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
        });
        new s3_assets.Asset(stack, 'Asset2', {
            path: path.join(__dirname, 'testhelpers/assets/test-file-asset-two.txt'),
        });
        new sqs.Queue(stack, 'OtherQueue');
    }
}
const app = new aws_cdk_lib_1.App({
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
    },
});
new PipelineStack(app, 'PipelineStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmV3cGlwZWxpbmUtd2l0aC12cGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5uZXdwaXBlbGluZS13aXRoLXZwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUE2RDtBQUM3RCx5RkFBeUY7QUFDekYsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyx1REFBdUQ7QUFDdkQsMkNBQTJDO0FBQzNDLDZDQUF3RTtBQUV4RSxtREFBbUQ7QUFFbkQsTUFBTSxhQUFjLFNBQVEsbUJBQUs7SUFDL0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJDLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELGlCQUFpQixFQUFFLEVBQUUsR0FBRyxFQUFFO1lBQzFCLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUN0QyxLQUFLLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDO2dCQUNwRSxRQUFRLEVBQUU7b0JBQ1IsUUFBUTtvQkFDUixlQUFlO29CQUNmLGVBQWU7aUJBQ2hCO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBRUQsTUFBTSxRQUFTLFNBQVEsbUJBQUs7SUFDMUIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3Q0FBd0MsQ0FBQztTQUNyRSxDQUFDLENBQUM7UUFDSCxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUNuQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsNENBQTRDLENBQUM7U0FDekUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsT0FBTyxFQUFFO1FBQ1Asc0NBQXNDLEVBQUUsR0FBRztLQUM1QztDQUNGLENBQUMsQ0FBQztBQUNILElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG4vLy8gIWNkay1pbnRlZyBQaXBlbGluZVN0YWNrIHByYWdtYTpzZXQtY29udGV4dDpAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9dHJ1ZVxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcblxuY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJyk7XG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIGNvZGVCdWlsZERlZmF1bHRzOiB7IHZwYyB9LFxuICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuZ2l0SHViKCdhd3MvYXdzLWNkaycsICd2Mi1tYWluJyksXG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICAgJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAgICducHggY2RrIHN5bnRoJyxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2UobmV3IEFwcFN0YWdlKHRoaXMsICdCZXRhJykpO1xuICB9XG59XG5cbmNsYXNzIEFwcFN0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHRoaXMsICdTdGFjazEnKTtcbiAgICBuZXcgczNfYXNzZXRzLkFzc2V0KHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdGhlbHBlcnMvYXNzZXRzL3Rlc3QtZmlsZS1hc3NldC50eHQnKSxcbiAgICB9KTtcbiAgICBuZXcgczNfYXNzZXRzLkFzc2V0KHN0YWNrLCAnQXNzZXQyJywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3RoZWxwZXJzL2Fzc2V0cy90ZXN0LWZpbGUtYXNzZXQtdHdvLnR4dCcpLFxuICAgIH0pO1xuXG4gICAgbmV3IHNxcy5RdWV1ZShzdGFjaywgJ090aGVyUXVldWUnKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgY29udGV4dDoge1xuICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiAnMScsXG4gIH0sXG59KTtcbm5ldyBQaXBlbGluZVN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snKTtcbmFwcC5zeW50aCgpO1xuIl19