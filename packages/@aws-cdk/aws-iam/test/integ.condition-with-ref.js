"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class MyStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const tagName = new core_1.CfnParameter(this, 'PrincipalTag', { default: 'developer' });
        const stringEquals = new core_1.CfnJson(this, 'PrincipalTagCondition', {
            value: {
                [`aws:PrincipalTag/${tagName.valueAsString}`]: 'true',
            },
        });
        const principal = new lib_1.AccountRootPrincipal().withConditions({
            StringEquals: stringEquals,
        });
        new lib_1.Role(this, 'MyRole', { assumedBy: principal });
    }
}
const app = new core_1.App();
new integ_tests_1.IntegTest(app, 'iam-test-condition-with-ref', {
    testCases: [new MyStack(app, 'test-condition-with-ref')],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29uZGl0aW9uLXdpdGgtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29uZGl0aW9uLXdpdGgtcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQWtFO0FBQ2xFLHNEQUFpRDtBQUVqRCxnQ0FBb0Q7QUFFcEQsTUFBTSxPQUFRLFNBQVEsWUFBSztJQUN6QixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFakYsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFPLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQzlELEtBQUssRUFBRTtnQkFDTCxDQUFDLG9CQUFvQixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxNQUFNO2FBQ3REO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSwwQkFBb0IsRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUMxRCxZQUFZLEVBQUUsWUFBWTtTQUMzQixDQUFDLENBQUM7UUFFSCxJQUFJLFVBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDcEQ7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsRUFBRTtJQUNoRCxTQUFTLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztDQUN6RCxDQUFDLENBQ0Q7QUFDRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbkpzb24sIENmblBhcmFtZXRlciwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWNjb3VudFJvb3RQcmluY2lwYWwsIFJvbGUgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBNeVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHRhZ05hbWUgPSBuZXcgQ2ZuUGFyYW1ldGVyKHRoaXMsICdQcmluY2lwYWxUYWcnLCB7IGRlZmF1bHQ6ICdkZXZlbG9wZXInIH0pO1xuXG4gICAgY29uc3Qgc3RyaW5nRXF1YWxzID0gbmV3IENmbkpzb24odGhpcywgJ1ByaW5jaXBhbFRhZ0NvbmRpdGlvbicsIHtcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIFtgYXdzOlByaW5jaXBhbFRhZy8ke3RhZ05hbWUudmFsdWVBc1N0cmluZ31gXTogJ3RydWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByaW5jaXBhbCA9IG5ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpLndpdGhDb25kaXRpb25zKHtcbiAgICAgIFN0cmluZ0VxdWFsczogc3RyaW5nRXF1YWxzLFxuICAgIH0pO1xuXG4gICAgbmV3IFJvbGUodGhpcywgJ015Um9sZScsIHsgYXNzdW1lZEJ5OiBwcmluY2lwYWwgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IEludGVnVGVzdChhcHAsICdpYW0tdGVzdC1jb25kaXRpb24td2l0aC1yZWYnLCB7XG4gIHRlc3RDYXNlczogW25ldyBNeVN0YWNrKGFwcCwgJ3Rlc3QtY29uZGl0aW9uLXdpdGgtcmVmJyldLFxufSlcbjtcbmFwcC5zeW50aCgpO1xuIl19