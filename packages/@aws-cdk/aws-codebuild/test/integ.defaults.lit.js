"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        new codebuild.Project(this, 'MyProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            'echo "Hello, CodeBuild!"',
                        ],
                    },
                },
            }),
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'codebuild-default-project');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGVmYXVsdHMubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZGVmYXVsdHMubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsU0FBUztRQUNULElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUU7NEJBQ1IsMEJBQTBCO3lCQUMzQjtxQkFDRjtpQkFDRjthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7S0FFSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFaEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vLyAhc2hvd1xuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCAnTXlQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICdlY2hvIFwiSGVsbG8sIENvZGVCdWlsZCFcIicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2NvZGVidWlsZC1kZWZhdWx0LXByb2plY3QnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=