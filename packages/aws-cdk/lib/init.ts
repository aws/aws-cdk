import * as childProcess from 'child_process';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { error, print, warning } from './logging';
import { cdkHomeDir, rootDir } from './util/directories';
import { rangeFromSemver } from './util/version-range';


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
}

export type InvokeHook = (targetDirectory: string, context: HookContext) => Promise<void>;

/* eslint-disable @typescript-eslint/no-var-requires */ // Packages don't have @types module
// eslint-disable-next-line @typescript-eslint/no-require-imports
const camelCase = require('camelcase');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const decamelize = require('decamelize');

/**
 * Initialize a CDK package in the current directory
 */
export async function cliInit(type?: string, language?: string, canUseNetwork = true, generateOnly = false, workDir = process.cwd()) {
  if (!type && !language) {
    await printAvailableTemplates();
    return;
  }

  type = type || 'default'; // "default" is the default type (and maps to "app")

  const template = (await availableInitTemplates()).find(t => t.hasName(type!));
  if (!template) {
    await printAvailableTemplates(language);
    throw new Error(`Unknown init template: ${type}`);
  }
  if (!language && template.languages.length === 1) {
    language = template.languages[0];
    warning(`No --language was provided, but '${type}' supports only '${language}', so defaulting to --language=${language}`);
  }
  if (!language) {
    print(`Available languages for ${chalk.green(type)}: ${template.languages.map(l => chalk.blue(l)).join(', ')}`);
    throw new Error('No language was selected');
  }

  await initializeProject(template, language, type, canUseNetwork, generateOnly, workDir);
}

/**
 * Returns the name of the Python executable for this OS
 */
function pythonExecutable() {
  let python = 'python3';
  if (process.platform === 'win32') {
    python = 'python';
  }
  return python;
}
const INFO_DOT_JSON = 'info.json';

export class InitTemplate {
  public static async fromName(templatesDir: string, name: string) {
    const basePath = path.join(templatesDir, name);
    const languages = (await listDirectory(basePath)).filter(f => f !== INFO_DOT_JSON);
    const info = await fs.readJson(path.join(basePath, INFO_DOT_JSON));
    return new InitTemplate(basePath, name, languages, info);
  }

  public readonly description: string;
  public readonly aliases = new Set<string>();

  constructor(
    private readonly basePath: string,
    public readonly name: string,
    public readonly languages: string[],
    info: any) {
    this.description = info.description;
    for (const alias of info.aliases || []) {
      this.aliases.add(alias);
    }
  }

  /**
   * @param name the name that is being checked
   * @returns ``true`` if ``name`` is the name of this template or an alias of it.
   */
  public hasName(name: string): boolean {
    return name === this.name || this.aliases.has(name);
  }

  /**
   * Creates a new instance of this ``InitTemplate`` for a given language to a specified folder.
   *
   * @param language    the language to instantiate this template with
   * @param targetDirectory the directory where the template is to be instantiated into
   */
  public async install(language: string, type: string, targetDirectory: string) {
    if (this.languages.indexOf(language) === -1) {
      error(`The ${chalk.blue(language)} language is not supported for ${chalk.green(this.name)} `
          + `(it supports: ${this.languages.map(l => chalk.blue(l)).join(', ')})`);
      throw new Error(`Unsupported language: ${language}`);
    }

    const projectInfo: ProjectInfo = {
      name: decamelize(path.basename(path.resolve(targetDirectory))),
    };

    const hookContext: HookContext = {
      substitutePlaceholdersIn: async (...fileNames: string[]) => {
        for (const fileName of fileNames) {
          const fullPath = path.join(targetDirectory, fileName);
          const template = await fs.readFile(fullPath, { encoding: 'utf-8' });
          await fs.writeFile(fullPath, this.expand(template, language, projectInfo));
        }
      },
    };

    const sourceDirectory = path.join(this.basePath, language);
    const hookTempDirectory = path.join(targetDirectory, 'tmp');
    const tempShellDirectory = this.needsShell(language, type) ? await this.copyShellTo(targetDirectory) : undefined;

    await fs.mkdir(hookTempDirectory);
    await this.installFiles(sourceDirectory, targetDirectory, language, projectInfo);
    await this.applyFutureFlags(targetDirectory);
    await this.invokeHooks(hookTempDirectory, targetDirectory, hookContext);
    await fs.remove(hookTempDirectory);

    if (tempShellDirectory) {
      await fs.remove(tempShellDirectory);
    }
  }

