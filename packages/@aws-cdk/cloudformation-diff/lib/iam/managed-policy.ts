export class ManagedPolicyAttachment {
  public constructor(public readonly identityArn: string, public readonly managedPolicyArn: string) {}

  public equal(other: ManagedPolicyAttachment) {
    return this.identityArn === other.identityArn
        && this.managedPolicyArn === other.managedPolicyArn;
  }

  public toJson() {
    return { identityArn: this.identityArn, managedPolicyArn: this.managedPolicyArn };
  }
}

export interface ManagedPolicyJson {
  identityArn: string;
  managedPolicyArn: string;
}

export function parseManagedPolicies(identityArn: string, arns: string[]): ManagedPolicyAttachment[] {
  return arns.map((arn: string) => new ManagedPolicyAttachment(identityArn, arn));
}
