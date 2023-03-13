import { JestFriendlyAssertion } from '../assertion';
import { StackInspector } from '../inspector';
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
export declare function haveOutput(props: HaveOutputProperties): JestFriendlyAssertion<StackInspector>;
