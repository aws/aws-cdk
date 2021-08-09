import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

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
