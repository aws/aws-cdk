"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-cdk-s3');
// Test a lifecycle rule with an expiration DATE
new aws_s3_1.Bucket(stack, 'MyBucket', {
    lifecycleRules: [
        {
            expirationDate: new Date('2019-10-01'),
        },
        {
            expirationDate: new Date('2019-10-01'),
            objectSizeLessThan: 600,
            objectSizeGreaterThan: 500,
        },
    ],
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-lifecycle', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGlmZWN5Y2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGlmZWN5Y2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXdEO0FBQ3hELGtFQUF1RDtBQUN2RCwrQ0FBNEM7QUFFNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUzQyxnREFBZ0Q7QUFDaEQsSUFBSSxlQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUM1QixjQUFjLEVBQUU7UUFDZDtZQUNFLGNBQWMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDdkM7UUFDRDtZQUNFLGNBQWMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDdEMsa0JBQWtCLEVBQUUsR0FBRztZQUN2QixxQkFBcUIsRUFBRSxHQUFHO1NBQzNCO0tBQ0Y7SUFDRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO0NBQ3JDLENBQUMsQ0FBQztBQUVILElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUU7SUFDeEMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstczMnKTtcblxuLy8gVGVzdCBhIGxpZmVjeWNsZSBydWxlIHdpdGggYW4gZXhwaXJhdGlvbiBEQVRFXG5uZXcgQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIGxpZmVjeWNsZVJ1bGVzOiBbXG4gICAge1xuICAgICAgZXhwaXJhdGlvbkRhdGU6IG5ldyBEYXRlKCcyMDE5LTEwLTAxJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUoJzIwMTktMTAtMDEnKSxcbiAgICAgIG9iamVjdFNpemVMZXNzVGhhbjogNjAwLFxuICAgICAgb2JqZWN0U2l6ZUdyZWF0ZXJUaGFuOiA1MDAsXG4gICAgfSxcbiAgXSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLWxpZmVjeWNsZScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7Il19