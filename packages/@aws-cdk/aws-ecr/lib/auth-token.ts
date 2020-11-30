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
      resources: ['*'],
    }));
  }

  private constructor() {
  }
}