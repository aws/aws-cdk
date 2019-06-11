import { IResolveContext, Lazy, Stack } from '@aws-cdk/cdk';

/**
 * BuildSpec for CodeBuild projects
 */
export abstract class BuildSpec {
  public static fromObject(value: {[key: string]: any}): BuildSpec {
    return new StructuredBuildSpec(value);
  }

  /**
   * Use a file from the source as buildspec
   *
   * Use this if you want to use a file different from 'buildspec.yml'`
   */
  public static fromFilename(filename: string): BuildSpec {
    return new FilenameBuildSpec(filename);
  }

  protected constructor() {
  }

  /**
   * Render the represented BuildSpec
   */
  public abstract toBuildSpec(): string;
}

/**
 * BuildSpec that just returns the input unchanged
 */
class FilenameBuildSpec extends BuildSpec {
  constructor(private readonly filename: string) {
    super();
  }

  public toBuildSpec(): string {
    return this.filename;
  }

  public toString() {
    return `<buildspec file: ${this.filename}>`;
  }
}

/**
 * BuildSpec that understands about structure
 */
class StructuredBuildSpec extends BuildSpec {
  constructor(public readonly spec: {[key: string]: any}) {
    super();
  }

  public toBuildSpec(): string {
    // We have to pretty-print the buildspec, otherwise
    // CodeBuild will not recognize it as an inline buildspec.
    return Lazy.stringValue({ produce: (ctx: IResolveContext) =>
      Stack.of(ctx.scope).toJsonString(this.spec, 2)
    });
  }
}

/**
 * Merge two buildspecs into a new BuildSpec
 *
 * NOTE: will currently only merge commands, not artifact
 * declarations, environment variables, secrets, or any
 * other configuration elements.
 *
 * Internal for now because it's not complete/good enough
 * to expose on the objects directly, but we need to it to
 * keep feature-parity for Project.
 *
 * @internal
 */
export function mergeBuildSpecs(lhs: BuildSpec, rhs: BuildSpec): BuildSpec {
  if (!(lhs instanceof StructuredBuildSpec) || !(rhs instanceof StructuredBuildSpec)) {
    throw new Error('Can only merge buildspecs created using BuildSpec.fromObject()');
  }

  return new StructuredBuildSpec(copyCommands(lhs.spec, rhs.spec));
}

/**
 * Extend buildSpec phases with the contents of another one
 */
function copyCommands(buildSpec: any, extend: any): any {
  if (buildSpec.version === '0.1') {
    throw new Error('Cannot extend buildspec at version "0.1". Set the version to "0.2" or higher instead.');
  }

  const ret = Object.assign({}, buildSpec); // Return a copy
  ret.phases = Object.assign({}, ret.phases);

  for (const phaseName of Object.keys(extend.phases)) {
    const phase = ret.phases[phaseName] = Object.assign({}, ret.phases[phaseName]);
    phase.commands = [...phase.commands || [], ...extend.phases[phaseName].commands];
  }

  return ret;
}