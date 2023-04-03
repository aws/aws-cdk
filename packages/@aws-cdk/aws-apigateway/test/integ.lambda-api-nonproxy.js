"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class LambdaApiIntegrationOptionsNonProxyIntegrationStack extends core_1.Stack {
    constructor(scope) {
        super(scope, 'LambdaApiIntegrationOptionsNonProxyIntegrationStack');
        const fn = new aws_lambda_1.Function(this, 'myfn', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        new lib_1.LambdaRestApi(this, 'lambdarestapi', {
            cloudWatchRole: true,
            handler: fn,
            integrationOptions: {
                proxy: false,
                passthroughBehavior: lib_1.PassthroughBehavior.WHEN_NO_MATCH,
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
const app = new core_1.App();
const testCase = new LambdaApiIntegrationOptionsNonProxyIntegrationStack(app);
new integ_tests_1.IntegTest(app, 'lambda-non-proxy-integration', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFwaS1ub25wcm94eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1hcGktbm9ucHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBOEQ7QUFDOUQsd0NBQTJDO0FBQzNDLHNEQUFpRDtBQUVqRCxnQ0FBNEQ7QUFFNUQsTUFBTSxtREFBb0QsU0FBUSxZQUFLO0lBQ3JFLFlBQVksS0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEtBQUssRUFBRSxxREFBcUQsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sRUFBRSxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3BDLElBQUksRUFBRSxpQkFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDNUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztZQUM1QixPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLG1CQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxjQUFjLEVBQUUsSUFBSTtZQUNwQixPQUFPLEVBQUUsRUFBRTtZQUNYLGtCQUFrQixFQUFFO2dCQUNsQixLQUFLLEVBQUUsS0FBSztnQkFDWixtQkFBbUIsRUFBRSx5QkFBbUIsQ0FBQyxhQUFhO2dCQUN0RCxvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsVUFBVSxFQUFFLEtBQUs7d0JBQ2pCLGlCQUFpQixFQUFFOzRCQUNqQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDO3lCQUMvRDtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtREFBbUQsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5RSxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLDhCQUE4QixFQUFFO0lBQ2pELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgUnVudGltZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBMYW1iZGFSZXN0QXBpLCBQYXNzdGhyb3VnaEJlaGF2aW9yIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zTm9uUHJveHlJbnRlZ3JhdGlvblN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0KSB7XG4gICAgc3VwZXIoc2NvcGUsICdMYW1iZGFBcGlJbnRlZ3JhdGlvbk9wdGlvbnNOb25Qcm94eUludGVncmF0aW9uU3RhY2snKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IEZ1bmN0aW9uKHRoaXMsICdteWZuJywge1xuICAgICAgY29kZTogQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBuZXcgTGFtYmRhUmVzdEFwaSh0aGlzLCAnbGFtYmRhcmVzdGFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICAgICAgaGFuZGxlcjogZm4sXG4gICAgICBpbnRlZ3JhdGlvbk9wdGlvbnM6IHtcbiAgICAgICAgcHJveHk6IGZhbHNlLFxuICAgICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBQYXNzdGhyb3VnaEJlaGF2aW9yLldIRU5fTk9fTUFUQ0gsXG4gICAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICAgICAgICByZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0hlbGxvLCB3b3JkJyB9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgTGFtYmRhQXBpSW50ZWdyYXRpb25PcHRpb25zTm9uUHJveHlJbnRlZ3JhdGlvblN0YWNrKGFwcCk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2xhbWJkYS1ub24tcHJveHktaW50ZWdyYXRpb24nLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuIl19