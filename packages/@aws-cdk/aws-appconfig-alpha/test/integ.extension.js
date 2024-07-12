"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const lib_1 = require("../lib");
const cdkApp = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(cdkApp, 'aws-appconfig-extension');
// create extension through lambda
const lambda = new aws_lambda_1.Function(stack, 'MyFunction', {
    runtime: aws_lambda_1.Runtime.PYTHON_3_8,
    handler: 'index.handler',
    code: aws_lambda_1.Code.fromInline('def handler(event, context):\n\tprint(\'The function has been invoked.\')'),
});
const app = new lib_1.Application(stack, 'MyApplication', {
    applicationName: 'AppForExtensionTest',
});
const lambdaExtension = new lib_1.Extension(stack, 'MyLambdaExtension', {
    actions: [
        new lib_1.Action({
            actionPoints: [
                lib_1.ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION,
                lib_1.ActionPoint.ON_DEPLOYMENT_START,
            ],
            eventDestination: new lib_1.LambdaDestination(lambda),
        }),
    ],
});
app.addExtension(lambdaExtension);
// create extension through sqs queue
const queue = new aws_sqs_1.Queue(stack, 'MyQueue');
const queueExtension = new lib_1.Extension(stack, 'MyQueueExtension', {
    actions: [
        new lib_1.Action({
            actionPoints: [
                lib_1.ActionPoint.ON_DEPLOYMENT_START,
            ],
            eventDestination: new lib_1.SqsDestination(queue),
        }),
    ],
});
app.addExtension(queueExtension);
// create extension through sns topic
const topic = new aws_sns_1.Topic(stack, 'MyTopic');
const topicExtension = new lib_1.Extension(stack, 'MyTopicExtension', {
    actions: [
        new lib_1.Action({
            actionPoints: [
                lib_1.ActionPoint.ON_DEPLOYMENT_START,
            ],
            eventDestination: new lib_1.SnsDestination(topic),
        }),
    ],
});
app.addExtension(topicExtension);
// create extension through event bus (with parameters)
const bus = aws_events_1.EventBus.fromEventBusName(stack, 'MyEventBus', 'default');
const busExtension = new lib_1.Extension(stack, 'MyEventBusExtension', {
    actions: [
        new lib_1.Action({
            actionPoints: [
                lib_1.ActionPoint.ON_DEPLOYMENT_START,
            ],
            eventDestination: new lib_1.EventBridgeDestination(bus),
            description: 'My event bus action',
            name: 'MyEventBusPreHostedConfigVersionAction',
        }),
    ],
    parameters: [
        lib_1.Parameter.required('testParam', 'true'),
        lib_1.Parameter.notRequired('testNotRequiredParam'),
    ],
});
app.addExtension(busExtension);
// invoke the extension actions
const env = app.addEnvironment('MyEnv');
const hostedConfig = new lib_1.HostedConfiguration(stack, 'HostedConfiguration', {
    application: app,
    content: lib_1.ConfigurationContent.fromInlineJson('This is my configuration content'),
    deployTo: [env],
    deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeployStrategy', {
        rolloutStrategy: lib_1.RolloutStrategy.linear({
            growthFactor: 100,
            deploymentDuration: aws_cdk_lib_1.Duration.minutes(0),
        }),
    }),
});
hostedConfig.node.addDependency(lambdaExtension, topicExtension, busExtension, queueExtension);
/* resource deployment alone is sufficient because we already have the
   corresponding resource handler tests to assert that resources can be
   used after created */
