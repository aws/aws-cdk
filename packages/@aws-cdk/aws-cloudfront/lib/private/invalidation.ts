import { IResource, Resource, Names, Lazy } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { Distribution } from '../distribution';
import { CloudFrontWebDistribution } from '../web-distribution';

/**
 * Represents a Cloudfront Invalidation
 */
 export interface IInvalidation extends IResource {
  /**
   * Id of the CloudFront Distribution to associate
   * @attribute
   */
  readonly distributionId:string;

  /**
   * A list of the paths in the distribution to invalidate
   * @attribute
   */
  readonly invalidationPaths:string[];
}

/**
 * Properties for creating an Invalidation
 */
export interface InvalidationProps {
  /**
   * Id of the CloudFront Distribution to associate
   */
  readonly distributionId: string;

  /**
   * A list of the paths in the distribution to invalidate
   * @default - invalidate all paths: ['/*']
   */
  readonly invalidationPaths?: string[];

  /**
   * A name to identify the invalidation.
   * @default - generated from the `id`
   */
  readonly invalidationName?: string;
}

/**
 * A CloudFront Invalidation configuration
 *
 * @resource Aws::CloudFormation::CustomResource
 */
export class Invalidation extends Resource implements IInvalidation {

  private resource:AwsCustomResource;

  static fromDistribution(distribution: Distribution, invalidationPaths?: string[]): Invalidation {
      const invalidation = new Invalidation(distribution.distributionId, invalidationPaths);
      invalidation.resource.node.addDependency(distribution);
      return invalidation;
  }

  static fromCloudFrontWebDistribution(webDistribution: CloudFrontWebDistribution, invalidationPaths?: string[]): Invalidation {
    const invalidation = new Invalidation(webDistribution.distributionId, invalidationPaths);
    invalidation.resource.node.addDependency(webDistribution);
    return invalidation;
  }

  constructor(
      public readonly distributionId: string,
      public readonly invalidationPaths: string[] = ['/*']
  ) {
    super(scope, id, {
      physicalName: props.invalidationName || Lazy.string({ produce: () => this.node.uniqueId }),
    });
    this.resource = new AwsCustomResource(this, `InvalidationResource${distributionId}`, {
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      installLatestAwsSdk: true,
      resourceType: 'Custom::CloudFrontInvalidation',
      onUpdate: {
        service: 'CloudFront',
        action: 'createInvalidation',
        physicalResourceId: PhysicalResourceId.fromResponse('Invalidation.Id'),
        parameters: {
          DistributionId: distributionId,
          InvalidationBatch: {
            CallerReference: this.generateName(),
            Paths: {
              Quantity: invalidationPaths.length,
              Items: invalidationPaths,
            },
          },
        },
      },
    });
  }

  private generateName(): string {
    const name = Names.uniqueId(this);
    if (name.length > 20) {
      return name.substring(0, 20);
    }
    return name;
  }
}
