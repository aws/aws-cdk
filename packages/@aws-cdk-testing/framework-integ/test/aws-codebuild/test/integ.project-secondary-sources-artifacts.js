"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-secondary-sources-artifacts');
const bucket = new s3.Bucket(stack, 'MyBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new codebuild.Project(stack, 'MyProject', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
    }),
    secondarySources: [
        codebuild.Source.s3({
            bucket,
            path: 'some/path',
            identifier: 'AddSource1',
        }),
    ],
    secondaryArtifacts: [
        codebuild.Artifacts.s3({
            bucket,
            path: 'another/path',
            name: 'name',
            identifier: 'AddArtifact1',
        }),
    ],
    grantReportGroupPermissions: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1zZWNvbmRhcnktc291cmNlcy1hcnRpZmFjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LXNlY29uZGFyeS1zb3VyY2VzLWFydGlmYWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBRXZELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsK0NBQStDLENBQUMsQ0FBQztBQUVsRixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUM5QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ3hDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7SUFDRixnQkFBZ0IsRUFBRTtRQUNoQixTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNsQixNQUFNO1lBQ04sSUFBSSxFQUFFLFdBQVc7WUFDakIsVUFBVSxFQUFFLFlBQVk7U0FDekIsQ0FBQztLQUNIO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDckIsTUFBTTtZQUNOLElBQUksRUFBRSxjQUFjO1lBQ3BCLElBQUksRUFBRSxNQUFNO1lBQ1osVUFBVSxFQUFFLGNBQWM7U0FDM0IsQ0FBQztLQUNIO0lBQ0QsMkJBQTJCLEVBQUUsS0FBSztDQUNuQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZWJ1aWxkLXNlY29uZGFyeS1zb3VyY2VzLWFydGlmYWN0cycpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxubmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gIH0pLFxuICBzZWNvbmRhcnlTb3VyY2VzOiBbXG4gICAgY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICBidWNrZXQsXG4gICAgICBwYXRoOiAnc29tZS9wYXRoJyxcbiAgICAgIGlkZW50aWZpZXI6ICdBZGRTb3VyY2UxJyxcbiAgICB9KSxcbiAgXSxcbiAgc2Vjb25kYXJ5QXJ0aWZhY3RzOiBbXG4gICAgY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICBidWNrZXQsXG4gICAgICBwYXRoOiAnYW5vdGhlci9wYXRoJyxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGlkZW50aWZpZXI6ICdBZGRBcnRpZmFjdDEnLFxuICAgIH0pLFxuICBdLFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19