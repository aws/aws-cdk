"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lambda = require("../lib");
/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-lambda-bundling --query Stacks[0].Outputs[0].OutputValue
 * * aws lambda invoke --function-name <output from above> response.json
 * * cat response.json
 * The last command should show '200'
 */
class TestStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const assetPath = path.join(__dirname, 'python-lambda-handler');
        const fn = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromAsset(assetPath, {
                bundling: {
                    image: lambda.Runtime.PYTHON_3_9.bundlingImage,
                    command: [
                        'bash', '-c', [
                            'cp -au . /asset-output',
                            'cd /asset-output',
                            'pip install -r requirements.txt -t .',
                        ].join(' && '),
                    ],
                },
            }),
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'index.handler',
        });
        this.functionName = fn.functionName;
    }
}
const app = new core_1.App();
const stack = new TestStack(app, 'cdk-integ-lambda-bundling');
const integ = new integ_tests_1.IntegTest(app, 'Bundling', {
    testCases: [stack],
    stackUpdateWorkflow: false,
});
const invoke = integ.assertions.invokeFunction({
    functionName: stack.functionName,
});
invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: '200',
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVuZGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idW5kbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBdUQ7QUFDdkQsc0RBQWlFO0FBRWpFLGlDQUFpQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBRTNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoRSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUNyQyxRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWE7b0JBQzlDLE9BQU8sRUFBRTt3QkFDUCxNQUFNLEVBQUUsSUFBSSxFQUFFOzRCQUNaLHdCQUF3Qjs0QkFDeEIsa0JBQWtCOzRCQUNsQixzQ0FBc0M7eUJBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDZjtpQkFDRjthQUNGLENBQUM7WUFDRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztLQUNyQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUU5RCxNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUMzQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsbUJBQW1CLEVBQUUsS0FBSztDQUMzQixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Q0FDakMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyw0QkFBYyxDQUFDLFVBQVUsQ0FBQztJQUN0QyxPQUFPLEVBQUUsS0FBSztDQUNmLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCwgRXhwZWN0ZWRSZXN1bHQgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIGNsb3VkZm9ybWF0aW9uIGRlc2NyaWJlLXN0YWNrcyAtLXN0YWNrLW5hbWUgY2RrLWludGVnLWxhbWJkYS1idW5kbGluZyAtLXF1ZXJ5IFN0YWNrc1swXS5PdXRwdXRzWzBdLk91dHB1dFZhbHVlXG4gKiAqIGF3cyBsYW1iZGEgaW52b2tlIC0tZnVuY3Rpb24tbmFtZSA8b3V0cHV0IGZyb20gYWJvdmU+IHJlc3BvbnNlLmpzb25cbiAqICogY2F0IHJlc3BvbnNlLmpzb25cbiAqIFRoZSBsYXN0IGNvbW1hbmQgc2hvdWxkIHNob3cgJzIwMCdcbiAqL1xuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXNzZXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3B5dGhvbi1sYW1iZGEtaGFuZGxlcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYXNzZXRQYXRoLCB7XG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgaW1hZ2U6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzkuYnVuZGxpbmdJbWFnZSxcbiAgICAgICAgICBjb21tYW5kOiBbXG4gICAgICAgICAgICAnYmFzaCcsICctYycsIFtcbiAgICAgICAgICAgICAgJ2NwIC1hdSAuIC9hc3NldC1vdXRwdXQnLFxuICAgICAgICAgICAgICAnY2QgL2Fzc2V0LW91dHB1dCcsXG4gICAgICAgICAgICAgICdwaXAgaW5zdGFsbCAtciByZXF1aXJlbWVudHMudHh0IC10IC4nLFxuICAgICAgICAgICAgXS5qb2luKCcgJiYgJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gZm4uZnVuY3Rpb25OYW1lO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctbGFtYmRhLWJ1bmRsaW5nJyk7XG5cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsICdCdW5kbGluZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBzdGFja1VwZGF0ZVdvcmtmbG93OiBmYWxzZSxcbn0pO1xuXG5jb25zdCBpbnZva2UgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiBzdGFjay5mdW5jdGlvbk5hbWUsXG59KTtcbmludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6ICcyMDAnLFxufSkpO1xuIl19