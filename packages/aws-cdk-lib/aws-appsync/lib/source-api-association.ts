import { Construct } from 'constructs';
import { CfnSourceApiAssociation } from './appsync.generated';
import { IGraphqlApi } from './graphqlapi-base';
import { Effect, IRole, PolicyStatement } from '../../aws-iam';

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
  readonly mergedApiExecutionRole?: IRole;

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
   * The merged api in the association.
   */
  public readonly mergedApi: IGraphqlApi;

  /**
   * The source api in the association.
   */
  public readonly sourceApi: IGraphqlApi;

  /**
  * The merge type for the source api association.
  */
  private readonly mergeType: MergeType;

  /**
  * The merged api execution role for attaching the access policy.
  */
  private readonly mergedApiExecutionRole?: IRole;

  constructor(scope: Construct, id: string, props: SourceApiAssociationProps) {
    super(scope, id);

    this.mergeType = props.mergeType ?? MergeType.AUTO_MERGE;
    this.mergedApiExecutionRole = props.mergedApiExecutionRole;
    this.sourceApi = props.sourceApi;
    this.mergedApi = props.mergedApi;

    this.association = new CfnSourceApiAssociation(this, 'Resource', {
      sourceApiIdentifier: this.sourceApi.arn,
      mergedApiIdentifier: this.mergedApi.arn,
      sourceApiAssociationConfig: {
        mergeType: this.mergeType,

      },
      description: props.description,
    });

    // Add permissions to the merged api execution role if it was passed in.
    if (this.mergedApiExecutionRole) {
      addSourceGraphQLPermission(this.association, this.mergedApiExecutionRole);
      if (this.mergeType === MergeType.AUTO_MERGE) {
        addSourceApiAutoMergePermission(this.association, this.mergedApiExecutionRole);
      }
    }
  }
}

/**
* Adds an IAM permission to the Merged API execution role for GraphQL access on the source AppSync api.
*
* @param sourceApiAssociation The CfnSourceApiAssociation resource which to add a permission to access at runtime.
* @param mergedApiExecutionRole The merged api execution role on which to add the permission.
*/
export function addSourceGraphQLPermission(sourceApiAssociation: CfnSourceApiAssociation, mergedApiExecutionRole: IRole) {
  return mergedApiExecutionRole.addToPrincipalPolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['appsync:SourceGraphQL'],
    resources: [sourceApiAssociation.attrSourceApiArn, sourceApiAssociation.attrSourceApiArn.concat('/*')],
  }));
}

/**
* Adds an IAM permission to the Merged API execution role for automatically merging the source API metadata whenever
* the source API is updated.
* @param sourceApiAssociation The CfnSourceApiAssociation resource which to add permission to perform merge operations on.
* @param mergedApiExecutionRole The merged api execution role on which to add the permission.
*/
export function addSourceApiAutoMergePermission(sourceApiAssociation: CfnSourceApiAssociation, mergedApiExecutionRole: IRole) {
  return mergedApiExecutionRole.addToPrincipalPolicy(new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['appsync:StartSchemaMerge'],
    resources: [sourceApiAssociation.attrAssociationArn],
  }));
}