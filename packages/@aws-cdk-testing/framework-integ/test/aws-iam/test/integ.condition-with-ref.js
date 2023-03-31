"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
class MyStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const tagName = new aws_cdk_lib_1.CfnParameter(this, 'PrincipalTag', { default: 'developer' });
        const stringEquals = new aws_cdk_lib_1.CfnJson(this, 'PrincipalTagCondition', {
            value: {
                [`aws:PrincipalTag/${tagName.valueAsString}`]: 'true',
            },
        });
        const principal = new aws_iam_1.AccountRootPrincipal().withConditions({
            StringEquals: stringEquals,
        });
        new aws_iam_1.Role(this, 'MyRole', { assumedBy: principal });
    }
}
const app = new aws_cdk_lib_1.App();
new integ_tests_alpha_1.IntegTest(app, 'iam-test-condition-with-ref', {
    testCases: [new MyStack(app, 'test-condition-with-ref')],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29uZGl0aW9uLXdpdGgtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29uZGl0aW9uLXdpdGgtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQWdFO0FBQ2hFLGtFQUF1RDtBQUV2RCxpREFBaUU7QUFFakUsTUFBTSxPQUFRLFNBQVEsbUJBQUs7SUFDekIsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFJLDBCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRWpGLE1BQU0sWUFBWSxHQUFHLElBQUkscUJBQU8sQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDOUQsS0FBSyxFQUFFO2dCQUNMLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLE1BQU07YUFDdEQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLDhCQUFvQixFQUFFLENBQUMsY0FBYyxDQUFDO1lBQzFELFlBQVksRUFBRSxZQUFZO1NBQzNCLENBQUMsQ0FBQztRQUVILElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLDZCQUE2QixFQUFFO0lBQ2hELFNBQVMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0NBQ3pELENBQUMsQ0FDRDtBQUNELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuSnNvbiwgQ2ZuUGFyYW1ldGVyLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWNjb3VudFJvb3RQcmluY2lwYWwsIFJvbGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcblxuY2xhc3MgTXlTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB0YWdOYW1lID0gbmV3IENmblBhcmFtZXRlcih0aGlzLCAnUHJpbmNpcGFsVGFnJywgeyBkZWZhdWx0OiAnZGV2ZWxvcGVyJyB9KTtcblxuICAgIGNvbnN0IHN0cmluZ0VxdWFscyA9IG5ldyBDZm5Kc29uKHRoaXMsICdQcmluY2lwYWxUYWdDb25kaXRpb24nLCB7XG4gICAgICB2YWx1ZToge1xuICAgICAgICBbYGF3czpQcmluY2lwYWxUYWcvJHt0YWdOYW1lLnZhbHVlQXNTdHJpbmd9YF06ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKS53aXRoQ29uZGl0aW9ucyh7XG4gICAgICBTdHJpbmdFcXVhbHM6IHN0cmluZ0VxdWFscyxcbiAgICB9KTtcblxuICAgIG5ldyBSb2xlKHRoaXMsICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogcHJpbmNpcGFsIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnaWFtLXRlc3QtY29uZGl0aW9uLXdpdGgtcmVmJywge1xuICB0ZXN0Q2FzZXM6IFtuZXcgTXlTdGFjayhhcHAsICd0ZXN0LWNvbmRpdGlvbi13aXRoLXJlZicpXSxcbn0pXG47XG5hcHAuc3ludGgoKTtcbiJdfQ==