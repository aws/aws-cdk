import { Bitrate, Lazy } from '../lib';

describe('bitrate', () => {
  test('negative amount', () => {
    expect(() => Bitrate.bps(-1)).toThrow(/Bitrate amounts cannot be negative. Received: -1/);
  });

  test('zero is valid', () => {
    expect(Bitrate.bps(0).toBps()).toEqual(0);
  });

  test('Bitrate in bps', () => {
    const bitrate = Bitrate.bps(5000);

    expect(bitrate.toBps()).toEqual(5000);
    expect(bitrate.toKbps()).toEqual(5);
    expect(bitrate.toMbps()).toEqual(0.005);
    expect(bitrate.toGbps()).toEqual(0.000005);
  });

  test('Bitrate in kbps', () => {
    const bitrate = Bitrate.kbps(500);

    expect(bitrate.toBps()).toEqual(500_000);
    expect(bitrate.toKbps()).toEqual(500);
    expect(bitrate.toMbps()).toEqual(0.5);
    expect(bitrate.toGbps()).toEqual(0.0005);
  });

  test('Bitrate in mbps', () => {
    const bitrate = Bitrate.mbps(10);

    expect(bitrate.toBps()).toEqual(10_000_000);
    expect(bitrate.toKbps()).toEqual(10_000);
    expect(bitrate.toMbps()).toEqual(10);
    expect(bitrate.toGbps()).toEqual(0.01);
  });

  test('Bitrate in gbps', () => {
    const bitrate = Bitrate.gbps(1);

    expect(bitrate.toBps()).toEqual(1_000_000_000);
    expect(bitrate.toKbps()).toEqual(1_000_000);
    expect(bitrate.toMbps()).toEqual(1000);
    expect(bitrate.toGbps()).toEqual(1);
  });

  test('fractional kbps', () => {
    const bitrate = Bitrate.kbps(1.5);

    expect(bitrate.toBps()).toEqual(1_500);
    expect(bitrate.toKbps()).toEqual(1.5);
  });

  test('fractional mbps', () => {
    const bitrate = Bitrate.mbps(2.5);

    expect(bitrate.toBps()).toEqual(2_500_000);
    expect(bitrate.toMbps()).toEqual(2.5);
  });

  test('fractional gbps', () => {
    const bitrate = Bitrate.gbps(0.5);

    expect(bitrate.toBps()).toEqual(500_000_000);
    expect(bitrate.toMbps()).toEqual(500);
    expect(bitrate.toGbps()).toEqual(0.5);
  });

  test('negative kbps', () => {
    expect(() => Bitrate.kbps(-1)).toThrow(/Bitrate amounts cannot be negative. Received: -1/);
  });

  test('negative mbps', () => {
    expect(() => Bitrate.mbps(-1)).toThrow(/Bitrate amounts cannot be negative. Received: -1/);
  });

  test('negative gbps', () => {
    expect(() => Bitrate.gbps(-1)).toThrow(/Bitrate amounts cannot be negative. Received: -1/);
  });

  test('bitrate is unresolved', () => {
    const lazyBitrate = Bitrate.bps(Lazy.number({ produce: () => 5000 }));
    expect(lazyBitrate.isUnresolved()).toEqual(true);
    expect(Bitrate.bps(5000).isUnresolved()).toEqual(false);
  });

  test('token bps cannot convert to other units', () => {
    const lazyBitrate = Bitrate.bps(Lazy.number({ produce: () => 5000 }));

    expect(() => lazyBitrate.toKbps()).toThrow(/Bitrate must be specified as 'Bitrate.kbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.bps\)/);
    expect(() => lazyBitrate.toMbps()).toThrow(/Bitrate must be specified as 'Bitrate.mbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.bps\)/);
    expect(() => lazyBitrate.toGbps()).toThrow(/Bitrate must be specified as 'Bitrate.gbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.bps\)/);
  });

  test('token kbps cannot convert to other units', () => {
    const lazyBitrate = Bitrate.kbps(Lazy.number({ produce: () => 500 }));

    expect(() => lazyBitrate.toBps()).toThrow(/Bitrate must be specified as 'Bitrate.bps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.kbps\)/);
    expect(() => lazyBitrate.toMbps()).toThrow(/Bitrate must be specified as 'Bitrate.mbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.kbps\)/);
    expect(() => lazyBitrate.toGbps()).toThrow(/Bitrate must be specified as 'Bitrate.gbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.kbps\)/);
  });

  test('token mbps cannot convert to other units', () => {
    const lazyBitrate = Bitrate.mbps(Lazy.number({ produce: () => 10 }));

    expect(() => lazyBitrate.toBps()).toThrow(/Bitrate must be specified as 'Bitrate.bps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.mbps\)/);
    expect(() => lazyBitrate.toKbps()).toThrow(/Bitrate must be specified as 'Bitrate.kbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.mbps\)/);
    expect(() => lazyBitrate.toGbps()).toThrow(/Bitrate must be specified as 'Bitrate.gbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.mbps\)/);
  });

  test('token gbps cannot convert to other units', () => {
    const lazyBitrate = Bitrate.gbps(Lazy.number({ produce: () => 1 }));

    expect(() => lazyBitrate.toBps()).toThrow(/Bitrate must be specified as 'Bitrate.bps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.gbps\)/);
    expect(() => lazyBitrate.toKbps()).toThrow(/Bitrate must be specified as 'Bitrate.kbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.gbps\)/);
    expect(() => lazyBitrate.toMbps()).toThrow(/Bitrate must be specified as 'Bitrate.mbps\(\)' here since its value comes from a token and cannot be converted \(got Bitrate.gbps\)/);
  });

  test('token to same unit does not throw', () => {
    expect(Bitrate.bps(Lazy.number({ produce: () => 5000 })).toBps()).toBeDefined();
    expect(Bitrate.kbps(Lazy.number({ produce: () => 500 })).toKbps()).toBeDefined();
    expect(Bitrate.mbps(Lazy.number({ produce: () => 10 })).toMbps()).toBeDefined();
    expect(Bitrate.gbps(Lazy.number({ produce: () => 1 })).toGbps()).toBeDefined();
  });

  test('token does not throw on negative', () => {
    expect(() => Bitrate.bps(Lazy.number({ produce: () => -5000 }))).not.toThrow();
  });
});
