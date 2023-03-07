import * as os from 'os';
import { table } from 'table';
import { ConstructTrace, ConstructTree } from './construct-tree';
import { Node } from '../../private/tree-metadata';
import * as report from '../report';
/**
 * The report emitted by the plugin after evaluation.
 */
export class ValidationReportFormatter {
  constructor(private readonly tree: ConstructTree) {}

  /**
   * Get the stack trace from the construct node metadata.
   * The stack trace only gets recorded if the node is a `CfnResource`,
   * but the stack trace will have entries for all types of parent construct
   * scopes
   */
  private getTraceMetadata(node?: Node): string[] {
    if (node) {
      const construct = this.tree.getConstructByPath(node.path);
      if (construct) {
        const trace = construct.node.defaultChild?.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
        return Object.create(trace);
      }
    }
    return [];
  }

  /**
   * Construct the stack trace of constructs. This will start with the
   * resource that has a violation and then go up through it's parents
   */
  private getConstructTrace(node: Node, locations?: string[]): ConstructTrace {
    const trace = this.tree.getTraceFromCache(node.path);
    if (trace) {
      return trace;
    }
    const metadata = locations ?? this.getTraceMetadata(node);
    const thisLocation = metadata.shift();
    const constructTrace = {
      id: node.id,
      path: node.path,
      parent: node.parent ? this.getConstructTrace(node?.parent, metadata) : undefined,
      library: node.constructInfo?.fqn,
      libraryVersion: node.constructInfo?.version,
      location: thisLocation,
    };
    this.tree.setTraceCache(constructTrace.path, constructTrace);
    return constructTrace;
  }

  /**
   * - Creation Stack:
   *     └──  Bucket (validator-test/MyCustomL3Construct/Bucket)
   *          │ Library: @aws-cdk/aws-s3.Bucket
   *          │ Library Version: 0.0.0
   *          │ Location: new Bucket (node_modules/@aws-cdk/aws-s3/lib/bucket.js:688:26)
   *          └──  MyCustomL3Construct (validator-test/MyCustomL3Construct)
   *               │ Library: constructs.Construct
   *               │ Library Version: 10.1.235
   *               │ Location: new MyCustomL3Construct (/home/packages/@aws-cdk-testing/core-integ/test/integ.core-validations.js:30:9)
   *               └──  validator-test (validator-test)
   *                    │ Library: @aws-cdk/core.Stack
   *                    │ Library Version: 0.0.0
   *                    │ Location: new MyStack (/home/packages/@aws-cdk-testing/core-integ/test/integ.core-validations.js:24:9)
   */
  private trace(constructPath?: string): string {
    const notAvailableMessage = '\tConstruct trace not available. Rerun with `--debug` to see trace information';
    const starter = '└── ';
    const vertical = '│';
    function renderTraceInfo(info?: ConstructTrace, indent?: string, start: string = starter): string {
      if (info) {
        const indentation = indent ?? ' '.repeat(starter.length+1);
        const result: string[] = [
          `${start} ${info?.id} (${info?.path})`,
          `${indentation}${vertical} Library: ${info?.library}`,
          `${indentation}${vertical} Library Version: ${info?.libraryVersion}`,
          `${indentation}${vertical} Location: ${info?.location}`,
          ...info?.parent ? [renderTraceInfo(info?.parent, ' '.repeat(indentation.length+starter.length+1), indentation+starter)] : [],
        ];
        return result.join('\n\t');
      }
      return notAvailableMessage;
    }
    if (constructPath) {
      const treeNode = this.tree.getTreeNode(constructPath);
      if (treeNode) {
        const traceInfo = this.getConstructTrace(treeNode);
        return renderTraceInfo(traceInfo);
      }
    }
    return notAvailableMessage;
  }

  public toString(reps: report.ValidationReport[]): string {
    const json = this.toJson(reps);
    const output = [json.title];

    output.push('-'.repeat(json.title.length));
    json.pluginReports.forEach(plugin => {
      output.push('');
      output.push('(Summary)');
      output.push('');
      output.push(table([
        ['Status', plugin.summary.status],
        ['Plugin', plugin.summary.pluginName],
        ...Object.entries(plugin.summary.metadata ?? {}),
      ]));

      if (plugin.violations.length > 0) {
        output.push('');
        output.push('(Violations)');
      }

      plugin.violations.forEach((violation) => {
        const constructs = violation.violatingConstructs;
        const occurrences = constructs.length;
        const title = reset(red(bright(`${violation.ruleName} (${occurrences} occurrences)`)));
        output.push('');
        output.push(title);
        output.push('');
        output.push('  Occurrences:');
        for (const construct of constructs) {
          output.push('');
          output.push(`    - Construct Path: ${construct.constructPath}`);
          output.push(`    - Template Path: ${construct.templatePath}`);
          output.push(`    - Creation Stack:\n\t${construct.constructStack}`);
          output.push(`    - Resource Name: ${construct.resourceName}`);
          if (construct.locations) {
            output.push('    - Locations:');
            for (const location of construct.locations) {
              output.push(`      > ${location}`);
            }
          }
        }
        output.push('');
        output.push(`  Recommendation: ${plugin.violations[0].recommendation}`);
        if (plugin.violations[0].fix) {
          output.push(`  How to fix: ${plugin.violations[0].fix}`);
        }
      });

    });

    return output.join(os.EOL);
  }

  public toJson(reps: report.ValidationReport[]): report.ValidationReportJson {
    return {
      title: 'Validation Report',
      pluginReports: reps
        .filter(rep => !rep.success)
        .map(rep => ({
          summary: {
            pluginName: rep.pluginName,
            status: rep.success ? report.ValidationReportStatus.SUCCESS : report.ValidationReportStatus.FAILURE,
            metadata: rep.metadata,
          },
          violations: rep.violations.map(violation => ({
            ruleName: violation.ruleName,
            recommendation: violation.recommendation,
            fix: violation.fix,
            violatingConstructs: violation.violatingResources.map(resource => {
              const constructPath = this.tree.getConstructByResourceName(resource.resourceName)?.node.path;
              return {
                constructStack: this.trace(constructPath),
                constructPath: constructPath ?? 'N/A',
                locations: resource.locations,
                resourceName: resource.resourceName,
                templatePath: resource.templatePath,
              };
            }),
          })),
        })),
    };
  }
}


function reset(s: string) {
  return `${s}\x1b[0m`;
}

function red(s: string) {
  return `\x1b[31m${s}`;
}

function bright(s: string) {
  return `\x1b[1m${s}`;
}
