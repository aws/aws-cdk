import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { LogGroup, QueryDefinition } from '../lib';

describe('query definition', () => {
  test('create a query definition', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
    });
  });

  test('create a query definition against certain log groups', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'MyLogGroup');

    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
      logGroupNames: [logGroup.logGroupName],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
      LogGroupNames: [{ Ref: 'MyLogGroup5C0DAD85' }],
    });
  });
});