import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { ResourceReflection } from './resource';
export declare const importsLinter: Linter<ImportsReflection>;
declare class ImportsReflection {
    readonly resource: ResourceReflection;
    readonly fromMethods: reflect.Method[];
    readonly prefix: string;
    readonly fromAttributesMethodName: string;
    readonly fromAttributesMethod?: reflect.Method;
    readonly attributesStructName: string;
    readonly attributesStruct?: reflect.InterfaceType;
    constructor(resource: ResourceReflection);
}
export {};
