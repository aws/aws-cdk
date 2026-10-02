import { isResolvableObject, Mixin, Token, ValidationError } from 'aws-cdk-lib';
import { CfnKnowledgeBase } from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnPropsMixin, lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IConstruct } from 'constructs';
import { KnowledgeBaseType } from '../knowledge-bases/knowledge-base';
import type { OpenSearchServerlessVectorStoreProps } from '../knowledge-bases/vector-store';
import type { BedrockFoundationModel } from '../models';
import { VectorType } from '../models';

const OPENSEARCH_SERVERLESS_STORAGE_TYPE = 'OPENSEARCH_SERVERLESS';

function addVectorTypeValidation(construct: CfnKnowledgeBase, feature: string): void {
  construct.node.addValidation({
    validate: () => {
      const configuration = construct.knowledgeBaseConfiguration;
      if (isResolvableObject(configuration) || Token.isUnresolved(configuration.type)) {
        return [];
      }
      return configuration.type === KnowledgeBaseType.VECTOR
        ? []
        : [`${feature} can only be configured on a knowledge base of type ${KnowledgeBaseType.VECTOR}, got ${JSON.stringify(configuration.type)}`];
    },
  });
}

function assertVectorConfigurationResolved(construct: CfnKnowledgeBase, feature: string): void {
  const configuration = construct.knowledgeBaseConfiguration;
  if (isResolvableObject(configuration)
      || isResolvableObject(configuration.vectorKnowledgeBaseConfiguration)
      || isResolvableObject(configuration.vectorKnowledgeBaseConfiguration?.embeddingModelConfiguration)) {
    throw new ValidationError(
      lit`KnowledgeBaseConfigurationUnresolved`,
      `${feature} cannot be configured on a knowledge base whose configuration contains deploy-time object values`,
      construct,
    );
  }
}

/**
 * Properties for `KnowledgeBaseOpenSearchServerlessStorage`.
 */
export interface KnowledgeBaseOpenSearchServerlessStorageProps extends OpenSearchServerlessVectorStoreProps {
  /**
   * The knowledge base service role to grant collection access to.
   */
  readonly role: iam.IRoleRef & iam.IGrantable;
}

/**
 * Stores a knowledge base's vectors in an existing Amazon OpenSearch Serverless
 * vector index.
 *
 * Sets `StorageConfiguration` to `OPENSEARCH_SERVERLESS` with the given
 * collection, index and field mapping. Grants the service role `aoss:APIAccessAll`
 * on the collection and makes the knowledge base depend on that policy.
 *
 * The index must already exist and the collection's data access policy must
 * allow the service role to describe, read and write it; neither is created here.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-setup-oss.html
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-permissions.html#kb-permissions-oss
 */
export class KnowledgeBaseOpenSearchServerlessStorage extends Mixin {
  constructor(private readonly props: KnowledgeBaseOpenSearchServerlessStorageProps) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnKnowledgeBase {
    return CfnKnowledgeBase.isCfnKnowledgeBase(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    if (construct.storageConfiguration !== undefined) {
      throw new ValidationError(
        lit`KnowledgeBaseStorageAlreadyConfigured`,
        'the knowledge base already has a storage configuration; only one vector store can be configured',
        construct,
      );
    }

    addVectorTypeValidation(construct, 'VectorStore');

    const collectionArn = this.props.collection.collectionRef.collectionArn;

    construct.storageConfiguration = {
      type: OPENSEARCH_SERVERLESS_STORAGE_TYPE,
      opensearchServerlessConfiguration: {
        collectionArn,
        vectorIndexName: this.props.vectorIndexName,
        fieldMapping: {
          vectorField: this.props.vectorField,
          textField: this.props.textField,
          metadataField: this.props.metadataField,
        },
      },
    };

    // Bedrock validates access to the collection when the knowledge base is
    // created, so the policy must exist before the knowledge base does.
    iam.Grant.addToPrincipal({
      grantee: this.props.role,
      actions: ['aoss:APIAccessAll'],
      resourceArns: [collectionArn],
    }).applyBefore(construct);
  }
}

/**
 * Properties for `KnowledgeBaseEmbeddingsModel`.
 */
export interface KnowledgeBaseEmbeddingsModelProps {
  /**
   * The model used to create vector embeddings for the knowledge base.
   */
  readonly embeddingsModel: BedrockFoundationModel;

  /**
   * The data type of the vector embeddings.
   *
   * @default VectorType.FLOATING_POINT
   */
  readonly vectorType?: VectorType;

