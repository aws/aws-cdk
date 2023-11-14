import * as path from 'path';
import { Writable, WritableOptions } from 'stream';
import { StringDecoder } from 'string_decoder';
import { diffTemplate, formatDifferences, ResourceDifference, ResourceImpact } from '@aws-cdk/cloudformation-diff';
import { AssemblyManifestReader } from './private/cloud-assembly';
import { IntegRunnerOptions, IntegRunner, DEFAULT_SYNTH_OPTIONS } from './runner-base';
import { Diagnostic, DiagnosticReason, DestructiveChange, SnapshotVerificationOptions } from '../workers/common';

interface SnapshotAssembly {
  /**
   * Map of stacks that are part of this assembly
   */
  [stackName: string]: {
    /**
     * All templates for this stack, including nested stacks
     */
    templates: {
      [templateId: string]: any
    },

    /**
     * List of asset Ids that are used by this assembly
     */
    assets: string[]
  }
}

/**
 * Runner for snapshot tests. This handles orchestrating
 * the validation of the integration test snapshots
 */
export class IntegSnapshotRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions) {
    super(options);
  }

  /**
   * Synth the integration tests and compare the templates
   * to the existing snapshot.
   *
   * @returns any diagnostics and any destructive changes
   */
  public testSnapshot(options: SnapshotVerificationOptions = {}): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    let doClean = true;
    try {
      const expectedSnapshotAssembly = this.getSnapshotAssembly(this.snapshotDir, this.expectedTestSuite?.stacks);

      // synth the integration test
      // FIXME: ideally we should not need to run this again if
      // the cdkOutDir exists already, but for some reason generateActualSnapshot
      // generates an incorrect snapshot and I have no idea why so synth again here
      // to produce the "correct" snapshot
      const env = {
        ...DEFAULT_SYNTH_OPTIONS.env,
        CDK_CONTEXT_JSON: JSON.stringify(this.getContext({
          ...this.actualTestSuite.enableLookups ? DEFAULT_SYNTH_OPTIONS.context : {},
        })),
      };
      this.cdk.synthFast({
        execCmd: this.cdkApp.split(' '),
        env,
        output: path.relative(this.directory, this.cdkOutDir),
      });

      // read the "actual" snapshot
      const actualSnapshotAssembly = this.getSnapshotAssembly(this.cdkOutDir, this.actualTestSuite.stacks);

      // diff the existing snapshot (expected) with the integration test (actual)
      const diagnostics = this.diffAssembly(expectedSnapshotAssembly, actualSnapshotAssembly);

      if (diagnostics.diagnostics.length) {
        // Attach additional messages to the first diagnostic
        const additionalMessages: string[] = [];

        if (options.retain) {
          additionalMessages.push(
            `(Failure retained) Expected: ${path.relative(process.cwd(), this.snapshotDir)}`,
            `                   Actual:   ${path.relative(process.cwd(), this.cdkOutDir)}`,
          ),
          doClean = false;
        }

        if (options.verbose) {
          // Show the command necessary to repro this
          const envSet = Object.entries(env)
            .filter(([k, _]) => k !== 'CDK_CONTEXT_JSON')
            .map(([k, v]) => `${k}='${v}'`);
          const envCmd = envSet.length > 0 ? ['env', ...envSet] : [];

          additionalMessages.push(
            'Repro:',
            `  ${[...envCmd, 'cdk synth', `-a '${this.cdkApp}'`, `-o '${this.cdkOutDir}'`, ...Object.entries(this.getContext()).flatMap(([k, v]) => typeof v !== 'object' ? [`-c '${k}=${v}'`] : [])].join(' ')}`,

          );
        }

        diagnostics.diagnostics[0] = {
          ...diagnostics.diagnostics[0],
          additionalMessages,
        };
      }

      return diagnostics;
    } catch (e) {
      throw e;
    } finally {
      if (doClean) {
        this.cleanup();
      }
    }
  }

  /**
   * For a given cloud assembly return a collection of all templates
   * that should be part of the snapshot and any required meta data.
   *
   * @param cloudAssemblyDir The directory of the cloud assembly to look for snapshots
   * @param pickStacks Pick only these stacks from the cloud assembly
   * @returns A SnapshotAssembly, the collection of all templates in this snapshot and required meta data
   */
  private getSnapshotAssembly(cloudAssemblyDir: string, pickStacks: string[] = []): SnapshotAssembly {
    const assembly = this.readAssembly(cloudAssemblyDir);
    const stacks = assembly.stacks;
    const snapshots: SnapshotAssembly = {};
    for (const [stackName, stackTemplate] of Object.entries(stacks)) {
      if (pickStacks.includes(stackName)) {
        const manifest = AssemblyManifestReader.fromPath(cloudAssemblyDir);
        const assets = manifest.getAssetIdsForStack(stackName);

        snapshots[stackName] = {
          templates: {
            [stackName]: stackTemplate,
            ...assembly.getNestedStacksForStack(stackName),
          },
          assets,
        };
      }
    }

    return snapshots;
  }

  /**
   * For a given stack return all resource types that are allowed to be destroyed
   * as part of a stack update
   *
   * @param stackId the stack id
   * @returns a list of resource types or undefined if none are found
   */
  private getAllowedDestroyTypesForStack(stackId: string): string[] | undefined {
    for (const testCase of Object.values(this.actualTests() ?? {})) {
      if (testCase.stacks.includes(stackId)) {
        return testCase.allowDestroy;
      }
    }
    return undefined;
  }

  /**
   * Find any differences between the existing and expected snapshots
   *
   * @param existing - the existing (expected) snapshot
   * @param actual - the new (actual) snapshot
   * @returns any diagnostics and any destructive changes
   */
  private diffAssembly(
    expected: SnapshotAssembly,
    actual: SnapshotAssembly,
  ): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    const failures: Diagnostic[] = [];
    const destructiveChanges: DestructiveChange[] = [];

    // check if there is a CFN template in the current snapshot
    // that does not exist in the "actual" snapshot
    for (const [stackId, stack] of Object.entries(expected)) {
      for (const templateId of Object.keys(stack.templates)) {
        if (!actual[stackId]?.templates[templateId]) {
          failures.push({
            testName: this.testName,
            stackName: templateId,
            reason: DiagnosticReason.SNAPSHOT_FAILED,
            message: `${templateId} exists in snapshot, but not in actual`,
          });
        }
      }
    }

    for (const [stackId, stack] of Object.entries(actual)) {
      for (const templateId of Object.keys(stack.templates)) {
      // check if there is a CFN template in the "actual" snapshot
      // that does not exist in the current snapshot
        if (!expected[stackId]?.templates[templateId]) {
          failures.push({
            testName: this.testName,
            stackName: templateId,
            reason: DiagnosticReason.SNAPSHOT_FAILED,
            message: `${templateId} does not exist in snapshot, but does in actual`,
          });
          continue;
        } else {
          const config = {
            diffAssets: this.actualTestSuite.getOptionsForStack(stackId)?.diffAssets,
          };
          let actualTemplate = actual[stackId].templates[templateId];
          let expectedTemplate = expected[stackId].templates[templateId];

          // if we are not verifying asset hashes then remove the specific
          // asset hashes from the templates so they are not part of the diff
          // comparison
          if (!config.diffAssets) {
            actualTemplate = this.canonicalizeTemplate(actualTemplate, actual[stackId].assets);
            expectedTemplate = this.canonicalizeTemplate(expectedTemplate, expected[stackId].assets);
          }
          const templateDiff = diffTemplate(expectedTemplate, actualTemplate);
          if (!templateDiff.isEmpty) {
            const allowedDestroyTypes = this.getAllowedDestroyTypesForStack(stackId) ?? [];

            // go through all the resource differences and check for any
            // "destructive" changes
            templateDiff.resources.forEachDifference((logicalId: string, change: ResourceDifference) => {
            // if the change is a removal it will not show up as a 'changeImpact'
            // so need to check for it separately, unless it is a resourceType that
            // has been "allowed" to be destroyed
              const resourceType = change.oldValue?.Type ?? change.newValue?.Type;
              if (resourceType && allowedDestroyTypes.includes(resourceType)) {
                return;
              }
              if (change.isRemoval) {
                destructiveChanges.push({
                  impact: ResourceImpact.WILL_DESTROY,
                  logicalId,
                  stackName: templateId,
                });
              } else {
                switch (change.changeImpact) {
                  case ResourceImpact.MAY_REPLACE:
                  case ResourceImpact.WILL_ORPHAN:
                  case ResourceImpact.WILL_DESTROY:
                  case ResourceImpact.WILL_REPLACE:
                    destructiveChanges.push({
                      impact: change.changeImpact,
                      logicalId,
                      stackName: templateId,
                    });
                    break;
                }
              }
            });
            const writable = new StringWritable({});
            formatDifferences(writable, templateDiff);
            failures.push({
              reason: DiagnosticReason.SNAPSHOT_FAILED,
              message: writable.data,
              stackName: templateId,
              testName: this.testName,
              config,
            });
          }
        }
      }
    }

    return {
      diagnostics: failures,
      destructiveChanges,
    };
  }

  private readAssembly(dir: string): AssemblyManifestReader {
    return AssemblyManifestReader.fromPath(dir);
  }

  /**
  * Reduce template to a normal form where asset references have been normalized
  *
  * This makes it possible to compare templates if all that's different between
  * them is the hashes of the asset values.
  */
  private canonicalizeTemplate(template: any, assets: string[]): any {
    const assetsSeen = new Set<string>();
    const stringSubstitutions = new Array<[RegExp, string]>();

    // Find assets via parameters (for LegacyStackSynthesizer)
    const paramRe = /^AssetParameters([a-zA-Z0-9]{64})(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})$/;
    for (const paramName of Object.keys(template?.Parameters || {})) {
      const m = paramRe.exec(paramName);
      if (!m) { continue; }
      if (assetsSeen.has(m[1])) { continue; }

      assetsSeen.add(m[1]);
      const ix = assetsSeen.size;

      // Full parameter reference
      stringSubstitutions.push([
        new RegExp(`AssetParameters${m[1]}(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})`),
        `Asset${ix}$1`,
      ]);
      // Substring asset hash reference
      stringSubstitutions.push([
        new RegExp(`${m[1]}`),
        `Asset${ix}Hash`,
      ]);
    }

    // find assets defined in the asset manifest
    try {
      assets.forEach(asset => {
        if (!assetsSeen.has(asset)) {
          assetsSeen.add(asset);
          const ix = assetsSeen.size;
          stringSubstitutions.push([
            new RegExp(asset),
            `Asset${ix}$1`,
          ]);
        }
      });
    } catch {
      // if there is no asset manifest that is fine.
    }

    // Substitute them out
    return substitute(template);

    function substitute(what: any): any {
      if (Array.isArray(what)) {
        return what.map(substitute);
      }

      if (typeof what === 'object' && what !== null) {
        const ret: any = {};
        for (const [k, v] of Object.entries(what)) {
          ret[stringSub(k)] = substitute(v);
        }
        return ret;
      }

      if (typeof what === 'string') {
        return stringSub(what);
      }

      return what;
    }

    function stringSub(x: string) {
      for (const [re, replacement] of stringSubstitutions) {
        x = x.replace(re, replacement);
      }
      return x;
    }
  }
}

class StringWritable extends Writable {
  public data: string;
  private _decoder: StringDecoder;
  constructor(options: WritableOptions) {
    super(options);
    this._decoder = new StringDecoder();
    this.data = '';
  }

  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }

    this.data += chunk;
    callback();
  }

  _final(callback: (error?: Error | null) => void): void {
    this.data += this._decoder.end();
    callback();
  }
}
