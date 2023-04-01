"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWRlZXAtbGVhcm5pbmctY29udGFpbmVyLWJ1aWxkLWltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXdzLWRlZXAtbGVhcm5pbmctY29udGFpbmVyLWJ1aWxkLWltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQW9DO0FBQ3BDLHVEQUF1RDtBQUV2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFFN0UsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDdEMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNqQjtTQUNGO0tBQ0YsQ0FBQztJQUNGLFdBQVcsRUFBRTtRQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsZUFBZTtLQUN6RDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuXG5jb25zdCBhcHAgPSBuZXcgY29yZS5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNvcmUuU3RhY2soYXBwLCAnYXdzLWRlZXAtbGVhcm5pbmctY29udGFpbmVyLWJ1aWxkLWltYWdlJyk7XG5cbm5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiBbJ2xzJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuICBlbnZpcm9ubWVudDoge1xuICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEdwdUJ1aWxkSW1hZ2UuRExDX01YTkVUXzFfNF8xLFxuICB9LFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19