  /**
   * The knowledge base service role to grant model invocation to.
   */
  readonly role: iam.IRoleRef & iam.IGrantable;
}

/**
 * Configures the embeddings model of a vector knowledge base.
 *
 * Sets `EmbeddingModelArn`, `Dimensions` (only for models with a configurable
 * dimension; CloudFormation rejects it otherwise) and `EmbeddingDataType`.
 * Grants the service role `bedrock:InvokeModel*` and `bedrock:GetFoundationModel`
 * on the model and makes the knowledge base depend on that policy.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-permissions.html#kb-permissions-fm
 */
export class KnowledgeBaseEmbeddingsModel extends Mixin {
  constructor(private readonly props: KnowledgeBaseEmbeddingsModelProps) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnKnowledgeBase {
    return CfnKnowledgeBase.isCfnKnowledgeBase(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    const { embeddingsModel } = this.props;
    if (!embeddingsModel.supportsKnowledgeBase) {
      throw new ValidationError(
        lit`EmbeddingsModelNotSupported`,
        `embeddingsModel ${JSON.stringify(embeddingsModel.modelId)} cannot be used with knowledge bases; choose a vector embeddings model supported by Amazon Bedrock Knowledge Bases`,
        construct,
      );
    }
    const vectorType = this.props.vectorType ?? VectorType.FLOATING_POINT;
    const supported = embeddingsModel.supportedVectorType;
    if (supported !== undefined && !supported.includes(vectorType)) {
      throw new ValidationError(
        lit`UnsupportedVectorType`,
        `vectorType ${JSON.stringify(vectorType)} is not supported by embeddingsModel ${JSON.stringify(embeddingsModel.modelId)}; supported vector types are ${supported.map(type => JSON.stringify(type)).join(', ')}`,
        construct,
      );
    }

    assertVectorConfigurationResolved(construct, 'EmbeddingsModel');
    addVectorTypeValidation(construct, 'EmbeddingsModel');

    const dimensions = embeddingsModel.supportsConfigurableDimensions ? embeddingsModel.vectorDimensions : undefined;
    construct.with(new CfnPropsMixin(CfnKnowledgeBase, {
      knowledgeBaseConfiguration: {
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: embeddingsModel.modelArn,
          embeddingModelConfiguration: { bedrockEmbeddingModelConfiguration: { dimensions, embeddingDataType: vectorType } },
        },
      },
    }));

    // Bedrock validates access to the model when the knowledge base is created,
    // so the policy must exist before the knowledge base does.
    embeddingsModel.grantInvoke(this.props.role).applyBefore(construct);
  }
}

/**
 * Properties for `KnowledgeBaseSupplementalDataStorage`.
 */
export interface KnowledgeBaseSupplementalDataStorageProps {
  /**
   * The S3 bucket in which multimedia content extracted from multimodal
   * documents is stored.
   *
   * Amazon Bedrock manages the layout of the extracted content within the
   * bucket; a key prefix cannot be specified.
   */
  readonly bucket: s3.IBucketRef;

  /**
   * The knowledge base service role to grant bucket access to.
   */
  readonly role: iam.IRoleRef & iam.IGrantable;
}

/**
 * Stores the images, audio and video a vector knowledge base extracts from
 * multimodal documents in an Amazon S3 bucket.
 *
 * Merges `SupplementalDataStorageConfiguration` into the existing vector
 * configuration, replacing any location already set. Grants the service role
 * `s3:ListBucket` on the bucket and `s3:GetObject`, `s3:PutObject` and
 * `s3:DeleteObject` on its objects, and makes the knowledge base depend on
 * that policy.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-permissions.html#kb-permissions-multimodal
 */
export class KnowledgeBaseSupplementalDataStorage extends Mixin {
  constructor(private readonly props: KnowledgeBaseSupplementalDataStorageProps) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnKnowledgeBase {
    return CfnKnowledgeBase.isCfnKnowledgeBase(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    assertVectorConfigurationResolved(construct, 'SupplementalDataStorage');
    addVectorTypeValidation(construct, 'SupplementalDataStorage');

    // `CfnPropsMixin` deep-merges into the existing configuration
    construct.with(new CfnPropsMixin(CfnKnowledgeBase, {
      knowledgeBaseConfiguration: {
        vectorKnowledgeBaseConfiguration: {
          supplementalDataStorageConfiguration: {
            supplementalDataStorageLocations: [{
              supplementalDataStorageLocationType: 'S3',
              s3Location: { uri: `s3://${this.props.bucket.bucketRef.bucketName}/` },
            }],
          },
        },
      },
    }));

    // Bedrock validates access to the bucket when the knowledge base is
    // created, so the policy must exist before the knowledge base does.
    s3.BucketGrants.fromBucket(this.props.bucket)
      .actionsOnBucketAndObjectKeys(this.props.role, '*', 's3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject')
      .applyBefore(construct);

    construct.node.addDependency(this.props.role);
  }
}
