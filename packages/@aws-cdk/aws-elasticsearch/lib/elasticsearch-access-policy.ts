import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

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

  /**
   * The key used for cluster encryption at rest.
   * Needed in order to grant kms permissions on this key for the operation to succeed.
   *
   * @default - no key.
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * Creates LogGroup resource policies.
 */
export class ElasticsearchAccessPolicy extends cr.AwsCustomResource {
  constructor(scope: cdk.Construct, id: string, props: ElasticsearchAccessPolicyProps) {
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

    // https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/encryption-at-rest.html
    if (props.kmsKey) {
      this.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['kms:List*', 'kms:Describe*', 'kms:CreateGrant'],
        resources: [props.kmsKey.keyArn],
        effect: iam.Effect.ALLOW,
      }));
    }
  }
}
