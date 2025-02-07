export type DeploymentMethod = DirectDeploymentMethod | ChangeSetDeploymentMethod;

export interface DirectDeploymentMethod {
  readonly method: 'direct';
}

export interface ChangeSetDeploymentMethod {
  readonly method: 'change-set';

  /**
   * Whether to execute the changeset or leave it in review.
   *
   * @default true
   */
  readonly execute?: boolean;

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   */
  readonly changeSetName?: string;

  /**
   * Indicates if the change set imports resources that already exist.
   *
   * @default false
   */
  readonly importExistingResources?: boolean;
}
