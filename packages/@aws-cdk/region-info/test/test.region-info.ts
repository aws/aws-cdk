import fs = require('fs-extra');
import nodeunit = require('nodeunit');
import os = require('os');
import path = require('path');
import { AwsRegionNames } from '../build-tools/static-data-facts/index';
import { RegionInfo } from '../lib';
import builtIns = require('../lib/static.generated');

const phonyRegion = {
  name: "bermuda-triangle-42",
  partition: "aws-phony",
  s3WebsiteEndpoint: "s3-website.bermuda-triangle-42.amazonawstest.com",
  servicePrincipals: { sqs: 'sqs.amazonaws.com' },
  cdkMetadataResourcePresent: false
};

const tests: { [name: string]: nodeunit.ITestBody | nodeunit.ITestGroup } = {
  'throws exception when the region does not exist'(test: nodeunit.Test) {
    // THEN
    test.throws(() => RegionInfo.forRegion(phonyRegion.name),
      /Unknown region: bermuda-triangle-42\. You can configure it by adding an entry in /);
    test.done();
  },

  async 'returns user-defined regions (single region in the file)'(test: nodeunit.Test) {
    // GIVEN
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'region-info'));
    try {
      const userDataFile = path.join(tmpDir, 'region-info.json');
      await fs.writeJson(userDataFile, phonyRegion);

      // WHEN
      RegionInfo.userDataPath = userDataFile;

      // THEN
      test.deepEqual(RegionInfo.forRegion(phonyRegion.name), phonyRegion);
      test.done();
    } finally {
      RegionInfo.userDataPath = '';
      await fs.remove(tmpDir);
    }
  },

  async 'returns user-defined regions (array of regions in the file)'(test: nodeunit.Test) {
    // GIVEN
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'region-info'));
    try {
      const userDataFile = path.join(tmpDir, 'region-info.json');
      await fs.writeJson(userDataFile, [phonyRegion]);

      // WHEN
      RegionInfo.userDataPath = userDataFile;

      // THEN
      test.deepEqual(RegionInfo.forRegion(phonyRegion.name), phonyRegion);
      test.done();
    } finally {
      RegionInfo.userDataPath = '';
      await fs.remove(tmpDir);
    }
  },
};

for (const name of AwsRegionNames) {
  tests[`correctly returns ${name}`] = (test: nodeunit.Test) => {
    // WHEN
    const region = RegionInfo.forRegion(name);

    // THEN
    test.deepEqual(region, builtIns[name]);
    test.done();
  };
}

export = nodeunit.testCase(tests);
