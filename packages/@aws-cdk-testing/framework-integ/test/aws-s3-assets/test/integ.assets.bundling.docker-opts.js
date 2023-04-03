"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const assets = require("aws-cdk-lib/aws-s3-assets");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'cdk-integ-assets-bundling-docker-opts');
new assets.Asset(stack, 'BundledAsset', {
    path: path.join(__dirname, 'markdown-asset'),
    bundling: {
        image: aws_cdk_lib_1.DockerImage.fromBuild(path.join(__dirname, 'alpine-markdown')),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmRvY2tlci1vcHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXNzZXRzLmJ1bmRsaW5nLmRvY2tlci1vcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDZDQUFzRDtBQUN0RCxvREFBb0Q7QUFDcEQsb0RBQW9EO0FBR3BELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztBQUV0RSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUN0QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUM7SUFDNUMsUUFBUSxFQUFFO1FBQ1IsS0FBSyxFQUFFLHlCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDckUsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLElBQUksRUFBRTs7T0FFWDtTQUNGO1FBQ0QsT0FBTyxFQUFFLE1BQU07S0FDaEI7Q0FDRixDQUFDLENBQUM7QUFDSCxTQUFTO0FBQ1QsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSwwQ0FBMEMsRUFBRTtJQUNuRSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFwcCwgRG9ja2VySW1hZ2UsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuXG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1hc3NldHMtYnVuZGxpbmctZG9ja2VyLW9wdHMnKTtcblxubmV3IGFzc2V0cy5Bc3NldChzdGFjaywgJ0J1bmRsZWRBc3NldCcsIHtcbiAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ21hcmtkb3duLWFzc2V0JyksIC8vIC9hc3NldC1pbnB1dCBhbmQgd29ya2luZyBkaXJlY3RvcnkgaW4gdGhlIGNvbnRhaW5lclxuICBidW5kbGluZzoge1xuICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tQnVpbGQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FscGluZS1tYXJrZG93bicpKSwgLy8gQnVpbGQgYW4gaW1hZ2VcbiAgICBjb21tYW5kOiBbXG4gICAgICAnc2gnLCAnLWMnLCBgXG4gICAgICAgIG1hcmtkb3duIGluZGV4Lm1kID4gL2Fzc2V0LW91dHB1dC9pbmRleC5odG1sXG4gICAgICBgLFxuICAgIF0sXG4gICAgbmV0d29yazogJ2hvc3QnLFxuICB9LFxufSk7XG4vLy8gIWhpZGVcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLXMzLWFzc2V0cy1idW5kbGluZy1kb2NrZXItb3B0cycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==