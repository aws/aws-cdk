import { CidrRoutingConfig } from '../lib/cidr-routing-config';

describe('CidrRoutingConfig', () => {
  test('creates successfully with valid parameters', () => {
    const config = new CidrRoutingConfig(
      '12345678-1234-1234-1234-123456789012',
      'valid-location'
    );
    expect(config.collectionId).toBe('12345678-1234-1234-1234-123456789012');
    expect(config.locationName).toBe('valid-location');
  });

  test('throws error with invalid collectionId format', () => {
    expect(() => {
      new CidrRoutingConfig('invalid-uuid', 'valid-location');
    }).toThrow('collectionId is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 digits)');
  });

  test('throws error with invalid locationName format', () => {
    expect(() => {
      new CidrRoutingConfig('12345678-1234-1234-1234-123456789012', 'invalid@location');
    }).toThrow('locationName is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks');
  });

  test('throws error with empty collectionId', () => {
    expect(() => {
      new CidrRoutingConfig('', 'valid-location');
    }).toThrow('collectionId is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 digits)');
  });

  test('throws error with empty locationName', () => {
    expect(() => {
      new CidrRoutingConfig('12345678-1234-1234-1234-123456789012', '');
    }).toThrow('locationName is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks');
  });

  test('throws error with null collectionId', () => {
    expect(() => {
      new CidrRoutingConfig(null as any, 'valid-location');
    }).toThrow('collectionId is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 digits)');
  });

  test('throws error with null locationName', () => {
    expect(() => {
      new CidrRoutingConfig('12345678-1234-1234-1234-123456789012', null as any);
    }).toThrow('locationName is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks');
  });

  test('accepts valid locationName with asterisk', () => {
    const config = new CidrRoutingConfig(
      '12345678-1234-1234-1234-123456789012',
      'valid*location'
    );
    expect(config.locationName).toBe('valid*location');
  });

  test('accepts valid locationName with underscore', () => {
    const config = new CidrRoutingConfig(
      '12345678-1234-1234-1234-123456789012',
      'valid_location'
    );
    expect(config.locationName).toBe('valid_location');
  });
});
