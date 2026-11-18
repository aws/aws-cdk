// AssertionError moved to the internal `matching/` module alongside the matcher engine.
// Re-exported here so existing internal importers within `assertions` keep resolving.
export * from '../../../matching/lib/private/error';
