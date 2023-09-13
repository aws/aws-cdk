import { Construct } from 'constructs';
import { CfnSourceApiAssociation } from './appsync.generated';
import { IGraphqlApi } from './graphqlapi-base';
import { Effect, Role, PolicyStatement } from '../../aws-iam';

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
  readonly sourceApi?: IGraphqlApi;

  /**
     * The identifier (API ID or API ARN) for the Source API
     */
  readonly sourceApiIdentifier?: string;

  /**
     * The merged api to associate.
     */
  readonly mergedApi?: IGraphqlApi;

  /**
     * The identifier (API ID or API ARN) for the Merged API
     */
  readonly mergedApiIdentifier?: string;

  /**
    * The merged api execution role for adding the access policy for the source api.
    */
  readonly mergedApiExecutionRole?: Role;

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
     * This parameter is optional and if not provided, the access policy will need to be defined elsewhere on the merged api role.
     */
  private readonly mergedApiExecutionRole?: Role;

  constructor(scope: Construct, id: string, props: SourceApiAssociationProps) {
    super(scope, id);

    if (!props.sourceApi && !props.sourceApiIdentifier) {
      throw new Error('Cannot determine the source AppSync API to associate. Must specify the sourceApi or sourceApiIdentifier');
    }

    if (!props.mergedApi && !props.mergedApiIdentifier) {
      throw new Error('Cannot determine the AppSync Merged API to associate. Must specify the mergedApi or mergedApiIdentifier');
    }

    this.mergeType = props.mergeType ?? MergeType.AUTO_MERGE;
    this.mergedApiExecutionRole = props.mergedApiExecutionRole;
    this.association = new CfnSourceApiAssociation(this, 'Resource', {
      sourceApiIdentifier: props.sourceApi ? props.sourceApi.apiId : props.sourceApiIdentifier,
      mergedApiIdentifier: props.mergedApi ? props.mergedApi.apiId : props.mergedApiIdentifier,
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
    if (this.mergedApiExecutionRole != null) {
      this.mergedApiExecutionRole.addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['appsync:SourceGraphQL'],
        resources: [this.association.attrSourceApiArn, this.association.attrSourceApiArn.concat('/*')],
      }));
    }
  }

  /**
     * Adds an IAM permission for automatically merging the source API metadata whenever the source API is updated to the mergedApiExecutionRole if present.
     */
  private addSourceApiMergeAccessPolicy() {
    if (this.mergedApiExecutionRole != null && this.isAutoMerge()) {
      this.mergedApiExecutionRole.addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['appsync:StartSchemaMerge'],
        resources: [this.association.attrAssociationArn],
      }));
    }
  }
}
