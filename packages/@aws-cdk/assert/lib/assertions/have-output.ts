import {Assertion} from "../assertion";
import {StackInspector} from "../inspector";

class HaveOutputAssertion extends Assertion<StackInspector> {
  constructor(private readonly outputName?: string, private readonly exportName?: any, private outputValue?: any) {
    super();
    if (!this.outputName && !this.exportName) {
      throw new Error('At least one of [outputName, exportName] should be provided');
    }
  }

  public get description(): string {
    const descriptionPartsArray = [
      'output',
      `${this.outputName ? ' with name ' + this.outputName : ''}`,
      `${this.exportName ? ' with export name ' + JSON.stringify(this.exportName) : ''}`,
      `${this.outputValue ? ' with value ' + JSON.stringify(this.outputValue) : ''}`
    ];
    return descriptionPartsArray.join();
  }

  public assertUsing(inspector: StackInspector): boolean {
    if (!('Outputs' in inspector.value)) {
      return false;
    }
    return (this.checkOutputName(inspector)) &&
        (this.checkExportName(inspector)) &&
        (this.checkOutputValue(inspector));
  }

  private checkOutputName(inspector: StackInspector): boolean {
    if (!this.outputName) {
      return true;
    }
    return this.outputName in inspector.value.Outputs;
  }

  private checkExportName(inspector: StackInspector): boolean {
    if (!this.exportName) {
      return true;
    }
    const outputs = Object.entries(inspector.value.Outputs)
        .filter(([name, ]) => !this.outputName || this.outputName === name)
        .map(([, value]) => value);
    const outputWithExport = this.findOutput(outputs);
    return !!outputWithExport;
  }

  private checkOutputValue(inspector: StackInspector): boolean {
    if (!this.outputValue) {
      return true;
    }
    const output = this.outputName ?
      inspector.value.Outputs[this.outputName] :
      this.findOutput(Object.values(inspector.value.Outputs));
    return output ?
        JSON.stringify(output.Value) === JSON.stringify(this.outputValue) :
        false;
  }

  private findOutput(outputs: any): any {
    const thisExportNameString = JSON.stringify(this.exportName);
    return outputs.find((out: any) => {
      return JSON.stringify(out.Export?.Name) === thisExportNameString;
    });
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

/**
 * An assertion  to check whether Output with particular properties is present in a stack
 * @param props  properties of the Output that is being asserted against.
 *               Check ``HaveOutputProperties`` interface to get full list of available parameters
 */
export function haveOutput(props: HaveOutputProperties): Assertion<StackInspector> {
  return new HaveOutputAssertion(props.outputName, props.exportName, props.outputValue);
}
