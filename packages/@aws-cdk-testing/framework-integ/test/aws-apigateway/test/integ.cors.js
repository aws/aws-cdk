"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigw = require("aws-cdk-lib/aws-apigateway");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apigw.RestApi(this, 'cors-api-test', {
            cloudWatchRole: true,
        });
        const handler = new lambda.Function(this, 'handler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler')),
        });
        const twitch = api.root.addResource('twitch');
        const backend = new apigw.LambdaIntegration(handler);
        twitch.addMethod('GET', backend); // GET /twitch
        twitch.addMethod('POST', backend); // POST /twitch
        twitch.addMethod('DELETE', backend); // DELETE /twitch
        twitch.addCorsPreflight({ allowOrigins: ['https://google.com', 'https://www.test-cors.org'] });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'cors-twitch-test');
new integ_tests_alpha_1.IntegTest(app, 'cors', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsaURBQWlEO0FBQ2pELDZDQUFxRDtBQUNyRCxrRUFBdUQ7QUFFdkQsb0RBQW9EO0FBRXBELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbkQsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDbkQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztTQUN4RSxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7UUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO1FBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBQ3RELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLDJCQUEyQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3hELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0lBQ3pCLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkodGhpcywgJ2NvcnMtYXBpLXRlc3QnLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdoYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2ludGVnLmNvcnMuaGFuZGxlcicpKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHR3aXRjaCA9IGFwaS5yb290LmFkZFJlc291cmNlKCd0d2l0Y2gnKTtcbiAgICBjb25zdCBiYWNrZW5kID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKGhhbmRsZXIpO1xuXG4gICAgdHdpdGNoLmFkZE1ldGhvZCgnR0VUJywgYmFja2VuZCk7IC8vIEdFVCAvdHdpdGNoXG4gICAgdHdpdGNoLmFkZE1ldGhvZCgnUE9TVCcsIGJhY2tlbmQpOyAvLyBQT1NUIC90d2l0Y2hcbiAgICB0d2l0Y2guYWRkTWV0aG9kKCdERUxFVEUnLCBiYWNrZW5kKTsgLy8gREVMRVRFIC90d2l0Y2hcbiAgICB0d2l0Y2guYWRkQ29yc1ByZWZsaWdodCh7IGFsbG93T3JpZ2luczogWydodHRwczovL2dvb2dsZS5jb20nLCAnaHR0cHM6Ly93d3cudGVzdC1jb3JzLm9yZyddIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IFRlc3RTdGFjayhhcHAsICdjb3JzLXR3aXRjaC10ZXN0Jyk7XG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2NvcnMnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=