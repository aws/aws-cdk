import type { IInstanceRef } from '../../interfaces/generated/aws-sso-interfaces.generated';

/**
 * How users sign in to a CloudWatch Omni domain.
 */
export class IdentityProvider {
  /**
   * Sign-in with IAM users and roles.
   */
  public static readonly IAM = new IdentityProvider('IAM');

  /**
   * Sign-in through IAM Identity Center.
   *
   * Requires an Identity Center instance on the domain.
   */
  public static readonly IDC = new IdentityProvider('IDC');

  /**
   * An identity provider without a static member, for providers the service adds later.
   *
   * @param value the CloudFormation `IdentityProviders` value
   */
  public static of(value: string): IdentityProvider {
    return new IdentityProvider(value);
  }

  private constructor(
    /**
     * The CloudFormation `IdentityProviders` value.
     */
    public readonly value: string,
  ) {}
}

/**
 * The IAM Identity Center instance that a CloudWatch Omni domain uses for sign-in.
 */
export abstract class IdentityCenterInstance {
  /**
   * An Identity Center instance given by its ARN.
   *
   * @param instanceArn the ARN of the instance, for example `arn:aws:sso:::instance/ssoins-1a2b3c4d5e6f7a8b`
   */
  public static fromInstanceArn(instanceArn: string): IdentityCenterInstance {
    return new class extends IdentityCenterInstance {
      public readonly instanceArn = instanceArn;
    }();
  }

  /**
   * An Identity Center instance given by a reference, such as an L1 `CfnInstance`.
   *
   * @param instance the instance reference
   */
  public static fromInstance(instance: IInstanceRef): IdentityCenterInstance {
    return IdentityCenterInstance.fromInstanceArn(instance.instanceRef.instanceArn);
  }

  /**
   * The ARN of the instance.
   */
  public abstract readonly instanceArn: string;
}
