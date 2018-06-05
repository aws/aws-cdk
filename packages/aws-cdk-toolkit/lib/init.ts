import { exec } from 'child_process';
import * as colors from 'colors/safe';
import * as fs from 'fs-extra';
import { homedir } from 'os';
import * as path from 'path';
import { promisify } from 'util';
import { error, print, warning } from './logging';

// tslint:disable:no-var-requires those libraries don't have up-to-date @types modules
const camelCase = require('camelcase');
const decamelize = require('decamelize');
// tslint:enable:no-var-requires

const TEMPLATES_DIR = path.join(__dirname, 'init-templates');

/**
 * Initialize a CDK package in the current directory
 */
export async function cliInit(type: string | undefined, language: string | undefined) {
    if (!type) {
        printAvailableTemplates();
        throw new Error('No template was selected');
    }
    const template = availableInitTemplates.find(t => t.hasName(type));
    if (!template) {
        printAvailableTemplates();
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
    await initializeProject(template, language);
}

const INFO_DOT_JSON = 'info.json';

export class InitTemplate {
    public readonly description: string;
    public readonly aliases = new Array<string>();
    public readonly languages: string[];

    private readonly basePath: string;

    constructor(public readonly name: string) {
        this.basePath = path.join(TEMPLATES_DIR, name);
        this.languages = listDirectory(this.basePath).filter(f => f !== INFO_DOT_JSON);
        const info = fs.readJsonSync(path.join(this.basePath, INFO_DOT_JSON));
        this.description = info.description;
    }

    public hasName(name: string): boolean {
        return name === this.name || this.aliases.indexOf(name) !== -1;
    }

    public async install(language: string, into: string) {
        if (this.languages.indexOf(language) === -1) {
            error(`The ${colors.blue(language)} language is not supported for ${colors.green(this.name)} `
                  + `(it supports: ${this.languages.map(l => colors.blue(l)).join(', ')})`);
            throw new Error(`Unsupported language: ${language}`);
        }
        await this.installFiles(path.join(this.basePath, language), into, {
            name: decamelize(path.basename(path.resolve(into)))
        });
    }

    private async installFiles(from: string, to: string, project: ProjectInfo) {
        for (const file of await fs.readdir(from)) {
            const fromFile = path.join(from, file);
            const toFile = path.join(to, this.expand(file, project));
            if ((await fs.stat(fromFile)).isDirectory()) {
                await fs.mkdir(toFile);
                await this.installFiles(fromFile, toFile, project);
            } else if (file.match(/^.*\.template\.[^.]+$/)) {
                await this.installProcessed(fromFile, toFile.replace(/\.template(\.[^.]+)$/, '$1'), project);
            } else {
                await promisify(fs.copyFile)(fromFile, toFile);
            }
        }
    }

    private async installProcessed(templatePath: string, toFile: string, project: ProjectInfo) {
        const template = await fs.readFile(templatePath, { encoding: 'utf-8' });
        await fs.writeFile(toFile, this.expand(template, project));
    }

    private expand(template: string, project: ProjectInfo) {
        const cdkVersion = require('aws-cdk/package.json').version;
        return template.replace(/%name%/g, project.name)
                       .replace(/%name\.camelCased%/g, camelCase(project.name))
                       .replace(/%name\.PascalCased%/g, camelCase(project.name, { pascalCase: true }))
                       .replace(/%cdk-version%/g, cdkVersion);
    }
}

interface ProjectInfo {
    /** The value used for %name% */
    readonly name: string;
}

export const availableInitTemplates = listDirectory(TEMPLATES_DIR).map(name => new InitTemplate(name));

/**
 * @param dirPath is the directory to be listed.
 * @returns the list of file or directory names contained in ``dirPath``, excluding any dot-file, and sorted.
 */
function listDirectory(dirPath: string) {
    return fs.readdirSync(dirPath)
             .filter(p => !p.startsWith('.'))
             .sort();
}

function printAvailableTemplates() {
    print('Available templates:');
    for (const template of availableInitTemplates) {
        print(`* ${colors.green(template.name)}: ${template.description}`);
        print(`   └─ ${colors.blue(`cdk init --type=${template.name} --language=[${template.languages.join('|')}]`)}`);
    }
}

async function initializeProject(template: InitTemplate, language: string) {
    await assertIsEmptyDirectory();
    await initializeGitRepository();
    print(`Applying project template ${colors.green(template.name)} for ${colors.blue(language)}`);
    template.install(language, process.cwd());
    await postInstall(language);
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
    promisify(exec)('git init');
}

async function postInstall(language: string) {
    switch (language) {
    case 'typescript':
        return await postInstallTypescript();
    }
}

async function postInstallTypescript() {
    const localCdkPath = path.join(homedir(), '.cdk', 'repo', 'npm');
    if (await fs.pathExists(localCdkPath)) {
        // TODO: This won't be necessary any longer once the packages are published to an NPM registry.
        print(`Installing CDK modules from ${colors.green(localCdkPath)}...`);
        await execute(`npm install --global-style --no-save ${localCdkPath}/*.tgz`);
        // "Manually" adding them to package.json so `npm install` doesn't remove everything
        const packageJson = await fs.readJSON('package.json');
        const exclusions = [
            'aws-cdk-all', 'aws-cdk-applet-js', 'aws-cdk-assert', 'aws-cdk-cloudformation-diff', 'aws-cdk-cx-api',
            'aws-cdk-docs', 'aws-cdk-toolkit', 'aws-cdk-util'
        ];
        for (const module of (await fs.readdir('node_modules')).filter(n => n.startsWith('aws-cdk'))) {
            if (module in packageJson.dependencies) { continue; }
            if (packageJson.devDependencies && module in packageJson.devDependencies) { continue; }
            if (exclusions.indexOf(module) !== -1) { continue; }
            const moduleVersion = require(`${process.cwd()}/node_modules/${module}/package.json`).version;
            packageJson.dependencies[module] = `^${moduleVersion}`;
        }
        await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
    }
    print(`Executing ${colors.green('npm install')}...`);
    await execute('npm install');

    async function execute(command: string) {
        const { stdout, stderr } = await promisify(exec)(command);
        if (stdout) {
            print(stdout);
        }
        if (stderr) {
            print(stderr);
        }
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
