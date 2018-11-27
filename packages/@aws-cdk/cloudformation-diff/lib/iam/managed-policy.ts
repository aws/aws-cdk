export class ManagedPolicyAttachment {
  constructor(public readonly identityArn: string, public readonly managedPolicyArn: string) {
  }

  public equal(other: ManagedPolicyAttachment) {
    return this.identityArn === other.identityArn
        && this.managedPolicyArn === other.managedPolicyArn;
  }
}

export function parseManagedPolicies(identityArn: string, arns: string[]): ManagedPolicyAttachment[] {
  return arns.map((arn: string) => new ManagedPolicyAttachment(identityArn, arn));
}