  private async installFiles(sourceDirectory: string, targetDirectory: string, language:string, project: ProjectInfo) {
    for (const file of await fs.readdir(sourceDirectory)) {
      const fromFile = path.join(sourceDirectory, file);
      const toFile = path.join(targetDirectory, this.expand(file, language, project));
      if ((await fs.stat(fromFile)).isDirectory()) {
        await fs.mkdir(toFile);
        await this.installFiles(fromFile, toFile, language, project);
        continue;
      } else if (file.match(/^.*\.template\.[^.]+$/)) {
        await this.installProcessed(fromFile, toFile.replace(/\.template(\.[^.]+)$/, '$1'), language, project);
        continue;
      } else if (file.match(/^.*\.hook\.(d.)?[^.]+$/)) {
        await this.installProcessed(fromFile, path.join(targetDirectory, 'tmp', file), language, project);
        continue;
      } else {
        await fs.copy(fromFile, toFile);
      }
    }
  }

  private needsShell(language: string, type: string): boolean {
    return (language === 'csharp' || language === 'fsharp') && (type === 'app' || type === 'default');
  }

  private async copyShellTo(targetDirectory: string): Promise<string> {
    const osFile = 'os.js';
    const osDirectory = 'util';
    const utilSourceDirectory = path.join(this.basePath, osDirectory);
    const utilTempDirectory = path.join(targetDirectory, osDirectory);
    const fromFile = path.join(utilSourceDirectory, osFile);
    const toFile = path.join(utilTempDirectory, osFile);
    await fs.mkdir(utilTempDirectory);
    await fs.copy(fromFile, toFile);
    return utilTempDirectory;
  }

  /**
   * @summary   Invoke any javascript hooks that exist in the template.
   * @description Sometimes templates need more complex logic than just replacing tokens. A 'hook' is
   *        any file that ends in .hook.js. It should export a single function called "invoke"
   *        that accepts a single string parameter. When the template is installed, each hook
   *        will be invoked, passing the target directory as the only argument. Hooks are invoked
   *        in lexical order.
   */
  private async invokeHooks(sourceDirectory: string, targetDirectory: string, hookContext: HookContext) {
    const files = await fs.readdir(sourceDirectory);
    files.sort(); // Sorting allows template authors to control the order in which hooks are invoked.

    for (const file of files) {
      if (file.match(/^.*\.hook\.js$/)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const invoke: InvokeHook = require(path.join(sourceDirectory, file)).invoke;
        await invoke(targetDirectory, hookContext);
      }
    }
  }

  private async installProcessed(templatePath: string, toFile: string, language: string, project: ProjectInfo) {
    const template = await fs.readFile(templatePath, { encoding: 'utf-8' });
    await fs.writeFile(toFile, this.expand(template, language, project));
  }

