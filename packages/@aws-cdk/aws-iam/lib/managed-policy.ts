import cdk = require('@aws-cdk/cdk');

/**
 * A policy managed by AWS
 *
 * For this managed policy, you only need to know the name to be able to use it.
 *
 * Some managed policy names start with "service-role/", some start with
 * "job-function/", and some don't start with anything. Do include the
 * prefix when constructing this object.
 */
export class AwsManagedPolicy {
  constructor(private readonly managedPolicyName: string) {
  }

  /**
   * The Arn of this managed policy
   */
  public get policyArn(): string {
    // the arn is in the form of - arn:aws:iam::aws:policy/<policyName>
    return cdk.ArnUtils.fromComponents({
      service: "iam",
      region: "", // no region for managed policy
      account: "aws", // the account for a managed policy is 'aws'
      resource: "policy",
      resourceName: this.managedPolicyName
    });
  }
}
