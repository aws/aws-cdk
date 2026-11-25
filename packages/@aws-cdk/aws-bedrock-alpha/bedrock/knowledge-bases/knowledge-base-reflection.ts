import { UnscopedValidationError } from 'aws-cdk-lib';
import type { CfnKnowledgeBase, IKnowledgeBaseRef } from 'aws-cdk-lib/aws-bedrock';
import { ConstructReflection, lit } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Provides read-only reflection on the configuration of a Bedrock knowledge base
 * underlying `CfnKnowledgeBase` resource
 *
 * Use `KnowledgeBaseReflection.of()` to obtain an instance from any KnowledgeBase reference.
 * All getters read directly from the L1 resource, providing a single source of
 * truth regardless of whether the knowledge base was created as an L2, imported, or
 * constructed directly as a CfnKnowledgeBase.
 */
export class KnowledgeBaseReflection {
  /**
   * Creates a reflection facade for a knowledge base reference.
   */
  public static of(knowledgeBaseRef: IKnowledgeBaseRef): KnowledgeBaseReflection {
    return new KnowledgeBaseReflection(knowledgeBaseRef);
  }

  private readonly _knowledgeBase?: CfnKnowledgeBase;

  private constructor(private readonly ref: IKnowledgeBaseRef) {
    this._knowledgeBase = ConstructReflection.of(ref).findCfnResource({
      cfnResourceType: 'AWS::Bedrock::KnowledgeBase',
      matches: (cfn: CfnKnowledgeBase) => cfn.knowledgeBaseRef.knowledgeBaseId === ref.knowledgeBaseRef.knowledgeBaseId,
    }) as CfnKnowledgeBase | undefined;
  }

  /**
   * The underlying L1 knowledge base resource.
   *
   * @throws If the underlying CfnKnowledgeBase resource cannot be found.
   */
  public get knowledgeBase(): CfnKnowledgeBase {
    if (this._knowledgeBase === undefined) {
      throw new UnscopedValidationError(lit`CannotFindUnderlyingResource`, `Unable to find underlying resource for ${this.ref.node.path}. Please pass the resource construct directly.`);
    }
    return this._knowledgeBase;
  }
}
