import { CidrRoutingConfig } from '../lib/cidr-routing-config';

describe('CidrRoutingConfig', () => {
  test('creates successfully with valid parameters', () => {
    const config = CidrRoutingConfig.new({
      collectionId: '12345678-1234-1234-1234-123456789012',
      locationName: 'valid-location',
    });
    expect(config.collectionId).toBe('12345678-1234-1234-1234-123456789012');
    expect(config.locationName).toBe('valid-location');
  });

  describe('accepts valid locationName with asterisk/underscore', () => {
    test.each([
      {
        name: 'asterisk',
        locationName: 'valid*location',
        expected: 'valid*location',
      },
      {
        name: 'underscore',
        locationName: 'valid_location',
        expected: 'valid_location',
      },
    ])('$name', ({ locationName, expected }) => {
      const config = CidrRoutingConfig.new({
        collectionId: '12345678-1234-1234-1234-123456789012',
        locationName,
      });
      expect(config.collectionId).toBe('12345678-1234-1234-1234-123456789012');
      expect(config.locationName).toBe(expected);
    });
  });

  describe('throws error with invalid parameters', () => {
    test.each([
      {
        name: 'invalid collectionId format',
        collectionId: 'invalid-uuid',
        locationName: 'valid-location',
        expectedError: 'collectionId(invalid-uuid) is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx(8-4-4-4-12 digits)',
      },
      {
        name: 'invalid locationName format',
        collectionId: '12345678-1234-1234-1234-123456789012',
        locationName: 'invalid@location',
        expectedError: 'locationName(invalid@location) is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks',
      },
      {
        name: 'empty collectionId',
        collectionId: '',
        locationName: 'valid-location',
        expectedError: 'collectionId() is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx(8-4-4-4-12 digits)',
      },
      {
        name: 'empty locationName',
        collectionId: '12345678-1234-1234-1234-123456789012',
        locationName: '',
        expectedError: 'locationName() is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks',
      },
      {
        name: 'null collectionId',
        collectionId: null as any,
        locationName: 'valid-location',
        expectedError: 'collectionId(null) is required and must be a valid UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx(8-4-4-4-12 digits)',
      },
      {
        name: 'null locationName',
        collectionId: '12345678-1234-1234-1234-123456789012',
        locationName: null as any,
        expectedError: 'locationName(null) is required and must be 1-16 characters long, containing only letters, numbers, underscores, hyphens, or asterisks',
      },
    ])('$name', ({ collectionId, locationName, expectedError }) => {
      expect(() => {
        CidrRoutingConfig.new({
          collectionId,
          locationName,
        });
      }).toThrow(expectedError);
    });
  });
});
