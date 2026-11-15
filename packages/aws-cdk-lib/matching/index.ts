// ---------------------------------------------------------------------------
// Value matcher engine.
//
// This directory is the eventual home of a public `aws-cdk-lib.matching`
// submodule. For now it is INTERNAL: it is deliberately NOT wired as a public
// submodule — it is not re-exported from the package root `index.ts`, has no
// `.jsiirc.json`, and no `exports` entry — so none of these types appear in the
// public jsii API surface.
//
// The engine was relocated here (out of `aws-cdk-lib/assertions`, which depends
// on `core` and therefore cannot be consumed by it) so that `core` features —
// currently context-scoped warning suppression — can reuse it internally. The
// public `aws-cdk-lib/assertions` surface (`Match`, `Matcher`, `Capture`, ...)
// is preserved by re-export shims in `assertions/lib`.
//
// Placing the files at this top-level path now means that promoting them to a
// real public `matching` submodule later is purely additive (add `.jsiirc.json`,
// one root `export * as matching`, and one `exports` entry) with no file move.
// Until that deliberate decision is made, these remain internal and may still
// be relocated.
// ---------------------------------------------------------------------------
export * from './lib/matcher';
export * from './lib/match';
export * from './lib/capture';
