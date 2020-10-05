const fs = require('fs');
const path = require('path');
const os = require('os');

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

const getAllChildDirectories = (dir) => fs.readdirSync(dir).map(name => path.join(dir, name.toString())).filter(isDirectory);
const isNodeModulesDirectory = (name) => name.toString().endsWith('node_modules');

function getAllDirsWithNodeModules(dir) {
    let nodeModulesPaths = [];
    getAllChildDirectories(dir).forEach(name => {
        if (isNodeModulesDirectory(name)) {
            console.log('Excluding ' + name);
            nodeModulesPaths.push(dir);
        } else {
            const subNodeModulesPaths = getAllDirsWithNodeModules(name);
            nodeModulesPaths = nodeModulesPaths.concat(subNodeModulesPaths);
        }
    });
    return nodeModulesPaths;
}

function isCdkPackageDirectory(path) {
    return fs.existsSync(path + '/lib') && isDirectory(path + '/lib') &&
        fs.existsSync(path + '/package.json');
}

function cdkPackageEntries(path) {
    let ret = [`<excludeFolder url="file://$MODULE_DIR$/${path}/node_modules" />`];
    if (isCdkPackageDirectory(path)) {
        ret.push(`<excludeFolder url="file://$MODULE_DIR$/${path}/.nyc_output" />`);
        ret.push(`<excludeFolder url="file://$MODULE_DIR$/${path}/coverage" />`);
        ret.push(`<sourceFolder url="file://$MODULE_DIR$/${path}/lib" isTestSource="false" />`);
        ret.push(`<sourceFolder url="file://$MODULE_DIR$/${path}/test" isTestSource="true" />`);
    }
    return ret.join(os.EOL);
}

// Should be run at the root directory
if (!fs.existsSync('lerna.json')) {
    throw new Error('This script should be run from the root of the repo.');
}

const nodeModulesPaths = getAllDirsWithNodeModules('.');

// Hardcoded exclusions for this project (in addition to node_modules)
const exclusions = nodeModulesPaths.map(cdkPackageEntries);
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/.github" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/.idea" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/.tools" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/docs" />');
exclusions.push('<excludePattern pattern=".jsii" />');

const exclusionsString = exclusions.join(os.EOL);

// Let filename be passed in as an override
let fileName = process.argv[2] || process.cwd().split('/').slice(-1).pop() + '.iml';

// Jetbrains IDEs store iml in .idea except for IntelliJ, which uses root.
if (fs.existsSync('.idea/' + fileName)) {
    fileName = '.idea/' + fileName;
} else if (!fs.existsSync(fileName)) {
    throw new Error('iml file not found in .idea or at root. Please pass in a path explicitly as the first argument.');
}

// Keep the contents. We are only updating exclusions.
const exclusionInfo = fs.readFileSync(fileName);

const toWrite = exclusionInfo.toString().replace(/<content url="file:\/\/\$MODULE_DIR\$">(?:\s.+)+\/content>/m,
    `<content url="file://$MODULE_DIR$">${os.EOL}${exclusionsString}${os.EOL}</content>`);

console.log(`${os.EOL}Writing to file: ${fileName} ...`);

// "Delete" the file first to avoid strange concurrent use errors.
fs.unlinkSync(fileName);

fs.writeFileSync(fileName, toWrite);

console.log('Done!');
