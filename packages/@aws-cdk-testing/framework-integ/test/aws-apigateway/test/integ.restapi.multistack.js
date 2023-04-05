"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apig = require("aws-cdk-lib/aws-apigateway");
class FirstStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.firstLambda = new lambda.Function(this, 'firstLambda', {
            functionName: 'FirstLambda',
            code: lambda.Code.fromInline(`exports.handler = async function(event) {
          return  {
            'headers': { 'Content-Type': 'text/plain' },
            'statusCode': 200
          }
        }`),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
    }
}
class SecondStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apig.RestApi(this, 'BooksApi', {
            cloudWatchRole: true,
            restApiName: 'SecondRestAPI',
        });
        api.root.addMethod('ANY');
        const booksApi = api.root.addResource('books');
        const lambdaIntegration = new apig.LambdaIntegration(props.lambda);
        booksApi.addMethod('GET', lambdaIntegration);
    }
}
const app = new cdk.App();
const first = new FirstStack(app, 'FirstStack');
const testCase = new SecondStack(app, 'SecondStack', { lambda: first.firstLambda });
// will deploy dependent stacks, i.e. first
new integ_tests_alpha_1.IntegTest(app, 'restapi-multistack', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS5tdWx0aXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVzdGFwaS5tdWx0aXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBQ2pELG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFFdkQsbURBQW1EO0FBRW5ELE1BQU0sVUFBVyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBR2hDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMxRCxZQUFZLEVBQUUsYUFBYTtZQUMzQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Ozs7O1VBS3pCLENBQUM7WUFDTCxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQU1ELE1BQU0sV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0MsY0FBYyxFQUFFLElBQUk7WUFDcEIsV0FBVyxFQUFFLGVBQWU7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDaEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUVwRiwyQ0FBMkM7QUFDM0MsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUN2QyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGlnIGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcblxuY2xhc3MgRmlyc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBmaXJzdExhbWJkYTogbGFtYmRhLkZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5maXJzdExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2ZpcnN0TGFtYmRhJywge1xuICAgICAgZnVuY3Rpb25OYW1lOiAnRmlyc3RMYW1iZGEnLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZShgZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICByZXR1cm4gIHtcbiAgICAgICAgICAgICdoZWFkZXJzJzogeyAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nIH0sXG4gICAgICAgICAgICAnc3RhdHVzQ29kZSc6IDIwMFxuICAgICAgICAgIH1cbiAgICAgICAgfWApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFNlY29uZFN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IGxhbWJkYTogbGFtYmRhLkZ1bmN0aW9uO1xufVxuXG5jbGFzcyBTZWNvbmRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlY29uZFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnLlJlc3RBcGkodGhpcywgJ0Jvb2tzQXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICByZXN0QXBpTmFtZTogJ1NlY29uZFJlc3RBUEknLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJyk7XG4gICAgY29uc3QgYm9va3NBcGkgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnYm9va3MnKTtcbiAgICBjb25zdCBsYW1iZGFJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnLkxhbWJkYUludGVncmF0aW9uKHByb3BzLmxhbWJkYSk7XG4gICAgYm9va3NBcGkuYWRkTWV0aG9kKCdHRVQnLCBsYW1iZGFJbnRlZ3JhdGlvbik7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IGZpcnN0ID0gbmV3IEZpcnN0U3RhY2soYXBwLCAnRmlyc3RTdGFjaycpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgU2Vjb25kU3RhY2soYXBwLCAnU2Vjb25kU3RhY2snLCB7IGxhbWJkYTogZmlyc3QuZmlyc3RMYW1iZGEgfSk7XG5cbi8vIHdpbGwgZGVwbG95IGRlcGVuZGVudCBzdGFja3MsIGkuZS4gZmlyc3Rcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAncmVzdGFwaS1tdWx0aXN0YWNrJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbiJdfQ==