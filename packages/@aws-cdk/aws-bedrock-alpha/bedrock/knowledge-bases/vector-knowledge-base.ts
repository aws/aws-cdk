import { ArnFormat, Names, Stack } from 'aws-cdk-lib';
import { CfnKnowledgeBase } from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { CommonKnowledgeBaseProps, IKnowledgeBase, KnowledgeBaseAttributes } from './knowledge-base';
import { KnowledgeBaseBase, KnowledgeBaseType } from './knowledge-base';
import {
  createKnowledgeBaseServiceRole,
  knowledgeBaseArnFromId,
  validateCommonKnowledgeBaseProps,
} from './private/knowledge-base-helpers';
import type { VectorStore } from './vector-store';
import type { BedrockFoundationModel, VectorType } from '.././models';
import { KnowledgeBaseEmbeddingsModel, KnowledgeBaseSupplementalDataStorage } from '../mixins/knowledge-base';

const VECTOR_KNOWLEDGE_BASE_SYMBOL = Symbol.for('@aws-cdk/aws-bedrock-alpha.VectorKnowledgeBase');

/**
 * Represents a vector knowledge base.
 */
export interface IVectorKnowledgeBase extends IKnowledgeBase {
}

/**
 * Attributes for referencing an existing vector knowledge base.
 */
export interface VectorKnowledgeBaseAttributes extends KnowledgeBaseAttributes {
}

/**
 * Properties for a vector knowledge base.
 */
export interface VectorKnowledgeBaseProps extends CommonKnowledgeBaseProps {
  /**
   * The model used to create vector embeddings for the knowledge base.
   */
  readonly embeddingsModel: BedrockFoundationModel;

  /**
   * The vector store in which the embeddings are stored and searched.
   */
  readonly vectorStore: VectorStore;

  /**
   * The data type of the vector embeddings.
   *
   * @default VectorType.FLOATING_POINT
   */
  readonly vectorType?: VectorType;

  /**
   * The Amazon S3 bucket in which multimedia content extracted from
   * multimodal documents (images, audio, video) is stored.
   *
   * Required when the knowledge base ingests multimodal content.
   *
   * @default - no supplemental data storage; only text content is ingested
   */
  readonly supplementalDataStorageBucket?: s3.IBucketRef;
}

/**
 * An Amazon Bedrock knowledge base that stores vector embeddings of ingested
 * documents in a vector store and retrieves them by similarity search.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
 * @resource AWS::Bedrock::KnowledgeBase
 */
@propertyInjectable
export class VectorKnowledgeBase extends KnowledgeBaseBase implements IVectorKnowledgeBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.VectorKnowledgeBase';

  /**
   * Return whether the given object is a `VectorKnowledgeBase`.
   */
  public static isVectorKnowledgeBase(x: any): x is VectorKnowledgeBase {
    return x !== null && typeof x === 'object' && VECTOR_KNOWLEDGE_BASE_SYMBOL in x;
  }

  /**
   * Reference an existing vector knowledge base by ARN.
   */
  public static fromVectorKnowledgeBaseArn(scope: Construct, id: string, vectorKnowledgeBaseArn: string): IVectorKnowledgeBase {
    return VectorKnowledgeBase.fromVectorKnowledgeBaseAttributes(scope, id, { knowledgeBaseArn: vectorKnowledgeBaseArn });
  }

  /**
   * Reference an existing vector knowledge base by ID.
   *
   * The knowledge base is assumed to be in the same account and region as the scope.
   */
  public static fromVectorKnowledgeBaseId(scope: Construct, id: string, vectorKnowledgeBaseId: string): IVectorKnowledgeBase {
    return VectorKnowledgeBase.fromVectorKnowledgeBaseAttributes(scope, id, {
      knowledgeBaseArn: knowledgeBaseArnFromId(scope, vectorKnowledgeBaseId),
    });
  }

  /**
   * Reference an existing vector knowledge base by its attributes.
   */
  public static fromVectorKnowledgeBaseAttributes(scope: Construct, id: string, attrs: VectorKnowledgeBaseAttributes): IVectorKnowledgeBase {
    class Import extends KnowledgeBaseBase implements IVectorKnowledgeBase {
      public readonly knowledgeBaseArn = attrs.knowledgeBaseArn;
      public readonly knowledgeBaseId = Stack.of(scope).splitArn(attrs.knowledgeBaseArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly type = KnowledgeBaseType.VECTOR;
      public readonly role = attrs.role;
      public readonly grantPrincipal: iam.IPrincipal = attrs.role?.grantPrincipal ?? new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id, { environmentFromArn: attrs.knowledgeBaseArn });
  }

  public readonly knowledgeBaseArn: string;
  public readonly knowledgeBaseId: string;

  public readonly type = KnowledgeBaseType.VECTOR;
  /**
   * The service role that Amazon Bedrock assumes to operate the knowledge base.
   *
   * Always defined for knowledge bases created with this construct.
   */
  public readonly role?: iam.IRoleRef;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The model used to create vector embeddings for the knowledge base.
   */
  public readonly embeddingsModel: BedrockFoundationModel;

  /**
   * The data type of the vector embeddings, if specified.
   */
  public readonly vectorType?: VectorType;

  constructor(scope: Construct, id: string, props: VectorKnowledgeBaseProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    Object.defineProperty(this, VECTOR_KNOWLEDGE_BASE_SYMBOL, { value: true });

    validateCommonKnowledgeBaseProps(this, props);

    this.embeddingsModel = props.embeddingsModel;
    this.vectorType = props.vectorType;
    const role: iam.IRoleRef & iam.IGrantable = props.role ?? createKnowledgeBaseServiceRole(this);
    this.role = role;
    this.grantPrincipal = role.grantPrincipal;

    const resource = new CfnKnowledgeBase(this, 'Resource', {
      name: props.knowledgeBaseName ?? Names.uniqueResourceName(this, { maxLength: 100 }),
      description: props.description,
      roleArn: role.roleRef.roleArn,
      knowledgeBaseConfiguration: { type: KnowledgeBaseType.VECTOR },
      tags: props.tags,
    });

    resource.with(new KnowledgeBaseEmbeddingsModel({ embeddingsModel: props.embeddingsModel, vectorType: props.vectorType, role }));
    props.vectorStore._bind(resource, role);
    if (props.supplementalDataStorageBucket !== undefined) {
      resource.with(new KnowledgeBaseSupplementalDataStorage({ bucket: props.supplementalDataStorageBucket, role }));
    }

    this.knowledgeBaseArn = resource.attrKnowledgeBaseArn;
    this.knowledgeBaseId = resource.attrKnowledgeBaseId;
  }
}
