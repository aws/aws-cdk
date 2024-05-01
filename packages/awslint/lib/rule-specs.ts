/**
 * Caches the list of rule filters that are specified in the include and exclude options in awslint.json.
 */
export class RuleFilterSet {
  /**
   * Rule filter format is code:scope e.g. 'docs-public-apis:aws-cdk-lib.TagType'.
   * Wildcards can be used in the following ways:
   *
   * 1. Match any code e.g.: '*:aws-cdk-lib.TagType'
   * 2. Match any scope e.g.: 'docs-public-apis:*'
   * 3. Match any scope prefix e.g.: 'docs-public-apis:aws-cdk-lib.Tag*'
   */

  private codesToScopes = new Map<string, Set<string>>(); // code -> list of scopes

  private codesToScopePrefixes = new Map<string, Set<string>>(); // code -> list of scope prefixes (wildcards)

  private scopes = new Set<string>(); // list of scopes with a wilcard code

  private scopePrefixes = new Set<string>(); // list of scope prefixes with a wildcard code

  private _isEmpty: boolean = false;

  constructor(ruleFilterList: string[]) {
    if (!ruleFilterList || ruleFilterList.length == 0) {
      this._isEmpty = true;
    }

    for (var filter of ruleFilterList) {
      if (filter.indexOf(':') === -1) {
        filter += ':*'; // add "*" scope filter if there isn't one
      }

      const [code, scope] = filter.split(':');

      if (this.hasWildcard(code)) {
        if (code.length > 1) {
          throw new Error(`Error parsing rule filter ${filter}: rule code can only be a single wildcard, or a complete string.`);
        } else {
          if (this.hasWildcard(scope)) {
            this.scopePrefixes.add(scope);
          } else {
            this.scopes.add(scope);
          }
        }
      } else {
        if (this.hasWildcard(scope)) {
          this.addToMap(this.codesToScopePrefixes, code, scope);
        } else {
          this.addToMap(this.codesToScopes, code, scope);
        }
      }
    }
  }

  public matches(code: string, scope: string) {
    // Check complete filter
    const completeScopes = this.codesToScopes.get(code);
    if (completeScopes && completeScopes.has(scope)) {
      return true;
    }

    // Check if scope matches a prefix e.g. 'docs-public-apis:aws-cdk-lib.Tag*'
    const scopePrefixesForCode = this.codesToScopePrefixes.get(code);
    if (scopePrefixesForCode) {
      if (this.containsPrefix(scopePrefixesForCode, scope)) {
        return true;
      }
    }

    // Check if scope has a wildcard code e.g. '*:aws-cdk-lib.TagType'
    if (this.scopes.has(scope)) {
      return true;
    }

    // Check if scope matches a prefix with a wildcard code e.g. '*:aws-cdk-lib.TagType*'
    if (this.containsPrefix(this.scopePrefixes, scope)) {
      return true;
    }

    return false;
  }

  private containsPrefix(prefixes: Set<string>, value: string) {
    for (const prefix of prefixes) {
      const prefixStr = prefix.slice(0, -1); // Strip the asterisk
      if (value.startsWith(prefixStr)) {
        return true;
      }
    }

    return false;
  }

  public isEmpty() {
    return this._isEmpty;
  }

  private addToMap(map: Map<string, Set<string>>, code: string, scope: string) {
    if (!map.has(code)) {
      map.set(code, new Set<string>());
    }

    map.get(code)?.add(scope);
  }

  private hasWildcard(value: string) {
    return value.indexOf('*') !== -1;
  }
}