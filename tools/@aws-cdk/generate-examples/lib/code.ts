import * as reflect from 'jsii-reflect';

/**
 * Information for a declaration that must exist at the top of the code sample
 * that is necessary for the code sample to compile.
 */
export interface Assumption {
  readonly type: reflect.Type;
  readonly variableName: string;
}

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
}

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

  constructor(public readonly code: string, public readonly declarations: Assumption[] = []) {
  }

  /**
   * Appends and returns a new Code that safely combines two code fragments along
   * with their declarations.
   */
  public append(rhs: Code | string): Code {
    if (typeof rhs === 'string') {
      return new Code(this.code + rhs, this.declarations);
    }

    const declarations = [...this.declarations, ...rhs.declarations].filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    return new Code(this.code + rhs.code, declarations);
  }

  public toString() {
    return this.render();
  }

  private render(separator = '\n\n') {
    return (this.makeVariableDeclarations().join('\n') + separator + this.code).trimStart();
  }

  // FIXME: what to do about IXxx interfaces?
  private makeVariableDeclarations(): string[] {
    return Array.from(new Set(this.declarations.map(a => a.variableName)))
      .map(variableName =>
        `declare const ${variableName}: ${this.module(this.findDeclarationByName(variableName).type).importName}.${this.findDeclarationByName(variableName).type.name};`,
      );
  }

  /**
   * Returns the first assumption in the array that matches the variable name.
   * Assumes that the variable name exists in the declarations array.
   */
  private findDeclarationByName(variableName: string): Assumption {
    const res = this.declarations.find(a => a.variableName === variableName);
    if (!res) {
      throw new Error(`Variable Name: ${variableName} not in Declaration Array`);
    }
    return res;
  }

  /**
   * Parses the given type for human-readable information on the module
   * that the type is from.
   */
  private module(type: reflect.Type): ImportedModule {
    // FIXME: Needs to be submodule-aware for v2
    const parts = type.assembly.name.split('/');

    const nonNamespacedPart = parts[1] ?? parts[0];
    return {
      importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: type.assembly.name,
    };
  }
}
