import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for the dynamodb table.
 */
export interface DynamoDBv2PutItemActionProps extends CommonActionProps {
}

/**
 * The action to put the record from an MQTT message to the DynamoDB table.
 */
export class DynamoDBv2PutItemAction implements iot.IAction {
  private readonly role?: iam.IRole;

  /**
   * @param table the DynamoDB table in which to put the items.
   * @param props Optional properties to not use default
   */
  constructor(private readonly table: dynamodb.ITable, props: DynamoDBv2PutItemActionProps = {}) {
    this.role = props.role;
  }

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      resources: [this.table.tableArn],
    }));
    return {
      configuration: {
        dynamoDBv2: {
          putItem: {
            tableName: this.table.tableName,
          },
          roleArn: role.roleArn,
        },
      },
    };
  }
}
