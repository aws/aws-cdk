/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as oss from 'aws-cdk-lib/aws-opensearchserverless';
import { Construct } from 'constructs';

/**
 * Configuration for standby replicas in a vector collection.
 */
export enum VectorCollectionStandbyReplicas {
  /**
   * Enable standby replicas for high availability
   */
  ENABLED = 'ENABLED',

  /**
   * Disable standby replicas to reduce costs
   */
  DISABLED = 'DISABLED',
}

/**
 * The type of collection.
 */
export enum VectorCollectionType {
  /**
   * Search – Full-text search that powers applications in your internal networks (content management systems, legal documents) and internet-facing applications,
   * such as ecommerce website search and content search.
   */
  SEARCH = 'SEARCH',

  /**
   * Time series – The log analytics segment that focuses on analyzing large volumes of semi-structured,
   * machine-generated data in real-time for operational, security, user behavior, and business insights.
   */
  TIMESERIES = 'TIMESERIES',

  /**
   * Vector search – Semantic search on vector embeddings that simplifies vector data management and powers machine learning (ML) augmented search experiences and generative AI applications,
   * such as chatbots, personal assistants, and fraud detection.
   */
  VECTORSEARCH = 'VECTORSEARCH'
}

/**
 * Attributes for importing an existing vector collection.
 */
export interface VectorCollectionAttributes {
  /**
   * The name of the collection
   */
  readonly collectionName: string;

  /**
   * The ID of the collection
   */
  readonly collectionId: string;

  /**
   * The ARN of the collection
   */
  readonly collectionArn: string;

  /**
   * The standby replicas configuration
   */
  readonly standbyReplicas: VectorCollectionStandbyReplicas;

  /**
   * The type of collection
   */
  readonly collectionType: VectorCollectionType;
}

/**
 * Properties for configuring the vector collection.
 */
export interface VectorCollectionProps {
  /**
   * The name of the collection. Must be between 3-32 characters long and contain only
   * lowercase letters, numbers, and hyphens.
   *
   * @default - A CDK generated name will be used
   */
  readonly collectionName?: string;

  /**
   * Description for the collection
   */
  readonly description?: string;

  /**
   * Indicates whether to use standby replicas for the collection.
   *
   * @default VectorCollectionStandbyReplicas.ENABLED
   */
  readonly standbyReplicas?: VectorCollectionStandbyReplicas;

  /**
   * A user defined IAM policy that allows API access to the collection.
   */
  readonly customAossPolicy?: iam.ManagedPolicy;

  /**
   * Type of vector collection
   *
   * @default - VECTORSEARCH
   */
  readonly collectionType?: VectorCollectionType;

  /**
   * A list of tags associated with the inference profile.
   * */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Interface representing a vector collection
 */
export interface IVectorCollection extends cdk.IResource {
  /**
   * The name of the collection.
   */
  readonly collectionName: string;

  /**
   * The ID of the collection.
   */
  readonly collectionId: string;

  /**
   * The ARN of the collection.
   */
  readonly collectionArn: string;

  /**
   * Indicates whether standby replicas are enabled.
   */
  readonly standbyReplicas: VectorCollectionStandbyReplicas;

  /**
   * An IAM policy that allows API access to the collection.
   */
  readonly aossPolicy: iam.ManagedPolicy;

  /**
   * An OpenSearch Access Policy that allows access to the index.
   */
  readonly dataAccessPolicy: oss.CfnAccessPolicy;

  /**
   * Type of collection
   */
  readonly collectionType: VectorCollectionType;

  /**
   * Return the given named metric for this VectorCollection.
   *
   * @param metricName The name of the metric
   * @param props Properties for the metric
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of search requests.
   *
   * @param props Properties for the metric
   */
  metricSearchRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of index requests.
   *
   * @param props Properties for the metric
   */
  metricIndexRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the search latency.
   *
   * @param props Properties for the metric
   */
  metricSearchLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the 90th percentile search latency.
   *
   * @param props Properties for the metric
   */
  metricSearchLatencyP90(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * A new or imported vector collection.
 */
abstract class VectorCollectionBase extends cdk.Resource implements IVectorCollection {
  public abstract readonly collectionName: string;
  public abstract readonly collectionId: string;
  public abstract readonly collectionArn: string;
  public abstract readonly standbyReplicas: VectorCollectionStandbyReplicas;
  public abstract readonly aossPolicy: iam.ManagedPolicy;
  public abstract readonly dataAccessPolicy: oss.CfnAccessPolicy;
  public abstract readonly collectionType: VectorCollectionType;

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/AOSS',
      metricName,
      dimensionsMap: {
        CollectionId: this.collectionId,
      },
      ...props,
    });
  }

