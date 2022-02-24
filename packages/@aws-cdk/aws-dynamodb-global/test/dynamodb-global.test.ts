import { Template } from '@aws-cdk/assertions';
import { Attribute, AttributeType, StreamViewType, Table } from '@aws-cdk/aws-dynamodb';
import { describeDeprecated, testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { GlobalTable, GlobalTableProps } from '../lib';

/* eslint-disable quote-props */

// CDK parameters
const CONSTRUCT_NAME = 'aws-cdk-dynamodb-global';

// DynamoDB table parameters
const TABLE_NAME = 'GlobalTable';
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.STRING };

const STACK_PROPS: GlobalTableProps = {
  partitionKey: TABLE_PARTITION_KEY,
  tableName: TABLE_NAME,
  regions: ['us-east-1', 'us-east-2', 'us-west-2'],
};

describeDeprecated('Default Global DynamoDB stack', () => {
  test('global dynamo', () => {
    const stack = new Stack();
    new GlobalTable(stack, CONSTRUCT_NAME, STACK_PROPS);
    const topStack = stack.node.findChild(CONSTRUCT_NAME) as Stack;
    for ( const reg of STACK_PROPS.regions ) {
      const tableStack = topStack.node.findChild(CONSTRUCT_NAME + '-' + reg) as Stack;
      Template.fromStack(tableStack).hasResourceProperties('AWS::DynamoDB::Table', {
        'KeySchema': [
          {
            'AttributeName': 'hashKey',
            'KeyType': 'HASH',
          },
        ],
        'AttributeDefinitions': [
          {
            'AttributeName': 'hashKey',
            'AttributeType': 'S',
          },
        ],
        'StreamSpecification': {
          'StreamViewType': 'NEW_AND_OLD_IMAGES',
        },
        'TableName': 'GlobalTable',
      });
    }
    const customResourceStack = stack.node.findChild(CONSTRUCT_NAME + '-CustomResource') as Stack;
    Template.fromStack(customResourceStack).hasResourceProperties('AWS::Lambda::Function', {
      Description: 'Lambda to make DynamoDB a global table',
      Handler: 'index.handler',
      Timeout: 300,
    });
    Template.fromStack(customResourceStack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
      Regions: STACK_PROPS.regions,
      ResourceType: 'Custom::DynamoGlobalTableCoordinator',
      TableName: TABLE_NAME,
    });
  });
});

testDeprecated('GlobalTable generated stacks inherit their account from the parent stack', () => {
  const app = new App({ context: { '@aws-cdk/core:stackRelativeExports': true } });
  const stack = new Stack(app, 'GlobalTableStack', { env: { account: '123456789012', region: 'us-east-1' } });

  const globalTable = new GlobalTable(stack, CONSTRUCT_NAME, {
    tableName: TABLE_NAME,
    partitionKey: TABLE_PARTITION_KEY,
    regions: ['us-east-1', 'us-west-2'],
    stream: StreamViewType.NEW_AND_OLD_IMAGES,
  });

  new CfnOutput(stack, 'DynamoDbOutput', {
    // this works, because both `stack` and `regionTables[0]` stack are in the same account & region
    value: globalTable.regionalTables[0].tableStreamArn!,
  });

  Template.fromStack(stack).templateMatches({
    'Outputs': {
      'DynamoDbOutput': {
        'Value': {
          'Fn::ImportValue': 'GlobalTableStackawscdkdynamodbglobalawscdkdynamodbglobaluseast19C1C8A14:ExportsOutputFnGetAttawscdkdynamodbglobalGlobalTableuseast1FC03DD69StreamArn9CE585ED',
        },
      },
    },
  });
});

describeDeprecated('Enforce StreamSpecification', () => {
  test('global dynamo should only allow NEW_AND_OLD_IMAGES', () => {
    const stack = new Stack();

    expect(() => {
      new GlobalTable(stack, CONSTRUCT_NAME, {
        tableName: TABLE_NAME,
        stream: StreamViewType.KEYS_ONLY,
        partitionKey: TABLE_PARTITION_KEY,
        regions: ['us-east-1', 'us-east-2', 'us-west-2'],
      });
    }).toThrow(/dynamoProps.stream MUST be set to dynamodb.StreamViewType.NEW_AND_OLD_IMAGES/);
  });
});

describeDeprecated('Check getting tables', () => {
  test('global dynamo should only allow NEW_AND_OLD_IMAGES', () => {
    const stack = new Stack();
    const regTables = new GlobalTable(stack, CONSTRUCT_NAME, {
      tableName: TABLE_NAME,
      partitionKey: TABLE_PARTITION_KEY,
      regions: ['us-east-1', 'us-east-2', 'us-west-2'],
    });
    expect(regTables.regionalTables.length).toEqual(3);
    for (const table of regTables.regionalTables) {
      expect(table).toBeInstanceOf(Table);
    }
  });
});
