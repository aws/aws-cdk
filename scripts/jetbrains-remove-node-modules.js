#!/usr/bin/env node
/**
 * Generates JetBrains IDE configuration to exclude node_modules directories.
 * 
 * This script scans the AWS CDK monorepo for all node_modules directories
 * and generates appropriate JetBrains IDE exclusion entries.
 * 
 * Must be run from the repository root.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Checks if a path is a directory.
 * @param {string} dirPath - The path to check
 * @returns {boolean} True if the path is a directory
 */
function isDirectory(dirPath) {
  return fs.lstatSync(dirPath).isDirectory();
}

/**
 * Gets all immediate child directories of a directory.
 * @param {string} dir - The parent directory
 * @returns {string[]} Array of child directory paths
 */
const getAllChildDirectories = (dir) => 
  fs.readdirSync(dir)
    .map(name => path.join(dir, name.toString()))
    .filter(isDirectory);

/**
 * Checks if a directory name is 'node_modules'.
 * @param {string} name - The directory name
 * @returns {boolean} True if the name ends with 'node_modules'
 */
const isNodeModulesDirectory = (name) => 
  name.toString().endsWith('node_modules');

/**
 * Recursively finds all directories that contain a node_modules subdirectory.
 * @param {string} dir - The directory to search
 * @returns {string[]} Array of directory paths that contain node_modules
 */
function getAllDirsWithNodeModules(dir) {
  let nodeModulesPaths = [];
  getAllChildDirectories(dir).forEach(name => {
    if (isNodeModulesDirectory(name)) {
      console.log('✓ Excluding ' + name);
      nodeModulesPaths.push(dir);
    } else {
      const subNodeModulesPaths = getAllDirsWithNodeModules(name);
      nodeModulesPaths = nodeModulesPaths.concat(subNodeModulesPaths);
    }
  });
  return nodeModulesPaths;
}

/**
 * Checks if a directory is a CDK package (has lib/ and package.json).
 * @param {string} dirPath - The directory path to check
 * @returns {boolean} True if it's a CDK package directory
 */
function isCdkPackageDirectory(dirPath) {
  const libPath = path.join(dirPath, 'lib');
  const packageJsonPath = path.join(dirPath, 'package.json');
  
  return fs.existsSync(libPath) && 
         isDirectory(libPath) &&
         fs.existsSync(packageJsonPath);
}

/**
 * Generates JetBrains IDE exclusion entries for a directory.
 * @param {string} dirPath - The directory path
 * @returns {string} XML configuration entries
 */
function cdkPackageEntries(dirPath) {
  const ret = [`<excludeFolder url="file://$MODULE_DIR$/${dirPath}/node_modules" />`];
  
  if (isCdkPackageDirectory(dirPath)) {
    ret.push(`<excludeFolder url="file://$MODULE_DIR$/${dirPath}/.nyc_output" />`);
    ret.push(`<excludeFolder url="file://$MODULE_DIR$/${dirPath}/coverage" />`);
    ret.push(`<sourceFolder url="file://$MODULE_DIR$/${dirPath}/lib" isTestSource="false" />`);
    ret.push(`<sourceFolder url="file://$MODULE_DIR$/${dirPath}/test" isTestSource="true" />`);
  }
  
  return ret.join(os.EOL);
}

// Validate we're running from the repository root
if (!fs.existsSync('lerna.json')) {
  console.error('Error: This script must be run from the root of the repository.');
  console.error('Current directory:', process.cwd());
  process.exit(1);
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
