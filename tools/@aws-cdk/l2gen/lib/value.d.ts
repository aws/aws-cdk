import { IType } from './type';
import { CM2, IRenderable, CodePart } from './cm2';
export interface IValue extends IRenderable {
    readonly type: IType;
    toString(): string;
}
export declare class ObjectLiteral implements IValue {
    readonly type: IType;
    private readonly fields;
    constructor(type?: IType);
    set1(key: string, value: IValue): void;
    set(fields: Record<string, IRenderable>): void;
    has(field: string): boolean;
    toString(): string;
    render(code: CM2): void;
}
export declare function objLit(xs: Record<string, IRenderable>): ObjectLiteral;
export declare function litVal(x: CodePart | CodePart[], type?: IType): IValue;
