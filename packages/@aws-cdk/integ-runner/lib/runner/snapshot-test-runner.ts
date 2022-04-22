import * as path from 'path';
import { Writable, WritableOptions } from 'stream';
import { StringDecoder, NodeStringDecoder } from 'string_decoder';
import { diffTemplate, formatDifferences, ResourceDifference, ResourceImpact } from '@aws-cdk/cloudformation-diff';
import { Diagnostic, DiagnosticReason, DestructiveChange } from '../workers/common';
import { canonicalizeTemplate } from './private/canonicalize-assets';
import { AssemblyManifestReader } from './private/cloud-assembly';
import { IntegRunnerOptions, IntegRunner, DEFAULT_SYNTH_OPTIONS } from './runner-base';

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
  public testSnapshot(): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    try {
      // read the existing snapshot
      const expectedStacks = this.readAssembly(this.snapshotDir);

      const env: Record<string, any> = {
        ...DEFAULT_SYNTH_OPTIONS.env,
        CDK_CONTEXT_JSON: JSON.stringify(this.getContext()),
      };
      // synth the integration test
      this.cdk.synthFast({
        execCmd: this.cdkApp.split(' '),
        env,
        output: this.cdkOutDir,
      });
      const actualStacks = this.readAssembly(path.join(this.directory, this.cdkOutDir));

      // diff the existing snapshot (expected) with the integration test (actual)
      const diagnostics = this.diffAssembly(expectedStacks, actualStacks);
      return diagnostics;
    } catch (e) {
      throw e;
    } finally {
      this.cleanup();
    }
  }

  /**
   * For a given stack return all resource types that are allowed to be destroyed
   * as part of a stack update
   *
   * @param stackId the stack id
   * @returns a list of resource types or undefined if none are found
   */
  private getAllowedDestroyTypesForStack(stackId: string): string[] | undefined {
    for (const testCase of Object.values(this.tests ?? {})) {
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
    existing: Record<string, any>,
    actual: Record<string, any>,
  ): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    const failures: Diagnostic[] = [];
    const destructiveChanges: DestructiveChange[] = [];

    // check if there is a CFN template in the current snapshot
    // that does not exist in the "actual" snapshot
    for (const templateId of Object.keys(existing)) {
      if (!actual.hasOwnProperty(templateId)) {
        failures.push({
          testName: this.testName,
          reason: DiagnosticReason.SNAPSHOT_FAILED,
          message: `${templateId} exists in snapshot, but not in actual`,
        });
      }
    }

    for (const templateId of Object.keys(actual)) {
      // check if there is a CFN template in the "actual" snapshot
      // that does not exist in the current snapshot
      if (!existing.hasOwnProperty(templateId)) {
        failures.push({
          testName: this.testName,
          reason: DiagnosticReason.SNAPSHOT_FAILED,
          message: `${templateId} does not exist in snapshot, but does in actual`,
        });
      } else {
        let actualTemplate = actual[templateId];
        let expectedTemplate = existing[templateId];
        const allowedDestroyTypes = this.getAllowedDestroyTypesForStack(templateId) ?? [];

        // if we are not verifying asset hashes then remove the specific
        // asset hashes from the templates so they are not part of the diff
        // comparison
        if (!this.testSuite?.getOptionsForStack(templateId)?.diffAssets) {
          actualTemplate = canonicalizeTemplate(actualTemplate);
          expectedTemplate = canonicalizeTemplate(expectedTemplate);
        }
        const templateDiff = diffTemplate(expectedTemplate, actualTemplate);
        if (!templateDiff.isEmpty) {
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
            testName: this.testName,
          });
        }
      }
    }

    return {
      diagnostics: failures,
      destructiveChanges,
    };
  }

  private readAssembly(dir: string): Record<string, any> {
    const assembly = AssemblyManifestReader.fromPath(dir);
    const stacks = assembly.stacks;

    return stacks;
  }
}

class StringWritable extends Writable {
  public data: string;
  private _decoder: NodeStringDecoder;
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
