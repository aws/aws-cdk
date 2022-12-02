import { IRenderable, CM2 } from './cm2';
import { IType } from './type';
export declare class Arguments implements IRenderable {
    readonly args: Argument[];
    arg(name: string, type: IType, options?: ArgumentOptions): this;
    render(code: CM2): void;
    docBlockLines(): string[];
    copy(): Arguments;
}
export interface ArgumentOptions {
    readonly required?: boolean;
    readonly defaultValue?: IRenderable;
    readonly summary?: string;
}
export interface Argument {
    readonly name: string;
    readonly type: IType;
    readonly required: boolean;
    readonly defaultValue?: IRenderable;
    readonly summary?: string;
}
