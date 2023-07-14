"use strict";
// --------------------------------------------------------------------------------
// This file declares context keys that are used by the CLI to control the
// behavior of CDK apps. Contrary to feature flags (which are defined under
// `features.ts`) these options are not bound to be removed in the next major
// version.
// --------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUNDLING_STACKS = exports.DISABLE_LOGICAL_ID_METADATA = exports.DISABLE_METADATA_STACK_TRACE = exports.DISABLE_ASSET_STAGING_CONTEXT = exports.ANALYTICS_REPORTING_ENABLED_CONTEXT = exports.PATH_METADATA_ENABLE_CONTEXT = void 0;
/**
 * Enables the embedding of the "aws:cdk:path" in CloudFormation template metadata.
 */
exports.PATH_METADATA_ENABLE_CONTEXT = 'aws:cdk:enable-path-metadata';
/**
 * Enable the collection and reporting of version information.
 */
exports.ANALYTICS_REPORTING_ENABLED_CONTEXT = 'aws:cdk:version-reporting';
/**
 * Disable asset staging (for use with SAM CLI).
 *
 * Disabling asset staging means that copyable assets will not be copied to the
 * output directory and will be referenced with absolute paths.
 *
 * Not copied to the output directory: this is so users can iterate on the
 * Lambda source and run SAM CLI without having to re-run CDK (note: we
 * cannot achieve this for bundled assets, if assets are bundled they
 * will have to re-run CDK CLI to re-bundle updated versions).
 *
 * Absolute path: SAM CLI expects `cwd`-relative paths in a resource's
 * `aws:asset:path` metadata. In order to be predictable, we will always output
 * absolute paths.
 */
exports.DISABLE_ASSET_STAGING_CONTEXT = 'aws:cdk:disable-asset-staging';
/**
 * If this context key is set, the CDK will stage assets under the specified
 * directory. Otherwise, assets will not be staged.
 * Omits stack traces from construct metadata entries.
 */
exports.DISABLE_METADATA_STACK_TRACE = 'aws:cdk:disable-stack-trace';
/**
 * If this context key is set, the CDK will not store logical ID
 * metadata in the manifest.
 */
exports.DISABLE_LOGICAL_ID_METADATA = 'aws:cdk:disable-logicalId-metadata';
/**
 * Run bundling for stacks specified in this context key
 */
