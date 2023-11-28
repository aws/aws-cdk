import { Capacity, CapacityMode } from '../lib';

describe('fixed capacity', () => {
  // GIVEN
  let capacity: Capacity;
  beforeEach(() => {
    capacity = Capacity.fixed(10);
  });

  test('can render read capacity', () => {
    // WHEN / THEN
    expect(capacity._renderReadCapacity()).toEqual({ readCapacityUnits: 10 });
  });

  test('capacity mode is FIXED', () => {
    // WHEN / THEN
    expect(capacity.mode).toEqual(CapacityMode.FIXED);
  });

  test('throws if rendering write capacity', () => {
    // WHEN / THEN
    expect(() => {
      capacity._renderWriteCapacity();
    }).toThrow("You cannot configure 'writeCapacity' with FIXED capacity mode");
  });
});

describe('autoscaled capacity', () => {
  test('can render read capacity', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ maxCapacity: 10 });

    // WHEN / THEN
    expect(capacity._renderReadCapacity()).toEqual({
      readCapacityAutoScalingSettings: {
        minCapacity: 1,
        maxCapacity: 10,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: 70,
        },
      },
    });
  });

  test('can render write capacity', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ maxCapacity: 10 });

    // WHEN / THEN
    expect(capacity._renderWriteCapacity()).toEqual({
      writeCapacityAutoScalingSettings: {
        minCapacity: 1,
        maxCapacity: 10,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: 70,
        },
      },
    });
  });

  test('can render capacity with non-default min capacity', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ minCapacity: 5, maxCapacity: 10 });

    // WHEN / THEN
    expect(capacity._renderReadCapacity()).toEqual({
      readCapacityAutoScalingSettings: {
        minCapacity: 5,
        maxCapacity: 10,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: 70,
        },
      },
    });
  });

  test('can render capacity with non-default target utilization', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ maxCapacity: 10, targetUtilizationPercent: 50 });

    // WHEN / THEN
    expect(capacity._renderReadCapacity()).toEqual({
      readCapacityAutoScalingSettings: {
        minCapacity: 1,
        maxCapacity: 10,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: 50,
        },
      },
    });
  });

  test('can specify seed capacity', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ maxCapacity: 10, seedCapacity: 20 });

    // WHEN / THEN
    expect(capacity._renderReadCapacity()).toEqual({
      readCapacityAutoScalingSettings: {
        minCapacity: 1,
        maxCapacity: 10,
        seedCapacity: 20,
        targetTrackingScalingPolicyConfiguration: {
          targetValue: 70,
        },
      },
    });
  });

  test('capacity mode is AUTOSCALED', () => {
    // GIVEN
    const capacity = Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 });

    // WHEN / THEN
    expect(capacity.mode).toEqual(CapacityMode.AUTOSCALED);
  });

  test('throws if minimum capacity is greater than maximum capacity', () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      Capacity.autoscaled({ minCapacity: 11, maxCapacity: 10 });
    }).toThrow('`minCapacity` must be less than or equal to `maxCapacity`');
  });

  test('throws if target utilization is less than 20', () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      Capacity.autoscaled({ maxCapacity: 10, targetUtilizationPercent: 19 });
    }).toThrow('`targetUtilizationPercent` cannot be less than 20 or greater than 90');
  });

  test('throws if target utilization is greater than 90', () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      Capacity.autoscaled({ maxCapacity: 10, targetUtilizationPercent: 91 });
    }).toThrow('`targetUtilizationPercent` cannot be less than 20 or greater than 90');
  });

  test('throws if seed capacity is less than 1', () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      Capacity.autoscaled({ maxCapacity: 10, seedCapacity: 0 });
    }).toThrow("'seedCapacity' cannot be less than 1 - received 0");
  });
});
