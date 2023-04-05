"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_lambda_destinations_1 = require("aws-cdk-lib/aws-lambda-destinations");
const logs = require("aws-cdk-lib/aws-logs");
const sqs = require("aws-cdk-lib/aws-sqs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_logs_destinations_1 = require("aws-cdk-lib/aws-logs-destinations");
class LambdaStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        this.queue = new sqs.Queue(this, 'Queue');
        const fn = new lambda.Function(this, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = async (event) => {
        return 'success';
      };`),
            onSuccess: new aws_lambda_destinations_1.SqsDestination(this.queue),
        });
        const logGroup = new logs.LogGroup(this, 'LogGroup', { removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY });
        const lambdaDestination = new aws_logs_destinations_1.LambdaDestination(fn);
        new logs.SubscriptionFilter(this, 'Subscription', {
            logGroup: logGroup,
            destination: lambdaDestination,
            filterPattern: logs.FilterPattern.allEvents(),
        });
        const customRule = new events.Rule(this, 'CustomRule', {
            eventPattern: {
                source: ['cdk-lambda-integ'],
                detailType: ['cdk-integ-custom-rule'],
            },
        });
        customRule.addTarget(new aws_events_targets_1.CloudWatchLogGroup(logGroup, {
            logEvent: aws_events_targets_1.LogGroupTargetInput.fromObject({
                message: 'Howdy Ho!',
            }),
        }));
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new LambdaStack(app, 'lambda-logssubscription-integ');
const integ = new integ_tests_alpha_1.IntegTest(app, 'LambdaInteg', {
    testCases: [stack],
});
const putEvents = integ.assertions.awsApiCall('EventBridge', 'putEvents', {
    Entries: [
        {
            Detail: JSON.stringify({
                foo: 'bar',
            }),
            DetailType: 'cdk-integ-custom-rule',
            Source: 'cdk-lambda-integ',
        },
    ],
});
putEvents.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['events:PutEvents'],
    Resource: ['*'],
});
const receiveMessage = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
    QueueUrl: stack.queue.queueUrl,
    WaitTimeSeconds: 20,
});
// TODO: Replace with `receiveMessage.assertAtPath('Messages.0.Body', ExpectedResult.objectLike({...`
// when issue #24215 is addressed
receiveMessage.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Messages: [{
            Body: integ_tests_alpha_1.Match.stringLikeRegexp('"responsePayload":"success"'),
        }],
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBQ2pELHVFQUF5RjtBQUN6RixpREFBaUQ7QUFDakQsaUZBQXFFO0FBQ3JFLDZDQUE2QztBQUM3QywyQ0FBMkM7QUFDM0MsNkNBQXdEO0FBQ3hELGtFQUE4RTtBQUU5RSw2RUFBc0U7QUFFdEUsTUFBTSxXQUFZLFNBQVEsbUJBQUs7SUFJN0IsWUFBWSxLQUEyQixFQUFFLEVBQVU7UUFDakQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7O1NBRTFCLENBQUM7WUFDSixTQUFTLEVBQUUsSUFBSSx3Q0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQy9GLE1BQU0saUJBQWlCLEdBQUcsSUFBSSx5Q0FBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2hELFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1NBQzlDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3JELFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDNUIsVUFBVSxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDdEM7U0FDRixDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksdUNBQWtCLENBQUMsUUFBUSxFQUFFO1lBQ3BELFFBQVEsRUFBRSx3Q0FBbUIsQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRSxXQUFXO2FBQ3JCLENBQUM7U0FDSCxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sS0FBSyxHQUFHLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFO0lBQzlDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFO0lBQ3hFLE9BQU8sRUFBRTtRQUNQO1lBQ0UsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3JCLEdBQUcsRUFBRSxLQUFLO2FBQ1gsQ0FBQztZQUNGLFVBQVUsRUFBRSx1QkFBdUI7WUFDbkMsTUFBTSxFQUFFLGtCQUFrQjtTQUMzQjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7SUFDakMsTUFBTSxFQUFFLE9BQU87SUFDZixNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztJQUM1QixRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUM7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzFFLFFBQVEsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7SUFDOUIsZUFBZSxFQUFFLEVBQUU7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgscUdBQXFHO0FBQ3JHLGlDQUFpQztBQUNqQyxjQUFjLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFFO0lBQy9DLFFBQVEsRUFDUixDQUFDO1lBQ0MsSUFBSSxFQUFFLHlCQUFLLENBQUMsZ0JBQWdCLENBQUUsNkJBQTZCLENBQUU7U0FDOUQsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFDO0FBRUosR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0IHsgQ2xvdWRXYXRjaExvZ0dyb3VwLCBMb2dHcm91cFRhcmdldElucHV0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IFNxc0Rlc3RpbmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1kZXN0aW5hdGlvbnMnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0LCBFeHBlY3RlZFJlc3VsdCwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTGFtYmRhRGVzdGluYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncy1kZXN0aW5hdGlvbnMnO1xuXG5jbGFzcyBMYW1iZGFTdGFjayBleHRlbmRzIFN0YWNrIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgcXVldWU6IHNxcy5RdWV1ZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ1F1ZXVlJyk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ015RnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgfTtgKSxcbiAgICAgIG9uU3VjY2VzczogbmV3IFNxc0Rlc3RpbmF0aW9uKHRoaXMucXVldWUpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cCh0aGlzLCAnTG9nR3JvdXAnLCB7IHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSB9KTtcbiAgICBjb25zdCBsYW1iZGFEZXN0aW5hdGlvbiA9IG5ldyBMYW1iZGFEZXN0aW5hdGlvbihmbik7XG5cbiAgICBuZXcgbG9ncy5TdWJzY3JpcHRpb25GaWx0ZXIodGhpcywgJ1N1YnNjcmlwdGlvbicsIHtcbiAgICAgIGxvZ0dyb3VwOiBsb2dHcm91cCxcbiAgICAgIGRlc3RpbmF0aW9uOiBsYW1iZGFEZXN0aW5hdGlvbixcbiAgICAgIGZpbHRlclBhdHRlcm46IGxvZ3MuRmlsdGVyUGF0dGVybi5hbGxFdmVudHMoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGN1c3RvbVJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUodGhpcywgJ0N1c3RvbVJ1bGUnLCB7XG4gICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgc291cmNlOiBbJ2Nkay1sYW1iZGEtaW50ZWcnXSxcbiAgICAgICAgZGV0YWlsVHlwZTogWydjZGstaW50ZWctY3VzdG9tLXJ1bGUnXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY3VzdG9tUnVsZS5hZGRUYXJnZXQobmV3IENsb3VkV2F0Y2hMb2dHcm91cChsb2dHcm91cCwge1xuICAgICAgbG9nRXZlbnQ6IExvZ0dyb3VwVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgIG1lc3NhZ2U6ICdIb3dkeSBIbyEnLFxuICAgICAgfSksXG4gICAgfSkpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IExhbWJkYVN0YWNrKGFwcCwgJ2xhbWJkYS1sb2dzc3Vic2NyaXB0aW9uLWludGVnJyk7XG5cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsICdMYW1iZGFJbnRlZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmNvbnN0IHB1dEV2ZW50cyA9IGludGVnLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnRXZlbnRCcmlkZ2UnLCAncHV0RXZlbnRzJywge1xuICBFbnRyaWVzOiBbXG4gICAge1xuICAgICAgRGV0YWlsOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICB9KSxcbiAgICAgIERldGFpbFR5cGU6ICdjZGstaW50ZWctY3VzdG9tLXJ1bGUnLFxuICAgICAgU291cmNlOiAnY2RrLWxhbWJkYS1pbnRlZycsXG4gICAgfSxcbiAgXSxcbn0pO1xucHV0RXZlbnRzLnByb3ZpZGVyLmFkZFRvUm9sZVBvbGljeSh7XG4gIEVmZmVjdDogJ0FsbG93JyxcbiAgQWN0aW9uOiBbJ2V2ZW50czpQdXRFdmVudHMnXSxcbiAgUmVzb3VyY2U6IFsnKiddLFxufSk7XG5cbmNvbnN0IHJlY2VpdmVNZXNzYWdlID0gaW50ZWcuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdTUVMnLCAncmVjZWl2ZU1lc3NhZ2UnLCB7XG4gIFF1ZXVlVXJsOiBzdGFjay5xdWV1ZS5xdWV1ZVVybCxcbiAgV2FpdFRpbWVTZWNvbmRzOiAyMCxcbn0pO1xuXG4vLyBUT0RPOiBSZXBsYWNlIHdpdGggYHJlY2VpdmVNZXNzYWdlLmFzc2VydEF0UGF0aCgnTWVzc2FnZXMuMC5Cb2R5JywgRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7Li4uYFxuLy8gd2hlbiBpc3N1ZSAjMjQyMTUgaXMgYWRkcmVzc2VkXG5yZWNlaXZlTWVzc2FnZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSgge1xuICBNZXNzYWdlczpcbiAgW3tcbiAgICBCb2R5OiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCAnXCJyZXNwb25zZVBheWxvYWRcIjpcInN1Y2Nlc3NcIicgKSxcbiAgfV0sXG59KSk7XG5cbmFwcC5zeW50aCgpO1xuIl19