exports.BUNDLING_STACKS = 'aws:cdk:bundling-stacks';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtRkFBbUY7QUFDbkYsMEVBQTBFO0FBQzFFLDJFQUEyRTtBQUMzRSw2RUFBNkU7QUFDN0UsV0FBVztBQUNYLG1GQUFtRjs7O0FBRW5GOztHQUVHO0FBQ1UsUUFBQSw0QkFBNEIsR0FBRyw4QkFBOEIsQ0FBQztBQUUzRTs7R0FFRztBQUNVLFFBQUEsbUNBQW1DLEdBQUcsMkJBQTJCLENBQUM7QUFFL0U7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDVSxRQUFBLDZCQUE2QixHQUFHLCtCQUErQixDQUFDO0FBRTdFOzs7O0dBSUc7QUFDVSxRQUFBLDRCQUE0QixHQUFHLDZCQUE2QixDQUFDO0FBRTFFOzs7R0FHRztBQUNVLFFBQUEsMkJBQTJCLEdBQUcsb0NBQW9DLENBQUM7QUFFaEY7O0dBRUc7QUFDVSxRQUFBLGVBQWUsR0FBRyx5QkFBeUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGlzIGZpbGUgZGVjbGFyZXMgY29udGV4dCBrZXlzIHRoYXQgYXJlIHVzZWQgYnkgdGhlIENMSSB0byBjb250cm9sIHRoZVxuLy8gYmVoYXZpb3Igb2YgQ0RLIGFwcHMuIENvbnRyYXJ5IHRvIGZlYXR1cmUgZmxhZ3MgKHdoaWNoIGFyZSBkZWZpbmVkIHVuZGVyXG4vLyBgZmVhdHVyZXMudHNgKSB0aGVzZSBvcHRpb25zIGFyZSBub3QgYm91bmQgdG8gYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvclxuLy8gdmVyc2lvbi5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogRW5hYmxlcyB0aGUgZW1iZWRkaW5nIG9mIHRoZSBcImF3czpjZGs6cGF0aFwiIGluIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgUEFUSF9NRVRBREFUQV9FTkFCTEVfQ09OVEVYVCA9ICdhd3M6Y2RrOmVuYWJsZS1wYXRoLW1ldGFkYXRhJztcblxuLyoqXG4gKiBFbmFibGUgdGhlIGNvbGxlY3Rpb24gYW5kIHJlcG9ydGluZyBvZiB2ZXJzaW9uIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgY29uc3QgQU5BTFlUSUNTX1JFUE9SVElOR19FTkFCTEVEX0NPTlRFWFQgPSAnYXdzOmNkazp2ZXJzaW9uLXJlcG9ydGluZyc7XG5cbi8qKlxuICogRGlzYWJsZSBhc3NldCBzdGFnaW5nIChmb3IgdXNlIHdpdGggU0FNIENMSSkuXG4gKlxuICogRGlzYWJsaW5nIGFzc2V0IHN0YWdpbmcgbWVhbnMgdGhhdCBjb3B5YWJsZSBhc3NldHMgd2lsbCBub3QgYmUgY29waWVkIHRvIHRoZVxuICogb3V0cHV0IGRpcmVjdG9yeSBhbmQgd2lsbCBiZSByZWZlcmVuY2VkIHdpdGggYWJzb2x1dGUgcGF0aHMuXG4gKlxuICogTm90IGNvcGllZCB0byB0aGUgb3V0cHV0IGRpcmVjdG9yeTogdGhpcyBpcyBzbyB1c2VycyBjYW4gaXRlcmF0ZSBvbiB0aGVcbiAqIExhbWJkYSBzb3VyY2UgYW5kIHJ1biBTQU0gQ0xJIHdpdGhvdXQgaGF2aW5nIHRvIHJlLXJ1biBDREsgKG5vdGU6IHdlXG4gKiBjYW5ub3QgYWNoaWV2ZSB0aGlzIGZvciBidW5kbGVkIGFzc2V0cywgaWYgYXNzZXRzIGFyZSBidW5kbGVkIHRoZXlcbiAqIHdpbGwgaGF2ZSB0byByZS1ydW4gQ0RLIENMSSB0byByZS1idW5kbGUgdXBkYXRlZCB2ZXJzaW9ucykuXG4gKlxuICogQWJzb2x1dGUgcGF0aDogU0FNIENMSSBleHBlY3RzIGBjd2RgLXJlbGF0aXZlIHBhdGhzIGluIGEgcmVzb3VyY2Unc1xuICogYGF3czphc3NldDpwYXRoYCBtZXRhZGF0YS4gSW4gb3JkZXIgdG8gYmUgcHJlZGljdGFibGUsIHdlIHdpbGwgYWx3YXlzIG91dHB1dFxuICogYWJzb2x1dGUgcGF0aHMuXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFX0FTU0VUX1NUQUdJTkdfQ09OVEVYVCA9ICdhd3M6Y2RrOmRpc2FibGUtYXNzZXQtc3RhZ2luZyc7XG5cbi8qKlxuICogSWYgdGhpcyBjb250ZXh0IGtleSBpcyBzZXQsIHRoZSBDREsgd2lsbCBzdGFnZSBhc3NldHMgdW5kZXIgdGhlIHNwZWNpZmllZFxuICogZGlyZWN0b3J5LiBPdGhlcndpc2UsIGFzc2V0cyB3aWxsIG5vdCBiZSBzdGFnZWQuXG4gKiBPbWl0cyBzdGFjayB0cmFjZXMgZnJvbSBjb25zdHJ1Y3QgbWV0YWRhdGEgZW50cmllcy5cbiAqL1xuZXhwb3J0IGNvbnN0IERJU0FCTEVfTUVUQURBVEFfU1RBQ0tfVFJBQ0UgPSAnYXdzOmNkazpkaXNhYmxlLXN0YWNrLXRyYWNlJztcblxuLyoqXG4gKiBJZiB0aGlzIGNvbnRleHQga2V5IGlzIHNldCwgdGhlIENESyB3aWxsIG5vdCBzdG9yZSBsb2dpY2FsIElEXG4gKiBtZXRhZGF0YSBpbiB0aGUgbWFuaWZlc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFX0xPR0lDQUxfSURfTUVUQURBVEEgPSAnYXdzOmNkazpkaXNhYmxlLWxvZ2ljYWxJZC1tZXRhZGF0YSc7XG5cbi8qKlxuICogUnVuIGJ1bmRsaW5nIGZvciBzdGFja3Mgc3BlY2lmaWVkIGluIHRoaXMgY29udGV4dCBrZXlcbiAqL1xuZXhwb3J0IGNvbnN0IEJVTkRMSU5HX1NUQUNLUyA9ICdhd3M6Y2RrOmJ1bmRsaW5nLXN0YWNrcyc7XG4iXX0=