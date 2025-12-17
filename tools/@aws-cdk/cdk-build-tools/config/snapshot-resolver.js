const path = require('path');
const ext = require('./ext');

const dotext = `.${ext}`;

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