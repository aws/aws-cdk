import { IGeneratable } from './generatable';
import { CM2 } from './cm2';
import { IType } from './type';
import { IValue } from './value';
export declare class L2 implements IGeneratable {
    readonly className: string;
    static define(className: string, cb: (x: L2) => void): L2;
    private readonly props;
    private readonly l1Props;
    constructor(className: string);
    addProperty(prop: PropertyProps): IValue;
    wire(props: Record<string, IValue>): void;
    generateFiles(): CM2[];
}
export interface PropertyProps {
    readonly name: string;
    readonly type: IType;
    readonly summary: string;
    readonly details?: string;
    readonly required: boolean;
    readonly defaultValue?: string;
    readonly defaultDescription?: string;
    readonly wire?: string;
}
