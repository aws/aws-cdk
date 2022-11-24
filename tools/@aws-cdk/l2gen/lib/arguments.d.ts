import { IRenderable, CM2 } from './cm2';
import { IType } from './type';
import { IValue } from './value';
export declare class Arguments implements IRenderable {
    private readonly args;
    arg(name: string, type: IType, options?: ArgumentOptions): this;
    render(code: CM2): void;
    copy(): Arguments;
}
export interface ArgumentOptions {
    readonly required?: boolean;
    readonly defaultValue?: IValue;
}
