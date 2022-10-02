import { AccountRootPrincipal, Effect, IPrincipal, PolicyDocument, PolicyStatement } from '@aws-cdk/aws-iam';
import { Aws, Lazy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPullThroughCacheRule, CfnRegistryPolicy } from './ecr.generated';

/**
 * Properties for pull through cache rule
 */
export interface PullThroughCacheRuleProps {
  /**
   * The Amazon ECR repository prefix associated with the pull through cache rule.
   */
  readonly ecrRepositoryPrefix: string;

  /**
   * The upstream registry URL associated with the pull through cache rule.
   */
  readonly upstreamRegistry: UpstreamRegistry;
}

/**
 * Available upstream URLs of the source registry.
 */
export enum UpstreamRegistry {
  /**
     * Upstream URL of ECR public.
     */
  ECR_PUBLIC = 'public.ecr.aws',
  /**
     * Upstream URL of Quay.
     */
  QUAY = 'quay.io',
}

/**
 * Define a ECR pull through cache rule. A pull through cache rule provides a way to cache images from an external public registry in your Amazon ECR private registry.
 */
export class PullThroughCacheRule extends Resource {

  private policyDocument: PolicyDocument;

  private ecrRepositoryPrefix: string;

  constructor(scope: Construct, id: string, props: PullThroughCacheRuleProps) {
    super(scope, id);

    this.ecrRepositoryPrefix = props.ecrRepositoryPrefix;
    new CfnPullThroughCacheRule(this, 'Resource', {
      ecrRepositoryPrefix: this.ecrRepositoryPrefix,
      upstreamRegistryUrl: props.upstreamRegistry,
    });

    this.policyDocument = new PolicyDocument({
      statements: [new PolicyStatement(
        {
          principals: [new AccountRootPrincipal()],
          effect: Effect.ALLOW,
          actions: [
            'ecr:CreateRepository',
            'ecr:BatchImportUpstreamImage',
          ],
          resources: [`arn:${Aws.PARTITION}:ecr:${Aws.REGION}:${Aws.ACCOUNT_ID}:repository/${this.ecrRepositoryPrefix}/*`],
        },
      )],
    });

    new CfnRegistryPolicy(this, 'Policy', {
      policyText: Lazy.any({ produce: () => this.policyDocument }),
    });
  }

  /**
   * Restricts access to certain repositories by creating a registry policy.
   * The principals that are given have to be specific users or root principals.
   *
   * @param principals - The principals that the registry policy is for.
   * @param repositories - The repositories that are allowed for the principal to be pulled.
   */
  public restrictAccess(principals: IPrincipal[], repositories: string[]) {
    this.policyDocument = new PolicyDocument({
      statements: [
        new PolicyStatement(
          {
            principals,
            effect: Effect.ALLOW,
            actions: [
              'ecr:CreateRepository',
              'ecr:BatchImportUpstreamImage',
            ],
            resources: repositories.map(repository => `arn:${Aws.PARTITION}:ecr:${Aws.REGION}:${Aws.ACCOUNT_ID}:repository/${this.ecrRepositoryPrefix}/${repository}`),
          },
        ),
      ],
    });
  }
}
