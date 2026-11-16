// The matcher engine lives in the internal `matching/` module (staged for a future
// public submodule). Re-exported here to keep the `aws-cdk-lib/assertions` public API
// (`Capture`) stable.
export * from '../../matching/lib/capture';
