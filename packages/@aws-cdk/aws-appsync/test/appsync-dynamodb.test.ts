import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as db from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import { KeyCondition } from '../lib';

function joined(str: string): string {
  return str.replace(/\s+/g, '');
}

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });
});

describe('DynamoDb Data Source configuration', () => {
  // GIVEN
  let table: db.Table;
  beforeEach(() => {
    table = new db.Table(stack, 'table', {
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });
  });

  test('default configuration produces name `DynamoDbCDKDataSource`', () => {
    // WHEN
    api.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    api.addDynamoDbDataSource('ds', table, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    api.addDynamoDbDataSource('ds', table, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple dynamo db data sources with no configuration', () => {
    // THEN
    expect(() => {
      api.addDynamoDbDataSource('ds', table);
      api.addDynamoDbDataSource('ds', table);
    }).toThrow("There is already a Construct with name 'ds' in GraphqlApi [baseApi]");
  });
});

describe('DynamoDB Mapping Templates', () => {
  test('read consistency option for dynamoDbScanTable should render correctly', () => {
    const template = appsync.MappingTemplate.dynamoDbScanTable(true);
    const rendered = joined(template.renderTemplate());
    expect(rendered).toStrictEqual('{\"version\":\"2017-02-28\",\"operation\":\"Scan\",\"consistentRead\":true}');
  });

  test('read consistency option for dynamoDbGetItem should render correctly', () => {
    const template = appsync.MappingTemplate.dynamoDbGetItem('id', 'id', true);
    const rendered = joined(template.renderTemplate());
    expect(rendered).toStrictEqual('{\"version\":\"2017-02-28\",\"operation\":\"GetItem\",\"consistentRead\":true,\"key\":{\"id\":$util.dynamodb.toDynamoDBJson($ctx.args.id)}}');
  });

  test('read consistency option for dynamoDbQuery should render correctly', () => {
    const template = appsync.MappingTemplate.dynamoDbQuery(KeyCondition.eq('order', 'order'), 'orderIndex', true);
    const rendered = joined(template.renderTemplate());
    expect(rendered).toStrictEqual('{\"version\":\"2017-02-28\",\"operation\":\"Query\",\"consistentRead\":true,\"index\":\"orderIndex\",\"query\":{\"expression\":\"#order=:order\",\"expressionNames\":{\"#order\":\"order\"},\"expressionValues\":{\":order\":$util.dynamodb.toDynamoDBJson($ctx.args.order)}}}');
  });

  test('PutItem projecting all', () => {
    const template = appsync.MappingTemplate.dynamoDbPutItem(
      appsync.PrimaryKey.partition('id').is('id'),
      appsync.Values.projecting(),
    );

    const rendered = joined(template.renderTemplate());

    expect(rendered).toStrictEqual(joined(`
      #set($input = $ctx.args)
      {
        "version" : "2017-02-28",
        "operation" : "PutItem",
        "key" : {
          "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($input)
      }`),
    );
  });

  test('PutItem with invididual attributes', () => {
    const template = appsync.MappingTemplate.dynamoDbPutItem(
      appsync.PrimaryKey.partition('id').is('id'),
      appsync.Values.attribute('val').is('ctx.args.val'),
    );

    const rendered = joined(template.renderTemplate());

    expect(rendered).toStrictEqual(joined(`
      #set($input = {})
      $util.qr($input.put("val", ctx.args.val))
      {
        "version" : "2017-02-28",
        "operation" : "PutItem",
        "key" : {
          "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($input)
      }`),
    );
  });

  test('PutItem with additional attributes', () => {
    const template = appsync.MappingTemplate.dynamoDbPutItem(
      appsync.PrimaryKey.partition('id').is('id'),
      appsync.Values.projecting().attribute('val').is('ctx.args.val'),
    );

    const rendered = joined(template.renderTemplate());

    expect(rendered).toStrictEqual(joined(`
      #set($input = $ctx.args)
      $util.qr($input.put("val", ctx.args.val))
      {
        "version" : "2017-02-28",
        "operation" : "PutItem",
        "key" : {
          "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($input)
      }`),
    );
  });
});

describe('adding DynamoDb data source from imported api', () => {
  // GIVEN
  let table: db.Table;
  beforeEach(() => {
    table = new db.Table(stack, 'table', {
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });
  });

  test('imported api can add DynamoDbDataSource from id', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add DynamoDbDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlApiArn: api.arn,
    });
    importedApi.addDynamoDbDataSource('ds', table);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_DYNAMODB',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

});