import cdk = require('@aws-cdk/cdk');
import { AWS_REGIONS } from '../build-tools/aws-entities';
import { RegionInfo, RegionInfoToken } from '../lib';

const mockRegionInfoFind = jest.spyOn(RegionInfo, 'find').mockName('RegionInfo.find');

describe('resolve', () => {
  test('correctly resolves a fact', () => {
    // GIVEN
    const region = AWS_REGIONS[0];
    const stack = new cdk.Stack(undefined, undefined, { env: { region } });
    const name = 'my:phony:fact';
    const value = '1337';

    mockRegionInfoFind.mockReturnValue(value);

    // WHEN
    const token = new RegionInfoToken(name);

    // THEN
    expect(token.resolve({ prefix: [], scope: stack })).toBe(value);
    expect(mockRegionInfoFind).toHaveBeenCalledWith(region, name);
  });

  describe('when the fact does not exist', () => {
    const region = AWS_REGIONS[0];
    const stack = new cdk.Stack(undefined, undefined, { env: { region } });
    const name = 'my:phony:fact';

    test('throws with no default', () => {
      // GIVEN
      mockRegionInfoFind.mockReturnValue(undefined);

      // WHEN
      const token = new RegionInfoToken(name);

      // THEN
      expect(() => token.resolve({ prefix: [], scope: stack })).toThrowError(/no default value was provided/);
      expect(mockRegionInfoFind).toHaveBeenCalledWith(region, name);
    });

    test('returns the default when provided', () => {
      // GIVEN
      const value = '1337';
      mockRegionInfoFind.mockReturnValue(undefined);
      const mockAddWarning = jest.spyOn(stack.node, 'addWarning').mockName('stack.node.addWarning');

      // WHEN
      const token = new RegionInfoToken(name, value);

      // THEN
      expect(token.resolve({ prefix: [], scope: stack })).toBe(value);
      expect(mockRegionInfoFind).toHaveBeenCalledWith(region, name);
      expect(mockAddWarning).toHaveBeenCalledWith(expect.stringMatching(/No regional info found for fact/));
    });
  });
});
