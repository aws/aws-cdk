"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
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
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-docker-asset');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9ja2VyLWFzc2V0LmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRvY2tlci1hc3NldC5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNMLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQztxQkFDakI7aUJBQ0Y7YUFDRixDQUFDO1lBQ0YsMkJBQTJCLEVBQUUsS0FBSztZQUNsQyxTQUFTO1lBQ1QsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO29CQUMvRCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO2lCQUM5QyxDQUFDO2FBQ0g7U0FFRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFFbEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ015UHJvamVjdCcsIHtcbiAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgdmVyc2lvbjogJzAuMicsXG4gICAgICAgIHBoYXNlczoge1xuICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogWydscyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICAvLy8gIXNob3dcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbUFzc2V0KHRoaXMsICdNeUltYWdlJywge1xuICAgICAgICAgIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgLy8vICFoaWRlXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICd0ZXN0LWNvZGVidWlsZC1kb2NrZXItYXNzZXQnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=