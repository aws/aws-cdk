import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'api', {
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.CODE,
  });
});

describe('testing addType for schema definition mode `code`', () => {
  test('check scalar type id with all options', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.id,
        lid: t.list_id,
        rid: t.required_id,
        rlid: t.required_list_id,
        rlrid: t.required_list_required_id,
        dupid: t.dup_id,
      },
    });
    const out = 'type Test {\n  id: ID\n  lid: [ID]\n  rid: ID!\n  rlid: [ID]!\n  rlrid: [ID!]!\n  dupid: [ID!]!\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

});

describe('testing all GraphQL Types', () => {
  test('scalar type id', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.id,
      },
    });
    const out = 'type Test {\n  id: ID\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type string', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.string,
      },
    });
    const out = 'type Test {\n  id: String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type int', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.int,
      },
    });
    const out = 'type Test {\n  id: Int\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type float', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.float,
      },
    });
    const out = 'type Test {\n  id: Float\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type boolean', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.boolean,
      },
    });
    const out = 'type Test {\n  id: Boolean\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSDate', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsDate,
      },
    });
    const out = 'type Test {\n  id: AWSDate\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSTime', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsTime,
      },
    });
    const out = 'type Test {\n  id: AWSTime\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSDateTime', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsDateTime,
      },
    });
    const out = 'type Test {\n  id: AWSDateTime\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSTimestamp', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsTimestamp,
      },
    });
    const out = 'type Test {\n  id: AWSTimestamp\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSEmail', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsEmail,
      },
    });
    const out = 'type Test {\n  id: AWSEmail\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSJSON', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsJson,
      },
    });
    const out = 'type Test {\n  id: AWSJSON\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });


  test('scalar type AWSUrl', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsUrl,
      },
    });
    const out = 'type Test {\n  id: AWSURL\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSPhone', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsPhone,
      },
    });
    const out = 'type Test {\n  id: AWSPhone\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('scalar type AWSIPAddress', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.awsIpAddress,
      },
    });
    const out = 'type Test {\n  id: AWSIPAddress\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });
});