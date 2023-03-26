"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
const cdk = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const lambda = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXV0b3NjYWxpbmcubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXV0b3NjYWxpbmcubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0VBQWtFO0FBQ2xFLHFDQUFxQztBQUNyQyw0Q0FBaUU7QUFDakUsaUNBQWlDO0FBRWpDOzs7O0VBSUU7QUFDRixNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxrRUFBa0UsQ0FBQztZQUMvRixPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7UUFFbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDNUMsU0FBUyxFQUFFLE1BQU07WUFDakIsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWhGLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztZQUMvQixpQkFBaUIsRUFBRSxHQUFHO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUU7WUFDbkQsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDOUQsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRCxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUMvRCxXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsRUFBRSxDQUFDLFlBQVk7U0FDdkIsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBRTNELG9FQUFvRTtBQUNwRSx5Q0FBeUM7QUFDekMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLHNCQUFzQixDQUFDLHVDQUE4QixDQUFDLENBQUMsQ0FBQztBQUU3RixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBsaWNhdGlvbmF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IExBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTiB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxuLyoqXG4qIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiogYXdzIGFwcGxpY2F0aW9uLWF1dG9zY2FsaW5nIGRlc2NyaWJlLXNjYWxhYmxlLXRhcmdldHMgLS1zZXJ2aWNlLW5hbWVzcGFjZSBsYW1iZGEgLS1yZXNvdXJjZS1pZHMgZnVuY3Rpb246PGZ1bmN0aW9uIG5hbWU+OnByb2RcbiogaGFzIGEgbWluQ2FwYWNpdHkgb2YgMyBhbmQgbWF4Q2FwYWNpdHkgb2YgNTBcbiovXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7IGNvbnNvbGUubG9nKFxcJ2hlbGxvIHdvcmxkXFwnKTsgfTsnKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9IGZuLmN1cnJlbnRWZXJzaW9uO1xuXG4gICAgY29uc3QgYWxpYXMgPSBuZXcgbGFtYmRhLkFsaWFzKHRoaXMsICdBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ3Byb2QnLFxuICAgICAgdmVyc2lvbixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNjYWxpbmdUYXJnZXQgPSBhbGlhcy5hZGRBdXRvU2NhbGluZyh7IG1pbkNhcGFjaXR5OiAzLCBtYXhDYXBhY2l0eTogNTAgfSk7XG5cbiAgICBzY2FsaW5nVGFyZ2V0LnNjYWxlT25VdGlsaXphdGlvbih7XG4gICAgICB1dGlsaXphdGlvblRhcmdldDogMC41LFxuICAgIH0pO1xuXG4gICAgc2NhbGluZ1RhcmdldC5zY2FsZU9uU2NoZWR1bGUoJ1NjYWxlVXBJblRoZU1vcm5pbmcnLCB7XG4gICAgICBzY2hlZHVsZTogYXBwc2NhbGluZy5TY2hlZHVsZS5jcm9uKHsgaG91cjogJzgnLCBtaW51dGU6ICcwJyB9KSxcbiAgICAgIG1pbkNhcGFjaXR5OiAyMCxcbiAgICB9KTtcblxuICAgIHNjYWxpbmdUYXJnZXQuc2NhbGVPblNjaGVkdWxlKCdTY2FsZURvd25BdE5pZ2h0Jywge1xuICAgICAgc2NoZWR1bGU6IGFwcHNjYWxpbmcuU2NoZWR1bGUuY3Jvbih7IGhvdXI6ICcyMCcsIG1pbnV0ZTogJzAnIH0pLFxuICAgICAgbWF4Q2FwYWNpdHk6IDIwLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0Z1bmN0aW9uTmFtZScsIHtcbiAgICAgIHZhbHVlOiBmbi5mdW5jdGlvbk5hbWUsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1sYW1iZGEtYXV0b3NjYWxpbmcnKTtcblxuLy8gQ2hhbmdlcyB0aGUgZnVuY3Rpb24gZGVzY3JpcHRpb24gd2hlbiB0aGUgZmVhdHVyZSBmbGFnIGlzIHByZXNlbnRcbi8vIHRvIHZhbGlkYXRlIHRoZSBjaGFuZ2VkIGZ1bmN0aW9uIGhhc2guXG5jZGsuQXNwZWN0cy5vZihzdGFjaykuYWRkKG5ldyBsYW1iZGEuRnVuY3Rpb25WZXJzaW9uVXBncmFkZShMQU1CREFfUkVDT0dOSVpFX0xBWUVSX1ZFUlNJT04pKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=