  private expand(template: string, language: string, project: ProjectInfo) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const manifest = require(path.join(rootDir(), 'package.json'));
    const MATCH_VER_BUILD = /\+[a-f0-9]+$/; // Matches "+BUILD" in "x.y.z-beta+BUILD"
    const cdkVersion = manifest.version.replace(MATCH_VER_BUILD, '');
    let constructsVersion = manifest.devDependencies.constructs.replace(MATCH_VER_BUILD, '');
    switch (language) {
      case 'java':
      case 'csharp':
      case 'fsharp':
        constructsVersion = rangeFromSemver(constructsVersion, 'bracket');
        break;
      case 'python':
        constructsVersion = rangeFromSemver(constructsVersion, 'pep');
        break;
    }
    return template.replace(/%name%/g, project.name)
      .replace(/%name\.camelCased%/g, camelCase(project.name))
      .replace(/%name\.PascalCased%/g, camelCase(project.name, { pascalCase: true }))
      .replace(/%cdk-version%/g, cdkVersion)
      .replace(/%constructs-version%/g, constructsVersion)
      .replace(/%cdk-home%/g, cdkHomeDir())
      .replace(/%name\.PythonModule%/g, project.name.replace(/-/g, '_'))
      .replace(/%python-executable%/g, pythonExecutable())
      .replace(/%name\.StackName%/g, project.name.replace(/[^A-Za-z0-9-]/g, '-'));
  }

  /**
   * Adds context variables to `cdk.json` in the generated project directory to
   * enable future behavior for new projects.
   */
  private async applyFutureFlags(projectDir: string) {
    const cdkJson = path.join(projectDir, 'cdk.json');
    if (!await fs.pathExists(cdkJson)) {
      return;
    }

    const futureFlags: {[key: string]: any} = {};
    Object.entries(cxapi.FUTURE_FLAGS)
      .filter(([k, _]) => !cxapi.FUTURE_FLAGS_EXPIRED.includes(k))
      .forEach(([k, v]) => futureFlags[k] = v);

    const config = await fs.readJson(cdkJson);
    config.context = {
      ...config.context,
      ...futureFlags,
      ...cxapi.NEW_PROJECT_DEFAULT_CONTEXT,
    };

    await fs.writeJson(cdkJson, config, { spaces: 2 });
  }
}

interface ProjectInfo {
  /** The value used for %name% */
  readonly name: string;
}

export async function availableInitTemplates(): Promise<InitTemplate[]> {
  return new Promise(async resolve => {
    const templatesDir = path.join(rootDir(), 'lib', 'init-templates');
    const templateNames = await listDirectory(templatesDir);
    const templates = new Array<InitTemplate>();
    for (const templateName of templateNames) {
      templates.push(await InitTemplate.fromName(templatesDir, templateName));
    }
    resolve(templates);
  });
}
export async function availableInitLanguages(): Promise<string[]> {
  return new Promise(async resolve => {
    const templates = await availableInitTemplates();
    const result = new Set<string>();
    for (const template of templates) {
      for (const language of template.languages) {
        result.add(language);
      }
    }
    resolve([...result]);
  });
}

/**
 * @param dirPath is the directory to be listed.
 * @returns the list of file or directory names contained in ``dirPath``, excluding any dot-file, and sorted.
 */
async function listDirectory(dirPath: string) {
  return (await fs.readdir(dirPath))
    .filter(p => !p.startsWith('.'))
    .filter(p => !(p === 'LICENSE'))
    .sort();
}

export async function printAvailableTemplates(language?: string) {
  print('Available templates:');
  for (const template of await availableInitTemplates()) {
    if (language && template.languages.indexOf(language) === -1) { continue; }
    print(`* ${chalk.green(template.name)}: ${template.description}`);
    const languageArg = language ? chalk.bold(language)
      : template.languages.length > 1 ? `[${template.languages.map(t => chalk.bold(t)).join('|')}]`
        : chalk.bold(template.languages[0]);
    print(`   └─ ${chalk.blue(`cdk init ${chalk.bold(template.name)} --language=${languageArg}`)}`);
  }
}

async function initializeProject(
  template: InitTemplate,
  language: string,
  type: string,
  canUseNetwork: boolean,
  generateOnly: boolean,
  workDir: string,
) {
  await assertIsEmptyDirectory(workDir);
  print(`Applying project template ${chalk.green(template.name)} for ${chalk.blue(language)}`);
  await template.install(language, type, workDir);
  if (await fs.pathExists('README.md')) {
    print(chalk.green(await fs.readFile('README.md', { encoding: 'utf-8' })));
  }

  if (!generateOnly) {
    await initializeGitRepository(workDir);
    await postInstall(language, canUseNetwork, workDir);
  }

  print('✅ All done!');
}

