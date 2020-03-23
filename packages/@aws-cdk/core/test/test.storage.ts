import { Test } from 'nodeunit';
import { Stack, Storage, Token } from '../lib';

export = {
  'negative amount'(test: Test) {
    test.throws(() => Storage.kibibytes(-1), /negative/);

    test.done();
  },

  'unresolved amount'(test: Test) {
    const stack = new Stack();
    const lazyStorage = Storage.kibibytes(Token.asNumber({ resolve: () => 1337 }));
    test.equals(stack.resolve(lazyStorage.toKibibytes()), 1337);
    test.throws(
      () => stack.resolve(lazyStorage.toMebibytes()),
      /Unable to perform time unit conversion on un-resolved token/
    );

    test.done();
  },

  'Storage in kibibytes'(test: Test) {
    const storage = Storage.kibibytes(4_294_967_296);

    test.equal(storage.toKibibytes(), 4_294_967_296);
    test.equal(storage.toMebibytes(), 4_194_304);
    test.equal(storage.toGibibytes(), 4_096);
    test.equal(storage.toTebibytes(), 4);
    test.throws(() => storage.toPebibytes(), /'4294967296 kibibytes' cannot be converted into a whole number/);
    floatEqual(test, storage.toPebibytes({ integral: false }), 4_294_967_296 / (1024 * 1024 * 1024 * 1024));

    test.equal(Storage.kibibytes(4 * 1024 * 1024).toGibibytes(), 4);

    test.done();
  },

  'Storage in mebibytes'(test: Test) {
    const storage = Storage.mebibytes(4_194_304);

    test.equal(storage.toKibibytes(), 4_294_967_296);
    test.equal(storage.toMebibytes(), 4_194_304);
    test.equal(storage.toGibibytes(), 4_096);
    test.equal(storage.toTebibytes(), 4);
    test.throws(() => storage.toPebibytes(), /'4194304 mebibytes' cannot be converted into a whole number/);
    floatEqual(test, storage.toPebibytes({ integral: false }), 4_194_304 / (1024 * 1024 * 1024));

    test.equal(Storage.mebibytes(4 * 1024).toGibibytes(), 4);

    test.done();
  },

  'Storage in gibibyte'(test: Test) {
    const storage = Storage.gibibytes(5);

    test.equal(storage.toKibibytes(), 5_242_880);
    test.equal(storage.toMebibytes(), 5_120);
    test.equal(storage.toGibibytes(), 5);
    test.throws(() => storage.toTebibytes(), /'5 gibibytes' cannot be converted into a whole number/);
    floatEqual(test, storage.toTebibytes({ integral: false }), 5 / 1024);
    test.throws(() => storage.toPebibytes(), /'5 gibibytes' cannot be converted into a whole number/);
    floatEqual(test, storage.toPebibytes({ integral: false }), 5 / (1024 * 1024));

    test.equal(Storage.gibibytes(4096).toTebibytes(), 4);

    test.done();
  },

  'Storage in tebibyte'(test: Test) {
    const storage = Storage.tebibytes(5);

    test.equal(storage.toKibibytes(), 5_368_709_120);
    test.equal(storage.toMebibytes(), 5_242_880);
    test.equal(storage.toGibibytes(), 5_120);
    test.equal(storage.toTebibytes(), 5);
    test.throws(() => storage.toPebibytes(), /'5 tebibytes' cannot be converted into a whole number/);
    floatEqual(test, storage.toPebibytes({ integral: false }), 5 / 1024);

    test.equal(Storage.tebibytes(4096).toPebibytes(), 4);

    test.done();
  },

  'Storage in pebibyte'(test: Test) {
    const storage = Storage.pebibyte(5);

    test.equal(storage.toKibibytes(), 5_497_558_138_880);
    test.equal(storage.toMebibytes(), 5_368_709_120);
    test.equal(storage.toGibibytes(), 5_242_880);
    test.equal(storage.toTebibytes(), 5_120);
    test.equal(storage.toPebibytes(), 5);

    test.done();
  },
};

function floatEqual(test: Test, actual: number, expected: number) {
  test.ok(
    // Floats are subject to rounding errors up to Number.ESPILON
    actual >= expected - Number.EPSILON && actual <= expected + Number.EPSILON,
    `${actual} == ${expected}`,
  );
}
