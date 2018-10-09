import cxapi = require('@aws-cdk/cx-api');
import util = require('./util');

export type RenameTable = {[key: string]: string};

/**
 * A class used to maintain a set of rename directives
 */
export class Renames {
  constructor(private readonly renameTable: RenameTable, private readonly defaultRename?: string) {
  }

  /**
   * Check the selected stacks against the renames, to see that they make sense
   *
   * We explicitly don't check that renamed stacks are in the passed set, so
   * that people may use a default rename table  even when only selecting
   * subsets of stacks.
   *
   * We DO check that if there's a default rename (simple syntax) they
   * only selected one stack.
   */
  public validateSelectedStacks(stacks: cxapi.StackId[]) {
    if (this.hasDefaultRename && stacks.length > 1) {
      throw new Error("When selecting multiple stacks, you must use the 'ORIGINALNAME:RENAME' pattern for renames.");
    }
  }

  /**
   * Whether this rename has a single rename that renames any stack
   */
  public get hasDefaultRename() {
    return this.defaultRename != null;
  }

  /**
   * Return the target name for a given stack name
   *
   * Returns either the renamed name or the original name.
   */
  public finalName(name: string): string {
    const rename = this.lookupRename(name);

    if (rename != null) {
      return rename;
    }

    return name;
  }

  private lookupRename(name: string): string | undefined {
    if (this.hasDefaultRename) {
      return this.defaultRename;
    }
    return this.renameTable[name];
  }

}

/**
 * Parse a rename expression string and construct a Renames object from it
 *
 * The rename expression looks like:
 *
 *  [OLD:]NEW[,OLD:NEW[,...]]
 *
 * If there is more than one rename, every entry must have an OLD name.
 */
export function parseRenames(renameExpr: string|undefined): Renames {
  if (renameExpr == null || renameExpr.trim().length === 0) { return new Renames({}); }

  const clauses = renameExpr.split(',');
  if (clauses.length === 1 && clauses[0].indexOf(':') === -1) {
    return new Renames({}, clauses[0]);
  }

  const table = util.makeObject(clauses
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(clause => clause.split(':', 2) as [string, string]));

  return new Renames(table);
}
