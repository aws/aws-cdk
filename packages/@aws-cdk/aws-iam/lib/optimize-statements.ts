/**
 * Optimizes a list of objects containing IAM policy statements in order to reduce the total size of the rendered JSON
 * object. The following optimizations are performed:
 * - Canonicalization of globs in (Not)Resource & (Not)Action: removal entries that are matched by another entry's glob
 * - De-duplication: removal of statements that have no SID, and are subsets of another statement
 * - Merging: merging of statements that have no SID, and differ only in either ``Resource``
 *
 * Additionally, normalization is performed:
 * - (Not)Resource & (Not)Action are sorted in alphanumerical order (of the JSON object, if the values are not String)
 *
 * @param statements the list of rendered statements to optimize. Those may contain CloudFormation intrinsics.
 *
 * @returns a list of equivalents (and hopefylly smaller) statements.
 */
export function optimizeStatements(statements: any[]): any[] {
  const parsed = statements.map(statement => new Statement(statement));
  return _deduplicate(parsed).map(statement => statement.toJson());
}

/**
 * A Policy statement, with convenience functions make it easier to de-duplicate, normalize, ...
 */
class Statement implements Deduplicable {
  private readonly sid?: string;

  private readonly effect: 'Allow' | 'Deny';

  private readonly actions: Glob[];
  private readonly resources: Glob[];

  private readonly principal: unknown;

  private readonly condition: { [operator: string]: unknown };

  constructor(statement: any) {
    this.sid = statement.Sid;

    if (statement.Effect !== 'Allow' && statement.Effect !== 'Deny') {
      throw new Error(`Illegal policy statement effect: ${JSON.stringify(statement.Effect)}`);
    }
    this.effect = statement.Effect;

    this.actions = _makeGlobs(statement.Action, false);
    this.resources = _makeGlobs(statement.Resource, true);

    this.principal = statement.Principal || {};

    this.condition = statement.Condition || {};

    function _makeGlobs(expressions: unknown, arnGlob: boolean): Glob[] {
      if (!expressions) { return []; }
      if (!Array.isArray(expressions)) { return _makeGlobs([expressions], arnGlob); }
      return expressions.map(expression => new Glob(expression, arnGlob));
    }
  }

  public subsumes(other: Statement): boolean {
    return this.sid == null
      && this.sid === other.sid
      && this.effect === other.effect
      && _allSuperceded(other.actions, this.actions)
      && _deepEqual(this.condition, other.condition)
      && _deepEqual(this.principal, other.principal);
  }

  public merge(other: Statement): this {
    this.actions.push(...other.actions);
    this.resources.push(...other.resources);
    return this;
  }

  /**
   * @returns the "optimized" object to be inlined in the IAM policy document.
   */
  public toJson(): any {
    const result: any = { Effect: this.effect };
    if (this.sid) { result.Sid = this.sid; }
    if (!_blank(this.actions)) { result.Action = _flatten(this.actions); }
    if (!_blank(this.resources.length)) { result.Resource = _flatten(this.resources); }
    if (!_blank(this.principal)) { result.Principal = _flattenPrincipal(this.principal); }
    if (!_blank(this.condition)) { result.Condition = this.condition; }
    return result;

    /**
     * Determines whether a value is "blank" for the context of a policy entry.
     * @param value the value to be checked.
     * @returns ``true`` if the ``value`` is ``null``, ``undefined``, an empty array or an empty object.
     */
    function _blank(value: unknown): boolean {
      if (value == null) { return true; }
      if (Array.isArray(value)) { return value.length === 0; }
      return typeof value === 'object' && Object.keys(value as object).length === 0;
    }

    /**
     * Removes duplicates from a glob list, and returns the shortest IAM expression for the value.
     * @param globs the list of globs to be flattened.
     * @returns the smallest entity to represent all the globs.
     */
    function _flatten(globs: Glob[]): any {
      const expressions = _deduplicate(globs).map(glob => glob.expression);
      if (expressions.length === 0) { return undefined; }
      if (expressions.length === 1) { return expressions[0]; }
      return expressions.sort(_compare);

      /**
       * Function to sort items alphanumerically, that works also when items are not strings.
       * @param a the left value to compare
       * @param b the right value to compare
       * @returns the result of the comparison
       */
      function _compare(a: unknown, b: unknown): number {
        return _asString(a).localeCompare(_asString(b));

        function _asString(value: unknown): string {
          if (typeof value === 'string') { return value; }
          return JSON.stringify(value);
        }
      }
    }

    /**
     * Reduces a principal to it's most compact expression.
     * @param principal the principal to be compacted.
     * @returns the most compact expression of the principal.
     */
    function _flattenPrincipal(principal: any): any {
      if (typeof principal !== 'object') { return principal; }
      const compact: any = {};
      for (const key of Object.keys(principal)) {
        const value = principal[key];
        if (Array.isArray(value)) {
          if (value.length === 0) { continue; }
          if (value.length === 1) { compact[key] = value[0]; }
        } else {
          compact[key] = value;
        }
      }
      if (_deepEqual(compact, { AWS: '*' })) { return '*'; }
      return compact;
    }
  }
}

