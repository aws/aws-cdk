/**
 * Limit the delegation grant to a set of domain names using the IAM
 * `route53:ChangeResourceRecordSetsNormalizedRecordNames` context key.
 */
export abstract class DelegationGrantNames {
  /**
   * Match the domain names using the IAM `StringEquals` condition.
   *
   * @param names List of allowed record names.
   */
  public static ofEquals(...names: string[]): DelegationGrantNames {
    return new (class extends DelegationGrantNames {
      public _equals() {
        return names;
      }
    })();
  }

  /**
   * Match the domain names using the IAM `StringLike` condition.
   *
   * @param names List of allowed record names.
   */
  public static ofLike(...names: string[]): DelegationGrantNames {
    return new (class extends DelegationGrantNames {
      public _like() {
        return names;
      }
    })();
  }

  /**
   * @internal
   */
  public _equals(): string[] | null {
    return null;
  }

  /**
   * @internal
   */
  public _like(): string[] | null {
    return null;
  }
}
