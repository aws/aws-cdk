"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lambda = require("../lib");
/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-lambda-bundling-docker-bundling-opts --query Stacks[0].Outputs[0].OutputValue
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
                    network: 'host',
                },
            }),
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'index.handler',
        });
        this.functionName = fn.functionName;
    }
}
const app = new core_1.App();
const stack = new TestStack(app, 'cdk-integ-lambda-bundling-docker-bundling-opts');
const integ = new integ_tests_1.IntegTest(app, 'DockerOptsBundling', {
    testCases: [stack],
    stackUpdateWorkflow: false,
});
const invoke = integ.assertions.invokeFunction({
    functionName: stack.functionName,
});
invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: '200',
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVuZGxpbmcuZG9ja2VyLW9wdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idW5kbGluZy5kb2NrZXItb3B0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBdUQ7QUFDdkQsc0RBQWlFO0FBRWpFLGlDQUFpQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBRTNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoRSxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUNyQyxRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWE7b0JBQzlDLE9BQU8sRUFBRTt3QkFDUCxNQUFNLEVBQUUsSUFBSSxFQUFFOzRCQUNaLHdCQUF3Qjs0QkFDeEIsa0JBQWtCOzRCQUNsQixzQ0FBc0M7eUJBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDZjtvQkFDRCxPQUFPLEVBQUUsTUFBTTtpQkFDaEI7YUFDRixDQUFDO1lBQ0YsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7S0FDckM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLGdEQUFnRCxDQUFDLENBQUM7QUFFbkYsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUNyRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsbUJBQW1CLEVBQUUsS0FBSztDQUMzQixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Q0FDakMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyw0QkFBYyxDQUFDLFVBQVUsQ0FBQztJQUN0QyxPQUFPLEVBQUUsS0FBSztDQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ0osR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCwgRXhwZWN0ZWRSZXN1bHQgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIGNsb3VkZm9ybWF0aW9uIGRlc2NyaWJlLXN0YWNrcyAtLXN0YWNrLW5hbWUgY2RrLWludGVnLWxhbWJkYS1idW5kbGluZy1kb2NrZXItYnVuZGxpbmctb3B0cyAtLXF1ZXJ5IFN0YWNrc1swXS5PdXRwdXRzWzBdLk91dHB1dFZhbHVlXG4gKiAqIGF3cyBsYW1iZGEgaW52b2tlIC0tZnVuY3Rpb24tbmFtZSA8b3V0cHV0IGZyb20gYWJvdmU+IHJlc3BvbnNlLmpzb25cbiAqICogY2F0IHJlc3BvbnNlLmpzb25cbiAqIFRoZSBsYXN0IGNvbW1hbmQgc2hvdWxkIHNob3cgJzIwMCdcbiAqL1xuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXNzZXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3B5dGhvbi1sYW1iZGEtaGFuZGxlcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYXNzZXRQYXRoLCB7XG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgaW1hZ2U6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzkuYnVuZGxpbmdJbWFnZSxcbiAgICAgICAgICBjb21tYW5kOiBbXG4gICAgICAgICAgICAnYmFzaCcsICctYycsIFtcbiAgICAgICAgICAgICAgJ2NwIC1hdSAuIC9hc3NldC1vdXRwdXQnLFxuICAgICAgICAgICAgICAnY2QgL2Fzc2V0LW91dHB1dCcsXG4gICAgICAgICAgICAgICdwaXAgaW5zdGFsbCAtciByZXF1aXJlbWVudHMudHh0IC10IC4nLFxuICAgICAgICAgICAgXS5qb2luKCcgJiYgJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBuZXR3b3JrOiAnaG9zdCcsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IGZuLmZ1bmN0aW9uTmFtZTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLWxhbWJkYS1idW5kbGluZy1kb2NrZXItYnVuZGxpbmctb3B0cycpO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnRG9ja2VyT3B0c0J1bmRsaW5nJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIHN0YWNrVXBkYXRlV29ya2Zsb3c6IGZhbHNlLFxufSk7XG5cbmNvbnN0IGludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IHN0YWNrLmZ1bmN0aW9uTmFtZSxcbn0pO1xuaW52b2tlLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgUGF5bG9hZDogJzIwMCcsXG59KSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==