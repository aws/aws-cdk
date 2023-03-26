import { CloudAssembly } from '@aws-cdk/cx-api';
import { Stack } from '../lib';
export declare function toCloudFormation(stack: Stack): any;
export declare function reEnableStackTraceCollection(): string | undefined;
export declare function restoreStackTraceColection(previousValue: string | undefined): void;
export declare function getWarnings(casm: CloudAssembly): {
    path: string;
    message: string;
}[];
