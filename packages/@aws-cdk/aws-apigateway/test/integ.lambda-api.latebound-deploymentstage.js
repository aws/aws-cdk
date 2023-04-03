"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class LateBoundDeploymentStageStack extends core_1.Stack {
    constructor(scope) {
        super(scope, 'LateBoundDeploymentStageStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const api = new lib_1.LambdaRestApi(this, 'lambdarestapi', {
            cloudWatchRole: true,
            deploy: false,
            handler: fn,
        });
        api.deploymentStage = new lib_1.Stage(this, 'stage', {
            deployment: new lib_1.Deployment(this, 'deployment', {
                api,
            }),
        });
    }
}
const app = new core_1.App();
const testCase = new LateBoundDeploymentStageStack(app);
new integ_tests_1.IntegTest(app, 'lambda-api-latebound-deploymentstage', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS5sYXRlYm91bmQtZGVwbG95bWVudHN0YWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGFtYmRhLWFwaS5sYXRlYm91bmQtZGVwbG95bWVudHN0YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQThEO0FBQzlELHdDQUEyQztBQUMzQyxzREFBaUQ7QUFFakQsZ0NBQTBEO0FBRTFELE1BQU0sNkJBQThCLFNBQVEsWUFBSztJQUMvQyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUU5QyxNQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbkQsY0FBYyxFQUFFLElBQUk7WUFDcEIsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsRUFBRTtTQUNaLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUM3QyxVQUFVLEVBQUUsSUFBSSxnQkFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7Z0JBQzdDLEdBQUc7YUFDSixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxFQUFFO0lBQ3pELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgUnVudGltZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBEZXBsb3ltZW50LCBMYW1iZGFSZXN0QXBpLCBTdGFnZSB9IGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIExhdGVCb3VuZERlcGxveW1lbnRTdGFnZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0KSB7XG4gICAgc3VwZXIoc2NvcGUsICdMYXRlQm91bmREZXBsb3ltZW50U3RhZ2VTdGFjaycpO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24odGhpcywgJ215Zm4nLCB7XG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBMYW1iZGFSZXN0QXBpKHRoaXMsICdsYW1iZGFyZXN0YXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgICAgaGFuZGxlcjogZm4sXG4gICAgfSk7XG5cbiAgICBhcGkuZGVwbG95bWVudFN0YWdlID0gbmV3IFN0YWdlKHRoaXMsICdzdGFnZScsIHtcbiAgICAgIGRlcGxveW1lbnQ6IG5ldyBEZXBsb3ltZW50KHRoaXMsICdkZXBsb3ltZW50Jywge1xuICAgICAgICBhcGksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBMYXRlQm91bmREZXBsb3ltZW50U3RhZ2VTdGFjayhhcHApO1xubmV3IEludGVnVGVzdChhcHAsICdsYW1iZGEtYXBpLWxhdGVib3VuZC1kZXBsb3ltZW50c3RhZ2UnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuIl19