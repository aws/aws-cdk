import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Annotations, Template } from '../../assertions';
import { CfnParameter, Lazy, Stack } from '../../core';
import type { QueryParameter } from '../lib';
import { LogGroup, QueryDefinition, QueryLanguage, QueryString } from '../lib';

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

  describe('QueryString.fromString', () => {
    test('returns the text as is', () => {
      const query = 'SELECT `@message` FROM `logGroups(logGroupIdentifier: [\'/my/logs\'])` LIMIT 10';
      expect(QueryString.fromString(query).toString()).toEqual(query);
    });

    test('is used as the query string of a query definition', () => {
      const stack = new Stack();
      new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: QueryString.fromString('fields @timestamp | filter status = {{status}}'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        QueryString: 'fields @timestamp | filter status = {{status}}',
      });
    });

    test('supports tokens', () => {
      const stack = new Stack();
      const query = new CfnParameter(stack, 'Query');
      new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: QueryString.fromString(query.valueAsString),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        QueryString: { Ref: 'Query' },
      });
    });
  });

  describe('query language', () => {
    test.each([
      [QueryLanguage.CWLI, 'CWLI', 'fields @message'],
      [QueryLanguage.SQL, 'SQL', 'SELECT `@message` FROM `logGroups(logGroupIdentifier: [\'/my/logs\'])`'],
      [QueryLanguage.PPL, 'PPL', 'fields `@message` | head 10'],
    ])('renders %s', (queryLanguage, expected, query) => {
      const stack = new Stack();
      new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: QueryString.fromString(query),
        queryLanguage,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        QueryLanguage: expected,
        QueryString: query,
      });
    });

    test('is omitted when not set', () => {
      const stack = new Stack();
      new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: new QueryString({ fields: ['@message'] }),
      });

      const properties = Object.values(Template.fromStack(stack).findResources('AWS::Logs::QueryDefinition'))[0].Properties;
      expect(properties).not.toHaveProperty('QueryLanguage');
      expect(properties).not.toHaveProperty('Parameters');
      expect(properties.LogGroupNames).toEqual([]);
    });
  });

  describe('parameters', () => {
    function newQueryDefinition(stack: Stack, parameters: QueryParameter[], queryLanguage?: QueryLanguage) {
      return new QueryDefinition(stack, 'QueryDefinition', {
        queryDefinitionName: 'MyQuery',
        queryString: new QueryString({
          fields: ['@timestamp', '@message'],
          filterStatements: ['status = {{status}}'],
        }),
        queryLanguage,
        parameters,
      });
    }

    test('renders parameters', () => {
      const stack = new Stack();
      newQueryDefinition(stack, [
        { name: 'status', defaultValue: '500', description: 'HTTP status code' },
        { name: '_requestId2' },
      ]);

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        QueryString: 'fields @timestamp, @message\n| filter status = {{status}}',
        Parameters: [
          { Name: 'status', DefaultValue: '500', Description: 'HTTP status code' },
          { Name: '_requestId2' },
        ],
      });
    });

    test('allows parameters with CWLI', () => {
      const stack = new Stack();
      newQueryDefinition(stack, [{ name: 'status' }], QueryLanguage.CWLI);

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        QueryLanguage: 'CWLI',
        Parameters: [{ Name: 'status' }],
      });
    });

    test.each([QueryLanguage.SQL, QueryLanguage.PPL])('fails for parameters with %s', (queryLanguage) => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name: 'status' }], queryLanguage))
        .toThrow(`query parameters are only supported for Logs Insights QL queries, got queryLanguage "${queryLanguage}"; remove parameters or use QueryLanguage.CWLI`);
    });

    test('allows an empty parameter list with SQL', () => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [], QueryLanguage.SQL)).not.toThrow();
    });

    test.each(['1status', 'status-code', 'status code', '', 'a'.repeat(129)])('fails for parameter name %p', (name) => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name }]))
        .toThrow(`invalid query parameter name ${JSON.stringify(name)}: it must start with a letter or underscore`);
    });

    test('accepts a parameter name of 128 characters', () => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name: 'a'.repeat(128) }])).not.toThrow();
    });

    test('fails for duplicate parameter names', () => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name: 'status' }, { name: 'status' }]))
        .toThrow('query parameter name "status" is used more than once');
    });

    test('fails for more than 20 parameters', () => {
      const stack = new Stack();
      const parameters = Array.from({ length: 21 }, (_, i) => ({ name: `p${i}` }));
      expect(() => newQueryDefinition(stack, parameters))
        .toThrow('a query definition supports at most 20 parameters, got 21');
    });

    test('fails for a default value longer than 1024 characters', () => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name: 'status', defaultValue: 'a'.repeat(1025) }]))
        .toThrow('the default value of query parameter "status" must be at most 1024 characters long, got 1025');
    });

    test('fails for a description longer than 512 characters', () => {
      const stack = new Stack();
      expect(() => newQueryDefinition(stack, [{ name: 'status', description: 'a'.repeat(513) }]))
        .toThrow('the description of query parameter "status" must be at most 512 characters long, got 513');
    });

    test('passes an unresolved parameter list through', () => {
      const stack = new Stack();
      const parameters = Lazy.any({ produce: () => [{ name: 'status', defaultValue: '500' }] }) as unknown as QueryParameter[];
      newQueryDefinition(stack, parameters, QueryLanguage.SQL);

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        Parameters: [{ Name: 'status', DefaultValue: '500' }],
      });
    });

    test('skips validation for tokens', () => {
      const stack = new Stack();
      const name = Lazy.string({ produce: () => 'status' });
      const value = new CfnParameter(stack, 'Value');
      newQueryDefinition(stack, [
        { name, defaultValue: value.valueAsString, description: value.valueAsString },
        { name, defaultValue: `${'a'.repeat(1025)}${value.valueAsString}` },
      ]);

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::QueryDefinition', {
        Parameters: [
          { Name: 'status', DefaultValue: { Ref: 'Value' }, Description: { Ref: 'Value' } },
          { Name: 'status', DefaultValue: { 'Fn::Join': ['', ['a'.repeat(1025), { Ref: 'Value' }]] } },
        ],
      });
    });
  });
});
