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

if (!fs.existsSync('lerna.json')) {
    throw new Error('This script should be run from the root of the repo.');
}

const nodeModulesPaths = getAllNodeModulesPaths('.');

const exclusions = nodeModulesPaths.map(path => `<excludeFolder url="file://$MODULE_DIR$/${path}" />`);
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/.tmp" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/docs" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/temp" />');
exclusions.push('<excludeFolder url="file://$MODULE_DIR$/tmp" />');

exclusionsString = exclusions.join(os.EOL);

const exclusionInfo = fs.readFileSync('.idea/aws-cdk.iml');

const toWrite = exclusionInfo.toString().replace(/<content url="file:\/\/\$MODULE_DIR\$">(?:\s.+)+\/content>/m, `<content url="file://$MODULE_DIR$">${os.EOL}${exclusionsString}${os.EOL}</content>`);

console.log(os.EOL + 'Writing to file...');

fs.unlinkSync('.idea/aws-cdk.iml');
fs.writeFileSync('.idea/aws-cdk.iml', toWrite);

console.log('Done!');
