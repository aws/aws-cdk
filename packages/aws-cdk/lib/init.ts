import childProcess = require('child_process');
import colors = require('colors/safe');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { error, print, warning } from './logging';

export type InvokeHook = (targetDirectory: string) => Promise<void>;

// tslint:disable:no-var-requires those libraries don't have up-to-date @types modules
const camelCase = require('camelcase');
const decamelize = require('decamelize');
// tslint:enable:no-var-requires

const TEMPLATES_DIR = path.join(__dirname, 'init-templates');
const CDK_HOME = process.env.CDK_HOME ? path.resolve(process.env.CDK_HOME) : path.join(os.homedir(), '.cdk');

/**
 * Initialize a CDK package in the current directory
 */
export async function cliInit(type: string, language: string | undefined, canUseNetwork?: boolean) {
  const template = (await availableInitTemplates).find(t => t.hasName(type));
  if (!template) {
    await printAvailableTemplates(language);
    throw new Error(`Unknown init template: ${type}`);
  }
  if (!language && template.languages.length === 1) {
    language = template.languages[0];
    warning(`No --language was provided, but '${type}' supports only '${language}', so defaulting to --language=${language}`);
  }
  if (!language) {
    print(`Available languages for ${colors.green(type)}: ${template.languages.map(l => colors.blue(l)).join(', ')}`);
    throw new Error('No language was selected');
  }
  await initializeProject(template, language, canUseNetwork !== undefined ? canUseNetwork : true);
}

const INFO_DOT_JSON = 'info.json';

export class InitTemplate {
  public static async fromName(name: string) {
    const basePath = path.join(TEMPLATES_DIR, name);
    const languages = (await listDirectory(basePath)).filter(f => f !== INFO_DOT_JSON);
    const info = await fs.readJson(path.join(basePath, INFO_DOT_JSON));
    return new InitTemplate(basePath, name, languages, info);
  }

  public readonly description: string;
  public readonly aliases = new Set<string>();

