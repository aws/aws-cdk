import { EcrPublicAvailable } from '../lib/private/service-available';

describe('EcrPublicAvailable', () => {
  it('should return true if region is undefined', () => {
    expect(EcrPublicAvailable(undefined)).toBe(true);
  });

  it('should return the ecrPublicAvailable value from RegionInfo if region is specified and resolved', () => {
    expect(EcrPublicAvailable('us-east-1')).toBe(true);
  });

  it('should return false for regions with no ecr public', () => {
    ['cn-north-1', 'cn-northwest-1'].forEach( r => {
      expect(EcrPublicAvailable(r)).toBe(false);
    });
  });
});
