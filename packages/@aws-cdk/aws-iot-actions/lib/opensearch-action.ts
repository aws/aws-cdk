import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as oss from '@aws-cdk/aws-opensearchservice';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for Open Search
 */
export interface OpenSearchActionProps extends CommonActionProps {}

/**
 * The action to write data to Amazon OpenSearch
 */
export class OpenSearchAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly domain: oss.Domain;
  private readonly id: string;
  private readonly index: string;
  private readonly type: string;

  /**
   * @param endpoint Your OpenSearch domain.
   * @param id The unique identifier for the document you are storing.
   * @param index The OpenSearch index where you want to store your data.
   * @param type The type of document you are storing.
   * @param props Optional properties to not use default
   */
  constructor(
    domain: oss.Domain,
    id: string,
    index: string,
    type: string,
    props: OpenSearchActionProps = {},
  ) {
    this.domain = domain;
    this.id = id;
    this.index = index;
    this.type = type;
    this.role = props.role;
  }

  /**
   * @internal
   */
  _bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(topicRule);
    role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['es:ESHttpPut'],
        resources: [this.domain.domainArn],
      }),
    );

    return {
      configuration: {
        openSearch: {
          roleArn: role.roleArn,
          endpoint: this.domain.domainEndpoint,
          id: this.id,
          index: this.index,
          type: this.type,
        },
      },
    };
  }
}
