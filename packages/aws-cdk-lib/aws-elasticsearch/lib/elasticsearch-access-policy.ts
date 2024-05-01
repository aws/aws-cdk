import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as cr from '../../custom-resources';

/**
 * Construction properties for ElasticsearchAccessPolicy
 */
export interface ElasticsearchAccessPolicyProps {
  /**
   * The Elasticsearch Domain name
   */
  readonly domainName: string;

  /**
   * The Elasticsearch Domain ARN
   */
  readonly domainArn: string;

  /**
   * The access policy statements for the Elasticsearch cluster
   */
  readonly accessPolicies: iam.PolicyStatement[];
}

/**
 * Creates LogGroup resource policies.
 */
export class ElasticsearchAccessPolicy extends cr.AwsCustomResource {

  private accessPolicyStatements: iam.PolicyStatement[] = [];

  constructor(scope: Construct, id: string, props: ElasticsearchAccessPolicyProps) {
    super(scope, id, {
      resourceType: 'Custom::ElasticsearchAccessPolicy',
      installLatestAwsSdk: false,
      onUpdate: {
        action: 'updateElasticsearchDomainConfig',
        service: 'ES',
        parameters: {
          DomainName: props.domainName,
          AccessPolicies: cdk.Lazy.string({
            produce: () => JSON.stringify(
              new iam.PolicyDocument({
                statements: this.accessPolicyStatements,
              }).toJSON(),
            ),
          }),
        },
        // this is needed to limit the response body, otherwise it exceeds the CFN 4k limit
        outputPaths: ['DomainConfig.ElasticsearchClusterConfig.AccessPolicies'],
        physicalResourceId: cr.PhysicalResourceId.of(`${props.domainName}AccessPolicy`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: [props.domainArn] }),
    });

    this.addAccessPolicies(...props.accessPolicies);
  }

  /**
   * Add policy statements to the domain access policy
   */
  public addAccessPolicies(...accessPolicyStatements: iam.PolicyStatement[]) {
    this.accessPolicyStatements.push(...accessPolicyStatements);
  }
}
