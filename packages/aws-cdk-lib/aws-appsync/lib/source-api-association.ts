import { Construct } from 'constructs';
import { CfnSourceApiAssociation } from './appsync.generated';
import { IGraphqlApi } from './graphqlapi-base';
import { Effect, IRole, PolicyStatement } from '../../aws-iam';
import { FeatureFlags } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Merge type used to associate the source API
 */
export enum MergeType {
  /**
  * Manual merge. The merge must be triggered manually when the source API has changed.
  */
  MANUAL_MERGE = 'MANUAL_MERGE',

  /**
  * Auto merge. The merge is triggered automatically when the source API has changed.
  */
  AUTO_MERGE = 'AUTO_MERGE',
}

/**
* Properties for SourceApiAssociation which associates an AppSync Source API with an AppSync Merged API
*/
export interface SourceApiAssociationProps {

  /**
   * The source api to associate.
   */
  readonly sourceApi: IGraphqlApi;

  /**
   * The merged api to associate.
   */
  readonly mergedApi: IGraphqlApi;

  /**
   * The merged api execution role for adding the access policy for the source api.
   */
  readonly mergedApiExecutionRole: IRole;

  /**
   * The merge type for the source
   *
   * @default - MANUAL_MERGE
   */
  readonly mergeType?: MergeType;

  /**
   * The description of the source api association
   *
   * @default - None
   */
  readonly description?: string;
}

/**
 * AppSync SourceApiAssociation which associates an AppSync source API to an AppSync Merged API.
 * The initial creation of the SourceApiAssociation merges the source API into the Merged API schema.
 */
export class SourceApiAssociation extends Construct {

  /**
  * The underlying CFN source api association resource.
  */
  public readonly association: CfnSourceApiAssociation;

  /**
  * The merge type for the source api association.
  */
  private readonly mergeType: MergeType;

  /**
  * The merged api execution role for attaching the access policy.
  */
  private readonly mergedApiExecutionRole: IRole;

  constructor(scope: Construct, id: string, props: SourceApiAssociationProps) {
    super(scope, id);

    this.mergeType = props.mergeType ?? MergeType.AUTO_MERGE;
    this.mergedApiExecutionRole = props.mergedApiExecutionRole;

    var sourceApiIdentifier = props.sourceApi.apiId;
    var mergedApiIdentifier = props.mergedApi.apiId;

    if (FeatureFlags.of(scope).isEnabled(cxapi.APPSYNC_ENABLE_USE_ARN_IDENTIFIER_SOURCE_API_ASSOCIATION)) {
      sourceApiIdentifier = props.sourceApi.arn;
      mergedApiIdentifier = props.mergedApi.arn;
    }

    this.association = new CfnSourceApiAssociation(this, 'Resource', {
      sourceApiIdentifier: sourceApiIdentifier,
      mergedApiIdentifier: mergedApiIdentifier,
      sourceApiAssociationConfig: {
        mergeType: this.mergeType,

      },
      description: props.description,
    });

    this.addSourceGraphQLAccessPolicy();
    this.addSourceApiMergeAccessPolicy();
  }

  private isAutoMerge() {
    return this.mergeType == MergeType.AUTO_MERGE;
  }

  /**
  * Adds an IAM permission for SourceGraphQL access on the source AppSync api to the mergedApiExecutionRole if present.
  */
  private addSourceGraphQLAccessPolicy() {
    this.mergedApiExecutionRole.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['appsync:SourceGraphQL'],
      resources: [this.association.attrSourceApiArn, this.association.attrSourceApiArn.concat('/*')],
    }));
  }

  /**
  * Adds an IAM permission for automatically merging the source API metadata whenever the source API is updated to the mergedApiExecutionRole if present.
  */
  private addSourceApiMergeAccessPolicy() {
    if (this.isAutoMerge()) {
      this.mergedApiExecutionRole.addToPrincipalPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['appsync:StartSchemaMerge'],
        resources: [this.association.attrAssociationArn],
      }));
    }
  }
}
