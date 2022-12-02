import { IType } from './type';
import { IRenderable, CM2 } from './cm2';
export declare abstract class WithMembers implements IRenderable {
    propExp(propName: string): IRenderable;
    callExp(fnName: string): (...args: IRenderable[]) => IRenderable;
    abstract render(code: CM2): void;
}
export declare function withMembers<A extends IRenderable>(x: A): A & WithMembers;
export declare const CONSTRUCT: import("./type").StandardType & WithMembers;
export declare const RESOURCE: import("./type").StandardType & WithMembers;
export declare const STACK: import("./type").StandardType & WithMembers;
export declare const IRESOURCE: import("./type").StandardType;
export declare const DURATION: import("./type").StandardType & WithMembers;
export declare const ARN: import("./type").StandardType & WithMembers;
export declare const ARN_FORMAT: import("./type").StandardType & WithMembers;
export declare const LAZY: import("./type").StandardType & WithMembers;
export declare const FN: import("./type").StandardType & WithMembers;
export declare const TOKENIZATION: import("./type").StandardType & WithMembers;
export declare function factoryFunction(type: IType): IType;
