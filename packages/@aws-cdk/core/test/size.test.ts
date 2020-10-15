import { nodeunitShim, Test } from 'nodeunit-shim';
import { Size, SizeRoundingBehavior, Stack, Token } from '../lib';

nodeunitShim({
  'negative amount'(test: Test) {
    test.throws(() => Size.kibibytes(-1), /negative/);

    test.done();
  },

  'unresolved amount'(test: Test) {
    const stack = new Stack();
    const lazySize = Size.kibibytes(Token.asNumber({ resolve: () => 1337 }));
    test.equals(stack.resolve(lazySize.toKibibytes()), 1337);
    test.throws(
      () => stack.resolve(lazySize.toMebibytes()),
      /Unable to perform time unit conversion on un-resolved token/,
    );

    test.done();
  },

  'Size in kibibytes'(test: Test) {
    const size = Size.kibibytes(4_294_967_296);

    test.equal(size.toKibibytes(), 4_294_967_296);
    test.equal(size.toMebibytes(), 4_194_304);
    test.equal(size.toGibibytes(), 4_096);
    test.equal(size.toTebibytes(), 4);
    test.throws(() => size.toPebibytes(), /'4294967296 kibibytes' cannot be converted into a whole number/);
    floatEqual(test, size.toPebibytes({ rounding: SizeRoundingBehavior.NONE }), 4_294_967_296 / (1024 * 1024 * 1024 * 1024));

    test.equal(Size.kibibytes(4 * 1024 * 1024).toGibibytes(), 4);

    test.done();
  },

  'Size in mebibytes'(test: Test) {
    const size = Size.mebibytes(4_194_304);

    test.equal(size.toKibibytes(), 4_294_967_296);
    test.equal(size.toMebibytes(), 4_194_304);
    test.equal(size.toGibibytes(), 4_096);
    test.equal(size.toTebibytes(), 4);
    test.throws(() => size.toPebibytes(), /'4194304 mebibytes' cannot be converted into a whole number/);
    floatEqual(test, size.toPebibytes({ rounding: SizeRoundingBehavior.NONE }), 4_194_304 / (1024 * 1024 * 1024));

    test.equal(Size.mebibytes(4 * 1024).toGibibytes(), 4);

    test.done();
  },

  'Size in gibibyte'(test: Test) {
    const size = Size.gibibytes(5);

    test.equal(size.toKibibytes(), 5_242_880);
    test.equal(size.toMebibytes(), 5_120);
    test.equal(size.toGibibytes(), 5);
    test.throws(() => size.toTebibytes(), /'5 gibibytes' cannot be converted into a whole number/);
    floatEqual(test, size.toTebibytes({ rounding: SizeRoundingBehavior.NONE }), 5 / 1024);
    test.throws(() => size.toPebibytes(), /'5 gibibytes' cannot be converted into a whole number/);
    floatEqual(test, size.toPebibytes({ rounding: SizeRoundingBehavior.NONE }), 5 / (1024 * 1024));

    test.equal(Size.gibibytes(4096).toTebibytes(), 4);

    test.done();
  },

  'Size in tebibyte'(test: Test) {
    const size = Size.tebibytes(5);

    test.equal(size.toKibibytes(), 5_368_709_120);
    test.equal(size.toMebibytes(), 5_242_880);
    test.equal(size.toGibibytes(), 5_120);
    test.equal(size.toTebibytes(), 5);
    test.throws(() => size.toPebibytes(), /'5 tebibytes' cannot be converted into a whole number/);
    floatEqual(test, size.toPebibytes({ rounding: SizeRoundingBehavior.NONE }), 5 / 1024);

    test.equal(Size.tebibytes(4096).toPebibytes(), 4);

    test.done();
  },

  'Size in pebibytes'(test: Test) {
    const size = Size.pebibytes(5);

    test.equal(size.toKibibytes(), 5_497_558_138_880);
    test.equal(size.toMebibytes(), 5_368_709_120);
    test.equal(size.toGibibytes(), 5_242_880);
    test.equal(size.toTebibytes(), 5_120);
    test.equal(size.toPebibytes(), 5);

    test.done();
  },

  'rounding behavior'(test: Test) {
    const size = Size.mebibytes(5_200);

    test.throws(() => size.toGibibytes(), /cannot be converted into a whole number/);
    test.throws(() => size.toGibibytes({ rounding: SizeRoundingBehavior.FAIL }), /cannot be converted into a whole number/);

    test.equals(size.toGibibytes({ rounding: SizeRoundingBehavior.FLOOR }), 5);
    test.equals(size.toTebibytes({ rounding: SizeRoundingBehavior.FLOOR }), 0);
    floatEqual(test, size.toKibibytes({ rounding: SizeRoundingBehavior.FLOOR }), 5_324_800);

    test.equals(size.toGibibytes({ rounding: SizeRoundingBehavior.NONE }), 5.078125);
    test.equals(size.toTebibytes({ rounding: SizeRoundingBehavior.NONE }), 5200 / (1024 * 1024));
    test.equals(size.toKibibytes({ rounding: SizeRoundingBehavior.NONE }), 5_324_800);

    test.done();
  },
});

function floatEqual(test: Test, actual: number, expected: number) {
  test.ok(
    // Floats are subject to rounding errors up to Number.ESPILON
    actual >= expected - Number.EPSILON && actual <= expected + Number.EPSILON,
    `${actual} == ${expected}`,
  );
}
