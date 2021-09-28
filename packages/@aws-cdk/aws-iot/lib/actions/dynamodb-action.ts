import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for DynamoDB.
 */
export interface DynamoDBActionProps {
  /**
   * The DynamoDB table.
   */
  readonly table: dynamodb.Table,
  /**
   * The value of the partition key.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly partitionKeyValue: string,
  /**
   * The value of the sort key.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   * @default None
   */
  readonly sortKeyValue?: string,
  /**
   * The name of the column where the payload is written.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   * @default 'payload'
   */
  readonly payloadField?: string,
  /**
   * The IAM role that allows access to the DynamoDB.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole,
}

/**
 * The action to write all or part of an MQTT message to an Amazon DynamoDB table.
 */
export class DynamoDBAction implements IAction {
  constructor(private readonly props: DynamoDBActionProps) {
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.props.role ?? singletonActionRole(rule);
    this.props.table.grant(role, 'dynamodb:PutItem');

    const { partitionKey, sortKey } = this.props.table.schema();

    return {
      dynamoDb: {
        tableName: this.props.table.tableName,
        hashKeyField: partitionKey.name,
        hashKeyType: convertToKeyType(partitionKey.type),
        hashKeyValue: this.props.partitionKeyValue,
        rangeKeyField: sortKey?.name,
        rangeKeyType: convertToKeyType(sortKey?.type),
        rangeKeyValue: this.props.sortKeyValue,
        payloadField: this.props.payloadField ?? 'payload',
        roleArn: role.roleArn,
      },
    };
  }
}

function convertToKeyType(attributeType?: dynamodb.AttributeType): string | undefined {
  if (!attributeType) {
    return;
  }

  switch (attributeType) {
    case dynamodb.AttributeType.STRING:
      return 'STRING';
    case dynamodb.AttributeType.NUMBER:
      return 'NUMBER';
    case dynamodb.AttributeType.BINARY:
      throw new Error('DynamoDB Action doesn\'t support binary attribute type.');
  }

}
