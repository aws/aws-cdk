"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const synthetics = require("../lib");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new synthetics.Canary(this, 'Canary', {
            canaryName: 'next',
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
            test: synthetics.Test.custom({
                handler: 'index.handler',
                code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
            }),
            cleanup: synthetics.Cleanup.LAMBDA,
        });
        const canaryThatWillBeRemoved = new synthetics.Canary(this, 'CanaryRemoved', {
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
            test: synthetics.Test.custom({
                handler: 'index.handler',
                code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
            }),
            cleanup: synthetics.Cleanup.LAMBDA,
            startAfterCreation: false, // otherwise we get error: canary is in a state that can't be deleted: RUNNING
        });
        // Remove this canary immediately
        // so we can test that a non-existing canary will not fail the auto-delete-lambda Custom Resource
        new custom_resources_1.AwsCustomResource(this, 'DeleteCanary', {
            onCreate: {
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(canaryThatWillBeRemoved.canaryName),
                service: 'Synthetics',
                action: 'deleteCanary',
                parameters: {
                    Name: canaryThatWillBeRemoved.canaryName,
                },
            },
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
    }
}
const app = new aws_cdk_lib_1.App();
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-synthetics-canary-auto-delete', {
    testCases: [new TestStack(app, 'cdk-synthetics-canary-auto-delete')],
    diffAssets: true,
    stackUpdateWorkflow: false, // will error because this stack has a cr that deletes its own resources
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FuYXJ5LWF1dG8tZGVsZXRlLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNhbmFyeS1hdXRvLWRlbGV0ZS1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBcUQ7QUFDckQsa0VBQXVEO0FBRXZELHFDQUFxQztBQUNyQyxtRUFBOEc7QUFFOUcsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNwQyxVQUFVLEVBQUUsTUFBTTtZQUNsQixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQywrQkFBK0I7WUFDM0QsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMzQixPQUFPLEVBQUUsZUFBZTtnQkFDeEIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7YUFHNUIsQ0FBQzthQUNQLENBQUM7WUFDRixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1NBQ25DLENBQUMsQ0FBQztRQUVILE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDM0UsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsK0JBQStCO1lBQzNELElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7O2FBRzVCLENBQUM7YUFDUCxDQUFDO1lBQ0YsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUNsQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsOEVBQThFO1NBQzFHLENBQUMsQ0FBQztRQUVILGlDQUFpQztRQUNqQyxpR0FBaUc7UUFDakcsSUFBSSxvQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzFDLFFBQVEsRUFBRTtnQkFDUixrQkFBa0IsRUFBRSxxQ0FBa0IsQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDO2dCQUM3RSxPQUFPLEVBQUUsWUFBWTtnQkFDckIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsdUJBQXVCLENBQUMsVUFBVTtpQkFDekM7YUFDRjtZQUNELE1BQU0sRUFBRSwwQ0FBdUIsQ0FBQyxZQUFZLENBQUM7Z0JBQzNDLFNBQVMsRUFBRSwwQ0FBdUIsQ0FBQyxZQUFZO2FBQ2hELENBQUM7U0FDSCxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsRUFBRTtJQUM1RCxTQUFTLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztJQUNwRSxVQUFVLEVBQUUsSUFBSTtJQUNoQixtQkFBbUIsRUFBRSxLQUFLLEVBQUUsd0VBQXdFO0NBQ3JHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHN5bnRoZXRpY3MgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEF3c0N1c3RvbVJlc291cmNlLCBBd3NDdXN0b21SZXNvdXJjZVBvbGljeSwgUGh5c2ljYWxSZXNvdXJjZUlkIH0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgc3ludGhldGljcy5DYW5hcnkodGhpcywgJ0NhbmFyeScsIHtcbiAgICAgIGNhbmFyeU5hbWU6ICduZXh0JyxcbiAgICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfNF8wLFxuICAgICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoYFxuICAgICAgICAgIGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxcJ2hlbGxvIHdvcmxkXFwnKTtcbiAgICAgICAgICB9O2ApLFxuICAgICAgfSksXG4gICAgICBjbGVhbnVwOiBzeW50aGV0aWNzLkNsZWFudXAuTEFNQkRBLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2FuYXJ5VGhhdFdpbGxCZVJlbW92ZWQgPSBuZXcgc3ludGhldGljcy5DYW5hcnkodGhpcywgJ0NhbmFyeVJlbW92ZWQnLCB7XG4gICAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzRfMCxcbiAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKGBcbiAgICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgICAgfTtgKSxcbiAgICAgIH0pLFxuICAgICAgY2xlYW51cDogc3ludGhldGljcy5DbGVhbnVwLkxBTUJEQSxcbiAgICAgIHN0YXJ0QWZ0ZXJDcmVhdGlvbjogZmFsc2UsIC8vIG90aGVyd2lzZSB3ZSBnZXQgZXJyb3I6IGNhbmFyeSBpcyBpbiBhIHN0YXRlIHRoYXQgY2FuJ3QgYmUgZGVsZXRlZDogUlVOTklOR1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHRoaXMgY2FuYXJ5IGltbWVkaWF0ZWx5XG4gICAgLy8gc28gd2UgY2FuIHRlc3QgdGhhdCBhIG5vbi1leGlzdGluZyBjYW5hcnkgd2lsbCBub3QgZmFpbCB0aGUgYXV0by1kZWxldGUtbGFtYmRhIEN1c3RvbSBSZXNvdXJjZVxuICAgIG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLCAnRGVsZXRlQ2FuYXJ5Jywge1xuICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoY2FuYXJ5VGhhdFdpbGxCZVJlbW92ZWQuY2FuYXJ5TmFtZSksXG4gICAgICAgIHNlcnZpY2U6ICdTeW50aGV0aWNzJyxcbiAgICAgICAgYWN0aW9uOiAnZGVsZXRlQ2FuYXJ5JyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6IGNhbmFyeVRoYXRXaWxsQmVSZW1vdmVkLmNhbmFyeU5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgICAgICByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctc3ludGhldGljcy1jYW5hcnktYXV0by1kZWxldGUnLCB7XG4gIHRlc3RDYXNlczogW25ldyBUZXN0U3RhY2soYXBwLCAnY2RrLXN5bnRoZXRpY3MtY2FuYXJ5LWF1dG8tZGVsZXRlJyldLFxuICBkaWZmQXNzZXRzOiB0cnVlLFxuICBzdGFja1VwZGF0ZVdvcmtmbG93OiBmYWxzZSwgLy8gd2lsbCBlcnJvciBiZWNhdXNlIHRoaXMgc3RhY2sgaGFzIGEgY3IgdGhhdCBkZWxldGVzIGl0cyBvd24gcmVzb3VyY2VzXG59KTtcbiJdfQ==