"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const sns = require("aws-cdk-lib/aws-sns");
const sns_subscriptions = require("aws-cdk-lib/aws-sns-subscriptions");
const sqs = require("aws-cdk-lib/aws-sqs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class MyNestedStack extends aws_cdk_lib_1.NestedStack {
    constructor(scope, id, props) {
        const topicNamePrefixLogicalId = 'TopicNamePrefix';
        super(scope, id, {
            parameters: {
                [topicNamePrefixLogicalId]: props.topicNamePrefix, // pass in a parameter to the nested stack
            },
            description: props.description,
        });
        const topicNamePrefixParameter = new aws_cdk_lib_1.CfnParameter(this, 'TopicNamePrefix', { type: 'String' });
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
                    QUEUE_URL: props.subscriber.queueUrl, // nested stack references a resource in the parent
                },
            });
        }
    }
}
class MyTestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const queue = new sqs.Queue(this, 'SubscriberQueue');
        new MyNestedStack(this, 'NestedStack1', { topicCount: 3, topicNamePrefix: 'Prefix1', subscriber: queue });
        new MyNestedStack(this, 'NestedStack2', { topicCount: 2, topicNamePrefix: 'Prefix2', description: 'This is secound nested stack.' });
    }
}
const app = new aws_cdk_lib_1.App();
new MyTestStack(app, 'nested-stacks-test');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmVzdGVkLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubmVzdGVkLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQyx1RUFBdUU7QUFDdkUsMkNBQTJDO0FBQzNDLDZDQUFvRTtBQWFwRSxNQUFNLGFBQWMsU0FBUSx5QkFBVztJQUNyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLE1BQU0sd0JBQXdCLEdBQUcsaUJBQWlCLENBQUM7UUFFbkQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixVQUFVLEVBQUU7Z0JBQ1YsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxlQUFlLEVBQUUsMENBQTBDO2FBQzlGO1lBQ0QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sd0JBQXdCLEdBQUcsSUFBSSwwQkFBWSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRS9GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLHdCQUF3QixDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFbkgsK0VBQStFO1lBQy9FLHVGQUF1RjtZQUN2RixJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDaEY7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtnQkFDOUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO2dCQUNuRCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsV0FBVyxFQUFFO29CQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsSUFBSSxFQUFFO29CQUM3QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbURBQW1EO2lCQUMxRjthQUNGLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxXQUFZLFNBQVEsbUJBQUs7SUFDN0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFckQsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSwrQkFBK0IsRUFBRSxDQUFDLENBQUM7SUFDdkksQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc25zX3N1YnNjcmlwdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCB7IEFwcCwgQ2ZuUGFyYW1ldGVyLCBOZXN0ZWRTdGFjaywgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyogZXNsaW50LWRpc2FibGUgQGF3cy1jZGsvbm8tY29yZS1jb25zdHJ1Y3QgKi9cblxuaW50ZXJmYWNlIE15TmVzdGVkU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IHN1YnNjcmliZXI/OiBzcXMuUXVldWU7XG4gIHJlYWRvbmx5IHNpYmxpbmdUb3BpYz86IHNucy5Ub3BpYzsgLy8gYSB0b3BpYyBkZWZpbmVkIGluIGEgc2libGluZyBuZXN0ZWQgc3RhY2tcbiAgcmVhZG9ubHkgdG9waWNDb3VudDogbnVtYmVyO1xuICByZWFkb25seSB0b3BpY05hbWVQcmVmaXg6IHN0cmluZztcbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmNsYXNzIE15TmVzdGVkU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNeU5lc3RlZFN0YWNrUHJvcHMpIHtcbiAgICBjb25zdCB0b3BpY05hbWVQcmVmaXhMb2dpY2FsSWQgPSAnVG9waWNOYW1lUHJlZml4JztcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBbdG9waWNOYW1lUHJlZml4TG9naWNhbElkXTogcHJvcHMudG9waWNOYW1lUHJlZml4LCAvLyBwYXNzIGluIGEgcGFyYW1ldGVyIHRvIHRoZSBuZXN0ZWQgc3RhY2tcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3BpY05hbWVQcmVmaXhQYXJhbWV0ZXIgPSBuZXcgQ2ZuUGFyYW1ldGVyKHRoaXMsICdUb3BpY05hbWVQcmVmaXgnLCB7IHR5cGU6ICdTdHJpbmcnIH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy50b3BpY0NvdW50OyArK2kpIHtcbiAgICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyh0aGlzLCBgdG9waWMtJHtpfWAsIHsgZGlzcGxheU5hbWU6IGAke3RvcGljTmFtZVByZWZpeFBhcmFtZXRlci52YWx1ZUFzU3RyaW5nfS0ke2l9YCB9KTtcblxuICAgICAgLy8gc2luY2UgdGhlIHN1YnNjcmlwdGlvbiByZXNvdXJjZXMgYXJlIGRlZmluZWQgaW4gdGhlIHN1YnNjcmliZXIncyBzdGFjaywgdGhpc1xuICAgICAgLy8gd2lsbCBhZGQgYW4gU05TIHN1YnNjcmlwdGlvbiByZXNvdXJjZSB0byB0aGUgcGFyZW50IHN0YWNrIHRoYXQgcmVmZXJlbmNlIHRoaXMgdG9waWMuXG4gICAgICBpZiAocHJvcHMuc3Vic2NyaWJlcikge1xuICAgICAgICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHNuc19zdWJzY3JpcHRpb25zLlNxc1N1YnNjcmlwdGlvbihwcm9wcy5zdWJzY3JpYmVyKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnN1YnNjcmliZXIpIHtcbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2ZuJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnY29uc29sZS5lcnJvcihcImhpXCIpJyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBUT1BJQ19BUk46IHByb3BzLnNpYmxpbmdUb3BpYz8udG9waWNBcm4gPz8gJycsXG4gICAgICAgICAgUVVFVUVfVVJMOiBwcm9wcy5zdWJzY3JpYmVyLnF1ZXVlVXJsLCAvLyBuZXN0ZWQgc3RhY2sgcmVmZXJlbmNlcyBhIHJlc291cmNlIGluIHRoZSBwYXJlbnRcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBNeVRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ1N1YnNjcmliZXJRdWV1ZScpO1xuXG4gICAgbmV3IE15TmVzdGVkU3RhY2sodGhpcywgJ05lc3RlZFN0YWNrMScsIHsgdG9waWNDb3VudDogMywgdG9waWNOYW1lUHJlZml4OiAnUHJlZml4MScsIHN1YnNjcmliZXI6IHF1ZXVlIH0pO1xuICAgIG5ldyBNeU5lc3RlZFN0YWNrKHRoaXMsICdOZXN0ZWRTdGFjazInLCB7IHRvcGljQ291bnQ6IDIsIHRvcGljTmFtZVByZWZpeDogJ1ByZWZpeDInLCBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgc2Vjb3VuZCBuZXN0ZWQgc3RhY2suJyB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgTXlUZXN0U3RhY2soYXBwLCAnbmVzdGVkLXN0YWNrcy10ZXN0Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==