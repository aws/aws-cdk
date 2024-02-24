import * as path from 'path';
import { Template } from '../../../assertions';
import * as appsync from '../../../aws-appsync';
import * as events from '../../../aws-events';
import * as cdk from '../../../core';
import * as targets from '../../lib';

// GIVEN
const stack = new cdk.Stack();
let api: appsync.GraphqlApi;
beforeEach(() => {
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
  });
});

test('use AppSync GraphQL API as an event rule target', () => {

  const graphQLOperation = 'mutation Publish($message: String!){ publish(message: $message) { event } }';
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule.addTarget(new targets.AppSync(api, {
    graphQLOperation,
    variables: events.RuleTargetInput.fromObject({
      message: events.EventField.fromPath('$.detail'),
    }),
    fields: ['publish'],
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'GraphQLEndpointArn'] },
        AppSyncParameters: { GraphQLOperation: graphQLOperation },
        Id: 'Target0',
        InputTransformer: '',
        RoleArn: {
          'Fn::GetAtt': [
            'baseApiEventsRoleAC472BD7',
            'Arn',
          ],
        },
      },
    ],
  });
});
