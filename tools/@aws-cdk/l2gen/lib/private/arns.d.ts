import { IRenderable } from "../cm2";
export declare function analyzeArnFormat(arnFormat: string): ArnFormat;
export interface ArnFormat {
    readonly service: string;
    readonly hasRegion: boolean;
    readonly hasAccount: boolean;
    readonly resourceParts: ResourcePart[];
}
export declare type ResourcePart = {
    readonly type: 'literal';
    readonly literal: string;
} | {
    readonly type: 'attr';
    readonly attr: string;
};
export declare function formatArnExpression(format: ArnFormat, stackVariable: IRenderable, fields: Record<string, IRenderable>): IRenderable;
export declare function splitArnExpression(format: ArnFormat, arnVariable: IRenderable, parsedVarName: IRenderable): {
    splitExpression: import("../value").IValue;
    splitFields: {
        [k: string]: IRenderable;
    };
};