  public metricSearchRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SearchRequestCount', props);
  }

  public metricIndexRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('IndexRequestCount', props);
  }

  public metricSearchLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SearchLatency', { statistic: 'Average', ...props });
  }

  public metricSearchLatencyP90(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('SearchLatency', { statistic: 'p90', ...props });
  }
}

/**
 * Provides a vector search collection in Amazon OpenSearch Serverless.
 */
export class VectorCollection extends VectorCollectionBase {
  /**
   * Return metrics for all vector collections.
   */
  public static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/AOSS',
      metricName,
      statistic: 'Sum',
      ...props,
    });
  }

  /**
   * Metric for the total number of search requests across all collections.
   */
  public static metricAllSearchRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('SearchRequestCount', props);
  }

  /**
   * Metric for the total number of index requests across all collections.
   */
  public static metricAllIndexRequestCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('IndexRequestCount', props);
  }

  /**
   * Metric for average search latency across all collections.
   */
  public static metricAllSearchLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('SearchLatency', {
      statistic: 'Average',
      ...props,
    });
  }

  /**
   * Import an existing collection using its attributes.
   * @param constructScope The parent creating construct.
   * @param constructId The construct's name.
   * @param attrs The collection attributes to use.
   */
  public static fromCollectionAttributes(
    constructScope: Construct,
    constructId: string,
    attrs: VectorCollectionAttributes,
  ): IVectorCollection {
    class Import extends VectorCollectionBase {
      public readonly collectionArn = attrs.collectionArn;
      public readonly collectionId = attrs.collectionId;
      public readonly collectionName = attrs.collectionName;
      public readonly standbyReplicas = attrs.standbyReplicas;
      public readonly collectionType = attrs.collectionType;
      public readonly aossPolicy: iam.ManagedPolicy;
      public readonly dataAccessPolicy: oss.CfnAccessPolicy;

      constructor(scope: Construct, id: string) {
        super(scope, id);

        this.aossPolicy = new iam.ManagedPolicy(this, 'ImportedAOSSPolicy', {
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['aoss:APIAccessAll'],
              resources: [this.collectionArn],
            }),
          ],
        });

        this.dataAccessPolicy = new oss.CfnAccessPolicy(this, 'ImportedDataAccessPolicy', {
          name: this.generatePhysicalName() + '-DataAccessPolicy-agent',
          type: 'data',
          policy: '[]',
        });
      }
    }
    return new Import(constructScope, constructId);
  }

  public readonly collectionName: string;
  public readonly standbyReplicas: VectorCollectionStandbyReplicas;
  public readonly collectionId: string;
  public readonly collectionArn: string;
  public readonly aossPolicy: iam.ManagedPolicy;
  public readonly dataAccessPolicy: oss.CfnAccessPolicy;
  public readonly collectionType: VectorCollectionType;
  public readonly collectionEndpoint: string;
  public readonly dashboardEndpoint: string;

  /**
   * Instance of CfnCollection.
   */
  private readonly _resource: oss.CfnCollection;

  /**
   * An OpenSearch Access Policy document that will become `dataAccessPolicy`.
   * @private
   */
  private dataAccessPolicyDocument: any[] = [];

  constructor(scope: Construct, id: string, props?: VectorCollectionProps) {
    super(scope, id);

    // Ensure collection name stays within 32 chars while maintaining uniqueness
    const physicalName = this.generatePhysicalName();
    this.collectionName = props?.collectionName ?? 
      (physicalName.length > 22 ? 
        physicalName.substring(0, 22) + '-vec' : // truncate long names
        physicalName + '-vec'); // short names can use full physical name
    
    this.standbyReplicas = props?.standbyReplicas ?? VectorCollectionStandbyReplicas.ENABLED;
    this.collectionType = props?.collectionType ?? VectorCollectionType.VECTORSEARCH;

    const encryptionPolicyName =  this.generatePhysicalName() + '-EncryptionPolicy';
    const encryptionPolicy = new oss.CfnSecurityPolicy(this, 'EncryptionPolicy', {
      name: encryptionPolicyName,
      type: 'encryption',
      policy: JSON.stringify({
        Rules: [
          {
            ResourceType: 'collection',
            Resource: [`collection/${this.collectionName}`],
          },
        ],
        AWSOwnedKey: true,
      }),
    });

    const networkPolicyName = this.generatePhysicalName() + '-NetworkPolicy';

    const networkPolicy = new oss.CfnSecurityPolicy(this, 'NetworkPolicy', {
      name: networkPolicyName,
      type: 'network',
      policy: JSON.stringify([
        {
          Rules: [
            {
              ResourceType: 'collection',
              Resource: [`collection/${this.collectionName}`],
            },
            {
              ResourceType: 'dashboard',
              Resource: [`collection/${this.collectionName}`],
            },
          ],
          AllowFromPublic: true,
        },
      ]),
    });

    this._resource = new oss.CfnCollection(this, 'VectorCollection', {
      name: this.collectionName,
      type: this.collectionType,
      standbyReplicas: this.standbyReplicas,
      description: props?.description,
      tags: props?.tags,
    });

    this.collectionArn = this._resource.attrArn;
    this.collectionId = this._resource.attrId;
    this.collectionEndpoint = this._resource.attrCollectionEndpoint;
    this.dashboardEndpoint = this._resource.attrDashboardEndpoint;

    if (props?.customAossPolicy) {
      this.aossPolicy = props.customAossPolicy;
    } else {
      this.aossPolicy = new iam.ManagedPolicy(
        this,
        'AOSSApiAccessAll', {
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'aoss:APIAccessAll',
              ],
              resources: [this._resource.attrArn],
            }),
          ],
        },
      );
    }

    this._resource.node.addDependency(encryptionPolicy);
    this._resource.node.addDependency(networkPolicy);

    const isDataAccessPolicyNotEmpty = new cdk.CfnCondition(this, 'IsDataAccessPolicyNotEmpty', {
      expression: cdk.Fn.conditionNot(cdk.Fn.conditionEquals(0, cdk.Lazy.number({
        produce: () => this.dataAccessPolicyDocument.length,
      }))),
    });

    const dataAccessPolicyName = this.generatePhysicalName() + '-DataAccessPolicy';
   
    this.dataAccessPolicy = new oss.CfnAccessPolicy(this, 'DataAccessPolicy', {
      name: dataAccessPolicyName,
      type: 'data',
      policy: cdk.Lazy.string({
        produce: () => JSON.stringify(this.dataAccessPolicyDocument),
      }),
    });

    this.dataAccessPolicy.cfnOptions.condition = isDataAccessPolicyNotEmpty;

    this.node.addValidation({
      validate: () => {
        const errors: string[] = [];

        if (this.collectionName) {
          if (!/^[a-z0-9-]+$/.test(this.collectionName)) {
            errors.push('Collection name must contain only lowercase letters, numbers, and hyphens');
          }
          if (this.collectionName.length < 3 || this.collectionName.length > 32) {
            errors.push('Collection name must be between 3 and 32 characters');
          }
        }

        return errors;
      },
    });

    cdk.Tags.of(this).add('Name', this.collectionName);
    cdk.Tags.of(this).add('Type', 'VectorCollection');
  }
  /**
     * Grants the specified role access to data in the collection.
     * @param grantee The role to grant access to.
     */
  grantDataAccess(grantee: iam.IRole) {
    this.dataAccessPolicyDocument.push({
      Rules: [
        {
          Resource: [`collection/${this.collectionName}`],
          Permission: [
            'aoss:DescribeCollectionItems',
            'aoss:CreateCollectionItems',
            'aoss:UpdateCollectionItems',
          ],
          ResourceType: 'collection',
        },
        {
          Resource: [`index/${this.collectionName}/*`],
          Permission: [
            'aoss:UpdateIndex',
            'aoss:DescribeIndex',
            'aoss:ReadDocument',
            'aoss:WriteDocument',
            'aoss:CreateIndex',
          ],
          ResourceType: 'index',
        },
      ],
      Principal: [
        grantee.roleArn,
      ],
      Description: '',
    });
    grantee.addManagedPolicy(this.aossPolicy);
  }
}
