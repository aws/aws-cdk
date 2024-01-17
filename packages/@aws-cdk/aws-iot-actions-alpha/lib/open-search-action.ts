import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for Open Search.
 */
export interface OpenSearchActionProps extends CommonActionProps {
  /**
   * The unique identifier for the document you are storing.
   */
  readonly id: string;

  /**
   * The OpenSearch index where you want to store your data.
   */
  readonly index: string;

  /**
   * The type of document you are storing.
   */
  readonly type: string;
}

/**
 * The action to writes data to an Amazon OpenSearch Service domain.
 */
export class OpenSearchAction implements iot.IAction {
  constructor(private readonly domain: opensearch.Domain, private readonly props: OpenSearchActionProps) {
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.props.role ?? singletonActionRole(rule);

    // According to CloudFormation documentation, we only need 'es:ESHttpPut' permission
    // https://docs.aws.amazon.com/iot/latest/developerguide/opensearch-rule-action.html#opensearch-rule-action-requirements
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['es:ESHttpPut'],
      resources: [this.domain.domainArn, `${this.domain.domainArn}/*`],
    }));

    return {
      configuration: {
        openSearch: {
          endpoint: `https://${this.domain.domainEndpoint}`,
          id: this.props.id,
          index: this.props.index,
          type: this.props.type,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
