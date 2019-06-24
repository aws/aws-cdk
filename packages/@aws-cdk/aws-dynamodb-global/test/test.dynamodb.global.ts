import { expect, haveResource } from '@aws-cdk/assert';
import { Attribute, AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb';
import { Table } from '@aws-cdk/aws-dynamodb';
import { Stack } from '@aws-cdk/core';
import * as assert from 'assert';
import { Test } from 'nodeunit';
import {
  GlobalTable,
  GlobalTableProps
} from '../lib';

// tslint:disable:object-literal-key-quotes

// CDK parameters
const CONSTRUCT_NAME = 'aws-cdk-dynamodb-global';

// DynamoDB table parameters
const TABLE_NAME = 'GlobalTable';
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.STRING };

const STACK_PROPS: GlobalTableProps = {
    partitionKey: TABLE_PARTITION_KEY,
    tableName: TABLE_NAME,
    regions: [ 'us-east-1', 'us-east-2', 'us-west-2' ]
};

export = {
  'Default Global DynamoDB stack': {
    'global dynamo'(test: Test) {
      const stack = new Stack();
      new GlobalTable(stack, CONSTRUCT_NAME, STACK_PROPS);
      const topStack = stack.node.findChild(CONSTRUCT_NAME) as Stack;
      for ( const reg of STACK_PROPS.regions ) {
        const tableStack = topStack.node.findChild(CONSTRUCT_NAME + '-' + reg) as Stack;
        expect(tableStack).to(haveResource('AWS::DynamoDB::Table', {
          "KeySchema": [
              {
                "AttributeName": "hashKey",
                "KeyType": "HASH"
              }
            ],
            "AttributeDefinitions": [
              {
                "AttributeName": "hashKey",
                "AttributeType": "S"
              }
            ],
            "StreamSpecification": {
              "StreamViewType": "NEW_AND_OLD_IMAGES"
            },
            "TableName": "GlobalTable"
        }));
      }
      const customResourceStack = stack.node.findChild(CONSTRUCT_NAME + "-CustomResource") as Stack;
      expect(customResourceStack).to(haveResource('AWS::Lambda::Function', {
        Description: "Lambda to make DynamoDB a global table",
        Handler: "index.handler",
        Timeout: 300
      }));
      expect(customResourceStack).to(haveResource('AWS::CloudFormation::CustomResource', {
        Regions: STACK_PROPS.regions,
        ResourceType: "Custom::DynamoGlobalTableCoordinator",
        TableName: TABLE_NAME,
      }));
      test.done();
    },
  },
  'Enforce StreamSpecification': {
    'global dynamo should only allow NEW_AND_OLD_IMAGES'(test: Test) {
      const stack = new Stack();
      try {
        new GlobalTable(stack, CONSTRUCT_NAME, {
          tableName: TABLE_NAME,
          stream: StreamViewType.KEYS_ONLY,
          partitionKey: TABLE_PARTITION_KEY,
          regions: [ 'us-east-1', 'us-east-2', 'us-west-2' ]
        });
        // We are expecting the above line to throw a TypeError since
        // the streamSpecification is wrong.  Force a failure on this
        // line if we get there.
        expect(stack).to(haveResource('Fail::this::test::IfWeGetThisFar', {}));
      } catch ( TypeError ) {
        expect(stack);
      }
      test.done();
    },
  },
  'Check getting tables': {
    'global dynamo should only allow NEW_AND_OLD_IMAGES'(test: Test) {
      const stack = new Stack();
      const regTables = new GlobalTable(stack, CONSTRUCT_NAME, {
        tableName: TABLE_NAME,
        partitionKey: TABLE_PARTITION_KEY,
        regions: [ 'us-east-1', 'us-east-2', 'us-west-2' ]
      });
      assert(regTables.regionalTables.length === 3);
      for (const table of regTables.regionalTables) {
        assert(table instanceof Table);
      }
      test.done();
    },
  }
};
