import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { LogGroup, QueryDefinition, QueryString } from '../lib';

describe('query definition', () => {
  test('create a query definition', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: '@timestamp, @message',
        sort: '@timestamp desc',
        limit: 20,
      }),
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
      queryString: new QueryString({
        fields: '@timestamp, @message',
        sort: '@timestamp desc',
        limit: 20,
      }),
      logGroupNames: [logGroup.logGroupName],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
      LogGroupNames: [{ Ref: 'MyLogGroup5C0DAD85' }],
    });
  });

  test('create a query definition using all add command methods', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'MyLogGroup');

    var queryString = new QueryString();
    queryString.addFields('@timestamp, @message');
    queryString.addParse('@message "[*] *" as loggingType, loggingMessage');
    queryString.addFilter('loggingType = "ERROR"');
    queryString.addSort('@timestamp desc');
    queryString.addLimit(20);
    queryString.addDisplay('loggingMessage');

    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: queryString,
      logGroupNames: [logGroup.logGroupName],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message | parse @message "[*] *" as loggingType, loggingMessage | filter loggingType = "ERROR" | sort @timestamp desc | limit 20 | display loggingMessage',
    });
  });

  test('create a query definition using partial add command methods', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'MyLogGroup');

    var queryString = new QueryString();
    queryString.addFields('@timestamp, @message');
    queryString.addSort('@timestamp desc');
    queryString.addLimit(20);

    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: queryString,
      logGroupNames: [logGroup.logGroupName],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message | sort @timestamp desc | limit 20',
    });
  });
});
