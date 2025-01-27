import { HttpApi, HttpIntegrationSubtype, HttpMethod, ParameterMapping } from 'aws-cdk-lib/aws-apigatewayv2';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { HttpStepFunctionsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'stepfunctions-integration');

const stateMachine = new sfn.StateMachine(stack, 'RouteStateMachine', {
  definition: new sfn.Pass(stack, 'Pass1'),
});
const expressStateMachine = new sfn.StateMachine(stack, 'ExpressStateMachine', {
  definition: new sfn.Pass(stack, 'Pass2'),
  stateMachineType: sfn.StateMachineType.EXPRESS,
});

const httpApi = new HttpApi(stack, 'Api');
httpApi.addRoutes({
  path: '/default',
  methods: [HttpMethod.POST],
  integration: new HttpStepFunctionsIntegration('Integration', {
    stateMachine,
  }),
});
httpApi.addRoutes({
  path: '/start',
  methods: [HttpMethod.POST],
  integration: new HttpStepFunctionsIntegration('Integration', {
    stateMachine,
    subtype: HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
  }),
});
httpApi.addRoutes({
  path: '/start-sync',
  methods: [HttpMethod.POST],
  integration: new HttpStepFunctionsIntegration('Integration', {
    stateMachine: expressStateMachine,
    subtype: HttpIntegrationSubtype.STEPFUNCTIONS_START_SYNC_EXECUTION,
  }),
});
httpApi.addRoutes({
  path: '/stop',
  methods: [HttpMethod.POST],
  integration: new HttpStepFunctionsIntegration('Integration', {
    stateMachine,
    subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STOP_EXECUTION,
    parameterMapping: new ParameterMapping()
      .custom('ExecutionArn', '$request.querystring.executionArn'),
  }),
});

new integ.IntegTest(app, 'stepfunctions-integration-integ-test', {
  testCases: [stack],
});
app.synth();
