import * as glue from '../lib';

describe('PartitionProjectionConfiguration Validation', () => {
  describe('INTEGER validation', () => {
    test.each([
      [1.5, 10],
      [1, 10.5],
    ])('throws when min=%p or max=%p is not an integer', (min, max) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.integer({ min, max });
      }).toThrow(`INTEGER partition projection range must contain integers, but got [${min}, ${max}]`);
    });

    test('throws when min > max', () => {
      expect(() => {
        glue.PartitionProjectionConfiguration.integer({
          min: 10,
          max: 5,
        });
      }).toThrow('INTEGER partition projection range must be [min, max] where min <= max, but got [10, 5]');
    });

    test.each([0, -1, 1.5])('throws when interval=%p is invalid', (interval) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.integer({
          min: 1,
          max: 10,
          interval,
        });
      }).toThrow(`INTEGER partition projection interval must be a positive integer, but got ${interval}`);
    });

    test.each([0, -1, 1.5])('throws when digits=%p is invalid', (digits) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.integer({
          min: 1,
          max: 10,
          digits,
        });
      }).toThrow(`INTEGER partition projection digits must be an integer >= 1, but got ${digits}`);
    });
  });

  describe('DATE validation', () => {
    test.each([
      ['', '2023-12-31'],
      ['   ', '2023-12-31'],
      ['2020-01-01', ''],
    ])('throws when min=%p or max=%p is empty', (min, max) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({ min, max, format: 'yyyy-MM-dd' });
      }).toThrow('DATE partition projection range must not contain empty strings');
    });

    test.each(['', '   '])('throws when format=%p is empty', (format) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({
          min: '2020-01-01',
          max: '2023-12-31',
          format,
        });
      }).toThrow('DATE partition projection format must be a non-empty string');
    });

    test.each([
      'yyyy-MM-dd',
      'yyyy/MM/dd/HH',
      "yyyyMMdd'T'HHmmss",
      "yyyy-MM-dd''HH",
    ])('accepts valid format=%p', (format) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({
          min: '2020-01-01',
          max: '2023-12-31',
          format,
        });
      }).not.toThrow();
    });

    test.each([
      ['yyyy-bb-dd', ['b']],
      ['yyyy-MM-ddJ', ['J']],
    ])('throws when format=%p contains invalid characters %p', (format, invalidChars) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({
          min: '2020-01-01',
          max: '2023-12-31',
          format,
        });
      }).toThrow(`DATE partition projection format contains invalid pattern characters: ${invalidChars.join(', ')}. Must use Java DateTimeFormatter valid pattern letters.`);
    });

    test('throws when format has unclosed single quote', () => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({
          min: '2020-01-01',
          max: '2023-12-31',
          format: "yyyy-MM-dd'T",
        });
      }).toThrow("DATE partition projection format has an unclosed single quote: 'yyyy-MM-dd'T'");
    });

    test.each([0, -1, 1.5])('throws when interval=%p is invalid', (interval) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.date({
          min: '2020-01-01',
          max: '2023-12-31',
          format: 'yyyy-MM-dd',
          interval,
        });
      }).toThrow(`DATE partition projection interval must be a positive integer, but got ${interval}`);
    });
  });

  describe('ENUM validation', () => {
    test('throws when values is empty array', () => {
      expect(() => {
        glue.PartitionProjectionConfiguration.enum({
          values: [],
        });
      }).toThrow('ENUM partition projection values must be a non-empty array');
    });

    test.each([
      [['us-east-1', '', 'us-west-2']],
      [['us-east-1', '   ', 'us-west-2']],
    ])('throws when values=%p contains empty string', (values) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.enum({ values });
      }).toThrow('ENUM partition projection values must not contain empty strings');
    });

    test.each([
      [['value,with,commas', 'normal'], 0],
      [['normal', 'also,bad'], 1],
    ])('throws when values=%p contains comma at index %p', (values, index) => {
      expect(() => {
        glue.PartitionProjectionConfiguration.enum({ values });
      }).toThrow(`ENUM partition projection values must not contain commas because the values are serialized as a comma-separated list, got: '${values[index]}'`);
    });
  });
});
