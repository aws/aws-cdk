const path = require('path');

const rootDir = path.resolve(__dirname, '..', 'tests', process.env.TEST_SUITE_NAME);

if (rootDir.includes('node_modules')) {
  // Jest < 28 under no circumstances supports loading test if there's node_modules anywhere in the path,
  // and Jest >= 28 requires a newer TypeScript version than the one we support.
  throw new Error(`This package must not be 'npm install'ed (found node_modules in dir: ${rootDir})`);
}

module.exports = {
  rootDir,
  testMatch: [`**/*.integtest.js`],
  moduleFileExtensions: ["js"],

  testEnvironment: "node",
  testTimeout: 300000,

  // Affects test.concurrent(), these are self-limiting anyway
  maxConcurrency: 10,
  reporters: [
    "default",
    [ "jest-junit", { suiteName: "jest tests", outputDirectory: "coverage" } ]
  ]
};