/**
 * A glob expression, which can be either a string with ``*`` wildcards or a CloudFormation intrinsic.
 */
class Glob implements Deduplicable {
  private regexp?: RegExp;

  /**
   * @param expression the expression from the policy statement.
   * @param arnGlob defines whether globs matches ARNs or not.
   */
  constructor(public expression: unknown, arnGlob: boolean) {
    this.regexp = _toRegExp(this.expression, arnGlob);
  }

  public subsumes(other: Glob): boolean {
    if (!this.regexp || typeof other.expression !== 'string') {
      return _deepEqual(this.expression, other.expression);
    }
    return this.regexp.test(other.expression)
      // Use the shortest expression (** matches what * does, and * is better)
      && (this.expression as string).length <= other.expression.length;
  }

  public merge(_other: Glob): this {
    // Nothing to do - subsumance here means this is a more compact expression of other
    return this;
  }
}

/**
 * Entities that can be de-duplicated
 */
interface Deduplicable {
  /**
   * Checks whether an entity can safely replace another (ie: it is a superset).
   * @param other the other entity to check.
   * @returns ``true`` if this entry supercedes (can safely replace) ``other``.
   */
  subsumes(other: this): boolean;

  /**
   * Merges ``other`` in this entity. It is the caller's responsibility to have
   * verified the safety of doing so by having called ``mergeable`` before.
   * @param other the entity to merge in.
   */
  merge(other: this): this;
}

/**
 * Verifies if a list of entities is entirely covered by another.
 * @param left  a list of de-duplicable entities
 * @param right a list of de-duplicable entities.
 * @returns ``true`` if all entries from ``left`` are superceded by at least one entry from ``right``.
 */
function _allSuperceded<T extends Deduplicable>(left: T[], right: T[]): boolean {
  if (left.length === 0) { return right.length === 0; }
  return left.find(item => right.find(e => e.subsumes(item)) == null) == null;
}

/**
 * Removes duplicate entities from a list.
 * @param array the list to be de-duplciated.
 * @returns a new list containing the minimum set of entities.
 */
function _deduplicate<T extends Deduplicable>(array: T[]): T[] {
  if (array.length <= 1) { return array; }
  const result = [...array];
  for (let i = 0 ; i < result.length ; ) {
    const current = result[i];
    for (let j = i + 1 ; j < result.length ; ) {
      if (result[i].subsumes(result[j])) {
        result[i] = result[i].merge(result.splice(j, 1)[0]);
      } else if (result[j].subsumes(result[i])) {
        result[i] = result.splice(j, 1)[0].merge(result[i]);
      } else {
        j++;
      }
    }
    // If we haven't replaced the current element, we can move on to the next,
    // otherwise we need to re-assess the current element.
    if (current === result[i]) {
      i++;
    }
  }
  return result;
}

/**
 * Checks if two entities are equal.
 * @param e1 one of the entities.
 * @param e2 the other entity.
 * @returns true if both entities are identical.
 */
function _deepEqual(e1: unknown, e2: unknown): boolean {
  if (typeof e1 !== typeof e2) { return false; }
  if (Array.isArray(e1)) {
    if (!Array.isArray(e2)) { return false; }
    if (e1.length !== e2.length) { return false; }
    return e1.find(e => e2.find(c => _deepEqual(e, c)) == null) == null;
  }
  if (typeof e1 === 'object' && typeof e2 === 'object') {
    if (e1 == null || e2 == null) { return e1 === e2; }
    const e1k = Object.keys(e1 as any);
    const e2k = new Set(Object.keys(e2 as any));
    if (e1k.length !== e2k.size) { return false; }
    for (const key of e1k) {
      if (!e2k.has(key)) { return false; }
      if (!_deepEqual((e1 as any)[key], (e2 as any)[key])) { return false; }
    }
    return true;
  }
  return e1 === e2;
}

/**
 * Makes a regular expression from a glob pattern.
 *
 * @param glob a glob pattern that uses '*' to denote wild cards.
 * @param arnGlob defines whether the glob is for ARNs (wild-cards cannot span across segments) or not.
 *
 * @returns ``undefined`` if ``glob`` is not a string, otherwise a ``RegExp`` corresponding to the glob pattern.
 */
function _toRegExp(glob: unknown, arnGlob: boolean): RegExp | undefined {
  if (typeof glob !== 'string') { return undefined; }
  // Special-case for the '*' glob, as it always matches everything.
  if (glob === '*') { return /^.*$/; }
  const parts = glob.split('*');
  return new RegExp('^' + parts.map(_globQuestionMark).join(arnGlob ? '[^:]*' : '.*') + '$');

  function _globQuestionMark(text: string): string {
    if (!arnGlob) { return text; }
    const segments = text.split('?');
    return segments.map(_quote).join('[^:]');
  }

  function _quote(text: string): string {
    // RegExp special characters: \ ^$ . | ? * + ( ) [ ] { }
    return text.replace(/[\\^$.|?*+()[\]{}]/g, '\\$1');
  }
}
