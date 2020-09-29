import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { CoreTypes } from './core-types';
export declare const constructLinter: Linter<ConstructReflection>;
export declare class ConstructReflection {
    readonly classType: reflect.ClassType;
    static findAllConstructs(assembly: reflect.Assembly): ConstructReflection[];
    static getFqnFromTypeRef(typeRef: reflect.TypeReference): string | undefined;
    readonly ROOT_CLASS: reflect.ClassType;
    readonly fqn: string;
    readonly interfaceFqn: string;
    readonly propsFqn: string;
    readonly interfaceType?: reflect.InterfaceType;
    readonly propsType?: reflect.InterfaceType;
    readonly initializer?: reflect.Initializer;
    readonly hasPropsArgument: boolean;
    readonly sys: reflect.TypeSystem;
    readonly core: CoreTypes;
    constructor(classType: reflect.ClassType);
    private tryFindInterface;
    private tryFindProps;
}
