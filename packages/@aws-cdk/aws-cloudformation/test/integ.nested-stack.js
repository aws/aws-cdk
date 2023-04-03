"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const sns = require("@aws-cdk/aws-sns");
const sns_subscriptions = require("@aws-cdk/aws-sns-subscriptions");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
class MyNestedStack extends core_1.NestedStack {
    constructor(scope, id, props) {
        const topicNamePrefixLogicalId = 'TopicNamePrefix';
        super(scope, id, {
            parameters: {
                [topicNamePrefixLogicalId]: props.topicNamePrefix,
            },
            description: props.description,
        });
        const topicNamePrefixParameter = new core_1.CfnParameter(this, 'TopicNamePrefix', { type: 'String' });
        for (let i = 0; i < props.topicCount; ++i) {
            const topic = new sns.Topic(this, `topic-${i}`, { displayName: `${topicNamePrefixParameter.valueAsString}-${i}` });
            // since the subscription resources are defined in the subscriber's stack, this
            // will add an SNS subscription resource to the parent stack that reference this topic.
            if (props.subscriber) {
                topic.addSubscription(new sns_subscriptions.SqsSubscription(props.subscriber));
            }
        }
        if (props.subscriber) {
            new lambda.Function(this, 'fn', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('console.error("hi")'),
                handler: 'index.handler',
                environment: {
                    TOPIC_ARN: props.siblingTopic?.topicArn ?? '',
                    QUEUE_URL: props.subscriber.queueUrl,
                },
            });
        }
    }
}
class MyTestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const queue = new sqs.Queue(this, 'SubscriberQueue');
        new MyNestedStack(this, 'NestedStack1', { topicCount: 3, topicNamePrefix: 'Prefix1', subscriber: queue });
        new MyNestedStack(this, 'NestedStack2', { topicCount: 2, topicNamePrefix: 'Prefix2', description: 'This is secound nested stack.' });
    }
}
const app = new core_1.App();
new MyTestStack(app, 'nested-stacks-test');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmVzdGVkLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubmVzdGVkLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4QyxvRUFBb0U7QUFDcEUsd0NBQXdDO0FBQ3hDLHdDQUFzRTtBQWF0RSxNQUFNLGFBQWMsU0FBUSxrQkFBVztJQUNyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLE1BQU0sd0JBQXdCLEdBQUcsaUJBQWlCLENBQUM7UUFFbkQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixVQUFVLEVBQUU7Z0JBQ1YsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxlQUFlO2FBQ2xEO1lBQ0QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxtQkFBWSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRS9GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLHdCQUF3QixDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFbkgsK0VBQStFO1lBQy9FLHVGQUF1RjtZQUN2RixJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDaEY7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtnQkFDOUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO2dCQUNuRCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsV0FBVyxFQUFFO29CQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsSUFBSSxFQUFFO29CQUM3QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRO2lCQUNyQzthQUNGLENBQUMsQ0FBQztTQUNKO0tBQ0Y7Q0FDRjtBQUVELE1BQU0sV0FBWSxTQUFRLFlBQUs7SUFDN0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFckQsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSwrQkFBK0IsRUFBRSxDQUFDLENBQUM7S0FDdEk7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc25zX3N1YnNjcmlwdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IEFwcCwgQ2ZuUGFyYW1ldGVyLCBOZXN0ZWRTdGFjaywgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAYXdzLWNkay9uby1jb3JlLWNvbnN0cnVjdCAqL1xuXG5pbnRlcmZhY2UgTXlOZXN0ZWRTdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgc3Vic2NyaWJlcj86IHNxcy5RdWV1ZTtcbiAgcmVhZG9ubHkgc2libGluZ1RvcGljPzogc25zLlRvcGljOyAvLyBhIHRvcGljIGRlZmluZWQgaW4gYSBzaWJsaW5nIG5lc3RlZCBzdGFja1xuICByZWFkb25seSB0b3BpY0NvdW50OiBudW1iZXI7XG4gIHJlYWRvbmx5IHRvcGljTmFtZVByZWZpeDogc3RyaW5nO1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuY2xhc3MgTXlOZXN0ZWRTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE15TmVzdGVkU3RhY2tQcm9wcykge1xuICAgIGNvbnN0IHRvcGljTmFtZVByZWZpeExvZ2ljYWxJZCA9ICdUb3BpY05hbWVQcmVmaXgnO1xuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFt0b3BpY05hbWVQcmVmaXhMb2dpY2FsSWRdOiBwcm9wcy50b3BpY05hbWVQcmVmaXgsIC8vIHBhc3MgaW4gYSBwYXJhbWV0ZXIgdG8gdGhlIG5lc3RlZCBzdGFja1xuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvcGljTmFtZVByZWZpeFBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIodGhpcywgJ1RvcGljTmFtZVByZWZpeCcsIHsgdHlwZTogJ1N0cmluZycgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLnRvcGljQ291bnQ7ICsraSkge1xuICAgICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsIGB0b3BpYy0ke2l9YCwgeyBkaXNwbGF5TmFtZTogYCR7dG9waWNOYW1lUHJlZml4UGFyYW1ldGVyLnZhbHVlQXNTdHJpbmd9LSR7aX1gIH0pO1xuXG4gICAgICAvLyBzaW5jZSB0aGUgc3Vic2NyaXB0aW9uIHJlc291cmNlcyBhcmUgZGVmaW5lZCBpbiB0aGUgc3Vic2NyaWJlcidzIHN0YWNrLCB0aGlzXG4gICAgICAvLyB3aWxsIGFkZCBhbiBTTlMgc3Vic2NyaXB0aW9uIHJlc291cmNlIHRvIHRoZSBwYXJlbnQgc3RhY2sgdGhhdCByZWZlcmVuY2UgdGhpcyB0b3BpYy5cbiAgICAgIGlmIChwcm9wcy5zdWJzY3JpYmVyKSB7XG4gICAgICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc25zX3N1YnNjcmlwdGlvbnMuU3FzU3Vic2NyaXB0aW9uKHByb3BzLnN1YnNjcmliZXIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc3Vic2NyaWJlcikge1xuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZm4nLCB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdjb25zb2xlLmVycm9yKFwiaGlcIiknKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFRPUElDX0FSTjogcHJvcHMuc2libGluZ1RvcGljPy50b3BpY0FybiA/PyAnJyxcbiAgICAgICAgICBRVUVVRV9VUkw6IHByb3BzLnN1YnNjcmliZXIucXVldWVVcmwsIC8vIG5lc3RlZCBzdGFjayByZWZlcmVuY2VzIGEgcmVzb3VyY2UgaW4gdGhlIHBhcmVudFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIE15VGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZSh0aGlzLCAnU3Vic2NyaWJlclF1ZXVlJyk7XG5cbiAgICBuZXcgTXlOZXN0ZWRTdGFjayh0aGlzLCAnTmVzdGVkU3RhY2sxJywgeyB0b3BpY0NvdW50OiAzLCB0b3BpY05hbWVQcmVmaXg6ICdQcmVmaXgxJywgc3Vic2NyaWJlcjogcXVldWUgfSk7XG4gICAgbmV3IE15TmVzdGVkU3RhY2sodGhpcywgJ05lc3RlZFN0YWNrMicsIHsgdG9waWNDb3VudDogMiwgdG9waWNOYW1lUHJlZml4OiAnUHJlZml4MicsIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBzZWNvdW5kIG5lc3RlZCBzdGFjay4nIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbm5ldyBNeVRlc3RTdGFjayhhcHAsICduZXN0ZWQtc3RhY2tzLXRlc3QnKTtcbmFwcC5zeW50aCgpO1xuIl19