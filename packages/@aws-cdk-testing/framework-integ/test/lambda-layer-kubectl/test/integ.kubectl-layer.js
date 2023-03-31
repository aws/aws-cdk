"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const cr = require("aws-cdk-lib/custom-resources");
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_1 = require("aws-cdk-lib/lambda-layer-kubectl");
/**
 * Test verifies that kubectl and helm are invoked successfully inside Lambda runtime.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-kubectl-integ-stack');
const layer = new lambda_layer_kubectl_1.KubectlLayer(stack, 'KubectlLayer');
const runtimes = [
    lambda.Runtime.PYTHON_3_7,
    lambda.Runtime.PYTHON_3_9,
];
for (const runtime of runtimes) {
    const provider = new cr.Provider(stack, `Provider${runtime.name}`, {
        onEventHandler: new lambda.Function(stack, `Lambda$${runtime.name}`, {
            code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
            handler: 'index.handler',
            runtime: runtime,
            layers: [layer],
            memorySize: 512,
            timeout: cdk.Duration.seconds(30),
        }),
    });
    new cdk.CustomResource(stack, `CustomResource${runtime.name}`, {
        serviceToken: provider.serviceToken,
    });
}
new integ.IntegTest(app, 'lambda-layer-kubectl-integ-test', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcua3ViZWN0bC1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmt1YmVjdGwtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsaURBQWlEO0FBQ2pELG1DQUFtQztBQUNuQyxtREFBbUQ7QUFDbkQsb0RBQW9EO0FBRXBELDJFQUFnRTtBQUVoRTs7R0FFRztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztBQUNyRSxNQUFNLEtBQUssR0FBRyxJQUFJLG1DQUFZLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRXRELE1BQU0sUUFBUSxHQUFHO0lBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO0lBQ3pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtDQUMxQixDQUFDO0FBRUYsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7SUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNqRSxjQUFjLEVBQUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNuRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRSxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsT0FBTztZQUNoQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDZixVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDbEMsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM3RCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7S0FDcEMsQ0FBQyxDQUFDO0NBQ0o7QUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxFQUFFO0lBQzFELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQixpQkFBaUIsRUFBRTtRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBLdWJlY3RsTGF5ZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9sYW1iZGEtbGF5ZXIta3ViZWN0bCc7XG5cbi8qKlxuICogVGVzdCB2ZXJpZmllcyB0aGF0IGt1YmVjdGwgYW5kIGhlbG0gYXJlIGludm9rZWQgc3VjY2Vzc2Z1bGx5IGluc2lkZSBMYW1iZGEgcnVudGltZS5cbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2xhbWJkYS1sYXllci1rdWJlY3RsLWludGVnLXN0YWNrJyk7XG5jb25zdCBsYXllciA9IG5ldyBLdWJlY3RsTGF5ZXIoc3RhY2ssICdLdWJlY3RsTGF5ZXInKTtcblxuY29uc3QgcnVudGltZXMgPSBbXG4gIGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gIGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG5dO1xuXG5mb3IgKGNvbnN0IHJ1bnRpbWUgb2YgcnVudGltZXMpIHtcbiAgY29uc3QgcHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIoc3RhY2ssIGBQcm92aWRlciR7cnVudGltZS5uYW1lfWAsIHtcbiAgICBvbkV2ZW50SGFuZGxlcjogbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgYExhbWJkYSQke3J1bnRpbWUubmFtZX1gLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYS1oYW5kbGVyJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogcnVudGltZSxcbiAgICAgIGxheWVyczogW2xheWVyXSxcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgbmV3IGNkay5DdXN0b21SZXNvdXJjZShzdGFjaywgYEN1c3RvbVJlc291cmNlJHtydW50aW1lLm5hbWV9YCwge1xuICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICB9KTtcbn1cblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdsYW1iZGEtbGF5ZXIta3ViZWN0bC1pbnRlZy10ZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGNka0NvbW1hbmRPcHRpb25zOiB7XG4gICAgZGVwbG95OiB7XG4gICAgICBhcmdzOiB7XG4gICAgICAgIHJvbGxiYWNrOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXX0=