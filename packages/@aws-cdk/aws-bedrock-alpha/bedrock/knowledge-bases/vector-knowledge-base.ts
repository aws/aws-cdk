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

import { ArnFormat, aws_bedrock as bedrock, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  CommonKnowledgeBaseAttributes,
  CommonKnowledgeBaseProps,
  IKnowledgeBase,
  KnowledgeBaseBase,
  KnowledgeBaseType,
} from './knowledge-base';
import {  VectorIndex, SpaceType, OpensearchFieldType, EngineType, AlgorithmNameType } from './vectorstore-knowledgebases/opensearch-vector-index';
import { VectorCollection } from './vectorstore-knowledgebases/opensearch-collection';
import { Agent } from '../agents/agent';
import {
  ConfluenceDataSource,
  ConfluenceDataSourceAssociationProps,
} from '../data-sources/confluence-data-source';
import {
  CustomDataSource,
  CustomDataSourceAssociationProps,
} from '../data-sources/custom-data-source';
import { S3DataSource, S3DataSourceAssociationProps } from '../data-sources/s3-data-source';
import {
  SalesforceDataSource,
  SalesforceDataSourceAssociationProps,
} from '../data-sources/salesforce-data-source';
import {
  SharePointDataSource,
  SharePointDataSourceAssociationProps,
} from '../data-sources/sharepoint-data-source';
import {
  WebCrawlerDataSource,
  WebCrawlerDataSourceAssociationProps,
} from '../data-sources/web-crawler-data-source';
import { BedrockFoundationModel, VectorType } from '../models';

/******************************************************************************
 *                                  ENUMS
 *****************************************************************************/
/**
 * Knowledge base can be backed by different vector databases.
 * This enum represents the different vector databases that can be used.
 *
 * `OPENSEARCH_SERVERLESS` is the default vector database.
 * `REDIS_ENTERPRISE_CLOUD` is the vector database for Redis Enterprise Cloud.
 * `PINECONE` is the vector database for Pinecone.
 * `AMAZON_AURORA` is the vector database for Amazon Aurora PostgreSQL.
 */
enum VectorStoreType {
  /**
   * `OPENSEARCH_SERVERLESS` is the vector store for OpenSearch Serverless.
   */
  OPENSEARCH_SERVERLESS = 'OPENSEARCH_SERVERLESS',
  /**
   * `PINECONE` is the vector store for Pinecone.
   */
  PINECONE = 'PINECONE',
  /**
   * `RDS` is the vector store for Amazon Aurora.
   */
  AMAZON_AURORA = 'RDS',
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
/**
 * Interface for the configuration of the storage for knowledge base.
 */
interface StorageConfiguration {
  /**
   * The vector store, which can be of `VectorCollection`, `PineconeVectorStore` or
   * `AmazonAuroraVectorStore` types.
   */
  vectorStore:
    | VectorCollection;

  /**
   * The type of the vector store.
   */
  vectorStoreType: VectorStoreType;

  /**
   * The name of the index.
   */
  indexName: string;

  /**
   * The field of the vector field for vector mapping.
   */
  vectorField: string;

  /**
   * The field of the text field for vector mapping.
   */
  textField: string;

  /**
   * The field of the metadata.
   */
  metadataField: string;
}

/**
 * Represents a Knowledge Base, either created with CDK or imported.
 */
export interface IVectorKnowledgeBase extends IKnowledgeBase {
  /**
   * Add an S3 data source to the knowledge base.
   */
  addS3DataSource(props: S3DataSourceAssociationProps): S3DataSource;

  /**
   * Add a web crawler data source to the knowledge base.
   */
  addWebCrawlerDataSource(props: WebCrawlerDataSourceAssociationProps): WebCrawlerDataSource;

  /**
   * Add a SharePoint data source to the knowledge base.
   */
  addSharePointDataSource(props: SharePointDataSourceAssociationProps): SharePointDataSource;

