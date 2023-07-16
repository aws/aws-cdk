/**
 * Writes aws-events-targets/lib/sdk-api-metadata.generated.ts from the metadata gathered from the
 * aws-sdk package.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sdkMetadata from 'aws-sdk/apis/metadata.json';
import * as packageInfo from 'aws-sdk/package.json';
import { ModuleMap } from '../codegen';

export default async function awsEventsTargets(_moduleMap: ModuleMap, outPath: string) {
  fs.writeFileSync(
    path.resolve(outPath, 'aws-events-targets', 'lib', 'sdk-api-metadata.generated.ts'),
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
}
