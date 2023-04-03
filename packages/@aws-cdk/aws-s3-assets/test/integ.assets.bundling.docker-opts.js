"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const assets = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'cdk-integ-assets-bundling-docker-opts');
new assets.Asset(stack, 'BundledAsset', {
    path: path.join(__dirname, 'markdown-asset'),
    bundling: {
        image: core_1.DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')),
        command: [
            'sh', '-c', `
        markdown index.md > /asset-output/index.html
      `,
        ],
        network: 'host',
    },
});
/// !hide
new integ.IntegTest(app, 'cdk-integ-s3-assets-bundling-docker-opts', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmRvY2tlci1vcHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmRvY2tlci1vcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3RDtBQUN4RCw4Q0FBOEM7QUFDOUMsaUNBQWlDO0FBR2pDLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7QUFFdEUsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDdEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDO0lBQzVDLFFBQVEsRUFBRTtRQUNSLEtBQUssRUFBRSxrQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxJQUFJLEVBQUU7O09BRVg7U0FDRjtRQUNELE9BQU8sRUFBRSxNQUFNO0tBQ2hCO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBUztBQUNULElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMENBQTBDLEVBQUU7SUFDbkUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBcHAsIERvY2tlckltYWdlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJy4uL2xpYic7XG5cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnY2RrLWludGVnLWFzc2V0cy1idW5kbGluZy1kb2NrZXItb3B0cycpO1xuXG5uZXcgYXNzZXRzLkFzc2V0KHN0YWNrLCAnQnVuZGxlZEFzc2V0Jywge1xuICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbWFya2Rvd24tYXNzZXQnKSwgLy8gL2Fzc2V0LWlucHV0IGFuZCB3b3JraW5nIGRpcmVjdG9yeSBpbiB0aGUgY29udGFpbmVyXG4gIGJ1bmRsaW5nOiB7XG4gICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21CdWlsZChwYXRoLmpvaW4oX19kaXJuYW1lLCAnYWxwaW5lLW1hcmtkb3duJykpLCAvLyBCdWlsZCBhbiBpbWFnZVxuICAgIGNvbW1hbmQ6IFtcbiAgICAgICdzaCcsICctYycsIGBcbiAgICAgICAgbWFya2Rvd24gaW5kZXgubWQgPiAvYXNzZXQtb3V0cHV0L2luZGV4Lmh0bWxcbiAgICAgIGAsXG4gICAgXSxcbiAgICBuZXR3b3JrOiAnaG9zdCcsXG4gIH0sXG59KTtcbi8vLyAhaGlkZVxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdjZGstaW50ZWctczMtYXNzZXRzLWJ1bmRsaW5nLWRvY2tlci1vcHRzJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7Il19