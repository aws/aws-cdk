import * as reflect from 'jsii-reflect';

import { Declaration } from './declaration';

/**
 * Customary module import names that differ from what would be automatically generated.
 */
const SPECIAL_IMPORT_NAMES: Record<string, string> = {
  '@aws-cdk/core': 'cdk',
  '@aws-cdk/aws-applicationautoscaling': 'appscaling',
  '@aws-cdk/aws-elasticloadbalancing': 'elb',
  '@aws-cdk/aws-elasticloadbalancingv2': 'elbv2',
};

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
}

/**
 * Options for mutating a code.
 */
interface MutateOptions {
  afterFirstInstanceOf?: string,
  afterLastInstanceOf?: string,
  beforeFirstInstanceOf?: string,
  beforeLastInstanceOf?: string,
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

  public remove(options: MutateOptions): Code {
    if (Object.keys(options).length !== 1) {
      throw new Error('1 and only 1 property in options must be set');
    }

    let beforeInstance = true;
    if (options.afterFirstInstanceOf || options.afterLastInstanceOf) {
      beforeInstance = false;
    }

    let index = -1;
    if (options.beforeFirstInstanceOf || options.afterFirstInstanceOf) {
      index = this.code.indexOf(options.beforeFirstInstanceOf || options.afterFirstInstanceOf!);
    } else {
      index = this.code.lastIndexOf(options.beforeLastInstanceOf || options.afterLastInstanceOf!);
    }
    if (index === -1) {
      return this;
    }

    const [before, after] = this.split(index, beforeInstance);
    return beforeInstance ? after : before;
  }

  public inject(code: Code | string, options: MutateOptions): Code {
    if (Object.keys(options).length !== 1) {
      throw new Error('1 and only 1 property in options must be set');
    }

    let beforeInstance = true;
    if (options.afterFirstInstanceOf || options.afterLastInstanceOf) {
      beforeInstance = false;
    }

    const index = this.code.indexOf(options.afterFirstInstanceOf ??
      options.afterLastInstanceOf ??
      options.beforeFirstInstanceOf ??
      options.beforeLastInstanceOf!);
    if (index === -1) {
      return this;
    }

    const [before, after] = this.split(index, beforeInstance);
    return Code.concatAll(
      before,
      code,
      after,
    );
  }

  /**
   * This function splits a Code into two Code fragments using the splitter.
   * The first Code object will contain code up to and including the splitter.
   * The second Code object will contain code after the splitter.
   * The declarations of the Code are preserved in both returned Codes.
   * Because of this, the user must be careful as the declarations may be wrong
   * if handled incorrectly.
   */
  private split(index: number, before: boolean = false): [Code, Code] {
    const i = before ? 0 : 1;
    return [new Code(this.code.substr(0, index + i), this.declarations), new Code(this.code.substr(index + i), this.declarations)];
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
  private renderDeclarations(): string[] {
    Declaration.sort(this.declarations);
    const decs = deduplicate(this.declarations);
    // Add separator only if necessary
    const decStrings = [...decs.map((d) => d.render())];
    const index = Declaration.numberOfImports(decs);
    if (decStrings.length > index) { decStrings.splice(index, 0, ''); }
    return decStrings;
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

/**
 * Parses the given type for human-readable information on the module
 * that the type is from. Meant to serve as a single source of truth
 * for parsing the type for module information.
 */
export function module(type: reflect.Type): ImportedModule {
  if (type.assembly.name === 'aws-cdk-lib' && type.namespace) {
    const parts = type.namespace.split('_');
    const nonNamespacedPart = SPECIAL_IMPORT_NAMES[type.namespace ?? ''] ?? parts[1] ?? parts[0];
    return {
      importName: nonNamespacedPart.replace(/^aws_/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: `${type.assembly.name}/${nonNamespacedPart.replace('-', '_')}`,
    };
  } else {
    const parts = type.assembly.name.split('/');
    const nonNamespacedPart = SPECIAL_IMPORT_NAMES[type.assembly.name] ?? parts[1] ?? parts[0];
    return {
      importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: type.assembly.name,
    };
  }
}