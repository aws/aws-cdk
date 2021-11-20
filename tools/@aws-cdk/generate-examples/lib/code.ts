import { Declaration } from './declaration';
import { sortBy } from './utils';

/**
 * Information on a segment of code and the declarations necessary to make the code valid.
 */
export class Code {
  public static concatAll(...xs: Array<Code | string>): Code {
    return xs.map(Code.force).reduce((a, b) => a.append(b), new Code(''));
  }

  private static force(x: Code | string): Code {
    if (x instanceof Code) {
      return x;
    }
    return new Code(x);
  }

  /**
   * Construct a Code, consisting of a code fragment and a list of declarations that are meant
   * to be rendered at the top of the code snippet.
   */
  constructor(public readonly code: string, public readonly declarations: Declaration[] = []) {
  }

  /**
   * Appends and returns a new Code that safely combines two code fragments along
   * with their declarations.
   */
  public append(rhs: Code | string): Code {
    if (typeof rhs === 'string') {
      return new Code(this.code + rhs, this.declarations);
    }

    return new Code(this.code + rhs.code, [...this.declarations, ...rhs.declarations]);
  }

  public toString() {
    return this.render();
  }

  private render(separator = '\n\n') {
    return (this.renderDeclarations().join('\n') + separator + this.code).trimStart();
  }

  /**
   * Renders variable declarations. Assumes that there are no duplicates in the declarations.
   */
  public renderDeclarations(): string[] {
    sortBy(this.declarations, (d) => d.sortKey);
    const decs = deduplicate(this.declarations);
    // Add separator only if necessary
    const decStrings = [...decs.map((d) => d.render())];
    // only supports two groups and not more
    for (let i = 0; i < decs.length-1; i++) {
      if (decs[i].sortKey[0] !== decs[i+1].sortKey[0]) {
        decStrings.splice(i+1, 0, '');
        break;
      }
    }
    return decStrings;
  }

  public renderCode(): string {
    return this.code;
  }
}

/**
 * Deduplicates a sorted array of Declarations.
 */
function deduplicate(declarations: Declaration[]): Declaration[] {
  if (declarations.length === 0) { return declarations; }

  const newDeclarations: Declaration[] = [];
  newDeclarations.push(declarations[0]);
  for (let i = 1; i < declarations.length; i++) {
    if (!declarations[i].equals(declarations[i-1])) {
      newDeclarations.push(declarations[i]);
    }
  }
  return newDeclarations;
}
