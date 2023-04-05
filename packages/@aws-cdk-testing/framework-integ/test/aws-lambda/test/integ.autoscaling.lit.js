"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appscaling = require("aws-cdk-lib/aws-applicationautoscaling");
const cdk = require("aws-cdk-lib");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const lambda = require("aws-cdk-lib/aws-lambda");
/**
* Stack verification steps:
* aws application-autoscaling describe-scalable-targets --service-namespace lambda --resource-ids function:<function name>:prod
* has a minCapacity of 3 and maxCapacity of 50
*/
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const fn = new lambda.Function(this, 'MyLambda', {
            code: new lambda.InlineCode('exports.handler = async () => { console.log(\'hello world\'); };'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = fn.currentVersion;
        const alias = new lambda.Alias(this, 'Alias', {
            aliasName: 'prod',
            version,
        });
        const scalingTarget = alias.addAutoScaling({ minCapacity: 3, maxCapacity: 50 });
        scalingTarget.scaleOnUtilization({
            utilizationTarget: 0.5,
        });
        scalingTarget.scaleOnSchedule('ScaleUpInTheMorning', {
            schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
            minCapacity: 20,
        });
        scalingTarget.scaleOnSchedule('ScaleDownAtNight', {
            schedule: appscaling.Schedule.cron({ hour: '20', minute: '0' }),
            maxCapacity: 20,
        });
        new cdk.CfnOutput(this, 'FunctionName', {
            value: fn.functionName,
        });
    }
}
const app = new cdk.App();
const stack = new TestStack(app, 'aws-lambda-autoscaling');
// Changes the function description when the feature flag is present
// to validate the changed function hash.
cdk.Aspects.of(stack).add(new lambda.FunctionVersionUpgrade(cx_api_1.LAMBDA_RECOGNIZE_LAYER_VERSION));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXV0b3NjYWxpbmcubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXV0b3NjYWxpbmcubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUVBQXFFO0FBQ3JFLG1DQUFtQztBQUNuQywrQ0FBb0U7QUFDcEUsaURBQWlEO0FBRWpEOzs7O0VBSUU7QUFDRixNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxrRUFBa0UsQ0FBQztZQUMvRixPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7UUFFbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDNUMsU0FBUyxFQUFFLE1BQU07WUFDakIsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWhGLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztZQUMvQixpQkFBaUIsRUFBRSxHQUFHO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUU7WUFDbkQsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDOUQsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRCxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUMvRCxXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsRUFBRSxDQUFDLFlBQVk7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHdCQUF3QixDQUFDLENBQUM7QUFFM0Qsb0VBQW9FO0FBQ3BFLHlDQUF5QztBQUN6QyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsc0JBQXNCLENBQUMsdUNBQThCLENBQUMsQ0FBQyxDQUFDO0FBRTdGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHNjYWxpbmcgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcGxpY2F0aW9uYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IExBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTiB9IGZyb20gJ2F3cy1jZGstbGliL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5cbi8qKlxuKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4qIGF3cyBhcHBsaWNhdGlvbi1hdXRvc2NhbGluZyBkZXNjcmliZS1zY2FsYWJsZS10YXJnZXRzIC0tc2VydmljZS1uYW1lc3BhY2UgbGFtYmRhIC0tcmVzb3VyY2UtaWRzIGZ1bmN0aW9uOjxmdW5jdGlvbiBuYW1lPjpwcm9kXG4qIGhhcyBhIG1pbkNhcGFjaXR5IG9mIDMgYW5kIG1heENhcGFjaXR5IG9mIDUwXG4qL1xuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdNeUxhbWJkYScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKCkgPT4geyBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7IH07JyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZlcnNpb24gPSBmbi5jdXJyZW50VmVyc2lvbjtcblxuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyh0aGlzLCAnQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdwcm9kJyxcbiAgICAgIHZlcnNpb24sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzY2FsaW5nVGFyZ2V0ID0gYWxpYXMuYWRkQXV0b1NjYWxpbmcoeyBtaW5DYXBhY2l0eTogMywgbWF4Q2FwYWNpdHk6IDUwIH0pO1xuXG4gICAgc2NhbGluZ1RhcmdldC5zY2FsZU9uVXRpbGl6YXRpb24oe1xuICAgICAgdXRpbGl6YXRpb25UYXJnZXQ6IDAuNSxcbiAgICB9KTtcblxuICAgIHNjYWxpbmdUYXJnZXQuc2NhbGVPblNjaGVkdWxlKCdTY2FsZVVwSW5UaGVNb3JuaW5nJywge1xuICAgICAgc2NoZWR1bGU6IGFwcHNjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IGhvdXI6ICc4JywgbWludXRlOiAnMCcgfSksXG4gICAgICBtaW5DYXBhY2l0eTogMjAsXG4gICAgfSk7XG5cbiAgICBzY2FsaW5nVGFyZ2V0LnNjYWxlT25TY2hlZHVsZSgnU2NhbGVEb3duQXROaWdodCcsIHtcbiAgICAgIHNjaGVkdWxlOiBhcHBzY2FsaW5nLlNjaGVkdWxlLmNyb24oeyBob3VyOiAnMjAnLCBtaW51dGU6ICcwJyB9KSxcbiAgICAgIG1heENhcGFjaXR5OiAyMCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdGdW5jdGlvbk5hbWUnLCB7XG4gICAgICB2YWx1ZTogZm4uZnVuY3Rpb25OYW1lLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtbGFtYmRhLWF1dG9zY2FsaW5nJyk7XG5cbi8vIENoYW5nZXMgdGhlIGZ1bmN0aW9uIGRlc2NyaXB0aW9uIHdoZW4gdGhlIGZlYXR1cmUgZmxhZyBpcyBwcmVzZW50XG4vLyB0byB2YWxpZGF0ZSB0aGUgY2hhbmdlZCBmdW5jdGlvbiBoYXNoLlxuY2RrLkFzcGVjdHMub2Yoc3RhY2spLmFkZChuZXcgbGFtYmRhLkZ1bmN0aW9uVmVyc2lvblVwZ3JhZGUoTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OKSk7XG5cbmFwcC5zeW50aCgpO1xuIl19