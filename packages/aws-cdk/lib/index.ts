export * from './api';
export { cli, exec } from './cli/cli';

// Re-export the legacy exports under a name
// We import and re-export them from the index.ts file to generate a single bundle of all code and dependencies
export * as legacy from './legacy-exports-source';
