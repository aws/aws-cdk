import type { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import type { IArrayBox } from '../../core/lib/helpers-internal';
import { Box } from '../../core/lib/helpers-internal';
import { noBoxStackTraces } from '../../core/lib/no-box-stack-traces';
import * as cr from '../../custom-resources';

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

  /**
   * Flag to control verbosity of OpenSearch policy custom resource result
   * If verbose output is actively disabled it will only output specific fields
   * This is can be used to limit the response body of the custom resource, in cases it exceeds the CFN 4k limit
   * @default true
   */
  readonly verboseOutput?: boolean;
}

/**
 * Creates LogGroup resource policies.
 */
@noBoxStackTraces
export class OpenSearchAccessPolicy extends cr.AwsCustomResource {
  private readonly accessPolicyStatements: IArrayBox<iam.PolicyStatement>;

  constructor(scope: Construct, id: string, props: OpenSearchAccessPolicyProps) {
    const accessPolicyStatements: IArrayBox<iam.PolicyStatement> = Box.fromArray();
    super(scope, id, {
      resourceType: 'Custom::OpenSearchAccessPolicy',
      installLatestAwsSdk: false,
      onUpdate: {
        action: 'updateDomainConfig',
        service: 'OpenSearch',
        parameters: {
          DomainName: props.domainName,
          AccessPolicies: cdk.Token.asString(
            Box.combine({ stmts: accessPolicyStatements }, ({ stmts }) => JSON.stringify(
              new iam.PolicyDocument({
                statements: [...stmts],
              }).toJSON(),
            )),
          ),
        },
        // this is needed to limit the response body, otherwise it exceeds the CFN 4k limit
        // If verbose output is actively disabled it will only output specific fields
        outputPaths: (props.verboseOutput === undefined || props.verboseOutput) ? ['DomainConfig.AccessPolicies'] : ['DomainConfig.AccessPolicies.Status.State', 'DomainConfig.AccessPolicies.Status.UpdateVersion'],
        physicalResourceId: cr.PhysicalResourceId.of(`${props.domainName}AccessPolicy`),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({ actions: ['es:UpdateDomainConfig'], resources: [props.domainArn] })]),
    });

    this.accessPolicyStatements = accessPolicyStatements;
    this.addAccessPolicies(...props.accessPolicies);
  }

  /**
   * Add policy statements to the domain access policy
   */
  public addAccessPolicies(...accessPolicyStatements: iam.PolicyStatement[]) {
    for (const stmt of accessPolicyStatements) {
      this.accessPolicyStatements.push(stmt);
    }
  }
}
