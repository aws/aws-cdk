#!/usr/bin/env node

/**
 * Writes lib/sdk-api-metadata.generated.ts from the metadata gathered from the
 * aws-sdk package.
 */

const fs = require('fs');
const path = require('path');

const packageInfo = require('aws-sdk/package.json');
const sdkMetadata = require('aws-sdk/apis/metadata.json');

fs.writeFileSync(
  path.resolve(__dirname, '..', 'lib', 'sdk-api-metadata.generated.ts'),
  [
    'export interface AwsSdkMetadata {',
    '  readonly [service: string]: {',
    '    readonly name: string;',
    '    readonly cors?: boolean;',
    '    readonly dualstackAvailable?: boolean;',
    '    readonly prefix?: string;',
    '    readonly versions?: readonly string[];',
    '    readonly xmlNoDefaultLists?: boolean;',
    '    readonly [key: string]: unknown;',
    '  };',
    '}',
    '',
    // The generated code is probably not going to be super clean as far as linters are concerned...
    '/* eslint-disable */',
    '/* tslint:disable */',
    '',
    // Just mention where the data comes from, as a basic courtesy...
    '/**',
    ` * Extracted from ${packageInfo.name} version ${packageInfo.version} (${packageInfo.license}).`,
    ' */',
    // And finally, we export the data:
    `export const metadata: AwsSdkMetadata = ${JSON.stringify(sdkMetadata, null, 2)};`,
  ].join('\n'),
);
