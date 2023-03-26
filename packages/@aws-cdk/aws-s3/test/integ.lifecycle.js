"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-s3');
// Test a lifecycle rule with an expiration DATE
new lib_1.Bucket(stack, 'MyBucket', {
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
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
new integ_tests_1.IntegTest(app, 'cdk-integ-lifecycle', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGlmZWN5Y2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGlmZWN5Y2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQTBEO0FBQzFELHNEQUFpRDtBQUNqRCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFM0MsZ0RBQWdEO0FBQ2hELElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDNUIsY0FBYyxFQUFFO1FBQ2Q7WUFDRSxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3ZDO1FBQ0Q7WUFDRSxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3RDLGtCQUFrQixFQUFFLEdBQUc7WUFDdkIscUJBQXFCLEVBQUUsR0FBRztTQUMzQjtLQUNGO0lBQ0QsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFxQixFQUFFO0lBQ3hDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstczMnKTtcblxuLy8gVGVzdCBhIGxpZmVjeWNsZSBydWxlIHdpdGggYW4gZXhwaXJhdGlvbiBEQVRFXG5uZXcgQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIGxpZmVjeWNsZVJ1bGVzOiBbXG4gICAge1xuICAgICAgZXhwaXJhdGlvbkRhdGU6IG5ldyBEYXRlKCcyMDE5LTEwLTAxJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUoJzIwMTktMTAtMDEnKSxcbiAgICAgIG9iamVjdFNpemVMZXNzVGhhbjogNjAwLFxuICAgICAgb2JqZWN0U2l6ZUdyZWF0ZXJUaGFuOiA1MDAsXG4gICAgfSxcbiAgXSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLWxpZmVjeWNsZScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7Il19