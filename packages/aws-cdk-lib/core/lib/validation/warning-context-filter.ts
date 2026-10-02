/**
 * Matches the structured context attached to a suppressible warning.
 *
 * A filter is opaque: construct one via the static factory methods on
 * {@link WarningContextFilter}. When several filters are supplied to
 * `Validations.acknowledge({ where: [...] })` they are combined with AND — a
 * warning is suppressed only if every filter matches.
 *
 * This mirrors the `IConstructSelector` abstraction used by Mixins
 * (`core/lib/mixins/selectors.ts`): an opaque predicate produced by named
 * factory methods, so new match sources and operators can be added later as
 * new factories without a breaking change and without a bespoke query DSL.
 */
export interface IWarningContextFilter {
  /**
   * Returns `true` if this filter matches the given warning context.
   *
   * @param context the structured key/value context attached to the warning at
   * its call site. Empty when the warning carries no context — in that case a
   * specific filter never matches, so an undetailed warning can only be
   * acknowledged by an unfiltered acknowledgement.
   */
  matches(context: { [key: string]: string }): boolean;
}

/**
 * Factory for {@link IWarningContextFilter}s used to selectively suppress a
 * subset of a warning id's occurrences via `Validations.acknowledge`.
 *
 * The source of the matched data is encoded in the factory method name, so the
 * abstraction can grow additional axes without changing the `where` array's
 * element type:
 *
 * - {@link WarningContextFilter.callSite} — matches per-occurrence context that
 *   the construct attached at the `addWarning` call site (implemented).
 *
 * Designed-in future axes (not implemented yet), which reuse the Mixins matcher
 * rather than reinventing tree traversal:
 *
 * - `WarningContextFilter.construct(selector: IConstructSelector)` — would match
 *   warnings emitted on constructs selected by a mixins `ConstructSelector`
 *   (e.g. `ConstructSelector.resourcesOfType(...)`), reusing its `select()`
 *   construct-tree traversal directly.
 * - `WarningContextFilter.category(value)` — would match the rule-level
 *   `ruleMetadata.category` intrinsic to a rule, grouping across warning ids.
 */
export class WarningContextFilter {
  /**
   * Matches a warning whose call-site context has `key` set to exactly `value`.
   *
   * Only equality is supported today. Additional operators (e.g. a glob match
   * via `minimatch`, as the mixins `ConstructSelector.byId` does) can be added
   * as further factory methods without breaking existing callers, because the
   * returned type is opaque.
   */
  public static callSite(key: string, value: string): IWarningContextFilter {
    return new CallSiteContextFilter(key, value);
  }

  private constructor() {}
}

class CallSiteContextFilter implements IWarningContextFilter {
  constructor(private readonly key: string, private readonly value: string) {}

  public matches(context: { [key: string]: string }): boolean {
    return context[this.key] === this.value;
  }
}
