import '@aws-cdk/assert/jest';
import { MappingTemplate, PrimaryKey, Values } from '../lib';

function joined(str: string): string {
  return str.replace(/\s+/g, '');
}

describe('DynamoDB Mapping Templates', () => {
  test('PutItem projecting all', () => {
    const template = MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('id').is('id'),
      Values.projecting(),
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
    const template = MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('id').is('id'),
      Values.attribute('val').is('ctx.args.val'),
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
    const template = MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('id').is('id'),
      Values.projecting().attribute('val').is('ctx.args.val'),
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