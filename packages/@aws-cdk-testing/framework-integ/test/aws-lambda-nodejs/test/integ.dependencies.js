"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
class SdkV2TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // This function uses aws-sdk but it will not be included
        this.lambdaFunction = new lambda.NodejsFunction(this, 'external', {
            entry: path.join(__dirname, 'integ-handlers/dependencies.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
            bundling: {
                minify: true,
                // Will be installed, not bundled
                // (delay is a zero dependency package and its version is fixed
                // in the package.json to ensure a stable hash for this integ test)
                nodeModules: ['delay'],
                forceDockerBundling: true,
            },
        });
    }
}
class SdkV3TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // This function uses @aws-sdk/* but it will not be included
        this.lambdaFunction = new lambda.NodejsFunction(this, 'external-sdk-v3', {
            entry: path.join(__dirname, 'integ-handlers/dependencies-sdk-v3.ts'),
            runtime: aws_lambda_1.Runtime.NODEJS_18_X,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const sdkV2testCase = new SdkV2TestStack(app, 'cdk-integ-lambda-nodejs-dependencies');
const sdkV3testCase = new SdkV3TestStack(app, 'cdk-integ-lambda-nodejs-dependencies-for-sdk-v3');
const integ = new integ_tests_alpha_1.IntegTest(app, 'LambdaDependencies', {
    testCases: [sdkV2testCase, sdkV3testCase],
});
for (const testCase of [sdkV2testCase, sdkV3testCase]) {
    const response = integ.assertions.invokeFunction({
        functionName: testCase.lambdaFunction.functionName,
    });
    response.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
        // expect invoking without error
        StatusCode: 200,
        ExecutedVersion: '$LATEST',
        Payload: 'null',
    }));
}
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHVEQUE0RDtBQUM1RCw2Q0FBcUQ7QUFDckQsa0VBQXVFO0FBRXZFLHdEQUF3RDtBQUV4RCxNQUFNLGNBQWUsU0FBUSxtQkFBSztJQUdoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2hFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQztZQUM3RCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUUsSUFBSTtnQkFDWixpQ0FBaUM7Z0JBQ2pDLCtEQUErRDtnQkFDL0QsbUVBQW1FO2dCQUNuRSxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLG1CQUFtQixFQUFFLElBQUk7YUFDMUI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGNBQWUsU0FBUSxtQkFBSztJQUdoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDREQUE0RDtRQUM1RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDdkUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHVDQUF1QyxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7U0FDN0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7QUFDdEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLGlEQUFpRCxDQUFDLENBQUM7QUFFakcsTUFBTSxLQUFLLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUNyRCxTQUFTLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDO0NBQzFDLENBQUMsQ0FBQztBQUVILEtBQUssTUFBTSxRQUFRLElBQUksQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLEVBQUU7SUFDckQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDL0MsWUFBWSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWTtLQUNuRCxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO1FBQ3hDLGdDQUFnQztRQUNoQyxVQUFVLEVBQUUsR0FBRztRQUNmLGVBQWUsRUFBRSxTQUFTO1FBQzFCLE9BQU8sRUFBRSxNQUFNO0tBQ2hCLENBQUMsQ0FBQyxDQUFDO0NBQ0w7QUFFRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUnVudGltZSwgSUZ1bmN0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgRXhwZWN0ZWRSZXN1bHQsIEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcblxuY2xhc3MgU2RrVjJUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHB1YmxpYyBsYW1iZGFGdW5jdGlvbjogSUZ1bmN0aW9uXG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHVzZXMgYXdzLXNkayBidXQgaXQgd2lsbCBub3QgYmUgaW5jbHVkZWRcbiAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5Ob2RlanNGdW5jdGlvbih0aGlzLCAnZXh0ZXJuYWwnLCB7XG4gICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ludGVnLWhhbmRsZXJzL2RlcGVuZGVuY2llcy50cycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgLy8gV2lsbCBiZSBpbnN0YWxsZWQsIG5vdCBidW5kbGVkXG4gICAgICAgIC8vIChkZWxheSBpcyBhIHplcm8gZGVwZW5kZW5jeSBwYWNrYWdlIGFuZCBpdHMgdmVyc2lvbiBpcyBmaXhlZFxuICAgICAgICAvLyBpbiB0aGUgcGFja2FnZS5qc29uIHRvIGVuc3VyZSBhIHN0YWJsZSBoYXNoIGZvciB0aGlzIGludGVnIHRlc3QpXG4gICAgICAgIG5vZGVNb2R1bGVzOiBbJ2RlbGF5J10sXG4gICAgICAgIGZvcmNlRG9ja2VyQnVuZGxpbmc6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFNka1YzVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgbGFtYmRhRnVuY3Rpb246IElGdW5jdGlvblxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB1c2VzIEBhd3Mtc2RrLyogYnV0IGl0IHdpbGwgbm90IGJlIGluY2x1ZGVkXG4gICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ2V4dGVybmFsLXNkay12MycsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvZGVwZW5kZW5jaWVzLXNkay12My50cycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzZGtWMnRlc3RDYXNlID0gbmV3IFNka1YyVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1sYW1iZGEtbm9kZWpzLWRlcGVuZGVuY2llcycpO1xuY29uc3Qgc2RrVjN0ZXN0Q2FzZSA9IG5ldyBTZGtWM1Rlc3RTdGFjayhhcHAsICdjZGstaW50ZWctbGFtYmRhLW5vZGVqcy1kZXBlbmRlbmNpZXMtZm9yLXNkay12MycpO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnTGFtYmRhRGVwZW5kZW5jaWVzJywge1xuICB0ZXN0Q2FzZXM6IFtzZGtWMnRlc3RDYXNlLCBzZGtWM3Rlc3RDYXNlXSxcbn0pO1xuXG5mb3IgKGNvbnN0IHRlc3RDYXNlIG9mIFtzZGtWMnRlc3RDYXNlLCBzZGtWM3Rlc3RDYXNlXSkge1xuICBjb25zdCByZXNwb25zZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICAgIGZ1bmN0aW9uTmFtZTogdGVzdENhc2UubGFtYmRhRnVuY3Rpb24uZnVuY3Rpb25OYW1lLFxuICB9KTtcbiAgcmVzcG9uc2UuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICAgIC8vIGV4cGVjdCBpbnZva2luZyB3aXRob3V0IGVycm9yXG4gICAgU3RhdHVzQ29kZTogMjAwLFxuICAgIEV4ZWN1dGVkVmVyc2lvbjogJyRMQVRFU1QnLFxuICAgIFBheWxvYWQ6ICdudWxsJyxcbiAgfSkpO1xufVxuXG5hcHAuc3ludGgoKTtcbiJdfQ==