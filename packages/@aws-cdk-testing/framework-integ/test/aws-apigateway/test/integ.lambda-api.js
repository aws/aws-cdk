"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
class LambdaApiIntegrationOptionsStack extends aws_cdk_lib_1.Stack {
    constructor(scope) {
        super(scope, 'LambdaApiIntegrationOptionsStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        new aws_apigateway_1.LambdaRestApi(this, 'lambdarestapi', {
            handler: fn,
            cloudWatchRole: true,
            integrationOptions: {
                timeout: aws_cdk_lib_1.Duration.seconds(1),
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new LambdaApiIntegrationOptionsStack(app);
new integ_tests_alpha_1.IntegTest(app, 'lambda-integration', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBaUU7QUFDakUsNkNBQW1EO0FBQ25ELGtFQUF1RDtBQUV2RCwrREFBMkQ7QUFFM0QsTUFBTSxnQ0FBaUMsU0FBUSxtQkFBSztJQUNsRCxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztRQUVqRCxNQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdkMsT0FBTyxFQUFFLEVBQUU7WUFDWCxjQUFjLEVBQUUsSUFBSTtZQUNwQixrQkFBa0IsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM3QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksZ0NBQWdDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0QsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUN2QyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29kZSwgRnVuY3Rpb24sIFJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBMYW1iZGFSZXN0QXBpIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5jbGFzcyBMYW1iZGFBcGlJbnRlZ3JhdGlvbk9wdGlvbnNTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHN1cGVyKHNjb3BlLCAnTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zU3RhY2snKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IEZ1bmN0aW9uKHRoaXMsICdteWZuJywge1xuICAgICAgY29kZTogQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAnbGFtYmRhcmVzdGFwaScsIHtcbiAgICAgIGhhbmRsZXI6IGZuLFxuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBpbnRlZ3JhdGlvbk9wdGlvbnM6IHtcbiAgICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zU3RhY2soYXBwKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnbGFtYmRhLWludGVncmF0aW9uJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==