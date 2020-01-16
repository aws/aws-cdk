import { JestFriendlyAssertion } from '../assertion';
import { StackInspector } from '../inspector';

class HaveOutputAssertion extends JestFriendlyAssertion<StackInspector> {
  private readonly inspected: InspectionFailure[] = [];

  constructor(private readonly outputName?: string, private readonly exportName?: any, private outputValue?: any) {
    super();
    if (!this.outputName && !this.exportName) {
      throw new Error('At least one of [outputName, exportName] should be provided');
    }
  }

  public get description(): string {
    const descriptionPartsArray = new Array<string>();

    if (this.outputName) {
      descriptionPartsArray.push(`name '${this.outputName}'`);
    }
    if (this.exportName) {
      descriptionPartsArray.push(`export name ${JSON.stringify(this.exportName)}`);
    }
    if (this.outputValue) {
      descriptionPartsArray.push(`value ${JSON.stringify(this.outputValue)}`);
    }

    return 'output with ' + descriptionPartsArray.join(', ');
  }

  public assertUsing(inspector: StackInspector): boolean {
    if (!('Outputs' in inspector.value)) {
      return false;
    }

    for (const [name, props] of Object.entries(inspector.value.Outputs as Record<string, any>)) {
      const mismatchedFields = new Array<string>();

      if (this.outputName && name !== this.outputName) {
        mismatchedFields.push('name');
      }

      if (this.exportName && JSON.stringify(this.exportName) !== JSON.stringify(props.Export?.Name)) {
        mismatchedFields.push('export name');
      }

      if (this.outputValue && JSON.stringify(this.outputValue) !== JSON.stringify(props.Value)) {
        mismatchedFields.push('value');
      }

      if (mismatchedFields.length === 0) {
        return true;
      }

      this.inspected.push({
        output: { [name]: props },
        failureReason: `mismatched ${mismatchedFields.join(', ')}`,
      });
    }

    return false;
  }

  public generateErrorMessage() {
    const lines = new Array<string>();

    lines.push(`None of ${this.inspected.length} outputs matches ${this.description}.`);

    for (const inspected of this.inspected) {
      lines.push(`- ${inspected.failureReason} in:`);
      lines.push(indent(4, JSON.stringify(inspected.output, null, 2)));
    }

    return lines.join('\n');
  }
}

/**
 * Interface for haveOutput function properties
 * NOTE that at least one of [outputName, exportName] should be provided
 */
export interface HaveOutputProperties {
  /**
   * Logical ID of the output
   * @default - the logical ID of the output will not be checked
   */
  outputName?: string;
  /**
   * Export name of the output, when it's exported for cross-stack referencing
   * @default - the export name is not required and will not be checked
   */
  exportName?: any;
  /**
   * Value of the output;
   * @default - the value will not be checked
   */
  outputValue?: any;
}

interface InspectionFailure {
  output: any;
  failureReason: string;
}

/**
 * An assertion  to check whether Output with particular properties is present in a stack
 * @param props  properties of the Output that is being asserted against.
 *               Check ``HaveOutputProperties`` interface to get full list of available parameters
 */
export function haveOutput(props: HaveOutputProperties): JestFriendlyAssertion<StackInspector> {
  return new HaveOutputAssertion(props.outputName, props.exportName, props.outputValue);
}

function indent(n: number, s: string) {
  const prefix = ' '.repeat(n);
  return prefix + s.replace(/\n/g, '\n' + prefix);
}
