import * as path from 'path';
import { shell } from './os';

export type SubstitutePlaceholders = (...fileNames: string[]) => Promise<void>;

/**
 * Helpers passed to hook functions
 */
export interface HookContext {
  /**
   * Callback function to replace placeholders on arbitrary files
   *
   * This makes token substitution available to non-`.template` files.
   */
  readonly substitutePlaceholdersIn: SubstitutePlaceholders;

  /**
   * Return a single placeholder
   */
  placeholder(name: string): string;
}

export type InvokeHook = (targetDirectory: string, context: HookContext) => Promise<void>;

export interface HookTarget {
  readonly targetDirectory: string;
  readonly templateName: string;
  readonly language: string;
}

/**
 * Invoke hooks for the given init template
 *
 * Sometimes templates need more complex logic than just replacing tokens. A 'hook' can be
 * used to do additional processing other than copying files.
 *
 * Hooks used to be defined externally to the CLI, by running arbitrarily
 * substituted shell scripts in the target directory.
 *
 * In practice, they're all TypeScript files and all the same, and the dynamism
 * that the original solution allowed wasn't used at all. Worse, since the CLI
 * is now bundled the hooks can't even reuse code from the CLI libraries at all
 * anymore, so all shared code would have to be copy/pasted.
 *
 * Bundle hooks as built-ins into the CLI, so they get bundled and can take advantage
 * of all shared code.
 */
export async function invokeBuiltinHooks(target: HookTarget, context: HookContext) {
  switch (target.language) {
    case 'csharp':
      if (['app', 'sample-app'].includes(target.templateName)) {
        return dotnetAddProject(target.targetDirectory, context);
      }
      break;

    case 'fsharp':
      if (['app', 'sample-app'].includes(target.templateName)) {
        return dotnetAddProject(target.targetDirectory, context, 'fsproj');
      }
      break;

    case 'python':
      // We can't call this file 'requirements.template.txt' because Dependabot needs to be able to find it.
      // Therefore, keep the in-repo name but still substitute placeholders.
      await context.substitutePlaceholdersIn('requirements.txt');
      break;

    case 'java':
      // We can't call this file 'pom.template.xml'... for the same reason as Python above.
      await context.substitutePlaceholdersIn('pom.xml');
      break;

    case 'javascript':
    case 'typescript':
      // See above, but for 'package.json'.
      await context.substitutePlaceholdersIn('package.json');

  }
}

async function dotnetAddProject(targetDirectory: string, context: HookContext, ext = 'csproj') {
  const pname = context.placeholder('name.PascalCased');
  const slnPath = path.join(targetDirectory, 'src', `${pname}.sln`);
  const csprojPath = path.join(targetDirectory, 'src', pname, `${pname}.${ext}`);
  try {
    await shell(['dotnet', 'sln', slnPath, 'add', csprojPath]);
  } catch (e: any) {
    throw new Error(`Could not add project ${pname}.${ext} to solution ${pname}.sln. ${e.message}`);
  }
};
