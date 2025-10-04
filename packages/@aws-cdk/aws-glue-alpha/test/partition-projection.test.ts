import * as glue from '../lib';

describe('DateIntervalUnit', () => {
  test('has correct enum values', () => {
    expect(glue.DateIntervalUnit.YEARS).toBe('YEARS');
    expect(glue.DateIntervalUnit.MONTHS).toBe('MONTHS');
    expect(glue.DateIntervalUnit.WEEKS).toBe('WEEKS');
    expect(glue.DateIntervalUnit.DAYS).toBe('DAYS');
    expect(glue.DateIntervalUnit.HOURS).toBe('HOURS');
    expect(glue.DateIntervalUnit.MINUTES).toBe('MINUTES');
    expect(glue.DateIntervalUnit.SECONDS).toBe('SECONDS');
  });

  test('has all 7 interval units', () => {
    const values = Object.values(glue.DateIntervalUnit);
    expect(values).toHaveLength(7);
    expect(values).toContain('YEARS');
    expect(values).toContain('MONTHS');
    expect(values).toContain('WEEKS');
    expect(values).toContain('DAYS');
    expect(values).toContain('HOURS');
    expect(values).toContain('MINUTES');
    expect(values).toContain('SECONDS');
  });
});

describe('PartitionProjectionConfiguration', () => {
  describe('Integer', () => {
    test('creates INTEGER configuration with required fields only', () => {
      const config = glue.PartitionProjectionConfiguration.integer({
        range: [0, 100],
      });

      expect(config.type).toBe(glue.PartitionProjectionType.INTEGER);
      expect(config.range).toEqual([0, 100]);
      expect(config.interval).toBeUndefined();
      expect(config.digits).toBeUndefined();
      expect(config.format).toBeUndefined();
      expect(config.intervalUnit).toBeUndefined();
      expect(config.values).toBeUndefined();
    });

    test('creates INTEGER configuration with all fields', () => {
      const config = glue.PartitionProjectionConfiguration.integer({
        range: [2020, 2023],
        interval: 1,
        digits: 4,
      });

      expect(config.type).toBe(glue.PartitionProjectionType.INTEGER);
      expect(config.range).toEqual([2020, 2023]);
      expect(config.interval).toBe(1);
      expect(config.digits).toBe(4);
    });
  });

  describe('Date', () => {
    test('creates DATE configuration with required fields only', () => {
      const config = glue.PartitionProjectionConfiguration.date({
        range: ['2020-01-01', '2023-12-31'],
        format: 'yyyy-MM-dd',
      });

      expect(config.type).toBe(glue.PartitionProjectionType.DATE);
      expect(config.range).toEqual(['2020-01-01', '2023-12-31']);
      expect(config.format).toBe('yyyy-MM-dd');
      expect(config.interval).toBeUndefined();
      expect(config.intervalUnit).toBeUndefined();
    });

    test('creates DATE configuration with all fields', () => {
      const config = glue.PartitionProjectionConfiguration.date({
        range: ['2020-01-01', '2023-12-31'],
        format: 'yyyy-MM-dd',
        interval: 1,
        intervalUnit: glue.DateIntervalUnit.WEEKS,
      });

      expect(config.type).toBe(glue.PartitionProjectionType.DATE);
      expect(config.range).toEqual(['2020-01-01', '2023-12-31']);
      expect(config.format).toBe('yyyy-MM-dd');
      expect(config.interval).toBe(1);
      expect(config.intervalUnit).toBe(glue.DateIntervalUnit.WEEKS);
    });

    test('accepts DateIntervalUnit enum values', () => {
      const config = glue.PartitionProjectionConfiguration.date({
        range: ['2020-01-01', '2023-12-31'],
        format: 'yyyy-MM-dd',
        intervalUnit: glue.DateIntervalUnit.DAYS,
      });

      expect(config.intervalUnit).toBe('DAYS');
    });
  });

  describe('Enum', () => {
    test('creates ENUM configuration', () => {
      const config = glue.PartitionProjectionConfiguration.enum({
        values: ['us-east-1', 'us-west-2', 'eu-west-1'],
      });

      expect(config.type).toBe(glue.PartitionProjectionType.ENUM);
      expect(config.values).toEqual(['us-east-1', 'us-west-2', 'eu-west-1']);
      expect(config.range).toBeUndefined();
      expect(config.interval).toBeUndefined();
      expect(config.format).toBeUndefined();
    });
  });

  describe('Injected', () => {
    test('creates INJECTED configuration', () => {
      const config = glue.PartitionProjectionConfiguration.injected();

      expect(config.type).toBe(glue.PartitionProjectionType.INJECTED);
      expect(config.range).toBeUndefined();
      expect(config.interval).toBeUndefined();
      expect(config.values).toBeUndefined();
      expect(config.format).toBeUndefined();
    });
  });

  describe('renderParameters', () => {
    test('renders INTEGER parameters with all fields', () => {
      const config = glue.PartitionProjectionConfiguration.integer({
        range: [2020, 2023],
        interval: 1,
        digits: 4,
      });

      const params = config._renderParameters('year');

      expect(params).toEqual({
        'projection.year.type': 'integer',
        'projection.year.range': '2020,2023',
        'projection.year.interval': '1',
        'projection.year.digits': '4',
      });
    });

    test('renders INTEGER parameters with required fields only', () => {
      const config = glue.PartitionProjectionConfiguration.integer({
        range: [0, 100],
      });

      const params = config._renderParameters('year');

      expect(params).toEqual({
        'projection.year.type': 'integer',
        'projection.year.range': '0,100',
      });
    });

    test('renders DATE parameters with all fields', () => {
      const config = glue.PartitionProjectionConfiguration.date({
        range: ['2020-01-01', '2023-12-31'],
        format: 'yyyy-MM-dd',
        interval: 1,
        intervalUnit: glue.DateIntervalUnit.DAYS,
      });

      const params = config._renderParameters('date');

      expect(params).toEqual({
        'projection.date.type': 'date',
        'projection.date.range': '2020-01-01,2023-12-31',
        'projection.date.format': 'yyyy-MM-dd',
        'projection.date.interval': '1',
        'projection.date.interval.unit': 'DAYS',
      });
    });

    test('renders DATE parameters with required fields only', () => {
      const config = glue.PartitionProjectionConfiguration.date({
        range: ['2020-01-01', '2023-12-31'],
        format: 'yyyy-MM-dd',
      });

      const params = config._renderParameters('date');

      expect(params).toEqual({
        'projection.date.type': 'date',
        'projection.date.range': '2020-01-01,2023-12-31',
        'projection.date.format': 'yyyy-MM-dd',
      });
    });

    test('renders ENUM parameters', () => {
      const config = glue.PartitionProjectionConfiguration.enum({
        values: ['us-east-1', 'us-west-2'],
      });

      const params = config._renderParameters('region');

      expect(params).toEqual({
        'projection.region.type': 'enum',
        'projection.region.values': 'us-east-1,us-west-2',
      });
    });

    test('renders INJECTED parameters', () => {
      const config = glue.PartitionProjectionConfiguration.injected();

      const params = config._renderParameters('custom');

      expect(params).toEqual({
        'projection.custom.type': 'injected',
      });
    });
  });
});
