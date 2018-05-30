import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as util from 'util';
import { print, warning } from './logging';

const TEMPLATES_DIR = path.join(__dirname, 'init-templates');

/**
 * Initialize a CDK package in the current directory
 */
export async function cliInit(template: string) {
    const templateDir = template && path.join(TEMPLATES_DIR, template);
    if (!templateDir || !(await fs.pathExists(templateDir))) {
        const templates = await fs.readdir(TEMPLATES_DIR);
        throw new Error(`Templates supported by 'cdk init': ${templates.join(', ')}`);
    }

    await assertDirectoryIsEmpty();
    await initializeGitRepository();
    await installTemplate(templateDir);
    await additionalPrep(template);
    await printReadme();
}

async function assertDirectoryIsEmpty() {
    const contents = await fs.readdir('.');
    if (contents.length > 0) {
        throw new Error('Cannot run cdk init in a non-empty directory.');
    }
}

/**
 * Initialize a git repository if the current directory is not already inside a git repository
 */
async function initializeGitRepository() {
    if (await isInGitRepo(process.cwd())) { return; }

    print('Initializing git repository');
    await util.promisify(child_process.exec)('git init');
}

/**
 * Return whether the given directory is inside a git repo
 */
async function isInGitRepo(dir: string) {
    while (true) {
        if (await fs.pathExists(path.join(dir, '.git'))) { return true; }
        if (isRoot(dir)) { return false; }
        dir = path.dirname(dir);
    }
}

/**
 * Whether the given path is the root of the filesystem
 */
function isRoot(dir: string) {
    return path.dirname(dir) === dir;
}

/**
 * Copy the contents of a template directory into place
 */
async function installTemplate(templateDir: string) {
    await fs.copy(templateDir, '.', { overwrite: true });
    print('Wrote package skeleton to current directory');
}

/**
 * Do per-language work in addition to installing templates
 */
async function additionalPrep(template: string) {
    const preps: {[key: string]: () => Promise<void> } = {
        typescript: symlinkNodeModules
    };

    if (template in preps) {
        await preps[template]();
    }
}

/**
 * Symlink NodeJS modules from the ~/.cdk directory into place in the current directory
 *
 * This is a temporary solution until we're completely up on NPM.
 */
async function symlinkNodeModules() {
    const cdkNodeModules = path.resolve(__dirname, "..", "..");

    if (!(await fs.pathExists(cdkNodeModules))) {
        warning(`Expected cached node_modules directory not found: ${cdkNodeModules}`);
        warning("Run 'npm install' to try and obtain dependencies directly.");
        return;
    }

    await fs.ensureSymlink(cdkNodeModules, 'node_modules');
    print(`Symlinked node_modules from ${cdkNodeModules}`);
}

async function printReadme() {
    if (!(await fs.pathExists('./README.md'))) { return; }

    process.stdout.write(await fs.readFile('./README.md'));
}
