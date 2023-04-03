"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
class LambdaApiIntegrationOptionsNonProxyIntegrationStack extends aws_cdk_lib_1.Stack {
    constructor(scope) {
        super(scope, 'LambdaApiIntegrationOptionsNonProxyIntegrationStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        new aws_apigateway_1.LambdaRestApi(this, 'lambdarestapi', {
            cloudWatchRole: true,
            handler: fn,
            integrationOptions: {
                proxy: false,
                passthroughBehavior: aws_apigateway_1.PassthroughBehavior.WHEN_NO_MATCH,
                integrationResponses: [
                    {
                        statusCode: '200',
                        responseTemplates: {
                            'application/json': JSON.stringify({ message: 'Hello, word' }),
                        },
                    },
                ],
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new LambdaApiIntegrationOptionsNonProxyIntegrationStack(app);
new integ_tests_alpha_1.IntegTest(app, 'lambda-non-proxy-integration', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS1ub25wcm94eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1hcGktbm9ucHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBaUU7QUFDakUsNkNBQXlDO0FBQ3pDLGtFQUF1RDtBQUV2RCwrREFBZ0Y7QUFFaEYsTUFBTSxtREFBb0QsU0FBUSxtQkFBSztJQUNyRSxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUscURBQXFELENBQUMsQ0FBQztRQUVwRSxNQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdkMsY0FBYyxFQUFFLElBQUk7WUFDcEIsT0FBTyxFQUFFLEVBQUU7WUFDWCxrQkFBa0IsRUFBRTtnQkFDbEIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osbUJBQW1CLEVBQUUsb0NBQW1CLENBQUMsYUFBYTtnQkFDdEQsb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixpQkFBaUIsRUFBRTs0QkFDakIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQzt5QkFDL0Q7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksbURBQW1ELENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUUsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsRUFBRTtJQUNqRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29kZSwgRnVuY3Rpb24sIFJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IExhbWJkYVJlc3RBcGksIFBhc3N0aHJvdWdoQmVoYXZpb3IgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbmNsYXNzIExhbWJkYUFwaUludGVncmF0aW9uT3B0aW9uc05vblByb3h5SW50ZWdyYXRpb25TdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHN1cGVyKHNjb3BlLCAnTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zTm9uUHJveHlJbnRlZ3JhdGlvblN0YWNrJyk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbih0aGlzLCAnbXlmbicsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuXG4gICAgbmV3IExhbWJkYVJlc3RBcGkodGhpcywgJ2xhbWJkYXJlc3RhcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXI6IGZuLFxuICAgICAgaW50ZWdyYXRpb25PcHRpb25zOiB7XG4gICAgICAgIHByb3h5OiBmYWxzZSxcbiAgICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5XSEVOX05PX01BVENILFxuICAgICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgICAgcmVzcG9uc2VUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdIZWxsbywgd29yZCcgfSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IExhbWJkYUFwaUludGVncmF0aW9uT3B0aW9uc05vblByb3h5SW50ZWdyYXRpb25TdGFjayhhcHApO1xubmV3IEludGVnVGVzdChhcHAsICdsYW1iZGEtbm9uLXByb3h5LWludGVncmF0aW9uJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==