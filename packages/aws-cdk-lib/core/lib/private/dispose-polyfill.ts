// This file needs to be imported as one of the first files in the library.
// It polyfills some symbols that the new JavaScript "Disposable" API introduces.
//
// See <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html>
//
// In short, the new proposal is a `using`/`await using` statement, which will automatically
// call methods named `[Symbol.dispose]` and `[Symbol.asyncDispose]` on objects.
//
// TypeScript knows about those symbols, and it will downlevel the `using` syntax to
// plain JavaScript... but it doesn't define the Symbols themselves! They must exist
// in the environment, or code defining objects using those Symbol names will fail.
//
// MDN doesn't even know that Node 22 has them already; for broadest compatibility,
// we just polyfill them here. Their value doesn't matter, they just need to exist
// and be unique symbols.
(Symbol as any).dispose ??= Symbol('Symbol.dispose');
(Symbol as any).asyncDispose ??= Symbol('Symbol.asyncDispose');
