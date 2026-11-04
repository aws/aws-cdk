// The matcher engine was moved to `core` so it can be reused by other parts of
// the framework (e.g. warning suppression). This module re-exports it to keep
// the `aws-cdk-lib/assertions` public API (`Capture`) stable.
export * from '../../core/lib/matcher/capture';
