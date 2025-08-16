import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Annotations, Template } from '../../assertions';
import { Stack } from '../../core';
import { LogGroup, QueryDefinition, QueryString } from '../lib';

describe('query definition', () => {
  test('create a query definition', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        sort: '@timestamp desc',
        limit: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| sort @timestamp desc\n| limit 20',
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
        fields: ['@timestamp', '@message'],
        sort: '@timestamp desc',
        limit: 20,
      }),
      logGroups: [logGroup],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| sort @timestamp desc\n| limit 20',
      LogGroupNames: [{ Ref: 'MyLogGroup5C0DAD85' }],
    });
  });

  testDeprecated('create a query definition with all commands', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const logGroup = new LogGroup(stack, 'MyLogGroup');

    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parse: '@message "[*] *" as loggingType, loggingMessage',
        filter: 'loggingType = "ERROR"',
        stats: 'count(loggingMessage) as loggingErrors',
        sort: '@timestamp desc',
        limit: 20,
        display: 'loggingMessage',
      }),
      logGroups: [logGroup],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| filter loggingType = "ERROR"\n| stats count(loggingMessage) as loggingErrors\n| sort @timestamp desc\n| limit 20\n| display loggingMessage',
    });
  });

  test('create a query definition with multiple statements for supported commands', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parseStatements: [
          '@message "[*] *" as loggingType, loggingMessage',
          '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
        ],
        filterStatements: [
          'loggingType = "ERROR"',
          'loggingMessage = "A very strange error occurred!"',
        ],
        statsStatements: [
          'count(loggingMessage) as loggingErrors',
          'count(differentLoggingMessage) as differentLoggingErrors',
        ],
        sort: '@timestamp desc',
        limit: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| parse @message "<*>: *" as differentLoggingType, differentLoggingMessage\n| filter loggingType = "ERROR"\n| filter loggingMessage = "A very strange error occurred!"\n| stats count(loggingMessage) as loggingErrors\n| stats count(differentLoggingMessage) as differentLoggingErrors\n| sort @timestamp desc\n| limit 20',
    });
  });

  test('create a query definition with more than 2 statements throws an error', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: new QueryString({
          fields: ['@timestamp', '@message'],
          parseStatements: [
            '@message "[*] *" as loggingType, loggingMessage',
            '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
          ],
          filterStatements: [
            'loggingType = "ERROR"',
            'loggingMessage = "A very strange error occurred!"',
          ],
          statsStatements: [
            'count(loggingMessage) as loggingErrors',
            'count(loggingMessage) as loggingErrors',
            'count(differentLoggingMessage) as differentLoggingErrors',
          ],
          sort: '@timestamp desc',
          limit: 20,
        }),
      });
    }).toThrow('CloudWatch Logs Insights only supports up to two stats commands in a single query, received 3.');
  });

  test('providing stats and statsStatements displays a warning', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parseStatements: [
          '@message "[*] *" as loggingType, loggingMessage',
          '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
        ],
        filterStatements: [
          'loggingType = "ERROR"',
          'loggingMessage = "A very strange error occurred!"',
        ],
        stats: 'count(loggingMessage) as loggingErrors',
        statsStatements: [
          'count(loggingMessage) as loggingErrors',
          'count(differentLoggingMessage) as differentLoggingErrors',
        ],
        sort: '@timestamp desc',
        limit: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| parse @message "<*>: *" as differentLoggingType, differentLoggingMessage\n| filter loggingType = "ERROR"\n| filter loggingMessage = "A very strange error occurred!"\n| stats count(loggingMessage) as loggingErrors\n| stats count(differentLoggingMessage) as differentLoggingErrors\n| sort @timestamp desc\n| limit 20',
    });
    Annotations.fromStack(stack).hasWarning('/Default/QueryDefinition', 'Both stats and statsStatements properties are provided. The stats property is deprecated and will be ignored in favor of statsStatements. [ack: QueryDefinitionStatsWarning]');
  });

  testDeprecated('create a query with both single and multi statement properties for filtering and parsing', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new QueryDefinition(stack, 'QueryDefinition', {
      queryDefinitionName: 'MyQuery',
      queryString: new QueryString({
        fields: ['@timestamp', '@message'],
        parse: '@message "[*] *" as loggingType, loggingMessage',
        parseStatements: [
          '@message "[*] *" as loggingType, loggingMessage',
          '@message "<*>: *" as differentLoggingType, differentLoggingMessage',
        ],
        filter: 'loggingType = "ERROR"',
        filterStatements: [
          'loggingType = "ERROR"',
          'loggingMessage = "A very strange error occurred!"',
        ],
        sort: '@timestamp desc',
        limit: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
      Name: 'MyQuery',
      QueryString: 'fields @timestamp, @message\n| parse @message "[*] *" as loggingType, loggingMessage\n| parse @message "<*>: *" as differentLoggingType, differentLoggingMessage\n| filter loggingType = "ERROR"\n| filter loggingMessage = "A very strange error occurred!"\n| sort @timestamp desc\n| limit 20',
    });
  });
});