  /**
   * Add a Confluence data source to the knowledge base.
   */
  addConfluenceDataSource(props: ConfluenceDataSourceAssociationProps): ConfluenceDataSource;

  /**
   * Add a Salesforce data source to the knowledge base.
   */
  addSalesforceDataSource(props: SalesforceDataSourceAssociationProps): SalesforceDataSource;

  /**
   * Add a Custom data source to the knowledge base.
   */
  addCustomDataSource(props: CustomDataSourceAssociationProps): CustomDataSource;

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  grantRetrieve(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  grantRetrieveAndGenerate(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
/**
 * Abstract base class for Vector Knowledge Base.
 * Contains methods valid for KBs either created with CDK or imported.
 */
abstract class VectorKnowledgeBaseBase extends KnowledgeBaseBase implements IVectorKnowledgeBase {
  public abstract readonly knowledgeBaseArn: string;
  public abstract readonly knowledgeBaseId: string;
  public abstract readonly role: iam.IRole;
  public abstract readonly description?: string;
  public abstract readonly instruction?: string;

  public readonly type: KnowledgeBaseType = KnowledgeBaseType.VECTOR;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  // ------------------------------------------------------
  // Helper methods to add Data Sources
  // ------------------------------------------------------
  public addS3DataSource(props: S3DataSourceAssociationProps): S3DataSource {
    return new S3DataSource(this, `s3-${props.bucket.node.addr}`, {
      knowledgeBase: this,
      ...props,
    });
  }
  public addWebCrawlerDataSource(
    props: WebCrawlerDataSourceAssociationProps,
  ): WebCrawlerDataSource {
    const url = new URL(props.sourceUrls[0]);
    return new WebCrawlerDataSource(this, `web-${url.hostname.replace('.', '-')}`, {
      knowledgeBase: this,
      ...props,
    });
  }
  public addSharePointDataSource(
    props: SharePointDataSourceAssociationProps,
  ): SharePointDataSource {
    const url = new URL(props.siteUrls[0]);
    return new SharePointDataSource(this, `sp-${url.hostname.replace('.', '-')}`, {
      knowledgeBase: this,
      ...props,
    });
  }
  public addConfluenceDataSource(
    props: ConfluenceDataSourceAssociationProps,
  ): ConfluenceDataSource {
    const url = new URL(props.confluenceUrl);
    return new ConfluenceDataSource(this, `cf-${url.hostname.replace('.', '-')}`, {
      knowledgeBase: this,
      ...props,
    });
  }
  public addSalesforceDataSource(
    props: SalesforceDataSourceAssociationProps,
  ): SalesforceDataSource {
    const url = new URL(props.endpoint);
    return new SalesforceDataSource(this, `sf-${url.hostname.replace('.', '-')}`, {
      knowledgeBase: this,
      ...props,
    });
  }
  public addCustomDataSource(props: CustomDataSourceAssociationProps): CustomDataSource {
    return new CustomDataSource(this, `custom-${props.dataSourceName}`, {
      knowledgeBase: this,
      ...props,
    });
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for a knowledge base
 */
export interface VectorKnowledgeBaseProps extends CommonKnowledgeBaseProps {
  /**
   * The embeddings model for the knowledge base
   */
  readonly embeddingsModel: BedrockFoundationModel;

  /**
   * The vector type to store vector embeddings.
   *
   * @default - VectorType.FLOATING_POINT
   */
  readonly vectorType?: VectorType;

  /**
   * The name of the vector index.
   * If vectorStore is not of type `VectorCollection`,
   * do not include this property as it will throw error.
   *
   * @default - 'bedrock-knowledge-base-default-index'
   */
  readonly indexName?: string;

  /**
   * The name of the field in the vector index.
   * If vectorStore is not of type `VectorCollection`,
   * do not include this property as it will throw error.
   *
   * @default - 'bedrock-knowledge-base-default-vector'
   */
  readonly vectorField?: string;

  /**
   * The vector store for the knowledge base. Must be either of
   * type `VectorCollection`, `RedisEnterpriseVectorStore`,
   * `PineconeVectorStore` or `AmazonAuroraVectorStore`.
   *
   * @default - A new OpenSearch Serverless vector collection is created.
   */
  readonly vectorStore?:
    | VectorCollection;

  /**
   * The vector index for the OpenSearch Serverless backed knowledge base.
   * If vectorStore is not of type `VectorCollection`, do not include
   * this property as it will throw error.
   *
   * @default - A new vector index is created on the Vector Collection
   * if vector store is of `VectorCollection` type.
   */
  readonly vectorIndex?: VectorIndex;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Properties for importing a knowledge base outside of this stack
 */
export interface VectorKnowledgeBaseAttributes extends CommonKnowledgeBaseAttributes {
  // Unique props for vector KBs would be defined here
}

/**
 * Deploys a Bedrock Knowledge Base and configures a backend by OpenSearch Serverless,
 * Pinecone, Redis Enterprise Cloud or Amazon Aurora PostgreSQL.
 *
 */
export class VectorKnowledgeBase extends VectorKnowledgeBaseBase {
  // ------------------------------------------------------
  // Import Methods
  // ------------------------------------------------------
  public static fromKnowledgeBaseAttributes(
    scope: Construct,
    id: string,
    attrs: VectorKnowledgeBaseAttributes,
  ): IVectorKnowledgeBase {
    const stack = Stack.of(scope);

    class Import extends VectorKnowledgeBaseBase {
      public readonly role = iam.Role.fromRoleArn(
        this,
        `kb-${attrs.knowledgeBaseId}-role`,
        attrs.executionRoleArn,
      );
      public readonly description = attrs.description;
      public readonly instruction = attrs.instruction;
      public readonly knowledgeBaseId = attrs.knowledgeBaseId;
      public readonly knowledgeBaseArn = stack.formatArn({
        service: 'bedrock',
        resource: 'knowledge-base',
        resourceName: attrs.knowledgeBaseId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      });
    }
    return new Import(scope, id);
  }
  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The name of the knowledge base.
   */
  public readonly name: string;

  /**
   * Instance of knowledge base.
   */
  public readonly knowledgeBaseInstance: bedrock.CfnKnowledgeBase;

  /**
   * The role the Knowledge Base uses to access the vector store and data source.
   */
  public readonly role: iam.IRole;

  /**
   * The vector store for the knowledge base.
   */
  public readonly vectorStore:
    | VectorCollection;

  /**
   * A description of the knowledge base.
   */
  readonly description?: string;

  /**
   * Instructions for agents based on the design and type of information of the
   * Knowledge Base. This will impact how Agents interact with the Knowledge Base.
   */
  readonly instruction?: string;

  /**
   * The ARN of the knowledge base.
   */
  public readonly knowledgeBaseArn: string;

  /**
   * The ID of the knowledge base.
   */
  public readonly knowledgeBaseId: string;

  /**
   * The OpenSearch vector index for the knowledge base.
   * @private
   */
  private vectorIndex?: VectorIndex;

  /**
   * The type of the knowledge base.
   * @private
   */
  private vectorStoreType: VectorStoreType;

  constructor(scope: Construct, id: string, props: VectorKnowledgeBaseProps) {
    super(scope, id);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    const embeddingsModel = props.embeddingsModel;
    const vectorType = props.vectorType ?? VectorType.FLOATING_POINT;
    const indexName = props.indexName ?? 'bedrock-knowledge-base-default-index';
    const vectorField = props.vectorField ?? 'bedrock-knowledge-base-default-vector';
    const textField = 'AMAZON_BEDROCK_TEXT_CHUNK';
    const metadataField = 'AMAZON_BEDROCK_METADATA';

    this.description = props.description ?? 'CDK deployed Knowledge base'; // even though this prop is optional, if no value is provided it will fail to deploy
    //this.knowledgeBaseState = props.knowledgeBaseState ?? 'ENABLED';
    this.instruction = props.instruction;

    validateModel(embeddingsModel, vectorType);
    validateVectorIndex(props.vectorStore, props.vectorIndex, props.vectorField, props.indexName);
    if (props.vectorIndex) {
      validateIndexParameters(props.vectorIndex, indexName);
    }

    this.name = props.name ?? this.generatePhysicalName() + 'knowledgebase';

    if (props.existingRole) {
      this.role = props.existingRole;
    } else {
      const roleName = this.generatePhysicalName() + 'knowledgebaserole';
      this.role = new iam.Role(this, 'Role', {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
          conditions: {
            StringEquals: { 'aws:SourceAccount': Stack.of(this).account },
            ArnLike: {
              'aws:SourceArn': Stack.of(this).formatArn({
                service: 'bedrock',
                resource: 'knowledge-base',
                resourceName: '*',
                arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
              }),
            },
          },
        }),
      });

      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['bedrock:InvokeModel'],
          resources: [embeddingsModel.asArn(this)],
        }),
      );
    }
    /**
     * Create the vector store if the vector store was provided by the user.
     * Otherwise check againts all possible vector datastores.
     * If none was provided create default OpenSearch Serverless Collection.
     */
    if (props.vectorStore instanceof VectorCollection) {
      ({ vectorStore: this.vectorStore, vectorStoreType: this.vectorStoreType } =
        this.handleOpenSearchCollection(props));
    } else {
      ({ vectorStore: this.vectorStore, vectorStoreType: this.vectorStoreType } =
        this.handleOpenSearchDefaultVectorCollection());
    }

    // perform this validation after the vector store is handled since if the user
    // doesn't provide one, the method above will create it
    validateVectorType(this.vectorStore, vectorType);


    /**
     * Create the vector index if the vector store is OpenSearch Serverless
     * and it was not provided. Otherwise use the provided vector index.
     */
    if (this.vectorStoreType === VectorStoreType.OPENSEARCH_SERVERLESS) {
      if (!props.vectorIndex) {
        this.vectorIndex = new VectorIndex(this, 'KBIndex', {
          collection: this.vectorStore as VectorCollection,
          indexName,
          settings: {
            knn: true,
          },
          mappings: {
            properties: {
              vectorField: {
                type: OpensearchFieldType.KNN_VECTOR,
                dimension: embeddingsModel.vectorDimensions!,
                //data_type: props.vectorType === VectorType.BINARY ? 'Binary' : 'float', <- This is missing in L1 CfnIndex props
                method: {
                  engine: EngineType.FAISS,
                  spaceType: props.vectorType === VectorType.BINARY ? SpaceType.HAMMING : SpaceType.L2,
                  name: AlgorithmNameType.HNSW,
                  parameters: {},
                },
              },
              AMAZON_BEDROCK_TEXT_CHUNK: {
                type: OpensearchFieldType.TEXT,
                index: true,
              },
              AMAZON_BEDROCK_METADATA: {
                type: OpensearchFieldType.TEXT,
                index: false,
              },
            },
          },
        });

        this.vectorIndex.node.addDependency(this.vectorStore);
      } else {
        this.vectorIndex = props.vectorIndex;
      }
    }

    /**
     * Create storage configuraion. If it is of type of
     * `AmazonAuroraVectorStore` or `ExistingAmazonAuroraVectorStore`,
     * then get textField, metadataField and vectorField from
     * the arguments. Otherwise use default values.
     */
    const storageConfiguration: StorageConfiguration = {
      indexName: indexName,
      vectorStore: this.vectorStore,
      vectorStoreType: this.vectorStoreType,
      vectorField: vectorField,
      textField: textField,
      metadataField: metadataField,
    };

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const knowledgeBase = new bedrock.CfnKnowledgeBase(this, 'MyCfnKnowledgeBase', {
      knowledgeBaseConfiguration: {
        type: KnowledgeBaseType.VECTOR,
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: embeddingsModel.asArn(this),
          // Used this approach as if property is specified on models that do not
          // support configurable dimensions CloudFormation throws an error at runtime
          embeddingModelConfiguration: {
            bedrockEmbeddingModelConfiguration:
              embeddingsModel.modelId === 'amazon.titan-embed-text-v2:0'
                ? {
                  dimensions: embeddingsModel.vectorDimensions,
                  embeddingDataType: vectorType,
                }
                : { embeddingDataType: vectorType },
          },
        },
      },
      name: this.name,
      roleArn: this.role.roleArn,
      storageConfiguration: getStorageConfiguration(storageConfiguration),
      description: props.description,
    });

    this.knowledgeBaseInstance = knowledgeBase;

    const kbCRPolicy = new iam.Policy(this, 'KBCRPolicy', {
      // roles: [crProvider.role],
      roles: [this.role],
      statements: [
        new iam.PolicyStatement({
          actions: [
            'bedrock:CreateKnowledgeBase',
            /**
             * We need to add `bedrock:AssociateThirdPartyKnowledgeBase` if
             * we are deploying Redis or Pinecone data sources
             */
            //...(this.vectorStoreType === VectorStoreType.REDIS_ENTERPRISE_CLOUD ||
            ...(this.vectorStoreType === VectorStoreType.PINECONE
              ? ['bedrock:AssociateThirdPartyKnowledgeBase']
              : []),
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'bedrock:UpdateKnowledgeBase',
            'bedrock:DeleteKnowledgeBase',
            'bedrock:TagResource',
          ],
          resources: [
            Stack.of(this).formatArn({
              service: 'bedrock',
              resource: 'knowledge-base',
              resourceName: '*',
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            }),
          ],
        }),
        new iam.PolicyStatement({
          actions: ['iam:PassRole'],
          resources: [this.role.roleArn],
        }),
      ],
    });

    knowledgeBase.node.addDependency(this.role);
    knowledgeBase.node.addDependency(kbCRPolicy);
    if (this.vectorStoreType === VectorStoreType.OPENSEARCH_SERVERLESS && this.vectorIndex) {
      knowledgeBase.node.addDependency(this.vectorIndex);
    }
    if (this.vectorStoreType === VectorStoreType.AMAZON_AURORA) {
      knowledgeBase.node.addDependency(this.vectorStore);
    }

    this.knowledgeBaseArn = knowledgeBase.attrKnowledgeBaseArn;
    this.knowledgeBaseId = knowledgeBase.attrKnowledgeBaseId;
  }

