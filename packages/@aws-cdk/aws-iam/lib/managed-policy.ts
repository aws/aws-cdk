import { IResolveContext, Lazy, Stack } from '@aws-cdk/cdk';

/**
 * A managed policy
 */
export interface IManagedPolicy {
  /**
   * The ARN of the managed policy
   */
  readonly managedPolicyArn: string;
}

/**
 * Managed policy
 *
 * This class is an incomplete placeholder class, and exists only to get access
 * to AWS Managed policies.
 */
export class ManagedPolicy {
  /**
   * Construct a managed policy from one of the policies that AWS manages
   *
   * For this managed policy, you only need to know the name to be able to use it.
   *
   * Some managed policy names start with "service-role/", some start with
   * "job-function/", and some don't start with anything. Do include the
   * prefix when constructing this object.
   */
  public static fromAwsManagedPolicyName(managedPolicyName: string): IManagedPolicy {
    class AwsManagedPolicy implements IManagedPolicy {
      public readonly managedPolicyArn = Lazy.stringValue({
        produce(ctx: IResolveContext) {
          return Stack.of(ctx.scope).formatArn({
            service: "iam",
            region: "", // no region for managed policy
            account: "aws", // the account for a managed policy is 'aws'
            resource: "policy",
            resourceName: managedPolicyName
          });
        }
      });
    }
    return new AwsManagedPolicy();
  }

  protected constructor() {
  }
}
