export class ManagedPolicyAttachment {
  public static parseManagedPolicies(identityArn: string, arns: string | string[]): ManagedPolicyAttachment[] {
    return typeof arns === 'string'
      ? [new ManagedPolicyAttachment(identityArn, arns)]
      : arns.map((arn: string) => new ManagedPolicyAttachment(identityArn, arn));
  }

  constructor(public readonly identityArn: string, public readonly managedPolicyArn: string) {
  }

  public equal(other: ManagedPolicyAttachment): boolean {
    return this.identityArn === other.identityArn
        && this.managedPolicyArn === other.managedPolicyArn;
  }

  /**
   * Return a machine-readable version of the changes.
   * This is only used in tests.
   *
   * @internal
   */
  public _toJson(): ManagedPolicyJson {
    return { identityArn: this.identityArn, managedPolicyArn: this.managedPolicyArn };
  }
}

export interface ManagedPolicyJson {
  identityArn: string;
  managedPolicyArn: string;
}