async function assertIsEmptyDirectory(workDir: string) {
  const files = await fs.readdir(workDir);
  if (files.filter(f => !f.startsWith('.')).length !== 0) {
    throw new Error('`cdk init` cannot be run in a non-empty directory!');
  }
}

async function initializeGitRepository(workDir: string) {
  if (await isInGitRepository(workDir)) { return; }
  print('Initializing a new git repository...');
  try {
    await execute('git', ['init'], { cwd: workDir });
    await execute('git', ['add', '.'], { cwd: workDir });
    await execute('git', ['commit', '--message="Initial commit"', '--no-gpg-sign'], { cwd: workDir });
  } catch (e) {
    warning('Unable to initialize git repository for your project.');
  }
}

async function postInstall(language: string, canUseNetwork: boolean, workDir: string) {
  switch (language) {
    case 'javascript':
      return postInstallJavascript(canUseNetwork, workDir);
    case 'typescript':
      return postInstallTypescript(canUseNetwork, workDir);
    case 'java':
      return postInstallJava(canUseNetwork, workDir);
    case 'python':
      return postInstallPython(workDir);
  }
}

async function postInstallJavascript(canUseNetwork: boolean, cwd: string) {
  return postInstallTypescript(canUseNetwork, cwd);
}

async function postInstallTypescript(canUseNetwork: boolean, cwd: string) {
  const command = 'npm';

  if (!canUseNetwork) {
    warning(`Please run '${command} install'!`);
    return;
  }

  print(`Executing ${chalk.green(`${command} install`)}...`);
  try {
    await execute(command, ['install'], { cwd });
  } catch (e) {
    warning(`${command} install failed: ` + e.message);
  }
}

async function postInstallJava(canUseNetwork: boolean, cwd: string) {
  const mvnPackageWarning = 'Please run \'mvn package\'!';
  if (!canUseNetwork) {
    warning(mvnPackageWarning);
    return;
  }

  print('Executing \'mvn package\'');
  try {
    await execute('mvn', ['package'], { cwd });
  } catch (e) {
    warning('Unable to package compiled code as JAR');
    warning(mvnPackageWarning);
  }

}

async function postInstallPython(cwd: string) {
  const python = pythonExecutable();
  warning(`Please run '${python} -m venv .venv'!`);
  print(`Executing ${chalk.green('Creating virtualenv...')}`);
  try {
    await execute(python, ['-m venv', '.venv'], { cwd });
  } catch (e) {
    warning('Unable to create virtualenv automatically');
    warning(`Please run '${python} -m venv .venv'!`);
  }
}

/**
 * @param dir a directory to be checked
 * @returns true if ``dir`` is within a git repository.
 */
async function isInGitRepository(dir: string) {
  while (true) {
    if (await fs.pathExists(path.join(dir, '.git'))) { return true; }
    if (isRoot(dir)) { return false; }
    dir = path.dirname(dir);
  }
}

/**
 * @param dir a directory to be checked.
 * @returns true if ``dir`` is the root of a filesystem.
 */
function isRoot(dir: string) {
  return path.dirname(dir) === dir;
}

/**
 * Executes `command`. STDERR is emitted in real-time.
 *
 * If command exits with non-zero exit code, an exceprion is thrown and includes
 * the contents of STDOUT.
 *
 * @returns STDOUT (if successful).
 */
async function execute(cmd: string, args: string[], { cwd }: { cwd: string }) {
  const child = childProcess.spawn(cmd, args, { cwd, shell: true, stdio: ['ignore', 'pipe', 'inherit'] });
  let stdout = '';
  child.stdout.on('data', chunk => stdout += chunk.toString());
  return new Promise<string>((ok, fail) => {
    child.once('error', err => fail(err));
    child.once('exit', status => {
      if (status === 0) {
        return ok(stdout);
      } else {
        process.stderr.write(stdout);
        return fail(new Error(`${cmd} exited with status ${status}`));
      }
    });
  });
}
