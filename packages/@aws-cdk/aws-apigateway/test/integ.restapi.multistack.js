"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apig = require("../lib");
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
new integ_tests_1.IntegTest(app, 'restapi-multistack', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS5tdWx0aXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVzdGFwaS5tdWx0aXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQThDO0FBQzlDLHFDQUFxQztBQUNyQyxzREFBaUQ7QUFFakQsK0JBQStCO0FBRS9CLE1BQU0sVUFBVyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBR2hDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMxRCxZQUFZLEVBQUUsYUFBYTtZQUMzQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Ozs7O1VBS3pCLENBQUM7WUFDTCxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFNRCxNQUFNLFdBQVksU0FBUSxHQUFHLENBQUMsS0FBSztJQUNqQyxZQUFZLEtBQTJCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQzFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzdDLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFdBQVcsRUFBRSxlQUFlO1NBQzdCLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7S0FDOUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNoRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBRXBGLDJDQUEyQztBQUMzQyxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFO0lBQ3ZDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXBpZyBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBGaXJzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IGZpcnN0TGFtYmRhOiBsYW1iZGEuRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmZpcnN0TGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZmlyc3RMYW1iZGEnLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6ICdGaXJzdExhbWJkYScsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHJldHVybiAge1xuICAgICAgICAgICAgJ2hlYWRlcnMnOiB7ICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicgfSxcbiAgICAgICAgICAgICdzdGF0dXNDb2RlJzogMjAwXG4gICAgICAgICAgfVxuICAgICAgICB9YCksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgU2Vjb25kU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgbGFtYmRhOiBsYW1iZGEuRnVuY3Rpb247XG59XG5cbmNsYXNzIFNlY29uZFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2Vjb25kU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWcuUmVzdEFwaSh0aGlzLCAnQm9va3NBcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogdHJ1ZSxcbiAgICAgIHJlc3RBcGlOYW1lOiAnU2Vjb25kUmVzdEFQSScsXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknKTtcbiAgICBjb25zdCBib29rc0FwaSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdib29rcycpO1xuICAgIGNvbnN0IGxhbWJkYUludGVncmF0aW9uID0gbmV3IGFwaWcuTGFtYmRhSW50ZWdyYXRpb24ocHJvcHMubGFtYmRhKTtcbiAgICBib29rc0FwaS5hZGRNZXRob2QoJ0dFVCcsIGxhbWJkYUludGVncmF0aW9uKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgZmlyc3QgPSBuZXcgRmlyc3RTdGFjayhhcHAsICdGaXJzdFN0YWNrJyk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBTZWNvbmRTdGFjayhhcHAsICdTZWNvbmRTdGFjaycsIHsgbGFtYmRhOiBmaXJzdC5maXJzdExhbWJkYSB9KTtcblxuLy8gd2lsbCBkZXBsb3kgZGVwZW5kZW50IHN0YWNrcywgaS5lLiBmaXJzdFxubmV3IEludGVnVGVzdChhcHAsICdyZXN0YXBpLW11bHRpc3RhY2snLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuIl19