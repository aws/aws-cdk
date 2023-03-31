"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("aws-cdk-lib/aws-iam");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const lambda = require("aws-cdk-lib/aws-lambda");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-lambda-customize-roles');
iam.Role.customizeRoles(stack, {
    usePrecreatedRoles: {
        'integ-lambda-customize-roles/MyLambda/ServiceRole': 'precreated-role',
    },
});
const fn = new lambda.Function(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
});
const bucket = new aws_s3_1.Bucket(stack, 'Bucket');
bucket.grantRead(fn);
/**
 * This test will not deploy and is only used to provide an example
 * of the synthesized iam policy report
 */
new integ_tests_alpha_1.IntegTest(app, 'IntegTest', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            enabled: false,
        },
        destroy: {
            enabled: false,
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWN1c3RvbWl6ZS1yb2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1jdXN0b21pemUtcm9sZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsK0NBQTRDO0FBQzVDLG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFDdkQsaURBQWlEO0FBRWpELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUNqRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7SUFDN0Isa0JBQWtCLEVBQUU7UUFDbEIsbURBQW1ELEVBQUUsaUJBQWlCO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDaEQsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7SUFDbEMsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztDQUNwQyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyQjs7O0dBR0c7QUFDSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtJQUM5QixTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2ludGVnLWxhbWJkYS1jdXN0b21pemUtcm9sZXMnKTtcbmlhbS5Sb2xlLmN1c3RvbWl6ZVJvbGVzKHN0YWNrLCB7XG4gIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICdpbnRlZy1sYW1iZGEtY3VzdG9taXplLXJvbGVzL015TGFtYmRhL1NlcnZpY2VSb2xlJzogJ3ByZWNyZWF0ZWQtcm9sZScsXG4gIH0sXG59KTtcblxuY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG59KTtcblxuY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuYnVja2V0LmdyYW50UmVhZChmbik7XG5cbi8qKlxuICogVGhpcyB0ZXN0IHdpbGwgbm90IGRlcGxveSBhbmQgaXMgb25seSB1c2VkIHRvIHByb3ZpZGUgYW4gZXhhbXBsZVxuICogb2YgdGhlIHN5bnRoZXNpemVkIGlhbSBwb2xpY3kgcmVwb3J0XG4gKi9cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnSW50ZWdUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGNka0NvbW1hbmRPcHRpb25zOiB7XG4gICAgZGVwbG95OiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9LFxuICAgIGRlc3Ryb3k6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==