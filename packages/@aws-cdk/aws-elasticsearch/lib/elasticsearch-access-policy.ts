import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
  constructor(scope: Construct, id: string, props: ElasticsearchAccessPolicyProps) {
    const policyDocument = new iam.PolicyDocument({
      statements: props.accessPolicies,
    });

    super(scope, id, {
      resourceType: 'Custom::ElasticsearchAccessPolicy',
      onUpdate: {
        action: 'updateElasticsearchDomainConfig',
        service: 'ES',
        parameters: {
          DomainName: props.domainName,
          AccessPolicies: JSON.stringify(policyDocument.toJSON()),
        },
        // this is needed to limit the response body, otherwise it exceeds the CFN 4k limit
        outputPath: 'DomainConfig.ElasticsearchClusterConfig.AccessPolicies',
        physicalResourceId: cr.PhysicalResourceId.of(`${props.domainName}AccessPolicy`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: [props.domainArn] }),
    });
  }
}
