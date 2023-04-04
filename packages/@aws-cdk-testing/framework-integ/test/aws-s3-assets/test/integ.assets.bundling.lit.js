"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-s3-assets");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        const asset = new assets.Asset(this, 'BundledAsset', {
            path: path.join(__dirname, 'markdown-asset'),
            bundling: {
                image: aws_cdk_lib_1.DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')),
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
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-assets-bundling');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFzc2V0cy5idW5kbGluZy5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDZDQUFrRTtBQUVsRSxvREFBb0Q7QUFFcEQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixTQUFTO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbkQsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDO1lBQzVDLFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUseUJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDckUsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJLEVBQUU7O1dBRVg7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILFNBQVM7UUFFVCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFDaEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEFwcCwgRG9ja2VySW1hZ2UsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBhc3NldCA9IG5ldyBhc3NldHMuQXNzZXQodGhpcywgJ0J1bmRsZWRBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdtYXJrZG93bi1hc3NldCcpLCAvLyAvYXNzZXQtaW5wdXQgYW5kIHdvcmtpbmcgZGlyZWN0b3J5IGluIHRoZSBjb250YWluZXJcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tQnVpbGQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FscGluZS1tYXJrZG93bicpKSwgLy8gQnVpbGQgYW4gaW1hZ2VcbiAgICAgICAgY29tbWFuZDogW1xuICAgICAgICAgICdzaCcsICctYycsIGBcbiAgICAgICAgICAgIG1hcmtkb3duIGluZGV4Lm1kID4gL2Fzc2V0LW91dHB1dC9pbmRleC5odG1sXG4gICAgICAgICAgYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG5cbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdNeVVzZXInKTtcbiAgICBhc3NldC5ncmFudFJlYWQodXNlcik7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctYXNzZXRzLWJ1bmRsaW5nJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==