  /**
   * Handle VectorCollection type of VectorStore.
   *
   * @param props - The properties of the KnowledgeBase.
   * @returns The instance of VectorCollection, VectorStoreType.
   * @internal This is an internal core function and should not be called directly.
   */
  private handleOpenSearchCollection(props: VectorKnowledgeBaseProps): {
    vectorStore: VectorCollection;
    vectorStoreType: VectorStoreType;
  } {
    const vectorStore = props.vectorStore as VectorCollection;
    vectorStore.grantDataAccess(this.role);
    return {
      vectorStore: vectorStore,
      vectorStoreType: VectorStoreType.OPENSEARCH_SERVERLESS,
    };
  }
 
  /**
   * Handle the default VectorStore type.
   *
   * @returns The instance of VectorCollection, VectorStoreType.
   * @internal This is an internal core function and should not be called directly.
   */
  private handleOpenSearchDefaultVectorCollection(): {
    vectorStore: VectorCollection;
    vectorStoreType: VectorStoreType;
  } {
    const vectorStore = new VectorCollection(this, 'KBVectors');
    vectorStore.grantDataAccess(this.role);
    return {
      vectorStore: vectorStore,
      vectorStoreType: VectorStoreType.OPENSEARCH_SERVERLESS,
    };
  }

  /**
   * Associate knowledge base with an agent
   */
  public associateToAgent(agent: Agent) {
    agent.addKnowledgeBase(this);
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}

/**
 * Validate that Bedrock Knowledge Base can use the selected model.
 *
 * @internal This is an internal core function and should not be called directly.
 */
function validateModel(foundationModel: BedrockFoundationModel, vectorType: VectorType) {
  if (!foundationModel.supportsKnowledgeBase) {
    throw new Error(`The model ${foundationModel} is not supported by Bedrock Knowledge Base.`);
  }
  if (
    foundationModel.supportedVectorType &&
    !foundationModel.supportedVectorType.includes(vectorType)
  ) {
    throw new Error(
      `The vector type ${vectorType} is not supported by the model ${foundationModel}.`,
    );
  }
}

/**
 * Validate that the storage configuration can use the selected vector type.
 * It prevents the use of vector types with vector stores that do not support them,
 * thereby avoiding potential runtime errors.
 *
 * @internal This is an internal core function and should not be called directly.
 */
function validateVectorType(vectorStore: any, vectorType: VectorType) {
  if (!(vectorStore instanceof VectorCollection) && vectorType == VectorType.BINARY) {
    console.log(vectorStore);
    throw new Error(
      'Amazon OpenSearch Serverless is currently the only vector store that supports storing binary vectors.',
    );
  }
}

/**
 * Validate if VectorIndex was provided for a VectorStore of type
 * other than `VectorCollection`.
 *
 * @internal This is an internal core function and should not be called directly.
 */
function validateVectorIndex(vectorStore: any, vectorIndex: any, vectorField: any, indexName: any) {
  if (!(vectorStore instanceof VectorCollection) && vectorIndex) {
    throw new Error(
      'If vectorStore is not of type VectorCollection, vectorIndex should not be provided ' +
        'in KnowledgeBase construct.',
    );
  }
  if (!(vectorStore instanceof VectorCollection) && indexName) {
    throw new Error(
      'If vectorStore is not of type VectorCollection, indexName should not be provided ' +
        'in KnowledgeBase construct.',
    );
  }
  if (!(vectorStore instanceof VectorCollection) && vectorField) {
    throw new Error(
      'If vectorStore is not of type VectorCollection, vectorField should not be provided ' +
        'in KnowledgeBase construct.',
    );
  }
}

/**
 * Validate that indexName and vectorField parameters are identical
 * in KnowledgeBase construct if VectorIndex was created manually.
 *
 * By default we assign `vectorIndex` to `bedrock-knowledge-base-default-index`
 * value and if user provides `vectorIndex` manually, we need to make sure
 * they also provide it in KnowledgeBase construct if the value is not
 * `bedrock-knowledge-base-default-index`. Same for vectorField.
 *
 * @internal This is an internal core function and should not be called directly.
 */
function validateIndexParameters(vectorIndex: VectorIndex, indexName: string,) {
  if (vectorIndex.indexName !== 'bedrock-knowledge-base-default-index') {
    if (vectorIndex.indexName !== indexName) {
      throw new Error(
        'Default value of indexName is `bedrock-knowledge-base-default-index`.' +
          ' If you create VectorIndex manually and assign vectorIndex to value other than' +
          ' `bedrock-knowledge-base-default-index` then you must provide the same value in KnowledgeBase construct.' +
          ' If you created VectorIndex manually and set it to `bedrock-knowledge-base-default-index`' +
          ' then do not assign indexName in KnowledgeBase construct.',
      );
    }
  }
}

/**
 * Determine storage configuration based on vector store type.
 *
 * @internal This is an internal core function and should not be called directly.
 */
function getStorageConfiguration(params: StorageConfiguration): any {
  switch (params.vectorStoreType) {
    case VectorStoreType.OPENSEARCH_SERVERLESS:
      params.vectorStore = params.vectorStore as VectorCollection;
      return {
        type: VectorStoreType.OPENSEARCH_SERVERLESS,
        opensearchServerlessConfiguration: {
          collectionArn: params.vectorStore.collectionArn,
          fieldMapping: {
            vectorField: params.vectorField,
            textField: params.textField,
            metadataField: params.metadataField,
          },
          vectorIndexName: params.indexName,
        },
      };
    default:
      throw new Error(`Unsupported vector store type: ${params.vectorStoreType}`);
  }
}
