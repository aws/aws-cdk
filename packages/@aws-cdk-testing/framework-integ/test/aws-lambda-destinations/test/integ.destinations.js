"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const sns = require("aws-cdk-lib/aws-sns");
const sqs = require("aws-cdk-lib/aws-sqs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const destinations = require("aws-cdk-lib/aws-lambda-destinations");
/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"NOT OK"' response.json
 */
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const topic = new sns.Topic(this, 'Topic');
        this.queue = new sqs.Queue(this, 'Queue');
        this.fn = new lambda.Function(this, 'SnsSqs', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
            onFailure: new destinations.SnsDestination(topic),
            onSuccess: new destinations.SqsDestination(this.queue),
            maxEventAge: aws_cdk_lib_1.Duration.hours(3),
            retryAttempts: 1,
        });
        const onSuccessLambda = new lambda.Function(this, 'OnSucces', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = async (event) => {
        console.log(event);
      };`),
        });
        new lambda.Function(this, 'EventBusLambda', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = async (event) => {
        if (event.status === 'OK') return 'success';
        throw new Error('failure');
      };`),
            onFailure: new destinations.EventBridgeDestination(),
            onSuccess: new destinations.LambdaDestination(onSuccessLambda),
        });
        const version = this.fn.addVersion('MySpecialVersion');
        new lambda.Alias(this, 'MySpecialAlias', {
            aliasName: 'MySpecialAlias',
            version,
            onSuccess: new destinations.SqsDestination(this.queue),
            onFailure: new destinations.SnsDestination(topic),
            maxEventAge: aws_cdk_lib_1.Duration.hours(2),
            retryAttempts: 0,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'aws-cdk-lambda-destinations');
const integ = new integ_tests_alpha_1.IntegTest(app, 'Destinations', {
    testCases: [stack],
});
integ.assertions.invokeFunction({
    functionName: stack.fn.functionName,
    invocationType: integ_tests_alpha_1.InvocationType.EVENT,
    payload: JSON.stringify({ status: 'OK' }),
});
const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
    QueueUrl: stack.queue.queueUrl,
    WaitTimeSeconds: 20,
});
message.assertAtPath('Messages.0.Body', integ_tests_alpha_1.ExpectedResult.objectLike({
    requestContext: {
        condition: 'Success',
    },
    requestPayload: {
        status: 'OK',
    },
    responseContext: {
        statusCode: 200,
    },
    responsePayload: 'success',
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGVzdGluYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZGVzdGluYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsNkNBQStEO0FBQy9ELGtFQUF1RjtBQUV2RixvRUFBb0U7QUFFcEU7Ozs7R0FJRztBQUVILE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBRzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUM1QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7O1NBRzFCLENBQUM7WUFDSixTQUFTLEVBQUUsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztZQUNqRCxTQUFTLEVBQUUsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdEQsV0FBVyxFQUFFLHNCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5QixhQUFhLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM1RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7U0FFMUIsQ0FBQztTQUNMLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDMUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7OztTQUcxQixDQUFDO1lBQ0osU0FBUyxFQUFFLElBQUksWUFBWSxDQUFDLHNCQUFzQixFQUFFO1lBQ3BELFNBQVMsRUFBRSxJQUFJLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7U0FDL0QsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUV2RCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsT0FBTztZQUNQLFNBQVMsRUFBRSxJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0RCxTQUFTLEVBQUUsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztZQUNqRCxXQUFXLEVBQUUsc0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGFBQWEsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2hFLE1BQU0sS0FBSyxHQUFHLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFO0lBQy9DLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUM5QixZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZO0lBQ25DLGNBQWMsRUFBRSxrQ0FBYyxDQUFDLEtBQUs7SUFDcEMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7Q0FDMUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ25FLFFBQVEsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7SUFDOUIsZUFBZSxFQUFFLEVBQUU7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxrQ0FBYyxDQUFDLFVBQVUsQ0FBQztJQUNoRSxjQUFjLEVBQUU7UUFDZCxTQUFTLEVBQUUsU0FBUztLQUNyQjtJQUNELGNBQWMsRUFBRTtRQUNkLE1BQU0sRUFBRSxJQUFJO0tBQ2I7SUFDRCxlQUFlLEVBQUU7UUFDZixVQUFVLEVBQUUsR0FBRztLQUNoQjtJQUNELGVBQWUsRUFBRSxTQUFTO0NBQzNCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0IHsgQXBwLCBEdXJhdGlvbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QsIEludm9jYXRpb25UeXBlLCBFeHBlY3RlZFJlc3VsdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZGVzdGluYXRpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZGVzdGluYXRpb25zJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIGxhbWJkYSBpbnZva2UgLS1mdW5jdGlvbi1uYW1lIDxkZXBsb3llZCBmbiBuYW1lPiAtLWludm9jYXRpb24tdHlwZSBFdmVudCAtLXBheWxvYWQgJ1wiT0tcIicgcmVzcG9uc2UuanNvblxuICogKiBhd3MgbGFtYmRhIGludm9rZSAtLWZ1bmN0aW9uLW5hbWUgPGRlcGxveWVkIGZuIG5hbWU+IC0taW52b2NhdGlvbi10eXBlIEV2ZW50IC0tcGF5bG9hZCAnXCJOT1QgT0tcIicgcmVzcG9uc2UuanNvblxuICovXG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IGZuOiBsYW1iZGEuRnVuY3Rpb247XG4gIHB1YmxpYyByZWFkb25seSBxdWV1ZTogc3FzLlF1ZXVlO1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyh0aGlzLCAnVG9waWMnKTtcbiAgICB0aGlzLnF1ZXVlID0gbmV3IHNxcy5RdWV1ZSh0aGlzLCAnUXVldWUnKTtcblxuICAgIHRoaXMuZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdTbnNTcXMnLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQuc3RhdHVzID09PSAnT0snKSByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWx1cmUnKTtcbiAgICAgIH07YCksXG4gICAgICBvbkZhaWx1cmU6IG5ldyBkZXN0aW5hdGlvbnMuU25zRGVzdGluYXRpb24odG9waWMpLFxuICAgICAgb25TdWNjZXNzOiBuZXcgZGVzdGluYXRpb25zLlNxc0Rlc3RpbmF0aW9uKHRoaXMucXVldWUpLFxuICAgICAgbWF4RXZlbnRBZ2U6IER1cmF0aW9uLmhvdXJzKDMpLFxuICAgICAgcmV0cnlBdHRlbXB0czogMSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG9uU3VjY2Vzc0xhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ09uU3VjY2VzJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgfTtgKSxcbiAgICB9KTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0V2ZW50QnVzTGFtYmRhJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnN0YXR1cyA9PT0gJ09LJykgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsdXJlJyk7XG4gICAgICB9O2ApLFxuICAgICAgb25GYWlsdXJlOiBuZXcgZGVzdGluYXRpb25zLkV2ZW50QnJpZGdlRGVzdGluYXRpb24oKSxcbiAgICAgIG9uU3VjY2VzczogbmV3IGRlc3RpbmF0aW9ucy5MYW1iZGFEZXN0aW5hdGlvbihvblN1Y2Nlc3NMYW1iZGEpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9IHRoaXMuZm4uYWRkVmVyc2lvbignTXlTcGVjaWFsVmVyc2lvbicpO1xuXG4gICAgbmV3IGxhbWJkYS5BbGlhcyh0aGlzLCAnTXlTcGVjaWFsQWxpYXMnLCB7XG4gICAgICBhbGlhc05hbWU6ICdNeVNwZWNpYWxBbGlhcycsXG4gICAgICB2ZXJzaW9uLFxuICAgICAgb25TdWNjZXNzOiBuZXcgZGVzdGluYXRpb25zLlNxc0Rlc3RpbmF0aW9uKHRoaXMucXVldWUpLFxuICAgICAgb25GYWlsdXJlOiBuZXcgZGVzdGluYXRpb25zLlNuc0Rlc3RpbmF0aW9uKHRvcGljKSxcbiAgICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyKSxcbiAgICAgIHJldHJ5QXR0ZW1wdHM6IDAsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnYXdzLWNkay1sYW1iZGEtZGVzdGluYXRpb25zJyk7XG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnRGVzdGluYXRpb25zJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuaW50ZWcuYXNzZXJ0aW9ucy5pbnZva2VGdW5jdGlvbih7XG4gIGZ1bmN0aW9uTmFtZTogc3RhY2suZm4uZnVuY3Rpb25OYW1lLFxuICBpbnZvY2F0aW9uVHlwZTogSW52b2NhdGlvblR5cGUuRVZFTlQsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHsgc3RhdHVzOiAnT0snIH0pLFxufSk7XG5cbmNvbnN0IG1lc3NhZ2UgPSBpbnRlZy5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1NRUycsICdyZWNlaXZlTWVzc2FnZScsIHtcbiAgUXVldWVVcmw6IHN0YWNrLnF1ZXVlLnF1ZXVlVXJsLFxuICBXYWl0VGltZVNlY29uZHM6IDIwLFxufSk7XG5cbm1lc3NhZ2UuYXNzZXJ0QXRQYXRoKCdNZXNzYWdlcy4wLkJvZHknLCBFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgcmVxdWVzdENvbnRleHQ6IHtcbiAgICBjb25kaXRpb246ICdTdWNjZXNzJyxcbiAgfSxcbiAgcmVxdWVzdFBheWxvYWQ6IHtcbiAgICBzdGF0dXM6ICdPSycsXG4gIH0sXG4gIHJlc3BvbnNlQ29udGV4dDoge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgfSxcbiAgcmVzcG9uc2VQYXlsb2FkOiAnc3VjY2VzcycsXG59KSk7XG4iXX0=