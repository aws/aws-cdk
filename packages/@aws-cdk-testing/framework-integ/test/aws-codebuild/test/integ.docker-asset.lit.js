"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        new codebuild.Project(this, 'MyProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: ['ls'],
                    },
                },
            }),
            grantReportGroupPermissions: false,
            /// !show
            environment: {
                buildImage: codebuild.LinuxBuildImage.fromAsset(this, 'MyImage', {
                    directory: path.join(__dirname, 'demo-image'),
                }),
            },
            /// !hide
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-docker-asset');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9ja2VyLWFzc2V0LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRvY2tlci1hc3NldC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUV2RCxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNMLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQztxQkFDakI7aUJBQ0Y7YUFDRixDQUFDO1lBQ0YsMkJBQTJCLEVBQUUsS0FBSztZQUNsQyxTQUFTO1lBQ1QsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO29CQUMvRCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO2lCQUM5QyxDQUFDO2FBQ0g7WUFDRCxTQUFTO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFFbEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCAnTXlQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbJ2xzJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIC8vLyAhc2hvd1xuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5mcm9tQXNzZXQodGhpcywgJ015SW1hZ2UnLCB7XG4gICAgICAgICAgZGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby1pbWFnZScpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgICAvLy8gIWhpZGVcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ3Rlc3QtY29kZWJ1aWxkLWRvY2tlci1hc3NldCcpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==