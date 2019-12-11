import {Assertion} from "../assertion";
import {StackInspector} from "../inspector";

class HaveOutputAssertion extends Assertion<StackInspector> {
  constructor(private readonly outputName?: string, private readonly exportName?: string, private outputValue?: any) {
    super();
  }

  public get description(): string {
    return `output\
${this.outputName ? ' with name ' + this.outputName : ''}\
${this.exportName ? ' with export name ' + this.exportName : ''}\
${this.outputValue ? ' with value ' + JSON.stringify(this.outputValue) : ''}\
`;
  }

  public assertUsing(inspector: StackInspector): boolean {
    if (!this.outputName && !this.exportName) {
      throw new Error('At least one of [outputName, exportName] should be defined');
    }
    if (!('Outputs' in inspector.value)) {
      return false;
    }
    return (!this.outputName || this.checkOutputName(inspector)) &&
        (!this.exportName || this.checkExportName(inspector)) &&
        (!this.outputValue || this.checkOutputValue(inspector));
  }

  private checkOutputName(inspector: StackInspector): boolean {
    return !!this.outputName && (this.outputName in inspector.value.Outputs);
  }

  private checkExportName(inspector: StackInspector): boolean {
    let outputs;
    if (this.outputName) {
      outputs = [inspector.value.Outputs[this.outputName]];
    } else {
      outputs = Object.values(inspector.value.Outputs);
    }
    const outputWithExport = outputs.find((output: any) => {
      return output && output.Export && (output.Export.Name === this.exportName);
    });
    return !!outputWithExport;
  }

  private checkOutputValue(inspector: StackInspector): boolean {
    let output;
    if (this.outputName) {
      output = inspector.value.Outputs[this.outputName];
    } else {
      output = Object.values(inspector.value.Outputs).find((out: any) => {
        return out && out.Export && (out.Export.Name === this.exportName);
      });
    }
    return output ?
        JSON.stringify(output.Value) === JSON.stringify(this.outputValue) :
        false;

  }
}

/**
 * Interface for haveOutput function properties
 * NOTE that at least one of [outputName, exportName] should be provided
 * @property outputName   logical id of the output
 * @property exportName   name of the resource output to be exported for a cross-stack reference
 * @property outputValue  value of the output
 */
export interface HaveOutputProperties {
  outputName?: string,
  exportName?: string,
  outputValue?: any
}

/**
 * An assertion  to check whether Output with particular properties is present in a stack
 * @param props  properties of the Output that is being asserted against.
 *               Check ``HaveOutputProperties`` interface to get full list of available parameters
 */
export function haveOutput(props: HaveOutputProperties): Assertion<StackInspector> {
  return new HaveOutputAssertion(props.outputName, props.exportName, props.outputValue);
}
