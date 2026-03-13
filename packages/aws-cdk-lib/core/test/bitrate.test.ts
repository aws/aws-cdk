import { Bitrate } from '../lib';

describe('bitrate', () => {
  test('negative amount', () => {
    expect(() => Bitrate.bps(-1)).toThrow(/negative/);
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

    expect(bitrate.toBps()).toEqual(500000);
    expect(bitrate.toKbps()).toEqual(500);
    expect(bitrate.toMbps()).toEqual(0.5);
    expect(bitrate.toGbps()).toEqual(0.0005);
  });

  test('Bitrate in mbps', () => {
    const bitrate = Bitrate.mbps(10);

    expect(bitrate.toBps()).toEqual(10000000);
    expect(bitrate.toKbps()).toEqual(10000);
    expect(bitrate.toMbps()).toEqual(10);
    expect(bitrate.toGbps()).toEqual(0.01);
  });

  test('Bitrate in gbps', () => {
    const bitrate = Bitrate.gbps(1);

    expect(bitrate.toBps()).toEqual(1000000000);
    expect(bitrate.toKbps()).toEqual(1000000);
    expect(bitrate.toMbps()).toEqual(1000);
    expect(bitrate.toGbps()).toEqual(1);
  });

  test('fractional kbps', () => {
    const bitrate = Bitrate.kbps(1.5);

    expect(bitrate.toBps()).toEqual(1500);
    expect(bitrate.toKbps()).toEqual(1.5);
  });

  test('fractional mbps', () => {
    const bitrate = Bitrate.mbps(2.5);

    expect(bitrate.toBps()).toEqual(2500000);
    expect(bitrate.toMbps()).toEqual(2.5);
  });

  test('fractional gbps', () => {
    const bitrate = Bitrate.gbps(0.5);

    expect(bitrate.toBps()).toEqual(500000000);
    expect(bitrate.toMbps()).toEqual(500);
    expect(bitrate.toGbps()).toEqual(0.5);
  });
});
