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
import * as oss from 'aws-cdk-lib/aws-opensearchserverless';
import { Construct } from 'constructs';
import { VectorCollection } from './opensearch-collection';

/**
 * The field data type. Must be a valid OpenSearch field type.
 */
export enum OpensearchFieldType {
  TEXT = 'text',
  KNN_VECTOR = 'knn_vector',
}

/**
 * The k-NN search engine to use.
 */
export enum EngineType {
  /**
   * C++ implementation.
   */
  FAISS = 'faiss',
  /**
   * C++ implementation.
   */
  NMSLIB = 'nmslib',
  /**
   * Java implementation.
   */
  LUCENE = 'lucene',
}

/**
 * The algorithm name for k-NN search.
 */
export enum AlgorithmNameType {
  HNSW = 'hnsw',
  IVF = 'ivf',
}

/**
 * The distance function used for k-NN search.
 */
export enum SpaceType {
  L2 = 'l2',
  L1 = 'l1',
  LINF = 'linf',
  COSINESIMILARITY = 'cosinesimil',
  INNERPRODUCT = 'innerproduct',
  HAMMING = 'hamming',
}

/**
 * Additional parameters for the k-NN algorithm.
 */
export interface MethodParameters {
  /**
   * The size of the dynamic list used during k-NN graph creation.
   */
  readonly efConstruction?: number;
  /**
   * Number of neighbors to consider during k-NN search.
   */
  readonly m?: number;
}

/**
 * Configuration for k-NN search method.
 */
export interface Method {
  /**
   * The k-NN search engine to use.
  */
  readonly engine: EngineType;
  /**
   * The algorithm name for k-NN search.
   */
  readonly name: AlgorithmNameType;
  /**
   * Additional parameters for the k-NN algorithm.
   */
  readonly parameters?: MethodParameters;
  /**
   * The distance function used for k-NN search.
   */
  readonly spaceType?: SpaceType;
}

export interface PropertyMapping {
  /**
   * Dimension size for vector fields, defines the number of dimensions in the vector.
   */
  readonly dimension?: number;
  /**
   * Whether the index is indexed. Previously, this was called `filterable`.
   */
  readonly index?: boolean;
  /**
   * Configuration for k-NN search method.
   */
  readonly method?: Method;
  /**
   * Defines the fields within the mapping, including their types and configurations.
   */
  readonly properties?: Record<string, PropertyMapping>;
  /**
   * The field data type. Must be a valid OpenSearch field type.
   */
  readonly type: OpensearchFieldType;
  /**
   * Default value for the field when not specified in a document.
   */
  readonly value?: string;
}

/**
 * Index settings for the OpenSearch Serverless index.
 */
export interface IndexSettings {
  /**
   * Enable or disable k-nearest neighbor search capability.
   */
  readonly knn?: boolean;
  /**
   * The size of the dynamic list for the nearest neighbors.
   */
  readonly knnAlgoParamEfSearch?: number;
  /**
   * How often to perform a refresh operation. For example, 1s or 5s.
   */
  readonly refreshInterval?: cdk.Duration;
}

/**
 * The mappings for the OpenSearch Serverless index.
 */
export interface MappingsProperty {
  readonly properties: Record<string, PropertyMapping>;
}

/**
 * Properties for the VectorIndex.
 */
export interface VectorIndexProps {
  /**
   * The OpenSearch Vector Collection.
   */
  readonly collection: VectorCollection;
  /**
   * The name of the index.
   */
  readonly indexName: string;
  /**
   * The metadata management fields.
   */
  readonly mappings?: MappingsProperty;
  /**
   * The settings for the index.
   */
  readonly settings?: IndexSettings;
}

export interface VectorIndexAttributes {
  /**
   * The endpoint of the collection
   */
  readonly collectionEndpoint: string;
  /**
   * The name of the index
   */
  readonly indexName: string;
}

/**
 * Interface representing a vector index
 */
export interface IVectorIndex extends cdk.IResource {
  /**
   * The endpoint of the collection
   */
  readonly collectionEndpoint: string;
  /**
   * The name of the index
   */
  readonly indexName: string;
}

/**
 * A new or imported vector index.
 */
abstract class VectorIndexBase extends cdk.Resource implements IVectorIndex {
  public abstract readonly collectionEndpoint: string;
  public abstract readonly indexName: string;

  public static fromVectorIndexAttributes(
    scope: Construct,
    constructId: string,
    attrs: VectorIndexAttributes,
  ): IVectorIndex {
    class Import extends VectorIndexBase {
      public readonly collectionEndpoint = attrs.collectionEndpoint;
      public readonly indexName = attrs.indexName;
    }
    return new Import(scope, constructId);
  }
}

/**
 * Provides a vector index in Amazon OpenSearch Serverless.
 */
export class VectorIndex extends VectorIndexBase {
  /**
   * The name of the index.
   */
  public readonly indexName: string;
  /**
   * The endpoint of the collection
   */
  public readonly collectionEndpoint: string;

  /**
   * Instance of CfnIndex.
   */
  private readonly _resource: oss.CfnIndex;


  constructor(scope: Construct, id: string, props: VectorIndexProps) {
    super(scope, id);

    // ------------------------------------------------------
    // Set attributes or defaults
    // ------------------------------------------------------
    this.indexName = props.indexName;

    const manageIndexPolicyName = this.generatePhysicalName() + '-ManageIndexPolicy';
    const manageIndexPolicy = new oss.CfnAccessPolicy(
      this,
      'ManageIndexPolicy',
      {
        name: manageIndexPolicyName,
        type: 'data',
        policy: JSON.stringify([
          {
            Rules: [
              {
                Resource: [`index/${props.collection.collectionName}/*`],
                Permission: [
                  'aoss:DescribeIndex',
                  'aoss:CreateIndex',
                  'aoss:DeleteIndex',
                  'aoss:UpdateIndex',
                ],
                ResourceType: 'index',
              },
              {
                Resource: [`collection/${props.collection.collectionName}`],
                Permission: ['aoss:DescribeCollectionItems'],
                ResourceType: 'collection',
              },
            ],
            Principal: ['*'],
            Description: '',
          },
        ]),
      },
    );

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this._resource = new oss.CfnIndex(this, 'VectorIndex', {
      indexName: props.indexName,
      collectionEndpoint: props.collection.collectionEndpoint,
      mappings: this._renderMappings(props.mappings),
      settings: this._renderIndexSettings(props.settings),
    });

    this.collectionEndpoint = this._resource.collectionEndpoint;

    this._resource.addDependency(manageIndexPolicy);
    this._resource.addDependency(props.collection.dataAccessPolicy);
  }

  /**
   * Render the index settings.
   */
  private _renderIndexSettings(props?: IndexSettings): oss.CfnIndex.IndexSettingsProperty {
    if (!props) return {};

    return {
      index: {
        knn: props?.knn,
        knnAlgoParamEfSearch: props?.knnAlgoParamEfSearch,
        refreshInterval: props?.refreshInterval?.toString(),
      },
    };
  }

  /**
   * Render the mappings.
   */
  private _renderMappings(props?: MappingsProperty): oss.CfnIndex.MappingsProperty {
    if (!props) return {};

    const convertedProps: Record<string, oss.CfnIndex.PropertyMappingProperty> = {};
    for (const [key, value] of Object.entries(props.properties)) {
      convertedProps[key] = value as unknown as oss.CfnIndex.PropertyMappingProperty;
    }

    return {
      properties: convertedProps,
    };
  }
}