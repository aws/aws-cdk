import { Type } from 'jsii-reflect';
import { Linter } from '../linter';
export declare const noUnusedTypeLinter: Linter<{
    inspectedType: Type;
    usedTypes: Set<string>;
}>;