new integ_tests_alpha_1.IntegTest(app, 'appconfig-extension', {
    testCases: [stack],
    cdkCommandOptions: {
        destroy: {
            args: {
                force: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0VBQXVEO0FBQ3ZELDZDQUFtRDtBQUNuRCx1REFBa0Q7QUFDbEQsdURBQWlFO0FBQ2pFLGlEQUE0QztBQUM1QyxpREFBNEM7QUFDNUMsZ0NBY2dCO0FBRWhCLE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXpCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUUzRCxrQ0FBa0M7QUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDL0MsT0FBTyxFQUFFLG9CQUFPLENBQUMsVUFBVTtJQUMzQixPQUFPLEVBQUUsZUFBZTtJQUN4QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsMkVBQTJFLENBQUM7Q0FDbkcsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7SUFDbEQsZUFBZSxFQUFFLHFCQUFxQjtDQUN2QyxDQUFDLENBQUM7QUFDSCxNQUFNLGVBQWUsR0FBRyxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7SUFDaEUsT0FBTyxFQUFFO1FBQ1AsSUFBSSxZQUFNLENBQUM7WUFDVCxZQUFZLEVBQUU7Z0JBQ1osaUJBQVcsQ0FBQyx1Q0FBdUM7Z0JBQ25ELGlCQUFXLENBQUMsbUJBQW1CO2FBQ2hDO1lBQ0QsZ0JBQWdCLEVBQUUsSUFBSSx1QkFBaUIsQ0FBQyxNQUFNLENBQUM7U0FDaEQsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVsQyxxQ0FBcUM7QUFDckMsTUFBTSxLQUFL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O0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBTdGFjaywgQXBwLCBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEV2ZW50QnVzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cyc7XG5pbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgVG9waWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcbmltcG9ydCB7IFF1ZXVlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQge1xuICBEZXBsb3ltZW50U3RyYXRlZ3ksXG4gIEV4dGVuc2lvbixcbiAgQWN0aW9uLFxuICBBY3Rpb25Qb2ludCxcbiAgUGFyYW1ldGVyLFxuICBBcHBsaWNhdGlvbixcbiAgUm9sbG91dFN0cmF0ZWd5LFxuICBIb3N0ZWRDb25maWd1cmF0aW9uLFxuICBDb25maWd1cmF0aW9uQ29udGVudCxcbiAgTGFtYmRhRGVzdGluYXRpb24sXG4gIFNxc0Rlc3RpbmF0aW9uLFxuICBTbnNEZXN0aW5hdGlvbixcbiAgRXZlbnRCcmlkZ2VEZXN0aW5hdGlvbixcbn0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgY2RrQXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhjZGtBcHAsICdhd3MtYXBwY29uZmlnLWV4dGVuc2lvbicpO1xuXG4vLyBjcmVhdGUgZXh0ZW5zaW9uIHRocm91Z2ggbGFtYmRhXG5jb25zdCBsYW1iZGEgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdNeUZ1bmN0aW9uJywge1xuICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzgsXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgY29kZTogQ29kZS5mcm9tSW5saW5lKCdkZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6XFxuXFx0cHJpbnQoXFwnVGhlIGZ1bmN0aW9uIGhhcyBiZWVuIGludm9rZWQuXFwnKScpLFxufSk7XG5jb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcGxpY2F0aW9uJywge1xuICBhcHBsaWNhdGlvbk5hbWU6ICdBcHBGb3JFeHRlbnNpb25UZXN0Jyxcbn0pO1xuY29uc3QgbGFtYmRhRXh0ZW5zaW9uID0gbmV3IEV4dGVuc2lvbihzdGFjaywgJ015TGFtYmRhRXh0ZW5zaW9uJywge1xuICBhY3Rpb25zOiBbXG4gICAgbmV3IEFjdGlvbih7XG4gICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgQWN0aW9uUG9pbnQuUFJFX0NSRUFURV9IT1NURURfQ09ORklHVVJBVElPTl9WRVJTSU9OLFxuICAgICAgICBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX1NUQVJULFxuICAgICAgXSxcbiAgICAgIGV2ZW50RGVzdGluYXRpb246IG5ldyBMYW1iZGFEZXN0aW5hdGlvbihsYW1iZGEpLFxuICAgIH0pLFxuICBdLFxufSk7XG5hcHAuYWRkRXh0ZW5zaW9uKGxhbWJkYUV4dGVuc2lvbik7XG5cbi8vIGNyZWF0ZSBleHRlbnNpb24gdGhyb3VnaCBzcXMgcXVldWVcbmNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScpO1xuY29uc3QgcXVldWVFeHRlbnNpb24gPSBuZXcgRXh0ZW5zaW9uKHN0YWNrLCAnTXlRdWV1ZUV4dGVuc2lvbicsIHtcbiAgYWN0aW9uczogW1xuICAgIG5ldyBBY3Rpb24oe1xuICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfU1RBUlQsXG4gICAgICBdLFxuICAgICAgZXZlbnREZXN0aW5hdGlvbjogbmV3IFNxc0Rlc3RpbmF0aW9uKHF1ZXVlKSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuYXBwLmFkZEV4dGVuc2lvbihxdWV1ZUV4dGVuc2lvbik7XG5cbi8vIGNyZWF0ZSBleHRlbnNpb24gdGhyb3VnaCBzbnMgdG9waWNcbmNvbnN0IHRvcGljID0gbmV3IFRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuY29uc3QgdG9waWNFeHRlbnNpb24gPSBuZXcgRXh0ZW5zaW9uKHN0YWNrLCAnTXlUb3BpY0V4dGVuc2lvbicsIHtcbiAgYWN0aW9uczogW1xuICAgIG5ldyBBY3Rpb24oe1xuICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfU1RBUlQsXG4gICAgICBdLFxuICAgICAgZXZlbnREZXN0aW5hdGlvbjogbmV3IFNuc0Rlc3RpbmF0aW9uKHRvcGljKSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuYXBwLmFkZEV4dGVuc2lvbih0b3BpY0V4dGVuc2lvbik7XG5cbi8vIGNyZWF0ZSBleHRlbnNpb24gdGhyb3VnaCBldmVudCBidXMgKHdpdGggcGFyYW1ldGVycylcbmNvbnN0IGJ1cyA9IEV2ZW50QnVzLmZyb21FdmVudEJ1c05hbWUoc3RhY2ssICdNeUV2ZW50QnVzJywgJ2RlZmF1bHQnKTtcbmNvbnN0IGJ1c0V4dGVuc2lvbiA9IG5ldyBFeHRlbnNpb24oc3RhY2ssICdNeUV2ZW50QnVzRXh0ZW5zaW9uJywge1xuICBhY3Rpb25zOiBbXG4gICAgbmV3IEFjdGlvbih7XG4gICAgICBhY3Rpb25Qb2ludHM6IFtcbiAgICAgICAgQWN0aW9uUG9pbnQuT05fREVQTE9ZTUVOVF9TVEFSVCxcbiAgICAgIF0sXG4gICAgICBldmVudERlc3RpbmF0aW9uOiBuZXcgRXZlbnRCcmlkZ2VEZXN0aW5hdGlvbihidXMpLFxuICAgICAgZGVzY3JpcHRpb246ICdNeSBldmVudCBidXMgYWN0aW9uJyxcbiAgICAgIG5hbWU6ICdNeUV2ZW50QnVzUHJlSG9zdGVkQ29uZmlnVmVyc2lvbkFjdGlvbicsXG4gICAgfSksXG4gIF0sXG4gIHBhcmFtZXRlcnM6IFtcbiAgICBQYXJhbWV0ZXIucmVxdWlyZWQoJ3Rlc3RQYXJhbScsICd0cnVlJyksXG4gICAgUGFyYW1ldGVyLm5vdFJlcXVpcmVkKCd0ZXN0Tm90UmVxdWlyZWRQYXJhbScpLFxuICBdLFxufSk7XG5hcHAuYWRkRXh0ZW5zaW9uKGJ1c0V4dGVuc2lvbik7XG5cbi8vIGludm9rZSB0aGUgZXh0ZW5zaW9uIGFjdGlvbnNcbmNvbnN0IGVudiA9IGFwcC5hZGRFbnZpcm9ubWVudCgnTXlFbnYnKTtcbmNvbnN0IGhvc3RlZENvbmZpZyA9IG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnSG9zdGVkQ29uZmlndXJhdGlvbicsIHtcbiAgYXBwbGljYXRpb246IGFwcCxcbiAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZUpzb24oJ1RoaXMgaXMgbXkgY29uZmlndXJhdGlvbiBjb250ZW50JyksXG4gIGRlcGxveVRvOiBbZW52XSxcbiAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3lTdHJhdGVneScsIHtcbiAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgZ3Jvd3RoRmFjdG9yOiAxMDAsXG4gICAgICBkZXBsb3ltZW50RHVyYXRpb246IER1cmF0aW9uLm1pbnV0ZXMoMCksXG4gICAgfSksXG4gIH0pLFxufSk7XG5ob3N0ZWRDb25maWcubm9kZS5hZGREZXBlbmRlbmN5KGxhbWJkYUV4dGVuc2lvbiwgdG9waWNFeHRlbnNpb24sIGJ1c0V4dGVuc2lvbiwgcXVldWVFeHRlbnNpb24pO1xuXG4vKiByZXNvdXJjZSBkZXBsb3ltZW50IGFsb25lIGlzIHN1ZmZpY2llbnQgYmVjYXVzZSB3ZSBhbHJlYWR5IGhhdmUgdGhlXG4gICBjb3JyZXNwb25kaW5nIHJlc291cmNlIGhhbmRsZXIgdGVzdHMgdG8gYXNzZXJ0IHRoYXQgcmVzb3VyY2VzIGNhbiBiZVxuICAgdXNlZCBhZnRlciBjcmVhdGVkICovXG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBwY29uZmlnLWV4dGVuc2lvbicsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBjZGtDb21tYW5kT3B0aW9uczoge1xuICAgIGRlc3Ryb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==