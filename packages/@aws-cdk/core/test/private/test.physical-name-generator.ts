import nodeunit = require('nodeunit');
import { App, Aws, Resource, Stack } from '../../lib';
import { generatePhysicalName } from '../../lib/private/physical-name-generator';

export = nodeunit.testCase({
  'generates correct physical names'(test: nodeunit.Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });

    const testResourceA = new TestResource(stack, 'A');
    const testResourceB = new TestResource(testResourceA, 'B');

    test.equal(generatePhysicalName(testResourceA), 'teststackteststackaa164c141d59b37c1b663');
    test.equal(generatePhysicalName(testResourceB), 'teststackteststackab27595cd34d8188283a1f');

    test.done();
  },

  'generates different names in different accounts'(test: nodeunit.Test) {
    const appA = new App();
    const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
    const resourceA = new TestResource(stackA, 'Resource');

    const appB = new App();
    const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678913', region: 'bermuda-triangle-1' } });
    const resourceB = new TestResource(stackB, 'Resource');

    test.notEqual(generatePhysicalName(resourceA), generatePhysicalName(resourceB));

    test.done();
  },

  'generates different names in different regions'(test: nodeunit.Test) {
    const appA = new App();
    const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
    const resourceA = new TestResource(stackA, 'Resource');

    const appB = new App();
    const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-2' } });
    const resourceB = new TestResource(stackB, 'Resource');

    test.notEqual(generatePhysicalName(resourceA), generatePhysicalName(resourceB));

    test.done();
  },

  'fails when the region is an unresolved token'(test: nodeunit.Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: Aws.REGION } });
    const testResource = new TestResource(stack, 'A');

    test.throws(() => generatePhysicalName(testResource),
      /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);

    test.done();
  },

  'fails when the region is not provided'(test: nodeunit.Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { account: '012345678912' } });
    const testResource = new TestResource(stack, 'A');

    test.throws(() => generatePhysicalName(testResource),
      /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);

    test.done();
  },

  'fails when the account is an unresolved token'(test: nodeunit.Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { account: Aws.ACCOUNT_ID, region: 'bermuda-triangle-1' } });
    const testResource = new TestResource(stack, 'A');

    test.throws(() => generatePhysicalName(testResource),
      /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);

    test.done();
  },

  'fails when the account is not provided'(test: nodeunit.Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { region: 'bermuda-triangle-1' } });
    const testResource = new TestResource(stack, 'A');

    test.throws(() => generatePhysicalName(testResource),
      /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);

    test.done();
  },
});

class TestResource extends Resource {}
