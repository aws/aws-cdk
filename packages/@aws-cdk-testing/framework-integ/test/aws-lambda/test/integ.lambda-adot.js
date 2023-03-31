"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const app = new cdk.App();
class StackUnderTest extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new aws_lambda_1.Function(this, 'MyFunc1', {
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: aws_lambda_1.Code.fromInline(`exports.handler = ${handler.toString()}`),
            architecture: props.architecture,
            adotInstrumentation: {
                layerVersion: aws_lambda_1.AdotLayerVersion.fromJavaScriptSdkLayerVersion(aws_lambda_1.AdotLambdaLayerJavaScriptSdkVersion.LATEST),
                execWrapper: aws_lambda_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new aws_lambda_1.Function(this, 'MyFunc2', {
            runtime: aws_lambda_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: aws_lambda_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: aws_lambda_1.AdotLayerVersion.fromPythonSdkLayerVersion(aws_lambda_1.AdotLambdaLayerPythonSdkVersion.LATEST),
                execWrapper: aws_lambda_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new aws_lambda_1.Function(this, 'MyFunc3', {
            runtime: aws_lambda_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: aws_lambda_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: aws_lambda_1.AdotLayerVersion.fromJavaSdkLayerVersion(aws_lambda_1.AdotLambdaLayerJavaSdkVersion.LATEST),
                execWrapper: aws_lambda_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new aws_lambda_1.Function(this, 'MyFunc4', {
            runtime: aws_lambda_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: aws_lambda_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: aws_lambda_1.AdotLayerVersion.fromJavaAutoInstrumentationLayerVersion(aws_lambda_1.AdotLambdaLayerJavaAutoInstrumentationVersion.LATEST),
                execWrapper: aws_lambda_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new aws_lambda_1.Function(this, 'MyFunc5', {
            runtime: aws_lambda_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: aws_lambda_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: aws_lambda_1.AdotLayerVersion.fromGenericLayerVersion(aws_lambda_1.AdotLambdaLayerGenericVersion.LATEST),
                execWrapper: aws_lambda_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
    }
}
/* eslint-disable no-console */
function handler(event, _context, callback) {
    console.log(JSON.stringify(event, undefined, 2));
    return callback();
}
new integ_tests_alpha_1.IntegTest(app, 'IntegTest', {
    testCases: [
        new StackUnderTest(app, 'Stack1', {
            architecture: aws_lambda_1.Architecture.ARM_64,
        }),
        new StackUnderTest(app, 'Stack2', {
            architecture: aws_lambda_1.Architecture.X86_64,
        }),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFkb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5sYW1iZGEtYWRvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFFdkQsNkNBQWdEO0FBQ2hELHVEQVlnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQU0xQixNQUFNLGNBQWUsU0FBUSxtQkFBSztJQUNoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTBCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLGlCQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztZQUNoRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyw2QkFBNkIsQ0FBQyxnREFBbUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hHLFdBQVcsRUFBRSxrQ0FBcUIsQ0FBQyxlQUFlO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQyw0Q0FBK0IsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hHLFdBQVcsRUFBRSxrQ0FBcUIsQ0FBQyxlQUFlO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQywwQ0FBNkIsQ0FBQyxNQUFNLENBQUM7Z0JBQzVGLFdBQVcsRUFBRSxrQ0FBcUIsQ0FBQyxlQUFlO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyx1Q0FBdUMsQ0FBQywwREFBNkMsQ0FBQyxNQUFNLENBQUM7Z0JBQzVILFdBQVcsRUFBRSxrQ0FBcUIsQ0FBQyxlQUFlO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQywwQ0FBNkIsQ0FBQyxNQUFNLENBQUM7Z0JBQzVGLFdBQVcsRUFBRSxrQ0FBcUIsQ0FBQyxlQUFlO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsK0JBQStCO0FBQy9CLFNBQVMsT0FBTyxDQUFDLEtBQVUsRUFBRSxRQUFhLEVBQUUsUUFBYTtJQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sUUFBUSxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUVELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFO0lBQzlCLFNBQVMsRUFBRTtRQUNULElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDaEMsWUFBWSxFQUFFLHlCQUFZLENBQUMsTUFBTTtTQUNsQyxDQUFDO1FBQ0YsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUNoQyxZQUFZLEVBQUUseUJBQVksQ0FBQyxNQUFNO1NBQ2xDLENBQUM7S0FDSDtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YWNrUHJvcHMsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHtcbiAgQWRvdExhbWJkYUxheWVyUHl0aG9uU2RrVmVyc2lvbixcbiAgQWRvdExhbWJkYUxheWVySmF2YVNka1ZlcnNpb24sXG4gIEFkb3RMYW1iZGFFeGVjV3JhcHBlcixcbiAgQWRvdExhbWJkYUxheWVySmF2YVNjcmlwdFNka1ZlcnNpb24sXG4gIEFkb3RMYW1iZGFMYXllckphdmFBdXRvSW5zdHJ1bWVudGF0aW9uVmVyc2lvbixcbiAgQWRvdExhbWJkYUxheWVyR2VuZXJpY1ZlcnNpb24sXG4gIENvZGUsXG4gIEFyY2hpdGVjdHVyZSxcbiAgRnVuY3Rpb24sXG4gIFJ1bnRpbWUsXG4gIEFkb3RMYXllclZlcnNpb24sXG59IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5pbnRlcmZhY2UgU3RhY2tVbmRlclRlc3RQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICBhcmNoaXRlY3R1cmU/OiBBcmNoaXRlY3R1cmU7XG59XG5cbmNsYXNzIFN0YWNrVW5kZXJUZXN0IGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RhY2tVbmRlclRlc3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IEZ1bmN0aW9uKHRoaXMsICdNeUZ1bmMxJywge1xuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZShgZXhwb3J0cy5oYW5kbGVyID0gJHtoYW5kbGVyLnRvU3RyaW5nKCl9YCksXG4gICAgICBhcmNoaXRlY3R1cmU6IHByb3BzLmFyY2hpdGVjdHVyZSxcbiAgICAgIGFkb3RJbnN0cnVtZW50YXRpb246IHtcbiAgICAgICAgbGF5ZXJWZXJzaW9uOiBBZG90TGF5ZXJWZXJzaW9uLmZyb21KYXZhU2NyaXB0U2RrTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllckphdmFTY3JpcHRTZGtWZXJzaW9uLkxBVEVTVCksXG4gICAgICAgIGV4ZWNXcmFwcGVyOiBBZG90TGFtYmRhRXhlY1dyYXBwZXIuUkVHVUxBUl9IQU5ETEVSLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBGdW5jdGlvbih0aGlzLCAnTXlGdW5jMicsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZGVmIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpOiBwYXNzJyksXG4gICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgIGxheWVyVmVyc2lvbjogQWRvdExheWVyVmVyc2lvbi5mcm9tUHl0aG9uU2RrTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllclB5dGhvblNka1ZlcnNpb24uTEFURVNUKSxcbiAgICAgICAgZXhlY1dyYXBwZXI6IEFkb3RMYW1iZGFFeGVjV3JhcHBlci5SRUdVTEFSX0hBTkRMRVIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEZ1bmN0aW9uKHRoaXMsICdNeUZ1bmMzJywge1xuICAgICAgcnVudGltZTogUnVudGltZS5QWVRIT05fM185LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogQ29kZS5mcm9tSW5saW5lKCdkZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6IHBhc3MnKSxcbiAgICAgIGFkb3RJbnN0cnVtZW50YXRpb246IHtcbiAgICAgICAgbGF5ZXJWZXJzaW9uOiBBZG90TGF5ZXJWZXJzaW9uLmZyb21KYXZhU2RrTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllckphdmFTZGtWZXJzaW9uLkxBVEVTVCksXG4gICAgICAgIGV4ZWNXcmFwcGVyOiBBZG90TGFtYmRhRXhlY1dyYXBwZXIuUkVHVUxBUl9IQU5ETEVSLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBGdW5jdGlvbih0aGlzLCAnTXlGdW5jNCcsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZGVmIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpOiBwYXNzJyksXG4gICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgIGxheWVyVmVyc2lvbjogQWRvdExheWVyVmVyc2lvbi5mcm9tSmF2YUF1dG9JbnN0cnVtZW50YXRpb25MYXllclZlcnNpb24oQWRvdExhbWJkYUxheWVySmF2YUF1dG9JbnN0cnVtZW50YXRpb25WZXJzaW9uLkxBVEVTVCksXG4gICAgICAgIGV4ZWNXcmFwcGVyOiBBZG90TGFtYmRhRXhlY1dyYXBwZXIuUkVHVUxBUl9IQU5ETEVSLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBGdW5jdGlvbih0aGlzLCAnTXlGdW5jNScsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZGVmIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpOiBwYXNzJyksXG4gICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgIGxheWVyVmVyc2lvbjogQWRvdExheWVyVmVyc2lvbi5mcm9tR2VuZXJpY0xheWVyVmVyc2lvbihBZG90TGFtYmRhTGF5ZXJHZW5lcmljVmVyc2lvbi5MQVRFU1QpLFxuICAgICAgICBleGVjV3JhcHBlcjogQWRvdExhbWJkYUV4ZWNXcmFwcGVyLlJFR1VMQVJfSEFORExFUixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuZnVuY3Rpb24gaGFuZGxlcihldmVudDogYW55LCBfY29udGV4dDogYW55LCBjYWxsYmFjazogYW55KSB7XG4gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGV2ZW50LCB1bmRlZmluZWQsIDIpKTtcbiAgcmV0dXJuIGNhbGxiYWNrKCk7XG59XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnSW50ZWdUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtcbiAgICBuZXcgU3RhY2tVbmRlclRlc3QoYXBwLCAnU3RhY2sxJywge1xuICAgICAgYXJjaGl0ZWN0dXJlOiBBcmNoaXRlY3R1cmUuQVJNXzY0LFxuICAgIH0pLFxuICAgIG5ldyBTdGFja1VuZGVyVGVzdChhcHAsICdTdGFjazInLCB7XG4gICAgICBhcmNoaXRlY3R1cmU6IEFyY2hpdGVjdHVyZS5YODZfNjQsXG4gICAgfSksXG4gIF0sXG59KTtcbiJdfQ==