"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@aws-cdk/core");
const codebuild = require("../lib");
const app = new core.App();
const stack = new core.Stack(app, 'aws-deep-learning-container-build-image');
new codebuild.Project(stack, 'Project', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            build: {
                commands: ['ls'],
            },
        },
    }),
    environment: {
        buildImage: codebuild.LinuxGpuBuildImage.DLC_MXNET_1_4_1,
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWRlZXAtbGVhcm5pbmctY29udGFpbmVyLWJ1aWxkLWltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXdzLWRlZXAtbGVhcm5pbmctY29udGFpbmVyLWJ1aWxkLWltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFFN0UsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDdEMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNqQjtTQUNGO0tBQ0YsQ0FBQztJQUNGLFdBQVcsRUFBRTtRQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsZUFBZTtLQUN6RDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNvcmUuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjb3JlLlN0YWNrKGFwcCwgJ2F3cy1kZWVwLWxlYXJuaW5nLWNvbnRhaW5lci1idWlsZC1pbWFnZScpO1xuXG5uZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogWydscyddLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbiAgZW52aXJvbm1lbnQ6IHtcbiAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhHcHVCdWlsZEltYWdlLkRMQ19NWE5FVF8xXzRfMSxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==