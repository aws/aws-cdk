const path = require('path');

if (!process.env.CDK_BUILD_TOOLS_TEST_EXT) {
  throw new Error(`$CDK_BUILD_TOOLS_TEST_EXT should be set!`);
}

const dotext = `.${process.env.CDK_BUILD_TOOLS_TEST_EXT}`;

module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return `${path.dirname(testPath)}/__snapshots__/${path.basename(testPath, dotext)}.ts${snapshotExtension}`;
  },

  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const testDir = path.dirname(path.dirname(snapshotFilePath));
    return `${testDir}/${path.basename(snapshotFilePath, `.ts${snapshotExtension}`)}${dotext}`;
  },

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: `test/apple.test.${dotext}`,
};