import { App, Aws, Lazy, Resource, Stack, Token } from '../../lib';
import { GeneratedWhenNeededMarker, generatePhysicalName, isGeneratedWhenNeededMarker } from '../../lib/private/physical-name-generator';

describe('physical name generator', () => {
  describe('generatePhysicalName', () => {
    test('generates correct physical names', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });

      const testResourceA = new TestResource(stack, 'A');
      const testResourceB = new TestResource(testResourceA, 'B');

      expect(generatePhysicalName(testResourceA)).toEqual('teststackteststackaa164c141d59b37c1b663');
      expect(generatePhysicalName(testResourceB)).toEqual('teststackteststackab27595cd34d8188283a1f');


    });

    test('generates different names in different accounts', () => {
      const appA = new App();
      const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
      const resourceA = new TestResource(stackA, 'Resource');

      const appB = new App();
      const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678913', region: 'bermuda-triangle-1' } });
      const resourceB = new TestResource(stackB, 'Resource');

      expect(generatePhysicalName(resourceA)).not.toEqual(generatePhysicalName(resourceB));


    });

    test('generates different names in different regions', () => {
      const appA = new App();
      const stackA = new Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
      const resourceA = new TestResource(stackA, 'Resource');

      const appB = new App();
      const stackB = new Stack(appB, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-2' } });
      const resourceB = new TestResource(stackB, 'Resource');

      expect(generatePhysicalName(resourceA)).not.toEqual(generatePhysicalName(resourceB));


    });

    test('fails when the region is an unresolved token', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912', region: Aws.REGION } });
      const testResource = new TestResource(stack, 'A');

      expect(() => generatePhysicalName(testResource)).toThrow(
        /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);


    });

    test('fails when the region is not provided', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: '012345678912' } });
      const testResource = new TestResource(stack, 'A');

      expect(() => generatePhysicalName(testResource)).toThrow(
        /Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);


    });

    test('fails when the account is an unresolved token', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { account: Aws.ACCOUNT_ID, region: 'bermuda-triangle-1' } });
      const testResource = new TestResource(stack, 'A');

      expect(() => generatePhysicalName(testResource)).toThrow(
        /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);


    });

    test('fails when the account is not provided', () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', { env: { region: 'bermuda-triangle-1' } });
      const testResource = new TestResource(stack, 'A');

      expect(() => generatePhysicalName(testResource)).toThrow(
        /Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);


    });
  });

  describe('GeneratedWhenNeededMarker', () => {
    test('is correctly recognized', () => {
      const marker = new GeneratedWhenNeededMarker();
      const asString = Token.asString(marker);

      expect(isGeneratedWhenNeededMarker(asString)).toEqual(true);


    });

    test('throws when resolved', () => {
      const marker = new GeneratedWhenNeededMarker();
      const asString = Token.asString(marker);

      expect(() => new Stack().resolve(asString)).toThrow(/Use "this.physicalName" instead/);


    });
  });

  describe('isGeneratedWhenNeededMarker', () => {
    test('correctly response for other tokens', () => {
      expect(isGeneratedWhenNeededMarker('this is not even a token!')).toEqual(false);
      expect(isGeneratedWhenNeededMarker(Lazy.string({ produce: () => 'Bazinga!' }))).toEqual(false);


    });
  });
});

class TestResource extends Resource {}
