"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lambda = require("../lib");
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
new integ_tests_1.IntegTest(app, 'IntegTest', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWN1c3RvbWl6ZS1yb2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1jdXN0b21pemUtcm9sZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMsNENBQXlDO0FBQ3pDLHFDQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsaUNBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUNqRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7SUFDN0Isa0JBQWtCLEVBQUU7UUFDbEIsbURBQW1ELEVBQUUsaUJBQWlCO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDaEQsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7SUFDbEMsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztDQUNwQyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyQjs7O0dBR0c7QUFDSCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtJQUM5QixTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1sYW1iZGEtY3VzdG9taXplLXJvbGVzJyk7XG5pYW0uUm9sZS5jdXN0b21pemVSb2xlcyhzdGFjaywge1xuICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICAnaW50ZWctbGFtYmRhLWN1c3RvbWl6ZS1yb2xlcy9NeUxhbWJkYS9TZXJ2aWNlUm9sZSc6ICdwcmVjcmVhdGVkLXJvbGUnLFxuICB9LFxufSk7XG5cbmNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2ZvbycpLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxufSk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcbmJ1Y2tldC5ncmFudFJlYWQoZm4pO1xuXG4vKipcbiAqIFRoaXMgdGVzdCB3aWxsIG5vdCBkZXBsb3kgYW5kIGlzIG9ubHkgdXNlZCB0byBwcm92aWRlIGFuIGV4YW1wbGVcbiAqIG9mIHRoZSBzeW50aGVzaXplZCBpYW0gcG9saWN5IHJlcG9ydFxuICovXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0ludGVnVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBjZGtDb21tYW5kT3B0aW9uczoge1xuICAgIGRlcGxveToge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgICBkZXN0cm95OiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXX0=