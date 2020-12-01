import * as iam from '@aws-cdk/aws-iam';

/**
 * Authorization token to access ECR repositories via Docker CLI.
 */
export class AuthorizationToken {
  /**
   * Grant access to retrieve an authorization token.
   */
  public static grantRead(grantee: iam.IGrantable) {
    grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ecr:GetAuthorizationToken'],
      // GetAuthorizationToken only allows '*'. See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonelasticcontainerregistry.html#amazonelasticcontainerregistry-actions-as-permissions
      resources: ['*'],
    }));
  }

  private constructor() {
  }
}
