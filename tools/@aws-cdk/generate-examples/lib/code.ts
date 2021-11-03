import * as reflect from 'jsii-reflect';

import { Declaration } from './declaration';

/**
 * Customary module import names that differ from what would be automatically generated.
 */
const SPECIAL_PACKAGE_ROOT_IMPORT_NAMES: Record<string, string> = {
  'aws-cdk-lib': 'cdk',
  '@aws-cdk/core': 'cdk',
  '@aws-cdk/aws-applicationautoscaling': 'appscaling',
  '@aws-cdk/aws-elasticloadbalancing': 'elb',
  '@aws-cdk/aws-elasticloadbalancingv2': 'elbv2',
};

const SPECIAL_NAMESPACE_IMPORT_NAMES: Record<string, string> = {
  aws_applicationautoscaling: 'appscaling',
  aws_elasticloadbalancing: 'elb',
  aws_elasticloadbalancingv2: 'elbv2',
};

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

  /**
   * Renders variable declarations. Assumes that there are no duplicates in the declarations.
   */
  private renderDeclarations(): string[] {
    Declaration.sort(this.declarations);
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
  if (type.assembly.name === 'aws-cdk-lib') {
    let namespacedPart = type.assembly.name;
    if (type.namespace) {
      const parts = type.namespace.split('_');
      namespacedPart = SPECIAL_NAMESPACE_IMPORT_NAMES[type.namespace] ?? parts[1] ?? parts[0];
    }
    return {
      importName: namespacedPart.replace(/^aws_/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: `${type.assembly.name}/${namespacedPart.replace('-', '_')}`,
    };
  } else {
    const parts = type.assembly.name.split('/');
    const nonNamespacedPart = SPECIAL_PACKAGE_ROOT_IMPORT_NAMES[type.assembly.name] ?? parts[1] ?? parts[0];
    return {
      importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: type.assembly.name,
    };
  }
}