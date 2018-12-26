import { ITestGroup } from 'nodeunit';
import { CloudFormationToken, RESOLVE_OPTIONS } from "../lib";

/**
 * Update a nodeunit test suite so that we set up and tear down the proper CloudFormation token concatenator
 */
export function makeCloudformationTestSuite<T extends ITestGroup>(tests: T): T {
  let options: any;

  tests.setUp = (callback: () => void) => {
    options = RESOLVE_OPTIONS.push({ concat: CloudFormationToken.cloudFormationConcat });
    callback();
  };

  tests.tearDown = (callback: () => void) => {
    options.pop();
    callback();
  };

  return tests;
}