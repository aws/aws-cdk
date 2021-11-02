import * as reflect from 'jsii-reflect';

/**
 * Customary module import names that differ from what would be automatically generated.
 */
const SPECIAL_IMPORT_NAMES: Record<string, string> = {
  '@aws-cdk/core': 'cdk',
  '@aws-cdk/aws-applicationautoscaling': 'appscaling',
  '@aws-cdk/aws-elasticloadbalancing': 'elb',
  '@aws-cdk/aws-elasticloadbalancingv2': 'elbv2',
};

interface Declaration {
  readonly type: reflect.Type;
  readonly name: string;
  equals: (rhs: Declaration) => boolean;
  render: () => string;
}

/**
 * An Import statement that will get rendered at the top of the code snippet.
 */
export class Import implements Declaration {
  public static sort(imports: Import[]) {
    imports.sort(Import.compare);
  }

  /**
   * Returns 0 if lhs === rhs, -1 if lhs < rhs, and 1 if lhs > rhs.
   */
  public static compare(lhs: Import, rhs: Import): number {
    return module(lhs.type).moduleName.localeCompare(module(rhs.type).moduleName);
  }

  readonly name: string;
  public constructor(readonly type: reflect.Type) {
    this.name = type.name;
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  public render(): string {
    const { importName, moduleName } = module(this.type);
    return `import * as ${importName} from '${moduleName}';`;
  }
}

/**
 * A declared constant that will be rendered at the top of the code snippet after the imports.
 */
export class Assumption {
  public static sort(assumptions: Assumption[]) {
    assumptions.sort(Assumption.compare);
  }

  /**
   * Returns 0 if lhs === rhs, -1 if lhs < rhs, and 1 if lhs > rhs.
   */
  public static compare(lhs: Assumption, rhs: Assumption): number {
    return lhs.name.localeCompare(rhs.name);
  }

  public constructor(readonly type: reflect.Type, readonly name: string) {}

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  public render(): string {
    return `declare const ${this.name}: ${module(this.type).importName}.${this.type.name};`;
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

  // FIXME: what to do about IXxx interfaces? interface type that is not a datatype
  /**
   * Renders variable declarations. Assumes that there are no duplicates in the declarations.
   */
  private renderDeclarations(): string[] {
    const { imports, assumptions } = splitDeclarations(deduplicate(this.declarations));
    Assumption.sort(assumptions);
    Import.sort(imports);
    // Add separator only if necessary
    if (imports.length > 0 && assumptions.length > 0) {
      return [...imports.map((d) => d.render()), '', ...assumptions.map((a) => a.render())];
    }
    return [...imports.map((d) => d.render()), ...assumptions.map((a) => a.render())];
  }
}

function splitDeclarations(declarations: Declaration[]): { imports: Import[], assumptions: Assumption[] } {
  const imports: Import[] = [];
  const assumptions: Assumption[] = [];
  for (const declaration of declarations) {
    if (declaration instanceof Import) {
      imports.push(declaration);
    } else {
      assumptions.push(declaration);
    }
  }
  return { imports, assumptions };
}

// FIXME: O(n^2) time in the worst case, could be improved?
/**
 * Deduplicates an array of Declarations.
 */
function deduplicate(declarations: Declaration[]): Declaration[] {
  return declarations.filter((v, i, a) => a.findIndex(t => t.equals(v)) === i);
}

/**
 * Parses the given type for human-readable information on the module
 * that the type is from. Meant to serve as a single source of truth
 * for parsing the type for module information.
 */
export function module(type: reflect.Type): ImportedModule {
  // FIXME: Needs to be submodule-aware for v2
  const parts = type.assembly.name.split('/');
  const nonNamespacedPart = SPECIAL_IMPORT_NAMES[type.assembly.name] ?? parts[1] ?? parts[0];
  return {
    importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
    moduleName: type.assembly.name,
  };
}