import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

// The integration forwards only the named request headers to the Step Functions
// execution input, instead of all headers (which would include sensitive values
// such as Authorization).
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigateway-stepfunctions-header-names');

const api = new apigw.RestApi(stack, 'my-rest-api');

// Returns the forwarded headers as a JSON string, so the assertion below can check
// both which headers are present and that the others were filtered out.
const passTask = new sfn.Pass(stack, 'passTask', {
  parameters: {
    'headers.$': 'States.JsonToString($.header)',
  },
});

const stateMachine: sfn.IStateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(passTask),
  stateMachineType: sfn.StateMachineType.EXPRESS,
});

const integ = apigw.StepFunctionsIntegration.startExecution(stateMachine, {
  headerNames: ['User-Id', 'x-correlation-id'],
});
api.root.addMethod('POST', integ);

const test = new IntegTest(app, 'aws-apigateway-stepfunctions-header-names', {
  testCases: [
    stack,
  ],
});

// API Gateway adds many headers of its own (Host, X-Forwarded-For, ...), so most
// headers are skipped by the filter. A 200 response therefore also shows that the
// mapping template produced valid JSON when headers are skipped.
test.assertions.httpApiCall(api.urlForPath('/'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Id': 'abc',
    'x-correlation-id': 'xyz',
    'Authorization': 'secret-token',
  },
  body: JSON.stringify({}),
}).expect(ExpectedResult.objectLike({
  status: 200,
  body: {
    headers: Match.stringLikeRegexp('^(?!.*secret-token)(?=.*"[Uu]ser-[Ii]d"\\s*:\\s*"abc")(?=.*"x-correlation-id"\\s*:\\s*"xyz").*$'),
  },
}));
