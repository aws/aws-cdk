"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1zZWNvbmRhcnktc291cmNlcy1hcnRpZmFjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LXNlY29uZGFyeS1zb3VyY2VzLWFydGlmYWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsK0NBQStDLENBQUMsQ0FBQztBQUVsRixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUM5QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ3hDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7SUFDRixnQkFBZ0IsRUFBRTtRQUNoQixTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNsQixNQUFNO1lBQ04sSUFBSSxFQUFFLFdBQVc7WUFDakIsVUFBVSxFQUFFLFlBQVk7U0FDekIsQ0FBQztLQUNIO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDckIsTUFBTTtZQUNOLElBQUksRUFBRSxjQUFjO1lBQ3BCLElBQUksRUFBRSxNQUFNO1lBQ1osVUFBVSxFQUFFLGNBQWM7U0FDM0IsQ0FBQztLQUNIO0lBQ0QsMkJBQTJCLEVBQUUsS0FBSztDQUNuQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1zZWNvbmRhcnktc291cmNlcy1hcnRpZmFjdHMnKTtcblxuY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICB9KSxcbiAgc2Vjb25kYXJ5U291cmNlczogW1xuICAgIGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgYnVja2V0LFxuICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICBpZGVudGlmaWVyOiAnQWRkU291cmNlMScsXG4gICAgfSksXG4gIF0sXG4gIHNlY29uZGFyeUFydGlmYWN0czogW1xuICAgIGNvZGVidWlsZC5BcnRpZmFjdHMuczMoe1xuICAgICAgYnVja2V0LFxuICAgICAgcGF0aDogJ2Fub3RoZXIvcGF0aCcsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBpZGVudGlmaWVyOiAnQWRkQXJ0aWZhY3QxJyxcbiAgICB9KSxcbiAgXSxcbiAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==