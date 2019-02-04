const fs = require('fs');
const path = require('path');
const os = require('os');

const getAllChildDirectories = (dir) => fs.readdirSync(dir).map(name => path.join(dir, name.toString())).filter(name => fs.lstatSync(name).isDirectory());
const isNodeModulesDirectory = (name) => name.toString().endsWith('node_modules');

function getAllNodeModulesPaths(dir) {
    let nodeModulesPaths = [];
    getAllChildDirectories(dir).forEach(name => {
        if (isNodeModulesDirectory(name)) {
            console.log('Excluding ' + name);
            nodeModulesPaths.push(name);
        } else {
            const subNodeModulesPaths = getAllNodeModulesPaths(name);
            nodeModulesPaths = nodeModulesPaths.concat(subNodeModulesPaths);
        }
    });
    return nodeModulesPaths;
}

// Should be run at the root directory
if (!fs.existsSync('lerna.json')) {
    throw new Error('This script should be run from the root of the repo.');
}

const nodeModulesPaths = getAllNodeModulesPaths('.');

// Hardcoded exclusions for this project (in addition to node_modules)
const exclusions = nodeModulesPaths.map(path => `<excludeFolder url="file://$MODULE_DIR$/${path}" />`);
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/.tmp" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/docs" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/temp" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/tmp" />');

exclusionsString = exclusions.join(os.EOL);

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

const toWrite = exclusionInfo.toString().replace(/<content url="file:\/\/\$MODULE_DIR\$">(?:\s.+)+\/content>/m, `<content url="file://$MODULE_DIR$">${os.EOL}${exclusionsString}${os.EOL}</content>`);

console.log(os.EOL + 'Writing to file...');

// "Delete" the file first to avoid strange concurrent use errors.
fs.unlinkSync(fileName);

fs.writeFileSync(fileName, toWrite);

console.log('Done!');
