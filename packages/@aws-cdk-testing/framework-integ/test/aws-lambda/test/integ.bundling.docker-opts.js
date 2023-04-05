"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const lambda = require("aws-cdk-lib/aws-lambda");
/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-lambda-bundling-docker-bundling-opts --query Stacks[0].Outputs[0].OutputValue
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
                    network: 'host',
                },
            }),
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'index.handler',
        });
        this.functionName = fn.functionName;
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'cdk-integ-lambda-bundling-docker-bundling-opts');
const integ = new integ_tests_alpha_1.IntegTest(app, 'DockerOptsBundling', {
    testCases: [stack],
    stackUpdateWorkflow: false,
});
const invoke = integ.assertions.invokeFunction({
    functionName: stack.functionName,
});
invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: '200',
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVuZGxpbmcuZG9ja2VyLW9wdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idW5kbGluZy5kb2NrZXItb3B0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qiw2Q0FBcUQ7QUFDckQsa0VBQXVFO0FBRXZFLGlEQUFpRDtBQUVqRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUUzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDaEUsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDL0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDckMsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxhQUFhO29CQUM5QyxPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLElBQUksRUFBRTs0QkFDWix3QkFBd0I7NEJBQ3hCLGtCQUFrQjs0QkFDbEIsc0NBQXNDO3lCQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBQ2Y7b0JBQ0QsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0YsQ0FBQztZQUNGLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO0FBRW5GLE1BQU0sS0FBSyxHQUFHLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7SUFDckQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLG1CQUFtQixFQUFFLEtBQUs7Q0FDM0IsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDN0MsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO0NBQ2pDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsa0NBQWMsQ0FBQyxVQUFVLENBQUM7SUFDdEMsT0FBTyxFQUFFLEtBQUs7Q0FDZixDQUFDLENBQUMsQ0FBQztBQUNKLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0LCBFeHBlY3RlZFJlc3VsdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuXG4vKipcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIGNsb3VkZm9ybWF0aW9uIGRlc2NyaWJlLXN0YWNrcyAtLXN0YWNrLW5hbWUgY2RrLWludGVnLWxhbWJkYS1idW5kbGluZy1kb2NrZXItYnVuZGxpbmctb3B0cyAtLXF1ZXJ5IFN0YWNrc1swXS5PdXRwdXRzWzBdLk91dHB1dFZhbHVlXG4gKiAqIGF3cyBsYW1iZGEgaW52b2tlIC0tZnVuY3Rpb24tbmFtZSA8b3V0cHV0IGZyb20gYWJvdmU+IHJlc3BvbnNlLmpzb25cbiAqICogY2F0IHJlc3BvbnNlLmpzb25cbiAqIFRoZSBsYXN0IGNvbW1hbmQgc2hvdWxkIHNob3cgJzIwMCdcbiAqL1xuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXNzZXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3B5dGhvbi1sYW1iZGEtaGFuZGxlcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYXNzZXRQYXRoLCB7XG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgaW1hZ2U6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzkuYnVuZGxpbmdJbWFnZSxcbiAgICAgICAgICBjb21tYW5kOiBbXG4gICAgICAgICAgICAnYmFzaCcsICctYycsIFtcbiAgICAgICAgICAgICAgJ2NwIC1hdSAuIC9hc3NldC1vdXRwdXQnLFxuICAgICAgICAgICAgICAnY2QgL2Fzc2V0LW91dHB1dCcsXG4gICAgICAgICAgICAgICdwaXAgaW5zdGFsbCAtciByZXF1aXJlbWVudHMudHh0IC10IC4nLFxuICAgICAgICAgICAgXS5qb2luKCcgJiYgJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBuZXR3b3JrOiAnaG9zdCcsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IGZuLmZ1bmN0aW9uTmFtZTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAnY2RrLWludGVnLWxhbWJkYS1idW5kbGluZy1kb2NrZXItYnVuZGxpbmctb3B0cycpO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnRG9ja2VyT3B0c0J1bmRsaW5nJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIHN0YWNrVXBkYXRlV29ya2Zsb3c6IGZhbHNlLFxufSk7XG5cbmNvbnN0IGludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IHN0YWNrLmZ1bmN0aW9uTmFtZSxcbn0pO1xuaW52b2tlLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgUGF5bG9hZDogJzIwMCcsXG59KSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==