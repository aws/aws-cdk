import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
interface ModuleLinterContext {
    readonly assembly: reflect.Assembly;
    readonly namespace: string;
}
export declare const moduleLinter: Linter<ModuleLinterContext>;
export {};
