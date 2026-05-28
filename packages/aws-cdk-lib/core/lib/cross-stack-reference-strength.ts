/**
 * Controls how cross-stack references to a resource are resolved.
 */
export enum ReferenceStrength {
  /**
   * Strong reference: uses CloudFormation Export/Import (same region)
   * or ExportWriter/ExportReader custom resources (cross-region).
   *
   * The producing stack cannot be deleted while consumers exist.
   */
  STRONG = 'strong',

  /**
   * Weak reference: uses Fn::GetStackOutput to read an output directly
   * from the producing stack.
   *
   * The producing stack or resource can be deleted independently of consumers.
   * This will cause infrastructure in consuming stacks to temporarily reference a nonexistant
   * resource until the consumers are updated as well, causing any accesses in that time
   * frame to fail.
   *
   * Strong references prevent this.
   */
  WEAK = 'weak',

  /**
   * Both strong and weak mechanisms are created (transitional state).
   *
   * Use this when migrating from strong to weak. The producer keeps the
   * strong-side artifacts and also adds a plain Output. The consumer
   * switches to Fn::GetStackOutput.
   */
  BOTH = 'both',
}
