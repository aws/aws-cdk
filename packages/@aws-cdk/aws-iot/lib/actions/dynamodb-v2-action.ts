import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for DynamoDB.
 */
export interface DynamoDBv2ActionProps {
  /**
   * The IAM role that allows access to the DynamoDB.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to write all or part of an MQTT message to an Amazon DynamoDB table.
 */
export class DynamoDBv2Action implements IAction {
  private readonly role?: iam.IRole;

  /**
   * @param table The DynamoDB table to be put items by this action
   * @param props Optional properties to not use default
   */
  constructor(private readonly table: dynamodb.ITable, props: DynamoDBv2ActionProps = {}) {
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.table.grant(role, 'dynamodb:PutItem');

    return {
      dynamoDBv2: {
        putItem: {
          tableName: this.table.tableName,
        },
        roleArn: role.roleArn,
      },
    };
  }
}
