import * as reflect from 'jsii-reflect';

interface Declaration {
  readonly type: reflect.Type;
  readonly name: string;
  equals: (rhs: Declaration) => boolean;
  render: () => string;
  sort: () => void;
}

export class Import implements Declaration {
  public constructor(readonly type: reflect.Type, readonly name: string) {}

  public render(): string {
    const { importName, moduleName } = module(this.type);
    return `import * as ${importName} from ${moduleName};`;
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  // FIXME: add sort method
  public sort(): void {
    return;
  }
}

/**
 * Information for a declaration that must exist at the top of the code sample
 * that is necessary for the code sample to compile.
 */
export class Assumption {
  public constructor(readonly type: reflect.Type, readonly name: string) {}

  public render(): string {
    return `declare const ${this.name}: ${module(this.type).importName}.${this.type.name};`;
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  // FIXME: add sort method
  public sort(): void {
    return;
  }
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

  // FIXME: what to do about IXxx interfaces?
  /**
   * Renders variable declarations. Assumes that there are no duplicates in the declarations.
   */
  private renderDeclarations(): string[] {
    return deduplicate(this.declarations).map((d) => d.render());
  }
}

function deduplicate(declarations: Declaration[]): Declaration[] {
  return declarations.filter((v, i, a) => a.findIndex(t => t.equals(v)) === i);
}

/**
 * Parses the given type for human-readable information on the module
 * that the type is from.
 */
function module(type: reflect.Type): ImportedModule {
  // FIXME: Needs to be submodule-aware for v2
  const parts = type.assembly.name.split('/');

  const nonNamespacedPart = parts[1] ?? parts[0];
  return {
    importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
    moduleName: type.assembly.name,
  };
}