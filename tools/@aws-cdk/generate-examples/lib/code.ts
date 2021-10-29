import * as reflect from 'jsii-reflect';

export interface Assumption {
  readonly type: reflect.Type;
  readonly variableName: string;
}

export class Code {
  public static concatAll(...xs: Array<Code | string>): Code {
    return xs.map(Code.force).reduce((a, b) => a.append(b), new Code(''));
  }

  public static force(x: Code | string): Code {
    if (x instanceof Code) {
      return x;
    }
    return new Code(x);
  }

  constructor(public readonly code: string, public readonly declarations: Assumption[] = []) {
  }

  public append(rhs: Code | string) {
    if (typeof rhs === 'string') {
      return new Code(this.code + rhs, this.declarations);
    }

    const declarations = [...this.declarations, ...rhs.declarations].filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    return new Code(this.code + rhs.code, declarations);
  }

  public render(separator = '\n') {
    return (this.makeVariableDeclarations().join('\n') + separator + this.code).trimStart();
  }

  public toString() {
    return this.render();
  }

  // FIXME: no need, just one variable for each
  private makeVariableDeclarations(): string[] {
    return this.declarations.map(declaration =>
      `declare const ${declaration.variableName}: ${module(declaration.type).importName}.${declaration.type.name};\n`,
    );
  }
}

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
}

function module(type: reflect.Type): ImportedModule {
  // FIXME: Needs to be submodule-aware for v2
  const parts = type.assembly.name.split('/');

  const nonNamespacedPart = parts[1] ?? parts[0];
  return {
    importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
    moduleName: type.assembly.name,
  };
}
