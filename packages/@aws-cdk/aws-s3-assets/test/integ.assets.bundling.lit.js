"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const assets = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        const asset = new assets.Asset(this, 'BundledAsset', {
            path: path.join(__dirname, 'markdown-asset'),
            bundling: {
                image: core_1.DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')),
                command: [
                    'sh', '-c', `
            markdown index.md > /asset-output/index.html
          `,
                ],
            },
        });
        /// !hide
        const user = new iam.User(this, 'MyUser');
        asset.grantRead(user);
    }
}
const app = new core_1.App();
new TestStack(app, 'cdk-integ-assets-bundling');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFzc2V0cy5idW5kbGluZy5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLHdDQUFvRTtBQUVwRSxpQ0FBaUM7QUFFakMsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLFNBQVM7UUFDVCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNuRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUM7WUFDNUMsUUFBUSxFQUFFO2dCQUNSLEtBQUssRUFBRSxrQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNyRSxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLElBQUksRUFBRTs7V0FFWDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztRQUVULE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUNoRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXBwLCBEb2NrZXJJbWFnZSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBhc3NldCA9IG5ldyBhc3NldHMuQXNzZXQodGhpcywgJ0J1bmRsZWRBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtYXJrZG93bi1hc3NldCcpLCAvLyAvYXNzZXQtaW5wdXQgYW5kIHdvcmtpbmcgZGlyZWN0b3J5IGluIHRoZSBjb250YWluZXJcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tQnVpbGQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FscGluZS1tYXJrZG93bicpKSwgLy8gQnVpbGQgYW4gaW1hZ2VcbiAgICAgICAgY29tbWFuZDogW1xuICAgICAgICAgICdzaCcsICctYycsIGBcbiAgICAgICAgICAgIG1hcmtkb3duIGluZGV4Lm1kID4gL2Fzc2V0LW91dHB1dC9pbmRleC5odG1sXG4gICAgICAgICAgYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG5cbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdNeVVzZXInKTtcbiAgICBhc3NldC5ncmFudFJlYWQodXNlcik7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctYXNzZXRzLWJ1bmRsaW5nJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==