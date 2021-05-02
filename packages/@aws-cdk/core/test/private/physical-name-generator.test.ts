import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, Aws, Lazy, Resource, Stack, Token } from '../../lib';
import { GeneratedWhenNeededMarker, generatePhysicalName, isGeneratedWhenNeededMarker } from '../../lib/private/physical-name-generator';

nodeunitShim({
  generatePhysicalName: {
    'generates correct physical names'(test: Test) {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });

      const testResourceA = new TestResource(stack, 'A');
      const testResourceB = new TestResource(testResourceA, 'B');

      test.equal(generatePhysicalName(testResourceA), 'teststackteststackaa164c141d59b37c1b663');
      test.equal(generatePhysicalName(testResourceB), 'teststackteststackab27595cd34d8188283a1f');

      test.done();
    },

    'generates different names in different accounts'(test: Test) {
      const appA = new App();
      const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
      const resourceA = new TestResource(stackA, 'Resource');

      const appB = new App();
      const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678913', region: 'bermuda-triangle-1' } });
      const resourceB = new TestResource(stackB, 'Resource');

      test.notEqual(generatePhysicalName(resourceA), generatePhysicalName(resourceB));

      test.done();
    },

    'generates different names in different regions'(test: Test) {
      const appA = new App();
      const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
      const resourceA = new TestResource(stackA, 'Resource');

      const appB = new App();
      const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-2' } });
      const resourceB = new TestResource(stackB, 'Resource');

      test.notEqual(generatePhysicalName(resourceA), generatePhysicalName(resourceB));

      test.done();
    },

    'fails when the region is an unresolved token'(test: Test) {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: Aws.REGION } });
      const testResource = new TestResource(stack, 'A');

      test.throws(() => generatePhysicalName(testResource),
        /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);

      test.done();
    },

    'fails when the region is not provided'(test: Test) {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912' } });
      const testResource = new TestResource(stack, 'A');

      test.throws(() => generatePhysicalName(testResource),
        /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);

      test.done();
    },

    'fails when the account is an unresolved token'(test: Test) {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: Aws.ACCOUNT_ID, region: 'bermuda-triangle-1' } });
      const testResource = new TestResource(stack, 'A');

      test.throws(() => generatePhysicalName(testResource),
        /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);

      test.done();
    },

    'fails when the account is not provided'(test: Test) {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { region: 'bermuda-triangle-1' } });
      const testResource = new TestResource(stack, 'A');

      test.throws(() => generatePhysicalName(testResource),
        /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);

      test.done();
    },
  },

  GeneratedWhenNeededMarker: {
    'is correctly recognized'(test: Test) {
      const marker = new GeneratedWhenNeededMarker();
      const asString = Token.asString(marker);

      test.ok(isGeneratedWhenNeededMarker(asString));

      test.done();
    },

    'throws when resolved'(test: Test) {
      const marker = new GeneratedWhenNeededMarker();
      const asString = Token.asString(marker);

      test.throws(() => new Stack().resolve(asString), /Use "this.physicalName" instead/);

      test.done();
    },
  },

  isGeneratedWhenNeededMarker: {
    'correctly response for other tokens'(test: Test) {
      test.ok(!isGeneratedWhenNeededMarker('this is not even a token!'));
      test.ok(!isGeneratedWhenNeededMarker(Lazy.string({ produce: () => 'Bazinga!' })));

      test.done();
    },
  },
});

class TestResource extends Resource {}
