import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
export declare const integrationLinter: Linter<IntegrationReflection>;
declare class IntegrationReflection {
    readonly integrationInterface: reflect.InterfaceType;
    static isIntegrationInterface(x: reflect.InterfaceType): boolean;
    constructor(integrationInterface: reflect.InterfaceType);
    get bindMethod(): reflect.Method;
}
export {};