  constructor(private readonly basePath: string,
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
  public async install(language: string, targetDirectory: string) {
    if (this.languages.indexOf(language) === -1) {
      error(`The ${colors.blue(language)} language is not supported for ${colors.green(this.name)} `
          + `(it supports: ${this.languages.map(l => colors.blue(l)).join(', ')})`);
      throw new Error(`Unsupported language: ${language}`);
    }
    const sourceDirectory = path.join(this.basePath, language);
    await this.installFiles(sourceDirectory, targetDirectory, {
      name: decamelize(path.basename(path.resolve(targetDirectory)))
    });
    await this.invokeHooks(sourceDirectory, targetDirectory);
  }

  private async installFiles(sourceDirectory: string, targetDirectory: string, project: ProjectInfo) {
    for (const file of await fs.readdir(sourceDirectory)) {
      const fromFile = path.join(sourceDirectory, file);
      const toFile = path.join(targetDirectory, this.expand(file, project));
      if ((await fs.stat(fromFile)).isDirectory()) {
        await fs.mkdir(toFile);
        await this.installFiles(fromFile, toFile, project);
        continue;
      } else if (file.match(/^.*\.template\.[^.]+$/)) {
        await this.installProcessed(fromFile, toFile.replace(/\.template(\.[^.]+)$/, '$1'), project);
      } else if (file.match(/^.*\.hook\.[^.]+$/)) {
        continue;
      } else {
        await fs.copy(fromFile, toFile);
      }
    }
  }

  /**
   * @summary   Invoke any javascript hooks that exist in the template.
   * @description Sometimes templates need more complex logic than just replacing tokens. A 'hook' is
   *        any file that ends in .hook.js. It should export a single function called "invoke"
   *        that accepts a single string parameter. When the template is installed, each hook
   *        will be invoked, passing the target directory as the only argument. Hooks are invoked
   *        in lexical order.
   */
  private async invokeHooks(sourceDirectory: string, targetDirectory: string) {
    const files = await fs.readdir(sourceDirectory);
    files.sort(); // Sorting allows template authors to control the order in which hooks are invoked.

    for (const file of files) {
      if (file.match(/^.*\.hook\.js$/)) {
        const invoke: InvokeHook = require(path.join(sourceDirectory, file)).invoke;
        await invoke(targetDirectory);
      }
    }
  }

  private async installProcessed(templatePath: string, toFile: string, project: ProjectInfo) {
    const template = await fs.readFile(templatePath, { encoding: 'utf-8' });
    await fs.writeFile(toFile, this.expand(template, project));
  }

  private expand(template: string, project: ProjectInfo) {
    const MATCH_VER_BUILD = /\+[a-f0-9]+$/; // Matches "+BUILD" in "x.y.z-beta+BUILD"
    const cdkVersion = require('../package.json').version.replace(MATCH_VER_BUILD, '');
    return template.replace(/%name%/g, project.name)
             .replace(/%name\.camelCased%/g, camelCase(project.name))
             .replace(/%name\.PascalCased%/g, camelCase(project.name, { pascalCase: true }))
             .replace(/%cdk-version%/g, cdkVersion)
             .replace(/%cdk-home%/g, CDK_HOME);
  }
}

interface ProjectInfo {
  /** The value used for %name% */
  readonly name: string;
}

export const availableInitTemplates: Promise<InitTemplate[]> =
  new Promise(async resolve => {
    const templateNames = await listDirectory(TEMPLATES_DIR);
    const templates = new Array<InitTemplate>();
    for (const templateName of templateNames) {
      templates.push(await InitTemplate.fromName(templateName));
    }
    resolve(templates);
  });
export const availableInitLanguages: Promise<string[]> =
  new Promise(async resolve => {
    const templates = await availableInitTemplates;
    const result = new Set<string>();
    for (const template of templates) {
      for (const language of template.languages) {
        result.add(language);
      }
    }
    resolve([...result]);
  });
/**
 * @param dirPath is the directory to be listed.
 * @returns the list of file or directory names contained in ``dirPath``, excluding any dot-file, and sorted.
 */
async function listDirectory(dirPath: string) {
  return (await fs.readdir(dirPath))
          .filter(p => !p.startsWith('.'))
          .sort();
}

export async function printAvailableTemplates(language?: string) {
  print('Available templates:');
  for (const template of await availableInitTemplates) {
    if (language && template.languages.indexOf(language) === -1) { continue; }
    print(`* ${colors.green(template.name)}: ${template.description}`);
    const languageArg = language ? colors.bold(language)
                   : template.languages.length > 1 ? `[${template.languages.map(t => colors.bold(t)).join('|')}]`
                                   : colors.bold(template.languages[0]);
    print(`   └─ ${colors.blue(`cdk init ${colors.bold(template.name)} --language=${languageArg}`)}`);
  }
}

async function initializeProject(template: InitTemplate, language: string, canUseNetwork: boolean) {
  await assertIsEmptyDirectory();
  print(`Applying project template ${colors.green(template.name)} for ${colors.blue(language)}`);
  await template.install(language, process.cwd());
  await initializeGitRepository();
  await postInstall(language, canUseNetwork);
  if (await fs.pathExists('README.md')) {
    print(colors.green(await fs.readFile('README.md', { encoding: 'utf-8' })));
  } else {
    print(`✅ All done!`);
  }
}

async function assertIsEmptyDirectory() {
  const files = await fs.readdir(process.cwd());
  if (files.length !== 0) {
    throw new Error('`cdk init` cannot be run in a non-empty directory!');
  }
}

async function initializeGitRepository() {
  if (await isInGitRepository(process.cwd())) { return; }
  print('Initializing a new git repository...');
  try {
    await execute('git', 'init');
    await execute('git', 'add', '.');
    await execute('git', 'commit', '--message="Initial commit"', '--no-gpg-sign');
  } catch (e) {
    warning('Unable to initialize git repository for your project.');
  }
}

async function postInstall(language: string, canUseNetwork: boolean) {
  switch (language) {
  case 'typescript':
    return await postInstallTypescript(canUseNetwork);
  case 'java':
    return await postInstallJava(canUseNetwork);
  }
}

async function postInstallTypescript(canUseNetwork: boolean) {
  const command = 'npm';

  if (!canUseNetwork) {
    print(`Please run ${colors.green(`${command} install`)}!`);
    return;
  }

  print(`Executing ${colors.green(`${command} install`)}...`);
  try {
    await execute(command, 'install');
  } catch (e) {
    throw new Error(`${colors.green(`${command} install`)} failed: ` + e.message);
  }
}

async function postInstallJava(canUseNetwork: boolean) {
  if (!canUseNetwork) {
    print(`Please run ${colors.green(`mvn package`)}!`);
    return;
  }

  print(`Executing ${colors.green('mvn package')}...`);
  await execute('mvn', 'package');
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
async function execute(cmd: string, ...args: string[]) {
  const child = childProcess.spawn(cmd, args, { shell: true, stdio: [ 'ignore', 'pipe', 'inherit' ] });
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
