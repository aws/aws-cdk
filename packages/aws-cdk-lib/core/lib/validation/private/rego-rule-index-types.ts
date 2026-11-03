/**
 * Which resource types each default rule applies to.
 */
export interface RegoRuleIndex {
  readonly rules: Array<RuleIndexEntry>;
}

export interface RuleIndexEntry {
  /** File name of the rule, relative to the rules directory. */
  readonly file: string;

  /**
   * Resource types this rule can fire on, or `null` if it applies to every
   * template.
   */
  readonly types: string[] | null;
}
