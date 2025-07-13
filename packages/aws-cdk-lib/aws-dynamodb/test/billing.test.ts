import { Billing, Capacity, BillingMode } from '../lib';

describe('on-demand billing', () => {
  // GIVEN
  let billing: Billing;
  beforeEach(() => {
    billing = Billing.onDemand();
  });

  test('render read capacity', () => {
    // WHEN / THEN
    expect(billing._renderReadCapacity()).toBeUndefined();
  });

  test('render write capacity', () => {
    // WHEN / THEN
    expect(billing._renderWriteCapacity()).toBeUndefined();
  });

  test('billing mode is PAY_PER_REQUEST', () => {
    // WHEN / THEN
    expect(billing.mode).toEqual(BillingMode.PAY_PER_REQUEST);
  });
});

describe('provisioned billing', () => {
  // GIVEN
  let billing: Billing;
  beforeEach(() => {
    billing = Billing.provisioned({
      readCapacity: Capacity.fixed(10),
      writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
    });
  });

  test('render read capacity', () => {
    // WHEN / THEN
    expect(billing._renderReadCapacity()).not.toBeUndefined();
  });

  test('render write capacity', () => {
    // WHEN / THEN
    expect(billing._renderWriteCapacity()).not.toBeUndefined();
  });

  test('billing mode is PROVISIONED', () => {
    // WHEN / THEN
    expect(billing.mode).toEqual(BillingMode.PROVISIONED);
  });
});

describe('max throughput on-demand billing', () => {
  // GIVEN
  let billing: Billing;
  beforeEach(() => {
    billing = Billing.onDemand({
      maxReadRequestUnits: 10,
      maxWriteRequestUnits: 100,
    });
  });

  test('render read capacity', () => {
    // WHEN / THEN
    expect(billing._renderReadCapacity()).toBe(10);
  });

  test('render write capacity', () => {
    // WHEN / THEN
    expect(billing._renderWriteCapacity()).toBe(100);
  });

  test('billing mode is PAY_PER_REQUEST', () => {
    // WHEN / THEN
    expect(billing.mode).toEqual(BillingMode.PAY_PER_REQUEST);
  });
});
