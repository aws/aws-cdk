import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Construction properties for OpenSearchAccessPolicy
 */
export interface OpenSearchAccessPolicyProps {
  /**
   * The OpenSearch Domain name
   */
  readonly domainName: string;

  /**
   * The OpenSearch Domain ARN
   */
  readonly domainArn: string;

  /**
   * The access policy statements for the OpenSearch cluster
   */
  readonly accessPolicies: iam.PolicyStatement[];
}

/**
 * Creates LogGroup resource policies.
 */
export class OpenSearchAccessPolicy extends cr.AwsCustomResource {
  constructor(scope: Construct, id: string, props: OpenSearchAccessPolicyProps) {
    const policyDocument = new iam.PolicyDocument({
      statements: props.accessPolicies,
    });

    super(scope, id, {
      resourceType: 'Custom::OpenSearchAccessPolicy',
      onUpdate: {
        action: 'updateDomainConfig',
        service: 'OpenSearch',
        parameters: {
          DomainName: props.domainName,
          AccessPolicies: JSON.stringify(policyDocument.toJSON()),
        },
        // this is needed to limit the response body, otherwise it exceeds the CFN 4k limit
        outputPaths: ['DomainConfig.AccessPolicies'],
        physicalResourceId: cr.PhysicalResourceId.of(`${props.domainName}AccessPolicy`),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({ actions: ['es:UpdateDomainConfig'], resources: [props.domainArn] })]),
    });
  }
}
