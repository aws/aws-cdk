"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const lambda = require("aws-cdk-lib/aws-lambda");
/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-lambda-bundling --query Stacks[0].Outputs[0].OutputValue
 * * aws lambda invoke --function-name <output from above> response.json
 * * cat response.json
 * The last command should show '200'
 */
class TestStack extends aws_cdk_lib_1.Stack {
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
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'cdk-integ-lambda-bundling');
const integ = new integ_tests_alpha_1.IntegTest(app, 'Bundling', {
    testCases: [stack],
    stackUpdateWorkflow: false,
});
const invoke = integ.assertions.invokeFunction({
    functionName: stack.functionName,
});
invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: '200',
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVuZGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idW5kbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qiw2Q0FBcUQ7QUFDckQsa0VBQXVFO0FBRXZFLGlEQUFpRDtBQUVqRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUUzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDaEUsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDL0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDckMsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxhQUFhO29CQUM5QyxPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLElBQUksRUFBRTs0QkFDWix3QkFBd0I7NEJBQ3hCLGtCQUFrQjs0QkFDbEIsc0NBQXNDO3lCQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBQ2Y7aUJBQ0Y7YUFDRixDQUFDO1lBQ0YsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFOUQsTUFBTSxLQUFLLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLG1CQUFtQixFQUFFLEtBQUs7Q0FDM0IsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO0NBQ2pDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsa0NBQWMsQ0FBQyxVQUFVLENBQUM7SUFDdEMsT0FBTyxFQUFFLEtBQUs7Q0FDZixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0LCBFeHBlY3RlZFJlc3VsdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuXG4vKipcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIGNsb3VkZm9ybWF0aW9uIGRlc2NyaWJlLXN0YWNrcyAtLXN0YWNrLW5hbWUgY2RrLWludGVnLWxhbWJkYS1idW5kbGluZyAtLXF1ZXJ5IFN0YWNrc1swXS5PdXRwdXRzWzBdLk91dHB1dFZhbHVlXG4gKiAqIGF3cyBsYW1iZGEgaW52b2tlIC0tZnVuY3Rpb24tbmFtZSA8b3V0cHV0IGZyb20gYWJvdmU+IHJlc3BvbnNlLmpzb25cbiAqICogY2F0IHJlc3BvbnNlLmpzb25cbiAqIFRoZSBsYXN0IGNvbW1hbmQgc2hvdWxkIHNob3cgJzIwMCdcbiAqL1xuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXNzZXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3B5dGhvbi1sYW1iZGEtaGFuZGxlcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYXNzZXRQYXRoLCB7XG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgaW1hZ2U6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzkuYnVuZGxpbmdJbWFnZSxcbiAgICAgICAgICBjb21tYW5kOiBbXG4gICAgICAgICAgICAnYmFzaCcsICctYycsIFtcbiAgICAgICAgICAgICAgJ2NwIC1hdSAuIC9hc3NldC1vdXRwdXQnLFxuICAgICAgICAgICAgICAnY2QgL2Fzc2V0LW91dHB1dCcsXG4gICAgICAgICAgICAgICdwaXAgaW5zdGFsbCAtciByZXF1aXJlbWVudHMudHh0IC10IC4nLFxuICAgICAgICAgICAgXS5qb2luKCcgJiYgJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gZm4uZnVuY3Rpb25OYW1lO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctbGFtYmRhLWJ1bmRsaW5nJyk7XG5cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsICdCdW5kbGluZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBzdGFja1VwZGF0ZVdvcmtmbG93OiBmYWxzZSxcbn0pO1xuXG5jb25zdCBpbnZva2UgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiBzdGFjay5mdW5jdGlvbk5hbWUsXG59KTtcbmludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6ICcyMDAnLFxufSkpO1xuIl19